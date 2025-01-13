import 'package:flutter/material.dart';

import 'package:tt_concierge/Classi/Prodotto.dart' as Prodotto;
import '../Classi/ContoServizi.dart';
import '../Classi/ContoProdotti.dart';
import '../Classi/Segnalazioni.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tt_concierge/Controller/SettingsController.dart';
import 'package:get/get.dart';
import '../Widgets/CardStatoOrdini.dart';
import '../utility/ColorConvert.dart';

class Ordini {
  String tipo;
  String stato;
  int data;
  String dettagli;
  String messaggio;

  Ordini(
      {required this.tipo,
      required this.stato,
      required this.data,
      required this.dettagli,
      required this.messaggio});
}

class StatoOrdini extends StatefulWidget {
  const StatoOrdini({super.key});

  @override
  State<StatoOrdini> createState() => _StatoOrdiniState();
}

class _StatoOrdiniState extends State<StatoOrdini> {
  ColorConvert converti = ColorConvert();
  List<ContoProdotti> _prodottiAddebiti = [];
  List<ContoServizi> _serviziAddebiti = [];
  List<Segnalazioni> _segnalazioni = [];
  List<Ordini> _ordini = [];
  final SettingsController settingsController = Get.find();

  Future<void> fetchAddebitiRoomS() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');
    int? codStruttura = await prefs.getInt("idStruttura");
    int? codPrenotazione = await prefs.getInt('codPrenotazione')?? 0;
    String? mailPrenotazione = await prefs.getString('mail');

    try {
      final response = await http.post(
        settingsController.dev.isTrue
            ? Uri(
                scheme: 'http',
                host: '10.0.2.2',
                path: 'servizi/getPrenotazioniRoomSByUser',
                port: 3000)
            : Uri.parse(
                'https://PRIVATO/api/servizi/getPrenotazioniRoomSByUser'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'codStruttura': "$codStruttura",
          'mail': mailPrenotazione,
          'codPrenotazione': codPrenotazione
        }),
      );

