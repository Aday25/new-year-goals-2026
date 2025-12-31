document.addEventListener('DOMContentLoaded', function() {
  // Obtener elementos del DOM
  const wordOptions = document.querySelectorAll('.word-option');
  const customWordInput = document.getElementById('custom-word');
  
  // Configurar eventos para las opciones de palabras
  wordOptions.forEach(option => {
    option.addEventListener('click', () => {
      wordOptions.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      window.selectedWord = option.dataset.word;
      if (customWordInput) customWordInput.value = '';
      showSelectedWord();
    });
  });
  
  // Configurar evento para input personalizado
  if (customWordInput) {
    customWordInput.addEventListener('input', (e) => {
      const value = e.target.value.trim();
      if (value) {
        wordOptions.forEach(o => o.classList.remove('selected'));
        window.selectedWord = value;
        showSelectedWord();
      }
    });
  }
  
  // Función para mostrar la palabra seleccionada
  function showSelectedWord() {
    const display = document.getElementById('word-display');
    const wordEl = display?.querySelector('.chosen-word');
    const hintEl = display?.querySelector('.hint');
    
    if (window.selectedWord && display && wordEl && hintEl) {
      wordEl.textContent = window.selectedWord;
      hintEl.textContent = 'Tu palabra del año es:';
      display.classList.remove('hidden');
      
      setTimeout(() => {
        const wordSection = document.getElementById('word-section');
        if (wordSection) {
          wordSection.style.minHeight = 'calc(100vh + 100px)';
        }
      }, 100);
    }
  }
  
  // Evento para continuar desde la sección de palabra
  const continueCommitmentBtn = document.getElementById('continue-commitment');
  if (continueCommitmentBtn) {
    continueCommitmentBtn.addEventListener('click', async () => {
      if (!window.selectedWord) {
        if (window.showWordAlert) {
          await window.showWordAlert();
        } else {
          alert('Por favor, elige o escribe tu palabra del año');
        }
        return;
      }
      window.capsuleData.word = window.selectedWord;
      hideSection('word-section');
      scrollToSection('commitment');
    });
  }
  
  // GENERAR CÁPSULA
  const generateCapsuleBtn = document.getElementById('generate-capsule');
  if (generateCapsuleBtn) {
    generateCapsuleBtn.addEventListener('click', async () => {
      window.capsuleData.promise = document.getElementById('promise')?.value || '';
      window.capsuleData.reminder = document.getElementById('reminder')?.value || '';
      
      if (!window.capsuleData.promise.trim() || !window.capsuleData.reminder.trim()) {
        if (window.showCustomAlert) {
          await window.showCustomAlert('Completa tus compromisos antes de sellar la cápsula. Son importantes para tu futuro yo.', 'warning');
        } else {
          alert('Por favor, completa tus compromisos antes de continuar.');
        }
        return;
      }
      
      if (!window.capsuleData.name || !window.capsuleData.word) {
        if (window.showCustomAlert) {
          await window.showCustomAlert('Faltan datos importantes para generar tu cápsula. Por favor, completa todos los pasos.', 'error');
        }
        return;
      }
      
      if (window.showCustomAlert) {
        await window.showCustomAlert('¡Estás a punto de sellar tu cápsula del tiempo!<br><br>Dentro de un año podrás abrirla y recordar este momento especial.', 'success');
      }
      
      try {
        await generateCapsuleImage();
        console.log('Cápsula generada correctamente');
      } catch (error) {
        console.error('Error generando la cápsula:', error);
        if (window.showCustomAlert) {
          await window.showCustomAlert('Hubo un error generando tu cápsula. Por favor, intenta nuevamente.', 'error');
        }
        return;
      }
      
      hideSection('commitment');
      scrollToSection('final');
      window.enableFireworks = true;
      
      const finalNameElement = document.getElementById('final-name');
      if (finalNameElement) {
        finalNameElement.textContent = window.capsuleData.name;
      }
    });
  }
  
  // DESCARGAR CÁPSULA
  const downloadCapsuleBtn = document.getElementById('download-capsule');
  if (downloadCapsuleBtn) {
    downloadCapsuleBtn.addEventListener('click', async () => {
      if (!window.capsuleCanvas) {
        console.error('No se encontró la cápsula generada');
        if (window.showCustomAlert) {
          await window.showCustomAlert('Primero debes generar tu cápsula. Por favor, completa todos los pasos.', 'warning');
        } else {
          alert('Primero debes generar tu cápsula.');
        }
        return;
      }
      
      try {
        window.capsuleCanvas.toBlob(function(blob) {
          if (!blob) {
            console.error('Error creando el blob de la imagen');
            if (window.showCustomAlert) {
              window.showCustomAlert('Error al crear la imagen. Por favor, intenta nuevamente.', 'error');
            }
            return;
          }
          
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `capsula-tiempo-2026-${window.capsuleData.name.toLowerCase().replace(/\s+/g, '-')}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          if (window.showCustomAlert) {
            setTimeout(() => {
              window.showCustomAlert('¡Cápsula descargada con éxito!<br><br>Guárdala en un lugar seguro y ábrela en diciembre 2026.', 'success');
            }, 500);
          }
        }, 'image/png', 1.0);
        
      } catch (error) {
        console.error('Error descargando la cápsula:', error);
        if (window.showCustomAlert) {
          await window.showCustomAlert('Error al descargar la cápsula. Por favor, intenta nuevamente.', 'error');
        }
      }
    });
  }
});

// ========== FUNCIÓN MEJORADA PARA GENERAR LA IMAGEN ==========
async function generateCapsuleImage() {
  console.log('Generando cápsula con datos:', window.capsuleData);
  
  // Esperar a que las fuentes se carguen
  try {
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (e) {
    console.warn('Error esperando fuentes:', e);
  }
  
  // Crear canvas temporal para calcular dimensiones
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 1600; // Ancho mayor para textos largos
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas');
  }
  
  // Calcular altura necesaria
  const calculatedHeight = calculateRequiredHeight(tempCtx);
  
  // Crear canvas final - ajustado para eliminar espacio en blanco
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = calculatedHeight + 150; // Solo 150px de padding final
  
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas');
  }
  
  // ========== FONDO DEGRADADO VINTAGE ==========
  const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGradient.addColorStop(0, '#f4e4c1');
  bgGradient.addColorStop(0.5, '#e8d5b5');
  bgGradient.addColorStop(1, '#d9c4a0');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // ========== TEXTURA DE PAPEL ==========
  ctx.fillStyle = 'rgba(139, 119, 101, 0.03)';
  const texturePoints = Math.floor((canvas.width * canvas.height) / 500);
  for (let i = 0; i < texturePoints; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 2, 2);
  }
  
  // ========== BORDES DECORATIVOS ==========
  ctx.strokeStyle = '#8b7765';
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
  
  ctx.strokeStyle = '#a89279';
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);
  
  // ========== CONTENIDO ==========
  let y = 220;
  const margin = 120;
  const maxWidth = canvas.width - (margin * 2);
  
  // Función para dibujar líneas decorativas
  function drawLine(yPos) {
    ctx.strokeStyle = '#8b7765';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(250, yPos);
    ctx.lineTo(canvas.width - 250, yPos);
    ctx.stroke();
  }
  
  // Función para envolver texto multilínea
  function wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (let word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }
  
  // Función para ajustar tamaño de fuente si el texto es muy largo
  function getFontSizeForText(text, baseSize, maxWidth) {
    ctx.font = `bold ${baseSize}px "Caveat", cursive`;
    const width = ctx.measureText(text).width;
    
    if (width <= maxWidth) return baseSize;
    
    // Reducir tamaño proporcionalmente
    const ratio = maxWidth / width;
    return Math.floor(baseSize * ratio);
  }
  
  // Función para agregar sección
  function addSection(title, text, isWord = false) {
    if (!text || !text.trim()) return y;
    
    // Título de sección
    ctx.font = 'bold 52px "Caveat", cursive';
    ctx.fillStyle = '#5d4e37';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, y);
    y += 85;
    
    if (isWord) {
      // PALABRA DEL AÑO - más espacio arriba, menos abajo
      y += 20; // Espacio extra antes de la palabra
      
      const wordText = `"${text}"`;
      const fontSize = getFontSizeForText(wordText, 75, maxWidth - 100);
      
      ctx.font = `bold ${fontSize}px "Caveat", cursive`;
      ctx.fillStyle = '#2c1810';
      ctx.textAlign = 'center';
      ctx.fillText(wordText, canvas.width / 2, y);
      y += fontSize + 15; // Reducido de 50 a 15
    } else {
      // TEXTO NORMAL - CENTRADO y envuelto correctamente
      ctx.font = 'normal 42px "Caveat", cursive';
      ctx.fillStyle = '#3e2723';
      ctx.textAlign = 'center'; // Cambiado a center
      
      const lines = wrapText(text, maxWidth);
      const lineHeight = 52;
      
      for (let line of lines) {
        ctx.fillText(line, canvas.width / 2, y); // Centrado en lugar de margin
        y += lineHeight;
      }
      
      y += 30;
    }
    
    drawLine(y);
    y += 70;
    
    return y;
  }
  
  // ========== TÍTULO PRINCIPAL ==========
  const mainTitleText = '💌 Mi Cápsula del Tiempo';
  const titleFontSize = getFontSizeForText(mainTitleText, 95, maxWidth);
  ctx.font = `bold ${titleFontSize}px "Caveat", cursive`;
  ctx.fillStyle = '#5d4e37';
  ctx.textAlign = 'center';
  ctx.fillText(mainTitleText, canvas.width / 2, y);
  y += 100;
  
  ctx.font = 'normal 58px "Caveat", cursive';
  ctx.fillStyle = '#8b7765';
  ctx.fillText('✨ Diciembre 2025 ✨', canvas.width / 2, y);
  y += 115;
  
  // ========== NOMBRE ==========
  const nameText = `Para: ${window.capsuleData.name}`;
  const nameFontSize = getFontSizeForText(nameText, 78, maxWidth);
  ctx.font = `bold ${nameFontSize}px "Caveat", cursive`;
  ctx.fillStyle = '#3e2723';
  ctx.fillText(nameText, canvas.width / 2, y);
  y += 95;
  
  drawLine(y);
  y += 70;
  
  // ========== SECCIONES DE CONTENIDO ==========
  
  if (window.capsuleData.word) {
    y = addSection('🌟 Mi Palabra del Año 2026', window.capsuleData.word, true);
  }
  
  if (window.capsuleData.futureFeel) {
    y = addSection('🌅 Cómo Quiero Sentirme en 2026', window.capsuleData.futureFeel);
  }
  
  if (window.capsuleData.futureSelf) {
    y = addSection('👤 La Persona que Quiero Ser', window.capsuleData.futureSelf);
  }
  
  if (window.capsuleData.scaryExciting) {
    y = addSection('🚀 Mi Reto para 2026', window.capsuleData.scaryExciting);
  }
  
  if (window.capsuleData.celebrating) {
    y = addSection('🎉 Lo que Celebraré en 2026', window.capsuleData.celebrating);
  }
  
  if (window.capsuleData.promise) {
    y = addSection('🤝 Mi Compromiso para 2026', window.capsuleData.promise);
  }
  
  if (window.capsuleData.reminder) {
    y = addSection('💭 Lo que Recordaré', window.capsuleData.reminder);
  }
  
  if (window.capsuleData.release1 || window.capsuleData.release2 || window.capsuleData.release3) {
    y = addSection('🍂 Lo que Dejo Atrás', 'He soltado lo que ya no me sirve para abrir espacio a nuevas oportunidades.');
  }
  
  // ========== PIE DE PÁGINA - COMPACTO Y SIEMPRE VISIBLE ==========
  y += 40;
  drawLine(y);
  y += 80;
  
  ctx.font = 'bold 56px "Caveat", cursive';
  ctx.fillStyle = '#c62828';
  ctx.textAlign = 'center';
  ctx.fillText('📅 Ábrela en Diciembre de 2026', canvas.width / 2, y);
  y += 75;
  
  ctx.font = 'normal 46px "Caveat", cursive';
  ctx.fillStyle = '#5d4e37';
  ctx.fillText('Nos vemos dentro de un año ✨', canvas.width / 2, y);
  y += 70;
  
  ctx.font = 'italic 54px "Caveat", cursive';
  ctx.fillStyle = '#8b7765';
  ctx.fillText('Con amor, tu yo de diciembre 2025', canvas.width / 2, y);
  
  // Guardar el canvas en la variable global
  window.capsuleCanvas = canvas;
  console.log('Cápsula guardada - Dimensiones:', canvas.width, 'x', canvas.height);
}

// ========== FUNCIÓN PARA CALCULAR ALTURA NECESARIA ==========
function calculateRequiredHeight(ctx) {
  let height = 140;
  const margin = 120;
  const maxWidth = 1600 - (margin * 2);
  
  // Función auxiliar para medir texto envuelto
  function measureWrappedText(text, font, maxWidth) {
    ctx.font = font;
    const words = text.split(' ');
    let lines = 1;
    let currentLine = '';
    
    for (let word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine !== '') {
        lines++;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    return lines;
  }
  
  // Función para calcular tamaño ajustado
  function getFontSizeForText(text, baseSize, maxWidth) {
    ctx.font = `bold ${baseSize}px "Caveat", cursive`;
    const width = ctx.measureText(text).width;
    if (width <= maxWidth) return baseSize;
    const ratio = maxWidth / width;
    return Math.floor(baseSize * ratio);
  }
  
  // Título y encabezado
  height += 100 + 115 + 95 + 70;
  
  // Calcular espacio para cada sección
  const sections = [
    { title: '🌟 Mi Palabra del Año 2026', text: window.capsuleData.word, isWord: true },
    { title: '🌅 Cómo Quiero Sentirme en 2026', text: window.capsuleData.futureFeel },
    { title: '👤 La Persona que Quiero Ser', text: window.capsuleData.futureSelf },
    { title: '🚀 Mi Reto para 2026', text: window.capsuleData.scaryExciting },
    { title: '🎉 Lo que Celebraré en 2026', text: window.capsuleData.celebrating },
    { title: '🤝 Mi Compromiso para 2026', text: window.capsuleData.promise },
    { title: '💭 Lo que Recordaré', text: window.capsuleData.reminder }
  ];
  
  if (window.capsuleData.release1 || window.capsuleData.release2 || window.capsuleData.release3) {
    sections.push({
      title: '🍂 Lo que Dejo Atrás',
      text: 'He soltado lo que ya no me sirve para abrir espacio a nuevas oportunidades.'
    });
  }
  
  for (let section of sections) {
    if (section.text && section.text.trim()) {
      height += 52 + 85; // Título de sección
      
      if (section.isWord) {
        height += 20; // Espacio extra antes de la palabra
        const wordText = `"${section.text}"`;
        const fontSize = getFontSizeForText(wordText, 75, maxWidth - 100);
        height += fontSize + 15; // Ajustado igual que en la generación
      } else {
        const lines = measureWrappedText(section.text, 'normal 42px "Caveat", cursive', maxWidth);
        height += (lines * 52) + 30;
      }
      
      height += 70; // Línea decorativa + espacio
    }
  }
  
  // Pie de página - compacto
  height += 40 + 80 + 75 + 70; // Sin espacio extra al final
  
  return height;
}

// ========== FUNCIONES HELPER ==========
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