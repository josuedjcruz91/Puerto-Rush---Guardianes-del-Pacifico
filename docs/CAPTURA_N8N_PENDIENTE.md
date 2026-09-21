# Captura del workflow pendiente

No se pudo capturar visualmente el editor de n8n durante la creación del proyecto. El workflow sí se importó y probó mediante HTTP en n8n 2.39.8, pero no se incluye una imagen generada o simulada.

1. Inicia `npm run server` y `n8n start`, y abre `http://localhost:5678`.
2. Importa `n8n/faro-rush-leaderboard-workflow.json` y abre **Faro Rush - Registro y Leaderboard**.
3. Activa el workflow y ejecuta una prueba con el `curl` de `n8n/README-n8n.md` (para `/webhook-test/`, primero pulsa **Listen for test event**).
4. Amplía el editor para mostrar ambas ramas completas y guarda una captura real en `docs/n8n-workflow.png`.

Esta captura real es la única evidencia manual pendiente.
