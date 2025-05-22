import { useEffect, useState } from 'react';
import { Row, Col } from "react-bootstrap";
import MovieCard from '../components/MovieCard';
import CategoryFilter from '../components/CategoryFilter'; // ⬅️ Добавили фильтр

function List() {
  const [movies, setMovies] = useState([]);  // Состояние для фильмов
  const [categoryId, setCategoryId] = useState(null); // Здесь можно хранить ID категории, если нужно

  // Функция для получения данных с сервера
  const fetchMovies = async () => {
    try {
      let url = "/api/films"; // Базовый URL
      if (categoryId) {
        url += `?categoryId=${categoryId}`;  // Если есть categoryId, добавляем его как query параметр
      }

      console.log("Запрос: ", url)
      const response = await fetch(url);  // Делаем GET запрос
      if (!response.ok) {
        throw new Error('Ошибка при получении фильмов');
      }
      
      const data = await response.json();  // Получаем JSON из ответа
      setMovies(data);  // Обновляем состояние, чтобы отобразить фильмы
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  useEffect(() => {
    fetchMovies(); // Запрашиваем фильмы при загрузке компонента
  }, [categoryId]); // Если categoryId изменяется, повторно запрашиваем данные

  return (
    <div>
      <div className="d-flex gap-3 my-2 align-items-center">
        <h1>Список фильмов</h1>
        
        <CategoryFilter onSelectionChange={(ids) => {
          setCategoryId(ids.length > 0 ? ids[0] : null); // ⬅` Обновляем выбранную категорию
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
