import 'package:flutter/material.dart';
import 'package:tt_concierge/Controller/SettingsController.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

import '../Classi/Prodotto.dart';

class CardCarrelloProdotti extends StatefulWidget {
  final String descrizione;
  final double prezzo;
  final int n;
  final String note;
  final int index;
  final Function elimina;

  const CardCarrelloProdotti(
      {super.key,
      required this.descrizione,
      required this.prezzo,
      required this.n,
      required this.note,
      required this.index,
      required this.elimina
      });

  @override
  State<CardCarrelloProdotti> createState() => _CardCarrelloProdottiState();
}

class _CardCarrelloProdottiState extends State<CardCarrelloProdotti> {
  final SettingsController settingsController = Get.find();
  TextEditingController _noteController = TextEditingController();

  Future<void> saveProdotti(List<Prodotto> prodotti) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    List<String> jsonProdotti = settingsController.pr
        .map((prodotto) => jsonEncode(prodotto.toJson()))
        .toList();
    await prefs.setStringList('prodotti', jsonProdotti);
  }

  @override
  void initState() {
    super.initState();
    _noteController.text=widget.note;
  }

  @override
  Widget build(BuildContext context) {
    return Card(
        elevation: 5,
        margin: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
                widget.descrizione,
                style: const TextStyle(fontSize: 21, fontWeight: FontWeight.w600),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(left: 8.0, right: 8.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Obx(
                    () => Text(
                        "prezzo".tr+" €${settingsController.pr[widget.index].prezzoLordo * settingsController.pr[widget.index].nEle}",
                        style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: Colors.black45)),
                  ),
                  Obx(
                    () => Text("X${settingsController.pr[widget.index].nEle}",
                        style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: Colors.black45)),
                  ),
                  Row(
                    children: [
                      IconButton(
                          onPressed: () {
                            if(settingsController.pr[widget.index].nEle==1){
                              setState(() {
                                widget.elimina(widget.index);
                              });
                            }
                            else {
                              setState(() {
                                settingsController
                                    .decrementProdotti(widget.index);
                              });
                            }
                              List<Prodotto>? newPr = settingsController.pr
                                  .value.cast<Prodotto>();

                            saveProdotti(newPr);
                          },
                          icon: Icon(
                            Icons.remove_circle_outline,
                            size: 33,
                            color: Colors.red.shade400,
                          )),
                      IconButton(
                          onPressed: () {
                            setState(() {
                              settingsController
                                  .incrementProdotti(widget.index);
                            });
                            List<Prodotto>? newPr =
                                settingsController.pr.value.cast<Prodotto>();
                            saveProdotti(newPr);
                          },
                          icon: Icon(
                            Icons.add_circle_outline,
                            size: 33,
                            color: Colors.green.shade400,
                          )),
                    ],
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: SizedBox(
                height: 100,
                child: TextField(
                  autocorrect: false,
                  minLines: 1,
                  maxLines: 4,
                  maxLength: 150,
                  controller: _noteController,
                  decoration:  InputDecoration(
                    filled: true,
                    border: UnderlineInputBorder(),
                    hintText: 'note'.tr,

                  ),
                  onChanged: (text) {
                    // Puoi salvare o gestire le note qui
                    // Ad esempio, puoi salvare le note nelle SharedPreferences o nello stato
                    Prodotto p=settingsController.pr[widget.index];


                    setState(() {
                      settingsController.pr[widget.index].note=_noteController.text;

                    });
                    List<Prodotto>? newPr = settingsController.pr.value.cast<Prodotto>();
                    saveProdotti(newPr);
                  },
                ),
              ),
            ),
          ],
        ));
  }
}
