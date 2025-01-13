import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tt_concierge/Classi/Prodotto.dart';
import 'package:tt_concierge/Controller/SettingsController.dart';
import 'package:get/get.dart';
import 'package:tt_concierge/MyHomePage.dart';
import 'package:tt_concierge/Pagine/CarrelloProdotti.dart';
import '../Classi/Nodo.dart';
import '../Widgets/fullScreenImage.dart';
import '../utility/ColorConvert.dart';
import 'dart:convert';

class RoomSPage extends StatefulWidget {
  const RoomSPage({super.key});

  @override
  State<RoomSPage> createState() => _RoomSPageState();
}

class _RoomSPageState extends State<RoomSPage> {
  //List<CardHotel> _cardHotel = [];
  List<Nodo> _nodi = [];
  List<Prodotto> prodottiCarrello = [];
  int nEleCarrello = 0;
  ColorConvert converti = ColorConvert();
  final SettingsController settingsController = Get.find();
  String lingua = "Italiano";
  String _Config = "";

  @override
  void initState() {
    super.initState();
    //fetchProdotti();
    loadProdottiCarrello();
    //inizializzaProdottiCarrelloSelezionati(_nodi,prodottiCarrello);
    //clearProdotti();
  }

  void inizializzaProdottiCarrelloSelezionati(
      List<Nodo> nodi, List<Prodotto> prodottiCarrello) {
    print("entro in inizializza");
    for (var nodo in nodi) {
      for (var entry in nodo.descrObject.entries) {
        String key = entry.key;
        List<Prodotto> prodotti = entry.value;

        for (var prodotto in prodotti) {
          // Trova il prodotto corrispondente nel carrello
          Prodotto? prodottoInCarrello;
          for (var p in prodottiCarrello) {
            print(p.descrizione);
            if (p.idProdotto == prodotto.idProdotto) {
              prodottoInCarrello = p;
              break;
            }
          }

          if (prodottoInCarrello != null) {
            // Aggiorna la quantità del prodotto
            prodotto.nEle = prodottoInCarrello.nEle;
            print('descrizione: ' + prodotto.descrizione);
            print(prodotto.nEle);
          } else {
            print("Prodotto non trovato nel carrello: ${prodotto.idProdotto}");
          }
        }
      }
    }
  }

  void loadProdottiCarrello() async {
    print("load carrello");
    prodottiCarrello = await getProdotti();
    int numeroCarrello = 0;
    prodottiCarrello.forEach((element) {
      numeroCarrello = numeroCarrello + element.nEle;
    });
    nEleCarrello = numeroCarrello;
    settingsController.nEleCarrello.value = nEleCarrello;
    setState(() {});
    fetchProdotti();
  }

