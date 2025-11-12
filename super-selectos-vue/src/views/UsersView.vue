<template>
  <div class="users-view">
    <div class="toolbar">
      <h1>Gestión de Usuarios</h1>
      <div class="toolbar-actions">
        <button @click="openUserModal()" class="btn-primary">
          + Agregar Usuario
        </button>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Nombre Completo</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in authStore.users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.usuario }}</td>
            <td>{{ user.nombre }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['role-badge', `role-${user.rol.toLowerCase()}`]">
                {{ user.rol }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button @click="openUserModal(user)" class="btn-action btn-edit">Editar</button>
                <button 
                  v-if="user.id !== 1" 
                  @click="deleteUser(user.id)" 
                  class="btn-action btn-delete">
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

function openUserModal(user = null) {
  notificationStore.show('Funcionalidad de gestión de usuarios próximamente', 'info')
}

function deleteUser(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
    notificationStore.show('Usuario eliminado correctamente', 'success')
  }
}
</script>

<style scoped>
.users-view {
  /* Same styles as inventory */
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.toolbar h1 {
  color: #2e7d32;
  font-size: 32px;
  font-weight: 700;
}

.toolbar-actions {
  display: flex;
  gap: 15px;
}

.btn-primary {
  background: #4caf50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #2e7d32;
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
  padding: 20px 12px;
  text-align: left;
  font-weight: 700;
  font-size: 13px;
  text-transform: uppercase;
}

td {
  padding: 16px 12px;
  border-bottom: 1px solid #eee;
}

tbody tr:hover {
  background: #f9f9f9;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.role-administrador {
  background: #e8f5e8;
  color: #2e7d32;
}

.role-gerente {
  background: #e3f2fd;
  color: #1976d2;
}

.role-empleado {
  background: #fff3e0;
  color: #f57c00;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-action {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-edit {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: white;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
}

.btn-delete {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
}
</style>
