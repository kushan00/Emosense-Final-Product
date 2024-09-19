import axios from "axios";

import StartUrl from "../configs/Url.json";

const EmotionURL = "http://127.0.0.1:5000/detect-emotion";


export async function EmotionDetection(data){
    console.log("alldata",data);
    return await  axios.post(EmotionURL,data);
}

