import React, { useState } from "react";
import "./App.css";
import MediaSearch from "./MediaSearch";
import MyMedia from "./MyMedia";
import logo from "./powered_by.png";
function App() {
  const [selectedMediaType, setSelectedMediaType] = useState("Pelicula");
  const [searchTerm, setSearchTerm] = useState("");

  const handleMediaTypeClick = (event, mediaType) => {
    event.preventDefault();
    setSelectedMediaType(mediaType);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setSearchTerm(event.target.search.value);
  };

  return (
    <div className="App">
      <header>
        <nav className="content">
          <div className="sub_media">
            <div className="nav_wrapper">
              <a
                href="Home"
                className="logo"
                onClick={(event) => handleMediaTypeClick(event, "")}
              >
                AllTimeFavs
              </a>
              <a
                href="my_media"
                className="my_media"
                onClick={(event) => handleMediaTypeClick(event, "MyMedia")}
              >
                Mis Favoritos
              </a>
              <a
                href={`movies_search?query=${searchTerm}?mediaType=Pelicula`}
                className="movies_search"
                onClick={(event) => handleMediaTypeClick(event, "Pelicula")}
              >
                Buscar Películas
              </a>
              <a
                href={`series_search?query=${searchTerm}?mediaType=Series`}
                className="series_search"
                onClick={(event) => handleMediaTypeClick(event, "Series")}
              >
                Buscar Series
              </a>
            </div>
          </div>
        </nav>
      </header>
      <main>
        <section
          className={`inner_content new_index_common ${
            selectedMediaType === "Pelicula"
              ? "new_index_movies"
              : "new_index_series"
          }`}
        >
          <div className="content_wrapper wrap">
            <div className="title">
              <h1>
                {selectedMediaType === "Pelicula"
                  ? "Bienvenido al maravilloso mundo del Cine"
                  : "Bienvenido al maravilloso mundo de las Series"}
              </h1>
              <h3>
                {selectedMediaType === "Pelicula"
                  ? "Centro de búsquedas de Peliculas"
                  : "Centrol de búsquedas de Series"}
              </h3>
              <img
                src={logo}
                alt="Logo del centro de búsqueda"
                width="165"
                height="65"
              />
            </div>
            <div className="search-nav">
              <form
                id="form"
                style={{ margin: "auto", maxWidth: "500px" }}
                onSubmit={handleFormSubmit}
              >
                <label htmlFor="search" className="hidden">
                  Buscar películas y TV Shows:
                </label>
                <input
                  type="text"
                  placeholder="Peliculas, TV Shows..."
                  id="search"
                  className="search"
                />
              </form>
            </div>
          </div>
        </section>
        {selectedMediaType === "Pelicula" || selectedMediaType === "Series" ? (
          <MediaSearch
            selectedMediaType={selectedMediaType}
            searchTerm={searchTerm}
          />
        ) : selectedMediaType === "MyMedia" ? (
          <MyMedia />
        ) : null}
      </main>
    </div>
  );
}

export default App;
