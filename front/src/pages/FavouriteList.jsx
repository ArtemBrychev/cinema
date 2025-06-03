import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import MovieCard from '../components/MovieCard';
import { useAuth } from '../context/AuthContext';

function FavouriteList() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchFavourites = async () => {
    try {
      const response = await fetch('/api/likes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке избранного');
      }

      const data = await response.json();
      setFavourites(data);
    } catch (err) {
      console.error('Ошибка:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (filmId) => {
    try {
      const response = await fetch(`/api/delete/like/${filmId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении');
      }

      setFavourites(prev => prev.filter(fav => fav.filmId !== filmId));
    } catch (err) {
      console.error('Ошибка удаления:', err);
      alert('Не удалось удалить фильм');
    }
  };

  useEffect(() => {
    if (token) {
      fetchFavourites();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
        <p>Загрузка избранных фильмов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-3">
        {error}
        <Button 
          variant="link" 
          onClick={fetchFavourites}
          className="p-0 ms-2"
        >
          Попробовать снова
        </Button>
      </Alert>
    );
  }

  return (
    <div className="px-3">
      <h2 className="my-3">Избранные фильмы</h2>
      
      {favourites.length === 0 ? (
        <p className="text-muted">Список избранного пуст</p>
      ) : (
        <Row md={1} className="g-3">
          {favourites.map((movie) => (
            <Col key={movie.filmId}>
              <MovieCard
                movie={{ ...movie, id: movie.filmId }}
                showRemoveButton={true}
                onRemove={() => handleRemove(movie.filmId)}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default FavouriteList;
