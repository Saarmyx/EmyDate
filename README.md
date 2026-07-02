# Emy, la elección es tuya 🖤

Una experiencia romántica y minimalista donde Emily elige su próxima cita entre 12 planes, la confirma con un pequeño ritual (modal + spinner) y recibe una carta final. Al confirmar, el servidor envía un aviso privado a Telegram — el token del bot nunca llega al navegador.

## Estructura del proyecto

```
/
├── index.html
├── style.css
├── script.js
├── package.json
├── README.md
└── api/
    └── telegram.js
```

Todo el HTML, CSS y JavaScript están separados en sus propios archivos. El único JavaScript inline es la carga de las hojas de estilo de Google Fonts en el `<head>`.

## Cómo funciona

1. **Elección**: Emily hace clic (o navega con teclado) en una de las 12 tarjetas. La tarjeta seleccionada se ilumina con un sello animado y aparece la barra "❤️ Confirmar mi elección".
2. **Confirmación con pausa**: al pulsar el botón se abre un modal centrado con fondo desenfocado que pregunta "¿Estás segura de que esta será nuestra próxima aventura?". Nada se envía todavía.
3. **Envío**: al pulsar "Confirmar ❤️" el botón se desactiva, aparece un spinner y se hace un `POST` a `/api/telegram` con `emoji`, `title` y `description`.
4. **Resultado**:
   - Si todo sale bien: las tarjetas se desvanecen, caen pétalos animados y aparece una carta elegante con el mensaje final. La elección queda guardada en `localStorage`, así que si Emily recarga la página, verá directamente la carta y no podrá volver a confirmar.
   - Si algo falla: el modal muestra un mensaje de error y el botón vuelve a activarse para reintentar.

## Variables de entorno

El endpoint `/api/telegram` necesita dos variables de entorno (nunca se exponen al frontend):

| Variable    | Descripción                                           |
| ----------- | ----------------------------------------------------- |
| `BOT_TOKEN` | Token del bot de Telegram (te lo da @BotFather)       |
| `CHAT_ID`   | ID del chat/usuario al que se enviará la notificación |

### Cómo obtenerlas

1. Habla con [@BotFather](https://t.me/BotFather) en Telegram, crea un bot con `/newbot` y copia el token.
2. Escríbele algo a tu bot (o al chat/grupo donde quieras recibir el aviso).
3. Visita `https://api.telegram.org/bot<TU_TOKEN>/getUpdates` y busca el campo `chat.id`.

## Desarrollo local

```bash
npm install -g vercel   # si no lo tienes instalado
vercel dev
```

Crea un archivo `.env.local` en la raíz con:

```
BOT_TOKEN=tu_token_aqui
CHAT_ID=tu_chat_id_aqui
```

## Despliegue en Vercel

1. Sube este proyecto a un repositorio de GitHub.
2. Impórtalo en [vercel.com/new](https://vercel.com/new).
3. En **Settings → Environment Variables**, agrega `BOT_TOKEN` y `CHAT_ID`.
4. Despliega. Vercel detecta automáticamente `api/telegram.js` como una función serverless — no se necesita configuración extra.

## Notas de accesibilidad y rendimiento

- Las tarjetas son accesibles por teclado (`tabindex`, `role="button"`, `aria-pressed`).
- Se respeta `prefers-reduced-motion` para desactivar animaciones si el sistema del usuario lo pide.
- No se usan frameworks: solo HTML5, CSS3 y JavaScript vanilla en el frontend, y una función serverless de Node.js en el backend.
