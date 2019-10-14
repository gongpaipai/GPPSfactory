<template>
    <div class="layout">
        <Layout>
            <TopHeader></TopHeader>
            <Layout>
                <Sider hide-trigger>
                        <Menu :theme="theme3" :active-name="activeTitle" accordion  :open-names="openList" @on-select="gotoPage" style="width:240px;text-align:left;color:#8F98AA;">
                                <MenuItem v-for="(menu,j) in menu" :name="menu.menuUrl" :key="j">
                                    <Icon :type="menu.icon" />
                                    {{menu.menuName}}
                                </MenuItem>
                        </Menu>
                </Sider>
                <Layout :style="{padding: '0 24px 24px'}">
                    <div class="main_top">
                        <a @click="back">
                            <div style="display:inline-block;float:left;width:20px;height:100%;padding-top:3px;margin-right:5px;">
                                <img src="../assets/img/back.png" alt="">
                            </div>
                            <span>返回</span>
                        </a>
                    </div>
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff',height:'100vh',marginTop:'10px',}">
                        <div style="max-height:620px">
                            <table class="table">
                                <tr style="border-bottom:1px solid #DEE2ED;">
                                    <th style="width:200px;">签署对象</th>
                                    <th>身份证号</th>
                                    <th>签署工种</th>
                                    <th>联系方式</th>
                                    <th style="width:300px;text-align:center;">操作</th>
                                </tr>
                                <tr class="trow"  v-if="showNo">
                                    <td class="Timg">
                                        <span><img src="../assets/img/person.png" style="width:25px;" alt=""></span> 
                                        <span>{{this.userDetail.userName}}</span>
                                    </td>
                                    <td>{{this.userDetail.cardUid}}</td>
                                    <td>{{this.userDetail.worker}}</td>
                                    <td>{{this.userDetail.userPhone}}</td>
                                    <td class="Tbutton" style="padding:0 65px;">
                                        <Button type="primary" @click="goSign">签章</Button>
                                    </td>
                                </tr>

                            </table>  
                        </div>  
                        <div class="showNothing" v-if="!showNo">
                                <img src="../assets/img/without.png" alt="" style="width:400px;">
                                <span>暂无记录</span>
                        </div>                                                                          
                    </Content> 
                </Layout>
            </Layout>
            
        </Layout>
    </div>
</template>
<script>
import TopHeader from "@/components/TopHeader";
import request from "@/units/request";
    export default {
        data () {
            return {
                openList:[],
                activeTitle:'Cmanager',
                theme3:'light',
                value:2,
                model1:1,
                memberList: [
                    {
                        value: 1,
                        label: '全部'
                    }
                ],
                menu: [
                {
                    menuName: '员工管理',
                    menuUrl: '/',
                    childMenu: [],
                    icon:'md-person',
                },
                {
                    menuName: '合同模板',
                    menuUrl: 'Ctemplate',
                    childMenu: [],
                    icon:'ios-square',
                },
                {
                    menuName: '合同管理',
                    menuUrl: 'Cmanager',
                    childMenu: [],
                    icon:'md-albums',
                },
                {
                    menuName: '人脸识别记录',
                    menuUrl: 'FaceRecord',
                    childMenu: [],
                    icon:'logo-hackernews',
                },
                ],     
                factoryUid:'',
                limit:10,
                page:1,
                content:'',
                loading:true,
                showNo:true,         
                userDetail:'', 
                userUid:'',
            }
        },
        created () {
            this.factoryUid = window.localStorage.getItem('factoryUid')
            this.userDetail = this.$route.query
            this.userUid = this.$route.query.userUid
            if(this.userDetail === '' || this.userDetail === null){
                this.showNo = false
            }
        },        
        components:{
            TopHeader
        },
        mounted () {
            console.log(this.userDetail,this.$route,this.userUid)
        },
        methods:{   
            back () {
                this.$router.go(-1)
            },          
            gotoPage (val) {
                console.log(val)
                this.$router.push({path: val})
            },
            goSign () {
                this.$router.push({path:'/sign?userUid='+this.userUid})
            },
        },
    }
</script>
<style scoped>
::-webkit-input-placeholder { /* WebKit browsers */
  color: #D8DBE1;
  font-size: 12px;
}

::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #D8DBE1;
  font-size: 12px;
}

:-ms-input-placeholder { /* Internet Explorer 10+ */
  color: #D8DBE1;
  font-size: 12px;
} 
.ivu-icon{
    font-size:20px;
}
.table{
    width: 100%;
    max-height:520px;
    border-collapse:collapse;
}
.table>tr>th{
    height: 50px;
    white-space: nowrap;
    overflow: hidden;
    background-color: #fff;
}
.table>tr{
    border-bottom:1px solid #ccc;
}
.table>tr>td{
    height:50px;
}
.trow:hover{
    background: #fff;
    box-shadow: 1px 1px 10px #ccc;
}
.Timg>span:nth-child(1){
    display: inline-block;
    width: 50%;
    height:50px;
    float: left;
}
.Timg>span:nth-child(1)>img{
    width: 24px;
    margin-top: 16px;
}
.Timg>span:nth-child(2){
    display: inline-block;
    width: 50%;
    height:50px;
    line-height: 50px;
    text-align: left;
    float: left;
}
.ivu-layout-sider{
    width: 240px !important;
    flex: none !important;
    min-width: 240px !important;
    max-width: 240px !important;
    background: #fff !important;
}
.ivu-menu-item{
    text-align: left;
    padding-left: 50px;
}
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    min-width: 900px;
    height:100vh;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
.main_top{
    width: 100%;
    height:50px;
    background: #fff;
    border-bottom:1px solid #f5f5f5;
}
.main_top>a{
    display: inline-block;
    width: 100px;
    height:50px;
    line-height: 50px;
    text-align: left;
    color:#8A93A6;
    font-size: 12px;
    padding-left: 20px;
    float: left;
}
.main_top>a>img{
    width: 17px;
    height:17px;
}
.showNothing{
    width: 100%;
    margin-top: 40px;
    text-align: center;
}
.showNothing>span{
    display: block;
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
}
</style>