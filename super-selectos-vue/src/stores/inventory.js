import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useInventoryStore = defineStore('inventory', () => {
  const products = ref([])
  const distributors = ref([
    { id: 1, nombre: "Distribuidora Central", contacto: "Juan Pérez", telefono: "+503 2234-5678", email: "contacto@distcentral.com" },
    { id: 2, nombre: "Alimentos del Valle", contacto: "Ana López", telefono: "+503 2345-6789", email: "ventas@alimentosvalle.com" },
    { id: 3, nombre: "Bebidas Premium", contacto: "Roberto Silva", telefono: "+503 2456-7890", email: "info@bebidaspremium.com" },
    { id: 4, nombre: "Carnes Selectas", contacto: "María Rodríguez", telefono: "+503 2567-8901", email: "pedidos@carnesselectas.com" },
    { id: 5, nombre: "Frutas Frescas SA", contacto: "Pedro Hernández", telefono: "+503 2678-9012", email: "ventas@frutasfrescas.com" }
  ])

  const sucursales = ref([])
  
  // Generate sucursales (1-118)
  for (let i = 1; i <= 118; i++) {
    sucursales.value.push(`Sucursal ${i}`)
  }

  // KPIs computed
  const totalProducts = computed(() => {
    return products.value.filter(p => {
      const totalStock = Object.values(p.sucursales || {}).reduce((s, st) => s + st, 0)
      return totalStock > 0
    }).length
  })

  const totalStock = computed(() => {
    return products.value.reduce((sum, product) => {
      return sum + Object.values(product.sucursales || {}).reduce((s, st) => s + st, 0)
    }, 0)
  })

  const totalValue = computed(() => {
    return products.value.reduce((sum, product) => {
      const stock = Object.values(product.sucursales || {}).reduce((s, st) => s + st, 0)
      return sum + (stock * product.precio)
    }, 0)
  })

  const totalProfit = computed(() => {
    return products.value.reduce((sum, product) => {
      const stock = Object.values(product.sucursales || {}).reduce((s, st) => s + st, 0)
      const cost = product.precio / (1 + (product.ganancia / 100))
      const profit = (product.precio - cost) * stock
      return sum + profit
    }, 0)
  })

  function generateRandomStock() {
    const stock = {}
    for (let i = 1; i <= 118; i++) {
      stock[`Sucursal ${i}`] = Math.floor(Math.random() * 50) + 1
    }
    return stock
  }

  function initializeSampleProducts() {
    const sampleProducts = [
      {
        codigo: "ALI001", nombre: "Arroz Selecto Premium 1lb", categoria: "Alimentos", precio: 1.20,
        imagen: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop",
        distributor: "Distribuidora Central", vencimiento: "2025-12-31", ganancia: 25,
        sucursales: generateRandomStock()
      },
      {
        codigo: "BEB001", nombre: "Coca Cola 355ml", categoria: "Bebidas", precio: 0.75,
        imagen: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=200&h=200&fit=crop",
        distributor: "Bebidas Premium", vencimiento: "2025-09-30", ganancia: 40,
        sucursales: generateRandomStock()
      },
      {
        codigo: "CAR001", nombre: "Pollo Entero Fresco", categoria: "Carnes", precio: 4.50,
        imagen: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop",
        distributor: "Carnes Selectas", vencimiento: "2025-11-15", ganancia: 28,
        sucursales: generateRandomStock()
      }
    ]

    products.value = sampleProducts
    saveToStorage()
  }

  function loadFromStorage() {
    const stored = localStorage.getItem('products')
    if (stored) {
      products.value = JSON.parse(stored)
    } else {
      initializeSampleProducts()
    }

    const storedDistributors = localStorage.getItem('distributors')
    if (storedDistributors) {
      distributors.value = JSON.parse(storedDistributors)
    }
  }

  function saveToStorage() {
    localStorage.setItem('products', JSON.stringify(products.value))
    localStorage.setItem('distributors', JSON.stringify(distributors.value))
  }

  function addProduct(product) {
    products.value.push(product)
    saveToStorage()
  }

  function updateProduct(codigo, updatedProduct) {
    const index = products.value.findIndex(p => p.codigo === codigo)
    if (index !== -1) {
      products.value[index] = updatedProduct
      saveToStorage()
    }
  }

  function deleteProduct(codigo) {
    products.value = products.value.filter(p => p.codigo !== codigo)
    saveToStorage()
  }

  function addDistributor(distributor) {
    distributor.id = Date.now()
    distributors.value.push(distributor)
    saveToStorage()
  }

  function updateDistributor(id, updatedDistributor) {
    const index = distributors.value.findIndex(d => d.id === id)
    if (index !== -1) {
      distributors.value[index] = updatedDistributor
      saveToStorage()
    }
  }

  function deleteDistributor(id) {
    distributors.value = distributors.value.filter(d => d.id !== id)
    saveToStorage()
  }

  // Initialize on store creation
  loadFromStorage()

  return {
    products,
    distributors,
    sucursales,
    totalProducts,
    totalStock,
    totalValue,
    totalProfit,
    addProduct,
    updateProduct,
    deleteProduct,
    addDistributor,
    updateDistributor,
    deleteDistributor,
    generateRandomStock,
    saveToStorage
  }
})
