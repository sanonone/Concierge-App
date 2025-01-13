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
import { Menu } from '@mui/icons-material';
import convertiTimestampAData from './ConvertiTimestamp';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNotification } from '../context/NotificationContext.jsx'


registerLocale("it", it); // Registra la localizzazione italiana
setDefaultLocale("it"); // Imposta la localizzazione italiana come predefinita

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FormDialog(props) {
  let prodottiServizi = props.prodottiServizi;
  let servizi = props.servizi
  const riscaricaPrenotazioni = props.riscaricaPrenotazioni
  const url = props.url
  const [open, setOpen] = React.useState(false);
  const [formTotale, setTotale] = React.useState(0);
  const [disponibile, setDisponibile] = React.useState(false);
  const { noMostraBadge, fetchDynamicItems } = useNotification();
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


  const [datiServizio, setDatiServizio] = React.useState('');
  const [servizio, setServizio] = React.useState('');
  const handleChangeServizio = (event) => {
    setServizio(event.target.value);
    console.log("evento selezionato: " + event.target.value)

    const prodFasce = servizi.filter(ele => (ele.id == event.target.value))
    console.log(prodFasce[0])
    setDatiServizio(prodFasce[0])
    console.log(`data ini e fin sono: ${prodFasce[0].dataIni} e ${prodFasce[0].dataFin}`)
    const nElementi = prodFasce[0].prodotti.length
    //console.log(prodFasce[0].prodotti.length)
    const prodServizio = []
    for (let i = 0; i < nElementi; i++) {
      let prodotto = []
      switch (config) {//gestisco varie configurazioni interfacciamenti

        case "Suite":
          prodotto = prodottiServizi.filter(ele => (ele.IdProdotto == prodFasce[0].prodotti[i].value))
          break;

        case "Standard":
          prodotto = prodottiServizi.filter(ele => (ele.id == prodFasce[0].prodotti[i].value))
          break;

        default:
          break;
      }


      console.log(prodotto)
      prodServizio.push(prodotto)
    }
    console.log(prodServizio)
    setProdottiSer(prodServizio)
  };

  const [prodottiSer, setProdottiSer] = React.useState([]);
  const handleChangeProdottiSer = (event) => {
    setProdottiSer(event.target.value);
    console.log(event.target.value)
  };


  // Funzione per estrarre le fasce orarie di un prodotto dato il suo ID
  const extractFasceOrarieByIdProdotto = (array, idProdotto) => {
    const prodotto = array.find(item => item.idProdotto == idProdotto);
    return prodotto ? prodotto.fasceOrarie : [];
  };


  const [prodottoSelezionato, setProdottoSelezionato] = React.useState('');
  const [prodottoInvio, setProdottoInvio] = React.useState('');
  const handleChangeProdottoSelezionato = (event) => {
    event.preventDefault()
    setProdottoSelezionato(event.target.value);
    console.log(`prodotto selezionato: ${event.target.value}`)
    let datiProdotto = []
    let pr = []
    switch (config) {//gestisco varie configurazioni interfacciamenti

      case "Suite":
        datiProdotto = prodottiServizi.filter(ele => (ele.IdProdotto == event.target.value))
        pr = { label: datiProdotto[0].Descrizione, value: event.target.value }
        setProdottoInvio(pr)
        break;

      case "Standard":
        datiProdotto = prodottiServizi.filter(ele => (ele.id == event.target.value))
        pr = { label: datiProdotto[0].descrizione, value: event.target.value, ivaValue: datiProdotto[0].iva.value, ivaLabel: datiProdotto[0].iva.label }
        setProdottoInvio(pr)
        break;

      default:
        break;
    }

    const serCercato = servizi.filter(ele => (ele.id == servizio))
    console.log(serCercato[0])

    // Estrai le fasce orarie per il prodotto desiderato
    const fasceOrarieProdottoDesiderato = extractFasceOrarieByIdProdotto(serCercato[0].prodottiFasce, event.target.value);
    console.log(fasceOrarieProdottoDesiderato);
    setFasceOrarieProdottoDesiderato(fasceOrarieProdottoDesiderato)

  };


  const [formFasceOrarieProdottoDesiderato, setFasceOrarieProdottoDesiderato] = useState([])
  const [fasciaSelezionata, setFasciaSelezionata] = React.useState('');
  const handleChangeFasciaSelezionata = (event) => {
    setFasciaSelezionata(event.target.value);
    console.log(event.target.value)


  };

  const [selectedDateIni, setSelectedDateIni] = useState(null);
  const handleDateChangeIni = (date) => {
    const timestamp = date ? date.getTime() : null;
    setSelectedDateIni(timestamp);
    console.log(timestamp);
  };

  const [selectedDateDataFin, setSelectedDateDataFin] = useState(null);
  const handleDateChangeDataFin = (date) => {
    const timestamp = date ? date.getTime() : null;
    setSelectedDateDataFin(timestamp);
    console.log(timestamp);
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
    console.log(value);
  };

  const [email, setEmail] = useState("")
  const handleInputChangeEmail = (e) => {
    const { name, value } = e.target;
    setEmail(value);
    console.log(value);
  };

  const [telefono, setTelefono] = useState("")
  const handleInputChangeTelefono = (e) => {
    const { name, value } = e.target;
    setTelefono(value);
    console.log(value);
  };


  const [richieste, setRichieste] = useState("")
  const handleInputChangeRichieste = (e) => {
    const { name, value } = e.target;
    setRichieste(value);
    console.log(value);
  };

  const [formQuantita, setFormQuantita] = useState('1');
  const handleInputChangeQuantita = (e) => {
    const { name, value } = e.target;
    const val = parseInt(value, 10)
    setFormQuantita(val);

  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    console.log('pulisco campi')
    setNome('')
    setCognome('')
    setRichieste('')
    setSelectedDateIni('')
    setSelectedDateDataFin('')
    setFormQuantita(1)
    setTotale('')
    setServizio('')
    setProdottoSelezionato('')
    setFasciaSelezionata('')
    setOpen(false);
  };

  useEffect(() => {
    console.log("aggiorno");


    try {

      if (prodottoSelezionato != '' && selectedDateIni != null && selectedDateDataFin != null) {
        // Converti i timestamp in Date
        const date1 = new Date(selectedDateIni);
        const date2 = new Date(selectedDateDataFin);


        // Calcola la differenza in millisecondi
        const diffInMs = Math.abs(date2 - date1);

        if (selectedDateIni > selectedDateDataFin) {
          //non fare nulla 

        }
        if (selectedDateIni == selectedDateDataFin) {
          //caso date uguali quindi metto days=1 e non faccio conto giorni
          console.log("uguali")
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


          //console.log(`Giorni passati:${days} prezzo:${prezzo} quantità:${formQuantita}`)
          const totale = prezzo * parseInt(formQuantita) * days
          console.log(`il totale è: ${totale}`)
          setTotale(totale)
        }
        if (selectedDateIni < selectedDateDataFin) {
          //caso normale
          console.log("normale")
          // Converti i millisecondi in giorni
          const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24) + 1);

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
          //console.log(`Giorni passati:${days} prezzo:${prezzo} quantità:${formQuantita}`)
          const totale = prezzo * parseInt(formQuantita) * days
          //console.log(`il totale è: ${totale}`)
          setTotale(totale)
          //const totale=prodottoSelezionato.PrezzoListino*days*
        }

        checkDisponibilita()



      }


    }
    catch (error) {
      console.log(`errore: ${error}`)
    }


  }, [prodottoSelezionato, formQuantita, selectedDateIni, selectedDateDataFin]); //con questa dipendenza aggiorna ogni volta che cambiano i valori, se levo dipendenze si agiorna ad ogni cambiamento



  const checkDisponibilita = async () => {


    if (prodottoSelezionato != '' && fasciaSelezionata != '' && selectedDateIni != null && selectedDateDataFin != null) {
      const serCercato = servizi.filter(ele => (ele.id == servizio))

      const token = sessionStorage.getItem('token');
      const codStruttura = sessionStorage.getItem('codStruttura');
      // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
      const requestOptions = {
        method: "POST", // Spostato qui
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}` // Mantieni l'autorizzazione qui
        },
        body: JSON.stringify({
          codStruttura: codStruttura,
          idServizio: servizio,
          nomeServizio: serCercato[0].nome,
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
        .then((data) => {
          console.log("fatto ceck disponibilità")

          console.log(data);

          if (data.disponibile === true) {
            //manda prenotazione
            console.log("mando prenotazione")
            setDisponibile(true)
            setStatoAlert("success")
            setWord(`Date disponibili`)
            setOpenSnack(true);
            //postPrenotazione(Token, codStruttura, servizi.id, servizi.nome, nome, cognome, email, telefono, richieste, selectedDateIni, selectedDateDataFin, fasciaSelezionata, prodottoInvio, formTotale, formQuantita)

          }
          else {
            //mostra date piene
            console.log("date piene")
            setDisponibile(false)

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



  const postPrenotazione = async (
    idServizio,
    nomeServizio,
    nomePrenotante,
    cognomePrenotante,
    mail,
    telefono,
    camera,
    richieste,
    dataIni,
    dataFin,
    ora,
    prodotto,
    totale,
    quantita,
    stato
  ) => {
    try {

      const token = sessionStorage.getItem('token');
      const codStruttura = sessionStorage.getItem('codStruttura');
      await fetch(`${url}servizi/insertPrenotazioneServizio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
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
          camera: camera,
          richieste: richieste,
          dataIni: dataIni,
          dataFin: dataFin,
          ora: ora,
          prodotto: prodotto,
          totale: totale,
          quantita: quantita,
          stato: stato,
        }), //gestire id tramite login
      }).then((response) => response.json()); //gestire eccezioni
      console.log('pulisco campi')
      setNome('')
      setCognome('')
      setRichieste('')
      setSelectedDateIni('')
      setSelectedDateDataFin('')
      setFormQuantita(1)
      setTotale('')
      setServizio('')
      setProdottoSelezionato('')
      setProdottoInvio('')
      setFasciaSelezionata('')

      //setStatoAlert("success")
      //setWord("Creato con successo")
      //setOpen(true);
    } catch (error) {
      //setStatoAlert("error")
      //setWord("Errore durante la creazione")
      //setOpen(true);
    }
  };



  return (
    <React.Fragment>
      <Button className=' w-full bg-sky-900 text-white font-semibold' variant="outlined" onClick={handleClickOpen}>
        Aggiungi prenotazione
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

        TransitionComponent={Transition}
        scroll='paper'
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: async (event) => {
            event.preventDefault();
            console.log('invio')
            console.log(formQuantita)
            const serCercato = servizi.filter(ele => (ele.id == servizio))
            console.log(serCercato[0].nome)
            console.log(fasciaSelezionata)
            await checkDisponibilita()
            if (disponibile == true) {
              await postPrenotazione(servizio, serCercato[0].nome, nome, cognome, email, telefono, "esterno", richieste, selectedDateIni, selectedDateDataFin, fasciaSelezionata, prodottoInvio, formTotale, formQuantita, "attesa")
              await fetchDynamicItems()
              await noMostraBadge()
              handleClose();
            }

          },
        }}
      >
        <DialogTitle>Nuova prenotazione</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Inserisci una prenotazione compilando il form
          </DialogContentText>

          <FormControl sx={{ m: 1, minWidth: 90 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Servizio</InputLabel>
            <Select
              autoFocus={true}
              variant='standard'
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={servizio}
              onChange={handleChangeServizio}
              autoWidth
              label="Age"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {servizi.map((ser, index) => (
                <MenuItem key={index} value={ser.id}>{ser.nome}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 90 }}>
            <InputLabel id="demo-simple-select-autowidth-label2">Prodotti Servizio</InputLabel>
            <Select
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
                  config == "Standard" ?
                    prodottiSer.flat().map((pr, index) => (
                      <MenuItem key={index} value={pr.id}>
                        {pr.descrizione + ' ' + pr.prezzo + '€'}
                      </MenuItem>
                    )) : null
              }

            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 90 }}>
            <InputLabel id="demo-simple-select-autowidth-label2">Fasce Orarie</InputLabel>
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
            label="Nome"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            onChange={handleInputChangeCognome}
            autoFocus
            required
            margin="dense"
            label="Cognome"
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
            label="Telefono"
            type="tel"
            fullWidth
            variant="standard"
          />
          <TextField
            onChange={handleInputChangeRichieste}
            autoFocus
            margin="dense"
            label="Richieste/Note"
            multiline={true}
            type="text"
            fullWidth
            variant="standard"
          />

          <div className="flex flex-row">
            <label className=" pr-2 text-lg font-medium ">Da: </label>
            <DatePicker
              required
              className="border-2 p-1 rounded focus:outline-none focus:border-blue-500  w-1 z-auto"
              selected={selectedDateIni}
              onChange={handleDateChangeIni}
              minDate={parseInt(datiServizio.dataIni)}
              maxDate={parseInt(datiServizio.dataFin)}
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
              maxDate={parseInt(datiServizio.dataFin)}
              placeholderText="Seleziona una data"
              dateFormat="dd/MM/yyyy"
              className="border-2 p-1 rounded focus:outline-none focus:border-blue-500 w-40"
            />
          </div>
          <TextField
            onChange={handleInputChangeQuantita}
            autoFocus
            margin="dense"
            value={formQuantita}
            label="Quantità"
            type="number"
            variant="standard"
          />
          <p></p>
          <TextField
            focused={false}
            autoFocus
            margin="dense"
            value={formTotale + '€'}
            label="Totale"
            type="text"
            variant="standard"
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annulla</Button>
          <Button type="submit">Inserisci</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}