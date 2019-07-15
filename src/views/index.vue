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
        <a href="#">退出</a>
      </el-col>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu default-active="2" class="el-menu-vertical-demo" :unique-opened="true">
          <el-submenu index="1">
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
          </el-submenu>
          <el-submenu index="2">
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
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    name:'index'
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
  }
}
</style>

