# n8n: Faro Rush - Registro y Leaderboard

## Preparación

1. En la raíz del proyecto ejecuta `npm run server`. Comprueba `http://localhost:3001/scores`.
2. Inicia n8n con `n8n start` (instalación local) y abre `http://localhost:5678`.
3. En una instalación nueva, crea un workflow vacío y usa **⋯ → Import → From file** para seleccionar `n8n/faro-rush-leaderboard-workflow.json`. Importar dentro de un canvas que ya contiene nodos **agrega** los nodos; no reemplaza los anteriores.
4. Guarda y **publica** el workflow. Revisa las dos ramas. No requiere credenciales. El nodo Webhook debe mostrar método **POST** y path **faro-rush-score**. En la instancia local usada durante este proyecto, el workflow existente ya quedó actualizado y publicado.

El nodo HTTP usa `http://127.0.0.1:3001/scores`. Si n8n se ejecuta en Docker, `127.0.0.1` apunta al contenedor; cambia ambos nodos HTTP por la dirección de tu host accesible desde el contenedor.

## Qué URL usa cada parte

| Dirección | Función |
|---|---|
| `http://localhost:5678/webhook/faro-rush-score` | Entrada de **producción** a n8n. El juego envía aquí el resultado acumulado al terminar la quinta misión. |
| `http://localhost:5678/webhook-test/faro-rush-score` | Entrada de **prueba**; solo existe mientras n8n muestra **Listen for test event** o **Execute workflow**. |
| `http://localhost:3001/scores` | Recurso de `json-server` basado en la clave `scores` de `db.json`. n8n guarda y consulta los puntajes aquí. |

`faro-rush-score` es el **path del Webhook** en n8n; no tiene que ser una clave de `db.json`. La clave del archivo es `scores`, en plural. Los nombres pueden ser diferentes porque el Webhook recibe la solicitud y los nodos HTTP de n8n la envían después a `/scores`.

Para jugar normalmente, deja el workflow **Published** y no pulses **Execute workflow**. El juego usa la URL de producción; esa ejecución aparece en la pestaña **Executions** de n8n, no se dibuja en el editor en tiempo real. El juego no necesita enviar cada clic: al completar las cinco metas envía una única solicitud con `missionScores` (cinco valores) y `score` (su suma). Una misión perdida no se registra. [Documentación oficial del Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/).

## Prueba y activación

1. Para una prueba manual, con json-server activo pulsa **Listen for test event** en el nodo Webhook (o **Execute workflow**).
2. Envía el payload de cinco misiones de abajo a `http://localhost:5678/webhook-test/faro-rush-score`.
3. Comprueba la ejecución: validación → POST a json-server → GET de puntajes → posición y Top 5 → respuesta 201.
4. Publica el workflow para habilitar `http://localhost:5678/webhook/faro-rush-score`. El frontend usa esta URL mediante el proxy de Vite (`/n8n/webhook/faro-rush-score`).

`/webhook-test/` solo escucha durante una prueba abierta en el editor. `/webhook/` requiere que el workflow esté activo; es la URL para jugar normalmente.

### Payload de prueba

```json
{
  "playerName": "DJ CRUZ",
  "score": 1610,
  "level": 5,
  "levelName": "Última Luz del Faro",
  "result": "won",
  "timeRemaining": 8,
  "collectedItems": 82,
  "missionScores": [120, 220, 350, 420, 500],
  "playedAt": "2026-09-21T18:00:00.000Z"
}
```

```bash
curl -i -X POST http://localhost:5678/webhook-test/faro-rush-score \
  -H 'Content-Type: application/json' \
  -d '{"playerName":"DJ CRUZ","score":1610,"level":5,"levelName":"Última Luz del Faro","result":"won","timeRemaining":8,"collectedItems":82,"missionScores":[120,220,350,420,500],"playedAt":"2026-09-21T18:00:00.000Z"}'
```

Se espera HTTP **201** con `success: true`, `savedScore`, `position`, `badge` y `topFive`. Este `curl` añade un puntaje de prueba a `db.json`. Prueba un nombre de un carácter para ver HTTP **400** con `errors`; no debe crearse un puntaje.

El 21 de septiembre de 2026 se verificó el workflow actualizado en la instancia local: HTTP **400** para `{}` y HTTP **201** para un total válido de cinco misiones. El registro de prueba se eliminó después. La captura real está en `docs/n8n-workflow.png`.

## Problemas frecuentes

- **Connection refused al guardar:** inicia `npm run server`; verifica puerto 3001 y dirección del host si usas Docker.
- **404 del webhook de prueba:** vuelve a pulsar **Listen for test event**; la URL de prueba solo está activa temporalmente.
- **404 del webhook normal:** el workflow no está publicado con el método POST y el path `faro-rush-score`. Esta fue la causa de la captura enviada por el usuario; quedó corregida al publicar el workflow actualizado. Si reaparece, verifica la URL de producción dentro del nodo Webhook.
- **Error de CORS en desarrollo:** accede al frontend mediante Vite (`npm run dev`) y conserva la URL relativa `/n8n/webhook/faro-rush-score` en `.env` o usa la configuración por defecto. El proxy elimina `/n8n`.
- **Error 400:** revisa los campos y tipos del payload. La respuesta enumera los problemas de validación.
- **Pantalla con error de envío:** n8n debe estar activo; usa **Reintentar envío** en el resultado. El frontend nunca escribe directamente en `/scores`.
