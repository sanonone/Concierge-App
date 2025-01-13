import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'en_us.dart'; // Importa il file di traduzione inglese
import 'it_it.dart'; // Importa il file di traduzione italiano

class LocalizationService extends Translations {
  // Locale predefinito
  static final locale = Locale('en', 'US');

  // Locale di fallback se la traduzione non è disponibile
  static final fallbackLocale = Locale('en', 'US');

  @override
  Map<String, Map<String, String>> get keys => {
    'en_US': enUS, // Mappa di traduzioni per l'inglese
    'it_IT': itIT, // Mappa di traduzioni per l'italiano
  };

  // Metodo per cambiare la lingua
  void changeLocale(String langCode) {
    final locale = _getLocaleFromLanguage(langCode);
    Get.updateLocale(locale);
  }

  // Metodo per ottenere l'oggetto Locale dal codice della lingua
  Locale _getLocaleFromLanguage(String langCode) {
    switch (langCode) {
      case 'en':
        return Locale('en', 'US');
      case 'it':
        return Locale('it', 'IT');
      default:
        return Locale('it', 'IT');
    }
  }
}
