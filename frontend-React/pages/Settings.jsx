import Navbar from "../components/NavbarResponcive"
import Footer from "../components/Footer"
import Switch from '@mui/material/Switch';
import { useState, useEffect, useLayoutEffect } from "react";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ScrollToTopButton from '../components/ScrollToTopButton';
import PrivateRoutes from "../components/PrivateRoutes";


function Settings(props) {
    const url = props.url
    const codStruttura = sessionStorage.getItem("codStruttura");
    const [homeCard, setHomeCard] = useState("");
    const [settings, setSettings] = useState("");
    const [idStripe, setIdStripe] = useState("");
    const token = sessionStorage.getItem('token');

    //stripe
    const [accountCreatePending, setAccountCreatePending] = useState(false);
    const [connectedAccountId, setConnectedAccountId] = useState();
    const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);
    const [error, setError] = useState(false);

    const [open, setOpen] = React.useState(false);//snackbar bar update card
    const [word, setWord] = React.useState();//snackbar bar update card
    const [statoAlert, setStatoAlert] = React.useState();
    const handleClose = (event, reason) => {

        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const [attivaOspiti, setAttivaOspiti] = useState(true);
    const handleInputChangeAttivaOspiti = () => {
        setAttivaOspiti(!attivaOspiti);
        console.log(`scelta della checkbox ${attivaOspiti}`);
    };

    const [colorBar, setColorBar] = useState('#ffffff'); // Inizializza il colore a rosso pieno
    const handleColorChangeBar = (event) => {
        setColorBar(event.target.value); // Aggiorna il colore selezionato dall'utente
    };

    const [colorIconBar, setColorIconBar] = useState('#0000ff');
    const handleColorChangeIconBar = (event) => {
        setColorIconBar(event.target.value);
        console.log(event.target.value)
    }

    const [colorTitleCard, setColorTitleCard] = useState('#000000');
    const handleColorTitleCard = (event) => {
        setColorTitleCard(event.target.value);
    }

    const [colorDescrizioneCard, setColoreDescrizioneCard] = useState('#000000');
    const handleColorDescrizioneCard = (event) => {
        setColoreDescrizioneCard(event.target.value);
    }

    const [colorIconCard, setColorIconCard] = useState('#000000');
    const handleColorIconCard = (event) => {
        setColorIconCard(event.target.value);
    }

    const [colorButtonPrenotazione, setColorButtonPrenotazione] = useState('#000000');
    const handleColorButtonPrenotazione = (event) => {
        setColorButtonPrenotazione(event.target.value);
    }

    const [linkIcon, setLinkIcon] = useState('');
    const handleChangeLinkIcon = (event) => {
        const { name, value } = event.target;
        setLinkIcon(value);
    };

    const [linkMeteo, setLinkMeteo] = useState('');
    const handleChangeLinkMeteo = (event) => {
        setLinkMeteo(event.target.value);
    }

    const [iconApp, setIconApp] = useState('');
    const handleIconApp = (event) => {
        setIconApp(event.target.value);
    }

    const [sfondoApp, setSfondoApp] = useState('');
    const handleSfondoApp = (event) => {
        setSfondoApp(event.target.value);
    }

    const [attivaHotel, setAttivaHotel] = useState("");
    const handleInputChangeAttivaHotel = () => {
        setAttivaHotel(!attivaHotel);
        console.log(`scelta della checkbox ${attivaHotel}`);
    };
    const [sfondoHotel, setSfondoHotel] = useState('');
    const handleChangeSfondoHotel = (event) => {
        setSfondoHotel(event.target.value);
    }
    const [colorHotel, setColorHotel] = useState('');
    const handleChangeColorHotel = (event) => {
        setColorHotel(event.target.value);
    }
    const [posizioneHotel, setPosizioneHotel] = useState('');
    const handleChangePosizioneHotel = (event) => {

        setPosizioneHotel(parseInt(event.target.value, 10));
    }

    const [attivaEventi, setAttivaEventi] = useState("");
    const handleInputChangeAttivaEventi = () => {
        setAttivaEventi(!attivaEventi);
        console.log(`scelta della checkbox ${attivaEventi}`);
    };
    const [sfondoEventi, setSfondoEventi] = useState('');
    const handleChangeSfondoEventi = (event) => {
        setSfondoEventi(event.target.value);
    }
    const [colorEventi, setColorEventi] = useState('');
    const handleChangeColorEventi = (event) => {
        setColorEventi(event.target.value);
    }
    const [posizioneEventi, setPosizioneEventi] = useState('');
    const handleChangePosizioneEventi = (event) => {
        setPosizioneEventi(parseInt(event.target.value, 10));
    }

    const [attivaVisita, setAttivaVisita] = useState("");
    const handleInputChangeAttivaVisita = () => {
        setAttivaVisita(!attivaVisita);
        console.log(`scelta della checkbox ${attivaVisita}`);
    };
    const [sfondoVisita, setSfondoVisita] = useState('');
    const handleChangeSfondoVisita = (event) => {
        setSfondoVisita(event.target.value);
    }
    const [colorVisita, setColorVisita] = useState('');
    const handleChangeColorVisita = (event) => {
        setColorVisita(event.target.value);
    }
    const [posizioneVisita, setPosizioneVisita] = useState('');
    const handleChangePosizioneVisita = (event) => {
        setPosizioneVisita(parseInt(event.target.value, 10));
    }

    const [attivaRistoranti, setAttivaRistoranti] = useState("");
    const handleInputChangeAttivaRistoranti = () => {
        setAttivaRistoranti(!attivaRistoranti);
        console.log(`scelta della checkbox ${attivaRistoranti}`);
    };
    const [sfondoRistoranti, setSfondoRistoranti] = useState('');
    const handleChangeSfondoRistoranti = (event) => {
        setSfondoRistoranti(event.target.value);
    }
    const [colorRistoranti, setColorRistoranti] = useState('');
    const handleChangeColorRistoranti = (event) => {
        setColorRistoranti(event.target.value);
    }
    const [posizioneRistoranti, setPosizioneRistoranti] = useState('');
    const handleChangePosizioneRistoranti = (event) => {
        setPosizioneRistoranti(parseInt(event.target.value, 10));
    }

    const [attivaServizi, setAttivaServizi] = useState("");
    const handleInputChangeAttivaServizi = () => {
        setAttivaServizi(!attivaServizi);
        console.log(`scelta della checkbox ${attivaServizi}`);
    };
    const [sfondoServizi, setSfondoServizi] = useState('');
    const handleChangeSfondoServizi = (event) => {
        setSfondoServizi(event.target.value);
    }
    const [colorServizi, setColorServizi] = useState('');
    const handleChangeColorServizi = (event) => {
        setColorServizi(event.target.value);
    }
    const [posizioneServizi, setPosizioneServizi] = useState('');
    const handleChangePosizioneServizi = (event) => {
        setPosizioneServizi(parseInt(event.target.value, 10));
    }

    const [attivaRoomS, setAttivaRoomS] = useState("");
    const handleInputChangeAttivaRoomS = () => {
        setAttivaRoomS(!attivaRoomS);
        console.log(`scelta della checkbox ${attivaRoomS}`);
    };
    const [sfondoRoomS, setSfondoRoomS] = useState('');
    const handleChangeSfondoRoomS = (event) => {
        setSfondoRoomS(event.target.value);
    }
    const [colorRoomS, setColorRoomS] = useState('');
    const handleChangeColorRoomS = (event) => {
        setColorRoomS(event.target.value);
    }
    const [posizioneRoomS, setPosizioneRoomS] = useState('');
    const handleChangePosizioneRoomS = (event) => {
        setPosizioneRoomS(parseInt(event.target.value, 10));
    }


    const [dafascia, setdaFascia] = useState('');
    const handleChangedaFascia = (e) => {
        const { value } = e.target
        console.log(value)
        setdaFascia(value)
    }
    const [afascia, setaFascia] = useState('');
    const handleChangeaFascia = (e) => {
        const { value } = e.target
        console.log(value)
        setaFascia(value)
    }

    const [dafascia2, setdaFascia2] = useState('');
    const handleChangedaFascia2 = (e) => {
        const { value } = e.target
        console.log(value)
        setdaFascia2(value)
    }
    const [afascia2, setaFascia2] = useState('');
    const handleChangeaFascia2 = (e) => {
        const { value } = e.target
        console.log(value)
        setaFascia2(value)
    }

    const [dafascia3, setdaFascia3] = useState('');
    const handleChangedaFascia3 = (e) => {
        const { value } = e.target
        console.log(value)
        setdaFascia3(value)
    }
    const [afascia3, setaFascia3] = useState('');
    const handleChangeaFascia3 = (e) => {
        const { value } = e.target
        console.log(value)
        setaFascia3(value)
    }

    //gestione upload immagine
    const [ID, setID] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [imgURL, setImgURL] = useState('')

    const handleFileLogoChange = (event) => {
        console.log(event.target.files[0])
        console.log(typeof (event.target.files[0]))
        //setSelectedFile(event.target.files[0]);
        //setID("Logo")
        console.log("prima di funzione")
        postImg("Logo", event.target.files[0])
        setLinkIcon(imgURL)

    };

    const handleFileLogoAppChange = (event) => {
        console.log(event.target.files[0])
        console.log(typeof (event.target.files[0]))
        //setSelectedFile(event.target.files[0]);
        //setID("Logo")
        console.log("prima di funzione")
        postImg("LogoApp", event.target.files[0])
        setIconApp(imgURL)

    };

    const handleFileSfondoAppChange = (event) => {
        console.log(event.target.files[0])
        console.log(typeof (event.target.files[0]))
        //setSelectedFile(event.target.files[0]);
        //setID("Logo")
        console.log("prima di funzione")
        postImg("SfondoApp", event.target.files[0])
        setSfondoApp(imgURL)

    };

    const handleFileImgHotelChange = (event) => {
        console.log(event.target.files[0])
        console.log(typeof (event.target.files[0]))
        //setSelectedFile(event.target.files[0]);
        //setID("Logo")
        console.log("prima di funzione")
        postImg("ImgHotel", event.target.files[0])
        setSfondoHotel(imgURL)

    };

    const handleFileImgEventiChange = (event) => {
        console.log(event.target.files[0])
        console.log(typeof (event.target.files[0]))
        //setSelectedFile(event.target.files[0]);
        //setID("Logo")
        console.log("prima di funzione")
        postImg("ImgEventi", event.target.files[0])
        setSfondoEventi(imgURL)

    };

    const handleFileImgVisitaChange = (event) => {
        console.log(event.target.files[0])
        console.log(typeof (event.target.files[0]))
        //setSelectedFile(event.target.files[0]);
        //setID("Logo")
        console.log("prima di funzione")
        postImg("ImgVisita", event.target.files[0])
        setSfondoVisita(imgURL)

    };

    const handleFileImgRistorantiChange = (event) => {
        console.log(event.target.files[0])
        console.log(typeof (event.target.files[0]))
        //setSelectedFile(event.target.files[0]);
        //setID("Logo")
        console.log("prima di funzione")
        postImg("ImgRistoranti", event.target.files[0])
        setSfondoRistoranti(imgURL)

    };

    const handleFileImgServiziChange = (event) => {
        console.log(event.target.files[0])
        console.log(typeof (event.target.files[0]))
        //setSelectedFile(event.target.files[0]);
        //setID("Logo")
        console.log("prima di funzione")
        postImg("ImgServizi", event.target.files[0])
        setSfondoServizi(imgURL)

    };

    const handleFileImgRoomSChange = (event) => {

        console.log(event.target.files[0])
        console.log(typeof (event.target.files[0]))
        //setSelectedFile(event.target.files[0]);
        //setID("Logo")
        console.log("prima di funzione")
        postImg("ImgRoomS", event.target.files[0])
        setSfondoRoomS(imgURL)

    };


    //versione dati grezzi
    const postImg = async (ID, selectedFile) => {
        try {
            console.log("postImg");
            console.log(`file: ${selectedFile}`);
            console.log(`folder: ${codStruttura}`);
            console.log(`id: ${ID}`);
            console.log(`content type: ${selectedFile.type}`);

            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result;

                const payload = {
                    image: base64Image,
                    folder: codStruttura,
                    id: ID,
                };

                const token = sessionStorage.getItem('token');
                const res = await fetch(`${url}upload/`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (res.ok) {
                    const data = await res.json();
                    // Accedi al campo imageUrl e stampalo
                    console.log(data.imageUrl);
                    setImgURL(data.imageUrl);

                    switch (ID) {
                        case "Logo":
                            setLinkIcon(data.imageUrl);
                            break;
                        case "LogoApp":
                            setIconApp(data.imageUrl);
                            break;
                        case "SfondoApp":
                            setSfondoApp(data.imageUrl);
                            break;
                        case "ImgHotel":
                            setSfondoHotel(data.imageUrl);
                            break;
                        case "ImgEventi":
                            setSfondoEventi(data.imageUrl);
                            break;
                        case "ImgVisita":
                            setSfondoVisita(data.imageUrl);
                            break;
                        case "ImgRistoranti":
                            setSfondoRistoranti(data.imageUrl);
                            break;
                        case "ImgServizi":
                            setSfondoServizi(data.imageUrl);
                            break;
                        case "ImgRoomS":
                            setSfondoRoomS(data.imageUrl);
                            break;
                        default:
                            break;
                    }

                    setWord("Immagine caricata correttamente");
                    setStatoAlert("success");
                    setOpen(true);
                } else {
                    throw new Error('Failed to upload image');
                }
            };

            reader.readAsDataURL(selectedFile);
        } catch (error) {
            console.error(error);
            setStatoAlert("error");
            setWord("Errore durante l'upload dell'immagine");
            setOpen(true);
        }
    };




    /*
    //versione post con multer e formdata
        const postImg = async (ID, selectedFile) => {
            try {
                console.log("postImg")
                console.log(`file: ${selectedFile}`)
                console.log(`folder: ${codStruttura}`)
                console.log(`id: ${ID}`)
                console.log(`content type: ${selectedFile.type}`)
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('folder', codStruttura); // Passa il nome della cartella nel campo di testo
                formData.append('id', ID)
    
    
                const token = sessionStorage.getItem('token');
                const res = await fetch(`${url}upload/`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'folder': codStruttura,
                        'id': ID,
                        'type': selectedFile.type,
                    },
                    body: formData,
                });
                if (res.ok) {
                    const data = await res.json();
                    // Accedi al campo imageUrl e stampalo
                    console.log(data.imageUrl);
                    setImgURL(data.imageUrl)
                    //setLinkIcon(data.imageUrl)
                    //getEventi();
    
                    switch (ID) {
    
                        case "Logo":
                            setLinkIcon(data.imageUrl)
                            break;
                        case "LogoApp":
                            setIconApp(data.imageUrl)
                            break;
                        case "SfondoApp":
                            setSfondoApp(data.imageUrl)
                            break;
                        case "ImgHotel":
                            setSfondoHotel(data.imageUrl)
                            break;
                        case "ImgEventi":
                            setSfondoEventi(data.imageUrl)
                            break;
                        case "ImgVisita":
                            setSfondoVisita(data.imageUrl)
                            break;
                        case "ImgRistoranti":
                            setSfondoRistoranti(data.imageUrl)
                            break;
                        case "ImgServizi":
                            setSfondoServizi(data.imageUrl)
                            break;
                        case "ImgRoomS":
                            setSfondoRoomS(data.imageUrl)
                            break;
                        default:
                            break;
                    }
    
                    setWord("Immagine caricata correttamente")
                    setStatoAlert("success")
                    setOpen(true);
    
                }
            } catch (error) {
                setStatoAlert("error")
                setWord("Errore durante l'upload dell'immagine")
                setOpen(true);
            }
    
    
        }
    */

    const deleteImg = async () => {
        try {
            deleteImg();
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('folder', codStruttura); // Passa il nome della cartella nel campo di testo
            formData.append('id', ID)


            const token = sessionStorage.getItem('token');
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
                //getEventi();
                setWord("Immagine eliminata correttamente")
                setStatoAlert("success")
                setOpen(true);
            }
        } catch (error) {
            setStatoAlert("error")
            setWord("Errore durante l'eliminazione dell'immagine")
            setOpen(true);
        }


    }





    const modificaGenerali = async () => {
        try {
            console.log("modifico")
            const token = sessionStorage.getItem('token');
            const codStruttura = sessionStorage.getItem("codStruttura");
            await fetch(`${url}appHomeCard/updateSettings/${codStruttura}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    colorDescrizioneCard: colorDescrizioneCard,
                    colorBar: colorBar,
                    colorTitleCard: colorTitleCard,
                    orario: { ini: dafascia, fin: afascia },
                    orario2: { ini: dafascia2, fin: afascia2 },
                    orario3: { ini: dafascia3, fin: afascia3 },
                    iconApp: iconApp,
                    linkMeteo: linkMeteo,
                    colorIconBar: colorIconBar,
                    colorIconCard: colorIconCard,
                    colorButtonPrenotazione: colorButtonPrenotazione,
                    linkIcon: linkIcon,
                    sfondoApp: sfondoApp,
                    ospiti: attivaOspiti,
                }),
            });

            for (let i = 0; i < homeCard.length; i++) {
                let ele = homeCard[i]

                switch (ele.id) {
                    case "Hotel":
                        modificaAppHomeCard(sfondoHotel, posizioneHotel, "Hotel", "Hotel", colorHotel, attivaHotel)
                        break;

                    case "Eventi":
                        modificaAppHomeCard(sfondoEventi, posizioneEventi, "Eventi", "Eventi", colorEventi, attivaEventi)
                        break;

                    case "RoomS":
                        console.log(attivaRoomS)
                        modificaAppHomeCard(sfondoRoomS, posizioneRoomS, "Servizio in Camera", "RoomS", colorRoomS, attivaRoomS)
                        break;

                    case "Servizi":
                        modificaAppHomeCard(sfondoServizi, posizioneServizi, "Servizi", "Servizi", colorServizi, attivaServizi)
                        break;

                    case "Ristoranti":
                        modificaAppHomeCard(sfondoRistoranti, posizioneRistoranti, "Ristoranti Convenzionati", "Ristoranti", colorRistoranti, attivaRistoranti)
                        break;

                    case "Visita":
                        modificaAppHomeCard(sfondoVisita, posizioneVisita, "Da Visitare", "Visita", colorVisita, attivaVisita)
                        break;


                    default:
                        break;
                }


            }

            // Attendere la risposta non è più necessario quando usi l'async/await.
            setStatoAlert("success")
            setWord("Modificato")
            setOpen(true);
        } catch (errore) {
            console.error("Errore nella richiesta di modifica:", errore);
            // Gestisci l'errore come desideri
            setStatoAlert("error")
            setWord("Errore durante la modifica")
            setOpen(true);
        }
    };

    const modificaAppHomeCard = async (sfondo, posizione, nome, id, colore, attivo) => {
        try {
            console.log("modifico")
            const token = sessionStorage.getItem('token');
            const codStruttura = sessionStorage.getItem("codStruttura");

            await fetch(`${url}appHomeCard/updateAppHomeCard/${codStruttura}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    sfondo: sfondo,
                    posizione: posizione,
                    nome: nome,
                    id: id,
                    colore: colore,
                    attivo: attivo,
                }),
            });

        } catch (error) {
            console.error("Errore nella richiesta di modifica:", error);
        }
    }
    const updateUserIdStripe = async (accountId) => {
        
        try {
            console.log("ggiorno id stripe in firestore")
          const IdUser = sessionStorage.getItem("IdUser");
          const token = sessionStorage.getItem('token');
          await fetch(`${url}auth/updateUserIdStripe/${IdUser}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              idStripe: accountId
            }),
          });
    
          
        } catch (errore) {
          console.error("Errore nella richiesta di modifica:", errore);
          
        }
      };

    useLayoutEffect(() => {
        // Codice che deve essere eseguito prima del rendering della pagina
        try {

            const token = sessionStorage.getItem('token');
            const codStruttura = sessionStorage.getItem("codStruttura");
            const IdUser = sessionStorage.getItem("IdUser");

            // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
            const requestOptions = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            //const url = `http://localhost:3000/hotel/${codStruttura}`

            fetch(`${url}auth/getUserByID/${IdUser}`, requestOptions)
                .then((response) => response.json())
                .then((user) => {
                    setIdStripe(user.idStripe)
                });

            fetch(`${url}appHomeCard/settings/${codStruttura}`, requestOptions)
                .then((response) => response.json())
                .then((disp) => {
                    setSettings(disp);
                    console.log(disp);
                    setColorBar(disp[0].colorBar);
                    setColoreDescrizioneCard(disp[0].colorDescrizioneCard);
                    setColorIconBar(disp[0].colorIconBar);
                    setColorIconCard(disp[0].colorIconCard);
                    setColorButtonPrenotazione(disp[0].colorButtonPrenotazione)
                    setColorTitleCard(disp[0].colorTitleCard);
                    setIconApp(disp[0].iconApp);
                    setLinkIcon(disp[0].linkIcon);
                    setLinkMeteo(disp[0].linkMeteo);
                    setdaFascia(disp[0].orario.ini)
                    setaFascia(disp[0].orario.fin)
                    setdaFascia2(disp[0].orario2.ini)
                    setaFascia2(disp[0].orario2.fin)
                    setdaFascia3(disp[0].orario3.ini)
                    setaFascia3(disp[0].orario3.fin)
                    setSfondoApp(disp[0].sfondoApp)
                    setAttivaOspiti(disp[0].ospiti)
                });

            fetch(`${url}appHomeCard/${codStruttura}`, requestOptions)
                .then((response) => response.json())
                .then((disp) => {
                    console.log(disp);
                    setHomeCard(disp);
                    console.log(disp.length)

                    for (let i = 0; i < disp.length; i++) {
                        switch (disp[i].id) {
                            case 'Hotel':
                                setSfondoHotel(disp[i].sfondo);
                                setColorHotel(disp[i].colore);
                                setPosizioneHotel(disp[i].posizione);
                                setAttivaHotel(disp[i].attivo)
                                break;

                            case 'Eventi':
                                setSfondoEventi(disp[i].sfondo);
                                setColorEventi(disp[i].colore);
                                setPosizioneEventi(disp[i].posizione);
                                setAttivaEventi(disp[i].attivo)
                                break;

                            case 'Visita':
                                setSfondoVisita(disp[i].sfondo);
                                setColorVisita(disp[i].colore);
                                setPosizioneVisita(disp[i].posizione);
                                setAttivaVisita(disp[i].attivo)
                                break;

                            case 'Ristoranti':
                                setSfondoRistoranti(disp[i].sfondo);
                                setColorRistoranti(disp[i].colore);
                                setPosizioneRistoranti(disp[i].posizione);
                                setAttivaRistoranti(disp[i].attivo)
                                break;

                            case 'Servizi':
                                setSfondoServizi(disp[i].sfondo);
                                setColorServizi(disp[i].colore);
                                setPosizioneServizi(disp[i].posizione);
                                setAttivaServizi(disp[i].attivo)
                                break;

                            case 'RoomS':
                                setSfondoRoomS(disp[i].sfondo);
                                setColorRoomS(disp[i].colore);
                                setPosizioneRoomS(disp[i].posizione);
                                setAttivaRoomS(disp[i].attivo)
                                break;
                        }
                    }
                });
        }
        catch (error) {
            console.log(`errore:${error}`)
        }

    }, []);

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <PrivateRoutes></PrivateRoutes>
                <Snackbar
                    open={open}
                    autoHideDuration={2000}
                    onClose={handleClose}
                >
                    <Alert
                        onClose={handleClose}
                        severity={statoAlert}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {word}
                    </Alert>
                </Snackbar>
                <Navbar tab="settings"></Navbar>
                <main className="flex-grow">
                    <div className=" h-auto mt-16 flex flex-row">
                        <h1 className=" text-sky-900 text-4xl font-bold p-6">Impostazioni</h1>
                    </div>

                    <div className="bg-gray-200 border-y-2 border-gray-300 h-max ">
                        <div>
                            <h1 className=" text-sky-700 text-2xl font-bold px-6 py-4">Generali</h1>
                        </div>

                        {/*
                        <div className=" flex flex-row px-8 gap-2">
                            <p>Logo:</p>
                            <input
                                className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
                                type="text"
                                name="nome"
                                value={linkIcon}
                                onChange={handleChangeLinkIcon}
                                placeholder="Link Icona Backoffice"
                            />
                            <Button component="label"
                                role={undefined}
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />} variant="contained" color="primary" onChange={handleFileLogoChange}>
                                Upload Immagine<VisuallyHiddenInput type="file" />
                            </Button>



                        </div>
                         */}

                        <div className=" flex md:flex-row flex-col px-8 py-2 gap-5">
                            <div className=" flex md:flex-row flex-col-2 gap-1">
                                <p>Fascia disponibilità 1:</p>

                                <input
                                    className=" w-28 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
                                    type="time"
                                    name=""
                                    id=""
                                    value={dafascia}
                                    onChange={handleChangedaFascia}
                                />
                                <input
                                    className=" w-28 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
                                    type="time"
                                    name=""
                                    id=""
                                    value={afascia}
                                    onChange={handleChangeaFascia}
                                />
                            </div>
                            <div className=" flex md:flex-row flex-col-2 gap-1">
                                <p>Fascia disponibilità 2:</p>
                                <input
                                    className=" w-28 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
                                    type="time"
                                    name=""
                                    id=""
                                    value={dafascia2}
                                    onChange={handleChangedaFascia2}
                                />
                                <input
                                    className=" w-28 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
                                    type="time"
                                    name=""
                                    id=""
                                    value={afascia2}
                                    onChange={handleChangeaFascia2}
                                />
                            </div>
                            <div className=" flex md:flex-row flex-col-2 gap-1">
                                <p>Fascia disponibilità 3:</p>
                                <input
                                    className=" w-28 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
                                    type="time"
                                    name=""
                                    id=""
                                    value={dafascia3}
                                    onChange={handleChangedaFascia3}
                                />
                                <input
                                    className=" w-28 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
                                    type="time"
                                    name=""
                                    id=""
                                    value={afascia3}
                                    onChange={handleChangeaFascia3}
                                />
                            </div>
                        </div>

                        <div className="flex flex-row px-8  gap-3">
                            <p className="">{attivaOspiti ? "Login Ospiti Attivato" : "Login Ospiti Disattivato"}</p>
                            <Switch
                                checked={attivaOspiti}
                                onChange={handleInputChangeAttivaOspiti}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </div>

                        <div className="container">


                            {idStripe == "" ?
                                <div className="content px-8">

                                    {!accountCreatePending && !connectedAccountId && (
                                        <Button
                                            variant="contained"
                                            onClick={async () => {
                                                console.log("creo account")
                                                setAccountCreatePending(true);
                                                setError(false);
                                                fetch(`${url}stripe/create-connected-account`, {
                                                    method: "POST",
                                                    headers: {
                                                        'Authorization': `Bearer ${token}`
                                                    }
                                                })
                                                    .then((response) => response.json())
                                                    .then(async (json) => {
                                                        setAccountCreatePending(false);

                                                        const { accountId, error } = json;

                                                        if (accountId) {
                                                            setConnectedAccountId(accountId);
                                                            console.log("adesso provo ad aggiornare il db")
                                                            updateUserIdStripe(accountId)
                                                            //continuo registrazione
                                                            console.log("continuo la registrazione con reindirizzamento")
                                                            setAccountLinkCreatePending(true);
                                                            setError(false);
                                                            fetch(`${url}stripe/account_link`, {
                                                                method: "POST",
                                                                headers: {
                                                                    "Content-Type": "application/json",
                                                                    'Authorization': `Bearer ${token}`
                                                                },
                                                                body: JSON.stringify({
                                                                    account: accountId,
                                                                }),
                                                            })
                                                                .then((response) => response.json())
                                                                .then((json) => {
                                                                    setAccountLinkCreatePending(false);

                                                                    const { url, error } = json;
                                                                    if (url) {
                                                                        window.location.href = url;
                                                                    }

                                                                    if (error) {
                                                                        setError(true);
                                                                    }
                                                                });
                                                        }

                                                        if (error) {
                                                            setError(true);
                                                        }
                                                    });
                                            }}
                                        >
                                            Crea account Stripe
                                        </Button>
                                    )}
                                    {connectedAccountId && !accountLinkCreatePending && (
                                        <Button
                                            variant="contained"
                                            onClick={async () => {
                                                setAccountLinkCreatePending(true);
                                                setError(false);
                                                fetch(`${url}account_link`, {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({
                                                        account: connectedAccountId,
                                                    }),
                                                })
                                                    .then((response) => response.json())
                                                    .then((json) => {
                                                        setAccountLinkCreatePending(false);

                                                        const { url, error } = json;
                                                        if (url) {
                                                            window.location.href = url;
                                                        }

                                                        if (error) {
                                                            setError(true);
                                                        }
                                                    });
                                            }}
                                        >
                                            Completa la registrazione
                                        </Button>
                                    )}
                                    {error && <p className="error">Something went wrong!</p>}
                                    {(connectedAccountId || accountCreatePending || accountLinkCreatePending) && (
                                        <div className="dev-callout">
                                            {connectedAccountId && <p>Your connected account ID is: <code className="bold">{connectedAccountId}</code></p>}
                                            {accountCreatePending && <p>Creating a connected account...</p>}
                                            {accountLinkCreatePending && <p>Creating a new Account Link...</p>}
                                        </div>
                                    )}

                                </div> :

                                <div>
                                    <h3 className=" px-8"> Id Account Stripe: ${idStripe}</h3>
                                </div>
                            }

                        </div>




                        <div>
                            <h1 className=" text-sky-700 text-2xl font-bold px-6 py-4">Settings Mobile App</h1>
                        </div>

                        <div className=" grid xl:grid-cols-2 grid-cols-1 justify-between items-center gap-3">
                            <div className=" flex flex-col gap-3">
                                <div className=" flex flex-row pl-8 gap-3">
                                    <p className=" pr-7">Logo App:</p>
                                    <div className=" flex md:flex-row flex-col gap-1">
                                        <input
                                            className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
                                            type="text"
                                            name="nome"
                                            value={iconApp}
                                            onChange={handleIconApp}
                                            placeholder="Link"
                                        />
                                        <Button component="label"
                                            role={undefined}
                                            tabIndex={-1}
                                            startIcon={<CloudUploadIcon />} variant="contained" color="primary" onChange={handleFileLogoAppChange}>
                                            Upload Immagine<VisuallyHiddenInput type="file" />
                                        </Button>
                                    </div>
                                </div>

                                <div className=" flex flex-row px-8 gap-3">
                                    <p className=" pr-3">Sfondo App: </p>
                                    <div className=" flex md:flex-row flex-col gap-1">
                                        <input
                                            className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
                                            type="text"
                                            name="nome"
                                            value={sfondoApp}
                                            onChange={handleSfondoApp}
                                            placeholder="Link"
                                        />
                                        <Button component="label"
                                            role={undefined}
                                            tabIndex={-1}
                                            startIcon={<CloudUploadIcon />} variant="contained" color="primary" onChange={handleFileSfondoAppChange}>
                                            Upload Immagine<VisuallyHiddenInput type="file" />
                                        </Button>
                                    </div>
                                </div>
                                <div className=" flex flex-row px-8 gap-3">
                                    <p className=" pr-11">Appbar:</p>
                                    <input
                                        className=" flex flex-row w-48"
                                        type="color"
                                        value={colorBar}
                                        onChange={handleColorChangeBar}
                                    />
                                </div>

                                <div className=" flex flex-row px-8 gap-3">
                                    <p>Icone AppBar:</p>
                                    <input
                                        className=" flex flex-row w-48"
                                        type="color"
                                        value={colorIconBar}
                                        onChange={handleColorChangeIconBar}
                                    />
                                </div>


                                <div className=" flex flex-row px-8 gap-3">
                                    <p className=" pr-4">Link meteo:</p>
                                    <input
                                        className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
                                        type="text"
                                        name="nome"
                                        value={linkMeteo}
                                        onChange={handleChangeLinkMeteo}
                                        placeholder="Link"
                                    />
                                </div>
                            </div>
                            <div className=" flex flex-col gap-3">
                                <div className=" flex flex-row px-8 gap-3 ">
                                    <p className=" pr-10">Titolo Card (Hotel, Eventi ecc):</p>
                                    <input
                                        className=" flex flex-row w-48"
                                        type="color"
                                        value={colorTitleCard}
                                        onChange={handleColorTitleCard}
                                    />
                                </div>
                                <div className=" flex flex-row px-8 gap-3">
                                    <p>Descrizione Card (Hotel, Eventi ecc):</p>
                                    <input
                                        className=" flex flex-row w-48"
                                        type="color"
                                        value={colorDescrizioneCard}
                                        onChange={handleColorDescrizioneCard}
                                    />
                                </div>
                                <div className=" flex flex-row px-8 gap-3">
                                    <p>Icone Card:</p>
                                    <input
                                        className=" flex flex-row w-48"
                                        type="color"
                                        value={colorIconCard}
                                        onChange={handleColorIconCard}
                                    />
                                </div>
                                <div className=" flex flex-row px-8 gap-3">
                                    <p>Pulsante Prenotazione:</p>
                                    <input
                                        className=" flex flex-row w-48"
                                        type="color"
                                        value={colorButtonPrenotazione}
                                        onChange={handleColorButtonPrenotazione}
                                    />
                                </div>


                            </div>
                        </div>


                        <div>
                            <h1 className=" text-sky-700 text-1xl font-bold px-8 py-4">Home Mobile App</h1>
                        </div>
                        <div className="pl-2">
                            <h1 className=" text-sky-700 text-1xl font-bold px-8 py-4 underline">Hotel</h1>
                            <div className="flex flex-row px-8 gap-3">
                                <p className="">{attivaHotel ? "Attivato" : "Disattivato"}</p>
                                <Switch
                                    checked={attivaHotel}
                                    onChange={handleInputChangeAttivaHotel}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </div>
                            <div className=" flex flex-row px-8 gap-3">
                                <p>Sfondo Hotel : </p>
                                <div className=" flex md:flex-row flex-col gap-1">
                                    <input
                                        className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
                                        type="text"
                                        name="nome"
                                        value={sfondoHotel}
                                        onChange={handleChangeSfondoHotel}
                                        placeholder="Link"
                                    />
                                    <Button component="label"
                                        role={undefined}
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />} variant="contained" color="primary" onChange={handleFileImgHotelChange}>
                                        Upload Immagine<VisuallyHiddenInput type="file" />
                                    </Button>
                                </div>
                            </div>
                            <div className=" flex flex-row px-8 gap-3">
                                <p>Colore Testo Hotel:</p>
                                <input
                                    className=" flex flex-row w-48"
                                    type="color"
                                    value={colorHotel}
                                    onChange={handleChangeColorHotel}
                                />
                            </div>
                            <div className=" flex flex-row px-8 gap-3 pb-6">
                                <p className="">
                                    Ordine di posizionamento:
                                </p>
                                <input
                                    className=" w-12 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
                                    type="number"
                                    name="nome"
                                    value={posizioneHotel}
                                    onChange={handleChangePosizioneHotel}
                                />
                            </div>

                            <h1 className=" text-sky-700 text-1xl font-bold px-8 py-4 underline">Eventi</h1>
                            <div className="flex flex-row px-8 gap-3">
                                <p className="">{attivaEventi ? "Attivato" : "Disattivato"}</p>
                                <Switch
                                    checked={attivaEventi}
                                    onChange={handleInputChangeAttivaEventi}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </div>
                            <div className=" flex flex-row px-8 gap-3">
                                <p>Sfondo Eventi :</p>
                                <div className=" flex md:flex-row flex-col gap-1">
                                    <input
                                        className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
                                        type="text"
                                        name="nome"
                                        value={sfondoEventi}
                                        onChange={handleChangeSfondoEventi}
                                        placeholder="Link"
                                    />
                                    <Button component="label"
                                        role={undefined}
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />} variant="contained" color="primary" onChange={handleFileImgEventiChange}>
                                        Upload Immagine<VisuallyHiddenInput type="file" />
                                    </Button>
                                </div>
                            </div>
                            <div className=" flex flex-row px-8 gap-3">
                                <p>Colore Testo Eventi:</p>
                                <input
                                    className=" flex flex-row w-48"
                                    type="color"
                                    value={colorEventi}
                                    onChange={handleChangeColorEventi}
                                />
                            </div>
                            <div className=" flex flex-row px-8 gap-3 pb-6">
                                <p className=" ">
                                    Ordine di posizionamento:
                                </p>
                                <input
                                    className=" w-12 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
                                    type="number"
                                    name="nome"
                                    value={posizioneEventi}
                                    onChange={handleChangePosizioneEventi}
                                />
                            </div>

                            <h1 className=" text-sky-700 text-1xl font-bold px-8 py-4 underline">Visita</h1>
                            <div className="flex flex-row px-8 gap-3">
                                <p className="">{attivaVisita ? "Attivato" : "Disattivato"}</p>
                                <Switch
                                    checked={attivaVisita}
                                    onChange={handleInputChangeAttivaVisita}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </div>
                            <div className=" flex flex-row px-8 gap-3">
                                <p>Sfondo Visita :</p>
                                <div className=" flex md:flex-row flex-col gap-1">
                                    <input
                                        className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
                                        type="text"
                                        name="nome"
                                        value={sfondoVisita}
                                        onChange={handleChangeSfondoVisita}
                                        placeholder="Link"
                                    />
                                    <Button component="label"
                                        role={undefined}
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />} variant="contained" color="primary" onChange={handleFileImgVisitaChange}>
                                        Upload Immagine<VisuallyHiddenInput type="file" />
                                    </Button>
                                </div>
                            </div>
                            <div className=" flex flex-row px-8 gap-3">
                                <p>Colore Testo Visita:</p>
                                <input
                                    className=" flex flex-row w-48"
                                    type="color"
                                    value={colorVisita}
                                    onChange={handleChangeColorVisita}
                                />
                            </div>
                            <div className=" flex flex-row px-8 gap-3 pb-6">
                                <p className=" ">
                                    Ordine di posizionamento:
                                </p>
                                <input
                                    className=" w-12 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
                                    type="number"
                                    name="nome"
                                    value={posizioneVisita}
                                    onChange={handleChangePosizioneVisita}
                                />
                            </div>

                            <h1 className=" text-sky-700 text-1xl font-bold px-8 py-4 underline">Ristoranti</h1>
                            <div className="flex flex-row px-8 gap-3">
                                <p className="">{attivaRistoranti ? "Attivato" : "Disattivato"}</p>
                                <Switch
                                    checked={attivaRistoranti}
                                    onChange={handleInputChangeAttivaRistoranti}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </div>
                            <div className=" flex flex-row px-8 gap-3">
                                <p>Sfondo Ristoranti :</p>
                                <div className=" flex md:flex-row flex-col gap-1">
                                    <input
                                        className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
                                        type="text"
                                        name="nome"
                                        value={sfondoRistoranti}
                                        onChange={handleChangeSfondoRistoranti}
                                        placeholder="Link"
                                    />
                                    <Button component="label"
                                        role={undefined}
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />} variant="contained" color="primary" onChange={handleFileImgRistorantiChange}>
                                        Upload Immagine<VisuallyHiddenInput type="file" />
                                    </Button>
                                </div>
                            </div>
                            <div className=" flex flex-row px-8 gap-3">
                                <p>Colore Testo Ristoranti:</p>
                                <input
                                    className=" flex flex-row w-48"
                                    type="color"
                                    value={colorRistoranti}
                                    onChange={handleChangeColorRistoranti}
                                />
                            </div>
                            <div className=" flex flex-row px-8 gap-3 pb-6">
                                <p className=" ">
                                    Ordine di posizionamento:
                                </p>
                                <input
                                    className=" w-12 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
                                    type="number"
                                    name="nome"
                                    value={posizioneRistoranti}
                                    onChange={handleChangePosizioneRistoranti}
                                />
                            </div>

                            <h1 className=" text-sky-700 text-1xl font-bold px-8 py-4 underline">Servizi</h1>
                            <div className="flex flex-row px-8 gap-3">
                                <p className="">{attivaServizi ? "Attivato" : "Disattivato"}</p>
                                <Switch
                                    checked={attivaServizi}
                                    onChange={handleInputChangeAttivaServizi}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </div>
                            <div className=" flex flex-row px-8 gap-3">
                                <p>Sfondo Servizi :</p>
                                <div className=" flex md:flex-row flex-col gap-1">
                                    <input
                                        className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
                                        type="text"
                                        name="nome"
                                        value={sfondoServizi}
                                        onChange={handleChangeSfondoServizi}
                                        placeholder="Link"
                                    />
                                    <Button component="label"
                                        role={undefined}
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />} variant="contained" color="primary" onChange={handleFileImgServiziChange}>
                                        Upload Immagine<VisuallyHiddenInput type="file" />
                                    </Button>
                                </div>
                            </div>
                            <div className=" flex flex-row px-8 gap-3">
                                <p>Colore Testo Servizi:</p>
                                <input
                                    className=" flex flex-row w-48"
                                    type="color"
                                    value={colorServizi}
                                    onChange={handleChangeColorServizi}
                                />
                            </div>
                            <div className=" flex flex-row px-8 gap-3 pb-6">
                                <p className=" ">
                                    Ordine di posizionamento:
                                </p>
                                <input
                                    className=" w-12 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
                                    type="number"
                                    name="nome"
                                    value={posizioneServizi}
                                    onChange={handleChangePosizioneServizi}
                                />
                            </div>

                            <h1 className=" text-sky-700 text-1xl font-bold px-8 py-4 underline">Ordini</h1>
                            <div className="flex flex-row px-8 gap-3">
                                <p className="">{attivaRoomS ? "Attivato" : "Disattivato"}</p>
                                <Switch
                                    checked={attivaRoomS}
                                    onChange={handleInputChangeAttivaRoomS}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            </div>
                            <div className=" flex flex-row px-8 gap-3">
                                <p>Sfondo Ordini :</p>
                                <div className=" flex md:flex-row flex-col gap-1">
                                    <input
                                        className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
                                        type="text"
                                        name="nome"
                                        value={sfondoRoomS}
                                        onChange={handleChangeSfondoRoomS}
                                        placeholder="Link"
                                    />
                                    <Button component="label"
                                        role={undefined}
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />} variant="contained" color="primary" onChange={handleFileImgRoomSChange}>
                                        Upload Immagine<VisuallyHiddenInput type="file" />
                                    </Button>
                                </div>
                            </div>
                            <div className=" flex flex-row px-8 gap-3">
                                <p>Colore Testo Ordini:</p>
                                <input
                                    className=" flex flex-row w-48"
                                    type="color"
                                    value={colorRoomS}
                                    onChange={handleChangeColorRoomS}
                                />
                            </div>
                            <div className=" flex flex-row px-8 gap-3 pb-6">
                                <p className=" ">
                                    Ordine di posizionamento:
                                </p>
                                <input
                                    className=" w-12 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
                                    type="number"
                                    name="nome"
                                    value={posizioneRoomS}
                                    onChange={handleChangePosizioneRoomS}

                                />
                            </div>
                        </div>
                        <Button variant="contained" className=" bg-green-500 mb-36 py-3 flex flex-auto w-full " onClick={modificaGenerali}>Salva Modifiche</Button>
                    </div>
                    <ScrollToTopButton></ScrollToTopButton>
                </main>
                <Footer></Footer>
            </div>
        </>
    )

}
export default Settings;