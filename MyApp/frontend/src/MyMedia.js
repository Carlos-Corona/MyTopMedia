import React, { useState, useEffect } from "react";
import "./App.css";
import "./style.css";
import moment from "moment";
import edit_image from "./edit.png";
const MyMedia = ({ selectedMediaType, searchTerm }) => {

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
      const apiPath = "api/media"
      const generalPath = `${apiPath}`;
      const url = `http://192.168.100.30:5000/${generalPath}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setMediaData(data);
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
                media.cover
                  ?  media.cover
                  : "http://via.placeholder.com/1080x1580.png?text=Imagen+No+Disponible"
              }
              alt={media.title}
            />
            <div className="media-info">
              <h2>{truncateText(media.title, 30)}</h2>
              <span className={`${getColor(media.average_score)}`}>
                {media.average_score}
              </span>
            </div>
            <div className="type-data">
              <h3>{selectedMediaType}</h3>
            </div>
            <div class="edit btnUpdate" id="btnUpdate_${id}">
              <a><img src={edit_image} alt="Botón de editar"/></a>
            </div>
            <div className="overview">
              <h3>
                {media.title}
                <p>Puntaje: {media.average_score}</p>
              </h3>
              <span className="release_date">
                Estreno:
                <p>
                  {moment(media.release_date).format("LL")}
                </p>
              </span>
              <h3>Sinopsis</h3>
              <p align="justify">{truncateText(media.descr,535)}</p>
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
                <button type="submit" className="btnDelete" id="btnDelete" onClick={() => {
                    console.log("Eliminar de favoritos");
                  }} >
                  Eliminar de favoritos
                      
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

export default MyMedia;