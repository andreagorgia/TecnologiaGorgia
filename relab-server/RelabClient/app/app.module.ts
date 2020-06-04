import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule} from '@agm/core'; // <---
import {HttpClientModule} from '@angular/common/http'; // <---

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyDOUtzC5evlPWPIt5a-q3qzYaj_KMZymcw'}), // <---
    HttpClientModule // <---

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

