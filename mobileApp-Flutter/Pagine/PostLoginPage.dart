import 'package:flutter/material.dart';
import 'package:tt_concierge/MyHomePage.dart';
import '../Controller/SettingsController.dart';
import 'package:get/get.dart';
import 'package:country_flags/country_flags.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../lang/localization_service.dart';

class PostLoginPage extends StatefulWidget {
  const PostLoginPage({super.key});

  @override
  State<PostLoginPage> createState() => _PostLoginPageState();
}

class _PostLoginPageState extends State<PostLoginPage> {
  final SettingsController settingsController = Get.find();


  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Container(
            decoration: BoxDecoration(
              image: DecorationImage(
                image: NetworkImage(settingsController.sfondoApp.value),
                fit: BoxFit.cover, // Make the image fit the entire container
              ),
            ),
          ),
          Positioned(
              top: 60,
              right: 10,
              left: 10,
              child: Opacity(
                opacity: 0.9,
                child: Center(
                  child: Image(
                    image: NetworkImage(settingsController.iconApp.value),
                    height: 150,
                    fit: BoxFit.fitHeight,
                  ),
                ),
              )),
          Positioned(
              bottom: 100,
              right: 10,
              left: 10,
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 10,horizontal: 90),
                child: ElevatedButton(
                    onPressed: () async {
                      SharedPreferences prefs = await SharedPreferences.getInstance();
                      await prefs.setString('lingua', 'it');
                      LocalizationService().changeLocale('it'); // Cambia la lingua in italiano
                      Get.to(MyHomePage());

                      },
                    style: ElevatedButton.styleFrom(
                        fixedSize: Size(100,40),
                        backgroundColor: Colors.grey.withOpacity(0.4),
                        foregroundColor: Colors.white),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CountryFlag.fromCountryCode(
                          'IT',
                          height: 20,
                          width: 40,
                          borderRadius: 8,
                        ),
                        SizedBox(width: 10,),
                        Text("Italiano",style: TextStyle(fontSize: 18,fontWeight: FontWeight.w700),)
                      ],
                    )),
              )),

          Positioned(
              bottom: 40,
              right: 10,
              left: 10,
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 10,horizontal: 90),
                child: ElevatedButton(
                    onPressed: () async {
                      SharedPreferences prefs = await SharedPreferences.getInstance();
                      await prefs.setString('lingua', 'it');
                      LocalizationService().changeLocale('en'); // Cambia la lingua in inglese
                      Get.to(MyHomePage());
                      },
                    style: ElevatedButton.styleFrom(
                      fixedSize: Size(100,40),
                        backgroundColor: Colors.grey.withOpacity(0.4),
                        foregroundColor: Colors.white),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CountryFlag.fromCountryCode(
                          'GB',
                          height: 20,
                          width: 40,
                          borderRadius: 8,
                        ),
                        SizedBox(width: 10,),
                        Text("English",style: TextStyle(fontSize: 18,fontWeight: FontWeight.w700),)
                      ],
                    )),
              )),
        ],
      ),
    );
  }
}
