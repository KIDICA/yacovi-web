import { Injectable } from '@angular/core';
import { stringify } from '@angular/compiler/src/util';

@Injectable({ providedIn: 'root' })
export class BlobToBase64 {

    // confer https://stackoverflow.com/questions/18650168/convert-blob-to-base64
    makebaseString(valueblob) { // problem: valueblob seems to be unreferenced
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result;
        };

        return reader.readAsDataURL(valueblob);
    }
}
