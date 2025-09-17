// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos del DOM
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const form = document.querySelector('.form');
    
    // Toggle del menú móvil
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Cerrar menú al hacer click en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
    
    // Cambiar apariencia del header al hacer scroll
    function handleScroll() {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Navegación suave y resaltado de sección activa
    function highlightActiveSection() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSection);
    
    // Animación de elementos al entrar en el viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial, .about-content, .contact-content');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Contador animado para estadísticas
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const duration = 2000; // 2 segundos
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target + (counter.textContent.includes('+') ? '+' : '') + 
                                       (counter.textContent.includes('%') ? '%' : '');
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '') + 
                                       (counter.textContent.includes('%') ? '%' : '');
                }
            }, 16);
        });
    }
    
    // Observar la sección de estadísticas
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
    
    // Manejo del formulario de contacto con EmailJS
    if (form) {
        // Configuración temporal - cambiar por las claves reales de EmailJS
        const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
        const SERVICE_ID = "YOUR_SERVICE_ID";
        const TEMPLATE_ID = "YOUR_TEMPLATE_ID";
        
        // Verificar si EmailJS está configurado
        const isEmailJSConfigured = EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY" && 
                                    SERVICE_ID !== "YOUR_SERVICE_ID" && 
                                    TEMPLATE_ID !== "YOUR_TEMPLATE_ID";
        
        if (isEmailJSConfigured) {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        }
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(form);
            const data = {
                nombre: formData.get('nombre'),
                email: formData.get('email'),
                telefono: formData.get('telefono'),
                embarcacion: formData.get('embarcacion'),
                servicio: formData.get('servicio'),
                mensaje: formData.get('mensaje')
            };
            
            // Validar campos requeridos
            if (!data.nombre || !data.email || !data.telefono || !data.mensaje) {
                showFormStatus('Por favor, completa todos los campos requeridos.', 'error');
                return;
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showFormStatus('Por favor, introduce un email válido.', 'error');
                return;
            }
            
            // Preparar el botón para envío
            const submitButton = form.querySelector('button[type="submit"]');
            const originalHTML = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;
            submitButton.classList.add('btn-loading');
            
            showFormStatus('Enviando tu solicitud...', 'loading');
            
            if (isEmailJSConfigured) {
                // Preparar datos para EmailJS
                const templateParams = {
                    from_name: data.nombre,
                    from_email: data.email,
                    phone: data.telefono,
                    boat_type: data.embarcacion || 'No especificado',
                    service_type: data.servicio || 'No especificado',
                    message: data.mensaje,
                    to_email: 'bluelemarineservices@gmail.com'
                };
                
                // Enviar email con EmailJS
                emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
                    .then(function(response) {
                        console.log('SUCCESS!', response.status, response.text);
                        showFormStatus('¡Solicitud enviada correctamente! Te contactaremos pronto.', 'success');
                        form.reset();
                    })
                    .catch(function(error) {
                        console.log('FAILED...', error);
                        showFormStatus('Error al enviar la solicitud. Por favor, contáctanos directamente por WhatsApp.', 'error');
                    })
                    .finally(function() {
                        submitButton.innerHTML = originalHTML;
                        submitButton.disabled = false;
                        submitButton.classList.remove('btn-loading');
                    });
            } else {
                // Modo temporal: mostrar información del contacto
                setTimeout(() => {
                    const mensaje = `¡Gracias ${data.nombre}! Hemos recibido tu solicitud de ${data.servicio || 'servicio marino'}. 
                    
Mientras configuramos el sistema de emails, por favor contáctanos directamente:

📱 WhatsApp: +1 (786) 342-9553
📧 Email: bulelemarineservices@gmail.com

Te responderemos lo antes posible.`;
                    
                    showFormStatus(mensaje, 'success');
                    form.reset();
                    submitButton.innerHTML = originalHTML;
                    submitButton.disabled = false;
                    submitButton.classList.remove('btn-loading');
                }, 1500);
            }
        });
    }
    
    // Función para mostrar estados del formulario
    function showFormStatus(message, type) {
        const statusDiv = document.getElementById('form-status');
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.className = `form-status ${type}`;
            statusDiv.style.display = 'block';
            
            // Auto-ocultar después de 5 segundos para mensajes de éxito
            if (type === 'success') {
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                }, 5000);
            }
        }
    }
    
    // Sistema de notificaciones
    function showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">
                    ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
                </span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Estilos para la notificación
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '400px'
        });
        
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
        `;
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Función para cerrar notificación
        function closeNotification() {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
        
        // Cerrar al hacer click en X
        notification.querySelector('.notification-close').addEventListener('click', closeNotification);
        
        // Auto-cerrar después de 5 segundos
        setTimeout(closeNotification, 5000);
    }
    
    // Efecto de escritura para el título hero
    function typeWriter() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;
        
        const text = heroTitle.textContent;
        const highlightText = heroTitle.querySelector('.hero-highlight')?.textContent || '';
        
        if (text.includes(highlightText)) {
            // Crear efecto de escritura solo si es necesario
            const beforeHighlight = text.split(highlightText)[0];
            const afterHighlight = text.split(highlightText)[1];
            
            heroTitle.innerHTML = '';
            
            let i = 0;
            const speed = 50;
            
            function type() {
                if (i < beforeHighlight.length) {
                    heroTitle.innerHTML += beforeHighlight.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else if (i === beforeHighlight.length) {
                    heroTitle.innerHTML += `<span class="hero-highlight">${highlightText}</span>`;
                    i++;
                    setTimeout(type, speed);
                } else if (i - beforeHighlight.length - 1 < afterHighlight.length) {
                    const currentAfter = i - beforeHighlight.length - 1;
                    const currentContent = heroTitle.innerHTML;
                    const beforeSpan = currentContent.split('</span>')[0] + '</span>';
                    heroTitle.innerHTML = beforeSpan + afterHighlight.charAt(currentAfter);
                    i++;
                    setTimeout(type, speed);
                }
            }
            
            // Iniciar efecto después de un pequeño delay
            setTimeout(type, 1000);
        }
    }
    
    // Ejecutar efecto de escritura
    typeWriter();
    
    // Lazy loading para imágenes (si las hay)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Smooth scroll para navegación
    document.querySelectorAll('a[href^="#"]:not(.social-link)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Asegurar que los enlaces sociales funcionen correctamente
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            // No prevenir el comportamiento por defecto para enlaces externos
            const href = this.getAttribute('href');
            if (href && (href.startsWith('http') || href.startsWith('https'))) {
                // Permitir que el enlace funcione normalmente
                console.log('Navegando a:', href);
            }
        });
    });
    
    // Efecto parallax suave para elementos hero
    function parallaxEffect() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-elements');
        
        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
    
    // Solo aplicar parallax en pantallas grandes
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', parallaxEffect);
    }
    
    // Manejar cambios de tamaño de ventana
    window.addEventListener('resize', function() {
        // Cerrar menú móvil si se cambia a desktop
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
    
    // Precargar contenido crítico
    function preloadCriticalResources() {
        // Precargar fuentes importantes
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.as = 'font';
        fontPreload.type = 'font/woff2';
        fontPreload.crossOrigin = 'anonymous';
        document.head.appendChild(fontPreload);
    }
    
    preloadCriticalResources();
    
    // Inicialización final
    console.log('🌊 Marine Landing - Sitio web cargado correctamente');
    
    // Mostrar notificación de bienvenida (opcional)
    setTimeout(() => {
        if (sessionStorage.getItem('welcomeShown') !== 'true') {
            showNotification('¡Bienvenido a Marine Landing! Explora nuestros servicios.', 'info');
            sessionStorage.setItem('welcomeShown', 'true');
        }
    }, 2000);
});

// Función para optimizar rendimiento
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce a eventos de scroll para mejor rendimiento
const debouncedScroll = debounce(() => {
    // Funciones de scroll ya están manejadas arriba
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registro falló: ', registrationError);
            });
    });
}