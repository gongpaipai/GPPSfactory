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
                        <a>合同模板</a>
                    </div>
                    <div class="main_center">
                        <div class="center_left">
                            <!-- <Select v-model="model1" clearable style="width:200px">
                                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select> -->
                            <Input prefix="ios-search" placeholder="请输入搜索内容" style="width: 250px;margin-right:50px;" />
                        </div>
                        <div class="center_right">
                            <Button  class="butt" type="primary" @click="addNew"><Icon type="md-add" style="font-size:15px;"/>添加合同模板</Button>
                        </div>
                    </div>
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff',height:'100vh',marginTop:'10px',}">
                        <div style="max-height:620px;overflow-y:scroll;">
                            <table class="table">
                                <tr style="border-bottom:1px solid #DEE2ED;">
                                    <th>合同名称</th>
                                    <th>使用次数</th>
                                    <th>适应岗位</th>
                                    <th>添加时间</th>
                                    <th style="width:300px;text-align:center;">操作</th>
                                </tr>
                                <tr class="trow"  v-for="(item,index) in this.content.contractTemplateUseSumList" :key='index' v-if="showNo" >
                                    <td>{{item.templateName}}</td>
                                    <td>{{item.userSum}}</td>
                                    <td>{{item.worker}}</td>
                                    <td>{{item.createTime}}</td>
                                    <td class="Tbutton" style="padding:0 80px;">
                                        <a @click="godetails"></a>
                                        <a @click="openUse">签署</a>
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
                            :loading="loading"
                            @on-ok="addSure"
                            @on-cancel="cancel"
                            v-model="addFile"
                            title="上传合同模板"  
                            width="400">
                            <div class="upload" @click="openFile" v-show="showFile">
                                <span><img src="../assets/img/add.png" alt="" style="width:56px;margin-top:60px;"></span>
                                <span>点击上传合同模板</span>
                            </div>
                            <input type="file" accept="application/pdf,application/msword" @change="changepic($event)" id="addFile" style="display:none;">
                            <div class="upload"  v-show="!showFile">
                                <span><Icon type="ios-folder-open" style="font-size:56px;" /></span>
                                <span>{{this.Filename}}</span>
                            </div>
                            <div class="addname">
                                <span><span style="color:red;">*</span> 对应岗位：</span>
                                <span><input type="text" placeholder="请输入改模板对应的岗位（如：'普工'）" v-model="worker"></span>
                            </div>
                        </Modal>  
                        <!-- 使用合同模板 -->
                        <Modal
                            :loading="loading"
                            @on-ok="useSure"
                            v-model="useFile"
                            title="选择使用合同人员"  
                            width="400">
                            <div class="usedetails">
                                <Checkbox v-model="single">全选</Checkbox>
                                <input type="text" style="width:220px;height:30px;margin-left:30px;border:1px solid #ccc;border-radius:3px;padding-left:10px;" placeholder="请输入要搜索的内容">
                            </div>
                            <div class="alert">
                                <div class="usemain">
                                    <span><Checkbox></Checkbox></span>
                                    <span>
                                        <div style="width:50px;height:40px;display: inline-block;float:left;">
                                            <img src="../assets/img/person.png" alt="" style="width:30px;margin-top:5px;">
                                        </div>
                                        <div style="height:40px;display: inline-block;float:left;">
                                            <span>周杰伦</span>
                                        </div>
                                    </span>
                                    <span>
                                        <Button style="color:#2d8cf0;background:#f5f5f5;border:1px solid #f5f5f5;">普工</Button>
                                    </span>
                                </div>
                                <div class="usemain">
                                    <span><Checkbox></Checkbox></span>
                                    <span>
                                        <div style="width:50px;height:40px;display: inline-block;float:left;">
                                            <img src="../assets/img/person.png" alt="" style="width:30px;margin-top:5px;">
                                        </div>
                                        <div style="height:40px;display: inline-block;float:left;">
                                            <span>周杰伦</span>
                                        </div>
                                    </span>
                                    <span>
                                        <Button style="color:#2d8cf0;background:#f5f5f5;border:1px solid #f5f5f5;">普工</Button>
                                    </span>
                                </div>
                            </div>
                            
                        </Modal>                                                                                
                        <Page :total="this.content.total"
                        :current="1"
                        show-total  show-sizer show-elevator
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
                activeTitle:'Ctemplate',
                theme3:'light',
                value:2,
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
                cityList: [
                    {
                        value: 'New York',
                        label: '全部'
                    }
                ],
                showNo:true,
                model1: '',     
                content:'',
                factoryUid:'',
                limit:10,
                page:1,
                loading:true,
                addFile:false,
                fileType:'',//1word文件2pdf文件
                Filename:'',
                Filecontent:'',//存放上传文件返回信息
                showFile:true,
                JudgeFile:false,//判断文件是否上传成功
                worker:'',//工种

                useFile:false,
                indeterminate: true,
                checkAll: false,
                single:false,

              
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
            getData () {
                request.get("/factoryContract/selectContractTemplateList", {
                    factoryUid:this.factoryUid,
                    queries:'',
                    pageNumStr:this.limit,
                    pageIntStr:this.page,
                })
                .then(response => {
                    if(response.data.code === 200){
                        this.content = response.data.data
                        console.log(this.content)
                        if(this.content.length === 0){
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
            addNew () {
                this.$Message.warning('暂时无法添加合同模板');
                // this.addFile = true
            },
            cancel () {
                this.showFile = true
            },
            addSure () {
                if(this.JudgeFile === '' || this.JudgeFile  === false){
                    this.$Message.error('请先上传合同模板');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                if(this.worker === '' || this.worker === null){
                    this.$Message.error('对应岗位不能为空');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                request.post("/factoryContract/addContractTemplate", {
                    worker:this.worker,
                    factoryUid:this.factoryUid,
                    templateName:this.Filename,
                    templatePicture:this.Filecontent.urlPictureName,
                    templateUrl:this.Filecontent.urlPath,
                    templatePdfName:this.Filecontent.urlPdfName,
                    templateDocName:this.Filecontent.urlWordName,
                    fieldsJson:'',
                })
                .then(response => {
                    if(response.data.code === 200){
                        console.log(response,"res1")
                        this.$Message.success("添加成功");
                        this.getData();
                        this.addFile = false
                    }else{
                        return    
                    }
                })
                .catch(ex => {
                    console.log(ex,"rex")
                    this.loading = false
                    this.$Message.error(ex.data.msg);
                    this.$nextTick(() => {this.loading = true;});
                });                 
            },
            openFile () {
                document.getElementById('addFile').click();
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
                        console.log(response,"resurl")
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
            openUse () {
                this.$Message.warning('暂时无法签署合同');
                // this.useFile = true
            },     
            useSure () { //选择使用合同人员确定

            },   
            godetails () {
                this.$Message.warning('暂时无法查看详情');
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
    height: 55px;
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
    height:55px;
    float: left;
    margin-right: 8px;
    background: url('../assets/img/show.png') 100% 100% no-repeat;
    background-position: 0px 15px;
}
.Tbutton>a:nth-child(1):hover{
    background: url('../assets/img/showr.png') 100% 100% no-repeat;
    background-position: 0px 15px;
}
.Tbutton>a:nth-child(2){
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
.addname{
    width: 100%;
    height:40px;
    margin-top: 10px;
    border-top:1px solid #f5f5f5;
    padding-top: 10px;
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
.usedetails{
    width: 100%;
    padding-left:14px;
}
.alert{
    width: 100%;
    height:100%;
    max-height: 400px;
    overflow-y: auto;
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