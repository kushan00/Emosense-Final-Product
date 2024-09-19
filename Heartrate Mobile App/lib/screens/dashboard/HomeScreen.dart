import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:heart_rate_monitor/main.dart';
import 'package:heart_rate_monitor/models/get_heart_rate.dart';
import 'package:heart_rate_monitor/models/heart_rate.dart';
import 'package:heart_rate_monitor/screens/dashboard/splash_screen.dart';
import 'package:heart_rate_monitor/utils/constants.dart';
import 'package:heart_rate_monitor/utils/widget_functions.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:heart_rate_monitor/controller/auth_route.dart';
import 'package:heart_rate_monitor/screens/dashboard/chart.dart';
import 'package:heart_rate_monitor/screens/dashboard/heart_bpm.dart';


class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<SensorValue> data = [];
  List<SensorValue> bpmValues = [];
  dynamic finalRate = 0;
  //  Widget chart = BPMChart(data);

  bool isBPMEnabled = false;
  Widget? dialog;

  Timer? timer;
  dynamic heartrateData = null;

  void callAPi(BuildContext context) async {
    print("api called");
    SharedPreferences prefs = await SharedPreferences.getInstance();
      //Return String
    String user = prefs.getString('user').toString();
    String userID =  prefs.getString('userID').toString();
    String id =   prefs.getString('id').toString();
    String email =   prefs.getString('email').toString();

     Map data = {
        "heart_rate": finalRate.toString(),
        "user_id":userID, 
        "fullName":user, 
        "_id":id, 
        "email":email
    };

    dynamic response = await createHeartRate(context, data);

    var heartRateModel = HeartRateModel.fromJson(jsonDecode(response));
    if(heartRateModel.status == 1)
    {
      showSuccessToastMessage('Heart Rate Saved Success!');
    }
    else
    {
      showToastMessage('Heart Rate Saved Failed!');
    }
    print("response -------------- ${heartRateModel.status.toString()}");
    print("response -------------- ${heartRateModel.message.toString()}");
    print("response -------------- ${heartRateModel.data.toString()}");
     setState(() {
      isBPMEnabled = false;
    });

  }

 void startMeasureAndStop(BuildContext context) {
    int secondsRemaining = 30; // Set the number of seconds

    Timer.periodic(Duration(seconds: 1), (timer) {
      print(secondsRemaining);
      
      if (secondsRemaining == 0) {
        timer.cancel(); // Cancel the timer after 15 seconds
        print("API called");
        callAPi(context);
      } else {
        secondsRemaining--;
      }
    });
  }


  @override
  void initState() {
      // TODO: implement initState
      super.initState();
      getLatestHertRateForUser();
    
  }

  void getLatestHertRateForUser()async{
    SharedPreferences prefs = await SharedPreferences.getInstance();
      //Return String
    String user = prefs.getString('user').toString();
    String userID =  prefs.getString('userID').toString();
    String id =   prefs.getString('id').toString();
    String email =   prefs.getString('email').toString();


    dynamic response = await getLatestHeartRate(context, userID);

    var getheartRateModel = GetHeartRateModel.fromJson(jsonDecode(response));
    if(getheartRateModel.status == 1)
    {
      setState(() {
        heartrateData = getheartRateModel.data;
      });
    }
    else
    {
      showToastMessage('Heart Rate Data Fetch Failed');
    }
  }




  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Center(child:Text('Heart BPM Demo') ),
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            onPressed: (){
              logoutUser();
              Navigator.push(
                context, MaterialPageRoute(builder: (context) => SplashScreen()));
            }, 
            icon: Icon(Icons.logout_sharp)
          )
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          getLatestHertRateForUser();
        },
        child: Column(
          children: [
            isBPMEnabled
                ? dialog = HeartBPMDialog(
                    context: context,
                    onRawData: (value) {
                      setState(() {
                        if (data.length >= 100) data.removeAt(0);
                        data.add(value);
                      });
                    },
                    onBPM: (value) => setState(() {
                      if (bpmValues.length >= 100) bpmValues.removeAt(0);
                      bpmValues.add(SensorValue(
                          value: value.toDouble(), time: DateTime.now()));
                          print("----------------------------------heart rate $value");
                          setState(() {
                            finalRate = value;
                          });
                    }),
                  )
                : SizedBox(),
            Row(
                children: [
                  if (isBPMEnabled && data.isNotEmpty)
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Text('Readings'),
                          Container(
                            decoration: BoxDecoration(border: Border.all()),
                            height: 100,
                            child: BPMChart(data),
                          ),
                        ],
                      ),
                    ),
                  if (isBPMEnabled && bpmValues.isNotEmpty)
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Text('BPM'),
                          Container(
                            decoration: BoxDecoration(border: Border.all()),
                            height: 100,
                            child: BPMChart(bpmValues),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            Center(
                child: !isBPMEnabled
                    ? Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          SizedBox(height: 50,),
                          Image.asset(
                            imagePath +'heart.gif', 
                            height: 100, 
                          ),
                          SizedBox(height: 50,),
                          Container(                          
                            child: ElevatedButton.icon(
                              icon: Icon(Icons.favorite_rounded),
                              label: Text("Measure BPM"),
                              onPressed: () {
                                setState(() {
                                  isBPMEnabled = true;
                                });
                                // Start the measurement process here
                                startMeasureAndStop(context);
                              },   
                              style: ButtonStyle(
                                elevation: MaterialStateProperty.all(8.0), // Adjust the shadow elevation
                                padding: MaterialStateProperty.all(EdgeInsets.all(16.0)), // Increase button size
                                shape: MaterialStateProperty.all(
                                  RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(20.0), // Adjust the border radius
                                    side: BorderSide(color: primaryColor, width: 2.0), // Add a border
                                  ),
                                ),
                              ),                         
                            ),
                          ),
                          SizedBox(height: 50,),
                          heartrateData == null 
                          ?
                            Container(child: Text("No data found to update"),)
                          :
                          Card(
                            elevation: 3,
                            margin: EdgeInsets.all(10),
                            color: Colors.white, // Set the background color to primaryColor
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10), // Add rounded corners
                              side: BorderSide(color: primaryColor), // Add a border
                            ),
                            child: Padding(
                              padding: EdgeInsets.all(10),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: <Widget>[
                                  Text(
                                    'Full Name: ${heartrateData?.fullName}',
                                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black), // Set text color to black
                                  ),
                                  SizedBox(height: 8),
                                  Text('Heart Rate: ${heartrateData?.heart_rate}', 
                                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black),
                                  ), // Set text color to black
                                  SizedBox(height: 8),
                                  Text('Updated At: ${heartrateData?.updatedAt}',
                                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black),
                                  ), // Set text color to black
                                ],
                              ),
                            ),
                          ),
                          SizedBox(height:20),
                          Container(                          
                            child: ElevatedButton.icon(
                              icon: Icon(Icons.refresh_rounded),
                              label: Text("Heart Rate"),
                              onPressed: () {
                                getLatestHertRateForUser();
                              },   
                              style: ButtonStyle(
                                elevation: MaterialStateProperty.all(8.0), // Adjust the shadow elevation
                                padding: MaterialStateProperty.all(EdgeInsets.all(16.0)), // Increase button size
                                shape: MaterialStateProperty.all(
                                  RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(20.0), // Adjust the border radius
                                    side: BorderSide(color: primaryColor, width: 2.0), // Add a border
                                  ),
                                ),
                              ),                         
                            ),
                          ),                          
                        ],
                      )
                    : Column(
                        children: [
                          SizedBox(height: 10),
                          CircularProgressIndicator(), // Show loader
                          SizedBox(height: 10),
                          ElevatedButton.icon(
                              icon: Icon(Icons.favorite_rounded),
                              label: Text("Measurring...."),
                              onPressed: () {},
                            ),
                        ],
                      ),
              )
          ],
        ),
      ),
    );
  }
}