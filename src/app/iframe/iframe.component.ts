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

@Component({
  selector: "app-iframe",
  templateUrl: "./iframe.component.html",
  styleUrls: ["./iframe.component.css"]
})
export class IframeComponent implements OnInit, OnDestroy, OnChanges {
  @Input() url: string;

  private safeUrl: SafeResourceUrl;
  public showIframe: boolean = false;
  private postRobot: any;

  constructor(private sanitizer: DomSanitizer, private ngZone: NgZone) {}

  ngOnInit(): void {
    // TODO check if is correct
    this.ngZone.run(async () => {
      this.postRobot = await import("post-robot");
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.url) {
      this.showIframe = false;
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
      this.connectToEuresys();
    }
  }

  connectToEuresys() {
    console.log("Angular: Listen");
    this.postRobot.once("euresys_connect", event => {
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
