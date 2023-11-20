import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:8080/auth";

class AuthService {

  register(username: string,email: string,password: string): Promise<AxiosResponse> {
    return axios.post(API_URL + "/register",{
      username,
      email,
      password,
  })
  }
  login(email: string,password: string): Promise<AxiosResponse> {
    return axios.post(API_URL + "/login" ,{
      email,
      password,
  })
  }
  logout(){
    localStorage.removeItem("user");
  }
  getUserState() {
    const userString = localStorage.getItem("user");
    if (userString) {
      return JSON.parse(userString);
    }
    return null; 
  }

}

export default new AuthService();

