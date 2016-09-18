import { Component } from '@angular/core';
import { GameboardComponent } from './gameboard/gameboard.component'

export class Hero {
  id: number;
  name: string;
}

@Component({
    selector: 'my-app',
    template: '<h1>{{title}}</h1><h2>{{hero}} details!</h2><gameboard></gameboard>'
})

export class AppComponent {
  title = 'Tour of Heroes';
  hero = 'Windstorm';
}
