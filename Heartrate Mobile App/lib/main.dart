import 'package:flutter/material.dart';
import 'package:heart_rate_monitor/screens/dashboard/splash_screen.dart';
import 'package:heart_rate_monitor/utils/constants.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Heart Rate Monitor',
      theme: ThemeData(
        primarySwatch: primaryColor,
      ),
      home: SplashScreen(),
    );
  }
}

const MaterialColor primaryColor = MaterialColor(0xffFF0000, <int, Color>
{
  50: Color(0xffFFCDD2),
  100: Color(0xffEF9A9A),
  200: Color(0xffE57373),
  300: Color(0xffEF5350),
  400: Color(0xffF44336),
  500: Color(0xffE53935),
  600: Color(0xffD32F2F),
  700: Color(0xffC62828),
  800: Color(0xffB71C1C),
  900: Color(0xffFF0000),
});


