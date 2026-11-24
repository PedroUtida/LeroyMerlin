const products = [
  { id: 1,  name: "Sofá 3 lugares retrátil", cat: "Sofás e Poltronas", price: 1799, color: "cinza",    size: "3 lugares",         rating: 4, reviews: 120, img: "https://cdn.leroymerlin.com.br/products/sofa_viena_3_lugares_com_base_de_madeira_linho_cinza_madeir_1571810999_1e50_600x600.jpg" },
  { id: 2,  name: "Sofá 2 lugares",          cat: "Sofás e Poltronas", price: 1299, color: "bege",     size: "2 lugares",         rating: 4, reviews: 98,  img: "https://cdn.leroymerlin.com.br/products/sofa_3_lugares_linho_180cm_vicente_viero_moveis_1571863397_519a_600x600.jpg" },
  { id: 3,  name: "Sofá 3 lugares linho",    cat: "Sofás e Poltronas", price: 1499, color: "cinza",    size: "3 lugares",         rating: 4, reviews: 76,  img: "https://cdn.leroymerlin.com.br/products/sofa_3_lugares_retratil_amsterda_i_suede_preto_180_cm_1566995601_b0e9_600x600.jpg" },
  { id: 4,  name: "Sofá 4 lugares",          cat: "Sofás e Poltronas", price: 2499, color: "bege",     size: "4 lugares ou mais", rating: 4, reviews: 64,  img: "https://cdn.leroymerlin.com.br/products/sofa_4_lugares_living_com_chaise_esquerdo_pes_e_base_em_madei_1566995089_ec64_600x600.jpg" },
  { id: 5,  name: "Sofá 2 lugares veludo",   cat: "Sofás e Poltronas", price: 1199, color: "verde",    size: "2 lugares",         rating: 5, reviews: 41,  img: "https://cdn.leroymerlin.com.br/products/sofa_fixo_2_lugares_veludo_verde_premium_160cm_veludo_verde_1572618210_af97_600x600.jpg" },
  { id: 6,  name: "Sofá 3 lugares couro",    cat: "Sofás e Poltronas", price: 2899, color: "vermelho", size: "3 lugares",         rating: 5, reviews: 33,  img: "https://cdn.leroymerlin.com.br/products/sofa_living_istambul_3_lugares_revestimento_courino_sintetico_1571303714_4735_600x600.jpg" },
  { id: 7,  name: "Sofá-cama 3 lugares",     cat: "Sofás e Poltronas", price: 1999, color: "azul",     size: "3 lugares",         rating: 4, reviews: 58,  img: "https://cdn.leroymerlin.com.br/products/sofa_3_lugares_retratil_lubeck_suede_azul_marinho_180_cm_1569260312_704d_600x600.jpg" },
  { id: 8,  name: "Poltrona decorativa",     cat: "Sofás e Poltronas", price: 799,  color: "rosa",     size: "1 lugar",           rating: 4, reviews: 87,  img: "https://cdn.leroymerlin.com.br/products/poltrona_balance_exclusiva_boucle_premium_de_luxo_com_leve_ba_1572683007_aca6_600x600.jpg" },
  { id: 9,  name: "Puff estofado",           cat: "Estofados",         price: 249,  color: "bege",     size: "1 lugar",           rating: 4, reviews: 22,  img: "https://cdn.leroymerlin.com.br/products/puff_bruna_marrom_claro_1567010616_d579_600x600.jpg" },
  { id: 10, name: "Almofada decorativa",     cat: "Decoração",         price: 59,   color: "azul",     size: "1 lugar",           rating: 5, reviews: 140, img: "https://cdn.leroymerlin.com.br/products/almofada_gaudi_linho_azul_45x45cm_90261962_9543_1800x1800.jpg" },
  { id: 11, name: "Rack para sala",          cat: "Móveis",            price: 899,  color: "cinza",    size: "2 lugares",         rating: 4, reviews: 19,  img: "https://cdn.leroymerlin.com.br/products/rack_retro_madesa_reims_para_tv_ate_75_polegadas_pes_de_madei_1568014726_f85e_600x600.jpg" }
];

