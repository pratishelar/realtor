import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private cloudinaryUrl = `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);

    return this.http.post(this.cloudinaryUrl, formData);
  }

  uploadMultipleImages(files: File[]): Observable<any[]> {
    const uploads: Observable<any>[] = files.map((file) =>
      this.uploadImage(file)
    );
    return new Observable((observer) => {
      Promise.all(uploads.map((upload) => upload.toPromise()))
        .then((results) => {
          console.log('CloudinaryService - All upload results:', results);
          results.forEach((result, index) => {
            console.log(`CloudinaryService - Result ${index}:`, result);
            console.log(`CloudinaryService - Result ${index} secure_url:`, result?.secure_url);
          });
          observer.next(results);
          observer.complete();
        })
        .catch((error) => {
          console.error('CloudinaryService - Error:', error);
          observer.error(error);
        });
    });
  }

  deleteImage(publicId: string): Observable<any> {
    // Note: Deleting images requires server-side API key
    // For frontend-only implementation, deletion is not supported
    // Implement a backend endpoint if you need to delete images
    console.log('Image deletion requires backend implementation');
    return new Observable((observer) => {
      observer.next({});
      observer.complete();
    });
  }
}
