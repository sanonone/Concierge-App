function convertiTimestampAData(timestamp) {
    const data = new Date(parseInt(timestamp, 10));
  
    const giorno = data.getDate().toString().padStart(2, '0');
    const mese = (data.getMonth() + 1).toString().padStart(2, '0');
    const anno = data.getFullYear();

    const ora = data.getHours().toString().padStart(2, '0');
    const minuti = data.getMinutes().toString().padStart(2, '0');
    const secondi = data.getSeconds().toString().padStart(2, '0');
  
    return `${giorno}/${mese}/${anno} ${ora}:${minuti}:${secondi}`;
}

export default convertiTimestampAData;
