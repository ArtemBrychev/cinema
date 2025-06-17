/*
Компонент ReviewCard - карточка отзыва с возможностью редактирования.
Основной функционал:
- Отображение отзыва с цветовой индикацией оценки
- Показ аватара автора и ссылки на профиль
- Редактирование и удаление отзыва (для владельца)
- Автоматическое изменение размера текстового поля

Функции:
- getStyleAndLabel - определение стилей и текста по рейтингу
- handleDelete - удаление отзыва
- handleUpdate - сохранение изменений отзыва

Запросы:
- GET /api/user/profilepic/{userId} - получение аватара пользователя
- DELETE /api/delete/review/{id} - удаление отзыва
- PUT /api/change/review - обновление отзыва

Состояния:
- isEditing - режим редактирования
- editedText - редактируемый текст отзыва
- editedRating - редактируемая оценка
- avatarSrc - URL аватара пользователя

Пропсы:
- review - объект с данными отзыва:
  * userId - ID автора
  * userName - имя автора
  * reviewText - текст отзыва
  * reviewDate - дата отзыва
  * rating - оценка (1-5)
  * id - ID отзыва
  * filmId - ID фильма
- isOwn - флаг принадлежности отзыва текущему пользователю
- onDelete - callback при удалении отзыва
- onUpdate - callback при обновлении отзыва

Элементы:
- Аватар автора (ссылка на профиль)
- Информация об авторе и оценке
- Текст отзыва (или форма редактирования)
- Кнопки управления (для владельца)
- Дата отзыва
*/

import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Form, Button, Image } from 'react-bootstrap';
import userPlaceholder from '../assets/user_placeholder.png';

const getStyleAndLabel = (rating) => {
  if (rating >= 4) {
    return { backgroundColor: 'rgb(102, 255, 204)', color: 'black', label: 'Рекомендую' };
  } else if (rating === 3) {
    return { backgroundColor: 'rgb(255, 255, 204)', color: 'black', label: 'Смешанные чувства' };
  } else {
    return { backgroundColor: 'rgb(255, 153, 153)', color: 'black', label: 'Не рекомендую' };
  }
};

const ReviewCard = ({ review, isOwn, onDelete, onUpdate }) => {
  const { token } = useAuth();
  const { userId, userName, reviewText, reviewDate, rating } = review;
  const { backgroundColor, color, label } = getStyleAndLabel(rating);

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(reviewText);
  const [editedRating, setEditedRating] = useState(rating);
  const [avatarSrc, setAvatarSrc] = useState(userPlaceholder);

  useEffect(() => {
    let currentUrl = null;

    const fetchAvatar = async () => {
      try {
        const response = await fetch(`/api/user/profilepic/${userId}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setAvatarSrc(url);
          currentUrl = url;
        } else {
          setAvatarSrc(userPlaceholder);
        }
      } catch (err) {
        console.warn('Фотография отсутствует:', err.message);
        setAvatarSrc(userPlaceholder);
      }
    };

    fetchAvatar();

    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [userId, token]);

  useEffect(() => {
    if (isEditing) {
      const textarea = document.querySelector('.autosize-textarea');
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }
  }, [isEditing, editedText]);

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить отзыв?')) return;

    try {
      const response = await fetch(`/api/delete/review/${review.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onDelete(review.id);
      } else {
        const errorText = await response.text();
        alert(`Ошибка при удалении: ${errorText}`);
      }
    } catch (error) {
      console.error('Ошибка удаления отзыва:', error);
      alert('Ошибка при удалении отзыва.');
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch('/api/change/review', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id: review.id,
          reviewText: editedText,
          rating: editedRating,
          filmId: review.filmId
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      setIsEditing(false);
      onUpdate({ ...review, reviewText: editedText, rating: editedRating });
    } catch (err) {
      console.error('Ошибка при обновлении отзыва:', err);
      alert('Ошибка при изменении отзыва');
    }
  };

  return (
    <Card style={{ 
      backgroundColor, 
      color, 
      border: '0',
      marginTop: '0.5rem'
    }} className="mb-3 d-flex flex-row">
      <Link 
        to={`/user_profile/${userId}`}
        style={{
          width: '80px',
          minWidth: '80px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '10px 10px 10px 0',
          textDecoration: 'none'
        }}
      >
        <Image 
          src={avatarSrc} 
          roundedCircle 
          style={{ 
            width: '60px', 
            height: '60px',
            objectFit: 'cover',
            marginTop: '0.2rem'
          }}
          alt={`Аватар ${userName}`}
        />
      </Link>

      <Card.Body style={{ 
        flex: '1 1 auto',
        paddingTop: '0.8rem'
      }}>
        <Card.Subtitle className="mb-2">
          <strong>Оценка: {rating}</strong> — {label} от{' '}
          <Link to={`/user_profile/${userId}`} style={{ color: 'inherit', textDecoration: 'underline' }}>
            {userName}
          </Link>
        </Card.Subtitle>

        {isEditing ? (
          <>
            <Form.Group className="mb-2">
              <Form.Label>Редактировать отзыв</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                className="autosize-textarea"
                value={editedText}
                onChange={(e) => {
                  setEditedText(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                style={{ 
                  overflow: 'hidden',
                  resize: 'none',
                  minHeight: '100px'
                }}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Оценка (1–5)</Form.Label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Form.Control
                  type="number"
                  min="1"
                  max="5"
                  value={editedRating}
                  onChange={(e) => setEditedRating(Number(e.target.value))}
                  required
                  style={{
                    width: "80px",
                    marginRight: "10px",
                    textAlign: "center"
                  }}
                />
                <div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setEditedRating(prev => Math.min(prev + 1, 5))}
                    className="me-1"
                  >
                    +
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setEditedRating(prev => Math.max(prev - 1, 1))}
                  >
                    −
                  </Button>
                </div>
              </div>
            </Form.Group>
            <Button size="sm" variant="success" onClick={handleUpdate} className="me-2">
              Сохранить
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
              Отмена
            </Button>
          </>
        ) : (
          <>
            <Card.Text style={{ marginTop: '0.5rem' }}>{reviewText}</Card.Text>
            {isOwn && (
              <div className="mt-2">
                <Button variant="warning" size="sm" onClick={() => setIsEditing(true)} className="me-2">
                  Изменить
                </Button>
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  Удалить
                </Button>
              </div>
            )}
          </>
        )}

        <Card.Footer style={{ 
          color: 'rgba(0, 0, 0, 0.5)',
          padding: '0.5rem 0',
          marginTop: '0.5rem'
        }}>
          Дата отзыва: {reviewDate}
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;