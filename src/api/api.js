import axios from "axios";
const http = axios.create({
  baseURL: "http://localhost:8888/api/private/v1/"
});

// 登录接口
export const login = (username, password) => {
  return http.post("login", {
    username,
    password
  });
};

// 左侧菜单获取
export const menus = () => {
  return http.get("menus", {
    headers: {
      Authorization: window.localStorage.getItem("token")
    }
  });
};
