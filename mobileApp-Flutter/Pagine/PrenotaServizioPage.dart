import 'dart:convert';
import 'dart:ffi';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart';
import 'package:tt_concierge/MyHomePage.dart';
import '../Classi/CardServizi.dart';
import '../Classi/ProdottiServizi.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_date_range_picker/flutter_date_range_picker.dart';
import 'package:intl/intl.dart';
import 'package:tt_concierge/Controller/SettingsController.dart';
import 'package:get/get.dart';
import 'package:timezone/timezone.dart' as tz;
import '../utility/ColorConvert.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:tt_concierge/Classi/Prodotto.dart' as ProdottoCompleto;

class PrenotaServizioPage extends StatefulWidget {
  CardServizi servizio;

  PrenotaServizioPage({super.key, required this.servizio});

  @override
  State<PrenotaServizioPage> createState() => _PrenotaServizioPageState();
}

class _PrenotaServizioPageState extends State<PrenotaServizioPage> {
  final _formKey = GlobalKey<FormState>();
  ColorConvert converti = ColorConvert();
  bool obbligatorio = false;
  List<ProdottiServizi> _prodotti = [];
  Prodotto? selectedProdotto;
  Object selectProdottoObject = {};
  late List<Prodotto> pr = [];
  List<FasciaOraria> fasce = [];
  FasciaOraria? selectedFascia;
  TextEditingController _noteController = TextEditingController();
  TextEditingController _nome = TextEditingController();
  TextEditingController _cognome = TextEditingController();
  TextEditingController _mail = TextEditingController();
  TextEditingController _telefono = TextEditingController();
  TextEditingController _quantita = TextEditingController();
  DateTimeRange? _selectedDateRange;
  late int startTimestamp = 0;
  late int endTimestamp = 0;
  double totale = 0;
  double giorni = 0;
  late bool disponibile;
  late bool compilati;
  List<Map<String, dynamic>> disponibilitaPerData = [];
  List<dynamic> disponibilitaPiena = [];
  final SettingsController settingsController = Get.find();
  late List<String> datePiene = [];
  bool checkMail = false;
  bool checkTel = false;
  bool checkNome = false;
  bool checkCognome = false;
  bool _isButtonDisabled = false;
  bool _caricamento = false;
  String _config = "";
  String _tipo = "";
  String _camera = "";

  String? paymentIntentClientSecret;

