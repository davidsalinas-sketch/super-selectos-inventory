<template>
  <div id="app">
    <router-view />
    <NotificationContainer />
  </div>
</template>

<script setup>
import NotificationContainer from './components/NotificationContainer.vue'
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  min-height: 100vh;
}
</style>
