document.getElementById("download-pdf").onclick = () => {
  
  const page = document.createElement("div");
  page.style.width = "210mm";
  page.style.height = "297mm"; // Altura fija A4
  page.style.background = "linear-gradient(135deg, #2f4ac2ff 0%, #1c085cff 100%)";
  page.style.padding = "20mm 25mm"; // Reducido padding vertical
  page.style.boxSizing = "border-box";
  page.style.color = "white";
  page.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  page.style.position = "relative";
  page.style.overflow = "hidden"; // Importante: evita contenido extra

  // Decoración superior
  const decorTop = document.createElement("div");
  decorTop.style.position = "absolute";
  decorTop.style.top = "0";
  decorTop.style.left = "0";
  decorTop.style.right = "0";
  decorTop.style.height = "120px"; // Reducido
  decorTop.style.background = "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)";
  decorTop.style.borderRadius = "0 0 50% 50%";
  page.appendChild(decorTop);

  // TÍTULO
  const title = document.createElement("h1");
  title.textContent = "✨ MIS PROPÓSITOS PARA 2026 ✨";
  title.style.textAlign = "center";
  title.style.fontSize = "28px"; // Reducido
  title.style.marginBottom = "8px";
  title.style.fontWeight = "700";
  title.style.textShadow = "2px 2px 8px rgba(0,0,0,0.3)";
  title.style.position = "relative";
  title.style.zIndex = "1";
  page.appendChild(title);

  // SUBTÍTULO (nombre)
  const subtitle = document.createElement("p");
  subtitle.textContent = userName.toUpperCase();
  subtitle.style.textAlign = "center";
  subtitle.style.fontSize = "18px"; // Reducido
  subtitle.style.marginBottom = "20px"; // Reducido
  subtitle.style.opacity = "0.9";
  subtitle.style.fontWeight = "600";
  subtitle.style.position = "relative";
  subtitle.style.zIndex = "1";
  page.appendChild(subtitle);

  // GRID 2 COLUMNAS
  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(2, 1fr)";
  grid.style.gap = "14px"; // Reducido
  grid.style.marginBottom = "18px"; // Reducido
  grid.style.position = "relative";
  grid.style.zIndex = "1";

  document.querySelectorAll("#goals-form fieldset").forEach(g => {
    const card = document.createElement("div");
    card.style.background = "rgba(255,255,255,0.2)";
    card.style.backdropFilter = "blur(10px)";
    card.style.borderRadius = "16px"; // Reducido
    card.style.padding = "16px"; // Reducido
    card.style.textAlign = "center";
    card.style.minHeight = "140px"; // Reducido
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.alignItems = "center";
    card.style.justifyContent = "center";
    card.style.boxShadow = "0 6px 24px rgba(0,0,0,0.1)";
    card.style.border = "2px solid rgba(255,255,255,0.3)";

    if (g.dataset.image) {
      const imgWrap = document.createElement("div");
      imgWrap.style.width = "85px"; // Reducido
      imgWrap.style.height = "85px"; // Reducido
      imgWrap.style.margin = "0 auto 12px";
      imgWrap.style.borderRadius = "50%";
      imgWrap.style.backgroundImage = `url(${g.dataset.image})`;
      imgWrap.style.backgroundSize = "cover";
      imgWrap.style.backgroundPosition = "center";
      imgWrap.style.border = "3px solid rgba(255,255,255,0.8)";
      imgWrap.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
      card.appendChild(imgWrap);
    }

    const p = document.createElement("p");
    p.textContent = g.querySelector("input").value;
    p.style.fontSize = "14px"; // Reducido
    p.style.fontWeight = "600";
    p.style.margin = "0";
    p.style.lineHeight = "1.3";
    card.appendChild(p);

    grid.appendChild(card);
  });

  page.appendChild(grid);

  // CAJA DE CITA
  const quoteBox = document.createElement("div");
  quoteBox.style.background = "rgba(255,255,255,0.15)";
  quoteBox.style.backdropFilter = "blur(10px)";
  quoteBox.style.borderRadius = "12px";
  quoteBox.style.padding = "16px"; // Reducido
  quoteBox.style.marginTop = "16px"; // Reducido
  quoteBox.style.border = "2px solid rgba(255,255,255,0.3)";
  quoteBox.style.position = "relative";
  quoteBox.style.zIndex = "1";

  const quote = document.createElement("p");
  quote.textContent = "No se trata de conseguir a todos, sino de no olvidarte de ti.";
  quote.style.textAlign = "center";
  quote.style.fontStyle = "italic";
  quote.style.fontSize = "14px"; // Reducido
  quote.style.margin = "0";
  quote.style.lineHeight = "1.5";
  quoteBox.appendChild(quote);

  page.appendChild(quoteBox);

  // FOOTER
  const footer = document.createElement("div");
  footer.style.textAlign = "center";
  footer.style.marginTop = "18px"; // Reducido
  footer.style.fontSize = "12px"; // Reducido
  footer.style.opacity = "0.7";
  footer.style.position = "relative";
  footer.style.zIndex = "1";
  footer.textContent = "Creado el " + new Date().toLocaleDateString('es-ES');
  page.appendChild(footer);

  // GENERAR PDF
  html2pdf().set({
    margin: 0,
    filename: `propositos-2026-${userName.toLowerCase().replace(/\s+/g, '-')}.pdf`,
    html2canvas: {
      scale: 3, // Reducido para mejor rendimiento
      useCORS: true,
      letterRendering: true
    },
    jsPDF: {
      format: "a4",
      orientation: "portrait",
      compress: true
    },
    pagebreak: { mode: "avoid-all" }
  }).from(page).save().then(() => {
    document.getElementById("goals").classList.add("hidden");
    document.getElementById("final").classList.remove("hidden");
    window.enableFireworks = true; // activamos fuegos
  });
};