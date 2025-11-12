<template>
  <div class="inventory-view">
    <div class="toolbar">
      <h1>Gestión de Inventario</h1>
      <div class="toolbar-actions">
        <button 
          v-if="authStore.hasPermission('create')"
          @click="openProductModal()" 
          class="btn-primary">
          + Agregar Producto
        </button>
        <button 
          v-if="authStore.hasPermission('export')"
          @click="exportPDF" 
          class="btn-secondary">
          📄 Exportar PDF
        </button>
        <button 
          v-if="authStore.hasPermission('export')"
          @click="shareReport" 
          class="btn-secondary">
          📤 Compartir
        </button>
      </div>
    </div>

    <!-- KPIs Section -->
    <div class="kpi-section">
      <div class="kpi-card">
        <div class="kpi-value">{{ inventoryStore.totalProducts }}</div>
        <div class="kpi-label">Productos Totales</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">{{ inventoryStore.totalStock.toLocaleString() }}</div>
        <div class="kpi-label">Stock Total</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${{ inventoryStore.totalValue.toFixed(2) }}</div>
        <div class="kpi-label">Valor Total</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-value">${{ inventoryStore.totalProfit.toFixed(2) }}</div>
        <div class="kpi-label">Ganancia Estimada</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <input 
        type="text" 
        v-model="filters.search"
        placeholder="Buscar por nombre, código, categoría o distribuidor...">
      
      <select v-model="filters.category">
        <option value="">Todas las categorías</option>
        <option value="Alimentos">Alimentos</option>
        <option value="Bebidas">Bebidas</option>
        <option value="Carnes">Carnes</option>
        <option value="Frutas">Frutas</option>
        <option value="Limpieza">Limpieza</option>
        <option value="Juguetes">Juguetes</option>
        <option value="Otros">Otros</option>
      </select>
      
      <select v-model="filters.sucursal">
        <option value="all">Todas las sucursales</option>
        <option v-for="i in 118" :key="i" :value="i">Sucursal {{ i }}</option>
      </select>
    </div>

    <!-- Products Table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio ($)</th>
            <th>Distribuidor</th>
            <th>Vencimiento</th>
            <th>Ganancia (%)</th>
            <th>Stock Total</th>
            <th>Sucursales</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.codigo">
            <td>
              <img 
                :src="product.imagen || 'https://via.placeholder.com/50x50?text=Sin+Imagen'" 
                :alt="product.nombre" 
                class="product-image"
                @error="$event.target.src='https://via.placeholder.com/50x50?text=Sin+Imagen'">
            </td>
            <td>{{ product.codigo }}</td>
            <td>{{ product.nombre }}</td>
            <td>{{ product.categoria }}</td>
            <td>${{ product.precio.toFixed(2) }}</td>
            <td>{{ product.distributor || 'N/A' }}</td>
            <td>{{ formatDate(product.vencimiento) }}</td>
            <td>{{ product.ganancia }}%</td>
            <td>
              <div class="stock-info">
                <span class="stock-total">{{ calculateStock(product) }}</span>
              </div>
            </td>
            <td>{{ calculateSucursalesDisplay(product) }}</td>
            <td>
              <div class="actions">
                <button 
                  v-if="authStore.hasPermission('update')"
                  @click="openProductModal(product)" 
                  class="btn-action btn-edit">
                  Editar
                </button>
                <button 
                  v-if="authStore.hasPermission('delete')"
                  @click="deleteProduct(product.codigo)" 
                  class="btn-action btn-delete">
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Product Modal -->
    <ProductModal 
      v-if="showModal"
      :product="selectedProduct"
      @close="closeModal"
      @save="handleSaveProduct"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useInventoryStore } from '@/stores/inventory'
import { useNotificationStore } from '@/stores/notification'
import ProductModal from '@/components/ProductModal.vue'

const authStore = useAuthStore()
const inventoryStore = useInventoryStore()
const notificationStore = useNotificationStore()

const showModal = ref(false)
const selectedProduct = ref(null)

const filters = ref({
  search: '',
  category: '',
  sucursal: 'all'
})

const filteredProducts = computed(() => {
  return inventoryStore.products.filter(product => {
    const searchLower = filters.value.search.toLowerCase()
    const matchesSearch = !searchLower || 
      product.nombre.toLowerCase().includes(searchLower) ||
      product.codigo.toLowerCase().includes(searchLower) ||
      product.categoria.toLowerCase().includes(searchLower) ||
      (product.distributor && product.distributor.toLowerCase().includes(searchLower))

    const matchesCategory = !filters.value.category || product.categoria === filters.value.category

    const matchesSucursal = filters.value.sucursal === 'all' || 
      (product.sucursales && product.sucursales[`Sucursal ${filters.value.sucursal}`] > 0)

    return matchesSearch && matchesCategory && matchesSucursal
  })
})

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES')
}

function calculateStock(product) {
  if (filters.value.sucursal === 'all') {
    return Object.values(product.sucursales || {}).reduce((sum, stock) => sum + stock, 0)
  }
  return product.sucursales?.[`Sucursal ${filters.value.sucursal}`] || 0
}

function calculateSucursalesDisplay(product) {
  if (filters.value.sucursal === 'all') {
    const count = Object.keys(product.sucursales || {}).filter(s => product.sucursales[s] > 0).length
    return `${count} sucursales`
  }
  const stock = calculateStock(product)
  return stock > 0 ? `Disponible: ${stock}` : 'Sin stock'
}

function openProductModal(product = null) {
  selectedProduct.value = product
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedProduct.value = null
}

function handleSaveProduct(product) {
  if (selectedProduct.value) {
    inventoryStore.updateProduct(selectedProduct.value.codigo, product)
    notificationStore.show('Producto actualizado correctamente', 'success')
  } else {
    inventoryStore.addProduct(product)
    notificationStore.show('Producto agregado correctamente', 'success')
  }
  closeModal()
}

function deleteProduct(codigo) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    inventoryStore.deleteProduct(codigo)
    notificationStore.show('Producto eliminado correctamente', 'success')
  }
}

function exportPDF() {
  notificationStore.show('Generando PDF...', 'info')
  // TODO: Implementar exportación PDF
}

function shareReport() {
  notificationStore.show('Funcionalidad de compartir próximamente', 'info')
  // TODO: Implementar compartir
}
</script>

<style scoped src="@/assets/styles/inventory.css"></style>
