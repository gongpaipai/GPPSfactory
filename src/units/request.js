import axios from 'axios'
import {getToken} from "./global";
import loadingImg from '@/assets/loading.gif'

// 创建axios实例
// const service = axios.create({
//   baseURL: ' http://localhost:8080',
//   timeout: 15000 // 请求超时时间
// })

const CancelToken = axios.CancelToken;
export const HOST='http://192.168.124.4:8666/gppsaas/'

//请求拦截器
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})


axios.defaults.baseURL = HOST

//设置默认请求头
axios.defaults.headers = {
  // 'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/x-www-form-urlencoded',
}
//设置超时时间
axios.defaults.timeout = 15000

//设置头文件配置
function getHeaders(upload=false) {
  let token=getToken()
  let headers_config={
    "Token": token,
  };
  if(upload){
    headers_config['Content-Type']='multipart/form-data'
  }
  return headers_config
}
// 页面loading配置
export const loading = {
  start: () => {
    let htmlLevel1 ='<div id="loadingContainer" class="loadingContainer" style="width: 100%;height: 100%;position: fixed;background: #E0E0E0;bottom: 0;text-align: center;opacity: 0.5;z-index:1000">'
    let hmtlLevel2='<img src='+ loadingImg +' class="loadingImg" style="display: inline-block;width: 2rem; height: 2rem;position: absolute;top: 50%; left: 50%; margin-top: -62px; margin-left: -62px;"></div>'
    if (document.getElementById('loadingContainer')) {
      document.getElementById('loadingContainer').remove()
      document.body.append(htmlLevel1 + hmtlLevel2)
    }
  },
  end: () => {
    setTimeout(() => {
      if(document.getElementById('loadingContainer')) {
        document.getElementById('loadingContainer').remove()
      }
    }, 1)
  }
}
export default {
  //get请求
  get(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        params: param,
        // cancelToken: new CancelToken(c => {
        //   cancel = c
        // }),
        headers:getHeaders(),
      }).then(res => {
        switch (res.data.code) {
          case 200:
            resolve(res)
            break
          case 400:
            console.log(res,"400")
            break
          case 401:
            console.log(res,"401")
            break
          default:
            reject(res)
        }
      }).catch(res=>{
        console.log('error',res)
      })
    })
  },
  put(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'put',
        url,
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        }),
        headers:getHeaders()
      }).then(res => {
        if (res.data.code === 200) {
          resolve(res)
        } else if(res.data.code === 400){
          console.log(res,"400")
        } else if (res.data.code === 401) {
          console.log(res,"401")
        }else {
          reject(res)
        }
      }).catch(res=>{
        console.log('error',res)
      })
    })
  },
  delete(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url,
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        }),
        headers:getHeaders()
      }).then(res => {
        if (res.data.code === 200) {
          resolve(res)
        } else if(res.data.code === 400){
          console.log(res,"400")
        } else if (res.data.code === 401) {
          console.log(res,"401")
        }else {
          reject(res)
        }
      }).catch(res=>{
        console.log('error',res)
      })
    })
  },

  //post请求(表单请求)
  post(url, param) {
    return new Promise((resolve, reject) => {
      console.log("进入请求")
      axios({
        url: url,
        method: 'post',
        data: param,
        transformRequest: [function (data) {
          // Do whatever you want to transform the data
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }],
        // cancelToken: new CancelToken(c => {
        //   cancel = c
        // }),
        headers:getHeaders()
      }).then(res => {
        if (res.data.code === 200) {
          resolve(res)
        }
        if (res.data.code === 400) {
          console.log(res,"400")
        }
        if (res.data.code === 401) {
          console.log(res,"401")
        } else {
          reject(res)
        }
      })
    })
  },

  upload(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        url: url,
        method: 'post',
        data: param,
        // cancelToken: new CancelToken(c => { 
        //   cancel = c
        // }),
        headers:getHeaders(true)
      }).then(res => {
        if (res.data.code === 200) {
          resolve(res)
        }else if(res.data.code === 400){
          console.log(res,"400")
        } else {
          reject(res)
        }
      }).catch(ex=>{
        console.log('error',ex)
      })
    })
  },

}
