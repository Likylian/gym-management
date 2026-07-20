import request from './request'

export const login = (data) => request.post('/auth/login', data)
export const getUserInfo = () => request.get('/auth/info')

export const getDashboardStats = () => request.get('/dashboard/stats')
export const getDashboardSales = () => request.get('/dashboard/sales')

export const getGroupCourses = (params) => request.get('/group-courses', { params })
export const addGroupCourse = (data) => request.post('/group-courses', data)
export const updateGroupCourse = (id, data) => request.put(`/group-courses/${id}`, data)
export const deleteGroupCourse = (id) => request.delete(`/group-courses/${id}`)

export const getPrivateCourses = (params) => request.get('/private-courses', { params })
export const addPrivateCourse = (data) => request.post('/private-courses', data)
export const updatePrivateCourse = (id, data) => request.put(`/private-courses/${id}`, data)
export const deletePrivateCourse = (id) => request.delete(`/private-courses/${id}`)

export const getVenues = (params) => request.get('/venues', { params })
export const getAllVenues = () => request.get('/venues/all')
export const addVenue = (data) => request.post('/venues', data)
export const updateVenue = (id, data) => request.put(`/venues/${id}`, data)
export const deleteVenue = (id) => request.delete(`/venues/${id}`)

export const getMembers = (params) => request.get('/members', { params })
export const updateMember = (id, data) => request.put(`/members/${id}`, data)
export const deleteMember = (id) => request.delete(`/members/${id}`)

export const getCoaches = (params) => request.get('/coaches', { params })
export const getCoach = (id) => request.get(`/coaches/${id}`)
export const addCoach = (data) => request.post('/coaches', data)
export const updateCoach = (id, data) => request.put(`/coaches/${id}`, data)
export const deleteCoach = (id) => request.delete(`/coaches/${id}`)

export const getMemberCards = (params) => request.get('/member-cards', { params })
export const addMemberCard = (data) => request.post('/member-cards', data)
export const updateMemberCard = (id, data) => request.put(`/member-cards/${id}`, data)
export const deleteMemberCard = (id) => request.delete(`/member-cards/${id}`)

export const getProducts = (params) => request.get('/products', { params })
export const getProductStats = () => request.get('/products/stats')
export const addProduct = (data) => request.post('/products', data)
export const updateProduct = (id, data) => request.put(`/products/${id}`, data)
export const deleteProduct = (id) => request.delete(`/products/${id}`)

export const getOrders = (params) => request.get('/orders', { params })
export const updateOrder = (id, data) => request.put(`/orders/${id}`, data)
export const deleteOrder = (id) => request.delete(`/orders/${id}`)

export const getBookings = (params) => request.get('/bookings', { params })
export const checkinBooking = (id) => request.post(`/bookings/${id}/checkin`)
export const cancelBooking = (id) => request.post(`/bookings/${id}/cancel`)

export const getCoupons = (params) => request.get('/coupons', { params })
export const addCoupon = (data) => request.post('/coupons', data)
export const updateCoupon = (id, data) => request.put(`/coupons/${id}`, data)
export const deleteCoupon = (id) => request.delete(`/coupons/${id}`)

export const getSystemUsers = (params) => request.get('/system/users', { params })
export const addSystemUser = (data) => request.post('/system/users', data)
export const updateSystemUser = (id, data) => request.put(`/system/users/${id}`, data)
export const deleteSystemUser = (id) => request.delete(`/system/users/${id}`)

export const getRoles = (params) => request.get('/system/roles', { params })
export const getAllRoles = () => request.get('/system/roles/all')
export const addRole = (data) => request.post('/system/roles', data)
export const updateRole = (id, data) => request.put(`/system/roles/${id}`, data)
export const deleteRole = (id) => request.delete(`/system/roles/${id}`)
