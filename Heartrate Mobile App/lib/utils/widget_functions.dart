//common widget functions goes here

import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:heart_rate_monitor/custom/progress_dialog.dart';
import 'package:heart_rate_monitor/utils/constants.dart';

Widget addVerticalSpace(double height) {
  return SizedBox(height: height);
}

Widget addHorizontalSpace(double width) {
  return SizedBox(width: width);
}

showToastMessage(String message) {
  Fluttertoast.showToast(
      msg: message,
      toastLength: Toast.LENGTH_LONG,
      gravity: ToastGravity.BOTTOM,
      timeInSecForIosWeb: 2,
      backgroundColor: color33,
      textColor: Colors.white,
      fontSize: 16.0);
}

showSuccessToastMessage(String message) {
  Fluttertoast.showToast(
      msg: message,
      toastLength: Toast.LENGTH_LONG,
      gravity: ToastGravity.BOTTOM,
      timeInSecForIosWeb: 2,
      backgroundColor: colorGreen,
      textColor: Colors.white,
      fontSize: 16.0);
}

showLoadingDialog(BuildContext context) {
  showDialog(
    barrierDismissible: false,
    context: context,
    builder: (BuildContext context) {
      return WillPopScope(
          onWillPop: () async => true, child: const ProgressDialog(title: ''));
    },
  );
}

void hideDialog(BuildContext context) {
  Navigator.pop(context);
}
