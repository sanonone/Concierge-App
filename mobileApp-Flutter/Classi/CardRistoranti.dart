class CardRistoranti {
  final int posizione;
  final String nome;
  final String descrizione;
  final String id;
  final String lingua;
  final String immagine;
  final String linkmappa;
  final String linkmenu;

  CardRistoranti({
    required this.posizione,
    required this.nome,
    required this.descrizione,
    required this.id,
    required this.lingua,
    required this.immagine,
    required this.linkmappa,
    required this.linkmenu,
  });
  factory CardRistoranti.fromJson(Map<String, dynamic> json) {
    return CardRistoranti(
      posizione: json['posizione'] as int,
      nome: json['nome'] as String,
      descrizione: json['descrizione'] as String,
      id: json['id'] as String,
      lingua: json['lingua'] as String,
      linkmappa: json['linkmappa'] as String,
      linkmenu: json['linkmenu'] as String,
      immagine: json['immagine'] as String,
    );
  }

}
