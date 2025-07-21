import request from '@/utils/request'

// 查询列表
export const getListApi = (name, gender, begin, end, page, pageSize) => request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)

// export const addApi = (data) => request.post('/depts', data)

 export const getByIdApi = (id) => request.get(`/emps/${id}`)

// export const updateApi = (data) => request.put('/depts', data)

// export const deleteByIdApi = (id) => request.delete(`/depts?id=${id}`)
