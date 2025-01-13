import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tt_concierge/ModelController/Settings.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

import '../Classi/Prodotto.dart';
class SettingsController extends GetxController {
  //final settings = <Settings>{}.obs;
  RxString colorBar='#ffffff'.obs;
  RxString colorDescrizioneCard='#ffffff'.obs;
  RxString colorIconBar='#000000'.obs;
  RxString colorIconCard='#ffffff'.obs;
  RxString colorTitleCard='#000000'.obs;
  RxString colorButtonPrenotazione='#000000'.obs;
  RxString iconApp='test'.obs;
  RxString sfondoApp='test'.obs;
  RxString linkIcon='test'.obs;
  RxString linkMeteo='test'.obs;
  Map<String,dynamic> orario={'ini':0,'fin':0}.obs;
  Map<String,dynamic> orario2={'ini':0,'fin':0}.obs;
  Map<String,dynamic> orario3={'ini':0,'fin':0}.obs;
  //Object orario3={'ini':0,'fin':0}.obs;//vecchia versione
  RxBool ospiti=false.obs;

  RxList pr = [].obs;
  RxInt nEleCarrello=0.obs;

  RxBool dev=false.obs;
  RxList tokenWeb = [].obs;

  void updateSettings(
      String newColorBar, String newColorDescrizioneCard, String newColorIconBar, String newColorIconCard,
      String newColorTitleCard, String newColorButtonPrenotazione ,String newIconApp, String newSfondoApp, String newLinkIcon, String newLinkMeteo, Map<String, dynamic> newOrario, Map<String, dynamic> newOrario2, Map<String, dynamic> newOrario3, bool newOspiti
      ){
    colorBar.value=newColorBar;
    colorDescrizioneCard.value=newColorDescrizioneCard;
    colorIconBar.value=newColorIconBar;
    colorIconCard.value=newColorIconCard;
    colorTitleCard.value=newColorTitleCard;
    colorButtonPrenotazione.value=newColorButtonPrenotazione;
    iconApp.value=newIconApp;
    sfondoApp.value=newSfondoApp;
    linkIcon.value=newLinkIcon;
    linkMeteo.value=newLinkMeteo;
    orario = newOrario;
    orario2 = newOrario2;
    orario3 = newOrario3;
    /*
    orario=newOrario;//vecchia versione
    orario2=newOrario2;
    orario3=newOrario3;

     */
    ospiti.value=newOspiti;
  }

  void saveProdotti(List<Prodotto> prodotti){
    pr!.value=prodotti;
    //nEleCarrello.value=nEleC;
  }

  void incrementProdotti(int index){
    print("increment");
    //pr[index].nEle=pr[index].nEle++;
    pr[index].nEle++;
    nEleCarrello++;
    print(pr[index].nEle);
  }

  void decrementProdotti(int index){
    print("decrement");
    if(pr[index].nEle==1){
      //pr.removeAt(index);
      return;
    }else{
      pr[index].nEle--;
      nEleCarrello--;
      print(pr[index].nEle);
    }

  }


  void deleteProdotto(int index){
    int sottrai=pr[index].nEle;
    nEleCarrello=nEleCarrello-sottrai;
    pr.removeAt(index);
    pr.forEach((element) {print('elimino: '+element.descrizione);});
  }

  void incrementCarrello(){
    print("increment");
    nEleCarrello++;
  }

  void decrementCarrello(){
    print("decrement");
    nEleCarrello--;
  }

  void saveTokenWeb(List<dynamic> tokenW){
    tokenWeb!.value=tokenW;
    //nEleCarrello.value=nEleC;
  }

  Future<void> fetchIP() async {

    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      int? codStruttura = await prefs.getInt("idStruttura");

      final response = await http.get(dev.isTrue
          ? Uri(
          scheme: 'http',
          host: '10.0.2.2',
          path: 'auth/getIp/${codStruttura}',
          port: 3000)
          : Uri.parse(
          'PRIVATOapi/auth/getIp/${codStruttura}'));
      if (response.statusCode == 200) {
        // Elaborare la risposta JSON
        //final data = jsonDecode(response.body);
        //print(data);
        Map<String, dynamic> responseMap = jsonDecode(response.body);

        String ip = responseMap['ipStruttura'];
        String db = responseMap['DBname'];
        int idAzienda = responseMap['IdAzienda'];
        List<dynamic> tokenNotify = responseMap['tokenNotify'];
        print(ip + db);
        print("i token della struttura sono: ${tokenNotify}");
        //ipStruttura = responseMap['ipStruttura'];
        //DBname = responseMap['DBname'];
        await prefs.setString('ipStruttura', ip);
        await prefs.setString('DBname', db);
        await prefs.setInt('IdAzienda', idAzienda);

        //await prefs.setString('tokenNotify', tokenNotify);
        //settingsController.saveTokenWeb(tokenNotify);
        tokenWeb.value=tokenNotify;

        //await prefs.setInt('codPrenotazione',int.parse(codPrenotazione.text));
        //await prefs.setString('mail', mailController.text);
        //int? num=prefs.getInt('codPrenotazione');
        //String? mail=prefs.getString('mail');
        //print('il num è: ${num}, la mail è:${mail}');

      } else {
        print('Errore durante il recupero dei dati: ${response.statusCode}');
      }
    } catch (error) {
      print('Errore durante la chiamata HTTP fetchIp: $error');
    }
  }

}