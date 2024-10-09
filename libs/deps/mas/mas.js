var cs=Object.create;var Yt=Object.defineProperty;var ls=Object.getOwnPropertyDescriptor;var hs=Object.getOwnPropertyNames;var us=Object.getPrototypeOf,ds=Object.prototype.hasOwnProperty;var Ni=e=>{throw TypeError(e)};var ms=(e,t,r)=>t in e?Yt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var ps=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),fs=(e,t)=>{for(var r in t)Yt(e,r,{get:t[r],enumerable:!0})},gs=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of hs(t))!ds.call(e,i)&&i!==r&&Yt(e,i,{get:()=>t[i],enumerable:!(n=ls(t,i))||n.enumerable});return e};var xs=(e,t,r)=>(r=e!=null?cs(us(e)):{},gs(t||!e||!e.__esModule?Yt(r,"default",{value:e,enumerable:!0}):r,e));var x=(e,t,r)=>ms(e,typeof t!="symbol"?t+"":t,r),ki=(e,t,r)=>t.has(e)||Ni("Cannot "+r);var W=(e,t,r)=>(ki(e,t,"read from private field"),r?r.call(e):t.get(e)),ze=(e,t,r)=>t.has(e)?Ni("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),vt=(e,t,r,n)=>(ki(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r);var jo=ps((ld,ml)=>{ml.exports={total:38,offset:0,limit:38,data:[{lang:"ar",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u0627\u0644\u0634\u0647\u0631} YEAR {/\u0627\u0644\u0639\u0627\u0645} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u0643\u0644 \u0634\u0647\u0631} YEAR {\u0643\u0644 \u0639\u0627\u0645} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0644\u0643\u0644 \u062A\u0631\u062E\u064A\u0635} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0644\u0643\u0644 \u062A\u0631\u062E\u064A\u0635} other {}}",freeLabel:"\u0645\u062C\u0627\u0646\u064B\u0627",freeAriaLabel:"\u0645\u062C\u0627\u0646\u064B\u0627",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u0623\u0648 \u0628\u062F\u0644\u0627\u064B \u0645\u0646 \u0630\u0644\u0643 \u0628\u0642\u064A\u0645\u0629 {alternativePrice}",strikethroughAriaLabel:"\u0628\u0634\u0643\u0644 \u0645\u0646\u062A\u0638\u0645 \u0628\u0642\u064A\u0645\u0629 {strikethroughPrice}"},{lang:"bg",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u043C\u0435\u0441.} YEAR {/\u0433\u043E\u0434.} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u043D\u0430 \u043C\u0435\u0441\u0435\u0446} YEAR {\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u043D\u0430 \u043B\u0438\u0446\u0435\u043D\u0437} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u043D\u0430 \u043B\u0438\u0446\u0435\u043D\u0437} other {}}",freeLabel:"\u0411\u0435\u0437\u043F\u043B\u0430\u0442\u043D\u043E",freeAriaLabel:"\u0411\u0435\u0437\u043F\u043B\u0430\u0442\u043D\u043E",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u0410\u043B\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u043E \u043D\u0430 {alternativePrice}",strikethroughAriaLabel:"\u0420\u0435\u0434\u043E\u0432\u043D\u043E \u043D\u0430 {strikethroughPrice}"},{lang:"cs",recurrenceLabel:"{recurrenceTerm, select, MONTH {/m\u011Bs\xEDc} YEAR {/rok} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {za m\u011Bs\xEDc} YEAR {za rok} other {}}",perUnitLabel:"{perUnit, select, LICENSE {za licenci} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {za licenci} other {}}",freeLabel:"Zdarma",freeAriaLabel:"Zdarma",taxExclusiveLabel:"{taxTerm, select, GST {bez dan\u011B ze zbo\u017E\xED a slu\u017Eeb} VAT {bez DPH} TAX {bez dan\u011B} IVA {bez IVA} SST {bez SST} KDV {bez KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {v\u010Detn\u011B dan\u011B ze zbo\u017E\xED a slu\u017Eeb} VAT {v\u010Detn\u011B DPH} TAX {v\u010Detn\u011B dan\u011B} IVA {v\u010Detn\u011B IVA} SST {v\u010Detn\u011B SST} KDV {v\u010Detn\u011B KDV} other {}}",alternativePriceAriaLabel:"P\u0159\xEDpadn\u011B za {alternativePrice}",strikethroughAriaLabel:"Pravideln\u011B za {strikethroughPrice}"},{lang:"da",recurrenceLabel:"{recurrenceTerm, select, MONTH {/md} YEAR {/\xE5r} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {pr. m\xE5ned} YEAR {pr. \xE5r} other {}}",perUnitLabel:"{perUnit, select, LICENSE {pr. licens} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {pr. licens} other {}}",freeLabel:"Gratis",freeAriaLabel:"Gratis",taxExclusiveLabel:"{taxTerm, select, GST {ekskl. GST} VAT {ekskl. moms} TAX {ekskl. skat} IVA {ekskl. IVA} SST {ekskl. SST} KDV {ekskl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. skat} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativt til {alternativePrice}",strikethroughAriaLabel:"Normalpris {strikethroughPrice}"},{lang:"de",recurrenceLabel:"{recurrenceTerm, select, MONTH {/Monat} YEAR {/Jahr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {pro Monat} YEAR {pro Jahr} other {}}",perUnitLabel:"{perUnit, select, LICENSE {pro Lizenz} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {pro Lizenz} other {}}",freeLabel:"Kostenlos",freeAriaLabel:"Kostenlos",taxExclusiveLabel:"{taxTerm, select, GST {zzgl. GST} VAT {zzgl. MwSt.} TAX {zzgl. Steuern} IVA {zzgl. IVA} SST {zzgl. SST} KDV {zzgl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. MwSt.} TAX {inkl. Steuern} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativ: {alternativePrice}",strikethroughAriaLabel:"Regul\xE4r: {strikethroughPrice}"},{lang:"en",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at {alternativePrice}",strikethroughAriaLabel:"Regularly at {strikethroughPrice}"},{lang:"et",recurrenceLabel:"{recurrenceTerm, select, MONTH {kuus} YEAR {aastas} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {kuus} YEAR {aastas} other {}}",perUnitLabel:"{perUnit, select, LICENSE {litsentsi kohta} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {litsentsi kohta} other {}}",freeLabel:"Tasuta",freeAriaLabel:"Tasuta",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Teise v\xF5imalusena hinnaga {alternativePrice}",strikethroughAriaLabel:"Tavahind {strikethroughPrice}"},{lang:"fi",recurrenceLabel:"{recurrenceTerm, select, MONTH {/kk} YEAR {/v} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {kuukausittain} YEAR {vuosittain} other {}}",perUnitLabel:"{perUnit, select, LICENSE {k\xE4ytt\xF6oikeutta kohti} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {k\xE4ytt\xF6oikeutta kohti} other {}}",freeLabel:"Maksuton",freeAriaLabel:"Maksuton",taxExclusiveLabel:"{taxTerm, select, GST {ilman GST:t\xE4} VAT {ilman ALV:t\xE4} TAX {ilman veroja} IVA {ilman IVA:ta} SST {ilman SST:t\xE4} KDV {ilman KDV:t\xE4} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {sis. GST:n} VAT {sis. ALV:n} TAX {sis. verot} IVA {sis. IVA:n} SST {sis. SST:n} KDV {sis. KDV:n} other {}}",alternativePriceAriaLabel:"Vaihtoehtoisesti hintaan {alternativePrice}",strikethroughAriaLabel:"S\xE4\xE4nn\xF6llisesti hintaan {strikethroughPrice}"},{lang:"fr",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mois} YEAR {/an} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {par mois} YEAR {par an} other {}}",perUnitLabel:"{perUnit, select, LICENSE {par licence} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {par licence} other {}}",freeLabel:"Gratuit",freeAriaLabel:"Gratuit",taxExclusiveLabel:"{taxTerm, select, GST {hors TPS} VAT {hors TVA} TAX {hors taxes} IVA {hors IVA} SST {hors SST} KDV {hors KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {TPS comprise} VAT {TVA comprise} TAX {taxes comprises} IVA {IVA comprise} SST {SST comprise} KDV {KDV comprise} other {}}",alternativePriceAriaLabel:"Autre prix {alternativePrice}",strikethroughAriaLabel:"Prix habituel {strikethroughPrice}"},{lang:"he",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u05D7\u05D5\u05D3\u05E9} YEAR {/\u05E9\u05E0\u05D4} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u05DC\u05D7\u05D5\u05D3\u05E9} YEAR {\u05DC\u05E9\u05E0\u05D4} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",freeLabel:"\u05D7\u05D9\u05E0\u05DD",freeAriaLabel:"\u05D7\u05D9\u05E0\u05DD",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u05DC\u05D7\u05DC\u05D5\u05E4\u05D9\u05DF \u05D1-{alternativePrice}",strikethroughAriaLabel:"\u05D1\u05D0\u05D5\u05E4\u05DF \u05E7\u05D1\u05D5\u05E2 \u05D1-{strikethroughPrice}"},{lang:"hu",recurrenceLabel:"{recurrenceTerm, select, MONTH {/h\xF3} YEAR {/\xE9v} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {havonta} YEAR {\xE9vente} other {}}",perUnitLabel:"{perUnit, select, LICENSE {licencenk\xE9nt} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {licencenk\xE9nt} other {}}",freeLabel:"Ingyenes",freeAriaLabel:"Ingyenes",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"M\xE1sik lehet\u0151s\xE9g: {alternativePrice}",strikethroughAriaLabel:"\xC1ltal\xE1ban {strikethroughPrice} \xE1ron"},{lang:"it",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mese} YEAR {/anno} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {al mese} YEAR {all'anno} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per licenza} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per licenza} other {}}",freeLabel:"Gratuito",freeAriaLabel:"Gratuito",taxExclusiveLabel:"{taxTerm, select, GST {escl. GST} VAT {escl. IVA.} TAX {escl. imposte} IVA {escl. IVA} SST {escl. SST} KDV {escl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. IVA} TAX {incl. imposte} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"In alternativa a {alternativePrice}",strikethroughAriaLabel:"Regolarmente a {strikethroughPrice}"},{lang:"ja",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u6BCE\u6708} YEAR {\u6BCE\u5E74} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u30E9\u30A4\u30BB\u30F3\u30B9\u3054\u3068} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u30E9\u30A4\u30BB\u30F3\u30B9\u3054\u3068} other {}}",freeLabel:"\u7121\u6599",freeAriaLabel:"\u7121\u6599",taxExclusiveLabel:"{taxTerm, select, GST {GST \u5225} VAT {VAT \u5225} TAX {\u7A0E\u5225} IVA {IVA \u5225} SST {SST \u5225} KDV {KDV \u5225} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST \u8FBC} VAT {VAT \u8FBC} TAX {\u7A0E\u8FBC} IVA {IVA \u8FBC} SST {SST \u8FBC} KDV {KDV \u8FBC} other {}}",alternativePriceAriaLabel:"\u7279\u5225\u4FA1\u683C : {alternativePrice}",strikethroughAriaLabel:"\u901A\u5E38\u4FA1\u683C : {strikethroughPrice}"},{lang:"ko",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\uC6D4} YEAR {/\uB144} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\uC6D4\uAC04} YEAR {\uC5F0\uAC04} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\uB77C\uC774\uC120\uC2A4\uB2F9} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\uB77C\uC774\uC120\uC2A4\uB2F9} other {}}",freeLabel:"\uBB34\uB8CC",freeAriaLabel:"\uBB34\uB8CC",taxExclusiveLabel:"{taxTerm, select, GST {GST \uC81C\uC678} VAT {VAT \uC81C\uC678} TAX {\uC138\uAE08 \uC81C\uC678} IVA {IVA \uC81C\uC678} SST {SST \uC81C\uC678} KDV {KDV \uC81C\uC678} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST \uD3EC\uD568} VAT {VAT \uD3EC\uD568} TAX {\uC138\uAE08 \uD3EC\uD568} IVA {IVA \uD3EC\uD568} SST {SST \uD3EC\uD568} KDV {KDV \uD3EC\uD568} other {}}",alternativePriceAriaLabel:"\uB610\uB294 {alternativePrice}\uC5D0",strikethroughAriaLabel:"\uB610\uB294 {alternativePrice}\uC5D0"},{lang:"lt",recurrenceLabel:"{recurrenceTerm, select, MONTH { per m\u0117n.} YEAR { per metus} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per m\u0117n.} YEAR {per metus} other {}}",perUnitLabel:"{perUnit, select, LICENSE {u\u017E licencij\u0105} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {u\u017E licencij\u0105} other {}}",freeLabel:"Nemokamai",freeAriaLabel:"Nemokamai",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Arba u\u017E {alternativePrice}",strikethroughAriaLabel:"Normaliai u\u017E {strikethroughPrice}"},{lang:"lv",recurrenceLabel:"{recurrenceTerm, select, MONTH {m\u0113nes\u012B} YEAR {gad\u0101} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {m\u0113nes\u012B} YEAR {gad\u0101} other {}}",perUnitLabel:"{perUnit, select, LICENSE {vienai licencei} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {vienai licencei} other {}}",freeLabel:"Bezmaksas",freeAriaLabel:"Bezmaksas",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternat\u012Bvi par {alternativePrice}",strikethroughAriaLabel:"Regul\u0101ri par {strikethroughPrice}"},{lang:"nb",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mnd.} YEAR {/\xE5r} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per m\xE5ned} YEAR {per \xE5r} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per lisens} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per lisens} other {}}",freeLabel:"Fri",freeAriaLabel:"Fri",taxExclusiveLabel:"{taxTerm, select, GST {ekskl. GST} VAT {ekskl. moms} TAX {ekskl. avgift} IVA {ekskl. IVA} SST {ekskl. SST} KDV {ekskl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. avgift} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativt til {alternativePrice}",strikethroughAriaLabel:"Regelmessig til {strikethroughPrice}"},{lang:"nl",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mnd} YEAR {/jr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per maand} YEAR {per jaar} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per licentie} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per licentie} other {}}",freeLabel:"Gratis",freeAriaLabel:"Gratis",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. btw} TAX {excl. belasting} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. btw} TAX {incl. belasting} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Nu {alternativePrice}",strikethroughAriaLabel:"Normaal {strikethroughPrice}"},{lang:"pl",recurrenceLabel:"{recurrenceTerm, select, MONTH { / mies.} YEAR { / rok} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH { / miesi\u0105c} YEAR { / rok} other {}}",perUnitLabel:"{perUnit, select, LICENSE {za licencj\u0119} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {za licencj\u0119} other {}}",freeLabel:"Bezp\u0142atne",freeAriaLabel:"Bezp\u0142atne",taxExclusiveLabel:"{taxTerm, select, GST {bez GST} VAT {bez VAT} TAX {netto} IVA {bez IVA} SST {bez SST} KDV {bez KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {z GST} VAT {z VAT} TAX {brutto} IVA {z IVA} SST {z SST} KDV {z KDV} other {}}",alternativePriceAriaLabel:"Lub za {alternativePrice}",strikethroughAriaLabel:"Cena zwyk\u0142a: {strikethroughPrice}"},{lang:"pt",recurrenceLabel:"{recurrenceTerm, select, MONTH {/m\xEAs} YEAR {/ano} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {por m\xEAs} YEAR {por ano} other {}}",perUnitLabel:"{perUnit, select, LICENSE {por licen\xE7a} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {por licen\xE7a} other {}}",freeLabel:"Gratuito",freeAriaLabel:"Gratuito",taxExclusiveLabel:"{taxTerm, select, GST {ICMS n\xE3o incluso} VAT {IVA n\xE3o incluso} TAX {impostos n\xE3o inclusos} IVA {IVA n\xE3o incluso} SST { SST n\xE3o incluso} KDV {KDV n\xE3o incluso} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {ICMS incluso} VAT {IVA incluso} TAX {impostos inclusos} IVA {IVA incluso} SST {SST incluso} KDV {KDV incluso} other {}}",alternativePriceAriaLabel:"Ou a {alternativePrice}",strikethroughAriaLabel:"Pre\xE7o normal: {strikethroughPrice}"},{lang:"ro",recurrenceLabel:"{recurrenceTerm, select, MONTH {/lun\u0103} YEAR {/an} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {pe lun\u0103} YEAR {pe an} other {}}",perUnitLabel:"{perUnit, select, LICENSE {pe licen\u021B\u0103} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {pe licen\u021B\u0103} other {}}",freeLabel:"Gratuit",freeAriaLabel:"Gratuit",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternativ, la {alternativePrice}",strikethroughAriaLabel:"\xCEn mod normal, la {strikethroughPrice}"},{lang:"ru",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u043C\u0435\u0441.} YEAR {/\u0433.} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u0432 \u043C\u0435\u0441\u044F\u0446} YEAR {\u0432 \u0433\u043E\u0434} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u044E} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u044E} other {}}",freeLabel:"\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E",freeAriaLabel:"\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E",taxExclusiveLabel:"{taxTerm, select, GST {\u0438\u0441\u043A\u043B. \u043D\u0430\u043B\u043E\u0433 \u043D\u0430 \u0442\u043E\u0432\u0430\u0440\u044B \u0438 \u0443\u0441\u043B\u0443\u0433\u0438} VAT {\u0438\u0441\u043A\u043B. \u041D\u0414\u0421} TAX {\u0438\u0441\u043A\u043B. \u043D\u0430\u043B\u043E\u0433} IVA {\u0438\u0441\u043A\u043B. \u0418\u0412\u0410} SST {\u0438\u0441\u043A\u043B. SST} KDV {\u0438\u0441\u043A\u043B. \u041A\u0414\u0412} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u0432\u043A\u043B. \u043D\u0430\u043B\u043E\u0433 \u043D\u0430 \u0442\u043E\u0432\u0430\u0440\u044B \u0438 \u0443\u0441\u043B\u0443\u0433\u0438} VAT {\u0432\u043A\u043B. \u041D\u0414\u0421} TAX {\u0432\u043A\u043B. \u043D\u0430\u043B\u043E\u0433} IVA {\u0432\u043A\u043B. \u0418\u0412\u0410} SST {\u0432\u043A\u043B. SST} KDV {\u0432\u043A\u043B. \u041A\u0414\u0412} other {}}",alternativePriceAriaLabel:"\u0410\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442 \u0437\u0430 {alternativePrice}",strikethroughAriaLabel:"\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E \u043F\u043E \u0446\u0435\u043D\u0435 {strikethroughPrice}"},{lang:"sk",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mesiac} YEAR {/rok} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {za mesiac} YEAR {za rok} other {}}",perUnitLabel:"{perUnit, select, LICENSE {za licenciu} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {za licenciu} other {}}",freeLabel:"Zadarmo",freeAriaLabel:"Zadarmo",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Pr\xEDpadne za {alternativePrice}",strikethroughAriaLabel:"Pravidelne za {strikethroughPrice}"},{lang:"sl",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mesec} YEAR {/leto} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {na mesec} YEAR {na leto} other {}}",perUnitLabel:"{perUnit, select, LICENSE {na licenco} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {na licenco} other {}}",freeLabel:"Brezpla\u010Dno",freeAriaLabel:"Brezpla\u010Dno",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Druga mo\u017Enost je: {alternativePrice}",strikethroughAriaLabel:"Redno po {strikethroughPrice}"},{lang:"sv",recurrenceLabel:"{recurrenceTerm, select, MONTH {/m\xE5n} YEAR {/\xE5r} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per m\xE5nad} YEAR {per \xE5r} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per licens} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per licens} other {}}",freeLabel:"Kostnadsfritt",freeAriaLabel:"Kostnadsfritt",taxExclusiveLabel:"{taxTerm, select, GST {exkl. GST} VAT {exkl. moms} TAX {exkl. skatt} IVA {exkl. IVA} SST {exkl. SST} KDV {exkl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. skatt} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativt f\xF6r {alternativePrice}",strikethroughAriaLabel:"Normalpris {strikethroughPrice}"},{lang:"tr",recurrenceLabel:"{recurrenceTerm, select, MONTH {/ay} YEAR {/y\u0131l} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {(ayl\u0131k)} YEAR {(y\u0131ll\u0131k)} other {}}",perUnitLabel:"{perUnit, select, LICENSE {(lisans ba\u015F\u0131na)} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {(lisans ba\u015F\u0131na)} other {}}",freeLabel:"\xDCcretsiz",freeAriaLabel:"\xDCcretsiz",taxExclusiveLabel:"{taxTerm, select, GST {GST hari\xE7} VAT {KDV hari\xE7} TAX {vergi hari\xE7} IVA {IVA hari\xE7} SST {SST hari\xE7} KDV {KDV hari\xE7} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST dahil} VAT {KDV dahil} TAX {vergi dahil} IVA {IVA dahil} SST {SST dahil} KDV {KDV dahil} other {}}",alternativePriceAriaLabel:"Ya da {alternativePrice}",strikethroughAriaLabel:"Standart fiyat: {strikethroughPrice}"},{lang:"uk",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u043C\u0456\u0441.} YEAR {/\u0440\u0456\u043A} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u043D\u0430 \u043C\u0456\u0441\u044F\u0446\u044C} YEAR {\u043D\u0430 \u0440\u0456\u043A} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0456\u0446\u0435\u043D\u0437\u0456\u044E} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0456\u0446\u0435\u043D\u0437\u0456\u044E} other {}}",freeLabel:"\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u043E",freeAriaLabel:"\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u043E",taxExclusiveLabel:"{taxTerm, select, GST {\u0431\u0435\u0437 GST} VAT {\u0431\u0435\u0437 \u041F\u0414\u0412} TAX {\u0431\u0435\u0437 \u043F\u043E\u0434\u0430\u0442\u043A\u0443} IVA {\u0431\u0435\u0437 IVA} SST {\u0431\u0435\u0437 SST} KDV {\u0431\u0435\u0437 KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 GST} VAT {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 \u041F\u0414\u0412} TAX {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 \u043F\u043E\u0434\u0430\u0442\u043A\u043E\u043C} IVA {\u0440\u0430\u0437\u043E\u043C \u0437 IVA} SST {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 SST} KDV {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 KDV} other {}}",alternativePriceAriaLabel:"\u0410\u0431\u043E \u0437\u0430 {alternativePrice}",strikethroughAriaLabel:"\u0417\u0432\u0438\u0447\u0430\u0439\u043D\u0430 \u0446\u0456\u043D\u0430 {strikethroughPrice}"},{lang:"zh-hans",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u6BCF\u6708} YEAR {\u6BCF\u5E74} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u6BCF\u4E2A\u8BB8\u53EF\u8BC1} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u6BCF\u4E2A\u8BB8\u53EF\u8BC1} other {}}",freeLabel:"\u514D\u8D39",freeAriaLabel:"\u514D\u8D39",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u6216\u5B9A\u4EF7 {alternativePrice}",strikethroughAriaLabel:"\u6B63\u5E38\u4EF7 {strikethroughPrice}"},{lang:"zh-hant",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u6BCF\u6708} YEAR {\u6BCF\u5E74} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u6BCF\u500B\u6388\u6B0A} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u6BCF\u500B\u6388\u6B0A} other {}}",freeLabel:"\u514D\u8CBB",freeAriaLabel:"\u514D\u8CBB",taxExclusiveLabel:"{taxTerm, select, GST {\u4E0D\u542B GST} VAT {\u4E0D\u542B VAT} TAX {\u4E0D\u542B\u7A05} IVA {\u4E0D\u542B IVA} SST {\u4E0D\u542B SST} KDV {\u4E0D\u542B KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u542B GST} VAT {\u542B VAT} TAX {\u542B\u7A05} IVA {\u542B IVA} SST {\u542B SST} KDV {\u542B KDV} other {}}",alternativePriceAriaLabel:"\u6216\u8005\u5728 {alternativePrice}",strikethroughAriaLabel:"\u6A19\u6E96\u50F9\u683C\u70BA {strikethroughPrice}"},{lang:"es",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mes} YEAR {/a\xF1o} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {al mes} YEAR {al a\xF1o} other {}}",perUnitLabel:"{perUnit, select, LICENSE {por licencia} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {por licencia} other {}}",freeLabel:"Gratuito",freeAriaLabel:"Gratuito",taxExclusiveLabel:"{taxTerm, select, GST {GST no incluido} VAT {IVA no incluido} TAX {Impuestos no incluidos} IVA {IVA no incluido} SST {SST no incluido} KDV {KDV no incluido} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST incluido} VAT {IVA incluido} TAX {Impuestos incluidos} IVA {IVA incluido} SST {SST incluido} KDV {KDV incluido} other {}}",alternativePriceAriaLabel:"Alternativamente por {alternativePrice}",strikethroughAriaLabel:"Normalmente a {strikethroughPrice}"},{lang:"in",recurrenceLabel:"{recurrenceTerm, select, MONTH {/bulan} YEAR {/tahun} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per bulan} YEAR {per tahun} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per lisensi} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per lisensi} other {}}",freeLabel:"Gratis",freeAriaLabel:"Gratis",taxExclusiveLabel:"{taxTerm, select, GST {tidak termasuk PBJ} VAT {tidak termasuk PPN} TAX {tidak termasuk pajak} IVA {tidak termasuk IVA} SST {tidak termasuk SST} KDV {tidak termasuk KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {termasuk PBJ} VAT {termasuk PPN} TAX {termasuk pajak} IVA {termasuk IVA} SST {termasuk SST} KDV {termasuk KDV} other {}}",alternativePriceAriaLabel:"Atau seharga {alternativePrice}",strikethroughAriaLabel:"Normalnya seharga {strikethroughPrice}"},{lang:"vi",recurrenceLabel:"{recurrenceTerm, select, MONTH {/th\xE1ng} YEAR {/n\u0103m} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {m\u1ED7i th\xE1ng} YEAR {m\u1ED7i n\u0103m} other {}}",perUnitLabel:"{perUnit, select, LICENSE {m\u1ED7i gi\u1EA5y ph\xE9p} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {m\u1ED7i gi\u1EA5y ph\xE9p} other {}}",freeLabel:"Mi\u1EC5n ph\xED",freeAriaLabel:"Mi\u1EC5n ph\xED",taxExclusiveLabel:"{taxTerm, select, GST {ch\u01B0a bao g\u1ED3m thu\u1EBF h\xE0ng h\xF3a v\xE0 d\u1ECBch v\u1EE5} VAT {ch\u01B0a bao g\u1ED3m thu\u1EBF GTGT} TAX {ch\u01B0a bao g\u1ED3m thu\u1EBF} IVA {ch\u01B0a bao g\u1ED3m IVA} SST {ch\u01B0a bao g\u1ED3m SST} KDV {ch\u01B0a bao g\u1ED3m KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {(\u0111\xE3 bao g\u1ED3m thu\u1EBF h\xE0ng h\xF3a v\xE0 d\u1ECBch v\u1EE5)} VAT {(\u0111\xE3 bao g\u1ED3m thu\u1EBF GTGT)} TAX {(\u0111\xE3 bao g\u1ED3m thu\u1EBF)} IVA {(\u0111\xE3 bao g\u1ED3m IVA)} SST {(\u0111\xE3 bao g\u1ED3m SST)} KDV {(\u0111\xE3 bao g\u1ED3m KDV)} other {}}",alternativePriceAriaLabel:"Gi\xE1 \u01B0u \u0111\xE3i {alternativePrice}",strikethroughAriaLabel:"Gi\xE1 th\xF4ng th\u01B0\u1EDDng {strikethroughPrice}"},{lang:"th",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u0E40\u0E14\u0E37\u0E2D\u0E19} YEAR {/\u0E1B\u0E35} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u0E15\u0E48\u0E2D\u0E40\u0E14\u0E37\u0E2D\u0E19} YEAR {\u0E15\u0E48\u0E2D\u0E1B\u0E35} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0E15\u0E48\u0E2D\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0E15\u0E48\u0E2D\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19} other {}}",freeLabel:"\u0E1F\u0E23\u0E35",freeAriaLabel:"\u0E1F\u0E23\u0E35",taxExclusiveLabel:"{taxTerm, select, GST {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35 GST} VAT {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 VAT} TAX {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35} IVA {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 IVA} SST {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 SST} KDV {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35 GST} VAT {\u0E23\u0E27\u0E21 VAT} TAX {\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35} IVA {\u0E23\u0E27\u0E21 IVA} SST {\u0E23\u0E27\u0E21 SST} KDV {\u0E23\u0E27\u0E21 KDV} other {}}",alternativePriceAriaLabel:"\u0E23\u0E32\u0E04\u0E32\u0E1E\u0E34\u0E40\u0E28\u0E29 {alternativePrice}",strikethroughAriaLabel:"\u0E23\u0E32\u0E04\u0E32\u0E1B\u0E01\u0E15\u0E34 {strikethroughPrice}"},{lang:"el",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u03BC\u03AE\u03BD\u03B1} YEAR {/\u03AD\u03C4\u03BF\u03C2} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u03BA\u03AC\u03B8\u03B5 \u03BC\u03AE\u03BD\u03B1} YEAR {\u03B1\u03BD\u03AC \u03AD\u03C4\u03BF\u03C2} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u03B1\u03BD\u03AC \u03AC\u03B4\u03B5\u03B9\u03B1 \u03C7\u03C1\u03AE\u03C3\u03B7\u03C2} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u03B1\u03BD\u03AC \u03AC\u03B4\u03B5\u03B9\u03B1 \u03C7\u03C1\u03AE\u03C3\u03B7\u03C2} other {}}",freeLabel:"\u0394\u03C9\u03C1\u03B5\u03AC\u03BD",freeAriaLabel:"\u0394\u03C9\u03C1\u03B5\u03AC\u03BD",taxExclusiveLabel:"{taxTerm, select, GST {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 GST)} VAT {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03A6\u03A0\u0391)} TAX {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C6\u03CC\u03C1\u03BF)} IVA {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 IVA)} SST {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 SST)} KDV {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 KDV)} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 GST)} VAT {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03A6\u03A0\u0391)} TAX {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 \u03C6\u03CC\u03C1\u03BF\u03C5)} IVA {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 IVA)} SST {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 SST)} KDV {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 KDV)} other {}}",alternativePriceAriaLabel:"\u0394\u03B9\u03B1\u03C6\u03BF\u03C1\u03B5\u03C4\u03B9\u03BA\u03AC, {alternativePrice}",strikethroughAriaLabel:"\u039A\u03B1\u03BD\u03BF\u03BD\u03B9\u03BA\u03AE \u03C4\u03B9\u03BC\u03AE {strikethroughPrice}"},{lang:"fil",recurrenceLabel:"{recurrenceTerm, select, MONTH {/buwan} YEAR {/taon} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per buwan} YEAR {per taon} other {}}",perUnitLabel:"{perUnit, select, LICENSE {kada lisensya} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {kada lisensya} other {}}",freeLabel:"Libre",freeAriaLabel:"Libre",taxExclusiveLabel:"{taxTerm, select, GST {hindi kasama ang GST} VAT {hindi kasama ang VAT} TAX {hindi kasama ang Buwis} IVA {hindi kasama ang IVA} SST {hindi kasama ang SST} KDV {hindi kasama ang KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {kasama ang GST} VAT {kasama ang VAT} TAX {kasama ang Buwis} IVA {kasama ang IVA} SST {kasama ang SST} KDV {kasama ang KDV} other {}}",alternativePriceAriaLabel:"Alternatibong nasa halagang {alternativePrice}",strikethroughAriaLabel:"Regular na nasa halagang {strikethroughPrice}"},{lang:"ms",recurrenceLabel:"{recurrenceTerm, select, MONTH {/bulan} YEAR {/tahun} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per bulan} YEAR {per tahun} other {}}",perUnitLabel:"{perUnit, select, LICENSE {setiap lesen} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {setiap lesen} other {}}",freeLabel:"Percuma",freeAriaLabel:"Percuma",taxExclusiveLabel:"{taxTerm, select, GST {kecuali GST} VAT {kecuali VAT} TAX {kecuali Cukai} IVA {kecuali IVA} SST {kecuali SST} KDV {kecuali KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {termasuk GST} VAT {termasuk VAT} TAX {termasuk Cukai} IVA {termasuk IVA} SST {termasuk SST} KDV {termasuk KDV} other {}}",alternativePriceAriaLabel:"Secara alternatif pada {alternativePrice}",strikethroughAriaLabel:"Biasanya pada {strikethroughPrice}"},{lang:"hi",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u092E\u093E\u0939} YEAR {/\u0935\u0930\u094D\u0937} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per \u092E\u093E\u0939} YEAR {per \u0935\u0930\u094D\u0937} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u092A\u094D\u0930\u0924\u093F \u0932\u093E\u0907\u0938\u0947\u0902\u0938} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u092A\u094D\u0930\u0924\u093F \u0932\u093E\u0907\u0938\u0947\u0902\u0938} other {}}",freeLabel:"\u092B\u093C\u094D\u0930\u0940",freeAriaLabel:"\u092B\u093C\u094D\u0930\u0940",taxExclusiveLabel:"{taxTerm, select, GST {GST \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} VAT {VAT \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} TAX {\u0915\u0930 \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} IVA {IVA \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} SST {SST \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} KDV {KDV \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST \u0938\u0939\u093F\u0924} VAT {VAT \u0938\u0939\u093F\u0924} TAX {\u0915\u0930 \u0938\u0939\u093F\u0924} IVA {IVA \u0938\u0939\u093F\u0924} SST {SST \u0938\u0939\u093F\u0924} KDV {KDV \u0938\u0939\u093F\u0924} other {}}",alternativePriceAriaLabel:"\u0935\u0948\u0915\u0932\u094D\u092A\u093F\u0915 \u0930\u0942\u092A \u0938\u0947 \u0907\u0938 \u092A\u0930 {alternativePrice}",strikethroughAriaLabel:"\u0928\u093F\u092F\u092E\u093F\u0924 \u0930\u0942\u092A \u0938\u0947 \u0907\u0938 \u092A\u0930 {strikethroughPrice}"},{lang:"iw",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u05D7\u05D5\u05D3\u05E9} YEAR {/\u05E9\u05E0\u05D4} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u05DC\u05D7\u05D5\u05D3\u05E9} YEAR {\u05DC\u05E9\u05E0\u05D4} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",freeLabel:"\u05D7\u05D9\u05E0\u05DD",freeAriaLabel:"\u05D7\u05D9\u05E0\u05DD",taxExclusiveLabel:'{taxTerm, select, GST {\u05DC\u05DC\u05D0 GST} VAT {\u05DC\u05DC\u05D0 \u05DE\u05E2"\u05DE} TAX {\u05DC\u05DC\u05D0 \u05DE\u05E1} IVA {\u05DC\u05DC\u05D0 IVA} SST {\u05DC\u05DC\u05D0 SST} KDV {\u05DC\u05DC\u05D0 KDV} other {}}',taxInclusiveLabel:'{taxTerm, select, GST {\u05DB\u05D5\u05DC\u05DC GST} VAT {\u05DB\u05D5\u05DC\u05DC \u05DE\u05E2"\u05DE} TAX {\u05DB\u05D5\u05DC\u05DC \u05DE\u05E1} IVA {\u05DB\u05D5\u05DC\u05DC IVA} SST {\u05DB\u05D5\u05DC\u05DC SST} KDV {\u05DB\u05D5\u05DC\u05DC KDV} other {}}',alternativePriceAriaLabel:"\u05DC\u05D7\u05DC\u05D5\u05E4\u05D9\u05DF \u05D1-{alternativePrice}",strikethroughAriaLabel:"\u05D1\u05D0\u05D5\u05E4\u05DF \u05E7\u05D1\u05D5\u05E2 \u05D1-{strikethroughPrice}"}],":type":"sheet"}});var bt;(function(e){e.STAGE="STAGE",e.PRODUCTION="PRODUCTION",e.LOCAL="LOCAL"})(bt||(bt={}));var Yr;(function(e){e.STAGE="STAGE",e.PRODUCTION="PROD",e.LOCAL="LOCAL"})(Yr||(Yr={}));var At;(function(e){e.DRAFT="DRAFT",e.PUBLISHED="PUBLISHED"})(At||(At={}));var ye;(function(e){e.V2="UCv2",e.V3="UCv3"})(ye||(ye={}));var q;(function(e){e.CHECKOUT="checkout",e.CHECKOUT_EMAIL="checkout/email",e.SEGMENTATION="segmentation",e.BUNDLE="bundle",e.COMMITMENT="commitment",e.RECOMMENDATION="recommendation",e.EMAIL="email",e.PAYMENT="payment",e.CHANGE_PLAN_TEAM_PLANS="change-plan/team-upgrade/plans",e.CHANGE_PLAN_TEAM_PAYMENT="change-plan/team-upgrade/payment"})(q||(q={}));var Xr=function(e){var t;return(t=vs.get(e))!==null&&t!==void 0?t:e},vs=new Map([["countrySpecific","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["offerType","ot"],["marketSegment","ms"]]);var Oi=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},Vi=function(e,t){var r=typeof Symbol=="function"&&e[Symbol.iterator];if(!r)return e;var n=r.call(e),i,o=[],a;try{for(;(t===void 0||t-- >0)&&!(i=n.next()).done;)o.push(i.value)}catch(s){a={error:s}}finally{try{i&&!i.done&&(r=n.return)&&r.call(n)}finally{if(a)throw a.error}}return o};function Fe(e,t,r){var n,i;try{for(var o=Oi(Object.entries(e)),a=o.next();!a.done;a=o.next()){var s=Vi(a.value,2),c=s[0],h=s[1],l=Xr(c);h!=null&&r.has(l)&&t.set(l,h)}}catch(u){n={error:u}}finally{try{a&&!a.done&&(i=o.return)&&i.call(o)}finally{if(n)throw n.error}}}function Xt(e){switch(e){case bt.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function Wt(e,t){var r,n;for(var i in e){var o=e[i];try{for(var a=(r=void 0,Oi(Object.entries(o))),s=a.next();!s.done;s=a.next()){var c=Vi(s.value,2),h=c[0],l=c[1];if(l!=null){var u=Xr(h);t.set("items["+i+"]["+u+"]",l)}}}catch(d){r={error:d}}finally{try{s&&!s.done&&(n=a.return)&&n.call(a)}finally{if(r)throw r.error}}}}var bs=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,n=Object.getOwnPropertySymbols(e);i<n.length;i++)t.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(e,n[i])&&(r[n[i]]=e[n[i]]);return r},As=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};function Ri(e){Ts(e);var t=e.env,r=e.items,n=e.workflowStep,i=bs(e,["env","items","workflowStep"]),o=new URL(Xt(t));return o.pathname=n+"/",Wt(r,o.searchParams),Fe(i,o.searchParams,Ss),o.toString()}var Ss=new Set(["cli","co","lang","ctx","cUrl","mv","nglwfdata","otac","promoid","rUrl","sdid","spint","trackingid","code","campaignid","appctxid"]),Es=["env","workflowStep","clientId","country","items"];function Ts(e){var t,r;try{for(var n=As(Es),i=n.next();!i.done;i=n.next()){var o=i.value;if(!e[o])throw new Error('Argument "checkoutData" is not valid, missing: '+o)}}catch(a){t={error:a}}finally{try{i&&!i.done&&(r=n.return)&&r.call(n)}finally{if(t)throw t.error}}return!0}var ys=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,n=Object.getOwnPropertySymbols(e);i<n.length;i++)t.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(e,n[i])&&(r[n[i]]=e[n[i]]);return r},_s=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},Ls="p_draft_landscape",ws="/store/";function qr(e){Cs(e);var t=e.env,r=e.items,n=e.workflowStep,i=e.ms,o=e.marketSegment,a=e.ot,s=e.offerType,c=e.pa,h=e.productArrangementCode,l=e.landscape,u=ys(e,["env","items","workflowStep","ms","marketSegment","ot","offerType","pa","productArrangementCode","landscape"]),d={marketSegment:o??i,offerType:s??a,productArrangementCode:h??c},m=new URL(Xt(t));return m.pathname=""+ws+n,n!==q.SEGMENTATION&&n!==q.CHANGE_PLAN_TEAM_PLANS&&Wt(r,m.searchParams),n===q.SEGMENTATION&&Fe(d,m.searchParams,Wr),Fe(u,m.searchParams,Wr),l===At.DRAFT&&Fe({af:Ls},m.searchParams,Wr),m.toString()}var Wr=new Set(["af","ai","apc","appctxid","cli","co","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),Ps=["env","workflowStep","clientId","country"];function Cs(e){var t,r;try{for(var n=_s(Ps),i=n.next();!i.done;i=n.next()){var o=i.value;if(!e[o])throw new Error('Argument "checkoutData" is not valid, missing: '+o)}}catch(a){t={error:a}}finally{try{i&&!i.done&&(r=n.return)&&r.call(n)}finally{if(t)throw t.error}}if(e.workflowStep!==q.SEGMENTATION&&e.workflowStep!==q.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}function Zr(e,t){switch(e){case ye.V2:return Ri(t);case ye.V3:return qr(t);default:return console.warn("Unsupported CheckoutType, will use UCv3 as default. Given type: "+e),qr(t)}}var Jr;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(Jr||(Jr={}));var M;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(M||(M={}));var V;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(V||(V={}));var Qr;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(Qr||(Qr={}));var en;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(en||(en={}));var tn;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(tn||(tn={}));var rn;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(rn||(rn={}));var $i="tacocat.js";var qt=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),Ui=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function R(e,t={},{metadata:r=!0,search:n=!0,storage:i=!0}={}){let o;if(n&&o==null){let a=new URLSearchParams(window.location.search),s=Be(n)?n:e;o=a.get(s)}if(i&&o==null){let a=Be(i)?i:e;o=window.sessionStorage.getItem(a)??window.localStorage.getItem(a)}if(r&&o==null){let a=Is(Be(r)?r:e);o=document.documentElement.querySelector(`meta[name="${a}"]`)?.content}return o??t[e]}var Ke=()=>{};var Mi=e=>typeof e=="boolean",me=e=>typeof e=="function",Zt=e=>typeof e=="number",Di=e=>e!=null&&typeof e=="object";var Be=e=>typeof e=="string",nn=e=>Be(e)&&e,je=e=>Zt(e)&&Number.isFinite(e)&&e>0;function Ye(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,n])=>{t(n)&&delete e[r]}),e}function y(e,t){if(Mi(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function pe(e,t,r){let n=Object.values(t);return n.find(i=>qt(i,e))??r??n[0]}function Is(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,n)=>`${r}-${n}`).replace(/\W+/gu,"-").toLowerCase()}function Xe(e,t=1){return Zt(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var Ns=Date.now(),on=()=>`(+${Date.now()-Ns}ms)`,Jt=new Set,ks=y(R("tacocat.debug",{},{metadata:!1}),typeof process<"u"&&process.env?.DEBUG);function Gi(e){let t=`[${$i}/${e}]`,r=(a,s,...c)=>a?!0:(i(s,...c),!1),n=ks?(a,...s)=>{console.debug(`${t} ${a}`,...s,on())}:()=>{},i=(a,...s)=>{let c=`${t} ${a}`;Jt.forEach(([h])=>h(c,...s))};return{assert:r,debug:n,error:i,warn:(a,...s)=>{let c=`${t} ${a}`;Jt.forEach(([,h])=>h(c,...s))}}}function Os(e,t){let r=[e,t];return Jt.add(r),()=>{Jt.delete(r)}}Os((e,...t)=>{console.error(e,...t,on())},(e,...t)=>{console.warn(e,...t,on())});var Vs="no promo",Hi="promo-tag",Rs="yellow",$s="neutral",Us=(e,t,r)=>{let n=o=>o||Vs,i=r?` (was "${n(t)}")`:"";return`${n(e)}${i}`},Ms="cancel-context",St=(e,t)=>{let r=e===Ms,n=!r&&e?.length>0,i=(n||r)&&(t&&t!=e||!t&&!r),o=i&&n||!i&&!!t,a=o?e||t:void 0;return{effectivePromoCode:a,overridenPromoCode:e,className:o?Hi:`${Hi} no-promo`,text:Us(a,t,i),variant:o?Rs:$s,isOverriden:i}};var an="ABM",sn="PUF",cn="M2M",ln="PERPETUAL",hn="P3Y",Ds="TAX_INCLUSIVE_DETAILS",Gs="TAX_EXCLUSIVE",zi={ABM:an,PUF:sn,M2M:cn,PERPETUAL:ln,P3Y:hn},fh={[an]:{commitment:M.YEAR,term:V.MONTHLY},[sn]:{commitment:M.YEAR,term:V.ANNUAL},[cn]:{commitment:M.MONTH,term:V.MONTHLY},[ln]:{commitment:M.PERPETUAL,term:void 0},[hn]:{commitment:M.THREE_MONTHS,term:V.P3Y}},Fi="Value is not an offer",un=e=>{if(typeof e!="object")return Fi;let{commitment:t,term:r}=e,n=Hs(t,r);return{...e,planType:n}};var Hs=(e,t)=>{switch(e){case void 0:return Fi;case"":return"";case M.YEAR:return t===V.MONTHLY?an:t===V.ANNUAL?sn:"";case M.MONTH:return t===V.MONTHLY?cn:"";case M.PERPETUAL:return ln;case M.TERM_LICENSE:return t===V.P3Y?hn:"";default:return""}};function dn(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:n,priceWithoutTax:i,priceWithoutDiscountAndTax:o,taxDisplay:a}=t;if(a!==Ds)return e;let s={...e,priceDetails:{...t,price:i??r,priceWithoutDiscount:o??n,taxDisplay:Gs}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var mn=function(e,t){return mn=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(r[i]=n[i])},mn(e,t)};function Et(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");mn(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var E=function(){return E=Object.assign||function(t){for(var r,n=1,i=arguments.length;n<i;n++){r=arguments[n];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o])}return t},E.apply(this,arguments)};function Qt(e,t,r){if(r||arguments.length===2)for(var n=0,i=t.length,o;n<i;n++)(o||!(n in t))&&(o||(o=Array.prototype.slice.call(t,0,n)),o[n]=t[n]);return e.concat(o||Array.prototype.slice.call(t))}var b;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(b||(b={}));var C;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(C||(C={}));var _e;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(_e||(_e={}));function pn(e){return e.type===C.literal}function Bi(e){return e.type===C.argument}function er(e){return e.type===C.number}function tr(e){return e.type===C.date}function rr(e){return e.type===C.time}function nr(e){return e.type===C.select}function ir(e){return e.type===C.plural}function Ki(e){return e.type===C.pound}function or(e){return e.type===C.tag}function ar(e){return!!(e&&typeof e=="object"&&e.type===_e.number)}function Tt(e){return!!(e&&typeof e=="object"&&e.type===_e.dateTime)}var fn=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var zs=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function ji(e){var t={};return e.replace(zs,function(r){var n=r.length;switch(r[0]){case"G":t.era=n===4?"long":n===5?"narrow":"short";break;case"y":t.year=n===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][n-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][n-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=n===4?"short":n===5?"narrow":"short";break;case"e":if(n<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"c":if(n<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][n-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][n-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][n-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][n-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][n-1];break;case"s":t.second=["numeric","2-digit"][n-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=n<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var Yi=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function Zi(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(Yi).filter(function(d){return d.length>0}),r=[],n=0,i=t;n<i.length;n++){var o=i[n],a=o.split("/");if(a.length===0)throw new Error("Invalid number skeleton");for(var s=a[0],c=a.slice(1),h=0,l=c;h<l.length;h++){var u=l[h];if(u.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:c})}return r}function Fs(e){return e.replace(/^(.*?)-/,"")}var Xi=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,Ji=/^(@+)?(\+|#+)?$/g,Bs=/(\*)(0+)|(#+)(0+)|(0+)/g,Qi=/^(0+)$/;function Wi(e){var t={};return e.replace(Ji,function(r,n,i){return typeof i!="string"?(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length):i==="+"?t.minimumSignificantDigits=n.length:n[0]==="#"?t.maximumSignificantDigits=n.length:(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length+(typeof i=="string"?i.length:0)),""}),t}function eo(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function Ks(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!Qi.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function qi(e){var t={},r=eo(e);return r||t}function to(e){for(var t={},r=0,n=e;r<n.length;r++){var i=n[r];switch(i.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=i.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=Fs(i.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=E(E(E({},t),{notation:"scientific"}),i.options.reduce(function(s,c){return E(E({},s),qi(c))},{}));continue;case"engineering":t=E(E(E({},t),{notation:"engineering"}),i.options.reduce(function(s,c){return E(E({},s),qi(c))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(i.options[0]);continue;case"integer-width":if(i.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");i.options[0].replace(Bs,function(s,c,h,l,u,d){if(c)t.minimumIntegerDigits=h.length;else{if(l&&u)throw new Error("We currently do not support maximum integer digits");if(d)throw new Error("We currently do not support exact integer digits")}return""});continue}if(Qi.test(i.stem)){t.minimumIntegerDigits=i.stem.length;continue}if(Xi.test(i.stem)){if(i.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");i.stem.replace(Xi,function(s,c,h,l,u,d){return h==="*"?t.minimumFractionDigits=c.length:l&&l[0]==="#"?t.maximumFractionDigits=l.length:u&&d?(t.minimumFractionDigits=u.length,t.maximumFractionDigits=u.length+d.length):(t.minimumFractionDigits=c.length,t.maximumFractionDigits=c.length),""}),i.options.length&&(t=E(E({},t),Wi(i.options[0])));continue}if(Ji.test(i.stem)){t=E(E({},t),Wi(i.stem));continue}var o=eo(i.stem);o&&(t=E(E({},t),o));var a=Ks(i.stem);a&&(t=E(E({},t),a))}return t}var gn,js=new RegExp("^"+fn.source+"*"),Ys=new RegExp(fn.source+"*$");function S(e,t){return{start:e,end:t}}var Xs=!!String.prototype.startsWith,Ws=!!String.fromCodePoint,qs=!!Object.fromEntries,Zs=!!String.prototype.codePointAt,Js=!!String.prototype.trimStart,Qs=!!String.prototype.trimEnd,ec=!!Number.isSafeInteger,tc=ec?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},vn=!0;try{ro=ao("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),vn=((gn=ro.exec("a"))===null||gn===void 0?void 0:gn[0])==="a"}catch{vn=!1}var ro,no=Xs?function(t,r,n){return t.startsWith(r,n)}:function(t,r,n){return t.slice(n,n+r.length)===r},bn=Ws?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var n="",i=t.length,o=0,a;i>o;){if(a=t[o++],a>1114111)throw RangeError(a+" is not a valid code point");n+=a<65536?String.fromCharCode(a):String.fromCharCode(((a-=65536)>>10)+55296,a%1024+56320)}return n},io=qs?Object.fromEntries:function(t){for(var r={},n=0,i=t;n<i.length;n++){var o=i[n],a=o[0],s=o[1];r[a]=s}return r},oo=Zs?function(t,r){return t.codePointAt(r)}:function(t,r){var n=t.length;if(!(r<0||r>=n)){var i=t.charCodeAt(r),o;return i<55296||i>56319||r+1===n||(o=t.charCodeAt(r+1))<56320||o>57343?i:(i-55296<<10)+(o-56320)+65536}},rc=Js?function(t){return t.trimStart()}:function(t){return t.replace(js,"")},nc=Qs?function(t){return t.trimEnd()}:function(t){return t.replace(Ys,"")};function ao(e,t){return new RegExp(e,t)}var An;vn?(xn=ao("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),An=function(t,r){var n;xn.lastIndex=r;var i=xn.exec(t);return(n=i[1])!==null&&n!==void 0?n:""}):An=function(t,r){for(var n=[];;){var i=oo(t,r);if(i===void 0||co(i)||ac(i))break;n.push(i),r+=i>=65536?2:1}return bn.apply(void 0,n)};var xn,so=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,n){for(var i=[];!this.isEOF();){var o=this.char();if(o===123){var a=this.parseArgument(t,n);if(a.err)return a;i.push(a.val)}else{if(o===125&&t>0)break;if(o===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),i.push({type:C.pound,location:S(s,this.clonePosition())})}else if(o===60&&!this.ignoreTag&&this.peek()===47){if(n)break;return this.error(b.UNMATCHED_CLOSING_TAG,S(this.clonePosition(),this.clonePosition()))}else if(o===60&&!this.ignoreTag&&Sn(this.peek()||0)){var a=this.parseTag(t,r);if(a.err)return a;i.push(a.val)}else{var a=this.parseLiteral(t,r);if(a.err)return a;i.push(a.val)}}}return{val:i,err:null}},e.prototype.parseTag=function(t,r){var n=this.clonePosition();this.bump();var i=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:C.literal,value:"<"+i+"/>",location:S(n,this.clonePosition())},err:null};if(this.bumpIf(">")){var o=this.parseMessage(t+1,r,!0);if(o.err)return o;var a=o.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!Sn(this.char()))return this.error(b.INVALID_TAG,S(s,this.clonePosition()));var c=this.clonePosition(),h=this.parseTagName();return i!==h?this.error(b.UNMATCHED_CLOSING_TAG,S(c,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:C.tag,value:i,children:a,location:S(n,this.clonePosition())},err:null}:this.error(b.INVALID_TAG,S(s,this.clonePosition())))}else return this.error(b.UNCLOSED_TAG,S(n,this.clonePosition()))}else return this.error(b.INVALID_TAG,S(n,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&oc(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var n=this.clonePosition(),i="";;){var o=this.tryParseQuote(r);if(o){i+=o;continue}var a=this.tryParseUnquoted(t,r);if(a){i+=a;continue}var s=this.tryParseLeftAngleBracket();if(s){i+=s;continue}break}var c=S(n,this.clonePosition());return{val:{type:C.literal,value:i,location:c},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!ic(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var n=this.char();if(n===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(n);this.bump()}return bn.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var n=this.char();return n===60||n===123||n===35&&(r==="plural"||r==="selectordinal")||n===125&&t>0?null:(this.bump(),bn(n))},e.prototype.parseArgument=function(t,r){var n=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,S(n,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(b.EMPTY_ARGUMENT,S(n,this.clonePosition()));var i=this.parseIdentifierIfPossible().value;if(!i)return this.error(b.MALFORMED_ARGUMENT,S(n,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,S(n,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:C.argument,value:i,location:S(n,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,S(n,this.clonePosition())):this.parseArgumentOptions(t,r,i,n);default:return this.error(b.MALFORMED_ARGUMENT,S(n,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),n=An(this.message,r),i=r+n.length;this.bumpTo(i);var o=this.clonePosition(),a=S(t,o);return{value:n,location:a}},e.prototype.parseArgumentOptions=function(t,r,n,i){var o,a=this.clonePosition(),s=this.parseIdentifierIfPossible().value,c=this.clonePosition();switch(s){case"":return this.error(b.EXPECT_ARGUMENT_TYPE,S(a,c));case"number":case"date":case"time":{this.bumpSpace();var h=null;if(this.bumpIf(",")){this.bumpSpace();var l=this.clonePosition(),u=this.parseSimpleArgStyleIfPossible();if(u.err)return u;var d=nc(u.val);if(d.length===0)return this.error(b.EXPECT_ARGUMENT_STYLE,S(this.clonePosition(),this.clonePosition()));var m=S(l,this.clonePosition());h={style:d,styleLocation:m}}var f=this.tryParseArgumentClose(i);if(f.err)return f;var v=S(i,this.clonePosition());if(h&&no(h?.style,"::",0)){var A=rc(h.style.slice(2));if(s==="number"){var u=this.parseNumberSkeletonFromString(A,h.styleLocation);return u.err?u:{val:{type:C.number,value:n,location:v,style:u.val},err:null}}else{if(A.length===0)return this.error(b.EXPECT_DATE_TIME_SKELETON,v);var d={type:_e.dateTime,pattern:A,location:h.styleLocation,parsedOptions:this.shouldParseSkeletons?ji(A):{}},I=s==="date"?C.date:C.time;return{val:{type:I,value:n,location:v,style:d},err:null}}}return{val:{type:s==="number"?C.number:s==="date"?C.date:C.time,value:n,location:v,style:(o=h?.style)!==null&&o!==void 0?o:null},err:null}}case"plural":case"selectordinal":case"select":{var N=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(b.EXPECT_SELECT_ARGUMENT_OPTIONS,S(N,E({},N)));this.bumpSpace();var _=this.parseIdentifierIfPossible(),U=0;if(s!=="select"&&_.value==="offset"){if(!this.bumpIf(":"))return this.error(b.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,S(this.clonePosition(),this.clonePosition()));this.bumpSpace();var u=this.tryParseDecimalInteger(b.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,b.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(u.err)return u;this.bumpSpace(),_=this.parseIdentifierIfPossible(),U=u.val}var L=this.tryParsePluralOrSelectOptions(t,s,r,_);if(L.err)return L;var f=this.tryParseArgumentClose(i);if(f.err)return f;var k=S(i,this.clonePosition());return s==="select"?{val:{type:C.select,value:n,options:io(L.val),location:k},err:null}:{val:{type:C.plural,value:n,options:io(L.val),offset:U,pluralType:s==="plural"?"cardinal":"ordinal",location:k},err:null}}default:return this.error(b.INVALID_ARGUMENT_TYPE,S(a,c))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,S(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var n=this.char();switch(n){case 39:{this.bump();var i=this.clonePosition();if(!this.bumpUntil("'"))return this.error(b.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,S(i,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var n=[];try{n=Zi(t)}catch{return this.error(b.INVALID_NUMBER_SKELETON,r)}return{val:{type:_e.number,tokens:n,location:r,parsedOptions:this.shouldParseSkeletons?to(n):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,n,i){for(var o,a=!1,s=[],c=new Set,h=i.value,l=i.location;;){if(h.length===0){var u=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var d=this.tryParseDecimalInteger(b.EXPECT_PLURAL_ARGUMENT_SELECTOR,b.INVALID_PLURAL_ARGUMENT_SELECTOR);if(d.err)return d;l=S(u,this.clonePosition()),h=this.message.slice(u.offset,this.offset())}else break}if(c.has(h))return this.error(r==="select"?b.DUPLICATE_SELECT_ARGUMENT_SELECTOR:b.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,l);h==="other"&&(a=!0),this.bumpSpace();var m=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?b.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:b.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,S(this.clonePosition(),this.clonePosition()));var f=this.parseMessage(t+1,r,n);if(f.err)return f;var v=this.tryParseArgumentClose(m);if(v.err)return v;s.push([h,{value:f.val,location:S(m,this.clonePosition())}]),c.add(h),this.bumpSpace(),o=this.parseIdentifierIfPossible(),h=o.value,l=o.location}return s.length===0?this.error(r==="select"?b.EXPECT_SELECT_ARGUMENT_SELECTOR:b.EXPECT_PLURAL_ARGUMENT_SELECTOR,S(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!a?this.error(b.MISSING_OTHER_CLAUSE,S(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var n=1,i=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(n=-1);for(var o=!1,a=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)o=!0,a=a*10+(s-48),this.bump();else break}var c=S(i,this.clonePosition());return o?(a*=n,tc(a)?{val:a,err:null}:this.error(r,c)):this.error(t,c)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=oo(this.message,t);if(r===void 0)throw Error("Offset "+t+" is at invalid UTF-16 code unit boundary");return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(no(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),n=this.message.indexOf(t,r);return n>=0?(this.bumpTo(n),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset "+t+" must be greater than or equal to the current offset "+this.offset());for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset "+t+" is at invalid UTF-16 code unit boundary");if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&co(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),n=this.message.charCodeAt(r+(t>=65536?2:1));return n??null},e}();function Sn(e){return e>=97&&e<=122||e>=65&&e<=90}function ic(e){return Sn(e)||e===47}function oc(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function co(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function ac(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function En(e){e.forEach(function(t){if(delete t.location,nr(t)||ir(t))for(var r in t.options)delete t.options[r].location,En(t.options[r].value);else er(t)&&ar(t.style)||(tr(t)||rr(t))&&Tt(t.style)?delete t.style.location:or(t)&&En(t.children)})}function lo(e,t){t===void 0&&(t={}),t=E({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new so(e,t).parse();if(r.err){var n=SyntaxError(b[r.err.kind]);throw n.location=r.err.location,n.originalMessage=r.err.message,n}return t?.captureLocation||En(r.val),r.val}function yt(e,t){var r=t&&t.cache?t.cache:dc,n=t&&t.serializer?t.serializer:uc,i=t&&t.strategy?t.strategy:cc;return i(e,{cache:r,serializer:n})}function sc(e){return e==null||typeof e=="number"||typeof e=="boolean"}function ho(e,t,r,n){var i=sc(n)?n:r(n),o=t.get(i);return typeof o>"u"&&(o=e.call(this,n),t.set(i,o)),o}function uo(e,t,r){var n=Array.prototype.slice.call(arguments,3),i=r(n),o=t.get(i);return typeof o>"u"&&(o=e.apply(this,n),t.set(i,o)),o}function Tn(e,t,r,n,i){return r.bind(t,e,n,i)}function cc(e,t){var r=e.length===1?ho:uo;return Tn(e,this,r,t.cache.create(),t.serializer)}function lc(e,t){return Tn(e,this,uo,t.cache.create(),t.serializer)}function hc(e,t){return Tn(e,this,ho,t.cache.create(),t.serializer)}var uc=function(){return JSON.stringify(arguments)};function yn(){this.cache=Object.create(null)}yn.prototype.get=function(e){return this.cache[e]};yn.prototype.set=function(e,t){this.cache[e]=t};var dc={create:function(){return new yn}},sr={variadic:lc,monadic:hc};var Le;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(Le||(Le={}));var _t=function(e){Et(t,e);function t(r,n,i){var o=e.call(this,r)||this;return o.code=n,o.originalMessage=i,o}return t.prototype.toString=function(){return"[formatjs Error: "+this.code+"] "+this.message},t}(Error);var _n=function(e){Et(t,e);function t(r,n,i,o){return e.call(this,'Invalid values for "'+r+'": "'+n+'". Options are "'+Object.keys(i).join('", "')+'"',Le.INVALID_VALUE,o)||this}return t}(_t);var mo=function(e){Et(t,e);function t(r,n,i){return e.call(this,'Value for "'+r+'" must be of type '+n,Le.INVALID_VALUE,i)||this}return t}(_t);var po=function(e){Et(t,e);function t(r,n){return e.call(this,'The intl string context variable "'+r+'" was not provided to the string "'+n+'"',Le.MISSING_VALUE,n)||this}return t}(_t);var z;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(z||(z={}));function mc(e){return e.length<2?e:e.reduce(function(t,r){var n=t[t.length-1];return!n||n.type!==z.literal||r.type!==z.literal?t.push(r):n.value+=r.value,t},[])}function pc(e){return typeof e=="function"}function Lt(e,t,r,n,i,o,a){if(e.length===1&&pn(e[0]))return[{type:z.literal,value:e[0].value}];for(var s=[],c=0,h=e;c<h.length;c++){var l=h[c];if(pn(l)){s.push({type:z.literal,value:l.value});continue}if(Ki(l)){typeof o=="number"&&s.push({type:z.literal,value:r.getNumberFormat(t).format(o)});continue}var u=l.value;if(!(i&&u in i))throw new po(u,a);var d=i[u];if(Bi(l)){(!d||typeof d=="string"||typeof d=="number")&&(d=typeof d=="string"||typeof d=="number"?String(d):""),s.push({type:typeof d=="string"?z.literal:z.object,value:d});continue}if(tr(l)){var m=typeof l.style=="string"?n.date[l.style]:Tt(l.style)?l.style.parsedOptions:void 0;s.push({type:z.literal,value:r.getDateTimeFormat(t,m).format(d)});continue}if(rr(l)){var m=typeof l.style=="string"?n.time[l.style]:Tt(l.style)?l.style.parsedOptions:void 0;s.push({type:z.literal,value:r.getDateTimeFormat(t,m).format(d)});continue}if(er(l)){var m=typeof l.style=="string"?n.number[l.style]:ar(l.style)?l.style.parsedOptions:void 0;m&&m.scale&&(d=d*(m.scale||1)),s.push({type:z.literal,value:r.getNumberFormat(t,m).format(d)});continue}if(or(l)){var f=l.children,v=l.value,A=i[v];if(!pc(A))throw new mo(v,"function",a);var I=Lt(f,t,r,n,i,o),N=A(I.map(function(L){return L.value}));Array.isArray(N)||(N=[N]),s.push.apply(s,N.map(function(L){return{type:typeof L=="string"?z.literal:z.object,value:L}}))}if(nr(l)){var _=l.options[d]||l.options.other;if(!_)throw new _n(l.value,d,Object.keys(l.options),a);s.push.apply(s,Lt(_.value,t,r,n,i));continue}if(ir(l)){var _=l.options["="+d];if(!_){if(!Intl.PluralRules)throw new _t(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,Le.MISSING_INTL_API,a);var U=r.getPluralRules(t,{type:l.pluralType}).select(d-(l.offset||0));_=l.options[U]||l.options.other}if(!_)throw new _n(l.value,d,Object.keys(l.options),a);s.push.apply(s,Lt(_.value,t,r,n,i,d-(l.offset||0)));continue}}return mc(s)}function fc(e,t){return t?E(E(E({},e||{}),t||{}),Object.keys(e).reduce(function(r,n){return r[n]=E(E({},e[n]),t[n]||{}),r},{})):e}function gc(e,t){return t?Object.keys(e).reduce(function(r,n){return r[n]=fc(e[n],t[n]),r},E({},e)):e}function Ln(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function xc(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:yt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.NumberFormat).bind.apply(t,Qt([void 0],r)))},{cache:Ln(e.number),strategy:sr.variadic}),getDateTimeFormat:yt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.DateTimeFormat).bind.apply(t,Qt([void 0],r)))},{cache:Ln(e.dateTime),strategy:sr.variadic}),getPluralRules:yt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.PluralRules).bind.apply(t,Qt([void 0],r)))},{cache:Ln(e.pluralRules),strategy:sr.variadic})}}var fo=function(){function e(t,r,n,i){var o=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(a){var s=o.formatToParts(a);if(s.length===1)return s[0].value;var c=s.reduce(function(h,l){return!h.length||l.type!==z.literal||typeof h[h.length-1]!="string"?h.push(l.value):h[h.length-1]+=l.value,h},[]);return c.length<=1?c[0]||"":c},this.formatToParts=function(a){return Lt(o.ast,o.locales,o.formatters,o.formats,a,void 0,o.message)},this.resolvedOptions=function(){return{locale:Intl.NumberFormat.supportedLocalesOf(o.locales)[0]}},this.getAst=function(){return o.ast},typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:i?.ignoreTag})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=gc(e.formats,n),this.locales=r,this.formatters=i&&i.formatters||xc(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.__parse=lo,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var go=fo;var vc=/[0-9\-+#]/,bc=/[^\d\-+#]/g;function xo(e){return e.search(vc)}function Ac(e="#.##"){let t={},r=e.length,n=xo(e);t.prefix=n>0?e.substring(0,n):"";let i=xo(e.split("").reverse().join("")),o=r-i,a=e.substring(o,o+1),s=o+(a==="."||a===","?1:0);t.suffix=i>0?e.substring(s,r):"",t.mask=e.substring(n,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let c=t.mask.match(bc);return t.decimal=c&&c[c.length-1]||".",t.separator=c&&c[1]&&c[0]||",",c=t.mask.split(t.decimal),t.integer=c[0],t.fraction=c[1],t}function Sc(e,t,r){let n=!1,i={value:e};e<0&&(n=!0,i.value=-i.value),i.sign=n?"-":"",i.value=Number(i.value).toFixed(t.fraction&&t.fraction.length),i.value=Number(i.value).toString();let o=t.fraction&&t.fraction.lastIndexOf("0"),[a="0",s=""]=i.value.split(".");return(!s||s&&s.length<=o)&&(s=o<0?"":(+("0."+s)).toFixed(o+1).replace("0.","")),i.integer=a,i.fraction=s,Ec(i,t),(i.result==="0"||i.result==="")&&(n=!1,i.sign=""),!n&&t.maskHasPositiveSign?i.sign="+":n&&t.maskHasPositiveSign?i.sign="-":n&&(i.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),i}function Ec(e,t){e.result="";let r=t.integer.split(t.separator),n=r.join(""),i=n&&n.indexOf("0");if(i>-1)for(;e.integer.length<n.length-i;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let o=r[1]&&r[r.length-1].length;if(o){let a=e.integer.length,s=a%o;for(let c=0;c<a;c++)e.result+=e.integer.charAt(c),!((c-s+1)%o)&&c<a-o&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function Tc(e,t,r={}){if(!e||isNaN(Number(t)))return t;let n=Ac(e),i=Sc(t,n,r);return n.prefix+i.sign+i.result+n.suffix}var vo=Tc;var bo=".",yc=",",So=/^\s+/,Eo=/\s+$/,Ao="&nbsp;",wt={MONTH:"MONTH",YEAR:"YEAR"},_c={[V.ANNUAL]:12,[V.MONTHLY]:1,[V.THREE_YEARS]:36,[V.TWO_YEARS]:24},Lc={CHF:e=>Math.round(e*20)/20},wn=(e,t)=>({accept:e,round:t}),wc=[wn(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),wn(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.ceil(Math.floor(t*1e4/e)/100)/100),wn(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],Pn={[M.YEAR]:{[V.MONTHLY]:wt.MONTH,[V.ANNUAL]:wt.YEAR},[M.MONTH]:{[V.MONTHLY]:wt.MONTH}},Pc=(e,t)=>e.indexOf(`'${t}'`)===0,Cc=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),n=yo(r);return!!n?t||(r=r.replace(/[,\.]0+/,n)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+Nc(e)),r},Ic=e=>{let t=kc(e),r=Pc(e,t),n=e.replace(/'.*?'/,""),i=So.test(n)||Eo.test(n);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:i}},To=e=>e.replace(So,Ao).replace(Eo,Ao),Nc=e=>e.match(/#(.?)#/)?.[1]===bo?yc:bo,kc=e=>e.match(/'(.*?)'/)?.[1]??"",yo=e=>e.match(/0(.?)0/)?.[1]??"";function cr({formatString:e,price:t,usePrecision:r,isIndianPrice:n=!1},i,o=a=>a){let{currencySymbol:a,isCurrencyFirst:s,hasCurrencySpace:c}=Ic(e),h=r?yo(e):"",l=Cc(e,r),u=r?2:0,d=o(t,{currencySymbol:a}),m=n?d.toLocaleString("hi-IN",{minimumFractionDigits:u,maximumFractionDigits:u}):vo(l,d),f=r?m.lastIndexOf(h):m.length,v=m.substring(0,f),A=m.substring(f+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,m).replace(/SYMBOL/,a),currencySymbol:a,decimals:A,decimalsDelimiter:h,hasCurrencySpace:c,integer:v,isCurrencyFirst:s,recurrenceTerm:i}}var _o=e=>{let{commitment:t,term:r,usePrecision:n}=e,i=_c[r]??1;return cr(e,i>1?wt.MONTH:Pn[t]?.[r],(o,{currencySymbol:a})=>{let s={divisor:i,price:o,usePrecision:n},{round:c}=wc.find(({accept:l})=>l(s));if(!c)throw new Error(`Missing rounding rule for: ${JSON.stringify(s)}`);return(Lc[a]??(l=>l))(c(s))})},Lo=({commitment:e,term:t,...r})=>cr(r,Pn[e]?.[t]),wo=e=>{let{commitment:t,term:r}=e;return t===M.YEAR&&r===V.MONTHLY?cr(e,wt.YEAR,n=>n*12):cr(e,Pn[t]?.[r])};var Oc={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at {alternativePrice}",strikethroughAriaLabel:"Regularly at {strikethroughPrice}"},Vc=Gi("ConsonantTemplates/price"),Rc=/<.+?>/g,X={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAnnual:"price-annual",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},we={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel"},$c="TAX_EXCLUSIVE",Uc=e=>Di(e)?Object.entries(e).filter(([,t])=>Be(t)||Zt(t)||t===!0).reduce((t,[r,n])=>t+` ${r}${n===!0?"":'="'+Ui(n)+'"'}`,""):"",ee=(e,t,r,n=!1)=>`<span class="${e}${t?"":" "+X.disabled}"${Uc(r)}>${n?To(t):t??""}</span>`;function Mc(e,{accessibleLabel:t,currencySymbol:r,decimals:n,decimalsDelimiter:i,hasCurrencySpace:o,integer:a,isCurrencyFirst:s,recurrenceLabel:c,perUnitLabel:h,taxInclusivityLabel:l},u={}){let d=ee(X.currencySymbol,r),m=ee(X.currencySpace,o?"&nbsp;":""),f="";return s&&(f+=d+m),f+=ee(X.integer,a),f+=ee(X.decimalsDelimiter,i),f+=ee(X.decimals,n),s||(f+=m+d),f+=ee(X.recurrence,c,null,!0),f+=ee(X.unitType,h,null,!0),f+=ee(X.taxInclusivity,l,!0),ee(e,f,{...u,"aria-label":t})}var Pe=({displayOptical:e=!1,displayStrikethrough:t=!1,displayAnnual:r=!1}={})=>({country:n,displayFormatted:i=!0,displayRecurrence:o=!0,displayPerUnit:a=!1,displayTax:s=!1,language:c,literals:h={}}={},{commitment:l,formatString:u,price:d,priceWithoutDiscount:m,taxDisplay:f,taxTerm:v,term:A,usePrecision:I}={},N={})=>{Object.entries({country:n,formatString:u,language:c,price:d}).forEach(([se,Kr])=>{if(Kr==null)throw new Error(`Argument "${se}" is missing`)});let _={...Oc,...h},U=`${c.toLowerCase()}-${n.toUpperCase()}`;function L(se,Kr){let jr=_[se];if(jr==null)return"";try{return new go(jr.replace(Rc,""),U).format(Kr)}catch{return Vc.error("Failed to format literal:",jr),""}}let k=t&&m?m:d,B=e?_o:Lo;r&&(B=wo);let{accessiblePrice:Z,recurrenceTerm:oe,...de}=B({commitment:l,formatString:u,term:A,price:e?d:k,usePrecision:I,isIndianPrice:n==="IN"}),J=Z,Ee="";if(y(o)&&oe){let se=L(we.recurrenceAriaLabel,{recurrenceTerm:oe});se&&(J+=" "+se),Ee=L(we.recurrenceLabel,{recurrenceTerm:oe})}let Te="";if(y(a)){Te=L(we.perUnitLabel,{perUnit:"LICENSE"});let se=L(we.perUnitAriaLabel,{perUnit:"LICENSE"});se&&(J+=" "+se)}let ae="";y(s)&&v&&(ae=L(f===$c?we.taxExclusiveLabel:we.taxInclusiveLabel,{taxTerm:v}),ae&&(J+=" "+ae)),t&&(J=L(we.strikethroughAriaLabel,{strikethroughPrice:J}));let Q=X.container;if(e&&(Q+=" "+X.containerOptical),t&&(Q+=" "+X.containerStrikethrough),r&&(Q+=" "+X.containerAnnual),y(i))return Mc(Q,{...de,accessibleLabel:J,recurrenceLabel:Ee,perUnitLabel:Te,taxInclusivityLabel:ae},N);let{currencySymbol:Ge,decimals:Kt,decimalsDelimiter:jt,hasCurrencySpace:xt,integer:Br,isCurrencyFirst:as}=de,He=[Br,jt,Kt];as?(He.unshift(xt?"\xA0":""),He.unshift(Ge)):(He.push(xt?"\xA0":""),He.push(Ge)),He.push(Ee,Te,ae);let ss=He.join("");return ee(Q,ss,N)},Po=()=>(e,t,r)=>{let i=(e.displayOldPrice===void 0||y(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${Pe()(e,t,r)}${i?"&nbsp;"+Pe({displayStrikethrough:!0})(e,t,r):""}`};var Cn=Pe(),In=Po(),Nn=Pe({displayOptical:!0}),kn=Pe({displayStrikethrough:!0}),On=Pe({displayAnnual:!0});var Dc=(e,t)=>{if(!(!je(e)||!je(t)))return Math.floor((t-e)/t*100)},Co=()=>(e,t,r)=>{let{price:n,priceWithoutDiscount:i}=t,o=Dc(n,i);return o===void 0?'<span class="no-discount"></span>':`<span class="discount">${o}%</span>`};var Vn=Co();var{freeze:Pt}=Object,ce=Pt({...ye}),le=Pt({...q}),Ce={STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"},Io=Pt({...M}),No=Pt({...zi}),ko=Pt({...V});var Hn={};fs(Hn,{CLASS_NAME_FAILED:()=>lr,CLASS_NAME_PENDING:()=>hr,CLASS_NAME_RESOLVED:()=>ur,ERROR_MESSAGE_BAD_REQUEST:()=>dr,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>Gc,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>Rn,EVENT_TYPE_ERROR:()=>Hc,EVENT_TYPE_FAILED:()=>mr,EVENT_TYPE_PENDING:()=>pr,EVENT_TYPE_READY:()=>We,EVENT_TYPE_RESOLVED:()=>fr,LOG_NAMESPACE:()=>$n,Landscape:()=>qe,PARAM_AOS_API_KEY:()=>zc,PARAM_ENV:()=>Un,PARAM_LANDSCAPE:()=>Mn,PARAM_WCS_API_KEY:()=>Fc,STATE_FAILED:()=>te,STATE_PENDING:()=>re,STATE_RESOLVED:()=>ne,TAG_NAME_SERVICE:()=>fe,WCS_PROD_URL:()=>Dn,WCS_STAGE_URL:()=>Gn});var lr="placeholder-failed",hr="placeholder-pending",ur="placeholder-resolved",dr="Bad WCS request",Rn="Commerce offer not found",Gc="Literals URL not provided",Hc="wcms:commerce:error",mr="wcms:placeholder:failed",pr="wcms:placeholder:pending",We="wcms:commerce:ready",fr="wcms:placeholder:resolved",$n="wcms/commerce",Un="commerce.env",Mn="commerce.landscape",zc="commerce.aosKey",Fc="commerce.wcsKey",Dn="https://www.adobe.com/web_commerce_artifact",Gn="https://www.stage.adobe.com/web_commerce_artifact_stage",te="failed",re="pending",ne="resolved",fe="wcms-commerce",qe={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"};var zn={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals"],serializableTypes:["Array","Object"],sampleRate:30,tags:"consumer=milo/commerce"},Oo=new Set,Bc=e=>e instanceof Error||typeof e.originatingRequest=="string";function Vo(e){if(e==null)return;let t=typeof e;if(t==="function"){let{name:r}=e;return r?`${t} ${r}`:t}if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:n,originatingRequest:i,status:o}=e;return[n,o,i].filter(a=>a).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!zn.serializableTypes.includes(r))return r}return e}function Kc(e,t){if(!zn.ignoredProperties.includes(e))return Vo(t)}var Fn={append(e){let{delimiter:t,sampleRate:r,tags:n,clientId:i}=zn,{message:o,params:a}=e,s=[],c=o,h=[];a.forEach(d=>{d!=null&&(Bc(d)?s:h).push(d)}),s.length&&(c+=" ",c+=s.map(Vo).join(" "));let{pathname:l,search:u}=window.location;c+=`${t}page=`,c+=l+u,h.length&&(c+=`${t}facts=`,c+=JSON.stringify(h,Kc)),Oo.has(c)||(Oo.add(c),window.lana?.log(c,{sampleRate:r,tags:n,clientId:i}))}};var T=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflow:ce.V3,checkoutWorkflowStep:le.EMAIL,country:"US",displayOldPrice:!0,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,env:Ce.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsBufferDelay:1,wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:qe.PUBLISHED,wcsBufferLimit:1});function Ro(e,{once:t=!1}={}){let r=null;function n(){let i=document.querySelector(fe);i!==r&&(r=i,i&&e(i))}return document.addEventListener(We,n,{once:t}),ge(n),()=>document.removeEventListener(We,n)}function Ct(e,{country:t,forceTaxExclusive:r,perpetual:n}){let i;if(e.length<2)i=e;else{let o=t==="GB"||n?"EN":"MULT",[a,s]=e;i=[a.language===o?a:s]}return r&&(i=i.map(dn)),i}var ge=e=>window.setTimeout(e);function Ze(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(Xe).filter(je);return r.length||(r=[t]),r}function gr(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(nn)}function K(){return window.customElements.get(fe)?.instance}var jc="en_US",p={ar:"AR_es",be_en:"BE_en",be_fr:"BE_fr",be_nl:"BE_nl",br:"BR_pt",ca:"CA_en",ch_de:"CH_de",ch_fr:"CH_fr",ch_it:"CH_it",cl:"CL_es",co:"CO_es",la:"DO_es",mx:"MX_es",pe:"PE_es",africa:"MU_en",dk:"DK_da",de:"DE_de",ee:"EE_et",eg_ar:"EG_ar",eg_en:"EG_en",es:"ES_es",fr:"FR_fr",gr_el:"GR_el",gr_en:"GR_en",ie:"IE_en",il_he:"IL_iw",it:"IT_it",lv:"LV_lv",lt:"LT_lt",lu_de:"LU_de",lu_en:"LU_en",lu_fr:"LU_fr",my_en:"MY_en",my_ms:"MY_ms",hu:"HU_hu",mt:"MT_en",mena_en:"DZ_en",mena_ar:"DZ_ar",nl:"NL_nl",no:"NO_nb",pl:"PL_pl",pt:"PT_pt",ro:"RO_ro",si:"SI_sl",sk:"SK_sk",fi:"FI_fi",se:"SE_sv",tr:"TR_tr",uk:"GB_en",at:"AT_de",cz:"CZ_cs",bg:"BG_bg",ru:"RU_ru",ua:"UA_uk",au:"AU_en",in_en:"IN_en",in_hi:"IN_hi",id_en:"ID_en",id_id:"ID_in",nz:"NZ_en",sa_ar:"SA_ar",sa_en:"SA_en",sg:"SG_en",cn:"CN_zh-Hans",tw:"TW_zh-Hant",hk_zh:"HK_zh-hant",jp:"JP_ja",kr:"KR_ko",za:"ZA_en",ng:"NG_en",cr:"CR_es",ec:"EC_es",pr:"US_es",gt:"GT_es",cis_en:"AZ_en",cis_ru:"AZ_ru",sea:"SG_en",th_en:"TH_en",th_th:"TH_th"},xr=Object.freeze({LOCAL:"local",PROD:"prod",STAGE:"stage"});function Yc({locale:e={}}={}){if(!e.prefix)return{country:T.country,language:T.language,locale:jc};let t=e.prefix.replace("/","")??"",[r=T.country,n=T.language]=(p[t]??t).split("_",2);return r=r.toUpperCase(),n=n.toLowerCase(),{country:r,language:n,locale:`${n}_${r}`}}function $o(e={}){let{commerce:t={},locale:r=void 0}=e,n=Ce.PRODUCTION,i=Dn,o=["local","stage"].includes(e.env?.name),a=R(Un,t,{metadata:!1})?.toLowerCase()==="stage";o&&a&&(n=Ce.STAGE,i=Gn);let s=R("checkoutClientId",t)??T.checkoutClientId,c=pe(R("checkoutWorkflow",t),ce,T.checkoutWorkflow),h=le.CHECKOUT;c===ce.V3&&(h=pe(R("checkoutWorkflowStep",t),le,T.checkoutWorkflowStep));let l=y(R("displayOldPrice",t),T.displayOldPrice),u=y(R("displayPerUnit",t),T.displayPerUnit),d=y(R("displayRecurrence",t),T.displayRecurrence),m=y(R("displayTax",t),T.displayTax),f=y(R("entitlement",t),T.entitlement),v=y(R("modal",t),T.modal),A=y(R("forceTaxExclusive",t),T.forceTaxExclusive),I=R("promotionCode",t)??T.promotionCode,N=Ze(R("quantity",t)),_=R("wcsApiKey",t)??T.wcsApiKey,U=e.env?.name===xr.PROD?qe.PUBLISHED:pe(R(Mn,t),qe,T.landscape),L=Xe(R("wcsBufferDelay",t),T.wcsBufferDelay),k=Xe(R("wcsBufferLimit",t),T.wcsBufferLimit);return{...Yc({locale:r}),displayOldPrice:l,checkoutClientId:s,checkoutWorkflow:c,checkoutWorkflowStep:h,displayPerUnit:u,displayRecurrence:d,displayTax:m,entitlement:f,extraOptions:T.extraOptions,modal:v,env:n,forceTaxExclusive:A,promotionCode:I,quantity:N,wcsApiKey:_,wcsBufferDelay:L,wcsBufferLimit:k,wcsURL:i,landscape:U}}var Mo="debug",Xc="error",Wc="info",qc="warn",Zc=Date.now(),Bn=new Set,Kn=new Set,Uo=new Map,It=Object.freeze({DEBUG:Mo,ERROR:Xc,INFO:Wc,WARN:qc}),Do={append({level:e,message:t,params:r,timestamp:n,source:i}){console[e](`${n}ms [${i}] %c${t}`,"font-weight: bold;",...r)}},Go={filter:({level:e})=>e!==Mo},Jc={filter:()=>!1};function Qc(e,t,r,n,i){return{level:e,message:t,namespace:r,get params(){if(n.length===1){let[o]=n;me(o)&&(n=o(),Array.isArray(n)||(n=[n]))}return n},source:i,timestamp:Date.now()-Zc}}function el(e){[...Kn].every(t=>t(e))&&Bn.forEach(t=>t(e))}function Ho(e){let t=(Uo.get(e)??0)+1;Uo.set(e,t);let r=`${e} #${t}`,n=o=>(a,...s)=>el(Qc(o,a,e,s,r)),i=Object.seal({id:r,namespace:e,module(o){return Ho(`${i.namespace}/${o}`)},debug:n(It.DEBUG),error:n(It.ERROR),info:n(It.INFO),warn:n(It.WARN)});return i}function vr(...e){e.forEach(t=>{let{append:r,filter:n}=t;me(n)?Kn.add(n):me(r)&&Bn.add(r)})}function tl(e={}){let{name:t}=e,r=y(R("commerce.debug",{search:!0,storage:!0}),t===xr.LOCAL);return vr(r?Do:Go),t===xr.PROD&&vr(Fn),F}function rl(){Bn.clear(),Kn.clear()}var F={...Ho($n),Level:It,Plugins:{consoleAppender:Do,debugFilter:Go,quietFilter:Jc,lanaAppender:Fn},init:tl,reset:rl,use:vr};var nl={CLASS_NAME_FAILED:lr,CLASS_NAME_PENDING:hr,CLASS_NAME_RESOLVED:ur,EVENT_TYPE_FAILED:mr,EVENT_TYPE_PENDING:pr,EVENT_TYPE_RESOLVED:fr,STATE_FAILED:te,STATE_PENDING:re,STATE_RESOLVED:ne},il={[te]:lr,[re]:hr,[ne]:ur},ol={[te]:mr,[re]:pr,[ne]:fr},Sr=new WeakMap;function j(e){if(!Sr.has(e)){let t=F.module(e.constructor.is);Sr.set(e,{changes:new Map,connected:!1,dispose:Ke,error:void 0,log:t,options:void 0,promises:[],state:re,timer:null,value:void 0,version:0})}return Sr.get(e)}function br(e){let t=j(e),{error:r,promises:n,state:i}=t;(i===ne||i===te)&&(t.promises=[],i===ne?n.forEach(({resolve:o})=>o(e)):i===te&&n.forEach(({reject:o})=>o(r))),e.dispatchEvent(new CustomEvent(ol[i],{bubbles:!0}))}function Ar(e){let t=Sr.get(e);[te,re,ne].forEach(r=>{e.classList.toggle(il[r],r===t.state)})}var al={get error(){return j(this).error},get log(){return j(this).log},get options(){return j(this).options},get state(){return j(this).state},get value(){return j(this).value},attributeChangedCallback(e,t,r){j(this).changes.set(e,r),this.requestUpdate()},connectedCallback(){j(this).dispose=Ro(()=>this.requestUpdate(!0))},disconnectedCallback(){let e=j(this);e.connected&&(e.connected=!1,e.log.debug("Disconnected:",{element:this})),e.dispose(),e.dispose=Ke},onceSettled(){let{error:e,promises:t,state:r}=j(this);return ne===r?Promise.resolve(this):te===r?Promise.reject(e):new Promise((n,i)=>{t.push({resolve:n,reject:i})})},toggleResolved(e,t,r){let n=j(this);return e!==n.version?!1:(r!==void 0&&(n.options=r),n.state=ne,n.value=t,Ar(this),this.log.debug("Resolved:",{element:this,value:t}),ge(()=>br(this)),!0)},toggleFailed(e,t,r){let n=j(this);return e!==n.version?!1:(r!==void 0&&(n.options=r),n.error=t,n.state=te,Ar(this),n.log.error("Failed:",{element:this,error:t}),ge(()=>br(this)),!0)},togglePending(e){let t=j(this);return t.version++,e&&(t.options=e),t.state=re,Ar(this),ge(()=>br(this)),t.version},requestUpdate(e=!1){if(!this.isConnected||!K())return;let t=j(this);if(t.timer)return;let{error:r,options:n,state:i,value:o,version:a}=t;t.state=re,t.timer=ge(async()=>{t.timer=null;let s=null;if(t.changes.size&&(s=Object.fromEntries(t.changes.entries()),t.changes.clear()),t.connected?t.log.debug("Updated:",{element:this,changes:s}):(t.connected=!0,t.log.debug("Connected:",{element:this,changes:s})),s||e)try{await this.render?.()===!1&&t.state===re&&t.version===a&&(t.state=i,t.error=r,t.value=o,Ar(this),br(this))}catch(c){this.toggleFailed(t.version,c,n)}})}};function zo(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function Er(e,t={}){let{tag:r,is:n}=e,i=document.createElement(r,{is:n});return i.setAttribute("is",n),Object.assign(i.dataset,zo(t)),i}function Tr(e){let{tag:t,is:r,prototype:n}=e,i=window.customElements.get(r);return i||(Object.defineProperties(n,Object.getOwnPropertyDescriptors(al)),i=Object.defineProperties(e,Object.getOwnPropertyDescriptors(nl)),window.customElements.define(r,i,{extends:t})),i}function yr(e,t=document.body){return Array.from(t?.querySelectorAll(`${e.tag}[is="${e.is}"]`)??[])}function _r(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,zo(t)),e):null}var sl="download",cl="upgrade",Ie,Je=class Je extends HTMLAnchorElement{constructor(){super();ze(this,Ie);this.addEventListener("click",this.clickHandler)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}static createCheckoutLink(r={},n=""){let i=K();if(!i)return null;let{checkoutMarketSegment:o,checkoutWorkflow:a,checkoutWorkflowStep:s,entitlement:c,upgrade:h,modal:l,perpetual:u,promotionCode:d,quantity:m,wcsOsi:f,extraOptions:v}=i.collectCheckoutOptions(r),A=Er(Je,{checkoutMarketSegment:o,checkoutWorkflow:a,checkoutWorkflowStep:s,entitlement:c,upgrade:h,modal:l,perpetual:u,promotionCode:d,quantity:m,wcsOsi:f,extraOptions:v});return n&&(A.innerHTML=`<span>${n}</span>`),A}static getCheckoutLinks(r){return yr(Je,r)}get isCheckoutLink(){return!0}get placeholder(){return this}clickHandler(r){var n;(n=W(this,Ie))==null||n.call(this,r)}async render(r={}){if(!this.isConnected)return!1;let n=K();if(!n)return!1;this.dataset.imsCountry||n.imsCountryPromise.then(l=>{l&&(this.dataset.imsCountry=l)},Ke);let i=n.collectCheckoutOptions(r,this.placeholder);if(!i.wcsOsi.length)return!1;let o;try{o=JSON.parse(i.extraOptions??"{}")}catch(l){this.placeholder.log.error("cannot parse exta checkout options",l)}let a=this.placeholder.togglePending(i);this.href="";let s=n.resolveOfferSelectors(i),c=await Promise.all(s);c=c.map(l=>Ct(l,i));let h=await n.buildCheckoutAction(c.flat(),{...o,...i});return this.renderOffers(c.flat(),i,{},h,a)}renderOffers(r,n,i={},o=void 0,a=void 0){if(!this.isConnected)return!1;let s=K();if(!s)return!1;if(n={...JSON.parse(this.placeholder.dataset.extraOptions??"null"),...n,...i},a??(a=this.placeholder.togglePending(n)),W(this,Ie)&&vt(this,Ie,void 0),o){this.classList.remove(sl,cl),this.placeholder.toggleResolved(a,r,n);let{url:h,text:l,className:u,handler:d}=o;return h&&(this.href=h),l&&(this.firstElementChild.innerHTML=l),u&&this.classList.add(...u.split(" ")),d&&(this.setAttribute("href","#"),vt(this,Ie,d.bind(this))),!0}else if(r.length){if(this.placeholder.toggleResolved(a,r,n)){let h=s.buildCheckoutURL(r,n);return this.setAttribute("href",h),!0}}else{let h=new Error(`Not provided: ${n?.wcsOsi??"-"}`);if(this.placeholder.toggleFailed(a,h,n))return this.setAttribute("href","#"),!0}return!1}updateOptions(r={}){let n=K();if(!n)return!1;let{checkoutMarketSegment:i,checkoutWorkflow:o,checkoutWorkflowStep:a,entitlement:s,upgrade:c,modal:h,perpetual:l,promotionCode:u,quantity:d,wcsOsi:m}=n.collectCheckoutOptions(r);return _r(this,{checkoutMarketSegment:i,checkoutWorkflow:o,checkoutWorkflowStep:a,entitlement:s,upgrade:c,modal:h,perpetual:l,promotionCode:u,quantity:d,wcsOsi:m}),!0}};Ie=new WeakMap,x(Je,"is","checkout-link"),x(Je,"tag","a");var jn=Je,Yn=Tr(jn);var Fo=[p.uk,p.au,p.fr,p.at,p.be_en,p.be_fr,p.be_nl,p.bg,p.ch_de,p.ch_fr,p.ch_it,p.cz,p.de,p.dk,p.ee,p.eg_ar,p.eg_en,p.es,p.fi,p.fr,p.gr_el,p.gr_en,p.hu,p.ie,p.it,p.lu_de,p.lu_en,p.lu_fr,p.nl,p.no,p.pl,p.pt,p.ro,p.se,p.si,p.sk,p.tr,p.ua,p.id_en,p.id_id,p.in_en,p.in_hi,p.jp,p.my_en,p.my_ms,p.nz,p.th_en,p.th_th],ll={INDIVIDUAL_COM:[p.za,p.lt,p.lv,p.ng,p.sa_ar,p.sa_en,p.za,p.sg,p.kr],TEAM_COM:[p.za,p.lt,p.lv,p.ng,p.za,p.co,p.kr],INDIVIDUAL_EDU:[p.lt,p.lv,p.sa_en,p.sea],TEAM_EDU:[p.sea,p.kr]},Qe=class Qe extends HTMLSpanElement{static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-perpetual","data-promotion-code","data-tax-exclusive","data-template","data-wcs-osi"]}static createInlinePrice(t){let r=K();if(!r)return null;let{displayOldPrice:n,displayPerUnit:i,displayRecurrence:o,displayTax:a,forceTaxExclusive:s,perpetual:c,promotionCode:h,quantity:l,template:u,wcsOsi:d}=r.collectPriceOptions(t);return Er(Qe,{displayOldPrice:n,displayPerUnit:i,displayRecurrence:o,displayTax:a,forceTaxExclusive:s,perpetual:c,promotionCode:h,quantity:l,template:u,wcsOsi:d})}static getInlinePrices(t){return yr(Qe,t)}get isInlinePrice(){return!0}get placeholder(){return this}resolveDisplayTaxForGeoAndSegment(t,r,n,i){let o=`${t}_${r}`;if(Fo.includes(t)||Fo.includes(o))return!0;let a=ll[`${n}_${i}`];return a?!!(a.includes(t)||a.includes(o)):!1}async resolveDisplayTax(t,r){let[n]=await t.resolveOfferSelectors(r),i=Ct(await n,r);if(i?.length){let{country:o,language:a}=r,s=i[0],[c=""]=s.marketSegments;return this.resolveDisplayTaxForGeoAndSegment(o,a,s.customerSegment,c)}}async render(t={}){if(!this.isConnected)return!1;let r=K();if(!r)return!1;let n=r.collectPriceOptions(t,this.placeholder);if(!n.wcsOsi.length)return!1;let i=this.placeholder.togglePending(n);this.innerHTML="";let[o]=r.resolveOfferSelectors(n);return this.renderOffers(Ct(await o,n),n,i)}renderOffers(t,r={},n=void 0){if(!this.isConnected)return;let i=K();if(!i)return!1;let o=i.collectPriceOptions({...this.dataset,...r});if(n??(n=this.placeholder.togglePending(o)),t.length){if(this.placeholder.toggleResolved(n,t,o))return this.innerHTML=i.buildPriceHTML(t,o),!0}else{let a=new Error(`Not provided: ${o?.wcsOsi??"-"}`);if(this.placeholder.toggleFailed(n,a,o))return this.innerHTML="",!0}return!1}updateOptions(t){let r=K();if(!r)return!1;let{displayOldPrice:n,displayPerUnit:i,displayRecurrence:o,displayTax:a,forceTaxExclusive:s,perpetual:c,promotionCode:h,quantity:l,template:u,wcsOsi:d}=r.collectPriceOptions(t);return _r(this,{displayOldPrice:n,displayPerUnit:i,displayRecurrence:o,displayTax:a,forceTaxExclusive:s,perpetual:c,promotionCode:h,quantity:l,template:u,wcsOsi:d}),!0}};x(Qe,"is","inline-price"),x(Qe,"tag","span");var Xn=Qe,Wn=Tr(Xn);function Bo({providers:e,settings:t},r){let n=F.module("checkout");function i(h,l){let{checkoutClientId:u,checkoutWorkflow:d,checkoutWorkflowStep:m,country:f,language:v,promotionCode:A,quantity:I}=t,{checkoutMarketSegment:N,checkoutWorkflow:_=d,checkoutWorkflowStep:U=m,imsCountry:L,country:k=L??f,language:B=v,quantity:Z=I,entitlement:oe,upgrade:de,modal:J,perpetual:Ee,promotionCode:Te=A,wcsOsi:ae,extraOptions:Q,...Ge}=Object.assign({},l?.dataset??{},h??{}),Kt=pe(_,ce,T.checkoutWorkflow),jt=le.CHECKOUT;Kt===ce.V3&&(jt=pe(U,le,T.checkoutWorkflowStep));let xt=Ye({...Ge,extraOptions:Q,checkoutClientId:u,checkoutMarketSegment:N,country:k,quantity:Ze(Z,T.quantity),checkoutWorkflow:Kt,checkoutWorkflowStep:jt,language:B,entitlement:y(oe),upgrade:y(de),modal:y(J),perpetual:y(Ee),promotionCode:St(Te).effectivePromoCode,wcsOsi:gr(ae)});if(l)for(let Br of e.checkout)Br(l,xt);return xt}async function o(h,l){let u=K(),d=await r.getCheckoutAction?.(h,l,u.imsSignedInPromise);return d||null}function a(h,l){if(!Array.isArray(h)||!h.length||!l)return"";let{env:u,landscape:d}=t,{checkoutClientId:m,checkoutMarketSegment:f,checkoutWorkflow:v,checkoutWorkflowStep:A,country:I,promotionCode:N,quantity:_,...U}=i(l),L=window.frameElement?"if":"fp",k={checkoutPromoCode:N,clientId:m,context:L,country:I,env:u,items:[],marketSegment:f,workflowStep:A,landscape:d,...U};if(h.length===1){let[{offerId:B,offerType:Z,productArrangementCode:oe}]=h,{marketSegments:[de]}=h[0];Object.assign(k,{marketSegment:de,offerType:Z,productArrangementCode:oe}),k.items.push(_[0]===1?{id:B}:{id:B,quantity:_[0]})}else k.items.push(...h.map(({offerId:B},Z)=>({id:B,quantity:_[Z]??T.quantity})));return Zr(v,k)}let{createCheckoutLink:s,getCheckoutLinks:c}=Yn;return{CheckoutLink:Yn,CheckoutWorkflow:ce,CheckoutWorkflowStep:le,buildCheckoutAction:o,buildCheckoutURL:a,collectCheckoutOptions:i,createCheckoutLink:s,getCheckoutLinks:c}}function hl({interval:e=200,maxAttempts:t=25}={}){let r=F.module("ims");return new Promise(n=>{r.debug("Waing for IMS to be ready");let i=0;function o(){window.adobeIMS?.initialized?n():++i>t?(r.debug("Timeout"),n()):setTimeout(o,e)}o()})}function ul(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function dl(e){let t=F.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:n})=>(t.debug("Got user country:",n),n),n=>{t.error("Unable to get user country:",n)}):null)}function Ko({}){let e=hl(),t=ul(e),r=dl(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}async function Yo(e,t){let{data:r}=t||await Promise.resolve().then(()=>xs(jo(),1));if(Array.isArray(r)){let n=o=>r.find(a=>qt(a.lang,o)),i=n(e.language)??n(T.language);if(i)return Object.freeze(i)}return{}}function Xo({literals:e,providers:t,settings:r}){function n(s,c){let{country:h,displayOldPrice:l,displayPerUnit:u,displayRecurrence:d,displayTax:m,forceTaxExclusive:f,language:v,promotionCode:A,quantity:I}=r,{displayOldPrice:N=l,displayPerUnit:_=u,displayRecurrence:U=d,displayTax:L=m,forceTaxExclusive:k=f,country:B=h,language:Z=v,perpetual:oe,promotionCode:de=A,quantity:J=I,template:Ee,wcsOsi:Te,...ae}=Object.assign({},c?.dataset??{},s??{}),Q=Ye({...ae,country:B,displayOldPrice:y(N),displayPerUnit:y(_),displayRecurrence:y(U),displayTax:y(L),forceTaxExclusive:y(k),language:Z,perpetual:y(oe),promotionCode:St(de).effectivePromoCode,quantity:Ze(J,T.quantity),template:Ee,wcsOsi:gr(Te)});if(c)for(let Ge of t.price)Ge(c,Q);return Q}function i(s,c){if(!Array.isArray(s)||!s.length||!c)return"";let{template:h}=c,l;switch(h){case"discount":l=Vn;break;case"strikethrough":l=kn;break;case"optical":l=Nn;break;case"annual":l=On;break;default:l=c.promotionCode?In:Cn}let u=n(c);u.literals=Object.assign({},e.price,Ye(c.literals??{}));let[d]=s;return d={...d,...d.priceDetails},l(u,d)}let{createInlinePrice:o,getInlinePrices:a}=Wn;return{InlinePrice:Wn,buildPriceHTML:i,collectPriceOptions:n,createInlinePrice:o,getInlinePrices:a}}function Wo({settings:e}){let t=F.module("wcs"),{env:r,wcsApiKey:n}=e,i=new Map,o=new Map,a;async function s(l,u,d=!0){let m=Rn;t.debug("Fetching:",l);try{l.offerSelectorIds=l.offerSelectorIds.sort();let f=new URL(e.wcsURL);f.searchParams.set("offer_selector_ids",l.offerSelectorIds.join(",")),f.searchParams.set("country",l.country),f.searchParams.set("locale",l.locale),f.searchParams.set("landscape",r===Ce.STAGE?"ALL":e.landscape),f.searchParams.set("api_key",n),l.language&&f.searchParams.set("language",l.language),l.promotionCode&&f.searchParams.set("promotion_code",l.promotionCode),l.currency&&f.searchParams.set("currency",l.currency);let v=await fetch(f.toString(),{credentials:"omit"});if(v.ok){let A=await v.json();t.debug("Fetched:",l,A);let I=A.resolvedOffers??[];I=I.map(un),u.forEach(({resolve:N},_)=>{let U=I.filter(({offerSelectorIds:L})=>L.includes(_)).flat();U.length&&(u.delete(_),N(U))})}else v.status===404&&l.offerSelectorIds.length>1?(t.debug("Multi-osi 404, fallback to fetch-by-one strategy"),await Promise.allSettled(l.offerSelectorIds.map(A=>s({...l,offerSelectorIds:[A]},u,!1)))):(m=dr,t.error(m,l))}catch(f){m=dr,t.error(m,l,f)}d&&u.size&&(t.debug("Missing:",{offerSelectorIds:[...u.keys()]}),u.forEach(f=>{f.reject(new Error(m))}))}function c(){clearTimeout(a);let l=[...o.values()];o.clear(),l.forEach(({options:u,promises:d})=>s(u,d))}function h({country:l,language:u,perpetual:d=!1,promotionCode:m="",wcsOsi:f=[]}){let v=`${u}_${l}`;l!=="GB"&&(u=d?"EN":"MULT");let A=[l,u,m].filter(I=>I).join("-").toLowerCase();return f.map(I=>{let N=`${I}-${A}`;if(!i.has(N)){let _=new Promise((U,L)=>{let k=o.get(A);if(!k){let B={country:l,locale:v,offerSelectorIds:[]};l!=="GB"&&(B.language=u),k={options:B,promises:new Map},o.set(A,k)}m&&(k.options.promotionCode=m),k.options.offerSelectorIds.push(I),k.promises.set(I,{resolve:U,reject:L}),k.options.offerSelectorIds.length>=e.wcsBufferLimit?c():(t.debug("Queued:",k.options),a||(a=setTimeout(c,e.wcsBufferDelay)))});i.set(N,_)}return i.get(N)})}return{WcsCommitment:Io,WcsPlanType:No,WcsTerm:ko,resolveOfferSelectors:h}}var Y=class extends HTMLElement{get isWcmsCommerce(){return!0}};x(Y,"instance"),x(Y,"promise",null);window.customElements.define(fe,Y);async function pl(e,t){let r=F.init(e.env).module("service");r.debug("Activating:",e);let n={price:{}},i=Object.freeze($o(e));try{n.price=await Yo(i,e.commerce.priceLiterals)}catch(c){r.warn("Price literals were not fetched:",c)}let o={checkout:new Set,price:new Set},a=document.createElement(fe),s={literals:n,providers:o,settings:i};return Y.instance=Object.defineProperties(a,Object.getOwnPropertyDescriptors({...Bo(s,t),...Ko(s),...Xo(s),...Wo(s),...Hn,Log:F,get defaults(){return T},get literals(){return n},get log(){return F},get providers(){return{checkout(c){return o.checkout.add(c),()=>o.checkout.delete(c)},price(c){return o.price.add(c),()=>o.price.delete(c)}}},get settings(){return i}})),r.debug("Activated:",{literals:n,settings:i,element:a}),document.head.append(a),ge(()=>{let c=new CustomEvent(We,{bubbles:!0,cancelable:!1,detail:Y.instance});Y.instance.dispatchEvent(c)}),Y.instance}function qo(){document.head.querySelector(fe)?.remove(),Y.promise=null,F.reset()}function Nt(e,t){let r=me(e)?e():null,n=me(t)?t():{};return r&&(n.force&&qo(),pl(r,n).then(i=>{Nt.resolve(i)})),Y.promise??(Y.promise=new Promise(i=>{Nt.resolve=i})),Y.promise}var Lr=window,Pr=Lr.ShadowRoot&&(Lr.ShadyCSS===void 0||Lr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Jo=Symbol(),Zo=new WeakMap,wr=class{constructor(t,r,n){if(this._$cssResult$=!0,n!==Jo)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(Pr&&t===void 0){let n=r!==void 0&&r.length===1;n&&(t=Zo.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Zo.set(r,t))}return t}toString(){return this.cssText}},Qo=e=>new wr(typeof e=="string"?e:e+"",void 0,Jo);var qn=(e,t)=>{Pr?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let n=document.createElement("style"),i=Lr.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=r.cssText,e.appendChild(n)})},Cr=Pr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let n of t.cssRules)r+=n.cssText;return Qo(r)})(e):e;var Zn,Ir=window,ea=Ir.trustedTypes,fl=ea?ea.emptyScript:"",ta=Ir.reactiveElementPolyfillSupport,Qn={toAttribute(e,t){switch(t){case Boolean:e=e?fl:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},ra=(e,t)=>t!==e&&(t==t||e==e),Jn={attribute:!0,type:String,converter:Qn,reflect:!1,hasChanged:ra},ei="finalized",Ne=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,n)=>{let i=this._$Ep(n,r);i!==void 0&&(this._$Ev.set(i,n),t.push(i))}),t}static createProperty(t,r=Jn){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let n=typeof t=="symbol"?Symbol():"__"+t,i=this.getPropertyDescriptor(t,n,r);i!==void 0&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,r,n){return{get(){return this[r]},set(i){let o=this[t];this[r]=i,this.requestUpdate(t,o,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||Jn}static finalize(){if(this.hasOwnProperty(ei))return!1;this[ei]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let i of n)this.createProperty(i,r[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let i of n)r.unshift(Cr(i))}else t!==void 0&&r.push(Cr(t));return r}static _$Ep(t,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return qn(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(t,r,n){this._$AK(t,n)}_$EO(t,r,n=Jn){var i;let o=this.constructor._$Ep(t,n);if(o!==void 0&&n.reflect===!0){let a=(((i=n.converter)===null||i===void 0?void 0:i.toAttribute)!==void 0?n.converter:Qn).toAttribute(r,n.type);this._$El=t,a==null?this.removeAttribute(o):this.setAttribute(o,a),this._$El=null}}_$AK(t,r){var n;let i=this.constructor,o=i._$Ev.get(t);if(o!==void 0&&this._$El!==o){let a=i.getPropertyOptions(o),s=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?a.converter:Qn;this._$El=o,this[o]=s.fromAttribute(r,a.type),this._$El=null}}requestUpdate(t,r,n){let i=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||ra)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),n.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,n))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((i,o)=>this[o]=i),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(t=this._$ES)===null||t===void 0||t.forEach(i=>{var o;return(o=i.hostUpdate)===null||o===void 0?void 0:o.call(i)}),this.update(n)):this._$Ek()}catch(i){throw r=!1,this._$Ek(),i}r&&this._$AE(n)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var i;return(i=n.hostUpdated)===null||i===void 0?void 0:i.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};Ne[ei]=!0,Ne.elementProperties=new Map,Ne.elementStyles=[],Ne.shadowRootOptions={mode:"open"},ta?.({ReactiveElement:Ne}),((Zn=Ir.reactiveElementVersions)!==null&&Zn!==void 0?Zn:Ir.reactiveElementVersions=[]).push("1.6.3");var ti,Nr=window,et=Nr.trustedTypes,na=et?et.createPolicy("lit-html",{createHTML:e=>e}):void 0,ni="$lit$",xe=`lit$${(Math.random()+"").slice(9)}$`,ha="?"+xe,gl=`<${ha}>`,Ve=document,kr=()=>Ve.createComment(""),Ot=e=>e===null||typeof e!="object"&&typeof e!="function",ua=Array.isArray,xl=e=>ua(e)||typeof e?.[Symbol.iterator]=="function",ri=`[ 	
\f\r]`,kt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ia=/-->/g,oa=/>/g,ke=RegExp(`>|${ri}(?:([^\\s"'>=/]+)(${ri}*=${ri}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),aa=/'/g,sa=/"/g,da=/^(?:script|style|textarea|title)$/i,ma=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),zd=ma(1),Fd=ma(2),Vt=Symbol.for("lit-noChange"),D=Symbol.for("lit-nothing"),ca=new WeakMap,Oe=Ve.createTreeWalker(Ve,129,null,!1);function pa(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return na!==void 0?na.createHTML(t):t}var vl=(e,t)=>{let r=e.length-1,n=[],i,o=t===2?"<svg>":"",a=kt;for(let s=0;s<r;s++){let c=e[s],h,l,u=-1,d=0;for(;d<c.length&&(a.lastIndex=d,l=a.exec(c),l!==null);)d=a.lastIndex,a===kt?l[1]==="!--"?a=ia:l[1]!==void 0?a=oa:l[2]!==void 0?(da.test(l[2])&&(i=RegExp("</"+l[2],"g")),a=ke):l[3]!==void 0&&(a=ke):a===ke?l[0]===">"?(a=i??kt,u=-1):l[1]===void 0?u=-2:(u=a.lastIndex-l[2].length,h=l[1],a=l[3]===void 0?ke:l[3]==='"'?sa:aa):a===sa||a===aa?a=ke:a===ia||a===oa?a=kt:(a=ke,i=void 0);let m=a===ke&&e[s+1].startsWith("/>")?" ":"";o+=a===kt?c+gl:u>=0?(n.push(h),c.slice(0,u)+ni+c.slice(u)+xe+m):c+xe+(u===-2?(n.push(void 0),s):m)}return[pa(e,o+(e[r]||"<?>")+(t===2?"</svg>":"")),n]},Rt=class e{constructor({strings:t,_$litType$:r},n){let i;this.parts=[];let o=0,a=0,s=t.length-1,c=this.parts,[h,l]=vl(t,r);if(this.el=e.createElement(h,n),Oe.currentNode=this.el.content,r===2){let u=this.el.content,d=u.firstChild;d.remove(),u.append(...d.childNodes)}for(;(i=Oe.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes()){let u=[];for(let d of i.getAttributeNames())if(d.endsWith(ni)||d.startsWith(xe)){let m=l[a++];if(u.push(d),m!==void 0){let f=i.getAttribute(m.toLowerCase()+ni).split(xe),v=/([.?@])?(.*)/.exec(m);c.push({type:1,index:o,name:v[2],strings:f,ctor:v[1]==="."?oi:v[1]==="?"?ai:v[1]==="@"?si:rt})}else c.push({type:6,index:o})}for(let d of u)i.removeAttribute(d)}if(da.test(i.tagName)){let u=i.textContent.split(xe),d=u.length-1;if(d>0){i.textContent=et?et.emptyScript:"";for(let m=0;m<d;m++)i.append(u[m],kr()),Oe.nextNode(),c.push({type:2,index:++o});i.append(u[d],kr())}}}else if(i.nodeType===8)if(i.data===ha)c.push({type:2,index:o});else{let u=-1;for(;(u=i.data.indexOf(xe,u+1))!==-1;)c.push({type:7,index:o}),u+=xe.length-1}o++}}static createElement(t,r){let n=Ve.createElement("template");return n.innerHTML=t,n}};function tt(e,t,r=e,n){var i,o,a,s;if(t===Vt)return t;let c=n!==void 0?(i=r._$Co)===null||i===void 0?void 0:i[n]:r._$Cl,h=Ot(t)?void 0:t._$litDirective$;return c?.constructor!==h&&((o=c?._$AO)===null||o===void 0||o.call(c,!1),h===void 0?c=void 0:(c=new h(e),c._$AT(e,r,n)),n!==void 0?((a=(s=r)._$Co)!==null&&a!==void 0?a:s._$Co=[])[n]=c:r._$Cl=c),c!==void 0&&(t=tt(e,c._$AS(e,t.values),c,n)),t}var ii=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:n},parts:i}=this._$AD,o=((r=t?.creationScope)!==null&&r!==void 0?r:Ve).importNode(n,!0);Oe.currentNode=o;let a=Oe.nextNode(),s=0,c=0,h=i[0];for(;h!==void 0;){if(s===h.index){let l;h.type===2?l=new Or(a,a.nextSibling,this,t):h.type===1?l=new h.ctor(a,h.name,h.strings,this,t):h.type===6&&(l=new ci(a,this,t)),this._$AV.push(l),h=i[++c]}s!==h?.index&&(a=Oe.nextNode(),s++)}return Oe.currentNode=Ve,o}v(t){let r=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,r),r+=n.strings.length-2):n._$AI(t[r])),r++}},Or=class e{constructor(t,r,n,i){var o;this.type=2,this._$AH=D,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=n,this.options=i,this._$Cp=(o=i?.isConnected)===null||o===void 0||o}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=tt(this,t,r),Ot(t)?t===D||t==null||t===""?(this._$AH!==D&&this._$AR(),this._$AH=D):t!==this._$AH&&t!==Vt&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):xl(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==D&&Ot(this._$AH)?this._$AA.nextSibling.data=t:this.$(Ve.createTextNode(t)),this._$AH=t}g(t){var r;let{values:n,_$litType$:i}=t,o=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Rt.createElement(pa(i.h,i.h[0]),this.options)),i);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===o)this._$AH.v(n);else{let a=new ii(o,this),s=a.u(this.options);a.v(n),this.$(s),this._$AH=a}}_$AC(t){let r=ca.get(t.strings);return r===void 0&&ca.set(t.strings,r=new Rt(t)),r}T(t){ua(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,n,i=0;for(let o of t)i===r.length?r.push(n=new e(this.k(kr()),this.k(kr()),this,this.options)):n=r[i],n._$AI(o),i++;i<r.length&&(this._$AR(n&&n._$AB.nextSibling,i),r.length=i)}_$AR(t=this._$AA.nextSibling,r){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,r);t&&t!==this._$AB;){let i=t.nextSibling;t.remove(),t=i}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},rt=class{constructor(t,r,n,i,o){this.type=1,this._$AH=D,this._$AN=void 0,this.element=t,this.name=r,this._$AM=i,this.options=o,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=D}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,n,i){let o=this.strings,a=!1;if(o===void 0)t=tt(this,t,r,0),a=!Ot(t)||t!==this._$AH&&t!==Vt,a&&(this._$AH=t);else{let s=t,c,h;for(t=o[0],c=0;c<o.length-1;c++)h=tt(this,s[n+c],r,c),h===Vt&&(h=this._$AH[c]),a||(a=!Ot(h)||h!==this._$AH[c]),h===D?t=D:t!==D&&(t+=(h??"")+o[c+1]),this._$AH[c]=h}a&&!i&&this.j(t)}j(t){t===D?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},oi=class extends rt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===D?void 0:t}},bl=et?et.emptyScript:"",ai=class extends rt{constructor(){super(...arguments),this.type=4}j(t){t&&t!==D?this.element.setAttribute(this.name,bl):this.element.removeAttribute(this.name)}},si=class extends rt{constructor(t,r,n,i,o){super(t,r,n,i,o),this.type=5}_$AI(t,r=this){var n;if((t=(n=tt(this,t,r,0))!==null&&n!==void 0?n:D)===Vt)return;let i=this._$AH,o=t===D&&i!==D||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==D&&(i===D||o);o&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,n;typeof this._$AH=="function"?this._$AH.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,t):this._$AH.handleEvent(t)}},ci=class{constructor(t,r,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}};var la=Nr.litHtmlPolyfillSupport;la?.(Rt,Or),((ti=Nr.litHtmlVersions)!==null&&ti!==void 0?ti:Nr.litHtmlVersions=[]).push("2.8.0");var Vr=window,Rr=Vr.ShadowRoot&&(Vr.ShadyCSS===void 0||Vr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,li=Symbol(),fa=new WeakMap,$t=class{constructor(t,r,n){if(this._$cssResult$=!0,n!==li)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(Rr&&t===void 0){let n=r!==void 0&&r.length===1;n&&(t=fa.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&fa.set(r,t))}return t}toString(){return this.cssText}},ve=e=>new $t(typeof e=="string"?e:e+"",void 0,li),w=(e,...t)=>{let r=e.length===1?e[0]:t.reduce((n,i,o)=>n+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1],e[0]);return new $t(r,e,li)},hi=(e,t)=>{Rr?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let n=document.createElement("style"),i=Vr.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=r.cssText,e.appendChild(n)})},$r=Rr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let n of t.cssRules)r+=n.cssText;return ve(r)})(e):e;var ui,Ur=window,ga=Ur.trustedTypes,Al=ga?ga.emptyScript:"",xa=Ur.reactiveElementPolyfillSupport,mi={toAttribute(e,t){switch(t){case Boolean:e=e?Al:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},va=(e,t)=>t!==e&&(t==t||e==e),di={attribute:!0,type:String,converter:mi,reflect:!1,hasChanged:va},pi="finalized",he=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,n)=>{let i=this._$Ep(n,r);i!==void 0&&(this._$Ev.set(i,n),t.push(i))}),t}static createProperty(t,r=di){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let n=typeof t=="symbol"?Symbol():"__"+t,i=this.getPropertyDescriptor(t,n,r);i!==void 0&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,r,n){return{get(){return this[r]},set(i){let o=this[t];this[r]=i,this.requestUpdate(t,o,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||di}static finalize(){if(this.hasOwnProperty(pi))return!1;this[pi]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let i of n)this.createProperty(i,r[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let i of n)r.unshift($r(i))}else t!==void 0&&r.push($r(t));return r}static _$Ep(t,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return hi(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(t,r,n){this._$AK(t,n)}_$EO(t,r,n=di){var i;let o=this.constructor._$Ep(t,n);if(o!==void 0&&n.reflect===!0){let a=(((i=n.converter)===null||i===void 0?void 0:i.toAttribute)!==void 0?n.converter:mi).toAttribute(r,n.type);this._$El=t,a==null?this.removeAttribute(o):this.setAttribute(o,a),this._$El=null}}_$AK(t,r){var n;let i=this.constructor,o=i._$Ev.get(t);if(o!==void 0&&this._$El!==o){let a=i.getPropertyOptions(o),s=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?a.converter:mi;this._$El=o,this[o]=s.fromAttribute(r,a.type),this._$El=null}}requestUpdate(t,r,n){let i=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||va)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),n.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,n))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((i,o)=>this[o]=i),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(t=this._$ES)===null||t===void 0||t.forEach(i=>{var o;return(o=i.hostUpdate)===null||o===void 0?void 0:o.call(i)}),this.update(n)):this._$Ek()}catch(i){throw r=!1,this._$Ek(),i}r&&this._$AE(n)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var i;return(i=n.hostUpdated)===null||i===void 0?void 0:i.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};he[pi]=!0,he.elementProperties=new Map,he.elementStyles=[],he.shadowRootOptions={mode:"open"},xa?.({ReactiveElement:he}),((ui=Ur.reactiveElementVersions)!==null&&ui!==void 0?ui:Ur.reactiveElementVersions=[]).push("1.6.3");var fi,Mr=window,nt=Mr.trustedTypes,ba=nt?nt.createPolicy("lit-html",{createHTML:e=>e}):void 0,xi="$lit$",be=`lit$${(Math.random()+"").slice(9)}$`,La="?"+be,Sl=`<${La}>`,Ue=document,Mt=()=>Ue.createComment(""),Dt=e=>e===null||typeof e!="object"&&typeof e!="function",wa=Array.isArray,El=e=>wa(e)||typeof e?.[Symbol.iterator]=="function",gi=`[ 	
\f\r]`,Ut=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Aa=/-->/g,Sa=/>/g,Re=RegExp(`>|${gi}(?:([^\\s"'>=/]+)(${gi}*=${gi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ea=/'/g,Ta=/"/g,Pa=/^(?:script|style|textarea|title)$/i,Ca=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),g=Ca(1),Wd=Ca(2),Me=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),ya=new WeakMap,$e=Ue.createTreeWalker(Ue,129,null,!1);function Ia(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return ba!==void 0?ba.createHTML(t):t}var Tl=(e,t)=>{let r=e.length-1,n=[],i,o=t===2?"<svg>":"",a=Ut;for(let s=0;s<r;s++){let c=e[s],h,l,u=-1,d=0;for(;d<c.length&&(a.lastIndex=d,l=a.exec(c),l!==null);)d=a.lastIndex,a===Ut?l[1]==="!--"?a=Aa:l[1]!==void 0?a=Sa:l[2]!==void 0?(Pa.test(l[2])&&(i=RegExp("</"+l[2],"g")),a=Re):l[3]!==void 0&&(a=Re):a===Re?l[0]===">"?(a=i??Ut,u=-1):l[1]===void 0?u=-2:(u=a.lastIndex-l[2].length,h=l[1],a=l[3]===void 0?Re:l[3]==='"'?Ta:Ea):a===Ta||a===Ea?a=Re:a===Aa||a===Sa?a=Ut:(a=Re,i=void 0);let m=a===Re&&e[s+1].startsWith("/>")?" ":"";o+=a===Ut?c+Sl:u>=0?(n.push(h),c.slice(0,u)+xi+c.slice(u)+be+m):c+be+(u===-2?(n.push(void 0),s):m)}return[Ia(e,o+(e[r]||"<?>")+(t===2?"</svg>":"")),n]},Gt=class e{constructor({strings:t,_$litType$:r},n){let i;this.parts=[];let o=0,a=0,s=t.length-1,c=this.parts,[h,l]=Tl(t,r);if(this.el=e.createElement(h,n),$e.currentNode=this.el.content,r===2){let u=this.el.content,d=u.firstChild;d.remove(),u.append(...d.childNodes)}for(;(i=$e.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes()){let u=[];for(let d of i.getAttributeNames())if(d.endsWith(xi)||d.startsWith(be)){let m=l[a++];if(u.push(d),m!==void 0){let f=i.getAttribute(m.toLowerCase()+xi).split(be),v=/([.?@])?(.*)/.exec(m);c.push({type:1,index:o,name:v[2],strings:f,ctor:v[1]==="."?bi:v[1]==="?"?Ai:v[1]==="@"?Si:ot})}else c.push({type:6,index:o})}for(let d of u)i.removeAttribute(d)}if(Pa.test(i.tagName)){let u=i.textContent.split(be),d=u.length-1;if(d>0){i.textContent=nt?nt.emptyScript:"";for(let m=0;m<d;m++)i.append(u[m],Mt()),$e.nextNode(),c.push({type:2,index:++o});i.append(u[d],Mt())}}}else if(i.nodeType===8)if(i.data===La)c.push({type:2,index:o});else{let u=-1;for(;(u=i.data.indexOf(be,u+1))!==-1;)c.push({type:7,index:o}),u+=be.length-1}o++}}static createElement(t,r){let n=Ue.createElement("template");return n.innerHTML=t,n}};function it(e,t,r=e,n){var i,o,a,s;if(t===Me)return t;let c=n!==void 0?(i=r._$Co)===null||i===void 0?void 0:i[n]:r._$Cl,h=Dt(t)?void 0:t._$litDirective$;return c?.constructor!==h&&((o=c?._$AO)===null||o===void 0||o.call(c,!1),h===void 0?c=void 0:(c=new h(e),c._$AT(e,r,n)),n!==void 0?((a=(s=r)._$Co)!==null&&a!==void 0?a:s._$Co=[])[n]=c:r._$Cl=c),c!==void 0&&(t=it(e,c._$AS(e,t.values),c,n)),t}var vi=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:n},parts:i}=this._$AD,o=((r=t?.creationScope)!==null&&r!==void 0?r:Ue).importNode(n,!0);$e.currentNode=o;let a=$e.nextNode(),s=0,c=0,h=i[0];for(;h!==void 0;){if(s===h.index){let l;h.type===2?l=new Ht(a,a.nextSibling,this,t):h.type===1?l=new h.ctor(a,h.name,h.strings,this,t):h.type===6&&(l=new Ei(a,this,t)),this._$AV.push(l),h=i[++c]}s!==h?.index&&(a=$e.nextNode(),s++)}return $e.currentNode=Ue,o}v(t){let r=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,r),r+=n.strings.length-2):n._$AI(t[r])),r++}},Ht=class e{constructor(t,r,n,i){var o;this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=n,this.options=i,this._$Cp=(o=i?.isConnected)===null||o===void 0||o}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=it(this,t,r),Dt(t)?t===G||t==null||t===""?(this._$AH!==G&&this._$AR(),this._$AH=G):t!==this._$AH&&t!==Me&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):El(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==G&&Dt(this._$AH)?this._$AA.nextSibling.data=t:this.$(Ue.createTextNode(t)),this._$AH=t}g(t){var r;let{values:n,_$litType$:i}=t,o=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Gt.createElement(Ia(i.h,i.h[0]),this.options)),i);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===o)this._$AH.v(n);else{let a=new vi(o,this),s=a.u(this.options);a.v(n),this.$(s),this._$AH=a}}_$AC(t){let r=ya.get(t.strings);return r===void 0&&ya.set(t.strings,r=new Gt(t)),r}T(t){wa(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,n,i=0;for(let o of t)i===r.length?r.push(n=new e(this.k(Mt()),this.k(Mt()),this,this.options)):n=r[i],n._$AI(o),i++;i<r.length&&(this._$AR(n&&n._$AB.nextSibling,i),r.length=i)}_$AR(t=this._$AA.nextSibling,r){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,r);t&&t!==this._$AB;){let i=t.nextSibling;t.remove(),t=i}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},ot=class{constructor(t,r,n,i,o){this.type=1,this._$AH=G,this._$AN=void 0,this.element=t,this.name=r,this._$AM=i,this.options=o,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=G}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,n,i){let o=this.strings,a=!1;if(o===void 0)t=it(this,t,r,0),a=!Dt(t)||t!==this._$AH&&t!==Me,a&&(this._$AH=t);else{let s=t,c,h;for(t=o[0],c=0;c<o.length-1;c++)h=it(this,s[n+c],r,c),h===Me&&(h=this._$AH[c]),a||(a=!Dt(h)||h!==this._$AH[c]),h===G?t=G:t!==G&&(t+=(h??"")+o[c+1]),this._$AH[c]=h}a&&!i&&this.j(t)}j(t){t===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},bi=class extends ot{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===G?void 0:t}},yl=nt?nt.emptyScript:"",Ai=class extends ot{constructor(){super(...arguments),this.type=4}j(t){t&&t!==G?this.element.setAttribute(this.name,yl):this.element.removeAttribute(this.name)}},Si=class extends ot{constructor(t,r,n,i,o){super(t,r,n,i,o),this.type=5}_$AI(t,r=this){var n;if((t=(n=it(this,t,r,0))!==null&&n!==void 0?n:G)===Me)return;let i=this._$AH,o=t===G&&i!==G||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==G&&(i===G||o);o&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,n;typeof this._$AH=="function"?this._$AH.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,t):this._$AH.handleEvent(t)}},Ei=class{constructor(t,r,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){it(this,t)}};var _a=Mr.litHtmlPolyfillSupport;_a?.(Gt,Ht),((fi=Mr.litHtmlVersions)!==null&&fi!==void 0?fi:Mr.litHtmlVersions=[]).push("2.8.0");var Na=(e,t,r)=>{var n,i;let o=(n=r?.renderBefore)!==null&&n!==void 0?n:t,a=o._$litPart$;if(a===void 0){let s=(i=r?.renderBefore)!==null&&i!==void 0?i:null;o._$litPart$=a=new Ht(t.insertBefore(Mt(),s),s,void 0,r??{})}return a._$AI(e),a};var Ti,yi;var ie=class extends he{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,r;let n=super.createRenderRoot();return(t=(r=this.renderOptions).renderBefore)!==null&&t!==void 0||(r.renderBefore=n.firstChild),n}update(t){let r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Na(r,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return Me}};ie.finalized=!0,ie._$litElement$=!0,(Ti=globalThis.litElementHydrateSupport)===null||Ti===void 0||Ti.call(globalThis,{LitElement:ie});var ka=globalThis.litElementPolyfillSupport;ka?.({LitElement:ie});((yi=globalThis.litElementVersions)!==null&&yi!==void 0?yi:globalThis.litElementVersions=[]).push("3.3.3");var Ae="(max-width: 767px)",Dr="(max-width: 1199px)",$="(min-width: 768px)",O="(min-width: 1200px)",H="(min-width: 1600px)";var Oa=w`
    :host {
        position: relative;
        display: flex;
        flex-direction: column;
        text-align: start;
        background-color: var(--merch-card-background-color);
        grid-template-columns: repeat(auto-fit, minmax(300px, max-content));
        background-color: var(--merch-card-background-color);
        font-family: var(--body-font-family, 'Adobe Clean');
        border-radius: var(--consonant-merch-spacing-xs);
        border: 1px solid var(--consonant-merch-card-border-color);
        box-sizing: border-box;
    }

    :host(.placeholder) {
        visibility: hidden;
    }

    :host([aria-selected]) {
        outline: none;
        box-sizing: border-box;
        box-shadow: inset 0 0 0 2px var(--color-accent);
    }

    .invisible {
        visibility: hidden;
    }

    :host(:hover) .invisible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
        cursor: pointer;
    }

    .action-menu.always-visible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
    }

    .top-section {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 16px;
    }

    .top-section.badge {
        min-height: 32px;
    }

    .body {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100%;
        gap: var(--consonant-merch-spacing-xxs);
        padding: var(--consonant-merch-spacing-xs);
    }

    footer {
        display: flex;
        justify-content: flex-end;
        box-sizing: border-box;
        align-items: flex-end;
        width: 100%;
        flex-flow: wrap;
        gap: var(--consonant-merch-spacing-xs);

        padding: var(--consonant-merch-spacing-xs);
    }

    hr {
        background-color: var(--color-gray-200);
        border: none;
        height: 1px;
        width: auto;
        margin-top: 0;
        margin-bottom: 0;
        margin-left: var(--consonant-merch-spacing-xs);
        margin-right: var(--consonant-merch-spacing-xs);
    }

    div[class$='-badge'] {
        position: absolute;
        top: 16px;
        right: 0;
        font-size: var(--type-heading-xxs-size);
        font-weight: 500;
        max-width: 180px;
        line-height: 16px;
        text-align: center;
        padding: 8px 11px;
        border-radius: 5px 0 0 5px;
    }

    div[class$='-badge']:dir(rtl) {
        left: 0;
        right: initial;
        padding: 8px 11px;
        border-radius: 0 5px 5px 0;
    }

    .detail-bg-container {
        right: 0;
        padding: var(--consonant-merch-spacing-xs);
        border-radius: 5px;
        font-size: var(--consonant-merch-card-body-font-size);
        margin: var(--consonant-merch-spacing-xs);
    }

    .action-menu {
        display: flex;
        width: 32px;
        height: 32px;
        position: absolute;
        top: 16px;
        right: 16px;
        background-color: #f6f6f6;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 16px 16px;
    }
    .hidden {
        visibility: hidden;
    }

    #stock-checkbox,
    .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: 1.3;
        color: var(--color-gray-600);
    }

    #stock-checkbox {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        gap: 10px; /*same as spectrum */
    }

    #stock-checkbox > input {
        display: none;
    }

    #stock-checkbox > span {
        display: inline-block;
        box-sizing: border-box;
        border: 2px solid rgb(117, 117, 117);
        border-radius: 2px;
        width: 14px;
        height: 14px;
    }

    #stock-checkbox > input:checked + span {
        background: var(--checkmark-icon) no-repeat var(--color-accent);
        border-color: var(--color-accent);
    }

    .secure-transaction-label {
        white-space: nowrap;
        display: inline-flex;
        gap: var(--consonant-merch-spacing-xxs);
        align-items: center;
        flex: 1;
        line-height: normal;
    }

    .secure-transaction-label::before {
        display: inline-block;
        content: '';
        width: 12px;
        height: 15px;
        background: var(--secure-icon) no-repeat;
        background-position: center;
        background-size: contain;
    }

    .checkbox-container {
        display: flex;
        align-items: center;
        gap: var(--consonant-merch-spacing-xxs);
    }

    .checkbox-container input[type='checkbox']:checked + .checkmark {
        background-color: var(--color-accent);
        background-image: var(--checkmark-icon);
        border-color: var(--color-accent);
    }

    .checkbox-container input[type='checkbox'] {
        display: none;
    }

    .checkbox-container .checkmark {
        position: relative;
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid #757575;
        background: #fff;
        border-radius: 2px;
        cursor: pointer;
        margin-top: 2px;
    }

    slot[name='icons'] {
        display: flex;
        gap: 8px;
    }
