// Yeni öğe ekleme işlevi
function addItem() {
  const name = document.getElementById('name').value;
  const role = document.getElementById('role').value;
  const colleaguesSelect = document.getElementById('colleagues');
  const details = document.getElementById('details').value;

  const selectedColleagues = Array.from(colleaguesSelect.selectedOptions).map(option => option.value).join(', ');

  if (name && role && details) {
      // Aynı kişiyi birden fazla kez eklemeyi önle
      const existingItems = document.querySelectorAll('.item strong');
      for (let item of existingItems) {
          if (item.textContent.includes(name)) {
              alert('Bu kişi zaten eklenmiş.');
              return;
          }
      }

      const container = document.querySelector('.container tbody');
      const newItem = document.createElement('tr');
      newItem.className = 'item';

      newItem.innerHTML = `
        <td><strong>${name} <span class="icon">${role}</span></strong></td>
        <td>${selectedColleagues}</td>
        <td class="details">${details}</td>
        <td class="action-buttons">
          <button class="edit-button" onclick="editRow(this)">Düzenle</button>
          <button class="delete-button" onclick="deleteRow(this)">Sil</button>
        </td>
      `;

      container.appendChild(newItem);

      // Yeni eklenen kişiyi seçeneklere ekle
      const newOption = document.createElement('option');
      newOption.value = name;
      newOption.textContent = name;
      colleaguesSelect.appendChild(newOption);

      // Formu temizle
      document.getElementById('name').value = '';
      document.getElementById('role').value = '';
      document.getElementById('details').value = '';

      // Glow efekti ekle
      newItem.addEventListener('mouseover', () => {
          newItem.classList.add('glow');
          const info = document.getElementById('info');
          info.textContent = `${name} toplamda ${selectedColleagues.split(', ').length} kişiyle beraber çalışıyor. Ortak çalıştığı kişiler: ${selectedColleagues}`;
          info.style.display = 'block';
      });

      newItem.addEventListener('mouseout', () => {
          newItem.classList.remove('glow');
          const info = document.getElementById('info');
          info.style.display = 'none';
      });
  } else {
      alert('Lütfen tüm alanları doldurun.');
  }
}

// Öğeyi silme işlevi
function deleteRow(button) {
  const row = button.closest('tr');
  const name = row.querySelector('strong').textContent.split(' ')[0] + ' ' + row.querySelector('strong').textContent.split(' ')[1];
  const colleaguesSelect = document.getElementById('colleagues');
  Array.from(colleaguesSelect.options).forEach(option => {
      if (option.value === name) {
          option.remove();
      }
  });
  row.remove();
}

// Öğeyi düzenleme işlevi
function editRow(button) {
  const row = button.closest('tr');
  const name = row.querySelector('strong').textContent.split(' ')[0] + ' ' + row.querySelector('strong').textContent.split(' ')[1];
  const role = row.querySelector('.icon').textContent;
  const details = row.querySelector('.details').textContent;

  document.getElementById('name').value = name;
  document.getElementById('role').value = role;
  document.getElementById('details').value = details;

  // Seçenekleri ayarla
  const colleaguesSelect = document.getElementById('colleagues');
  const colleagues = row.querySelector('td:nth-child(2)').textContent.split(', ');
  Array.from(colleaguesSelect.options).forEach(option => {
      option.selected = colleagues.includes(option.value);
  });

  // Öğeyi sil
  row.remove();
}

// Mevcut öğelere glow efekti ekle
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('mouseover', () => {
      item.classList.add('glow');
      const name = item.querySelector('strong').textContent.split(' ')[0] + ' ' + item.querySelector('strong').textContent.split(' ')[1];
      const colleaguesText = item.querySelector('td:nth-child(2)').textContent;
      const info = document.getElementById('info');
      info.textContent = `${name} toplamda ${colleaguesText.split(', ').length} kişiyle beraber çalışıyor. Ortak çalıştığı kişiler: ${colleaguesText}`;
      info.style.display = 'block';
  });

  item.addEventListener('mouseout', () => {
      item.classList.remove('glow');
      const info = document.getElementById('info');
      info.style.display = 'none';
  });
});

// Tema değiştirme ile ilgili işlevler kaldırıldı

function downloadTable() {
  // Tablo verilerini oluştur
  const data = [];
  document.querySelectorAll('.container tbody tr').forEach(row => {
      const name = row.querySelector('td:nth-child(1)').textContent.trim();
      const colleagues = row.querySelector('td:nth-child(2)').textContent.trim();
      const details = row.querySelector('td:nth-child(3)').textContent.trim();
      data.push([name, colleagues, details]);
  });

  // HTML verilerini oluştur
  let htmlData = `
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        th {
          background-color: #f2f2f2;
          text-align: left;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #ddd;
        }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
            <th>Kişi</th>
            <th>Birlikte Çalışabileceği Kişiler</th>
            <th>İş Birliği Detayları</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              <td>${row[0]}</td>
              <td>${row[1]}</td>
              <td>${row[2]}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // HTML dosyasını indir
  const blob = new Blob([htmlData], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gorevlendirme.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}