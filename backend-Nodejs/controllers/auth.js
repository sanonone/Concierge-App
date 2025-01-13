import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import stringify from "json-stringify-safe";
//import per firebase
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import sql from 'mssql'
import { DateTime } from 'luxon'
import { config } from '../config.js'

async function cercaNomeUtente(codStruttura, targetUsername) {
    const db = getFirestore()
    const utentiSnapshot = await db.collection('AppUsers').where('codStruttura', '==', codStruttura).get();

    if (!utentiSnapshot.empty) {
        const filteredDoc = utentiSnapshot.docs.find(doc => doc.data().username === targetUsername);

        if (filteredDoc) {
            return filteredDoc.data().username;
        } else {
            return null; // Se nessun documento corrisponde all'username specificato
        }
    } else {
        return null; // Se nessun documento corrisponde a codStruttura
    }
}


async function cercaNomeUtenteNew(codStruttura) {
    const db = getFirestore();
    const utente = await db
        .collection("AppUsers")
        .where("codStruttura", "==", codStruttura)
        .get();
    //console.log(utente)
    if (!utente.empty) {
        const utenteDoc = utente.docs[0];
        const utenteData = utenteDoc.data();
        return utenteData.username;
    }
}


async function cercaIpStruttura(codStruttura) {
    const db = getFirestore()
    const utente = await db.collection('AppUsers').where('codStruttura', '==', codStruttura).get()
    if (!utente.empty) {
        const utenteDoc = utente.docs[0]
        const utenteData = utenteDoc.data()
        const dati = {
            ipStruttura: utenteData.ipStruttura,
            DBname: utenteData.DBname,
            IdAzienda: utenteData.IdAzienda,
            tokenNotify: utenteData.tokenNotify,
            app: utenteData.app,
            web: utenteData.web,
            attivo: utenteData.attivo,
            username: utenteData.username,
            idStripe: utenteData.idStripe,
            tipoConfigurazione: utenteData.tipoConfigurazione,
        }
        return dati
    }
}


