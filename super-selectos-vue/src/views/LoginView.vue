<template>
  <div class="login-screen">
    <div class="login-container">
      <div class="login-header">
        <img src="https://www.superselectos.com/img/super-selectos-banner.jpg" 
             alt="Super Selectos Banner" 
             class="login-banner">
      </div>
      <div class="login-form">
        <h2>Iniciar Sesión</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">Usuario</label>
            <input 
              type="text" 
              id="username" 
              v-model="credentials.username" 
              required>
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              v-model="credentials.password" 
              required>
          </div>
          <button type="submit" class="btn-login">Entrar</button>
        </form>
        <div v-if="error" class="error-message">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const credentials = ref({
  username: '',
  password: ''
})

const error = ref('')

function handleLogin() {
  error.value = ''
  
  if (authStore.login(credentials.value.username, credentials.value.password)) {
    notificationStore.show('Bienvenido al sistema de inventario', 'success')
    router.push('/dashboard/inventory')
  } else {
    error.value = 'Usuario o contraseña incorrectos'
  }
}
</script>

<style scoped>
.login-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 450px;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-banner {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.login-form {
  padding: 40px;
}

.login-form h2 {
  color: #2e7d32;
  margin-bottom: 30px;
  text-align: center;
  font-size: 28px;
  font-weight: 700;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.btn-login {
  width: 100%;
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
  border: none;
  padding: 18px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.btn-login:hover {
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
}

.error-message {
  color: #f44336;
  text-align: center;
  margin-top: 15px;
  font-weight: 600;
}
</style>
