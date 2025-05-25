import React, { useEffect, useState } from "react";
import { Row, Col, Image, Button, Spinner, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import userImage from "../assets/user_placeholder.png";
import { useAuth } from "../context/AuthContext";
import "./UserProfile.css";
import ProfileReviewCard from "../components/ProfileReviewCard"; // Импорт нового компонента

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [userData, setUserData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]); // Новое состояние для отзывов
  const [reviewsLoading, setReviewsLoading] = useState(false); // Состояние загрузки отзывов

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError("");
      setUserData(null);
      setIsOwner(false);

      if (!token) {
        setError("Сессия отсутствует. Пожалуйста, войдите в аккаунт.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;

        if (!data || !data.name) {
          setError("Профиль не найден или данные пусты.");
          setLoading(false);
          return;
        }

        setUserData(data);
        setIsOwner(!!data.email);
        
        // Загружаем отзывы пользователя
        fetchUserReviews(id);
      } catch (err) {
        console.error("Ошибка при загрузке профиля:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError("Сессия истекла. Пожалуйста, войдите снова.");
          logout();
          navigate("/login");
        } else {
          setError(`Ошибка при загрузке: ${err.message || err}`);
        }
      } finally {
        setLoading(false);
      }
    }

    async function fetchUserReviews(userId) {
      setReviewsLoading(true);
      try {
        const response = await axios.get(`/api/user/reviews/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(response.data);
      } catch (err) {
        console.error("Ошибка при загрузке отзывов:", err);
      } finally {
        setReviewsLoading(false);
      }
    }

    fetchProfile();
  }, [id, token, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;

  return (
    <>
      <h1>Профиль</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {!userData && !error && <Alert variant="warning">Профиль не найден</Alert>}

      {userData && (
        <>
          <div className="mt-3 d-flex align-items-start">
            <Image src={userImage} thumbnail className="UserPhotoStyle" />
            <div className="ms-3 flex-grow-1">
              <h3>Имя пользователя: {userData.name}</h3>
              {isOwner && <h5>Email: {userData.email}</h5>}
              <h5>О себе</h5>
              <p className="UserDescriptionStyle">{userData.status || "Пока ничего не указано..."}</p>

              {isOwner && (
                <div className="d-flex gap-2 mt-3">
                  <Button variant="dark" className="ButtonsStyle" onClick={() => navigate("/settings")}>
                    Настройки
                  </Button>
                  <Button variant="danger" className="ButtonsStyle" onClick={handleLogout}>
                    Выйти
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h3>Отзывы</h3>
            {reviewsLoading ? (
              <Spinner animation="border" />
            ) : reviews.length > 0 ? (
              <Row md={1} className="g-2">
                {reviews.map((review) => (
                  <Col key={review.id}>
                    <ProfileReviewCard review={review} />
                  </Col>
                ))}
              </Row>
            ) : (
              <p>Пока нет отзывов</p>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default UserProfile;