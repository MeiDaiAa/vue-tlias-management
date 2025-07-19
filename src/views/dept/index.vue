<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const empList = ref([])
onMounted(() => {
  search()
})

const search = async() => { 
  const result = await axios.get("https://m1.apifoxmock.com/m1/6626380-6333717-default/depts")
  if(result.data.code){
    empList.value = result.data.data
  }
}


</script>

<template>
  <h1>部门管理</h1>
  <div id="container">
    <el-button type="primary">+ 新增部门</el-button>
  </div>
  <!-- 表格 -->
  <div id="container">
    <el-table :data="empList" border style="width: 100%">
      <el-table-column type="index" label="序号" width="80" align="center"/>
      <el-table-column prop="name" label="部门名称" width="350" align="center"/>
      <el-table-column prop="updateTime" label="最后操作时间" width="350" align="center"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small"><el-icon><Edit /></el-icon>编辑</el-button>
          <el-button type="danger" size="small"><el-icon><Delete /></el-icon>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
h1 {
  color: rgb(64, 158, 255);
}

#container {
  margin-top: 10px;
}
</style>
