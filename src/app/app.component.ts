import { Component, NgZone, OnDestroy, OnInit, VERSION } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Subject } from "rxjs";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "Angular " + VERSION.major;
  toggle = true;

  changeToggle() {
    this.toggle = !this.toggle;
  }
}
