<template>
    <div>
        <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="header">
                      <div class="header_left">
                          <img src="../assets/img/logo.png" class="top_img" alt="">
                      </div>
                      <div class="header_center">
                          <a>sass管理后台</a>
                      </div>
                      <div class="header_right"  @mouseover="showUserMsg(true)" @mouseout="showUserMsg(false)">
                          <div class="img_left">
                              <img src="../assets/img/person.png" alt="" style="width:34px;margin-top:29px;">
                          </div>
                          <div class="name_detail">
                              <span>{{this.factoryName}}</span>
                              <span><Icon type="md-arrow-dropdown" style="font-size:20px;"/></span>
                          </div>
                          <div class="hidden animated bounceInRight" v-show="isShowUserMsg">
                              <a @click="logout">安全退出</a>
                          </div>
                      </div>
                  </div>
                </Menu>
            </Header>    
    </div>    
</template>
<script>
export default {
    name: "TopHeader",
    data () {
        return{
            isShowUserMsg:false,
            factoryName:'',
        }
    },
    created () {
        this.factoryName = window.localStorage.getItem('factoryName')
    },
    mounted () {

    },
    methods:{
        showUserMsg (res) {
         this.isShowUserMsg = res
        },
        logout () {
            this.$router.push({path:'/login'})
            this.$Message.success("已登出")
            window.localStorage.removeItem('TOKEN')
        },
    },
}
</script>
<style scoped>
.hidden{
    width: 200px;
    height:50px;
    position: absolute;
    bottom:-50px;
    right:10px;
    background: rgb(243, 246, 253);
}
.hidden>a{
    display: block;
    width: 160px;
    height:30px;
    margin:10px 20px;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
    color:#515a6e;
    background: #fff;
    border:1px solid #dcdee2;
    border-radius: 3px;
}
.hidden>a:hover{
    color: #2d8cf0;
}
.ivu-layout-header{
  background: #fff;
  height:92px;
  line-height: 92px;
  border-bottom:1px solid #ccc;
  padding:0;
}
.header{
    width: 100%;
    height:92px;
    border-bottom:1px solid #ccc;
    background: #fff;
}
.header_left{
    width: 170px;
    height:92px;
    line-height: 92px;
    text-align: center;
    float: left;
}
.header_center{
    float: left;
    width: 200px;
    height:92px;
}
.header_center>a{
    display: block;
    width: 100%;
    height:36px;
    line-height: 36px;
    margin-top: 28px;
    border-left:1px solid #ccc;
    padding-left: 20px;
    color:#000;
    font-size: 15px;
    text-align: left;
    float: left;
}
.header_right{
    width: 200px;
    height:92px;
    float: right;
    cursor: pointer;
    padding-right: 40px;
    position: relative;
}
.img_left{
    width: 30%;
    height:92px;
    float: left;
}
.name_detail{
    width: 70%;
    height:92px;
    float:left;
}
.name_detail>span:nth-child(1){
    display: inline-block;
    width: 80%;
    height:92px;
    line-height: 92px;
    float: left;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.name_detail>span:nth-child(2){
    display: inline-block;
    width: 20%;
    height:92px;
    line-height: 92px;
    float: left;
}
.top_img{
    height:30px;
    margin-top: 30px;
}
</style>