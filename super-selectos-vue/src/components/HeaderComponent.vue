<template>
  <header class="header">
    <div class="header-content">
      <img src="https://www.sermexelsalvador.com/wp-content/uploads/SUPERSELECTOS.png" 
           alt="Super Selectos Logo" 
           class="logo">
      
      <nav class="nav-menu">
        <router-link 
          to="/dashboard/inventory" 
          class="nav-btn" 
          :class="{ active: $route.name === 'Inventory' }">
          📦 Inventario
        </router-link>
        
        <router-link 
          v-if="authStore.currentUser?.rol === 'Administrador'"
          to="/dashboard/users" 
          class="nav-btn" 
          :class="{ active: $route.name === 'Users' }">
          👥 Usuarios
        </router-link>
        
        <router-link 
          v-if="authStore.currentUser?.rol === 'Administrador'"
          to="/dashboard/distributors" 
          class="nav-btn" 
          :class="{ active: $route.name === 'Distributors' }">
          🚚 Distribuidores
        </router-link>
        
        <router-link 
          to="/dashboard/map" 
          class="nav-btn" 
          :class="{ active: $route.name === 'Map' }">
          🗺️ Mapa
        </router-link>
      </nav>
      
      <div class="header-info">
        <span id="userInfo">{{ authStore.currentUser?.nombre }} ({{ authStore.currentUser?.rol }})</span>
        <button @click="handleLogout" class="btn-logout">Cerrar Sesión</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  height: 50px;
  object-fit: contain;
}

.nav-menu {
  display: flex;
  gap: 10px;
}

.nav-btn {
  background: transparent;
  border: 2px solid #e0e0e0;
  color: #666;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.nav-btn:hover {
  border-color: #4caf50;
  color: #4caf50;
}

.nav-btn.active {
  background: #4caf50;
  border-color: #4caf50;
  color: white;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-logout {
  background: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background: #d32f2f;
}

@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    gap: 15px;
  }
  
  .nav-menu {
    order: 2;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .header-info {
    order: 3;
  }
}
</style>
