import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class JobProvider {

    constructor(public af: AngularFireDatabase) {
    }

    getAll(): Observable<any> {
        return this.af.list('jobs').valueChanges();
    }

    add(job: any) {
        return this.af.database.ref('jobs').push(job);
    }

    update(job: any) {
        return this.af.database.ref('jobs').set(job);
    }

    delete(job: any) {
        return this.af.database.ref('jobs').remove();
    }

    getUserByKey(key: string) {
        return this.af.list(`users/${key}`).valueChanges();
    }

}
