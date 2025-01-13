import Navbar from "../components/Navbar";
import NavbarResponcive from "../components/NavbarResponcive"
import { useState, useEffect } from "react";
import CardForm from "../components/CardForm";
import Servizio from "../components/Servizio";
import Footer from "../components/Footer";
import PrivateRoutes from "../components/PrivateRoutes";
import ScrollToTopButton from '../components/ScrollToTopButton';
import { useNotification } from '../context/NotificationContext.jsx'
import LogoConcierge from "../assets/LogoConcierge.png";
import suonoNotifica from "../assets/suoneriaNotifica.mp3"

function Servizi(props) {


  const [deleteServizio, setDeleteServizio] = useState(0);
  const [servizi, setServizi] = useState([]);
  const codStruttura = sessionStorage.getItem("codStruttura");
  const url = props.url
  let ipDB = sessionStorage.getItem("ipStruttura")
  let DBname = sessionStorage.getItem("DBname")
  let IdAzienda = sessionStorage.getItem("IdAzienda")
  const config = sessionStorage.getItem("tipoConfigurazione");

  const [data, setData] = useState([]);
  const [dataCompleto, setDataCompleto] = useState([]);
  const [deleteHotel, setDeleteHotel] = useState(0);
  const [formLingua, setFormLingua] = useState("Italiano")



  const { dynamicItems, dynamicItemsCar, processedItems, processedItemsCar } = useNotification();

  // Funzione per mostrare la notifica
  const showNotification = (title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: LogoConcierge // Opzionale: specifica un'icona
      }

      );

      const audio = new Audio(suonoNotifica);
      audio.play();

    }
  };

  useEffect(() => {
    console.log('Dynamic Items:', dynamicItems);
    console.log('Dynamic Items Car:', dynamicItemsCar);

    //showNotification("Concierge T&T", "Nuove prenotazioni")

  }, [dynamicItems, dynamicItemsCar]);





  const handleInputChangeLingua = (e) => {
    const { name, value } = e.target
    setFormLingua(value)
    console.log(value)
  }


  const eliminazioneServizio = () => {
    setDeleteServizio(deleteServizio + 1);
    console.log("servizio eliminato");
  };

  const getServizi = async () => {
    const token = sessionStorage.getItem('token');


    // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
    const requestOptions = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    fetch(`${url}servizi/${codStruttura}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        const filterData = data.filter(doc => doc.lingua == formLingua)
        console.log("fatto")
        setDataCompleto(data)
        setData(filterData);
      });
  };

  useEffect(() => {
    if (dataCompleto.length === 0) {
      console.log("vuoto")
      const token = sessionStorage.getItem('token');

      // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
      const requestOptions = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const requestOptions2 = {
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

      fetch(`${url}servizi/${codStruttura}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          const filterData = data.filter(doc => doc.lingua == formLingua)
          console.log("fatto")
          setDataCompleto(data)
          setData(filterData);
          console.log(data);
        });

      switch (config) {
        case "Suite":
          fetch(`${url}suite/prodottiServizi`, requestOptions2)
            .then((response) => response.json())
            .then((data) => {
              setServizi(data);
              console.log(data);
            });
          break;

          case "Standard":
            fetch(`${url}prodotti/${codStruttura}`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log("fatto")
                setServizi(data)
            });
          break;

        default:
          break;
      }

    }
    else {
      const filterData = dataCompleto.filter(doc => doc.lingua == formLingua)
      console.log("fatto")
      setData(filterData);
    }
  }, [formLingua]); //con questa dipendenza aggiorna ogni volta che count cambia, se levo dipendenze si agiorna ad ogni cambiamento

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <PrivateRoutes></PrivateRoutes>
        {/*<Navbar tab="servizi"></Navbar>*/}
        <NavbarResponcive tab="servizi"></NavbarResponcive>
        <main className="flex-grow">
          <div className=" h-auto mt-16 flex flex-row">
            <h1 className=" text-sky-900 text-4xl font-bold p-6">Servizi</h1>
            <select
              className="border-2 bg-sky-400 hover:bg-slate-400 text-white font-semibold focus:outline-none focus:border-sky-500 rounded-md h-8 w-30 ml-auto mt-auto mr-10 transition-all duration-300"
              id="lingua"
              value={formLingua}
              onChange={handleInputChangeLingua}
            >
              <option value="Italiano">Italiano</option>
              <option value="Inglese">Inglese</option>
            </select>
          </div>
          <div className=" flex sm:flex-row flex-col bg-gray-200 border-y-2 border-gray-300 h-max justify-between gap-5">
            <div className=" sm:m-4 m-10 flex items-start ">
              <CardForm getServizi={getServizi} url={url} servizi={servizi}></CardForm>
            </div>

            <div className="  grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2  grid-cols-1 gap-10 m-10  ">
              {data.map((ser) => (
                <Servizio
                  key={ser.id}
                  id={ser.id}
                  nome={ser.nome}
                  descrizione={ser.descrizione}
                  immagine={ser.immagine}
                  visDataIni={ser.visDataIni}
                  visDataFin={ser.visDataFin}
                  dataIni={ser.dataIni}
                  dataFin={ser.dataFin}
                  orari={ser.orari}
                  prodotti={ser.prodotti}
                  prodottiFasce={ser.prodottiFasce}
                  quantita={ser.quantita}
                  qMaxPrenotabile={ser.qMaxPrenotabile}
                  posizione={ser.posizione}
                  lingua={ser.lingua}
                  pagamentoType={ser.pagamentoType}
                  percentualeAcconto={ser.percentualeAcconto}
                  visibileWeb={ser.visibileWeb}
                  visibileApp={ser.visibileApp}
                  visibileAppGuest={ser.visibileAppGuest}
                  codStruttura={codStruttura}
                  getServizi={getServizi}
                  url={url}
                  servizi={servizi}
                ></Servizio>
              ))}
            </div>
          </div>
          <ScrollToTopButton></ScrollToTopButton>
        </main>
        <Footer></Footer>
      </div>
    </>
  );
}

export default Servizi;
