/* =========================================================
   FnD System — contact & newsletter helpers
   The template forms have no backend, so the contact form
   composes a WhatsApp message instead of failing silently.
   ========================================================= */
(function () {
  'use strict';

  var WHATSAPP = '6285121951022';

  /* ---------- hero photo follows the slide ---------- */
  (function () {
    var layers = document.querySelectorAll('.main-banner .hero-photo');
    var slides = document.querySelectorAll('.main-banner .owl-item:not(.cloned) .item[data-photo]');
    if (layers.length !== 2 || !slides.length) { return; }

    var photos = Array.prototype.map.call(slides, function (el) {
      return el.getAttribute('data-photo');
    });
    var front = 0;

    function show(index) {
      if (!photos.length) { return; }
      var i = ((index % photos.length) + photos.length) % photos.length;
      var src = photos[i];
      if (!src) { return; }
      var back = 1 - front;
      layers[back].style.backgroundImage = 'url("' + src + '")';
      layers[back].classList.add('is-visible');
      layers[front].classList.remove('is-visible');
      front = back;
    }

    if (window.jQuery) {
      // the photo follows the numbered dots (the only navigation on the banner),
      // which keeps it in sync even when the carousel loops through clones
      var dots = document.querySelectorAll('.owl-banner .owl-dot');
      Array.prototype.forEach.call(dots, function (dot, index) {
        dot.addEventListener('click', function () { show(index); });
      });
      window.setTimeout(function () { show(0); }, 300);
    }  })();
  /* ---------- preloader safety ----------
     The template hides the preloader only on window.load; if an external
     resource (fonts, map) is slow, visitors would stare at the spinner. */
  function hidePreloader() {
    var pre = document.getElementById('js-preloader');
    if (pre) { pre.classList.add('loaded'); }
  }
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(hidePreloader, 1200);
  });
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 6000);
  document.addEventListener('DOMContentLoaded', function () {

    var year = document.getElementById('year');
    if (year) { year.textContent = new Date().getFullYear(); }

    /* ---------- contact form ---------- */
    var contact = document.getElementById('contactForm');
    if (contact) {
      contact.addEventListener('submit', function (e) {
        e.preventDefault();

        var get = function (id) {
          var el = document.getElementById(id);
          return el ? el.value.trim() : '';
        };

        var nama = get('name');
        var perusahaan = get('company');
        var jenis = get('jenis');
        var wa = get('whatsapp');
        var pesan = get('pesan');

        var layanan = [];
        contact.querySelectorAll('input[name="layanan"]:checked').forEach(function (box) {
          layanan.push(box.value);
        });

        if (!nama) {
          document.getElementById('name').focus();
          return;
        }

        var lines = [
          'Halo FnD System, saya ingin berkonsultasi.',
          '',
          'Nama: ' + nama,
          perusahaan ? 'Perusahaan: ' + perusahaan : null,
          jenis ? 'Jenis usaha: ' + jenis : null,
          wa ? 'No. WhatsApp: ' + wa : null,
          layanan.length ? 'Layanan: ' + layanan.join(', ') : null,
          pesan ? 'Pesan: ' + pesan : null
        ].filter(Boolean);

        window.open(
          'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n')),
          '_blank',
          'noopener'
        );
      });
    }

    /* ---------- newsletter form (demo only) ---------- */
    var sub = document.getElementById('subscribeForm');
    if (sub) {
      sub.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = sub.querySelector('input[type="text"]');
        var button = sub.querySelector('button');
        if (!input || !input.value) { return; }
        var original = button.textContent;
        button.textContent = 'Terima kasih!';
        input.value = '';
        setTimeout(function () { button.textContent = original; }, 2500);
      });
    }

    /* ---------- footer newsletter (demo only) ---------- */
    var footForm = document.querySelector('.subscribe-newsletters form');
    if (footForm) {
      footForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = footForm.querySelector('input');
        if (input) { input.value = ''; input.placeholder = 'Terima kasih!'; }
      });
    }
  });
})();
