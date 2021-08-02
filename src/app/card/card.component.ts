import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'lxs-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnDestroy {

  offset = new BehaviorSubject<{x: number, y: number}>({x: 0, y: 0});
  clickStart = new Subject<MouseEvent>();
  clickMove = new Subject<MouseEvent>();
  clickStop = new Subject<MouseEvent>();
  subscriptions = new Subscription();

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.offset.subscribe((value) => {
        const element = this.element.nativeElement;
        element.style.left = value.x + 'px';
        element.style.top = value.y + 'px';
      })
    );

    this.subscriptions.add(
      // React to clickStart
      this.clickStart.pipe(
        // Convert the initial click position into an offset from the starting offset
        map((event) => {
          const initial = this.offset.getValue();
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
        this.offset.next(value);
      })
    );
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
