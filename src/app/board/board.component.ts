import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CardLayout, CardLayoutService } from '../card-layout.service';

@Component({
  selector: 'lxs-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  cardLayouts?: CardLayout[];
  subscription = new Subscription();

  constructor(private cardLayoutService: CardLayoutService) { }

  ngOnInit(): void {
    this.subscription.add(this.cardLayoutService.cardLayouts.subscribe((layouts) => this.cardLayouts = layouts));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
