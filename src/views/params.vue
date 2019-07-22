<template>
  <div>
    <!-- 面包屑导航 -->
    <breadNav item1="商品管理" item2="分类参数" class="nav"></breadNav>

    <!-- 提示框 -->
    <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon class="tip"></el-alert>

    <!-- 级联选择器 -->
    <span>请选择商品分类：</span>
    <el-cascader
      v-model="categoryId"
      :options="options"
      :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name' }"
      :show-all-levels="false"
      @change="chooseCategory"
    ></el-cascader>

    <!-- tab栏 -->
    <el-tabs class="tabs" v-model="activeName">
      <el-tab-pane name="first">
        <span slot="label">动态参数</span>
        <el-button type="success" size="small" class="btn" @click="addDynamicAttr" :disabled='isDisabled'>添加动态参数</el-button>
        <!-- 动态参数表格 -->
        <el-table :data="dynamicTable" border style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="info">
              <el-form label-position="left" inline class="demo-table-expand">
                <!-- <el-form-item label="商品名称">
                  <span>{{ info.row.name }}</span>
                </el-form-item>-->
                <!-- @close="handleClose(tag)" -->
                <el-tag
                  v-for="(tag,index) in info.row.attr_vals.split(',')"
                  :key="index"
                  closable
                  :disable-transitions="false"
                  class="tagList"
                  @close="handleClose(tag,info.row)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(info.row)"
                  @blur="handleInputConfirm(info.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="attr_name" label="商品参数" width="180"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="info">
              <el-button
                type="primary"
                icon="el-icon-edit"
                plain
                size="mini"
                @click="editDynamicAttr(info.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                plain
                size="mini"
                @click="delDynamicData(info.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="静态参数" name="second">
        <el-button type="success" size="small" class="btn" @click="addStaticAttr" :disabled='isDisabled'>添加静态参数</el-button>
        <!-- 静态参数表格 -->
        <el-table :data="staticTable" border style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="180"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width="500"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="info">
              <el-button
                type="primary"
                icon="el-icon-edit"
                plain
                size="mini"
                @click="editStaticAttr(info.row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                plain
                size="mini"
                @click="delAttributes(info.row.attr_id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 静态参数dialog -->
    <el-dialog :title="staticDialogTit" :visible.sync="staticDialog">
      <el-form :model="staticAttrForm" label-width="auto" :rules="rules" ref="staticForm">
        <el-form-item label="静态参数" prop="name">
          <el-input v-model="staticAttrForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="静态参数值" prop="val">
          <el-input v-model="staticAttrForm.val" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="staticDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitStaticForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 动态参数dialog -->
    <el-dialog :title="dynamicDialogTit" :visible.sync="dynamicDialog">
      <el-form :model="dynamicAttrForm" label-width="auto" :rules="rules" ref="staticForm">
        <el-form-item label="动态参数" prop="name">
          <el-input v-model="dynamicAttrForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dynamicDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitDynamicForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  categories,
  attributes,
  delAttr,
  addAttr,
  editAttr,
  addAttr1,
  editAttr1
} from "../api/api";
export default {
  name: "params",
  data() {
    return {
      categoryId: [],
      activeName: "first",
      options: [],
      // 动态参数表格数据
      dynamicTable: [],
      dynamicDialog: false,
      inputVisible: false,
      inputValue: "",
      dynamicDialogTit: "",
      dynamicAttrForm: {
        name: ""
      },
      dynamicFunc: "",
      editingDynamicId: 0,

      // 静态参数表格数据
      staticTable: [],
      staticDialog: false,
      staticDialogTit: "",
      staticDialogFunc: "",
      editingStaticId: "",
      staticAttrForm: {
        name: "",
        val: ""
      },
      rules: {
        name: [{ required: true, message: "请输入参数名称", trigger: "blur" }],
        val: [{ required: true, message: "请输入参数值", trigger: "blur" }]
      }
    };
  },
  methods: {
    editDynamicAttr(data) {
      this.dynamicDialogTit = "编辑动态参数";
      this.dynamicDialog = true;
      this.dynamicFunc = "edit";
      this.editingDynamicId = data.attr_id;
      this.dynamicAttrForm.name = data.attr_name;
    },
    addDynamicAttr() {
      this.dynamicDialogTit = "添加动态参数";
      this.dynamicDialog = true;
      this.dynamicFunc = "add";
    },
    submitDynamicForm() {
      if (this.dynamicFunc == "add") {
        addAttr(this.categoryId, this.dynamicAttrForm.name, "many").then(
          backData => {
            if (backData.data.meta.status == 201) {
              this.$message.success("添加动态参数成功");
              this.dynamicDialog = false;
              this.getDynamicAttr();
            }
          }
        );
      } else if (this.dynamicFunc == "edit") {
        editAttr(
          this.categoryId,
          this.editingDynamicId,
          "many",
          this.dynamicAttrForm.name
        ).then(backData => {
          if (backData.data.meta.status == 200) {
            this.$message.success("编辑动态参数成功");
            this.dynamicDialog = false;
            this.getDynamicAttr();
          }
        });
      }
    },
    delDynamicData(data) {
      delAttr(data.cat_id, data.attr_id).then(backData => {
        console.log(backData);
        this.getDynamicAttr();
      });
    },
    handleClose(tag, data) {
      // console.log(tag);
      let list = data.attr_vals.split(",");
      list.splice(list.indexOf(tag), 1);
      data.attr_vals = list.join(",");
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(data) {
      let inputValue = this.inputValue;
      if (inputValue) {
        data.attr_vals += ",";
        data.attr_vals += inputValue;
        editAttr1(
          data.cat_id,
          data.attr_id,
          "many",
          data.attr_name,
          data.attr_vals
        ).then(backData => {
          console.log(backData);
        });
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    // 根据选择的分类加载参数列表
    chooseCategory() {
      // 获取动态参数
      this.getDynamicAttr();
      //获取静态参数
      this.getStaticAttr();
    },
    // 添加静态参数
    addStaticAttr() {
      this.staticDialogFunc = "add";
      this.staticDialogTit = "添加静态参数";
      this.staticDialog = true;
    },
    // 编辑静态参数
    editStaticAttr(info) {
      this.staticDialogFunc = "edit";
      this.staticDialogTit = "编辑静态参数";
      this.staticAttrForm.name = info.attr_name;
      this.staticAttrForm.val = info.attr_vals;
      this.editingStaticId = info.attr_id;
      this.staticDialog = true;
    },
    // 提交静态参数表单
    submitStaticForm() {
      this.$refs.staticForm.validate(valid => {
        if (valid) {
          if (this.staticDialogFunc == "add") {
            addAttr(
              this.categoryId,
              this.staticAttrForm.name,
              "only",
              this.staticAttrForm.val
            ).then(backData => {
              if (backData.data.meta.status == 201) {
                this.$message.success("新增静态参数成功");
                this.staticDialog = false;
                this.getStaticAttr();
              }
            });
          } else if (this.staticDialogFunc == "edit") {
            editAttr(
              this.categoryId,
              this.editingStaticId,
              "only",
              this.staticAttrForm.name,
              this.staticAttrForm.val
            ).then(backData => {
              if (backData.data.meta.status == 200) {
                this.$message.success("编辑静态参数成功");
                this.staticDialog = false;
                this.getStaticAttr();
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除参数
    delAttributes(attrId) {
      this.$confirm("确定删除该参数吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delAttr(this.categoryId, attrId).then(backData => {
            if (backData.data.meta.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getDynamicAttr();
              this.getStaticAttr();
            }
          });
        })
        .catch(() => {
          this.this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 加载动态参数
    getDynamicAttr() {
      attributes(this.categoryId, "many").then(backData => {
        console.log(backData);
        this.dynamicTable = backData.data.data;
      });
    },
    // 加载静态参数
    getStaticAttr() {
      attributes(this.categoryId, "only").then(backData => {
        this.staticTable = backData.data.data;
      });
    }
  },
  computed:{
    isDisabled(){
      if(this.categoryId.length == 0){
       return true
      }
      else{
        return false
      }
    }
  },
  created() {
    categories().then(backData => {
      this.options = backData.data.data;
    });
  }
};
</script>

<style lang="less" scoped>
.nav {
  margin-bottom: 20px;
}
.tip {
  margin-bottom: 20px;
}
.btn {
  margin-bottom: 20px;
}
.tabs {
  margin-top: 10px;
}
.el-tabs__active-bar {
  background-color: red !important;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

