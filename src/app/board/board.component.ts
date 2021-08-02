import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CardEntry, CardListService } from '../card-list.service';

@Component({
  selector: 'lxs-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  cardList?: CardEntry[];
  subscription = new Subscription();

  constructor(private cardListService: CardListService) { }

  ngOnInit(): void {
    this.subscription.add(this.cardListService.cardList.subscribe((list) => this.cardList = list));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
