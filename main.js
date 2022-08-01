const getRandomInt = (max) => Math.floor(Math.random() * max);

const getPlaces = async () => {
  let places = [];
  try {
    const response = await fetch("./places.json");
    places = await response.json();
    places.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    });
  } catch (error) {
    console.error(error);
  }
  return places;
};

const select = (places) => {
  const index = getRandomInt(places.length);
  document.querySelectorAll(".card.selected").forEach((card) => card.classList.remove("selected"));
  document.querySelectorAll(".card")[index].classList.add("selected");
};

const renderCards = (places, filters = []) => {
  let html = ``;
  const filteredPlaces = places.filter(
    (place) => !filters.length || place.types.some((type) => filters.includes(type))
  );

  filteredPlaces.forEach((place) => {
    html += `
      <div class="card-container">
        <a href="${place.link}" target="_blank">
          <div class="card">
            ${place.name}
            </div>
        </a>
      </div>`;
  });
  document.getElementById("cards").innerHTML = html;

  const selectButton = document.getElementById("select");
  selectButton.outerHTML = selectButton.outerHTML; // remove events
  document.getElementById("select").addEventListener("click", () => select(filteredPlaces));
};

const renderFilters = (places, addFilter, removeFilter) => {
  const types = [];
  places.forEach((place) => {
    (place.types || []).forEach((type) => {
      if (!types.includes(type)) {
        types.push(type);
      }
    });
  });
  types.sort();

  let html = "";
  types.forEach((type) => {
    html += `
      <label>
        <input type="checkbox" value="${type}" />
        ${type}
      </label>`;
  });
  document.getElementById("filters").innerHTML = html;

  document.querySelectorAll("#filters input").forEach((input) => {
    input.addEventListener("change", (event) => {
      if (event.currentTarget.checked) {
        addFilter(event.currentTarget.value);
      } else {
        removeFilter(event.currentTarget.value);
      }
    });
  });
};

const start = async () => {
  const places = await getPlaces();
  renderCards(places);

  let filters = [];
  const addFilter = (filter) => {
    filters.push(filter);
    renderCards(places, filters);
  };
  const removeFilter = (filter) => {
    filters = [...filters.filter((f) => f !== filter)];
    renderCards(places, filters);
  };

  renderFilters(places, addFilter, removeFilter);
};

start();
