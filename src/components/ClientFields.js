import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const ClientFields = ({ clientInfo, clearFields }) => {

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleClear = () => {
    // Restablece los estados de los campos y llama a la función de limpieza
    setFirstName('');
    setLastName('');
    clearFields();
  };

  return (
    <div>
      <TextField
        id='client_info'
        variant='outlined'
        placeholder="Name"
        value={clientInfo.name}
        onChange={handleFirstNameChange}
        fullWidth
      />
      <TextField
        id='client_last_name'

        variant='outlined'
        placeholder="Last name"
        value={clientInfo.last_name}
        onChange={handleLastNameChange}
        fullWidth
      />
      <Button variant="contained" onClick={handleClear}>
        Limpiar
      </Button>

    </div>
  );
};

export default ClientFields;
