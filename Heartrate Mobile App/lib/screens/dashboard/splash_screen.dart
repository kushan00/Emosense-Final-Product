//splashscreen here
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:heart_rate_monitor/screens/dashboard/HomeScreen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:heart_rate_monitor/main.dart';
import 'package:heart_rate_monitor/screens/auth/login_screen.dart';
import 'package:heart_rate_monitor/utils/constants.dart';

class SplashScreen extends StatefulWidget {
  SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {

   void _checkandnavigate()async {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString("token");
      String? userRole = prefs.getString("userRole");
      print(token);
      if(token!.isEmpty){
        Navigator.push(
                context, MaterialPageRoute(builder: (context) => LoginScreen()));
      }
      else
      {
        Navigator.push(
                context, MaterialPageRoute(builder: (context) => HomeScreen()));
      }
  }


  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: Colors.white,
      body: GestureDetector(
        onTap: () {
          _checkandnavigate();
        },
        child: Container(
          height: size.height,
          width: size.width,
          child: Center(
            child: Image.asset(
              imagePath + 'heart_rate.jpg',
              width: 300,
            ),
          ),
        ),
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    startTime();
  }

  startTime() async {
    var duration = const Duration(seconds: 3);
    return Timer(duration, checkUser);
  }

  checkUser() {
    getLoggedUser().then((token) {
      if (token!.length > 0) {
        _checkandnavigate();        
      }
      else
      {
        Navigator.push(
          context, MaterialPageRoute(builder: (context) => LoginScreen()));
      }
    });
  }
}
