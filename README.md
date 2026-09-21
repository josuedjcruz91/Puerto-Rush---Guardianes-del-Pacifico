# FARO RUSH: Guardianes del Pacífico

Videojuego arcade frontend ambientado frente al Faro de Puntarenas, Costa Rica. Autor: **Josué Cruz Alemán**.

## Historia y mecánica

Una lancha guardiana patrulla la bahía para proteger la vida marina. Antes de cada misión aparecen las reglas y una cuenta regresiva de tres segundos. Mueve la lancha horizontalmente con **← / →**, **A / D** o los botones táctiles. Los objetos caen desde posiciones aleatorias. Recoge tortugas (+20), peces (+10), estrellas (+30) y salvavidas (+1 vida, máximo 3). Esquiva basura y rocas (−1 vida) y tormentas (−1 vida y −10 puntos; el puntaje nunca baja de cero). Al alcanzar la meta ves el resultado de la misión y avanzas a la siguiente. Si pierdes, puedes reintentar esa misión. El podio usa la **suma de cinco misiones completadas**, enviada una sola vez al webhook. Puedes iniciar, pausar, continuar y reiniciar.

| Nivel | Duración | Meta | Ritmo |
|---|---:|---:|---|
| Bahía Serena | 45 s | 120 | Velocidad y obstáculos bajos |
| Marea Activa | 50 s | 220 | Velocidad y frecuencia medias |
| Tormenta del Pacífico | 60 s | 350 | Alta velocidad y más tormentas |
| Corriente de Rescate | 70 s | 420 | Corrientes rápidas y obstáculos frecuentes |
| Última Luz del Faro | 80 s | 500 | La guardia final |

## Tecnologías y requisitos

React funcional con JavaScript/JSX, Vite, React Router, CSS normal, Axios, json-server y n8n. No usa TypeScript, Next.js, Redux, Firebase ni bibliotecas de estilos. Los recursos visuales del juego se crean con CSS y símbolos locales del sistema; no necesita imágenes remotas. Las fuentes web tienen alternativas locales.

Requisitos: Node.js 20.19+ o 22.12+, npm y, para registrar puntajes, n8n local. El juego y la lectura de datos funcionan con Vite y json-server. El registro de resultados requiere n8n activo.

## Instalación y ejecución

```bash
npm install
cp .env.example .env
npm run dev:all
```

Abre la URL que muestre Vite (normalmente `http://localhost:5173`). `npm run dev:all` inicia Vite y json-server. También puedes usar `npm run dev` y `npm run server` en terminales separadas. `npm run build` compila producción y `npm run lint` revisa el código. `.env` es opcional si se usan los valores por defecto y está excluido de Git.

Para completar el registro de puntajes, inicia n8n (`n8n start`), importa el workflow y actívalo como se explica en [la guía de n8n](n8n/README-n8n.md).

Webhook local de producción: `http://localhost:5678/webhook/faro-rush-score`  
Webhook local de prueba: `http://localhost:5678/webhook-test/faro-rush-score`

La aplicación envía a `/n8n/webhook/faro-rush-score`. El proxy de Vite elimina solo `/n8n` y lo dirige a `http://localhost:5678`. En producción, configura `VITE_N8N_WEBHOOK_URL` con la URL pública de tu webhook y `VITE_API_URL` con la API correspondiente.

**Diagnóstico y corrección de la captura:** la instancia local de n8n respondió HTTP 200 en `/healthz`, pero inicialmente HTTP **404** en `POST /webhook/faro-rush-score`: el webhook de producción no estaba registrado. El workflow **Faro Rush - Registro y Leaderboard** estaba inactivo. Se actualizó su nodo de validación en la instancia local y se publicó. Después, el endpoint respondió HTTP **400** para un payload vacío y **201** para una campaña válida de cinco misiones, con posición e insignia. Se eliminó el registro de prueba. El frontend ahora muestra la causa concreta cuando recibe 404.

El workflow también se había validado en una instancia temporal de n8n 2.39.8. La versión actual está publicada en la instancia local del usuario.

## Rutas y datos

| Ruta | Contenido |
|---|---|
| `/` | Alias (2–20 caracteres) y cinco misiones |
| `/instrucciones` | Controles y puntuación |
| `/juego/:nivel` | Campaña secuencial; se inicia en `/juego/1` |
| `/puntajes` | Tabla de líderes |
| `*` | Página 404 |

