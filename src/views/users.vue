<template>
  <div>
    <!-- 面包屑导航 -->
    <breadNav item1="用户管理" item2="用户列表"></breadNav>

    <el-row>
      <el-col :span="5">
        <!-- 输入框 -->
        <el-input placeholder="请输入内容" v-model="inputVal" class="input-with-select" clearable>
          <el-button slot="append" icon="el-icon-search" @click="createUserList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <!-- 按钮 -->
        <el-button type="primary" class="btn">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="300"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="300"></el-table-column>
      <el-table-column label="用户状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="200">
        <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        <el-button type="warning" icon="el-icon-star-off" plain size="mini"></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[3, 5, 7, 10]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import { users } from "../api/api";
import { state } from "../api/api";
export default {
  name: "users",
  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      total: 10,
      inputVal: "",
      tableData: []
    };
  },
  methods: {
    createUserList() {
      users(this.currentPage, this.pageSize, this.inputVal).then(backData => {
        console.log(backData);
        this.total = backData.data.data.total;
        this.tableData = backData.data.data.users;
      });
    },
    handleSizeChange(size) {
      this.currentPage = 1;
      this.pageSize = size;
      this.createUserList();
    },
    handleCurrentChange(current) {
      this.currentPage = current;
      this.createUserList();
    },
    changeState(id, status) {
      console.log(status, id);
      state(id, status).then(backData => {
        if(backData.data.meta.status==200){
          this.$message.success('修改用户状态成功')
        }
      });
    }
  },
  created() {
    this.createUserList();
  }
};
</script>

<style lang="less" scoped>
.btn {
  margin-left: 5px;
}
</style>

