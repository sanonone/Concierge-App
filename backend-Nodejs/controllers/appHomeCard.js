import { getFirestore } from 'firebase-admin/firestore'
import stringify from 'json-stringify-safe'
import { v4 as uuidv4 } from 'uuid'
import appHomeCard from '../models/appHomeCard.js'

async function cercaNomeUtente(codStruttura) {
    const db = getFirestore()
    const utente = await db.collection('AppUsers').where('codStruttura', '==', codStruttura).get()
    if (!utente.empty) {
        const utenteDoc = utente.docs[0]
        const utenteData = utenteDoc.data()
        return utenteData.username
    }
}

export const getAllAppHomeCard = async (req, res) => {//get tutte le card della Home del telefono
    const codStruttura = req.params.cod
    let nome = await cercaNomeUtente(codStruttura)
    console.log(nome)
    if (nome == null) {
        return res.json({ message: 'empty user' })
    }
    try {
        const db = getFirestore()
        let datiCard = []
        let customerRef = db.collection("App").doc(nome).collection("HomeApp").orderBy("posizione")
        customerRef.get().then((snapshot) => {
            snapshot.forEach(document => {
                datiCard.push(document.data())
            })
            //console.log(datiCard)
            res.status(200).json(datiCard)
        })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const updateAppHomeCard = async (req, res) => {//update SettingsApp
    const codStruttura = req.params.cod
    const {
        sfondo,
        posizione,
        nome,
        id,
        colore,
        attivo,
    } = req.body


    let nomeUt = await cercaNomeUtente(codStruttura)
    //console.log(nomeUt)
    if (nomeUt == null) {
        return res.json({ message: 'empty user' })
    }

    const updateData={
        sfondo:sfondo,
        posizione:posizione,
        id:id,
        colore:colore,
        attivo:attivo,
    }
    //console.log(updateData)

    try {
        const db = getFirestore();
        await db.collection('App').doc(nomeUt).collection('HomeApp').doc(id).update(updateData)
        res.status(201).json({ status: "ok", message: `Documento aggiornato con successo` });
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getAllSettingsApp = async (req, res) => {//get tutte le card della Home del telefono
    const codStruttura = req.params.cod
    let nome = await cercaNomeUtente(codStruttura)
    //console.log(nome)
    if (nome == null) {
        return res.json({ message: 'empty user' })
    }
    try {
        const db = getFirestore()
        let datiCard = []
        let customerRef = db.collection("App").doc(nome).collection("SettingsApp")
        customerRef.get().then((snapshot) => {
            snapshot.forEach(document => {
                datiCard.push(document.data())
            })
            //console.log(datiCard)
            res.status(200).json(datiCard)
        })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const updateSettingsApp = async (req, res) => {//update SettingsApp
    const codStruttura = req.params.cod
    const {
        colorDescrizioneCard,
        colorBar,
        colorTitleCard,
        orario,
        orario2,
        orario3,
        iconApp,
        linkMeteo,
        colorIconBar,
        colorIconCard,
        colorButtonPrenotazione,
        linkIcon,
        sfondoApp,
        ospiti,
    } = req.body


    let nome = await cercaNomeUtente(codStruttura)
    //console.log(nome)
    if (nome == null) {
        return res.json({ message: 'empty user' })
    }

    const updateData={
        colorDescrizioneCard:colorDescrizioneCard,
        colorBar:colorBar,
        colorTitleCard:colorTitleCard,
        orario:orario,
        orario2:orario2,
        orario3:orario3,
        iconApp:iconApp,
        linkMeteo:linkMeteo,
        colorIconBar:colorIconBar,
        colorIconCard:colorIconCard,
        colorButtonPrenotazione:colorButtonPrenotazione,
        linkIcon:linkIcon,
        sfondoApp:sfondoApp,
        ospiti:ospiti
    }
    //console.log(updateData)

    try {
        const db = getFirestore();
        await db.collection('App').doc(nome).collection('SettingsApp').doc("Settings").set(updateData)
        res.status(201).json({ status: "ok", message: `Documento aggiornato con successo` });
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}