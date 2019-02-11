﻿import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
    constructor(private http: HttpClient) { }


    getConfig() {
        return this.http.get(`${environment.config.url}`);
    }

    getResponseFromAPI(accessKey: string) {
        var uriBase = "https://westeurope.api.cognitive.microsoft.com/vision/v2.0/analyze";
        var sourceImageUrl = "http://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg";
        var  headers = {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": accessKey
        };

        var httpParams = new HttpParams().set("visualFeatures", "Categories,Description,Color")
                                       .set("language", "en").set("details", "");

        return this.http.post(uriBase, {"url": sourceImageUrl}, {
            "headers": new HttpHeaders(headers),
            "params": httpParams
        });
    }

}