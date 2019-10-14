<template>
    <div id="content">
        <div class="banner_left">
            <a><img src="../assets/img/Lbanner.png" style="width:750px;height:550px;"  alt=""></a>
        </div>
        <div class="banner_right">
            <div class="title">
                <span><a><img src="../assets/img/logo-1.png" style="margin-top:5px;" alt=""></a></span>
                <span><a>SAAS服务平台</a></span>
            </div>
            <div class="name">
                <div class="accountblock">
                    <label class="label">
                        <img class="iconhead" src="../assets/img/user.png">
                    </label>
                    <input type="text" class="accountText blackText" name="uid" autocomplete="off" id="uid"  placeholder="请输入您的账号" v-model="account" value="">
                </div>
                <div class="accountblock" style="margin-top:20px;">
                    <label class="label">
                        <img class="iconhead" src="../assets/img/password.png">
                    </label>
                    <input type="password" class="accountText blackText"  autocomplete="off"   placeholder="请输入您的密码" v-model="password" value="">
                </div>
                <div class="accountblock1" style="margin-top:20px;">
                    <label class="label">
                        <img class="iconhead" src="../assets/img/prove.png">
                    </label>
                    <input type="text" class="accountText blackText" name="imageCode" id="imageCode" v-model="imageCode" placeholder="图形码">
                    <div id="imgCode"></div>
                    <div class="blank"></div>
                    <div class="blank1"></div>
                </div>
            </div>
            <div class="login">
                <a @click="login">登录</a>
            </div>
        </div>
    </div>
</template>

