import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavigationBar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const userProfileLink = user?.id ? `/user_profile/${user.id}` : '/user_profile';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" sticky="top" style={{ width: '100%' }}>
      <Container>
        <Navbar.Brand as={Link} to="/">Главная</Navbar.Brand>

        <Nav className="me-auto">
          {isAuthenticated && user?.id && (
            <Nav.Link as={Link} to={userProfileLink}>Профиль</Nav.Link>
          )}
          <Nav.Link as={Link} to="/favourites/">Избранное</Nav.Link>
        </Nav>

        <Form className="d-flex me-2" onSubmit={handleSearchSubmit}>
          <Form.Control
            type="search"
            placeholder="Поиск..."
            className="me-2"
            aria-label="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline-primary" type="submit">Найти</Button>
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
