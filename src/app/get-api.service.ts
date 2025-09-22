import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetApiService {
  private URL = `https://talentobe-development.up.railway.app/admin-panel/employees`;
  private URLS = 'https://e-commerce-serverside.vercel.app/get';

  constructor(private Http: HttpClient) {}

  getEmployees(params: {
    page: number;
    limit: number;
    name?: string;
    // company: companyName;
    // companyId: companyId;
  }) {
    let httpParams = new HttpParams()
      .set('page', params.page.toString() || '1')
      .set('limit', params.limit.toString() || '10');
    return this.Http.get(this.URL, { params: httpParams });
  }
  products(){
    return this.Http.get(this.URLS)
  }
}
