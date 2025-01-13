import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:url_launcher/url_launcher.dart';

import '../Controller/SettingsController.dart';
import '../utility/ColorConvert.dart';

class InfoAppPage extends StatelessWidget {
  ColorConvert converti = ColorConvert();
  final SettingsController settingsController = Get.find();

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(
        iconTheme: IconThemeData(
            color: Color(converti
                .coloreDaStringa(settingsController.colorIconBar.value))),
        toolbarHeight: 38.0,
        backgroundColor:
        Color(converti.coloreDaStringa(settingsController.colorBar.value)),

        title: Text('drawerInfo'.tr,
          style: TextStyle(
              fontWeight: FontWeight.w700,
              color: Color(converti
                  .coloreDaStringa(settingsController.colorIconBar.value))),

        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Column(
                children: [
                  Image.asset('images/img.png', height: 140),
                  SizedBox(height: 10),

                  Text('Version 1.0.7'),
                  //Text('Released on: YYYY-MM-DD'),
                ],
              ),
            ),
            /*
            SizedBox(height: 20),
            Text(
              'descrizione'.tr,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10),
            Text(
              'descrizioneApp'.tr,
              style: TextStyle(fontSize: 16),
            ),
            */
            SizedBox(height: 20),
            Text(
              'supporto'.tr,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10),
            ListTile(
              title: Text('contattaci'.tr),
              trailing: Icon(Icons.arrow_forward),
              onTap: () async {
                // Azione per contattare il supporto
                await launchUrl(Uri.parse("https://www.tecnologiaeturismo.org/"));
              },
            ),

          ],
        ),
      ),
    );
  }
}
