const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const movies = JSON.parse(localStorage.getItem("favoriteMovies"));
const dataPanel = document.querySelector("#data-panel");

function renderMovieList(data) {
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
                <button type="button" class="btn btn-danger btn-remove-favorite" data-id="${
                  item.id
                }">
                  X
                </button> 
              </div>
            </div>
          </div>
        </div>`;
  });
  dataPanel.innerHTML = rowHTML;
}

function showMovieModal(id) {
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
}

function removeFromFavorite(id) {
  const moviesIndex = movies.findIndex((movie) => movie.id === id )
  if (moviesIndex === -1) return
  movies.splice(moviesIndex, 1)
  localStorage.setItem("favoriteMovies" , JSON.stringify(movies))
  renderMovieList(movies)
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
  }
});

renderMovieList(movies);
