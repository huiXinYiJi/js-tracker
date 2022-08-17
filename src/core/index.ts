import { DefaultOptions, TrackerConfig, Options } from "../types/index";
import { createHistoryEvent } from "../utils/pv";

// 监听的事件列表
const MouseEventList: string[] = [
  "click",
  "dbclick",
  "contextmenu",
  "mousedown",
  "mouseup",
  "mouseenter",
  "mouseout",
  "mouseover",
];

export default class Tracker {
  public data: Options;

  constructor(options: Options) {
    this.data = Object.assign(this.initDef(), options);
    this.installTracker();
  }

  private initDef(): DefaultOptions {
    window.history["pushState"] = createHistoryEvent("pushState");
    window.history["replaceState"] = createHistoryEvent("replaceState");
    return <DefaultOptions>{
      sdkVersion: TrackerConfig.version,
      historyTracker: false,
      hashTracker: false,
      domTracker: false,
      jsError: false,
    };
  }

  public setUserId<T extends DefaultOptions["uuid"]>(uuid: T) {
    this.data.uuid = uuid;
  }

  public setExtra<T extends DefaultOptions["extra"]>(extra: T) {
    this.data.extra = extra;
  }

  //手动上报
  public sendTracker<T>(data: T) {
    this.reportTracker({ data });
  }

  // dom元素监听
  private targetKeyReport() {
    MouseEventList.forEach((ev) => {
      window.addEventListener(ev, (e) => {
        const target = e.target as HTMLElement;
        const targetKey = target.getAttribute("target-key");
        if (targetKey) {
          this.reportTracker({
            event: ev,
            targetKey,
          });
        }
      });
    });
  }

  private captureEvents<T>(
    mouseEventList: string[],
    targetKey: string,
    data?: T
  ) {
    mouseEventList.forEach((event) => {
      window.addEventListener(event, () => {
        console.log("监听到了", event);
        // 自动上报
        this.reportTracker({
          event,
          targetKey,
          data,
        });
      });
    });
  }

  // 注册tracker
  private installTracker() {
    if (this.data.historyTracker) {
      this.captureEvents(
        ["pushState", "replaceState", "popstate"],
        "history-pv"
      );
    }
    if (this.data.hashTracker) {
      this.captureEvents(["hashchange"], "hash-pv");
    }
    if (this.data.domTracker) {
      this.targetKeyReport();
    }
    if (this.data.jsError) {
      this.jsError();
    }
  }

  private jsError() {
    this.errorEvent();
    this.promiseReject();
  }

  // js 代码报错
  private errorEvent() {
    window.addEventListener("error", (event) => {
      this.reportTracker({
        event: "error",
        targetKey: "message",
        message: event.message,
      });
    });
  }

  // promise报错
  private promiseReject() {
    window.addEventListener("unhandledrejection", (event) => {
      event.promise.catch((error) => {
        this.reportTracker({
          event: "promise",
          targetKey: "message",
          message: error,
        });
      });
    });
  }

  // 上报
  private reportTracker<T>(data: T) {
    const params = Object.assign(this.data, data, {
      time: new Date().getTime(),
    });
    const headers = {
      type: "application/x-www-form-urlencoded",
    };
    let blob = new Blob([JSON.stringify(params)], headers);
    navigator.sendBeacon(this.data.requestUrl, blob);
  }
}
