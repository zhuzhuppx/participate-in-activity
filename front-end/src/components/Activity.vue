<style lang="less" >





.qr-code {
    text-align: center;
    svg {
        width: 200px;
        height: 200px;
    }
}

</style>

<template>

<div class="container">
    <div class="tool-bar">
        <ul>
            <li>
                <Button type="ghost" icon="plus" @click="addActivityDialog=true"></Button>
            </li>
            <li>
                <Input v-model="searchName" placeholder="请输入活动名称" @on-enter="loadData">
                <Button slot="append" icon="ios-search" @click="loadData"></Button>
                </Input>
            </li>
        </ul>
        <div class="clearFix"></div>
    </div>
    <Table stripe :columns="fields" :data="items"></Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :show-total="true" :total="page.total" :page-size="page.pageSize" :current="page.pageNumber" @on-change="changePage"></Page>
        </div>
    </div>
    <Modal title="查看二维码" v-model="showDialog" :closable="true">
        <div class="qr-code" v-html="qrCode">

        </div>
        <div slot="footer">
        </div>
    </Modal>
    <Modal title="新增活动" v-model="addActivityDialog" :closable="true">
        <Form :model="form" :label-width="80">
            <Form-item label="活动名称">
                <Input v-model="form.activityName" placeholder="请输入活动名称"></Input>
            </Form-item>
            <Form-item label="开始时间">
                <Date-picker type="datetime" @on-change="handleChange1" @on-clear="handleClear(1)" :value="startDate" placeholder="选择开始时间" style="width: 200px"></Date-picker>
            </Form-item>
            <Form-item label="结束时间">
                <Date-picker type="datetime" @on-change="handleChange2" @on-clear="handleClear(2)" :value="startDate" placeholder="选择结束时间" style="width: 200px"></Date-picker>
            </Form-item>
            <Form-item label="链接">
                <Input v-model="form.activityLink" placeholder="请输入活动链接"></Input>
            </Form-item>
            <Form-item>
                <Button type="primary" @click="addActivity">提交</Button>
                <Button type="ghost" style="margin-left: 8px" @click="addActivityDialog=false">取消</Button>
            </Form-item>
        </Form>
        <div slot="footer">
        </div>
    </Modal>
</div>

</template>

<script>

import {
    getQrCode,
    loadActivities,
    addActivity
}
from '../service/services'
import momnet from 'moment'

export default {
    data() {
            return {
                addActivityDialog: false,
                showDialog: false,
                qrCode: '',
                searchName: '',
                items: [],
                startDate: null,
                endDate: null,
                form: {
                    activityName: null,
                    activityStartDate: null,
                    activityEndDate: null,
                    activityLink: null
                },
                fields: [{
                    type: 'index',
                    width: 60,
                    align: 'center'
                }, {
                    title: '活动名称',
                    key: 'activityName'
                }, {
                    title: '开始日期',
                    key: 'activityStartDate',
                    render: function(h, params) {
                        if (!!!params.row.activityStartDate) {
                            return '';
                        }
                        return momnet(params.row.activityStartDate).format('YYYY-MM-DD HH:mm:ss')
                    }
                }, {
                    title: '结束日期',
                    key: 'activityEndDate',
                    render: function(h, params) {
                        if (!!!params.row.activityEndDate) {
                            return '';
                        }
                        return momnet(params.row.activityEndDate).format('YYYY-MM-DD HH:mm:ss')
                    }
                }, {
                    title: '链接',
                    key: 'activityLink',
                    ellipsis: true
                }, {
                    title: '操作',
                    key: 'id',
                    width: 200,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.getQrCode(params.row);
                                    }
                                }
                            }, '二维码'),
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                      var url = window.location.href;
                                      if(url.indexOf('Activity')>-1){
                                          url = window.location.href.replace('Activity', 'ShareUsers') + '/' + params.row._id;
                                      }else{
                                        url = window.location.href + 'ShareUsers/' + params.row._id;
                                      }
                                        window.open(url);
                                    }
                                }
                            }, '查看'),
                        ]);
                    }
                }],
                page: {
                    pageNumber: 1,
                    pageSize: 20,
                    pageCount: 1,
                    total: 1
                }
            }
        },
        created() {
            this.loadData();
        },
        methods: {
            changePage(page) {
                    this.page.pageNumber = page;
                    this.loadData();
                },
                async getQrCode(data) {
                    let res = await getQrCode({
                        id: data._id,
                        link: data.activityLink
                    });
                    this.qrCode = res.data;
                    this.showDialog = true;
                },
                async loadData() {
                    let res = await loadActivities({
                        activityName: this.searchName,
                        page: this.page
                    });
                    res = res.data;
                    this.items = res.rows;
                    this.page.total = res.total;
                },
                async addActivity() {
                    let subject = this.form.activityLink;
                    if (/\b(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[\-A-Z0-9+&@#\/%=~_|$?!:,.]*[A-Z0-9+&@#\/%=~_|$]/i.test(subject)) {
                        let res = await addActivity(this.form);
                        this.$Message.success('添加成功！');
                        this.addActivityDialog = false;
                        this.page.pageNumber = 1;
                        this.loadData();
                    } else {
                        this.$Message.error('您输入的不是一个正确的链接！');
                    }
                },
                handleChange1(date) {
                    this.form.activityStartDate = date;
                },
                handleChange2(date) {
                    this.form.activityEndDate = date;
                },
                handleClear(flg) {
                    switch (flg) {
                        case 1:
                            this.form.activityStartDate = null;
                            break;
                        case 2:
                            this.form.activityEndDate = null;
                            break;
                    }
                }
        },
        components: {}
}

</script>
