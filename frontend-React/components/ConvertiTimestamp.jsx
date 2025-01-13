function convertiTimestampAData(timestamp) {
    const data = new Date(parseInt(timestamp, 10));
  
    const giorno = data.getDate().toString().padStart(2, '0');
    const mese = (data.getMonth() + 1).toString().padStart(2, '0');
    const anno = data.getFullYear();
  
    return `${giorno}/${mese}/${anno}`;
  }

  export default convertiTimestampAData;