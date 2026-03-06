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
  results: {
    symptoms: []
  },

  init() {
    const quizBtns = document.querySelectorAll('.quiz-btn');
    quizBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
        const symptom = btn.getAttribute('data-en');
        if (btn.classList.contains('selected')) {
          this.results.symptoms.push(symptom);
        } else {
          this.results.symptoms = this.results.symptoms.filter(s => s !== symptom);
        }
      });
    });

    const nextBtn = document.getElementById('go-to-step-2');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.results.symptoms.length === 0) {
          alert(TranslationManager.currentLang === 'en' ? 'Please select at least one symptom.' : '하나 이상의 증상을 선택해 주세요.');
          return;
        }
        this.nextStep();
      });
    }

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
      this.generateResults();
      btn.disabled = false;
      btn.innerHTML = originalText;
      
      // Scroll to recommendations
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    }, 2000);
  },

  generateResults() {
    const isDehydratedOily = this.results.symptoms.includes('Inner skin feels tight minutes after applying oily cream') || 
                             this.results.symptoms.includes('Face feels tight, but forehead and nose get oily') ||
                             this.results.symptoms.includes('Face feels tight within 5 mins after washing');
    const isSensitive = this.results.symptoms.includes('Skin easily stings or reddens when changing cosmetics') || 
                        this.results.symptoms.includes('Skin reacts much more sensitively to heater or AC') ||
                        this.results.symptoms.includes('Face often gets hot with emotional changes');

    let diagnosisEn = '';
    let diagnosisKo = '';

    if (isDehydratedOily && isSensitive) {
      diagnosisEn = 'Diagnosis: Dehydrated Oily & Sensitive. Your skin barrier is compromised, causing inner dryness despite surface oil. Focus on Panthenol and Squalane.';
      diagnosisKo = '진단 결과: 수부지(수분 부족형 지성) 및 민감성. 피부 장벽이 약해져 겉은 번들거리지만 속은 건조한 상태입니다. 판테놀과 스쿠알란 성분에 집중하세요.';
      this.updateRecommendedProducts('dehydrated-oily-sensitive');
    } else if (isSensitive) {
      diagnosisEn = 'Diagnosis: Highly Sensitive. Your skin reacts easily to environment and products. Focus on Centella and Madecassoside.';
      diagnosisKo = '진단 결과: 초민감성. 외부 자극과 화장품에 쉽게 반응하는 상태입니다. 병풀 추출물과 마데카소사이드 성분이 필요합니다.';
      this.updateRecommendedProducts('sensitive');
    } else {
      diagnosisEn = 'Diagnosis: Combination/Dry. Your skin needs balanced hydration and oil. Focus on Hyaluronic Acid and Ceramides.';
      diagnosisKo = '진단 결과: 복합성/건성. 유수분 밸런스 조절이 필요합니다. 히알루론산과 세라마이드 성분을 추천합니다.';
      this.updateRecommendedProducts('general');
    }

    alert(TranslationManager.currentLang === 'en' ? diagnosisEn : diagnosisKo);
  },

  updateRecommendedProducts(profile) {
    const productList = document.getElementById('product-list');
    let html = '';

    if (profile === 'dehydrated-oily-sensitive') {
      html = `
        <skincare-product
          name-en="Panthenol Barrier Gel"
          name-ko="판테놀 배리어 젤"
          price="$32"
          image="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop"
          tag-en="99% Match"
          tag-ko="99% 일치"
          match="5"
        ></skincare-product>
        <skincare-product
          name-en="Squalane Hydrating Serum"
          name-ko="스쿠알란 수분 세럼"
          price="$45"
          image="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop"
          tag-en="Inner Dryness Hero"
          tag-ko="속당김 해결사"
          match="5"
        ></skincare-product>
        <skincare-product
          name-en="Low-pH Soothing Cleanser"
          name-ko="약산성 진정 클렌저"
          price="$18"
          image="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=400&auto=format&fit=crop"
          tag-en="Gentle Relief"
          tag-ko="저자극 진정"
          match="4"
        ></skincare-product>
      `;
    } else {
      // Keep existing or generic
      html = `
        <skincare-product
          name-en="Cica Recovery Cream"
          name-ko="시카 리커버리 크림"
          price="$38"
          image="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop"
          tag-en="98% Match"
          tag-ko="98% 일치"
          match="5"
        ></skincare-product>
        <skincare-product
          name-en="Ceramide Repair Serum"
          name-ko="세라마이드 리페어 세럼"
          price="$42"
          image="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop"
          tag-en="Clinically Verified"
          tag-ko="임상 검증 완료"
          match="5"
        ></skincare-product>
      `;
    }
    productList.innerHTML = html;
    // Re-apply lang to new components
    productList.querySelectorAll('skincare-product').forEach(comp => {
      comp.setAttribute('lang', TranslationManager.currentLang);
    });
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

  // Get Started buttons scroll to diagnosis
  document.querySelectorAll('.btn-primary[data-en="Get Started"], .hero-btns .btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.tagName === 'A' && btn.getAttribute('href').startsWith('#')) return;
      e.preventDefault();
      document.getElementById('diagnosis').scrollIntoView({ behavior: 'smooth' });
    });
  });

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
