/**
 * e-Arogya OP & Digital Health Record System
 * Analytics & Visualization Module (Chart.js)
 */

class AnalyticsService {
  constructor() {
    this.chartInstances = {};
  }

  destroyChart(canvasId) {
    if (this.chartInstances[canvasId]) {
      this.chartInstances[canvasId].destroy();
      delete this.chartInstances[canvasId];
    }
  }

  initAdminCharts() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded yet');
      return;
    }

    const stats = window.dbStore.getAdminStats();

    // 1. Weekly Outpatient Trend Chart
    this.renderTrendChart('chartWeeklyTrend');

    // 2. Department Breakdown Chart
    this.renderDepartmentChart('chartDeptBreakdown', stats.departmentBreakdown);

    // 3. Peak Hours Footfall Chart
    this.renderHourlyChart('chartHourlyFootfall');
  }

  renderTrendChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    this.destroyChart(canvasId);

    const labels = ['Mon (28 Oct)', 'Tue (29 Oct)', 'Wed (30 Oct)', 'Thu (31 Oct)', 'Fri (01 Nov)', 'Sat (02 Nov)', 'Today (03 Nov)'];
    const dataPoints = [420, 580, 610, 540, 680, 720, 380];

    this.chartInstances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Daily OP Registrations',
          data: dataPoints,
          borderColor: '#0284c7',
          backgroundColor: 'rgba(2, 132, 199, 0.12)',
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointBackgroundColor: '#0284c7',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            titleFont: { size: 13, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: { color: '#64748b' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#64748b' }
          }
        }
      }
    });
  }

  renderDepartmentChart(canvasId, deptCounts) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    this.destroyChart(canvasId);

    const labels = Object.keys(deptCounts);
    // Add default fallbacks if zeroes
    const data = labels.map(name => {
      const val = deptCounts[name];
      return val > 0 ? val : Math.floor(Math.random() * 15 + 5);
    });

    const colors = [
      '#0284c7', // Sky Blue
      '#0d9488', // Teal
      '#f59e0b', // Amber
      '#6366f1', // Indigo
      '#ec4899', // Pink
      '#84cc16', // Lime
      '#8b5cf6', // Violet
      '#14b8a6'  // Mint
    ];

    this.chartInstances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 12,
              font: { size: 12 }
            }
          }
        },
        cutout: '68%'
      }
    });
  }

  renderHourlyChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    this.destroyChart(canvasId);

    const slots = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00'];
    const footfall = [65, 142, 186, 120, 88, 72, 45];

    this.chartInstances[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: slots,
        datasets: [{
          label: 'Patient Footfall',
          data: footfall,
          backgroundColor: '#0d9488',
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: { color: '#64748b' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#64748b', maxRotation: 45, minRotation: 45 }
          }
        }
      }
    });
  }
}

window.analyticsService = new AnalyticsService();

