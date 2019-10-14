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
                        <a>人脸识别记录</a>
                    </div>
                    <div class="main_center">
                        <div class="center_left">
                            <Input prefix="ios-search" placeholder="请输入签署人名称" style="width: 250px;" v-model="search" />
                            <Button type="primary" @click="searchSelect">搜索</Button>
                        </div>
                        <div class="center_right">
                            <Button  class="butt" type="primary" @click="Beginprove"><Icon type="md-add" style="font-size:15px;"/>发起识别</Button>
                        </div>
                    </div>
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff',height:'100vh',marginTop:'10px',}">
                        <div style="max-height:620px;overflow-y:scroll;">
                            <table class="table">
                                <tr style="border-bottom:1px solid #DEE2ED;">
                                    <th style="width:200px;">签署人</th>
                                    <th>
                                        <Dropdown>
                                            <a href="javascript:void(0)">
                                                识别状态
                                                <Icon type="ios-arrow-down" style="font-size:15px;"></Icon>
                                            </a>
                                            <DropdownMenu slot="list">
                                                <DropdownItem>已识别</DropdownItem>
                                                <DropdownItem>未识别</DropdownItem>
                                                <DropdownItem>未通过</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </th>
                                    <th>添加时间</th>
                                    <th style="width:300px;text-align:center;">操作</th>
                                </tr>
                                <tr class="trow"  v-for="(item,index)  in this.content.userContracts" :key='index' v-if="showNo">
                                    <td class="Timg">
                                        <span><img src="../assets/img/person.png" style="width:25px;" alt=""></span> 
                                        <span>{{item.userName}}</span>
                                    </td>
                                    <td v-if="item.faceIdentification === 2"><span style="color:green;">已识别</span></td>
                                    <td v-if="item.faceIdentification === 1" ><span style="color:red;">未通过</span></td>
                                    <td v-if="item.faceIdentification === 0"><span style="color:#FF8C64;">未识别</span></td>
                                    <td>2019-02-02</td>
                                    <td class="Tbutton" style="padding:0 50px 0 90px;">
                                        <a @click="seeUser"></a>
                                        <a @click="JudgeResult">审核</a>
                                    </td>
                                </tr>
                            </table>  
                        </div>
                        <!-- 使用合同模板 -->
                        <Modal
                            :loading="loading"
                            @on-ok="useSure"
                            v-model="useFile"
                            title="选择使用人脸识别人员"  
                            width="400">
                            <div class="usedetails">
                                <Button @click="handleSelectAll(true)" v-show="showselect">全选</Button>
                                <Button @click="handleSelectAll(false)" v-show="!showselect">取消</Button>
                                <input type="text" style="width:60%;height:35px;margin-left:20px;border:1px solid #ccc;border-radius:3px;padding-left:10px;" placeholder="请输入要搜索的内容">
                                <Button type="primary">搜索</Button>
                            </div>
                            <div class="alert">
                                <!-- <div class="usemain" v-for="(item,index) in this.selectUser.userContracts" :key='index'>
                                    <span><Checkbox @on-change="addTo(item.faceIdentificationUid)"></Checkbox></span>
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
                                </div> -->
                                <Table ref="selection" :show-header="false" :columns="columns" :data="dataList" @on-select-cancel="cancelSelect" @on-select="handleselect" @on-select-all="handleSelectAllsure"></Table>
                            </div>
                            
                        </Modal>   
                        <div class="showNothing" v-if="!showNo">
                                <img src="../assets/img/without.png" alt="" style="width:400px;">
                                <span>暂无记录</span>
                        </div>                       
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
                activeTitle:'FaceRecord',
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
                factoryUid:'',
                limit:10,
                page:1,
                loading:true,
                showNo:true,
                content:'',
                queries:'',
                search:'',
                useFile:false,
                selectUser:'',
                showselect:true,
                columns:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'userName',
                        key: 'userName'
                    },
                    {
                        title: 'worker',
                        key: 'worker'
                    }
                ],
                dataList:[],
                oselectId:[],
              
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
            this.getselectFace();
        },
        methods:{  
            searchSelect () {
               this.queries = this.search
               this.getData();
            },            
            getData () {
                request.get("/factoryFaceGiscern/selectFaceGiscernUserList", {
                    factoryUid:this.factoryUid,
                    queries:this.queries,
                    pageNumStr:this.limit,
                    pageIntStr:this.page,
                })
                .then(response => {
                    if(response.data.code === 200){
                        this.content = response.data.data
                        console.log(this.content,"res")
                        if(this.content.userContracts.length === 0){
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
            getselectFace () {
                request.get("/factoryFaceGiscern/selectFaceGiscernList", {
                    factoryUid:this.factoryUid,
                    queries:this.queries,
                    pageNumStr:100,
                    pageIntStr:this.page,
                })
                .then(response => {
                    if(response.data.code === 200){
                        this.dataList = response.data.data.userContracts
                    }
                })
                .catch(ex => {
                console.log(ex,"rex")
                });                 
            },
            Beginprove () {
                this.useFile = true
            },
            useSure () {
                if(this.oselectId.length === 0){
                    this.$Message.error('人脸识别不能为空');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                request.post("/factoryFaceGiscern/upadteFaceGiscernPast", {
                    faceIdentificationUid:this.oselectId
                })
                .then(response => {
                    if(response.data.code === 200){
                        this.useFile = false
                        this.$Message.success('添加到人脸识别列表成功');
                        this.getData();
                        this.getselectFace();
                    }
                })
                .catch(ex => {
                console.log(ex,"rex")
                });                 
            },
            addTo (val) {
                console.log(val)
            },
            handleselect(currentRow, oldCurrentRow){
                let select = []
                for(var i = 0;i < currentRow.length;i++){
                    select.push(currentRow[i].faceIdentificationUid);
                }
                this.oselectId = select
            },  
            cancelSelect (currentRow) {
                let select = []
                for(var i = 0;i < currentRow.length;i++){
                    select.push(currentRow[i].faceIdentificationUid);
                }
                this.oselectId = select
            },          
            handleSelectAll (status) {
                this.$refs.selection.selectAll(status);
                this.showselect = false
                if(status === false){
                    this.showselect = true
                    this.oselectId = []
                }
            },
            handleSelectAllsure(currentRow){
                for(var i = 0;i < currentRow.length;i++){
                    this.oselectId.push(currentRow[i].faceIdentificationUid);
                }
            },
            seeUser () {
               this.$Message.error('暂不支持查看'); 
            },
            JudgeResult () {
                this.$Message.error('暂不支持审核'); 
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
.ivu-table-cell{
    text-align: center !important;
}
.table{
    width: 100%;
    max-height:620px;
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
    margin-right: 8px;
    float: left;
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
.usedetails{
    width: 100%;
    padding-left:14px;
}
.alert{
    width: 100%;
    height:100%;
    max-height: 400px;
    overflow-y: auto;
    margin-top: 20px;
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