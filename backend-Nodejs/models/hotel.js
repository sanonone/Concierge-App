export default class Hotel{
    constructor(id,nome,descrizione,immagine,linksito,linkmappa,posizione,lingua){
        this.id = id
        this.nome=nome
        this.descrizione=descrizione
        this.immagine=immagine
        this.linksito=linksito
        this.linkmappa=linkmappa
        this.posizione=posizione
        this.lingua=lingua

    }

    stampaHotel(){
        console.log(`il nome del Hotel è: ${this.nome}, la sua descrizione è: ${this.descrizione}`)
    }
}