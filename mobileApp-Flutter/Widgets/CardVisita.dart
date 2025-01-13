import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:tt_concierge/Controller/SettingsController.dart';
import 'package:get/get.dart';
import '../utility/ColorConvert.dart';

class CardVisita extends StatefulWidget {
  final String descrizione;
  final String immagine;
  final String nome;
  final String? linkMappa; // link della mappa

  const CardVisita({
    super.key,
    required this.descrizione,
    required this.immagine,
    required this.nome,
    required this.linkMappa,

  });

  @override
  State<CardVisita> createState() => _CardVisitaState();
}

class _CardVisitaState extends State<CardVisita> {
  bool _isDescriptionExpanded = false;
  ColorConvert converti = ColorConvert();
  final SettingsController settingsController = Get.find();

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
      ),
      elevation: 5,
      margin: EdgeInsets.all(10),
      clipBehavior: Clip.hardEdge,
      child: Column(
        //crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AspectRatio(
            aspectRatio: 16 / 9, // Rapporto di aspetto desiderato
            child: Image.network(
              widget.immagine,
              fit: BoxFit.cover, // Per riempire l'intera area dell'AspectRatio
            ),
          ),
          // Sezione immagine
          /*
          ClipRRect(
            clipBehavior: Clip.hardEdge,
            borderRadius: BorderRadius.circular(10),
            child: Image.network(
              widget.immagine,
              fit: BoxFit.cover,
              height: 200,
            ),
          ),
           */
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
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    if (widget.linkMappa != "")
                      GestureDetector(
                        onTap: () async {
                          // Apri link mappa
                          // TODO: Implementa l'apertura del link mappa
                          print('Apri link mappa: ${widget.linkMappa}');
                          await launchUrl(Uri.parse(widget.linkMappa!));
                        },
                        child: Row(
                          children: [
                            Icon(
                              Icons.location_pin,
                              color: Color(converti.coloreDaStringaIcon(
                                  settingsController.colorIconCard.value)),
                            ),
                            Text('mappa'.tr,style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey.shade900, fontSize: 13),),
                          ],
                        ),
                      ),

                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
