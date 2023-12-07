import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:8080/chat";

class ChatService {

  getAllRoom(): Promise<AxiosResponse> {

    //return axios.post(API_URL + "/getAllRoom",{ user_id })
    return axios.get(API_URL + "/getAllRoom")
  }
  
//   getUserState() {
   
//     if (userString) {
//       return JSON.parse(userString);
//     }
//     return null; 
//   }

}

export default new ChatService();

