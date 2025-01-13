import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:tt_concierge/Pagine/StatoOrdiniPage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

import '../Classi/Segnalazioni.dart';
import '../Controller/SettingsController.dart';
import 'package:get/get.dart';

import '../Widgets/CardNotifiche.dart';
import '../utility/ColorConvert.dart';

class NotifichePage extends StatefulWidget {
  const NotifichePage({super.key});

  @override
  State<NotifichePage> createState() => _NotifichePageState();
}

class _NotifichePageState extends State<NotifichePage> {
  ColorConvert converti = ColorConvert();
  List<Ordini> _notifiche = [];
  List<Segnalazioni> _segnalazioni = [];
  final SettingsController settingsController = Get.find();


  Future<void> fetchSegnalazioni() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');
    int? codStruttura = await prefs.getInt("idStruttura");
    int? codPrenotazione = await prefs.getInt('codPrenotazione');
    String? mailPrenotazione = await prefs.getString('mail');
    String? tipo = await prefs.getString('tipo');
    String? myTokenNotify = await prefs.getString('myTokenNotify');

    try {
      final response = await http.post(
        settingsController.dev.isTrue
            ? Uri(
            scheme: 'http',
            host: '10.0.2.2',
            path: 'messaggi/notifiche/',
            port: 3000)
            : Uri.parse(
            'PRIVATOapi/messaggi/notifiche/'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'codStruttura': "$codStruttura",
          'tokenNotify': myTokenNotify,
        }),
      );

      if (response.statusCode == 200) {
        print('fetch fatta');
        List<dynamic> parsedJson = jsonDecode(response.body);
        setState(() {
          _segnalazioni =
              parsedJson.map((item) => Segnalazioni.fromJson(item)).toList();
        });
        _segnalazioni.forEach((element) {
          Ordini ordine = Ordini(
            tipo: element.stato,
            stato: element.stato,
            data: element.dataGestione,
            dettagli: element.problema,
            messaggio: element.risposta,
          );

          setState(() {
            _notifiche.add(ordine);
            _notifiche.sort((a, b) => b.data.compareTo(a.data));
          });
        });
      } else {
        print('Errore durante il recupero dei dati: ${response.statusCode}');
      }
    } catch (error) {
      print('Errore durante la chiamata HTTP: $error');
    }
    _notifiche.forEach((element) {
      print("elementi: ${element.tipo}, ${element.stato}, ${element.data}");
    });
  }


  @override
  void initState() {
    super.initState();
    fetchSegnalazioni();
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

          title: Text('drawerNotifiche'.tr,
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
                  itemCount: _notifiche.length,
                  itemBuilder: (context, index) {
                    final card = _notifiche[index];
                    return GestureDetector(
                      onTap: () {
                        // Azione da eseguire al click sulla card
                        print('Hai cliccato sulla card: ${card.stato}');
                      },
                      child: CardNotifiche(
                        tipo: card.tipo,
                        stato: '',
                        dataGestione: card.data,
                        dettagli: '',
                        messaggio: card.messaggio,
                      ),
                    );
                  })),
        ],
      ),
    );
  }
}
