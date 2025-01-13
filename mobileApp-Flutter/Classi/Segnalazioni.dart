import 'dart:convert';

// Classe che rappresenta il singolo oggetto JSON
class Segnalazioni {
  String stato;
  String tipo;
  String mittente;
  List<dynamic> tokenNotifyDestinatario;
  String problema;
  String risposta;
  String tokenNotifyMittente;
  String id;
  String camera;
  int codPrenotazione;
  int dataGestione;
  String destinatario;

  // Costruttore
  Segnalazioni({
    required this.stato,
    required this.tipo,
    required this.mittente,
    required this.tokenNotifyDestinatario,
    required this.problema,
    required this.risposta,
    required this.tokenNotifyMittente,
    required this.id,
    required this.camera,
    required this.codPrenotazione,
    required this.dataGestione,
    required this.destinatario,
  });

  // Factory method per creare un'istanza da un JSON
  factory Segnalazioni.fromJson(Map<String, dynamic> json) {
    return Segnalazioni(
      stato: json['stato'],
      tipo: json['tipo'],
      mittente: json['mittente'],
      tokenNotifyDestinatario: json['tokenNotifyDestinatario'],
      problema: json['problema'],
      risposta: json['risposta'],
      tokenNotifyMittente: json['tokenNotifyMittente'],
      id: json['id'],
      camera: json['camera'],
      codPrenotazione: json['codPrenotazione'],
      dataGestione: json['dataGestione'],
      destinatario: json['destinatario'],
    );
  }

  // Metodo per convertire l'istanza in JSON
  Map<String, dynamic> toJson() {
    return {
      'stato': stato,
      'tipo': tipo,
      'mittente': mittente,
      'tokenNotifyDestinatario': tokenNotifyDestinatario,
      'problema': problema,
      'risposta': risposta,
      'tokenNotifyMittente': tokenNotifyMittente,
      'id': id,
      'camera': camera,
      'codPrenotazione': codPrenotazione,
      'dataGestione': dataGestione,
      'destinatario': destinatario,
    };
  }
}