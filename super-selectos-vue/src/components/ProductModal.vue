<template>
  <div class="modal" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ product ? 'Editar Producto' : 'Agregar Producto' }}</h2>
        <span class="close" @click="$emit('close')">&times;</span>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label for="productCode">Código</label>
            <input 
              type="text" 
              id="productCode" 
              v-model="formData.codigo" 
              :disabled="!!product"
              required>
          </div>
          <div class="form-group">
            <label for="productName">Nombre</label>
            <input 
              type="text" 
              id="productName" 
              v-model="formData.nombre" 
              required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="productCategory">Categoría</label>
            <select id="productCategory" v-model="formData.categoria" required>
              <option value="">Seleccionar categoría</option>
              <option value="Alimentos">Alimentos</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Carnes">Carnes</option>
              <option value="Frutas">Frutas</option>
              <option value="Limpieza">Limpieza</option>
              <option value="Juguetes">Juguetes</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          <div class="form-group">
            <label for="productPrice">Precio ($)</label>
            <input 
              type="number" 
              id="productPrice" 
              v-model.number="formData.precio" 
              step="0.01" 
              min="0" 
              required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="productDistributor">Distribuidor</label>
            <select id="productDistributor" v-model="formData.distributor">
              <option value="">Seleccionar distribuidor</option>
              <option 
                v-for="dist in inventoryStore.distributors" 
                :key="dist.id" 
                :value="dist.nombre">
                {{ dist.nombre }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="productExpiration">Fecha de Vencimiento</label>
            <input 
              type="date" 
              id="productExpiration" 
              v-model="formData.vencimiento" 
              required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="productImage">URL de Imagen</label>
            <input 
              type="url" 
              id="productImage" 
              v-model="formData.imagen" 
              placeholder="https://ejemplo.com/imagen.jpg">
          </div>
          <div class="form-group">
            <label for="productProfit">Ganancia (%)</label>
            <input 
              type="number" 
              id="productProfit" 
              v-model.number="formData.ganancia" 
              min="0" 
              max="100" 
              step="0.1" 
              required>
          </div>
        </div>

        <div class="form-group">
          <label>Distribución por Sucursales</label>
          <div class="sucursales-grid">
            <div 
              v-for="i in 118" 
              :key="i" 
              class="sucursal-item">
              <label>Sucursal {{ i }}</label>
              <input 
                type="number" 
                v-model.number="formData.sucursales[`Sucursal ${i}`]" 
                min="0" 
                class="sucursal-stock">
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" @click="$emit('close')" class="btn-cancel">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useInventoryStore } from '@/stores/inventory'

const props = defineProps({
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const inventoryStore = useInventoryStore()

const formData = ref({
  codigo: '',
  nombre: '',
  categoria: '',
  precio: 0,
  imagen: '',
  distributor: '',
  vencimiento: '',
  ganancia: 0,
  sucursales: {}
})

// Initialize sucursales
for (let i = 1; i <= 118; i++) {
  formData.value.sucursales[`Sucursal ${i}`] = 0
}

// Watch for product changes
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    formData.value = { ...newProduct }
  } else {
    // Reset form
    formData.value = {
      codigo: '',
      nombre: '',
      categoria: '',
      precio: 0,
      imagen: '',
      distributor: '',
      vencimiento: '',
      ganancia: 0,
      sucursales: {}
    }
    for (let i = 1; i <= 118; i++) {
      formData.value.sucursales[`Sucursal ${i}`] = 0
    }
  }
}, { immediate: true })

function handleSubmit() {
  emit('save', { ...formData.value })
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px 30px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  color: #2e7d32;
  font-size: 24px;
  font-weight: 700;
}

.close {
  font-size: 28px;
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;
}

.close:hover {
  color: #f44336;
}

form {
  padding: 30px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-row .form-group {
  flex: 1;
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

.form-group input,
.form-group select {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.sucursales-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  max-height: 300px;
  overflow-y: auto;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

.sucursal-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.sucursal-item label {
  font-size: 12px;
  font-weight: 600;
  color: #555;
  margin: 0;
}

.sucursal-item input {
  width: 60px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
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

.btn-cancel {
  background: #f44336;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #d32f2f;
}
</style>
