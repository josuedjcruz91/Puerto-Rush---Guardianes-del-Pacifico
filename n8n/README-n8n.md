# n8n: Faro Rush - Registro y Leaderboard

## Preparación

1. En la raíz del proyecto ejecuta `npm run server`. Comprueba `http://localhost:3001/scores`.
2. Inicia n8n con `n8n start` (instalación local) y abre `http://localhost:5678`.
3. En **Workflows → Add workflow → Import from file**, selecciona `n8n/faro-rush-leaderboard-workflow.json`.
4. Abre **Faro Rush - Registro y Leaderboard** y revisa las dos ramas. No requiere credenciales.

El nodo HTTP usa `http://127.0.0.1:3001/scores`. Si n8n se ejecuta en Docker, `127.0.0.1` apunta al contenedor; cambia ambos nodos HTTP por la dirección de tu host accesible desde el contenedor.

## Prueba y activación

1. Con json-server activo, pulsa **Listen for test event** en el nodo Webhook (o **Test workflow**).
2. Envía el payload de abajo a `http://localhost:5678/webhook-test/faro-rush-score`.
3. Comprueba la ejecución: validación → POST a json-server → GET de puntajes → posición y Top 5 → respuesta 201.
4. Publica o activa el workflow para habilitar `http://localhost:5678/webhook/faro-rush-score`. El frontend usa esta URL mediante el proxy de Vite (`/n8n/webhook/faro-rush-score`).

`/webhook-test/` solo escucha durante una prueba abierta en el editor. `/webhook/` requiere que el workflow esté activo; es la URL para jugar normalmente.

### Payload de prueba

```json
{
  "playerName": "DJ CRUZ",
  "score": 280,
  "level": 2,
  "levelName": "Marea Activa",
  "result": "won",
  "timeRemaining": 8,
  "collectedItems": 14,
  "playedAt": "2026-09-21T18:00:00.000Z"
}
```

```bash
curl -i -X POST http://localhost:5678/webhook-test/faro-rush-score \
  -H 'Content-Type: application/json' \
  -d '{"playerName":"DJ CRUZ","score":280,"level":2,"levelName":"Marea Activa","result":"won","timeRemaining":8,"collectedItems":14,"playedAt":"2026-09-21T18:00:00.000Z"}'
```

Se espera HTTP **201** con `success: true`, `savedScore`, `position`, `badge` y `topFive`. Prueba un nombre de un carácter para ver HTTP **400** con `errors`; no debe crearse un puntaje.

## Problemas frecuentes

- **Connection refused al guardar:** inicia `npm run server`; verifica puerto 3001 y dirección del host si usas Docker.
- **404 del webhook de prueba:** vuelve a pulsar **Listen for test event**; la URL de prueba solo está activa temporalmente.
- **404 del webhook normal:** activa el workflow y usa `/webhook/`, no `/webhook-test/`.
- **Error de CORS en desarrollo:** accede al frontend mediante Vite (`npm run dev`) y conserva la URL relativa `/n8n/webhook/faro-rush-score` en `.env` o usa la configuración por defecto. El proxy elimina `/n8n`.
- **Error 400:** revisa los campos y tipos del payload. La respuesta enumera los problemas de validación.
- **Pantalla con error de envío:** n8n debe estar activo; usa **Reintentar envío** en el resultado. El frontend nunca escribe directamente en `/scores`.
