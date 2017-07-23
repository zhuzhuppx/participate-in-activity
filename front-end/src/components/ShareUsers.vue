<style lang="less" >
.ivu-table .demo-table-error-row td {
    background-color: #ff6600!important;
    color: #fff;
}

.container {
    .table {
        th {
            text-align: center!important;
        }
    }
}
.form-footer{text-align: right;}
</style>

<template>
<div class="container">
  <div class="tool-bar">
      <ul>

          <li>
              <Input v-model="searchName" placeholder="请输入姓名" @on-enter="loadData">
              <Button slot="append" icon="ios-search" @click="loadData"></Button>
              </Input>
          </li>
      </ul>
      <div class="clearFix"></div>
  </div>
  <Table stripe :row-class-name="rowClassName" :columns="fields" :data="items"></Table>
  <div style="margin: 10px;overflow: hidden">
    <div style="float: right;">
      <Page :show-total="true" :total="page.total" :page-size="page.pageSize" :current="page.pageNumber" @on-change="changePage"></Page>
    </div>
  </div>
  <Modal v-model="showDialog" title="编辑">
    <Form :model="currrentRow" :label-width="80">
      <Form-item label="姓名">
        <Input disabled v-model="currrentRow.userName"></Input>
      </Form-item>
      <Form-item label="手机号">
        <Input disabled v-model="currrentRow.userPhone"></Input>
      </Form-item>
      <Form-item label="点赞数">
        <Input-number :min="1" v-model="currrentRow.praiseNum"></Input-number>
      </Form-item>
      <Form-item label="状态">
        <Select v-model="currrentRow.status" style="width:200px">
                    <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
      </Form-item>
      <Form-item label="修改人">
        <Input v-model="currrentRow.modifyUser" placeholder="请输入修改人姓名"></Input>
      </Form-item>
      <div class="form-footer">
        <Button type="primary" @click="updateStatus">提交</Button>
        <Button type="ghost" @click="showDialog=false" style="margin-left: 8px">取消</Button>
      </div>
    </Form>
    <div slot="footer">
    </div>
  </Modal>
</div>
</template>

<script>
import {
  loadShareUsers,
  updateShareUser
}
from '../service/services.js'
import momnet from 'moment'
export default {
  data() {
    return {
      searchName:'',
      page: {
        pageNumber: 1,
        pageSize: 20,
        pageCount: 1,
        total: 1
      },
      currrentRow: {
        userName: null,
        userPhone: null,
        receiveTime: null,
        shareTime: null,
        praiseNum: 0,
        praiseId: null,
        status: null,
        modifyUser: null
      },
      showDialog: false,
      statusList: [{
        label: '未领取',
        value: '未领取'
      }, {
        label: '待领取',
        value: '待领取'
      }, {
        label: '已领取',
        value: '已领取'
      }],
      items: [],
      fields: [{
        type: 'index',
        width: 60,
        align: 'center'
      }, {
        title: '姓名',
        key: 'userName'
      }, {
        title: '分享时间',
        key: 'shareTime',
        render: function(h, params) {
          if (!!!params.row.shareTime) {
            return '';
          }
          return momnet(params.row.shareTime).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '点赞数',
        key: 'praiseNum'
      }, {
        title: '状态',
        key: 'status'
      }, {
        title: '领取时间',
        key: 'receiveTime',
        render: function(h, params) {
          if (!!!params.row.receiveTime) {
            return '';
          }
          return momnet(params.row.receiveTime).format('YYYY-MM-DD HH:mm:ss')
        }
      }, {
        title: '操作人',
        key: 'modifyUser'
      }, {
        title: '操作',
        key: 'id',
        width: 120,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small',
                disabled: params.row.status === '已领取'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.showDialog = true;
                  this.currrentRow = params.row;
                }
              }
            }, '修改'),
          ]);
        }
      }]
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    rowClassName(row, index) {
      if (row.status == '已领取') {
        return 'demo-table-error-row';
      }
      return '';
    },
    changePage(page) {
      this.page.pageNumber = page;
      this.loadData();
    },
    async loadData() {
      let res = await loadShareUsers({
        id: this.$route.params.id,
        userName:this.searchName,
        page: this.page
      });
      res = res.data;
      this.items = res.rows;
      this.page.total = res.total;
    },
    async updateStatus() {
      if (!!!this.currrentRow.modifyUser) {
        this.$Message.error('请输入操作人姓名！');
      } else {
        let res = await updateShareUser(this.currrentRow);
        this.currrentRow.receiveTime=res.data.receiveTime;
        this.items = this.items;
        this.showDialog = false;
      }
    }
  },
  components: {}
}
</script>
