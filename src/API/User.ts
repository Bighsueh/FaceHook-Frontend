import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:8080/user";

class UserService {

  private getToken(): string | null {
    const user = localStorage.getItem("user");
    if (user) {
      const token = JSON.parse(user).token;
      return token;
    }
    return null;
  }

  // 取得使用者資訊的方法
  getCurrentUser(): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.get(`${API_URL}`, { headers });
  }

  // 更新個人檔案資訊
  updateProfile(profileData: any): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.patch(`${API_URL}`, profileData, { headers });
  }

  // 取得個人檔案資訊 by user_id
  getUserProfile(userId: number): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.get(`${API_URL}/profile/${userId}`,{ headers });
  }

  // 取得個別使用者貼文
  getUserPosts(userId: number): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.get(`${API_URL}/userpost/${userId}`,{ headers });
  }
  
  // 發出或取消交友邀請
  addFriendInvite(friendUserId: number): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.post(`${API_URL}/add-friend-invite/${friendUserId}`, {}, { headers });
  }

  // 刪除好友邀請
  removeFriendInvite(friendUserId: number): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.delete(`${API_URL}/remove-friend-invite/${friendUserId}`, { headers });
  }

  // 取得使用者的交友邀請 by user_id
  getFriendInvitations(friendUserId: number): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.get(`${API_URL}/friend-invitations/${friendUserId}`, { headers });
  }

  // 確認好友
  confirmFriend(friendUserId: number): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.patch(`${API_URL}/confirm-friend/${friendUserId}`, {}, { headers });
  }

  // 刪除好友
  removeFriend(friendUserId: number): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.delete(`${API_URL}/remove-friend/${friendUserId}`, { headers });
  }

  // 取得使用者目前的好友
  getCurrentFriends(userId: number): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.get(`${API_URL}/current-friends/${userId}`, { headers });
  }

  // 取得共同朋友
  getCommonFriends(userId: number): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.get(`${API_URL}/common-friends/${userId}`, { headers });
  }

}

export default new UserService();

