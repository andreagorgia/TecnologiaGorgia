
import { Component, OnInit } from '@angular/core';
import { GeoFeatureCollection } from './models/geojson.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ci_vettore } from './models/ci_vett.model';
import { Marker } from './models/marker.model';
import { MouseEvent } from '@agm/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ang-maps';
  // google maps zoom level
  zoom: number = 12;
  geoJsonObject: GeoFeatureCollection; //Oggetto che conterrà il vettore di GeoJson
  fillColor: string = "#FF0000";  //Colore delle zone catastali
  obsGeoData: Observable<GeoFeatureCollection>;
  lng: number = 9.205331366401035;
  lat: number = 45.45227445505016;
  obsCiVett : Observable<Ci_vettore[]>
  markers: Marker[];
  foglio : string;
  circleLat : number = 0; //Latitudine e longitudine iniziale del cerchio
  circleLng: number = 0;
  maxRadius: number = 400; //Voglio evitare raggi troppo grossi
  radius : number = this.maxRadius; //Memorizzo il raggio del cerchio

  constructor(public http: HttpClient) {
  //Facciamo iniettare il modulo HttpClient dal framework Angular (ricordati di importare la libreria)
  }

  // Questo metodo ottiene i dati e li scarica dal server per metterli nella variabile geoJsonObject
  prepareData = (data: GeoFeatureCollection) => {
    this.geoJsonObject = data   //traserimento dei dati nella variabile
    console.log( this.geoJsonObject );//mostriamo il dato ottenuto nella console
  }

  //Una volta che la pagina web è caricata, viene lanciato il metodo ngOnInit scarico i    dati
  //dal server
  ngOnInit() {
    this.obsGeoData = this.http.get<GeoFeatureCollection>("https://3000-ea2b2a35-54b0-4c0b-b66d-33a17bf00515.ws-eu01.gitpod.io/");
    this.obsGeoData.subscribe(this.prepareData);

  }

  //Questo metodo richiama la route sul server che recupera il foglio specificato nella casella di testo
  cambiaFoglio(foglio) : boolean
  {
    let val = foglio.value; //ottwniamo nella variabile val il valore del foglio
    this.obsCiVett = this.http.get<Ci_vettore[]>(`https://3000-ea2b2a35-54b0-4c0b-b66d-33a17bf00515.ws-eu01.gitpod.io/ci_vettore/${val}`);  //otteniamo i dati del vettore da passare all'observable
    this.obsCiVett.subscribe(this.prepareCiVettData); //all'interno di obsCiVett aggiungiamo prepareCiVettdata e il suo valore
    console.log(val);
    return false;
  }




  styleFunc = (feature) => {
    return ({
      clickable: false,
      fillColor: this.fillColor,
      strokeWeight: 1
    });
  }
    //metodo che riceve i vettori energetici e riempie un vettore di marker creando per ogni oggetto un marker


prepareCiVettData = (data: Ci_vettore[]) =>
  {
    let latTot = 0; //Uso queste due variabili per calcolare latitudine e longitudine media
    let lngTot = 0; //E centrare la mappa

    console.log(data);
    this.markers = [];

    for (const iterator of data) {
      let m = new Marker(iterator.WGS84_X,iterator.WGS84_Y,iterator.CI_VETTORE);
      latTot += m.lat; //Sommo tutte le latitutidini e longitudini
      lngTot += m.lng;
      this.markers.push(m);
    }
    this.lng = lngTot/data.length; //Commenta qui
    this.lat = latTot/data.length;
    this.zoom = 16;
  }

  mapClicked($event: MouseEvent) {
    this.circleLat = $event.coords.lat; //Queste sono le coordinate cliccate
    this.circleLng = $event.coords.lng; //Sposto il centro del cerchio qui
    this.lat = this.circleLat; //Sposto il centro della mappa qui
    this.lng = this.circleLng;
    this.zoom = 15;  //Zoom sul cerchio
  }



//Aggiungi il gestore del metodo radiusChange
circleRedim(newRadius : number){
    console.log(newRadius) //posso leggere sulla console il nuovo raggio
    this.radius = newRadius;  //Ogni volta che modifico il cerchio, ne salvo il raggio
  }

//Aggiungi il gestore del metodo circleDblClick
circleDoubleClicked(circleCenter)
  {
    console.log(circleCenter); //Voglio ottenere solo i valori entro questo cerchio
    console.log(this.radius);

    this.circleLat = circleCenter.coords.lat; //Aggiorno le coordinate del cerchio
    this.circleLng = circleCenter.coords.lng; //Aggiorno le coordinate del cerchio

    //Non conosco ancora le prestazioni del DB, non voglio fare ricerche troppo onerose
    if(this.radius > this.maxRadius)
    {
      console.log("area selezionata troppo vasta sarà reimpostata a maxRadius");
       this.radius = this.maxRadius;
    }
    console.log ("raggio in gradi " + (this.radius * 0.00001)/1.1132)
    let raggioInGradi = (this.radius * 0.00001)/1.1132;
    //Voglio spedire al server una richiesta che mi ritorni tutte le abitazioni all'interno del cerchio
    this.obsCiVett = this.http.get<Ci_vettore[]>(`https://3000-ea2b2a35-54b0-4c0b-b66d-33a17bf00515.ws-eu01.gitpod.io/ci_geovettore/
    ${this.circleLat}/
    ${this.circleLng}/
    ${raggioInGradi}`);
    this.obsCiVett.subscribe(this.prepareCiVettData);
  }



}

