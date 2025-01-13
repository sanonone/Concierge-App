import { useState } from "react";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import it from "date-fns/locale/it"; // Importa la localizzazione italiana
import * as React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

registerLocale("it", it); // Registra la localizzazione italiana
setDefaultLocale("it"); // Imposta la localizzazione italiana come predefinita

function CardForm(props) {
  const getServizi = props.getServizi;
  let servizi = props.servizi;
  const [formNome, setFormNome] = useState("");
  const [formDescrizione, setFormDescrizione] = useState("");
  const [formImmagine, setFormImmagine] = useState("");
  const [selectedDateVisIni, setSelectedDateVisIni] = useState(null);
  const [selectedDateVisFin, setSelectedDateVisFin] = useState(null);
  const [selectedDateDataIni, setSelectedDateDataIni] = useState(null);
  const [selectedDateDataFin, setSelectedDateDataFin] = useState(null);
  const [orario, setOrario] = useState([]);
  const [dafascia, setdaFascia] = useState('');
  const [afascia, setaFascia] = useState('');
  const [ora, setOra] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [formQuantita, setFormQuantita] = useState(0);
  const [formPosizionamento, setFormPosizionamento] = useState(1);
  const [formLingua, setFormLingua] = useState("Italiano");
  const [scelta, impostaScelta] = useState(false);
  const [disattivazione, setFormDisattivazione] = useState(false)
  const url = props.url
  const config = sessionStorage.getItem("tipoConfigurazione");

  const [prodottiFasceOrarie, setProdottiFasceOrarie] = useState([]);


  const [open, setOpen] = React.useState(false);//snackbar bar update card
  const [word, setWord] = React.useState();//snackbar bar update card
  const [statoAlert, setStatoAlert] = React.useState();
  const handleClose = (event, reason) => {

    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const codStruttura = sessionStorage.getItem("codStruttura");


  // Formatta i dati ottenuti dal backend nel formato richiesto da React Select
  const formattedOptions = config=="Suite" ? servizi.map(item => ({
    value: item.IdProdotto, // Ad esempio, utilizza l'Id del prodotto come value
    label: item.Descrizione // Utilizza la descrizione come label
  })) :
  config=="Standard" ? 
  servizi.map(item => ({
    value: item.id, // Ad esempio, utilizza l'Id del prodotto come value
    label: item.descrizione // Utilizza la descrizione come label
  })) : null
  
  ;


  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };
  //////////////////


  //prova select 2

  const [selectedOptions2, setSelectedOptions2] = useState([]);
  const [newOption, setNewOption] = useState('');

  const handleInputChange = event => {
    setNewOption(event.target.value);
  };

  const handleAddOption = () => {
    if (newOption.trim() !== '') {
      setSelectedOptions2([...selectedOptions2, { value: newOption, label: newOption }]);
      setNewOption('');
    }
  };

  const handleRemoveOption = optionToRemove => {
    setSelectedOptions2(selectedOptions2.filter(option => option !== optionToRemove));
  };

  /////////////////////////////////////////////

  const handleChangeOrario = (e) => {
    const { value } = e.target
    console.log(value)
    setOra(value)
  }

  const handleAddOrario = (e) => {
    const { value } = e.target
    console.log(value)
    if (ora.trim() !== '') {
      setOrario([...orario, { value: [ora, ora], label: ora }]);
    }
    setOra('')
  };

  const handleChangedaFascia = (e) => {
    const { value } = e.target
    console.log(value)
    setdaFascia(value)
  }

  const handleChangeaFascia = (e) => {
    const { value } = e.target
    console.log(value)
    setaFascia(value)
  }


  const handleAddFascia = (e) => {
    const { value } = e.target
    console.log(value)
    if (dafascia.trim() != '' && afascia.trim() != '') {
      if (radio != 'none') {
        setOrario([...orario, { value: [dafascia, afascia], label: `${radio}-dalle ${dafascia} alle ${afascia}` }]);
      }
      else {
        setOrario([...orario, { value: [dafascia, afascia], label: `dalle ${dafascia} alle ${afascia}` }]);
      }
    }
    setdaFascia('')
    setaFascia('')
  };

  const [radio, setRadio] = React.useState('none');
  const handleChangeRadio = (event) => {
    setRadio(event.target.value);
  };

  const handleDateChangeVisIni = (date) => {
    const timestamp = date ? date.getTime() : null;
    setSelectedDateVisIni(timestamp);
    console.log(timestamp);
  };

  const handleDateChangeVisFin = (date) => {
    const timestamp = date ? date.getTime() : null;
    setSelectedDateVisFin(timestamp);
    console.log(timestamp);
  };

  const handleDateChangeDataIni = (date) => {
    const timestamp = date ? date.getTime() : null;
    setSelectedDateDataIni(timestamp);
    console.log(timestamp);
  };

  const handleDateChangeDataFin = (date) => {
    const timestamp = date ? date.getTime() : null;
    setSelectedDateDataFin(timestamp);
    console.log(timestamp);
  };


  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };


  const handleInputChangeNome = (e) => {
    const { name, value } = e.target;
    setFormNome(value);
    console.log(value);
  };

  const handleInputChangeDescrizione = (e) => {
    const { name, value } = e.target;
    setFormDescrizione(value);
    console.log(value);
  };

  const handleInputChangeImmagine = (e) => {
    const { name, value } = e.target;
    setFormImmagine(value);
    console.log(value);
  };

  const handleInputChangeQuantita = (e) => {
    const { name, value } = e.target;
    const val = parseInt(value, 10)
    setFormQuantita(val);
    console.log(typeof (val));
  };

  

  const handleInputChangePosizionamento = (e) => {
    const { name, value } = e.target;
    setFormPosizionamento(parseInt(value, 10));
    console.log(value);
  };

  const handleInputChangeLingua = (e) => {
    const { name, value } = e.target;
    setFormLingua(value);
    console.log(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Crea un array di oggetti contenenti ID del prodotto e fasce orarie associate
    const prodottiFasceOrarieDaInviare = prodottiFasceOrarie.map(item => ({
      idProdotto: item.idProdotto,
      fasceOrarie: item.fasceOrarie
    }));
    //inviare su firebase
    postServizio(
      formNome,
      formDescrizione,
      formImmagine,
      selectedDateVisIni,
      selectedDateVisFin,
      selectedDateDataIni,
      selectedDateDataFin,
      orario,
      selectedOptions,
      prodottiFasceOrarieDaInviare,
      formQuantita,
      formPosizionamento,
      formLingua
    );
  };

  const postServizio = async (
    nome,
    descrizione,
    immagine,
    visIni,
    visFin,
    dataIni,
    dataFin,
    orari,
    prodotti,
    prodottiFasce,
    quantita,
    posizionamento,
    lingua
  ) => {
    try {
      console.log(prodottiFasce)
      const token = sessionStorage.getItem('token');
      await fetch(`${url}servizi/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: nome,
          descrizione: descrizione,
          codStruttura: codStruttura,
          immagine: immagine,
          visDataIni: visIni,
          visDataFin: visFin,
          dataIni: dataIni,
          dataFin: dataFin,
          orari: orari,
          prodotti: prodotti,
          prodottiFasce: prodottiFasce,
          quantita: quantita,
          posizione: posizionamento,
          lingua: lingua,
          visibileWeb: true,
          visibileApp: true,
          visibileAppGuest: true,
        }), //gestire id tramite login
      }).then((response) => response.json()); //gestire eccezioni
      setFormNome("");
      setFormDescrizione("");
      setFormImmagine("");
      setSelectedDateVisIni("");
      setSelectedDateVisFin("");
      setSelectedDateDataIni("");
      setSelectedDateDataFin("");
      setFormQuantita("");
      
      setFormPosizionamento("");
      setFormLingua("Italiano");
      getServizi();
      setStatoAlert("success")
      setWord("Creato con successo")
      setOpen(true);
    } catch (error) {
      setStatoAlert("error")
      setWord("Errore durante la creazione")
      console.log(`errore:${error}`)
      setOpen(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" shadow-lg shadow-slate-500/60 flex flex-col w-[350px] mb-10 bg-[rgba(51,135,184,0.8)] p-3 rounded-lg gap-5"
    >

      {/*
      <div className="flex ">
        <label className=" border-2 border-sky-900 text-xl text-white bg-sky-600 rounded-md p-1 font-medium ">
          Inserisci servizio
        </label>
      </div>
  */}

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={statoAlert}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {word}
        </Alert>
      </Snackbar>

      

      <div className="flex flex-col">
        <label className=" text-lg font-medium text-gray-800">Nome</label>
        <input
          className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
          type="text"
          name="nome"
          value={formNome}
          onChange={handleInputChangeNome}
        />
      </div>
      <div className="flex flex-col">
        <label className=" text-lg font-medium text-gray-800">Descrizione</label>
        <textarea
          className=" h-32 border-2 focus:outline-none focus:border-indigo-500 rounded-md"
          name="descrizione"
          value={formDescrizione}
          onChange={handleInputChangeDescrizione}
        />
      </div>
      <div className="flex flex-col">
        <label className=" text-lg font-medium text-gray-800">Immagine</label>
        <input
          className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
          type="text"
          name="nome"
          value={formImmagine}
          onChange={handleInputChangeImmagine}
        />
      </div>
      <div className="flex flex-col">
        <label className=" text-lg font-medium text-gray-800">Range visibilità *</label>
        <div className="flex flex-row">
          <label className=" pr-2 text-lg font-medium text-gray-800">Da:</label>
          <DatePicker
            selected={selectedDateVisIni}
            onChange={handleDateChangeVisIni}
            placeholderText="Seleziona una data"
            dateFormat="dd/MM/yyyy"
            className="border-2 p-1 rounded focus:outline-none focus:border-blue-500 w-40"
          />
        </div>
        <div className="flex flex-row pt-1">
          <label className=" pr-5 text-lg font-medium text-gray-800">a:</label>
          <DatePicker
            selected={selectedDateVisFin}
            onChange={handleDateChangeVisFin}
            placeholderText="Seleziona una data"
            dateFormat="dd/MM/yyyy"
            className="border-2 p-1 rounded focus:outline-none focus:border-blue-500 w-40"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label className=" text-lg font-medium text-gray-800">Data disponibilità *</label>
        <div className="flex flex-row">
          <label className=" text-lg font-medium pr-2 text-gray-800">Da:</label>
          <DatePicker
            selected={selectedDateDataIni}
            onChange={handleDateChangeDataIni}
            placeholderText="Seleziona una data"
            dateFormat="dd/MM/yyyy"
            className="border-2 p-1 rounded focus:outline-none focus:border-blue-500 w-40"
          />
        </div>
        <div className="flex flex-row pt-1">
          <label className=" pr-5 text-lg font-medium text-gray-800">a:</label>
          <DatePicker
            selected={selectedDateDataFin}
            onChange={handleDateChangeDataFin}
            placeholderText="Seleziona una data"
            dateFormat="dd/MM/yyyy"
            className="border-2 p-1 rounded focus:outline-none focus:border-blue-500 w-40"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className=" text-lg font-medium text-gray-800">Orario o fasce orarie:</label>
        <div className=" flex flex-row gap-3 pl-2">
          <input
            className=" w-30 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
            type="time"
            name=""
            id=""
            value={ora}
            onChange={handleChangeOrario}
          />
          <button
            type="button"
            className=" transition-all duration-300 flex-auto focus:outline-none focus:ring bg-sky-900 hover:bg-sky-700 active:bg-blue-800 text-white font-bold py-1 px-2 rounded"
            onClick={handleAddOrario}
          >
            Orario
          </button>
        </div>

        <div className=" flex flex-row gap-3 pl-2">
          <input
            className=" w-48 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
            type="time"
            name=""
            id=""
            value={dafascia}
            onChange={handleChangedaFascia}
          />
          <input
            className=" w-48 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
            type="time"
            name=""
            id=""
            value={afascia}
            onChange={handleChangeaFascia}
          />
          <button
            type="button"
            className=" transition-all duration-300 flex-auto focus:outline-none focus:ring bg-sky-900 hover:bg-sky-700 active:bg-blue-800 text-white font-bold py-1 px-2 rounded"
            onClick={handleAddFascia}
          >
            Fascia
          </button>
        </div>

        <div>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={radio}
            onChange={handleChangeRadio}
          >
            <FormControlLabel value="mattina" control={<Radio />} label="Mattina" />
            <FormControlLabel value="pomeriggio" control={<Radio />} label="Pomeriggio" />
            <FormControlLabel value="giornata" control={<Radio />} label="Intera giornata" />
            <FormControlLabel value="none" control={<Radio />} label="None" />
          </RadioGroup>
        </div>

        <div>
          <Select
            options={orario}
            value={orario}
            isMulti
            onChange={setOrario}
            placeholder="orari/fasce orarie"
          />
        </div>
      </div>


      <div>
        <h2>Seleziona prodotti:</h2>
        <Select
          isMulti
          options={formattedOptions}
          value={selectedOptions}
          onChange={handleChange}
          placeholder="prodotti agganciabili al servizio"
          onSubmit={null}
        />
      </div>

      <div>
        {selectedOptions.map((prodotto, index) => (
          <div key={index}>
            <h2>Seleziona fasce orarie per {prodotto.label}:</h2>
            <Select
              isMulti
              options={orario}
              value={prodottiFasceOrarie[index] ? prodottiFasceOrarie[index].fasceOrarie.label : []}
              onChange={(selectedOptions) => {
                const newProdottiFasceOrarie = [...prodottiFasceOrarie];
                newProdottiFasceOrarie[index] = {
                  idProdotto: prodotto.value,
                  fasceOrarie: selectedOptions
                };
                setProdottiFasceOrarie(newProdottiFasceOrarie);
              }}
              placeholder={`Seleziona fasce orarie per ${prodotto.label}`}
            />
          </div>
        ))}
      </div>



      <div className="flex flex-col">
        <div className="flex flex-row">
          <label className=" text-lg font-medium pr-2 text-gray-800">Quantità:</label>
          <input
            className=" w-12 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
            type="number"
            name="nome"
            value={formQuantita}
            onChange={handleInputChangeQuantita}
          />
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className="flex flex-row">
          <label className=" pr-2 text-lg font-medium text-gray-800">Posizionamento:</label>
          <input
            className=" w-12 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
            type="number"
            name="nome"
            value={formPosizionamento}
            onChange={handleInputChangePosizionamento}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row">
          <label className=" text-lg font-medium pr-2 text-gray-800">Traduzione:</label>
          <select
            className="border-2 focus:outline-none focus:border-indigo-500 rounded-md h-6"
            id="lingua"
            value={formLingua}
            onChange={handleInputChangeLingua}
          >
            <option value="Italiano">Italiano</option>
            <option value="Inglese">Inglese</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className=" transition-all duration-300 flex-auto focus:outline-none focus:ring bg-sky-900 hover:bg-sky-700 active:bg-blue-800 text-white font-bold py-1 px-2 rounded"
      >
        Crea
      </button>
    </form>
  );
}

export default CardForm;
