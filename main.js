/**
 * SkincareProduct Web Component
 */
class SkincareProduct extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['lang'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'lang' && oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const lang = this.getAttribute('lang') || document.body.getAttribute('data-lang') || 'en';
    const name = this.getAttribute(`name-${lang}`) || this.getAttribute('name-en') || 'Unknown Product';
    const price = this.getAttribute('price') || '$0.00';
    const image = this.getAttribute('image') || 'https://via.placeholder.com/400';
    const tag = this.getAttribute(`tag-${lang}`) || this.getAttribute('tag-en') || '';
    const match = parseInt(this.getAttribute('match')) || 5;
    
    const addText = lang === 'en' ? 'Add to Cart' : '장바구니 담기';
    const matchText = lang === 'en' ? 'Suitability' : '피부 적합도';
    
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += i < match ? '★' : '☆';
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; height: 100%; }
        .card {
          background: white; border-radius: 16px; overflow: hidden;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%; display: flex; flex-direction: column;
          position: relative; border: 1px solid oklch(95% 0.01 150);
        }
        .card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
        .image-container { position: relative; aspect-ratio: 1; overflow: hidden; }
        img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .card:hover img { transform: scale(1.1); }
        .tag {
          position: absolute; top: 12px; left: 12px;
          background: oklch(70% 0.1 150); color: white;
          padding: 4px 12px; border-radius: 20px;
          font-size: 0.75rem; font-weight: 700; z-index: 1;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .content { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; flex-grow: 1; }
        h3 { font-family: 'Playfair Display', serif; font-size: 1.25rem; margin: 0; color: oklch(25% 0.02 150); }
        .price { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; color: oklch(60% 0.12 150); font-size: 1.1rem; }
        .match-score { font-size: 0.85rem; color: var(--primary-dark); font-weight: 700; display: flex; align-items: center; gap: 5px; }
        .stars { color: #FFD700; font-size: 1.1rem; }
        .add-btn {
          margin-top: auto; background: none; border: 2px solid oklch(70% 0.1 150);
          color: oklch(60% 0.12 150); padding: 0.6rem; border-radius: 8px;
          cursor: pointer; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.3s ease;
        }
        .add-btn:hover { background: oklch(70% 0.1 150); color: white; }
      </style>
      <div class="card">
        ${tag ? `<div class="tag">${tag}</div>` : ''}
        <div class="image-container">
          <img src="${image}" alt="${name}">
        </div>
        <div class="content">
          <h3>${name}</h3>
          <div class="price">${price}</div>
          <div class="match-score">
            <span>${matchText}:</span>
            <span class="stars">${stars}</span>
          </div>
          <button class="add-btn">${addText}</button>
        </div>
      </div>
    `;
  }
}

customElements.define('skincare-product', SkincareProduct);

/**
 * Language Management
 */
const TranslationManager = {
  currentLang: 'en',

  toggle() {
    this.currentLang = this.currentLang === 'en' ? 'ko' : 'en';
    this.applyTranslations();
    this.updateToggleButton();
  },

  applyTranslations() {
    document.body.setAttribute('data-lang', this.currentLang);
    const titleEl = document.querySelector('title');
    if (titleEl) titleEl.textContent = titleEl.getAttribute(`data-${this.currentLang}`);
    
    document.querySelectorAll('[data-en][data-ko]').forEach(el => {
      el.innerHTML = el.getAttribute(`data-${this.currentLang}`);
    });

    document.querySelectorAll('[data-en-placeholder][data-ko-placeholder]').forEach(el => {
      el.placeholder = el.getAttribute(`data-${this.currentLang}-placeholder`);
    });

    document.querySelectorAll('skincare-product').forEach(comp => {
      comp.setAttribute('lang', this.currentLang);
    });
  },

  updateToggleButton() {
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = this.currentLang === 'en' ? '한글' : 'EN';
  }
};

/**
 * Diagnosis System Logic
 */
const DiagnosisSystem = {
  step: 1,
  results: {},

  init() {
    const quizBtns = document.querySelectorAll('.quiz-btn');
    quizBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.results.symptom = btn.textContent;
        this.nextStep();
      });
    });

    const analyzeBtn = document.querySelector('#diag-step-2 .btn-primary');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => this.runAnalysis());
    }
  },

  nextStep() {
    document.getElementById(`diag-step-${this.step}`).classList.remove('active');
    this.step++;
    document.getElementById(`diag-step-${this.step}`).classList.add('active');
  },

  runAnalysis() {
    const btn = document.querySelector('#diag-step-2 .btn-primary');
    const originalText = btn.innerHTML;
    
    // Simulate AI Analysis
    btn.disabled = true;
    btn.innerHTML = TranslationManager.currentLang === 'en' ? 'Analyzing with AI...' : 'AI 분석 중...';
    
    setTimeout(() => {
      alert(TranslationManager.currentLang === 'en' 
        ? 'Analysis Complete! Based on your Heat & Redness symptoms, we recommend soothing recovery agents.' 
        : '분석 완료! 열감 및 붉은 기 증상을 바탕으로 진정 회복 솔루션을 추천합니다.');
      
      btn.disabled = false;
      btn.innerHTML = originalText;
      
      // Scroll to recommendations
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    }, 2000);
  }
};

/**
 * Policy Content
 */
const PolicyContent = {
  privacy: {
    en: `<h2>Privacy Policy</h2><p>We collect skin diagnosis data to provide personalized recommendations. Your photos are analyzed locally and not stored without consent.</p>`,
    ko: `<h2>개인정보처리방침</h2><p>개인 맞춤형 추천을 위해 피부 진단 데이터를 수집합니다. 사진은 로컬에서 분석되며 동의 없이 저장되지 않습니다.</p>`
  },
  terms: {
    en: `<h2>Terms of Service</h2><p>Our AI diagnosis is for information only and not a medical substitute.</p>`,
    ko: `<h2>이용약관</h2><p>AI 진단 결과는 정보 제공용이며 의료적 진단을 대체할 수 없습니다.</p>`
  }
};

// UI interactions
document.addEventListener('DOMContentLoaded', () => {
  TranslationManager.applyTranslations();
  DiagnosisSystem.init();

  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) langBtn.addEventListener('click', () => TranslationManager.toggle());

  // Modal logic (Affiliate & Policy)
  const modals = ['affiliate-modal', 'policy-modal'];
  modals.forEach(id => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.querySelector('.close-button').addEventListener('click', () => modal.style.display = 'none');
  });

  document.getElementById('affiliate-link').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('affiliate-modal').style.display = 'block';
  });

  document.querySelectorAll('.policy-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const type = link.getAttribute('data-policy');
      const modal = document.getElementById('policy-modal');
      document.getElementById('policy-content').innerHTML = PolicyContent[type][TranslationManager.currentLang];
      modal.style.display = 'block';
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) e.target.style.display = 'none';
  });

  // Fade-in animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .section-title, .cta-content, .about-grid, .diagnosis-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });
});
