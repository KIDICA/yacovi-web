import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ConfigService } from './config.service';
import {
    HTTP_HEADER_AZ_CS_SUBSCRIPTION_API_KEY_NAME, HTTP_HEADER_CONTENT_TYPE_NAME,
    HTTP_HEADER_CONTENT_TYPE_VALUE_APPLICATION_OCTECT_STREAM
} from '@app/core/constants/http.constants';

@Injectable({ providedIn: 'root' })
export class AzureVisionApiService {

    constructor(private configService: ConfigService, private http: HttpClient) {
    }

    detectFaces(blobData) {
        const uriBase = environment.azure.cognitiveServices.apiUrl;
        const headers = {
            [HTTP_HEADER_CONTENT_TYPE_NAME]: [HTTP_HEADER_CONTENT_TYPE_VALUE_APPLICATION_OCTECT_STREAM],
            [HTTP_HEADER_AZ_CS_SUBSCRIPTION_API_KEY_NAME]: this.configService.getAzCognitiveServiceKey()
        };

        const httpParams = new HttpParams()
                            .set('visualFeatures', 'Faces')
                            .set('language', 'en')
                            .set('details', '');

        return this.http.post(uriBase, blobData, {
            'headers': new HttpHeaders(headers),
            'params': httpParams
        });
    }

}
