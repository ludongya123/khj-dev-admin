import axios from 'axios'
import router from '@/router'
axios.defaults.timeout = 10000
// 在request header中添加token信息用于当前用户的校验''USERTOKEN_&&_20180905112425617181770065152318_&&_5dd2ec5ff8ab41b69df5f09ff04fac43'//
axios.interceptors.request.use(config => {
  // 添加请求头
  config.headers['Authorization'] = sessionStorage.getItem('userTag')
  return config
}, error => {
  return Promise.reject(error)
})


if (process.env.NODE_ENV === 'development') {
  // 研发环境
  axios.defaults.baseURL = 'https://rryl.zixianzi.com/lipstickManager'
} else {
  // 生产环境
  axios.defaults.baseURL = 'https://rryl.zixianzi.com/lipstickManager'
}

// 判断后端是否颁发了新的token

axios.interceptors.response.use(res => {

  if (res.data.code == '40001') { // 登录过期
    sessionStorage.removeItem('userTag')
    router.replace('/Login')
  }

  return res
}, error => {

  return Promise.reject(error)
})

// 登录
export const Login = params => {
  return axios.post('/api/login', params)
}
//  注册
export const Regist = params => {
  return axios.post('/api/login/signIn', params)
}
// 获取验证码
export const getTelCode = params => {
  return axios.post('/api/sms/sendCode', params)
}
// 获取用户信息
export const getUserBaseInfo = params => {
  return axios.get('/api/app', { params: params })
}
// 上传图片
export const uploadPic = (params, t) => {
  return axios.put('/api/file/uploadImg/' + t, params)
}
// 修改财务信息
export const reviseCWInfo = params => {
  return axios.put('/api/app/resetFinance', params)
}
// 修改密码
export const revisePsd = params => {
  return axios.put('/api/app/resetPassword', params)
}
// 用户提现操作
export const startDrawCash = params => {
  return axios.post('/api/balance/cash', params)
}
// 点击提现须知不再提示
export const knewsNotice = params => {
  return axios.put('/api/balance/knew', params)
}
// 获取提现记录
export const cashList = params => {
  return axios.get('/api/balance/cashList', { params: params })
}
// 获取收益，pv,uv数据
export const revenueList = params => {
  return axios.get('/api/balance/revenueList', { params: params })
}
// 订单记录
export const orderList = params => {
  return axios.get('/api/balance/orderList', { params: params })
}
// 结算确认函下载
export const downloadAccount = params => {
  return axios.get('/api/file/downloadAccount', {
    params: params,
    responseType: "blob",
    headers: {
      Accept: "application/json"
    }
  })
}
// 结算记录
export const accountList = params => {
  return axios.get('/api/balance/accountList', { params: params })
}
// 下载收益
export const downRevenue = params => {
  return axios.get('/document/balance/downRevenue', {
    params: params,
    responseType: "blob",
    headers: {
      Accept: "application/json"
    }
  })
}
// 获取配置相关
export const getConfig = params => {
  return axios.get('/api/config' ,{ params: params })
}