import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'lxs-cards',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('showSettingsTrigger', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('150ms ease-in', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class AppComponent {

  showSettings = false;

  onClickSettings(): void {
    this.showSettings = true;
  }

  onSettingsClose(): void {
    this.showSettings = false;
  }
}
