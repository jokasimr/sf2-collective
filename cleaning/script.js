fetch("https://api.kanye.rest/")
  .then(r => r.json())
  .then(k =>
    document
      .getElementById("kanye-quote")
      .innerHTML = k.quote
  );
