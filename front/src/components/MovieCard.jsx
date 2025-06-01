import React from 'react';
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

/**
 * @param {Object} props
 * @param {Object} props.movie - объект фильма (может быть film или FavouriteResponse)
 * @param {boolean} props.showRemoveButton - показывать кнопку "Удалить из избранного"
 * @param {Function} props.onRemove - обработчик удаления из избранного
 */
const MovieCard = ({ movie, showRemoveButton = false, onRemove }) => {
  const id = movie.id || movie.filmId; // поддержка как обычного фильма, так и FavouriteResponse
  const { name, director, description } = movie;

  return (
    <Card style={{ width: '100%' }} border='0' className='mb-3'>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{director}</Card.Subtitle>
        <Card.Text>{description}</Card.Text>

        <div className="d-flex gap-2">
          <Button variant='primary' as={Link} to={`/player/${id}`}>
            Смотреть
          </Button>

          {showRemoveButton && (
            <Button variant='danger' onClick={() => onRemove(id)}>
              Удалить из избранного
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;
