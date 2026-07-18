import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const username = ref(localStorage.getItem('username') || '')
  const nickname = ref(localStorage.getItem('nickname') || '')

  const setLoginInfo = (data) => {
    token.value = data.token
    username.value = data.username
    nickname.value = data.nickname
    localStorage.setItem('token', data.token)
    localStorage.setItem('username', data.username)
    localStorage.setItem('nickname', data.nickname)
  }

  const logout = () => {
    token.value = ''
    username.value = ''
    nickname.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('nickname')
  }

  return { token, username, nickname, setLoginInfo, logout }
})
