import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ConfigService } from './config.service';
import { stringify } from '@angular/compiler/src/util';
import { BlobToBase64 } from './BlobToBase64';

@Injectable({ providedIn: 'root' })
export class ImageAnalyzingService {

    constructor(private configService: ConfigService, private http: HttpClient, private blobtobase64: BlobToBase64) {
        http = configService.getHttpClient();
    }

    getResponseFromAPI(blobData) {
        console.log(blobData);

        // create base64 value and send it to Azure API
        const base64 = this.blobtobase64.makebaseString(blobData);
        const uriBase = environment.azure.cognitiveServices.APIurl;
        const headers = {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': stringify(this.configService.getAzCognitiveServiceKey)
        };

        const httpParams = new HttpParams().set('visualFeatures', 'Categories,Description,Color')
                                       .set('language', 'en').set('details', '');

        return this.http.post(uriBase, {'url': base64, 'data': 'image/jpeg;base64'}, {
            'headers': new HttpHeaders(headers),
            'params': httpParams
        });
    }
}
