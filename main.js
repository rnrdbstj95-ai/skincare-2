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
    const addText = lang === 'en' ? 'Add to Cart' : '장바구니 담기';
    const addedMsg = lang === 'en' ? 'has been added to your cart!' : '이(가) 장바구니에 추가되었습니다!';

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
          <button class="add-btn">${addText}</button>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.add-btn').addEventListener('click', () => {
      alert(`${name} ${addedMsg}`);
    });
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

    // Update document title
    const titleEl = document.querySelector('title');
    if (titleEl) {
      titleEl.textContent = titleEl.getAttribute(`data-${this.currentLang}`);
    }

    // Update all elements with data-en/data-ko
    const translatableElements = document.querySelectorAll('[data-en][data-ko]');
    translatableElements.forEach(el => {
      const text = el.getAttribute(`data-${this.currentLang}`);
      el.innerHTML = text;
    });

    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-en-placeholder][data-ko-placeholder]');
    placeholderElements.forEach(el => {
      el.placeholder = el.getAttribute(`data-${this.currentLang}-placeholder`);
    });

    // Update Web Components
    document.querySelectorAll('skincare-product').forEach(comp => {
      comp.setAttribute('lang', this.currentLang);
    });
  },

  updateToggleButton() {
    const btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.textContent = this.currentLang === 'en' ? '한글' : 'EN';
    }
  }
};

/**
 * Policy Content
 */
const PolicyContent = {
  privacy: {
    en: `
      <h2>Privacy Policy</h2>
      <p>Last updated: March 6, 2026</p>
      <h3>1. Information Collection</h3>
      <p>We collect information you provide directly to us, such as when you sign up for our newsletter or send a partnership proposal.</p>
      <h3>2. Use of Information</h3>
      <p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you.</p>
      <h3>3. Advertising</h3>
      <p>This site uses Google AdSense. Google uses cookies to serve ads based on your previous visits to this or other websites.</p>
    `,
    ko: `
      <h2>개인정보처리방침</h2>
      <p>최종 수정일: 2026년 3월 6일</p>
      <h3>1. 정보 수집</h3>
      <p>뉴스레터 구독 신청이나 제휴 제안 시 제공하시는 정보를 수집합니다.</p>
      <h3>2. 정보 이용</h3>
      <p>수집된 정보는 서비스 제공, 유지, 개선 및 고객 소통을 위해 사용됩니다.</p>
      <h3>3. 광고 안내</h3>
      <p>본 사이트는 Google AdSense를 이용합니다. 구글은 쿠키를 사용하여 사용자의 방문 기록을 바탕으로 맞춤형 광고를 제공합니다.</p>
    `
  },
  terms: {
    en: `
      <h2>Terms of Service</h2>
      <p>Welcome to Pure & Organic Skincare.</p>
      <h3>1. Acceptance of Terms</h3>
      <p>By accessing our website, you agree to be bound by these terms.</p>
      <h3>2. Intellectual Property</h3>
      <p>All content on this site is the property of Pure Organic Skincare.</p>
      <h3>3. Limitation of Liability</h3>
      <p>We are not liable for any damages arising from your use of this site.</p>
    `,
    ko: `
      <h2>이용약관</h2>
      <p>순수 유기농 스킨케어 방문을 환영합니다.</p>
      <h3>1. 약관 동의</h3>
      <p>본 웹사이트를 이용함으로써 귀하는 본 약관에 동의하게 됩니다.</p>
      <h3>2. 지식재산권</h3>
      <p>이 사이트의 모든 콘텐츠는 순수 유기농 스킨케어의 자산입니다.</p>
      <h3>3. 책임의 제한</h3>
      <p>본 사이트 이용으로 인해 발생하는 어떠한 손해에 대해서도 책임을 지지 않습니다.</p>
    `
  }
};

// UI interactions
document.addEventListener('DOMContentLoaded', () => {
  // Language Toggle Event
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => TranslationManager.toggle());
  }

  // Affiliate Modal
  const affiliateModal = document.getElementById('affiliate-modal');
  const affiliateLink = document.getElementById('affiliate-link');
  if (affiliateLink && affiliateModal) {
    const closeBtn = affiliateModal.querySelector('.close-button');
    affiliateLink.addEventListener('click', (e) => {
      e.preventDefault();
      affiliateModal.style.display = 'block';
    });
    closeBtn.addEventListener('click', () => affiliateModal.style.display = 'none');
  }

  // Policy Modal
  const policyModal = document.getElementById('policy-modal');
  const policyContent = document.getElementById('policy-content');
  const policyLinks = document.querySelectorAll('.policy-link');
  if (policyModal && policyContent) {
    const closeBtn = policyModal.querySelector('.close-button');
    policyLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const type = link.getAttribute('data-policy');
        policyContent.innerHTML = PolicyContent[type][TranslationManager.currentLang];
        policyModal.style.display = 'block';
      });
    });
    closeBtn.addEventListener('click', () => policyModal.style.display = 'none');
  }

  // Global Modal Close
  window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  });

  // Intersection Observer for fade-in
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .section-title, .cta-content, .about-grid').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });
});
