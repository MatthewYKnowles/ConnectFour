import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import {GameboardComponent} from "./gameboard/gameboard.component";
import {GameboardRenderService} from "./gameboard/gameboard.render.service";

@NgModule({
  imports: [ BrowserModule ],
  declarations: [
      AppComponent,
      GameboardComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [ GameboardRenderService ]
})
export class AppModule { }
