import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:8080/post";


class PostService {

  private getToken(): string | null {
    const user = localStorage.getItem("user");
    if (user) {
      const token = JSON.parse(user).token;
      return token;
    }
    return null;
  }

  getPost(): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.get(API_URL, { headers });
  }

  getApost(id: number): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.get(`${API_URL}/${id}`, { headers });
  }

  postPost(content: string): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.post(API_URL, { content }, { headers });
  }

  updatePost(id: number, content: string): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.put(`${API_URL}/${id}`, { content }, { headers });
  }

  deletePost(id: number): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.delete(`${API_URL}/${id}`, { headers });
  }

  likePost(id: number): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.post(`${API_URL}/like/${id}`, {}, { headers });
  }
  unlikePost(id: number): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.delete(`${API_URL}/unlike/${id}`, { headers });
  }

  postComment(id: number, content: string): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.post(`${API_URL}/${id}/comment`, { content }, { headers });
  }

  deleteComment(commentId: number): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.delete(`${API_URL}/comment/${commentId}`, { headers });
  }

  likeComment(commentId: number): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.post(`${API_URL}/likecomment/${commentId}`, {}, { headers });
  }
  unlikeComment(commentId: number): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.delete(`${API_URL}/unlikecomment/${commentId}`, { headers });
  }
}

export default new PostService();

