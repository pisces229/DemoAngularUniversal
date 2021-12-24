import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  // 建立 cache server 狀態的 key
  private readonly key = makeStateKey('AboutComponent');

  title = 'AboutComponent';

  constructor(@Inject(PLATFORM_ID) private platformId: string,
    private transferState: TransferState,
    private httpClient: HttpClient) {
    console.log(`AboutComponent constructor PLATFORM_ID:${this.platformId}`);
    this.title += `(${platformId})`;
  }

  ngOnInit(): void {
    this.getValue().subscribe(
      value => {
        console.log(`AboutComponent [${isPlatformServer(this.platformId)}]`);
        console.log(`AboutComponent [${value}]`)
      });
  }

  getValue(): Observable<any> {
    const cacheResult = this.transferState.get<any[]>(this.key, []);
    if (cacheResult.length > 0) {
      // 如果有 cache 資料，則直接回傳 cache 到的資料
      return of(cacheResult)
      .pipe(
        tap(() => console.log('AboutComponent value[cache]'))
      );
    } else {
      // 如果沒有 cache 資料，就從 API 抓取
      return this.httpClient.get<any[]>('http://localhost:4200/assets/posts.json')
      .pipe(
        tap(() => console.log('AboutComponent value[http]')),
        tap((result: any[]) => {
          // 如果是在 server 端產生，則設定資料可以傳遞給 client 端 cache
          if (isPlatformServer(this.platformId)) {
            this.transferState.set<any[]>(this.key, result)
          }
        })
      );
    }
  }

}
