import { Component } from '@angular/core';
import { GameboardComponent } from './gameboard/gameboard.component'

export class Hero {
  id: number;
  name: string;
}

@Component({
    selector: 'my-app',
    template: '<gameboard></gameboard>'
})

export class AppComponent {
  title = 'Tour of Heroes';
  hero = 'Windstorm';
}
