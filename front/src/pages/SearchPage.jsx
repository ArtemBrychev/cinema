/*
Компонент SearchPage - страница поиска фильмов.
Основной функционал:
- Поиск фильмов по названию и другим параметрам
- Отображение результатов поиска
- Сохранение поискового запроса в URL

Функции:
- performSearch - выполнение поискового запроса
- handleSubmit - обработка отправки поисковой формы

Запросы:
- POST /api/search - выполнение поиска по строке запроса

Состояния:
- query - текущий поисковый запрос
- results - массив найденных фильмов

Хуки:
- useSearchParams - получение параметров из URL
- useNavigate - навигация между страницами

Элементы:
- Поисковая форма с полем ввода
- Список результатов поиска (компоненты MovieCard)
- Сообщение при отсутствии результатов
*/

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import MovieCard from '../components/MovieCard';

function SearchPage() {
  const [params] = useSearchParams();
  const initialQuery = params.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const performSearch = (q) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(q),
    })
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => console.error('Ошибка поиска:', err));
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
    performSearch(query);
  };

  return (
    <div className="container mt-4">
      <h2>Поиск фильмов</h2>

      <Form className="d-flex my-3" onSubmit={handleSubmit}>
        <Form.Control
          type="search"
          placeholder="Введите запрос..."
          className="me-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" variant="primary">Поиск</Button>
      </Form>

      <h4>Результаты по запросу: "{initialQuery}"</h4>
      {results.length === 0 ? (
        <p>Ничего не найдено.</p>
      ) : (
        <Row md={1} className="mb-2">
          {results.map((movie) => (
            <Col className="px-2 border" key={movie.id}>
              <MovieCard movie={movie} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default SearchPage;