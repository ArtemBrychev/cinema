/*
Компонент MovieCard - карточка для отображения информации о фильме.
Основной функционал:
- Отображение обложки фильма
- Показ основной информации (название, режиссер, описание)
- Предоставление кнопки для просмотра фильма
- Возможность удаления из избранного (при наличии флага)

Пропсы:
- movie - объект с данными о фильме (id, name, director, description, cloudKey)
- showRemoveButton - флаг отображения кнопки удаления
- onRemove - callback для удаления фильма

Элементы:
- Обложка фильма (если есть cloudKey)
- Название фильма
- Имя режиссера
- Описание фильма
- Кнопка "Смотреть" (переход на страницу просмотра)
- Кнопка "Удалить из избранного" (при showRemoveButton=true)

Запросы:
- GET /api/film/cover/{id} - получение обложки фильма
*/

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
      {coverUrl && (
        <div style={{ 
          width: '200px',
          minWidth: '200px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '15px',
          overflow: 'hidden'
        }}>
          <img
            src={coverUrl}
            alt={`Обложка фильма ${name}`}
            style={{ 
              width: '100%',
              height: 'auto',
              maxHeight: '280px',
              objectFit: 'contain',
              borderRadius: '8px',
              margin: '0 auto'
            }}
          />
        </div>
      )}

      <Card.Body style={{ 
        flex: '1 1 auto',
        padding: '20px'
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