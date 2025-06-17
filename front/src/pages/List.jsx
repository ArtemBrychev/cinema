/*
Компонент List - страница списка фильмов с фильтрацией по категориям.
Основной функционал:
- Отображение карусели популярных фильмов
- Фильтрация фильмов по категориям
- Показ списка фильмов с возможностью фильтрации

Функции:
- fetchMovies - загрузка списка фильмов (с фильтрацией по категории)

Запросы:
- GET /api/films - получение всех фильмов
- GET /api/films?categoryId={id} - получение фильмов по категории

Состояния:
- movies - массив фильмов
- categoryId - ID выбранной категории (null если не выбрана)

Компоненты:
- MovieCarousel - карусель популярных фильмов
- CategoryFilter - компонент фильтрации по категориям
- MovieCard - карточка фильма

Элементы:
- Заголовок страницы
- Фильтр по категориям
- Список карточек фильмов
*/

import { useEffect, useState } from 'react';
import { Row, Col } from "react-bootstrap";
import MovieCard from '../components/MovieCard';
import CategoryFilter from '../components/CategoryFilter';
import MovieCarousel from "../components/MovieCarousel";

function List() {
  const [movies, setMovies] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  const fetchMovies = async () => {
    try {
      let url = "/api/films";
      if (categoryId) {
        url += `?categoryId=${categoryId}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Ошибка при получении фильмов');
      }
      
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [categoryId]);

  return (
    <div className='mt-4'>
      <MovieCarousel />
      <div className="d-flex gap-3 my-2 align-items-center">
        <h1>Список фильмов</h1>
        
        <CategoryFilter onSelectionChange={(ids) => {
          setCategoryId(ids.length > 0 ? ids[0] : null);
        }} />

      </div>
      
      <Row md={1} className='mb-2'>
        {movies.map((movie) => (
          <Col className='px-2 border' key={movie.id}>
            <MovieCard movie={movie} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default List;