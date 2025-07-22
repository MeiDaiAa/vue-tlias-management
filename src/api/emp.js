import request from '@/utils/request'

// 查询列表
export const getListApi = (name, gender, begin, end, page, pageSize) => request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)

 export const addApi = (data) => request.post('/emps', data)

 export const getByIdApi = (id) => request.get(`/emps/${id}`)

 export const updateApi = (data) => request.put('/emps', data)

 export const deleteByIdsApi = (id) => request.delete(`/emps?ids=${id}`)
