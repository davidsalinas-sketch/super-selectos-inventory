<template>
  <div class="dashboard">
    <HeaderComponent />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue'
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f5f5;
}

.main-content {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px 15px;
  }
}
</style>
