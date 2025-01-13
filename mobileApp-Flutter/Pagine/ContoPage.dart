import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:tt_concierge/Classi/ContoServizi.dart';
import 'dart:convert';
import 'package:tt_concierge/Classi/Prodotto.dart' as Prodotto;
import 'package:get/get.dart';
import 'package:tt_concierge/MyHomePage.dart';
import '../Classi/ContoProdotti.dart';
import 'package:tt_concierge/Controller/SettingsController.dart';

import '../utility/ColorConvert.dart';
import 'CarrelloProdotti.dart';

class ContoPage extends StatefulWidget {
  const ContoPage({super.key});

  @override
  State<ContoPage> createState() => _ContoPageState();
}

class _ContoPageState extends State<ContoPage> {
  //bool _dev = true;
  ColorConvert converti = ColorConvert();
  final SettingsController settingsController = Get.find();
  List<ContoProdotti> _prodottiAddebiti = [];
  List<ContoServizi> _serviziAddebiti = [];
  bool isLoading = false;
  double _Tariffa = 0.0;
  double _Extra = 0.0;
  double _Totale = 0.0;
  String _dataInizio = "";
  String _dataFine = "";
  String _Config="Suite";


  @override
  void initState() {
    super.initState();
    fetchAddebitiRoomS();
  }

  Future<void> fetchTariffa() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');
    int? codStruttura = await prefs.getInt("idStruttura");
    int? codPrenotazione = await prefs.getInt('codPrenotazione');
    String? mailPrenotazione = await prefs.getString('mail');
    String? ipStruttura = await prefs.getString('ipStruttura');
    String? DBname = await prefs.getString('DBname');
    int? IdScheda = await prefs.getInt('IdScheda');

    try {
      final response = await http.post(
        settingsController.dev.isTrue
            ? Uri(
                scheme: 'http',
                host: '10.0.2.2',
                path: 'suite/getTariffa',
                port: 3000)
            : Uri.parse(
                'https://PRIVATO/api/suite/getTariffa'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode(
            {'ip': '${ipStruttura}', 'IdScheda': IdScheda, 'DBname': DBname}),
      );

      if (response.statusCode == 200) {
        //List<dynamic> parsedJson = jsonDecode(response.body);
        Map<String, dynamic> responseMap = jsonDecode(response.body);
        //String IdSchedaConto = responseMap['IdSchedaConto'];
        String Tariffa = responseMap['Tariffa'];
        String Extra = responseMap['Extra'];
        print('Dati tariffa: ${Tariffa} ${Extra}');
        /*
        await prefs.setInt('IdSchedaConto', int.parse(IdSchedaConto));
        await prefs.setInt('Tariffa', int.parse(Tariffa));
        await prefs.setInt('Extra', int.parse(Extra));
         */
        _Tariffa = double.parse(Tariffa);
        _Extra = double.parse(Extra);
        _Totale = _Tariffa + _Extra;
        setState(() {
          //_prodottiAddebiti = parsedJson.map((item) => ContoProdotti.fromJson(item)).toList();
        });
      } else {
        print('Errore durante il recupero dei dati Tariffa in Conto: ${response.statusCode}');
      }
    } catch (error) {
      print('Errore durante la chiamata HTTP Tariffa in Conto: $error');
      ScaffoldMessenger.of(context)
          .showSnackBar(snackbarPersonalizzata('erroreCaricamento'.tr, true));
    }
    isLoading = false;
  }

  Future<void> fetchAddebitiRoomS() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? config = prefs.getString("tipoConfigurazione");
    String? token = prefs.getString('token');
    int? codStruttura = await prefs.getInt("idStruttura");
    int? codPrenotazione = await prefs.getInt('codPrenotazione');
    String? mailPrenotazione = await prefs.getString('mail');
    String inizio = await prefs.getString('DataInizio') ?? "";
    String fine = await prefs.getString('DataFine') ?? "";

