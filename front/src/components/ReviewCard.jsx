import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Form, Button, Image } from 'react-bootstrap';

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
  const [avatarSrc, setAvatarSrc] = useState(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch(`/api/user/profilepic/${userId}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });

        if (response.ok) {
          const blob = await response.blob();
          setAvatarSrc(URL.createObjectURL(blob));
        }
      } catch (err) {
        console.error('Ошибка загрузки аватара:', err);
      }
    };

    fetchAvatar();

    return () => {
      if (avatarSrc) {
        URL.revokeObjectURL(avatarSrc);
      }
    };
  }, [userId, token]);

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
      marginTop: '0.5rem' // Уменьшаем отступ сверху
    }} className="mb-3 d-flex flex-row">
      {/* Блок с аватаром (теперь кликабельный) */}
      <Link 
        to={`/user_profile/${userId}`}
        style={{
          width: '80px',
          minWidth: '80px',
          display: 'flex',
          alignItems: 'flex-start', // Выравниваем по верхнему краю
          justifyContent: 'center',
          padding: '10px 10px 10px 0', // Убираем левый padding
          textDecoration: 'none'
        }}
      >
        <Image 
          src={avatarSrc || '/default-avatar.jpg'} 
          roundedCircle 
          style={{ 
            width: '60px', 
            height: '60px',
            objectFit: 'cover',
            marginTop: '0.2rem' // Слегка смещаем вниз для визуального баланса
          }}
          alt={`Аватар ${userName}`}
        />
      </Link>

      {/* Блок с содержимым отзыва */}
      <Card.Body style={{ 
        flex: '1 1 auto',
        paddingTop: '0.8rem' // Уменьшаем отступ сверху
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
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Оценка</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={editedRating}
                onChange={(e) => setEditedRating(Number(e.target.value))}
              />
            </Form.Group>
            <Button size="sm" variant="success" onClick={handleUpdate} className="me-2">
              💾 Сохранить
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
              ❌ Отмена
            </Button>
          </>
        ) : (
          <>
            <Card.Text style={{ marginTop: '0.5rem' }}>{reviewText}</Card.Text>
            {isOwn && (
              <div className="mt-2">
                <Button variant="warning" size="sm" onClick={() => setIsEditing(true)} className="me-2">
                  ✏️ Изменить
                </Button>
                <Button variant="danger" size="sm" onClick={handleDelete}>
                  🗑️ Удалить
                </Button>
              </div>
            )}
          </>
        )}

        <Card.Footer style={{ 
          color: 'rgba(0, 0, 0, 0.5)',
          padding: '0.5rem 0', // Уменьшаем отступы футера
          marginTop: '0.5rem' // Поднимаем футер выше
        }}>
          Дата отзыва: {reviewDate}
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;