const $ = id => document.getElementById(id);
const search = $("search"), grid = $("grid"), strip = $("strip"), resultTitle = $("resultTitle");
const sort = $("sort"), price = $("price"), priceMax = $("priceMax");

let pickedColor = "";
let favorites = [];
let stripStart = 0;

const normalize = t => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const money = v => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
const checked = name => [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(c => c.value);
const stars = n => "★".repeat(n) + "☆".repeat(5 - n);

function update() {
  const text = normalize(search.value.trim());
  const cats = checked("category");
  const sizes = checked("size");

  const list = products.filter(p =>
    normalize(p.name).includes(text) &&
    (!cats.length || cats.includes(p.cat)) &&
    (!sizes.length || sizes.includes(p.size)) &&
    p.price <= +price.value &&
    (!pickedColor || p.color === pickedColor)
  );

  if (sort.value === "low") list.sort((a, b) => a.price - b.price);
  if (sort.value === "high") list.sort((a, b) => b.price - a.price);

  resultTitle.textContent = text ? `Resultados para "${search.value.trim()}"` : "Todos os produtos";
  priceMax.textContent = money(+price.value).replace(",00", "");

  renderCards(list);
  renderSimilar();
}

function renderCards(list) {
  if (!list.length) {
    grid.innerHTML = '<p class="empty">Nenhum produto encontrado. Tente mudar a busca ou os filtros.</p>';
    return;
  }
  grid.innerHTML = list.map((p, i) => `
    <div class="card">
      ${i === 0 && sort.value === "relevance" ? '<span class="badge">Mais parecido</span>' : ""}
      <button class="heart" data-fav="${p.id}">${favorites.includes(p.id) ? "♥" : "♡"}</button>
      <img src="${p.img}" alt="${p.name}">
      <h5>${p.name}</h5>
      <div class="stars">${stars(p.rating)} (${p.reviews})</div>
      <div class="price">${money(p.price)}</div>
      <div class="stock">Em estoque</div>
      <button class="btn" data-view="${p.id}">Ver detalhes</button>
    </div>`).join("");
}

function renderSimilar() {
  const sofas = products.filter(p => p.cat === "Sofás e Poltronas");
  strip.innerHTML = Array.from({ length: 5 }, (_, i) => {
    const p = sofas[(stripStart + i) % sofas.length];
    return `<div class="mini" data-name="${p.name}" title="${p.name}"><img src="${p.img}" alt="${p.name}"></div>`;
  }).join("");
}

if (grid) {
  search.addEventListener("input", update);
  sort.addEventListener("change", update);
  price.addEventListener("input", update);
  document.querySelectorAll('input[type="checkbox"]').forEach(c => c.addEventListener("change", update));

  document.querySelectorAll(".dot").forEach(dot => dot.addEventListener("click", () => {
    const wasActive = dot.classList.contains("active");
    document.querySelectorAll(".dot").forEach(d => d.classList.remove("active"));
    pickedColor = wasActive ? "" : dot.dataset.color;
    if (!wasActive) dot.classList.add("active");
    update();
  }));

  grid.addEventListener("click", e => {
    const { fav, view } = e.target.dataset;
    if (fav) {
      const id = +fav;
      favorites = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
      update();
    }
    if (view) {
      const p = products.find(x => x.id === +view);
      alert(`${p.name}\nPreço: ${money(p.price)}\nTamanho: ${p.size}\nCor: ${p.color}`);
    }
  });

  strip.addEventListener("click", e => {
    const mini = e.target.closest(".mini");
    if (mini) { search.value = mini.dataset.name; update(); }
  });

  $("next").addEventListener("click", () => { stripStart++; renderSimilar(); });
  $("prev").addEventListener("click", () => { stripStart = Math.max(0, stripStart - 1); renderSimilar(); });

  const q = new URLSearchParams(location.search).get("q");
  if (q) search.value = q;

  update();
}

const loginForm = $("loginForm");

if (loginForm) {
  const user = $("user"), pass = $("password"), remember = $("remember"), togglePass = $("togglePass");
  const userError = $("userError"), passError = $("passError");

  const validEmail = t => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t);

  function validCpf(t) {
    const n = t.replace(/\D/g, "");
    if (n.length !== 11 || /^(\d)\1+$/.test(n)) return false;
    for (let len = 9; len <= 10; len++) {
      let sum = 0;
      for (let i = 0; i < len; i++) sum += +n[i] * (len + 1 - i);
      if (((sum * 10) % 11) % 10 !== +n[len]) return false;
    }
    return true;
  }

  const setError = (field, el, msg) => {
    field.parentElement.classList.toggle("invalid", !!msg);
    el.textContent = msg;
  };

  togglePass.addEventListener("click", () => {
    const show = pass.type === "password";
    pass.type = show ? "text" : "password";
    togglePass.classList.toggle("on", show);
    togglePass.title = show ? "Ocultar senha" : "Mostrar senha";
  });

  user.addEventListener("input", () => {
    setError(user, userError, "");
    if (user.value && /^[\d.\-]*$/.test(user.value)) {
      user.value = user.value.replace(/\D/g, "").slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
  });
  pass.addEventListener("input", () => setError(pass, passError, ""));

  try {
    const saved = localStorage.getItem("lm_usuario");
    if (saved) { user.value = saved; remember.checked = true; }
  } catch {}

  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const u = user.value.trim();

    const userMsg = !u ? "Informe seu e-mail ou CPF."
      : !validEmail(u) && !validCpf(u) ? "Digite um e-mail ou CPF válido." : "";
    const passMsg = !pass.value ? "Informe sua senha."
      : pass.value.length < 4 ? "A senha deve ter pelo menos 4 caracteres." : "";

    setError(user, userError, userMsg);
    setError(pass, passError, passMsg);
    if (userMsg || passMsg) return;

    try {
      if (remember.checked) localStorage.setItem("lm_usuario", u);
      else localStorage.removeItem("lm_usuario");
      sessionStorage.setItem("lm_logado", u);
    } catch {}

    location.href = "inicio.html";
  });

  $("forgot").addEventListener("click", e => {
    e.preventDefault();
    alert("Enviaremos um link de redefinição para o seu e-mail cadastrado.");
  });
  $("qrBtn").addEventListener("click", () => alert("Aponte a câmera para o QR Code da loja para acessar."));
}

