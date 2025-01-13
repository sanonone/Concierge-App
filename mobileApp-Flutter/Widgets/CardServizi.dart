import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:tt_concierge/Controller/SettingsController.dart';
import 'package:get/get.dart';
import '../Pagine/PrenotaServizioPage.dart';
import '../utility/ColorConvert.dart';
import 'package:tt_concierge/Classi/CardServizi.dart' as Servizi;

class CardServizi extends StatefulWidget {
  final String descrizione;
  final String immagine;
  final String nome;
  final Servizi.CardServizi card;

  const CardServizi({
    super.key,
    required this.descrizione,
    required this.immagine,
    required this.nome,
    required this.card

  });

  @override
  State<CardServizi> createState() => _CardServiziState();
}

class _CardServiziState extends State<CardServizi> {
  bool _isDescriptionExpanded = false;
  ColorConvert converti = ColorConvert();
  final SettingsController settingsController = Get.find();



  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.hardEdge,
      elevation: 5,
      margin: EdgeInsets.all(10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Sezione immagine
          AspectRatio(
            aspectRatio: 16 / 9, // Rapporto di aspetto desiderato
            child: Image.network(
              widget.immagine,
              fit: BoxFit.cover, // Per riempire l'intera area dell'AspectRatio
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Sezione titolo
                Text(
                  widget.nome,
                  style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Color(converti.coloreDaStringa(
                          settingsController.colorTitleCard.value))),
                ),
                SizedBox(height: 5),
                // Sezione descrizione
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.descrizione,
                      maxLines: _isDescriptionExpanded ? null : 2,
                      overflow: _isDescriptionExpanded
                          ? TextOverflow.visible
                          : TextOverflow.ellipsis,
                      style: TextStyle(
                          color: Color(converti.coloreDaStringa(
                              settingsController.colorDescrizioneCard.value))),
                    ),
                    Visibility(
                      //visible: !_isDescriptionExpanded,
                      child: TextButton(
                        onPressed: () {
                          setState(() {
                            _isDescriptionExpanded = !_isDescriptionExpanded;
                          });
                        },
                        child: _isDescriptionExpanded
                            ? Text('vediMeno'.tr)
                            : Text('vediPiu'.tr),
                        //child: Text('Vedi di più'),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 10),
                // Sezione link mappa e sito

                Center(
                  child: ElevatedButton(
                    onPressed: () async => {
                    Get.to(PrenotaServizioPage(servizio: widget.card)),

                    },
                    style: ElevatedButton.styleFrom(

                      backgroundColor: Color(converti.coloreDaStringa(
                          settingsController.colorButtonPrenotazione.value)),
                      // Cambia il colore del pulsante
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(4),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 80, vertical: 10),
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
        ],
      ),
    );
  }
}