import * as React from 'react';
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import it from "date-fns/locale/it"; // Importa la localizzazione italiana
import Slide from '@mui/material/Slide';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import convertiTimestampAData from '../ConvertiTimestamp';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // Importa gli stili di base
import 'react-date-range/dist/theme/default.css'; // Importa gli stili del tema
import { json } from 'react-router-dom';


registerLocale("it", it); // Registra la localizzazione italiana
setDefaultLocale("it"); // Imposta la localizzazione italiana come predefinita

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogPrenotazioneWeb(props) {
  let prodotti = props.prodotti;
  let servizi = props.servizi
  const labelButton = props.labelButton
  const codStruttura = props.codStruttura
  const Token = props.Token
  const TokenNotify = props.TokenNotify
  const riscaricaPrenotazioni = props.riscaricaPrenotazioni
  const url = props.url
  const idStripe = props.idStripe
  const [open, setOpen] = React.useState(false);
  const [formTotale, setTotale] = React.useState(0);
  const [Lingua, setLingua] = useState("Italiano")


  const [labelProdotti, setLabelProdotti] = useState('')
  const [labelOra, setLabelOra] = useState('')
  const [labelNome, setLabelNome] = useState('')
  const [labelCognome, setLabelCognome] = useState('')
  const [labelTelefono, setLabelTelefono] = useState('')
  const [labelNote, setLabelNote] = useState('')
  const [labelDate, setLabelDate] = useState('')
  const [labelQuantita, setLabelQuantita] = useState('')
  const [labelTotale, setLabelTotale] = useState('')
  const [labelAnnulla, setLabelAnnulla] = useState('')
  const [labelInvia, setLabelInvia] = useState('')
  const [labelConferma, setLabelConferma] = useState('')
  const [labelDescrizione, setLabelDescrizione] = useState('')
  const config = sessionStorage.getItem("tipoConfigurazione");

  const [openSnack, setOpenSnack] = React.useState(false);//snackbar bar update card
  const [word, setWord] = React.useState();//snackbar bar update card
  const [statoAlert, setStatoAlert] = React.useState();
  const handleCloseSnack = (event, reason) => {

    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };



  const checkDisponibilita = async (Token, codStruttura) => {

    if (Token != "") {

      // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
      const requestOptions = {
        method: "POST", // Spostato qui
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${Token}` // Mantieni l'autorizzazione qui
        },
        body: JSON.stringify({
          codStruttura: codStruttura,
          idServizio: servizi.id,
          nomeServizio: servizi.nome,
          dataIni: selectedDateIni,
          dataFin: selectedDateDataFin,
          ora: fasciaSelezionata,
          prodotto: prodottoSelezionato,
          quantita: formQuantita,
        }),
      };

      //const url = `${urlDev}ristoranti/${codStruttura}`;    
      fetch(`${url}servizi/disponibilitaPerPrenotazione`, requestOptions)
        .then((response) => response.json())
        .then(async (data) => {
          console.log("ceck disponibilità")


          if (data.disponibile === true) {
            //manda prenotazione
            if (servizi.pagamentoType == "nonPaga") {
              console.log("prenotazione senza pagare")
              postPrenotazione(Token, codStruttura, servizi.id, servizi.nome, nome, cognome, email, telefono, richieste, selectedDateIni, selectedDateDataFin, fasciaSelezionata, prodottoInvio, formTotale, formQuantita)
            }
            if (servizi.pagamentoType == "paga") {
              await salvaDatiPrenotazione(Token, codStruttura, servizi.id, servizi.nome, nome, cognome, email, telefono, richieste, selectedDateIni, selectedDateDataFin, fasciaSelezionata, prodottoInvio, formTotale, formQuantita)
              console.log("pagamento e successivamente invio prenotazione")
              makePayment(servizi.nome, servizi.immagine, prodottoPrezzo, formQuantita, formTotale)
            }
            if (servizi.pagamentoType == "acconto") {
              await salvaDatiPrenotazione(Token, codStruttura, servizi.id, servizi.nome, nome, cognome, email, telefono, richieste, selectedDateIni, selectedDateDataFin, fasciaSelezionata, prodottoInvio, formTotale, formQuantita)
              console.log("pagamento acconto e successivamente invio prenotazione")
              const accontoProdotto = ((prodottoPrezzo / 100) * servizi.percentualeAcconto)
              makePayment(`${servizi.percentualeAcconto}% ${labelTotale} ${servizi.nome}`, servizi.immagine, accontoProdotto, formQuantita, formTotale)
            }



          }
          else {
            //mostra date piene
            console.log("date piene")

            //const datePiene= data.disponibilita.filter(ele => (ele.stato=="pieno"))
            const datePiene = []

            for (let ele of data.disponibilita) {
              if (ele.stato == "pieno") {
                datePiene.push(convertiTimestampAData(ele.data))
              }
            }
            console.log(`date piene: ${datePiene.length}`)
            console.log(`date : ${datePiene}`)

            setStatoAlert("warning")
            setWord(`Date piene in: ${datePiene}`)
            setOpenSnack(true);
          }
        });
    }


  }




  const inviaNotifica = async (Token, TokenNotify) => {

    if (Token != "") {

      // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
      const requestOptions = {
        method: "POST", // Spostato qui
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${Token}` // Mantieni l'autorizzazione qui
        },
        body: JSON.stringify({
          title: 'Concierge T&T',
          body: 'Nuove attività in Web',
          image: '',
          token: TokenNotify
        }),
      };

      //const url = `${urlDev}ristoranti/${codStruttura}`;    
      fetch(`${url}sendNotification`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("invio notifiche web")
        });
    }


  }

  const makePayment = async (nome, immagine, prezzo, quantita, totale) => {
    
    const prodotto = {
      name: nome,
      image: immagine,
      price: (prezzo * nGiorniPrenotati),
      quantity: quantita,
      total: totale,
      customer_email: email,
      phone_number: telefono,
      idStripe: idStripe,
      codStruttura: codStruttura,
    }

    const body = {
      products: prodotto,

    }
    const headers = {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${Token}`
    }

    const response = await fetch(`${url}stripe/create-checkout-session`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    })

    const session = await response.json()


    if (session.url) {
      window.location.href = session.url;
    }


    if (session.error) {
      console.log(result.error)
    }

  }


  const salvaDatiPrenotazione = async (
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
    sessionStorage.setItem("Token", Token)
    sessionStorage.setItem("codStruttura", codStruttura)
    sessionStorage.setItem("idServizio", idServizio)
    sessionStorage.setItem("nomeServizio", nomeServizio)
    sessionStorage.setItem("nomePrenotante", nomePrenotante)
    sessionStorage.setItem("cognomePrenotante", cognomePrenotante)
    sessionStorage.setItem("mail", mail)
    sessionStorage.setItem("telefono", telefono)
    sessionStorage.setItem("richieste", richieste)
    sessionStorage.setItem("dataIni", dataIni)
    sessionStorage.setItem("dataFin", dataFin)
    sessionStorage.setItem("ora", JSON.stringify(fasciaSelezionata))
    sessionStorage.setItem("prodotto", JSON.stringify(prodottoInvio))
    sessionStorage.setItem("totale", totale)
    sessionStorage.setItem("quantita", quantita)
    sessionStorage.setItem("TokenNotify", TokenNotify)
    sessionStorage.setItem("url", url)
    sessionStorage.setItem("pagamentoType", servizi.pagamentoType)
    sessionStorage.setItem("urlWeb", window.location.origin)

  }



  useEffect(() => {

    const lingua = sessionStorage.getItem("lingua");
    console.log(`la lingua è: ${lingua}`)
    setLingua(lingua)

    switch (lingua) {
      case 'Italiano':
        setLabelProdotti("Prodotti Servizio")
        setLabelOra("Fasce Orarie")
        setLabelNome("Nome")
        setLabelCognome("Cognome")
        setLabelTelefono("Telefono")
        setLabelNote("Richieste/Note")
        setLabelDate("Seleziona le Date *")
        setLabelQuantita("Quantità")
        servizi.pagamentoType == "acconto" ? setLabelTotale("Acconto") : setLabelTotale("Totale")
        setLabelAnnulla("Annulla")
        setLabelInvia("Prenota")
        setLabelConferma("Riceverai una conferma della prenotazione tramite E-Mail o contatto telefonico")
        setLabelDescrizione("Invia una prenotazione compilando il form")
        break;

      case 'Inglese':
        setLabelProdotti("Service Products")
        setLabelOra("Time Slots")
        setLabelNome("First Name")
        setLabelCognome("Last Name")
        setLabelTelefono("Phone Number")
        setLabelNote("Requests/Notes")
        setLabelDate("Select Dates *")
        setLabelQuantita("Quantity")
        servizi.pagamentoType == "acconto" ? setLabelTotale("Advance Payment") : setLabelTotale("Total")
        setLabelAnnulla("Cancel")
        setLabelInvia("Book")
        setLabelConferma("You will receive a booking confirmation by E-Mail or phone contact")
        setLabelDescrizione("Submit a booking by filling out the form")
        break;

      default:
        setLabelProdotti("Service Products")
        setLabelOra("Time Slots")
        setLabelNome("First Name")
        setLabelCognome("Last Name")
        setLabelTelefono("Phone Number")
        setLabelNote("Requests/Notes")
        setLabelDate("Select Dates *")
        setLabelQuantita("Quantity")
        setLabelTotale("Total")
        setLabelAnnulla("Cancel")
        setLabelInvia("Book")
        setLabelConferma("You will receive a booking confirmation by E-Mail or phone contact")
        setLabelDescrizione("Submit a booking by filling out the form")
        break;

    }


  

    const nElementi = servizi.prodotti.length
    const prodServizio = []
    for (let i = 0; i < nElementi; i++) {
      let prodotto = []
      switch (config) {//gestisco varie configurazioni interfacciamenti

        case "Suite":
          prodotto = prodotti.filter(ele => (ele.IdProdotto == servizi.prodotti[i].value))
          break;

        case "Standard":
          prodotto = prodotti.filter(ele => (ele.id == servizi.prodotti[i].value))
          break;

        default:
          break;
      }


      prodServizio.push(prodotto)
    }

    setProdottiSer(prodServizio)



  }, [])

  const [prodottiSer, setProdottiSer] = React.useState([]);
  const handleChangeProdottiSer = (event) => {
    setProdottiSer(event.target.value);

  };


  // Funzione per estrarre le fasce orarie di un prodotto dato il suo ID
  const extractFasceOrarieByIdProdotto = (array, idProdotto) => {
    const prodotto = array.find(item => item.idProdotto == idProdotto);
    return prodotto ? prodotto.fasceOrarie : [];
  };


  const [prodottoPrezzo, setProdottoPrezzo] = React.useState(0)
  const [prodottoSelezionato, setProdottoSelezionato] = React.useState('');
  const [prodottoInvio, setProdottoInvio] = React.useState('');
  const handleChangeProdottoSelezionato = (event) => {
    setProdottoSelezionato(event.target.value);

    let datiProdotto = []
    let pr = []
    switch (config) {//gestisco varie configurazioni interfacciamenti

      case "Suite":
        datiProdotto = prodotti.filter(ele => (ele.IdProdotto == event.target.value))
        pr = { label: datiProdotto[0].Descrizione, value: event.target.value }
        setProdottoInvio(pr)
        setProdottoPrezzo(datiProdotto[0].PrezzoListino)
        break;

      case "Standard":
        datiProdotto = prodotti.filter(ele => (ele.id == event.target.value))
        pr = { label: datiProdotto[0].descrizione, value: event.target.value, ivaValue: datiProdotto[0].iva.value, ivaLabel: datiProdotto[0].iva.label }
        setProdottoInvio(pr)
        setProdottoPrezzo(datiProdotto[0].prezzo)
        break;

      default:
        break;
    }





    //const serCercato = servizi.filter(ele => (ele.id == servizi.id))
    //console.log(serCercato[0])

    // Estrai le fasce orarie per il prodotto desiderato
    const fasceOrarieProdottoDesiderato = extractFasceOrarieByIdProdotto(servizi.prodottiFasce, event.target.value);

    setFasceOrarieProdottoDesiderato(fasceOrarieProdottoDesiderato)

  };
  const [formFasceOrarieProdottoDesiderato, setFasceOrarieProdottoDesiderato] = useState([])
  const [fasciaSelezionata, setFasciaSelezionata] = React.useState('');
  const handleChangeFasciaSelezionata = (event) => {
    setFasciaSelezionata(event.target.value);



  };

  const [nGiorniPrenotati, setNGiorniPrenotati] = useState(1);

  const [selectedDateIni, setSelectedDateIni] = useState(null);
  const handleDateChangeIni = (date) => {
    const timestamp = date ? date.getTime() : null;
    setSelectedDateIni(timestamp);

  };

  const [selectedDateDataFin, setSelectedDateDataFin] = useState(null);
  const handleDateChangeDataFin = (date) => {
    const timestamp = date ? date.getTime() : null;
    setSelectedDateDataFin(timestamp);

  };

  //PROVA DATE RANGE
  const [state, setState] = React.useState([
    {
      startDate: new Date(), // Data iniziale selezionata
      endDate: addDays(new Date(), 0), // Data finale selezionata
      key: 'selection',
    },
  ]);

  const handleSelect = (ranges) => {
    setState([ranges.selection]);
  
    const timestamp = ranges.selection.startDate ? ranges.selection.startDate.getTime() : null;

    setSelectedDateIni(timestamp);


    const timestampFine = ranges.selection.endDate ? ranges.selection.endDate.getTime() : null;
    setSelectedDateDataFin(timestampFine);
    // Qui puoi gestire le date selezionate, ad esempio inviandole al backend o aggiornando il form
  };


  const [nome, setNome] = useState("")
  const handleInputChangeNome = (e) => {
    const { name, value } = e.target;
    setNome(value);
  };

  const [cognome, setCognome] = useState("")
  const handleInputChangeCognome = (e) => {
    const { name, value } = e.target;
    setCognome(value);

  };

  const [email, setEmail] = useState("")
  const handleInputChangeEmail = (e) => {
    const { name, value } = e.target;
    setEmail(value);
    
  };

  const [telefono, setTelefono] = useState("")
  const handleInputChangeTelefono = (e) => {
    const { name, value } = e.target;
    setTelefono(value);
   
  };

  const [richieste, setRichieste] = useState("")
  const handleInputChangeRichieste = (e) => {
    const { name, value } = e.target;
    setRichieste(value);
   
  };

  const [formQuantita, setFormQuantita] = useState('1');
  const handleInputChangeQuantita = (e) => {
    const { name, value } = e.target;
    const val = parseInt(value, 10)
    if (val < 1) { setFormQuantita(1) }
    if (val > servizi.qMaxPrenotabile) {
      setFormQuantita(servizi.qMaxPrenotabile);
    } else if (val > 0) {
      setFormQuantita(val);
    }


  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    

    setNome('')
    setCognome('')
    //setTelefono('')
    //setEmail('')
    setRichieste('')
    setSelectedDateIni('')
    setSelectedDateDataFin('')
    setFormQuantita('')
    setTotale('')
    setProdottoSelezionato('')
    setProdottoInvio('')
    setFasciaSelezionata('')

    setOpen(false);
  };




  useEffect(() => {
   
    try {

      if (prodottoSelezionato != '' && selectedDateIni != null && selectedDateDataFin != null) {
        // Converti i timestamp in Date
        const date1 = new Date(selectedDateIni);
        const date2 = new Date(selectedDateDataFin);


        // Calcola la differenza in millisecondi
        const diffInMs = Math.abs(date2 - date1);

        if (selectedDateIni > selectedDateDataFin) {
          //non fare nulla e metti un alert
         
        }
        if (selectedDateIni == selectedDateDataFin) {
          //caso date uguali quindi metto days=1 e non faccio conto giorni
          
          const days = 1
          let prodotto = []
          let prezzo = 0
          switch (config) {//gestisco varie configurazioni interfacciamenti

            case "Suite":
              prodotto = prodottiSer.flat().filter(ele => (ele.IdProdotto == prodottoSelezionato))
              prezzo = parseFloat(prodotto[0].PrezzoListino)
              break;

            case "Standard":
              prodotto = prodottiSer.flat().filter(ele => (ele.id == prodottoSelezionato))
              prezzo = parseFloat(prodotto[0].prezzo)
              break;

            default:
              break;
          }



         
          const totale = ((prezzo * parseInt(formQuantita)) * days)
          
          if (servizi.pagamentoType == "acconto") {
            const percentuale = servizi.percentualeAcconto
            
            const acconto = ((totale / 100) * percentuale).toFixed(2)
            setTotale(acconto)
            setNGiorniPrenotati(days)
          } else if (servizi.pagamentoType == "paga" || servizi.pagamentoType == "nonPaga") {
            setTotale(totale)
            setNGiorniPrenotati(days)
          }
        }
        if (selectedDateIni < selectedDateDataFin) {
          //caso normale
          
          // Converti i millisecondi in giorni
          const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24) + 1);

          let prodotto=[]
          let prezzo=0
          switch (config) {//gestisco varie configurazioni interfacciamenti

            case "Suite":
              prodotto = prodottiSer.flat().filter(ele => (ele.IdProdotto == prodottoSelezionato))
              prezzo = parseFloat(prodotto[0].PrezzoListino)
              break;

            case "Standard":
              prodotto = prodottiSer.flat().filter(ele => (ele.id == prodottoSelezionato))
              prezzo = parseFloat(prodotto[0].prezzo)
              break;

            default:
              break;
          }



          //console.log(`Giorni passati:${days} prezzo:${prezzo} quantità:${formQuantita}`)
          const totale = prezzo * parseInt(formQuantita) * days
          //console.log(`il totale è: ${totale}`)
          if (servizi.pagamentoType == "acconto") {
            const percentuale = servizi.percentualeAcconto
          
            const acconto = ((totale / 100) * percentuale).toFixed(2)
            setTotale(acconto)
            setNGiorniPrenotati(days)
          } else if (servizi.pagamentoType == "paga" || servizi.pagamentoType == "nonPaga") {
            setTotale(totale)
            setNGiorniPrenotati(days)
          }

          //const totale=prodottoSelezionato.PrezzoListino*days*
        }



      }


    }
    catch (error) {
      console.log(`errore: ${error}`)
    }


  }, [prodottoSelezionato, formQuantita, selectedDateIni, selectedDateDataFin]); //con questa dipendenza aggiorna ogni volta che cambiano i valori, se levo dipendenze si agiorna ad ogni cambiamento



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
          dataIni: dataIni,
          dataFin: dataFin,
          ora: ora,
          prodotto: prodotto,
          totale: totale,
          quantita: quantita,
          stato: "attesa",
          IdSchedaConto: "",
          IdSchedaContoRetta: "",
          messaggio: "",
        }), //gestire id tramite login
      }).then((response) => response.json()); //gestire eccezioni
 
      setNome('')
      setCognome('')
      setRichieste('')
      setSelectedDateIni('')
      setSelectedDateDataFin('')
      setFormQuantita(1)
      setTotale('')
      setProdottoSelezionato('')
      setFasciaSelezionata('')

      inviaNotifica(Token, TokenNotify)
      setStatoAlert("success")
      setWord(`Prenotazione inviata`)
      setOpenSnack(true);

    } catch (error) {
      setStatoAlert("error")
      setWord("Errore durante l'invio")
      setOpenSnack(true);
    }
    handleClose();
  };



  return (
    <React.Fragment>
      <Button className=' w-full bg-sky-900 text-white font-semibold' variant="outlined" onClick={handleClickOpen}>
        {labelButton}
      </Button>

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
      <Dialog
        disableEnforceFocus // Disabilita il focus automatico per evitare scroll
        TransitionComponent={Transition}
        scroll='paper'
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
          
            if (selectedDateIni == null || selectedDateDataFin == null) {
              setStatoAlert("error")
              setWord("Seleziona una data")
              setOpenSnack(true);
            } else {
              //makePayment()
              checkDisponibilita(Token, codStruttura)
       
            }
            //postPrenotazione(servizio, serCercato[0].nome, nome, cognome, "esterno", richieste, selectedDateIni, selectedDateDataFin, fasciaSelezionata, prodottoSelezionato, formTotale, formQuantita, "attesa")
            //riscaricaPrenotazioni()

          },
        }}
      >
        <DialogTitle>{servizi.nome}</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ marginBottom: '18px', marginTop: '18px' }}
          >
            {labelDescrizione}
          </DialogContentText>



          <FormControl sx={{ m: 1, minWidth: 160 }}>
            <InputLabel id="demo-simple-select-autowidth-label2">{labelProdotti}</InputLabel>
            <Select
              autoFocus={true}
              variant='standard'
              labelId="demo-simple-select-autowidth-label2"
              id="demo-simple-select-autowidth2"
              value={prodottoSelezionato}
              onChange={handleChangeProdottoSelezionato}
              autoWidth
              label="Age2"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {
                config == "Suite" ?
                  prodottiSer.flat().map((pr, index) => (
                    <MenuItem key={index} value={pr.IdProdotto}>
                      {pr.Descrizione + ' ' + pr.PrezzoListino + '€'}
                    </MenuItem>
                  )) :

                  config == "Standard" && Lingua=="Italiano" ?
                    prodottiSer.flat().map((pr, index) => (
                      <MenuItem key={index} value={pr.id}>
                        {pr.descrizione + ' ' + pr.prezzo + '€'}
                      </MenuItem>
                    )) : config == "Standard" && Lingua=="Inglese" ?
                    prodottiSer.flat().map((pr, index) => (
                      <MenuItem key={index} value={pr.id}>
                        {pr.descrizioneEn + ' ' + pr.prezzo + '€'}
                      </MenuItem>
                    )) : null


              }

            </Select>
          </FormControl>
          <br />

          <FormControl sx={{ m: 1, minWidth: 160 }}>
            <InputLabel id="demo-simple-select-autowidth-label2">{labelOra}</InputLabel>
            <Select
              variant='standard'
              labelId="demo-simple-select-autowidth-label2"
              id="demo-simple-select-autowidth2"
              value={fasciaSelezionata}
              onChange={handleChangeFasciaSelezionata}
              autoWidth
              label="Age2"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {formFasceOrarieProdottoDesiderato.flat().map((pr, index) => (
                <MenuItem key={index} value={pr}>
                  {pr.label}
                </MenuItem>
              ))}

            </Select>
          </FormControl>



          <TextField
            onChange={handleInputChangeNome}
            autoFocus
            required
            margin="dense"
            label={labelNome}
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            onChange={handleInputChangeCognome}
            autoFocus
            required
            margin="dense"
            label={labelCognome}
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            onChange={handleInputChangeEmail}
            autoFocus
            required
            margin="dense"
            label="E-Mail"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            onChange={handleInputChangeTelefono}
            autoFocus
            required
            margin="dense"
            label={labelTelefono}
            type="tel"
            fullWidth
            variant="standard"
          />
          <TextField
            onChange={handleInputChangeRichieste}
            autoFocus
            margin="dense"
            label={labelNote}
            multiline={true}
            type="text"
            fullWidth
            variant="standard"
            sx={{ marginBottom: '32px' }} // Aggiungi margine inferiore
          />

          <DialogContentText>
            {labelDate}
          </DialogContentText>

          <div>
            <DateRange
              required
              ranges={state}
              onChange={handleSelect}
              minDate={new Date(servizi.dataIni)} // Imposta la data minima selezionabile
              maxDate={addDays(new Date(servizi.dataFin), 0)} // Imposta la data massima selezionabile
              editableDateInputs={true} // Permette di editare direttamente le date nei campi
            />

          </div>

          {/*
          <div className="flex flex-row">
            <label className=" pr-2 text-lg font-medium ">Da: </label>
            <DatePicker
              required
              className="border-2 p-1 rounded focus:outline-none focus:border-blue-500  w-1 z-auto"
              selected={selectedDateIni}
              onChange={handleDateChangeIni}
              maxDate={selectedDateDataFin}
              placeholderText="Seleziona una data"
              dateFormat="dd/MM/yyyy"

            />
          </div>

          <div className="flex flex-row pt-1">
            <label className=" pr-5 text-lg font-medium ">a: </label>
            <DatePicker
              required
              selected={selectedDateDataFin}
              onChange={handleDateChangeDataFin}
              minDate={selectedDateIni}
              placeholderText="Seleziona una data"
              dateFormat="dd/MM/yyyy"
              className="border-2 p-1 rounded focus:outline-none focus:border-blue-500 w-40"
            />
          </div>
          */}

          <TextField
            onChange={handleInputChangeQuantita}
            autoFocus
            margin="dense"
            min={1}
            max={servizi.qMaxPrenotabile}
            value={formQuantita}
            label={labelQuantita}
            type="number"
            variant="standard"
          />
          <p></p>


          <TextField
            focused={false}
            autoFocus={false}
            margin="dense"
            value={formTotale + '€'}
            label={labelTotale}
            type="text"
            variant="standard"
          />

          <DialogContentText
            color={'primary'}
            sx={{ marginBottom: '32px', marginTop: '32px' }}
          >
            {labelConferma}
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{labelAnnulla}</Button>
          <Button type="submit">{labelInvia}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}