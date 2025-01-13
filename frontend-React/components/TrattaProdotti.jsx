import * as React from 'react';
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import it from "date-fns/locale/it"; // Importa la localizzazione italiana
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import ConvertiTimestampOra from './ConvertiOraTimestamp';
import { useNotification } from '../context/NotificationContext.jsx'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Menu } from '@mui/icons-material';
import Switch from '@mui/material/Switch';


registerLocale("it", it); // Registra la localizzazione italiana
setDefaultLocale("it"); // Imposta la localizzazione italiana come predefinita

export default function FormDialog(props) {
  /*
     let prodottiServizi = props.prodottiServizi;
   let servizi = props.servizi
   const riscaricaPrenotazioni= props.riscaricaPrenotazioni
   const url = props.url
   */
  const url = props.url
  let prenotazione = props.prenotazione
  const getPrenotazioni = props.getPrenotazioni
  const { noMostraBadge, vediBadge, fetchDynamicItems } = useNotification();
  const [open, setOpen] = React.useState(false);
  const [formTotale, setTotale] = React.useState(0);
  const [mobileUserTokenNotify, setMobileUserTokenNotify] = useState("")

  const [isDisabledButtons, setIsDisabledButtons] = useState(false);//stato button conferma e rifiuta
  const [isDisabledButtonsConferma, setIsDisabledButtonsConferma] = useState(false);//stato visibilità button conferma su ordini guest


  const [openAlert, setOpenAlert] = React.useState(false);//snackbar bar update card
  const [word, setWord] = React.useState();//snackbar bar update card
  const [statoAlert, setStatoAlert] = React.useState();

  const [messaggio, setMessaggio] = useState("Stato ordini aggiornato")
  const handleInputChangeMessaggio = (e) => {
    const { name, value } = e.target;
    setMessaggio(value);
    console.log(value);
  };

  const [statoPagato, setStatoPagato] = useState(prenotazione.prodotti);
  const handleInputChangeStatoPagato = (prodIndex) => {
    // Creo una copia dell'array prenotazione.prodotti
    const updatedProdotti = [...statoPagato];

    // Creo una copia dell'oggetto prodotto che deve essere aggiornato
    const updatedProdotto = { ...updatedProdotti[prodIndex] };

    // Cambio lo stato 'pagato' del prodotto selezionato
    updatedProdotto.pagato = !updatedProdotto.pagato;

    // Aggiorno l'array con il prodotto modificato
    updatedProdotti[prodIndex] = updatedProdotto;

    // Aggiorna lo stato
    setStatoPagato(updatedProdotti);
    console.log(`scelta della checkbox ${prenotazione.prodotti[prodIndex].pagato}`);
  };

  useEffect(() => {
    console.log("aggiorno");
    setIsDisabledButtonsConferma(false)
    if (prenotazione.camera == "esterno") {
      for (let ele of statoPagato) {
        console.log(ele.pagato)
        if (ele.pagato == false) {
          setIsDisabledButtonsConferma(true)
        }
      }
    }




  }, [statoPagato, open]); //con questa dipendenza aggiorna ogni volta che cambiano i valori, se levo dipendenze si agiorna ad ogni cambiamento



  const handleCloseAlert = (event, reason) => {

    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    console.log('pulisco campi')

    setOpen(false);
  };

  const handleClickRifiuta = () => {
    console.log('pulisco campi')
    updatePrenotazione("rifiutata")
    inviaNotifica("Rifiutata", mobileUserTokenNotify)
    const tokenNotifyStruttura = JSON.parse(sessionStorage.getItem('tokenNotifyStruttura'));
    inviaNotifica("_updated", tokenNotifyStruttura)
    handleClose()

    setOpen(false);
  };

  const handleClickSalva = () => {
    updatePrenotazione("in corso")
    handleClose()

    setOpen(false);
  }


  useEffect(() => {
    console.log("aggiorno");
    getUserTokenNotify()


    try {

      setIsDisabledButtonsConferma(false)
      for (let ele of statoPagato) {
        console.log(ele.pagato)
        if (ele.pagato == false) {
          setIsDisabledButtonsConferma(true)
        }
      }

      if (prenotazione.camera != "esterno") {
        setIsDisabledButtonsConferma(false)
      } else {
        setIsDisabledButtonsConferma(true)
      }

      let totale = 0
      for (let ele of prenotazione.prodotti) {
        totale = totale + ele.PrezzoListino

      }
      console.log(totale.toFixed(2))
      setTotale(totale.toFixed(2))

    }
    catch (error) {
      console.log(`errore: ${error}`)
    }


  }, []); //con questa dipendenza aggiorna ogni volta che cambiano i valori, se levo dipendenze si agiorna ad ogni cambiamento



  const updatePrenotazione = async (stato) => {
    try {
      console.log("addebito")
      const token = sessionStorage.getItem('token');
      const ip = sessionStorage.getItem('ipStruttura');
      const codStruttura = sessionStorage.getItem('codStruttura');
      const DBname = sessionStorage.getItem('DBname');
      await fetch(`${url}servizi/updatePrenotazioneRoomS/${prenotazione.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          stato: stato,
          codStruttura: codStruttura,
          messaggio: messaggio,
          prodotti: statoPagato

        }), //gestire id tramite login
      }).then((response) => {
        console.log(response.status)

        if (response.status == 201) {
          setStatoAlert("success")
          setWord("Operazione completata con successo")
          fetchDynamicItems()
          //getPrenotazioni()
          setOpenAlert(true);
        } else {
          setStatoAlert("error")
          setWord("Errore durante l'addebito, verificare addebiti presenti in scheda suite")
          setOpenAlert(true);
        }
      }) //gestire eccezioni
    } catch (error) {
      setStatoAlert("error")
      setWord("Errore durante l'addebito, verificare addebiti presenti in scheda suite")
      setOpenAlert(true);
      console.log(`errore durante addebito: ${error}`)
    }
  };


  const getUserTokenNotify = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const codStruttura = sessionStorage.getItem('codStruttura');

      await fetch(`${url}mobileUser/mobileUserByParams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          codStruttura: codStruttura,
          mail: prenotazione.mailPrenotazione,
          codPrenotazione: prenotazione.codPrenotazione

        }), //gestire id tramite login
      }).then(async (response) => {
        console.log(response.status)

        if (response.status == 200) {
          const data = await response.json();
          console.log(data); // Stampa l'intera risposta JSON
          console.log(`token utente: ${data.tokenNotify}`); // Stampa il tokenNotify
          setMobileUserTokenNotify(data.tokenNotify)
        } else {
          console.log(`errore durante getUserTokenNotify`)
        }
      }) //gestire eccezioni
    }
    catch (error) {

    }
  }



  const inviaNotifica = async (title, mobileUserTokenNotify) => {
    try {
      console.log("addebito")
      const token = sessionStorage.getItem('token');
      //const ip = sessionStorage.getItem('ipStruttura');
      //const codStruttura = sessionStorage.getItem('codStruttura');
      //const DBname = sessionStorage.getItem('DBname');
      await fetch(`${url}sendNotification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          body: messaggio,
          image: "",
          token: mobileUserTokenNotify,

        }), //gestire id tramite login
      }).then((response) => {
        console.log(response.status)

        if (response.status == 200) {
          console.log(`notifica inviata correttamente`)
        } else {
          console.log(`errore durante l'invio della notifica`)
        }
      }) //gestire eccezioni
    } catch (error) {
      console.log(`errore durante l'invio della notifica: ${error}`)
    }
  };





  const addebita = async () => {


    try {
      console.log("addebito")
      const token = sessionStorage.getItem('token');
      const ip = sessionStorage.getItem('ipStruttura');
      const DBname = sessionStorage.getItem('DBname');
      await fetch(`${url}suite/addebitaRoomS`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ip: ip,
          DBname: DBname,
          IdSchedaConto: prenotazione.IdSchedaConto,
          IdSchedaContoRetta: 9999,
          quantita: prenotazione.prodotti.length,
          dataGestione: prenotazione.dataGestione,
          prodotti: prenotazione.prodotti,
          idPrenotazione: prenotazione.id


          //IdProdotto:dettagliProdotto.IdProdotto,
          //Descrizione:dettagliProdotto.Descrizione,
          //TipoProdotto:dettagliProdotto.Tipo,
          //IdTassa:dettagliProdotto.IdTassa,
          //PrezzoListino:dettagliProdotto.PrezzoListino,

        }), //gestire id tramite login
      }).then((response) => {
        console.log(response.status)

        if (response.status == 201) {
          updatePrenotazione("confermata")
          //setStatoAlert("success")
          //setWord("Creato con successo")
          //setOpenAlert(true);
        } else {
          setStatoAlert("error")
          setWord("Errore durante l'addebito, verificare addebiti presenti in scheda suite ")
          setOpenAlert(true);
        }
      }) //gestire eccezioni
    } catch (error) {
      setStatoAlert("error")
      setWord("Errore durante l'addebito, verificare addebiti presenti in scheda suite")
      setOpenAlert(true);
      console.log(`errore durante addebito: ${error}`)
    }
  };



  return (
    <React.Fragment>
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={statoAlert}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {word}
        </Alert>
      </Snackbar>

      <Button className=' w-full bg-sky-500 text-white font-semibold' variant="outlined" onClick={handleClickOpen}>
        Tratta
      </Button>
      <Dialog


        scroll='paper'
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            if(prenotazione.camera == "esterno" || prenotazione.camera=="esterno Web"){

              console.log('invio')
              setIsDisabledButtons(true)
              updatePrenotazione("confermata")
              inviaNotifica("Confermata", mobileUserTokenNotify)
              const tokenNotifyStruttura = JSON.parse(sessionStorage.getItem('tokenNotifyStruttura'));
              inviaNotifica("_updated", tokenNotifyStruttura)
              // Imposta un timeout di 2 secondi
              setTimeout(() => {
                setIsDisabledButtons(false)
                handleCloseAlert()
                handleClose(); // Esegui un'azione dopo il timeout
              }, 4000);
            }else{

              console.log('invio')
              setIsDisabledButtons(true)
              addebita()
              inviaNotifica("Confermata", mobileUserTokenNotify)
              const tokenNotifyStruttura = JSON.parse(sessionStorage.getItem('tokenNotifyStruttura'));
              inviaNotifica("_updated", tokenNotifyStruttura)
              // Imposta un timeout di 2 secondi
              setTimeout(() => {
                setIsDisabledButtons(false)
                handleCloseAlert()
                handleClose(); // Esegui un'azione dopo il timeout
              }, 4000);
            }
            


          },
        }}
      >
        <DialogTitle>Tratta ordine</DialogTitle>
        <DialogContent>

          <DialogContentText sx={{ color: 'black' }}>
            Anagrafica: {prenotazione.anagrafica}
          </DialogContentText>

          <DialogContentText sx={{ color: 'black' }}>
            Email: {prenotazione.mailPrenotazione}
          </DialogContentText>

          <DialogContentText sx={{ color: 'black' }}>
            Camera: {prenotazione.camera}
          </DialogContentText>

          <DialogContentText sx={{ color: 'black' }}>
            Consegna: {prenotazione.locationDelivery}
          </DialogContentText>


          <DialogContentText sx={{ color: 'black' }}>
            Data: {ConvertiTimestampOra(prenotazione.dataGestione)}
          </DialogContentText>

          <DialogContentText sx={{ color: 'black' }}>
            Prodotti:
          </DialogContentText>

          <DialogContentText sx={{ color: 'black' }}>
            {prenotazione.prodotti && prenotazione.prodotti.map((prodotto, prodIndex) => (
              <React.Fragment key={prodIndex}>

                {
                  prenotazione.camera == "esterno" ?

                    <div className=' flex flex-col-2'>

                      <div>
                        <span className=""></span> {prodotto.Descrizione}{' '}
                        <span className="">Quantità:</span> {prodotto.nEle}{' '}
                        <span className="">Prezzo:</span> {prodotto.PrezzoLordo}{'€'}
                        <br />
                        <span className="">Note:</span>
                        <TextField
                          focused={false}
                          autoFocus
                          multiline={true}
                          margin="dense"
                          label=""
                          value={prodotto.note}
                          type="text"
                          variant="standard"
                          disabled={false}
                        />
                      </div>
                      <span className="">{statoPagato[prodIndex]?.pagato ? "Pagato" : "Da pagare"}</span>
                      <Switch
                        checked={statoPagato[prodIndex]?.pagato || false}
                        onChange={() => handleInputChangeStatoPagato(prodIndex)}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </div> :
                    <div>
                      <span className=""></span> {prodotto.Descrizione}{' '}
                      <span className="">Quantità:</span> {prodotto.nEle}{' '}
                      <span className="">Prezzo:</span> {prodotto.PrezzoLordo}{'€'}
                      <br />
                      <span className="">Note:</span>
                      <TextField
                        focused={false}
                        autoFocus
                        multiline={true}
                        margin="dense"
                        label=""
                        value={prodotto.note}
                        type="text"
                        variant="standard"
                        disabled={false}
                      />
                    </div>
                }
                <br />

              </React.Fragment>
            ))}
          </DialogContentText>

          <DialogContentText sx={{ color: 'black' }}>
            Totale: {formTotale + "€"}
          </DialogContentText>

          <TextField
            onChange={handleInputChangeMessaggio}
            focused={false}
            autoFocus
            multiline={true}
            margin="dense"
            label="Messaggio"
            type="text"
            variant="standard"
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickRifiuta} color='error' variant="contained" disabled={isDisabledButtons}>Rifiuta</Button>
          {isDisabledButtonsConferma ? <Button onClick={handleClickSalva} color='success' variant="contained" disabled={isDisabledButtons}>Salva</Button>
            :
            <Button type="submit" color='success' variant="contained" disabled={isDisabledButtons}>Conferma</Button>
          }

        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}