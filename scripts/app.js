// ========== APP.JS - LÓGICA PRINCIPAL (con reloj de arena simplificado) ==========

// Objeto global para almacenar los datos de la cápsula
window.capsuleData = {
  name: '',
  achievement: '',
  obstacle: '',
  person: '',
  moment: '',
  feeling: '',
  release1: '',
  release2: '',
  release3: '',
  futureFeel: '',
  futureSelf: '',
  scaryExciting: '',
  celebrating: '',
  word: '',
  promise: '',
  reminder: ''
};

// Variables para el audio MP3
let audioPlaying = false;
let audioStarted = false;

// ========== SISTEMA DE ALERTS PERSONALIZADOS ==========

// Crear contenedor de alerts si no existe
function initCustomAlerts() {
  if (!document.getElementById('custom-alert-container')) {
    const alertContainer = document.createElement('div');
    alertContainer.id = 'custom-alert-container';
    alertContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: none;
    `;
    document.body.appendChild(alertContainer);
  }
}

// Mostrar alert personalizado
window.showCustomAlert = function(message, type = 'info') {
  initCustomAlerts();
  
  const container = document.getElementById('custom-alert-container');
  
  // Crear overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    pointer-events: all;
    z-index: 9998;
  `;
  
  // Determinar color según tipo
  let color, icon;
  switch(type) {
    case 'error':
      color = '#ff6b6b';
      icon = '❌';
      break;
    case 'warning':
      color = '#f9ca24';
      icon = '⚠️';
      break;
    case 'success':
      color = '#4ecdc4';
      icon = '✅';
      break;
    case 'info':
    default:
      color = '#667eea';
      icon = '💡';
  }
  
  // Crear alert box
  const alertBox = document.createElement('div');
  alertBox.style.cssText = `
    position: relative;
    z-index: 9999;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 2px solid ${color};
    border-radius: 15px;
    padding: 30px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    color: white;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    transform: translateY(-20px);
    opacity: 0;
    animation: alertAppear 0.4s ease forwards;
    pointer-events: all;
  `;
  
  // Icono y mensaje
  alertBox.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 15px; animation: pulse 2s infinite;">
      ${icon}
    </div>
    <h3 style="margin: 0 0 15px 0; color: ${color}; font-size: 1.4rem; font-weight: 600;">
      ${type === 'error' ? 'Atención' : type === 'warning' ? 'Importante' : type === 'success' ? '¡Perfecto!' : 'Información'}
    </h3>
    <p style="margin: 0 0 25px 0; font-size: 1.1rem; line-height: 1.5; opacity: 0.9;">
      ${message}
    </p>
    <button class="alert-button" style="
      background: linear-gradient(135deg, ${color}, ${type === 'error' ? '#ff8e8e' : type === 'warning' ? '#ffd93d' : type === 'success' ? '#45b7d1' : '#764ba2'});
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 25px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    ">
      Entendido
    </button>
  `;
  
  // Añadir al DOM
  container.appendChild(overlay);
  container.appendChild(alertBox);
  
  // Estilos para la animación
  const style = document.createElement('style');
  style.textContent = `
    @keyframes alertAppear {
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    .alert-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }
    
    .alert-button:active {
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
  
  // Retornar una promesa para simular el comportamiento de alert()
  return new Promise((resolve) => {
    const button = alertBox.querySelector('.alert-button');
    const closeAlert = () => {
      alertBox.style.animation = 'alertAppear 0.3s ease reverse forwards';
      setTimeout(() => {
        container.removeChild(overlay);
        container.removeChild(alertBox);
        document.head.removeChild(style);
        resolve();
      }, 300);
    };
    
    button.addEventListener('click', closeAlert);
    overlay.addEventListener('click', closeAlert);
    
    // También cerrar con Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeAlert();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  });
}

// Alert para la palabra del año (especial)
window.showWordAlert = function() {
  initCustomAlerts();
  
  const container = document.getElementById('custom-alert-container');
  
  // Overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    pointer-events: all;
    z-index: 9998;
  `;
  
  // Alert especial para palabra del año
  const alertBox = document.createElement('div');
  alertBox.style.cssText = `
    position: relative;
    z-index: 9999;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
    backdrop-filter: blur(25px);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    padding: 40px 30px;
    max-width: 450px;
    width: 90%;
    text-align: center;
    color: white;
    font-family: 'Caveat', cursive;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
    transform: translateY(-20px) scale(0.9);
    opacity: 0;
    animation: wordAlertAppear 0.5s ease forwards;
    pointer-events: all;
  `;
  
  alertBox.innerHTML = `
    <div style="font-size: 4rem; margin-bottom: 10px; animation: float 3s ease-in-out infinite;">
      ✨
    </div>
    <h3 style="margin: 0 0 10px 0; font-size: 2.2rem; color: #ffd700; font-weight: 700;">
      Tu Palabra del Año
    </h3>
    <div style="
      background: rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      padding: 20px;
      margin: 20px 0;
      border: 2px dashed rgba(255, 255, 255, 0.2);
    ">
      <p style="margin: 0; font-size: 1.4rem; line-height: 1.6; opacity: 0.9;">
        Elige una palabra que será tu guía,<br>
        tu mantra, tu faro en 2026.
      </p>
    </div>
    <p style="margin: 0 0 25px 0; font-size: 1.2rem; color: #4ecdc4; font-style: italic;">
      Esta palabra te acompañará todo el año
    </p>
    <button class="word-alert-button" style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 15px 40px;
      border-radius: 30px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      font-family: 'Segoe UI', sans-serif;
    ">
      ¡Elegiré mi palabra!
    </button>
  `;
  
  // Añadir al DOM
  container.appendChild(overlay);
  container.appendChild(alertBox);
  
  // Estilos para animaciones
  const style = document.createElement('style');
  style.textContent = `
    @keyframes wordAlertAppear {
      to {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(5deg); }
    }
    
    .word-alert-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
    }
    
    .word-alert-button:active {
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
  
  // Retornar promesa
  return new Promise((resolve) => {
    const button = alertBox.querySelector('.word-alert-button');
    const closeAlert = () => {
      alertBox.style.animation = 'wordAlertAppear 0.3s ease reverse forwards';
      setTimeout(() => {
        container.removeChild(overlay);
        container.removeChild(alertBox);
        document.head.removeChild(style);
        resolve();
      }, 300);
    };
    
    button.addEventListener('click', closeAlert);
    overlay.addEventListener('click', closeAlert);
  });
}

// UTILIDADES
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.remove('hidden');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function hideSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.add('hidden');
  }
}

// CONTADOR REGRESIVO
function updateCountdown() {
  const countdownElement = document.getElementById('countdown');
  if (!countdownElement) return;
  
  const now = new Date();
  const newYear = new Date('2026-01-01T00:00:00');
  const diff = newYear - now;
  
  if (diff <= 0) {
    countdownElement.textContent = '¡Feliz 2026! 🎆';
    return;
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  countdownElement.textContent = 
    `Faltan ${days}d ${hours}h ${minutes}m ${seconds}s para 2026`;
}

// CONTROL DE AUDIO CON MP3 (new-year.mp3)
function startAmbientMusic() {
  if (audioStarted) return;
  
  const bgMusic = document.getElementById('bgMusic');
  const audioToggle = document.getElementById('audioToggle');
  
  if (!bgMusic) return;
  
  // Configurar el audio
  bgMusic.volume = 0.3;
  bgMusic.loop = true;
  
  const playPromise = bgMusic.play();
  
  if (playPromise !== undefined) {
    playPromise.then(() => {
      audioPlaying = true;
      audioStarted = true;
      
      if (audioToggle) {
        audioToggle.textContent = '🔊';
        audioToggle.classList.add('playing');
        audioToggle.title = 'Música activada (click para silenciar)';
      }
    }).catch(error => {
      console.log('Reproducción automática bloqueada:', error);
      
      if (audioToggle) {
        audioToggle.textContent = '▶️';
        audioToggle.title = 'Click para activar la música';
        audioToggle.classList.remove('playing');
        
        audioToggle.onclick = function() {
          bgMusic.play();
          audioPlaying = true;
          audioStarted = true;
          audioToggle.textContent = '🔊';
          audioToggle.classList.add('playing');
          audioToggle.title = 'Música activada (click para silenciar)';
          audioToggle.onclick = toggleAudio;
        };
      }
    });
  }
  
  bgMusic.addEventListener('error', function(e) {
    console.error('Error cargando el audio:', e);
    if (audioToggle) {
      audioToggle.textContent = '❌';
      audioToggle.title = 'Error cargando la música';
      audioToggle.style.opacity = '0.5';
      audioToggle.style.cursor = 'not-allowed';
    }
  });
}

function toggleAudio() {
  const bgMusic = document.getElementById('bgMusic');
  const audioToggle = document.getElementById('audioToggle');
  
  if (!bgMusic || !audioToggle) return;
  
  if (audioPlaying) {
    bgMusic.pause();
    audioPlaying = false;
    audioToggle.textContent = '🔇';
    audioToggle.classList.remove('playing');
    audioToggle.title = 'Música desactivada (click para activar)';
  } else {
    bgMusic.play();
    audioPlaying = true;
    audioToggle.textContent = '🔊';
    audioToggle.classList.add('playing');
    audioToggle.title = 'Música activada (click para silenciar)';
  }
}

// RELOJ DE ARENA SIMPLIFICADO
function startHourglass() {
  const hourglassGif = document.getElementById('hourglassGif');
  const instruction = document.querySelector('.hourglass-instruction');
  
  if (hourglassGif) {
    // 1. Efecto visual en el reloj
    hourglassGif.classList.add('active');
    hourglassGif.style.filter = 'drop-shadow(0 0 40px rgba(255, 215, 0, 0.8))';
    
    // 2. Cambiar el texto de instrucción
    if (instruction) {
      instruction.textContent = '✨ ¡Es hora de empezar! ✨';
      instruction.style.color = '#ffd700';
      instruction.style.animation = 'glow 1s ease-in-out infinite alternate';
    }
    
    // 3. Iniciar música inmediatamente
    startAmbientMusic();
    
    // 4. Transición inmediata (sin esperar)
    setTimeout(() => {
      hideSection('hourglass-screen');
      scrollToSection('intro');
    }, 2100); 
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar contador
  updateCountdown();
  setInterval(updateCountdown, 1000);
  
  // RELOJ DE ARENA SIMPLIFICADO - Event Listener
  const hourglassGif = document.getElementById('hourglassGif');
  const skipButton = document.getElementById('skipHourglass');
  
  
  // Configurar el clic en el reloj
  if (hourglassGif) {
    hourglassGif.addEventListener('click', startHourglass);
    hourglassGif.addEventListener('touchstart', startHourglass, { passive: true });
    
    // Hacer que el cursor sea pointer
    hourglassGif.style.cursor = 'pointer';
  }
  
  // Control de audio
  const audioToggle = document.getElementById('audioToggle');
  if (audioToggle) {
    audioToggle.addEventListener('click', toggleAudio);
  }
  
  // Navegación principal
  const startJourneyBtn = document.getElementById('start-journey');
  if (startJourneyBtn) {
    startJourneyBtn.addEventListener('click', () => {
      hideSection('intro');
      scrollToSection('user');
    });
  }
  
  const saveNameBtn = document.getElementById('save-name');
  if (saveNameBtn) {
    saveNameBtn.addEventListener('click', async () => {
      const nameInput = document.getElementById('username');
      if (nameInput) {
        const name = nameInput.value.trim();
        if (!name) {
          // Alert personalizado para nombre vacío
          await showCustomAlert('Por favor, escribe tu nombre para personalizar tu experiencia.', 'info');
          return;
        }
        window.capsuleData.name = name;
        hideSection('user');
        scrollToSection('looking-back');
      }
    });
  }
  
  const continueLettingGoBtn = document.getElementById('continue-letting-go');
  if (continueLettingGoBtn) {
    continueLettingGoBtn.addEventListener('click', () => {
      window.capsuleData.achievement = document.getElementById('achievement')?.value || '';
      window.capsuleData.obstacle = document.getElementById('obstacle')?.value || '';
      window.capsuleData.person = document.getElementById('person')?.value || '';
      window.capsuleData.moment = document.getElementById('moment')?.value || '';
      window.capsuleData.feeling = document.getElementById('feeling')?.value || '';
      
      hideSection('looking-back');
      scrollToSection('letting-go');
    });
  }
  
  const continueLookingForwardBtn = document.getElementById('continue-looking-forward');
  if (continueLookingForwardBtn) {
    continueLookingForwardBtn.addEventListener('click', () => {
      window.capsuleData.release1 = document.getElementById('release1')?.value || '';
      window.capsuleData.release2 = document.getElementById('release2')?.value || '';
      window.capsuleData.release3 = document.getElementById('release3')?.value || '';
      
      hideSection('letting-go');
      scrollToSection('looking-forward');
    });
  }
  
  const continueWordBtn = document.getElementById('continue-word');
  if (continueWordBtn) {
    continueWordBtn.addEventListener('click', () => {
      window.capsuleData.futureFeel = document.getElementById('future-feeling')?.value || '';
      window.capsuleData.futureSelf = document.getElementById('future-self')?.value || '';
      window.capsuleData.scaryExciting = document.getElementById('scary-exciting')?.value || '';
      window.capsuleData.celebrating = document.getElementById('celebrating')?.value || '';
      
      hideSection('looking-forward');
      scrollToSection('word-section');
    });
  }
  
  // EFECTO DE DESVANECIMIENTO
  const releaseInputs = ['release1', 'release2', 'release3'];
  releaseInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        if (input.value.trim().length > 3) {
          input.parentElement.classList.add('fading');
        } else {
          input.parentElement.classList.remove('fading');
        }
      });
    }
  });
});

// Variables para la palabra del año (necesarias para la navegación)
let selectedWord = '';

// Función para mostrar la palabra seleccionada (usada por capsule.js)
window.showSelectedWord = function() {
  const display = document.getElementById('word-display');
  const wordEl = display?.querySelector('.chosen-word');
  const hintEl = display?.querySelector('.hint');
  
  if (selectedWord && display && wordEl && hintEl) {
    wordEl.textContent = selectedWord;
    hintEl.textContent = 'Tu palabra del año es:';
    display.classList.remove('hidden');
  }
};

// Hacer selectedWord accesible globalmente
window.selectedWord = selectedWord;

// Función para actualizar selectedWord (usada por capsule.js)
window.updateSelectedWord = function(word) {
  selectedWord = word;
  window.selectedWord = selectedWord;
};

// Función para obtener las opciones de palabras (usada por capsule.js)
window.getWordOptions = function() {
  return document.querySelectorAll('.word-option');
};

// Función para obtener el input personalizado (usada por capsule.js)
window.getCustomWordInput = function() {
  return document.getElementById('custom-word');
};