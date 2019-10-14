import router from '../router'

//token键值
export const TOKEN = 'API_TOKEN';
//页面大小
export const PAGESIZE = 20
//获取token
export function getToken() {
  let token = window.localStorage.getItem('TOKEN')
  if(token&&token!=='undefined'){
    return token
  }
  return ''
}


//判断是否是微信浏览器
export function isWx() {
  let ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('micromessenger') >= 0
}

//跳转页面
export function jumpTo(url) {
  router.push({path: url})
}


//格式化日期
export function dateFormat (fmt,date) {
  if(!date){
    date=new Date()
  }
  let o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "H+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
//获取随机数
export function getRandom(minNum,maxNum) {
  switch(arguments.length){
    case 1:
      return parseInt(Math.random()*minNum+1,10);
      break;
    case 2:
      return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
      break;
    default:
      return 0;
      break;
  }
}
