import React, { useState, useEffect } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordLengthValid, setPasswordLengthValid] = useState(true);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    }
    setPasswordLengthValid(formData.password.length >= 8);
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordMatch) {
      setError('Пароли не совпадают');
      return;
    }

    if (!passwordLengthValid) {
      setError('Пароль должен быть не менее 8 символов');
      return;
    }

    try {
      await axios.post('/api/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      const loginResponse = await axios.post('/api/login', {
        email: formData.email,
        password: formData.password
      });

      login(loginResponse.data.token);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data) {
        const serverError = err.response.data;

        if (typeof serverError === 'string') {
          setError(serverError);
        } else if (serverError.error) {
          setError(serverError.error);
        } else {
          setError('Ошибка регистрации');
        }
      } else {
        setError('Ошибка соединения с сервером');
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto', paddingTop: '2rem' }}>
      <h2 className="mb-4">Регистрация</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <FloatingLabel controlId="floatingName" label="Имя" className="mb-3">
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Имя"
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@example.com"
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingPassword" label="Пароль" className="mb-3">
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Пароль"
          isInvalid={!passwordLengthValid}
          required
        />
        <Form.Control.Feedback type="invalid">
          Пароль должен быть не менее 8 символов
        </Form.Control.Feedback>
      </FloatingLabel>

      <FloatingLabel controlId="floatingConfirmPassword" label="Подтвердите пароль" className="mb-3">
        <Form.Control
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Подтвердите пароль"
          isInvalid={!passwordMatch}
          required
        />
        <Form.Control.Feedback type="invalid">
          Пароли не совпадают
        </Form.Control.Feedback>
      </FloatingLabel>

      <Button type="submit" variant="primary" className="w-100">
        Зарегистрироваться
      </Button>
    </Form>
  ); 
}

export default RegisterForm;
