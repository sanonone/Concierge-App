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

export default function AlertDialogSlideUtenteAdmin(props) {
    const getAllUsers = props.getAllUsers
    const url = props.url
    const [open, setOpen] = React.useState(false);

    const [formUsername, setFormUsername] = useState("");
    const [formPassword, setFormPassword] = useState("");
    const [formCodStruttura, setFormCodStruttura] = useState("");
    const [formIpStruttura, setFormIpStruttura] = useState("");
    const [formDBname, setFormDBname] = useState("");
    const [formIdAzienda, setFormIdAzienda] = useState(1);

    const handleInputChangeUsername = (e) => {
        const { name, value } = e.target;
        setFormUsername(value);
        console.log(value);
    };

    const handleInputChangePassword = (e) => {
        const { name, value } = e.target;
        setFormPassword(value);
        console.log(value);
    };

    const handleInputChangeCodStruttura = (e) => {
        const { name, value } = e.target;
        setFormCodStruttura(value);
        console.log(value);
    };

    const handleInputChangeDBname = (e) => {
        const { name, value } = e.target;
        setFormDBname(value);
        console.log(value);
    };

    const handleInputChangeIdAzienda = (e) => {
        const { name, value } = e.target;
        setFormIdAzienda(value);
        console.log(value);
    };

    const handleInputChangeIpStruttura = (e) => {
        const { name, value } = e.target;
        setFormIpStruttura(value);
        console.log(value);
    };


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = () => {
        creaUser()
        getAllUsers()
        setOpen(false);
    };

    const creaUser = async () => {
        try {

            const token = sessionStorage.getItem('token');
            await fetch(`${url}auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: formUsername,
                    password: formPassword,
                    codStruttura: formCodStruttura,
                    ipStruttura: formIpStruttura,
                    DBname: formDBname,
                    admin: true,
                    IdAzienda: formIdAzienda

                }), //gestire id tramite login
            }).then((response) => response.json()); //gestire eccezioni
            getAllUsers()
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

            <Button className="mr-auto mt-auto mb-3 ml-10 border-4 font-semibold"
                component="label"
                role={undefined}
                tabIndex={-1}
                startIcon={<AddIcon />} variant="outlined" color="error" onClick={handleClickOpen}
            >Nuovo Utente Admin</Button>
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
                <DialogTitle>{"Crea Utente Admin"}</DialogTitle>


                <TextField
                    onChange={handleInputChangeUsername}
                    autoFocus
                    required
                    margin="dense"
                    label="Username"
                    type="text"
                    fullWidth
                    variant="standard"
                />

                <TextField
                    onChange={handleInputChangePassword}
                    autoFocus
                    required
                    margin="dense"
                    label="Password"
                    type="text"
                    fullWidth
                    variant="standard"
                />

                <TextField
                    onChange={handleInputChangeCodStruttura}
                    autoFocus
                    required
                    margin="dense"
                    label="Codice Struttura"
                    type="text"
                    fullWidth
                    variant="standard"
                />

                <TextField
                    onChange={handleInputChangeIpStruttura}
                    autoFocus
                    required
                    margin="dense"
                    label="Ip Struttura"
                    type="text"
                    fullWidth
                    variant="standard"
                />

                <TextField
                    onChange={handleInputChangeDBname}
                    autoFocus
                    required
                    margin="dense"
                    label="DB Name"
                    type="text"
                    fullWidth
                    variant="standard"
                />

                <TextField
                    onChange={handleInputChangeIdAzienda}
                    autoFocus
                    required
                    margin="dense"
                    label="Id Azienda"
                    type="number"
                    fullWidth
                    variant="standard"
                />


                {/*
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        ciaooo
                    </DialogContentText>
                </DialogContent>
                */}
                <DialogActions>
                    <Button onClick={handleClose}>Annulla</Button>
                    <Button onClick={handleClick}>Avanti</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}