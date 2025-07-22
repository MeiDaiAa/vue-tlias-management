import axios from 'axios'
import router from "../router";
import { ElMessage } from 'element-plus';

//创建axios实例对象
const request = axios.create({
  baseURL: '/api',
  timeout: 600000
})
request.interceptors.request.use(
  (config) => { //成功回调
    //设置请求头，添加token
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.token) {
      config.headers.token = user.token
    }
    return config
  },
  (error) => { //失败回调
    return Promise.reject(error)
  }

)



//axios的响应 response 拦截器
request.interceptors.response.use(
  (response) => { //成功回调
    return response.data
  },
  (error) => { //失败回调
    //响应码码为401，表示token失效，返回登录页面
    ElMessage.error("登录已失效，请重新登录！")
    if(error.response.status === 401){
      router.push('/login')
    }


    return Promise.reject(error)
  }
)

export default request