<template>
  <div>
    <!-- 面包屑导航 -->
    <breadNav item1="权限管理" item2="权限列表"></breadNav>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" type='index'></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="200"></el-table-column>
      <el-table-column prop="path" label="路径" width="200"></el-table-column>
      <el-table-column label="层级" width="200">
        <template slot-scope='level'>
          {{level.row.level | lv}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {rights} from '../api/api'
export default {
  name:'rights',
  data() {
    return {
      tableData: []
    };
  },
  created() {
    rights().then(backData=>{
      console.log(backData);
      if(backData.data.meta.status==200){
        this.tableData=backData.data.data
      }
    })
  },
  filters:{
    lv(val){
      switch(val){
        case '0':
        return '一级';
        case '1':
        return '二级';
        case '2':
        return '三级';
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>

