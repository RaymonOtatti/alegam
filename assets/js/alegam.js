/**
 * ALEGAM - Lógica de Interacción Frontend
 * Inspirado en las interacciones y animaciones de Dropshot (Scroll Reveal, Glass Navbar & Mobile Drawer)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dropshot Scroll Reveal (Componente Sr de Dropshot)
  const reduceMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.ds-reveal:not(.ds-case-post)');

  if ('IntersectionObserver' in window && !reduceMotion && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Aplicar reveal con un sutil escalonamiento si hay varios elementos
            setTimeout(() => {
              entry.target.classList.add('is-revealed');
              entry.target.classList.remove('js-reveal-pending');
            }, 60);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => {
      el.classList.add('js-reveal-pending');
      revealObserver.observe(el);
    });
  } else {
    // Fallback inmediato si no hay IntersectionObserver
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  // Animar solo contenido, sin transformar ni alterar las fotografías.
  if ('IntersectionObserver' in window && !reduceMotion) {
    const scrollItems = document.querySelectorAll([
      '.home-intro-copy', '.services-heading', '.service-item', '.process-heading > *',
      '.process-step', '.cases-overview-heading', '.cases-overview-list article',
      '.ds-team-info', '.faq-intro', '.faq-entry', '.contact-heading', '.contact-details',
      '.contact-form-panel', '.ds-footer-col h4', '.ds-footer-desc', '.ds-footer-links li',
      '.ds-footer-contact-list li', '.ds-footer-bottom > div', '.ds-case-tools-label',
      '.ds-case-filters', '.ds-case-post .ds-case-tag', '.ds-case-post .ds-case-title',
      '.ds-case-post .ds-case-body', '.ds-case-next-step-inner > *'
    ].join(', '));
    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -24px 0px' });
    scrollItems.forEach((item) => {
      item.classList.add('js-scroll-reveal');
      scrollObserver.observe(item);
    });
  }

  // 2. Header Glass Scroll Effect (Exacto al Zb de Dropshot: scrollY > 20)
  const header = document.querySelector('.ds-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 3. Menú Móvil / Drawer Accesible
  const menuToggle = document.querySelector('.ds-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.querySelector('.ds-mobile-drawer-backdrop');
  const closeBtn = document.querySelector('.ds-mobile-drawer-close');
  const navLinks = document.querySelectorAll('.ds-mobile-nav-links a');

  function openMenu() {
    if (!drawer || !backdrop || !menuToggle) return;
    drawer.inert = false;
    drawer.setAttribute('aria-hidden', 'false');
    drawer.classList.add('is-active');
    backdrop.classList.add('is-active');
    document.body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Cerrar menú');
    if (closeBtn) closeBtn.focus();
  }

  function closeMenu(restoreFocus = true) {
    if (!drawer || !backdrop || !menuToggle) return;
    const wasOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    drawer.classList.remove('is-active');
    backdrop.classList.remove('is-active');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    drawer.inert = true;
    drawer.setAttribute('aria-hidden', 'true');
    if (wasOpen && restoreFocus) menuToggle.focus();
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeMenu());
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => closeMenu());
  }

  navLinks.forEach((link) => {
    // Para enlaces hacia otras páginas, cerrar el menú antes de navegar.
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#')) {
        window.requestAnimationFrame(() => closeMenu(false));
      }
    });
  });

  // Mostrar los fallos sobre la portada, sin perder la ubicación de lectura.
  const casesDialog = document.getElementById('cases-dialog');
  if (casesDialog && typeof casesDialog.showModal === 'function') {
    const openers = document.querySelectorAll('.js-cases-open');
    const closeCases = casesDialog.querySelector('.cases-dialog-close');
    const content = casesDialog.querySelector('.cases-dialog-content');
    const status = casesDialog.querySelector('#cases-dialog-status');
    const filters = Array.from(casesDialog.querySelectorAll('.ds-case-filter'));
    const cards = Array.from(casesDialog.querySelectorAll('.ds-case-post'));
    let opener = null;

    const showCases = (filter, target = '') => {
      let visible = 0;
      cards.forEach((card) => {
        const show = target ? card.dataset.caseId === target : filter === 'all' || card.dataset.category === filter;
        card.hidden = !show;
        if (show) visible += 1;
      });
      filters.forEach((button) => {
        const active = !target && button.dataset.filter === filter;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      status.textContent = target
        ? 'Se muestra esta resolución. Elegí un tema para ver más casos.'
        : `Se muestran ${visible} ${visible === 1 ? 'resolución' : 'resoluciones'}.`;
      content.scrollTop = 0;
    };

    openers.forEach((link) => link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      showCases('all', link.dataset.caseTarget || '');
      if (!casesDialog.open) casesDialog.showModal();
      document.body.classList.add('cases-dialog-open');
      closeCases.focus();
    }));
    filters.forEach((button) => button.addEventListener('click', () => showCases(button.dataset.filter)));
    closeCases.addEventListener('click', () => casesDialog.close());
    casesDialog.addEventListener('click', (event) => {
      if (event.target === casesDialog) casesDialog.close();
    });
    casesDialog.addEventListener('close', () => {
      document.body.classList.remove('cases-dialog-open');
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    });
  }

  // Marcar la sección visible en ambos menús de la portada.
  if (document.getElementById('inicio')) {
    const sectionIds = ['inicio', 'servicios', 'proceso', 'casos', 'estudio', 'preguntas', 'contacto'];
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    const sectionLinks = document.querySelectorAll('.ds-header .ds-brand[href="#inicio"], .ds-nav-center a[href^="#"], .ds-mobile-nav-links a[href^="#"]');
    let scrollUpdatePending = false;

    const updateCurrentSection = () => {
      const marker = (header?.offsetHeight || 0) + 32;
      let current = sections[0]?.id;
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1]?.id;
      }
      sectionLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${current}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      scrollUpdatePending = false;
    };
    const scheduleCurrentSection = () => {
      if (!scrollUpdatePending) {
        scrollUpdatePending = true;
        window.requestAnimationFrame(updateCurrentSection);
      }
    };
    window.addEventListener('scroll', scheduleCurrentSection, { passive: true });
    window.addEventListener('resize', scheduleCurrentSection);
    window.addEventListener('hashchange', scheduleCurrentSection);
    updateCurrentSection();
  }

  // Desplazamiento suave (smooth sliding) al clickear en los enlaces del menú y secciones internas
  const inPageNavLinks = document.querySelectorAll(
    'a[href^="#"]:not([href="#"]):not(.skip-link):not(.js-cases-open):not([data-case-target])'
  );

  const getHeaderHeight = () => {
    const headerEl = document.querySelector('.ds-header');
    return headerEl ? headerEl.offsetHeight : 72;
  };

  const smoothScrollToTarget = (target, hash, isKeyboard = false) => {
    const isTop = hash === '#inicio' || !target.parentElement;
    const headerHeight = getHeaderHeight();
    const targetTop = isTop ? 0 : Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - headerHeight);

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth'
    });

    try {
      if (window.location.hash !== hash) {
        window.history.pushState(null, '', hash);
      }
    } catch (_) { /* El desplazamiento sigue disponible en archivos locales. */ }

    if (isKeyboard) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  };

  inPageNavLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;

      event.preventDefault();
      const isKeyboard = event.detail === 0;

      if (drawer && drawer.classList.contains('is-active')) {
        closeMenu(false);
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            smoothScrollToTarget(target, hash, isKeyboard);
          });
        });
      } else {
        smoothScrollToTarget(target, hash, isKeyboard);
      }
    });
  });

  // Si se ingresa con un hash en la URL (por ej. desde logros-casos-exito.html), deslizar suavemente a la sección
  if (window.location.hash && window.location.hash.length > 1) {
    const initialTarget = document.getElementById(window.location.hash.slice(1));
    if (initialTarget) {
      setTimeout(() => {
        smoothScrollToTarget(initialTarget, window.location.hash, false);
      }, 120);
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // 4. Formulario de Contacto Seguro (Validación rigurosa, Prevención de Data Leaks y Derivación a WhatsApp)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const fieldset = document.getElementById('contactFields');
    const fields = {
      name: document.getElementById('formName'),
      phone: document.getElementById('formPhone'),
      email: document.getElementById('formEmail'),
      message: document.getElementById('formMessage'),
      website: document.getElementById('formWebsite') // Honeypot antispam
    };
    const errors = {
      name: document.getElementById('formNameError'),
      phone: document.getElementById('formPhoneError'),
      email: document.getElementById('formEmailError'),
      message: document.getElementById('formMessageError')
    };
    const status = document.getElementById('contactStatus');
    const submitBtn = document.getElementById('contactSubmitBtn');

    // Habilitar el fieldset si estaba deshabilitado
    if (fieldset) fieldset.disabled = false;

    // Si falta algún campo esencial de error o input, no interrumpir la navegación básica
    if (!status || !fields.name || !fields.message || !errors.name || !errors.message) return;

    const setError = (key, message) => {
      if (errors[key]) {
        errors[key].textContent = message;
      }
      if (fields[key]) {
        if (message) {
          fields[key].setAttribute('aria-invalid', 'true');
        } else {
          fields[key].removeAttribute('aria-invalid');
        }
      }
    };

    // Limpieza de errores en tiempo real al escribir
    ['name', 'phone', 'email', 'message'].forEach((key) => {
      if (fields[key]) {
        fields[key].addEventListener('input', () => {
          setError(key, '');
          if (status) status.replaceChildren();
        });
      }
    });

    // Sanitizador contra caracteres de control e inyecciones
    const cleanText = (val) => {
      return (val || '')
        .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, '')
        .trim();
    };

    // Filtro básico anti etiquetas HTML
    const stripTags = (val) => val.replace(/[<>]/g, '');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // 1. Detección de Bots (Honeypot Anti-Spam / Anti-Scraping)
      if (fields.website && fields.website.value.trim() !== '') {
        // Bot detectado: trampa activada. Silenciar sin procesar ni enviar nada.
        contactForm.reset();
        status.textContent = 'Mensaje recibido correctamente. Gracias por contactarnos.';
        return;
      }

      // 2. Extracción y Normalización de Datos
      const rawName = cleanText(fields.name.value).replace(/\s+/g, ' ');
      const rawPhone = cleanText(fields.phone ? fields.phone.value : '');
      const rawEmail = cleanText(fields.email ? fields.email.value : '');
      const rawMessage = cleanText(fields.message.value);

      const digits = rawPhone.replace(/\D/g, '');

      // 3. Validaciones Rigurosas ("evitar datos erróneos")
      const messages = {};

      // Validación de Nombre y Apellido
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'.-]{2,80}$/;
      const nameHasLetters = /[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]{2,}/;
      if (!rawName) {
        messages.name = 'Por favor ingresá tu nombre y apellido.';
      } else if (rawName.length < 2) {
        messages.name = 'El nombre debe tener al menos 2 caracteres.';
      } else if (rawName.length > 80) {
        messages.name = 'El nombre no puede tener más de 80 caracteres.';
      } else if (!nameRegex.test(rawName) || !nameHasLetters.test(rawName)) {
        messages.name = 'Ingresá un nombre y apellido válido (solo letras y espacios).';
      } else {
        messages.name = '';
      }

      // Validación de Teléfono (opcional, pero si se coloca debe ser verídico)
      if (rawPhone) {
        const isRepeating = /^(\d)\1+$/.test(digits);
        const isSequence = /^(01234567|12345678|123456789|98765432|87654321)/.test(digits);
        if (rawPhone.length > 25 || !/^[\d\s().+-]+$/.test(rawPhone)) {
          messages.phone = 'El teléfono contiene caracteres no válidos.';
        } else if (digits.length < 8 || digits.length > 15) {
          messages.phone = 'Ingresá un teléfono válido de entre 8 y 15 dígitos.';
        } else if (isRepeating || isSequence) {
          messages.phone = 'Ingresá un número de teléfono real para poder contactarte.';
        } else {
          messages.phone = '';
        }
      } else {
        messages.phone = '';
      }

      // Validación de Correo Electrónico (opcional, pero con sintaxis verificada)
      if (rawEmail) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
        if (rawEmail.length > 120) {
          messages.email = 'El correo electrónico no puede superar los 120 caracteres.';
        } else if (!emailRegex.test(rawEmail) || rawEmail.includes('..')) {
          messages.email = 'Ingresá un correo electrónico válido (ejemplo: nombre@correo.com).';
        } else {
          messages.email = '';
        }
      } else {
        messages.email = '';
      }

      // Validación de Mensaje de Consulta
      if (!rawMessage) {
        messages.message = 'Por favor contanos brevemente tu caso para poder orientarte.';
      } else if (rawMessage.length < 10) {
        messages.message = 'Por favor describí tu consulta con al menos 10 caracteres.';
      } else if (rawMessage.length > 1000) {
        messages.message = 'La consulta no puede superar los 1000 caracteres.';
      } else if (/^(.)\1{9,}$/.test(rawMessage)) {
        messages.message = 'Por favor ingresá un texto comprensible.';
      } else {
        messages.message = '';
      }

      // Aplicar errores en la interfaz
      ['name', 'phone', 'email', 'message'].forEach((key) => {
        if (messages[key] !== undefined) setError(key, messages[key]);
      });

      const firstInvalid = ['name', 'phone', 'email', 'message'].find((key) => messages[key]);
      if (firstInvalid) {
        status.textContent = 'Revisá los campos indicados para continuar.';
        if (fields[firstInvalid]) fields[firstInvalid].focus();
        return;
      }

      // 4. Prevención de Data Leaks & Construcción Segura
      const safeName = stripTags(rawName);
      const safePhone = stripTags(rawPhone);
      const safeEmail = stripTags(rawEmail);
      const safeMessage = stripTags(rawMessage);

      const lines = [`Hola, mi nombre es ${safeName}.`];
      if (safePhone) lines.push(`Teléfono: ${safePhone}`);
      if (safeEmail) lines.push(`Email: ${safeEmail}`);
      lines.push(`Consulta: ${safeMessage}`);

      let waUrl;
      try {
        waUrl = `https://api.whatsapp.com/send?phone=5491164073969&text=${encodeURIComponent(lines.join('\n'))}`;
      } catch (_) {
        setError('message', 'No se pudo preparar el texto de la consulta. Revisá los caracteres e intentá nuevamente.');
        status.textContent = 'Revisá los campos indicados para continuar.';
        fields.message.focus();
        return;
      }

      if (waUrl.length > 7500) {
        setError('message', 'La consulta es demasiado extensa para procesarla en WhatsApp. Resumila e intentá nuevamente.');
        status.textContent = 'Revisá los campos indicados para continuar.';
        fields.message.focus();
        return;
      }

      // 5. Limpieza Inmediata del DOM (Zero Residual Data / Anti-Data Leaks)
      // Se vacían los inputs del navegador para proteger la privacidad del usuario ante terceros o registros residuales.
      contactForm.reset();
      Object.keys(fields).forEach((key) => {
        if (fields[key]) fields[key].value = '';
      });

      // 6. Despacho Confiable ("que ande siempre")
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Preparando WhatsApp...';
      }

      let opened = false;
      try {
        // Intento de apertura segura: sin tabnabbing, sin filtrado de referer
        const waWin = window.open(waUrl, '_blank', 'noopener,noreferrer');
        if (waWin && !waWin.closed && typeof waWin.closed !== 'undefined') {
          opened = true;
        }
      } catch (_) {
        opened = false;
      }

      // Crear tarjeta de confirmación y enlace directo siempre disponible
      const card = document.createElement('div');
      card.className = 'contact-success-box';

      const strong = document.createElement('strong');
      strong.textContent = '¡Consulta lista para enviar!';

      const p = document.createElement('p');
      p.textContent = opened
        ? 'Se abrió WhatsApp con tu mensaje. Si no lo ves en otra ventana, hacé clic en el botón:'
        : 'Hacé clic en el siguiente botón para continuar a WhatsApp con tu consulta:';

      const waLink = document.createElement('a');
      waLink.href = waUrl;
      waLink.className = 'ds-btn ds-btn-whatsapp';
      waLink.target = '_blank';
      waLink.rel = 'noopener noreferrer';
      waLink.setAttribute('referrerpolicy', 'no-referrer');
      waLink.textContent = 'Abrir WhatsApp con mi consulta';

      card.append(strong, p, waLink);
      status.replaceChildren(card);

      // Si no se pudo abrir la ventana nueva (bloqueadores en móviles o apps embebidas), reorientar directamente
      if (!opened && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        try {
          window.location.assign(waUrl);
        } catch (_) {
          waLink.focus();
        }
      }

      // Restaurar el botón tras una breve espera
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Continuar a WhatsApp';
        }
      }, 3000);
    });

    contactForm.noValidate = true;
  }
});