    try {
      setState(() {
        _dataInizio = inizio;
        _dataFine = fine;
        _Config = config!;
      });
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
          _prodottiAddebiti = _prodottiAddebiti
              .where((element) => element.stato == "confermata")
              .toList();
        });
      } else {
        print('Errore durante il recupero dei dati RoomS in conto: ${response.statusCode}');
      }
    } catch (error) {
      print('Errore durante la chiamata HTTP RoomS in conto: $error');
    }
    fetchAddebitiServizi();
  }

  Future<void> fetchAddebitiServizi() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');
    int? codStruttura = await prefs.getInt("idStruttura");
    int? codPrenotazione = await prefs.getInt('codPrenotazione');
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
          //ciclo per estrapolare dati da chiamata ed aggiungere prodotto servizio
          //agli altri prodotti RoomS nella lista Ordini

          if (element.stato == "confermata") {
            //gestione date noleggio
            final DateTime dataIni =
                DateTime.fromMillisecondsSinceEpoch(element.dataIni);
            final DateTime dataFin =
                DateTime.fromMillisecondsSinceEpoch(element.dataFin);
            String dataStringIni = dataIni.toString().split(" ")[0];
            String dataStringFin = dataFin.toString().split(" ")[0];
            String rangeDate = dataStringIni + '/' + dataStringFin;
            double quantita=double.tryParse(element.quantita) ?? 0.00;
            Map<String, List<Prodotto.Prodotto>> descrObject = {};
            Prodotto.Prodotto prodotto = Prodotto.Prodotto(
                idProdotto: element.prodotto.value,
                descrizione: element.prodotto.label + ' ' + rangeDate,
                tipo: 'E',
                idTassa: 1,
                idLivelloRicavo: 0,
                prezzoListino: element.totale/quantita,
                prezzoLordo: 0,
                nEle: int.parse(element.quantita));
            if (descrObject.containsKey(prodotto.tipo)) {
              descrObject[prodotto.tipo]!.add(prodotto);
            } else {
              descrObject[prodotto.tipo] = [prodotto];
            }
            ContoProdotti p = ContoProdotti(
                mailPrenotazione: element.mail,
                stato: element.stato,
                descrObject: descrObject,
                camera: element.camera,
                messaggio: element.messaggio,
                anagrafica: element.nomePrenotante,
                dataGestione: element.dataGestione,
                codPrenotazione: element.codPrenotazione);
            setState(() {
              _prodottiAddebiti.add(p);
              _prodottiAddebiti
                  .sort((a, b) => b.dataGestione.compareTo(a.dataGestione));
            });
          }
        });
      } else {
        print('Errore durante il recupero dei dati Serzizi in Conto: ${response.statusCode}');
      }
    } catch (error) {
      print('Errore durante la chiamata HTTP Serzizi in Conto: $error');
    }
    if(_Config=="Suite"){
      fetchTariffa();
    }else if(_Config=="Standard"){
      //calcolare totale addebiti
      double totale = 0.0;

      for (var nodo in _prodottiAddebiti) {
        for (var key in nodo.descrObject.keys) {
          for (var prodotto in nodo.descrObject[key]!) {

            totale += prodotto.prezzoListino * prodotto.nEle;
          }
        }
      }
      print("il totale è: ${totale}");
      setState(() {
        _Extra=totale;
      });
    }

  }

  Widget _buildNodoWidget(ContoProdotti nodo) {
    final DateTime data =
        DateTime.fromMillisecondsSinceEpoch(nodo.dataGestione);
    String dataString = data.toString().split(".")[0];
    return ExpansionTile(
      collapsedBackgroundColor: Colors.blue.shade200,
      collapsedTextColor: Colors.white,
      textColor: Colors.blue.shade500,
      title: Text(
        'ordine'.tr + dataString,
        style: TextStyle(fontWeight: FontWeight.w600, fontSize: 22),
      ),
      children: [
        for (var key in nodo.descrObject.keys)
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (var prodotto in nodo.descrObject[key]!)
                ListTile(
                  leading: prodotto.nEle != 0
                      ? Container(
                          width: 30,
                          height: 30,
                          padding: const EdgeInsets.only(
                            top: 1,
                            bottom: 1,
                            left: 8.5,
                            right: 1,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.green.shade400,
                            borderRadius: BorderRadius.circular(100),
                          ),
                          child: Text(
                            prodotto.nEle.toString(),
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        )
                      : null,
                  title: Text(
                    prodotto.descrizione,
                    style: TextStyle(fontWeight: FontWeight.w500, fontSize: 16),
                  ),
                  subtitle: Text(
                    'prezzo'.tr +
                        ': \€${prodotto.prezzoListino.toStringAsFixed(2)}',
                  ),
                ),
            ],
          ),
      ],
    );
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
          title: Text(
              'drawerConto'.tr,
              style: TextStyle(
              fontWeight: FontWeight.w700,
              color: Color(converti
                  .coloreDaStringa(settingsController.colorIconBar.value))),

        ),
        ),
        body: isLoading
            ? Center(
                child: CircularProgressIndicator(),
              )
            : WillPopScope(
                onWillPop: () async {
                  Get.to(const MyHomePage(),
                      transition: Transition.fadeIn,
                      duration: const Duration(milliseconds: 200));
                  return false;
                },
                child: Column(
                  children: [
                    Visibility(
                      visible: _Config=="Suite" ? true : _Config=="Standard" ? false : false,
                      child: Padding(
                        padding: const EdgeInsets.all(5.0),
                        child: Container(
                            padding: EdgeInsets.all(9),
                            child: Text(
                                "Check-In: ${_dataInizio.split("T")[0]}  Check-Out: ${_dataFine.split("T")[0]}"
                            ,style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w500),),
                          decoration: BoxDecoration(
                            color: Colors.blue.shade900, // Colore di sfondo
                            borderRadius: BorderRadius.circular(12), // Bordi arrotondati

                          ),

                        ),
                      ),
                    ),
                    Visibility(
                      visible: _Config=="Suite" ? true : _Config=="Standard" ? false : false,
                      child: ListTile(
                        leading: CircleAvatar(
                          child: Icon(
                            Icons.hotel,
                            color: Colors.blue.shade400,
                          ),
                          backgroundColor: Colors.grey.shade300,
                        ),
                        title: Text(
                          'tariffa'.tr,
                          style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w700,
                              color: Colors.black87),
                        ),
                        subtitle: Text(
                          'camera'.tr,
                          style: TextStyle(color: Colors.black54),
                        ),
                        trailing: Text(
                          "${_Tariffa}€",
                          style: TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                    ListTile(
                      leading: CircleAvatar(
                        child: Icon(
                          Icons.shopping_cart_outlined,
                          color: Colors.blue.shade400,
                        ),
                        backgroundColor: Colors.grey.shade300,
                      ),
                      title: Text(
                        'extra'.tr,
                        style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w700,
                            color: Colors.black87),
                      ),
                      subtitle: Text(
                        'extra2'.tr,
                        style: TextStyle(color: Colors.black54),
                      ),
                      trailing: Text(
                        "${_Extra}€",
                        style: TextStyle(
                            fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                    ),
                    Visibility(
                      visible: _Config=="Suite" ? true : _Config=="Standard" ? false : false,
                      child: ListTile(
                        leading: CircleAvatar(
                          child: Icon(
                            Icons.euro_outlined,
                            color: Colors.green,
                          ),
                          backgroundColor: Colors.grey.shade300,
                        ),
                        title: Text(
                          'totale'.tr,
                          style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w700,
                              color: Colors.black87),
                        ),
                        subtitle: Text(
                          'totale2'.tr,
                          style: TextStyle(color: Colors.black54),
                        ),
                        trailing: Text(
                          "${_Totale}€",
                          style: TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                    Text(
                      'ordiniApp'.tr,
                      style: TextStyle(
                          color: Colors.blue.shade900,
                          fontSize: 22,
                          fontWeight: FontWeight.w700),
                    ),
                    Expanded(
                      child: ListView.builder(
                        itemCount: _prodottiAddebiti.length,
                        itemBuilder: (BuildContext context, int index) {
                          return _buildNodoWidget(_prodottiAddebiti[index]);
                        },
                      ),
                    ),
                  ],
                ),
              ));
  }
}
