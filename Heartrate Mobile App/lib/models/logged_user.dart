class LoggedUser {
  int? status;
  String? message;
  Data? data;

  LoggedUser({this.status, this.message, this.data});

  LoggedUser.fromJson(Map<String, dynamic> json) {
    status = json['status'];
    message = json['message'];
    data = json['data'] != null ? new Data.fromJson(json['data']) : null;
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
  String? user;
  String? token;
  String? userRole;
  String? userID;
  String? id;
  String? email;

  Data({this.user});

  Data.fromJson(Map<String, dynamic> json) {
    user = json['user'] ;
    token = json['token'];
    userRole = json['userRole'];
    userID = json['userID'];
    id = json['_id'];
    email = json['email'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.user != null) {
      data['user'] = this.user;
      data['token'] = this.token;
      data['userRole'] = this.userRole;
      data['userID'] = this.userID;
      data['_id'] = this.id; 
      data['email'] = this.email;
    }
    return data;
  }
}

