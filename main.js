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
 * Diagnosis System Data
 */
const DiagnosisData = {
  categories: {
    type: {
      en: "Basic Skin Type",
      ko: "기본 피부 타입",
      questions: [
        { id: "t1", en: "Face feels extremely tight 10 mins after morning wash with no products", ko: "아침 세안 후 아무것도 안 바르고 10분 있으면 얼굴이 찢어질 듯 당긴다.", weights: { dry: 3 } },
        { id: "t2", en: "Nose and forehead get so oily by afternoon that oil paper becomes transparent", ko: "오후만 되면 코와 이마가 번들거려서 기름종이가 투명해진다.", weights: { oily: 3 } },
        { id: "t3", en: "Cheeks are dry and parched, but T-zone has excess sebum", ko: "볼 쪽은 건조해서 푸석한데, T존(이마, 코)은 피지가 넘쳐난다.", weights: { combination: 3, dry: 1, oily: 1 } },
        { id: "t4", en: "Pores are visibly large and filled with sebum", ko: "모공 크기가 눈에 띄게 크고, 피지가 꽉 차 있는 게 육안으로 보인다.", weights: { oily: 2 } },
        { id: "t5", en: "Skin is thin and gets red easily after washing", ko: "피부가 얇아서 세수하고 나면 얼굴이 금방 붉어진다.", weights: { sensitive: 2 } },
        { id: "t6", en: "Oily creams feel like they sit on the surface without absorbing", ko: "유분이 많은 크림을 바르면 흡수되지 않고 겉도는 느낌이 강하다.", weights: { oily: 2, dehydrated: 2 } },
        { id: "t7", en: "Fine lines around eyes/mouth become more visible as the day goes on", ko: "세안 직후에는 괜찮은데, 시간이 지날수록 입가나 눈가 주름이 도드라져 보인다.", weights: { dry: 2 } }
      ]
    },
    sensitivity: {
      en: "Sensitivity & Barrier",
      ko: "민감성 및 피부 체력",
      questions: [
        { id: "s1", en: "Skin shows signs (breakouts, redness) first when condition is poor", ko: "컨디션이 안 좋으면 피부에 제일 먼저 신호(트러블, 붉은 기)가 온다.", weights: { sensitive: 2, barrier: -1 } },
        { id: "s2", en: "Changing cosmetics often causes stinging or itching", ko: "화장품을 바꾸면 피부가 화끈거리거나 가려운 적이 잦다.", weights: { sensitive: 3 } },
        { id: "s3", en: "Skin stings on days with fine dust or during season changes", ko: "환절기나 미세먼지가 심한 날에는 피부가 따갑다.", weights: { sensitive: 2, barrier: -2 } },
        { id: "s4", en: "Cheeks flush quickly after drinking alcohol or eating hot food", ko: "술을 마시거나 뜨거운 음식을 먹으면 볼이 금방 빨갛게 달아오른다.", weights: { sensitive: 2 } },
        { id: "s5", en: "Physical scrubs or exfoliators cause skin flare-ups", ko: "물리적인 각질 제거제(스크럽)를 쓰면 피부가 뒤집어진다.", weights: { sensitive: 3, barrier: -2 } },
        { id: "s6", en: "Itching occurs specifically where masks or hair touch the skin", ko: "마스크나 머리카락이 닿는 부위에만 유독 가려움을 느낀다.", weights: { sensitive: 2 } },
        { id: "s7", en: "Face gets red just from the friction of hands during washing", ko: "세안 시 손바닥으로 문지르는 자극만으로도 얼굴이 붉어진다.", weights: { sensitive: 3, barrier: -3 } }
      ]
    },
    makeup: {
      en: "Makeup & Lifestyle",
      ko: "메이크업 및 라이프스타일",
      questions: [
        { id: "m1", en: "Makeup gets cakey around the nose but dry/flaky around the mouth", ko: "화장을 하면 코 주변은 무너지고, 입가는 각질 때문에 하얗게 뜬다.", weights: { dehydrated: 3, oily: 1 } },
        { id: "m2", en: "Skin looks dull even with foundation; makeup doesn't 'stick'", ko: "파운데이션을 발라도 피부가 푸석해 보여서 화장이 먹지 않는다.", weights: { dry: 2, dehydrated: 2 } },
        { id: "m3", en: "Skin tone becomes noticeably dark/grayish by 3 PM (darkening)", ko: "오후 3시쯤 되면 얼굴 안색이 칙칙해지는 '다크닝' 현상이 심하다.", weights: { oily: 2, oxidation: 2 } },
        { id: "m4", en: "Foundation or eyeshadow settles into fine lines around eyes", ko: "아이섀도우나 파운데이션이 눈가 주름 사이에 껴서 스트레스를 받는다.", weights: { dry: 3 } },
        { id: "m5", en: "Skin looks oily on the outside but feels like it's cracking inside", ko: "겉은 번들거려 보이는데 정작 본인은 속이 쩍쩍 갈라지는 느낌을 받는다.", weights: { dehydrated: 4, oily: 1 } },
        { id: "m6", en: "Skin texture looks bumpy like an orange peel in the mirror", ko: "세안 후 거울을 보면 피부 결이 귤껍질처럼 요철이 심해 보인다.", weights: { oily: 2, pores: 2 } },
        { id: "m7", en: "Skin feels thirsty inside even after applying multiple products", ko: "화장품을 발라도 겉만 번들거리고 속은 여전히 목마른 느낌이다.", weights: { dehydrated: 3, dry: 1 } }
      ]
    }
  }
};

