import 'dart:convert';
import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:tt_concierge/Pagine/ContoPage.dart';
import 'package:tt_concierge/Pagine/HotelPage.dart';
import 'package:tt_concierge/Pagine/EventiPage.dart';
import 'package:tt_concierge/Pagine/NotifichePage.dart';
import 'package:tt_concierge/Pagine/RistorantiPage.dart';
import 'package:tt_concierge/Pagine/RoomSPage.dart';
import 'package:tt_concierge/Pagine/SegnalazioniPage.dart';
import 'package:tt_concierge/Pagine/ServiziPage.dart';
import 'package:tt_concierge/Pagine/StatoOrdiniPage.dart';
import 'package:tt_concierge/Pagine/VisitaPage.dart';
import 'package:tt_concierge/Widgets/CardHome.dart';
import 'package:tt_concierge/Widgets/IconBar.dart';
import 'package:http/http.dart' as http;
import 'package:tt_concierge/utility/ColorConvert.dart';
import 'Classi/CardData.dart';
import 'package:tt_concierge/Controller/SettingsController.dart';
import 'package:url_launcher/url_launcher.dart';
import 'Classi/ContoServizi.dart';
import 'Pagine/InfoAppPage.dart';
import 'Pagine/login.dart';

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  var scaffoldKey = GlobalKey<ScaffoldState>();
  Color iconColor = Colors.black;
  List<CardData> _cardData = [];
  List<ContoServizi> _serviziAddebiti = [];
  int _counter = 0;
  ColorConvert converti = ColorConvert();
  bool abilitaRoomSOspiti = false;
  bool ordiniOpen = false;
  late String tipo;
  late String camera;
  final SettingsController settingsController = Get.find();
  String lingua = "";

  //final imageCache = ImageCache(imageUrl: imageUrl, width: width, height: height);

  @override
  void initState() {
    super.initState();

    fetchHomeCard(4); //gestire codice struttura
    isOrdiniOpen();
    //fetchAddebitiServizi();
    print(_cardData);
  }

  TimeOfDay parseTimeStringToTimeOfDay(String timeString) {
    // Dividi la stringa per ottenere ore e minuti
    List<String> parts = timeString.split(':');
    int hour = int.parse(parts[0]);
    int minute = int.parse(parts[1]);

    // Crea un oggetto TimeOfDay
    return TimeOfDay(hour: hour, minute: minute);
  }

  bool isTimeWithinRange(
      TimeOfDay currentTime, TimeOfDay startTime, TimeOfDay endTime) {
    // Converti gli orari in minuti dall'inizio della giornata per semplificare la comparazione
    int currentMinutes = currentTime.hour * 60 + currentTime.minute;
    int startMinutes = startTime.hour * 60 + startTime.minute;
    int endMinutes = endTime.hour * 60 + endTime.minute;

    // Verifica se l'ora attuale è all'interno dell'intervallo
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }

  bool isDateWithinRangeDate(
      DateTime currentTime, DateTime startTime, DateTime endTime) {
    // Normalizza le date impostando l'ora a mezzanotte
    DateTime normalizedCurrentTime =
        DateTime(currentTime.year, currentTime.month, currentTime.day);
    DateTime normalizedStartTime =
        DateTime(startTime.year, startTime.month, startTime.day);
    DateTime normalizedEndTime =
        DateTime(endTime.year, endTime.month, endTime.day);

    // Verifica se la data attuale è all'interno dell'intervallo o uguale all'inizio o alla fine
    return (normalizedCurrentTime.isAfter(normalizedStartTime) ||
            normalizedCurrentTime.isAtSameMomentAs(normalizedStartTime)) &&
        (normalizedCurrentTime.isBefore(normalizedEndTime) ||
            normalizedCurrentTime.isAtSameMomentAs(normalizedEndTime));
  }

  void isOrdiniOpen() {
    bool open = false;

    TimeOfDay now = TimeOfDay.now();
    TimeOfDay startTimeOrario =
        parseTimeStringToTimeOfDay(settingsController.orario['ini']);
    TimeOfDay endTimeOrario =
        parseTimeStringToTimeOfDay(settingsController.orario['fin']);
    bool isWithinRangeOrario =
        isTimeWithinRange(now, startTimeOrario, endTimeOrario);

    TimeOfDay startTimeOrario2 =
        parseTimeStringToTimeOfDay(settingsController.orario2['ini']);
    TimeOfDay endTimeOrario2 =
        parseTimeStringToTimeOfDay(settingsController.orario2['fin']);
    bool isWithinRangeOrario2 =
        isTimeWithinRange(now, startTimeOrario2, endTimeOrario2);

    TimeOfDay startTimeOrario3 =
        parseTimeStringToTimeOfDay(settingsController.orario3['ini']);
    TimeOfDay endTimeOrario3 =
        parseTimeStringToTimeOfDay(settingsController.orario3['fin']);
    bool isWithinRangeOrario3 =
        isTimeWithinRange(now, startTimeOrario3, endTimeOrario3);

    if (isWithinRangeOrario == true ||
        isWithinRangeOrario2 == true ||
        isWithinRangeOrario3 == true) {
      open = true;
    } else {
      open = false;
    }

    setState(() {
      ordiniOpen = open;
    });
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
          if (element.stato == "confermata" && element.nomeServizio == "Lido" ||
              element.stato == "confermata" &&
                  element.nomeServizio == "Beach") {
            print(element.ora.value[0]);
            print(element.ora.value[1]);

            print(
                element.dataIni.toString() + " " + element.dataFin.toString());

            //controllo orario della prenotazione
            // Parsing delle stringhe in oggetti TimeOfDay
            TimeOfDay startTime =
                parseTimeStringToTimeOfDay(element.ora.value[0]);
            TimeOfDay endTime =
                parseTimeStringToTimeOfDay(element.ora.value[1]);
            // Ottieni l'ora attuale del dispositivo
            TimeOfDay now = TimeOfDay.now();
            print("ora attuale: ${now}");
            // Verifica se l'ora attuale è all'interno dell'intervallo
            bool isWithinRange = isTimeWithinRange(now, startTime, endTime);
            print("è nell'orario corretto ? ${isWithinRange}");

            //controllo date prenotazione
            // Ottieni l'ora attuale del dispositivo
            DateTime nowDate = DateTime.now();
            print("data attuale: ${nowDate}");
            // Converti i millisecondi in oggetti DateTime
            DateTime startDateTime =
                DateTime.fromMillisecondsSinceEpoch(element.dataIni);
            DateTime endDateTime =
                DateTime.fromMillisecondsSinceEpoch(element.dataFin);
            // Verifica se l'ora attuale è all'interno dell'intervallo
            bool isWithinRangeDate =
                isDateWithinRangeDate(nowDate, startDateTime, endDateTime);
            print("è nel range di date corretto ? ${isWithinRangeDate}");

            if (isWithinRange == true && isWithinRangeDate == true) {
              setState(() {
                abilitaRoomSOspiti = true;
              });
            }
          }
        });
      } else {
        print('Errore durante il recupero dei dati: ${response.statusCode}');
      }
    } catch (error) {
      print('Errore durante la chiamata HTTP: $error');
    }
  }

  SnackBar snackbarPersonalizzata(String message, bool tipoErrore) {
    return SnackBar(
      duration: Duration(seconds: 4),
      showCloseIcon: true,
      content: Text(
        message,
        style: TextStyle(
            fontSize: 18.0, fontWeight: FontWeight.w600, color: Colors.white),
      ),
      backgroundColor: tipoErrore ? Colors.red : Colors.green.shade600,
      elevation: 6.0,
    );
  }

  // Clear products from Shared Preferences
  Future<void> clearProdotti() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('prodotti');
  }

  Future<void> fetchHomeCard(int hardcodStruttura) async {
    if (Get.locale.toString() == "en_US") {
      lingua = "Inglese";
    } else if (Get.locale.toString() == "it_IT") {
      lingua = "Italiano";
    }

    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? tipoo = await prefs.getString('tipo');
    String? cameraa = await prefs.getString('Camera');
    setState(() {
      tipo = tipoo!;
      camera = cameraa!;
    });

    int? codStruttura = prefs.getInt("idStruttura");
    print('chiamata su codice:${codStruttura}');

    try {
      final response = await http.get(settingsController.dev.isTrue
          ? Uri(
              scheme: 'http',
              host: '10.0.2.2',
              path: 'appHomeCard/${codStruttura}',
              port: 3000)
          : Uri.parse(
              'https://PRIVATO/api/appHomeCard/${codStruttura}'));
      if (response.statusCode == 200) {
        // Elaborare la risposta JSON
        //final data = jsonDecode(response.body);
        //print(data);
        final jsonData = jsonDecode(response.body) as List<dynamic>;
        setState(() {
          //_cardData = jsonData.map((data) => CardData.fromJson(data)).toList();
          List<CardData> card =
              jsonData.map((data) => CardData.fromJson(data)).toList();
          List<CardData> cardAttive =
              card.where((element) => element.attivo == true).toList();
          //cardAttive.sort((a,b)=> a.posizione.compareTo(b.posizione));
          _cardData = cardAttive;
        });
      } else {
        print('Errore durante il recupero dei dati: ${response.statusCode}');
      }
    } catch (error) {
      print('Errore durante la chiamata HTTP fetch home card: $error');
    }
  }

  Future<void> deleteAccount(int codStruttura, String idAccount) async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('token');
      final data = {
        "id": idAccount,
        "codStruttura": codStruttura.toString(),
      };
      print(data);
      final response = await http.delete(
          settingsController.dev.isTrue
              ? Uri(
                  scheme: 'http',
                  host: '10.0.2.2',
                  path: 'mobileUser/',
                  port: 3000)
              : Uri.parse(
                  'https://PRIVATO/api/mobileUser/'),
          body: jsonEncode(data),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json'
          });

      if (response.statusCode == 200) {
        // Elaborare la risposta JSON

        ScaffoldMessenger.of(context).showSnackBar(
          snackbarPersonalizzata("effettuataEliminazione".tr, false),
        );
        // Attende 5 secondi
        await Future.delayed(Duration(seconds: 5));

        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', '');
        await clearProdotti();
        Get.to(Login());
      } else {
        print(
            'Errore durante la cancellazione account: ${response.statusCode}');

        ScaffoldMessenger.of(context).showSnackBar(
          snackbarPersonalizzata("erroreEliminazione".tr, true),
        );
        // Attende 5 secondi
        await Future.delayed(Duration(seconds: 5));
      }
    } catch (error) {
      print('Errore durante la chiamata HTTP cancellazione account: $error');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      /*
      key: scaffoldKey,
      drawer: Drawer(
        child: ListView(
          children: [
            ListTile(
              title: const Text("home"),
              onTap: () {
                Navigator.pop(context);
              },
            )
          ],
        ),
      ),
      */

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
            Text(
              "Home",
              style: TextStyle(
                  fontWeight: FontWeight.w700,
                  color: Color(converti
                      .coloreDaStringa(settingsController.colorIconBar.value))),
            ),
          ],
        ),
        actions: <Widget>[
          /*
          IconButton(
              onPressed: () => {
                /*settingsController.updateSettings("fff", "fff", "ffff", "fff", "fff", "fff", "fff", "fff", {1,1})*/
                print(settingsController.sfondoApp.value),
              },
              icon: Icon(
                Icons.call,
                color: Color(converti.coloreDaStringaIcon(settingsController.colorIconBar.value)),
              )),

           */
          IconButton(
              onPressed: () => {
                    if (tipo == "esterno")
                      {
                        //snack
                        print("ciao"),
                        ScaffoldMessenger.of(context).showSnackBar(
                          snackbarPersonalizzata("errorGuest".tr, true),
                        ),
                      }
                    else
                      {Get.to(ContoPage())}
                  },
              icon: Icon(
                Icons.account_balance_wallet,
                //Icons.euro_outlined,
                //Icons.payment_rounded,
                //Icons.perm_identity_rounded,
                color: Color(converti.coloreDaStringaIcon(
                    settingsController.colorIconBar.value)),
              )),
          IconButton(
              onPressed: () async => {
                    await launchUrl(
                        Uri.parse(settingsController.linkMeteo.value))
                  },
              icon: Icon(
                Icons.sunny_snowing,
                color: Color(converti.coloreDaStringaIcon(
                    settingsController.colorIconBar.value)),
              )),
          IconButton(
              onPressed: () => {Get.to(() => NotifichePage())},
              icon: Icon(
                Icons.notifications_active,
                color: Color(converti.coloreDaStringaIcon(
                    settingsController.colorIconBar.value)),
              )),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
                decoration: BoxDecoration(
                    color: Colors.grey,
                    image: DecorationImage(
                      image: NetworkImage(settingsController.iconApp.value),
                      //height: 150,
                      fit: BoxFit.cover,
                    )),
                child: Text("")),
            ListTile(
              leading: Icon(Icons.notifications_active),
              title: Text('drawerNotifiche'.tr),
              onTap: () {
                Get.to(() => NotifichePage());
                //Navigator.pop(context);
              },
            ),
            ListTile(
              leading: Icon(Icons.pending_actions),
              title: Text('drawerStato'.tr),
              onTap: () {
                Get.to(() => StatoOrdini());
                //Navigator.pop(context);
              },
            ),
            ListTile(
              leading: Icon(Icons.account_balance_wallet),
              title: Text('drawerConto'.tr),
              onTap: () {
                if (tipo == "esterno") {
                  //snack
                  print("ciao");
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    snackbarPersonalizzata("errorGuest".tr, true),
                  );
                } else {
                  Get.to(ContoPage());
                }

                //Navigator.pop(context);
              },
            ),
            ListTile(
              leading: Icon(Icons.sunny_snowing),
              title: Text('drawerMeteo'.tr),
              onTap: () async {
                await launchUrl(Uri.parse(settingsController.linkMeteo.value));
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: Icon(Icons.warning),
              title: Text('drawerSegnalazioni'.tr),
              onTap: () {
                Get.to(() => SegnalazioniPage());
                //Navigator.pop(context);
              },
            ),
            ListTile(
              leading: Icon(Icons.info),
              title: Text('drawerInfo'.tr),
              onTap: () {
                Get.to(() => InfoAppPage());
                //Navigator.pop(context);
              },
            ),
            Visibility(
              visible: camera == "esterno" ? true : false,
              child: ListTile(
                leading: Icon(
                  Icons.delete_forever,
                  color: Colors.red,
                  size: 26,
                ),
                //tileColor: Colors.white,
                title: Text(
                  'eliminaAccountDrawer'.tr,
                  style: TextStyle(
                      color: Colors.red,
                      fontWeight: FontWeight.w700,
                      fontSize: 18),
                ),
                onTap: () async {

                    // Mostra l'alert dialog
                    showDialog(
                      context: context,
                      builder: (BuildContext context) {
                        return AlertDialog(
                          title: Text('titoloAlert'.tr),
                          content: Text('textElimina'.tr),
                          actions: [
                            TextButton(
                              child: Text('annullaEliminazione'.tr),
                              onPressed: () {
                                // Chiude il dialog e non esegue nessuna azione
                                Navigator.of(context).pop();
                              },
                            ),
                            TextButton(
                              child: Text('confermaEliminazione'.tr),
                              onPressed: () async {
                                // Azioni da eseguire se l'utente decide di uscire
                                Navigator.of(context).pop();
                                Navigator.of(context).pop();
                                SharedPreferences prefs =
                                    await SharedPreferences.getInstance();
                                String? idAccount =
                                    await prefs.getString('idAccount') ?? '';
                                int? codStruttura =
                                    prefs.getInt("idStruttura") ?? 0;
                                await deleteAccount(codStruttura, idAccount);
                              },
                            ),
                          ],
                        );
                      },
                    );

                },
              ),
            ),
            ListTile(
              leading: Icon(
                Icons.exit_to_app,
                color: Colors.white,
                size: 26,
              ),
              tileColor: Colors.red,
              title: Text(
                'drawerLogout'.tr,
                style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 18),
              ),
              onTap: () async {
                if (tipo == "esterno") {
                  // Mostra l'alert dialog
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        title: Text("Attenzione"),
                        content: Text(
                            "Effettuando il logout il tuo utente (Guest) verrà eliminato."),
                        actions: [
                          TextButton(
                            child: Text("Annulla"),
                            onPressed: () {
                              // Chiude il dialog e non esegue nessuna azione
                              Navigator.of(context).pop();
                            },
                          ),
                          TextButton(
                            child: Text("Logout"),
                            onPressed: () async {
                              // Azioni da eseguire se l'utente decide di uscire
                              Navigator.of(context).pop(); // Chiude il dialog
                              SharedPreferences prefs =
                                  await SharedPreferences.getInstance();
                              await prefs.setString('token', '');
                              await prefs.setString('Camera', '');
                              await clearProdotti();
                              Get.to(Login());
                            },
                          ),
                        ],
                      );
                    },
                  );
                } else {
                  SharedPreferences prefs =
                      await SharedPreferences.getInstance();
                  await prefs.setString('token', '');
                  await prefs.setString('Camera', '');
                  await clearProdotti();
                  Get.to(Login());
                  //Navigator.pop(context);
                }
              },
            ),
          ],
        ),
      ),
      body: WillPopScope(
        onWillPop: () async {
          return false;
        },
        child: Stack(
          children: [
            Container(
                color: Colors.white,
                //padding: EdgeInsets.all(20),
                child: ListView.builder(
                    itemCount: _cardData.length,
                    itemBuilder: (context, index) {
                      final card = _cardData[index];
                      return GestureDetector(
                        onTap: () async {
                          // Azione da eseguire al click sulla card
                          print('Hai cliccato sulla card: ${card.nome}');
                          if (card.id == "Hotel") {
                            Get.to(const HotelPage(),
                                transition: Transition.rightToLeft,
                                duration: const Duration(milliseconds: 200));
                          }
                          if (card.id == "Eventi") {
                            Get.to(const EventiPage(),
                                transition: Transition.rightToLeft,
                                duration: const Duration(milliseconds: 200));
                          }
                          if (card.id == "Ristoranti") {
                            Get.to(const RistorantiPage(),
                                transition: Transition.rightToLeft,
                                duration: const Duration(milliseconds: 200));
                          }
                          if (card.id == "RoomS") {
                            /*
                            Get.to(const RoomSPage(),
                                transition: Transition.rightToLeft,
                                duration: const Duration(milliseconds: 200));
                          */
                            //parte per fare controllo su prenotazioni e fare entrare solo se ha prenotato lido
                            await fetchAddebitiServizi();
                            if (tipo == "interno") {
                              if (ordiniOpen == true) {
                                Get.to(const RoomSPage(),
                                    transition: Transition.rightToLeft,
                                    duration:
                                        const Duration(milliseconds: 200));
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  snackbarPersonalizzata(
                                      "errorOrario".tr +
                                          " (${settingsController.orario['ini']} - ${settingsController.orario['fin']})" +
                                          " (${settingsController.orario2['ini']} - ${settingsController.orario2['fin']})" +
                                          " (${settingsController.orario3['ini']} - ${settingsController.orario3['fin']})",
                                      true),
                                );
                              }
                            } else if (tipo == "esterno") {
                              if (abilitaRoomSOspiti == true) {
                                if (ordiniOpen == true) {
                                  Get.to(const RoomSPage(),
                                      transition: Transition.rightToLeft,
                                      duration:
                                          const Duration(milliseconds: 200));
                                } else {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    snackbarPersonalizzata(
                                        "errorOrario".tr +
                                            " (${settingsController.orario['ini']} - ${settingsController.orario['fin']})" +
                                            " (${settingsController.orario2['ini']} - ${settingsController.orario2['fin']})" +
                                            " (${settingsController.orario3['ini']} - ${settingsController.orario3['fin']})",
                                        true),
                                  );
                                }
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  snackbarPersonalizzata("errorGuest".tr, true),
                                );
                              }
                            }
                          }
                          if (card.id == "Servizi") {
                            Get.to(const ServiziPage(),
                                transition: Transition.rightToLeft,
                                duration: const Duration(milliseconds: 200));
                          }
                          if (card.id == "Visita") {
                            Get.to(const VisitaPage(),
                                transition: Transition.rightToLeft,
                                duration: const Duration(milliseconds: 200));
                          }
                        },
                        child: lingua == "Italiano"
                            ? CardHome(
                                icon: Icons.access_alarms,
                                color: card.colore,
                                urlImage: card.sfondo,
                                titolo: card.nome,
                                descrizione: 'ciao')
                            : CardHome(
                                icon: Icons.access_alarms,
                                color: card.colore,
                                urlImage: card.sfondo,
                                titolo: card.nomeEn,
                                descrizione: 'ciao'),
                      );
                    })

                /*
              ListView(
                children: [
                  CardHome(
                    icon: Icons.access_alarms,
                    color: Colors.deepPurple,
                    urlImage:
                        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/1d/b2/5d/castello-di-san-marco.jpg?w=700&h=-1&s=1",
                    titolo: "Hotel",
                    descrizione: "sempre",
                  ),
                  CardHome(
                    icon: Icons.ac_unit,
                    color: Colors.deepPurple,
                    urlImage:
                        "https://asset1.zankyou.com/images/wervice-card-big/6c4/e34a/1050/800/w/16270/-/1649418320.jpg",
                    titolo: "Eventi",
                    descrizione: "bla bla",
                  ),
                  CardHome(
                    icon: Icons.co_present,
                    color: Colors.deepPurple,
                    urlImage:
                        "https://images.unsplash.com/photo-1641924676093-42e61835bbe2?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    titolo: "Servizio in Camera",
                    descrizione: "Aperto tutto il giorno",
                  ),
                  CardHome(
                    icon: Icons.accessibility_new,
                    color: Colors.deepPurple,
                    urlImage:
                        "https://images.unsplash.com/photo-1503434396599-58ba8a18d932?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    titolo: "Servizi",
                    descrizione: "sempre",
                  ),
                  CardHome(
                    icon: Icons.accessible_forward_sharp,
                    color: Colors.deepPurple,
                    urlImage:
                        "https://static.charmingsardinia.com/hotels/245/gallery/files/castello-san-marco14.jpg",
                    titolo: "Ristoranti convenzionati",
                    descrizione: "sempre",
                  ),
                ],
              ),
              */
                ),
            /*
            Positioned(
                left: 10,
                top: 0,
                child: IconButton(
                    onPressed: () => {scaffoldKey.currentState?.openDrawer()},
                    icon: const Icon(
                      Icons.menu,
                      size: 25,
                      color: Colors.white,
                    ))),
            //IconBar(t: 0, b: null, l: 10, r: null, icon: Icons.menu, iconColor: Colors.white),
            IconBar(t: 0, b: null, l: 80, r: null, icon: Icons.perm_identity_rounded, iconColor: Colors.white),
            IconBar(t: 0, b: null, l: 160, r: 160, icon: Icons.call, iconColor: Colors.white),
            IconBar(t: 0, b: null, l: null, r: 80, icon: Icons.sunny, iconColor: Colors.white),
            IconBar(t: 0, b: null, l: null, r: 10, icon: Icons.notifications, iconColor: Colors.white),
         */
          ],
        ),
      ),
    );
  }
}
