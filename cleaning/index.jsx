import { h, Fragment } from "https://x.lcas.dev/preact@10.5.12/mod.js";
import { renderToString } from "https://x.lcas.dev/preact@10.5.12/ssr.js";

import { api, readMessages } from "./api.js";
import { retreive } from './db.js';
import { getWeek, randomCinderella, sanitize } from "./utils.js";



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
          <tasks-list :week="${getWeek()}"></tasks-list>
          <video preload="none" poster="${cinderella.png}" muted loop>
            <source src="${cinderella.webm}">
            <img src="${cinderella.png}" alt="cinderella cleaning">
          </video>
          <conversation></conversation>
        </div>
      </body>
      <script src="https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js"></script> 
      <script type="module" src="script.js"></script>
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

  if (pathname.startsWith("/colors.js")) {
    const script = new URL("colors.js", import.meta.url);
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
