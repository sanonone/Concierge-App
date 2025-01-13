import { config } from './config.js';
import admin from 'firebase-admin'
import express from 'express'
import authRoutes from './routes/auth.js'
import serviziRoutes from './routes/servizi.js'
import eventiRoutes from './routes/eventi.js'
import hotelRoutes from './routes/hotel.js'
import visitaRoutes from './routes/visita.js'
import ristorantiRoutes from './routes/ristoranti.js'
import suiteRoutes from './routes/suite.js'
import messaggiRoutes from './routes/messaggi.js'
import mobileUserRoutes from './routes/mobileUser.js'
import appHomeCardRoutes from './routes/appHomeCard.js'
import stripeRouters from './routes/stripe.js'
import prodottiRouters from './routes/prodotti.js'
import nodiProdottiRoutes from './routes/nodiProdotti.js'
import cors from 'cors'
import { authenticateToken } from './middlewares/auth.js';


//import per firebase
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import cron from 'node-cron'

import Stripe from 'stripe';



const app = express()

const PORT = config.PORT || 3000 //COMMENTARE PER DEPLOY FIREBASE

//sezione firebase

const apps = getApps()

if (!apps.length) {
    initializeApp({
        credential: cert(config.CREDENTIAL),
        storageBucket: 'gs://fir-autenticazione-d201f.appspot.com'
    })
}

// Configurazione di Multer per gestire il caricamento di file
//const upload = multer({ dest: 'uploads/' });//vecchia versione che funziona ma da errore sul deploy

const fcm = admin.messaging();

const bucket = admin.storage().bucket();


const stripe = new Stripe(
    config.STRIPE_SECRET_KEY,
    {
        apiVersion: '2023-10-16',
    }
);



app.use(cors())

app.use(express.json({ limit: '50mb' }));  // Per gestire payload di grandi dimensioni
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' })); // per gestire i buffer raw nelle req
//app.use('/users', authenticateToken, usersRoutes)//ogni volta che riceve una chiamata che inizia per '/users' deve essere gestita da userRoutes (che si riferisce al file creato nella cartella routes)
app.use('/auth', authRoutes)
app.use('/servizi', authenticateToken, serviziRoutes)
//app.use('/eventi', authenticateToken, eventiRoutes)
app.use('/eventi', authenticateToken, eventiRoutes)
app.use('/suite', authenticateToken, suiteRoutes)//disattivato per evitare costi su deploy
app.use('/hotel', authenticateToken, hotelRoutes)
app.use('/visita', authenticateToken, visitaRoutes)
app.use('/ristoranti', authenticateToken, ristorantiRoutes)
//app.use('/mssql', mssqlRoutes)
app.use('/appHomeCard', authenticateToken, appHomeCardRoutes)
app.use('/messaggi', authenticateToken, messaggiRoutes)
app.use('/mobileUser', authenticateToken, mobileUserRoutes)
app.use('/stripe',authenticateToken,stripeRouters)
app.use('/prodotti', authenticateToken, prodottiRouters)
app.use('/nodiProdotti',authenticateToken, nodiProdottiRoutes)



app.get('/', (req, res) => {
    console.log('chiamata get homepage')
    res.send('Benvenuto nella homepage')

})



