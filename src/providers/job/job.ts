import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { AutoCompleteService } from 'ionic2-auto-complete';
import { ADDRESS } from '../../configs/data';

@Injectable()
export class JobProvider implements AutoCompleteService {

    private address = ADDRESS;
    constructor(public af: AngularFireDatabase) {
    }

    getResults(keywords: string) {
        return this.address.filter(item => item[0].name.toLowerCase().startsWith(keywords).toLowerCase());
    }

    getAll(): Observable<any> {
        return this.af.list('jobs').snapshotChanges().
            map(jobs => { return jobs.map(job => ({ key: job.key, ...job.payload.val() })) });
    }

    add(job: any) {
        return this.af.database.ref('jobs').push(job);
    }

    update(job: any) {
        return this.af.database.ref(`jobs/${job.key}`).set(job);
    }

    delete(job: any) {
        return this.af.database.ref('jobs').remove(job.key);
    }
}
