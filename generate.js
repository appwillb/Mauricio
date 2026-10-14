const fs = require("fs");
const path = require("path");
const { Resvg } = require("@resvg/resvg-js");

const W = 1080;
const H = 1920;
const FONTS = [
  "Poppins-Regular.ttf",
  "Poppins-Medium.ttf",
  "Poppins-SemiBold.ttf",
  "Poppins-Bold.ttf",
  "Poppins-ExtraBold.ttf",
  "Poppins-Black.ttf",
  "Anton-Regular.ttf",
].map((f) => path.join(__dirname, "assets", "fonts", f));

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function shell({ defs, body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>${defs}
<filter id="grain" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
  <feColorMatrix type="saturate" values="0"/>
</filter>
</defs>
${body}
<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.05" style="mix-blend-mode:overlay"/>
</svg>`;
}

function grad(id, stops, coords = "0% 0%, 100% 100%") {
  const [x1, y1] = coords[0].split(" ");
  const [x2, y2] = coords[1].split(" ");
  return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops
    .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`)
    .join("")}</linearGradient>`;
}

function blob(cx, cy, r, color, opacity) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity}" filter="url(#soft)"/>`;
}

const softBlur = `<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="120"/></filter>`;

function badge(x, y, label, { fill = "#ffffff", ink = "#12103a", w = null } = {}) {
  const width = w || label.length * 17 + 56;
  return `<g transform="translate(${x},${y})">
<rect width="${width}" height="64" rx="32" fill="${fill}" opacity="0.95"/>
<text x="${width / 2}" y="42" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="26" letter-spacing="4" fill="${ink}">${esc(label)}</text>
</g>`;
}

function card(x, y, w, h, n, lines, accent) {
  const rows = lines
    .map(
      (l, i) =>
        `<text x="${x + 148}" y="${y + 96 + i * 52}" font-family="Poppins" font-weight="${i === 0 ? 700 : 500}" font-size="${i === 0 ? 42 : 34}" fill="#ffffff" opacity="${i === 0 ? 1 : 0.82}">${esc(l)}</text>`
    )
    .join("");
  return `<g>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="40" fill="#ffffff" fill-opacity="0.14" stroke="#ffffff" stroke-opacity="0.3" stroke-width="2"/>
<circle cx="${x + 76}" cy="${y + h / 2}" r="38" fill="${accent}"/>
<text x="${x + 76}" y="${y + h / 2 + 14}" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="38" fill="#0d0b26">${esc(n)}</text>
${rows}
</g>`;
}

function handle(x, y, text, anchor = "start") {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Poppins" font-weight="600" font-size="34" fill="#ffffff" opacity="0.9" letter-spacing="1">${esc(text)}</text>`;
}

function cta(x, y, w, label, { fill = "#ffffff", ink = "#12103a" } = {}) {
  return `<g transform="translate(${x},${y})">
<rect width="${w}" height="104" rx="52" fill="${fill}"/>
<text x="${w / 2}" y="66" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="36" letter-spacing="2" fill="${ink}">${esc(label)}</text>
</g>`;
}

function lines(x, y, arr, { size = 88, weight = 800, lh = 1.06, fill = "#ffffff", opacity = 1, anchor = "start", family = "Poppins" } = {}) {
  return arr
    .map(
      (t, i) =>
        `<text x="${x}" y="${y + i * size * lh}" text-anchor="${anchor}" font-family="${family}" font-weight="${weight}" font-size="${size}" fill="${fill}" fill-opacity="${opacity}">${esc(t)}</text>`
    )
    .join("");
}

