/**
 * Dashboard JavaScript functionality
 * Handles real-time data loading, charts, and interactive features
 */

// Global variables
let dashboardCharts = {};
let updateInterval = null;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    startAutoRefresh();
});

/**
 * Initialize dashboard components
 */
function initializeDashboard() {
    console.log('Initializing Dashboard...');
    
    // Load initial data
    loadDashboardStats();
    loadRecentActivity();
    
    // Initialize charts with a small delay to ensure DOM is ready
    setTimeout(() => {
        initializeCharts();
    }, 500);
}

/**
 * Load dashboard statistics
 */
function loadDashboardStats() {
    // Show loading spinners
    showStatsLoading();
    
    // Load product statistics
    fetch('/api/products/stats')
        .then(response => response.json())
        .then(data => {
            updateStatsCard('totalProducts', data.totalProducts || 0, 'productos');
            updateStatsCard('lowStockProducts', data.lowStockProducts || 0, 'stock bajo');
            updateStatsCard('totalValue', formatCurrency(data.totalValue || 0), 'valor total');
        })
        .catch(error => {
            console.error('Error loading product stats:', error);
            updateStatsCard('totalProducts', 'Error', '');
            updateStatsCard('lowStockProducts', 'Error', '');
            updateStatsCard('totalValue', 'Error', '');
        });
    
    // Load user statistics (if authorized)
    if (hasPermission('ADMIN') || hasPermission('MANAGER')) {
        fetch('/api/users/stats')
            .then(response => response.json())
            .then(data => {
                updateStatsCard('activeUsers', data.activeUsers || 0, 'usuarios activos');
            })
            .catch(error => {
                console.error('Error loading user stats:', error);
                updateStatsCard('activeUsers', 'N/A', '');
            });
    }
}

/**
 * Update statistics card
 */
function updateStatsCard(cardId, value, label) {
    const element = document.getElementById(cardId);
    if (element) {
        element.innerHTML = `
            <span class="stats-number">${value}</span>
            ${label && `<small class="text-muted d-block">${label}</small>`}
        `;
        
        // Add animation
        element.classList.add('animate__animated', 'animate__fadeIn');
        setTimeout(() => {
            element.classList.remove('animate__animated', 'animate__fadeIn');
        }, 1000);
    }
}

/**
 * Show loading spinners for stats cards
 */
function showStatsLoading() {
    const statCards = ['totalProducts', 'lowStockProducts', 'totalValue', 'activeUsers'];
    statCards.forEach(cardId => {
        const element = document.getElementById(cardId);
        if (element) {
            element.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }
    });
}

/**
 * Initialize charts
 */
function initializeCharts() {
    try {
        initializeCategoryChart();
        initializeStockChart();
        initializeTrendChart();
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

/**
 * Initialize category distribution chart
 */
function initializeCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    dashboardCharts.categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Libros', 'Otros'],
            datasets: [{
                data: [12, 19, 8, 5, 3, 7],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB', 
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + ' productos';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Initialize stock status chart
 */
function initializeStockChart() {
    const ctx = document.getElementById('stockChart');
    if (!ctx) return;
    
    dashboardCharts.stockChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Stock Normal', 'Stock Bajo', 'Sin Stock'],
            datasets: [{
                data: [70, 20, 10],
                backgroundColor: [
                    '#28A745',
                    '#FFC107',
                    '#DC3545'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

/**
 * Initialize trend chart (optional)
 */
function initializeTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    
    const labels = [];
    const data = [];
    
    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('es-ES', { 
            month: 'short', 
            day: 'numeric' 
        }));
        data.push(Math.floor(Math.random() * 50) + 10);
    }
    
    dashboardCharts.trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Productos Agregados',
                data: data,
                borderColor: '#007BFF',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Load recent activity feed
 */
function loadRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    // Mock activity data - replace with actual API call
    const activities = [
        {
            type: 'success',
            icon: 'plus-circle',
            text: 'Nuevo producto agregado: "Samsung Galaxy S24"',
            time: '2 minutos atrás',
            user: 'Admin'
        },
        {
            type: 'warning',
            icon: 'exclamation-triangle',
            text: 'Stock bajo detectado en: "iPhone 15 Pro"',
            time: '15 minutos atrás',
            user: 'Sistema'
        },
        {
            type: 'info',
            icon: 'edit',
            text: 'Producto actualizado: "MacBook Air M2"',
            time: '1 hora atrás',
            user: 'Manager'
        },
        {
            type: 'success',
            icon: 'user-plus',
            text: 'Nuevo usuario registrado: "Carlos Mendez"',
            time: '2 horas atrás',
            user: 'Admin'
        }
    ];
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item activity-${activity.type}">
            <div class="d-flex align-items-start">
                <i class="fas fa-${activity.icon} me-2 mt-1 text-${activity.type}"></i>
                <div class="flex-grow-1">
                    <p class="mb-1">${activity.text}</p>
                    <small class="text-muted">
                        <i class="fas fa-clock"></i> ${activity.time} por ${activity.user}
                    </small>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refreshDashboard');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';
            loadDashboardStats();
            loadRecentActivity();
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-sync"></i> Actualizar';
            }, 2000);
        });
    }
    
    // Export buttons
    const exportPdfBtn = document.getElementById('exportPdf');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', function() {
            window.open('/api/reports/dashboard/pdf', '_blank');
        });
    }
    
    // Settings modal
    const settingsBtn = document.getElementById('dashboardSettings');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            // Open settings modal
            console.log('Opening dashboard settings...');
        });
    }
}

/**
 * Start auto-refresh functionality
 */
function startAutoRefresh() {
    // Refresh every 5 minutes
    updateInterval = setInterval(() => {
        loadDashboardStats();
        loadRecentActivity();
    }, 5 * 60 * 1000);
}

/**
 * Stop auto-refresh
 */
function stopAutoRefresh() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

/**
 * Utility Functions
 */

/**
 * Format currency
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

/**
 * Check user permissions
 */
function hasPermission(role) {
    // This should be replaced with actual permission checking
    // For now, we'll assume permissions are available globally
    return window.userRoles && window.userRoles.includes('ROLE_' + role);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

/**
 * Handle page visibility change
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopAutoRefresh();
    } else {
        startAutoRefresh();
        // Refresh data when page becomes visible again
        loadDashboardStats();
    }
});

/**
 * Cleanup when page is unloaded
 */
window.addEventListener('beforeunload', function() {
    stopAutoRefresh();
    
    // Destroy charts to prevent memory leaks
    Object.values(dashboardCharts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
});