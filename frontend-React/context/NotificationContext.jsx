// src/NotificationContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import LogoConcierge from "../assets/LogoConcierge.png";
import suonoNotifica from "../assets/suoneriaNotifica.mp3"
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebaseConfig.js";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [dynamicItems, setDynamicItems] = useState([]);
    const [dynamicItemsChiusura, setDynamicItemsChiusura] = useState([]);
    const [dynamicItemsCar, setDynamicItemsCar] = useState([]);
    const [dynamicItemsSegn, setDynamicItemsSegn] = useState([]);
    const [processedItems, setProcessedItems] = useState([]);
    const [processedItemsCar, setProcessedItemsCar] = useState([]);
    const [processedItemsSegn, setProcessedItemsSegn] = useState([]);
    const [datiTabellaServizi, setDatiTabellaServizi] = useState([]);
    const [datiTabellaProdotti, setDatiTabellaProdotti] = useState([]);
    const isFirstLoad = React.useRef(true);
    const prevDynamicItems = React.useRef([]);
    const prevDynamicItemsCar = React.useRef([]);
    const prevDynamicItemsSegn = React.useRef([]);
    const [vediBadge, setVediBadge] = useState(false)
    
    const url = "http://localhost:3000/"
    



    const noMostraBadge = () => {
        setVediBadge(false);
    };

    const mostraBadge = () => {
        setVediBadge(true);
    };

    // Funzione per mostrare la notifica
    const showNotification = (title, body) => {
        if (Notification.permission === "granted") {
            new Notification(title, {
                body,
                icon: LogoConcierge // Opzionale: specifica un'icona
            }

            );

            const audio = new Audio(suonoNotifica);
            audio.play();

        }
    };

    onMessage(messaging, (payload) => {
        console.log(`hai ricevuto una notifica onMessage: ${payload.notification.title}, ${payload.notification.body}`)
        setVediBadge(true)
        fetchDynamicItems()
    });




    useEffect(() => {
        if (prevDynamicItems.current.length > 0) {
            const nuoviElementi = dynamicItems.filter(item => !prevDynamicItems.current.some(prevItem => prevItem.id === item.id));
            if (nuoviElementi.length > 0) {
                console.log('Nuovi elementi trovati in dynamicItems:', nuoviElementi);
                // Mostra notifica per nuovi elementi
                showNotification("Servizi", "Nuove prenotazioni");
                setVediBadge(true)
            }
        }
        prevDynamicItems.current = dynamicItems;

    }, [dynamicItems]);

    useEffect(() => {
        if (prevDynamicItemsCar.current.length > 0) {
            const nuoviElementiCar = dynamicItemsCar.filter(item => !prevDynamicItemsCar.current.some(prevItem => prevItem.id === item.id));
            if (nuoviElementiCar.length > 0) {
                console.log('Nuovi elementi trovati in dynamicItemsCar:', nuoviElementiCar);
                // Mostra notifica per nuovi elementi Car
                showNotification("Servizio in Camera", "Nuove prenotazioni");
                setVediBadge(true)
            }
        }
        prevDynamicItemsCar.current = dynamicItemsCar;



    }, [dynamicItemsCar]);

    useEffect(() => {
        if (prevDynamicItemsSegn.current.length > 0) {
            const nuoviElementiSegn = dynamicItemsSegn.filter(item => !prevDynamicItemsSegn.current.some(prevItem => prevItem.id === item.id));
            if (nuoviElementiSegn.length > 0) {
                console.log('Nuovi elementi trovati in dynamicItemsSegn:', nuoviElementiSegn);
                // Mostra notifica per nuovi elementi Car
                showNotification("Segnalazioni", "Nuove segnalazioni");
                setVediBadge(true)
            }
        }
        prevDynamicItemsSegn.current = dynamicItemsSegn;
    }, [dynamicItemsSegn]);



    // Funzione per ottenere gli elementi dinamici dalla fetch
    const fetchDynamicItems = () => {
        console.log("faccio fetch in context")
        try {

            // Esempio di fetch (sostituiscilo con il tuo endpoint effettivo)
            const token = sessionStorage.getItem('token');
            const codStruttura = sessionStorage.getItem("codStruttura");

            if (!codStruttura) {
                console.warn("codStruttura non è presente nel sessionStorage");
                return; // Interrompi l'esecuzione finché codStruttura non è disponibile
            }

            if (!token) {
                console.warn("token non è presente nel sessionStorage");
                return; // Interrompi l'esecuzione finché codStruttura non è disponibile
            }


            // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
            const requestOptions = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

    

            fetch(`${url}servizi/getAllPrenotazioniServizi/${codStruttura}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log("Risposta dal server:", data); // Verifica cosa ricevi
                    const chiusure = data.filter(ele=>(ele.stato=="chiusura"))
                    const daGestire = data.filter(ele => (ele.stato == "attesa"))
                    if (isFirstLoad.current) {
                        const nuoviElementi1 = daGestire.filter(item => !prevDynamicItems.current.some(prevItem => prevItem.id === item.id));
                        if (nuoviElementi1.length > 0) {
                            console.log('Nuovi elementi trovati in dynamicItems:', nuoviElementi1);

                            // Mostra notifica per nuovi elementi
                            showNotification("Servizi", "Nuove prenotazioni");
                            setVediBadge(true)
                        }
                    }
                    setDynamicItems(daGestire); // Imposta gli elementi dinamici nello stato
                    setDynamicItemsChiusura(chiusure)
                    const gestiti = data.filter(ele => (ele.stato != "attesa" && ele.stato != "chiusura"))
                    setProcessedItems(gestiti)

                    let datiServizi = [...daGestire, ...gestiti]
                    setDatiTabellaServizi(datiServizi)
                })
                .catch(error => {
                    console.error('Errore durante il recupero degli elementi dinamici:', error);
                });


            fetch(`${url}servizi/getPrenotazioniRoomS/${codStruttura}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const daGestire = data.filter(ele => (ele.stato == "attesa" || ele.stato== "in corso"))

                    if (isFirstLoad.current) {
                        const nuoviElementi2 = daGestire.filter(item => !prevDynamicItemsCar.current.some(prevItem => prevItem.id === item.id));
                        if (nuoviElementi2.length > 0) {
                            console.log('Nuovi elementi trovati in dynamicItemsCar:', nuoviElementi2);
                            // Mostra notifica per nuovi elementi Car

                            showNotification("Servizio in Camera", "Nuove prenotazioni");
                            setVediBadge(true)
                        }
                    }
                    setDynamicItemsCar(daGestire); // Imposta gli elementi dinamici nello stato

                    const gestiti = data.filter(ele => (ele.stato != "attesa" && ele.stato != "in corso"))
                    setProcessedItemsCar(gestiti)


                    let datiProdotti = [...daGestire, ...gestiti]
                    setDatiTabellaProdotti(datiProdotti)
                    console.log(datiProdotti)

                })
                .catch(error => {
                    console.error('Errore durante il recupero degli elementi dinamici Car:', error);
                });


            fetch(`${url}messaggi/${codStruttura}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const daGestire = data.filter(ele => (ele.stato == "attesa" && ele.tipo == 's'))
                    if (isFirstLoad.current) {
                        const nuoviElementi1 = daGestire.filter(item => !prevDynamicItemsSegn.current.some(prevItem => prevItem.id === item.id));
                        if (nuoviElementi1.length > 0) {
                            console.log('Nuovi elementi trovati in dynamicItems:', nuoviElementi1);

                            // Mostra notifica per nuovi elementi
                            showNotification("Segnalazioni", "Nuove segnalazioni");
                            setVediBadge(true)
                        }
                    }
                    setDynamicItemsSegn(daGestire); // Imposta gli elementi dinamici nello stato
                    const gestiti = data.filter(ele => (ele.stato != "attesa"))
                    setProcessedItemsSegn(gestiti)
                })
                .catch(error => {
                    console.error('Errore durante il recupero degli elementi dinamici:', error);
                });


            isFirstLoad.current = false; // Dopo il primo caricamento, imposta il flag a false

        } catch (error) {
            console.log(`errore: ${error}`)
        }

    };


    useEffect(() => {
        fetchDynamicItems();

    }, []);

    useEffect(() => {
        console.log("Inizio fetch per dynamicItems");
        fetchDynamicItems();
    }, []); // Verifica che i dati vengano caricati quando il componente viene montato


    return (
        <NotificationContext.Provider value={{ dynamicItemsN: dynamicItems, dynamicItemsChiusuraN: dynamicItemsChiusura, dynamicItemsCarN: dynamicItemsCar, dynamicItemsSegnN: dynamicItemsSegn, processedItemsN: processedItems, processedItemsCarN: processedItemsCar, processedItemsSegnN: processedItemsSegn, datiTabellaServizi: datiTabellaServizi, datiTabellaProdotti: datiTabellaProdotti, noMostraBadge, vediBadge, mostraBadge, fetchDynamicItems, url }}>
            {children}
        </NotificationContext.Provider>
    );
};
