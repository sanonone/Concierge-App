import { getFirestore } from "firebase-admin/firestore";
import stringify from "json-stringify-safe";
import { v4 as uuidv4 } from "uuid";
import { DateTime } from 'luxon'

async function cercaNomeUtente(codStruttura) {
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



export const getAllMobileUsers = async (req, res) => {
  //get tutti gli utenti
  const codStruttura = req.params.cod;
  //console.log(`il codice struttura è: ${codStruttura}`)
  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  try {
    //const users = await User.find()
    let messaggi = [];
    const db = getFirestore();

    let customerRef = db
      .collection("App")
      .doc(nomeUtente)
      .collection("MobileUser")
    //.orderBy("dataGestione");
    customerRef.get().then((snapshot) => {
      snapshot.forEach((document) => {
        messaggi.push(document.data());
      });
      res.status(200).json(messaggi);
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const getMobileUserByParams = async (req, res) => {
  let { codStruttura, mail, codPrenotazione } = req.body;

  console.log(`i dati ricevuti per cercare il token sono: ${codStruttura}, ${mail}, ${codPrenotazione}`)
  let nomeUtente = await cercaNomeUtente(codStruttura);
  if(codPrenotazione==undefined){codPrenotazione=0}
  if (nomeUtente == null) {
    console.log(nomeUtente);
    return res.json({ message: "empty user" });
  }

  try {
    const db = getFirestore();
    const querySnapshot = await db
      .collection("App")
      .doc(nomeUtente)
      .collection("MobileUser")
      .where('mail', '==', mail)
      .where('codPrenotazione', '==', codPrenotazione)
      .get();

    if (querySnapshot.empty) {
      console.log("Nessun documento trovato");
      return res.status(404).json({ message: "Documento non trovato" });
    }

    // Ottenere il primo documento dalla query
    const doc = querySnapshot.docs[0];
    console.log(`Il documento trovato è: ${doc.id}`, doc.data());

    // Restituire i dati del documento
    return res.status(200).json({tokenNotify:doc.data().tokenNotify});

  } catch (error) {
    console.error("Errore durante la ricerca del documento:", error);
    return res.status(500).json({ message: "Errore durante la ricerca del documento", error: error.message });
  }
};


export const insertMobileUser = async (req, res) => {
  
  const {
    codStruttura,
    mail,
    codPrenotazione,
    IdSchedaConto,
    DataInizio,
    DataFine,
    tokenNotify,
    tipo,
    nome,
    cognome,
    camera,
  } = req.body;

  // Ottieni la data di oggi
  let oggi = new Date();
  
  // Ottieni il timestamp per oggi
  let timestampOggi = oggi.getTime();
  const ID = uuidv4();
  const newMobileUser = {
    id: ID,
    mail: mail,
    codPrenotazione: codPrenotazione,
    IdSchedaConto: IdSchedaConto,
    DataInizio:DataInizio,
    DataFine:DataFine,
    tokenNotify: tokenNotify,
    dataRegistrazione: timestampOggi,
    tipo: tipo,
    nome: nome,
    cognome: cognome,
    camera: camera
  }
  console.log(newMobileUser)
  const mobileUserJson = JSON.parse(stringify(newMobileUser));
  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  const db = getFirestore()
  const DBuser = await db.collection('App').doc(nomeUtente).collection('MobileUser').where('mail', '==', mail).where('codPrenotazione', '==', codPrenotazione).get()
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

    res.status(201).json({
      status: "ok",
      message: `nuovo utente ${mail} aggiunto alla lista`,
    });
  } catch (error) {
    console.log(error.message)
    res.status(409).json({ message: error.message });
  }
};

export const updateMobileUser = async (req, res) => {
  let {
    codStruttura,
    mail,
    codPrenotazione,
    DataInizio,
    DataFine,
    tokenNotify
  } = req.body;

  if(codPrenotazione==undefined){codPrenotazione=0}

  console.log(req.body)
  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  const updateData = {
    DataInizio:DataInizio,
    DataFine:DataFine,
    tokenNotify: tokenNotify,
  };

  

  console.log(updateData)

  try {
    
    const db = getFirestore();

    const docRef = db
      .collection("App")
      .doc(nomeUtente)
      .collection("MobileUser")
      .where('mail', '==', mail)
      .where('codPrenotazione', '==', codPrenotazione);
    

    docRef.get() // Ottenere il documento dalla query
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          console.log("Nessun documento da aggiornare trovato")
          throw new Error("Documento non trovato");
        }
        
        // Ottenere il primo documento dalla query
        const doc = querySnapshot.docs[0];
        console.log(`il doc trovato è: ${doc}`)

        // Aggiornare i dati del documento
        return doc.ref.update(updateData);
      })
      .then(() => {
        console.log("Documento aggiornato con successo");
        res
          .status(201)
          .json({ status: "ok", message: `Documento aggiornato con successo` });
      })
      .catch((error) => {
        console.log("Errore durante l'aggiornamento del documento:", error);
        res.json({ message: "errore durante l'aggiornamento del documento" });
      });
  } catch (error) {
    console.log(error.message)
    res.status(409).json({ message: error.message });
  }
};

export const deleteMobileUser = async (req, res) => {
  const { id, codStruttura } = req.body;
  console.log(`l'id è: ${id}, il codice struttura: ${codStruttura}`);
  let nomeUtente = await cercaNomeUtente(codStruttura);
  console.log(nomeUtente);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  try {
    const db = getFirestore();
    const documentRef = db
      .collection("App")
      .doc(nomeUtente)
      .collection("MobileUser")
      .doc(id);

    documentRef
      .delete()
      .then(() => {
        console.log("Documento eliminato con successo");
        res.status(200).json({ message: "documento eliminato" });
      })
      .catch((error) => {
        console.error("Errore durante l'eliminazione del documento:", error);
        res.json({ message: "errore, impossibile eliminare il documento" });
      });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
