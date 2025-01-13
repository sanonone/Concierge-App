import Evento from '../models/evento.js'
import { getFirestore } from 'firebase-admin/firestore'
import stringify from 'json-stringify-safe'
import { v4 as uuidv4 } from 'uuid'

async function cercaNomeUtente(codStruttura) {
    const db = getFirestore()
    const utente = await db.collection('AppUsers').where('codStruttura', '==', codStruttura).get()
    if (!utente.empty) {
        const utenteDoc = utente.docs[0]
        const utenteData = utenteDoc.data()
        return utenteData.username
    }
}


export const getAllProdotti = async (req, res) => {//get tutti gli utenti
    const codStruttura = req.params.cod
    let nome = await cercaNomeUtente(codStruttura)
    if (nome == null) {
        return res.json({ message: 'empty user' })
    }
    try {
        const db = getFirestore()
        let prodotti = []
        let customerRef = db.collection("App").doc(nome).collection("Prodotti").orderBy("posizione")
        customerRef.get().then((snapshot) => {
            snapshot.forEach(document => {
                prodotti.push(document.data())
            })
            res.status(200).json(prodotti)
        })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}



export const insertProdotto = async (req, res) => {//post di un utente
    const { descrizione, descrizioneEn, codStruttura, prezzo, iva, nodo, nodoIdList, immagine, posizione } = req.body
    let nomeUtente = await cercaNomeUtente(codStruttura)
    //const ID = uuidv4()
    const ID = Date.now()
    //const ID = Math.floor(Math.random() * 1000000); // Genera un numero casuale fino a 999999
    console.log(ID)

    const newProdotto = {
        id:ID,
        descrizione:descrizione, 
        descrizioneEn:descrizioneEn,
        prezzo:parseFloat(prezzo), 
        iva:iva,  
        nodo:nodo, 
        nodoIdList: nodoIdList,
        immagine:immagine, 
        posizione:posizione, 
        
    }
    const prodottoJson = JSON.parse(stringify(newProdotto))

    if (nomeUtente == null) {
        return res.json({ message: 'empty user' })
    }

    try {
        //await newUser.save()//capisce dal modello che newUser va salvato nella collezione di mongo (users)
        console.log(`id dentro try: ${ID}`)
        const db = getFirestore()
        await db.collection('App').doc(nomeUtente).collection('Prodotti').doc(`${ID}`).set(prodottoJson)
        res.status(201).json({ status: 'ok', message: `nuovo prodotto ${descrizione} aggiunto alla lista` })


    }
    catch (error) {
        console.log(`errore durante la creazione prodotto: ${error}`)
        res.status(409).json({ message: error.message })
    }
}


export const updateProdotto = async (req, res) => {
    const id = Number(req.params.id)
    console.log(`il tipo di id è: ${typeof(id)}`)
    const { descrizione, descrizioneEn, codStruttura, prezzo, iva, nodo, nodoIdList, immagine, posizione } = req.body
    let nomeUtente = await cercaNomeUtente(codStruttura)
    if (nomeUtente == null) {
        return res.json({ message: 'empty user' })
    }

    const updateData = {
        id: id,
        descrizione: descrizione,
        descrizioneEn: descrizioneEn,
        prezzo: parseFloat(prezzo),
        iva: iva,
        nodo: nodo,
        nodoIdList: nodoIdList,
        immagine: immagine,
        posizione: posizione
    }


    try {
        //await newUser.save()//capisce dal modello che newUser va salvato nella collezione di mongo (users)
        const db = getFirestore()
        const docRef = db.collection('App').doc(nomeUtente).collection('Prodotti').where("id", "==", id);

        docRef.get() // Ottenere il documento dalla query
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    throw new Error("Documento non trovato");
                }
                // Ottenere il primo documento dalla query
                const doc = querySnapshot.docs[0];

                // Aggiornare i dati del documento
                return doc.ref.update(updateData);
            })

            
            //docRef.update(updateData)
            .then(() => {
                console.log("Documento aggiornato con successo");
                res.status(201).json({ status: 'ok', message: `Documento aggiornato con successo` })
            })
            .catch((error) => {
                console.log("Errore durante l'aggiornamento del documento:", error);
                res.json({ message: "errore durante l'aggiornamento del documento" })
            });
    }
    catch (error) {
        console.log(`errore quindi vado nel secondo catch: ${error}`)
        res.status(409).json({ message: error.message })
    }
}

export const getProdottoById = async (req, res) => {
    const { id, codStruttura } = req.body
    let nomeUtente = await cercaNomeUtente(codStruttura)
    if (nomeUtente == null) {
        console.log(nomeUtente)
        return res.json({ message: 'empty user' })
    }

    try {
        const db = getFirestore()
        const documentRef = await db.collection('App').doc(nomeUtente).collection('Prodotti').doc(id).get()
        if (documentRef.data() != undefined) {
            res.json(documentRef.data())
        }
        else {
            res.status(404).json({ message: "nessun evento con questo ID" })
        }

    } catch (error) {
        res.status(409).json({ message: `${error.message} errore` })
    }
}


export const deleteProdotto = async (req, res) => {
    const { id, codStruttura } = req.body
    console.log(`l'id è: ${id}, il codice struttura: ${codStruttura}`)
    let nomeUtente = await cercaNomeUtente(codStruttura)
    console.log(nomeUtente)
    if (nomeUtente == null) {
        return res.json({ message: 'empty user' })
    }

    try {
        const db = getFirestore()
        const documentRef = db.collection('App').doc(nomeUtente).collection('Prodotti').doc(`${id}`)

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
        console.log(`errore durante l'eliminazione prodotto: ${error}`)
        res.status(409).json({ message: error.message })
    }

}