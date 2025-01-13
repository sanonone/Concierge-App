import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
    const getAllUsers = props.getAllUsers
    const codStruttura = props.codStruttura
    const url = props.url
    const username = props.username
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = () => {
        elimina()
        getAllUsers()
        setOpen(false);
    };

    const elimina = async () => {
        try {

            const token = sessionStorage.getItem('token');
            await fetch(`${url}auth/deleteUser/${codStruttura}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ username: username }), //gestire id tramite login
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

            <button
                className=" transition-all duration-300 flex-auto focus:outline-none focus:ring bg-red-700 hover:bg-red-600 active:bg-red-900 text-white font-bold py-1 px-2 rounded w-48"
                onClick={handleClickOpen}
            >
                Elimina
            </button>
            {/*<Button variant="outlined" onClick={handleClickOpen}>
        Slide in alert dialog
      </Button>*/}
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Eliminazione utente"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Vuoi davvero eliminare questo utente ? L'operazione sarà irreversibile
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annulla</Button>
                    <Button onClick={handleClick}>Si</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}