      if (response.statusCode == 200) {
        List<dynamic> parsedJson = jsonDecode(response.body);
        setState(() {
          _prodottiAddebiti =
              parsedJson.map((item) => ContoProdotti.fromJson(item)).toList();
          //_prodottiAddebiti = _prodottiAddebiti.where((element) => element.stato=="confermata").toList();
          _prodottiAddebiti.forEach((element) {
            String dettagliProdotti = "";
            for (var key in element.descrObject.keys) {
              for (var prodotto in element.descrObject[key]!) {
                dettagliProdotti = dettagliProdotti +
                    "[${prodotto.nEle}] " +
                    prodotto.descrizione +
                    ",";
              }
            }
            Ordini ordine = Ordini(
                tipo: 'prenotazioneOrdini'.tr,
                stato: element.stato,
                data: element.dataGestione,
                dettagli: dettagliProdotti,
                messaggio: element.messaggio);
            _ordini.add(ordine);
          });
        });
      } else {
        print('Errore durante il recupero dei dati: ${response.statusCode}');
      }
    } catch (error) {
      print('Errore durante la chiamata HTTP fetch addebiti RoomS: $error');
    }
    fetchAddebitiServizi();
  }

  Future<void> fetchAddebitiServizi() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');
    int? codStruttura = await prefs.getInt("idStruttura");
    int? codPrenotazione = await prefs.getInt('codPrenotazione') ?? 0;
    String? mailPrenotazione = await prefs.getString('mail');

    try {
      final response = await http.post(
        settingsController.dev.isTrue
            ? Uri(
                scheme: 'http',
                host: '10.0.2.2',
                path: 'servizi/getPrenotazioniServiziByUser',
                port: 3000)
            : Uri.parse(
                'https://PRIVATO/api/servizi/getPrenotazioniServiziByUser'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'codStruttura': "$codStruttura",
          'mail': mailPrenotazione,
          'codPrenotazione': codPrenotazione
        }),
      );

      if (response.statusCode == 200) {
        List<dynamic> parsedJson = jsonDecode(response.body);
        setState(() {
          _serviziAddebiti =
              parsedJson.map((item) => ContoServizi.fromJson(item)).toList();
        });
        _serviziAddebiti.forEach((element) {
          Ordini ordine = Ordini(
            tipo: 'prenotazioneServizi'.tr,
            stato: element.stato,
            data: element.dataGestione,
            dettagli: element.nomeServizio,
            messaggio: element.messaggio,
          );

          setState(() {
            _ordini.add(ordine);
            //_ordini.sort((a, b) => b.data.compareTo(a.data));
          });
        });
      } else {
        print('Errore durante il recupero dei dati: ${response.statusCode}');
      }
    } catch (error) {
      print('Errore durante la chiamata HTTP: $error');
    }
    _ordini.forEach((element) {
      print("elementi: ${element.tipo}, ${element.stato}, ${element.data}");
    });
    fetchSegnalazioni();
  }

  Future<void> fetchSegnalazioni() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');
    int? codStruttura = await prefs.getInt("idStruttura");
    int? codPrenotazione = await prefs.getInt('codPrenotazione') ?? 0;
    String? mailPrenotazione = await prefs.getString('mail');
    String? tipo = await prefs.getString('tipo');

    try {
      final response = await http.post(
        settingsController.dev.isTrue
            ? Uri(
                scheme: 'http',
                host: '10.0.2.2',
                path: 'messaggi/segnalazioni/',
                port: 3000)
            : Uri.parse(
                'https://PRIVATO/api/messaggi/segnalazioni/'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'codStruttura': "$codStruttura",
          'mail': mailPrenotazione,
          'codPrenotazione': codPrenotazione,
          'tipo': tipo,
        }),
      );

      if (response.statusCode == 200) {
        List<dynamic> parsedJson = jsonDecode(response.body);
        setState(() {
          _segnalazioni =
              parsedJson.map((item) => Segnalazioni.fromJson(item)).toList();
        });
        _segnalazioni.forEach((element) {
          Ordini ordine = Ordini(
            tipo: 'segnalazioniAperte'.tr,
            stato: element.stato,
            data: element.dataGestione,
            dettagli: element.problema,
            messaggio: element.risposta,
          );

          setState(() {
            _ordini.add(ordine);
            _ordini.sort((a, b) => b.data.compareTo(a.data));
          });
        });
      } else {
        print('Errore durante il recupero dei dati: ${response.statusCode}');
      }
    } catch (error) {
      print('Errore durante la chiamata HTTP: $error');
    }
    _ordini.forEach((element) {
      print("elementi: ${element.tipo}, ${element.stato}, ${element.data}");
    });
  }

  @override
  void initState() {
    super.initState();
    fetchAddebitiRoomS();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        iconTheme: IconThemeData(
            color: Color(converti
                .coloreDaStringa(settingsController.colorIconBar.value))),
        toolbarHeight: 38.0,
        backgroundColor:
        Color(converti.coloreDaStringa(settingsController.colorBar.value)),

        title: Text('drawerStato'.tr,
          style: TextStyle(
              fontWeight: FontWeight.w700,
              color: Color(converti
                  .coloreDaStringa(settingsController.colorIconBar.value))),

        ),
      ),
      body: Stack(
        children: [
          Container(
              color: Colors.white,
              //padding: EdgeInsets.all(20),
              child: ListView.builder(
                  itemCount: _ordini.length,
                  itemBuilder: (context, index) {
                    final card = _ordini[index];
                    return GestureDetector(
                      onTap: () {
                        // Azione da eseguire al click sulla card
                        print('Hai cliccato sulla card: ${card.stato}');
                      },
                      child: CardStatoOrdini(
                        tipo: card.tipo,
                        stato: card.stato,
                        dataGestione: card.data,
                        dettagli: card.dettagli,
                        messaggio: card.messaggio,
                      ),
                    );
                  })),
        ],
      ),
    );
  }
}
