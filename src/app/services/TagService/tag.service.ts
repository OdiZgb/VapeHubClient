// src/app/services/tag.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TagDTO } from 'src/app/DTOs/TagDTO';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiURL ='https://localhost:7260/tag';  // Update with your backend URL

  constructor(private http: HttpClient) {}

  getAllTags(): Observable<TagDTO[]> {
    return this.http.get<TagDTO[]>(`${this.apiURL}/getAllTags`);
  }

  addTag(tag: TagDTO): Observable<TagDTO> {
    return this.http.post<TagDTO>(`${this.apiURL}/addTag`, tag);
  }
}
