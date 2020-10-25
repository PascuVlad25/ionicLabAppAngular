import { Injectable } from '@angular/core';
import axios from 'axios';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpService {
    private config = {
        headers: {
          'Content-Type': 'application/json'
        }
    };
    private baseUrl =  'http://localhost:3000';

    public get<T>(url: string): Observable<T> {
        const getUrl = `${this.baseUrl}/${url}`;
        return from(axios.get(getUrl, this.config)).pipe(map(response => response.data));
    }

    public post(url: string, body: any): Observable<any> {
        const postUrl = `${this.baseUrl}/${url}`;
        return from(axios.post(postUrl , body, this.config)).pipe(map(response => response.data));
    }

    public put<T>(url: string, body: T): Observable<T> {
        const putUrl = `${this.baseUrl}/${url}`;
        return from(axios.put(putUrl, body, this.config)).pipe(map(response => response.data));
    }
}