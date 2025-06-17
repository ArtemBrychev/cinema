/*
Компонент RuTubePlayer - страница просмотра фильма с плеером.
Основной функционал:
- Воспроизведение фильма через RuTube плеер
- Управление избранным (добавление/удаление)
- Отображение информации о фильме
- Секция отзывов

Функции:
- fetchMovie - загрузка данных о фильме
- checkIfLiked - проверка наличия в избранном
- handleAddToFavourite - добавление в избранное
- handleRemoveFromFavourite - удаление из избранного

Запросы:
- GET /api/films/film/{id} - получение данных фильма
- GET /api/check/like/{id} - проверка избранного
- POST /api/newlike/{id} - добавление в избранное
- DELETE /api/delete/like/{id} - удаление из избранного

Состояния:
- movie - данные о фильме
- isLiked - статус избранного
- loading - состояние загрузки
- error - сообщение об ошибке

Контекст:
- useAuth - данные аутентификации (isAuthenticated, token)

Элементы:
- Плеер RuTube
- Информация о фильме (название, описание)
- Кнопка управления избранным
- Секция отзывов (ReviewSection)
*/

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './RuTubePlayer.css';
import ReviewSection from '../components/ReviewSection';
import { useAuth } from '../context/AuthContext';

function RuTubePlayer() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, token } = useAuth();

  const fetchMovie = async () => {
    try {
      const response = await fetch(`/api/films/film/${id}`);
      if (!response.ok) throw new Error('Ошибка при получении фильма');
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error("Ошибка загрузки фильма:", error);
      setError('Не удалось загрузить фильм');
    }
  };

  const checkIfLiked = async () => {
    if (!isAuthenticated || !token) {
      setIsLiked(false);
      return;
    }

    try {
      const response = await fetch(`/api/check/like/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          setIsLiked(false);
          return;
        }
        throw new Error('Ошибка при проверке избранного');
      }
      
      const data = await response.json();
      setIsLiked(data === true);
    } catch (error) {
      console.error('Ошибка проверки избранного:', error);
      setIsLiked(false);
    }
  };

  const handleAddToFavourite = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/newlike/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.status === 400) {
        const data = await response.json();
        throw new Error(data.error || 'Фильм уже в избранном');
      }
      
      if (!response.ok) {
        throw new Error('Не удалось добавить в избранное');
      }

      setIsLiked(true);
      
    } catch (error) {
      console.error('Ошибка при добавлении в избранное:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavourite = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/delete/like/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok && response.status !== 404) {
        throw new Error('Не удалось удалить из избранного');
      }
      
      setIsLiked(false);
    } catch (error) {
      console.error('Ошибка при удалении из избранного:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
    
    if (isAuthenticated) {
      checkIfLiked();
    } else {
      setIsLiked(false);
    }
  }, [id, isAuthenticated]);

  if (!movie) {
    return (
      <div className="text-center mt-4">
        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          'Загрузка фильма...'
        )}
      </div>
    );
  }

  return (
    <div className='playerStyles mx-2'>
      <h2 className='titleStyles mt-1'>Фильм: {movie.name}</h2>
      
      <div className='iframeContainerStyles'>
        <iframe
          className='iframeStyles'
          src={movie.rutubeLink}
          frameBorder="0"
          allow="clipboard-write; autoplay"
          allowFullScreen
          title="RuTube Video Player"
        ></iframe>
      </div>

      <h3 className='mt-3'>Описание:</h3>
      <p className='mb-4'>{movie.description}</p>

      {error && (
        <div className="alert alert-warning mb-3">
          {error}
        </div>
      )}

      {isAuthenticated ? (
        <button
          onClick={isLiked ? handleRemoveFromFavourite : handleAddToFavourite}
          disabled={loading}
          className={`btn ${isLiked ? 'btn-danger' : 'btn-primary'} mb-4`}
          style={{ minWidth: '200px' }}
        >
          {loading ? (
            <span>
              {isLiked ? 'Удаление...' : 'Добавление...'}
            </span>
          ) : (
            <span>
              {isLiked ? 'Удалить из избранного 💔' : 'Добавить в избранное ❤️'}
            </span>
          )}
        </button>
      ) : (
        <p className='text-warning mb-4'>
          Войдите в систему, чтобы добавлять фильмы в избранное
        </p>
      )}

      <ReviewSection filmId={id} />
    </div>
  );
}

export default RuTubePlayer;