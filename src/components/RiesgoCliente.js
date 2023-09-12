import React, { useEffect, useState } from 'react';
import './RiesgoCliente.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

const RiesgoCliente = ({clientInfo}) => {
  const [selectedOption, setSelectedOption] = useState('opcion1');
  const [accountNumber, setAccountNumber] = useState(clientInfo.accountNumber);
  const [dsiNumber, setDsiNumber] = useState(clientInfo.dsi_number);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleUpdateOption = () => {
    console.log(`Opción seleccionada: ${selectedOption}`);
  };

  const handleAccountUpdate = () => {
    console.log(`Número de cuenta actualizado: ${accountNumber}`);
  };

  const handleDsiUpdate = () => {
    console.log(`Número de DSI actualizado: ${dsiNumber}`);
  };

  useEffect(() => {
    // Cargar los datos almacenados cuando el componente se monta
    const storedData = localStorage.getItem('riesgoCliente');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setSelectedOption(parsedData.selectedOption);
      setAccountNumber(parsedData.accountNumber);
      setDsiNumber(parsedData.dsiNumber);
    }
  }, []);

  useEffect(() => {
    // Guardar los datos cuando cambian
    const dataToStore = {
      selectedOption,
      accountNumber,
      dsiNumber,
    };
    localStorage.setItem('riesgoCliente', JSON.stringify(dataToStore));
  }, [selectedOption, accountNumber, dsiNumber]);

  return (
    <div className="riesgo-cliente">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <FormControl variant="standard" fullWidth>
                <Select
                  id="select1"
                  value={selectedOption}
                  onChange={handleOptionChange}
                >
                  <MenuItem value="opcion1">Riesgo crediticio</MenuItem>
                  <MenuItem value="opcion2">Riesgo Alto</MenuItem>
                  <MenuItem value="opcion3">Riesgo Medio</MenuItem>
                  <MenuItem value="opcion4">Riesgo Bajo</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" onClick={handleUpdateOption}>
                Actualizar
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <TextField
                id="input2"
                placeholder="Actualizar numero de cuenta"
                variant="standard"
                value={clientInfo.account_number}
                onChange={(e) => setAccountNumber(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={handleAccountUpdate}>
                Actualizar
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <TextField
                id="input3"
                placeholder="Actualizar numero de DSI"
                variant="standard"
                value={clientInfo.dsi_number}
                onChange={(e) => setDsiNumber(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={handleDsiUpdate}>
                Actualizar
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default RiesgoCliente;