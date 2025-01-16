// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC6KJ5A00MpmeIrS_InSn3XY3rLYPbY-bE",
    authDomain: "car-55af9.firebaseapp.com",
    projectId: "car-55af9",
    storageBucket: "car-55af9.firebasestorage.app",
    messagingSenderId: "672981054937",
    appId: "1:672981054937:web:71ac69b6e3c8772002d5c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
  loadItems();
});

function addItem() {
  const name = document.getElementById('name').value;
  const role = document.getElementById('role').value;
  const colleaguesSelect = document.getElementById('colleagues');
  const details = document.getElementById('details').value;

  const selectedColleagues = Array.from(colleaguesSelect.selectedOptions).map(option => option.value).join(', ');

  if (name && role && details) {
    const newItem = {
      name,
      role,
      details,
      colleagues: selectedColleagues
    };

    // Firebase'e yeni öğe ekle
    const newItemKey = ref(database, 'items').push().key;
    const updates = {};
    updates['/items/' + newItemKey] = newItem;
    update(ref(database), updates);

    renderNewItem(newItem, newItemKey);
  }
}

function renderNewItem(itemData, itemKey) {
  const container = document.querySelector('.container');
  const newItem = document.createElement('div');
  newItem.className = 'item';
  newItem.dataset.key = itemKey;

  newItem.innerHTML = `
    <strong>${itemData.name} <span class="icon">${itemData.role}</span></strong>
    <p>${itemData.details}</p>
    <p>Ortak Çalıştığı Kişiler: ${itemData.colleagues}</p>
    <button onclick="editItem(this)">Düzenle</button>
    <button onclick="deleteItem(this)">Sil</button>
  `;

  container.appendChild(newItem);

  newItem.addEventListener('mouseover', mouseOverHandler);
  newItem.addEventListener('mouseout', mouseOutHandler);

  newItem.addEventListener('remove', () => {
    newItem.removeEventListener('mouseover', mouseOverHandler);
    newItem.removeEventListener('mouseout', mouseOutHandler);
  });
}

function mouseOverHandler(event) {
  const item = event.currentTarget;
  item.classList.add('glow');
  const nameParts = item.querySelector('strong').textContent.split(' ');
  if (nameParts.length < 3) return;
  const name = nameParts[0] + ' ' + nameParts[1];
  const colleaguesText = nameParts.slice(2).join(' ').replace(/[()]/g, '');
  const info = document.getElementById('info');
  if (info) {
    info.textContent = `${name} toplamda ${colleaguesText.split(', ').length} kişiyle beraber çalışıyor. Ortak çalıştığı kişiler: ${colleaguesText}`;
    info.style.display = 'block';
  }
}

function mouseOutHandler(event) {
  const item = event.currentTarget;
  item.classList.remove('glow');
  const info = document.getElementById('info');
  if (info) {
    info.style.display = 'none';
  }
}

function editItem(button) {
  const item = button.parentElement;
  const itemKey = item.dataset.key;
  const name = item.querySelector('strong').textContent.split(' ')[0];
  const role = item.querySelector('.icon').textContent;
  const details = item.querySelector('p').textContent;
  const colleagues = item.querySelector('p:nth-child(3)').textContent.replace('Ortak Çalıştığı Kişiler: ', '').split(', ');

  document.getElementById('name').value = name;
  document.getElementById('role').value = role;
  document.getElementById('details').value = details;

  const colleaguesSelect = document.getElementById('colleagues');
  Array.from(colleaguesSelect.options).forEach(option => {
    option.selected = colleagues.includes(option.value);
  });

  // Firebase'den öğeyi sil
  remove(ref(database, 'items/' + itemKey));

  item.remove();
}

function deleteItem(button) {
  const item = button.parentElement;
  const itemKey = item.dataset.key;

  // Firebase'den öğeyi sil
  remove(ref(database, 'items/' + itemKey));

  item.remove();
}

function loadItems() {
  const dbRef = ref(database);
  get(child(dbRef, 'items')).then((snapshot) => {
    if (snapshot.exists()) {
      const items = snapshot.val();
      Object.keys(items).forEach((key) => {
        renderNewItem(items[key], key);
      });
    }
  }).catch((error) => {
    console.error(error);
  });
}

document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('mouseover', mouseOverHandler);
  item.addEventListener('mouseout', mouseOutHandler);

  item.addEventListener('remove', () => {
    item.removeEventListener('mouseover', mouseOverHandler);
    item.removeEventListener('mouseout', mouseOutHandler);
  });
});
