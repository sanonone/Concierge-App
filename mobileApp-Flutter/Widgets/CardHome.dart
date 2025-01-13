import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../Controller/SettingsController.dart';
import '../utility/ColorConvert.dart';
import 'package:flutter_cache_manager/flutter_cache_manager.dart';
import 'dart:io';


class CardHome extends StatefulWidget {
  IconData icon;
  String? color;
  String urlImage;
  String titolo;
  String descrizione;

  CardHome({super.key, required this.icon, required this.color, required this.urlImage, required this.titolo, required this.descrizione});

  @override
  State<CardHome> createState() => _CardHomeState();
}

class _CardHomeState extends State<CardHome> {
  ColorConvert converti = ColorConvert();
  final SettingsController settingsController = Get.find();
  File? _cachedImage;

  @override
  void initState() {
    super.initState();
    _loadImage();
  }

  Future<void> _loadImage() async {
    try {
      final file = await DefaultCacheManager().getSingleFile(widget.urlImage);
      setState(() {
        _cachedImage = file;
      });
    } catch (e) {
      print('Errore nel caricamento dell\'immagine: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      splashColor: Colors.red,
      /*
      onTap: () {
        print("cliccato");
      },
       */
      child: SizedBox(
        height: 180,
        child: Card(
          elevation: 10,
          color: Colors.white,
          shadowColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(0)),
          margin: EdgeInsets.only(bottom: 2),
          clipBehavior: Clip.hardEdge,
          child:  Stack(
            children: [
              // Immagine di sfondo
              FractionallySizedBox(
                widthFactor: 1.0, // Occupa l'intera larghezza disponibile
                heightFactor: 1.0, // Occupa l'intera altezza disponibile

                child: _cachedImage == null
                    ? LinearProgressIndicator(value: 5, minHeight: 2,)
                    : Image.file(_cachedImage!,fit: BoxFit.cover,),

                /*
                child: Image(
                  image: NetworkImage(
                      widget.urlImage),
                  fit: BoxFit.cover,
                ),

                 */
              ),

              // Sfondo trasparente sotto il testo
              Positioned.fill(
                child: Container(
                  color: Colors.black.withOpacity(0.3), // Opacità del colore di sfondo
                ),
              ),
              // Testo sovrapposto
              Positioned(
                bottom: 16, // Posiziona il testo 16 pixel dal bordo superiore
                left: 16, // Posiziona il testo 16 pixel dal bordo sinistro
                child: Column(
                  children: [
                    Text(
                      widget.titolo,
                      style: TextStyle(
                        fontFamily: 'San Francisco',
                        color: Color(converti.coloreDaStringa(widget.color!)),
                        fontSize: 25,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    /*
                    Text(
                      widget.descrizione,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.w400,
                      ),
                    ),*/
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
