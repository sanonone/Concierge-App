import React, { useState } from "react";
import convertiTimestampAData from "../../components/ConvertiTimestamp";

export default function Cancel() {
  const codStruttura = sessionStorage.getItem("codStruttura")
  const nomePrenotante = sessionStorage.getItem("nomePrenotante")
  const dataIni = sessionStorage.getItem("dataIni")
  const dataFin = sessionStorage.getItem("dataFin")
  const totale = sessionStorage.getItem("totale")
  const url = sessionStorage.getItem("url")
  const lingua = sessionStorage.getItem("lingua");
  const pagamentoType = sessionStorage.getItem("pagamentoType")




  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
        <h1 className="text-2xl font-semibold text-red-600">Errore durante il pagamento</h1>
        <p className="mt-4 text-lg text-gray-700">Grazie, <span className="font-bold">{nomePrenotante}</span>!</p>
        <p className="mt-2 text-gray-600">
          Ci dispiece ma la tua prenotazione non è stata eseguita correttamente.
        </p>
        <div className="mt-4 p-4 bg-red-50 rounded-lg text-red-800">
          <p className="font-semibold">Dettagli di pagamento:</p>
          <p className="mt-1">Importo: <span className="font-bold">€{totale}</span></p>
          <p>Date prenotate: <span className="font-bold">{convertiTimestampAData(dataIni)} - {convertiTimestampAData(dataFin)}</span></p>
        </div>
        <div className="mt-6">
          <button
            className="bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded-lg transition-colors"
            onClick={() => window.location.href = `http://localhost:5173/PrenotazioneWeb/${codStruttura}`}
          >
            Torna alla lista servizi
          </button>
        </div>
      </div>
    </div>


  );
}