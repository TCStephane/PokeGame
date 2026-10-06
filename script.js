const grid = document.getElementById("grid");
const searchInput = document.getElementById("search");
const loading = document.getElementById("loading");

let allPokemon = [];

async function loadPokemon() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20&offset=0");
  const data = await res.json();

  const detailPromises = data.results.map(async (pokemon) => {
    const detailRes = await fetch(pokemon.url);
    return await detailRes.json();
  });

  allPokemon = await Promise.all(detailPromises);

  loading.style.display = "none";
  renderCards(allPokemon);
}

function renderCards(list) {
  grid.innerHTML = "";

  list.forEach((pokemon) => {
    const card = document.createElement("div");
    card.classList.add("card");

    if (pokemon.types && pokemon.types.length > 0) {
      card.classList.add(pokemon.types[0].type.name);
    }

    const img = document.createElement("img");
    img.src = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;
    img.alt = pokemon.name;

    const h3 = document.createElement("h3");
    h3.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);


    const button = document.createElement("button");
    button.textContent = "View Info";
    button.addEventListener("click", () => {
      const ability = pokemon.abilities[0]?.ability.name || "unknown";
      alert(`I am ${pokemon.name} and I have ${ability}.`);
    });

    card.appendChild(img);
    card.appendChild(h3);
    card.appendChild(button);
    grid.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  const text = searchInput.value.toLowerCase();

  const filteredList = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(text)
  );

  renderCards(filteredList);
});

loadPokemon();