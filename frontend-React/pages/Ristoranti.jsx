import Navbar from "../components/Navbar";
import NavbarResponcive from "../components/NavbarResponcive"
import CardFormRistoranti from "../components/CardFormRistoranti";
import HotelCard from "../components/HotelCard";
import RistorantiCard from "../components/RistorantiCard";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import PrivateRoutes from "../components/PrivateRoutes";
import ScrollToTopButton from '../components/ScrollToTopButton';

function Ristoranti(props) {

  const [deleteRistorante, setDeleteRistorante] = useState(0);
  const codStruttura = sessionStorage.getItem("codStruttura");
  const url = props.url

  const [data, setData] = useState([]);
  const [dataCompleto, setDataCompleto] = useState([]);
  const [deleteHotel, setDeleteHotel] = useState(0);
  const [formLingua, setFormLingua] = useState("Italiano")

  const handleInputChangeLingua = (e) => {
    const { name, value } = e.target
    setFormLingua(value)
    console.log(value)
  }


  const eliminazioneRistorante = () => {
    setDeleteRistorante(deleteRistorante + 1);
    console.log("ristorante eliminato");
  };

  const getRistoranti = async () => {
    const token = sessionStorage.getItem('token');


    // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
    const requestOptions = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    fetch(`${url}ristoranti/${codStruttura}`, requestOptions)
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
      const token = sessionStorage.getItem('token');


      // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
      const requestOptions = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      //const url = `${urlDev}ristoranti/${codStruttura}`;    
      fetch(`${url}ristoranti/${codStruttura}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          const filterData = data.filter(doc => doc.lingua == formLingua)
          console.log("fatto")
          setDataCompleto(data)
          setData(filterData);
          console.log(data);
        });
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
        {/*<Navbar tab="ristoranti"></Navbar>*/}
        <NavbarResponcive tab="ristoranti"></NavbarResponcive>
        <main className="flex-grow">
          <div className=" h-auto mt-16 flex flex-row">
            <h1 className=" text-sky-900 text-4xl font-bold p-6">Ristoranti</h1>
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
            <div className=" sm:m-4 m-10 flex items-start">
              <CardFormRistoranti getRistoranti={getRistoranti} url={url}></CardFormRistoranti>
            </div>
            <div className="  grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2  grid-cols-1 gap-10 m-10  ">
              {data.map((ser) => (
                <RistorantiCard
                  key={ser.id}
                  id={ser.id}
                  nome={ser.nome}
                  descrizione={ser.descrizione}
                  immagine={ser.immagine}
                  linkmappa={ser.linkmappa}
                  linkmenu={ser.linkmenu}
                  posizione={ser.posizione}
                  lingua={ser.lingua}
                  codStruttura={codStruttura}
                  getRistoranti={getRistoranti}
                  url={url}
                ></RistorantiCard>
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

export default Ristoranti;
