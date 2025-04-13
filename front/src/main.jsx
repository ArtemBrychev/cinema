import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
//import { BrowserRouter } from 'react-router-dom'; // Подключаем BrowserRouter

//const root = ReactDOM.createRoot(document.getElementById('root'));
const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендерим приложение
root.render(
  <React.StrictMode> 
    <App /> 
  </React.StrictMode>
);
