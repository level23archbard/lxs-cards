import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { CardListService } from './card-list.service';

export interface CardLayout {
  id: string;
  position: { x: number, y: number };
  zIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class CardLayoutService {

  private layouts = new BehaviorSubject<CardLayout[]>([]);
  private largestIndex = 0;

  constructor(private cardListService: CardListService) {
    this.cardListService.cardList.subscribe((entries) => {
      const oldLayouts = this.layouts.getValue();
      this.layouts.next(entries.map((entry) => {
        const oldLayout = oldLayouts.find((layout) => layout.id === entry.id);
        if (oldLayout) {
          return {
            ...oldLayout,
            ...entry,
          };
        } else {
          return {
            ...entry,
            position: { x: 0, y: 0 },
            zIndex: 0,
          };
        }
      }));
    });
  }

  get cardLayouts(): Observable<CardLayout[]> {
    return this.layouts.asObservable();
  }

  registerPositionUpdateForCard(id: string, position: CardLayout["position"]): void {
    const layout = this.layouts.getValue().find((layout) => layout.id === id);
    if (layout) {
      layout.position = position;
    }
  }

  registerBringToFrontInteractionForCard(id: string): number {
    this.largestIndex++;
    const layout = this.layouts.getValue().find((layout) => layout.id === id);
    if (layout) {
      layout.zIndex = this.largestIndex;
    }
    return this.largestIndex;
  }

  getLayoutForCard(id: string): CardLayout {
    return this.layouts.getValue().find((layout) => layout.id === id)!;
  }
}
