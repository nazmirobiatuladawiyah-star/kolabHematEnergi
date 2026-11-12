const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('active');
  });
}

const allLinks = document.querySelectorAll('.menu a');
allLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    allLinks.forEach(function (item) {
      item.classList.remove('active');
    });
    this.classList.add('active');

    if (navLinks) {
      navLinks.classList.remove('active');
    }
  });
});

function formatPercent(value) {
  return `${Number(value).toFixed(1)}%`;
}

function renderDashboard() {
  const data = window.DATA_ENERGI;
  if (!data) return;

  const overviewCards = document.getElementById('overviewCards');
  const categoryList = document.getElementById('categoryList');
  const topIndicators = document.getElementById('topIndicators');
  const lowIndicators = document.getElementById('lowIndicators');
  const indicatorTable = document.getElementById('indicatorTable');
  const scoreDistribution = document.getElementById('scoreDistribution');

  if (overviewCards) {
    const cards = [
      { label: 'Responden', value: data.meta.jumlah_responden.toLocaleString('id-ID'), detail: 'siswa terdata' },
      { label: 'Rata-rata skor', value: data.ringkasan.rata_rata_total.toFixed(2), detail: 'dari skor total 10-40' },
      { label: 'Partisipasi', value: `${data.meta.persen_partisipasi}%`, detail: 'kehadiran responden' },
      { label: 'Sering berperilaku', value: `${data.ringkasan.persen_sering_rata_rata}%`, detail: 'rata-rata perilaku positif' }
    ];

    overviewCards.innerHTML = cards.map(card => `
      <div class="stat-card">
        <span>${card.label}</span>
        <strong>${card.value}</strong>
        <small>${card.detail}</small>
      </div>
    `).join('');
  }

  if (categoryList) {
    const categories = Object.entries(data.ringkasan.kategori);
    const total = categories.reduce((sum, [, value]) => sum + value, 0);

    categoryList.innerHTML = categories.map(([label, value]) => {
      const percent = (value / total) * 100;
      return `
        <div class="category-bar-item">
          <div class="category-label">
            <span>${label}</span>
            <strong>${value}</strong>
          </div>
          <div class="category-bar-track">
            <span class="category-bar-fill" style="width:${percent}%"></span>
          </div>
          <small>${percent.toFixed(1)}%</small>
        </div>
      `;
    }).join('');
  }

  if (topIndicators) {
    const top = data.ringkasan.sorotan.butir_tertinggi;
    topIndicators.innerHTML = top.map(item => `
      <li>
        <span class="indicator-badge">${item.kode}</span>
        <div>
          <strong>${item.label}</strong>
          <small>Rata-rata ${item.rata_rata.toFixed(2)}</small>
        </div>
      </li>
    `).join('');
  }

  if (lowIndicators) {
    const low = data.ringkasan.sorotan.butir_terendah;
    lowIndicators.innerHTML = low.map(item => `
      <li>
        <span class="indicator-badge warning">${item.kode}</span>
        <div>
          <strong>${item.label}</strong>
          <small>Jarang ${formatPercent(item.persen_jarang)}</small>
        </div>
      </li>
    `).join('');
  }

  if (indicatorTable) {
    indicatorTable.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Kode</th>
            <th>Perilaku</th>
            <th>Jumlah skor 1-4</th>
            <th>Persentase skor 1-4</th>
            <th>Rata-rata</th>
            <th>Sering</th>
            <th>Jarang</th>
          </tr>
        </thead>
        <tbody>
          ${data.per_butir.map(item => `
            <tr>
              <td><span class="indicator-badge">${item.kode}</span></td>
              <td>${item.label}</td>
              <td>${item.jumlah_per_skor ? Object.values(item.jumlah_per_skor).join(' / ') : '-'}</td>
              <td>${item.persen_per_skor ? Object.values(item.persen_per_skor).map(formatPercent).join(' / ') : '-'}</td>
              <td>${item.rata_rata.toFixed(2)}</td>
              <td>${formatPercent(item.persen_sering)}</td>
              <td>${formatPercent(item.persen_jarang)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  if (scoreDistribution && data.sebaran_skor_total) {
    const maxCount = Math.max(...data.sebaran_skor_total.map(item => item.jumlah));
    scoreDistribution.innerHTML = data.sebaran_skor_total.map(item => `
      <div class="distribution-item" title="Skor ${item.skor_total}: ${item.jumlah} siswa">
        <span>${item.skor_total}</span>
        <div class="distribution-track">
          <span style="height:${(item.jumlah / maxCount) * 100}%"></span>
        </div>
        <small>${item.jumlah}</small>
      </div>
    `).join('');
  } else if (scoreDistribution) {
    scoreDistribution.closest('.panel').hidden = true;
  }

}

document.addEventListener('DOMContentLoaded', function () {
  renderDashboard();
});