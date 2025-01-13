import { useState } from 'react'
import * as React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { v4 as uuidv4 } from 'uuid';

function CardFormVisita(props) {
    const getVisita = props.getVisita

    const [formNome, setFormNome] = useState("")
    const [formDescrizione, setFormDescrizione] = useState("")
    const [formImmagine, setFormImmagine] = useState("")
    const [formLinkMappa, setFormLinkMappa] = useState("")
    const [formPosizionamento, setFormPosizionamento] = useState(1)
    const [formLingua, setFormLingua] = useState("Italiano")
    const url = props.url
    const codStruttura = sessionStorage.getItem("codStruttura");

    const [open, setOpen] = React.useState(false);//snackbar bar update card
    const [word, setWord] = React.useState();//snackbar bar update card
    const [statoAlert, setStatoAlert] = React.useState();
    const handleClose = (event, reason) => {

        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };





    const handleInputChangeNome = (e) => {
        const { name, value } = e.target
        setFormNome(value)
        console.log(value)
    }

    const handleInputChangeDescrizione = (e) => {
        const { name, value } = e.target
        setFormDescrizione(value)
        console.log(value)
    }

    const handleInputChangeImmagine = (e) => {
        const { name, value } = e.target
        setFormImmagine(value)
        console.log(value)
    }


    const handleInputChangeLinkMappa = (e) => {
        const { name, value } = e.target
        setFormLinkMappa(value)
        console.log(value)
    }


    const handleInputChangePosizionamento = (e) => {
        const { name, value } = e.target
        setFormPosizionamento(parseInt(value, 10))
        console.log(value)
    }

    const handleInputChangeLingua = (e) => {
        const { name, value } = e.target
        setFormLingua(value)
        console.log(value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        //inviare su firebase
        console.log(`${formNome} e ${formDescrizione}`)
        //handleUpload()
        postMenu(formNome, formDescrizione, formImmagine, formLinkMappa, formPosizionamento, formLingua)

    }

    const handleInputChange = (e) => {
        const { name, value, type } = e.target
        setFormData({
            ...formData,
            [name]: inputValue
        })
    }


    
    const postMenu = async (nome, descrizione, immagine, linkmappa, posizionamento, lingua) => {
       

        try {

            const token = sessionStorage.getItem('token');
            await fetch(`${url}visita/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome: nome,
                    descrizione: descrizione,
                    codStruttura: codStruttura,
                    
                    immagine: immagine,
                    linkmappa: linkmappa,
                    posizione: posizionamento,
                    lingua: lingua
                }) //gestire id tramite login
            }).then((response) => response.json())//gestire eccezioni
            setFormNome("")
            setFormDescrizione("")
            
            setFormImmagine("")
            setFormLinkMappa("")
            setFormPosizionamento("")
            setFormLingua("Italiano")
            getVisita()
            setStatoAlert("success")
            setWord("Creato con successo")
            setOpen(true);
        } catch (error) {
            setStatoAlert("error")
            setWord("Errore durante la creazione")
            setOpen(true);
        }
    }

    return (
        <form onSubmit={handleSubmit} className=" shadow-lg shadow-slate-500/60 flex flex-col w-[350px] mb-10 bg-[rgba(51,135,184,0.8)] p-3 rounded-lg gap-5">
            {/*
            <div className="flex ">
                <label className=' border-2 border-sky-900 text-xl text-white bg-sky-600 rounded-md p-1 font-medium '>Inserisci Ristorante</label>
            </div>
            */}
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
            <div className="flex flex-col">
                <label className=' text-lg font-medium text-gray-800'>Nome</label>
                <input className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9" type="text" name="nome" value={formNome} onChange={handleInputChangeNome} />
            </div>
            <div className="flex flex-col">
                <label className=' text-lg font-medium text-gray-800'>Descrizione</label>
                <textarea className=" h-32 border-2 focus:outline-none focus:border-indigo-500 rounded-md" value={formDescrizione} onChange={handleInputChangeDescrizione} />
            </div>
            <div className="flex flex-col">
                <label className=' text-lg font-medium text-gray-800'>Immagine</label>
                <input className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9" type="text" name="nome" value={formImmagine} onChange={handleInputChangeImmagine} />
            </div>
            
            <div className="flex flex-col">
                <label className=' text-lg font-medium text-gray-800'>Link Mappa</label>
                <input className=" border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9" type="text" name="nome" value={formLinkMappa} onChange={handleInputChangeLinkMappa} />
            </div>
            
            <div className="flex flex-col">
                <div className="flex flex-row">
                    <label className=" pr-2 text-lg font-medium text-gray-800">Posizionamento:</label>
                    <input
                        className=" w-12 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
                        type="number"
                        name="nome"
                        value={formPosizionamento}
                        onChange={handleInputChangePosizionamento}
                    />
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-row">
                    <label className=" text-lg font-medium pr-2 text-gray-800">Traduzione</label>
                    <select
                        className="border-2 focus:outline-none focus:border-indigo-500 rounded-md h-6"
                        id="lingua"
                        value={formLingua}
                        onChange={handleInputChangeLingua}
                    >
                        <option value="Italiano">Italiano</option>
                        <option value="Inglese">Inglese</option>
                    </select>
                </div>
            </div>
            <button type="submit" className="transition-all duration-300 flex-auto focus:outline-none focus:ring bg-sky-900 hover:bg-sky-700 active:bg-indigo-800 text-white font-bold py-1 px-2 rounded">Crea</button>

        </form>
    )

}

export default CardFormVisita