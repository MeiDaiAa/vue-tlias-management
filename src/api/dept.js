import request from '@/utils/request'

export const getListApi = () => request.get('/depts')

export const addApi = (data) => request.post('/depts', data)

export const getByIdApi = (id) => request.get(`/depts/${id}`)

export const updateApi = (data) => request.put('/depts', data)

export const deleteByIdApi = (id) => request.delete(`/depts?id=${id}`)
