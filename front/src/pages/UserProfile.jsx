import React, { useEffect, useState } from "react";
import { Image, Button, Spinner, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import userImage from "../assets/user_placeholder.png";
import { useAuth } from "../context/AuthContext";
import ProfileReviewCard from "../components/ProfileReviewCard";

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, logout, user } = useAuth();

  const [userData, setUserData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [profileImageSrc, setProfileImageSrc] = useState(userImage);

  useEffect(() => {
    if (!token || !user) return;

    async function fetchProfile() {
      setLoading(true);
      setError("");
      setUserData(null);
      setIsOwner(false);

      try {
        const response = await axios.get(`/api/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        if (!data?.name) throw new Error("Профиль не найден");

        setUserData(data);
        setIsOwner(user?.email === data.email);

        fetchProfilePicture(data.id);
        fetchUserReviews(id);
      } catch (err) {
        console.error("Ошибка загрузки профиля:", err);
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

    async function fetchProfilePicture(userId) {
      try {
        const response = await axios.get(`/api/user/profilepic/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        });
        const imageUrl = URL.createObjectURL(response.data);
        setProfileImageSrc(imageUrl);
      } catch (err) {
        console.warn("Фотография профиля отсутствует:", err.message);
        setProfileImageSrc(userImage);
      }
    }

    fetchProfile();
  }, [id, token, logout, navigate, user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Вы уверены? Это действие нельзя отменить!")) return;

    try {
      await axios.delete("/api/delete/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      navigate("/");
    } catch (err) {
      console.error("Ошибка удаления аккаунта:", err);
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
          <Image src={profileImageSrc} roundedCircle width={200} height={200} />
        </div>

        <div className="flex-grow-1">
          <h2>{userData.name}</h2>
          {isOwner && <p className="text-muted">{userData.email}</p>}

          <div className="mt-3 mb-4">
            <h5>О себе:</h5>
            <p>{userData.status || "Пока ничего не указано..."}</p>
          </div>

          {isOwner && (
            <div className="d-flex gap-2 mb-4 flex-wrap">
              <Button variant="primary" onClick={() => navigate("/editProfile/")}>
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
          <div className="d-flex flex-column gap-3">
            {reviews.map((review) => (
              <ProfileReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-muted">Пока нет отзывов</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
