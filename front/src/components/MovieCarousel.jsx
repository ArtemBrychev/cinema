import Carousel from "react-bootstrap/Carousel";
import { useEffect, useState } from "react";

function MovieCarousel() {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    async function fetchSelection() {
      try {
        const res = await fetch("/api/films/selection");
        const data = await res.json();
        setFilms(data);
      } catch (err) {
        console.error("Ошибка загрузки подборки:", err);
      }
    }

    fetchSelection();
  }, []);

  if (films.length === 0) return null;

  return (
    <Carousel className="mb-4">
      {films.map((film, idx) => (
        <Carousel.Item key={film.id} interval={4000}>
          <div
            style={{
              height: "400px",
              backgroundImage: `url(/api/film/cover/${film.id})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Carousel.Caption style={{ backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "10px" }}>
            <h3>{film.name}</h3>
            <p>{film.description?.slice(0, 100)}...</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default MovieCarousel;
