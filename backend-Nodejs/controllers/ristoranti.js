import Ristorante from '../models/ristorante.js'
import { getFirestore } from 'firebase-admin/firestore'
import admin from 'firebase-admin'
import stringify from 'json-stringify-safe'
import { v4 as uuidv4 } from 'uuid'
import multer from "multer"

async function cercaNomeUtente(codStruttura) {
    const db = getFirestore()
    const utente = await db.collection('AppUsers').where('codStruttura', '==', codStruttura).get()
    if (!utente.empty) {
        const utenteDoc = utente.docs[0]
        const utenteData = utenteDoc.data()
        return utenteData.username
    }
}


export const getAllRistoranti = async (req, res) => {//get tutti gli utenti
    const codStruttura = req.params.cod
    let nome = await cercaNomeUtente(codStruttura)
    if (nome == null) {
        return res.json({ message: 'empty user' })
    }
    try {
        const db = getFirestore()
        let ristoranti = []
        let customerRef = db.collection("App").doc(nome).collection("Ristoranti").orderBy("posizione")
        customerRef.get().then((snapshot) => {
            snapshot.forEach(document => {
                ristoranti.push(document.data())
            })
            res.status(200).json(ristoranti)
        })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}



export const insertRistorante = async (req, res) => {//post di un utente
    const { nome, descrizione, codStruttura, immagine, linkmappa, linkmenu, posizione, lingua } = req.body

    let nomeUtente = await cercaNomeUtente(codStruttura)
    const ID = uuidv4()
    const newRistorante = new Ristorante(ID, nome, descrizione, immagine, linkmappa, linkmenu, posizione, lingua)
    const ristoranteJson = JSON.parse(stringify(newRistorante))
    

    if (nomeUtente == null) {
        return res.json({ message: 'empty user' })
    }

    try {
       
        const db = getFirestore()
        await db.collection('App').doc(nomeUtente).collection('Ristoranti').doc(ID).set(ristoranteJson)
        if (lingua == "Italiano") {
            console.log("faccio anche inglese")
            const IDinglese = uuidv4()
            const ristoranteJsonInglese = ristoranteJson
            ristoranteJsonInglese.lingua = "Inglese"
            ristoranteJsonInglese.id = IDinglese
            ristoranteJsonInglese.idPadre = ID
            await db.collection('App').doc(nomeUtente).collection('Ristoranti').doc(IDinglese).set(ristoranteJsonInglese)
        }
        res.status(201).json({ status: 'ok', message: `nuovo ristorante convenzionato ${nome} aggiunto alla lista` })
    }
    catch (error) {
        res.status(409).json({ message: error.message })
    }
}

export const uploadImage=async (req, res)=>{



}


export const updateRistorante = async (req, res) => {
    const id = req.params.id
    const { nome, descrizione, codStruttura, immagine, linkmappa, linkmenu, posizione, lingua } = req.body
    console.log(codStruttura)
    let nomeUtente = await cercaNomeUtente(codStruttura)
    if (nomeUtente == null) {
        return res.json({ message: 'empty user' })
    }



    const updateData = {
        id: id,
        nome: nome,
        descrizione: descrizione,
        immagine: immagine,
        linkmappa: linkmappa,
        linkmenu: linkmenu,
        posizione: posizione,
        lingua: lingua
    }
    const updateDataEn = {
        immagine: immagine,
        linkmappa: linkmappa,
        linkmenu: linkmenu,
        posizione: posizione,
    }
    console.log(updateData)
    console.log(nomeUtente)

    try {
        
        const db = getFirestore()
        const docRef = db.collection('App').doc(nomeUtente).collection('Ristoranti').where("id", "==", id).where("lingua", "==", lingua);

        docRef.get() // Ottenere il documento dalla query
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    throw new Error("Documento non trovato");
                }
                console.log("italiano")
                // Ottenere il primo documento dalla query
                const doc = querySnapshot.docs[0];

                // Aggiornare i dati del documento
                return doc.ref.update(updateData);
            })

        const docRefEn = db
            .collection("App")
            .doc(nomeUtente)
            .collection("Ristoranti")
            .where("idPadre", "==", id)
            .where("lingua", "==", "Inglese");



        docRefEn.get() // Ottenere il documento dalla query
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    throw new Error("Documento non trovato");
                }
                console.log("inglese")
                // Ottenere il primo documento dalla query
                const doc = querySnapshot.docs[0];

                // Aggiornare i dati del documento
                return doc.ref.update(updateDataEn);
            })

            //docRef.update(updateData)
            .then(() => {
                console.log("Documento aggiornato con successo");
                res.status(201).json({ status: 'ok', message: `Documento aggiornato con successo` })
            })
            .catch((error) => {
                console.error("Errore durante l'aggiornamento del documento:", error);
                res.json({ message: "errore durante l'aggiornamento del documento" })
            });
    }
    catch (error) {
        res.status(409).json({ message: error.message })
    }
}


export const getRistoranteById = async (req, res) => {
    const { id, codStruttura } = req.body
    let nomeUtente = await cercaNomeUtente(codStruttura)
    if (nomeUtente == null) {
        console.log(nomeUtente)
        return res.json({ message: 'empty user' })
    }

    try {
        const db = getFirestore()
        const documentRef = await db.collection('App').doc(nomeUtente).collection('Ristoranti').doc(id).get()
        if (documentRef.data() != undefined) {
            res.json(documentRef.data())
        }
        else {
            res.status(404).json({ message: "nessun ristorante con questo ID" })
        }

    } catch (error) {
        res.status(409).json({ message: `${error.message} errore` })
    }
}


export const deleteRistorante = async (req, res) => {
    const { id, codStruttura } = req.body
    console.log(`l'id è: ${id}, il codice struttura: ${codStruttura}`)
    let nomeUtente = await cercaNomeUtente(codStruttura)
    console.log(nomeUtente)
    if (nomeUtente == null) {
        return res.json({ message: 'empty user' })
    }

    try {
        const db = getFirestore()
        const documentRef = db.collection('App').doc(nomeUtente).collection('Ristoranti').doc(id)

        documentRef.delete()
            .then(() => {
                console.log('Documento eliminato con successo');
                res.status(200).json({ message: "documento eliminato" })
            })
            .catch((error) => {
                console.error('Errore durante l\'eliminazione del documento:', error);
                res.json({ message: "errore, impossibile eliminare il documento" })
            });

    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}