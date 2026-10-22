import type { Acquisition } from './acquisition.js';
export const MEASUREMENT_ID: string;
export const ANALYTICS_VERSION: string;
export type AnalyticsContext = { enabled: boolean; version: string; clientId?: string; sessionId?: string; gaSessionId?: number; firstSeenAtMs?: number; firstAttribution?: Acquisition; sessionAttribution?: Acquisition; attribution?: Acquisition };
export function safeParams(input?: Record<string,unknown>): Record<string,string|number>;
export function safePage(href:string):string;
export function nextIdentity(previous:unknown,input:{now:number;uuid:()=>string;attribution:Acquisition}):any;
export function analyticsPreference():boolean|null;
export function analyticsAllowed():boolean;
export function analyticsContext(options?:{active?:boolean}):AnalyticsContext;
export function trackWeb(name:string,params?:Record<string,unknown>,eventId?:string):void;
export function setAnalyticsAllowed(enabled:boolean):void;
export function onAnalyticsPreference(fn:(enabled:boolean)=>void|Promise<void>):void;
export function setEventTransport(fn:(row:{id:string;name:string;params:Record<string,string|number|boolean>;at:number;context?:AnalyticsContext})=>Promise<{disposition?:string}>):void;
export function queueStudioEvent(name:string,params:Record<string,string|number|boolean>,eventId?:string):void;
export function initAnalytics(options?:{enabled?:boolean}):void;

export function ownerBrowserId(): string | null;
export function prepareOwnerBrowser(): string;
