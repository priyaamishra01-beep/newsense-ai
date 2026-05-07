fetch("https://newsapi.org/v2/everything?q=india&apiKey=18e59d97e65b49bb97a660ad16e7a84a")
  .then(response => response.json())
  .then(data => {
    console.log("Data received:");
    console.log(data);
  })
  .catch(error => console.error("Error:", error));