import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:tt_concierge/Controller/SettingsController.dart';
import 'package:get/get.dart';
import '../utility/ColorConvert.dart';
import '../utility/TimestampFormatter.dart';

class CardStatoOrdini extends StatefulWidget {
  final String stato;
  final String tipo;
  final int dataGestione;
  final String dettagli;
  final String messaggio;

  const CardStatoOrdini({
    super.key,
    required this.stato,
    required this.tipo,
    required this.dataGestione,
    required this.dettagli,
    required this.messaggio

  });

  @override
  State<CardStatoOrdini> createState() => _CardStatoOrdiniState();
}

class _CardStatoOrdiniState extends State<CardStatoOrdini> {
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

          Padding(
            padding: const EdgeInsets.all(10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Sezione titolo
                Text(
                  widget.tipo,
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
                    Row(
                      children: [
                        Text('stato'.tr,style: TextStyle(fontWeight: FontWeight.w600),),

                        widget.stato=="confermata" || widget.stato=="paga Stripe" || widget.stato=="acconto Stripe" ?
                        Row(
                          children: [

                            widget.stato=="confermata" ?
                            Text(
                              "confermata".tr,
                              style: TextStyle(
                                  color: Color(converti.coloreDaStringa(
                                      settingsController.colorDescrizioneCard.value))),
                            )

                            :
                            widget.stato=="acconto Stripe" ?
                            Text(
                              "acconto".tr,
                              style: TextStyle(
                                  color: Color(converti.coloreDaStringa(
                                      settingsController.colorDescrizioneCard.value))),
                            ) :
                            Text(
                              "pagato".tr,
                              style: TextStyle(
                                  color: Color(converti.coloreDaStringa(
                                      settingsController.colorDescrizioneCard.value))),
                            ),
                            Icon(Icons.check_box_outlined, color:Colors.green,)
                          ],
                        ) :
                            widget.stato=="rifiutata" ?
                            Row(
                              children: [
                                Text(
                                  "rifiutata".tr,
                                  style: TextStyle(
                                      color: Color(converti.coloreDaStringa(
                                          settingsController.colorDescrizioneCard.value))),
                                ),Icon(Icons.indeterminate_check_box_outlined,color: Colors.red,)
                              ],
                            ) : widget.stato=="attesa" ?
                            Row(
                              children: [

                                Text(
                                  "attesa".tr,
                                  style: TextStyle(
                                      color: Color(converti.coloreDaStringa(
                                          settingsController.colorDescrizioneCard.value))),
                                ),Icon(Icons.check_box_outline_blank,color: Colors.yellow.shade800,)
                              ],
                            ) : widget.stato=="in corso" ?
                            Row(
                              children: [

                                Text(
                                  "inCorso".tr,
                                  style: TextStyle(
                                      color: Color(converti.coloreDaStringa(
                                          settingsController.colorDescrizioneCard.value))),
                                ),Icon(Icons.check_box_outline_blank,color: Colors.blue.shade600,)
                              ],
                            ) : Text("")
                      ],
                    ),
                    Row(
                      children: [
                        Text('data'.tr,style: TextStyle(fontWeight: FontWeight.w600),),
                        Text(
                          DateFormatter.formatTimestamp(widget.dataGestione),
                          style: TextStyle(
                              color: Color(converti.coloreDaStringa(
                                  settingsController.colorDescrizioneCard.value))),
                        ),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('dettagli'.tr,style: TextStyle(fontWeight: FontWeight.w600),),
                        Text(
                          widget.dettagli,
                          maxLines: _isDescriptionExpanded ? null : 2,
                          overflow: _isDescriptionExpanded
                              ? TextOverflow.visible
                              : TextOverflow.ellipsis,
                          style: TextStyle(
                              color: Color(converti.coloreDaStringa(
                                  settingsController.colorDescrizioneCard.value))),
                        ),
                        widget.messaggio=="" ? SizedBox(height: 1,) :
                        Text('messaggio'.tr,style: TextStyle(fontWeight: FontWeight.w600),),
                        Text(
                            widget.messaggio,
                          maxLines: _isDescriptionExpanded ? null : 2,
                          overflow: _isDescriptionExpanded
                              ? TextOverflow.visible
                              : TextOverflow.ellipsis,
                        ),
                        widget.messaggio=="" ? SizedBox(height: 1,) :
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
                  ],
                ),
                SizedBox(height: 10),
                // Sezione link mappa e sito

              ],
            ),
          ),
        ],
      ),
    );
  }
}
