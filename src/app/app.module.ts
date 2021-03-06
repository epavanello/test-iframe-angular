import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { IframeComponent } from "./iframe/iframe.component";
import { ContainerComponent } from "./container/container.component";

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [
    AppComponent,
    HelloComponent,
    IframeComponent,
    ContainerComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
