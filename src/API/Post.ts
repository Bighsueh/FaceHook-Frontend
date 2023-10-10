import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:5050/post";

class PostService {
  getPost(): Promise<AxiosResponse> {
    return axios.get(API_URL);
  }

  getApost(id: number): Promise<AxiosResponse> {
    return axios.get(`${API_URL}/${id}`);
  }

  postPost(content: string): Promise<AxiosResponse> {
    return axios.post(API_URL, { content });
  }

  updatePost(id: number, content: string): Promise<AxiosResponse> {
    return axios.put(`${API_URL}/${id}`, { content });
  }

  deletePost(id: number): Promise<AxiosResponse> {
    return axios.delete(`${API_URL}/${id}`);
  }

  likePost(id: number): Promise<AxiosResponse> {
    return axios.post(`${API_URL}/${id}/like`);
  }
  unlikePost(id: number): Promise<AxiosResponse> {
    return axios.delete(`${API_URL}/${id}/unlike`);
  }

  postComment(id: number, content: string): Promise<AxiosResponse> {
    return axios.post(`${API_URL}/${id}/comment`, { content });
  }

  deleteComment(commentId: number): Promise<AxiosResponse> {
    return axios.delete(`${API_URL}/comment/${commentId}`);
  }

  likeComment(commentId: number): Promise<AxiosResponse> {
    return axios.post(`${API_URL}/likecomment/${commentId}`);
  }
  unlikeComment(commentId: number): Promise<AxiosResponse> {
    return axios.delete(`${API_URL}/unlikecomment/${commentId}`);
  }
}

export default new PostService();

