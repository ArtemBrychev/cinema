import React, { useEffect, useState } from "react";
import { Row, Col, Image, Button, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import userImage from "../assets/user_placeholder.png";
import { useAuth } from "../context/AuthContext";
import "./UserProfile.css";
import ProfileReviewCard from "../components/ProfileReviewCard";

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [userData, setUserData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    status: ''
  });

  // Заполняем форму данными пользователя
  useEffect(() => {
    if (userData) {
      setEditForm({
        name: userData.name || '',
        status: userData.status || ''
      });
    }
  }, [userData]);

  // Загрузка данных профиля
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError("");
      setUserData(null);
      setIsOwner(false);

      if (!token) {
        setError("Требуется авторизация");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data?.name) {
          throw new Error("Профиль не найден");
        }

        setUserData(response.data);
        setIsOwner(response.data.email === token.email); // Или другой способ проверки владельца
        fetchUserReviews(id);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
        setError(err.response?.data?.error || err.message);
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
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
        console.error("Ошибка загрузки отзывов:", err);
      } finally {
        setReviewsLoading(false);
      }
    }

    fetchProfile();
  }, [id, token, logout, navigate]);

  const handleEditClick = () => setShowEditModal(true);
  const handleCloseModal = () => setShowEditModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put('/api/change/usernamtus', editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setUserData(prev => ({
          ...prev,
          name: editForm.name,
          status: editForm.status
        }));
        handleCloseModal();
      }
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      alert(err.response?.data?.error || 'Ошибка при сохранении');
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Вы уверены? Это действие нельзя отменить!")) return;
    
    try {
      await axios.delete("/api/delete/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      logout();
      navigate("/");
    } catch (err) {
      console.error("Ошибка удаления:", err);
      alert("Не удалось удалить аккаунт");
    }
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!userData) return <Alert variant="warning">Профиль не найден</Alert>;

  return (
    <div className="p-3">
      <h1 className="mb-4">Профиль пользователя</h1>
      
      <div className="d-flex flex-column flex-md-row gap-4">
        <div className="flex-shrink-0">
          <Image src={userImage} roundedCircle width={200} height={200} />
        </div>
        
        <div className="flex-grow-1">
          <h2>{userData.name}</h2>
          {isOwner && <p className="text-muted">{userData.email}</p>}
          
          <div className="mt-3 mb-4">
            <h5>О себе:</h5>
            <p>{userData.status || "Пока ничего не указано..."}</p>
          </div>

          {isOwner && (
            <div className="d-flex gap-2 mb-4">
              <Button variant="primary" onClick={handleEditClick}>
                Редактировать профиль
              </Button>
              <Button variant="outline-secondary" onClick={handleLogout}>
                Выйти
              </Button>
              <Button variant="outline-danger" onClick={handleDeleteAccount}>
                Удалить аккаунт
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">
        <h3>Отзывы</h3>
        {reviewsLoading ? (
          <Spinner animation="border" />
        ) : reviews.length > 0 ? (
          <Row className="g-3">
            {reviews.map(review => (
              <Col key={review.id} xs={12} md={6} lg={4}>
                <ProfileReviewCard review={review} />
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-muted">Пока нет отзывов</p>
        )}
      </div>

      {/* Модальное окно редактирования */}
      <Modal show={showEditModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Редактирование профиля</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Статус</Form.Label>
              <Form.Control
                as="textarea"
                name="status"
                value={editForm.status}
                onChange={handleInputChange}
                rows={3}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserProfile;