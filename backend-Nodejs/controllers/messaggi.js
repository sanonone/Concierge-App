import { getFirestore } from "firebase-admin/firestore";
import stringify from "json-stringify-safe";
import { v4 as uuidv4 } from "uuid";


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



export const getAllMessaggi = async (req, res) => {
  const codStruttura = req.params.cod;
  
  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  try {
    
    let messaggi = [];
    const db = getFirestore();

    let customerRef = db
      .collection("App")
      .doc(nomeUtente)
      .collection("Messaggi")
      .orderBy("dataGestione");
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

export const getAllMessaggiSegnalazioni = async (req, res) => {
  //get tutti gli utenti
  const codStruttura = req.params.cod;
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
      .collection("Messaggi")
      .where('tipo', '==', 's')
    //.orderBy("dataGestione");
    customerRef.get().then((snapshot) => {
      snapshot.forEach((document) => {
        messaggi.push(document.data());
      });
      messaggi.sort((a, b) => a.dataGestione - b.dataGestione)
      res.status(200).json(messaggi);
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getMessaggioSegnalazioniParams = async (req, res) => {
  const { codStruttura, mail, tipo, codPrenotazione } = req.body;

  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    console.log(nomeUtente);
    return res.json({ message: "empty user" });
  }

  try {
    //const users = await User.find()
    let messaggi = [];
    const db = getFirestore();

    if (tipo == 'interno') {

      let customerRef = db
        .collection("App")
        .doc(nomeUtente)
        .collection("Messaggi")
        .where('tipo', '==', 's')
        .where('mittente', '==', mail)
        .where('codPrenotazione', '==', codPrenotazione)
      //.orderBy("dataGestione");
      customerRef.get().then((snapshot) => {
        snapshot.forEach((document) => {
          messaggi.push(document.data());
        });
        messaggi.sort((a, b) => a.dataGestione - b.dataGestione)
        res.status(200).json(messaggi);
      });

    } else {
      let customerRef = db
        .collection("App")
        .doc(nomeUtente)
        .collection("Messaggi")
        .where('tipo', '==', 's')
        .where('mittente', '==', mail)

      //.orderBy("dataGestione");
      customerRef.get().then((snapshot) => {
        snapshot.forEach((document) => {
          messaggi.push(document.data());
        });
        messaggi.sort((a, b) => a.dataGestione - b.dataGestione)
        res.status(200).json(messaggi);
      });

    }


  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const getMessaggioNotificheParams = async (req, res) => {
  const { codStruttura, tokenNotify } = req.body;

  console.log(`il codStruttura : ${codStruttura}, il token: ${tokenNotify}`)

  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    console.log(nomeUtente);
    return res.json({ message: "empty user" });
  }

  try {
    //const users = await User.find()
    let messaggi = [];
    const db = getFirestore();

    let customerRef = db
      .collection("App")
      .doc(nomeUtente)
      .collection("Messaggi")
      .where('tipo', '==', 'n')
      .where('tokenNotifyMittente', '==', tokenNotify)

    //.orderBy("dataGestione");
    customerRef.get().then((snapshot) => {
      snapshot.forEach((document) => {
        messaggi.push(document.data());
      });
      messaggi.sort((a, b) => a.dataGestione - b.dataGestione)
      res.status(200).json(messaggi);
    });




  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};



export const insertMessaggio = async (req, res) => {
  //post di un utente
  const {
    codStruttura,
    codPrenotazione,
    problema,
    risposta,
    tipo,
    stato,
    camera,
    mittente,
    destinatario,
    tokenNotifyMittente,
    tokenNotifyDestinatario
  } = req.body;
  console.log(` codPrenotazioni: ${codPrenotazione}`)
  // Ottieni la data di oggi
  let oggi = new Date();

  // Ottieni il timestamp per oggi
  let timestampOggi = oggi.getTime();
  const ID = uuidv4();
  const newMessaggio = {
    id: ID,
    codPrenotazione: codPrenotazione,
    problema: problema,
    risposta: risposta,
    tipo: tipo,
    stato: stato,
    camera: camera,
    dataGestione: timestampOggi,
    mittente: mittente,
    destinatario: destinatario,
    tokenNotifyMittente: tokenNotifyMittente,
    tokenNotifyDestinatario: tokenNotifyDestinatario

  }
  console.log(newMessaggio)
  const messaggioJson = JSON.parse(stringify(newMessaggio));
  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  try {
  
    const db = getFirestore();
    await db
      .collection("App")
      .doc(nomeUtente)
      .collection("Messaggi")
      .doc(ID)
      .set(messaggioJson);

    res.status(201).json({
      status: "ok",
      message: `nuovo messaggio da ${mittente} aggiunto alla lista`,
    });
  } catch (error) {
    console.log(error.message)
    res.status(409).json({ message: error.message });
  }
};


export const updateMessaggio2 = async (req, res) => {
  const id = req.params.id;
  const { stato, risposta, codStruttura } = req.body;

  if (!id || !stato || !codStruttura) {
    return res.status(400).json({ message: 'Missing required fields: id, stato, and risposta' });
  }

  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  try {
    const db = getFirestore();
    const messaggioRef = db.collection('App').doc(nomeUtente).collection('Messaggi').doc(id);

    const messaggioDoc = await messaggioRef.get();

    if (!messaggioDoc.exists) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await messaggioRef.update({
      stato: stato,
      risposta: risposta,
      dataGestione: new Date().getTime() // Update the timestamp
    });

    res.status(200).json({
      status: 'ok',
      message: `Message with id ${id} updated successfully`,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};


export const updateMessaggio = async (req, res) => {
  const id = req.params.id;
  const {
    nome,
    descrizione,
    codStruttura,
    immagine,
    visDataIni,
    visDataFin,
    dataIni,
    dataFin,
    orari,
    prodotti,
    prodottiFasce,
    quantita,
    posizione,
    lingua,
  } = req.body;
  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nome == null) {
    return res.json({ message: "empty user" });
  }

  const updateData = {
    id: id,
    nome: nome,
    descrizione: descrizione,
    immagine: immagine,
    visDataIni: visDataIni,
    visDataFin: visDataFin,
    dataIni: dataIni,
    dataFin: dataFin,
    orari: orari,
    prodotti: prodotti,
    prodottiFasce: prodottiFasce,
    quantita: quantita,
    posizione: posizione,
    lingua: lingua,
  };

  const updateDataEn = {
    immagine: immagine,
    visDataIni: visDataIni,
    visDataFin: visDataFin,
    dataIni: dataIni,
    dataFin: dataFin,
    orari: orari,
    prodotti: prodotti,
    prodottiFasce: prodottiFasce,
    quantita: quantita,
    posizione: posizione,
  }

  console.log(updateData)

  try {
    //await newUser.save()//capisce dal modello che newUser va salvato nella collezione di mongo (users)
    const db = getFirestore();

    const docRef = db
      .collection("App")
      .doc(nomeUtente)
      .collection("Servizi")
      .where("id", "==", id)
      .where("lingua", "==", lingua);
    //.doc(id)

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
      .collection("Servizi")
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

      .then(() => {
        console.log("Documento aggiornato con successo");
        res
          .status(201)
          .json({ status: "ok", message: `Documento aggiornato con successo` });
      })
      .catch((error) => {
        console.error("Errore durante l'aggiornamento del documento:", error);
        res.json({ message: "errore durante l'aggiornamento del documento" });
      });
  } catch (error) {
    console.log(error.message)
    res.status(409).json({ message: error.message });
  }
};

export const deleteMessaggio = async (req, res) => {
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
      .collection("Servizi")
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
