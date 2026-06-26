/* ============================================================
   ASOCIACION CAMPESINA SUEÑO AGROPECUARIO DE COLOMBIA
   Script principal — navegación, interacciones, formulario
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR: scroll y hamburguesa ── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('abierto');
    const abierto = navLinks.classList.contains('abierto');
    hamburger.setAttribute('aria-expanded', abierto);
    hamburger.querySelectorAll('span')[0].style.transform = abierto ? 'rotate(45deg) translate(5px, 5px)' : '';
    hamburger.querySelectorAll('span')[1].style.opacity  = abierto ? '0' : '1';
    hamburger.querySelectorAll('span')[2].style.transform = abierto ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });

  /* Cerrar menú al hacer clic en un enlace */
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('abierto');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
    });
  });

  /* ── ACTIVE LINK en scroll ── */
  const secciones = document.querySelectorAll('section[id]');

  const observador = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.querySelectorAll('a').forEach(a => {
          a.classList.toggle('activo', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  secciones.forEach(sec => observador.observe(sec));

  /* ── FORMULARIO DE CONTACTO ── */
  const form     = document.getElementById('form-contacto');
  const mensaje  = document.getElementById('form-mensaje');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const datos = {
      nombre:  form.nombre.value.trim(),
      email:   form.email.value.trim(),
      asunto:  form.asunto.value,
      mensaje: form.msgTexto.value.trim(),
    };

    /* Validación básica */
    if (!datos.nombre || !datos.email || !datos.mensaje) {
      mostrarMensaje('Por favor complete todos los campos requeridos.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datos.email)) {
      mostrarMensaje('Por favor ingrese un correo electrónico válido.', 'error');
      return;
    }

    /* Simulación de envío (aquí iría el fetch a tu backend o EmailJS) */
    const btnEnviar = form.querySelector('.btn-enviar');
    btnEnviar.textContent = 'Enviando…';
    btnEnviar.disabled = true;

    setTimeout(() => {
      mostrarMensaje('✓ Mensaje enviado. Nos pondremos en contacto pronto.', 'exito');
      form.reset();
      btnEnviar.textContent = 'Enviar mensaje';
      btnEnviar.disabled = false;
    }, 1400);
  });

  function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.classList.add('visible');
    mensaje.style.background = tipo === 'error'
      ? 'var(--crema-oscura)'
      : 'var(--verde-suave)';
    mensaje.style.color = tipo === 'error'
      ? 'var(--tierra)'
      : 'var(--verde-oscuro)';
    setTimeout(() => mensaje.classList.remove('visible'), 5000);
  }

  /* ── ANIMACIÓN DE ENTRADA: fade-in al scroll ── */
  const fadeEls = document.querySelectorAll('.producto-card, .miembro-card, .noticia-card, .pilar-card, .mision-card');

  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    fadeObserver.observe(el);
  });

  /* ── CONTADOR ANIMADO en hero stats ── */
  const contadores = document.querySelectorAll('.hero-stat-num[data-target]');

  const contObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animarContador(entry.target);
        contObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  contadores.forEach(el => contObserver.observe(el));

  function animarContador(el) {
    const destino  = parseInt(el.dataset.target, 10);
    const sufijo   = el.dataset.suffix || '';
    const duracion = 1400;
    const inicio   = performance.now();

    function paso(ahora) {
      const progreso = Math.min((ahora - inicio) / duracion, 1);
      const valor    = Math.floor(easeOut(progreso) * destino);
      el.textContent = valor + sufijo;
      if (progreso < 1) requestAnimationFrame(paso);
    }

    requestAnimationFrame(paso);
  }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  /* ── AÑO ACTUAL en footer ── */
  const anioEl = document.getElementById('anio-actual');
  if (anioEl) anioEl.textContent = new Date().getFullYear();

});
