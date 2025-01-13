import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:tt_concierge/Classi/CardRistoranti.dart';
import 'package:tt_concierge/Widgets/CardRistoranti.dart' as ristoranti;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tt_concierge/Controller/SettingsController.dart';
import 'package:get/get.dart';
import '../utility/ColorConvert.dart';

class RistorantiPage extends StatefulWidget {
  const RistorantiPage({super.key});

  @override
  State<RistorantiPage> createState() => _RistorantiPageState();
}

class _RistorantiPageState extends State<RistorantiPage> {
  List<CardRistoranti> _cardRistoranti = [];
  ColorConvert converti=ColorConvert();
  final SettingsController settingsController= Get.find();
  String lingua = "";

  @override
  void initState() {
    super.initState();
    fetchRistorantiCard(1); //gestire codice struttura
  }

  Future<void> fetchRistorantiCard(int hardcodStruttura) async {
    if (Get.locale.toString() == "en_US") {
      lingua = "Inglese";
    } else if (Get.locale.toString() == "it_IT") {
      lingua = "Italiano";
    }

    SharedPreferences prefs = await SharedPreferences.getInstance();
    int? codStruttura=prefs.getInt("idStruttura");
    print('chiamata su codice:${codStruttura}');
    try {
      final response = await http.get(
        settingsController.dev.isTrue ?
        Uri(
            scheme: 'http',
            host: '10.0.2.2',
            path: 'ristoranti/${codStruttura}',
            port: 3000)
        : Uri.parse('https://PRIVATO/api/ristoranti/${codStruttura}'),
        /*
        headers: {
          'Authorization': 'Bearer your_access_token',
          // Aggiungi altri header se necessario
        },
         */
      );
      if (response.statusCode == 200) {
        // Elaborare la risposta JSON
        //final data = jsonDecode(response.body);
        //print(data);
        final jsonData = jsonDecode(response.body) as List<dynamic>;
        setState(() {
          _cardRistoranti = jsonData.map((data) => CardRistoranti.fromJson(data)).toList();
          List<CardRistoranti> card = jsonData.map((data) => CardRistoranti.fromJson(data)).toList();
          _cardRistoranti = card.where((element) => element.lingua == lingua).toList();
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
            color:  Color(converti.coloreDaStringa(settingsController.colorIconBar.value))
        ),
        toolbarHeight: 38.0,
          backgroundColor: Color(converti.coloreDaStringa(settingsController.colorBar.value)),
        title:  Row(
          children: [
            /*
          Image.network(
            'https://images.unsplash.com/photo-1596431749951-1bbb4e396436?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            width: 150,
            height: 150,
          ),*/ // URL dell'immagine PNG
            //SizedBox(width: 8), // Spazio tra l'immagine e il testo
            Text('ristoranti'.tr,style: TextStyle(fontWeight: FontWeight.w700, color: Color(converti.coloreDaStringa(settingsController.colorIconBar.value))),),
          ],
        ),

      ),
      body: Stack(
        children: [
          Container(
              color: Colors.white,
              //padding: EdgeInsets.all(20),
              child: ListView.builder(
                  itemCount: _cardRistoranti.length,
                  itemBuilder: (context, index) {
                    final card = _cardRistoranti[index];
                    return GestureDetector(
                      onTap: () {
                        // Azione da eseguire al click sulla card
                        print('Hai cliccato sulla card: ${card.nome}');
                      },
                      child: ristoranti.CardRistoranti(
                        descrizione: card.descrizione,
                        immagine: card.immagine,
                        nome: card.nome,
                        linkMappa: card.linkmappa,
                        linkMenu: card.linkmenu,
                      ),
                    );
                  })),
        ],
      ),
    );
  }
}
