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


## Descrizione!


### Generale
Il software **Concierge** nasce con l'idea di essere venduto con canone annuale a strutture (alberghi ecc) per gestire la creazione, prenotazione e vendita di servizi ai loro clienti tramite mobile app o interfaccia web, tutta la fase di creazione e gestione è possibile da un backoffice web dove si potranno creare i prodotti, i servizi, card descrittive di vetrina per la struttura da far visualizzare nell'app ecc. Si è prestata particolare attenzione sul permettere al gestore della struttura l'indipendenza per personalizzare il più possibile l'interfaccia dell'app mobile in modo da restare coerente con loghi ed immagine generale della struttura.

### WebApp (Backoffice)
Il gestore della struttura gestirà tutto quello che riguarda il sistema da qui, potrà creare card che poi saranno visibili in app per descrivere quello che desidera (la storia dell'hotel, eventi disponibili, ristoranti affiliati o ristorante interno, luoghi circostanti da visitare ecc), gestirà la creazione dei servizi prenotabili, prodotti agganciabili, orari, disponibilità e conferma o rifiuto di prenotazioni da parte dei clienti.

![GIF_20250113_202302_832](https://github.com/user-attachments/assets/84d9cb06-8a2a-4281-b7df-6bae65152059)
![GIF_20250113_202432_824](https://github.com/user-attachments/assets/5663188b-fba8-494c-af2c-2e11cfe6aa57)


![GIF_20250113_202854_080](https://github.com/user-attachments/assets/4e45c80c-8054-4e4b-85fe-d03a9aeae9c4)
![GIF_20250113_203209_747](https://github.com/user-attachments/assets/2489080c-01f7-47da-9082-868ca39cdaf9)



### Mobile app (Android-Ios)
Dall'app mobile scaricabile dagli store android e apple i clienti dell'albergo avranno molteplici possibilità di accesso in base al tipo di configurazione del software: 
- se **Concierge** sarà interfacciato con il gestionale alberghiero indipendente della struttura i clienti potranno accedere con dei dati che saranno forniti dalla struttura (automaticamente in caso di modulo crm o manualmente) e questo consentirà un addebitamento automatico sulla scheda di soggiorno del cliente presente sul gestionale in caso di servizio in camera richiesto tramite app o acquisto di servizi (ovviamente dopo la conferma ricevuta dal backoffice), altrimenti potranno accedere come ospiti esterni ed in quel caso non i vari acquisti non verranno addebitati sul gestionale ed il pagamento passerà tramite **Concierge** con **Stripe** o direttamente di persona in struttura.
- se **Concierge** non risulta interfacciato con il gestionale alberghiero i metodi di login saranno tramite registrazione o ospite.

I login come ospite esterno o ospite avranno delle limitazioni che impediranno al cliente di accedere ad alcune sezioni dell'app visto la mancanza di una registrazione completa. In ogni caso il login come ospite è a discrezione della struttura è può essere disabilitato dal backoffice.
Una volta effettuato il login i clienti avranno diverse schermate dove potranno visualizzare informazioni sulla struttura, i prodotti per il servizio in camera, servizi disponibili, lo stato di prenotazione (confermata, rifiutata, in attesa) e molto altro.


![GIF_20250113_200116_271](https://github.com/user-attachments/assets/3cfbf040-30f7-4dc6-be65-0c59a5dfe5f5)




# Concierge App

Questo progetto è distribuito sotto licenza **Apache License 2.0**. Consulta il file [LICENSE](./LICENSE) per ulteriori dettagli.

---

## ⚠️ Attenzione!

Il codice caricato **non è la versione finale**. È volutamente incompleto in alcune parti: molte sezioni di codice sono state sostituite con `//PRIVATO`, e alcuni file completi non sono stati caricati. Pertanto, **tentare di eseguirlo genererà errori**.

---

## 📝 Premesse

Il software è stato sviluppato interamente da me in circa **10 mesi**. L’obiettivo iniziale era completarlo in **6 mesi**, ma le richieste di nuove funzionalità nel corso del progetto hanno inevitabilmente allungato i tempi di sviluppo.

Gran parte del lavoro è stato svolto in fretta, con poca attenzione ai dettagli. Sono consapevole delle criticità a livello strutturale del codice: in alcuni casi risulta caotico, poco ottimizzato e difficile da leggere. Nonostante ciò, il progetto è completamente funzionante e attualmente online.

Una revisione approfondita del codice sarebbe necessaria per migliorarne la qualità, ma al momento non la ritengo prioritaria per motivi di tempo e costi. Ho comunque deciso di rendere pubblico parte del codice a fini di **portfolio personale**.

---

## 💻 Stack Tecnologico

- **Node.js** (backend)
- **React** (frontend)
- **Flutter** (mobile)

Il sistema utilizza **Firebase** sia per:
- Il database **NoSQL**.
- L’hosting del frontend e del backend tramite **Cloud Functions**.

---

## 📖 Descrizione

### Generale
**Concierge** è un software pensato per essere venduto con un **canone annuale** a strutture (es. alberghi). Consente la gestione di creazione, prenotazione e vendita di servizi tramite **mobile app** o **interfaccia web**.

La gestione avviene tramite un **backoffice web**, dove il gestore può configurare prodotti, servizi e card descrittive da visualizzare nell’app. È stata posta particolare attenzione alla personalizzazione dell’interfaccia mobile, per mantenerla coerente con l’immagine della struttura.

---

### 🌐 WebApp (Backoffice)

Il backoffice permette al gestore della struttura di:
- Creare card informative visibili nell’app (es. storia dell’hotel, eventi, ristoranti affiliati, luoghi d’interesse).
- Gestire la creazione di servizi prenotabili, prodotti associabili, orari e disponibilità.
- Confermare o rifiutare prenotazioni inviate dai clienti.

---

### 📱 Mobile App (Android/iOS)

L’app mobile, scaricabile dagli store **Android** e **Apple**, offre diverse modalità di accesso in base alla configurazione del sistema:

1. **Interfacciamento con gestionale alberghiero**  
   - I clienti accedono con credenziali fornite dalla struttura.  
   - I servizi richiesti (es. servizio in camera) vengono **addebitati automaticamente** sulla scheda di soggiorno del gestionale, previa conferma dal backoffice.  
   - Accesso come ospiti esterni: in questo caso, il pagamento avviene tramite **Concierge** (con Stripe) o direttamente in struttura.

2. **Senza interfacciamento con gestionale alberghiero**  
   - L’accesso avviene tramite registrazione o come ospiti.

**Nota:** l’accesso come ospite è limitato e opzionale. Il gestore può disattivarlo dal backoffice.

Una volta effettuato il login, i clienti possono:
- Visualizzare informazioni sulla struttura.
- Consultare prodotti per il servizio in camera.
- Prenotare e verificare lo stato delle prenotazioni (**confermate**, **rifiutate**, **in attesa**).

---

## 🎥 Demo

### Backoffice
![GIF Demo 1](https://github.com/user-attachments/assets/84d9cb06-8a2a-4281-b7df-6bae65152059)  
![GIF Demo 2](https://github.com/user-attachments/assets/5663188b-fba8-494c-af2c-2e11cfe6aa57)  

### Mobile App
![GIF Demo 3](https://github.com/user-attachments/assets/3cfbf040-30f7-4dc6-be65-0c59a5dfe5f5)  

---

## 💡 Considerazioni Finali

Il progetto rappresenta un esempio significativo delle mie capacità di sviluppo **full stack** e gestione di progetti complessi. Sebbene il codice necessiti di una revisione per migliorarne la qualità, ho deciso di condividerlo pubblicamente a fini di portfolio.




