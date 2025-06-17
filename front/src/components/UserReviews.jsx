/*
Компонент UserReviews - отображает список отзывов пользователя.
Основной функционал:
- Загрузка и отображение отзывов конкретного пользователя
- Обработка состояний загрузки и ошибок

Функции:
- fetchUserReviews - загрузка отзывов пользователя с сервера

Запросы:
- GET /api/user/reviews/{id} - получение отзывов пользователя

Состояния:
- reviews - массив отзывов пользователя
- loading - флаг состояния загрузки
- error - сообщение об ошибке

Хуки:
- useParams - получение ID пользователя из URL
- useAuth - доступ к токену аутентификации

Пропсы:
Не принимает пропсов (использует параметры URL)

Элементы:
- Spinner - индикатор загрузки
- Alert - отображение ошибок
- ProfileReviewCard - карточки отзывов
*/

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import ProfileReviewCard from './ProfileReviewCard';

function UserReviews() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await fetch(`/api/user/reviews/${id}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (!response.ok) throw new Error('Ошибка загрузки отзывов');
        setReviews(await response.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [id, token]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="mt-4">
      <h3 className="mb-3">Отзывы</h3>
      {reviews.length === 0 ? (
        <p>Пользователь еще не оставил отзывов</p>
      ) : (
        reviews.map((review) => (
          <ProfileReviewCard key={review.id} review={review} />
        ))
      )}
    </div>
  );
}

export default UserReviews;