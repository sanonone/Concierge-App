import { useState, useEffect, useLayoutEffect } from "react";
import PrivateRoutes from "./components/PrivateRoutes";
import NavbarResponcive from "./components/NavbarResponcive";
import Table from "./components/DataTable";
import Button from '@mui/material/Button';
import NestedList from "./components/ListPrenotazioni";
import FormDialog from "./components/DialogServizi";
import Footer from "./components/Footer";
import ScrollToTopButton from './components/ScrollToTopButton';
import LogoConcierge from "./assets/LogoConcierge.png";
import suonoNotifica from "./assets/suoneriaNotifica.mp3";
import { sendNotification } from './components/sendNotification';
import { useNotification } from './context/NotificationContext.jsx';
import { getToken } from "firebase/messaging";
import { messaging } from "./firebaseConfig.js";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const { VITE_APP_VAPID_KEY } = import.meta.env;

const showNotification = (title, body) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: LogoConcierge
    });
    const audio = new Audio(suonoNotifica);
    audio.play();
  }
};

function reloadPage() {
  window.location.reload();
}

function App(props) {
  const url = props.url;
  const [data, setData] = useState([]);
  const [servizi, setServizi] = useState([]);
  const [dataCompleto, setDataCompleto] = useState([]);
  const [disponibilita, setDisponibilita] = useState(null);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [loading, setLoading] = useState(false);


  const codStruttura = sessionStorage.getItem("codStruttura");
  const ipDB = sessionStorage.getItem("ipStruttura");
  const DBname = sessionStorage.getItem("DBname");
  const IdAzienda = sessionStorage.getItem("IdAzienda");
  const idStripe = sessionStorage.getItem("idStripe") ?? ''

  //stripe
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState();
  const [accountLinkCreatePending, setAccountLinkCreatePending] = useState(false);
  const [error, setError] = useState(false);

  const { noMostraBadge, fetchDynamicItems } = useNotification();


  const modificaTokenNotify = async (tokenNotify) => {
    try {
      const token = sessionStorage.getItem('token');
      const ID = sessionStorage.getItem('IdUser');
      await fetch(`${url}auth/updateUserTokenNotify/${ID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ tokenNotify }),
      });
    } catch (errore) {
      console.error("Errore nella richiesta di modifica:", errore);
    }
  };

  const handleSendNotification = async () => {
    const success = await sendNotification({ title, body, token, image });
    if (success) {
      alert('Notification sent successfully');
    } else {
      alert('Failed to send notification');
    }
  };

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const tokenN = await getToken(messaging, { vapidKey: VITE_APP_VAPID_KEY });
      console.log("Token generated : ", tokenN);
      modificaTokenNotify(tokenN);
    } else {
      //alert("Non riceverai nessuna notifica per nuove pernotazioni o altro");
    }
  };

  const fetchDisponibilitaServizi = async (token) => {
    const requestOptions = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    const response = await fetch(`${url}servizi/getDisponibilitaServizi/${codStruttura}`, requestOptions);
    const disp = await response.json();
    setDisponibilita(disp);
  };

  const fetchServizi = async (token) => {
    const requestOptions = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    const response = await fetch(`${url}servizi/${codStruttura}`, requestOptions);
    const data = await response.json();
    const filterData = data.filter(doc => doc.lingua === "Italiano");
    setDataCompleto(data);
    setData(filterData);
  };

  const fetchProdottiServizi = async (token) => {
    const config = sessionStorage.getItem("tipoConfigurazione");

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ip: ipDB,
        DBname: DBname,
        IdAzienda: IdAzienda
      }),
    };

    const requestOptions2 = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    switch (config) {
      case "Suite":
        //const url = `${urlDev}ristoranti/${codStruttura}`;    
        const response = await fetch(`${url}suite/prodottiServizi`, requestOptions);
        const data = await response.json();
        setServizi(data);
        break;

      case "Standard":
        fetch(`${url}prodotti/${codStruttura}`, requestOptions2)
          .then((response) => response.json())
          .then((data) => {
            console.log("fatto")
            setServizi(data)
          });
        break;

      default:
        break;
    }



  };



  useEffect(() => {

    const initializeData = async () => {
      await requestPermission();
      const token = sessionStorage.getItem('token');


      if (token) {
        //await fetchDisponibilitaServizi(token);
        await fetchServizi(token);
        await fetchProdottiServizi(token);
        setIsLoadingTable(false);
        await fetchDynamicItems();
        await noMostraBadge();
        setLoading(false);
      }
    };
    initializeData();
  }, []);

 

  const handleConnect = () => {
    // Reindirizza l'utente all'endpoint /connect nel backend
    window.location.href = '/connect';
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">


        <PrivateRoutes />
        <NavbarResponcive tab="home" />

        <main className="flex-grow">

          <div className="h-auto mt-16 flex flex-row">
            <h1 className="text-sky-900 text-4xl font-bold p-6">Home</h1>

            {idStripe != '' ?
              <button
                className=" transition-all duration-300 focus:outline-none focus:ring bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-500 text-white font-bold py-3 px-2 rounded-2xl ml-auto mt-auto mr-10"
                onClick={() => window.open('https://dashboard.stripe.com/', '_blank')}
              >Stripe</button>
              :
              null
            }

          </div>


          {
            /*
          <div>
            {isLoadingTable ?

              <p className="flex justify-center">Caricamento... (se non carica probabile errore di connessione al database del gestionale)</p>
              :
              <Table prenotazioni={disponibilita} />}
          </div>  
            */
          }

          {/*<div className="overflow-y-auto max-h-60 ml-10 mr-10 mb-2" onClick={handleClick}></div>*/}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <Typography variant="h6">Caricamento dati in corso...</Typography>
            </Box>
          ) : (
            <div className="flex justify-center mt-10 mx-screen">
              <NestedList url={url} prodottiServizi={servizi} servizi={data} showNotification={showNotification} />
            </div>
          )}


          <ScrollToTopButton />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
