class CardHotel {
  final int posizione;
  final String nome;
  final String descrizione;
  final String id;
  final String lingua;
  final String linksito;
  final String linkmappa;
  final String immagine;

  CardHotel(
      {required this.posizione,
      required this.nome,
      required this.descrizione,
      required this.id,
      required this.lingua,
      required this.linksito,
      required this.linkmappa,
      required this.immagine});


  factory CardHotel.fromJson(Map<String, dynamic> json) {
    return CardHotel(
      posizione: json['posizione'] as int,
      nome: json['nome'] as String,
      descrizione: json['descrizione'] as String,
      id: json['id'] as String,
      lingua: json['lingua'] as String,
      linksito: json['linksito'] as String,
      linkmappa: json['linkmappa'] as String,
      immagine: json['immagine'] as String,
    );
  }
}
