import { h, Fragment } from "https://x.lcas.dev/preact@10.5.12/mod.js";
import { renderToString } from "https://x.lcas.dev/preact@10.5.12/ssr.js";

function App() {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cleaning schedule Södra förstadsgatan X</title>
        <style>{css}</style>
      </head>
      <body>
        <h1>Sup</h1>
        <marquee behavior="alternate"><p id="schedule">{cleaningSchedule()}</p></marquee>
        <blockquote id="kanye-quote" class="blinking"></blockquote><small id="kanye-name"> - Kanye West</small>
        <img src="https://www.animatedimages.org/data/media/481/animated-duck-image-0035.gif" />
        <img src="https://www.animatedimages.org/data/media/481/animated-duck-image-0032.gif" />
      </body>
      <script dangerouslySetInnerHTML={{__html: js}}></script>
    </html>
  );
}


addEventListener("fetch", (event) => {
  const response = new Response(renderToString(<App />), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });

  event.respondWith(response);
});


function cleaningSchedule() {
  var tasks = ["Köket", "Hall", "Vardagsrum", "Tvättstuga", "Badrum", "Toalett/sopor"];
  var people = ["Johannes", "Lorenzo", "Saranna", "Alex", "Sebastian", "Ellen"];
  var weekOffset = (getWeek() - 1) % 6;
  
  function rotate(a) { a.push(a.shift()) };
  for (var i = 0; i < weekOffset; i++)
    rotate(tasks);
    
  return tasks
    .map((task, i) => (<>{`${people[i]}: ${task}`} <br/></>))
}

function getWeek() {
  var date = new Date();
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
           - 3 + (week1.getDay() + 6) % 7) / 7);
}

const css = `
  body {
    background: black;
  }
  .blinking{
    animation:blinkingText 1s infinite;
  }
  @keyframes blinkingText {
    0%   { opacity: 1.0; }
    49%  { opacity: 1.0; }
    60%  { opacity: 0;   }
    99%  { opacity: 0;   }
    100% { opacity: 1.0; }
  }
  #schedule {
    color: turquoise;
  }
  #kanye-quote {
    color: orange;
    font-size:150%;
  }
  #kanye-name {
    color: orange;
    float: right;
  }
`;

const js = `
  fetch("https://api.kanye.rest/")
    .then(r => r.json())
    .then(k =>
      document
        .getElementById("kanye-quote")
        .innerHTML = k.quote
    );
`
