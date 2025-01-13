import React, { useState, useEffect , useRef} from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { ContentPasteGo } from "@mui/icons-material";
import convertiTimestampAData from "../../components/ConvertiTimestamp";

export default function Success() {

  const Token = sessionStorage.getItem("Token")
  const codStruttura = sessionStorage.getItem("codStruttura")
  const idServizio = sessionStorage.getItem("idServizio")
  const nomeServizio = sessionStorage.getItem("nomeServizio")
  const nomePrenotante = sessionStorage.getItem("nomePrenotante")
  const cognomePrenotante = sessionStorage.getItem("cognomePrenotante")
  const mail = sessionStorage.getItem("mail")
  const telefono = sessionStorage.getItem("telefono")
  const richieste = sessionStorage.getItem("richieste")
  const dataIni = sessionStorage.getItem("dataIni")
  const dataFin = sessionStorage.getItem("dataFin")
  var ora = JSON.parse(sessionStorage.getItem("ora"))
  var prodotto = JSON.parse(sessionStorage.getItem("prodotto"))
  const totale = sessionStorage.getItem("totale")
  const quantita = sessionStorage.getItem("quantita")
  const TokenNotify = [sessionStorage.getItem("TokenNotify")]
  const url = sessionStorage.getItem("url")
  const urlWeb = sessionStorage.getItem("urlWeb")
  const lingua = sessionStorage.getItem("lingua");
  const pagamentoType = sessionStorage.getItem("pagamentoType")

  const inviato = useRef(false)

  const [openSnack, setOpenSnack] = React.useState(false);//snackbar bar update card
  const [word, setWord] = React.useState();//snackbar bar update card
  const [statoAlert, setStatoAlert] = React.useState();
  const handleCloseSnack = (event, reason) => {

    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };


  const postPrenotazione = async (
    Token,
    codStruttura,
    idServizio,
    nomeServizio,
    nomePrenotante,
    cognomePrenotante,
    mail,
    telefono,
    richieste,
    dataIni,
    dataFin,
    ora,
    prodotto,
    totale,
    quantita,

  ) => {
    try {

      if (inviato.current == true) {
        return
      } else {


        console.log("invio prenotazione")
        console.log(Token)

        await fetch(`${url}servizi/insertPrenotazioneServizio`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${Token}`,
          },
          body: JSON.stringify({
            codStruttura: codStruttura,
            idServizio: idServizio,
            nomeServizio: nomeServizio,
            nomePrenotante: nomePrenotante,
            cognomePrenotante: cognomePrenotante,
            mail: mail,
            telefono: telefono,
            codPrenotazione: "esterno",
            camera: "esterno Web",
            richieste: richieste,
            dataIni: parseInt(dataIni),
            dataFin: parseInt(dataFin),
            ora: ora,
            prodotto: prodotto,
            totale: Number(totale),
            quantita: quantita,
            stato: pagamentoType + " Stripe",
            IdSchedaConto: "",
            IdSchedaContoRetta: "",
            messaggio: "",
          }), //gestire id tramite login
        }).then((response) => response.json()); //gestire eccezioni
        console.log('pulisco campi')


        await inviaNotifica(Token, TokenNotify)
        inviato.current=true
        setStatoAlert("success")
        setWord(`Prenotazione inviata`)
        setOpenSnack(true);

        sessionStorage.setItem("Token", '')
        //sessionStorage.setItem("codStruttura", '')
        sessionStorage.setItem("idServizio", '')
        sessionStorage.setItem("nomeServizio", '')
        //sessionStorage.setItem("nomePrenotante", '')
        sessionStorage.setItem("cognomePrenotante", '')
        sessionStorage.setItem("mail", '')
        //sessionStorage.setItem("telefono", '')
        //sessionStorage.setItem("richieste", '')
        //sessionStorage.setItem("dataIni", '')
        //sessionStorage.setItem("dataFin", '')
        //sessionStorage.setItem("ora", '')
        //sessionStorage.setItem("prodotto", '')
        //sessionStorage.setItem("totale", '')
        sessionStorage.setItem("quantita", '')
        sessionStorage.setItem("TokenNotify", '')
        sessionStorage.setItem("url",'')

      }
    } catch (error) {
      setStatoAlert("error")
      setWord("Errore durante l'invio")
      console.log(`errore: ${error}`)
      setOpenSnack(true);
    }

  };

  const inviaNotifica = async (Token, TokenNotify) => {

    if (Token != "") {

      // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${Token}`
        },
        body: JSON.stringify({
          title: 'Concierge T&T',
          body: 'pagamento Stripe ricevuto',
          image: '',
          token: TokenNotify
        }),
      };

      //const url = `${urlDev}ristoranti/${codStruttura}`;    
      fetch(`${url}sendNotification`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("invio notifiche web")

          console.log(data);
        });
    }


  }


  useEffect(() => {

    if (inviato.current == false) {
      //invia prenotazione e notifica
      postPrenotazione(Token, codStruttura, idServizio, nomeServizio, nomePrenotante, cognomePrenotante, mail, telefono, richieste, dataIni, dataFin, ora, prodotto, totale, quantita)
    }
    inviato.current=true
  }, [])

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Snackbar
        open={openSnack}
        autoHideDuration={4000}
        onClose={handleCloseSnack}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={statoAlert}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {word}
        </Alert>
      </Snackbar>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
        <h1 className="text-2xl font-semibold text-green-600">Pagamento e Prenotazione Confermati!</h1>
        <p className="mt-4 text-lg text-gray-700">Grazie, <span className="font-bold">{nomePrenotante}</span>!</p>
        <p className="mt-2 text-gray-600">
          La tua prenotazione è stata confermata.
        </p>
        <div className="mt-4 p-4 bg-green-50 rounded-lg text-green-800">
          <p className="font-semibold">Dettagli di pagamento:</p>
          <p className="mt-1">Importo: <span className="font-bold">€{totale}</span></p>
          <p>Date prenotate: <span className="font-bold">{convertiTimestampAData(dataIni)} - {convertiTimestampAData(dataFin)}</span></p>
        </div>
        <div className="mt-6">
          <button
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
            onClick={() => window.location.href = `${urlWeb}/PrenotazioneWeb/${codStruttura}`}
          >
            Torna alla lista servizi
          </button>
        </div>
      </div>
    </div>



  );
}