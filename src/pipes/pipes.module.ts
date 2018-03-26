import { NgModule } from '@angular/core';
import { MomentPipe, TimeAgoPipe } from './moment/moment';
import { KeysPipe } from './until/until';

@NgModule({
    declarations: [MomentPipe, TimeAgoPipe, KeysPipe],
    imports: [],
    exports: [MomentPipe, TimeAgoPipe, KeysPipe]
})
export class PipesModule { }
