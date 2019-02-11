import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {YacoviAlertService, ConfigService} from '@app/services';
import {RTCService} from '@app/services/rtc.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {forkJoin, Observable} from 'rxjs';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('video') videoElm: ElementRef;
  private azureCognitiveServiceKey: string;

  constructor(
    private configService: ConfigService,
    private alertService: YacoviAlertService,
    private rtcService: RTCService,
    private spinner: NgxSpinnerService
  ) {

  }

  ngOnInit() {
    this.spinner.show();
    forkJoin([this.configService.getConfig(), this.initCameraStream()])
    .subscribe(value => {
      this.azureCognitiveServiceKey = value[0].cognitiveServiceApiKey;
      this.hideSpinnerWithDelay(500)
      .finally(() => {
        console.log(this.azureCognitiveServiceKey);
        this.configService.getResponseFromAPI(this.azureCognitiveServiceKey).subscribe(requestvalue => {
          console.log(JSON.stringify(requestvalue));
        });
        this.alertService.success('Application successfully initialized!');
      });
    }, error => {
      this.alertService.error(error);
      this.spinner.hide();
    });
  }

  initCameraStream() {
    this.rtcService.stopAllCurrentlyRunningStreams(this.videoElm);
    return Observable.create((observable) => {
      const constraints = {
        audio: false,
        video: {}
      };
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        this.videoElm.nativeElement.srcObject = stream;
        observable.next(true);
        observable.complete();
      }).catch((error) => {
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        if (error === 'PermissionDeniedError') {
          observable.error('Permission denied. Please refresh and give permission.');
        }
        observable.error(error);
      });
    });
  }

  async hideSpinnerWithDelay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => this.spinner.hide());
  }

}
