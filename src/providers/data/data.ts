import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DataProvider {

    constructor(public http: HttpClient) {
    }

    private url = "https://api.myjson.com/bins/sdiu7";

    getDataAddress() {
        this.http.get(this.url);
    }

}
