import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:heart_rate_monitor/controller/auth_route.dart';
import 'package:heart_rate_monitor/models/logged_user.dart';
import 'package:heart_rate_monitor/screens/dashboard/HomeScreen.dart';
import 'package:heart_rate_monitor/utils/constants.dart';
import 'package:heart_rate_monitor/utils/widget_functions.dart';

class LoginScreen extends StatefulWidget {
  LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  bool showPassword = false;

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: Container(
          margin: const EdgeInsets.all(0),
          height: size.height,
          width: size.width,
          child: Container(
            height: size.height,
            width: size.width,
            padding: const EdgeInsets.all(16),
            child: SingleChildScrollView(
              child: Column(
                children: [
                  addVerticalSpace(60),
                  Image.asset(
                    imagePath + 'heart.gif',
                    width: 200,
                    height: 200,
                  ),
                  addVerticalSpace(10),
                  Text(
                    'Login',
                    style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold),
                  ),
                  addVerticalSpace(10),
                  Text(
                    'Please login with your web credentials...',
                    style: TextStyle(fontSize: 16),
                  ),
                  addVerticalSpace(30),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 15),
                    child: Container(
                      height: size.height * 0.08,
                      decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border.all(color: Colors.white),
                          borderRadius: BorderRadius.circular(10),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0xffc4c2c2),
                              offset: Offset(0, 0),
                              spreadRadius: 1,
                              blurRadius: 10,
                              blurStyle: BlurStyle.normal,
                            )
                          ]),
                      child: Center(
                        child: Padding(
                          padding: const EdgeInsets.only(left: 20),
                          child: TextFormField(
                            controller: emailController,
                            keyboardType: TextInputType.emailAddress,
                            textInputAction: TextInputAction.next,
                            decoration: const InputDecoration(
                              hintText: "Please enter your email",
                              // labelText: "Email address",
                              border: InputBorder.none,
                              // labelStyle: TextStyle(
                              //   color: colorOrange
                              // ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  addVerticalSpace(20),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 15),
                    child: Container(
                      height: size.height * 0.08,
                      decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border.all(color: Colors.white),
                          borderRadius: BorderRadius.circular(10),
                          boxShadow: [
                            BoxShadow(
                              color: Color(0xffc4c2c2),
                              offset: Offset(0, 0),
                              spreadRadius: 1,
                              blurRadius: 10,
                              blurStyle: BlurStyle.normal,
                            )
                          ]),
                      child: Center(
                        child: Padding(
                          padding: const EdgeInsets.only(left: 20),
                          child: TextFormField(
                            controller: passwordController,
                            obscureText: !showPassword,
                            keyboardType: TextInputType.visiblePassword,
                            textInputAction: TextInputAction.done,
                            decoration: InputDecoration(
                              suffixIcon: IconButton(
                                icon: Icon(
                                  // Based on passwordVisible state choose the icon
                                  showPassword
                                      ? Icons.visibility
                                      : Icons.visibility_off,
                                ),
                                onPressed: () {
                                  setState(() {
                                    showPassword = !showPassword;
                                  });
                                },
                              ),
                              hintText: "Please enter your password",
                              // labelText: "Email address",
                              border: InputBorder.none,
                              // labelStyle: TextStyle(
                              //   color: colorOrange
                              // ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  addVerticalSpace(20),
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: ElevatedButton(
                      onPressed: () {
                        login();
                      },
                      child: Container(
                        height: 50,
                        width: size.width * 0.7,
                        child: Center(
                          // widthFactor: size.width * 0.013,
                          child: Text(
                            "Sign in",
                            style: TextStyle(color: Colors.white, fontSize: 20),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          )),
    );
  }

    void login() async {
        if (!validateEmail(emailController.text)) {
          showToastMessage('Enter valid email!');
        }
        if (passwordController.text.isEmpty) {
          showToastMessage('Password cannot be empty!');
        } 
        else
        {
          Map<String, String> body = {
            "email": emailController.text,
            "password": passwordController.text
          };

          String? response = await userLogin(context, body);
          // print("response print");
          // print(response);
          if (response != null) {
            var loggedUser = LoggedUser.fromJson(jsonDecode(response));
            showToastMessage('Login Success!');
            saveLoggedUser(loggedUser.data);
            Navigator.push(
                context, MaterialPageRoute(builder: (context) => HomeScreen()));
          }
          else
          {
            showToastMessage('Login failed.Try again!');
          }
        }
    }
  }
