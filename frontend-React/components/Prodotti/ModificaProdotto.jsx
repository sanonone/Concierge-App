import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Slide from '@mui/material/Slide';
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import Select from 'react-select';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModificaProdotto(props) {
    const getAllProdotti = props.getAllProdotti
    const nodi = props.nodi
    const prodotto = props.prodotto
    const url = props.url
    const [open, setOpen] = React.useState(false);

    const [formDescrizione, setFormDescrizione] = useState(prodotto.descrizione);
    const [formDescrizioneEn, setFormDescrizioneEn] = useState(prodotto.descrizioneEn);
    const [formIva, setFormIva] = useState(prodotto.iva);
    const [formPrezzo, setFormPrezzo] = useState(prodotto.prezzo);
    const [formNodo, setFormNodo] = useState("");
    const [formImmagine, setFormImmagine] = useState(prodotto.immagine);
    const [formPosizione, setFormPosizione] = useState(prodotto.posizione);


    // Formatta i dati ottenuti dal backend nel formato richiesto da React Select
    const formattedOptions = nodi.map(item => ({
        value: item.id, // Ad esempio, utilizza l'Id del prodotto come value
        label: item.descrizione // Utilizza la descrizione come label
    }));

    const [selectedOptions, setSelectedOptions] = useState(prodotto.nodo);
    const [nodoDescrizione, setNodoDescrizione] = useState([])
    const [nodoId, setNodoId] = useState(prodotto.nodoIdList)
    const handleChange = (selected) => {
        //console.log(`${selected[0].value} ${selected[0].label}`)
        setSelectedOptions(selected);
        console.log(`lunghezza: ${selected.length}`)
        if (selected.length > 0) {
            let descrizione = []
            let id = []
            for (let ele of selected) {
                console.log(ele.label)
                descrizione.push(ele.label)
                id.push(ele.value)
            }
            setNodoDescrizione(descrizione)
            setNodoId(id)
        }
    };


    // Formatta i dati per select iva
    const formattedOptionsIva = [
        {
            value: 4, // Ad esempio, utilizza l'Id del prodotto come value
            label: "4%" // Utilizza la descrizione come label
        },
        {
            value: 10, // Ad esempio, utilizza l'Id del prodotto come value
            label: "10%" // Utilizza la descrizione come label
        },
        {
            value: 22, // Ad esempio, utilizza l'Id del prodotto come value
            label: "22%" // Utilizza la descrizione come label
        },
        {
            value: "esente", // Ad esempio, utilizza l'Id del prodotto come value
            label: "esente" // Utilizza la descrizione come label
        },
    ];

    const [selectedOptionsIva, setSelectedOptionsIva] = useState(prodotto.iva);

    const handleChangeIva = (selected) => {
        //console.log(`${selected[0].value} ${selected[0].label}`)
        setSelectedOptionsIva(selected);
        console.log(`lunghezza: ${selected.length}`)

    };



    const handleInputChangeDescrizione = (e) => {
        const { name, value } = e.target;
        setFormDescrizione(value);
        console.log(value);
    };

    const handleInputChangeDescrizioneEn = (e) => {
        const { name, value } = e.target;
        setFormDescrizioneEn(value);
        console.log(value);
    };

    const handleInputChangeIva = (e) => {
        const { name, value } = e.target;
        setFormIva(value);
        console.log(value);
    };

    const handleInputChangeNodo = (e) => {
        const { name, value } = e.target;
        setFormNodo(value);
        console.log(value);
    };

    const handleInputChangeImmagine = (e) => {
        const { name, value } = e.target;
        setFormImmagine(value);
        console.log(value);
    };

    const handleInputChangePrezzo = (e) => {
        const { name, value } = e.target;
        setFormPrezzo(value);
        console.log(value);
    };

    const handleInputChangePosizione = (e) => {
        const { name, value } = e.target;
        setFormPosizione(value);
        console.log(value);
    };


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = () => {
        modificaProdotto()
        getAllProdotti()
        setOpen(false);
    };


    //gestione upload immagine
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        console.log(event.target.files[0])
        console.log(typeof (event.target.files[0]))
        setSelectedFile(event.target.files[0]);
        postImg(event.target.files[0])
    };

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

    const postImg = async (selectedFile) => {
        try {

            /*
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('folder', codStruttura); // Passa il nome della cartella nel campo di testo
            formData.append('id', ID)
            */
            const codStruttura = sessionStorage.getItem('codStruttura');
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result;

                const payload = {
                    image: base64Image,
                    folder: codStruttura,
                    id: prodotto.id,
                };

                const token = sessionStorage.getItem('token');
                const res = await fetch(`${url}upload/`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload), //gestire id tramite login
                });
                if (res.ok) {
                    const data = await res.json();
                    // Accedi al campo imageUrl e stampalo
                    console.log(data.imageUrl);
                    setFormImmagine(data.imageUrl)
                    console.log("immagine caricata")
                    getAllProdotti()
                    //setWord("Immagine caricata correttamente")
                    //setStatoAlert("success")
                    //setOpen(true);
                }
            };
            reader.readAsDataURL(selectedFile);
        } catch (error) {
            console.log("immagine non caricata")
            //setStatoAlert("error")
            //setWord("Errore durante l'upload dell'immagine")
            //setOpen(true);
        }


    }



    const modificaProdotto = async () => {
        try {

            const token = sessionStorage.getItem('token');
            const codStruttura = sessionStorage.getItem('codStruttura');
            await fetch(`${url}prodotti/${prodotto.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    descrizione: formDescrizione,
                    descrizioneEn: formDescrizioneEn,
                    codStruttura: codStruttura,
                    prezzo: formPrezzo,
                    iva: selectedOptionsIva,
                    nodo: selectedOptions,
                    nodoIdList: nodoId,
                    immagine: formImmagine,
                    posizione: formPosizione
                }), //gestire id tramite login
            }).then((response) => response.json()); //gestire eccezioni
            getAllProdotti()
            console.log("prodotto caricato correttamente")
            //setWord("Eliminato")
            //setStatoAlert("success")
            //setOpen(true);
        } catch (error) {
            console.log(`errore: ${error}`)
            //setStatoAlert("error")
            //setWord("Errore durante l'eliminazione")
            //setOpen(true);
        }

    };




    return (
        <React.Fragment>

            <IconButton onClick={handleClickOpen} edge="end" aria-label="comments">
                <ModeEditIcon className=" text-sky-900" />
            </IconButton>

            <Dialog

                fullWidth={true}
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Modifica Prodotto"}</DialogTitle>
                <DialogContent>

                    <TextField
                        value={formDescrizione}
                        onChange={handleInputChangeDescrizione}
                        autoFocus
                        required
                        margin="dense"
                        label="Descrizione"
                        type="text"
                        fullWidth
                        variant="outlined"
                        style={{ zIndex: 1 }}
                    />

                    <TextField
                        value={formDescrizioneEn}
                        onChange={handleInputChangeDescrizioneEn}
                        autoFocus
                        required
                        margin="dense"
                        label="Descrizione Inglese"
                        type="text"
                        fullWidth
                        variant="outlined"
                        style={{ zIndex: 1 }}
                    />

                    <Select
                        isMulti={false}
                        options={formattedOptionsIva}
                        value={selectedOptionsIva}
                        onChange={handleChangeIva}
                        placeholder="Seleziona Iva"
                        onSubmit={null}
                        menuPosition="fixed"
                        styles={{
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,  // Applica direttamente il z-index al menu
                            }),
                            control: (base) => ({
                                ...base,
                                zIndex: 2,  // Imposta un z-index maggiore rispetto al TextField per il controllo
                            }),
                        }}
                    />

                    <TextField
                        value={formPrezzo}
                        onChange={handleInputChangePrezzo}
                        autoFocus
                        required
                        margin="dense"
                        label="Prezzo"
                        type="number"
                        fullWidth
                        variant="outlined"
                        style={{ zIndex: 1 }}
                    />

                    <Select
                        isMulti
                        options={formattedOptions}
                        value={selectedOptions}
                        onChange={handleChange}
                        placeholder="Seleziona nodi"
                        onSubmit={null}
                        menuPosition="fixed"
                        styles={{
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 9999,  // Applica direttamente il z-index al menu
                            }),
                            control: (base) => ({
                                ...base,
                                zIndex: 2,  // Imposta un z-index maggiore rispetto al TextField per il controllo
                            }),
                        }}
                    />

                    <TextField
                        value={formImmagine}
                        onChange={handleInputChangeImmagine}
                        autoFocus
                        required
                        margin="dense"
                        label="URL Immagine"
                        type="text"
                        fullWidth
                        variant="outlined"
                        style={{ zIndex: 1 }}
                    />
                    <Button component="label"
                        role={undefined}
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />} variant="contained" color="primary" onChange={handleFileChange}>
                        Upload Immagine<VisuallyHiddenInput type="file" />
                    </Button>

                    <TextField
                        value={formPosizione}
                        onChange={handleInputChangePosizione}
                        autoFocus
                        required
                        margin="dense"
                        label="Posizione"
                        type="number"
                        inputProps={{ min: 1, }}
                        fullWidth
                        variant="outlined"
                        style={{ zIndex: 1 }}
                    />



                    {/*<DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        ciaooo
                    </DialogContentText>
                </DialogContent>*/}
                    <DialogActions>
                        <Button onClick={handleClose}>Annulla</Button>
                        <Button onClick={handleClick}>Avanti</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}