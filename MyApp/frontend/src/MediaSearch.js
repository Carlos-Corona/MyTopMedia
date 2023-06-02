import React, { useState, useEffect } from "react";
import "./App.css";
import "./style.css";
import moment from "moment";

const MediaSearch = ({ selectedMediaType, searchTerm }) => {
  // Constants
  const IMG_URL = "https://image.tmdb.org/t/p/w500";

  // Functions
  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  }
  
  // States
  const [mediaData, setMediaData] = useState([]);

  // Fetch media data when selected media type or search term changes
  useEffect(() => {
    const fetchMediaData = async () => {
      const query = searchTerm ? encodeURIComponent(searchTerm) : "";
      const mediaType = selectedMediaType === "Pelicula" ? "Pelicula" : "Serie";
      const apiPath = "api/tmdb/media"
      const generalPath = `${apiPath}?mediaType=${mediaType}&query=${query}`;
      const url = `http://192.168.100.30:5000/${generalPath}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setMediaData(data.results);
      } catch (error) {
        console.log(error);
      }
    };


    fetchMediaData();
  }, [
    selectedMediaType,
    searchTerm,
  ]);

  // Handlers
  
  // Helper functions
  const getColor = (vote) => {
    if (vote >= 7) {
      return "green";
    } else if (vote >= 5) {
      return "orange";
    } else {
      return "red";
    }
  };
  return (
    <>
      <main id="main" className="main">
        {/* Display media */}
        {mediaData.map((media) => (
          <div key={media.id} className="media">
            <p hidden>{media.id}</p>
            <img
              src={
                media.poster_path
                  ? IMG_URL + media.poster_path
                  : "http://via.placeholder.com/1080x1580.png?text=Imagen+No+Disponible"
              }
              alt={media.title || media.name}
            />
            <div className="media-info">
              <h2>{truncateText(media.title || media.name, 30)}</h2>
              <span className={`${getColor(media.vote_average)}`}>
                {media.vote_average}
              </span>
            </div>
            <div className="type-data">
              <h3>{selectedMediaType}</h3>
            </div>
            <div className="overview">
              <h3>
                {media.title || media.name}
                <p>Puntaje: {media.vote_average}</p>
              </h3>
              <span className="release_date">
                Estreno:
                <p>
                  {selectedMediaType === "Pelicula"
                    ? moment(media.release_date).format("LL")
                    : moment(media.first_air_date).format("LL")}
                </p>
              </span>
              <h3>Sinopsis</h3>
              <p align="justify">{truncateText(media.overview,535)}</p>
            </div>
            <div className="action-buttons">
              <div className="action_inner">
                <button
                  type="submit"
                  className="btnGoto"
                  id={media.id}
                  onClick={() => {
                    window.open(
                      `https://www.themoviedb.org/${
                        selectedMediaType === "Pelicula" ? "movie" : "tv"
                      }/${media.id}`,
                      "_blank"
                    );
                  }}
                >
                  Ver en TMDB
                </button>
                <button type="submit" className="btnSaveto" id="btnSaveto" onClick={() => {
                    console.log("Guardado en favoritos");
                  }} >
                  Guardar en Favoritos
                      
                </button>
              </div>
            </div>
            <div className="space-between"></div>
          </div>
        ))}
      </main>
    </>
  );
};

export default MediaSearch;
