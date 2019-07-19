<template>
  <div>
    <!-- 面包屑导航 -->
    <breadNav item1="订单管理" item2="订单列表"></breadNav>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="300"></el-table-column>
      <el-table-column prop="order_price" label="订单价格"></el-table-column>
      <el-table-column label="是否付款">
        <template slot-scope="info">
          <el-tag type="success" v-if="info.row.order_pay!='0'" class="elTag">已付款</el-tag>
          <el-tag type="danger" v-if="info.row.order_pay=='0'" class="elTag">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="250"></el-table-column>
      <el-table-column prop="create_time" label="下单时间" width="250">
        <template slot-scope="info">
          <span>{{info.row.create_time |  timeFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="sizeChange"
      @current-change="currentChange"
    ></el-pagination>
  </div>
</template>

<script>
import { orders } from "../api/api";
export default {
  name: "orders",
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 10
    };
  },
  methods: {
    createOrdersList() {
      orders({
        pagenum: this.currentPage,
        pagesize: this.pageSize
      }).then(backData => {
        console.log(backData);
        if (backData.data.meta.status == 200) {
          this.total = backData.data.data.total;
          this.tableData = backData.data.data.goods;
        }
      });
    },
    sizeChange(size) {
      this.currentPage = 1;
      this.pageSize = size;
      this.createOrdersList();
    },
    currentChange(current) {
      this.currentPage = current;
      this.createOrdersList();
    }
  },
  created() {
    this.createOrdersList();
  }
};
</script>

<style lang="less" scoped>
.elTag {
  margin-left: 23px;
}
</style>

