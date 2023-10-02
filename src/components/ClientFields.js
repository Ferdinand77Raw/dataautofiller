import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './ClientManagement.css';

const ClientFields = ({ clientInfo, clearFields }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    // Actualizar los valores de los campos solo si no están deshabilitados
    if (!isDisabled) {
      setFirstName(clientInfo.name || '');
      setLastName(clientInfo.last_name || '');
    }
  }, [clientInfo, isDisabled]);

  return (
    <div>
      <TextField
        id='client_info'
        variant='outlined'
        placeholder="Name"
        value={clientInfo.name}
        fullWidth
      />
      <TextField
        id='client_last_name'

        variant='outlined'
        placeholder="Last name"
        value={clientInfo.last_name}
        fullWidth
      />
      <Button variant="contained" color="primary">
        Limpiar
      </Button>
    </div>
  );
};

export default ClientFields;
