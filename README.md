# Kriuu

Sitio web de Kriuu construido con Next.js.

## Desarrollo

Instala dependencias y levanta el servidor local:

```bash
pnpm install
pnpm dev
```

Abre `http://localhost:3000`.

## Variables De Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_KRIUU_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
NEXT_PUBLIC_KRIUU_FORM_TOKEN=YOUR_FORM_TOKEN
```

Estas variables usan `NEXT_PUBLIC_` porque el formulario de inscripción corre en el navegador. Son valores de configuración públicos, no secretos reales.

## Inscripciones Con Google Sheets

El formulario de inscripción vive en `components/join-provider.tsx` y envía los datos a un Web App de Google Apps Script.

Configuración:

1. Crea o abre tu Google Sheet.
2. Ve a `Extensiones > Apps Script`.
3. Pega el contenido de `google-apps-script-signups.js`.
4. En el script, actualiza:
   - `SHEET_ID`
   - `SHEET_NAME`
   - `SECRET_TOKEN`
5. Despliégalo como Web App:
   - `Ejecutar como`: `Yo`
   - `Quién tiene acceso`: `Cualquier usuario`
6. Copia la URL terminada en `/exec` y configúrala en `.env.local`.

El script incluye validación del lado de Apps Script, honeypot, token simple y bloqueo de correos duplicados.

## Comandos

```bash
pnpm lint
pnpm build
```
