import request from '@/utils/request'

export const getDeptList = () => request.get('/depts')

export const addDept = (data) => request.post('/depts', data)