  static SnackBar success = SnackBar(
    content: Text(
      'snackInviata'.tr,
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

  static SnackBar errorServer = SnackBar(
    duration: Duration(seconds: 6),
    content: Text(
      'snackErrorePrenotazione'.tr,
      style: TextStyle(
          fontSize: 16.0, fontWeight: FontWeight.bold, color: Colors.white),
    ),
    backgroundColor: Colors.red,
    elevation: 6.0,
    //padding: EdgeInsets.all(16.0),
    //margin: EdgeInsets.only(bottom: 20.0),
  );

  SnackBar snackbarDisponibilita(String message, bool disponibile) {
    return SnackBar(
      duration: Duration(seconds: 6),
      content: Text(
        message,
        style: TextStyle(
            fontSize: 20.0, fontWeight: FontWeight.bold, color: Colors.white),
      ),
      backgroundColor: disponibile ? Colors.green : Colors.yellow.shade900,
      elevation: 6.0,
    );
  }

  SnackBar snackbarPersonalizzata(String message, bool tipoErrore) {
    setState(() {
      obbligatorio = true;
    });
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

  @override
  void initState() {
    super.initState();
    _quantita.text = 1.toString();
    test();
    fetchProdottiServizi(3);
    settingsController.fetchIP();
  }

  void _showDateRangePicker() async {
    DateTime today = DateTime.now();
    DateTime initial = DateTime.now();

    final DateTime firstDate = DateTime.fromMillisecondsSinceEpoch(
        widget.servizio.dataIni,
        isUtc: false);

    final DateTime lastDate = DateTime.fromMillisecondsSinceEpoch(
        widget.servizio.dataFin,
        isUtc: false); // Assicurati che non usi UTC

    if (today.isBefore(firstDate)) {
      setState(() {
        initial = firstDate;
        today = firstDate;
      });
    }

    final DateTime initialDate = _selectedDateRange?.start ?? today;

    final selectedDateRange = await showDateRangePicker(
      context: context,
      firstDate: today,
      lastDate: lastDate,
      initialDateRange:
      _selectedDateRange ?? DateTimeRange(start: today, end: today),
    );

    if (selectedDateRange != null) {
      setState(() {
        _selectedDateRange = selectedDateRange;
        startTimestamp =
            _selectedDateRange!
                .start
                .toLocal()
                .millisecondsSinceEpoch;
        endTimestamp = _selectedDateRange!
            .end
            .toLocal()
            .millisecondsSinceEpoch;
        print("data inizio: ${startTimestamp}");
        print("data fine: ${endTimestamp}");
        // Calcola la durata tra le due date selezionate
        Duration difference =
        _selectedDateRange!.end.difference(_selectedDateRange!.start);
        // Ottieni il numero di giorni come valore double
        double numberOfDays = difference.inDays.toDouble() + 1;
        // Salva il risultato o esegui qualsiasi altra operazione necessaria
        giorni = numberOfDays;
        print("Numero di giorni selezionati: $numberOfDays");
      });
      calcolaTotale();
    }
  }

  void handleChangeProdotto(Prodotto prodottoSelezionato) {

    selectedFascia = null; // Reset selectedFascia when product changes
    widget.servizio.prodottiFasce.forEach((element) {//per assegnare fasce corrette nella select
      if (element.idProdotto == prodottoSelezionato.value) {
        setState(() {
          fasce = element.fasceOrarie;
        });
      }
    });
    _prodotti.forEach((element) {
      if (element.idProdotto == prodottoSelezionato.value){

        Object dati={
          'value':prodottoSelezionato.value,
          'label':prodottoSelezionato.label,
          'ivaValue':element.valueIva,
          'ivaLabel':element.labelIva,
        };
        setState(() {
          selectProdottoObject=dati;
        });
      }
    });
  }

  void test() {
    if (widget.servizio.prodotti.isNotEmpty) {
      print(widget.servizio.prodotti[0].label);
      setState(() {
        pr = widget.servizio.prodotti;
      });
      print("pieno");
    } else {
      print("Lista pr vuota");
    }
  }

  Future<void> fetchProdottiServizi(int hardcodStruttura) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    int? codStruttura = prefs.getInt("idStruttura");
    String? token = prefs.getString('token');
    String? ipStruttura = prefs.getString('ipStruttura');
    String? DBname = prefs.getString('DBname');
    int? idAzienda = prefs.getInt('IdAzienda');
    String? config = await prefs.getString('tipoConfigurazione') ?? '';
    String? mail = prefs.getString('mail');
    String tipo=prefs.getString('tipo') ?? '';
    String camera=prefs.getString('Camera') ?? '';

    if(config!=null || config!=''){
      setState(() {
        _config=config;
        _tipo=tipo;
        _camera=camera;
      });
    }

    _mail.text = mail!;
    if (mail != null || mail != '') {
      setState(() {
        checkMail = true;
      });
    }
    String? Cognome = prefs.getString('Cognome');
    _cognome.text = Cognome!;
    if (Cognome != null || Cognome != '') {
      setState(() {
        checkCognome = true;
      });
    }
    String? Nome = prefs.getString('Nome');
    _nome.text = Nome!;
    if (Nome != null || Nome != '') {
      setState(() {
        checkNome = true;
      });
    }
    String? Cellulare = prefs.getString('cellulare') ?? '';
    _telefono.text = Cellulare!;
    if (Cellulare != null || Cellulare != '') {
      setState(() {
        checkTel = true;
      });
    }

    print('chiamata su codice:${codStruttura}');
    try {
      //INIZIO CODICE SUITE
      if (config == "Suite") {
        print("scarico prodotti Suite");
        final response = await http.post(
          settingsController.dev.isTrue
              ? Uri(
              scheme: 'http',
              host: '10.0.2.2',
              path: 'suite/prodottiServizi/',
              port: 3000)
              : Uri.parse(
              'https://PRIVATO/api/suite/prodottiServizi'),
          headers: {
            'Authorization': 'Bearer $token',
            'Content-Type': 'application/json',
            // Aggiungi altri header se necessario
          },
          body: jsonEncode(
              {'ip': ipStruttura, 'DBname': DBname, 'IdAzienda': idAzienda}),
        );
        if (response.statusCode == 200) {
          print("status=200");
          final jsonData = jsonDecode(response.body) as List<dynamic>;
          print(response.body);
          setState(() {
            _prodotti =
                jsonData.map((data) => ProdottiServizi.fromJson(data)).toList();
          });
        } else {
          ScaffoldMessenger.of(context).showSnackBar(error);
          print('Errore durante il recupero dei dati: ${response.statusCode}');
        }
      } //FINE CODICE SUITE

      //INIZIO CODICE STANDARD
      else if (config == "Standard") {
        print("scarico prodotti Standard");
        final response = await http.get(
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
        if (response.statusCode == 200) {
          print("status=200");
          // Decodifica del JSON
          List<dynamic> jsonData = jsonDecode(response.body);

          // Iterare su ogni oggetto nel JSON
          List<ProdottiServizi> listaProd = [];
          for (var item in jsonData) {
            late double prezzo;
            if (item['prezzo'] is int) {
              prezzo = (item['prezzo'] as int).toDouble();
            } else {
              prezzo = item['prezzo'];
            }
            print('prezzo: ${prezzo}');

            ProdottiServizi p = ProdottiServizi(
                idProdotto: item['id'],
                descrizione: item['descrizione'],
                tipo: "E",
                idTassa: 1,
                prezzoListino: prezzo,
                prezzoLordo: prezzo,
                valueIva: item['iva']['value'],
                labelIva: item['iva']['label'],
            );
            listaProd.add(p);
          }

          setState(() {
            //_prodotti = jsonData.map((data) => ProdottiServizi.fromJson(data)).toList();
            _prodotti = listaProd;
          });
        } else {
          ScaffoldMessenger.of(context).showSnackBar(error);
          print(
              'Errore durante il recupero dei dati fetch prodotti: ${response
                  .statusCode}');
        }
      } //FINE CODICE STANDARD
    } catch (err) {
      ScaffoldMessenger.of(context).showSnackBar(errorServer);
      //Get.to(MyHomePage());
      print('Errore durante la chiamata HTTP fetch prodotti: $err');
    }
  }

  void calcolaTotale() {
    print("CALCOLO IL TOTALE");

    double tot = 0;

    // Ottieni il valore dal controller e convertilo in un numero double
    double q = double.tryParse(_quantita.text) ?? 0.0;

    print(" id prodotto selezionato: ${selectedProdotto!.value}");
    print("elementi in prodotti: ${_prodotti.length}");
    _prodotti.forEach((element) {
      print(element.descrizione);
      if (element.idProdotto == selectedProdotto!.value) {
        tot = element.prezzoListino;
        print('prezzoListino= ${tot}');
      }


    });
    if(widget.servizio.pagamentoType=="acconto"){

      setState(() {
        totale = double.parse((((tot * q * giorni)/100)*widget.servizio.percentualeAcconto).toStringAsFixed(2));
      });

      //tot=(tot/100)*widget.servizio.percentualeAcconto;
    }else{
      setState(() {
        totale = tot * q * giorni;
      });
    }

  }


  Future<bool> checkDisponibilita() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? ipStruttura = prefs.getString('ipStruttura');
    String? token = prefs.getString('token');
    int? codStruttura = prefs.getInt("idStruttura");
    bool val = false;
    //bool disponibile=false;
    //print(token);
    //print("l'ip struttuta è: ${ipStruttura}");
    try {
      final response = await http.post(
        settingsController.dev.isTrue
            ? Uri(
            scheme: 'http',
            host: '10.0.2.2',
            path: 'servizi/disponibilitaPerPrenotazione',
            port: 3000)
            : Uri.parse(
            'https://PRIVATO/api/servizi/disponibilitaPerPrenotazione'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
          // Aggiungi altri header se necessario
        },
        body: jsonEncode({
          'codStruttura': '${codStruttura}',
          'idServizio': widget.servizio.id,
          'dataIni': startTimestamp,
          'dataFin': endTimestamp,
          'ora': selectedFascia,
          'prodotto': selectedProdotto,
          'quantita': _quantita.text,
        }),
      );
      if (response.statusCode == 200) {
        // Elaborare la risposta JSON
        final data = jsonDecode(response.body);
        //print(data);

        final Map<String, dynamic> jsonData = jsonDecode(response.body);

        setState(() {
          val = jsonData['disponibile'];
          disponibilitaPerData =
          List<Map<String, dynamic>>.from(jsonData['disponibilita']);

          // Filtra la lista per ottenere solo gli oggetti dove "stato" è "pieno"
          disponibilitaPiena = disponibilitaPerData
              .where((item) => item['stato'] == 'pieno')
              .toList();
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(error);
        print('Errore durante il recupero dei dati: ${response.statusCode}');
      }
    } catch (errore) {
      ScaffoldMessenger.of(context).showSnackBar(error);
      print('Errore durante la chiamata HTTP: $errore');
    }
    return val;
  }

  bool checkCampiFormCompilati() {
    if (startTimestamp == 0 || endTimestamp == 0) {
      return false;
    } else {
      return true;
    }
    print(startTimestamp);
    print(endTimestamp);
    print(_mail.text);
    print(selectedProdotto?.label);
    print(selectedFascia?.label);
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
          'image': "",
          //'image': "https://firebasestorage.googleapis.com/v0/b/fir-autenticazione-d201f.appspot.com/o/LogoConcierge.png?alt=media&token=6011e1b0-6f6e-4c25-b66b-5439a784fec3",
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

/*
  Future<void> pagaWebCheckout() async {

    SharedPreferences prefs = await SharedPreferences.getInstance();

    String? token = await prefs.getString('token');
    int? codStruttura = await prefs.getInt("idStruttura");

    // Ottieni il valore dal controller e convertilo in un numero double
    double q = double.tryParse(_quantita.text) ?? 0.0;
    try {

      var prodotto={
        'name': 'banana',
        'image': 'https://images.unsplash.com/photo-1478340168842-7e6b25ed6510?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'price': 6,
        'quantity': _quantita.text,
        'total': totale,
        'customer_email': _mail.text,
        'phone_number': _telefono.text,
        'idStripe': 'acct_1Q6X6hDBTwcOd76B',
        'codStruttura': codStruttura.toString(),
      };
      print(prodotto);
      var body = {
        'products': prodotto
      };
      final response = await http.post(
        settingsController.dev.isTrue
            ? Uri(
            scheme: 'http',
            host: '10.0.2.2',
            path: 'stripe/create-checkout-session',
            port: 3000)
            : Uri.parse(
            'https://PRIVATO/api/stripe/create-checkout-session'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
          // Aggiungi altri header se necessario
        },
        body: jsonEncode(body),
      );
      if (response.statusCode == 200) {
        print("pagamento iniziato");
        Map<String, dynamic> responseMap = jsonDecode(response.body);
        String url = responseMap['url'];
        print("l'url è: ${url}");
        await launchUrl(Uri.parse(url));

      }else{
        print("errore, status code: ${response.statusCode}");
      }
    } catch (error) {
      print("errore durante l'invio notifica. Errore:  $error");
    }
  }
*/

  Future<String?> createCheckoutSession() async {

    //PRIVATO
  }


  Future<void> startPayment(String stato) async {

//PRIVATO
  }


  Future<void> prenotazioneServizio(String stato) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();

    String? token = await prefs.getString('token');
    int? codStruttura = await prefs.getInt("idStruttura");
    int? codPrenotazione = await prefs.getInt('codPrenotazione') ?? 0;
    int? IdSchedaConto = await prefs.getInt('IdSchedaConto') ?? 0;
    int? IdSchedaContoRetta = await prefs.getInt('IdSchedaContoRetta') ?? 0;
    String? mailPrenotazione = await prefs.getString('mail') ?? '';
    String? Camera = await prefs.getString('Camera') ?? '';
    print(codPrenotazione);
    print(mailPrenotazione);

    try {
      final response = await http.post(
        settingsController.dev.isTrue
            ? Uri(
            scheme: 'http',
            host: '10.0.2.2',
            path: 'servizi/insertPrenotazioneServizio',
            port: 3000)
            : Uri.parse(
            'https://PRIVATO/api/servizi/insertPrenotazioneServizio'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
          // Aggiungi altri header se necessario
        },
        body: jsonEncode({
          'codStruttura': codStruttura.toString(),
          'idServizio': widget.servizio.id,
          'nomeServizio': widget.servizio.nome,
          'nomePrenotante': _nome.text,
          'cognomePrenotante': _cognome.text,
          'mail': _mail.text,
          'telefono': _telefono.text,
          'codPrenotazione': codPrenotazione,
          'camera': Camera,
          'richieste': _noteController.text,
          'dataIni': startTimestamp,
          'dataFin': endTimestamp,
          'ora': selectedFascia,
          'prodotto': selectProdottoObject,
          'totale': totale,
          'quantita': _quantita.text,
          'stato': stato,
          'IdSchedaConto': IdSchedaConto,
          'IdSchedaContoRetta': IdSchedaContoRetta,
          'messaggio': '',
        }),
      );
      if (response.statusCode == 201) {
        // Elaborare la risposta JSON
        final data = jsonDecode(response.body);
        print(data);
        await inviaNotifica();
        ScaffoldMessenger.of(context).showSnackBar(success);
        Navigator.pop(context);
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
    //tasto prenota
    //controllo tasto invio per evitare messaggi multipli
    if (!_isButtonDisabled) {
      // Disabilita il pulsante
      setState(() {
        _isButtonDisabled = true;
      });

      // Simula un'azione asincrona, ad esempio un ritardo di 2 secondi
      Future.delayed(Duration(milliseconds: 300), () async {
        // Completa l'azione
        if (_formKey.currentState?.validate() ?? false) {
          compilati = checkCampiFormCompilati();
          if (compilati == false) {
            //stampa allert
            ScaffoldMessenger.of(context).showSnackBar(
                snackbarPersonalizzata('snackCampiMancanti'.tr, true));
          } else {
            //vado avanti con controlli ed invio

            setState(() {
              _caricamento = true;
            });

            disponibile = await checkDisponibilita();
            print(disponibile);
            setState(() {
              this.disponibile = disponibile;
            });
            if (disponibile == false) {
              disponibilitaPiena.forEach((element) {
                print(element['data']);
                final DateTime dateTime = DateTime.fromMillisecondsSinceEpoch(
                    element['data'] != null ? element['data'] : 00000);
                final String formattedDate =
                DateFormat('dd/MM/yyyy').format(dateTime);

                String data = formattedDate.toString();
                print('le date piene sono: ' + formattedDate.toString());
                setState(() {
                  datePiene.add(data);
                });
              });
              ScaffoldMessenger.of(context).showSnackBar(snackbarDisponibilita(
                  'snackNoDisponibilita'.tr + " $datePiene", false));
              setState(() {
                datePiene.clear();
              });
            } else {
              SharedPreferences prefs = await SharedPreferences.getInstance();
              String tipo=prefs.getString('tipo') ?? '';
              String camera=prefs.getString('Camera') ?? '';
              print("tipo: ${tipo}, camera: ${camera}, config: ${_config}");
              if(widget.servizio.pagamentoType=="paga" || widget.servizio.pagamentoType=="acconto") {
                print("entro primo if");
                if (_config == "Suite") {
                  print("entro config suite");
                  if (tipo == "interno" && camera != "esterno") {
                    print("entro if interno esterno");
                    //non paga
                    prenotazioneServizio("attesa");
                  } else if (tipo == "esterno") {
                    print("entro elseif esterno");
                    //paga
                    startPayment("${widget.servizio.pagamentoType} Stripe");
                  }
                } else if (_config == "Standard") {
                  print("entro config standard");
                  //pagano tutti
                  startPayment("${widget.servizio.pagamentoType} Stripe");
                }
              }else{
                print("entro else");
                prenotazioneServizio("attesa");
              }

              //invio prenotazione
              //prenotazioneServizio();


            };
            print(disponibilitaPerData.length);
          }
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
              snackbarPersonalizzata('snackCampiMancanti'.tr, true));
        }

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
        iconTheme: IconThemeData(
            color: Color(converti
                .coloreDaStringa(settingsController.colorIconBar.value))),
        toolbarHeight: 38.0,
        backgroundColor:
        Color(converti.coloreDaStringa(settingsController.colorBar.value)),
        title: Text(
          widget.servizio.nome,
          style: TextStyle(
              fontWeight: FontWeight.w700,
              color: Color(converti
                  .coloreDaStringa(settingsController.colorIconBar.value))),
        ),
      ),
      body: _caricamento
          ? Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Center(
            child:
            CircularProgressIndicator(), //Visualizza un indicatore di caricamento finché non vengono ricevuti i dati
          ),
          Text("Loading...")
        ],
      )
          : Form(
        key: _formKey,
        child: ListView(
          children: [
            if (pr.isNotEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(
                    horizontal: 20, vertical: 2),
                child: DropdownButton<Prodotto>(
                  //focusColor: Colors.blue.shade400,
                  borderRadius: BorderRadius.all(Radius.circular(16)),
                  hint: obbligatorio
                      ? Text(
                    'selectProdotto'.tr,
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: Colors.red),
                  )
                      : Text(
                    'selectProdotto'.tr,
                    style: TextStyle(
                        fontSize: 18, fontWeight: FontWeight.w600),
                  ),

                  value: selectedProdotto,
                  onChanged: (Prodotto? newValue) {
                    setState(() {
                      selectedProdotto = newValue;
                      handleChangeProdotto(selectedProdotto!);
                    });
                    calcolaTotale();
                  },
                  items:
                  pr.map<DropdownMenuItem<Prodotto>>((Prodotto pr) {
                    return DropdownMenuItem<Prodotto>(
                      value: pr,
                      child: Text(pr.label),
                    );
                  }).toList(),
                ),
              )
            else
              Padding(
                padding:
                EdgeInsets.symmetric(horizontal: 20, vertical: 2),
                child: Text('noProdotto'.tr),
              ),
            //if (fasce.isNotEmpty)
            Padding(
              padding:
              const EdgeInsets.symmetric(horizontal: 20, vertical: 2),
              child: DropdownButton<FasciaOraria>(
                //focusColor: Colors.blue.shade400,
                borderRadius: BorderRadius.all(Radius.circular(16)),
                hint: obbligatorio
                    ? Text(
                  'selectOra'.tr,
                  style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: Colors.red),
                )
                    : Text(
                  'selectOra'.tr,
                  style: TextStyle(
                      fontSize: 18, fontWeight: FontWeight.w600),
                ),

                value: selectedFascia,
                onChanged: (FasciaOraria? newValue) {
                  setState(() {
                    selectedFascia = newValue;
                  });
                  calcolaTotale();
                },
                items: fasce.map<DropdownMenuItem<FasciaOraria>>(
                        (FasciaOraria fa) {
                      return DropdownMenuItem<FasciaOraria>(
                        value: fa,
                        child: Text(fa.label),
                      );
                    }).toList(),
              ),
            ),
            /* else
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text('Nessuna fascia oraria disponibile'),
              ),*/

            Padding(
              padding:
              const EdgeInsets.symmetric(horizontal: 20, vertical: 2),
              child: obbligatorio
                  ? Text(
                'selezionaDate'.tr,
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Colors.red),
              )
                  : Text(
                'selezionaDate'.tr,
                style: TextStyle(
                    fontSize: 18, fontWeight: FontWeight.w600),
              ),
            ),
            const SizedBox(height: 10),

            Padding(
              padding: const EdgeInsets.symmetric(
                  horizontal: 60.0, vertical: 5),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(
                        horizontal: 20, vertical: 15),
                    elevation: 5,
                    backgroundColor: Colors.blue.shade800,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      // Arrotondamento angoli
                      side: BorderSide(
                          color: Colors.blueAccent,
                          width: 2), // Bordo del bottone
                    ),
                    textStyle: TextStyle(
                        fontSize: 20, fontWeight: FontWeight.w600)),
                onPressed: _showDateRangePicker,
                child: Text('selezionaDateButton'.tr),
              ),
            ),
            SizedBox(height: 10),
            Padding(
              padding:
              const EdgeInsets.symmetric(horizontal: 20, vertical: 2),
              child: Text(
                _selectedDateRange != null
                    ? 'dataIni'.tr +
                    ' ${_selectedDateRange!.start.toString().split(
                        " ")[0]} || ' +
                    'dataFin'.tr +
                    ' ${_selectedDateRange!.end.toString().split(" ")[0]}'
                    : 'nessunaData'.tr,
                style: TextStyle(fontSize: 16),
              ),
            ),
            SizedBox(height: 20),

            Padding(
              padding: const EdgeInsets.symmetric(
                  horizontal: 20.0, vertical: 15),
              child: TextFormField(
                readOnly: checkNome,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Campo obbligatorio';
                  }
                  return null;
                },
                //textAlign: TextAlign.center,
                controller: _nome,
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
                  horizontal: 20.0, vertical: 15),
              child: TextFormField(
                readOnly: checkCognome,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Campo obbligatorio';
                  }
                  return null;
                },
                //textAlign: TextAlign.center,
                controller: _cognome,
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
                  horizontal: 20.0, vertical: 15),
              child: TextFormField(
                readOnly: checkMail,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Campo obbligatorio';
                  }
                  return null;
                },
                //textAlign: TextAlign.center,
                controller: _mail,
                decoration: InputDecoration(
                  border: UnderlineInputBorder(),
                  filled: true,
                  fillColor: Colors.white30,
                  labelText: 'mail'.tr,
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.symmetric(
                  horizontal: 20.0, vertical: 15),
              child: TextField(
                //readOnly: checkTel,
                //textAlign: TextAlign.center,
                keyboardType: TextInputType.number,
                controller: _telefono,
                decoration: InputDecoration(
                  border: UnderlineInputBorder(),
                  filled: true,
                  fillColor: Colors.white30,
                  labelText: 'telefono'.tr,
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.symmetric(
                  horizontal: 20.0, vertical: 5),
              child: Text('motivoNumero'.tr),
            ),

            Padding(
              padding: const EdgeInsets.symmetric(
                  horizontal: 20.0, vertical: 15),
              child: TextFormField(
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Campo obbligatorio';
                  }
                  return null;
                },
                onChanged: (value) {
                  //verifico che il numero non sia minore o maggiore di quelli definiti
                  if (int.parse(value) < 1) {
                    setState(() {
                      value = 1.toString();
                      _quantita.text = value;
                    });
                  } else if (int.parse(value) >
                      widget.servizio.qMaxPrenotabile) {
                    setState(() {
                      value = widget.servizio.qMaxPrenotabile.toString();
                      _quantita.text = value;
                    });
                  }

                  // Calcola il totale solo se il valore non è nullo
                  if (value != null && value.isNotEmpty) {
                    calcolaTotale();
                  }
                },
                //textAlign: TextAlign.center,
                keyboardType: TextInputType.number,
                controller: _quantita,
                decoration: InputDecoration(
                  border: UnderlineInputBorder(),
                  filled: true,
                  fillColor: Colors.white30,
                  labelText: 'quantita'.tr,
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.symmetric(
                  horizontal: 20, vertical: 15),
              child: TextField(
                autocorrect: false,
                minLines: 1,
                maxLines: 6,
                controller: _noteController,
                decoration: InputDecoration(
                  filled: true,
                  border: UnderlineInputBorder(),
                  hintText: 'richieste'.tr,
                ),
                onChanged: (text) {
                  // Puoi salvare o gestire le note qui
                  // Ad esempio, puoi salvare le note nelle SharedPreferences o nello stato
                },
              ),
            ),

            Padding(
              padding: const EdgeInsets.symmetric(
                  horizontal: 20, vertical: 10),
              child: Row(
                children: [
                  const CircleAvatar(
                    backgroundColor: Colors.green,
                    child: Icon(
                      Icons.euro,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    " ${totale.toString()}",
                    style: TextStyle(
                        fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  Visibility(
                    visible: widget.servizio.pagamentoType=="acconto" && _camera=="esterno" ? true : false,
                    child: Text(" Acconto ${widget.servizio.percentualeAcconto}%",
                      style: TextStyle(
                          fontSize: 16, fontWeight: FontWeight.bold),),
                  ),
                ],
              ),
            ),

            Padding(
              padding:
              const EdgeInsets.symmetric(horizontal: 5, vertical: 15),
              child: ElevatedButton(
                onPressed: () async =>
                {_isButtonDisabled ? null : _onButtonPressed()},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green.shade500,
                  // Cambia il colore del pulsante
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(4),
                  ),
                  padding: const EdgeInsets.symmetric(
                      horizontal: 40, vertical: 15),
                ),
                child: Text(
                  'prenota'.tr,
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
