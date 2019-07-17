<template>
  <el-container class="index">
    <el-header class="header">
      <el-col :span="4">
        <img src="../assets/logo.png" alt />
      </el-col>
      <el-col :span="19">
        <h2>有赞后台管理页面</h2>
      </el-col>
      <el-col :span="1">
        <a href="#" @click.prevent="logout">退出</a>
      </el-col>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu class="el-menu-vertical-demo" :unique-opened="true" :router="true">
          <el-submenu :index="item.order.toString()" v-for="item in menus">
            <template slot="title">
              <i class="el-icon-s-home"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                :index="'/index/'+childItem.path"
                v-for="(childItem, index) in item.children"
                :key="index"
                
              >
                <i class="el-icon-menu"></i>
                {{childItem.authName}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <!-- <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-home"></i>
              <span>导航一</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                选项1
              </el-menu-item>
              <el-menu-item index="1-2">
                <i class="el-icon-menu"></i>
                选项1
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>-->
        </el-menu>
      </el-aside>

      <el-main class="main"><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import { menus } from "../api/api";
export default {
  name: "index",
  data() {
    return {
      menus: []
    };
  },
  methods: {
    logout() {
      this.$confirm("确定要退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info "
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          this.$router.push("/login");
          window.localStorage.removeItem("token");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "请继续使用"
          });
        });
    }
  },
  created() {
    menus().then(backData => {
      console.log(backData);
      if (backData.status == 200) {
        this.menus = backData.data.data;
      }
    });
  }
};
</script>

<style lang="less" scoped>
.index {
  height: 100%;
  .header {
    height: 60px;
    background-color: #b3c0d1;
    line-height: 60px;
    h2 {
      text-align: center;
      color: white;
    }
    a {
      text-align: center;
      color: white;
      font-size: 14px;
      background-color: aquamarine;
      border-radius: 5px;
      padding: 2px;
    }
  }
  .main {
    background-color: #e9eef3;
    padding-top: 0;
  }
}
</style>

