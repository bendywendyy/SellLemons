// Navigation
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

navItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const target = item.dataset.page;

    navItems.forEach(n => n.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));

    item.classList.add('active');
    document.getElementById('page-' + target).classList.add('active');
  });
});

// Preset buttons
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.preset-grid').querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Apply buttons — simulate applying
document.querySelectorAll('.btn-apply').forEach(btn => {
  btn.addEventListener('click', () => {
    const original = btn.textContent;
    btn.textContent = 'Applying...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Applied ✓';
      btn.style.color = '#22c55e';
      btn.style.borderColor = 'rgba(34,197,94,0.4)';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.disabled = false;
      }, 2000);
    }, 800);
  });
});

// Performance Chart
const ctx = document.getElementById('perfChart');
if (!ctx) return;

const dataPoints = 61;

function generateData(base, variance) {
  const data = [];
  let v = base;
  for (let i = 0; i < dataPoints; i++) {
    v += (Math.random() - 0.5) * variance;
    v = Math.max(5, Math.min(95, v));
    data.push(Math.round(v));
  }
  return data;
}

const datasets = {
  cpu: generateData(45, 8),
  gpu: generateData(30, 12),
  ram: generateData(60, 5),
};

const chartConfig = {
  type: 'line',
  data: {
    labels: Array.from({ length: dataPoints }, (_, i) => ''),
    datasets: [{
      data: datasets.cpu,
      borderColor: '#7c3aed',
      backgroundColor: 'rgba(124,58,237,0.15)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 200 },
    scales: {
      x: { display: false },
      y: {
        display: true,
        min: 0, max: 100,
        ticks: {
          color: '#6b6b8a',
          font: { size: 10 },
          callback: v => v + '%',
          stepSize: 20,
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
        border: { display: false },
      }
    },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  }
};

const chart = new Chart(ctx, chartConfig);

// Tab switching
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const key = btn.dataset.chart;
    chart.data.datasets[0].data = [...datasets[key]];
    chart.update('none');
  });
});

// Live CPU animation
setInterval(() => {
  const activeKey = document.querySelector('.tab-btn.active')?.dataset.chart || 'cpu';
  const arr = datasets[activeKey];
  const last = arr[arr.length - 1];
  const next = Math.max(5, Math.min(95, last + (Math.random() - 0.5) * 8));
  arr.shift();
  arr.push(Math.round(next));
  chart.data.datasets[0].data = [...arr];
  chart.update('none');
}, 1000);