`,Va=()=>[w`
        /* Tablet */
        @media screen and ${ve($)} {
            :host([size='wide']),
            :host([size='super-wide']) {
                width: 100%;
                grid-column: 1 / -1;
            }
        }

        /* Laptop */
        @media screen and ${ve(O)} {
            :host([size='wide']) {
                grid-column: span 2;
            }
        `];var at,zt=class zt{constructor(t){x(this,"card");ze(this,at);this.card=t,this.insertVariantStyle()}getContainer(){return vt(this,at,W(this,at)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),W(this,at)}insertVariantStyle(){if(!zt.styleMap[this.card.variant]){zt.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){let n=`--consonant-merch-card-${this.card.variant}-${r}-height`,i=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),o=parseInt(this.getContainer().style.getPropertyValue(n))||0;i>o&&this.getContainer().style.setProperty(n,`${i}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),g`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return g` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get strip(){if(this.card.stripSize&&this.card.stripBackground)switch(this.card.stripSize){case"wide":return"44px";case"small":return"4px";default:return"0"}return""}get stripStyle(){return this.strip&&this.card.stripBackground?`
          background: ${this.card.stripBackground.startsWith("url")?this.card.stripBackground:`url("${this.card.stripBackground}")`};
          background-size: ${this.strip} 100%;
          background-repeat: no-repeat;
          background-position: ${this.card.theme.dir==="ltr"?"left":"right"};
        `:""}get secureLabelFooter(){let t=this.card.secureLabel?g`<span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              >`:"";return g`<footer>${t}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){}};at=new WeakMap,x(zt,"styleMap",{});var P=zt;function ue(e,t={},r){let n=document.createElement(e);r instanceof HTMLElement?n.appendChild(r):n.innerHTML=r;for(let[i,o]of Object.entries(t))n.setAttribute(i,o);return n}function Gr(){return window.matchMedia("(max-width: 767px)").matches}function Ra(){return window.matchMedia("(max-width: 1024px)").matches}var $a="merch-offer-select:ready",Ua="merch-card:ready",Ma="merch-card:action-menu-toggle";var _i="merch-storage:change",Li="merch-quantity-selector:change";var Ft="aem:load",Da="mas:ready";var Ga=`
:root {
  --consonant-merch-card-catalog-width: 276px;
  --consonant-merch-card-catalog-icon-size: 40px;
}
.one-merch-card.catalog,
.two-merch-cards.catalog,
.three-merch-cards.catalog,
.four-merch-cards.catalog {
    grid-template-columns: var(--consonant-merch-card-catalog-width);
}

@media screen and ${$} {
    :root {
      --consonant-merch-card-catalog-width: 302px;
    }

    .two-merch-cards.catalog,
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(2, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${O} {
    :root {
      --consonant-merch-card-catalog-width: 276px;
    }

    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${H} {
    .four-merch-cards.catalog {
        grid-template-columns: repeat(4, var(--consonant-merch-card-catalog-width));
    }
}

merch-card[variant="catalog"] [slot="action-menu-content"] {
  background-color: #000;
  color: var(--color-white, #fff);
  font-size: var(--consonant-merch-card-body-xs-font-size);
  width: fit-content;
  padding: var(--consonant-merch-spacing-xs);
  border-radius: var(--consonant-merch-spacing-xxxs);
  position: absolute;
  top: 55px;
  right: 15px;
  line-height: var(--consonant-merch-card-body-line-height);
}

merch-card[variant="catalog"] [slot="action-menu-content"] ul {
  padding-left: 0;
  padding-bottom: var(--consonant-merch-spacing-xss);
  margin-top: 0;
  margin-bottom: 0;
  list-style-position: inside;
  list-style-type: '\u2022 ';
}

merch-card[variant="catalog"] [slot="action-menu-content"] ul li {
  padding-left: 0;
  line-height: var(--consonant-merch-card-body-line-height);
}

merch-card[variant="catalog"] [slot="action-menu-content"] ::marker {
  margin-right: 0;
}

merch-card[variant="catalog"] [slot="action-menu-content"] p {
  color: var(--color-white, #fff);
}

merch-card[variant="catalog"] [slot="action-menu-content"] a {
  color: var(--merch-card-background-color);
  text-decoration: underline;
}

merch-card[variant="catalog"] .payment-details {
  font-size: var(--consonant-merch-card-body-font-size);
  font-style: italic;
  font-weight: 400;
  line-height: var(--consonant-merch-card-body-line-height);
}`;var _l={title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"},allowedSizes:["wide","super-wide"]},st=class extends P{constructor(r){super(r);x(this,"toggleActionMenu",r=>{let n=r?.type==="mouseleave"?!0:void 0,i=this.card.shadowRoot.querySelector('slot[name="action-menu-content"]');i&&(n||this.card.dispatchEvent(new CustomEvent(Ma,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}})),i.classList.toggle("hidden",n))})}get aemFragmentMapping(){return _l}renderLayout(){return g` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${Ra()&&this.card.actionMenu?"always-visible":""}
                ${this.card.actionMenu?"invisible":"hidden"}"
                        @click="${this.toggleActionMenu}"
                    ></div>
                </div>
                <slot
                    name="action-menu-content"
                    class="action-menu-content
            ${this.card.actionMenuContent?"":"hidden"}"
                    >${this.card.actionMenuContent}</slot
                >
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":g`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?g`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return Ga}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenu)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenu)}};x(st,"variantStyle",w`
        :host([variant='catalog']) {
            min-height: 330px;
            width: var(--consonant-merch-card-catalog-width);
        }

        .body .catalog-badge {
            display: flex;
            height: fit-content;
            flex-direction: column;
            width: fit-content;
            max-width: 140px;
            border-radius: 5px;
            position: relative;
            top: 0;
            margin-left: var(--consonant-merch-spacing-xxs);
            box-sizing: border-box;
        }
    `);var Ha=`
:root {
  --consonant-merch-card-ccd-action-width: 276px;
  --consonant-merch-card-ccd-action-min-height: 320px;
}

.one-merch-card.ccd-action,
.two-merch-cards.ccd-action,
.three-merch-cards.ccd-action,
.four-merch-cards.ccd-action {
    grid-template-columns: var(--consonant-merch-card-ccd-action-width);
}

merch-card[variant="ccd-action"] .price-strikethrough {
    font-size: 18px;
}

@media screen and ${$} {
  .two-merch-cards.ccd-action,
  .three-merch-cards.ccd-action,
  .four-merch-cards.ccd-action {
      grid-template-columns: repeat(2, var(--consonant-merch-card-ccd-action-width));
  }
}

@media screen and ${O} {
  .three-merch-cards.ccd-action,
  .four-merch-cards.ccd-action {
      grid-template-columns: repeat(3, var(--consonant-merch-card-ccd-action-width));
  }
}

@media screen and ${H} {
  .four-merch-cards.ccd-action {
      grid-template-columns: repeat(4, var(--consonant-merch-card-ccd-action-width));
  }
}
`;var Ll={title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}},ct=class extends P{constructor(t){super(t)}getGlobalCSS(){return Ha}get aemFragmentMapping(){return Ll}renderLayout(){return g` <div class="body">
            <slot name="icons"></slot> ${this.badge}
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            ${this.promoBottom?g`<slot name="body-xs"></slot
                      ><slot name="promo-text"></slot>`:g`<slot name="promo-text"></slot
                      ><slot name="body-xs"></slot>`}
            <footer><slot name="footer"></slot></footer>
            <slot></slot>
        </div>`}};x(ct,"variantStyle",w`
        :host([variant='ccd-action']:not([size])) {
            width: var(--consonant-merch-card-ccd-action-width);
        }
    `);var za=`
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${$} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${O} {
  :root {
    --consonant-merch-card-image-width: 378px;
  }
    
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(3, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${H} {
  .four-merch-cards.image {
      grid-template-columns: repeat(4, var(--consonant-merch-card-image-width));
  }
}
`;var Hr=class extends P{constructor(t){super(t)}getGlobalCSS(){return za}renderLayout(){return g`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?g`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:g`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?g`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:g`
              <hr />
              ${this.secureLabelFooter}
          `}`}};var Fa=`
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${$} {
  .two-merch-cards.inline-heading,
  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${O} {
  :root {
    --consonant-merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${H} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var zr=class extends P{constructor(t){super(t)}getGlobalCSS(){return Fa}renderLayout(){return g` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":g`<hr />`} ${this.secureLabelFooter}`}};var Ba=`
  :root {
    --consonant-merch-card-mini-compare-chart-icon-size: 32px;
    --consonant-merch-card-mini-compare-mobile-cta-font-size: 15px;
    --consonant-merch-card-mini-compare-mobile-cta-width: 75px;
    --consonant-merch-card-mini-compare-badge-mobile-max-width: 50px;
  }
  
  merch-card[variant="mini-compare-chart"] [slot="heading-m"] {
    padding: 0 var(--consonant-merch-spacing-s) 0;
  }

  merch-card[variant="mini-compare-chart"] [slot="body-m"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s);
  }

  merch-card[variant="mini-compare-chart"] [is="inline-price"] {
    display: inline-block;
    min-height: 30px;
    min-width: 1px;
  }

  merch-card[variant="mini-compare-chart"] [slot='callout-content'] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0px;
  }

  merch-card[variant="mini-compare-chart"] [slot='callout-content'] [is="inline-price"] {
    min-height: unset;
  }

  merch-card[variant="mini-compare-chart"] [slot="price-commitment"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    padding: 0 var(--consonant-merch-spacing-s);
  }

  merch-card[variant="mini-compare-chart"] [slot="price-commitment"] a {
    display: inline-block;
    height: 27px;
  }

  merch-card[variant="mini-compare-chart"] [slot="offers"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
  }

  merch-card[variant="mini-compare-chart"] [slot="body-xxs"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0;    
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0;
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] a {
    text-decoration: underline;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-icon {
    display: flex;
    place-items: center;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-icon img {
    max-width: initial;
    width: var(--consonant-merch-card-mini-compare-chart-icon-size);
    height: var(--consonant-merch-card-mini-compare-chart-icon-size);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell {
    border-top: 1px solid var(--consonant-merch-card-border-color);
    display: flex;
    gap: var(--consonant-merch-spacing-xs);
    justify-content: start;
    place-items: center;
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description p {
    color: var(--merch-color-grey-80);
    vertical-align: bottom;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description a {
    color: var(--color-accent);
    text-decoration: solid;
  }
  
.one-merch-card.mini-compare-chart {
  grid-template-columns: var(--consonant-merch-card-mini-compare-chart-wide-width);
  gap: var(--consonant-merch-spacing-xs);
}

.two-merch-cards.mini-compare-chart,
.three-merch-cards.mini-compare-chart,
.four-merch-cards.mini-compare-chart {
  grid-template-columns: repeat(2, var(--consonant-merch-card-mini-compare-chart-width));
  gap: var(--consonant-merch-spacing-xs);
}

/* mini compare mobile */ 
@media screen and ${Ae} {
  :root {
    --consonant-merch-card-mini-compare-chart-width: 302px;
    --consonant-merch-card-mini-compare-chart-wide-width: 302px;
  }

  .two-merch-cards.mini-compare-chart,
  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
    grid-template-columns: var(--consonant-merch-card-mini-compare-chart-width);
    gap: var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m'] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='body-m'] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }
  
  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }
  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }
}

@media screen and ${Dr} {
  .three-merch-cards.mini-compare-chart merch-card [slot="footer"] a,
  .four-merch-cards.mini-compare-chart merch-card [slot="footer"] a {
    flex: 1;
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m'] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='body-m'] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }
  
  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }
}
@media screen and ${$} {
  :root {
    --consonant-merch-card-mini-compare-chart-width: 302px;
    --consonant-merch-card-mini-compare-chart-wide-width: 302px;
  }

  .two-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(2, minmax(var(--consonant-merch-card-mini-compare-chart-width), var(--consonant-merch-card-mini-compare-chart-wide-width)));
    gap: var(--consonant-merch-spacing-m);
  }

  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
      grid-template-columns: repeat(2, minmax(var(--consonant-merch-card-mini-compare-chart-width), var(--consonant-merch-card-mini-compare-chart-wide-width)));
  }
}

/* desktop */
@media screen and ${O} {
  :root {
    --consonant-merch-card-mini-compare-chart-width: 378px;
    --consonant-merch-card-mini-compare-chart-wide-width: 484px;  
  }
  .one-merch-card.mini-compare-chart {
    grid-template-columns: var(--consonant-merch-card-mini-compare-chart-wide-width);
  }

  .two-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(2, var(--consonant-merch-card-mini-compare-chart-wide-width));
    gap: var(--consonant-merch-spacing-m);
  }

  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(3, var(--consonant-merch-card-mini-compare-chart-width));
    gap: var(--consonant-merch-spacing-m);
  }
}

@media screen and ${H} {
  .four-merch-cards.mini-compare-chart {
      grid-template-columns: repeat(4, var(--consonant-merch-card-mini-compare-chart-width));
  }
}

merch-card .footer-row-cell:nth-child(1) {
  min-height: var(--consonant-merch-card-footer-row-1-min-height);
}

merch-card .footer-row-cell:nth-child(2) {
  min-height: var(--consonant-merch-card-footer-row-2-min-height);
}

merch-card .footer-row-cell:nth-child(3) {
  min-height: var(--consonant-merch-card-footer-row-3-min-height);
}

merch-card .footer-row-cell:nth-child(4) {
  min-height: var(--consonant-merch-card-footer-row-4-min-height);
}

merch-card .footer-row-cell:nth-child(5) {
  min-height: var(--consonant-merch-card-footer-row-5-min-height);
}

merch-card .footer-row-cell:nth-child(6) {
  min-height: var(--consonant-merch-card-footer-row-6-min-height);
}

merch-card .footer-row-cell:nth-child(7) {
  min-height: var(--consonant-merch-card-footer-row-7-min-height);
}

merch-card .footer-row-cell:nth-child(8) {
  min-height: var(--consonant-merch-card-footer-row-8-min-height);
}
`;var wl=32,lt=class extends P{constructor(r){super(r);x(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);x(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?g`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:g`<slot name="secure-transaction-label"></slot>`;return g`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return Ba}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section"),["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content"].forEach(i=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${i}"]`),i)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let n=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");n&&n.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;[...this.card.querySelector('[slot="footer-rows"]')?.children].forEach((n,i)=>{let o=Math.max(wl,parseFloat(window.getComputedStyle(n).height)||0),a=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(i+1)))||0;o>a&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(i+1),`${o}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(n=>{let i=n.querySelector(".footer-row-cell-description");i&&!i.textContent.trim()&&n.remove()})}renderLayout(){return g` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        <slot name="body-m"></slot>
        <slot name="heading-m-price"></slot>
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){Gr()?this.removeEmptyRows():(await Promise.all(this.card.prices.map(r=>r.onceSettled())),this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};x(lt,"variantStyle",w`
    :host([variant='mini-compare-chart']) > slot:not([name='icons']) {
        display: block;
    }
    :host([variant='mini-compare-chart']) footer {
        min-height: var(--consonant-merch-card-mini-compare-chart-footer-height);
        padding: var(--consonant-merch-spacing-xs);
    }

    /* mini-compare card  */
    :host([variant='mini-compare-chart']) .top-section {
        padding-top: var(--consonant-merch-spacing-s);
        padding-inline-start: var(--consonant-merch-spacing-s);
        height: var(--consonant-merch-card-mini-compare-chart-top-section-height);
    }

    @media screen and ${ve(Dr)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${ve(O)} {
        :host([variant='mini-compare-chart']) footer {
            padding: var(--consonant-merch-spacing-xs)
                var(--consonant-merch-spacing-s)
                var(--consonant-merch-spacing-s)
                var(--consonant-merch-spacing-s);
        }
    }

    :host([variant='mini-compare-chart']) slot[name='footer-rows'] {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: end;
    }
    /* mini-compare card heights for the slots: heading-m, body-m, heading-m-price, price-commitment, offers, promo-text, footer */
    :host([variant='mini-compare-chart']) slot[name='heading-m'] {
        min-height: var(--consonant-merch-card-mini-compare-chart-heading-m-height);
    }
    :host([variant='mini-compare-chart']) slot[name='body-m'] {
        min-height: var(--consonant-merch-card-mini-compare-chart-body-m-height);
    }
    :host([variant='mini-compare-chart']) slot[name='heading-m-price'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-heading-m-price-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='body-xxs'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-body-xxs-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='price-commitment'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-price-commitment-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='offers'] {
        min-height: var(--consonant-merch-card-mini-compare-chart-offers-height);
    }
    :host([variant='mini-compare-chart']) slot[name='promo-text'] {
        min-height: var(--consonant-merch-card-mini-compare-chart-promo-text-height);
    }
    :host([variant='mini-compare-chart']) slot[name='callout-content'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-callout-content-height
        );
    }
  `);var Ka=`
:root {
  --consonant-merch-card-plans-width: 300px;
  --consonant-merch-card-plans-icon-size: 40px;
}
  
merch-card[variant="plans"] [slot="description"] {
  min-height: 84px;
}

merch-card[variant="plans"] [slot="quantity-select"] {
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
  width: 100%;
  padding: var(--consonant-merch-spacing-xs);
}

.one-merch-card.plans,
.two-merch-cards.plans,
.three-merch-cards.plans,
.four-merch-cards.plans {
    grid-template-columns: var(--consonant-merch-card-plans-width);
}

/* Tablet */
@media screen and ${$} {
  :root {
    --consonant-merch-card-plans-width: 302px;
  }
  .two-merch-cards.plans,
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
  }
}

/* desktop */
@media screen and ${O} {
  :root {
    --consonant-merch-card-plans-width: 276px;
  }
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(3, var(--consonant-merch-card-plans-width));
  }
}

/* Large desktop */
    @media screen and ${H} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
}
`;var ht=class extends P{constructor(t){super(t)}getGlobalCSS(){return Ka}postCardUpdateHook(){this.adjustTitleWidth()}get stockCheckbox(){return this.card.checkboxLabel?g`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:""}renderLayout(){return g` ${this.badge}
        <div class="body">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            <slot name="body-xxs"></slot>
            ${this.promoBottom?"":g`<slot name="promo-text"></slot><slot name="callout-content"></slot> `}
            <slot name="body-xs"></slot>
            ${this.promoBottom?g`<slot name="promo-text"></slot><slot name="callout-content"></slot> `:""}  
            ${this.stockCheckbox}
        </div>
        <slot name="quantity-select"></slot>
        ${this.secureLabelFooter}`}};x(ht,"variantStyle",w`
    :host([variant='plans']) {
      min-height: 348px;
    }
      
    :host([variant='plans']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);var ja=`
:root {
  --consonant-merch-card-product-width: 300px;
}

/* grid style for product */
.one-merch-card.product,
.two-merch-cards.product,
.three-merch-cards.product,
.four-merch-cards.product {
    grid-template-columns: var(--consonant-merch-card-product-width);
}

/* Tablet */
@media screen and ${$} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${O} {
  :root {
    --consonant-merch-card-product-width: 378px;
  }
    
  .three-merch-cards.product,
  .four-merch-cards.product {
      grid-template-columns: repeat(3, var(--consonant-merch-card-product-width));
  }
}

/* Large desktop */
@media screen and ${H} {
  .four-merch-cards.product {
      grid-template-columns: repeat(4, var(--consonant-merch-card-product-width));
  }
}
`;var De=class extends P{constructor(t){super(t)}getGlobalCSS(){return ja}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return g` ${this.badge}
      <div class="body">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xxs"></slot>
          ${this.promoBottom?"":g`<slot name="promo-text"></slot>`}
          <slot name="body-xs"></slot>
          ${this.promoBottom?g`<slot name="promo-text"></slot>`:""}
          <slot name="callout-content"></slot>
          <slot name="body-lower"></slot>
      </div>
      ${this.secureLabelFooter}`}connectedCallbackHook(){super.connectedCallbackHook(),window.addEventListener("resize",this.postCardUpdateHook.bind(this))}postCardUpdateHook(){Gr()||this.adjustProductBodySlots()}};x(De,"variantStyle",w`
    :host([variant='product']) > slot:not([name='icons']) {
        display: block;
    }
    :host([variant='product']) slot[name='body-xs'] {
        min-height: var(--consonant-merch-card-product-body-xs-height);
        display: block;
    }
    :host([variant='product']) slot[name='heading-xs'] {
        min-height: var(--consonant-merch-card-product-heading-xs-height);
        display: block;
    }
    :host([variant='product']) slot[name='body-xxs'] {
        min-height: var(--consonant-merch-card-product-body-xxs-height);
        display: block;
    }
    :host([variant='product']) slot[name='promo-text'] {
        min-height: var(--consonant-merch-card-product-promo-text-height);
        display: block;
    }
    :host([variant='product']) slot[name='callout-content'] {
        min-height: var(--consonant-merch-card-product-callout-content-height);
        display: block;
    }
  `);var Ya=`
:root {
  --consonant-merch-card-segment-width: 378px;
}

/* grid style for segment */
.one-merch-card.segment,
.two-merch-cards.segment,
.three-merch-cards.segment,
.four-merch-cards.segment {
  grid-template-columns: minmax(276px, var(--consonant-merch-card-segment-width));
}

/* Mobile */
@media screen and ${Ae} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
}

@media screen and ${$} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
    
  .two-merch-cards.segment,
  .three-merch-cards.segment,
  .four-merch-cards.segment {
      grid-template-columns: repeat(2, minmax(276px, var(--consonant-merch-card-segment-width)));
  }
}

/* desktop */
@media screen and ${O} {
  :root {
    --consonant-merch-card-segment-width: 302px;
  }
    
  .three-merch-cards.segment {
      grid-template-columns: repeat(3, minmax(276px, var(--consonant-merch-card-segment-width)));
  }

  .four-merch-cards.segment {
      grid-template-columns: repeat(4, minmax(276px, var(--consonant-merch-card-segment-width)));
  }
}
`;var ut=class extends P{constructor(t){super(t)}getGlobalCSS(){return Ya}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return g` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":g`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?g`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};x(ut,"variantStyle",w`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);var Xa=`
:root {
  --consonant-merch-card-special-offers-width: 378px;
}

merch-card[variant="special-offers"] span[is="inline-price"][data-template="strikethrough"] {
  font-size: var(--consonant-merch-card-body-xs-font-size);
}

/* grid style for special-offers */
.one-merch-card.special-offers,
.two-merch-cards.special-offers,
.three-merch-cards.special-offers,
.four-merch-cards.special-offers {
  grid-template-columns: minmax(300px, var(--consonant-merch-card-special-offers-width));
}

@media screen and ${Ae} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${$} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
    
  .two-merch-cards.special-offers,
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
      grid-template-columns: repeat(2, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

/* desktop */
@media screen and ${O} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

@media screen and ${H} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var Pl={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}},dt=class extends P{constructor(t){super(t)}getGlobalCSS(){return Xa}get headingSelector(){return'[slot="detail-m"]'}get aemFragmentMapping(){return Pl}renderLayout(){return g`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?g`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:g`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};x(dt,"variantStyle",w`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);var Wa=`
:root {
  --consonant-merch-card-twp-width: 268px;
  --consonant-merch-card-twp-mobile-width: 300px;
  --consonant-merch-card-twp-mobile-height: 358px;
}
  
merch-card[variant="twp"] div[class$='twp-badge'] {
  padding: 4px 10px 5px 10px;
}

merch-card[variant="twp"] [slot="body-xs-top"] {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: var(--consonant-merch-card-body-xs-line-height);
  color: var(--merch-color-grey-80);
}

merch-card[variant="twp"] [slot="body-xs"] ul {
  padding: 0;
  margin: 0;
}

merch-card[variant="twp"] [slot="body-xs"] ul li {
  list-style-type: none;
  padding-left: 0;
}

merch-card[variant="twp"] [slot="body-xs"] ul li::before {
  content: '\xB7';
  font-size: 20px;
  padding-right: 5px;
  font-weight: bold;
}

merch-card[variant="twp"] [slot="footer"] {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: var(--consonant-merch-card-body-xs-line-height);
  padding: var(--consonant-merch-spacing-s);
  var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs);
  color: var(--merch-color-grey-80);
  display: flex;
  flex-flow: wrap;
}

merch-card[variant='twp'] merch-quantity-select,
merch-card[variant='twp'] merch-offer-select {
  display: none;
}

.one-merch-card.twp,
.two-merch-cards.twp,
.three-merch-cards.twp {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${Ae} {
  :root {
    --consonant-merch-card-twp-width: 300px;
  }
  .one-merch-card.twp,
  .two-merch-cards.twp,
  .three-merch-cards.twp {
      grid-template-columns: repeat(1, var(--consonant-merch-card-twp-mobile-width));
  }
}

@media screen and ${$} {
  :root {
    --consonant-merch-card-twp-width: 268px;
  }
  .one-merch-card.twp,
  .two-merch-cards.twp {
      grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
  }
  .three-merch-cards.twp {
      grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
  }
}
  
@media screen and ${O} {
  :root {
    --consonant-merch-card-twp-width: 268px;
  }
  .one-merch-card.twp
  .two-merch-cards.twp {
      grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
  }
  .three-merch-cards.twp {
      grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
  }
}

@media screen and ${H} {
    .one-merch-card.twp
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
  }
}
`;var mt=class extends P{constructor(t){super(t)}getGlobalCSS(){return Wa}renderLayout(){return g`${this.badge}
      <div class="top-section">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xs-top"></slot>
      </div>
      <div class="body">
          <slot name="body-xs"></slot>
      </div>
      <footer><slot name="footer"></slot></footer>`}};x(mt,"variantStyle",w`
    :host([variant='twp']) {
      padding: 4px 10px 5px 10px;
    }
    .twp-badge {
      padding: 4px 10px 5px 10px;
    }

    :host([variant='twp']) ::slotted(merch-offer-select) {
      display: none;
    }

    :host([variant='twp']) .top-section {
      flex: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: 100%;
      gap: var(--consonant-merch-spacing-xxs);
      padding: var(--consonant-merch-spacing-xs)
          var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs)
          var(--consonant-merch-spacing-xs);
      align-items: flex-start;
    }

    :host([variant='twp']) .body {
      padding: 0 var(--consonant-merch-spacing-xs);
    }
    
    :host([aria-selected]) .twp-badge {
        margin-inline-end: 2px;
        padding-inline-end: 9px;
    }

    :host([variant='twp']) footer {
      gap: var(--consonant-merch-spacing-xxs);
      flex-direction: column;
      align-self: flex-start;
    }
  `);var qa=`
