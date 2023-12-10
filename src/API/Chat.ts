import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:8080/chat";

class ChatService {

  getAllRoom(id: number): Promise<AxiosResponse> {
    return axios.get(API_URL + `/getAllRoom/${id}`)
  }

  getChatLog(id: number): Promise<AxiosResponse> {
    return axios.get(API_URL + `/getChatLog/${id}`)
  }

}

export default new ChatService();

