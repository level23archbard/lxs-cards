import { Component, ElementRef, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';

import { CardLayout, CardLayoutService } from '../card-layout.service';

@Component({
  selector: 'lxs-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnChanges, OnInit, OnDestroy {

  @Input() id!: string;

  clickStart = new Subject<MouseEvent>();
  clickMove = new Subject<MouseEvent>();
  clickStop = new Subject<MouseEvent>();
  subscriptions = new Subscription();
  styleOffset = new BehaviorSubject<CardLayout["position"]>({x: 0, y: 0});
  styleZIndex = new BehaviorSubject<CardLayout["zIndex"]>(0);

  constructor(private element: ElementRef, private cardLayout: CardLayoutService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.id) {
      const layout = this.cardLayout.getLayoutForCard(this.id);
      this.styleOffset.next(layout.position);
      this.styleZIndex.next(layout.zIndex);
    }
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.styleOffset.subscribe((value) => {
        const element = this.element.nativeElement;
        element.style.left = value.x + 'px';
        element.style.top = value.y + 'px';
      })
    );

    this.subscriptions.add(
      this.styleZIndex.subscribe((value) => {
        const element = this.element.nativeElement;
        element.style.zIndex = value;
      })
    );

    this.subscriptions.add(
      // React to clickStart
      this.clickStart.pipe(
        // Convert the initial click position into an offset from the starting offset
        map((event) => {
          const initial = this.styleOffset.getValue();
          return {
            x: event.clientX - initial.x,
            y: event.clientY - initial.y,
          };
        }),
        // Merge this offset into a clickMove for global offset
        mergeMap((offset) => this.clickMove.pipe(
          // Convert each movement into a global offset minus initial offset point
          map((event) => {
            return {
              x: event.clientX - offset.x,
              y: event.clientY - offset.y,
            };
          }),
          // Stop tracking on clickStop
          takeUntil(this.clickStop),
        )),
      ).subscribe((value) => {
        // Set the global offset onto the elements style
        this.cardLayout.registerPositionUpdateForCard(this.id, value);
        this.styleOffset.next(value);
      })
    );

    this.subscriptions.add(this.clickStart.subscribe((event) => {
      const index = this.cardLayout.registerBringToFrontInteractionForCard(this.id);
      this.styleZIndex.next(index);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): boolean {
    if (event.button === 0) {
      this.clickStart.next(event);
      return false;
    }
    return true;
  }

  @HostListener('document:mousemove', ['$event'])
  onMousemove(event: MouseEvent): void {
    this.clickMove.next(event);
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseup(event: MouseEvent): void {
    this.clickStop.next(event);
  }
}
