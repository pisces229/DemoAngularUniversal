import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title, makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  // 建立 cache server 狀態的 key
  private readonly key = makeStateKey('AppComponent');

  title = 'AppComponent';
  count = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: string,
    private metaTagService: Meta,
    private pageTitle: Title,
    private transferState: TransferState,
    private httpClient: HttpClient) {
    console.log(`AppComponent constructor PLATFORM_ID:${this.platformId}`);
    this.pageTitle.setTitle('Title-Me');
    this.metaTagService.addTags([
      { name: 'keyword', content: 'Meta-Me-keyword' },
    ]);
    this.title += `(${platformId})`;
    this.count++;
  }

  ngOnInit(): void {
    console.log(`AppComponent ngOnInit PLATFORM_ID:${this.platformId}`);
    // setTimeout(() => {
    //   this.count++;
    // }, 10000);
    this.getValue().subscribe(
      value => {
        console.log(`AppComponent [${isPlatformServer(this.platformId)}]`);
        console.log(`AppComponent [${value}]`)
      });
  }

  ngOnDestroy(): void {
    console.log(`AppComponent ngOnDestroy PLATFORM_ID:${this.platformId}`);
  }

  getValue(): Observable<any> {
    const cacheResult = this.transferState.get<any[]>(this.key, []);
    if (cacheResult.length > 0) {
      // 如果有 cache 資料，則直接回傳 cache 到的資料
      return of(cacheResult)
      .pipe(
        tap(() => console.log('AppComponent value[cache]'))
      );
    } else {
      // 如果沒有 cache 資料，就從 API 抓取
      return this.httpClient.get<any[]>(`${isPlatformServer(this.platformId) ? environment.serverHost : environment.clientHost}assets/posts.json`)
      .pipe(
        tap(() => console.log('AppComponent value[http]')),
        tap((result: any[]) => {
          // 如果是在 server 端產生，則設定資料可以傳遞給 client 端 cache
          if (isPlatformServer(this.platformId)) {
            this.transferState.set<any[]>(this.key, result)
          }
        })
      );
    }
  }

  onClick(): void {
    this.title = '-----TestAngularUniversal-----';
  }

}