const templates = {
  "01-habitos": () => {
    const defs =
      grad("bg", [
        ["0%", "#7c2ae8"],
        ["45%", "#e84393"],
        ["100%", "#ff8f3c"],
      ], ["0% 0%", "100% 100%"]) + softBlur;
    const body = `
<rect width="${W}" height="${H}" fill="url(#bg)"/>
${blob(980, 240, 300, "#ffd166", 0.5)}
${blob(90, 1500, 340, "#2af598", 0.35)}
<g>
${badge(90, 200, "DICA 01")}
${handle(990, 244, "@seuperfil", "end")}
${lines(90, 430, ["3 HÁBITOS", "QUE MUDAM", "SEU PERFIL"], { size: 118, weight: 800 })}
<text x="90" y="800" font-family="Poppins" font-weight="500" font-size="40" fill="#ffffff" opacity="0.9">Leva 10 minutos por dia. Começa hoje.</text>
${card(90, 900, 900, 210, "1", ["Poste no horário", "de pico do seu público"], "#ffd166")}
${card(90, 1150, 900, 210, "2", ["Responda comentários", "na primeira hora"], "#7bed9f")}
${card(90, 1400, 900, 210, "3", ["Salve os ganchos", "que mais performaram"], "#70a1ff")}
${cta(90, 1690, 560, "SALVE AGORA")}
${handle(990, 1755, "arraste pra cima", "end")}
</g>`;
    return shell({ defs, body });
  },

  "02-erro-comum": () => {
    const defs =
      grad("bg", [
        ["0%", "#0f2027"],
        ["50%", "#1b6ca8"],
        ["100%", "#6a3df0"],
      ], ["0% 100%", "100% 0%"]) + softBlur;
    const body = `
<rect width="${W}" height="${H}" fill="url(#bg)"/>
${blob(140, 300, 320, "#00d2ff", 0.4)}
${blob(960, 1450, 360, "#f857a6", 0.45)}
<g>
${badge(90, 200, "ERRO COMUM", { fill: "#ffd166", ink: "#12103a" })}
${handle(990, 244, "@seuperfil", "end")}
${lines(90, 470, ["VOCÊ ESTÁ", "POSTANDO", "SEM PLANO"], { size: 122, weight: 800 })}
<rect x="90" y="770" width="760" height="10" rx="5" fill="#00d2ff"/>
${lines(90, 900, ["COMECE POR AQUI"], { size: 40, weight: 600, opacity: 0.75 })}
${card(90, 980, 900, 200, "→", ["Defina 3 pilares", "e fuja do improviso"], "#00d2ff")}
${card(90, 1220, 900, 200, "→", ["Grave 5 vídeos", "em um único dia"], "#7bed9f")}
${card(90, 1460, 900, 200, "→", ["Analise o alcance", "toda sexta-feira"], "#ffd166")}
${cta(90, 1740, 620, "COMECE HOJE", { fill: "#ffd166", ink: "#0d0b26" })}
</g>`;
    return shell({ defs, body });
  },

  "03-conteudo-que-vende": () => {
    const defs =
      grad("bg", [
        ["0%", "#0575e6"],
        ["55%", "#00f260"],
        ["100%", "#ffd200"],
      ], ["100% 0%", "0% 100%"]) + softBlur;
    const body = `
<rect width="${W}" height="${H}" fill="url(#bg)"/>
${blob(900, 350, 320, "#ffffff", 0.28)}
${blob(120, 1350, 340, "#ff6b6b", 0.4)}
<g>
${badge(90, 200, "FÓRMULA 03")}
${handle(990, 244, "@seuperfil", "end")}
${lines(90, 460, ["CONTEÚDO", "QUE VENDE", "SEM SER", "GOLPE"], { size: 116, weight: 800, lh: 1.04 })}
${card(90, 1000, 900, 210, "1", ["Gancho de 3 segundos", "antes de qualquer coisa"], "#ffffff")}
${card(90, 1250, 900, 210, "2", ["Prova social:", "mostre resultado real"], "#ffd166")}
${card(90, 1500, 900, 210, "3", ["CTA claro:", "um passo só, agora"], "#7bed9f")}
${cta(90, 1780, 640, "SALVE + COMPARTILHE")}
</g>`;
    return shell({ defs, body });
  },
};

const outDir = path.join(__dirname, "flyers");
fs.mkdirSync(outDir, { recursive: true });

for (const [name, make] of Object.entries(templates)) {
  const svg = make();
  const resvg = new Resvg(svg, {
    font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: "Poppins" },
    fitTo: { mode: "width", value: W },
  });
  const png = resvg.render().asPng();
  const file = path.join(outDir, `${name}.png`);
  fs.writeFileSync(file, png);
  console.log(`${file}  ${png.length} bytes`);
}
