<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="nav">
    <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{item1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{item2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
    props:[
        'item1',
        'item2'
    ]
};
</script>

<style lang="less" scoped>
.nav{
    height: 45px;
    line-height: 45px;
    background-color: #d3dce6;
    padding-left: 10px;
    font-size: 14px;
}
</style>

