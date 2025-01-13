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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreaNodo(props) {
    const getAllNodi = props.getAllNodi
    const url = props.url
    const [open, setOpen] = React.useState(false);

    const [formDescrizione, setFormDescrizione] = useState("");
    
    const handleInputChangeDescrizione = (e) => {
        const { name, value } = e.target;
        setFormDescrizione(value);
        console.log(value);
    };

    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = () => {
        creaNodo()
        getAllNodi()
        setOpen(false);
    };

    const creaNodo = async () => {
        try {

            const token = sessionStorage.getItem('token');
            const codStruttura = sessionStorage.getItem('codStruttura');
            await fetch(`${url}nodiProdotti`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    descrizione: formDescrizione,
                    codStruttura: codStruttura
                    
                }), //gestire id tramite login
            }).then((response) => response.json()); //gestire eccezioni
            getAllNodi()
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

            <Button className="mr-auto mt-auto mb-3 ml-10 border-4 font-semibold text-sm"
                component="label"
                role={undefined}
                tabIndex={-1}
                startIcon={<AddIcon />} variant="outlined" color="primary" onClick={handleClickOpen}
            >Crea Nodo</Button>
            {/*<Button variant="outlined" onClick={handleClickOpen}>
        Slide in alert dialog
      </Button>*/}
            <Dialog
                fullWidth={true}
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Crea Nodo"}</DialogTitle>
                <DialogContent>

                    <TextField
                        onChange={handleInputChangeDescrizione}
                        autoFocus
                        required
                        margin="dense"
                        label="Descrizione"
                        type="text"
                        fullWidth
                        variant="standard"
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