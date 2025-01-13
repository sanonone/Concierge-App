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
    let segnalazione = props.segnalazione
    const url = props.url
    const { noMostraBadge, vediBadge, fetchDynamicItems } = useNotification();
    const [open, setOpen] = React.useState(false);

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



    const [messaggio, setMessaggio] = useState("")
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

        updateSegnalazione("rifiutata")
        inviaNotifica("Rifiutata", segnalazione.tokenNotifyMittente)
        const tokenNotifyStruttura = JSON.parse(sessionStorage.getItem('tokenNotifyStruttura'));
        inviaNotifica("_updated", tokenNotifyStruttura)
        handleClose()

        setOpen(false);
    };

    useEffect(() => {
        console.log("aggiorno");
        //getUserTokenNotify()


    }, []); //con questa dipendenza aggiorna ogni volta che cambiano i valori, se levo dipendenze si agiorna ad ogni cambiamento


    const updateSegnalazione = async (stato) => {
        try {
            console.log("addebito")
            const token = sessionStorage.getItem('token');
            const ip = sessionStorage.getItem('ipStruttura');
            const codStruttura = sessionStorage.getItem('codStruttura');
            const DBname = sessionStorage.getItem('DBname');
            await fetch(`${url}messaggi/${segnalazione.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    stato: stato,
                    codStruttura: codStruttura,
                    risposta: messaggio,
                }), //gestire id tramite login
            }).then((response) => {
                console.log(response.status)

                if (response.status == 200) {
                    setStatoAlert("success")
                    setWord("Segnalazione gestita correttamente")
                    fetchDynamicItems()
                    //getPrenotazioni()
                    setOpenAlert(true);
                } else {
                    setStatoAlert("error")
                    setWord("Errore durante la gestione della segnalazione")
                    setOpenAlert(true);
                }
            }) //gestire eccezioni
        } catch (error) {
            setStatoAlert("error")
            setWord("Errore durante la gestione della segnalazione")
            setOpenAlert(true);
            console.log(`errore durante gestione segnalazione: ${error}`)
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
                    mail: segnalazione.mail,
                    codPrenotazione: segnalazione.codPrenotazione

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

                        updateSegnalazione("confermata")

                        inviaNotifica("Confermata", segnalazione.tokenNotifyMittente)
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
                <DialogTitle>Tratta segnalazioni</DialogTitle>
                <DialogContent>


                    <DialogContentText>
                        Email: {segnalazione.mittente.split(" ")[0]} <br />Numero: {segnalazione.mittente.split(" ")[1]}
                    </DialogContentText>

                    <DialogContentText>
                        Camera: {segnalazione.camera}
                    </DialogContentText>


                    <DialogContentText>
                        Data Gestione: {ConvertiTimestampOra(segnalazione.dataGestione)}
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
                        value={segnalazione.problema}
                        type="text"
                        variant="standard"
                        disabled={true}
                    />





                    <p></p>
                    <TextField
                        onChange={handleInputChangeMessaggio}
                        focused={false}
                        autoFocus
                        multiline={true}
                        margin="dense"
                        label="Rispondi"
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