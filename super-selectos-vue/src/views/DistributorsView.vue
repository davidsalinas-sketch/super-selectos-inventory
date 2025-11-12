<template>
  <div class="distributors-view">
    <div class="toolbar">
      <h1>Gestión de Distribuidores</h1>
      <div class="toolbar-actions">
        <button @click="openDistributorModal()" class="btn-primary">
          + Agregar Distribuidor
        </button>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="distributor in inventoryStore.distributors" :key="distributor.id">
            <td>{{ distributor.id }}</td>
            <td>{{ distributor.nombre }}</td>
            <td>{{ distributor.contacto }}</td>
            <td>{{ distributor.telefono }}</td>
            <td>{{ distributor.email }}</td>
            <td>
              <div class="actions">
                <button @click="openDistributorModal(distributor)" class="btn-action btn-edit">
                  Editar
                </button>
                <button @click="deleteDistributor(distributor.id)" class="btn-action btn-delete">
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
import { useInventoryStore } from '@/stores/inventory'
import { useNotificationStore } from '@/stores/notification'

const inventoryStore = useInventoryStore()
const notificationStore = useNotificationStore()

function openDistributorModal(distributor = null) {
  notificationStore.show('Funcionalidad de gestión de distribuidores próximamente', 'info')
}

function deleteDistributor(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este distribuidor?')) {
    inventoryStore.deleteDistributor(id)
    notificationStore.show('Distribuidor eliminado correctamente', 'success')
  }
}
</script>

<style scoped src="@/assets/styles/table.css"></style>
