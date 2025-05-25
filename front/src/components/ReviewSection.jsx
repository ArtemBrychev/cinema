import React, { useEffect, useState } from 'react';
import ReviewCard from './ReviewCard';
import { useAuth } from '../context/AuthContext';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ReviewSection({ filmId }) {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(3);
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/films/reviews/${filmId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(console.error);
  }, [filmId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/api/newreview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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

      const updatedReviews = await fetch(`/api/films/reviews/${filmId}`).then(res => res.json());
      setReviews(updatedReviews);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-4">
      <h5>Оставить отзыв</h5>
      {isAuthenticated ? (
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
      ) : (
        <p className="mb-4">
          <a href="/login">Войдите</a>, чтобы оставить отзыв.
        </p>
      )}

      <h4>Отзывы:</h4>
      {reviews.length === 0 && <p>Пока нет отзывов.</p>}
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}

export default ReviewSection;