async function deleteOldDocuments() {
    console.log("FACCIO AUTOMATISMO");
    let nomiStrutture = [];
    try {
        const db = getFirestore();

        // Ricerca nomi struttura
        const usersRef = db.collection('AppUsers');
        const now = new Date();
        const cutoffDateMessaggi = now.getTime() - 30 * 24 * 60 * 60 * 1000; // 30 giorni fa in millisecondi
        const cutoffDateGuest = now.getTime() - 12 * 24 * 60 * 60 * 1000; // 12 giorni fa in millisecondi
        const cutoffDateMobileUsers = now.getTime() - 60 * 24 * 60 * 60 * 1000; // 2 giorni fa in millisecondi
        const cutoffDatePrenotazioni = now.getTime() - 45 * 24 * 60 * 60 * 1000; // 45 giorni fa in millisecondi

        const querySnapshotUsers = await usersRef.get();

        if (!querySnapshotUsers.empty) {
            console.log('Cerco i nomi struttura per fare eliminazione.');

            querySnapshotUsers.forEach((doc) => {
                console.log('i documenti sono: ' + doc.id);
                nomiStrutture.push(doc.id);
            });

            // Eliminazione messaggi dopo un mese
            for (const element of nomiStrutture) {
                // Eliminazione messaggi dopo un mese
                const messaggiRef = db.collection('App').doc(element).collection('Messaggi');
                console.log(`data: ${cutoffDateMessaggi}`)
                const querySnapshotMessaggi = await messaggiRef.where('dataGestione', '<', cutoffDateMessaggi).get();

                if (!querySnapshotMessaggi.empty) {
                    const batch = db.batch();

                    querySnapshotMessaggi.forEach((doc) => {
                        batch.delete(doc.ref);
                    });

                    await batch.commit();
                    console.log('Messaggi vecchi eliminati con successo per struttura:', element);
                } else {
                    console.log('Nessun messaggio da eliminare per struttura:', element);
                }

                //Eliminazione guest

                const guestRef = db.collection('App').doc(element).collection('MobileUser').where('tipo','==','esterno');
                console.log(`data: ${cutoffDateGuest}`)
                const querySnapshotGuest = await guestRef.where('dataRegistrazione', '<', cutoffDateGuest).get();

                if (!querySnapshotGuest.empty) {
                    const batch = db.batch();

                    querySnapshotGuest.forEach((doc) => {
                        batch.delete(doc.ref);
                    });

                    await batch.commit();
                    console.log('Users Guest vecchi eliminati con successo per struttura:', element);
                } else {
                    console.log('Nessun Guest da eliminare per struttura:', element);
                }

                //Eliminazione mobile users
                /*
                const mobileRef = db.collection('App').doc(element).collection('Messaggi');
                console.log(`data: ${cutoffDateMessaggi}`)
                const querySnapshotMobile = await mobileRef.where('dataGestione', '<', cutoffDateMobileUsers).get();

                if (!querySnapshotMobile.empty) {
                    const batch = db.batch();

                    querySnapshotMobile.forEach((doc) => {
                        batch.delete(doc.ref);
                    });

                    await batch.commit();
                    console.log('Messaggi vecchi eliminati con successo per struttura:', element);
                } else {
                    console.log('Nessun messaggio da eliminare per struttura:', element);
                }

                */

                //Eliminazione prenotazioni

                //RoomS
                const roomSRef = db.collection('App').doc(element).collection('PrenotazioniRoomS');
                console.log(`data: ${cutoffDatePrenotazioni}`)
                const querySnapshotRoomS = await roomSRef.where('dataGestione', '<', cutoffDatePrenotazioni).get();

                if (!querySnapshotRoomS.empty) {
                    const batch = db.batch();

                    querySnapshotRoomS.forEach((doc) => {
                        batch.delete(doc.ref);
                    });

                    await batch.commit();
                    console.log('Prenotazioni RoomS vecchie eliminate con successo per struttura:', element);
                } else {
                    console.log('Nessun prenotazione RoomS da eliminare per struttura:', element);
                }


                //Servizi
                const serviziRef = db.collection('App').doc(element).collection('PrenotazioniServizi');
                console.log(`data: ${cutoffDatePrenotazioni}`)
                const querySnapshotServizi = await serviziRef.where('dataGestione', '<', cutoffDatePrenotazioni).get();

                if (!querySnapshotServizi.empty) {
                    const batch = db.batch();

                    querySnapshotServizi.forEach((doc) => {
                        batch.delete(doc.ref);
                    });

                    await batch.commit();
                    console.log('Prenotazioni Servizi vecchie eliminate con successo per struttura:', element);
                } else {
                    console.log('Nessun prenotazione Servizi da eliminare per struttura:', element);
                }

            }
        } else {
            console.log('Nessuna struttura trovata.');
        }


    } catch (error) {
        console.error('Errore durante l\'eliminazione dei documenti:', error);
    }
}


