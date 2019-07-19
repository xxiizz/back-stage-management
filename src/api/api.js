import axios from "axios";
import Vue from "vue";
import router from "../router/router";
const http = axios.create({
  baseURL: "http://localhost:8888/api/private/v1/"
});
// 添加请求拦截器
http.interceptors.request.use(
  //发送请求前加上token
  function(config) {
    // console.log(config);
    config.headers.Authorization = window.localStorage.getItem("token");
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  function(response) {
    // 查看返回的数据是否反馈token错误
    // console.log(response);
    if (response.data.meta.msg == "无效token") {
      window.localStorage.clear();
      new Vue().$message.error("信息验证错误,请重新登录");
      router.push("/login");
    }
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

// 登录接口
export const login = (username, password) => {
  return http.post("login", {
    username,
    password
  });
};

// 左侧菜单获取
export const menus = () => {
  return http.get("menus");
};

// 用户数据列表获取
export const users = (pagenum, pagesize, query) => {
  return http.get("users", {
    params: {
      query,
      pagenum,
      pagesize
    }
  })
};

// 修改用户状态
export const state = (uid,type)=>{
  return http.put(`users/${uid}/state/${type}`)
}

// 根据id查询用户信息
export const userById = id=>{
  return http.get(`users/${id}`)
}

// 所有权限列表
export const rights = ()=>{
  return http.get('rights/list')
}

// 删除单个用户
export const deleteUser = id=>{
  return http.delete(`users/${id}`)
}

// 新增用户
export const addUser = ({username,password,email,mobile})=>{
  return http.post('users',{username,password,email,mobile})
}

// 修改用户信息
export const updatedUser = (id,email,mobile)=>{
  return http.put(`users/${id}`,{email,mobile})
}

// 分配用户角色
export const roleUser = (id,rid)=>{
  return http.put(`users/${id}/role`,{
    rid
  })
}

// 角色列表
export const roles = ()=>{
  return http.get('roles')
}

// 订单数据列表
export const orders = ({query,pagenum,pagesize})=>{
  return http.get('orders',{
    params:{query,pagenum,pagesize}
  })
}

// 修改订单状态
export const editOrder = orderInfo =>{
  return http.put(`orders/${orderInfo.id}`,orderInfo)
}
// 商品分类数据列表
export const categories = ()=>{
  return http.get('categories')
}