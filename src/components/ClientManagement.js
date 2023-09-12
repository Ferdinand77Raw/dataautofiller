import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import './ClientManagement.css';
import { db, auth } from '../services/FirebaseAuth.js';
import { collection, getDocs, where, query, doc, DocumentReference } from 'firebase/firestore';
import ClientFields from './ClientFields.js';
import Paquetes from './Paquetes';
import RiesgoCliente from './RiesgoCliente';
import icon256 from './icon256.png';
import letraslogo from '../../public/img/letras-logo.png'

const ClientList = ({ companyName }) => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedClientInfo, setSelectedClientInfo] = useState('');

  //Constantes para pushear
  const [name, setName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');


  useEffect(() => {
    const storedUID = localStorage.getItem('userUID');

    if (!storedUID) {
      // El userUID no está almacenado en el localStorage, guardarlo si hay uno disponible
      const user = auth.currentUser;
      const userFbId = user ? user.uid : null; // Puedes obtener el UID del usuario

      if (userFbId) {
        localStorage.setItem('userUID', userFbId);
      }
    }
    const fetchClient = async () => {
      try {
        const queryUid = localStorage.getItem('userUID');
        const userCollection = collection(db, 'users');
        const userQuery = query(userCollection, where('uid', '==', queryUid));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          // Si se encuentra un usuario con el mismo UID, obtén el organizationid
          const userData = userSnapshot.docs[0].data();
          const organizationId = userData.organizationid;
          console.log('organizationid del usuario:', organizationId);

          const organizationsCollection = collection(db, 'organization'); // Referencia a la colección "organizations"
          const organizationDoc = doc(organizationsCollection, organizationId); // Reemplaza 'organizationId' con el ID de la organización específica que deseas acceder
          const leadsCollection = collection(organizationDoc, 'leads'); //Referencia a la coleccion "leads"

          const leadsQuery = query(leadsCollection, where('uid', '==', queryUid));
          const querySnapshot = await getDocs(leadsQuery);

          const leadsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setClients(leadsData);

        } else {
          alert("No se encontró ningún usuario con esas credenciales!")
        }

      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    fetchClient();
  }, []);

  // Al seleccionar un cliente
  const handleClientChange = (event) => {
    const selectedClientId = event.target.value;
    setSelectedClient(selectedClientId);

    const selectedClientInformation = clients.find(client => client.id === selectedClientId);
    setSelectedClientInfo(selectedClientInformation);
    //Le asigno un valor a las variables que tendran asignados los valores provenientes de firebase
    setName(selectedClientInformation['name']);
    setLastName(selectedClientInformation['last_name']);
    setPhone(selectedClientInformation['phone']);
    setAddress(selectedClientInformation['address']);

    // Almacenar los detalles del cliente seleccionado en localStorage
    localStorage.setItem('selectedClientInfo', JSON.stringify(selectedClientInformation));
    localStorage.setItem('clientData', JSON.stringify(selectedClientInformation));
  };

  useEffect(() => {
    // Cargar la información del cliente desde el localStorage cuando se abre el popup
    const storedClientInfo = localStorage.getItem('selectedClientInfo');
    if (storedClientInfo) {
      setSelectedClientInfo(JSON.parse(storedClientInfo));
    }
  }, []);


  const handleLoadData = () => {
    // Lógica para cargar datos relacionados con el cliente seleccionado
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const tabId = activeTab.id;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: insertClientData,
        args: [name, last_name, address, phone, altPhone, email]
      });
    });
    console.log(`Cargando datos para el cliente ${selectedClient}`);
  };

  function insertClientData(phone, altPhone, firstName, lastName, email, address) {
    document.getElementById('MainContent_installphone').value = phone;
    document.getElementById('MainContent_alternatephone').value = altPhone;
    document.getElementById('MainContent_custfirstname').value = firstName;
    document.getElementById('MainContent_custlastname').value = lastName;
    document.getElementById('ctl00_MainContent_rtbCustomerEmail').value = email;
    document.getElementById('MainContent_txtServiceAddress').value = address;
  }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == 'insertClientData') {
      insertClientData();
      sendResponse({ message: 'Data pushed successfully' });
    }
  });

  const handleUpdate = () => {
    // Lógica para actualizar los datos del cliente seleccionado
    console.log(`Actualizando datos para el cliente ${selectedClient}`);

    // Actualizar los detalles del cliente en localStorage
    localStorage.setItem('selectedClientInfo', JSON.stringify(selectedClientInfo));
  };

  const handleDelete = () => {
    // Lógica para eliminar el cliente seleccionado
    console.log(`Eliminando el cliente ${selectedClient}`);

    // Eliminar los detalles del cliente del localStorage
    localStorage.removeItem('selectedClientInfo');
  };


  return (
    <div className="client-management">
      <div className='title-logo'>
        <img src={icon256} alt="Logo" width="100" height="100" />
        <img src={letraslogo} alt='Logo2' width="200" height="200" />
      </div>
      <h2>Administración de Clientes</h2>
      <div className="controls">
        <Select
          value={selectedClient}
          onChange={handleClientChange}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>
            Selecciona un cliente
          </MenuItem>
          {clients.map((client) => (
            <MenuItem key={client.id} value={client.id}>
              {client.name}{" "}{client.last_name}
            </MenuItem>
          ))}
        </Select>
        <ClientFields clientInfo={selectedClientInfo} />

        <Button variant="contained" onClick={handleLoadData}>
          Cargar Datos
        </Button>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Actualizar
        </Button>
        <Button className="delete-button" variant="contained" onClick={handleDelete}>
          Eliminar
        </Button>
        <div><RiesgoCliente clientInfo={selectedClientInfo}></RiesgoCliente></div>
        <div><Paquetes clientInfo={selectedClientInfo}></Paquetes></div>
      </div>
    </div>
  );
};

export default ClientList;



