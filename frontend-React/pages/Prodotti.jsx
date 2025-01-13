import Navbar from "../components/Navbar";
import NavbarResponcive from "../components/NavbarResponcive"
import * as React from 'react';
import { useState, useEffect } from "react";
import CardFormEventi from "../components/CardFormEventi";
import EventiCard from "../components/EventiCard";
import Footer from "../components/Footer";
import PrivateRoutes from "../components/PrivateRoutes";
import ScrollToTopButton from '../components/ScrollToTopButton';
import CreaProdotto from "../components/Prodotti/CreaProdotto";
import CreaNodo from "../components/Prodotti/CreaNodo";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ModificaProdotto from "../components/Prodotti/ModificaProdotto";


import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';


function Prodotti(props) {
    const url = props.url
    const [deleteEvento, setDeleteEvento] = useState(0);
    const codStruttura = sessionStorage.getItem("codStruttura");

    const [data, setData] = useState([]);
    const [dataCompleto, setDataCompleto] = useState([]);//prodotti completi
    const [prodottiFiltrati, setProdottiFiltrati] = useState([]);//prodotti filtrati
    const [dataCompletoNodi, setDataCompletoNodi] = useState([]);//nodi completi
    const [deleteHotel, setDeleteHotel] = useState(0);
    const [formLingua, setFormLingua] = useState("Italiano")


    const getProdotti = async () => {
        const token = sessionStorage.getItem('token');

        // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
        const requestOptions = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        fetch(`${url}prodotti/${codStruttura}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log("fatto")
                setDataCompleto(data)

            });
    };

    const getNodi = async () => {
        const token = sessionStorage.getItem('token');

        // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
        const requestOptions = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        fetch(`${url}nodiProdotti/${codStruttura}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log("fatto")
                setDataCompletoNodi(data)
            });
    };

    useEffect(() => {


        console.log("vuoto")

        console.log("aggiorno");

        const token = sessionStorage.getItem('token');

        // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
        const requestOptions = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        fetch(`${url}prodotti/${codStruttura}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log("fatto")
                setDataCompleto(data)
                setProdottiFiltrati(data)
                console.log(data);
            });



        fetch(`${url}nodiProdotti/${codStruttura}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log("fatto")
                setDataCompletoNodi(data)
            });

    }, []); //con questa dipendenza aggiorna ogni volta che count cambia, se levo dipendenze si agiorna ad ogni cambiamento


    const deleteImg = async (ID) => {
        try {

            /*
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('folder', codStruttura); // Passa il nome della cartella nel campo di testo
            formData.append('id', ID)
            */

            const token = sessionStorage.getItem('token');
            const codStruttura = sessionStorage.getItem('codStruttura');
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
                getProdotti()
                //getServizi();
                //setWord("Immagine eliminata correttamente")
                //setStatoAlert("success")
                //setOpen(true);
            }
        } catch (error) {
            //setStatoAlert("error")
            //setWord("Errore durante l'eliminazione dell'immagine")
            //setOpen(true);
        }


    }




    const handleClickEliminaProdotto = (event, id) => {
        event.preventDefault();
        console.log('elimina ' + id)
        eliminaProdotto(id)


    };

    const eliminaProdotto = async (ID) => {
        try {

            const token = sessionStorage.getItem('token');
            await fetch(`${url}prodotti/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ id: ID, codStruttura: codStruttura }), //gestire id tramite login
            }).then((response) => response.json()); //gestire eccezioni
            getProdotti()
            deleteImg(ID)

        } catch (error) {
            console.log(`errore durante l'eliminazione: ${error}`)
        }
    };


    const handleClickEliminaNodo = (event, id) => {
        event.preventDefault();
        console.log('elimina ' + id)
        eliminaNodo(id)


    };

    const eliminaNodo = async (ID) => {
        try {

            const token = sessionStorage.getItem('token');
            await fetch(`${url}nodiProdotti/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ id: ID, codStruttura: codStruttura }), //gestire id tramite login
            }).then((response) => response.json()); //gestire eccezioni
            getNodi();
            getProdotti();

        } catch (error) {
            console.log(`errore durante l'eliminazione: ${error}`)
        }
    };


    const [checked, setChecked] = useState(["tuttii"]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);

        let newChecked = []
        if (checked.includes("tuttii") || value == "tuttii") {
            newChecked = [checked];
        }
        else {
            newChecked = [...checked];
        }

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        console.log(checked)
        setChecked(newChecked);

    };


    useEffect(() => {

        if (checked.includes("tuttii")) {
            setProdottiFiltrati(dataCompleto)
        } else {
            // Funzione per filtrare i prodotti in base ai nodi selezionati
            const filteredProducts = dataCompleto.filter(product => {
                return checked.some(ele => product.nodoIdList.includes(ele));
            });
            setProdottiFiltrati(filteredProducts)
            console.log(filteredProducts)
        }
    }, [checked, dataCompleto])

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <PrivateRoutes></PrivateRoutes>
                {/*<Navbar tab="eventi"></Navbar>*/}
                <NavbarResponcive tab="prodotti"></NavbarResponcive>
                <main className="flex-grow">
                    <div className=" h-auto mt-16 flex flex-col">
                        <h1 className=" text-sky-900 text-4xl font-bold p-6">Prodotti</h1>

                    </div>
                    <CreaNodo getAllNodi={getNodi} url={url}></CreaNodo>
                    <CreaProdotto getAllProdotti={getProdotti} nodi={dataCompletoNodi} url={url}></CreaProdotto>
                    <div className=" flex sm:flex-row flex-col bg-gray-200 border-y-2 border-gray-300 h-auto justify-between gap-5">
                        <div className=" flex flex-col h-auto">

                            <div className="m-3 flex items-start flex-col bg-slate-50 rounded-md">
                                <h2 className=" text-sky-900 text-xl font-bold p-2">Nodi</h2>
                                <List sx={{ width: '100%', maxWidth: 360, maxHeight: 600, position: 'relative', overflow: 'auto', }}>

                                    <ListItem
                                        key={'tuttii'}

                                        disablePadding
                                    >
                                        <ListItemButton role={undefined} onClick={handleToggle("tuttii")} dense>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={checked.includes("tuttii")}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-labelledby': "tuttii" }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText id={"tuttii"} primary={`Tutti`} />
                                        </ListItemButton>
                                    </ListItem>

                                    {dataCompletoNodi.map((value) => {

                                        const labelId = `checkbox-list-label-${value.id}`;

                                        return (
                                            <ListItem
                                                key={value.id}
                                                secondaryAction={
                                                    <IconButton onClick={(event) => handleClickEliminaNodo(event, value.id)} edge="end" aria-label="comments">
                                                        <DeleteForeverIcon className=" text-red-500" />
                                                    </IconButton>
                                                }
                                                disablePadding
                                            >
                                                <ListItemButton role={undefined} onClick={handleToggle(value.id)} dense>
                                                    <ListItemIcon>
                                                        <Checkbox
                                                            edge="start"
                                                            checked={checked.includes(value.id)}
                                                            tabIndex={-1}
                                                            disableRipple
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText id={labelId} primary={`${value.descrizione}`} />
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                                </List>

                            </div>

                        </div>

                        <div className=" flex flex-col w-full rounded-lg bg-slate-50 items-start m-3 h-auto">
                            <h2 className=" text-sky-900 text-xl font-bold p-2">Prodotti</h2>
                            <List sx={{ width: '100%', maxHeight: 600, position: 'relative', overflow: 'auto', }}>

                                {prodottiFiltrati.map((value, index) => {
                                    return (
                                        <ListItem
                                            key={index}
                                            secondaryAction={
                                                <div className=" flex flex-row gap-4">
                                                    <ModificaProdotto getAllProdotti={getProdotti} nodi={dataCompletoNodi} prodotto={value} url={url}></ModificaProdotto>

                                                    <IconButton onClick={(event) => handleClickEliminaProdotto(event, value.id)} edge="end" aria-label="comments">
                                                        <DeleteForeverIcon className=" text-red-500" />
                                                    </IconButton>
                                                </div>


                                            }

                                        >
                                            <ListItemAvatar>
                                                <Avatar alt="Prodotto" src={value.immagine || undefined}
                                                    className=" w-16 h-16 mx-3"

                                                >{value.immagine ? null : value.descrizione.charAt(0)}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${value.descrizione}(It)  ${value.descrizioneEn}(En)`}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            sx={{ color: 'text.primary', display: 'inline' }}
                                                        >
                                                            Prezzo: {value.prezzo} Iva: {value.iva.value}
                                                        </Typography>
                                                        <br />
                                                        Nodo: {value.nodo.map((ele) => ele.label).join(' - ')} <br />
                                                        Posizione: {value.posizione}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>

                                    );
                                })}
                            </List>


                        </div>
                    </div>
                    <ScrollToTopButton></ScrollToTopButton>
                </main>
                <Footer></Footer>
            </div>
        </>
    );
}

export default Prodotti;