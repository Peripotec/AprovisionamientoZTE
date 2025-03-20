document.addEventListener("DOMContentLoaded", function() {
    /* ---------- Manejo de Pestañas ---------- */
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tabcontent");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const tabId = btn.getAttribute("data-tab");
        tabBtns.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(tabId).classList.add("active");
      });
    });
  
    /* ---------- CodeMirror: Inicialización de editores ---------- */
    // TAB 1
    const cmError1 = CodeMirror.fromTextArea(document.getElementById("errorData1"), {
      lineNumbers: true,
      mode: "text/plain",
      readOnly: true,
      theme: "material-darker"
    });
    const cmInput1 = CodeMirror.fromTextArea(document.getElementById("inputData1"), {
      lineNumbers: true,
      mode: "text/plain",
      theme: "material-darker"
    });
    const cmOutput1 = CodeMirror.fromTextArea(document.getElementById("outputData1"), {
      lineNumbers: true,
      mode: "text/plain",
      readOnly: true,
      theme: "material-darker"
    });
  
    // TAB 2
    const cmError2 = CodeMirror.fromTextArea(document.getElementById("errorData2"), {
      lineNumbers: true,
      mode: "text/plain",
      readOnly: true,
      theme: "material-darker"
    });
    const cmInput2 = CodeMirror.fromTextArea(document.getElementById("inputData2"), {
      lineNumbers: true,
      mode: "text/plain",
      theme: "material-darker"
    });
    const cmOutput2 = CodeMirror.fromTextArea(document.getElementById("outputData2"), {
      lineNumbers: true,
      mode: "text/plain",
      readOnly: true,
      theme: "material-darker"
    });
  
    // TAB 3
    const cmError3 = CodeMirror.fromTextArea(document.getElementById("errorData3"), {
      lineNumbers: true,
      mode: "text/plain",
      readOnly: true,
      theme: "material-darker"
    });
    const cmInput3 = CodeMirror.fromTextArea(document.getElementById("inputData3"), {
      lineNumbers: true,
      mode: "text/plain",
      theme: "material-darker"
    });
    const cmOutput3 = CodeMirror.fromTextArea(document.getElementById("outputData3"), {
      lineNumbers: true,
      mode: "text/plain",
      readOnly: true,
      theme: "material-darker"
    });
  
    /* ---------- Funciones de Procesamiento ---------- */
    // Ejemplo de validación para TAB 1
    document.getElementById("processBtn1").addEventListener("click", function(){
      const lines = cmInput1.getValue().split("\n").map(l => l.trim()).filter(l => l !== "");
      let validOutput = "";
      let errorOutput = "";
      let validCount = 0;
      let invalidCount = 0;
      lines.forEach((line, idx) => {
        // Ejemplo: Se espera que la línea empiece con "onu"
        if (!line.toLowerCase().startsWith("onu")) {
          invalidCount++;
          errorOutput += `[Línea ${idx+1}]: ${line}\n`;
        } else {
          // Aquí formatea el comando de migración (ejemplo)
          validOutput += "configure terminal\n";
          validOutput += `interface gpon-olt_1/16/16\n`; // Aquí podrías usar una variable común si es necesario
          validOutput += line + "\n";
          validOutput += "exit\n\n";
          validCount++;
        }
      });
      cmOutput1.setValue(validOutput);
      cmError1.setValue(errorOutput);
      document.getElementById("summary1").textContent = `ONUs configuradas: ${validCount}, Líneas inválidas: ${invalidCount}`;
    });
  
    // TAB 2 (Ejemplo)
    document.getElementById("processBtn2").addEventListener("click", function(){
      const lines = cmInput2.getValue().split("\n").map(l => l.trim()).filter(l => l !== "");
      let validOutput = "";
      let errorOutput = "";
      let validCount = 0;
      let invalidCount = 0;
      lines.forEach((line, idx) => {
        if (line.toLowerCase().startsWith("interface")) {
          validOutput += line + "\n";
          validCount++;
        } else if (line === "!") {
          // se omite
        } else {
          invalidCount++;
          errorOutput += `[Línea ${idx+1}]: ${line}\n`;
        }
      });
      cmOutput2.setValue(validOutput);
      cmError2.setValue(errorOutput);
      document.getElementById("summary2").textContent = `Bloques procesados: ${validCount}, Líneas inválidas: ${invalidCount}`;
    });
  
    // TAB 3 (Ejemplo)
    document.getElementById("processBtn3").addEventListener("click", function(){
      const lines = cmInput3.getValue().split("\n").map(l => l.trim()).filter(l => l !== "");
      let validOutput = "";
      let errorOutput = "";
      let validCount = 0;
      let invalidCount = 0;
      lines.forEach((line, idx) => {
        if (line.toLowerCase().startsWith("interface")) {
          validOutput += line + "\n";
          validCount++;
        } else if (line === "!") {
          // se omite
        } else {
          invalidCount++;
          errorOutput += `[Línea ${idx+1}]: ${line}\n`;
        }
      });
      cmOutput3.setValue(validOutput);
      cmError3.setValue(errorOutput);
      document.getElementById("summary3").textContent = `Bloques procesados: ${validCount}, Líneas inválidas: ${invalidCount}`;
    });
  
    /* ---------- Botones de Limpieza y Copiado ya están definidos en cada tab arriba ---------- */
    document.getElementById("clearBtn1").addEventListener("click", function(){
      cmInput1.setValue("");
      cmOutput1.setValue("");
      cmError1.setValue("");
      document.getElementById("summary1").textContent = "";
    });
    document.getElementById("copyBtn1").addEventListener("click", function(){
      copyToClipboard(cmOutput1.getValue());
    });
    document.getElementById("clearBtn2").addEventListener("click", function(){
      cmInput2.setValue("");
      cmOutput2.setValue("");
      cmError2.setValue("");
      document.getElementById("summary2").textContent = "";
    });
    document.getElementById("copyBtn2").addEventListener("click", function(){
      copyToClipboard(cmOutput2.getValue());
    });
    document.getElementById("clearBtn3").addEventListener("click", function(){
      cmInput3.setValue("");
      cmOutput3.setValue("");
      cmError3.setValue("");
      document.getElementById("summary3").textContent = "";
    });
    document.getElementById("copyBtn3").addEventListener("click", function(){
      copyToClipboard(cmOutput3.getValue());
    });
  
    /* ---------- Modo Oscuro (si no se incluye desde common.js) ---------- */
    window.toggleDarkMode = function() {
      document.body.classList.toggle("dark-mode");
    };
  
    /* Función para copiar al portapapeles (puedes reutilizar la de common.js) */
    window.copyToClipboard = function(text) {
      const tempTextArea = document.createElement("textarea");
      tempTextArea.value = text;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      document.execCommand("copy");
      document.body.removeChild(tempTextArea);
      // Muestra mensaje de copiado
      const copyMsg = document.getElementById("copyMsg");
      copyMsg.style.opacity = 1;
      setTimeout(() => { copyMsg.style.opacity = 0; }, 1500);
    };
  
  });
  