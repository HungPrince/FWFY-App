import { Component } from '@angular/core';

@Component({
  selector: 'select-search',
  templateUrl: 'select-search.html'
})
export class SelectSearchComponent {

  text: string;

  constructor() {
    this.text = 'Hello World';
  }

}
