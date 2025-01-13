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


export const getAllNodiProdotti = async (req, res) => {//get tutti gli utenti
    const codStruttura = req.params.cod
    let nome = await cercaNomeUtente(codStruttura)
    if (nome == null) {
        return res.json({ message: 'empty user' })
    }
    try {
        const db = getFirestore()
        let nodi = []
        let customerRef = db.collection("App").doc(nome).collection("NodiProdotti").orderBy("descrizione")
        customerRef.get().then((snapshot) => {
            snapshot.forEach(document => {
                nodi.push(document.data())
            })
            res.status(200).json(nodi)
        })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}



export const insertNodoProdotto = async (req, res) => {//post di un utente
    const { descrizione, codStruttura } = req.body
    let nomeUtente = await cercaNomeUtente(codStruttura)
    //const ID = uuidv4()
    const ID = Date.now()
    const newNodoProdotto = {
        id: ID,
        descrizione: descrizione,
    }
    const nodoProdottoJson = JSON.parse(stringify(newNodoProdotto))

    if (nomeUtente == null) {
        return res.json({ message: 'empty user' })
    }

    try {
        //await newUser.save()//capisce dal modello che newUser va salvato nella collezione di mongo (users)
        const db = getFirestore()
        await db.collection('App').doc(nomeUtente).collection('NodiProdotti').doc(`${ID}`).set(nodoProdottoJson)
        res.status(201).json({ status: 'ok', message: `nuovo nodo ${descrizione} aggiunto alla lista` })


    }
    catch (error) {
        res.status(409).json({ message: error.message })
    }
}


export const updateNodoProdotto = async (req, res) => {
    const id = req.params.id
    const { descrizione, codStruttura } = req.body
    let nomeUtente = await cercaNomeUtente(codStruttura)
    if (nomeUtente == null) {
        return res.json({ message: 'empty user' })
    }

    const updateData = {
        id: id,
        descrizione: descrizione,
    }


    try {
        //await newUser.save()//capisce dal modello che newUser va salvato nella collezione di mongo (users)
        const db = getFirestore()
        const docRef = db.collection('App').doc(nomeUtente).collection('NodiProdotti').where("id", "==", id);

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

export const getNodoProdottoById = async (req, res) => {
    const { id, codStruttura } = req.body
    let nomeUtente = await cercaNomeUtente(codStruttura)
    if (nomeUtente == null) {
        console.log(nomeUtente)
        return res.json({ message: 'empty user' })
    }

    try {
        const db = getFirestore()
        const documentRef = await db.collection('App').doc(nomeUtente).collection('NodiProdotti').doc(id).get()
        if (documentRef.data() != undefined) {
            res.json(documentRef.data())
        }
        else {
            res.status(404).json({ message: "nessun nodo con questo ID" })
        }

    } catch (error) {
        res.status(409).json({ message: `${error.message} errore` })
    }
}


export const deleteNodoProdotto = async (req, res) => {
    const { id, codStruttura } = req.body
    console.log(`l'id è: ${id}, il codice struttura: ${codStruttura}`)
    let nomeUtente = await cercaNomeUtente(codStruttura)
    console.log(nomeUtente)
    if (nomeUtente == null) {
        return res.json({ message: 'empty user' })
    }

    try {
        const db = getFirestore()
        // Riferimento al nodo da eliminare
        const nodoRef = db.collection('App').doc(nomeUtente).collection('NodiProdotti').doc(`${id}`);
        
        // Controlla se il nodo esiste
        const nodoSnap = await nodoRef.get();
        if (!nodoSnap.exists) {
            return res.status(404).json({ message: 'Nodo non trovato.' });
        }
        
        const nodoData = nodoSnap.data();

        // Query per trovare tutti i prodotti associati a questo nodo
        const prodottiQuery = db.collection('App')
            .doc(nomeUtente)
            .collection('Prodotti')
            .where('nodoIdList', 'array-contains', id);

        const snapshot = await prodottiQuery.get();

        // Inizializza un batch per aggiornare i prodotti
        const batch = db.batch();

        snapshot.forEach(docSnap => {
            const prodottoRef = docSnap.ref;
            const prodottoData = docSnap.data();

            // Rimuovi l'oggetto nodo dall'array `nodo`
            const updatedNodo = prodottoData.nodo.filter(nodo => nodo.value !== id);
            const updatedNodoIdList = prodottoData.nodoIdList.filter(nodoId => nodoId !== id);

            // Aggiorna i campi nel documento con il nuovo array nodo aggiornato
            batch.update(prodottoRef, {
                nodo: updatedNodo,
                nodoIdList: updatedNodoIdList
            });
        });

        // Elimina il nodo
        batch.delete(nodoRef);

        // Commit del batch
        await batch.commit();


        res.status(200).json({ message: "documento eliminato" })

    } catch (error) {
        res.status(409).json({ message: error.message })
    }

}