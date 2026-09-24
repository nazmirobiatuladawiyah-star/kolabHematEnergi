const tombolHp = document.getElementById('tombolHp');
const menuNavigasi = document.getElementById('menuNavigasi');

if (tombolHp) {
  tombolHp.addEventListener('click', function() {
    menuNavigasi.classList.toggle('buka');
  });
}

const semuaLink = document.querySelectorAll('.menu a');

semuaLink.forEach(function(link) {
  link.addEventListener('click', function() {
    menuNavigasi.classList.remove('buka');
  });
});