const featured = $("featured");

if (featured) {
  try {
    if (!sessionStorage.getItem("lm_logado")) location.href = "login.html";
  } catch {}

  featured.innerHTML = [1, 8, 5, 11, 9].map(id => {
    const p = products.find(x => x.id === id);
    return `
      <div class="card">
        <img src="${p.img}" alt="${p.name}">
        <h5>${p.name}</h5>
        <div class="stars">${stars(p.rating)} (${p.reviews})</div>
        <div class="price">${money(p.price)}</div>
        <span class="tag">${p.cat}</span>
      </div>`;
  }).join("");

  search.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const q = search.value.trim();
      location.href = "busca.html" + (q ? "?q=" + encodeURIComponent(q) : "");
    }
  });
}

const clearBtn = $("clear");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    search.value = "";
    search.focus();
    if (grid) update();
  });
}

const store = $("store");
if (store) {
  try {
    const saved = localStorage.getItem("lm_loja");
    if (saved) store.value = saved;
    store.addEventListener("change", () => localStorage.setItem("lm_loja", store.value));
  } catch {}
}

const menuBtn = $("menuBtn"), menuList = $("menuList");
if (menuBtn) {
  const setOpen = open => {
    menuList.hidden = !open;
    menuBtn.setAttribute("aria-expanded", open);
  };
  menuBtn.addEventListener("click", e => {
    e.stopPropagation();
    setOpen(menuList.hidden);
  });
  document.addEventListener("click", e => {
    if (!menuList.contains(e.target)) setOpen(false);
  });
}

const logout = $("logout");
if (logout) {
  logout.addEventListener("click", () => {
    try { sessionStorage.removeItem("lm_logado"); } catch {}
    location.href = "login.html";
  });
}
