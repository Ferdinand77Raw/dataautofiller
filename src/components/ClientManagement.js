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
import letraslogo2 from '../../public/img/letras-logo-2.png';
import { onSnapshot } from 'firebase/firestore';
import ClientAddress from './ClientAddress.js';
import AttPush from './AttPush.js';
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";

import sarapluslogo from './sarapluslogo.png';
import earthlinklogo from './earthlinklogo.png';
import att_emblema from './att-logo-0.png';

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

  /**Variables extra de direcciones */
  const [streetAddress, setStreetAddres] = useState('');
  const [zip, setZip] = useState('');
  const [city, setCity] = useState('');

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

    const storedAddress = localStorage.getItem('selectedAddressInfo');
    if (storedAddress) {
      setSelectedAddressInfo(JSON.parse(storedAddress));
    }

    const storedAttId = localStorage.getItem('clientAttId');
    if (storedAttId !== null && storedAttId !== undefined) {
      setAttId(JSON.parse(storedAttId));
    }
  }, []);

  useEffect(() => {
    const savedComponentIndex = localStorage.getItem('currentComponentIndex');
    if (savedComponentIndex !== null) {
      setCurrentComponent(Number(savedComponentIndex));
    }
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
              console.log('Attuid es así: ', organizationData['attuid']);
              // Aquí puedes hacer lo que necesites con los datos de la organización
              const attuid = organizationData['attuid'];
              if (attuid) {
                setAttId(attuid);
                localStorage.setItem('selectedAttId', JSON.stringify(attuid));
                localStorage.setItem('clientAttId', JSON.stringify(attuid));
                console.log("El attuid es: ", attuid);
              } else {
                console.error('No se encontró un valor válido para attuid en la organización.');
                // Puedes manejar esta situación según tus necesidades, como establecer un valor predeterminado o mostrar un mensaje de error.
              }

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
    setAddress(selectedAddressInformation['address']);

    /*
    const parts = clientAddress.split(',');
    const address = parts[0].trim();
    setStreetAddres(address);*/
    // Almacenar los detalles del cliente seleccionado en localStorage
    localStorage.setItem('selectedAddressInfo', JSON.stringify(selectedAddressInformation));
    localStorage.setItem('clientAddressInfo', JSON.stringify(selectedAddressInformation));
  }

  const handleAttChange = (event) => {
    const selectedAttId = event.target.value;
    setSelecedAttId(selectedAttId);

    const selectedAttInformation = clients.find(client => client.id === selectedAttId);
    setSelectedAttInfo(selectedAttInformation);

    setAttId(selectedAttInformation['uid']);

    localStorage.setItem('selectedAttId', JSON.stringify(selectedAttInformation));
    localStorage.setItem('clientAttId', JSON.stringify(selectedAttInformation));
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


  /**LÓGICA PARA EARTHLINK**/

  const handleLoadEarthlink = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const tabId = activeTab.id;

      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: insertClientAddress,
        args: [address]
      });
    });
  }

  const insertClientAddress = (address) => {
    console.log("La dirección seteada es: ", address);

    // Obtén el primer elemento que coincida con la clase 'ant-select-search__field'
    const inputElement = document.querySelector('.ant-select-search__field');

    if (inputElement) {
      // Establece el valor del campo de entrada
      inputElement.value = address;

      // Simula un evento 'input' para que la página pueda reaccionar al cambio
      const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
      });
      inputElement.dispatchEvent(inputEvent);

      // Si es necesario, puedes hacer clic en el botón de verificación después de establecer el valor.

      const checkAvailabilityButton = document.querySelector('.regBtn');
      if (checkAvailabilityButton) {
        checkAvailabilityButton.click();
      }

    } else {
      console.error('No se encontró ningún elemento con la clase "ant-select-search__field".');
    }
  }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'insertClientAddress') {
      insertClientAddress(request.address);
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

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const tabId = activeTab.id;

      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: executeClick,
      });
    });
    //setTimeout(execInjection, 500);
    console.log(`Cargando datos para el cliente ${selectedAttId}`);
  }

  const insertAttId = (attId) => {
    // Obtén el elemento input
    const mstidInput = document.getElementById('mstid');

    if (mstidInput) {
      // Guarda el valor actual antes de cambiar el tipo
      const currentValue = mstidInput.value;

      // Cambia el tipo a 'text', asigna el valor y luego vuelve a 'password'
      mstidInput.type = 'text';
      mstidInput.value = currentValue + attId;
      mstidInput.type = 'password';
    }
  };

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'insertAttId') {
      insertAttId(request.attId);
      sendResponse({ message: 'Id pushed successfully' });
    }
  });

  const componente1 = () => (
    <div>
      {/* Formulario de Saraplus */}
      <img src={sarapluslogo} alt="sarapluslogo" width="100" />
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
      <img src={earthlinklogo} alt="earthlinklogo" width="250" />
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
      <img src={att_emblema} alt='attlogo' width="50" height="50"></img>
      <AttPush clientInfo={attId}></AttPush>
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
      localStorage.setItem('currentComponentIndex', String(currentComponent + 1));
      setCurrentComponent(currentComponent + 1);
    }
  };

  const handlePrevious = () => {
    if (currentComponent > 0) {
      localStorage.setItem('currentComponentIndex', String(currentComponent - 1));
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
        <div className="control-buttons">
          <table className="centered-buttons">
            <tbody>
              <tr>
                <td>
                  <button onClick={handlePrevious} className='rounded-button'>
                    <AiFillCaretLeft />
                  </button>
                  <button onClick={handleNext} className='rounded-button'>
                    <AiFillCaretRight />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientList;



