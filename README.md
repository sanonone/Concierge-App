# Concierge app

Questo progetto è distribuito sotto licenza Apache License 2.0. Consulta il file LICENSE per ulteriori dettagli.

## Attenzione!!
Il codice caricato non è la versione finale, è volutamente incompleto in alcune parti, mancano molte sezioni di codice che sono state sostituite da *"//PRIVATO"* e completi file non caricati, quindi tentandone l'esecuzione darà errori.

## Premesse
Il software è stato sviluppato unicamente da me in circa 10 mesi, inizialmente l'obbiettivo e la necessità era di finire tutto in 6 mesi quindi buona parte del lavoro è stato fatto di fretta senza prestare la giusta attenzione ai dettagli (sono consapevole delle criticità a livello strutturale del codice, risulta in molti casi caotico, poco ottimizzato e poco leggibile), oltre a questo con l'avanzare dei mesi mi sono state richieste nuove funzionalità da aggiungere che hanno ovviamente allungato i tempi di sviluppo. In generale il progetto si è rivelato molto più complesso e lungo del previsto ed anche se totalmente funzionante e attualmente online avrebbe comunque bisogno di una ripassata approfondita per ripulire tutto il codice che al momento non faccio per questioni di costo a livello di tempo che non mi verrebbero ripagate in nessun modo. Nonostante questo ho comunque deciso di mettere parte del codice pubblico ai soli fini di portfolio.

## Stack tecnologico

- ### Node.js (backend)

- ### React (frontend)

- ### Flutter (mobile)

Il tutto si appoggia su firebase sia per quanto riguarda il DB noSQL che per l'hosting del frontend ed il backend con cloud functions


## Descrizione

### Generale
Il software **Concierge** nasce con l'idea di essere venduto con canone annuale a strutture (alberghi ecc) per gestire la creazione, prenotazione e vendita di servizi ai loro clienti tramite mobile app o interfaccia web, tutta la fase di creazione e gestione è possibile da un backoffice web dove si potranno creare i prodotti, i servizi, card descrittive di vetrina per la struttura da far visualizzare nell'app ecc. Si è prestata particolare attenzione sul permettere al gestore della struttura l'indipendenza per personalizzare il più possibile l'interfaccia dell'app mobile in modo da restare coerente con loghi ed immagine generale della struttura.

### WebApp (Backoffice)
Il gestore della struttura gestirà tutto quello che riguarda il sistema da qui, potrà creare card che poi saranno visibili in app per descrivere quello che desidera (la storia dell'hotel, eventi disponibili, ristoranti affiliati o ristorante interno, luoghi circostanti da visitare ecc), gestirà la creazione dei servizi prenotabili, prodotti agganciabili, orari, disponibilità e conferma o rifiuto di prenotazioni da parte dei clienti.

caricare foto video ecc

### Mobile app (Android-Ios)
Dall'app mobile scaricabile dagli store android e apple i clienti dell'albergo avranno molteplici possibilità di accesso in base al tipo di configurazione del software: 
- se **Concierge** sarà interfacciato con il gestionale alberghiero indipendente della struttura i clienti potranno accedere con dei dati che saranno forniti dalla struttura (automaticamente in caso di modulo crm o manualmente) e questo consentirà un addebitamento automatico sulla scheda di soggiorno del cliente presente sul gestionale in caso di servizio in camera richiesto tramite app o acquisto di servizi (ovviamente dopo la conferma ricevuta dal backoffice), altrimenti potranno accedere come ospiti esterni ed in quel caso non i vari acquisti non verranno addebitati sul gestionale ed il pagamento passerà tramite **Concierge** con **Stripe** o direttamente di persona in struttura.
- se **Concierge** non risulta interfacciato con il gestionale alberghiero i metodi di login saranno tramite registrazione o ospite.

I login come ospite esterno o ospite avranno delle limitazioni che impediranno al cliente di accedere ad alcune sezioni dell'app visto la mancanza di una registrazione completa. In ogni caso il login come ospite è a discrezione della struttura è può essere disabilitato dal backoffice.
Una volta effettuato il login i clienti avranno diverse schermate dove potranno visualizzare informazioni sulla struttura, i prodotti per il servizio in camera, servizi disponibili, lo stato di prenotazione (confermata, rifiutata, in attesa) e molto altro.

caricare foto ecc


