export type Region='Asia'|'Europe'|'Africa'|'Americas'|'Middle East'|'Oceania'|'World';
export type Badge='OFFICIAL'|'CONFIRMED'|'REPORTED'|'CLAIM';
export type Scene='rocket'|'market'|'tariffs'|'treaty'|'court'|'tankers'|'refinery'|'rescue'|'port'|'clinic'|'city'|'stocks'|'asteroid';

export interface LeadStory{number:number;region:Region;badge:Badge;place:string;headline:string;deck:string;source:string;callout:string;scene:Scene;}
export interface BriefStory{number:number;region:Region;place:string;summary:string;source:string;}
export interface MapPoint{number:number;region:Region;location:readonly[longitude:number,latitude:number];}

export const PAGE={
  runningLeft:'THE WORLD IN ONE DAY',runningRight:'ALL 33 STORIES DATED WEDNESDAY 25 NOV',date:'Wednesday 25 November 2026',
  regionSummary:'33 stories, all dated 25 Nov 2026 · Asia 7 · Europe 6 · Africa 5 · Americas 5 · Middle East 4 · Oceania 4 · World 2',
  utcLabel:'THE DAY IN UTC',utcLine:'00:19 Shenzhou-24 launch · 01:38 M5.9 Balleny quake · 03:56 Tiangong dock · 06:30 KOSPI −6.16% · 13:30 US PCE 3.8% · 18:45 Hera live',
  map:'Where it happened',briefs:'Also on 25 November — 20 more stories',dateLabel:'DATE CHECK',badgeLegend:'Badges:',
}as const;

export const REGION_COUNTS:readonly{region:Region;count:number}[]=[
  {region:'Asia',count:7},{region:'Europe',count:6},{region:'Africa',count:5},{region:'Americas',count:5},{region:'Middle East',count:4},{region:'Oceania',count:4},{region:'World',count:2},
];
export const BADGE_LEGEND:readonly{badge:Badge;label:string}[]=[
  {badge:'OFFICIAL',label:'official record'},{badge:'CONFIRMED',label:'multi-wire'},{badge:'REPORTED',label:'monitor or press'},{badge:'CLAIM',label:'unverified'},
];

export const LEADS:readonly LeadStory[]=[
  {number:1,region:'Asia',badge:'OFFICIAL',place:'Jiuquan, China',headline:'Shenzhou-24 docks at Tiangong',deck:'Zeeshan Ali becomes first foreigner aboard; crew enters at 06:35 UTC',source:'Reuters · Xinhua · AP',callout:'03:56 UTC',scene:'rocket'},
  {number:2,region:'Asia',badge:'OFFICIAL',place:'Seoul, South Korea',headline:'KOSPI closes down 6.16%',deck:'Index ends at 4,697.51; Samsung −9.87%, SK hynix −11.05%',source:'Yonhap',callout:'−6.16%',scene:'market'},
  {number:3,region:'Americas',badge:'OFFICIAL',place:'Washington, US',headline:'USTR proposes new tariff caps',deck:'Section 301 action covers 14 economies; India faces up to 25%',source:'USTR · Reuters · Nikkei',callout:'UP TO 25%',scene:'tariffs'},
  {number:4,region:'Oceania',badge:'OFFICIAL',place:'Canberra, Australia',headline:'Australia–Solomons treaty signed',deck:'No foreign bases; China pact understood to expire April 2027',source:'BBC · AP · AAP',callout:'APR 2027',scene:'treaty'},
  {number:5,region:'Africa',badge:'OFFICIAL',place:'Cape Town, South Africa',headline:'Court sets Farmgate report aside',deck:'Ramaphosa’s Phala Phala panel ruled unlawful',source:'Reuters · CNBC Africa · IOL',callout:'SET ASIDE',scene:'court'},
  {number:6,region:'Middle East',badge:'CLAIM',place:'Strait of Hormuz',headline:'Iran says mines hit tankers',deck:'IRGC claim of two burning tankers is not independently verified',source:'Reuters · Arab News · Anadolu',callout:'HORMUZ',scene:'tankers'},
  {number:7,region:'Europe',badge:'REPORTED',place:'Samara, Russia',headline:'Drones strike Samara refineries',deck:'Fires ~800 km inside Russia; one killed; power outages',source:'DW · Kyiv Post · Independent',callout:'800 KM',scene:'refinery'},
  {number:8,region:'Americas',badge:'CONFIRMED',place:'Cartagena, Colombia',headline:'Cartagena hostages all rescued',deck:'~30 held at Éxito after botched heist; one gunman killed',source:'UPI · AFP · Euronews',callout:'~30 HELD',scene:'rescue'},
  {number:9,region:'Middle East',badge:'CONFIRMED',place:'Hodeidah, Yemen',headline:'Coalition strikes Hodeidah port',deck:'Saada and Amran also hit',source:'Reuters · Arab News · Al Arabiya',callout:'HODEIDAH',scene:'port'},
  {number:10,region:'Africa',badge:'REPORTED',place:'Beni, DR Congo',headline:'Families seek Ebola dead',deck:'Beni has ~650 deaths since May',source:'Reuters',callout:'~650 DEAD',scene:'clinic'},
  {number:11,region:'Europe',badge:'REPORTED',place:'Odesa & Kyiv, Ukraine',headline:'Strikes cut power and kill three',deck:'Outages spread across five regions',source:'Reuters · DW · Ukrinform',callout:'5 REGIONS',scene:'city'},
  {number:12,region:'Americas',badge:'CONFIRMED',place:'New York, US',headline:'Wall Street slides in AI rout',deck:'PCE 3.8%; Nasdaq 100 −4.0%',source:'Bloomberg · Reuters · AP',callout:'NDX −4.0%',scene:'stocks'},
  {number:13,region:'Europe',badge:'OFFICIAL',place:'Darmstadt, Germany',headline:'Hera reaches asteroid Dimorphos',deck:'First post-DART images unveiled live',source:'ESA · BBC News',callout:'18:45 UTC',scene:'asteroid'},
];

