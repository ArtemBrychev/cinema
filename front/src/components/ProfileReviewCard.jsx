/*
Компонент ProfileReviewCard - карточка отзыва пользователя на фильм.
Основной функционал:
- Отображение отзыва с цветовой индикацией оценки
- Показ обложки фильма
- Навигация на страницу фильма

Функции:
- getStyleAndLabel - определение стилей и текста по рейтингу

Пропсы:
- review - объект с данными отзыва:
  * filmId - ID фильма
  * filmName - название фильма
  * reviewText - текст отзыва
  * rating - оценка (1-5)
  * cloudKey - ключ для получения обложки

Элементы:
- Обложка фильма (если доступна)
- Название фильма (ссылка на страницу)
- Оценка с цветовой индикацией
- Текст отзыва

Стили:
- Зеленый фон для оценок 4-5 ("Рекомендую")
- Желтый фон для оценки 3 ("Смешанные чувства")
- Красный фон для оценок 1-2 ("Не рекомендую")
*/

import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

const getStyleAndLabel = (rating) => {
  if (rating >= 4) {
    return { backgroundColor: 'rgb(102, 255, 204)', color: 'black', label: 'Рекомендую' };
  } else if (rating === 3) {
    return { backgroundColor: 'rgb(255, 255, 204)', color: 'black', label: 'Смешанные чувства' };
  } else {
    return { backgroundColor: 'rgb(255, 153, 153)', color: 'black', label: 'Не рекомендую' };
  }
};

const ProfileReviewCard = ({ review }) => {
  const { filmId, filmName, reviewText, rating, cloudKey } = review;
  const { backgroundColor, color, label } = getStyleAndLabel(rating);
  
  const coverUrl = cloudKey ? `/api/film/cover/${filmId}` : null;

  return (
    <Card style={{ backgroundColor, color, border: '0' }} className="mb-3 d-flex flex-row">
      {coverUrl && (
        <div style={{ 
          width: '150px',
          minWidth: '150px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
          overflow: 'hidden'
        }}>
          <img
            src={coverUrl}
            alt={`Обложка фильма ${filmName}`}
            style={{ 
              width: '100%',
              height: 'auto',
              maxHeight: '200px',
              objectFit: 'cover',
              borderRadius: '4px'
            }}
          />
        </div>
      )}

      <Card.Body style={{ flex: '1 1 auto' }}>
        <Card.Title>
          <Link to={`/player/${filmId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            {filmName}
          </Link>
        </Card.Title>
        <Card.Subtitle className="mb-2">
          <strong>Оценка: {rating}</strong> — {label}
        </Card.Subtitle>
        <Card.Text>{reviewText}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProfileReviewCard;