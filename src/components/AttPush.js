import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';


const AttData = ({ clientInfo }) => {
    return (
        <div>
            <TextField
                id='client_info'
                variant='outlined'
                placeholder="Name"
                value={clientInfo.uid}
                fullWidth
            >
            </TextField>
        </div>
    )
}


export default AttData;