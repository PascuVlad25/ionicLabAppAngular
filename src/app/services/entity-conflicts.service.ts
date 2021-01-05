import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event, Conflict } from '../models';

@Injectable()
export class EntityConflictsService {
    private conflictsList: Conflict[] = [];
    private conflictsNumber: BehaviorSubject<number> = new BehaviorSubject(0);

    public addUpdateConflict(updatedEntity: Event, serverEntity: Event): void {
        console.log('add conflict to list');
        this.conflictsList.push(new Conflict(updatedEntity, serverEntity));
        this.conflictsNumber.next(this.conflictsList.length);
    }

    public getConflict(): Conflict {
        const conflictToReturn = this.conflictsList.shift();
        this.conflictsNumber.next(this.conflictsList.length);
        return conflictToReturn;
    }

    public getConflictsNumber(): Observable<number> {
        return this.conflictsNumber;
    }

    public isConflictToSolve(): boolean {
        return this.conflictsList.length !== 0;
    }
}