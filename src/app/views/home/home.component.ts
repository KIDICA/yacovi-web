import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {YacoviAlertService, ConfigService} from '@app/services';
import {RTCService} from '@app/services/rtc.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Observable, forkJoin, interval} from 'rxjs';
import { AzureVisionApiService } from '@app/services/azureVisionApi.service';
import {environment} from '@environments/environment.prod';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('video') videoElm: ElementRef;

  constructor(
    private configService: ConfigService,
    private imageAnalyzing: AzureVisionApiService,
    private alertService: YacoviAlertService,
    private rtcService: RTCService,
    private spinner: NgxSpinnerService
  ) {

  }

  ngOnInit() {
    this.spinner.show();
    forkJoin([this.configService.isConfigInitialized(), this.initCameraStream()])
    .subscribe(() => {
      this.hideSpinnerWithDelay(1000)
      .finally(() => {
        this.alertService.success('Application successfully initialized!');
        interval(environment.snapshotIntervalInSeconds * 1000).subscribe(() => this.rtcService.takeSnapshot(this.videoElm));
      });
    }, error => {
      this.alertService.error(error);
      this.rtcService.stopAllCurrentlyRunningStreams(this.videoElm);
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
