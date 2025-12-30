const intro = document.getElementById("intro");
const user = document.getElementById("user");
const suggestions = document.getElementById("suggestions");
const goals = document.getElementById("goals");
const final = document.getElementById("final");

const suggestionsList = document.getElementById("suggestions-list");
const form = document.getElementById("goals-form");
const pdfTitle = document.getElementById("pdf-title");

const countdown = document.getElementById("countdown");
const year = document.getElementById("year");

let userName = "";

const SUGGESTIONS = [
  "Hacer ejercicio 💪🏻","Aprender algo nuevo 🧐","Ahorrar dinero 💰","Leer más 📖",
  "Conocer lugares nuevos 🛤️","Cuidar mi salud 🧑🏻‍⚕️","Dormir mejor 😴","Comer más sano 🥑",
  "Disfrutar de tiempo con mi gente 🫂","Beber más agua 💧"
];

/* CUENTA ATRÁS */
function updateCountdown() {
  const target = new Date("2026-01-01T00:00:00");
  const now = new Date();
  const diff = target - now;

  if (diff <= 0) {
    year.textContent = "2026";
    countdown.textContent = "✨ Bienvenido 2026 ✨";
    return;
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000) % 24;
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;

  countdown.textContent = `${d}d ${h}h ${m}m ${s}s`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* FLUJO */
intro.onclick = () => {
  intro.classList.add("hidden");
  user.classList.remove("hidden");
};

document.getElementById("save-name").onclick = () => {
  const input = document.getElementById("username");
  if (!input.value.trim()) return;
  userName = input.value.trim();
  user.classList.add("hidden");
  suggestions.classList.remove("hidden");
  loadSuggestions();
};

function loadSuggestions() {
  suggestionsList.innerHTML = "";
  SUGGESTIONS.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    suggestionsList.appendChild(li);
  });
}

suggestionsList.onclick = e => {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("selected");
  }
};

document.getElementById("continue-to-goals").onclick = () => {
  suggestions.classList.add("hidden");
  goals.classList.remove("hidden");

  pdfTitle.textContent = `LOS PROPÓSITOS DE ${userName.toUpperCase()} PARA 2026 ✨`;

  document.querySelectorAll(".selected").forEach(li => {
    createGoal(li.textContent);
  });
};

document.getElementById("add-goal").onclick = e => {
  e.preventDefault();
  createGoal();
};

function createGoal(text = "") {
  const fs = document.createElement("fieldset");

  fs.innerHTML = `
    <input type="text" value="${text}" placeholder="Tu propósito ✨">
    <label class="file-label">
      📷 Seleccionar imagen
      <input type="file" hidden accept="image/*">
    </label>
    <input type="url" class="image-url" placeholder="o pega una URL de imagen">
    <div class="image-preview"></div>
    <div class="image-status"></div>
    <button class="remove">Eliminar</button>
  `;

  const file = fs.querySelector("input[type=file]");
  const url = fs.querySelector(".image-url");
  const preview = fs.querySelector(".image-preview");
  const status = fs.querySelector(".image-status");

  function showImage(src) {
    preview.innerHTML = `<img src="${src}">`;
    status.textContent = "✓ Imagen añadida";
    fs.dataset.image = src;
  }

  file.onchange = () => {
    const f = file.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => showImage(reader.result);
    reader.readAsDataURL(f);
  };

  url.onchange = () => {
    if (url.value.trim()) showImage(url.value.trim());
  };

  fs.querySelector(".remove").onclick = e => {
    e.preventDefault();
    fs.remove();
  };

  form.appendChild(fs);
}