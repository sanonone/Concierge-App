import 'package:flutter/material.dart';
import 'package:tt_concierge/MyHomePage.dart';
import 'package:tt_concierge/Pagine/RoomSPage.dart';
import 'package:tt_concierge/Widgets/CardCarrelloProdotti.dart';
import '../Classi/Prodotto.dart';
import 'package:tt_concierge/Controller/SettingsController.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../utility/ColorConvert.dart';
import 'package:http/http.dart' as http;

class CarrelloProdotti extends StatefulWidget {
  final List<Prodotto> prodotti;

  const CarrelloProdotti({super.key, required this.prodotti});

  @override
  State<CarrelloProdotti> createState() => _CarrelloProdottiState();
}

SnackBar snackbarPersonalizzata(String message, bool tipoErrore) {
  return SnackBar(
    content: Text(
      message,
      style: TextStyle(
          fontSize: 20.0, fontWeight: FontWeight.bold, color: Colors.white),
    ),
    backgroundColor: tipoErrore ? Colors.red : Colors.green,
    elevation: 6.0,
  );
}

class _CarrelloProdottiState extends State<CarrelloProdotti> {
  final SettingsController settingsController = Get.find();
  TextEditingController _locationDeliveryText = TextEditingController();
  ColorConvert converti = ColorConvert();
  bool _isButtonDisabled = false;
  bool _caricamento = false;
  String _config = "";
  String _tipo = "";

  // Valore selezionato
  String? _selectedValue;

  // Lista dei valori disponibili
  final List<String> _options = ["camera".tr, "altro".tr];

  @override
  void initState() {
    super.initState();
    settingsController.fetchIP();
    controllaTipoConfigurazione();
  }

  Future<void> controllaTipoConfigurazione() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? config = await prefs.getString('tipoConfigurazione') ?? '';
    String camera=prefs.getString('Camera') ?? '';
    String tipo=prefs.getString('tipo') ?? '';

