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
                        <a>
                            <Button type="primary" style="width:100px;" @click="opensign">签署</Button>
                        </a>
                    </div>
                    <transition name="fade">
                        <div class="cover" v-if="signResult"></div>
                    </transition>
                    <transition name="slide" v-if="signResult">
                        <nav class="nav">
                            <div class="nav_top">
                                <span>签署结果</span>
                                <span><Icon type="ios-close" style="font-size:30px;" @click="closeBtn" /></span>
                            </div>
                            <div>
                                <img src="../assets/img/success.png" alt="" style="width:100px;margin-top:30px;">
                                <p>签署成功</p>
                            </div>
                        </nav>
                    </transition>    
                    <transition name="fade">
                        <div class="cover" v-if="falseResult"></div>
                    </transition>
                    <transition name="slide" v-if="falseResult">
                        <nav class="nav">
                            <div class="nav_top">
                                <span>签署结果</span>
                                <span><Icon type="ios-close" style="font-size:30px;" @click="closefalseBtn" /></span>
                            </div>
                            <div>
                                <img src="../assets/img/error.png" alt="" style="width:100px;margin-top:20px;">
                                <p>签署失败</p>
                                <div style="margin-top:10px;">
                                    <Button type="primary" @click="closefalseBtn">重新签署</Button>
                                </div>
                            </div>
                        </nav>
                    </transition>  
                    <Modal v-model="Suresign" width="360" @on-ok="sign" @on-cancel="cancelsign" :loading="loading">
                            <p slot="header" style="color:#000;text-align:left;font-size:15px;">
                                <span>合同签署</span>
                            </p>
                            <div style="text-align:center;font-size:13px;">
                                <p><span style="margin-right:10px;">启用日期：</span><span><DatePicker type="date" :value="begin" @on-change="beginTime" placeholder="请选择合同开始时间" style="width: 200px"></DatePicker></span></p>
                                <p style="margin-top:10px;"><span style="margin-right:10px;">结束日期：</span><span><DatePicker type="date" :value="end" @on-change="endTime" placeholder="请选择合同结束时间" style="width: 200px"></DatePicker></span></p>
                            </div>
                        </Modal>              
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff',height:'100vh',}">
                         <div class="main">
                             <div class="main_left">
                                 <img :src="this.FactorySign" alt="" style="width:200px;">
                             </div>
                             <div class="main_center animated bounceInRight">
                                 <img :src="this.pathUrl[this.Judgenum]" alt="">
                             </div>
                             <div class="main_right">
                                 <span v-for="(item,index) in this.pathUrl" :key='index'>
                                     <img :src="item" alt="" style="width:150px;" @click="checkNum(index)">
                                 </span>
                             </div>
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
                contractUrl:'',
                contractPdfName:'',
                elecSignatureUid:'',
                limit:10,
                page:1,
                content:'',
                loading:true,
                showNo:true,        
                FactorySign:'',//存放工厂签章
                Judgenum:0,
                userDetail:'', 
                userUid:'',
                contractCourseUid:'',
                signResult:false,
                falseResult:false,
                Suresign:false,
                begin:'',
                end:'',
                pathUrl:[],
            }
        },
        created () {
           this.factoryUid = window.localStorage.getItem('factoryUid')
           this.contractUrl = window.localStorage.getItem('urlPath')
           this.contractPdfName = window.localStorage.getItem('urlPdfName')
           this.contractCourseUid = window.localStorage.getItem('contractCourseUid')
           this.userUid = this.$route.query.userUid
           let imgSrc = window.localStorage.getItem('pathUrl')
           let NewimgSrc = imgSrc.split(",")
           for( let i=0;i<NewimgSrc.length;i++){
               this.pathUrl.push(NewimgSrc[i])
           }
        },        
        components:{
            TopHeader
        },
        mounted () {
            this.JudgeFactorySign();
            // console.log(this.pathUrl,"pathUrl")
        },
        methods:{   
            JudgeFactorySign () {
                request.get("/factoryContract/selectFactorySign", {
                    factoryUid:this.factoryUid,
                })
                .then(response => {
                    if(response.data.code === 200){
                        this.FactorySign = response.data.data.elecSignature.elecSeal
                        this.elecSignatureUid = response.data.data.elecSignature.elecSignatureUid
                        if(this.FactorySign === '' || this.FactorySign === undefined){
                            this.getFactorySign();
                        }
                    }else{
                        return    
                    }
                })
                .catch(ex => {
                console.log(ex,"rex")
                });                 
            },
            getFactorySign () {
                request.post("/factoryContract/updateFactorySign", {
                    factoryUid:this.factoryUid,
                })
                .then(response => {
                    if(response.data.code === 200){
                        this.FactorySign = response.data.data.sealData
                        this.elecSignatureUid = response.data.data.elecSignatureUid
                    }else{
                        return    
                    }
                })
                .catch(ex => {
                console.log(ex,"rex")
                });                  
            },
            checkNum (index) {
                this.Judgenum = index
            },
            beginTime (val) {
                this.begin = val
            },
            endTime (val) {
                this.end = val
            },
            opensign () {
                this.Suresign = true
            },
            cancelsign () {
                this.Suresign = false
                this.begin = ''
                this.end = ''
            },
            sign () {
                if(this.begin === '' || this.begin === null){
                    this.$Message.error('开始日期不能为空');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                if(this.end === '' || this.end === null){
                    this.$Message.error('结束日期不能为空');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                request.post("/factoryContract/updateContractOne", {
                    elecSignatureUid:this.elecSignatureUid,
                    elecX:410,
                    elecY:200,
                    pageNum:this.Judgenum+1,
                    begin:this.begin,
                    end:this.end,
                    contractCourseUid:this.contractCourseUid,
                    factoryUid:this.factoryUid,
                    userUid:this.userUid,
                    contractUrl:this.contractUrl,
                    contractPdfName:this.contractPdfName,
                })
                .then(response => {
                    if(response.data.code === 200){
                        this.Suresign = false
                        console.log(response,"ressign")
                        this.signResult = true
                    }else{
                        this.falseResult = true
                    }
                })
                .catch(ex => {
                console.log(ex,"rex")
                });                  
            },
            closeBtn () {
                this.signResult = false
                setTimeout(() =>{
                    this.$router.push({path:'/Cmanager'})
                },1000)
            },
            closefalseBtn () {
                this.falseResult = false
            },
            back () {
                this.$router.go(-1)
            },          
            gotoPage (val) {
                this.$router.push({path: val})
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
    margin-top: 10px;
}
.main_top>a:nth-child(1){
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
.main_top>a:nth-child(1)>img{
    width: 17px;
    height:17px;
}
.main_top>a:nth-child(2){
    display: inline-block;
    width: 200px;
    height: 50px;
    line-height: 50px;
    text-align: right;
    float: right;
    padding-right: 50px;
}
.main{
    width: 100%;
    min-width: 1050px;
    height:100%;
    background: #f5f7f9;
}
.main_left{
    width: 20%;
    height:100%;    
    float: left;
    background: #fff;
    padding:10px;
}
.main_center{
    width: 58%;
    height:100%;
    background: #fff;
    float: left;
    margin:0 10px;
    padding-bottom: 200px;
    overflow-y:scroll;
}
.main_right{
    width: 20%;
    height:100%;
    background: #fff;
    float: left;
    overflow-y:scroll;
    padding-bottom: 200px;
}
.main_right>span{
    display: inline-block;
    width: 160px;
    border:3px solid #2d8cf0;
    cursor: pointer;
    margin-top: 20px;
}
.main_right>span:hover{
    display: inline-block;
    width: 180px;
    border:3px solid #2d8cf0;
    cursor: pointer;
    margin-top: 20px;
    box-shadow: 3px 3px 10px #000;
}
.cover {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.fade-enter-active {
  animation: fadeIn 400ms;
}
.fade-leave-active {
  animation: fadeOut 400ms;
}
@keyframes slideIn {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translatey(0%);
  }
}
@keyframes slideOut {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(100%);
  }
}
.slide-enter-active {
  animation: slideIn 400ms;
}
.slide-leave-active {
  animation: slideOut 400ms;
}
.nav{
  width: 400px;
  height: 250px;
  position: fixed;
  left: 40%;
  top: 30%;
  border: 1px solid #f5f5f5;
  border-radius: 6px;
  box-sizing: border-box;
  background: #fff;
  z-index: 2000;
}
.nav_top{
    width: 100%;
    height:50px;
    line-height: 50px;
    border-bottom: 1px solid #ccc;
}
.nav_top>span:nth-child(1){
    display: inline-block;
    width: 50%;
    height: 50px;
    line-height: 50px;
    padding:0 20px;
    font-size: 15px;
    font-weight: bold;
    text-align: left;
    float: left;
}
.nav_top>span:nth-child(2){
    display: inline-block;
    height: 50px;
    line-height: 50px;
    padding:0 20px;
    font-size: 15px;
    font-weight: bold;
    text-align: right;
    float: right;
}
</style>