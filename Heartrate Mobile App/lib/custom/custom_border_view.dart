import 'package:flutter/material.dart';

class CustomBoarderView extends StatelessWidget {
  final Widget child;
  final double radius;
  final double width;
  final double height;
  final double? stroke;
  final Color borderColor;
  final Color backgroundColor;
  final GestureTapCallback? onTap;

  const CustomBoarderView(
      {Key? key,
      required this.child,
      required this.radius,
      required this.borderColor,
      required this.backgroundColor,
      this.onTap,
      required this.width,
      required this.height,
      this.stroke})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: backgroundColor,
          border: Border.all(
              width: stroke == null ? 1 : stroke!, color: borderColor),
          borderRadius: BorderRadius.all(Radius.circular(radius)),
        ),
        child: child,
      ),
    );
  }
}
