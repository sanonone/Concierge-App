import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tt_concierge/Controller/SettingsController.dart';
import 'package:tt_concierge/Pagine/PrenotaServizioPage.dart';
import '../Classi/CardServizi.dart';
import'../Widgets/CardServizi.dart' as servizi;
import 'package:http/http.dart' as http;
import '../utility/ColorConvert.dart';
import 'package:get/get.dart';

class ServiziPage extends StatefulWidget {
  const ServiziPage({super.key});

  @override
  State<ServiziPage> createState() => _ServiziPageState();
}

class _ServiziPageState extends State<ServiziPage> {
  ColorConvert converti = ColorConvert();
  final SettingsController settingsController = Get.find();
  String lingua = "";
  List<CardServizi> _cardServizi = [];

  @override
  void initState() {
    super.initState();
    fetchServiziCard(2);
  }

  Future<void> fetchServiziCard(int hardcodStruttura) async {
    if (Get.locale.toString() == "en_US") {
      lingua = "Inglese";
    } else if (Get.locale.toString() == "it_IT") {
      lingua = "Italiano";
    }

    SharedPreferences prefs = await SharedPreferences.getInstance();
    int? codStruttura = prefs.getInt("idStruttura");
    print('chiamata su codice:${codStruttura}');
    String? token = prefs.getString('token');
    String? tipo = await prefs.getString('tipo') ?? '';
    String? config = await prefs.getString('tipoConfigurazione') ?? '';

    //inizilizzo data del giorno per visualizzare solo servizi con visibilità corretta
    final DateTime today = DateTime.now();
    final int timestampToday = today.millisecondsSinceEpoch;
    print("LA DATA DI OGGI é : ${timestampToday}");
    try {
      final response = await http.get(
        settingsController.dev.isTrue ?
        Uri(
            scheme: 'http',
            host: '10.0.2.2',
            path: 'servizi/${codStruttura}',
            port: 3000)
        : Uri.parse('https://PRIVATO/api/servizi/${codStruttura}'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );
      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body) as List<dynamic>;
        setState(() {


          List<CardServizi> card = jsonData.map((data) {
            try {
              return CardServizi.fromJson(data);
            } catch (e) {
              print('Errore nel parsing dell\'elemento: $data');
              print('Errore: $e');
              return null;
            }
          }).where((element) => element != null).toList().cast<CardServizi>();
          if(tipo=="interno"){
            _cardServizi = card.where((element) => element.lingua == lingua && element.visDataIni<timestampToday && element.visDataFin>timestampToday && element.visibileApp==true).toList();
          }else if(tipo=="esterno"){
            _cardServizi = card.where((element) => element.lingua == lingua && element.visDataIni<timestampToday && element.visDataFin>timestampToday && element.visibileAppGuest==true).toList();
          }
          else{
            _cardServizi = card.where((element) => element.lingua == lingua && element.visDataIni<timestampToday && element.visDataFin>timestampToday && element.visibileAppGuest==true).toList();
          }


          //_cardServizi.forEach((element) {print(element.nome);});
        });
      } else {
        print('Errore durante il recupero dei dati: ${response.statusCode}');
      }
    } catch (error) {
      print('Errore durante la chiamata HTTP: $error');
    }

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
        title:  Row(
          children: [
            Text('titleBarServizi'.tr, style: TextStyle(fontWeight: FontWeight.w700, color: Color(converti.coloreDaStringa(settingsController.colorIconBar.value))),),
          ],
        ),
      ),
      body:Stack(
        children: [
          Container(
              color: Colors.white,
              //padding: EdgeInsets.all(20),
              child: ListView.builder(
                  itemCount: _cardServizi.length,
                  itemBuilder: (context, index) {
                    final card = _cardServizi[index];
                    return GestureDetector(
                      onTap: () {
                        // Azione da eseguire al click sulla card
                        print('Hai cliccato sulla card: ${card.nome}');
                        //Get.to(PrenotaServizioPage(servizio: card,));
                      },
                      child: servizi.CardServizi(
                        descrizione: card.descrizione,
                        immagine: card.immagine,
                        nome: card.nome,
                        card: card,

                      ),
                    );
                  })),
        ],
      ),
    );
  }
}