export const BRIEFS:readonly BriefStory[]=[
  {number:14,region:'Asia',place:'Tokyo',summary:'Services PPI +4.2%, 36-year high',source:'Reuters · BOJ · CNA'},
  {number:15,region:'Asia',place:'Dhaka',summary:'Garment wage raised 36%',source:'AP · Al Jazeera'},
  {number:16,region:'Asia',place:'Pyongyang',summary:'Sylvain Astier expelled in 48h',source:'AP · Euronews'},
  {number:17,region:'Asia',place:'Xiamen',summary:'Airline orders 50 Boeing MAX 8s',source:'Nikkei Asia · Benzinga'},
  {number:18,region:'Asia',place:'Jakarta',summary:'OECD accession review ~80% done',source:'ANTARA · CNBC'},
  {number:19,region:'Europe',place:'Warsaw',summary:'Border no-fly zone announced',source:'DW · The Guardian'},
  {number:20,region:'Europe',place:'Berlin',summary:'Merz warns Russia wants more',source:'DW'},
  {number:21,region:'Europe',place:'Paris / London',summary:'Eurostar strike cancels trains',source:'AP · ABC News'},
  {number:22,region:'Africa',place:'Khartoum / Damazin',summary:'Talks rejected; 19 killed',source:'SUNA · Reuters'},
  {number:23,region:'Africa',place:'Dakar',summary:'FA chief denies CAS contact claim',source:'AFP'},
  {number:24,region:'Africa',place:'Lusaka',summary:'Court hears Mundubile bail bid',source:'Lusaka Times'},
  {number:25,region:'Middle East',place:'Ras Tanura',summary:'Seven drones intercepted',source:'Reuters · Al Arabiya'},
  {number:26,region:'Middle East',place:'Gaza City',summary:'Strike kills Mohammad Abuelouf',source:'Reuters · AP · Arab News'},
  {number:27,region:'Americas',place:'Buenos Aires',summary:'Argentina enters recession',source:'EL PAÍS · Bloomberg'},
  {number:28,region:'Americas',place:'Middletown, Iowa',summary:'~5-ton lead azide blast set',source:'AP · US Army'},
  {number:29,region:'Oceania',place:'Canberra',summary:'October CPI rises to 4.9%',source:'ABC · ABS'},
  {number:30,region:'Oceania',place:'Port Moresby',summary:'Drought aid readied for 680,000',source:'RNZ · Pacific.scoop'},
  {number:31,region:'Oceania',place:'Balleny Islands',summary:'M5.9 quake; green alert',source:'USGS · GDACS'},
  {number:32,region:'World',place:'New York, UN',summary:'16 Days of Activism begins',source:'UN Press · UN Women'},
  {number:33,region:'World',place:'Geneva',summary:'Health manufacturing forum',source:'WHO · WTO'},
];

