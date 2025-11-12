<template>
  <div class="map-view">
    <div class="toolbar">
      <h1>BUSCA TU SALA DE VENTA FAVORITA</h1>
    </div>

    <div class="map-panel">
      <aside class="map-sidebar">
        <label for="mapSearchInput" class="map-search-label">Sucursal</label>
        <input 
          id="mapSearchInput" 
          type="text" 
          v-model="searchTerm"
          placeholder="Buscar por nombre de sucursal...">
        
        <div class="map-results">
          <div 
            v-for="branch in filteredBranches" 
            :key="branch.name"
            class="map-result-item"
            @click="focusBranch(branch)">
            <div class="map-result-title">{{ branch.name }}</div>
            <div class="map-result-sub">{{ branch.address }}</div>
          </div>
        </div>
      </aside>

      <section class="map-container">
        <div id="map" ref="mapElement" style="width:100%;height:600px;border-radius:8px;border:1px solid #e6e6e6"></div>
        <div class="map-note">
          (Mapa centrado en El Salvador — funciona en línea)
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import L from 'leaflet'

const mapElement = ref(null)
const map = ref(null)
const searchTerm = ref('')
const markers = ref([])

// Sample branch locations
const branches = ref([
  { name: 'Sucursal 1', lat: 13.6929, lng: -89.2182, address: 'San Salvador Centro' },
  { name: 'Sucursal 2', lat: 13.7100, lng: -89.2030, address: 'Colonia Escalón' },
  { name: 'Sucursal 3', lat: 13.6858, lng: -89.2362, address: 'Santa Tecla' },
  // Add more branches as needed
])

const filteredBranches = computed(() => {
  if (!searchTerm.value) return branches.value
  return branches.value.filter(b => 
    b.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

function initMap() {
  if (!mapElement.value) return

  map.value = L.map(mapElement.value).setView([13.6929, -89.2182], 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map.value)

  // Add markers
  branches.value.forEach(branch => {
    const marker = L.marker([branch.lat, branch.lng])
      .addTo(map.value)
      .bindPopup(`<b>${branch.name}</b><br>${branch.address}`)
    
    markers.value.push(marker)
  })
}

function focusBranch(branch) {
  if (map.value) {
    map.value.setView([branch.lat, branch.lng], 15)
    
    const marker = markers.value.find(m => 
      m.getLatLng().lat === branch.lat && m.getLatLng().lng === branch.lng
    )
    if (marker) {
      marker.openPopup()
    }
  }
}

onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    initMap()
  }, 300)
})
</script>

<style scoped>
.map-view {
  /* Similar to other views */
}

.toolbar {
  margin-bottom: 30px;
}

.toolbar h1 {
  color: #2e7d32;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
}

.map-panel {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 20px;
  align-items: start;
}

.map-sidebar {
  background: white;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  max-height: 720px;
  overflow-y: auto;
}

.map-search-label {
  display: block;
  font-weight: 700;
  color: #2e7d32;
  margin-bottom: 8px;
}

#mapSearchInput {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  margin-bottom: 12px;
}

#mapSearchInput:focus {
  outline: none;
  border-color: #4caf50;
}

.map-results {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.map-result-item {
  padding: 12px;
  border-radius: 8px;
  background: #fbfbfb;
  border: 1px solid #eee;
  cursor: pointer;
  transition: all 0.3s ease;
}

.map-result-item:hover {
  background: #f0f9f1;
  border-color: #4caf50;
}

.map-result-title {
  font-weight: 700;
  color: #2e7d32;
}

.map-result-sub {
  font-size: 13px;
  color: #666;
  margin-top: 6px;
}

.map-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.map-note {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  text-align: center;
}

@media (max-width: 768px) {
  .map-panel {
    grid-template-columns: 1fr;
  }

  .map-sidebar {
    max-height: 300px;
  }
}
</style>
