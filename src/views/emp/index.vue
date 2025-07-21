<script setup>
import { ref, watch, onMounted } from 'vue'
import { getListApi, getByIdApi } from '@/api/emp'
import { ElMessage } from 'element-plus'
import { getListApi as getDeptAllApi } from '@/api/dept'

const genders = ref([
  { id: 1, name: '男' },
  { id: 2, name: '女' }
])

//职位列表数据
const jobs = ref([
  { name: '班主任', value: 1 },
  { name: '讲师', value: 2 },
  { name: '学工主管', value: 3 },
  { name: '教研主管', value: 4 },
  { name: '咨询师', value: 5 },
  { name: '其他', value: 6 }])

//部门列表数据
const deptList = ref([])


//* 分页数据 */
const page = ref(1)
const pageSize = ref(5)
const total = ref(10)
//* 弹窗数据 */
const dialogVisible = ref(false)
const dialogTitle = ref('新增员工')
//* 表单数据 */
const employee = ref({
  username: '',
  name: '',
  gender: '',
  phone: '',
  job: '',
  salary: '',
  deptId: '',
  entryDate: '',
  image: '',
  exprList: [
    { exprDate: [], begin: '', end: '', company: '', job: '' }
  ]
})


//* 表单数据 */
const empForm = ref({
  name: '',
  gender: '',
  date: [],
  begin: '',
  end: ''
})
//* 表格数据 */
const empList = ref([])
//* 编辑员工 */
const edit = async (id) => {
  dialogVisible.value = true
  dialogTitle.value = '编辑员工'

  //数据回显
  const result = await getByIdApi(id)
  if (result.code) {
    employee.value = result.data
  } else {
    ElMessage.error(result.msg)
  }

  
}
//* 删除员工 */
const remove = (id) => {
}

//* 保存员工 */
const save = async () => {
}



//* 查询 */
const query = async () => {
  const result = await getListApi(empForm.value.name, empForm.value.gender, empForm.value.begin, empForm.value.end, page.value, pageSize.value)

  if (result.code) {
    empList.value = result.data.rows
    total.value = result.data.total
  } else {
    ElMessage.error(result.msg)
  }
}
//* 清空Form */
const clear = () => {
  empForm.value = { name: '', gender: '', date: [] }
}
//* 监听日期选择 */
watch(() => empForm.value.date, (newValue, oldValue) => {
  if (empForm.value.date.length == 2) {
    //将选择的日期赋给begin和end
    empForm.value.begin = newValue[0]
    empForm.value.end = newValue[1]
  } else {
    //清空begin和end
    empForm.value.begin = ''
    empForm.value.end = ''
  }
}, { deep: true }) // 开启深度监听

watch(() => employee.value, (newValue, oldValue) => {
  if (employee.value.exprList && employee.value.exprList.length > 0) {
    employee.value.exprList.forEach(expr => {
      expr.exprDate[0] = expr.begin
      expr.exprDate[1] = expr.end
    })
  }
}, { deep: true })



//* 分页大小改变 */
const handleSizeChange = (val) => {
  pageSize.value = val
  page.value = 1
  query()
}
//* 分页当前页改变 */
const handleCurrentChange = (val) => {
  page.value = val
  query()
}


// 图片上传成功后触发
const handleAvatarSuccess = (response) => {
  console.log(response);
}
// 文件上传之前触发
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('只支持上传图片')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('只能上传10M以内图片')
    return false
  }
  return true
}



onMounted(async () => {
  query()

  // 查询所有部门
  const result = await getDeptAllApi()
  if (result.code) {
    deptList.value = result.data
  } else {
    ElMessage.error(result.msg)
  }
})


</script>






<template>
  <h1>员工管理</h1>

  <div id="container">
    <!-- 表单 -->
    <el-form :inline="true" :model="empForm" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="empForm.name" placeholder="请输入员工姓名" clearable />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="empForm.gender" placeholder="请选择">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间">
        <!-- 日期范围选择器 -->
        <el-date-picker v-model="empForm.date" type="daterange" range-separator="到" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="YYYY-MM-DD" :clearable="false" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="empList" border style="width: 100%">
      <el-table-column type="selection" width="35" />
      <el-table-column prop="name" label="姓名" width="130" align="center" />
      <el-table-column label="性别" width="80" align="center">
        <template #default="scope">
          {{ scope.row.gender == 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column label="头像" width="130" align="center">
        <template #default="scope">
          <el-image :src="scope.row.image" style="height: 45px;" />
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="所属部门" width="150" align="center" />
      <el-table-column label="职位" width="130" align="center">
        <template #default="scope">
          <span v-if="scope.row.job == 1">班主任</span>
          <span v-else-if="scope.row.job == 2">讲师</span>
          <span v-else-if="scope.row.job == 3">学工主管</span>
          <span v-else-if="scope.row.job == 4">教研主管</span>
          <span v-else-if="scope.row.job == 5">咨询师</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="entryDate" label="入职日期" width="150" align="center" />
      <el-table-column prop="updateTime" label="最后操作时间" width="200" align="center" />
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

  <div id="container">
    <!-- 分页 -->
    <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30]"
      layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>



  <!-- 弹窗 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle">

    <el-form :model="employee" label-width="80px">
      <!-- 基本信息 -->
      <!-- 第一行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名">
            <el-input v-model="employee.username" placeholder="请输入员工用户名，2-20个字"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input v-model="employee.name" placeholder="请输入员工姓名，2-10个字"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别">
            <el-select v-model="employee.gender" placeholder="请选择性别" style="width: 100%;">
              <el-option v-for="gender in genders" :key="gender.id" :label="gender.name" :value="gender.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="手机号">
            <el-input v-model="employee.phone" placeholder="请输入员工手机号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="职位">
            <el-select v-model="employee.job" placeholder="请选择职位" style="width: 100%;">
              <el-option v-for="job in jobs" :key="job.value" :value="job.value" :label="job.name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="薪资">
            <el-input v-model="employee.salary" placeholder="请输入员工薪资"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第四行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属部门">
            <el-select v-model="employee.deptId" placeholder="请选择部门" style="width: 100%;">
              <el-option v-for="dept in deptList" :key="dept.id" :label="dept.name" :value="dept.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入职日期">
            <el-date-picker v-model="employee.entryDate" type="date" style="width: 100%;" placeholder="选择日期"
              format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行 -->
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="头像">
            <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="employee.image" :src="employee.image" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>


      <!-- 工作经历 -->
      <!-- 第六行 -->
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="工作经历">
            <el-button type="success" size="small" @click="">+ 添加工作经历</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第七行 ...  工作经历 -->
      <el-row :gutter="3" v-for="(expr, index) in employee.exprList" :key="index">
        <el-col :span="10">
          <el-form-item size="small" label="时间" label-width="80px">
            <el-date-picker v-model="expr.exprDate" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="公司" label-width="60px">
            <el-input placeholder="请输入公司名称" v-model="expr.company"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item size="small" label="职位" label-width="60px">
            <el-input placeholder="请输入职位" v-model="expr.job"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="2">
          <el-form-item size="small" label-width="0px">
            <el-button type="danger">- 删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </template>
  </el-dialog>




</template>






<style scoped>
#container {
  margin-top: 10px;
}

h1 {
  color: rgb(64, 158, 255);
}

.demo-form-inline .el-input {
  --el-input-width: 220px;
}


.avatar {
  height: 40px;
}

.avatar-uploader .avatar {
  width: 78px;
  height: 78px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
  border-radius: 10px;
  /* 添加灰色的虚线边框 */
  border: 1px dashed var(--el-border-color);
}
</style>