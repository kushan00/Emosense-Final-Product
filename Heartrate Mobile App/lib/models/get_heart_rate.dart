import 'package:charts_flutter/flutter.dart';
import 'package:intl/intl.dart';

class GetHeartRateModel {
  int? status;
  String? message;
  Data? data;

  GetHeartRateModel({this.status, this.message, this.data});

  GetHeartRateModel.fromJson(Map<String, dynamic> json) {
    status = json['status'];
    message = json['message'];
    data = json['data'] != null ? new Data.fromJson(json['data']['heartRateData']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['status'] = this.status;
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.toJson();
    }
    return data;
  }
}

class Data {
  String? user_id;
  String? fullName;
  String? email;
  String? heart_rate;
  String? id;
  String? updatedAt;

  Data({this.user_id});

  Data.fromJson(Map<String, dynamic> json) {
    user_id = json['user_id'] ;
    fullName = json['fullName'];
    email = json['email'];
    heart_rate = json['heart_rate'];
    id = json['_id'];
    DateTime date = DateTime.parse(json['updatedAt']);
    String formattedDate = DateFormat.yMMMd().add_jms().format(date);
    updatedAt = formattedDate;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.user_id != null) {
      data['user_id'] = this.user_id;
      data['fullName'] = this.fullName;
      data['email'] = this.email;
      data['heart_rate'] = this.heart_rate;
      data['_id'] = this.id;
      data['updatedAt'] = this.updatedAt; 
    }
    return data;
  }
}

