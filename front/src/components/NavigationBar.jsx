import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';

function NavigationBar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" sticky='top' style={{width: "100%"}}>
      <Container>
        
        <Navbar.Brand as={Link} to="/">Главная</Navbar.Brand>
        
        
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/user_profile/">Профиль</Nav.Link>  
          <Nav.Link href="#categories">Избранное</Nav.Link>
        </Nav>
  

        
        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Поиск..."
            className="me-2"
            aria-label="Поиск"
          />
          <Button variant="outline-primary">Найти</Button>
        </Form>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
