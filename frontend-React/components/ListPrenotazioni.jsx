import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
import RoomServiceOutlinedIcon from '@mui/icons-material/RoomServiceOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ConvertiTimestamp from './ConvertiTimestamp';
import ConvertiTimestampOra from './ConvertiOraTimestamp';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FormDialog from "../components/DialogServizi";
import FormNotifiche from "../components/DialogNotifiche.jsx";
import DialogChiudiDisponibilita from './DialogChiudiDisponibilita.jsx';
import TrattaProdotti from "../components/TrattaProdotti"
import TrattaServizio from "../components/TrattaServizio"
import TrattaSegnalazioni from "../components/TrattaSegnalazioni"
import Badge from '@mui/material/Badge';
import { useNotification } from '../context/NotificationContext.jsx'
import PrivateRoutes from './PrivateRoutes.jsx';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import EventBusyIcon from '@mui/icons-material/EventBusy';

export default function NestedList(props) {

    const { dynamicItemsN, dynamicItemsChiusuraN, dynamicItemsCarN, dynamicItemsSegnN, processedItemsN, processedItemsCarN, processedItemsSegnN, vediBadge, fetchDynamicItems } = useNotification();

    const url = props.url
    let prodottiServizi = props.prodottiServizi;
    let servizi = props.servizi
    const showNotification = props.showNotification
    const codStruttura = sessionStorage.getItem("codStruttura");
    const [open, setOpen] = React.useState(false);//list servizi
    const [openCar, setOpenCar] = React.useState(false);//list carrello
    const [openSegn, setOpenSegn] = React.useState(false);//list segnalazioni
    const [openChiusura, setOpenChiusura] = React.useState(false);//list disponibilità chiusa
    const [openProcessed, setOpenProcessed] = React.useState(false);//servizi
    const [openProcessedCar, setOpenProcessedCar] = React.useState(false);//carrello
    const [openProcessedSegn, setOpenProcessedSegn] = React.useState(false);//segnalazioni
    const [dynamicItems, setDynamicItems] = React.useState([]); // Stato per memorizzare gli elementi dinamici (servizi)
    const [dynamicItemsChiusura, setDynamicItemsChiusura] = React.useState([]); // Stato per memorizzare gli elementi dinamici (chiusure)
    const [dynamicItemsCar, setDynamicItemsCar] = React.useState([]); // Stato per memorizzare gli elementi dinamici (carrello)
    const [dynamicItemsSegn, setDynamicItemsSegn] = React.useState([]);
    const [processedItems, setProcessedItems] = React.useState([]); // Stato per memorizzare gli elementi trattati(servizi)
    const [processedItemsCar, setProcessedItemsCar] = React.useState([]); // Stato per memorizzare gli elementi trattati(carrello)
    const [processedItemsSegn, setProcessedItemsSegn] = React.useState([]);

    const prevDynamicItems = React.useRef([]);
    const prevDynamicItemsCar = React.useRef([]);
    const isFirstLoad = React.useRef(true); // Flag per il primo caricamento per gestire notifiche



    // Effettua una fetch per ottenere i dati dinamici
    React.useEffect(() => {
        //fetchDynamicItems(); // Chiamata alla funzione fetch al montaggio del componente
        setDynamicItems(dynamicItemsN)
        setDynamicItemsChiusura(dynamicItemsChiusuraN)
        setDynamicItemsCar(dynamicItemsCarN)
        setDynamicItemsSegn(dynamicItemsSegnN)
        setProcessedItems(processedItemsN)
        setProcessedItemsCar(processedItemsCarN)
        setProcessedItemsSegn(processedItemsSegnN)
        //console.log(dynamicItems)
        //console.log(dynamicItemsCar)
    },); // Assicurati di passare un array vuoto come dipendenza per eseguire questa fetch solo una volta

    // Funzione per gestire il clic sugli elementi con sottomenu
    const handleClick = () => {
        setOpen(!open);
        setOpenCar(false);
        setOpenSegn(false);
        setOpenChiusura(false)
    };

    const handleClickCar = () => {
        setOpen(false);
        setOpenCar(!openCar);
        setOpenSegn(false);
        setOpenChiusura(false)
    };

    const handleClickSegn = () => {
        setOpen(false);
        setOpenCar(false);
        setOpenChiusura(false)
        setOpenSegn(!openSegn);
    };

    const handleClickChiusura = () => {
        setOpen(false);
        setOpenCar(false);
        setOpenSegn(false);
        setOpenChiusura(!openChiusura)
    };

    // Funzione per gestire il clic sugli elementi con sottomenu
    const handleClickProcessed = () => {
        setOpenProcessed(!openProcessed);
        setOpenProcessedCar(false);
        setOpenProcessedSegn(false);
    };
    const handleClickProcessedCar = () => {
        setOpenProcessed(false);
        setOpenProcessedCar(!openProcessedCar);
        setOpenProcessedSegn(false);
    };
    const handleClickProcessedSegn = () => {
        setOpenProcessed(false);
        setOpenProcessedCar(false);
        setOpenProcessedSegn(!openProcessedSegn);
    };

    const handleClickRipristinaServizio = (id) => {
        console.log('ripristina ' + id)
        updatePrenotazioneServizio("attesa", id)
        //fetchDynamicItems()

    };

    const handleClickRipristinaRoomS = (id) => {
        console.log('ripristina ' + id)
        updatePrenotazioneRoomS("attesa", id)
        //fetchDynamicItems()

    };


    /*
    React.useEffect(() => {
        if (prevDynamicItems.current.length > 0) {
            const nuoviElementi = dynamicItems.filter(item => !prevDynamicItems.current.some(prevItem => prevItem.id === item.id));
            if (nuoviElementi.length > 0) {
                console.log('Nuovi elementi trovati in dynamicItems:', nuoviElementi);
                // Mostra notifica per nuovi elementi
                //showNotification("Servizi", "Nuove prenotazioni");
            }
        }
        prevDynamicItems.current = dynamicItems;
    }, [dynamicItems]);

    React.useEffect(() => {
        if (prevDynamicItemsCar.current.length > 0) {
            const nuoviElementiCar = dynamicItemsCar.filter(item => !prevDynamicItemsCar.current.some(prevItem => prevItem.id === item.id));
            if (nuoviElementiCar.length > 0) {
                console.log('Nuovi elementi trovati in dynamicItemsCar:', nuoviElementiCar);
                // Mostra notifica per nuovi elementi Car
                //showNotification("Servizio in Camera", "Nuove prenotazioni");
            }
        }
        prevDynamicItemsCar.current = dynamicItemsCar;
    }, [dynamicItemsCar]);


    // Funzione per ottenere gli elementi dinamici dalla fetch
    const fetchDynamicItems = () => {
        try {

            // Esempio di fetch (sostituiscilo con il tuo endpoint effettivo)
            const token = sessionStorage.getItem('token');


            // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
            const requestOptions = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            //showNotification("aggiornato","aggiornato")
            //const url = `http://localhost:3000/hotel/${codStruttura}`

            fetch(`${url}servizi/getAllPrenotazioniServizi/${codStruttura}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const daGestire = data.filter(ele => (ele.stato == "attesa"))
                    if (isFirstLoad.current) {
                        const nuoviElementi1 = daGestire.filter(item => !prevDynamicItems.current.some(prevItem => prevItem.id === item.id));
                        if (nuoviElementi1.length > 0) {
                            console.log('Nuovi elementi trovati in dynamicItems:', nuoviElementi1);
                            // Mostra notifica per nuovi elementi
                            //showNotification("Servizi", "Nuove prenotazioni");
                        }
                    }
                    setDynamicItems(daGestire); // Imposta gli elementi dinamici nello stato
                    const gestiti = data.filter(ele => (ele.stato != "attesa"))
                    setProcessedItems(gestiti)
                })
                .catch(error => {
                    console.error('Errore durante il recupero degli elementi dinamici:', error);
                });


            fetch(`${url}servizi/getPrenotazioniRoomS/${codStruttura}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const daGestire = data.filter(ele => (ele.stato == "attesa"))

                    if (isFirstLoad.current) {
                        const nuoviElementi2 = daGestire.filter(item => !prevDynamicItemsCar.current.some(prevItem => prevItem.id === item.id));
                        if (nuoviElementi2.length > 0) {
                            console.log('Nuovi elementi trovati in dynamicItemsCar:', nuoviElementi2);
                            // Mostra notifica per nuovi elementi Car
                            //showNotification("Servizio in Camera", "Nuove prenotazioni");
                        }
                    }
                    setDynamicItemsCar(daGestire); // Imposta gli elementi dinamici nello stato
                    //console.log(daGestire)
                    const gestiti = data.filter(ele => (ele.stato != "attesa"))
                    setProcessedItemsCar(gestiti)
                })
                .catch(error => {
                    console.error('Errore durante il recupero degli elementi dinamici Car:', error);
                });

            isFirstLoad.current = false; // Dopo il primo caricamento, imposta il flag a false

        } catch (error) {
            console.log(`errore: ${error}`)
        }

    };
*/

    const handleClickEliminaPrenotazioneServizio = (event, id) => {
        event.preventDefault();
        console.log('elimina ' + id)
        elimina(id)


    };

    const elimina = async (ID) => {
        try {

            const token = sessionStorage.getItem('token');
            await fetch(`${url}servizi/deletePrenotazioneServizio/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ id: ID, codStruttura: codStruttura }), //gestire id tramite login
            }).then((response) => response.json()); //gestire eccezioni


        } catch (error) {
            console.log(`errore durante l'eliminazione della chiusura: ${error}`)
        }
        fetchDynamicItems()
    };

    const updatePrenotazioneServizio = async (stato, idPrenotazione) => {
        try {
            console.log("addebito")
            const token = sessionStorage.getItem('token');
            const ip = sessionStorage.getItem('ipStruttura');
            const codStruttura = sessionStorage.getItem('codStruttura');
            const DBname = sessionStorage.getItem('DBname');
            await fetch(`${url}servizi/updatePrenotazioneServizio/${idPrenotazione}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    stato: stato,
                    codStruttura: codStruttura,
                    messaggio: '',
                }), //gestire id tramite login
            }).then((response) => {
                console.log(response.status)

                if (response.status == 201) {
                    console.log("ok")
                    fetchDynamicItems()
                } else {
                    console.log("no")
                }
            }) //gestire eccezioni
        } catch (error) {

            console.log(`errore durante addebito: ${error}`)
        }
    };


    const updatePrenotazioneRoomS = async (stato, idPrenotazione) => {
        try {
            console.log("addebito")
            const token = sessionStorage.getItem('token');
            const ip = sessionStorage.getItem('ipStruttura');
            const codStruttura = sessionStorage.getItem('codStruttura');
            const DBname = sessionStorage.getItem('DBname');
            await fetch(`${url}servizi/updatePrenotazioneRoomS/${idPrenotazione}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    stato: stato,
                    codStruttura: codStruttura,
                    messaggio: '',

                }), //gestire id tramite login
            }).then((response) => {
                console.log(response.status)

                if (response.status == 201) {
                    console.log("aggiornato")
                    fetchDynamicItems()
                } else {
                    console.log("no aggiornato")
                }
            }) //gestire eccezioni
        } catch (error) {
            console.log(`errore durante addebito: ${error}`)
        }
    };



    return (
        <>
            <List
                sx={{
                    width: '100%', maxWidth: '100%', bgcolor: 'background.paper', display: 'flex',
                    flexDirection: {
                        xs: 'column', // flex-col per schermi piccoli
                        sm: 'row',    // flex-row per schermi più grandi
                    },
                }}
            >
                <List
                    sx={{ width: '100%', maxWidth: '80%', bgcolor: 'background.paper', }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader className=' font-bold text-lg' component="div" id="nested-list-subheader">
                            Pannello Gestione
                        </ListSubheader>
                    }
                >
                    <ListItemButton className=' flex sm:flex-row gap-2 flex-col'>
                        <FormDialog
                            prodottiServizi={prodottiServizi}
                            servizi={servizi}
                            url={url}
                            riscaricaPrenotazioni={fetchDynamicItems}
                        ></FormDialog>
                        <FormNotifiche
                            prodottiServizi={prodottiServizi}
                            servizi={servizi}
                            url={url}
                            riscaricaPrenotazioni={fetchDynamicItems}
                        />
                        <DialogChiudiDisponibilita
                            prodottiServizi={prodottiServizi}
                            servizi={servizi}
                            url={url}
                            riscaricaPrenotazioni={fetchDynamicItems}
                        ></DialogChiudiDisponibilita>
                    </ListItemButton>
                    
                    {/*
                    <ListItemButton>
                        <FormNotifiche
                            prodottiServizi={prodottiServizi}
                            servizi={servizi}
                            url={url}
                            riscaricaPrenotazioni={fetchDynamicItems}
                        />
                    </ListItemButton>
                    */}

                    <ListItemButton onClick={handleClickCar}>
                        <ListItemIcon>
                            {dynamicItemsCar.length > 0 ?
                                <Badge badgeContent={dynamicItemsCar.length} color="primary">
                                    <RoomServiceOutlinedIcon />
                                </Badge>
                                : <RoomServiceOutlinedIcon />
                            }
                        </ListItemIcon>
                        <ListItemText primary="Prenotazioni Ordini" />
                        {openCar ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openCar} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {/* Mappa gli elementi dinamici ottenuti dalla fetch */}
                            {dynamicItemsCar.map((item, index) => (
                                <ListItemButton key={index} sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                        {/*<StarBorder />*/}
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <>
                                            <span className="font-bold">Nome:</span> {item.anagrafica}{' '}
                                            {item.camera == "esterno" ? <span className=' text-yellow-500'><NoAccountsIcon /></span> : <span></span>}
                                            <br></br>
                                            <span className="font-bold">Camera:</span> {item.camera}{' '}
                                            <br />
                                            <span className='font-bold'>Consegna:</span> {item.locationDelivery}{' '}
                                            <br />
                                            <span className="font-bold">Mail:</span> {item.mailPrenotazione}{' '}
                                            <br />
                                            <span className="font-bold">Prodotti</span>
                                            {item.prodotti && item.prodotti.map((prodotto, prodIndex) => (
                                                <React.Fragment key={prodIndex}>
                                                    <br />
                                                    <span className="font-bold"></span> {prodotto.Descrizione}{' '}
                                                    <span className="font-bold">Quantità:</span> {prodotto.nEle}{' '}
                                                    <span className="font-bold">Prezzo:</span> {prodotto.PrezzoLordo}{' '}
                                                    {item.camera == "esterno" ? prodotto.pagato ? <span className=' text-green-500'><EuroSymbolIcon /></span> : <span className=' text-red-500'><EuroSymbolIcon /></span> : <span></span>}


                                                </React.Fragment>
                                            ))}
                                        </>
                                    }
                                        secondary={
                                            <>
                                                <span className="font-bold">Data Gestione:</span> {ConvertiTimestampOra(item.dataGestione)}{' '}
                                            </>
                                        }
                                    />

                                    <div className=' flex flex-row gap-3'>
                                        <TrattaProdotti prenotazione={item} url={url} getPrenotazioni={fetchDynamicItems}></TrattaProdotti>

                                    </div>

                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>

                    <ListItemButton onClick={handleClick}>
                        <ListItemIcon>
                            {dynamicItems.length > 0 ?
                                <Badge badgeContent={dynamicItems.length} color="primary">
                                    <ConfirmationNumberOutlinedIcon />
                                </Badge>
                                : <ConfirmationNumberOutlinedIcon />
                            }
                        </ListItemIcon>
                        <ListItemText primary="Prenotazioni Servizi" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {/* Mappa gli elementi dinamici ottenuti dalla fetch */}
                            {dynamicItems.map((item, index) => (
                                <ListItemButton key={index} sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                        {/*<StarBorder />*/}
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <>
                                            <span className="font-bold">Servizio:</span> {item.nomeServizio}{' '}<br />
                                            <span className="font-bold">Prodotto:</span> {item.prodotto.label}{' '}
                                            <span className="font-bold">Quantità:</span> {item.quantita}{' '}<br />
                                            <span className="font-bold">Nome:</span> {item.cognomePrenotante}{' '}
                                            {item.nomePrenotante}{' '} <br />
                                            <span className="font-bold">Telefono:</span> {item.telefono}{' '}<br />
                                            <span className="font-bold">Camera:</span> {item.camera}{' '}

                                            <br />
                                            <span className="font-bold">Date:</span> {' '}
                                            {ConvertiTimestamp(item.dataIni)} - {ConvertiTimestamp(item.dataFin)}
                                            <br />
                                            <span className="font-bold">Ora:</span> {item.ora.label}{' '}
                                            <br />
                                            <span className="font-bold">Data Gestione:</span> {ConvertiTimestampOra(item.dataGestione)}{' '}
                                        </>
                                    }
                                        secondary={
                                            <>
                                                <span className="font-bold">Richieste:</span> {item.richieste}
                                            </>
                                        }
                                    />



                                    <div className=' flex flex-row gap-3'>
                                        <TrattaServizio prenotazione={item} prodottiServizi={prodottiServizi} url={url} getPrenotazioni={fetchDynamicItems}></TrattaServizio>

                                    </div>

                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>


                    <ListItemButton onClick={handleClickSegn}>
                        <ListItemIcon>
                            {dynamicItemsSegn.length > 0 ?
                                <Badge badgeContent={dynamicItemsSegn.length} color="warning">
                                    <ReportGmailerrorredOutlinedIcon />
                                </Badge>
                                : <ReportGmailerrorredOutlinedIcon />
                            }
                        </ListItemIcon>
                        <ListItemText primary="Segnalazioni" />
                        {openSegn ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openSegn} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {/* Mappa gli elementi dinamici ottenuti dalla fetch */}
                            {dynamicItemsSegn.map((item, index) => (
                                <ListItemButton key={index} sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                        {/*<StarBorder />*/}
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <>
                                            <span className="font-bold">Mittente:</span> {item.mittente}{' '}<br />
                                            <span className="font-bold">Camera:</span> {item.camera}{' '}
                                            <span className="font-bold">Richiesta:</span> {item.problema}{' '}
                                            <br />

                                        </>
                                    }
                                        secondary={
                                            <>
                                                <span className="font-bold">Data Gestione:</span> {ConvertiTimestampOra(item.dataGestione)}{' '}
                                            </>
                                        }
                                    />


                                    <div className=' flex flex-row gap-3'>
                                        <TrattaSegnalazioni segnalazione={item} url={url}></TrattaSegnalazioni>

                                    </div>

                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>

                    <ListItemButton onClick={handleClickChiusura}>
                        <ListItemIcon>
                            {dynamicItemsChiusura.length > 0 ?
                                <Badge badgeContent={dynamicItemsChiusura.length} color="error">
                                    <EventBusyIcon />
                                </Badge>
                                : <EventBusyIcon />
                            }
                        </ListItemIcon>
                        <ListItemText primary="Disponibilità Chiusa" />
                        {openChiusura ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openChiusura} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {/* Mappa gli elementi dinamici ottenuti dalla fetch */}
                            {dynamicItemsChiusura.map((item, index) => (
                                <ListItemButton key={index} sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                        {/*<StarBorder />*/}
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <>
                                            <span className="font-bold">Servizio:</span> {item.nomeServizio}{' '}<br />
                                            <span className="font-bold">Prodotto:</span> {item.prodotto.label}{' '}
                                            <span className="font-bold">Quantità:</span> {item.quantita}{' '}<br />
                                            <span className="font-bold">Ora:</span> {item.ora.label}{' '}<br />
                                            <span className="font-bold">Date:</span> {' '}
                                            {ConvertiTimestamp(item.dataIni)} - {ConvertiTimestamp(item.dataFin)}
                                            <br />




                                        </>
                                    }
                                        secondary={
                                            <>
                                                <span className="font-bold">Data Gestione:</span> {ConvertiTimestampOra(item.dataGestione)}{' '}
                                            </>
                                        }
                                    />


                                    <div className=' flex flex-row gap-3'>
                                        <Button
                                            className=" transition-all duration-300 flex-auto focus:outline-none focus:ring bg-red-700 hover:bg-red-600 active:bg-rose-800 text-white font-bold py-1 px-2 rounded"
                                            onClick={(event) => handleClickEliminaPrenotazioneServizio(event, item.id)}>Elimina</Button>

                                    </div>

                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>



                </List>
                <List
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    component="nav"
                    aria-labelledby="processed-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="processed-list-subheader">
                            <>
                                <span className=' font-bold text-lg'>Richieste trattate</span>
                            </>

                        </ListSubheader>
                    }
                >
                    {/* Mappa gli elementi trattati */}

                    <ListItemButton onClick={handleClickProcessedCar}>
                        <ListItemIcon>
                            <DoneAllIcon className=' text-green-500' />
                        </ListItemIcon>
                        <ListItemText primary="Ordini trattati" />
                        {openProcessedCar ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openProcessedCar} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {/* Mappa gli elementi dinamici ottenuti dalla fetch */}
                            {processedItemsCar.sort((a, b) => b.dataGestione - a.dataGestione).map((item, index) => (
                                <ListItemButton key={index} sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                        {/*<StarBorder />*/}
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <>
                                            <span className="font-bold">Nome:</span> {item.anagrafica}
                                            <br />
                                            <span className="font-bold">Prodotti: </span>
                                            {item.prodotti.map((prodotto, i) => (
                                                <span key={i}>
                                                    {prodotto.Descrizione} x {prodotto.nEle} = €{prodotto.PrezzoLordo * prodotto.nEle.toFixed(2)}
                                                    <br />
                                                </span>
                                            ))}


                                            <span className="font-bold">Camera:</span> {item.camera}{' '}
                                            <br />
                                            <span className="font-bold">Data Gestione:</span> {ConvertiTimestampOra(item.dataGestione)}{' '}
                                            <br />
                                            <Button
                                                className=" transition-all duration-300 flex-auto focus:outline-none focus:ring bg-red-700 hover:bg-red-600 active:bg-rose-800 text-white font-bold py-1 px-2 rounded"
                                                onClick={() => handleClickRipristinaRoomS(item.id)}
                                            >Ripristina</Button>
                                        </>
                                    }
                                        secondary={`Stato: ${item.stato}`}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>

                    <ListItemButton onClick={handleClickProcessed}>
                        <ListItemIcon>
                            <DoneAllIcon className=' text-green-500' />
                        </ListItemIcon>
                        <ListItemText primary="Servizi trattati" />
                        {openProcessed ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openProcessed} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {/* Mappa gli elementi dinamici ottenuti dalla fetch */}
                            {processedItems.sort((a, b) => b.dataGestione - a.dataGestione).map((item, index) => (
                                <ListItemButton key={index} sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                        {/*<StarBorder />*/}
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <>
                                            <span className="font-bold">Camera:</span> {item.camera}{' '}
                                            <br />
                                            <span className="font-bold">Nome:</span> {item.cognomePrenotante}{' '}
                                            {item.nomePrenotante}
                                            <br />
                                            <span className="font-bold">Servizio:</span> {item.nomeServizio}{' '}
                                            <br />
                                            <span className="font-bold">Date:</span> {' '}
                                            {ConvertiTimestamp(item.dataIni)} - {ConvertiTimestamp(item.dataFin)}
                                            <br />
                                            <span className="font-bold">Data Gestione:</span> {ConvertiTimestampOra(item.dataGestione)}{' '}
                                            <br />
                                            <Button
                                                className=" transition-all duration-300 flex-auto focus:outline-none focus:ring bg-red-700 hover:bg-red-600 active:bg-rose-800 text-white font-bold py-1 px-2 rounded"
                                                onClick={() => handleClickRipristinaServizio(item.id)}
                                            >Ripristina</Button>
                                        </>
                                    }
                                        secondary={`Stato: ${item.stato}`}
                                    />

                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>

                    <ListItemButton onClick={handleClickProcessedSegn}>
                        <ListItemIcon>
                            <DoneAllIcon className=' text-green-500' />
                        </ListItemIcon>
                        <ListItemText primary="Segnalazioni" />
                        {openProcessedSegn ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openProcessedSegn} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {/* Mappa gli elementi dinamici ottenuti dalla fetch */}
                            {processedItemsSegn.sort((a, b) => b.dataGestione - a.dataGestione).map((item, index) => (
                                <ListItemButton key={index} sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                        {/*<StarBorder />*/}
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <>
                                            <span className="font-bold">Mittente:</span> {item.mittente}{' '}<br />
                                            <span className="font-bold">Camera:</span> {item.camera}{' '}<br />
                                            <span className="font-bold">Richiesta:</span> {item.problema}{' '}<br />
                                            <span className="font-bold">Risposta:</span> {item.risposta}{' '}<br />
                                            <span className="font-bold">Data Gestione:</span> {ConvertiTimestampOra(item.dataGestione)}{' '}
                                            <br />
                                        </>
                                    }
                                        secondary={`Stato: ${item.stato}`}
                                    />
                                </ListItemButton>
                            ))}
                        </List>
                    </Collapse>
                </List>
            </List>
        </>
    );
}
