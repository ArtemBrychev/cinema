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

  // 🔍 Запрос на сервер
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

  // 🔄 Срабатывает при загрузке страницы с query-параметром
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  // 🔘 Обработка отправки формы поиска
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
    performSearch(query);
  };

  return (
    <div className="container mt-4">
      <h2>Поиск фильмов</h2>

      {/* 🔎 Форма поиска */}
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

      {/* 📋 Результаты */}
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
