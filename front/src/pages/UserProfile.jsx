import React, { useEffect, useState } from "react";
import { Image, Button, Spinner, Alert, Modal, Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import userImage from "../assets/user_placeholder.png";
import { useAuth } from "../context/AuthContext";
import "./UserProfile.css";
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

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", status: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

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
        setEditForm({
          name: data.name || "",
          status: data.status || "",
        });

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
        console.warn("Фотография профиля отсутствует или произошла ошибка:", err.response?.data || err.message);
        setProfileImageSrc(userImage);
      }
    }

    fetchProfile();
  }, [id, token, logout, navigate, user]);

  const handleEditClick = () => setShowEditModal(true);
  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!editForm.name.trim()) {
      alert("Имя не может быть пустым");
      return;
    }

    setSavingProfile(true);

    try {
      await axios.put("/api/change/usernamtus", editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage); // имя 'file' обязательно!
      
        await axios.post("/api/change/userpic", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      
        const timestamp = Date.now();
        setProfileImageSrc(`/api/user/profilepic/${userData.id}?t=${timestamp}`);
      }
      

      setUserData((prev) => ({
        ...prev,
        name: editForm.name,
        status: editForm.status,
      }));

      setSelectedImage(null);
      handleCloseModal();
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      alert(err.response?.data?.error || "Ошибка при сохранении");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePassword = async () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      alert("Пожалуйста, заполните оба поля пароля");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert("Новый пароль должен содержать минимум 8 символов");
      return;
    }

    setSavingPassword(true);
    try {
      await axios.put("/api/change/userpassword", passwordForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Пароль успешно изменён");
      setShowPasswordModal(false);
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Ошибка смены пароля:", err);
      alert(err.response?.data?.error || "Ошибка при смене пароля");
    } finally {
      setSavingPassword(false);
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
              <Button variant="primary" onClick={handleEditClick}>
                Редактировать профиль
              </Button>
              <Button variant="warning" onClick={() => setShowPasswordModal(true)}>
                Сменить пароль
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

      {/* Модалка редактирования профиля */}
      <Modal show={showEditModal} onHide={handleCloseModal} centered>
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
                disabled={savingProfile}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Статус</Form.Label>
              <Form.Control
                as="textarea"
                name="status"
                value={editForm.status}
                onChange={handleInputChange}
                rows={3}
                disabled={savingProfile}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Фото профиля (.jpg)</Form.Label>
              <Form.Control
                type="file"
                accept=".jpg"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.type === "image/jpeg") {
                    setSelectedImage(file);
                  } else {
                    alert("Пожалуйста, выберите файл .jpg формата");
                    e.target.value = null;
                  }
                }}
                disabled={savingProfile}
              />
            </Form.Group>

            {selectedImage && (
              <div className="text-center">
                <p className="mb-1">Предпросмотр:</p>
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  roundedCircle
                  width={120}
                  height={120}
                  alt="Предпросмотр"
                />
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={savingProfile}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSaveChanges} disabled={savingProfile}>
            {savingProfile ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Сохранение...
              </>
            ) : (
              "Сохранить"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модалка смены пароля */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Смена пароля</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Текущий пароль</Form.Label>
              <Form.Control
                type="password"
                name="oldPassword"
                value={passwordForm.oldPassword}
                onChange={handlePasswordInputChange}
                disabled={savingPassword}
                autoComplete="current-password"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Новый пароль</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordInputChange}
                disabled={savingPassword}
                autoComplete="new-password"
              />
              <Form.Text className="text-muted">
                Новый пароль должен содержать минимум 8 символов.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)} disabled={savingPassword}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSavePassword} disabled={savingPassword}>
            {savingPassword ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Сохранение...
              </>
            ) : (
              "Изменить пароль"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserProfile;
