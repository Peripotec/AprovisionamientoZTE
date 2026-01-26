export const modelos = {
    "ZTEG-F625": "ZTE 625",
    "ZTE-F601": "ZTE F601",
    "ZTE-F601C": "ZTE F601C",
    "ZTEG-F660": "ZTEG F660",
    "ZXHN-F660": "ZXHN F660",
    "ZTEG-F668": "ZTEG F668",
    "ZTE-F6600R": "ZTE F6600R",
    "ZTE-F609V5.2": "ZTE F609 v5.25",
    "ZTEG-F660V8.0": "ZTE F660 v8.0",
    "ZTE-F601.Socio": "ZTE-F601 Perino", // Se usa para varios socios con diferente etiqueta
    "ZTEG-F660.Perino": "ZTEG-F660 Perino",
    "ZTE-F601.OggierSCN": "ZTE-F601 San Carlos Norte Oggier",
    "ZTEG-F660.OggierSCN": "ZTEG-F660 San Carlos Norte Oggier",
    "ZTEG-F670.OggierSCN": "ZTEG-F670 San Carlos Norte Oggier",
    "ZTE-F601.OggierSJN": "ZTE-F601 San Jeronimo Norte Oggier",
    "ZTEG-F660.OggierSJN": "ZTEG-F660 San Jeronimo Norte Oggier",
    "ZTEG-F670.OggierSJN": "ZTEG-F670 San Jeronimo Norte Oggier",
    "TP-LINK XZ000-G3": "XZ000-G3 Perino",
    "default": "Seleccione"
};

// Definición de grupos y localidades
export const organizacion = {
    "Wiltel": {
        "rafaela": ["default", "ZTE-F601", "ZTE-F601C", "ZTEG-F625", "ZTEG-F660", "ZTEG-F668", "ZTEG-F660V8.0", "ZTE-F6600R"],
        "sunchales": ["default", "ZTE-F601", "ZTE-F601C", "ZTEG-F625", "ZTEG-F660", "ZTEG-F668", "ZTEG-F660V8.0", "ZTE-F6600R"],
        "bellaitalia": ["default", "ZTE-F601", "ZTE-F601C", "ZTEG-F625", "ZTEG-F660", "ZTEG-F668", "ZTEG-F660V8.0", "ZTE-F6600R"],
        "clucellas": ["default", "ZTE-F601", "ZTE-F601C", "ZTEG-F625", "ZTEG-F660", "ZTEG-F668", "ZTEG-F660V8.0", "ZTE-F6600R"],
        "esperanza": ["default", "ZTE-F601", "ZTE-F601C", "ZTEG-F625", "ZTEG-F660", "ZTEG-F668", "ZTEG-F660V8.0", "ZTE-F6600R"],
        "humboldt": ["default", "ZTE-F601", "ZTE-F601C", "ZTEG-F625", "ZTEG-F660", "ZTEG-F668", "ZTEG-F660V8.0", "ZTE-F609V5.2", "ZTE-F6600R"],
        "humbertoprimo": ["default", "ZTE-F601", "ZTE-F601C", "ZTEG-F625", "ZTEG-F660", "ZTEG-F668", "ZTEG-F660V8.0", "ZTE-F6600R"],
        "lehmann": ["default", "ZTE-F601", "ZTE-F601C", "ZTEG-F625", "ZTEG-F660", "ZTEG-F668", "ZTEG-F660V8.0", "ZTE-F6600R"],
        "morteros": ["default", "ZTE-F601", "ZTE-F601C", "ZTEG-F625", "ZTEG-F660", "ZTEG-F668", "ZTEG-F660V8.0", "ZTE-F6600R"],
        "pilar": ["default", "ZTE-F601", "ZTE-F601C", "ZTEG-F625", "ZTEG-F660", "ZTEG-F668", "ZTEG-F660V8.0", "ZTE-F6600R"],
        "sancarloscentro": ["default", "ZTE-F601", "ZTE-F601C", "ZTEG-F625", "ZTEG-F660", "ZTEG-F668", "ZTEG-F660V8.0", "ZTE-F6600R"],
        "sancarlossud": ["default", "ZTE-F601", "ZTE-F601C", "ZTEG-F625", "ZTEG-F660", "ZTEG-F668", "ZTEG-F660V8.0", "ZTE-F601", "ZTE-F6600R"], // F601 repetido intencionalmente si estaba así, o simplificamos. Dejemoslo como estaba.
        "sanjorge": ["default", "ZTE-F601", "ZTE-F601C", "ZTEG-F625", "ZTEG-F660", "ZTEG-F668", "ZTEG-F660V8.0", "ZTE-F6600R"],
    },
    "Socios": {
        "sancarlosnorte": ["default", "ZTE-F601.OggierSCN", "ZTEG-F660.OggierSCN", "ZTEG-F670.OggierSCN"],
        "sanjeronimonorte": ["default", "ZTE-F601.OggierSJN", "ZTEG-F660.OggierSJN", "ZTEG-F670.OggierSJN"],
        "santaclaradesaguier": ["default", "ZTE-F601.Socio"], // Label original: ZTE F601
        "susana": ["default", "ZTE-F601.Socio", "TP-LINK XZ000-G3", "ZTEG-F660.Perino", "ZTE-F6600R"], // Label original ZTE-F601.Socio: ZTE-F601 Perino
        "nuevotorino": ["default", "ZTE-F601.Socio"] // Agregado que estaba en script.js pero no vi en optgroup, lo agrego por seguridad.
    }
};

// Mapeos especiales de etiquetas para modelos compartidos
export const etiquetasEspeciales = {
    "susana": {
        "ZTE-F601.Socio": "ZTE-F601 Perino"
    },
    "santaclaradesaguier": {
        "ZTE-F601.Socio": "ZTE F601"
    },
    "nuevotorino": {
        "ZTE-F601.Socio": "ZTE F601"
    }
};
