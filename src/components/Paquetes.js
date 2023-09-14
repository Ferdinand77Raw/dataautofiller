import React, { useEffect, useState } from 'react';
import './Paquetes.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import format from 'date-fns/format';

const Paquetes = ({ clientInfo, clearFields }) => {

  const [selectedPackage, setSelectedPackage] = useState('Nothing selected');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [formattedInstallDate, setFormattedInstallDate] = useState('');
  const [formattedStartDate, setFormattedStartDate] = useState('');
  const [formattedEndDate, setFormatedEndDate] = useState('');

  useEffect(() => {
    if (clientInfo && clientInfo['install_date'] && clientInfo["install_date"]["seconds"] && clientInfo["install_date"]["nanoseconds"]) {
      var seconds = clientInfo["install_date"]["seconds"];
      var nanoseconds = clientInfo["install_date"]["nanoseconds"];

      // Convertir nanosegundos a milisegundos
      var milliseconds = (seconds * 1000) + (nanoseconds / 1000000);
      var dateObject = new Date(milliseconds);

      var year = dateObject.getFullYear();
      var month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
      var day = dateObject.getDate().toString().padStart(2, "0");

      // Formatear la fecha en el formato deseado
      var formattedDate = `${year}-${month}-${day}`;
      setFormattedInstallDate(formattedDate);
    } else {

    }
  }, [clientInfo]);

  useEffect(() => {
    if (clientInfo && clientInfo["start_time"] && clientInfo["start_time"]["seconds"] && clientInfo["start_time"]["nanoseconds"]) {
      var seconds = clientInfo["start_time"]["seconds"];
      var nanoseconds = clientInfo["start_time"]["nanoseconds"];

      // Convertir nanosegundos a milisegundos
      var milliseconds = (seconds * 1000) + (nanoseconds / 1000000);
      var dateObject = new Date(milliseconds);

      var year = dateObject.getFullYear();
      var month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
      var day = dateObject.getDate().toString().padStart(2, "0");
      var hours = dateObject.getHours().toString().padStart(2, "0");
      var minutes = dateObject.getMinutes().toString().padStart(2, "0");
      var seconds = dateObject.getSeconds().toString().padStart(2, "0");

      // Formatear la fecha en el formato deseado
      var formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      setFormattedStartDate(formattedDate);
    } else {
      //console.log("No se pudo acceder a la propiedad 'start_time', 'seconds' o 'nanoseconds'");
    }
  }, [clientInfo]);

  useEffect(() => {
    if (clientInfo && clientInfo["end_time"] && clientInfo["end_time"]["seconds"] && clientInfo["end_time"]["nanoseconds"]) {
      var seconds = clientInfo["end_time"]["seconds"];
      var nanoseconds = clientInfo["end_time"]["nanoseconds"];

      // Convertir nanosegundos a milisegundos
      var milliseconds = (seconds * 1000) + (nanoseconds / 1000000);
      var dateObject = new Date(milliseconds);

      var year = dateObject.getFullYear();
      var month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
      var day = dateObject.getDate().toString().padStart(2, "0");
      var hours = dateObject.getHours().toString().padStart(2, "0");
      var minutes = dateObject.getMinutes().toString().padStart(2, "0");
      var seconds = dateObject.getSeconds().toString().padStart(2, "0");

      // Formatear la fecha en el formato deseado
      var formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      setFormatedEndDate(formattedDate);
    } else {

    }
  }, [clientInfo]);

  const handleCustomDateChange = (event) => {
    setCustomDate(event.target.value);
  };

  const handlePackageChange = (event) => {
    setSelectedPackage(event.target.value);
  };

  const handleCustomDateConfirm = () => {
    console.log('Fecha personalizada:', formattedInstallDate);
    console.log('Paquete seleccionado:', selectedPackage);
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  const handleUpdate = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const tabId = activeTab.id;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: insertDate,
        args: [startTime, endTime]
      });
    });
  };

  function insertDate(dateStart, dateEnd) {
    document.getElementById('WorkingOrder_editView_fieldName_installdate').value = dateStart;
    document.getElementById('WorkingOrder_editView_fieldName_installdate_end').value = dateEnd;
  }

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == 'insertDate') {
      insertDate();
      sendResponse({ message: 'Date confirmed successfully' });
    }
  });

  useEffect(() => {
    // Cargar los datos almacenados cuando el componente se monta
    const storedData = localStorage.getItem('selectedClientInfo');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setSelectedPackage(parsedData.selectedPackage);
      setStartTime(parsedData.formattedStartDate);
      setEndTime(parsedData.formattedEndDate);
      setFormattedInstallDate(parsedData.formattedInstallDate);
      setFormattedStartDate(parsedData.formattedStartDate);
      setFormatedEndDate(parsedData.formattedEndDate);
    }
  }, []);

  useEffect(() => {
    // Guardar los datos cuando cambian
    const dataToStore = {
      formattedInstallDate,
      selectedPackage,
      formattedStartDate,
      formattedEndDate
    };
    localStorage.setItem('selectedClientInfo', JSON.stringify(dataToStore));
  }, [formattedInstallDate, selectedPackage, formattedStartDate, formattedEndDate]);


  return (
    <div className="paquetes">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={4}>
              <InputLabel>Fechas de instalación / Paquetes</InputLabel>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <FormControl variant="standard">
                <TextField
                  id="customDatePicker"
                  label="Fecha de instalación"
                  type="date"
                  value={formattedInstallDate}
                  onChange={handleCustomDateChange}
                />
                <TextField
                  id='package'
                  placeholder='Paquete instalado'
                  value={clientInfo.package}
                  variant="standard"
                  onChange={(e) => setSelectedPackage(e.target.value)}
                />
                <Button className='confirmationButton' variant="contained" onClick={handleCustomDateConfirm}>
                  Confirmar fecha y paquete
                </Button>
              </FormControl>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <FormControl variant="standard">
                <TextField
                  id="startime"
                  label="Inicio"
                  type='datetime-local'
                  value={formattedStartDate}
                  onChange={handleStartTimeChange}
                />
              </FormControl>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <FormControl variant="standard">
                <TextField
                  id="endtime"
                  label="Finalización"
                  type='datetime-local'
                  value={formattedEndDate}
                  onChange={handleEndTimeChange}
                />
              </FormControl>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button variant="contained" type="submit" onClick={handleUpdate}>
        Actualizar
      </Button>
      <Button variant="contained" onClick={clearFields}>
        Limpiar
      </Button>
    </div>
  );
};

export default Paquetes;
