import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import './LoginComponent.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { auth, logInWithEmailAndPassword } from '../services/FirebaseAuth.js';
import icon256 from './icon256.png';
//import logoNuevo from '../../public/img/logoNuevo.png';
import letraslogo from '../../public/img/letras-logo.png'
import { Alert } from '@mui/material';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [rememberCredentials, setRememberCredentials] = useState(false);

  /* Seteamos el mail */
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  /* Seteamos el password */
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRememberCredentialsChange = () => {
    setRememberCredentials(!rememberCredentials);
  };
  /**Logica de inicio de sesión en firebase */
  const handleLogin = async (e) => {
    e.preventDefault();
    onLogin(email, password);
    try {
      await logInWithEmailAndPassword(email, password);
      console.log('Inicio de sesión exitoso');

      onLogin(email, password);
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('username', email);
      localStorage.setItem('password', password);

      //await chrome.runtime.sendMessage({ type: 'loginSuccess'});
      
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          function: insertData,
          args: [email, password]
        });
      });

      if (rememberCredentials) {
        // Si el usuario seleccionó "Recordar usuario y contraseña", guarda las credenciales en localStorage
        localStorage.setItem('username', email);
        localStorage.setItem('password', password);
      } else {
        // Si no se seleccionó "Recordar usuario y contraseña", elimina las credenciales almacenadas en localStorage
        localStorage.removeItem('username');
        localStorage.removeItem('password');
      }

    } catch (error) {
      Alert("Error al iniciar sesion: " + error);
    }
  };
 //Función llamada por chrome plugin para tomar los ids de los campos a llenar en la página desde el plugin
  function insertData(email, password) {
    document.getElementById('username').value = email;
    document.getElementById('password').value = password;
  }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'insertData') {
      insertData();
      sendResponse({ message: 'Data inserted successfully' });
    }
  })

  
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername && storedPassword) {
      setEmail(storedUsername);
      setPassword(storedPassword);
      setRememberCredentials(true);
    }
  }, []);


  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '50ch' },
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleLogin}
    >
      <div className="login-form">

        <img src={icon256} alt="Logo" width="100" height="100" />
        <img src={letraslogo} alt='Logo2' width="150" height="150" />
        <h2>Inicio de Sesión</h2>
        <TextField
          required
          id="username"
          label="E-Mail"
          placeholder='E-Mail'
          variant="standard"
          value={email}
          onChange={handleEmailChange}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="standard"
          value={password}
          onChange={handlePasswordChange}
        />
        <label>
          <input
            type="checkbox"
            checked={rememberCredentials}
            onChange={handleRememberCredentialsChange}
          />
          Recordar usuario y contraseña
        </label>
        <Button variant="contained" onClick={handleLogin}>Iniciar Sesión</Button>
      </div>
    </Box>
  );
};

export default LoginForm;
