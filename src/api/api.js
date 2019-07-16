import axios from 'axios'
const http = axios.create({
    baseURL:'http://localhost:8888/api/private/v1/'
})

// 登录接口
export const login = (username,password)=>{
    return http.post('login',{
        username,
        password
    })
}
