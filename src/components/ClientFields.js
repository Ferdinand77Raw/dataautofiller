import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';

const ClientFields = ({ clientInfo }) => {

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
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
    </div>
  );
};

export default ClientFields;
