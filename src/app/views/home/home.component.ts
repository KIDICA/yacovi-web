import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {YacoviAlertService, ConfigService} from '@app/services';
import {RTCService} from '@app/services/rtc.service';
import {NgxSpinnerService} from 'ngx-spinner';
import { Observable, forkJoin } from 'rxjs';
import { ImageAnalyzingService } from '@app/services/ImageAnalyzingService';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('video') videoElm: ElementRef;

  constructor(
    private configService: ConfigService,
    private imageAnalyzing: ImageAnalyzingService,
    private alertService: YacoviAlertService,
    private rtcService: RTCService,
    private spinner: NgxSpinnerService
  ) {

  }

  ngOnInit() {
    this.spinner.show();
    console.log(this.configService.isConfigInitialized().subscribe((data) => console.log(data)));
    forkJoin([this.configService.isConfigInitialized(), this.initCameraStream()])
    .subscribe(value => {
      this.hideSpinnerWithDelay(1000)
      .finally(() => {
        this.rtcService.takeSnapshot(this.videoElm);
        /*this.imageAnalyzing.getResponseFromAPI().subscribe(requestvalue => {
        
          //console.log(JSON.stringify(requestvalue));
        });*/
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
