import React from 'react';
import { useParams } from 'react-router-dom';
import './RuTubePlayer.css';



function RuTubePlayer() {
  const { id } = useParams(); // Получаем ID фильма из URL

  console.log(id);

  const videoUrls = {
    1: 'https://rutube.ru/play/embed/17465fc541700b94ebd5648423675100/', // Интерстеллар
    2: 'https://rutube.ru/play/embed/27c335dcbef386ff6adfd3fb392465c0/', // Начало
    3: 'https://rutube.ru/play/embed/ffe77a61fb1ab119c33638900d8a77e4/', // Аватар
  };

  const movies = {
    1: { title: 'Интерстеллар', description: 'Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, коллектив исследователей и учёных отправляется сквозь червоточину (которая предположительно соединяет области пространства-времени через большое расстояние) в путешествие, чтобы превзойти прежние ограничения для космических путешествий человека и найти планету с подходящими для человечества условиями.' },
    2: {  title: 'Начало', description: 'в недалёком будущем промышленный шпионаж разовьётся до такой степени, что шпионы смогут извлекать информацию прямо из мозга человека, пока он спит. Специалист в этой области Доминик Кобб получает сложный заказ: не просто выведать секрет у сына энергетического магната, а внушить ему мысль, которая разрушит империю, созданную отцом. В награду с Кобба будут сняты обвинения в убийстве жены, и он сможет вернуться в США, где остались его дети.' },
    3: {  title: 'Оппенгеймер', description: 'эпический биографический драматический фильм 2023 года режиссёра Кристофера Нолана. **В нём рассказывается о жизни Дж. Роберта Оппенгеймера**, американского физика-теоретика, который помог разработать первое ядерное оружие во время Второй мировой войны.' },
  };
  


  return (
    <div className='playerStyles mx-2'>
      <h2 className='titleStyles mt-1'>Фильм: {movies[id].title}</h2>
      <div className='iframeContainerStyles'>
        <iframe
          className='iframeStyles'
          src={videoUrls[id]} 
          frameBorder="0"
          allow="clipboard-write; autoplay"
          webkitAllowFullScreen
          mozallowfullscreen
          allowFullScreen
          title="RuTube Video Player"
        ></iframe>
      </div>
      <h3 className='mt-2'>Описание:</h3>
      <p>{movies[id].description}</p>
    </div>
  );
}

export default RuTubePlayer;
