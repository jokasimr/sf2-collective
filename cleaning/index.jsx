import { h, Fragment } from "https://x.lcas.dev/preact@10.5.12/mod.js";
import { renderToString } from "https://x.lcas.dev/preact@10.5.12/ssr.js";

import { getWeek } from "./utils.js";

function App() {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cleaning schedule Södra förstadsgatan 2</title>
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <marquee behavior="alternate"><p id="schedule">{cleaningSchedule()}</p></marquee>
        <blockquote id="kanye-quote" class="blinking"></blockquote><small id="kanye-name"> - Kanye West</small>
        <img src="https://www.animatedimages.org/data/media/481/animated-duck-image-0035.gif" />
        <img src="https://www.animatedimages.org/data/media/481/animated-duck-image-0032.gif" />
      </body>
      <script async src="script.js"></script>
    </html>
  );
}

function cleaningSchedule() {
  const tasks = ["Köket", "Hall", "Vardagsrum", "Tvättstuga", "Badrum", "Toalett/sopor"];
  const people = ["Johannes", "Lorenzo", "Saranna", "Alex", "Sebastian", "Ellen"];
  const weekOffset = (getWeek() - 1) % 6;
  
  function rotate(a) { a.push(a.shift()) };
  for (let i = 0; i < weekOffset; i++)
    rotate(tasks);
    
  return tasks
    .map((task, i) => (<>{`${people[i]}: ${task}`} <br/></>))
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

  return new Response(renderToString(<App />), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

const staticContent = (type, response) => {
    const headers = new Headers(response.headers);
    headers.set("content-type", `${type}; charset=utf-8`);
    return new Response(response.body, { ...response, headers });
}
