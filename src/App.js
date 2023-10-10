import React, { useState, useEffect } from 'react';
import './App.css';
import ClientList from './components/ClientManagement.js';
import Login from './components/LoginComponent.js';
import { logInWithEmailAndPassword } from './services/FirebaseAuth.js';
import Button from '@mui/material/Button';


function App() {

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [open, setOpen] = useState(true);
  const [clients, setClients] = useState([]); // Agregar el estado 'clients' aquí
  const [selectedClient, setSelectedClient] = useState(null);
  const [companyName, setCompanyName] = useState();

  useEffect(() => {
    const storedClientData = localStorage.getItem('clientData');
    if (storedClientData) {
      // Parsear y usar los datos almacenados
      const clientData = JSON.parse(storedClientData);
      // Actualizar el estado con los datos almacenados
      setClients(clientData);
    }
  }, []); // El segundo argumento vacío [] asegura que este efecto se ejecute solo una vez al montar el componente
  /*
  chrome.runtime.onMessage.addListener((message) => {
    if (message.value === 'openPopup') {
      setOpen(false);
      alert('Popup');
    }
  });*/

  const handleLogin = async (email, password, companyName) => {
    // Lógica de autenticación
    try {
      // Intentar iniciar sesión
      const userCredential = await logInWithEmailAndPassword(email, password);

      // Si la autenticación fue exitosa, guardar el usuario en el estado
      setUser(userCredential);
      setIsLoggedIn(true);
      setCompanyName(companyName);
      localStorage.setItem('isLoggedIn', 'true');
      setOpen(false);
    } catch (error) {
      // Manejar errores de autenticación
      console.error('Error al iniciar sesión:', error.message);
    }
  };

  const handleLogout = () => {
    // Lógica de cierre de sesión
    setUser(null); // Eliminar el usuario del estado
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('riesgoClienteData'); // Eliminar datos de RiesgoCliente
    localStorage.removeItem('paquetesData');
    localStorage.removeItem('selectedClientInfo');
    localStorage.removeItem('userUID');
    localStorage.removeItem('clientData');
    localStorage.removeItem('riesgoCliente');
    localStorage.removeItem('loadedLeads');
    localStorage.removeItem('showAddressForm');
  };

  const handleClients = () => {

  }

  return (
    <div className="App">
      {!user && !isLoggedIn ? (
        <div><Login onLogin={handleLogin} /></div>
      ) : (
        <>
          <div><ClientList companyName={companyName} onLogin={handleClients} /></div>
          <Button onClick={handleLogout}>Cerrar Sesión</Button>
        </>
      )}
    </div>
  );
}

export default App;
