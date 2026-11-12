/**
 * ALEGAM — Lógica interactiva estilo LinkLetter
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. SCROLL NAVBAR (Estilo LinkLetter: borde sutil al scrollear, logo firme)
  const header = document.getElementById('mainHeader');
  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 2. CONTROL ACCESIBLE DE TAMAÑO DE TIPOGRAFÍA (+50 AÑOS)
  const btnFontNormal = document.getElementById('fontNormal');
  const btnFontLarge = document.getElementById('fontLarge');
  const btnFontXLarge = document.getElementById('fontXLarge');

  function setScale(cls) {
    document.body.classList.remove('font-size-large', 'font-size-xlarge');
    if (cls) document.body.classList.add(cls);

    [btnFontNormal, btnFontLarge, btnFontXLarge].forEach(b => {
      if (b) b.classList.remove('active');
    });

    if (cls === 'font-size-large' && btnFontLarge) btnFontLarge.classList.add('active');
    else if (cls === 'font-size-xlarge' && btnFontXLarge) btnFontXLarge.classList.add('active');
    else if (btnFontNormal) btnFontNormal.classList.add('active');

    try {
      localStorage.setItem('alegam_text_scale', cls || 'normal');
    } catch (e) {}
  }

  if (btnFontNormal) btnFontNormal.addEventListener('click', () => setScale(''));
  if (btnFontLarge) btnFontLarge.addEventListener('click', () => setScale('font-size-large'));
  if (btnFontXLarge) btnFontXLarge.addEventListener('click', () => setScale('font-size-xlarge'));

  try {
    const saved = localStorage.getItem('alegam_text_scale');
    if (saved && saved !== 'normal') setScale(saved);
  } catch (e) {}

  // 3. FAQS EDITORIALES (ACORDEÓN SIMPLE Y LIMPIO)
  const faqItems = document.querySelectorAll('.faq-editorial-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(other => {
        other.classList.remove('open');
        const otherBtn = other.querySelector('.faq-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // 4. FORMULARIO DE CONSULTA CON OPCIÓN DIRECTA A WHATSAPP
  const form = document.getElementById('editorialContactForm');
  const successBox = document.getElementById('formSuccessMsg');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('inputName')?.value.trim() || '';
      const phone = document.getElementById('inputPhone')?.value.trim() || '';
      const prepaga = document.getElementById('inputPrepaga')?.value.trim() || '';
      const details = document.getElementById('inputMessage')?.value.trim() || '';

      const text = encodeURIComponent(
        `Hola Alegam! Mi nombre es ${name}. Tel: ${phone}. Prepaga/Obra Social: ${prepaga}. Consulta: ${details}`
      );

      if (successBox) {
        successBox.classList.add('show');
        successBox.innerHTML = `<strong>¡Muchas gracias por su consulta, ${name}!</strong> Nos pondremos en contacto a la brevedad. Si prefiere iniciar el chat ahora mismo, <a href="https://api.whatsapp.com/send?phone=5491164073969&text=${text}" target="_blank" style="color:var(--color-rust); font-weight:bold; text-decoration:underline;">haga clic aquí para abrir WhatsApp</a>.`;
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      form.reset();
    });
  }

  // 5. MENÚ MÓVIL
  const openMenu = document.getElementById('btnMobileMenu');
  const closeMenu = document.getElementById('btnMobileClose');
  const overlay = document.getElementById('mobileNavOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link-a');

  if (openMenu && overlay) {
    openMenu.addEventListener('click', () => {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    if (closeMenu) {
      closeMenu.addEventListener('click', () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
});
