import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import App from './App';
import './styles/index.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <ToastContainer position='top-center' autoClose={5000} hideProgressBar={true} closeOnClick pauseOnHover />
  </React.StrictMode>,
  document.getElementById('root')
);
