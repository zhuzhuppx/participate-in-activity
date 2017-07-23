<style media="screen" lang="less">

.hello {
    font-size: 1.2em;
    // padding: 64px;
    .form-footer {
        padding: 64px;
    }
    .form-div{
      padding:32px;
      border:1px solid #eee;
    }
}

</style>

<template>

<div class="hello">
    <div class="info">
        <Alert show-icon>
            <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
            <template slot="desc"> 感谢您参加本次活动，请输入您的相关信息，以方便我们更好的为您服务，谢谢！
            </template>
        </Alert>
    </div>
    <div class="form-div">
      <Form ref="form" :model="form" :label-width="80">
        <Input v-model="form.name" placeholder="请输入姓名……"></Input>
        <br>
        <br>
        <Input v-model="form.phone" placeholder="请输入手机号码……"></Input>
        <div class="form-footer">
          <Button type="primary" @click="handleSubmit('form')">提交</Button>
          <Button type="ghost" @click="handleReset('form')" style="margin-left: 8px">重置</Button>
        </div>
      </Form>

    </div>
</div>

</template>

<script>

import {
    typePhone
}
from '../service/services.js'
export default {
    name: 'hello',
    data() {
        return {
            form: {
                name: '',
                phone: ''
            }
        }
    },
    mounted() {


    },
    methods: {
        async handleSubmit(name) {
                var flg = false;
                if (this.form.name === '') {
                    this.$Message.error('请输入姓名');
                    flg = false;
                } else {
                    flg = true;
                }
                if (this.form.phone === '') {
                    this.$Message.error('请输入手机号');
                    flg = false;
                } else {
                    var myreg = /^\d{11}$/;
                    if (!myreg.test(this.form.phone)) {
                        this.$Message.error('请输入正确的手机号');
                        flg = false;
                    } else {
                        flg = true;
                    }
                }
                if (flg) {
                    let res = await typePhone(Object.assign({
                        id: this.$route.query.id,
                        link: this.$route.query.link
                    }, this.form));
                    res = res.data;
                    if (res.already === true) {
                        this.$router.push({
                            path: '/Already'
                        });
                    } else {
                        this.$Message.info('即将为您跳转到需要集赞的网页,分享后集赞即可领取礼物哦！');
                        let link = this.$route.query.link;
                        setTimeout(function() {
                            window.location.href = (link) ;
                        }, 3000);
                    }
                }
            },
            handleReset(name) {
              for (var v in this.form) {
                this.form[v]=null;
              }
            }
    }
}

</script>
