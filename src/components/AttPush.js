import TextField from '@mui/material/TextField';

const AttData = ({ clientInfo }) => {
    return (
        <div>
            <TextField
                id='client_info'
                variant='outlined'
                placeholder="Name"
                value={clientInfo}
                fullWidth
                type='password'
            >
            </TextField>
        </div>
    )
}


export default AttData;