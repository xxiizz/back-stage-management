<template>
  <div>
    <!-- 面包屑导航 -->
    <breadNav item1="用户管理" item2="用户列表"></breadNav>

    <el-row>
      <el-col :span="5">
        <!-- 输入框 -->
        <el-input
          placeholder="请输入内容"
          v-model.trim="inputVal"
          class="input-with-select"
          clearable
          @keyup.enter.native="createUserList"
        >
          <el-button slot="append" icon="el-icon-search" @click="createUserList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <!-- 按钮 -->
        <el-button type="primary" class="btn" @click="addDialog=true">添加用户</el-button>
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
        <template slot-scope="info">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="editUser(info.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="deleteUser(info.row.id)"
          ></el-button>
          <el-button
            type="warning"
            icon="el-icon-star-off"
            plain
            size="mini"
            @click="updatedRole(info.row)"
          ></el-button>
        </template>
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

    <!-- 弹框 -->
    <!-- 修改用户弹框 -->
    <el-dialog title="修改用户" :visible.sync="updatedDialog">
      <el-form :model="updatedForm" label-width="100px" :rules="rules" ref="updatedForm">
        <el-form-item label="用户名" :required="true">
          <el-input v-model="updatedForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updatedForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="updatedForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatedDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增用户弹框 -->
    <el-dialog title="添加用户" :visible.sync="addDialog">
      <el-form :model="addForm" label-width="100px" ref="addForm" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色弹框 -->
    <el-dialog title="分配角色" :visible.sync="roleDialog">
      <p class="form">当前用户&nbsp;&nbsp;&nbsp;{{userInRole}}</p>
      <span class="form">请选择角色&nbsp;&nbsp;&nbsp;</span>
      <el-select v-model="selectRole" placeholder="请选择">
        <el-option
          v-for="item in roleList"
          :label="item.roleName"
          :value="item.id"
          :disabled="item.disabled"
        ></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  users,
  state,
  userById,
  deleteUser,
  addUser,
  updatedUser,
  roleUser,
  roles
} from "../api/api";
export default {
  name: "users",
  data() {
    return {
      // 分页功能数据
      currentPage: 1,
      pageSize: 5,
      total: 10,
      inputVal: "",
      // 表格数据
      tableData: [],
      //修改信息数据
      updatedDialog: false,
      updatedForm: {
        username: "",
        email: "",
        mobile: ""
      },
      editUserId: "",
      // 效验规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        email: [{ type: "email", message: "邮箱格式错误", trigger: "blur" }]
      },
      // 添加用户数据
      addDialog: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //分配用户角色
      roleDialog: false,
      userInRole: "",
      userInRoleName: "",
      userInRoleId: "",
      userInRoleRid:0,
      selectRole: "",
      roleList: []
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
      state(id, status).then(backData => {
        if (backData.data.meta.status == 200) {
          this.$message.success("修改用户状态成功");
        }
      });
    },
    editUser(info) {
      this.updatedDialog = true;
      this.updatedForm.username = info.username;
      this.updatedForm.email = info.email;
      this.updatedForm.mobile = info.mobile;
      this.editUserId = info.id;
    },
    // 提交编辑表单
    submitEditForm() {
      this.updatedDialog = false;
      this.$refs.updatedForm.validate(valid => {
        if (valid) {
          updatedUser(
            this.editUserId,
            this.updatedForm.email,
            this.updatedForm.mobile
          ).then(backData => {
            if (backData.data.meta.status == 200) {
              this.$message.success(backData.data.meta.msg);
              this.createUserList();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteUser(id) {
      this.$confirm("确认删除该用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUser(id).then(backData => {
            if (backData.data.meta.status == 200) {
              this.createUserList();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 提交新增表单
    submitAddForm() {
      this.addDialog = false;
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUser(this.addForm).then(backData => {
            console.log(backData);
            if (backData.data.meta.status == 201) {
              this.$message.success("创建用户成功");
              this.createUserList();
            } else if (backData.data.meta.status == 400) {
              this.$message.warning(backData.data.meta.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 修改用户角色
    updatedRole(info) {
      this.roleDialog = true;
      userById(info.id).then(backData => {
        console.log(backData);
        this.userInRole = backData.data.data.username;
        this.userInRoleId = backData.data.data.id;
        this.userInRoleRid = backData.data.data.rid;
      });
      roles().then(backData => {
        console.log(backData);
        if (backData.data.meta.status == 200) {
          this.roleList = backData.data.data;
          this.roleList.unshift({
            id: "-1",
            roleName: "请选择角色",
            disabled: true
          });
          for (let i = 0; i < backData.data.data.length; i++) {
            if (this.userInRoleRid == backData.data.data[i].id) {
              this.selectRole = backData.data.data[i].id;
            }
          }
        }
      });
    },
    submitRole() {
      roleUser(this.userInRoleId, this.selectRole).then(backData => {
        console.log(backData);
        if (backData.data.meta.status == 200) {
          this.$message.success(backData.data.meta.msg);
          this.roleDialog = false;
          this.createUserList();
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
.form {
  margin-bottom: 20px;
  margin-left: 20px;
}
</style>

