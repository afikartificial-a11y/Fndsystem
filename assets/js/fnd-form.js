/* =========================================================
   FnD System — Interactive Features & WhatsApp Form Generator (v2.0)
   Handles Form submissions, Article Modals, Client Filters,
   and Mobile Navigation enhancements.
   ========================================================= */

(function () {
  'use strict';

  var WHATSAPP = '6285121951022';
  var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxL3_CwIhsGOSSLqMIZRvCnIOFNmMTn7ztnO9bxKq-Lh1KTTx84a1p5TryfEOyc7_vAZA/exec';

  /* ---------- Preloader Safety ---------- */
  function hidePreloader() {
    var pre = document.getElementById('js-preloader');
    if (pre) {
      pre.classList.add('loaded');
      setTimeout(function () {
        pre.style.display = 'none';
      }, 500);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(hidePreloader, 1000);
  });
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 4000);

  document.addEventListener('DOMContentLoaded', function () {
    /* ---------- Dynamic Copyright Year ---------- */
    var yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    /* ---------- Hero Banner Cross-Fade Sync ---------- */
    var layers = document.querySelectorAll('.main-banner .hero-photo');
    var slides = document.querySelectorAll('.main-banner .owl-item:not(.cloned) .item[data-photo]');
    var mobileHeroImg = document.getElementById('mobileHeroImg');
    
    if (layers.length === 2 && slides.length > 0) {
      var photos = Array.prototype.map.call(slides, function (el) {
        return el.getAttribute('data-photo');
      });
      var front = 0;

      function showHeroPhoto(index) {
        if (!photos.length) return;
        var i = ((index % photos.length) + photos.length) % photos.length;
        var src = photos[i];
        if (!src) return;
        
        // Desktop hero layer cross-fade
        var back = 1 - front;
        layers[back].style.backgroundImage = 'url("' + src + '")';
        layers[back].classList.add('is-visible');
        layers[front].classList.remove('is-visible');
        front = back;

        // Mobile visual card sync
        if (mobileHeroImg) {
          mobileHeroImg.src = src;
        }
      }

      if (window.jQuery && $('.owl-banner').length) {
        var bannerOwl = $('.owl-banner');
        bannerOwl.on('changed.owl.carousel', function (e) {
          var current = e.item.index;
          // Calculate active index accounting for clones
          var count = e.item.count;
          var realIndex = (current - e.relatedTarget._clones.length / 2) % count;
          if (realIndex < 0) realIndex = count + realIndex;
          showHeroPhoto(realIndex);
        });

        var dots = document.querySelectorAll('.owl-banner .owl-dot');
        Array.prototype.forEach.call(dots, function (dot, index) {
          dot.addEventListener('click', function () {
            showHeroPhoto(index);
          });
        });
        setTimeout(function () { showHeroPhoto(0); }, 300);
      }
    }

    /* ---------- Mobile Menu Auto-Close on Anchor Click ---------- */
    if (window.jQuery) {
      $('.header-area .main-nav .nav li a').on('click', function () {
        if ($(window).width() < 992) {
          $('.menu-trigger').removeClass('active');
          $('.header-area .nav').slideUp(200);
        }
      });
    }

    /* ---------- Interactive Service Checkbox Chips in Form ---------- */
    var checkChips = document.querySelectorAll('.check-chip');
    checkChips.forEach(function (chip) {
      var input = chip.querySelector('input[type="checkbox"]');
      if (!input) return;

      function syncChipState() {
        if (input.checked) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      }

      input.addEventListener('change', syncChipState);
      syncChipState();
    });

    /* ---------- Interactive Client Filter Tabs ---------- */
    var filterBtns = document.querySelectorAll('.client-filter-btn');
    var clientItems = document.querySelectorAll('.client-tag-item');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.getAttribute('data-filter');
        clientItems.forEach(function (item) {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'inline-flex';
            item.style.opacity = '1';
          } else {
            item.style.display = 'none';
            item.style.opacity = '0';
          }
        });
      });
    });

    /* ---------- WhatsApp Consultation Form Submission ---------- */
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
          var nameInput = document.getElementById('name');
          if (nameInput) nameInput.focus();
          return;
        }

        var lines = [
          'Halo Tim FnD System, saya ingin mengajukan konsultasi regulasi.',
          '----------------------------------------',
          '• Nama: ' + nama,
          perusahaan ? '• Perusahaan/UMKM: ' + perusahaan : null,
          jenis ? '• Jenis Usaha: ' + jenis : null,
          wa ? '• No. WhatsApp: ' + wa : null,
          layanan.length ? '• Layanan Dibutuhkan: ' + layanan.join(', ') : null,
          pesan ? '• Kebutuhan / Pertanyaan:\n' + pesan : null,
          '----------------------------------------',
          'Mohon informasi alur pendampingan dan jadwal konsultasi awal. Terima kasih!'
        ].filter(Boolean);

        var waUrl = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n'));
        var submitBtn = contact.querySelector('button[type="submit"]');
        var originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Menyimpan Data...';
        }

        var isFinished = false;
        function finishSubmission() {
          if (isFinished) return;
          isFinished = true;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
          }
          window.open(waUrl, '_blank', 'noopener');
        }

        if (GOOGLE_SCRIPT_URL) {
          var payload = {
            nama: nama,
            perusahaan: perusahaan,
            jenis: jenis,
            whatsapp: wa,
            layanan: layanan.join(', '),
            pesan: pesan
          };

          fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
          }).then(function () {
            finishSubmission();
          }).catch(function (err) {
            console.error('GSheet error:', err);
            finishSubmission();
          });

          // Fallback timeout: buka WhatsApp dalam 2,5 detik jika jaringan lambat
          setTimeout(function () {
            finishSubmission();
          }, 2500);
        } else {
          finishSubmission();
        }
      });
    }

    /* ---------- Newsletter Forms ---------- */
    var subForm = document.getElementById('subscribeForm');
    if (subForm) {
      subForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var emailInput = subForm.querySelector('input[type="text"]');
        var btn = subForm.querySelector('button');
        if (!emailInput || !emailInput.value) return;
        
        var originalText = btn.textContent;
        btn.textContent = '✓ Terdaftar!';
        btn.style.background = '#10b981';
        emailInput.value = '';
        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 3000);
      });
    }

    var footerForm = document.querySelector('.subscribe-newsletters form');
    if (footerForm) {
      footerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = footerForm.querySelector('input');
        if (input) {
          input.value = '';
          input.placeholder = '✓ Berhasil berlangganan!';
          setTimeout(function () {
            input.placeholder = 'Email Anda';
          }, 3000);
        }
      });
    }
  });
})();
