class Prodotto {
  final int idProdotto;
  final String descrizione;
  final String tipo;
  final int idTassa;
  final int idLivelloRicavo;
  late double prezzoListino;
  final double prezzoLordo;
  int nEle=0;
  String note;
  bool pagato=false;
  late int valueIva = 0;
  late String labelIva = "";

  Prodotto({
    required this.idProdotto,
    required this.descrizione,
    required this.tipo,
    required this.idTassa,
    required this.idLivelloRicavo,
    required this.prezzoListino,
    required this.prezzoLordo,
    this.nEle=0,
    this.note="",
    this.pagato=false,
    this.valueIva=0,
    this.labelIva=""
  });

  factory Prodotto.fromJson(Map<String, dynamic> json) {
    return Prodotto(
      idProdotto: json['IdProdotto'],
      descrizione: json['Descrizione'],
      tipo: json['Tipo'],
      idTassa: json['IdTassa'],
      idLivelloRicavo: json['IdLivelloRicavo'],
      prezzoListino: json['PrezzoListino'].toDouble(),
      prezzoLordo: json['PrezzoLordo'].toDouble(),
      nEle: json['nEle'],
      note: json['note'],
      pagato: json['pagato'],
      valueIva: json['valueIva'] ?? 0,
      labelIva: json['labelIva'] ?? "N/A"
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'IdProdotto': idProdotto,
      'Descrizione': descrizione,
      'Tipo' : tipo,
      'IdTassa' : idTassa,
      'IdLivelloRicavo' : idLivelloRicavo,
      'PrezzoListino' : prezzoListino,
      'PrezzoLordo' : prezzoLordo,
      'nEle': nEle,
      'note': note,
      'pagato': pagato,
      'valueIva': valueIva,
      'labelIva': labelIva
    };
  }
}
