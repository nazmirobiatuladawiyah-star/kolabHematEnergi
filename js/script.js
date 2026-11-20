const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('.menu a').forEach(function (link) {
  link.addEventListener('click', function () {
    document.querySelectorAll('.menu a').forEach(function (item) {
      item.classList.remove('active');
    });
    link.classList.add('active');

    if (navLinks) {
      navLinks.classList.remove('active');
    }
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

function formatNumber(value, digits) {
  return Number(value).toLocaleString('id-ID', {
    minimumFractionDigits: digits || 0,
    maximumFractionDigits: digits || 0
  });
}

function formatPercent(value) {
  return `${formatNumber(value, 1)}%`;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[character];
  });
}

const recommendationActions = {
  P04: 'Aktifkan mode hemat daya, turunkan kecerahan layar, dan tutup laptop saat tidak dipakai. Buat jeda bebas layar saat istirahat.',
  P09: 'Bentuk pasangan pengingat energi di kelas. Sampaikan ajakan dengan ramah saat melihat lampu atau perangkat menyala tanpa digunakan.',
  P05: 'Untuk perjalanan yang memungkinkan, pilih berjalan kaki, bersepeda, atau berbagi kendaraan. Rencanakan perjalanan bersama teman.',
  P08: 'Atur AC atau kipas secukupnya, manfaatkan ventilasi, dan matikan pendingin ketika ruangan kosong.',
  P07: 'Buka tirai dan jendela saat cahaya alami cukup agar lampu kelas tidak perlu dinyalakan.',
  P03: 'Tunjuk petugas piket untuk memeriksa lampu, AC, dan kipas setiap kali kelas ditinggalkan.',
  P10: 'Jadikan pemeriksaan sakelar dan perangkat sebagai bagian dari rutinitas sebelum pulang.',
  P06: 'Cabut charger dari stopkontak setelah baterai terisi dan perangkat tidak digunakan.',
  P02: 'Terapkan kebiasaan mematikan peralatan di kelas, bengkel, dan laboratorium setelah kegiatan selesai.',
  P01: 'Pertahankan kebiasaan hemat energi harian dan bagikan praktik baik kepada teman.'
};

const challengeActions = [
  'Matikan lampu dan kipas saat meninggalkan ruangan.',
  'Cabut charger setelah selesai digunakan.',
  'Aktifkan mode hemat daya pada gawai atau laptop.',
  'Manfaatkan cahaya matahari sebelum menyalakan lampu.',
  'Ajak satu teman melakukan satu aksi hemat energi.'
];

function renderOverview(data) {
  const overviewCards = document.getElementById('overviewCards');
  if (!overviewCards) return;

  const cards = [
    { label: 'Responden', value: formatNumber(data.meta.jumlah_responden), detail: 'siswa terdata' },
    { label: 'Rata-rata skor', value: formatNumber(data.ringkasan.rata_rata_total, 2), detail: 'dari skor total 10–40' },
    { label: 'Partisipasi', value: formatPercent(data.meta.persen_partisipasi), detail: 'dari siswa kelas XI terdata' },
    { label: 'Sering berperilaku', value: formatPercent(data.ringkasan.persen_sering_rata_rata), detail: 'rata-rata perilaku positif' }
  ];

  overviewCards.innerHTML = cards.map(function (card) {
    return `
      <div class="stat-card">
        <span>${card.label}</span>
        <strong>${card.value}</strong>
        <small>${card.detail}</small>
      </div>
    `;
  }).join('');

  const heroRespondents = document.getElementById('heroRespondents');
  const heroPositive = document.getElementById('heroPositive');
  if (heroRespondents) heroRespondents.textContent = formatNumber(data.meta.jumlah_responden);
  if (heroPositive) heroPositive.textContent = formatPercent(data.ringkasan.persen_sering_rata_rata);
}

function renderHighlights(data) {
  const categoryList = document.getElementById('categoryList');
  if (categoryList) {
    const categories = Object.entries(data.ringkasan.kategori);
    const total = categories.reduce(function (sum, entry) {
      return sum + Number(entry[1]);
    }, 0);

    categoryList.innerHTML = categories.map(function (entry) {
      const label = entry[0];
      const value = Number(entry[1]);
      const percent = total ? (value / total) * 100 : 0;
      return `
        <div class="category-bar-item">
          <div class="category-label">
            <span>${escapeHTML(label)}</span>
            <strong>${formatNumber(value)}</strong>
          </div>
          <div class="category-bar-track">
            <span class="category-bar-fill" style="width:${percent}%"></span>
          </div>
          <small>${formatPercent(percent)}</small>
        </div>
      `;
    }).join('');
  }

  const topIndicators = document.getElementById('topIndicators');
  if (topIndicators) {
    topIndicators.innerHTML = data.ringkasan.sorotan.butir_tertinggi.map(function (item) {
      return `
        <li>
          <span class="indicator-badge">${escapeHTML(item.kode)}</span>
          <div>
            <strong>${escapeHTML(item.label)}</strong>
            <small>Rata-rata ${formatNumber(item.rata_rata, 2)}</small>
          </div>
        </li>
      `;
    }).join('');
  }

  const lowIndicators = document.getElementById('lowIndicators');
  if (lowIndicators) {
    lowIndicators.innerHTML = data.ringkasan.sorotan.butir_terendah.map(function (item) {
      return `
        <li>
          <span class="indicator-badge warning">${escapeHTML(item.kode)}</span>
          <div>
            <strong>${escapeHTML(item.label)}</strong>
            <small>Jarang ${formatPercent(item.persen_jarang)}</small>
          </div>
        </li>
      `;
    }).join('');
  }

  const scoreDistribution = document.getElementById('scoreDistribution');
  if (scoreDistribution && data.sebaran_skor_total && data.sebaran_skor_total.length) {
    const maxCount = Math.max.apply(null, data.sebaran_skor_total.map(function (item) {
      return Number(item.jumlah);
    }));
    scoreDistribution.innerHTML = data.sebaran_skor_total.map(function (item) {
      const height = maxCount ? (Number(item.jumlah) / maxCount) * 100 : 0;
      return `
        <div class="distribution-item" title="Skor ${item.skor_total}: ${item.jumlah} siswa">
          <span>${escapeHTML(item.skor_total)}</span>
          <div class="distribution-track">
            <span style="height:${height}%"></span>
          </div>
          <small>${formatNumber(item.jumlah)}</small>
        </div>
      `;
    }).join('');
  } else if (scoreDistribution) {
    const panel = scoreDistribution.closest('.panel');
    if (panel) panel.hidden = true;
  }
}

function renderIndicatorTable(data) {
  const indicatorTable = document.getElementById('indicatorTable');
  if (!indicatorTable) return;

  indicatorTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Kode</th>
          <th>Perilaku</th>
          <th>Jumlah skor 1–4</th>
          <th>Persentase skor 1–4</th>
          <th>Rata-rata</th>
          <th>Sering</th>
          <th>Jarang</th>
        </tr>
      </thead>
      <tbody>
        ${data.per_butir.map(function (item) {
          const counts = item.jumlah_per_skor ? Object.values(item.jumlah_per_skor).map(formatNumber).join(' / ') : '–';
          const percentages = item.persen_per_skor ? Object.values(item.persen_per_skor).map(formatPercent).join(' / ') : '–';
          return `
            <tr>
              <td><span class="indicator-badge">${escapeHTML(item.kode)}</span></td>
              <td>${escapeHTML(item.label)}</td>
              <td>${counts}</td>
              <td>${percentages}</td>
              <td>${formatNumber(item.rata_rata, 2)}</td>
              <td>${formatPercent(item.persen_sering)}</td>
              <td>${formatPercent(item.persen_jarang)}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

function renderCharts(data) {
  if (typeof Chart === 'undefined') return;

  const categoryCanvas = document.getElementById('categoryChart');
  if (categoryCanvas) {
    const categories = Object.entries(data.ringkasan.kategori);
    new Chart(categoryCanvas, {
      type: 'doughnut',
      data: {
        labels: categories.map(function (entry) { return entry[0]; }),
        datasets: [{
          data: categories.map(function (entry) { return Number(entry[1]); }),
          backgroundColor: ['#168747', '#57c785', '#f4bd4f', '#dc7b68'],
          borderColor: '#ffffff',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        },
        cutout: '62%'
      }
    });
  }

  const behaviorCanvas = document.getElementById('behaviorChart');
  if (behaviorCanvas) {
    new Chart(behaviorCanvas, {
      type: 'bar',
      data: {
        labels: data.per_butir.map(function (item) { return item.kode; }),
        datasets: [{
          label: 'Rata-rata skor (maks. 4)',
          data: data.per_butir.map(function (item) { return Number(item.rata_rata); }),
          backgroundColor: data.per_butir.map(function (item) {
            return Number(item.rata_rata) <= 3.3 ? '#e5a22d' : '#2f9b5b';
          }),
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 1, max: 4, ticks: { stepSize: 1 } },
          x: { grid: { display: false } }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: function (items) {
                const item = data.per_butir[items[0].dataIndex];
                return `${item.kode} · ${item.label}`;
              }
            }
          }
        }
      }
    });
  }

  const majorCanvas = document.getElementById('majorChart');
  if (majorCanvas) {
    new Chart(majorCanvas, {
      type: 'bar',
      data: {
        labels: data.per_jurusan.map(function (item) { return item.kode; }),
        datasets: [{
          label: 'Rata-rata skor (maks. 4)',
          data: data.per_jurusan.map(function (item) { return Number(item.rata_rata_skor); }),
          backgroundColor: '#2f9b5b',
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { min: 1, max: 4, ticks: { stepSize: 1 } },
          y: { grid: { display: false } }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: function (items) {
                const item = data.per_jurusan[items[0].dataIndex];
                return `${item.kode} · ${item.nama}`;
              }
            }
          }
        }
      }
    });
  }
}

function renderRecommendations(data) {
  const recommendationList = document.getElementById('recommendationList');
  if (!recommendationList) return;

  const lowestBehaviors = data.per_butir.slice().sort(function (first, second) {
    return Number(first.persen_sering) - Number(second.persen_sering);
  }).slice(0, 5);

  recommendationList.innerHTML = lowestBehaviors.map(function (item, index) {
    const action = recommendationActions[item.kode] || 'Pilih satu langkah hemat energi yang sesuai, lakukan secara rutin, dan ajak teman untuk ikut.';
    return `
      <article class="recommendation-card">
        <span class="indicator-badge warning">${String(index + 1).padStart(2, '0')}</span>
        <h3>${escapeHTML(item.label)}</h3>
        <span class="recommendation-evidence">Sering dilakukan ${formatPercent(item.persen_sering)} · rata-rata ${formatNumber(item.rata_rata, 2)} dari 4</span>
        <p>${escapeHTML(action)}</p>
      </article>
    `;
  }).join('');
}

function renderChallenge() {
  const checklist = document.getElementById('challengeChecklist');
  const progressText = document.getElementById('challengeProgressText');
  const progressBar = document.getElementById('challengeProgressBar');
  if (!checklist || !progressText || !progressBar) return;

  checklist.innerHTML = challengeActions.map(function (action, index) {
    return `
      <label>
        <input type="checkbox" name="challenge-action" value="${index}">
        <span>${escapeHTML(action)}</span>
      </label>
    `;
  }).join('');

  checklist.addEventListener('change', function () {
    const completed = checklist.querySelectorAll('input:checked').length;
    const total = challengeActions.length;
    const progress = (completed / total) * 100;
    progressText.textContent = `${completed} dari ${total} aksi dipilih`;
    progressBar.setAttribute('aria-valuenow', String(completed));
    progressBar.querySelector('span').style.width = `${progress}%`;
  });
}

function renderDashboard(data, source) {
  if (!data || !data.meta || !data.ringkasan || !Array.isArray(data.per_butir)) {
    throw new Error('Struktur data survei tidak sesuai.');
  }

  renderOverview(data);
  renderHighlights(data);
  renderIndicatorTable(data);
  renderCharts(data);
  renderRecommendations(data);

  const sourceNote = document.getElementById('dataSourceNote');
  if (sourceNote) {
    sourceNote.textContent = `Sumber: ${source} · ${data.meta.judul} · ${data.meta.tanggal_pengisian.awal} hingga ${data.meta.tanggal_pengisian.akhir}.`;
  }
}

async function loadSurveyData() {
  if (window.location.protocol === 'file:' && window.DATA_ENERGI) {
    renderDashboard(window.DATA_ENERGI, 'data-perilaku-energi.js (mode file lokal)');
    return;
  }

  try {
    const response = await fetch('js/data-perilaku-energi.json');
    if (!response.ok) {
      throw new Error(`Gagal memuat JSON survei (HTTP ${response.status}).`);
    }
    renderDashboard(await response.json(), 'data-perilaku-energi.json');
  } catch (error) {
    if (window.DATA_ENERGI) {
      console.warn('JSON survei tidak dapat dimuat; menggunakan data JavaScript cadangan.', error);
      renderDashboard(window.DATA_ENERGI, 'data-perilaku-energi.js (cadangan)');
      return;
    }

    console.error('Data survei gagal dimuat.', error);
    const sourceNote = document.getElementById('dataSourceNote');
    if (sourceNote) {
      sourceNote.textContent = 'Data survei tidak dapat dimuat. Periksa file JSON dan jalankan website melalui server lokal.';
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  renderChallenge();
  loadSurveyData();
});