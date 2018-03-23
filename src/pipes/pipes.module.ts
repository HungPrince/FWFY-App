import { NgModule } from '@angular/core';
import { MomentPipe, TimeAgoPipe } from './moment/moment';

@NgModule({
    declarations: [MomentPipe, TimeAgoPipe],
    imports: [],
    exports: [MomentPipe, TimeAgoPipe]
})
export class PipesModule { }
