import {ElementRef, Injectable} from '@angular/core';

<<<<<<< Updated upstream
import {environment} from '@environments/environment';
import {YacoviAlertService} from '@app/core/modules/yacovi-alert/yacovi-alert.service';
=======
import {environment} from "@environments/environment";
import {YacoviAlertService} from "@app/core/modules/yacovi-alert/yacovi-alert.service";
import { ConfigService } from './config.service';
import { config } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
>>>>>>> Stashed changes

@Injectable({providedIn: 'root'})
export class RTCService {

  private DetectRTC: any = window['DetectRTC'];

  constructor(private configService: ConfigService, private alertService: YacoviAlertService) {
    // do some WebRTC checks before creating the interface
    this.DetectRTC.load(() => {
      // do some checks
      if (this.DetectRTC.isWebRTCSupported === false) {
        this.alertService.error('Please use Chrome, Firefox, iOS 11, Android 5 or higher, Safari 11 or higher');
      } else {
        if (this.DetectRTC.hasWebcam === false) {
          this.alertService.error('Please install an external webcam device.');
        }
      }
      if (!environment.production) {
        this.logRTCStatus();
      }
    });
  }


  getNumberOfAvailableCameras() {
    return this.DetectRTC.videoInputDevices.length;
  }

  stopAllCurrentlyRunningStreams(videoElem: ElementRef) {
    // stop any active streams in the window
    if (videoElem && videoElem.nativeElement && videoElem.nativeElement.srcObject) {
      videoElem.nativeElement.srcObject.getTracks().forEach((track) => track.stop());
      videoElem.nativeElement.srcObject = null;
    }
  }

  takeSnapshot(videoElem: ElementRef) {
    const video = videoElem.nativeElement;
    // if you'd like to show the canvas add it to the DOM
    const canvas = document.createElement('canvas');

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    this.getCanvasBlob(canvas).then(function (blob) {
      //!!!do something with the image
    
      
      //replace by CanvasPic
      var sourceImageUrl = "http://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg";

      //hier dann Bild übergeben!!!
      //ConfigService.getResponseFromAPI(sourceImageUrl);
      
    });
  }

  private getCanvasBlob(canvas) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        resolve(blob);
      }, 'image/jpeg');
    });
  }

  private logRTCStatus() {
    console.log(`RTC Debug info:
 OS:                   ${this.DetectRTC.osName} ${this.DetectRTC.osVersion}
 browser:              ${this.DetectRTC.browser.fullVersion} ${this.DetectRTC.browser.name}
 is Mobile Device:     ${this.DetectRTC.isMobileDevice}
 has webcam:           ${this.DetectRTC.hasWebcam}
 has permission:       ${this.DetectRTC.isWebsiteHasWebcamPermission}
 getUserMedia Support: ${this.DetectRTC.isGetUserMediaSupported}
 isWebRTC Supported:   ${this.DetectRTC.isWebRTCSupported}
 WebAudio Supported:   ${this.DetectRTC.isAudioContextSupported}`
    );
  }

}
