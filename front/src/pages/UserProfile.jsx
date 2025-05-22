import React, { useEffect, useState } from "react";
import { Row, Col, Image, Button, Spinner, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import userImage from "../assets/user_placeholder.png";
import ReviewCard from "../components/ReviewCard";
import { useAuth } from "../context/AuthContext";
import "./UserProfile.css";

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [userData, setUserData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          setUserData(null);
          setIsOwner(false);
          setLoading(false);
          return;
        }

        setUserData(data);
        setIsOwner(!!data.email);
      } catch (err) {
        console.error("Ошибка при загрузке профиля:", err);

        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError("Сессия истекла. Пожалуйста, войдите снова.");
          logout();
          navigate("/login");
        } else {
          setError(`Ошибка при загрузке: ${err.message || err}`);
        }

        setUserData(null);
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [id, token]);

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
            {userData.reviews && userData.reviews.length > 0 ? (
              <Row md={1} className="mb-2">
                {userData.reviews.map((review) => (
                  <Col className="px-1 border" key={review.id}>
                    <ReviewCard review={review} />
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
