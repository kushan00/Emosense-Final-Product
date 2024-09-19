import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:heart_rate_monitor/controller/api.dart';
import 'package:heart_rate_monitor/utils/widget_functions.dart';

Future<String?> userLogin(context, body) async {
  print(Api.baseUrl);
  String url = Api.baseUrl + Api.loginApi;
  print(url);
  Uri uri = Uri.parse(url);
  print(uri);
  showLoadingDialog(context);
  var response = await http.post(uri,
      headers: {"Accept": "application/json"}, body: body);
  hideDialog(context);
  if (response.statusCode == 200) {
    return response.body;
  } else if (response.statusCode == 404) {
    showToastMessage(jsonDecode(response.body)["message"]);
    return null;
  } else if (response.statusCode == 401) {
    showToastMessage(jsonDecode(response.body)["message"]);
    return null;
  } else {
    showToastMessage('Login failed.Try again!');
    return null;
  }
}

Future<dynamic> createHeartRate(context, body) async {
  String url = Api.baseUrl + Api.saveHeartRateApi;
  Uri uri = Uri.parse(url);

  showLoadingDialog(context);
  var response = await http.post(uri,
      headers: {"Accept": "application/json"}, body: body);
  hideDialog(context);
  if (response.statusCode == 200) {
    return response.body;
  } else if (response.statusCode == 404) {
    showToastMessage(jsonDecode(response.body)["message"]);
    return null;
  } else if (response.statusCode == 401) {
    showToastMessage(jsonDecode(response.body)["message"]);
    return null;
  } else {
    showToastMessage('Login failed.Try again!');
    return null;
  }
}

Future<dynamic> getLatestHeartRate(context, id) async {
  String url = Api.baseUrl + Api.getHeartRate + id;
  Uri uri = Uri.parse(url);

  showLoadingDialog(context);
  var response = await http.get(uri,
      headers: {"Accept": "application/json"});
  hideDialog(context);
  if (response.statusCode == 200) {
    return response.body;
  } else if (response.statusCode == 404) {
    showToastMessage(jsonDecode(response.body)["message"]);
    return null;
  } else if (response.statusCode == 401) {
    showToastMessage(jsonDecode(response.body)["message"]);
    return null;
  } else {
    showToastMessage('Login failed.Try again!');
    return null;
  }
}