  Future<void> saveProdotti(List<Prodotto> prodotti) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    List<String> jsonProdotti =
        prodotti.map((prodotto) => jsonEncode(prodotto.toJson())).toList();
    await prefs.setStringList('prodotti', jsonProdotti);
  }

  Future<List<Prodotto>> getProdotti() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    List<String>? jsonProdotti = prefs.getStringList('prodotti');
    if (jsonProdotti == null) {
      return [];
    }
    return jsonProdotti
        .map((jsonProdotto) => Prodotto.fromJson(jsonDecode(jsonProdotto)))
        .toList();
  }

  // Clear products from Shared Preferences
  Future<void> clearProdotti() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('prodotti');
  }

  Future<void> fetchProdotti() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? ipStruttura = prefs.getString('ipStruttura');
    String? DBname = prefs.getString('DBname');
    String? token = prefs.getString('token');
    int? idAzienda = prefs.getInt('IdAzienda');
    int? codStruttura = prefs.getInt("idStruttura");
    String? config = await prefs.getString('tipoConfigurazione') ?? '';
    setState(() {
      _Config = config;
    });
    //print(token);
    //print("l'ip struttuta è: ${ipStruttura}");
    try {
      if (config == "Suite") {
        final response = await http.post(
          settingsController.dev.isTrue
              ? Uri(
                  scheme: 'http',
                  host: '10.0.2.2',
                  path: 'suite/prodottiCar',
                  port: 3000)
              : Uri.parse(
                  'https://PRIVATO/api/suite/prodottiCar'),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
            // Aggiungi altri header se necessario
          },
          body: jsonEncode(
              {'ip': ipStruttura, 'DBname': DBname, 'IdAzienda': idAzienda}),
        );
        if (response.statusCode == 200) {
          // Elaborare la risposta JSON
          //final data = jsonDecode(response.body);
          //print(data);
          //final jsonData = jsonDecode(response.body) as List<dynamic>;
          List<dynamic> parsedJson = jsonDecode(response.body);
          parsedJson.forEach((item) {
            setState(() {
              _nodi.add(Nodo.fromJson(item));
            });
            //print(_nodi);
          });
        } else {
          print('Errore durante il recupero dei dati: ${response.statusCode}');
        }
      } else if (config == "Standard") {
        final response = await http.get(
          settingsController.dev.isTrue
              ? Uri(
                  scheme: 'http',
                  host: '10.0.2.2',
                  path: 'nodiProdotti/${codStruttura}',
                  port: 3000)
              : Uri.parse(
                  'https://PRIVATO/api/nodiProdotti/${codStruttura}'),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
            // Aggiungi altri header se necessario
          },
        );

        final response2 = await http.get(
          settingsController.dev.isTrue
              ? Uri(
                  scheme: 'http',
                  host: '10.0.2.2',
                  path: 'prodotti/${codStruttura}',
                  port: 3000)
              : Uri.parse(
                  'https://PRIVATO/api/prodotti/${codStruttura}'),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
            // Aggiungi altri header se necessario
          },
        );

        if (response.statusCode == 200 && response2.statusCode == 200) {
          List<dynamic> parsedJson = jsonDecode(response.body);
          List<dynamic> parsedJson2 = jsonDecode(response2.body);
          List<dynamic> nodiFiltrati = parsedJson
              .where((ele) => ele['descrizione'].startsWith('car-'))
              .toList();

          for (var item in nodiFiltrati) {
            int idNodo = item['id'];
            List<Prodotto> prodottiFiltrati = [];

            List<dynamic> prodotti = parsedJson2
                .where((ele) => ele['nodoIdList'].contains(item['id']))
                .toList();
            for (var prodotto in prodotti) {
              late double prezzo;
              if (prodotto['prezzo'] is int) {
                prezzo = (prodotto['prezzo'] as int).toDouble();
              } else {
                prezzo = prodotto['prezzo'];
              }

              late Prodotto p;
              if (Get.locale.toString() == "en_US") {
                p = Prodotto(
                  idProdotto: prodotto['id'],
                  descrizione: prodotto['descrizioneEn'],
                  tipo: prodotto['immagine'],
                  idTassa: 999,//uso per label iva
                  idLivelloRicavo: 999,//uso per val iva
                  prezzoListino: prezzo,
                  prezzoLordo: prezzo,
                  valueIva: prodotto['iva']['value'],
                  labelIva: prodotto['iva']['label'],
                );
              } else if (Get.locale.toString() == "it_IT") {
                p = Prodotto(
                  idProdotto: prodotto['id'],
                  descrizione: prodotto['descrizione'],
                  tipo: prodotto['immagine'],
                  idTassa: 999,//uso per label iva
                  idLivelloRicavo:  999,//uso per val iva
                  prezzoListino: prezzo,
                  prezzoLordo: prezzo,
                  valueIva: prodotto['iva']['value'],
                  labelIva: prodotto['iva']['label'],
                );
              }

              prodottiFiltrati.add(p);
            }

            Nodo n = Nodo(
              idNodo: idNodo,
              descrizione: item['descrizione'],
              descrObject: {'prodotti': prodottiFiltrati},
              // Sostituisci con la tua struttura
              idLivelloRicavo: [999],
              n: 0,
            );

            setState(() {
              _nodi.add(n);
            });
          }
        } else {
          print(
              'Errore durante il recupero dei dati in fetch prodotti: ${response.statusCode}');
        }
      }
    } catch (error) {
      print('Errore durante la chiamata HTTP fetchProdotti: $error');
      ScaffoldMessenger.of(context)
          .showSnackBar(snackbarPersonalizzata('erroreCaricamento'.tr, true));
      Get.to(const MyHomePage(),
          transition: Transition.leftToRightWithFade,
          duration: const Duration(milliseconds: 200));
    }
    inizializzaProdottiCarrelloSelezionati(_nodi, prodottiCarrello);
  }

  Widget _buildNodoWidget(Nodo nodo) {
    List<String> desc = nodo.descrizione.split('-');
    String descrizione = desc.last;
    return ExpansionTile(
      //backgroundColor:Colors.blue,
      collapsedBackgroundColor: Colors.blue.shade200,
      collapsedTextColor: Colors.white,
      textColor: Colors.blue.shade500,
      title: Text(descrizione,
          style: TextStyle(fontWeight: FontWeight.w600, fontSize: 22)),
      children: [
        for (var key in nodo.descrObject.keys)
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.only(left: 16.0),
                child: Text(key,
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.blue.shade400,
                        fontSize: 16)),
              ),
              for (var prodotto in nodo.descrObject[key]!)
                ListTile(
                  leading: prodotto.nEle != 0 &&
                          _Config ==
                              "Suite" //faccio vedere quantità selezionata
                      ? Container(
                          width: 30,
                          height: 30,
                          //margin: EdgeInsets.symmetric(horizontal: 10),
                          padding: const EdgeInsets.only(
                              top: 1, bottom: 1, left: 8.5, right: 1),
                          decoration: BoxDecoration(
                              color: Colors.green.shade400,
                              borderRadius: BorderRadius.circular(100)),
                          child: Text(
                            prodotto.nEle.toString(),
                            style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Colors.white),
                          ),
                        )
                      /*
                  Text(
                          prodotto.n.toString(),
                          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                        )

                   */
                      : _Config == "Standard"
                          ? SizedBox(
                              width: 45,
                              height: 45,
                              child: GestureDetector(
                                onTap: () => {
                                  if (prodotto.tipo.toString() != "")
                                    {
                                      print("entra"),
                                      Get.to(FullScreenImageScreen(
                                          prodotto.tipo.toString()))
                                    }
                                },
                                child: prodotto.tipo != ""
                                    ? ClipRRect(
                                        borderRadius:
                                            BorderRadius.circular(22),
                                        // Arrotonda l'immagine
                                        child: Image.network(
                                          prodotto.tipo.toString(),
                                          fit: BoxFit
                                              .cover, // Assicura che l'immagine copra completamente il FittedBox
                                        ),
                                      )
                                    : CircleAvatar(
                                        //backgroundColor: Colors.grey.shade400,
                                        foregroundColor: Colors.blue,
                                        child: Icon(Icons
                                            .fastfood_rounded) //Text('A'), // puoi usare l'iniziale del nome del contatto o una foto
                                        ),
                              ),
                            )
                          : null,
                  title: Text(
                    prodotto.descrizione,
                    style: TextStyle(fontWeight: FontWeight.w500, fontSize: 16),
                  ),
                  subtitle: Row(
                    children: [
                      Text('prezzo'.tr +
                          ': \€${prodotto.prezzoListino.toStringAsFixed(2)}'),
                      prodotto.nEle != 0 &&
                              _Config ==
                                  "Standard" //faccio vedere quantità selezionata
                          ? Container(
                              height: 30,
                              //margin: EdgeInsets.symmetric(horizontal: 10),
                              padding: const EdgeInsets.only(
                                  top: 1, bottom: 1, left: 8.5, right: 1),
                              decoration: BoxDecoration(
                                  //color: Colors.white,
                                  borderRadius: BorderRadius.circular(100)),
                              child: Text(
                                " x ${prodotto.nEle.toString()}",
                                style: const TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.green),
                              ),
                            )
                          : Text("")
                    ],
                  ),
                  trailing: prodotto.nEle !=
                          0 //faccio vedere cassonetto elimina
                      ? IconButton(
                          onPressed: () {
                            setState(() {
                              if (prodotto.nEle > 1) {
                                prodotto.nEle--;
                                settingsController.decrementCarrello();
                                //_prodottiCarrello.removeWhere((element) => element.idProdotto==prodotto.idProdotto);
                                //print(_prodottiCarrello);
                              } else {
                                prodottiCarrello.removeWhere((element) =>
                                    element.idProdotto == prodotto.idProdotto);
                                prodotto.nEle--;
                                settingsController.decrementCarrello();
                                saveProdotti(prodottiCarrello);
                                prodottiCarrello.forEach((element) {
                                  print(element.descrizione);
                                });
                              }
                            });
                          },
                          icon: const Icon(
                            Icons.delete_forever_rounded,
                            color: Colors.red,
                            size: 35,
                          ))
                      : null,
                  onTap: () {
                    // Aggiungi qui l'azione da eseguire quando un prodotto viene selezionato
                    //print(prodotto.descrizione);
                    setState(() {
                      prodotto.nEle++;
                      settingsController.incrementCarrello();
                      int posizione = 0;
                      if (prodottiCarrello.isNotEmpty) {
                        print("Carrello no vuoto");
                        posizione = prodottiCarrello.indexWhere((element) =>
                            element.idProdotto == prodotto.idProdotto);
                        print("la posizione è ${posizione}");
                        prodotto.prezzoListino = double.tryParse(
                            prodotto.prezzoListino.toStringAsFixed(2))!;
                        if (posizione != -1) {
                          print(
                              "Già presente un prodotto uguale, quindi incremento");
                          // Rimuovi il prodotto esistente
                          prodottiCarrello.removeAt(posizione);
                          // Aggiungi il prodotto aggiornato nella stessa posizione
                          prodottiCarrello.insert(posizione, prodotto);
                        } else {
                          print(
                              "prodotto non presente nel carrello quindi aggiungo");
                          prodottiCarrello.add(prodotto);
                        }
                      } else {
                        print(
                            "Carrello vuoto quindi aggiungo elemento e basta");
                        prodottiCarrello.add(prodotto);
                      }
                      prodottiCarrello.forEach((element) {
                        print(
                            "${element.descrizione} + ${element.nEle} per ${prodottiCarrello.length} elementi");
                      });
                      //_prodottiCarrello.add(prodotto);
                      //print(_prodottiCarrello);
                      saveProdotti(prodottiCarrello);
                    });
                  },
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
        title: Row(
          children: [
            /*
          Image.network(
            'https://images.unsplash.com/photo-1596431749951-1bbb4e396436?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            width: 150,
            height: 150,
          ),*/ // URL dell'immagine PNG
            //SizedBox(width: 8), // Spazio tra l'immagine e il testo
            Text('ordini'.tr,
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  color: Color(converti.coloreDaStringaIcon(
                      settingsController.colorIconBar.value)),
                )),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 10.0),
            child: Badge(
              //padding: EdgeInsets.all(7),
              backgroundColor: settingsController.nEleCarrello.value != 0
                  ? Colors.red
                  : Colors.transparent,
              label: settingsController.nEleCarrello.value != 0
                  ? Obx(() =>
                      Text(settingsController.nEleCarrello.value.toString()))
                  : null,
              child: InkWell(
                onTap: () {
                  settingsController.saveProdotti(prodottiCarrello);
                  Get.to(CarrelloProdotti(
                    prodotti: prodottiCarrello,
                  ));
                },
                child: Icon(
                  Icons.shopping_cart_outlined,
                  size: 30,
                  color: Color(converti.coloreDaStringaIcon(
                      settingsController.colorIconBar.value)),
                ),
              ),
            ),
          ),
        ],
        /*
        actions: <Widget>[
          IconButton(
              onPressed: () => {},
              icon: Icon(
                Icons.call,
                color: Color(converti.coloreDaStringaIcon(settingsController.colorIconBar.value)),
              )),
          IconButton(
              onPressed: () => {},
              icon: Icon(
                Icons.perm_identity_rounded,
                color: Color(converti.coloreDaStringaIcon(settingsController.colorIconBar.value)),
              )),
          IconButton(
              onPressed: () => {},
              icon: Icon(
                Icons.sunny,
                  color: Color(converti.coloreDaStringaIcon(settingsController.colorIconBar.value)),
              )),
          IconButton(
              onPressed: () => {},
              icon: Icon(
                Icons.notifications,
                color: Color(converti.coloreDaStringaIcon(settingsController.colorIconBar.value)),
              )),
        ],

         */
      ),
      body: WillPopScope(
        onWillPop: () async {
          Get.to(const MyHomePage(),
              transition: Transition.leftToRightWithFade,
              duration: const Duration(milliseconds: 200));
          return false;
        },
        child: _nodi.isNotEmpty
            ? ListView.builder(
                itemCount: _nodi.length,
                itemBuilder: (BuildContext context, int index) {
                  return _buildNodoWidget(_nodi[index]);
                },
              )
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Center(
                    child:
                        CircularProgressIndicator(), // Visualizza un indicatore di caricamento finché non vengono ricevuti i dati
                  ),
                  Text("Loading...")
                ],
              ),
      ),
    );
  }
}
