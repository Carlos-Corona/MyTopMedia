const IP = "192.168.1.69";
const API_KEY = "api_key=530e0261c942a040e464884807ad95d8";
const BASE_URL = "https://api.themoviedb.org/3";
const LANG = "&language=es-ES";
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const API_URL_MOVIE =
  BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY + LANG;
const API_URL_TV =
  BASE_URL + "/discover/tv?sort_by=popularity.desc&" + API_KEY + LANG;
const searchMovie = "/search/movie?";
const searchTV = "/search/tv?";
const searchURL_MOVIE = BASE_URL + searchMovie + API_KEY + LANG;
const searchURL_TV = BASE_URL + searchTV + API_KEY + LANG;

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const mediaTypeSelect = document.getElementById("media-type");
const moviesSearchLink = document.querySelector(".movies_search");
const seriesSearchLink = document.querySelector(".series_search");
const searchBarText = document.querySelector(".title h3");
const newIndexSection = document.querySelector(
  ".inner_content.new_index_common"
);
let selectedMediaType = "Pelicula";

getMedia_TMDB(API_URL_MOVIE, "Pelicula");

function getMedia_TMDB(urlMedia, mediaType) {
  const asyncPostCall = async (urlMedia) => {
    try {
      const response = await fetch(urlMedia, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: undefined,
      });
      await response.json().then((dataMedia) => {
        // enter you logic when the fetch is successful
        showMedia_TMDB(dataMedia.results, mediaType);
      });
    } catch (error) {
      // enter your logic for when there is an error (ex. error toast)
      console.log(error);
    }
  };
  asyncPostCall(urlMedia);
}
function showMedia_TMDB(data, mediaType) {
  main.innerHTML = "";

  data.forEach((media) => {
    const title = mediaType === "Pelicula" ? media.title : media.name;
    const release_date =
      mediaType === "Pelicula" ? media.release_date : media.first_air_date;
    const poster_path = media.poster_path;
    const vote_average = media.vote_average;
    const overview = media.overview;
    const id = media.id;

    const mediaElement = document.createElement("div");
    const full_date = moment(release_date).format("DD MMMM YYYY");

    mediaElement.classList.add("media");
    mediaElement.innerHTML = `
            <p hidden>${id}</p>
            <img src="${
              poster_path
                ? IMG_URL + poster_path
                : "http://via.placeholder.com/1080x1580.png?text=Imagen+No+Disponible"
            }" alt="${title}">
            <div class="media-info">
                <h2>${title}</h2>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="type-data">
                <h3>${mediaType}</h3>
            </div>
            <div class="overview">
                <h3>${title}<p>Puntaje: ${vote_average}</p> </h3>
                <span class="release_date">
                    Estreno: 
                    <p>${full_date}</p>
                </span>
                <h3>Sinopsis</h3>
                <p align="justify">
                ${overview}
                <p/> 
            </div>
            <div class="action-buttons">
                <div class="action_inner">
                    <button type="submit" class="btnGoto" id=${id} >Ver en TMDB</button>
                    <button type="submit" class="btnSaveto" id="btnSaveto">Guardar</button>
                </div>
                
            </div>
            <div class="space-between"></div>
        `;
    main.appendChild(mediaElement);

    document.getElementById(id).addEventListener("click", () => {
      openNav(id, mediaType);
    });
  });
}
function getColor(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

on(document, "click", ".btnSaveto", (e) => {
  const id_media =
    e.target.parentNode.parentNode.parentNode.firstElementChild.innerHTML;
  return getMediaInfo(id_media, selectedMediaType);
});



function getMediaInfo(id_media, mediaType) {
  const BackURL = "http://" + IP + ":3000/api/media/";
  let FULL_URL = "";
  mediaType === "Pelicula" ? "Pelicula" : "Serie";
  let params = {
    id: 1,
    title: "",
    descr: "",
    cover: "",
    vote_average: 1,
    release_date: "",
    media_type: mediaType,
    youtube_trailler: "",
  };
  if (mediaType === "Pelicula") {
    FULL_URL = BASE_URL + "/movie/" + id_media + "?" + API_KEY + LANG;
    fetch(FULL_URL)
      .then((res) => res.json())
      .then((dataMedia) => {
        const { title, poster_path, vote_average, overview, id, release_date } =
          dataMedia;
        params.id = id;
        params.title = title;
        params.descr = overview;
        params.cover = IMG_URL + poster_path;
        params.average_score = vote_average.toFixed(1);
        params.release_date = release_date;
        params.media_type = "Movie";
        params.youtube_trailer = "youtube.com";
        asyncPostCall(params);
      })
      .catch((err) => console.log(err));
  } else {
    FULL_URL = BASE_URL + "/tv/" + id_media + "?" + API_KEY + LANG;
    fetch(FULL_URL)
      .then((res) => res.json())
      .then((dataMedia) => {
        const {
          name,
          poster_path,
          vote_average,
          overview,
          id,
          first_air_date,
        } = dataMedia;
        params.id = id;
        params.title = name;
        params.descr = overview;
        params.cover = IMG_URL + poster_path;
        params.average_score = vote_average.toFixed(1);
        params.release_date = first_air_date;
        params.media_type = "Series";
        params.youtube_trailer = "youtube.com";
        asyncPostCall(params);
      })
      .catch((err) => console.log(err));
  }
  const asyncPostCall = async (parameters) => {
    try {
      const response = await fetch(BackURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parameters),
      });
      const data = await response.json();
      // enter you logic when the fetch is successful
    } catch (error) {
      // enter your logic for when there is an error (ex. error toast)
      console.log("A simpe error?? getMediaInfo");
      console.log(error);
    }
  };
}

function openNav(id, mediaType) {
  const Link =
    "https://www.themoviedb.org" +
    (mediaType === "Pelicula" ? "/movie/" : "/tv/") +
    id +
    "?language=es-ES";
  window.open(Link, "_blank");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  const mediaType = selectedMediaType;
  if (searchTerm) {
    if (mediaType === "Pelicula") {
      getMedia_TMDB(searchURL_MOVIE + "&query=" + searchTerm, mediaType);
    } else {
      getMedia_TMDB(searchURL_TV + "&query=" + searchTerm, mediaType);
    }
  } else {
    if (mediaType === "Pelicula") {
      getMedia_TMDB(API_URL_MOVIE, mediaType);
    } else {
      getMedia_TMDB(API_URL_TV, mediaType);
    }
  }
});

function handleMediaTypeClick(event) {
  event.preventDefault();
  selectedMediaType = event.target.getAttribute("data-media-type");
  form.dispatchEvent(new Event("submit"));
}

document
  .querySelector(".movies_search")
  .addEventListener("click", handleMediaTypeClick);
document
  .querySelector(".series_search")
  .addEventListener("click", handleMediaTypeClick);

moviesSearchLink.addEventListener("click", (event) => {
  event.preventDefault();
  searchBarText.textContent = "Centro de búsqueda de Películas:";
  newIndexSection.classList.remove("new_index_series");
  newIndexSection.classList.add("new_index_movies");
});

seriesSearchLink.addEventListener("click", (event) => {
  event.preventDefault();
  searchBarText.textContent = "Centro de búsqueda de Series:";
  newIndexSection.classList.remove("new_index_movies");
  newIndexSection.classList.add("new_index_series");
});
