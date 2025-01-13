class CardData {
  final int posizione;
  final String nome;
  final String nomeEn;
  final String id;
  final String? colore;
  final bool attivo;
  final String sfondo;

  CardData({
    required this.posizione,
    required this.nome,
    required this.nomeEn,
    required this.id,
    this.colore,
    required this.attivo,
    required this.sfondo,
  });

  factory CardData.fromJson(Map<String, dynamic> json) {
    return CardData(
      posizione: json['posizione'] as int,
      nome: json['nome'] as String,
      nomeEn: json['nomeEn'] as String,
      id: json['id'] as String,
      colore: json['colore'] as String?,
      attivo: json['attivo'] as bool,
      sfondo: json['sfondo'] as String,
    );
  }
}