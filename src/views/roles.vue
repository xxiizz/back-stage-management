<template>
  <div>
    <!-- 面包屑导航 -->
    <breadNav item1="权限管理" item2="角色列表"></breadNav>

    <!-- 按钮 -->
    <el-button type="success" plain @click="addRole">添加角色</el-button>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="data">
          <el-row v-for="tag in data.row.children" :key="tag.id">
            <el-col :span="6">
              <el-tag closable type @close='closeTag(data.row,tag)'>{{tag.authName}}</el-tag>
              <span class="el-icon-arrow-right"></span>
            </el-col>
            <el-col :span="18">
              <el-row v-for="item in tag.children" :key="item.id">
                <el-col :span="6">
                  <el-tag closable type="success" @close='closeTag(data.row,item)'>{{item.authName}}</el-tag>
                  <span class="el-icon-arrow-right"></span>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    closable
                    type="warning"
                    v-for="item1 in item.children"
                    :key="item1.id"
                    class="tags"
                    @close='closeTag(data.row,item1)'
                  >{{item1.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="data">
          <el-button type="primary" icon="el-icon-edit" plain size="mini" @click="edit(data.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="del(data.row)"></el-button>
          <el-button
            type="warning"
            icon="el-icon-star-off"
            plain
            size="mini"
            @click="right(data.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色对话框 -->
    <el-dialog :title="dialogTit" :visible.sync="rolesDialog">
      <el-form :model="form" :rules="rules" label-width="auto" ref="roleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 权限分配对话框 -->
    <el-dialog title="权限分配" :visible.sync="rightsDialog" width="30%">
      <el-tree
        ref='tree'
        :data="treeData"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedKey"
        :props="{label:'authName'}"
        :default-expand-all="true"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  roles,
  addRoles,
  editRole,
  delRole,
  rightsById,
  treeRights,
  setRights,
  delRight
} from "../api/api";
export default {
  name: "roles",
  data() {
    return {
      roleId:0,
      checkedKey: [],
      treeData: [],
      data: [],
      rightsDialog: false,
      editingId: 0,
      dialogFunc: "",
      dialogTit: "",
      tableData: [],
      rolesDialog: false,
      form: {
        roleName: "",
        roleDesc: ""
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    closeTag(row,tag){
      const roleId= row.id
      const rightId = tag.id
      delRight(roleId,rightId).then(backData=>{
        console.log(backData);
        row.children=backData.data.data
      })
    },
    setRights(){
      this.rightsDialog=false
      const halfChecked= this.$refs.tree.getHalfCheckedKeys()
      const checked = this.$refs.tree.getCheckedKeys()
      let rids =[...halfChecked,...checked].join(',')
      console.log(rids);
      setRights(this.roleId,rids).then(backData=>{
        console.log(backData);
        if(backData.data.meta.status==200){
          this.$message.success('设置权限成功')
          this.createRolesList()
        }
      })
    },
    right(data) {
      this.rightsDialog = true;
      this.roleId = data.id
      treeRights().then(backData => {
        // console.log(backData);
        this.treeData = backData.data.data;
        console.log(data);
        let func = data=>{
          if (data.children != undefined) {
            for (let i = 0; i < data.children.length; i++) {
              func(data.children[i]);
            }
          } else {
            this.checkedKey.push(data.id);
          }
          // console.log(this.checkedKey);
        };
        this.checkedKey=[]
        func(data);
      });
    },
    del(data) {
      this.$confirm("确认删除该角色?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delRole(data.id).then(backData => {
            if (backData.data.meta.status == 200) {
              this.$message.success("删除成功");
              this.createRolesList();
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
    edit(data) {
      this.rolesDialog = true;
      this.dialogFunc = "edit";
      this.dialogTit = "编辑角色";
      this.editingId = data.id;
    },
    addRole() {
      this.rolesDialog = true;
      this.dialogFunc = "add";
      this.dialogTit = "添加角色";
    },
    submitForm() {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          if (this.dialogFunc == "add") {
            addRoles(this.form).then(backData => {
              if (backData.data.meta.status == 201) {
                this.$message.success("创建成功");
                this.createRolesList();
                this.rolesDialog = false;
              }
            });
          } else if (this.dialogFunc == "edit") {
            editRole(this.editingId, this.form).then(backData => {
              console.log(backData);
              if (backData.data.meta.status == 200) {
                this.$message.success("编辑成功");
                this.createRolesList();
                this.rolesDialog = false;
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    createRolesList() {
      roles().then(backData => {
        // console.log(backData);
        this.tableData = backData.data.data;
      });
    }
  },
  created() {
    this.createRolesList();
  }
};
</script>

<style lang="less" scoped>
.tags {
  margin: 5px;
}
</style>

