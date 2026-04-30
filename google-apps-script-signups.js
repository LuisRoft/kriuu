/* eslint-disable @typescript-eslint/no-unused-vars */

const SHEET_ID = '1ad4uXgRf4sY1cUiu8opQAzn3rmjeZra4uAIyEAad7_M';
const SHEET_NAME = 'Hoja 1';
const SECRET_TOKEN = 'kriuu_form_2026';
const HEADERS = [
  'Fecha',
  'Nombres',
  'Apellidos',
  'Edad',
  'Género',
  'Ciudad',
  'Parroquia / sector',
  'Correo',
  'Teléfono / WhatsApp',
  'Situación actual',
  'Carrera o profesión',
  'Áreas de interés',
  'Cómo nos conoció',
  'Detalle otro medio',
  'Aceptó uso de datos',
  'Aceptó código de conducta',
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse(false, 'No data received.');
    }

    const data = JSON.parse(e.postData.contents);

    if (data.token !== SECRET_TOKEN) {
      return jsonResponse(false, 'Unauthorized request.');
    }

    if (data.website && data.website.trim() !== '') {
      return jsonResponse(false, 'Spam detected.');
    }

    const requiredFields = [
      'nombres',
      'apellidos',
      'edad',
      'genero',
      'ciudad',
      'parroquia',
      'correo',
      'telefono',
      'situacion',
      'carrera',
      'referido',
    ];

    for (const field of requiredFields) {
      if (!data[field] || String(data[field]).trim() === '') {
        return jsonResponse(false, `Missing required field: ${field}`);
      }
    }

    if (data.acepta !== true) {
      return jsonResponse(false, 'Consent is required.');
    }

    if (data.aceptaCodigoConducta !== true) {
      return jsonResponse(false, 'Code of conduct acceptance is required.');
    }

    if (!isValidEmail(data.correo)) {
      return jsonResponse(false, 'Invalid email address.');
    }

    const age = Number(data.edad);

    if (!Number.isInteger(age) || age < 12 || age > 80) {
      return jsonResponse(false, 'Invalid age.');
    }

    if (!Array.isArray(data.intereses) || data.intereses.length === 0) {
      return jsonResponse(false, 'Select at least one interest area.');
    }

    if (
      data.referido === 'Otro medio' &&
      (!data.otroMedio || data.otroMedio.trim() === '')
    ) {
      return jsonResponse(false, 'Please specify the referral source.');
    }

    const lock = LockService.getScriptLock();

    if (!lock.tryLock(10000)) {
      return jsonResponse(false, 'The server is busy. Please try again.');
    }

    try {
      const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

      if (!sheet) {
        return jsonResponse(false, 'Target sheet was not found.');
      }

      ensureHeaders(sheet);

      const lastRow = sheet.getLastRow();

      if (lastRow > 1) {
        const emails = sheet
          .getRange(2, 8, lastRow - 1, 1)
          .getValues()
          .flat()
          .map((email) => String(email).toLowerCase().trim());

        if (emails.includes(String(data.correo).toLowerCase().trim())) {
          return jsonResponse(false, 'This email is already registered.');
        }
      }

      sheet.appendRow([
        new Date(),
        clean(data.nombres),
        clean(data.apellidos),
        age,
        clean(data.genero),
        clean(data.ciudad),
        clean(data.parroquia),
        clean(data.correo).toLowerCase(),
        clean(data.telefono),
        clean(data.situacion),
        clean(data.carrera),
        data.intereses.map(clean).join(', '),
        clean(data.referido),
        clean(data.otroMedio || data.referidoDetalle || ''),
        data.acepta === true ? 'Sí' : 'No',
        data.aceptaCodigoConducta === true ? 'Sí' : 'No',
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse(true, 'Signup saved successfully.');
  } catch (error) {
    return jsonResponse(false, `Internal error: ${error.toString()}`);
  }
}

function doGet() {
  return jsonResponse(true, 'Kriuu signup endpoint is active. Use POST with JSON.');
}

function jsonResponse(ok, message) {
  return ContentService
    .createTextOutput(
      JSON.stringify({
        ok,
        success: ok,
        message,
        error: ok ? '' : message,
      }),
    )
    .setMimeType(ContentService.MimeType.JSON);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function clean(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ');
}

function ensureHeaders(sheet) {
  const existingHeaders = sheet
    .getRange(1, 1, 1, HEADERS.length)
    .getValues()[0]
    .map(clean);

  const needsHeaders = HEADERS.some(
    (header, index) => existingHeaders[index] !== header,
  );

  if (needsHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}
