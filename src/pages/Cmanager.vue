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
                        <a>合同管理</a>
                    </div>
                    <div class="main_center">
                        <div class="center_left">
                            <Input prefix="ios-search" placeholder="请输入搜索内容" style="width: 250px;" v-model="search" />
                            <Button type="primary" @click="searchSelect">搜索</Button>
                        </div>
                        <div class="center_right">
                            <Button  class="butt" type="primary" @click="Scontract"><Icon type="md-add" style="font-size:15px;"/>签署合同</Button>
                        </div>
                    </div>
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff',height:'100vh',marginTop:'10px',}">
                        <div style="max-height:620px;overflow-y:scroll;">
                            <table class="table">
                                <tr style="border-bottom:1px solid #DEE2ED;">
                                    <th style="width:200px;">签署人</th>
                                    <th>合同名称</th>
                                    <th style="width:200px;">签署岗位</th>
                                    <th>
                                        <Dropdown>
                                            <a href="javascript:void(0)">
                                                状态
                                                <Icon type="ios-arrow-down" style="font-size:15px;"></Icon>
                                            </a>
                                            <DropdownMenu slot="list">
                                                <DropdownItem>工人待签署</DropdownItem>
                                                <DropdownItem>工厂待签署</DropdownItem>
                                                <DropdownItem>签署完成</DropdownItem>
                                                <DropdownItem>已过期</DropdownItem>
                                                <DropdownItem>已作废</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </th>
                                    <th>合同创建时间</th>
                                    <th style="width:300px;text-align:center;">操作</th>
                                </tr>
                                <tr class="trow" v-for="(item,index) in this.content.contractWorkerList" :key='index' v-if="showNo">
                                    <td class="Timg">
                                        <span><img src="../assets/img/person.png" style="width:25px;" alt=""></span> 
                                        <span>{{item.userName}}</span>
                                    </td>
                                    <td>{{item.contractName}}</td>
                                    <td>{{item.worker}}</td>
                                    <td v-if="item.contractStatus === 0" style="color:red;">工人待签署</td>
                                    <td v-if="item.contractStatus === 1" style="color:red;">工厂待签署</td>
                                    <td v-if="item.contractStatus === 2" style="color:green;">签署完成</td>
                                    <td v-if="item.contractStatus === 3" style="color:gray;">已过期</td>
                                    <td v-if="item.contractStatus === 4" style="color:red;">已作废</td>
                                    <td>{{item.contractDate}}</td>
                                    <td class="Tbutton" style="padding:0 50px 0 65px;">
                                        <a></a>
                                    </td>
                                </tr>

                            </table>  
                        </div>  
                        <div class="showNothing" v-if="!showNo">
                                <img src="../assets/img/without.png" alt="" style="width:400px;">
                                <span>暂无记录</span>
                        </div>   
                        <!-- 添加合同模板 -->
                        <Modal
                            v-model="showstep"
                            title="签署合同"  
                            width="400">
                            <div class="step" v-show="Judgestep">
                                <div style="width:100%;height:40px;padding:0 40px 0 50px;">
                                    <Steps :current="0">
                                        <Step title="上传合同"></Step>
                                        <Step title="选择签署人"></Step>
                                    </Steps>
                                </div>
                                <div class="upload" @click="openFile" v-show="showFile">
                                    <span><img src="../assets/img/add.png" alt="" style="width:56px;margin-top:60px;"></span>
                                    <span>点击上传文件</span>
                                </div>
                                <input type="file" accept="application/pdf,application/msword" @change="changepic($event)" id="addFile" style="display:none;">
                                <div class="upload"  v-show="!showFile">
                                    <span><Icon type="ios-folder-open" style="font-size:56px;" /></span>
                                    <span>{{this.Filename}}</span>
                                </div>
                                
                            </div>
                            <div class="step2" v-show="!Judgestep">
                                <div style="width:100%;height:40px;padding:0 40px 0 50px;">
                                    <Steps :current="1">
                                        <Step title="上传合同"></Step>
                                        <Step title="选择签署人"></Step>
                                    </Steps>
                                </div>
                                <div class="usedetails">
                                    <Select v-model="model1" style="width:100px;">
                                        <Option v-for="item in memberList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                    <input type="text" style="width:200px;height:30px;margin-left:15px;border:1px solid #ccc;border-radius:3px;padding-left:10px;" placeholder="请输入要搜索的内容">
                                </div>
                                <div class="alert">
                                    <div class="usemain" v-for="(item,index) in this.PersonList.userContracts" :key='index'>
                                        <span>
                                            <Radio @on-change="Checkbox(item.userUid,item.userName,item.worker,item.factoryWorkerUid,item.userPhone,item.cardUid,item.contractCourseUid)"></Radio>
                                        </span>
                                        <span>
                                            <div style="width:50px;height:40px;display: inline-block;float:left;">
                                                <img src="../assets/img/person.png" alt="" style="width:30px;margin-top:5px;">
                                            </div>
                                            <div style="height:40px;display: inline-block;float:left;">
                                                <span>{{item.userName}}</span>
                                            </div>
                                        </span>
                                        <span>
                                            <Button style="color:#2d8cf0;background:#f5f5f5;border:1px solid #f5f5f5;">{{item.worker}}</Button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div slot="footer" v-if="step === 1">
                                    <Button size="large" @click="cancelStep">取消</Button>
                                    <Button type="primary" size="large" @click="nextStep">下一步</Button>
                            </div>
                            <div slot="footer" v-if="step === 2">
                                    <Button size="large" @click="backStep">上一步</Button>
                                    <Button type="primary" size="large">确定</Button>
                            </div>
                        </Modal>  
                        <Page :total="this.content.total"
                        :current="1"
                        show-total show-sizer show-elevator
                        @on-change="pageChange"
                        @on-page-size-change="pageSizeChange"
                        style="margin-top:10px;"
                        />                                                                              
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
                showstep:false,
                showFile:true,
                Filename:'',
                Filecontent:'',//存放上传文件返回信息
                JudgeFile:false,//判断合同是否上传
                step:1,
                Judgestep:true,//判断步骤，true为第一步，false为第二步
                PersonList:'',     
                pathUrl:[], 
                queries:'',
                search:'',    
            }
        },
        created () {
            this.factoryUid = window.localStorage.getItem('factoryUid')
        },        
        components:{
            TopHeader
        },
        mounted () {
           this.getData();
        },
        methods:{   
            searchSelect () {
               this.queries = this.search
               this.getData();
            },             
            getData () {
                request.get("/factoryContract/selectContractWorkerList", {
                    factoryUid:this.factoryUid,
                    queries:this.queries,
                    pageNumStr:this.limit,
                    pageIntStr:this.page,
                })
                .then(response => {
                    if(response.data.code === 200){
                        this.content = response.data.data
                        console.log(this.content)
                        if(this.content.contractWorkerList.length === 0){
                            this.showNo = false
                        }
                    }else{
                        return    
                    }
                })
                .catch(ex => {
                console.log(ex,"rex")
                });                 
            },
            Scontract () {
                this.showstep = true
            },
            cancelStep () {
                this.showstep = false
            },
            nextStep () {
                if(this.JudgeFile === false){
                    this.$Message.warning('请先上传文件');
                    return
                }
                this.step = 2
                this.Judgestep = false
                this.getPerson();
            },
            backStep () {
                this.step = 1
                this.Judgestep = true
            },
            changepic (event) {  
                let file = event.target.files[0]
                let param = new FormData();
                param.append('file',file);//通过append向form对象添加数据
                if(param.get('file').type === 'application/pdf'){
                    this.fileType = 2
                }else{
                    this.fileType = 1
                }
                param.append('fileType',this.fileType);
                this.Filename = param.get('file').name
                request.upload('/factoryContract/uploadContract',param).then((response) => {
                    if(response.data.code === 200){
                        localStorage.setItem('pathUrl',response.data.data.pengUrl)
                        localStorage.setItem('urlPath',response.data.data.urlPath)
                        localStorage.setItem('urlPdfName',response.data.data.urlPdfName)
                        this.Filecontent = response.data.data
                        this.JudgeFile = true
                        this.showFile = false
                    }
                    }).catch((ex) => {
                    console.log(ex,"ex")
                    this.loading = false
                    this.$Message.error(ex.data.msg);
                    this.$nextTick(() => {this.loading = true;});
                })                
                
            },   
            getPerson () {//签署人员列表
                request.get("/factoryContract/selectElecContractWorkerList", {
                    factoryUid:this.factoryUid,
                    queries:'',
                    pageNumStr:100,
                    pageIntStr:1,
                })
                .then(response => {
                    if(response.data.code === 200){
                        console.log(response)
                        this.PersonList = response.data.data
                    }else{
                        return    
                    }
                })
                .catch(ex => {
                console.log(ex,"rex")
                });                 
            },   
            openFile () {
                document.getElementById('addFile').click();
            }, 
            Checkbox (userUid,userName,worker,factoryWorkerUid,userPhone,cardUid,contractCourseUid) {
                localStorage.setItem('contractCourseUid',contractCourseUid)
                setTimeout(() =>{
                    this.$router.push({path:'/Sdetails?userName='+userName+'&worker='+worker+'&factoryWorkerUid='+factoryWorkerUid+'&userPhone'+userPhone+'&cardUid'+cardUid+'&userUid='+userUid})
                },500)
            },     
            pageChange (current) {//分页
                this.page = current
                this.getData();
            }, 
            pageSizeChange (pageSize) {
                this.limit = pageSize
                this.getData();
            },           
            gotoPage (val) {
                console.log(val)
                this.$router.push({path: val})
            },
        },
    }
