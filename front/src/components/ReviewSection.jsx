import React, { useEffect, useState } from 'react';
import ReviewCard from './ReviewCard';
import { useAuth } from '../context/AuthContext';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ReviewSection({ filmId }) {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(3);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [checkingReview, setCheckingReview] = useState(true);

  const { isAuthenticated, token, user } = useAuth(); // ✅ добавили user
  const navigate = useNavigate();

  // ✅ Загрузка отзывов с учетом авторизации
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/films/reviews/${filmId}`, {
          headers: isAuthenticated
            ? { Authorization: `Bearer ${token}` }
            : {}
        });

        if (!response.ok) throw new Error('Ошибка загрузки отзывов');
        const data = await response.json();


        setReviews(data);
      } catch (err) {
        console.error('Ошибка при загрузке отзывов:', err);
      }
    };

    fetchReviews();
  }, [filmId, isAuthenticated, token]);

  // ✅ Проверка: оставлял ли пользователь отзыв
  useEffect(() => {
    const checkUserReview = async () => {
      if (!isAuthenticated || !token) {
        setHasReviewed(false);
        setCheckingReview(false);
        return;
      }

      try {
        const response = await fetch(`/api/check/review/${filmId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Ошибка проверки отзыва');
        const result = await response.json();
        setHasReviewed(result === true);
      } catch (err) {
        console.error('Ошибка при проверке отзыва:', err);
        setHasReviewed(false);
      } finally {
        setCheckingReview(false);
      }
    };

    checkUserReview();
  }, [filmId, isAuthenticated, token]);

  // ✅ Отправка нового отзыва
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/newreview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reviewText: text,
          rating,
          filmId: filmId
        })
      });

      if (!response.ok) throw new Error('Ошибка при добавлении отзыва');

      setText('');
      setRating(3);
      setHasReviewed(true);

      // Перезагрузка отзывов
      const updated = await fetch(`/api/films/reviews/${filmId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedReviews = await updated.json();
      const sorted = updatedReviews.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));
      setReviews(sorted);
    } catch (err) {
      console.error('Ошибка добавления отзыва:', err);
    }
  };

  return (
    <div className="mt-4">
      <h5>Оставить отзыв</h5>

      {checkingReview ? (
        <p>Проверка данных...</p>
      ) : !isAuthenticated ? (
        <p className="mb-4">
          <a href="/login">Войдите</a>, чтобы оставить отзыв.
        </p>
      ) : hasReviewed ? (
        <div className="alert alert-info">У вас уже есть отзыв к этому фильму.</div>
      ) : (
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group className="mb-2">
            <Form.Label>Ваш отзыв</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Оценка (1–5)</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary">Отправить</Button>
        </Form>
      )}

      <h4>Отзывы:</h4>
      {reviews.length === 0 ? (
        <p>Пока нет отзывов.</p>
      ) : (
        reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            isOwn={isAuthenticated && user?.id === review.userId}
            onDelete={(id) => setReviews(reviews.filter(r => r.id !== id))}
            onUpdate={(updatedReview) =>
              setReviews(reviews.map(r => r.id === updatedReview.id ? updatedReview : r))
            }
          />

        ))
      )}
    </div>
  );
}

export default ReviewSection;
