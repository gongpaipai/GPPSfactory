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
                        <a>员工管理</a>
                    </div>
                    <div class="main_center">
                        <div class="center_left">
                            <Input prefix="ios-search" placeholder="请输入员工姓名或地区" style="width: 250px" v-model="search" />
                            <Button type="primary" @click="searchSelect">搜索</Button>
                        </div>
                        <div class="center_right">
                            <Button class="butt" @click="MoreSelect">用户导出</Button>
                            <Button class="butt" @click="openFile">导入Excel</Button>
                            <input type="file" accept="application/vnd.ms-excel" @change="changepic($event)" id="importFile" style="display:none;">
                            <Button  class="butt" type="primary"  @click="addNewP"><Icon type="md-add" style="font-size:15px;"/>添加员工</Button>
                        </div>
                    </div>
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff',height:'100vh',marginTop:'10px',}">
                        <div style="max-height:620px;overflow-y:scroll;">
                            <table class="table">
                                    <tr style="border-bottom:1px solid #DEE2ED;">
                                        <th style="width:200px;">员工姓名</th>
                                        <th style="width:150px;">岗位</th>
                                        <th style="width:150px;">性别</th>
                                        <th style="width:150px;">所在城市</th>
                                        <th>添加时间</th>
                                        <th style="width:300px;">操作</th>
                                    </tr>
                                    <tr class="trow" v-for="(item,index) in this.content.factoryWorkerList" :key="index" v-if="showNo" >
                                            <td class="Timg">
                                                <span><img src="../assets/img/person.png" style="width:25px;" alt=""></span> 
                                                <span>{{item.userName}}</span>
                                            </td>
                                            <td>{{item.worker}}</td>
                                            <td v-if="item.sex === 1">男</td>
                                            <td v-if="item.sex === 2">女</td>
                                            <td>{{item.address}}</td>
                                            <td>{{item.createTime}}</td>
                                            <td class="Tbutton" style="padding:0 50px 0 65px;">
                                                <a @click="JumptoD(item.factoryWorkerUid,item.factoryUid,item.userUid)"></a>
                                                <a @click="deleteUser"></a>
                                            </td>
                                    </tr>
                            </table>
                        </div>

                        <div class="showNothing" v-if="!showNo">
                                <img src="../assets/img/without.png" alt="" style="width:400px;">
                                <span>暂无记录</span>
                        </div>  
                        <Modal v-model="userExport" width="360">
                            <p slot="header" style="color:#57a3f3;text-align:center;font-size:15px;">
                                <Icon type="ios-information-circle"></Icon>
                                <span>用户导出</span>
                            </p>
                            <div style="text-align:center;font-size:13px;">
                                <p>此操作会导出全部用户</p>
                                <p>确定导出吗？</p>
                            </div>
                            <div slot="footer">
                                <Button type="primary" size="large" long @click="Exportdata">确定导出</Button>
                            </div>
                        </Modal>
                        <!-- 新增弹窗 -->
                        <Modal
                            :loading="loading"
                            @on-ok="addSure"
                            @on-cancel="cancel"
                            v-model="addNew"
                            title="添加员工"
                            width="400">
                            <div class="addname">
                                <span><span style="color:red;margin-right:6px;">*</span>姓名：</span>
                                <span><input type="text" placeholder="请输入您的姓名(1-36字符)" v-model="addform.addname"></span>
                            </div>
                            <div class="addname">
                                <span><span style="color:red;margin-right:6px;">*</span>手机号：</span>
                                <span><input type="number" placeholder="请输入您的手机号" v-model="addform.addphone"></span>
                            </div>
                            <div class="addname">
                                <span><span style="color:red;margin-right:6px;">*</span>性别：</span>
                                <span>
                                    <Select v-model="addform.selectSex" style="width:100%">
                                        <Option v-for="item in sex" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </span>
                            </div>
                            <div class="addname">
                                <span><span style="color:red;margin-right:6px;">*</span>年龄：</span>
                                <span><input type="number" placeholder="请输入您的年龄(1-36字符)" v-model="addform.addyear"></span>
                            </div>
                            <div class="addname">
                                <span><span style="color:red;margin-right:6px;">*</span>岗位：</span>
                                <span><input type="text" placeholder="请输入您要添加的岗位(1-36字符)" v-model="addform.addWork"></span>
                            </div>
                            <div class="addname">
                                <span><span style="color:red;margin-right:6px;">*</span>工号：</span>
                                <span><input type="text" placeholder="请输入您要添加的工号(1-36字符)" v-model="addform.addNum"></span>
                            </div>
                            <div class="addname">
                                <span><span style="color:red;margin-right:6px;">*</span>身份证号：</span>
                                <span><input type="number" placeholder="请输入您的身份证号(15-18字符)" v-model="addform.addID"></span>
                            </div>
                            <div class="addname">
                                <span><span style="color:red;margin-right:6px;">*</span>现居住地：</span>
                                <span><input type="text" placeholder="请输入您的现居住地(1-36字符)" v-model="addform.addaddress"></span>
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
const baseURL =  require('../units/request').HOST
    export default {
        data () {
            return {
                openList:[],
                activeTitle:'/',
                theme3:'light',
                value:2,
                sex:[
                    {
                        value: 1,
                        label: '男'
                    },
                    {
                        value: 2,
                        label: '女'
                    },
                    
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
                    menuUrl: '/Cmanager',
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
                content:'', 
                factoryUid:'',
                factoryWorkerUid:'',
                limit:10,
                page:1,    
                addNew:false,
                showNo:true,
                ishover:true,
                
                //新增工人表单
                loading:true,
                addform:{
                    addname:'',
                    addphone:'',
                    selectSex:'',
                    addyear:'',
                    addWork:'',
                    addNum:'',
                    addID:'',
                    addaddress:'',
                },
                userExport:false,
                queries:'',
                search:'',
            }
        },
        created () {
            this.factoryUid = window.localStorage.getItem('factoryUid')
        },
        components:{
            TopHeader,
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
                request.get("/factoryUser/selectFactoryWorkerList", {
                    factoryUid:this.factoryUid,
                    pageNumStr:this.limit,
                    pageIntStr:this.page,
                    queries:this.queries
                })
                .then(response => {
                    if(response.data.code === 200){
                        this.content = response.data.data
                        if(this.content.factoryWorkerList.length === 0){
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
            Exportdata () {   //原生导出用户，可优化
                this.userExport = false
                var oReq = new XMLHttpRequest();
                oReq.open("GET", baseURL+'/factoryUser/exportFactoryWorkerList?factoryUid='+this.factoryUid+'&queries='+'',true);
                oReq.responseType = "blob";//！！设置回执类型
                oReq.onload = function (oEvent) {
                    var content = oReq.response;
                    var elink = document.createElement('a');
                    elink.download = "员工信息表.xls";
                    elink.style.display = 'none';
                    var blob = new Blob([content]);
                    elink.href = URL.createObjectURL(blob);
                    document.body.appendChild(elink);
                    elink.click();
                    document.body.removeChild(elink);
                };
                oReq.send();         
            },
            openFile () {
                document.getElementById('importFile').click();
            },
            changepic (event) {  
                let file = event.target.files[0]
                let param = new FormData();
                param.append('workerUp',file);//通过append向form对象添加数据
                param.append('factoryUid',this.factoryUid);
                console.log(param.get('workerUp'),"type")
                request.upload('/factoryUser/addFactoryWorkerComePoi',param).then((response) => {
                    if(response.data.code === 200){
                        console.log(response,"result")
                        this.getData();
                        this.$Message.success("导入成功");
                    }
                    }).catch((ex) => {
                    console.log(ex,"ex")
                    this.loading = false
                    this.$Message.error(ex.data.msg);
                    this.$nextTick(() => {this.loading = true;});
                })                
                
            },            
            cancel () {
                this.addNew = false
                this.addform.addname = ''
                this.addform.addphone = ''
                this.addform.selectSex = ''
                this.addform.addyear = ''
                this.addform.addWork = ''
                this.addform.addNum = ''
                this.addform.addID = ''
                this.addform.addaddress = ''
            },
            addSure () {
                if(this.addform.addname === '' || this.addform.addname === null){
                    this.$Message.error('姓名不能为空');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                if(this.addform.addphone === '' || this.addform.addphone === null){
                    this.$Message.error('手机号不能为空');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                if(this.addform.addphone.length !== 11){
                    this.$Message.error('手机号码长度必须为11位');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                if(this.addform.selectSex === '' || this.addform.selectSex === null){
                    this.$Message.error('请选择性别');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                if(this.addform.addyear === '' || this.addform.addyear === null){
                    this.$Message.error('年龄不能为空');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                if(this.addform.addWork === '' || this.addform.addWork === null){
                    this.$Message.error('岗位不能为空');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                if(this.addform.addWork === '' || this.addform.addWork === null){
                    this.$Message.error('工号不能为空');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                if(this.addform.addID === '' || this.addform.addID === null){
                    this.$Message.error('身份证号不能为空');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                if(this.addform.addID.length > 19 || this.addform.addID.length < 14){
                    this.$Message.error('身份证号长度必须为15-18位');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                if(this.addform.addaddress === '' || this.addform.addaddress === null){
                    this.$Message.error('现居住地不能为空');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                request.post("/factoryUser/addFactoryWorker", {
                    factoryUid:this.factoryUid,
                    userName:this.addform.addname,
                    userPhone:this.addform.addphone,
                    cardUid:this.addform.addID,
                    worker:this.addform.addWork,
                    workerId:this.addform.addNum,
                    age:this.addform.addyear,
                    sex:this.addform.selectSex,
                    address:this.addform.addaddress
                })
                .then(response => {
                    if(response.data.code === 200){
                        this.addNew = false
                        this.$Message.success('添加成功');
                        this.getData();
                        this.addform.addname = ''
                        this.addform.addphone = ''
                        this.addform.selectSex = ''
                        this.addform.addyear = ''
                        this.addform.addWork = ''
                        this.addform.addNum = ''
                        this.addform.addID = ''
                        this.addform.addaddress = ''
                    }else{
                        this.$Message.error(response.data.msg);  
                    }
                })
                .catch(ex => {
                    console.log(ex,"ex")
                    this.loading = false
                    this.$Message.error(ex.data.msg);
                    this.$nextTick(() => {this.loading = true;});
                     
                });                
            },
            pageChange (current) {//分页
                this.page = current
                this.getData();
            },
            pageSizeChange (pageSize) {
                this.limit = pageSize
                this.getData();
            },
            addNewP () {
                this.addNew = true
            },
            JumptoD (factoryWorkerUid,factoryUid,userUid) {
                this.$router.push({path:'/PersonDetail?pid='+factoryWorkerUid+'&fid='+factoryUid+'&uid='+userUid})
            },
            MoreSelect () {
               this.userExport = true
            },
            deleteUser () {
                this.$Message.error('该用户暂时无法删除');
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
.addname{
    width: 100%;
    height:40px;
    margin-top: 10px;
}
.addname>span:nth-child(1){
    display: inline-block;
    width: 100px;
    height:40px;
    line-height: 40px;
    font-size: 12px;
    color:#8A93A6;
    text-align: center;
    float: left;
}
.addname>span:nth-child(2){
    display: inline-block;
    width: 250px;
    height:40px;
    float: left;
}
.addname>span:nth-child(2)>input{
    width: 100%;
    height:30px;
    margin:5px 0;
    padding-left: 10px;
    border:1px solid #DDE2EB;
    border-radius: 3px;
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
    border-bottom:1px solid #DEE2ED;
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
    /* float: left; */
    margin-right: 8px;
    background: url('../assets/img/show.png') 100% 100% no-repeat;
    background-position: 0px 15px;
}
.Tbutton>a:nth-child(1):hover{
    background: url('../assets/img/showr.png') 100% 100% no-repeat;
    background-position: 0px 15px;
}
/* .Tbutton>a:nth-child(2){
    display: inline-block;
    width: 40px;
    height: 30px;
    line-height: 30px;
    float: left;
    margin: 15px 5px 0 5px; 
    border: 1px solid #ccc;
    border-radius: 3px;
    color:#000;
}
.Tbutton>a:nth-child(2):hover{
    background: #FF8C64;
    border:1px solid #FF8C64;
    color:#fff;
} */
.Tbutton>a:nth-child(2){
    display: inline-block;
    width: 50px;
    height:50px;
    /* float: left; */
    background: url('../assets/img/del.png') 100% 100% no-repeat;
    background-position: 10px 15px;
}
.Tbutton>a:nth-child(2):hover{
    background: url('../assets/img/dell.png') 100% 100% no-repeat;
    background-position: 10px 15px;
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
    min-width: 1400px;
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
</style>