import 'package:flutter/material.dart';
import 'dart:core';
import 'dart:async';
import 'package:intl/intl.dart';
import 'package:tt_concierge/Controller/SettingsController.dart';
import 'package:get/get.dart';
import '../utility/ColorConvert.dart';

class CardEventi extends StatefulWidget {
  final String descrizione;
  final String immagine;
  final String nome;
  final String info;
  final int? dataIni;
  final int? dataFin;

  const CardEventi({
    super.key,
    required this.descrizione,
    required this.immagine,
    required this.nome,
    required this.info,
    required this.dataIni,
    required this.dataFin,
  });

  @override
  State<CardEventi> createState() => _CardEventiState();
}

class _CardEventiState extends State<CardEventi> {
  bool _isDescriptionExpanded = false;
  ColorConvert converti = ColorConvert();
  final SettingsController settingsController = Get.find();

  String formatTimestampToDate(int timestamp) {
    DateTime date = DateTime.fromMillisecondsSinceEpoch(timestamp);
    String formattedDate = DateFormat('dd/MM/yyyy').format(date);
    return formattedDate;
  }

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
                  style:  TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                      color: Color(converti.coloreDaStringa(
                          settingsController.colorTitleCard.value)),
                  ),
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
                              settingsController.colorDescrizioneCard.value)), fontWeight: FontWeight.w400),
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
                    Text(widget.info,
                      style: TextStyle(
                          color: Color(converti.coloreDaStringa(
                              settingsController.colorDescrizioneCard.value))),
                    ),
                  ],
                ),
                SizedBox(height: 10),
                // Sezione link mappa e sito
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    if (widget.dataIni != 0)
                      GestureDetector(
                        onTap: () {
                          // Apri link mappa
                          // TODO: Implementa l'apertura del link mappa
                          print('Apri link mappa: ${formatTimestampToDate(widget.dataIni!)}');
                        },
                        child:  Row(
                          children: [
                            //Icon(Icons.location_pin),
                            Text('dataIni'.tr +' ${formatTimestampToDate(widget.dataIni!)}'),
                          ],
                        ),
                      ),
                    if (widget.dataFin != 0)
                      GestureDetector(
                        onTap: () {
                          // Apri link sito
                          // TODO: Implementa l'apertura del link sito
                          print('Apri link sito: ${formatTimestampToDate(widget.dataFin!)}');
                        },
                        child:  Row(
                          children: [
                            //Icon(Icons.link),
                            Text('dataFin'.tr +' ${formatTimestampToDate(widget.dataFin!)} '),
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
