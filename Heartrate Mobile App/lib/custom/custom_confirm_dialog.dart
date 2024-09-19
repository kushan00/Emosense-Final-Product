import 'package:flutter/material.dart';
import 'package:heart_rate_monitor/main.dart';
import 'package:heart_rate_monitor/utils/constants.dart';

class CustomConfirmDialog extends StatelessWidget {
  //When creating please recheck 'context' if there is an error!

  final Function yesOnPressed;
  final Function noOnPressed;
  final String title;
  final String message;

  const CustomConfirmDialog({
    Key? key,
    required this.yesOnPressed,
    required this.noOnPressed,
    required this.title,
    required this.message,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(title),
      content: Text(message),
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      actions: <Widget>[
        TextButton(
          style: TextButton.styleFrom(
              minimumSize: Size(50, 40), backgroundColor: primaryColor),
          child: const Text(
            "Yes",
            style: TextStyle(color: Colors.white),
          ),
          onPressed: () {
            yesOnPressed();
          },
        ),
        TextButton(
          style: TextButton.styleFrom(
              minimumSize: Size(50, 40), backgroundColor: colorRed),
          child: const Text(
            'No',
            style: TextStyle(color: Colors.white),
          ),
          onPressed: () {
            noOnPressed();
          },
        ),
      ],
    );
  }
}
