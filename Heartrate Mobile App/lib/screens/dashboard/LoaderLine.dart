import 'package:flutter/material.dart';


class LoaderLine extends StatefulWidget {
  @override
  _LoaderLineState createState() => _LoaderLineState();
}

class _LoaderLineState extends State<LoaderLine> with SingleTickerProviderStateMixin {
  double _progress = 0.01; // Start at 1%
  Animation<double>? animation; // Declare the animation variable
  int countUpValue = 1;

  @override
  void initState() {
    super.initState();
    
    // Create a Tween that animates the progress from 1% to 100% over 15 seconds
    final AnimationController controller = AnimationController(
      vsync: this,
      duration: Duration(seconds: 30),
    );
    
    animation = Tween<double>(
      begin: 0.01,
      end: 1.0,
    ).animate(controller)
      ..addListener(() {
        setState(() {
          _progress = animation!.value;
          countUpValue = (_progress * 100).toInt();
        });
      });
    controller.forward();
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<Object>(
        stream: null,
        builder: (context, snapshot) {
          return Stack(
            children: [
              // White background line
              Container(
                width: 200, // Width of the loading bar
                height: 20,   // Height of the loading bar
                decoration: BoxDecoration(
                  color: Colors.white, // White background
                ),
              ),
              // Red loading progress line
              Positioned(
                left: 0,
                top: 0,
                child: Container(
                  width: 200 * _progress, // Width of the red progress line
                  height: 20,   // Height of the loading bar
                  decoration: BoxDecoration(
                    color: Colors.red, // Red progress line
                  ),
                ),
              ),
              // Count-up value displayed in the middle
              Positioned(
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                child: Center(
                  child: Text(
                    "$countUpValue%",
                    style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          );
        }
      );
  }
}
