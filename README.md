### 使用
```javascript
import Tracker from 'ringo-tracker'

new Tracker({
  requestUrl: "xxxx",
});
```

### options介绍
```typescript
export interface DefaultOptions {
  uuid?: string;
  requestUrl?: string;
  historyTracker: boolean;
  hashTracker: boolean;
  domTracker: boolean;
  sdkVersion: string | number;
  extra?: Record<string, any>;
  jsError: boolean;
}
```
