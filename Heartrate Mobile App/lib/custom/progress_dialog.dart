
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:heart_rate_monitor/utils/constants.dart';

class ProgressDialog extends StatefulWidget {
  final String title;

  const ProgressDialog({Key? key, required this.title})
      : super(key: key);

  @override
  _CustomDialogBoxState createState() => _CustomDialogBoxState();
}

class _CustomDialogBoxState extends State<ProgressDialog> {
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      content: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                const SpinKitWave(color: colorGreen,size: 40,),
              ],
            ),
            Container(margin: const EdgeInsets.only(left: 7),child:Text(widget.title)),
          ],),
      ),
    );
  }
}
