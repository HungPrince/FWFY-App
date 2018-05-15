import { NgModule } from '@angular/core';
import { SelectSearchComponent } from './select-search/select-search';
import { PostComponent } from './post/post';
import { EmailComponent } from './email/email';
import { CommentComponent } from './comment/comment';
import { ChatComponent } from './chat/chat';
@NgModule({
    declarations: [
        SelectSearchComponent,
        PostComponent,
        EmailComponent,
    CommentComponent,
    ChatComponent],
    imports: [

    ],
    exports: [
        SelectSearchComponent,
        PostComponent,
        EmailComponent,
    CommentComponent,
    ChatComponent]
})
export class ComponentsModule { }
