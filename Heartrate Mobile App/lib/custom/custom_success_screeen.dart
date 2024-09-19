import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:heart_rate_monitor/main.dart';
import 'package:heart_rate_monitor/utils/widget_functions.dart';

class CustomSuccessScreen extends StatefulWidget {
  final String role;
  final String status;
  CustomSuccessScreen({Key? key, required this.role, required this.status})
      : super(key: key);

  @override
  State<CustomSuccessScreen> createState() => _CustomSuccessScreenState();
}

class _CustomSuccessScreenState extends State<CustomSuccessScreen> {
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Success',
          style: TextStyle(fontSize: 25, fontWeight: FontWeight.w700),
        ),
        // automaticallyImplyLeading: false,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_rounded,
            size: 30,
          ),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        // actions: <Widget>[
        //   IconButton(
        //     icon: const Icon(
        //       Icons.logout,
        //       color: Colors.white,
        //     ),
        //     onPressed: () {
        //       logoutfunc();
        //     },
        //   )
        // ],
      ),
      body: SafeArea(
          child: Container(
        height: size.height,
        width: size.width,
        child: Column(
          children: [
            addVerticalSpace(60),
            Icon(
              Icons.check_circle_rounded,
              color: primaryColor,
              size: size.width * 0.85,
            ),
            Text(
              '${widget.role} ${widget.status} Successfully',
              style: GoogleFonts.roboto(
                  textStyle: const TextStyle(
                color: primaryColor,
                fontWeight: FontWeight.w600,
                fontStyle: FontStyle.normal,
                fontSize: 24.0,
              )),
            ),
            Expanded(
              child: Align(
                alignment: FractionalOffset.bottomCenter,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: Text(
                    'Go Back',
                    style: GoogleFonts.roboto(
                        textStyle: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontStyle: FontStyle.normal,
                      fontSize: 24.0,
                    )),
                  ),
                  style: ElevatedButton.styleFrom(
                      minimumSize: Size(size.width * 0.8, 60),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20))),
                ),
              ),
            ),
          ],
        ),
      )),
    );
  }
}