    if(config=="Standard" || tipo=="esterno"){//se config standard o utente guest
      setState(() {
        _selectedValue="Altro";
        _tipo=tipo;
      });
    }
    setState(() {
      _config=config;
    });
  }

  // Clear products from Shared Preferences
  Future<void> clearProdotti() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('prodotti');
  }

  Future<void> saveProdotti(List<Prodotto> prodotti) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    List<String> jsonProdotti = settingsController.pr
        .map((prodotto) => jsonEncode(prodotto.toJson()))
        .toList();
    await prefs.setStringList('prodotti', jsonProdotti);
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
      }
    } catch (error) {
      print("errore durante l'invio notifica. Errore:  $error");
    }
  }

  Future<void> prenotazioneRooms() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    String? token = await prefs.getString('token');
    int? codStruttura = await prefs.getInt("idStruttura");
    int? codPrenotazione = await prefs.getInt('codPrenotazione') ?? 0;
    String? mailPrenotazione = await prefs.getString('mail');
    int? IdSchedaConto = await prefs.getInt('IdSchedaConto');
    int? IdSchedaContoRetta = await prefs.getInt('IdSchedaContoRetta');
    String? Camera = await prefs.getString('Camera') ?? "";
    String? Cognome = prefs.getString('Cognome');
    String? Nome = prefs.getString('Nome');
    String Anagrafica = Cognome! + " " + Nome!;
    print(codPrenotazione);
    print(mailPrenotazione);

    try {
      final response = await http.post(
        settingsController.dev.isTrue
            ? Uri(
                scheme: 'http',
                host: '10.0.2.2',
                path: 'servizi/insertPrenotazioneRoomS',
                port: 3000)
            : Uri.parse(
                'https://PRIVATO/api/servizi/insertPrenotazioneRoomS'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
          // Aggiungi altri header se necessario
        },
        body: jsonEncode({
          'codStruttura': codStruttura.toString(),
          'anagrafica': Anagrafica,
          'camera': Camera,
          'stato': 'attesa',
          'prodotti': settingsController.pr,
          'codPrenotazione': codPrenotazione,
          'mailPrenotazione': mailPrenotazione,
          'IdSchedaConto': IdSchedaConto,
          'IdSchedaContoRetta': IdSchedaContoRetta,
          'messaggio': '',
          'locationDelivery': _locationDeliveryText.text
        }),
      );
      if (response.statusCode == 201) {
        // Elaborare la risposta JSON
        final data = jsonDecode(response.body);
        print(data);
        await inviaNotifica();
        ScaffoldMessenger.of(context)
            .showSnackBar(snackbarPersonalizzata('snackInviata'.tr, false));
        clearProdotti();
        setState(() {
          settingsController.pr.clear();
          settingsController.nEleCarrello.value = 0;
        });
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
        ScaffoldMessenger.of(context)
            .showSnackBar(snackbarPersonalizzata('snackErrore'.tr, true));
        print('Errore durante il recupero dei dati: ${response.statusCode}');
      }
    } catch (error) {
      ScaffoldMessenger.of(context)
          .showSnackBar(snackbarPersonalizzata('snackErrore'.tr, true));
      print('Errore durante la chiamata HTTP: $error');
    }
  }

  void elimina(int index) {
    setState(() {
      settingsController.deleteProdotto(index);
    });
    List<Prodotto>? newPr = settingsController.pr.value.cast<Prodotto>();
    saveProdotti(newPr);
  }

  void _onButtonPressed() {
    if (settingsController.pr.isEmpty) {
      //carrello vuoto non invia nulla
      return;
    }

    if (_selectedValue=="" || _locationDeliveryText.text.isEmpty) {
      //non selezionato luogo consegna
      print("seleziona luogo consegna");
      ScaffoldMessenger.of(context)
          .showSnackBar(snackbarPersonalizzata('snackCampiMancanti'.tr, true));
      return;
    }

    //controllo tasto invio per evitare messaggi multipli
    if (!_isButtonDisabled) {
      // Disabilita il pulsante
      setState(() {
        _isButtonDisabled = true;
      });

      // Simula un'azione asincrona, ad esempio un ritardo di 2 secondi
      Future.delayed(Duration(milliseconds: 300), () async {
        // Completa l'azione
        setState(() {
          _caricamento = true;
        });
        await prenotazioneRooms();
        List<Prodotto> p = [];
        for (Prodotto ele in settingsController.pr) {
          p.add(ele);
        }
        Get.to(MyHomePage(),
            transition: Transition.leftToRight,
            duration: const Duration(milliseconds: 200));

        /*
                            clearProdotti();
                            setState(() {
                              settingsController.pr.clear();
                              settingsController.nEleCarrello.value = 0;
                            });
                            Get.to(MyHomePage());
                             */

        // Riabilita il pulsante
        setState(() {
          _isButtonDisabled = false;
          _caricamento = false;
        });
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(
            "Carrello",
            style: TextStyle(
                fontWeight: FontWeight.w700,
                color: Color(converti
                    .coloreDaStringa(settingsController.colorIconBar.value))),
          ),
          iconTheme: IconThemeData(
              color: Color(converti
                  .coloreDaStringa(settingsController.colorIconBar.value))),
          toolbarHeight: 38.0,
          backgroundColor: Color(
              converti.coloreDaStringa(settingsController.colorBar.value)),
          //backgroundColor: Colors.transparent,
        ),
        body: WillPopScope(
          onWillPop: () async {
            Get.to(const RoomSPage(),
                transition: Transition.fadeIn,
                duration: const Duration(milliseconds: 200));
            return false;
          },
          child: _caricamento
              ? Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Center(
                      child:
                          CircularProgressIndicator(), // Visualizza un indicatore di caricamento finché non vengono ricevuti i dati
                    ),
                    Text("Loading...")
                  ],
                )
              : Stack(
                  children: [
                    Padding(
                      padding: EdgeInsets.only(top: _selectedValue == "Altro" || _selectedValue == "Other" ? 130 : 60, bottom: 70),
                      child: Container(
                        color: Colors.white,
                        child: ListView.builder(
                            //itemCount: widget.prodotti.length,
                            itemCount: settingsController.pr.length,
                            itemBuilder: (context, index) {
                              //final pr=widget.prodotti[index];
                              final ppr = settingsController.pr[index];
                              return InkWell(
                                onLongPress: () {
                                  print(index);
                                  //clearProdotti();
                                  //widget.prodotti.removeWhere((element) => element.idProdotto==ppr.idProdotto);
                                  //saveProdotti(widget.prodotti);
                                  setState(() {
                                    settingsController.deleteProdotto(index);
                                  });
                                  List<Prodotto>? newPr = settingsController
                                      .pr.value
                                      .cast<Prodotto>();
                                  saveProdotti(newPr);
                                },
                                child: CardCarrelloProdotti(
                                  descrizione: ppr.descrizione,
                                  prezzo: ppr.prezzoListino,
                                  n: ppr.nEle,
                                  note: ppr.note,
                                  index: index,
                                  elimina: elimina,
                                ),
                              );
                              //return CardCarrelloProdotti(descrizione: pr.descrizione, prezzo: pr.prezzoListino, n: pr.n);
                            }),
                      ),
                    ),
                    Positioned(
                        bottom: 10,
                        left: 20,
                        child: Row(
                          children: [
                            ElevatedButton(
                                onPressed: () {
                                  clearProdotti();
                                  setState(() {
                                    settingsController.pr.clear();
                                    settingsController.nEleCarrello.value = 0;
                                  });
                                  Get.to(const RoomSPage(),
                                      transition: Transition.fadeIn,
                                      duration:
                                          const Duration(milliseconds: 200));
                                },
                                style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.redAccent,
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(10)),
                                    minimumSize: Size(150, 40)),
                                child: Text(
                                  'svuota'.tr,
                                  style: TextStyle(
                                      fontSize: 22,
                                      fontWeight: FontWeight.w600),
                                )),
                          ],
                        )),
                    Positioned(
                        bottom: 10,
                        right: 20,
                        child: Row(
                          children: [
                            ElevatedButton(
                                onPressed: () {
                                  _isButtonDisabled ? null : _onButtonPressed();
                                },
                                style: ElevatedButton.styleFrom(
                                    elevation: 5,
                                    backgroundColor: Colors.green,
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(10)),
                                    minimumSize: Size(150, 40)),
                                child: Text(
                                  'invia'.tr,
                                  style: TextStyle(
                                      fontSize: 22,
                                      fontWeight: FontWeight.w600),
                                )),
                          ],
                        )),
                    Visibility(
                      visible: (_config=="Suite"&&_tipo=="interno") ? true : _config=="Standard" ? false : (_config=="Suite"&&_tipo=="esterno") ? false : true,
                      child: Positioned(
                          top: 10,
                          left: 10,
                          right: 10,
                          child: Padding(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 2),
                            child: DropdownButton<String>(
                              hint: Text('dove'.tr),
                              value: _selectedValue,
                              onChanged: (String? newValue) {
                                if(newValue=="Camera" || newValue=="Room"){
                                  setState(() {
                                    _locationDeliveryText.text="Camera";
                                  });
                                }else{
                                  setState(() {
                                    _locationDeliveryText.text="";
                                  });
                                }
                                setState(() {
                                  _selectedValue = newValue;
                                });
                              },
                              items: _options
                                  .map<DropdownMenuItem<String>>((String value) {
                                return DropdownMenuItem<String>(
                                  value: value,
                                  child: Text(value),
                                );
                              }).toList(),
                            ),
                          )),
                    ),
                    Visibility(
                      visible: _selectedValue == "Altro" || _selectedValue == "Other" || _config=="Standard" ? true : false,
                      child: Positioned(
                        top: 30,
                        left: 10,
                        right: 10,
                        child: Padding(
                          padding: const EdgeInsets.only(top: 9.0,left: 16, right: 16),
                          child: TextField(
                            controller: _locationDeliveryText,
                            maxLength: 60, // Limita a 60 caratteri
                            decoration: InputDecoration(
                              labelText: 'testoAltro'.tr,
                              hintText: 'testoAltroHint'.tr,
                              border: UnderlineInputBorder(),
                            ),
                          ),
                        ),
                      ),
                    )
                  ],
                ),
        ));
  }
}
