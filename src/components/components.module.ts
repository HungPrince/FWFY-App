import { NgModule } from '@angular/core';
import { SelectSearchComponent } from './select-search/select-search';
import { PostComponent } from './post/post';
import { EmailComponent } from './email/email';
import { CommentComponent } from './comment/comment';
@NgModule({
    declarations: [
        SelectSearchComponent,
        PostComponent,
        EmailComponent,
    CommentComponent],
    imports: [

    ],
    exports: [
        SelectSearchComponent,
        PostComponent,
        EmailComponent,
    CommentComponent]
})
export class ComponentsModule { }
