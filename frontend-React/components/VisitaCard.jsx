import { useState, useEffect } from "react";
import * as React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function VisitaCard(props) {
  const ID = props.id;
  const nome = props.nome;
  const descrizione = props.descrizione;
  const immagine = props.immagine;
  const linkmappa = props.linkmappa;
  const posizione = props.posizione;
  const lingua = props.lingua;
  const codStruttura = props.codStruttura;
  const getVisita = props.getVisita;
  const url = props.url
  //const url = "http://localhost:3000/"
  //const url = "https://us-central1-fir-autenticazione-d201f.cloudfunctions.net/api/"

  const [formNome, setFormNome] = useState(nome);
  const [formDescrizione, setFormDescrizione] = useState(descrizione);
  const [formImmagine, setFormImmagine] = useState(immagine);
  const [formLinkMappa, setFormLinkMappa] = useState(linkmappa);
  const [formPosizionamento, setFormPosizionamento] = useState(posizione);
  const [formLingua, setFormLingua] = useState(lingua);

  const [open, setOpen] = React.useState(false);//snackbar bar update card
  const [word, setWord] = React.useState();//snackbar bar update card
  const [statoAlert, setStatoAlert] = React.useState();
  const handleClose = (event, reason) => {

    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  //gestione upload immagine
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    console.log(event.target.files[0])
    console.log(typeof (event.target.files[0]))
    setSelectedFile(event.target.files[0]);
    postImg(event.target.files[0])
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

  const handleInputChangeLinkMappa = (e) => {
    const { name, value } = e.target;
    setFormLinkMappa(value);
    console.log(value);
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

  const postImg = async (selectedFile) => {
    try {
      /*
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('folder', codStruttura); // Passa il nome della cartella nel campo di testo
      formData.append('id',ID)
      */

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;

        const payload = {
          image: base64Image,
          folder: codStruttura,
          id: ID,
        };

        const token = sessionStorage.getItem('token');
        const res = await fetch(`${url}upload/`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          // Accedi al campo imageUrl e stampalo
          console.log(data.imageUrl);
          setFormImmagine(data.imageUrl)
          getVisita();
          setWord("Immagine caricata correttamente")
          setStatoAlert("success")
          setOpen(true);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      setStatoAlert("error")
      setWord("Errore durante l'upload dell'immagine")
      setOpen(true);
    }


  }


  const deleteImg = async () => {
    try {

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('folder', codStruttura); // Passa il nome della cartella nel campo di testo
      formData.append('id', ID)


      const token = sessionStorage.getItem('token');
      const res = await fetch(`${url}delete/${codStruttura}/${ID}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        //body: formData, //gestire id tramite login
      });
      if (res.ok) {
        const data = await res.json();
        // Accedi al campo imageUrl e stampalo
        console.log(data.imageUrl);
        setFormImmagine(data.imageUrl)
        getVisita();
        setWord("Immagine eliminata correttamente")
        setStatoAlert("success")
        setOpen(true);
      }
    } catch (error) {
      setStatoAlert("error")
      setWord("Errore durante l'eliminazione dell'immagine")
      setOpen(true);
    }


  }


  const elimina = async () => {
    try {
      deleteImg();
      const token = sessionStorage.getItem('token');
      await fetch(`${url}visita/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: ID, codStruttura: codStruttura }), //gestire id tramite login
      }).then((response) => response.json()); //gestire eccezioni
      getVisita();
      setWord("Eliminato")
      setStatoAlert("success")
      setOpen(true);
    } catch (error) {
      setStatoAlert("error")
      setWord("Errore durante l'eliminazione")
      setOpen(true);
    }

  };



  const modifica = async () => {

    try {

      //await postImg();

      const token = sessionStorage.getItem('token');
      await fetch(`${url}visita/${ID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: formNome,
          descrizione: formDescrizione,
          codStruttura: codStruttura,
          immagine: formImmagine,
          linkmappa: formLinkMappa,
          posizione: formPosizionamento,
          lingua: formLingua,
        }),
      });

      // Attendere la risposta non è più necessario quando usi l'async/await.
      getVisita();
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
    <div className=" rounded-lg bg-white overflow-x-clip hover:scale-105 transition-transform shadow-xl shadow-slate-700/100">
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
      <div className=" h-60 overflow-y-auto rounded-t-lg">
        <img className="" src={immagine} alt=""></img>
      </div>

      <div className="flex flex-col p-4">
        <h3 className=" text-indigo-700 underline font-medium">Titolo:</h3>
        <input
          className=" bg-slate-100 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
          type="text"
          name="nome"
          value={formNome}
          onChange={handleInputChangeNome}
        />
        <h3 className=" text-indigo-700 underline font-medium">Immagine:</h3>
        <input
          className="bg-slate-100 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
          type="text"
          name="nome"
          value={formImmagine}
          onChange={handleInputChangeImmagine}
          disabled={formLingua != "Italiano"}
        />
        <div className="flex flex-col py-2">
          <Button component="label"
            role={undefined}
            tabIndex={-1}
            startIcon={<CloudUploadIcon />} variant="contained" color="primary" onChange={handleFileChange}>
            Upload Immagine<VisuallyHiddenInput type="file" />
          </Button>
          

        </div>
        <h3 className=" text-indigo-700 underline font-medium">Descrizione:</h3>
        <textarea
          className="bg-slate-100 h-32 border-2 focus:outline-none focus:border-indigo-500 rounded-md"
          value={formDescrizione}
          onChange={handleInputChangeDescrizione}
        />
        <h3 className=" text-indigo-700 underline font-medium">Link Mappa:</h3>
        <input
          className="bg-slate-100 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
          type="text"
          name="nome"
          value={formLinkMappa}
          onChange={handleInputChangeLinkMappa}
          disabled={formLingua != "Italiano"}
        />

        <h3 className=" text-indigo-700 underline font-medium">
          Ordine di posizionamento:
        </h3>
        <input
          className="bg-slate-100 w-10 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
          type="number"
          name="nome"
          value={formPosizionamento}
          onChange={handleInputChangePosizionamento}
          disabled={formLingua != "Italiano"}
        />
        <h3 className=" text-indigo-700 underline font-medium">Traduzione:</h3>
        <select
          className="border-2 focus:outline-none focus:border-indigo-500 rounded-md h-6"
          id="lingua"
          value={formLingua}
          onChange={handleInputChangeLingua}
          disabled={formLingua != "Italiano"}
        >
          <option value="Italiano">Italiano</option>
          <option value="Inglese">Inglese</option>
        </select>
        <div className=" flex flex-row gap-2 justify-between items-end mt-6">
          <button
            className="transition-all duration-300 flex-auto focus:outline-none focus:ring bg-sky-900 hover:bg-sky-700 active:bg-indigo-800 text-white font-bold py-1 px-2 rounded"
            onClick={modifica}
          >
            Modifica
          </button>
          <button
            className=" transition-all duration-300 flex-auto focus:outline-none focus:ring bg-red-700 hover:bg-red-600 active:bg-rose-800 text-white font-bold py-1 px-2 rounded"
            onClick={elimina}
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  );
}

export default VisitaCard;
