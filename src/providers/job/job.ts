import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class JobProvider {

  constructor(public http: HttpClient) {
  }

}