</script>
<style>
::-webkit-scrollbar  
{  
    width: 6px;    
    border-radius: 10px;  
    background: #f5f7f9;
}
::-webkit-scrollbar-track  
{  
    -webkit-box-shadow: inset 0 0 6px #f5f7f9;  
    border-radius: 10px;  
    background-color: #f5f7f9;  
}
::-webkit-scrollbar-thumb  
{  
    border-radius: 10px;  
    /* -webkit-box-shadow: inset 0 0 6px #f5f5f5;   */
    background-color: #d8d8d8;  
} 
</style>
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
    height:55px;
}
.trow:hover{
    background: #fff;
    box-shadow: 1px 1px 10px #ccc;
}
.Timg>span:nth-child(1){
    display: inline-block;
    width: 50%;
    height:55px;
    float: left;
}
.Timg>span:nth-child(1)>img{
    width: 24px;
    margin-top: 16px;
}
.Timg>span:nth-child(2){
    display: inline-block;
    width: 50%;
    height:55px;
    line-height: 55px;
    text-align: left;
    float: left;
}
.Tbutton>a:nth-child(1){
    display: inline-block;
    width: 50px;
    height:50px;
    margin-right: 8px;
    background: url('../assets/img/show.png') 100% 100% no-repeat;
    background-position: 0px 15px;
}
.Tbutton>a:nth-child(1):hover{
    background: url('../assets/img/showr.png') 100% 100% no-repeat;
    background-position: 0px 15px;
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
    margin-top: 10px;
}
.main_top>a{
    display: block;
    width: 100%;
    height:50px;
    line-height: 50px;
    text-align: left;
    color:#000;
    font-size: 16px;
    padding-left: 57px;
}
.main_center{
    width: 100%;
    height:60px;
    background: #fff;
    margin-top: 10px;
}
.center_left{
    width: 50%;
    height:60px;
    line-height: 60px;
    text-align: left;
    padding-left:60px;
    float: left;
}
.center_right{
    width: 50%;
    height:60px;
    line-height: 60px;
    text-align: right;
    float: left;
    padding-right: 20px;
}
.butt{
    margin-right: 20px;
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
.upload{
    height:200px;
    margin:20px;
    border:1px dashed #ccc;
    cursor: pointer;
}
.upload>span:nth-child(1){
    display: block;
    width: 100%;
    height:150px;
    line-height: 150px;
    text-align: center;
}
.upload>span:nth-child(2){
    display: block;
    width: 100%;
    height:50px;
    line-height: 50px;
    text-align: center;
    color:#8A93A6;
}
.usedetails{
    width: 100%;
    padding-left:14px;
}
.alert{
    width: 100%;
    height:100%;
    min-height: 200px;
    max-height: 200px;
    overflow-y: auto;
    margin-top: 10px;
}
.usemain{
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding: 10px 0;
    border-bottom: 1px solid #f5f5f5;
}
.usemain>span:nth-child(1){
    width: 15%;
    height:40px;
    line-height: 40px;
    text-align: center;
    display: inline-block;
    float: left;
}
.usemain>span:nth-child(2){
    width: 60%;
    height:40px;
    line-height: 40px;
    text-align: left;
    display: inline-block;
    float: left;
}
.usemain>span:nth-child(3){
    width: 25%;
    height:40px;
    line-height: 40px;
    text-align: left;
    display: inline-block;
    float: left;
}
</style>