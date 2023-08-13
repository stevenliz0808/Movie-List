const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const movies = [];
let filteredMovies = [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector(".pagination");
const faBars = document.querySelector(".fa-bars")
const faTh = document.querySelector(".fa-th");
const MOVIES_PER_PAGE = 12;

const view = {
  renderMovieCards(data) {
    let rowHTML = "";
    data.forEach((item) => {
      rowHTML += `
    <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src="${POSTER_URL + item.image}"
                class="card-img-top"
                alt="..."
              />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button
                  type="button"
                  class="btn btn-primary btn-show-movie"
                  data-bs-toggle="modal"
                  data-bs-target="#movie-modal"
                  data-id="${item.id}"
                >
                  More
                </button>
                <button type="button" class="btn btn-info btn-add-favorite" data-id="${
                  item.id
                }">
                  +
                </button> 
              </div>
            </div>
          </div>
        </div>`;
    });
    dataPanel.innerHTML = rowHTML;
  },
  renderMovieList(data) {
    let rowHTML = '<ul class="list-group list-group-flush">';
    data.forEach((item) => {
      rowHTML += `
          <li class="list-group-item d-flex justify-content-between">
            <h3>${item.title}</h3>
            <div>
              <button
              type="button"
              class="btn btn-primary btn-sm btn-show-movie"
              data-bs-toggle="modal"
              data-bs-target="#movie-modal"
              data-id="${item.id}"
            >
              More
              </button>
              <button
                type="button"
                class="btn btn-info btn-sm btn-add-favorite"
                data-id="${item.id}"
              >
                +
              </button>
            </div>`;
    });
    rowHTML += "</ul>";
    dataPanel.innerHTML = rowHTML;
  },
  renderPaginator(amount) {
    const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE);
    let rowHTML = "";
    for (let page = 1; page <= numberOfPages; page++) {
      rowHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
    }
    paginator.innerHTML = rowHTML;
  },
  showMovieModal(id) {
    const modalTitle = document.querySelector(".modal-title");
    const modalImg = document.querySelector("#modal-img");
    const modalDate = document.querySelector("#modal-date");
    const modalDescription = document.querySelector("#modal-description");
    modalTitle.innerText = "";
    modalImg.innerHTML = "";

    axios.get(INDEX_URL + id).then((response) => {
      const data = response.data.results;
      modalTitle.innerText = data.title;
      modalImg.innerHTML = `
        <img src="${
          POSTER_URL + data.image
        }" alt="movie-poster" class="img-fuid">`;
      modalDate.innerText = "Release Date:" + data.release_date;
      modalDescription.innerText = data.description;
    });
  },
};

const controller = {
  addToFavorite(id) {
    const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
    const movie = movies.find((movie) => movie.id === id);
    if (list.some((movie) => movie.id === id)) {
      return alert("已加入清單中!");
    }
    list.push(movie);
    localStorage.setItem("favoriteMovies", JSON.stringify(list));
  },
};

const model = {
  getMoviesByPage(page) {
    const whichMovies = filteredMovies.length ? filteredMovies : movies;
    const startIndex = (page - 1) * MOVIES_PER_PAGE;
    return whichMovies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
  },
  currentPage: 1,
  currentView: 'cards'
};

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    view.showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    controller.addToFavorite(Number(event.target.dataset.id));
  }
});

searchForm.addEventListener("submit", function searchFormSubmit(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  console.log(keyword);

  if (!keyword.length) {
    return alert("請輸入有效字串!");
  }

  //  for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie)
  //   }
  //  }

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字: ${keyword} 沒有符合條件的電影`);
  }
  view.renderPaginator(filteredMovies.length);
  view.renderMovieCards(model.getMoviesByPage(1));
});

paginator.addEventListener("click", function onPagination(event) {
  if (event.target.tagName != "A") return;
  const page = Number(event.target.dataset.page);
  model.currentPage = page
  switch (model.currentView) {
    case 'cards' : view.renderMovieCards(model.getMoviesByPage(page));
    break
    case 'list' : view.renderMovieList(model.getMoviesByPage(page));
    break
  }
});

faTh.addEventListener("click", (event) => {
  view.renderMovieCards(model.getMoviesByPage(model.currentPage));
  model.currentView = 'cards'
});

faBars.addEventListener('click', event => {
  view.renderMovieList(model.getMoviesByPage(model.currentPage));
  model.currentView = "list";
})

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);
    view.renderPaginator(movies.length);
    view.renderMovieCards(model.getMoviesByPage(1));
  })
  .catch((error) => {
    console.log(error);
  });
