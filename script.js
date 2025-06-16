let count = 0;


const loadDefaultDrinks = () => {
  fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita")
    .then(res => res.json())
    .then(data => displayDrinks(data.drinks.slice(0, 8)));
};


const handleSearch = () => {
  const input = document.getElementById("search-box").value.trim();
  if (!input) return;

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${input}`)
    .then(res => res.json())
    .then(data => {
      if (data.drinks) {
        displayDrinks(data.drinks);
      } else {
        document.getElementById("product-container").innerHTML = "<h2>Not Found</h2>";
      }
    });
};


const displayDrinks = (drinks) => {
  const container = document.getElementById("product-container");
  container.innerHTML = "";

  drinks.forEach((drink) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
      <h5>${drink.strDrink}</h5>
      <p><strong>Category:</strong> ${drink.strCategory}</p>
      <p>${drink.strInstructions.slice(0, 15)}...</p>
      <button onclick="addToGroup('${drink.strDrink}')">Add to Group</button>
      <button onclick="showDetails('${drink.idDrink}')">Details</button>
    `;
    container.appendChild(div);
  });
};


const addToGroup = (name) => {
  if (count >= 7) {
    alert("You cannot add more than 7 drinks!");
    return;
  }

  const container = document.getElementById("cart-main-container");
  const div = document.createElement("div");
  div.classList.add("cart-info");
  div.innerHTML = `<p>${name}</p>`;
  container.appendChild(div);

  count++;
  document.getElementById("count").innerText = count;
};


const showDetails = (id) => {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
      const drink = data.drinks[0];
      const modalContent = document.getElementById("modal-content");
      modalContent.innerHTML = `
        <span class="close" onclick="closeModal()">&times;</span>
        <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
        <h2>${drink.strDrink}</h2>
        <p><strong>Category:</strong> ${drink.strCategory}</p>
        <p><strong>Alcoholic:</strong> ${drink.strAlcoholic}</p>
        <p><strong>Glass:</strong> ${drink.strGlass}</p>
        <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
        <p><strong>Ingredients:</strong> ${getIngredients(drink)}</p>
      `;
      document.getElementById("modal").style.display = "flex";
    });
};

const getIngredients = (drink) => {
  let ingredients = [];
  for (let i = 1; i <= 5; i++) {
    const item = drink[`strIngredient${i}`];
    if (item) ingredients.push(item);
  }
  return ingredients.join(", ");
};


const closeModal = () => {
  document.getElementById("modal").style.display = "none";
};


document.getElementById("search-button").addEventListener("click", handleSearch);


loadDefaultDrinks();
