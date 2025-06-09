import React from 'react';
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, showRemoveButton = false, onRemove }) => {
  const id = movie.id || movie.filmId;
  const { name, director, description, cloudKey } = movie;

  const coverUrl = cloudKey ? `/api/film/cover/${id}` : null;

  return (
    <Card style={{ width: '100%' }} border="0" className="mb-3 d-flex flex-row align-items-stretch">
      {/* Блок с изображением - улучшенные стили */}
      {coverUrl && (
        <div style={{ 
          width: '200px', // Увеличил ширину
          minWidth: '200px', // Фиксированная минимальная ширина
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '15px', // Увеличил отступы
          overflow: 'hidden' // На случай, если изображение выходит за границы
        }}>
          <img
            src={coverUrl}
            alt={`Обложка фильма ${name}`}
            style={{ 
              width: '100%',
              height: 'auto',
              maxHeight: '280px', // Увеличил максимальную высоту
              objectFit: 'contain', // Изменил на 'contain' чтобы все изображение было видно
              borderRadius: '8px',
              margin: '0 auto' // Центрирование
            }}
          />
        </div>
      )}

      {/* Блок с контентом - добавил padding */}
      <Card.Body style={{ 
        flex: '1 1 auto',
        padding: '20px' // Добавил отступы внутри блока
      }}>
        <Card.Title>{name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{director}</Card.Subtitle>
        <Card.Text>{description}</Card.Text>

        <div className="d-flex gap-2">
          <Button variant="primary" as={Link} to={`/player/${id}`}>
            Смотреть
          </Button>

          {showRemoveButton && (
            <Button variant="danger" onClick={() => onRemove(id)}>
              Удалить из избранного
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;