# FARO RUSH: Guardianes del Pacífico

Videojuego arcade frontend ambientado frente al Faro de Puntarenas, Costa Rica. Autor: **Josué Cruz Alemán**.

## Historia y mecánica

Una lancha guardiana patrulla la bahía para proteger la vida marina. Mueve la lancha horizontalmente con **← / →**, **A / D** o los botones táctiles. Los objetos caen desde posiciones aleatorias. Recoge tortugas (+20), peces (+10), estrellas (+30) y salvavidas (+1 vida, máximo 3). Esquiva basura y rocas (−1 vida) y tormentas (−1 vida y −10 puntos; el puntaje nunca baja de cero). Ganas al alcanzar la meta. Pierdes al agotar el tiempo o las vidas. Puedes iniciar, pausar, continuar y reiniciar.

| Nivel | Duración | Meta | Ritmo |
|---|---:|---:|---|
| Bahía Serena | 45 s | 120 | Velocidad y obstáculos bajos |
| Marea Activa | 50 s | 220 | Velocidad y frecuencia medias |
| Tormenta del Pacífico | 60 s | 350 | Alta velocidad y más tormentas |

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

**Verificación realizada:** con n8n 2.39.8 en una carpeta temporal aislada, el workflow se importó y publicó. Un payload inválido recibió HTTP 400 con errores; uno válido recibió HTTP 201 con puntaje guardado, posición, insignia y Top 5. El mismo POST mediante el proxy de Vite recibió HTTP 201. Los puntajes creados durante estas pruebas se retiraron de `db.json`.

## Rutas y datos

| Ruta | Contenido |
|---|---|
| `/` | Alias (2–20 caracteres) y niveles |
| `/instrucciones` | Controles y puntuación |
| `/juego/:nivel` | Partida del nivel 1, 2 o 3 |
| `/puntajes` | Tabla de líderes |
| `*` | Página 404 |

`db.json` guarda configuraciones de niveles y puntajes iniciales, nunca el estado activo de una partida. React consulta `GET /levels` y `GET /scores` con Axios. La clasificación se ordena de mayor a menor. Al terminar, React hace `POST` **solo al webhook de n8n**; el workflow valida y guarda mediante `POST /scores`, consulta `GET /scores` y responde con posición, insignia y Top 5. Si n8n falla, el modal muestra el error y permite reintentar sin fingir un guardado.

Ejemplo de payload:

```json
{"playerName":"DJ CRUZ","score":280,"level":2,"levelName":"Marea Activa","result":"won","timeRemaining":8,"collectedItems":14,"playedAt":"2026-09-21T18:00:00.000Z"}
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

`GamePage` consulta y valida el nivel; `useGameEngine` concentra movimiento, aparición, colisiones, tiempo y final de partida. `GameBoard` recibe la lancha y objetos; `FallingItem` recibe tipo, posición y estilo; `ScoreBoard` recibe puntaje, tiempo, nivel, meta y vidas; `TouchControls` recibe callbacks; `GameOverModal` recibe resultado, estado de envío y acciones. `LevelCard` recibe cada nivel y `LeaderboardTable` recibe los puntajes. Las listas usan `.map()` con claves estables; los objetos del juego tienen ID incremental.

`useState` mantiene alias, carga, errores, envío y el estado de juego (posición, puntaje, vidas, tiempo, objetos, nivel seleccionado y fase). `useEffect` carga datos, registra y limpia teclas, gobierna intervalos y detecta el resultado. **`useRef`** guarda el área de juego, ID siguiente, teclas presionadas y payload enviado sin renderizados extra. **`useContext`** en `PlayerContext` comparte el alias entre Inicio, Juego, Header y resultado. `useCallback` mantiene estables las acciones del motor y el envío.

## Errores y accesibilidad

Hay estados de carga, lista vacía y error con reintento para los GET. Se valida el alias y el nivel antes de jugar. El webhook muestra fallos de red y errores de validación de n8n, más un botón de reintento. La interfaz incluye nombres accesibles, foco visible, estados expresados con texto y soporte para movimiento reducido. Los controles de teclado no bloquean botones, enlaces ni campos.

## Evidencia y rúbrica

El workflow importable está en [`n8n/faro-rush-leaderboard-workflow.json`](n8n/faro-rush-leaderboard-workflow.json). La captura real del editor se documenta en [`docs/CAPTURA_N8N_PENDIENTE.md`](docs/CAPTURA_N8N_PENDIENTE.md) mientras n8n no esté accesible visualmente.

| Requisito | Archivos que lo demuestran |
|---|---|
| React, Vite, rutas y contexto | `package.json`, `vite.config.js`, `src/routes/AppRouter.jsx`, `src/context/PlayerContext.jsx` |
| GET de niveles y puntajes, carga y errores | `src/services/levelService.js`, `src/services/scoreService.js`, `src/pages/HomePage.jsx`, `src/pages/ScoresPage.jsx` |
| Tres niveles configurables | `db.json`, `src/pages/GamePage.jsx` |
| Motor, colisiones, controles y fin | `src/hooks/useGameEngine.js`, `src/components/game/` |
| Componentes reutilizables y props | `src/components/levels/LevelCard.jsx`, `src/components/game/ScoreBoard.jsx`, `src/components/game/FallingItem.jsx`, `src/components/game/TouchControls.jsx` |
| POST real y reintento | `src/services/scoreService.js`, `src/pages/GamePage.jsx`, `src/components/game/GameOverModal.jsx` |
| Workflow con validación, guardado y Top 5 | `n8n/faro-rush-leaderboard-workflow.json`, `n8n/README-n8n.md` |
| Diseño responsive y accesible | `src/styles/`, `src/components/` |

## Posibles mejoras

Sonido opcional, selección de dificultad personalizable, estadísticas por tipo de rescate y pruebas automatizadas de integración del workflow.
