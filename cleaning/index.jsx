import { h, Fragment } from "https://x.lcas.dev/preact@10.5.12/mod.js";
import { renderToString } from "https://x.lcas.dev/preact@10.5.12/ssr.js";

import { api, readMessages } from "./api.js";
import { getWeek, randomCinderella, sanitize } from "./utils.js";



async function conversation() {
  return (`
    <div id="convo">
      <textarea id="input-message"></textarea>
      <label for="picture">Image: </label>
      <input id="input-picture" name="picture" type="text">
      <input type="submit"
        onclick="fetch('/api', {method: 'POST', body: JSON.stringify({message: document.getElementById('input-message').value, picture: document.getElementById('input-picture').value})}).then((res) => { if (res.status === 200) {window.location = window.location}; })"
      >
      ${(await readMessages())
        .reverse()
        .map(m =>
          `<div class="comment">
             <span class="comment-time">${(new Date(m.ms)).toLocaleString('sv')}</span>
             <div class="comment-body">
               <img class="comment-picture"
                onclick="document.getElementById('input-picture').value = this.src"
                src="${sanitize(m.picture)}">
               <span class="comment-text">
                 ${sanitize(m.message)}
               </span>
             </div>
           </div>`
        ).join('\n')
      }
    </div>
  `);
}


async function app() {
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
          <p class="week-controls">
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
        ${await conversation()}
      </body>
      <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js"></script> 
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

  if (pathname.startsWith("/api")) {
    return await api(request);
  }

  return new Response(await app(), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

const staticContent = (type, response) => {
    const headers = new Headers(response.headers);
    headers.set("content-type", `${type}; charset=utf-8`);
    return new Response(response.body, { ...response, headers });
}