// Schedula la funzione per eseguire ogni giorno alle 18:10 ora italiana
cron.schedule('29 10 * * *', () => {
    console.log('Esecuzione della cancellazione dei documenti vecchi...');
    deleteOldDocuments();
}, {
    scheduled: true,
    timezone: "Europe/Rome"
});

app.post('/sendNotification', async (req, res) => {
    const { title, body, image, token } = req.body;
    console.log(`Token per mandare la notifica è: ${token}`);
    console.log(`il req.body per mandare la notifica è: `)
    console.log(req.body)

    // Funzione per inviare una notifica a un singolo token
    const sendNotification = async (token) => {
        const payload = {
            token: token,
            notification: {
                title: title,
                body: body,
                image: image,
            },
            data: {
                body: body,
            },
        };

        const payload2 = {
            token: token,
            data: {
                "key1": "value1",
                "key2": "value2"
            },
        };




        try {
            if (title == "_updated") {
                const response = await fcm.send(payload);
                console.log('Successfully sent message payload2:', response);
                return { success: true, response: `Successfully sent message: ${response}` };
            } else {
                const response = await fcm.send(payload);
                console.log('Successfully sent message:', response);
                return { success: true, response: `Successfully sent message: ${response}` };
            }


        } catch (error) {
            console.error('Error sending message:', error);
            return { error: `Error sending message: ${error.message}` };
        }
    };

    try {
        let responses;
        if (Array.isArray(token)) {
            // Se il token è un array, invia una notifica per ogni token
            responses = await Promise.all(token.map(sendNotification));
        } else {
            // Se il token è una stringa, invia una singola notifica
            responses = await sendNotification(token);
        }
        res.status(200).json(responses);
    } catch (error) {
        res.status(400).json({ error: `Error sending notifications: ${error.message}` });
    }
});



app.post('/upload', async (req, res) => {
    const { image, folder, id } = req.body;

    if (!image || !folder || !id) {
        return res.status(400).json({ error: 'No image uploaded or missing fields' });
    }

    try {
        const base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64EncodedImageString, 'base64');
        const filepath = `conciergeTT/${folder}/${id}`;
        const file = bucket.file(filepath);

        const stream = file.createWriteStream({
            metadata: {
                contentType: 'image/jpeg', // or other appropriate content type
            },
        });

        stream.on('error', (err) => {
            console.log('Error uploading to Firebase:', err.message);
            res.status(500).send({ error: err.message });
        });

        stream.on('finish', async () => {
            try {
                const [url] = await file.getSignedUrl({ action: 'read', expires: '01-01-3000' });
                console.log('File uploaded to Firebase:', file.name);
                res.status(200).json({ message: 'Upload successful', imageUrl: url });
            } catch (err) {
                console.log('Error generating signed URL:', err.message);
                res.status(500).json({ error: err.message });
            }
        });

        stream.end(imageBuffer);
    } catch (err) {
        console.error('Error processing image upload:', err);
        res.status(500).json({ error: 'Error processing image upload' });
    }
});


app.delete('/delete/:folder/:imageName', async (req, res) => {
    const folder = req.params.folder;
    const imageName = req.params.imageName;

    try {
        const imagePath = `conciergeTT/${folder}/${imageName}`;
        await bucket.file(imagePath).delete();
        console.log('Image deleted successfully');
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});





//export const api = functions.region('europe-west1').https.onRequest(app);//ATTIVARE PER DEPLOY SU FIREBASE


app.listen(PORT, () => {//server in ascolto COMMENTARE QUANDO FACCIO DEPLOY SU FIREBASE
    console.log(`server running on port: ${PORT}`)
})


