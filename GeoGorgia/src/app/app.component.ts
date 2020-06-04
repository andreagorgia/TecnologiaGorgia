import { Component, OnInit } from '@angular/core';
import {GEOJSON, GeoFeatureCollection } from './models/geojson.model';
import{Marker} from './models/marker.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ang-maps';
  // google maps zoom level
  zoom: number = 8;
  geoJsonObject : GeoFeatureCollection; //Oggetto che conterrà il vettore di GeoJson
  fillColor: string = "#FF0000";  //Colore delle zone catastali
  markers: Marker[];  //Vettore con tutti i marker
 
  lng: number = 9.02657833507687;
  lat: number = 45.512051524024308;

  constructor()
  {
    //Questi dati dovremmo scaricarli dal server, per ora li abbiamo copiati nel file gojson.model.ts
    this.geoJsonObject = GEOJSON;  
    console.log(this.geoJsonObject); //stampo l'oggetto geoJsonObject sulla console


}


ngOnInit() {
    this.markers = [
      {
        //features[0] seleziona il primo geoJson
        //coordinates[0] ottiene la lista di poligoni.
        //coordinates[0][0] ottiene il primo (e unico) poligono della lista
        //coordinates[0][0][0] ottiene la longitudine
        //coordinates[0][0][1] ottiene la latitudine
        lng: this.geoJsonObject.features[0].geometry.coordinates[0][0][0],
        lat: this.geoJsonObject.features[0].geometry.coordinates[0][0][1],
        label: String(this.geoJsonObject.features[0].properties.id),
      },
      {
        lng: this.geoJsonObject.features[1].geometry.coordinates[0][0][0],
        lat: this.geoJsonObject.features[1].geometry.coordinates[0][0][1],
        label: String(this.geoJsonObject.features[1].properties.id),
      }
    ]
  }
}
