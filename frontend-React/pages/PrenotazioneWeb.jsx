import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import ScrollToTopButton from '../components/ScrollToTopButton';
import { useParams } from "react-router-dom";
import CardPrenotazioneWeb from '../components/Mui/CardPrenotazioneWeb'

function PrenotazioneWeb(props) {

  const { codStruttura } = useParams();

  const [deleteRistorante, setDeleteRistorante] = useState(0);
  //const codStruttura = sessionStorage.getItem("codStruttura");
  const url = props.url


  const [titleLabel, setTitleLabel] = useState("Servizi Prenotabili")
  const [usernameLabel, setUsernameLabel] = useState("")
  const [labelButton, setLabelButton] = useState("Prenota")
  const [token, setToken] = useState("")
  const [idStripe, setIdStripe] = useState("")
  const [tokenNotify, setTokenNotify] = useState([])
  const [data, setData] = useState([]);
  const [dataCompleto, setDataCompleto] = useState([]);
  const [prodottiServizi, setProdottiServizi] = useState([]);
  const [deleteHotel, setDeleteHotel] = useState(0);
  const [formLingua, setFormLingua] = useState("Italiano")
  const [timestampToday, setTimestampToday] = useState(0);
  const [attivazioneWeb, setAttivazioneWeb] = useState(true);

  const handleInputChangeLingua = (e) => {
    const { name, value } = e.target
    setFormLingua(value)
    
  }


  const fetchServizi = async (Token) => {

    if (dataCompleto.length === 0 && Token != "") {


      // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
      const requestOptions = {
        headers: {
          'Authorization': `Bearer ${Token}`
        }
      };

      //const url = `${urlDev}ristoranti/${codStruttura}`;    
      fetch(`${url}servizi/${codStruttura}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          const filterData = data.filter(doc => doc.lingua == formLingua && doc.visDataIni < timestampToday && doc.visDataFin > timestampToday && doc.visibileWeb == true)
          console.log("fetch servizi")
          setDataCompleto(data)
          setData(filterData);
        });
    }
    else {
      const filterData = dataCompleto.filter(doc => doc.lingua == formLingua && doc.visDataIni < timestampToday && doc.visDataFin > timestampToday && doc.visibileWeb == true)
      setData(filterData);
    }

  }


  const fetchProdottiServizi = async (Token, ipDB, DBname, IdAzienda) => {
    const config = sessionStorage.getItem("tipoConfigurazione");

    if (prodottiServizi.length === 0 && Token != "") {

      // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
      const requestOptions = {
        method: "POST", // Spostato qui
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${Token}` // Mantieni l'autorizzazione qui
        },
        body: JSON.stringify({
          ip: ipDB,
          DBname: DBname,
          IdAzienda: IdAzienda
        }),
      };

      const requestOptions2 = {
        headers: {
          'Authorization': `Bearer ${Token}`
        }
      };

      switch (config) {
        case "Suite":
          //const url = `${urlDev}ristoranti/${codStruttura}`;    
          fetch(`${url}suite/prodottiServizi`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
              console.log("fetch prodotti suite")
              setProdottiServizi(data)

            });
          break;

        case "Standard":
          fetch(`${url}prodotti/${codStruttura}`, requestOptions2)
            .then((response) => response.json())
            .then((data) => {
              console.log("fetch prodotti standard")
              setProdottiServizi(data)
            });
          break;

        default:
          break;
      }


    }


  }


  const fetchIp = async (Token) => {

    if (prodottiServizi.length === 0 && Token != "") {



      // Se il token è presente, crea un oggetto con le opzioni della richiesta, inclusa l'intestazione 'Authorization' con il valore del token
      const requestOptions = {
        headers: {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${Token}`
          },
        }
      };

      //const url = `${urlDev}ristoranti/${codStruttura}`;    
      fetch(`${url}auth/getIp/${codStruttura}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("fetch ip")
          sessionStorage.setItem("tipoConfigurazione", data.tipoConfigurazione.value)
          setAttivazioneWeb(data.web)
          fetchProdottiServizi(Token, data.ipStruttura, data.DBname, data.IdAzienda)
          setTokenNotify(data.tokenNotify)
          setUsernameLabel(data.username)
          setIdStripe(data.idStripe)


        });
    }


  }


  const login = async (username, password) => {
    try {
      const response = await fetch(`${url}auth/webLoginGuest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status == "ok") {
          setToken(data.token);
          fetchServizi(data.token)
          fetchIp(data.token)

        }

      }
      else {
        // Gestisci il caso in cui la risposta non è ok (errore di autenticazione)

        console.log("Errore di autenticazione");
      }
    } catch (error) {
      console.error("Errore durante il login", error);
    }
  };



  useEffect(() => {
    // Ottieni la data corrente
    const today = new Date();

    // Ottieni il timestamp in millisecondi (come in millisecondsSinceEpoch di Dart)
    const timestamp = today.getTime();
    // Imposta il timestamp nello stato
    setTimestampToday(timestamp);

    login("web", "test");
    //fetchServizi(token)


    if (formLingua == "Italiano") {
      setLabelButton("Prenota")
      setTitleLabel("Servizi Prenotabili")
      sessionStorage.setItem('lingua', formLingua)
    } else if (formLingua == "Inglese") {
      setLabelButton("Book")
      setTitleLabel("Bookable Services")
      sessionStorage.setItem('lingua', formLingua)
    }

  }, [formLingua]); //con questa dipendenza aggiorna ogni volta che count cambia, se levo dipendenze si agiorna ad ogni cambiamento


  useEffect(() => {

    fetchIp(token)


  }, [token]); //con questa dipendenza aggiorna ogni volta che count cambia, se levo dipendenze si agiorna ad ogni cambiamento


  useEffect(() => {

    fetchServizi(token)

  }, [prodottiServizi])

  return (
    <>
      <div className="flex flex-col min-h-screen">

        {/*<Navbar tab="ristoranti"></Navbar>*/}
        {/*<NavbarResponcive tab="ristoranti"></NavbarResponcive>*/}

        {attivazioneWeb == true ?
          <main className="flex-grow bg-white">
            <div className=" h-auto mt-4 flex flex-row">
              <div className=" flex flex-col">
                <h1 className=" text-sky-900 text-4xl font-bold px-6 pb-3">{usernameLabel}</h1>
                <h1 className=" text-sky-900 text-3xl font-semibold px-6">{titleLabel}</h1>
              </div>

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
            <div className=" flex sm:flex-row flex-col bg-white  h-max justify-between gap-5">

              <div className=" grid sm:grid-cols-2 md:grid-cols-3 lg:grid-col-3 xl:grid-cols-4 2xl:grid-cols-5 grid-cols-1 gap-10 m-10 ">
                {data.map((ser) => (

                  <CardPrenotazioneWeb
                    key={ser.id}
                    id={ser.id}
                    nome={ser.nome}
                    descrizione={ser.descrizione}
                    immagine={ser.immagine}
                    servizio={ser}
                    prodotti={prodottiServizi}
                    codStruttura={codStruttura}
                    Token={token}
                    url={url}
                    labelButton={labelButton}
                    TokenNotify={tokenNotify}
                    idStripe={idStripe}
                  >

                  </CardPrenotazioneWeb>

                  /*
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
                  */
                ))}
              </div>
            </div>
            <ScrollToTopButton></ScrollToTopButton>
          </main>

          :
          <main className="flex-grow bg-white">
            <h1 className=" flex text-red-600 text-2xl font-bold p-6 justify-center">Vendita Web non attiva</h1>
          </main>

        }
        <Footer></Footer>
      </div>
    </>
  );
}

export default PrenotazioneWeb;
