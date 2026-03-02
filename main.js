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
    
    // Update all elements with data-en/data-ko
    const translatableElements = document.querySelectorAll('[data-en][data-ko]');
    translatableElements.forEach(el => {
      const text = el.getAttribute(`data-${this.currentLang}`);
      if (el.tagName === 'INPUT' && el.type === 'email') {
        el.placeholder = this.currentLang === 'en' ? 'Enter your email' : '이메일을 입력하세요';
      } else {
        el.innerHTML = text;
      }
    });

    // Update Web Components
    document.querySelectorAll('skincare-product').forEach(comp => {
      comp.setAttribute('lang', this.currentLang);
    });
  },

  updateToggleButton() {
    const btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.textContent = this.currentLang === 'en' ? 'KR' : 'EN';
    }
  }
};

// UI interactions
document.addEventListener('DOMContentLoaded', () => {
  // Language Toggle Event
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => TranslationManager.toggle());
  }

  // Intersection Observer for fade-in
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .section-title, .cta-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
  });
});
