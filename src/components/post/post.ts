import { Component, Input } from '@angular/core';

@Component({
    selector: 'post',
    templateUrl: 'post.html'
})

export class PostComponent {

    @Input('postI') post: any;
    constructor() {
    }


}
