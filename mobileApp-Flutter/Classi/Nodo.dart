import 'Prodotto.dart';

class Nodo {
  final int idNodo;
  final String descrizione;
  final Map<String, List<Prodotto>> descrObject;
  final List<int> idLivelloRicavo;
  final int n;

  Nodo({
    required this.idNodo,
    required this.descrizione,
    required this.descrObject,
    required this.idLivelloRicavo,
    required this.n,
  });

  factory Nodo.fromJson(Map<String, dynamic> json) {
    Map<String, List<Prodotto>> descrObject = {};
    json['descrObject'].forEach((key, value) {
      List<Prodotto> prodotti = (value as List)
          .map((item) => Prodotto.fromJson(item))
          .toList();
      descrObject[key] = prodotti;
    });

    return Nodo(
      idNodo: json['IdNodo'],
      descrizione: json['Descrizione'],
      descrObject: descrObject,
      idLivelloRicavo: List<int>.from(json['IdLivelloRicavo']),
      n: json['n'],
    );
  }
}