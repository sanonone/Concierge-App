import 'package:flutter/material.dart';

class ColorConvert{

  int coloreDaStringa(String coloreStringa) {
    // Rimuovi il carattere '#' dalla stringa e converti il resto in un intero esadecimale

    String noHash=coloreStringa.substring(1);
    String noHashOpacity='ff$noHash';
    int coloreInt = int.parse(noHashOpacity, radix: 16);

    // Costruisci e restituisci l'oggetto Color
    return coloreInt;
  }

  int coloreDaStringaIcon(String coloreStringa) {
    // Rimuovi il carattere '#' dalla stringa e converti il resto in un intero esadecimale

    String noHash=coloreStringa.substring(1);
    String noHashOpacity='0xff$noHash';
    int coloreInt = int.parse(noHashOpacity);
    
    // Costruisci e restituisci l'oggetto Color
    return coloreInt;
  }
}