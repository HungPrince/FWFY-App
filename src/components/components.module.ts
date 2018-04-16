import { NgModule } from '@angular/core';
import { SelectSearchComponent } from './select-search/select-search';
import { PostComponent } from './post/post';
@NgModule({
    declarations: [
        SelectSearchComponent,
        PostComponent],
    imports: [],
    exports: [
        SelectSearchComponent,
        PostComponent]
})
export class ComponentsModule { }
