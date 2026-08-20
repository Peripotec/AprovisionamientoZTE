// ─────────────────────────────────────────────────────────────────────────────
// Constantes de red (valores fijos de la OLT)
// ─────────────────────────────────────────────────────────────────────────────
const VOIP_MBPS     = 5;
const VOIP_KBPS     = VOIP_MBPS * 1024;   // 5120
const ASSURED_KBPS  = 15360;               // 950 Mbps ÷ 64 clientes ≈ 15 Mbps
const SIR_KBPS      = 35840;               // 2200 Mbps ÷ 64 clientes ≈ 35 Mbps
const CIR_UP_KBPS   = ASSURED_KBPS - VOIP_KBPS;  // 10240
const CIR_DOWN_KBPS = SIR_KBPS    - VOIP_KBPS;  // 30720
const CBS_PBS       = 1023;

// ─────────────────────────────────────────────────────────────────────────────
// Planes predeterminados [{ down, up }]  (bajada × subida en Mbps)
// ─────────────────────────────────────────────────────────────────────────────
const PLANES_DEFAULT = [
  { down: 100, up: 15  },
  { down: 150, up: 30  },
  { down: 300, up: 35  },
  { down: 300, up: 300 },
  { down: 500, up: 35  },
];

let planes = PLANES_DEFAULT.map(p => ({ ...p }));

// ─────────────────────────────────────────────────────────────────────────────
// Fórmulas de cálculo
// ─────────────────────────────────────────────────────────────────────────────

/** Maximum del profile tcont para un upstream dado en Mbps */
function calcTcontMax(upMbps) {
  return Math.round(((upMbps + VOIP_MBPS) * 1.1) * 1024);
}

/** PIR del profile traffic para un downstream dado en Mbps */
function calcTrafficPir(downMbps) {
  return Math.round(((downMbps + VOIP_MBPS) * 1.1) * 1024);
}

// ─────────────────────────────────────────────────────────────────────────────
// Resolución de nombres para traffic-profile
// Si una velocidad aparece tanto en UP como en DOWN de distintos planes,
// se agrega sufijo "U" (upstream) o "D" (downstream) para evitar conflictos.
// ─────────────────────────────────────────────────────────────────────────────
function getTrafficProfileNames() {
  const upSpeeds   = [...new Set(planes.map(p => p.up))];
  const downSpeeds = [...new Set(planes.map(p => p.down))];
  const conflicts  = new Set(upSpeeds.filter(s => downSpeeds.includes(s)));

  const upNames   = {};
  const downNames = {};

  for (const s of upSpeeds)   upNames[s]   = conflicts.has(s) ? `${s}MU` : `${s}M`;
  for (const s of downSpeeds) downNames[s] = conflicts.has(s) ? `${s}MD` : `${s}M`;

  return { upNames, downNames, conflicts };
}

// ─────────────────────────────────────────────────────────────────────────────
// Generadores de bloques de comandos
// ─────────────────────────────────────────────────────────────────────────────

function generateGponBlock() {
  const uniqueUps   = [...new Set(planes.map(p => p.up  ))].sort((a, b) => a - b);
  const uniqueDowns = [...new Set(planes.map(p => p.down))].sort((a, b) => a - b);

  const lines = [];
  lines.push('configure terminal');
  lines.push('gpon');
  lines.push('');

  // VOIP (siempre primero)
  lines.push(`  profile tcont VOIP type 1 assured ${VOIP_KBPS} maximum ${VOIP_KBPS}`);
  lines.push('');

  // tcont por plan (Upstream)
  for (const up of uniqueUps) {
    const max = calcTcontMax(up);
    lines.push(`  profile tcont ${up}UP type 3 assured ${ASSURED_KBPS} maximum ${max}`);
  }
  lines.push('');

  // profile traffic VOIP
  lines.push(`  profile traffic VOIP sir ${VOIP_KBPS} pir ${VOIP_KBPS} cbs ${CBS_PBS} pbs ${CBS_PBS}`);
  lines.push('');

  // profile traffic por plan (Downstream)
  for (const down of uniqueDowns) {
    const pir = calcTrafficPir(down);
    lines.push(`  profile traffic ${down}DOWN sir ${SIR_KBPS} pir ${pir} cbs ${CBS_PBS} pbs ${CBS_PBS}`);
  }

  lines.push('');
  lines.push('exit');

  return lines.join('\n');
}

