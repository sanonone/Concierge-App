import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:tt_concierge/Controller/SettingsController.dart';
import 'package:get/get.dart';
import 'dart:convert';

import 'package:tt_concierge/MyHomePage.dart';

import '../utility/ColorConvert.dart';

class SegnalazioniPage extends StatefulWidget {
  const SegnalazioniPage({super.key});

  @override
  State<SegnalazioniPage> createState() => _SegnalazioniPageState();
}

class _SegnalazioniPageState extends State<SegnalazioniPage> {
  final _formKey = GlobalKey<FormState>();
  ColorConvert converti = ColorConvert();
  TextEditingController _nome = TextEditingController();
  TextEditingController _cognome = TextEditingController();
  TextEditingController _camera = TextEditingController();
  TextEditingController _problemaController = TextEditingController();
  final SettingsController settingsController = Get.find();
  bool _isButtonDisabled = false;

  @override
  void initState() {
    super.initState();
    setCampiForm();
    settingsController.fetchIP();
  }

  Future<void> setCampiForm() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? Cognome = prefs.getString('Cognome');
    String? Nome = prefs.getString('Nome');
    String? Camera = prefs.getString('Camera');
    setState(() {
      _nome.text = Nome!;
      _cognome.text = Cognome!;
      _camera.text = Camera!;
    });

  }

  static SnackBar success = SnackBar(
    content: Text(
      'richiestaSupportoInviata'.tr,
      style: TextStyle(
          fontSize: 20.0, fontWeight: FontWeight.bold, color: Colors.white),
    ),
    backgroundColor: Colors.green,
    elevation: 6.0,
    //padding: EdgeInsets.all(16.0),
    //margin: EdgeInsets.only(bottom: 20.0),
  );

  static SnackBar error = SnackBar(
    content: Text(
      'snackErrore'.tr,
      style: TextStyle(
          fontSize: 20.0, fontWeight: FontWeight.bold, color: Colors.white),
    ),
    backgroundColor: Colors.red,
    elevation: 6.0,
    //padding: EdgeInsets.all(16.0),
    //margin: EdgeInsets.only(bottom: 20.0),
  );

  SnackBar snackbarPersonalizzata(String message, bool tipoErrore) {
    return SnackBar(
      content: Text(
        message,
        style: TextStyle(
            fontSize: 20.0, fontWeight: FontWeight.bold, color: Colors.white),
      ),
      backgroundColor: tipoErrore ? Colors.red : Colors.yellow.shade900,
      elevation: 6.0,
    );
  }

  Future<void> inviaNotifica() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    String? token = await prefs.getString('token');

    try {
      final response = await http.post(
        settingsController.dev.isTrue
            ? Uri(
                scheme: 'http',
                host: '10.0.2.2',
                path: 'sendNotification',
                port: 3000)
            : Uri.parse(
                'https://PRIVATO/api/sendNotification'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
          // Aggiungi altri header se necessario
        },
        body: jsonEncode({
          'title': "Concierge T&T",
          'body': "Nuove attività in Home",
          'image':
              "https://firebasestorage.googleapis.com/v0/b/fir-autenticazione-d201f.appspot.com/o/LogoConcierge.png?alt=media&token=6011e1b0-6f6e-4c25-b66b-5439a784fec3",
          'token': settingsController.tokenWeb.value
        }),
      );
      if (response.statusCode == 200) {
        print("notifica inviata correttamente");
        print("i token sono : ${settingsController.tokenWeb.value}");
      }
    } catch (error) {
      print("errore durante l'invio notifica. Errore:  $error");
    }
  }

  Future<void> invioSegnalazione() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    String? token = await prefs.getString('token');
    int? codStruttura = await prefs.getInt("idStruttura");
    String? mailPrenotazione = await prefs.getString('mail');
    String? Camera = await prefs.getString('Camera');
    String? tokenNotify = await prefs.getString('tokenNotify');
    int? CodPrenotazione = await prefs.getInt('codPrenotazione') ?? 0;
    String? myTokenNotify = await prefs.getString('myTokenNotify');
    String? Cellulare = await prefs.getString('cellulare') ?? 'N/A';
    print(mailPrenotazione);

    try {
      final response = await http.post(
        settingsController.dev.isTrue
            ? Uri(
                scheme: 'http', host: '10.0.2.2', path: 'messaggi', port: 3000)
            : Uri.parse(
                'https://PRIVATO/api/messaggi'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
          // Aggiungi altri header se necessario
        },
        body: jsonEncode({
          'codStruttura': codStruttura.toString(),
          'codPrenotazione': CodPrenotazione,
          'problema': _problemaController.text,
          'risposta': '',
          'tipo': 's',
          'stato': 'attesa',
          'camera': Camera,
          'mittente':"${mailPrenotazione} ${Cellulare}",
          'destinatario': '',
          'tokenNotifyMittente': myTokenNotify,
          'tokenNotifyDestinatario': settingsController.tokenWeb.value
        }),
      );
      if (response.statusCode == 201) {
        // Elaborare la risposta JSON
        final data = jsonDecode(response.body);
        print(data);
        await inviaNotifica();
        ScaffoldMessenger.of(context).showSnackBar(success);
        Get.to(MyHomePage());
        //Navigator.pop(context);
        //final jsonData = jsonDecode(response.body) as List<dynamic>;
        /*
        List<dynamic> parsedJson = jsonDecode(response.body);
        parsedJson.forEach((item) {
          setState(() {
            //_nodi.add(Nodo.fromJson(item));
          });
          //print(_nodi);
        });

         */
      } else {
        ScaffoldMessenger.of(context).showSnackBar(error);
        print('Errore durante il recupero dei dati: ${response.statusCode}');
      }
    } catch (errore) {
      ScaffoldMessenger.of(context).showSnackBar(error);
      print('Errore durante la chiamata HTTP: $errore');
    }
  }

  void _onButtonPressed() {
    //controllo tasto invio per evitare messaggi multipli
    if (!_isButtonDisabled) {
      // Disabilita il pulsante
      setState(() {
        _isButtonDisabled = true;
      });

      // Simula un'azione asincrona, ad esempio un ritardo di 2 secondi
      Future.delayed(Duration(seconds: 2), () async {
        // Completa l'azione
        if (_formKey.currentState?.validate() ?? false) {
          await invioSegnalazione();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
              snackbarPersonalizzata('snackCampiMancanti'.tr, true));
        }
        // Riabilita il pulsante
        setState(() {
          _isButtonDisabled = false;
        });
      });
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

        title: Text('segnalaProblema'.tr,
          style: TextStyle(
              fontWeight: FontWeight.w700,
              color: Color(converti
                  .coloreDaStringa(settingsController.colorIconBar.value))),

        ),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          children: [
            Column(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 20.0, vertical: 30),
                  child: TextFormField(
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Campo obbligatorio';
                      }
                      return null;
                    },
                    //textAlign: TextAlign.center,
                    controller: _nome,
                    readOnly: _nome.text.isEmpty ? false : true,
                    decoration: InputDecoration(
                      border: UnderlineInputBorder(),
                      filled: true,
                      fillColor: Colors.white30,
                      labelText: 'nome'.tr,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 20.0, vertical: 30),
                  child: TextFormField(
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Campo obbligatorio';
                      }
                      return null;
                    },
                    //textAlign: TextAlign.center,
                    controller: _cognome,
                    readOnly: _cognome.text.isEmpty ? false : true,
                    decoration: InputDecoration(
                      border: UnderlineInputBorder(),
                      filled: true,
                      fillColor: Colors.white30,
                      labelText: 'cognome'.tr,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 20.0, vertical: 30),
                  child: TextFormField(
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Campo obbligatorio';
                      }
                      return null;
                    },
                    //textAlign: TextAlign.center,
                    controller: _camera,
                    readOnly: _camera.text.isEmpty ? false : true,
                    decoration: InputDecoration(
                      border: UnderlineInputBorder(),
                      filled: true,
                      fillColor: Colors.white30,
                      labelText: 'camera'.tr + ' *',
                    ),
                  ),
                ),
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 60),
                  child: TextField(
                    autocorrect: false,
                    minLines: 1,
                    maxLines: 6,
                    controller: _problemaController,
                    decoration: InputDecoration(
                      filled: true,
                      border: UnderlineInputBorder(),
                      hintText: 'descrizioneProblema'.tr,
                    ),
                    onChanged: (text) {
                      // Puoi salvare o gestire le note qui
                      // Ad esempio, puoi salvare le note nelle SharedPreferences o nello stato
                    },
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 30),
              child: ElevatedButton(
                onPressed: () async => {_isButtonDisabled ? null : _onButtonPressed(),},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green.shade500,
                  // Cambia il colore del pulsante
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(4),
                  ),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                ),
                child: Text(
                  'invia'.tr,
                  style: TextStyle(fontSize: 18, color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
