/**
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带Tracker-key 点击事件上报
 * @sdkVersion sdk版本
 * @extra 透传字段
 * @jsError js和 promise报错异常上报
 */
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

export interface Options extends Partial<DefaultOptions> {
  requestUrl: string;
}

export enum TrackerConfig {
  version = "1.0.0",
}
