import { Component } from '@angular/core';

@Component({
    selector: 'chat',
    templateUrl: 'chat.html'
})
export class ChatComponent {

    text: string;

    constructor() {
        console.log('Hello ChatComponent Component');
        this.text = 'Hello World';
    }

}
