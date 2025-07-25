<script setup>
import { ref, onMounted } from 'vue'
import { getListApi, addApi, getByIdApi, updateApi, deleteByIdApi } from '@/api/dept'
import { ElMessage, ElMessageBox } from 'element-plus'

const deptList = ref([]) // 部门列表
const dept = ref({ // 存储部门信息
  name: ''
})
const dialogVisible = ref(false) // 控制部门添加弹窗显示
const title = ref('') // 弹窗标题
const deptFormRef = ref() // 获取部门添加表单
const rules = ref({ // 部门添加表单验证规则
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 10, message: '部门名称的长度需要为2-10位', trigger: 'blur' },
  ]
})

// 获取部门列表
const search = async () => {
  const result = await getListApi()
  if (result.code) {
    deptList.value = result.data
  }
}
// 点击添加部门时显示部门添加弹窗
const add = () => {
  dialogVisible.value = true
  if(deptFormRef.value){
    deptFormRef.value.resetFields() // 重置表单
  }
  title.value = '添加部门'
  dept.value = { name: '' }
}
// 保存部门，编辑部门
const save = async () => {
  if (!deptFormRef.value) return;
  deptFormRef.value.validate(async (valid) => {
    if (valid) {// 表单验证成功
      let result;
      if (!dept.value.id) {// 添加
        // 发送请求
        result = await addApi(dept.value)
      } else {// 编辑
        result = await updateApi(dept.value)
      }

      if (result.code) {
        ElMessage.success('添加成功')
        dialogVisible.value = false
        search()
      } else {
        ElMessage.error(result.msg)
      }
    } else {// 表单验证失败
      ElMessage.error('表单校验不通过')
    }
  })
}
//修改
const edit = async (id) => {
  //数据回显
  const result = await getByIdApi(id);
  if (result.code) {
    dept.value = result.data
  } else {
    ElMessage.error(result.msg)
  }

  dialogVisible.value = true
  title.value = '编辑部门'
}
//删除
const remove = async (id) => {
  ElMessageBox.confirm('您确定要删除该部门吗 ?','Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      //删除
      const result = await deleteByIdApi(id)
      if(result.code){
        ElMessage.success('删除成功')
      }else{
        ElMessage.error(result.msg)
      }

      search()
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}


// 页面加载时获取部门列表
onMounted(() => {
  search()
})
</script>




<template>
  <h1>部门管理</h1>
  <div id="container">
    <el-button type="primary" @click="add">+ 新增部门</el-button>
  </div>
  <!-- 部门数据展示表格 -->
  <div id="container">
    <el-table :data="deptList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="name" label="部门名称" width="350" align="center" />
      <el-table-column prop="updateTime" label="最后操作时间" width="350" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="edit(scope.row.id)"><el-icon>
              <Edit />
            </el-icon>编辑</el-button>
          <el-button type="danger" size="small" @click="remove(scope.row.id)"><el-icon>
              <Delete />
            </el-icon>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 对话框 -->
  <el-dialog v-model="dialogVisible" :title="title" width="500">
    <!-- 表单 -->
    <el-form ref="deptFormRef" :model="dept" :rules="rules" label-width="auto">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="dept.name" placeholder="请输入部门名称，长度位2-10位" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-dialog>


</template>




<style scoped>
h1 {
  color: rgb(64, 158, 255);
}

#container {
  margin-top: 10px;
}
</style>
