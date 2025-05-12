import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/+esm';

export const renderCharts = (user) => {
  // XP Progression Chart
  const xpProgression = user.xpProgression || [];
  const xpLabels = xpProgression.map(xp => new Date(xp.createdAt).toLocaleDateString());
  const xpData = xpProgression.map(xp => xp.amount);

  const xpCtx = document.getElementById('xpProgressionChart').getContext('2d');
  console.log(Chart)
  new Chart(xpCtx, {
    type: 'line',
    data: {
      labels: xpLabels,
      datasets: [{
        label: 'XP Earned',
        data: xpData,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false
          },
          ticks: {
            callback: function(value) {
              return value + ' XP';
            }
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });

  // User Distribution Chart
  const userDistribution = user.userDistribution || [];
  const distLabels = userDistribution.map(dist => dist.range);
  const distData = userDistribution.map(dist => dist.count);
  const userPosition = findUserPosition(userDistribution, user.totalXp?.aggregate?.sum?.amount || 0);

  const userDistCtx = document.getElementById('userDistributionChart').getContext('2d');
  new Chart(userDistCtx, {
    type: 'bar',
    data: {
      labels: distLabels,
      datasets: [{
        label: 'Number of Users',
        data: distData,
        backgroundColor: distLabels.map((_, index) => 
          index === userPosition ? '#3B82F6' : '#E5E7EB'
        ),
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.parsed.y + ' users';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false
          },
          title: {
            display: true,
            text: 'Number of Users'
          }
        },
        x: {
          grid: {
            display: false
          },
          title: {
            display: true,
            text: 'XP Range'
          }
        }
      }
    }
  });

  // Position the user marker on the correct bar
  const userMarker = document.createElement('div');
  userMarker.className = 'user-marker';
  userMarker.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
  document.querySelector('#userDistributionChart').parentElement.appendChild(userMarker);

  const chartContainer = document.querySelector('#userDistributionChart').parentElement;
  const chartWidth = chartContainer.offsetWidth;
  const barWidth = chartWidth / distLabels.length;
  const markerPosition = (userPosition * barWidth) + (barWidth / 2);
  
  userMarker.style.left = `${markerPosition}px`;
};

const findUserPosition = (distribution, userXp) => {
  if (!distribution || distribution.length === 0) return 0;
  
  // Convert XP ranges to numbers for comparison
  const ranges = distribution.map(dist => {
    const [min, max] = dist.range.split('-').map(Number);
    return { min, max };
  });

  // Find which range the user's XP falls into
  for (let i = 0; i < ranges.length; i++) {
    if (userXp >= ranges[i].min && (isNaN(ranges[i].max) || userXp <= ranges[i].max)) {
      return i;
    }
  }
  return 0;
};