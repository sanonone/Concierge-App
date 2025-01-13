export default class PrenotazioneServizio{
    constructor(id,idServizio,nomeServizio,nomePrenotante,cognomePrenotante,mail, telefono, codPrenotazione,camera,richieste,dataIni,dataFin,dataGestione,ora,prodotto,totale,quantita,stato,IdSchedaConto,IdSchedaContoRetta, messaggio){
        this.id = id
        this.idServizio = idServizio
        this.nomeServizio=nomeServizio
        this.nomePrenotante = nomePrenotante
        this.cognomePrenotante = cognomePrenotante
        this.mail = mail
        this.telefono = telefono
        this.codPrenotazione = codPrenotazione
        this.camera = camera
        this.richieste=richieste
        this.dataIni=dataIni
        this.dataFin=dataFin
        this.dataGestione=dataGestione
        this.ora=ora
        this.prodotto = prodotto
        this.totale = totale
        this.quantita=quantita
        this.stato=stato
        this.IdSchedaConto=IdSchedaConto
        this.IdSchedaContoRetta=IdSchedaContoRetta
        this.messaggio=messaggio
    }

    
}