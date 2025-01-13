export default class Evento{
    constructor(id,nome,descrizione,info,dataInizio,dataFine,immagine,posizione,lingua){
        this.id = id
        this.nome=nome
        this.descrizione=descrizione
        this.info=info
        this.dataInizio=dataInizio
        this.dataFine=dataFine
        this.immagine=immagine
        this.posizione=posizione
        this.lingua=lingua
    }

    stampaEvento(){
        console.log(`il nome del Evento è: ${this.nome}, la sua descrizione è: ${this.descrizione}`)
    }
}