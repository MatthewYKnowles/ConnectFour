import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import {GameboardComponent} from "./gameboard/gameboard.component";

@NgModule({
  imports: [ BrowserModule ],
  declarations: [
      AppComponent,
      GameboardComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
