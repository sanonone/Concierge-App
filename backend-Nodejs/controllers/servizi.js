import Servizio from "../models/servizio.js";
import { getFirestore } from "firebase-admin/firestore";
import stringify from "json-stringify-safe";
import { v4 as uuidv4 } from "uuid";
import PrenotazioneServizio from "../models/prenotazioneServizio.js";
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

function convertiTimestampAData(timestamp) {
  // Converti il timestamp a millisecondi (se non lo è già)
  const date = DateTime.fromMillis(parseInt(timestamp, 10), { zone: 'Europe/Rome' });

  const giorno = date.day.toString().padStart(2, '0');
  const mese = date.month.toString().padStart(2, '0');
  const anno = date.year;

  const ora = date.hour.toString().padStart(2, '0');
  const minuti = date.minute.toString().padStart(2, '0');
  const secondi = date.second.toString().padStart(2, '0');

  //return `${anno}-${mese}-${giorno} ${ora}:${minuti}:${secondi}`;
  return `${giorno}/${mese}/${anno}`;
}

function timestampToDate(timestamp) {
  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // i mesi partono da 0
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}



export const getAllServizi = async (req, res) => {
  //get tutti gli utenti
  const codStruttura = req.params.cod;
  //console.log(`il codice struttura è: ${codStruttura}`)
  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  try {
    //const users = await User.find()
    let servizi = [];
    const db = getFirestore();

    let customerRef = db
      .collection("App")
      .doc(nomeUtente)
      .collection("Servizi")
      .orderBy("posizione");
    customerRef.get().then((snapshot) => {
      snapshot.forEach((document) => {
        servizi.push(document.data());
      });
      res.status(200).json(servizi);
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getServizioById = async (req, res) => {
  const { id, codStruttura } = req.body;
  console.log(id)
  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    console.log(nomeUtente);
    return res.json({ message: "empty user" });
  }

  try {
    const db = getFirestore();
    const documentRef = await db
      .collection("App")
      .doc(nomeUtente)
      .collection("Servizi")
      .doc(id)
      .get();
    if (documentRef.data() != undefined) {
      res.json(documentRef.data());
    } else {
      res.status(404).json({ message: "nessun servizio con questo ID" });
    }
  } catch (error) {
    res.status(409).json({ message: `${error.message} errore` });
  }
};

export const insertServizio = async (req, res) => {
  //post di un utente
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
    visibileWeb,
    visibileApp,
    visibileAppGuest,
  } = req.body;
  const ID = uuidv4();
  const newServizio = new Servizio(
    ID,
    nome,
    descrizione,
    immagine,
    visDataIni,
    visDataFin,
    dataIni,
    dataFin,
    orari,
    prodotti,
    prodottiFasce,
    quantita,
    quantita,//qMaxPrenotabile
    posizione,
    lingua,
    "nonPaga",
    0,
    visibileWeb,
    visibileApp,
    visibileAppGuest,
  );
  console.log(newServizio)
  const servizioJson = JSON.parse(stringify(newServizio));
  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  try {
    
    const db = getFirestore();
    await db
      .collection("App")
      .doc(nomeUtente)
      .collection("Servizi")
      .doc(ID)
      .set(servizioJson);
    if (lingua == "Italiano") {
      console.log("faccio anche inglese")
      const IDinglese = uuidv4()
      const servizioJsonInglese = servizioJson
      servizioJsonInglese.lingua = "Inglese"
      servizioJsonInglese.id = IDinglese
      servizioJsonInglese.idPadre = ID
      await db.collection('App').doc(nomeUtente).collection('Servizi').doc(IDinglese).set(servizioJsonInglese)
    }
    res.status(201).json({
      status: "ok",
      message: `nuovo servizio ${nome} aggiunto alla lista`,
    });
  } catch (error) {
    console.log(error.message)
    res.status(409).json({ message: error.message });
  }
};

export const updateServizio = async (req, res) => {
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
    qMaxPrenotabile,
    posizione,
    lingua,
    pagamentoType,
    percentualeAcconto,
    visibileWeb,
    visibileApp,
    visibileAppGuest,
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
    qMaxPrenotabile: qMaxPrenotabile,
    posizione: posizione,
    lingua: lingua,
    pagamentoType: pagamentoType,
    percentualeAcconto: percentualeAcconto,
    visibileWeb: visibileWeb,
    visibileApp: visibileApp,
    visibileAppGuest: visibileAppGuest
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
    qMaxPrenotabile: qMaxPrenotabile,
    posizione: posizione,
    pagamentoType: pagamentoType,
    percentualeAcconto: percentualeAcconto,
    visibileWeb: visibileWeb,
    visibileApp: visibileApp,
    visibileAppGuest: visibileAppGuest
  }

  console.log(updateData)

  try {
    
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

export const deleteServizio = async (req, res) => {
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



export const insertPrenotazioneServizio = async (req, res) => {
  //post di un utente
  const { codStruttura, idServizio, nomeServizio, nomePrenotante, cognomePrenotante, mail, telefono, codPrenotazione, camera, richieste, dataIni, dataFin, ora, prodotto, totale, quantita, stato, IdSchedaConto, IdSchedaContoRetta, messaggio } = req.body;
  const ID = uuidv4();

  // Ottieni la data di oggi
  let oggi = new Date();
  
  // Ottieni il timestamp per oggi
  let timestampOggi = oggi.getTime();

  const newPrenotazione = new PrenotazioneServizio(ID, idServizio, nomeServizio, nomePrenotante, cognomePrenotante, mail, telefono, codPrenotazione, camera, richieste, dataIni, dataFin, timestampOggi, ora, prodotto, totale, quantita, stato, IdSchedaConto, IdSchedaContoRetta, messaggio);
  const prenotazioneJson = JSON.parse(stringify(newPrenotazione));
  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  try {

    const db = getFirestore();
    await db
      .collection("App")
      .doc(nomeUtente)
      .collection("PrenotazioniServizi")
      .doc(ID)
      .set(prenotazioneJson);
    res.status(201).json({
      status: "ok",
      message: `nuova prenotazione ${nomeServizio} inserita`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};


export const deletePrenotazioneServizio = async (req, res) => {
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
      .collection("PrenotazioniServizi")
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



export const updatePrenotazioneServizio = async (req, res) => {
  const id = req.params.id;
  const {
    stato,
    codStruttura,
    messaggio
  } = req.body;
  console.log(codStruttura)
  // Ottieni la data di oggi
  let oggi = new Date();
  //oggi.setHours(0, 0, 0, 0); // Azzera ore, minuti, secondi e millisecondi per ottenere la mezzanotte di oggi
  // Ottieni il timestamp per oggi
  let timestampOggi = oggi.getTime();

  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  const updateData = {
    stato: stato,
    messaggio: messaggio
  };


  console.log(updateData)

  try {
    
    const db = getFirestore();

    const docRef = db
      .collection("App")
      .doc(nomeUtente)
      .collection("PrenotazioniServizi")
      .where("id", "==", id);
    

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

      .then(() => {
        console.log("Documento aggiornato con successo");
        res
          .status(201)
          .json({ status: "ok", message: `Documento aggiornato con successo` });
      })
      .catch((error) => {
        console.error("Errore durante l'aggiornamento del documento:", error);
        res.status(500).json({ message: "errore durante l'aggiornamento del documento" });
      });
  } catch (error) {
    console.log(error.message)
    res.status(409).json({ message: error.message });
  }
};


export const getAllPrenotazioniServizi = async (req, res) => {

  const codStruttura = req.params.cod;
  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  try {

    let prenotazioni = [];
    const db = getFirestore();

    let customerRef = db
      .collection("App")
      .doc(nomeUtente)
      .collection("PrenotazioniServizi")
      .orderBy("dataGestione");
    customerRef.get().then((snapshot) => {
      snapshot.forEach((document) => {
        prenotazioni.push(document.data());
      });
      res.status(200).json(prenotazioni);
    });

  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getPrenotazioniServiziByUser = async (req, res) => {

  const { codStruttura, mail, codPrenotazione } = req.body;
  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  console.log(`cerco servizi ${codPrenotazione}`)
  try {

    let prenotazioni = [];
    const db = getFirestore();

    let customerRef = db
      .collection("App")
      .doc(nomeUtente)
      .collection("PrenotazioniServizi")
      //.orderBy("dataGestione")
      .where('mail', '==', mail)
      .where('codPrenotazione', '==', codPrenotazione);
    customerRef.get().then((snapshot) => {
      snapshot.forEach((document) => {
        prenotazioni.push(document.data());
      });
      res.status(200).json(prenotazioni);
    });

    
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};


export const getDisponibilitaServizi = async (req, res) => {

  const codStruttura = req.params.cod;
  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  try {

    let disponibilita = []
    let servizi = [];
    const db = getFirestore();
    // Ottieni la data di oggi nel fuso orario italiano
    let oggi = DateTime.now().setZone('Europe/Rome').startOf('day');
    let timestampOggi = oggi.toMillis();

    let customerRef = db
      .collection("App")
      .doc(nomeUtente)
      .collection("Servizi")
      .where("lingua", "==", "Italiano");
    customerRef.get().then((snapshot) => {
      snapshot.forEach((document) => {
        servizi.push(document.data());
      });
      console.log(servizi)
      //res.status(200).json(servizi);
    });

    let prenotazioni = [];
    let prenotazioniRef = db
      .collection("App")
      .doc(nomeUtente)
      .collection("PrenotazioniServizi")
      .orderBy("dataIni");
    prenotazioniRef.get().then((snapshot) => {
      snapshot.forEach((document) => {
        prenotazioni.push(document.data());
      });
      //console.log(prenotazioni)
      for (let i = 0; i <= 30; i++) {
        // Incrementa la data di un giorno nel fuso orario italiano
        let dataCorrente = oggi.plus({ days: i });
        let timestamp = dataCorrente.toMillis();
        console.log(`data giorno: ${convertiTimestampAData(timestamp)}`)
        let dispGiorno = {}
        let temp = []

        for (let ele of servizi) {


          console.log(`timestamp=${timestamp}`)
          const pren = prenotazioni.filter(x => (
            x.idServizio == ele.id && x.dataIni <= timestamp && x.dataFin >= timestamp && x.stato != "rifiutata"
          ));
          //console.log(pren.length);
          //console.log(`data ini: ${ele.dataIni}, timestamp: ${timestamp}`);
          let key = ele.nome;
          //let value = ele.quantita - pren.length;//disponibilità rimanente
          let value = pren.length;
          let n = 0;
          pren.forEach((element) => {
            //console.log(`data: ${convertiTimestampAData(element.dataIni)} - ${convertiTimestampAData(element.dataFin)}`)
            //console.log(`quantità: ${element.quantita}`)
            n = n + parseInt(element.quantita)
          })

          const dispData = {
            timestamp: timestamp,
            data: convertiTimestampAData(timestamp),
            nomeServizio: `${key} max(${ele.quantita})`,
            idServizio: ele.id,
            disponibilita: n,

          };

          temp.push(dispData)
          //dispGiorno[timestampToDate(timestamp)]=dispData

          //disponibilita[key] = value
        }

        disponibilita.push(temp)

      }
      res.status(200).json(disponibilita);
    });




  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

async function servizioById(id, nomeUtente) {
  try {
    const db = getFirestore();
    const documentRef = await db
      .collection("App")
      .doc(nomeUtente)
      .collection("Servizi")
      .doc(id)
      .get();
    if (documentRef.data() != undefined) {
      //res.json(documentRef.data());
      return documentRef.data();
    } else {
      return `errore`
    }
  } catch (error) {
    return `errore: ${error}`
  }

}








export const disponibilitaPerPrenotazione = async (req, res) => {
  const { codStruttura, idServizio, nomeServizio, dataIni, dataFin, ora, prodotto, quantita } = req.body;
  let disponibile = true;

  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  try {
    const servizio = await servizioById(idServizio, nomeUtente);
    console.log(`servizio: ${servizio}`);

    let disponibilitaXGiorni = {
      data: dataIni,
      stato: 'ok',
      quantitaPrenotata: 0,
    };

    console.log(`data di inizio: ${timestampToDate(dataIni)}`);
    console.log(`data di fine: ${timestampToDate(dataFin)}`);
    console.log('ora:' + ora.value);

    // Dividi gli orari in ore e minuti per la prenotazione corrente
    const [ore1Prenotazione, minuti1Prenotazione] = ora.value[0].split(':').map(Number);
    const [ore2Prenotazione, minuti2Prenotazione] = ora.value[1].split(':').map(Number);

    const ora1Prenotazione = DateTime.fromObject({ hour: ore1Prenotazione, minute: minuti1Prenotazione }, { zone: 'Europe/Rome' });
    const ora2Prenotazione = DateTime.fromObject({ hour: ore2Prenotazione, minute: minuti2Prenotazione }, { zone: 'Europe/Rome' });

    const oggi = DateTime.now().setZone('Europe/Rome').startOf('day');

    const db = getFirestore();
    let disponibilita = [];
    let prenotazioni = [];
    let prenotazioniRef = db
      .collection("App")
      .doc(nomeUtente)
      .collection("PrenotazioniServizi")
      .orderBy("dataIni");

    // Recupera le prenotazioni dal database
    const snapshot = await prenotazioniRef.get();
    snapshot.forEach((document) => {
      prenotazioni.push(document.data());
    });

    let cont = 0;
    for (let dataIter = dataIni; dataIter <= dataFin;) {
      let dataCorrente = new Date(dataIni);
      dataCorrente.setDate(dataCorrente.getDate() + cont);
      let timestamp = dataCorrente.getTime();
      dataIter = timestamp;

      // Filtra le prenotazioni per il giorno corrente e per il servizio
      const pren = prenotazioni.filter((x) => (
        x.idServizio == idServizio &&
        x.stato != "rifiutata" &&
        (x.dataIni <= dataIter && x.dataFin >= dataIter)
      ));

      console.log(`Data corrente: ${new Date(timestamp).toISOString()}, Prenotazioni trovate:`, pren);

      let nPrenotati = 0;

      for (let ele of pren) {
        const [eleore1, eleminuti1] = ele.ora.value[0].split(':').map(Number);
        const [eleore2, eleminuti2] = ele.ora.value[1].split(':').map(Number);
        const eleora1Prenotazione = DateTime.fromObject({ hour: eleore1, minute: eleminuti1 }, { zone: 'Europe/Rome' });
        const eleora2Prenotazione = DateTime.fromObject({ hour: eleore2, minute: eleminuti2 }, { zone: 'Europe/Rome' });

        // Verifica sovrapposizione tra la fascia oraria della prenotazione corrente e quella esistente
        if (
          (ora1Prenotazione <= eleora2Prenotazione && ora2Prenotazione >= eleora1Prenotazione) // Sovrapposizione
        ) {
          nPrenotati += parseInt(ele.quantita, 10);
        }
      }

      const quantitaDisponibile = servizio.quantita - nPrenotati;

      console.log(`Data: ${new Date(timestamp).toISOString()}, Quantità prenotata: ${nPrenotati}, Quantità disponibile: ${quantitaDisponibile}`);

      if (quantitaDisponibile >= quantita) {
        disponibilitaXGiorni = {
          data: timestamp,
          stato: 'ok',
          quantitaPrenotata: nPrenotati,
        };
      } else {
        disponibile = false;
        disponibilitaXGiorni = {
          data: timestamp,
          stato: 'pieno',
          quantitaPrenotata: nPrenotati,
        };
      }

      disponibilita.push(disponibilitaXGiorni);

      if (dataIter == dataFin) {
        break;
      }

      cont++;
    }

    console.log("calcolo disponibilita per prenotazione");
    console.log(`disponibile: ${disponibile} - disponibilità: ${disponibilita}`);
    res.status(200).json({ disponibile: disponibile, disponibilita });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const insertPrenotazioneRoomS = async (req, res) => {
  
  const { codStruttura, anagrafica, camera, stato, prodotti, codPrenotazione, mailPrenotazione, IdSchedaConto, IdSchedaContoRetta, messaggio, locationDelivery } = req.body;
  const ID = uuidv4();
  console.log(`cod: ${codStruttura}, anagrafica: ${anagrafica}, camera: ${camera}, stato: ${stato}, prodotti: ${prodotti}`)
  // Ottieni la data di oggi
  let oggi = new Date();
  
  // Ottieni il timestamp per oggi
  let timestampOggi = oggi.getTime();

  let prodotto = {
    idProdotto: "",
    descrizione: "",
    tipo: "",
    idTassa: 0,
    idLivelloRicavo: 0,
    prezzoListino: 0,
    prezzoLordo: 0,
    nEle: 0,
    note: ""
  }

  let prenotazione = {
    id: ID,
    anagrafica: anagrafica,
    camera: camera,
    dataGestione: timestampOggi,
    stato: stato,
    prodotti: prodotti,
    codPrenotazione: codPrenotazione,
    mailPrenotazione: mailPrenotazione,
    IdSchedaConto: IdSchedaConto,
    IdSchedaContoRetta: IdSchedaContoRetta,
    messaggio: messaggio,
    locationDelivery: locationDelivery
  }

  
  const prenotazioneJson = JSON.parse(stringify(prenotazione));
  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  try {

    const db = getFirestore();
    await db
      .collection("App")
      .doc(nomeUtente)
      .collection("PrenotazioniRoomS")
      .doc(ID)
      .set(prenotazioneJson);
    res.status(201).json({
      status: "ok",
      message: `nuova prenotazione ${anagrafica} inserita`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};



export const updatePrenotazioneRoomS = async (req, res) => {
  const id = req.params.id;
  console.log("Faccio update prenotazione RoomS")
  const {
    stato,
    codStruttura,
    messaggio,
    prodotti
  } = req.body;
  console.log(codStruttura)
  // Ottieni la data di oggi
  let oggi = new Date();
  
  // Ottieni il timestamp per oggi
  let timestampOggi = oggi.getTime();

  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  console.log("tipo prodotti:")
  console.log(typeof prodotti)

  let updateData = {}

  if (typeof prodotti == "object" && prodotti != null && prodotti != undefined) {

    updateData = {
      stato: stato,
      messaggio: messaggio,
      prodotti: prodotti
    };
  } else {
    updateData = {
      stato: stato,
      messaggio: messaggio
    };
  }


  console.log(updateData)

  try {
    
    const db = getFirestore();

    const docRef = db
      .collection("App")
      .doc(nomeUtente)
      .collection("PrenotazioniRoomS")
      .where("id", "==", id);
    

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

      .then(() => {
        console.log("Documento aggiornato con successo");
        res
          .status(201)
          .json({ status: "ok", message: `Documento aggiornato con successo` });
      })
      .catch((error) => {
        console.error("Errore durante l'aggiornamento del documento:", error);
        res.status(500).json({ message: "errore durante l'aggiornamento del documento" });
      });
  } catch (error) {
    console.log(error.message)
    res.status(409).json({ message: error.message });
  }
};





export const getPrenotazioniRoomSByUser = async (req, res) => {

  const { codStruttura, mail, codPrenotazione } = req.body;
  console.log(mail)
  console.log(codStruttura)
  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  try {

    let prenotazioni = [];
    const db = getFirestore();

    let customerRef = db
      .collection("App")
      .doc(nomeUtente)
      .collection("PrenotazioniRoomS")
      //.orderBy("dataGestione")
      .where("mailPrenotazione", "==", mail)
      .where("codPrenotazione", "==", codPrenotazione);
    customerRef.get().then((snapshot) => {
      snapshot.forEach((document) => {
        prenotazioni.push(document.data());
      });
      res.status(200).json(prenotazioni);
    });

  
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};


export const getPrenotazioniRoomS = async (req, res) => {

  const codStruttura = req.params.cod;

  let nomeUtente = await cercaNomeUtente(codStruttura);
  if (nomeUtente == null) {
    return res.json({ message: "empty user" });
  }

  try {

    let prenotazioni = [];
    const db = getFirestore();

    let customerRef = db
      .collection("App")
      .doc(nomeUtente)
      .collection("PrenotazioniRoomS")
      .orderBy("dataGestione")
    customerRef.get().then((snapshot) => {
      snapshot.forEach((document) => {
        prenotazioni.push(document.data());
      });
      res.status(200).json(prenotazioni);
    });

  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};