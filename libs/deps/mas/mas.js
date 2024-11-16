var us=Object.create;var Yt=Object.defineProperty;var ms=Object.getOwnPropertyDescriptor;var ps=Object.getOwnPropertyNames;var fs=Object.getPrototypeOf,gs=Object.prototype.hasOwnProperty;var Vi=e=>{throw TypeError(e)};var xs=(e,t,r)=>t in e?Yt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var vs=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),bs=(e,t)=>{for(var r in t)Yt(e,r,{get:t[r],enumerable:!0})},As=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of ps(t))!gs.call(e,i)&&i!==r&&Yt(e,i,{get:()=>t[i],enumerable:!(n=ms(t,i))||n.enumerable});return e};var Es=(e,t,r)=>(r=e!=null?us(fs(e)):{},As(t||!e||!e.__esModule?Yt(r,"default",{value:e,enumerable:!0}):r,e));var p=(e,t,r)=>xs(e,typeof t!="symbol"?t+"":t,r),Mr=(e,t,r)=>t.has(e)||Vi("Cannot "+r);var M=(e,t,r)=>(Mr(e,t,"read from private field"),r?r.call(e):t.get(e)),j=(e,t,r)=>t.has(e)?Vi("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),fe=(e,t,r,n)=>(Mr(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r),ze=(e,t,r)=>(Mr(e,t,"access private method"),r);var Yo=vs((pu,ml)=>{ml.exports={total:38,offset:0,limit:38,data:[{lang:"ar",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u0627\u0644\u0634\u0647\u0631} YEAR {/\u0627\u0644\u0639\u0627\u0645} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u0643\u0644 \u0634\u0647\u0631} YEAR {\u0643\u0644 \u0639\u0627\u0645} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0644\u0643\u0644 \u062A\u0631\u062E\u064A\u0635} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0644\u0643\u0644 \u062A\u0631\u062E\u064A\u0635} other {}}",freeLabel:"\u0645\u062C\u0627\u0646\u064B\u0627",freeAriaLabel:"\u0645\u062C\u0627\u0646\u064B\u0627",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u0623\u0648 \u0628\u062F\u0644\u0627\u064B \u0645\u0646 \u0630\u0644\u0643 \u0628\u0642\u064A\u0645\u0629 {alternativePrice}",strikethroughAriaLabel:"\u0628\u0634\u0643\u0644 \u0645\u0646\u062A\u0638\u0645 \u0628\u0642\u064A\u0645\u0629 {strikethroughPrice}"},{lang:"bg",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u043C\u0435\u0441.} YEAR {/\u0433\u043E\u0434.} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u043D\u0430 \u043C\u0435\u0441\u0435\u0446} YEAR {\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u043D\u0430 \u043B\u0438\u0446\u0435\u043D\u0437} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u043D\u0430 \u043B\u0438\u0446\u0435\u043D\u0437} other {}}",freeLabel:"\u0411\u0435\u0437\u043F\u043B\u0430\u0442\u043D\u043E",freeAriaLabel:"\u0411\u0435\u0437\u043F\u043B\u0430\u0442\u043D\u043E",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u0410\u043B\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u043E \u043D\u0430 {alternativePrice}",strikethroughAriaLabel:"\u0420\u0435\u0434\u043E\u0432\u043D\u043E \u043D\u0430 {strikethroughPrice}"},{lang:"cs",recurrenceLabel:"{recurrenceTerm, select, MONTH {/m\u011Bs\xEDc} YEAR {/rok} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {za m\u011Bs\xEDc} YEAR {za rok} other {}}",perUnitLabel:"{perUnit, select, LICENSE {za licenci} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {za licenci} other {}}",freeLabel:"Zdarma",freeAriaLabel:"Zdarma",taxExclusiveLabel:"{taxTerm, select, GST {bez dan\u011B ze zbo\u017E\xED a slu\u017Eeb} VAT {bez DPH} TAX {bez dan\u011B} IVA {bez IVA} SST {bez SST} KDV {bez KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {v\u010Detn\u011B dan\u011B ze zbo\u017E\xED a slu\u017Eeb} VAT {v\u010Detn\u011B DPH} TAX {v\u010Detn\u011B dan\u011B} IVA {v\u010Detn\u011B IVA} SST {v\u010Detn\u011B SST} KDV {v\u010Detn\u011B KDV} other {}}",alternativePriceAriaLabel:"P\u0159\xEDpadn\u011B za {alternativePrice}",strikethroughAriaLabel:"Pravideln\u011B za {strikethroughPrice}"},{lang:"da",recurrenceLabel:"{recurrenceTerm, select, MONTH {/md} YEAR {/\xE5r} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {pr. m\xE5ned} YEAR {pr. \xE5r} other {}}",perUnitLabel:"{perUnit, select, LICENSE {pr. licens} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {pr. licens} other {}}",freeLabel:"Gratis",freeAriaLabel:"Gratis",taxExclusiveLabel:"{taxTerm, select, GST {ekskl. GST} VAT {ekskl. moms} TAX {ekskl. skat} IVA {ekskl. IVA} SST {ekskl. SST} KDV {ekskl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. skat} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativt til {alternativePrice}",strikethroughAriaLabel:"Normalpris {strikethroughPrice}"},{lang:"de",recurrenceLabel:"{recurrenceTerm, select, MONTH {/Monat} YEAR {/Jahr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {pro Monat} YEAR {pro Jahr} other {}}",perUnitLabel:"{perUnit, select, LICENSE {pro Lizenz} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {pro Lizenz} other {}}",freeLabel:"Kostenlos",freeAriaLabel:"Kostenlos",taxExclusiveLabel:"{taxTerm, select, GST {zzgl. GST} VAT {zzgl. MwSt.} TAX {zzgl. Steuern} IVA {zzgl. IVA} SST {zzgl. SST} KDV {zzgl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. MwSt.} TAX {inkl. Steuern} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativ: {alternativePrice}",strikethroughAriaLabel:"Regul\xE4r: {strikethroughPrice}"},{lang:"en",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at {alternativePrice}",strikethroughAriaLabel:"Regularly at {strikethroughPrice}"},{lang:"et",recurrenceLabel:"{recurrenceTerm, select, MONTH {kuus} YEAR {aastas} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {kuus} YEAR {aastas} other {}}",perUnitLabel:"{perUnit, select, LICENSE {litsentsi kohta} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {litsentsi kohta} other {}}",freeLabel:"Tasuta",freeAriaLabel:"Tasuta",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Teise v\xF5imalusena hinnaga {alternativePrice}",strikethroughAriaLabel:"Tavahind {strikethroughPrice}"},{lang:"fi",recurrenceLabel:"{recurrenceTerm, select, MONTH {/kk} YEAR {/v} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {kuukausittain} YEAR {vuosittain} other {}}",perUnitLabel:"{perUnit, select, LICENSE {k\xE4ytt\xF6oikeutta kohti} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {k\xE4ytt\xF6oikeutta kohti} other {}}",freeLabel:"Maksuton",freeAriaLabel:"Maksuton",taxExclusiveLabel:"{taxTerm, select, GST {ilman GST:t\xE4} VAT {ilman ALV:t\xE4} TAX {ilman veroja} IVA {ilman IVA:ta} SST {ilman SST:t\xE4} KDV {ilman KDV:t\xE4} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {sis. GST:n} VAT {sis. ALV:n} TAX {sis. verot} IVA {sis. IVA:n} SST {sis. SST:n} KDV {sis. KDV:n} other {}}",alternativePriceAriaLabel:"Vaihtoehtoisesti hintaan {alternativePrice}",strikethroughAriaLabel:"S\xE4\xE4nn\xF6llisesti hintaan {strikethroughPrice}"},{lang:"fr",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mois} YEAR {/an} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {par mois} YEAR {par an} other {}}",perUnitLabel:"{perUnit, select, LICENSE {par licence} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {par licence} other {}}",freeLabel:"Gratuit",freeAriaLabel:"Gratuit",taxExclusiveLabel:"{taxTerm, select, GST {hors TPS} VAT {hors TVA} TAX {hors taxes} IVA {hors IVA} SST {hors SST} KDV {hors KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {TPS comprise} VAT {TVA comprise} TAX {taxes comprises} IVA {IVA comprise} SST {SST comprise} KDV {KDV comprise} other {}}",alternativePriceAriaLabel:"Autre prix {alternativePrice}",strikethroughAriaLabel:"Prix habituel {strikethroughPrice}"},{lang:"he",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u05D7\u05D5\u05D3\u05E9} YEAR {/\u05E9\u05E0\u05D4} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u05DC\u05D7\u05D5\u05D3\u05E9} YEAR {\u05DC\u05E9\u05E0\u05D4} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",freeLabel:"\u05D7\u05D9\u05E0\u05DD",freeAriaLabel:"\u05D7\u05D9\u05E0\u05DD",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u05DC\u05D7\u05DC\u05D5\u05E4\u05D9\u05DF \u05D1-{alternativePrice}",strikethroughAriaLabel:"\u05D1\u05D0\u05D5\u05E4\u05DF \u05E7\u05D1\u05D5\u05E2 \u05D1-{strikethroughPrice}"},{lang:"hu",recurrenceLabel:"{recurrenceTerm, select, MONTH {/h\xF3} YEAR {/\xE9v} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {havonta} YEAR {\xE9vente} other {}}",perUnitLabel:"{perUnit, select, LICENSE {licencenk\xE9nt} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {licencenk\xE9nt} other {}}",freeLabel:"Ingyenes",freeAriaLabel:"Ingyenes",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"M\xE1sik lehet\u0151s\xE9g: {alternativePrice}",strikethroughAriaLabel:"\xC1ltal\xE1ban {strikethroughPrice} \xE1ron"},{lang:"it",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mese} YEAR {/anno} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {al mese} YEAR {all'anno} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per licenza} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per licenza} other {}}",freeLabel:"Gratuito",freeAriaLabel:"Gratuito",taxExclusiveLabel:"{taxTerm, select, GST {escl. GST} VAT {escl. IVA.} TAX {escl. imposte} IVA {escl. IVA} SST {escl. SST} KDV {escl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. IVA} TAX {incl. imposte} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"In alternativa a {alternativePrice}",strikethroughAriaLabel:"Regolarmente a {strikethroughPrice}"},{lang:"ja",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u6BCE\u6708} YEAR {\u6BCE\u5E74} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u30E9\u30A4\u30BB\u30F3\u30B9\u3054\u3068} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u30E9\u30A4\u30BB\u30F3\u30B9\u3054\u3068} other {}}",freeLabel:"\u7121\u6599",freeAriaLabel:"\u7121\u6599",taxExclusiveLabel:"{taxTerm, select, GST {GST \u5225} VAT {VAT \u5225} TAX {\u7A0E\u5225} IVA {IVA \u5225} SST {SST \u5225} KDV {KDV \u5225} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST \u8FBC} VAT {VAT \u8FBC} TAX {\u7A0E\u8FBC} IVA {IVA \u8FBC} SST {SST \u8FBC} KDV {KDV \u8FBC} other {}}",alternativePriceAriaLabel:"\u7279\u5225\u4FA1\u683C : {alternativePrice}",strikethroughAriaLabel:"\u901A\u5E38\u4FA1\u683C : {strikethroughPrice}"},{lang:"ko",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\uC6D4} YEAR {/\uB144} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\uC6D4\uAC04} YEAR {\uC5F0\uAC04} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\uB77C\uC774\uC120\uC2A4\uB2F9} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\uB77C\uC774\uC120\uC2A4\uB2F9} other {}}",freeLabel:"\uBB34\uB8CC",freeAriaLabel:"\uBB34\uB8CC",taxExclusiveLabel:"{taxTerm, select, GST {GST \uC81C\uC678} VAT {VAT \uC81C\uC678} TAX {\uC138\uAE08 \uC81C\uC678} IVA {IVA \uC81C\uC678} SST {SST \uC81C\uC678} KDV {KDV \uC81C\uC678} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST \uD3EC\uD568} VAT {VAT \uD3EC\uD568} TAX {\uC138\uAE08 \uD3EC\uD568} IVA {IVA \uD3EC\uD568} SST {SST \uD3EC\uD568} KDV {KDV \uD3EC\uD568} other {}}",alternativePriceAriaLabel:"\uB610\uB294 {alternativePrice}\uC5D0",strikethroughAriaLabel:"\uB610\uB294 {alternativePrice}\uC5D0"},{lang:"lt",recurrenceLabel:"{recurrenceTerm, select, MONTH { per m\u0117n.} YEAR { per metus} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per m\u0117n.} YEAR {per metus} other {}}",perUnitLabel:"{perUnit, select, LICENSE {u\u017E licencij\u0105} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {u\u017E licencij\u0105} other {}}",freeLabel:"Nemokamai",freeAriaLabel:"Nemokamai",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Arba u\u017E {alternativePrice}",strikethroughAriaLabel:"Normaliai u\u017E {strikethroughPrice}"},{lang:"lv",recurrenceLabel:"{recurrenceTerm, select, MONTH {m\u0113nes\u012B} YEAR {gad\u0101} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {m\u0113nes\u012B} YEAR {gad\u0101} other {}}",perUnitLabel:"{perUnit, select, LICENSE {vienai licencei} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {vienai licencei} other {}}",freeLabel:"Bezmaksas",freeAriaLabel:"Bezmaksas",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternat\u012Bvi par {alternativePrice}",strikethroughAriaLabel:"Regul\u0101ri par {strikethroughPrice}"},{lang:"nb",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mnd.} YEAR {/\xE5r} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per m\xE5ned} YEAR {per \xE5r} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per lisens} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per lisens} other {}}",freeLabel:"Fri",freeAriaLabel:"Fri",taxExclusiveLabel:"{taxTerm, select, GST {ekskl. GST} VAT {ekskl. moms} TAX {ekskl. avgift} IVA {ekskl. IVA} SST {ekskl. SST} KDV {ekskl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. avgift} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativt til {alternativePrice}",strikethroughAriaLabel:"Regelmessig til {strikethroughPrice}"},{lang:"nl",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mnd} YEAR {/jr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per maand} YEAR {per jaar} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per licentie} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per licentie} other {}}",freeLabel:"Gratis",freeAriaLabel:"Gratis",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. btw} TAX {excl. belasting} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. btw} TAX {incl. belasting} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Nu {alternativePrice}",strikethroughAriaLabel:"Normaal {strikethroughPrice}"},{lang:"pl",recurrenceLabel:"{recurrenceTerm, select, MONTH { / mies.} YEAR { / rok} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH { / miesi\u0105c} YEAR { / rok} other {}}",perUnitLabel:"{perUnit, select, LICENSE {za licencj\u0119} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {za licencj\u0119} other {}}",freeLabel:"Bezp\u0142atne",freeAriaLabel:"Bezp\u0142atne",taxExclusiveLabel:"{taxTerm, select, GST {bez GST} VAT {bez VAT} TAX {netto} IVA {bez IVA} SST {bez SST} KDV {bez KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {z GST} VAT {z VAT} TAX {brutto} IVA {z IVA} SST {z SST} KDV {z KDV} other {}}",alternativePriceAriaLabel:"Lub za {alternativePrice}",strikethroughAriaLabel:"Cena zwyk\u0142a: {strikethroughPrice}"},{lang:"pt",recurrenceLabel:"{recurrenceTerm, select, MONTH {/m\xEAs} YEAR {/ano} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {por m\xEAs} YEAR {por ano} other {}}",perUnitLabel:"{perUnit, select, LICENSE {por licen\xE7a} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {por licen\xE7a} other {}}",freeLabel:"Gratuito",freeAriaLabel:"Gratuito",taxExclusiveLabel:"{taxTerm, select, GST {ICMS n\xE3o incluso} VAT {IVA n\xE3o incluso} TAX {impostos n\xE3o inclusos} IVA {IVA n\xE3o incluso} SST { SST n\xE3o incluso} KDV {KDV n\xE3o incluso} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {ICMS incluso} VAT {IVA incluso} TAX {impostos inclusos} IVA {IVA incluso} SST {SST incluso} KDV {KDV incluso} other {}}",alternativePriceAriaLabel:"Ou a {alternativePrice}",strikethroughAriaLabel:"Pre\xE7o normal: {strikethroughPrice}"},{lang:"ro",recurrenceLabel:"{recurrenceTerm, select, MONTH {/lun\u0103} YEAR {/an} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {pe lun\u0103} YEAR {pe an} other {}}",perUnitLabel:"{perUnit, select, LICENSE {pe licen\u021B\u0103} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {pe licen\u021B\u0103} other {}}",freeLabel:"Gratuit",freeAriaLabel:"Gratuit",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternativ, la {alternativePrice}",strikethroughAriaLabel:"\xCEn mod normal, la {strikethroughPrice}"},{lang:"ru",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u043C\u0435\u0441.} YEAR {/\u0433.} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u0432 \u043C\u0435\u0441\u044F\u0446} YEAR {\u0432 \u0433\u043E\u0434} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u044E} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u044E} other {}}",freeLabel:"\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E",freeAriaLabel:"\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E",taxExclusiveLabel:"{taxTerm, select, GST {\u0438\u0441\u043A\u043B. \u043D\u0430\u043B\u043E\u0433 \u043D\u0430 \u0442\u043E\u0432\u0430\u0440\u044B \u0438 \u0443\u0441\u043B\u0443\u0433\u0438} VAT {\u0438\u0441\u043A\u043B. \u041D\u0414\u0421} TAX {\u0438\u0441\u043A\u043B. \u043D\u0430\u043B\u043E\u0433} IVA {\u0438\u0441\u043A\u043B. \u0418\u0412\u0410} SST {\u0438\u0441\u043A\u043B. SST} KDV {\u0438\u0441\u043A\u043B. \u041A\u0414\u0412} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u0432\u043A\u043B. \u043D\u0430\u043B\u043E\u0433 \u043D\u0430 \u0442\u043E\u0432\u0430\u0440\u044B \u0438 \u0443\u0441\u043B\u0443\u0433\u0438} VAT {\u0432\u043A\u043B. \u041D\u0414\u0421} TAX {\u0432\u043A\u043B. \u043D\u0430\u043B\u043E\u0433} IVA {\u0432\u043A\u043B. \u0418\u0412\u0410} SST {\u0432\u043A\u043B. SST} KDV {\u0432\u043A\u043B. \u041A\u0414\u0412} other {}}",alternativePriceAriaLabel:"\u0410\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442 \u0437\u0430 {alternativePrice}",strikethroughAriaLabel:"\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E \u043F\u043E \u0446\u0435\u043D\u0435 {strikethroughPrice}"},{lang:"sk",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mesiac} YEAR {/rok} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {za mesiac} YEAR {za rok} other {}}",perUnitLabel:"{perUnit, select, LICENSE {za licenciu} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {za licenciu} other {}}",freeLabel:"Zadarmo",freeAriaLabel:"Zadarmo",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Pr\xEDpadne za {alternativePrice}",strikethroughAriaLabel:"Pravidelne za {strikethroughPrice}"},{lang:"sl",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mesec} YEAR {/leto} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {na mesec} YEAR {na leto} other {}}",perUnitLabel:"{perUnit, select, LICENSE {na licenco} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {na licenco} other {}}",freeLabel:"Brezpla\u010Dno",freeAriaLabel:"Brezpla\u010Dno",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Druga mo\u017Enost je: {alternativePrice}",strikethroughAriaLabel:"Redno po {strikethroughPrice}"},{lang:"sv",recurrenceLabel:"{recurrenceTerm, select, MONTH {/m\xE5n} YEAR {/\xE5r} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per m\xE5nad} YEAR {per \xE5r} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per licens} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per licens} other {}}",freeLabel:"Kostnadsfritt",freeAriaLabel:"Kostnadsfritt",taxExclusiveLabel:"{taxTerm, select, GST {exkl. GST} VAT {exkl. moms} TAX {exkl. skatt} IVA {exkl. IVA} SST {exkl. SST} KDV {exkl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. skatt} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativt f\xF6r {alternativePrice}",strikethroughAriaLabel:"Normalpris {strikethroughPrice}"},{lang:"tr",recurrenceLabel:"{recurrenceTerm, select, MONTH {/ay} YEAR {/y\u0131l} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {(ayl\u0131k)} YEAR {(y\u0131ll\u0131k)} other {}}",perUnitLabel:"{perUnit, select, LICENSE {(lisans ba\u015F\u0131na)} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {(lisans ba\u015F\u0131na)} other {}}",freeLabel:"\xDCcretsiz",freeAriaLabel:"\xDCcretsiz",taxExclusiveLabel:"{taxTerm, select, GST {GST hari\xE7} VAT {KDV hari\xE7} TAX {vergi hari\xE7} IVA {IVA hari\xE7} SST {SST hari\xE7} KDV {KDV hari\xE7} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST dahil} VAT {KDV dahil} TAX {vergi dahil} IVA {IVA dahil} SST {SST dahil} KDV {KDV dahil} other {}}",alternativePriceAriaLabel:"Ya da {alternativePrice}",strikethroughAriaLabel:"Standart fiyat: {strikethroughPrice}"},{lang:"uk",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u043C\u0456\u0441.} YEAR {/\u0440\u0456\u043A} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u043D\u0430 \u043C\u0456\u0441\u044F\u0446\u044C} YEAR {\u043D\u0430 \u0440\u0456\u043A} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0456\u0446\u0435\u043D\u0437\u0456\u044E} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0456\u0446\u0435\u043D\u0437\u0456\u044E} other {}}",freeLabel:"\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u043E",freeAriaLabel:"\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u043E",taxExclusiveLabel:"{taxTerm, select, GST {\u0431\u0435\u0437 GST} VAT {\u0431\u0435\u0437 \u041F\u0414\u0412} TAX {\u0431\u0435\u0437 \u043F\u043E\u0434\u0430\u0442\u043A\u0443} IVA {\u0431\u0435\u0437 IVA} SST {\u0431\u0435\u0437 SST} KDV {\u0431\u0435\u0437 KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 GST} VAT {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 \u041F\u0414\u0412} TAX {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 \u043F\u043E\u0434\u0430\u0442\u043A\u043E\u043C} IVA {\u0440\u0430\u0437\u043E\u043C \u0437 IVA} SST {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 SST} KDV {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 KDV} other {}}",alternativePriceAriaLabel:"\u0410\u0431\u043E \u0437\u0430 {alternativePrice}",strikethroughAriaLabel:"\u0417\u0432\u0438\u0447\u0430\u0439\u043D\u0430 \u0446\u0456\u043D\u0430 {strikethroughPrice}"},{lang:"zh-hans",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u6BCF\u6708} YEAR {\u6BCF\u5E74} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u6BCF\u4E2A\u8BB8\u53EF\u8BC1} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u6BCF\u4E2A\u8BB8\u53EF\u8BC1} other {}}",freeLabel:"\u514D\u8D39",freeAriaLabel:"\u514D\u8D39",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u6216\u5B9A\u4EF7 {alternativePrice}",strikethroughAriaLabel:"\u6B63\u5E38\u4EF7 {strikethroughPrice}"},{lang:"zh-hant",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u6BCF\u6708} YEAR {\u6BCF\u5E74} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u6BCF\u500B\u6388\u6B0A} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u6BCF\u500B\u6388\u6B0A} other {}}",freeLabel:"\u514D\u8CBB",freeAriaLabel:"\u514D\u8CBB",taxExclusiveLabel:"{taxTerm, select, GST {\u4E0D\u542B GST} VAT {\u4E0D\u542B VAT} TAX {\u4E0D\u542B\u7A05} IVA {\u4E0D\u542B IVA} SST {\u4E0D\u542B SST} KDV {\u4E0D\u542B KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u542B GST} VAT {\u542B VAT} TAX {\u542B\u7A05} IVA {\u542B IVA} SST {\u542B SST} KDV {\u542B KDV} other {}}",alternativePriceAriaLabel:"\u6216\u8005\u5728 {alternativePrice}",strikethroughAriaLabel:"\u6A19\u6E96\u50F9\u683C\u70BA {strikethroughPrice}"},{lang:"es",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mes} YEAR {/a\xF1o} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {al mes} YEAR {al a\xF1o} other {}}",perUnitLabel:"{perUnit, select, LICENSE {por licencia} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {por licencia} other {}}",freeLabel:"Gratuito",freeAriaLabel:"Gratuito",taxExclusiveLabel:"{taxTerm, select, GST {GST no incluido} VAT {IVA no incluido} TAX {Impuestos no incluidos} IVA {IVA no incluido} SST {SST no incluido} KDV {KDV no incluido} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST incluido} VAT {IVA incluido} TAX {Impuestos incluidos} IVA {IVA incluido} SST {SST incluido} KDV {KDV incluido} other {}}",alternativePriceAriaLabel:"Alternativamente por {alternativePrice}",strikethroughAriaLabel:"Normalmente a {strikethroughPrice}"},{lang:"in",recurrenceLabel:"{recurrenceTerm, select, MONTH {/bulan} YEAR {/tahun} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per bulan} YEAR {per tahun} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per lisensi} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per lisensi} other {}}",freeLabel:"Gratis",freeAriaLabel:"Gratis",taxExclusiveLabel:"{taxTerm, select, GST {tidak termasuk PBJ} VAT {tidak termasuk PPN} TAX {tidak termasuk pajak} IVA {tidak termasuk IVA} SST {tidak termasuk SST} KDV {tidak termasuk KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {termasuk PBJ} VAT {termasuk PPN} TAX {termasuk pajak} IVA {termasuk IVA} SST {termasuk SST} KDV {termasuk KDV} other {}}",alternativePriceAriaLabel:"Atau seharga {alternativePrice}",strikethroughAriaLabel:"Normalnya seharga {strikethroughPrice}"},{lang:"vi",recurrenceLabel:"{recurrenceTerm, select, MONTH {/th\xE1ng} YEAR {/n\u0103m} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {m\u1ED7i th\xE1ng} YEAR {m\u1ED7i n\u0103m} other {}}",perUnitLabel:"{perUnit, select, LICENSE {m\u1ED7i gi\u1EA5y ph\xE9p} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {m\u1ED7i gi\u1EA5y ph\xE9p} other {}}",freeLabel:"Mi\u1EC5n ph\xED",freeAriaLabel:"Mi\u1EC5n ph\xED",taxExclusiveLabel:"{taxTerm, select, GST {ch\u01B0a bao g\u1ED3m thu\u1EBF h\xE0ng h\xF3a v\xE0 d\u1ECBch v\u1EE5} VAT {ch\u01B0a bao g\u1ED3m thu\u1EBF GTGT} TAX {ch\u01B0a bao g\u1ED3m thu\u1EBF} IVA {ch\u01B0a bao g\u1ED3m IVA} SST {ch\u01B0a bao g\u1ED3m SST} KDV {ch\u01B0a bao g\u1ED3m KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {(\u0111\xE3 bao g\u1ED3m thu\u1EBF h\xE0ng h\xF3a v\xE0 d\u1ECBch v\u1EE5)} VAT {(\u0111\xE3 bao g\u1ED3m thu\u1EBF GTGT)} TAX {(\u0111\xE3 bao g\u1ED3m thu\u1EBF)} IVA {(\u0111\xE3 bao g\u1ED3m IVA)} SST {(\u0111\xE3 bao g\u1ED3m SST)} KDV {(\u0111\xE3 bao g\u1ED3m KDV)} other {}}",alternativePriceAriaLabel:"Gi\xE1 \u01B0u \u0111\xE3i {alternativePrice}",strikethroughAriaLabel:"Gi\xE1 th\xF4ng th\u01B0\u1EDDng {strikethroughPrice}"},{lang:"th",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u0E40\u0E14\u0E37\u0E2D\u0E19} YEAR {/\u0E1B\u0E35} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u0E15\u0E48\u0E2D\u0E40\u0E14\u0E37\u0E2D\u0E19} YEAR {\u0E15\u0E48\u0E2D\u0E1B\u0E35} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0E15\u0E48\u0E2D\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0E15\u0E48\u0E2D\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19} other {}}",freeLabel:"\u0E1F\u0E23\u0E35",freeAriaLabel:"\u0E1F\u0E23\u0E35",taxExclusiveLabel:"{taxTerm, select, GST {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35 GST} VAT {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 VAT} TAX {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35} IVA {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 IVA} SST {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 SST} KDV {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35 GST} VAT {\u0E23\u0E27\u0E21 VAT} TAX {\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35} IVA {\u0E23\u0E27\u0E21 IVA} SST {\u0E23\u0E27\u0E21 SST} KDV {\u0E23\u0E27\u0E21 KDV} other {}}",alternativePriceAriaLabel:"\u0E23\u0E32\u0E04\u0E32\u0E1E\u0E34\u0E40\u0E28\u0E29 {alternativePrice}",strikethroughAriaLabel:"\u0E23\u0E32\u0E04\u0E32\u0E1B\u0E01\u0E15\u0E34 {strikethroughPrice}"},{lang:"el",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u03BC\u03AE\u03BD\u03B1} YEAR {/\u03AD\u03C4\u03BF\u03C2} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u03BA\u03AC\u03B8\u03B5 \u03BC\u03AE\u03BD\u03B1} YEAR {\u03B1\u03BD\u03AC \u03AD\u03C4\u03BF\u03C2} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u03B1\u03BD\u03AC \u03AC\u03B4\u03B5\u03B9\u03B1 \u03C7\u03C1\u03AE\u03C3\u03B7\u03C2} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u03B1\u03BD\u03AC \u03AC\u03B4\u03B5\u03B9\u03B1 \u03C7\u03C1\u03AE\u03C3\u03B7\u03C2} other {}}",freeLabel:"\u0394\u03C9\u03C1\u03B5\u03AC\u03BD",freeAriaLabel:"\u0394\u03C9\u03C1\u03B5\u03AC\u03BD",taxExclusiveLabel:"{taxTerm, select, GST {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 GST)} VAT {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03A6\u03A0\u0391)} TAX {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C6\u03CC\u03C1\u03BF)} IVA {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 IVA)} SST {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 SST)} KDV {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 KDV)} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 GST)} VAT {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03A6\u03A0\u0391)} TAX {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 \u03C6\u03CC\u03C1\u03BF\u03C5)} IVA {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 IVA)} SST {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 SST)} KDV {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 KDV)} other {}}",alternativePriceAriaLabel:"\u0394\u03B9\u03B1\u03C6\u03BF\u03C1\u03B5\u03C4\u03B9\u03BA\u03AC, {alternativePrice}",strikethroughAriaLabel:"\u039A\u03B1\u03BD\u03BF\u03BD\u03B9\u03BA\u03AE \u03C4\u03B9\u03BC\u03AE {strikethroughPrice}"},{lang:"fil",recurrenceLabel:"{recurrenceTerm, select, MONTH {/buwan} YEAR {/taon} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per buwan} YEAR {per taon} other {}}",perUnitLabel:"{perUnit, select, LICENSE {kada lisensya} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {kada lisensya} other {}}",freeLabel:"Libre",freeAriaLabel:"Libre",taxExclusiveLabel:"{taxTerm, select, GST {hindi kasama ang GST} VAT {hindi kasama ang VAT} TAX {hindi kasama ang Buwis} IVA {hindi kasama ang IVA} SST {hindi kasama ang SST} KDV {hindi kasama ang KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {kasama ang GST} VAT {kasama ang VAT} TAX {kasama ang Buwis} IVA {kasama ang IVA} SST {kasama ang SST} KDV {kasama ang KDV} other {}}",alternativePriceAriaLabel:"Alternatibong nasa halagang {alternativePrice}",strikethroughAriaLabel:"Regular na nasa halagang {strikethroughPrice}"},{lang:"ms",recurrenceLabel:"{recurrenceTerm, select, MONTH {/bulan} YEAR {/tahun} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per bulan} YEAR {per tahun} other {}}",perUnitLabel:"{perUnit, select, LICENSE {setiap lesen} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {setiap lesen} other {}}",freeLabel:"Percuma",freeAriaLabel:"Percuma",taxExclusiveLabel:"{taxTerm, select, GST {kecuali GST} VAT {kecuali VAT} TAX {kecuali Cukai} IVA {kecuali IVA} SST {kecuali SST} KDV {kecuali KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {termasuk GST} VAT {termasuk VAT} TAX {termasuk Cukai} IVA {termasuk IVA} SST {termasuk SST} KDV {termasuk KDV} other {}}",alternativePriceAriaLabel:"Secara alternatif pada {alternativePrice}",strikethroughAriaLabel:"Biasanya pada {strikethroughPrice}"},{lang:"hi",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u092E\u093E\u0939} YEAR {/\u0935\u0930\u094D\u0937} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per \u092E\u093E\u0939} YEAR {per \u0935\u0930\u094D\u0937} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u092A\u094D\u0930\u0924\u093F \u0932\u093E\u0907\u0938\u0947\u0902\u0938} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u092A\u094D\u0930\u0924\u093F \u0932\u093E\u0907\u0938\u0947\u0902\u0938} other {}}",freeLabel:"\u092B\u093C\u094D\u0930\u0940",freeAriaLabel:"\u092B\u093C\u094D\u0930\u0940",taxExclusiveLabel:"{taxTerm, select, GST {GST \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} VAT {VAT \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} TAX {\u0915\u0930 \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} IVA {IVA \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} SST {SST \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} KDV {KDV \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST \u0938\u0939\u093F\u0924} VAT {VAT \u0938\u0939\u093F\u0924} TAX {\u0915\u0930 \u0938\u0939\u093F\u0924} IVA {IVA \u0938\u0939\u093F\u0924} SST {SST \u0938\u0939\u093F\u0924} KDV {KDV \u0938\u0939\u093F\u0924} other {}}",alternativePriceAriaLabel:"\u0935\u0948\u0915\u0932\u094D\u092A\u093F\u0915 \u0930\u0942\u092A \u0938\u0947 \u0907\u0938 \u092A\u0930 {alternativePrice}",strikethroughAriaLabel:"\u0928\u093F\u092F\u092E\u093F\u0924 \u0930\u0942\u092A \u0938\u0947 \u0907\u0938 \u092A\u0930 {strikethroughPrice}"},{lang:"iw",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u05D7\u05D5\u05D3\u05E9} YEAR {/\u05E9\u05E0\u05D4} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u05DC\u05D7\u05D5\u05D3\u05E9} YEAR {\u05DC\u05E9\u05E0\u05D4} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",freeLabel:"\u05D7\u05D9\u05E0\u05DD",freeAriaLabel:"\u05D7\u05D9\u05E0\u05DD",taxExclusiveLabel:'{taxTerm, select, GST {\u05DC\u05DC\u05D0 GST} VAT {\u05DC\u05DC\u05D0 \u05DE\u05E2"\u05DE} TAX {\u05DC\u05DC\u05D0 \u05DE\u05E1} IVA {\u05DC\u05DC\u05D0 IVA} SST {\u05DC\u05DC\u05D0 SST} KDV {\u05DC\u05DC\u05D0 KDV} other {}}',taxInclusiveLabel:'{taxTerm, select, GST {\u05DB\u05D5\u05DC\u05DC GST} VAT {\u05DB\u05D5\u05DC\u05DC \u05DE\u05E2"\u05DE} TAX {\u05DB\u05D5\u05DC\u05DC \u05DE\u05E1} IVA {\u05DB\u05D5\u05DC\u05DC IVA} SST {\u05DB\u05D5\u05DC\u05DC SST} KDV {\u05DB\u05D5\u05DC\u05DC KDV} other {}}',alternativePriceAriaLabel:"\u05DC\u05D7\u05DC\u05D5\u05E4\u05D9\u05DF \u05D1-{alternativePrice}",strikethroughAriaLabel:"\u05D1\u05D0\u05D5\u05E4\u05DF \u05E7\u05D1\u05D5\u05E2 \u05D1-{strikethroughPrice}"}],":type":"sheet"}});var xt;(function(e){e.STAGE="STAGE",e.PRODUCTION="PRODUCTION",e.LOCAL="LOCAL"})(xt||(xt={}));var Ur;(function(e){e.STAGE="STAGE",e.PRODUCTION="PROD",e.LOCAL="LOCAL"})(Ur||(Ur={}));var vt;(function(e){e.DRAFT="DRAFT",e.PUBLISHED="PUBLISHED"})(vt||(vt={}));var Te;(function(e){e.V2="UCv2",e.V3="UCv3"})(Te||(Te={}));var q;(function(e){e.CHECKOUT="checkout",e.CHECKOUT_EMAIL="checkout/email",e.SEGMENTATION="segmentation",e.BUNDLE="bundle",e.COMMITMENT="commitment",e.RECOMMENDATION="recommendation",e.EMAIL="email",e.PAYMENT="payment",e.CHANGE_PLAN_TEAM_PLANS="change-plan/team-upgrade/plans",e.CHANGE_PLAN_TEAM_PAYMENT="change-plan/team-upgrade/payment"})(q||(q={}));var Dr=function(e){var t;return(t=Ss.get(e))!==null&&t!==void 0?t:e},Ss=new Map([["countrySpecific","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["offerType","ot"],["marketSegment","ms"]]);var $i=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},Mi=function(e,t){var r=typeof Symbol=="function"&&e[Symbol.iterator];if(!r)return e;var n=r.call(e),i,o=[],a;try{for(;(t===void 0||t-- >0)&&!(i=n.next()).done;)o.push(i.value)}catch(s){a={error:s}}finally{try{i&&!i.done&&(r=n.return)&&r.call(n)}finally{if(a)throw a.error}}return o};function Fe(e,t,r){var n,i;try{for(var o=$i(Object.entries(e)),a=o.next();!a.done;a=o.next()){var s=Mi(a.value,2),c=s[0],l=s[1],h=Dr(c);l!=null&&r.has(h)&&t.set(h,l)}}catch(d){n={error:d}}finally{try{a&&!a.done&&(i=o.return)&&i.call(o)}finally{if(n)throw n.error}}}function Xt(e){switch(e){case xt.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function Wt(e,t){var r,n;for(var i in e){var o=e[i];try{for(var a=(r=void 0,$i(Object.entries(o))),s=a.next();!s.done;s=a.next()){var c=Mi(s.value,2),l=c[0],h=c[1];if(h!=null){var d=Dr(l);t.set("items["+i+"]["+d+"]",h)}}}catch(u){r={error:u}}finally{try{s&&!s.done&&(n=a.return)&&n.call(a)}finally{if(r)throw r.error}}}}var ys=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,n=Object.getOwnPropertySymbols(e);i<n.length;i++)t.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(e,n[i])&&(r[n[i]]=e[n[i]]);return r},Ts=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};function Ui(e){ws(e);var t=e.env,r=e.items,n=e.workflowStep,i=ys(e,["env","items","workflowStep"]),o=new URL(Xt(t));return o.pathname=n+"/",Wt(r,o.searchParams),Fe(i,o.searchParams,Ls),o.toString()}var Ls=new Set(["cli","co","lang","ctx","cUrl","mv","nglwfdata","otac","promoid","rUrl","sdid","spint","trackingid","code","campaignid","appctxid"]),_s=["env","workflowStep","clientId","country","items"];function ws(e){var t,r;try{for(var n=Ts(_s),i=n.next();!i.done;i=n.next()){var o=i.value;if(!e[o])throw new Error('Argument "checkoutData" is not valid, missing: '+o)}}catch(a){t={error:a}}finally{try{i&&!i.done&&(r=n.return)&&r.call(n)}finally{if(t)throw t.error}}return!0}var Ps=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,n=Object.getOwnPropertySymbols(e);i<n.length;i++)t.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(e,n[i])&&(r[n[i]]=e[n[i]]);return r},Cs=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},Ns="p_draft_landscape",Is="/store/";function Hr(e){Os(e);var t=e.env,r=e.items,n=e.workflowStep,i=e.ms,o=e.marketSegment,a=e.ot,s=e.offerType,c=e.pa,l=e.productArrangementCode,h=e.landscape,d=Ps(e,["env","items","workflowStep","ms","marketSegment","ot","offerType","pa","productArrangementCode","landscape"]),u={marketSegment:o??i,offerType:s??a,productArrangementCode:l??c},m=new URL(Xt(t));return m.pathname=""+Is+n,n!==q.SEGMENTATION&&n!==q.CHANGE_PLAN_TEAM_PLANS&&Wt(r,m.searchParams),n===q.SEGMENTATION&&Fe(u,m.searchParams,Gr),Fe(d,m.searchParams,Gr),h===vt.DRAFT&&Fe({af:Ns},m.searchParams,Gr),m.toString()}var Gr=new Set(["af","ai","apc","appctxid","cli","co","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),ks=["env","workflowStep","clientId","country"];function Os(e){var t,r;try{for(var n=Cs(ks),i=n.next();!i.done;i=n.next()){var o=i.value;if(!e[o])throw new Error('Argument "checkoutData" is not valid, missing: '+o)}}catch(a){t={error:a}}finally{try{i&&!i.done&&(r=n.return)&&r.call(n)}finally{if(t)throw t.error}}if(e.workflowStep!==q.SEGMENTATION&&e.workflowStep!==q.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}function zr(e,t){switch(e){case Te.V2:return Ui(t);case Te.V3:return Hr(t);default:return console.warn("Unsupported CheckoutType, will use UCv3 as default. Given type: "+e),Hr(t)}}var Fr;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(Fr||(Fr={}));var $;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})($||($={}));var k;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(k||(k={}));var Kr;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(Kr||(Kr={}));var Br;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(Br||(Br={}));var jr;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(jr||(jr={}));var Yr;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(Yr||(Yr={}));var Di="tacocat.js";var qt=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),Gi=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function O(e,t={},{metadata:r=!0,search:n=!0,storage:i=!0}={}){let o;if(n&&o==null){let a=new URLSearchParams(window.location.search),s=Ke(n)?n:e;o=a.get(s)}if(i&&o==null){let a=Ke(i)?i:e;o=window.sessionStorage.getItem(a)??window.localStorage.getItem(a)}if(r&&o==null){let a=Rs(Ke(r)?r:e);o=document.documentElement.querySelector(`meta[name="${a}"]`)?.content}return o??t[e]}var Be=()=>{};var Hi=e=>typeof e=="boolean",bt=e=>typeof e=="function",Zt=e=>typeof e=="number",zi=e=>e!=null&&typeof e=="object";var Ke=e=>typeof e=="string",Xr=e=>Ke(e)&&e,je=e=>Zt(e)&&Number.isFinite(e)&&e>0;function Ye(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,n])=>{t(n)&&delete e[r]}),e}function E(e,t){if(Hi(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function ge(e,t,r){let n=Object.values(t);return n.find(i=>qt(i,e))??r??n[0]}function Rs(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,n)=>`${r}-${n}`).replace(/\W+/gu,"-").toLowerCase()}function Xe(e,t=1){return Zt(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var Vs=Date.now(),Wr=()=>`(+${Date.now()-Vs}ms)`,Jt=new Set,$s=E(O("tacocat.debug",{},{metadata:!1}),typeof process<"u"&&process.env?.DEBUG);function Fi(e){let t=`[${Di}/${e}]`,r=(a,s,...c)=>a?!0:(i(s,...c),!1),n=$s?(a,...s)=>{console.debug(`${t} ${a}`,...s,Wr())}:()=>{},i=(a,...s)=>{let c=`${t} ${a}`;Jt.forEach(([l])=>l(c,...s))};return{assert:r,debug:n,error:i,warn:(a,...s)=>{let c=`${t} ${a}`;Jt.forEach(([,l])=>l(c,...s))}}}function Ms(e,t){let r=[e,t];return Jt.add(r),()=>{Jt.delete(r)}}Ms((e,...t)=>{console.error(e,...t,Wr())},(e,...t)=>{console.warn(e,...t,Wr())});var Us="no promo",Ki="promo-tag",Ds="yellow",Gs="neutral",Hs=(e,t,r)=>{let n=o=>o||Us,i=r?` (was "${n(t)}")`:"";return`${n(e)}${i}`},zs="cancel-context",At=(e,t)=>{let r=e===zs,n=!r&&e?.length>0,i=(n||r)&&(t&&t!=e||!t&&!r),o=i&&n||!i&&!!t,a=o?e||t:void 0;return{effectivePromoCode:a,overridenPromoCode:e,className:o?Ki:`${Ki} no-promo`,text:Hs(a,t,i),variant:o?Ds:Gs,isOverriden:i}};var qr="ABM",Zr="PUF",Jr="M2M",Qr="PERPETUAL",en="P3Y",Fs="TAX_INCLUSIVE_DETAILS",Ks="TAX_EXCLUSIVE",Bi={ABM:qr,PUF:Zr,M2M:Jr,PERPETUAL:Qr,P3Y:en},_h={[qr]:{commitment:$.YEAR,term:k.MONTHLY},[Zr]:{commitment:$.YEAR,term:k.ANNUAL},[Jr]:{commitment:$.MONTH,term:k.MONTHLY},[Qr]:{commitment:$.PERPETUAL,term:void 0},[en]:{commitment:$.THREE_MONTHS,term:k.P3Y}},ji="Value is not an offer",Qt=e=>{if(typeof e!="object")return ji;let{commitment:t,term:r}=e,n=Bs(t,r);return{...e,planType:n}};var Bs=(e,t)=>{switch(e){case void 0:return ji;case"":return"";case $.YEAR:return t===k.MONTHLY?qr:t===k.ANNUAL?Zr:"";case $.MONTH:return t===k.MONTHLY?Jr:"";case $.PERPETUAL:return Qr;case $.TERM_LICENSE:return t===k.P3Y?en:"";default:return""}};function tn(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:n,priceWithoutTax:i,priceWithoutDiscountAndTax:o,taxDisplay:a}=t;if(a!==Fs)return e;let s={...e,priceDetails:{...t,price:i??r,priceWithoutDiscount:o??n,taxDisplay:Ks}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var rn=function(e,t){return rn=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(r[i]=n[i])},rn(e,t)};function Et(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");rn(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var S=function(){return S=Object.assign||function(t){for(var r,n=1,i=arguments.length;n<i;n++){r=arguments[n];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o])}return t},S.apply(this,arguments)};function er(e,t,r){if(r||arguments.length===2)for(var n=0,i=t.length,o;n<i;n++)(o||!(n in t))&&(o||(o=Array.prototype.slice.call(t,0,n)),o[n]=t[n]);return e.concat(o||Array.prototype.slice.call(t))}var v;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(v||(v={}));var C;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(C||(C={}));var Le;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(Le||(Le={}));function nn(e){return e.type===C.literal}function Yi(e){return e.type===C.argument}function tr(e){return e.type===C.number}function rr(e){return e.type===C.date}function nr(e){return e.type===C.time}function ir(e){return e.type===C.select}function or(e){return e.type===C.plural}function Xi(e){return e.type===C.pound}function ar(e){return e.type===C.tag}function sr(e){return!!(e&&typeof e=="object"&&e.type===Le.number)}function St(e){return!!(e&&typeof e=="object"&&e.type===Le.dateTime)}var on=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var js=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function Wi(e){var t={};return e.replace(js,function(r){var n=r.length;switch(r[0]){case"G":t.era=n===4?"long":n===5?"narrow":"short";break;case"y":t.year=n===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][n-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][n-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=n===4?"short":n===5?"narrow":"short";break;case"e":if(n<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"c":if(n<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][n-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][n-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][n-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][n-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][n-1];break;case"s":t.second=["numeric","2-digit"][n-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=n<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var qi=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function eo(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(qi).filter(function(u){return u.length>0}),r=[],n=0,i=t;n<i.length;n++){var o=i[n],a=o.split("/");if(a.length===0)throw new Error("Invalid number skeleton");for(var s=a[0],c=a.slice(1),l=0,h=c;l<h.length;l++){var d=h[l];if(d.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:c})}return r}function Ys(e){return e.replace(/^(.*?)-/,"")}var Zi=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,to=/^(@+)?(\+|#+)?$/g,Xs=/(\*)(0+)|(#+)(0+)|(0+)/g,ro=/^(0+)$/;function Ji(e){var t={};return e.replace(to,function(r,n,i){return typeof i!="string"?(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length):i==="+"?t.minimumSignificantDigits=n.length:n[0]==="#"?t.maximumSignificantDigits=n.length:(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length+(typeof i=="string"?i.length:0)),""}),t}function no(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function Ws(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!ro.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function Qi(e){var t={},r=no(e);return r||t}function io(e){for(var t={},r=0,n=e;r<n.length;r++){var i=n[r];switch(i.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=i.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=Ys(i.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=S(S(S({},t),{notation:"scientific"}),i.options.reduce(function(s,c){return S(S({},s),Qi(c))},{}));continue;case"engineering":t=S(S(S({},t),{notation:"engineering"}),i.options.reduce(function(s,c){return S(S({},s),Qi(c))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(i.options[0]);continue;case"integer-width":if(i.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");i.options[0].replace(Xs,function(s,c,l,h,d,u){if(c)t.minimumIntegerDigits=l.length;else{if(h&&d)throw new Error("We currently do not support maximum integer digits");if(u)throw new Error("We currently do not support exact integer digits")}return""});continue}if(ro.test(i.stem)){t.minimumIntegerDigits=i.stem.length;continue}if(Zi.test(i.stem)){if(i.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");i.stem.replace(Zi,function(s,c,l,h,d,u){return l==="*"?t.minimumFractionDigits=c.length:h&&h[0]==="#"?t.maximumFractionDigits=h.length:d&&u?(t.minimumFractionDigits=d.length,t.maximumFractionDigits=d.length+u.length):(t.minimumFractionDigits=c.length,t.maximumFractionDigits=c.length),""}),i.options.length&&(t=S(S({},t),Ji(i.options[0])));continue}if(to.test(i.stem)){t=S(S({},t),Ji(i.stem));continue}var o=no(i.stem);o&&(t=S(S({},t),o));var a=Ws(i.stem);a&&(t=S(S({},t),a))}return t}var an,qs=new RegExp("^"+on.source+"*"),Zs=new RegExp(on.source+"*$");function b(e,t){return{start:e,end:t}}var Js=!!String.prototype.startsWith,Qs=!!String.fromCodePoint,ec=!!Object.fromEntries,tc=!!String.prototype.codePointAt,rc=!!String.prototype.trimStart,nc=!!String.prototype.trimEnd,ic=!!Number.isSafeInteger,oc=ic?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},cn=!0;try{oo=lo("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),cn=((an=oo.exec("a"))===null||an===void 0?void 0:an[0])==="a"}catch{cn=!1}var oo,ao=Js?function(t,r,n){return t.startsWith(r,n)}:function(t,r,n){return t.slice(n,n+r.length)===r},ln=Qs?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var n="",i=t.length,o=0,a;i>o;){if(a=t[o++],a>1114111)throw RangeError(a+" is not a valid code point");n+=a<65536?String.fromCharCode(a):String.fromCharCode(((a-=65536)>>10)+55296,a%1024+56320)}return n},so=ec?Object.fromEntries:function(t){for(var r={},n=0,i=t;n<i.length;n++){var o=i[n],a=o[0],s=o[1];r[a]=s}return r},co=tc?function(t,r){return t.codePointAt(r)}:function(t,r){var n=t.length;if(!(r<0||r>=n)){var i=t.charCodeAt(r),o;return i<55296||i>56319||r+1===n||(o=t.charCodeAt(r+1))<56320||o>57343?i:(i-55296<<10)+(o-56320)+65536}},ac=rc?function(t){return t.trimStart()}:function(t){return t.replace(qs,"")},sc=nc?function(t){return t.trimEnd()}:function(t){return t.replace(Zs,"")};function lo(e,t){return new RegExp(e,t)}var hn;cn?(sn=lo("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),hn=function(t,r){var n;sn.lastIndex=r;var i=sn.exec(t);return(n=i[1])!==null&&n!==void 0?n:""}):hn=function(t,r){for(var n=[];;){var i=co(t,r);if(i===void 0||uo(i)||hc(i))break;n.push(i),r+=i>=65536?2:1}return ln.apply(void 0,n)};var sn,ho=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,n){for(var i=[];!this.isEOF();){var o=this.char();if(o===123){var a=this.parseArgument(t,n);if(a.err)return a;i.push(a.val)}else{if(o===125&&t>0)break;if(o===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),i.push({type:C.pound,location:b(s,this.clonePosition())})}else if(o===60&&!this.ignoreTag&&this.peek()===47){if(n)break;return this.error(v.UNMATCHED_CLOSING_TAG,b(this.clonePosition(),this.clonePosition()))}else if(o===60&&!this.ignoreTag&&dn(this.peek()||0)){var a=this.parseTag(t,r);if(a.err)return a;i.push(a.val)}else{var a=this.parseLiteral(t,r);if(a.err)return a;i.push(a.val)}}}return{val:i,err:null}},e.prototype.parseTag=function(t,r){var n=this.clonePosition();this.bump();var i=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:C.literal,value:"<"+i+"/>",location:b(n,this.clonePosition())},err:null};if(this.bumpIf(">")){var o=this.parseMessage(t+1,r,!0);if(o.err)return o;var a=o.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!dn(this.char()))return this.error(v.INVALID_TAG,b(s,this.clonePosition()));var c=this.clonePosition(),l=this.parseTagName();return i!==l?this.error(v.UNMATCHED_CLOSING_TAG,b(c,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:C.tag,value:i,children:a,location:b(n,this.clonePosition())},err:null}:this.error(v.INVALID_TAG,b(s,this.clonePosition())))}else return this.error(v.UNCLOSED_TAG,b(n,this.clonePosition()))}else return this.error(v.INVALID_TAG,b(n,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&lc(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var n=this.clonePosition(),i="";;){var o=this.tryParseQuote(r);if(o){i+=o;continue}var a=this.tryParseUnquoted(t,r);if(a){i+=a;continue}var s=this.tryParseLeftAngleBracket();if(s){i+=s;continue}break}var c=b(n,this.clonePosition());return{val:{type:C.literal,value:i,location:c},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!cc(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var n=this.char();if(n===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(n);this.bump()}return ln.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var n=this.char();return n===60||n===123||n===35&&(r==="plural"||r==="selectordinal")||n===125&&t>0?null:(this.bump(),ln(n))},e.prototype.parseArgument=function(t,r){var n=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,b(n,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(v.EMPTY_ARGUMENT,b(n,this.clonePosition()));var i=this.parseIdentifierIfPossible().value;if(!i)return this.error(v.MALFORMED_ARGUMENT,b(n,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,b(n,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:C.argument,value:i,location:b(n,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,b(n,this.clonePosition())):this.parseArgumentOptions(t,r,i,n);default:return this.error(v.MALFORMED_ARGUMENT,b(n,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),n=hn(this.message,r),i=r+n.length;this.bumpTo(i);var o=this.clonePosition(),a=b(t,o);return{value:n,location:a}},e.prototype.parseArgumentOptions=function(t,r,n,i){var o,a=this.clonePosition(),s=this.parseIdentifierIfPossible().value,c=this.clonePosition();switch(s){case"":return this.error(v.EXPECT_ARGUMENT_TYPE,b(a,c));case"number":case"date":case"time":{this.bumpSpace();var l=null;if(this.bumpIf(",")){this.bumpSpace();var h=this.clonePosition(),d=this.parseSimpleArgStyleIfPossible();if(d.err)return d;var u=sc(d.val);if(u.length===0)return this.error(v.EXPECT_ARGUMENT_STYLE,b(this.clonePosition(),this.clonePosition()));var m=b(h,this.clonePosition());l={style:u,styleLocation:m}}var x=this.tryParseArgumentClose(i);if(x.err)return x;var f=b(i,this.clonePosition());if(l&&ao(l?.style,"::",0)){var _=ac(l.style.slice(2));if(s==="number"){var d=this.parseNumberSkeletonFromString(_,l.styleLocation);return d.err?d:{val:{type:C.number,value:n,location:f,style:d.val},err:null}}else{if(_.length===0)return this.error(v.EXPECT_DATE_TIME_SKELETON,f);var u={type:Le.dateTime,pattern:_,location:l.styleLocation,parsedOptions:this.shouldParseSkeletons?Wi(_):{}},N=s==="date"?C.date:C.time;return{val:{type:N,value:n,location:f,style:u},err:null}}}return{val:{type:s==="number"?C.number:s==="date"?C.date:C.time,value:n,location:f,style:(o=l?.style)!==null&&o!==void 0?o:null},err:null}}case"plural":case"selectordinal":case"select":{var A=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(v.EXPECT_SELECT_ARGUMENT_OPTIONS,b(A,S({},A)));this.bumpSpace();var T=this.parseIdentifierIfPossible(),V=0;if(s!=="select"&&T.value==="offset"){if(!this.bumpIf(":"))return this.error(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,b(this.clonePosition(),this.clonePosition()));this.bumpSpace();var d=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,v.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(d.err)return d;this.bumpSpace(),T=this.parseIdentifierIfPossible(),V=d.val}var L=this.tryParsePluralOrSelectOptions(t,s,r,T);if(L.err)return L;var x=this.tryParseArgumentClose(i);if(x.err)return x;var K=b(i,this.clonePosition());return s==="select"?{val:{type:C.select,value:n,options:so(L.val),location:K},err:null}:{val:{type:C.plural,value:n,options:so(L.val),offset:V,pluralType:s==="plural"?"cardinal":"ordinal",location:K},err:null}}default:return this.error(v.INVALID_ARGUMENT_TYPE,b(a,c))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,b(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var n=this.char();switch(n){case 39:{this.bump();var i=this.clonePosition();if(!this.bumpUntil("'"))return this.error(v.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,b(i,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var n=[];try{n=eo(t)}catch{return this.error(v.INVALID_NUMBER_SKELETON,r)}return{val:{type:Le.number,tokens:n,location:r,parsedOptions:this.shouldParseSkeletons?io(n):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,n,i){for(var o,a=!1,s=[],c=new Set,l=i.value,h=i.location;;){if(l.length===0){var d=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var u=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_SELECTOR,v.INVALID_PLURAL_ARGUMENT_SELECTOR);if(u.err)return u;h=b(d,this.clonePosition()),l=this.message.slice(d.offset,this.offset())}else break}if(c.has(l))return this.error(r==="select"?v.DUPLICATE_SELECT_ARGUMENT_SELECTOR:v.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,h);l==="other"&&(a=!0),this.bumpSpace();var m=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:v.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,b(this.clonePosition(),this.clonePosition()));var x=this.parseMessage(t+1,r,n);if(x.err)return x;var f=this.tryParseArgumentClose(m);if(f.err)return f;s.push([l,{value:x.val,location:b(m,this.clonePosition())}]),c.add(l),this.bumpSpace(),o=this.parseIdentifierIfPossible(),l=o.value,h=o.location}return s.length===0?this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR:v.EXPECT_PLURAL_ARGUMENT_SELECTOR,b(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!a?this.error(v.MISSING_OTHER_CLAUSE,b(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var n=1,i=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(n=-1);for(var o=!1,a=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)o=!0,a=a*10+(s-48),this.bump();else break}var c=b(i,this.clonePosition());return o?(a*=n,oc(a)?{val:a,err:null}:this.error(r,c)):this.error(t,c)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=co(this.message,t);if(r===void 0)throw Error("Offset "+t+" is at invalid UTF-16 code unit boundary");return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(ao(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),n=this.message.indexOf(t,r);return n>=0?(this.bumpTo(n),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset "+t+" must be greater than or equal to the current offset "+this.offset());for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset "+t+" is at invalid UTF-16 code unit boundary");if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&uo(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),n=this.message.charCodeAt(r+(t>=65536?2:1));return n??null},e}();function dn(e){return e>=97&&e<=122||e>=65&&e<=90}function cc(e){return dn(e)||e===47}function lc(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function uo(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function hc(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function un(e){e.forEach(function(t){if(delete t.location,ir(t)||or(t))for(var r in t.options)delete t.options[r].location,un(t.options[r].value);else tr(t)&&sr(t.style)||(rr(t)||nr(t))&&St(t.style)?delete t.style.location:ar(t)&&un(t.children)})}function mo(e,t){t===void 0&&(t={}),t=S({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new ho(e,t).parse();if(r.err){var n=SyntaxError(v[r.err.kind]);throw n.location=r.err.location,n.originalMessage=r.err.message,n}return t?.captureLocation||un(r.val),r.val}function yt(e,t){var r=t&&t.cache?t.cache:gc,n=t&&t.serializer?t.serializer:fc,i=t&&t.strategy?t.strategy:uc;return i(e,{cache:r,serializer:n})}function dc(e){return e==null||typeof e=="number"||typeof e=="boolean"}function po(e,t,r,n){var i=dc(n)?n:r(n),o=t.get(i);return typeof o>"u"&&(o=e.call(this,n),t.set(i,o)),o}function fo(e,t,r){var n=Array.prototype.slice.call(arguments,3),i=r(n),o=t.get(i);return typeof o>"u"&&(o=e.apply(this,n),t.set(i,o)),o}function mn(e,t,r,n,i){return r.bind(t,e,n,i)}function uc(e,t){var r=e.length===1?po:fo;return mn(e,this,r,t.cache.create(),t.serializer)}function mc(e,t){return mn(e,this,fo,t.cache.create(),t.serializer)}function pc(e,t){return mn(e,this,po,t.cache.create(),t.serializer)}var fc=function(){return JSON.stringify(arguments)};function pn(){this.cache=Object.create(null)}pn.prototype.get=function(e){return this.cache[e]};pn.prototype.set=function(e,t){this.cache[e]=t};var gc={create:function(){return new pn}},cr={variadic:mc,monadic:pc};var _e;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(_e||(_e={}));var Tt=function(e){Et(t,e);function t(r,n,i){var o=e.call(this,r)||this;return o.code=n,o.originalMessage=i,o}return t.prototype.toString=function(){return"[formatjs Error: "+this.code+"] "+this.message},t}(Error);var fn=function(e){Et(t,e);function t(r,n,i,o){return e.call(this,'Invalid values for "'+r+'": "'+n+'". Options are "'+Object.keys(i).join('", "')+'"',_e.INVALID_VALUE,o)||this}return t}(Tt);var go=function(e){Et(t,e);function t(r,n,i){return e.call(this,'Value for "'+r+'" must be of type '+n,_e.INVALID_VALUE,i)||this}return t}(Tt);var xo=function(e){Et(t,e);function t(r,n){return e.call(this,'The intl string context variable "'+r+'" was not provided to the string "'+n+'"',_e.MISSING_VALUE,n)||this}return t}(Tt);var z;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(z||(z={}));function xc(e){return e.length<2?e:e.reduce(function(t,r){var n=t[t.length-1];return!n||n.type!==z.literal||r.type!==z.literal?t.push(r):n.value+=r.value,t},[])}function vc(e){return typeof e=="function"}function Lt(e,t,r,n,i,o,a){if(e.length===1&&nn(e[0]))return[{type:z.literal,value:e[0].value}];for(var s=[],c=0,l=e;c<l.length;c++){var h=l[c];if(nn(h)){s.push({type:z.literal,value:h.value});continue}if(Xi(h)){typeof o=="number"&&s.push({type:z.literal,value:r.getNumberFormat(t).format(o)});continue}var d=h.value;if(!(i&&d in i))throw new xo(d,a);var u=i[d];if(Yi(h)){(!u||typeof u=="string"||typeof u=="number")&&(u=typeof u=="string"||typeof u=="number"?String(u):""),s.push({type:typeof u=="string"?z.literal:z.object,value:u});continue}if(rr(h)){var m=typeof h.style=="string"?n.date[h.style]:St(h.style)?h.style.parsedOptions:void 0;s.push({type:z.literal,value:r.getDateTimeFormat(t,m).format(u)});continue}if(nr(h)){var m=typeof h.style=="string"?n.time[h.style]:St(h.style)?h.style.parsedOptions:void 0;s.push({type:z.literal,value:r.getDateTimeFormat(t,m).format(u)});continue}if(tr(h)){var m=typeof h.style=="string"?n.number[h.style]:sr(h.style)?h.style.parsedOptions:void 0;m&&m.scale&&(u=u*(m.scale||1)),s.push({type:z.literal,value:r.getNumberFormat(t,m).format(u)});continue}if(ar(h)){var x=h.children,f=h.value,_=i[f];if(!vc(_))throw new go(f,"function",a);var N=Lt(x,t,r,n,i,o),A=_(N.map(function(L){return L.value}));Array.isArray(A)||(A=[A]),s.push.apply(s,A.map(function(L){return{type:typeof L=="string"?z.literal:z.object,value:L}}))}if(ir(h)){var T=h.options[u]||h.options.other;if(!T)throw new fn(h.value,u,Object.keys(h.options),a);s.push.apply(s,Lt(T.value,t,r,n,i));continue}if(or(h)){var T=h.options["="+u];if(!T){if(!Intl.PluralRules)throw new Tt(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,_e.MISSING_INTL_API,a);var V=r.getPluralRules(t,{type:h.pluralType}).select(u-(h.offset||0));T=h.options[V]||h.options.other}if(!T)throw new fn(h.value,u,Object.keys(h.options),a);s.push.apply(s,Lt(T.value,t,r,n,i,u-(h.offset||0)));continue}}return xc(s)}function bc(e,t){return t?S(S(S({},e||{}),t||{}),Object.keys(e).reduce(function(r,n){return r[n]=S(S({},e[n]),t[n]||{}),r},{})):e}function Ac(e,t){return t?Object.keys(e).reduce(function(r,n){return r[n]=bc(e[n],t[n]),r},S({},e)):e}function gn(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function Ec(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:yt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.NumberFormat).bind.apply(t,er([void 0],r)))},{cache:gn(e.number),strategy:cr.variadic}),getDateTimeFormat:yt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.DateTimeFormat).bind.apply(t,er([void 0],r)))},{cache:gn(e.dateTime),strategy:cr.variadic}),getPluralRules:yt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.PluralRules).bind.apply(t,er([void 0],r)))},{cache:gn(e.pluralRules),strategy:cr.variadic})}}var vo=function(){function e(t,r,n,i){var o=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(a){var s=o.formatToParts(a);if(s.length===1)return s[0].value;var c=s.reduce(function(l,h){return!l.length||h.type!==z.literal||typeof l[l.length-1]!="string"?l.push(h.value):l[l.length-1]+=h.value,l},[]);return c.length<=1?c[0]||"":c},this.formatToParts=function(a){return Lt(o.ast,o.locales,o.formatters,o.formats,a,void 0,o.message)},this.resolvedOptions=function(){return{locale:Intl.NumberFormat.supportedLocalesOf(o.locales)[0]}},this.getAst=function(){return o.ast},typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:i?.ignoreTag})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Ac(e.formats,n),this.locales=r,this.formatters=i&&i.formatters||Ec(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.__parse=mo,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var bo=vo;var Sc=/[0-9\-+#]/,yc=/[^\d\-+#]/g;function Ao(e){return e.search(Sc)}function Tc(e="#.##"){let t={},r=e.length,n=Ao(e);t.prefix=n>0?e.substring(0,n):"";let i=Ao(e.split("").reverse().join("")),o=r-i,a=e.substring(o,o+1),s=o+(a==="."||a===","?1:0);t.suffix=i>0?e.substring(s,r):"",t.mask=e.substring(n,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let c=t.mask.match(yc);return t.decimal=c&&c[c.length-1]||".",t.separator=c&&c[1]&&c[0]||",",c=t.mask.split(t.decimal),t.integer=c[0],t.fraction=c[1],t}function Lc(e,t,r){let n=!1,i={value:e};e<0&&(n=!0,i.value=-i.value),i.sign=n?"-":"",i.value=Number(i.value).toFixed(t.fraction&&t.fraction.length),i.value=Number(i.value).toString();let o=t.fraction&&t.fraction.lastIndexOf("0"),[a="0",s=""]=i.value.split(".");return(!s||s&&s.length<=o)&&(s=o<0?"":(+("0."+s)).toFixed(o+1).replace("0.","")),i.integer=a,i.fraction=s,_c(i,t),(i.result==="0"||i.result==="")&&(n=!1,i.sign=""),!n&&t.maskHasPositiveSign?i.sign="+":n&&t.maskHasPositiveSign?i.sign="-":n&&(i.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),i}function _c(e,t){e.result="";let r=t.integer.split(t.separator),n=r.join(""),i=n&&n.indexOf("0");if(i>-1)for(;e.integer.length<n.length-i;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let o=r[1]&&r[r.length-1].length;if(o){let a=e.integer.length,s=a%o;for(let c=0;c<a;c++)e.result+=e.integer.charAt(c),!((c-s+1)%o)&&c<a-o&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function wc(e,t,r={}){if(!e||isNaN(Number(t)))return t;let n=Tc(e),i=Lc(t,n,r);return n.prefix+i.sign+i.result+n.suffix}var Eo=wc;var So=".",Pc=",",To=/^\s+/,Lo=/\s+$/,yo="&nbsp;",_t={MONTH:"MONTH",YEAR:"YEAR"},Cc={[k.ANNUAL]:12,[k.MONTHLY]:1,[k.THREE_YEARS]:36,[k.TWO_YEARS]:24},Nc={CHF:e=>Math.round(e*20)/20},xn=(e,t)=>({accept:e,round:t}),Ic=[xn(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),xn(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.ceil(Math.floor(t*1e4/e)/100)/100),xn(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],vn={[$.YEAR]:{[k.MONTHLY]:_t.MONTH,[k.ANNUAL]:_t.YEAR},[$.MONTH]:{[k.MONTHLY]:_t.MONTH}},kc=(e,t)=>e.indexOf(`'${t}'`)===0,Oc=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),n=wo(r);return!!n?t||(r=r.replace(/[,\.]0+/,n)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+Vc(e)),r},Rc=e=>{let t=$c(e),r=kc(e,t),n=e.replace(/'.*?'/,""),i=To.test(n)||Lo.test(n);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:i}},_o=e=>e.replace(To,yo).replace(Lo,yo),Vc=e=>e.match(/#(.?)#/)?.[1]===So?Pc:So,$c=e=>e.match(/'(.*?)'/)?.[1]??"",wo=e=>e.match(/0(.?)0/)?.[1]??"";function lr({formatString:e,price:t,usePrecision:r,isIndianPrice:n=!1},i,o=a=>a){let{currencySymbol:a,isCurrencyFirst:s,hasCurrencySpace:c}=Rc(e),l=r?wo(e):"",h=Oc(e,r),d=r?2:0,u=o(t,{currencySymbol:a}),m=n?u.toLocaleString("hi-IN",{minimumFractionDigits:d,maximumFractionDigits:d}):Eo(h,u),x=r?m.lastIndexOf(l):m.length,f=m.substring(0,x),_=m.substring(x+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,m).replace(/SYMBOL/,a),currencySymbol:a,decimals:_,decimalsDelimiter:l,hasCurrencySpace:c,integer:f,isCurrencyFirst:s,recurrenceTerm:i}}var Po=e=>{let{commitment:t,term:r,usePrecision:n}=e,i=Cc[r]??1;return lr(e,i>1?_t.MONTH:vn[t]?.[r],(o,{currencySymbol:a})=>{let s={divisor:i,price:o,usePrecision:n},{round:c}=Ic.find(({accept:h})=>h(s));if(!c)throw new Error(`Missing rounding rule for: ${JSON.stringify(s)}`);return(Nc[a]??(h=>h))(c(s))})},Co=({commitment:e,term:t,...r})=>lr(r,vn[e]?.[t]),No=e=>{let{commitment:t,term:r}=e;return t===$.YEAR&&r===k.MONTHLY?lr(e,_t.YEAR,n=>n*12):lr(e,vn[t]?.[r])};var Mc={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at {alternativePrice}",strikethroughAriaLabel:"Regularly at {strikethroughPrice}"},Uc=Fi("ConsonantTemplates/price"),Dc=/<.+?>/g,H={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},we={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel"},Gc="TAX_EXCLUSIVE",Hc=e=>zi(e)?Object.entries(e).filter(([,t])=>Ke(t)||Zt(t)||t===!0).reduce((t,[r,n])=>t+` ${r}${n===!0?"":'="'+Gi(n)+'"'}`,""):"",B=(e,t,r,n=!1)=>`<span class="${e}${t?"":" "+H.disabled}"${Hc(r)}>${n?_o(t):t??""}</span>`;function zc(e,{accessibleLabel:t,currencySymbol:r,decimals:n,decimalsDelimiter:i,hasCurrencySpace:o,integer:a,isCurrencyFirst:s,recurrenceLabel:c,perUnitLabel:l,taxInclusivityLabel:h},d={}){let u=B(H.currencySymbol,r),m=B(H.currencySpace,o?"&nbsp;":""),x="";return s&&(x+=u+m),x+=B(H.integer,a),x+=B(H.decimalsDelimiter,i),x+=B(H.decimals,n),s||(x+=m+u),x+=B(H.recurrence,c,null,!0),x+=B(H.unitType,l,null,!0),x+=B(H.taxInclusivity,h,!0),B(e,x,{...d,"aria-label":t})}var Y=({displayOptical:e=!1,displayStrikethrough:t=!1,displayAnnual:r=!1}={})=>({country:n,displayFormatted:i=!0,displayRecurrence:o=!0,displayPerUnit:a=!1,displayTax:s=!1,language:c,literals:l={}}={},{commitment:h,formatString:d,price:u,priceWithoutDiscount:m,taxDisplay:x,taxTerm:f,term:_,usePrecision:N}={},A={})=>{Object.entries({country:n,formatString:d,language:c,price:u}).forEach(([oe,Vr])=>{if(Vr==null)throw new Error(`Argument "${oe}" is missing`)});let T={...Mc,...l},V=`${c.toLowerCase()}-${n.toUpperCase()}`;function L(oe,Vr){let $r=T[oe];if($r==null)return"";try{return new bo($r.replace(Dc,""),V).format(Vr)}catch{return Uc.error("Failed to format literal:",$r),""}}let K=t&&m?m:u,F=e?Po:Co;r&&(F=No);let{accessiblePrice:ue,recurrenceTerm:me,...Ge}=F({commitment:h,formatString:d,term:_,price:e?u:K,usePrecision:N,isIndianPrice:n==="IN"}),J=ue,ye="";if(E(o)&&me){let oe=L(we.recurrenceAriaLabel,{recurrenceTerm:me});oe&&(J+=" "+oe),ye=L(we.recurrenceLabel,{recurrenceTerm:me})}let pe="";if(E(a)){pe=L(we.perUnitLabel,{perUnit:"LICENSE"});let oe=L(we.perUnitAriaLabel,{perUnit:"LICENSE"});oe&&(J+=" "+oe)}let W="";E(s)&&f&&(W=L(x===Gc?we.taxExclusiveLabel:we.taxInclusiveLabel,{taxTerm:f}),W&&(J+=" "+W)),t&&(J=L(we.strikethroughAriaLabel,{strikethroughPrice:J}));let Q=H.container;if(e&&(Q+=" "+H.containerOptical),t&&(Q+=" "+H.containerStrikethrough),r&&(Q+=" "+H.containerAnnual),E(i))return zc(Q,{...Ge,accessibleLabel:J,recurrenceLabel:ye,perUnitLabel:pe,taxInclusivityLabel:W},A);let{currencySymbol:jt,decimals:ss,decimalsDelimiter:cs,hasCurrencySpace:Ri,integer:ls,isCurrencyFirst:hs}=Ge,He=[ls,cs,ss];hs?(He.unshift(Ri?"\xA0":""),He.unshift(jt)):(He.push(Ri?"\xA0":""),He.push(jt)),He.push(ye,pe,W);let ds=He.join("");return B(Q,ds,A)},Io=()=>(e,t,r)=>{let i=(e.displayOldPrice===void 0||E(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${Y()(e,t,r)}${i?"&nbsp;"+Y({displayStrikethrough:!0})(e,t,r):""}`},ko=()=>(e,t,r)=>{let n={...e,displayTax:!1,displayPerUnit:!1};return`${(e.displayOldPrice===void 0||E(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price?Y({displayStrikethrough:!0})(n,t,r)+"&nbsp;":""}${Y()(e,t,r)}${B(H.containerAnnualPrefix,"&nbsp;(")}${Y({displayAnnual:!0})(n,t,r)}${B(H.containerAnnualSuffix,")")}`},Oo=()=>(e,t,r)=>{let n={...e,displayTax:!1,displayPerUnit:!1};return`${Y()(e,t,r)}${B(H.containerAnnualPrefix,"&nbsp;(")}${Y({displayAnnual:!0})(n,t,r)}${B(H.containerAnnualSuffix,")")}`};var bn=Y(),An=Io(),En=Y({displayOptical:!0}),Sn=Y({displayStrikethrough:!0}),yn=Y({displayAnnual:!0}),Tn=Oo(),Ln=ko();var Fc=(e,t)=>{if(!(!je(e)||!je(t)))return Math.floor((t-e)/t*100)},Ro=()=>(e,t,r)=>{let{price:n,priceWithoutDiscount:i}=t,o=Fc(n,i);return o===void 0?'<span class="no-discount"></span>':`<span class="discount">${o}%</span>`};var _n=Ro();var{freeze:wt}=Object,ee=wt({...Te}),te=wt({...q}),Pe={STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"},wn=wt({...$}),Pn=wt({...Bi}),Cn=wt({...k});var zn={};bs(zn,{CLASS_NAME_FAILED:()=>Nn,CLASS_NAME_PENDING:()=>In,CLASS_NAME_RESOLVED:()=>kn,ERROR_MESSAGE_BAD_REQUEST:()=>hr,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>Kc,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>On,EVENT_TYPE_ERROR:()=>Bc,EVENT_TYPE_FAILED:()=>Rn,EVENT_TYPE_PENDING:()=>Vn,EVENT_TYPE_READY:()=>We,EVENT_TYPE_RESOLVED:()=>$n,LOG_NAMESPACE:()=>Mn,Landscape:()=>Ce,PARAM_AOS_API_KEY:()=>jc,PARAM_ENV:()=>Un,PARAM_LANDSCAPE:()=>Dn,PARAM_WCS_API_KEY:()=>Yc,STATE_FAILED:()=>ae,STATE_PENDING:()=>se,STATE_RESOLVED:()=>ce,WCS_PROD_URL:()=>Gn,WCS_STAGE_URL:()=>Hn});var Nn="placeholder-failed",In="placeholder-pending",kn="placeholder-resolved",hr="Bad WCS request",On="Commerce offer not found",Kc="Literals URL not provided",Bc="mas:error",Rn="mas:failed",Vn="mas:pending",We="mas:ready",$n="mas:resolved",Mn="mas/commerce",Un="commerce.env",Dn="commerce.landscape",jc="commerce.aosKey",Yc="commerce.wcsKey",Gn="https://www.adobe.com/web_commerce_artifact",Hn="https://www.stage.adobe.com/web_commerce_artifact_stage",ae="failed",se="pending",ce="resolved",Ce={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"};var Vo="mas-commerce-service";function $o(e,{once:t=!1}={}){let r=null;function n(){let i=document.querySelector(Vo);i!==r&&(r=i,i&&e(i))}return document.addEventListener(We,n,{once:t}),xe(n),()=>document.removeEventListener(We,n)}function Pt(e,{country:t,forceTaxExclusive:r,perpetual:n}){let i;if(e.length<2)i=e;else{let o=t==="GB"||n?"EN":"MULT",[a,s]=e;i=[a.language===o?a:s]}return r&&(i=i.map(tn)),i}var xe=e=>window.setTimeout(e);function qe(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(Xe).filter(je);return r.length||(r=[t]),r}function dr(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(Xr)}function X(){return document.getElementsByTagName(Vo)?.[0]}var Xc={[ae]:Nn,[se]:In,[ce]:kn},Wc={[ae]:Rn,[se]:Vn,[ce]:$n},Ze=class{constructor(t){p(this,"changes",new Map);p(this,"connected",!1);p(this,"dispose",Be);p(this,"error");p(this,"log");p(this,"options");p(this,"promises",[]);p(this,"state",se);p(this,"timer",null);p(this,"value");p(this,"version",0);p(this,"wrapperElement");this.wrapperElement=t}update(){[ae,se,ce].forEach(t=>{this.wrapperElement.classList.toggle(Xc[t],t===this.state)})}notify(){(this.state===ce||this.state===ae)&&(this.state===ce?this.promises.forEach(({resolve:t})=>t(this.wrapperElement)):this.state===ae&&this.promises.forEach(({reject:t})=>t(this.error)),this.promises=[]),this.wrapperElement.dispatchEvent(new CustomEvent(Wc[this.state],{bubbles:!0}))}attributeChangedCallback(t,r,n){this.changes.set(t,n),this.requestUpdate()}connectedCallback(){this.dispose=$o(()=>this.requestUpdate(!0))}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement})),this.dispose(),this.dispose=Be}onceSettled(){let{error:t,promises:r,state:n}=this;return ce===n?Promise.resolve(this.wrapperElement):ae===n?Promise.reject(t):new Promise((i,o)=>{r.push({resolve:i,reject:o})})}toggleResolved(t,r,n){return t!==this.version?!1:(n!==void 0&&(this.options=n),this.state=ce,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),xe(()=>this.notify()),!0)}toggleFailed(t,r,n){return t!==this.version?!1:(n!==void 0&&(this.options=n),this.error=r,this.state=ae,this.update(),this.log?.error("Failed:",{element:this.wrapperElement,error:r}),xe(()=>this.notify()),!0)}togglePending(t){return this.version++,t&&(this.options=t),this.state=se,this.update(),xe(()=>this.notify()),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!X()||this.timer)return;let{error:r,options:n,state:i,value:o,version:a}=this;this.state=se,this.timer=xe(async()=>{this.timer=null;let s=null;if(this.changes.size&&(s=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:s}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:s})),s||t)try{await this.wrapperElement.render?.()===!1&&this.state===se&&this.version===a&&(this.state=i,this.error=r,this.value=o,this.update(),this.notify())}catch(c){this.toggleFailed(this.version,c,n)}})}};function Mo(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function ur(e,t={}){let{tag:r,is:n}=e,i=document.createElement(r,{is:n});return i.setAttribute("is",n),Object.assign(i.dataset,Mo(t)),i}function mr(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,Mo(t)),e):null}var qc="download",Zc="upgrade",Ne,Ct=class Ct extends HTMLAnchorElement{constructor(){super();j(this,Ne);p(this,"masElement",new Ze(this));this.handleClick=this.handleClick.bind(this)}attributeChangedCallback(r,n,i){this.masElement.attributeChangedCallback(r,n,i)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}requestUpdate(r=!1){return this.masElement.requestUpdate(r)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}static createCheckoutLink(r={},n=""){let i=X();if(!i)return null;let{checkoutMarketSegment:o,checkoutWorkflow:a,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:h,perpetual:d,promotionCode:u,quantity:m,wcsOsi:x,extraOptions:f}=i.collectCheckoutOptions(r),_=ur(Ct,{checkoutMarketSegment:o,checkoutWorkflow:a,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:h,perpetual:d,promotionCode:u,quantity:m,wcsOsi:x,extraOptions:f});return n&&(_.innerHTML=`<span>${n}</span>`),_}get isCheckoutLink(){return!0}handleClick(r){var n;if(r.target!==this){r.preventDefault(),r.stopImmediatePropagation(),this.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window}));return}(n=M(this,Ne))==null||n.call(this,r)}async render(r={}){if(!this.isConnected)return!1;let n=X();if(!n)return!1;this.dataset.imsCountry||n.imsCountryPromise.then(h=>{h&&(this.dataset.imsCountry=h)},Be),r.imsCountry=null;let i=n.collectCheckoutOptions(r,this);if(!i.wcsOsi.length)return!1;let o;try{o=JSON.parse(i.extraOptions??"{}")}catch(h){this.masElement.log?.error("cannot parse exta checkout options",h)}let a=this.masElement.togglePending(i);this.href="";let s=n.resolveOfferSelectors(i),c=await Promise.all(s);c=c.map(h=>Pt(h,i)),i.country=this.dataset.imsCountry||i.country;let l=await n.buildCheckoutAction?.(c.flat(),{...o,...i},this);return this.renderOffers(c.flat(),i,{},l,a)}renderOffers(r,n,i={},o=void 0,a=void 0){if(!this.isConnected)return!1;let s=X();if(!s)return!1;if(n={...JSON.parse(this.dataset.extraOptions??"null"),...n,...i},a??(a=this.masElement.togglePending(n)),M(this,Ne)&&fe(this,Ne,void 0),o){this.classList.remove(qc,Zc),this.masElement.toggleResolved(a,r,n);let{url:l,text:h,className:d,handler:u}=o;return l&&(this.href=l),h&&(this.firstElementChild.innerHTML=h),d&&this.classList.add(...d.split(" ")),u&&(this.setAttribute("href","#"),fe(this,Ne,u.bind(this))),!0}else if(r.length){if(this.masElement.toggleResolved(a,r,n)){let l=s.buildCheckoutURL(r,n);return this.setAttribute("href",l),!0}}else{let l=new Error(`Not provided: ${n?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(a,l,n))return this.setAttribute("href","#"),!0}}updateOptions(r={}){let n=X();if(!n)return!1;let{checkoutMarketSegment:i,checkoutWorkflow:o,checkoutWorkflowStep:a,entitlement:s,upgrade:c,modal:l,perpetual:h,promotionCode:d,quantity:u,wcsOsi:m}=n.collectCheckoutOptions(r);return mr(this,{checkoutMarketSegment:i,checkoutWorkflow:o,checkoutWorkflowStep:a,entitlement:s,upgrade:c,modal:l,perpetual:h,promotionCode:d,quantity:u,wcsOsi:m}),!0}};Ne=new WeakMap,p(Ct,"is","checkout-link"),p(Ct,"tag","a");var re=Ct;window.customElements.get(re.is)||window.customElements.define(re.is,re,{extends:re.tag});var y=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflow:ee.V3,checkoutWorkflowStep:te.EMAIL,country:"US",displayOldPrice:!0,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,env:Pe.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsBufferDelay:1,wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:Ce.PUBLISHED,wcsBufferLimit:1});function Uo({providers:e,settings:t}){function r(o,a){let{checkoutClientId:s,checkoutWorkflow:c,checkoutWorkflowStep:l,country:h,language:d,promotionCode:u,quantity:m}=t,{checkoutMarketSegment:x,checkoutWorkflow:f=c,checkoutWorkflowStep:_=l,imsCountry:N,country:A=N??h,language:T=d,quantity:V=m,entitlement:L,upgrade:K,modal:F,perpetual:ue,promotionCode:me=u,wcsOsi:Ge,extraOptions:J,...ye}=Object.assign({},a?.dataset??{},o??{}),pe=ge(f,ee,y.checkoutWorkflow),W=te.CHECKOUT;pe===ee.V3&&(W=ge(_,te,y.checkoutWorkflowStep));let Q=Ye({...ye,extraOptions:J,checkoutClientId:s,checkoutMarketSegment:x,country:A,quantity:qe(V,y.quantity),checkoutWorkflow:pe,checkoutWorkflowStep:W,language:T,entitlement:E(L),upgrade:E(K),modal:E(F),perpetual:E(ue),promotionCode:At(me).effectivePromoCode,wcsOsi:dr(Ge)});if(a)for(let jt of e.checkout)jt(a,Q);return Q}function n(o,a){if(!Array.isArray(o)||!o.length||!a)return"";let{env:s,landscape:c}=t,{checkoutClientId:l,checkoutMarketSegment:h,checkoutWorkflow:d,checkoutWorkflowStep:u,country:m,promotionCode:x,quantity:f,..._}=r(a),N=window.frameElement?"if":"fp",A={checkoutPromoCode:x,clientId:l,context:N,country:m,env:s,items:[],marketSegment:h,workflowStep:u,landscape:c,..._};if(o.length===1){let[{offerId:T,offerType:V,productArrangementCode:L}]=o,{marketSegments:[K]}=o[0];Object.assign(A,{marketSegment:K,offerType:V,productArrangementCode:L}),A.items.push(f[0]===1?{id:T}:{id:T,quantity:f[0]})}else A.items.push(...o.map(({offerId:T},V)=>({id:T,quantity:f[V]??y.quantity})));return zr(d,A)}let{createCheckoutLink:i}=re;return{CheckoutLink:re,CheckoutWorkflow:ee,CheckoutWorkflowStep:te,buildCheckoutURL:n,collectCheckoutOptions:r,createCheckoutLink:i}}var Fn={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals"],serializableTypes:["Array","Object"],sampleRate:30,tags:"consumer=milo/commerce"},Do=new Set,Jc=e=>e instanceof Error||typeof e.originatingRequest=="string";function Go(e){if(e==null)return;let t=typeof e;if(t==="function"){let{name:r}=e;return r?`${t} ${r}`:t}if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:n,originatingRequest:i,status:o}=e;return[n,o,i].filter(a=>a).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!Fn.serializableTypes.includes(r))return r}return e}function Qc(e,t){if(!Fn.ignoredProperties.includes(e))return Go(t)}var Kn={append(e){let{delimiter:t,sampleRate:r,tags:n,clientId:i}=Fn,{message:o,params:a}=e,s=[],c=o,l=[];a.forEach(u=>{u!=null&&(Jc(u)?s:l).push(u)}),s.length&&(c+=" ",c+=s.map(Go).join(" "));let{pathname:h,search:d}=window.location;c+=`${t}page=`,c+=h+d,l.length&&(c+=`${t}facts=`,c+=JSON.stringify(l,Qc)),Do.has(c)||(Do.add(c),window.lana?.log(c,{sampleRate:r,tags:n,clientId:i}))}};var Bn=Object.freeze({LOCAL:"local",PROD:"prod",STAGE:"stage"});function el({locale:e=void 0,country:t=void 0,language:r=void 0}={}){return r??(r=e?.split("_")?.[0]||y.language),t??(t=e?.split("_")?.[1]||y.country),e??(e=`${r}_${t}`),{locale:e,country:t,language:r}}function jn(e={}){let{commerce:t={}}=e,r=Pe.PRODUCTION,n=Gn,i=O("checkoutClientId",t)??y.checkoutClientId,o=ge(O("checkoutWorkflow",t),ee,y.checkoutWorkflow),a=te.CHECKOUT;o===ee.V3&&(a=ge(O("checkoutWorkflowStep",t),te,y.checkoutWorkflowStep));let s=E(O("displayOldPrice",t),y.displayOldPrice),c=E(O("displayPerUnit",t),y.displayPerUnit),l=E(O("displayRecurrence",t),y.displayRecurrence),h=E(O("displayTax",t),y.displayTax),d=E(O("entitlement",t),y.entitlement),u=E(O("modal",t),y.modal),m=E(O("forceTaxExclusive",t),y.forceTaxExclusive),x=O("promotionCode",t)??y.promotionCode,f=qe(O("quantity",t)),_=O("wcsApiKey",t)??y.wcsApiKey,N=t?.env==="stage",A=Ce.PUBLISHED;["true",""].includes(t.allowOverride)&&(N=(O(Un,t,{metadata:!1})?.toLowerCase()??t?.env)==="stage",A=ge(O(Dn,t),Ce,A)),N&&(r=Pe.STAGE,n=Hn);let V=Xe(O("wcsBufferDelay",t),y.wcsBufferDelay),L=Xe(O("wcsBufferLimit",t),y.wcsBufferLimit);return{...el(e),displayOldPrice:s,checkoutClientId:i,checkoutWorkflow:o,checkoutWorkflowStep:a,displayPerUnit:c,displayRecurrence:l,displayTax:h,entitlement:d,extraOptions:y.extraOptions,modal:u,env:r,forceTaxExclusive:m,promotionCode:x,quantity:f,wcsApiKey:_,wcsBufferDelay:V,wcsBufferLimit:L,wcsURL:n,landscape:A}}var zo="debug",tl="error",rl="info",nl="warn",il=Date.now(),Yn=new Set,Xn=new Set,Ho=new Map,Nt=Object.freeze({DEBUG:zo,ERROR:tl,INFO:rl,WARN:nl}),Fo={append({level:e,message:t,params:r,timestamp:n,source:i}){console[e](`${n}ms [${i}] %c${t}`,"font-weight: bold;",...r)}},Ko={filter:({level:e})=>e!==zo},ol={filter:()=>!1};function al(e,t,r,n,i){return{level:e,message:t,namespace:r,get params(){if(n.length===1){let[o]=n;bt(o)&&(n=o(),Array.isArray(n)||(n=[n]))}return n},source:i,timestamp:Date.now()-il}}function sl(e){[...Xn].every(t=>t(e))&&Yn.forEach(t=>t(e))}function Bo(e){let t=(Ho.get(e)??0)+1;Ho.set(e,t);let r=`${e} #${t}`,n=o=>(a,...s)=>sl(al(o,a,e,s,r)),i=Object.seal({id:r,namespace:e,module(o){return Bo(`${i.namespace}/${o}`)},debug:n(Nt.DEBUG),error:n(Nt.ERROR),info:n(Nt.INFO),warn:n(Nt.WARN)});return i}function pr(...e){e.forEach(t=>{let{append:r,filter:n}=t;bt(n)?Xn.add(n):bt(r)&&Yn.add(r)})}function cl(e={}){let{name:t}=e,r=E(O("commerce.debug",{search:!0,storage:!0}),t===Bn.LOCAL);return pr(r?Fo:Ko),t===Bn.PROD&&pr(Kn),Z}function ll(){Yn.clear(),Xn.clear()}var Z={...Bo(Mn),Level:Nt,Plugins:{consoleAppender:Fo,debugFilter:Ko,quietFilter:ol,lanaAppender:Kn},init:cl,reset:ll,use:pr};function hl({interval:e=200,maxAttempts:t=25}={}){let r=Z.module("ims");return new Promise(n=>{r.debug("Waing for IMS to be ready");let i=0;function o(){window.adobeIMS?.initialized?n():++i>t?(r.debug("Timeout"),n()):setTimeout(o,e)}o()})}function dl(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function ul(e){let t=Z.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:n})=>(t.debug("Got user country:",n),n),n=>{t.error("Unable to get user country:",n)}):null)}function jo({}){let e=hl(),t=dl(e),r=ul(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}async function Xo(e,t){let{data:r}=t||await Promise.resolve().then(()=>Es(Yo(),1));if(Array.isArray(r)){let n=o=>r.find(a=>qt(a.lang,o)),i=n(e.language)??n(y.language);if(i)return Object.freeze(i)}return{}}var Wo=["GB_en","AU_en","FR_fr","AT_de","BE_en","BE_fr","BE_nl","BG_bg","CH_de","CH_fr","CH_it","CZ_cs","DE_de","DK_da","EE_et","EG_ar","EG_en","ES_es","FI_fi","FR_fr","GR_el","GR_en","HU_hu","IE_en","IT_it","LU_de","LU_en","LU_fr","NL_nl","NO_nb","PL_pl","PT_pt","RO_ro","SE_sv","SI_sl","SK_sk","TR_tr","UA_uk","ID_en","ID_in","IN_en","IN_hi","JP_ja","MY_en","MY_ms","NZ_en","TH_en","TH_th"],pl={INDIVIDUAL_COM:["ZA_en","LT_lt","LV_lv","NG_en","SA_ar","SA_en","ZA_en","SG_en","KR_ko"],TEAM_COM:["ZA_en","LT_lt","LV_lv","NG_en","ZA_en","CO_es","KR_ko"],INDIVIDUAL_EDU:["LT_lt","LV_lv","SA_en","SG_en"],TEAM_EDU:["SG_en","KR_ko"]},It=class It extends HTMLSpanElement{constructor(){super();p(this,"masElement",new Ze(this));this.handleClick=this.handleClick.bind(this)}static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-perpetual","data-promotion-code","data-tax-exclusive","data-template","data-wcs-osi"]}static createInlinePrice(r){let n=X();if(!n)return null;let{displayOldPrice:i,displayPerUnit:o,displayRecurrence:a,displayTax:s,forceTaxExclusive:c,perpetual:l,promotionCode:h,quantity:d,template:u,wcsOsi:m}=n.collectPriceOptions(r);return ur(It,{displayOldPrice:i,displayPerUnit:o,displayRecurrence:a,displayTax:s,forceTaxExclusive:c,perpetual:l,promotionCode:h,quantity:d,template:u,wcsOsi:m})}get isInlinePrice(){return!0}attributeChangedCallback(r,n,i){this.masElement.attributeChangedCallback(r,n,i)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}handleClick(r){r.target!==this&&(r.stopImmediatePropagation(),this.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})))}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}requestUpdate(r=!1){return this.masElement.requestUpdate(r)}resolveDisplayTaxForGeoAndSegment(r,n,i,o){let a=`${r}_${n}`;if(Wo.includes(r)||Wo.includes(a))return!0;let s=pl[`${i}_${o}`];return s?!!(s.includes(r)||s.includes(a)):!1}async resolveDisplayTax(r,n){let[i]=await r.resolveOfferSelectors(n),o=Pt(await i,n);if(o?.length){let{country:a,language:s}=n,c=o[0],[l=""]=c.marketSegments;return this.resolveDisplayTaxForGeoAndSegment(a,s,c.customerSegment,l)}}async render(r={}){if(!this.isConnected)return!1;let n=X();if(!n)return!1;let i=n.collectPriceOptions(r,this);if(!i.wcsOsi.length)return!1;let o=this.masElement.togglePending(i);this.innerHTML="";let[a]=n.resolveOfferSelectors(i);return this.renderOffers(Pt(await a,i),i,o)}renderOffers(r,n={},i=void 0){if(!this.isConnected)return;let o=X();if(!o)return!1;let a=o.collectPriceOptions({...this.dataset,...n},this);if(i??(i=this.masElement.togglePending(a)),r.length){if(this.masElement.toggleResolved(i,r,a))return this.innerHTML=o.buildPriceHTML(r,a),!0}else{let s=new Error(`Not provided: ${a?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(i,s,a))return this.innerHTML="",!0}return!1}updateOptions(r){let n=X();if(!n)return!1;let{displayOldPrice:i,displayPerUnit:o,displayRecurrence:a,displayTax:s,forceTaxExclusive:c,perpetual:l,promotionCode:h,quantity:d,template:u,wcsOsi:m}=n.collectPriceOptions(r);return mr(this,{displayOldPrice:i,displayPerUnit:o,displayRecurrence:a,displayTax:s,forceTaxExclusive:c,perpetual:l,promotionCode:h,quantity:d,template:u,wcsOsi:m}),!0}};p(It,"is","inline-price"),p(It,"tag","span");var ne=It;window.customElements.get(ne.is)||window.customElements.define(ne.is,ne,{extends:ne.tag});function qo({literals:e,providers:t,settings:r}){function n(a,s){let{country:c,displayOldPrice:l,displayPerUnit:h,displayRecurrence:d,displayTax:u,forceTaxExclusive:m,language:x,promotionCode:f,quantity:_}=r,{displayOldPrice:N=l,displayPerUnit:A=h,displayRecurrence:T=d,displayTax:V=u,forceTaxExclusive:L=m,country:K=c,language:F=x,perpetual:ue,promotionCode:me=f,quantity:Ge=_,template:J,wcsOsi:ye,...pe}=Object.assign({},s?.dataset??{},a??{}),W=Ye({...pe,country:K,displayOldPrice:E(N),displayPerUnit:E(A),displayRecurrence:E(T),displayTax:E(V),forceTaxExclusive:E(L),language:F,perpetual:E(ue),promotionCode:At(me).effectivePromoCode,quantity:qe(Ge,y.quantity),template:J,wcsOsi:dr(ye)});if(s)for(let Q of t.price)Q(s,W);return W}function i(a,s){if(!Array.isArray(a)||!a.length||!s)return"";let{template:c}=s,l;switch(c){case"discount":l=_n;break;case"strikethrough":l=Sn;break;case"optical":l=En;break;case"annual":l=yn;break;default:s.country==="AU"&&a[0].planType==="ABM"?l=s.promotionCode?Ln:Tn:l=s.promotionCode?An:bn}let h=n(s);h.literals=Object.assign({},e.price,Ye(s.literals??{}));let[d]=a;return d={...d,...d.priceDetails},l(h,d)}let{createInlinePrice:o}=ne;return{InlinePrice:ne,buildPriceHTML:i,collectPriceOptions:n,createInlinePrice:o}}function Zo({settings:e}){let t=Z.module("wcs"),{env:r,wcsApiKey:n}=e,i=new Map,o=new Map,a;async function s(d,u,m=!0){let x=On;t.debug("Fetching:",d);try{d.offerSelectorIds=d.offerSelectorIds.sort();let f=new URL(e.wcsURL);f.searchParams.set("offer_selector_ids",d.offerSelectorIds.join(",")),f.searchParams.set("country",d.country),f.searchParams.set("locale",d.locale),f.searchParams.set("landscape",r===Pe.STAGE?"ALL":e.landscape),f.searchParams.set("api_key",n),d.language&&f.searchParams.set("language",d.language),d.promotionCode&&f.searchParams.set("promotion_code",d.promotionCode),d.currency&&f.searchParams.set("currency",d.currency);let _=await fetch(f.toString(),{credentials:"omit"});if(_.ok){let N=await _.json();t.debug("Fetched:",d,N);let A=N.resolvedOffers??[];A=A.map(Qt),u.forEach(({resolve:T},V)=>{let L=A.filter(({offerSelectorIds:K})=>K.includes(V)).flat();L.length&&(u.delete(V),T(L))})}else _.status===404&&d.offerSelectorIds.length>1?(t.debug("Multi-osi 404, fallback to fetch-by-one strategy"),await Promise.allSettled(d.offerSelectorIds.map(N=>s({...d,offerSelectorIds:[N]},u,!1)))):(x=hr,t.error(x,d))}catch(f){x=hr,t.error(x,d,f)}m&&u.size&&(t.debug("Missing:",{offerSelectorIds:[...u.keys()]}),u.forEach(f=>{f.reject(new Error(x))}))}function c(){clearTimeout(a);let d=[...o.values()];o.clear(),d.forEach(({options:u,promises:m})=>s(u,m))}function l(){let d=i.size;i.clear(),t.debug(`Flushed ${d} cache entries`)}function h({country:d,language:u,perpetual:m=!1,promotionCode:x="",wcsOsi:f=[]}){let _=`${u}_${d}`;d!=="GB"&&(u=m?"EN":"MULT");let N=[d,u,x].filter(A=>A).join("-").toLowerCase();return f.map(A=>{let T=`${A}-${N}`;if(!i.has(T)){let V=new Promise((L,K)=>{let F=o.get(N);if(!F){let ue={country:d,locale:_,offerSelectorIds:[]};d!=="GB"&&(ue.language=u),F={options:ue,promises:new Map},o.set(N,F)}x&&(F.options.promotionCode=x),F.options.offerSelectorIds.push(A),F.promises.set(A,{resolve:L,reject:K}),F.options.offerSelectorIds.length>=e.wcsBufferLimit?c():(t.debug("Queued:",F.options),a||(a=setTimeout(c,e.wcsBufferDelay)))});i.set(T,V)}return i.get(T)})}return{WcsCommitment:wn,WcsPlanType:Pn,WcsTerm:Cn,resolveOfferSelectors:h,flushWcsCache:l}}var Wn="mas-commerce-service",gr,Jo,fr=class extends HTMLElement{constructor(){super(...arguments);j(this,gr);p(this,"promise",null)}async registerCheckoutAction(r){typeof r=="function"&&(this.buildCheckoutAction=async(n,i,o)=>{let a=await r?.(n,i,this.imsSignedInPromise,o);return a||null})}async activate(){let r=M(this,gr,Jo),n=Z.init(r.env).module("service");n.debug("Activating:",r);let i=Object.freeze(jn(r)),o={price:{}};try{o.price=await Xo(i,r.commerce.priceLiterals)}catch{}let a={checkout:new Set,price:new Set},s={literals:o,providers:a,settings:i};Object.defineProperties(this,Object.getOwnPropertyDescriptors({...Uo(s),...jo(s),...qo(s),...Zo(s),...zn,Log:Z,get defaults(){return y},get log(){return Z},get providers(){return{checkout(c){return a.checkout.add(c),()=>a.checkout.delete(c)},price(c){return a.price.add(c),()=>a.price.delete(c)}}},get settings(){return i}})),n.debug("Activated:",{literals:o,settings:i}),xe(()=>{let c=new CustomEvent(We,{bubbles:!0,cancelable:!1,detail:this});this.dispatchEvent(c)})}connectedCallback(){this.readyPromise||(this.readyPromise=this.activate())}disconnectedCallback(){this.readyPromise=null}flushWcsCache(){this.flushWcsCache(),this.log.debug("Flushed WCS cache")}refreshOffers(){this.flushWcsCache(),document.querySelectorAll('span[is="inline-price"],a[is="checkout-link"]').forEach(r=>r.requestUpdate(!0)),this.log.debug("Refreshed WCS offers")}refreshFragments(){this.flushWcsCache(),document.querySelectorAll("aem-fragment").forEach(r=>r.refresh()),this.log.debug("Refreshed AEM fragments")}};gr=new WeakSet,Jo=function(){let r={commerce:{env:this.getAttribute("env")}};return["locale","country","language"].forEach(n=>{let i=this.getAttribute(n);i&&(r[n]=i)}),["checkout-workflow-step","force-tax-exclusive","checkout-client-id","allow-override"].forEach(n=>{let i=this.getAttribute(n);if(i!=null){let o=n.replace(/-([a-z])/g,a=>a[1].toUpperCase());r.commerce[o]=i}}),r},p(fr,"instance");window.customElements.get(Wn)||window.customElements.define(Wn,fr);var xr=window,br=xr.ShadowRoot&&(xr.ShadyCSS===void 0||xr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ea=Symbol(),Qo=new WeakMap,vr=class{constructor(t,r,n){if(this._$cssResult$=!0,n!==ea)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(br&&t===void 0){let n=r!==void 0&&r.length===1;n&&(t=Qo.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Qo.set(r,t))}return t}toString(){return this.cssText}},ta=e=>new vr(typeof e=="string"?e:e+"",void 0,ea);var qn=(e,t)=>{br?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let n=document.createElement("style"),i=xr.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=r.cssText,e.appendChild(n)})},Ar=br?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let n of t.cssRules)r+=n.cssText;return ta(r)})(e):e;var Zn,Er=window,ra=Er.trustedTypes,fl=ra?ra.emptyScript:"",na=Er.reactiveElementPolyfillSupport,Qn={toAttribute(e,t){switch(t){case Boolean:e=e?fl:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},ia=(e,t)=>t!==e&&(t==t||e==e),Jn={attribute:!0,type:String,converter:Qn,reflect:!1,hasChanged:ia},ei="finalized",Ie=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,n)=>{let i=this._$Ep(n,r);i!==void 0&&(this._$Ev.set(i,n),t.push(i))}),t}static createProperty(t,r=Jn){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let n=typeof t=="symbol"?Symbol():"__"+t,i=this.getPropertyDescriptor(t,n,r);i!==void 0&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,r,n){return{get(){return this[r]},set(i){let o=this[t];this[r]=i,this.requestUpdate(t,o,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||Jn}static finalize(){if(this.hasOwnProperty(ei))return!1;this[ei]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let i of n)this.createProperty(i,r[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let i of n)r.unshift(Ar(i))}else t!==void 0&&r.push(Ar(t));return r}static _$Ep(t,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return qn(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(t,r,n){this._$AK(t,n)}_$EO(t,r,n=Jn){var i;let o=this.constructor._$Ep(t,n);if(o!==void 0&&n.reflect===!0){let a=(((i=n.converter)===null||i===void 0?void 0:i.toAttribute)!==void 0?n.converter:Qn).toAttribute(r,n.type);this._$El=t,a==null?this.removeAttribute(o):this.setAttribute(o,a),this._$El=null}}_$AK(t,r){var n;let i=this.constructor,o=i._$Ev.get(t);if(o!==void 0&&this._$El!==o){let a=i.getPropertyOptions(o),s=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?a.converter:Qn;this._$El=o,this[o]=s.fromAttribute(r,a.type),this._$El=null}}requestUpdate(t,r,n){let i=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||ia)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),n.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,n))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((i,o)=>this[o]=i),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(t=this._$ES)===null||t===void 0||t.forEach(i=>{var o;return(o=i.hostUpdate)===null||o===void 0?void 0:o.call(i)}),this.update(n)):this._$Ek()}catch(i){throw r=!1,this._$Ek(),i}r&&this._$AE(n)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var i;return(i=n.hostUpdated)===null||i===void 0?void 0:i.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};Ie[ei]=!0,Ie.elementProperties=new Map,Ie.elementStyles=[],Ie.shadowRootOptions={mode:"open"},na?.({ReactiveElement:Ie}),((Zn=Er.reactiveElementVersions)!==null&&Zn!==void 0?Zn:Er.reactiveElementVersions=[]).push("1.6.3");var ti,Sr=window,Je=Sr.trustedTypes,oa=Je?Je.createPolicy("lit-html",{createHTML:e=>e}):void 0,ni="$lit$",ve=`lit$${(Math.random()+"").slice(9)}$`,ua="?"+ve,gl=`<${ua}>`,Re=document,yr=()=>Re.createComment(""),Ot=e=>e===null||typeof e!="object"&&typeof e!="function",ma=Array.isArray,xl=e=>ma(e)||typeof e?.[Symbol.iterator]=="function",ri=`[ 	
\f\r]`,kt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,aa=/-->/g,sa=/>/g,ke=RegExp(`>|${ri}(?:([^\\s"'>=/]+)(${ri}*=${ri}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ca=/'/g,la=/"/g,pa=/^(?:script|style|textarea|title)$/i,fa=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),nm=fa(1),im=fa(2),Rt=Symbol.for("lit-noChange"),U=Symbol.for("lit-nothing"),ha=new WeakMap,Oe=Re.createTreeWalker(Re,129,null,!1);function ga(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return oa!==void 0?oa.createHTML(t):t}var vl=(e,t)=>{let r=e.length-1,n=[],i,o=t===2?"<svg>":"",a=kt;for(let s=0;s<r;s++){let c=e[s],l,h,d=-1,u=0;for(;u<c.length&&(a.lastIndex=u,h=a.exec(c),h!==null);)u=a.lastIndex,a===kt?h[1]==="!--"?a=aa:h[1]!==void 0?a=sa:h[2]!==void 0?(pa.test(h[2])&&(i=RegExp("</"+h[2],"g")),a=ke):h[3]!==void 0&&(a=ke):a===ke?h[0]===">"?(a=i??kt,d=-1):h[1]===void 0?d=-2:(d=a.lastIndex-h[2].length,l=h[1],a=h[3]===void 0?ke:h[3]==='"'?la:ca):a===la||a===ca?a=ke:a===aa||a===sa?a=kt:(a=ke,i=void 0);let m=a===ke&&e[s+1].startsWith("/>")?" ":"";o+=a===kt?c+gl:d>=0?(n.push(l),c.slice(0,d)+ni+c.slice(d)+ve+m):c+ve+(d===-2?(n.push(void 0),s):m)}return[ga(e,o+(e[r]||"<?>")+(t===2?"</svg>":"")),n]},Vt=class e{constructor({strings:t,_$litType$:r},n){let i;this.parts=[];let o=0,a=0,s=t.length-1,c=this.parts,[l,h]=vl(t,r);if(this.el=e.createElement(l,n),Oe.currentNode=this.el.content,r===2){let d=this.el.content,u=d.firstChild;u.remove(),d.append(...u.childNodes)}for(;(i=Oe.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes()){let d=[];for(let u of i.getAttributeNames())if(u.endsWith(ni)||u.startsWith(ve)){let m=h[a++];if(d.push(u),m!==void 0){let x=i.getAttribute(m.toLowerCase()+ni).split(ve),f=/([.?@])?(.*)/.exec(m);c.push({type:1,index:o,name:f[2],strings:x,ctor:f[1]==="."?oi:f[1]==="?"?ai:f[1]==="@"?si:et})}else c.push({type:6,index:o})}for(let u of d)i.removeAttribute(u)}if(pa.test(i.tagName)){let d=i.textContent.split(ve),u=d.length-1;if(u>0){i.textContent=Je?Je.emptyScript:"";for(let m=0;m<u;m++)i.append(d[m],yr()),Oe.nextNode(),c.push({type:2,index:++o});i.append(d[u],yr())}}}else if(i.nodeType===8)if(i.data===ua)c.push({type:2,index:o});else{let d=-1;for(;(d=i.data.indexOf(ve,d+1))!==-1;)c.push({type:7,index:o}),d+=ve.length-1}o++}}static createElement(t,r){let n=Re.createElement("template");return n.innerHTML=t,n}};function Qe(e,t,r=e,n){var i,o,a,s;if(t===Rt)return t;let c=n!==void 0?(i=r._$Co)===null||i===void 0?void 0:i[n]:r._$Cl,l=Ot(t)?void 0:t._$litDirective$;return c?.constructor!==l&&((o=c?._$AO)===null||o===void 0||o.call(c,!1),l===void 0?c=void 0:(c=new l(e),c._$AT(e,r,n)),n!==void 0?((a=(s=r)._$Co)!==null&&a!==void 0?a:s._$Co=[])[n]=c:r._$Cl=c),c!==void 0&&(t=Qe(e,c._$AS(e,t.values),c,n)),t}var ii=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:n},parts:i}=this._$AD,o=((r=t?.creationScope)!==null&&r!==void 0?r:Re).importNode(n,!0);Oe.currentNode=o;let a=Oe.nextNode(),s=0,c=0,l=i[0];for(;l!==void 0;){if(s===l.index){let h;l.type===2?h=new Tr(a,a.nextSibling,this,t):l.type===1?h=new l.ctor(a,l.name,l.strings,this,t):l.type===6&&(h=new ci(a,this,t)),this._$AV.push(h),l=i[++c]}s!==l?.index&&(a=Oe.nextNode(),s++)}return Oe.currentNode=Re,o}v(t){let r=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,r),r+=n.strings.length-2):n._$AI(t[r])),r++}},Tr=class e{constructor(t,r,n,i){var o;this.type=2,this._$AH=U,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=n,this.options=i,this._$Cp=(o=i?.isConnected)===null||o===void 0||o}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=Qe(this,t,r),Ot(t)?t===U||t==null||t===""?(this._$AH!==U&&this._$AR(),this._$AH=U):t!==this._$AH&&t!==Rt&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):xl(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==U&&Ot(this._$AH)?this._$AA.nextSibling.data=t:this.$(Re.createTextNode(t)),this._$AH=t}g(t){var r;let{values:n,_$litType$:i}=t,o=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Vt.createElement(ga(i.h,i.h[0]),this.options)),i);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===o)this._$AH.v(n);else{let a=new ii(o,this),s=a.u(this.options);a.v(n),this.$(s),this._$AH=a}}_$AC(t){let r=ha.get(t.strings);return r===void 0&&ha.set(t.strings,r=new Vt(t)),r}T(t){ma(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,n,i=0;for(let o of t)i===r.length?r.push(n=new e(this.k(yr()),this.k(yr()),this,this.options)):n=r[i],n._$AI(o),i++;i<r.length&&(this._$AR(n&&n._$AB.nextSibling,i),r.length=i)}_$AR(t=this._$AA.nextSibling,r){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,r);t&&t!==this._$AB;){let i=t.nextSibling;t.remove(),t=i}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},et=class{constructor(t,r,n,i,o){this.type=1,this._$AH=U,this._$AN=void 0,this.element=t,this.name=r,this._$AM=i,this.options=o,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=U}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,n,i){let o=this.strings,a=!1;if(o===void 0)t=Qe(this,t,r,0),a=!Ot(t)||t!==this._$AH&&t!==Rt,a&&(this._$AH=t);else{let s=t,c,l;for(t=o[0],c=0;c<o.length-1;c++)l=Qe(this,s[n+c],r,c),l===Rt&&(l=this._$AH[c]),a||(a=!Ot(l)||l!==this._$AH[c]),l===U?t=U:t!==U&&(t+=(l??"")+o[c+1]),this._$AH[c]=l}a&&!i&&this.j(t)}j(t){t===U?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},oi=class extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===U?void 0:t}},bl=Je?Je.emptyScript:"",ai=class extends et{constructor(){super(...arguments),this.type=4}j(t){t&&t!==U?this.element.setAttribute(this.name,bl):this.element.removeAttribute(this.name)}},si=class extends et{constructor(t,r,n,i,o){super(t,r,n,i,o),this.type=5}_$AI(t,r=this){var n;if((t=(n=Qe(this,t,r,0))!==null&&n!==void 0?n:U)===Rt)return;let i=this._$AH,o=t===U&&i!==U||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==U&&(i===U||o);o&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,n;typeof this._$AH=="function"?this._$AH.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,t):this._$AH.handleEvent(t)}},ci=class{constructor(t,r,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Qe(this,t)}};var da=Sr.litHtmlPolyfillSupport;da?.(Vt,Tr),((ti=Sr.litHtmlVersions)!==null&&ti!==void 0?ti:Sr.litHtmlVersions=[]).push("2.8.0");var Lr=window,_r=Lr.ShadowRoot&&(Lr.ShadyCSS===void 0||Lr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,li=Symbol(),xa=new WeakMap,$t=class{constructor(t,r,n){if(this._$cssResult$=!0,n!==li)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(_r&&t===void 0){let n=r!==void 0&&r.length===1;n&&(t=xa.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&xa.set(r,t))}return t}toString(){return this.cssText}},be=e=>new $t(typeof e=="string"?e:e+"",void 0,li),w=(e,...t)=>{let r=e.length===1?e[0]:t.reduce((n,i,o)=>n+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1],e[0]);return new $t(r,e,li)},hi=(e,t)=>{_r?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let n=document.createElement("style"),i=Lr.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=r.cssText,e.appendChild(n)})},wr=_r?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let n of t.cssRules)r+=n.cssText;return be(r)})(e):e;var di,Pr=window,va=Pr.trustedTypes,Al=va?va.emptyScript:"",ba=Pr.reactiveElementPolyfillSupport,mi={toAttribute(e,t){switch(t){case Boolean:e=e?Al:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},Aa=(e,t)=>t!==e&&(t==t||e==e),ui={attribute:!0,type:String,converter:mi,reflect:!1,hasChanged:Aa},pi="finalized",le=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,n)=>{let i=this._$Ep(n,r);i!==void 0&&(this._$Ev.set(i,n),t.push(i))}),t}static createProperty(t,r=ui){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let n=typeof t=="symbol"?Symbol():"__"+t,i=this.getPropertyDescriptor(t,n,r);i!==void 0&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,r,n){return{get(){return this[r]},set(i){let o=this[t];this[r]=i,this.requestUpdate(t,o,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||ui}static finalize(){if(this.hasOwnProperty(pi))return!1;this[pi]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let i of n)this.createProperty(i,r[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let i of n)r.unshift(wr(i))}else t!==void 0&&r.push(wr(t));return r}static _$Ep(t,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return hi(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(t,r,n){this._$AK(t,n)}_$EO(t,r,n=ui){var i;let o=this.constructor._$Ep(t,n);if(o!==void 0&&n.reflect===!0){let a=(((i=n.converter)===null||i===void 0?void 0:i.toAttribute)!==void 0?n.converter:mi).toAttribute(r,n.type);this._$El=t,a==null?this.removeAttribute(o):this.setAttribute(o,a),this._$El=null}}_$AK(t,r){var n;let i=this.constructor,o=i._$Ev.get(t);if(o!==void 0&&this._$El!==o){let a=i.getPropertyOptions(o),s=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?a.converter:mi;this._$El=o,this[o]=s.fromAttribute(r,a.type),this._$El=null}}requestUpdate(t,r,n){let i=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||Aa)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),n.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,n))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((i,o)=>this[o]=i),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(t=this._$ES)===null||t===void 0||t.forEach(i=>{var o;return(o=i.hostUpdate)===null||o===void 0?void 0:o.call(i)}),this.update(n)):this._$Ek()}catch(i){throw r=!1,this._$Ek(),i}r&&this._$AE(n)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var i;return(i=n.hostUpdated)===null||i===void 0?void 0:i.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};le[pi]=!0,le.elementProperties=new Map,le.elementStyles=[],le.shadowRootOptions={mode:"open"},ba?.({ReactiveElement:le}),((di=Pr.reactiveElementVersions)!==null&&di!==void 0?di:Pr.reactiveElementVersions=[]).push("1.6.3");var fi,Cr=window,tt=Cr.trustedTypes,Ea=tt?tt.createPolicy("lit-html",{createHTML:e=>e}):void 0,xi="$lit$",Ae=`lit$${(Math.random()+"").slice(9)}$`,Pa="?"+Ae,El=`<${Pa}>`,Me=document,Ut=()=>Me.createComment(""),Dt=e=>e===null||typeof e!="object"&&typeof e!="function",Ca=Array.isArray,Sl=e=>Ca(e)||typeof e?.[Symbol.iterator]=="function",gi=`[ 	
\f\r]`,Mt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Sa=/-->/g,ya=/>/g,Ve=RegExp(`>|${gi}(?:([^\\s"'>=/]+)(${gi}*=${gi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ta=/'/g,La=/"/g,Na=/^(?:script|style|textarea|title)$/i,Ia=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),g=Ia(1),hm=Ia(2),Ue=Symbol.for("lit-noChange"),D=Symbol.for("lit-nothing"),_a=new WeakMap,$e=Me.createTreeWalker(Me,129,null,!1);function ka(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ea!==void 0?Ea.createHTML(t):t}var yl=(e,t)=>{let r=e.length-1,n=[],i,o=t===2?"<svg>":"",a=Mt;for(let s=0;s<r;s++){let c=e[s],l,h,d=-1,u=0;for(;u<c.length&&(a.lastIndex=u,h=a.exec(c),h!==null);)u=a.lastIndex,a===Mt?h[1]==="!--"?a=Sa:h[1]!==void 0?a=ya:h[2]!==void 0?(Na.test(h[2])&&(i=RegExp("</"+h[2],"g")),a=Ve):h[3]!==void 0&&(a=Ve):a===Ve?h[0]===">"?(a=i??Mt,d=-1):h[1]===void 0?d=-2:(d=a.lastIndex-h[2].length,l=h[1],a=h[3]===void 0?Ve:h[3]==='"'?La:Ta):a===La||a===Ta?a=Ve:a===Sa||a===ya?a=Mt:(a=Ve,i=void 0);let m=a===Ve&&e[s+1].startsWith("/>")?" ":"";o+=a===Mt?c+El:d>=0?(n.push(l),c.slice(0,d)+xi+c.slice(d)+Ae+m):c+Ae+(d===-2?(n.push(void 0),s):m)}return[ka(e,o+(e[r]||"<?>")+(t===2?"</svg>":"")),n]},Gt=class e{constructor({strings:t,_$litType$:r},n){let i;this.parts=[];let o=0,a=0,s=t.length-1,c=this.parts,[l,h]=yl(t,r);if(this.el=e.createElement(l,n),$e.currentNode=this.el.content,r===2){let d=this.el.content,u=d.firstChild;u.remove(),d.append(...u.childNodes)}for(;(i=$e.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes()){let d=[];for(let u of i.getAttributeNames())if(u.endsWith(xi)||u.startsWith(Ae)){let m=h[a++];if(d.push(u),m!==void 0){let x=i.getAttribute(m.toLowerCase()+xi).split(Ae),f=/([.?@])?(.*)/.exec(m);c.push({type:1,index:o,name:f[2],strings:x,ctor:f[1]==="."?bi:f[1]==="?"?Ai:f[1]==="@"?Ei:nt})}else c.push({type:6,index:o})}for(let u of d)i.removeAttribute(u)}if(Na.test(i.tagName)){let d=i.textContent.split(Ae),u=d.length-1;if(u>0){i.textContent=tt?tt.emptyScript:"";for(let m=0;m<u;m++)i.append(d[m],Ut()),$e.nextNode(),c.push({type:2,index:++o});i.append(d[u],Ut())}}}else if(i.nodeType===8)if(i.data===Pa)c.push({type:2,index:o});else{let d=-1;for(;(d=i.data.indexOf(Ae,d+1))!==-1;)c.push({type:7,index:o}),d+=Ae.length-1}o++}}static createElement(t,r){let n=Me.createElement("template");return n.innerHTML=t,n}};function rt(e,t,r=e,n){var i,o,a,s;if(t===Ue)return t;let c=n!==void 0?(i=r._$Co)===null||i===void 0?void 0:i[n]:r._$Cl,l=Dt(t)?void 0:t._$litDirective$;return c?.constructor!==l&&((o=c?._$AO)===null||o===void 0||o.call(c,!1),l===void 0?c=void 0:(c=new l(e),c._$AT(e,r,n)),n!==void 0?((a=(s=r)._$Co)!==null&&a!==void 0?a:s._$Co=[])[n]=c:r._$Cl=c),c!==void 0&&(t=rt(e,c._$AS(e,t.values),c,n)),t}var vi=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:n},parts:i}=this._$AD,o=((r=t?.creationScope)!==null&&r!==void 0?r:Me).importNode(n,!0);$e.currentNode=o;let a=$e.nextNode(),s=0,c=0,l=i[0];for(;l!==void 0;){if(s===l.index){let h;l.type===2?h=new Ht(a,a.nextSibling,this,t):l.type===1?h=new l.ctor(a,l.name,l.strings,this,t):l.type===6&&(h=new Si(a,this,t)),this._$AV.push(h),l=i[++c]}s!==l?.index&&(a=$e.nextNode(),s++)}return $e.currentNode=Me,o}v(t){let r=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,r),r+=n.strings.length-2):n._$AI(t[r])),r++}},Ht=class e{constructor(t,r,n,i){var o;this.type=2,this._$AH=D,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=n,this.options=i,this._$Cp=(o=i?.isConnected)===null||o===void 0||o}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=rt(this,t,r),Dt(t)?t===D||t==null||t===""?(this._$AH!==D&&this._$AR(),this._$AH=D):t!==this._$AH&&t!==Ue&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):Sl(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==D&&Dt(this._$AH)?this._$AA.nextSibling.data=t:this.$(Me.createTextNode(t)),this._$AH=t}g(t){var r;let{values:n,_$litType$:i}=t,o=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Gt.createElement(ka(i.h,i.h[0]),this.options)),i);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===o)this._$AH.v(n);else{let a=new vi(o,this),s=a.u(this.options);a.v(n),this.$(s),this._$AH=a}}_$AC(t){let r=_a.get(t.strings);return r===void 0&&_a.set(t.strings,r=new Gt(t)),r}T(t){Ca(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,n,i=0;for(let o of t)i===r.length?r.push(n=new e(this.k(Ut()),this.k(Ut()),this,this.options)):n=r[i],n._$AI(o),i++;i<r.length&&(this._$AR(n&&n._$AB.nextSibling,i),r.length=i)}_$AR(t=this._$AA.nextSibling,r){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,r);t&&t!==this._$AB;){let i=t.nextSibling;t.remove(),t=i}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},nt=class{constructor(t,r,n,i,o){this.type=1,this._$AH=D,this._$AN=void 0,this.element=t,this.name=r,this._$AM=i,this.options=o,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=D}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,n,i){let o=this.strings,a=!1;if(o===void 0)t=rt(this,t,r,0),a=!Dt(t)||t!==this._$AH&&t!==Ue,a&&(this._$AH=t);else{let s=t,c,l;for(t=o[0],c=0;c<o.length-1;c++)l=rt(this,s[n+c],r,c),l===Ue&&(l=this._$AH[c]),a||(a=!Dt(l)||l!==this._$AH[c]),l===D?t=D:t!==D&&(t+=(l??"")+o[c+1]),this._$AH[c]=l}a&&!i&&this.j(t)}j(t){t===D?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},bi=class extends nt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===D?void 0:t}},Tl=tt?tt.emptyScript:"",Ai=class extends nt{constructor(){super(...arguments),this.type=4}j(t){t&&t!==D?this.element.setAttribute(this.name,Tl):this.element.removeAttribute(this.name)}},Ei=class extends nt{constructor(t,r,n,i,o){super(t,r,n,i,o),this.type=5}_$AI(t,r=this){var n;if((t=(n=rt(this,t,r,0))!==null&&n!==void 0?n:D)===Ue)return;let i=this._$AH,o=t===D&&i!==D||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==D&&(i===D||o);o&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,n;typeof this._$AH=="function"?this._$AH.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,t):this._$AH.handleEvent(t)}},Si=class{constructor(t,r,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){rt(this,t)}};var wa=Cr.litHtmlPolyfillSupport;wa?.(Gt,Ht),((fi=Cr.litHtmlVersions)!==null&&fi!==void 0?fi:Cr.litHtmlVersions=[]).push("2.8.0");var Oa=(e,t,r)=>{var n,i;let o=(n=r?.renderBefore)!==null&&n!==void 0?n:t,a=o._$litPart$;if(a===void 0){let s=(i=r?.renderBefore)!==null&&i!==void 0?i:null;o._$litPart$=a=new Ht(t.insertBefore(Ut(),s),s,void 0,r??{})}return a._$AI(e),a};var yi,Ti;var ie=class extends le{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,r;let n=super.createRenderRoot();return(t=(r=this.renderOptions).renderBefore)!==null&&t!==void 0||(r.renderBefore=n.firstChild),n}update(t){let r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Oa(r,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return Ue}};ie.finalized=!0,ie._$litElement$=!0,(yi=globalThis.litElementHydrateSupport)===null||yi===void 0||yi.call(globalThis,{LitElement:ie});var Ra=globalThis.litElementPolyfillSupport;Ra?.({LitElement:ie});((Ti=globalThis.litElementVersions)!==null&&Ti!==void 0?Ti:globalThis.litElementVersions=[]).push("3.3.3");var Ee="(max-width: 767px)",Nr="(max-width: 1199px)",R="(min-width: 768px)",I="(min-width: 1200px)",G="(min-width: 1600px)";var Va=w`
    :host {
        position: relative;
        display: flex;
        flex-direction: column;
        text-align: start;
        background-color: var(--merch-card-background-color);
        grid-template-columns: repeat(auto-fit, minmax(300px, max-content));
        background-color: var(--merch-card-background-color);
        font-family: var(--merch-body-font-family, 'Adobe Clean');
        border-radius: var(--consonant-merch-spacing-xs);
        border: 1px solid var(--spectrum-gray-200, var(--consonant-merch-card-border-color));
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

    :host(:hover) .invisible,
    :host(:active) .invisible,
    :host(:focus) .invisible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
        cursor: pointer;
    }

    .action-menu.always-visible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
        cursor: pointer;
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
        background-color: var(--merch-color-grey-200);
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
        font-size: 0;
    }
    .hidden {
        visibility: hidden;
    }

    #stock-checkbox,
    .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: 1.3;
        color: var(--merch-color-grey-600);
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
        align-self: center;
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
`,$a=()=>[w`
        /* Tablet */
        @media screen and ${be(R)} {
            :host([size='wide']),
            :host([size='super-wide']) {
                width: 100%;
                grid-column: 1 / -1;
            }
        }

        /* Laptop */
        @media screen and ${be(I)} {
            :host([size='wide']) {
                grid-column: span 2;
            }
        `];var it,zt=class zt{constructor(t){p(this,"card");j(this,it);this.card=t,this.insertVariantStyle()}getContainer(){return fe(this,it,M(this,it)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),M(this,it)}insertVariantStyle(){if(!zt.styleMap[this.card.variant]){zt.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let n=`--consonant-merch-card-${this.card.variant}-${r}-height`,i=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),o=parseInt(this.getContainer().style.getPropertyValue(n))||0;i>o&&this.getContainer().style.setProperty(n,`${i}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),g`
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
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get stripStyle(){if(this.card.backgroundImage){let t=new Image;return t.src=this.card.backgroundImage,t.onload=()=>{t.width>8?this.card.classList.add("wide-strip"):t.width===8&&this.card.classList.add("thin-strip")},`
          background: url("${this.card.backgroundImage}");
          background-size: auto 100%;
          background-repeat: no-repeat;
          background-position: ${this.card.theme.dir==="ltr"?"left":"right"};
        `}return""}get secureLabelFooter(){let t=this.card.secureLabel?g`<span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              >`:"";return g`<footer>${t}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){}};it=new WeakMap,p(zt,"styleMap",{});var P=zt;function he(e,t={},r){let n=document.createElement(e);r instanceof HTMLElement?n.appendChild(r):n.innerHTML=r;for(let[i,o]of Object.entries(t))n.setAttribute(i,o);return n}function Ir(){return window.matchMedia("(max-width: 767px)").matches}function Ma(){return window.matchMedia("(max-width: 1024px)").matches}var Ua="merch-offer-select:ready",Da="merch-card:ready",Ga="merch-card:action-menu-toggle";var Li="merch-storage:change",_i="merch-quantity-selector:change";var ot="aem:load",at="aem:error",Ha="mas:ready",za="mas:error";var Fa=`
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

@media screen and ${R} {
    :root {
      --consonant-merch-card-catalog-width: 302px;
    }

    .two-merch-cards.catalog,
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(2, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${I} {
    :root {
      --consonant-merch-card-catalog-width: 276px;
    }

    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${G} {
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
}`;var Ll={title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"m"},allowedSizes:["wide","super-wide"]},st=class extends P{constructor(r){super(r);p(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(Ga,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});p(this,"toggleActionMenu",r=>{let n=this.card.shadowRoot.querySelector('slot[name="action-menu-content"]');!n||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter"||(r.preventDefault(),n.classList.toggle("hidden"),n.classList.contains("hidden")||this.dispatchActionMenuToggle())});p(this,"toggleActionMenuFromCard",r=>{let n=r?.type==="mouseleave"?!0:void 0,i=this.card.shadowRoot,o=i.querySelector(".action-menu");this.card.blur(),o?.classList.remove("always-visible");let a=i.querySelector('slot[name="action-menu-content"]');a&&(n||this.dispatchActionMenuToggle(),a.classList.toggle("hidden",n))});p(this,"hideActionMenu",r=>{this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')?.classList.add("hidden")});p(this,"focusEventHandler",r=>{let n=this.card.shadowRoot.querySelector(".action-menu");n&&(n.classList.add("always-visible"),(r.relatedTarget?.nodeName==="MERCH-CARD-COLLECTION"||r.relatedTarget?.nodeName==="MERCH-CARD"&&r.target.nodeName!=="MERCH-ICON")&&n.classList.remove("always-visible"))})}get aemFragmentMapping(){return Ll}renderLayout(){return g` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${Ma()&&this.card.actionMenu?"always-visible":""}
                ${this.card.actionMenu?"invisible":"hidden"}"
                        @click="${this.toggleActionMenu}"
                        @keypress="${this.toggleActionMenu}"
                        tabindex="0"
                        role="button"
                    >Action Menu</div>
                </div>
                <slot
                    name="action-menu-content"
                    class="action-menu-content
            ${this.card.actionMenuContent?"":"hidden"}"
                    @focusout="${this.hideActionMenu}"
                    >${this.card.actionMenuContent}
                </slot>
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
            <slot></slot>`}getGlobalCSS(){return Fa}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.addEventListener("focusout",this.focusEventHandler)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.removeEventListener("focusout",this.focusEventHandler)}};p(st,"variantStyle",w`
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
    `);var Ka=`
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

@media screen and ${R} {
  .two-merch-cards.ccd-action,
  .three-merch-cards.ccd-action,
  .four-merch-cards.ccd-action {
      grid-template-columns: repeat(2, var(--consonant-merch-card-ccd-action-width));
  }
}

@media screen and ${I} {
  .three-merch-cards.ccd-action,
  .four-merch-cards.ccd-action {
      grid-template-columns: repeat(3, var(--consonant-merch-card-ccd-action-width));
  }
}

@media screen and ${G} {
  .four-merch-cards.ccd-action {
      grid-template-columns: repeat(4, var(--consonant-merch-card-ccd-action-width));
  }
}
`;var _l={title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},ct=class extends P{constructor(t){super(t)}getGlobalCSS(){return Ka}get aemFragmentMapping(){return _l}renderLayout(){return g` <div class="body">
            <slot name="icons"></slot> ${this.badge}
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            ${this.promoBottom?g`<slot name="body-xs"></slot
                      ><slot name="promo-text"></slot>`:g`<slot name="promo-text"></slot
                      ><slot name="body-xs"></slot>`}
            <footer><slot name="footer"></slot></footer>
            <slot></slot>
        </div>`}};p(ct,"variantStyle",w`
        :host([variant='ccd-action']:not([size])) {
            width: var(--consonant-merch-card-ccd-action-width);
        }
    `);var Ba=`
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${R} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${I} {
  :root {
    --consonant-merch-card-image-width: 378px;
  }
    
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(3, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${G} {
  .four-merch-cards.image {
      grid-template-columns: repeat(4, var(--consonant-merch-card-image-width));
  }
}
`;var kr=class extends P{constructor(t){super(t)}getGlobalCSS(){return Ba}renderLayout(){return g`${this.cardImage}
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
          `}`}};var ja=`
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${R} {
  .two-merch-cards.inline-heading,
  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${I} {
  :root {
    --consonant-merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${G} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var Or=class extends P{constructor(t){super(t)}getGlobalCSS(){return ja}renderLayout(){return g` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":g`<hr />`} ${this.secureLabelFooter}`}};var Ya=`
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
    margin-block: 0px;
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
@media screen and ${Ee} {
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

@media screen and ${Nr} {
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
@media screen and ${R} {
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
@media screen and ${I} {
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

@media screen and ${G} {
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
`;var wl=32,lt=class extends P{constructor(r){super(r);p(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);p(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?g`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:g`<slot name="secure-transaction-label"></slot>`;return g`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return Ya}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section"),["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content"].forEach(i=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${i}"]`),i)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let n=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");n&&n.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;[...this.card.querySelector('[slot="footer-rows"]')?.children].forEach((n,i)=>{let o=Math.max(wl,parseFloat(window.getComputedStyle(n).height)||0),a=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(i+1)))||0;o>a&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(i+1),`${o}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(n=>{let i=n.querySelector(".footer-row-cell-description");i&&!i.textContent.trim()&&n.remove()})}renderLayout(){return g` <div class="top-section${this.badge?" badge":""}">
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
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){Ir()?this.removeEmptyRows():(await Promise.all(this.card.prices.map(r=>r.onceSettled())),this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};p(lt,"variantStyle",w`
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

    @media screen and ${be(Nr)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${be(I)} {
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
  `);var Xa=`
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
@media screen and ${R} {
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
@media screen and ${I} {
  :root {
    --consonant-merch-card-plans-width: 276px;
  }
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(3, var(--consonant-merch-card-plans-width));
  }
}

/* Large desktop */
    @media screen and ${G} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
}
`;var ht=class extends P{constructor(t){super(t)}getGlobalCSS(){return Xa}postCardUpdateHook(){this.adjustTitleWidth()}get stockCheckbox(){return this.card.checkboxLabel?g`<label id="stock-checkbox">
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
        ${this.secureLabelFooter}`}};p(ht,"variantStyle",w`
    :host([variant='plans']) {
      min-height: 348px;
    }
      
    :host([variant='plans']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);var Wa=`
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
@media screen and ${R} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${I} {
  :root {
    --consonant-merch-card-product-width: 378px;
  }
    
  .three-merch-cards.product,
  .four-merch-cards.product {
      grid-template-columns: repeat(3, var(--consonant-merch-card-product-width));
  }
}

/* Large desktop */
@media screen and ${G} {
  .four-merch-cards.product {
      grid-template-columns: repeat(4, var(--consonant-merch-card-product-width));
  }
}
`;var De=class extends P{constructor(t){super(t)}getGlobalCSS(){return Wa}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return g` ${this.badge}
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
      ${this.secureLabelFooter}`}connectedCallbackHook(){super.connectedCallbackHook(),window.addEventListener("resize",this.postCardUpdateHook.bind(this))}postCardUpdateHook(){Ir()||this.adjustProductBodySlots(),this.adjustTitleWidth()}};p(De,"variantStyle",w`
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
      
    :host([variant='product']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);var qa=`
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
@media screen and ${Ee} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
}

@media screen and ${R} {
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
@media screen and ${I} {
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
`;var dt=class extends P{constructor(t){super(t)}getGlobalCSS(){return qa}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return g` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":g`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?g`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};p(dt,"variantStyle",w`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);var Za=`
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

@media screen and ${Ee} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${R} {
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
@media screen and ${I} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

@media screen and ${G} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var Pl={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},ut=class extends P{constructor(t){super(t)}getGlobalCSS(){return Za}get headingSelector(){return'[slot="detail-m"]'}get aemFragmentMapping(){return Pl}renderLayout(){return g`${this.cardImage}
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
            <slot></slot>`}};p(ut,"variantStyle",w`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);var Ja=`
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

@media screen and ${Ee} {
  :root {
    --consonant-merch-card-twp-width: 300px;
  }
  .one-merch-card.twp,
  .two-merch-cards.twp,
  .three-merch-cards.twp {
      grid-template-columns: repeat(1, var(--consonant-merch-card-twp-mobile-width));
  }
}

@media screen and ${R} {
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
  
@media screen and ${I} {
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

@media screen and ${G} {
    .one-merch-card.twp
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
  }
}
`;var mt=class extends P{constructor(t){super(t)}getGlobalCSS(){return Ja}renderLayout(){return g`${this.badge}
      <div class="top-section">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xs-top"></slot>
      </div>
      <div class="body">
          <slot name="body-xs"></slot>
      </div>
      <footer><slot name="footer"></slot></footer>`}};p(mt,"variantStyle",w`
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
  `);var Qa=`
:root {
  --merch-card-ccd-suggested-width: 305px;
  --merch-card-ccd-suggested-height: 205px;
  --merch-card-ccd-suggested-background-img-size: 119px;
}

sp-theme[color='light'] merch-card[variant="ccd-suggested"] {
  background-color: var(--ccd-gray-100-light, #F8F8F8);
  color: var(--ccd-gray-700-dark, #464646);
  border: 1px solid var(--ccd-gray-200-light, #E6E6E6);
}

sp-theme[color='light'] merch-card[variant="ccd-suggested"] [slot="body-xs"] {
  color: var(--ccd-gray-700-dark, #464646);
}

sp-theme[color='dark'] merch-card[variant="ccd-suggested"] [slot="body-xs"] {
  color: var(--ccd-gray-100-light, #F8F8F8);
}

sp-theme[color='dark'] merch-card[variant="ccd-suggested"] {
  background-color: var(--ccd-gray-800-dark, #222);
  color: var(--ccd-gray-100-light, #F8F8F8);
  border: 1px solid var(--ccd-gray-700-dark, #464646);
}

merch-card[variant="ccd-suggested"] [slot="detail-s"] {
  color: var(--merch-color-grey-60);
}

merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
  color: var(--spectrum-gray-800, #F8F8F8);
  font-size: var(--merch-card-heading-xxs-font-size);
  line-height: var(--merch-card-heading-xxs-line-height);
}

merch-card[variant="ccd-suggested"] [slot="body-xs"] a {
  font-size: var(--consonant-merch-card-body-xxs-font-size);
  line-height: var(--consonant-merch-card-body-xxs-line-height);
  text-decoration: underline;
  color: var(--spectrum-blue-800, var(--color-accent));
}

merch-card[variant="ccd-suggested"] [slot="price"] span.placeholder-resolved[data-template="priceStrikethrough"],
merch-card[variant="ccd-suggested"] [slot="price"] span.placeholder-resolved[data-template="strikethrough"] {
  text-decoration: line-through;
  color: var(--ccd-gray-600-light, var(--merch-color-grey-60));
}

merch-card[variant="ccd-suggested"] [slot="cta"] a {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: normal;
  text-decoration: none;
  color: var(--spectrum-gray-800, var(--merch-color-grey-80));
  font-weight: 700;
}

sp-theme[color='dark'] merch-card[variant="ccd-suggested"] [slot="cta"] sp-button[treatment="outline"] {
  color: var(--ccd-gray-200-light, #E6E6E6);
  border: 2px solid var(--ccd-gray-200-light, #E6E6E6);
}
`;var Cl={mnemonics:{size:"l"},subtitle:{tag:"h4",slot:"detail-s"},title:{tag:"h3",slot:"heading-xs"},prices:{tag:"p",slot:"price"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"cta",size:"m"}},pt=class extends P{getGlobalCSS(){return Qa}get aemFragmentMapping(){return Cl}renderLayout(){return g`
          <div style="${this.stripStyle}" class="body">
              <div class="header">
                <div class="top-section">
                  <slot name="icons"></slot> 
                  ${this.badge}
                </div>
                <div class="headings">
                  <slot name="detail-s"></slot>
                  <slot name="heading-xs"></slot>
                </div>
              </div>
              <slot name="body-xs"></slot>
              <div class="footer">
                <slot name="price"></slot>
                <slot name="cta"></slot>
              </div>
          </div>
                <slot></slot>`}};p(pt,"variantStyle",w`
    :host([variant='ccd-suggested']) {
      width: var(--merch-card-ccd-suggested-width);
      min-width: var(--merch-card-ccd-suggested-width);
      min-height: var(--merch-card-ccd-suggested-height);
      border-radius: 4px;
      display: flex;
      flex-flow: wrap;
      overflow: hidden;
    }

    :host([variant='ccd-suggested']) .body {
      height: auto;
      padding: 20px;
      gap: 0;
    }

    :host([variant='ccd-suggested'].thin-strip) .body {
      padding: 20px 20px 20px 28px;
    }

    :host([variant='ccd-suggested']) .header {
      display: flex;
      flex-flow: wrap;
      place-self: flex-start;
      flex-wrap: nowrap;
    }

    :host([variant='ccd-suggested']) .headings {
      padding-inline-start: var(--consonant-merch-spacing-xxs);
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    :host([variant='ccd-suggested']) ::slotted([slot='icons']) {
      place-self: center;
    }

    :host([variant='ccd-suggested']) ::slotted([slot='heading-xs']) {
      font-size: var(--merch-card-heading-xxs-font-size);
      line-height: var(--merch-card-heading-xxs-line-height);
    }
    
    :host([variant='ccd-suggested']) ::slotted([slot='detail-m']) {
      line-height: var(--consonant-merch-card-detail-m-line-height);
    }

    :host([variant='ccd-suggested']) ::slotted([slot='body-xs']) {
      color: var(--ccd-gray-700-dark, #464646);
      padding-top: 6px;
    }
    
    :host([variant='ccd-suggested'].wide-strip) ::slotted([slot='body-xs']) {
      padding-inline-start: 48px;
    }

    :host([variant='ccd-suggested'].wide-strip) ::slotted([slot='price']) {
      padding-inline-start: 48px;
    }

    :host([variant='ccd-suggested']) ::slotted([slot='price']) {
      display: flex;
      align-items: center;
      color: var(--spectrum-gray-800, #F8F8F8);
      font-size: var(--consonant-merch-card-body-xs-font-size);
      line-height: var(--consonant-merch-card-body-xs-line-height);
      min-width: fit-content;
    }
    
    :host([variant='ccd-suggested']) ::slotted([slot='price']) span.placeholder-resolved[data-template="priceStrikethrough"] {
      text-decoration: line-through;
    }

    :host([variant='ccd-suggested']) ::slotted([slot='cta']) {
      display: flex;
      align-items: center;
      min-width: fit-content;
    }

    :host([variant='ccd-suggested']) .footer {
      display: flex;
      justify-content: space-between;
      flex-grow: 0;
      margin-top: auto;
      align-items: center;
    }

    :host([variant='ccd-suggested']) div[class$='-badge'] {
      position: static;
      border-radius: 4px;
    }

    :host([variant='ccd-suggested']) .top-section {
      align-items: center;
    }
  `);var es=`
:root {
  --consonant-merch-card-ccd-slice-single-width: 322px;
  --consonant-merch-card-ccd-slice-icon-size: 30px;
  --consonant-merch-card-ccd-slice-wide-width: 600px;
  --consonant-merch-card-ccd-slice-single-height: 154px;
  --consonant-merch-card-ccd-slice-background-img-size: 119px;
}
sp-theme[color='light'] merch-card[variant="ccd-slice"] {
  background-color: var(--ccd-gray-100-light, #F8F8F8);
  color: var(--ccd-gray-800-dark, #222);
  border: 1px solid var(--ccd-gray-200-light, #E6E6E6)
}
  
sp-theme[color='dark'] merch-card[variant="ccd-slice"] {
  background-color: var(--ccd-gray-800-dark, #222);
  color: var(--ccd-gray-100-light, #F8F8F8);
  border: 1px solid var(--ccd-gray-700-dark, #464646);
}

merch-card[variant="ccd-slice"] [slot='body-s'] a:not(.con-button) {
  font-size: var(--consonant-merch-card-body-xxs-font-size);
  font-style: normal;
  font-weight: 400;
  line-height: var(--consonant-merch-card-body-xxs-line-height);
  text-decoration-line: underline;
  color: var(--spectrum-gray-800, var(--merch-color-grey-80));
}

merch-card[variant="ccd-slice"] [slot="body-s"] span.placeholder-resolved[data-template="priceStrikethrough"],
merch-card[variant="ccd-slice"] [slot="body-s"] span.placeholder-resolved[data-template="strikethrough"] {
  text-decoration: line-through;
  color: var(--ccd-gray-600-light, var(--merch-color-grey-60));
}

merch-card[variant="ccd-slice"] [slot='image'] img {
  overflow: hidden;
  border-radius: 50%;
}
`;var Nl={mnemonics:{size:"m"},backgroundImage:{tag:"div",slot:"image"},description:{tag:"div",slot:"body-s"},ctas:{slot:"footer",size:"s"},allowedSizes:["wide"]},ft=class extends P{getGlobalCSS(){return es}get aemFragmentMapping(){return Nl}renderLayout(){return g` <div class="content">
                <div class="top-section">
                  <slot name="icons"></slot> 
                  ${this.badge}
                </div>  
                <slot name="body-s"></slot>
                <slot name="footer"></slot>
            </div>
            <slot name="image"></slot>
            <slot></slot>`}};p(ft,"variantStyle",w`
        :host([variant='ccd-slice']) {
            min-width: var(--consonant-merch-card-ccd-slice-single-width);
            max-width: var(--consonant-merch-card-ccd-slice-single-width);
            max-height: var(--consonant-merch-card-ccd-slice-single-height);
            height: var(--consonant-merch-card-ccd-slice-single-height);
            border: 1px solid var(--spectrum-gray-700);
            border-radius: 4px;
            display: flex;
            flex-flow: wrap;
        }

        :host([variant='ccd-slice']) ::slotted([slot='body-s']) {
            font-size: var(--consonant-merch-card-body-xs-font-size);
            line-height: var(--consonant-merch-card-body-xxs-line-height);
            max-width: 154px;
        }

        :host([variant='ccd-slice'][size='wide']) ::slotted([slot='body-s']) {
          max-width: 425px;
        }

        :host([variant='ccd-slice'][size='wide']) {
            width: var(--consonant-merch-card-ccd-slice-wide-width);
            max-width: var(--consonant-merch-card-ccd-slice-wide-width);
        }

        :host([variant='ccd-slice']) .content {
            display: flex;
            gap: var(--consonant-merch-spacing-xxs);
            padding: 15px;
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
            color: var(--spectrum-gray-800, var(--merch-color-grey-80));
        }

        :host([variant='ccd-slice']) ::slotted([slot='image']) {
            display: flex;
            justify-content: center;
            flex-shrink: 0;
            width: var(--consonant-merch-card-ccd-slice-background-img-size);
            height: var(--consonant-merch-card-ccd-slice-background-img-size);
            overflow: hidden;
            border-radius: 50%;
            padding: 15px;
            align-self: center;
            padding-inline-start: 0;
        }

        :host([variant='ccd-slice']) ::slotted([slot='image']) img {
            overflow: hidden;
            border-radius: 50%;
            width: inherit;
            height: inherit;
        }

        :host([variant='ccd-slice']) div[class$='-badge'] {
            font-size: var(--consonant-merch-card-body-xxs-font-size);
            position: static;
            border-radius: 4px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            padding: 4px 9px;
        }

        :host([variant='ccd-slice']) .top-section {
            align-items: center;
            gap: 8px;
        }
    `);var wi=(e,t=!1)=>{switch(e.variant){case"catalog":return new st(e);case"ccd-action":return new ct(e);case"image":return new kr(e);case"inline-heading":return new Or(e);case"mini-compare-chart":return new lt(e);case"plans":return new ht(e);case"product":return new De(e);case"segment":return new dt(e);case"special-offers":return new ut(e);case"twp":return new mt(e);case"ccd-suggested":return new pt(e);case"ccd-slice":return new ft(e);default:return t?void 0:new De(e)}},ts=()=>{let e=[];return e.push(st.variantStyle),e.push(ct.variantStyle),e.push(lt.variantStyle),e.push(De.variantStyle),e.push(ht.variantStyle),e.push(dt.variantStyle),e.push(ut.variantStyle),e.push(mt.variantStyle),e.push(pt.variantStyle),e.push(ft.variantStyle),e};var rs=document.createElement("style");rs.innerHTML=`
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

    /* Fonts */
    --merch-body-font-family: 'Adobe Clean', adobe-clean, 'Trebuchet MS', sans-serif;

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
    --merch-card-detail-s-font-size: 11px;
    --merch-card-detail-s-line-height: 14px;
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
    --merch-color-grey-10: #f6f6f6;
    --merch-color-grey-60: #6D6D6D;
    --merch-color-grey-80: #2c2c2c;
    --merch-color-grey-200: #E8E8E8;
    --merch-color-grey-600: #686868;
    --merch-color-green-promo: #2D9D78;

    /* ccd colors */
    --ccd-gray-100-light: #F8F8F8;
    --ccd-gray-200-light: #E6E6E6;
    --ccd-gray-800-dark: #222;
    --ccd-gray-700-dark: #464646;
    --ccd-gray-600-light: #6D6D6D;
    --ccd-gray-200-dark: #3F3F3F;
    
    
    

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
    align-items: normal;
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

merch-card [slot^='heading-'] {
    color: var(--spectrum-gray-800, var(--merch-color-grey-80));
    font-weight: 700;
}

merch-card [slot='heading-xs'] {
    font-size: var(--consonant-merch-card-heading-xs-font-size);
    line-height: var(--consonant-merch-card-heading-xs-line-height);
    margin: 0;
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
}

merch-card [slot='heading-m'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    margin: 0;
}

merch-card [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    padding: 0 var(--consonant-merch-spacing-s);
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
}

merch-card [slot='heading-xl'] {
    font-size: var(--consonant-merch-card-heading-xl-font-size);
    line-height: var(--consonant-merch-card-heading-xl-line-height);
    margin: 0;
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

merch-card [slot='detail-s'] {
    font-size: var(--merch-card-detail-s-font-size);
    line-height: var(--merch-card-detail-s-line-height);
    letter-spacing: 0.66px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--spectrum-gray-600, var(--merch-color-grey-600));
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
    margin: 0;
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-xs"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-m"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
    line-height: var(--consonant-merch-card-body-m-line-height);
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-l"] {
    font-size: var(--consonant-merch-card-body-l-font-size);
    line-height: var(--consonant-merch-card-body-l-line-height);
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-xl"] {
    font-size: var(--consonant-merch-card-body-xl-font-size);
    line-height: var(--consonant-merch-card-body-xl-line-height);
    color: var(--merch-color-grey-80);
}

merch-card a.primary-link {
    color: var(--spectrum-global-color-blue-700);
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
`;document.head.appendChild(rs);var Il="#000000",kl="#F8D904",Ol=/(accent|primary|secondary)(-(outline|link))?/;function Rl(e){return e.fields.reduce((t,{name:r,multiple:n,values:i})=>(t[r]=n?i:i[0],t),{id:e.id})}function Vl(e,t,r){let n=e.mnemonicIcon?.map((i,o)=>({icon:i,alt:e.mnemonicAlt[o]??"",link:e.mnemonicLink[o]??""}));return n?.forEach(({icon:i,alt:o,link:a})=>{if(!/^https?:/.test(a))try{a=new URL(`https://${a}`).href.toString()}catch{a="#"}let s=he("merch-icon",{slot:"icons",src:i,alt:o,href:a,size:r.mnemonics?.size??"l"});t.append(s)}),n}function $l(e,t){e.badge&&(t.setAttribute("badge-text",e.badge),t.setAttribute("badge-color",e.badgeColor||Il),t.setAttribute("badge-background-color",e.badgeBackgroundColor||kl))}function Ml(e,t,r){r?.includes(e.size)&&t.setAttribute("size",e.size)}function Ul(e,t,r){e.cardTitle&&r&&t.append(he(r.tag,{slot:r.slot},e.cardTitle))}function Dl(e,t,r){e.subtitle&&r&&t.append(he(r.tag,{slot:r.slot},e.subtitle))}function Gl(e,t,r,n){if(e.backgroundImage)switch(n){case"ccd-slice":r&&t.append(he(r.tag,{slot:r.slot},`<img loading="lazy" src="${e.backgroundImage}" />`));break;case"ccd-suggested":t.setAttribute("background-image",e.backgroundImage);break}}function Hl(e,t,r){if(e.prices&&r){let n=he(r.tag,{slot:r.slot},e.prices);t.append(n)}}function zl(e,t,r){if(e.description&&r){let n=he(r.tag,{slot:r.slot},e.description);t.append(n)}}function Fl(e,t,r,n){n==="ccd-suggested"&&!e.className&&(e.className="primary-link");let i=Ol.exec(e.className)?.[0]??"accent",o=i.includes("accent"),a=i.includes("primary"),s=i.includes("secondary"),c=i.includes("-outline");if(i.includes("-link"))return e;let h="fill",d;o||t?d="accent":a?d="primary":s&&(d="secondary"),c&&(h="outline");let u=he("sp-button",{treatment:h,variant:d,tabIndex:-1,size:r.ctas.size??"m"},e);return u.addEventListener("click",m=>{m.target!==e&&(m.stopPropagation(),e.click())}),u}function Kl(e,t){return e.classList.add("con-button"),t&&e.classList.add("blue"),e}function Bl(e,t,r,n){if(e.ctas){let{slot:i}=r.ctas,o=he("div",{slot:i},e.ctas),a=[...o.querySelectorAll("a")].map(s=>{let c=s.parentElement.tagName==="STRONG";return t.consonant?Kl(s,c):Fl(s,c,r,n)});o.innerHTML="",o.append(...a),t.append(o)}}async function ns(e,t){let r=Rl(e),{variant:n}=r;if(!n)return;t.querySelectorAll("[slot]").forEach(a=>{a.remove()}),t.removeAttribute("background-image"),t.removeAttribute("badge-background-color"),t.removeAttribute("badge-color"),t.removeAttribute("badge-text"),t.removeAttribute("size"),t.variant=n,await t.updateComplete;let{aemFragmentMapping:i}=t.variantLayout;if(!i)return;let o=Vl(r,t,i);e.computed={mnemonics:o},$l(r,t),Ml(r,t,i.allowedSizes),Ul(r,t,i.title),Dl(r,t,i.subtitle),Gl(r,t,i.backgroundImage,n),Hl(r,t,i.prices),zl(r,t,i.description),Bl(r,t,i,n)}var jl="merch-card",Yl=2e3,Ci,Kt,Pi,Ft=class extends ie{constructor(){super();j(this,Kt);p(this,"customerSegment");p(this,"marketSegment");p(this,"variantLayout");j(this,Ci,!1);this.filters={},this.types="",this.selected=!1,this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this)}firstUpdated(){this.variantLayout=wi(this,!1),this.variantLayout?.connectedCallbackHook(),this.aemFragment?.updateComplete.catch(()=>{this.style.display="none"})}willUpdate(r){(r.has("variant")||!this.variantLayout)&&(this.variantLayout=wi(this),this.variantLayout.connectedCallbackHook())}updated(r){(r.has("badgeBackgroundColor")||r.has("borderColor"))&&(this.style.border=this.computedBorderStyle),this.variantLayout?.postCardUpdateHook(this)}get theme(){return this.closest("sp-theme")}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["twp","ccd-slice","ccd-suggested"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}async toggleStockOffer({target:r}){if(!this.stockOfferOsis)return;let n=this.checkoutLinks;if(n.length!==0)for(let i of n){await i.onceSettled();let o=i.value?.[0]?.planType;if(!o)return;let a=this.stockOfferOsis[o];if(!a)return;let s=i.dataset.wcsOsi.split(",").filter(c=>c!==a);r.checked&&s.push(a),i.dataset.wcsOsi=s.join(",")}}handleQuantitySelection(r){let n=this.checkoutLinks;for(let i of n)i.dataset.quantity=r.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(r){let n={...this.filters};Object.keys(n).forEach(i=>{if(r){n[i].order=Math.min(n[i].order||2,2);return}let o=n[i].order;o===1||isNaN(o)||(n[i].order=Number(o)+1)}),this.filters=n}includes(r){return this.textContent.match(new RegExp(r,"i"))!==null}connectedCallback(){super.connectedCallback(),this.addEventListener(_i,this.handleQuantitySelection),this.addEventListener(Ua,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.storageOptions?.addEventListener("change",this.handleStorageChange),this.addEventListener(at,this.handleAemFragmentEvents),this.addEventListener(ot,this.handleAemFragmentEvents),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout.disconnectedCallbackHook(),this.removeEventListener(_i,this.handleQuantitySelection),this.storageOptions?.removeEventListener(Li,this.handleStorageChange),this.removeEventListener(at,this.handleAemFragmentEvents),this.removeEventListener(ot,this.handleAemFragmentEvents)}async handleAemFragmentEvents(r){if(r.type===at&&ze(this,Kt,Pi).call(this,"AEM fragment cannot be loaded"),r.type===ot&&r.target.nodeName==="AEM-FRAGMENT"){let n=r.detail;await ns(n,this),this.checkReady()}}async checkReady(){let r=Promise.all([...this.querySelectorAll('span[is="inline-price"][data-wcs-osi],a[is="checkout-link"][data-wcs-osi]')].map(o=>o.onceSettled().catch(()=>o))).then(o=>o.every(a=>a.classList.contains("placeholder-resolved"))),n=new Promise(o=>setTimeout(()=>o(!1),Yl));if(await Promise.race([r,n])===!0){this.dispatchEvent(new CustomEvent(Ha,{bubbles:!0,composed:!0}));return}ze(this,Kt,Pi).call(this,"Contains unresolved offers")}get aemFragment(){return this.querySelector("aem-fragment")}get storageOptions(){return this.querySelector("sp-radio-group#storage")}get storageSpecificOfferSelect(){let r=this.storageOptions?.selected;if(r){let n=this.querySelector(`merch-offer-select[storage="${r}"]`);if(n)return n}return this.querySelector("merch-offer-select")}get offerSelect(){return this.storageOptions?this.storageSpecificOfferSelect:this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||this.dispatchEvent(new CustomEvent(Da,{bubbles:!0}))}handleStorageChange(){let r=this.closest("merch-card")?.offerSelect.cloneNode(!0);r&&this.dispatchEvent(new CustomEvent(Li,{detail:{offerSelect:r},bubbles:!0}))}get dynamicPrice(){return this.querySelector('[slot="price"]')}selectMerchOffer(r){if(r===this.merchOffer)return;this.merchOffer=r;let n=this.dynamicPrice;if(r.price&&n){let i=r.price.cloneNode(!0);n.onceSettled?n.onceSettled().then(()=>{n.replaceWith(i)}):n.replaceWith(i)}}};Ci=new WeakMap,Kt=new WeakSet,Pi=function(r){this.dispatchEvent(new CustomEvent(za,{detail:r,bubbles:!0,composed:!0}))},p(Ft,"properties",{name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:r=>{let[n,i,o]=r.split(",");return{PUF:n,ABM:i,M2M:o}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:r=>Object.fromEntries(r.split(",").map(n=>{let[i,o,a]=n.split(":"),s=Number(o);return[i,{order:isNaN(s)?void 0:s,size:a}]})),toAttribute:r=>Object.entries(r).map(([n,{order:i,size:o}])=>[n,i,o].filter(a=>a!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object}}),p(Ft,"styles",[Va,ts(),...$a()]);customElements.define(jl,Ft);var gt=class extends ie{constructor(){super(),this.size="m",this.alt=""}render(){let{href:t}=this;return t?g`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="lazy" />
              </a>`:g` <img src="${this.src}" alt="${this.alt}" loading="lazy" />`}};p(gt,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0}}),p(gt,"styles",w`
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

        :host([size='m']) {
            --img-width: 30px;
            --img-height: 30px;
        }

        :host([size='l']) {
            --img-width: 40px;
            --img-height: 40px;
        }

        img {
            width: var(--img-width);
            height: var(--img-height);
        }
    `);customElements.define("merch-icon",gt);async function Xl(e){let t=e.headers.get("Etag"),r=await e.json();return r.etag=t,r}async function is(e,t,r){let n=await fetch(`${e}/adobe/sites/cf/fragments/${t}`,{headers:r});if(!n.ok)throw new Error(`Failed to get fragment: ${n.status} ${n.statusText}`);return await Xl(n)}var as=new CSSStyleSheet;as.replaceSync(":host { display: contents; }");var Wl=document.querySelector('meta[name="aem-base-url"]')?.content??"https://odin.adobe.com",os="fragment",ql="ims",Ni,Se,Ii=class{constructor(){j(this,Se,new Map)}clear(){M(this,Se).clear()}add(...t){t.forEach(r=>{let{id:n}=r;n&&M(this,Se).set(n,r)})}has(t){return M(this,Se).has(t)}get(t){return M(this,Se).get(t)}remove(t){M(this,Se).delete(t)}};Se=new WeakMap;var Rr=new Ii,de,Bt,Oi,ki=class extends HTMLElement{constructor(){super();j(this,Bt);p(this,"cache",Rr);p(this,"data");p(this,"fragmentId");p(this,"consonant",!1);p(this,"ims",!1);j(this,de);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[as];let r=this.getAttribute(ql);["",!0].includes(r)?(this.ims=!0,Ni||(Ni={Authorization:`Bearer ${window.adobeid?.authorize?.()}`,pragma:"no-cache","cache-control":"no-cache"})):this.ims=!1}static get observedAttributes(){return[os]}attributeChangedCallback(r,n,i){r===os&&(this.fragmentId=i,this.refresh(!1))}connectedCallback(){if(!this.fragmentId){ze(this,Bt,Oi).call(this,"Missing fragment id");return}}async refresh(r=!0){M(this,de)&&!await Promise.race([M(this,de),Promise.resolve(!1)])||(r&&Rr.remove(this.fragmentId),fe(this,de,this.fetchData().then(()=>(this.dispatchEvent(new CustomEvent(ot,{detail:this.data,bubbles:!0,composed:!0})),!0)).catch(()=>(ze(this,Bt,Oi).call(this,"Network error: failed to load fragment"),fe(this,de,null),!1))),M(this,de))}async fetchData(){let r=Rr.get(this.fragmentId);r||(r=await is(Wl,this.fragmentId,this.ims?Ni:void 0),Rr.add(r)),this.data=r}get updateComplete(){return M(this,de)??Promise.reject(new Error("AEM fragment cannot be loaded"))}};de=new WeakMap,Bt=new WeakSet,Oi=function(r){this.classList.add("error"),this.dispatchEvent(new CustomEvent(at,{detail:r,bubbles:!0,composed:!0}))};customElements.define("aem-fragment",ki);
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
