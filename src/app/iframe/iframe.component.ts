import {
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
export class IframeComponent implements OnInit, OnDestroy, OnChanges {
  @Input() url: string;

  safeUrl: SafeResourceUrl;
  public showIframe: boolean = false;
  @Output() titleChange = new EventEmitter<string>();

  constructor(private sanitizer: DomSanitizer, private ngZone: NgZone) {}

  ngOnInit(): void {
    console.log("Init");
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Chang2e");
    if (changes.url) {
      this.showIframe = false;
      this.safeUrl = this.url ? this.sanitizer.bypassSecurityTrustResourceUrl(this.url) : null;
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
        this.titleChange.emit(event.data.title);
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

  private sendToEuresys: (type: string, data: any) => void;

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
    }
  };

  saluta() {
    this.sendToEuresys("hello", "Ciao");
  }

  ngOnDestroy(): void {
    (postRobot as any).destroy();
  }

  loaeded() {
    this.showIframe = true;
  }

  guid: string;
  width = 300;
  height = 50px;
}
