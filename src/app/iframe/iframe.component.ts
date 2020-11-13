import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import * as postRobot from "post-robot";

@Component({
  selector: "app-iframe",
  templateUrl: "./iframe.component.html",
  styleUrls: ["./iframe.component.css"]
})
export class IframeComponent implements OnDestroy, OnChanges {
  @Input() url: string;

  safeUrl: SafeResourceUrl;
  showIframe: boolean = false;
  @Output() titleChange = new EventEmitter<string>();
  width = 300;
  height = 300;

  constructor(private sanitizer: DomSanitizer, private ngZone: NgZone) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Change");
    if (changes.url) {
      this.showIframe = false;
      this.safeUrl = this.url
        ? this.sanitizer.bypassSecurityTrustResourceUrl(this.url)
        : null;
      this.connectToEuresys();
    }
  }

  connectToEuresys() {
    console.log("Angular: Listen");
    (postRobot as any).setup();
    (postRobot as any).once("euresys_connect", event => {
      console.log("Angular: Connection done", event.data);

      this.ngZone.run(() => {
        this.sendToEuresys = event.data.send;
        this.setTitle(event.data.title);
      });

      return {
        send: (type: string, data: any) => {
          this.ngZone.run(() => {
            this.receiveFromEuresys(type, data);
          });
        }
      };
    });
  }

  private setTitle(title: string) {
    this.titleChange.emit(title);
  }

  private sendToEuresys: (type: string, data: any) => void;

  // (OK) Under ngZone
  private receiveFromEuresys = (type: string, data: any) => {
    console.log("Angular: Received", type, data);
    switch (type) {
      case "hello":
        alert(data);
        break;
      case "resize":
        this.width = data.width;
        this.height = data.height;
        break;
      case "new_window":
        // Fake response
        this.setTitle(data.title);
        data.onClose(true, { "is-set": true });
        break;
    }
  };

  ngOnDestroy(): void {
    console.log("Destroy");
    (postRobot as any).destroy();
  }

  loaeded() {
    this.showIframe = true;
  }
}
