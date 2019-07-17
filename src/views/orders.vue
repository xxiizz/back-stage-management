<template>
  <div>
    <!-- 面包屑导航 -->
    <breadNav item1="订单管理" item2="订单列表"></breadNav>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- @size-change="handleSizeChange"
    @current-change="handleCurrentChange"-->
    <el-pagination
      :current-page="1"
      :page-sizes="[5, 10, 11, 15]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="207"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputVal: "",
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>

</style>

