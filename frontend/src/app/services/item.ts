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

  getItems(payload: any) {
    // convert payload to query parameters
    const params = new URLSearchParams();
    if (payload.page) params.append('page', payload.page);
    if (payload.limit) params.append('limit', payload.limit);
    if (payload.title) params.append('title', payload.title);
    if (payload.createdDate) params.append('createdDate', payload.createdDate);
    return this.http.get(`${environment.apiUrl}/get-items?${params.toString()}`, this.getAuthHeaders());
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
