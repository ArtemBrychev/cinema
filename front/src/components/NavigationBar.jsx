// src/components/NavigationBar.jsx
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavigationBar() {
  const { isAuthenticated, logout, user } = useAuth();

  const userProfileLink = user?.id ? `/user_profile/${user.id}` : '/user_profile';

  return (
    <Navbar bg="dark" data-bs-theme="dark" sticky="top" style={{ width: '100%' }}>
      <Container>
        <Navbar.Brand as={Link} to="/">Главная</Navbar.Brand>

        <Nav className="me-auto">
          {isAuthenticated && user?.id && (
            <Nav.Link as={Link} to={`/user_profile/${user.id}`}>Профиль</Nav.Link>  
          )}
          <Nav.Link href="#categories">Избранное</Nav.Link>
        </Nav>

        <Form className="d-flex me-2">
          <Form.Control type="search" placeholder="Поиск..." className="me-2" aria-label="Поиск" />
          <Button variant="outline-primary">Найти</Button>
        </Form>

        {!isAuthenticated ? (
          <>
            <Button as={Link} to="/login/" variant="outline-light" className="me-2">
              Войти
            </Button>
            <Button as={Link} to="/register/" variant="outline-light">
              Зарегистрироваться
            </Button>
          </>
        ) : (
          <Button variant="outline-warning" onClick={logout}>
            Выйти
          </Button>
        )}
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
