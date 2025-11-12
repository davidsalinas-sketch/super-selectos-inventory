import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])

  function show(message, type = 'success', autoClose = true) {
    const notification = {
      id: Date.now(),
      message,
      type
    }

    notifications.value.push(notification)

    if (autoClose) {
      setTimeout(() => {
        remove(notification.id)
      }, 3000)
    }

    return notification
  }

  function remove(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  return {
    notifications,
    show,
    remove
  }
})
