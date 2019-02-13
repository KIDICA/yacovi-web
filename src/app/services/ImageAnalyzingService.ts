import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ConfigService } from './config.service';
import { stringify } from '@angular/compiler/src/util';

@Injectable({ providedIn: 'root' })
export class ImageAnalyzingService {

    constructor(private configService: ConfigService, private http: HttpClient) {
        http = configService.getHttpClient();
    }

    getResponseFromAPI(blobData) {
        var myReader = new FileReader();
        myReader.onload = function(event){
            console.log(JSON.stringify(myReader.result));
        };
        myReader.readAsText(blobData);





        const uriBase = environment.azure.cognitiveServices.APIurl;
        const sourceImageUrl = 'http://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg';
        const headers = {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': stringify(this.configService.getAzCognitiveServiceKey)
        };

        const httpParams = new HttpParams().set('visualFeatures', 'Categories,Description,Color')
                                       .set('language', 'en').set('details', '');

        return this.http.post(uriBase, {'url': sourceImageUrl}, {
            'headers': new HttpHeaders(headers),
            'params': httpParams
        });
    }
}