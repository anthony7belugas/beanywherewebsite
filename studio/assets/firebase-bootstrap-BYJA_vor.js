var um=Object.defineProperty;var cm=(r,e,t)=>e in r?um(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var H=(r,e,t)=>cm(r,typeof e!="symbol"?e+"":e,t);import{a as rd,o as lm,v as hm}from"./index-CDJUmkuD.js";const fm=()=>{};var kl={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sd=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let s=r.charCodeAt(n);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(r.charCodeAt(++n)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},dm=function(r){const e=[];let t=0,n=0;for(;t<r.length;){const s=r[t++];if(s<128)e[n++]=String.fromCharCode(s);else if(s>191&&s<224){const i=r[t++];e[n++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=r[t++],o=r[t++],B=r[t++],u=((s&7)<<18|(i&63)<<12|(o&63)<<6|B&63)-65536;e[n++]=String.fromCharCode(55296+(u>>10)),e[n++]=String.fromCharCode(56320+(u&1023))}else{const i=r[t++],o=r[t++];e[n++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},du={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let s=0;s<r.length;s+=3){const i=r[s],o=s+1<r.length,B=o?r[s+1]:0,u=s+2<r.length,c=u?r[s+2]:0,h=i>>2,d=(i&3)<<4|B>>4;let C=(B&15)<<2|c>>6,g=c&63;u||(g=64,o||(C=64)),n.push(t[h],t[d],t[C],t[g])}return n.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(sd(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):dm(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let s=0;s<r.length;){const i=t[r.charAt(s++)],B=s<r.length?t[r.charAt(s)]:0;++s;const c=s<r.length?t[r.charAt(s)]:64;++s;const d=s<r.length?t[r.charAt(s)]:64;if(++s,i==null||B==null||c==null||d==null)throw new Cm;const C=i<<2|B>>4;if(n.push(C),c!==64){const g=B<<4&240|c>>2;if(n.push(g),d!==64){const D=c<<6&192|d;n.push(D)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class Cm extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const pm=function(r){const e=sd(r);return du.encodeByteArray(e,!0)},Fo=function(r){return pm(r).replace(/\./g,"")},id=function(r){try{return du.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function od(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gm=()=>od().__FIREBASE_DEFAULTS__,mm=()=>{if(typeof process>"u"||typeof kl>"u")return;const r=kl.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},Em=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&id(r[1]);return e&&JSON.parse(e)},oa=()=>{try{return fm()||gm()||mm()||Em()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},ad=r=>{var e,t;return(t=(e=oa())==null?void 0:e.emulatorHosts)==null?void 0:t[r]},Cu=r=>{const e=ad(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const n=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),n]:[e.substring(0,t),n]},Bd=()=>{var r;return(r=oa())==null?void 0:r.config},ud=r=>{var e;return(e=oa())==null?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cd(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},n=e||"demo-project",s=r.iat||0,i=r.sub||r.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${n}`,aud:n,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...r};return[Fo(JSON.stringify(t)),Fo(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nt(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function _m(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(nt())}function Dm(){var e;const r=(e=oa())==null?void 0:e.forceEnvironment;if(r==="node")return!0;if(r==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function wm(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function ym(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function Tm(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Im(){const r=nt();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function Am(){return!Dm()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function pu(){try{return typeof indexedDB=="object"}catch{return!1}}function Rm(){return new Promise((r,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(n),r(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)==null?void 0:i.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vm="FirebaseError";class Ut extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=vm,Object.setPrototypeOf(this,Ut.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Bs.prototype.create)}}class Bs{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?bm(i,n):"Error",B=`${this.serviceName}: ${o} (${s}).`;return new Ut(s,B,n)}}function bm(r,e){try{let t=0,n="";for(;t<r.length;){const s=r.indexOf("{$",t);if(s===-1){n+=r.substring(t);break}const i=r.indexOf("}",s+2);if(i===-1){n+=r.substring(t);break}const o=r.substring(s+2,i),B=e[o];n+=r.substring(t,s)+(B!=null?String(B):`<${o}?>`),t=i+1}return n}catch{return r}}function Pm(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function Dr(r,e){if(r===e)return!0;const t=Object.keys(r),n=Object.keys(e);for(const s of t){if(!n.includes(s))return!1;const i=r[s],o=e[s];if(xl(i)&&xl(o)){if(!Dr(i,o))return!1}else if(i!==o)return!1}for(const s of n)if(!t.includes(s))return!1;return!0}function xl(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ai(r){const e=[];for(const[t,n]of Object.entries(r))Array.isArray(n)?n.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function Sm(r,e){const t=new Om(r,e);return t.subscribe.bind(t)}class Om{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let s;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");Nm(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:n},s.next===void 0&&(s.next=aB),s.error===void 0&&(s.error=aB),s.complete===void 0&&(s.complete=aB);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Nm(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function aB(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fm=1e3,Lm=2,km=14400*1e3,xm=.5;function Vm(r,e=Fm,t=Lm){const n=e*Math.pow(t,r),s=Math.round(xm*n*(Math.random()-.5)*2);return Math.min(km,n+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oe(r){return r&&r._delegate?r._delegate:r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function En(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function aa(r){return(await fetch(r,{credentials:"include"})).ok}class Vt{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Br="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mm{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const n=new si;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&n.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),n=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(n)return null;throw s}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Um(e))try{this.getOrInitializeService({instanceIdentifier:Br})}catch{}for(const[t,n]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});n.resolve(i)}catch{}}}}clearInstance(e=Br){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Br){return this.instances.has(e)}getOptions(e=Br){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[i,o]of this.instancesDeferred.entries()){const B=this.normalizeInstanceIdentifier(i);n===B&&o.resolve(s)}return s}onInit(e,t){const n=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(n)??new Set;s.add(e),this.onInitCallbacks.set(n,s);const i=this.instances.get(n);return i&&e(i,n),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const s of n)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:Gm(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=Br){return this.component?this.component.multipleInstances?e:Br:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Gm(r){return r===Br?void 0:r}function Um(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hm{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Mm(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var he;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(he||(he={}));const Jm={debug:he.DEBUG,verbose:he.VERBOSE,info:he.INFO,warn:he.WARN,error:he.ERROR,silent:he.SILENT},jm=he.INFO,qm={[he.DEBUG]:"log",[he.VERBOSE]:"log",[he.INFO]:"info",[he.WARN]:"warn",[he.ERROR]:"error"},Km=(r,e,...t)=>{if(e<r.logLevel)return;const n=new Date().toISOString(),s=qm[e];if(s)console[s](`[${n}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Ba{constructor(e){this.name=e,this._logLevel=jm,this._logHandler=Km,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in he))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Jm[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,he.DEBUG,...e),this._logHandler(this,he.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,he.VERBOSE,...e),this._logHandler(this,he.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,he.INFO,...e),this._logHandler(this,he.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,he.WARN,...e),this._logHandler(this,he.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,he.ERROR,...e),this._logHandler(this,he.ERROR,...e)}}const zm=(r,e)=>e.some(t=>r instanceof t);let Vl,Ml;function Wm(){return Vl||(Vl=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function $m(){return Ml||(Ml=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ld=new WeakMap,VB=new WeakMap,hd=new WeakMap,BB=new WeakMap,gu=new WeakMap;function Qm(r){const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("success",i),r.removeEventListener("error",o)},i=()=>{t(Vn(r.result)),s()},o=()=>{n(r.error),s()};r.addEventListener("success",i),r.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&ld.set(t,r)}).catch(()=>{}),gu.set(e,r),e}function Ym(r){if(VB.has(r))return;const e=new Promise((t,n)=>{const s=()=>{r.removeEventListener("complete",i),r.removeEventListener("error",o),r.removeEventListener("abort",o)},i=()=>{t(),s()},o=()=>{n(r.error||new DOMException("AbortError","AbortError")),s()};r.addEventListener("complete",i),r.addEventListener("error",o),r.addEventListener("abort",o)});VB.set(r,e)}let MB={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return VB.get(r);if(e==="objectStoreNames")return r.objectStoreNames||hd.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Vn(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function Xm(r){MB=r(MB)}function Zm(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=r.call(uB(this),e,...t);return hd.set(n,e.sort?e.sort():[e]),Vn(n)}:$m().includes(r)?function(...e){return r.apply(uB(this),e),Vn(ld.get(this))}:function(...e){return Vn(r.apply(uB(this),e))}}function eE(r){return typeof r=="function"?Zm(r):(r instanceof IDBTransaction&&Ym(r),zm(r,Wm())?new Proxy(r,MB):r)}function Vn(r){if(r instanceof IDBRequest)return Qm(r);if(BB.has(r))return BB.get(r);const e=eE(r);return e!==r&&(BB.set(r,e),gu.set(e,r)),e}const uB=r=>gu.get(r);function tE(r,e,{blocked:t,upgrade:n,blocking:s,terminated:i}={}){const o=indexedDB.open(r,e),B=Vn(o);return n&&o.addEventListener("upgradeneeded",u=>{n(Vn(o.result),u.oldVersion,u.newVersion,Vn(o.transaction),u)}),t&&o.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),B.then(u=>{i&&u.addEventListener("close",()=>i()),s&&u.addEventListener("versionchange",c=>s(c.oldVersion,c.newVersion,c))}).catch(()=>{}),B}const nE=["get","getKey","getAll","getAllKeys","count"],rE=["put","add","delete","clear"],cB=new Map;function Gl(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(cB.get(e))return cB.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,s=rE.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(s||nE.includes(t)))return;const i=async function(o,...B){const u=this.transaction(o,s?"readwrite":"readonly");let c=u.store;return n&&(c=c.index(B.shift())),(await Promise.all([c[t](...B),s&&u.done]))[0]};return cB.set(e,i),i}Xm(r=>({...r,get:(e,t,n)=>Gl(e,t)||r.get(e,t,n),has:(e,t)=>!!Gl(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sE{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(iE(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function iE(r){const e=r.getComponent();return(e==null?void 0:e.type)==="VERSION"}const GB="@firebase/app",Ul="0.16.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dn=new Ba("@firebase/app"),oE="@firebase/app-compat",aE="@firebase/analytics-compat",BE="@firebase/analytics",uE="@firebase/app-check-compat",cE="@firebase/app-check",lE="@firebase/auth",hE="@firebase/auth-compat",fE="@firebase/database",dE="@firebase/data-connect",CE="@firebase/database-compat",pE="@firebase/functions",gE="@firebase/functions-compat",mE="@firebase/installations",EE="@firebase/installations-compat",_E="@firebase/messaging",DE="@firebase/messaging-compat",wE="@firebase/performance",yE="@firebase/performance-compat",TE="@firebase/remote-config",IE="@firebase/remote-config-compat",AE="@firebase/storage",RE="@firebase/storage-compat",vE="@firebase/firestore",bE="@firebase/ai",PE="@firebase/firestore-compat",SE="firebase",OE="12.19.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const UB="[DEFAULT]",NE={[GB]:"fire-core",[oE]:"fire-core-compat",[BE]:"fire-analytics",[aE]:"fire-analytics-compat",[cE]:"fire-app-check",[uE]:"fire-app-check-compat",[lE]:"fire-auth",[hE]:"fire-auth-compat",[fE]:"fire-rtdb",[dE]:"fire-data-connect",[CE]:"fire-rtdb-compat",[pE]:"fire-fn",[gE]:"fire-fn-compat",[mE]:"fire-iid",[EE]:"fire-iid-compat",[_E]:"fire-fcm",[DE]:"fire-fcm-compat",[wE]:"fire-perf",[yE]:"fire-perf-compat",[TE]:"fire-rc",[IE]:"fire-rc-compat",[AE]:"fire-gcs",[RE]:"fire-gcs-compat",[vE]:"fire-fst",[PE]:"fire-fst-compat",[bE]:"fire-vertex","fire-js":"fire-js",[SE]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ii=new Map,FE=new Map,HB=new Map;function Hl(r,e){try{r.container.addComponent(e)}catch(t){dn.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function tn(r){const e=r.name;if(HB.has(e))return dn.debug(`There were multiple attempts to register component ${e}.`),!1;HB.set(e,r);for(const t of ii.values())Hl(t,r);for(const t of FE.values())Hl(t,r);return!0}function vr(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function yt(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const LE={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},on=new Bs("app","Firebase",LE);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kE{constructor(e,t,n){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new Vt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw on.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const br=OE;function fd(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const n={name:UB,automaticDataCollectionEnabled:!0,...e},s=n.name;if(typeof s!="string"||!s)throw on.create("bad-app-name",{appName:String(s)});if(t||(t=Bd()),!t)throw on.create("no-options");const i=ii.get(s);if(i)if(Dr(t,i.options)){if(Dr(n,i.config))return i;throw on.create("duplicate-app",{appName:s,mismatchedParam:"config",oldValue:JSON.stringify(i.config),newValue:JSON.stringify(n)})}else throw on.create("duplicate-app",{appName:s,mismatchedParam:"options",oldValue:JSON.stringify(i.options),newValue:JSON.stringify(t)});const o=new Hm(s);for(const u of HB.values())o.addComponent(u);const B=new kE(t,n,o);return ii.set(s,B),B}function Ri(r=UB){const e=ii.get(r);if(!e&&r===UB&&Bd())return fd();if(!e)throw on.create("no-app",{appName:r});return e}function xE(){return Array.from(ii.values())}function Rt(r,e,t){let n=NE[r]??r;t&&(n+=`-${t}`);const s=n.match(/\s|\//),i=e.match(/\s|\//);if(s||i){const o=[`Unable to register library "${n}" with version "${e}":`];s&&o.push(`library name "${n}" contains illegal characters (whitespace or "/")`),s&&i&&o.push("and"),i&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),dn.warn(o.join(" "));return}tn(new Vt(`${n}-version`,()=>({library:n,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const VE="firebase-heartbeat-database",ME=1,oi="firebase-heartbeat-store";let lB=null;function dd(){return lB||(lB=tE(VE,ME,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(oi)}catch(t){console.warn(t)}}}}).catch(r=>{throw on.create("idb-open",{originalErrorMessage:r.message})})),lB}async function GE(r){try{const t=(await dd()).transaction(oi),n=await t.objectStore(oi).get(Cd(r));return await t.done,n}catch(e){if(e instanceof Ut)dn.warn(e.message);else{const t=on.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});dn.warn(t.message)}}}async function Jl(r,e){try{const n=(await dd()).transaction(oi,"readwrite");await n.objectStore(oi).put(e,Cd(r)),await n.done}catch(t){if(t instanceof Ut)dn.warn(t.message);else{const n=on.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});dn.warn(n.message)}}}function Cd(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const UE=1024,HE=30;class JE{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new qE(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=jl();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>HE){const o=KE(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){dn.warn(n)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=jl(),{heartbeatsToSend:n,unsentEntries:s}=jE(this._heartbeatsCache.heartbeats),i=Fo(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return dn.warn(t),""}}}function jl(){return new Date().toISOString().substring(0,10)}function jE(r,e=UE){const t=[];let n=r.slice();for(const s of r){const i=t.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),ql(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),ql(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class qE{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return pu()?Rm().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await GE(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return Jl(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const n=await this.read();return Jl(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}else return}}function ql(r){return Fo(JSON.stringify({version:2,heartbeats:r})).length}function KE(r){if(r.length===0)return-1;let e=0,t=r[0].date;for(let n=1;n<r.length;n++)r[n].date<t&&(t=r[n].date,e=n);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zE(r){tn(new Vt("platform-logger",e=>new sE(e),"PRIVATE")),tn(new Vt("heartbeat",e=>new JE(e),"PRIVATE")),Rt(GB,Ul,r),Rt(GB,Ul,"esm2020"),Rt("fire-js","")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */zE("");var WE="firebase",$E="12.19.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Rt(WE,$E,"app");function pd(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const QE=pd,gd=new Bs("auth","Firebase",pd());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lo=new Ba("@firebase/auth");function _o(r,...e){Lo.logLevel<=he.WARN&&Lo.warn(`Auth (${br}): ${r}`,...e)}function Do(r,...e){Lo.logLevel<=he.ERROR&&Lo.error(`Auth (${br}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cn(r,...e){throw Eu(r,...e)}function $t(r,...e){return Eu(r,...e)}function mu(r,e,t){const n={...QE(),[e]:t};return new Bs("auth","Firebase",n).create(e,{appName:r.name})}function Mn(r){return mu(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Eu(r,...e){if(typeof r!="string"){const t=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=r.name),r._errorFactory.create(t,...n)}return gd.create(r,...e)}function ie(r,e,...t){if(!r)throw Eu(e,...t)}function an(r){const e="INTERNAL ASSERTION FAILED: "+r;throw Do(e),new Error(e)}function pn(r,e){r||an(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function JB(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.href)||""}function YE(){return Kl()==="http:"||Kl()==="https:"}function Kl(){var r;return typeof self<"u"&&((r=self.location)==null?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function XE(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(YE()||ym()||"connection"in navigator)?navigator.onLine:!0}function ZE(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vi{constructor(e,t){this.shortDelay=e,this.longDelay=t,pn(t>e,"Short delay should be less than long delay!"),this.isMobile=_m()||Tm()}get(){return XE()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _u(r,e){pn(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class md{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;an("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;an("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;an("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const e_={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const t_=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],n_=new vi(3e4,6e4);function ua(r,e){return r.tenantId&&!e.tenantId?{...e,tenantId:r.tenantId}:e}async function us(r,e,t,n,s={}){return Ed(r,s,async()=>{let i={},o={};n&&(e==="GET"?o=n:i={body:JSON.stringify(n)});const B=Ai({...o,key:r.config.apiKey}).slice(1),u=await r._getAdditionalHeaders();u["Content-Type"]="application/json",r.languageCode&&(u["X-Firebase-Locale"]=r.languageCode);const c={method:e,headers:u,...i};return wm()||(c.referrerPolicy="strict-origin-when-cross-origin"),r.emulatorConfig&&En(r.emulatorConfig.host)&&(c.credentials="include"),md.fetch()(await Dd(r,r.config.apiHost,t,B),c)})}async function Ed(r,e,t){r._canInitEmulator=!1;const n={...e_,...e};try{const s=new r_(r),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw no(r,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const B=i.ok?o.errorMessage:o.error.message,[u,c]=B.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw no(r,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw no(r,"email-already-in-use",o);if(u==="USER_DISABLED")throw no(r,"user-disabled",o);const h=n[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw mu(r,h,c);Cn(r,h)}}catch(s){if(s instanceof Ut)throw s;Cn(r,"network-request-failed",{message:String(s)})}}async function _d(r,e,t,n,s={}){const i=await us(r,e,t,n,s);return"mfaPendingCredential"in i&&Cn(r,"multi-factor-auth-required",{_serverResponse:i}),i}async function Dd(r,e,t,n){const s=`${e}${t}?${n}`,i=r,o=i.config.emulator?_u(r.config,s):`${r.config.apiScheme}://${s}`;return t_.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(o).toString():o}class r_{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,n)=>{this.timer=setTimeout(()=>n($t(this.auth,"network-request-failed")),n_.get())})}}function no(r,e,t){const n={appName:r.name};t.email&&(n.email=t.email),t.phoneNumber&&(n.phoneNumber=t.phoneNumber);const s=$t(r,e,n);return s.customData._tokenResponse=t,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function s_(r,e){return us(r,"POST","/v1/accounts:delete",e)}async function ko(r,e){return us(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zs(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Du(r,e=!1){const t=Oe(r),n=await t.getIdToken(e),s=wu(n);ie(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:s,token:n,authTime:zs(hB(s.auth_time)),issuedAtTime:zs(hB(s.iat)),expirationTime:zs(hB(s.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function hB(r){return Number(r)*1e3}function wu(r){const[e,t,n]=r.split(".");if(e===void 0||t===void 0||n===void 0)return Do("JWT malformed, contained fewer than 3 sections"),null;try{const s=id(t);return s?JSON.parse(s):(Do("Failed to decode base64 JWT payload"),null)}catch(s){return Do("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function zl(r){const e=wu(r);return ie(e,"internal-error"),ie(typeof e.exp<"u","internal-error"),ie(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ai(r,e,t=!1){if(t)return e;try{return await e}catch(n){throw n instanceof Ut&&i_(n)&&r.auth.currentUser===r&&await r.auth.signOut(),n}}function i_({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class o_{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const n=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,n)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jB{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=zs(this.lastLoginAt),this.creationTime=zs(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xo(r){var d;const e=r.auth,t=await r.getIdToken(),n=await ai(r,ko(e,{idToken:t}));ie(n==null?void 0:n.users.length,e,"internal-error");const s=n.users[0];r._notifyReloadListener(s);const i=(d=s.providerUserInfo)!=null&&d.length?wd(s.providerUserInfo):[],o=B_(r.providerData,i),B=r.isAnonymous,u=!(r.email&&s.passwordHash)&&!(o!=null&&o.length),c=B?u:!1,h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new jB(s.createdAt,s.lastLoginAt),isAnonymous:c};Object.assign(r,h)}async function a_(r){const e=Oe(r);await xo(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function B_(r,e){return[...r.filter(n=>!e.some(s=>s.providerId===n.providerId)),...e]}function wd(r){return r.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function u_(r,e){const t=await Ed(r,{},async()=>{const n=Ai({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=r.config,o=await Dd(r,s,"/v1/token",`key=${i}`),B=await r._getAdditionalHeaders();B["Content-Type"]="application/x-www-form-urlencoded";const u={method:"POST",headers:B,body:n};return r.emulatorConfig&&En(r.emulatorConfig.host)&&(u.credentials="include"),md.fetch()(o,u)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function c_(r,e){return us(r,"POST","/v2/accounts:revokeToken",ua(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){ie(e.idToken,"internal-error"),ie(typeof e.idToken<"u","internal-error"),ie(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):zl(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){ie(e.length!==0,"internal-error");const t=zl(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(ie(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:s,expiresIn:i}=await u_(e,t);this.updateTokensAndExpiration(n,s,Number(i))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,t){const{refreshToken:n,accessToken:s,expirationTime:i}=t,o=new Qr;return n&&(ie(typeof n=="string","internal-error",{appName:e}),o.refreshToken=n),s&&(ie(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(ie(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Qr,this.toJSON())}_performRefresh(){return an("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vn(r,e){ie(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class kt{constructor({uid:e,auth:t,stsTokenManager:n,...s}){this.providerId="firebase",this.proactiveRefresh=new o_(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=n,this.accessToken=n.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new jB(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await ai(this,this.stsTokenManager.getToken(this.auth,e));return ie(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Du(this,e)}reload(){return a_(this)}_assign(e){this!==e&&(ie(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new kt({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){ie(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await xo(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(yt(this.auth.app))return Promise.reject(Mn(this.auth));const e=await this.getIdToken();return await ai(this,s_(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const n=t.displayName??void 0,s=t.email??void 0,i=t.phoneNumber??void 0,o=t.photoURL??void 0,B=t.tenantId??void 0,u=t._redirectEventId??void 0,c=t.createdAt??void 0,h=t.lastLoginAt??void 0,{uid:d,emailVerified:C,isAnonymous:g,providerData:D,stsTokenManager:P}=t;ie(d&&P,e,"internal-error");const N=Qr.fromJSON(this.name,P);ie(typeof d=="string",e,"internal-error"),vn(n,e.name),vn(s,e.name),ie(typeof C=="boolean",e,"internal-error"),ie(typeof g=="boolean",e,"internal-error"),vn(i,e.name),vn(o,e.name),vn(B,e.name),vn(u,e.name),vn(c,e.name),vn(h,e.name);const J=new kt({uid:d,auth:e,email:s,emailVerified:C,displayName:n,isAnonymous:g,photoURL:o,phoneNumber:i,tenantId:B,stsTokenManager:N,createdAt:c,lastLoginAt:h});return D&&Array.isArray(D)&&(J.providerData=D.map(v=>({...v}))),u&&(J._redirectEventId=u),J}static async _fromIdTokenResponse(e,t,n=!1){const s=new Qr;s.updateFromServerResponse(t);const i=new kt({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:n});return await xo(i),i}static async _fromGetAccountInfoResponse(e,t,n){const s=t.users[0];ie(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?wd(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),B=new Qr;B.updateFromIdToken(n);const u=new kt({uid:s.localId,auth:e,stsTokenManager:B,isAnonymous:o}),c={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new jB(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(u,c),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wl=new Map;function Bn(r){pn(r instanceof Function,"Expected a class definition");let e=Wl.get(r);return e?(pn(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,Wl.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yd{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}yd.type="NONE";const $l=yd;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wo(r,e,t){return`firebase:${r}:${e}:${t}`}class Cr{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:s,name:i}=this.auth;this.fullUserKey=wo(this.userKey,s.apiKey,i),this.fullPersistenceKey=wo("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t);try{this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}catch{}}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await ko(this.auth,{idToken:e}).catch(()=>{});return t?kt._fromGetAccountInfoResponse(this.auth,t,e):null}return kt._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){try{this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}catch{}}static async create(e,t,n="authUser"){if(!t.length)return new Cr(Bn($l),e,n);const s=(await Promise.all(t.map(async c=>{try{if(await c._isAvailable())return c}catch{return}}))).filter(c=>c);let i=s[0]||Bn($l);const o=wo(n,e.config.apiKey,e.name);let B=null;for(const c of t)try{const h=await c._get(o);if(h){let d;if(typeof h=="string"){const C=await ko(e,{idToken:h}).catch(()=>{});if(!C)break;d=await kt._fromGetAccountInfoResponse(e,C,h)}else d=kt._fromJSON(e,h);c!==i&&(B=d),i=c;break}}catch{}const u=s.filter(c=>c._shouldAllowMigration);return!i._shouldAllowMigration||!u.length?new Cr(i,e,n):(i=u[0],B&&await i._set(o,B.toJSON()),await Promise.all(t.map(async c=>{if(c!==i)try{await c._remove(o)}catch{}})),new Cr(i,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ql(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Rd(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Td(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(bd(e))return"Blackberry";if(Pd(e))return"Webos";if(Id(e))return"Safari";if((e.includes("chrome/")||Ad(e))&&!e.includes("edge/"))return"Chrome";if(vd(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=r.match(t);if((n==null?void 0:n.length)===2)return n[1]}return"Other"}function Td(r=nt()){return/firefox\//i.test(r)}function Id(r=nt()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ad(r=nt()){return/crios\//i.test(r)}function Rd(r=nt()){return/iemobile/i.test(r)}function vd(r=nt()){return/android/i.test(r)}function bd(r=nt()){return/blackberry/i.test(r)}function Pd(r=nt()){return/webos/i.test(r)}function yu(r=nt()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function l_(r=nt()){var e;return yu(r)&&!!((e=window.navigator)!=null&&e.standalone)}function h_(){return Im()&&document.documentMode===10}function Sd(r=nt()){return yu(r)||vd(r)||Pd(r)||bd(r)||/windows phone/i.test(r)||Rd(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Od(r,e=[]){let t;switch(r){case"Browser":t=Ql(nt());break;case"Worker":t=`${Ql(nt())}-${r}`;break;default:t=r}const n=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${br}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f_{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=i=>new Promise((o,B)=>{try{const u=e(i);o(u)}catch(u){B(u)}});n.onAbort=t,this.queue.push(n);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n==null?void 0:n.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function d_(r,e={}){return us(r,"GET","/v2/passwordPolicy",ua(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const C_=6;class p_{constructor(e){var n;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??C_,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((n=e.allowedNonAlphanumericCharacters)==null?void 0:n.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let n;for(let s=0;s<e.length;s++)n=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class g_{constructor(e,t,n,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Yl(this),this.idTokenSubscription=new Yl(this),this.beforeStateQueue=new f_(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=gd,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Bn(t)),this._initializationPromise=this.queue(async()=>{var n,s,i;if(!this._deleted){try{this.persistenceManager=await Cr.create(this,e)}catch(o){_o(`Failed to initialize persistence: ${o}`),this.persistenceManager=await Cr.create(this,[])}finally{(n=this._resolvePersistenceManagerAvailable)==null||n.call(this)}if(!this._deleted){if((s=this._popupRedirectResolver)!=null&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}try{await this.initializeCurrentUser(t)}catch(o){_o(`Failed to initialize current user: ${o}`),await this.directlySetCurrentUser(null).catch(()=>{})}this.lastNotifiedUid=((i=this.currentUser)==null?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await ko(this,{idToken:e}),n=await kt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var i;if(yt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(B=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(B,B))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let n=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(i=this.redirectUser)==null?void 0:i._redirectEventId,B=n==null?void 0:n._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===B)&&(u!=null&&u.user)&&(n=u.user,s=!0)}if(!n)return this.directlySetCurrentUser(null);if(!n._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(n)}catch(o){n=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return n?this.reloadAndSetCurrentUserOrClear(n):this.directlySetCurrentUser(null)}return ie(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===n._redirectEventId?this.directlySetCurrentUser(n):this.reloadAndSetCurrentUserOrClear(n)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await xo(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=ZE()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(yt(this.app))return Promise.reject(Mn(this));const t=e?Oe(e):null;return t&&ie(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&ie(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return yt(this.app)?Promise.reject(Mn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return yt(this.app)?Promise.reject(Mn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Bn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await d_(this),t=new p_(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Bs("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(n.tenantId=this.tenantId),await c_(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Bn(e)||this._popupRedirectResolver;ie(t,this,"argument-error"),this.redirectPersistenceManager=await Cr.create(this,[Bn(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((n=this.redirectUser)==null?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let o=!1;const B=this._isInitialized?Promise.resolve():this._initializationPromise;if(ie(B,this,"internal-error"),B.then(()=>{o||i(this.currentUser)}).catch(u=>{if(!o)if(typeof t!="function"&&t.error)t.error(u);else if(n)n(u);else throw u}),typeof t=="function"){const u=e.addObserver(t,n,s);return()=>{o=!0,u()}}else{const u=e.addObserver(t);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){if(this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,this.persistenceManager)try{e?await this.persistenceManager.setCurrentUser(e):await this.persistenceManager.removeCurrentUser()}catch(t){const n=(t==null?void 0:t.message)||String(t),s=mu(this,"internal-error",`An internal AuthError has occurred: ${n}`);throw s.customData={originalError:t},s}}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return ie(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Od(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var s;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((s=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const n=await this._getAppCheckToken();return n&&(e["X-Firebase-AppCheck"]=n),e}async _getAppCheckToken(){var t;if(yt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&_o(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function ca(r){return Oe(r)}class Yl{constructor(e){this.auth=e,this.observer=null,this.addObserver=Sm(t=>this.observer=t)}get next(){return ie(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Tu={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function m_(r){Tu=r}function E_(r){return Tu.loadJS(r)}function __(){return Tu.gapiScript}function D_(r){return`__${r}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function w_(r,e){const t=vr(r,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(Dr(i,e??{}))return s;Cn(s,"already-initialized")}return t.initialize({options:e})}function y_(r,e){const t=(e==null?void 0:e.persistence)||[],n=(Array.isArray(t)?t:[t]).map(Bn);e!=null&&e.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(n,e==null?void 0:e.popupRedirectResolver)}function T_(r,e,t){const n=ca(r);ie(/^https?:\/\//.test(e),n,"invalid-emulator-scheme");const s=!1,i=Nd(e),{host:o,port:B}=I_(e),u=B===null?"":`:${B}`,c={url:`${i}//${o}${u}/`},h=Object.freeze({host:o,port:B,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!n._canInitEmulator){ie(n.config.emulator&&n.emulatorConfig,n,"emulator-config-failed"),ie(Dr(c,n.config.emulator)&&Dr(h,n.emulatorConfig),n,"emulator-config-failed");return}n.config.emulator=c,n.emulatorConfig=h,n.settings.appVerificationDisabledForTesting=!0,En(o)?aa(`${i}//${o}${u}`):A_()}function Nd(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function I_(r){const e=Nd(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const n=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(n);if(s){const i=s[1];return{host:i,port:Xl(n.substr(i.length+1))}}else{const[i,o]=n.split(":");return{host:i,port:Xl(o)}}}function Xl(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function A_(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fd{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return an("not implemented")}_getIdTokenResponse(e){return an("not implemented")}_linkToIdToken(e,t){return an("not implemented")}_getReauthenticationResolver(e){return an("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yr(r,e){return _d(r,"POST","/v1/accounts:signInWithIdp",ua(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const R_="http://localhost";class wr extends Fd{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new wr(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Cn("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:s,...i}=t;if(!n||!s)return null;const o=new wr(n,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return Yr(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,Yr(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Yr(e,t)}buildRequest(){const e={requestUri:R_,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Ai(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ld{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bi extends Ld{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pn extends bi{constructor(){super("facebook.com")}static credential(e){return wr._fromParams({providerId:Pn.PROVIDER_ID,signInMethod:Pn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Pn.credentialFromTaggedObject(e)}static credentialFromError(e){return Pn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Pn.credential(e.oauthAccessToken)}catch{return null}}}Pn.FACEBOOK_SIGN_IN_METHOD="facebook.com";Pn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sn extends bi{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return wr._fromParams({providerId:Sn.PROVIDER_ID,signInMethod:Sn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Sn.credentialFromTaggedObject(e)}static credentialFromError(e){return Sn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return Sn.credential(t,n)}catch{return null}}}Sn.GOOGLE_SIGN_IN_METHOD="google.com";Sn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class On extends bi{constructor(){super("github.com")}static credential(e){return wr._fromParams({providerId:On.PROVIDER_ID,signInMethod:On.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return On.credentialFromTaggedObject(e)}static credentialFromError(e){return On.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return On.credential(e.oauthAccessToken)}catch{return null}}}On.GITHUB_SIGN_IN_METHOD="github.com";On.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nn extends bi{constructor(){super("twitter.com")}static credential(e,t){return wr._fromParams({providerId:Nn.PROVIDER_ID,signInMethod:Nn.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Nn.credentialFromTaggedObject(e)}static credentialFromError(e){return Nn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return Nn.credential(t,n)}catch{return null}}}Nn.TWITTER_SIGN_IN_METHOD="twitter.com";Nn.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yr{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,s=!1){const i=await kt._fromIdTokenResponse(e,n,s),o=Zl(n);return new yr({user:i,providerId:o,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const s=Zl(n);return new yr({user:e,providerId:s,_tokenResponse:n,operationType:t})}}function Zl(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vo extends Ut{constructor(e,t,n,s){super(t.code,t.message),this.operationType=n,this.user=s,Object.setPrototypeOf(this,Vo.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,s){return new Vo(e,t,n,s)}}function kd(r,e,t,n){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Vo._fromErrorAndOperation(r,i,e,n):i})}async function v_(r,e,t=!1){const n=await ai(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return yr._forOperation(r,"link",n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function b_(r,e,t=!1){const{auth:n}=r;if(yt(n.app))return Promise.reject(Mn(n));const s="reauthenticate";try{const i=await ai(r,kd(n,s,e,r),t);ie(i.idToken,n,"internal-error");const o=wu(i.idToken);ie(o,n,"internal-error");const{sub:B}=o;return ie(r.uid===B,n,"user-mismatch"),yr._forOperation(r,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&Cn(n,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function P_(r,e,t=!1){if(yt(r.app))return Promise.reject(Mn(r));const n="signIn",s=await kd(r,n,e),i=await yr._fromIdTokenResponse(r,n,s);return t||await r._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function S_(r,e){return _d(r,"POST","/v1/accounts:signInWithCustomToken",ua(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function O_(r,e){if(yt(r.app))return Promise.reject(Mn(r));const t=ca(r),n=await S_(t,{token:e,returnSecureToken:!0}),s=await yr._fromIdTokenResponse(t,"signIn",n);return await t._updateCurrentUser(s.user),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function N_(r,e){return Oe(r).setPersistence(e)}function xd(r,e,t,n){return Oe(r).onIdTokenChanged(e,t,n)}function F_(r,e,t){return Oe(r).beforeAuthStateChanged(e,t)}const Mo="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vd{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Mo,"1"),this.storage.removeItem(Mo),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const L_=1e3,k_=10;class Md extends Vd{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Sd(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),s=this.localCache[t];n!==s&&e(t,s,n)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,B,u)=>{this.notifyListeners(o,u)});return}const n=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const o=this.storage.getItem(n);!t&&this.localCache[n]===o||this.notifyListeners(n,o)},i=this.storage.getItem(n);h_()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,k_):s()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},L_)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Md.type="LOCAL";const x_=Md;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gd extends Vd{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Gd.type="SESSION";const Ud=Gd;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function V_(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class la{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const n=new la(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:s,data:i}=t.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:s});const B=Array.from(o).map(async c=>c(t.origin,i)),u=await V_(B);t.ports[0].postMessage({status:"done",eventId:n,eventType:s,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}la.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Iu(r="",e=10){let t="";for(let n=0;n<e;n++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M_{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((B,u)=>{const c=Iu("",20);s.port1.start();const h=setTimeout(()=>{u(new Error("unsupported_event"))},n);o={messageChannel:s,onMessage(d){const C=d;if(C.data.eventId===c)switch(C.data.status){case"ack":clearTimeout(h),i=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),B(C.data.response);break;default:clearTimeout(h),clearTimeout(i),u(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:c,data:t},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qt(){return window}function G_(r){Qt().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hd(){return typeof Qt().WorkerGlobalScope<"u"&&typeof Qt().importScripts=="function"}async function U_(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function H_(){var r;return((r=navigator==null?void 0:navigator.serviceWorker)==null?void 0:r.controller)||null}function J_(){return Hd()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jd="firebaseLocalStorageDb",j_=1,Go="firebaseLocalStorage",jd="fbase_key";class Pi{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function ha(r,e){return r.transaction([Go],e?"readwrite":"readonly").objectStore(Go)}function q_(){const r=indexedDB.deleteDatabase(Jd);return new Pi(r).toPromise()}function qd(){const r=indexedDB.open(Jd,j_);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const n=r.result;try{n.createObjectStore(Go,{keyPath:jd})}catch(s){t(s)}}),r.addEventListener("success",async()=>{const n=r.result;n.objectStoreNames.contains(Go)?e(n):(n.close(),await q_(),e(await qd()))})})}async function eh(r,e,t){const n=ha(r,!0).put({[jd]:e,value:t});return new Pi(n).toPromise()}async function K_(r,e){const t=ha(r,!1).get(e),n=await new Pi(t).toPromise();return n===void 0?null:n.value}function th(r,e){const t=ha(r,!0).delete(e);return new Pi(t).toPromise()}const z_=800,W_=3;class Kd{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise?this.dbPromise:(this.dbPromise=qd(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{const n=await this._openDb();return await e(n)}catch(n){if(t++>W_)throw n;if(this.dbPromise){const s=this.dbPromise;this.dbPromise=null;try{(await s).close()}catch{}}}}async initializeServiceWorkerMessaging(){return Hd()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=la._getInstance(J_()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,n;if(this.activeServiceWorker=await U_(),!this.activeServiceWorker)return;this.sender=new M_(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(n=e[0])!=null&&n.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||H_()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await eh(e,Mo,"1"),await th(e,Mo)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>eh(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(n=>K_(n,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>th(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{const e=await this._withRetries(s=>{const i=ha(s,!1).getAll();return new Pi(i).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],n=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)n.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!n.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}catch(e){return this.isClosing||_o(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const s of Array.from(n))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),z_)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}Kd.type="LOCAL";const zd=Kd;new vi(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $_(r,e){return e?Bn(e):(ie(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Au extends Fd{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Yr(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Yr(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Yr(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Q_(r){return P_(r.auth,new Au(r),r.bypassAuthState)}function Y_(r){const{auth:e,user:t}=r;return ie(t,e,"internal-error"),b_(t,new Au(r),r.bypassAuthState)}async function X_(r){const{auth:e,user:t}=r;return ie(t,e,"internal-error"),v_(t,new Au(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wd{constructor(e,t,n,s,i=!1){this.auth=e,this.resolver=n,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:s,tenantId:i,error:o,type:B}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:t,sessionId:n,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(B)(u))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Q_;case"linkViaPopup":case"linkViaRedirect":return X_;case"reauthViaPopup":case"reauthViaRedirect":return Y_;default:Cn(this.auth,"internal-error")}}resolve(e){pn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){pn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Z_=new vi(2e3,1e4);class Wr extends Wd{constructor(e,t,n,s,i){super(e,t,s,i),this.provider=n,this.authWindow=null,this.pollId=null,Wr.currentPopupAction&&Wr.currentPopupAction.cancel(),Wr.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return ie(e,this.auth,"internal-error"),e}async onExecution(){pn(this.filter.length===1,"Popup operations only handle one event");const e=Iu();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject($t(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject($t(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Wr.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;if((n=(t=this.authWindow)==null?void 0:t.window)!=null&&n.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject($t(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Z_.get())};e()}}Wr.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eD="pendingRedirect",yo=new Map;class tD extends Wd{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=yo.get(this.auth._key());if(!e){try{const n=await nD(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(n)}catch(t){e=()=>Promise.reject(t)}yo.set(this.auth._key(),e)}return this.bypassAuthState||yo.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function nD(r,e){const t=iD(e),n=sD(r);if(!await n._isAvailable())return!1;const s=await n._get(t)==="true";return await n._remove(t),s}function rD(r,e){yo.set(r._key(),e)}function sD(r){return Bn(r._redirectPersistence)}function iD(r){return wo(eD,r.config.apiKey,r.name)}async function oD(r,e,t=!1){if(yt(r.app))return Promise.reject(Mn(r));const n=ca(r),s=$_(n,e),o=await new tD(n,s,t).execute();return o&&!t&&(delete o.user._redirectEventId,await n._persistUserIfCurrent(o.user),await n._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aD=600*1e3;class BD{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!uD(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!$d(e)){const s=((n=e.error.code)==null?void 0:n.split("auth/")[1])||"internal-error";t.onError($t(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=aD&&this.cachedEventUids.clear(),this.cachedEventUids.has(nh(e))}saveEventToCache(e){this.cachedEventUids.add(nh(e)),this.lastProcessedEventTime=Date.now()}}function nh(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function $d({type:r,error:e}){return r==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function uD(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return $d(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cD(r,e={}){return us(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lD=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,hD=/^https?/;async function fD(r){if(r.config.emulator)return;const{authorizedDomains:e}=await cD(r);for(const t of e)try{if(dD(t))return}catch{}Cn(r,"unauthorized-domain")}function dD(r){const e=JB(),{protocol:t,hostname:n}=new URL(e);if(r.startsWith("chrome-extension://")){const o=new URL(r);return o.hostname===""&&n===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===n}if(!hD.test(t))return!1;if(lD.test(r))return n===r;const s=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const CD=new vi(3e4,6e4);function rh(){const r=Qt().___jsl;if(r!=null&&r.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function pD(r){return new Promise((e,t)=>{var s,i,o;function n(){rh(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{rh(),t($t(r,"network-request-failed"))},timeout:CD.get()})}if((i=(s=Qt().gapi)==null?void 0:s.iframes)!=null&&i.Iframe)e(gapi.iframes.getContext());else if((o=Qt().gapi)!=null&&o.load)n();else{const B=D_("iframefcb");return Qt()[B]=()=>{gapi.load?n():t($t(r,"network-request-failed"))},E_(`${__()}?onload=${B}`).catch(u=>t(u))}}).catch(e=>{throw To=null,e})}let To=null;function gD(r){return To=To||pD(r),To}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mD=new vi(5e3,15e3),ED="__/auth/iframe",_D="emulator/auth/iframe",DD={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},wD=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function yD(r){const e=r.config;ie(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?_u(e,_D):`https://${r.config.authDomain}/${ED}`,n={apiKey:e.apiKey,appName:r.name,v:br},s=wD.get(r.config.apiHost);s&&(n.eid=s);const i=r._getFrameworks();return i.length&&(n.fw=i.join(",")),`${t}?${Ai(n).slice(1)}`}async function TD(r){const e=await gD(r),t=Qt().gapi;return ie(t,r,"internal-error"),e.open({where:document.body,url:yD(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:DD,dontclear:!0},n=>new Promise(async(s,i)=>{await n.restyle({setHideOnLeave:!1});const o=$t(r,"network-request-failed"),B=Qt().setTimeout(()=>{i(o)},mD.get());function u(){Qt().clearTimeout(B),s(n)}n.ping(u).then(u,()=>{i(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ID={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},AD=500,RD=600,vD="_blank",bD="http://localhost";class sh{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function PD(r,e,t,n=AD,s=RD){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-n)/2,0).toString();let B="";const u={...ID,width:n.toString(),height:s.toString(),top:i,left:o},c=nt().toLowerCase();t&&(B=Ad(c)?vD:t),Td(c)&&(e=e||bD,u.scrollbars="yes");const h=Object.entries(u).reduce((C,[g,D])=>`${C}${g}=${D},`,"");if(l_(c)&&B!=="_self")return SD(e||"",B),new sh(null);const d=window.open(e||"",B,h);ie(d,r,"popup-blocked");try{d.focus()}catch{}return new sh(d)}function SD(r,e){const t=document.createElement("a");t.href=r,t.target=e;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OD="__/auth/handler",ND="emulator/auth/handler",FD=encodeURIComponent("fac");async function ih(r,e,t,n,s,i){ie(r.config.authDomain,r,"auth-domain-config-required"),ie(r.config.apiKey,r,"invalid-api-key");const o={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:n,v:br,eventId:s};if(e instanceof Ld){e.setDefaultLanguage(r.languageCode),o.providerId=e.providerId||"",Pm(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[h,d]of Object.entries({}))o[h]=d}if(e instanceof bi){const h=e.getScopes().filter(d=>d!=="");h.length>0&&(o.scopes=h.join(","))}r.tenantId&&(o.tid=r.tenantId);const B=o;for(const h of Object.keys(B))B[h]===void 0&&delete B[h];const u=await r._getAppCheckToken(),c=u?`#${FD}=${encodeURIComponent(u)}`:"";return`${LD(r)}?${Ai(B).slice(1)}${c}`}function LD({config:r}){return r.emulator?_u(r,ND):`https://${r.authDomain}/${OD}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fB="webStorageSupport";class kD{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Ud,this._completeRedirectFn=oD,this._overrideRedirectResult=rD}async _openPopup(e,t,n,s){var o;pn((o=this.eventManagers[e._key()])==null?void 0:o.manager,"_initialize() not called before _openPopup()");const i=await ih(e,t,n,JB(),s);return PD(e,i,Iu())}async _openRedirect(e,t,n,s){await this._originValidation(e);const i=await ih(e,t,n,JB(),s);return G_(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(pn(i,"If manager is not set, promise should be"),i)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await TD(e),n=new BD(e);return t.register("authEvent",s=>(ie(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:n.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(fB,{type:fB},s=>{var o;const i=(o=s==null?void 0:s[0])==null?void 0:o[fB];i!==void 0&&t(!!i),Cn(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=fD(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Sd()||Id()||yu()}}const xD=kD;var oh="@firebase/auth",ah="1.13.6";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VD{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(n=>{e((n==null?void 0:n.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){ie(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function MD(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function GD(r){tn(new Vt("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:B}=n.options;ie(o&&!o.includes(":"),"invalid-api-key",{appName:n.name});const u={apiKey:o,authDomain:B,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Od(r)},c=new g_(n,s,i,u);return y_(c,t),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),tn(new Vt("auth-internal",e=>{const t=ca(e.getProvider("auth").getImmediate());return(n=>new VD(n))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Rt(oh,ah,MD(r)),Rt(oh,ah,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const UD=300,HD=ud("authIdTokenMaxAge")||UD;let Bh=null;const JD=r=>async e=>{const t=e&&await e.getIdTokenResult(),n=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>HD)return;const s=t==null?void 0:t.token;Bh!==s&&(Bh=s,await fetch(r,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function jD(r=Ri()){const e=vr(r,"auth");if(e.isInitialized())return e.getImmediate();const t=w_(r,{popupRedirectResolver:xD,persistence:[zd,x_,Ud]}),n=ud("authTokenSyncURL");if(n&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(n,location.origin);if(location.origin===i.origin){const o=JD(i.toString());F_(t,o,()=>o(t.currentUser)),xd(t,B=>o(B))}}const s=ad("auth");return s&&T_(t,`http://${s}`),t}function qD(){var r;return((r=document.getElementsByTagName("head"))==null?void 0:r[0])??document}m_({loadJS(r){return new Promise((e,t)=>{const n=document.createElement("script");n.setAttribute("src",r),n.onload=e,n.onerror=s=>{const i=$t("internal-error");i.customData=s,t(i)},n.type="text/javascript",n.charset="UTF-8",qD().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});GD("Browser");/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qB=new Map,Qd={activated:!1,tokenObservers:[]},KD={initialized:!1,enabled:!1};function Ke(r){return qB.get(r)||{...Qd}}function zD(r,e){return qB.set(r,e),qB.get(r)}function fa(){return KD}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yd="https://content-firebaseappcheck.googleapis.com/v1",WD="exchangeRecaptchaEnterpriseToken",$D="exchangeDebugToken",uh={RETRIAL_MIN_WAIT:30*1e3,RETRIAL_MAX_WAIT:960*1e3},QD=1440*60*1e3;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YD{constructor(e,t,n,s,i){if(this.operation=e,this.retryPolicy=t,this.getWaitDuration=n,this.lowerBound=s,this.upperBound=i,this.pending=null,this.nextErrorWaitInterval=s,s>i)throw new Error("Proactive refresh lower bound greater than upper bound!")}start(){this.nextErrorWaitInterval=this.lowerBound,this.process(!0).catch(()=>{})}stop(){this.pending&&(this.pending.reject("cancelled"),this.pending=null)}isRunning(){return!!this.pending}async process(e){this.stop();try{this.pending=new si,this.pending.promise.catch(t=>{}),await XD(this.getNextRun(e)),this.pending.resolve(),await this.pending.promise,this.pending=new si,this.pending.promise.catch(t=>{}),await this.operation(),this.pending.resolve(),await this.pending.promise,this.process(!0).catch(()=>{})}catch(t){this.retryPolicy(t)?this.process(!1).catch(()=>{}):this.stop()}}getNextRun(e){if(e)return this.nextErrorWaitInterval=this.lowerBound,this.getWaitDuration();{const t=this.nextErrorWaitInterval;return this.nextErrorWaitInterval*=2,this.nextErrorWaitInterval>this.upperBound&&(this.nextErrorWaitInterval=this.upperBound),t}}}function XD(r){return new Promise(e=>{setTimeout(e,r)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZD={"already-initialized":"You have already called initializeAppCheck() for FirebaseApp {$appName} with different options. To avoid this error, call initializeAppCheck() with the same options as when it was originally called. This will return the already initialized instance.","use-before-activation":"App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. Call initializeAppCheck() before instantiating other Firebase services.","fetch-network-error":"Fetch failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.","fetch-parse-error":"Fetch client could not parse response. Original error: {$originalErrorMessage}.","fetch-status-error":"Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.","storage-open":"Error thrown when opening storage. Original error: {$originalErrorMessage}.","storage-get":"Error thrown when reading from storage. Original error: {$originalErrorMessage}.","storage-set":"Error thrown when writing to storage. Original error: {$originalErrorMessage}.","recaptcha-error":"ReCAPTCHA error.","initial-throttle":"{$httpStatus} error. Attempts allowed again after {$time}",throttled:"Requests throttled due to previous {$httpStatus} error. Attempts allowed again after {$time}"},ft=new Bs("appCheck","AppCheck",ZD);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ch(r=!1){var e;return r?(e=self.grecaptcha)==null?void 0:e.enterprise:self.grecaptcha}function Ru(r){if(!Ke(r).activated)throw ft.create("use-before-activation",{appName:r.name})}function Xd(r){const e=Math.round(r/1e3),t=Math.floor(e/(3600*24)),n=Math.floor((e-t*3600*24)/3600),s=Math.floor((e-t*3600*24-n*3600)/60),i=e-t*3600*24-n*3600-s*60;let o="";return t&&(o+=ro(t)+"d:"),n&&(o+=ro(n)+"h:"),o+=ro(s)+"m:"+ro(i)+"s",o}function ro(r){return r===0?"00":r>=10?r.toString():"0"+r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vu({url:r,body:e},t){const n={"Content-Type":"application/json"},s=t.getImmediate({optional:!0});if(s){const d=await s.getHeartbeatsHeader();d&&(n["X-Firebase-Client"]=d)}const i={method:"POST",body:JSON.stringify(e),headers:n};let o;try{o=await fetch(r,i)}catch(d){throw ft.create("fetch-network-error",{originalErrorMessage:d==null?void 0:d.message})}if(o.status!==200)throw ft.create("fetch-status-error",{httpStatus:o.status});let B;try{B=await o.json()}catch(d){throw ft.create("fetch-parse-error",{originalErrorMessage:d==null?void 0:d.message})}const u=B.ttl.match(/^([\d.]+)(s)$/);if(!u||!u[2]||isNaN(Number(u[1])))throw ft.create("fetch-parse-error",{originalErrorMessage:`ttl field (timeToLive) is not in standard Protobuf Duration format: ${B.ttl}`});const c=Number(u[1])*1e3,h=Date.now();return{token:B.token,expireTimeMillis:h+c,issuedAtTimeMillis:h}}function ew(r,e){const{projectId:t,appId:n,apiKey:s}=r.options;return{url:`${Yd}/projects/${t}/apps/${n}:${WD}?key=${s}`,body:{recaptcha_enterprise_token:e}}}function Zd(r,e){const{projectId:t,appId:n,apiKey:s}=r.options;return{url:`${Yd}/projects/${t}/apps/${n}:${$D}?key=${s}`,body:{debug_token:e}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tw="firebase-app-check-database",nw=1,Bi="firebase-app-check-store",eC="debug-token";let so=null;function tC(){return so||(so=new Promise((r,e)=>{try{const t=indexedDB.open(tw,nw);t.onsuccess=n=>{r(n.target.result)},t.onerror=n=>{var s;e(ft.create("storage-open",{originalErrorMessage:(s=n.target.error)==null?void 0:s.message}))},t.onupgradeneeded=n=>{const s=n.target.result;switch(n.oldVersion){case 0:s.createObjectStore(Bi,{keyPath:"compositeKey"})}}}catch(t){e(ft.create("storage-open",{originalErrorMessage:t==null?void 0:t.message}))}}),so)}function rw(r){return rC(sC(r))}function sw(r,e){return nC(sC(r),e)}function iw(r){return nC(eC,r)}function ow(){return rC(eC)}async function nC(r,e){const n=(await tC()).transaction(Bi,"readwrite"),i=n.objectStore(Bi).put({compositeKey:r,value:e});return new Promise((o,B)=>{i.onsuccess=u=>{o()},n.onerror=u=>{var c;B(ft.create("storage-set",{originalErrorMessage:(c=u.target.error)==null?void 0:c.message}))}})}async function rC(r){const t=(await tC()).transaction(Bi,"readonly"),s=t.objectStore(Bi).get(r);return new Promise((i,o)=>{s.onsuccess=B=>{const u=B.target.result;i(u?u.value:void 0)},t.onerror=B=>{var u;o(ft.create("storage-get",{originalErrorMessage:(u=B.target.error)==null?void 0:u.message}))}})}function sC(r){return`${r.options.appId}-${r.name}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kn=new Ba("@firebase/app-check");/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function aw(r){if(pu()){let e;try{e=await rw(r)}catch(t){kn.warn(`Failed to read token from IndexedDB. Error: ${t}`)}return e}}function dB(r,e){return pu()?sw(r,e).catch(t=>{kn.warn(`Failed to write token to IndexedDB. Error: ${t}`)}):Promise.resolve()}async function Bw(r){let e;try{e=await ow()}catch{}if(e)return e;{const t=crypto.randomUUID();let n=`To use this token for app debugging, register it with your project.

Firebase App Check debug token: ${t}

`;const s=r==null?void 0:r.options.appId,i=r==null?void 0:r.options.projectId;return i&&s?n+=`You can do so in the Firebase Console:
https://console.firebase.google.com/project/${i}/appcheck/apps?selectedAppId=${s}

Or using the Firebase CLI:
firebase appcheck:debugtokens:create ${t} --project ${i} --app ${s}

`:n+=`You will need to add it to your app's App Check settings in the Firebase Console for it to work.

`,n+=`Note: To keep your project secure, please revoke and delete this token using the
Firebase Console or the CLI (\`firebase appcheck:debugtokens:delete\`) when you finish debugging.

Warning: This debug token is a secret and should not be shared or uploaded to source code.

Debug Token Guide: https://firebase.google.com/docs/app-check/web/debug-provider
Firebase CLI install instructions: https://firebase.google.com/docs/cli
`,console.log(n),iw(t).catch(o=>kn.warn(`Failed to persist debug token to IndexedDB. Error: ${o}`)),t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bu(){return fa().enabled}async function Pu(){const r=fa();if(r.enabled&&r.token)return r.token.promise;throw Error(`
            Can't get debug token in production mode.
        `)}function uw(r){const e=od(),t=fa();if(t.initialized=!0,typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN!="string"&&e.FIREBASE_APPCHECK_DEBUG_TOKEN!==!0)return;t.enabled=!0;const n=new si;t.token=n,typeof e.FIREBASE_APPCHECK_DEBUG_TOKEN=="string"?n.resolve(e.FIREBASE_APPCHECK_DEBUG_TOKEN):n.resolve(Bw(r))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cw={error:"UNKNOWN_ERROR"};function lw(r){return du.encodeString(JSON.stringify(r),!1)}async function Uo(r,e=!1,t=!1){const n=r.app;Ru(n);const s=Ke(n);let i=s.token,o;if(i&&!$r(i)&&(s.token=void 0,i=void 0),!i){const c=await s.cachedTokenPromise;c&&($r(c)?i=c:await dB(n,void 0))}if(!e&&i&&$r(i))return{token:i.token};let B=!1;if(bu())try{const c=await Pu();s.exchangeTokenPromise||(s.exchangeTokenPromise=vu(Zd(n,c),r.heartbeatServiceProvider).finally(()=>{s.exchangeTokenPromise=void 0}),B=!0);const h=await s.exchangeTokenPromise;return await dB(n,h),s.token=h,{token:h.token}}catch(c){return c.code==="appCheck/throttled"||c.code==="appCheck/initial-throttle"?kn.warn(c.message):t&&kn.error(c),CB(c)}try{s.exchangeTokenPromise||(s.exchangeTokenPromise=s.provider.getToken().finally(()=>{s.exchangeTokenPromise=void 0}),B=!0),i=await Ke(n).exchangeTokenPromise}catch(c){c.code==="appCheck/throttled"||c.code==="appCheck/initial-throttle"?kn.warn(c.message):t&&kn.error(c),o=c}let u;return i?o?$r(i)?u={token:i.token,internalError:o}:u=CB(o):(u={token:i.token},s.token=i,await dB(n,i)):u=CB(o),B&&aC(n,u),u}async function hw(r){const e=r.app;Ru(e);const{provider:t}=Ke(e);if(bu()){const n=await Pu(),s=Zd(e,n);s.body.limited_use=!0;const{token:i}=await vu(s,r.heartbeatServiceProvider);return{token:i}}else{const{token:n}=await t.getToken(!0);return{token:n}}}function iC(r,e,t,n){const{app:s}=r,i=Ke(s),o={next:t,error:n,type:e};if(i.tokenObservers=[...i.tokenObservers,o],i.token&&$r(i.token)){const B=i.token;Promise.resolve().then(()=>{t({token:B.token}),lh(r)}).catch(()=>{})}i.cachedTokenPromise.then(()=>lh(r))}function oC(r,e){const t=Ke(r),n=t.tokenObservers.filter(s=>s.next!==e);n.length===0&&t.tokenRefresher&&t.tokenRefresher.isRunning()&&t.tokenRefresher.stop(),t.tokenObservers=n}function lh(r){const{app:e}=r,t=Ke(e);let n=t.tokenRefresher;n||(n=fw(r),t.tokenRefresher=n),!n.isRunning()&&t.isTokenAutoRefreshEnabled&&n.start()}function fw(r){const{app:e}=r;return new YD(async()=>{const t=Ke(e);let n;if(t.token?n=await Uo(r,!0):n=await Uo(r),n.error)throw n.error;if(n.internalError)throw n.internalError},()=>!0,()=>{const t=Ke(e);if(t.token){let n=t.token.issuedAtTimeMillis+(t.token.expireTimeMillis-t.token.issuedAtTimeMillis)*.5+3e5;const s=t.token.expireTimeMillis-300*1e3;return n=Math.min(n,s),Math.max(0,n-Date.now())}else return 0},uh.RETRIAL_MIN_WAIT,uh.RETRIAL_MAX_WAIT)}function aC(r,e){const t=Ke(r).tokenObservers;for(const n of t)try{n.type==="EXTERNAL"&&e.error!=null?n.error(e.error):n.next(e)}catch{}}function $r(r){return r.expireTimeMillis-Date.now()>0}function CB(r){return{token:lw(cw),error:r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dw{constructor(e,t){this.app=e,this.heartbeatServiceProvider=t}_delete(){const{tokenObservers:e}=Ke(this.app);for(const t of e)oC(this.app,t.next);return Promise.resolve()}}function Cw(r,e){return new dw(r,e)}function pw(r){return{getToken:e=>Uo(r,e),getLimitedUseToken:()=>hw(r),addTokenListener:e=>iC(r,"INTERNAL",e),removeTokenListener:e=>oC(r.app,e)}}const gw="@firebase/app-check",mw="0.13.1",Ew="https://www.google.com/recaptcha/enterprise.js";function _w(r,e){const t=new si,n=Ke(r);n.reCAPTCHAState={initialized:t};const s=Dw(r),i=ch(!0);return i?hh(r,e,i,s,t):Tw(()=>{const o=ch(!0);if(!o)throw new Error("no recaptcha");hh(r,e,o,s,t)}),t.promise}function hh(r,e,t,n,s){t.ready(()=>{yw(r,e,t,n),s.resolve(t)})}function Dw(r){const e=`fire_app_check_${r.name}`,t=document.createElement("div");return t.id=e,t.style.display="none",document.body.appendChild(t),e}async function ww(r){Ru(r);const t=await Ke(r).reCAPTCHAState.initialized.promise;return new Promise((n,s)=>{const i=Ke(r).reCAPTCHAState;t.ready(()=>{n(t.execute(i.widgetId,{action:"fire_app_check"}))})})}function yw(r,e,t,n){const s=t.render(n,{sitekey:e,size:"invisible",callback:()=>{Ke(r).reCAPTCHAState.succeeded=!0},"error-callback":()=>{Ke(r).reCAPTCHAState.succeeded=!1}}),i=Ke(r);i.reCAPTCHAState={...i.reCAPTCHAState,widgetId:s}}function Tw(r){const e=document.createElement("script");e.src=Ew+"?render=explicit",e.onload=r,document.head.appendChild(e)}class Su{constructor(e){this._siteKey=e,this._throttleData=null}async getToken(e=!1){var s,i,o;Aw(this._throttleData);const t=await ww(this._app).catch(B=>{throw ft.create("recaptcha-error")});if(!((s=Ke(this._app).reCAPTCHAState)!=null&&s.succeeded))throw ft.create("recaptcha-error");let n;try{const B=ew(this._app,t);e&&(B.body.limited_use=!0),n=await vu(B,this._heartbeatServiceProvider)}catch(B){throw(i=B.code)!=null&&i.includes("fetch-status-error")?(this._throttleData=Iw(Number((o=B.customData)==null?void 0:o.httpStatus),this._throttleData),ft.create("initial-throttle",{time:Xd(this._throttleData.allowRequestsAfter-Date.now()),httpStatus:this._throttleData.httpStatus})):B}return this._throttleData=null,n}initialize(e){this._app=e,this._heartbeatServiceProvider=vr(e,"heartbeat"),_w(e,this._siteKey).catch(()=>{})}isEqual(e){return e instanceof Su?this._siteKey===e._siteKey:!1}}function Iw(r,e){if(r===404||r===403)return{backoffCount:1,allowRequestsAfter:Date.now()+QD,httpStatus:r};{const t=e?e.backoffCount:0,n=Vm(t,1e3,2);return{backoffCount:t+1,allowRequestsAfter:Date.now()+n,httpStatus:r}}}function Aw(r){if(r&&Date.now()-r.allowRequestsAfter<=0)throw ft.create("throttled",{time:Xd(r.allowRequestsAfter-Date.now()),httpStatus:r.httpStatus})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rw(r=Ri(),e){var s;r=Oe(r);const t=vr(r,"app-check");if(fa().initialized||uw(r),bu()&&Pu().then(i=>{console.log(`Firebase App Check debug token: ${i}`)}),t.isInitialized()){const i=t.getImmediate(),o=t.getOptions();if(o&&!!o.isTokenAutoRefreshEnabled==!!e.isTokenAutoRefreshEnabled&&((s=o.provider)!=null&&s.isEqual(e.provider)))return i;throw ft.create("already-initialized",{appName:r.name})}const n=t.initialize({options:e});return vw(r,e.provider,e.isTokenAutoRefreshEnabled),Ke(r).isTokenAutoRefreshEnabled&&iC(n,"INTERNAL",()=>{}),n}function vw(r,e,t=!1){const n=zD(r,{...Qd});n.activated=!0,n.provider=e,n.cachedTokenPromise=aw(r).then(s=>(s&&$r(s)&&(n.token=s,aC(r,{token:s.token})),s)),n.isTokenAutoRefreshEnabled=t&&r.automaticDataCollectionEnabled,!r.automaticDataCollectionEnabled&&t&&kn.warn("`isTokenAutoRefreshEnabled` is true but `automaticDataCollectionEnabled` was set to false during `initializeApp()`. This blocks automatic token refresh."),n.provider.initialize(r)}async function BC(r,e){const t=await Uo(r,e);if(t.error)throw t.error;if(t.internalError)throw t.internalError;return{token:t.token}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bw="app-check",fh="app-check-internal";function Pw(){tn(new Vt(bw,r=>{const e=r.getProvider("app").getImmediate(),t=r.getProvider("heartbeat");return Cw(e,t)},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((r,e,t)=>{r.getProvider(fh).initialize()})),tn(new Vt(fh,r=>{const e=r.getProvider("app-check").getImmediate();return pw(e)},"PUBLIC").setInstantiationMode("EXPLICIT")),Rt(gw,mw)}Pw();var dh=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Gn,uC;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(w,m){function T(){}T.prototype=m.prototype,w.F=m.prototype,w.prototype=new T,w.prototype.constructor=w,w.D=function(b,R,O){for(var y=Array(arguments.length-2),Re=2;Re<arguments.length;Re++)y[Re-2]=arguments[Re];return m.prototype[R].apply(b,y)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(n,t),n.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(w,m,T){T||(T=0);const b=Array(16);if(typeof m=="string")for(var R=0;R<16;++R)b[R]=m.charCodeAt(T++)|m.charCodeAt(T++)<<8|m.charCodeAt(T++)<<16|m.charCodeAt(T++)<<24;else for(R=0;R<16;++R)b[R]=m[T++]|m[T++]<<8|m[T++]<<16|m[T++]<<24;m=w.g[0],T=w.g[1],R=w.g[2];let O=w.g[3],y;y=m+(O^T&(R^O))+b[0]+3614090360&4294967295,m=T+(y<<7&4294967295|y>>>25),y=O+(R^m&(T^R))+b[1]+3905402710&4294967295,O=m+(y<<12&4294967295|y>>>20),y=R+(T^O&(m^T))+b[2]+606105819&4294967295,R=O+(y<<17&4294967295|y>>>15),y=T+(m^R&(O^m))+b[3]+3250441966&4294967295,T=R+(y<<22&4294967295|y>>>10),y=m+(O^T&(R^O))+b[4]+4118548399&4294967295,m=T+(y<<7&4294967295|y>>>25),y=O+(R^m&(T^R))+b[5]+1200080426&4294967295,O=m+(y<<12&4294967295|y>>>20),y=R+(T^O&(m^T))+b[6]+2821735955&4294967295,R=O+(y<<17&4294967295|y>>>15),y=T+(m^R&(O^m))+b[7]+4249261313&4294967295,T=R+(y<<22&4294967295|y>>>10),y=m+(O^T&(R^O))+b[8]+1770035416&4294967295,m=T+(y<<7&4294967295|y>>>25),y=O+(R^m&(T^R))+b[9]+2336552879&4294967295,O=m+(y<<12&4294967295|y>>>20),y=R+(T^O&(m^T))+b[10]+4294925233&4294967295,R=O+(y<<17&4294967295|y>>>15),y=T+(m^R&(O^m))+b[11]+2304563134&4294967295,T=R+(y<<22&4294967295|y>>>10),y=m+(O^T&(R^O))+b[12]+1804603682&4294967295,m=T+(y<<7&4294967295|y>>>25),y=O+(R^m&(T^R))+b[13]+4254626195&4294967295,O=m+(y<<12&4294967295|y>>>20),y=R+(T^O&(m^T))+b[14]+2792965006&4294967295,R=O+(y<<17&4294967295|y>>>15),y=T+(m^R&(O^m))+b[15]+1236535329&4294967295,T=R+(y<<22&4294967295|y>>>10),y=m+(R^O&(T^R))+b[1]+4129170786&4294967295,m=T+(y<<5&4294967295|y>>>27),y=O+(T^R&(m^T))+b[6]+3225465664&4294967295,O=m+(y<<9&4294967295|y>>>23),y=R+(m^T&(O^m))+b[11]+643717713&4294967295,R=O+(y<<14&4294967295|y>>>18),y=T+(O^m&(R^O))+b[0]+3921069994&4294967295,T=R+(y<<20&4294967295|y>>>12),y=m+(R^O&(T^R))+b[5]+3593408605&4294967295,m=T+(y<<5&4294967295|y>>>27),y=O+(T^R&(m^T))+b[10]+38016083&4294967295,O=m+(y<<9&4294967295|y>>>23),y=R+(m^T&(O^m))+b[15]+3634488961&4294967295,R=O+(y<<14&4294967295|y>>>18),y=T+(O^m&(R^O))+b[4]+3889429448&4294967295,T=R+(y<<20&4294967295|y>>>12),y=m+(R^O&(T^R))+b[9]+568446438&4294967295,m=T+(y<<5&4294967295|y>>>27),y=O+(T^R&(m^T))+b[14]+3275163606&4294967295,O=m+(y<<9&4294967295|y>>>23),y=R+(m^T&(O^m))+b[3]+4107603335&4294967295,R=O+(y<<14&4294967295|y>>>18),y=T+(O^m&(R^O))+b[8]+1163531501&4294967295,T=R+(y<<20&4294967295|y>>>12),y=m+(R^O&(T^R))+b[13]+2850285829&4294967295,m=T+(y<<5&4294967295|y>>>27),y=O+(T^R&(m^T))+b[2]+4243563512&4294967295,O=m+(y<<9&4294967295|y>>>23),y=R+(m^T&(O^m))+b[7]+1735328473&4294967295,R=O+(y<<14&4294967295|y>>>18),y=T+(O^m&(R^O))+b[12]+2368359562&4294967295,T=R+(y<<20&4294967295|y>>>12),y=m+(T^R^O)+b[5]+4294588738&4294967295,m=T+(y<<4&4294967295|y>>>28),y=O+(m^T^R)+b[8]+2272392833&4294967295,O=m+(y<<11&4294967295|y>>>21),y=R+(O^m^T)+b[11]+1839030562&4294967295,R=O+(y<<16&4294967295|y>>>16),y=T+(R^O^m)+b[14]+4259657740&4294967295,T=R+(y<<23&4294967295|y>>>9),y=m+(T^R^O)+b[1]+2763975236&4294967295,m=T+(y<<4&4294967295|y>>>28),y=O+(m^T^R)+b[4]+1272893353&4294967295,O=m+(y<<11&4294967295|y>>>21),y=R+(O^m^T)+b[7]+4139469664&4294967295,R=O+(y<<16&4294967295|y>>>16),y=T+(R^O^m)+b[10]+3200236656&4294967295,T=R+(y<<23&4294967295|y>>>9),y=m+(T^R^O)+b[13]+681279174&4294967295,m=T+(y<<4&4294967295|y>>>28),y=O+(m^T^R)+b[0]+3936430074&4294967295,O=m+(y<<11&4294967295|y>>>21),y=R+(O^m^T)+b[3]+3572445317&4294967295,R=O+(y<<16&4294967295|y>>>16),y=T+(R^O^m)+b[6]+76029189&4294967295,T=R+(y<<23&4294967295|y>>>9),y=m+(T^R^O)+b[9]+3654602809&4294967295,m=T+(y<<4&4294967295|y>>>28),y=O+(m^T^R)+b[12]+3873151461&4294967295,O=m+(y<<11&4294967295|y>>>21),y=R+(O^m^T)+b[15]+530742520&4294967295,R=O+(y<<16&4294967295|y>>>16),y=T+(R^O^m)+b[2]+3299628645&4294967295,T=R+(y<<23&4294967295|y>>>9),y=m+(R^(T|~O))+b[0]+4096336452&4294967295,m=T+(y<<6&4294967295|y>>>26),y=O+(T^(m|~R))+b[7]+1126891415&4294967295,O=m+(y<<10&4294967295|y>>>22),y=R+(m^(O|~T))+b[14]+2878612391&4294967295,R=O+(y<<15&4294967295|y>>>17),y=T+(O^(R|~m))+b[5]+4237533241&4294967295,T=R+(y<<21&4294967295|y>>>11),y=m+(R^(T|~O))+b[12]+1700485571&4294967295,m=T+(y<<6&4294967295|y>>>26),y=O+(T^(m|~R))+b[3]+2399980690&4294967295,O=m+(y<<10&4294967295|y>>>22),y=R+(m^(O|~T))+b[10]+4293915773&4294967295,R=O+(y<<15&4294967295|y>>>17),y=T+(O^(R|~m))+b[1]+2240044497&4294967295,T=R+(y<<21&4294967295|y>>>11),y=m+(R^(T|~O))+b[8]+1873313359&4294967295,m=T+(y<<6&4294967295|y>>>26),y=O+(T^(m|~R))+b[15]+4264355552&4294967295,O=m+(y<<10&4294967295|y>>>22),y=R+(m^(O|~T))+b[6]+2734768916&4294967295,R=O+(y<<15&4294967295|y>>>17),y=T+(O^(R|~m))+b[13]+1309151649&4294967295,T=R+(y<<21&4294967295|y>>>11),y=m+(R^(T|~O))+b[4]+4149444226&4294967295,m=T+(y<<6&4294967295|y>>>26),y=O+(T^(m|~R))+b[11]+3174756917&4294967295,O=m+(y<<10&4294967295|y>>>22),y=R+(m^(O|~T))+b[2]+718787259&4294967295,R=O+(y<<15&4294967295|y>>>17),y=T+(O^(R|~m))+b[9]+3951481745&4294967295,w.g[0]=w.g[0]+m&4294967295,w.g[1]=w.g[1]+(R+(y<<21&4294967295|y>>>11))&4294967295,w.g[2]=w.g[2]+R&4294967295,w.g[3]=w.g[3]+O&4294967295}n.prototype.v=function(w,m){m===void 0&&(m=w.length);const T=m-this.blockSize,b=this.C;let R=this.h,O=0;for(;O<m;){if(R==0)for(;O<=T;)s(this,w,O),O+=this.blockSize;if(typeof w=="string"){for(;O<m;)if(b[R++]=w.charCodeAt(O++),R==this.blockSize){s(this,b),R=0;break}}else for(;O<m;)if(b[R++]=w[O++],R==this.blockSize){s(this,b),R=0;break}}this.h=R,this.o+=m},n.prototype.A=function(){var w=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);w[0]=128;for(var m=1;m<w.length-8;++m)w[m]=0;m=this.o*8;for(var T=w.length-8;T<w.length;++T)w[T]=m&255,m/=256;for(this.v(w),w=Array(16),m=0,T=0;T<4;++T)for(let b=0;b<32;b+=8)w[m++]=this.g[T]>>>b&255;return w};function i(w,m){var T=B;return Object.prototype.hasOwnProperty.call(T,w)?T[w]:T[w]=m(w)}function o(w,m){this.h=m;const T=[];let b=!0;for(let R=w.length-1;R>=0;R--){const O=w[R]|0;b&&O==m||(T[R]=O,b=!1)}this.g=T}var B={};function u(w){return-128<=w&&w<128?i(w,function(m){return new o([m|0],m<0?-1:0)}):new o([w|0],w<0?-1:0)}function c(w){if(isNaN(w)||!isFinite(w))return d;if(w<0)return N(c(-w));const m=[];let T=1;for(let b=0;w>=T;b++)m[b]=w/T|0,T*=4294967296;return new o(m,0)}function h(w,m){if(w.length==0)throw Error("number format error: empty string");if(m=m||10,m<2||36<m)throw Error("radix out of range: "+m);if(w.charAt(0)=="-")return N(h(w.substring(1),m));if(w.indexOf("-")>=0)throw Error('number format error: interior "-" character');const T=c(Math.pow(m,8));let b=d;for(let O=0;O<w.length;O+=8){var R=Math.min(8,w.length-O);const y=parseInt(w.substring(O,O+R),m);R<8?(R=c(Math.pow(m,R)),b=b.j(R).add(c(y))):(b=b.j(T),b=b.add(c(y)))}return b}var d=u(0),C=u(1),g=u(16777216);r=o.prototype,r.m=function(){if(P(this))return-N(this).m();let w=0,m=1;for(let T=0;T<this.g.length;T++){const b=this.i(T);w+=(b>=0?b:4294967296+b)*m,m*=4294967296}return w},r.toString=function(w){if(w=w||10,w<2||36<w)throw Error("radix out of range: "+w);if(D(this))return"0";if(P(this))return"-"+N(this).toString(w);const m=c(Math.pow(w,6));var T=this;let b="";for(;;){const R=K(T,m).g;T=J(T,R.j(m));let O=((T.g.length>0?T.g[0]:T.h)>>>0).toString(w);if(T=R,D(T))return O+b;for(;O.length<6;)O="0"+O;b=O+b}},r.i=function(w){return w<0?0:w<this.g.length?this.g[w]:this.h};function D(w){if(w.h!=0)return!1;for(let m=0;m<w.g.length;m++)if(w.g[m]!=0)return!1;return!0}function P(w){return w.h==-1}r.l=function(w){return w=J(this,w),P(w)?-1:D(w)?0:1};function N(w){const m=w.g.length,T=[];for(let b=0;b<m;b++)T[b]=~w.g[b];return new o(T,~w.h).add(C)}r.abs=function(){return P(this)?N(this):this},r.add=function(w){const m=Math.max(this.g.length,w.g.length),T=[];let b=0;for(let R=0;R<=m;R++){let O=b+(this.i(R)&65535)+(w.i(R)&65535),y=(O>>>16)+(this.i(R)>>>16)+(w.i(R)>>>16);b=y>>>16,O&=65535,y&=65535,T[R]=y<<16|O}return new o(T,T[T.length-1]&-2147483648?-1:0)};function J(w,m){return w.add(N(m))}r.j=function(w){if(D(this)||D(w))return d;if(P(this))return P(w)?N(this).j(N(w)):N(N(this).j(w));if(P(w))return N(this.j(N(w)));if(this.l(g)<0&&w.l(g)<0)return c(this.m()*w.m());const m=this.g.length+w.g.length,T=[];for(var b=0;b<2*m;b++)T[b]=0;for(b=0;b<this.g.length;b++)for(let R=0;R<w.g.length;R++){const O=this.i(b)>>>16,y=this.i(b)&65535,Re=w.i(R)>>>16,Ht=w.i(R)&65535;T[2*b+2*R]+=y*Ht,v(T,2*b+2*R),T[2*b+2*R+1]+=O*Ht,v(T,2*b+2*R+1),T[2*b+2*R+1]+=y*Re,v(T,2*b+2*R+1),T[2*b+2*R+2]+=O*Re,v(T,2*b+2*R+2)}for(w=0;w<m;w++)T[w]=T[2*w+1]<<16|T[2*w];for(w=m;w<2*m;w++)T[w]=0;return new o(T,0)};function v(w,m){for(;(w[m]&65535)!=w[m];)w[m+1]+=w[m]>>>16,w[m]&=65535,m++}function M(w,m){this.g=w,this.h=m}function K(w,m){if(D(m))throw Error("division by zero");if(D(w))return new M(d,d);if(P(w))return m=K(N(w),m),new M(N(m.g),N(m.h));if(P(m))return m=K(w,N(m)),new M(N(m.g),m.h);if(w.g.length>30){if(P(w)||P(m))throw Error("slowDivide_ only works with positive integers.");for(var T=C,b=m;b.l(w)<=0;)T=Z(T),b=Z(b);var R=Q(T,1),O=Q(b,1);for(b=Q(b,2),T=Q(T,2);!D(b);){var y=O.add(b);y.l(w)<=0&&(R=R.add(T),O=y),b=Q(b,1),T=Q(T,1)}return m=J(w,R.j(m)),new M(R,m)}for(R=d;w.l(m)>=0;){for(T=Math.max(1,Math.floor(w.m()/m.m())),b=Math.ceil(Math.log(T)/Math.LN2),b=b<=48?1:Math.pow(2,b-48),O=c(T),y=O.j(m);P(y)||y.l(w)>0;)T-=b,O=c(T),y=O.j(m);D(O)&&(O=C),R=R.add(O),w=J(w,y)}return new M(R,w)}r.B=function(w){return K(this,w).h},r.and=function(w){const m=Math.max(this.g.length,w.g.length),T=[];for(let b=0;b<m;b++)T[b]=this.i(b)&w.i(b);return new o(T,this.h&w.h)},r.or=function(w){const m=Math.max(this.g.length,w.g.length),T=[];for(let b=0;b<m;b++)T[b]=this.i(b)|w.i(b);return new o(T,this.h|w.h)},r.xor=function(w){const m=Math.max(this.g.length,w.g.length),T=[];for(let b=0;b<m;b++)T[b]=this.i(b)^w.i(b);return new o(T,this.h^w.h)};function Z(w){const m=w.g.length+1,T=[];for(let b=0;b<m;b++)T[b]=w.i(b)<<1|w.i(b-1)>>>31;return new o(T,w.h)}function Q(w,m){const T=m>>5;m%=32;const b=w.g.length-T,R=[];for(let O=0;O<b;O++)R[O]=m>0?w.i(O+T)>>>m|w.i(O+T+1)<<32-m:w.i(O+T);return new o(R,w.h)}n.prototype.digest=n.prototype.A,n.prototype.reset=n.prototype.u,n.prototype.update=n.prototype.v,uC=n,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=c,o.fromString=h,Gn=o}).apply(typeof dh<"u"?dh:typeof self<"u"?self:typeof window<"u"?window:{});var io=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var cC,Hs,lC,Io,KB,hC,fC,dC;(function(){var r,e=Object.defineProperty;function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof io=="object"&&io];for(var l=0;l<a.length;++l){var f=a[l];if(f&&f.Math==Math)return f}throw Error("Cannot find global object")}var n=t(this);function s(a,l){if(l)e:{var f=n;a=a.split(".");for(var p=0;p<a.length-1;p++){var S=a[p];if(!(S in f))break e;f=f[S]}a=a[a.length-1],p=f[a],l=l(p),l!=p&&l!=null&&e(f,a,{configurable:!0,writable:!0,value:l})}}s("Symbol.dispose",function(a){return a||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(a){return a||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(a){return a||function(l){var f=[],p;for(p in l)Object.prototype.hasOwnProperty.call(l,p)&&f.push([p,l[p]]);return f}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},o=this||self;function B(a){var l=typeof a;return l=="object"&&a!=null||l=="function"}function u(a,l,f){return a.call.apply(a.bind,arguments)}function c(a,l,f){return c=u,c.apply(null,arguments)}function h(a,l){var f=Array.prototype.slice.call(arguments,1);return function(){var p=f.slice();return p.push.apply(p,arguments),a.apply(this,p)}}function d(a,l){function f(){}f.prototype=l.prototype,a.Z=l.prototype,a.prototype=new f,a.prototype.constructor=a,a.Ob=function(p,S,F){for(var z=Array(arguments.length-2),Be=2;Be<arguments.length;Be++)z[Be-2]=arguments[Be];return l.prototype[S].apply(p,z)}}var C=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?a=>a&&AsyncContext.Snapshot.wrap(a):a=>a;function g(a){const l=a.length;if(l>0){const f=Array(l);for(let p=0;p<l;p++)f[p]=a[p];return f}return[]}function D(a,l){for(let p=1;p<arguments.length;p++){const S=arguments[p];var f=typeof S;if(f=f!="object"?f:S?Array.isArray(S)?"array":f:"null",f=="array"||f=="object"&&typeof S.length=="number"){f=a.length||0;const F=S.length||0;a.length=f+F;for(let z=0;z<F;z++)a[f+z]=S[z]}else a.push(S)}}class P{constructor(l,f){this.i=l,this.j=f,this.h=0,this.g=null}get(){let l;return this.h>0?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function N(a){o.setTimeout(()=>{throw a},0)}function J(){var a=w;let l=null;return a.g&&(l=a.g,a.g=a.g.next,a.g||(a.h=null),l.next=null),l}class v{constructor(){this.h=this.g=null}add(l,f){const p=M.get();p.set(l,f),this.h?this.h.next=p:this.g=p,this.h=p}}var M=new P(()=>new K,a=>a.reset());class K{constructor(){this.next=this.g=this.h=null}set(l,f){this.h=l,this.g=f,this.next=null}reset(){this.next=this.g=this.h=null}}let Z,Q=!1,w=new v,m=()=>{const a=Promise.resolve(void 0);Z=()=>{a.then(T)}};function T(){for(var a;a=J();){try{a.h.call(a.g)}catch(f){N(f)}var l=M;l.j(a),l.h<100&&(l.h++,a.next=l.g,l.g=a)}Q=!1}function b(){this.u=this.u,this.C=this.C}b.prototype.u=!1,b.prototype.dispose=function(){this.u||(this.u=!0,this.N())},b.prototype[Symbol.dispose]=function(){this.dispose()},b.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function R(a,l){this.type=a,this.g=this.target=l,this.defaultPrevented=!1}R.prototype.h=function(){this.defaultPrevented=!0};var O=(function(){if(!o.addEventListener||!Object.defineProperty)return!1;var a=!1,l=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const f=()=>{};o.addEventListener("test",f,l),o.removeEventListener("test",f,l)}catch{}return a})();function y(a){return/^[\s\xa0]*$/.test(a)}function Re(a,l){R.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a&&this.init(a,l)}d(Re,R),Re.prototype.init=function(a,l){const f=this.type=a.type,p=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement,this.g=l,l=a.relatedTarget,l||(f=="mouseover"?l=a.fromElement:f=="mouseout"&&(l=a.toElement)),this.relatedTarget=l,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=a.pointerType,this.state=a.state,this.i=a,a.defaultPrevented&&Re.Z.h.call(this)},Re.prototype.h=function(){Re.Z.h.call(this);const a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var Ht="closure_listenable_"+(Math.random()*1e6|0),Hi=0;function Lr(a,l,f,p,S){this.listener=a,this.proxy=null,this.src=l,this.type=f,this.capture=!!p,this.ha=S,this.key=++Hi,this.da=this.fa=!1}function me(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function we(a,l,f){for(const p in a)l.call(f,a[p],p,a)}function Dn(a,l){for(const f in a)l.call(void 0,a[f],f,a)}function sn(a){const l={};for(const f in a)l[f]=a[f];return l}const er="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Ji(a,l){let f,p;for(let S=1;S<arguments.length;S++){p=arguments[S];for(f in p)a[f]=p[f];for(let F=0;F<er.length;F++)f=er[F],Object.prototype.hasOwnProperty.call(p,f)&&(a[f]=p[f])}}function tr(a){this.src=a,this.g={},this.h=0}tr.prototype.add=function(a,l,f,p,S){const F=a.toString();a=this.g[F],a||(a=this.g[F]=[],this.h++);const z=Va(a,l,p,S);return z>-1?(l=a[z],f||(l.fa=!1)):(l=new Lr(l,this.src,F,!!p,S),l.fa=f,a.push(l)),l};function xa(a,l){const f=l.type;if(f in a.g){var p=a.g[f],S=Array.prototype.indexOf.call(p,l,void 0),F;(F=S>=0)&&Array.prototype.splice.call(p,S,1),F&&(me(l),a.g[f].length==0&&(delete a.g[f],a.h--))}}function Va(a,l,f,p){for(let S=0;S<a.length;++S){const F=a[S];if(!F.da&&F.listener==l&&F.capture==!!f&&F.ha==p)return S}return-1}var Ma="closure_lm_"+(Math.random()*1e6|0),Ga={};function Vc(a,l,f,p,S){if(Array.isArray(l)){for(let F=0;F<l.length;F++)Vc(a,l[F],f,p,S);return null}return f=Uc(f),a&&a[Ht]?a.J(l,f,B(p)?!!p.capture:!1,S):Fg(a,l,f,!1,p,S)}function Fg(a,l,f,p,S,F){if(!l)throw Error("Invalid event type");const z=B(S)?!!S.capture:!!S;let Be=Ha(a);if(Be||(a[Ma]=Be=new tr(a)),f=Be.add(l,f,p,z,F),f.proxy)return f;if(p=Lg(),f.proxy=p,p.src=a,p.listener=f,a.addEventListener)O||(S=z),S===void 0&&(S=!1),a.addEventListener(l.toString(),p,S);else if(a.attachEvent)a.attachEvent(Gc(l.toString()),p);else if(a.addListener&&a.removeListener)a.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return f}function Lg(){function a(f){return l.call(a.src,a.listener,f)}const l=kg;return a}function Mc(a,l,f,p,S){if(Array.isArray(l))for(var F=0;F<l.length;F++)Mc(a,l[F],f,p,S);else p=B(p)?!!p.capture:!!p,f=Uc(f),a&&a[Ht]?(a=a.i,F=String(l).toString(),F in a.g&&(l=a.g[F],f=Va(l,f,p,S),f>-1&&(me(l[f]),Array.prototype.splice.call(l,f,1),l.length==0&&(delete a.g[F],a.h--)))):a&&(a=Ha(a))&&(l=a.g[l.toString()],a=-1,l&&(a=Va(l,f,p,S)),(f=a>-1?l[a]:null)&&Ua(f))}function Ua(a){if(typeof a!="number"&&a&&!a.da){var l=a.src;if(l&&l[Ht])xa(l.i,a);else{var f=a.type,p=a.proxy;l.removeEventListener?l.removeEventListener(f,p,a.capture):l.detachEvent?l.detachEvent(Gc(f),p):l.addListener&&l.removeListener&&l.removeListener(p),(f=Ha(l))?(xa(f,a),f.h==0&&(f.src=null,l[Ma]=null)):me(a)}}}function Gc(a){return a in Ga?Ga[a]:Ga[a]="on"+a}function kg(a,l){if(a.da)a=!0;else{l=new Re(l,this);const f=a.listener,p=a.ha||a.src;a.fa&&Ua(a),a=f.call(p,l)}return a}function Ha(a){return a=a[Ma],a instanceof tr?a:null}var Ja="__closure_events_fn_"+(Math.random()*1e9>>>0);function Uc(a){return typeof a=="function"?a:(a[Ja]||(a[Ja]=function(l){return a.handleEvent(l)}),a[Ja])}function Xe(){b.call(this),this.i=new tr(this),this.M=this,this.G=null}d(Xe,b),Xe.prototype[Ht]=!0,Xe.prototype.removeEventListener=function(a,l,f,p){Mc(this,a,l,f,p)};function st(a,l){var f,p=a.G;if(p)for(f=[];p;p=p.G)f.push(p);if(a=a.M,p=l.type||l,typeof l=="string")l=new R(l,a);else if(l instanceof R)l.target=l.target||a;else{var S=l;l=new R(p,a),Ji(l,S)}S=!0;let F,z;if(f)for(z=f.length-1;z>=0;z--)F=l.g=f[z],S=ji(F,p,!0,l)&&S;if(F=l.g=a,S=ji(F,p,!0,l)&&S,S=ji(F,p,!1,l)&&S,f)for(z=0;z<f.length;z++)F=l.g=f[z],S=ji(F,p,!1,l)&&S}Xe.prototype.N=function(){if(Xe.Z.N.call(this),this.i){var a=this.i;for(const l in a.g){const f=a.g[l];for(let p=0;p<f.length;p++)me(f[p]);delete a.g[l],a.h--}}this.G=null},Xe.prototype.J=function(a,l,f,p){return this.i.add(String(a),l,!1,f,p)},Xe.prototype.K=function(a,l,f,p){return this.i.add(String(a),l,!0,f,p)};function ji(a,l,f,p){if(l=a.i.g[String(l)],!l)return!0;l=l.concat();let S=!0;for(let F=0;F<l.length;++F){const z=l[F];if(z&&!z.da&&z.capture==f){const Be=z.listener,je=z.ha||z.src;z.fa&&xa(a.i,z),S=Be.call(je,p)!==!1&&S}}return S&&!p.defaultPrevented}function xg(a,l){if(typeof a!="function")if(a&&typeof a.handleEvent=="function")a=c(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(l)>2147483647?-1:o.setTimeout(a,l||0)}function Hc(a){a.g=xg(()=>{a.g=null,a.i&&(a.i=!1,Hc(a))},a.l);const l=a.h;a.h=null,a.m.apply(null,l)}class Vg extends b{constructor(l,f){super(),this.m=l,this.l=f,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:Hc(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Ds(a){b.call(this),this.h=a,this.g={}}d(Ds,b);var Jc=[];function jc(a){we(a.g,function(l,f){this.g.hasOwnProperty(f)&&Ua(l)},a),a.g={}}Ds.prototype.N=function(){Ds.Z.N.call(this),jc(this)},Ds.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ja=o.JSON.stringify,Mg=o.JSON.parse,Gg=class{stringify(a){return o.JSON.stringify(a,void 0)}parse(a){return o.JSON.parse(a,void 0)}};function qc(){}function Kc(){}var ws={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function qa(){R.call(this,"d")}d(qa,R);function Ka(){R.call(this,"c")}d(Ka,R);var nr={},zc=null;function qi(){return zc=zc||new Xe}nr.Ia="serverreachability";function Wc(a){R.call(this,nr.Ia,a)}d(Wc,R);function ys(a){const l=qi();st(l,new Wc(l))}nr.STAT_EVENT="statevent";function $c(a,l){R.call(this,nr.STAT_EVENT,a),this.stat=l}d($c,R);function it(a){const l=qi();st(l,new $c(l,a))}nr.Ja="timingevent";function Qc(a,l){R.call(this,nr.Ja,a),this.size=l}d(Qc,R);function Ts(a,l){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){a()},l)}function Is(){this.g=!0}Is.prototype.ua=function(){this.g=!1};function Ug(a,l,f,p,S,F){a.info(function(){if(a.g)if(F){var z="",Be=F.split("&");for(let _e=0;_e<Be.length;_e++){var je=Be[_e].split("=");if(je.length>1){const ze=je[0];je=je[1];const jt=ze.split("_");z=jt.length>=2&&jt[1]=="type"?z+(ze+"="+je+"&"):z+(ze+"=redacted&")}}}else z=null;else z=F;return"XMLHTTP REQ ("+p+") [attempt "+S+"]: "+l+`
`+f+`
`+z})}function Hg(a,l,f,p,S,F,z){a.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+S+"]: "+l+`
`+f+`
`+F+" "+z})}function kr(a,l,f,p){a.info(function(){return"XMLHTTP TEXT ("+l+"): "+jg(a,f)+(p?" "+p:"")})}function Jg(a,l){a.info(function(){return"TIMEOUT: "+l})}Is.prototype.info=function(){};function jg(a,l){if(!a.g)return l;if(!l)return null;try{const F=JSON.parse(l);if(F){for(a=0;a<F.length;a++)if(Array.isArray(F[a])){var f=F[a];if(!(f.length<2)){var p=f[1];if(Array.isArray(p)&&!(p.length<1)){var S=p[0];if(S!="noop"&&S!="stop"&&S!="close")for(let z=1;z<p.length;z++)p[z]=""}}}}return ja(F)}catch{return l}}var Ki={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Yc={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},Xc;function za(){}d(za,qc),za.prototype.g=function(){return new XMLHttpRequest},Xc=new za;function As(a){return encodeURIComponent(String(a))}function qg(a){var l=1;a=a.split(":");const f=[];for(;l>0&&a.length;)f.push(a.shift()),l--;return a.length&&f.push(a.join(":")),f}function wn(a,l,f,p){this.j=a,this.i=l,this.l=f,this.S=p||1,this.V=new Ds(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Zc}function Zc(){this.i=null,this.g="",this.h=!1}var el={},Wa={};function $a(a,l,f){a.M=1,a.A=Wi(Jt(l)),a.u=f,a.R=!0,tl(a,null)}function tl(a,l){a.F=Date.now(),zi(a),a.B=Jt(a.A);var f=a.B,p=a.S;Array.isArray(p)||(p=[String(p)]),dl(f.i,"t",p),a.C=0,f=a.j.L,a.h=new Zc,a.g=Ol(a.j,f?l:null,!a.u),a.P>0&&(a.O=new Vg(c(a.Y,a,a.g),a.P)),l=a.V,f=a.g,p=a.ba;var S="readystatechange";Array.isArray(S)||(S&&(Jc[0]=S.toString()),S=Jc);for(let F=0;F<S.length;F++){const z=Vc(f,S[F],p||l.handleEvent,!1,l.h||l);if(!z)break;l.g[z.key]=z}l=a.J?sn(a.J):{},a.u?(a.v||(a.v="POST"),l["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.B,a.v,a.u,l)):(a.v="GET",a.g.ea(a.B,a.v,null,l)),ys(),Ug(a.i,a.v,a.B,a.l,a.S,a.u)}wn.prototype.ba=function(a){a=a.target;const l=this.O;l&&In(a)==3?l.j():this.Y(a)},wn.prototype.Y=function(a){try{if(a==this.g)e:{const Be=In(this.g),je=this.g.ya(),_e=this.g.ca();if(!(Be<3)&&(Be!=3||this.g&&(this.h.h||this.g.la()||Dl(this.g)))){this.K||Be!=4||je==7||(je==8||_e<=0?ys(3):ys(2)),Qa(this);var l=this.g.ca();this.X=l;var f=Kg(this);if(this.o=l==200,Hg(this.i,this.v,this.B,this.l,this.S,Be,l),this.o){if(this.U&&!this.L){t:{if(this.g){var p,S=this.g;if((p=S.g?S.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!y(p)){var F=p;break t}}F=null}if(a=F)kr(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Ya(this,a);else{this.o=!1,this.m=3,it(12),rr(this),Rs(this);break e}}if(this.R){a=!0;let ze;for(;!this.K&&this.C<f.length;)if(ze=zg(this,f),ze==Wa){Be==4&&(this.m=4,it(14),a=!1),kr(this.i,this.l,null,"[Incomplete Response]");break}else if(ze==el){this.m=4,it(15),kr(this.i,this.l,f,"[Invalid Chunk]"),a=!1;break}else kr(this.i,this.l,ze,null),Ya(this,ze);if(nl(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Be!=4||f.length!=0||this.h.h||(this.m=1,it(16),a=!1),this.o=this.o&&a,!a)kr(this.i,this.l,f,"[Invalid Chunked Response]"),rr(this),Rs(this);else if(f.length>0&&!this.W){this.W=!0;var z=this.j;z.g==this&&z.aa&&!z.P&&(z.j.info("Great, no buffering proxy detected. Bytes received: "+f.length),iB(z),z.P=!0,it(11))}}else kr(this.i,this.l,f,null),Ya(this,f);Be==4&&rr(this),this.o&&!this.K&&(Be==4?vl(this.j,this):(this.o=!1,zi(this)))}else am(this.g),l==400&&f.indexOf("Unknown SID")>0?(this.m=3,it(12)):(this.m=0,it(13)),rr(this),Rs(this)}}}catch{}finally{}};function Kg(a){if(!nl(a))return a.g.la();const l=Dl(a.g);if(l==="")return"";let f="";const p=l.length,S=In(a.g)==4;if(!a.h.i){if(typeof TextDecoder>"u")return rr(a),Rs(a),"";a.h.i=new o.TextDecoder}for(let F=0;F<p;F++)a.h.h=!0,f+=a.h.i.decode(l[F],{stream:!(S&&F==p-1)});return l.length=0,a.h.g+=f,a.C=0,a.h.g}function nl(a){return a.g?a.v=="GET"&&a.M!=2&&a.j.Aa:!1}function zg(a,l){var f=a.C,p=l.indexOf(`
`,f);return p==-1?Wa:(f=Number(l.substring(f,p)),isNaN(f)?el:(p+=1,p+f>l.length?Wa:(l=l.slice(p,p+f),a.C=p+f,l)))}wn.prototype.cancel=function(){this.K=!0,rr(this)};function zi(a){a.T=Date.now()+a.H,rl(a,a.H)}function rl(a,l){if(a.D!=null)throw Error("WatchDog timer not null");a.D=Ts(c(a.aa,a),l)}function Qa(a){a.D&&(o.clearTimeout(a.D),a.D=null)}wn.prototype.aa=function(){this.D=null;const a=Date.now();a-this.T>=0?(Jg(this.i,this.B),this.M!=2&&(ys(),it(17)),rr(this),this.m=2,Rs(this)):rl(this,this.T-a)};function Rs(a){a.j.I==0||a.K||vl(a.j,a)}function rr(a){Qa(a);var l=a.O;l&&typeof l.dispose=="function"&&l.dispose(),a.O=null,jc(a.V),a.g&&(l=a.g,a.g=null,l.abort(),l.dispose())}function Ya(a,l){try{var f=a.j;if(f.I!=0&&(f.g==a||Xa(f.h,a))){if(!a.L&&Xa(f.h,a)&&f.I==3){try{var p=f.Ba.g.parse(l)}catch{p=null}if(Array.isArray(p)&&p.length==3){var S=p;if(S[0]==0){e:if(!f.v){if(f.g)if(f.g.F+3e3<a.F)Zi(f),Yi(f);else break e;sB(f),it(18)}}else f.xa=S[1],0<f.xa-f.K&&S[2]<37500&&f.F&&f.A==0&&!f.C&&(f.C=Ts(c(f.Va,f),6e3));ol(f.h)<=1&&f.ta&&(f.ta=void 0)}else ir(f,11)}else if((a.L||f.g==a)&&Zi(f),!y(l))for(S=f.Ba.g.parse(l),l=0;l<S.length;l++){let _e=S[l];const ze=_e[0];if(!(ze<=f.K))if(f.K=ze,_e=_e[1],f.I==2)if(_e[0]=="c"){f.M=_e[1],f.ba=_e[2];const jt=_e[3];jt!=null&&(f.ka=jt,f.j.info("VER="+f.ka));const or=_e[4];or!=null&&(f.za=or,f.j.info("SVER="+f.za));const An=_e[5];An!=null&&typeof An=="number"&&An>0&&(p=1.5*An,f.O=p,f.j.info("backChannelRequestTimeoutMs_="+p)),p=f;const Rn=a.g;if(Rn){const to=Rn.g?Rn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(to){var F=p.h;F.g||to.indexOf("spdy")==-1&&to.indexOf("quic")==-1&&to.indexOf("h2")==-1||(F.j=F.l,F.g=new Set,F.h&&(Za(F,F.h),F.h=null))}if(p.G){const oB=Rn.g?Rn.g.getResponseHeader("X-HTTP-Session-Id"):null;oB&&(p.wa=oB,Te(p.J,p.G,oB))}}f.I=3,f.l&&f.l.ra(),f.aa&&(f.T=Date.now()-a.F,f.j.info("Handshake RTT: "+f.T+"ms")),p=f;var z=a;if(p.na=Sl(p,p.L?p.ba:null,p.W),z.L){al(p.h,z);var Be=z,je=p.O;je&&(Be.H=je),Be.D&&(Qa(Be),zi(Be)),p.g=z}else Al(p);f.i.length>0&&Xi(f)}else _e[0]!="stop"&&_e[0]!="close"||ir(f,7);else f.I==3&&(_e[0]=="stop"||_e[0]=="close"?_e[0]=="stop"?ir(f,7):rB(f):_e[0]!="noop"&&f.l&&f.l.qa(_e),f.A=0)}}ys(4)}catch{}}var Wg=class{constructor(a,l){this.g=a,this.map=l}};function sl(a){this.l=a||10,o.PerformanceNavigationTiming?(a=o.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function il(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function ol(a){return a.h?1:a.g?a.g.size:0}function Xa(a,l){return a.h?a.h==l:a.g?a.g.has(l):!1}function Za(a,l){a.g?a.g.add(l):a.h=l}function al(a,l){a.h&&a.h==l?a.h=null:a.g&&a.g.has(l)&&a.g.delete(l)}sl.prototype.cancel=function(){if(this.i=Bl(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function Bl(a){if(a.h!=null)return a.i.concat(a.h.G);if(a.g!=null&&a.g.size!==0){let l=a.i;for(const f of a.g.values())l=l.concat(f.G);return l}return g(a.i)}var ul=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function $g(a,l){if(a){a=a.split("&");for(let f=0;f<a.length;f++){const p=a[f].indexOf("=");let S,F=null;p>=0?(S=a[f].substring(0,p),F=a[f].substring(p+1)):S=a[f],l(S,F?decodeURIComponent(F.replace(/\+/g," ")):"")}}}function yn(a){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let l;a instanceof yn?(this.l=a.l,vs(this,a.j),this.o=a.o,this.g=a.g,bs(this,a.u),this.h=a.h,eB(this,Cl(a.i)),this.m=a.m):a&&(l=String(a).match(ul))?(this.l=!1,vs(this,l[1]||"",!0),this.o=Ps(l[2]||""),this.g=Ps(l[3]||"",!0),bs(this,l[4]),this.h=Ps(l[5]||"",!0),eB(this,l[6]||"",!0),this.m=Ps(l[7]||"")):(this.l=!1,this.i=new Os(null,this.l))}yn.prototype.toString=function(){const a=[];var l=this.j;l&&a.push(Ss(l,cl,!0),":");var f=this.g;return(f||l=="file")&&(a.push("//"),(l=this.o)&&a.push(Ss(l,cl,!0),"@"),a.push(As(f).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),f=this.u,f!=null&&a.push(":",String(f))),(f=this.h)&&(this.g&&f.charAt(0)!="/"&&a.push("/"),a.push(Ss(f,f.charAt(0)=="/"?Xg:Yg,!0))),(f=this.i.toString())&&a.push("?",f),(f=this.m)&&a.push("#",Ss(f,em)),a.join("")},yn.prototype.resolve=function(a){const l=Jt(this);let f=!!a.j;f?vs(l,a.j):f=!!a.o,f?l.o=a.o:f=!!a.g,f?l.g=a.g:f=a.u!=null;var p=a.h;if(f)bs(l,a.u);else if(f=!!a.h){if(p.charAt(0)!="/")if(this.g&&!this.h)p="/"+p;else{var S=l.h.lastIndexOf("/");S!=-1&&(p=l.h.slice(0,S+1)+p)}if(S=p,S==".."||S==".")p="";else if(S.indexOf("./")!=-1||S.indexOf("/.")!=-1){p=S.lastIndexOf("/",0)==0,S=S.split("/");const F=[];for(let z=0;z<S.length;){const Be=S[z++];Be=="."?p&&z==S.length&&F.push(""):Be==".."?((F.length>1||F.length==1&&F[0]!="")&&F.pop(),p&&z==S.length&&F.push("")):(F.push(Be),p=!0)}p=F.join("/")}else p=S}return f?l.h=p:f=a.i.toString()!=="",f?eB(l,Cl(a.i)):f=!!a.m,f&&(l.m=a.m),l};function Jt(a){return new yn(a)}function vs(a,l,f){a.j=f?Ps(l,!0):l,a.j&&(a.j=a.j.replace(/:$/,""))}function bs(a,l){if(l){if(l=Number(l),isNaN(l)||l<0)throw Error("Bad port number "+l);a.u=l}else a.u=null}function eB(a,l,f){l instanceof Os?(a.i=l,tm(a.i,a.l)):(f||(l=Ss(l,Zg)),a.i=new Os(l,a.l))}function Te(a,l,f){a.i.set(l,f)}function Wi(a){return Te(a,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),a}function Ps(a,l){return a?l?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function Ss(a,l,f){return typeof a=="string"?(a=encodeURI(a).replace(l,Qg),f&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function Qg(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var cl=/[#\/\?@]/g,Yg=/[#\?:]/g,Xg=/[#\?]/g,Zg=/[#\?@]/g,em=/#/g;function Os(a,l){this.h=this.g=null,this.i=a||null,this.j=!!l}function sr(a){a.g||(a.g=new Map,a.h=0,a.i&&$g(a.i,function(l,f){a.add(decodeURIComponent(l.replace(/\+/g," ")),f)}))}r=Os.prototype,r.add=function(a,l){sr(this),this.i=null,a=xr(this,a);let f=this.g.get(a);return f||this.g.set(a,f=[]),f.push(l),this.h+=1,this};function ll(a,l){sr(a),l=xr(a,l),a.g.has(l)&&(a.i=null,a.h-=a.g.get(l).length,a.g.delete(l))}function hl(a,l){return sr(a),l=xr(a,l),a.g.has(l)}r.forEach=function(a,l){sr(this),this.g.forEach(function(f,p){f.forEach(function(S){a.call(l,S,p,this)},this)},this)};function fl(a,l){sr(a);let f=[];if(typeof l=="string")hl(a,l)&&(f=f.concat(a.g.get(xr(a,l))));else for(a=Array.from(a.g.values()),l=0;l<a.length;l++)f=f.concat(a[l]);return f}r.set=function(a,l){return sr(this),this.i=null,a=xr(this,a),hl(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[l]),this.h+=1,this},r.get=function(a,l){return a?(a=fl(this,a),a.length>0?String(a[0]):l):l};function dl(a,l,f){ll(a,l),f.length>0&&(a.i=null,a.g.set(xr(a,l),g(f)),a.h+=f.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],l=Array.from(this.g.keys());for(let p=0;p<l.length;p++){var f=l[p];const S=As(f);f=fl(this,f);for(let F=0;F<f.length;F++){let z=S;f[F]!==""&&(z+="="+As(f[F])),a.push(z)}}return this.i=a.join("&")};function Cl(a){const l=new Os;return l.i=a.i,a.g&&(l.g=new Map(a.g),l.h=a.h),l}function xr(a,l){return l=String(l),a.j&&(l=l.toLowerCase()),l}function tm(a,l){l&&!a.j&&(sr(a),a.i=null,a.g.forEach(function(f,p){const S=p.toLowerCase();p!=S&&(ll(this,p),dl(this,S,f))},a)),a.j=l}function nm(a,l){const f=new Is;if(o.Image){const p=new Image;p.onload=h(Tn,f,"TestLoadImage: loaded",!0,l,p),p.onerror=h(Tn,f,"TestLoadImage: error",!1,l,p),p.onabort=h(Tn,f,"TestLoadImage: abort",!1,l,p),p.ontimeout=h(Tn,f,"TestLoadImage: timeout",!1,l,p),o.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=a}else l(!1)}function rm(a,l){const f=new Is,p=new AbortController,S=setTimeout(()=>{p.abort(),Tn(f,"TestPingServer: timeout",!1,l)},1e4);fetch(a,{signal:p.signal}).then(F=>{clearTimeout(S),F.ok?Tn(f,"TestPingServer: ok",!0,l):Tn(f,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(S),Tn(f,"TestPingServer: error",!1,l)})}function Tn(a,l,f,p,S){try{S&&(S.onload=null,S.onerror=null,S.onabort=null,S.ontimeout=null),p(f)}catch{}}function sm(){this.g=new Gg}function tB(a){this.i=a.Sb||null,this.h=a.ab||!1}d(tB,qc),tB.prototype.g=function(){return new $i(this.i,this.h)};function $i(a,l){Xe.call(this),this.H=a,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}d($i,Xe),r=$i.prototype,r.open=function(a,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=a,this.D=l,this.readyState=1,Fs(this)},r.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const l={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};a&&(l.body=a),(this.H||o).fetch(new Request(this.D,l)).then(this.Pa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Ns(this)),this.readyState=0},r.Pa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Fs(this)),this.g&&(this.readyState=3,Fs(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;pl(this)}else a.text().then(this.Oa.bind(this),this.ga.bind(this))};function pl(a){a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a))}r.Ma=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var l=a.value?a.value:new Uint8Array(0);(l=this.B.decode(l,{stream:!a.done}))&&(this.response=this.responseText+=l)}a.done?Ns(this):Fs(this),this.readyState==3&&pl(this)}},r.Oa=function(a){this.g&&(this.response=this.responseText=a,Ns(this))},r.Na=function(a){this.g&&(this.response=a,Ns(this))},r.ga=function(){this.g&&Ns(this)};function Ns(a){a.readyState=4,a.l=null,a.j=null,a.B=null,Fs(a)}r.setRequestHeader=function(a,l){this.A.append(a,l)},r.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],l=this.h.entries();for(var f=l.next();!f.done;)f=f.value,a.push(f[0]+": "+f[1]),f=l.next();return a.join(`\r
`)};function Fs(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty($i.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function gl(a){let l="";return we(a,function(f,p){l+=p,l+=":",l+=f,l+=`\r
`}),l}function nB(a,l,f){e:{for(p in f){var p=!1;break e}p=!0}p||(f=gl(f),typeof a=="string"?f!=null&&As(f):Te(a,l,f))}function Ne(a){Xe.call(this),this.headers=new Map,this.L=a||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}d(Ne,Xe);var im=/^https?$/i,om=["POST","PUT"];r=Ne.prototype,r.Fa=function(a){this.H=a},r.ea=function(a,l,f,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);l=l?l.toUpperCase():"GET",this.D=a,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Xc.g(),this.g.onreadystatechange=C(c(this.Ca,this));try{this.B=!0,this.g.open(l,String(a),!0),this.B=!1}catch(F){ml(this,F);return}if(a=f||"",f=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var S in p)f.set(S,p[S]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const F of p.keys())f.set(F,p.get(F));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(f.keys()).find(F=>F.toLowerCase()=="content-type"),S=o.FormData&&a instanceof o.FormData,!(Array.prototype.indexOf.call(om,l,void 0)>=0)||p||S||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[F,z]of f)this.g.setRequestHeader(F,z);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(a),this.v=!1}catch(F){ml(this,F)}};function ml(a,l){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=l,a.o=5,El(a),Qi(a)}function El(a){a.A||(a.A=!0,st(a,"complete"),st(a,"error"))}r.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=a||7,st(this,"complete"),st(this,"abort"),Qi(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Qi(this,!0)),Ne.Z.N.call(this)},r.Ca=function(){this.u||(this.B||this.v||this.j?_l(this):this.Xa())},r.Xa=function(){_l(this)};function _l(a){if(a.h&&typeof i<"u"){if(a.v&&In(a)==4)setTimeout(a.Ca.bind(a),0);else if(st(a,"readystatechange"),In(a)==4){a.h=!1;try{const F=a.ca();e:switch(F){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break e;default:l=!1}var f;if(!(f=l)){var p;if(p=F===0){let z=String(a.D).match(ul)[1]||null;!z&&o.self&&o.self.location&&(z=o.self.location.protocol.slice(0,-1)),p=!im.test(z?z.toLowerCase():"")}f=p}if(f)st(a,"complete"),st(a,"success");else{a.o=6;try{var S=In(a)>2?a.g.statusText:""}catch{S=""}a.l=S+" ["+a.ca()+"]",El(a)}}finally{Qi(a)}}}}function Qi(a,l){if(a.g){a.m&&(clearTimeout(a.m),a.m=null);const f=a.g;a.g=null,l||st(a,"ready");try{f.onreadystatechange=null}catch{}}}r.isActive=function(){return!!this.g};function In(a){return a.g?a.g.readyState:0}r.ca=function(){try{return In(this)>2?this.g.status:-1}catch{return-1}},r.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.La=function(a){if(this.g){var l=this.g.responseText;return a&&l.indexOf(a)==0&&(l=l.substring(a.length)),Mg(l)}};function Dl(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.F){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function am(a){const l={};a=(a.g&&In(a)>=2&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<a.length;p++){if(y(a[p]))continue;var f=qg(a[p]);const S=f[0];if(f=f[1],typeof f!="string")continue;f=f.trim();const F=l[S]||[];l[S]=F,F.push(f)}Dn(l,function(p){return p.join(", ")})}r.ya=function(){return this.o},r.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ls(a,l,f){return f&&f.internalChannelParams&&f.internalChannelParams[a]||l}function wl(a){this.za=0,this.i=[],this.j=new Is,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Ls("failFast",!1,a),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Ls("baseRetryDelayMs",5e3,a),this.Za=Ls("retryDelaySeedMs",1e4,a),this.Ta=Ls("forwardChannelMaxRetries",2,a),this.va=Ls("forwardChannelRequestTimeoutMs",2e4,a),this.ma=a&&a.xmlHttpFactory||void 0,this.Ua=a&&a.Rb||void 0,this.Aa=a&&a.useFetchStreams||!1,this.O=void 0,this.L=a&&a.supportsCrossDomainXhr||!1,this.M="",this.h=new sl(a&&a.concurrentRequestLimit),this.Ba=new sm,this.S=a&&a.fastHandshake||!1,this.R=a&&a.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=a&&a.Pb||!1,a&&a.ua&&this.j.ua(),a&&a.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&a&&a.detectBufferingProxy||!1,this.ia=void 0,a&&a.longPollingTimeout&&a.longPollingTimeout>0&&(this.ia=a.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}r=wl.prototype,r.ka=8,r.I=1,r.connect=function(a,l,f,p){it(0),this.W=a,this.H=l||{},f&&p!==void 0&&(this.H.OSID=f,this.H.OAID=p),this.F=this.X,this.J=Sl(this,null,this.W),Xi(this)};function rB(a){if(yl(a),a.I==3){var l=a.V++,f=Jt(a.J);if(Te(f,"SID",a.M),Te(f,"RID",l),Te(f,"TYPE","terminate"),ks(a,f),l=new wn(a,a.j,l),l.M=2,l.A=Wi(Jt(f)),f=!1,o.navigator&&o.navigator.sendBeacon)try{f=o.navigator.sendBeacon(l.A.toString(),"")}catch{}!f&&o.Image&&(new Image().src=l.A,f=!0),f||(l.g=Ol(l.j,null),l.g.ea(l.A)),l.F=Date.now(),zi(l)}Pl(a)}function Yi(a){a.g&&(iB(a),a.g.cancel(),a.g=null)}function yl(a){Yi(a),a.v&&(o.clearTimeout(a.v),a.v=null),Zi(a),a.h.cancel(),a.m&&(typeof a.m=="number"&&o.clearTimeout(a.m),a.m=null)}function Xi(a){if(!il(a.h)&&!a.m){a.m=!0;var l=a.Ea;Z||m(),Q||(Z(),Q=!0),w.add(l,a),a.D=0}}function Bm(a,l){return ol(a.h)>=a.h.j-(a.m?1:0)?!1:a.m?(a.i=l.G.concat(a.i),!0):a.I==1||a.I==2||a.D>=(a.Sa?0:a.Ta)?!1:(a.m=Ts(c(a.Ea,a,l),bl(a,a.D)),a.D++,!0)}r.Ea=function(a){if(this.m)if(this.m=null,this.I==1){if(!a){this.V=Math.floor(Math.random()*1e5),a=this.V++;const S=new wn(this,this.j,a);let F=this.o;if(this.U&&(F?(F=sn(F),Ji(F,this.U)):F=this.U),this.u!==null||this.R||(S.J=F,F=null),this.S)e:{for(var l=0,f=0;f<this.i.length;f++){t:{var p=this.i[f];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(l+=p,l>4096){l=f;break e}if(l===4096||f===this.i.length-1){l=f+1;break e}}l=1e3}else l=1e3;l=Il(this,S,l),f=Jt(this.J),Te(f,"RID",a),Te(f,"CVER",22),this.G&&Te(f,"X-HTTP-Session-Id",this.G),ks(this,f),F&&(this.R?l="headers="+As(gl(F))+"&"+l:this.u&&nB(f,this.u,F)),Za(this.h,S),this.Ra&&Te(f,"TYPE","init"),this.S?(Te(f,"$req",l),Te(f,"SID","null"),S.U=!0,$a(S,f,null)):$a(S,f,l),this.I=2}}else this.I==3&&(a?Tl(this,a):this.i.length==0||il(this.h)||Tl(this))};function Tl(a,l){var f;l?f=l.l:f=a.V++;const p=Jt(a.J);Te(p,"SID",a.M),Te(p,"RID",f),Te(p,"AID",a.K),ks(a,p),a.u&&a.o&&nB(p,a.u,a.o),f=new wn(a,a.j,f,a.D+1),a.u===null&&(f.J=a.o),l&&(a.i=l.G.concat(a.i)),l=Il(a,f,1e3),f.H=Math.round(a.va*.5)+Math.round(a.va*.5*Math.random()),Za(a.h,f),$a(f,p,l)}function ks(a,l){a.H&&we(a.H,function(f,p){Te(l,p,f)}),a.l&&we({},function(f,p){Te(l,p,f)})}function Il(a,l,f){f=Math.min(a.i.length,f);const p=a.l?c(a.l.Ka,a.l,a):null;e:{var S=a.i;let Be=-1;for(;;){const je=["count="+f];Be==-1?f>0?(Be=S[0].g,je.push("ofs="+Be)):Be=0:je.push("ofs="+Be);let _e=!0;for(let ze=0;ze<f;ze++){var F=S[ze].g;const jt=S[ze].map;if(F-=Be,F<0)Be=Math.max(0,S[ze].g-100),_e=!1;else try{F="req"+F+"_"||"";try{var z=jt instanceof Map?jt:Object.entries(jt);for(const[or,An]of z){let Rn=An;B(An)&&(Rn=ja(An)),je.push(F+or+"="+encodeURIComponent(Rn))}}catch(or){throw je.push(F+"type="+encodeURIComponent("_badmap")),or}}catch{p&&p(jt)}}if(_e){z=je.join("&");break e}}z=void 0}return a=a.i.splice(0,f),l.G=a,z}function Al(a){if(!a.g&&!a.v){a.Y=1;var l=a.Da;Z||m(),Q||(Z(),Q=!0),w.add(l,a),a.A=0}}function sB(a){return a.g||a.v||a.A>=3?!1:(a.Y++,a.v=Ts(c(a.Da,a),bl(a,a.A)),a.A++,!0)}r.Da=function(){if(this.v=null,Rl(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var a=4*this.T;this.j.info("BP detection timer enabled: "+a),this.B=Ts(c(this.Wa,this),a)}},r.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,it(10),Yi(this),Rl(this))};function iB(a){a.B!=null&&(o.clearTimeout(a.B),a.B=null)}function Rl(a){a.g=new wn(a,a.j,"rpc",a.Y),a.u===null&&(a.g.J=a.o),a.g.P=0;var l=Jt(a.na);Te(l,"RID","rpc"),Te(l,"SID",a.M),Te(l,"AID",a.K),Te(l,"CI",a.F?"0":"1"),!a.F&&a.ia&&Te(l,"TO",a.ia),Te(l,"TYPE","xmlhttp"),ks(a,l),a.u&&a.o&&nB(l,a.u,a.o),a.O&&(a.g.H=a.O);var f=a.g;a=a.ba,f.M=1,f.A=Wi(Jt(l)),f.u=null,f.R=!0,tl(f,a)}r.Va=function(){this.C!=null&&(this.C=null,Yi(this),sB(this),it(19))};function Zi(a){a.C!=null&&(o.clearTimeout(a.C),a.C=null)}function vl(a,l){var f=null;if(a.g==l){Zi(a),iB(a),a.g=null;var p=2}else if(Xa(a.h,l))f=l.G,al(a.h,l),p=1;else return;if(a.I!=0){if(l.o)if(p==1){f=l.u?l.u.length:0,l=Date.now()-l.F;var S=a.D;p=qi(),st(p,new Qc(p,f)),Xi(a)}else Al(a);else if(S=l.m,S==3||S==0&&l.X>0||!(p==1&&Bm(a,l)||p==2&&sB(a)))switch(f&&f.length>0&&(l=a.h,l.i=l.i.concat(f)),S){case 1:ir(a,5);break;case 4:ir(a,10);break;case 3:ir(a,6);break;default:ir(a,2)}}}function bl(a,l){let f=a.Qa+Math.floor(Math.random()*a.Za);return a.isActive()||(f*=2),f*l}function ir(a,l){if(a.j.info("Error code "+l),l==2){var f=c(a.bb,a),p=a.Ua;const S=!p;p=new yn(p||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||vs(p,"https"),Wi(p),S?nm(p.toString(),f):rm(p.toString(),f)}else it(2);a.I=0,a.l&&a.l.pa(l),Pl(a),yl(a)}r.bb=function(a){a?(this.j.info("Successfully pinged google.com"),it(2)):(this.j.info("Failed to ping google.com"),it(1))};function Pl(a){if(a.I=0,a.ja=[],a.l){const l=Bl(a.h);(l.length!=0||a.i.length!=0)&&(D(a.ja,l),D(a.ja,a.i),a.h.i.length=0,g(a.i),a.i.length=0),a.l.oa()}}function Sl(a,l,f){var p=f instanceof yn?Jt(f):new yn(f);if(p.g!="")l&&(p.g=l+"."+p.g),bs(p,p.u);else{var S=o.location;p=S.protocol,l=l?l+"."+S.hostname:S.hostname,S=+S.port;const F=new yn(null);p&&vs(F,p),l&&(F.g=l),S&&bs(F,S),f&&(F.h=f),p=F}return f=a.G,l=a.wa,f&&l&&Te(p,f,l),Te(p,"VER",a.ka),ks(a,p),p}function Ol(a,l,f){if(l&&!a.L)throw Error("Can't create secondary domain capable XhrIo object.");return l=a.Aa&&!a.ma?new Ne(new tB({ab:f})):new Ne(a.ma),l.Fa(a.L),l}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function Nl(){}r=Nl.prototype,r.ra=function(){},r.qa=function(){},r.pa=function(){},r.oa=function(){},r.isActive=function(){return!0},r.Ka=function(){};function eo(){}eo.prototype.g=function(a,l){return new _t(a,l)};function _t(a,l){Xe.call(this),this.g=new wl(l),this.l=a,this.h=l&&l.messageUrlParams||null,a=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(a?a["X-WebChannel-Content-Type"]=l.messageContentType:a={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.sa&&(a?a["X-WebChannel-Client-Profile"]=l.sa:a={"X-WebChannel-Client-Profile":l.sa}),this.g.U=a,(a=l&&l.Qb)&&!y(a)&&(this.g.u=a),this.A=l&&l.supportsCrossDomainXhr||!1,this.v=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!y(l)&&(this.g.G=l,a=this.h,a!==null&&l in a&&(a=this.h,l in a&&delete a[l])),this.j=new Vr(this)}d(_t,Xe),_t.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},_t.prototype.close=function(){rB(this.g)},_t.prototype.o=function(a){var l=this.g;if(typeof a=="string"){var f={};f.__data__=a,a=f}else this.v&&(f={},f.__data__=ja(a),a=f);l.i.push(new Wg(l.Ya++,a)),l.I==3&&Xi(l)},_t.prototype.N=function(){this.g.l=null,delete this.j,rB(this.g),delete this.g,_t.Z.N.call(this)};function Fl(a){qa.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var l=a.__sm__;if(l){e:{for(const f in l){a=f;break e}a=void 0}(this.i=a)&&(a=this.i,l=l!==null&&a in l?l[a]:void 0),this.data=l}else this.data=a}d(Fl,qa);function Ll(){Ka.call(this),this.status=1}d(Ll,Ka);function Vr(a){this.g=a}d(Vr,Nl),Vr.prototype.ra=function(){st(this.g,"a")},Vr.prototype.qa=function(a){st(this.g,new Fl(a))},Vr.prototype.pa=function(a){st(this.g,new Ll)},Vr.prototype.oa=function(){st(this.g,"b")},eo.prototype.createWebChannel=eo.prototype.g,_t.prototype.send=_t.prototype.o,_t.prototype.open=_t.prototype.m,_t.prototype.close=_t.prototype.close,dC=function(){return new eo},fC=function(){return qi()},hC=nr,KB={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Ki.NO_ERROR=0,Ki.TIMEOUT=8,Ki.HTTP_ERROR=6,Io=Ki,Yc.COMPLETE="complete",lC=Yc,Kc.EventType=ws,ws.OPEN="a",ws.CLOSE="b",ws.ERROR="c",ws.MESSAGE="d",Xe.prototype.listen=Xe.prototype.J,Hs=Kc,Ne.prototype.listenOnce=Ne.prototype.K,Ne.prototype.getLastError=Ne.prototype.Ha,Ne.prototype.getLastErrorCode=Ne.prototype.ya,Ne.prototype.getStatus=Ne.prototype.ca,Ne.prototype.getResponseJson=Ne.prototype.La,Ne.prototype.getResponseText=Ne.prototype.la,Ne.prototype.send=Ne.prototype.ea,Ne.prototype.setWithCredentials=Ne.prototype.Fa,cC=Ne}).apply(typeof io<"u"?io:typeof self<"u"?self:typeof window<"u"?window:{});/*!
* re2js
* RE2JS is the JavaScript port of RE2, a regular expression engine that provides linear time matching
*
* @version v2.8.8
* @author Oleksii Vasyliev
* @homepage https://github.com/le0pard/re2js#readme
* @repository [object Object]
* @license MIT
*/var De,U=(De=class{},H(De,"FOLD_CASE",1),H(De,"LITERAL",2),H(De,"CLASS_NL",4),H(De,"DOT_NL",8),H(De,"ONE_LINE",16),H(De,"NON_GREEDY",32),H(De,"PERL_X",64),H(De,"UNICODE_GROUPS",128),H(De,"WAS_DOLLAR",256),H(De,"LOOKBEHIND",512),H(De,"MATCH_NL",De.CLASS_NL|De.DOT_NL),H(De,"PERL",De.CLASS_NL|De.ONE_LINE|De.PERL_X|De.UNICODE_GROUPS),H(De,"POSIX",0),H(De,"UNANCHORED",0),H(De,"ANCHOR_START",1),H(De,"ANCHOR_BOTH",2),De);const Mr={CASE_INSENSITIVE:1,DOTALL:2,MULTILINE:4,DISABLE_UNICODE_GROUPS:8,LONGEST_MATCH:16,LOOKBEHINDS:512},ui=128,zB=new Int32Array(ui),WB=new Int32Array(ui),oo=65535;for(let r=0;r<ui;r++)r>=97&&r<=122?zB[r]=r-32:zB[r]=r,r>=65&&r<=90?WB[r]=r+32:WB[r]=r;var xB,k=(xB=class{static toUpperCase(r){if(r<ui)return zB[r];const e=String.fromCodePoint(r).toUpperCase(),t=e.codePointAt(0)>oo?2:1;if(e.length>t)return r;const n=String.fromCodePoint(e.codePointAt(0)).toLowerCase(),s=n.codePointAt(0)>oo?2:1;return n.length>s||n.codePointAt(0)!==r?r:e.codePointAt(0)}static toLowerCase(r){if(r<ui)return WB[r];const e=String.fromCodePoint(r).toLowerCase(),t=e.codePointAt(0)>oo?2:1;if(e.length>t)return r;const n=String.fromCodePoint(e.codePointAt(0)).toUpperCase(),s=n.codePointAt(0)>oo?2:1;return n.length>s||n.codePointAt(0)!==r?r:e.codePointAt(0)}},H(xB,"CODES",new Map([["\x07",7],["\b",8],["	",9],[`
`,10],["\v",11],["\f",12],["\r",13],[" ",32],['"',34],["$",36],["&",38],["'",39],["(",40],[")",41],["*",42],["+",43],["-",45],[".",46],["0",48],["1",49],["2",50],["3",51],["4",52],["5",53],["6",54],["7",55],["8",56],["9",57],[":",58],["<",60],[">",62],["?",63],["A",65],["B",66],["C",67],["F",70],["P",80],["Q",81],["U",85],["Z",90],["[",91],["\\",92],["]",93],["^",94],["_",95],["`",96],["a",97],["b",98],["f",102],["i",105],["m",109],["n",110],["r",114],["s",115],["t",116],["v",118],["x",120],["z",122],["{",123],["|",124],["}",125]])),xB),E=class{constructor(r,e=!1){this.data=r,this.isStride1=e,this.SIZE=e?2:3}getLo(r){return this.data[r*this.SIZE]}getHi(r){return this.data[r*this.SIZE+1]}getStride(r){return this.isStride1?1:this.data[r*this.SIZE+2]}get length(){return this.data.length/this.SIZE}};const CC=new Uint8Array(256);for(let r=0,e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";r<64;r++)CC[e.charCodeAt(r)]=r;const pC=r=>{const e=[];let t=0,n=0;for(let s=0;s<r.length;s++){let i=CC[r.charCodeAt(s)];t|=(i&31)<<n,(i&32)===0?(e.push(t),t=0,n=0):n+=5}return e},_=(r,e)=>{const t=pC(r),n=e?t.length/2:t.length/3,s=new Uint32Array(n*3);let i=0,o=0;for(let B=0;B<n;B++)i+=t[o++],s[B*3]=i,i+=t[o++],s[B*3+1]=i,s[B*3+2]=e?1:t[o++];return s},Sw=r=>{const e=pC(r),t=new Map;let n=0;for(let s=0;s<e.length;s+=2){n+=e[s];const i=e[s+1],o=i>>>1^-(i&1);t.set(n,n+o)}return t};var ao=class{constructor(r){this.initializer=r,this.cache=new Map}has(r){return r in this.initializer}get(r){if(this.cache.has(r))return this.cache.get(r);const e=this.initializer[r],t=e?e():null;return this.cache.set(r,t),t}},bn,ct=(bn=class{static get CASE_ORBIT(){return this._CASE_ORBIT||(this._CASE_ORBIT=Sw("rCgCIgCY+rQI4QiCuuBLgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCCgCBgCBgCBgCBgCBgCBgCB+7OB-BB-BB-BB-BB-BBskQB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BC-BB-BB-BB-BB-BB-BB-BByHBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBxHBCBBBCBBBCBBB3SBmMBkNBCBBBCBBB8MBCBBB6MB6MBCBBC+EB0MB2MBCBBB6MB+MBiGBmNBiNBCBBBmKBikzCBmNBqNBkIBsNBCBBBCBBBCBBB0NBCBBB0NDCBBB0NBCBBByNByNBCBBBCBBB2NBCBBDCBBCwDFCBCBDBCBCBDBCBCBDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB9EBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBCBDBCBBBhGBvDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBjICCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBH2iVBCBBBlKBwiVB+jVB+jVBCBBBlMBqEBuEBCBBBCBBBCBBBCBBBCBBB+hVB4hVB8hVBjNB7MC5MB5MCzMC1MB+0yCE5MB20yCC9MBu2yCBwyyCBo0yCChNBlNBo0yCBu-UBi0yCDlNC6-UBpNDrNIu+UDzNCm0yCBzNE0yyCBzNBpEBxNBxNBtEG1NLqxyCBkxyCnFoFrBCBBBCBBDCBBEkIBkIBkICoHHsCCqCBqCBqCCgEC+DB+DBmkOBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCC+BBgCBgCBgCBgCBgCBgCBgCBgCBrCBpCBpCBpCBmjOB-BB8BB-BB-BBgEB-BB-BByBBqgOBsDB-BBtwBB-BB-BB-BBsBBgDBCB-BB-BB-BBeB-BB-BB61OB-BB-BB-DB9DB9DBQB7DBmCE9CBrDBPBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBrFB-EBOBnHB3FB-FCCBBBNBCBBCjIBjIBjIBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB8kMB-BB6kMB-BB-BB-BB-BB-BB-BB-BB-BB-BBokMB-BB-BBkkMBkkMB-BB-BB-BB-BB-BB-BB-BB4jMB-BB-BB-BB-BB-BB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EBCBBBCBoiMBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBJCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBeBCBBBCBBBCBBBCBBBCBBBCBBBCBBBdBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDL-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-C64CgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOCgmOGgmODg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FDg8FBg8FBg8FhVg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBQBQBQBQBQBQDPBPBPBPBPBPjkC7mMB5mMBnmMBjmMBCBlmMB3lMBpiMBk8kCBCBBG-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FD-7FB-7FB-7F6FoglCEsuHRwjlCyDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCB0DBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBG1DD97OCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPEQCQCQCQCPCPCPCPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPB0EB0EBsFBsFBsFBsFBoGBoGBgIBgIBgHBgHB8HB8HDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQCSFPBPBzEBzEBRCxnOFSFrFBrFBrFBrFBREQBQClkOFPBPBnGBnGFQBQCljOCODPBPB-GB-GBNHSF-HB-HB7HB7HBRqJ53OE9tQBrmQH4Bc3BSgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfECBByZ0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzB34BgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CBCBBBt-UBruHBt+UB1iVBviVBCBBBCBBBCBBB3hVB5-UB9hVB7hVCCBBCCBBI9jVB9jVBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBICBBBCBBECBBN-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOC-lOG-lOzoeCBBBCBBBCBBBCBBBCBBBCBl8kCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBTCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBnECBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBKCBBBCBBBnglCBCBBBCBBBCBBBCBBBCBBECBBBvyyCDCBBBCBBBgDCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBn0yCB90yCB10yCBh0yCBn0yCCjxyCBzyyCBpxyCBg6BBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB-CBl0yCBvjlCBCBBBCBBBt2yCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBhkzCZCBB9a-5Bd-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCm6TCBB7gBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCH-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BmlBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvChDwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCFvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvC1DuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCCuCBuCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCCtCBtCk2BgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEO-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-D+CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCL-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-B74CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhrVgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BD1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BtxekCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjC")),this._CASE_ORBIT}static get Print(){return this._Print||(this._Print=new E(_("hB9CBjBLBCpWBDFBFGBCCCBSBCsMBClBBDxBBDCBC2BBJaBFFBSVBC-FBCvBBD6BBDkDBP6BBDwBBDOBCbBDCCBJBGfBIqCBCgFBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYBDCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPBLCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGBCCBCHBDBBDVBCGBCBBCEBDIBDBBDCBICBFBBCEBDRBLBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBGMBCCBCWBCPBDIBCCBCDBIBBCCBCBBDDBDJBIVBCCBCWBCJBCEBDIBCCBCDBIBBGCBCDBDJBCCBNMBCCBCyBBCCBCFBFPBDZBCCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBN5BBFcBmBBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDBhBnCBCjBBFmBBCjBBCOBCMBmBlGBCGGD4LBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBH1CBDFBD-TBCbBE4CBIVBKXBKTBNMBCCBCBBN9CBDJBHJBHNBCKBH4CBIqBBGlCBLeBCLBFLBFEEBoBBDEBMrBBFZBHKBE9BBDgCBCcBDKBHJBHNBDtBBDLBVsCBClFBJ7BBEOBE9BBGqBBDKBJqBBG1QBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBSXBJuBBSBBDaBCMBEhBBPgBBQrEBF5UBXKBWz4BBD9LBGsBBCGGD3BBIBBPXBKGBCGBCGBCGBCGBCGBCGBCGBC9DBjBZBC4CBN1GBbPBC+BBC1CBDmDBGqBBC9CBC1CBKvBBCszcBE2BBK7KBV3FBJ8GBV7BBEJBH3BBJlCBJLBHzDBMdBEtCBCKBFgBBC2BBKNBDJBDmDBZbBLFBDFBDFBKGBCGBC7BBF9DBDJBHj9KBNWBFwBBloItLBDpDBnBGBNEBGZBCEBCCCBCCBCCBoUBhBpBBHyBBCSBCDBFEBCmEBF9FBEFBDFBDFBDCBEGBCGBOBBDLBCZBCSBCBBCOBDNBjB6DBGCBFsBBE3CBCMBEwBwBBsBBjEcBEwBBQbBFjBBKdBGqBBGdBCkBBFNBrB9EBDJBHjBBFjBBFnBBJzBBMLBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBCnCBJIBxBSBCBBGgBBEaBGaBnB3BBFTBDxBBCBBGHBCCBCcBDCBFJBIIBI-BBhBmBBFLBK1BBEcBDaBGZBIDBNGBxCoCB4ByBBOyBBItBBJJBHlBBEcBJBBxGeBCpBBCCBDBBRFBJIBiBtBBJpBBXZBnBbBVWBKtCBFjBBK9BBCEBOYBIJBH0BBCRBJmBBK-CBCTBMRBCuBB-BGBCCCBCBCOBCKBH6BBGJBHDBCHBDBBDVBCGBCBBCEBCJBDBBDCBDHHGGBDGBEEBMJBCDDClBBCJBCDDCDBCJBCBBJBBe7CBCEBfnCBJJBnF1BBDlBBjBkCBMJBHMBU5BBHJBHTBdaBDOBFWB6F7BBlDyCBNHBDDDBGBCBBCdBCBBDLBKJBnCHBDtBBDKBcnCBJyCBOoCBIJB3CHB5ChBBPJBHIBCsBBCNBLcBEfBDVBCNBqCGBCBBCrBBECCBCCBHBJJBHFBCBBCkBBCBBCFBIJBHrBBFJB3HYBIQBCoBBEcB2CQQBwBBO6cBnDuDBCEBMjGBtyCiDBOvhBBRVBL68DBGmSB61G5BBn2B4RBIeBCJBFwCBCJBHdBDFBLlCBLJBCGBCUBGSBxN5BBnG6CBGYBDYBtBqCBF4BBIQBhCEBMGBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBDDBh7D8HBEzNBHWBQQBQtBBDWBKzDB9B1HBLmBBDpCBJvDBWlCB7DTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBD9VBQEBCOBxiBeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBENBDJBFBBhKeBS5BBGxOxOBoBB3GqBBFhGhGBdBCVBJBBhHGBCDBCBBCOBCkGBDPBqBrCBFJBFBByYjCBtC8BBjGDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBBvIrBBFjDBNOBDOBCOBCkBBLtFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBmgB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIBnkzVvHB",!1))),this._Print}static get Upper(){return this.CATEGORIES.get("Lu")}},H(bn,"_CASE_ORBIT",null),H(bn,"_Print",null),H(bn,"CATEGORIES",new ao({C:()=>new E(_("AfBgDgBBOrWrWBHHBCBICCVuMuMnBBBzBBBE4B4BBGBcDBHQBXhGhGxBBB8BBBmDNB8BBByBBBQddBCCMEBhBGBsCiFiFJBBDBBXIICCBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBPMMBEB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKMMBDBbEByBPBDBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCB-FCBHBBHBBHBBECBIIIBLBDBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIB-BGGBLBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMBxhBPBXJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBF-6DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBrCHBxDUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIlkzVBxHvw-FB",!1)),Cc:()=>new E(_("AfgDgB",!0)),Cf:()=>new E(_("tFzqBzqBBEBXhGhGyBhMhMBxCxCs5D9-B9-BBDBbEByBEBCJBw03B6H6HBBBimEQQj7IPBhjiBDBwmFHBn0rYffB+CB",!1)),Cn:()=>new E(_("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBDBvzIBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-BB---BBB---BBB",!1)),Co:()=>new E(_("gg4B-nGh4hc9--BD9--B",!0)),Cs:()=>new E(_("gg2B--B",!0)),L:()=>new E(_("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICCiEEBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoCaBFDBuBqBBkBBBCiDBCQQBIIBLLBBBDRRCdBe4CBMZZBfBKBBFGGBUBFKKEYYBXBIKBGXBCGBRpBB7B1BBETTIJBQPBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNGB7BBBCCCBDBCXBCCCBIBCBBKDDBDBCWWBCBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNSSBkBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBkBFFkC4CBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBzC+C+CBtBBSHB3BdBOBBLrBBbjBBqBCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBhC1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBF1B1BB8zC8zCBjHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBxC2O2OBrBrBBDBGBBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBReBDlCByBIBDmDBDxCBVQBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBdRRBDBCJBLEBCoBBYCBCHBVWBEEEBwBBCEEBDDBDBDCCZCBDKBICBNFBDFBDFBKGBCGBCqBBCNBHyDBej9KBNWBFwBBloItLBDpDBnBGBNEBGCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBxB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOjBBnBbBKWB7HpBBHBBRFB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB1D-BBgBHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBqBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBGjCjCBLBhCBBCPPBNNB0mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBn7F0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFBmI9BBzEsBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCCBCBBCGBDEBKBBhHGBCDBCBBCOBCkGB8BjCBI1lB1lBBCBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),LC:()=>new E(_("hCZBHZB7BLLBVBCeBCiGBCDBFvGBDZBhGDBDBBECBCHHCCBCCCBSBCyCBCqEBJlFBClBBKoBB44ClBBCGGDqBBDCBhV1CBDFBjkCKBGqBBDCBhCrBBgCMBChBBmD1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGBmIFFDJBCEEBDBHGCBCBCFBFDDBCBGEBF1B1BB8zC8zCB6DBDmDBHDBEBBNlBBCGGzoetBBTbBnEtCBCWBEDBCsCBZBBE2Z2ZBpBBGIBIvCBh6TGBNEBqgBZBHZBmlBvCBhDjBBFjBB1DKBCOBCGBCBBCKBCOBCGBCBBk2ByBBOyBB+CVBLVB74C-BBhrV-BBhBYBDYBtpZ0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BJBCTBHFB2uCjCB",!1)),Ll:()=>new E(_("hDZB7BqBqBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDZBiGCCEEEBBBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBDCB5XFBjkCIBC2D2DBqBBgCMBChBBnD0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBBzIEEBEEcKFDBBJDBF2B2Bs1CvBBCEEBGCFCCBCCBEBGiDCBIICFFNlBBCGG0oesBCUaCoEMCBBBC+BCBGBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCbEE2ZqBBGIBIvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFB4vChBB",!1)),Lm:()=>new E(_("wVRBFLBPEBICCmEGG-OnHnHlFBBuIBBFgBgBKEEhFoFoF1mBgEgE2R72B72BsDkTkTxOFBvF+BBOjBjBBjBByVOORMBg-CBByHgGgG2OsBsBBDBGiDiDB+C+CBBB34bjnBjnBBEBvIzDzDdBB6DIBxCYYpDDBEBB2OXXqEtDtDWBBoDDBKngVngVuBBBh-BFBCpBBCIB0sBhBhB2K04D04DnrTDB9PCBpBBBnRMBhCBBCPPB9-P9-PBCBCGBCBByhM9BBqGGBud0Q0QsSAB",!1)),Lo:()=>new E(_("qFQQhIFFBCBxGBB7ZaBFDBuBfBCJBkBBBCiDBCZZBLLBBBDRRCdBe4CBMZZBfBWVBrBYBIKBGXBCGBRoBB8B1BBETTIJBROBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNFB8BBBCCCBDBCXBCCCBIBCBBKDDBDBYDBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNyDyDBnKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPByDrTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBpBkCkCBhBBC0BBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBxFuBBSHB3BdBOBBLrBBbjBBqBCBLdByDDBCFBCBBE7hB7hBBCB4-C3BBZWBKGBCGBCGBCGBCGBCGBCGBCGBoR2B2BF1CBJCCB4CBFGGBpBBC9CBSfBxBPBhQ-tGBhC0wUBC2jBBkCnBBJrIBFPBLBBjCyByBBkCBqFoDoDEGBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBuBEBDIBLEBCoBBYCBCHBVPBCFBEEEBwBBCEEBDDBDBDCCZBBEKBIPPBEBDFBDFBKGBCGByEiBBej9KBNWBFwBBloItLBDpDBkCCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBqDJBCsBBDeBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBhEtCBjDnBBJzBB9CzBBN2JBKVBLHB5EFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4FjBBnBDBCxJxJBoBBHBBRCBCBB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB0GHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBnBBCBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBB0BUBGSB0NnBB2MqCBGwFwFB0mHBqBfBiDyDBuwIiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBxzI2P2PBrBBiBiKiKBcBTrBBlPaBmHdBDwGwGBdBCCBCBBCGBDEBKiHiHBFBCDBCBBCOBCkGB8pBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Lt:()=>new E(_("lOGDnB2sH2sHBGBJHBJHBNQQwBAB",!1)),Lu:()=>new E(_("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBG+B+B9zCvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBB",!1)),M:()=>new E(_("gYvDB0IGBoIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCgBB3BCBCRBCGBLBBeCB5BCCBFBDBBDCBKLLBbbDCB5BCCBDBFBBDCBEffBEEMCB5BCCBGBCCBCCBVBBXFBCCB5BCCBFBDBBDCBICBLBBf8B8BBDBECBCDBKpBpBBDB4BCCBFBCCBCDBIBBMBBeCB5BCCBFBCCBCDBIBBMBBQNNBCB4BBBCGBCCBCDBKLLBeeBBBnCFFBEBCCCBGBTBB+BDDBFBNHBjDDDBHBMGBqCBBcECFBByBTBCBBGKBCjBBKlDlDBSBYDBFCBCCBDGBEDBOLBCLLBCBgWCBzdDBdCBeBBfBBhCfBKuBuBBBBC2D2DBjBjB3DLBFLB8GEB6BJBCcBDxBxBBsBBDLBVEBwBQBnBIBNCBfMB5BNBxBTB5ECBCUBFHHDCBnG-BBxWgBB--CCBuEhDhDBeBrRFBqDBB1udDBCJBhBBBxCBBxIEEFYYBDBF0C0CBzBzBBQBbRBOnBnBBGBaMBtBDBwBNBlBkCkCBMBNJJBuBuBBBBzBCCBBBDBBGBBCqBqBBDBGBBtHHBCBBx5TiXiXBOBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB7DCB2BOBqBDDBLLBCBuBKBI+B+BBBBlBNBRBBtBNNBBBxBNBJDBCBB9CLBHDD+ELBWDB4BBBCGBDBBDCBKLLBDDBFBEEBkCIBCDDCDBCEBCPPBzCzCBQBYyCyCBSBsHGBDIBcBBzCQBrDMBmDOBhIOB2HFBCBBDDBCCCBuEuEBFBDGBEddBIBpBGBCDBJKKBJBvBPBnGHBoGHBCHBzCVBCNB7DFBECCBCCBFBCjCjCBDBCBBCEB8KDBKBBCxBxBBFBEEBYmnFmnFHOBpmLRBhuCEB8BGB5gBCCB1BBIDByCMMBslTslTBizEizEBsBBDWB-QEBEFBJHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB",!1)),Mc:()=>new E(_("joC4B4BDCBJDBCBBzBBB7BCBHBBDBBLsBsB7BCBjC7B7BBBBJCCB2B2BB7B7BCHHBDDBLLnDBBCBBECBCCBLqBqBBBB+BDB+BBB7BCCBDBDBBCBBKBBdPPB7B7BBBBGCBCCBLrBrBBsCsCBBBHHBTBBrKBBgCsFsFBFFHDDBaaBLLBBBDGBWBBDFBDLLBBB5zBffiEIIBGBCBB7KDBDCBFBBCFBhHBB7BCCKCCBJJBEByExBxBGCCBDBCBB+BffFBBD9B9BDCBCEEBxBxBBGBJBBsFWW35EBB0-dBBD5C5CBzBzBBOBvEBBwBxBxBBFFBDDBBBvDBBDBBZuBuBCuDuDDBBGuHuHBCCBCCBCC0gZCCgEuBuBBBBFBB0DZZB8B8BxBCBKBBO+C+CBBBEBBCrFrFBBBgBBB7BBBCDBDBBDCBKLLB1C1CBBBIDDCDBCBBCmDmDBBBJBBErDrDBBBHCCBCBDuHuHBBBHDBDyDyDBBBJBBCuDuDCBBHoDoDCBBFmImIBBBK4H4HBEBCBBFDDCvEvEBBBJDBF1C1CeBB-BqGqGECCoGPPrDIID2G2GBDBFBBC-K-KBNNxBBBJBBCpvQpvQBBBlxD2BBpDBB0rYBBHFB",!1)),Me:()=>new E(_("okBBB1xF-wB-wBBCBCCBsshBCB",!1)),Mn:()=>new E(_("gYvDB0IEBqIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCfB4BCCFHBFEEBFBLBBe7B7BFDBJVVBbbDBB6BFFBFFBDDBBBEffBEEMBB6BFFBDBCBBFVVBXXBEBC7B7BDCCBCBJIIBMMBff+BNNzBEE4BCCBBBGCBCDBIBBMBBe7B7BDHHGBBVBBdBB6BBBFDBJVVBeepCIIBBBC7C7CDGBNHBjDDDBHBMGBqCBBcEC4BNBCEBCBBGKBCjBBKnDnDBCBCFBCBBDBBaBBFCBRDBODDBHHQgWgWBBBzdCBeBBfBBfBBhCBBCGBJDDBJBKuBuBBBBC2D2DBjBjB3DCBFBBKHHBBB8GBBD7B7BCGBCCCDHBHJBDxBxBBMBCeBDLBVDBxBCCBDBCGGpBIBNBBhBDBDBBCCB5BCCBEECCB7BHBDBB5ECBCMBCGBFHHEBBnG-BBxWMBFEEBKB--CCBuEhDhDBeBrRDBsDBB1udFFBIBhBBBxCBBxIEEFaaBGG4EBBbRBOnBnBBGBaKBvBCBxBDDBCBDBBoBkCkCBEBDBBDBBNJJwB0B0BCCBDBBGBBCrBrBBJJvHDDFx5Tx5TiXPBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB8D3B3BBNBqBDDBLLBBByBDBDBBI+B+BBBBlBEBCHB-BNNB1B1BBHBLDBDgDgDBBBDCCBHHD+E+EEHBWBB6BBBEmBmBBFBEEBnCFBOECPBB2CHBDCBCYY1CFBCFFBCCBvHvHBCBHBBCBBcBB2CHBDCCBrDrDCDDBEBCmDmDCDDBCBCEBkIIBCBBhIBBCFFxEDBDBBFhBhBBIBpBFBDDBJKKBEBDCBvBMBCBBnGCCBBBCqGqGBFBCFBCzCzCBUBDGBCBBCBB7DFBECCBCCBFBCpCpCBEEC8K8KBMMB1B1BBDBGCCYmnFmnFHOBpmLLBECBhuCEB8BGB5gBgCgCBCByC5lT5lTBizEizEBsBBDWBhRCBSHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB",!1)),N:()=>new E(_("wBJB5DBBGDDBBBitBJBnEJBnGJB9MJB3DJBFFBtDJB3DJB3DJBDFBvDMB0DJBJGBoDJBpDGBISBuDJBhDJB3DJBnCTBtIJBnCJBwWTBybCBwHJBHJBXJBtJJBhEKBmFJBHJB3FJB3CJBnEJBHJB3gBEEBEBHJBnGyBBDEB3W7BBvCVB3TdBqrBqYqYaIBPCB4KDBrEJBfHBCOBhBJBoBOBh7cJB9FJBhKFB7EJBnBJBnGJBXJB3CJB3MJB34UJBuPsBBN4BBSBB2KaBlBDBeJJnEEBrGJBvdHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBxBJBHJB3IeB-EJBrBDBxDGBnEdBhEJB9BJBxEJBITB8HJB3KJB3DJB3LJBnDJBHTBtCLBlNSB+CJB3UJB3CcBkHJBnCJB3BJBnLJBnDUBshBuDBimPJBnpCJB3CJBnEJBCGBvQJBnIWB+KCB6nXJBnuBTBNTBtDYB2iBxBBhqCJBnNJB3PJB4HJBtWIBhEJB4Y6BBCCBCDBtCsBBCOBjeMBk3CJB",!1)),Nd:()=>new E(_("wBJnxBJnEJnGJ9MJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJhDJ3DJnCJ3IJnCJn6BJnBJtJJhEJnFJHJ3FJ3CJnEJHJnuiBJnVJnBJnGJXJ3CJ3MJ34UJnsBJnkCJHJ9YJhEJ9BJxEJ3IJ3KJ3DJ3LJnDJHTtCJnNJnDJ3UJ3CJ3HJnCJ3BJnLJ3uQJnpCJ3CJnEJ3QJ37XJ12CxBhqCJnNJ3PJ4HJ2aJ30EJ",!0)),Nl:()=>new E(_("u3FCBwzCiBBDDB-zDaaBHBPCBs1dJBxyW0BBtOJJnEEBrhIuDBm8SCB",!1)),No:()=>new E(_("yFBBGDDBBB2pCFB5LFB5DCBmEGB6GGBSIByNJB2hBTB0jBJBhP20B20BEFBHJBnGPBqB3W3WB6BBvCVB3TdBqrB1kB1kBBCBrEJBfHBCOBhBJBoBOBxrdFBymWsBBiCDBSBB2KaBlBDB1pBHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBhLeB-EJBrBDBxDGBnETB8LTBmqBBBvNIBobSB0aUBn8SGB-YWBqhZTBNTBtDYBvqFIBid6BBCCBCDBtCsBBCOBjeMB",!1)),P:()=>new E(_("hBCBCFBCDBLBBEBBbCBCccCkBkBGEELBBEEE-VJJzOFBqBBB0BCCDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCmBmBBCBoCrCrCBDBFBBwDFBsFlTlTBHB4EuTuTtBBBvCCBoCBB+ECBCCBmBKB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBM9Z9ZBWBJTBCMBCLBfBBPBB6TDBeBB+hBNBwCBBgBJB0MVBgCDBhBBB8XDBCBBxDwEwEBtBBCfBDLBkNCBFJBDLBRNNjD7C7CjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HzqUzqUBxGxGBIBXiBBCNBCFFCBB2ECBCFBCDBLBBEBBbCBCccCCCBFB7MCB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDByO-J-JjBlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB",!1)),Pc:()=>new E(_("-Cg-Hg-HBUU-u3BBBZCBwHAB",!1)),Pd:()=>new E(_("tB9qB9qB0BiyDiyDmgBqgCqgCBEBiwDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J",!1)),Pe:()=>new E(_("pB0B0BgB+1D+1DC-6B-6BqtC4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECtBGCtNICEGCDBB-ozB6G6GeOCESSCCCrF0B0BgBGD",!1)),Pf:()=>new E(_("7F+6H+6HEddpuDCCFDDQEE",!1)),Pi:()=>new E(_("rFt7Ht7HDBBDaapuDCCFDDQEE",!1)),Po:()=>new E(_("hBCBCCBDECBLLBEEBcclCGGPBBI-V-VJzOzOBEBqB3B3BDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCxDxDrCEBFBBwDFBsFlTlTBHBmY9D9DBBBoCBB+ECBCCBmBFBCDB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBMjajaBJJBGBJIBDDBDCBEKBCCCBIB7kDDBCBBxDwEwEBFFBBBDDDBHBCBBCDDBLLBDBCJBDDBCCCBLBDCBtNCB6B+F+FjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HlxUlxUBFBDXXVBBDDBECBCDBICBHCCB2E2EBBBCCBDECBLLBEEBcclBDDB7M7MBBB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDB0ZlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB",!1)),Ps:()=>new E(_("oBzBzBgB-1D-1DC-6B-6B-rCEEnB4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECaTTCECtNICEGCDipzBipzB4GeeCMCESSCCCrFzBzBgBEEDAB",!1)),S:()=>new E(_("kBHHRCBgBCCcCCkBEBCBBDCCBCBDEEfgBgBrODBNNBGGBCCCBPB2DPPBxDxDsErIrIBBB3DCBDDDBvGvGLUUB4H4HIBBpEqLqLBHHB2H2H-DjEjEBGBlEwGwGqBmGmGiGCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WuLuLlL+E+EBgBBiLJBKIBhiBCCBBBMCBOCBOCBOBBmCOOoBCBOCBUhBB-BBBCDBCBBLCCBBBGFBCECFMMBFFBDBGDBC7B7BBFFB2LBFcBD+HBXKByCtCBXnTBtBwBBDeBLyMBX+BBFfBD1LBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBB8CBB0HBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BB6RWBKBBoDBB+EDBLDB+RCBiHPPB+9T+9TpEgBBuLPBhCBB3BHBtBDBjDCCBBBD7E7EHRRBBBgBCCcCCiEGBCGBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSmWmWBiKiKBGBnjC2kC2kCBbBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQQBgDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBrbaagBaagBaagBaagBaa9B-PB4BDBzBHBCNBCBBp2BwNwNttCEE+DiOiOBvIvIBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB",!1)),Sc:()=>new E(_("kB+D+DBCBqnB8D8DzPBBzPBBI2H2HoImSmS8sClmClmCBgBB37hBkuVkuVtD7E7E8GBBEBB3-HDB-4wBxtCxtC",!1)),Sk:()=>new E(_("+CCCoCHHFEEqQDBNNBGGBCCCBPB2DPPBjoBjoB15FCCBBBMCBOCBOCBOBB9kEBBkzdWBKBBoDBBxePPBniUniUBPB8bCCjF4g9B4g9BBDB",!1)),Sm:()=>new E(_("rBRRBBB+BCCuBFFmBgBgB-XwQwQBBB8xGOOoBCBOCBsEoBoBBDBHlClCBDBGBBFGDIgBgBBDDCgBgBBqIBhBBB7CffBXBpBFB2OKK3BHBwDxKxKBDBDeBLPBhIiEBX+BBFfBDhIBxBUBDFB9+zB5Z5ZCCBlFRRBBB+BCCkEHHBCBitDBBhrwBx+Bx+BagBgBagBgBagBgBagBgBat5Ft5FB-uC-uCBHB",!1)),So:()=>new E(_("mFDDFCCyerIrIBgEgEBvGvGLUUB4H4HkQ2L2LjEFBClElEwGqBqBoMCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WzWzW+EhBBiLJBKIBksBBBCDBCBBLCCBHHBEBCECFMMBPPCBBC7B7BBKKBDBDDBCBBCBBCGBCeBDBBCCCBdBtIHBFTBDGBDwCBCdBanBBHnCBXKByCtCBX2FBCIBC1BBJuDBC3HBtBrBBhC-HBhQvBBWBBHmBBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBBxKBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BBibDBLBBC+R+RBBBqqUPBuLPBhCBB3BHBuBCBlPEEFBBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSpgBpgBBGBnjC2kC2kCBGBFQBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQPBhDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBqlB-PB4BDBzBHBCNBCBBp2B96C96CiEyWyWBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E6HBG4WBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBB-B3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB",!1)),Z:()=>new E(_("gBgEgEgvFgsCgsCBJBeBBGwBwBh9DAB",!1)),Zl:()=>new E(_("ohIA",!0)),Zp:()=>new E(_("phIA",!0)),Zs:()=>new E(_("gBgEgEgvFgsCgsCBJBlBwBwBh9DAB",!1)),ASCII_Hex_Digit:()=>new E(_("wBJIFbF",!0)),Alphabetic:()=>new E(_("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICC3CeeBQBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoBNBCCCBCCBCCJaBFDBeKBG3BBCGBPlDBCHBFHBFCBLCBDRRBuBBOkDBZgBBKBBFGGBWBDSBUYBIKBGXBCGBIJJBoBBLLBEGBHrCBCPBCCBFOBOSBCHBDBBDVBCGBCEEBCBEHBDBBDBBCJJFBBCEBNBBLFFBBBCFBFBBDVBCGBCBBCBBCBBFEBFBBDBBFIIBCBCSSBEBMCBCIBCCBCVBCGBCBBCEBEIBCCBCBBEQQBCBWDBFCBCHBDBBDVBCGBCBBCEBEHBDBBDBBKBBFBBCEBORRBCCBEBECBCDBEBBCCCBEEBEEBBBELBFEBECBCCBEHHpBMBCCBCWBCPBEHBCCBCCBJBBCCBCBBDDBdDBCHBCCBCWBCJBCEBEHBCCBCCBJBBGCBCDBOCBNMBCCBCoBBDHBCCBCCBCGGBCBIEBXFBCCBCRBEXBCIBCDDBFBJFBCCCBGBTBBO5BBGGBH0B0BBECBDBCXBCCCBRBCCBDEBCHHPDBhBgCgCBGBCjBBFSBFPBCjBBkC2BBCDDBDBR-BBLDBDlBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBEKBITBMUBNTBNMBCCBCBBNzBBDSBPFFkC4CBIqBBGlCBLeBCLBFIBYdBDEBMrBBFZB3BbBF+BBDTBzBYYBMMBBByBzBBCOBCHB0BpBBDDBLrBBCKBP2BBXCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBUhBBM1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBFSSBnBBuZzBB34BkHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBCfBwB2O2OBBBaIBIEBDEBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBGHBEwDBoBIBDmDBDxCBVUBCgBBZzBBNjCBCtBtBBEBECCBBBLgBBGiBBOcBEyBBCLBQRRBOBLEBC2BBKNBTWBEkCBCCCZCBDPBDDBMFBDFBDFBKGBCGBCqBBCNBH6DBWj9KBNWBFwBBloItLBDpDBnBGBNEBGLBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmC0BBsIcBEwBBwBfBOdBGqBBGdBDjBBFHBCEBrB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCDBCBBGHBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOnBBjBbBEGGBVB7HpBBCBBEBBRFBzBCBEcBLJJBUBrBRBvBUBcWBKlCBsBEBL4BBKOOBXBYyBBSDBJiBBEKKB+BBCDBKBBLCCkBRBChBBDHHBCB-BGBCCCBCBCOBCJBI4BBYDBCHBDBBDVBCGBCBBCEBEHBDBBDBBEHHGGBdJBCDDClBBCJBCDDCDBCBBECCtBhCBCCBCDBVCBfhCBDBBC5F5FB0BBDGBaFBjB+BBCEE8B1BBDoCoCBZBDNBWGB6F4BBoD-BBgBHBDDDBGBCBBCdBCBBDBBDDB+CHBDtBBDFBCCCBccBxBBDJBSnCBGTTBnCBoDHB5CgBBgBIBCsBBCGBCyByBBcBDVBCNBqCGBCBBCrBBECCBCCBBBCDDBZZBEBCBBCkBBCBBCDBCYYBqBBlIWBKQBCoBBECBwDwCwCB4cBnDuDBSjGBtyCgDBQvhBBSFBa68DBGmSB61GuBBy2B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBF4BBIQBhCBBCNNBFBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBFi7Fi7FBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCVBJBBhHGBCDBCBBCOBCkGB8BjCBEEE1lBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1TZBHZBHZB3zD-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Dash:()=>new E(_("tB9qB9qB0BiyDiyDmgBqgCqgCBEB+BoBoBQnMnMlgDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J",!1)),Emoji:()=>new E(_("jBHHGJBwDFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDrGrGhFBBNBBPDDBIBsCZBCBBYVVDIBWBBvFhBBDvDBDBBCCBDyCBDCBCmIBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDDBEJBECCBEEDJBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB",!1)),Emoji_Component:()=>new E(_("jBHHGJB0+H2G2Gsp3B3+8B3+8BBYB8PEBxtBDBtzhY-CB",!1)),Emoji_Modifier:()=>new E(_("7-8DE",!0)),Emoji_Modifier_Base:()=>new E(_("9wJ8G8GRDB4jzD9B9BBBBDDDBBB2DBBDKBWSBEFFBBBCCBICCZqGqGBFFWFFBvFvFBBBEEB0CRRBBBKMMgSDDJHBHKKBIBDCB5B+B+BBCCBCCSCBCMBmHCBrBIB",!1)),Emoji_Presentation:()=>new E(_("64IBBuGDBEDDqQBBWBBzBLBsBUUOJJBSSBGGBJJGWWIBBCFFDIIFBBdkBkBCFFBBBC+B+BBBBZPP8aBB0BFFvlxDrGrG-FDDBIBsCZBCZZVDDBDBCCBWBBvFgBBNIBClCBCVBNqBBFEBNQBEEEBlCBCCCB5FBD+BBODBCXBTbbBOO3C0CBxBlCBHEEBBBDDBEDBMBBIIBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB",!1)),Extended_Pictographic:()=>new E(_("pFFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDoBoBBCBlDLBQBBQPPBmBmBBIBxDBBNBBPDDBIBU3BBcOBLVVDIBCDBKWBH7FBDvDBDBBCCBDyCBDCBCDBG9HBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDQBECCBEBDMB7GlBBNDB5BHBLFBpBHBfBBNDBDNBKmBBNuBBCJBC4FB5CHBPxEBhI9fB",!1)),Hex_Digit:()=>new E(_("wBJIFbFq1-BJIFbF",!0)),Lowercase:()=>new E(_("hDZBwBLLFlBlBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDiBBIBBfEBhDsBsBCEEDDBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBCDB5XFBjkCIBC2D2DB+FBiC0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBB6DOORMBuDEEBEEcKFDBBJDBFiBiBBOBFsasaBYBn6BvBBCEEBGCFCCBCCBGBEiDCBIICFFNlBBCGG0oesBCUaCBBBmEMCBBBC8BCBIBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCWDBCCCBBB2ZqBBCNBHvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBkODDBBBCpBBCIBmoByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFBmI9BB1lChBB",!1)),Math:()=>new E(_("rBRRBBBgBeeCuBuBFmBmBgB5W5WBBBDbbBDDBBBwQCBuwGccBBBMEEOPPBCBWEBMEBiCMBFEEBFFBDBTFFDJBCDDBEBHEEBDDBCCBBBCFBENBClClCBWBCFBCBBFBBFfBCHHBPPBqIBJDBVBB7CffBZBCZZMGB+NBBNJBFFBFBBDBBEEBPCCDFBMHBGBB6BCCeDBKCBxK-BBhI-PBxBUBDFB9+zB4Z4ZBEBCjFjFRCBeCCeCCkEHHBCBitDBBhrwBwoBwoBBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBBhwFDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB-uCIB",!1)),Quotation_Mark:()=>new E(_("iBFFkEQQ96HHBaBBowDqOqOBCBOCBixzBDB+FFF7CBB",!1)),Terminal_Punctuation:()=>new E(_("hBLLCMMBEE-ZJJiQ6B6BpCPPCCB1FsBsBBJBCsHsHB3B3BBEBCHBgBmImIB1nB1nBBtFtFFFB4JBB2YHBmY9D9DBBBoCBB+ECBEoBoBBCBDBB7JBBjLDBjFBBLBBCCBeCB8FEB-BBBldYYBKKBBBwlDCBzJOOFLLCBBEBBtNBB8ndBBuICBkHEB-LBB3CBBgD4E4EBBB0ECBgERRB6H6HnxUDDB6B6BBBBCDBqFLLCMMBEEiCDD7hBxBxBnkBoGoG3JBB5EFBlCFB6CDB5dEBtBDB+FGBxDDBgECBiEBBHRRB5C5CBDBtDrJrJB2D2DBBBNBBnLDBEOBqDBB6HCBmQCC8HBB4CBBFBB-MCBuBmUmUBrCrCBspBspBBDB6vRBBmEiCiCBBBLqRqRBoJoJBnwTnwTovHDB",!1)),Uppercase:()=>new E(_("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBGbbBOBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBBvgCZBHZBHZB",!1)),White_Space:()=>new E(_("JEBTlDlDbgvFgvFgsCKBeBBGwBwBh9DAB",!1))})),H(bn,"SCRIPTS",new ao({Adlam:()=>new E(_("go6DrCFJFB",!0)),Ahom:()=>new E(_("g4lCaDOFW",!0)),Anatolian_Hieroglyphs:()=>new E(_("ggxCmS",!0)),Arabic:()=>new E(_("gwBEBCFBCNBCCBCfBCJBMZBCrDBChBBxCvBBxHhBBGqCBCcBxy8BtPBDvEBhBPBxDEBCmEBk7DeBkCFBJIBiBFBh43BDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB",!1)),Armenian:()=>new E(_("xpBlBDxBDCks9BE",!0)),Avestan:()=>new E(_("g4iC1BEG",!0)),Balinese:()=>new E(_("g4GsCCxB",!0)),Bamum:()=>new E(_("g1pB3CpowB4R",!0)),Bassa_Vah:()=>new E(_("w26CdDF",!0)),Batak:()=>new E(_("g+GzBJD",!0)),Bengali:()=>new E(_("gsCDBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYB",!1)),Beria_Erfe:()=>new E(_("g17CYDY",!0)),Bhaiksuki:()=>new E(_("ggnCICsBCNLc",!0)),Bopomofo:()=>new E(_("qXB6wLqBxDf",!0)),Brahmi:()=>new E(_("ggkCtCFjBKA",!0)),Braille:()=>new E(_("ggK-H",!0)),Buginese:()=>new E(_("gwGbDB",!0)),Buhid:()=>new E(_("g6FT",!0)),Canadian_Aboriginal:()=>new E(_("ggF-TxRlC7tgCP",!0)),Carian:()=>new E(_("g1gCwB",!0)),Caucasian_Albanian:()=>new E(_("wphCzBMA",!0)),Chakma:()=>new E(_("gokC0BCR",!0)),Cham:()=>new E(_("gwqB2BKNDJDD",!0)),Cherokee:()=>new E(_("g9E1CDFz7lBvC",!0)),Chorasmian:()=>new E(_("w9jCb",!0)),Common:()=>new E(_("AgCBbFBbuBBCOBCEBYgBgBiOmBBGEBDTB1DKKHCC+THHPEEhB9E9ElQiEiEB6mB6mB2MDBjJwvBwvBBBBoCBBsGBBCumBumBOIIBCBCFBCCBDmYmYBKBD2CBCKBEKBCOBShBB-BlBBCCBDFBCaBCQBqBCBF5UBXKBW-cBhIzTBDpEBhQ9CBzMUBCCCBXBQHBFDB8CBBE7C7CB0E0EBOBhBlBBKxBxBB+BBgBwCBwB5C5CBmFBhuG-BBhoWhBBnDCBmFJB1HhFhFsMPPBzuUzuUBxGxGBIBXiBBCSBCDB0ECCBeBbFBbKBLuBuBBhChCBFBCGBLEBjICBFsBBEIBxCMB0BsBBlHaBltuBDB96D8HBEzNBHWBQQBgDzDB9B1HBLmBBD9BBEQBJBBIdBF8BB2GTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBByjFjCBtC8BBjWrBBFjDBNOBDOBCOBCkBBLtFB5BZBCBBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBnghYffB+CB",!1)),Coptic:()=>new E(_("ifNxkKzDGG",!0)),Cuneiform:()=>new E(_("ggoC5cnDuDCEMjG",!0)),Cypriot:()=>new E(_("ggiCFBDCCBqBBCBBEDD",!1)),Cypro_Minoan:()=>new E(_("w8rCiD",!0)),Cyrillic:()=>new E(_("ggBkEBDoFBx6FKBhFtCtCojEfBhie-CBv8VBBhw4B9BBiBAB",!1)),Deseret:()=>new E(_("gghCvC",!0)),Devanagari:()=>new E(_("goCwCFODZh7nBfhwcJ",!0)),Dives_Akuru:()=>new E(_("gomCGBDDDBGBCBBCdBCBBDLBKJB",!1)),Dogra:()=>new E(_("ggmC7B",!0)),Duployan:()=>new E(_("ggvDqDGMEIIJDD",!0)),Egyptian_Hieroglyphs:()=>new E(_("ggsC1iBL68D",!0)),Elbasan:()=>new E(_("gohCnB",!0)),Elymaic:()=>new E(_("g-jCW",!0)),Ethiopic:()=>new E(_("gwEoCBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBnvGWBKGBCGBCGBCGBCGBCGBCGBCGBjpfFBDFBDFBKGBCGBylvCGBCDBCBBCOB",!1)),Garay:()=>new E(_("gqjClBEcJB",!0)),Georgian:()=>new E(_("glElBBCGGDqBBCDBx8CqBBDCBhiElBBCGG",!1)),Glagolitic:()=>new E(_("ggL-Ch9sDGCQDGCBCE",!0)),Gothic:()=>new E(_("w5gCa",!0)),Grantha:()=>new E(_("g4kCDBCHBDBBDVBCGBCBBCEBDIBDBBDCBDHHGGBDGBEEB",!1)),Greek:()=>new E(_("wbDBCCBDDBCFFCCCBBBCCCBSBC+BBPPBnpGEBzBEBFEB1ChKhKBUBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBoJ-xiB-xiB7uVuCBSgj0Bgj0BBkCB",!1)),Gujarati:()=>new E(_("h0CCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGB",!1)),Gunjala_Gondi:()=>new E(_("grnCFCBCkBCBCFIJ",!0)),Gurmukhi:()=>new E(_("hwCCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPB",!1)),Gurung_Khema:()=>new E(_("go4C5B",!0)),Han:()=>new E(_("g0LZBC4CBN1GBwBCCaIBPDBle-tGBhC-vUBhoWtLBDpDBpodBBNGBqgkB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Hangul:()=>new E(_("goE-HvxHBiI9CyDeiCei3dckUj9KNWFwBl9JeEFDFDFDC",!0)),Hanifi_Rohingya:()=>new E(_("gojCnBJJ",!0)),Hanunoo:()=>new E(_("g5FU",!0)),Hatran:()=>new E(_("gniCSCBGE",!0)),Hebrew:()=>new E(_("xsB2BBJaBFFBpp9BZBCEBCCCBCCBCCBIB",!1)),Hiragana:()=>new E(_("hiM1CBHCBi7-C+IBTeeBBBulQAB",!1)),Imperial_Aramaic:()=>new E(_("giiCVCI",!0)),Inherited:()=>new E(_("gYvDB2IBBlOKBbhXhXBCB8qEtBBDLBlPCBCMBCGBFHHEBBnG-BBtQBBjGgBB65DDBsDBBmrzBPBRNBwejHjH7iEl+uBl+uBBsBBDWBhRCBSHBDGBfDBz6rYvHB",!1)),Inscriptional_Pahlavi:()=>new E(_("g7iCSGH",!0)),Inscriptional_Parthian:()=>new E(_("g6iCVDH",!0)),Javanese:()=>new E(_("gsqBtCDJFB",!0)),Kaithi:()=>new E(_("gkkCiCLA",!0)),Kannada:()=>new E(_("gkDMCCCWCJCEDICCCDIBGCCDDJCC",!0)),Katakana:()=>new E(_("hlM5CBDCBxHPBxGuBBC3CBvgzBJBCsBBzisBDBCGBCBBCgJgJBBBzBPPBCB",!1)),Kawi:()=>new E(_("g4nCQCoBEc",!0)),Kayah_Li:()=>new E(_("goqBtBCA",!0)),Kharoshthi:()=>new E(_("gwiCDCBGHCCCcDCFJII",!0)),Khitan_Small_Script:()=>new E(_("k-7C84G84GB0OBqBAB",!1)),Khmer:()=>new E(_("g8F9CDJHJnPf",!0)),Khojki:()=>new E(_("gwkCRCuB",!0)),Khudawadi:()=>new E(_("w1kC6BGJ",!0)),Kirat_Rai:()=>new E(_("gq7C5B",!0)),Lao:()=>new E(_("h0DBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDB",!1)),Latin:()=>new E(_("hCZBHZBwBQQGWBCeBCgOBoBEB8wGlBBHwBBGDBGMBClCBiC-HByLOORMBuEBBHccSoBB42CfBj1elDBExCBVOBxZqBBCIBCDB38TGB7gBZBHZBmhCFBCpBBCIBm61BeBHFB",!1)),Lepcha:()=>new E(_("ggH3BEOEC",!0)),Limbu:()=>new E(_("goGeBCLBFLBFEEBKB",!1)),Linear_A:()=>new E(_("gwhC2JKVLH",!0)),Linear_B:()=>new E(_("gggCLCZCSCBCODNjB6D",!0)),Lisu:()=>new E(_("wmpBvBx1eA",!0)),Lycian:()=>new E(_("g0gCc",!0)),Lydian:()=>new E(_("gpiCZGA",!0)),Mahajani:()=>new E(_("wqkCmB",!0)),Makasar:()=>new E(_("g3nCY",!0)),Malayalam:()=>new E(_("goDMCCCyBCCCFFPDZ",!0)),Mandaic:()=>new E(_("giCbDA",!0)),Manichaean:()=>new E(_("g2iCmBFL",!0)),Marchen:()=>new E(_("wjnCfDVCN",!0)),Masaram_Gondi:()=>new E(_("gonCGBCBBCrBBECCBCCBHBJJB",!1)),Medefaidrin:()=>new E(_("gy7C6C",!0)),Meetei_Mayek:()=>new E(_("g3qBWqGtBDJ",!0)),Mende_Kikakui:()=>new E(_("gg6DkGDP",!0)),Meroitic_Cursive:()=>new E(_("gtiCXFTDtB",!0)),Meroitic_Hieroglyphs:()=>new E(_("gsiCf",!0)),Miao:()=>new E(_("g47CqCF4BIQ",!0)),Modi:()=>new E(_("gwlCkCMJ",!0)),Mongolian:()=>new E(_("ggGBBDCCBSBH4CBIqBB2t-BMB",!1)),Mro:()=>new E(_("gy6CeCJFB",!0)),Multani:()=>new E(_("g0kCGBCCCBCBCOBCKB",!1)),Myanmar:()=>new E(_("ggE-EhqmBeiDfxibT",!0)),Nabataean:()=>new E(_("gkiCeJI",!0)),Nag_Mundari:()=>new E(_("wm5DpB",!0)),Nandinagari:()=>new E(_("gtmCHDtBDK",!0)),New_Tai_Lue:()=>new E(_("gsGrBFZHKEB",!0)),Newa:()=>new E(_("gglC7CCE",!0)),Nko:()=>new E(_("g+B6BDC",!0)),Nushu:()=>new E(_("h-7CvsQvsQBqMB",!1)),Nyiakeng_Puachue_Hmong:()=>new E(_("go4DsBENDJFB",!0)),Ogham:()=>new E(_("g0Fc",!0)),Ol_Chiki:()=>new E(_("wiHvB",!0)),Ol_Onal:()=>new E(_("wu5DqBFA",!0)),Old_Hungarian:()=>new E(_("gkjCyBOyBIF",!0)),Old_Italic:()=>new E(_("g4gCjBKC",!0)),Old_North_Arabian:()=>new E(_("g0iCf",!0)),Old_Permic:()=>new E(_("w6gCqB",!0)),Old_Persian:()=>new E(_("g9gCjBFN",!0)),Old_Sogdian:()=>new E(_("g4jCnB",!0)),Old_South_Arabian:()=>new E(_("gziCf",!0)),Old_Turkic:()=>new E(_("ggjCoC",!0)),Old_Uyghur:()=>new E(_("w7jCZ",!0)),Oriya:()=>new E(_("h4CCCHDBDVCGCBCEDIDBDCICFBCEDR",!0)),Osage:()=>new E(_("wlhCjBFjB",!0)),Osmanya:()=>new E(_("gkhCdDJ",!0)),Pahawh_Hmong:()=>new E(_("g46ClCLJCGCUGS",!0)),Palmyrene:()=>new E(_("gjiCf",!0)),Pau_Cin_Hau:()=>new E(_("g2mC4B",!0)),Phags_Pa:()=>new E(_("giqB3B",!0)),Phoenician:()=>new E(_("goiCbEA",!0)),Psalter_Pahlavi:()=>new E(_("g8iCRIDNG",!0)),Rejang:()=>new E(_("wpqBjBMA",!0)),Runic:()=>new E(_("g1FqCEK",!0)),Samaritan:()=>new E(_("ggCtBDO",!0)),Saurashtra:()=>new E(_("gkqBlCJL",!0)),Sharada:()=>new E(_("gskC-ChsCH",!0)),Shavian:()=>new E(_("wihCvB",!0)),Siddham:()=>new E(_("gslC1BDlB",!0)),Sidetic:()=>new E(_("gqiCZ",!0)),SignWriting:()=>new E(_("gg2DrUQECO",!0)),Sinhala:()=>new E(_("hsDCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBt-gCTB",!1)),Sogdian:()=>new E(_("w5jCpB",!0)),Sora_Sompeng:()=>new E(_("wmkCYIJ",!0)),Soyombo:()=>new E(_("wymCyC",!0)),Sundanese:()=>new E(_("g8G-BhIH",!0)),Sunuwar:()=>new E(_("g+mChBPJ",!0)),Syloti_Nagri:()=>new E(_("ggqBsB",!0)),Syriac:()=>new E(_("g4BNC7BDCxIK",!0)),Tagalog:()=>new E(_("g4FVKA",!0)),Tagbanwa:()=>new E(_("g7FMCCCB",!0)),Tai_Le:()=>new E(_("wqGdDE",!0)),Tai_Tham:()=>new E(_("gxG+BCcDKHJHN",!0)),Tai_Viet:()=>new E(_("g0qBiCZE",!0)),Tai_Yo:()=>new E(_("g25DeCVJB",!0)),Takri:()=>new E(_("g0lC5BHJ",!0)),Tamil:()=>new E(_("i8CBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBm+kCxBBOAB",!1)),Tangsa:()=>new E(_("wz6CuCCJ",!0)),Tangut:()=>new E(_("g-7CgBgBB+3GBhQeBiDyDB",!1)),Telugu:()=>new E(_("ggDMCCCWCPDICCCDIBCCCBDDDJII",!0)),Thaana:()=>new E(_("g8BxB",!0)),Thai:()=>new E(_("hwD5BGb",!0)),Tibetan:()=>new E(_("g4DnCCjBFmBCjBCOCGFB",!0)),Tifinagh:()=>new E(_("wpL3BIBPA",!0)),Tirhuta:()=>new E(_("gklCnCJJ",!0)),Todhri:()=>new E(_("guhCzB",!0)),Tolong_Siki:()=>new E(_("wtnCrBFJ",!0)),Toto:()=>new E(_("w04De",!0)),Tulu_Tigalari:()=>new E(_("g8kCJBCDDClBBCJBCDDCDBCJBCBBJBB",!1)),Ugaritic:()=>new E(_("g8gCdCA",!0)),Unknown:()=>new E(_("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-FB",!1)),Vai:()=>new E(_("gopBrJ",!0)),Vithkuqi:()=>new E(_("wrhCKCOCGCBCKCOCGCB",!0)),Wancho:()=>new E(_("g24D5BGA",!0)),Warang_Citi:()=>new E(_("glmCyCNA",!0)),Yezidi:()=>new E(_("g0jCpBCCDB",!0)),Yi:()=>new E(_("ggoBskBE2B",!0)),Zanabazar_Square:()=>new E(_("gwmCnC",!0))})),H(bn,"FOLD_CATEGORIES",new ao({L:()=>new E(_("laA",!0)),LC:()=>new E(_("laA",!0)),Ll:()=>new E(_("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGC3HrBrBCEEJHHCCBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHxC9zC9zCBuBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB",!1)),Lt:()=>new E(_("kOCCBCCBCClBCCtsHHBJHBJHBMQQwBAB",!1)),Lu:()=>new E(_("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpL2B2Bs1CvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB",!1)),M:()=>new E(_("5cgBgBlgHAB",!1)),Mn:()=>new E(_("5cgBgBlgHAB",!1)),Emoji:()=>new E(_("8mJA",!0)),Extended_Pictographic:()=>new E(_("8mJA",!0)),Lowercase:()=>new E(_("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHuBPBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB",!1)),Math:()=>new E(_("ycGDCHHFMMDDDCHHFAB",!1)),Uppercase:()=>new E(_("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpLiBiBBOBFsasaBYBn6BvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB",!1))})),H(bn,"FOLD_SCRIPT",new ao({Common:()=>new E(_("8cgBgB",!1)),Greek:()=>new E(_("1FwUwU",!1)),Inherited:()=>new E(_("5cgBgBlgHAB",!1))})),bn),pe,Y=(pe=class{static isUnsearchable(e){return e===pe.RUNE_ERROR||e>=pe.MIN_HIGH_SURROGATE&&e<=pe.MAX_LOW_SURROGATE}static is32(e,t){let n=0,s=e.length;for(;n<s;){const i=n+Math.floor((s-n)/2),o=e.getLo(i),B=e.getHi(i);if(o<=t&&t<=B){const u=e.getStride(i);return(t-o)%u===0}t<o?s=i:n=i+1}return!1}static is(e,t){if(t<=pe.MAX_LATIN1){for(let n=0;n<e.length;n++){if(t>e.getHi(n))continue;const s=e.getLo(n);if(t<s)return!1;const i=e.getStride(n);return(t-s)%i===0}return!1}return e.length>0&&t>=e.getLo(0)&&pe.is32(e,t)}static isUpper(e){if(e<=pe.MAX_LATIN1){const t=String.fromCodePoint(e);return t.toUpperCase()===t&&t.toLowerCase()!==t}return pe.is(ct.Upper,e)}static isPrint(e){return e<=pe.MAX_LATIN1?e>=32&&e<pe.MAX_ASCII||e>=161&&e!==173:pe.is(ct.Print,e)}static simpleFold(e){if(ct.CASE_ORBIT.has(e))return ct.CASE_ORBIT.get(e);if(e<=pe.MAX_ASCII){const t=k.toLowerCase(e);return t!==e?t:k.toUpperCase(e)}return e}static equalsIgnoreCase(e,t){if(e===t)return!0;if(e<0||t<0)return!1;if(e<=pe.MAX_ASCII&&t<=pe.MAX_ASCII)return 65<=e&&e<=90&&(e|=32),65<=t&&t<=90&&(t|=32),e===t;for(let n=pe.simpleFold(e);n!==e;n=pe.simpleFold(n))if(n===t)return!0;return!1}},H(pe,"MAX_RUNE",1114111),H(pe,"RUNE_ERROR",65533),H(pe,"MAX_ASCII",127),H(pe,"MAX_LATIN1",255),H(pe,"MAX_BMP",65535),H(pe,"MIN_FOLD",65),H(pe,"MAX_FOLD",125251),H(pe,"MIN_HIGH_SURROGATE",55296),H(pe,"MAX_HIGH_SURROGATE",56319),H(pe,"MIN_LOW_SURROGATE",56320),H(pe,"MAX_LOW_SURROGATE",57343),H(pe,"MIN_SUPPLEMENTARY_CODE_POINT",65536),pe);const Ou=256,gC=new Uint8Array(Ou);for(let r=0;r<Ou;r++)gC[r]=97<=r&&r<=122||65<=r&&r<=90||48<=r&&r<=57||r===95?1:0;let pB=null,gB=null;var Ae,$=(Ae=class{static emptyInts(){return[]}static isByteArray(e){return Array.isArray(e)||Object.prototype.toString.call(e)==="[object Uint8Array]"}static isalnum(e){return k.CODES.get("0")<=e&&e<=k.CODES.get("9")||k.CODES.get("a")<=e&&e<=k.CODES.get("z")||k.CODES.get("A")<=e&&e<=k.CODES.get("Z")}static unhex(e){return k.CODES.get("0")<=e&&e<=k.CODES.get("9")?e-k.CODES.get("0"):k.CODES.get("a")<=e&&e<=k.CODES.get("f")?e-k.CODES.get("a")+10:k.CODES.get("A")<=e&&e<=k.CODES.get("F")?e-k.CODES.get("A")+10:-1}static escapeRune(e){let t="";if(Y.isPrint(e))Ae.METACHARACTERS.indexOf(String.fromCodePoint(e))>=0&&(t+="\\"),t+=String.fromCodePoint(e);else switch(e){case k.CODES.get('"'):t+='\\"';break;case k.CODES.get("\\"):t+="\\\\";break;case k.CODES.get("	"):t+="\\t";break;case k.CODES.get(`
`):t+="\\n";break;case k.CODES.get("\r"):t+="\\r";break;case k.CODES.get("\b"):t+="\\b";break;case k.CODES.get("\f"):t+="\\f";break;default:{let n=e.toString(16);e<256?(t+="\\x",n.length===1&&(t+="0"),t+=n):t+=`\\x{${n}}`;break}}return t}static stringToRunes(e){const t=String(e),n=[];let s=0;for(;s<t.length;){const i=t.codePointAt(s);n.push(i),s+=i>Y.MAX_BMP?2:1}return new Int32Array(n)}static runeToString(e){return String.fromCodePoint(e)}static isWordRune(e){return e<Ou?gC[e]===1:!1}static emptyOpContext(e,t){let n=0;return e<0&&(n|=Ae.EMPTY_BEGIN_TEXT|Ae.EMPTY_BEGIN_LINE),e===10&&(n|=Ae.EMPTY_BEGIN_LINE),t<0&&(n|=Ae.EMPTY_END_TEXT|Ae.EMPTY_END_LINE),t===10&&(n|=Ae.EMPTY_END_LINE),Ae.isWordRune(e)!==Ae.isWordRune(t)?n|=Ae.EMPTY_WORD_BOUNDARY:n|=Ae.EMPTY_NO_WORD_BOUNDARY,n}static quoteMeta(e){return e.split("").map(t=>Ae.METACHARACTERS.indexOf(t)>=0?`\\${t}`:t).join("")}static charCount(e){return e>Y.MAX_BMP?2:1}static toArray(e){const t=e.length,n=new Array(t);for(let s=0;s<t;s++)n[s]=e[s];return n}static stringToUtf8ByteArray(e){if(globalThis.TextEncoder)return pB||(pB=new TextEncoder),pB.encode(e);{let t=[],n=0;for(let s=0;s<e.length;s++){let i=e.charCodeAt(s);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=i&63|128):(i&64512)===Y.MIN_HIGH_SURROGATE&&s+1<e.length&&(e.charCodeAt(s+1)&64512)===Y.MIN_LOW_SURROGATE?(i=Y.MIN_SUPPLEMENTARY_CODE_POINT+((i&1023)<<10)+(e.charCodeAt(++s)&1023),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=i&63|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=i&63|128)}return t}}static utf8ByteArrayToString(e){if(globalThis.TextDecoder){gB||(gB=new TextDecoder("utf-8"));const t=e instanceof Uint8Array?e:new Uint8Array(e);return gB.decode(t)}else{let t=[],n=0,s=0;for(;n<e.length;){let i=e[n++];if(i<128)t[s++]=String.fromCharCode(i);else if(i>191&&i<224){let o=e[n++];t[s++]=String.fromCharCode((i&31)<<6|o&63)}else if(i>239&&i<365){let o=e[n++],B=e[n++],u=e[n++],c=((i&7)<<18|(o&63)<<12|(B&63)<<6|u&63)-Y.MIN_SUPPLEMENTARY_CODE_POINT;t[s++]=String.fromCharCode(Y.MIN_HIGH_SURROGATE+(c>>10)),t[s++]=String.fromCharCode(Y.MIN_LOW_SURROGATE+(c&1023))}else{let o=e[n++],B=e[n++];t[s++]=String.fromCharCode((i&15)<<12|(o&63)<<6|B&63)}}return t.join("")}}},H(Ae,"METACHARACTERS","\\.+*?()|[]{}^$"),H(Ae,"EMPTY_BEGIN_LINE",1),H(Ae,"EMPTY_END_LINE",2),H(Ae,"EMPTY_BEGIN_TEXT",4),H(Ae,"EMPTY_END_TEXT",8),H(Ae,"EMPTY_WORD_BOUNDARY",16),H(Ae,"EMPTY_NO_WORD_BOUNDARY",32),H(Ae,"EMPTY_ALL",-1),Ae);const mC=(r=[],e=0)=>{const t=Object.create(null);for(let n=0;n<r.length;n++){const s=r[n],i=e+n;t[s]=i,t[i]=s}return Object.freeze(t)};var xn,Tr=(xn=class{getEncoding(){throw Error("not implemented")}asCharSequence(){throw Error("not implemented")}asBytes(){throw Error("not implemented")}length(){throw Error("not implemented")}isUTF8Encoding(){return this.getEncoding()===xn.Encoding.UTF_8}isUTF16Encoding(){return this.getEncoding()===xn.Encoding.UTF_16}},H(xn,"Encoding",mC(["UTF_16","UTF_8"])),xn),Ch=class extends Tr{constructor(r=null){super(),this.bytes=r}getEncoding(){return Tr.Encoding.UTF_8}asCharSequence(){return $.utf8ByteArrayToString(this.bytes)}asBytes(){return this.bytes}length(){return this.bytes.length}},Ow=class extends Tr{constructor(r=null){super(),this.charSequence=r}getEncoding(){return Tr.Encoding.UTF_16}asCharSequence(){return this.charSequence}asBytes(){return $.stringToUtf8ByteArray(this.charSequence.toString())}length(){return this.charSequence.length}},lr=class{static utf16(r){return new Ow(r)}static utf8(r){return $.isByteArray(r)?new Ch(r):new Ch($.stringToUtf8ByteArray(r))}},Bt=class{static EOF(){return-8}constructor(){this.end=0}canCheckPrefix(){return!0}endPos(){return this.end}hasString(){return!1}hasAnyString(){return!1}prefixLength(){return 0}},Ft,Nw=(Ft=class extends Bt{constructor(e,t=0,n=e.length){super(),this.bytes=e,this.start=t,this.end=n}hasString(e,t){const n=e.bytes;if(n.length===0)return!0;const s=this.indexOf(this.bytes,n,this.start+t);return s!==-1&&s<=this.end-n.length}hasAnyString(e,t){return e.automaton8().searchUTF8(this.bytes,this.start+t,this.end)}step(e){if(e+=this.start,e>=this.end)return Bt.EOF();const t=this.bytes[e]&255;if(t<128)return t<<3|1;let n,s,i=128,o=191;if(t>=194&&t<=223)n=2,s=t&31;else if(t>=224&&t<=239)n=3,s=t&15,t===224?i=160:t===237&&(o=159);else if(t>=240&&t<=244)n=4,s=t&7,t===240?i=144:t===244&&(o=143);else return Ft.RUNE_ERROR_STEP;if(e+n>this.end)return Ft.RUNE_ERROR_STEP;const B=this.bytes[e+1]&255;if(B<i||B>o)return Ft.RUNE_ERROR_STEP;if(s=s<<6|B&63,n>2){const u=this.bytes[e+2]&255;if((u&192)!==128)return Ft.RUNE_ERROR_STEP;if(s=s<<6|u&63,n>3){const c=this.bytes[e+3]&255;if((c&192)!==128)return Ft.RUNE_ERROR_STEP;s=s<<6|c&63}}return s<<3|n}index(e,t){t+=this.start;const n=this.indexOf(this.bytes,e.prefixUTF8,t);return n<0?n:n-t}context(e){e+=this.start;let t=-1;if(e>this.start&&e<=this.end){let s=e-1;if(t=this.bytes[s--],t>=128){let i=e-4;for(i<this.start&&(i=this.start);s>=i&&(this.bytes[s]&192)===128;)s--;s<this.start&&(s=this.start);const o=this.step(s-this.start);t=s+(o&7)===e?o>>3:Y.RUNE_ERROR}}const n=e<this.end?this.step(e-this.start)>>3:-1;return $.emptyOpContext(t,n)}indexOf(e,t,n=0){let s=t.length;if(s===0)return n<=this.end?n:-1;const i=t[0];let o=this.end-s;const B=typeof e.indexOf=="function";let u=n;for(;u<=o;){if(B){if(u=e.indexOf(i,u),u===-1||u>o)return-1}else{for(;u<=o&&e[u]!==i;)u++;if(u>o)return-1}let c=!0;for(let h=1;h<s;h++)if(e[u+h]!==t[h]){c=!1;break}if(c)return u;u++}return-1}prefixLength(e){return e.prefixUTF8.length}},H(Ft,"RUNE_ERROR_STEP",Y.RUNE_ERROR<<3|1),Ft),Fw=class extends Bt{constructor(r,e=0,t=r.length){super(),this.charSequence=r,this.start=e,this.end=t}hasString(r,e){const t=this.charSequence.indexOf(r.str,this.start+e);return t!==-1&&t<=this.end-r.str.length}hasAnyString(r,e){return r.automaton16().searchUTF16(this.charSequence,this.start+e,this.end)}step(r){if(r+=this.start,r>=this.end)return Bt.EOF();const e=this.charSequence.charCodeAt(r);if(e<Y.MIN_HIGH_SURROGATE||e>Y.MAX_HIGH_SURROGATE||r+1>=this.end)return e<<3|1;const t=this.charSequence.charCodeAt(r+1);return t>=Y.MIN_LOW_SURROGATE&&t<=Y.MAX_LOW_SURROGATE?(e-Y.MIN_HIGH_SURROGATE)*1024+(t-Y.MIN_LOW_SURROGATE)+Y.MIN_SUPPLEMENTARY_CODE_POINT<<3|2:e<<3|1}index(r,e){e+=this.start;const t=this.charSequence.indexOf(r.prefix,e);return t<0||t>this.end-r.prefix.length?-1:t-e}context(r){r+=this.start;const e=r>this.start&&r<=this.end?this.charSequence.charCodeAt(r-1):-1,t=r<this.end?this.charSequence.charCodeAt(r):-1;return $.emptyOpContext(e,t)}prefixLength(r){return r.prefix.length}},Ie=class{static fromUTF8(r,e=0,t=r.length){return new Nw(r,e,t)}static fromUTF16(r,e=0,t=r.length){return new Fw(r,e,t)}},Si=class extends Error{constructor(r){super(r),this.name="RE2JSException"}},ye=class extends Si{constructor(r,e=null){let t=`error parsing regexp: ${r}`;e&&(t+=`: \`${e}\``),super(t),this.name="RE2JSSyntaxException",this.message=t,this.error=r,this.input=e}getDescription(){return this.error}getPattern(){return this.input}},mB=class extends Si{constructor(r){super(r),this.name="RE2JSCompileException"}},ut=class extends Si{constructor(r){super(r),this.name="RE2JSGroupException"}},Lw=class extends Si{constructor(r){super(r),this.name="RE2JSFlagsException"}},Ws=class extends Si{constructor(r){super(r),this.name="RE2JSInternalException"}},fr,ph=(fr=class{static quoteReplacement(e,t=!1){return t?e.indexOf("\\")<0&&e.indexOf("$")<0?e:e.split("").map(n=>{const s=n.codePointAt(0);return s===k.CODES.get("\\")||s===k.CODES.get("$")?`\\${n}`:n}).join(""):e.indexOf("$")<0?e:e.split("").map(n=>n.codePointAt(0)===k.CODES.get("$")?"$$":n).join("")}constructor(e,t){if(e===null)throw new Error("pattern is null");this.patternInput=e;const n=this.patternInput.re2();this.patternGroupCount=n.numberOfCapturingGroups(),this.groups=[],this.namedGroups=n.namedGroups,this.numberOfInstructions=n.numberOfInstructions(),this.lookbehindState=null,t instanceof Tr?this.resetMatcherInput(t):$.isByteArray(t)?this.resetMatcherInput(lr.utf8(t)):this.resetMatcherInput(lr.utf16(t))}pattern(){return this.patternInput}reset(){return this.matcherInputLength=this.matcherInput.length(),this.appendPos=0,this.hasMatch=!1,this.hasGroups=!1,this.anchorFlag=0,this}resetMatcherInput(e){if(e===null)throw new Error("input is null");return e instanceof Tr||($.isByteArray(e)?e=lr.utf8(e):e=lr.utf16(e)),this.matcherInput=e,this.lookbehindState!==null?this.lookbehindState.reset():this.lookbehindState=this.patternInput.re2().createLookbehindState(),this.reset(),this}start(e=0){if(typeof e=="string"){const t=this.namedGroups[e];if(!Number.isFinite(t))throw new ut(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e]}end(e=0){if(typeof e=="string"){const t=this.namedGroups[e];if(!Number.isFinite(t))throw new ut(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e+1]}programSize(){return this.numberOfInstructions}group(e=0){if(typeof e=="string"){const s=this.namedGroups[e];if(!Number.isFinite(s))throw new ut(`group '${e}' not found`);e=s}const t=this.start(e),n=this.end(e);return t<0&&n<0?null:this.substring(t,n)}getNamedGroups(){if(!this.hasMatch)throw new ut("perhaps no match attempted");const e=Object.create(null);for(const t of Object.keys(this.namedGroups))e[t]=this.group(t);return e}groupCount(){return this.patternGroupCount}loadGroup(e){if(!Number.isInteger(e)||e<0||e>this.patternGroupCount)throw new ut(`Group index out of bounds: ${e}`);if(!this.hasMatch)throw new ut("perhaps no match attempted");if(e===0||this.hasGroups)return;const t=this.matcherInputLength,n=this.patternInput.re2().matchMachineInput(this.matcherInput,this.groups[0],t,this.anchorFlag,1+this.patternGroupCount,this.lookbehindState);if(!n[0])throw new ut("inconsistency in matching group data");this.groups=n[1],this.hasGroups=!0}matches(){return this.genMatch(0,U.ANCHOR_BOTH)}lookingAt(){return this.genMatch(0,U.ANCHOR_START)}find(e=null){if(e!==null){if(!Number.isInteger(e)||e<0||e>this.matcherInputLength)throw new ut(`start index out of bounds: ${e}`);return this.reset(),this.genMatch(e,0)}if(e=0,this.hasMatch&&(e=this.groups[1],this.groups[0]===this.groups[1])){const t=(this.matcherInput.isUTF16Encoding()?Ie.fromUTF16(this.matcherInput.asCharSequence(),0,this.matcherInputLength):Ie.fromUTF8(this.matcherInput.asBytes(),0,this.matcherInputLength)).step(e);t<0?e++:e+=t&7}return this.genMatch(e,U.UNANCHORED)}genMatch(e,t){const n=this.patternInput.re2().matchMachineInput(this.matcherInput,e,this.matcherInputLength,t,1,this.lookbehindState);return n[0]?(this.groups=n[1],this.hasMatch=!0,this.hasGroups=this.patternGroupCount===0,this.anchorFlag=t,!0):(this.hasMatch=!1,!1)}substring(e,t){return this.matcherInput.isUTF8Encoding()?$.utf8ByteArrayToString(this.matcherInput.asBytes().slice(e,t)):this.matcherInput.asCharSequence().substring(e,t).toString()}inputLength(){return this.matcherInputLength}appendReplacement(e,t=!1){let n="";const s=this.start(),i=this.end();return this.appendPos<s&&(n+=this.substring(this.appendPos,s)),this.appendPos=i,n+=t?this.appendReplacementInternalJava(e):this.appendReplacementInternalJs(e),n}appendReplacementInternalJava(e){let t="",n=0;const s=e.length;let i=0;for(;i<s;){const o=e.codePointAt(i);if(o===k.CODES.get("\\")){if(n<i&&(t+=e.substring(n,i)),i++,i>=s)throw new ut("character to be escaped is missing");n=i,i++;continue}if(o===k.CODES.get("$")){if(n<i&&(t+=e.substring(n,i)),i+1>=s)throw new ut("Illegal group reference: group index is missing");const B=e.codePointAt(i+1);if(k.CODES.get("0")<=B&&B<=k.CODES.get("9")){let u=B-k.CODES.get("0"),c=i+2;for(;c<s;c++){const d=e.codePointAt(c);if(d<k.CODES.get("0")||d>k.CODES.get("9")||u*10+d-k.CODES.get("0")>this.patternGroupCount)break;u=u*10+d-k.CODES.get("0")}if(u>this.patternGroupCount)throw new ut(`n > number of groups: ${u}`);const h=this.group(u);h!==null&&(t+=h),i=c,n=i}else if(B===k.CODES.get("{")){let u=i+2;for(;u<s&&e.codePointAt(u)!==k.CODES.get("}");)u++;if(u>=s)throw new ut("named capture group is missing trailing '}'");const c=e.substring(i+2,u),h=this.group(c);h!==null&&(t+=h),i=u+1,n=i}else throw new ut("Illegal group reference");continue}i++}return n<s&&(t+=e.substring(n,s)),t}appendReplacementInternalJs(e){let t="",n=0;const s=e.length;for(let i=0;i<s-1;i++)if(e.codePointAt(i)===k.CODES.get("$")){let o=e.codePointAt(i+1);if(k.CODES.get("$")===o){n<i&&(t+=e.substring(n,i)),t+="$",i++,n=i+1;continue}else if(k.CODES.get("&")===o){n<i&&(t+=e.substring(n,i));const B=this.group(0);B!==null?t+=B:t+="$&",i++,n=i+1;continue}else if(k.CODES.get("`")===o){n<i&&(t+=e.substring(n,i)),t+=this.substring(0,this.start(0)),i++,n=i+1;continue}else if(k.CODES.get("'")===o){n<i&&(t+=e.substring(n,i)),t+=this.substring(this.end(0),this.matcherInputLength),i++,n=i+1;continue}else if(k.CODES.get("1")<=o&&o<=k.CODES.get("9")){let B=o-k.CODES.get("0");for(n<i&&(t+=e.substring(n,i)),i+=2;i<s&&(o=e.codePointAt(i),!(o<k.CODES.get("0")||o>k.CODES.get("9")||B*10+o-k.CODES.get("0")>this.patternGroupCount));i++)B=B*10+o-k.CODES.get("0");if(B>this.patternGroupCount){t+=`$${B}`,n=i,i--;continue}const u=this.group(B);u!==null&&(t+=u),n=i,i--;continue}else if(o===k.CODES.get("<")){n<i&&(t+=e.substring(n,i)),i++;let B=i+1;for(;B<e.length&&e.codePointAt(B)!==k.CODES.get(">")&&e.codePointAt(B)!==k.CODES.get(" ");)B++;if(B===e.length||e.codePointAt(B)!==k.CODES.get(">")){t+=e.substring(i-1,B+1),n=B+1,i=B;continue}const u=e.substring(i+1,B);if(Object.prototype.hasOwnProperty.call(this.namedGroups,u)){const c=this.group(u);c!==null&&(t+=c)}else t+=`$<${u}>`;n=B+1,i=B;continue}}return n<s&&(t+=e.substring(n,s)),t}appendTail(){return this.substring(this.appendPos,this.matcherInputLength)}replaceAll(e,t=!1){return this.replace(e,!0,t)}replaceFirst(e,t=!1){return this.replace(e,!1,t)}replace(e,t=!0,n=!1){let s="";this.reset();const i=typeof e=="function",o=Object.keys(this.namedGroups).length>0;let B=null;if(i){if(this.groupCount()>=fr.MAX_REPLACER_ARGS)throw new ut("Too many capture groups to safely invoke replacer function");B=this.matcherInput.isUTF8Encoding()?this.matcherInput.asBytes():this.matcherInput.asCharSequence()}for(;this.find()&&(s+=i?this.appendReplacementFunc(e,o,B):this.appendReplacement(e,n),!!t););return s+=this.appendTail(),s}appendReplacementFunc(e,t,n){let s="";const i=this.start(),o=this.end();this.appendPos<i&&(s+=this.substring(this.appendPos,i)),this.appendPos=o;const B=this.buildReplacerArgs(i,t,n);return s+=String(e(...B)),s}buildReplacerArgs(e,t,n){const s=[this.group(0)],i=this.groupCount();for(let o=1;o<=i;o++){const B=this.start(o);B<0?s.push(void 0):s.push(this.substring(B,this.end(o)))}if(s.push(e),s.push(n),t){const o=this.getNamedGroups();for(const B in o)o[B]===null&&(o[B]=void 0);s.push(o)}return s}},H(fr,"MAX_REPLACER_ARGS",65535),fr),fe,L=(fe=class{static isRuneOp(e){return fe.RUNE<=e&&e<=fe.RUNE_ANY_NOT_NL}static escapeRunes(e){let t='"';for(let n of e)t+=$.escapeRune(n);return t+='"',t}constructor(e){this.op=e,this.out=0,this.arg=0,this.runes=new Int32Array(0),this.next=null}matchRune(e){if(this.runes.length===1){const o=this.runes[0];return(this.arg&U.FOLD_CASE)!==0?Y.equalsIgnoreCase(o,e):e===o}const t=this.runes.length;if(t===0)return!1;if(t===2||t===4||t===6||t===8){for(let o=0;o<t;o+=2){if(e<this.runes[o])return!1;if(e<=this.runes[o+1])return!0}return!1}let n=0,s=t>>1;for(;s>1;){const o=s>>1;n+=this.runes[n+o<<1]<=e?o:0,s-=o}n+=this.runes[n<<1]<=e?1:0;const i=n-1;return i>=0&&e<=this.runes[i<<1|1]}matchRunePos(e){if(this.runes.length===1){const o=this.runes[0];return(this.arg&U.FOLD_CASE)!==0?Y.equalsIgnoreCase(o,e)?0:-1:e===o?0:-1}const t=this.runes.length;if(t===0)return-1;if(t===2||t===4||t===6||t===8){for(let o=0;o<t;o+=2){if(e<this.runes[o])return-1;if(e<=this.runes[o+1])return Math.floor(o/2)}return-1}let n=0,s=t>>1;for(;s>1;){const o=s>>1;n+=this.runes[n+o<<1]<=e?o:0,s-=o}n+=this.runes[n<<1]<=e?1:0;const i=n-1;return i>=0&&e<=this.runes[i<<1|1]?i:-1}toString(){switch(this.op){case fe.ALT:return`alt -> ${this.out}, ${this.arg}`;case fe.ALT_MATCH:return`altmatch -> ${this.out}, ${this.arg}`;case fe.CAPTURE:return`cap ${this.arg} -> ${this.out}`;case fe.EMPTY_WIDTH:return`empty ${this.arg} -> ${this.out}`;case fe.MATCH:return`match${this.arg!==0?` ${this.arg}`:""}`;case fe.FAIL:return"fail";case fe.NOP:return`nop -> ${this.out}`;case fe.LB_WRITE:return`lbwrite ${this.arg} -> ${this.out}`;case fe.LB_CHECK:return`lbcheck ${this.arg} -> ${this.out}`;case fe.RUNE:return this.runes===null?"rune <null>":["rune ",fe.escapeRunes(this.runes),(this.arg&U.FOLD_CASE)!==0?"/i":""," -> ",this.out].join("");case fe.RUNE1:return`rune1 ${fe.escapeRunes(this.runes)} -> ${this.out}`;case fe.RUNE_ANY:return`any -> ${this.out}`;case fe.RUNE_ANY_NOT_NL:return`anynotnl -> ${this.out}`;default:throw new Error("unhandled case in Inst.toString")}}},H(fe,"ALT",1),H(fe,"ALT_MATCH",2),H(fe,"CAPTURE",3),H(fe,"EMPTY_WIDTH",4),H(fe,"FAIL",5),H(fe,"MATCH",6),H(fe,"NOP",7),H(fe,"RUNE",8),H(fe,"RUNE1",9),H(fe,"RUNE_ANY",10),H(fe,"RUNE_ANY_NOT_NL",11),H(fe,"LB_WRITE",12),H(fe,"LB_CHECK",13),fe),dr,gh=(dr=class{constructor(e){this.sparse=new Int32Array(e),this.densePcs=new Int32Array(e),this.denseCaps=null,this.size=0,this.ncap=0,this.mainThreads=0}init(e){this.ncap=e;const t=Math.min(this.densePcs.length,dr.INITIAL_THREADS)*e;(!this.denseCaps||this.denseCaps.length<t)&&(this.denseCaps=new Int32Array(t))}growCaps(e){const t=this.densePcs.length*this.ncap,n=new Int32Array(Math.min(t,Math.max(e,2*this.denseCaps.length)));n.set(this.denseCaps),this.denseCaps=n}contains(e){const t=this.sparse[e];return t<this.size&&this.densePcs[t]===e}isEmpty(){return this.size===0}add(e){const t=this.size++;return this.sparse[e]=t,this.densePcs[t]=e,t}clear(){this.size=0,this.mainThreads=0}toString(){let e="{";for(let t=0;t<this.size;t++)t!==0&&(e+=", "),e+=this.densePcs[t];return e+="}",e}},H(dr,"INITIAL_THREADS",32),dr),kw=class{constructor(r){this.pos=-1,this.pcs=new Int32Array(r.numInst()),this.size=0,this.lbTable=new Int32Array(r.numLb+1)}reset(){this.pos=-1,this.size=0}},xw=class EC{static fromRE2(e){const t=new EC;return t.prog=e.prog,t.re2=e,t.q0=new gh(t.prog.numInst()),t.q1=new gh(t.prog.numInst()),t.addStack=new Int32Array(2*(t.prog.numInst()+1)),t.matched=!1,t.matchcap=new Int32Array(t.prog.numCap<2?2:t.prog.numCap),t.ncap=0,t}constructor(){this.prog=null,this.re2=null,this.q0=null,this.q1=null,this.addStack=null,this.matched=!1,this.matchcap=null,this.ncap=0,this.lbTable=null}init(e){this.ncap=e,e>this.matchcap.length?this.matchcap=new Int32Array(e).fill(-1):this.matchcap.fill(-1),this.q0.init(e),this.q1.init(e),this.prog.numLb>0&&((!this.lbTable||this.lbTable.length<this.prog.numLb+1)&&(this.lbTable=new Int32Array(this.prog.numLb+1)),this.lbTable.fill(-1))}submatches(){return this.ncap===0?$.emptyInts():$.toArray(this.matchcap.subarray(0,this.ncap))}match(e,t,n,s=null){const i=this.re2.cond;if(i===$.EMPTY_ALL||(n===U.ANCHOR_START||n===U.ANCHOR_BOTH)&&t!==0)return!1;this.matched=!1,this.matchcap.fill(-1);const o=this.prog.numLb>0,B=t;let u=t,c=!1;o&&(s!==null&&s.pos>=0&&s.pos<=t?(u=s.pos,c=!0):u=0);let h=o&&s!==null,d=this.q0,C=this.q1,g=e.step(u),D=g>>3,P=g&7,N=-1,J=0;g!==Bt.EOF()&&(g=e.step(u+P),N=g>>3,J=g&7);let v;for(u===0?v=$.emptyOpContext(-1,D):v=e.context(u),o&&(c?this.restoreLookbehinds(s,d,v):this.spawnLookbehinds(d,u,v));;){if(d.mainThreads===0){if((i&$.EMPTY_BEGIN_TEXT)!==0&&u!==0||(n===U.ANCHOR_START||n===U.ANCHOR_BOTH)&&u!==0||this.matched)break;if(this.prog.numLb===0&&d.isEmpty()&&this.re2.prefix.length!==0&&N!==this.re2.prefixRune&&e.canCheckPrefix()){const Z=e.index(this.re2,u);if(Z<0)break;u+=Z,g=e.step(u),D=g>>3,P=g&7,g=e.step(u+P),N=g>>3,J=g&7,v=e.context(u)}}u>=B&&(h&&(this.saveLookbehinds(s,d,u),h=!1),!this.matched&&(u===0||n===U.UNANCHORED)&&(this.ncap>0&&(this.matchcap[0]=u),this.add(d,this.prog.start,u,this.matchcap,0,v)));const M=u+P;if(v=e.context(M),this.step(d,C,u,M,D,v,n,u===e.endPos()),P===0||this.ncap===0&&this.matched)break;u+=P,D=N,P=J,D!==-1&&(g=e.step(u+P),N=g>>3,J=g&7);const K=d;d=C,C=K}return d.clear(),C.clear(),this.matched}matchSet(e,t,n){const s=this.re2.cond;if(s===$.EMPTY_ALL)return[];if((n===U.ANCHOR_START||n===U.ANCHOR_BOTH)&&t!==0)return[];let i=this.prog.numLb>0?0:t,o=t,B=this.q0,u=this.q1,c=e.step(i),h=c>>3,d=c&7,C=-1,g=0;c!==Bt.EOF()&&(c=e.step(i+d),C=c>>3,g=c&7);let D=i===0?$.emptyOpContext(-1,h):e.context(i);const P=new Set;for(this.prog.numLb>0&&this.spawnLookbehinds(B,i,D);!(B.mainThreads===0&&((s&$.EMPTY_BEGIN_TEXT)!==0&&i!==0||(n===U.ANCHOR_START||n===U.ANCHOR_BOTH)&&i!==0));){(i===0||n===U.UNANCHORED)&&i>=o&&this.add(B,this.prog.start,i,this.matchcap,0,D);const N=i+d;D=e.context(N);for(let v=0;v<B.size;v++){const M=B.densePcs[v],K=this.prog.inst[M],Z=v*this.ncap;let Q=!1;switch(K.op){case L.MATCH:if(n===U.ANCHOR_BOTH&&i!==e.endPos())break;P.add(K.arg);break;case L.RUNE:Q=K.matchRune(h);break;case L.RUNE1:Q=h===K.runes[0];break;case L.RUNE_ANY:Q=!0;break;case L.RUNE_ANY_NOT_NL:Q=h!==10;break;default:continue}Q&&this.add(u,K.out,N,B.denseCaps,Z,D)}if(B.clear(),d===0)break;i+=d,h=C,d=g,h!==-1&&(c=e.step(i+d),C=c>>3,g=c&7);const J=B;B=u,u=J}return u.clear(),Array.from(P).sort((N,J)=>N-J)}step(e,t,n,s,i,o,B,u){const c=this.re2.longest;for(let h=0;h<e.size;h++){const d=e.densePcs[h],C=h*this.ncap;if(c&&this.matched&&this.ncap>0&&this.matchcap[0]<e.denseCaps[C])continue;const g=this.prog.inst[d];let D=!1;switch(g.op){case L.MATCH:if(B===U.ANCHOR_BOTH&&!u)break;if(this.ncap>0&&(!c||!this.matched||this.matchcap[1]<n)){e.denseCaps[C+1]=n;for(let P=0;P<this.ncap;P++)this.matchcap[P]=e.denseCaps[C+P]}c||(e.size=0),this.matched=!0;break;case L.RUNE:D=g.matchRune(i);break;case L.RUNE1:D=i===g.runes[0];break;case L.RUNE_ANY:D=!0;break;case L.RUNE_ANY_NOT_NL:D=i!==10;break;default:continue}D&&this.add(t,g.out,s,e.denseCaps,C,o)}e.clear()}spawnLookbehinds(e,t,n){for(let s=0;s<this.prog.lbStarts.length;s++)this.add(e,this.prog.lbStarts[s],t,this.matchcap,0,n)}restoreLookbehinds(e,t,n){this.lbTable.set(e.lbTable);for(let s=0;s<e.size;s++)this.add(t,e.pcs[s],e.pos,this.matchcap,0,n)}saveLookbehinds(e,t,n){let s=0;for(let i=0;i<t.size;i++){const o=t.densePcs[i];this.prog.lbInst[o]===1&&L.isRuneOp(this.prog.inst[o].op)&&(e.pcs[s++]=o)}e.size=s,e.pos=n,e.lbTable.set(this.lbTable)}add(e,t,n,s,i,o){const B=this.addStack;let u=0;for(;;){for(;t!==0&&!e.contains(t);){const h=e.add(t),d=this.prog.inst[t];switch(d.op){case L.FAIL:t=0;break;case L.ALT:case L.ALT_MATCH:B[u++]=d.arg,B[u++]=0,t=d.out;break;case L.EMPTY_WIDTH:t=(d.arg&~o)===0?d.out:0;break;case L.NOP:t=d.out;break;case L.CAPTURE:d.arg<this.ncap&&(B[u++]=-d.arg-1,B[u++]=s[i+d.arg],s[i+d.arg]=n),t=d.out;break;case L.LB_WRITE:this.lbTable[Math.abs(d.arg)]=n,t=d.out;break;case L.LB_CHECK:d.arg>0?t=this.lbTable[d.arg]===n?d.out:0:t=this.lbTable[-d.arg]!==n?d.out:0;break;case L.MATCH:case L.RUNE:case L.RUNE1:case L.RUNE_ANY:case L.RUNE_ANY_NOT_NL:if(this.prog.lbInst[t]===0&&e.mainThreads++,this.ncap>0){const C=h*this.ncap;C+this.ncap>e.denseCaps.length&&e.growCaps(C+this.ncap);for(let g=0;g<this.ncap;g++)e.denseCaps[C+g]=s[i+g]}t=0;break;default:throw new Ws("unhandled")}}if(u===0)return;u-=2;const c=B[u];c<0?(s[i-c-1]=B[u+1],t=0):t=c}}};const Vw=(r,e,t)=>{let n=-2128831035;for(let s=0;s<r.length;s++)n^=r[s],n=Math.imul(n,16777619);n^=e,n=Math.imul(n,16777619);for(let s=0;s<t.length;s++)n^=t[s],n=Math.imul(n,16777619);return n},mh=(r,e)=>{if(r.length!==e.length)return!1;for(let t=0;t<r.length;t++)if(r[t]!==e[t])return!1;return!0},EB=[],xs=-1;var Mw=class{constructor(r,e,t){this.nfaStates=r,this.flag=e,this.isMatch=(e&_C.FLAG_MATCH)!==0,this.matchIDs=t,this.next=null,this.nextAnchored=null}},ve,_C=(ve=class{constructor(e,t=8388608){this.prog=e,this.maxMem=t,this.stateCache=new Map,this.stateCount=0,this.startStates=new Map,this.failed=!1;for(let n=0;n<e.numInst();n++){const s=e.getInst(n).op;if(s===L.LB_WRITE||s===L.LB_CHECK){this.failed=!0;break}}this.computeRuneClasses(),this.stateBudget=t,this.memBudget=t}computeRuneClasses(){const e=new Set,t=(s,i)=>{e.add(s),e.add(i+1)};for(let s=0;s<this.prog.numInst();s++){const i=this.prog.getInst(s);switch(i.op){case L.RUNE:case L.RUNE1:if(i.runes.length===1){if(t(i.runes[0],i.runes[0]),(i.arg&U.FOLD_CASE)!==0)for(let o=Y.simpleFold(i.runes[0]);o!==i.runes[0];o=Y.simpleFold(o))t(o,o)}else for(let o=0;o<i.runes.length;o+=2)t(i.runes[o],i.runes[o+1]);break;case L.RUNE_ANY_NOT_NL:t(10,10);break;case L.EMPTY_WIDTH:(i.arg&($.EMPTY_BEGIN_LINE|$.EMPTY_END_LINE))!==0&&t(10,10),(i.arg&($.EMPTY_WORD_BOUNDARY|$.EMPTY_NO_WORD_BOUNDARY))!==0&&(t(48,57),t(65,90),t(95,95),t(97,122))}}e.delete(0),this.classBounds=Int32Array.from(e).sort(),this.numClasses=this.classBounds.length+1;const n=new Int32Array(Y.MAX_LATIN1+1);for(let s=0;s<=Y.MAX_LATIN1;s++)n[s]=this.searchClass(s);this.latin1Class=n}runeClass(e){return e<=Y.MAX_LATIN1?this.latin1Class[e]:this.searchClass(e)}searchClass(e){const t=this.classBounds;let n=0,s=t.length;for(;n<s;){const i=n+s>>1;t[i]<=e?n=i+1:s=i}return n}closure(e,t){const n=new Set,s=Array.from(e);let i=0;for(;s.length>0;){const o=s.pop();if(o===0||n.has(o))continue;n.add(o);const B=this.prog.getInst(o);switch(B.op){case L.ALT:case L.ALT_MATCH:s.push(B.out),s.push(B.arg);break;case L.NOP:case L.CAPTURE:s.push(B.out);break;case L.EMPTY_WIDTH:i|=B.arg,(B.arg&~t)===0&&s.push(B.out)}}return{pcs:Int32Array.from(n).sort(),needflags:i}}getState(e,t,n){const s=Vw(e,t,n);let i=this.stateCache.get(s);if(i)for(let u=0;u<i.length;u++){const c=i[u];if(c.flag===t&&mh(c.nfaStates,e)&&mh(c.matchIDs,n))return c}const o=ve.STATE_OVERHEAD+4*e.length+8*n.length;if(this.memBudget<o)return null;this.memBudget-=o,i||(i=[],this.stateCache.set(s,i));const B=new Mw(e,t,n);return i.push(B),this.stateCount++,B}makeState(e,t,n){const s=this.closure(e,t&ve.FLAG_EMPTY_MASK);let i=t;return s.needflags===0&&(i&=ve.FLAG_MATCH),i|=s.needflags<<ve.FLAG_NEED_SHIFT,this.getState(s.pcs,i,n)}allocTable(e,t){const n=this.numClasses+1,s=ve.TABLE_OVERHEAD+8*n;if(this.memBudget<s)return null;this.memBudget-=s;const i=new Array(n).fill(null);return t===U.UNANCHORED?e.next=i:e.nextAnchored=i,i}clearCache(){this.stateCache.clear(),this.stateCount=0,this.startStates.clear(),this.memBudget=this.stateBudget}resetCache(e){return this.clearCache(),this.getState(e.nfaStates,e.flag,e.matchIDs)}step(e,t,n,s){let i=s===U.UNANCHORED?e.next:e.nextAnchored;if(i!==null){const v=i[t];if(v!==null)return v}else if(i=this.allocTable(e,s),i===null)return null;const o=e.flag>>>ve.FLAG_NEED_SHIFT,B=e.flag&ve.FLAG_EMPTY_MASK;let u=B,c=0;n===10&&(u|=$.EMPTY_END_LINE,c|=$.EMPTY_BEGIN_LINE),n===xs&&(u|=$.EMPTY_END_LINE|$.EMPTY_END_TEXT);const h=(e.flag&ve.FLAG_LAST_WORD)!==0,d=n!==xs&&$.isWordRune(n);u|=d===h?$.EMPTY_NO_WORD_BOUNDARY:$.EMPTY_WORD_BOUNDARY;let C=e.nfaStates;(u&~B&o)!==0&&(C=this.closure(C,u).pcs);const g=[];let D=!1,P=EB;for(let v=0;v<C.length;v++){const M=this.prog.getInst(C[v]);M.op===L.MATCH?(D||(D=!0,P=[]),P.push(M.arg)):n!==xs&&L.isRuneOp(M.op)&&M.matchRune(n)&&g.push(M.out)}P.length>1&&P.sort((v,M)=>v-M),s===U.UNANCHORED&&n!==xs&&g.push(this.prog.start);let N=c;D&&(N|=ve.FLAG_MATCH),d&&(N|=ve.FLAG_LAST_WORD);const J=this.makeState(g,N,P);return J===null?null:(i[t]=J,J)}start(e,t){const n=e.context(t);let s;if((n&$.EMPTY_BEGIN_TEXT)!==0)s=$.EMPTY_BEGIN_TEXT|$.EMPTY_BEGIN_LINE;else if((n&$.EMPTY_BEGIN_LINE)!==0)s=$.EMPTY_BEGIN_LINE;else{const o=e.step(t),B=o>=0&&$.isWordRune(o>>3);s=(n&$.EMPTY_WORD_BOUNDARY)!==0!==B?ve.FLAG_LAST_WORD:0}let i=this.startStates.get(s);if(i===void 0){if(i=this.makeState([this.prog.start],s,EB),i===null&&(this.clearCache(),i=this.makeState([this.prog.start],s,EB),i===null))return null;this.startStates.set(s,i)}return i}stepOrReset(e,t,n,s,i,o){let B=this.step(e,t,n,s);if(B!==null)return B;if(o.resetPos>=0&&i-o.resetPos<ve.PROGRESS_PER_STATE*this.stateCount)return null;o.resetPos=i;const u=this.resetCache(e);return u===null?null:(B=this.step(u,t,n,s),B)}run(e,t,n,s,i){const o=e.endPos(),B=this.latin1Class,u=n===U.UNANCHORED,c={resetPos:-1};let h=t;for(;h<o;){const d=e.step(h),C=d>>3,g=d&7;if(g===0)break;const D=C<=Y.MAX_LATIN1?B[C]:this.runeClass(C);let P=u&&s.next!==null?s.next[D]:null;if(P===null&&(P=this.stepOrReset(s,D,C,n,h,c),P===null))return null;if(s=P,s.isMatch&&i(s,!1))return!0;if(!u&&s.nfaStates.length===0)return!1;h+=g}return s=this.stepOrReset(s,this.numClasses,xs,n,h,c),s===null?null:s.isMatch&&i(s,!0)}match(e,t,n){if(this.failed)return null;if((n===U.ANCHOR_START||n===U.ANCHOR_BOTH)&&t!==0)return!1;const s=this.start(e,t);return s===null?null:this.run(e,t,n,s,(i,o)=>n!==U.ANCHOR_BOTH||o)}matchSet(e,t,n){if(this.failed)return null;if((n===U.ANCHOR_START||n===U.ANCHOR_BOTH)&&t!==0)return[];const s=this.start(e,t);if(s===null)return null;const i=new Set,o=(B,u)=>{if(n!==U.ANCHOR_BOTH||u)for(let c=0;c<B.matchIDs.length;c++)i.add(B.matchIDs[c]);return!1};return this.run(e,t,n,s,o)===null?null:Array.from(i).sort((B,u)=>B-u)}},H(ve,"FLAG_EMPTY_MASK",255),H(ve,"FLAG_MATCH",256),H(ve,"FLAG_LAST_WORD",512),H(ve,"FLAG_NEED_SHIFT",16),H(ve,"STATE_OVERHEAD",160),H(ve,"TABLE_OVERHEAD",16),H(ve,"PROGRESS_PER_STATE",10),ve);const Gw=32,Uw=500,_B=256,Hw=262144;var Jw=class{constructor(){this.end=0,this.cap=new Int32Array(0),this.matchcap=new Int32Array(0),this.ncap=0,this.jobPc=new Int32Array(_B),this.jobArg=new Uint8Array(_B),this.jobPos=new Int32Array(_B),this.jobLen=0,this.visited=new Uint32Array(0)}reset(r,e,t){this.end=e,this.jobLen=0,this.ncap=t;const n=r.numInst()*(e+1)+Gw-1>>>5;this.visited.length<n?this.visited=new Uint32Array(n):this.visited.fill(0,0,n),this.cap.length<t?this.cap=new Int32Array(t).fill(-1):this.cap.fill(-1,0,t),this.matchcap.length<t?this.matchcap=new Int32Array(t).fill(-1):this.matchcap.fill(-1,0,t)}shouldVisit(r,e){const t=r*(this.end+1)+e,n=t>>>5,s=1<<(t&31);return(this.visited[n]&s)!==0?!1:(this.visited[n]|=s,!0)}push(r,e,t,n){if(r.prog.getInst(e).op!==L.FAIL&&(n||this.shouldVisit(e,t))){if(this.jobLen>=this.jobPc.length){const s=this.jobPc.length*2,i=new Int32Array(s);i.set(this.jobPc),this.jobPc=i;const o=new Uint8Array(s);o.set(this.jobArg),this.jobArg=o;const B=new Int32Array(s);B.set(this.jobPos),this.jobPos=B}this.jobPc[this.jobLen]=e,this.jobArg[this.jobLen]=n?1:0,this.jobPos[this.jobLen]=t,this.jobLen++}}tryBacktrack(r,e,t,n,s){const i=r.longest;for(this.push(r,t,n,!1);this.jobLen>0;){this.jobLen--;let o=this.jobPc[this.jobLen],B=this.jobArg[this.jobLen]===1,u=this.jobPos[this.jobLen],c=!0;for(;!(!c&&!this.shouldVisit(o,u));){c=!1;const h=r.prog.getInst(o);switch(h.op){case L.FAIL:throw new Ws("unexpected InstFail");case L.ALT:if(B){B=!1,o=h.arg;continue}else{this.push(r,o,u,!0),o=h.out;continue}case L.ALT_MATCH:{const d=r.prog.getInst(h.out);if(L.isRuneOp(d.op)){this.push(r,h.arg,u,!1),o=h.arg,u=this.end;continue}this.push(r,h.out,this.end,!1),o=h.out;continue}case L.RUNE:{const d=e.step(u);if(d===Bt.EOF()||!h.matchRune(d>>3))break;u+=d&7,o=h.out;continue}case L.RUNE1:{const d=e.step(u);if(d===Bt.EOF()||d>>3!==h.runes[0])break;u+=d&7,o=h.out;continue}case L.RUNE_ANY_NOT_NL:{const d=e.step(u);if(d===Bt.EOF()||d>>3===10)break;u+=d&7,o=h.out;continue}case L.RUNE_ANY:{const d=e.step(u);if(d===Bt.EOF())break;u+=d&7,o=h.out;continue}case L.CAPTURE:if(B){this.cap[h.arg]=u;break}else{h.arg<this.ncap&&(this.push(r,o,this.cap[h.arg],!0),this.cap[h.arg]=u),o=h.out;continue}case L.EMPTY_WIDTH:{const d=e.context(u);if((h.arg&~d)!==0)break;o=h.out;continue}case L.NOP:o=h.out;continue;case L.MATCH:{if(s===U.ANCHOR_BOTH&&u!==this.end)break;if(this.ncap===0)return!0;this.ncap>1&&(this.cap[1]=u);const d=this.matchcap[1];if((d===-1||i&&u>0&&u>d)&&this.matchcap.set(this.cap),!i||u===this.end)return!0;break}case L.LB_WRITE:case L.LB_CHECK:throw new Ws("Backtracker cannot evaluate Lookbehind instructions");default:throw new Ws("bad inst")}break}}return i&&this.matchcap.length>1&&this.matchcap[1]>=0}};const Bo=[];var uo=class DC{static shouldBacktrack(e){return e.numInst()<=Uw}static maxBitStateLen(e){return DC.shouldBacktrack(e)?Math.floor(Hw/e.numInst()):0}static execute(e,t,n,s,i){const o=e.cond;if(o===$.EMPTY_ALL||(s===U.ANCHOR_START||s===U.ANCHOR_BOTH)&&n!==0||(o&$.EMPTY_BEGIN_TEXT)!==0&&n!==0)return null;const B=Bo.length>0?Bo.pop():new Jw,u=t.endPos();B.reset(e.prog,u,i);let c=!1;if((o&$.EMPTY_BEGIN_TEXT)!==0||s===U.ANCHOR_START||s===U.ANCHOR_BOTH)B.ncap>0&&(B.cap[0]=n),B.tryBacktrack(e,t,e.prog.start,n,s)&&(c=!0);else{let d=-1;for(;n<=u&&d!==0;n+=d){if(e.prefix.length>0){const g=t.index(e,n);if(g<0)break;n+=g}if(B.ncap>0&&(B.cap[0]=n),B.tryBacktrack(e,t,e.prog.start,n,s)){c=!0;break}const C=t.step(n);d=C===Bt.EOF()?0:C&7}}if(!c)return Bo.push(B),null;const h=i===0?[]:$.toArray(B.matchcap.subarray(0,i));return Bo.push(B),h}},Eh=class{constructor(r){this.sparse=new Uint32Array(r),this.dense=new Uint32Array(r),this.size=0,this.nextIndex=0}empty(){return this.nextIndex>=this.size}next(){return this.dense[this.nextIndex++]}clear(){this.size=0,this.nextIndex=0}contains(r){return r<this.sparse.length&&this.sparse[r]<this.size&&this.dense[this.sparse[r]]===r}insert(r){this.contains(r)||this.insertNew(r)}insertNew(r){r>=this.sparse.length||(this.sparse[r]=this.size,this.dense[this.size]=r,this.size++)}};const jw=(r,e,t,n)=>{const s=r.length,i=e.length;let o=0,B=0;const u=[],c=[];let h=!0,d=-1;const C=g=>{const D=g?r:e,P=g?o:B,N=g?t:n;return d>0&&D[P]<=u[d]?!1:(u.push(D[P],D[P+1]),g?o+=2:B+=2,d+=2,c.push(N),!0)};for(;o<s||B<i;)if(B>=i?h=C(!0):o>=s||e[B]<r[o]?h=C(!1):h=C(!0),!h)return null;return{merged:u,next:c}};var qw=class{constructor(r){this.start=r.start,this.numCap=r.numCap,this.inst=new Array(r.inst.length);for(let e=0;e<r.inst.length;e++){const t=r.inst[e],n=new L(t.op);n.out=t.out,n.arg=t.arg,n.runes=t.runes?new Int32Array(t.runes):new Int32Array(0),n.next=null,this.inst[e]=n}}};const Kw=r=>{const e=new qw(r);for(let t=0;t<e.inst.length;t++){const n=e.inst[t];if(n.op!==L.ALT&&n.op!==L.ALT_MATCH)continue;let s="out",i="arg",o=e.inst[n[i]];if(o.op!==L.ALT&&o.op!==L.ALT_MATCH&&(s="arg",i="out",o=e.inst[n[i]],o.op!==L.ALT&&o.op!==L.ALT_MATCH))continue;const B=e.inst[n[s]];if(B.op===L.ALT||B.op===L.ALT_MATCH)continue;let u="out",c="arg",h=!1;o.out===t?h=!0:o.arg===t&&(h=!0,u="arg",c="out"),h&&(o[u]=n[s]),n[s]===o[u]&&(n[i]=o[c])}return e},zw=r=>{if(r.inst.length>=1e3)return null;const e=new Eh(r.inst.length),t=new Eh(r.inst.length),n=new Array(r.inst.length),s=new Array(r.inst.length).fill(!1),i=o=>{let B=!0;const u=r.inst[o];if(t.contains(o))return!0;switch(t.insert(o),u.op){case L.ALT:case L.ALT_MATCH:{B=i(u.out)&&i(u.arg);let c=s[u.out],h=s[u.arg];if(c&&h)return!1;if(h){const D=u.out;u.out=u.arg,u.arg=D;const P=c;c=h,h=P}c&&(s[o]=!0,u.op=L.ALT_MATCH);const d=n[u.out]||[],C=n[u.arg]||[],g=jw(d,C,u.out,u.arg);if(!g)return!1;n[o]=new Int32Array(g.merged),u.next=new Uint32Array(g.next);break}case L.CAPTURE:case L.EMPTY_WIDTH:case L.NOP:B=i(u.out),s[o]=s[u.out],n[o]=n[u.out]?new Int32Array(n[u.out]):new Int32Array(0),u.next=new Uint32Array(Math.floor(n[o].length/2)+1).fill(u.out);break;case L.MATCH:case L.FAIL:s[o]=u.op===L.MATCH;break;case L.RUNE:{if(s[o]=!1,u.next&&u.next.length>0)break;if(e.insert(u.out),!u.runes||u.runes.length===0){n[o]=new Int32Array(0),u.next=new Uint32Array([u.out]);break}let c=[];if(u.runes.length===1&&(u.arg&U.FOLD_CASE)!==0){const h=u.runes[0];c.push(h,h);for(let d=Y.simpleFold(h);d!==h;d=Y.simpleFold(d))c.push(d,d);c.sort((d,C)=>d-C)}else for(let h=0;h<u.runes.length;h++)c.push(u.runes[h]);n[o]=new Int32Array(c),u.next=new Uint32Array(Math.floor(c.length/2)+1).fill(u.out),u.op=L.RUNE;break}case L.RUNE1:{if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out);let c=[];if((u.arg&U.FOLD_CASE)!==0){const h=u.runes[0];c.push(h,h);for(let d=Y.simpleFold(h);d!==h;d=Y.simpleFold(d))c.push(d,d);c.sort((d,C)=>d-C)}else c.push(u.runes[0],u.runes[0]);n[o]=new Int32Array(c),u.next=new Uint32Array(Math.floor(c.length/2)+1).fill(u.out),u.op=L.RUNE;break}case L.RUNE_ANY:if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out),n[o]=new Int32Array([0,Y.MAX_RUNE]),u.next=new Uint32Array([u.out]);break;case L.RUNE_ANY_NOT_NL:if(s[o]=!1,u.next&&u.next.length>0)break;e.insert(u.out),n[o]=new Int32Array([0,9,11,Y.MAX_RUNE]),u.next=new Uint32Array(Math.floor(n[o].length/2)+1).fill(u.out)}return B};for(e.clear(),e.insert(r.start);!e.empty();)if(t.clear(),!i(e.next()))return null;for(let o=0;o<r.inst.length;o++)n[o]&&(r.inst[o].runes=n[o]);return r},Ww=(r,e)=>{for(let t=0;t<e.inst.length;t++){const n=e.inst[t];switch(n.op){case L.ALT:case L.ALT_MATCH:case L.RUNE:break;case L.CAPTURE:case L.EMPTY_WIDTH:case L.NOP:case L.MATCH:case L.FAIL:r.inst[t].next=null;break;case L.RUNE1:case L.RUNE_ANY:case L.RUNE_ANY_NOT_NL:r.inst[t].next=null,r.inst[t].op=n.op,r.inst[t].runes=n.runes?new Int32Array(n.runes):new Int32Array(0)}}};var _h=class wC{static compile(e){if(e.start===0||e.numLb>0)return null;const t=e.inst[e.start];if(t.op!==L.EMPTY_WIDTH||(t.arg&$.EMPTY_BEGIN_TEXT)===0)return null;let n=!1;for(let i=0;i<e.inst.length;i++)if(e.inst[i].op===L.ALT||e.inst[i].op===L.ALT_MATCH){n=!0;break}for(let i=0;i<e.inst.length;i++){const o=e.inst[i],B=e.inst[o.out].op;switch(o.op){case L.ALT:case L.ALT_MATCH:if(B===L.MATCH||e.inst[o.arg].op===L.MATCH)return null;break;case L.EMPTY_WIDTH:if(B===L.MATCH){if((o.arg&$.EMPTY_END_TEXT)===$.EMPTY_END_TEXT)continue;return null}break;default:if(B===L.MATCH&&n)return null}}let s=Kw(e);return s=zw(s),s!==null&&Ww(s,e),s}static next(e,t){const n=e.matchRunePos(t);return n>=0?e.next[n]:e.op===L.ALT_MATCH?e.out:0}static execute(e,t,n,s,i){const o=e.onepass;if(!o)return null;const B=new Int32Array(i).fill(-1);let u=!1,c=t.step(n),h=c>>3,d=c&7,C=Bt.EOF(),g=-1,D=0;c!==Bt.EOF()&&(C=t.step(n+d),C!==Bt.EOF()&&(g=C>>3,D=C&7));let P=n===0?$.emptyOpContext(-1,h):t.context(n),N=o.start,J;for(;;){switch(J=o.inst[N],N=J.out,J.op){case L.MATCH:return s===U.ANCHOR_BOTH&&n!==t.endPos()?null:(u=!0,B.length>0&&(B[0]=0,B[1]=n),i===0?[]:$.toArray(B));case L.RUNE:if(!J.matchRune(h))return null;break;case L.RUNE1:if(h!==J.runes[0])return null;break;case L.RUNE_ANY:break;case L.RUNE_ANY_NOT_NL:if(h===10)return null;break;case L.ALT:case L.ALT_MATCH:N=wC.next(J,h);continue;case L.FAIL:return null;case L.NOP:continue;case L.EMPTY_WIDTH:if((J.arg&~P)!==0)return null;continue;case L.CAPTURE:J.arg<B.length&&(B[J.arg]=n);continue;default:throw new Ws("bad inst")}if(d===0)break;P=$.emptyOpContext(h,g),n+=d,h=g,d=D,h!==-1&&(C=t.step(n+d),C!==Bt.EOF()?(g=C>>3,D=C&7):(g=-1,D=0))}return u?i===0?[]:$.toArray(B):null}},ne,I=(ne=class{static isPseudoOp(e){return e>=ne.Op.LEFT_PAREN}static emptySubs(){return[]}static quoteIfHyphen(e){return e===k.CODES.get("-")?"\\":""}static fromRegexp(e){const t=new ne(e.op);return t.flags=e.flags,t.subs=e.subs,t.runes=e.runes,t.cap=e.cap,t.min=e.min,t.max=e.max,t.name=e.name,t.namedGroups=e.namedGroups,t.lb=e.lb,t}constructor(e){this.op=e,this.flags=0,this.subs=ne.emptySubs(),this.runes=new Int32Array(0),this.min=0,this.max=0,this.cap=0,this.name=null,this.namedGroups=Object.create(null),this.lb=0}reinit(){this.flags=0,this.subs=ne.emptySubs(),this.runes=new Int32Array(0),this.cap=0,this.min=0,this.max=0,this.name=null,this.namedGroups=Object.create(null),this.lb=0}toString(){return this.appendTo()}appendTo(){let e="";switch(this.op){case ne.Op.NO_MATCH:e+="[^\\x00-\\x{10FFFF}]";break;case ne.Op.EMPTY_MATCH:e+="(?:)";break;case ne.Op.STAR:case ne.Op.PLUS:case ne.Op.QUEST:case ne.Op.REPEAT:{const t=this.subs[0];switch(t.op>ne.Op.CAPTURE||t.op===ne.Op.LITERAL&&t.runes.length>1?e+=`(?:${t.appendTo()})`:e+=t.appendTo(),this.op){case ne.Op.STAR:e+="*";break;case ne.Op.PLUS:e+="+";break;case ne.Op.QUEST:e+="?";break;case ne.Op.REPEAT:e+=`{${this.min}`,this.min!==this.max&&(e+=",",this.max>=0&&(e+=this.max)),e+="}"}(this.flags&U.NON_GREEDY)!==0&&(e+="?");break}case ne.Op.CONCAT:for(let t of this.subs)t.op===ne.Op.ALTERNATE?e+=`(?:${t.appendTo()})`:e+=t.appendTo();break;case ne.Op.ALTERNATE:{let t="";for(let n of this.subs)e+=t,t="|",e+=n.appendTo();break}case ne.Op.LITERAL:(this.flags&U.FOLD_CASE)!==0&&(e+="(?i:");for(let t of this.runes)e+=$.escapeRune(t);(this.flags&U.FOLD_CASE)!==0&&(e+=")");break;case ne.Op.ANY_CHAR_NOT_NL:e+="(?-s:.)";break;case ne.Op.ANY_CHAR:e+="(?s:.)";break;case ne.Op.PLB:e+=`(?<=${this.subs[0].appendTo()})`;break;case ne.Op.NLB:e+=`(?<!${this.subs[0].appendTo()})`;break;case ne.Op.CAPTURE:this.name===null||this.name.length===0?e+="(":e+=`(?P<${this.name}>`,this.subs[0].op!==ne.Op.EMPTY_MATCH&&(e+=this.subs[0].appendTo()),e+=")";break;case ne.Op.BEGIN_TEXT:e+="\\A";break;case ne.Op.END_TEXT:(this.flags&U.WAS_DOLLAR)!==0?e+="(?-m:$)":e+="\\z";break;case ne.Op.BEGIN_LINE:e+="^";break;case ne.Op.END_LINE:e+="$";break;case ne.Op.WORD_BOUNDARY:e+="\\b";break;case ne.Op.NO_WORD_BOUNDARY:e+="\\B";break;case ne.Op.CHAR_CLASS:if(this.runes.length%2!==0){e+="[invalid char class]";break}if(e+="[",this.runes.length===0)e+="^\\x00-\\x{10FFFF}";else if(this.runes[0]===0&&this.runes[this.runes.length-1]===Y.MAX_RUNE){e+="^";for(let t=1;t<this.runes.length-1;t+=2){const n=this.runes[t]+1,s=this.runes[t+1]-1;e+=ne.quoteIfHyphen(n),e+=$.escapeRune(n),n!==s&&(e+="-",e+=ne.quoteIfHyphen(s),e+=$.escapeRune(s))}}else for(let t=0;t<this.runes.length;t+=2){const n=this.runes[t],s=this.runes[t+1];e+=ne.quoteIfHyphen(n),e+=$.escapeRune(n),n!==s&&(e+="-",e+=ne.quoteIfHyphen(s),e+=$.escapeRune(s))}e+="]";break;default:e+=this.op}return e}maxCap(){let e=0;if(this.op===ne.Op.CAPTURE&&(e=this.cap),this.subs!==null)for(let t of this.subs){const n=t.maxCap();e<n&&(e=n)}return e}equals(e){if(!(e!==null&&e instanceof ne)||this.op!==e.op)return!1;switch(this.op){case ne.Op.END_TEXT:if((this.flags&U.WAS_DOLLAR)!==(e.flags&U.WAS_DOLLAR))return!1;break;case ne.Op.LITERAL:case ne.Op.CHAR_CLASS:if((this.flags&U.FOLD_CASE)!==(e.flags&U.FOLD_CASE))return!1;if(this.runes===null&&e.runes===null)break;if(this.runes===null||e.runes===null||this.runes.length!==e.runes.length)return!1;for(let t=0;t<this.runes.length;t++)if(this.runes[t]!==e.runes[t])return!1;break;case ne.Op.ALTERNATE:case ne.Op.CONCAT:if(this.subs.length!==e.subs.length)return!1;for(let t=0;t<this.subs.length;++t)if(!this.subs[t].equals(e.subs[t]))return!1;break;case ne.Op.STAR:case ne.Op.PLUS:case ne.Op.QUEST:if((this.flags&U.NON_GREEDY)!==(e.flags&U.NON_GREEDY)||!this.subs[0].equals(e.subs[0]))return!1;break;case ne.Op.REPEAT:if((this.flags&U.NON_GREEDY)!==(e.flags&U.NON_GREEDY)||this.min!==e.min||this.max!==e.max||!this.subs[0].equals(e.subs[0]))return!1;break;case ne.Op.CAPTURE:if(this.cap!==e.cap||(this.name===null?e.name!==null:this.name!==e.name)||!this.subs[0].equals(e.subs[0]))return!1;break;case ne.Op.PLB:case ne.Op.NLB:if(this.lb!==e.lb||!this.subs[0].equals(e.subs[0]))return!1}return!0}},H(ne,"Op",mC(["NO_MATCH","EMPTY_MATCH","LITERAL","CHAR_CLASS","ANY_CHAR_NOT_NL","ANY_CHAR","BEGIN_LINE","END_LINE","BEGIN_TEXT","END_TEXT","WORD_BOUNDARY","NO_WORD_BOUNDARY","CAPTURE","STAR","PLUS","QUEST","REPEAT","CONCAT","ALTERNATE","PLB","NLB","LEFT_PAREN","VERTICAL_BAR"])),ne),Nu=class{static walk(r,e){const t=[];let n=r,s;for(;;){if(n.subs.length===0)s=e.leaf(n);else{const i=e.enter(n);if(i.result===void 0){t.push({re:n,state:i,i:0}),n=n.subs[0];continue}s=i.result}for(;;){if(t.length===0)return s;const i=t[t.length-1];if(e.child(i.re,i.state,s,i.i),i.i++,i.state.result===void 0&&i.i<i.re.subs.length){n=i.re.subs[i.i];break}t.pop(),s=i.state.result!==void 0?i.state.result:e.leave(i.re,i.state)}}}},Dh=class{constructor(r,e){const t=new Map,n=[0],s=[0],i=[0],o=[0];for(const D of r){let P=0;for(let N=0;N<D.length;N++){const J=P*e+D[N];let v=t.get(J);v===void 0&&(v=n.length,t.set(J,v),n.push(P),s.push(D[N]),i.push(i[P]+1),o.push(0)),P=v}o[P]=1}const B=n.length,u=new Int32Array(B-1);for(let D=1;D<B;D++)u[D-1]=D;u.sort((D,P)=>n[D]-n[P]||s[D]-s[P]);const c=new Int32Array(B+1);for(let D=1;D<B;D++)c[n[D]+1]++;for(let D=0;D<B;D++)c[D+1]+=c[D];const h=new Int32Array(B-1);for(let D=0;D<u.length;D++)h[D]=s[u[D]];this.childStart=c,this.childUnit=h,this.childNode=u;const d=new Int32Array(B);for(let D=0;D<B;D++)d[D]=D;d.sort((D,P)=>i[D]-i[P]);const C=new Int32Array(B),g=Uint8Array.from(o);for(let D=1;D<B;D++){const P=d[D],N=n[P];if(N!==0){let J=C[N],v=this.next(J,s[P]);for(;v<0&&J!==0;)J=C[J],v=this.next(J,s[P]);C[P]=v>=0?v:0}g[P]|=g[C[P]]}this.fail=C,this.match=g}next(r,e){let t=this.childStart[r],n=this.childStart[r+1];const s=this.childUnit;for(;t<n;){const i=t+n>>1,o=s[i];if(o===e)return this.childNode[i];o<e?t=i+1:n=i}return-1}advance(r,e){for(;;){const t=this.next(r,e);if(t>=0)return t;if(r===0)return 0;r=this.fail[r]}}searchUTF16(r,e,t){let n=0;for(let s=e;s<t;s++)if(n=this.advance(n,r.charCodeAt(s)),this.match[n]===1)return!0;return!1}searchUTF8(r,e,t){let n=0;for(let s=e;s<t;s++)if(n=this.advance(n,r[s]),this.match[n]===1)return!0;return!1}},wt,ue=(wt=class{constructor(e){this.type=e,this.subs=[],this.str="",this.bytes=null,this.cost=e===wt.Type.EXACT?1:0,this.allExact=!1,this.ac16=null,this.ac8=null}automaton16(){if(this.ac16===null){const e=this.subs.map(t=>{const n=new Array(t.str.length);for(let s=0;s<t.str.length;s++)n[s]=t.str.charCodeAt(s);return n});this.ac16=new Dh(e,65536)}return this.ac16}automaton8(){return this.ac8===null&&(this.ac8=new Dh(this.subs.map(e=>e.bytes),256)),this.ac8}eval(e,t){switch(this.type){case wt.Type.NONE:return!0;case wt.Type.EXACT:return e.hasString(this,t);case wt.Type.AND:for(let n=0;n<this.subs.length;n++)if(!this.subs[n].eval(e,t))return!1;return!0;case wt.Type.OR:if(this.allExact)return e.hasAnyString(this,t);for(let n=0;n<this.subs.length;n++)if(this.subs[n].eval(e,t))return!0;return!1;default:return!0}}},H(wt,"Type",{NONE:0,EXACT:1,AND:2,OR:3}),H(wt,"MAX_SCANS",32),H(wt,"MAX_AC_UNITS",1<<18),wt),Lt,$w=(Lt=class{static build(e){return e?Nu.walk(e,Lt.WALKER):new ue(ue.Type.NONE)}static leaf(e){if(e.op!==I.Op.LITERAL)return new ue(ue.Type.NONE);if(e.runes.length===0||(e.flags&U.FOLD_CASE)!==0)return new ue(ue.Type.NONE);let t="";for(let s=0;s<e.runes.length;s++){if(Y.isUnsearchable(e.runes[s]))return new ue(ue.Type.NONE);t+=String.fromCodePoint(e.runes[s])}const n=new ue(ue.Type.EXACT);return n.str=t,n.bytes=$.stringToUtf8ByteArray(n.str),n}static enter(e){switch(e.op){case I.Op.CAPTURE:case I.Op.PLUS:return{sub:null};case I.Op.REPEAT:return e.min>=1?{sub:null}:{result:new ue(ue.Type.NONE)};case I.Op.CONCAT:return{pf:new ue(ue.Type.AND),subs:[]};case I.Op.ALTERNATE:return{pf:new ue(ue.Type.OR),subs:[]};default:return{result:new ue(ue.Type.NONE)}}}static child(e,t,n){if(t.subs===void 0){t.sub=n;return}if(t.pf.type===ue.Type.AND){if(n.type===ue.Type.NONE)return;if(n.type===ue.Type.AND){for(let s=0;s<n.subs.length;s++)t.subs.push(n.subs[s]);return}t.subs.push(n);return}if(n.type===ue.Type.NONE){t.result=new ue(ue.Type.NONE);return}if(n.type===ue.Type.OR){for(let s=0;s<n.subs.length;s++)t.subs.push(n.subs[s]);return}t.subs.push(n)}static leave(e,t){if(t.subs===void 0)return t.sub;const n=t.pf,s=new Set,i=[];for(const c of t.subs){if(c.type===ue.Type.EXACT){if(s.has(c.str))continue;s.add(c.str)}i.push(c)}if(n.type===ue.Type.AND){const c=[];let h=0;for(const d of i)h+d.cost>ue.MAX_SCANS||(c.push(d),h+=d.cost);return c.length===0?new ue(ue.Type.NONE):c.length===1?c[0]:(n.subs=c,n.cost=h,n)}if(i.length===0)return new ue(ue.Type.NONE);if(i.length===1)return i[0];n.subs=i;let o=!0,B=0,u=0;for(const c of i)c.type!==ue.Type.EXACT?o=!1:u+=c.bytes.length,B+=c.cost;return o?u>ue.MAX_AC_UNITS?new ue(ue.Type.NONE):(n.allExact=!0,n.cost=1,n):B>ue.MAX_SCANS?new ue(ue.Type.NONE):(n.cost=B,n)}},H(Lt,"WALKER",{leaf:e=>Lt.leaf(e),enter:e=>Lt.enter(e),child:(e,t,n)=>Lt.child(e,t,n),leave:(e,t)=>Lt.leave(e,t)}),Lt),St=class{constructor(r=0,e=0){this.head=r,this.tail=e}},Qw=class{constructor(){this.inst=[],this.start=0,this.numCap=2,this.lbStarts=[],this.numLb=0,this.lbInst=null}getInst(r){return this.inst[r]}numInst(){return this.inst.length}addInst(r){this.inst.push(new L(r))}markLookbehindInsts(){const r=new Uint8Array(this.inst.length),e=this.lbStarts.slice();for(;e.length>0;){const t=e.pop();if(t===0||r[t]===1)continue;r[t]=1;const n=this.inst[t];switch(n.op){case L.ALT:case L.ALT_MATCH:e.push(n.out,n.arg);break;case L.MATCH:case L.FAIL:break;default:e.push(n.out)}}this.lbInst=r}skipNop(r){let e=this.inst[r];for(;e.op===L.NOP||e.op===L.CAPTURE;)e=this.inst[r],r=e.out;return e}prefix(){let r="",e=this.skipNop(this.start);if(!L.isRuneOp(e.op)||e.runes.length!==1)return[e.op===L.MATCH,r];for(;L.isRuneOp(e.op)&&e.runes.length===1&&(e.arg&U.FOLD_CASE)===0&&!Y.isUnsearchable(e.runes[0]);)r+=String.fromCodePoint(e.runes[0]),e=this.skipNop(e.out);return[e.op===L.MATCH,r]}startCond(){let r=0,e=this.start;e:for(;;){const t=this.inst[e];switch(t.op){case L.EMPTY_WIDTH:r|=t.arg;break;case L.FAIL:return-1;case L.CAPTURE:case L.NOP:break;default:break e}e=t.out}return r}patch(r,e){let t=r.head;for(;t!==0;){const n=this.inst[t>>1];(t&1)===0?(t=n.out,n.out=e):(t=n.arg,n.arg=e)}}append(r,e){if(r.head===0)return e;if(e.head===0)return r;const t=this.inst[r.tail>>1];return(r.tail&1)===0?t.out=e.head:t.arg=e.head,new St(r.head,e.tail)}toString(){let r="";for(let e=0;e<this.inst.length;e++){const t=r.length;r+=e,e===this.start&&(r+="*"),r+="        ".substring(r.length-t),r+=this.inst[e],r+=`
`}return r}};const Yw=new Int32Array([0,k.CODES.get(`
`)-1,k.CODES.get(`
`)+1,Y.MAX_RUNE]),wh=new Int32Array([0,Y.MAX_RUNE]);var co=class{constructor(r=0,e=new St,t=!1){this.i=r,this.out=e,this.nullable=t}},Xw=class $B{static compileRegexp(e){const t=new $B,n=t.compile(e);return t.prog.patch(n.out,t.newInst(L.MATCH).i),t.prog.start=n.i,t.prog.markLookbehindInsts(),t.prog}static compileSet(e){const t=new $B;if(e.length===0)return t.prog.start=t.newInst(L.FAIL).i,t.prog.markLookbehindInsts(),t.prog;let n=[];for(let i=0;i<e.length;i++){const o=t.compile(e[i]),B=t.newInst(L.MATCH);t.prog.getInst(B.i).arg=i,t.prog.patch(o.out,B.i),n.push(o.i)}let s=n[0];for(let i=1;i<n.length;i++){const o=t.newInst(L.ALT),B=t.prog.getInst(o.i);B.out=s,B.arg=n[i],s=o.i}return t.prog.start=s,t.prog.markLookbehindInsts(),t.prog}constructor(){this.prog=new Qw,this.newInst(L.FAIL),this.runeCache=new Map,this.walker={leaf:e=>this.leaf(e),enter:e=>this.enter(e),child:(e,t,n)=>this.child(e,t,n),leave:(e,t)=>this.leave(e,t)}}newInst(e){return this.prog.addInst(e),new co(this.prog.numInst()-1,new St,!0)}nop(){const e=this.newInst(L.NOP);return e.out=new St(e.i<<1,e.i<<1),e}fail(){return new co}cap(e){const t=this.newInst(L.CAPTURE);return t.out=new St(t.i<<1,t.i<<1),this.prog.getInst(t.i).arg=e,this.prog.numCap<e+1&&(this.prog.numCap=e+1),t}cat(e,t){return e.i===0||t.i===0?this.fail():(this.prog.patch(e.out,t.i),new co(e.i,t.out,e.nullable&&t.nullable))}alt(e,t){if(e.i===0)return t;if(t.i===0)return e;const n=this.newInst(L.ALT),s=this.prog.getInst(n.i);return s.out=e.i,s.arg=t.i,n.out=this.prog.append(e.out,t.out),n.nullable=e.nullable||t.nullable,n}loop(e,t){const n=this.newInst(L.ALT),s=this.prog.getInst(n.i);return t?(s.arg=e.i,n.out=new St(n.i<<1,n.i<<1)):(s.out=e.i,n.out=new St(n.i<<1|1,n.i<<1|1)),this.prog.patch(e.out,n.i),n}quest(e,t){const n=this.newInst(L.ALT),s=this.prog.getInst(n.i);return t?(s.arg=e.i,n.out=new St(n.i<<1,n.i<<1)):(s.out=e.i,n.out=new St(n.i<<1|1,n.i<<1|1)),n.out=this.prog.append(n.out,e.out),n}star(e,t){return e.nullable?this.quest(this.plus(e,t),t):this.loop(e,t)}plus(e,t){return new co(e.i,this.loop(e,t).out,e.nullable)}empty(e){const t=this.newInst(L.EMPTY_WIDTH);return this.prog.getInst(t.i).arg=e,t.out=new St(t.i<<1,t.i<<1),t}rune(e,t){const n=this.newInst(L.RUNE);n.nullable=!1;const s=this.prog.getInst(n.i);return s.runes=e,t&=U.FOLD_CASE,(e.length!==1||Y.simpleFold(e[0])===e[0])&&(t&=-2),s.arg=t,n.out=new St(n.i<<1,n.i<<1),(t&U.FOLD_CASE)===0&&e.length===1||e.length===2&&e[0]===e[1]?s.op=L.RUNE1:e.length===2&&e[0]===0&&e[1]===Y.MAX_RUNE?s.op=L.RUNE_ANY:e.length===4&&e[0]===0&&e[1]===k.CODES.get(`
`)-1&&e[2]===k.CODES.get(`
`)+1&&e[3]===Y.MAX_RUNE&&(s.op=L.RUNE_ANY_NOT_NL),n}lookBehind(e,t){const n=this.newInst(L.LB_WRITE);this.prog.getInst(n.i).arg=t;const s=this.rune(wh,0),i=this.star(s,!0),o=this.cat(i,e);this.prog.patch(o.out,n.i);const B=this.newInst(L.LB_CHECK);return this.prog.getInst(B.i).arg=t,this.prog.lbStarts.push(o.i),Math.abs(t)>this.prog.numLb&&(this.prog.numLb=Math.abs(t)),B.out=new St(B.i<<1,B.i<<1),B}compile(e){return Nu.walk(e,this.walker)}leaf(e){switch(e.op){case I.Op.NO_MATCH:return this.fail();case I.Op.EMPTY_MATCH:return this.nop();case I.Op.LITERAL:{if(e.runes.length===0)return this.nop();let t=null;for(let n of e.runes){let s=this.runeCache.get(n);s===void 0&&(s=new Int32Array([n]),this.runeCache.set(n,s));const i=this.rune(s,e.flags);t=t===null?i:this.cat(t,i)}return t}case I.Op.CHAR_CLASS:return this.rune(e.runes,e.flags);case I.Op.ANY_CHAR_NOT_NL:return this.rune(Yw,0);case I.Op.ANY_CHAR:return this.rune(wh,0);case I.Op.BEGIN_LINE:return this.empty($.EMPTY_BEGIN_LINE);case I.Op.END_LINE:return this.empty($.EMPTY_END_LINE);case I.Op.BEGIN_TEXT:return this.empty($.EMPTY_BEGIN_TEXT);case I.Op.END_TEXT:return this.empty($.EMPTY_END_TEXT);case I.Op.WORD_BOUNDARY:return this.empty($.EMPTY_WORD_BOUNDARY);case I.Op.NO_WORD_BOUNDARY:return this.empty($.EMPTY_NO_WORD_BOUNDARY);case I.Op.CONCAT:case I.Op.ALTERNATE:return this.nop();default:throw new mB("regexp: unhandled case in compile")}}enter(e){switch(e.op){case I.Op.PLB:case I.Op.NLB:case I.Op.STAR:case I.Op.PLUS:case I.Op.QUEST:return{sub:null};case I.Op.CAPTURE:return{bra:this.cap(e.cap<<1),sub:null};case I.Op.CONCAT:case I.Op.ALTERNATE:return{f:null};default:throw new mB("regexp: unhandled case in compile")}}child(e,t,n){e.op===I.Op.CONCAT?t.f=t.f===null?n:this.cat(t.f,n):e.op===I.Op.ALTERNATE?t.f=t.f===null?n:this.alt(t.f,n):t.sub=n}leave(e,t){switch(e.op){case I.Op.PLB:case I.Op.NLB:return this.lookBehind(t.sub,e.lb);case I.Op.CAPTURE:{const n=this.cap(e.cap<<1|1);return this.cat(this.cat(t.bra,t.sub),n)}case I.Op.STAR:return this.star(t.sub,(e.flags&U.NON_GREEDY)!==0);case I.Op.PLUS:return this.plus(t.sub,(e.flags&U.NON_GREEDY)!==0);case I.Op.QUEST:return this.quest(t.sub,(e.flags&U.NON_GREEDY)!==0);case I.Op.CONCAT:case I.Op.ALTERNATE:return t.f;default:throw new mB("regexp: unhandled case in compile")}}},ke,Zw=(ke=class{static simplify(e){return e===null?null:Nu.walk(e,ke.WALKER)}static leaf(e){if(e.op===I.Op.CHAR_CLASS){if(e.runes===null)return e;if(e.runes.length===0)return new I(I.Op.NO_MATCH);if(e.runes.length===2&&e.runes[0]===0&&e.runes[1]===Y.MAX_RUNE)return new I(I.Op.ANY_CHAR);if(e.runes.length===4&&e.runes[0]===0&&e.runes[1]===k.CODES.get(`
`)-1&&e.runes[2]===k.CODES.get(`
`)+1&&e.runes[3]===Y.MAX_RUNE)return new I(I.Op.ANY_CHAR_NOT_NL)}return e}static enter(e){switch(e.op){case I.Op.PLB:case I.Op.NLB:case I.Op.CAPTURE:case I.Op.STAR:case I.Op.PLUS:case I.Op.QUEST:return{sub:null};case I.Op.CONCAT:case I.Op.ALTERNATE:return{subs:[],changed:!1};case I.Op.REPEAT:return e.min===0&&e.max===0?{result:new I(I.Op.EMPTY_MATCH)}:{sub:null};default:return{result:e}}}static child(e,t,n,s){if(t.subs===void 0){t.sub=n;return}if(n!==e.subs[s]&&(t.changed=!0),e.op===I.Op.CONCAT){if(n.op===I.Op.NO_MATCH){t.result=new I(I.Op.NO_MATCH);return}if(n.op===I.Op.EMPTY_MATCH){t.changed=!0;return}if(n.op===I.Op.CONCAT){t.changed=!0;for(let i=0;i<n.subs.length;i++)t.subs.push(n.subs[i]);return}}else{if(n.op===I.Op.NO_MATCH){t.changed=!0;return}if(n.op===I.Op.ALTERNATE){t.changed=!0;for(let i=0;i<n.subs.length;i++)t.subs.push(n.subs[i]);return}}t.subs.push(n)}static leave(e,t){switch(e.op){case I.Op.PLB:case I.Op.NLB:case I.Op.CAPTURE:{const n=t.sub;if(n!==e.subs[0]){const s=I.fromRegexp(e);return s.runes=new Int32Array(0),s.subs=[n],s}return e}case I.Op.CONCAT:case I.Op.ALTERNATE:if(t.changed){const n=t.subs;if(n.length===0)return new I(e.op===I.Op.CONCAT?I.Op.EMPTY_MATCH:I.Op.NO_MATCH);if(n.length===1)return n[0];const s=I.fromRegexp(e);return s.runes=new Int32Array(0),s.subs=n,s}return e;case I.Op.STAR:case I.Op.PLUS:case I.Op.QUEST:return ke.simplify1(e.op,e.flags,t.sub,e);case I.Op.REPEAT:return ke.simplifyRepeat(e,t.sub);default:return e}}static simplifyRepeat(e,t){if(e.max===-1){if(e.min===0)return ke.simplify1(I.Op.STAR,e.flags,t,null);if(e.min===1)return ke.simplify1(I.Op.PLUS,e.flags,t,null);const s=[];for(let i=0;i<e.min-1;i++)s.push(t);return s.push(ke.simplify1(I.Op.PLUS,e.flags,t,null)),ke.concat(s)}if(e.min===1&&e.max===1)return t;let n=null;if(e.min>0){n=[];for(let s=0;s<e.min;s++)n.push(t)}if(e.max>e.min){let s=ke.simplify1(I.Op.QUEST,e.flags,t,null);for(let i=e.min+1;i<e.max;i++)s=ke.simplify1(I.Op.QUEST,e.flags,ke.concat([t,s]),null);if(n===null)return s;n.push(s)}return n!==null?ke.concat(n):new I(I.Op.NO_MATCH)}static concat(e){const t=[];for(let s=0;s<e.length;s++){const i=e[s];if(i.op===I.Op.NO_MATCH)return new I(I.Op.NO_MATCH);if(i.op!==I.Op.EMPTY_MATCH){if(i.op===I.Op.CONCAT){for(let o=0;o<i.subs.length;o++)t.push(i.subs[o]);continue}t.push(i)}}if(t.length===0)return new I(I.Op.EMPTY_MATCH);if(t.length===1)return t[0];const n=new I(I.Op.CONCAT);return n.subs=t,n}static simplify1(e,t,n,s){if(n.op===I.Op.EMPTY_MATCH)return n;if(n.op===I.Op.NO_MATCH)return e===I.Op.PLUS?n:new I(I.Op.EMPTY_MATCH);if(e===n.op&&(t&U.NON_GREEDY)===(n.flags&U.NON_GREEDY))return n;if(s!==null&&s.op===e&&(s.flags&U.NON_GREEDY)===(t&U.NON_GREEDY)&&n===s.subs[0])return s;const i=new I(e);return i.flags=t,i.subs=[n],i}},H(ke,"WALKER",{leaf:e=>ke.leaf(e),enter:e=>ke.enter(e),child:(e,t,n,s)=>ke.child(e,t,n,s),leave:(e,t)=>ke.leave(e,t)}),ke),Ce=class{constructor(r,e){this.sign=r,this.cls=e}};const yh=[48,57],Th=[9,10,12,13,32,32],Ih=[48,57,65,90,95,95,97,122],Ah=new Map([["\\d",new Ce(1,yh)],["\\D",new Ce(-1,yh)],["\\s",new Ce(1,Th)],["\\S",new Ce(-1,Th)],["\\w",new Ce(1,Ih)],["\\W",new Ce(-1,Ih)]]),Rh=[48,57,65,90,97,122],vh=[65,90,97,122],bh=[0,127],Ph=[9,9,32,32],Sh=[0,31,127,127],Oh=[48,57],Nh=[33,126],Fh=[97,122],Lh=[32,126],kh=[33,47,58,64,91,96,123,126],xh=[9,13,32,32],Vh=[65,90],Mh=[48,57,65,90,95,95,97,122],Gh=[48,57,65,70,97,102],Uh=new Map([["[:alnum:]",new Ce(1,Rh)],["[:^alnum:]",new Ce(-1,Rh)],["[:alpha:]",new Ce(1,vh)],["[:^alpha:]",new Ce(-1,vh)],["[:ascii:]",new Ce(1,bh)],["[:^ascii:]",new Ce(-1,bh)],["[:blank:]",new Ce(1,Ph)],["[:^blank:]",new Ce(-1,Ph)],["[:cntrl:]",new Ce(1,Sh)],["[:^cntrl:]",new Ce(-1,Sh)],["[:digit:]",new Ce(1,Oh)],["[:^digit:]",new Ce(-1,Oh)],["[:graph:]",new Ce(1,Nh)],["[:^graph:]",new Ce(-1,Nh)],["[:lower:]",new Ce(1,Fh)],["[:^lower:]",new Ce(-1,Fh)],["[:print:]",new Ce(1,Lh)],["[:^print:]",new Ce(-1,Lh)],["[:punct:]",new Ce(1,kh)],["[:^punct:]",new Ce(-1,kh)],["[:space:]",new Ce(1,xh)],["[:^space:]",new Ce(-1,xh)],["[:upper:]",new Ce(1,Vh)],["[:^upper:]",new Ce(-1,Vh)],["[:word:]",new Ce(1,Mh)],["[:^word:]",new Ce(-1,Mh)],["[:xdigit:]",new Ce(1,Gh)],["[:^xdigit:]",new Ce(-1,Gh)]]);var ar=class Ao{static charClassToString(e,t){let n="[";for(let s=0;s<t;s+=2){s>0&&(n+=" ");const i=e[s],o=e[s+1];i===o?n+=`0x${i.toString(16)}`:n+=`0x${i.toString(16)}-0x${o.toString(16)}`}return n+="]",n}static sortRanges(e,t){const n=t>>1,s=new Array(n);for(let o=0;o<n;o++)s[o]=o;s.sort((o,B)=>e[2*o]-e[2*B]||e[2*B+1]-e[2*o+1]);const i=e.slice(0,t);for(let o=0;o<n;o++)e[2*o]=i[2*s[o]],e[2*o+1]=i[2*s[o]+1]}constructor(e=$.emptyInts()){this.r=e,this.len=e.length}toArray(){return this.r instanceof Int32Array?this.len===this.r.length?this.r:this.r.subarray(0,this.len):new Int32Array(this.len===this.r.length?this.r:this.r.slice(0,this.len))}toGrowableArray(){return Array.isArray(this.r)?(this.r.length=this.len,this.r):Array.from(this.r.subarray(0,this.len))}cleanClass(){if(this.len<4)return this;Ao.sortRanges(this.r,this.len);let e=2;for(let t=2;t<this.len;t+=2){const n=this.r[t],s=this.r[t+1];if(n<=this.r[e-1]+1){s>this.r[e-1]&&(this.r[e-1]=s);continue}this.r[e]=n,this.r[e+1]=s,e+=2}return this.len=e,this}appendLiteral(e,t){return(t&U.FOLD_CASE)!==0?this.appendFoldedRange(e,e):this.appendRange(e,e)}appendRange(e,t){if(this.len>0){for(let n=2;n<=4;n+=2)if(this.len>=n){const s=this.r[this.len-n],i=this.r[this.len-n+1];if(e<=i+1&&s<=t+1)return e<s&&(this.r[this.len-n]=e),t>i&&(this.r[this.len-n+1]=t),this}}return this.r[this.len++]=e,this.r[this.len++]=t,this}appendFoldedRange(e,t){if(e<=Y.MIN_FOLD&&t>=Y.MAX_FOLD)return this.appendRange(e,t);if(t<Y.MIN_FOLD||e>Y.MAX_FOLD)return this.appendRange(e,t);e<Y.MIN_FOLD&&(this.appendRange(e,Y.MIN_FOLD-1),e=Y.MIN_FOLD),t>Y.MAX_FOLD&&(this.appendRange(Y.MAX_FOLD+1,t),t=Y.MAX_FOLD);for(let n=e;n<=t;n++){this.appendRange(n,n);for(let s=Y.simpleFold(n);s!==n;s=Y.simpleFold(s))this.appendRange(s,s)}return this}appendClass(e){for(let t=0;t<e.length;t+=2)this.appendRange(e[t],e[t+1]);return this}appendFoldedClass(e){for(let t=0;t<e.length;t+=2)this.appendFoldedRange(e[t],e[t+1]);return this}appendNegatedClass(e){let t=0;for(let n=0;n<e.length;n+=2){const s=e[n],i=e[n+1];t<=s-1&&this.appendRange(t,s-1),t=i+1}return t<=Y.MAX_RUNE&&this.appendRange(t,Y.MAX_RUNE),this}appendTable(e){for(let t=0;t<e.length;++t){const n=e.getLo(t),s=e.getHi(t),i=e.getStride(t);if(i===1){this.appendRange(n,s);continue}for(let o=n;o<=s;o+=i)this.appendRange(o,o)}return this}appendNegatedTable(e){let t=0;for(let n=0;n<e.length;++n){const s=e.getLo(n),i=e.getHi(n),o=e.getStride(n);if(o===1){t<=s-1&&this.appendRange(t,s-1),t=i+1;continue}for(let B=s;B<=i;B+=o)t<=B-1&&this.appendRange(t,B-1),t=B+1}return t<=Y.MAX_RUNE&&this.appendRange(t,Y.MAX_RUNE),this}appendTableWithSign(e,t){return t<0?this.appendNegatedTable(e):this.appendTable(e)}negateClass(){let e=0,t=0;for(let n=0;n<this.len;n+=2){const s=this.r[n],i=this.r[n+1];e<=s-1&&(this.r[t]=e,this.r[t+1]=s-1,t+=2),e=i+1}return this.len=t,e<=Y.MAX_RUNE&&(this.r[this.len++]=e,this.r[this.len++]=Y.MAX_RUNE),this}appendClassWithSign(e,t){return t<0?this.appendNegatedClass(e):this.appendClass(e)}appendGroup(e,t){let n=e.cls;return t&&(n=new Ao().appendFoldedClass(n).cleanClass().toArray()),this.appendClassWithSign(n,e.sign)}toString(){return Ao.charClassToString(this.r,this.len)}},ey=class{constructor(r){this.str=r,this.position=0}pos(){return this.position}rewindTo(r){this.position=r}more(){return this.position<this.str.length}peek(){return this.str.codePointAt(this.position)}skip(r){this.position+=r}skipString(r){this.position+=r.length}pop(){const r=this.str.codePointAt(this.position);return this.position+=$.charCount(r),r}lookingAt(r){return this.str.startsWith(r,this.position)}rest(){return this.str.substring(this.position)}from(r){return this.str.substring(r,this.position)}toString(){return this.rest()}},q,ty=(q=class{static unicodeTable(e){return e==="Any"?{tab:q.ANY_TABLE,fold:q.ANY_TABLE,sign:1}:e==="Ascii"?{tab:q.ASCII_TABLE,fold:q.ASCII_FOLD_TABLE,sign:1}:e==="Assigned"?{tab:ct.CATEGORIES.get("Cn"),fold:ct.CATEGORIES.get("Cn"),sign:-1}:e==="Lc"?{tab:ct.CATEGORIES.get("LC"),fold:ct.FOLD_CATEGORIES.get("LC"),sign:1}:ct.CATEGORIES.has(e)?{tab:ct.CATEGORIES.get(e),fold:ct.FOLD_CATEGORIES.get(e),sign:1}:ct.SCRIPTS.has(e)?{tab:ct.SCRIPTS.get(e),fold:ct.FOLD_SCRIPT.get(e),sign:1}:null}static minFoldRune(e){if(e<Y.MIN_FOLD||e>Y.MAX_FOLD)return e;let t=e;const n=e;for(e=Y.simpleFold(e);e!==n;e=Y.simpleFold(e))t>e&&(t=e);return t}static leadingRegexp(e){if(e.op===I.Op.EMPTY_MATCH)return null;if(e.op===I.Op.CONCAT&&e.subs.length>0){const t=e.subs[0];return t.op===I.Op.EMPTY_MATCH?null:t}return e}static literalRegexp(e,t){const n=new I(I.Op.LITERAL);return n.flags=t,n.runes=$.stringToRunes(e),n}static parse(e,t){return new q(e,t).parseInternal()}static parseRepeat(e){const t=e.pos();if(!e.more()||!e.lookingAt("{"))return-1;e.skip(1);const n=q.parseInt(e);if(n===-1||!e.more())return-1;let s;if(!e.lookingAt(","))s=n;else{if(e.skip(1),!e.more())return-1;if(e.lookingAt("}"))s=-1;else if((s=q.parseInt(e))===-1)return-1}if(!e.more()||!e.lookingAt("}"))return-1;if(e.skip(1),n<0||n>1e3||s===-2||s>1e3||s>=0&&n>s)throw new ye(q.ERR_INVALID_REPEAT_SIZE,e.from(t));return n<<16|s&Y.MAX_BMP}static isValidCaptureName(e){if(e.length===0)return!1;for(let t=0;t<e.length;t++){const n=e.codePointAt(t);if(n!==k.CODES.get("_")&&!$.isalnum(n))return!1}return!0}static parseInt(e){const t=e.pos();for(;e.more()&&e.peek()>=k.CODES.get("0")&&e.peek()<=k.CODES.get("9");)e.skip(1);const n=e.from(t);return n.length===0||n.length>1&&n.codePointAt(0)===k.CODES.get("0")?-1:n.length>8?-2:parseInt(n,10)}static isCharClass(e){return e.op===I.Op.LITERAL&&e.runes.length===1||e.op===I.Op.CHAR_CLASS||e.op===I.Op.ANY_CHAR_NOT_NL||e.op===I.Op.ANY_CHAR}static matchRune(e,t){switch(e.op){case I.Op.LITERAL:return e.runes.length===1&&e.runes[0]===t;case I.Op.CHAR_CLASS:for(let n=0;n<e.runes.length;n+=2)if(e.runes[n]<=t&&t<=e.runes[n+1])return!0;return!1;case I.Op.ANY_CHAR_NOT_NL:return t!==k.CODES.get(`
`);case I.Op.ANY_CHAR:return!0}return!1}static mergeCharClass(e,t){switch(e.op){case I.Op.ANY_CHAR:break;case I.Op.ANY_CHAR_NOT_NL:q.matchRune(t,k.CODES.get(`
`))&&(e.op=I.Op.ANY_CHAR);break;case I.Op.CHAR_CLASS:{const n=new ar(Array.isArray(e.runes)?e.runes:Array.from(e.runes));t.op===I.Op.LITERAL?n.appendLiteral(t.runes[0],t.flags):n.appendClass(t.runes),e.runes=n.toGrowableArray();break}case I.Op.LITERAL:if(t.runes[0]===e.runes[0]&&t.flags===e.flags)break;e.op=I.Op.CHAR_CLASS,e.runes=new ar().appendLiteral(e.runes[0],e.flags).appendLiteral(t.runes[0],t.flags).toGrowableArray()}}static parseEscape(e){const t=e.pos();if(e.skip(1),!e.more())throw new ye(q.ERR_TRAILING_BACKSLASH);let n=e.pop();e:switch(n){case k.CODES.get("1"):case k.CODES.get("2"):case k.CODES.get("3"):case k.CODES.get("4"):case k.CODES.get("5"):case k.CODES.get("6"):case k.CODES.get("7"):if(!e.more()||e.peek()<k.CODES.get("0")||e.peek()>k.CODES.get("7"))break;case k.CODES.get("0"):{let s=n-k.CODES.get("0");for(let i=1;i<3&&!(!e.more()||e.peek()<k.CODES.get("0")||e.peek()>k.CODES.get("7"));i++)s=s*8+e.peek()-k.CODES.get("0"),e.skip(1);return s}case k.CODES.get("x"):{if(!e.more())break;if(n=e.pop(),n===k.CODES.get("{")){let o=0,B=0;for(;;){if(!e.more())break e;if(n=e.pop(),n===k.CODES.get("}"))break;const u=$.unhex(n);if(u<0||(B=B*16+u,B>Y.MAX_RUNE))break e;o++}if(o===0)break e;return B}const s=$.unhex(n);if(!e.more())break;n=e.pop();const i=$.unhex(n);if(s<0||i<0)break;return s*16+i}case k.CODES.get("a"):return k.CODES.get("\x07");case k.CODES.get("f"):return k.CODES.get("\f");case k.CODES.get("n"):return k.CODES.get(`
`);case k.CODES.get("r"):return k.CODES.get("\r");case k.CODES.get("t"):return k.CODES.get("	");case k.CODES.get("v"):return k.CODES.get("\v");default:if(n<=Y.MAX_ASCII&&!$.isalnum(n))return n}throw new ye(q.ERR_INVALID_ESCAPE,e.from(t))}static parseClassChar(e,t){if(!e.more())throw new ye(q.ERR_MISSING_BRACKET,e.from(t));return e.lookingAt("\\")?q.parseEscape(e):e.pop()}static hasCapture(e){if(e===null)return!1;if(e.op===I.Op.CAPTURE)return!0;if(e.subs){for(let t of e.subs)if(q.hasCapture(t))return!0}return!1}constructor(e,t=0){this.wholeRegexp=e,this.flags=t,this.numCap=0,this.namedGroups=Object.create(null),this.stack=[],this.free=null,this.numRegexp=0,this.numRunes=0,this.repeats=0,this.height=null,this.size=null,this.nlb=0}newRegexp(e){let t=this.free;return t!==null&&t.subs!==null&&t.subs.length>0?(this.free=t.subs[0],t.reinit(),t.op=e):(t=new I(e),this.numRegexp+=1),t}reuse(e){this.height!==null&&this.height.has(e)&&this.height.delete(e),e.subs!==null&&e.subs.length>0&&(e.subs[0]=this.free),this.free=e}checkLimits(e){if(this.numRunes>q.MAX_RUNES)throw new ye(q.ERR_LARGE);this.checkSize(e),this.checkHeight(e)}checkSize(e){if(this.size===null){if(this.repeats===0&&(this.repeats=1),e.op===I.Op.REPEAT){let t=e.max;t===-1&&(t=e.min),t<=0&&(t=1),t>Math.floor(q.MAX_SIZE/this.repeats)?this.repeats=q.MAX_SIZE:this.repeats*=t}if(this.numRegexp<Math.floor(q.MAX_SIZE/this.repeats))return;this.size=new Map;for(let t of this.stack)this.checkSize(t)}if(this.calcSize(e,!0)>q.MAX_SIZE)throw new ye(q.ERR_LARGE)}calcSize(e,t=!1){if(!t&&this.size!==null&&this.size.has(e))return this.size.get(e);let n=0;switch(e.op){case I.Op.LITERAL:n=e.runes.length;break;case I.Op.PLB:case I.Op.NLB:case I.Op.CAPTURE:case I.Op.STAR:n=2+this.calcSize(e.subs[0]);break;case I.Op.PLUS:case I.Op.QUEST:n=1+this.calcSize(e.subs[0]);break;case I.Op.CONCAT:for(let s of e.subs)n=n+this.calcSize(s);break;case I.Op.ALTERNATE:for(let s of e.subs)n=n+this.calcSize(s);e.subs.length>1&&(n=n+e.subs.length-1);break;case I.Op.REPEAT:{let s=this.calcSize(e.subs[0]);if(e.max===-1){e.min===0?n=2+s:n=1+e.min*s;break}n=e.max*s+(e.max-e.min);break}}return n=Math.max(1,n),this.size===null&&(this.size=new Map),this.size.set(e,n),n}checkHeight(e){if(!(this.numRegexp<q.MAX_HEIGHT)){if(this.height===null){this.height=new Map;for(let t of this.stack)this.checkHeight(t)}if(this.calcHeight(e,!0)>q.MAX_HEIGHT)throw new ye(q.ERR_NESTING_DEPTH)}}calcHeight(e,t=!1){if(!t&&this.height!==null&&this.height.has(e))return this.height.get(e);let n=1;for(let s of e.subs){const i=this.calcHeight(s);n<1+i&&(n=1+i)}return this.height===null&&(this.height=new Map),this.height.set(e,n),n}pop(){return this.stack.pop()}popToPseudo(){const e=this.stack.length;let t=e;for(;t>0&&!I.isPseudoOp(this.stack[t-1].op);)t--;return this.stack.splice(t,e-t)}push(e){if(this.numRunes+=e.runes.length,e.op===I.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]===e.runes[1]){if(this.maybeConcat(e.runes[0],this.flags&-2))return null;e.op=I.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags&-2}else if(e.op===I.Op.CHAR_CLASS&&e.runes.length===4&&e.runes[0]===e.runes[1]&&e.runes[2]===e.runes[3]&&Y.simpleFold(e.runes[0])===e.runes[2]&&Y.simpleFold(e.runes[2])===e.runes[0]||e.op===I.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]+1===e.runes[1]&&Y.simpleFold(e.runes[0])===e.runes[1]&&Y.simpleFold(e.runes[1])===e.runes[0]){if(this.maybeConcat(e.runes[0],this.flags|U.FOLD_CASE))return null;e.op=I.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags|U.FOLD_CASE}else this.maybeConcat(-1,0);return this.stack.push(e),this.checkLimits(e),e}maybeConcat(e,t){const n=this.stack.length;if(n<2)return!1;const s=this.stack[n-1],i=this.stack[n-2];if(s.op!==I.Op.LITERAL||i.op!==I.Op.LITERAL||(s.flags&U.FOLD_CASE)!==(i.flags&U.FOLD_CASE))return!1;Array.isArray(i.runes)||(i.runes=Array.from(i.runes));for(let o=0;o<s.runes.length;o++)i.runes.push(s.runes[o]);return e>=0?(s.runes=[e],s.flags=t,!0):(this.pop(),this.reuse(s),!1)}newLiteral(e,t){const n=this.newRegexp(I.Op.LITERAL);return n.flags=t,(t&U.FOLD_CASE)!==0&&(e=q.minFoldRune(e)),n.runes=[e],n}literal(e){this.push(this.newLiteral(e,this.flags))}op(e){const t=this.newRegexp(e);return t.flags=this.flags,this.push(t)}repeat(e,t,n,s,i,o){let B=this.flags;if((B&U.PERL_X)!==0&&(i.more()&&i.lookingAt("?")&&(i.skip(1),B^=U.NON_GREEDY),o!==-1))throw new ye(q.ERR_INVALID_REPEAT_OP,i.from(o));const u=this.stack.length;if(u===0)throw new ye(q.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));const c=this.stack[u-1];if(I.isPseudoOp(c.op))throw new ye(q.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));const h=this.newRegexp(e);if(h.min=t,h.max=n,h.flags=B,h.subs=[c],this.stack[u-1]=h,this.checkLimits(h),e===I.Op.REPEAT&&(t>=2||n>=2)&&!this.repeatIsValid(h,1e3))throw new ye(q.ERR_INVALID_REPEAT_SIZE,i.from(s))}repeatIsValid(e,t){if(e.op===I.Op.REPEAT){let n=e.max;if(n===0)return!0;if(n<0&&(n=e.min),n>t)return!1;n>0&&(t=Math.trunc(t/n))}for(let n of e.subs)if(!this.repeatIsValid(n,t))return!1;return!0}concat(){this.maybeConcat(-1,0);const e=this.popToPseudo();return e.length===0?this.push(this.newRegexp(I.Op.EMPTY_MATCH)):this.push(this.collapse(e,I.Op.CONCAT))}alternate(){const e=this.popToPseudo();return e.length>0&&this.cleanAlt(e[e.length-1]),e.length===0?this.push(this.newRegexp(I.Op.NO_MATCH)):this.push(this.collapse(e,I.Op.ALTERNATE))}cleanAlt(e){e.op===I.Op.CHAR_CLASS&&(e.runes=new ar(Array.from(e.runes)).cleanClass().toArray(),e.runes.length===2&&e.runes[0]===0&&e.runes[1]===Y.MAX_RUNE?(e.runes=new Int32Array(0),e.op=I.Op.ANY_CHAR):e.runes.length===4&&e.runes[0]===0&&e.runes[1]===k.CODES.get(`
`)-1&&e.runes[2]===k.CODES.get(`
`)+1&&e.runes[3]===Y.MAX_RUNE&&(e.runes=new Int32Array(0),e.op=I.Op.ANY_CHAR_NOT_NL))}collapse(e,t){if(e.length===1)return e[0];let n=0;for(let B of e)n+=B.op===t?B.subs.length:1;let s=new Array(n).fill(null),i=0;for(let B of e)if(B.op===t){for(let u=0;u<B.subs.length;u++)s[i++]=B.subs[u];this.reuse(B)}else s[i++]=B;let o=this.newRegexp(t);if(o.subs=s,t===I.Op.ALTERNATE&&(o.subs=this.factor(o.subs),o.subs.length===1)){const B=o;o=o.subs[0],this.reuse(B)}return o}factor(e){if(e.length<2)return e;let t=0,n=e.length,s=0,i=null,o=0,B=0,u=0;for(let h=0;h<=n;h++){let d=null,C=0,g=0;if(h<n){let D=e[t+h];if(D.op===I.Op.CONCAT&&D.subs.length>0&&(D=D.subs[0]),D.op===I.Op.LITERAL&&(d=D.runes,C=D.runes.length,g=D.flags&U.FOLD_CASE),g===B){let P=0;for(;P<o&&P<C&&i[P]===d[P];)P++;if(P>0){o=P;continue}}}if(h!==u)if(h===u+1)e[s++]=e[t+u];else{const D=this.newRegexp(I.Op.LITERAL);D.flags=B,D.runes=i.slice(0,o);for(let J=u;J<h;J++)e[t+J]=this.removeLeadingString(e[t+J],o),this.checkLimits(e[t+J]);const P=this.collapse(e.slice(t+u,t+h),I.Op.ALTERNATE),N=this.newRegexp(I.Op.CONCAT);N.subs=[D,P],e[s++]=N}u=h,i=d,o=C,B=g}n=s,t=0,u=0,s=0;let c=null;for(let h=0;h<=n;h++){let d=null;if(!(h<n&&(d=q.leadingRegexp(e[t+h]),c!==null&&c.equals(d)&&(q.isCharClass(c)||c.op===I.Op.REPEAT&&c.min===c.max&&q.isCharClass(c.subs[0]))))){if(h!==u)if(h===u+1)e[s++]=e[t+u];else{const C=c;for(let P=u;P<h;P++){const N=P!==u;e[t+P]=this.removeLeadingRegexp(e[t+P],N),this.checkLimits(e[t+P])}const g=this.collapse(e.slice(t+u,t+h),I.Op.ALTERNATE),D=this.newRegexp(I.Op.CONCAT);D.subs=[C,g],e[s++]=D}u=h,c=d}}n=s,t=0,u=0,s=0;for(let h=0;h<=n;h++)if(!(h<n&&q.isCharClass(e[t+h]))){if(h!==u)if(h===u+1)e[s++]=e[t+u];else{let d=u;for(let g=u+1;g<h;g++){const D=e[t+d],P=e[t+g];(D.op<P.op||D.op===P.op&&(D.runes!==null?D.runes.length:0)<(P.runes!==null?P.runes.length:0))&&(d=g)}const C=e[t+u];e[t+u]=e[t+d],e[t+d]=C;for(let g=u+1;g<h;g++)q.mergeCharClass(e[t+u],e[t+g]),this.reuse(e[t+g]);this.cleanAlt(e[t+u]),e[s++]=e[t+u]}h<n&&(e[s++]=e[t+h]),u=h+1}n=s,t=0,u=0,s=0;for(let h=0;h<n;++h)h+1<n&&e[t+h].op===I.Op.EMPTY_MATCH&&e[t+h+1].op===I.Op.EMPTY_MATCH||(e[s++]=e[t+h]);return n=s,t=0,e.slice(t,n)}removeLeadingString(e,t){if(e.op===I.Op.CONCAT&&e.subs.length>0){const n=this.removeLeadingString(e.subs[0],t);if(e.subs[0]=n,n.op===I.Op.EMPTY_MATCH)switch(this.reuse(n),e.subs.length){case 0:case 1:e.op=I.Op.EMPTY_MATCH,e.subs=I.emptySubs();break;case 2:{const s=e;e=e.subs[1],this.reuse(s);break}default:e.subs=e.subs.slice(1,e.subs.length)}return e}return e.op===I.Op.LITERAL&&(e.runes=e.runes.slice(t,e.runes.length),e.runes.length===0&&(e.op=I.Op.EMPTY_MATCH)),e}removeLeadingRegexp(e,t){if(e.op===I.Op.CONCAT&&e.subs.length>0){switch(t&&this.reuse(e.subs[0]),e.subs=e.subs.slice(1,e.subs.length),e.subs.length){case 0:e.op=I.Op.EMPTY_MATCH,e.subs=I.emptySubs();break;case 1:{const n=e;e=e.subs[0],this.reuse(n);break}}return e}return t&&this.reuse(e),this.newRegexp(I.Op.EMPTY_MATCH)}parseInternal(){if((this.flags&U.LITERAL)!==0)return q.literalRegexp(this.wholeRegexp,this.flags);let e=-1,t=-1,n=-1;const s=new ey(this.wholeRegexp);for(;s.more();){let i=-1;e:switch(s.peek()){case k.CODES.get("("):if((this.flags&U.LOOKBEHIND)!==0){if(s.lookingAt("(?<=")){this.parsePosLookBehind(),s.skip(4);break}if(s.lookingAt("(?<!")){this.parseNegLookBehind(),s.skip(4);break}}if((this.flags&U.PERL_X)!==0&&s.lookingAt("(?")){this.parsePerlFlags(s);break}this.op(I.Op.LEFT_PAREN).cap=++this.numCap,s.skip(1);break;case k.CODES.get("|"):this.parseVerticalBar(),s.skip(1);break;case k.CODES.get(")"):this.parseRightParen(),s.skip(1);break;case k.CODES.get("^"):(this.flags&U.ONE_LINE)!==0?this.op(I.Op.BEGIN_TEXT):this.op(I.Op.BEGIN_LINE),s.skip(1);break;case k.CODES.get("$"):(this.flags&U.ONE_LINE)!==0?this.op(I.Op.END_TEXT).flags|=U.WAS_DOLLAR:this.op(I.Op.END_LINE),s.skip(1);break;case k.CODES.get("."):(this.flags&U.DOT_NL)!==0?this.op(I.Op.ANY_CHAR):this.op(I.Op.ANY_CHAR_NOT_NL),s.skip(1);break;case k.CODES.get("["):this.parseClass(s);break;case k.CODES.get("*"):case k.CODES.get("+"):case k.CODES.get("?"):{i=s.pos();let o=null;switch(s.pop()){case k.CODES.get("*"):o=I.Op.STAR;break;case k.CODES.get("+"):o=I.Op.PLUS;break;case k.CODES.get("?"):o=I.Op.QUEST}this.repeat(o,t,n,i,s,e);break}case k.CODES.get("{"):{const o=s.pos(),B=q.parseRepeat(s);if(B<0){s.rewindTo(o),this.literal(s.pop());break}i=o,t=B>>16,n=(B&Y.MAX_BMP)<<16>>16,this.repeat(I.Op.REPEAT,t,n,i,s,e);break}case k.CODES.get("\\"):{const o=s.pos();if(s.skip(1),(this.flags&U.PERL_X)!==0&&s.more())switch(s.pop()){case k.CODES.get("A"):this.op(I.Op.BEGIN_TEXT);break e;case k.CODES.get("b"):this.op(I.Op.WORD_BOUNDARY);break e;case k.CODES.get("B"):this.op(I.Op.NO_WORD_BOUNDARY);break e;case k.CODES.get("C"):throw new ye(q.ERR_INVALID_ESCAPE,"\\C");case k.CODES.get("Q"):{let c=s.rest();const h=c.indexOf("\\E");h>=0?(c=c.substring(0,h),s.skipString(c),s.skipString("\\E")):s.skipString(c);let d=0;for(;d<c.length;){const C=c.codePointAt(d);this.literal(C),d+=$.charCount(C)}break e}case k.CODES.get("z"):this.op(I.Op.END_TEXT);break e;default:s.rewindTo(o)}else s.rewindTo(o);const B=this.newRegexp(I.Op.CHAR_CLASS);if(B.flags=this.flags,s.lookingAt("\\p")||s.lookingAt("\\P")){const c=new ar;if(this.parseUnicodeClass(s,c)){B.runes=c.toArray(),this.push(B);break e}}const u=new ar;if(this.parsePerlClassEscape(s,u)){B.runes=u.toArray(),this.push(B);break e}s.rewindTo(o),this.reuse(B),this.literal(q.parseEscape(s));break}default:this.literal(s.pop())}e=i}if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length!==1)throw new ye(q.ERR_MISSING_PAREN,this.wholeRegexp);return this.stack[0].namedGroups=this.namedGroups,this.stack[0]}parsePerlFlags(e){const t=e.pos(),n=e.rest();if(n.startsWith("(?P<")||n.startsWith("(?<")){const B=n.charAt(2)==="P"?4:3,u=n.indexOf(">");if(u<0)throw new ye(q.ERR_INVALID_NAMED_CAPTURE,n);const c=n.substring(B,u);if(e.skipString(c),e.skip(B+1),!q.isValidCaptureName(c))throw new ye(q.ERR_INVALID_NAMED_CAPTURE,n.substring(0,u+1));const h=this.op(I.Op.LEFT_PAREN);if(h.cap=++this.numCap,this.namedGroups[c])throw new ye(q.ERR_DUPLICATE_NAMED_CAPTURE,c);this.namedGroups[c]=this.numCap,h.name=c;return}e.skip(2);let s=this.flags,i=1,o=!1;e:for(;e.more();){const B=e.pop();switch(B){case k.CODES.get("i"):s|=U.FOLD_CASE,o=!0;break;case k.CODES.get("m"):s&=-17,o=!0;break;case k.CODES.get("s"):s|=U.DOT_NL,o=!0;break;case k.CODES.get("U"):s|=U.NON_GREEDY,o=!0;break;case k.CODES.get("-"):if(i<0)break e;i=-1,s=~s,o=!1;break;case k.CODES.get(":"):case k.CODES.get(")"):if(i<0){if(!o)break e;s=~s}B===k.CODES.get(":")&&this.op(I.Op.LEFT_PAREN),this.flags=s;return;default:break e}}throw new ye(q.ERR_INVALID_PERL_OP,e.from(t))}parsePosLookBehind(){const e=this.newRegexp(I.Op.LEFT_PAREN);return e.flags=this.flags,e.lb=++this.nlb,this.push(e)}parseNegLookBehind(){const e=this.newRegexp(I.Op.LEFT_PAREN);return e.flags=this.flags,e.lb=-++this.nlb,this.push(e)}parseVerticalBar(){this.concat(),this.swapVerticalBar()||this.op(I.Op.VERTICAL_BAR)}swapVerticalBar(){const e=this.stack.length;if(e>=3&&this.stack[e-2].op===I.Op.VERTICAL_BAR&&q.isCharClass(this.stack[e-1])&&q.isCharClass(this.stack[e-3])){let t=this.stack[e-1],n=this.stack[e-3];if(t.op>n.op){const s=n;n=t,t=s,this.stack[e-3]=n}return q.mergeCharClass(n,t),this.reuse(t),this.pop(),!0}if(e>=2){const t=this.stack[e-1],n=this.stack[e-2];if(n.op===I.Op.VERTICAL_BAR)return e>=3&&this.cleanAlt(this.stack[e-3]),this.stack[e-2]=t,this.stack[e-1]=n,!0}return!1}parseRightParen(){if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length<2)throw new ye(q.ERR_UNEXPECTED_PAREN,this.wholeRegexp);const e=this.pop(),t=this.pop();if(t.op!==I.Op.LEFT_PAREN)throw new ye(q.ERR_UNEXPECTED_PAREN,this.wholeRegexp);if(this.flags=t.flags,t.lb!==0){if(q.hasCapture(e))throw new ye(q.ERR_INVALID_CAPTURE_IN_LOOKBEHIND,this.wholeRegexp);t.lb>0?t.op=I.Op.PLB:t.op=I.Op.NLB,t.subs=[e],this.push(t);return}t.cap===0?this.push(e):(t.op=I.Op.CAPTURE,t.subs=[e],this.push(t))}parsePerlClassEscape(e,t){const n=e.pos();if((this.flags&U.PERL_X)===0||!e.more()||e.pop()!==k.CODES.get("\\")||!e.more())return!1;e.pop();const s=e.from(n),i=Ah.has(s)?Ah.get(s):null;return i===null?!1:(t.appendGroup(i,(this.flags&U.FOLD_CASE)!==0),!0)}parseNamedClass(e,t){const n=e.rest(),s=n.indexOf(":]");if(s<0)return!1;const i=n.substring(0,s+2);e.skipString(i);const o=Uh.has(i)?Uh.get(i):null;if(o===null)throw new ye(q.ERR_INVALID_CHAR_RANGE,i);return t.appendGroup(o,(this.flags&U.FOLD_CASE)!==0),!0}parseUnicodeClass(e,t){const n=e.pos();if((this.flags&U.UNICODE_GROUPS)===0||!e.lookingAt("\\p")&&!e.lookingAt("\\P"))return!1;e.skip(1);let s=1,i=e.pop();if(i===k.CODES.get("P")&&(s=-1),!e.more())throw e.rewindTo(n),new ye(q.ERR_INVALID_CHAR_RANGE,e.rest());i=e.pop();let o;if(i!==k.CODES.get("{"))o=$.runeToString(i);else{const h=e.rest(),d=h.indexOf("}");if(d<0)throw e.rewindTo(n),new ye(q.ERR_INVALID_CHAR_RANGE,e.rest());o=h.substring(0,d),e.skipString(o),e.skip(1)}o.length!==0&&o.codePointAt(0)===k.CODES.get("^")&&(s=0-s,o=o.substring(1));const B=q.unicodeTable(o);if(B===null)throw new ye(q.ERR_INVALID_CHAR_RANGE,e.from(n));B.sign<0&&(s=0-s);const u=B.tab,c=B.fold;if((this.flags&U.FOLD_CASE)===0||c===null)t.appendTableWithSign(u,s);else{const h=new ar().appendTable(u).appendTable(c).cleanClass().toArray();t.appendClassWithSign(Array.from(h),s)}return!0}parseClass(e){const t=e.pos();e.skip(1);const n=this.newRegexp(I.Op.CHAR_CLASS);n.flags=this.flags;const s=new ar;let i=1;e.more()&&e.lookingAt("^")&&(i=-1,e.skip(1),(this.flags&U.CLASS_NL)===0&&s.appendRange(k.CODES.get(`
`),k.CODES.get(`
`)));let o=!0;for(;!e.more()||e.peek()!==k.CODES.get("]")||o;){if(e.more()&&e.lookingAt("-")&&(this.flags&U.PERL_X)===0&&!o){const h=e.rest();if(h==="-"||!h.startsWith("-]"))throw e.rewindTo(t),new ye(q.ERR_INVALID_CHAR_RANGE,e.rest())}o=!1;const B=e.pos();if(e.lookingAt("[:")){if(this.parseNamedClass(e,s))continue;e.rewindTo(B)}if(this.parseUnicodeClass(e,s)||this.parsePerlClassEscape(e,s))continue;e.rewindTo(B);const u=q.parseClassChar(e,t);let c=u;if(e.more()&&e.lookingAt("-")){if(e.skip(1),e.more()&&e.lookingAt("]"))e.skip(-1);else if(c=q.parseClassChar(e,t),c<u)throw new ye(q.ERR_INVALID_CHAR_RANGE,e.from(B))}(this.flags&U.FOLD_CASE)===0?s.appendRange(u,c):s.appendFoldedRange(u,c)}e.skip(1),s.cleanClass(),i<0&&s.negateClass(),n.runes=s.toArray(),this.push(n)}},H(q,"ERR_INTERNAL_ERROR","regexp/syntax: internal error"),H(q,"ERR_INVALID_CHAR_RANGE","invalid character class range"),H(q,"ERR_INVALID_ESCAPE","invalid escape sequence"),H(q,"ERR_INVALID_NAMED_CAPTURE","invalid named capture"),H(q,"ERR_INVALID_PERL_OP","invalid or unsupported Perl syntax"),H(q,"ERR_INVALID_REPEAT_OP","invalid nested repetition operator"),H(q,"ERR_INVALID_REPEAT_SIZE","invalid repeat count"),H(q,"ERR_MISSING_BRACKET","missing closing ]"),H(q,"ERR_MISSING_PAREN","missing closing )"),H(q,"ERR_MISSING_REPEAT_ARGUMENT","missing argument to repetition operator"),H(q,"ERR_TRAILING_BACKSLASH","trailing backslash at end of expression"),H(q,"ERR_DUPLICATE_NAMED_CAPTURE","duplicate capture group name"),H(q,"ERR_UNEXPECTED_PAREN","unexpected )"),H(q,"ERR_NESTING_DEPTH","expression nests too deeply"),H(q,"ERR_LARGE","expression too large"),H(q,"ERR_INVALID_CAPTURE_IN_LOOKBEHIND","invalid capture in lookbehind"),H(q,"MAX_HEIGHT",1e3),H(q,"MAX_SIZE",1398101),H(q,"MAX_RUNES",33554432),H(q,"ANY_TABLE",new E(new Uint32Array([0,Y.MAX_RUNE,1]))),H(q,"ASCII_TABLE",new E(new Uint32Array([0,127,1]))),H(q,"ASCII_FOLD_TABLE",new E(new Uint32Array([0,127,1,383,383,1,8490,8490,1]))),q),ny=class ur{static initTest(e){const t=ur.compile(e),n=new ur(t.expr,t.prog,t.numSubexp,t.longest);return n.cond=t.cond,n.prefix=t.prefix,n.prefixUTF8=t.prefixUTF8,n.prefixComplete=t.prefixComplete,n.prefixRune=t.prefixRune,n.prefilter=t.prefilter,n}static compile(e){return ur.compileImpl(e,U.PERL,!1)}static compilePOSIX(e){return ur.compileImpl(e,U.POSIX,!0)}static compileImpl(e,t,n){let s=ty.parse(e,t);const i=s.maxCap(),o=s.namedGroups;s=Zw.simplify(s);const B=$w.build(s),u=Xw.compileRegexp(s),c=new ur(e,u,i,n);c.prefilter=B.type===ue.Type.NONE?null:B;const[h,d]=u.prefix();return c.prefixComplete=h,c.prefix=d,c.prefixUTF8=$.stringToUtf8ByteArray(c.prefix),c.prefix.length>0&&(c.prefixRune=c.prefix.codePointAt(0)),c.namedGroups=o,c}static match(e,t){return ur.compile(e).match(t)}constructor(e,t,n=0,s=0){this.expr=e,this.prog=t,this.numSubexp=n,this.longest=s,this.cond=t.startCond(),this.prefix=null,this.prefixUTF8=null,this.prefixComplete=!1,this.prefixRune=0,this.machinePool=[],this.dfa=new _C(this.prog),this.onepass=_h.compile(this.prog),this.prefilter=null}matchPrefixComplete(e,t,n,s){if((n===U.ANCHOR_START||n===U.ANCHOR_BOTH)&&t!==0)return null;let i=-1,o=-1;const B=e.prefixLength(this);if(n===U.UNANCHORED){const u=e.index(this,t);if(u<0)return null;i=t+u,o=i+B}else if(n===U.ANCHOR_BOTH){if(e.endPos()!==B||e.index(this,0)!==0)return null;i=0,o=B}else if(n===U.ANCHOR_START){if(e.index(this,0)!==0)return null;i=0,o=B}if(i<0)return null;if(s>0){const u=new Int32Array(s).fill(-1);return u[0]=i,u[1]=o,Array.from(u)}return[]}createLookbehindState(){return this.prog.numLb>0?new kw(this.prog):null}executeEngine(e,t,n,s,i=null){if(this.prefixComplete&&(s===0||this.numSubexp===0))return this.matchPrefixComplete(e,t,n,s);if(this.prefilter!==null&&n===U.UNANCHORED&&!this.prefilter.eval(e,t))return null;if(this.onepass!==null)return _h.execute(this,e,t,n,s);if(s>0)return this.prog.numLb===0&&e.endPos()<=uo.maxBitStateLen(this.prog)?uo.execute(this,e,t,n,s):this.doExecuteNFA(e,t,n,s,i);if(this.prog.numLb===0){const o=this.dfa.match(e,t,n);if(o!==null)return o?[]:null;if(e.endPos()<=uo.maxBitStateLen(this.prog))return uo.execute(this,e,t,n,s)}return this.doExecuteNFA(e,t,n,s,i)}numberOfCapturingGroups(){return this.numSubexp}numberOfInstructions(){return this.prog.numInst()}get(){return this.machinePool.length>0?this.machinePool.pop():null}reset(){this.machinePool.length=0}put(e){this.machinePool.push(e)}toString(){return this.expr}doExecuteNFA(e,t,n,s,i=null){let o=this.get();o||(o=xw.fromRE2(this)),o.init(s);const B=o.match(e,t,n,i)?o.submatches():null;return this.put(o),B}match(e){return this.executeEngine(Ie.fromUTF16(e),0,U.UNANCHORED,0)!==null}matchWithGroup(e,t,n,s,i,o=null){return e instanceof Tr||($.isByteArray(e)?e=lr.utf8(e):e=lr.utf16(e)),this.matchMachineInput(e,t,n,s,i,o)}matchMachineInput(e,t,n,s,i,o=null){if(t>n)return[!1,null];const B=e.isUTF16Encoding()?Ie.fromUTF16(e.asCharSequence(),0,n):Ie.fromUTF8(e.asBytes(),0,n),u=this.executeEngine(B,t,s,2*i,o);return u===null?[!1,null]:[!0,u]}matchUTF8(e){return this.executeEngine(Ie.fromUTF8(e),0,U.UNANCHORED,0)!==null}replaceAll(e,t){return this.replaceAllFunc(e,()=>t,2*e.length+1)}replaceFirst(e,t){return this.replaceAllFunc(e,()=>t,1)}replaceAllFunc(e,t,n){let s=0,i=0,o="";const B=Ie.fromUTF16(e),u=this.createLookbehindState();let c=0;for(;i<=e.length;){const h=this.executeEngine(B,i,U.UNANCHORED,2,u);if(h===null||h.length===0)break;o+=e.substring(s,h[0]),(h[1]>s||h[0]===0)&&(o+=t(e.substring(h[0],h[1])),c++),s=h[1];const d=B.step(i)&7;if(i+d>h[1]?i+=d:i+1>h[1]?i++:i=h[1],c>=n)break}return o+=e.substring(s),o}pad(e){if(e===null)return null;let t=(1+this.numSubexp)*2;if(e.length<t){let n=new Array(t).fill(-1);for(let s=0;s<e.length;s++)n[s]=e[s];e=n}return e}allMatches(e,t,n=s=>s){let s=[];const i=e.endPos();t<0&&(t=i+1);let o=0,B=0,u=-1;const c=this.createLookbehindState();for(;B<t&&o<=i;){const h=this.executeEngine(e,o,U.UNANCHORED,this.prog.numCap,c);if(h===null||h.length===0)break;let d=!0;if(h[1]===o){h[0]===u&&(d=!1);const C=e.step(o);C<0?o=i+1:o+=C&7}else o=h[1];u=h[1],d&&(s.push(n(this.pad(h))),B++)}return s}findUTF8(e){const t=this.executeEngine(Ie.fromUTF8(e),0,U.UNANCHORED,2);return t===null?null:e.slice(t[0],t[1])}findUTF8Index(e){const t=this.executeEngine(Ie.fromUTF8(e),0,U.UNANCHORED,2);return t===null?null:t.slice(0,2)}find(e){const t=this.executeEngine(Ie.fromUTF16(e),0,U.UNANCHORED,2);return t===null?"":e.substring(t[0],t[1])}findIndex(e){return this.executeEngine(Ie.fromUTF16(e),0,U.UNANCHORED,2)}findUTF8Submatch(e){const t=this.executeEngine(Ie.fromUTF8(e),0,U.UNANCHORED,this.prog.numCap);if(t===null)return null;const n=new Array(1+this.numSubexp).fill(null);for(let s=0;s<n.length;s++)2*s<t.length&&t[2*s]>=0&&(n[s]=e.slice(t[2*s],t[2*s+1]));return n}findUTF8SubmatchIndex(e){return this.pad(this.executeEngine(Ie.fromUTF8(e),0,U.UNANCHORED,this.prog.numCap))}findSubmatch(e){const t=this.executeEngine(Ie.fromUTF16(e),0,U.UNANCHORED,this.prog.numCap);if(t===null)return null;const n=new Array(1+this.numSubexp).fill(null);for(let s=0;s<n.length;s++)2*s<t.length&&t[2*s]>=0&&(n[s]=e.substring(t[2*s],t[2*s+1]));return n}findSubmatchIndex(e){return this.pad(this.executeEngine(Ie.fromUTF16(e),0,U.UNANCHORED,this.prog.numCap))}findAllUTF8(e,t){const n=this.allMatches(Ie.fromUTF8(e),t,s=>e.slice(s[0],s[1]));return n.length===0?null:n}findAllUTF8Index(e,t){const n=this.allMatches(Ie.fromUTF8(e),t,s=>s.slice(0,2));return n.length===0?null:n}findAll(e,t){const n=this.allMatches(Ie.fromUTF16(e),t,s=>e.substring(s[0],s[1]));return n.length===0?null:n}findAllIndex(e,t){const n=this.allMatches(Ie.fromUTF16(e),t,s=>s.slice(0,2));return n.length===0?null:n}findAllUTF8Submatch(e,t){const n=this.allMatches(Ie.fromUTF8(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.slice(s[2*o],s[2*o+1]));return i});return n.length===0?null:n}findAllUTF8SubmatchIndex(e,t){const n=this.allMatches(Ie.fromUTF8(e),t);return n.length===0?null:n}findAllSubmatch(e,t){const n=this.allMatches(Ie.fromUTF16(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.substring(s[2*o],s[2*o+1]));return i});return n.length===0?null:n}findAllSubmatchIndex(e,t){const n=this.allMatches(Ie.fromUTF16(e),t);return n.length===0?null:n}},ry=class Ur{static isHexadecimal(e){return"0"<=e&&e<="9"||"A"<=e&&e<="F"||"a"<=e&&e<="f"}static translate(e){let t="";if(e instanceof RegExp&&(e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),e.dotAll&&(t+="s"),e=e.source),typeof e!="string")return e;let n="",s=!1,i=e.length;i===0&&(n="(?:)",s=!0);let o=!1,B=0;for(;B<i;){let c=e[B];if(c==="\\"){if(B+1<i)switch(c=e[B+1],c){case"\\":n+="\\\\",B+=2;continue;case"c":if(B+2<i){let C=e[B+2].charCodeAt(0);if(C>=65&&C<=90||C>=97&&C<=122){let g=C%32;n+="\\x",n+=(g>>4).toString(16).toUpperCase(),n+=(g&15).toString(16).toUpperCase(),B+=3,s=!0;continue}}n+="c",B+=2,s=!0;continue;case"u":if(B+2<i){if(e[B+2]==="{"){let C=B+3,g=!1,D=!1;for(;C<i;){const P=e[C];if(P==="}"){D=!0;break}if(!Ur.isHexadecimal(P))break;g=!0,C++}if(D&&g){n+="\\x",B+=2,s=!0;continue}}else if(B+5<i){let C=!0;for(let g=0;g<4;g++)if(!Ur.isHexadecimal(e[B+2+g])){C=!1;break}if(C){n+="\\x{"+e.substring(B+2,B+6)+"}",B+=6,s=!0;continue}}}n+="u",B+=2,s=!0;continue;case"x":{let C=!1;if(B+2<i&&e[B+2]==="{"){let g=B+3,D=!1,P=!1;for(;g<i;){const N=e[g];if(N==="}"){P=!0;break}if(!Ur.isHexadecimal(N))break;D=!0,g++}P&&D&&(C=!0)}else B+3<i&&Ur.isHexadecimal(e[B+2])&&Ur.isHexadecimal(e[B+3])&&(C=!0);C?(n+="\\x",B+=2):(n+="x",B+=2,s=!0);continue}case"n":case"r":case"t":case"a":case"f":case"v":case"d":case"D":case"s":case"S":case"w":case"W":case"b":case"B":case"p":case"P":case"A":case"z":case"Q":case"E":case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":n+="\\"+c,B+=2;continue;default:{let C=e.codePointAt(B+1);if(C>=48&&C<=57||C>=65&&C<=90||C>=97&&C<=122){let g=$.charCount(C);n+=e.substring(B+1,B+1+g),B+=g+1,s=!0}else{n+="\\";let g=$.charCount(C);n+=e.substring(B+1,B+1+g),B+=g+1}continue}}}else if(c==="/"){n+="\\/",B+=1,s=!0;continue}else if(c==="[")o=!0;else if(c==="]")o=!1;else if(!o&&c==="("&&B+2<i&&e[B+1]==="?"&&e[B+2]==="<"&&B+3<i&&!"=!>)".includes(e[B+3])){n+="(?P<",B+=3,s=!0;continue}let h=e.codePointAt(B),d=$.charCount(h);n+=e.substring(B,B+d),B+=d}const u=s?n:e;return t.length>0?`(?${t})${u}`:u}},Ve,Fu=(Ve=class{static quote(e){return $.quoteMeta(e)}static quoteReplacement(e,t=!1){return ph.quoteReplacement(e,t)}static translateRegExp(e){return ry.translate(e)}static compile(e,t=0){let n=e;if((t&Ve.CASE_INSENSITIVE)!==0&&(n=`(?i)${n}`),(t&Ve.DOTALL)!==0&&(n=`(?s)${n}`),(t&Ve.MULTILINE)!==0&&(n=`(?m)${n}`),(t&-544)!==0)throw new Lw("Flags should only be a combination of MULTILINE, DOTALL, CASE_INSENSITIVE, DISABLE_UNICODE_GROUPS, LONGEST_MATCH, LOOKBEHINDS");let s=U.PERL;(t&Ve.DISABLE_UNICODE_GROUPS)!==0&&(s&=-129),(t&Ve.LOOKBEHINDS)!==0&&(s|=U.LOOKBEHIND);const i=new Ve(e,t);return i.re2Input=ny.compileImpl(n,s,(t&Ve.LONGEST_MATCH)!==0),i}static matches(e,t){return Ve.compile(e).testExact(t)}static initTest(e,t,n){if(e==null)throw new Error("pattern is null");if(n==null)throw new Error("re2 is null");const s=new Ve(e,t);return s.re2Input=n,s}constructor(e,t){this.patternInput=e,this.flagsInput=t,this.re2Input=null}reset(){this.re2Input.reset()}flags(){return this.flagsInput}pattern(){return this.patternInput}re2(){return this.re2Input}matches(e){return this.testExact(e)}matcher(e){return $.isByteArray(e)&&(e=lr.utf8(e)),new ph(this,e)}test(e){return $.isByteArray(e)?this.re2Input.matchUTF8(e):this.re2Input.match(e)}testExact(e){const t=$.isByteArray(e)?Ie.fromUTF8(e):Ie.fromUTF16(e);return this.re2Input.executeEngine(t,0,U.ANCHOR_BOTH,0)!==null}exec(e){const t=this.matcher(e);if(!t.find())return null;const n=[t.group(0)];for(let i=1;i<=t.groupCount();i++){const o=t.group(i);n.push(o===null?void 0:o)}n.index=t.start(0),n.input=e;const s=this.namedGroups();if(Object.keys(s).length>0){const i=t.getNamedGroups();for(const o in i)i[o]===null&&(i[o]=void 0);n.groups=i}else n.groups=void 0;return n}split(e,t=0){const n=this.matcher(e),s=[];let i=0,o=0;for(;n.find();){if(o===0&&n.end()===0){o=n.end();continue}if(t>0&&s.length===t-1)break;if(o===n.start()){if(t===0){i+=1,o=n.end();continue}}else for(;i>0;)s.push(""),i-=1;s.push(n.substring(o,n.start())),o=n.end()}if(t===0&&o!==n.inputLength()){for(;i>0;)s.push(""),i-=1;s.push(n.substring(o,n.inputLength()))}return(t!==0||s.length===0&&!(o===n.inputLength()&&o>0))&&s.push(n.substring(o,n.inputLength())),s}*matchAll(e){const t=this.matcher(e);for(;t.find();){const n=[t.group(0)];for(let i=1;i<=t.groupCount();i++){const o=t.group(i);n.push(o===null?void 0:o)}n.index=t.start(0),n.input=e;const s=this.namedGroups();if(Object.keys(s).length>0){const i=t.getNamedGroups();for(const o in i)i[o]===null&&(i[o]=void 0);n.groups=i}else n.groups=void 0;yield n}}toString(){return this.patternInput}programSize(){return this.re2Input.numberOfInstructions()}groupCount(){return this.re2Input.numberOfCapturingGroups()}namedGroups(){return this.re2Input.namedGroups}equals(e){return this===e?!0:e===null||this.constructor!==e.constructor?!1:this.flagsInput===e.flagsInput&&this.patternInput===e.patternInput}},H(Ve,"CASE_INSENSITIVE",Mr.CASE_INSENSITIVE),H(Ve,"DOTALL",Mr.DOTALL),H(Ve,"MULTILINE",Mr.MULTILINE),H(Ve,"DISABLE_UNICODE_GROUPS",Mr.DISABLE_UNICODE_GROUPS),H(Ve,"LONGEST_MATCH",Mr.LONGEST_MATCH),H(Ve,"LOOKBEHINDS",Mr.LOOKBEHINDS),Ve);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let cs="12.19.0";function sy(r){cs=r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ir=new Ba("@firebase/firestore");function Hr(){return Ir.logLevel}function X(r,...e){if(Ir.logLevel<=he.DEBUG){const t=e.map(Lu);Ir.debug(`Firestore (${cs}): ${r}`,...t)}}function gn(r,...e){if(Ir.logLevel<=he.ERROR){const t=e.map(Lu);Ir.error(`Firestore (${cs}): ${r}`,...t)}}function Mt(r,...e){if(Ir.logLevel<=he.WARN){const t=e.map(Lu);Ir.warn(`Firestore (${cs}): ${r}`,...t)}}function Lu(r){if(typeof r=="string")return r;try{return(function(t){return JSON.stringify(t)})(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function re(r,e,t){let n="Unexpected state";typeof e=="string"?n=e:t=e,yC(r,n,t)}function yC(r,e,t){let n=`FIRESTORE (${cs}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{n+=" CONTEXT: "+JSON.stringify(t)}catch{n+=" CONTEXT: "+t}throw gn(n),new Error(n)}function ee(r,e,t,n){let s="Unexpected state";typeof t=="string"?s=t:n=t,r||yC(e,s,n)}function ae(r,e){return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iy(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ku{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=iy(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<t&&(n+=e.charAt(s[i]%62))}return n}}function le(r,e){return r<e?-1:r>e?1:0}function QB(r,e){const t=Math.min(r.length,e.length);for(let n=0;n<t;n++){const s=r.charAt(n),i=e.charAt(n);if(s!==i)return DB(s)===DB(i)?le(s,i):DB(s)?1:-1}return le(r.length,e.length)}const oy=55296,ay=57343;function DB(r){const e=r.charCodeAt(0);return e>=oy&&e<=ay}function Zr(r,e,t){return r.length===e.length&&r.every(((n,s)=>t(n,e[s])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class be{constructor(e,t){this.comparator=e,this.root=t||Qe.EMPTY}insert(e,t){return new be(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Qe.BLACK,null,null))}remove(e){return new be(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Qe.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return t+n.left.size;s<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,n)=>(e(t,n),!1)))}toString(){const e=[];return this.inorderTraversal(((t,n)=>(e.push(`${t}:${n}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new lo(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new lo(this.root,e,this.comparator,!1)}getReverseIterator(){return new lo(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new lo(this.root,e,this.comparator,!0)}}class lo{constructor(e,t,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Qe{constructor(e,t,n,s,i){this.key=e,this.value=t,this.color=n??Qe.RED,this.left=s??Qe.EMPTY,this.right=i??Qe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,s,i){return new Qe(e??this.key,t??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let s=this;const i=n(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,n),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Qe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return Qe.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Qe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Qe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw re(43730,{key:this.key,value:this.value});if(this.right.isRed())throw re(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw re(27949);return e+(this.isRed()?0:1)}}Qe.EMPTY=null,Qe.RED=!0,Qe.BLACK=!1;Qe.EMPTY=new class{constructor(){this.size=0}get key(){throw re(57766)}get value(){throw re(16141)}get color(){throw re(16727)}get left(){throw re(29726)}get right(){throw re(36894)}copy(e,t,n,s,i){return this}insert(e,t,n){return new Qe(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ue{constructor(e){this.comparator=e,this.data=new be(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,n)=>(e(t),!1)))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Hh(this.data.getIterator())}getIteratorFrom(e){return new Hh(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((n=>{t=t.add(n)})),t}isEqual(e){if(!(e instanceof Ue)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new Ue(this.comparator);return t.data=e,t}}class Hh{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const V={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class W extends Ut{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kt="__name__";class qt{constructor(e,t,n){t===void 0?t=0:t>e.length&&re(637,{offset:t,range:e.length}),n===void 0?n=e.length-t:n>e.length-t&&re(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return qt.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof qt?e.forEach((n=>{t.push(n)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let s=0;s<n;s++){const i=qt.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return le(e.length,t.length)}static compareSegments(e,t){const n=qt.isNumericId(e),s=qt.isNumericId(t);return n&&!s?-1:!n&&s?1:n&&s?qt.extractNumericId(e).compare(qt.extractNumericId(t)):QB(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Gn.fromString(e.substring(4,e.length-2))}}class ge extends qt{construct(e,t,n){return new ge(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new W(V.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter((s=>s.length>0)))}return new ge(t)}static emptyPath(){return new ge([])}}const By=/^[_a-zA-Z][_a-zA-Z0-9]*$/;let vt=class Jr extends qt{construct(e,t,n){return new Jr(e,t,n)}static isValidIdentifier(e){return By.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Jr.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Kt}static keyField(){return new Jr([Kt])}static fromServerFormat(e){const t=[];let n="",s=0;const i=()=>{if(n.length===0)throw new W(V.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let o=!1;for(;s<e.length;){const B=e[s];if(B==="\\"){if(s+1===e.length)throw new W(V.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new W(V.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=u,s+=2}else B==="`"?(o=!o,s++):B!=="."||o?(n+=B,s++):(i(),s++)}if(i(),o)throw new W(V.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Jr(t)}static emptyPath(){return new Jr([])}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xt{constructor(e){this.fields=e,e.sort(vt.comparator)}static empty(){return new xt([])}unionWith(e){let t=new Ue(vt.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new xt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Zr(this.fields,e.fields,((t,n)=>t.isEqual(n)))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ho(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Pr(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function uy(r,e){const t=[];for(const n in r)Object.prototype.hasOwnProperty.call(r,n)&&t.push(e(r[n],n,r));return t}function TC(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class te{constructor(e){this.path=e}static fromPath(e){return new te(ge.fromString(e))}static fromName(e){return new te(ge.fromString(e).popFirst(5))}static empty(){return new te(ge.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ge.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return ge.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new te(new ge(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function IC(r,e,t){if(!t)throw new W(V.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function cy(r,e,t,n){if(e===!0&&n===!0)throw new W(V.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Jh(r){if(!te.isDocumentKey(r))throw new W(V.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function jh(r){if(te.isDocumentKey(r))throw new W(V.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function Oi(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function da(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(n){return n.constructor?n.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":re(12329,{type:typeof r})}function Yt(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new W(V.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=da(r);throw new W(V.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ge(r,e){const t={typeString:r};return e&&(t.value=e),t}function Ni(r,e){if(!Oi(r))throw new W(V.INVALID_ARGUMENT,"JSON must be an object");let t;for(const n in e)if(e[n]){const s=e[n].typeString,i="value"in e[n]?{value:e[n].value}:void 0;if(!(n in r)){t=`JSON missing required field: '${n}'`;break}const o=r[n];if(s&&typeof o!==s){t=`JSON field '${n}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){t=`Expected '${n}' field to equal '${i.value}'`;break}}if(t)throw new W(V.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qh=-62135596800,Kh=1e6;class Ee{static now(){return Ee.fromMillis(Date.now())}static fromDate(e){return Ee.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*Kh);return new Ee(t,n)}static fromInstant(e){if(!e||typeof e.t!="bigint")throw new W(V.INVALID_ARGUMENT,"Invalid Temporal.Instant object provided.");return Ee._fromEpochNanoseconds(e.t)}static _fromEpochNanoseconds(e){let t,n;if(e>=0n)t=Number(e/1000000000n),n=Number(e%1000000000n);else{const s=e%1000000000n;s===0n?(t=Number(e/1000000000n),n=0):(t=Number(e/1000000000n-1n),n=Number(s+1000000000n))}return new Ee(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new W(V.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new W(V.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<qh)throw new W(V.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new W(V.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Kh}toInstant(){if(typeof Temporal>"u"||!Temporal.Instant)throw new W(V.FAILED_PRECONDITION,"The Temporal object is not available in the current environment.");const e=1000000000n*BigInt(this.seconds)+BigInt(this.nanoseconds);return Temporal.Instant.__PRIVATE_fromEpochNanoseconds(e)}_compareTo(e){return this.seconds===e.seconds?le(this.nanoseconds,e.nanoseconds):le(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Ee._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Ni(e,Ee._jsonSchema))return new Ee(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-qh;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Ee._jsonSchemaVersion="firestore/timestamp/1.0",Ee._jsonSchema={type:Ge("string",Ee._jsonSchemaVersion),seconds:Ge("number"),nanoseconds:Ge("number")};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class AC extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class He{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new AC("Invalid base64 string: "+i):i}})(e);return new He(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(e);return new He(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return le(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}He.EMPTY_BYTE_STRING=new He("");const ly=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function qn(r){if(ee(!!r,39018),typeof r=="string"){let e=0;const t=ly.exec(r);if(ee(!!t,46558,{timestamp:r}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:Se(r.seconds),nanos:Se(r.nanos)}}function Se(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function Kn(r){return typeof r=="string"?He.fromBase64String(r):He.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const RC="server_timestamp",vC="__type__",bC="__previous_value__",PC="__local_write_time__";function Ca(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[vC])==null?void 0:n.stringValue)===RC}function Fi(r){const e=r.mapValue.fields[bC];return Ca(e)?Fi(e):e}function es(r){const e=qn(r.mapValue.fields[PC].timestampValue);return new Ee(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hy{constructor(e,t,n,s,i,o,B,u,c,h,d,C,g){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=B,this.longPollingOptions=u,this.useFetchStreams=c,this.isUsingEmulator=h,this.apiKey=d,this._customHeaders=C,this.grpcFlowControlWindow=g}}const Jo="(default)";class ci{constructor(e,t){this.projectId=e,this.database=t||Jo}static empty(){return new ci("","")}get isDefaultDatabase(){return this.database===Jo}isEqual(e){return e instanceof ci&&e.projectId===this.projectId&&e.database===this.database}}function fy(r,e){if(!Object.prototype.hasOwnProperty.apply(r.options,["projectId"]))throw new W(V.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ci(r.options.projectId,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xu=-1;function pa(r){return r==null}function li(r){return r===0&&1/r==-1/0}function dy(r){return typeof r=="number"&&Number.isInteger(r)&&!li(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}function Cy(r){return typeof r=="string"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const SC="__type__",py="__max__",ho={mapValue:{}},OC="__vector__",hi="value",ts={nullValue:"NULL_VALUE"},gt={booleanValue:!0},$e={booleanValue:!1};function Je(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Ca(r)?4:gy(r)?9007199254740991:jo(r)?10:11:re(28295,{value:r})}function Nt(r,e,t){if(r===e)return!0;const n=Je(r);if(n!==Je(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return es(r).isEqual(es(e));case 3:return(function(i,o){if(typeof i.timestampValue=="string"&&typeof o.timestampValue=="string"&&i.timestampValue.length===o.timestampValue.length)return i.timestampValue===o.timestampValue;const B=qn(i.timestampValue),u=qn(o.timestampValue);return B.seconds===u.seconds&&B.nanos===u.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(i,o){return Kn(i.bytesValue).isEqual(Kn(o.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(i,o){return Se(i.geoPointValue.latitude)===Se(o.geoPointValue.latitude)&&Se(i.geoPointValue.longitude)===Se(o.geoPointValue.longitude)})(r,e);case 2:return(function(i,o,B){if("integerValue"in i&&"integerValue"in o)return Se(i.integerValue)===Se(o.integerValue);let u,c;if("doubleValue"in i&&"doubleValue"in o)u=Se(i.doubleValue),c=Se(o.doubleValue);else{if(!(B!=null&&B.i))return!1;u=Se(i.integerValue??i.doubleValue),c=Se(o.integerValue??o.doubleValue)}return u===c?!!(B!=null&&B.o)||li(u)===li(c):!!(B===void 0||B.u)&&isNaN(u)&&isNaN(c)})(r,e,t);case 9:return Zr(r.arrayValue.values||[],e.arrayValue.values||[],((s,i)=>Nt(s,i,t)));case 10:case 11:return(function(i,o,B){const u=i.mapValue.fields||{},c=o.mapValue.fields||{};if(Ho(u)!==Ho(c))return!1;for(const h in u)if(u.hasOwnProperty(h)&&(c[h]===void 0||!Nt(u[h],c[h],B)))return!1;return!0})(r,e,t);default:return re(52216,{left:r})}}function fi(r,e){return(r.values||[]).find((t=>Nt(t,e)))!==void 0}function mt(r,e){if(r===e)return 0;const t=Je(r),n=Je(e);if(t!==n)return le(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return le(r.booleanValue,e.booleanValue);case 2:return(function(i,o){const B=Se(i.integerValue||i.doubleValue),u=Se(o.integerValue||o.doubleValue);return B<u?-1:B>u?1:B===u?0:isNaN(B)?isNaN(u)?0:-1:1})(r,e);case 3:return zh(r.timestampValue,e.timestampValue);case 4:return zh(es(r),es(e));case 5:return QB(r.stringValue,e.stringValue);case 6:return(function(i,o){const B=Kn(i),u=Kn(o);return B.compareTo(u)})(r.bytesValue,e.bytesValue);case 7:return(function(i,o){const B=i.split("/"),u=o.split("/");for(let c=0;c<B.length&&c<u.length;c++){const h=le(B[c],u[c]);if(h!==0)return h}return le(B.length,u.length)})(r.referenceValue,e.referenceValue);case 8:return(function(i,o){const B=le(Se(i.latitude),Se(o.latitude));return B!==0?B:le(Se(i.longitude),Se(o.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return Wh(r.arrayValue,e.arrayValue);case 10:return(function(i,o){var C,g,D,P;const B=i.fields||{},u=o.fields||{},c=(C=B[hi])==null?void 0:C.arrayValue,h=(g=u[hi])==null?void 0:g.arrayValue,d=le(((D=c==null?void 0:c.values)==null?void 0:D.length)||0,((P=h==null?void 0:h.values)==null?void 0:P.length)||0);return d!==0?d:Wh(c,h)})(r.mapValue,e.mapValue);case 11:return(function(i,o){if(i===ho.mapValue&&o===ho.mapValue)return 0;if(i===ho.mapValue)return 1;if(o===ho.mapValue)return-1;const B=i.fields||{},u=Object.keys(B),c=o.fields||{},h=Object.keys(c);u.sort(),h.sort();for(let d=0;d<u.length&&d<h.length;++d){const C=QB(u[d],h[d]);if(C!==0)return C;const g=mt(B[u[d]],c[h[d]]);if(g!==0)return g}return le(u.length,h.length)})(r.mapValue,e.mapValue);default:throw re(23264,{l:t})}}function zh(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return le(r,e);const t=qn(r),n=qn(e),s=le(t.seconds,n.seconds);return s!==0?s:le(t.nanos,n.nanos)}function Wh(r,e){const t=r.values||[],n=e.values||[];for(let s=0;s<t.length&&s<n.length;++s){const i=mt(t[s],n[s]);if(i!==void 0&&i!==0)return i}return le(t.length,n.length)}function ns(r){return YB(r)}function YB(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const n=qn(t);return`time(${n.seconds},${n.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return Kn(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return te.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let n="[",s=!0;for(const i of t.values||[])s?s=!1:n+=",",n+=YB(i);return n+"]"})(r.arrayValue):"mapValue"in r?(function(t){const n=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const o of n)i?i=!1:s+=",",s+=`${o}:${YB(t.fields[o])}`;return s+"}"})(r.mapValue):re(61005,{value:r})}function Ro(r){switch(Je(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Fi(r);return e?16+Ro(e):16;case 5:return 2*r.stringValue.length;case 6:return Kn(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(n){return(n.values||[]).reduce(((s,i)=>s+Ro(i)),0)})(r.arrayValue);case 10:case 11:return(function(n){let s=0;return Pr(n.fields,((i,o)=>{s+=i.length+Ro(o)})),s})(r.mapValue);default:throw re(13486,{value:r})}}function $h(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function zt(r){return!!r&&"integerValue"in r}function hr(r){return!!r&&"doubleValue"in r}function zn(r){return zt(r)||hr(r)}function rs(r){return!!r&&"arrayValue"in r}function It(r){return!!r&&"nullValue"in r}function Et(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function pr(r){return!!r&&"mapValue"in r}function jo(r){var t,n;return((n=(((t=r==null?void 0:r.mapValue)==null?void 0:t.fields)||{})[SC])==null?void 0:n.stringValue)===OC}function XB(r){var e,t;return(t=(((e=r==null?void 0:r.mapValue)==null?void 0:e.fields)||{})[hi])==null?void 0:t.arrayValue}function $s(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const e={mapValue:{fields:{}}};return Pr(r.mapValue.fields,((t,n)=>e.mapValue.fields[t]=$s(n))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=$s(r.arrayValue.values[t]);return e}return{...r}}function gy(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===py}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tt{constructor(e){this.value=e}static empty(){return new Tt({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!pr(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=$s(t)}setAll(e){let t=vt.emptyPath(),n={},s=[];e.forEach(((o,B)=>{if(!t.isImmediateParentOf(B)){const u=this.getFieldsMap(t);this.applyChanges(u,n,s),n={},s=[],t=B.popLast()}o?n[B.lastSegment()]=$s(o):s.push(B.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,n,s)}delete(e){const t=this.field(e.popLast());pr(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Nt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let s=t.mapValue.fields[e.get(n)];pr(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,n){Pr(t,((s,i)=>e[s]=i));for(const s of n)delete e[s]}clone(){return new Tt($s(this.value))}}function NC(r){const e=[];return Pr(r.fields,((t,n)=>{const s=new vt([t]);if(pr(n)){const i=NC(n.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)})),new xt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ga(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:li(e)?"-0":e}}function Vu(r){return{integerValue:""+r}}function Mu(r,e,t){return dy(e)?Vu(e):ga(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ma{constructor(){this._=void 0}}function my(r,e,t){return r instanceof di?(function(s,i){const o={fields:{[vC]:{stringValue:RC},[PC]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Ca(i)&&(i=Fi(i)),i&&(o.fields[bC]=i),{mapValue:o}})(t,e):r instanceof Ci?LC(r,e):r instanceof pi?kC(r,e):r instanceof gi?(function(s,i){const o=FC(s,i),B=zo(o)+zo(s.h);return zt(o)&&zt(s.h)?Vu(B):ga(s.serializer,B)})(r,e):r instanceof qo?(function(s,i){return Qh(s,i,Math.min)})(r,e):r instanceof Ko?(function(s,i){return Qh(s,i,Math.max)})(r,e):void 0}function Ey(r,e,t){return r instanceof Ci?LC(r,e):r instanceof pi?kC(r,e):t}function FC(r,e){return r instanceof gi?zn(e)?e:{integerValue:0}:null}class di extends ma{}class Ci extends ma{constructor(e){super(),this.elements=e}}function LC(r,e){const t=xC(e);for(const n of r.elements)t.some((s=>Nt(s,n)))||t.push(n);return{arrayValue:{values:t}}}class pi extends ma{constructor(e){super(),this.elements=e}}function kC(r,e){let t=xC(e);for(const n of r.elements)t=t.filter((s=>!Nt(s,n)));return{arrayValue:{values:t}}}class Gu extends ma{constructor(e,t){super(),this.serializer=e,this.h=t}}class gi extends Gu{}class qo extends Gu{}class Ko extends Gu{}function Qh(r,e,t){if(!zn(e))return r.h;const n=t(zo(e),zo(r.h));return zt(e)&&zt(r.h)?Vu(n):ga(r.serializer,n)}function zo(r){return Se(r.integerValue||r.doubleValue)}function xC(r){return rs(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _y{constructor(e,t){this.field=e,this.transform=t}}function Dy(r,e){return r.field.isEqual(e.field)&&(function(n,s){return n instanceof Ci&&s instanceof Ci||n instanceof pi&&s instanceof pi?Zr(n.elements,s.elements,Nt):n instanceof gi&&s instanceof gi||n instanceof qo&&s instanceof qo||n instanceof Ko&&s instanceof Ko?Nt(n.h,s.h):n instanceof di&&s instanceof di})(r.transform,e.transform)}class wy{constructor(e,t){this.version=e,this.transformResults=t}}class ln{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new ln}static exists(e){return new ln(void 0,e)}static updateTime(e){return new ln(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function vo(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class Ea{}function VC(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new GC(r.key,ln.none()):new Li(r.key,r.data,ln.none());{const t=r.data,n=Tt.empty();let s=new Ue(vt.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?n.delete(i):n.set(i,o),s=s.add(i)}return new Sr(r.key,n,new xt(s.toArray()),ln.none())}}function yy(r,e,t){r instanceof Li?(function(s,i,o){const B=s.value.clone(),u=Xh(s.fieldTransforms,i,o.transformResults);B.setAll(u),i.convertToFoundDocument(o.version,B).setHasCommittedMutations()})(r,e,t):r instanceof Sr?(function(s,i,o){if(!vo(s.precondition,i))return void i.convertToUnknownDocument(o.version);const B=Xh(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(MC(s)),u.setAll(B),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(r,e,t):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function Qs(r,e,t,n){return r instanceof Li?(function(i,o,B,u){if(!vo(i.precondition,o))return B;const c=i.value.clone(),h=Zh(i.fieldTransforms,u,o);return c.setAll(h),o.convertToFoundDocument(o.version,c).setHasLocalMutations(),null})(r,e,t,n):r instanceof Sr?(function(i,o,B,u){if(!vo(i.precondition,o))return B;const c=Zh(i.fieldTransforms,u,o),h=o.data;return h.setAll(MC(i)),h.setAll(c),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),B===null?null:B.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((d=>d.field)))})(r,e,t,n):(function(i,o,B){return vo(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):B})(r,e,t)}function Ty(r,e){let t=null;for(const n of r.fieldTransforms){const s=e.data.field(n.field),i=FC(n.transform,s||null);i!=null&&(t===null&&(t=Tt.empty()),t.set(n.field,i))}return t||null}function Yh(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&Zr(n,s,((i,o)=>Dy(i,o)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class Li extends Ea{constructor(e,t,n,s=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Sr extends Ea{constructor(e,t,n,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function MC(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}})),e}function Xh(r,e,t){const n=new Map;ee(r.length===t.length,32656,{T:t.length,P:r.length});for(let s=0;s<t.length;s++){const i=r[s],o=i.transform,B=e.data.field(i.field);n.set(i.field,Ey(o,B,t[s]))}return n}function Zh(r,e,t){const n=new Map;for(const s of r){const i=s.transform,o=t.data.field(s.field);n.set(s.field,my(i,o,e))}return n}class GC extends Ea{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Iy extends Ea{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wo{constructor(e,t){this.position=e,this.inclusive=t}}function ef(r,e,t){let n=0;for(let s=0;s<r.position.length;s++){const i=e[s],o=r.position[s];if(i.field.isKeyField()?n=te.comparator(te.fromName(o.referenceValue),t.key):n=mt(o,t.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function tf(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!Nt(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UC{}class Me extends UC{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new Ry(e,t,n):t==="array-contains"?new Py(e,n):t==="in"?new Sy(e,n):t==="not-in"?new Oy(e,n):t==="array-contains-any"?new Ny(e,n):new Me(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new vy(e,n):new by(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(mt(t,this.value)):t!==null&&Je(this.value)===Je(t)&&this.matchesComparison(mt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return re(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Gt extends UC{constructor(e,t){super(),this.filters=e,this.op=t,this.I=null}static create(e,t){return new Gt(e,t)}matches(e){return HC(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.I!==null||(this.I=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.I}getFilters(){return Object.assign([],this.filters)}}function HC(r){return r.op==="and"}function JC(r){return Ay(r)&&HC(r)}function Ay(r){for(const e of r.filters)if(e instanceof Gt)return!1;return!0}function ZB(r){if(r instanceof Me)return r.field.canonicalString()+r.op.toString()+ns(r.value);if(JC(r))return r.filters.map((e=>ZB(e))).join(",");{const e=r.filters.map((t=>ZB(t))).join(",");return`${r.op}(${e})`}}function jC(r,e){return r instanceof Me?(function(n,s){return s instanceof Me&&n.op===s.op&&n.field.isEqual(s.field)&&Nt(n.value,s.value)})(r,e):r instanceof Gt?(function(n,s){return s instanceof Gt&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce(((i,o,B)=>i&&jC(o,s.filters[B])),!0):!1})(r,e):void re(19439)}function qC(r){return r instanceof Me?(function(t){return`${t.field.canonicalString()} ${t.op} ${ns(t.value)}`})(r):r instanceof Gt?(function(t){return t.op.toString()+" {"+t.getFilters().map(qC).join(" ,")+"}"})(r):"Filter"}class Ry extends Me{constructor(e,t,n){super(e,t,n),this.key=te.fromName(n.referenceValue)}matches(e){const t=te.comparator(e.key,this.key);return this.matchesComparison(t)}}class vy extends Me{constructor(e,t){super(e,"in",t),this.keys=KC("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class by extends Me{constructor(e,t){super(e,"not-in",t),this.keys=KC("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function KC(r,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((n=>te.fromName(n.referenceValue)))}class Py extends Me{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return rs(t)&&fi(t.arrayValue,this.value)}}class Sy extends Me{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&fi(this.value.arrayValue,t)}}class Oy extends Me{constructor(e,t){super(e,"not-in",t)}matches(e){if(fi(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!fi(this.value.arrayValue,t)}}class Ny extends Me{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!rs(t)||!t.arrayValue.values)&&t.arrayValue.values.some((n=>fi(this.value.arrayValue,n)))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mi{constructor(e,t="asc"){this.field=e,this.dir=t}}function Fy(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oe{static fromTimestamp(e){return new oe(e)}static min(){return new oe(new Ee(0,0))}static max(){return new oe(new Ee(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e,t,n,s,i,o,B){this.key=e,this.documentType=t,this.version=n,this.readTime=s,this.createTime=i,this.data=o,this.documentState=B}static newInvalidDocument(e){return new tt(e,0,oe.min(),oe.min(),oe.min(),Tt.empty(),0)}static newFoundDocument(e,t,n,s){return new tt(e,1,t,oe.min(),n,s,0)}static newNoDocument(e,t){return new tt(e,2,t,oe.min(),oe.min(),Tt.empty(),0)}static newUnknownDocument(e,t){return new tt(e,3,t,oe.min(),oe.min(),Tt.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(oe.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Tt.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Tt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=oe.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof tt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new tt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ei=-1;function Ly(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=oe.fromTimestamp(n===1e9?new Ee(t+1,0):new Ee(t,n));return new Wn(s,te.empty(),e)}function ky(r){return new Wn(r.readTime,r.key,Ei)}class Wn{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Wn(oe.min(),te.empty(),Ei)}static max(){return new Wn(oe.max(),te.empty(),Ei)}}function xy(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=te.comparator(r.documentKey,e.documentKey),t!==0?t:le(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vy{constructor(e,t=null,n=[],s=[],i=null,o=null,B=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=o,this.endAt=B,this.R=null}}function nf(r,e=null,t=[],n=[],s=null,i=null,o=null){return new Vy(r,e,t,n,s,i,o)}function zC(r){const e=ae(r);if(e.R===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((n=>ZB(n))).join(","),t+="|ob:",t+=e.orderBy.map((n=>(function(i){return i.field.canonicalString()+i.dir})(n))).join(","),pa(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((n=>ns(n))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((n=>ns(n))).join(",")),e.R=t}return e.R}function WC(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!Fy(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!jC(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!tf(r.startAt,e.startAt)&&tf(r.endAt,e.endAt)}function cr(r){return!!r.isCorePipeline}function $C(r){return!!r.path&&te.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ls{constructor(e,t=null,n=[],s=[],i=null,o="F",B=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=o,this.startAt=B,this.endAt=u,this.A=null,this.V=null,this.m=null,this.startAt,this.endAt}}function My(r,e,t,n,s,i,o,B){return new ls(r,e,t,n,s,i,o,B)}function _a(r){return new ls(r)}function rf(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function Gy(r){return te.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function QC(r){return r.collectionGroup!==null}function Ys(r){const e=ae(r);if(e.A===null){e.A=[];const t=new Set;for(const i of e.explicitOrderBy)e.A.push(i),t.add(i.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let B=new Ue(vt.comparator);return o.filters.forEach((u=>{u.getFlattenedFilters().forEach((c=>{c.isInequality()&&(B=B.add(c.field))}))})),B})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.A.push(new mi(i,n))})),t.has(vt.keyField().canonicalString())||e.A.push(new mi(vt.keyField(),n))}return e.A}function Xt(r){const e=ae(r);return e.V||(e.V=Uy(e,Ys(r))),e.V}function Uy(r,e){if(r.limitType==="F")return nf(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new mi(s.field,i)}));const t=r.endAt?new Wo(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new Wo(r.startAt.position,r.startAt.inclusive):null;return nf(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function eu(r,e){const t=r.filters.concat([e]);return new ls(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function Hy(r,e){const t=r.explicitOrderBy.concat([e]);return new ls(r.path,r.collectionGroup,t,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)}function $o(r,e,t){return new ls(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function Jy(r,e){return WC(Xt(r),Xt(e))&&r.limitType===e.limitType}function Xs(r){return`Query(target=${(function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map((s=>qC(s))).join(", ")}]`),pa(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map((s=>ns(s))).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map((s=>ns(s))).join(",")),`Target(${n})`})(Xt(r))}; limitType=${r.limitType})`}function Da(r,e){return e.isFoundDocument()&&(function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):te.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)})(r,e)&&(function(n,s){for(const i of Ys(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(r,e)&&(function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0})(r,e)&&(function(n,s){return!(n.startAt&&!(function(o,B,u){const c=ef(o,B,u);return o.inclusive?c<=0:c<0})(n.startAt,Ys(n),s)||n.endAt&&!(function(o,B,u){const c=ef(o,B,u);return o.inclusive?c>=0:c>0})(n.endAt,Ys(n),s))})(r,e)}function Uu(r){return(e,t)=>{let n=!1;for(const s of Ys(r)){const i=jy(s,e,t);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function jy(r,e,t){const n=r.field.isKeyField()?te.comparator(e.key,t.key):(function(i,o,B){const u=o.data.field(i),c=B.data.field(i);return u!==null&&c!==null?mt(u,c):re(42886)})(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return re(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qy{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var xe,de;function Ky(r){switch(r){case V.OK:return re(64938);case V.CANCELLED:case V.UNKNOWN:case V.DEADLINE_EXCEEDED:case V.RESOURCE_EXHAUSTED:case V.INTERNAL:case V.UNAVAILABLE:case V.UNAUTHENTICATED:return!1;case V.INVALID_ARGUMENT:case V.NOT_FOUND:case V.ALREADY_EXISTS:case V.PERMISSION_DENIED:case V.FAILED_PRECONDITION:case V.ABORTED:case V.OUT_OF_RANGE:case V.UNIMPLEMENTED:case V.DATA_LOSS:return!0;default:return re(15467,{code:r})}}function YC(r){if(r===void 0)return gn("GRPC error has no .code"),V.UNKNOWN;switch(r){case xe.OK:return V.OK;case xe.CANCELLED:return V.CANCELLED;case xe.UNKNOWN:return V.UNKNOWN;case xe.DEADLINE_EXCEEDED:return V.DEADLINE_EXCEEDED;case xe.RESOURCE_EXHAUSTED:return V.RESOURCE_EXHAUSTED;case xe.INTERNAL:return V.INTERNAL;case xe.UNAVAILABLE:return V.UNAVAILABLE;case xe.UNAUTHENTICATED:return V.UNAUTHENTICATED;case xe.INVALID_ARGUMENT:return V.INVALID_ARGUMENT;case xe.NOT_FOUND:return V.NOT_FOUND;case xe.ALREADY_EXISTS:return V.ALREADY_EXISTS;case xe.PERMISSION_DENIED:return V.PERMISSION_DENIED;case xe.FAILED_PRECONDITION:return V.FAILED_PRECONDITION;case xe.ABORTED:return V.ABORTED;case xe.OUT_OF_RANGE:return V.OUT_OF_RANGE;case xe.UNIMPLEMENTED:return V.UNIMPLEMENTED;case xe.DATA_LOSS:return V.DATA_LOSS;default:return re(39323,{code:r})}}(de=xe||(xe={}))[de.OK=0]="OK",de[de.CANCELLED=1]="CANCELLED",de[de.UNKNOWN=2]="UNKNOWN",de[de.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",de[de.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",de[de.NOT_FOUND=5]="NOT_FOUND",de[de.ALREADY_EXISTS=6]="ALREADY_EXISTS",de[de.PERMISSION_DENIED=7]="PERMISSION_DENIED",de[de.UNAUTHENTICATED=16]="UNAUTHENTICATED",de[de.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",de[de.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",de[de.ABORTED=10]="ABORTED",de[de.OUT_OF_RANGE=11]="OUT_OF_RANGE",de[de.UNIMPLEMENTED=12]="UNIMPLEMENTED",de[de.INTERNAL=13]="INTERNAL",de[de.UNAVAILABLE=14]="UNAVAILABLE",de[de.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Or{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],e))return n.length===1?delete this.inner[t]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Pr(this.inner,((t,n)=>{for(const[s,i]of n)e(s,i)}))}isEmpty(){return TC(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zy=new be(te.comparator);function dt(){return zy}const XC=new be(te.comparator);function jr(...r){let e=XC;for(const t of r)e=e.insert(t.key,t);return e}function ZC(r){let e=XC;return r.forEach(((t,n)=>e=e.insert(t,n.overlayedDocument))),e}function Fn(){return Zs()}function ep(){return Zs()}function Zs(){return new Or((r=>r.toString()),((r,e)=>r.isEqual(e)))}const Wy=new be(te.comparator),$y=new Ue(te.comparator);function ce(...r){let e=$y;for(const t of r)e=e.add(t);return e}const Qy=new Ue(le);function Yy(){return Qy}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xy(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zy=new Gn([4294967295,4294967295],0);function sf(r){const e=Xy().encode(r),t=new uC;return t.update(e),new Uint8Array(t.digest())}function of(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Gn([t,n],0),new Gn([s,i],0)]}class Hu{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new Js(`Invalid padding: ${t}`);if(n<0)throw new Js(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new Js(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new Js(`Invalid padding when bitmap length is 0: ${t}`);this.p=8*e.length-t,this.S=Gn.fromNumber(this.p)}v(e,t,n){let s=e.add(t.multiply(Gn.fromNumber(n)));return s.compare(Zy)===1&&(s=new Gn([s.getBits(0),s.getBits(1)],0)),s.modulo(this.S).toNumber()}D(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.p===0)return!1;const t=sf(e),[n,s]=of(t);for(let i=0;i<this.hashCount;i++){const o=this.v(n,s,i);if(!this.D(o))return!1}return!0}static create(e,t,n){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new Hu(i,s,t);return n.forEach((B=>o.insert(B))),o}insert(e){if(this.p===0)return;const t=sf(e),[n,s]=of(t);for(let i=0;i<this.hashCount;i++){const o=this.v(n,s,i);this.C(o)}}C(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class Js extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ki{constructor(e,t,n,s,i,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=s,this.augmentedDocumentUpdates=i,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const s=new Map;return s.set(e,xi.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new ki(oe.min(),s,new be(le),dt(),dt(),ce())}}class xi{constructor(e,t,n,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new xi(n,t,ce(),ce(),ce())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bo{constructor(e,t,n,s){this.F=e,this.removedTargetIds=t,this.key=n,this.O=s}}class tp{constructor(e,t){this.targetId=e,this.M=t}}class np{constructor(e,t,n=He.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=s}}class af{constructor(e){this.targetId=e,this.N=0,this.L=Bf(),this.B=He.EMPTY_BYTE_STRING,this.U=!1,this.k=!0}get current(){return this.U}get resumeToken(){return this.B}get q(){return this.N!==0}get $(){return this.k}K(e){e.approximateByteSize()>0&&(this.k=!0,this.B=e)}W(){let e=ce(),t=ce(),n=ce();return this.L.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:n=n.add(s);break;default:re(38017,{changeType:i})}})),new xi(this.B,this.U,e,t,n)}G(){this.k=!1,this.L=Bf()}j(e,t){this.k=!0,this.L=this.L.insert(e,t)}H(e){this.k=!0,this.L=this.L.remove(e)}J(){this.N+=1}Y(){this.N-=1,ee(this.N>=0,3241,{N:this.N,targetId:this.targetId})}Z(){this.k=!0,this.U=!0}}const Vs="WatchChangeAggregator";class eT{constructor(e){this.X=e,this.ee=new Map,this.te=dt(),this.ne=fo(),this.re=dt(),this.ie=fo(),this.se=new be(le)}_e(e){for(const t of e.F)e.O&&e.O.isFoundDocument()?this.oe(t,e.O):this.ae(t,e.key,e.O);for(const t of e.removedTargetIds)this.ae(t,e.key,e.O)}ue(e){this.forEachTarget(e,(t=>{const n=this.ee.get(t);if(n)switch(e.state){case 0:this.ce(t)&&n.K(e.resumeToken);break;case 1:n.Y(),n.q||n.G(),n.K(e.resumeToken);break;case 2:n.Y(),n.q||this.removeTarget(t);break;case 3:this.ce(t)&&(n.Z(),n.K(e.resumeToken));break;case 4:this.ce(t)&&(this.le(t),n.K(e.resumeToken));break;default:re(56790,{state:e.state})}else X(Vs,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ee.forEach(((n,s)=>{this.ce(s)&&t(s)}))}Ee(e){var t;return cr(e)?e.getPipelineSourceType()==="documents"&&((t=e.getPipelineDocuments())==null?void 0:t.length)===1:$C(e)}he(e){const t=e.targetId,n=e.M.count,s=this.Te(t);if(s){const i=s.target;if(this.Ee(i))if(n===0){const o=new te(cr(i)?ge.fromString(i.getPipelineDocuments()[0]):i.path);this.ae(t,o,tt.newNoDocument(o,oe.min()))}else ee(n===1,20013,"Single document existence filter with count: "+n);else{const o=this.Pe(t);if(o!==n){const B=this.Ie(e),u=B?this.Re(B,e,o):1;if(u!==0){this.le(t);const c=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.se=this.se.insert(t,c)}}}}}Ie(e){const t=e.M.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=t;let o,B;try{o=Kn(n).toUint8Array()}catch(u){if(u instanceof AC)return Mt("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{B=new Hu(o,s,i)}catch(u){return Mt(u instanceof Js?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return B.p===0?null:B}Re(e,t,n){return t.M.count===n-this.de(e,t.targetId)?0:2}de(e,t){const n=this.X.getRemoteKeysForTarget(t);let s=0;return n.forEach((i=>{const o=this.X.Ve(),B=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(B)||(this.ae(t,i,null),s++)})),s}fe(e){const t=new Map;this.ee.forEach(((i,o)=>{const B=this.Te(o);if(B){if(i.current&&this.Ee(B.target)){const u=cr(B.target)?ge.fromString(B.target.getPipelineDocuments()[0]):B.target.path,c=new te(u);this.me(c).has(o)||this.pe(o,c)||this.ae(o,c,tt.newNoDocument(c,e))}i.$&&(t.set(o,i.W()),i.G())}}));let n=ce();this.ie.forEach(((i,o)=>{let B=!0;o.forEachWhile((u=>{const c=this.Te(u);return!c||c.purpose==="TargetPurposeLimboResolution"||(B=!1,!1)})),B&&(n=n.add(i))})),this.te.forEach(((i,o)=>o.setReadTime(e))),this.re.forEach(((i,o)=>o.setReadTime(e)));const s=new ki(e,t,this.se,this.te,this.re,n);return this.te=dt(),this.ne=fo(),this.re=dt(),this.ie=fo(),this.se=new be(le),s}oe(e,t){const n=this.ee.get(e);if(!n||!this.ce(e))return void X(Vs,`addDocumentToTarget received document for unknown inactive target (${e})`);const s=this.pe(e,t.key)?2:0;n.j(t.key,s),cr(this.Te(e).target)&&this.Te(e).target.getPipelineFlavor()!=="exact"?this.re=this.re.insert(t.key,t):this.te=this.te.insert(t.key,t),this.ne=this.ne.insert(t.key,this.me(t.key).add(e)),this.ie=this.ie.insert(t.key,this.ge(t.key).add(e))}ae(e,t,n){const s=this.ee.get(e);s&&this.ce(e)?(this.pe(e,t)?s.j(t,1):s.H(t),this.ie=this.ie.insert(t,this.ge(t).delete(e)),this.ie=this.ie.insert(t,this.ge(t).add(e)),n&&(cr(this.Te(e).target)&&this.Te(e).target.getPipelineFlavor()!=="exact"?this.re=this.re.insert(t,n):this.te=this.te.insert(t,n))):X(Vs,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.ee.delete(e)}Pe(e){const t=this.ee.get(e);if(!t)return 0;const n=t.W();return this.X.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}J(e){let t=this.ee.get(e);t||(X(Vs,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new af(e),this.ee.set(e,t)),t.J()}ge(e){let t=this.ie.get(e);return t||(t=new Ue(le),this.ie=this.ie.insert(e,t)),t}me(e){let t=this.ne.get(e);return t||(t=new Ue(le),this.ne=this.ne.insert(e,t)),t}ce(e){const t=this.Te(e)!==null;return t||X(Vs,"Detected inactive target",e),t}Te(e){const t=this.ee.get(e);return t===void 0||t.q?null:this.X.ye(e)}le(e){this.ee.set(e,new af(e)),this.X.getRemoteKeysForTarget(e).forEach((t=>{this.ae(e,t,null)}))}pe(e,t){return this.X.getRemoteKeysForTarget(e).has(t)}}function fo(){return new be(te.comparator)}function Bf(){return new be(te.comparator)}const tT={asc:"ASCENDING",desc:"DESCENDING"},nT={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},rT={and:"AND",or:"OR"};class sT{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function tu(r,e){return r.useProto3Json||pa(e)?e:{value:e}}function ei(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Ju(r){const e=qn(r);return new Ee(e.seconds,e.nanos)}function rp(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function Po(r,e){return ei(r,e.toTimestamp())}function Zt(r){return ee(!!r,49232),oe.fromTimestamp(Ju(r))}function ju(r,e){return nu(r,e).canonicalString()}function nu(r,e){const t=(function(s){return new ge(["projects",s.projectId,"databases",s.database])})(r).child("documents");return e===void 0?t:t.child(e)}function sp(r){const e=ge.fromString(r);return ee(up(e),10190,{key:e.toString()}),e}function Qo(r,e){return ju(r.databaseId,e.path)}function wB(r,e){const t=sp(e);if(t.get(1)!==r.databaseId.projectId)throw new W(V.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new W(V.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new te(op(t))}function ip(r,e){return ju(r.databaseId,e)}function iT(r){const e=sp(r);return e.length===4?ge.emptyPath():op(e)}function ru(r){return new ge(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function op(r){return ee(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function uf(r,e,t){return{name:Qo(r,e),fields:t.value.mapValue.fields}}function oT(r,e){let t;if("targetChange"in e){e.targetChange;const n=(function(c){return c==="NO_CHANGE"?0:c==="ADD"?1:c==="REMOVE"?2:c==="CURRENT"?3:c==="RESET"?4:re(39313,{state:c})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(c,h){return c.useProto3Json?(ee(h===void 0||typeof h=="string",58123),He.fromBase64String(h||"")):(ee(h===void 0||h instanceof Buffer||h instanceof Uint8Array,16193),He.fromUint8Array(h||new Uint8Array))})(r,e.targetChange.resumeToken),o=e.targetChange.cause,B=o&&(function(c){const h=c.code===void 0?V.UNKNOWN:YC(c.code);return new W(h,c.message||"")})(o);t=new np(n,s,i,B||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const s=wB(r,n.document.name),i=Zt(n.document.updateTime),o=n.document.createTime?Zt(n.document.createTime):oe.min(),B=new Tt({mapValue:{fields:n.document.fields}}),u=tt.newFoundDocument(s,i,o,B),c=n.targetIds||[],h=n.removedTargetIds||[];t=new bo(c,h,u.key,u)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const s=wB(r,n.document),i=n.readTime?Zt(n.readTime):oe.min(),o=tt.newNoDocument(s,i),B=n.removedTargetIds||[];t=new bo([],B,o.key,o)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const s=wB(r,n.document),i=n.removedTargetIds||[];t=new bo([],i,s,null)}else{if(!("filter"in e))return re(11601,{we:e});{e.filter;const n=e.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,o=new qy(s,i),B=n.targetId;t=new tp(B,o)}}return t}function aT(r,e){let t;if(e instanceof Li)t={update:uf(r,e.key,e.value)};else if(e instanceof GC)t={delete:Qo(r,e.key)};else if(e instanceof Sr)t={update:uf(r,e.key,e.data),updateMask:gT(e.fieldMask)};else{if(!(e instanceof Iy))return re(16599,{be:e.type});t={verify:Qo(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((n=>(function(i,o){const B=o.transform;if(B instanceof di)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(B instanceof Ci)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:B.elements}};if(B instanceof pi)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:B.elements}};if(B instanceof gi)return{fieldPath:o.field.canonicalString(),increment:B.h};if(B instanceof qo)return{fieldPath:o.field.canonicalString(),minimum:B.h};if(B instanceof Ko)return{fieldPath:o.field.canonicalString(),maximum:B.h};throw re(20930,{transform:o.transform})})(0,n)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:Po(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:re(27497)})(r,e.precondition)),t}function BT(r,e){return r&&r.length>0?(ee(e!==void 0,14353),r.map((t=>(function(s,i){let o=s.updateTime?Zt(s.updateTime):Zt(i);return o.isEqual(oe.min())&&(o=Zt(i)),new wy(o,s.transformResults||[])})(t,e)))):[]}function uT(r,e){return{documents:[ip(r,e.path)]}}function cT(r,e){const t={structuredQuery:{}},n=e.path;let s;e.collectionGroup!==null?(s=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=ip(r,s);const i=(function(c){if(c.length!==0)return Bp(Gt.create(c,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const o=(function(c){if(c.length!==0)return c.map((h=>(function(C){return{field:qr(C.field),direction:dT(C.dir)}})(h)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);const B=tu(r,e.limit);return B!==null&&(t.structuredQuery.limit=B),e.startAt&&(t.structuredQuery.startAt=(function(c){return{before:c.inclusive,values:c.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(c){return{before:!c.inclusive,values:c.position}})(e.endAt)),{Se:t,parent:s}}function lT(r){let e=iT(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let s=null;if(n>0){ee(n===1,65062);const h=t.from[0];h.allDescendants?s=h.collectionId:e=e.child(h.collectionId)}let i=[];t.where&&(i=(function(d){const C=ap(d);return C instanceof Gt&&JC(C)?C.getFilters():[C]})(t.where));let o=[];t.orderBy&&(o=(function(d){return d.map((C=>(function(D){return new mi(Kr(D.field),(function(N){switch(N){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(D.direction))})(C)))})(t.orderBy));let B=null;t.limit&&(B=(function(d){let C;return C=typeof d=="object"?d.value:d,pa(C)?null:C})(t.limit));let u=null;t.startAt&&(u=(function(d){const C=!!d.before,g=d.values||[];return new Wo(g,C)})(t.startAt));let c=null;return t.endAt&&(c=(function(d){const C=!d.before,g=d.values||[];return new Wo(g,C)})(t.endAt)),My(e,s,o,i,B,"F",u,c)}function hT(r,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return re(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function fT(r,e){return{structuredPipeline:{pipeline:{stages:e.stages.map((t=>t._toProto(r)))}}}}function ap(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=Kr(t.unaryFilter.field);return Me.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=Kr(t.unaryFilter.field);return Me.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Kr(t.unaryFilter.field);return Me.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Kr(t.unaryFilter.field);return Me.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return re(61313);default:return re(60726)}})(r):r.fieldFilter!==void 0?(function(t){return Me.create(Kr(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return re(58110);default:return re(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return Gt.create(t.compositeFilter.filters.map((n=>ap(n))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return re(1026)}})(t.compositeFilter.op))})(r):re(30097,{filter:r})}function dT(r){return tT[r]}function CT(r){return nT[r]}function pT(r){return rT[r]}function qr(r){return{fieldPath:r.canonicalString()}}function Kr(r){return vt.fromServerFormat(r.fieldPath)}function Bp(r){return r instanceof Me?(function(t){if(t.op==="=="){if(Et(t.value))return{unaryFilter:{field:qr(t.field),op:"IS_NAN"}};if(It(t.value))return{unaryFilter:{field:qr(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Et(t.value))return{unaryFilter:{field:qr(t.field),op:"IS_NOT_NAN"}};if(It(t.value))return{unaryFilter:{field:qr(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:qr(t.field),op:CT(t.op),value:t.value}}})(r):r instanceof Gt?(function(t){const n=t.getFilters().map((s=>Bp(s)));return n.length===1?n[0]:{compositeFilter:{op:pT(t.op),filters:n}}})(r):re(54877,{filter:r})}function gT(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function up(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}function cp(r){return!!r&&typeof r._toProto=="function"&&r._protoValueType==="ProtoValue"}function _i(r,e){const t={fields:{}};return e.forEach(((n,s)=>{if(typeof s!="string")throw new Error(`Cannot encode map with non-string key: ${s}`);t.fields[s]=n._toProto(r)})),{mapValue:t}}function lp(r){return{stringValue:r}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wa(r){return new sT(r,!0)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ot{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Ot(He.fromBase64String(e))}catch(t){throw new W(V.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Ot(He.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Ot._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Ni(e,Ot._jsonSchema))return Ot.fromBase64String(e.bytes)}}Ot._jsonSchemaVersion="firestore/bytes/1.0",Ot._jsonSchema={type:Ge("string",Ot._jsonSchemaVersion),bytes:Ge("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qu{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new W(V.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new vt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function mT(){return new qu(Kt)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ku{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class en{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new W(V.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new W(V.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return le(this._lat,e._lat)||le(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:en._jsonSchemaVersion}}static fromJSON(e){if(Ni(e,en._jsonSchema))return new en(e.latitude,e.longitude)}}en._jsonSchemaVersion="firestore/geoPoint/1.0",en._jsonSchema={type:Ge("string",en._jsonSchemaVersion),latitude:Ge("number"),longitude:Ge("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}et.UNAUTHENTICATED=new et(null),et.GOOGLE_CREDENTIALS=new et("google-credentials-uid"),et.FIRST_PARTY=new et("first-party-uid"),et.MOCK_USER=new et("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hn{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hp{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class ET{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(et.UNAUTHENTICATED)))}shutdown(){}}class _T{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class DT{constructor(e){this.De=e,this.currentUser=et.UNAUTHENTICATED,this.xe=0,this.forceRefresh=!1,this.auth=null}start(e,t){ee(this.Ce===void 0,42304);let n=this.xe;const s=u=>this.xe!==n?(n=this.xe,t(u)):Promise.resolve();let i=new hn;this.Ce=()=>{this.xe++,this.currentUser=this.Fe(),i.resolve(),i=new hn,e.enqueueRetryable((()=>s(this.currentUser)))};const o=()=>{const u=i;e.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},B=u=>{X("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.Ce&&(this.auth.addAuthTokenListener(this.Ce),o())};this.De.onInit((u=>B(u))),setTimeout((()=>{if(!this.auth){const u=this.De.getImmediate({optional:!0});u?B(u):(X("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new hn)}}),0),o()}getToken(){const e=this.xe,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((n=>this.xe!==e?(X("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(ee(typeof n.accessToken=="string",31837,{Oe:n}),new hp(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.Ce&&this.auth.removeAuthTokenListener(this.Ce),this.Ce=void 0}Fe(){const e=this.auth&&this.auth.getUid();return ee(e===null||typeof e=="string",2055,{Me:e}),new et(e)}}class wT{constructor(e,t,n){this.Ne=e,this.Le=t,this.Be=n,this.type="FirstParty",this.user=et.FIRST_PARTY,this.Ue=new Map}ke(){return this.Be?this.Be():null}get headers(){this.Ue.set("X-Goog-AuthUser",this.Ne);const e=this.ke();return e&&this.Ue.set("Authorization",e),this.Le&&this.Ue.set("X-Goog-Iam-Authorization-Token",this.Le),this.Ue}}class yT{constructor(e,t,n){this.Ne=e,this.Le=t,this.Be=n}getToken(){return Promise.resolve(new wT(this.Ne,this.Le,this.Be))}start(e,t){e.enqueueRetryable((()=>t(et.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class cf{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class TT{constructor(e,t){this.qe=t,this.forceRefresh=!1,this.appCheck=null,this.$e=null,this.Ke=null,yt(e)&&e.settings.appCheckToken&&(this.Ke=e.settings.appCheckToken)}start(e,t){ee(this.Ce===void 0,3512);const n=i=>{i.error!=null&&X("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.$e;return this.$e=i.token,X("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.Ce=i=>{e.enqueueRetryable((()=>n(i)))};const s=i=>{X("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.Ce&&this.appCheck.addTokenListener(this.Ce)};this.qe.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.qe.getImmediate({optional:!0});i?s(i):X("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.Ke)return Promise.resolve(new cf(this.Ke));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(ee(typeof t.token=="string",44558,{tokenResult:t}),this.$e=t.token,new cf(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.Ce&&this.appCheck.removeTokenListener(this.Ce),this.Ce=void 0}}function fp(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IT{Qe(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lf="ConnectivityMonitor";class hf{constructor(){this.We=()=>this.Ge(),this.ze=()=>this.je(),this.He=[],this.Je()}Qe(e){this.He.push(e)}shutdown(){window.removeEventListener("online",this.We),window.removeEventListener("offline",this.ze)}Je(){window.addEventListener("online",this.We),window.addEventListener("offline",this.ze)}Ge(){X(lf,"Network connectivity changed: AVAILABLE");for(const e of this.He)e(0)}je(){X(lf,"Network connectivity changed: UNAVAILABLE");for(const e of this.He)e(1)}static Ye(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Co=null;function su(){return Co===null?Co=(function(){return 268435456+Math.round(2147483648*Math.random())})():Co++,"0x"+Co.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yB="RestConnection",AT={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class RT{get Ze(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Xe=t+"://"+e.host,this.et=`projects/${n}/databases/${s}`,this.tt=this.databaseId.database===Jo?`project_id=${n}`:`project_id=${n}&database_id=${s}`}nt(e,t,n,s,i){const o=su(),B=this.rt(e,t.toUriEncodedString());X(yB,`Sending RPC '${e}' ${o}:`,B,n);const u={"google-cloud-resource-prefix":this.et,"x-goog-request-params":this.tt};this.it(u,s,i);const{host:c}=new URL(B),h=En(c);return this.st(e,B,u,n,h).then((d=>(X(yB,`Received RPC '${e}' ${o}: `,d),d)),(d=>{throw Mt(yB,`RPC '${e}' ${o} failed with error: `,d,"url: ",B,"request:",n),d}))}_t(e,t,n,s,i,o){return this.nt(e,t,n,s,i)}it(e,t,n){if(e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+cs})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),n&&n.headers.forEach(((s,i)=>e[i]=s)),this.databaseInfo._customHeaders)for(const s of Object.keys(this.databaseInfo._customHeaders))e[s]=this.databaseInfo._customHeaders[s]}rt(e,t){const n=AT[e];let s=`${this.Xe}/v1/${t}:${n}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vT{constructor(e){this.ot=e.ot,this.ut=e.ut}ct(e){this.lt=e}Et(e){this.ht=e}Tt(e){this.Pt=e}onMessage(e){this.It=e}close(){this.ut()}send(e){this.ot(e)}Rt(){this.lt()}At(){this.ht()}Vt(e){this.Pt(e)}dt(e){this.It(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ze="WebChannelConnection",Ms=(r,e,t)=>{r.listen(e,(n=>{try{t(n)}catch(s){setTimeout((()=>{throw s}),0)}}))};class Xr extends RT{constructor(e){super(e),this.ft=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static gt(){if(!Xr.yt){const e=fC();Ms(e,hC.STAT_EVENT,(t=>{t.stat===KB.PROXY?X(Ze,"STAT_EVENT: detected buffering proxy"):t.stat===KB.NOPROXY&&X(Ze,"STAT_EVENT: detected no buffering proxy")})),Xr.yt=!0}}st(e,t,n,s,i){const o=su();return new Promise(((B,u)=>{const c=new cC;c.setWithCredentials(!0),c.listenOnce(lC.COMPLETE,(()=>{try{switch(c.getLastErrorCode()){case Io.NO_ERROR:const d=c.getResponseJson();X(Ze,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(d)),B(d);break;case Io.TIMEOUT:X(Ze,`RPC '${e}' ${o} timed out`),u(new W(V.DEADLINE_EXCEEDED,"Request time out"));break;case Io.HTTP_ERROR:const C=c.getStatus();if(X(Ze,`RPC '${e}' ${o} failed with status:`,C,"response text:",c.getResponseText()),C>0){let g=c.getResponseJson();Array.isArray(g)&&(g=g[0]);const D=g==null?void 0:g.error;if(D&&D.status&&D.message){const P=(function(J){const v=J.toLowerCase().replace(/_/g,"-");return Object.values(V).indexOf(v)>=0?v:V.UNKNOWN})(D.status);u(new W(P,D.message))}else u(new W(V.UNKNOWN,"Server responded with status "+c.getStatus()))}else u(new W(V.UNAVAILABLE,"Connection failed."));break;default:re(9055,{wt:e,streamId:o,bt:c.getLastErrorCode(),St:c.getLastError()})}}finally{X(Ze,`RPC '${e}' ${o} completed.`)}}));const h=JSON.stringify(s);X(Ze,`RPC '${e}' ${o} sending request:`,s),c.send(t,"POST",h,n,15)}))}vt(e,t,n){const s=su(),i=[this.Xe,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=this.createWebChannelTransport(),B={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(B.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(B.useFetchStreams=!0),this.it(B.initMessageHeaders,t,n),B.encodeInitMessageHeaders=!0;const c=i.join("");X(Ze,`Creating RPC '${e}' stream ${s}: ${c}`,B);const h=o.createWebChannel(c,B);this.Dt(h);let d=!1,C=!1;const g=new vT({ot:D=>{C?X(Ze,`Not sending because RPC '${e}' stream ${s} is closed:`,D):(d||(X(Ze,`Opening RPC '${e}' stream ${s} transport.`),h.open(),d=!0),X(Ze,`RPC '${e}' stream ${s} sending:`,D),h.send(D))},ut:()=>h.close()});return Ms(h,Hs.EventType.OPEN,(()=>{C||(X(Ze,`RPC '${e}' stream ${s} transport opened.`),g.Rt())})),Ms(h,Hs.EventType.CLOSE,(()=>{C||(C=!0,X(Ze,`RPC '${e}' stream ${s} transport closed`),g.Vt(),this.xt(h))})),Ms(h,Hs.EventType.ERROR,(D=>{C||(C=!0,Mt(Ze,`RPC '${e}' stream ${s} transport errored. Name:`,D.name,"Message:",D.message),g.Vt(new W(V.UNAVAILABLE,"The operation could not be completed")))})),Ms(h,Hs.EventType.MESSAGE,(D=>{var P;if(!C){const N=D.data[0];ee(!!N,16349);const J=N,v=(J==null?void 0:J.error)||((P=J[0])==null?void 0:P.error);if(v){X(Ze,`RPC '${e}' stream ${s} received error:`,v);const M=v.status;let K=(function(w){const m=xe[w];if(m!==void 0)return YC(m)})(M),Z=v.message;M==="NOT_FOUND"&&Z.includes("database")&&Z.includes("does not exist")&&Z.includes(this.databaseId.database)&&Mt(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),K===void 0&&(K=V.INTERNAL,Z="Unknown error status: "+M+" with message "+v.message),C=!0,g.Vt(new W(K,Z)),h.close()}else X(Ze,`RPC '${e}' stream ${s} received:`,N),g.dt(N)}})),Xr.gt(),setTimeout((()=>{g.At()}),0),g}terminate(){this.ft.forEach((e=>e.close())),this.ft=[]}Dt(e){this.ft.push(e)}xt(e){this.ft=this.ft.filter((t=>t===e))}it(e,t,n){super.it(e,t,n),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return dC()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bT(r){return new Xr(r)}Xr.yt=!1;class dp{constructor(e,t,n=1e3,s=1.5,i=6e4){this.Ct=e,this.timerId=t,this.Ft=n,this.Ot=s,this.Mt=i,this.Nt=0,this.Lt=null,this.Bt=Date.now(),this.reset()}reset(){this.Nt=0}Ut(){this.Nt=this.Mt}kt(e){this.cancel();const t=Math.floor(this.Nt+this.qt()),n=Math.max(0,Date.now()-this.Bt),s=Math.max(0,t-n);s>0&&X("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Nt} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.Lt=this.Ct.enqueueAfterDelay(this.timerId,s,(()=>(this.Bt=Date.now(),e()))),this.Nt*=this.Ot,this.Nt<this.Ft&&(this.Nt=this.Ft),this.Nt>this.Mt&&(this.Nt=this.Mt)}$t(){this.Lt!==null&&(this.Lt.skipDelay(),this.Lt=null)}cancel(){this.Lt!==null&&(this.Lt.cancel(),this.Lt=null)}qt(){return(Math.random()-.5)*this.Nt}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ff="PersistentStream";class Cp{constructor(e,t,n,s,i,o,B,u){this.Ct=e,this.Kt=n,this.Qt=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=B,this.listener=u,this.state=0,this.Wt=0,this.Gt=null,this.zt=null,this.stream=null,this.jt=0,this.Ht=new dp(e,t)}Jt(){return this.state===1||this.state===5||this.Yt()}Yt(){return this.state===2||this.state===3}start(){this.jt=0,this.state!==4?this.auth():this.Zt()}async stop(){this.Jt()&&await this.close(0)}Xt(){this.state=0,this.Ht.reset()}en(){this.Yt()&&this.Gt===null&&(this.Gt=this.Ct.enqueueAfterDelay(this.Kt,6e4,(()=>this.tn())))}nn(e){this.rn(),this.stream.send(e)}async tn(){if(this.Yt())return this.close(0)}rn(){this.Gt&&(this.Gt.cancel(),this.Gt=null)}sn(){this.zt&&(this.zt.cancel(),this.zt=null)}async close(e,t){this.rn(),this.sn(),this.Ht.cancel(),this.Wt++,e!==4?this.Ht.reset():t&&t.code===V.RESOURCE_EXHAUSTED?(gn(t.toString()),gn("Using maximum backoff delay to prevent overloading the backend."),this.Ht.Ut()):t&&t.code===V.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this._n(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Tt(t)}_n(){}auth(){this.state=1;const e=this.an(this.Wt),t=this.Wt;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([n,s])=>{this.Wt===t&&this.un(n,s)}),(n=>{e((()=>{const s=new W(V.UNKNOWN,"Fetching auth token failed: "+n.message);return this.cn(s)}))}))}un(e,t){const n=this.an(this.Wt);this.stream=this.En(e,t),this.stream.ct((()=>{n((()=>this.listener.ct()))})),this.stream.Et((()=>{n((()=>(this.state=2,this.zt=this.Ct.enqueueAfterDelay(this.Qt,1e4,(()=>(this.Yt()&&(this.state=3),Promise.resolve()))),this.listener.Et())))})),this.stream.Tt((s=>{n((()=>this.cn(s)))})),this.stream.onMessage((s=>{n((()=>++this.jt==1?this.hn(s):this.onNext(s)))}))}Zt(){this.state=5,this.Ht.kt((async()=>{this.state=0,this.start()}))}cn(e){return X(ff,`close with error: ${e}`),this.stream=null,this.close(4,e)}an(e){return t=>{this.Ct.enqueueAndForget((()=>this.Wt===e?t():(X(ff,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class PT extends Cp{constructor(e,t,n,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}En(e,t){return this.connection.vt("Listen",e,t)}hn(e){return this.onNext(e)}onNext(e){this.Ht.reset();const t=oT(this.serializer,e),n=(function(i){if(!("targetChange"in i))return oe.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?oe.min():o.readTime?Zt(o.readTime):oe.min()})(e);return this.listener.Tn(t,n)}Pn(e){const t={};t.database=ru(this.serializer),t.addTarget=(function(i,o){let B;const u=o.target;if(B=cr(u)?{pipelineQuery:fT(i,u)}:$C(u)?{documents:uT(i,u)}:{query:cT(i,u).Se},B.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){B.resumeToken=rp(i,o.resumeToken);const c=tu(i,o.expectedCount);c!==null&&(B.expectedCount=c)}else if(o.snapshotVersion.compareTo(oe.min())>0){B.readTime=ei(i,o.snapshotVersion.toTimestamp());const c=tu(i,o.expectedCount);c!==null&&(B.expectedCount=c)}return B})(this.serializer,e);const n=hT(this.serializer,e);n&&(t.labels=n),this.nn(t)}In(e){const t={};t.database=ru(this.serializer),t.removeTarget=e,this.nn(t)}}class ST extends Cp{constructor(e,t,n,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}get Rn(){return this.jt>0}start(){this.lastStreamToken=void 0,super.start()}_n(){this.Rn&&this.An([])}En(e,t){return this.connection.vt("Write",e,t)}hn(e){return ee(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,ee(!e.writeResults||e.writeResults.length===0,55816),this.listener.Vn()}onNext(e){ee(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.Ht.reset();const t=BT(e.writeResults,e.commitTime),n=Zt(e.commitTime);return this.listener.dn(n,t)}fn(){const e={};e.database=ru(this.serializer),this.nn(e)}An(e){const t={streamToken:this.lastStreamToken,writes:e.map((n=>aT(this.serializer,n)))};this.nn(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OT{}class NT extends OT{constructor(e,t,n,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=s,this.mn=!1}pn(){if(this.mn)throw new W(V.FAILED_PRECONDITION,"The client has already been terminated.")}nt(e,t,n,s){return this.pn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.nt(e,nu(t,n),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===V.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new W(V.UNKNOWN,i.toString())}))}_t(e,t,n,s,i){return this.pn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,B])=>this.connection._t(e,nu(t,n),s,o,B,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===V.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new W(V.UNKNOWN,o.toString())}))}terminate(){this.mn=!0,this.connection.terminate()}}function FT(r,e,t,n){return new NT(r,e,t,n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const LT="ComponentProvider",df=new Map;function kT(r,e,t,n,s){return new hy(r,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,fp(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,n,s._customHeaders,s.grpcFlowControlWindow)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cf={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},pp=41943040;class lt{static withCacheSize(e){return new lt(e,lt.DEFAULT_COLLECTION_PERCENTILE,lt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}lt.DEFAULT_COLLECTION_PERCENTILE=10,lt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,lt.DEFAULT=new lt(pp,lt.DEFAULT_COLLECTION_PERCENTILE,lt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),lt.DISABLED=new lt(-1,0,0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ya{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.gn(n),this.yn=n=>t.writeSequenceNumber(n))}gn(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.yn&&this.yn(e),e}}ya.wn=-1;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xT="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class VT{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hs(r){if(r.code!==V.FAILED_PRECONDITION||r.message!==xT)throw r;X("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&re(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new G(((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(n,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof G?t:G.resolve(t)}catch(t){return G.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):G.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):G.reject(t)}static resolve(e){return new G(((t,n)=>{t(e)}))}static reject(e){return new G(((t,n)=>{n(e)}))}static waitFor(e){return new G(((t,n)=>{let s=0,i=0,o=!1;e.forEach((B=>{++s,B.next((()=>{++i,o&&i===s&&t()}),(u=>n(u)))})),o=!0,i===s&&t()}))}static or(e){let t=G.resolve(!1);for(const n of e)t=t.next((s=>s?G.resolve(s):n()));return t}static forEach(e,t){const n=[];return e.forEach(((s,i)=>{n.push(t.call(this,s,i))})),this.waitFor(n)}static mapArray(e,t){return new G(((n,s)=>{const i=e.length,o=new Array(i);let B=0;for(let u=0;u<i;u++){const c=u;t(e[c]).next((h=>{o[c]=h,++B,B===i&&n(o)}),(h=>s(h)))}}))}static doWhile(e,t){return new G(((n,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):n()};i()}))}}function MT(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function fs(r){return r.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pf="LruGarbageCollector",GT=1048576;function gf([r,e],[t,n]){const s=le(r,t);return s===0?le(e,n):s}class UT{constructor(e){this.Yn=e,this.buffer=new Ue(gf),this.Zn=0}Xn(){return++this.Zn}er(e){const t=[e,this.Xn()];if(this.buffer.size<this.Yn)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();gf(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class HT{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.tr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.nr(6e4)}stop(){this.tr&&(this.tr.cancel(),this.tr=null)}get started(){return this.tr!==null}nr(e){X(pf,`Garbage collection scheduled in ${e}ms`),this.tr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.tr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){fs(t)?X(pf,"Ignoring IndexedDB error during garbage collection: ",t):await hs(t)}await this.nr(3e5)}))}}class JT{constructor(e,t){this.rr=e,this.params=t}calculateTargetCount(e,t){return this.rr.ir(e).next((n=>Math.floor(t/100*n)))}nthSequenceNumber(e,t){if(t===0)return G.resolve(ya.wn);const n=new UT(t);return this.rr.forEachTarget(e,(s=>n.er(s.sequenceNumber))).next((()=>this.rr.sr(e,(s=>n.er(s))))).next((()=>n.maxValue))}removeTargets(e,t,n){return this.rr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.rr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(X("LruGarbageCollector","Garbage collection skipped; disabled"),G.resolve(Cf)):this.getCacheSize(e).next((n=>n<this.params.cacheSizeCollectionThreshold?(X("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Cf):this._r(e,t)))}getCacheSize(e){return this.rr.getCacheSize(e)}_r(e,t){let n,s,i,o,B,u,c;const h=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((d=>(d>this.params.maximumSequenceNumbersToCollect?(X("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${d}`),s=this.params.maximumSequenceNumbersToCollect):s=d,o=Date.now(),this.nthSequenceNumber(e,s)))).next((d=>(n=d,B=Date.now(),this.removeTargets(e,n,t)))).next((d=>(i=d,u=Date.now(),this.removeOrphanedDocuments(e,n)))).next((d=>(c=Date.now(),Hr()<=he.DEBUG&&X("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-h}ms
	Determined least recently used ${s} in `+(B-o)+`ms
	Removed ${i} targets in `+(u-B)+`ms
	Removed ${d} documents in `+(c-u)+`ms
Total Duration: ${c-h}ms`),G.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:d}))))}}function jT(r,e){return new JT(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gp="firestore.googleapis.com",mf=!0;class Ef{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new W(V.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=gp,this.ssl=mf}else this.host=e.host,this.ssl=e.ssl??mf;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e._customHeaders&&(this._customHeaders={...e._customHeaders}),e.cacheSizeBytes===void 0)this.cacheSizeBytes=pp;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<GT)throw new W(V.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}if(cy("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=fp(e.experimentalLongPollingOptions??{}),(function(n){if(n.timeoutSeconds!==void 0){if(isNaN(n.timeoutSeconds))throw new W(V.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (must not be NaN)`);if(n.timeoutSeconds<5)throw new W(V.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (minimum allowed value is 5)`);if(n.timeoutSeconds>30)throw new W(V.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams,e.grpcFlowControlWindow!==void 0){if(typeof e.grpcFlowControlWindow!="number"||e.grpcFlowControlWindow<=0||e.grpcFlowControlWindow>2147483647||!Number.isInteger(e.grpcFlowControlWindow))throw new W(V.INVALID_ARGUMENT,"grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");this.grpcFlowControlWindow=e.grpcFlowControlWindow}}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(n,s){return n.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams&&this.grpcFlowControlWindow===e.grpcFlowControlWindow&&(function(n,s){if(n===s)return!0;if(!n||!s)return!1;const i=Object.keys(n),o=Object.keys(s);if(i.length!==o.length)return!1;for(const B of i)if(n[B]!==s[B])return!1;return!0})(this._customHeaders,e._customHeaders)}}let Ta=class{constructor(e,t,n,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ef({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new W(V.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new W(V.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ef(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new ET;switch(n.type){case"firstParty":return new yT(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new W(V.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const n=df.get(t);n&&(X(LT,"Removing Datastore"),df.delete(t),n.terminate())})(this),Promise.resolve()}};function qT(r,e,t,n={}){var c;r=Yt(r,Ta);const s=En(e),i=r._getSettings(),o={...i,emulatorOptions:r._getEmulatorOptions()},B=`${e}:${t}`;s&&aa(`https://${B}`),i.host!==gp&&i.host!==B&&Mt("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u={...i,host:B,ssl:s,emulatorOptions:n};if(!Dr(u,o)&&(r._setSettings(u),n.mockUserToken)){let h,d;if(typeof n.mockUserToken=="string")h=n.mockUserToken,d=et.MOCK_USER;else{h=cd(n.mockUserToken,(c=r._app)==null?void 0:c.options.projectId);const C=n.mockUserToken.sub||n.mockUserToken.user_id;if(!C)throw new W(V.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");d=new et(C)}r._authCredentials=new _T(new hp(h,d))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _n{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new _n(this.firestore,e,this._query)}}class Fe{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Un(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Fe(this.firestore,e,this._key)}toJSON(){return{type:Fe._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(Ni(t,Fe._jsonSchema))return new Fe(e,n||null,new te(ge.fromString(t.referencePath)))}}Fe._jsonSchemaVersion="firestore/documentReference/1.0",Fe._jsonSchema={type:Ge("string",Fe._jsonSchemaVersion),referencePath:Ge("string")};class Un extends _n{constructor(e,t,n){super(e,t,_a(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Fe(this.firestore,null,new te(e))}withConverter(e){return new Un(this.firestore,e,this._path)}}function TB(r,e,...t){if(r=Oe(r),IC("collection","path",e),r instanceof Ta){const n=ge.fromString(e,...t);return jh(n),new Un(r,null,n)}{if(!(r instanceof Fe||r instanceof Un))throw new W(V.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(ge.fromString(e,...t));return jh(n),new Un(r.firestore,null,n)}}function Gs(r,e,...t){if(r=Oe(r),arguments.length===1&&(e=ku.newId()),IC("doc","path",e),r instanceof Ta){const n=ge.fromString(e,...t);return Jh(n),new Fe(r,null,new te(n))}{if(!(r instanceof Fe||r instanceof Un))throw new W(V.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(ge.fromString(e,...t));return Jh(n),new Fe(r.firestore,r instanceof Un?r.converter:null,new te(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:pt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Ni(e,pt._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new pt(e.vectorValues);throw new W(V.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}pt._jsonSchemaVersion="firestore/vectorValue/1.0",pt._jsonSchema={type:Ge("string",pt._jsonSchemaVersion),vectorValues:Ge("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const KT=/^__.*__$/;class zT{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new Sr(e,this.data,this.fieldMask,t,this.fieldTransforms):new Li(e,this.data,t,this.fieldTransforms)}}function mp(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw re(40011,{dataSource:r})}}class zu{constructor(e,t,n,s,i,o){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new zu({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.contextWith({path:t,arrayElement:!1});return n.validatePathSegment(e),n}childContextForFieldPath(e){var s;const t=(s=this.path)==null?void 0:s.child(e),n=this.contextWith({path:t,arrayElement:!1});return n.validatePath(),n}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return Yo(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(mp(this.dataSource)&&KT.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class WT{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||wa(e)}createContext(e,t,n,s=!1){return new zu({dataSource:e,methodName:t,targetDoc:n,path:vt.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ep(r){const e=r._freezeSettings(),t=wa(r._databaseId);return new WT(r._databaseId,!!e.ignoreUndefinedProperties,t)}function $T(r,e,t,n,s,i={}){const o=r.createContext(i.merge||i.mergeFields?2:0,e,t,s);yp("Data must be an object, but it was:",o,n);const B=_p(n,o);let u,c;if(i.merge)u=new xt(o.fieldMask),c=o.fieldTransforms;else if(i.mergeFields){const h=[];for(const d of i.mergeFields){const C=ds(e,d,t);if(!o.contains(C))throw new W(V.INVALID_ARGUMENT,`Field '${C}' is specified in your field mask but missing from your input data.`);ZT(h,C)||h.push(C)}u=new xt(h),c=o.fieldTransforms.filter((d=>u.covers(d.field)))}else u=null,c=o.fieldTransforms;return new zT(new Tt(B),u,c)}class Wu extends Ku{_toFieldTransform(e){return new _y(e.path,new di)}isEqual(e){return e instanceof Wu}}function QT(r,e,t,n=!1){return ss(t,r.createContext(n?4:3,e))}function ss(r,e,t){if(wp(r=Oe(r)))return yp("Unsupported field value:",e,r),_p(r,e);if(r instanceof Ku)return(function(s,i){if(!mp(i.dataSource))throw i.createError(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${s._methodName}() is not currently supported inside arrays`);const o=s._toFieldTransform(i);o&&i.fieldTransforms.push(o)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(s,i){const o=[];let B=0;for(const u of s){let c=ss(u,i.childContextForArray(B));c==null&&(c={nullValue:"NULL_VALUE"}),o.push(c),B++}return{arrayValue:{values:o}}})(r,e)}return(function(s,i,o){if((s=Oe(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return Mu(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const B=Ee.fromDate(s);return{timestampValue:ei(i.serializer,B)}}if(s instanceof Ee){const B=new Ee(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:ei(i.serializer,B)}}if(Dp(s)){const B=Ee.fromInstant(s),u=new Ee(B.seconds,1e3*Math.floor(B.nanoseconds/1e3));return{timestampValue:ei(i.serializer,u)}}if(s instanceof en)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Ot)return{bytesValue:rp(i.serializer,s._byteString)};if(s instanceof Fe){const B=i.databaseId,u=s.firestore._databaseId;if(!u.isEqual(B))throw i.createError(`Document reference is for database ${u.projectId}/${u.database} but should be for database ${B.projectId}/${B.database}`);return{referenceValue:ju(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof pt)return(function(u,c){const h=u instanceof pt?u.toArray():u;return{mapValue:{fields:{[SC]:{stringValue:OC},[hi]:{arrayValue:{values:h.map((C=>{if(typeof C!="number")throw c.createError("VectorValues must only contain numeric values.");return ga(c.serializer,C)}))}}}}}})(s,i);if(cp(s))return s._toProto(i.serializer);throw i.createError(`Unsupported field value: ${da(s)}`)})(r,e)}function _p(r,e){const t={};return TC(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Pr(r,((n,s)=>{const i=ss(s,e.childContextForField(n));i!=null&&(t[n]=i)})),{mapValue:{fields:t}}}function Dp(r){if(typeof r!="object"||r===null)return!1;if(typeof Temporal<"u"&&typeof Temporal.Instant=="function"&&r instanceof Temporal.Instant)return!0;const e=r;return e[Symbol.toStringTag]==="Temporal.Instant"&&typeof e.t=="bigint"}function wp(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof Ee||r instanceof en||r instanceof Ot||r instanceof Fe||r instanceof Ku||r instanceof pt||Dp(r)||cp(r))}function yp(r,e,t){if(!wp(t)||!Oi(t)){const n=da(t);throw n==="an object"?e.createError(r+" a custom object"):e.createError(r+" "+n)}}function ds(r,e,t){if((e=Oe(e))instanceof qu)return e._internalPath;if(typeof e=="string")return XT(r,e);throw Yo("Field path arguments must be of type string or ",r,!1,void 0,t)}const YT=new RegExp("[~\\*/\\[\\]]");function XT(r,e,t){if(e.search(YT)>=0)throw Yo(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new qu(...e.split("."))._internalPath}catch{throw Yo(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function Yo(r,e,t,n,s){const i=n&&!n.isEmpty(),o=s!==void 0;let B=`Function ${e}() called with invalid data`;t&&(B+=" (via `toFirestore()`)"),B+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${n}`),o&&(u+=` in document ${s}`),u+=")"),new W(V.INVALID_ARGUMENT,B+r+u)}function ZT(r,e){return r.some((t=>t.isEqual(e)))}function Tp(r){return typeof r._readUserData=="function"}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(e){this.optionDefinitions=e}_getKnownOptions(e,t){const n=Tt.empty();for(const s in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(s)){const i=this.optionDefinitions[s];if(s in e){const o=e[s];let B;i.nestedOptions&&Oi(o)?B={mapValue:{fields:new rt(i.nestedOptions).getOptionsProto(t,o)}}:o&&(B=ss(o,t)??void 0),B&&n.set(vt.fromServerFormat(i.serverName),B)}}return n}getOptionsProto(e,t,n){const s=this._getKnownOptions(t,e);if(n){const i=new Map(uy(n,((o,B)=>[vt.fromServerFormat(B),o!==void 0?ss(o,e):null])));s.setAll(i)}return s.value.mapValue.fields??{}}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eI(r){return typeof r=="object"&&r!==null&&!!("nullValue"in r&&(r.nullValue===null||r.nullValue==="NULL_VALUE")||"booleanValue"in r&&(r.booleanValue===null||typeof r.booleanValue=="boolean")||"integerValue"in r&&(r.integerValue===null||typeof r.integerValue=="number"||typeof r.integerValue=="string")||"doubleValue"in r&&(r.doubleValue===null||typeof r.doubleValue=="number")||"timestampValue"in r&&(r.timestampValue===null||(function(t){return typeof t=="object"&&t!==null&&"seconds"in t&&(t.seconds===null||typeof t.seconds=="number"||typeof t.seconds=="string")&&"nanos"in t&&(t.nanos===null||typeof t.nanos=="number")})(r.timestampValue))||"stringValue"in r&&(r.stringValue===null||typeof r.stringValue=="string")||"bytesValue"in r&&(r.bytesValue===null||r.bytesValue instanceof Uint8Array)||"referenceValue"in r&&(r.referenceValue===null||typeof r.referenceValue=="string")||"geoPointValue"in r&&(r.geoPointValue===null||(function(t){return typeof t=="object"&&t!==null&&"latitude"in t&&(t.latitude===null||typeof t.latitude=="number")&&"longitude"in t&&(t.longitude===null||typeof t.longitude=="number")})(r.geoPointValue))||"arrayValue"in r&&(r.arrayValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("values"in t)||t.values!==null&&!Array.isArray(t.values))})(r.arrayValue))||"mapValue"in r&&(r.mapValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("fields"in t)||t.fields!==null&&!Oi(t.fields))})(r.mapValue))||"fieldReferenceValue"in r&&(r.fieldReferenceValue===null||typeof r.fieldReferenceValue=="string")||"functionValue"in r&&(r.functionValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("name"in t)||t.name!==null&&typeof t.name!="string"||!("args"in t)||t.args!==null&&!Array.isArray(t.args))})(r.functionValue))||"pipelineValue"in r&&(r.pipelineValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("stages"in t)||t.stages!==null&&!Array.isArray(t.stages))})(r.pipelineValue)))}function tI(){return new Wu("serverTimestamp")}function nI(r){return new pt(r)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function j(r){let e;return r instanceof Nr?r:(e=Oi(r)?aI(r):r instanceof Array?BI(r):Ip(r,void 0),e)}function IB(r){if(r instanceof Nr)return r;if(r instanceof pt)return Di(r);if(Array.isArray(r))return Di(nI(r));throw new Error("Unsupported value: "+typeof r)}function $u(r){return Cy(r)?So(r):j(r)}class Nr{constructor(){this._protoValueType="ProtoValue"}add(e){return new x("add",[this,j(e)],"add")}asBoolean(){if(this instanceof $n)return this;if(this instanceof ps)return new Rp(this);if(this instanceof Cs)return new oI(this);if(this instanceof x)return new Ap(this);throw new W("invalid-argument",`Conversion of type ${typeof this} to BooleanExpression not supported.`)}subtract(e){return new x("subtract",[this,j(e)],"subtract")}multiply(e){return new x("multiply",[this,j(e)],"multiply")}divide(e){return new x("divide",[this,j(e)],"divide")}mod(e){return new x("mod",[this,j(e)],"mod")}equal(e){return new x("equal",[this,j(e)],"equal").asBoolean()}notEqual(e){return new x("not_equal",[this,j(e)],"notEqual").asBoolean()}lessThan(e){return new x("less_than",[this,j(e)],"lessThan").asBoolean()}lessThanOrEqual(e){return new x("less_than_or_equal",[this,j(e)],"lessThanOrEqual").asBoolean()}greaterThan(e){return new x("greater_than",[this,j(e)],"greaterThan").asBoolean()}greaterThanOrEqual(e){return new x("greater_than_or_equal",[this,j(e)],"greaterThanOrEqual").asBoolean()}arrayConcat(e,...t){const n=[e,...t].map((s=>j(s)));return new x("array_concat",[this,...n],"arrayConcat")}arrayContains(e){return new x("array_contains",[this,j(e)],"arrayContains").asBoolean()}arrayContainsAll(e){const t=Array.isArray(e)?new js(e.map(j),"arrayContainsAll"):e;return new x("array_contains_all",[this,t],"arrayContainsAll").asBoolean()}arrayContainsAny(e){const t=Array.isArray(e)?new js(e.map(j),"arrayContainsAny"):e;return new x("array_contains_any",[this,t],"arrayContainsAny").asBoolean()}arrayReverse(){return new x("array_reverse",[this])}arrayLength(){return new x("array_length",[this],"arrayLength")}equalAny(e){const t=Array.isArray(e)?new js(e.map(j),"equalAny"):e;return new x("equal_any",[this,t],"equalAny").asBoolean()}notEqualAny(e){const t=Array.isArray(e)?new js(e.map(j),"notEqualAny"):e;return new x("not_equal_any",[this,t],"notEqualAny").asBoolean()}exists(){return new x("exists",[this],"exists").asBoolean()}charLength(){return new x("char_length",[this],"charLength")}like(e){return new x("like",[this,j(e)],"like").asBoolean()}regexContains(e){return new x("regex_contains",[this,j(e)],"regexContains").asBoolean()}regexFind(e){return new x("regex_find",[this,j(e)],"regexFind")}regexFindAll(e){return new x("regex_find_all",[this,j(e)],"regexFindAll")}regexMatch(e){return new x("regex_match",[this,j(e)],"regexMatch").asBoolean()}stringContains(e){return new x("string_contains",[this,j(e)],"stringContains").asBoolean()}startsWith(e){return new x("starts_with",[this,j(e)],"startsWith").asBoolean()}endsWith(e){return new x("ends_with",[this,j(e)],"endsWith").asBoolean()}toLower(){return new x("to_lower",[this],"toLower")}toUpper(){return new x("to_upper",[this],"toUpper")}trim(e){const t=[this];return e&&t.push(j(e)),new x("trim",t,"trim")}ltrim(e){const t=[this];return e&&t.push(j(e)),new x("ltrim",t,"ltrim")}rtrim(e){const t=[this];return e&&t.push(j(e)),new x("rtrim",t,"rtrim")}type(){return new x("type",[this])}isType(e){return new x("is_type",[this,Di(e)],"isType").asBoolean()}stringConcat(e,...t){const n=[e,...t].map(j);return new x("string_concat",[this,...n],"stringConcat")}stringIndexOf(e){return new x("string_index_of",[this,j(e)],"stringIndexOf")}stringRepeat(e){return new x("string_repeat",[this,j(e)],"stringRepeat")}stringReplaceAll(e,t){return new x("string_replace_all",[this,j(e),j(t)],"stringReplaceAll")}stringReplaceOne(e,t){return new x("string_replace_one",[this,j(e),j(t)],"stringReplaceOne")}concat(e,...t){const n=[e,...t].map(j);return new x("concat",[this,...n],"concat")}reverse(){return new x("reverse",[this],"reverse")}arrayFilter(e,t){return new x("array_filter",[this,j(e),t],"arrayFilter")}arrayTransform(e,t){return new x("array_transform",[this,j(e),t],"arrayTransform")}arrayTransformWithIndex(e,t,n){return new x("array_transform",[this,j(e),j(t),n],"arrayTransformWithIndex")}arraySlice(e,t){const n=[this,j(e)];return t!==void 0&&n.push(j(t)),new x("array_slice",n,"arraySlice")}arrayFirst(){return new x("array_first",[this],"arrayFirst")}arrayFirstN(e){return new x("array_first_n",[this,j(e)],"arrayFirstN")}arrayLast(){return new x("array_last",[this],"arrayLast")}arrayLastN(e){return new x("array_last_n",[this,j(e)],"arrayLastN")}arrayMaximum(){return new x("maximum",[this],"arrayMaximum")}arrayMaximumN(e){return new x("maximum_n",[this,j(e)],"arrayMaximumN")}arrayMinimum(){return new x("minimum",[this],"arrayMinimum")}arrayMinimumN(e){return new x("minimum_n",[this,j(e)],"arrayMinimumN")}arrayIndexOf(e){return new x("array_index_of",[this,j(e),j("first")],"arrayIndexOf")}arrayLastIndexOf(e){return new x("array_index_of",[this,j(e),j("last")],"arrayLastIndexOf")}arrayIndexOfAll(e){return new x("array_index_of_all",[this,j(e)],"arrayIndexOfAll")}byteLength(){return new x("byte_length",[this],"byteLength")}ceil(){return new x("ceil",[this])}floor(){return new x("floor",[this])}abs(){return new x("abs",[this])}exp(){return new x("exp",[this])}mapGet(e){return new x("map_get",[this,Di(e)],"mapGet")}mapSet(e,t,...n){const s=[this,j(e),j(t),...n.map(j)];return new x("map_set",s,"mapSet")}mapKeys(){return new x("map_keys",[this],"mapKeys")}mapValues(){return new x("map_values",[this],"mapValues")}mapEntries(){return new x("map_entries",[this],"mapEntries")}getField(e){return new x("get_field",[this,j(e)],"get_field")}count(){return Dt._create("count",[this],"count")}sum(){return Dt._create("sum",[this],"sum")}average(){return Dt._create("average",[this],"average")}minimum(){return Dt._create("minimum",[this],"minimum")}maximum(){return Dt._create("maximum",[this],"maximum")}first(){return Dt._create("first",[this],"first")}last(){return Dt._create("last",[this],"last")}arrayAgg(){return Dt._create("array_agg",[this],"arrayAgg")}arrayAggDistinct(){return Dt._create("array_agg_distinct",[this],"arrayAggDistinct")}countDistinct(){return Dt._create("count_distinct",[this],"countDistinct")}logicalMaximum(e,...t){const n=[e,...t];return new x("maximum",[this,...n.map(j)],"logicalMaximum")}logicalMinimum(e,...t){const n=[e,...t];return new x("minimum",[this,...n.map(j)],"minimum")}vectorLength(){return new x("vector_length",[this],"vectorLength")}cosineDistance(e){return new x("cosine_distance",[this,IB(e)],"cosineDistance")}dotProduct(e){return new x("dot_product",[this,IB(e)],"dotProduct")}euclideanDistance(e){return new x("euclidean_distance",[this,IB(e)],"euclideanDistance")}unixMicrosToTimestamp(){return new x("unix_micros_to_timestamp",[this],"unixMicrosToTimestamp")}timestampToUnixMicros(){return new x("timestamp_to_unix_micros",[this],"timestampToUnixMicros")}unixMillisToTimestamp(){return new x("unix_millis_to_timestamp",[this],"unixMillisToTimestamp")}timestampToUnixMillis(){return new x("timestamp_to_unix_millis",[this],"timestampToUnixMillis")}unixSecondsToTimestamp(){return new x("unix_seconds_to_timestamp",[this],"unixSecondsToTimestamp")}timestampToUnixSeconds(){return new x("timestamp_to_unix_seconds",[this],"timestampToUnixSeconds")}timestampAdd(e,t){return new x("timestamp_add",[this,j(e),j(t)],"timestampAdd")}timestampSubtract(e,t){return new x("timestamp_subtract",[this,j(e),j(t)],"timestampSubtract")}timestampDiff(e,t){return new x("timestamp_diff",[this,$u(e),j(t)],"timestampDiff")}timestampExtract(e,t){const n=[this,j(e)];return t&&n.push(j(t)),new x("timestamp_extract",n,"timestampExtract")}documentId(){return new x("document_id",[this],"documentId")}parent(){return new x("parent",[this],"parent")}substring(e,t){const n=j(e);return new x("substring",t===void 0?[this,n]:[this,n,j(t)],"substring")}arrayGet(e){return new x("array_get",[this,j(e)],"arrayGet")}isError(){return new x("is_error",[this],"isError").asBoolean()}ifError(e){const t=new x("if_error",[this,j(e)],"ifError");return e instanceof $n?t.asBoolean():t}isAbsent(){return new x("is_absent",[this],"isAbsent").asBoolean()}mapRemove(e){return new x("map_remove",[this,j(e)],"mapRemove")}mapMerge(e,...t){const n=j(e),s=t.map(j);return new x("map_merge",[this,n,...s],"mapMerge")}pow(e){return new x("pow",[this,j(e)])}trunc(e){return e===void 0?new x("trunc",[this]):new x("trunc",[this,j(e)],"trunc")}round(e){return e===void 0?new x("round",[this]):new x("round",[this,j(e)],"round")}collectionId(){return new x("collection_id",[this])}length(){return new x("length",[this])}ln(){return new x("ln",[this])}sqrt(){return new x("sqrt",[this])}stringReverse(){return new x("string_reverse",[this])}ifAbsent(e){return new x("if_absent",[this,j(e)],"ifAbsent")}ifNull(e){return new x("if_null",[this,j(e)],"ifNull")}coalesce(e,...t){return new x("coalesce",[this,j(e),...t.map(j)],"coalesce")}join(e){return new x("join",[this,j(e)],"join")}log10(){return new x("log10",[this])}arraySum(){return new x("sum",[this])}split(e){return new x("split",[this,j(e)])}timestampTruncate(e,t){const n=[this,j(e)];return t&&n.push(j(t)),new x("timestamp_trunc",n)}ascending(){return uI(this)}descending(){return cI(this)}as(e){return new sI(this,e,"as")}}class Dt{constructor(e,t){this.name=e,this.params=t,this.exprType="AggregateFunction",this._protoValueType="ProtoValue"}static _create(e,t,n){const s=new Dt(e,t);return s._methodName=n,s}as(e){return new rI(this,e,"as")}_toProto(e){return{functionValue:{name:this.name,args:this.params.map((t=>t._toProto(e)))}}}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e)))}}class rI{constructor(e,t,n){this.aggregate=e,this.alias=t,this._methodName=n}_readUserData(e){this.aggregate._readUserData(e)}}class sI{constructor(e,t,n){this.expr=e,this.alias=t,this._methodName=n,this.exprType="AliasedExpression",this.selectable=!0}_readUserData(e){this.expr._readUserData(e)}}class js extends Nr{constructor(e,t){super(),this.cr=e,this._methodName=t,this.expressionType="ListOfExpressions"}_toProto(e){return{arrayValue:{values:this.cr.map((t=>t._toProto(e)))}}}_readUserData(e){this.cr.forEach((t=>t._readUserData(e)))}}class Cs extends Nr{constructor(e,t){super(),this.fieldPath=e,this._methodName=t,this.expressionType="Field",this.selectable=!0}get _fieldPath(){return this.fieldPath}get fieldName(){return this.fieldPath.canonicalString()}get alias(){return this.fieldName}get expr(){return this}geoDistance(e){return new x("geo_distance",[this,j(e)],"geoDistance")}_toProto(e){return{fieldReferenceValue:this.fieldPath.canonicalString()}}_readUserData(e){}}function So(r){return iI(r,"field")}function iI(r,e){return new Cs(typeof r=="string"?Kt===r?mT()._internalPath:ds("field",r):r._internalPath,e)}class ps extends Nr{constructor(e,t){super(),this.value=e,this._methodName=t,this.expressionType="Constant"}static _fromProto(e){const t=new ps(e,void 0);return t._protoValue=e,t}_toProto(e){return ee(this._protoValue!==void 0,237),this._protoValue}_getValue(){return this._protoValue}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,eI(this._protoValue)||(this._protoValue=ss(this.value,e))}}function Di(r,e){return Ip(r,"constant")}function Ip(r,e){const t=new ps(r,e);return typeof r=="boolean"?new Rp(t):t}class x extends Nr{constructor(e,t,n,s){super(),this.name=e,this.params=t,this.expressionType="Function",this._optionsProto=void 0,n!==void 0&&(this._methodName=n),s!==void 0&&(this._options=s)}get _optionsUtil(){return new rt({})}_toProto(e){const t={functionValue:{name:this.name,args:this.params.map((n=>n._toProto(e)))}};return this._optionsProto&&(t.functionValue.options=this._optionsProto),t}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e))),this._options&&(this._optionsProto=this._optionsUtil.getOptionsProto(e,this._options))}}class $n extends Nr{get _methodName(){return this._expr._methodName}countIf(){return Dt._create("count_if",[this],"countIf")}not(){return new x("not",[this],"not").asBoolean()}conditional(e,t){return new x("conditional",[this,e,t],"conditional")}ifError(e){const t=j(e),n=new x("if_error",[this,t],"ifError");return t instanceof $n?n.asBoolean():n}_toProto(e){return this._expr._toProto(e)}_readUserData(e){this._expr._readUserData(e)}}class Ap extends $n{constructor(e){super(),this._expr=e,this.expressionType="Function"}}class Rp extends $n{constructor(e){super(),this._expr=e,this.expressionType="Constant"}_getValue(){return this._expr._getValue()}}class oI extends $n{constructor(e){super(),this._expr=e,this.expressionType="Field"}}function aI(r,e){const t=[];for(const n in r)if(Object.prototype.hasOwnProperty.call(r,n)){const s=r[n];t.push(Di(n)),t.push(j(s))}return new x("map",t,"map")}function BI(r){return(function(t,n){return new x("array",t.map((s=>j(s))),n)})(r,"array")}function uI(r){return new vp($u(r),"ascending","ascending")}function cI(r){return new vp($u(r),"descending","descending")}class vp{constructor(e,t,n){this.expr=e,this.direction=t,this._methodName=n,this._protoValueType="ProtoValue"}_toProto(e){return{mapValue:{fields:{direction:lp(this.direction),expression:this.expr._toProto(e)}}}}_readUserData(e){this.expr._readUserData(e)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bt{constructor(e){this.optionsProto=void 0,{rawOptions:this.rawOptions,...this.knownOptions}=e}_readUserData(e){this.optionsProto=this._optionsUtil.getOptionsProto(e,this.knownOptions,this.rawOptions)}_toProto(e){return{name:this._name,options:this.optionsProto}}}class bp extends bt{get _name(){return"add_fields"}get _optionsUtil(){return new rt({})}constructor(e,t){super(t),this.fields=e}_toProto(e){return{...super._toProto(e),args:[_i(e,this.fields)]}}_readUserData(e){super._readUserData(e),Qn(this.fields,e)}}class Pp extends bt{get _name(){return"aggregate"}get _optionsUtil(){return new rt({})}constructor(e,t,n){super(n),this.groups=e,this.accumulators=t}_toProto(e){return{...super._toProto(e),args:[_i(e,this.accumulators),_i(e,this.groups)]}}_readUserData(e){super._readUserData(e),Qn(this.groups,e),Qn(this.accumulators,e)}}class Sp extends bt{get _name(){return"distinct"}get _optionsUtil(){return new rt({})}constructor(e,t){super(t),this.groups=e}_toProto(e){return{...super._toProto(e),args:[_i(e,this.groups)]}}_readUserData(e){super._readUserData(e),Qn(this.groups,e)}}class Ia extends bt{get _name(){return"collection"}get _optionsUtil(){return new rt({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.hr=e.startsWith("/")?e:"/"+e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:this.hr}]}}_readUserData(e){super._readUserData(e)}}class Aa extends bt{get _name(){return"collection_group"}get _optionsUtil(){return new rt({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.collectionId=e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:""},{stringValue:this.collectionId}]}}_readUserData(e){super._readUserData(e)}}class Qu extends bt{get _name(){return"database"}get _optionsUtil(){return new rt({})}_toProto(e){return{...super._toProto(e)}}_readUserData(e){super._readUserData(e)}}class Yu extends bt{get _name(){return"documents"}get _optionsUtil(){return new rt({})}constructor(e,t){if(super(t),!e||e.length===0)throw new W(V.INVALID_ARGUMENT,"Empty document paths are not allowed in DocumentsSource");const n=e.map((i=>i.startsWith("/")?i:"/"+i)),s=new Set(n);if(s.size!==n.length)throw new W(V.INVALID_ARGUMENT,"Duplicate document paths are not allowed in DocumentsSource");this.Tr=n,this.Pr=s}_toProto(e){return{...super._toProto(e),args:this.Tr.map((t=>({referenceValue:t})))}}_readUserData(e){super._readUserData(e)}}class Ra extends bt{get _name(){return"where"}get _optionsUtil(){return new rt({})}constructor(e,t){super(t),this.condition=e}_toProto(e){return{...super._toProto(e),args:[this.condition._toProto(e)]}}_readUserData(e){super._readUserData(e),Qn(this.condition,e)}}class Ar extends bt{get _name(){return"limit"}get _optionsUtil(){return new rt({})}constructor(e,t){ee(!isNaN(e)&&e!==1/0&&e!==-1/0,34860),super(t),this.limit=e}_toProto(e){return{...super._toProto(e),args:[Mu(e,this.limit)]}}}class _f extends bt{get _name(){return"offset"}get _optionsUtil(){return new rt({})}constructor(e,t){super(t),this.offset=e}_toProto(e){return{...super._toProto(e),args:[Mu(e,this.offset)]}}}class lI extends bt{get _name(){return"select"}get _optionsUtil(){return new rt({})}constructor(e,t){super(t),this.selections=e}_toProto(e){return{...super._toProto(e),args:[_i(e,this.selections)]}}_readUserData(e){super._readUserData(e),Qn(this.selections,e)}}class un extends bt{get _name(){return"sort"}get _optionsUtil(){return new rt({})}constructor(e,t){super(t),this.orderings=e}_toProto(e){return{...super._toProto(e),args:this.orderings.map((t=>t._toProto(e)))}}_readUserData(e){super._readUserData(e),Qn(this.orderings,e)}}class Xu extends bt{get _name(){return"replace_with"}get _optionsUtil(){return new rt({})}constructor(e,t){super(t),this.map=e}_toProto(e){return{...super._toProto(e),args:[this.map._toProto(e),lp(Xu.Ir)]}}_readUserData(e){super._readUserData(e),Qn(this.map,e)}}Xu.Ir="full_replace";function Qn(r,e){return Tp(r)?r._readUserData(e):Array.isArray(r)?r.forEach((t=>t._readUserData(e))):r instanceof Map?r.forEach((t=>t._readUserData(e))):Object.values(r).forEach((t=>t._readUserData(e))),r}/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ti{constructor(e,t,n,s){this._db=e,this.userDataReader=t,this._userDataWriter=n,this.stages=s}Vr(e,t){const n=this.userDataReader.createContext(3,e);return Tp(t)?t._readUserData(n):Array.isArray(t)?t.forEach((s=>s._readUserData(n))):t.forEach((s=>s._readUserData(n))),t}where(e){const t=this.stages.map((n=>n));return this.Vr("where",e),t.push(new Ra(e,{})),new ti(this._db,this.userDataReader,this._userDataWriter,t)}limit(e){const t=this.stages.map((n=>n));return t.push(new Ar(e,{})),new ti(this._db,this.userDataReader,this._userDataWriter,t)}sort(e,...t){const n=this.stages.map((s=>s));return"orderings"in e?n.push(new un(this.Vr("sort",e.orderings),{})):n.push(new un(this.Vr("sort",[e,...t]),{})),new ti(this._db,this.userDataReader,this._userDataWriter,n)}dr(e){return{pipeline:{stages:this.stages.map((t=>t._toProto(e)))}}}}// Copyright 2024 Google LLC* @license
class at{constructor(e,t,n){this.serializer=e,this.stages=t,this.listenOptions=n,this.isCorePipeline=!0}getPipelineCollection(){return va(this)}getPipelineCollectionGroup(){return Zu(this)}getPipelineCollectionId(){return hI(this)}getPipelineDocuments(){return iu(this)}getPipelineFlavor(){return(function(t){let n="exact";return t.stages.forEach(((s,i)=>{s._name!==Sp.name&&s._name!==Pp.name||(n="keyless"),s._name===lI.name&&n==="exact"&&(n="augmented"),s._name===bp.name&&i<t.stages.length-1&&n==="exact"&&(n="augmented")})),n})(this)}getPipelineSourceType(){return Hn(this)}}function Hn(r){const e=r.stages[0];return e instanceof Ia||e instanceof Aa||e instanceof Qu||e instanceof Yu?e._name:"unknown"}function va(r){if(Hn(r)==="collection")return r.stages[0].hr}function Zu(r){if(Hn(r)==="collection_group")return r.stages[0].collectionId}function hI(r){switch(Hn(r)){case"collection":return ge.fromString(va(r)).lastSegment();case"collection_group":return Zu(r);default:return}}function iu(r){if(Hn(r)==="documents")return r.stages[0].Tr}class A{constructor(e,t){this.type=e,this.value=t}static mr(){return new A("ERROR",void 0)}static pr(){return new A("UNSET",void 0)}static gr(){return new A("NULL",ts)}static newValue(e){return It(e)?new A("NULL",ts):(function(n){return!!n&&"booleanValue"in n})(e)?new A("BOOLEAN",e):zt(e)?new A("INT",e):hr(e)?new A("DOUBLE",e):(function(n){return!!n&&"timestampValue"in n&&!!n.timestampValue})(e)?new A("TIMESTAMP",e):(function(n){return!!n&&"stringValue"in n})(e)?new A("STRING",e):(function(n){return!!n&&"bytesValue"in n})(e)?new A("BYTES",e):e.referenceValue?new A("REFERENCE",e):e.geoPointValue?new A("GEO_POINT",e):rs(e)?new A("ARRAY",e):jo(e)?new A("VECTOR",e):pr(e)?new A("MAP",e):new A("ERROR",void 0)}yr(){return this.type==="ERROR"||this.type==="UNSET"}wr(){return this.type==="NULL"}}function ni(r){if(!r.yr())return r.value}function Op(r){return r instanceof $n?r._expr:r}function se(r){if((r=Op(r))instanceof Cs)return new fI(r);if(r instanceof ps)return new dI(r);if(r instanceof js)return new CI(r);if(r instanceof x){if(r.name==="add")return new mI(r);if(r.name==="subtract")return new EI(r);if(r.name==="multiply")return new _I(r);if(r.name==="divide")return new DI(r);if(r.name==="mod")return new wI(r);if(r.name==="and")return new yI(r);if(r.name==="equal")return new LI(r);if(r.name==="not_equal")return new kI(r);if(r.name==="less_than")return new xI(r);if(r.name==="less_than_or_equal")return new VI(r);if(r.name==="greater_than")return new MI(r);if(r.name==="greater_than_or_equal")return new GI(r);if(r.name==="array_concat")return new UI(r);if(r.name==="array_reverse")return new HI(r);if(r.name==="array_contains")return new JI(r);if(r.name==="array_contains_all")return new jI(r);if(r.name==="array_contains_any")return new qI(r);if(r.name==="array_length")return new KI(r);if(r.name==="array_element")return new zI(r);if(r.name==="equal_any")return new Np(r);if(r.name==="not_equal_any")return new II(r);if(r.name==="is_nan")return new AI(r);if(r.name==="is_not_nan")return new RI(r);if(r.name==="is_null")return new vI(r);if(r.name==="is_not_null")return new bI(r);if(r.name==="is_error")return new PI(r);if(r.name==="exists")return new SI(r);if(r.name==="not")return new ba(r);if(r.name==="or")return new TI(r);if(r.name==="xor")return new ec(r);if(r.name==="conditional")return new OI(r);if(r.name==="maximum")return new NI(r);if(r.name==="minimum")return new FI(r);if(r.name==="reverse")return new WI(r);if(r.name==="replace_first")return new $I(r);if(r.name==="replace_all")return new QI(r);if(r.name==="char_length")return new YI(r);if(r.name==="byte_length")return new XI(r);if(r.name==="like")return new ZI(r);if(r.name==="regex_contains")return new eA(r);if(r.name==="regex_match")return new tA(r);if(r.name==="string_contains")return new nA(r);if(r.name==="starts_with")return new rA(r);if(r.name==="ends_with")return new sA(r);if(r.name==="to_lower")return new iA(r);if(r.name==="to_upper")return new oA(r);if(r.name==="trim")return new aA(r);if(r.name==="string_concat")return new BA(r);if(r.name==="map_get")return new uA(r);if(r.name==="cosine_distance")return new cA(r);if(r.name==="dot_product")return new lA(r);if(r.name==="euclidean_distance")return new hA(r);if(r.name==="vector_length")return new fA(r);if(r.name==="unix_micros_to_timestamp")return new mA(r);if(r.name==="timestamp_to_unix_micros")return new DA(r);if(r.name==="unix_millis_to_timestamp")return new EA(r);if(r.name==="timestamp_to_unix_millis")return new wA(r);if(r.name==="unix_seconds_to_timestamp")return new _A(r);if(r.name==="timestamp_to_unix_seconds")return new yA(r);if(r.name==="timestamp_add")return new TA(r);if(r.name==="timestamp_subtract")return new IA(r)}throw new Error(`Unknown Expr : ${r}`)}class fI{constructor(e){this.expr=e}evaluate(e,t){if(this.expr.fieldName===Kt)return A.newValue({referenceValue:Qo(e.serializer,t.key)});if(this.expr.fieldName==="__update_time__")return A.newValue({timestampValue:Po(e.serializer,t.version)});if(this.expr.fieldName==="__create_time__")return A.newValue({timestampValue:Po(e.serializer,t.createTime)});const n=t.data.field(this.expr._fieldPath);return n?Ca(n)?A.newValue((function(i,o){if(i.serverTimestampBehavior==="estimate")return{timestampValue:Po(i.serializer,oe.fromTimestamp(es(o)))};if(i.serverTimestampBehavior==="previous"){const B=Fi(o);if(B)return B}return{nullValue:"NULL_VALUE"}})(e,n)):A.newValue(n):A.pr()}}class dI{constructor(e){this.expr=e}evaluate(e,t){return A.newValue(this.expr._getValue())}}class CI{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.cr.map((s=>se(s).evaluate(e,t)));return n.some((s=>s.yr()))?A.mr():A.newValue({arrayValue:{values:n.map((s=>s.value))}})}}function Ye(r){return hr(r)?Number(r.doubleValue):Number(r.integerValue)}function nn(r){return BigInt(r.integerValue)}const pI=BigInt("0x7fffffffffffffff"),gI=-BigInt("0x8000000000000000");class Vi{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length>=2,24778);const n=se(this.expr.params[0]).evaluate(e,t),s=se(this.expr.params[1]).evaluate(e,t);let i=this.br(n,s);for(const o of this.expr.params.slice(2)){const B=se(o).evaluate(e,t);i=this.br(i,B)}return i}br(e,t){if(e.yr()||t.yr())return A.mr();if(e.wr()||t.wr())return A.gr();const n=e.value,s=t.value;if(!hr(n)&&!zt(n)||!hr(s)&&!zt(s))return A.mr();if(hr(n)||hr(s)){const i=this.Sr(n,s);return i?A.newValue(i):A.mr()}if(zt(n)&&zt(s)){const i=this.vr(n,s);return i===void 0?A.mr():typeof i=="number"?A.newValue({doubleValue:i}):i<gI||i>pI?A.mr():A.newValue({integerValue:`${i}`})}return A.mr()}}function mn(r,e){return Je(r)!==Je(e)?"TYPE_MISMATCH":Et(r)||Et(e)?"NOT_EQ":It(r)&&It(e)?"EQ":It(r)||It(e)?"NULL":rs(r)&&rs(e)?(function(n,s){var o,B,u;if(((o=n.values)==null?void 0:o.length)!==((B=s.values)==null?void 0:B.length))return"NOT_EQ";let i=!1;for(let c=0;c<(((u=n.values)==null?void 0:u.length)??0);c++){const h=n.values[c],d=s.values[c];switch(mn(h,d)){case"EQ":break;case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":i=!0;break;default:re(44609,{Dr:h,Cr:d})}}return i?"NULL":"EQ"})(r.arrayValue,e.arrayValue):jo(r)&&jo(e)||pr(r)&&pr(e)?(function(n,s){const i=n.fields||{},o=s.fields||{};if(Ho(i)!==Ho(o))return"NOT_EQ";let B=!1;for(const u in i)if(i.hasOwnProperty(u)){if(o[u]===void 0)return"NOT_EQ";switch(mn(i[u],o[u])){case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":B=!0}}return B?"NULL":"EQ"})(r.mapValue,e.mapValue):(function(n,s){return Nt(n,s,{u:!1,i:!0,o:!0})})(r,e)?"EQ":"NOT_EQ"}class mI extends Vi{vr(e,t){return nn(e)+nn(t)}Sr(e,t){return{doubleValue:Ye(e)+Ye(t)}}}class EI extends Vi{constructor(e){super(e),this.expr=e}vr(e,t){return nn(e)-nn(t)}Sr(e,t){return{doubleValue:Ye(e)-Ye(t)}}}class _I extends Vi{constructor(e){super(e),this.expr=e}vr(e,t){return nn(e)*nn(t)}Sr(e,t){return{doubleValue:Ye(e)*Ye(t)}}}class DI extends Vi{constructor(e){super(e),this.expr=e}vr(e,t){const n=nn(t);if(n!==BigInt(0))return nn(e)/n}Sr(e,t){const n=Ye(t);return n===0?{doubleValue:li(n)?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY}:{doubleValue:Ye(e)/n}}}class wI extends Vi{constructor(e){super(e),this.expr=e}vr(e,t){const n=nn(t);if(n!==BigInt(0))return nn(e)%n}Sr(e,t){const n=Ye(t);if(n!==0)return{doubleValue:Ye(e)%n}}}class yI{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const o of this.expr.params){const B=se(o).evaluate(e,t);switch(B.type){case"BOOLEAN":if(!((i=B.value)!=null&&i.booleanValue))return A.newValue($e);break;case"NULL":s=!0;break;default:n=!0}}return n?A.mr():s?A.gr():A.newValue(gt)}}class ba{constructor(e){this.expr=e}evaluate(e,t){var s;ee(this.expr.params.length===1,9634);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BOOLEAN":return A.newValue({booleanValue:!((s=n.value)!=null&&s.booleanValue)});case"NULL":return A.gr();default:return A.mr()}}}class TI{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const o of this.expr.params){const B=se(o).evaluate(e,t);switch(B.type){case"BOOLEAN":if((i=B.value)!=null&&i.booleanValue)return A.newValue(gt);break;case"NULL":s=!0;break;default:n=!0}}return n?A.mr():s?A.gr():A.newValue($e)}}class ec{constructor(e){this.expr=e}evaluate(e,t){var i;let n=!1,s=!1;for(const o of this.expr.params){const B=se(o).evaluate(e,t);switch(B.type){case"BOOLEAN":n=ec.xor(n,!!((i=B.value)!=null&&i.booleanValue));break;case"NULL":s=!0;break;default:return A.mr()}}return s?A.gr():A.newValue({booleanValue:n})}static xor(e,t){return(e||t)&&!(e&&t)}}class Np{constructor(e){this.expr=e}evaluate(e,t){var o,B;ee(this.expr.params.length===2,55094);let n=!1;const s=se(this.expr.params[0]).evaluate(e,t);switch(s.type){case"NULL":n=!0;break;case"ERROR":case"UNSET":return A.mr()}const i=se(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return A.mr()}if(n)return A.gr();for(const u of((B=(o=i.value)==null?void 0:o.arrayValue)==null?void 0:B.values)??[])switch(It(s.value)&&It(u)?"EQ":mn(s.value,u)){case"EQ":return A.newValue(gt);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:re(44608,{value:s.value,candidate:u})}return n?A.gr():A.newValue($e)}}class II{constructor(e){this.expr=e}evaluate(e,t){return new ba(new x("not",[new x("equal_any",this.expr.params)])).evaluate(e,t)}}class AI{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===1,23322);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"INT":return A.newValue($e);case"DOUBLE":return A.newValue({booleanValue:isNaN(Ye(n.value))});case"NULL":return A.gr();default:return A.mr()}}}class RI{constructor(e){this.expr=e}evaluate(e,t){return ee(this.expr.params.length===1,50406),new ba(new x("not",[new x("is_nan",this.expr.params)])).evaluate(e,t)}}class vI{constructor(e){this.expr=e}evaluate(e,t){switch(ee(this.expr.params.length===1,23123),se(this.expr.params[0]).evaluate(e,t).type){case"NULL":return A.newValue(gt);case"UNSET":case"ERROR":return A.mr();default:return A.newValue($e)}}}class bI{constructor(e){this.expr=e}evaluate(e,t){return ee(this.expr.params.length===1,23167),new ba(new x("not",[new x("is_null",this.expr.params)])).evaluate(e,t)}}class PI{constructor(e){this.expr=e}evaluate(e,t){return ee(this.expr.params.length===1,5228),se(this.expr.params[0]).evaluate(e,t).type==="ERROR"?A.newValue(gt):A.newValue($e)}}class SI{constructor(e){this.expr=e}evaluate(e,t){switch(ee(this.expr.params.length===1,6877),se(this.expr.params[0]).evaluate(e,t).type){case"ERROR":return A.mr();case"UNSET":return A.newValue($e);default:return A.newValue(gt)}}}class OI{constructor(e){this.expr=e}evaluate(e,t){var s;ee(this.expr.params.length===3,11706);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BOOLEAN":return(s=n.value)!=null&&s.booleanValue?se(this.expr.params[1]).evaluate(e,t):se(this.expr.params[2]).evaluate(e,t);case"NULL":return se(this.expr.params[2]).evaluate(e,t);default:return A.mr()}}}class NI{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map((i=>se(i).evaluate(e,t)));let s;for(const i of n)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||mt(i.value,s.value)>0?i:s}return s===void 0?A.gr():s}}class FI{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map((i=>se(i).evaluate(e,t)));let s;for(const i of n)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||mt(i.value,s.value)<0?i:s}return s===void 0?A.gr():s}}class gs{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===2,31033,`${this.expr.name}() function should have exactly 2 params`);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"ERROR":case"UNSET":return A.mr()}const s=se(this.expr.params[1]).evaluate(e,t);switch(s.type){case"ERROR":case"UNSET":return A.mr()}return this.Fr(n,s)}}class LI extends gs{constructor(e){super(e),this.expr=e}Fr(e,t){if(e.wr()&&t.wr())return A.newValue(gt);if(e.wr()||t.wr()||Et(e.value)||Et(t.value)||Je(e.value)!==Je(t.value))return A.newValue($e);switch(mn(e.value,t.value)){case"EQ":return A.newValue(gt);case"NOT_EQ":return A.newValue($e);case"NULL":return A.gr();default:re(44615,{left:e,right:t})}}}class kI extends gs{constructor(e){super(e),this.expr=e}Fr(e,t){switch(mn(e.value,t.value)){case"EQ":return A.newValue($e);case"NOT_EQ":case"TYPE_MISMATCH":return A.newValue(gt);case"NULL":return A.gr();default:re(44614,{left:e,right:t})}}}class xI extends gs{constructor(e){super(e),this.expr=e}Fr(e,t){return Je(e.value)!==Je(t.value)||Et(e.value)||Et(t.value)?A.newValue($e):A.newValue({booleanValue:mt(e.value,t.value)<0})}}class VI extends gs{constructor(e){super(e),this.expr=e}Fr(e,t){return Je(e.value)!==Je(t.value)||Et(e.value)||Et(t.value)?A.newValue($e):mn(e.value,t.value)==="EQ"?A.newValue(gt):A.newValue({booleanValue:mt(e.value,t.value)<0})}}class MI extends gs{constructor(e){super(e),this.expr=e}Fr(e,t){return Je(e.value)!==Je(t.value)||Et(e.value)||Et(t.value)?A.newValue($e):A.newValue({booleanValue:mt(e.value,t.value)>0})}}class GI extends gs{constructor(e){super(e),this.expr=e}Fr(e,t){return Je(e.value)!==Je(t.value)||Et(e.value)||Et(t.value)?A.newValue($e):mn(e.value,t.value)==="EQ"?A.newValue(gt):A.newValue({booleanValue:mt(e.value,t.value)>0})}}class UI{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class HI{constructor(e){this.expr=e}evaluate(e,t){var s;ee(this.expr.params.length===1,216);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return A.gr();case"ARRAY":{const i=((s=n.value.arrayValue)==null?void 0:s.values)??[];return A.newValue({arrayValue:{values:[...i].reverse()}})}default:return A.mr()}}}class JI{constructor(e){this.expr=e}evaluate(e,t){return ee(this.expr.params.length===2,52884),new Np(new x("eq_any",[this.expr.params[1],this.expr.params[0]])).evaluate(e,t)}}class jI{constructor(e){this.expr=e}evaluate(e,t){var u,c,h,d;ee(this.expr.params.length===2,1392);let n=!1;const s=se(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":n=!0;break;default:return A.mr()}const i=se(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return A.mr()}if(n)return A.gr();const o=((c=(u=i.value)==null?void 0:u.arrayValue)==null?void 0:c.values)??[],B=((d=(h=s.value)==null?void 0:h.arrayValue)==null?void 0:d.values)??[];for(const C of o){let g=!1;n=!1;for(const D of B){switch(It(C)&&It(D)?"EQ":mn(C,D)){case"EQ":g=!0;break;case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:re(44613,{value:D,search:C})}if(g)break}if(!g)return A.newValue($e)}return A.newValue(gt)}}class qI{constructor(e){this.expr=e}evaluate(e,t){var u,c,h,d;ee(this.expr.params.length===2,2680);let n=!1;const s=se(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":n=!0;break;default:return A.mr()}const i=se(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":n=!0;break;default:return A.mr()}if(n)return A.gr();const o=((c=(u=i.value)==null?void 0:u.arrayValue)==null?void 0:c.values)??[],B=((d=(h=s.value)==null?void 0:h.arrayValue)==null?void 0:d.values)??[];for(const C of B)for(const g of o)switch(It(C)&&It(g)?"EQ":mn(C,g)){case"EQ":return A.newValue(gt);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":n=!0;break;default:re(60403,{value:C,search:g})}return n?A.gr():A.newValue($e)}}class KI{constructor(e){this.expr=e}evaluate(e,t){var s,i,o;ee(this.expr.params.length===1,38605);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return A.gr();case"ARRAY":return A.newValue({integerValue:`${((o=(i=(s=n.value)==null?void 0:s.arrayValue)==null?void 0:i.values)==null?void 0:o.length)??0}`});default:return A.mr()}}}class zI{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class WI{constructor(e){this.expr=e}evaluate(e,t){var s,i;ee(this.expr.params.length===1,1508);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return A.gr();case"BYTES":{const o=(s=n.value)==null?void 0:s.bytesValue;if(typeof o=="string"){const B=He.fromBase64String(o).toUint8Array();return B.reverse(),A.newValue({bytesValue:He.fromUint8Array(B).toBase64()})}return A.newValue({bytesValue:new Uint8Array(o).reverse()})}case"STRING":{const o=(i=n.value)==null?void 0:i.stringValue,B=new Intl.__PRIVATE_Segmenter(void 0,{granularity:"grapheme"}).segment(o),u=Array.from(B,(c=>c.segment)).reverse();return A.newValue({stringValue:u.join("")})}default:return A.mr()}}}class $I{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class QI{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class YI{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===1,19400);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"NULL":return A.gr();case"STRING":{const s=(function(o){let B=0;for(let u=0;u<o.length;u++){const c=o.codePointAt(u);if(c===void 0)return;if(c<=65535)if(c>=55296&&c<=57343)if(c<=56319){const h=o.codePointAt(u+1);h!==void 0&&h>=56320&&h<=57343?(B+=1,u++):B+=1}else B+=1;else B+=1;else{if(!(c<=1114111))return;B+=1,u++}}return B})(n.value.stringValue);return s===void 0?A.mr():A.newValue({integerValue:s})}default:return A.mr()}}}class XI{constructor(e){this.expr=e}evaluate(e,t){var s,i;ee(this.expr.params.length===1,8486);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"BYTES":{const o=(s=n.value)==null?void 0:s.bytesValue;return typeof o=="string"?A.newValue({integerValue:He.fromBase64String(o).toUint8Array().length}):A.newValue({integerValue:new Uint8Array(o).length})}case"STRING":{const o=(function(u){let c=0;for(let h=0;h<u.length;h++){const d=u.codePointAt(h);if(d===void 0)return;if(d>=55296&&d<=57343){if(!(d<=56319))return;{const C=u.codePointAt(h+1);if(C===void 0||!(C>=56320&&C<=57343))return;c+=4,h++}}else if(d<=127)c+=1;else if(d<=2047)c+=2;else if(d<=65535)c+=3;else{if(!(d<=1114111))return;c+=4,h++}}return c})((i=n.value)==null?void 0:i.stringValue);return o===void 0?A.mr():A.newValue({integerValue:o})}case"NULL":return A.gr();default:return A.mr()}}}class ms{constructor(e){this.expr=e}evaluate(e,t){var o,B;ee(this.expr.params.length===2,39773,`${this.expr.name}() function should have exactly two parameters`);let n=!1;const s=se(this.expr.params[0]).evaluate(e,t);switch(s.type){case"STRING":break;case"NULL":n=!0;break;default:return A.mr()}const i=se(this.expr.params[1]).evaluate(e,t);switch(i.type){case"STRING":break;case"NULL":n=!0;break;default:return A.mr()}return n?A.gr():this.Or((o=s.value)==null?void 0:o.stringValue,(B=i.value)==null?void 0:B.stringValue)}}class ZI extends ms{Or(e,t){try{const n=(function(o){let B="";for(let u=0;u<o.length;u++){const c=o.charAt(u);switch(c){case"_":B+=".";break;case"%":B+=".*";break;case"\\":case".":case"*":case"?":case"+":case"^":case"$":case"|":case"(":case")":case"[":case"]":case"{":case"}":B+="\\"+c;break;default:B+=c}}return"^"+B+"$"})(t),s=Fu.compile(n);return A.newValue({booleanValue:s.matches(e)})}catch(n){return Mt(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${n}`),A.mr()}}}class eA extends ms{Or(e,t){try{const n=Fu.compile(t);return A.newValue({booleanValue:n.test(e)})}catch{return Mt(`Invalid regex pattern found in regex_contains: ${t}, returning error`),A.mr()}}}class tA extends ms{Or(e,t){try{return A.newValue({booleanValue:Fu.compile(t).matches(e)})}catch{return Mt(`Invalid regex pattern found in regex_match: ${t}, returning error`),A.mr()}}}class nA extends ms{Or(e,t){return A.newValue({booleanValue:e.includes(t)})}}class rA extends ms{Or(e,t){return A.newValue({booleanValue:e.startsWith(t)})}}class sA extends ms{Or(e,t){return A.newValue({booleanValue:e.endsWith(t)})}}class iA{constructor(e){this.expr=e}evaluate(e,t){var s,i;ee(this.expr.params.length===1,29079);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return A.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.toLowerCase()});case"NULL":return A.gr();default:return A.mr()}}}class oA{constructor(e){this.expr=e}evaluate(e,t){var s,i;ee(this.expr.params.length===1,60487);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return A.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.toUpperCase()});case"NULL":return A.gr();default:return A.mr()}}}class aA{constructor(e){this.expr=e}evaluate(e,t){var s,i;ee(this.expr.params.length===1,28544);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"STRING":return A.newValue({stringValue:(i=(s=n.value)==null?void 0:s.stringValue)==null?void 0:i.trim()});case"NULL":return A.gr();default:return A.mr()}}}class BA{constructor(e){this.expr=e}evaluate(e,t){const n=this.expr.params.map((o=>se(o).evaluate(e,t)));let s="",i=!1;for(const o of n)switch(o.type){case"STRING":s+=o.value.stringValue;break;case"NULL":i=!0;break;default:return A.mr()}return i?A.gr():A.newValue({stringValue:s})}}class uA{constructor(e){this.expr=e}evaluate(e,t){var o,B,u,c;ee(this.expr.params.length===2,4483);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"UNSET":return A.pr();case"MAP":break;default:return A.mr()}const s=se(this.expr.params[1]).evaluate(e,t);if(s.type!=="STRING")return A.mr();const i=(c=(B=(o=n.value)==null?void 0:o.mapValue)==null?void 0:B.fields)==null?void 0:c[(u=s.value)==null?void 0:u.stringValue];return i===void 0?A.pr():A.newValue(i)}}class tc{constructor(e){this.expr=e}evaluate(e,t){var c,h;ee(this.expr.params.length===2,25231,`${this.expr.name}() function should have exactly 2 params`);let n=!1;const s=se(this.expr.params[0]).evaluate(e,t);switch(s.type){case"VECTOR":break;case"NULL":n=!0;break;default:return A.mr()}const i=se(this.expr.params[1]).evaluate(e,t);switch(i.type){case"VECTOR":break;case"NULL":n=!0;break;default:return A.mr()}if(n)return A.gr();const o=XB(s.value),B=XB(i.value);if(o===void 0||B===void 0||((c=o.values)==null?void 0:c.length)!==((h=B.values)==null?void 0:h.length))return A.mr();const u=this.Mr(o,B);return u===void 0||isNaN(u)?A.mr():A.newValue({doubleValue:u})}}class cA extends tc{Mr(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return;let i=0,o=0,B=0;for(let c=0;c<n.length;c++){if(!zn(n[c])||!zn(s[c]))return;const h=Ye(n[c]),d=Ye(s[c]);i+=h*d,o+=h*h,B+=d*d}const u=Math.sqrt(o)*Math.sqrt(B);if(u!==0)return 1-Math.max(-1,Math.min(1,i/u))}}class lA extends tc{Mr(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return 0;let i=0;for(let o=0;o<n.length;o++){if(!zn(n[o])||!zn(s[o]))return;i+=Ye(n[o])*Ye(s[o])}return i}}class hA extends tc{Mr(e,t){const n=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(n.length===0)return 0;let i=0;for(let o=0;o<n.length;o++){if(!zn(n[o])||!zn(s[o]))return;const B=Ye(n[o]),u=Ye(s[o]);i+=Math.pow(B-u,2)}return Math.sqrt(i)}}class fA{constructor(e){this.expr=e}evaluate(e,t){var s;ee(this.expr.params.length===1,39044);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"VECTOR":{const i=XB(n.value);return A.newValue({integerValue:((s=i==null?void 0:i.values)==null?void 0:s.length)??0})}case"NULL":return A.gr();default:return A.mr()}}}const wi=BigInt(-62135596800),yi=BigInt(253402300799),Xo=BigInt(1e3),Jn=BigInt(1e6),dA=wi*Xo,CA=yi*Xo+BigInt(999),pA=wi*Jn,gA=yi*Jn+BigInt(999999);function nc(r){return r>=pA&&r<=gA}function Fp(r){return r>=wi&&r<=yi}function Ti(r,e){const t=BigInt(r);return!(t<wi||t>yi)&&!(e<0||e>=1e9)&&(t!==wi||e===0)&&!(t===yi&&e>999999999)}function Lp(r,e){return e<0?{seconds:r-1,nanos:e+1e9}:{seconds:r,nanos:e}}function rc(r){return BigInt(r.seconds)*Jn+BigInt(Math.trunc(r.nanoseconds/1e3))}class sc{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===1,49262,`${this.expr.name}() function should have exactly one parameter`);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"INT":return this.toTimestamp(BigInt(n.value.integerValue));case"NULL":return A.gr();default:return A.mr()}}}class mA extends sc{toTimestamp(e){if(!nc(e))return A.mr();let t=Number(e/Jn),n=Number(e%Jn*BigInt(1e3));const s=Lp(t,n);return t=s.seconds,n=s.nanos,Ti(t,n)?A.newValue({timestampValue:{seconds:t,nanos:n}}):A.mr()}}class EA extends sc{toTimestamp(e){if(!(function(o){return o>=dA&&o<=CA})(e))return A.mr();let t=Number(e/Xo),n=Number(e%Xo*BigInt(1e6));const s=Lp(t,n);return t=s.seconds,n=s.nanos,Ti(t,n)?A.newValue({timestampValue:{seconds:t,nanos:n}}):A.mr()}}class _A extends sc{toTimestamp(e){if(!Fp(e))return A.mr();const t=Number(e);return A.newValue({timestampValue:{seconds:t,nanos:0}})}}class ic{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===1,1265,`${this.expr.name}() function should have exactly one parameter`);const n=se(this.expr.params[0]).evaluate(e,t);switch(n.type){case"TIMESTAMP":break;case"NULL":return A.gr();default:return A.mr()}const s=Ju(n.value.timestampValue);return Ti(s.seconds,s.nanoseconds)?this.Nr(s):A.mr()}}class DA extends ic{Nr(e){const t=rc(e);return nc(t)?A.newValue({integerValue:`${t.toString()}`}):A.mr()}}class wA extends ic{Nr(e){const t=rc(e),n=t/BigInt(1e3),s=t%BigInt(1e3);return n>BigInt(0)||s===BigInt(0)?A.newValue({integerValue:n.toString()}):A.newValue({integerValue:(n-BigInt(1)).toString()})}}class yA extends ic{Nr(e){const t=BigInt(e.seconds);return Fp(t)?A.newValue({integerValue:t.toString()}):A.mr()}}class kp{constructor(e){this.expr=e}evaluate(e,t){ee(this.expr.params.length===3,2775,`${this.expr.name}() function should have exactly 3 parameters`);let n=!1;const s=se(this.expr.params[0]).evaluate(e,t);switch(s.type){case"TIMESTAMP":break;case"NULL":n=!0;break;default:return A.mr()}const i=se(this.expr.params[1]).evaluate(e,t);let o;switch(i.type){case"STRING":if(o=(function(v){switch(v){case"microsecond":return"microsecond";case"millisecond":return"millisecond";case"second":return"second";case"minute":return"minute";case"hour":return"hour";case"day":return"day";default:return}})(i.value.stringValue),o===void 0)return A.mr();break;case"NULL":n=!0;break;default:return A.mr()}const B=se(this.expr.params[2]).evaluate(e,t);switch(B.type){case"INT":break;case"NULL":n=!0;break;default:return A.mr()}if(n)return A.gr();const u=BigInt(B.value.integerValue);let c;try{switch(o){case"microsecond":c=u;break;case"millisecond":c=u*BigInt(1e3);break;case"second":c=u*BigInt(1e6);break;case"minute":c=u*BigInt(6e7);break;case"hour":c=u*BigInt(36e8);break;case"day":c=u*BigInt(864e8);break;default:return A.mr()}if(o!=="microsecond"&&u!==BigInt(0)&&c/u!==BigInt(this.Lr(o)))return A.mr()}catch(J){return Mt(`Error during timestamp arithmetic: ${J}`),A.mr()}const h=Ju(s.value.timestampValue);if(!Ti(h.seconds,h.nanoseconds))return A.mr();const d=rc(h),C=this.Br(d,c);if(!nc(C))return A.mr();const g=Number(C/Jn),D=C%Jn,P=Number((D<0?D+Jn:D)*BigInt(1e3)),N=D<0?g-1:g;return Ti(N,P)?A.newValue({timestampValue:{seconds:N,nanos:P}}):A.mr()}Lr(e){switch(e){case"millisecond":return 1e3;case"second":return 1e6;case"minute":return 6e7;case"hour":return 36e8;case"day":return 864e8;default:return 1}}}class TA extends kp{Br(e,t){return e+t}}class IA extends kp{Br(e,t){return e-t}}function Ii(r){if((r=Op(r))instanceof Cs)return`fld(${r.fieldName})`;if(r instanceof ps)return`cst(${(function(t){return t===null?"null":typeof t=="number"?t.toString():typeof t=="string"?`"${t}"`:t instanceof Fe?`ref(${t.path})`:t instanceof pt?`vec(${JSON.stringify(t)})`:JSON.stringify(t)})(r.value)})`;if(r instanceof x)return`fn(${r.name},[${r.params.map(Ii).join(",")}])`;if(r.expressionType==="ListOfExpressions")return`list([${r.cr.map(Ii).join(",")}])`;throw new Error(`Unrecognized expr ${JSON.stringify(r,null,2)}`)}function AA(r){if(r instanceof bp)return`${r._name}(${po(r.fields)})`;if(r instanceof Pp){let e=`${r._name}(${po(r.accumulators)})`;return r.groups.size>0&&(e+=`grouping(${po(r.groups)})`),e}if(r instanceof Sp)return`${r._name}(${po(r.groups)})`;if(r instanceof Ia)return`${r._name}(${r.hr})`;if(r instanceof Aa)return`${r._name}(${r.collectionId})`;if(r instanceof Qu)return`${r._name}()`;if(r instanceof Yu)return`${r._name}(${r.Tr.sort()})`;if(r instanceof Ra)return`${r._name}(${Ii(r.condition)})`;if(r instanceof Ar)return`${r._name}(${r.limit})`;if(r instanceof un)return`${r._name}(${(function(t){return t.map((n=>`${Ii(n.expr)}${n.direction}`)).join(",")})(r.orderings)})`;throw new Error(`Unrecognized stage ${r._name}`)}function po(r){return`${Array.from(r.entries()).sort().map((([e,t])=>`${e}=${Ii(t)}`)).join(",")}`}function fn(r){return r.stages.map((e=>AA(e))).join("|")}function xp(r,e){return fn(r)===fn(e)}function qe(r){return r instanceof at}function Df(r){return qe(r)?fn(r):Xs(r)}function Vp(r){return qe(r)?fn(r):(function(t){return`${zC(Xt(t))}|lt:${t.limitType}`})(r)}function Pa(r,e){return r instanceof at&&e instanceof at?xp(r,e):!(r instanceof at&&!(e instanceof at)||!(r instanceof at)&&e instanceof at)&&Jy(r,e)}function Mp(r){return cr(r)?fn(r):zC(r)}function Gp(r,e){return r instanceof at&&e instanceof at?xp(r,e):!(r instanceof at&&!(e instanceof at)||!(r instanceof at)&&e instanceof at)&&WC(r,e)}function RA(r,e){const t=(function(s){let i=!1;const o=[];for(const B of s)if(B instanceof un)if(i=!0,B.orderings.some((u=>u.expr instanceof Cs&&u.expr.fieldName===Kt)))o.push(B);else{const u=B.orderings.map((c=>c));u.push(So(Kt).ascending()),o.push(new un(u,{}))}else B instanceof Ar&&(i||(o.push(new un([So(Kt).ascending()],{})),i=!0)),o.push(B);return i||o.push(new un([So(Kt).ascending()],{})),o})(r.stages);if(r.userDataReader){const n=r.userDataReader.createContext(3,"toCorePipeline");t.forEach((s=>s._readUserData(n)))}return new at(r.userDataReader.serializer,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vA{constructor(e,t,n,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&yy(i,e,n[s])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=Qs(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=Qs(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=ep();return this.mutations.forEach((s=>{const i=e.get(s.key),o=i.overlayedDocument;let B=this.applyToLocalView(o,i.mutatedFields);B=t.has(s.key)?null:B;const u=VC(o,B);u!==null&&n.set(s.key,u),o.isValidDocument()||o.convertToNoDocument(oe.min())})),n}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),ce())}isEqual(e){return this.batchId===e.batchId&&Zr(this.mutations,e.mutations,((t,n)=>Yh(t,n)))&&Zr(this.baseMutations,e.baseMutations,((t,n)=>Yh(t,n)))}}class oc{constructor(e,t,n,s){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=s}static from(e,t,n){ee(e.mutations.length===n.length,58842,{Ur:e.mutations.length,kr:n.length});let s=(function(){return Wy})();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,n[o].version);return new oc(e,t,n,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Up="";function bA(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=wf(e)),e=PA(r.get(t),e);return wf(e)}function PA(r,e){let t=e;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":t+="";break;case Up:t+="";break;default:t+=i}}return t}function wf(r){return r+Up+""}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SA{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cn{constructor(e,t,n,s,i=oe.min(),o=oe.min(),B=He.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=B,this.expectedCount=u}withSequenceNumber(e){return new cn(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new cn(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new cn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new cn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OA{constructor(e){this.$r=e}}function NA(r){const e=lT({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?$o(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class FA{constructor(){this.Zi=new LA}addToCollectionParentIndex(e,t){return this.Zi.add(t),G.resolve()}getCollectionParents(e,t){return G.resolve(this.Zi.getEntries(t))}addFieldIndex(e,t){return G.resolve()}deleteFieldIndex(e,t){return G.resolve()}deleteAllFieldIndexes(e){return G.resolve()}createTargetIndexes(e,t){return G.resolve()}getDocumentsMatchingTarget(e,t){return G.resolve(null)}getIndexType(e,t){return G.resolve(0)}getFieldIndexes(e,t){return G.resolve([])}getNextCollectionGroupToUpdate(e){return G.resolve(null)}getMinOffset(e,t){return G.resolve(Wn.min())}getMinOffsetFromCollectionGroup(e,t){return G.resolve(Wn.min())}updateCollectionGroup(e,t,n){return G.resolve()}updateIndexEntries(e,t){return G.resolve()}}class LA{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t]||new Ue(ge.comparator),i=!s.has(n);return this.index[t]=s.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t];return s&&s.has(n)}getEntries(e){return(this.index[e]||new Ue(ge.comparator)).toArray()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yn{constructor(e){this.ys=e}next(){return this.ys+=2,this.ys}static ws(){return new Yn(0)}static bs(){return new Yn(-1)}}// Copyright 2024 Google LLC* @license
function Hp(r,e){var n;let t=e;for(const s of r.stages)t=xA({serializer:r.serializer,serverTimestampBehavior:(n=r.listenOptions)==null?void 0:n.serverTimestampBehavior},s,t);return t}function Sa(r,e){return Hp(r,[e]).length>0}function kA(r,e){return qe(r)?Sa(r,e):Da(r,e)}function xA(r,e,t){if(e instanceof Ia)return(function(s,i,o){return o.filter((B=>B.isFoundDocument()&&`/${B.key.getCollectionPath().canonicalString()}`===i.hr))})(0,e,t);if(e instanceof Ra)return(function(s,i,o){return o.filter((B=>{const u=ni(se(i.condition).evaluate(s,B));return u!==void 0&&Nt(u,gt)}))})(r,e,t);if(e instanceof Aa)return(function(s,i,o){return o.filter((B=>B.isFoundDocument()&&B.key.getCollectionPath().lastSegment()===i.collectionId))})(0,e,t);if(e instanceof Qu)return(function(s,i,o){return o.filter((B=>B.isFoundDocument()))})(0,0,t);if(e instanceof Yu)return(function(s,i,o){return o.filter((B=>B.isFoundDocument()&&i.Pr.has(B.key.path.toStringWithLeadingSlash())))})(0,e,t);if(e instanceof Ar)return(function(s,i,o){return o.slice(0,i.limit)})(0,e,t);if(e instanceof un)return(function(s,i,o){const B=i.orderings.map((u=>({Ms:se(u.expr),direction:u.direction})));return[...o].sort(((u,c)=>{for(const{Ms:h,direction:d}of B){const C=ni(h.evaluate(s,u)),g=ni(h.evaluate(s,c)),D=mt(C??ts,g??ts);if(D!==0)return d==="ascending"?D:-D}return 0}))})(r,e,t);throw new Error(`Unknown stage: ${e._name}`)}function ou(r){const e=(function(n){for(let s=n.stages.length-1;s>=0;s--){const i=n.stages[s];if(i instanceof un)return i.orderings}throw new Error("Pipeline must contain at least one Sort stage")})(r);return(t,n)=>{for(const s of e){const i=ni(se(s.expr).evaluate({serializer:r.serializer},t)),o=ni(se(s.expr).evaluate({serializer:r.serializer},n)),B=mt(i||ts,o||ts);if(B!==0)return s.direction==="ascending"?B:-B}return 0}}function AB(r){for(let e=r.stages.length-1;e>=0;e--){const t=r.stages[e];if(t instanceof Ar)return{limit:t.limit}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VA{constructor(){this.changes=new Or((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,tt.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?G.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class MA{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GA{constructor(e,t,n,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=s}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(n=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(n!==null&&Qs(n.mutation,s,xt.empty(),Ee.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.getLocalViewOfDocuments(e,n,ce()).next((()=>n))))}getLocalViewOfDocuments(e,t,n=ce()){const s=Fn();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,n).next((i=>{let o=jr();return i.forEach(((B,u)=>{o=o.insert(B,u.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){const n=Fn();return this.populateOverlays(e,n,t).next((()=>this.computeViews(e,t,n,ce())))}populateOverlays(e,t,n){const s=[];return n.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((o,B)=>{t.set(o,B)}))}))}computeViews(e,t,n,s){let i=dt();const o=Zs(),B=(function(){return Zs()})();return t.forEach(((u,c)=>{const h=n.get(c.key);s.has(c.key)&&(h===void 0||h.mutation instanceof Sr)?i=i.insert(c.key,c):h!==void 0?(o.set(c.key,h.mutation.getFieldMask()),Qs(h.mutation,c,h.mutation.getFieldMask(),Ee.now())):o.set(c.key,xt.empty())})),this.recalculateAndSaveOverlays(e,i).next((u=>(u.forEach(((c,h)=>o.set(c,h))),t.forEach(((c,h)=>B.set(c,new MA(h,o.get(c)??null)))),B)))}recalculateAndSaveOverlays(e,t){const n=Zs();let s=new be(((o,B)=>o-B)),i=ce();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(const B of o)B.keys().forEach((u=>{const c=t.get(u);if(c===null)return;let h=n.get(u)||xt.empty();h=B.applyToLocalView(c,h),n.set(u,h);const d=(s.get(B.batchId)||ce()).add(u);s=s.insert(B.batchId,d)}))})).next((()=>{const o=[],B=s.getReverseIterator();for(;B.hasNext();){const u=B.getNext(),c=u.key,h=u.value,d=ep();h.forEach((C=>{if(!i.has(C)){const g=VC(t.get(C),n.get(C));g!==null&&d.set(C,g),i=i.add(C)}})),o.push(this.documentOverlayCache.saveOverlays(e,c,d))}return G.waitFor(o)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.recalculateAndSaveOverlays(e,n)))}getDocumentsMatchingQuery(e,t,n,s){return qe(t)?this.getDocumentsMatchingPipeline(e,t,n,s):Gy(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):QC(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,s):this.getDocumentsMatchingCollectionQuery(e,t,n,s)}getNextDocuments(e,t,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,s).next((i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,s-i.size):G.resolve(Fn());let B=Ei,u=i;return o.next((c=>G.forEach(c,((h,d)=>(B<d.largestBatchId&&(B=d.largestBatchId),i.get(h)?G.resolve():this.remoteDocumentCache.getEntry(e,h).next((C=>{u=u.insert(h,C)}))))).next((()=>this.populateOverlays(e,c,i))).next((()=>this.computeViews(e,u,c,ce()))).next((h=>({batchId:B,changes:ZC(h)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new te(t)).next((n=>{let s=jr();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,n,s){const i=t.collectionGroup;let o=jr();return this.indexManager.getCollectionParents(e,i).next((B=>G.forEach(B,(u=>{const c=(function(d,C){return new ls(C,null,d.explicitOrderBy.slice(),d.filters.slice(),d.limit,d.limitType,d.startAt,d.endAt)})(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,c,n,s).next((h=>{h.forEach(((d,C)=>{o=o.insert(d,C)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s)))).next((o=>this.retrieveMatchingLocalDocuments(i,o,(B=>Da(t,B)))))}getDocumentsMatchingPipeline(e,t,n,s){if(Hn(t)==="collection_group"){const i=Zu(t);let o=jr();return this.indexManager.getCollectionParents(e,i).next((B=>G.forEach(B,(u=>{const c=(function(d,C){const g=d.stages.map((D=>D instanceof Aa?new Ia(C.canonicalString(),{}):D));return new at(d.serializer,g)})(t,u.child(i));return this.getDocumentsMatchingPipeline(e,c,n,s).next((h=>{h.forEach(((d,C)=>{o=o.insert(d,C)}))}))})).next((()=>o))))}{let i;return this.getOverlaysForPipeline(e,t,n.largestBatchId).next((o=>{switch(i=o,Hn(t)){case"collection":return this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s);case"documents":let B=ce();for(const u of iu(t))B=B.add(te.fromPath(u));return this.remoteDocumentCache.getEntries(e,B);case"database":return this.remoteDocumentCache.getAllEntries(e);default:throw new W("invalid-argument",`Invalid pipeline source to execute offline: ${fn(t)}`)}})).next((o=>this.retrieveMatchingLocalDocuments(i,o,(B=>Sa(t,B)))))}}retrieveMatchingLocalDocuments(e,t,n){e.forEach(((i,o)=>{const B=o.getKey();t.get(B)===null&&(t=t.insert(B,tt.newInvalidDocument(B)))}));let s=jr();return t.forEach(((i,o)=>{const B=e.get(i);B!==void 0&&Qs(B.mutation,o,xt.empty(),Ee.now()),n(o)&&(s=s.insert(i,o))})),s}getOverlaysForPipeline(e,t,n){switch(Hn(t)){case"collection":return this.documentOverlayCache.getOverlaysForCollection(e,ge.fromString(va(t)),n);case"collection_group":throw new W("invalid-argument",`Unexpected collection group pipeline: ${fn(t)}`);case"documents":return this.documentOverlayCache.getOverlays(e,iu(t).map((s=>te.fromPath(s))));case"database":return this.documentOverlayCache.getAllOverlays(e,n);default:throw new W("invalid-argument",`Failed to get overlays for pipeline: ${fn(t)}`)}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UA{constructor(e){this.serializer=e,this.Qs=new Map,this.Ws=new Map}getBundleMetadata(e,t){return G.resolve(this.Qs.get(t))}saveBundleMetadata(e,t){return this.Qs.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:Zt(s.createTime)}})(t)),G.resolve()}getNamedQuery(e,t){return G.resolve(this.Ws.get(t))}saveNamedQuery(e,t){return this.Ws.set(t.name,(function(s){return{name:s.name,query:NA(s.bundledQuery),readTime:Zt(s.readTime)}})(t)),G.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HA{constructor(){this.overlays=new be(te.comparator),this.Gs=new Map}getOverlay(e,t){return G.resolve(this.overlays.get(t))}getOverlays(e,t){const n=Fn();return G.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}getAllOverlays(e,t){const n=Fn();return this.overlays.forEach(((s,i)=>{i.largestBatchId>t&&n.set(s,i)})),G.resolve(n)}saveOverlays(e,t,n){return n.forEach(((s,i)=>{this.Zr(e,t,i)})),G.resolve()}removeOverlaysForBatchId(e,t,n){const s=this.Gs.get(n);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Gs.delete(n)),G.resolve()}getOverlaysForCollection(e,t,n){const s=Fn(),i=t.length+1,o=new te(t.child("")),B=this.overlays.getIteratorFrom(o);for(;B.hasNext();){const u=B.getNext().value,c=u.getKey();if(!t.isPrefixOf(c.path))break;c.path.length===i&&u.largestBatchId>n&&s.set(u.getKey(),u)}return G.resolve(s)}getOverlaysForCollectionGroup(e,t,n,s){let i=new be(((c,h)=>c-h));const o=this.overlays.getIterator();for(;o.hasNext();){const c=o.getNext().value;if(c.getKey().getCollectionGroup()===t&&c.largestBatchId>n){let h=i.get(c.largestBatchId);h===null&&(h=Fn(),i=i.insert(c.largestBatchId,h)),h.set(c.getKey(),c)}}const B=Fn(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((c,h)=>B.set(c,h))),!(B.size()>=s)););return G.resolve(B)}Zr(e,t,n){const s=this.overlays.get(n.key);if(s!==null){const o=this.Gs.get(s.largestBatchId).delete(n.key);this.Gs.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new SA(t,n));let i=this.Gs.get(t);i===void 0&&(i=ce(),this.Gs.set(t,i)),this.Gs.set(t,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JA{constructor(){this.sessionToken=He.EMPTY_BYTE_STRING}getSessionToken(e){return G.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,G.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ac{constructor(){this.zs=new Ue(We.js),this.Hs=new Ue(We.Js)}isEmpty(){return this.zs.isEmpty()}addReference(e,t){const n=new We(e,t);this.zs=this.zs.add(n),this.Hs=this.Hs.add(n)}Ys(e,t){e.forEach((n=>this.addReference(n,t)))}removeReference(e,t){this.Zs(new We(e,t))}Xs(e,t){e.forEach((n=>this.removeReference(n,t)))}e_(e){const t=new te(new ge([])),n=new We(t,e),s=new We(t,e+1),i=[];return this.Hs.forEachInRange([n,s],(o=>{this.Zs(o),i.push(o.key)})),i}t_(){this.zs.forEach((e=>this.Zs(e)))}Zs(e){this.zs=this.zs.delete(e),this.Hs=this.Hs.delete(e)}n_(e){const t=new te(new ge([])),n=new We(t,e),s=new We(t,e+1);let i=ce();return this.Hs.forEachInRange([n,s],(o=>{i=i.add(o.key)})),i}containsKey(e){const t=new We(e,0),n=this.zs.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class We{constructor(e,t){this.key=e,this.r_=t}static js(e,t){return te.comparator(e.key,t.key)||le(e.r_,t.r_)}static Js(e,t){return le(e.r_,t.r_)||te.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jA{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Gr=1,this.i_=new Ue(We.js)}checkEmpty(e){return G.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,s){const i=this.Gr;this.Gr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new vA(i,t,n,s);this.mutationQueue.push(o);for(const B of s)this.i_=this.i_.add(new We(B.key,i)),this.indexManager.addToCollectionParentIndex(e,B.key.path.popLast());return G.resolve(o)}lookupMutationBatch(e,t){return G.resolve(this.s_(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=this.__(n),i=s<0?0:s;return G.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return G.resolve(this.mutationQueue.length===0?xu:this.Gr-1)}getAllMutationBatches(e){return G.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new We(t,0),s=new We(t,Number.POSITIVE_INFINITY),i=[];return this.i_.forEachInRange([n,s],(o=>{const B=this.s_(o.r_);i.push(B)})),G.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new Ue(le);return t.forEach((s=>{const i=new We(s,0),o=new We(s,Number.POSITIVE_INFINITY);this.i_.forEachInRange([i,o],(B=>{n=n.add(B.r_)}))})),G.resolve(this.o_(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1;let i=n;te.isDocumentKey(i)||(i=i.child(""));const o=new We(new te(i),0);let B=new Ue(le);return this.i_.forEachWhile((u=>{const c=u.key.path;return!!n.isPrefixOf(c)&&(c.length===s&&(B=B.add(u.r_)),!0)}),o),G.resolve(this.o_(B))}o_(e){const t=[];return e.forEach((n=>{const s=this.s_(n);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){ee(this.a_(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.i_;return G.forEach(t.mutations,(s=>{const i=new We(s.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.i_=n}))}Hr(e){}containsKey(e,t){const n=new We(t,0),s=this.i_.firstAfterOrEqual(n);return G.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,G.resolve()}a_(e,t){return this.__(e)}__(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}s_(e){const t=this.__(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qA{constructor(e){this.u_=e,this.docs=(function(){return new be(te.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,s=this.docs.get(n),i=s?s.size:0,o=this.u_(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return G.resolve(n?n.document.mutableCopy():tt.newInvalidDocument(t))}getEntries(e,t){let n=dt();return t.forEach((s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():tt.newInvalidDocument(s))})),G.resolve(n)}getAllEntries(e){let t=dt();return this.docs.forEach(((n,s)=>{t=t.insert(n,s.document)})),G.resolve(t)}getDocumentsMatchingQuery(e,t,n,s){let i,o;qe(t)?(i=ge.fromString(va(t)),o=h=>Sa(t,h)):(i=t.path,o=h=>Da(t,h));let B=dt();const u=new te(i.child("__id-9223372036854775808__")),c=this.docs.getIteratorFrom(u);for(;c.hasNext();){const{key:h,value:{document:d}}=c.getNext();if(!i.isPrefixOf(h.path))break;h.path.length>i.length+1||xy(ky(d),n)<=0||(s.has(d.key)||o(d))&&(B=B.insert(d.key,d.mutableCopy()))}return G.resolve(B)}getAllFromCollectionGroup(e,t,n,s){re(9500)}c_(e,t){return G.forEach(this.docs,(n=>t(n)))}newChangeBuffer(e){return new KA(this)}getSize(e){return G.resolve(this.size)}}class KA extends VA{constructor(e){super(),this.$s=e}applyChanges(e){const t=[];return this.changes.forEach(((n,s)=>{s.isValidDocument()?t.push(this.$s.addEntry(e,s)):this.$s.removeEntry(n)})),G.waitFor(t)}getFromCache(e,t){return this.$s.getEntry(e,t)}getAllFromCache(e,t){return this.$s.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zA{constructor(e){this.persistence=e,this.l_=new Or((t=>Mp(t)),Gp),this.lastRemoteSnapshotVersion=oe.min(),this.highestTargetId=0,this.E_=0,this.h_=new ac,this.targetCount=0,this.T_=Yn.ws()}forEachTarget(e,t){return this.l_.forEach(((n,s)=>t(s))),G.resolve()}getLastRemoteSnapshotVersion(e){return G.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return G.resolve(this.E_)}allocateTargetId(e){return this.highestTargetId=this.T_.next(),G.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.E_&&(this.E_=t),G.resolve()}Ds(e){this.l_.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.T_=new Yn(t),this.highestTargetId=t),e.sequenceNumber>this.E_&&(this.E_=e.sequenceNumber)}addTargetData(e,t){return this.Ds(t),this.targetCount+=1,G.resolve()}updateTargetData(e,t){return this.Ds(t),G.resolve()}removeTargetData(e,t){return this.l_.delete(t.target),this.h_.e_(t.targetId),this.targetCount-=1,G.resolve()}removeTargets(e,t,n){let s=0;const i=[];return this.l_.forEach(((o,B)=>{B.sequenceNumber<=t&&n.get(B.targetId)===null&&(this.l_.delete(o),i.push(this.removeMatchingKeysForTargetId(e,B.targetId)),s++)})),G.waitFor(i).next((()=>s))}getTargetCount(e){return G.resolve(this.targetCount)}getTargetData(e,t){const n=this.l_.get(t)||null;return G.resolve(n)}addMatchingKeys(e,t,n){return this.h_.Ys(t,n),G.resolve()}removeMatchingKeys(e,t,n){this.h_.Xs(t,n);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((o=>{i.push(s.markPotentiallyOrphaned(e,o))})),G.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.h_.e_(t),G.resolve()}getMatchingKeysForTargetId(e,t){const n=this.h_.n_(t);return G.resolve(n)}containsKey(e,t){return G.resolve(this.h_.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jp{constructor(e,t){this.P_={},this.overlays={},this.I_=new ya(0),this.R_=!1,this.R_=!0,this.A_=new JA,this.referenceDelegate=e(this),this.V_=new zA(this),this.indexManager=new FA,this.remoteDocumentCache=(function(s){return new qA(s)})((n=>this.referenceDelegate.d_(n))),this.serializer=new OA(t),this.f_=new UA(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.R_=!1,Promise.resolve()}get started(){return this.R_}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new HA,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.P_[e.toKey()];return n||(n=new jA(t,this.referenceDelegate),this.P_[e.toKey()]=n),n}getGlobalsCache(){return this.A_}getTargetCache(){return this.V_}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.f_}runTransaction(e,t,n){X("MemoryPersistence","Starting transaction:",e);const s=new WA(this.I_.next());return this.referenceDelegate.m_(),n(s).next((i=>this.referenceDelegate.p_(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}g_(e,t){return G.or(Object.values(this.P_).map((n=>()=>n.containsKey(e,t))))}}class WA extends VT{constructor(e){super(),this.currentSequenceNumber=e}}class Bc{constructor(e){this.persistence=e,this.y_=new ac,this.w_=null}static b_(e){return new Bc(e)}get S_(){if(this.w_)return this.w_;throw re(60996)}addReference(e,t,n){return this.y_.addReference(n,t),this.S_.delete(n.toString()),G.resolve()}removeReference(e,t,n){return this.y_.removeReference(n,t),this.S_.add(n.toString()),G.resolve()}markPotentiallyOrphaned(e,t){return this.S_.add(t.toString()),G.resolve()}removeTarget(e,t){this.y_.e_(t.targetId).forEach((s=>this.S_.add(s.toString())));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.S_.add(i.toString())))})).next((()=>n.removeTargetData(e,t)))}m_(){this.w_=new Set}p_(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return G.forEach(this.S_,(n=>{const s=te.fromPath(n);return this.v_(e,s).next((i=>{i||t.removeEntry(s,oe.min())}))})).next((()=>(this.w_=null,t.apply(e))))}updateLimboDocument(e,t){return this.v_(e,t).next((n=>{n?this.S_.delete(t.toString()):this.S_.add(t.toString())}))}d_(e){return 0}v_(e,t){return G.or([()=>G.resolve(this.y_.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.g_(e,t)])}}class Zo{constructor(e,t){this.persistence=e,this.D_=new Or((n=>bA(n.path)),((n,s)=>n.isEqual(s))),this.garbageCollector=jT(this,t)}static b_(e,t){return new Zo(e,t)}m_(){}p_(e){return G.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}ir(e){const t=this.Cs(e);return this.persistence.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}Cs(e){let t=0;return this.sr(e,(n=>{t++})).next((()=>t))}sr(e,t){return G.forEach(this.D_,((n,s)=>this.Os(e,n,s).next((i=>i?G.resolve():t(s)))))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.c_(e,(o=>this.Os(e,o,t).next((B=>{B||(n++,i.removeEntry(o,oe.min()))})))).next((()=>i.apply(e))).next((()=>n))}markPotentiallyOrphaned(e,t){return this.D_.set(t,e.currentSequenceNumber),G.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.D_.set(n,e.currentSequenceNumber),G.resolve()}removeReference(e,t,n){return this.D_.set(n,e.currentSequenceNumber),G.resolve()}updateLimboDocument(e,t){return this.D_.set(t,e.currentSequenceNumber),G.resolve()}d_(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Ro(e.data.value)),t}Os(e,t,n){return G.or([()=>this.persistence.g_(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.D_.get(t);return G.resolve(s!==void 0&&s>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uc{constructor(e,t,n,s){this.targetId=e,this.fromCache=t,this.Vo=n,this.fo=s}static mo(e,t){let n=ce(),s=ce();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new uc(e,t.fromCache,n,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $A(r,e){return te.comparator(r.key,e.key)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QA{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YA{constructor(){this.po=!1,this.yo=!1,this.wo=100,this.bo=(function(){return Am()?8:MT(nt())>0?6:4})()}initialize(e,t){this.So=e,this.indexManager=t,this.po=!0}getDocumentsMatchingQuery(e,t,n,s){const i={result:null};return this.vo(e,t).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.Do(e,t,s,n).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;const o=new QA;return this.xo(e,t,o).next((B=>{if(i.result=B,this.yo)return this.Co(e,t,o,B.size)}))})).next((()=>i.result))}Co(e,t,n,s){return qe(t)?G.resolve():n.documentReadCount<this.wo?(Hr()<=he.DEBUG&&X("QueryEngine","SDK will not create cache indexes for query:",Xs(t),"since it only creates cache indexes for collection contains","more than or equal to",this.wo,"documents"),G.resolve()):(Hr()<=he.DEBUG&&X("QueryEngine","Query:",Xs(t),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.bo*s?(Hr()<=he.DEBUG&&X("QueryEngine","The SDK decides to create cache indexes for query:",Xs(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Xt(t))):G.resolve())}vo(e,t){if(qe(t))return G.resolve(null);let n=t;if(rf(n))return G.resolve(null);let s=Xt(n);return this.indexManager.getIndexType(e,s).next((i=>i===0?null:(n.limit!==null&&i===1&&(n=$o(n,null,"F"),s=Xt(n)),this.indexManager.getDocumentsMatchingTarget(e,s).next((o=>{const B=ce(...o);return this.So.getDocuments(e,B).next((u=>this.indexManager.getMinOffset(e,s).next((c=>{const h=this.Fo(n,u);return this.Oo(n,h,B,c.readTime)?this.vo(e,$o(n,null,"F")):this.Mo(e,h,n,c)}))))})))))}Do(e,t,n,s){return(qe(t)?(function(o){for(const B of o.stages){if(B instanceof Ar||B instanceof _f)return!1;if(B instanceof Ra){if(B.condition instanceof Ap&&B.condition._expr.name==="exists"&&B.condition._expr.params[0]instanceof Cs&&B.condition._expr.params[0].fieldName===Kt)continue;return!1}}return!0})(t):rf(t))||s.isEqual(oe.min())?G.resolve(null):this.So.getDocuments(e,n).next((i=>{const o=this.Fo(t,i);return this.Oo(t,o,n,s)?G.resolve(null):(Hr()<=he.DEBUG&&X("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Df(t)),this.Mo(e,o,t,Ly(s,Ei)).next((B=>B)))}))}Fo(e,t){let n,s;return qe(e)?(n=new Ue($A),s=i=>Sa(e,i)):(n=new Ue(Uu(e)),s=i=>Da(e,i)),t.forEach(((i,o)=>{s(o)&&(n=n.add(o))})),n}Oo(e,t,n,s){if(qe(e))return(function(B){return B.stages.some((u=>u instanceof Ar||u instanceof _f))})(e);if(e.limit===null)return!1;if(n.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}xo(e,t,n){return Hr()<=he.DEBUG&&X("QueryEngine","Using full collection scan to execute query:",Df(t)),this.So.getDocumentsMatchingQuery(e,t,Wn.min(),n)}Mo(e,t,n,s){return this.So.getDocumentsMatchingQuery(e,n,s).next((i=>(t.forEach((o=>{i=i.insert(o.key,o)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cc="LocalStore",XA=3e8;class ZA{constructor(e,t,n,s){this.persistence=e,this.No=t,this.serializer=s,this.Lo=new be(le),this.Bo=new Or((i=>Mp(i)),Gp),this.Uo=new Map,this.ko=e.getRemoteDocumentCache(),this.V_=e.getTargetCache(),this.f_=e.getBundleCache(),this.qo(n)}qo(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new GA(this.ko,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.ko.setIndexManager(this.indexManager),this.No.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Lo)))}}function eR(r,e,t,n){return new ZA(r,e,t,n)}async function jp(r,e){const t=ae(r);return await t.persistence.runTransaction("Handle user change","readonly",(n=>{let s;return t.mutationQueue.getAllMutationBatches(n).next((i=>(s=i,t.qo(e),t.mutationQueue.getAllMutationBatches(n)))).next((i=>{const o=[],B=[];let u=ce();for(const c of s){o.push(c.batchId);for(const h of c.mutations)u=u.add(h.key)}for(const c of i){B.push(c.batchId);for(const h of c.mutations)u=u.add(h.key)}return t.localDocuments.getDocuments(n,u).next((c=>({$o:c,removedBatchIds:o,addedBatchIds:B})))}))}))}function tR(r,e){const t=ae(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(n=>{const s=e.batch.keys(),i=t.ko.newChangeBuffer({trackRemovals:!0});return(function(B,u,c,h){const d=c.batch,C=d.keys();let g=G.resolve();return C.forEach((D=>{g=g.next((()=>h.getEntry(u,D))).next((P=>{const N=c.docVersions.get(D);ee(N!==null,48541),P.version.compareTo(N)<0&&(d.applyToRemoteDocument(P,c),P.isValidDocument()&&(P.setReadTime(c.commitVersion),h.addEntry(P)))}))})),g.next((()=>B.mutationQueue.removeMutationBatch(u,d)))})(t,n,e,i).next((()=>i.apply(n))).next((()=>t.mutationQueue.performConsistencyCheck(n))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(n,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,(function(B){let u=ce();for(let c=0;c<B.mutationResults.length;++c)B.mutationResults[c].transformResults.length>0&&(u=u.add(B.batch.mutations[c].key));return u})(e)))).next((()=>t.localDocuments.getDocuments(n,s)))}))}function qp(r){const e=ae(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.V_.getLastRemoteSnapshotVersion(t)))}function nR(r,e){const t=ae(r),n=e.snapshotVersion;let s=t.Lo;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const o=t.ko.newChangeBuffer({trackRemovals:!0});s=t.Lo;const B=[];e.targetChanges.forEach(((h,d)=>{const C=s.get(d);if(!C)return;B.push(t.V_.removeMatchingKeys(i,h.removedDocuments,d).next((()=>t.V_.addMatchingKeys(i,h.addedDocuments,d))));let g=C.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(d)!==null?g=g.withResumeToken(He.EMPTY_BYTE_STRING,oe.min()).withLastLimboFreeSnapshotVersion(oe.min()):h.resumeToken.approximateByteSize()>0&&(g=g.withResumeToken(h.resumeToken,n)),s=s.insert(d,g),(function(P,N,J){return P.resumeToken.approximateByteSize()===0||N.snapshotVersion.toMicroseconds()-P.snapshotVersion.toMicroseconds()>=XA?!0:J.addedDocuments.size+J.modifiedDocuments.size+J.removedDocuments.size>0})(C,g,h)&&B.push(t.V_.updateTargetData(i,g))}));let u=dt(),c=ce();if(e.documentUpdates.forEach((h=>{e.resolvedLimboDocuments.has(h)&&B.push(t.persistence.referenceDelegate.updateLimboDocument(i,h))})),B.push(rR(i,o,e.documentUpdates).next((h=>{u=h.Ko,c=h.Qo}))),!n.isEqual(oe.min())){const h=t.V_.getLastRemoteSnapshotVersion(i).next((d=>t.V_.setTargetsMetadata(i,i.currentSequenceNumber,n)));B.push(h)}return G.waitFor(B).next((()=>o.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,u,c))).next((()=>u))})).then((i=>(t.Lo=s,i)))}function rR(r,e,t){let n=ce(),s=ce();return t.forEach((i=>n=n.add(i))),e.getEntries(r,n).next((i=>{let o=dt();return t.forEach(((B,u)=>{const c=i.get(B);u.isFoundDocument()!==c.isFoundDocument()&&(s=s.add(B)),u.isNoDocument()&&u.version.isEqual(oe.min())?(e.removeEntry(B,u.readTime),o=o.insert(B,u)):!c.isValidDocument()||u.version.compareTo(c.version)>0||u.version.compareTo(c.version)===0&&c.hasPendingWrites?(e.addEntry(u),o=o.insert(B,u)):X(cc,"Ignoring outdated watch update for ",B,". Current version:",c.version," Watch version:",u.version)})),{Ko:o,Qo:s}}))}function sR(r,e){const t=ae(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(n=>(e===void 0&&(e=xu),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e))))}function iR(r,e){const t=ae(r);return t.persistence.runTransaction("Allocate target","readwrite",(n=>{let s;return t.V_.getTargetData(n,e).next((i=>i?(s=i,G.resolve(s)):t.V_.allocateTargetId(n).next((o=>(s=new cn(e,o,"TargetPurposeListen",n.currentSequenceNumber),t.V_.addTargetData(n,s).next((()=>s)))))))})).then((n=>{const s=t.Lo.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Lo=t.Lo.insert(n.targetId,n),t.Bo.set(e,n.targetId)),n}))}async function au(r,e,t){const n=ae(r),s=n.Lo.get(e),i=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",i,(o=>n.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!fs(o))throw o;X(cc,`Failed to update sequence numbers for target ${e}: ${o}`)}n.Lo=n.Lo.remove(e),n.Bo.delete(s.target)}function yf(r,e,t){const n=ae(r);let s=oe.min(),i=ce();return n.persistence.runTransaction("Execute query","readwrite",(o=>(function(u,c,h){const d=ae(u),C=d.Bo.get(h);return C!==void 0?G.resolve(d.Lo.get(C)):d.V_.getTargetData(c,h)})(n,o,qe(e)?e:Xt(e)).next((B=>{if(B)return s=B.lastLimboFreeSnapshotVersion,n.V_.getMatchingKeysForTargetId(o,B.targetId).next((u=>{i=u}))})).next((()=>n.No.getDocumentsMatchingQuery(o,e,t?s:oe.min(),t?i:ce()))).next((B=>(oR(n,B),{documents:B,Wo:i})))))}function oR(r,e){e.forEach(((t,n)=>{const s=n.key.getCollectionGroup(),i=r.Uo.get(s)||oe.min();n.readTime.compareTo(i)>0&&r.Uo.set(s,n.readTime)}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aR{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.Yo=0,this.Zo=null,this.Xo=!0}ea(){this.Yo===0&&(this.ta("Unknown"),this.Zo=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.Zo=null,this.na("Backend didn't respond within 10 seconds."),this.ta("Offline"),Promise.resolve()))))}ra(e){this.state==="Online"?this.ta("Unknown"):(this.Yo++,this.Yo>=1&&(this.ia(),this.na(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ta("Offline")))}set(e){this.ia(),this.Yo=0,e==="Online"&&(this.Xo=!1),this.ta(e)}ta(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}na(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Xo?(gn(t),this.Xo=!1):X("OnlineStateTracker",t)}ia(){this.Zo!==null&&(this.Zo.cancel(),this.Zo=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rn="RemoteStore";class BR{constructor(e,t,n,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.sa=[],this._a=new Map,this.oa=new Map,this.aa=new Map,this.ua=new Yn(1e3),this.ca=new Yn(1001),this.la=new Set,this.Ea=[],this.ha=i,this.ha.Qe((o=>{n.enqueueAndForget((async()=>{Fr(this)&&(X(rn,"Restarting streams for network reachability change."),await(async function(u){const c=ae(u);c.la.add(4),await Mi(c),c.Ta.set("Unknown"),c.la.delete(4),await Oa(c)})(this))}))})),this.Ta=new aR(n,s)}}async function Oa(r){if(Fr(r))for(const e of r.Ea)await e(!0)}async function Mi(r){for(const e of r.Ea)await e(!1)}function Bu(r,e){return r.oa.get(e)||void 0}function Kp(r,e){const t=ae(r),n=Bu(t,e.targetId);if(n!==void 0&&t._a.has(n))return;const s=(function(B,u){const c=Bu(B,u);c!==void 0&&B.aa.delete(c);const h=(function(C,g){return g%2!=0?C.ca.next():C.ua.next()})(B,u);return B.oa.set(u,h),B.aa.set(h,u),h})(t,e.targetId);X(rn,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);const i=new cn(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t._a.set(s,i),dc(t)?fc(t):Es(t).Yt()&&hc(t,i)}function lc(r,e){const t=ae(r),n=Es(t),s=Bu(t,e);X(rn,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t._a.delete(s),t.oa.delete(e),t.aa.delete(s),n.Yt()&&zp(t,s),t._a.size===0&&(n.Yt()?n.en():Fr(t)&&t.Ta.set("Unknown"))}function hc(r,e){if(r.Pa.J(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(oe.min())>0){const t=r.aa.get(e.targetId);if(t===void 0)return void X(rn,"SDK target ID not found for remote ID: "+e.targetId);const n=r.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(n)}Es(r).Pn(e)}function zp(r,e){r.Pa.J(e),Es(r).In(e)}function fc(r){r.Pa=new eT({getRemoteKeysForTarget:e=>{const t=r.aa.get(e);return t!==void 0?r.remoteSyncer.getRemoteKeysForTarget(t):ce()},ye:e=>r._a.get(e)||null,Ve:()=>r.datastore.serializer.databaseId}),Es(r).start(),r.Ta.ea()}function dc(r){return Fr(r)&&!Es(r).Jt()&&r._a.size>0}function Fr(r){return ae(r).la.size===0}function Wp(r){r.Pa=void 0}async function uR(r){r.Ta.set("Online")}async function cR(r){r._a.forEach(((e,t)=>{hc(r,e)}))}async function lR(r,e){Wp(r),dc(r)?(r.Ta.ra(e),fc(r)):r.Ta.set("Unknown")}async function hR(r,e,t){if(r.Ta.set("Online"),e instanceof np&&e.state===2&&e.cause)try{await(async function(s,i){const o=i.cause;for(const B of i.targetIds){if(s._a.has(B)){const u=s.aa.get(B);u!==void 0&&(await s.remoteSyncer.rejectListen(u,o),s.oa.delete(u),s.aa.delete(B)),s._a.delete(B)}s.Pa.removeTarget(B)}})(r,e)}catch(n){X(rn,"Failed to remove targets %s: %s ",e.targetIds.join(","),n),await ea(r,n)}else if(e instanceof bo?r.Pa._e(e):e instanceof tp?r.Pa.he(e):r.Pa.ue(e),!t.isEqual(oe.min()))try{const n=await qp(r.localStore);t.compareTo(n)>=0&&await(function(i,o){const B=i.Pa.fe(o);B.targetChanges.forEach(((c,h)=>{if(c.resumeToken.approximateByteSize()>0){const d=i._a.get(h);d&&i._a.set(h,d.withResumeToken(c.resumeToken,o))}})),B.targetMismatches.forEach(((c,h)=>{const d=i._a.get(c);if(!d)return;i._a.set(c,d.withResumeToken(He.EMPTY_BYTE_STRING,d.snapshotVersion)),zp(i,c);const C=new cn(d.target,c,h,d.sequenceNumber);hc(i,C)}));const u=(function(h,d){const C=new Map;d.targetChanges.forEach(((D,P)=>{const N=h.aa.get(P);N!==void 0&&C.set(N,D)}));let g=new be(le);return d.targetMismatches.forEach(((D,P)=>{const N=h.aa.get(D);N!==void 0&&(g=g.insert(N,P))})),new ki(d.snapshotVersion,C,g,d.documentUpdates,d.augmentedDocumentUpdates,d.resolvedLimboDocuments)})(i,B);return i.remoteSyncer.applyRemoteEvent(u)})(r,t)}catch(n){X(rn,"Failed to raise snapshot:",n),await ea(r,n)}}async function ea(r,e,t){if(!fs(e))throw e;r.la.add(1),await Mi(r),r.Ta.set("Offline"),t||(t=()=>qp(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{X(rn,"Retrying IndexedDB access"),await t(),r.la.delete(1),await Oa(r)}))}function $p(r,e){return e().catch((t=>ea(r,t,e)))}async function Na(r){const e=ae(r),t=Xn(e);let n=e.sa.length>0?e.sa[e.sa.length-1].batchId:xu;for(;fR(e);)try{const s=await sR(e.localStore,n);if(s===null){e.sa.length===0&&t.en();break}n=s.batchId,dR(e,s)}catch(s){await ea(e,s)}Qp(e)&&Yp(e)}function fR(r){return Fr(r)&&r.sa.length<10}function dR(r,e){r.sa.push(e);const t=Xn(r);t.Yt()&&t.Rn&&t.An(e.mutations)}function Qp(r){return Fr(r)&&!Xn(r).Jt()&&r.sa.length>0}function Yp(r){Xn(r).start()}async function CR(r){Xn(r).fn()}async function pR(r){const e=Xn(r);for(const t of r.sa)e.An(t.mutations)}async function gR(r,e,t){const n=r.sa.shift(),s=oc.from(n,e,t);await $p(r,(()=>r.remoteSyncer.applySuccessfulWrite(s))),await Na(r)}async function mR(r,e){e&&Xn(r).Rn&&await(async function(n,s){if((function(o){return Ky(o)&&o!==V.ABORTED})(s.code)){const i=n.sa.shift();Xn(n).Xt(),await $p(n,(()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s))),await Na(n)}})(r,e),Qp(r)&&Yp(r)}async function Tf(r,e){const t=ae(r);t.asyncQueue.verifyOperationInProgress(),X(rn,"RemoteStore received new credentials");const n=Fr(t);t.la.add(3),await Mi(t),n&&t.Ta.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.la.delete(3),await Oa(t)}async function ER(r,e){const t=ae(r);e?(t.la.delete(2),await Oa(t)):e||(t.la.add(2),await Mi(t),t.Ta.set("Unknown"))}function Es(r){return r.Ia||(r.Ia=(function(t,n,s){const i=ae(t);return i.pn(),new PT(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{ct:uR.bind(null,r),Et:cR.bind(null,r),Tt:lR.bind(null,r),Tn:hR.bind(null,r)}),r.Ea.push((async e=>{e?(r.Ia.Xt(),dc(r)?fc(r):r.Ta.set("Unknown")):(await r.Ia.stop(),Wp(r))}))),r.Ia}function Xn(r){return r.Ra||(r.Ra=(function(t,n,s){const i=ae(t);return i.pn(),new ST(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{ct:()=>Promise.resolve(),Et:CR.bind(null,r),Tt:mR.bind(null,r),Vn:pR.bind(null,r),dn:gR.bind(null,r)}),r.Ea.push((async e=>{e?(r.Ra.Xt(),await Na(r)):(await r.Ra.stop(),r.sa.length>0&&(X(rn,`Stopping write stream with ${r.sa.length} pending writes`),r.sa=[]))}))),r.Ra}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cc{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Aa(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Aa(this.observer.error,e):gn("Uncaught Error in snapshot listener:",e.toString()))}Va(){this.muted=!0}Aa(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pc{constructor(e,t,n,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new hn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,s,i){const o=Date.now()+n,B=new pc(e,t,o,s,i);return B.start(n),B}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new W(V.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function gc(r,e){if(gn("AsyncQueue",`${e}: ${r}`),fs(r))return new W(V.UNAVAILABLE,`${e}: ${r}`);throw r}class If{constructor(){this.activeTargetIds=Yy()}Ba(e){this.activeTargetIds=this.activeTargetIds.add(e)}Ua(e){this.activeTargetIds=this.activeTargetIds.delete(e)}La(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class _R{constructor(){this.fu=new If,this.mu={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.fu.Ba(e),this.mu[e]||"not-current"}updateQueryState(e,t,n){this.mu[e]=t}removeLocalQueryTarget(e){this.fu.Ua(e)}isLocalQueryTarget(e){return this.fu.activeTargetIds.has(e)}clearQueryState(e){delete this.mu[e]}getAllActiveQueryTargets(){return this.fu.activeTargetIds}isActiveQueryTarget(e){return this.fu.activeTargetIds.has(e)}start(){return this.fu=new If,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}function RB(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gr{static emptySet(e){return new gr(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||te.comparator(t.key,n.key):(t,n)=>te.comparator(t.key,n.key),this.keyedMap=jr(),this.sortedSet=new be(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,n)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof gr)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new gr;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Af{constructor(){this.pu=new be(te.comparator)}track(e){const t=e.doc.key,n=this.pu.get(t);n?e.type!==0&&n.type===3?this.pu=this.pu.insert(t,e):e.type===3&&n.type!==1?this.pu=this.pu.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.pu=this.pu.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.pu=this.pu.remove(t):e.type===1&&n.type===2?this.pu=this.pu.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.pu=this.pu.insert(t,{type:2,doc:e.doc}):re(63341,{we:e,gu:n}):this.pu=this.pu.insert(t,e)}yu(){const e=[];return this.pu.inorderTraversal(((t,n)=>{e.push(n)})),e}}class is{constructor(e,t,n,s,i,o,B,u,c){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=B,this.excludesMetadataChanges=u,this.hasCachedResults=c}static fromInitialDocuments(e,t,n,s,i){const o=[];return t.forEach((B=>{o.push({type:0,doc:B})})),new is(e,t,gr.emptySet(t),o,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Pa(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==n[s].type||!t[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DR{constructor(){this.wu=void 0,this.bu=[]}Su(){return this.bu.some((e=>e.vu()))}}class wR{constructor(){this.queries=Rf(),this.onlineState="Unknown",this.Du=new Set}terminate(){(function(t,n){const s=ae(t),i=s.queries;s.queries=Rf(),i.forEach(((o,B)=>{for(const u of B.bu)u.onError(n)}))})(this,new W(V.ABORTED,"Firestore shutting down"))}}function Rf(){return new Or((r=>Vp(r)),Pa)}async function mc(r,e){const t=ae(r);let n=3;const s=e.query;let i=t.queries.get(s);i?!i.Su()&&e.vu()&&(n=2):(i=new DR,n=e.vu()?0:1);try{switch(n){case 0:i.wu=await t.onListen(s,!0);break;case 1:i.wu=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){const B=gc(o,`Initialization of query '${qe(e.query)?fn(e.query):Xs(e.query)}' failed`);return void e.onError(B)}t.queries.set(s,i),i.bu.push(e),e.xu(t.onlineState),i.wu&&e.Cu(i.wu)&&_c(t)}async function Ec(r,e){const t=ae(r),n=e.query;let s=3;const i=t.queries.get(n);if(i){const o=i.bu.indexOf(e);o>=0&&(i.bu.splice(o,1),i.bu.length===0?s=e.vu()?0:1:!i.Su()&&e.vu()&&(s=2))}switch(s){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function yR(r,e){const t=ae(r);let n=!1;for(const s of e){const i=s.query,o=t.queries.get(i);if(o){for(const B of o.bu)B.Cu(s)&&(n=!0);o.wu=s}}n&&_c(t)}function TR(r,e,t){const n=ae(r),s=n.queries.get(e);if(s)for(const i of s.bu)i.onError(t);n.queries.delete(e)}function _c(r){r.Du.forEach((e=>{e.next()}))}var uu;(function(r){r.Default="default",r.Cache="cache"})(uu||(uu={}));class Dc{constructor(e,t,n){this.query=e,this.Fu=t,this.Ou=!1,this.Mu=null,this.onlineState="Unknown",this.options=n||{}}Cu(e){if(!this.options.includeMetadataChanges){const n=[];for(const s of e.docChanges)s.type!==3&&n.push(s);e=new is(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Ou?this.Nu(e)&&(this.Fu.next(e),t=!0):this.Lu(e,this.onlineState)&&(this.Bu(e),t=!0),this.Mu=e,t}onError(e){this.Fu.error(e)}xu(e){this.onlineState=e;let t=!1;return this.Mu&&!this.Ou&&this.Lu(this.Mu,e)&&(this.Bu(this.Mu),t=!0),t}Lu(e,t){if(!e.fromCache||!this.vu())return!0;const n=t!=="Offline";return(!this.options.waitForSyncWhenOnline||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Nu(e){if(e.docChanges.length>0)return!0;const t=this.Mu&&this.Mu.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Bu(e){e=is.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Ou=!0,this.Fu.next(e)}vu(){return this.options.source!==uu.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xp{constructor(e){this.key=e}}class Zp{constructor(e){this.key=e}}class IR{constructor(e,t){this.query=e,this.zu=t,this.ju=null,this.hasCachedResults=!1,this.current=!1,this.Hu=ce(),this.mutatedKeys=ce(),this.Ju=qe(e)?ou(e):Uu(e),this.Yu=new gr(this.Ju)}get Zu(){return this.zu}Xu(e,t){const n=t?t.ec:new Af,s=t?t.Yu:this.Yu;let i=t?t.mutatedKeys:this.mutatedKeys,o=s,B=!1;const[u,c]=this.tc(this.query,s);e.inorderTraversal(((d,C)=>{const g=s.get(d),D=kA(this.query,C)?C:null,P=!!g&&this.mutatedKeys.has(g.key),N=!!D&&(D.hasLocalMutations||this.mutatedKeys.has(D.key)&&D.hasCommittedMutations);let J=!1;g&&D?g.data.isEqual(D.data)?P!==N&&(n.track({type:3,doc:D}),J=!0):this.nc(g,D)||(n.track({type:2,doc:D}),J=!0,(u&&this.Ju(D,u)>0||c&&this.Ju(D,c)<0)&&(B=!0)):!g&&D?(n.track({type:0,doc:D}),J=!0):g&&!D&&(n.track({type:1,doc:g}),J=!0,(u||c)&&(B=!0)),J&&(D?(o=o.add(D),i=N?i.add(d):i.delete(d)):(o=o.delete(d),i=i.delete(d)))}));const h=this.rc(this.query);if(h)if(qe(this.query)){const d=[];o.forEach((D=>d.push(D)));const C=Hp(this.query,d);let g=new gr(ou(this.query));for(const D of C)g=g.add(D);o.forEach((D=>{g.has(D.key)||(i=i.delete(D.key),n.track({type:1,doc:D}))})),o=g}else{const d=this.sc(this.query);for(;o.size>h;){const C=d==="F"?o.last():o.first();o=o.delete(C.key),i=i.delete(C.key),n.track({type:1,doc:C})}}return{Yu:o,ec:n,Oo:B,mutatedKeys:i}}rc(e){var t;return qe(e)?(t=AB(e))==null?void 0:t.limit:e.limit||void 0}sc(e){if(qe(e)){const t=AB(e);return t&&t.limit<0?"L":"F"}return e.limitType}tc(e,t){var n;if(qe(e)){const s=(n=AB(e))==null?void 0:n.limit;return[t.size===s?t.last():null,null]}return[e.limitType==="F"&&t.size===this.rc(this.query)?t.last():null,e.limitType==="L"&&t.size===this.rc(this.query)?t.first():null]}nc(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,s){const i=this.Yu;this.Yu=e.Yu,this.mutatedKeys=e.mutatedKeys;const o=e.ec.yu();o.sort(((h,d)=>(function(g,D){const P=N=>{switch(N){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return re(20277,{we:N})}};return P(g)-P(D)})(h.type,d.type)||this.Ju(h.doc,d.doc))),this._c(n),s=s??!1;const B=t&&!s?this.oc():[],u=this.Hu.size===0&&this.current&&!s?1:0,c=u!==this.ju;return this.ju=u,o.length!==0||c?{snapshot:new is(this.query,e.Yu,i,o,e.mutatedKeys,u===0,c,!1,!!n&&n.resumeToken.approximateByteSize()>0),ac:B}:{ac:B}}xu(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Yu:this.Yu,ec:new Af,mutatedKeys:this.mutatedKeys,Oo:!1},!1)):{ac:[]}}uc(e){return!this.zu.has(e)&&!!this.Yu.has(e)&&!this.Yu.get(e).hasLocalMutations}_c(e){e&&(e.addedDocuments.forEach((t=>this.zu=this.zu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.zu=this.zu.delete(t))),this.current=e.current)}oc(){if(!this.current)return[];const e=this.Hu;this.Hu=ce(),this.Yu.forEach((n=>{this.uc(n.key)&&(this.Hu=this.Hu.add(n.key))}));const t=[];return e.forEach((n=>{this.Hu.has(n)||t.push(new Zp(n))})),this.Hu.forEach((n=>{e.has(n)||t.push(new Xp(n))})),t}cc(e){this.zu=e.Wo,this.Hu=ce();const t=this.Xu(e.documents);return this.applyChanges(t,!0)}lc(){return is.fromInitialDocuments(this.query,this.Yu,this.mutatedKeys,this.ju===0,this.hasCachedResults)}}const wc="SyncEngine";class AR{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class RR{constructor(e){this.key=e,this.Ec=!1}}class vR{constructor(e,t,n,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.hc={},this.Tc=new Or((B=>Vp(B)),Pa),this.Pc=new Map,this.Ic=new Set,this.Rc=new be(te.comparator),this.Ac=new Map,this.Vc=new ac,this.dc={},this.fc=new Map,this.mc=Yn.bs(),this.onlineState="Unknown",this.gc=void 0}get isPrimaryClient(){return this.gc===!0}}async function bR(r,e,t=!0){const n=ig(r);let s;const i=n.Tc.get(e);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.lc()):s=await eg(n,e,t,!0),s}async function PR(r,e){const t=ig(r);await eg(t,e,!0,!1)}async function eg(r,e,t,n){const s=await iR(r.localStore,qe(e)?e:Xt(e)),i=s.targetId,o=r.sharedClientState.addLocalQueryTarget(i,t);let B;return n&&(B=await SR(r,e,i,o==="current",s.resumeToken)),r.isPrimaryClient&&t&&Kp(r.remoteStore,s),B}async function SR(r,e,t,n,s){r.yc=(d,C,g)=>(async function(P,N,J,v){let M=N.view.Xu(J);M.Oo&&(M=await yf(P.localStore,N.query,!1).then((({documents:w})=>N.view.Xu(w,M))));const K=v&&v.targetChanges.get(N.targetId),Z=v&&v.targetMismatches.get(N.targetId)!=null,Q=N.view.applyChanges(M,P.isPrimaryClient,K,Z);return bf(P,N.targetId,Q.ac),Q.snapshot})(r,d,C,g);const i=await yf(r.localStore,e,!0),o=new IR(e,i.Wo),B=o.Xu(i.documents),u=xi.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",s),c=o.applyChanges(B,r.isPrimaryClient,u);bf(r,t,c.ac);const h=new AR(e,t,o);return r.Tc.set(e,h),r.Pc.has(t)?r.Pc.get(t).push(e):r.Pc.set(t,[e]),c.snapshot}async function OR(r,e,t){const n=ae(r),s=n.Tc.get(e),i=n.Pc.get(s.targetId);if(i.length>1)return n.Pc.set(s.targetId,i.filter((o=>!Pa(o,e)))),void n.Tc.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await au(n.localStore,s.targetId,!1).then((()=>{n.sharedClientState.clearQueryState(s.targetId),t&&lc(n.remoteStore,s.targetId),cu(n,s.targetId)})).catch(hs)):(cu(n,s.targetId),await au(n.localStore,s.targetId,!0))}async function NR(r,e){const t=ae(r),n=t.Tc.get(e),s=t.Pc.get(n.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),lc(t.remoteStore,n.targetId))}async function FR(r,e,t){const n=UR(r);try{const s=await(function(o,B){const u=ae(o),c=Ee.now(),h=B.reduce(((g,D)=>g.add(D.key)),ce());let d,C;return u.persistence.runTransaction("Locally write mutations","readwrite",(g=>{let D=dt(),P=ce();return u.ko.getEntries(g,h).next((N=>{D=N,D.forEach(((J,v)=>{v.isValidDocument()||(P=P.add(J))}))})).next((()=>u.localDocuments.getOverlayedDocuments(g,D))).next((N=>{d=N;const J=[];for(const v of B){const M=Ty(v,d.get(v.key).overlayedDocument);M!=null&&J.push(new Sr(v.key,M,NC(M.value.mapValue),ln.exists(!0)))}return u.mutationQueue.addMutationBatch(g,c,J,B)})).next((N=>{C=N;const J=N.applyToLocalDocumentSet(d,P);return u.documentOverlayCache.saveOverlays(g,N.batchId,J)}))})).then((()=>({batchId:C.batchId,changes:ZC(d)})))})(n.localStore,e);n.sharedClientState.addPendingMutation(s.batchId),(function(o,B,u){let c=o.dc[o.currentUser.toKey()];c||(c=new be(le)),c=c.insert(B,u),o.dc[o.currentUser.toKey()]=c})(n,s.batchId,t),await Gi(n,s.changes),await Na(n.remoteStore)}catch(s){const i=gc(s,"Failed to persist write");t.reject(i)}}async function tg(r,e){const t=ae(r);try{const n=await nR(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const o=t.Ac.get(i);o&&(ee(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.Ec=!0:s.modifiedDocuments.size>0?ee(o.Ec,14607):s.removedDocuments.size>0&&(ee(o.Ec,42227),o.Ec=!1))})),await Gi(t,n,e)}catch(n){await hs(n)}}function vf(r,e,t){const n=ae(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const s=[];n.Tc.forEach(((i,o)=>{const B=o.view.xu(e);B.snapshot&&s.push(B.snapshot)})),(function(o,B){const u=ae(o);u.onlineState=B;let c=!1;u.queries.forEach(((h,d)=>{for(const C of d.bu)C.xu(B)&&(c=!0)})),c&&_c(u)})(n.eventManager,e),s.length&&n.hc.Tn(s),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function LR(r,e,t){const n=ae(r);n.sharedClientState.updateQueryState(e,"rejected",t);const s=n.Ac.get(e),i=s&&s.key;if(i){let o=new be(te.comparator);o=o.insert(i,tt.newNoDocument(i,oe.min()));const B=ce().add(i),u=new ki(oe.min(),new Map,new be(le),o,dt(),B);await tg(n,u),n.Rc=n.Rc.remove(i),n.Ac.delete(e),yc(n)}else await au(n.localStore,e,!1).then((()=>cu(n,e,t))).catch(hs)}async function kR(r,e){const t=ae(r),n=e.batch.batchId;try{const s=await tR(t.localStore,e);rg(t,n,null),ng(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await Gi(t,s)}catch(s){await hs(s)}}async function xR(r,e,t){const n=ae(r);try{const s=await(function(o,B){const u=ae(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",(c=>{let h;return u.mutationQueue.lookupMutationBatch(c,B).next((d=>(ee(d!==null,37113),h=d.keys(),u.mutationQueue.removeMutationBatch(c,d)))).next((()=>u.mutationQueue.performConsistencyCheck(c))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(c,h,B))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(c,h))).next((()=>u.localDocuments.getDocuments(c,h)))}))})(n.localStore,e);rg(n,e,t),ng(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await Gi(n,s)}catch(s){await hs(s)}}function ng(r,e){(r.fc.get(e)||[]).forEach((t=>{t.resolve()})),r.fc.delete(e)}function rg(r,e,t){const n=ae(r);let s=n.dc[n.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),n.dc[n.currentUser.toKey()]=s}}function cu(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Pc.get(e))r.Tc.delete(n),t&&r.hc.wc(n,t);r.Pc.delete(e),r.isPrimaryClient&&r.Vc.e_(e).forEach((n=>{r.Vc.containsKey(n)||sg(r,n)}))}function sg(r,e){r.Ic.delete(e.path.canonicalString());const t=r.Rc.get(e);t!==null&&(lc(r.remoteStore,t),r.Rc=r.Rc.remove(e),r.Ac.delete(t),yc(r))}function bf(r,e,t){for(const n of t)n instanceof Xp?(r.Vc.addReference(n.key,e),VR(r,n)):n instanceof Zp?(X(wc,"Document no longer in limbo: "+n.key),r.Vc.removeReference(n.key,e),r.Vc.containsKey(n.key)||sg(r,n.key)):re(19791,{bc:n})}function VR(r,e){const t=e.key,n=t.path.canonicalString();r.Rc.get(t)||r.Ic.has(n)||(X(wc,"New document in limbo: "+t),r.Ic.add(n),yc(r))}function yc(r){for(;r.Ic.size>0&&r.Rc.size<r.maxConcurrentLimboResolutions;){const e=r.Ic.values().next().value;r.Ic.delete(e);const t=new te(ge.fromString(e)),n=r.mc.next();r.Ac.set(n,new RR(t)),r.Rc=r.Rc.insert(t,n),Kp(r.remoteStore,new cn(Xt(_a(t.path)),n,"TargetPurposeLimboResolution",ya.wn))}}async function Gi(r,e,t){const n=ae(r),s=[],i=[],o=[];n.Tc.isEmpty()||(n.Tc.forEach(((B,u)=>{o.push(n.yc(u,e,t).then((c=>{var h;if((c||t)&&n.isPrimaryClient){const d=c?!c.fromCache:(h=t==null?void 0:t.targetChanges.get(u.targetId))==null?void 0:h.current;n.sharedClientState.updateQueryState(u.targetId,d?"current":"not-current")}if(c){s.push(c);const d=uc.mo(u.targetId,c);i.push(d)}})))})),await Promise.all(o),n.hc.Tn(s),await(async function(u,c){const h=ae(u);try{await h.persistence.runTransaction("notifyLocalViewChanges","readwrite",(d=>G.forEach(c,(C=>G.forEach(C.Vo,(g=>h.persistence.referenceDelegate.addReference(d,C.targetId,g))).next((()=>G.forEach(C.fo,(g=>h.persistence.referenceDelegate.removeReference(d,C.targetId,g)))))))))}catch(d){if(!fs(d))throw d;X(cc,"Failed to update sequence numbers: "+d)}for(const d of c){const C=d.targetId;if(!d.fromCache){const g=h.Lo.get(C),D=g.snapshotVersion,P=g.withLastLimboFreeSnapshotVersion(D);h.Lo=h.Lo.insert(C,P)}}})(n.localStore,i))}async function MR(r,e){const t=ae(r);if(!t.currentUser.isEqual(e)){X(wc,"User change. New user:",e.toKey());const n=await jp(t.localStore,e);t.currentUser=e,(function(i,o){i.fc.forEach((B=>{B.forEach((u=>{u.reject(new W(V.CANCELLED,o))}))})),i.fc.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await Gi(t,n.$o)}}function GR(r,e){const t=ae(r),n=t.Ac.get(e);if(n&&n.Ec)return ce().add(n.key);{let s=ce();const i=t.Pc.get(e);if(!i)return s;for(const o of i??[]){const B=t.Tc.get(o);s=s.unionWith(B.view.Zu)}return s}}function ig(r){const e=ae(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=tg.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=GR.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=LR.bind(null,e),e.hc.Tn=yR.bind(null,e.eventManager),e.hc.wc=TR.bind(null,e.eventManager),e}function UR(r){const e=ae(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=kR.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=xR.bind(null,e),e}class ta{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=wa(e.databaseInfo.databaseId),this.sharedClientState=this.vc(e),this.persistence=this.Dc(e),await this.persistence.start(),this.localStore=this.xc(e),this.gcScheduler=this.Cc(e,this.localStore),this.indexBackfillerScheduler=this.Fc(e,this.localStore)}Cc(e,t){return null}Fc(e,t){return null}xc(e){return eR(this.persistence,new YA,e.initialUser,this.serializer)}Dc(e){return new Jp(Bc.b_,this.serializer)}vc(e){return new _R}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}ta.provider={build:()=>new ta};class HR extends ta{constructor(e){super(),this.cacheSizeBytes=e}Cc(e,t){ee(this.persistence.referenceDelegate instanceof Zo,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new HT(n,e.asyncQueue,t)}Dc(e){const t=this.cacheSizeBytes!==void 0?lt.withCacheSize(this.cacheSizeBytes):lt.DEFAULT;return new Jp((n=>Zo.b_(n,t)),this.serializer)}}class lu{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>vf(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=MR.bind(null,this.syncEngine),await ER(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new wR})()}createDatastore(e){const t=wa(e.databaseInfo.databaseId),n=bT(e.databaseInfo);return FT(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return(function(n,s,i,o,B){return new BR(n,s,i,o,B)})(this.localStore,this.datastore,e.asyncQueue,(t=>vf(this.syncEngine,t,0)),(function(){return hf.Ye()?new hf:new IT})())}createSyncEngine(e,t){return(function(s,i,o,B,u,c,h){const d=new vR(s,i,o,B,u,c);return h&&(d.gc=!0),d})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(s){const i=ae(s);X(rn,"RemoteStore shutting down."),i.la.add(5),await Mi(i),i.ha.shutdown(),i.Ta.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}lu.provider={build:()=>new lu};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zn="FirestoreClient";class JR{constructor(e,t,n,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this._databaseInfo=s,this.user=et.UNAUTHENTICATED,this.clientId=ku.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,(async o=>{X(Zn,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(n,(o=>(X(Zn,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new hn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=gc(t,"Failed to shutdown persistence");e.reject(n)}})),e.promise}}async function vB(r,e){r.asyncQueue.verifyOperationInProgress(),X(Zn,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener((async s=>{n.isEqual(s)||(await jp(e.localStore,s),n=s)})),e.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=e}async function Pf(r,e){r.asyncQueue.verifyOperationInProgress();const t=await jR(r);X(Zn,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((n=>Tf(e.remoteStore,n))),r.setAppCheckTokenChangeListener(((n,s)=>Tf(e.remoteStore,s))),r._onlineComponents=e}async function jR(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){X(Zn,"Using user provided OfflineComponentProvider");try{await vB(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===V.FAILED_PRECONDITION||s.code===V.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;Mt("Error using user provided cache. Falling back to memory cache: "+t),await vB(r,new ta)}}else X(Zn,"Using default OfflineComponentProvider"),await vB(r,new HR(void 0));return r._offlineComponents}async function og(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(X(Zn,"Using user provided OnlineComponentProvider"),await Pf(r,r._uninitializedComponentsProvider._online)):(X(Zn,"Using default OnlineComponentProvider"),await Pf(r,new lu))),r._onlineComponents}function qR(r){return og(r).then((e=>e.syncEngine))}async function na(r){const e=await og(r),t=e.eventManager;return t.onListen=bR.bind(null,e.syncEngine),t.onUnlisten=OR.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=PR.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=NR.bind(null,e.syncEngine),t}function KR(r,e,t,n){const s=new Cc(n),i=new Dc(e,s,t);return r.asyncQueue.enqueueAndForget((async()=>mc(await na(r),i))),()=>{s.Va(),r.asyncQueue.enqueueAndForget((async()=>Ec(await na(r),i)))}}function zR(r,e,t={}){const n=new hn;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,B,u,c){const h=new Cc({next:C=>{h.Va(),o.enqueueAndForget((()=>Ec(i,d)));const g=C.docs.has(B);!g&&C.fromCache?c.reject(new W(V.UNAVAILABLE,"Failed to get document because the client is offline.")):g&&C.fromCache&&u&&u.source==="server"?c.reject(new W(V.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):c.resolve(C)},error:C=>c.reject(C)}),d=new Dc(_a(B.path),h,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return mc(i,d)})(await na(r),r.asyncQueue,e,t,n))),n.promise}function WR(r,e,t={}){const n=new hn;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,B,u,c){const h=new Cc({next:C=>{h.Va(),o.enqueueAndForget((()=>Ec(i,d))),C.fromCache&&u.source==="server"?c.reject(new W(V.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):c.resolve(C)},error:C=>c.reject(C)}),d=new Dc(B instanceof ti?RA(B):B,h,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return mc(i,d)})(await na(r),r.asyncQueue,e,t,n))),n.promise}function $R(r,e){const t=new hn;return r.asyncQueue.enqueueAndForget((async()=>FR(await qR(r),e,t))),t.promise}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ag=class{constructor(e,t,n,s,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Fe(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new QR(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(ds("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}},QR=class extends ag{data(){return super.data()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class YR{convertValue(e,t="none"){switch(Je(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Se(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Kn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw re(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return Pr(e,((s,i)=>{n[s]=this.convertValue(i,t)})),n}convertVectorValue(e){var n,s,i;const t=(i=(s=(n=e.fields)==null?void 0:n[hi].arrayValue)==null?void 0:s.values)==null?void 0:i.map((o=>Se(o.doubleValue)));return new pt(t)}convertGeoPoint(e){return new en(Se(e.latitude),Se(e.longitude))}convertArray(e,t){return(e.values||[]).map((n=>this.convertValue(n,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const n=Fi(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(es(e));default:return null}}convertTimestamp(e){const t=qn(e);return new Ee(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=ge.fromString(e);ee(up(n),9688,{name:e});const s=new ci(n.get(1),n.get(3)),i=new te(n.popFirst(5));return s.isEqual(t)||gn(`A document reference to ${i} refers to a different database (${s.projectId}/${s.database}), which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function XR(r,e,t){let n;return n=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sf="AsyncQueue";class Of{constructor(e=Promise.resolve()){this.$c=[],this.Kc=!1,this.Qc=[],this.Wc=null,this.Gc=!1,this.zc=!1,this.jc=[],this.Ht=new dp(this,"async_queue_retry"),this.Hc=()=>{const n=RB();n&&X(Sf,"Visibility state changed to "+n.visibilityState),this.Ht.$t()},this.Jc=e;const t=RB();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Hc)}get isShuttingDown(){return this.Kc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Yc(),this.Zc(e)}enterRestrictedMode(e){if(!this.Kc){this.Kc=!0,this.zc=e||!1;const t=RB();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Hc)}}enqueue(e){if(this.Yc(),this.Kc)return new Promise((()=>{}));const t=new hn;return this.Zc((()=>this.Kc&&this.zc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.$c.push(e),this.Xc())))}async Xc(){if(this.$c.length!==0){try{await this.$c[0](),this.$c.shift(),this.Ht.reset()}catch(e){if(!fs(e))throw e;X(Sf,"Operation failed with retryable error: "+e)}this.$c.length>0&&this.Ht.kt((()=>this.Xc()))}}Zc(e){const t=this.Jc.then((()=>(this.Gc=!0,e().catch((n=>{throw this.Wc=n,this.Gc=!1,gn("INTERNAL UNHANDLED ERROR: ",Nf(n)),n})).then((n=>(this.Gc=!1,n))))));return this.Jc=t,t}enqueueAfterDelay(e,t,n){this.Yc(),this.jc.indexOf(e)>-1&&(t=0);const s=pc.createAndSchedule(this,e,t,n,(i=>this.el(i)));return this.Qc.push(s),s}Yc(){this.Wc&&re(47125,{tl:Nf(this.Wc)})}verifyOperationInProgress(){}async nl(){let e;do e=this.Jc,await e;while(e!==this.Jc)}rl(e){for(const t of this.Qc)if(t.timerId===e)return!0;return!1}il(e){return this.nl().then((()=>{this.Qc.sort(((t,n)=>t.targetTimeMs-n.targetTimeMs));for(const t of this.Qc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.nl()}))}sl(e){this.jc.push(e)}el(e){const t=this.Qc.indexOf(e);this.Qc.splice(t,1)}}function Nf(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}class os extends Ta{constructor(e,t,n,s){super(e,t,n,s),this.type="firestore",this._queue=new Of,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Of(e),this._firestoreClient=void 0,await e}}}function ZR(r,e){const t=typeof r=="object"?r:Ri(),n=typeof r=="string"?r:Jo,s=vr(t,"firestore").getImmediate({identifier:n});if(!s._initialized){const i=Cu("firestore");i&&qT(s,...i)}return s}function Fa(r){if(r._terminated)throw new W(V.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||ev(r),r._firestoreClient}function ev(r){var n,s,i,o;const e=r._freezeSettings(),t=kT(r._databaseId,((n=r._app)==null?void 0:n.options.appId)||"",r._persistenceKey,(s=r._app)==null?void 0:s.options.apiKey,e);r._componentsProvider||(i=e.localCache)!=null&&i._offlineComponentProvider&&((o=e.localCache)!=null&&o._onlineComponentProvider)&&(r._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),r._firestoreClient=new JR(r._authCredentials,r._appCheckCredentials,r._queue,t,r._componentsProvider&&(function(u){const c=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(c),_online:c}})(r._componentsProvider))}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tc extends YR{constructor(e){super(),this.firestore=e}convertBytes(e){return new Ot(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Fe(this.firestore,null,t)}}class qs{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class mr extends ag{constructor(e,t,n,s,i,o){super(e,t,n,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Oo(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(ds("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new W(V.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=mr._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}mr._jsonSchemaVersion="firestore/documentSnapshot/1.0",mr._jsonSchema={type:Ge("string",mr._jsonSchemaVersion),bundleSource:Ge("string","DocumentSnapshot"),bundleName:Ge("string"),bundle:Ge("string")};class Oo extends mr{data(e={}){return super.data(e)}}class Er{constructor(e,t,n,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new qs(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((n=>{e.call(t,new Oo(this._firestore,this._userDataWriter,n.key,n,new qs(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new W(V.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((B=>{qe(s._snapshot.query)?ou(s._snapshot.query):Uu(s.query._query);const u=new Oo(s._firestore,s._userDataWriter,B.doc.key,B.doc,new qs(s._snapshot.mutatedKeys.has(B.doc.key),s._snapshot.fromCache),s.query.converter);return B.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((B=>i||B.type!==3)).map((B=>{const u=new Oo(s._firestore,s._userDataWriter,B.doc.key,B.doc,new qs(s._snapshot.mutatedKeys.has(B.doc.key),s._snapshot.fromCache),s.query.converter);let c=-1,h=-1;return B.type!==0&&(c=o.indexOf(B.doc.key),o=o.delete(B.doc.key)),B.type!==1&&(o=o.add(B.doc),h=o.indexOf(B.doc.key)),{type:tv(B.type),doc:u,oldIndex:c,newIndex:h}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new W(V.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Er._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=ku.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),n.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function tv(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return re(61501,{type:r})}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Er._jsonSchemaVersion="firestore/querySnapshot/1.0",Er._jsonSchema={type:Ge("string",Er._jsonSchemaVersion),bundleSource:Ge("string","QuerySnapshot"),bundleName:Ge("string"),bundle:Ge("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bg(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new W(V.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Ic{}class Ac extends Ic{}function Ff(r,e,...t){let n=[];e instanceof Ic&&n.push(e),n=n.concat(t),(function(i){const o=i.filter((u=>u instanceof Rc)).length,B=i.filter((u=>u instanceof La)).length;if(o>1||o>0&&B>0)throw new W(V.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(n);for(const s of n)r=s._apply(r);return r}class La extends Ac{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new La(e,t,n)}_apply(e){const t=this._parse(e);return ug(e._query,t),new _n(e.firestore,e.converter,eu(e._query,t))}_parse(e){const t=Ep(e.firestore);return(function(i,o,B,u,c,h,d){let C;if(c.isKeyField()){if(h==="array-contains"||h==="array-contains-any")throw new W(V.INVALID_ARGUMENT,`Invalid Query. You can't perform '${h}' queries on documentId().`);if(h==="in"||h==="not-in"){Vf(d,h);const D=[];for(const P of d)D.push(xf(u,i,P));C={arrayValue:{values:D}}}else C=xf(u,i,d)}else h!=="in"&&h!=="not-in"&&h!=="array-contains-any"||Vf(d,h),C=QT(B,o,d,h==="in"||h==="not-in");return Me.create(c,h,C)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function go(r,e,t){const n=e,s=ds("where",r);return La._create(s,n,t)}class Rc extends Ic{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Rc(e,t)}_parse(e){const t=this._queryConstraints.map((n=>n._parse(e))).filter((n=>n.getFilters().length>0));return t.length===1?t[0]:Gt.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let o=s;const B=i.getFlattenedFilters();for(const u of B)ug(o,u),o=eu(o,u)})(e._query,t),new _n(e.firestore,e.converter,eu(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class vc extends Ac{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new vc(e,t)}_apply(e){const t=(function(s,i,o){if(s.startAt!==null)throw new W(V.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new W(V.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new mi(i,o)})(e._query,this._field,this._direction);return new _n(e.firestore,e.converter,Hy(e._query,t))}}function Lf(r,e="asc"){const t=e,n=ds("orderBy",r);return vc._create(n,t)}class bc extends Ac{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new bc(e,t,n)}_apply(e){return new _n(e.firestore,e.converter,$o(e._query,this._limit,this._limitType))}}function kf(r){return bc._create("limit",r,"F")}function xf(r,e,t){if(typeof(t=Oe(t))=="string"){if(t==="")throw new W(V.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!QC(e)&&t.indexOf("/")!==-1)throw new W(V.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(ge.fromString(t));if(!te.isDocumentKey(n))throw new W(V.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return $h(r,new te(n))}if(t instanceof Fe)return $h(r,t._key);throw new W(V.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${da(t)}.`)}function Vf(r,e){if(!Array.isArray(r)||r.length===0)throw new W(V.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function ug(r,e){const t=(function(s,i){for(const o of s)for(const B of o.getFlattenedFilters())if(i.indexOf(B.op)>=0)return B.op;return null})(r.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new W(V.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new W(V.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mf(r){return(function(t,n){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of n)if(i in s&&typeof s[i]=="function")return!0;return!1})(r,["next","error","complete"])}function bB(r){r=Yt(r,Fe);const e=Yt(r.firestore,os),t=Fa(e);return zR(t,r._key,{source:"server"}).then((n=>cg(e,r,n)))}function Gf(r){r=Yt(r,_n);const e=Yt(r.firestore,os),t=Fa(e),n=new Tc(e);return Bg(r._query),WR(t,r._query).then((s=>new Er(e,n,r,s)))}function nv(r,e,t){r=Yt(r,Fe);const n=Yt(r.firestore,os),s=XR(r.converter,e,t),i=Ep(n);return rv(n,[$T(i,"setDoc",r._key,s,r.converter!==null,t).toMutation(r._key,ln.none())])}function Uf(r,...e){var c,h,d;r=Oe(r);let t={includeMetadataChanges:!1,source:"default"},n=0;typeof e[n]!="object"||Mf(e[n])||(t=e[n++]);const s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(Mf(e[n])){const C=e[n];e[n]=(c=C.next)==null?void 0:c.bind(C),e[n+1]=(h=C.error)==null?void 0:h.bind(C),e[n+2]=(d=C.complete)==null?void 0:d.bind(C)}let i,o,B;if(r instanceof Fe)o=Yt(r.firestore,os),B=_a(r._key.path),i={next:C=>{e[n]&&e[n](cg(o,r,C))},error:e[n+1],complete:e[n+2]};else{const C=Yt(r,_n);o=Yt(C.firestore,os),B=C._query;const g=new Tc(o);i={next:D=>{e[n]&&e[n](new Er(o,g,C,D))},error:e[n+1],complete:e[n+2]},Bg(r._query)}const u=Fa(o);return KR(u,B,s,i)}function rv(r,e){const t=Fa(r);return $R(t,e)}function cg(r,e,t){const n=t.docs.get(e._key),s=new Tc(r);return new mr(r,s,e._key,n,new qs(t.hasPendingWrites,t.fromCache),e.converter)}const Hf="@firebase/firestore",Jf="4.17.2";(function(e,t=!0){sy(br),tn(new Vt("firestore",((n,{instanceIdentifier:s,options:i})=>{const o=n.getProvider("app").getImmediate(),B=new os(new DT(n.getProvider("auth-internal")),new TT(o,n.getProvider("app-check-internal")),fy(o,s),o);return i={useFetchStreams:t,...i},B._setSettings(i),B}),"PUBLIC").setMultipleInstances(!0)),Rt(Hf,Jf,e),Rt(Hf,Jf,"esm2020")})();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sv="type.googleapis.com/google.protobuf.Int64Value",iv="type.googleapis.com/google.protobuf.UInt64Value";function lg(r,e){const t={};for(const n in r)r.hasOwnProperty(n)&&(t[n]=e(r[n]));return t}function ra(r){if(r==null)return null;if(r instanceof Number&&(r=r.valueOf()),typeof r=="number"&&isFinite(r)||r===!0||r===!1||Object.prototype.toString.call(r)==="[object String]")return r;if(r instanceof Date)return r.toISOString();if(Array.isArray(r))return r.map(e=>ra(e));if(typeof r=="function"||typeof r=="object")return lg(r,e=>ra(e));throw new Error("Data cannot be encoded in JSON: "+r)}function as(r){if(r==null)return r;if(r["@type"])switch(r["@type"]){case sv:case iv:{const e=Number(r.value);if(isNaN(e))throw new Error("Data cannot be decoded from JSON: "+r);return e}default:throw new Error("Data cannot be decoded from JSON: "+r)}return Array.isArray(r)?r.map(e=>as(e)):typeof r=="function"||typeof r=="object"?lg(r,e=>as(e)):r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pc="functions";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jf={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Ct extends Ut{constructor(e,t,n,s){super(`${Pc}/${e}`,t||"",s!=null?{url:s}:void 0),this.details=n,Object.setPrototypeOf(this,Ct.prototype)}}function ov(r){if(r>=200&&r<300)return"ok";switch(r){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function sa(r,e,t){let n=ov(r),s=n,i;try{const o=e&&e.error;if(o){const B=o.status;if(typeof B=="string"){if(!jf[B])return new Ct("internal",`Unknown backend error status: ${B} [${r}]`,void 0,t);n=jf[B],s=`Backend error status: ${B}`}const u=o.message;typeof u=="string"&&(s=u),i=o.details,i!==void 0&&(i=as(i))}}catch{}return n==="ok"?null:new Ct(n,`${s} [${r}]`,i,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class av{constructor(e,t,n,s){this.app=e,this.auth=null,this.messaging=null,this.appCheck=null,this.serverAppAppCheckToken=null,yt(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.auth=t.getImmediate({optional:!0}),this.messaging=n.getImmediate({optional:!0}),this.auth||t.get().then(i=>this.auth=i,()=>{}),this.messaging||n.get().then(i=>this.messaging=i,()=>{}),this.appCheck||s==null||s.get().then(i=>this.appCheck=i,()=>{})}async getAuthToken(){if(this.auth)try{const e=await this.auth.getToken();return e==null?void 0:e.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(e){if(this.serverAppAppCheckToken)return this.serverAppAppCheckToken;if(this.appCheck){const t=e?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return t.error?null:t.token}return null}async getContext(e){const t=await this.getAuthToken(),n=await this.getMessagingToken(),s=await this.getAppCheckToken(e);return{authToken:t,messagingToken:n,appCheckToken:s}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hu="us-central1",Bv=/^data: (.*?)(?:\n|$)/;function uv(r){let e=null;return{promise:new Promise((t,n)=>{e=setTimeout(()=>{n(new Ct("deadline-exceeded","deadline-exceeded"))},r)}),cancel:()=>{e&&clearTimeout(e)}}}class cv{constructor(e,t,n,s,i=hu,o=(...B)=>fetch(...B)){this.app=e,this.fetchImpl=o,this.emulatorOrigin=null,this.contextProvider=new av(e,t,n,s),this.cancelAllRequests=new Promise(B=>{this.deleteService=()=>Promise.resolve(B())});try{const B=new URL(i);this.customDomain=B.origin+(B.pathname==="/"?"":B.pathname),this.region=hu}catch{this.customDomain=null,this.region=i}}_delete(){return this.deleteService()}_url(e){const t=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${t}/${this.region}/${e}`:this.customDomain!==null?`${this.customDomain}/${e}`:`https://${this.region}-${t}.cloudfunctions.net/${e}`}}function lv(r,e,t){const n=En(e);r.emulatorOrigin=`http${n?"s":""}://${e}:${t}`,n&&aa(r.emulatorOrigin+"/backends")}function hv(r,e,t){const n=s=>dv(r,e,s,t||{});return n.stream=(s,i)=>pv(r,e,s,i),n}function hg(r){return r.emulatorOrigin&&En(r.emulatorOrigin)?"include":void 0}async function fv(r,e,t,n,s){t["Content-Type"]="application/json";let i;try{i=await n(r,{method:"POST",body:JSON.stringify(e),headers:t,credentials:hg(s)})}catch{return{status:0,json:null}}let o=null;try{o=await i.json()}catch{}return{status:i.status,json:o}}async function fg(r,e){const t={},n=await r.contextProvider.getContext(e.limitedUseAppCheckTokens);return n.authToken&&(t.Authorization="Bearer "+n.authToken),n.messagingToken&&(t["Firebase-Instance-ID-Token"]=n.messagingToken),n.appCheckToken!==null&&(t["X-Firebase-AppCheck"]=n.appCheckToken),t}function dv(r,e,t,n){const s=r._url(e);return Cv(r,s,t,n)}async function Cv(r,e,t,n){t=ra(t);const s={data:t},i=await fg(r,n),o=n.timeout||7e4,B=uv(o),u=await Promise.race([fv(e,s,i,r.fetchImpl,r),B.promise,r.cancelAllRequests]);if(B.cancel(),!u)throw new Ct("cancelled","Firebase Functions instance was deleted.");const c=sa(u.status,u.json,e);if(c)throw c;if(!u.json)throw new Ct("internal","Response is not valid JSON object.",void 0,e);let h=u.json.data;if(typeof h>"u"&&(h=u.json.result),typeof h>"u")throw new Ct("internal","Response is missing data field.",void 0,e);return{data:as(h)}}function pv(r,e,t,n){const s=r._url(e);return gv(r,s,t,n||{})}async function gv(r,e,t,n){var C;t=ra(t);const s={data:t},i=await fg(r,n);i["Content-Type"]="application/json",i.Accept="text/event-stream";let o;try{o=await r.fetchImpl(e,{method:"POST",body:JSON.stringify(s),headers:i,signal:n==null?void 0:n.signal,credentials:hg(r)})}catch(g){if(g instanceof Error&&g.name==="AbortError"){const P=new Ct("cancelled","Request was cancelled.");return{data:Promise.reject(P),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(P)}}}}}}const D=sa(0,null,e);return{data:Promise.reject(D),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(D)}}}}}}let B,u;const c=new Promise((g,D)=>{B=g,u=D});(C=n==null?void 0:n.signal)==null||C.addEventListener("abort",()=>{const g=new Ct("cancelled","Request was cancelled.");u(g)});const h=o.body.getReader(),d=mv(h,B,u,n==null?void 0:n.signal,e);return{stream:{[Symbol.asyncIterator](){const g=d.getReader();return{async next(){const{value:D,done:P}=await g.read();return{value:D,done:P}},async return(){return await g.cancel(),{done:!0,value:void 0}}}}},data:c}}function mv(r,e,t,n,s){const i=(B,u)=>{const c=B.match(Bv);if(!c)return;const h=c[1];try{const d=JSON.parse(h);if("result"in d){e(as(d.result));return}if("message"in d){u.enqueue(as(d.message));return}if("error"in d){const C=sa(0,d,s);u.error(C),t(C);return}}catch(d){if(d instanceof Ct){u.error(d),t(d);return}}},o=new TextDecoder;return new ReadableStream({start(B){let u="";return c();async function c(){if(n!=null&&n.aborted){const h=new Ct("cancelled","Request was cancelled");return B.error(h),t(h),Promise.resolve()}try{const{value:h,done:d}=await r.read();if(d){u.trim()&&i(u.trim(),B),B.close();return}if(n!=null&&n.aborted){const g=new Ct("cancelled","Request was cancelled");B.error(g),t(g),await r.cancel();return}u+=o.decode(h,{stream:!0});const C=u.split(`
`);u=C.pop()||"";for(const g of C)g.trim()&&i(g.trim(),B);return c()}catch(h){const d=h instanceof Ct?h:sa(0,null,s);B.error(d),t(d)}}},cancel(){return r.cancel()}})}const qf="@firebase/functions",Kf="0.14.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ev="auth-internal",_v="app-check-internal",Dv="messaging-internal";function wv(r){const e=(t,{instanceIdentifier:n})=>{const s=t.getProvider("app").getImmediate(),i=t.getProvider(Ev),o=t.getProvider(Dv),B=t.getProvider(_v);return new cv(s,i,o,B,n)};tn(new Vt(Pc,e,"PUBLIC").setMultipleInstances(!0)),Rt(qf,Kf,r),Rt(qf,Kf,"esm2020")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yv(r=Ri(),e=hu){const n=vr(Oe(r),Pc).getImmediate({identifier:e}),s=Cu("functions");return s&&Tv(n,...s),n}function Tv(r,e,t){lv(Oe(r),e,t)}function zf(r,e,t){return hv(Oe(r),e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */wv();const Iv=new Set(["authWithWebSession","listWebGalleries","recoverWebGalleries","checkPackReadiness","createReferenceUploadSession","commitReferenceMetadata","createOrder","createWebCheckout","getWebCheckoutStatus","cancelWebCheckout","claimWebCheckoutCode","getWebCheckoutCode","startWebComplimentaryCheckout"]);function Ks(r,e,t){if(!Iv.has(e))return zf(r,e,{timeout:t});const n=zf(r,"webStudio",{timeout:t});return s=>n({operation:e,input:s})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dg="firebasestorage.googleapis.com",Cg="storageBucket",Av=120*1e3,Rv=600*1e3,vv=1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Le extends Ut{constructor(e,t,n=0){super(PB(e),`Firebase Storage: ${t} (${PB(e)})`),this.status_=n,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,Le.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return PB(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var Pe;(function(r){r.UNKNOWN="unknown",r.OBJECT_NOT_FOUND="object-not-found",r.BUCKET_NOT_FOUND="bucket-not-found",r.PROJECT_NOT_FOUND="project-not-found",r.QUOTA_EXCEEDED="quota-exceeded",r.UNAUTHENTICATED="unauthenticated",r.UNAUTHORIZED="unauthorized",r.UNAUTHORIZED_APP="unauthorized-app",r.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",r.INVALID_CHECKSUM="invalid-checksum",r.CANCELED="canceled",r.INVALID_EVENT_NAME="invalid-event-name",r.INVALID_URL="invalid-url",r.INVALID_DEFAULT_BUCKET="invalid-default-bucket",r.NO_DEFAULT_BUCKET="no-default-bucket",r.CANNOT_SLICE_BLOB="cannot-slice-blob",r.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",r.NO_DOWNLOAD_URL="no-download-url",r.INVALID_ARGUMENT="invalid-argument",r.INVALID_ARGUMENT_COUNT="invalid-argument-count",r.APP_DELETED="app-deleted",r.INVALID_ROOT_OPERATION="invalid-root-operation",r.INVALID_FORMAT="invalid-format",r.INTERNAL_ERROR="internal-error",r.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(Pe||(Pe={}));function PB(r){return"storage/"+r}function Sc(){const r="An unknown error occurred, please check the error payload for server response.";return new Le(Pe.UNKNOWN,r)}function bv(r){return new Le(Pe.OBJECT_NOT_FOUND,"Object '"+r+"' does not exist.")}function Pv(r){return new Le(Pe.QUOTA_EXCEEDED,"Quota for bucket '"+r+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function Sv(){const r="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new Le(Pe.UNAUTHENTICATED,r)}function Ov(){return new Le(Pe.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function Nv(r){return new Le(Pe.UNAUTHORIZED,"User does not have permission to access '"+r+"'.")}function pg(){return new Le(Pe.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function gg(){return new Le(Pe.CANCELED,"User canceled the upload/download.")}function Fv(r){return new Le(Pe.INVALID_URL,"Invalid URL '"+r+"'.")}function Lv(r){return new Le(Pe.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+r+"'.")}function kv(){return new Le(Pe.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+Cg+"' property when initializing the app?")}function mg(){return new Le(Pe.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function xv(){return new Le(Pe.SERVER_FILE_WRONG_SIZE,"Server recorded incorrect upload file size, please retry the upload.")}function Vv(r){return new Le(Pe.UNSUPPORTED_ENVIRONMENT,`${r} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function fu(r){return new Le(Pe.INVALID_ARGUMENT,r)}function Eg(){return new Le(Pe.APP_DELETED,"The Firebase app was deleted.")}function Mv(r){return new Le(Pe.INVALID_ROOT_OPERATION,"The operation '"+r+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function ri(r,e){return new Le(Pe.INVALID_FORMAT,"String does not match format '"+r+"': "+e)}function Us(r){throw new Le(Pe.INTERNAL_ERROR,"Internal error: "+r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class At{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let n;try{n=At.makeFromUrl(e,t)}catch{return new At(e,"")}if(n.path==="")return n;throw Lv(e)}static makeFromUrl(e,t){let n=null;const s="([A-Za-z0-9.\\-_]+)";function i(K){K.path.charAt(K.path.length-1)==="/"&&(K.path_=K.path_.slice(0,-1))}const o="(/(.*))?$",B=new RegExp("^gs://"+s+o,"i"),u={bucket:1,path:3};function c(K){K.path_=decodeURIComponent(K.path)}const h="v[A-Za-z0-9_]+",d=t.replace(/[.]/g,"\\."),C="(/([^?#]*).*)?$",g=new RegExp(`^https?://${d}/${h}/b/${s}/o${C}`,"i"),D={bucket:1,path:3},P=t===dg?"(?:storage.googleapis.com|storage.cloud.google.com)":t,N="([^?#]*)",J=new RegExp(`^https?://${P}/${s}/${N}`,"i"),M=[{regex:B,indices:u,postModify:i},{regex:g,indices:D,postModify:c},{regex:J,indices:{bucket:1,path:2},postModify:c}];for(let K=0;K<M.length;K++){const Z=M[K],Q=Z.regex.exec(e);if(Q){const w=Q[Z.indices.bucket];let m=Q[Z.indices.path];m||(m=""),n=new At(w,m),Z.postModify(n);break}}if(n==null)throw Fv(e);return n}}class Gv{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uv(r,e,t){let n=1,s=null,i=null,o=!1,B=0;function u(){return B===2}let c=!1;function h(...N){c||(c=!0,e.apply(null,N))}function d(N){s=setTimeout(()=>{s=null,r(g,u())},N)}function C(){i&&clearTimeout(i)}function g(N,...J){if(c){C();return}if(N){C(),h.call(null,N,...J);return}if(u()||o){C(),h.call(null,N,...J);return}n<64&&(n*=2);let M;B===1?(B=2,M=0):M=(n+Math.random())*1e3,d(M)}let D=!1;function P(N){D||(D=!0,C(),!c&&(s!==null?(N||(B=2),clearTimeout(s),d(0)):N||(B=1)))}return d(0),i=setTimeout(()=>{o=!0,P(!0)},t),P}function Hv(r){r(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jv(r){return r!==void 0}function jv(r){return typeof r=="function"}function qv(r){return typeof r=="object"&&!Array.isArray(r)}function Oc(r){return typeof r=="string"||r instanceof String}function Wf(r){return Nc()&&r instanceof Blob}function Nc(){return typeof Blob<"u"}function $f(r,e,t,n){if(n<e)throw fu(`Invalid value for '${r}'. Expected ${e} or greater.`);if(n>t)throw fu(`Invalid value for '${r}'. Expected ${t} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ka(r,e,t){let n=e;return t==null&&(n=`https://${e}`),`${t}://${n}/v0${r}`}function Kv(r){const e=encodeURIComponent;let t="?";for(const n in r)if(r.hasOwnProperty(n)){const s=e(n)+"="+e(r[n]);t=t+s+"&"}return t=t.slice(0,-1),t}var _r;(function(r){r[r.NO_ERROR=0]="NO_ERROR",r[r.NETWORK_ERROR=1]="NETWORK_ERROR",r[r.ABORT=2]="ABORT"})(_r||(_r={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _g(r,e){const t=r>=500&&r<600,s=[408,429].indexOf(r)!==-1,i=e.indexOf(r)!==-1;return t||s||i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zv{constructor(e,t,n,s,i,o,B,u,c,h,d,C=!0,g=!1){this.url_=e,this.method_=t,this.headers_=n,this.body_=s,this.successCodes_=i,this.additionalRetryCodes_=o,this.callback_=B,this.errorCallback_=u,this.timeout_=c,this.progressCallback_=h,this.connectionFactory_=d,this.retry=C,this.isUsingEmulator=g,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((D,P)=>{this.resolve_=D,this.reject_=P,this.start_()})}start_(){const e=(n,s)=>{if(s){n(!1,new mo(!1,null,!0));return}const i=this.connectionFactory_();this.pendingConnection_=i;const o=B=>{const u=B.loaded,c=B.lengthComputable?B.total:-1;this.progressCallback_!==null&&this.progressCallback_(u,c)};this.progressCallback_!==null&&i.addUploadProgressListener(o),i.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&i.removeUploadProgressListener(o),this.pendingConnection_=null;const B=i.getErrorCode()===_r.NO_ERROR,u=i.getStatus();if(!B||_g(u,this.additionalRetryCodes_)&&this.retry){const h=i.getErrorCode()===_r.ABORT;n(!1,new mo(!1,null,h));return}const c=this.successCodes_.indexOf(u)!==-1;n(!0,new mo(c,i))})},t=(n,s)=>{const i=this.resolve_,o=this.reject_,B=s.connection;if(s.wasSuccessCode)try{const u=this.callback_(B,B.getResponse());Jv(u)?i(u):i()}catch(u){o(u)}else if(B!==null){const u=Sc();u.serverResponse=B.getErrorText(),this.errorCallback_?o(this.errorCallback_(B,u)):o(u)}else if(s.canceled){const u=this.appDelete_?Eg():gg();o(u)}else{const u=pg();o(u)}};this.canceled_?t(!1,new mo(!1,null,!0)):this.backoffId_=Uv(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&Hv(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class mo{constructor(e,t,n){this.wasSuccessCode=e,this.connection=t,this.canceled=!!n}}function Wv(r,e){e!==null&&e.length>0&&(r.Authorization="Firebase "+e)}function $v(r,e){r["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function Qv(r,e){e&&(r["X-Firebase-GMPID"]=e)}function Yv(r,e){e!==null&&(r["X-Firebase-AppCheck"]=e)}function Xv(r,e,t,n,s,i,o=!0,B=!1){const u=Kv(r.urlParams),c=r.url+u,h=Object.assign({},r.headers);return Qv(h,e),Wv(h,t),$v(h,i),Yv(h,n),new zv(c,r.method,h,r.body,r.successCodes,r.additionalRetryCodes,r.handler,r.errorHandler,r.timeout,r.progressCallback,s,o,B)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zv(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function eb(...r){const e=Zv();if(e!==void 0){const t=new e;for(let n=0;n<r.length;n++)t.append(r[n]);return t.getBlob()}else{if(Nc())return new Blob(r);throw new Le(Pe.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function tb(r,e,t){return r.webkitSlice?r.webkitSlice(e,t):r.mozSlice?r.mozSlice(e,t):r.slice?r.slice(e,t):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nb(r){if(typeof atob>"u")throw Vv("base-64");return atob(r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wt={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class SB{constructor(e,t){this.data=e,this.contentType=t||null}}function rb(r,e){switch(r){case Wt.RAW:return new SB(Dg(e));case Wt.BASE64:case Wt.BASE64URL:return new SB(wg(r,e));case Wt.DATA_URL:return new SB(ib(e),ob(e))}throw Sc()}function Dg(r){const e=[];for(let t=0;t<r.length;t++){let n=r.charCodeAt(t);if(n<=127)e.push(n);else if(n<=2047)e.push(192|n>>6,128|n&63);else if((n&64512)===55296)if(!(t<r.length-1&&(r.charCodeAt(t+1)&64512)===56320))e.push(239,191,189);else{const i=n,o=r.charCodeAt(++t);n=65536|(i&1023)<<10|o&1023,e.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|n&63)}else(n&64512)===56320?e.push(239,191,189):e.push(224|n>>12,128|n>>6&63,128|n&63)}return new Uint8Array(e)}function sb(r){let e;try{e=decodeURIComponent(r)}catch{throw ri(Wt.DATA_URL,"Malformed data URL.")}return Dg(e)}function wg(r,e){switch(r){case Wt.BASE64:{const s=e.indexOf("-")!==-1,i=e.indexOf("_")!==-1;if(s||i)throw ri(r,"Invalid character '"+(s?"-":"_")+"' found: is it base64url encoded?");break}case Wt.BASE64URL:{const s=e.indexOf("+")!==-1,i=e.indexOf("/")!==-1;if(s||i)throw ri(r,"Invalid character '"+(s?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let t;try{t=nb(e)}catch(s){throw s.message.includes("polyfill")?s:ri(r,"Invalid character found")}const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n}class yg{constructor(e){this.base64=!1,this.contentType=null;const t=e.match(/^data:([^,]+)?,/);if(t===null)throw ri(Wt.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const n=t[1]||null;n!=null&&(this.base64=ab(n,";base64"),this.contentType=this.base64?n.substring(0,n.length-7):n),this.rest=e.substring(e.indexOf(",")+1)}}function ib(r){const e=new yg(r);return e.base64?wg(Wt.BASE64,e.rest):sb(e.rest)}function ob(r){return new yg(r).contentType}function ab(r,e){return r.length>=e.length?r.substring(r.length-e.length)===e:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ln{constructor(e,t){let n=0,s="";Wf(e)?(this.data_=e,n=e.size,s=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),n=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),n=e.length),this.size_=n,this.type_=s}size(){return this.size_}type(){return this.type_}slice(e,t){if(Wf(this.data_)){const n=this.data_,s=tb(n,e,t);return s===null?null:new Ln(s)}else{const n=new Uint8Array(this.data_.buffer,e,t-e);return new Ln(n,!0)}}static getBlob(...e){if(Nc()){const t=e.map(n=>n instanceof Ln?n.data_:n);return new Ln(eb.apply(null,t))}else{const t=e.map(o=>Oc(o)?rb(Wt.RAW,o).data:o.data_);let n=0;t.forEach(o=>{n+=o.byteLength});const s=new Uint8Array(n);let i=0;return t.forEach(o=>{for(let B=0;B<o.length;B++)s[i++]=o[B]}),new Ln(s,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bb(r){let e;try{e=JSON.parse(r)}catch{return null}return qv(e)?e:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ub(r){if(r.length===0)return null;const e=r.lastIndexOf("/");return e===-1?"":r.slice(0,e)}function cb(r,e){const t=e.split("/").filter(n=>n.length>0).join("/");return r.length===0?t:r+"/"+t}function Tg(r){const e=r.lastIndexOf("/",r.length-2);return e===-1?r:r.slice(e+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lb(r,e){return e}class ot{constructor(e,t,n,s){this.server=e,this.local=t||e,this.writable=!!n,this.xform=s||lb}}let Eo=null;function hb(r){return!Oc(r)||r.length<2?r:Tg(r)}function Ig(){if(Eo)return Eo;const r=[];r.push(new ot("bucket")),r.push(new ot("generation")),r.push(new ot("metageneration")),r.push(new ot("name","fullPath",!0));function e(i,o){return hb(o)}const t=new ot("name");t.xform=e,r.push(t);function n(i,o){return o!==void 0?Number(o):o}const s=new ot("size");return s.xform=n,r.push(s),r.push(new ot("timeCreated")),r.push(new ot("updated")),r.push(new ot("md5Hash",null,!0)),r.push(new ot("cacheControl",null,!0)),r.push(new ot("contentDisposition",null,!0)),r.push(new ot("contentEncoding",null,!0)),r.push(new ot("contentLanguage",null,!0)),r.push(new ot("contentType",null,!0)),r.push(new ot("metadata","customMetadata",!0)),Eo=r,Eo}function fb(r,e){function t(){const n=r.bucket,s=r.fullPath,i=new At(n,s);return e._makeStorageReference(i)}Object.defineProperty(r,"ref",{get:t})}function db(r,e,t){const n={};n.type="file";const s=t.length;for(let i=0;i<s;i++){const o=t[i];n[o.local]=o.xform(n,e[o.server])}return fb(n,r),n}function Cb(r,e,t){const n=Bb(e);return n===null?null:db(r,n,t)}function Ag(r,e){const t={},n=e.length;for(let s=0;s<n;s++){const i=e[s];i.writable&&(t[i.server]=r[i.local])}return JSON.stringify(t)}class _s{constructor(e,t,n,s){this.url=e,this.method=t,this.handler=n,this.timeout=s,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jn(r){if(!r)throw Sc()}function Fc(r,e){function t(n,s){const i=Cb(r,s,e);return jn(i!==null),i}return t}function Ui(r){function e(t,n){let s;return t.getStatus()===401?t.getErrorText().includes("Firebase App Check token is invalid")?s=Ov():s=Sv():t.getStatus()===402?s=Pv(r.bucket):t.getStatus()===403?s=Nv(r.path):s=n,s.status=t.getStatus(),s.serverResponse=n.serverResponse,s}return e}function Rg(r){const e=Ui(r);function t(n,s){let i=e(n,s);return n.getStatus()===404&&(i=bv(r.path)),i.serverResponse=s.serverResponse,i}return t}function vg(r,e,t){const n=e.fullServerUrl(),s=ka(n,r.host,r._protocol),i="GET",o=r.maxOperationRetryTime,B=new _s(s,i,Fc(r,t),o);return B.errorHandler=Rg(e),B}function pb(r,e,t){const n=e.fullServerUrl(),s=ka(n,r.host,r._protocol)+"?alt=media",i="GET",o=r.maxOperationRetryTime,B=new _s(s,i,(u,c)=>c,o);return B.errorHandler=Rg(e),B.headers.Range=`bytes=0-${t}`,B.successCodes=[200,206],B}function gb(r,e){return r&&r.contentType||e&&e.type()||"application/octet-stream"}function bg(r,e,t){const n=Object.assign({},t);return n.fullPath=r.path,n.size=e.size(),n.contentType||(n.contentType=gb(null,e)),n}function mb(r,e,t,n,s){const i=e.bucketOnlyServerUrl(),o={"X-Goog-Upload-Protocol":"multipart"};function B(){let M="";for(let K=0;K<2;K++)M=M+Math.random().toString().slice(2);return M}const u=B();o["Content-Type"]="multipart/related; boundary="+u;const c=bg(e,n,s),h=Ag(c,t),d="--"+u+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+h+`\r
--`+u+`\r
Content-Type: `+c.contentType+`\r
\r
`,C=`\r
--`+u+"--",g=Ln.getBlob(d,n,C);if(g===null)throw mg();const D={name:c.fullPath},P=ka(i,r.host,r._protocol),N="POST",J=r.maxUploadRetryTime,v=new _s(P,N,Fc(r,t),J);return v.urlParams=D,v.headers=o,v.body=g.uploadData(),v.errorHandler=Ui(e),v}class ia{constructor(e,t,n,s){this.current=e,this.total=t,this.finalized=!!n,this.metadata=s||null}}function Lc(r,e){let t=null;try{t=r.getResponseHeader("X-Goog-Upload-Status")}catch{jn(!1)}return jn(!!t&&(e||["active"]).indexOf(t)!==-1),t}function Eb(r,e,t,n,s){const i=e.bucketOnlyServerUrl(),o=bg(e,n,s),B={name:o.fullPath},u=ka(i,r.host,r._protocol),c="POST",h={"X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${n.size()}`,"X-Goog-Upload-Header-Content-Type":o.contentType,"Content-Type":"application/json; charset=utf-8"},d=Ag(o,t),C=r.maxUploadRetryTime;function g(P){Lc(P);let N;try{N=P.getResponseHeader("X-Goog-Upload-URL")}catch{jn(!1)}return jn(Oc(N)),N}const D=new _s(u,c,g,C);return D.urlParams=B,D.headers=h,D.body=d,D.errorHandler=Ui(e),D}function _b(r,e,t,n){const s={"X-Goog-Upload-Command":"query"};function i(c){const h=Lc(c,["active","final"]);let d=null;try{d=c.getResponseHeader("X-Goog-Upload-Size-Received")}catch{jn(!1)}d||jn(!1);const C=Number(d);return jn(!isNaN(C)),new ia(C,n.size(),h==="final")}const o="POST",B=r.maxUploadRetryTime,u=new _s(t,o,i,B);return u.headers=s,u.errorHandler=Ui(e),u}const Qf=256*1024;function Db(r,e,t,n,s,i,o,B){const u=new ia(0,0);if(o?(u.current=o.current,u.total=o.total):(u.current=0,u.total=n.size()),n.size()!==u.total)throw xv();const c=u.total-u.current;let h=c;s>0&&(h=Math.min(h,s));const d=u.current,C=d+h;let g="";h===0?g="finalize":c===h?g="upload, finalize":g="upload";const D={"X-Goog-Upload-Command":g,"X-Goog-Upload-Offset":`${u.current}`},P=n.slice(d,C);if(P===null)throw mg();function N(K,Z){const Q=Lc(K,["active","final"]),w=u.current+h,m=n.size();let T;return Q==="final"?T=Fc(e,i)(K,Z):T=null,new ia(w,m,Q==="final",T)}const J="POST",v=e.maxUploadRetryTime,M=new _s(t,J,N,v);return M.headers=D,M.body=P.uploadData(),M.progressCallback=B||null,M.errorHandler=Ui(r),M}const ht={RUNNING:"running",PAUSED:"paused",SUCCESS:"success",CANCELED:"canceled",ERROR:"error"};function OB(r){switch(r){case"running":case"pausing":case"canceling":return ht.RUNNING;case"paused":return ht.PAUSED;case"success":return ht.SUCCESS;case"canceled":return ht.CANCELED;case"error":return ht.ERROR;default:return ht.ERROR}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wb{constructor(e,t,n){if(jv(e)||t!=null||n!=null)this.next=e,this.error=t??void 0,this.complete=n??void 0;else{const i=e;this.next=i.next,this.error=i.error,this.complete=i.complete}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gr(r){return(...e)=>{Promise.resolve().then(()=>r(...e))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pg{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=_r.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=_r.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=_r.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,t,n,s,i){if(this.sent_)throw Us("cannot .send() more than once");if(En(e)&&n&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(t,e,!0),i!==void 0)for(const o in i)i.hasOwnProperty(o)&&this.xhr_.setRequestHeader(o,i[o].toString());return s!==void 0?this.xhr_.send(s):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw Us("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw Us("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw Us("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw Us("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class yb extends Pg{initXhr(){this.xhr_.responseType="text"}}function zr(){return new yb}class Tb extends Pg{initXhr(){this.xhr_.responseType="blob"}}function Ib(){return new Tb}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ab{isExponentialBackoffExpired(){return this.sleepTime>this.maxSleepTime}constructor(e,t,n=null){this._transferred=0,this._needToFetchStatus=!1,this._needToFetchMetadata=!1,this._observers=[],this._error=void 0,this._uploadUrl=void 0,this._request=void 0,this._chunkMultiplier=1,this._resolve=void 0,this._reject=void 0,this._ref=e,this._blob=t,this._metadata=n,this._mappings=Ig(),this._resumable=this._shouldDoResumable(this._blob),this._state="running",this._errorHandler=s=>{if(this._request=void 0,this._chunkMultiplier=1,s._codeEquals(Pe.CANCELED))this._needToFetchStatus=!0,this.completeTransitions_();else{const i=this.isExponentialBackoffExpired();if(_g(s.status,[]))if(i)s=pg();else{this.sleepTime=Math.max(this.sleepTime*2,vv),this._needToFetchStatus=!0,this.completeTransitions_();return}this._error=s,this._transition("error")}},this._metadataErrorHandler=s=>{this._request=void 0,s._codeEquals(Pe.CANCELED)?this.completeTransitions_():(this._error=s,this._transition("error"))},this.sleepTime=0,this.maxSleepTime=this._ref.storage.maxUploadRetryTime,this._promise=new Promise((s,i)=>{this._resolve=s,this._reject=i,this._start()}),this._promise.then(null,()=>{})}_makeProgressCallback(){const e=this._transferred;return t=>this._updateProgress(e+t)}_shouldDoResumable(e){return e.size()>256*1024}_start(){this._state==="running"&&this._request===void 0&&(this._resumable?this._uploadUrl===void 0?this._createResumable():this._needToFetchStatus?this._fetchStatus():this._needToFetchMetadata?this._fetchMetadata():this.pendingTimeout=setTimeout(()=>{this.pendingTimeout=void 0,this._continueUpload()},this.sleepTime):this._oneShotUpload())}_resolveToken(e){Promise.all([this._ref.storage._getAuthToken(),this._ref.storage._getAppCheckToken()]).then(([t,n])=>{switch(this._state){case"running":e(t,n);break;case"canceling":this._transition("canceled");break;case"pausing":this._transition("paused");break}})}_createResumable(){this._resolveToken((e,t)=>{const n=Eb(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),s=this._ref.storage._makeRequest(n,zr,e,t);this._request=s,s.getPromise().then(i=>{this._request=void 0,this._uploadUrl=i,this._needToFetchStatus=!1,this.completeTransitions_()},this._errorHandler)})}_fetchStatus(){const e=this._uploadUrl;this._resolveToken((t,n)=>{const s=_b(this._ref.storage,this._ref._location,e,this._blob),i=this._ref.storage._makeRequest(s,zr,t,n);this._request=i,i.getPromise().then(o=>{o=o,this._request=void 0,this._updateProgress(o.current),this._needToFetchStatus=!1,o.finalized&&(this._needToFetchMetadata=!0),this.completeTransitions_()},this._errorHandler)})}_continueUpload(){const e=Qf*this._chunkMultiplier,t=new ia(this._transferred,this._blob.size()),n=this._uploadUrl;this._resolveToken((s,i)=>{let o;try{o=Db(this._ref._location,this._ref.storage,n,this._blob,e,this._mappings,t,this._makeProgressCallback())}catch(u){this._error=u,this._transition("error");return}const B=this._ref.storage._makeRequest(o,zr,s,i,!1);this._request=B,B.getPromise().then(u=>{this._increaseMultiplier(),this._request=void 0,this._updateProgress(u.current),u.finalized?(this._metadata=u.metadata,this._transition("success")):this.completeTransitions_()},this._errorHandler)})}_increaseMultiplier(){Qf*this._chunkMultiplier*2<32*1024*1024&&(this._chunkMultiplier*=2)}_fetchMetadata(){this._resolveToken((e,t)=>{const n=vg(this._ref.storage,this._ref._location,this._mappings),s=this._ref.storage._makeRequest(n,zr,e,t);this._request=s,s.getPromise().then(i=>{this._request=void 0,this._metadata=i,this._transition("success")},this._metadataErrorHandler)})}_oneShotUpload(){this._resolveToken((e,t)=>{const n=mb(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),s=this._ref.storage._makeRequest(n,zr,e,t);this._request=s,s.getPromise().then(i=>{this._request=void 0,this._metadata=i,this._updateProgress(this._blob.size()),this._transition("success")},this._errorHandler)})}_updateProgress(e){const t=this._transferred;this._transferred=e,this._transferred!==t&&this._notifyObservers()}_transition(e){if(this._state!==e)switch(e){case"canceling":case"pausing":this._state=e,this._request!==void 0?this._request.cancel():this.pendingTimeout&&(clearTimeout(this.pendingTimeout),this.pendingTimeout=void 0,this.completeTransitions_());break;case"running":const t=this._state==="paused";this._state=e,t&&(this._notifyObservers(),this._start());break;case"paused":this._state=e,this._notifyObservers();break;case"canceled":this._error=gg(),this._state=e,this._notifyObservers();break;case"error":this._state=e,this._notifyObservers();break;case"success":this._state=e,this._notifyObservers();break}}completeTransitions_(){switch(this._state){case"pausing":this._transition("paused");break;case"canceling":this._transition("canceled");break;case"running":this._start();break}}get snapshot(){const e=OB(this._state);return{bytesTransferred:this._transferred,totalBytes:this._blob.size(),state:e,metadata:this._metadata,task:this,ref:this._ref}}on(e,t,n,s){const i=new wb(t||void 0,n||void 0,s||void 0);return this._addObserver(i),()=>{this._removeObserver(i)}}then(e,t){return this._promise.then(e,t)}catch(e){return this.then(null,e)}_addObserver(e){this._observers.push(e),this._notifyObserver(e)}_removeObserver(e){const t=this._observers.indexOf(e);t!==-1&&this._observers.splice(t,1)}_notifyObservers(){this._finishPromise(),this._observers.slice().forEach(t=>{this._notifyObserver(t)})}_finishPromise(){if(this._resolve!==void 0){let e=!0;switch(OB(this._state)){case ht.SUCCESS:Gr(this._resolve.bind(null,this.snapshot))();break;case ht.CANCELED:case ht.ERROR:const t=this._reject;Gr(t.bind(null,this._error))();break;default:e=!1;break}e&&(this._resolve=void 0,this._reject=void 0)}}_notifyObserver(e){switch(OB(this._state)){case ht.RUNNING:case ht.PAUSED:e.next&&Gr(e.next.bind(e,this.snapshot))();break;case ht.SUCCESS:e.complete&&Gr(e.complete.bind(e))();break;case ht.CANCELED:case ht.ERROR:e.error&&Gr(e.error.bind(e,this._error))();break;default:e.error&&Gr(e.error.bind(e,this._error))()}}resume(){const e=this._state==="paused"||this._state==="pausing";return e&&this._transition("running"),e}pause(){const e=this._state==="running";return e&&this._transition("pausing"),e}cancel(){const e=this._state==="running"||this._state==="pausing";return e&&this._transition("canceling"),e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rr{constructor(e,t){this._service=e,t instanceof At?this._location=t:this._location=At.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new Rr(e,t)}get root(){const e=new At(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return Tg(this._location.path)}get storage(){return this._service}get parent(){const e=ub(this._location.path);if(e===null)return null;const t=new At(this._location.bucket,e);return new Rr(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw Mv(e)}}function Rb(r,e){r._throwIfRoot("getBlob");const t=pb(r.storage,r._location,e);return r.storage.makeRequestWithTokens(t,Ib).then(n=>n.slice(0,e))}function vb(r,e,t){return r._throwIfRoot("uploadBytesResumable"),new Ab(r,new Ln(e),t)}function bb(r){r._throwIfRoot("getMetadata");const e=vg(r.storage,r._location,Ig());return r.storage.makeRequestWithTokens(e,zr)}function Pb(r,e){const t=cb(r._location.path,e),n=new At(r._location.bucket,t);return new Rr(r.storage,n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sb(r){return/^[A-Za-z]+:\/\//.test(r)}function Ob(r,e){return new Rr(r,e)}function Sg(r,e){if(r instanceof kc){const t=r;if(t._bucket==null)throw kv();const n=new Rr(t,t._bucket);return e!=null?Sg(n,e):n}else return e!==void 0?Pb(r,e):r}function Nb(r,e){if(e&&Sb(e)){if(r instanceof kc)return Ob(r,e);throw fu("To use ref(service, url), the first argument must be a Storage instance.")}else return Sg(r,e)}function Yf(r,e){const t=e==null?void 0:e[Cg];return t==null?null:At.makeFromBucketSpec(t,r)}function Fb(r,e,t,n={}){r.host=`${e}:${t}`;const s=En(e);s&&aa(`https://${r.host}/b`),r._isUsingEmulator=!0,r._protocol=s?"https":"http";const{mockUserToken:i}=n;i&&(r._overrideAuthToken=typeof i=="string"?i:cd(i,r.app.options.projectId))}class kc{constructor(e,t,n,s,i,o=!1){this.app=e,this._authProvider=t,this._appCheckProvider=n,this._url=s,this._firebaseVersion=i,this._isUsingEmulator=o,this._bucket=null,this._host=dg,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=Av,this._maxUploadRetryTime=Rv,this._requests=new Set,s!=null?this._bucket=At.makeFromBucketSpec(s,this._host):this._bucket=Yf(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=At.makeFromBucketSpec(this._url,e):this._bucket=Yf(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){$f("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){$f("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){if(yt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Rr(this,e)}_makeRequest(e,t,n,s,i=!0){if(this._deleted)return new Gv(Eg());{const o=Xv(e,this._appId,n,s,t,this._firebaseVersion,i,this._isUsingEmulator);return this._requests.add(o),o.getPromise().then(()=>this._requests.delete(o),()=>this._requests.delete(o)),o}}async makeRequestWithTokens(e,t){const[n,s]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,n,s).getPromise()}}const Xf="@firebase/storage",Zf="0.14.5";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Og="storage";function Lb(r,e,t){return r=Oe(r),vb(r,e,t)}function kb(r){return r=Oe(r),bb(r)}function NB(r,e){return r=Oe(r),Nb(r,e)}function xb(r=Ri(),e){r=Oe(r);const n=vr(r,Og).getImmediate({identifier:e}),s=Cu("storage");return s&&Vb(n,...s),n}function Vb(r,e,t,n={}){Fb(r,e,t,n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mb(r,e){return r=Oe(r),Rb(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gb(r,{instanceIdentifier:e}){const t=r.getProvider("app").getImmediate(),n=r.getProvider("auth-internal"),s=r.getProvider("app-check-internal");return new kc(t,n,s,e,br)}function Ub(){tn(new Vt(Og,Gb,"PUBLIC").setMultipleInstances(!0)),Rt(Xf,Zf,""),Rt(Xf,Zf,"esm2020")}Ub();function xc(r){if(!r||typeof r!="object")return!1;const e=r;return e.capabilityVersion===1&&/^w_[a-f0-9]{40}$/.test(e.uid||"")&&/^1:\d+:web:[a-f0-9]+$/.test(e.webAppId||"")}function Ng(r,e,t){return xc(t)&&r===t.uid&&e.platform==="web"&&e.webAppId===t.webAppId&&typeof e.webSessionHandle=="string"&&/^[a-f0-9]{40}$/.test(e.webSessionHandle)&&e.deviceHandle===e.webSessionHandle&&e.deviceRestricted===!1}const Pt=r=>{if(typeof r!="string"||!/^[A-Za-z0-9_:-]{1,128}$/.test(r))throw new Error("Invalid record identifier.");return r};function No(r,e){return!!r&&r.uid===e&&r.clientVisible===!0&&!r.deletedByUser&&!r.accountDeleted&&!r.refundOutputAccessRevoked}function FB(r,e,t,n){var s;return No(r,e)&&t.startsWith(`outputs/${e}/${n}/`)&&!t.includes("..")&&t.split("/").length===4&&t.split("/").every(Boolean)&&((s=r.readableOutputPaths)==null?void 0:s.includes(t))===!0&&r.slots.some(i=>i.status==="done"&&i.path===t)}function Hb(r){const{auth:e,db:t,functions:n,storage:s,appCheck:i,session:o,payments:B}=r;if(!xc(o))throw new Error("A verified web-capable backend is required.");const u=e.currentUser;let c=!1;const h=new Set;function d(){c=!0;for(const v of[...h])try{v()}catch{}h.clear()}function C(v){if(v!=null&&v.aborted)throw new Error("Upload cancelled.");if(c||!u||e.currentUser!==u||u.uid!==o.uid)throw d(),new Error("The account changed. Sign in again before continuing.")}const g=xd(e,v=>{if(v!==u||(v==null?void 0:v.uid)!==o.uid){d();return}D().catch(()=>d())});async function D(v){C(v);const M=await Du(u);if(C(v),!Ng(u.uid,M.claims,o))throw d(),new Error("This session has not been admitted by the BeAnywhere identity service.")}async function P(v){await D(v),await BC(i),C(v)}async function N(v,M,K=12e4,Z){await P(Z),C(Z);const Q=await Ks(n,v,K)(M);return C(Z),Q.data}function J(v,M){if(!v||v.orderId!==M||!["creating","open","paid","fulfilled","expired","refunded","needs-support"].includes(v.state)||!Number.isSafeInteger(v.amountMinor)||v.amountMinor<50||v.currency!=="usd"||!(v.checkoutId===null||/^cs_(test|live)_[A-Za-z0-9]+$/.test(v.checkoutId))||!(v.jobId===null||typeof v.jobId=="string"&&/^[A-Za-z0-9_:-]{1,128}$/.test(v.jobId))||v.state==="fulfilled"&&!v.jobId)throw new Error("Checkout does not match this order.");if(v.checkoutUrl!==null){if(typeof v.checkoutUrl!="string"||v.state!=="open"||!v.checkoutId)throw new Error("Checkout does not match this order.");const K=new URL(v.checkoutUrl);if(K.protocol!=="https:"||K.username||K.password||!r.checkoutOrigins.includes(K.origin))throw new Error("This checkout destination is not approved.")}return v}return{session:{uid:o.uid,webAppId:o.webAppId,capabilityVersion:1},dispose(){g(),d()},async recordEvent(v,M,K,Z=Date.now(),Q){return N("recordClientEvent",{name:v,params:M,eventId:K,expectedUid:o.uid,occurredAtMs:Z,...Q!=null&&Q.enabled?{context:Q}:{}},1e4)},getAnalyticsProfile(){return N("getLaunchProfile",{})},setAnalyticsPreference(v,M){return N("setLaunchPreferences",{analytics:v,expectedUid:o.uid,noticeVersion:2,expectedRevisions:{analytics:M}})},recordWebObservation(v){return N("recordWebObservation",v,1e4)},async catalog(){await P(),C();const v=await Gf(TB(t,"packs"));return C(),v.docs.filter(M=>M.data().active!==!1).map(M=>{const K=M.data();return{packId:M.id,title:String(K.title),tagline:String(K.tagline),productId:String(K.productId),sort:Number(K.sort)||0,stripVersion:Number(K.stripVersion)||1,scenes:K.scenes.map(Z=>({sceneId:Z.sceneId,label:Z.label})),styleDirections:K.styleDirections}}).sort((M,K)=>M.sort-K.sort)},checkPackReadiness(v,M,K){return N("checkPackReadiness",{packId:Pt(v),styling:M,styleId:Pt(K)})},async recordConsent(v,M){await P(),C(),await nv(Gs(t,"users",o.uid),{consentAt:tI(),consentVersion:1,styling:v,wearsGlasses:M},{merge:!0}),C()},async uploadReferences(v,M,K,Z,Q){if(C(Q),v.length<4||v.length>6||v.some(me=>me.type!=="image/jpeg"||me.size<1024||me.size>=8*1024*1024))throw new Error("Prepare 4–6 JPEG files of 1 KB–8 MB each.");if(!/^[A-Za-z0-9_-]{16,128}$/.test(M))throw new Error("Persist a valid upload attempt ID before starting.");const w=await N("createReferenceUploadSession",{count:v.length,clientAttemptId:M,wearsGlasses:K},12e4,Q);if(!w||!/^[A-Za-z0-9_-]{1,128}$/.test(w.sessionId)||!Number.isFinite(w.expiresAtMs)||w.expiresAtMs<=Date.now()||!["open","finalizing","completed"].includes(w.uploadStatus)||!Array.isArray(w.fullPaths)||!Array.isArray(w.thumbPaths)||w.thumbPaths.length!==v.length||w.thumbPaths.some((me,we)=>me!==`refs/${o.uid}/${w.sessionId}/${we}_thumb.jpg`)||w.fullPaths.length!==v.length||w.fullPaths.some((me,we)=>me!==`refs/${o.uid}/${w.sessionId}/${we}.jpg`))throw new Error("Unexpected upload destination.");if(w.uploadStatus==="finalizing")throw new Error("Your photos are still being checked. Try again shortly.");const m=v.map(()=>0),T=v.reduce((me,we)=>me+we.size,0),b=()=>Z(m.reduce((me,we,Dn)=>me+we*v[Dn].size,0)/T),R=async me=>{C(Q);try{const we=await kb(NB(s,w.fullPaths[me]));if(C(Q),we.fullPath!==w.fullPaths[me]||we.size!==v[me].size||we.contentType!=="image/jpeg")throw new Error("A saved selfie does not match this upload. Edit your selfies before trying again.");return!0}catch(we){if(C(Q),we.code==="storage/object-not-found")return!1;throw we}},O=new Set;let y=0,Re=!1,Ht;const Hi=async()=>{for(;w.uploadStatus==="open"&&y<v.length&&!Re;){const me=y++;try{if(await P(Q),C(Q),Re)return;if(w.replayed&&await R(me)){m[me]=1,Re||b();continue}if(Re)return;const we=Lb(NB(s,w.fullPaths[me]),v[me],{contentType:"image/jpeg",cacheControl:"private,max-age=86400"});let Dn=!1;const sn=()=>{Dn||(Dn=!0,we.cancel())};O.add(sn),h.add(sn),Q==null||Q.addEventListener("abort",sn,{once:!0});try{await new Promise((er,Ji)=>we.on("state_changed",tr=>{!(Q!=null&&Q.aborted)&&!c&&!Re&&e.currentUser===u&&(m[me]=tr.bytesTransferred/tr.totalBytes,b())},Ji,er))}catch(er){if(C(Q),!["storage/unauthorized","storage/retry-limit-exceeded","storage/unknown"].includes(er.code||"")||!await R(me))throw er}finally{Q==null||Q.removeEventListener("abort",sn),O.delete(sn),h.delete(sn)}C(Q),Re||(m[me]=1,b())}catch(we){if(!Re){Re=!0,Ht=we;for(const Dn of O)Dn()}}}};if(await Promise.all([Hi(),Hi()]),Re)throw Ht;Z(1);const Lr=await N("finalizeReferenceUploadSession",{sessionId:w.sessionId},12e4,Q);if(!Lr.completed)throw new Error("Reference validation is still pending. Retry with the same upload attempt ID.");if(!Array.isArray(Lr.fullPaths)||Lr.fullPaths.length!==v.length||Lr.fullPaths.some((me,we)=>me!==w.fullPaths[we]))throw new Error("Reference validation returned unexpected photos.");return await N("commitReferenceMetadata",{sessionId:w.sessionId},12e4,Q),Z(1),{...w,uploadStatus:"completed"}},createOrder(v){return N("createOrder",v)},getWebCheckoutCode(v){return N("getWebCheckoutCode",{checkoutKey:v})},claimWebCheckoutCode(v,M){return N("claimWebCheckoutCode",{checkoutKey:v,code:M})},async startWebComplimentaryCheckout(v,M,K){const Z=await N("startWebComplimentaryCheckout",{checkoutKey:v,orderId:M,email:K},95e3);if((Z==null?void 0:Z.kind)!=="complimentary"||Z.orderId!==M||typeof Z.jobId!="string"||!/^[A-Za-z0-9_-]{1,128}$/.test(Z.jobId))throw new Error("Your complimentary photoshoot could not be verified. Try again.");return Z},async beginWebCheckout(v,M,K){var Q;if(typeof M!="string"||M.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(M))throw new Error("Enter a valid delivery email address.");if(!((Q=r.checkoutOrigins)!=null&&Q.length))throw new Error("Approved checkout origins must be configured first.");await P(),C();const Z=await B.createCheckout(Pt(v),M,K);return C(),J(Z,v)},async reconcileWebCheckout(v){await P(),C();const M=await B.getCheckout(Pt(v));return C(),J(M,v)},async cancelWebCheckout(v){await P(),C();const M=await B.cancelCheckout(Pt(v));return C(),J(M,v)},async watchJob(v,M,K){await P(),C();let Z=!1,Q=()=>{};const w=()=>{Z||(Z=!0,Q(),h.delete(w),M(null))};return h.add(w),Q=Uf(Gs(t,"jobs",Pt(v)),m=>{if(!Z)try{C();const T=m.data();M(No(T,o.uid)?T:null)}catch(T){w(),K(T)}},m=>{Z||(w(),K(m))}),Z&&Q(),w},recoverGalleries(v){return N("recoverWebGalleries",{email:v,analytics:rd(),eventId:crypto.randomUUID()})},listWebGalleries(v){return N("listWebGalleries",v?{cursor:v}:{})},async galleryPhoto(v,M){const K=await N("getWebGalleryPhoto",{jobId:Pt(v),path:M},6e4);if(K.contentType!=="image/jpeg"||typeof K.base64!="string")throw new Error("Photo unavailable.");const Z=Uint8Array.from(atob(K.base64),Q=>Q.charCodeAt(0));return new Blob([Z],{type:"image/jpeg"})},async assertGalleryPhotos(v,M){await N("assertWebGalleryPhotos",{jobId:Pt(v),paths:M})},async listJobs(){await P(),C();const v=await Gf(Ff(TB(t,"jobs"),go("uid","==",o.uid),go("clientVisible","==",!0),Lf("createdAt","desc"),kf(100)));return C(),v.docs.map(M=>({...M.data(),id:M.id})).filter(M=>No(M,o.uid)).sort((M,K)=>{var Z,Q;return(((Z=K.createdAt)==null?void 0:Z.seconds)||0)-(((Q=M.createdAt)==null?void 0:Q.seconds)||0)})},async watchJobs(v,M){await P(),C();let K=!1,Z=()=>{};const Q=()=>{K||(K=!0,Z(),h.delete(Q),v([]))};return h.add(Q),Z=Uf(Ff(TB(t,"jobs"),go("uid","==",o.uid),go("clientVisible","==",!0),Lf("createdAt","desc"),kf(100)),w=>{if(!K)try{C(),v(w.docs.map(m=>({...m.data(),id:m.id})).filter(m=>No(m,o.uid)))}catch(m){Q(),M(m)}},w=>{K||(Q(),M(w))}),K&&Z(),Q},async assertPhotos(v,M){await P();const K=(await bB(Gs(t,"jobs",Pt(v)))).data();if(C(),!K||!M.length||!M.every(Z=>FB(K,o.uid,Z,v)))throw new Error("These photos are no longer available. Refresh your gallery.")},async download(v,M){await P(),C();const K=await bB(Gs(t,"jobs",Pt(v)));C();const Z=K.data();if(!Z||!FB(Z,o.uid,M,v))throw new Error("This photo is no longer available.");const Q=await Mb(NB(s,M),20*1024*1024);await P(),C();const w=(await bB(Gs(t,"jobs",v))).data();if(C(),!w||!FB(w,o.uid,M,v))throw new Error("Photo access changed while downloading.");return Q},reshoot(v){if(v.uid!==o.uid)throw new Error("Account mismatch.");return N("reshootSlot",v,18e4)},reshootStatus(v){if(v.uid!==o.uid)throw new Error("Account mismatch.");return N("getReshootOperationStatus",v,15e3)},retrySlot(v,M){return N("retrySlot",{jobId:Pt(v),slotId:Pt(M)},18e4)},deleteAllPhotos(){return N("deleteMyPhotos",{})}}}const ed="browser-secret-v1",Jb=/^[a-f0-9]{64}$/;async function jb(r="beanywhere-web-identity-v1"){const e=await lm(r,1,{upgrade(t){t.createObjectStore("identity")}});try{const t=e.transaction("identity","readwrite"),n=await t.store.get(ed);if(n!==void 0){if(await t.done,typeof n!="string"||!Jb.test(n))throw new Error("Your saved sign-in needs recovery. Do not clear browser storage if you have a paid shoot.");return n}const s=Array.from(crypto.getRandomValues(new Uint8Array(32)),i=>i.toString(16).padStart(2,"0")).join("");return await t.store.add(s,ed),await t.done,s}finally{e.close()}}const td="beanywhere-web-studio";let nd,LB,kB;function Xb(r){hm(r);const e=JSON.stringify(r);if(LB&&LB!==e)throw new Error("The studio connection changed. Reload this page before continuing.");return LB=e,nd??(nd=qb(r).catch(t=>{throw nd=void 0,t}))}async function qb(r){const e=xE().find(g=>g.name===td)||fd(r.firebase,td);if(e.options.appId!==r.firebase.appId||e.options.projectId!==r.firebase.projectId)throw new Error("The studio connection does not match this website.");kB??(kB=Rw(e,{provider:new Su(r.appCheckSiteKey),isTokenAutoRefreshEnabled:!0}));const t=jD(e),[n]=await Promise.all([jb(),BC(kB),(async()=>{await N_(t,zd),await t.authStateReady()})()]),s=t.currentUser,i=yv(e,r.functionsRegion),B=(await Ks(i,"authWithWebSession",3e4)({secret:n,reuseExistingAuth:!!s})).data;if(!xc(B)||B.webAppId!==r.firebase.appId)throw new Error("The studio could not verify your browser session.");let u;if(B.reuseExistingAuth===!0){if(!s||t.currentUser!==s||s.uid!==B.uid)throw new Error("The studio could not verify your sign-in.");u=s}else{if(typeof B.customToken!="string"||!B.customToken)throw new Error("The studio could not verify your browser session.");({user:u}=await O_(t,B.customToken))}const c=await Du(u);if(t.currentUser!==u||!Ng(u.uid,c.claims,B))throw new Error("The studio could not verify your sign-in.");const h=Ks(i,"createWebCheckout",95e3),d=Ks(i,"getWebCheckoutStatus",25e3),C=Ks(i,"cancelWebCheckout",95e3);return Hb({auth:t,appCheck:kB,functions:i,db:ZR(e),storage:xb(e),session:{uid:B.uid,webAppId:B.webAppId,capabilityVersion:1},checkoutOrigins:["https://checkout.stripe.com"],payments:{createCheckout:async(g,D,P)=>(await h({orderId:g,email:D,...P?{attribution:P}:{},analytics:rd()})).data,getCheckout:async g=>(await d({orderId:g})).data,cancelCheckout:async g=>(await C({orderId:g})).data}})}export{Xb as connectWebStudio,hm as validateStudioFirebaseConfig};
