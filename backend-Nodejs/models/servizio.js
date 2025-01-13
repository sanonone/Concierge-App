import { getFirestore, Timestamp } from 'firebase-admin/firestore'
export default class Servizio{
    constructor(id,nome,descrizione,immagine,visDataIni,visDataFin,dataIni,dataFin,orari,prodotti,prodottiFasce,quantita,qMaxPrenotabile,posizione,lingua,pagamentoType,percentualeAcconto,visibileWeb,visibileApp,visibileAppGuest){
        this.id = id
        this.nome=nome
        this.descrizione=descrizione
        this.immagine=immagine
        this.visDataIni=visDataIni
        this.visDataFin=visDataFin
        this.dataIni=dataIni
        this.dataFin=dataFin
        this.orari=orari
        this.prodotti=prodotti
        this.prodottiFasce=prodottiFasce
        this.quantita=quantita
        this.qMaxPrenotabile=qMaxPrenotabile
        this.posizione=posizione
        this.lingua=lingua
        this.pagamentoType=pagamentoType
        this.percentualeAcconto=percentualeAcconto
        this.visibileWeb=visibileWeb
        this.visibileApp=visibileApp
        this.visibileAppGuest=visibileAppGuest
    }

    stampaServizio(){
        console.log(`il nome del servizio è: ${this.nome}, la sua descrizione è: ${this.descrizione}`)
    }
}