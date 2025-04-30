import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './RuTubePlayer.css';



function RuTubePlayer() {
  const { id } = useParams(); // Получаем ID фильма из URL

  const [movie, setMovie] = React.useState("Загрузка...");

  console.log(id);

  const fetchMovie = async () => {
    try {
      let url = `/api/films/film/${id}` ; // Базовый URL

      console.log("Запрос: ", url)
      const response = await fetch(url);  // Делаем GET запрос
      if (!response.ok) {
        throw new Error('Ошибка при получении фильма');
      }
      
      const data = await response.json();  // Получаем JSON из ответа
      setMovie(data);  // Обновляем состояние, чтобы отобразить фильмы
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);
  

  return (
    <div className='playerStyles mx-2'>
      <h2 className='titleStyles mt-1'>Фильм: {movie.name}</h2>
      <div className='iframeContainerStyles'>
        <iframe
          className='iframeStyles'
          src={movie.rutubeLink} 
          frameBorder="0"
          allow="clipboard-write; autoplay"
          webkitAllowFullScreen
          mozallowfullscreen
          allowFullScreen
          title="RuTube Video Player"
        ></iframe>
      </div>
      <h3 className='mt-2'>Описание:</h3>
      <p>{movie.description}</p>
    </div>
  );
}

export default RuTubePlayer;
