import {
  Component,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
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

  private safeUrl: SafeResourceUrl;
  public showIframe: boolean = false;

  constructor(private sanitizer: DomSanitizer, private ngZone: NgZone) {
    /*this.ngZone.run(async () => {
      console.log("Zone");
      this.postRobot = await import("post-robot");
    });*/
  }

  ngOnInit(): void {
    console.log("Init");
    // TODO check if is correct
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Change");
    if (changes.url) {
      this.showIframe = false;
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
      this.connectToEuresys();
    }
  }

  connectToEuresys() {
    console.log("Angular: Listen");
    (postRobot as any).once("euresys_connect", event => {
      this.sendToEuresys = event.data.send;
      return {
        send: this.receiveFromEuresys
      };
    });
  }

  private sendToEuresys: (type: string, data: any) => void;

  private receiveFromEuresys = (type: string, data: any) => {
    console.log("Angular: Received", type);
    if (type == "hello") {
      alert(data);
    }
  };

  saluta() {
    this.sendToEuresys("hello", "Ciao");
  }

  ngOnDestroy(): void {}

  loaeded() {
    this.showIframe = true;
  }

  guid: string;
  width = 300;
  height = 0;
}