<script>
import request from "@/units/request";
export default {
    data () {
      return {
        account:'',
        password:'',
        imageCode: '',
        content:'',
      }
    },
    created () {
      let that = this;
      document.onkeydown =function(e){
           e = window.event || e;
        if(that.$route.path=='/login'&&(e.code=='Enter'||e.code=='enter')){
          that.login();
        }
      }
    },
    mounted () {
      this.getImgCode = this.getGVerify('imgCode')
    },
    methods:{
      login () {
        if (this.account === '' || this.account === null) {
          this.$Message.warning("请输入您的账号！")
          return false
        }
        if (this.password === '' || this.password === null) {
          this.$Message.warning("请输入您的密码！")
          return false
        }
        if (this.imageCode == '' || this.imageCode == null) {
          this.$Message.warning("请输入图形码！")
          return false
        }
        if (!this.getImgCode.validate(this.imageCode)) {
          this.$Message.warning("图形码不正确！")
          return false
        }
        request.post("/user/login", {
            wxCode:'',
            userRole:0,
            userPhone:this.account,
            userPassword:this.password,
        })
        .then(response => {
            console.log(response,"res")
            localStorage.setItem('TOKEN',response.data.data.token)
            localStorage.setItem('factoryUid',response.data.data.user.factoryUid)
            localStorage.setItem('factoryName',response.data.data.user.factoryName)
            this.$router.push({path:'/protal'})
            this.$Message.success("登录成功")
        })
        .catch(ex => {
           this.$Message.error(ex.data.msg)
        });

      },
      getGVerify: function (id) {
        function GVerify(options) { //创建一个图形验证码对象，接收options对象为参数
          this.options = { //默认options参数值
            id: id, //容器Id
            canvasId: "verifyCanvas", //canvas的ID
            width: "120", //默认canvas宽度
            height: "40", //默认canvas高度
            type: "number", //图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
            code: ""
          }

          if (Object.prototype.toString.call(options) == "[object Object]") { //判断传入参数类型
            for (var i in options) { //根据传入的参数，修改默认参数值
              this.options[i] = options[i];
            }
          } else {
            this.options.id = options;
          }

          this.options.numArr = "0,1,2,3,4,5,6,7,8,9".split(",");
          this.options.letterArr = getAllLetter();

          this._init();
          this.refresh();
        }

        GVerify.prototype = {
          /**版本号**/
          version: '1.0.0',

          /**初始化方法**/
          _init: function () {
            var con = document.getElementById(this.options.id);
            var canvas = document.createElement("canvas");
            /*this.options.width = con.offsetWidth > 0 ? con.offsetWidth : "100";
            this.options.height = con.offsetHeight > 0 ? con.offsetHeight : "30";*/
            canvas.id = this.options.canvasId;
            canvas.width = this.options.width
            // canvas.width = document.body.clientWidth/2 - this.options.width;
            canvas.height = this.options.height;
            canvas.style.cursor = "pointer";
            canvas.innerHTML = "您的浏览器版本不支持canvas";
            con.appendChild(canvas);
            var parent = this;
            canvas.onclick = function () {
              parent.refresh();
            }
          },

          /**生成验证码**/
          refresh: function () {
            this.options.code = '';
            var canvas = document.getElementById(this.options.canvasId);
            if (canvas.getContext) {
              var ctx = canvas.getContext('2d');
            }
            ctx.textBaseline = "middle";

            // this.options.width = document.body.clientWidth/2 - this.options.width;

            ctx.fillStyle = randomColor(180, 240);
            ctx.fillRect(0, 0, this.options.width, this.options.height);

            if (this.options.type == "blend") { //判断验证码类型
              var txtArr = this.options.numArr.concat(this.options.letterArr);
            } else if (this.options.type == "number") {
              var txtArr = this.options.numArr;
            } else {
              var txtArr = this.options.letterArr;
            }

            for (var i = 1; i <= 4; i++) {
              var txt = txtArr[randomNum(0, txtArr.length)];
              this.options.code += txt;
              ctx.font = '30px SimHei';
              //ctx.font = randomNum(this.options.height/2, this.options.height) + 'px SimHei'; //随机生成字体大小
              ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色
              /* ctx.shadowOffsetX = randomNum(-3, 3);
              ctx.shadowOffsetY = randomNum(-3, 3);*/
              ctx.shadowBlur = randomNum(-3, 3);
              ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
              var x = this.options.width / 5 * i;
              var y = this.options.height / 2;
              var deg = randomNum(-30, 30);
              /**设置旋转角度和坐标原点**/
              ctx.translate(x, y);
              ctx.rotate(deg * Math.PI / 180);
              ctx.fillText(txt, 0, 0);
              /**恢复旋转角度和坐标原点**/
              ctx.rotate(-deg * Math.PI / 180);
              ctx.translate(-x, -y);
            }
            /**绘制干扰线**/
            for (var i = 0; i < 4; i++) {
              ctx.strokeStyle = randomColor(40, 180);
              ctx.beginPath();
              ctx.moveTo(randomNum(0, this.options.width / 2), randomNum(0, this.options.height / 2));
              ctx.lineTo(randomNum(0, this.options.width / 2), randomNum(0, this.options.height));
              ctx.stroke();
            }
            /**绘制干扰点**/
            for (var i = 0; i < this.options.width / 4; i++) {
              ctx.fillStyle = randomColor(0, 255);
              ctx.beginPath();
              ctx.arc(randomNum(0, this.options.width), randomNum(0, this.options.height), 1, 0, 2 * Math.PI);
              ctx.fill();
            }
          },

          /**验证验证码**/
          validate: function (code) {
            var verifyCode = code.toLowerCase();
            var v_code = this.options.code.toLowerCase();
            if (verifyCode == v_code) {
              return true;
            } else {
              return false;
            }
          }
        }

        /**生成字母数组**/
        function getAllLetter() {
          var letterStr = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
          return letterStr.split(",");
        }

        /**生成一个随机数**/
        function randomNum(min, max) {
          return Math.floor(Math.random() * (max - min) + min);
        }

        /**生成一个随机色**/
        function randomColor(min, max) {
          var r = randomNum(min, max);
          var g = randomNum(min, max);
          var b = randomNum(min, max);
          return "rgb(" + r + "," + g + "," + b + ")";
        }

        return new GVerify(id);
      }
    },
}
</script>
<style scoped>
  #content{
    width: 100vw;
    height:100vh;
    background: url('../assets/img/cover.png') 100% 100%;
    background-size: cover;
    background-position: center;
    position: relative;
  }
  .banner_left{
    position: absolute;
    top:217px;
    left:245px;
  }
  .banner_right{
    position: absolute;
    top:265px;
    right:250px;
    width: 700px;
    height:430px;
    background: #fff;
    border:1px solid #fff;
    border-radius: 10px;
    box-shadow: 1px 1px 20px #ABE3FE;
  }
  .title{
    width: 100%;
    height:130px;
  }
  .title>span:nth-child(1){
    display: inline-block;
    width: 50%;
    height:130px;
    line-height: 130px;
    float: left;
  }
  .title>span:nth-child(1)>a{
    display: inline-block;
    width: 150px;
    height:40px;
    line-height: 40px;
    border-right:2px solid #ccc;
    text-align: center;
    float: right;
    margin-top: 45px;
  }
  .title>span:nth-child(2){
    display: inline-block;
    width: 50%;
    height:130px;
    float: left;
  }  
   .title>span:nth-child(2)>a{
     display: inline-block;
     width: 150px;
     height:30px;
     line-height: 30px;
     text-align: center;
     border:1px solid #0093FB;
     border-radius: 6px;
     font-size: 20px;
     color:#0093FB;
     margin:50px 0 0 20px;
     float: left;
   }
   .name{
     width: 100%;
     padding:0 180px 0 210px;
     position: relative;
   }
   #imgCode{
     position: absolute;
     right:180px;
     bottom:-16px;
   }
   .blank{
     width: 150px;
     height:25px;
     background: #fff;
     border: 1px solid #fff;
     border-radius: 30px;
     position: absolute;
     left:-80px;
     bottom:-120px;
   }
   .blank1{
     width: 150px;
     height:20px;
     background: #fff;
     border: 1px solid #fff;
     border-radius: 30px;
     position: absolute;
     left:-40px;
     bottom:-80px;
   }
   .label {
    position: relative;
    height: 20px;
    width: 40px;
    float: left;
    line-height: 20px;
    margin-top:10px;
    border-right:1px solid #ccc;
    }
  .accountblock{
    width: 100%;
    height:40px;
    line-height: 40px;
    text-align: center;
    border:1px solid #DEE2ED;
    border-radius: 4px;
  }
  .accountblock1{
    width: 60%;
    height:40px;
    line-height: 40px;
    text-align: center;
    border:1px solid #DEE2ED;
    border-radius: 4px;
  }
   .accountText {
    position: relative;
    float: left;
    margin-left: 10px;
    padding-left: 0;
    margin-top: 9px;
    font-size: 15px;
    outline: none;
    width: 70%;
    border: none;
    height: 20px;
}
.login{
  width: 100%;
  height:50px;
  padding:0 180px 0 210px;
  margin-top: 30px;
}
.login>a{
  display: block;
  width: 100%;
  height:50px;
  line-height: 50px;
  text-align: center;
  color:#fff;
  background: #0093FB;
  border:1px solid #0093FB;
  border-radius: 5px;
  font-size: 18px;
}
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
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
</style>
