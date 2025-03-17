// Función global para procesar datos según la pestaña
window.processData = function(tabNumber, input, placaPuerto) {
  switch (tabNumber) {
    case '1':
      return processONUs(input, placaPuerto);
    case '2':
      return processGPONOLT(input, placaPuerto);
    case '3':
      return processGPONONU(input, placaPuerto);
    default:
      return { comandos: "", errores: "Pestaña no válida", total: 0, procesadas: 0, conErrores: 0 };
  }
};

// Procesar ONUs (TAB 1)
function processONUs(input, placaPuerto) {
  const lines = input.split("\n").map(l => l.trim()).filter(l => l !== "");
  let comandos = "";
  let errores = "";
  let total = lines.length;
  let procesadas = 0;
  let conErrores = 0;

  const [placa, puerto] = placaPuerto.split('/'); // Divide "1/16" en ["1", "16"]

  lines.forEach((line, idx) => {
    const parts = line.split(" ");
    if (parts.length >= 6 && parts[0].toLowerCase() === "onu" && parts[2].toLowerCase() === "type" && parts[4].toLowerCase() === "sn") {
      comandos += "configure terminal\n";
      comandos += `interface gpon-olt_${placa}/${puerto}/16\n`; // Usa placa y puerto dinámicamente
      comandos += line + "\n";
      comandos += "exit\n\n";
      procesadas++;
    } else {
      conErrores++;
      errores += `[Línea ${idx + 1}]: ${line} - Formato incorrecto\n`;
    }
  });

  return { comandos, errores, total, procesadas, conErrores };
}

// Procesar gpon-olt (TAB 2)
function processGPONOLT(input, placaPuerto) {
  const lines = input.split("\n").map(l => l.trim()).filter(l => l !== "");
  let comandos = "";
  let errores = "";
  let total = lines.length;
  let procesadas = 0;
  let conErrores = 0;

  const [placa, puerto] = placaPuerto.split('/');

  lines.forEach((line, idx) => {
    if (line.toLowerCase().startsWith(`interface gpon-olt_${placa}/${puerto}/`)) {
      comandos += line + "\n";
      procesadas++;
    } else if (line === "!") {
      comandos += line + "\n";
    } else {
      conErrores++;
      errores += `[Línea ${idx + 1}]: ${line} - No válida para gpon-olt_${placa}/${puerto}\n`;
    }
  });

  return { comandos, errores, total, procesadas, conErrores };
}

// Procesar gpon-onu (TAB 3)
function processGPONONU(input, placaPuerto) {
  const lines = input.split("\n").map(l => l.trim()).filter(l => l !== "");
  let comandos = "";
  let errores = "";
  let total = lines.length;
  let procesadas = 0;
  let conErrores = 0;

  const [placa, puerto] = placaPuerto.split('/');

  lines.forEach((line, idx) => {
    if (line.toLowerCase().startsWith(`interface gpon-onu_${placa}/${puerto}/`)) {
      comandos += line + "\n";
      procesadas++;
    } else if (line === "!") {
      comandos += line + "\n";
    } else {
      conErrores++;
      errores += `[Línea ${idx + 1}]: ${line} - No válida para gpon-onu_${placa}/${puerto}\n`;
    }
  });

  return { comandos, errores, total, procesadas, conErrores };
}