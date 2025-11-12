<template>
  <div class="notifications">
    <transition-group name="notification">
      <div 
        v-for="notification in notificationStore.notifications" 
        :key="notification.id"
        :class="['notification', notification.type]">
        {{ notification.message }}
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
</script>

<style scoped>
.notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
}

.notification {
  background: white;
  border-left: 4px solid #4caf50;
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 400px;
}

.notification.error {
  border-left-color: #f44336;
}

.notification.warning {
  border-left-color: #ff9800;
}

.notification.info {
  border-left-color: #2196f3;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
