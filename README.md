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
- Prenotare servizi offerti dalla struttura.
- Prenotare e verificare lo stato delle prenotazioni (**confermate**, **rifiutate**, **in attesa**).

---

## 🎥 Demo

### Mobile App
![GIF Demo 3](https://github.com/user-attachments/assets/3cfbf040-30f7-4dc6-be65-0c59a5dfe5f5)  

### Backoffice
![GIF_20250113_202302_832](https://github.com/user-attachments/assets/84d9cb06-8a2a-4281-b7df-6bae65152059)
![GIF_20250113_202432_824](https://github.com/user-attachments/assets/5663188b-fba8-494c-af2c-2e11cfe6aa57)

### Prenotazione servizi tramite collegamento web
![GIF_20250113_202854_080](https://github.com/user-attachments/assets/4e45c80c-8054-4e4b-85fe-d03a9aeae9c4)
![GIF_20250113_203209_747](https://github.com/user-attachments/assets/2489080c-01f7-47da-9082-868ca39cdaf9)

---

