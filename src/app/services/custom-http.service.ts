import { Injectable }  from '@angular/core';
import {
  Headers,
  Http,
  Response,
  Request,
  RequestOptions,
  RequestOptionsArgs,
  ConnectionBackend
} from '@angular/http';
import 'rxjs/Rx';
import { Subject }    from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

/**
 * add custom option item.
 */
export interface CustomRequestOptionsArgs extends RequestOptionsArgs {
  withLoading?: boolean;
}

/**
 * @see https://long2know.com/2017/01/angular2-http-interceptor-and-loading-indicator/
 * @see http://blog.mitsuruog.info/2016/04/way-of-http-interceptpr-in-angular2.html
 */
@Injectable()
export class CustomHttp extends Http {
  /** loading source Subject */
  private loadingSource = new Subject<boolean>();
  /** Observable loading streams */
  public loading$ = this.loadingSource.asObservable();

  private startLoading() {
    this.loadingSource.next(true);
  }

  private completeLoading() {
    this.loadingSource.next(false);
  }

  constructor(
    private backend: ConnectionBackend,
    private defaultOptions: RequestOptions
  ) {
    super(backend, defaultOptions);
  }

  public request(url: string | Request, options?: CustomRequestOptionsArgs): Observable<Response> {
    const reqOptions = this.processOptionArgs(options);
    return this.intercept(super.request(url, reqOptions), reqOptions);
  }

  public get(url: string, options?: CustomRequestOptionsArgs): Observable<Response> {
    const reqOptions = this.processOptionArgs(options);
    return this.intercept(super.get(url, reqOptions), reqOptions);
  }

  public post(url: string, body: any, options?: CustomRequestOptionsArgs): Observable<Response> {
    const reqOptions = this.processOptionArgs(options);
    return this.intercept(super.post(url, body, reqOptions), reqOptions);
  }

  public put(url: string, body: any, options?: CustomRequestOptionsArgs): Observable<Response> {
    const reqOptions = this.processOptionArgs(options);
    return this.intercept(super.put(url, body, reqOptions), reqOptions);
  }

  public delete(url: string, options?: CustomRequestOptionsArgs): Observable<Response> {
    const reqOptions = this.processOptionArgs(options);
    return this.intercept(super.delete(url, reqOptions), reqOptions);
  }

  private processOptionArgs(options?: CustomRequestOptionsArgs): CustomRequestOptionsArgs {
    const processed = options || new RequestOptions();
    processed.withCredentials = true;
    processed.headers = processed.headers || new Headers({'Content-Type': 'application/json'});
    return processed;
  }

  /**
   * TODO: doc comment
   */
  private intercept(observable: Observable<Response>, options: CustomRequestOptionsArgs): Observable<Response> {
    const before   = options.withLoading ? () => this.startLoading()    : () => {};
    const complete = options.withLoading ? () => this.completeLoading() : () => {};

    before();
    const intercepted = observable.catch(
      (err) => this.handleError(err)
    ).finally(
      () => complete()
    );
    return intercepted;
  }

  private handleError(res: Response) {
    return Observable.throw(res);
  }

}
