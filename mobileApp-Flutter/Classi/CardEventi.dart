class CardEventi {
  final int posizione;
  final String nome;
  final String descrizione;
  final String id;
  final String lingua;
  final String info;
  final int? dataInizio;
  final int? dataFine;
  final String immagine;

  CardEventi(
      {required this.posizione,
        required this.nome,
        required this.descrizione,
        required this.id,
        required this.lingua,
        required this.info,
        required this.dataInizio,
        required this.dataFine,
        required this.immagine,

      });


  factory CardEventi.fromJson(Map<String, dynamic> json) {
    return CardEventi(
      posizione: json['posizione'] as int,
      nome: json['nome'] as String,
      descrizione: json['descrizione'] as String,
      id: json['id'] as String,
      lingua: json['lingua'] as String,
      info: json['info'] as String,
      dataInizio: json['dataInizio'] != null ? json['dataInizio'] as int : 0,
      dataFine: json['dataFine'] != null ? json['dataFine'] as int : 0,
      immagine: json['immagine'] as String,
    );
  }
}
