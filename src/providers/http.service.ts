import { Injectable } from '@angular/core';
import { Events, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http, Response, Headers, RequestOptionsArgs } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { CommonServices } from "./common.service";
import { Observable } from "rxjs/Rx";
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class HttpService {
    loading: any;
    pendingRequests: number = 0;
    interval_time: number = 30;
    offline_message: string;
    safeImage: any;
    constructor(
        public events: Events,
        public storage: Storage,
        private _http: Http,
        public toastCtrl: ToastController,
        private commonService: CommonServices,
        private loadingCtrl: LoadingController,
        private sanitizer: DomSanitizer
    ) {
        this.offline_message = "You are OFFLINE. Please check your network connection!";
    }

    get(url: string, options?: RequestOptionsArgs): Observable<any> {
        if (navigator.onLine) {
            if (this.pendingRequests < 1) {
                this.startLoading();
            }
            this.pendingRequests++;
            options = this.prepareOptions(options);
            return Observable.create((observer) => {
                this._http.get(this.commonService.getApiServiceUrl() + url, options)
                    .map(response => <Response>response)
                    .subscribe((res) => {
                        this.pendingRequests--;
                        if (this.pendingRequests === 0) {
                            this.loading.dismiss().catch(() => { });
                        }
                        observer.next(res);
                    }, (error) => {
                        this.pendingRequests--;
                        if (this.pendingRequests <= 0) {
                            this.loading.dismiss().catch(() => { });
                        }
                        observer.error(error)
                    },
                        () => {
                            observer.complete()
                        });
            });
        }
        else {
            this.commonService.onMessageHandler(this.offline_message, 0);
            return Observable.throw('offline');
        }
    }
    getOffline(url: string, options?: RequestOptionsArgs): Observable<any> {
        if (navigator.onLine) {
            options = this.prepareOptions(options);
            return Observable.create((observer) => {
                this._http.get(this.commonService.getApiServiceUrl() + url, options)
                    .map(response => <Response>response)
                    .subscribe((res) => {
                        observer.next(res);
                    }, (error) => {
                        observer.error(error)
                    },
                        () => {
                            observer.complete()
                        });
            });
        }
        else {
            this.commonService.onMessageHandler(this.offline_message, 0);
            return Observable.throw('offline');
        }
    }
    postOffline(url: string, model: any, options?: RequestOptionsArgs): Observable<any> {
        if (navigator.onLine) {
            let body = model;
            options = this.prepareOptions(options);
            if (url == "token") {
                return Observable.create((observer) => {
                    this._http.post(this.commonService.getApiServiceUrl() + url, body, options)
                        .map(response => <Response>response)
                        .subscribe((res) => {
                            observer.next(res);
                        }, (error) => {
                            observer.error(error)
                        },
                            () => {
                                observer.complete()
                            });
                });
            }
            else {
                return Observable.create((observer) => {
                    this._http.post(this.commonService.getApiServiceUrl() + url, body, options)
                        .map(response => <Response>response)
                        .subscribe((res) => {
                            observer.next(res);
                        }, (error) => {
                            observer.error(error)
                        },
                            () => {
                                observer.complete()
                            });
                });
            }
        }
        else {
            this.commonService.onMessageHandler(this.offline_message, 0);
            return Observable.throw('Failed');
        }
    }
    post(url: string, model: any, options?: RequestOptionsArgs): Observable<any> {
        if (navigator.onLine) {
            if (this.pendingRequests < 1) {
                this.startLoading();
            }
            this.pendingRequests++;
            let body = model;
            options = this.prepareOptions(options);
            if (url == "token") {
                return Observable.create((observer) => {
                    this._http.post(this.commonService.getApiServiceUrl() + url, body, options)
                        .map(response => <Response>response)
                        .subscribe((res) => {
                            this.pendingRequests--;
                            if (this.pendingRequests === 0) {
                                this.loading.dismiss().catch(() => { });
                            }
                            observer.next(res);
                        }, (error) => {
                            observer.error(error)
                            this.pendingRequests--;
                            if (this.pendingRequests <= 0) {
                                this.loading.dismiss().catch(() => { });
                            }
                        },
                            () => {
                                observer.complete()
                            });
                });
            }
            else {
                return Observable.create((observer) => {
                    this._http.post(this.commonService.getApiServiceUrl() + url, body, options)
                        .map(response => <Response>response)
                        .subscribe((res) => {
                            this.pendingRequests--;
                            if (this.pendingRequests === 0) {
                                this.loading.dismiss().catch(() => { });
                            }
                            observer.next(res);
                        }, (error) => {
                            this.pendingRequests--;
                            if (this.pendingRequests <= 0) {
                                this.loading.dismiss().catch(() => { });
                            }
                            observer.error(error)
                        },
                            () => {
                                observer.complete()
                            });
                });
            }
        }
        else {
            this.commonService.onMessageHandler(this.offline_message, 0);
            return Observable.throw('Failed');
        }
    }
    put(url: string, model: any, options?: RequestOptionsArgs): Observable<any> {
        if (navigator.onLine) {
            let body = JSON.stringify(model);
            options = this.prepareOptions(options);
            return Observable.create((observer) => {
                this._http.put(this.commonService.getApiServiceUrl() + url, body, options)
                    .map(response => <Response>response)
                    .subscribe((res) => {
                        observer.next(res);
                    }, (error) => {
                        observer.error(error)
                    },
                        () => {
                            observer.complete()
                        });
            });
        }
        else {
            this.commonService.onMessageHandler(this.offline_message, 0);
            return Observable.throw('Failed');
        }
    }
    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        if (navigator.onLine) {
            options = this.prepareOptions(options);
            return Observable.create((observer) => {
                this._http.delete(this.commonService.getApiServiceUrl() + url, options)
                    .map(response => <Response>response)
                    .subscribe((res) => {
                        observer.next(res);
                    }, (error) => {
                        observer.error(error)
                    },
                        () => {
                            observer.complete()
                        });
            });
        }
        else {
            this.commonService.onMessageHandler(this.offline_message, 0);
            return Observable.throw('Failed');
        }

    }
    public handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
    private prepareOptions(options: RequestOptionsArgs): RequestOptionsArgs {
        let token = localStorage.getItem('user_auth_token');
        options = options || {};
        if (!options.headers) {
            options.headers = new Headers();
        }
        if (token) {
            options.headers.append('Authorization', 'Bearer ' + token);
        }
        //options.headers.append('setSSLCertMode','nocheck');
        options.headers.append('Access-Control-Allow-Origin', '*');
        options.headers.append('Content-Type', 'application/json');
        options.headers.append('Accept', 'application/json');
        return options;
    }
    startLoading() {
        let imgContent = '<div class="spinner1"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';
        this.safeImage = this.sanitizer.bypassSecurityTrustHtml(imgContent);
        this.loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: this.safeImage,
        });
        this.loading.present();
    }
}
