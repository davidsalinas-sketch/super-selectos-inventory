import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  const users = ref([
    { id: 1, usuario: "admin", password: "1234", rol: "Administrador", nombre: "Administrador Sistema", email: "admin@superselectos.com" },
    { id: 2, usuario: "gerente1", password: "gerente123", rol: "Gerente", nombre: "María González", email: "maria@superselectos.com" },
    { id: 3, usuario: "empleado1", password: "empleado123", rol: "Empleado", nombre: "Carlos Martínez", email: "carlos@superselectos.com" }
  ])

  const isAuthenticated = computed(() => currentUser.value !== null)

  function login(username, password) {
    const user = users.value.find(u => u.usuario === username && u.password === password)
    if (user) {
      currentUser.value = user
      localStorage.setItem('currentUser', JSON.stringify(user))
      return true
    }
    return false
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }

  function loadFromStorage() {
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      currentUser.value = JSON.parse(stored)
    }
  }

  function hasPermission(permission) {
    if (!currentUser.value) return false
    
    const permissions = {
      'Administrador': ['create', 'read', 'update', 'delete', 'export', 'manage_users', 'manage_distributors'],
      'Gerente': ['create', 'read', 'update', 'delete', 'export'],
      'Empleado': ['read', 'update_stock']
    }

    return permissions[currentUser.value.rol]?.includes(permission) || false
  }

  // Load user from storage on store creation
  loadFromStorage()

  return {
    currentUser,
    users,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    loadFromStorage
  }
})
