import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Server Maps';

  lat: number = 45.506738;
  lng: number = 9.190766;

  latCasa: number = 45.406396;
  lngCasa: number = 9.034982;
}
