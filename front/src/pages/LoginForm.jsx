import React, { useState } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login', {
        email: formData.email,
        password: formData.password
      });

      const token = response.data.token;
      login(token);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Неверный email или пароль');
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto', paddingTop: '2rem' }}>
      <h2 className="mb-4">Вход в аккаунт</h2>

      {error && <div className="alert alert-danger">{error}</div>}

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
          required
        />
      </FloatingLabel>

      <Button type="submit" variant="primary" className="w-100">
        Войти
      </Button>
    </Form>
  );
}

export default LoginForm;
