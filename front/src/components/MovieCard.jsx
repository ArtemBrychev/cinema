import React from 'react';
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import {Link} from 'react-router-dom';


const MovieCard = ({movie}) => {
    const {id, title, description} = movie;
  
    return (
    <Card style={{ width: '100%' }} border='0'>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Пусто</Card.Subtitle>
        <Card.Text>{description}
        </Card.Text>
        <Button variant='primary' as={Link} to={`/player/${id}`} >Смотреть</Button>
      </Card.Body>
    </Card>
  );
}

export default MovieCard;