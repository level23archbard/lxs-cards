import { Injectable } from '@angular/core';
import { StorageKey, StorageService } from '@level23archbard/storage-service';
import { Observable } from 'rxjs';

import { IdService } from './id.service';

export interface CardEntry {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class CardListService {

  private cardListKey: StorageKey<CardEntry[]>

  constructor(private storage: StorageService, private id: IdService) {
    this.cardListKey = this.storage.jsonKey('cardList');
  }

  get cardList(): Observable<CardEntry[]> {
    return this.cardListKey.getWithDefault([]);
  }

  createCard(): void {
    this.cardListKey.update((current) => {
      const currentValue = current || [];
      currentValue.push({
        id: this.id.generate(),
      });
      return currentValue;
    })
  }
}
