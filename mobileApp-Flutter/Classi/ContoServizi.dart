import 'dart:convert';

class Ora {
  final String label;
  final List<String> value;

  Ora({
    required this.label,
    required this.value,
  });

  factory Ora.fromJson(Map<String, dynamic> json) {
    return Ora(
      label: json['label'],
      value: List<String>.from(json['value']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'label': label,
      'value': value,
    };
  }
}

class Prodotto {
  final String label;
  final int value;

  Prodotto({
    required this.label,
    required this.value,
  });

  factory Prodotto.fromJson(Map<String, dynamic> json) {
    return Prodotto(
      label: json['label'],
      value: json['value'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'label': label,
      'value': value,
    };
  }
}

class ContoServizi {
  final String richieste;
  final String idServizio;
  final String nomePrenotante;
  final String mail;
  final String messaggio;
  final int dataFin;
  final double totale;
  final int codPrenotazione;
  final String stato;
  final String nomeServizio;
  final String id;
  final String quantita;
  final String camera;
  final int dataGestione;
  final Prodotto prodotto;
  final String cognomePrenotante;
  final int dataIni;
  final Ora ora;

  ContoServizi({
    required this.richieste,
    required this.idServizio,
    required this.nomePrenotante,
    required this.mail,
    required this.messaggio,
    required this.dataFin,
    required this.totale,
    required this.codPrenotazione,
    required this.stato,
    required this.nomeServizio,
    required this.id,
    required this.quantita,
    required this.camera,
    required this.dataGestione,
    required this.prodotto,
    required this.cognomePrenotante,
    required this.dataIni,
    required this.ora,
  });

  factory ContoServizi.fromJson(Map<String, dynamic> json) {
    return ContoServizi(
      richieste: json['richieste'],
      idServizio: json['idServizio'],
      nomePrenotante: json['nomePrenotante'],
      mail: json['mail'],
      messaggio: json['messaggio'],
      dataFin: json['dataFin'],
      totale: (json['totale'] as num).toDouble(),
      codPrenotazione: json['codPrenotazione'],
      stato: json['stato'],
      nomeServizio: json['nomeServizio'],
      id: json['id'],
      quantita: json['quantita'],
      camera: json['camera'],
      dataGestione: json['dataGestione'],
      prodotto: Prodotto.fromJson(json['prodotto']),
      cognomePrenotante: json['cognomePrenotante'],
      dataIni: json['dataIni'],
      ora: Ora.fromJson(json['ora']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'richieste': richieste,
      'idServizio': idServizio,
      'nomePrenotante': nomePrenotante,
      'mail': mail,
      'messaggio': messaggio,
      'dataFin': dataFin,
      'totale': totale,
      'codPrenotazione': codPrenotazione,
      'stato': stato,
      'nomeServizio': nomeServizio,
      'id': id,
      'quantita': quantita,
      'camera': camera,
      'dataGestione': dataGestione,
      'prodotto': prodotto.toJson(),
      'cognomePrenotante': cognomePrenotante,
      'dataIni': dataIni,
      'ora': ora.toJson(),
    };
  }
}
