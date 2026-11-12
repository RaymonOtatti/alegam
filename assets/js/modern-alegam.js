/**
 * ALEGAM - Lógica de Interacción, Accesibilidad y Liquidglass
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. HEADER SCROLL EFFECT (Mantiene el logo firme sin saltos)
  const header = document.getElementById('siteHeader');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. CONTROL DE TAMAÑO DE TEXTO (+50 ACCESIBILIDAD)
  const btnFontNormal = document.getElementById('btnFontNormal');
  const btnFontLarge = document.getElementById('btnFontLarge');
  const btnFontXLarge = document.getElementById('btnFontXLarge');

  function setFontSize(sizeClass) {
    document.body.classList.remove('text-large', 'text-xlarge');
    if (sizeClass) {
      document.body.classList.add(sizeClass);
    }
    // Update active button state
    [btnFontNormal, btnFontLarge, btnFontXLarge].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });
    if (sizeClass === 'text-large' && btnFontLarge) btnFontLarge.classList.add('active');
    else if (sizeClass === 'text-xlarge' && btnFontXLarge) btnFontXLarge.classList.add('active');
    else if (btnFontNormal) btnFontNormal.classList.add('active');

    try {
      localStorage.setItem('alegam_fontsize', sizeClass || 'normal');
    } catch (e) {}
  }

  if (btnFontNormal) btnFontNormal.addEventListener('click', () => setFontSize(''));
  if (btnFontLarge) btnFontLarge.addEventListener('click', () => setFontSize('text-large'));
  if (btnFontXLarge) btnFontXLarge.addEventListener('click', () => setFontSize('text-xlarge'));

  // Cargar preferencia previa
  try {
    const savedSize = localStorage.getItem('alegam_fontsize');
    if (savedSize && savedSize !== 'normal') {
      setFontSize(savedSize);
    }
  } catch (e) {}

  // 3. FAQ ACCORDION ACCESIBLE
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Cerrar otros para mantener la pantalla despejada y limpia
      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq-question-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // 4. FILTRO DE CASOS DE ÉXITO
  const filterPills = document.querySelectorAll('.filter-pill');
  const caseCards = document.querySelectorAll('.case-item-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterCategory = pill.getAttribute('data-filter');

      caseCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCat === filterCategory) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // 5. FORMULARIO DE CONTACTO CON ENVÍO O REDIRECCIÓN A WHATSAPP
  const contactForm = document.getElementById('alegamContactForm');
  const formSuccessNotice = document.getElementById('formSuccessNotice');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('formNombre')?.value.trim() || '';
      const telefono = document.getElementById('formTelefono')?.value.trim() || '';
      const prepaga = document.getElementById('formPrepaga')?.value.trim() || '';
      const motivo = document.getElementById('formMotivo')?.value.trim() || '';
      const consulta = document.getElementById('formConsulta')?.value.trim() || '';

      // Crear mensaje para WhatsApp
      const waText = encodeURIComponent(
        `Hola Estudio Alegam! Mi nombre es ${nombre}. Tel: ${telefono}. Mi prepaga/obra social es: ${prepaga}. Motivo: ${motivo}. Consulta: ${consulta}`
      );

      // Mostrar confirmación en pantalla
      if (formSuccessNotice) {
        formSuccessNotice.classList.add('success');
        formSuccessNotice.innerHTML = `<strong>¡Muchas gracias, ${nombre}!</strong> Su consulta ha sido registrada. También puede abrir el chat de WhatsApp directamente haciendo <a href="https://api.whatsapp.com/send?phone=5491164073969&text=${waText}" target="_blank" style="color:#15803d; text-decoration:underline; font-weight:bold;">clic aquí</a>.`;
        formSuccessNotice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      contactForm.reset();
    });
  }

  // 6. MENÚ MÓVIL
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileClose = document.getElementById('mobileDrawerClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    if (mobileClose) {
      mobileClose.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
});