async function selectQuery(ip, DBname, select) {
    try {
        //PRIVATO
    } catch (err) {
        // ... controlli degli errori
        console.error(err);
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const db = getFirestore()
        let users = []
        let customerRef = db.collection("AppUsers").orderBy('indice')
        customerRef.get().then((snapshot) => {
            snapshot.forEach(document => {
                // Rimuovi il campo 'password' dall'oggetto document.data()
                const { password, ...userWithoutPassword } = document.data();
                users.push(userWithoutPassword)
            })
            res.status(200).json(users)
        })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getUserByID = async (req, res) => {
    const id = req.params.id

    try {
        const db = getFirestore()
        let user
        let customerRef = db.collection("AppUsers").where("id", "==", id)
        customerRef.get().then((snapshot) => {
            snapshot.forEach(document => {
                // Rimuovi il campo 'password' dall'oggetto document.data()
                const { password, ...userWithoutPassword } = document.data();
                user = userWithoutPassword

            })

            res.status(200).json(user)
        })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}


export const updateUser = async (req, res) => {
    const id = req.params.id
    const { codStruttura, ipStruttura, DBname, attivo, app, web, password, IdAzienda, idStripe, tipoConfigurazione } = req.body
    console.log(codStruttura)

    let updateData = {}
    if (password != "") {
        console.log("aggiorno password")

        const Passwordhash = //PRIVATO

        updateData = {
            id: id,
            codStruttura: codStruttura,
            ipStruttura: ipStruttura,
            DBname: DBname,
            attivo: attivo,
            app: app,
            web: web,
            password: Passwordhash,
            IdAzienda: IdAzienda,
            idStripe: idStripe,
            tipoConfigurazione: tipoConfigurazione,
        }
        console.log(updateData)
    } else {
        console.log("non aggiorno password")
        updateData = {
            id: id,
            codStruttura: codStruttura,
            ipStruttura: ipStruttura,
            DBname: DBname,
            attivo: attivo,
            app: app,
            web: web,
            IdAzienda: IdAzienda,
            idStripe: idStripe,
            tipoConfigurazione: tipoConfigurazione,
        }
        console.log(updateData)
    }


    try {
        const db = getFirestore()
        const docRef = db.collection('AppUsers').where("id", "==", id);

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


export const updateUserIdStripe = async (req, res) => {
    const id = req.params.id
    const { idStripe } = req.body

    const updateData = {
        idStripe: idStripe,
    }
    console.log(updateData)

    try {
        const db = getFirestore()
        const docRef = db.collection('AppUsers').where("id", "==", id);

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

            .then(() => {
                console.log("IdAtripe aggiornato con successo");
                res.status(201).json({ status: 'ok', message: `Documento aggiornato con successo` })
            })
            .catch((error) => {
                console.error("Errore durante l'aggiornamento del documento IdStripe:", error);
                res.json({ message: "errore durante l'aggiornamento del documento" })
            });
    }
    catch (error) {
        res.status(409).json({ message: error.message })
    }
}




export const updateUserTokenNotify = async (req, res) => {
    const id = req.params.id;
    const { tokenNotify } = req.body;

    console.log("Aggiorno token notify");

    try {
        const db = getFirestore();
        const docRef = db.collection('AppUsers').where("id", "==", id);

        docRef.get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    throw new Error("Documento non trovato");
                }

                const doc = querySnapshot.docs[0];
                const existingData = doc.data();

                let updatedTokenList = [];

                if (existingData.tokenNotify) {
                    if (Array.isArray(existingData.tokenNotify)) {
                        // Se tokenNotify è già un array
                        updatedTokenList = existingData.tokenNotify;
                    } else {
                        // Se tokenNotify non è un array, lo trasformiamo in uno
                        updatedTokenList = [existingData.tokenNotify];
                    }
                }

                // Aggiungi il nuovo token alla lista, evitando duplicati
                if (!updatedTokenList.includes(tokenNotify)) {
                    updatedTokenList.push(tokenNotify);
                }

                return doc.ref.update({ tokenNotify: updatedTokenList });
            })
            .then(() => {
                console.log("Documento aggiornato con successo");
                res.status(201).json({ status: 'ok', message: "Documento aggiornato con successo" });
            })
            .catch((error) => {
                console.error("Errore durante l'aggiornamento del documento:", error);
                res.json({ message: "Errore durante l'aggiornamento del documento" });
            });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};




export const deleteUser = async (req, res) => {
    const codStruttura = req.params.codStruttura;
    const { username } = req.body;

    let nomeUtente = await cercaNomeUtente(codStruttura, username)
    console.log(nomeUtente)
    if (nomeUtente == null) {
        return res.json({ message: 'empty user' })
    }

    try {
        const db = getFirestore();
        const documentRef = db.collection('AppUsers').doc(nomeUtente)

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
        res.status(409).json({ message: error.message });
    }
};


export const login = async (req, res) => {
    //PRIVATO

}

export const register = async (req, res) => {
    const { username, password, codStruttura, ipStruttura, DBname, admin, IdAzienda } = req.body

    // Imposta il fuso orario italiano
    const nowInItaly = DateTime.now().setZone('Europe/Rome');
    // Ottieni il timestamp
    const timestamp = nowInItaly.toMillis();

    if (!username || typeof username != 'string') {
        return res.json({ status: 'error', message: 'username non valido' })
    }

    if (!password || typeof password != 'string') {
        return res.json({ status: 'error', message: 'password non valida' })
    }

    if (!codStruttura || typeof codStruttura != 'string') {
        return res.json({ status: 'error', message: 'codice struttura non valido' })
    }

    if (password.length < 5) {
        return res.json({ status: 'error', message: 'password troppo corta' })
    }

    if (!ipStruttura || typeof ipStruttura != 'string') {
        return res.json({ status: 'error', message: 'ip non valido' })
    }

    const db = getFirestore()
    const DBuser = await db.collection('AppUsers').where('username', '==', username).get()
    if (!DBuser.empty) {
        return res.json({ status: 'error', message: 'username non disponibile' })
    }

    const Passwordhash = //PRIVATO
    
    const ID = uuidv4()
    const user = {
        id: ID,
        username: username,
        password: Passwordhash,
        codStruttura: codStruttura,
        ipStruttura: ipStruttura,
        DBname: DBname,
        attivo: true,
        app: true,
        web: true,
        admin: admin,
        dataAttivazione: timestamp,
        indice: parseInt(codStruttura),
        IdAzienda: parseInt(IdAzienda),
        tokenNotify: "",
        idStripe: "",
        tipoConfigurazione: "",

    }

    const hotel = {
        id: "Hotel",
        nome: 'Hotel',
        nomeEn: 'Hotel',
        colore: '#ffffff',
        posizione: 0,
        sfondo: 'https://images.unsplash.com/photo-1554647286-f365d7defc2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        attivo: true,
    }
    const eventi = {
        id: "Eventi",
        nome: 'Eventi',
        nomeEn: 'Events',
        colore: '#ffffff',
        posizione: 1,
        sfondo: 'https://plus.unsplash.com/premium_photo-1682681903841-1f98ce6a1175?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmVzdGElMjBpbiUyMHBpc2NpbmF8ZW58MHx8MHx8fDA%3D',
        attivo: true,
    }
    const servizioInCamera = {
        id: "RoomS",
        nome: 'Ordini',
        nomeEn: 'Order',
        colore: '#ffffff',
        posizione: 2,
        sfondo: 'https://images.unsplash.com/photo-1516554646385-7642248096d1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        attivo: true,
    }
    const servizi = {
        id: "Servizi",
        nome: 'Servizi Prenotabili',
        nomeEn: 'Bookable Services',
        colore: '#ffffff',
        posizione: 3,
        sfondo: 'https://images.unsplash.com/photo-1455641374154-422f32e234cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bm9sZWdnaW98ZW58MHx8MHx8fDA%3D',
        attivo: true,
    }
    const ristorantiConvenzionati = {
        id: "Ristoranti",
        nome: 'Ristoranti',
        nomeEn: 'Restaurants',
        colore: '#ffffff',
        posizione: 4,
        sfondo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cmlzdG9yYW50ZXxlbnwwfHwwfHx8MA%3D%3D',
        attivo: true,
    }
    const daVisitare = {
        id: "Visita",
        nome: 'Da Visitare',
        nomeEn: 'Places to Visit',
        colore: '#ffffff',
        posizione: 5,
        sfondo: 'https://plus.unsplash.com/premium_photo-1676218968741-8179dd7e533f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        attivo: true,
    }

    const settingsApp = {
        colorBar: '#ffffff',//bianco
        colorIconBar: '#0000ff',//blu
        colorTitleCard: '#000000',//nero
        colorDescrizioneCard: '#000000',
        colorIconCard: '#000000',
        linkIcon: '',
        linkMeteo: '',
        iconApp: 'https://storage.googleapis.com/fir-autenticazione-d201f.appspot.com/conciergeTT/8/LogoApp?GoogleAccessId=firebase-adminsdk-zuvz8%40fir-autenticazione-d201f.iam.gserviceaccount.com&Expires=32503680000&Signature=sltJGGCfJGv8Ukuo47Ug1jn2G2gFYfCV9CQPWjIRDxLuZv%2Fwi%2FAbavL3wKJSslYJdXRiTT7s7qixnaYJH0pK3mwe2Hj9MaqMTPxmE1Bgc92EkwWGitWPJSzAOZqwN3XOq6pRQDET%2BNRtLycCAhONeLScbtR4588nDZEsK0pJfVh8aeRqwrnfqW4s470kv%2F3JVSQwq%2FTD4Umm2RxSFiRUr9a6fOR4IURDxRQNffNBR8eIuZ%2B0HeW2lvPfKia7B2MQgHMYRxAgbAv%2B%2BUzNzscASbpmwVvN0kDcGxo%2BkM5RGicApA4sjiUoApyp6Z2bQgAlWnyljU%2By3pi7dKI1YMrKWg%3D%3D',
        sfondoApp: 'https://images.unsplash.com/photo-1554647286-f365d7defc2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        orario: {},
        orario2: {},
        orario3: {},
        ospiti: true,
    }

    try {
        //sezione firebase
        const apps = getApps()

        if (!apps.length) {
            initializeApp({
                credential: cert(process.env.CREDENTIAL)
            })
        }

        const db = getFirestore()
        await db.collection('AppUsers').doc(user.username).set(user)
        await db.collection('App').doc(user.username).collection('HomeApp').doc("Hotel").set(hotel)
        await db.collection('App').doc(user.username).collection('HomeApp').doc("Eventi").set(eventi)
        await db.collection('App').doc(user.username).collection('HomeApp').doc("RoomS").set(servizioInCamera)
        await db.collection('App').doc(user.username).collection('HomeApp').doc("Servizi").set(servizi)
        await db.collection('App').doc(user.username).collection('HomeApp').doc("Ristoranti").set(ristorantiConvenzionati)
        await db.collection('App').doc(user.username).collection('HomeApp').doc("Visita").set(daVisitare)
        await db.collection('App').doc(user.username).collection('SettingsApp').doc("Settings").set(settingsApp)

        res.status(201).json({ status: 'ok' })
    }
    catch (error) {
        res.status(409).json({ status: 'error', message: error.message })
        console.log(`errore: ${error}`)
    }


}


export const getIp = async (req, res) => {
    const codStruttura = req.params.cod

    try {
        const ip = await cercaIpStruttura(codStruttura)
        if (ip != null) {
            return res.status(200).json(ip);
        }
        else {
            return res.status(404).json({ message: "ip non trovato nella funzione" });
        }
    } catch (error) {
        return res.status(404).json({ message: `nessun indirizzo trovato per struttura id:${codStruttura}` });
    }
}

export const appLogin = async (req, res) => {
    //PRIVATO
};


export const appLoginGuest = async (req, res) => {
    //PRIVATO
};


export const appRegisterStandard = async (req, res) => {
    const { codStruttura, mail, password, nome, cognome, cellulare, tokenNotify } = req.body

    // Imposta il fuso orario italiano
    const nowInItaly = DateTime.now().setZone('Europe/Rome');
    // Ottieni il timestamp
    const timestamp = nowInItaly.toMillis();

    const Passwordhash = //PRIVATO

    const ID = uuidv4();
    const newMobileUser = {
        id: ID,
        mail: mail,
        codPrenotazione: '',
        IdSchedaConto: '',
        DataInizio: '',
        DataFine: '',
        tokenNotify: tokenNotify,
        dataRegistrazione: timestamp,
        tipo: 'interno',
        nome: nome,
        cognome: cognome,
        camera: 'esterno',
        telefono: cellulare,
        password: Passwordhash,
    }
    console.log(codStruttura)
    const mobileUserJson = JSON.parse(stringify(newMobileUser));

    let nomeUtente = await cercaNomeUtenteNew(codStruttura);
    if (nomeUtente == null) {
        console.log("nessun user")
        return res.json({ message: "empty user" });
    }

    const db = getFirestore()
    const DBuser = await db.collection('App').doc(nomeUtente).collection('MobileUser').where('mail', '==', mail).get()
    if (!DBuser.empty) {
        return res.status(403).json({ status: 'error', message: 'utente già esistente' })
    }

    try {

        const db = getFirestore();
        await db
            .collection("App")
            .doc(nomeUtente)
            .collection("MobileUser")
            .doc(ID)
            .set(mobileUserJson);

        console.log("registrazione completata")
        res.status(201).json({
            status: "ok",
            token: "nessuno",
            message: `nuovo utente ${mail} aggiunto alla lista`,
        });


    } catch (error) {
        console.log(`errore durante la registrazione: ${error}`)
        res.status(404).json({ message: `${error.message}, utente non registrato` });
    }
};


export const appLoginStandard = async (req, res) => {
    //PRIVATO

}


export const webLoginGuest = async (req, res) => {
    //PRIVATO
};

export const getDatePrenotazione = async (req, res) => {
    //PRIVATO
};
