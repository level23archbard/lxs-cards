import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { CardEntry, CardListService } from '../card-list.service';

@Component({
  selector: 'lxs-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  @Output() onClose = new EventEmitter<void>();
  cardList?: CardEntry[];
  subscription = new Subscription();

  constructor(private cardListService: CardListService) { }

  ngOnInit(): void {
    this.subscription.add(this.cardListService.cardList.subscribe((list) => this.cardList = list));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onClickClose(): void {
    this.onClose.emit();
  }

  onClickAddCard(): void {
    this.cardListService.createCard();
  }
}