:root {
  --merch-card-ccd-suggested-width: 304px;
  --merch-card-ccd-suggested-height: 205px;
  --merch-card-ccd-suggested-background-img-size: 119px;
}

merch-card[variant="ccd-suggested"] [slot="detail-m"] {
  color: var(--merch-color-grey-60);
}

merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
  color: var(--spectrum-gray-800, #F8F8F8);
  font-size: var(--merch-card-heading-xxs-font-size);
  line-height: var(--merch-card-heading-xxs-line-height);

}

merch-card[variant="ccd-suggested"] [slot="cta"] a {
  text-decoration: none;
  color: var(--spectrum-gray-800);
  font-weight: 700;
}
`;var Cl={subtitle:{tag:"h4",slot:"detail-m"},title:{tag:"h3",slot:"heading-xs"},prices:{tag:"p",slot:"price"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"cta",size:"s",button:!1}},pt=class extends P{getGlobalCSS(){return qa}get aemFragmentMapping(){return Cl}renderLayout(){return g`
          <div style="${this.stripStyle}" class="body">
              <div class="header">
                <slot name="icons"></slot>
                <div class="headings">
                  <slot name="detail-m"></slot>
                  <slot name="heading-xs"></slot>
                </div>
              </div>
              <slot name="body-xs"></slot>
              <div class="footer">
                <slot name="price"></slot>
                <slot name="cta"></slot>
              </div>
          </div>
                <slot></slot>`}};x(pt,"variantStyle",w`
    :host([variant='ccd-suggested']) {
      background-color: var(
        --spectrum-gray-50, #fff);
      width: var(--merch-card-ccd-suggested-width);
      min-height: var(--merch-card-ccd-suggested-height);
      border-radius: 4px;
      display: flex;
      flex-flow: wrap;
    }

    :host([variant='ccd-suggested']) .body {
      height: auto;
    }

    :host([variant='ccd-suggested']) .header {
      display: flex;
      flex-flow: wrap;
      place-self: flex-start;
    }

    :host([variant='ccd-suggested']) .headings {
      padding-inline-start: var(--consonant-merch-spacing-xxs);
    }

    :host([variant='ccd-suggested']) ::slotted([slot='icons']) {
      place-self: flex-start;
    }

    :host([variant='ccd-suggested']) ::slotted([slot='heading-xs']) {
      font-size: var(--merch-card-heading-xxs-font-size);
      line-height: var(--merch-card-heading-xxs-line-height);
    }
    
    :host([variant='ccd-suggested'][strip-size='wide']) ::slotted([slot='body-xs']) {
      padding-inline-start: 48px;
    }

    :host([variant='ccd-suggested'][strip-size='wide']) ::slotted([slot='price']) {
      padding-inline-start: 48px;
    }

    :host([variant='ccd-suggested']) ::slotted([slot='price']) {
      display: flex;
      align-items: center;
      color: var(--spectrum-gray-800, #F8F8F8);
    }

    :host([variant='ccd-suggested']) ::slotted([slot='cta']) {
      display: flex;
      align-items: center;
    }


    :host([variant='ccd-suggested']) .footer {
      display: flex;
      justify-content: space-between;
      flex-grow: 0;
      margin-top: auto;
      align-items: center;
    }
  `);var Za=`
:root {
  --consonant-merch-card-ccd-slice-single-width: 322px;
  --consonant-merch-card-ccd-slice-icon-size: 30px;
  --consonant-merch-card-ccd-slice-wide-width: 600px;
  --consonant-merch-card-ccd-slice-single-height: 154px;
  --consonant-merch-card-ccd-slice-background-img-size: 119px;
}

merch-card[variant="ccd-slice"] [slot='body-s'] a:not(.con-button) {
    font-size: var(--consonant-merch-card-body-xxs-font-size);
    font-style: normal;
    font-weight: 400;
    line-height: var(--consonant-merch-card-body-xxs-line-height);
    text-decoration-line: underline;
    color: var(--spectrum-blue-800, #147AF3);
  }

  merch-card[variant="ccd-slice"] [slot='image'] img {
    overflow: hidden;
    border-radius: 50%;
  }
`;var Il={backgroundImage:{tag:"div",slot:"image"},description:{tag:"div",slot:"body-s"},ctas:{size:"s"},allowedSizes:["wide"]},ft=class extends P{getGlobalCSS(){return Za}get aemFragmentMapping(){return Il}renderLayout(){return g` <div class="content">
                <slot name="icons"></slot> ${this.badge}
                <slot name="body-s"></slot>
                <slot name="footer"></slot>
            </div>
            <slot name="image"></slot>
            <slot></slot>`}};x(ft,"variantStyle",w`
        :host([variant='ccd-slice']) {
            width: var(--consonant-merch-card-ccd-slice-single-width);
            background-color: var(
              --spectrum-gray-50, #fff);
            border-radius: 4px;
            display: flex;
            flex-flow: wrap;
        }

        :host([variant='ccd-slice']) ::slotted([slot='body-s']) {
            font-size: var(--consonant-merch-card-body-xs-font-size);
            line-height: var(--consonant-merch-card-body-xxs-line-height);
        }

        :host([variant='ccd-slice'][size='wide']) {
            width: var(--consonant-merch-card-ccd-slice-wide-width);
        }

        :host([variant='ccd-slice']) .content {
            display: flex;
            gap: var(--consonant-merch-spacing-xxs);
            padding: var(--consonant-merch-spacing-xs);
            padding-inline-end: 0;
            width: 154px;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            flex: 1 0 0;
        }

        :host([variant='ccd-slice'])
            ::slotted([slot='body-s'])
            ::slotted(a:not(.con-button)) {
            font-size: var(--consonant-merch-card-body-xxs-font-size);
            font-style: normal;
            font-weight: 400;
            line-height: var(--consonant-merch-card-body-xxs-line-height);
            text-decoration-line: underline;
            color: var(--merch-color-grey-80);
        }

        :host([variant='ccd-slice']) ::slotted([slot='image']) {
            display: flex;
            justify-content: center;
            flex-shrink: 0;
            width: var(--consonant-merch-card-ccd-slice-background-img-size);
            height: var(--consonant-merch-card-ccd-slice-background-img-size);
            overflow: hidden;
            border-radius: 50%;
            padding: var(--consonant-merch-spacing-xs);
            align-self: center;
        }

        :host([variant='ccd-slice']) ::slotted([slot='image']) img {
            overflow: hidden;
            border-radius: 50%;
            width: inherit;
            height: inherit;
        }
    `);var wi=(e,t=!1)=>{switch(e.variant){case"catalog":return new st(e);case"ccd-action":return new ct(e);case"image":return new Hr(e);case"inline-heading":return new zr(e);case"mini-compare-chart":return new lt(e);case"plans":return new ht(e);case"product":return new De(e);case"segment":return new ut(e);case"special-offers":return new dt(e);case"twp":return new mt(e);case"ccd-suggested":return new pt(e);case"ccd-slice":return new ft(e);default:return t?void 0:new De(e)}},Ja=()=>{let e=[];return e.push(st.variantStyle),e.push(ct.variantStyle),e.push(lt.variantStyle),e.push(De.variantStyle),e.push(ht.variantStyle),e.push(ut.variantStyle),e.push(dt.variantStyle),e.push(mt.variantStyle),e.push(pt.variantStyle),e.push(ft.variantStyle),e};var Qa=document.createElement("style");Qa.innerHTML=`
:root {
    --consonant-merch-card-detail-font-size: 12px;
    --consonant-merch-card-detail-font-weight: 500;
    --consonant-merch-card-detail-letter-spacing: 0.8px;

    --consonant-merch-card-heading-font-size: 18px;
    --consonant-merch-card-heading-line-height: 22.5px;
    --consonant-merch-card-heading-secondary-font-size: 14px;
    --consonant-merch-card-body-font-size: 14px;
    --consonant-merch-card-body-line-height: 21px;
    --consonant-merch-card-promo-text-height: var(--consonant-merch-card-body-font-size);

    /* spacing */
    --consonant-merch-spacing-xxxs: 4px;
    --consonant-merch-spacing-xxs: 8px;
    --consonant-merch-spacing-xs: 16px;
    --consonant-merch-spacing-s: 24px;
    --consonant-merch-spacing-m: 32px;

    /* cta */
    --consonant-merch-card-cta-font-size: 15px;

    /* headings */
    --merch-card-heading-xxs-font-size: 16px;
    --merch-card-heading-xxs-line-height: 20px;
    --consonant-merch-card-heading-xs-font-size: 18px;
    --consonant-merch-card-heading-xs-line-height: 22.5px;
    --consonant-merch-card-heading-s-font-size: 20px;
    --consonant-merch-card-heading-s-line-height: 25px;
    --consonant-merch-card-heading-m-font-size: 24px;
    --consonant-merch-card-heading-m-line-height: 30px;
    --consonant-merch-card-heading-l-font-size: 20px;
    --consonant-merch-card-heading-l-line-height: 30px;
    --consonant-merch-card-heading-xl-font-size: 36px;
    --consonant-merch-card-heading-xl-line-height: 45px;

    /* detail */
    --consonant-merch-card-detail-m-font-size: 12px;
    --consonant-merch-card-detail-m-line-height: 15px;
    --consonant-merch-card-detail-m-font-weight: 700;
    --consonant-merch-card-detail-m-letter-spacing: 1px;

    /* body */
    --consonant-merch-card-body-xxs-font-size: 12px;
    --consonant-merch-card-body-xxs-line-height: 18px;
    --consonant-merch-card-body-xxs-letter-spacing: 1px;
    --consonant-merch-card-body-xs-font-size: 14px;
    --consonant-merch-card-body-xs-line-height: 21px;
    --consonant-merch-card-body-s-font-size: 16px;
    --consonant-merch-card-body-s-line-height: 24px;
    --consonant-merch-card-body-m-font-size: 18px;
    --consonant-merch-card-body-m-line-height: 27px;
    --consonant-merch-card-body-l-font-size: 20px;
    --consonant-merch-card-body-l-line-height: 30px;
    --consonant-merch-card-body-xl-font-size: 22px;
    --consonant-merch-card-body-xl-line-height: 33px;


    --consonant-merch-card-heading-padding: 0;

    /* colors */
    --merch-card-background-color: var(--spectrum-gray-background-color-default, #fff);
    --consonant-merch-card-border-color: #eaeaea;
    --color-accent: #1473E6;
    --merch-color-focus-ring: #1473E6;
    --merch-color-grey-60: var(--spectrum-global-color-gray-600, #6D6D6D);
    --merch-color-grey-80: #2c2c2c;
    --merch-color-green-promo: #2D9D78;
    --merch-color-content-neutral-default: #222222; /* CCD */

    /* merch card generic */
    --consonant-merch-card-max-width: 300px;
    --transition: cmax-height 0.3s linear, opacity 0.3s linear;

    /* background image */
    --consonant-merch-card-bg-img-height: 180px;

    /* inline SVGs */
    --checkmark-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath fill='%23fff' d='M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1 1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712 6A.999.999 0 0 1 3.788 9z' class='spectrum-UIIcon--medium'/%3E%3C/svg%3E%0A");

    --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23757575' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");

    --info-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'><circle cx='18' cy='12' r='2.15'%3E%3C/circle%3E%3Cpath d='M20.333 24H20v-7.6a.4.4 0 0 0-.4-.4h-3.933s-1.167.032-1.167 1 1.167 1 1.167 1H16v6h-.333s-1.167.032-1.167 1 1.167 1 1.167 1h4.667s1.167-.033 1.167-1-1.168-1-1.168-1z'%3E%3C/path%3E%3Cpath d='M18 2.1A15.9 15.9 0 1 0 33.9 18 15.9 15.9 0 0 0 18 2.1zm0 29.812A13.912 13.912 0 1 1 31.913 18 13.912 13.912 0 0 1 18 31.913z'%3E%3C/path%3E%3C/svg%3E");

    --ellipsis-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="2" cy="2" r="2" fill="%232c2c2c" transform="translate(6 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" data-name="Ellipse 71" transform="translate(12 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" transform="translate(0 6)"/></svg>');

    /* callout */
    --consonant-merch-card-callout-line-height: 21px;
    --consonant-merch-card-callout-font-size: 14px;
    --consonant-merch-card-callout-font-color: #2C2C2C;
    --consonant-merch-card-callout-icon-size: 16px;
    --consonant-merch-card-callout-icon-top: 6px;
    --consonant-merch-card-callout-icon-right: 8px;
    --consonant-merch-card-callout-letter-spacing: 0px;
    --consonant-merch-card-callout-icon-padding: 34px;
    --consonant-merch-card-callout-spacing-xxs: 8px;
}

merch-card-collection {
    display: contents;
}

merch-card-collection > merch-card:not([style]) {
    display: none;
}

merch-card-collection > p[slot],
merch-card-collection > div[slot] p {
    margin: 0;
}

.one-merch-card,
.two-merch-cards,
.three-merch-cards,
.four-merch-cards {
    display: grid;
    justify-content: center;
    justify-items: stretch;
    gap: var(--consonant-merch-spacing-m);
    padding: var(--spacing-m);
}

merch-card.background-opacity-70 {
    background-color: rgba(255 255 255 / 70%);
}

merch-card.has-divider hr {
    margin-bottom: var(--consonant-merch-spacing-xs);
    height: 1px;
    border: none;
}

merch-card p, merch-card h3, merch-card h4 {
    margin: 0;
}

merch-card span[is=inline-price] {
    display: inline-block;
}

merch-card [slot='heading-xs'] {
    color: var(--spectrum-gray-800, #2c2c2c);
    font-size: var(--consonant-merch-card-heading-xs-font-size);
    line-height: var(--consonant-merch-card-heading-xs-line-height);
    margin: 0;
    text-decoration: none;
}

merch-card.dc-pricing [slot='heading-xs'] {
    margin-bottom: var(--consonant-merch-spacing-xxs);
}

merch-card:not([variant='inline-heading']) [slot='heading-xs'] a {
    color: var(--merch-color-grey-80);
}

merch-card div.starting-at {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: var(--consonant-merch-card-body-xs-line-height);
  font-weight: 500;
}

merch-card [slot='heading-xs'] a:not(:hover) {
    text-decoration: inherit;
}

merch-card [slot='heading-s'] {
    font-size: var(--consonant-merch-card-heading-s-font-size);
    line-height: var(--consonant-merch-card-heading-s-line-height);
    margin: 0;
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot='heading-m'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    margin: 0;
    color: var(--spectrum-gray-800, #2c2c2c);
    font-weight: 700;
}

merch-card [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    padding: 0 var(--consonant-merch-spacing-s);
    font-weight: 700;
    margin: 0;
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot='offers'] {
    padding: var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-s);
}

merch-card [slot='heading-l'] {
    font-size: var(--consonant-merch-card-heading-l-font-size);
    line-height: var(--consonant-merch-card-heading-l-line-height);
    margin: 0;
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot='heading-xl'] {
    font-size: var(--consonant-merch-card-heading-xl-font-size);
    line-height: var(--consonant-merch-card-heading-xl-line-height);
    margin: 0;
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot='callout-content'] {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--consonant-merch-card-callout-spacing-xxs);
}

merch-card [slot='callout-content'] > div {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--consonant-merch-card-callout-spacing-xxs);
    align-items: flex-start;
}

merch-card [slot='callout-content'] > div > div {
    display: flex;
    background: rgba(203 203 203 / 50%);
    border-radius: var(--consonant-merch-spacing-xxxs);
    padding: var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxs);
}

merch-card [slot='callout-content'] > div > div > div {
    display: inline-block;
    text-align: start;
    font: normal normal normal var(--consonant-merch-card-callout-font-size)/var(--consonant-merch-card-callout-line-height) var(--body-font-family, 'Adobe Clean');
    letter-spacing: var(--consonant-merch-card-callout-letter-spacing);
    color: var(--consonant-merch-card-callout-font-color);
}

merch-card [slot='callout-content'] img {
    width: var(--consonant-merch-card-callout-icon-size);
    height: var(--consonant-merch-card-callout-icon-size);
    margin-inline-end: 2.5px;
    margin-inline-start: 9px;
    margin-block-start: 2.5px;
}

merch-card [slot='detail-m'] {
    font-size: var(--consonant-merch-card-detail-m-font-size);
    letter-spacing: var(--consonant-merch-card-detail-m-letter-spacing);
    font-weight: var(--consonant-merch-card-detail-m-font-weight);
    text-transform: uppercase;
    margin: 0;
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-xxs"] {
    font-size: var(--consonant-merch-card-body-xxs-font-size);
    line-height: var(--consonant-merch-card-body-xxs-line-height);
    font-weight: normal;
    letter-spacing: var(--consonant-merch-card-body-xxs-letter-spacing);
    color: var(--spectrum-gray-800, #2c2c2c);
    margin: 0;
}

merch-card [slot="body-xs"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot="body-m"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
    line-height: var(--consonant-merch-card-body-m-line-height);
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot="body-l"] {
    font-size: var(--consonant-merch-card-body-l-font-size);
    line-height: var(--consonant-merch-card-body-l-line-height);
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot="body-s"] {
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot="body-xl"] {
    font-size: var(--consonant-merch-card-body-xl-font-size);
    line-height: var(--consonant-merch-card-body-xl-line-height);
    color: var(--spectrum-gray-800, #2c2c2c);
}

[slot="cci-footer"] p,
[slot="cct-footer"] p,
[slot="cce-footer"] p {
    margin: 0;
}

merch-card [slot="promo-text"] {
    color: var(--merch-color-green-promo);
    font-size: var(--consonant-merch-card-promo-text-height);
    font-weight: 700;
    line-height: var(--consonant-merch-card-promo-text-height);
    margin: 0;
    min-height: var(--consonant-merch-card-promo-text-height);
    padding: 0;
}

div[slot="footer"] {
    display: contents;
}

[slot="footer"] a {
    word-wrap: break-word;
    text-align: center;
}

[slot="footer"] a:not([class]) {
    font-weight: 700;
    font-size: var(--consonant-merch-card-cta-font-size);
}

div[slot='bg-image'] img {
    position: relative;
    width: 100%;
    min-height: var(--consonant-merch-card-bg-img-height);
    max-height: var(--consonant-merch-card-bg-img-height);
    object-fit: cover;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
}

span[is="inline-price"][data-template='strikethrough'] {
    text-decoration: line-through;
}

merch-card sp-button a {
  text-decoration: none;
    color: var(
        --highcontrast-button-content-color-default,
        var(
            --mod-button-content-color-default,
            var(--spectrum-button-content-color-default)
        )
    );
}

merch-card span.placeholder-resolved[data-template='strikethrough'],
merch-card span.price.price-strikethrough {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  font-weight: normal;
}

/* merch-offer-select */
merch-offer-select[variant="subscription-options"] merch-offer span[is="inline-price"][data-display-tax='true'] .price-tax-inclusivity {
    font-size: 12px;
    font-style: italic;
    font-weight: normal;
    position: absolute;
    left: 0;
    top: 20px;
}

body.merch-modal {
    overflow: hidden;
    scrollbar-gutter: stable;
    height: 100vh;
}
`;document.head.appendChild(Qa);async function es(e,t){var a;let r=e.fields.reduce((s,{name:c,multiple:h,values:l})=>(s[c]=h?l:l[0],s),{id:e.id}),{variant:n}=r;if(!n)return;r.model=r.model,t.variant=n,await t.updateComplete;let{aemFragmentMapping:i}=t.variantLayout;if(!i)return;(a=t.variantLayout).refs??(a.refs=[]),t.variantLayout.refs.forEach(s=>s.remove());let o=s=>{t.variantLayout.refs.push(s),t.append(s)};if(r.mnemonicIcon?.forEach((s,c)=>{let h=r.mnemonicLink?.length>c?r.mnemonicLink[c]:"",l=r.mnemonicAlt?.length>c?r.mnemonicAlt[c]:"",u=ue("merch-icon",{slot:"icons",src:s,alt:l,href:h,size:"l"});o(u)}),r.size&&i.allowedSizes?.includes(r.size)&&t.setAttribute("size",r.size),r.cardTitle&&i.title&&o(ue(i.title.tag,{slot:i.title.slot},r.cardTitle)),r.subtitle&&i.subtitle&&o(ue(i.subtitle.tag,{slot:i.subtitle.slot},r.subtitle)),r.backgroundImage&&i.backgroundImage&&o(ue(i.backgroundImage.tag,{slot:i.backgroundImage.slot},`<img loading="lazy" src="${r.backgroundImage}" />`)),r.prices&&i.prices){let s=r.prices,c=ue(i.prices.tag,{slot:i.prices.slot},s);o(c)}if(r.description&&i.description){let s=ue(i.description.tag,{slot:i.description.slot},r.description);o(s)}if(r.ctas){let{slot:s,button:c=!0}=i.ctas,h=ue("div",{slot:s??"footer"},r.ctas),l=[];[...h.querySelectorAll("a")].forEach(u=>{let d=u.parentElement.tagName==="STRONG";if(t.consonant)u.classList.add("con-button"),d&&u.classList.add("blue"),l.push(u);else{if(!c){l.push(u);return}let v=ue("sp-button",{treatment:d?"fill":"outline",variant:d?"accent":"primary"},u);v.addEventListener("click",A=>{A.target===v&&(A.stopPropagation(),u.click())}),l.push(v)}}),h.innerHTML="",h.append(...l),o(h)}}var Nl="merch-card",Bt=class extends ie{constructor(){super();x(this,"customerSegment");x(this,"marketSegment");x(this,"variantLayout");this.filters={},this.types="",this.selected=!1,this.handleLoadEvent=this.handleLoadEvent.bind(this)}firstUpdated(){this.variantLayout=wi(this,!1),this.variantLayout?.connectedCallbackHook(),this.aemFragment?.updateComplete.catch(()=>{this.style.display="none"})}willUpdate(r){(r.has("variant")||!this.variantLayout)&&(this.variantLayout=wi(this),this.variantLayout.connectedCallbackHook())}updated(r){(r.has("badgeBackgroundColor")||r.has("borderColor"))&&(this.style.border=this.computedBorderStyle),this.variantLayout?.postCardUpdateHook(this)}get theme(){return this.closest("sp-theme")}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return this.variant!=="twp"?`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`:""}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}async toggleStockOffer({target:r}){if(!this.stockOfferOsis)return;let n=this.checkoutLinks;if(n.length!==0)for(let i of n){await i.onceSettled();let o=i.value?.[0]?.planType;if(!o)return;let a=this.stockOfferOsis[o];if(!a)return;let s=i.dataset.wcsOsi.split(",").filter(c=>c!==a);r.checked&&s.push(a),i.dataset.wcsOsi=s.join(",")}}handleQuantitySelection(r){let n=this.checkoutLinks;for(let i of n)i.dataset.quantity=r.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(r){let n={...this.filters};Object.keys(n).forEach(i=>{if(r){n[i].order=Math.min(n[i].order||2,2);return}let o=n[i].order;o===1||isNaN(o)||(n[i].order=Number(o)+1)}),this.filters=n}includes(r){return this.textContent.match(new RegExp(r,"i"))!==null}connectedCallback(){super.connectedCallback(),this.setAttribute("tabindex",this.getAttribute("tabindex")??"0"),this.addEventListener(Li,this.handleQuantitySelection),this.addEventListener($a,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.storageOptions?.addEventListener("change",this.handleStorageChange),this.addEventListener(Ft,this.handleLoadEvent)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout.disconnectedCallbackHook(),this.removeEventListener(Li,this.handleQuantitySelection),this.storageOptions?.removeEventListener(_i,this.handleStorageChange),this.removeEventListener(Ft,this.handleLoadEvent)}handleLoadEvent(r){if(r.target.nodeName==="AEM-FRAGMENT"){let n=r.detail;if(!n)return;es(n,this),this.dispatchEvent(new CustomEvent(Da,{bubbles:!0,composed:!0}))}}get aemFragment(){return this.querySelector("aem-fragment")}get storageOptions(){return this.querySelector("sp-radio-group#storage")}get storageSpecificOfferSelect(){let r=this.storageOptions?.selected;if(r){let n=this.querySelector(`merch-offer-select[storage="${r}"]`);if(n)return n}return this.querySelector("merch-offer-select")}get offerSelect(){return this.storageOptions?this.storageSpecificOfferSelect:this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||this.dispatchEvent(new CustomEvent(Ua,{bubbles:!0}))}handleStorageChange(){let r=this.closest("merch-card")?.offerSelect.cloneNode(!0);r&&this.dispatchEvent(new CustomEvent(_i,{detail:{offerSelect:r},bubbles:!0}))}get dynamicPrice(){return this.querySelector('[slot="price"]')}selectMerchOffer(r){if(r===this.merchOffer)return;this.merchOffer=r;let n=this.dynamicPrice;if(r.price&&n){let i=r.price.cloneNode(!0);n.onceSettled?n.onceSettled().then(()=>{n.replaceWith(i)}):n.replaceWith(i)}}};x(Bt,"properties",{name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color"},borderColor:{type:String,attribute:"border-color"},badgeBackgroundColor:{type:String,attribute:"badge-background-color"},stripSize:{type:String,attribute:"strip-size"},stripBackground:{type:String,attribute:"strip-background"},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:r=>{let[n,i,o]=r.split(",");return{PUF:n,ABM:i,M2M:o}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:r=>Object.fromEntries(r.split(",").map(n=>{let[i,o,a]=n.split(":"),s=Number(o);return[i,{order:isNaN(s)?void 0:s,size:a}]})),toAttribute:r=>Object.entries(r).map(([n,{order:i,size:o}])=>[n,i,o].filter(a=>a!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object}}),x(Bt,"styles",[Oa,Ja(),...Va()]);customElements.define(Nl,Bt);var gt=class extends ie{constructor(){super(),this.size="m",this.alt=""}render(){let{href:t}=this;return t?g`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="lazy" />
              </a>`:g` <img src="${this.src}" alt="${this.alt}" loading="lazy" />`}};x(gt,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0}}),x(gt,"styles",w`
        :host {
            --img-width: 32px;
            --img-height: 32px;
            display: block;
            width: var(--img-width);
            height: var(--img-height);
        }

        :host([size='s']) {
            --img-width: 24px;
            --img-height: 24px;
        }

        :host([size='l']) {
            --img-width: 40px;
            --img-height: 40px;
        }

        img {
            width: var(--img-width);
            height: var(--img-height);
        }
    `);customElements.define("merch-icon",gt);async function kl(e){let t=e.headers.get("Etag"),r=await e.json();return r.etag=t,r}async function ts(e,t,r){let n=await fetch(`${e}/adobe/sites/cf/fragments/${t}`,{headers:r});if(!n.ok)throw new Error(`Failed to get fragment: ${n.status} ${n.statusText}`);return await kl(n)}var ns=new CSSStyleSheet;ns.replaceSync(":host { display: contents; }");var Ol=document.querySelector('meta[name="aem-base-url"]')?.content??"https://publish-p22655-e155390.adobeaemcloud.com",rs="fragment",Vl="ims",Pi,Se,Ci=class{constructor(){ze(this,Se,new Map)}clear(){W(this,Se).clear()}add(...t){t.forEach(r=>{let{id:n}=r;n&&W(this,Se).set(n,r)})}has(t){return W(this,Se).has(t)}get(t){return W(this,Se).get(t)}remove(t){W(this,Se).delete(t)}};Se=new WeakMap;var Fr=new Ci,Ii=class extends HTMLElement{constructor(){super();x(this,"cache",Fr);x(this,"data");x(this,"fragmentId");x(this,"consonant",!1);x(this,"ims",!1);x(this,"_readyPromise");this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[ns];let r=this.getAttribute(Vl);["",!0].includes(r)?(this.ims=!0,Pi||(Pi={Authorization:`Bearer ${window.adobeid?.authorize?.()}`,pragma:"no-cache","cache-control":"no-cache"})):this.ims=!1}static get observedAttributes(){return[rs]}attributeChangedCallback(r,n,i){r===rs&&(this.fragmentId=i,this.refresh(!1))}async refresh(r=!0){this.fragmentId&&(this._readyPromise&&!await Promise.race([this._readyPromise,Promise.resolve(!1)])||(r&&Fr.remove(this.fragmentId),this._readyPromise=this.fetchData().then(()=>(this.dispatchEvent(new CustomEvent(Ft,{detail:this.data,bubbles:!0,composed:!0})),!0))))}async fetchData(){let r=Fr.get(this.fragmentId);r||(r=await ts(Ol,this.fragmentId,this.ims?Pi:void 0),Fr.add(r)),this.data=r}get updateComplete(){return this._readyPromise??Promise.reject(new Error("AEM fragment cannot be loaded"))}};customElements.define("aem-fragment",Ii);var{searchParams:is}=new URL(import.meta.url),Rl=is.get("locale")??"US_en",os=is.get("env")==="stage",$l=os?"stage":"prod",Ul=os?"STAGE":"PROD",Ml=()=>({env:{name:$l},commerce:{"commerce.env":Ul},locale:{prefix:Rl}}),Dl=Nt(Ml),kf=Dl;export{kf as default};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
