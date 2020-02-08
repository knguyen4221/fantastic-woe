import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component'
import { GraphComponent } from './graph/graph.component';
import { SharedModule } from './shared/shared.module';
import { MSTService } from './services/mst.service';
import { MSTSimulationComponent } from './simulation/mst-simulation.component';


@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    GraphComponent,
    MSTSimulationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    SharedModule,
    FormsModule
  ],
  providers: [
    MSTService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
