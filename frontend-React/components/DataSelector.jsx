import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import it from 'date-fns/locale/it'; // Importa la localizzazione italiana

registerLocale('it', it); // Registra la localizzazione italiana
setDefaultLocale('it'); // Imposta la localizzazione italiana come predefinita


function DateSelector(){
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getTimestamp = () => {
    return selectedDate ? selectedDate.getTime() : null;
    //ritorno la data
  };

  return (
    <div className="flex items-center ">
      
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        placeholderText="Seleziona una data"
        dateFormat="dd/MM/yyyy"
        className="border-2 p-1 rounded focus:outline-none focus:border-blue-500"
      />
      
    </div>
  );
};

export default DateSelector;
