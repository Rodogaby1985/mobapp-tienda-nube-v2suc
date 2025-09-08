# mobapp-tienda-nube-v2suc

Modalidad **SUCURSAL** de la integración con Tienda Nube.

## Descripción
Esta variante provee hasta 5 opciones de envío a sucursal. Usa una App ID independiente (21162) y su propio Client Secret (no versionado).

## Variables de entorno (.env)
```
APP_ID=21162
CLIENT_SECRET=REEMPLAZAR_CON_SECRET_REAL
PUBLIC_API_URL=https://mobapp-tienda-nube-828565366702.us-central1.run.app
MODALIDAD=sucursal
SESSION_SECRET=algo_seguro
PORT=3000
```

No subir `.env` ni archivos de credenciales de Google Cloud.

## Pasos básicos
1. `npm install`
2. `node app.js`
3. Instalar la app en Tienda Nube usando la ruta `/install`.

## Seguridad
- No versionar Client Secret ni claves de service account.
- Usar `.env.example` como plantilla.
