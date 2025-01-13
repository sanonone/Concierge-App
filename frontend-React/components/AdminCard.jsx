import { useState, useEffect } from "react";
import * as React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import ConvertiTimestamp from './ConvertiTimestamp';
import DeleteUserDialog from '../components/Mui/DeleteUserDialog'
import { Password } from "@mui/icons-material";
import Select from 'react-select';

function AdminCard(props) {
  const ID = props.id;
  const username = props.username;
  const codStruttura = props.codStruttura;
  const DBname = props.DBname;
  const ipStruttura = props.ipStruttura;
  const dataAttivazione = props.dataAttivazione;
  const attivo = props.attivo;
  const admin = props.admin
  const app = props.app
  const web = props.web
  const IdAzienda = props.IdAzienda
  const idStripe = props.idStripe
  const tipoConfigurazione = props.tipoConfigurazione
  //const codStruttura = props.codStruttura;
  const getAllUsers = props.getAllUsers;
  const url = props.url
  //const url = "http://localhost:3000/"
  //const url = "https://us-central1-fir-autenticazione-d201f.cloudfunctions.net/api/"

  const [formUsername, setFormUsername] = useState(username);
  const [formPassword, setFormPassword] = useState("");
  const [formCodStruttura, setFormCodStruttura] = useState(codStruttura);
  const [formDBname, setFormDBname] = useState(DBname);
  const [formIpStruttura, setFormIpStruttura] = useState(ipStruttura);
  const [formDataAttivazione, setFormDataAttivazione] = useState(dataAttivazione);
  const [formAttivo, setFormAttivo] = useState(attivo);
  const [formApp, setFormApp] = useState(app);
  const [formWeb, setFormWeb] = useState(web);
  const [formIdAzienda, setFormIdAzienda] = useState(IdAzienda);
  const [formIdStripe, setFormIdStripe] = useState(idStripe);
  const [formTipoConfigurazione, setFormTipoConfigurazione] = useState(tipoConfigurazione)

  const [open, setOpen] = React.useState(false);//snackbar bar update card
  const [word, setWord] = React.useState();//snackbar bar update card
  const [statoAlert, setStatoAlert] = React.useState();
  const handleClose = (event, reason) => {

    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };



  const handleInputChangeUsername = (e) => {
    const { name, value } = e.target;
    setFormUsername(value);
    console.log(value);
  };

  const handleInputChangePassword = (e) => {
    const { name, value } = e.target;
    setFormPassword(value);
    console.log(value);
  };

  const handleInputChangeCodStruttura = (e) => {
    const { name, value } = e.target;
    setFormCodStruttura(value);
    console.log(value);
  };

  const handleInputChangeDBname = (e) => {
    const { name, value } = e.target;
    setFormDBname(value);
    console.log(value);
  };

  const handleInputChangeIpStruttura = (e) => {
    const { name, value } = e.target;
    setFormIpStruttura(value);
    console.log(value);
  };


  const handleInputChangeDataAttivazione = (e) => {
    const { name, value } = e.target;
    setFormDataAttivazione(value);
    console.log(value);
  };


  const handleInputChangeAttivo = () => {
    setFormAttivo(!formAttivo);
    //console.log(`scelta della checkbox ${attivaHotel}`);
  };

  const handleInputChangeApp = () => {
    setFormApp(!formApp);
    //console.log(`scelta della checkbox ${attivaHotel}`);
  };

  const handleInputChangeWeb = () => {
    setFormWeb(!formWeb);
    //console.log(`scelta della checkbox ${attivaHotel}`);
  };

  const handleInputChangeIdAzienda = (e) => {
    const { name, value } = e.target;
    setFormIdAzienda(value);
    console.log(value);
  };

  const handleInputChangeIdStripe = (e) => {
    const { name, value } = e.target;
    setFormIdStripe(value);
    console.log(value);
  };


  // Formatta i dati ottenuti dal backend nel formato richiesto da React Select
  const formattedOptions = [{
    value: "Suite", // Ad esempio, utilizza l'Id del prodotto come value
    label: "Suite" // Utilizza la descrizione come label
  },
  {
    value: "Standard", // Ad esempio, utilizza l'Id del prodotto come value
    label: "Standard" // Utilizza la descrizione come label
  },
  ];


  const handleChangeConfigurazione = (selected) => {
    //console.log(`${selected[0].value} ${selected[0].label}`)
    setFormTipoConfigurazione(selected);
    console.log(`lunghezza: ${selected.length}`)

  };

  const modifica = async () => {

    try {

      //await postImg();

      const token = sessionStorage.getItem('token');
      await fetch(`${url}auth/updateUser/${ID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          codStruttura: formCodStruttura,
          ipStruttura: formIpStruttura,
          DBname: formDBname,
          attivo: formAttivo,
          app: formApp,
          web: formWeb,
          password: formPassword,
          IdAzienda: formIdAzienda,
          idStripe: formIdStripe,
          tipoConfigurazione: formTipoConfigurazione,
        }),
      });

      // Attendere la risposta non è più necessario quando usi l'async/await.
      getAllUsers()
      setStatoAlert("success")
      setWord("Modificato")
      setOpen(true);
    } catch (errore) {
      console.error("Errore nella richiesta di modifica:", errore);
      // Gestisci l'errore come desideri
      setStatoAlert("error")
      setWord("Errore durante la modifica")
      setOpen(true);
    }
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <div className=" flex flex-col  border-2 border-sky-800 rounded-lg bg-slate-200 overflow-x-clip  transition-transform shadow-lg shadow-slate-500/60">
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




      {admin ? <h3 className=" mt-1 ml-1 border-b-4 border-red-400 w-12 font-medium text-red-600 text-sm">ADMIN</h3> : null}
      <div className="flex lg:flex-row flex-col px-2 py-2 gap-2">

        <div className=" flex flex-row gap-1">
          <h3 className=" text-indigo-700  font-medium">User:</h3>
          <h3>{formUsername}</h3>
          {/*
          <input
            className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7 w-28"
            type="text"
            name="nome"
            value={formUsername}
            onChange={handleInputChangeUsername}
          />
          */}
        </div>

        <div className=" flex flex-row gap-1">
          <h3 className=" text-indigo-700  font-medium">New Password:</h3>


          <input
            className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7 w-28"
            type="text"
            name="nome"
            value={formPassword}
            onChange={handleInputChangePassword}
          />

        </div>


        <div className=" flex flex-row gap-1">
          <h3 className=" text-indigo-700  font-medium">Codice Struttura:</h3>
          <h3>{formCodStruttura}</h3>
          {/*
          <input
            className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7 w-8"
            type="text"
            name="nome"
            value={formCodStruttura}
            onChange={handleInputChangeCodStruttura}
          />*/}
        </div>
        <div className=" flex flex-row gap-1">
          <h3 className=" text-indigo-700  font-medium">Ip Struttura:</h3>
          <input
            className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7 w-28"
            type="text"
            name="nome"
            value={formIpStruttura}
            onChange={handleInputChangeIpStruttura}

          />
        </div>
        <div className=" flex flex-row gap-1">
          <h3 className=" text-indigo-700  font-medium">DB name:</h3>
          <input
            className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7 w-28"
            type="text"
            name="nome"
            value={formDBname}
            onChange={handleInputChangeDBname}

          />
        </div>
        <div className=" flex flex-row gap-1">
          <h3 className=" text-indigo-700  font-medium">Id Azienda:</h3>
          <input
            className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7 w-9"
            type="number"
            name="nome"
            value={formIdAzienda}
            onChange={handleInputChangeIdAzienda}

          />
        </div>
        <div className=" flex flex-row gap-1">
          <h3 className=" text-indigo-700  font-medium">Attivazione:</h3>
          <h3>{ConvertiTimestamp(formDataAttivazione)}</h3>
        </div>
        <div className=" flex flex-row gap-1">
          <h3 className=" text-indigo-700  font-medium">Attivo:</h3>
          <Switch
            checked={formAttivo}
            onChange={handleInputChangeAttivo}
            color="success"
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </div>

      </div>

      <div className="flex lg:flex-row flex-col px-2 py-2 gap-2">
        <div className=" flex flex-row gap-1">
          <h3 className=" text-indigo-700  font-medium">App mobile:</h3>
          <Switch
            checked={formApp}
            onChange={handleInputChangeApp}
            color="success"
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </div>

        <div className=" flex flex-row gap-1">
          <h3 className=" text-indigo-700  font-medium">Prenotazioni Web:</h3>
          <Switch
            checked={formWeb}
            onChange={handleInputChangeWeb}
            color="success"
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </div>
        <div className=" flex flex-row gap-1">
          <h3 className=" text-indigo-700  font-medium">ID Stripe:</h3>
          <input
            className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7 w-auto"
            type="text"
            name="nome"
            value={formIdStripe}
            onChange={handleInputChangeIdStripe}

          />
        </div>

        <Select
          isMulti={false}
          options={formattedOptions}
          value={formTipoConfigurazione}
          onChange={handleChangeConfigurazione}
          placeholder="Seleziona Configurazione"
          onSubmit={null}
          menuPosition="fixed"
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,  // Applica direttamente il z-index al menu
            }),
            control: (base) => ({
              ...base,
              zIndex: 2,  // Imposta un z-index maggiore rispetto al TextField per il controllo
            }),
          }}
        />

        <div className=" flex flex-row gap-1">
          <h3 className=" text-indigo-700  font-medium">Link Web:</h3>
          <h3>https://localhost:5173/PrenotazioneWeb/{formCodStruttura}</h3>
          {/*
          <input
            className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7 w-28"
            type="text"
            name="nome"
            value={formUsername}
            onChange={handleInputChangeUsername}
          />
          */}
        </div>
      </div>

      <div className=" flex sm:flex-row flex-col gap-10  justify-between items-end m-auto mb-2 mt-2">
        <DeleteUserDialog getAllUsers={getAllUsers} codStruttura={formCodStruttura} url={url} username={formUsername}></DeleteUserDialog>
        <button
          className="transition-all duration-300 flex-auto focus:outline-none focus:ring bg-sky-900 hover:bg-sky-700 active:bg-indigo-800 text-white font-bold py-1 px-2 rounded w-48"
          onClick={modifica}
        >
          Modifica
        </button>
      </div>
    </div>
  );
}

export default AdminCard;
