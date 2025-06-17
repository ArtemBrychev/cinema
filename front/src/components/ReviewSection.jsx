/*
Компонент ReviewSection - секция отзывов для фильма.
Основной функционал:
- Отображение списка отзывов
- Форма добавления нового отзыва
- Проверка наличия отзыва текущего пользователя
- Сортировка отзывов по дате

Функции:
- fetchReviews - загрузка отзывов для фильма
- checkUserReview - проверка наличия отзыва пользователя
- handleSubmit - обработка отправки нового отзыва

Запросы:
- GET /api/films/reviews/{filmId} - получение отзывов фильма
- GET /api/check/review/{filmId} - проверка отзыва пользователя
- POST /api/newreview - добавление нового отзыва

Состояния:
- reviews - список отзывов
- text - текст нового отзыва
- rating - оценка нового отзыва (1-5)
- hasReviewed - флаг наличия отзыва пользователя
- checkingReview - флаг проверки отзыва
- error - текст ошибки
- showErrorModal - флаг отображения модального окна ошибки

Контекст:
- useAuth - данные аутентификации (isAuthenticated, token, user)

Пропсы:
- filmId - ID фильма для которого отображаются отзывы

Элементы:
- Форма добавления отзыва (для авторизованных без отзыва)
- Список компонентов ReviewCard
- Модальное окно ошибок
*/

import React, { useEffect, useState } from 'react';
import ReviewCard from './ReviewCard';
import { useAuth } from '../context/AuthContext';
import { Form, Button, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ReviewSection({ filmId }) {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(3);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [checkingReview, setCheckingReview] = useState(true);
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { isAuthenticated, token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/films/reviews/${filmId}`, {
          headers: isAuthenticated ? { Authorization: `Bearer ${token}` } : {}
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setShowErrorModal(false);

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

      const result = await response.text();

      if (!response.ok) {
        setError(result);
        setShowErrorModal(true);
        return;
      }

      setText('');
      setRating(3);
      setHasReviewed(true);

      const updated = await fetch(`/api/films/reviews/${filmId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedReviews = await updated.json();
      const sorted = updatedReviews.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));
      setReviews(sorted);
    } catch (err) {
      setError('Ошибка при добавлении отзыва');
      setShowErrorModal(true);
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
              onChange={(e) => {
                setText(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              style={{ overflow: "hidden", resize: "none" }}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Оценка (1–5)</Form.Label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
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
                  onClick={() => setRating(prev => Math.min(prev + 1, 5))}
                  className="me-1"
                >
                  +
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setRating(prev => Math.max(prev - 1, 1))}
                >
                  −
                </Button>
              </div>
            </div>
          </Form.Group>
          <Button type="submit" variant="primary">Отправить</Button>
        </Form>
      )}

      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ошибка</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>

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