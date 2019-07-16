<template>
  <div class="main">
    <div class="login">
      <h2>用户登录</h2>
      <el-form
        :label-position="'top'"
        label-width="80px"
        :model="formData"
        :rules="rules"
        :status-icon="true"
        ref="loginForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" class="elinput"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password" class="elinput"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" id="btn" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from "../api/api";
export default {
  name: "login",
  data() {
    return {
      boo: true,
      formData: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在3-8个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 11, message: "长度在6-11个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(vaild => {
        if (vaild) {
          login(this.formData.username, this.formData.password).then(
            backData => {
              // console.log(backData);
              if(backData.data.meta.status==400){
                this.$message.error(backData.data.meta.msg)
              }
              else if(backData.data.meta.status==200){
                this.$message.success(backData.data.meta.msg)
                window.localStorage.setItem('token',backData.data.data.token)
                this.$router.push('/index')
              }
            }
          );
        }
        else{
          this.$message.warning('带星号选项为必填项')
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@myBgc: #324152;

.main {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: @myBgc;
  .login {
    width: 575px;
    height: 440px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    box-sizing: border-box;
    padding: 60px 40px;
    h2 {
      margin-bottom: 20px;
    }
    #btn {
      width: 100%;
    }
    .is-success {
      .elinput {
        outline: 1px solid #67c23a;
      }
    }
  }
}
</style>


