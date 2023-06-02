const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const urlLocal = "http://localhost:3000/api/media/";

getMyMediaDB(urlLocal);

function getMyMediaDB(urlM) {
  fetch(urlM)
    .then((res) => res.json())
    .then((dataM) => {
      showMediaDB(dataM);
    });
}

function showMediaDB(data) {
  main.innerHTML = "";

  data.forEach((media) => {
    const { title, cover, average_score, descr, id, release_date, media_type } =
      media;
    const mediaElement = document.createElement("div");
    const full_date = moment(release_date).format("DD MMMM YYYY");

    mediaElement.classList.add("media");
    mediaElement.innerHTML = `
            <p hidden>${id}</p>
            <img class="img" id="imgClick" src="${
              cover ? cover : "http://via.placeholder.com/1080x1580"
            }" alt="${title}">
            <div class="media-info">
                <h3>${title}</h3>
                <span class="${getColor(average_score)}">${average_score}</span>
            </div>
            <div class="type-data">
                <h3>${media_type}</h3>
            </div>
            <div class="edit btnUpdate" id="btnUpdate_${id}">
              <a><img src="./edit.png" alt="Botón de editar"></a>
            </div>
            <div class="overview">
                <h3>${title}<p>Puntaje: ${average_score}</p> </h3>
                <span class="release_date">
                    Estreno: 
                    <p>${full_date}</p>
                </span>
                <h3>Sinopsis</h3>
                <p align="justify">
                ${descr}
                <p/> 
            </div>
            <img class="play-icon imgClick" src="./play.png" alt="Botón de reproducir">
            <div class="action-buttons">
                <div class="action_inner">
                    <button type="submit" class="btnGoto" id="btnGoto_${id}">Ver en TMDB</button>
                    <button type="submit" class="btnDelete" id="btnDelete_${id}">Eliminar Favorito</button>
                </div>
            </div>
            <div class="space-between"></div>   
        `;
    main.appendChild(mediaElement);

    document.getElementById(`btnGoto_${id}`).addEventListener("click", () => {
      openNav(id, media_type);
    });

    document.getElementById(`btnDelete_${id}`).addEventListener("click", () => {
      deleteFuntionRestAPI(id);
    });

    document.getElementById(`btnUpdate_${id}`).addEventListener("click", () => {
      saveIDtoBack_Action(id, 1);
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
on(document, "click", ".imgClick", (e) => {
  const id = e.target.parentNode.firstElementChild.innerHTML;
  console.log(id);
  return saveIDtoBack_Action(id, 0);
});

on(document, "click", ".btnDelete", (e) => {
  const id_movie =
    e.target.parentNode.parentNode.parentNode.firstElementChild.innerHTML;
  return deleteFuntionRestAPI(id_movie);
});

on(document, "click", ".btnUpdate", (e) => {
  const id_movie =
    e.target.parentNode.parentNode.parentNode.firstElementChild.innerHTML;
  return saveIDtoBack_Action(sent, 1);
});

function saveIDtoBack_Action(id, option) {
  const BackURL = "http://localhost:3000/api/store/last_id/" + id;

  const asyncPostCall = async () => {
    try {
      const response = await fetch(BackURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: undefined,
        mode: "cors",
      });
      const data = await response.json();
      // enter you logic when the fetch is successful
      console.log(data);
    } catch (error) {
      // enter your logic for when there is an error (ex. error toast)
      console.log(error);
    }
  };

  asyncPostCall();
  if (option) {
    window.open("./Update.html", "_self");
  } else {
    window.open("./view.html", "_self");
  }
}

function deleteFuntionRestAPI(id) {
  const BackURL = "http://localhost:3000/api/media/";
  const FULL_URL = BackURL + id;
  console.log(FULL_URL);
  const asyncPostCall = async (FULL_URL) => {
    try {
      const response = await fetch(FULL_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: undefined,
      });
      const data = await response.json();
      // enter you logic when the fetch is successful
      getMyMediaDB(urlLocal);
    } catch (error) {
      // enter your logic for when there is an error (ex. error toast)
      console.log(error);
    }
  };
  asyncPostCall(FULL_URL);
}
function openNav(id, media_type) {
  if (media_type == "Serie") {
    const Link = "https://www.themoviedb.org" + "/tv/" + id + "?language=es-ES";
    window.open(Link, "_blank");
  } else {
    const Link =
      "https://www.themoviedb.org" + "/movie/" + id + "?language=es-ES";
    window.open(Link, "_blank");
  }
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm) {
    getTV(searchURL_TV + LANG + "&query=" + searchTerm);
  } else {
    getTV(API_URL_TV);
  }
});
