import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'; // Adjust the path as necessary

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private http: HttpClient) {}

  getItems(page = 1) {
    return this.http.get(`${environment.apiUrl}/get-items?page=${page}`);
  }

  saveItems(items: any[]) {
    return this.http.post(`${environment.apiUrl}/save-item`, { items });
  }
}
