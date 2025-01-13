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

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Menu } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slide from '@mui/material/Slide';

registerLocale("it", it); // Registra la localizzazione italiana
setDefaultLocale("it"); // Imposta la localizzazione italiana come predefinita

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function FormInvioNotifica(props) {
    let prodottiServizi = props.prodottiServizi;
    let servizi = props.servizi
    const riscaricaPrenotazioni = props.riscaricaPrenotazioni
    const url = props.url
    const [open, setOpen] = React.useState(false);
    const [formTotale, setTotale] = React.useState(0);
    const [mobileUserTokenNotify, setMobileUserTokenNotify] = useState("")
    const [userInterni, setUserInterni] = useState([]);
    const [userEsterni, setUserEsterni] = useState([]);
    const [user, setUser] = useState([]);
    const [userCheckin, setUserCheckin] = useState([]);
    const [userCheckout, setUserCheckout] = useState([]);
    const [userDentro, setUserDentro] = useState([]);
    const [listTokenNotify, setListTokenNotify] = useState([]);

    const config = sessionStorage.getItem("tipoConfigurazione");



    const [inCheckin, setInCheckin] = useState(false);
    const handleInputChangeInCheckin = () => {
        setInCheckin(!inCheckin);
        setInCheckout(false)
        setDentro(false)
        setSelectedPersonalizzatoGuest('')
        setSelectedPresonalizzato('')
        console.log(`scelta della checkbox ${inCheckin}`);
        //filtrare user per data checkin
        const inCheckinUser = []
        const TokenNotify = []

        user.forEach(ele => {
            // Converti la stringa ISO in un oggetto Date
            const dateToCompareIni = new Date(ele.DataInizio);
            const dateToCompareFin = new Date(ele.DataFine);

            // Ottieni la data attuale del dispositivo
            const currentDate = new Date();

            // Normalizza le date impostando l'ora a mezzanotte
            const normalizeDate = (date) => {
                return new Date(date.getFullYear(), date.getMonth(), date.getDate());
            };

            const normalizedDateToCompareIni = normalizeDate(dateToCompareIni);
            const normalizedDateToCompareFin = normalizeDate(dateToCompareFin);
            const normalizedCurrentDate = normalizeDate(currentDate);

            // Confronta le date
            const isInRange = normalizedCurrentDate.getTime() === normalizedDateToCompareIni.getTime();
            if (isInRange == true) {
                console.log("c'è in checkin")
                inCheckinUser.push(ele)
                TokenNotify.push(ele.tokenNotify)
                console.log("c'è in ceckin " + ele.nome)
            }
        })

        setUserCheckin(inCheckinUser)
        setListTokenNotify(TokenNotify)
        console.log('Checkin:' + userCheckin)

    };

    const [inCheckout, setInCheckout] = useState(false);
    const handleInputChangeInCheckout = () => {
        setInCheckout(!inCheckout);
        setInCheckin(false)
        setDentro(false)
        setSelectedPersonalizzatoGuest('')
        setSelectedPresonalizzato('')
        console.log(`scelta della checkbox ${inCheckout}`);
        //filtrare user per data checkout
        const inCheckoutUser = []
        const TokenNotify = []

        user.forEach(ele => {
            // Converti la stringa ISO in un oggetto Date
            const dateToCompareIni = new Date(ele.DataInizio);
            const dateToCompareFin = new Date(ele.DataFine);

            // Ottieni la data attuale del dispositivo
            const currentDate = new Date();

            // Normalizza le date impostando l'ora a mezzanotte
            const normalizeDate = (date) => {
                return new Date(date.getFullYear(), date.getMonth(), date.getDate());
            };

            const normalizedDateToCompareIni = normalizeDate(dateToCompareIni);
            const normalizedDateToCompareFin = normalizeDate(dateToCompareFin);
            const normalizedCurrentDate = normalizeDate(currentDate);

            // Confronta le date
            const isInRange = normalizedCurrentDate.getTime() === normalizedDateToCompareFin.getTime();
            if (isInRange == true) {
                console.log("c'è in ceckout " + ele.nome)
                inCheckoutUser.push(ele)
                TokenNotify.push(ele.tokenNotify)
            }
        })

        setUserCheckout(inCheckoutUser)
        setListTokenNotify(TokenNotify)
        console.log('Checkout:' + userCheckout)
    };

    const [dentro, setDentro] = useState(false);
    const handleInputChangeDentro = () => {
        setDentro(!dentro);
        setInCheckin(false)
        setInCheckout(false)
        setSelectedPersonalizzatoGuest('')
        setSelectedPresonalizzato('')
        console.log(`scelta della checkbox ${dentro}`);
        //filtrare user compresi in data in e out 
        const dentroTemp = []
        const TokenNotify = []

        user.forEach(ele => {
            // Converti la stringa ISO in un oggetto Date
            const dateToCompareIni = new Date(ele.DataInizio);
            const dateToCompareFin = new Date(ele.DataFine);

            // Ottieni la data attuale del dispositivo
            const currentDate = new Date();

            // Normalizza le date impostando l'ora a mezzanotte
            const normalizeDate = (date) => {
                return new Date(date.getFullYear(), date.getMonth(), date.getDate());
            };

            const normalizedDateToCompareIni = normalizeDate(dateToCompareIni);
            const normalizedDateToCompareFin = normalizeDate(dateToCompareFin);
            const normalizedCurrentDate = normalizeDate(currentDate);

            // Confronta le date
            const isInRange = normalizedCurrentDate.getTime() >= normalizedDateToCompareIni.getTime() && normalizedCurrentDate.getTime() <= normalizedDateToCompareFin.getTime();
            if (isInRange == true) {
                console.log("c'è dentro " + ele.nome)
                dentroTemp.push(ele)
                TokenNotify.push(ele.tokenNotify)
            }
        })

        setUserDentro(dentroTemp)
        setListTokenNotify(TokenNotify)
        console.log('Dentro:' + userDentro)
    };

    const [tutti, setTutti] = useState(false);
    const handleInputChangeTutti = () => {
        setTutti(!tutti)
        setDentro(false)
        setInCheckin(false)
        setInCheckout(false)
        setSelectedPersonalizzatoGuest('')
        setSelectedPresonalizzato('')
        const TokenNotify = []
        user.forEach(ele => {
            TokenNotify.push(ele.tokenNotify)
        })
        setListTokenNotify(TokenNotify)
    }


    const [titolo, setTitolo] = useState("")
    const handleInputChangeTitolo = (e) => {
        const { name, value } = e.target;
        setTitolo(value);
    };

    const [messaggio, setMessaggio] = useState("")
    const handleInputChangeMessaggio = (e) => {
        const { name, value } = e.target;
        setMessaggio(value);
        console.log(value);
    };

    const [selectedPersonalizzato, setSelectedPresonalizzato] = React.useState('');
    const handleChangeSelectedPersonalizzato = (event) => {
        setSelectedPresonalizzato(event.target.value);
        console.log(event.target.value)
        setDentro(false);
        setInCheckin(false)
        setInCheckout(false)
        setSelectedPersonalizzatoGuest('')
        const TokenNotify = []
        TokenNotify.push(event.target.value.tokenNotify)
        setListTokenNotify(TokenNotify)

    };




    const [selectedPersonalizzatoGuest, setSelectedPersonalizzatoGuest] = React.useState('');
    const handleChangeSelectedPersonalizzatoGuest = (event) => {
        setSelectedPersonalizzatoGuest(event.target.value);
        setDentro(false);
        setInCheckin(false)
        setInCheckout(false)
        setSelectedPresonalizzato('')
        const TokenNotify = []
        TokenNotify.push(event.target.value.tokenNotify)
        setListTokenNotify(TokenNotify)
    };


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




    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        console.log('pulisco campi')

        setOpen(false);
    };

    useEffect(() => {
        console.log("aggiorno");


        try {
            getUserTokenNotify()



        }
        catch (error) {
            console.log(`errore: ${error}`)
        }


    }, []); //con questa dipendenza aggiorna ogni volta che cambiano i valori, se levo dipendenze si agiorna ad ogni cambiamento


    const getUserTokenNotify = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const codStruttura = sessionStorage.getItem('codStruttura');

            let interni = []
            let esterni = []
            let users = []
            await fetch(`${url}mobileUser/${codStruttura}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },

            }).then(async (response) => {
                console.log(response.status)

                if (response.status == 200) {
                    let data = await response.json();
                    console.log(data); // Stampa l'intera risposta JSON
                    data.forEach(element => {
                        console.log(element.mail)

                        users.push(element)
                        setUser(users)
                        if (element.tipo == "interno") {
                            interni.push(element)
                        }

                        if (element.tipo == "esterno") {
                            esterni.push(element)
                        }
                    })
                    //setMobileUserTokenNotify(data.tokenNotify)
                    setUserInterni(interni)
                    setUserEsterni(esterni)
                } else {
                    console.log(`errore durante l'invio della notifica`)
                }
            }) //gestire eccezioni
        }
        catch (error) {

        }
    }


    const postNotifica = async (
        codPrenotazione,
        problema,
        risposta,
        tipo,
        stato,
        camera,
        mittente,
        destinatario,
        tokenNotifyMittente,
        tokenNotifyDestinatario
    ) => {
        try {

            const token = sessionStorage.getItem('token');
            const codStruttura = sessionStorage.getItem('codStruttura');
            await fetch(`${url}messaggi/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    codStruttura: codStruttura,
                    codPrenotazione: codPrenotazione,
                    problema: problema,
                    risposta: risposta,
                    tipo: tipo,
                    stato: stato,
                    camera: camera,
                    mittente: mittente,
                    destinatario: destinatario,
                    tokenNotifyMittente: tokenNotifyMittente,
                    tokenNotifyDestinatario: tokenNotifyDestinatario,
                }), //gestire id tramite login
            }).then((response) => response.json()); //gestire eccezioni
            console.log('pulisco campi')

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

            <Button className='w-full bg-sky-900 text-white font-semibold' variant="outlined" onClick={handleClickOpen}>
                <SendIcon></SendIcon> Invia Notifica
            </Button>
            <Dialog

                TransitionComponent={Transition}
                scroll='paper'
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        console.log('invio')

                        inviaNotifica(titolo, listTokenNotify)
                        for (let i = 0; i <= listTokenNotify.length; i++) {
                            postNotifica(0, "", messaggio, "n", titolo, "", "Notifica Concierge", "", listTokenNotify[i], [listTokenNotify[i]])
                        }



                        riscaricaPrenotazioni()
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Invia Notifica</DialogTitle>




                <DialogContent>

                    <FormControlLabel control={<Switch
                        disabled={config == "Standard" ? true : false}
                        label="test"
                        checked={inCheckin}
                        onChange={handleInputChangeInCheckin}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />} label="In check-in" />

                    <FormControlLabel control={<Switch
                        disabled={config == "Standard" ? true : false}
                        label="test"
                        checked={inCheckout}
                        onChange={handleInputChangeInCheckout}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />} label="In check-out" />

                    <FormControlLabel control={<Switch
                        disabled={config == "Standard" ? true : false}
                        label="test"
                        checked={dentro}
                        onChange={handleInputChangeDentro}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />} label="Dentro" />

                    <FormControlLabel control={<Switch
                        label="test"
                        checked={tutti}
                        onChange={handleInputChangeTutti}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />} label="Tutti" />

                    <p></p>
                    <FormControl sx={{ m: 1, minWidth: 200 }}>

                        <InputLabel id="demo-simple-select-autowidth-label">Personalizzato</InputLabel>
                        <Select
                            variant='standard'
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            fullWidth
                            value={selectedPersonalizzato}
                            onChange={handleChangeSelectedPersonalizzato}
                            autoWidth
                            label="Age"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {userInterni.map((ser, index) => (
                                <MenuItem key={index} value={ser}>{ser.mail}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <p></p>
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel id="demo-simple-select-autowidth-label2">Personalizzato (guest)</InputLabel>
                        <Select
                            variant='standard'
                            fullWidth
                            labelId="demo-simple-select-autowidth-label2"
                            id="demo-simple-select-autowidth2"
                            value={selectedPersonalizzatoGuest}
                            onChange={handleChangeSelectedPersonalizzatoGuest}
                            autoWidth
                            label="Age2"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {userEsterni.map((pr, index) => (
                                <MenuItem key={index} value={pr}>
                                    {pr.mail}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                    <p></p>
                    <TextField sx={{ minWidth: 90 }}
                        onChange={handleInputChangeTitolo}
                        autoFocus
                        required
                        margin="dense"
                        label="Titolo notifica"
                        type="text"

                        variant="standard"

                    />
                    <p></p>
                    <TextField sx={{ minWidth: 200 }}
                        onChange={handleInputChangeMessaggio}
                        focused={false}
                        autoFocus
                        required
                        multiline={true}
                        fullWidth
                        margin="dense"
                        label="Testo notifica"
                        type="text"
                        variant="standard"
                    />




                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annulla</Button>
                    <Button type="submit">Invia</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}