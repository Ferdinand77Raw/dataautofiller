import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import './ClientManagement.css';
import { db, auth } from '../services/FirebaseAuth.js';
import { collection, getDocs, where, query, doc, DocumentReference, getDoc } from 'firebase/firestore';
import ClientFields from './ClientFields.js';
import Paquetes from './Paquetes';
import RiesgoCliente from './RiesgoCliente';
import icon256 from './icon256.png';
import letraslogo from '../../public/img/letras-logo.png';
import letraslogo2 from '../../public/img/letras-logo-2.png';
import { onSnapshot } from 'firebase/firestore';
import sarapluslogo from './sarapluslogo.png';
import earthlinklogo from './earthlinklogo.png';
import ClientAddress from './ClientAddress.js';
import att_logo from './att_logo.png';
import AttPush from './AttPush.js';

const ClientList = () => {
  /**Leads */
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedClientInfo, setSelectedClientInfo] = useState('');
  const [leads, setLeads] = useState([]);
  /**Direcciones */
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedAddressInfo, setSelectedAddressInfo] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  /** AT&T*/
  const [selectedAttId, setSelecedAttId] = useState('');
  const [selectedAttInfo, setSelectedAttInfo] = useState('');
  const [attId, setAttId] = useState('');

  //Constantes para pushear
  const [name, setName] = useState('');
  const [last_name, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');


  const [streetAddress, setStreetAddres] = useState('');
  const [zip, setZip] = useState('');
  const [city, setCity] = useState('');


  const [showAddressForm, setShowAddressForm] = useState(() => {
    const savedShowAddressForm = localStorage.getItem('showAddressForm');
    return savedShowAddressForm ? JSON.parse(savedShowAddressForm) : false;
  });

  const [showAttForm, setShowAttForm] = useState(false);

  const handleToggleAttForm = () => {
    setShowAttForm(!showAttForm);
  };

  useEffect(() => {
    // Cargar la información del cliente desde el localStorage cuando se abre el popup
    const storedClientInfo = localStorage.getItem('selectedClientInfo');
    if (storedClientInfo) {
      setSelectedClientInfo(JSON.parse(storedClientInfo));
    }

    const storedInformation = localStorage.getItem('loadedLeads');
    if (storedInformation) {
      setClients(JSON.parse(storedInformation));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('showAddressForm', JSON.stringify(showAddressForm));
  }, []);

  useEffect(() => {
    localStorage.setItem('showAttForm', JSON.stringify(showAttForm));
  }, []);

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
          // Si se encuentra un usuario con el mismo UID, obtén la referencia al documento de la organización
          const userData = userSnapshot.docs[0].data();
          console.log(userData);
          const organizationRef = userData.organization; // Asumiendo que la referencia está en un campo llamado 'organization'

          const orgDocument = await getDoc(organizationRef);

          if (orgDocument.exists()) {
            const organizationData = orgDocument.data();
            console.log('Datos de la organización:', organizationData['organization']);
            // Aquí puedes hacer lo que necesites con los datos de la organización
            const orgName = organizationData['organization'];
            console.log("El nombre es: ", orgName);
            const orgCollection = collection(db, 'organizations');
            const orgDocReference = doc(orgCollection, orgName);
            const organizationDoc = await getDoc(orgDocReference);

            if (organizationDoc.exists()) {
              // Ahora puedes obtener los datos del documento de la organización
              const organizationData = organizationDoc.data();
              console.log('Datos de la organización:', organizationData);
              // Aquí puedes hacer lo que necesites con los datos de la organización

              const leadsCollection = collection(orgDocReference, 'leads');
              const leadsQuery = query(leadsCollection, where('uid', '==', queryUid));
              const unsubscribe = onSnapshot(leadsQuery, (snapshot) => {
                const leadsData = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                setClients(leadsData);

                localStorage.getItem('loadedLeads');
                localStorage.setItem('loadedLeads', JSON.stringify(leadsData));
              });

              return () => {
                // Debes cancelar la suscripción cuando el componente se desmonte
                unsubscribe();
              };
            } else {
              console.log("El documento de la organización no existe.");
            }
          } else {
            console.log("El documento de la organización no existe.");
          }
        } else {
          console.log("No se encontró ningún usuario con esas credenciales!");
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
    setEmail(selectedClientInformation['email']);

    setClientAddress(selectedClientInformation['address']);

    const parts = clientAddress.split(',');
    const address = parts[0].trim();
    setStreetAddres(address);


    // Almacenar los detalles del cliente seleccionado en localStorage
    localStorage.setItem('selectedClientInfo', JSON.stringify(selectedClientInformation));
    localStorage.setItem('clientData', JSON.stringify(selectedClientInformation));
  };

  const handleEarthLinkClientChange = (event) => {
    const selectedAddressId = event.target.value;
    setSelectedAddress(selectedAddressId);

    const selectedAddressInformation = clients.find(client => client.id === selectedAddressId);
    setSelectedAddressInfo(selectedAddressInformation);

    setClientAddress(selectedAddressInformation['address']);

    const parts = clientAddress.split(',');
    const address = parts[0].trim();
    setStreetAddres(address);
    // Almacenar los detalles del cliente seleccionado en localStorage
    localStorage.setItem('selectedClientInfo', JSON.stringify(selectedAddressInformation));
    localStorage.setItem('clientData', JSON.stringify(selectedAddressInformation));
  }

  const handleAttChange = (event) => {
    const selectedAttId = event.target.value;
    setSelecedAttId(selectedAttId);

    const selectedAttInformation = clients.find(client => client.id === selectedAttId);
    setSelectedAttInfo(selectedAttInformation);

    setAttId(selectedAttInformation['uid']);

    localStorage.setItem('selectedClientInfo', JSON.stringify(selectedAttInformation));
    localStorage.setItem('clientData', JSON.stringify(selectedAttInformation));
  }

  const handleLoadData = () => {
    // Lógica para cargar datos relacionados con el cliente seleccionado
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const tabId = activeTab.id;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: insertClientData,
        args: [phone, altPhone, name, last_name, email, address]
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

  const handleToggleForm = () => {
    setShowAddressForm(!showAddressForm);
  };

  /**LÓGICA PARA EARTHLINK**/

  const handleLoadEarthlink = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const tabId = activeTab.id;

      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: insertClientAddress,
        args: [clientAddress, streetAddress] // Pasa clientAddress como argumento
      });
    });
    console.log(`Cargando datos para el cliente ${selectedAddress}`);
  }

  const insertClientAddress = (clientAddress, streetAddress) => {
    // Obtén todos los elementos input
    document.getElementsByClassName('ant-select-search__field').value = streetAddress;
    //document.getElementById('mstid').value = streetAddress;
    //document.getElementById('GloATTUID').value= streetAddress;
    //document.getElementById('GloPassword').value = clientAddress;

    // A continuación, busca el botón de verificación y haz clic en él
    const checkAvailabilityButton = document.querySelector('.regBtn');
    checkAvailabilityButton.click();
  }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'insertClientAddress') {
      insertClientAddress();
      sendResponse({ message: 'Address pushed successfully' });
    }
  });

  const handleLoadAtt = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const tabId = activeTab.id;

      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: insertAttId,
        args: [attId] // Pasa clientAddress como argumento
      });
    });
    console.log(`Cargando datos para el cliente ${selectedAttId}`);
  }

  const insertAttId = (attId) => {
    // Obtén todos los elementos input
    document.getElementById('mstid').value = attId;
    // A continuación, busca el botón de verificación y haz clic en él
    /*const checkAvailabilityButton = document.querySelector('.login-button js-attuid');
    checkAvailabilityButton.click();*/
  }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'insertAttId') {
      insertAttId();
      sendResponse({ message: 'Id pushed succesfully' });
    }
  });

  const componente1 = () => (
    <div>
      {/* Formulario de Saraplus */}
      <img src={sarapluslogo} alt="sarapluslogo" width="100" height="100" />
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
            {client.name} {client.last_name}
          </MenuItem>
        ))}
      </Select>

      {/* Componente ClientFields para mostrar información de cliente */}
      <ClientFields clientInfo={selectedClientInfo} clearFields={handleDelete} />

      <Button variant="contained" onClick={handleLoadData}>
        Cargar Datos
      </Button>
    </div>
  )

  const componente2 = () => (
    <div>
      {/* Formulario de Earthlink */}
      <img src={earthlinklogo} alt="earthlinklogo" width="250" height="50" />
      <Select
        value={selectedAddress}
        onChange={handleEarthLinkClientChange}
        displayEmpty
        fullWidth
      >
        <MenuItem value="" disabled>
          Seleccione una dirección
        </MenuItem>
        {clients.map((client) => (
          <MenuItem key={client.id} value={client.id}>
            {client.address}
          </MenuItem>
        ))}
      </Select>

      {/* Componente ClientAddress para mostrar la dirección */}
      <ClientAddress clientInfo={selectedAddressInfo}></ClientAddress>

      <Button variant="contained" onClick={handleLoadEarthlink}>
        Cargar dirección
      </Button>
    </div>
  )

  const componente3 = () => (
    <div>
      <img src={att_logo} alt='attlogo' width="50" height="50"></img>
      <Select
        value={selectedAttId}
        onChange={handleAttChange}
        displayEmpty
        fullWidth
      >
        <MenuItem value="" disabled>
          Seleccione un id
        </MenuItem>
        {clients.map((client) => (
          <MenuItem key={client.id} value={client.id}>
            {client.id}
          </MenuItem>
        ))}
      </Select>

      <AttPush clientInfo={selectedAttInfo}></AttPush>

      <Button variant='contained' onClick={handleLoadAtt}>
        Cargar id
      </Button>
    </div>
  );

  const [currentComponent, setCurrentComponent] = useState(0);
  const components = [
    componente1,
    componente2,
    componente3
  ];

  const handleNext = () => {
    if (currentComponent < components.length - 1) {
      setCurrentComponent(currentComponent + 1);
    }
  };

  const handlePrevious = () => {
    if (currentComponent > 0) {
      setCurrentComponent(currentComponent - 1);
    }
  };

  return (
    <div className="client-management">
      <div className='title-logo'>
        <img src={icon256} alt="Logo" width="100" height="100" />
        <img src={letraslogo2} alt='Logo2' width="200" height="200" />
      </div>
      <h2>Administración de Clientes</h2>
      <div className="controls">
        {components[currentComponent]()}


        <Button variant="contained" onClick={handlePrevious}>Anterior</Button>
        <Button variant="contained" onClick={handleNext}>Siguiente</Button>
      </div>
    </div>
  );
};

export default ClientList;



