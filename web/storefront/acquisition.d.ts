export type Acquisition = { source: string; medium: string; campaign: string; content: string; code: string; capturedAt?: number };
export function directAttribution(): Acquisition;
export function captureAttribution(input: { url: string; referrer?: string; storage?: Pick<Storage, 'getItem' | 'setItem'>; now?: number }): Acquisition;
export function currentAttribution(): Acquisition;
export function attributedLink(href: string, attribution?: Acquisition): string;
