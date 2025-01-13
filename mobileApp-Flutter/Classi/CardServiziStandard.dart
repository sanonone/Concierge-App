class CardServiziStandard {
  String lingua;
  String nome;
  String idPadre;
  List<ProdottoFasce> prodottiFasce;
  String descrizione;
  int posizione;
  List<Prodotto> prodotti;
  String id;
  String immagine;
  int visDataFin;
  int dataFin;
  int visDataIni;
  int quantita;
  int dataIni;
  bool visibileApp;
  bool visibileAppGuest;
  List<Orario> orari; // Modificato per essere una lista

  CardServiziStandard({
    required this.lingua,
    required this.nome,
    required this.idPadre,
    required this.prodottiFasce,
    required this.descrizione,
    required this.posizione,
    required this.prodotti,
    required this.id,
    required this.immagine,
    required this.visDataFin,
    required this.dataFin,
    required this.visDataIni,
    required this.quantita,
    required this.dataIni,
    required this.visibileApp,
    required this.visibileAppGuest,
    required this.orari, // Modificato per essere una lista
  });

  factory CardServiziStandard.fromJson(Map<String, dynamic> json) {
    return CardServiziStandard(
      lingua: json['lingua'] ?? '',
      nome: json['nome'] ?? '',
      idPadre: json['idPadre'] ?? '',
      prodottiFasce: (json['prodottiFasce'] as List)
          .map((e) => ProdottoFasce.fromJson(e))
          .toList(),
      descrizione: json['descrizione'] ?? '',
      posizione: json['posizione'] ?? 0,
      prodotti: (json['prodotti'] as List)
          .map((e) => Prodotto.fromJson(e))
          .toList(),
      id: json['id'] ?? '',
      immagine: json['immagine'] ?? '',
      visDataFin: json['visDataFin'] ?? 0,
      dataFin: json['dataFin'] ?? 0,
      visDataIni: json['visDataIni'] ?? 0,
      quantita: json['quantita'] ?? 0,
      dataIni: json['dataIni'] ?? 0,
      visibileApp: json['visibileApp'] ?? true,
      visibileAppGuest: json['visibileAppGuest'] ?? true,
      orari: (json['orari'] as List)
          .map((e) => Orario.fromJson(e))
          .toList(),
    );
  }
}

class Orario {
  String label;
  List<String> value;

  Orario({required this.label, required this.value});

  factory Orario.fromJson(Map<String, dynamic> json) {
    return Orario(
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
  String label;
  String value;

  Prodotto({required this.label, required this.value});

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

class FasciaOraria {
  String label;
  List<String> value;

  FasciaOraria({required this.label, required this.value});

  factory FasciaOraria.fromJson(Map<String, dynamic> json) {
    return FasciaOraria(
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


class ProdottoFasce {
  List<FasciaOraria> fasceOrarie;
  int idProdotto;

  ProdottoFasce({required this.fasceOrarie, required this.idProdotto});

  factory ProdottoFasce.fromJson(Map<String, dynamic> json) {
    return ProdottoFasce(
      fasceOrarie: (json['fasceOrarie'] as List)
          .map((e) => FasciaOraria.fromJson(e))
          .toList(),
      idProdotto: json['idProdotto'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'fasceOrarie': fasceOrarie.map((e) => e.toJson()).toList(),
      'idProdotto': idProdotto,
    };
  }
}


/*

void main() {
  // Esempio di utilizzo:
  Map<String, dynamic> jsonData = /* I tuoi dati JSON */;
  List<MyData> dataList = (jsonData as List).map((item) => MyData.fromJson(item)).toList();

  // Ora puoi accedere ai dati come segue:
  print(dataList[0].nome); // Stampa il nome del primo elemento
  print(dataList[0].lingua); // Stampa la lingua del primo elemento
  print(dataList[0].prodotti[0]['label']); // Stampa l'etichetta del primo prodotto del primo elemento
}
*/