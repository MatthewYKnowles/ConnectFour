import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import {GameboardComponent} from "./gameboard/gameboard.component";
import {GameboardService} from "./gameboard/gameboard.service";

@NgModule({
  imports: [ BrowserModule ],
  declarations: [
      AppComponent,
      GameboardComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [ GameboardService ]
})
export class AppModule { }
