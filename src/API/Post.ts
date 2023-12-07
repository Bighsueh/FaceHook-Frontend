import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:8080/post";
const API_URL2 = "http://localhost:8080/post/images";


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

  postPost(content: string,group:string): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.post(API_URL, { content,group }, { headers });
  }
  postPhoto(formData:any):Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token? { Authorization:token,'Content-Type':'multipartform-data' } :{};
    console.log(formData);
    return axios.post(API_URL2,formData, { headers });
    
  }

  updatePost(id: number, content: string,group: string): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    return axios.put(`${API_URL}/${id}`, { content,group }, { headers });
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
  searchPosts(keyword: string): Promise<AxiosResponse> {
    const token = this.getToken();
    const headers = token ? { Authorization: token } : {};
    const params = { q: keyword }; 
    return axios.post(`${API_URL}/search`, null, { headers, params });
  }
}

export default new PostService();