`db.json` guarda las cinco misiones y puntajes iniciales de campañas completas, nunca el estado activo de una partida. React consulta `GET /levels` y `GET /scores` con Axios. La clasificación se ordena de mayor a menor por puntaje acumulado. Después de cumplir la quinta meta, React hace un solo `POST` **al webhook de n8n**; el workflow valida que haya cinco puntajes y que sumen el total, guarda mediante `POST /scores`, consulta `GET /scores` y responde con posición, insignia y Top 5. Si n8n falla, el modal muestra el código y la causa probable y permite reintentar sin fingir un guardado. Una misión perdida no se envía al podio.

Ejemplo de payload:

```json
{"playerName":"DJ CRUZ","score":1610,"level":5,"levelName":"Última Luz del Faro","result":"won","timeRemaining":8,"collectedItems":82,"missionScores":[120,220,350,420,500],"playedAt":"2026-09-21T18:00:00.000Z"}
```

## Arquitectura, componentes y hooks

```text
src/
  components/{common,layout,game,levels,scores}/
  context/PlayerContext.jsx
  hooks/useGameEngine.js
  pages/{HomePage,InstructionsPage,GamePage,ScoresPage,NotFoundPage}.jsx
  routes/AppRouter.jsx
  services/{api,levelService,scoreService}.js
  utils/{gameHelpers,validators}.js
  constants/gameConfig.js
  styles/{globals,layout,game,responsive}.css
  App.jsx, main.jsx
db.json, n8n/, docs/
```

`GamePage` consulta las cinco misiones y conserva el acumulado; `MissionGame` organiza reglas, cuenta regresiva y controles; `useGameEngine` concentra movimiento, aparición, colisiones, tiempo y final de cada misión. `GameBoard` recibe la lancha y objetos; `FallingItem` recibe tipo, posición y estilo; `ScoreBoard` recibe puntaje de misión, acumulado, tiempo, nivel, meta y vidas; `TouchControls` recibe callbacks; `GameOverModal` muestra el marcador por misión y el podio final. `LevelCard` recibe cada nivel y `LeaderboardTable` recibe los puntajes. Las listas usan `.map()` con claves estables; los objetos del juego tienen ID incremental.

`useState` mantiene alias, carga, errores, envío, misión actual, marcadores completados, cuenta regresiva y el estado de juego (posición, puntaje, vidas, tiempo, objetos y fase). `useEffect` carga datos, registra y limpia teclas, gobierna intervalos y detecta el resultado. **`useRef`** guarda el área de juego, ID siguiente, teclas presionadas, intervalo de cuenta regresiva y payload enviado sin renderizados extra. **`useContext`** en `PlayerContext` comparte el alias entre Inicio, Juego, Header y resultado. `useCallback` mantiene estables las acciones del motor y el envío.

## Errores y accesibilidad

Hay estados de carga, lista vacía y error con reintento para los GET. Se valida el alias y el nivel antes de jugar. El webhook muestra fallos de red y errores de validación de n8n, más un botón de reintento. La interfaz incluye nombres accesibles, foco visible, estados expresados con texto y soporte para movimiento reducido. Los controles de teclado no bloquean botones, enlaces ni campos.

## Evidencia y rúbrica

El workflow importable está en [`n8n/faro-rush-leaderboard-workflow.json`](n8n/faro-rush-leaderboard-workflow.json) y su captura real, ya publicada, en [`docs/n8n-workflow.png`](docs/n8n-workflow.png).

| Requisito | Archivos que lo demuestran |
|---|---|
| React, Vite, rutas y contexto | `package.json`, `vite.config.js`, `src/routes/AppRouter.jsx`, `src/context/PlayerContext.jsx` |
| GET de niveles y puntajes, carga y errores | `src/services/levelService.js`, `src/services/scoreService.js`, `src/pages/HomePage.jsx`, `src/pages/ScoresPage.jsx` |
| Cinco misiones configurables y avance secuencial | `db.json`, `src/pages/GamePage.jsx`, `src/components/game/MissionGame.jsx` |
| Motor, colisiones, controles y fin | `src/hooks/useGameEngine.js`, `src/components/game/` |
| Componentes reutilizables y props | `src/components/levels/LevelCard.jsx`, `src/components/game/ScoreBoard.jsx`, `src/components/game/FallingItem.jsx`, `src/components/game/TouchControls.jsx` |
| POST real y reintento | `src/services/scoreService.js`, `src/pages/GamePage.jsx`, `src/components/game/GameOverModal.jsx` |
| Workflow con validación, guardado y Top 5 | `n8n/faro-rush-leaderboard-workflow.json`, `n8n/README-n8n.md` |
| Diseño responsive y accesible | `src/styles/`, `src/components/` |

## Posibles mejoras

Sonido opcional, selección de dificultad personalizable, estadísticas por tipo de rescate y pruebas automatizadas de integración del workflow.
