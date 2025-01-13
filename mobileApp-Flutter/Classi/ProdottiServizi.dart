class ProdottiServizi {
  final int idProdotto;
  final String descrizione;
  final String tipo;
  final int idTassa;
  final double prezzoListino;
  final double prezzoLordo;
  int valueIva = 0;
  String labelIva = "";

  ProdottiServizi({
    required this.idProdotto,
    required this.descrizione,
    required this.tipo,
    required this.idTassa,
    required this.prezzoListino,
    required this.prezzoLordo,
    this.valueIva=0,
    this.labelIva=""
  });

  factory ProdottiServizi.fromJson(Map<String, dynamic> json) {
    return ProdottiServizi(
      idProdotto: json['IdProdotto'],
      descrizione: json['Descrizione'],
      tipo: json['Tipo'],
      idTassa: json['IdTassa'],
      prezzoListino: (json['PrezzoListino'] as num).toDouble(),
      prezzoLordo: (json['PrezzoLordo'] as num).toDouble(),
      valueIva: json['valueIva'] ?? 0,
      labelIva: json['labelIva'] ?? ''
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'IdProdotto': idProdotto,
      'Descrizione': descrizione,
      'Tipo': tipo,
      'IdTassa': idTassa,
      'PrezzoListino': prezzoListino,
      'PrezzoLordo': prezzoLordo,
      'valueIva': valueIva,
      'labelIva': labelIva
    };
  }

}
