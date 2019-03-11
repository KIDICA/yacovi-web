import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {YacoviAlertService, ConfigService} from '@app/services';
import {RTCService} from '@app/services/rtc.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Observable, forkJoin, interval} from 'rxjs';
import {AzureVisionApiService} from '@app/services/azureVisionApi.service';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '@environments/environment';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('video') videoElm: ElementRef;
  @ViewChild('canvas') canvasElm: ElementRef;

  constructor(
    private configService: ConfigService,
    private imageAnalyzing: AzureVisionApiService,
    private alertService: YacoviAlertService,
    private rtcService: RTCService,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  private analyzeCapturedSnapshot = (capturedImage) => {
    return this.imageAnalyzing.detectFaces(capturedImage).toPromise();
  }

  private drawRectanglesAroundFaces = apiResponse => {
    const faces = apiResponse.faces || [];
    const canvas = this.canvasElm.nativeElement.getContext('2d');
    const fillColor = (faces.length > 0) ? environment.canvas.colors.success : environment.canvas.colors.error;
    canvas.font = `${environment.canvas.font.size} ${environment.canvas.font.family}`;
    canvas.fillStyle = fillColor;
    canvas.strokeStyle = fillColor;

    canvas.fillText(this.translateService.instant('views.home.canvas.resultText', {'numberOfFaces': faces.length}), 50, 50);

    faces.forEach(face => {
        // Rectangle
        canvas.strokeRect(face.faceRectangle.left, face.faceRectangle.top, face.faceRectangle.width, face.faceRectangle.height);
        // Age
        canvas.fillText(face.age, face.faceRectangle.left + face.faceRectangle.width + 5, face.faceRectangle.top + 15);
        // Gender
        canvas.fillText(face.gender, face.faceRectangle.left + face.faceRectangle.width + 5, face.faceRectangle.top + 55);
      });
  }

  private preInitializeCanvasElement() {
    const video = this.videoElm.nativeElement;
    this.canvasElm.nativeElement.width = video.videoWidth;
    this.canvasElm.nativeElement.height = video.videoHeight;

    const canvas = this.canvasElm.nativeElement.getContext('2d');
    canvas.fillStyle = '#000000';
    canvas.fillRect(0, 0, this.canvasElm.nativeElement.width, this.canvasElm.nativeElement.height);
    canvas.fill();
  }

  ngOnInit() {
    this.spinner.show();
    forkJoin([this.configService.isConfigInitialized(), this.initCameraStream()])
    .subscribe(() => {
      this.hideSpinnerWithDelay(1000)
      .finally(() => {
        this.alertService.success(this.translateService.instant('views.home.messages.applicationSuccessfullyInitialized'));
        this.preInitializeCanvasElement();
        interval(environment.snapshotIntervalInSeconds * 1000).subscribe(() => {
          this.rtcService.takeSnapshot(this.videoElm, this.canvasElm)
                         .then(this.analyzeCapturedSnapshot)
                         .then(this.drawRectanglesAroundFaces);
        });
      });
    }, error => {
      this.alertService.error(error);
      this.rtcService.stopAllCurrentlyRunningStreams(this.videoElm);
      this.spinner.hide();
    });
  }

  private initCameraStream() {
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
          observable.error(this.translateService.instant('view.home.messages.permissionDeniedError'));
        }
        observable.error(error);
      });
    });
  }

  private async hideSpinnerWithDelay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => this.spinner.hide());
  }

}
