﻿import {ElementRef, Injectable} from '@angular/core';

import { environment } from '@environments/environment';
import { YacoviAlertService } from '@app/core/modules/yacovi-alert/yacovi-alert.service';
import { ConfigService } from './config.service';
import { AzureVisionApiService } from '@app/services/azureVisionApi.service';


@Injectable({providedIn: 'root'})
export class RTCService {

  private DetectRTC: any = window['DetectRTC'];

  constructor(  private configService: ConfigService,
                private imageAnalyzing: AzureVisionApiService,
                private alertService: YacoviAlertService) {

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

    // TODO move to better place
    this.polyFillToBlob();
  }

  private polyFillToBlob() {

    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function (callback, type, quality) {
          const canvas = this;
          setTimeout(function() {
            const binStr = atob( canvas.toDataURL(type, quality).split(',')[1] );
            const arr = new Uint8Array(binStr.length);
            for (let i = 0; i < binStr.length; i++ ) {
               arr[i] = binStr.charCodeAt(i);
            }
            callback( new Blob( [arr], {type: type || 'image/png'} ) );
          });
        }
     });
   }
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

  takeSnapshot(videoElem: ElementRef, canvasElem: ElementRef): Promise<{}> {

    const video = videoElem.nativeElement;
    canvasElem.nativeElement.width = video.videoWidth;
    canvasElem.nativeElement.height = video.videoHeight;

    const canvas = canvasElem.nativeElement.getContext('2d');
    canvas.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    return this.getCanvasBlob(canvasElem.nativeElement);
  }

  private getCanvasBlob(canvas: HTMLCanvasElement) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        resolve(blob);
      }, 'image/png');
    });
  }

  private logRTCStatus() {
    console.log(
      `RTC Debug info:
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