function generateTrafficBlock() {
  const { upNames, downNames } = getTrafficProfileNames();
  const uniqueUps   = [...new Set(planes.map(p => p.up  ))].sort((a, b) => a - b);
  const uniqueDowns = [...new Set(planes.map(p => p.down))].sort((a, b) => a - b);

  const lines = [];

  // VOIP traffic-profile
  lines.push(`traffic-profile VOIP ip cir ${VOIP_KBPS} cbs ${CBS_PBS} pir ${VOIP_KBPS} pbs ${CBS_PBS}`);
  lines.push('');

  // Upstream
  for (const up of uniqueUps) {
    const name = upNames[up];
    const pir  = up * 1024;
    lines.push(`traffic-profile ${name} ip cir ${CIR_UP_KBPS} cbs ${CBS_PBS} pir ${pir} pbs ${CBS_PBS}`);
  }
  lines.push('');

  // Downstream
  for (const down of uniqueDowns) {
    const name = downNames[down];
    const pir  = down * 1024;
    lines.push(`traffic-profile ${name} ip cir ${CIR_DOWN_KBPS} cbs ${CBS_PBS} pir ${pir} pbs ${CBS_PBS}`);
  }

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Interacción: Agregar / Eliminar / Reset planes
// ─────────────────────────────────────────────────────────────────────────────

function agregarPlan() {
  const input = document.getElementById('input-plan');
  const val   = input.value.trim().toLowerCase();
  const match = val.match(/^(\d+)[x×*](\d+)$/);

  if (!match) {
    alert('Formato inválido.\nUsá: bajada×subida  — Ej: 300x35');
    return;
  }

  const down = parseInt(match[1], 10);
  const up   = parseInt(match[2], 10);

  if (down <= 0 || up <= 0 || down > 10000 || up > 10000) {
    alert('Valores de velocidad fuera de rango permitido.');
    return;
  }

  if (planes.some(p => p.down === down && p.up === up)) {
    alert('Ese plan ya está en la lista.');
    return;
  }

  planes.push({ down, up });
  input.value = '';
  render();
}

function eliminarPlan(idx) {
  planes.splice(idx, 1);
  render();
}

function resetPlanes() {
  planes = PLANES_DEFAULT.map(p => ({ ...p }));
  render();
}

// ─────────────────────────────────────────────────────────────────────────────
// Copiar al portapapeles con feedback visual
// ─────────────────────────────────────────────────────────────────────────────

function copiarBloque(blockId) {
  const text = document.getElementById(blockId).textContent;

  const doFeedback = () => {
    const msg = document.createElement('div');
    msg.textContent = '✓ Copiado';
    Object.assign(msg.style, {
      position: 'fixed', bottom: '24px', right: '24px',
      background: 'rgba(30,30,30,0.85)', color: '#fff',
      padding: '10px 18px', borderRadius: '6px',
      fontFamily: 'Tahoma', fontSize: '13px', zIndex: '9999'
    });
    document.body.appendChild(msg);
    setTimeout(() => {
      let op = 1;
      const fade = setInterval(() => {
        op -= 0.1;
        msg.style.opacity = op;
        if (op <= 0) { clearInterval(fade); msg.remove(); }
      }, 80);
    }, 700);
  };

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(doFeedback).catch(() => fallbackCopy(text, doFeedback));
  } else {
    fallbackCopy(text, doFeedback);
  }
}

function fallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity  = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand('copy'); cb(); } catch (e) { alert('No se pudo copiar.'); }
  document.body.removeChild(ta);
}

// ─────────────────────────────────────────────────────────────────────────────
// Render
// ─────────────────────────────────────────────────────────────────────────────

function renderTags() {
  const container = document.getElementById('planes-tags');
  container.innerHTML = '<span class="plan-tag voip-tag">VOIP (fijo)</span>';

  planes.forEach((p, i) => {
    const tag = document.createElement('span');
    tag.className = 'plan-tag';
    tag.innerHTML =
      `${p.down}↓ × ${p.up}↑ Mbps ` +
      `<span class="remove-btn" title="Eliminar plan" onclick="eliminarPlan(${i})">✕</span>`;
    container.appendChild(tag);
  });
}

function renderTabla() {
  const { upNames, downNames, conflicts } = getTrafficProfileNames();

  const conflictBadge = '<span class="badge-conflict">conflicto</span>';

  let html = `
    <table class="ref-table">
      <thead>
        <tr>
          <th>Plan (↓×↑)</th>
          <th>tcont (gpon UP)</th>
          <th>max kbps</th>
          <th>profile traffic (gpon DOWN)</th>
          <th>pir kbps</th>
          <th>traffic-profile UP</th>
          <th>pir UP kbps</th>
          <th>traffic-profile DOWN</th>
          <th>pir DOWN kbps</th>
        </tr>
      </thead>
      <tbody>
        <tr class="voip-row">
          <td>VOIP</td>
          <td>VOIP (type 1)</td>
          <td>${VOIP_KBPS}</td>
          <td>VOIP</td>
          <td>${VOIP_KBPS}</td>
          <td>VOIP</td>
          <td>${VOIP_KBPS}</td>
          <td>VOIP</td>
          <td>${VOIP_KBPS}</td>
        </tr>`;

  planes.forEach(p => {
    const tcontMax  = calcTcontMax(p.up);
    const trafficPir = calcTrafficPir(p.down);
    const upName    = upNames[p.up];
    const downName  = downNames[p.down];
    const upConf    = conflicts.has(p.up)   ? conflictBadge : '';
    const downConf  = conflicts.has(p.down) ? conflictBadge : '';

    html += `
        <tr>
          <td><strong>${p.down}×${p.up} Mbps</strong></td>
          <td>${p.up}UP</td>
          <td>${tcontMax}</td>
          <td>${p.down}DOWN</td>
          <td>${trafficPir}</td>
          <td>${upName}${upConf}</td>
          <td>${p.up * 1024}</td>
          <td>${downName}${downConf}</td>
          <td>${p.down * 1024}</td>
        </tr>`;
  });

  html += '</tbody></table>';
  document.getElementById('tabla-referencia').innerHTML = html;
}

function render() {
  renderTags();

  const gponText    = generateGponBlock();
  const trafficText = generateTrafficBlock();
  const fullText    = gponText + '\n\n' + trafficText;

  document.getElementById('block-gpon').textContent     = gponText;
  document.getElementById('block-traffic').textContent  = trafficText;
  document.getElementById('block-completo').textContent = fullText;

  renderTabla();
}

// ─────────────────────────────────────────────────────────────────────────────
// Inicialización
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('input-plan').addEventListener('keydown', e => {
    if (e.key === 'Enter') agregarPlan();
  });
  render();
});
