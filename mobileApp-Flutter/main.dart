import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:tt_concierge/Pagine/login.dart';
import 'package:tt_concierge/Controller/SettingsController.dart';
import 'package:timezone/data/latest.dart' as tz;
import 'package:timezone/timezone.dart' as tz;
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_core/firebase_core.dart';
import 'lang/localization_service.dart'; // Importa il servizio di localizzazione
import 'package:flutter_stripe/flutter_stripe.dart';


final GlobalKey<ScaffoldMessengerState> scaffoldMessengerKey =
    GlobalKey<ScaffoldMessengerState>();

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  //Stripe.publishableKey = 'pk_test_51Q4KjRDbSvd4Hq4qoScUntSvrT3kXYnX14pAtgNSGwxJKqeqysPGOQCYPwdraZiIqcRD9qsMkTIHQrsSR2GfCKIc002qj4iIZ7';
  //Stripe.merchantIdentifier = 'any string works';
  //Stripe.stripeAccountId = 'acct_1Q6X6hDBTwcOd76B';
  //await Stripe.instance.applySettings();
  tz.initializeTimeZones();
  tz.setLocalLocation(tz.getLocation('Europe/Rome'));
  await Firebase.initializeApp();
  await FirebaseMessaging.instance.getInitialMessage();
  //tentativo ricezione notifica con app aperta
  FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    print(
        'Received a notification while app is in foreground: ${message.notification}');

    scaffoldMessengerKey.currentState?.showSnackBar(
      SnackBar(
        content: Text(
          '${message.notification!.title ?? 'Notification'}: ${message.notification!.body ?? 'No message body'}',
          style: TextStyle(
              fontSize: 16.0, fontWeight: FontWeight.bold, color: Colors.white),
        ),
        backgroundColor: Colors.blueAccent,
        elevation: 6.0,
        duration: Duration(seconds: 5),
      ),
    );
    SnackBar(
      content: Text(
        "Hai ricevuto una notifica",
        style: TextStyle(
            fontSize: 20.0, fontWeight: FontWeight.bold, color: Colors.white),
      ),
      backgroundColor: Colors.lightBlueAccent,
      elevation: 6.0,
    );
  });

  FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
    print('Notification caused app to open: ${message.notification}');
    // Handle the notification opening action here
  });

  //notifiche in background
  FirebaseMessaging.onBackgroundMessage(_onBackgroundMessage);
  runApp(GetMaterialApp(
    translations: LocalizationService(), // Imposta il servizio di localizzazione
    locale: LocalizationService.locale, // Imposta la lingua predefinita
    fallbackLocale: LocalizationService.fallbackLocale, // Imposta la lingua di fallback

    scaffoldMessengerKey: scaffoldMessengerKey,
    home: Login(),
    debugShowCheckedModeBanner: false, // Imposta questa variabile su false
    theme: ThemeData(
      colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      useMaterial3: true,
    ),
  ));
  Get.put(SettingsController());
}

Future<void> _onBackgroundMessage(RemoteMessage message) async {
  await Firebase.initializeApp();
  print("we have receved a notification: ${message.notification}");
}
