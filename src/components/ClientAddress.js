import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';


const ClientAddress = ({ clientInfo }) => {
    return (
        <div>
            <TextField
                id='client_info'
                variant='outlined'
                placeholder="Name"
                value={clientInfo.address}
                fullWidth
            >
            </TextField>
        </div>
    )
}


export default ClientAddress;