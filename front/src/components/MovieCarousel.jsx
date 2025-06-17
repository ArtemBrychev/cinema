/*
Компонент MovieCarousel - карусель для отображения подборки фильмов.
Основной функционал:
- Отображение фильмов в горизонтальном слайдере
- Автоматическое переключение слайдов
- Переход на страницу просмотра при клике

Функции:
- fetchSelection - загрузка подборки фильмов с сервера

Запросы:
- GET /api/films/selection - получение подборки фильмов
- GET /api/film/cover/{id} - получение обложки фильма

Состояния:
- films - массив с данными о фильмах

Элементы:
- Карусель с автоматической прокруткой (4 секунды)
- Фоновая картинка - обложка фильма
- Подпись с названием и описанием фильма
- Ссылка на страницу просмотра (/player/{id})
*/

import Carousel from "react-bootstrap/Carousel";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MovieCarousel.css";

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
    <Carousel className="mb-4 movie-carousel" indicators={false}>
      {films.map((film) => (
        <Carousel.Item key={film.id} interval={4000}>
          <div style={{ height: "480px", position: "relative" }}>
            <Link
              to={`/player/${film.id}`}
              style={{
                display: "block",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(/api/film/cover/${film.id})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <Carousel.Caption
                style={{
                  backgroundColor: "rgba(0,0,0,0.5)",
                  borderRadius: "10px",
                  padding: "10px",
                }}
              >
                <h3>{film.name}</h3>
                <p>{film.description?.slice(0, 100)}...</p>
              </Carousel.Caption>
            </Link>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default MovieCarousel;