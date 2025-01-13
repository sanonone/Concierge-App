import 'Prodotto.dart';

class ContoProdotti {
  final String mailPrenotazione;
  final String stato;
  final Map<String, List<Prodotto>> descrObject;
  final String camera;
  final String messaggio;
  final String anagrafica;
  final int dataGestione;
  final int codPrenotazione;

  ContoProdotti({
    required this.mailPrenotazione,
    required this.stato,
    required this.descrObject,
    required this.camera,
    required this.messaggio,
    required this.anagrafica,
    required this.dataGestione,
    required this.codPrenotazione,
  });

  factory ContoProdotti.fromJson(Map<String, dynamic> json) {
    Map<String, List<Prodotto>> descrObject = {};
    for (var prodottoJson in json['prodotti']) {
      Prodotto prodotto = Prodotto.fromJson(prodottoJson);
      if (descrObject.containsKey(prodotto.tipo)) {
        descrObject[prodotto.tipo]!.add(prodotto);
      } else {
        descrObject[prodotto.tipo] = [prodotto];
      }
    }

    return ContoProdotti(
      mailPrenotazione: json['mailPrenotazione'],
      stato: json['stato'],
      descrObject: descrObject,
      camera: json['camera'],
      messaggio: json['messaggio'],
      anagrafica: json['anagrafica'],
      dataGestione: json['dataGestione'],
      codPrenotazione: json['codPrenotazione'],
    );
  }
}
