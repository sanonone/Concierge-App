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


registerLocale("it", it); // Registra la localizzazione italiana
setDefaultLocale("it"); // Imposta la localizzazione italiana come predefinita

export default function FormDialog(props) {
    /*
       let prodottiServizi = props.prodottiServizi;
     let servizi = props.servizi
     const riscaricaPrenotazioni= props.riscaricaPrenotazioni
     const url = props.url
     */
    let prenotazione = props.prenotazione
    let prodottiServizi = props.prodottiServizi
    const getPrenotazioni = props.getPrenotazioni
    const url = props.url
    const { noMostraBadge, vediBadge, fetchDynamicItems } = useNotification();
    const [open, setOpen] = React.useState(false);
    const [formTotale, setTotale] = React.useState(0);
    const [dettagliProdotto, setDettagliProdotto] = React.useState('');
    const [mobileUserTokenNotify, setMobileUserTokenNotify] = useState("")


    const [openAlert, setOpenAlert] = React.useState(false);//snackbar bar update card
    const [word, setWord] = React.useState();//snackbar bar update card
    const [statoAlert, setStatoAlert] = React.useState();
    const handleCloseAlert = (event, reason) => {

        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };

    const [isDisabledButtons, setIsDisabledButtons] = useState(false);//stato button conferma e rifiuta



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
    const handleChangeProdottoSelezionato = (event) => {
        setProdottoSelezionato(event.target.value);
        console.log(`prodotto selezionato: ${event.target.value}`)

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

    const [messaggio, setMessaggio] = useState("Stato ordini aggiornato")
    const handleInputChangeMessaggio = (e) => {
        const { name, value } = e.target;
        setMessaggio(value);
        console.log(value);
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

    useEffect(() => {
        console.log("aggiorno");
        getUserTokenNotify()



        try {
            const n = prodottiServizi.length
            for (let i = 0; i < n; ++i) {//cerco dettagli prodotto per metterli nella post per addebitare
                if (prodottiServizi[i].IdProdotto == prenotazione.prodotto.value) {
                    setDettagliProdotto(prodottiServizi[i])
                }
            }

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
            await fetch(`${url}servizi/updatePrenotazioneServizio/${prenotazione.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    stato: stato,
                    codStruttura: codStruttura,
                    messaggio: messaggio,
                }), //gestire id tramite login
            }).then((response) => {
                console.log(response.status)

                if (response.status == 201) {
                    setStatoAlert("success")
                    setWord("Addebitato sulla scheda con successo")
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
                    mail: prenotazione.mail,
                    codPrenotazione: prenotazione.codPrenotazione

                }), //gestire id tramite login
            }).then(async (response) => {
                console.log(response.status)

                if (response.status == 200) {
                    const data = await response.json();
                    console.log(data); // Stampa l'intera risposta JSON
                    console.log(data.tokenNotify); // Stampa il tokenNotify
                    setMobileUserTokenNotify(data.tokenNotify)
                } else {
                    console.log(`errore durante l'invio della notifica`)
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
            const ip = sessionStorage.getItem('ipStruttura');
            const codStruttura = sessionStorage.getItem('codStruttura');
            const DBname = sessionStorage.getItem('DBname');

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
        let days = 0
        if (prenotazione.dataIni == prenotazione.dataFin) {
            days = 1
        } else {
            const diffInMs = Math.abs(prenotazione.dataFin - prenotazione.dataIni);
            days = Math.floor(diffInMs / (1000 * 60 * 60 * 24) + 1);
        }

        try {

            if (prenotazione.camera == "esterno" || prenotazione.camera == "esterno Web") {
                updatePrenotazione("confermata")
            } else {
                console.log("addebito")
                const token = sessionStorage.getItem('token');
                const ip = sessionStorage.getItem('ipStruttura');
                const DBname = sessionStorage.getItem('DBname');

                //console.log(`i dati che invio sono: token=${token}, ip=${ip}, DBname=${DBname}, prodottoIdProdotto=${dettagliProdotto.IdProdotto}, prodottoTipo=${dettagliProdotto.Tipo}, prezzoListino=${dettagliProdotto.PrezzoListino}, prezzo lordo=${dettagliProdotto.PrezzoLordo} `)
                await fetch(`${url}suite/addebitaServizio`, {
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
                        nomeProdotto: prenotazione.prodotto.label,
                        quantita: prenotazione.quantita,
                        dataGestione: prenotazione.dataGestione,
                        prodotto: dettagliProdotto,
                        giorni: days,
                        dataIni: prenotazione.dataIni,


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
                        setStatoAlert("success")
                        setWord("Creato con successo")
                        setOpenAlert(true);
                    } else {
                        setStatoAlert("error")
                        setWord("Errore durante l'addebito, verificare addebiti presenti in scheda suite ")
                        setOpenAlert(true);
                    }
                }) //gestire eccezioni
            }

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

                    },
                }}
            >
                <DialogTitle>Tratta servizi</DialogTitle>
                <DialogContent>

                    <DialogContentText>
                        Servizio: {prenotazione.nomeServizio}
                    </DialogContentText>

                    <DialogContentText>
                        Prodotto: {prenotazione.prodotto.label}
                    </DialogContentText>

                    <DialogContentText>
                        Orario: {prenotazione.ora.label}
                    </DialogContentText>

                    <DialogContentText>
                        Quantità: {prenotazione.quantita}
                    </DialogContentText>


                    <DialogContentText>
                        Anagrafica: {prenotazione.nomePrenotante + " " + prenotazione.cognomePrenotante}
                    </DialogContentText>

                    <DialogContentText>
                        Email: {prenotazione.mail}
                    </DialogContentText>

                    <DialogContentText>
                        Telefono: {prenotazione.telefono}
                    </DialogContentText>

                    <DialogContentText>
                        Camera: {prenotazione.camera}
                    </DialogContentText>

                    <DialogContentText>
                        Da: {ConvertiTimestampOra(prenotazione.dataIni).split(" ")[0]} a: {ConvertiTimestampOra(prenotazione.dataFin).split(" ")[0]}
                    </DialogContentText>

                    <DialogContentText>
                        Data Gestione: {ConvertiTimestampOra(prenotazione.dataGestione)}
                    </DialogContentText>

                    <DialogContentText>
                        Richieste:
                    </DialogContentText>

                    <TextField
                        focused={false}
                        autoFocus
                        multiline={true}
                        margin="dense"
                        label=""
                        value={prenotazione.richieste}
                        type="text"
                        variant="standard"
                        disabled={true}
                    />

                    <br />
                    <DialogContentText>
                        Totale: {prenotazione.totale + "€"}
                    </DialogContentText>



                    <br />
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
                    <Button type="submit" color='success' variant="contained" disabled={isDisabledButtons}>Conferma</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}