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


export const getAllEventi = async (req, res) => {//get tutti gli utenti
    const codStruttura = req.params.cod
    let nome = await cercaNomeUtente(codStruttura)
    if (nome == null) {
        return res.json({ message: 'empty user' })
    }
    try {
        const db = getFirestore()
        let servizi = []
        let customerRef = db.collection("App").doc(nome).collection("Eventi").orderBy("posizione")
        customerRef.get().then((snapshot) => {
            snapshot.forEach(document => {
                servizi.push(document.data())
            })
            res.status(200).json(servizi)
        })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}



export const insertEvento = async (req, res) => {//post di un utente
    const { nome, descrizione, codStruttura, info, dataInizio, dataFine, immagine, posizione, lingua } = req.body
    let nomeUtente = await cercaNomeUtente(codStruttura)
    const ID = uuidv4()
    const newEvento = new Evento(ID, nome, descrizione, info, dataInizio, dataFine, immagine, posizione, lingua)
    const eventoJson = JSON.parse(stringify(newEvento))

    if (nomeUtente == null) {
        return res.json({ message: 'empty user' })
    }

    try {
        //await newUser.save()//capisce dal modello che newUser va salvato nella collezione di mongo (users)
        const db = getFirestore()
        await db.collection('App').doc(nomeUtente).collection('Eventi').doc(ID).set(eventoJson)
        if (lingua == "Italiano") {
            console.log("faccio anche inglese")
            const IDinglese = uuidv4()
            const eventoJsonInglese = eventoJson
            eventoJsonInglese.lingua = "Inglese"
            eventoJsonInglese.id = IDinglese
            eventoJsonInglese.idPadre = ID
            await db.collection('App').doc(nomeUtente).collection('Eventi').doc(IDinglese).set(eventoJsonInglese)
        }
        res.status(201).json({ status: 'ok', message: `nuovo evento ${nome} aggiunto alla lista` })


    }
    catch (error) {
        res.status(409).json({ message: error.message })
    }
}


export const updateEvento = async (req, res) => {
    const id = req.params.id
    const { nome, descrizione, codStruttura, info, dataInizio, dataFine, immagine, posizione, lingua } = req.body
    let nomeUtente = await cercaNomeUtente(codStruttura)
    if (nomeUtente == null) {
        return res.json({ message: 'empty user' })
    }

    const updateData = {
        id: id,
        nome: nome,
        descrizione: descrizione,
        info: info,
        dataInizio: dataInizio,
        dataFine: dataFine,
        immagine: immagine,
        posizione: posizione,
        lingua: lingua
    }

    const updateDataEn = {
        dataInizio: dataInizio,
        dataFine: dataFine,
        immagine: immagine,
        posizione: posizione,
    }

    try {
        //await newUser.save()//capisce dal modello che newUser va salvato nella collezione di mongo (users)
        const db = getFirestore()
        const docRef = db.collection('App').doc(nomeUtente).collection('Eventi').where("id", "==", id).where("lingua", "==", lingua);

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
            .collection("Eventi")
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
                console.log("Errore durante l'aggiornamento del documento:", error);
                res.json({ message: "errore durante l'aggiornamento del documento" })
            });
    }
    catch (error) {
        console.log(`errore quindi vado nel secondo catch: ${error}`)
        res.status(409).json({ message: error.message })
    }
}

export const getEventoById = async (req, res) => {
    const { id, codStruttura } = req.body
    let nomeUtente = await cercaNomeUtente(codStruttura)
    if (nomeUtente == null) {
        console.log(nomeUtente)
        return res.json({ message: 'empty user' })
    }

    try {
        const db = getFirestore()
        const documentRef = await db.collection('App').doc(nomeUtente).collection('Eventi').doc(id).get()
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


export const deleteEvento = async (req, res) => {
    const { id, codStruttura } = req.body
    console.log(`l'id è: ${id}, il codice struttura: ${codStruttura}`)
    let nomeUtente = await cercaNomeUtente(codStruttura)
    console.log(nomeUtente)
    if (nomeUtente == null) {
        return res.json({ message: 'empty user' })
    }

    try {
        const db = getFirestore()
        const documentRef = db.collection('App').doc(nomeUtente).collection('Eventi').doc(id)

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