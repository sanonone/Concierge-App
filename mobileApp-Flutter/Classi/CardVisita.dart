class CardVisita {
  final int posizione;
  final String nome;
  final String descrizione;
  final String id;
  final String lingua;
  final String immagine;
  final String linkmappa;


  CardVisita({
    required this.posizione,
    required this.nome,
    required this.descrizione,
    required this.id,
    required this.lingua,
    required this.immagine,
    required this.linkmappa,

  });
  factory CardVisita.fromJson(Map<String, dynamic> json) {
    return CardVisita(
      posizione: json['posizione'] as int,
      nome: json['nome'] as String,
      descrizione: json['descrizione'] as String,
      id: json['id'] as String,
      lingua: json['lingua'] as String,
      linkmappa: json['linkmappa'] as String,
      
      immagine: json['immagine'] as String,
    );
  }

}
