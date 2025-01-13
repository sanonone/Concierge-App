import { useState, useEffect } from "react";
import convertiTimestampAData from "./ConvertiTimestamp";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import it from "date-fns/locale/it"; // Importa la localizzazione italiana
import Select from 'react-select';
import * as React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Switch from '@mui/material/Switch';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

registerLocale("it", it); // Registra la localizzazione italiana
setDefaultLocale("it"); // Imposta la localizzazione italiana come predefinita

function Servizio(props) {
  let servizi = props.servizi;
  const ID = props.id;
  const nome = props.nome;
  const descrizione = props.descrizione;
  const immagine = props.immagine;
  const visDataIni = props.visDataIni;
  const visDataFin = props.visDataFin;
  const dataIni = props.dataIni;
  const dataFin = props.dataFin;
  const orari = props.orari
  const prodotti = props.prodotti
  const prodottiFasce = props.prodottiFasce
  const quantita = props.quantita;
  const qMax = props.qMaxPrenotabile
  const posizione = props.posizione;
  const lingua = props.lingua;
  const pagamentoTypeP = props.pagamentoType
  const percentualeAccontoP= props.percentualeAcconto
  const visibileWeb = props.visibileWeb;
  const visibileApp = props.visibileApp;
  const visibileAppGuest = props.visibileAppGuest;
  const codStruttura = props.codStruttura;
  const getServizi = props.getServizi;
  const url = props.url

  const [formNome, setFormNome] = useState(nome);
  const [formDescrizione, setFormDescrizione] = useState(descrizione);
  const [formImmagine, setFormImmagine] = useState(immagine);
  const [selectedDateVisIni, setSelectedDateVisIni] = useState(visDataIni);
  const [selectedDateVisFin, setSelectedDateVisFin] = useState(visDataFin);
  const [selectedDateDataIni, setSelectedDateDataIni] = useState(dataIni);
  const [selectedDateDataFin, setSelectedDateDataFin] = useState(dataFin);
  const [formQuantita, setFormQuantita] = useState(quantita);
  const [formQMaxPrenotabile, setFormQMaxPrenotabile] = useState(qMax);
  const [formPosizionamento, setFormPosizionamento] = useState(posizione);
  const [formLingua, setFormLingua] = useState(lingua);
  const [scelta, impostaScelta] = useState(true);
  const [orario, setOrario] = useState(orari);
  const [dafascia, setdaFascia] = useState('');
  const [afascia, setaFascia] = useState('');
  const [ora, setOra] = useState([]);

  const config = sessionStorage.getItem("tipoConfigurazione");
  const idStripe = sessionStorage.getItem("idStripe") ?? ''


  const [prodottiFasceOrarie, setProdottiFasceOrarie] = useState(prodottiFasce);


  const [open, setOpen] = React.useState(false);//snackbar bar update card
  const [word, setWord] = React.useState();//snackbar bar update card
  const [statoAlert, setStatoAlert] = React.useState();
  const handleClose = (event, reason) => {

    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };



  // Formatta i dati ottenuti dal backend nel formato richiesto da React Select
  const formattedOptions = config=="Suite" ? servizi.map(item => ({
    value: item.IdProdotto, // Ad esempio, utilizza l'Id del prodotto come value
    label: item.Descrizione // Utilizza la descrizione come label
  })) :
  config=="Standard" ? 
  servizi.map(item => ({
    value: item.id, // Ad esempio, utilizza l'Id del prodotto come value
    label: item.descrizione // Utilizza la descrizione come label
  })) : null
  
  ;

  const [selectedOptions, setSelectedOptions] = useState(prodotti);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };


  const handleChangeOrario = (e) => {
    const { value } = e.target
    console.log(value)
    setOra(value)
  }

  const handleAddOrario = (e) => {
    const { value } = e.target
    console.log(value)
    if (ora.trim() !== '') {
      setOrario([...orario, { value: [ora, ora], label: ora }]);
    }
    setOra('')
  };

  const handleChangedaFascia = (e) => {
    const { value } = e.target
    console.log(value)
    setdaFascia(value)
  }

  const handleChangeaFascia = (e) => {
    const { value } = e.target
    console.log(value)
    setaFascia(value)
  }


  const handleAddFascia = (e) => {
    const { value } = e.target
    console.log(value)
    if (dafascia.trim() != '' && afascia.trim() != '') {
      if (radio != 'none') {
        setOrario([...orario, { value: [dafascia, afascia], label: `${radio}-dalle ${dafascia} alle ${afascia}` }]);
      }
      else {
        setOrario([...orario, { value: [dafascia, afascia], label: `dalle ${dafascia} alle ${afascia}` }]);
      }
    }
    setdaFascia('')
    setaFascia('')
  };


  const [radio, setRadio] = React.useState('none');
  const handleChangeRadio = (event) => {
    setRadio(event.target.value);
  };


  const gestisciCambioScelta = () => {
    impostaScelta(!scelta);
    // Puoi eseguire azioni aggiuntive in base alla scelta (true o false)
  };

  const handleDateChangeVisIni = (date) => {
    const timestamp = date ? date.getTime() : null;
    setSelectedDateVisIni(timestamp);
    console.log(timestamp)
  };

  const handleDateChangeVisFin = (date) => {
    const timestamp = date ? date.getTime() : null;
    setSelectedDateVisFin(timestamp);
    console.log(timestamp)
  };

  const handleDateChangeDataIni = (date) => {
    const timestamp = date ? date.getTime() : null;
    setSelectedDateDataIni(timestamp);
    console.log(timestamp)
  };

  const handleDateChangeDataFin = (date) => {
    const timestamp = date ? date.getTime() : null;
    setSelectedDateDataFin(timestamp);
    console.log(timestamp)
  };

  //gestione upload immagine
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    console.log(event.target.files[0])
    console.log(typeof (event.target.files[0]))
    setSelectedFile(event.target.files[0]);
    postImg(event.target.files[0])
  };

  const handleInputChangeNome = (e) => {
    const { name, value } = e.target;
    setFormNome(value);
    console.log(value);
  };

  const handleInputChangeDescrizione = (e) => {
    const { name, value } = e.target;
    setFormDescrizione(value);
    console.log(value);
  };

  const handleInputChangeImmagine = (e) => {
    const { name, value } = e.target;
    setFormImmagine(value);
    console.log(value);
  };

  const handleInputChangeQuantita = (e) => {
    const { name, value } = e.target;
    const val = parseInt(value, 10)
    setFormQuantita(val);
    console.log(val);
  };

  const handleInputChangeQMaxPrenotabile = (e) => {
    const { name, value } = e.target;
    const val = parseInt(value, 10)
    if(val>formQuantita){
      setFormQMaxPrenotabile(formQuantita)
    }
    else{
      setFormQMaxPrenotabile(val);
    }
    
    console.log(val);
  };

  const handleInputChangePosizionamento = (e) => {
    const { name, value } = e.target;
    setFormPosizionamento(parseInt(value, 10));
    console.log(value);
  };

  const handleInputChangeLingua = (e) => {
    const { name, value } = e.target;
    setFormLingua(value);
    console.log(value);
  };

  const [accontoSelezionato, setAccontoSelezionato] = React.useState(false);
  const [pagamentoType, setPagamentoType] = React.useState(pagamentoTypeP);
  const handleChangePagamentoType = (event) => {
    if (event.target.value == "acconto") {
      setAccontoSelezionato(true)
    }
    else {
      setAccontoSelezionato(false)
    }
    setPagamentoType(event.target.value);
  };


  useEffect(() => {
    if(pagamentoTypeP=="acconto"){
      setAccontoSelezionato(true)
    }
  },[])

  const [percentualeAcconto, setPercentualeAcconto] = React.useState(percentualeAccontoP);
  const handleInputChangeAcconto = (e) => {
    const { name, value } = e.target;
    const val = parseInt(value, 10)
    if (val > 100) {
      setPercentualeAcconto(100)
    } else {
      setPercentualeAcconto(val);
    }
    console.log(val);
  };

  const [visWeb, setVisWeb] = useState(visibileWeb)
  const handleInputChangeVisWeb = () => {
    setVisWeb(!visWeb);
  };

  const [visApp, setVisApp] = useState(visibileApp)
  const handleInputChangeVisApp = () => {
    setVisApp(!visApp);
  };

  const [visAppGuest, setVisAppGuest] = useState(visibileAppGuest)
  const handleInputChangeVisAppGuest = () => {
    setVisAppGuest(!visAppGuest);
  };




  const postImg = async (selectedFile) => {
    try {

      /*
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('folder', codStruttura); // Passa il nome della cartella nel campo di testo
      formData.append('id', ID)
      */

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;

        const payload = {
          image: base64Image,
          folder: codStruttura,
          id: ID,
        };

        const token = sessionStorage.getItem('token');
        const res = await fetch(`${url}upload/`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload), //gestire id tramite login
        });
        if (res.ok) {
          const data = await res.json();
          // Accedi al campo imageUrl e stampalo
          console.log(data.imageUrl);
          setFormImmagine(data.imageUrl)
          getServizi();
          setWord("Immagine caricata correttamente")
          setStatoAlert("success")
          setOpen(true);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      setStatoAlert("error")
      setWord("Errore durante l'upload dell'immagine")
      setOpen(true);
    }


  }


  const deleteImg = async () => {
    try {

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('folder', codStruttura); // Passa il nome della cartella nel campo di testo
      formData.append('id', ID)


      const token = sessionStorage.getItem('token');
      const res = await fetch(`${url}delete/${codStruttura}/${ID}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        //body: formData, //gestire id tramite login
      });
      if (res.ok) {
        const data = await res.json();
        // Accedi al campo imageUrl e stampalo
        console.log(data.imageUrl);
        setFormImmagine(data.imageUrl)
        getServizi();
        setWord("Immagine eliminata correttamente")
        setStatoAlert("success")
        setOpen(true);
      }
    } catch (error) {
      setStatoAlert("error")
      setWord("Errore durante l'eliminazione dell'immagine")
      setOpen(true);
    }


  }



  const modifica = async () => {
    try {
      // Crea un array di oggetti contenenti ID del prodotto e fasce orarie associate
      const prodottiFasceOrarieDaInviare = prodottiFasceOrarie.map(item => ({
        idProdotto: item.idProdotto,
        fasceOrarie: item.fasceOrarie
      }));
      const token = sessionStorage.getItem('token');
      console.log(ID)
      await fetch(`${url}servizi/${ID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: formNome,
          descrizione: formDescrizione,
          codStruttura: codStruttura,
          immagine: formImmagine,
          visDataIni: selectedDateVisIni,
          visDataFin: selectedDateVisFin,
          dataIni: selectedDateDataIni,
          dataFin: selectedDateDataFin,
          orari: orario,
          prodotti: selectedOptions,
          prodottiFasce: prodottiFasceOrarieDaInviare,
          quantita: formQuantita,
          qMaxPrenotabile: formQMaxPrenotabile,
          posizione: formPosizionamento,
          lingua: formLingua,
          pagamentoType: pagamentoType,
          percentualeAcconto: percentualeAcconto,
          visibileWeb: visWeb,
          visibileApp: visApp,
          visibileAppGuest: visAppGuest
        }),
      });

      // Attendere la risposta non è più necessario quando usi l'async/await.
      getServizi();
      setStatoAlert("success")
      setWord("Modificato")
      setOpen(true);
    } catch (errore) {
      console.error("Errore nella richiesta di modifica:", errore);
      // Gestisci l'errore come desideri
      setStatoAlert("error")
      setWord("Errore durante la modifica")
      setOpen(true);
    }
  };

  const elimina = async () => {
    try {
      deleteImg();
      const token = sessionStorage.getItem('token');
      await fetch(`${url}servizi/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: ID, codStruttura: codStruttura }), //gestire id tramite login
      }).then((response) => response.json()); //gestire eccezioni
      getServizi();
      setWord("Eliminato")
      setStatoAlert("success")
      setOpen(true);
    } catch (error) {
      setStatoAlert("error")
      setWord("Errore durante l'eliminazione")
      setOpen(true);
    }
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });


  return (
    <div className=" rounded-lg bg-white overflow-x-clip  transition-transform shadow-xl shadow-slate-700/100">
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={statoAlert}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {word}
        </Alert>
      </Snackbar>

      <div className=" h-60 overflow-y-auto rounded-t-lg">
        <img className="" src={immagine} alt="immagine servizio"></img>
      </div>
      <div className="flex flex-col p-4 gap-2 ">
        <h3 className=" text-indigo-700 underline font-medium">Titolo:</h3>
        <input
          className=" bg-slate-100 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
          type="text"
          name="nome"
          value={formNome}
          onChange={handleInputChangeNome}
        />
        <h3 className=" text-indigo-700 underline font-medium">Descrizione:</h3>
        <textarea
          className="bg-slate-100 h-32 border-2 focus:outline-none focus:border-indigo-500 rounded-md"
          name="descrizione"
          value={formDescrizione}
          onChange={handleInputChangeDescrizione}
        />
        <h3 className=" text-indigo-700 underline font-medium">Immagine:</h3>
        <input
          className="bg-slate-100 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
          type="text"
          name="nome"
          value={formImmagine}
          onChange={handleInputChangeImmagine}
          disabled={formLingua != "Italiano"}
        />
        <div className="flex flex-col pt-2">
          <Button component="label"
            role={undefined}
            tabIndex={-1}
            startIcon={<CloudUploadIcon />} variant="contained" color="primary" onChange={handleFileChange}>
            Upload Immagine<VisuallyHiddenInput type="file" />
          </Button>


        </div>
        <h3 className=" text-indigo-700 underline font-medium">
          Range visibilità
        </h3>
        <div className="flex flex-row">
          <h3 className=" pr-2 text-indigo-700 underline font-medium pl-2">
            Da:
          </h3>
          <DatePicker
            selected={selectedDateVisIni}
            onChange={handleDateChangeVisIni}
            placeholderText="Seleziona una data"
            dateFormat="dd/MM/yyyy"
            className="bg-slate-100 border-2 p-1 rounded focus:outline-none focus:border-blue-500 w-40"
            disabled={formLingua != "Italiano"}
          />

        </div>
        <div className="flex flex-row">
          <h3 className=" pr-5 text-indigo-700 underline font-medium pl-2">
            a:
          </h3>
          <DatePicker
            selected={selectedDateVisFin}
            onChange={handleDateChangeVisFin}
            placeholderText="Seleziona una data"
            dateFormat="dd/MM/yyyy"
            className="bg-slate-100 border-2 p-1 rounded focus:outline-none focus:border-blue-500 w-40"
            disabled={formLingua != "Italiano"}
          />
        </div>

        <h3 className=" text-indigo-700 underline font-medium">
          Data disponibilità
        </h3>
        <div className="flex flex-row">
          <h3 className=" pr-2 text-indigo-700 underline font-medium pl-2">
            Da:
          </h3>
          <DatePicker
            selected={selectedDateDataIni}
            onChange={handleDateChangeDataIni}
            placeholderText="Seleziona una data"
            dateFormat="dd/MM/yyyy"
            className="bg-slate-100 border-2 p-1 rounded focus:outline-none focus:border-blue-500 w-40"
            disabled={formLingua != "Italiano"}
          />
        </div>
        <div className="flex flex-row">
          <h3 className=" pr-5 text-indigo-700 underline font-medium pl-2">
            a:
          </h3>
          <DatePicker
            selected={selectedDateDataFin}
            onChange={handleDateChangeDataFin}
            placeholderText="Seleziona una data"
            dateFormat="dd/MM/yyyy"
            className="bg-slate-100 border-2 p-1 rounded focus:outline-none focus:border-blue-500 w-40"
            disabled={formLingua != "Italiano"}
          />
        </div>

        {formLingua === "Italiano" && (
          <div className="flex flex-col gap-2">
            <label className="  text-indigo-700 underline font-medium pr-2 ">Orario o fasce orarie:</label>
            <div className=" flex flex-row gap-3 pl-2">
              <input
                className="bg-slate-100 w-30 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
                type="time"
                name=""
                id=""
                value={ora}
                onChange={handleChangeOrario}
                disabled={formLingua != "Italiano"}
              />
              <button
                type="button"
                className=" transition-all duration-300 flex-auto focus:outline-none focus:ring bg-sky-900 hover:bg-sky-700 active:bg-blue-800 text-white font-bold py-1 px-2 rounded"
                onClick={handleAddOrario}
                disabled={formLingua != "Italiano"}
              >
                Orario
              </button>
            </div>

            <div className=" flex flex-row gap-3 pl-2">
              <input
                className="bg-slate-100 w-48 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
                type="time"
                name=""
                id=""
                value={dafascia}
                onChange={handleChangedaFascia}
                disabled={formLingua != "Italiano"}
              />
              <input
                className="bg-slate-100 w-48 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-9"
                type="time"
                name=""
                id=""
                value={afascia}
                onChange={handleChangeaFascia}
                disabled={formLingua != "Italiano"}
              />
              <button
                type="button"
                className=" transition-all duration-300 flex-auto focus:outline-none focus:ring bg-sky-900 hover:bg-sky-700 active:bg-blue-800 text-white font-bold py-1 px-2 rounded"
                onClick={handleAddFascia}
                disabled={formLingua != "Italiano"}
              >
                Fascia
              </button>
            </div>

            <div>
              <RadioGroup
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={radio}
                onChange={handleChangeRadio}
              >
                <FormControlLabel value="mattina" control={<Radio />} label="Mattina" />
                <FormControlLabel value="pomeriggio" control={<Radio />} label="Pomeriggio" />
                <FormControlLabel value="giornata" control={<Radio />} label="Intera giornata" />
                <FormControlLabel value="none" control={<Radio />} label="None" />
              </RadioGroup>
            </div>


            <div>
              <Select
                options={orario}
                value={orario}
                isMulti
                onChange={setOrario}
                placeholder="orari/fasce orarie"
                disabled={formLingua != "Italiano"}
              />
            </div>
          </div>
        )}

        {formLingua === "Italiano" && (
          <div>
            <h3 className=" text-indigo-700 underline font-medium pr-2">Seleziona prodotti:</h3>
            <Select
              isMulti
              options={formattedOptions}
              value={selectedOptions}
              onChange={handleChange}
              placeholder="prodotti agganciabili al servizio"
              onSubmit={null}
              disabled={formLingua != "Italiano"}
            />
          </div>
        )}



        {formLingua === "Italiano" && (
          <div>
            {selectedOptions.map((prodotto, index) => (
              <div key={index}>
                <h2>Seleziona fasce orarie per {prodotto.label}:</h2>
                <Select
                  isMulti
                  options={orario}
                  value={prodottiFasceOrarie[index] ? prodottiFasceOrarie[index].fasceOrarie : []}
                  onChange={(selectedOptions) => {
                    const newProdottiFasceOrarie = [...prodottiFasceOrarie];
                    newProdottiFasceOrarie[index] = {
                      idProdotto: prodotto.value,
                      fasceOrarie: selectedOptions
                    };
                    setProdottiFasceOrarie(newProdottiFasceOrarie);
                  }}
                  placeholder={`Seleziona fasce orarie per ${prodotto.label}`}
                />
              </div>
            ))}
          </div>
        )}


        <div className="flex flex-row justify-between">
          <h3 className=" text-indigo-700 underline font-medium  pr-2">
            Quantità:
          </h3>
          <input
            className="bg-slate-100 w-12 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
            type="number"
            name="nome"
            value={formQuantita}
            onChange={handleInputChangeQuantita}
            disabled={formLingua != "Italiano"}
          />
          <h3 className=" text-indigo-700 underline font-medium  pr-2">
            Max:
          </h3>
          <input
            className="bg-slate-100 w-12 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
            type="number"
            name="nome"
            max={formQuantita}
            min={0}
            value={formQMaxPrenotabile}
            onChange={handleInputChangeQMaxPrenotabile}
            disabled={formLingua != "Italiano"}
          />
        </div>

        <div className="flex flex-row">
          <h3 className=" text-indigo-700 underline font-medium pr-2">
            Posizionamento:
          </h3>
          <input
            className="bg-slate-100 w-10 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
            type="number"
            name="nome"
            value={formPosizionamento}
            onChange={handleInputChangePosizionamento}
            disabled={formLingua != "Italiano"}
          />
        </div>
        <div className="flex flex-row">
          <h3 className=" text-indigo-700 underline font-medium pr-2">
            Traduzione:
          </h3>
          <select
            className="border-2 focus:outline-none focus:border-indigo-500 rounded-md h-6"
            id="lingua"
            value={formLingua}
            onChange={handleInputChangeLingua}
            //disabled={formLingua != "Italiano"}
            disabled={true}
          >
            <option value="Italiano">Italiano</option>
            <option value="Inglese">Inglese</option>
          </select>
        </div>

        {idStripe!='' ?
          <div className=" flex flex-col">
          <h3 className=" text-indigo-700  font-medium">Tipo prenotazione Web e Guest App:</h3>
          <FormControl>
            {/*<FormLabel id="demo-radio-buttons-group-label">Genere</FormLabel>*/}

            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={pagamentoType}
              onChange={handleChangePagamentoType}
              disabled={formLingua != "Italiano"}
            >
              <FormControlLabel disabled={formLingua != "Italiano"} value="paga" control={<Radio />} label="Paga" />
              <FormControlLabel disabled={formLingua != "Italiano"} value="nonPaga" control={<Radio />} label="Non Paga" />
              <FormControlLabel disabled={formLingua != "Italiano"} value="acconto" control={<Radio />} label="% Acconto" />
            </RadioGroup>
          </FormControl>

          {
            accontoSelezionato ?
              <div className="flex flex-row">
                <h3 className=" text-indigo-700 underline font-medium  pr-2">
                  Acconto da pagare in %:
                </h3>
                <input
                  className="bg-slate-100 w-12 border-2 focus:outline-none focus:border-indigo-500 rounded-md h-7"
                  type="number"
                  name="nome"
                  min={0}
                  max={100}
                  value={percentualeAcconto}
                  onChange={handleInputChangeAcconto}
                  disabled={formLingua != "Italiano"}
                />
              </div> : null
          }


        </div> : null}
        <div className=" flex flex-row gap-1">
          <h3 className=" text-indigo-700  font-medium">Visibile Web:</h3>
          <Switch
            checked={visWeb}
            onChange={handleInputChangeVisWeb}
            color="success"
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </div>
        <div className=" flex flex-row gap-1">
          <h3 className=" text-indigo-700  font-medium">Visibile App:</h3>
          <Switch
            checked={visApp}
            onChange={handleInputChangeVisApp}
            color="success"
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </div>
        <div className=" flex flex-row gap-1">
          <h3 className=" text-indigo-700  font-medium">Visibile App Guest:</h3>
          <Switch
            checked={visAppGuest}
            onChange={handleInputChangeVisAppGuest}
            color="success"
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </div>

        <div className=" flex flex-row gap-2 justify-center mt-auto">
          <button
            className=" transition-all duration-300 flex-auto focus:outline-none focus:ring bg-sky-900 hover:bg-sky-700 active:bg-indigo-800 text-white font-bold py-1 px-2 rounded"
            onClick={modifica}
          >
            Modifica
          </button>
          <button
            className=" transition-all duration-300 flex-auto focus:outline-none focus:ring bg-red-700 hover:bg-red-600 active:bg-rose-800 text-white font-bold py-1 px-2 rounded"
            onClick={elimina}
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  );
}

export default Servizio;
