import React from "react";
import {Row, Col, Image, Button} from 'react-bootstrap';
import userImage from '../assets/user_placeholder.png';
import './UserProfile.css';
import ReviewCard from "../components/ReviewCard";

function UserProfile(){

    const reviews = [
        { id: 1, title: 'Smart', filmname: 'Интерстеллар', description: 'Мне понравилось!', grade: '5' },
        { id: 2, title: 'Затянуто', filmname: 'Оппенгеймер', description: 'Говно', grade: '2' },
      ];
      

    return (
        <>
            <h1>Профиль</h1>
            <div className="mt-3 d-flex align-items-start">
                <Image src={userImage} thumbnail className="UserPhotoStyle"/>
                <div className="ms-3">
                    <h3>Имя пользователя: user_name</h3>
                    <h3>Логин: userlogin@gmail.com</h3>
                    <h3>О себе</h3>
                    <p className="UserDescriptionStyle">
                    Привет, меня зовут user_name, и я — страстный киноман, для которого фильмы не просто развлечение, а целая вселенная эмоций, смыслов и вдохновения. С детства я погружался в миры, созданные великими режиссёрами, и с тех пор мой список просмотренного растёт с каждым днём.
                    🎥 Любимые жанры
                    Я обожаю неонуар за его стиль и загадочность, космическую оперу за размах и философские вопросы, а ещё — артхаус, который заставляет думать. Но, честно говоря, я открыт для любого жанра, если в нём есть искренность и глубина.
                    </p>
                    <Button variant="dark" className="ButtonsStyle">Настройки</Button>
                    <Button variant="danger" className="ButtonsStyle">Выйти</Button>
                </div>
            </div>
            <div className="mt-3">
                <h3>Отзывы</h3>
                <Row md={1} className='mb-2'>
                    {reviews.map((review) => (
                    <Col className='px-1 border'>
                        <ReviewCard key={review.id} review={review}/>
                    </Col>
                    ))}
                </Row>                
            </div>
        </>
    );
}

export default UserProfile;