export const MAP_POINTS:readonly MapPoint[]=[
  {number:1,region:'Asia',location:[100.30,40.96]},{number:2,region:'Asia',location:[126.98,37.57]},{number:3,region:'Americas',location:[-77.04,38.90]},
  {number:4,region:'Oceania',location:[149.13,-35.28]},{number:5,region:'Africa',location:[18.42,-33.92]},{number:6,region:'Middle East',location:[56.25,26.57]},
  {number:7,region:'Europe',location:[50.15,53.20]},{number:8,region:'Americas',location:[-75.48,10.39]},{number:9,region:'Middle East',location:[42.95,14.80]},
  {number:10,region:'Africa',location:[29.47,0.49]},{number:11,region:'Europe',location:[30.62,48.47]},{number:12,region:'Americas',location:[-74.01,40.71]},
  {number:13,region:'Europe',location:[8.65,49.87]},{number:14,region:'Asia',location:[139.65,35.68]},{number:15,region:'Asia',location:[90.41,23.81]},
  {number:16,region:'Asia',location:[125.76,39.04]},{number:17,region:'Asia',location:[118.09,24.48]},{number:18,region:'Asia',location:[106.85,-6.21]},
  {number:19,region:'Europe',location:[21.01,52.23]},{number:20,region:'Europe',location:[13.40,52.52]},{number:21,region:'Europe',location:[2.35,48.86]},
  {number:22,region:'Africa',location:[32.56,15.50]},{number:23,region:'Africa',location:[-17.45,14.72]},{number:24,region:'Africa',location:[28.28,-15.42]},
  {number:25,region:'Middle East',location:[50.16,26.64]},{number:26,region:'Middle East',location:[34.47,31.50]},{number:27,region:'Americas',location:[-58.38,-34.60]},
  {number:28,region:'Americas',location:[-91.26,40.83]},{number:29,region:'Oceania',location:[149.13,-35.28]},{number:30,region:'Oceania',location:[147.18,-9.44]},
  {number:31,region:'Oceania',location:[170.94,-63.09]},{number:32,region:'World',location:[-74.00,40.75]},{number:33,region:'World',location:[6.14,46.20]},
];

export const DATE_PARAGRAPH='All 33 reports above occurred or were first reported on 25 Nov 2026 UTC. Earlier: 23 Nov — leaked Rosstat analysis (~490,334 Russian military deaths; Mediazona/BBC; Reuters pickup 25 Nov), Zambia treason certificate and Anmer Hall incident. 24 Nov — Riyadh PIF tower strike (11 wounded), Huawei Brooklyn verdict (10/12 counts), CAS restores Senegal AFCON title, WHO evacuates Akwe Ebola team, DRC cobalt halt and Bunia pullout, Lula signs Brazil fiscal law, Ethiopia polio Round 1 (21–24 Nov).';

export const ALL_DRAWN_STRINGS:readonly string[]=[
  PAGE.runningLeft,PAGE.runningRight,PAGE.date,PAGE.regionSummary,PAGE.utcLabel,PAGE.utcLine,
  ...LEADS.flatMap(s=>[String(s.number),`${s.region} · ${s.place}`,s.headline,s.deck,s.source,s.callout,s.badge]),
  PAGE.map,...MAP_POINTS.map(p=>String(p.number)),...REGION_COUNTS.map(r=>`${r.region} ${r.count}`),PAGE.badgeLegend,...BADGE_LEGEND.flatMap(b=>[b.badge,b.label]),
  PAGE.briefs,...BRIEFS.flatMap(s=>[String(s.number),`${s.place} · ${s.summary}`,s.source]),PAGE.dateLabel,DATE_PARAGRAPH,
];
