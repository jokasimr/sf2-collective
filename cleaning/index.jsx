import { h, Fragment } from "https://x.lcas.dev/preact@10.5.12/mod.js";
import { renderToString } from "https://x.lcas.dev/preact@10.5.12/ssr.js";

import { getWeek, randomCinderella } from "./utils.js";

function App() {
  const cinderella = randomCinderella();
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cleaning schedule Södra förstadsgatan 2</title>
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <div id="app" style="display:none">
          <p>
            <span class="button" @click="left">⬅️</span>
            <label for="week">Week</label>
            <input type="number" v-model.number="week" value=${getWeek()} id="week" name="week" min="1" max="52" />
            <span class="button" @click="right">➡️</span>
          </p>
          <transition-group id="schedule" name="schedule" tag="div">
              <div class="cell" v-for="item in tasksAndPeople" :key="item">
                <span>{{ item }}</span>
              </div>
          </transition-group>
          <video preload="none" poster="${cinderella.png}" muted loop>
            <source src="${cinderella.webm}">
            <img src="${cinderella.png}" alt="cinderella cleaning">
          </video>
        </div>
      </body>
      <script async src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
      <script async src="script.js"></script>
    </html>
  `;
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/style.css")) {
    const style = new URL("style.css", import.meta.url);
    return staticContent("text/css", await fetch(style));
  }

  if (pathname.startsWith("/script.js")) {
    const script = new URL("script.js", import.meta.url);
    return staticContent("application/javascript", await fetch(script));
  }

  return new Response(App(), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

const staticContent = (type, response) => {
    const headers = new Headers(response.headers);
    headers.set("content-type", `${type}; charset=utf-8`);
    return new Response(response.body, { ...response, headers });
}
