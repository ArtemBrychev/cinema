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
  const { filmId, filmName, reviewText, rating } = review;
  const { backgroundColor, color, label } = getStyleAndLabel(rating);

  return (
    <Card style={{ backgroundColor, color }} className="mb-3">
      <Card.Body>
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