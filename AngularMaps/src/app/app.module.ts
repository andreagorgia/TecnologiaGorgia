import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core'
import { AppComponent } from './app.component';
import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    AgmCoreModule.forRoot({apiKey: 'AIzaSyDOUtzC5evlPWPIt5a-q3qzYaj_KMZymcw'}),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
