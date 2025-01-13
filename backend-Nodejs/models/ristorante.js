export default class Ristorante{
    constructor(id,nome,descrizione,immagine,linkmappa,linkmenu,posizione,lingua){
        this.id = id
        this.nome=nome
        this.descrizione=descrizione
        this.immagine=immagine
        this.linkmappa=linkmappa
        this.linkmenu=linkmenu
        this.posizione=posizione
        this.lingua=lingua

    }

    stampaRistorante(){
        console.log(`il nome del ristorante è: ${this.nome}, la sua descrizione è: ${this.descrizione}`)
    }
}