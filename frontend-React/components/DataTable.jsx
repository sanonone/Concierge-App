import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const DataTable = (props) => {
  const prenotazioni = props.prenotazioni;

  const uniqueDates = React.useMemo(() => {
    const dates = [];
    prenotazioni.forEach(day => {
      day.forEach(item => {
        if (!dates.includes(item.data)) {
          dates.push(item.data);
        }
      });
    });
    return dates;
  }, [prenotazioni]);

  const uniqueServices = React.useMemo(() => {
    const services = [];
    prenotazioni.forEach(day => {
      day.forEach(item => {
        if (!services.includes(item.nomeServizio)) {
          services.push(item.nomeServizio);
        }
      });
    });
    return services;
  }, [prenotazioni]);

  const columns = React.useMemo(() => [
    { field: 'nomeServizio', headerName: 'Nome Servizio', width: 150 },
    ...uniqueDates.map(date => ({
      field: date,
      headerName: date,
      width: 150,  // Increased width for better visibility
    })),
  ], [uniqueDates]);

  const rows = React.useMemo(() => {
    const dataRows = uniqueServices.map((nomeServizio, id) => {
      const row = { id, nomeServizio };
      prenotazioni.forEach(day => {
        day.forEach(item => {
          if (item.nomeServizio === nomeServizio) {
            row[item.data] = item.disponibilita;
          }
        });
      });
      return row;
    });
    return dataRows;
  }, [prenotazioni, uniqueServices]);

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'blue',
            color: 'white',
            fontSize: 14, // Adjusted font size for better readability
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: 'grey',
            color: 'white',
            '&:first-of-type': {
              position: 'sticky',
              left: 0,
              zIndex: 2,
            },
          },
          '& .MuiDataGrid-cell:first-of-type': {
            backgroundColor: 'blue',
            color: 'white',
            position: 'sticky',
            left: 0,
            zIndex: 2,
          },
          '& .MuiDataGrid-cell': {
            border: '1px solid black',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: 'white', // Explicitly set text color to white
          },
        }}
      />
    </Box>
  );
};

export default DataTable;
