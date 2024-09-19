//all constant variables and functions goes here

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

const colorGreen = Color(0xff5DB075);
const colorGreen2 = Color(0xff80b918);
const colorGreen3 = Color(0xff52b788);
const colorBlue = Color(0xff0077b6);
const colorBlue2 = Color(0xff008CFF);
const colorBlueLight = Color(0xffa2d2ff);
const color33 = Color(0xff333333);
const colorYellow = Color(0xfffcbf49);
const colorRed = Color(0xffe63946);

const String imagePath = "assets/images/";
const String iconPath = "assets/icons/";

Future<String?> getLoggedUser() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String? token = "";
  if (prefs.containsKey('token')) {
    token = prefs.getString("token");
  }
  return token;
}

saveLoggedUser(user) async {
  print("inside the saveloggeduser func");
  print(user?.token);
  print(user?.userRole);
  print(user?.user);
  print(user?.userID);
  print(user?.id);
  SharedPreferences prefs = await SharedPreferences.getInstance();
  //Return String
  prefs.setString('user', user!.user.toString());
  prefs.setString('token', user.token.toString());
  prefs.setString('userRole', user.userRole.toString());
  prefs.setString('userID', user.userID.toString());
  prefs.setString('id', user.id.toString());
  prefs.setString('email', user.email.toString());
}


logoutUser() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();

  prefs.remove('user');
  prefs.remove('token');
  prefs.remove('userRole');
  prefs.remove('userID');
  prefs.remove('_id');
  
}

bool validateEmail(String value) {
  String pattern =
      r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]"
      r"{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]"
      r"{0,253}[a-zA-Z0-9])?)*$";
  RegExp regex = RegExp(pattern);
  if (value.isEmpty || !regex.hasMatch(value)) {
    return false;
  } else {
    return true;
  }
}

bool validatePassword(String value) {
  String pattern =
      r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$';
  RegExp regExp = new RegExp(pattern);
  return regExp.hasMatch(value);
}
