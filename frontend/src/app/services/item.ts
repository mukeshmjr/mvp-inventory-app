import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'; // Adjust the path as necessary

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) {}

  getAuthHeaders() {
    const token = localStorage.getItem('token'); // or from a token service
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getItems(page = 1) {
    return this.http.get(`${environment.apiUrl}/get-items?page=${page}`, this.getAuthHeaders());
  }

  saveItems(items: any) {
    return this.http.post(`${environment.apiUrl}/save-items`, items, this.getAuthHeaders());
  }

  fileUploader(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<any>(`${environment.apiUrl}/upload-image`, formData, this.getAuthHeaders());
  }

}
