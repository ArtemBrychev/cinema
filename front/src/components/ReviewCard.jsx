import React from 'react';
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import {Link} from 'react-router-dom';
import './ReviewCard.css';

const ReviewCard = ({review}) => {
    const {id, title, filmname, description, grade} = review;
  
    return (
    <Card style={{ width: '100%' }} border='0'>
      <Link to={`/player/${id}`} className='review-link'>
        <Card.Body>
          <Card.Title>{filmname} - {title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted"> <h5>Оценка: {grade}</h5> </Card.Subtitle>
          <Card.Text>{description}</Card.Text>
        </Card.Body>
      </Link>
    </Card>
  );
}

export default ReviewCard;