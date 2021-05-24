const img = document.getElementById("character-img");
const character = document.getElementById("character");
const anime = document.getElementById("anime");
const quote = document.getElementById("quote");

const prevbtn = document.querySelector(".prev-btn");
const nextbtn = document.querySelector(".next-btn");
const randombtn = document.querySelector(".random-btn");

let quotes = null;

let currentItem = 0;

const getQuotes = async () => {
  const response = await fetch("https://animechan.vercel.app/api/quotes");
  return await response.json();
};

const getImg = async (character) => {
  try {
    const response = await fetch(
      `https://api.jikan.moe/v3/search/character?q=${character}&limit=1`
    );
    const json = await response.json();
    return json.results[0].image_url;
  } catch {
    return "default.png";
  }
};

const showQuote = async (currentItem) => {
  const item = quotes[currentItem];
  character.textContent = item.character;
  anime.textContent = item.anime;
  quote.textContent = item.quote;
  img.src = "loading.png";
  if (!item.url) {
    // Caching image urls from API
    item.url = await getImg(item.character);
  }
  img.src = item.url;
};

const main = async () => {
  quotes = await getQuotes();
  quotes.forEach((item, index) => {
    // due to restiction of API we can only do 2 requests per second
    setTimeout(async () => {
      item.url = await getImg(item.character);
    }, index * 500);
  });
  console.log(quotes);
  showQuote(currentItem);

  nextbtn.addEventListener("click", () => {
    currentItem = (currentItem + 1) % quotes.length;
    showQuote(currentItem);
  });

  prevbtn.addEventListener("click", () => {
    currentItem = (quotes.length + currentItem - 1) % quotes.length;
    showQuote(currentItem);
  });

  randombtn.addEventListener("click", () => {
    currentItem = Math.floor(Math.random() * quotes.length);
    showQuote(currentItem);
  });
};

main();