/**
 * Diagnosis System Engine (Checklist UX)
 */
const DiagnosisSystem = {
  currentCategory: null,
  selectedAnswers: new Set(),
  scores: {
    dry: 0, oily: 0, combination: 0, dehydrated: 0, sensitive: 0, barrier: 0
  },

  init() {
    // Attach listeners to hero buttons
    document.querySelectorAll('.btn-diag').forEach(btn => {
      btn.addEventListener('click', () => {
        this.startDiagnosis(btn.getAttribute('data-type'));
      });
    });

    // Replace Control buttons with a single "Analyze" button
    const controls = document.getElementById('diag-controls');
    controls.innerHTML = `
      <button class="btn btn-primary" id="analyze-btn" style="width: 100%; padding: 1.5rem; font-size: 1.2rem;" data-en="Analyze My Skin" data-ko="분석 결과 보기">Analyze My Skin</button>
    `;
    
    document.getElementById('analyze-btn').addEventListener('click', () => this.runAnalysis());
  },

  startDiagnosis(category) {
    this.currentCategory = category;
    this.selectedAnswers.clear();
    this.resetScores();

    document.getElementById('diag-progress-container').style.display = 'none';
    document.getElementById('diag-controls').style.display = 'block';
    document.getElementById('diagnosis').scrollIntoView({ behavior: 'smooth' });
    
    this.renderChecklist();
  },

  resetScores() {
    Object.keys(this.scores).forEach(k => this.scores[k] = 0);
  },

  renderChecklist() {
    const questions = DiagnosisData.categories[this.currentCategory].questions;
    const content = document.getElementById('diag-step-content');
    const lang = TranslationManager.currentLang;

    let questionsHtml = questions.map(q => `
      <button class="quiz-btn ${this.selectedAnswers.has(q.id) ? 'selected' : ''}" 
              onclick="DiagnosisSystem.toggleCheck('${q.id}')"
              style="margin-bottom: 0.8rem; width: 100%;">
        ${q[lang]}
      </button>
    `).join('');

    content.innerHTML = `
      <div class="question-header" style="text-align: center;">
        <span class="category-tag">${DiagnosisData.categories[this.currentCategory][lang]}</span>
        <h3 style="margin-top: 1rem; margin-bottom: 2rem;" data-en="Check everything that applies to you" data-ko="해당하는 항목을 모두 선택해 주세요">Check everything that applies to you</h3>
      </div>
      <div class="quiz-options multiselect">
        ${questionsHtml}
      </div>
    `;
  },

  toggleCheck(id) {
    if (this.selectedAnswers.has(id)) {
      this.selectedAnswers.delete(id);
    } else {
      this.selectedAnswers.add(id);
    }
    // Efficiently update only the button class
    this.renderChecklist();
  },

  runAnalysis() {
    if (this.selectedAnswers.size === 0) {
      alert(TranslationManager.currentLang === 'en' ? "Please select at least one symptom." : "하나 이상의 증상을 선택해 주세요.");
      return;
    }

    document.getElementById('diag-card').style.display = 'none';
    document.getElementById('diag-loading').style.display = 'block';
    
    // Calculate weights
    const questions = DiagnosisData.categories[this.currentCategory].questions;
    questions.forEach(q => {
      if (this.selectedAnswers.has(q.id)) {
        Object.entries(q.weights).forEach(([key, val]) => {
          this.scores[key] += val;
        });
      }
    });

    setTimeout(() => {
      this.showResults();
    }, 2000);
  },

  showResults() {
    document.getElementById('diag-loading').style.display = 'none';
    document.getElementById('diag-card').style.display = 'block';
    document.getElementById('diag-controls').style.display = 'none';

    // Determine Profile
    let profile = 'general';
    if (this.scores.dehydrated >= 3 && this.scores.oily >= 2) profile = 'dehydrated-oily-sensitive';
    else if (this.scores.sensitive >= 4) profile = 'sensitive';
    else if (this.scores.dry >= 4) profile = 'dry';
    else if (this.scores.oily >= 4) profile = 'oily';

    const lang = TranslationManager.currentLang;
    const content = document.getElementById('diag-step-content');

    const resultText = {
      'dehydrated-oily-sensitive': {
        en: "Result: Dehydrated Oily. Your skin lacks water but overproduces oil to compensate. Focus on barrier repair and lightweight hydration.",
        ko: "진단 결과: 수부지 (수분 부족형 지성). 속은 건조하지만 겉은 번들거리는 상태입니다. 장벽 강화와 수분 위주의 관리가 필요합니다."
      },
      'sensitive': {
        en: "Result: Highly Sensitive. Your skin barrier is thin and reacts to external triggers. Use soothing, minimal ingredient products.",
        ko: "진단 결과: 민감성. 피부 장벽이 얇고 외부 자극에 민감합니다. 진정 성분 위주의 저자극 관리가 필수입니다."
      },
      'dry': {
        en: "Result: Dry. Your skin lacks both oil and moisture. Rich ceramides and oils are recommended.",
        ko: "진단 결과: 건성. 유수분이 모두 부족한 상태입니다. 세라마이드와 페이셜 오일로 보습막을 씌워주세요."
      },
      'oily': {
        en: "Result: Oily. Excess sebum production. Use BHA and lightweight gel moisturizers.",
        ko: "진단 결과: 지성. 피지 분비가 왕성한 상태입니다. 산뜻한 젤 타입 수분크림과 모공 관리가 필요합니다."
      },
      'general': {
        en: "Result: Normal/Combination. Your skin is relatively balanced but needs preventative care.",
        ko: "진단 결과: 중복합성. 비교적 균형 잡힌 상태이나 계절에 따른 유수분 밸런스 조절이 필요합니다."
      }
    };

    content.innerHTML = `
      <div class="result-card">
        <div class="result-icon">✨</div>
        <h3>${resultText[profile][lang]}</h3>
        <p>${lang === 'en' ? "We've updated your recommendations below." : "아래에 당신을 위한 맞춤 제품을 준비했습니다."}</p>
        <button class="btn btn-primary" onclick="window.location.reload()" style="margin-top: 1rem;">
          ${lang === 'en' ? "Restart Test" : "다시 테스트하기"}
        </button>
      </div>
    `;

    this.updateRecommendedProducts(profile);
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  },

  updateRecommendedProducts(profile) {
    const productList = document.getElementById('product-list');
    let html = '';

    if (profile === 'dehydrated-oily-sensitive' || profile === 'sensitive') {
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
    } else if (profile === 'dry') {
      html = `
        <skincare-product
          name-en="Ceramide Intensive Cream"
          name-ko="세라마이드 고보습 크림"
          price="$48"
          image="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop"
          tag-en="Dry Skin Must-Have"
          tag-ko="악건성 필수템"
          match="5"
        ></skincare-product>
        <skincare-product
          name-en="Vitality Facial Oil"
          name-ko="바이탈리티 페이셜 오일"
          price="$52"
          image="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop"
          tag-en="Deep Nourishment"
          tag-ko="영양 공급"
          match="5"
        ></skincare-product>
      `;
    } else {
      html = `
        <skincare-product
          name-en="Cica Recovery Cream"
          name-ko="시카 리커버리 크림"
          price="$38"
          image="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop"
          tag-en="All Skin Types"
          tag-ko="모든 피부용"
          match="5"
        ></skincare-product>
        <skincare-product
          name-en="Soothing Barrier Mist"
          name-ko="수딩 배리어 미스트"
          price="$24"
          image="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=400&auto=format&fit=crop"
          tag-en="Bestseller"
          tag-ko="베스트셀러"
          match="4"
        ></skincare-product>
      `;
    }
    
    productList.innerHTML = html;
    productList.querySelectorAll('skincare-product').forEach(comp => {
      comp.setAttribute('lang', TranslationManager.currentLang);
    });
  }
};

// Global export for onclick handlers
window.DiagnosisSystem = DiagnosisSystem;

/**
 * UI Interactions
 */
document.addEventListener('DOMContentLoaded', () => {
  TranslationManager.applyTranslations();
  DiagnosisSystem.init();

  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) langBtn.addEventListener('click', () => TranslationManager.toggle());

  // Modal logic
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
      const PolicyContent = {
        privacy: {
          en: `<h2>Privacy Policy</h2><p>We analyze skin data locally to provide routine recommendations.</p>`,
          ko: `<h2>개인정보처리방침</h2><p>피부 데이터는 로컬에서 분석되어 추천용으로만 사용됩니다.</p>`
        },
        terms: {
          en: `<h2>Terms</h2><p>AI diagnosis is not medical advice.</p>`,
          ko: `<h2>이용약관</h2><p>AI 진단은 의료적 조언을 대신할 수 없습니다.</p>`
        }
      };
      document.getElementById('policy-content').innerHTML = PolicyContent[type][TranslationManager.currentLang];
      modal.style.display = 'block';
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) e.target.style.display = 'none';
  });

  // Fade-in
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
