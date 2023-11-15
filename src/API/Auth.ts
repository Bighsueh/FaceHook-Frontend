import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:8080/auth";

class AuthService {

  private getToken(): string | null {
    const user = localStorage.getItem("user");
    if (user) {
      const token = JSON.parse(user).token;
      return token;
    }
    return null;
  }

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

  // 取得使用者資訊的方法
  getCurrentUser(): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.get(`http://localhost:8080/user`, { headers });
  }
  

}

export default new AuthService();

