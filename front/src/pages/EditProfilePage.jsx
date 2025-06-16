import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import userImage from "../assets/user_placeholder.png";
import ProfilePhotoEditor from "../components/ProfilePhotoEditor";

function EditProfilePages() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: "", status: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileImageSrc, setProfileImageSrc] = useState(userImage);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState(false);
  const [error, setError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!token || !user) return;

    async function fetchProfile() {
      try {
        const res = await axios.get(`/api/profile/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile({
          name: res.data.name || "",
          status: res.data.status || "",
        });

        await fetchPhoto(user.id);
      } catch (err) {
        setError(err.response?.data?.error || "Ошибка загрузки профиля");
      } finally {
        setLoading(false);
      }
    }

    async function fetchPhoto(userId) {
      try {
        const res = await axios.get(`/api/user/profilepic/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        });
        const imageUrl = URL.createObjectURL(res.data);
        setProfileImageSrc(imageUrl);
      } catch {
        setProfileImageSrc(userImage);
      }
    }

    fetchProfile();
  }, [token, user]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setProfile((prev) => ({ ...prev, status: value }));
    
    // Auto-resize the textarea
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleSave = async () => {
    if (!profile.name.trim()) {
      alert("Имя не может быть пустым");
      return;
    }
    if (profile.name.length > 255) {
      alert("Имя не может превышать 255 символов");
      return;
    }
    if (profile.status.length > 1500) {
      alert("Статус не может превышать 1500 символов");
      return;
    }

    setSaving(true);
    try {
      await axios.put("/api/change/usernamtus", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);

        await axios.post("/api/change/userpic", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        const timestamp = Date.now();
        setProfileImageSrc(`/api/user/profilepic/${user.id}?t=${timestamp}`);
      }

      setSelectedImage(null);
      alert("Профиль обновлён");
    } catch (err) {
      alert(err.response?.data?.error || "Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!window.confirm("Удалить фото профиля?")) return;

    setDeletingPhoto(true);
    try {
      await axios.delete("/api/delete/profliepic", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileImageSrc(userImage);
      alert("Фото удалено");
    } catch (err) {
      alert(err.response?.data?.error || "Не удалось удалить фото");
    } finally {
      setDeletingPhoto(false);
    }
  };

  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePassword = async () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      alert("Заполните оба поля");
      return;
    }
    if (passwordForm.newPassword.length < 8 || passwordForm.newPassword.length > 40) {
      alert("Пароль должен быть от 8 до 40 символов");
      return;
    }

    setSavingPassword(true);
    try {
      await axios.put("/api/change/userpassword", passwordForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Пароль изменён");
      setPasswordForm({ oldPassword: "", newPassword: "" });
      setShowPasswordModal(false);
    } catch (err) {
      alert(err.response?.data?.error || "Ошибка смены пароля");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Вы уверены?")) return;

    try {
      await axios.delete("/api/delete/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      navigate("/");
    } catch {
      alert("Ошибка удаления аккаунта");
    }
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Профиль</h2>
      <Row>
        <Col md={4} className="text-center mb-3">
          <ProfilePhotoEditor
            src={profileImageSrc}
            onImageSelect={setSelectedImage}
            onDelete={handleDeletePhoto}
            disabled={saving || deletingPhoto}
          />
        </Col>

        <Col md={8}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                name="name"
                value={profile.name}
                onChange={handleInput}
                disabled={saving}
              />
              <Form.Text muted>Максимум 255 символов</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Статус</Form.Label>
              <Form.Control
                as="textarea"
                name="status"
                rows={3}
                value={profile.status}
                onChange={handleStatusChange}
                disabled={saving}
                style={{ overflow: "hidden", resize: "none" }}
              />
              <Form.Text muted>Максимум 1500 символов</Form.Text>
            </Form.Group>
            <div className="d-flex gap-2 flex-wrap mt-3">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Сохранение...
                  </>
                ) : (
                  "Сохранить"
                )}
              </Button>
              <Button variant="secondary" onClick={() => navigate(-1)} disabled={saving}>
                Назад
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
          </Form>
        </Col>
      </Row>

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
                onChange={handlePasswordInput}
                disabled={savingPassword}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Новый пароль</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordInput}
                disabled={savingPassword}
              />
              <Form.Text muted>От 8 до 40 символов</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)} disabled={savingPassword}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSavePassword} disabled={savingPassword}>
            {savingPassword ? "Сохранение..." : "Сохранить"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default EditProfilePages;