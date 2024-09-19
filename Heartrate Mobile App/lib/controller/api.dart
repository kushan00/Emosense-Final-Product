//all api endpoints 

//All api endpoints go here
class Api {
  static String? accessToken;
  static const String baseUrl = 'https://emosense-lqh3.onrender.com';

  static const String loginApi = "/emosense/signin";

  static const String saveHeartRateApi = "/emosense/health/create-heart-rate";

  static const String getHeartRate = "/emosense/health/get-by-id/";

}