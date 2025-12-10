// Campus Lost & Found - main.js
// This file contains all behavior for forms and the items listing.
// It detects the current page using the body's data-page attribute.

(function () {
  const LS_KEYS = {
    LOST: 'clf_lostItems',
    FOUND: 'clf_foundItems'
  };

  // Utility: localStorage helpers -----------------------------------------
  function loadArray(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  }
  function saveArray(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr));
  }
  function showMessage(el, type, text) {
    el.textContent = text; el.className = 'form-msg show ' + (type || '');
  }

  // Enhanced Navbar with scroll effect and mobile menu ------------------
  function setupNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.links');
    
    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    });

    // Mobile menu toggle with smooth animation
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const isOpen = links.classList.contains('open');
        links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(!isOpen));
        toggle.textContent = isOpen ? '☰' : '✕';
        
        // Prevent body scroll when menu open
        document.body.style.overflow = isOpen ? '' : 'hidden';
      });

      // Close menu when clicking a link
      links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          links.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.textContent = '☰';
          document.body.style.overflow = '';
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !links.contains(e.target)) {
          links.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.textContent = '☰';
          document.body.style.overflow = '';
        }
      });
    }
  }

  // Lost Form --------------------------------------------------------------
  function initLostForm() {
    const form = document.getElementById('lostForm');
    if (!form) return;

    const msg = document.getElementById('lostFormMsg');
    const photoInput = document.getElementById('photo');
    const previewWrap = document.getElementById('photoPreviewWrap');
    const previewImg = document.getElementById('photoPreview');

    // Show image preview (purely frontend)
    photoInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) { previewWrap.hidden = true; return; }
      const reader = new FileReader();
      reader.onload = () => {
        previewImg.src = reader.result;
        previewWrap.hidden = false;
      };
      reader.readAsDataURL(file);
    });

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();

      // Add loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      // Simulate network delay for smooth UX
      setTimeout(() => {
        // Collect values
        const data = {
          itemName: document.getElementById('itemName').value.trim(),
          category: document.getElementById('category').value.trim(),
          lastSeen: document.getElementById('lastSeen').value.trim(),
          dateLost: document.getElementById('dateLost').value,
          description: document.getElementById('description').value.trim(),
          uniqueMarks: document.getElementById('uniqueMarks').value.trim(),
          contact: document.getElementById('contact').value.trim(),
          photoUrl: previewImg?.src || ''
        };

        // Simple validation
        const required = ['itemName','category','lastSeen','dateLost','description','contact'];
        const invalid = required.filter(k => !data[k]);
        if (invalid.length) {
          showMessage(msg, 'error', '⚠️ Please fill all required fields.');
          invalid.forEach(id => {
            const el = document.getElementById(id === 'itemName' ? 'itemName' : id);
            el?.classList.add('input-error');
          });
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          return;
        }

        // Save to localStorage
        const arr = loadArray(LS_KEYS.LOST);
        arr.push(data);
        saveArray(LS_KEYS.LOST, arr);

        showMessage(msg, 'success', '✓ Lost item report submitted successfully! Data stored locally in this browser.');
        form.reset();
        previewWrap.hidden = true;
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Scroll to success message
        msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 800);
    });
  }

  // Found Form -------------------------------------------------------------
  function initFoundForm() {
    const form = document.getElementById('foundForm');
    if (!form) return;
    const msg = document.getElementById('foundFormMsg');

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      
      // Add loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      setTimeout(() => {
        const data = {
          category: document.getElementById('fCategory').value.trim(),
          foundLocation: document.getElementById('foundLocation').value.trim(),
          dateFound: document.getElementById('dateFound').value,
          keptAt: document.getElementById('keptAt').value.trim(),
          contact: document.getElementById('fContact').value.trim(),
          notes: document.getElementById('notes').value.trim()
        };
        const required = ['category','foundLocation','dateFound','keptAt','contact'];
        const invalid = required.filter(k => !data[k]);
        if (invalid.length) {
          showMessage(msg, 'error', '⚠️ Please fill all required fields.');
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          return;
        }
        const arr = loadArray(LS_KEYS.FOUND);
        arr.push(data);
        saveArray(LS_KEYS.FOUND, arr);
        showMessage(msg, 'success', '✓ Found item report submitted successfully! Data stored locally in this browser.');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Scroll to success message
        msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 800);
    });
  }

  // Items Page -------------------------------------------------------------
  function renderLostCard(item){
    const div = document.createElement('div');
    div.className = 'item-card';
    const photo = item.photoUrl ? `<img src="${item.photoUrl}" alt="Photo" style="max-width:100%;border-radius:10px;margin-bottom:8px;border:1px solid rgba(0,0,0,0.06)"/>` : '';
    div.innerHTML = `
      ${photo}
      <h3 class="item-title">${escapeHtml(item.itemName)}</h3>
      <p class="meta"><span class="tag">${escapeHtml(item.category)}</span></p>
      <p><strong>Last seen:</strong> ${escapeHtml(item.lastSeen)}</p>
      <p><strong>Date lost:</strong> ${escapeHtml(item.dateLost)}</p>
      <p><strong>Description:</strong> ${escapeHtml(item.description)}</p>
      ${item.uniqueMarks ? `<p><strong>Unique marks:</strong> ${escapeHtml(item.uniqueMarks)}</p>` : ''}
      <p><strong>Contact:</strong> ${escapeHtml(item.contact)}</p>
    `;
    return div;
  }
  function renderFoundCard(item){
    const div = document.createElement('div');
    div.className = 'item-card';
    div.innerHTML = `
      <h3 class="item-title">Found: ${escapeHtml(item.category)}</h3>
      <p class="meta"><span class="tag">${escapeHtml(item.category)}</span></p>
      <p><strong>Date found:</strong> ${escapeHtml(item.dateFound)}</p>
      <p><strong>Kept at:</strong> ${escapeHtml(item.keptAt)}</p>
      <p><strong>Contact:</strong> ${escapeHtml(item.contact)}</p>
    `;
    return div;
  }
  function escapeHtml(s){
    return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
  }

  function initItemsPage(){
    const lostList = document.getElementById('lostList');
    const foundList = document.getElementById('foundList');
    if (!lostList || !foundList) return;

    // Tab switching
    document.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.querySelector(btn.dataset.target).classList.add('active');
      });
    });

    const search = document.getElementById('searchInput');
    const cat = document.getElementById('categoryFilter');

    function getCombined(){
      const lsLost = loadArray(LS_KEYS.LOST);
      const lsFound = loadArray(LS_KEYS.FOUND);
      const combinedLost = [...(window.lostItemsDemo || []), ...lsLost];
      const combinedFound = [...(window.foundItemsDemo || []), ...lsFound];
      return {combinedLost, combinedFound};
    }

    function render(){
      const {combinedLost, combinedFound} = getCombined();
      const q = (search.value || '').toLowerCase();
      const selected = (cat.value || 'all').toLowerCase();

      const lostFiltered = combinedLost.filter(x => {
        const hay = `${x.itemName} ${x.category} ${x.lastSeen} ${x.description} ${x.uniqueMarks}`.toLowerCase();
        const okQ = !q || hay.includes(q);
        const okC = selected === 'all' || (x.category || '').toLowerCase() === selected;
        return okQ && okC;
      });
      const foundFiltered = combinedFound.filter(x => {
        const hay = `${x.category} ${x.foundLocation} ${x.notes}`.toLowerCase();
        const okQ = !q || hay.includes(q);
        const okC = selected === 'all' || (x.category || '').toLowerCase() === selected;
        return okQ && okC;
      });

      lostList.innerHTML = '';
      foundList.innerHTML = '';
      
      // Add stagger animation to cards
      lostFiltered.forEach((item, idx) => {
        const card = renderLostCard(item);
        card.style.animationDelay = `${idx * 0.1}s`;
        lostList.appendChild(card);
      });
      foundFiltered.forEach((item, idx) => {
        const card = renderFoundCard(item);
        card.style.animationDelay = `${idx * 0.1}s`;
        foundList.appendChild(card);
      });

      if (!lostFiltered.length) lostList.innerHTML = '<p class="subtle">🔍 No lost items match your filters.</p>';
      if (!foundFiltered.length) foundList.innerHTML = '<p class="subtle">🔍 No found items match your filters.</p>';
    }

    search.addEventListener('input', render);
    cat.addEventListener('change', render);

    render();
  }

  // Init dispatcher --------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    setupNavbar();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Intersection Observer for card animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe all cards and steps
    setTimeout(() => {
      document.querySelectorAll('.card, .step, .item-card').forEach(el => {
        observer.observe(el);
      });
    }, 100);

    const page = document.body.dataset.page;
    if (page === 'lost') initLostForm();
    if (page === 'found') initFoundForm();
    if (page === 'items') initItemsPage();
  });
})();
