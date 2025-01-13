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


registerLocale("it", it); // Registra la localizzazione italiana
setDefaultLocale("it"); // Imposta la localizzazione italiana come predefinita

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogChiudiDisponibilita(props) {
    let prodottiServizi = props.prodottiServizi;
    let servizi = props.servizi
    const riscaricaPrenotazioni = props.riscaricaPrenotazioni
    const url = props.url
    const [open, setOpen] = React.useState(false);
    const [formTotale, setTotale] = React.useState(0);
    const config = sessionStorage.getItem("tipoConfigurazione");

    const [servizio, setServizio] = React.useState('');
    const handleChangeServizio = (event) => {
        setServizio(event.target.value);
        console.log("evento selezionato: " + event.target.value)

        const prodFasce = servizi.filter(ele => (ele.id == event.target.value))
        console.log(prodFasce[0])
        //setProdottiSer(prodFasce[0])
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


        fasceOrarieProdottoDesiderato.push({ label: "Tutte", value: "tutte" })
        console.log(fasceOrarieProdottoDesiderato);
        setFasceOrarieProdottoDesiderato(fasceOrarieProdottoDesiderato)

    };
    const [formFasceOrarieProdottoDesiderato, setFasceOrarieProdottoDesiderato] = useState([])
    const [fasciaSelezionata, setFasciaSelezionata] = React.useState('');
    const handleChangeFasciaSelezionata = (event) => {
        event.preventDefault()
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

        setSelectedDateIni('')
        setSelectedDateDataFin('')

        setServizio('')
        setProdottoSelezionato('')
        setFasceOrarieProdottoDesiderato([])
        setFasciaSelezionata([])
        setOpen(false);
    };


    /*
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
                    //non fare nulla e metti un alert
                    console.log("ALERT")
                }
                if (selectedDateIni == selectedDateDataFin) {
                    //caso date uguali quindi metto days=1 e non faccio conto giorni
                    console.log("uguali")
                    const days = 1
                    const prodotto = prodottiSer.flat().filter(ele => (ele.IdProdotto == prodottoSelezionato))
                    let prezzo = parseInt(prodotto[0].PrezzoListino)
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

                    const prodotto = prodottiSer.flat().filter(ele => (ele.IdProdotto == prodottoSelezionato))
                    let prezzo = parseInt(prodotto[0].PrezzoListino)
                    //console.log(`Giorni passati:${days} prezzo:${prezzo} quantità:${formQuantita}`)
                    const totale = prezzo * parseInt(formQuantita) * days
                    //console.log(`il totale è: ${totale}`)
                    setTotale(totale)
                    //const totale=prodottoSelezionato.PrezzoListino*days*
                }



            }


        }
        catch (error) {
            console.log(`errore: ${error}`)
        }


    }, [prodottoSelezionato, formQuantita, selectedDateIni, selectedDateDataFin]); //con questa dipendenza aggiorna ogni volta che cambiano i valori, se levo dipendenze si agiorna ad ogni cambiamento

*/

    const postPrenotazione = async (
        idServizio,
        nomeServizio,
        dataIni,
        dataFin,
        ora,
        prodotto,
        formQuantita,
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
                    nomePrenotante: "",
                    cognomePrenotante: "",
                    mail: "",
                    codPrenotazione: "",
                    camera: "chiusura",
                    richieste: "",
                    dataIni: dataIni,
                    dataFin: dataFin,
                    ora: ora,
                    prodotto: prodotto,
                    totale: 0,
                    quantita: formQuantita,
                    stato: "chiusura",
                }), //gestire id tramite login
            }).then((response) => response.json()); //gestire eccezioni
            console.log('pulisco campi')

            setSelectedDateIni('')
            setSelectedDateDataFin('')
            setServizio('')
            setProdottoSelezionato('')
            setFasciaSelezionata('')
            setFormQuantita(1)
            setFasceOrarieProdottoDesiderato([])

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
            <Button className=' w-full bg-red-700 text-white font-semibold' variant="outlined" onClick={handleClickOpen}>
                Chiudi Disponibilità
            </Button>
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
                        const serCercato = servizi.filter(ele => (ele.id == servizio))
                        //const numeroFasce = formFasceOrarieProdottoDesiderato.length
                        if (fasciaSelezionata.label == "Tutte") {
                            for (let ele of formFasceOrarieProdottoDesiderato) {
                                if (ele.value != "tutte") {
                                    await postPrenotazione(servizio, serCercato[0].nome, selectedDateIni, selectedDateDataFin, ele, prodottoInvio, formQuantita)
                                }
                            }
                        } else {
                            await postPrenotazione(servizio, serCercato[0].nome, selectedDateIni, selectedDateDataFin, fasciaSelezionata, prodottoInvio, formQuantita)
                        }



                        riscaricaPrenotazioni()
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Chiudi disponibilità</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Seleziona il tipo di servizio e le date in cui chiudere la disponibilità
                    </DialogContentText>

                    <FormControl sx={{ m: 1, minWidth: 160 }}>
                        <InputLabel id="demo-simple-select-autowidth-label">Servizio</InputLabel>
                        <Select
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
                    <br />

                    <FormControl sx={{ m: 1, minWidth: 160 }}>
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
                    <br />

                    <FormControl sx={{ m: 1, minWidth: 160 }}>
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
                    <br />



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
                    <TextField
                        onChange={handleInputChangeQuantita}
                        autoFocus
                        margin="dense"
                        value={formQuantita}
                        label="Quantità"
                        type="number"
                        variant="standard"
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annulla</Button>
                    <Button type="submit">Applica</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}