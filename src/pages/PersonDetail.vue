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
                    <div class="main_center">
                        <div class="center_top">
                            <div class="center_left">
                                <span><img src="../assets/img/person.png" alt="" style="width:47px;"></span>
                                <span>{{this.content.userName}}</span>
                                <span><Button style="color:#4C83FF;background:#F3F6FD;border:1px solid #F3F6FD;">{{this.content.worker}}</Button></span>
                            </div>
                            <div class="center_right">
                                <Button style="width:80px;margin-right:20px;" @click="edit">编辑</Button>
                                <Button style="width:80px;" v-if="showunable" @click="addUnallowable">禁用</Button>
                                <Button style="width:80px;" type="warning" v-if="!showunable" @click="deteleUnallowable">启用</Button>
                            </div>
                            <Modal v-model="addable" width="360">
                                <p slot="header" style="color:#f60;text-align:center;font-size:15px;">
                                    <Icon type="ios-information-circle"></Icon>
                                    <span>用户禁用</span>
                                </p>
                                <div style="text-align:center;font-size:13px;">
                                    <p>此操作会将用户禁用</p>
                                    <p>确定禁用吗？</p>
                                </div>
                                <div slot="footer">
                                    <Button type="error" size="large" long @click="sureable">确定禁用</Button>
                                </div>
                            </Modal>
                            <Modal v-model="deleteunable" width="360">
                                <p slot="header" style="color:#2d8cf0;text-align:center;font-size:15px;">
                                    <Icon type="ios-information-circle"></Icon>
                                    <span>用户启用</span>
                                </p>
                                <div style="text-align:center;font-size:13px;">
                                    <p>此操作会将用户启用</p>
                                    <p>确定启用吗？</p>
                                </div>
                                <div slot="footer">
                                    <Button type="primary" size="large" long @click="suredeleteable">确定启用</Button>
                                </div>
                            </Modal>
                        </div>
                        <div class="center_bot">
                            <div class="center_Detail">
                                <div class="single">
                                    <span><img src="../assets/img/Education.png" alt=""></span>
                                    <span style="color:#8A93A6;">工号：</span>
                                    <span style="color:#000;">{{this.content.workerId}}</span>
                                </div>
                                <div class="single">
                                    <span><img src="../assets/img/Education.png" alt=""></span>
                                    <span style="color:#8A93A6;">电话：</span>
                                    <span style="color:#000;">{{this.content.userPhone}}</span>
                                </div>
                                <div class="single">
                                    <span><img src="../assets/img/Education.png" alt=""></span>
                                    <span style="color:#8A93A6;">性别：</span>
                                    <span style="color:#000;" v-show="this.content.sex === 1">男</span>
                                    <span style="color:#000;" v-show="this.content.sex === 2">女</span>
                                </div>
                                <div class="single">
                                    <span><img src="../assets/img/Education.png" alt=""></span>
                                    <span style="color:#8A93A6;">年龄：</span>
                                    <span style="color:#000;">{{this.content.age}}</span>
                                </div>
                                <div class="single">
                                    <span><img src="../assets/img/Education.png" alt=""></span>
                                    <span style="color:#8A93A6;">城市：</span>
                                    <span style="color:#000;">{{this.content.address}}</span>
                                </div>
                            </div>
                            <div class="center_Detail">
                                <div class="single">
                                    <span><img src="../assets/img/Education.png" alt=""></span>
                                    <span style="color:#8A93A6;">创建时间：</span>
                                    <span style="color:#000;">{{this.content.createTime}}</span>
                                </div>
                            </div>
                            <!-- 编辑弹窗 -->
                            <Modal
                                :loading="loading"
                                @on-ok="editSure"
                                v-model="editNew"
                                title="员工编辑"
                                width="400">
                                <div class="addname">
                                    <span><span style="color:red;margin-right:6px;">*</span>姓名：</span>
                                    <span><input type="text" placeholder="请输入您的姓名(1-36字符)" v-model="editform.addname"></span>
                                </div>
                                <div class="addname">
                                    <span><span style="color:red;margin-right:6px;">*</span>手机号：</span>
                                    <span><input type="number" placeholder="请输入您的手机号" v-model="editform.addphone"></span>
                                </div>
                                <div class="addname">
                                    <span><span style="color:red;margin-right:6px;">*</span>性别：</span>
                                    <span>
                                        <Select v-model="editform.selectSex" style="width:100%">
                                            <Option v-for="item in sex" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </span>
                                </div>
                                <div class="addname">
                                    <span><span style="color:red;margin-right:6px;">*</span>年龄：</span>
                                    <span><input type="number" placeholder="请输入您的年龄" v-model="editform.addyear"></span>
                                </div>
                                <div class="addname">
                                    <span><span style="color:red;margin-right:6px;">*</span>岗位：</span>
                                    <span><input type="text" placeholder="请输入您要添加的岗位(1-36字符)" v-model="editform.addWork"></span>
                                </div>
                                <div class="addname">
                                    <span><span style="color:red;margin-right:6px;">*</span>工号：</span>
                                    <span><input type="text" placeholder="请输入您要添加的工号(1-36字符)" v-model="editform.addNum"></span>
                                </div>
                                <div class="addname">
                                    <span><span style="color:red;margin-right:6px;">*</span>身份证号：</span>
                                    <span><input type="number" placeholder="请输入您的身份证号(15-18字符)" v-model="editform.addID"></span>
                                </div>
                                <div class="addname">
                                    <span><span style="color:red;margin-right:6px;">*</span>现居住地：</span>
                                    <span><input type="text" placeholder="请输入您的现居住地(1-36字符)" v-model="editform.addaddress"></span>
                                </div>
                            </Modal>                            
                        </div>
                    </div>
                    <Content :style="{padding: '24px', minHeight: '280px', background: '#fff',height:'100vh',marginTop:'10px',}">
                        <Tabs>
                            <TabPane label="合同签署" icon="ios-bookmarks">
                                <table class="table" v-if="showNothing">
                                    <tr style="border-bottom:1px solid #ccc;">
                                        <th style="width:250px;">合同名称</th>
                                        <th style="width:150px;">签署人</th>
                                        <th style="width:150px;">签署时间</th>
                                        <th style="width:300px;text-align:center;">操作</th>
                                    </tr>
                                    <tr class="trow">
                                        <td>{{this.Contract.contractName}}</td>
                                        <td>{{this.Contract.userName}}</td>
                                        <td>{{this.Contract.createTime}}</td>
                                        <td style="text-align:center;">
                                            <Button>查看</Button>
                                        </td>
                                    </tr>
                                </table>
                                <div class="showNothing" v-if="!showNothing">
                                    <img src="../assets/img/without.png" alt="" style="width:400px;">
                                    <span>暂无记录</span>
                                </div>
                            </TabPane>
                            <TabPane label="人脸识别" icon="md-person">
                                <table class="table" v-if="showNo">
                                    <tr style="border-bottom:1px solid #ccc;">
                                        <th>识别公司</th>
                                        <th>识别人</th>
                                        <th>更新时间</th>
                                    </tr>
                                    <tr class="trow">
                                        <td>{{this.faceResult.factoryName}}</td>
                                        <td>{{this.faceResult.userName}}</td>
                                        <td>{{this.faceResult.updateTime}}</td>
                                    </tr>
                                </table>
                                <div class="showNothing" v-if="!showNo">
                                    <img src="../assets/img/without.png" alt="" style="width:400px;">
                                    <span>暂无记录</span>
                                </div>
                            </TabPane>
                        </Tabs>
                        
                       
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
                    menuUrl: 'test',
                    childMenu: [],
                    icon:'md-albums',
                },
                {
                    menuName: '人脸识别记录',
                    menuUrl: 'test',
                    childMenu: [],
                    icon:'logo-hackernews',
                },
                ],  
                limit:10,
                page:1,
                content:'',
                Contract:'',
                faceResult:'',
                showNothing:false,//判断合同签署有无数据
                showNo:false,//判断人脸识别有无数据
                factoryWorkerUid:'',
                factoryUid:'',
                userUid:'',

                loading:true,
                editNew:false,
                editform:{
                    addname:'',
                    addphone:'',
                    selectSex:'',
                    addyear:'',
                    addWork:'',
                    addNum:'',
                    addID:'',
                    addaddress:'',
                    factoryWorkerUid:'',
                },
                unallowableUid:'',
                showunable:true,
                addable:false,
                deleteunable:false,
            }
        },
        created () {
            this.factoryWorkerUid = this.$route.query.pid
            this.factoryUid = this.$route.query.fid
            this.userUid = this.$route.query.uid
        },
        components:{
            TopHeader,
        },
        mounted () {
            this.getUser();
            this.getContract();
            this.getfaceResult();
            this.getallowable();
        },
        methods:{
            getUser () {
                request.get("factoryUser/selectFactoryWorker", {
                    factoryWorkerUid:this.factoryWorkerUid,
                })
                .then(response => {
                    if(response.data.code === 200){
                        this.content = response.data.data.factoryWorker
                    }else{
                        return    
                    }
                })
                .catch(ex => {
                console.log(ex,"rex")
                });                
            },
            getContract () {
                request.get("/factoryUser/selectFactoryWorkerContractList", {
                    userUid:this.userUid,
                    factoryUid:this.factoryUid,
                    pageNumStr:this.limit,
                    pageIntStr:this.page,
                })
                .then(response => {
                    if(response.data.code === 200){
                        this.Contract = response.data.data.factoryWorkerContractList
                        if(this.Contract.length === 0){
                            this.showNothing = false
                        }
                    }else{
                        return    
                    }
                })
                .catch(ex => {
                console.log(ex,"rex")
                });                   
            },
            getfaceResult () {
                request.get("/factoryUser/selectFactoryWorkerFaceList", {
                    userUid:this.userUid,
                    factoryUid:this.factoryUid,
                    pageNumStr:this.limit,
                    pageIntStr:this.page,
                })
                .then(response => {
                    if(response.data.code === 200){
                        this.faceResult = response.data.data.factoryWorkerFaceList
                        if(this.faceResult.length === 0){
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
            getallowable () {
                request.post("/factoryUser/addUnallowable", {
                    userUid:this.userUid,
                    factoryUid:this.factoryUid,
                })
                .then(response => {
                    if(response.data.code === 200){
                        console.log(response,"Res")
                        this.unallowableUid = response.data.data.unallowableUid
                        if(this.unallowableUid === ''){
                            this.showunable = false
                        }else{
                            this.showunable = true
                        }
                    }
                })
                .catch(ex => {
                console.log(ex,"rex")
                });                   
            },
            edit () {
                this.editform.addname = this.content.userName
                this.editform.addphone = this.content.userPhone
                this.editform.selectSex = this.content.sex
                this.editform.addyear = this.content.age
                this.editform.addWork = this.content.worker
                this.editform.addNum = this.content.workerId
                this.editform.addID = this.content.cardUid
                this.editform.addaddress = this.content.address
                this.editform.factoryWorkerUid = this.content.factoryWorkerUid
                this.editNew = true
            },
            editSure () {
                if(this.editform.addname === '' || this.editform.addname === null){
                    this.$Message.error('姓名不能为空');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                if(this.editform.addphone === '' || this.editform.addphone === null){
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
                if(this.editform.selectSex === '' || this.editform.selectSex === null){
                    this.$Message.error('请选择性别');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                if(this.editform.addyear === '' || this.editform.addyear === null){
                    this.$Message.error('年龄不能为空');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                if(this.editform.addWork === '' || this.editform.addWork === null){
                    this.$Message.error('岗位不能为空');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                if(this.editform.addWork === '' || this.editform.addWork === null){
                    this.$Message.error('工号不能为空');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                if(this.editform.addID === '' || this.editform.addID === null){
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
                if(this.editform.addaddress === '' || this.editform.addaddress === null){
                    this.$Message.error('现居住地不能为空');
                    this.loading = false
                    this.$nextTick(() => {this.loading = true;});
                    return
                }
                request.post("/factoryUser/updateFactoryWorker", {
                    factoryUid:this.factoryUid,
                    userName:this.editform.addname,
                    userPhone:this.editform.addphone,
                    cardUid:this.editform.addID,
                    worker:this.editform.addWork,
                    workerId:this.editform.addNum,
                    age:this.editform.addyear,
                    sex:this.editform.selectSex,
                    address:this.editform.addaddress,
                    factoryWorkerUid:this.editform.factoryWorkerUid
                })
                .then(response => {
                    if(response.data.code === 200){
                        this.editNew = false
                        this.$Message.success('编辑成功');
                        this.getUser();
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
            addUnallowable () {
                this.addable = true
            },   
            sureable () {
                request.post("/factoryUser/addUnallowable", {
                    userUid:this.userUid,
                    factoryUid:this.factoryUid,
                })
                .then(response => {
                    if(response.data.code === 200){
                        this.addable = false
                        this.$Message.success('禁用成功')
                        this.getallowable();
                    }
                })
                .catch(ex => {
                console.log(ex,"rex")
                });                                  
            }, 
            deteleUnallowable () {
                this.deleteunable = true
            },   
            suredeleteable () {
                request.post("/factoryUser/deleteUnallowable", {
                    unallowableUid:this.unallowableUid
                })
                .then(response => {
                    if(response.data.code === 200){
                        this.deleteunable = false
                        this.$Message.success('启用成功')
                        this.getallowable();
                    }
                })
                .catch(ex => {
                console.log(ex,"rex")
                });                                  
            },     
            back () {
                this.$router.go(-1)
            },
            gotoPage (val) {
                console.log(val)
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
.main_center{
    width: 100%;
    height:220px;
    background: #fff;
}
.center_top{
    width: 100%;
    height:80px;
    margin-top: 20px;
}
.center_left{
    width: 50%;
    height:60px;
    float: left;
    padding-left:60px;
    padding-top: 20px;
}
.center_left>span:nth-child(1){
    display: inline-block;
    width: 50px;
    height:100%;
    float: left;
}
.center_left>span:nth-child(2){
    display: inline-block;
    width: 100px;
    height:100%;
    font-size: 16px;
    color:#19233C;
    float: left;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.center_left>span:nth-child(3){
    display: inline-block;
    width: 80px;
    height:100%;
    font-size: 16px;
    color:#19233C;
    float: left;
}
.center_right{
    width: 50%;
    height:60px;
    float: left;
    padding-top: 10px;
    text-align: right;
    padding-right:50px;
}
.center_Detail{
    width: 100%;
    height:60px;
    line-height: 60px;
}
.single{
    width: 20%;
    height:60px;
    line-height: 60px;
    text-align: left;
    font-size: 14px;
    float: left;
    padding-left: 50px;
}
.table{
    width: 100%;
    max-height:520px;
    border-collapse:collapse;
    font-size: 13px;
}
.table>tr>th{
    height: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-align: left;
    padding-left:50px;
}
.table>tr{
    border-bottom:1px solid #DEE2ED;
}
.table>tr>td{
    height:55px;
    text-align: left;
    padding-left:50px;
}
.trow:hover{
    background: #ebf7ff;
    box-shadow: 1px 1px 10px #ccc;
}
.showNothing{
    width: 100%;
    height:100%;
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