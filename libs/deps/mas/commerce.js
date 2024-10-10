<<<<<<< HEAD
var Zn=Object.create;var Xe=Object.defineProperty;var Jn=Object.getOwnPropertyDescriptor;var Qn=Object.getOwnPropertyNames;var ei=Object.getPrototypeOf,ti=Object.prototype.hasOwnProperty;var ri=(e,t,n)=>t in e?Xe(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var ni=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),ii=(e,t)=>{for(var n in t)Xe(e,n,{get:t[n],enumerable:!0})},ai=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Qn(t))!ti.call(e,i)&&i!==n&&Xe(e,i,{get:()=>t[i],enumerable:!(r=Jn(t,i))||r.enumerable});return e};var oi=(e,t,n)=>(n=e!=null?Zn(ei(e)):{},ai(t||!e||!e.__esModule?Xe(n,"default",{value:e,enumerable:!0}):n,e));var G=(e,t,n)=>(ri(e,typeof t!="symbol"?t+"":t,n),n),wr=(e,t,n)=>{if(!t.has(e))throw TypeError("Cannot "+n)};var yt=(e,t,n)=>(wr(e,t,"read from private field"),n?n.call(e):t.get(e)),kr=(e,t,n)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,n)},Pt=(e,t,n,r)=>(wr(e,t,"write to private field"),r?r.call(e,n):t.set(e,n),n);var Yn=ni((Ol,ro)=>{ro.exports={total:38,offset:0,limit:38,data:[{lang:"ar",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u0627\u0644\u0634\u0647\u0631} YEAR {/\u0627\u0644\u0639\u0627\u0645} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u0643\u0644 \u0634\u0647\u0631} YEAR {\u0643\u0644 \u0639\u0627\u0645} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0644\u0643\u0644 \u062A\u0631\u062E\u064A\u0635} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0644\u0643\u0644 \u062A\u0631\u062E\u064A\u0635} other {}}",freeLabel:"\u0645\u062C\u0627\u0646\u064B\u0627",freeAriaLabel:"\u0645\u062C\u0627\u0646\u064B\u0627",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u0623\u0648 \u0628\u062F\u0644\u0627\u064B \u0645\u0646 \u0630\u0644\u0643 \u0628\u0642\u064A\u0645\u0629 {alternativePrice}",strikethroughAriaLabel:"\u0628\u0634\u0643\u0644 \u0645\u0646\u062A\u0638\u0645 \u0628\u0642\u064A\u0645\u0629 {strikethroughPrice}"},{lang:"bg",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u043C\u0435\u0441.} YEAR {/\u0433\u043E\u0434.} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u043D\u0430 \u043C\u0435\u0441\u0435\u0446} YEAR {\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u043D\u0430 \u043B\u0438\u0446\u0435\u043D\u0437} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u043D\u0430 \u043B\u0438\u0446\u0435\u043D\u0437} other {}}",freeLabel:"\u0411\u0435\u0437\u043F\u043B\u0430\u0442\u043D\u043E",freeAriaLabel:"\u0411\u0435\u0437\u043F\u043B\u0430\u0442\u043D\u043E",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u0410\u043B\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u043E \u043D\u0430 {alternativePrice}",strikethroughAriaLabel:"\u0420\u0435\u0434\u043E\u0432\u043D\u043E \u043D\u0430 {strikethroughPrice}"},{lang:"cs",recurrenceLabel:"{recurrenceTerm, select, MONTH {/m\u011Bs\xEDc} YEAR {/rok} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {za m\u011Bs\xEDc} YEAR {za rok} other {}}",perUnitLabel:"{perUnit, select, LICENSE {za licenci} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {za licenci} other {}}",freeLabel:"Zdarma",freeAriaLabel:"Zdarma",taxExclusiveLabel:"{taxTerm, select, GST {bez dan\u011B ze zbo\u017E\xED a slu\u017Eeb} VAT {bez DPH} TAX {bez dan\u011B} IVA {bez IVA} SST {bez SST} KDV {bez KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {v\u010Detn\u011B dan\u011B ze zbo\u017E\xED a slu\u017Eeb} VAT {v\u010Detn\u011B DPH} TAX {v\u010Detn\u011B dan\u011B} IVA {v\u010Detn\u011B IVA} SST {v\u010Detn\u011B SST} KDV {v\u010Detn\u011B KDV} other {}}",alternativePriceAriaLabel:"P\u0159\xEDpadn\u011B za {alternativePrice}",strikethroughAriaLabel:"Pravideln\u011B za {strikethroughPrice}"},{lang:"da",recurrenceLabel:"{recurrenceTerm, select, MONTH {/md} YEAR {/\xE5r} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {pr. m\xE5ned} YEAR {pr. \xE5r} other {}}",perUnitLabel:"{perUnit, select, LICENSE {pr. licens} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {pr. licens} other {}}",freeLabel:"Gratis",freeAriaLabel:"Gratis",taxExclusiveLabel:"{taxTerm, select, GST {ekskl. GST} VAT {ekskl. moms} TAX {ekskl. skat} IVA {ekskl. IVA} SST {ekskl. SST} KDV {ekskl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. skat} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativt til {alternativePrice}",strikethroughAriaLabel:"Normalpris {strikethroughPrice}"},{lang:"de",recurrenceLabel:"{recurrenceTerm, select, MONTH {/Monat} YEAR {/Jahr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {pro Monat} YEAR {pro Jahr} other {}}",perUnitLabel:"{perUnit, select, LICENSE {pro Lizenz} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {pro Lizenz} other {}}",freeLabel:"Kostenlos",freeAriaLabel:"Kostenlos",taxExclusiveLabel:"{taxTerm, select, GST {zzgl. GST} VAT {zzgl. MwSt.} TAX {zzgl. Steuern} IVA {zzgl. IVA} SST {zzgl. SST} KDV {zzgl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. MwSt.} TAX {inkl. Steuern} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativ: {alternativePrice}",strikethroughAriaLabel:"Regul\xE4r: {strikethroughPrice}"},{lang:"en",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at {alternativePrice}",strikethroughAriaLabel:"Regularly at {strikethroughPrice}"},{lang:"et",recurrenceLabel:"{recurrenceTerm, select, MONTH {kuus} YEAR {aastas} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {kuus} YEAR {aastas} other {}}",perUnitLabel:"{perUnit, select, LICENSE {litsentsi kohta} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {litsentsi kohta} other {}}",freeLabel:"Tasuta",freeAriaLabel:"Tasuta",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Teise v\xF5imalusena hinnaga {alternativePrice}",strikethroughAriaLabel:"Tavahind {strikethroughPrice}"},{lang:"fi",recurrenceLabel:"{recurrenceTerm, select, MONTH {/kk} YEAR {/v} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {kuukausittain} YEAR {vuosittain} other {}}",perUnitLabel:"{perUnit, select, LICENSE {k\xE4ytt\xF6oikeutta kohti} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {k\xE4ytt\xF6oikeutta kohti} other {}}",freeLabel:"Maksuton",freeAriaLabel:"Maksuton",taxExclusiveLabel:"{taxTerm, select, GST {ilman GST:t\xE4} VAT {ilman ALV:t\xE4} TAX {ilman veroja} IVA {ilman IVA:ta} SST {ilman SST:t\xE4} KDV {ilman KDV:t\xE4} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {sis. GST:n} VAT {sis. ALV:n} TAX {sis. verot} IVA {sis. IVA:n} SST {sis. SST:n} KDV {sis. KDV:n} other {}}",alternativePriceAriaLabel:"Vaihtoehtoisesti hintaan {alternativePrice}",strikethroughAriaLabel:"S\xE4\xE4nn\xF6llisesti hintaan {strikethroughPrice}"},{lang:"fr",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mois} YEAR {/an} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {par mois} YEAR {par an} other {}}",perUnitLabel:"{perUnit, select, LICENSE {par licence} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {par licence} other {}}",freeLabel:"Gratuit",freeAriaLabel:"Gratuit",taxExclusiveLabel:"{taxTerm, select, GST {hors TPS} VAT {hors TVA} TAX {hors taxes} IVA {hors IVA} SST {hors SST} KDV {hors KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {TPS comprise} VAT {TVA comprise} TAX {taxes comprises} IVA {IVA comprise} SST {SST comprise} KDV {KDV comprise} other {}}",alternativePriceAriaLabel:"Autre prix {alternativePrice}",strikethroughAriaLabel:"Prix habituel {strikethroughPrice}"},{lang:"he",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u05D7\u05D5\u05D3\u05E9} YEAR {/\u05E9\u05E0\u05D4} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u05DC\u05D7\u05D5\u05D3\u05E9} YEAR {\u05DC\u05E9\u05E0\u05D4} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",freeLabel:"\u05D7\u05D9\u05E0\u05DD",freeAriaLabel:"\u05D7\u05D9\u05E0\u05DD",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u05DC\u05D7\u05DC\u05D5\u05E4\u05D9\u05DF \u05D1-{alternativePrice}",strikethroughAriaLabel:"\u05D1\u05D0\u05D5\u05E4\u05DF \u05E7\u05D1\u05D5\u05E2 \u05D1-{strikethroughPrice}"},{lang:"hu",recurrenceLabel:"{recurrenceTerm, select, MONTH {/h\xF3} YEAR {/\xE9v} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {havonta} YEAR {\xE9vente} other {}}",perUnitLabel:"{perUnit, select, LICENSE {licencenk\xE9nt} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {licencenk\xE9nt} other {}}",freeLabel:"Ingyenes",freeAriaLabel:"Ingyenes",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"M\xE1sik lehet\u0151s\xE9g: {alternativePrice}",strikethroughAriaLabel:"\xC1ltal\xE1ban {strikethroughPrice} \xE1ron"},{lang:"it",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mese} YEAR {/anno} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {al mese} YEAR {all'anno} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per licenza} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per licenza} other {}}",freeLabel:"Gratuito",freeAriaLabel:"Gratuito",taxExclusiveLabel:"{taxTerm, select, GST {escl. GST} VAT {escl. IVA.} TAX {escl. imposte} IVA {escl. IVA} SST {escl. SST} KDV {escl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. IVA} TAX {incl. imposte} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"In alternativa a {alternativePrice}",strikethroughAriaLabel:"Regolarmente a {strikethroughPrice}"},{lang:"ja",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u6BCE\u6708} YEAR {\u6BCE\u5E74} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u30E9\u30A4\u30BB\u30F3\u30B9\u3054\u3068} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u30E9\u30A4\u30BB\u30F3\u30B9\u3054\u3068} other {}}",freeLabel:"\u7121\u6599",freeAriaLabel:"\u7121\u6599",taxExclusiveLabel:"{taxTerm, select, GST {GST \u5225} VAT {VAT \u5225} TAX {\u7A0E\u5225} IVA {IVA \u5225} SST {SST \u5225} KDV {KDV \u5225} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST \u8FBC} VAT {VAT \u8FBC} TAX {\u7A0E\u8FBC} IVA {IVA \u8FBC} SST {SST \u8FBC} KDV {KDV \u8FBC} other {}}",alternativePriceAriaLabel:"\u7279\u5225\u4FA1\u683C : {alternativePrice}",strikethroughAriaLabel:"\u901A\u5E38\u4FA1\u683C : {strikethroughPrice}"},{lang:"ko",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\uC6D4} YEAR {/\uB144} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\uC6D4\uAC04} YEAR {\uC5F0\uAC04} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\uB77C\uC774\uC120\uC2A4\uB2F9} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\uB77C\uC774\uC120\uC2A4\uB2F9} other {}}",freeLabel:"\uBB34\uB8CC",freeAriaLabel:"\uBB34\uB8CC",taxExclusiveLabel:"{taxTerm, select, GST {GST \uC81C\uC678} VAT {VAT \uC81C\uC678} TAX {\uC138\uAE08 \uC81C\uC678} IVA {IVA \uC81C\uC678} SST {SST \uC81C\uC678} KDV {KDV \uC81C\uC678} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST \uD3EC\uD568} VAT {VAT \uD3EC\uD568} TAX {\uC138\uAE08 \uD3EC\uD568} IVA {IVA \uD3EC\uD568} SST {SST \uD3EC\uD568} KDV {KDV \uD3EC\uD568} other {}}",alternativePriceAriaLabel:"\uB610\uB294 {alternativePrice}\uC5D0",strikethroughAriaLabel:"\uB610\uB294 {alternativePrice}\uC5D0"},{lang:"lt",recurrenceLabel:"{recurrenceTerm, select, MONTH { per m\u0117n.} YEAR { per metus} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per m\u0117n.} YEAR {per metus} other {}}",perUnitLabel:"{perUnit, select, LICENSE {u\u017E licencij\u0105} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {u\u017E licencij\u0105} other {}}",freeLabel:"Nemokamai",freeAriaLabel:"Nemokamai",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Arba u\u017E {alternativePrice}",strikethroughAriaLabel:"Normaliai u\u017E {strikethroughPrice}"},{lang:"lv",recurrenceLabel:"{recurrenceTerm, select, MONTH {m\u0113nes\u012B} YEAR {gad\u0101} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {m\u0113nes\u012B} YEAR {gad\u0101} other {}}",perUnitLabel:"{perUnit, select, LICENSE {vienai licencei} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {vienai licencei} other {}}",freeLabel:"Bezmaksas",freeAriaLabel:"Bezmaksas",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternat\u012Bvi par {alternativePrice}",strikethroughAriaLabel:"Regul\u0101ri par {strikethroughPrice}"},{lang:"nb",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mnd.} YEAR {/\xE5r} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per m\xE5ned} YEAR {per \xE5r} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per lisens} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per lisens} other {}}",freeLabel:"Fri",freeAriaLabel:"Fri",taxExclusiveLabel:"{taxTerm, select, GST {ekskl. GST} VAT {ekskl. moms} TAX {ekskl. avgift} IVA {ekskl. IVA} SST {ekskl. SST} KDV {ekskl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. avgift} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativt til {alternativePrice}",strikethroughAriaLabel:"Regelmessig til {strikethroughPrice}"},{lang:"nl",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mnd} YEAR {/jr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per maand} YEAR {per jaar} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per licentie} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per licentie} other {}}",freeLabel:"Gratis",freeAriaLabel:"Gratis",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. btw} TAX {excl. belasting} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. btw} TAX {incl. belasting} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Nu {alternativePrice}",strikethroughAriaLabel:"Normaal {strikethroughPrice}"},{lang:"pl",recurrenceLabel:"{recurrenceTerm, select, MONTH { / mies.} YEAR { / rok} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH { / miesi\u0105c} YEAR { / rok} other {}}",perUnitLabel:"{perUnit, select, LICENSE {za licencj\u0119} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {za licencj\u0119} other {}}",freeLabel:"Bezp\u0142atne",freeAriaLabel:"Bezp\u0142atne",taxExclusiveLabel:"{taxTerm, select, GST {bez GST} VAT {bez VAT} TAX {netto} IVA {bez IVA} SST {bez SST} KDV {bez KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {z GST} VAT {z VAT} TAX {brutto} IVA {z IVA} SST {z SST} KDV {z KDV} other {}}",alternativePriceAriaLabel:"Lub za {alternativePrice}",strikethroughAriaLabel:"Cena zwyk\u0142a: {strikethroughPrice}"},{lang:"pt",recurrenceLabel:"{recurrenceTerm, select, MONTH {/m\xEAs} YEAR {/ano} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {por m\xEAs} YEAR {por ano} other {}}",perUnitLabel:"{perUnit, select, LICENSE {por licen\xE7a} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {por licen\xE7a} other {}}",freeLabel:"Gratuito",freeAriaLabel:"Gratuito",taxExclusiveLabel:"{taxTerm, select, GST {ICMS n\xE3o incluso} VAT {IVA n\xE3o incluso} TAX {impostos n\xE3o inclusos} IVA {IVA n\xE3o incluso} SST { SST n\xE3o incluso} KDV {KDV n\xE3o incluso} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {ICMS incluso} VAT {IVA incluso} TAX {impostos inclusos} IVA {IVA incluso} SST {SST incluso} KDV {KDV incluso} other {}}",alternativePriceAriaLabel:"Ou a {alternativePrice}",strikethroughAriaLabel:"Pre\xE7o normal: {strikethroughPrice}"},{lang:"ro",recurrenceLabel:"{recurrenceTerm, select, MONTH {/lun\u0103} YEAR {/an} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {pe lun\u0103} YEAR {pe an} other {}}",perUnitLabel:"{perUnit, select, LICENSE {pe licen\u021B\u0103} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {pe licen\u021B\u0103} other {}}",freeLabel:"Gratuit",freeAriaLabel:"Gratuit",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternativ, la {alternativePrice}",strikethroughAriaLabel:"\xCEn mod normal, la {strikethroughPrice}"},{lang:"ru",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u043C\u0435\u0441.} YEAR {/\u0433.} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u0432 \u043C\u0435\u0441\u044F\u0446} YEAR {\u0432 \u0433\u043E\u0434} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u044E} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u044E} other {}}",freeLabel:"\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E",freeAriaLabel:"\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E",taxExclusiveLabel:"{taxTerm, select, GST {\u0438\u0441\u043A\u043B. \u043D\u0430\u043B\u043E\u0433 \u043D\u0430 \u0442\u043E\u0432\u0430\u0440\u044B \u0438 \u0443\u0441\u043B\u0443\u0433\u0438} VAT {\u0438\u0441\u043A\u043B. \u041D\u0414\u0421} TAX {\u0438\u0441\u043A\u043B. \u043D\u0430\u043B\u043E\u0433} IVA {\u0438\u0441\u043A\u043B. \u0418\u0412\u0410} SST {\u0438\u0441\u043A\u043B. SST} KDV {\u0438\u0441\u043A\u043B. \u041A\u0414\u0412} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u0432\u043A\u043B. \u043D\u0430\u043B\u043E\u0433 \u043D\u0430 \u0442\u043E\u0432\u0430\u0440\u044B \u0438 \u0443\u0441\u043B\u0443\u0433\u0438} VAT {\u0432\u043A\u043B. \u041D\u0414\u0421} TAX {\u0432\u043A\u043B. \u043D\u0430\u043B\u043E\u0433} IVA {\u0432\u043A\u043B. \u0418\u0412\u0410} SST {\u0432\u043A\u043B. SST} KDV {\u0432\u043A\u043B. \u041A\u0414\u0412} other {}}",alternativePriceAriaLabel:"\u0410\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442 \u0437\u0430 {alternativePrice}",strikethroughAriaLabel:"\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E \u043F\u043E \u0446\u0435\u043D\u0435 {strikethroughPrice}"},{lang:"sk",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mesiac} YEAR {/rok} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {za mesiac} YEAR {za rok} other {}}",perUnitLabel:"{perUnit, select, LICENSE {za licenciu} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {za licenciu} other {}}",freeLabel:"Zadarmo",freeAriaLabel:"Zadarmo",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Pr\xEDpadne za {alternativePrice}",strikethroughAriaLabel:"Pravidelne za {strikethroughPrice}"},{lang:"sl",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mesec} YEAR {/leto} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {na mesec} YEAR {na leto} other {}}",perUnitLabel:"{perUnit, select, LICENSE {na licenco} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {na licenco} other {}}",freeLabel:"Brezpla\u010Dno",freeAriaLabel:"Brezpla\u010Dno",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Druga mo\u017Enost je: {alternativePrice}",strikethroughAriaLabel:"Redno po {strikethroughPrice}"},{lang:"sv",recurrenceLabel:"{recurrenceTerm, select, MONTH {/m\xE5n} YEAR {/\xE5r} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per m\xE5nad} YEAR {per \xE5r} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per licens} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per licens} other {}}",freeLabel:"Kostnadsfritt",freeAriaLabel:"Kostnadsfritt",taxExclusiveLabel:"{taxTerm, select, GST {exkl. GST} VAT {exkl. moms} TAX {exkl. skatt} IVA {exkl. IVA} SST {exkl. SST} KDV {exkl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. skatt} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativt f\xF6r {alternativePrice}",strikethroughAriaLabel:"Normalpris {strikethroughPrice}"},{lang:"tr",recurrenceLabel:"{recurrenceTerm, select, MONTH {/ay} YEAR {/y\u0131l} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {(ayl\u0131k)} YEAR {(y\u0131ll\u0131k)} other {}}",perUnitLabel:"{perUnit, select, LICENSE {(lisans ba\u015F\u0131na)} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {(lisans ba\u015F\u0131na)} other {}}",freeLabel:"\xDCcretsiz",freeAriaLabel:"\xDCcretsiz",taxExclusiveLabel:"{taxTerm, select, GST {GST hari\xE7} VAT {KDV hari\xE7} TAX {vergi hari\xE7} IVA {IVA hari\xE7} SST {SST hari\xE7} KDV {KDV hari\xE7} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST dahil} VAT {KDV dahil} TAX {vergi dahil} IVA {IVA dahil} SST {SST dahil} KDV {KDV dahil} other {}}",alternativePriceAriaLabel:"Ya da {alternativePrice}",strikethroughAriaLabel:"Standart fiyat: {strikethroughPrice}"},{lang:"uk",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u043C\u0456\u0441.} YEAR {/\u0440\u0456\u043A} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u043D\u0430 \u043C\u0456\u0441\u044F\u0446\u044C} YEAR {\u043D\u0430 \u0440\u0456\u043A} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0456\u0446\u0435\u043D\u0437\u0456\u044E} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0456\u0446\u0435\u043D\u0437\u0456\u044E} other {}}",freeLabel:"\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u043E",freeAriaLabel:"\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u043E",taxExclusiveLabel:"{taxTerm, select, GST {\u0431\u0435\u0437 GST} VAT {\u0431\u0435\u0437 \u041F\u0414\u0412} TAX {\u0431\u0435\u0437 \u043F\u043E\u0434\u0430\u0442\u043A\u0443} IVA {\u0431\u0435\u0437 IVA} SST {\u0431\u0435\u0437 SST} KDV {\u0431\u0435\u0437 KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 GST} VAT {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 \u041F\u0414\u0412} TAX {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 \u043F\u043E\u0434\u0430\u0442\u043A\u043E\u043C} IVA {\u0440\u0430\u0437\u043E\u043C \u0437 IVA} SST {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 SST} KDV {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 KDV} other {}}",alternativePriceAriaLabel:"\u0410\u0431\u043E \u0437\u0430 {alternativePrice}",strikethroughAriaLabel:"\u0417\u0432\u0438\u0447\u0430\u0439\u043D\u0430 \u0446\u0456\u043D\u0430 {strikethroughPrice}"},{lang:"zh-hans",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u6BCF\u6708} YEAR {\u6BCF\u5E74} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u6BCF\u4E2A\u8BB8\u53EF\u8BC1} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u6BCF\u4E2A\u8BB8\u53EF\u8BC1} other {}}",freeLabel:"\u514D\u8D39",freeAriaLabel:"\u514D\u8D39",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u6216\u5B9A\u4EF7 {alternativePrice}",strikethroughAriaLabel:"\u6B63\u5E38\u4EF7 {strikethroughPrice}"},{lang:"zh-hant",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u6BCF\u6708} YEAR {\u6BCF\u5E74} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u6BCF\u500B\u6388\u6B0A} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u6BCF\u500B\u6388\u6B0A} other {}}",freeLabel:"\u514D\u8CBB",freeAriaLabel:"\u514D\u8CBB",taxExclusiveLabel:"{taxTerm, select, GST {\u4E0D\u542B GST} VAT {\u4E0D\u542B VAT} TAX {\u4E0D\u542B\u7A05} IVA {\u4E0D\u542B IVA} SST {\u4E0D\u542B SST} KDV {\u4E0D\u542B KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u542B GST} VAT {\u542B VAT} TAX {\u542B\u7A05} IVA {\u542B IVA} SST {\u542B SST} KDV {\u542B KDV} other {}}",alternativePriceAriaLabel:"\u6216\u8005\u5728 {alternativePrice}",strikethroughAriaLabel:"\u6A19\u6E96\u50F9\u683C\u70BA {strikethroughPrice}"},{lang:"es",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mes} YEAR {/a\xF1o} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {al mes} YEAR {al a\xF1o} other {}}",perUnitLabel:"{perUnit, select, LICENSE {por licencia} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {por licencia} other {}}",freeLabel:"Gratuito",freeAriaLabel:"Gratuito",taxExclusiveLabel:"{taxTerm, select, GST {GST no incluido} VAT {IVA no incluido} TAX {Impuestos no incluidos} IVA {IVA no incluido} SST {SST no incluido} KDV {KDV no incluido} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST incluido} VAT {IVA incluido} TAX {Impuestos incluidos} IVA {IVA incluido} SST {SST incluido} KDV {KDV incluido} other {}}",alternativePriceAriaLabel:"Alternativamente por {alternativePrice}",strikethroughAriaLabel:"Normalmente a {strikethroughPrice}"},{lang:"in",recurrenceLabel:"{recurrenceTerm, select, MONTH {/bulan} YEAR {/tahun} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per bulan} YEAR {per tahun} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per lisensi} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per lisensi} other {}}",freeLabel:"Gratis",freeAriaLabel:"Gratis",taxExclusiveLabel:"{taxTerm, select, GST {tidak termasuk PBJ} VAT {tidak termasuk PPN} TAX {tidak termasuk pajak} IVA {tidak termasuk IVA} SST {tidak termasuk SST} KDV {tidak termasuk KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {termasuk PBJ} VAT {termasuk PPN} TAX {termasuk pajak} IVA {termasuk IVA} SST {termasuk SST} KDV {termasuk KDV} other {}}",alternativePriceAriaLabel:"Atau seharga {alternativePrice}",strikethroughAriaLabel:"Normalnya seharga {strikethroughPrice}"},{lang:"vi",recurrenceLabel:"{recurrenceTerm, select, MONTH {/th\xE1ng} YEAR {/n\u0103m} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {m\u1ED7i th\xE1ng} YEAR {m\u1ED7i n\u0103m} other {}}",perUnitLabel:"{perUnit, select, LICENSE {m\u1ED7i gi\u1EA5y ph\xE9p} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {m\u1ED7i gi\u1EA5y ph\xE9p} other {}}",freeLabel:"Mi\u1EC5n ph\xED",freeAriaLabel:"Mi\u1EC5n ph\xED",taxExclusiveLabel:"{taxTerm, select, GST {ch\u01B0a bao g\u1ED3m thu\u1EBF h\xE0ng h\xF3a v\xE0 d\u1ECBch v\u1EE5} VAT {ch\u01B0a bao g\u1ED3m thu\u1EBF GTGT} TAX {ch\u01B0a bao g\u1ED3m thu\u1EBF} IVA {ch\u01B0a bao g\u1ED3m IVA} SST {ch\u01B0a bao g\u1ED3m SST} KDV {ch\u01B0a bao g\u1ED3m KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {(\u0111\xE3 bao g\u1ED3m thu\u1EBF h\xE0ng h\xF3a v\xE0 d\u1ECBch v\u1EE5)} VAT {(\u0111\xE3 bao g\u1ED3m thu\u1EBF GTGT)} TAX {(\u0111\xE3 bao g\u1ED3m thu\u1EBF)} IVA {(\u0111\xE3 bao g\u1ED3m IVA)} SST {(\u0111\xE3 bao g\u1ED3m SST)} KDV {(\u0111\xE3 bao g\u1ED3m KDV)} other {}}",alternativePriceAriaLabel:"Gi\xE1 \u01B0u \u0111\xE3i {alternativePrice}",strikethroughAriaLabel:"Gi\xE1 th\xF4ng th\u01B0\u1EDDng {strikethroughPrice}"},{lang:"th",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u0E40\u0E14\u0E37\u0E2D\u0E19} YEAR {/\u0E1B\u0E35} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u0E15\u0E48\u0E2D\u0E40\u0E14\u0E37\u0E2D\u0E19} YEAR {\u0E15\u0E48\u0E2D\u0E1B\u0E35} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0E15\u0E48\u0E2D\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0E15\u0E48\u0E2D\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19} other {}}",freeLabel:"\u0E1F\u0E23\u0E35",freeAriaLabel:"\u0E1F\u0E23\u0E35",taxExclusiveLabel:"{taxTerm, select, GST {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35 GST} VAT {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 VAT} TAX {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35} IVA {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 IVA} SST {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 SST} KDV {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35 GST} VAT {\u0E23\u0E27\u0E21 VAT} TAX {\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35} IVA {\u0E23\u0E27\u0E21 IVA} SST {\u0E23\u0E27\u0E21 SST} KDV {\u0E23\u0E27\u0E21 KDV} other {}}",alternativePriceAriaLabel:"\u0E23\u0E32\u0E04\u0E32\u0E1E\u0E34\u0E40\u0E28\u0E29 {alternativePrice}",strikethroughAriaLabel:"\u0E23\u0E32\u0E04\u0E32\u0E1B\u0E01\u0E15\u0E34 {strikethroughPrice}"},{lang:"el",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u03BC\u03AE\u03BD\u03B1} YEAR {/\u03AD\u03C4\u03BF\u03C2} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u03BA\u03AC\u03B8\u03B5 \u03BC\u03AE\u03BD\u03B1} YEAR {\u03B1\u03BD\u03AC \u03AD\u03C4\u03BF\u03C2} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u03B1\u03BD\u03AC \u03AC\u03B4\u03B5\u03B9\u03B1 \u03C7\u03C1\u03AE\u03C3\u03B7\u03C2} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u03B1\u03BD\u03AC \u03AC\u03B4\u03B5\u03B9\u03B1 \u03C7\u03C1\u03AE\u03C3\u03B7\u03C2} other {}}",freeLabel:"\u0394\u03C9\u03C1\u03B5\u03AC\u03BD",freeAriaLabel:"\u0394\u03C9\u03C1\u03B5\u03AC\u03BD",taxExclusiveLabel:"{taxTerm, select, GST {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 GST)} VAT {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03A6\u03A0\u0391)} TAX {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C6\u03CC\u03C1\u03BF)} IVA {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 IVA)} SST {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 SST)} KDV {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 KDV)} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 GST)} VAT {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03A6\u03A0\u0391)} TAX {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 \u03C6\u03CC\u03C1\u03BF\u03C5)} IVA {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 IVA)} SST {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 SST)} KDV {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 KDV)} other {}}",alternativePriceAriaLabel:"\u0394\u03B9\u03B1\u03C6\u03BF\u03C1\u03B5\u03C4\u03B9\u03BA\u03AC, {alternativePrice}",strikethroughAriaLabel:"\u039A\u03B1\u03BD\u03BF\u03BD\u03B9\u03BA\u03AE \u03C4\u03B9\u03BC\u03AE {strikethroughPrice}"},{lang:"fil",recurrenceLabel:"{recurrenceTerm, select, MONTH {/buwan} YEAR {/taon} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per buwan} YEAR {per taon} other {}}",perUnitLabel:"{perUnit, select, LICENSE {kada lisensya} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {kada lisensya} other {}}",freeLabel:"Libre",freeAriaLabel:"Libre",taxExclusiveLabel:"{taxTerm, select, GST {hindi kasama ang GST} VAT {hindi kasama ang VAT} TAX {hindi kasama ang Buwis} IVA {hindi kasama ang IVA} SST {hindi kasama ang SST} KDV {hindi kasama ang KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {kasama ang GST} VAT {kasama ang VAT} TAX {kasama ang Buwis} IVA {kasama ang IVA} SST {kasama ang SST} KDV {kasama ang KDV} other {}}",alternativePriceAriaLabel:"Alternatibong nasa halagang {alternativePrice}",strikethroughAriaLabel:"Regular na nasa halagang {strikethroughPrice}"},{lang:"ms",recurrenceLabel:"{recurrenceTerm, select, MONTH {/bulan} YEAR {/tahun} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per bulan} YEAR {per tahun} other {}}",perUnitLabel:"{perUnit, select, LICENSE {setiap lesen} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {setiap lesen} other {}}",freeLabel:"Percuma",freeAriaLabel:"Percuma",taxExclusiveLabel:"{taxTerm, select, GST {kecuali GST} VAT {kecuali VAT} TAX {kecuali Cukai} IVA {kecuali IVA} SST {kecuali SST} KDV {kecuali KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {termasuk GST} VAT {termasuk VAT} TAX {termasuk Cukai} IVA {termasuk IVA} SST {termasuk SST} KDV {termasuk KDV} other {}}",alternativePriceAriaLabel:"Secara alternatif pada {alternativePrice}",strikethroughAriaLabel:"Biasanya pada {strikethroughPrice}"},{lang:"hi",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u092E\u093E\u0939} YEAR {/\u0935\u0930\u094D\u0937} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per \u092E\u093E\u0939} YEAR {per \u0935\u0930\u094D\u0937} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u092A\u094D\u0930\u0924\u093F \u0932\u093E\u0907\u0938\u0947\u0902\u0938} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u092A\u094D\u0930\u0924\u093F \u0932\u093E\u0907\u0938\u0947\u0902\u0938} other {}}",freeLabel:"\u092B\u093C\u094D\u0930\u0940",freeAriaLabel:"\u092B\u093C\u094D\u0930\u0940",taxExclusiveLabel:"{taxTerm, select, GST {GST \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} VAT {VAT \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} TAX {\u0915\u0930 \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} IVA {IVA \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} SST {SST \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} KDV {KDV \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST \u0938\u0939\u093F\u0924} VAT {VAT \u0938\u0939\u093F\u0924} TAX {\u0915\u0930 \u0938\u0939\u093F\u0924} IVA {IVA \u0938\u0939\u093F\u0924} SST {SST \u0938\u0939\u093F\u0924} KDV {KDV \u0938\u0939\u093F\u0924} other {}}",alternativePriceAriaLabel:"\u0935\u0948\u0915\u0932\u094D\u092A\u093F\u0915 \u0930\u0942\u092A \u0938\u0947 \u0907\u0938 \u092A\u0930 {alternativePrice}",strikethroughAriaLabel:"\u0928\u093F\u092F\u092E\u093F\u0924 \u0930\u0942\u092A \u0938\u0947 \u0907\u0938 \u092A\u0930 {strikethroughPrice}"},{lang:"iw",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u05D7\u05D5\u05D3\u05E9} YEAR {/\u05E9\u05E0\u05D4} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u05DC\u05D7\u05D5\u05D3\u05E9} YEAR {\u05DC\u05E9\u05E0\u05D4} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",freeLabel:"\u05D7\u05D9\u05E0\u05DD",freeAriaLabel:"\u05D7\u05D9\u05E0\u05DD",taxExclusiveLabel:'{taxTerm, select, GST {\u05DC\u05DC\u05D0 GST} VAT {\u05DC\u05DC\u05D0 \u05DE\u05E2"\u05DE} TAX {\u05DC\u05DC\u05D0 \u05DE\u05E1} IVA {\u05DC\u05DC\u05D0 IVA} SST {\u05DC\u05DC\u05D0 SST} KDV {\u05DC\u05DC\u05D0 KDV} other {}}',taxInclusiveLabel:'{taxTerm, select, GST {\u05DB\u05D5\u05DC\u05DC GST} VAT {\u05DB\u05D5\u05DC\u05DC \u05DE\u05E2"\u05DE} TAX {\u05DB\u05D5\u05DC\u05DC \u05DE\u05E1} IVA {\u05DB\u05D5\u05DC\u05DC IVA} SST {\u05DB\u05D5\u05DC\u05DC SST} KDV {\u05DB\u05D5\u05DC\u05DC KDV} other {}}',alternativePriceAriaLabel:"\u05DC\u05D7\u05DC\u05D5\u05E4\u05D9\u05DF \u05D1-{alternativePrice}",strikethroughAriaLabel:"\u05D1\u05D0\u05D5\u05E4\u05DF \u05E7\u05D1\u05D5\u05E2 \u05D1-{strikethroughPrice}"}],":type":"sheet"}});var ye;(function(e){e.STAGE="STAGE",e.PRODUCTION="PRODUCTION",e.LOCAL="LOCAL"})(ye||(ye={}));var _t;(function(e){e.STAGE="STAGE",e.PRODUCTION="PROD",e.LOCAL="LOCAL"})(_t||(_t={}));var Pe;(function(e){e.DRAFT="DRAFT",e.PUBLISHED="PUBLISHED"})(Pe||(Pe={}));var ae;(function(e){e.V2="UCv2",e.V3="UCv3"})(ae||(ae={}));var H;(function(e){e.CHECKOUT="checkout",e.CHECKOUT_EMAIL="checkout/email",e.SEGMENTATION="segmentation",e.BUNDLE="bundle",e.COMMITMENT="commitment",e.RECOMMENDATION="recommendation",e.EMAIL="email",e.PAYMENT="payment",e.CHANGE_PLAN_TEAM_PLANS="change-plan/team-upgrade/plans",e.CHANGE_PLAN_TEAM_PAYMENT="change-plan/team-upgrade/payment"})(H||(H={}));var It=function(e){var t;return(t=si.get(e))!==null&&t!==void 0?t:e},si=new Map([["countrySpecific","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["offerType","ot"],["marketSegment","ms"]]);var Rr=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,n=t&&e[t],r=0;if(n)return n.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},Dr=function(e,t){var n=typeof Symbol=="function"&&e[Symbol.iterator];if(!n)return e;var r=n.call(e),i,a=[],o;try{for(;(t===void 0||t-- >0)&&!(i=r.next()).done;)a.push(i.value)}catch(s){o={error:s}}finally{try{i&&!i.done&&(n=r.return)&&n.call(r)}finally{if(o)throw o.error}}return a};function Te(e,t,n){var r,i;try{for(var a=Rr(Object.entries(e)),o=a.next();!o.done;o=a.next()){var s=Dr(o.value,2),l=s[0],c=s[1],u=It(l);c!=null&&n.has(u)&&t.set(u,c)}}catch(f){r={error:f}}finally{try{o&&!o.done&&(i=a.return)&&i.call(a)}finally{if(r)throw r.error}}}function Ye(e){switch(e){case ye.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function Ke(e,t){var n,r;for(var i in e){var a=e[i];try{for(var o=(n=void 0,Rr(Object.entries(a))),s=o.next();!s.done;s=o.next()){var l=Dr(s.value,2),c=l[0],u=l[1];if(u!=null){var f=It(c);t.set("items["+i+"]["+f+"]",u)}}}catch(p){n={error:p}}finally{try{s&&!s.done&&(r=o.return)&&r.call(o)}finally{if(n)throw n.error}}}}var li=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]]);return n},ci=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,n=t&&e[t],r=0;if(n)return n.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};function Ur(e){pi(e);var t=e.env,n=e.items,r=e.workflowStep,i=li(e,["env","items","workflowStep"]),a=new URL(Ye(t));return a.pathname=r+"/",Ke(n,a.searchParams),Te(i,a.searchParams,ui),a.toString()}var ui=new Set(["cli","co","lang","ctx","cUrl","mv","nglwfdata","otac","promoid","rUrl","sdid","spint","trackingid","code","campaignid","appctxid"]),fi=["env","workflowStep","clientId","country","items"];function pi(e){var t,n;try{for(var r=ci(fi),i=r.next();!i.done;i=r.next()){var a=i.value;if(!e[a])throw new Error('Argument "checkoutData" is not valid, missing: '+a)}}catch(o){t={error:o}}finally{try{i&&!i.done&&(n=r.return)&&n.call(r)}finally{if(t)throw t.error}}return!0}var hi=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]]);return n},mi=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,n=t&&e[t],r=0;if(n)return n.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},Ti="p_draft_landscape",Ai="/store/";function Vt(e){Si(e);var t=e.env,n=e.items,r=e.workflowStep,i=e.ms,a=e.marketSegment,o=e.ot,s=e.offerType,l=e.pa,c=e.productArrangementCode,u=e.landscape,f=hi(e,["env","items","workflowStep","ms","marketSegment","ot","offerType","pa","productArrangementCode","landscape"]),p={marketSegment:a??i,offerType:s??o,productArrangementCode:c??l},m=new URL(Ye(t));return m.pathname=""+Ai+r,r!==H.SEGMENTATION&&r!==H.CHANGE_PLAN_TEAM_PLANS&&Ke(n,m.searchParams),r===H.SEGMENTATION&&Te(p,m.searchParams,Nt),Te(f,m.searchParams,Nt),u===Pe.DRAFT&&Te({af:Ti},m.searchParams,Nt),m.toString()}var Nt=new Set(["af","ai","apc","appctxid","cli","co","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),di=["env","workflowStep","clientId","country"];function Si(e){var t,n;try{for(var r=mi(di),i=r.next();!i.done;i=r.next()){var a=i.value;if(!e[a])throw new Error('Argument "checkoutData" is not valid, missing: '+a)}}catch(o){t={error:o}}finally{try{i&&!i.done&&(n=r.return)&&n.call(r)}finally{if(t)throw t.error}}if(e.workflowStep!==H.SEGMENTATION&&e.workflowStep!==H.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}function Ot(e,t){switch(e){case ae.V2:return Ur(t);case ae.V3:return Vt(t);default:return console.warn("Unsupported CheckoutType, will use UCv3 as default. Given type: "+e),Vt(t)}}var Ct;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(Ct||(Ct={}));var w;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(w||(w={}));var I;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(I||(I={}));var wt;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(wt||(wt={}));var kt;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(kt||(kt={}));var Rt;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(Rt||(Rt={}));var Dt;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(Dt||(Dt={}));var Mr="tacocat.js";var ze=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),Gr=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function N(e,t={},{metadata:n=!0,search:r=!0,storage:i=!0}={}){let a;if(r&&a==null){let o=new URLSearchParams(window.location.search),s=Ae(r)?r:e;a=o.get(s)}if(i&&a==null){let o=Ae(i)?i:e;a=window.sessionStorage.getItem(o)??window.localStorage.getItem(o)}if(n&&a==null){let o=Ei(Ae(n)?n:e);a=document.documentElement.querySelector(`meta[name="${o}"]`)?.content}return a??t[e]}var de=()=>{};var Hr=e=>typeof e=="boolean",ee=e=>typeof e=="function",je=e=>typeof e=="number",Fr=e=>e!=null&&typeof e=="object";var Ae=e=>typeof e=="string",Ut=e=>Ae(e)&&e,Se=e=>je(e)&&Number.isFinite(e)&&e>0;function Ee(e,t=n=>n==null||n===""){return e!=null&&Object.entries(e).forEach(([n,r])=>{t(r)&&delete e[n]}),e}function g(e,t){if(Hr(e))return e;let n=String(e);return n==="1"||n==="true"?!0:n==="0"||n==="false"?!1:t}function te(e,t,n){let r=Object.values(t);return r.find(i=>ze(i,e))??n??r[0]}function Ei(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,n,r)=>`${n}-${r}`).replace(/\W+/gu,"-").toLowerCase()}function xe(e,t=1){return je(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var xi=Date.now(),Mt=()=>`(+${Date.now()-xi}ms)`,We=new Set,bi=g(N("tacocat.debug",{},{metadata:!1}),typeof process<"u"&&process.env?.DEBUG);function Xr(e){let t=`[${Mr}/${e}]`,n=(o,s,...l)=>o?!0:(i(s,...l),!1),r=bi?(o,...s)=>{console.debug(`${t} ${o}`,...s,Mt())}:()=>{},i=(o,...s)=>{let l=`${t} ${o}`;We.forEach(([c])=>c(l,...s))};return{assert:n,debug:r,error:i,warn:(o,...s)=>{let l=`${t} ${o}`;We.forEach(([,c])=>c(l,...s))}}}function gi(e,t){let n=[e,t];return We.add(n),()=>{We.delete(n)}}gi((e,...t)=>{console.error(e,...t,Mt())},(e,...t)=>{console.warn(e,...t,Mt())});var Li="no promo",Yr="promo-tag",vi="yellow",yi="neutral",Pi=(e,t,n)=>{let r=a=>a||Li,i=n?` (was "${r(t)}")`:"";return`${r(e)}${i}`},_i="cancel-context",_e=(e,t)=>{let n=e===_i,r=!n&&e?.length>0,i=(r||n)&&(t&&t!=e||!t&&!n),a=i&&r||!i&&!!t,o=a?e||t:void 0;return{effectivePromoCode:o,overridenPromoCode:e,className:a?Yr:`${Yr} no-promo`,text:Pi(o,t,i),variant:a?vi:yi,isOverriden:i}};var Gt="ABM",Ht="PUF",Ft="M2M",Xt="PERPETUAL",Yt="P3Y",Ii="TAX_INCLUSIVE_DETAILS",Ni="TAX_EXCLUSIVE",Kr={ABM:Gt,PUF:Ht,M2M:Ft,PERPETUAL:Xt,P3Y:Yt},ko={[Gt]:{commitment:w.YEAR,term:I.MONTHLY},[Ht]:{commitment:w.YEAR,term:I.ANNUAL},[Ft]:{commitment:w.MONTH,term:I.MONTHLY},[Xt]:{commitment:w.PERPETUAL,term:void 0},[Yt]:{commitment:w.THREE_MONTHS,term:I.P3Y}},zr="Value is not an offer",Be=e=>{if(typeof e!="object")return zr;let{commitment:t,term:n}=e,r=Vi(t,n);return{...e,planType:r}};var Vi=(e,t)=>{switch(e){case void 0:return zr;case"":return"";case w.YEAR:return t===I.MONTHLY?Gt:t===I.ANNUAL?Ht:"";case w.MONTH:return t===I.MONTHLY?Ft:"";case w.PERPETUAL:return Xt;case w.TERM_LICENSE:return t===I.P3Y?Yt:"";default:return""}};function Kt(e){let{priceDetails:t}=e,{price:n,priceWithoutDiscount:r,priceWithoutTax:i,priceWithoutDiscountAndTax:a,taxDisplay:o}=t;if(o!==Ii)return e;let s={...e,priceDetails:{...t,price:i??n,priceWithoutDiscount:a??r,taxDisplay:Ni}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var zt=function(e,t){return zt=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,r){n.__proto__=r}||function(n,r){for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(n[i]=r[i])},zt(e,t)};function Ie(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");zt(e,t);function n(){this.constructor=e}e.prototype=t===null?Object.create(t):(n.prototype=t.prototype,new n)}var b=function(){return b=Object.assign||function(t){for(var n,r=1,i=arguments.length;r<i;r++){n=arguments[r];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a])}return t},b.apply(this,arguments)};function $e(e,t,n){if(n||arguments.length===2)for(var r=0,i=t.length,a;r<i;r++)(a||!(r in t))&&(a||(a=Array.prototype.slice.call(t,0,r)),a[r]=t[r]);return e.concat(a||Array.prototype.slice.call(t))}var d;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(d||(d={}));var P;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(P||(P={}));var oe;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(oe||(oe={}));function jt(e){return e.type===P.literal}function jr(e){return e.type===P.argument}function qe(e){return e.type===P.number}function Ze(e){return e.type===P.date}function Je(e){return e.type===P.time}function Qe(e){return e.type===P.select}function et(e){return e.type===P.plural}function Wr(e){return e.type===P.pound}function tt(e){return e.type===P.tag}function rt(e){return!!(e&&typeof e=="object"&&e.type===oe.number)}function Ne(e){return!!(e&&typeof e=="object"&&e.type===oe.dateTime)}var Wt=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var Oi=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function Br(e){var t={};return e.replace(Oi,function(n){var r=n.length;switch(n[0]){case"G":t.era=r===4?"long":r===5?"narrow":"short";break;case"y":t.year=r===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][r-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][r-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=r===4?"short":r===5?"narrow":"short";break;case"e":if(r<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][r-4];break;case"c":if(r<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][r-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][r-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][r-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][r-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][r-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][r-1];break;case"s":t.second=["numeric","2-digit"][r-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=r<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var $r=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function Qr(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split($r).filter(function(p){return p.length>0}),n=[],r=0,i=t;r<i.length;r++){var a=i[r],o=a.split("/");if(o.length===0)throw new Error("Invalid number skeleton");for(var s=o[0],l=o.slice(1),c=0,u=l;c<u.length;c++){var f=u[c];if(f.length===0)throw new Error("Invalid number skeleton")}n.push({stem:s,options:l})}return n}function Ci(e){return e.replace(/^(.*?)-/,"")}var qr=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,en=/^(@+)?(\+|#+)?$/g,wi=/(\*)(0+)|(#+)(0+)|(0+)/g,tn=/^(0+)$/;function Zr(e){var t={};return e.replace(en,function(n,r,i){return typeof i!="string"?(t.minimumSignificantDigits=r.length,t.maximumSignificantDigits=r.length):i==="+"?t.minimumSignificantDigits=r.length:r[0]==="#"?t.maximumSignificantDigits=r.length:(t.minimumSignificantDigits=r.length,t.maximumSignificantDigits=r.length+(typeof i=="string"?i.length:0)),""}),t}function rn(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function ki(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var n=e.slice(0,2);if(n==="+!"?(t.signDisplay="always",e=e.slice(2)):n==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!tn.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function Jr(e){var t={},n=rn(e);return n||t}function nn(e){for(var t={},n=0,r=e;n<r.length;n++){var i=r[n];switch(i.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=i.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=Ci(i.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=b(b(b({},t),{notation:"scientific"}),i.options.reduce(function(s,l){return b(b({},s),Jr(l))},{}));continue;case"engineering":t=b(b(b({},t),{notation:"engineering"}),i.options.reduce(function(s,l){return b(b({},s),Jr(l))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(i.options[0]);continue;case"integer-width":if(i.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");i.options[0].replace(wi,function(s,l,c,u,f,p){if(l)t.minimumIntegerDigits=c.length;else{if(u&&f)throw new Error("We currently do not support maximum integer digits");if(p)throw new Error("We currently do not support exact integer digits")}return""});continue}if(tn.test(i.stem)){t.minimumIntegerDigits=i.stem.length;continue}if(qr.test(i.stem)){if(i.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");i.stem.replace(qr,function(s,l,c,u,f,p){return c==="*"?t.minimumFractionDigits=l.length:u&&u[0]==="#"?t.maximumFractionDigits=u.length:f&&p?(t.minimumFractionDigits=f.length,t.maximumFractionDigits=f.length+p.length):(t.minimumFractionDigits=l.length,t.maximumFractionDigits=l.length),""}),i.options.length&&(t=b(b({},t),Zr(i.options[0])));continue}if(en.test(i.stem)){t=b(b({},t),Zr(i.stem));continue}var a=rn(i.stem);a&&(t=b(b({},t),a));var o=ki(i.stem);o&&(t=b(b({},t),o))}return t}var Bt,Ri=new RegExp("^"+Wt.source+"*"),Di=new RegExp(Wt.source+"*$");function E(e,t){return{start:e,end:t}}var Ui=!!String.prototype.startsWith,Mi=!!String.fromCodePoint,Gi=!!Object.fromEntries,Hi=!!String.prototype.codePointAt,Fi=!!String.prototype.trimStart,Xi=!!String.prototype.trimEnd,Yi=!!Number.isSafeInteger,Ki=Yi?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},qt=!0;try{an=cn("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),qt=((Bt=an.exec("a"))===null||Bt===void 0?void 0:Bt[0])==="a"}catch{qt=!1}var an,on=Ui?function(t,n,r){return t.startsWith(n,r)}:function(t,n,r){return t.slice(r,r+n.length)===n},Zt=Mi?String.fromCodePoint:function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];for(var r="",i=t.length,a=0,o;i>a;){if(o=t[a++],o>1114111)throw RangeError(o+" is not a valid code point");r+=o<65536?String.fromCharCode(o):String.fromCharCode(((o-=65536)>>10)+55296,o%1024+56320)}return r},sn=Gi?Object.fromEntries:function(t){for(var n={},r=0,i=t;r<i.length;r++){var a=i[r],o=a[0],s=a[1];n[o]=s}return n},ln=Hi?function(t,n){return t.codePointAt(n)}:function(t,n){var r=t.length;if(!(n<0||n>=r)){var i=t.charCodeAt(n),a;return i<55296||i>56319||n+1===r||(a=t.charCodeAt(n+1))<56320||a>57343?i:(i-55296<<10)+(a-56320)+65536}},zi=Fi?function(t){return t.trimStart()}:function(t){return t.replace(Ri,"")},ji=Xi?function(t){return t.trimEnd()}:function(t){return t.replace(Di,"")};function cn(e,t){return new RegExp(e,t)}var Jt;qt?($t=cn("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),Jt=function(t,n){var r;$t.lastIndex=n;var i=$t.exec(t);return(r=i[1])!==null&&r!==void 0?r:""}):Jt=function(t,n){for(var r=[];;){var i=ln(t,n);if(i===void 0||fn(i)||$i(i))break;r.push(i),n+=i>=65536?2:1}return Zt.apply(void 0,r)};var $t,un=function(){function e(t,n){n===void 0&&(n={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!n.ignoreTag,this.requiresOtherClause=!!n.requiresOtherClause,this.shouldParseSkeletons=!!n.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,n,r){for(var i=[];!this.isEOF();){var a=this.char();if(a===123){var o=this.parseArgument(t,r);if(o.err)return o;i.push(o.val)}else{if(a===125&&t>0)break;if(a===35&&(n==="plural"||n==="selectordinal")){var s=this.clonePosition();this.bump(),i.push({type:P.pound,location:E(s,this.clonePosition())})}else if(a===60&&!this.ignoreTag&&this.peek()===47){if(r)break;return this.error(d.UNMATCHED_CLOSING_TAG,E(this.clonePosition(),this.clonePosition()))}else if(a===60&&!this.ignoreTag&&Qt(this.peek()||0)){var o=this.parseTag(t,n);if(o.err)return o;i.push(o.val)}else{var o=this.parseLiteral(t,n);if(o.err)return o;i.push(o.val)}}}return{val:i,err:null}},e.prototype.parseTag=function(t,n){var r=this.clonePosition();this.bump();var i=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:P.literal,value:"<"+i+"/>",location:E(r,this.clonePosition())},err:null};if(this.bumpIf(">")){var a=this.parseMessage(t+1,n,!0);if(a.err)return a;var o=a.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!Qt(this.char()))return this.error(d.INVALID_TAG,E(s,this.clonePosition()));var l=this.clonePosition(),c=this.parseTagName();return i!==c?this.error(d.UNMATCHED_CLOSING_TAG,E(l,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:P.tag,value:i,children:o,location:E(r,this.clonePosition())},err:null}:this.error(d.INVALID_TAG,E(s,this.clonePosition())))}else return this.error(d.UNCLOSED_TAG,E(r,this.clonePosition()))}else return this.error(d.INVALID_TAG,E(r,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&Bi(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,n){for(var r=this.clonePosition(),i="";;){var a=this.tryParseQuote(n);if(a){i+=a;continue}var o=this.tryParseUnquoted(t,n);if(o){i+=o;continue}var s=this.tryParseLeftAngleBracket();if(s){i+=s;continue}break}var l=E(r,this.clonePosition());return{val:{type:P.literal,value:i,location:l},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!Wi(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var n=[this.char()];for(this.bump();!this.isEOF();){var r=this.char();if(r===39)if(this.peek()===39)n.push(39),this.bump();else{this.bump();break}else n.push(r);this.bump()}return Zt.apply(void 0,n)},e.prototype.tryParseUnquoted=function(t,n){if(this.isEOF())return null;var r=this.char();return r===60||r===123||r===35&&(n==="plural"||n==="selectordinal")||r===125&&t>0?null:(this.bump(),Zt(r))},e.prototype.parseArgument=function(t,n){var r=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(d.EXPECT_ARGUMENT_CLOSING_BRACE,E(r,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(d.EMPTY_ARGUMENT,E(r,this.clonePosition()));var i=this.parseIdentifierIfPossible().value;if(!i)return this.error(d.MALFORMED_ARGUMENT,E(r,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(d.EXPECT_ARGUMENT_CLOSING_BRACE,E(r,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:P.argument,value:i,location:E(r,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(d.EXPECT_ARGUMENT_CLOSING_BRACE,E(r,this.clonePosition())):this.parseArgumentOptions(t,n,i,r);default:return this.error(d.MALFORMED_ARGUMENT,E(r,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),n=this.offset(),r=Jt(this.message,n),i=n+r.length;this.bumpTo(i);var a=this.clonePosition(),o=E(t,a);return{value:r,location:o}},e.prototype.parseArgumentOptions=function(t,n,r,i){var a,o=this.clonePosition(),s=this.parseIdentifierIfPossible().value,l=this.clonePosition();switch(s){case"":return this.error(d.EXPECT_ARGUMENT_TYPE,E(o,l));case"number":case"date":case"time":{this.bumpSpace();var c=null;if(this.bumpIf(",")){this.bumpSpace();var u=this.clonePosition(),f=this.parseSimpleArgStyleIfPossible();if(f.err)return f;var p=ji(f.val);if(p.length===0)return this.error(d.EXPECT_ARGUMENT_STYLE,E(this.clonePosition(),this.clonePosition()));var m=E(u,this.clonePosition());c={style:p,styleLocation:m}}var T=this.tryParseArgumentClose(i);if(T.err)return T;var A=E(i,this.clonePosition());if(c&&on(c?.style,"::",0)){var v=zi(c.style.slice(2));if(s==="number"){var f=this.parseNumberSkeletonFromString(v,c.styleLocation);return f.err?f:{val:{type:P.number,value:r,location:A,style:f.val},err:null}}else{if(v.length===0)return this.error(d.EXPECT_DATE_TIME_SKELETON,A);var p={type:oe.dateTime,pattern:v,location:c.styleLocation,parsedOptions:this.shouldParseSkeletons?Br(v):{}},_=s==="date"?P.date:P.time;return{val:{type:_,value:r,location:A,style:p},err:null}}}return{val:{type:s==="number"?P.number:s==="date"?P.date:P.time,value:r,location:A,style:(a=c?.style)!==null&&a!==void 0?a:null},err:null}}case"plural":case"selectordinal":case"select":{var L=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(d.EXPECT_SELECT_ARGUMENT_OPTIONS,E(L,b({},L)));this.bumpSpace();var y=this.parseIdentifierIfPossible(),V=0;if(s!=="select"&&y.value==="offset"){if(!this.bumpIf(":"))return this.error(d.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,E(this.clonePosition(),this.clonePosition()));this.bumpSpace();var f=this.tryParseDecimalInteger(d.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,d.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(f.err)return f;this.bumpSpace(),y=this.parseIdentifierIfPossible(),V=f.val}var x=this.tryParsePluralOrSelectOptions(t,s,n,y);if(x.err)return x;var T=this.tryParseArgumentClose(i);if(T.err)return T;var O=E(i,this.clonePosition());return s==="select"?{val:{type:P.select,value:r,options:sn(x.val),location:O},err:null}:{val:{type:P.plural,value:r,options:sn(x.val),offset:V,pluralType:s==="plural"?"cardinal":"ordinal",location:O},err:null}}default:return this.error(d.INVALID_ARGUMENT_TYPE,E(o,l))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(d.EXPECT_ARGUMENT_CLOSING_BRACE,E(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,n=this.clonePosition();!this.isEOF();){var r=this.char();switch(r){case 39:{this.bump();var i=this.clonePosition();if(!this.bumpUntil("'"))return this.error(d.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,E(i,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(n.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(n.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,n){var r=[];try{r=Qr(t)}catch{return this.error(d.INVALID_NUMBER_SKELETON,n)}return{val:{type:oe.number,tokens:r,location:n,parsedOptions:this.shouldParseSkeletons?nn(r):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,n,r,i){for(var a,o=!1,s=[],l=new Set,c=i.value,u=i.location;;){if(c.length===0){var f=this.clonePosition();if(n!=="select"&&this.bumpIf("=")){var p=this.tryParseDecimalInteger(d.EXPECT_PLURAL_ARGUMENT_SELECTOR,d.INVALID_PLURAL_ARGUMENT_SELECTOR);if(p.err)return p;u=E(f,this.clonePosition()),c=this.message.slice(f.offset,this.offset())}else break}if(l.has(c))return this.error(n==="select"?d.DUPLICATE_SELECT_ARGUMENT_SELECTOR:d.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,u);c==="other"&&(o=!0),this.bumpSpace();var m=this.clonePosition();if(!this.bumpIf("{"))return this.error(n==="select"?d.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:d.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,E(this.clonePosition(),this.clonePosition()));var T=this.parseMessage(t+1,n,r);if(T.err)return T;var A=this.tryParseArgumentClose(m);if(A.err)return A;s.push([c,{value:T.val,location:E(m,this.clonePosition())}]),l.add(c),this.bumpSpace(),a=this.parseIdentifierIfPossible(),c=a.value,u=a.location}return s.length===0?this.error(n==="select"?d.EXPECT_SELECT_ARGUMENT_SELECTOR:d.EXPECT_PLURAL_ARGUMENT_SELECTOR,E(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!o?this.error(d.MISSING_OTHER_CLAUSE,E(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,n){var r=1,i=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(r=-1);for(var a=!1,o=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)a=!0,o=o*10+(s-48),this.bump();else break}var l=E(i,this.clonePosition());return a?(o*=r,Ki(o)?{val:o,err:null}:this.error(n,l)):this.error(t,l)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var n=ln(this.message,t);if(n===void 0)throw Error("Offset "+t+" is at invalid UTF-16 code unit boundary");return n},e.prototype.error=function(t,n){return{val:null,err:{kind:t,message:this.message,location:n}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(on(this.message,t,this.offset())){for(var n=0;n<t.length;n++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var n=this.offset(),r=this.message.indexOf(t,n);return r>=0?(this.bumpTo(r),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset "+t+" must be greater than or equal to the current offset "+this.offset());for(t=Math.min(t,this.message.length);;){var n=this.offset();if(n===t)break;if(n>t)throw Error("targetOffset "+t+" is at invalid UTF-16 code unit boundary");if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&fn(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),n=this.offset(),r=this.message.charCodeAt(n+(t>=65536?2:1));return r??null},e}();function Qt(e){return e>=97&&e<=122||e>=65&&e<=90}function Wi(e){return Qt(e)||e===47}function Bi(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function fn(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function $i(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function er(e){e.forEach(function(t){if(delete t.location,Qe(t)||et(t))for(var n in t.options)delete t.options[n].location,er(t.options[n].value);else qe(t)&&rt(t.style)||(Ze(t)||Je(t))&&Ne(t.style)?delete t.style.location:tt(t)&&er(t.children)})}function pn(e,t){t===void 0&&(t={}),t=b({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var n=new un(e,t).parse();if(n.err){var r=SyntaxError(d[n.err.kind]);throw r.location=n.err.location,r.originalMessage=n.err.message,r}return t?.captureLocation||er(n.val),n.val}function Ve(e,t){var n=t&&t.cache?t.cache:ta,r=t&&t.serializer?t.serializer:ea,i=t&&t.strategy?t.strategy:Zi;return i(e,{cache:n,serializer:r})}function qi(e){return e==null||typeof e=="number"||typeof e=="boolean"}function hn(e,t,n,r){var i=qi(r)?r:n(r),a=t.get(i);return typeof a>"u"&&(a=e.call(this,r),t.set(i,a)),a}function mn(e,t,n){var r=Array.prototype.slice.call(arguments,3),i=n(r),a=t.get(i);return typeof a>"u"&&(a=e.apply(this,r),t.set(i,a)),a}function tr(e,t,n,r,i){return n.bind(t,e,r,i)}function Zi(e,t){var n=e.length===1?hn:mn;return tr(e,this,n,t.cache.create(),t.serializer)}function Ji(e,t){return tr(e,this,mn,t.cache.create(),t.serializer)}function Qi(e,t){return tr(e,this,hn,t.cache.create(),t.serializer)}var ea=function(){return JSON.stringify(arguments)};function rr(){this.cache=Object.create(null)}rr.prototype.get=function(e){return this.cache[e]};rr.prototype.set=function(e,t){this.cache[e]=t};var ta={create:function(){return new rr}},nt={variadic:Ji,monadic:Qi};var se;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(se||(se={}));var Oe=function(e){Ie(t,e);function t(n,r,i){var a=e.call(this,n)||this;return a.code=r,a.originalMessage=i,a}return t.prototype.toString=function(){return"[formatjs Error: "+this.code+"] "+this.message},t}(Error);var nr=function(e){Ie(t,e);function t(n,r,i,a){return e.call(this,'Invalid values for "'+n+'": "'+r+'". Options are "'+Object.keys(i).join('", "')+'"',se.INVALID_VALUE,a)||this}return t}(Oe);var Tn=function(e){Ie(t,e);function t(n,r,i){return e.call(this,'Value for "'+n+'" must be of type '+r,se.INVALID_VALUE,i)||this}return t}(Oe);var An=function(e){Ie(t,e);function t(n,r){return e.call(this,'The intl string context variable "'+n+'" was not provided to the string "'+r+'"',se.MISSING_VALUE,r)||this}return t}(Oe);var k;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(k||(k={}));function ra(e){return e.length<2?e:e.reduce(function(t,n){var r=t[t.length-1];return!r||r.type!==k.literal||n.type!==k.literal?t.push(n):r.value+=n.value,t},[])}function na(e){return typeof e=="function"}function Ce(e,t,n,r,i,a,o){if(e.length===1&&jt(e[0]))return[{type:k.literal,value:e[0].value}];for(var s=[],l=0,c=e;l<c.length;l++){var u=c[l];if(jt(u)){s.push({type:k.literal,value:u.value});continue}if(Wr(u)){typeof a=="number"&&s.push({type:k.literal,value:n.getNumberFormat(t).format(a)});continue}var f=u.value;if(!(i&&f in i))throw new An(f,o);var p=i[f];if(jr(u)){(!p||typeof p=="string"||typeof p=="number")&&(p=typeof p=="string"||typeof p=="number"?String(p):""),s.push({type:typeof p=="string"?k.literal:k.object,value:p});continue}if(Ze(u)){var m=typeof u.style=="string"?r.date[u.style]:Ne(u.style)?u.style.parsedOptions:void 0;s.push({type:k.literal,value:n.getDateTimeFormat(t,m).format(p)});continue}if(Je(u)){var m=typeof u.style=="string"?r.time[u.style]:Ne(u.style)?u.style.parsedOptions:void 0;s.push({type:k.literal,value:n.getDateTimeFormat(t,m).format(p)});continue}if(qe(u)){var m=typeof u.style=="string"?r.number[u.style]:rt(u.style)?u.style.parsedOptions:void 0;m&&m.scale&&(p=p*(m.scale||1)),s.push({type:k.literal,value:n.getNumberFormat(t,m).format(p)});continue}if(tt(u)){var T=u.children,A=u.value,v=i[A];if(!na(v))throw new Tn(A,"function",o);var _=Ce(T,t,n,r,i,a),L=v(_.map(function(x){return x.value}));Array.isArray(L)||(L=[L]),s.push.apply(s,L.map(function(x){return{type:typeof x=="string"?k.literal:k.object,value:x}}))}if(Qe(u)){var y=u.options[p]||u.options.other;if(!y)throw new nr(u.value,p,Object.keys(u.options),o);s.push.apply(s,Ce(y.value,t,n,r,i));continue}if(et(u)){var y=u.options["="+p];if(!y){if(!Intl.PluralRules)throw new Oe(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,se.MISSING_INTL_API,o);var V=n.getPluralRules(t,{type:u.pluralType}).select(p-(u.offset||0));y=u.options[V]||u.options.other}if(!y)throw new nr(u.value,p,Object.keys(u.options),o);s.push.apply(s,Ce(y.value,t,n,r,i,p-(u.offset||0)));continue}}return ra(s)}function ia(e,t){return t?b(b(b({},e||{}),t||{}),Object.keys(e).reduce(function(n,r){return n[r]=b(b({},e[r]),t[r]||{}),n},{})):e}function aa(e,t){return t?Object.keys(e).reduce(function(n,r){return n[r]=ia(e[r],t[r]),n},b({},e)):e}function ir(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,n){e[t]=n}}}}}function oa(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:Ve(function(){for(var t,n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];return new((t=Intl.NumberFormat).bind.apply(t,$e([void 0],n)))},{cache:ir(e.number),strategy:nt.variadic}),getDateTimeFormat:Ve(function(){for(var t,n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];return new((t=Intl.DateTimeFormat).bind.apply(t,$e([void 0],n)))},{cache:ir(e.dateTime),strategy:nt.variadic}),getPluralRules:Ve(function(){for(var t,n=[],r=0;r<arguments.length;r++)n[r]=arguments[r];return new((t=Intl.PluralRules).bind.apply(t,$e([void 0],n)))},{cache:ir(e.pluralRules),strategy:nt.variadic})}}var dn=function(){function e(t,n,r,i){var a=this;if(n===void 0&&(n=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(o){var s=a.formatToParts(o);if(s.length===1)return s[0].value;var l=s.reduce(function(c,u){return!c.length||u.type!==k.literal||typeof c[c.length-1]!="string"?c.push(u.value):c[c.length-1]+=u.value,c},[]);return l.length<=1?l[0]||"":l},this.formatToParts=function(o){return Ce(a.ast,a.locales,a.formatters,a.formats,o,void 0,a.message)},this.resolvedOptions=function(){return{locale:Intl.NumberFormat.supportedLocalesOf(a.locales)[0]}},this.getAst=function(){return a.ast},typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:i?.ignoreTag})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=aa(e.formats,r),this.locales=n,this.formatters=i&&i.formatters||oa(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.__parse=pn,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var Sn=dn;var sa=/[0-9\-+#]/,la=/[^\d\-+#]/g;function En(e){return e.search(sa)}function ca(e="#.##"){let t={},n=e.length,r=En(e);t.prefix=r>0?e.substring(0,r):"";let i=En(e.split("").reverse().join("")),a=n-i,o=e.substring(a,a+1),s=a+(o==="."||o===","?1:0);t.suffix=i>0?e.substring(s,n):"",t.mask=e.substring(r,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let l=t.mask.match(la);return t.decimal=l&&l[l.length-1]||".",t.separator=l&&l[1]&&l[0]||",",l=t.mask.split(t.decimal),t.integer=l[0],t.fraction=l[1],t}function ua(e,t,n){let r=!1,i={value:e};e<0&&(r=!0,i.value=-i.value),i.sign=r?"-":"",i.value=Number(i.value).toFixed(t.fraction&&t.fraction.length),i.value=Number(i.value).toString();let a=t.fraction&&t.fraction.lastIndexOf("0"),[o="0",s=""]=i.value.split(".");return(!s||s&&s.length<=a)&&(s=a<0?"":(+("0."+s)).toFixed(a+1).replace("0.","")),i.integer=o,i.fraction=s,fa(i,t),(i.result==="0"||i.result==="")&&(r=!1,i.sign=""),!r&&t.maskHasPositiveSign?i.sign="+":r&&t.maskHasPositiveSign?i.sign="-":r&&(i.sign=n&&n.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),i}function fa(e,t){e.result="";let n=t.integer.split(t.separator),r=n.join(""),i=r&&r.indexOf("0");if(i>-1)for(;e.integer.length<r.length-i;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let a=n[1]&&n[n.length-1].length;if(a){let o=e.integer.length,s=o%a;for(let l=0;l<o;l++)e.result+=e.integer.charAt(l),!((l-s+1)%a)&&l<o-a&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function pa(e,t,n={}){if(!e||isNaN(Number(t)))return t;let r=ca(e),i=ua(t,r,n);return r.prefix+i.sign+i.result+r.suffix}var xn=pa;var bn=".",ha=",",Ln=/^\s+/,vn=/\s+$/,gn="&nbsp;",we={MONTH:"MONTH",YEAR:"YEAR"},ma={[I.ANNUAL]:12,[I.MONTHLY]:1,[I.THREE_YEARS]:36,[I.TWO_YEARS]:24},Ta={CHF:e=>Math.round(e*20)/20},ar=(e,t)=>({accept:e,round:t}),Aa=[ar(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),ar(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.ceil(Math.floor(t*1e4/e)/100)/100),ar(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],or={[w.YEAR]:{[I.MONTHLY]:we.MONTH,[I.ANNUAL]:we.YEAR},[w.MONTH]:{[I.MONTHLY]:we.MONTH}},da=(e,t)=>e.indexOf(`'${t}'`)===0,Sa=(e,t=!0)=>{let n=e.replace(/'.*?'/,"").trim(),r=Pn(n);return!!r?t||(n=n.replace(/[,\.]0+/,r)):n=n.replace(/\s?(#.*0)(?!\s)?/,"$&"+xa(e)),n},Ea=e=>{let t=ba(e),n=da(e,t),r=e.replace(/'.*?'/,""),i=Ln.test(r)||vn.test(r);return{currencySymbol:t,isCurrencyFirst:n,hasCurrencySpace:i}},yn=e=>e.replace(Ln,gn).replace(vn,gn),xa=e=>e.match(/#(.?)#/)?.[1]===bn?ha:bn,ba=e=>e.match(/'(.*?)'/)?.[1]??"",Pn=e=>e.match(/0(.?)0/)?.[1]??"";function it({formatString:e,price:t,usePrecision:n,isIndianPrice:r=!1},i,a=o=>o){let{currencySymbol:o,isCurrencyFirst:s,hasCurrencySpace:l}=Ea(e),c=n?Pn(e):"",u=Sa(e,n),f=n?2:0,p=a(t,{currencySymbol:o}),m=r?p.toLocaleString("hi-IN",{minimumFractionDigits:f,maximumFractionDigits:f}):xn(u,p),T=n?m.lastIndexOf(c):m.length,A=m.substring(0,T),v=m.substring(T+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,m).replace(/SYMBOL/,o),currencySymbol:o,decimals:v,decimalsDelimiter:c,hasCurrencySpace:l,integer:A,isCurrencyFirst:s,recurrenceTerm:i}}var _n=e=>{let{commitment:t,term:n,usePrecision:r}=e,i=ma[n]??1;return it(e,i>1?we.MONTH:or[t]?.[n],(a,{currencySymbol:o})=>{let s={divisor:i,price:a,usePrecision:r},{round:l}=Aa.find(({accept:u})=>u(s));if(!l)throw new Error(`Missing rounding rule for: ${JSON.stringify(s)}`);return(Ta[o]??(u=>u))(l(s))})},In=({commitment:e,term:t,...n})=>it(n,or[e]?.[t]),Nn=e=>{let{commitment:t,term:n}=e;return t===w.YEAR&&n===I.MONTHLY?it(e,we.YEAR,r=>r*12):it(e,or[t]?.[n])};var ga={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at {alternativePrice}",strikethroughAriaLabel:"Regularly at {strikethroughPrice}"},La=Xr("ConsonantTemplates/price"),va=/<.+?>/g,M={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAnnual:"price-annual",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},le={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel"},ya="TAX_EXCLUSIVE",Pa=e=>Fr(e)?Object.entries(e).filter(([,t])=>Ae(t)||je(t)||t===!0).reduce((t,[n,r])=>t+` ${n}${r===!0?"":'="'+Gr(r)+'"'}`,""):"",z=(e,t,n,r=!1)=>`<span class="${e}${t?"":" "+M.disabled}"${Pa(n)}>${r?yn(t):t??""}</span>`;function _a(e,{accessibleLabel:t,currencySymbol:n,decimals:r,decimalsDelimiter:i,hasCurrencySpace:a,integer:o,isCurrencyFirst:s,recurrenceLabel:l,perUnitLabel:c,taxInclusivityLabel:u},f={}){let p=z(M.currencySymbol,n),m=z(M.currencySpace,a?"&nbsp;":""),T="";return s&&(T+=p+m),T+=z(M.integer,o),T+=z(M.decimalsDelimiter,i),T+=z(M.decimals,r),s||(T+=m+p),T+=z(M.recurrence,l,null,!0),T+=z(M.unitType,c,null,!0),T+=z(M.taxInclusivity,u,!0),z(e,T,{...f,"aria-label":t})}var ce=({displayOptical:e=!1,displayStrikethrough:t=!1,displayAnnual:n=!1}={})=>({country:r,displayFormatted:i=!0,displayRecurrence:a=!0,displayPerUnit:o=!1,displayTax:s=!1,language:l,literals:c={}}={},{commitment:u,formatString:f,price:p,priceWithoutDiscount:m,taxDisplay:T,taxTerm:A,term:v,usePrecision:_}={},L={})=>{Object.entries({country:r,formatString:f,language:l,price:p}).forEach(([Q,Lt])=>{if(Lt==null)throw new Error(`Argument "${Q}" is missing`)});let y={...ga,...c},V=`${l.toLowerCase()}-${r.toUpperCase()}`;function x(Q,Lt){let vt=y[Q];if(vt==null)return"";try{return new Sn(vt.replace(va,""),V).format(Lt)}catch{return La.error("Failed to format literal:",vt),""}}let O=t&&m?m:p,C=e?_n:In;n&&(C=Nn);let{accessiblePrice:F,recurrenceTerm:X,...he}=C({commitment:u,formatString:f,term:v,price:e?p:O,usePrecision:_,isIndianPrice:r==="IN"}),Y=F,ne="";if(g(a)&&X){let Q=x(le.recurrenceAriaLabel,{recurrenceTerm:X});Q&&(Y+=" "+Q),ne=x(le.recurrenceLabel,{recurrenceTerm:X})}let ie="";if(g(o)){ie=x(le.perUnitLabel,{perUnit:"LICENSE"});let Q=x(le.perUnitAriaLabel,{perUnit:"LICENSE"});Q&&(Y+=" "+Q)}let K="";g(s)&&A&&(K=x(T===ya?le.taxExclusiveLabel:le.taxInclusiveLabel,{taxTerm:A}),K&&(Y+=" "+K)),t&&(Y=x(le.strikethroughAriaLabel,{strikethroughPrice:Y}));let J=M.container;if(e&&(J+=" "+M.containerOptical),t&&(J+=" "+M.containerStrikethrough),n&&(J+=" "+M.containerAnnual),g(i))return _a(J,{...he,accessibleLabel:Y,recurrenceLabel:ne,perUnitLabel:ie,taxInclusivityLabel:K},L);let{currencySymbol:ve,decimals:Ge,decimalsDelimiter:He,hasCurrencySpace:Fe,integer:Bn,isCurrencyFirst:$n}=he,me=[Bn,He,Ge];$n?(me.unshift(Fe?"\xA0":""),me.unshift(ve)):(me.push(Fe?"\xA0":""),me.push(ve)),me.push(ne,ie,K);let qn=me.join("");return z(J,qn,L)},Vn=()=>(e,t,n)=>{let i=(e.displayOldPrice===void 0||g(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${ce()(e,t,n)}${i?"&nbsp;"+ce({displayStrikethrough:!0})(e,t,n):""}`};var sr=ce(),lr=Vn(),cr=ce({displayOptical:!0}),ur=ce({displayStrikethrough:!0}),fr=ce({displayAnnual:!0});var Ia=(e,t)=>{if(!(!Se(e)||!Se(t)))return Math.floor((t-e)/t*100)},On=()=>(e,t,n)=>{let{price:r,priceWithoutDiscount:i}=t,a=Ia(r,i);return a===void 0?'<span class="no-discount"></span>':`<span class="discount">${a}%</span>`};var pr=On();var{freeze:ke}=Object,j=ke({...ae}),W=ke({...H}),ue={STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"},hr=ke({...w}),mr=ke({...Kr}),Tr=ke({...I});var gr={};ii(gr,{CLASS_NAME_FAILED:()=>at,CLASS_NAME_PENDING:()=>ot,CLASS_NAME_RESOLVED:()=>st,ERROR_MESSAGE_BAD_REQUEST:()=>lt,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>Na,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>Ar,EVENT_TYPE_ERROR:()=>Va,EVENT_TYPE_FAILED:()=>ct,EVENT_TYPE_PENDING:()=>ut,EVENT_TYPE_READY:()=>be,EVENT_TYPE_RESOLVED:()=>ft,LOG_NAMESPACE:()=>dr,Landscape:()=>fe,PARAM_AOS_API_KEY:()=>Oa,PARAM_ENV:()=>Sr,PARAM_LANDSCAPE:()=>Er,PARAM_WCS_API_KEY:()=>Ca,STATE_FAILED:()=>B,STATE_PENDING:()=>$,STATE_RESOLVED:()=>q,TAG_NAME_SERVICE:()=>Z,WCS_PROD_URL:()=>xr,WCS_STAGE_URL:()=>br});var at="placeholder-failed",ot="placeholder-pending",st="placeholder-resolved",lt="Bad WCS request",Ar="Commerce offer not found",Na="Literals URL not provided",Va="wcms:commerce:error",ct="wcms:placeholder:failed",ut="wcms:placeholder:pending",be="wcms:commerce:ready",ft="wcms:placeholder:resolved",dr="wcms/commerce",Sr="commerce.env",Er="commerce.landscape",Oa="commerce.aosKey",Ca="commerce.wcsKey",xr="https://www.adobe.com/web_commerce_artifact",br="https://www.stage.adobe.com/web_commerce_artifact_stage",B="failed",$="pending",q="resolved",Z="mas-commerce-service",fe={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"};var Lr={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals"],serializableTypes:["Array","Object"],sampleRate:30,tags:"consumer=milo/commerce"},Cn=new Set,wa=e=>e instanceof Error||typeof e.originatingRequest=="string";function wn(e){if(e==null)return;let t=typeof e;if(t==="function"){let{name:n}=e;return n?`${t} ${n}`:t}if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:r,originatingRequest:i,status:a}=e;return[r,a,i].filter(o=>o).join(" ")}let n=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!Lr.serializableTypes.includes(n))return n}return e}function ka(e,t){if(!Lr.ignoredProperties.includes(e))return wn(t)}var vr={append(e){let{delimiter:t,sampleRate:n,tags:r,clientId:i}=Lr,{message:a,params:o}=e,s=[],l=a,c=[];o.forEach(p=>{p!=null&&(wa(p)?s:c).push(p)}),s.length&&(l+=" ",l+=s.map(wn).join(" "));let{pathname:u,search:f}=window.location;l+=`${t}page=`,l+=u+f,c.length&&(l+=`${t}facts=`,l+=JSON.stringify(c,ka)),Cn.has(l)||(Cn.add(l),window.lana?.log(l,{sampleRate:n,tags:r,clientId:i}))}};var S=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflow:j.V3,checkoutWorkflowStep:W.EMAIL,country:"US",displayOldPrice:!0,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,env:ue.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsBufferDelay:1,wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:fe.PUBLISHED,wcsBufferLimit:1});function kn(e,{once:t=!1}={}){let n=null;function r(){let i=document.querySelector(Z);i!==n&&(n=i,i&&e(i))}return document.addEventListener(be,r,{once:t}),re(r),()=>document.removeEventListener(be,r)}function Re(e,{country:t,forceTaxExclusive:n,perpetual:r}){let i;if(e.length<2)i=e;else{let a=t==="GB"||r?"EN":"MULT",[o,s]=e;i=[o.language===a?o:s]}return n&&(i=i.map(Kt)),i}var re=e=>window.setTimeout(e);function ge(e,t=1){if(e==null)return[t];let n=(Array.isArray(e)?e:String(e).split(",")).map(xe).filter(Se);return n.length||(n=[t]),n}function pt(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(Ut)}function D(){return window.customElements.get(Z)?.instance}var Ra=`${S.language}_${S.country}`,h={ar:"AR_es",be_en:"BE_en",be_fr:"BE_fr",be_nl:"BE_nl",br:"BR_pt",ca:"CA_en",ch_de:"CH_de",ch_fr:"CH_fr",ch_it:"CH_it",cl:"CL_es",co:"CO_es",la:"DO_es",mx:"MX_es",pe:"PE_es",africa:"MU_en",dk:"DK_da",de:"DE_de",ee:"EE_et",eg_ar:"EG_ar",eg_en:"EG_en",es:"ES_es",fr:"FR_fr",gr_el:"GR_el",gr_en:"GR_en",ie:"IE_en",il_he:"IL_iw",it:"IT_it",lv:"LV_lv",lt:"LT_lt",lu_de:"LU_de",lu_en:"LU_en",lu_fr:"LU_fr",my_en:"MY_en",my_ms:"MY_ms",hu:"HU_hu",mt:"MT_en",mena_en:"DZ_en",mena_ar:"DZ_ar",nl:"NL_nl",no:"NO_nb",pl:"PL_pl",pt:"PT_pt",ro:"RO_ro",si:"SI_sl",sk:"SK_sk",fi:"FI_fi",se:"SE_sv",tr:"TR_tr",uk:"GB_en",at:"AT_de",cz:"CZ_cs",bg:"BG_bg",ru:"RU_ru",ua:"UA_uk",au:"AU_en",in_en:"IN_en",in_hi:"IN_hi",id_en:"ID_en",id_id:"ID_in",nz:"NZ_en",sa_ar:"SA_ar",sa_en:"SA_en",sg:"SG_en",cn:"CN_zh-Hans",tw:"TW_zh-Hant",hk_zh:"HK_zh-hant",jp:"JP_ja",kr:"KR_ko",za:"ZA_en",ng:"NG_en",cr:"CR_es",ec:"EC_es",pr:"US_es",gt:"GT_es",cis_en:"AZ_en",cis_ru:"AZ_ru",sea:"SG_en",th_en:"TH_en",th_th:"TH_th"};function Da(e){let t=e.prefix.replace("/","")??"",[n=S.country,r=S.language]=(h[t]??t).split("_",2);return n=n.toUpperCase(),r=r.toLowerCase(),{country:n,language:r,locale:`${r}_${n}`}}function yr({locale:e={},language:t=void 0}={}){if(e?.prefix)return Da(e);let n=typeof e=="string"?e:Ra;t??(t=n.split("_")?.[0]||S.language);let r=n.split("_")?.[1]||S.country;return{locale:n,country:r,language:t}}var ht=Object.freeze({LOCAL:"local",PROD:"prod",STAGE:"stage"});function Pr(e={}){let{commerce:t={},locale:n=void 0}=e,r=ue.PRODUCTION,i=xr,a=["local","stage"].includes(e.env?.name),o=N(Sr,t,{metadata:!1})?.toLowerCase()==="stage";a&&o&&(r=ue.STAGE,i=br);let s=N("checkoutClientId",t)??S.checkoutClientId,l=te(N("checkoutWorkflow",t),j,S.checkoutWorkflow),c=W.CHECKOUT;l===j.V3&&(c=te(N("checkoutWorkflowStep",t),W,S.checkoutWorkflowStep));let u=g(N("displayOldPrice",t),S.displayOldPrice),f=g(N("displayPerUnit",t),S.displayPerUnit),p=g(N("displayRecurrence",t),S.displayRecurrence),m=g(N("displayTax",t),S.displayTax),T=g(N("entitlement",t),S.entitlement),A=g(N("modal",t),S.modal),v=g(N("forceTaxExclusive",t),S.forceTaxExclusive),_=N("promotionCode",t)??S.promotionCode,L=ge(N("quantity",t)),y=N("wcsApiKey",t)??S.wcsApiKey,V=e.env?.name===ht.PROD?fe.PUBLISHED:te(N(Er,t),fe,S.landscape),x=xe(N("wcsBufferDelay",t),S.wcsBufferDelay),O=xe(N("wcsBufferLimit",t),S.wcsBufferLimit);return{...yr(e),displayOldPrice:u,checkoutClientId:s,checkoutWorkflow:l,checkoutWorkflowStep:c,displayPerUnit:f,displayRecurrence:p,displayTax:m,entitlement:T,extraOptions:S.extraOptions,modal:A,env:r,forceTaxExclusive:v,promotionCode:_,quantity:L,wcsApiKey:y,wcsBufferDelay:x,wcsBufferLimit:O,wcsURL:i,landscape:V}}var Dn="debug",Ua="error",Ma="info",Ga="warn",Ha=Date.now(),_r=new Set,Ir=new Set,Rn=new Map,De=Object.freeze({DEBUG:Dn,ERROR:Ua,INFO:Ma,WARN:Ga}),Un={append({level:e,message:t,params:n,timestamp:r,source:i}){console[e](`${r}ms [${i}] %c${t}`,"font-weight: bold;",...n)}},Mn={filter:({level:e})=>e!==Dn},Fa={filter:()=>!1};function Xa(e,t,n,r,i){return{level:e,message:t,namespace:n,get params(){if(r.length===1){let[a]=r;ee(a)&&(r=a(),Array.isArray(r)||(r=[r]))}return r},source:i,timestamp:Date.now()-Ha}}function Ya(e){[...Ir].every(t=>t(e))&&_r.forEach(t=>t(e))}function Gn(e){let t=(Rn.get(e)??0)+1;Rn.set(e,t);let n=`${e} #${t}`,r=a=>(o,...s)=>Ya(Xa(a,o,e,s,n)),i=Object.seal({id:n,namespace:e,module(a){return Gn(`${i.namespace}/${a}`)},debug:r(De.DEBUG),error:r(De.ERROR),info:r(De.INFO),warn:r(De.WARN)});return i}function mt(...e){e.forEach(t=>{let{append:n,filter:r}=t;ee(r)?Ir.add(r):ee(n)&&_r.add(n)})}function Ka(e={}){let{name:t}=e,n=g(N("commerce.debug",{search:!0,storage:!0}),t===ht.LOCAL);return mt(n?Un:Mn),t===ht.PROD&&mt(vr),R}function za(){_r.clear(),Ir.clear()}var R={...Gn(dr),Level:De,Plugins:{consoleAppender:Un,debugFilter:Mn,quietFilter:Fa,lanaAppender:vr},init:Ka,reset:za,use:mt};var ja={CLASS_NAME_FAILED:at,CLASS_NAME_PENDING:ot,CLASS_NAME_RESOLVED:st,EVENT_TYPE_FAILED:ct,EVENT_TYPE_PENDING:ut,EVENT_TYPE_RESOLVED:ft,STATE_FAILED:B,STATE_PENDING:$,STATE_RESOLVED:q},Wa={[B]:at,[$]:ot,[q]:st},Ba={[B]:ct,[$]:ut,[q]:ft},dt=new WeakMap;function U(e){if(!dt.has(e)){let t=R.module(e.constructor.is);dt.set(e,{changes:new Map,connected:!1,dispose:de,error:void 0,log:t,options:void 0,promises:[],state:$,timer:null,value:void 0,version:0})}return dt.get(e)}function Tt(e){let t=U(e),{error:n,promises:r,state:i}=t;(i===q||i===B)&&(t.promises=[],i===q?r.forEach(({resolve:a})=>a(e)):i===B&&r.forEach(({reject:a})=>a(n))),e.dispatchEvent(new CustomEvent(Ba[i],{bubbles:!0}))}function At(e){let t=dt.get(e);[B,$,q].forEach(n=>{e.classList.toggle(Wa[n],n===t.state)})}var $a={get error(){return U(this).error},get log(){return U(this).log},get options(){return U(this).options},get state(){return U(this).state},get value(){return U(this).value},attributeChangedCallback(e,t,n){U(this).changes.set(e,n),this.requestUpdate()},connectedCallback(){U(this).dispose=kn(()=>this.requestUpdate(!0))},disconnectedCallback(){let e=U(this);e.connected&&(e.connected=!1,e.log.debug("Disconnected:",{element:this})),e.dispose(),e.dispose=de},onceSettled(){let{error:e,promises:t,state:n}=U(this);return q===n?Promise.resolve(this):B===n?Promise.reject(e):new Promise((r,i)=>{t.push({resolve:r,reject:i})})},toggleResolved(e,t,n){let r=U(this);return e!==r.version?!1:(n!==void 0&&(r.options=n),r.state=q,r.value=t,At(this),this.log.debug("Resolved:",{element:this,value:t}),re(()=>Tt(this)),!0)},toggleFailed(e,t,n){let r=U(this);return e!==r.version?!1:(n!==void 0&&(r.options=n),r.error=t,r.state=B,At(this),r.log.error("Failed:",{element:this,error:t}),re(()=>Tt(this)),!0)},togglePending(e){let t=U(this);return t.version++,e&&(t.options=e),t.state=$,At(this),re(()=>Tt(this)),t.version},requestUpdate(e=!1){if(!this.isConnected||!D())return;let t=U(this);if(t.timer)return;let{error:n,options:r,state:i,value:a,version:o}=t;t.state=$,t.timer=re(async()=>{t.timer=null;let s=null;if(t.changes.size&&(s=Object.fromEntries(t.changes.entries()),t.changes.clear()),t.connected?t.log.debug("Updated:",{element:this,changes:s}):(t.connected=!0,t.log.debug("Connected:",{element:this,changes:s})),s||e)try{await this.render?.()===!1&&t.state===$&&t.version===o&&(t.state=i,t.error=n,t.value=a,At(this),Tt(this))}catch(l){this.toggleFailed(t.version,l,r)}})}};function Hn(e={}){return Object.entries(e).forEach(([t,n])=>{(n==null||n===""||n?.length===0)&&delete e[t]}),e}function St(e,t={}){let{tag:n,is:r}=e,i=document.createElement(n,{is:r});return i.setAttribute("is",r),Object.assign(i.dataset,Hn(t)),i}function Et(e){let{tag:t,is:n,prototype:r}=e,i=window.customElements.get(n);return i||(Object.defineProperties(r,Object.getOwnPropertyDescriptors($a)),i=Object.defineProperties(e,Object.getOwnPropertyDescriptors(ja)),window.customElements.define(n,i,{extends:t})),i}function xt(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,Hn(t)),e):null}var qa="download",Za="upgrade",pe,Ue=class Ue extends HTMLAnchorElement{constructor(){super();kr(this,pe,void 0);this.addEventListener("click",this.clickHandler)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}static createCheckoutLink(n={},r=""){let i=D();if(!i)return null;let{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:l,upgrade:c,modal:u,perpetual:f,promotionCode:p,quantity:m,wcsOsi:T,extraOptions:A}=i.collectCheckoutOptions(n),v=St(Ue,{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:l,upgrade:c,modal:u,perpetual:f,promotionCode:p,quantity:m,wcsOsi:T,extraOptions:A});return r&&(v.innerHTML=`<span>${r}</span>`),v}get isCheckoutLink(){return!0}get placeholder(){return this}clickHandler(n){var r;(r=yt(this,pe))==null||r.call(this,n)}async render(n={}){if(!this.isConnected)return!1;let r=D();if(!r)return!1;this.dataset.imsCountry||r.imsCountryPromise.then(u=>{u&&(this.dataset.imsCountry=u)},de);let i=r.collectCheckoutOptions(n,this.placeholder);if(!i.wcsOsi.length)return!1;let a;try{a=JSON.parse(i.extraOptions??"{}")}catch(u){this.placeholder.log.error("cannot parse exta checkout options",u)}let o=this.placeholder.togglePending(i);this.href="";let s=r.resolveOfferSelectors(i),l=await Promise.all(s);l=l.map(u=>Re(u,i));let c=await r.buildCheckoutAction(l.flat(),{...a,...i});return this.renderOffers(l.flat(),i,{},c,o)}renderOffers(n,r,i={},a=void 0,o=void 0){if(!this.isConnected)return!1;let s=D();if(!s)return!1;if(r={...JSON.parse(this.placeholder.dataset.extraOptions??"null"),...r,...i},o??(o=this.placeholder.togglePending(r)),yt(this,pe)&&Pt(this,pe,void 0),a){this.classList.remove(qa,Za),this.placeholder.toggleResolved(o,n,r);let{url:c,text:u,className:f,handler:p}=a;return c&&(this.href=c),u&&(this.firstElementChild.innerHTML=u),f&&this.classList.add(...f.split(" ")),p&&(this.setAttribute("href","#"),Pt(this,pe,p.bind(this))),!0}else if(n.length){if(this.placeholder.toggleResolved(o,n,r)){let c=s.buildCheckoutURL(n,r);return this.setAttribute("href",c),!0}}else{let c=new Error(`Not provided: ${r?.wcsOsi??"-"}`);if(this.placeholder.toggleFailed(o,c,r))return this.setAttribute("href","#"),!0}return!1}updateOptions(n={}){let r=D();if(!r)return!1;let{checkoutMarketSegment:i,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:l,modal:c,perpetual:u,promotionCode:f,quantity:p,wcsOsi:m}=r.collectCheckoutOptions(n);return xt(this,{checkoutMarketSegment:i,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:l,modal:c,perpetual:u,promotionCode:f,quantity:p,wcsOsi:m}),!0}};pe=new WeakMap,G(Ue,"is","checkout-link"),G(Ue,"tag","a");var Nr=Ue,bt=Et(Nr);var Fn=[h.uk,h.au,h.fr,h.at,h.be_en,h.be_fr,h.be_nl,h.bg,h.ch_de,h.ch_fr,h.ch_it,h.cz,h.de,h.dk,h.ee,h.eg_ar,h.eg_en,h.es,h.fi,h.fr,h.gr_el,h.gr_en,h.hu,h.ie,h.it,h.lu_de,h.lu_en,h.lu_fr,h.nl,h.no,h.pl,h.pt,h.ro,h.se,h.si,h.sk,h.tr,h.ua,h.id_en,h.id_id,h.in_en,h.in_hi,h.jp,h.my_en,h.my_ms,h.nz,h.th_en,h.th_th],Ja={INDIVIDUAL_COM:[h.za,h.lt,h.lv,h.ng,h.sa_ar,h.sa_en,h.za,h.sg,h.kr],TEAM_COM:[h.za,h.lt,h.lv,h.ng,h.za,h.co,h.kr],INDIVIDUAL_EDU:[h.lt,h.lv,h.sa_en,h.sea],TEAM_EDU:[h.sea,h.kr]},Me=class Me extends HTMLSpanElement{static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-perpetual","data-promotion-code","data-tax-exclusive","data-template","data-wcs-osi"]}static createInlinePrice(t){let n=D();if(!n)return null;let{displayOldPrice:r,displayPerUnit:i,displayRecurrence:a,displayTax:o,forceTaxExclusive:s,perpetual:l,promotionCode:c,quantity:u,template:f,wcsOsi:p}=n.collectPriceOptions(t);return St(Me,{displayOldPrice:r,displayPerUnit:i,displayRecurrence:a,displayTax:o,forceTaxExclusive:s,perpetual:l,promotionCode:c,quantity:u,template:f,wcsOsi:p})}get isInlinePrice(){return!0}get placeholder(){return this}resolveDisplayTaxForGeoAndSegment(t,n,r,i){let a=`${t}_${n}`;if(Fn.includes(t)||Fn.includes(a))return!0;let o=Ja[`${r}_${i}`];return o?!!(o.includes(t)||o.includes(a)):!1}async resolveDisplayTax(t,n){let[r]=await t.resolveOfferSelectors(n),i=Re(await r,n);if(i?.length){let{country:a,language:o}=n,s=i[0],[l=""]=s.marketSegments;return this.resolveDisplayTaxForGeoAndSegment(a,o,s.customerSegment,l)}}async render(t={}){if(!this.isConnected)return!1;let n=D();if(!n)return!1;let r=n.collectPriceOptions(t,this.placeholder);if(!r.wcsOsi.length)return!1;let i=this.placeholder.togglePending(r);this.innerHTML="";let[a]=n.resolveOfferSelectors(r);return this.renderOffers(Re(await a,r),r,i)}renderOffers(t,n={},r=void 0){if(!this.isConnected)return;let i=D();if(!i)return!1;let a=i.collectPriceOptions({...this.dataset,...n});if(r??(r=this.placeholder.togglePending(a)),t.length){if(this.placeholder.toggleResolved(r,t,a))return this.innerHTML=i.buildPriceHTML(t,a),!0}else{let o=new Error(`Not provided: ${a?.wcsOsi??"-"}`);if(this.placeholder.toggleFailed(r,o,a))return this.innerHTML="",!0}return!1}updateOptions(t){let n=D();if(!n)return!1;let{displayOldPrice:r,displayPerUnit:i,displayRecurrence:a,displayTax:o,forceTaxExclusive:s,perpetual:l,promotionCode:c,quantity:u,template:f,wcsOsi:p}=n.collectPriceOptions(t);return xt(this,{displayOldPrice:r,displayPerUnit:i,displayRecurrence:a,displayTax:o,forceTaxExclusive:s,perpetual:l,promotionCode:c,quantity:u,template:f,wcsOsi:p}),!0}};G(Me,"is","inline-price"),G(Me,"tag","span");var Vr=Me,gt=Et(Vr);function Or({providers:e,settings:t},n){let r=R.module("checkout");function i(l,c){let{checkoutClientId:u,checkoutWorkflow:f,checkoutWorkflowStep:p,country:m,language:T,promotionCode:A,quantity:v}=t,{checkoutMarketSegment:_,checkoutWorkflow:L=f,checkoutWorkflowStep:y=p,imsCountry:V,country:x=V??m,language:O=T,quantity:C=v,entitlement:F,upgrade:X,modal:he,perpetual:Y,promotionCode:ne=A,wcsOsi:ie,extraOptions:K,...J}=Object.assign({},c?.dataset??{},l??{}),ve=te(L,j,S.checkoutWorkflow),Ge=W.CHECKOUT;ve===j.V3&&(Ge=te(y,W,S.checkoutWorkflowStep));let He=Ee({...J,extraOptions:K,checkoutClientId:u,checkoutMarketSegment:_,country:x,quantity:ge(C,S.quantity),checkoutWorkflow:ve,checkoutWorkflowStep:Ge,language:O,entitlement:g(F),upgrade:g(X),modal:g(he),perpetual:g(Y),promotionCode:_e(ne).effectivePromoCode,wcsOsi:pt(ie)});if(c)for(let Fe of e.checkout)Fe(c,He);return He}async function a(l,c){let u=D(),f=await n.getCheckoutAction?.(l,c,u.imsSignedInPromise);return f||null}function o(l,c){if(!Array.isArray(l)||!l.length||!c)return"";let{env:u,landscape:f}=t,{checkoutClientId:p,checkoutMarketSegment:m,checkoutWorkflow:T,checkoutWorkflowStep:A,country:v,promotionCode:_,quantity:L,...y}=i(c),V=window.frameElement?"if":"fp",x={checkoutPromoCode:_,clientId:p,context:V,country:v,env:u,items:[],marketSegment:m,workflowStep:A,landscape:f,...y};if(l.length===1){let[{offerId:O,offerType:C,productArrangementCode:F}]=l,{marketSegments:[X]}=l[0];Object.assign(x,{marketSegment:X,offerType:C,productArrangementCode:F}),x.items.push(L[0]===1?{id:O}:{id:O,quantity:L[0]})}else x.items.push(...l.map(({offerId:O},C)=>({id:O,quantity:L[C]??S.quantity})));return Ot(T,x)}let{createCheckoutLink:s}=bt;return{CheckoutLink:bt,CheckoutWorkflow:j,CheckoutWorkflowStep:W,buildCheckoutAction:a,buildCheckoutURL:o,collectCheckoutOptions:i,createCheckoutLink:s}}function Qa({interval:e=200,maxAttempts:t=25}={}){let n=R.module("ims");return new Promise(r=>{n.debug("Waing for IMS to be ready");let i=0;function a(){window.adobeIMS?.initialized?r():++i>t?(n.debug("Timeout"),r()):setTimeout(a,e)}a()})}function eo(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function to(e){let t=R.module("ims");return e.then(n=>n?window.adobeIMS.getProfile().then(({countryCode:r})=>(t.debug("Got user country:",r),r),r=>{t.error("Unable to get user country:",r)}):null)}function Xn({}){let e=Qa(),t=eo(e),n=to(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:n}}async function Kn(e,t){let{data:n}=t||await Promise.resolve().then(()=>oi(Yn(),1));if(Array.isArray(n)){let r=a=>n.find(o=>ze(o.lang,a)),i=r(e.language)??r(S.language);if(i)return Object.freeze(i)}return{}}function zn({literals:e,providers:t,settings:n}){function r(o,s){let{country:l,displayOldPrice:c,displayPerUnit:u,displayRecurrence:f,displayTax:p,forceTaxExclusive:m,language:T,promotionCode:A,quantity:v}=n,{displayOldPrice:_=c,displayPerUnit:L=u,displayRecurrence:y=f,displayTax:V=p,forceTaxExclusive:x=m,country:O=l,language:C=T,perpetual:F,promotionCode:X=A,quantity:he=v,template:Y,wcsOsi:ne,...ie}=Object.assign({},s?.dataset??{},o??{}),K=Ee({...ie,country:O,displayOldPrice:g(_),displayPerUnit:g(L),displayRecurrence:g(y),displayTax:g(V),forceTaxExclusive:g(x),language:C,perpetual:g(F),promotionCode:_e(X).effectivePromoCode,quantity:ge(he,S.quantity),template:Y,wcsOsi:pt(ne)});if(s)for(let J of t.price)J(s,K);return K}function i(o,s){if(!Array.isArray(o)||!o.length||!s)return"";let{template:l}=s,c;switch(l){case"discount":c=pr;break;case"strikethrough":c=ur;break;case"optical":c=cr;break;case"annual":c=fr;break;default:c=s.promotionCode?lr:sr}let u=r(s);u.literals=Object.assign({},e.price,Ee(s.literals??{}));let[f]=o;return f={...f,...f.priceDetails},c(u,f)}let{createInlinePrice:a}=gt;return{InlinePrice:gt,buildPriceHTML:i,collectPriceOptions:r,createInlinePrice:a}}function jn({settings:e}){let t=R.module("wcs"),{env:n,wcsApiKey:r}=e,i=new Map,a=new Map,o;async function s(f,p,m=!0){let T=Ar;t.debug("Fetching:",f);try{f.offerSelectorIds=f.offerSelectorIds.sort();let A=new URL(e.wcsURL);A.searchParams.set("offer_selector_ids",f.offerSelectorIds.join(",")),A.searchParams.set("country",f.country),A.searchParams.set("locale",f.locale),A.searchParams.set("landscape",n===ue.STAGE?"ALL":e.landscape),A.searchParams.set("api_key",r),f.language&&A.searchParams.set("language",f.language),f.promotionCode&&A.searchParams.set("promotion_code",f.promotionCode),f.currency&&A.searchParams.set("currency",f.currency);let v=await fetch(A.toString(),{credentials:"omit"});if(v.ok){let _=await v.json();t.debug("Fetched:",f,_);let L=_.resolvedOffers??[];L=L.map(Be),p.forEach(({resolve:y},V)=>{let x=L.filter(({offerSelectorIds:O})=>O.includes(V)).flat();x.length&&(p.delete(V),y(x))})}else v.status===404&&f.offerSelectorIds.length>1?(t.debug("Multi-osi 404, fallback to fetch-by-one strategy"),await Promise.allSettled(f.offerSelectorIds.map(_=>s({...f,offerSelectorIds:[_]},p,!1)))):(T=lt,t.error(T,f))}catch(A){T=lt,t.error(T,f,A)}m&&p.size&&(t.debug("Missing:",{offerSelectorIds:[...p.keys()]}),p.forEach(A=>{A.reject(new Error(T))}))}function l(){clearTimeout(o);let f=[...a.values()];a.clear(),f.forEach(({options:p,promises:m})=>s(p,m))}function c(){let f=i.size;i.clear(),t.debug(`Flushed ${f} cache entries`)}function u({country:f,language:p,perpetual:m=!1,promotionCode:T="",wcsOsi:A=[]}){let v=`${p}_${f}`;f!=="GB"&&(p=m?"EN":"MULT");let _=[f,p,T].filter(L=>L).join("-").toLowerCase();return A.map(L=>{let y=`${L}-${_}`;if(!i.has(y)){let V=new Promise((x,O)=>{let C=a.get(_);if(!C){let F={country:f,locale:v,offerSelectorIds:[]};f!=="GB"&&(F.language=p),C={options:F,promises:new Map},a.set(_,C)}T&&(C.options.promotionCode=T),C.options.offerSelectorIds.push(L),C.promises.set(L,{resolve:x,reject:O}),C.options.offerSelectorIds.length>=e.wcsBufferLimit?l():(t.debug("Queued:",C.options),o||(o=setTimeout(l,e.wcsBufferDelay)))});i.set(y,V)}return i.get(y)})}return{WcsCommitment:hr,WcsPlanType:mr,WcsTerm:Tr,resolveOfferSelectors:u,flushWcsCache:c}}var Le=class Le extends HTMLElement{constructor(){super(...arguments);G(this,"promise",null);G(this,"startup",null);G(this,"dataProviders",null)}get config(){let{searchParams:n}=new URL(import.meta.url),i=(this.getAttribute("env")||n.get("env"))?.toLowerCase()==="stage",s={env:{name:i?"stage":"prod"},commerce:{"commerce.env":i?"STAGE":"PROD"}};return["locale","country","language"].forEach(l=>{let c=this.getAttribute(l);c&&(s[l]=c)}),s}registerCheckoutAction(n){typeof n=="function"&&(this.dataProviders={getCheckoutAction:n},this.startup&&Object.assign(this,{...Or(this.startup,this.dataProviders)}))}get autostart(){return this.getAttribute("autostart")||!1}async innerActivate(n,r,i){let a=R.init(r.env).module("service");a.debug("Activating:",r);let o={price:{}},s=Object.freeze(Pr(r));try{o.price=await Kn(s,r.commerce.priceLiterals)}catch(c){a.warn("Price literals were not fetched:",c)}let l={checkout:new Set,price:new Set};this.startup={literals:o,providers:l,settings:s},Le.instance=Object.defineProperties(this,Object.getOwnPropertyDescriptors({...Or(this.startup,i),...Xn(this.startup),...zn(this.startup),...jn(this.startup),...gr,Log:R,get defaults(){return S},get literals(){return o},get log(){return R},get providers(){return{checkout(c){return l.checkout.add(c),()=>l.checkout.delete(c)},price(c){return l.price.add(c),()=>l.price.delete(c)}}},get settings(){return s}})),a.debug("Activated:",{literals:o,settings:s}),re(()=>{let c=new CustomEvent(be,{bubbles:!0,cancelable:!1,detail:Le.instance});this.dispatchEvent(c)}),n(this)}async activate(n,r){return this.promise?this.promise:(Le.instance=this,this.promise=new Promise(i=>{this.innerActivate(i,{...this.config,...n},{...this.dataProviders,...r})}),this.promise)}connectedCallback(){this.autostart&&this.activate()}flushWcsCache(){this.flushWcsCache()}};G(Le,"instance");var Cr=Le;window.customElements.define(Z,Cr);function Wn(){document.head.querySelector(Z)?.remove(),R.reset()}function no(e,t){let n=ee(e)?e():{},r=ee(t)?t():{};r.force&&Wn();let i=document.querySelector(Z);if(i&&i.promise)return i.promise;i?.remove();let a=document.createElement(Z);return document.head.append(a),a.activate(n,r)}export{bt as CheckoutLink,j as CheckoutWorkflow,W as CheckoutWorkflowStep,S as Defaults,gt as InlinePrice,fe as Landscape,R as Log,Z as TAG_NAME_SERVICE,hr as WcsCommitment,mr as WcsPlanType,Tr as WcsTerm,Be as applyPlanType,yr as getLocaleSettings,Pr as getSettings,no as init,Wn as reset};
=======
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// price-literals.json
var require_price_literals = __commonJS({
  "price-literals.json"(exports, module) {
    module.exports = { total: 38, offset: 0, limit: 38, data: [{ lang: "ar", recurrenceLabel: "{recurrenceTerm, select, MONTH {/\u0627\u0644\u0634\u0647\u0631} YEAR {/\u0627\u0644\u0639\u0627\u0645} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {\u0643\u0644 \u0634\u0647\u0631} YEAR {\u0643\u0644 \u0639\u0627\u0645} other {}}", perUnitLabel: "{perUnit, select, LICENSE {\u0644\u0643\u0644 \u062A\u0631\u062E\u064A\u0635} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {\u0644\u0643\u0644 \u062A\u0631\u062E\u064A\u0635} other {}}", freeLabel: "\u0645\u062C\u0627\u0646\u064B\u0627", freeAriaLabel: "\u0645\u062C\u0627\u0646\u064B\u0627", taxExclusiveLabel: "{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}", alternativePriceAriaLabel: "\u0623\u0648 \u0628\u062F\u0644\u0627\u064B \u0645\u0646 \u0630\u0644\u0643 \u0628\u0642\u064A\u0645\u0629 {alternativePrice}", strikethroughAriaLabel: "\u0628\u0634\u0643\u0644 \u0645\u0646\u062A\u0638\u0645 \u0628\u0642\u064A\u0645\u0629 {strikethroughPrice}" }, { lang: "bg", recurrenceLabel: "{recurrenceTerm, select, MONTH {/\u043C\u0435\u0441.} YEAR {/\u0433\u043E\u0434.} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {\u043D\u0430 \u043C\u0435\u0441\u0435\u0446} YEAR {\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430} other {}}", perUnitLabel: "{perUnit, select, LICENSE {\u043D\u0430 \u043B\u0438\u0446\u0435\u043D\u0437} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {\u043D\u0430 \u043B\u0438\u0446\u0435\u043D\u0437} other {}}", freeLabel: "\u0411\u0435\u0437\u043F\u043B\u0430\u0442\u043D\u043E", freeAriaLabel: "\u0411\u0435\u0437\u043F\u043B\u0430\u0442\u043D\u043E", taxExclusiveLabel: "{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}", taxInclusiveLabel: "{incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}", alternativePriceAriaLabel: "\u0410\u043B\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u043E \u043D\u0430 {alternativePrice}", strikethroughAriaLabel: "\u0420\u0435\u0434\u043E\u0432\u043D\u043E \u043D\u0430 {strikethroughPrice}" }, { lang: "cs", recurrenceLabel: "{recurrenceTerm, select, MONTH {/m\u011Bs\xEDc} YEAR {/rok} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {za m\u011Bs\xEDc} YEAR {za rok} other {}}", perUnitLabel: "{perUnit, select, LICENSE {za licenci} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {za licenci} other {}}", freeLabel: "Zdarma", freeAriaLabel: "Zdarma", taxExclusiveLabel: "{taxTerm, select, GST {bez dan\u011B ze zbo\u017E\xED a slu\u017Eeb} VAT {bez DPH} TAX {bez dan\u011B} IVA {bez IVA} SST {bez SST} KDV {bez KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {v\u010Detn\u011B dan\u011B ze zbo\u017E\xED a slu\u017Eeb} VAT {v\u010Detn\u011B DPH} TAX {v\u010Detn\u011B dan\u011B} IVA {v\u010Detn\u011B IVA} SST {v\u010Detn\u011B SST} KDV {v\u010Detn\u011B KDV} other {}}", alternativePriceAriaLabel: "P\u0159\xEDpadn\u011B za {alternativePrice}", strikethroughAriaLabel: "Pravideln\u011B za {strikethroughPrice}" }, { lang: "da", recurrenceLabel: "{recurrenceTerm, select, MONTH {/md} YEAR {/\xE5r} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {pr. m\xE5ned} YEAR {pr. \xE5r} other {}}", perUnitLabel: "{perUnit, select, LICENSE {pr. licens} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {pr. licens} other {}}", freeLabel: "Gratis", freeAriaLabel: "Gratis", taxExclusiveLabel: "{taxTerm, select, GST {ekskl. GST} VAT {ekskl. moms} TAX {ekskl. skat} IVA {ekskl. IVA} SST {ekskl. SST} KDV {ekskl. KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. skat} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}", alternativePriceAriaLabel: "Alternativt til {alternativePrice}", strikethroughAriaLabel: "Normalpris {strikethroughPrice}" }, { lang: "de", recurrenceLabel: "{recurrenceTerm, select, MONTH {/Monat} YEAR {/Jahr} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {pro Monat} YEAR {pro Jahr} other {}}", perUnitLabel: "{perUnit, select, LICENSE {pro Lizenz} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {pro Lizenz} other {}}", freeLabel: "Kostenlos", freeAriaLabel: "Kostenlos", taxExclusiveLabel: "{taxTerm, select, GST {zzgl. GST} VAT {zzgl. MwSt.} TAX {zzgl. Steuern} IVA {zzgl. IVA} SST {zzgl. SST} KDV {zzgl. KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {inkl. GST} VAT {inkl. MwSt.} TAX {inkl. Steuern} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}", alternativePriceAriaLabel: "Alternativ: {alternativePrice}", strikethroughAriaLabel: "Regul\xE4r: {strikethroughPrice}" }, { lang: "en", recurrenceLabel: "{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}", perUnitLabel: "{perUnit, select, LICENSE {per license} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {per license} other {}}", freeLabel: "Free", freeAriaLabel: "Free", taxExclusiveLabel: "{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}", alternativePriceAriaLabel: "Alternatively at {alternativePrice}", strikethroughAriaLabel: "Regularly at {strikethroughPrice}" }, { lang: "et", recurrenceLabel: "{recurrenceTerm, select, MONTH {kuus} YEAR {aastas} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {kuus} YEAR {aastas} other {}}", perUnitLabel: "{perUnit, select, LICENSE {litsentsi kohta} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {litsentsi kohta} other {}}", freeLabel: "Tasuta", freeAriaLabel: "Tasuta", taxExclusiveLabel: "{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}", alternativePriceAriaLabel: "Teise v\xF5imalusena hinnaga {alternativePrice}", strikethroughAriaLabel: "Tavahind {strikethroughPrice}" }, { lang: "fi", recurrenceLabel: "{recurrenceTerm, select, MONTH {/kk} YEAR {/v} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {kuukausittain} YEAR {vuosittain} other {}}", perUnitLabel: "{perUnit, select, LICENSE {k\xE4ytt\xF6oikeutta kohti} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {k\xE4ytt\xF6oikeutta kohti} other {}}", freeLabel: "Maksuton", freeAriaLabel: "Maksuton", taxExclusiveLabel: "{taxTerm, select, GST {ilman GST:t\xE4} VAT {ilman ALV:t\xE4} TAX {ilman veroja} IVA {ilman IVA:ta} SST {ilman SST:t\xE4} KDV {ilman KDV:t\xE4} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {sis. GST:n} VAT {sis. ALV:n} TAX {sis. verot} IVA {sis. IVA:n} SST {sis. SST:n} KDV {sis. KDV:n} other {}}", alternativePriceAriaLabel: "Vaihtoehtoisesti hintaan {alternativePrice}", strikethroughAriaLabel: "S\xE4\xE4nn\xF6llisesti hintaan {strikethroughPrice}" }, { lang: "fr", recurrenceLabel: "{recurrenceTerm, select, MONTH {/mois} YEAR {/an} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {par mois} YEAR {par an} other {}}", perUnitLabel: "{perUnit, select, LICENSE {par licence} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {par licence} other {}}", freeLabel: "Gratuit", freeAriaLabel: "Gratuit", taxExclusiveLabel: "{taxTerm, select, GST {hors TPS} VAT {hors TVA} TAX {hors taxes} IVA {hors IVA} SST {hors SST} KDV {hors KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {TPS comprise} VAT {TVA comprise} TAX {taxes comprises} IVA {IVA comprise} SST {SST comprise} KDV {KDV comprise} other {}}", alternativePriceAriaLabel: "Autre prix {alternativePrice}", strikethroughAriaLabel: "Prix habituel {strikethroughPrice}" }, { lang: "he", recurrenceLabel: "{recurrenceTerm, select, MONTH {/\u05D7\u05D5\u05D3\u05E9} YEAR {/\u05E9\u05E0\u05D4} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {\u05DC\u05D7\u05D5\u05D3\u05E9} YEAR {\u05DC\u05E9\u05E0\u05D4} other {}}", perUnitLabel: "{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}", freeLabel: "\u05D7\u05D9\u05E0\u05DD", freeAriaLabel: "\u05D7\u05D9\u05E0\u05DD", taxExclusiveLabel: "{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}", alternativePriceAriaLabel: "\u05DC\u05D7\u05DC\u05D5\u05E4\u05D9\u05DF \u05D1-{alternativePrice}", strikethroughAriaLabel: "\u05D1\u05D0\u05D5\u05E4\u05DF \u05E7\u05D1\u05D5\u05E2 \u05D1-{strikethroughPrice}" }, { lang: "hu", recurrenceLabel: "{recurrenceTerm, select, MONTH {/h\xF3} YEAR {/\xE9v} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {havonta} YEAR {\xE9vente} other {}}", perUnitLabel: "{perUnit, select, LICENSE {licencenk\xE9nt} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {licencenk\xE9nt} other {}}", freeLabel: "Ingyenes", freeAriaLabel: "Ingyenes", taxExclusiveLabel: "{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}", alternativePriceAriaLabel: "M\xE1sik lehet\u0151s\xE9g: {alternativePrice}", strikethroughAriaLabel: "\xC1ltal\xE1ban {strikethroughPrice} \xE1ron" }, { lang: "it", recurrenceLabel: "{recurrenceTerm, select, MONTH {/mese} YEAR {/anno} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {al mese} YEAR {all'anno} other {}}", perUnitLabel: "{perUnit, select, LICENSE {per licenza} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {per licenza} other {}}", freeLabel: "Gratuito", freeAriaLabel: "Gratuito", taxExclusiveLabel: "{taxTerm, select, GST {escl. GST} VAT {escl. IVA.} TAX {escl. imposte} IVA {escl. IVA} SST {escl. SST} KDV {escl. KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {incl. GST} VAT {incl. IVA} TAX {incl. imposte} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}", alternativePriceAriaLabel: "In alternativa a {alternativePrice}", strikethroughAriaLabel: "Regolarmente a {strikethroughPrice}" }, { lang: "ja", recurrenceLabel: "{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {\u6BCE\u6708} YEAR {\u6BCE\u5E74} other {}}", perUnitLabel: "{perUnit, select, LICENSE {\u30E9\u30A4\u30BB\u30F3\u30B9\u3054\u3068} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {\u30E9\u30A4\u30BB\u30F3\u30B9\u3054\u3068} other {}}", freeLabel: "\u7121\u6599", freeAriaLabel: "\u7121\u6599", taxExclusiveLabel: "{taxTerm, select, GST {GST \u5225} VAT {VAT \u5225} TAX {\u7A0E\u5225} IVA {IVA \u5225} SST {SST \u5225} KDV {KDV \u5225} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {GST \u8FBC} VAT {VAT \u8FBC} TAX {\u7A0E\u8FBC} IVA {IVA \u8FBC} SST {SST \u8FBC} KDV {KDV \u8FBC} other {}}", alternativePriceAriaLabel: "\u7279\u5225\u4FA1\u683C : {alternativePrice}", strikethroughAriaLabel: "\u901A\u5E38\u4FA1\u683C : {strikethroughPrice}" }, { lang: "ko", recurrenceLabel: "{recurrenceTerm, select, MONTH {/\uC6D4} YEAR {/\uB144} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {\uC6D4\uAC04} YEAR {\uC5F0\uAC04} other {}}", perUnitLabel: "{perUnit, select, LICENSE {\uB77C\uC774\uC120\uC2A4\uB2F9} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {\uB77C\uC774\uC120\uC2A4\uB2F9} other {}}", freeLabel: "\uBB34\uB8CC", freeAriaLabel: "\uBB34\uB8CC", taxExclusiveLabel: "{taxTerm, select, GST {GST \uC81C\uC678} VAT {VAT \uC81C\uC678} TAX {\uC138\uAE08 \uC81C\uC678} IVA {IVA \uC81C\uC678} SST {SST \uC81C\uC678} KDV {KDV \uC81C\uC678} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {GST \uD3EC\uD568} VAT {VAT \uD3EC\uD568} TAX {\uC138\uAE08 \uD3EC\uD568} IVA {IVA \uD3EC\uD568} SST {SST \uD3EC\uD568} KDV {KDV \uD3EC\uD568} other {}}", alternativePriceAriaLabel: "\uB610\uB294 {alternativePrice}\uC5D0", strikethroughAriaLabel: "\uB610\uB294 {alternativePrice}\uC5D0" }, { lang: "lt", recurrenceLabel: "{recurrenceTerm, select, MONTH { per m\u0117n.} YEAR { per metus} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {per m\u0117n.} YEAR {per metus} other {}}", perUnitLabel: "{perUnit, select, LICENSE {u\u017E licencij\u0105} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {u\u017E licencij\u0105} other {}}", freeLabel: "Nemokamai", freeAriaLabel: "Nemokamai", taxExclusiveLabel: "{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}", alternativePriceAriaLabel: "Arba u\u017E {alternativePrice}", strikethroughAriaLabel: "Normaliai u\u017E {strikethroughPrice}" }, { lang: "lv", recurrenceLabel: "{recurrenceTerm, select, MONTH {m\u0113nes\u012B} YEAR {gad\u0101} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {m\u0113nes\u012B} YEAR {gad\u0101} other {}}", perUnitLabel: "{perUnit, select, LICENSE {vienai licencei} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {vienai licencei} other {}}", freeLabel: "Bezmaksas", freeAriaLabel: "Bezmaksas", taxExclusiveLabel: "{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}", alternativePriceAriaLabel: "Alternat\u012Bvi par {alternativePrice}", strikethroughAriaLabel: "Regul\u0101ri par {strikethroughPrice}" }, { lang: "nb", recurrenceLabel: "{recurrenceTerm, select, MONTH {/mnd.} YEAR {/\xE5r} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {per m\xE5ned} YEAR {per \xE5r} other {}}", perUnitLabel: "{perUnit, select, LICENSE {per lisens} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {per lisens} other {}}", freeLabel: "Fri", freeAriaLabel: "Fri", taxExclusiveLabel: "{taxTerm, select, GST {ekskl. GST} VAT {ekskl. moms} TAX {ekskl. avgift} IVA {ekskl. IVA} SST {ekskl. SST} KDV {ekskl. KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. avgift} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}", alternativePriceAriaLabel: "Alternativt til {alternativePrice}", strikethroughAriaLabel: "Regelmessig til {strikethroughPrice}" }, { lang: "nl", recurrenceLabel: "{recurrenceTerm, select, MONTH {/mnd} YEAR {/jr} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {per maand} YEAR {per jaar} other {}}", perUnitLabel: "{perUnit, select, LICENSE {per licentie} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {per licentie} other {}}", freeLabel: "Gratis", freeAriaLabel: "Gratis", taxExclusiveLabel: "{taxTerm, select, GST {excl. GST} VAT {excl. btw} TAX {excl. belasting} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {incl. GST} VAT {incl. btw} TAX {incl. belasting} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}", alternativePriceAriaLabel: "Nu {alternativePrice}", strikethroughAriaLabel: "Normaal {strikethroughPrice}" }, { lang: "pl", recurrenceLabel: "{recurrenceTerm, select, MONTH { / mies.} YEAR { / rok} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH { / miesi\u0105c} YEAR { / rok} other {}}", perUnitLabel: "{perUnit, select, LICENSE {za licencj\u0119} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {za licencj\u0119} other {}}", freeLabel: "Bezp\u0142atne", freeAriaLabel: "Bezp\u0142atne", taxExclusiveLabel: "{taxTerm, select, GST {bez GST} VAT {bez VAT} TAX {netto} IVA {bez IVA} SST {bez SST} KDV {bez KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {z GST} VAT {z VAT} TAX {brutto} IVA {z IVA} SST {z SST} KDV {z KDV} other {}}", alternativePriceAriaLabel: "Lub za {alternativePrice}", strikethroughAriaLabel: "Cena zwyk\u0142a: {strikethroughPrice}" }, { lang: "pt", recurrenceLabel: "{recurrenceTerm, select, MONTH {/m\xEAs} YEAR {/ano} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {por m\xEAs} YEAR {por ano} other {}}", perUnitLabel: "{perUnit, select, LICENSE {por licen\xE7a} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {por licen\xE7a} other {}}", freeLabel: "Gratuito", freeAriaLabel: "Gratuito", taxExclusiveLabel: "{taxTerm, select, GST {ICMS n\xE3o incluso} VAT {IVA n\xE3o incluso} TAX {impostos n\xE3o inclusos} IVA {IVA n\xE3o incluso} SST { SST n\xE3o incluso} KDV {KDV n\xE3o incluso} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {ICMS incluso} VAT {IVA incluso} TAX {impostos inclusos} IVA {IVA incluso} SST {SST incluso} KDV {KDV incluso} other {}}", alternativePriceAriaLabel: "Ou a {alternativePrice}", strikethroughAriaLabel: "Pre\xE7o normal: {strikethroughPrice}" }, { lang: "ro", recurrenceLabel: "{recurrenceTerm, select, MONTH {/lun\u0103} YEAR {/an} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {pe lun\u0103} YEAR {pe an} other {}}", perUnitLabel: "{perUnit, select, LICENSE {pe licen\u021B\u0103} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {pe licen\u021B\u0103} other {}}", freeLabel: "Gratuit", freeAriaLabel: "Gratuit", taxExclusiveLabel: "{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}", alternativePriceAriaLabel: "Alternativ, la {alternativePrice}", strikethroughAriaLabel: "\xCEn mod normal, la {strikethroughPrice}" }, { lang: "ru", recurrenceLabel: "{recurrenceTerm, select, MONTH {/\u043C\u0435\u0441.} YEAR {/\u0433.} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {\u0432 \u043C\u0435\u0441\u044F\u0446} YEAR {\u0432 \u0433\u043E\u0434} other {}}", perUnitLabel: "{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u044E} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u044E} other {}}", freeLabel: "\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E", freeAriaLabel: "\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E", taxExclusiveLabel: "{taxTerm, select, GST {\u0438\u0441\u043A\u043B. \u043D\u0430\u043B\u043E\u0433 \u043D\u0430 \u0442\u043E\u0432\u0430\u0440\u044B \u0438 \u0443\u0441\u043B\u0443\u0433\u0438} VAT {\u0438\u0441\u043A\u043B. \u041D\u0414\u0421} TAX {\u0438\u0441\u043A\u043B. \u043D\u0430\u043B\u043E\u0433} IVA {\u0438\u0441\u043A\u043B. \u0418\u0412\u0410} SST {\u0438\u0441\u043A\u043B. SST} KDV {\u0438\u0441\u043A\u043B. \u041A\u0414\u0412} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {\u0432\u043A\u043B. \u043D\u0430\u043B\u043E\u0433 \u043D\u0430 \u0442\u043E\u0432\u0430\u0440\u044B \u0438 \u0443\u0441\u043B\u0443\u0433\u0438} VAT {\u0432\u043A\u043B. \u041D\u0414\u0421} TAX {\u0432\u043A\u043B. \u043D\u0430\u043B\u043E\u0433} IVA {\u0432\u043A\u043B. \u0418\u0412\u0410} SST {\u0432\u043A\u043B. SST} KDV {\u0432\u043A\u043B. \u041A\u0414\u0412} other {}}", alternativePriceAriaLabel: "\u0410\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442 \u0437\u0430 {alternativePrice}", strikethroughAriaLabel: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E \u043F\u043E \u0446\u0435\u043D\u0435 {strikethroughPrice}" }, { lang: "sk", recurrenceLabel: "{recurrenceTerm, select, MONTH {/mesiac} YEAR {/rok} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {za mesiac} YEAR {za rok} other {}}", perUnitLabel: "{perUnit, select, LICENSE {za licenciu} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {za licenciu} other {}}", freeLabel: "Zadarmo", freeAriaLabel: "Zadarmo", taxExclusiveLabel: "{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}", alternativePriceAriaLabel: "Pr\xEDpadne za {alternativePrice}", strikethroughAriaLabel: "Pravidelne za {strikethroughPrice}" }, { lang: "sl", recurrenceLabel: "{recurrenceTerm, select, MONTH {/mesec} YEAR {/leto} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {na mesec} YEAR {na leto} other {}}", perUnitLabel: "{perUnit, select, LICENSE {na licenco} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {na licenco} other {}}", freeLabel: "Brezpla\u010Dno", freeAriaLabel: "Brezpla\u010Dno", taxExclusiveLabel: "{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}", alternativePriceAriaLabel: "Druga mo\u017Enost je: {alternativePrice}", strikethroughAriaLabel: "Redno po {strikethroughPrice}" }, { lang: "sv", recurrenceLabel: "{recurrenceTerm, select, MONTH {/m\xE5n} YEAR {/\xE5r} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {per m\xE5nad} YEAR {per \xE5r} other {}}", perUnitLabel: "{perUnit, select, LICENSE {per licens} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {per licens} other {}}", freeLabel: "Kostnadsfritt", freeAriaLabel: "Kostnadsfritt", taxExclusiveLabel: "{taxTerm, select, GST {exkl. GST} VAT {exkl. moms} TAX {exkl. skatt} IVA {exkl. IVA} SST {exkl. SST} KDV {exkl. KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. skatt} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}", alternativePriceAriaLabel: "Alternativt f\xF6r {alternativePrice}", strikethroughAriaLabel: "Normalpris {strikethroughPrice}" }, { lang: "tr", recurrenceLabel: "{recurrenceTerm, select, MONTH {/ay} YEAR {/y\u0131l} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {(ayl\u0131k)} YEAR {(y\u0131ll\u0131k)} other {}}", perUnitLabel: "{perUnit, select, LICENSE {(lisans ba\u015F\u0131na)} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {(lisans ba\u015F\u0131na)} other {}}", freeLabel: "\xDCcretsiz", freeAriaLabel: "\xDCcretsiz", taxExclusiveLabel: "{taxTerm, select, GST {GST hari\xE7} VAT {KDV hari\xE7} TAX {vergi hari\xE7} IVA {IVA hari\xE7} SST {SST hari\xE7} KDV {KDV hari\xE7} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {GST dahil} VAT {KDV dahil} TAX {vergi dahil} IVA {IVA dahil} SST {SST dahil} KDV {KDV dahil} other {}}", alternativePriceAriaLabel: "Ya da {alternativePrice}", strikethroughAriaLabel: "Standart fiyat: {strikethroughPrice}" }, { lang: "uk", recurrenceLabel: "{recurrenceTerm, select, MONTH {/\u043C\u0456\u0441.} YEAR {/\u0440\u0456\u043A} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {\u043D\u0430 \u043C\u0456\u0441\u044F\u0446\u044C} YEAR {\u043D\u0430 \u0440\u0456\u043A} other {}}", perUnitLabel: "{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0456\u0446\u0435\u043D\u0437\u0456\u044E} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0456\u0446\u0435\u043D\u0437\u0456\u044E} other {}}", freeLabel: "\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u043E", freeAriaLabel: "\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u043E", taxExclusiveLabel: "{taxTerm, select, GST {\u0431\u0435\u0437 GST} VAT {\u0431\u0435\u0437 \u041F\u0414\u0412} TAX {\u0431\u0435\u0437 \u043F\u043E\u0434\u0430\u0442\u043A\u0443} IVA {\u0431\u0435\u0437 IVA} SST {\u0431\u0435\u0437 SST} KDV {\u0431\u0435\u0437 KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 GST} VAT {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 \u041F\u0414\u0412} TAX {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 \u043F\u043E\u0434\u0430\u0442\u043A\u043E\u043C} IVA {\u0440\u0430\u0437\u043E\u043C \u0437 IVA} SST {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 SST} KDV {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 KDV} other {}}", alternativePriceAriaLabel: "\u0410\u0431\u043E \u0437\u0430 {alternativePrice}", strikethroughAriaLabel: "\u0417\u0432\u0438\u0447\u0430\u0439\u043D\u0430 \u0446\u0456\u043D\u0430 {strikethroughPrice}" }, { lang: "zh-hans", recurrenceLabel: "{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {\u6BCF\u6708} YEAR {\u6BCF\u5E74} other {}}", perUnitLabel: "{perUnit, select, LICENSE {\u6BCF\u4E2A\u8BB8\u53EF\u8BC1} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {\u6BCF\u4E2A\u8BB8\u53EF\u8BC1} other {}}", freeLabel: "\u514D\u8D39", freeAriaLabel: "\u514D\u8D39", taxExclusiveLabel: "{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}", alternativePriceAriaLabel: "\u6216\u5B9A\u4EF7 {alternativePrice}", strikethroughAriaLabel: "\u6B63\u5E38\u4EF7 {strikethroughPrice}" }, { lang: "zh-hant", recurrenceLabel: "{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {\u6BCF\u6708} YEAR {\u6BCF\u5E74} other {}}", perUnitLabel: "{perUnit, select, LICENSE {\u6BCF\u500B\u6388\u6B0A} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {\u6BCF\u500B\u6388\u6B0A} other {}}", freeLabel: "\u514D\u8CBB", freeAriaLabel: "\u514D\u8CBB", taxExclusiveLabel: "{taxTerm, select, GST {\u4E0D\u542B GST} VAT {\u4E0D\u542B VAT} TAX {\u4E0D\u542B\u7A05} IVA {\u4E0D\u542B IVA} SST {\u4E0D\u542B SST} KDV {\u4E0D\u542B KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {\u542B GST} VAT {\u542B VAT} TAX {\u542B\u7A05} IVA {\u542B IVA} SST {\u542B SST} KDV {\u542B KDV} other {}}", alternativePriceAriaLabel: "\u6216\u8005\u5728 {alternativePrice}", strikethroughAriaLabel: "\u6A19\u6E96\u50F9\u683C\u70BA {strikethroughPrice}" }, { lang: "es", recurrenceLabel: "{recurrenceTerm, select, MONTH {/mes} YEAR {/a\xF1o} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {al mes} YEAR {al a\xF1o} other {}}", perUnitLabel: "{perUnit, select, LICENSE {por licencia} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {por licencia} other {}}", freeLabel: "Gratuito", freeAriaLabel: "Gratuito", taxExclusiveLabel: "{taxTerm, select, GST {GST no incluido} VAT {IVA no incluido} TAX {Impuestos no incluidos} IVA {IVA no incluido} SST {SST no incluido} KDV {KDV no incluido} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {GST incluido} VAT {IVA incluido} TAX {Impuestos incluidos} IVA {IVA incluido} SST {SST incluido} KDV {KDV incluido} other {}}", alternativePriceAriaLabel: "Alternativamente por {alternativePrice}", strikethroughAriaLabel: "Normalmente a {strikethroughPrice}" }, { lang: "in", recurrenceLabel: "{recurrenceTerm, select, MONTH {/bulan} YEAR {/tahun} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {per bulan} YEAR {per tahun} other {}}", perUnitLabel: "{perUnit, select, LICENSE {per lisensi} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {per lisensi} other {}}", freeLabel: "Gratis", freeAriaLabel: "Gratis", taxExclusiveLabel: "{taxTerm, select, GST {tidak termasuk PBJ} VAT {tidak termasuk PPN} TAX {tidak termasuk pajak} IVA {tidak termasuk IVA} SST {tidak termasuk SST} KDV {tidak termasuk KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {termasuk PBJ} VAT {termasuk PPN} TAX {termasuk pajak} IVA {termasuk IVA} SST {termasuk SST} KDV {termasuk KDV} other {}}", alternativePriceAriaLabel: "Atau seharga {alternativePrice}", strikethroughAriaLabel: "Normalnya seharga {strikethroughPrice}" }, { lang: "vi", recurrenceLabel: "{recurrenceTerm, select, MONTH {/th\xE1ng} YEAR {/n\u0103m} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {m\u1ED7i th\xE1ng} YEAR {m\u1ED7i n\u0103m} other {}}", perUnitLabel: "{perUnit, select, LICENSE {m\u1ED7i gi\u1EA5y ph\xE9p} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {m\u1ED7i gi\u1EA5y ph\xE9p} other {}}", freeLabel: "Mi\u1EC5n ph\xED", freeAriaLabel: "Mi\u1EC5n ph\xED", taxExclusiveLabel: "{taxTerm, select, GST {ch\u01B0a bao g\u1ED3m thu\u1EBF h\xE0ng h\xF3a v\xE0 d\u1ECBch v\u1EE5} VAT {ch\u01B0a bao g\u1ED3m thu\u1EBF GTGT} TAX {ch\u01B0a bao g\u1ED3m thu\u1EBF} IVA {ch\u01B0a bao g\u1ED3m IVA} SST {ch\u01B0a bao g\u1ED3m SST} KDV {ch\u01B0a bao g\u1ED3m KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {(\u0111\xE3 bao g\u1ED3m thu\u1EBF h\xE0ng h\xF3a v\xE0 d\u1ECBch v\u1EE5)} VAT {(\u0111\xE3 bao g\u1ED3m thu\u1EBF GTGT)} TAX {(\u0111\xE3 bao g\u1ED3m thu\u1EBF)} IVA {(\u0111\xE3 bao g\u1ED3m IVA)} SST {(\u0111\xE3 bao g\u1ED3m SST)} KDV {(\u0111\xE3 bao g\u1ED3m KDV)} other {}}", alternativePriceAriaLabel: "Gi\xE1 \u01B0u \u0111\xE3i {alternativePrice}", strikethroughAriaLabel: "Gi\xE1 th\xF4ng th\u01B0\u1EDDng {strikethroughPrice}" }, { lang: "th", recurrenceLabel: "{recurrenceTerm, select, MONTH {/\u0E40\u0E14\u0E37\u0E2D\u0E19} YEAR {/\u0E1B\u0E35} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {\u0E15\u0E48\u0E2D\u0E40\u0E14\u0E37\u0E2D\u0E19} YEAR {\u0E15\u0E48\u0E2D\u0E1B\u0E35} other {}}", perUnitLabel: "{perUnit, select, LICENSE {\u0E15\u0E48\u0E2D\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {\u0E15\u0E48\u0E2D\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19} other {}}", freeLabel: "\u0E1F\u0E23\u0E35", freeAriaLabel: "\u0E1F\u0E23\u0E35", taxExclusiveLabel: "{taxTerm, select, GST {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35 GST} VAT {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 VAT} TAX {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35} IVA {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 IVA} SST {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 SST} KDV {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35 GST} VAT {\u0E23\u0E27\u0E21 VAT} TAX {\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35} IVA {\u0E23\u0E27\u0E21 IVA} SST {\u0E23\u0E27\u0E21 SST} KDV {\u0E23\u0E27\u0E21 KDV} other {}}", alternativePriceAriaLabel: "\u0E23\u0E32\u0E04\u0E32\u0E1E\u0E34\u0E40\u0E28\u0E29 {alternativePrice}", strikethroughAriaLabel: "\u0E23\u0E32\u0E04\u0E32\u0E1B\u0E01\u0E15\u0E34 {strikethroughPrice}" }, { lang: "el", recurrenceLabel: "{recurrenceTerm, select, MONTH {/\u03BC\u03AE\u03BD\u03B1} YEAR {/\u03AD\u03C4\u03BF\u03C2} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {\u03BA\u03AC\u03B8\u03B5 \u03BC\u03AE\u03BD\u03B1} YEAR {\u03B1\u03BD\u03AC \u03AD\u03C4\u03BF\u03C2} other {}}", perUnitLabel: "{perUnit, select, LICENSE {\u03B1\u03BD\u03AC \u03AC\u03B4\u03B5\u03B9\u03B1 \u03C7\u03C1\u03AE\u03C3\u03B7\u03C2} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {\u03B1\u03BD\u03AC \u03AC\u03B4\u03B5\u03B9\u03B1 \u03C7\u03C1\u03AE\u03C3\u03B7\u03C2} other {}}", freeLabel: "\u0394\u03C9\u03C1\u03B5\u03AC\u03BD", freeAriaLabel: "\u0394\u03C9\u03C1\u03B5\u03AC\u03BD", taxExclusiveLabel: "{taxTerm, select, GST {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 GST)} VAT {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03A6\u03A0\u0391)} TAX {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C6\u03CC\u03C1\u03BF)} IVA {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 IVA)} SST {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 SST)} KDV {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 KDV)} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 GST)} VAT {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03A6\u03A0\u0391)} TAX {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 \u03C6\u03CC\u03C1\u03BF\u03C5)} IVA {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 IVA)} SST {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 SST)} KDV {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 KDV)} other {}}", alternativePriceAriaLabel: "\u0394\u03B9\u03B1\u03C6\u03BF\u03C1\u03B5\u03C4\u03B9\u03BA\u03AC, {alternativePrice}", strikethroughAriaLabel: "\u039A\u03B1\u03BD\u03BF\u03BD\u03B9\u03BA\u03AE \u03C4\u03B9\u03BC\u03AE {strikethroughPrice}" }, { lang: "fil", recurrenceLabel: "{recurrenceTerm, select, MONTH {/buwan} YEAR {/taon} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {per buwan} YEAR {per taon} other {}}", perUnitLabel: "{perUnit, select, LICENSE {kada lisensya} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {kada lisensya} other {}}", freeLabel: "Libre", freeAriaLabel: "Libre", taxExclusiveLabel: "{taxTerm, select, GST {hindi kasama ang GST} VAT {hindi kasama ang VAT} TAX {hindi kasama ang Buwis} IVA {hindi kasama ang IVA} SST {hindi kasama ang SST} KDV {hindi kasama ang KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {kasama ang GST} VAT {kasama ang VAT} TAX {kasama ang Buwis} IVA {kasama ang IVA} SST {kasama ang SST} KDV {kasama ang KDV} other {}}", alternativePriceAriaLabel: "Alternatibong nasa halagang {alternativePrice}", strikethroughAriaLabel: "Regular na nasa halagang {strikethroughPrice}" }, { lang: "ms", recurrenceLabel: "{recurrenceTerm, select, MONTH {/bulan} YEAR {/tahun} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {per bulan} YEAR {per tahun} other {}}", perUnitLabel: "{perUnit, select, LICENSE {setiap lesen} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {setiap lesen} other {}}", freeLabel: "Percuma", freeAriaLabel: "Percuma", taxExclusiveLabel: "{taxTerm, select, GST {kecuali GST} VAT {kecuali VAT} TAX {kecuali Cukai} IVA {kecuali IVA} SST {kecuali SST} KDV {kecuali KDV} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {termasuk GST} VAT {termasuk VAT} TAX {termasuk Cukai} IVA {termasuk IVA} SST {termasuk SST} KDV {termasuk KDV} other {}}", alternativePriceAriaLabel: "Secara alternatif pada {alternativePrice}", strikethroughAriaLabel: "Biasanya pada {strikethroughPrice}" }, { lang: "hi", recurrenceLabel: "{recurrenceTerm, select, MONTH {/\u092E\u093E\u0939} YEAR {/\u0935\u0930\u094D\u0937} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {per \u092E\u093E\u0939} YEAR {per \u0935\u0930\u094D\u0937} other {}}", perUnitLabel: "{perUnit, select, LICENSE {\u092A\u094D\u0930\u0924\u093F \u0932\u093E\u0907\u0938\u0947\u0902\u0938} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {\u092A\u094D\u0930\u0924\u093F \u0932\u093E\u0907\u0938\u0947\u0902\u0938} other {}}", freeLabel: "\u092B\u093C\u094D\u0930\u0940", freeAriaLabel: "\u092B\u093C\u094D\u0930\u0940", taxExclusiveLabel: "{taxTerm, select, GST {GST \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} VAT {VAT \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} TAX {\u0915\u0930 \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} IVA {IVA \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} SST {SST \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} KDV {KDV \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} other {}}", taxInclusiveLabel: "{taxTerm, select, GST {GST \u0938\u0939\u093F\u0924} VAT {VAT \u0938\u0939\u093F\u0924} TAX {\u0915\u0930 \u0938\u0939\u093F\u0924} IVA {IVA \u0938\u0939\u093F\u0924} SST {SST \u0938\u0939\u093F\u0924} KDV {KDV \u0938\u0939\u093F\u0924} other {}}", alternativePriceAriaLabel: "\u0935\u0948\u0915\u0932\u094D\u092A\u093F\u0915 \u0930\u0942\u092A \u0938\u0947 \u0907\u0938 \u092A\u0930 {alternativePrice}", strikethroughAriaLabel: "\u0928\u093F\u092F\u092E\u093F\u0924 \u0930\u0942\u092A \u0938\u0947 \u0907\u0938 \u092A\u0930 {strikethroughPrice}" }, { lang: "iw", recurrenceLabel: "{recurrenceTerm, select, MONTH {/\u05D7\u05D5\u05D3\u05E9} YEAR {/\u05E9\u05E0\u05D4} other {}}", recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {\u05DC\u05D7\u05D5\u05D3\u05E9} YEAR {\u05DC\u05E9\u05E0\u05D4} other {}}", perUnitLabel: "{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}", perUnitAriaLabel: "{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}", freeLabel: "\u05D7\u05D9\u05E0\u05DD", freeAriaLabel: "\u05D7\u05D9\u05E0\u05DD", taxExclusiveLabel: '{taxTerm, select, GST {\u05DC\u05DC\u05D0 GST} VAT {\u05DC\u05DC\u05D0 \u05DE\u05E2"\u05DE} TAX {\u05DC\u05DC\u05D0 \u05DE\u05E1} IVA {\u05DC\u05DC\u05D0 IVA} SST {\u05DC\u05DC\u05D0 SST} KDV {\u05DC\u05DC\u05D0 KDV} other {}}', taxInclusiveLabel: '{taxTerm, select, GST {\u05DB\u05D5\u05DC\u05DC GST} VAT {\u05DB\u05D5\u05DC\u05DC \u05DE\u05E2"\u05DE} TAX {\u05DB\u05D5\u05DC\u05DC \u05DE\u05E1} IVA {\u05DB\u05D5\u05DC\u05DC IVA} SST {\u05DB\u05D5\u05DC\u05DC SST} KDV {\u05DB\u05D5\u05DC\u05DC KDV} other {}}', alternativePriceAriaLabel: "\u05DC\u05D7\u05DC\u05D5\u05E4\u05D9\u05DF \u05D1-{alternativePrice}", strikethroughAriaLabel: "\u05D1\u05D0\u05D5\u05E4\u05DF \u05E7\u05D1\u05D5\u05E2 \u05D1-{strikethroughPrice}" }], ":type": "sheet" };
  }
});

// ../node_modules/@pandora/data-source-utils/esm/types.js
var ProviderEnvironment;
(function(ProviderEnvironment2) {
  ProviderEnvironment2["STAGE"] = "STAGE";
  ProviderEnvironment2["PRODUCTION"] = "PRODUCTION";
  ProviderEnvironment2["LOCAL"] = "LOCAL";
})(ProviderEnvironment || (ProviderEnvironment = {}));
var Environment;
(function(Environment2) {
  Environment2["STAGE"] = "STAGE";
  Environment2["PRODUCTION"] = "PROD";
  Environment2["LOCAL"] = "LOCAL";
})(Environment || (Environment = {}));
var Landscape;
(function(Landscape3) {
  Landscape3["DRAFT"] = "DRAFT";
  Landscape3["PUBLISHED"] = "PUBLISHED";
})(Landscape || (Landscape = {}));

// ../node_modules/@pandora/commerce-checkout-url-builder/esm/CheckoutType.js
var CheckoutType;
(function(CheckoutType2) {
  CheckoutType2["V2"] = "UCv2";
  CheckoutType2["V3"] = "UCv3";
})(CheckoutType || (CheckoutType = {}));

// ../node_modules/@pandora/commerce-checkout-url-builder/esm/WorkflowStep.js
var WorkflowStep;
(function(WorkflowStep2) {
  WorkflowStep2["CHECKOUT"] = "checkout";
  WorkflowStep2["CHECKOUT_EMAIL"] = "checkout/email";
  WorkflowStep2["SEGMENTATION"] = "segmentation";
  WorkflowStep2["BUNDLE"] = "bundle";
  WorkflowStep2["COMMITMENT"] = "commitment";
  WorkflowStep2["RECOMMENDATION"] = "recommendation";
  WorkflowStep2["EMAIL"] = "email";
  WorkflowStep2["PAYMENT"] = "payment";
  WorkflowStep2["CHANGE_PLAN_TEAM_PLANS"] = "change-plan/team-upgrade/plans";
  WorkflowStep2["CHANGE_PLAN_TEAM_PAYMENT"] = "change-plan/team-upgrade/payment";
})(WorkflowStep || (WorkflowStep = {}));

// ../node_modules/@pandora/commerce-checkout-url-builder/esm/mapParameterName.js
var mapParameterName = function(field) {
  var _a2;
  return (_a2 = PARAMETERS.get(field)) !== null && _a2 !== void 0 ? _a2 : field;
};
var PARAMETERS = /* @__PURE__ */ new Map([
  ["countrySpecific", "cs"],
  ["quantity", "q"],
  ["authCode", "code"],
  ["checkoutPromoCode", "apc"],
  ["rurl", "rUrl"],
  ["curl", "cUrl"],
  ["ctxrturl", "ctxRtUrl"],
  ["country", "co"],
  ["language", "lang"],
  ["clientId", "cli"],
  ["context", "ctx"],
  ["productArrangementCode", "pa"],
  ["offerType", "ot"],
  ["marketSegment", "ms"]
]);

// ../node_modules/@pandora/commerce-checkout-url-builder/esm/build.js
var __values = function(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m)
    return m.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = function(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m)
    return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
      ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"]))
        m.call(i);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return ar;
};
function addParameters(inputParameters, resultParameters, allowedKeys) {
  var e_1, _a2;
  try {
    for (var _b = __values(Object.entries(inputParameters)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
      var mappedKey = mapParameterName(key);
      if (value != null && allowedKeys.has(mappedKey)) {
        resultParameters.set(mappedKey, value);
      }
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (_c && !_c.done && (_a2 = _b.return))
        _a2.call(_b);
    } finally {
      if (e_1)
        throw e_1.error;
    }
  }
}
function getHostName(env) {
  switch (env) {
    case ProviderEnvironment.PRODUCTION:
      return "https://commerce.adobe.com";
    default:
      return "https://commerce-stg.adobe.com";
  }
}
function setItemsParameter(items, parameters) {
  var e_2, _a2;
  for (var idx in items) {
    var item = items[idx];
    try {
      for (var _b = (e_2 = void 0, __values(Object.entries(item))), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
        if (value == null)
          continue;
        var parameterName = mapParameterName(key);
        parameters.set("items[" + idx + "][" + parameterName + "]", value);
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a2 = _b.return))
          _a2.call(_b);
      } finally {
        if (e_2)
          throw e_2.error;
      }
    }
  }
}

// ../node_modules/@pandora/commerce-checkout-url-builder/esm/ucv2/build-UCv2-url.js
var __rest = function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var __values2 = function(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m)
    return m.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
function buildUCv2Url(checkoutData) {
  validateCheckoutData(checkoutData);
  var env = checkoutData.env, items = checkoutData.items, workflowStep = checkoutData.workflowStep, rest = __rest(checkoutData, ["env", "items", "workflowStep"]);
  var url = new URL(getHostName(env));
  url.pathname = workflowStep + "/";
  setItemsParameter(items, url.searchParams);
  addParameters(rest, url.searchParams, ALLOWED_KEYS);
  return url.toString();
}
var ALLOWED_KEYS = /* @__PURE__ */ new Set([
  "cli",
  "co",
  "lang",
  "ctx",
  "cUrl",
  "mv",
  "nglwfdata",
  "otac",
  "promoid",
  "rUrl",
  "sdid",
  "spint",
  "trackingid",
  "code",
  "campaignid",
  "appctxid"
]);
var REQUIRED_KEYS = ["env", "workflowStep", "clientId", "country", "items"];
function validateCheckoutData(checkoutData) {
  var e_1, _a2;
  try {
    for (var REQUIRED_KEYS_1 = __values2(REQUIRED_KEYS), REQUIRED_KEYS_1_1 = REQUIRED_KEYS_1.next(); !REQUIRED_KEYS_1_1.done; REQUIRED_KEYS_1_1 = REQUIRED_KEYS_1.next()) {
      var key = REQUIRED_KEYS_1_1.value;
      if (!checkoutData[key]) {
        throw new Error('Argument "checkoutData" is not valid, missing: ' + key);
      }
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (REQUIRED_KEYS_1_1 && !REQUIRED_KEYS_1_1.done && (_a2 = REQUIRED_KEYS_1.return))
        _a2.call(REQUIRED_KEYS_1);
    } finally {
      if (e_1)
        throw e_1.error;
    }
  }
  return true;
}

// ../node_modules/@pandora/commerce-checkout-url-builder/esm/ucv3/build-UCv3-url.js
var __rest2 = function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var __values3 = function(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m)
    return m.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var AF_DRAFT_LANDSCAPE = "p_draft_landscape";
var UCV3_PREFIX = "/store/";
function buildUCv3Url(checkoutData) {
  validateCheckoutData2(checkoutData);
  var env = checkoutData.env, items = checkoutData.items, workflowStep = checkoutData.workflowStep, ms = checkoutData.ms, marketSegment = checkoutData.marketSegment, ot = checkoutData.ot, offerType = checkoutData.offerType, pa = checkoutData.pa, productArrangementCode = checkoutData.productArrangementCode, landscape = checkoutData.landscape, rest = __rest2(checkoutData, ["env", "items", "workflowStep", "ms", "marketSegment", "ot", "offerType", "pa", "productArrangementCode", "landscape"]);
  var segmentationParameters = {
    marketSegment: marketSegment !== null && marketSegment !== void 0 ? marketSegment : ms,
    offerType: offerType !== null && offerType !== void 0 ? offerType : ot,
    productArrangementCode: productArrangementCode !== null && productArrangementCode !== void 0 ? productArrangementCode : pa
  };
  var url = new URL(getHostName(env));
  url.pathname = "" + UCV3_PREFIX + workflowStep;
  if (workflowStep !== WorkflowStep.SEGMENTATION && workflowStep !== WorkflowStep.CHANGE_PLAN_TEAM_PLANS) {
    setItemsParameter(items, url.searchParams);
  }
  if (workflowStep === WorkflowStep.SEGMENTATION) {
    addParameters(segmentationParameters, url.searchParams, ALLOWED_KEYS2);
  }
  addParameters(rest, url.searchParams, ALLOWED_KEYS2);
  if (landscape === Landscape.DRAFT) {
    addParameters({ af: AF_DRAFT_LANDSCAPE }, url.searchParams, ALLOWED_KEYS2);
  }
  return url.toString();
}
var ALLOWED_KEYS2 = /* @__PURE__ */ new Set([
  "af",
  "ai",
  "apc",
  "appctxid",
  "cli",
  "co",
  "csm",
  "ctx",
  "ctxRtUrl",
  "DCWATC",
  "dp",
  "fr",
  "gsp",
  "ijt",
  "lang",
  "lo",
  "mal",
  "ms",
  "mv",
  "mv2",
  "nglwfdata",
  "ot",
  "otac",
  "pa",
  "pcid",
  "promoid",
  "q",
  "rf",
  "sc",
  "scl",
  "sdid",
  "sid",
  "spint",
  "svar",
  "th",
  "thm",
  "trackingid",
  "usid",
  "workflowid",
  "context.guid",
  "so.ca",
  "so.su",
  "so.tr",
  "so.va"
]);
var REQUIRED_KEYS2 = ["env", "workflowStep", "clientId", "country"];
function validateCheckoutData2(checkoutData) {
  var e_1, _a2;
  try {
    for (var REQUIRED_KEYS_1 = __values3(REQUIRED_KEYS2), REQUIRED_KEYS_1_1 = REQUIRED_KEYS_1.next(); !REQUIRED_KEYS_1_1.done; REQUIRED_KEYS_1_1 = REQUIRED_KEYS_1.next()) {
      var key = REQUIRED_KEYS_1_1.value;
      if (!checkoutData[key]) {
        throw new Error('Argument "checkoutData" is not valid, missing: ' + key);
      }
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (REQUIRED_KEYS_1_1 && !REQUIRED_KEYS_1_1.done && (_a2 = REQUIRED_KEYS_1.return))
        _a2.call(REQUIRED_KEYS_1);
    } finally {
      if (e_1)
        throw e_1.error;
    }
  }
  if (checkoutData.workflowStep !== WorkflowStep.SEGMENTATION && checkoutData.workflowStep !== WorkflowStep.CHANGE_PLAN_TEAM_PLANS && !checkoutData.items) {
    throw new Error('Argument "checkoutData" is not valid, missing: items');
  }
  return true;
}

// ../node_modules/@pandora/commerce-checkout-url-builder/esm/index.js
function buildCheckoutUrl(checkoutType, checkoutData) {
  switch (checkoutType) {
    case CheckoutType.V2:
      return buildUCv2Url(checkoutData);
    case CheckoutType.V3:
      return buildUCv3Url(checkoutData);
    default:
      console.warn("Unsupported CheckoutType, will use UCv3 as default. Given type: " + checkoutType);
      return buildUCv3Url(checkoutData);
  }
}

// ../node_modules/@pandora/data-models-odm/esm/businessDimensions.js
var OfferType;
(function(OfferType2) {
  OfferType2["BASE"] = "BASE";
  OfferType2["TRIAL"] = "TRIAL";
  OfferType2["PROMOTION"] = "PROMOTION";
})(OfferType || (OfferType = {}));
var Commitment;
(function(Commitment2) {
  Commitment2["MONTH"] = "MONTH";
  Commitment2["YEAR"] = "YEAR";
  Commitment2["TWO_YEARS"] = "TWO_YEARS";
  Commitment2["THREE_YEARS"] = "THREE_YEARS";
  Commitment2["PERPETUAL"] = "PERPETUAL";
  Commitment2["TERM_LICENSE"] = "TERM_LICENSE";
  Commitment2["ACCESS_PASS"] = "ACCESS_PASS";
  Commitment2["THREE_MONTHS"] = "THREE_MONTHS";
  Commitment2["SIX_MONTHS"] = "SIX_MONTHS";
})(Commitment || (Commitment = {}));
var Term;
(function(Term2) {
  Term2["ANNUAL"] = "ANNUAL";
  Term2["MONTHLY"] = "MONTHLY";
  Term2["TWO_YEARS"] = "TWO_YEARS";
  Term2["THREE_YEARS"] = "THREE_YEARS";
  Term2["P1D"] = "P1D";
  Term2["P1Y"] = "P1Y";
  Term2["P3Y"] = "P3Y";
  Term2["P10Y"] = "P10Y";
  Term2["P15Y"] = "P15Y";
  Term2["P3D"] = "P3D";
  Term2["P7D"] = "P7D";
  Term2["P30D"] = "P30D";
  Term2["HALF_YEARLY"] = "HALF_YEARLY";
  Term2["QUARTERLY"] = "QUARTERLY";
})(Term || (Term = {}));
var CustomerSegment;
(function(CustomerSegment2) {
  CustomerSegment2["INDIVIDUAL"] = "INDIVIDUAL";
  CustomerSegment2["TEAM"] = "TEAM";
  CustomerSegment2["ENTERPRISE"] = "ENTERPRISE";
})(CustomerSegment || (CustomerSegment = {}));
var MarketSegment;
(function(MarketSegment2) {
  MarketSegment2["COM"] = "COM";
  MarketSegment2["EDU"] = "EDU";
  MarketSegment2["GOV"] = "GOV";
})(MarketSegment || (MarketSegment = {}));
var SalesChannel;
(function(SalesChannel2) {
  SalesChannel2["DIRECT"] = "DIRECT";
  SalesChannel2["INDIRECT"] = "INDIRECT";
})(SalesChannel || (SalesChannel = {}));
var BuyingProgram;
(function(BuyingProgram2) {
  BuyingProgram2["ENTERPRISE_PRODUCT"] = "ENTERPRISE_PRODUCT";
  BuyingProgram2["ETLA"] = "ETLA";
  BuyingProgram2["RETAIL"] = "RETAIL";
  BuyingProgram2["VIP"] = "VIP";
  BuyingProgram2["VIPMP"] = "VIPMP";
  BuyingProgram2["FREE"] = "FREE";
})(BuyingProgram || (BuyingProgram = {}));

// ../node_modules/@dexter/tacocat-core/src/utilities.js
var namespace = "tacocat.js";
var equalsCaseInsensitive = (value1, value2) => String(value1 ?? "").toLowerCase() == String(value2 ?? "").toLowerCase();
var escapeHtml = (html) => `${html ?? ""}`.replace(
  /[&<>'"]/g,
  (tag) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[tag] ?? tag
) ?? "";
function getParameter(key, defaults = {}, { metadata = true, search = true, storage = true } = {}) {
  let param;
  if (search && param == null) {
    const params = new URLSearchParams(window.location.search);
    const searchKey = isString(search) ? search : key;
    param = params.get(searchKey);
  }
  if (storage && param == null) {
    const storageKey = isString(storage) ? storage : key;
    param = window.sessionStorage.getItem(storageKey) ?? window.localStorage.getItem(storageKey);
  }
  if (metadata && param == null) {
    const metadataKey = toKebabCase(isString(metadata) ? metadata : key);
    const element = document.documentElement.querySelector(
      `meta[name="${metadataKey}"]`
    );
    param = element?.content;
  }
  return param == null ? defaults[key] : param;
}
var ignore = () => {
};
var isBoolean = (value) => typeof value === "boolean";
var isFunction = (value) => typeof value === "function";
var isNumber = (value) => typeof value === "number";
var isObject = (value) => value != null && typeof value === "object";
var isString = (value) => typeof value === "string";
var isNotEmptyString = (value) => isString(value) && value;
var isPositiveFiniteNumber = (value) => isNumber(value) && Number.isFinite(value) && value > 0;
function omitProperties(target, test = (value) => value == null || value === "") {
  if (target != null) {
    Object.entries(target).forEach(([key, value]) => {
      if (test(value))
        delete target[key];
    });
  }
  return target;
}
function toBoolean(value, defaultValue) {
  if (isBoolean(value))
    return value;
  const string = String(value);
  if (string === "1" || string === "true")
    return true;
  if (string === "0" || string === "false")
    return false;
  return defaultValue;
}
function toEnumeration(value, enumeration, defaultValue) {
  const values = Object.values(enumeration);
  return values.find((candidate) => equalsCaseInsensitive(candidate, value)) ?? defaultValue ?? values[0];
}
function toKebabCase(value = "") {
  return String(value).replace(
    /(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,
    (_, p1, p2) => `${p1}-${p2}`
  ).replace(/\W+/gu, "-").toLowerCase();
}
function toPositiveFiniteInteger(value, defaultValue = 1) {
  if (!isNumber(value)) {
    value = Number.parseInt(value, 10);
  }
  if (!Number.isNaN(value) && value > 0 && Number.isFinite(value)) {
    return value;
  }
  return defaultValue;
}

// ../node_modules/@dexter/tacocat-core/src/log.js
var epoch = Date.now();
var suffix = () => `(+${Date.now() - epoch}ms)`;
var loggers = /* @__PURE__ */ new Set();
var isDebugEnabled = toBoolean(
  getParameter("tacocat.debug", {}, { metadata: false }),
  typeof process !== "undefined" && process.env?.DEBUG
);
function createLog(source) {
  const prefix = `[${namespace}/${source}]`;
  const assert = (condition, message, ...args) => {
    if (!condition) {
      error(message, ...args);
      return false;
    }
    return true;
  };
  const debug = isDebugEnabled ? (message, ...args) => {
    console.debug(`${prefix} ${message}`, ...args, suffix());
  } : () => {
  };
  const error = (message, ...args) => {
    const prefixedMessage = `${prefix} ${message}`;
    loggers.forEach(
      ([errorLogger]) => errorLogger(prefixedMessage, ...args)
    );
  };
  const warn = (message, ...args) => {
    const prefixedMessage = `${prefix} ${message}`;
    loggers.forEach(
      ([, warnLogger]) => warnLogger(prefixedMessage, ...args)
    );
  };
  return { assert, debug, error, warn };
}
function registerLogger(errorLogger, warnLogger) {
  const logger = [errorLogger, warnLogger];
  loggers.add(logger);
  return () => {
    loggers.delete(logger);
  };
}
registerLogger(
  (message, ...args) => {
    console.error(message, ...args, suffix());
  },
  (message, ...args) => {
    console.warn(message, ...args, suffix());
  }
);

// ../node_modules/@dexter/tacocat-core/src/promotion.js
var NO_PROMO_TEXT = "no promo";
var CLASS = "promo-tag";
var PROMO_VARIANT = "yellow";
var NOPROMO_VARIANT = "neutral";
var fullPromoText = (promo, old, isOverriden) => {
  const promoText = (promo2) => promo2 || NO_PROMO_TEXT;
  const suffix2 = isOverriden ? ` (was "${promoText(old)}")` : "";
  return `${promoText(promo)}${suffix2}`;
};
var PROMO_CONTEXT_CANCEL_VALUE = "cancel-context";
var computePromoStatus = (overriden, configured) => {
  const localPromoUnset = overriden === PROMO_CONTEXT_CANCEL_VALUE;
  const localPromoSet = !localPromoUnset && overriden?.length > 0;
  const isOverriden = (localPromoSet || localPromoUnset) && //in case configured equals override, we consider no override
  (configured && configured != overriden || //in case it does not have been configured, if overriden to cancel,
  // we consider no override
  !configured && !localPromoUnset);
  const isPromo = isOverriden && localPromoSet || !isOverriden && !!configured;
  const effectivePromoCode = isPromo ? overriden || configured : void 0;
  return {
    effectivePromoCode,
    overridenPromoCode: overriden,
    className: isPromo ? CLASS : `${CLASS} no-promo`,
    text: fullPromoText(effectivePromoCode, configured, isOverriden),
    variant: isPromo ? PROMO_VARIANT : NOPROMO_VARIANT,
    isOverriden
  };
};

// ../node_modules/@dexter/tacocat-core/src/wcsUtils.js
var ABM = "ABM";
var PUF = "PUF";
var M2M = "M2M";
var PERPETUAL = "PERPETUAL";
var P3Y = "P3Y";
var TAX_INCLUSIVE_DETAILS = "TAX_INCLUSIVE_DETAILS";
var TAX_EXCLUSIVE = "TAX_EXCLUSIVE";
var PlanType = {
  ABM,
  PUF,
  M2M,
  PERPETUAL,
  P3Y
};
var planTypes = {
  [ABM]: { commitment: Commitment.YEAR, term: Term.MONTHLY },
  [PUF]: { commitment: Commitment.YEAR, term: Term.ANNUAL },
  [M2M]: { commitment: Commitment.MONTH, term: Term.MONTHLY },
  [PERPETUAL]: { commitment: Commitment.PERPETUAL, term: void 0 },
  [P3Y]: { commitment: Commitment.THREE_MONTHS, term: Term.P3Y }
};
var errorValueNotOffer = "Value is not an offer";
var applyPlanType = (offer) => {
  if (typeof offer !== "object")
    return errorValueNotOffer;
  const { commitment, term } = offer;
  const planType = getPlanType(commitment, term);
  return { ...offer, planType };
};
var getPlanType = (commitment, term) => {
  switch (commitment) {
    case void 0:
      return errorValueNotOffer;
    case "":
      return "";
    case Commitment.YEAR:
      return term === Term.MONTHLY ? ABM : term === Term.ANNUAL ? PUF : "";
    case Commitment.MONTH:
      return term === Term.MONTHLY ? M2M : "";
    case Commitment.PERPETUAL:
      return PERPETUAL;
    case Commitment.TERM_LICENSE:
      return term === Term.P3Y ? P3Y : "";
    default:
      return "";
  }
};
function forceTaxExclusivePrice(offer) {
  const { priceDetails } = offer;
  const {
    price: price2,
    priceWithoutDiscount,
    priceWithoutTax,
    priceWithoutDiscountAndTax,
    taxDisplay
  } = priceDetails;
  if (taxDisplay !== TAX_INCLUSIVE_DETAILS)
    return offer;
  const amendedOffer = {
    ...offer,
    priceDetails: {
      ...priceDetails,
      price: priceWithoutTax ?? price2,
      priceWithoutDiscount: priceWithoutDiscountAndTax ?? priceWithoutDiscount,
      taxDisplay: TAX_EXCLUSIVE
    }
  };
  if (amendedOffer.offerType === "TRIAL" && amendedOffer.priceDetails.price === 0) {
    amendedOffer.priceDetails.price = amendedOffer.priceDetails.priceWithoutDiscount;
  }
  return amendedOffer;
}

// ../node_modules/tslib/tslib.es6.mjs
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2)
      if (Object.prototype.hasOwnProperty.call(b2, p))
        d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
}

// ../node_modules/@formatjs/icu-messageformat-parser/lib/error.js
var ErrorKind;
(function(ErrorKind2) {
  ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_CLOSING_BRACE"] = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE";
  ErrorKind2[ErrorKind2["EMPTY_ARGUMENT"] = 2] = "EMPTY_ARGUMENT";
  ErrorKind2[ErrorKind2["MALFORMED_ARGUMENT"] = 3] = "MALFORMED_ARGUMENT";
  ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_TYPE"] = 4] = "EXPECT_ARGUMENT_TYPE";
  ErrorKind2[ErrorKind2["INVALID_ARGUMENT_TYPE"] = 5] = "INVALID_ARGUMENT_TYPE";
  ErrorKind2[ErrorKind2["EXPECT_ARGUMENT_STYLE"] = 6] = "EXPECT_ARGUMENT_STYLE";
  ErrorKind2[ErrorKind2["INVALID_NUMBER_SKELETON"] = 7] = "INVALID_NUMBER_SKELETON";
  ErrorKind2[ErrorKind2["INVALID_DATE_TIME_SKELETON"] = 8] = "INVALID_DATE_TIME_SKELETON";
  ErrorKind2[ErrorKind2["EXPECT_NUMBER_SKELETON"] = 9] = "EXPECT_NUMBER_SKELETON";
  ErrorKind2[ErrorKind2["EXPECT_DATE_TIME_SKELETON"] = 10] = "EXPECT_DATE_TIME_SKELETON";
  ErrorKind2[ErrorKind2["UNCLOSED_QUOTE_IN_ARGUMENT_STYLE"] = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE";
  ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_OPTIONS"] = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS";
  ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE"] = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE";
  ErrorKind2[ErrorKind2["INVALID_PLURAL_ARGUMENT_OFFSET_VALUE"] = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE";
  ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_SELECTOR"] = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_SELECTOR"] = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT"] = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT";
  ErrorKind2[ErrorKind2["EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT"] = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT";
  ErrorKind2[ErrorKind2["INVALID_PLURAL_ARGUMENT_SELECTOR"] = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["DUPLICATE_PLURAL_ARGUMENT_SELECTOR"] = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["DUPLICATE_SELECT_ARGUMENT_SELECTOR"] = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR";
  ErrorKind2[ErrorKind2["MISSING_OTHER_CLAUSE"] = 22] = "MISSING_OTHER_CLAUSE";
  ErrorKind2[ErrorKind2["INVALID_TAG"] = 23] = "INVALID_TAG";
  ErrorKind2[ErrorKind2["INVALID_TAG_NAME"] = 25] = "INVALID_TAG_NAME";
  ErrorKind2[ErrorKind2["UNMATCHED_CLOSING_TAG"] = 26] = "UNMATCHED_CLOSING_TAG";
  ErrorKind2[ErrorKind2["UNCLOSED_TAG"] = 27] = "UNCLOSED_TAG";
})(ErrorKind || (ErrorKind = {}));

// ../node_modules/@formatjs/icu-messageformat-parser/lib/types.js
var TYPE;
(function(TYPE2) {
  TYPE2[TYPE2["literal"] = 0] = "literal";
  TYPE2[TYPE2["argument"] = 1] = "argument";
  TYPE2[TYPE2["number"] = 2] = "number";
  TYPE2[TYPE2["date"] = 3] = "date";
  TYPE2[TYPE2["time"] = 4] = "time";
  TYPE2[TYPE2["select"] = 5] = "select";
  TYPE2[TYPE2["plural"] = 6] = "plural";
  TYPE2[TYPE2["pound"] = 7] = "pound";
  TYPE2[TYPE2["tag"] = 8] = "tag";
})(TYPE || (TYPE = {}));
var SKELETON_TYPE;
(function(SKELETON_TYPE2) {
  SKELETON_TYPE2[SKELETON_TYPE2["number"] = 0] = "number";
  SKELETON_TYPE2[SKELETON_TYPE2["dateTime"] = 1] = "dateTime";
})(SKELETON_TYPE || (SKELETON_TYPE = {}));
function isLiteralElement(el) {
  return el.type === TYPE.literal;
}
function isArgumentElement(el) {
  return el.type === TYPE.argument;
}
function isNumberElement(el) {
  return el.type === TYPE.number;
}
function isDateElement(el) {
  return el.type === TYPE.date;
}
function isTimeElement(el) {
  return el.type === TYPE.time;
}
function isSelectElement(el) {
  return el.type === TYPE.select;
}
function isPluralElement(el) {
  return el.type === TYPE.plural;
}
function isPoundElement(el) {
  return el.type === TYPE.pound;
}
function isTagElement(el) {
  return el.type === TYPE.tag;
}
function isNumberSkeleton(el) {
  return !!(el && typeof el === "object" && el.type === SKELETON_TYPE.number);
}
function isDateTimeSkeleton(el) {
  return !!(el && typeof el === "object" && el.type === SKELETON_TYPE.dateTime);
}

// ../node_modules/@formatjs/icu-messageformat-parser/lib/regex.generated.js
var SPACE_SEPARATOR_REGEX = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;

// ../node_modules/@formatjs/icu-skeleton-parser/lib/date-time.js
var DATE_TIME_REGEX = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
function parseDateTimeSkeleton(skeleton) {
  var result = {};
  skeleton.replace(DATE_TIME_REGEX, function(match) {
    var len = match.length;
    switch (match[0]) {
      case "G":
        result.era = len === 4 ? "long" : len === 5 ? "narrow" : "short";
        break;
      case "y":
        result.year = len === 2 ? "2-digit" : "numeric";
        break;
      case "Y":
      case "u":
      case "U":
      case "r":
        throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");
      case "q":
      case "Q":
        throw new RangeError("`q/Q` (quarter) patterns are not supported");
      case "M":
      case "L":
        result.month = ["numeric", "2-digit", "short", "long", "narrow"][len - 1];
        break;
      case "w":
      case "W":
        throw new RangeError("`w/W` (week) patterns are not supported");
      case "d":
        result.day = ["numeric", "2-digit"][len - 1];
        break;
      case "D":
      case "F":
      case "g":
        throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");
      case "E":
        result.weekday = len === 4 ? "short" : len === 5 ? "narrow" : "short";
        break;
      case "e":
        if (len < 4) {
          throw new RangeError("`e..eee` (weekday) patterns are not supported");
        }
        result.weekday = ["short", "long", "narrow", "short"][len - 4];
        break;
      case "c":
        if (len < 4) {
          throw new RangeError("`c..ccc` (weekday) patterns are not supported");
        }
        result.weekday = ["short", "long", "narrow", "short"][len - 4];
        break;
      case "a":
        result.hour12 = true;
        break;
      case "b":
      case "B":
        throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");
      case "h":
        result.hourCycle = "h12";
        result.hour = ["numeric", "2-digit"][len - 1];
        break;
      case "H":
        result.hourCycle = "h23";
        result.hour = ["numeric", "2-digit"][len - 1];
        break;
      case "K":
        result.hourCycle = "h11";
        result.hour = ["numeric", "2-digit"][len - 1];
        break;
      case "k":
        result.hourCycle = "h24";
        result.hour = ["numeric", "2-digit"][len - 1];
        break;
      case "j":
      case "J":
      case "C":
        throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");
      case "m":
        result.minute = ["numeric", "2-digit"][len - 1];
        break;
      case "s":
        result.second = ["numeric", "2-digit"][len - 1];
        break;
      case "S":
      case "A":
        throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");
      case "z":
        result.timeZoneName = len < 4 ? "short" : "long";
        break;
      case "Z":
      case "O":
      case "v":
      case "V":
      case "X":
      case "x":
        throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead");
    }
    return "";
  });
  return result;
}

// ../node_modules/@formatjs/icu-skeleton-parser/lib/regex.generated.js
var WHITE_SPACE_REGEX = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;

// ../node_modules/@formatjs/icu-skeleton-parser/lib/number.js
function parseNumberSkeletonFromString(skeleton) {
  if (skeleton.length === 0) {
    throw new Error("Number skeleton cannot be empty");
  }
  var stringTokens = skeleton.split(WHITE_SPACE_REGEX).filter(function(x) {
    return x.length > 0;
  });
  var tokens = [];
  for (var _i = 0, stringTokens_1 = stringTokens; _i < stringTokens_1.length; _i++) {
    var stringToken = stringTokens_1[_i];
    var stemAndOptions = stringToken.split("/");
    if (stemAndOptions.length === 0) {
      throw new Error("Invalid number skeleton");
    }
    var stem = stemAndOptions[0], options = stemAndOptions.slice(1);
    for (var _a2 = 0, options_1 = options; _a2 < options_1.length; _a2++) {
      var option = options_1[_a2];
      if (option.length === 0) {
        throw new Error("Invalid number skeleton");
      }
    }
    tokens.push({ stem, options });
  }
  return tokens;
}
function icuUnitToEcma(unit) {
  return unit.replace(/^(.*?)-/, "");
}
var FRACTION_PRECISION_REGEX = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g;
var SIGNIFICANT_PRECISION_REGEX = /^(@+)?(\+|#+)?$/g;
var INTEGER_WIDTH_REGEX = /(\*)(0+)|(#+)(0+)|(0+)/g;
var CONCISE_INTEGER_WIDTH_REGEX = /^(0+)$/;
function parseSignificantPrecision(str) {
  var result = {};
  str.replace(SIGNIFICANT_PRECISION_REGEX, function(_, g1, g2) {
    if (typeof g2 !== "string") {
      result.minimumSignificantDigits = g1.length;
      result.maximumSignificantDigits = g1.length;
    } else if (g2 === "+") {
      result.minimumSignificantDigits = g1.length;
    } else if (g1[0] === "#") {
      result.maximumSignificantDigits = g1.length;
    } else {
      result.minimumSignificantDigits = g1.length;
      result.maximumSignificantDigits = g1.length + (typeof g2 === "string" ? g2.length : 0);
    }
    return "";
  });
  return result;
}
function parseSign(str) {
  switch (str) {
    case "sign-auto":
      return {
        signDisplay: "auto"
      };
    case "sign-accounting":
    case "()":
      return {
        currencySign: "accounting"
      };
    case "sign-always":
    case "+!":
      return {
        signDisplay: "always"
      };
    case "sign-accounting-always":
    case "()!":
      return {
        signDisplay: "always",
        currencySign: "accounting"
      };
    case "sign-except-zero":
    case "+?":
      return {
        signDisplay: "exceptZero"
      };
    case "sign-accounting-except-zero":
    case "()?":
      return {
        signDisplay: "exceptZero",
        currencySign: "accounting"
      };
    case "sign-never":
    case "+_":
      return {
        signDisplay: "never"
      };
  }
}
function parseConciseScientificAndEngineeringStem(stem) {
  var result;
  if (stem[0] === "E" && stem[1] === "E") {
    result = {
      notation: "engineering"
    };
    stem = stem.slice(2);
  } else if (stem[0] === "E") {
    result = {
      notation: "scientific"
    };
    stem = stem.slice(1);
  }
  if (result) {
    var signDisplay = stem.slice(0, 2);
    if (signDisplay === "+!") {
      result.signDisplay = "always";
      stem = stem.slice(2);
    } else if (signDisplay === "+?") {
      result.signDisplay = "exceptZero";
      stem = stem.slice(2);
    }
    if (!CONCISE_INTEGER_WIDTH_REGEX.test(stem)) {
      throw new Error("Malformed concise eng/scientific notation");
    }
    result.minimumIntegerDigits = stem.length;
  }
  return result;
}
function parseNotationOptions(opt) {
  var result = {};
  var signOpts = parseSign(opt);
  if (signOpts) {
    return signOpts;
  }
  return result;
}
function parseNumberSkeleton(tokens) {
  var result = {};
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    switch (token.stem) {
      case "percent":
      case "%":
        result.style = "percent";
        continue;
      case "%x100":
        result.style = "percent";
        result.scale = 100;
        continue;
      case "currency":
        result.style = "currency";
        result.currency = token.options[0];
        continue;
      case "group-off":
      case ",_":
        result.useGrouping = false;
        continue;
      case "precision-integer":
      case ".":
        result.maximumFractionDigits = 0;
        continue;
      case "measure-unit":
      case "unit":
        result.style = "unit";
        result.unit = icuUnitToEcma(token.options[0]);
        continue;
      case "compact-short":
      case "K":
        result.notation = "compact";
        result.compactDisplay = "short";
        continue;
      case "compact-long":
      case "KK":
        result.notation = "compact";
        result.compactDisplay = "long";
        continue;
      case "scientific":
        result = __assign(__assign(__assign({}, result), { notation: "scientific" }), token.options.reduce(function(all, opt) {
          return __assign(__assign({}, all), parseNotationOptions(opt));
        }, {}));
        continue;
      case "engineering":
        result = __assign(__assign(__assign({}, result), { notation: "engineering" }), token.options.reduce(function(all, opt) {
          return __assign(__assign({}, all), parseNotationOptions(opt));
        }, {}));
        continue;
      case "notation-simple":
        result.notation = "standard";
        continue;
      case "unit-width-narrow":
        result.currencyDisplay = "narrowSymbol";
        result.unitDisplay = "narrow";
        continue;
      case "unit-width-short":
        result.currencyDisplay = "code";
        result.unitDisplay = "short";
        continue;
      case "unit-width-full-name":
        result.currencyDisplay = "name";
        result.unitDisplay = "long";
        continue;
      case "unit-width-iso-code":
        result.currencyDisplay = "symbol";
        continue;
      case "scale":
        result.scale = parseFloat(token.options[0]);
        continue;
      case "integer-width":
        if (token.options.length > 1) {
          throw new RangeError("integer-width stems only accept a single optional option");
        }
        token.options[0].replace(INTEGER_WIDTH_REGEX, function(_, g1, g2, g3, g4, g5) {
          if (g1) {
            result.minimumIntegerDigits = g2.length;
          } else if (g3 && g4) {
            throw new Error("We currently do not support maximum integer digits");
          } else if (g5) {
            throw new Error("We currently do not support exact integer digits");
          }
          return "";
        });
        continue;
    }
    if (CONCISE_INTEGER_WIDTH_REGEX.test(token.stem)) {
      result.minimumIntegerDigits = token.stem.length;
      continue;
    }
    if (FRACTION_PRECISION_REGEX.test(token.stem)) {
      if (token.options.length > 1) {
        throw new RangeError("Fraction-precision stems only accept a single optional option");
      }
      token.stem.replace(FRACTION_PRECISION_REGEX, function(_, g1, g2, g3, g4, g5) {
        if (g2 === "*") {
          result.minimumFractionDigits = g1.length;
        } else if (g3 && g3[0] === "#") {
          result.maximumFractionDigits = g3.length;
        } else if (g4 && g5) {
          result.minimumFractionDigits = g4.length;
          result.maximumFractionDigits = g4.length + g5.length;
        } else {
          result.minimumFractionDigits = g1.length;
          result.maximumFractionDigits = g1.length;
        }
        return "";
      });
      if (token.options.length) {
        result = __assign(__assign({}, result), parseSignificantPrecision(token.options[0]));
      }
      continue;
    }
    if (SIGNIFICANT_PRECISION_REGEX.test(token.stem)) {
      result = __assign(__assign({}, result), parseSignificantPrecision(token.stem));
      continue;
    }
    var signOpts = parseSign(token.stem);
    if (signOpts) {
      result = __assign(__assign({}, result), signOpts);
    }
    var conciseScientificAndEngineeringOpts = parseConciseScientificAndEngineeringStem(token.stem);
    if (conciseScientificAndEngineeringOpts) {
      result = __assign(__assign({}, result), conciseScientificAndEngineeringOpts);
    }
  }
  return result;
}

// ../node_modules/@formatjs/icu-messageformat-parser/lib/parser.js
var _a;
var SPACE_SEPARATOR_START_REGEX = new RegExp("^" + SPACE_SEPARATOR_REGEX.source + "*");
var SPACE_SEPARATOR_END_REGEX = new RegExp(SPACE_SEPARATOR_REGEX.source + "*$");
function createLocation(start, end) {
  return { start, end };
}
var hasNativeStartsWith = !!String.prototype.startsWith;
var hasNativeFromCodePoint = !!String.fromCodePoint;
var hasNativeFromEntries = !!Object.fromEntries;
var hasNativeCodePointAt = !!String.prototype.codePointAt;
var hasTrimStart = !!String.prototype.trimStart;
var hasTrimEnd = !!String.prototype.trimEnd;
var hasNativeIsSafeInteger = !!Number.isSafeInteger;
var isSafeInteger = hasNativeIsSafeInteger ? Number.isSafeInteger : function(n) {
  return typeof n === "number" && isFinite(n) && Math.floor(n) === n && Math.abs(n) <= 9007199254740991;
};
var REGEX_SUPPORTS_U_AND_Y = true;
try {
  re = RE("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
  REGEX_SUPPORTS_U_AND_Y = ((_a = re.exec("a")) === null || _a === void 0 ? void 0 : _a[0]) === "a";
} catch (_) {
  REGEX_SUPPORTS_U_AND_Y = false;
}
var re;
var startsWith = hasNativeStartsWith ? (
  // Native
  function startsWith2(s, search, position) {
    return s.startsWith(search, position);
  }
) : (
  // For IE11
  function startsWith3(s, search, position) {
    return s.slice(position, position + search.length) === search;
  }
);
var fromCodePoint = hasNativeFromCodePoint ? String.fromCodePoint : (
  // IE11
  function fromCodePoint2() {
    var codePoints = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      codePoints[_i] = arguments[_i];
    }
    var elements = "";
    var length = codePoints.length;
    var i = 0;
    var code;
    while (length > i) {
      code = codePoints[i++];
      if (code > 1114111)
        throw RangeError(code + " is not a valid code point");
      elements += code < 65536 ? String.fromCharCode(code) : String.fromCharCode(((code -= 65536) >> 10) + 55296, code % 1024 + 56320);
    }
    return elements;
  }
);
var fromEntries = (
  // native
  hasNativeFromEntries ? Object.fromEntries : (
    // Ponyfill
    function fromEntries2(entries) {
      var obj = {};
      for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var _a2 = entries_1[_i], k = _a2[0], v = _a2[1];
        obj[k] = v;
      }
      return obj;
    }
  )
);
var codePointAt = hasNativeCodePointAt ? (
  // Native
  function codePointAt2(s, index) {
    return s.codePointAt(index);
  }
) : (
  // IE 11
  function codePointAt3(s, index) {
    var size = s.length;
    if (index < 0 || index >= size) {
      return void 0;
    }
    var first = s.charCodeAt(index);
    var second;
    return first < 55296 || first > 56319 || index + 1 === size || (second = s.charCodeAt(index + 1)) < 56320 || second > 57343 ? first : (first - 55296 << 10) + (second - 56320) + 65536;
  }
);
var trimStart = hasTrimStart ? (
  // Native
  function trimStart2(s) {
    return s.trimStart();
  }
) : (
  // Ponyfill
  function trimStart3(s) {
    return s.replace(SPACE_SEPARATOR_START_REGEX, "");
  }
);
var trimEnd = hasTrimEnd ? (
  // Native
  function trimEnd2(s) {
    return s.trimEnd();
  }
) : (
  // Ponyfill
  function trimEnd3(s) {
    return s.replace(SPACE_SEPARATOR_END_REGEX, "");
  }
);
function RE(s, flag) {
  return new RegExp(s, flag);
}
var matchIdentifierAtIndex;
if (REGEX_SUPPORTS_U_AND_Y) {
  IDENTIFIER_PREFIX_RE_1 = RE("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
  matchIdentifierAtIndex = function matchIdentifierAtIndex2(s, index) {
    var _a2;
    IDENTIFIER_PREFIX_RE_1.lastIndex = index;
    var match = IDENTIFIER_PREFIX_RE_1.exec(s);
    return (_a2 = match[1]) !== null && _a2 !== void 0 ? _a2 : "";
  };
} else {
  matchIdentifierAtIndex = function matchIdentifierAtIndex2(s, index) {
    var match = [];
    while (true) {
      var c = codePointAt(s, index);
      if (c === void 0 || _isWhiteSpace(c) || _isPatternSyntax(c)) {
        break;
      }
      match.push(c);
      index += c >= 65536 ? 2 : 1;
    }
    return fromCodePoint.apply(void 0, match);
  };
}
var IDENTIFIER_PREFIX_RE_1;
var Parser = (
  /** @class */
  function() {
    function Parser2(message, options) {
      if (options === void 0) {
        options = {};
      }
      this.message = message;
      this.position = { offset: 0, line: 1, column: 1 };
      this.ignoreTag = !!options.ignoreTag;
      this.requiresOtherClause = !!options.requiresOtherClause;
      this.shouldParseSkeletons = !!options.shouldParseSkeletons;
    }
    Parser2.prototype.parse = function() {
      if (this.offset() !== 0) {
        throw Error("parser can only be used once");
      }
      return this.parseMessage(0, "", false);
    };
    Parser2.prototype.parseMessage = function(nestingLevel, parentArgType, expectingCloseTag) {
      var elements = [];
      while (!this.isEOF()) {
        var char = this.char();
        if (char === 123) {
          var result = this.parseArgument(nestingLevel, expectingCloseTag);
          if (result.err) {
            return result;
          }
          elements.push(result.val);
        } else if (char === 125 && nestingLevel > 0) {
          break;
        } else if (char === 35 && (parentArgType === "plural" || parentArgType === "selectordinal")) {
          var position = this.clonePosition();
          this.bump();
          elements.push({
            type: TYPE.pound,
            location: createLocation(position, this.clonePosition())
          });
        } else if (char === 60 && !this.ignoreTag && this.peek() === 47) {
          if (expectingCloseTag) {
            break;
          } else {
            return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(this.clonePosition(), this.clonePosition()));
          }
        } else if (char === 60 && !this.ignoreTag && _isAlpha(this.peek() || 0)) {
          var result = this.parseTag(nestingLevel, parentArgType);
          if (result.err) {
            return result;
          }
          elements.push(result.val);
        } else {
          var result = this.parseLiteral(nestingLevel, parentArgType);
          if (result.err) {
            return result;
          }
          elements.push(result.val);
        }
      }
      return { val: elements, err: null };
    };
    Parser2.prototype.parseTag = function(nestingLevel, parentArgType) {
      var startPosition = this.clonePosition();
      this.bump();
      var tagName = this.parseTagName();
      this.bumpSpace();
      if (this.bumpIf("/>")) {
        return {
          val: {
            type: TYPE.literal,
            value: "<" + tagName + "/>",
            location: createLocation(startPosition, this.clonePosition())
          },
          err: null
        };
      } else if (this.bumpIf(">")) {
        var childrenResult = this.parseMessage(nestingLevel + 1, parentArgType, true);
        if (childrenResult.err) {
          return childrenResult;
        }
        var children = childrenResult.val;
        var endTagStartPosition = this.clonePosition();
        if (this.bumpIf("</")) {
          if (this.isEOF() || !_isAlpha(this.char())) {
            return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
          }
          var closingTagNameStartPosition = this.clonePosition();
          var closingTagName = this.parseTagName();
          if (tagName !== closingTagName) {
            return this.error(ErrorKind.UNMATCHED_CLOSING_TAG, createLocation(closingTagNameStartPosition, this.clonePosition()));
          }
          this.bumpSpace();
          if (!this.bumpIf(">")) {
            return this.error(ErrorKind.INVALID_TAG, createLocation(endTagStartPosition, this.clonePosition()));
          }
          return {
            val: {
              type: TYPE.tag,
              value: tagName,
              children,
              location: createLocation(startPosition, this.clonePosition())
            },
            err: null
          };
        } else {
          return this.error(ErrorKind.UNCLOSED_TAG, createLocation(startPosition, this.clonePosition()));
        }
      } else {
        return this.error(ErrorKind.INVALID_TAG, createLocation(startPosition, this.clonePosition()));
      }
    };
    Parser2.prototype.parseTagName = function() {
      var startOffset = this.offset();
      this.bump();
      while (!this.isEOF() && _isPotentialElementNameChar(this.char())) {
        this.bump();
      }
      return this.message.slice(startOffset, this.offset());
    };
    Parser2.prototype.parseLiteral = function(nestingLevel, parentArgType) {
      var start = this.clonePosition();
      var value = "";
      while (true) {
        var parseQuoteResult = this.tryParseQuote(parentArgType);
        if (parseQuoteResult) {
          value += parseQuoteResult;
          continue;
        }
        var parseUnquotedResult = this.tryParseUnquoted(nestingLevel, parentArgType);
        if (parseUnquotedResult) {
          value += parseUnquotedResult;
          continue;
        }
        var parseLeftAngleResult = this.tryParseLeftAngleBracket();
        if (parseLeftAngleResult) {
          value += parseLeftAngleResult;
          continue;
        }
        break;
      }
      var location = createLocation(start, this.clonePosition());
      return {
        val: { type: TYPE.literal, value, location },
        err: null
      };
    };
    Parser2.prototype.tryParseLeftAngleBracket = function() {
      if (!this.isEOF() && this.char() === 60 && (this.ignoreTag || // If at the opening tag or closing tag position, bail.
      !_isAlphaOrSlash(this.peek() || 0))) {
        this.bump();
        return "<";
      }
      return null;
    };
    Parser2.prototype.tryParseQuote = function(parentArgType) {
      if (this.isEOF() || this.char() !== 39) {
        return null;
      }
      switch (this.peek()) {
        case 39:
          this.bump();
          this.bump();
          return "'";
        case 123:
        case 60:
        case 62:
        case 125:
          break;
        case 35:
          if (parentArgType === "plural" || parentArgType === "selectordinal") {
            break;
          }
          return null;
        default:
          return null;
      }
      this.bump();
      var codePoints = [this.char()];
      this.bump();
      while (!this.isEOF()) {
        var ch = this.char();
        if (ch === 39) {
          if (this.peek() === 39) {
            codePoints.push(39);
            this.bump();
          } else {
            this.bump();
            break;
          }
        } else {
          codePoints.push(ch);
        }
        this.bump();
      }
      return fromCodePoint.apply(void 0, codePoints);
    };
    Parser2.prototype.tryParseUnquoted = function(nestingLevel, parentArgType) {
      if (this.isEOF()) {
        return null;
      }
      var ch = this.char();
      if (ch === 60 || ch === 123 || ch === 35 && (parentArgType === "plural" || parentArgType === "selectordinal") || ch === 125 && nestingLevel > 0) {
        return null;
      } else {
        this.bump();
        return fromCodePoint(ch);
      }
    };
    Parser2.prototype.parseArgument = function(nestingLevel, expectingCloseTag) {
      var openingBracePosition = this.clonePosition();
      this.bump();
      this.bumpSpace();
      if (this.isEOF()) {
        return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
      }
      if (this.char() === 125) {
        this.bump();
        return this.error(ErrorKind.EMPTY_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
      }
      var value = this.parseIdentifierIfPossible().value;
      if (!value) {
        return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
      }
      this.bumpSpace();
      if (this.isEOF()) {
        return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
      }
      switch (this.char()) {
        case 125: {
          this.bump();
          return {
            val: {
              type: TYPE.argument,
              // value does not include the opening and closing braces.
              value,
              location: createLocation(openingBracePosition, this.clonePosition())
            },
            err: null
          };
        }
        case 44: {
          this.bump();
          this.bumpSpace();
          if (this.isEOF()) {
            return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
          }
          return this.parseArgumentOptions(nestingLevel, expectingCloseTag, value, openingBracePosition);
        }
        default:
          return this.error(ErrorKind.MALFORMED_ARGUMENT, createLocation(openingBracePosition, this.clonePosition()));
      }
    };
    Parser2.prototype.parseIdentifierIfPossible = function() {
      var startingPosition = this.clonePosition();
      var startOffset = this.offset();
      var value = matchIdentifierAtIndex(this.message, startOffset);
      var endOffset = startOffset + value.length;
      this.bumpTo(endOffset);
      var endPosition = this.clonePosition();
      var location = createLocation(startingPosition, endPosition);
      return { value, location };
    };
    Parser2.prototype.parseArgumentOptions = function(nestingLevel, expectingCloseTag, value, openingBracePosition) {
      var _a2;
      var typeStartPosition = this.clonePosition();
      var argType = this.parseIdentifierIfPossible().value;
      var typeEndPosition = this.clonePosition();
      switch (argType) {
        case "":
          return this.error(ErrorKind.EXPECT_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
        case "number":
        case "date":
        case "time": {
          this.bumpSpace();
          var styleAndLocation = null;
          if (this.bumpIf(",")) {
            this.bumpSpace();
            var styleStartPosition = this.clonePosition();
            var result = this.parseSimpleArgStyleIfPossible();
            if (result.err) {
              return result;
            }
            var style = trimEnd(result.val);
            if (style.length === 0) {
              return this.error(ErrorKind.EXPECT_ARGUMENT_STYLE, createLocation(this.clonePosition(), this.clonePosition()));
            }
            var styleLocation = createLocation(styleStartPosition, this.clonePosition());
            styleAndLocation = { style, styleLocation };
          }
          var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
          if (argCloseResult.err) {
            return argCloseResult;
          }
          var location_1 = createLocation(openingBracePosition, this.clonePosition());
          if (styleAndLocation && startsWith(styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style, "::", 0)) {
            var skeleton = trimStart(styleAndLocation.style.slice(2));
            if (argType === "number") {
              var result = this.parseNumberSkeletonFromString(skeleton, styleAndLocation.styleLocation);
              if (result.err) {
                return result;
              }
              return {
                val: { type: TYPE.number, value, location: location_1, style: result.val },
                err: null
              };
            } else {
              if (skeleton.length === 0) {
                return this.error(ErrorKind.EXPECT_DATE_TIME_SKELETON, location_1);
              }
              var style = {
                type: SKELETON_TYPE.dateTime,
                pattern: skeleton,
                location: styleAndLocation.styleLocation,
                parsedOptions: this.shouldParseSkeletons ? parseDateTimeSkeleton(skeleton) : {}
              };
              var type = argType === "date" ? TYPE.date : TYPE.time;
              return {
                val: { type, value, location: location_1, style },
                err: null
              };
            }
          }
          return {
            val: {
              type: argType === "number" ? TYPE.number : argType === "date" ? TYPE.date : TYPE.time,
              value,
              location: location_1,
              style: (_a2 = styleAndLocation === null || styleAndLocation === void 0 ? void 0 : styleAndLocation.style) !== null && _a2 !== void 0 ? _a2 : null
            },
            err: null
          };
        }
        case "plural":
        case "selectordinal":
        case "select": {
          var typeEndPosition_1 = this.clonePosition();
          this.bumpSpace();
          if (!this.bumpIf(",")) {
            return this.error(ErrorKind.EXPECT_SELECT_ARGUMENT_OPTIONS, createLocation(typeEndPosition_1, __assign({}, typeEndPosition_1)));
          }
          this.bumpSpace();
          var identifierAndLocation = this.parseIdentifierIfPossible();
          var pluralOffset = 0;
          if (argType !== "select" && identifierAndLocation.value === "offset") {
            if (!this.bumpIf(":")) {
              return this.error(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, createLocation(this.clonePosition(), this.clonePosition()));
            }
            this.bumpSpace();
            var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, ErrorKind.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);
            if (result.err) {
              return result;
            }
            this.bumpSpace();
            identifierAndLocation = this.parseIdentifierIfPossible();
            pluralOffset = result.val;
          }
          var optionsResult = this.tryParsePluralOrSelectOptions(nestingLevel, argType, expectingCloseTag, identifierAndLocation);
          if (optionsResult.err) {
            return optionsResult;
          }
          var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
          if (argCloseResult.err) {
            return argCloseResult;
          }
          var location_2 = createLocation(openingBracePosition, this.clonePosition());
          if (argType === "select") {
            return {
              val: {
                type: TYPE.select,
                value,
                options: fromEntries(optionsResult.val),
                location: location_2
              },
              err: null
            };
          } else {
            return {
              val: {
                type: TYPE.plural,
                value,
                options: fromEntries(optionsResult.val),
                offset: pluralOffset,
                pluralType: argType === "plural" ? "cardinal" : "ordinal",
                location: location_2
              },
              err: null
            };
          }
        }
        default:
          return this.error(ErrorKind.INVALID_ARGUMENT_TYPE, createLocation(typeStartPosition, typeEndPosition));
      }
    };
    Parser2.prototype.tryParseArgumentClose = function(openingBracePosition) {
      if (this.isEOF() || this.char() !== 125) {
        return this.error(ErrorKind.EXPECT_ARGUMENT_CLOSING_BRACE, createLocation(openingBracePosition, this.clonePosition()));
      }
      this.bump();
      return { val: true, err: null };
    };
    Parser2.prototype.parseSimpleArgStyleIfPossible = function() {
      var nestedBraces = 0;
      var startPosition = this.clonePosition();
      while (!this.isEOF()) {
        var ch = this.char();
        switch (ch) {
          case 39: {
            this.bump();
            var apostrophePosition = this.clonePosition();
            if (!this.bumpUntil("'")) {
              return this.error(ErrorKind.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, createLocation(apostrophePosition, this.clonePosition()));
            }
            this.bump();
            break;
          }
          case 123: {
            nestedBraces += 1;
            this.bump();
            break;
          }
          case 125: {
            if (nestedBraces > 0) {
              nestedBraces -= 1;
            } else {
              return {
                val: this.message.slice(startPosition.offset, this.offset()),
                err: null
              };
            }
            break;
          }
          default:
            this.bump();
            break;
        }
      }
      return {
        val: this.message.slice(startPosition.offset, this.offset()),
        err: null
      };
    };
    Parser2.prototype.parseNumberSkeletonFromString = function(skeleton, location) {
      var tokens = [];
      try {
        tokens = parseNumberSkeletonFromString(skeleton);
      } catch (e) {
        return this.error(ErrorKind.INVALID_NUMBER_SKELETON, location);
      }
      return {
        val: {
          type: SKELETON_TYPE.number,
          tokens,
          location,
          parsedOptions: this.shouldParseSkeletons ? parseNumberSkeleton(tokens) : {}
        },
        err: null
      };
    };
    Parser2.prototype.tryParsePluralOrSelectOptions = function(nestingLevel, parentArgType, expectCloseTag, parsedFirstIdentifier) {
      var _a2;
      var hasOtherClause = false;
      var options = [];
      var parsedSelectors = /* @__PURE__ */ new Set();
      var selector = parsedFirstIdentifier.value, selectorLocation = parsedFirstIdentifier.location;
      while (true) {
        if (selector.length === 0) {
          var startPosition = this.clonePosition();
          if (parentArgType !== "select" && this.bumpIf("=")) {
            var result = this.tryParseDecimalInteger(ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, ErrorKind.INVALID_PLURAL_ARGUMENT_SELECTOR);
            if (result.err) {
              return result;
            }
            selectorLocation = createLocation(startPosition, this.clonePosition());
            selector = this.message.slice(startPosition.offset, this.offset());
          } else {
            break;
          }
        }
        if (parsedSelectors.has(selector)) {
          return this.error(parentArgType === "select" ? ErrorKind.DUPLICATE_SELECT_ARGUMENT_SELECTOR : ErrorKind.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, selectorLocation);
        }
        if (selector === "other") {
          hasOtherClause = true;
        }
        this.bumpSpace();
        var openingBracePosition = this.clonePosition();
        if (!this.bumpIf("{")) {
          return this.error(parentArgType === "select" ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, createLocation(this.clonePosition(), this.clonePosition()));
        }
        var fragmentResult = this.parseMessage(nestingLevel + 1, parentArgType, expectCloseTag);
        if (fragmentResult.err) {
          return fragmentResult;
        }
        var argCloseResult = this.tryParseArgumentClose(openingBracePosition);
        if (argCloseResult.err) {
          return argCloseResult;
        }
        options.push([
          selector,
          {
            value: fragmentResult.val,
            location: createLocation(openingBracePosition, this.clonePosition())
          }
        ]);
        parsedSelectors.add(selector);
        this.bumpSpace();
        _a2 = this.parseIdentifierIfPossible(), selector = _a2.value, selectorLocation = _a2.location;
      }
      if (options.length === 0) {
        return this.error(parentArgType === "select" ? ErrorKind.EXPECT_SELECT_ARGUMENT_SELECTOR : ErrorKind.EXPECT_PLURAL_ARGUMENT_SELECTOR, createLocation(this.clonePosition(), this.clonePosition()));
      }
      if (this.requiresOtherClause && !hasOtherClause) {
        return this.error(ErrorKind.MISSING_OTHER_CLAUSE, createLocation(this.clonePosition(), this.clonePosition()));
      }
      return { val: options, err: null };
    };
    Parser2.prototype.tryParseDecimalInteger = function(expectNumberError, invalidNumberError) {
      var sign = 1;
      var startingPosition = this.clonePosition();
      if (this.bumpIf("+")) {
      } else if (this.bumpIf("-")) {
        sign = -1;
      }
      var hasDigits = false;
      var decimal = 0;
      while (!this.isEOF()) {
        var ch = this.char();
        if (ch >= 48 && ch <= 57) {
          hasDigits = true;
          decimal = decimal * 10 + (ch - 48);
          this.bump();
        } else {
          break;
        }
      }
      var location = createLocation(startingPosition, this.clonePosition());
      if (!hasDigits) {
        return this.error(expectNumberError, location);
      }
      decimal *= sign;
      if (!isSafeInteger(decimal)) {
        return this.error(invalidNumberError, location);
      }
      return { val: decimal, err: null };
    };
    Parser2.prototype.offset = function() {
      return this.position.offset;
    };
    Parser2.prototype.isEOF = function() {
      return this.offset() === this.message.length;
    };
    Parser2.prototype.clonePosition = function() {
      return {
        offset: this.position.offset,
        line: this.position.line,
        column: this.position.column
      };
    };
    Parser2.prototype.char = function() {
      var offset = this.position.offset;
      if (offset >= this.message.length) {
        throw Error("out of bound");
      }
      var code = codePointAt(this.message, offset);
      if (code === void 0) {
        throw Error("Offset " + offset + " is at invalid UTF-16 code unit boundary");
      }
      return code;
    };
    Parser2.prototype.error = function(kind, location) {
      return {
        val: null,
        err: {
          kind,
          message: this.message,
          location
        }
      };
    };
    Parser2.prototype.bump = function() {
      if (this.isEOF()) {
        return;
      }
      var code = this.char();
      if (code === 10) {
        this.position.line += 1;
        this.position.column = 1;
        this.position.offset += 1;
      } else {
        this.position.column += 1;
        this.position.offset += code < 65536 ? 1 : 2;
      }
    };
    Parser2.prototype.bumpIf = function(prefix) {
      if (startsWith(this.message, prefix, this.offset())) {
        for (var i = 0; i < prefix.length; i++) {
          this.bump();
        }
        return true;
      }
      return false;
    };
    Parser2.prototype.bumpUntil = function(pattern) {
      var currentOffset = this.offset();
      var index = this.message.indexOf(pattern, currentOffset);
      if (index >= 0) {
        this.bumpTo(index);
        return true;
      } else {
        this.bumpTo(this.message.length);
        return false;
      }
    };
    Parser2.prototype.bumpTo = function(targetOffset) {
      if (this.offset() > targetOffset) {
        throw Error("targetOffset " + targetOffset + " must be greater than or equal to the current offset " + this.offset());
      }
      targetOffset = Math.min(targetOffset, this.message.length);
      while (true) {
        var offset = this.offset();
        if (offset === targetOffset) {
          break;
        }
        if (offset > targetOffset) {
          throw Error("targetOffset " + targetOffset + " is at invalid UTF-16 code unit boundary");
        }
        this.bump();
        if (this.isEOF()) {
          break;
        }
      }
    };
    Parser2.prototype.bumpSpace = function() {
      while (!this.isEOF() && _isWhiteSpace(this.char())) {
        this.bump();
      }
    };
    Parser2.prototype.peek = function() {
      if (this.isEOF()) {
        return null;
      }
      var code = this.char();
      var offset = this.offset();
      var nextCode = this.message.charCodeAt(offset + (code >= 65536 ? 2 : 1));
      return nextCode !== null && nextCode !== void 0 ? nextCode : null;
    };
    return Parser2;
  }()
);
function _isAlpha(codepoint) {
  return codepoint >= 97 && codepoint <= 122 || codepoint >= 65 && codepoint <= 90;
}
function _isAlphaOrSlash(codepoint) {
  return _isAlpha(codepoint) || codepoint === 47;
}
function _isPotentialElementNameChar(c) {
  return c === 45 || c === 46 || c >= 48 && c <= 57 || c === 95 || c >= 97 && c <= 122 || c >= 65 && c <= 90 || c == 183 || c >= 192 && c <= 214 || c >= 216 && c <= 246 || c >= 248 && c <= 893 || c >= 895 && c <= 8191 || c >= 8204 && c <= 8205 || c >= 8255 && c <= 8256 || c >= 8304 && c <= 8591 || c >= 11264 && c <= 12271 || c >= 12289 && c <= 55295 || c >= 63744 && c <= 64975 || c >= 65008 && c <= 65533 || c >= 65536 && c <= 983039;
}
function _isWhiteSpace(c) {
  return c >= 9 && c <= 13 || c === 32 || c === 133 || c >= 8206 && c <= 8207 || c === 8232 || c === 8233;
}
function _isPatternSyntax(c) {
  return c >= 33 && c <= 35 || c === 36 || c >= 37 && c <= 39 || c === 40 || c === 41 || c === 42 || c === 43 || c === 44 || c === 45 || c >= 46 && c <= 47 || c >= 58 && c <= 59 || c >= 60 && c <= 62 || c >= 63 && c <= 64 || c === 91 || c === 92 || c === 93 || c === 94 || c === 96 || c === 123 || c === 124 || c === 125 || c === 126 || c === 161 || c >= 162 && c <= 165 || c === 166 || c === 167 || c === 169 || c === 171 || c === 172 || c === 174 || c === 176 || c === 177 || c === 182 || c === 187 || c === 191 || c === 215 || c === 247 || c >= 8208 && c <= 8213 || c >= 8214 && c <= 8215 || c === 8216 || c === 8217 || c === 8218 || c >= 8219 && c <= 8220 || c === 8221 || c === 8222 || c === 8223 || c >= 8224 && c <= 8231 || c >= 8240 && c <= 8248 || c === 8249 || c === 8250 || c >= 8251 && c <= 8254 || c >= 8257 && c <= 8259 || c === 8260 || c === 8261 || c === 8262 || c >= 8263 && c <= 8273 || c === 8274 || c === 8275 || c >= 8277 && c <= 8286 || c >= 8592 && c <= 8596 || c >= 8597 && c <= 8601 || c >= 8602 && c <= 8603 || c >= 8604 && c <= 8607 || c === 8608 || c >= 8609 && c <= 8610 || c === 8611 || c >= 8612 && c <= 8613 || c === 8614 || c >= 8615 && c <= 8621 || c === 8622 || c >= 8623 && c <= 8653 || c >= 8654 && c <= 8655 || c >= 8656 && c <= 8657 || c === 8658 || c === 8659 || c === 8660 || c >= 8661 && c <= 8691 || c >= 8692 && c <= 8959 || c >= 8960 && c <= 8967 || c === 8968 || c === 8969 || c === 8970 || c === 8971 || c >= 8972 && c <= 8991 || c >= 8992 && c <= 8993 || c >= 8994 && c <= 9e3 || c === 9001 || c === 9002 || c >= 9003 && c <= 9083 || c === 9084 || c >= 9085 && c <= 9114 || c >= 9115 && c <= 9139 || c >= 9140 && c <= 9179 || c >= 9180 && c <= 9185 || c >= 9186 && c <= 9254 || c >= 9255 && c <= 9279 || c >= 9280 && c <= 9290 || c >= 9291 && c <= 9311 || c >= 9472 && c <= 9654 || c === 9655 || c >= 9656 && c <= 9664 || c === 9665 || c >= 9666 && c <= 9719 || c >= 9720 && c <= 9727 || c >= 9728 && c <= 9838 || c === 9839 || c >= 9840 && c <= 10087 || c === 10088 || c === 10089 || c === 10090 || c === 10091 || c === 10092 || c === 10093 || c === 10094 || c === 10095 || c === 10096 || c === 10097 || c === 10098 || c === 10099 || c === 10100 || c === 10101 || c >= 10132 && c <= 10175 || c >= 10176 && c <= 10180 || c === 10181 || c === 10182 || c >= 10183 && c <= 10213 || c === 10214 || c === 10215 || c === 10216 || c === 10217 || c === 10218 || c === 10219 || c === 10220 || c === 10221 || c === 10222 || c === 10223 || c >= 10224 && c <= 10239 || c >= 10240 && c <= 10495 || c >= 10496 && c <= 10626 || c === 10627 || c === 10628 || c === 10629 || c === 10630 || c === 10631 || c === 10632 || c === 10633 || c === 10634 || c === 10635 || c === 10636 || c === 10637 || c === 10638 || c === 10639 || c === 10640 || c === 10641 || c === 10642 || c === 10643 || c === 10644 || c === 10645 || c === 10646 || c === 10647 || c === 10648 || c >= 10649 && c <= 10711 || c === 10712 || c === 10713 || c === 10714 || c === 10715 || c >= 10716 && c <= 10747 || c === 10748 || c === 10749 || c >= 10750 && c <= 11007 || c >= 11008 && c <= 11055 || c >= 11056 && c <= 11076 || c >= 11077 && c <= 11078 || c >= 11079 && c <= 11084 || c >= 11085 && c <= 11123 || c >= 11124 && c <= 11125 || c >= 11126 && c <= 11157 || c === 11158 || c >= 11159 && c <= 11263 || c >= 11776 && c <= 11777 || c === 11778 || c === 11779 || c === 11780 || c === 11781 || c >= 11782 && c <= 11784 || c === 11785 || c === 11786 || c === 11787 || c === 11788 || c === 11789 || c >= 11790 && c <= 11798 || c === 11799 || c >= 11800 && c <= 11801 || c === 11802 || c === 11803 || c === 11804 || c === 11805 || c >= 11806 && c <= 11807 || c === 11808 || c === 11809 || c === 11810 || c === 11811 || c === 11812 || c === 11813 || c === 11814 || c === 11815 || c === 11816 || c === 11817 || c >= 11818 && c <= 11822 || c === 11823 || c >= 11824 && c <= 11833 || c >= 11834 && c <= 11835 || c >= 11836 && c <= 11839 || c === 11840 || c === 11841 || c === 11842 || c >= 11843 && c <= 11855 || c >= 11856 && c <= 11857 || c === 11858 || c >= 11859 && c <= 11903 || c >= 12289 && c <= 12291 || c === 12296 || c === 12297 || c === 12298 || c === 12299 || c === 12300 || c === 12301 || c === 12302 || c === 12303 || c === 12304 || c === 12305 || c >= 12306 && c <= 12307 || c === 12308 || c === 12309 || c === 12310 || c === 12311 || c === 12312 || c === 12313 || c === 12314 || c === 12315 || c === 12316 || c === 12317 || c >= 12318 && c <= 12319 || c === 12320 || c === 12336 || c === 64830 || c === 64831 || c >= 65093 && c <= 65094;
}

// ../node_modules/@formatjs/icu-messageformat-parser/lib/index.js
function pruneLocation(els) {
  els.forEach(function(el) {
    delete el.location;
    if (isSelectElement(el) || isPluralElement(el)) {
      for (var k in el.options) {
        delete el.options[k].location;
        pruneLocation(el.options[k].value);
      }
    } else if (isNumberElement(el) && isNumberSkeleton(el.style)) {
      delete el.style.location;
    } else if ((isDateElement(el) || isTimeElement(el)) && isDateTimeSkeleton(el.style)) {
      delete el.style.location;
    } else if (isTagElement(el)) {
      pruneLocation(el.children);
    }
  });
}
function parse(message, opts) {
  if (opts === void 0) {
    opts = {};
  }
  opts = __assign({ shouldParseSkeletons: true, requiresOtherClause: true }, opts);
  var result = new Parser(message, opts).parse();
  if (result.err) {
    var error = SyntaxError(ErrorKind[result.err.kind]);
    error.location = result.err.location;
    error.originalMessage = result.err.message;
    throw error;
  }
  if (!(opts === null || opts === void 0 ? void 0 : opts.captureLocation)) {
    pruneLocation(result.val);
  }
  return result.val;
}

// ../node_modules/@formatjs/fast-memoize/lib/index.js
function memoize(fn, options) {
  var cache = options && options.cache ? options.cache : cacheDefault;
  var serializer = options && options.serializer ? options.serializer : serializerDefault;
  var strategy = options && options.strategy ? options.strategy : strategyDefault;
  return strategy(fn, {
    cache,
    serializer
  });
}
function isPrimitive(value) {
  return value == null || typeof value === "number" || typeof value === "boolean";
}
function monadic(fn, cache, serializer, arg) {
  var cacheKey = isPrimitive(arg) ? arg : serializer(arg);
  var computedValue = cache.get(cacheKey);
  if (typeof computedValue === "undefined") {
    computedValue = fn.call(this, arg);
    cache.set(cacheKey, computedValue);
  }
  return computedValue;
}
function variadic(fn, cache, serializer) {
  var args = Array.prototype.slice.call(arguments, 3);
  var cacheKey = serializer(args);
  var computedValue = cache.get(cacheKey);
  if (typeof computedValue === "undefined") {
    computedValue = fn.apply(this, args);
    cache.set(cacheKey, computedValue);
  }
  return computedValue;
}
function assemble(fn, context, strategy, cache, serialize) {
  return strategy.bind(context, fn, cache, serialize);
}
function strategyDefault(fn, options) {
  var strategy = fn.length === 1 ? monadic : variadic;
  return assemble(fn, this, strategy, options.cache.create(), options.serializer);
}
function strategyVariadic(fn, options) {
  return assemble(fn, this, variadic, options.cache.create(), options.serializer);
}
function strategyMonadic(fn, options) {
  return assemble(fn, this, monadic, options.cache.create(), options.serializer);
}
var serializerDefault = function() {
  return JSON.stringify(arguments);
};
function ObjectWithoutPrototypeCache() {
  this.cache = /* @__PURE__ */ Object.create(null);
}
ObjectWithoutPrototypeCache.prototype.get = function(key) {
  return this.cache[key];
};
ObjectWithoutPrototypeCache.prototype.set = function(key, value) {
  this.cache[key] = value;
};
var cacheDefault = {
  create: function create() {
    return new ObjectWithoutPrototypeCache();
  }
};
var strategies = {
  variadic: strategyVariadic,
  monadic: strategyMonadic
};

// ../node_modules/intl-messageformat/lib/src/error.js
var ErrorCode;
(function(ErrorCode2) {
  ErrorCode2["MISSING_VALUE"] = "MISSING_VALUE";
  ErrorCode2["INVALID_VALUE"] = "INVALID_VALUE";
  ErrorCode2["MISSING_INTL_API"] = "MISSING_INTL_API";
})(ErrorCode || (ErrorCode = {}));
var FormatError = (
  /** @class */
  function(_super) {
    __extends(FormatError2, _super);
    function FormatError2(msg, code, originalMessage) {
      var _this = _super.call(this, msg) || this;
      _this.code = code;
      _this.originalMessage = originalMessage;
      return _this;
    }
    FormatError2.prototype.toString = function() {
      return "[formatjs Error: " + this.code + "] " + this.message;
    };
    return FormatError2;
  }(Error)
);
var InvalidValueError = (
  /** @class */
  function(_super) {
    __extends(InvalidValueError2, _super);
    function InvalidValueError2(variableId, value, options, originalMessage) {
      return _super.call(this, 'Invalid values for "' + variableId + '": "' + value + '". Options are "' + Object.keys(options).join('", "') + '"', ErrorCode.INVALID_VALUE, originalMessage) || this;
    }
    return InvalidValueError2;
  }(FormatError)
);
var InvalidValueTypeError = (
  /** @class */
  function(_super) {
    __extends(InvalidValueTypeError2, _super);
    function InvalidValueTypeError2(value, type, originalMessage) {
      return _super.call(this, 'Value for "' + value + '" must be of type ' + type, ErrorCode.INVALID_VALUE, originalMessage) || this;
    }
    return InvalidValueTypeError2;
  }(FormatError)
);
var MissingValueError = (
  /** @class */
  function(_super) {
    __extends(MissingValueError2, _super);
    function MissingValueError2(variableId, originalMessage) {
      return _super.call(this, 'The intl string context variable "' + variableId + '" was not provided to the string "' + originalMessage + '"', ErrorCode.MISSING_VALUE, originalMessage) || this;
    }
    return MissingValueError2;
  }(FormatError)
);

// ../node_modules/intl-messageformat/lib/src/formatters.js
var PART_TYPE;
(function(PART_TYPE2) {
  PART_TYPE2[PART_TYPE2["literal"] = 0] = "literal";
  PART_TYPE2[PART_TYPE2["object"] = 1] = "object";
})(PART_TYPE || (PART_TYPE = {}));
function mergeLiteral(parts) {
  if (parts.length < 2) {
    return parts;
  }
  return parts.reduce(function(all, part) {
    var lastPart = all[all.length - 1];
    if (!lastPart || lastPart.type !== PART_TYPE.literal || part.type !== PART_TYPE.literal) {
      all.push(part);
    } else {
      lastPart.value += part.value;
    }
    return all;
  }, []);
}
function isFormatXMLElementFn(el) {
  return typeof el === "function";
}
function formatToParts(els, locales, formatters, formats, values, currentPluralValue, originalMessage) {
  if (els.length === 1 && isLiteralElement(els[0])) {
    return [
      {
        type: PART_TYPE.literal,
        value: els[0].value
      }
    ];
  }
  var result = [];
  for (var _i = 0, els_1 = els; _i < els_1.length; _i++) {
    var el = els_1[_i];
    if (isLiteralElement(el)) {
      result.push({
        type: PART_TYPE.literal,
        value: el.value
      });
      continue;
    }
    if (isPoundElement(el)) {
      if (typeof currentPluralValue === "number") {
        result.push({
          type: PART_TYPE.literal,
          value: formatters.getNumberFormat(locales).format(currentPluralValue)
        });
      }
      continue;
    }
    var varName = el.value;
    if (!(values && varName in values)) {
      throw new MissingValueError(varName, originalMessage);
    }
    var value = values[varName];
    if (isArgumentElement(el)) {
      if (!value || typeof value === "string" || typeof value === "number") {
        value = typeof value === "string" || typeof value === "number" ? String(value) : "";
      }
      result.push({
        type: typeof value === "string" ? PART_TYPE.literal : PART_TYPE.object,
        value
      });
      continue;
    }
    if (isDateElement(el)) {
      var style = typeof el.style === "string" ? formats.date[el.style] : isDateTimeSkeleton(el.style) ? el.style.parsedOptions : void 0;
      result.push({
        type: PART_TYPE.literal,
        value: formatters.getDateTimeFormat(locales, style).format(value)
      });
      continue;
    }
    if (isTimeElement(el)) {
      var style = typeof el.style === "string" ? formats.time[el.style] : isDateTimeSkeleton(el.style) ? el.style.parsedOptions : void 0;
      result.push({
        type: PART_TYPE.literal,
        value: formatters.getDateTimeFormat(locales, style).format(value)
      });
      continue;
    }
    if (isNumberElement(el)) {
      var style = typeof el.style === "string" ? formats.number[el.style] : isNumberSkeleton(el.style) ? el.style.parsedOptions : void 0;
      if (style && style.scale) {
        value = value * (style.scale || 1);
      }
      result.push({
        type: PART_TYPE.literal,
        value: formatters.getNumberFormat(locales, style).format(value)
      });
      continue;
    }
    if (isTagElement(el)) {
      var children = el.children, value_1 = el.value;
      var formatFn = values[value_1];
      if (!isFormatXMLElementFn(formatFn)) {
        throw new InvalidValueTypeError(value_1, "function", originalMessage);
      }
      var parts = formatToParts(children, locales, formatters, formats, values, currentPluralValue);
      var chunks = formatFn(parts.map(function(p) {
        return p.value;
      }));
      if (!Array.isArray(chunks)) {
        chunks = [chunks];
      }
      result.push.apply(result, chunks.map(function(c) {
        return {
          type: typeof c === "string" ? PART_TYPE.literal : PART_TYPE.object,
          value: c
        };
      }));
    }
    if (isSelectElement(el)) {
      var opt = el.options[value] || el.options.other;
      if (!opt) {
        throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
      }
      result.push.apply(result, formatToParts(opt.value, locales, formatters, formats, values));
      continue;
    }
    if (isPluralElement(el)) {
      var opt = el.options["=" + value];
      if (!opt) {
        if (!Intl.PluralRules) {
          throw new FormatError('Intl.PluralRules is not available in this environment.\nTry polyfilling it using "@formatjs/intl-pluralrules"\n', ErrorCode.MISSING_INTL_API, originalMessage);
        }
        var rule = formatters.getPluralRules(locales, { type: el.pluralType }).select(value - (el.offset || 0));
        opt = el.options[rule] || el.options.other;
      }
      if (!opt) {
        throw new InvalidValueError(el.value, value, Object.keys(el.options), originalMessage);
      }
      result.push.apply(result, formatToParts(opt.value, locales, formatters, formats, values, value - (el.offset || 0)));
      continue;
    }
  }
  return mergeLiteral(result);
}

// ../node_modules/intl-messageformat/lib/src/core.js
function mergeConfig(c1, c2) {
  if (!c2) {
    return c1;
  }
  return __assign(__assign(__assign({}, c1 || {}), c2 || {}), Object.keys(c1).reduce(function(all, k) {
    all[k] = __assign(__assign({}, c1[k]), c2[k] || {});
    return all;
  }, {}));
}
function mergeConfigs(defaultConfig, configs) {
  if (!configs) {
    return defaultConfig;
  }
  return Object.keys(defaultConfig).reduce(function(all, k) {
    all[k] = mergeConfig(defaultConfig[k], configs[k]);
    return all;
  }, __assign({}, defaultConfig));
}
function createFastMemoizeCache(store) {
  return {
    create: function() {
      return {
        get: function(key) {
          return store[key];
        },
        set: function(key, value) {
          store[key] = value;
        }
      };
    }
  };
}
function createDefaultFormatters(cache) {
  if (cache === void 0) {
    cache = {
      number: {},
      dateTime: {},
      pluralRules: {}
    };
  }
  return {
    getNumberFormat: memoize(function() {
      var _a2;
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return new ((_a2 = Intl.NumberFormat).bind.apply(_a2, __spreadArray([void 0], args)))();
    }, {
      cache: createFastMemoizeCache(cache.number),
      strategy: strategies.variadic
    }),
    getDateTimeFormat: memoize(function() {
      var _a2;
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return new ((_a2 = Intl.DateTimeFormat).bind.apply(_a2, __spreadArray([void 0], args)))();
    }, {
      cache: createFastMemoizeCache(cache.dateTime),
      strategy: strategies.variadic
    }),
    getPluralRules: memoize(function() {
      var _a2;
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return new ((_a2 = Intl.PluralRules).bind.apply(_a2, __spreadArray([void 0], args)))();
    }, {
      cache: createFastMemoizeCache(cache.pluralRules),
      strategy: strategies.variadic
    })
  };
}
var IntlMessageFormat = (
  /** @class */
  function() {
    function IntlMessageFormat2(message, locales, overrideFormats, opts) {
      var _this = this;
      if (locales === void 0) {
        locales = IntlMessageFormat2.defaultLocale;
      }
      this.formatterCache = {
        number: {},
        dateTime: {},
        pluralRules: {}
      };
      this.format = function(values) {
        var parts = _this.formatToParts(values);
        if (parts.length === 1) {
          return parts[0].value;
        }
        var result = parts.reduce(function(all, part) {
          if (!all.length || part.type !== PART_TYPE.literal || typeof all[all.length - 1] !== "string") {
            all.push(part.value);
          } else {
            all[all.length - 1] += part.value;
          }
          return all;
        }, []);
        if (result.length <= 1) {
          return result[0] || "";
        }
        return result;
      };
      this.formatToParts = function(values) {
        return formatToParts(_this.ast, _this.locales, _this.formatters, _this.formats, values, void 0, _this.message);
      };
      this.resolvedOptions = function() {
        return {
          locale: Intl.NumberFormat.supportedLocalesOf(_this.locales)[0]
        };
      };
      this.getAst = function() {
        return _this.ast;
      };
      if (typeof message === "string") {
        this.message = message;
        if (!IntlMessageFormat2.__parse) {
          throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
        }
        this.ast = IntlMessageFormat2.__parse(message, {
          ignoreTag: opts === null || opts === void 0 ? void 0 : opts.ignoreTag
        });
      } else {
        this.ast = message;
      }
      if (!Array.isArray(this.ast)) {
        throw new TypeError("A message must be provided as a String or AST.");
      }
      this.formats = mergeConfigs(IntlMessageFormat2.formats, overrideFormats);
      this.locales = locales;
      this.formatters = opts && opts.formatters || createDefaultFormatters(this.formatterCache);
    }
    Object.defineProperty(IntlMessageFormat2, "defaultLocale", {
      get: function() {
        if (!IntlMessageFormat2.memoizedDefaultLocale) {
          IntlMessageFormat2.memoizedDefaultLocale = new Intl.NumberFormat().resolvedOptions().locale;
        }
        return IntlMessageFormat2.memoizedDefaultLocale;
      },
      enumerable: false,
      configurable: true
    });
    IntlMessageFormat2.memoizedDefaultLocale = null;
    IntlMessageFormat2.__parse = parse;
    IntlMessageFormat2.formats = {
      number: {
        integer: {
          maximumFractionDigits: 0
        },
        currency: {
          style: "currency"
        },
        percent: {
          style: "percent"
        }
      },
      date: {
        short: {
          month: "numeric",
          day: "numeric",
          year: "2-digit"
        },
        medium: {
          month: "short",
          day: "numeric",
          year: "numeric"
        },
        long: {
          month: "long",
          day: "numeric",
          year: "numeric"
        },
        full: {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric"
        }
      },
      time: {
        short: {
          hour: "numeric",
          minute: "numeric"
        },
        medium: {
          hour: "numeric",
          minute: "numeric",
          second: "numeric"
        },
        long: {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZoneName: "short"
        },
        full: {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZoneName: "short"
        }
      }
    };
    return IntlMessageFormat2;
  }()
);

// ../node_modules/intl-messageformat/lib/index.js
var lib_default = IntlMessageFormat;

// ../node_modules/@dexter/tacocat-consonant-templates/src/price/numberFormat.js
var maskRegex = /[0-9\-+#]/;
var notMaskRegex = /[^\d\-+#]/g;
function getIndex(mask) {
  return mask.search(maskRegex);
}
function processMask(mask = "#.##") {
  const maskObj = {};
  const len = mask.length;
  const start = getIndex(mask);
  maskObj.prefix = start > 0 ? mask.substring(0, start) : "";
  const end = getIndex(mask.split("").reverse().join(""));
  const offset = len - end;
  const substr = mask.substring(offset, offset + 1);
  const indx = offset + (substr === "." || substr === "," ? 1 : 0);
  maskObj.suffix = end > 0 ? mask.substring(indx, len) : "";
  maskObj.mask = mask.substring(start, indx);
  maskObj.maskHasNegativeSign = maskObj.mask.charAt(0) === "-";
  maskObj.maskHasPositiveSign = maskObj.mask.charAt(0) === "+";
  let result = maskObj.mask.match(notMaskRegex);
  maskObj.decimal = result && result[result.length - 1] || ".";
  maskObj.separator = result && result[1] && result[0] || ",";
  result = maskObj.mask.split(maskObj.decimal);
  maskObj.integer = result[0];
  maskObj.fraction = result[1];
  return maskObj;
}
function processValue(value, maskObj, options) {
  let isNegative = false;
  const valObj = {
    value
  };
  if (value < 0) {
    isNegative = true;
    valObj.value = -valObj.value;
  }
  valObj.sign = isNegative ? "-" : "";
  valObj.value = Number(valObj.value).toFixed(
    maskObj.fraction && maskObj.fraction.length
  );
  valObj.value = Number(valObj.value).toString();
  const posTrailZero = maskObj.fraction && maskObj.fraction.lastIndexOf("0");
  let [valInteger = "0", valFraction = ""] = valObj.value.split(".");
  if (!valFraction || valFraction && valFraction.length <= posTrailZero) {
    valFraction = posTrailZero < 0 ? "" : Number("0." + valFraction).toFixed(posTrailZero + 1).replace("0.", "");
  }
  valObj.integer = valInteger;
  valObj.fraction = valFraction;
  addSeparators(valObj, maskObj);
  if (valObj.result === "0" || valObj.result === "") {
    isNegative = false;
    valObj.sign = "";
  }
  if (!isNegative && maskObj.maskHasPositiveSign) {
    valObj.sign = "+";
  } else if (isNegative && maskObj.maskHasPositiveSign) {
    valObj.sign = "-";
  } else if (isNegative) {
    valObj.sign = options && options.enforceMaskSign && !maskObj.maskHasNegativeSign ? "" : "-";
  }
  return valObj;
}
function addSeparators(valObj, maskObj) {
  valObj.result = "";
  const szSep = maskObj.integer.split(maskObj.separator);
  const maskInteger = szSep.join("");
  const posLeadZero = maskInteger && maskInteger.indexOf("0");
  if (posLeadZero > -1) {
    while (valObj.integer.length < maskInteger.length - posLeadZero) {
      valObj.integer = "0" + valObj.integer;
    }
  } else if (Number(valObj.integer) === 0) {
    valObj.integer = "";
  }
  const posSeparator = szSep[1] && szSep[szSep.length - 1].length;
  if (posSeparator) {
    const len = valObj.integer.length;
    const offset = len % posSeparator;
    for (let indx = 0; indx < len; indx++) {
      valObj.result += valObj.integer.charAt(indx);
      if (!((indx - offset + 1) % posSeparator) && indx < len - posSeparator) {
        valObj.result += maskObj.separator;
      }
    }
  } else {
    valObj.result = valObj.integer;
  }
  valObj.result += maskObj.fraction && valObj.fraction ? maskObj.decimal + valObj.fraction : "";
  return valObj;
}
function formatNumber(mask, value, options = {}) {
  if (!mask || isNaN(Number(value))) {
    return value;
  }
  const maskObj = processMask(mask);
  const valObj = processValue(value, maskObj, options);
  return maskObj.prefix + valObj.sign + valObj.result + maskObj.suffix;
}
var numberFormat_default = formatNumber;

// ../node_modules/@dexter/tacocat-consonant-templates/src/price/utilities.js
var DECIMAL_POINT = ".";
var DECIMAL_COMMA = ",";
var SPACE_START_PATTERN = /^\s+/;
var SPACE_END_PATTERN = /\s+$/;
var NBSP = "&nbsp;";
var RecurrenceTerm = {
  MONTH: "MONTH",
  YEAR: "YEAR"
};
var opticalPriceDivisors = {
  [Term.ANNUAL]: 12,
  [Term.MONTHLY]: 1,
  [Term.THREE_YEARS]: 36,
  [Term.TWO_YEARS]: 24
};
var opticalPriceCurrencyRules = {
  CHF: (opticalPrice) => Math.round(opticalPrice * 20) / 20
};
var opticalPriceRoundingRule = (accept, round) => ({ accept, round });
var opticalPriceRoundingRules = [
  opticalPriceRoundingRule(
    // optical price for the term is a multiple of the initial price
    ({ divisor, price: price2 }) => price2 % divisor == 0,
    ({ divisor, price: price2 }) => price2 / divisor
  ),
  opticalPriceRoundingRule(
    // round optical price up to 2 decimals
    ({ usePrecision }) => usePrecision,
    ({ divisor, price: price2 }) => Math.ceil(Math.floor(price2 * 1e4 / divisor) / 100) / 100
  ),
  opticalPriceRoundingRule(
    // round optical price up to integer
    () => true,
    ({ divisor, price: price2 }) => Math.ceil(Math.floor(price2 * 100 / divisor) / 100)
  )
];
var recurrenceTerms = {
  [Commitment.YEAR]: {
    [Term.MONTHLY]: RecurrenceTerm.MONTH,
    [Term.ANNUAL]: RecurrenceTerm.YEAR
  },
  [Commitment.MONTH]: {
    [Term.MONTHLY]: RecurrenceTerm.MONTH
  }
};
var currencyIsFirstChar = (formatString, currencySymbol) => formatString.indexOf(`'${currencySymbol}'`) === 0;
var extractNumberMask = (formatString, usePrecision = true) => {
  let numberMask = formatString.replace(/'.*?'/, "").trim();
  const decimalsDelimiter = findDecimalsDelimiter(numberMask);
  const hasDecimalDelimiter = !!decimalsDelimiter;
  if (!hasDecimalDelimiter) {
    numberMask = numberMask.replace(
      /\s?(#.*0)(?!\s)?/,
      "$&" + getPossibleDecimalsDelimiter(formatString)
    );
  } else if (!usePrecision) {
    numberMask = numberMask.replace(/[,\.]0+/, decimalsDelimiter);
  }
  return numberMask;
};
var getCurrencySymbolDetails = (formatString) => {
  const currencySymbol = findCurrencySymbol(formatString);
  const isCurrencyFirst = currencyIsFirstChar(formatString, currencySymbol);
  const formatStringWithoutSymbol = formatString.replace(/'.*?'/, "");
  const hasCurrencySpace = SPACE_START_PATTERN.test(formatStringWithoutSymbol) || SPACE_END_PATTERN.test(formatStringWithoutSymbol);
  return { currencySymbol, isCurrencyFirst, hasCurrencySpace };
};
var makeSpacesAroundNonBreaking = (text) => {
  return text.replace(SPACE_START_PATTERN, NBSP).replace(SPACE_END_PATTERN, NBSP);
};
var getPossibleDecimalsDelimiter = (formatString) => formatString.match(/#(.?)#/)?.[1] === DECIMAL_POINT ? DECIMAL_COMMA : DECIMAL_POINT;
var findCurrencySymbol = (formatString) => formatString.match(/'(.*?)'/)?.[1] ?? "";
var findDecimalsDelimiter = (formatString) => formatString.match(/0(.?)0/)?.[1] ?? "";
function formatPrice({ formatString, price: price2, usePrecision, isIndianPrice = false }, recurrenceTerm, transformPrice = (formattedPrice) => formattedPrice) {
  const { currencySymbol, isCurrencyFirst, hasCurrencySpace } = getCurrencySymbolDetails(formatString);
  const decimalsDelimiter = usePrecision ? findDecimalsDelimiter(formatString) : "";
  const numberMask = extractNumberMask(formatString, usePrecision);
  const fractionDigits = usePrecision ? 2 : 0;
  const transformedPrice = transformPrice(price2, { currencySymbol });
  const formattedPrice = isIndianPrice ? transformedPrice.toLocaleString("hi-IN", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }) : numberFormat_default(numberMask, transformedPrice);
  const decimalIndex = usePrecision ? formattedPrice.lastIndexOf(decimalsDelimiter) : formattedPrice.length;
  const integer = formattedPrice.substring(0, decimalIndex);
  const decimals = formattedPrice.substring(decimalIndex + 1);
  const accessiblePrice = formatString.replace(/'.*?'/, "SYMBOL").replace(/#.*0/, formattedPrice).replace(/SYMBOL/, currencySymbol);
  return {
    accessiblePrice,
    currencySymbol,
    decimals,
    decimalsDelimiter,
    hasCurrencySpace,
    integer,
    isCurrencyFirst,
    recurrenceTerm
  };
}
var formatOpticalPrice = (data) => {
  const { commitment, term, usePrecision } = data;
  const divisor = opticalPriceDivisors[term] ?? 1;
  return formatPrice(
    data,
    divisor > 1 ? RecurrenceTerm.MONTH : recurrenceTerms[commitment]?.[term],
    (price2, { currencySymbol }) => {
      const priceData = {
        divisor,
        price: price2,
        usePrecision
      };
      const { round } = opticalPriceRoundingRules.find(
        ({ accept }) => accept(priceData)
      );
      if (!round)
        throw new Error(
          `Missing rounding rule for: ${JSON.stringify(priceData)}`
        );
      const adapt = opticalPriceCurrencyRules[currencySymbol] ?? ((value) => value);
      return adapt(round(priceData));
    }
  );
};
var formatRegularPrice = ({ commitment, term, ...data }) => formatPrice(data, recurrenceTerms[commitment]?.[term]);
var formatAnnualPrice = (data) => {
  const { commitment, term } = data;
  if (commitment === Commitment.YEAR && term === Term.MONTHLY) {
    return formatPrice(data, RecurrenceTerm.YEAR, (price2) => price2 * 12);
  }
  return formatPrice(data, recurrenceTerms[commitment]?.[term]);
};

// ../node_modules/@dexter/tacocat-consonant-templates/src/price/template.js
var defaultLiterals = {
  recurrenceLabel: "{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",
  recurrenceAriaLabel: "{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",
  perUnitLabel: "{perUnit, select, LICENSE {per license} other {}}",
  perUnitAriaLabel: "{perUnit, select, LICENSE {per license} other {}}",
  freeLabel: "Free",
  freeAriaLabel: "Free",
  taxExclusiveLabel: "{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",
  taxInclusiveLabel: "{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",
  alternativePriceAriaLabel: "Alternatively at {alternativePrice}",
  strikethroughAriaLabel: "Regularly at {strikethroughPrice}"
};
var log = createLog("ConsonantTemplates/price");
var htmlPattern = /<.+?>/g;
var cssClassNames = {
  container: "price",
  containerOptical: "price-optical",
  containerStrikethrough: "price-strikethrough",
  containerAnnual: "price-annual",
  disabled: "disabled",
  currencySpace: "price-currency-space",
  currencySymbol: "price-currency-symbol",
  decimals: "price-decimals",
  decimalsDelimiter: "price-decimals-delimiter",
  integer: "price-integer",
  recurrence: "price-recurrence",
  taxInclusivity: "price-tax-inclusivity",
  unitType: "price-unit-type"
};
var literalKeys = {
  perUnitLabel: "perUnitLabel",
  perUnitAriaLabel: "perUnitAriaLabel",
  recurrenceLabel: "recurrenceLabel",
  recurrenceAriaLabel: "recurrenceAriaLabel",
  taxExclusiveLabel: "taxExclusiveLabel",
  taxInclusiveLabel: "taxInclusiveLabel",
  strikethroughAriaLabel: "strikethroughAriaLabel"
};
var WCS_TAX_DISPLAY_EXCLUSIVE = "TAX_EXCLUSIVE";
var renderAttributes = (attributes) => isObject(attributes) ? Object.entries(attributes).filter(
  ([, value]) => isString(value) || isNumber(value) || value === true
).reduce(
  (html, [key, value]) => html + ` ${key}${value === true ? "" : '="' + escapeHtml(value) + '"'}`,
  ""
) : "";
var renderSpan = (cssClass, content, attributes, convertSpaces = false) => {
  return `<span class="${cssClass}${content ? "" : " " + cssClassNames.disabled}"${renderAttributes(attributes)}>${convertSpaces ? makeSpacesAroundNonBreaking(content) : content ?? ""}</span>`;
};
function renderContainer(cssClass, {
  accessibleLabel,
  currencySymbol,
  decimals,
  decimalsDelimiter,
  hasCurrencySpace,
  integer,
  isCurrencyFirst,
  recurrenceLabel,
  perUnitLabel,
  taxInclusivityLabel
}, attributes = {}) {
  const currencyMarkup = renderSpan(
    cssClassNames.currencySymbol,
    currencySymbol
  );
  const currencySpaceMarkup = renderSpan(
    cssClassNames.currencySpace,
    hasCurrencySpace ? "&nbsp;" : ""
  );
  let markup = "";
  if (isCurrencyFirst)
    markup += currencyMarkup + currencySpaceMarkup;
  markup += renderSpan(cssClassNames.integer, integer);
  markup += renderSpan(cssClassNames.decimalsDelimiter, decimalsDelimiter);
  markup += renderSpan(cssClassNames.decimals, decimals);
  if (!isCurrencyFirst)
    markup += currencySpaceMarkup + currencyMarkup;
  markup += renderSpan(cssClassNames.recurrence, recurrenceLabel, null, true);
  markup += renderSpan(cssClassNames.unitType, perUnitLabel, null, true);
  markup += renderSpan(
    cssClassNames.taxInclusivity,
    taxInclusivityLabel,
    true
  );
  return renderSpan(cssClass, markup, {
    ...attributes,
    ["aria-label"]: accessibleLabel
  });
}
var createPriceTemplate = ({ displayOptical = false, displayStrikethrough = false, displayAnnual = false } = {}) => ({
  country,
  displayFormatted = true,
  displayRecurrence = true,
  displayPerUnit = false,
  displayTax = false,
  language,
  literals: priceLiterals = {}
} = {}, {
  commitment,
  formatString,
  price: price2,
  priceWithoutDiscount,
  taxDisplay,
  taxTerm,
  term,
  usePrecision
} = {}, attributes = {}) => {
  Object.entries({
    country,
    formatString,
    language,
    price: price2
  }).forEach(([key, value]) => {
    if (value == null) {
      throw new Error(`Argument "${key}" is missing`);
    }
  });
  const literals = {
    ...defaultLiterals,
    ...priceLiterals
  };
  const locale = `${language.toLowerCase()}-${country.toUpperCase()}`;
  function formatLiteral(key, parameters) {
    const literal = literals[key];
    if (literal == void 0) {
      return "";
    }
    try {
      return new lib_default(
        literal.replace(htmlPattern, ""),
        locale
      ).format(parameters);
    } catch {
      log.error("Failed to format literal:", literal);
      return "";
    }
  }
  const displayPrice = displayStrikethrough && priceWithoutDiscount ? priceWithoutDiscount : price2;
  let method = displayOptical ? formatOpticalPrice : formatRegularPrice;
  if (displayAnnual) {
    method = formatAnnualPrice;
  }
  const { accessiblePrice, recurrenceTerm, ...formattedPrice } = method({
    commitment,
    formatString,
    term,
    price: displayOptical ? price2 : displayPrice,
    usePrecision,
    isIndianPrice: country === "IN"
  });
  let accessibleLabel = accessiblePrice;
  let recurrenceLabel = "";
  if (toBoolean(displayRecurrence) && recurrenceTerm) {
    const recurrenceAccessibleLabel = formatLiteral(
      literalKeys.recurrenceAriaLabel,
      {
        recurrenceTerm
      }
    );
    if (recurrenceAccessibleLabel) {
      accessibleLabel += " " + recurrenceAccessibleLabel;
    }
    recurrenceLabel = formatLiteral(literalKeys.recurrenceLabel, {
      recurrenceTerm
    });
  }
  let perUnitLabel = "";
  if (toBoolean(displayPerUnit)) {
    perUnitLabel = formatLiteral(literalKeys.perUnitLabel, {
      perUnit: "LICENSE"
    });
    const perUnitAriaLabel = formatLiteral(
      literalKeys.perUnitAriaLabel,
      { perUnit: "LICENSE" }
    );
    if (perUnitAriaLabel) {
      accessibleLabel += " " + perUnitAriaLabel;
    }
  }
  let taxInclusivityLabel = "";
  if (toBoolean(displayTax) && taxTerm) {
    taxInclusivityLabel = formatLiteral(
      taxDisplay === WCS_TAX_DISPLAY_EXCLUSIVE ? literalKeys.taxExclusiveLabel : literalKeys.taxInclusiveLabel,
      { taxTerm }
    );
    if (taxInclusivityLabel) {
      accessibleLabel += " " + taxInclusivityLabel;
    }
  }
  if (displayStrikethrough) {
    accessibleLabel = formatLiteral(
      literalKeys.strikethroughAriaLabel,
      {
        strikethroughPrice: accessibleLabel
      }
    );
  }
  let cssClass = cssClassNames.container;
  if (displayOptical) {
    cssClass += " " + cssClassNames.containerOptical;
  }
  if (displayStrikethrough) {
    cssClass += " " + cssClassNames.containerStrikethrough;
  }
  if (displayAnnual) {
    cssClass += " " + cssClassNames.containerAnnual;
  }
  if (toBoolean(displayFormatted)) {
    return renderContainer(
      cssClass,
      {
        ...formattedPrice,
        accessibleLabel,
        recurrenceLabel,
        perUnitLabel,
        taxInclusivityLabel
      },
      attributes
    );
  }
  const {
    currencySymbol,
    decimals,
    decimalsDelimiter,
    hasCurrencySpace,
    integer,
    isCurrencyFirst
  } = formattedPrice;
  const unformattedPrice = [integer, decimalsDelimiter, decimals];
  if (isCurrencyFirst) {
    unformattedPrice.unshift(hasCurrencySpace ? "\xA0" : "");
    unformattedPrice.unshift(currencySymbol);
  } else {
    unformattedPrice.push(hasCurrencySpace ? "\xA0" : "");
    unformattedPrice.push(currencySymbol);
  }
  unformattedPrice.push(
    recurrenceLabel,
    perUnitLabel,
    taxInclusivityLabel
  );
  const content = unformattedPrice.join("");
  return renderSpan(cssClass, content, attributes);
};
var createPromoPriceTemplate = () => (context, value, attributes) => {
  const displayOldPrice = context.displayOldPrice === void 0 || toBoolean(context.displayOldPrice);
  const shouldDisplayOldPrice = displayOldPrice && value.priceWithoutDiscount && value.priceWithoutDiscount != value.price;
  return `${createPriceTemplate()(context, value, attributes)}${shouldDisplayOldPrice ? "&nbsp;" + createPriceTemplate({
    displayStrikethrough: true
  })(context, value, attributes) : ""}`;
};

// ../node_modules/@dexter/tacocat-consonant-templates/src/price/index.js
var price = createPriceTemplate();
var pricePromo = createPromoPriceTemplate();
var priceOptical = createPriceTemplate({
  displayOptical: true
});
var priceStrikethrough = createPriceTemplate({
  displayStrikethrough: true
});
var priceAnnual = createPriceTemplate({
  displayAnnual: true
});

// ../node_modules/@dexter/tacocat-consonant-templates/src/discount/template.js
var getDiscount = (price2, priceWithoutDiscount) => {
  if (!isPositiveFiniteNumber(price2) || !isPositiveFiniteNumber(priceWithoutDiscount))
    return;
  return Math.floor(
    (priceWithoutDiscount - price2) / priceWithoutDiscount * 100
  );
};
var createDiscountTemplate = () => (context, value, attributes) => {
  const { price: price2, priceWithoutDiscount } = value;
  const discount2 = getDiscount(price2, priceWithoutDiscount);
  return discount2 === void 0 ? `<span class="no-discount"></span>` : `<span class="discount">${discount2}%</span>`;
};

// ../node_modules/@dexter/tacocat-consonant-templates/src/discount/index.js
var discount = createDiscountTemplate();

// src/external.js
var { freeze } = Object;
var CheckoutWorkflow = freeze({ ...CheckoutType });
var CheckoutWorkflowStep = freeze({ ...WorkflowStep });
var Env = {
  STAGE: "STAGE",
  PRODUCTION: "PRODUCTION",
  LOCAL: "LOCAL"
};
var WcsCommitment = freeze({ ...Commitment });
var WcsPlanType = freeze({ ...PlanType });
var WcsTerm = freeze({ ...Term });

// src/constants.js
var constants_exports = {};
__export(constants_exports, {
  CLASS_NAME_FAILED: () => CLASS_NAME_FAILED,
  CLASS_NAME_PENDING: () => CLASS_NAME_PENDING,
  CLASS_NAME_RESOLVED: () => CLASS_NAME_RESOLVED,
  ERROR_MESSAGE_BAD_REQUEST: () => ERROR_MESSAGE_BAD_REQUEST,
  ERROR_MESSAGE_MISSING_LITERALS_URL: () => ERROR_MESSAGE_MISSING_LITERALS_URL,
  ERROR_MESSAGE_OFFER_NOT_FOUND: () => ERROR_MESSAGE_OFFER_NOT_FOUND,
  EVENT_TYPE_ERROR: () => EVENT_TYPE_ERROR,
  EVENT_TYPE_FAILED: () => EVENT_TYPE_FAILED,
  EVENT_TYPE_PENDING: () => EVENT_TYPE_PENDING,
  EVENT_TYPE_READY: () => EVENT_TYPE_READY,
  EVENT_TYPE_RESOLVED: () => EVENT_TYPE_RESOLVED,
  LOG_NAMESPACE: () => LOG_NAMESPACE,
  Landscape: () => Landscape2,
  PARAM_AOS_API_KEY: () => PARAM_AOS_API_KEY,
  PARAM_ENV: () => PARAM_ENV,
  PARAM_LANDSCAPE: () => PARAM_LANDSCAPE,
  PARAM_WCS_API_KEY: () => PARAM_WCS_API_KEY,
  STATE_FAILED: () => STATE_FAILED,
  STATE_PENDING: () => STATE_PENDING,
  STATE_RESOLVED: () => STATE_RESOLVED,
  WCS_PROD_URL: () => WCS_PROD_URL,
  WCS_STAGE_URL: () => WCS_STAGE_URL
});
var CLASS_NAME_FAILED = "placeholder-failed";
var CLASS_NAME_PENDING = "placeholder-pending";
var CLASS_NAME_RESOLVED = "placeholder-resolved";
var ERROR_MESSAGE_BAD_REQUEST = "Bad WCS request";
var ERROR_MESSAGE_OFFER_NOT_FOUND = "Commerce offer not found";
var ERROR_MESSAGE_MISSING_LITERALS_URL = "Literals URL not provided";
var EVENT_TYPE_ERROR = "wcms:commerce:error";
var EVENT_TYPE_FAILED = "mas:failed";
var EVENT_TYPE_PENDING = "mas:pending";
var EVENT_TYPE_READY = "wcms:commerce:ready";
var EVENT_TYPE_RESOLVED = "mas:resolved";
var LOG_NAMESPACE = "wcms/commerce";
var PARAM_ENV = "commerce.env";
var PARAM_LANDSCAPE = "commerce.landscape";
var PARAM_AOS_API_KEY = "commerce.aosKey";
var PARAM_WCS_API_KEY = "commerce.wcsKey";
var WCS_PROD_URL = "https://www.adobe.com/web_commerce_artifact";
var WCS_STAGE_URL = "https://www.stage.adobe.com/web_commerce_artifact_stage";
var STATE_FAILED = "failed";
var STATE_PENDING = "pending";
var STATE_RESOLVED = "resolved";
var Landscape2 = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED"
};

// src/utilities.js
var MAS_COMMERCE_SERVICE = "mas-commerce-service";
function discoverService(getConfig, { once = false } = {}) {
  let latest = null;
  function discover() {
    const current = document.querySelector(MAS_COMMERCE_SERVICE);
    if (current === latest)
      return;
    latest = current;
    if (current)
      getConfig(current);
  }
  document.addEventListener(EVENT_TYPE_READY, discover, { once });
  setImmediate(discover);
  return () => document.removeEventListener(EVENT_TYPE_READY, discover);
}
function selectOffers(offers, { country, forceTaxExclusive, perpetual }) {
  let selected;
  if (offers.length < 2)
    selected = offers;
  else {
    const language = country === "GB" || perpetual ? "EN" : "MULT";
    const [first, second] = offers;
    selected = [first.language === language ? first : second];
  }
  if (forceTaxExclusive) {
    selected = selected.map(forceTaxExclusivePrice);
  }
  return selected;
}
var setImmediate = (getConfig) => window.setTimeout(getConfig);
function toQuantity(value, defaultValue = 1) {
  if (value == null)
    return [defaultValue];
  let quantity = (Array.isArray(value) ? value : String(value).split(",")).map(toPositiveFiniteInteger).filter(isPositiveFiniteNumber);
  if (!quantity.length)
    quantity = [defaultValue];
  return quantity;
}
function toOfferSelectorIds(value) {
  if (value == null)
    return [];
  const ids = Array.isArray(value) ? value : String(value).split(",");
  return ids.filter(isNotEmptyString);
}
function useService() {
  return document.getElementsByTagName(MAS_COMMERCE_SERVICE)?.[0];
}

// src/mas-element.js
var StateClassName = {
  [STATE_FAILED]: CLASS_NAME_FAILED,
  [STATE_PENDING]: CLASS_NAME_PENDING,
  [STATE_RESOLVED]: CLASS_NAME_RESOLVED
};
var StateEventType = {
  [STATE_FAILED]: EVENT_TYPE_FAILED,
  [STATE_PENDING]: EVENT_TYPE_PENDING,
  [STATE_RESOLVED]: EVENT_TYPE_RESOLVED
};
var MasElement = class {
  constructor(wrapperElement) {
    __publicField(this, "changes", /* @__PURE__ */ new Map());
    __publicField(this, "connected", false);
    __publicField(this, "dispose", ignore);
    __publicField(this, "error");
    __publicField(this, "log");
    __publicField(this, "options");
    __publicField(this, "promises", []);
    __publicField(this, "state", STATE_PENDING);
    __publicField(this, "timer", null);
    __publicField(this, "value");
    __publicField(this, "version", 0);
    __publicField(this, "wrapperElement");
    this.wrapperElement = wrapperElement;
  }
  update() {
    [STATE_FAILED, STATE_PENDING, STATE_RESOLVED].forEach((state) => {
      this.wrapperElement.classList.toggle(StateClassName[state], state === this.state);
    });
  }
  notify() {
    if (this.state === STATE_RESOLVED || this.state === STATE_FAILED) {
      if (this.state === STATE_RESOLVED) {
        this.promises.forEach(({ resolve }) => resolve(this.wrapperElement));
      } else if (this.state === STATE_FAILED) {
        this.promises.forEach(({ reject }) => reject(this.error));
      }
      this.promises = [];
    }
    this.wrapperElement.dispatchEvent(
      new CustomEvent(StateEventType[this.state], { bubbles: true })
    );
  }
  /**
   * Adds name/value of the updated attribute to the `changes` map,
   * requests placeholder update.
   */
  attributeChangedCallback(name, _, value) {
    this.changes.set(name, value);
    this.requestUpdate();
  }
  /**
   * Triggers when this component is connected to DOM.
   * Subscribes to the `ready` event of the commerce service,
   * requests placeholder update.
   */
  connectedCallback() {
    this.dispose = discoverService(() => this.requestUpdate(true));
  }
  /**
   * Triggers when this component is disconnected from DOM.
   * Runs and then erases all disposers.
   */
  disconnectedCallback() {
    if (this.connected) {
      this.connected = false;
      this.log?.debug("Disconnected:", { element: this.wrapperElement });
    }
    this.dispose();
    this.dispose = ignore;
  }
  /**
   * Returns a promise resolving to this placeholder
   * when its value is resolved or rejected.
   * If placeholder is not pending for completion of an async operation
   * the returned promise is already resolved or rejected.
   */
  onceSettled() {
    const { error, promises, state } = this;
    if (STATE_RESOLVED === state)
      return Promise.resolve(this.wrapperElement);
    if (STATE_FAILED === state)
      return Promise.reject(error);
    return new Promise((resolve, reject) => {
      promises.push({ resolve, reject });
    });
  }
  /**
   * Sets component state to "RESOLVED".
   * Updates its class list and stored value, notifies observers and fires "RESOLVED" event.
   */
  toggleResolved(version, value, options) {
    if (version !== this.version)
      return false;
    if (options !== void 0)
      this.options = options;
    this.state = STATE_RESOLVED;
    this.value = value;
    this.update();
    this.log?.debug("Resolved:", { element: this.wrapperElement, value });
    setImmediate(() => this.notify());
    return true;
  }
  /**
   * Sets component state to "FAILED".
   * Updates its class list and stored error, notifies observers and fires "FAILED" event.
   */
  toggleFailed(version, error, options) {
    if (version !== this.version)
      return false;
    if (options !== void 0)
      this.options = options;
    this.error = error;
    this.state = STATE_FAILED;
    this.update();
    this.log?.error("Failed:", { element: this.wrapperElement, error });
    setImmediate(() => this.notify());
    return true;
  }
  /**
   * Sets component state to "PENDING".
   * Increments its version, updates CSS classes, notifies observers and fires "PENDING" event.
   */
  togglePending(options) {
    this.version++;
    if (options)
      this.options = options;
    this.state = STATE_PENDING;
    this.update();
    setImmediate(() => this.notify());
    return this.version;
  }
  /**
   * Queues task to update this component.
   * Skips rendering if update is not forced and no changes were accumulated since the previous update.
   * Calls `render` method to perform the update.
   * Restores previous state of the component if the `render` method returned `false`.
   */
  requestUpdate(force = false) {
    if (!this.wrapperElement.isConnected || !useService())
      return;
    if (this.timer)
      return;
    const { error, options, state, value, version } = this;
    this.state = STATE_PENDING;
    this.timer = setImmediate(async () => {
      this.timer = null;
      let changes = null;
      if (this.changes.size) {
        changes = Object.fromEntries(this.changes.entries());
        this.changes.clear();
      }
      if (this.connected) {
        this.log?.debug("Updated:", { element: this.wrapperElement, changes });
      } else {
        this.connected = true;
        this.log?.debug("Connected:", { element: this.wrapperElement, changes });
      }
      if (changes || force) {
        try {
          const result = await this.wrapperElement.render?.();
          if (result === false && this.state === STATE_PENDING && this.version === version) {
            this.state = state;
            this.error = error;
            this.value = value;
            this.update();
            this.notify();
          }
        } catch (error2) {
          this.toggleFailed(this.version, error2, options);
        }
      }
    });
  }
};
function cleanupDataset(dataset = {}) {
  Object.entries(dataset).forEach(([key, value]) => {
    const remove = value == null || value === "" || value?.length === 0;
    if (remove)
      delete dataset[key];
  });
  return dataset;
}
function createMasElement(Class, dataset = {}) {
  const { tag, is } = Class;
  const element = document.createElement(tag, { is });
  element.setAttribute("is", is);
  Object.assign(element.dataset, cleanupDataset(dataset));
  return element;
}
function selectMasElement(Class, container = document.body) {
  return Array.from(
    container?.querySelectorAll(`${Class.tag}[is="${Class.is}"]`) ?? []
  );
}
function updateMasElement(element, dataset = {}) {
  if (element instanceof HTMLElement) {
    Object.assign(element.dataset, cleanupDataset(dataset));
    return element;
  }
  return null;
}

// src/checkout-link.js
var CLASS_NAME_DOWNLOAD = "download";
var CLASS_NAME_UPGRADE = "upgrade";
var _checkoutActionHandler;
var _CheckoutLink = class _CheckoutLink extends HTMLAnchorElement {
  constructor() {
    super();
    __privateAdd(this, _checkoutActionHandler, void 0);
    __publicField(this, "masElement", new MasElement(this));
    this.addEventListener("click", this.clickHandler);
  }
  attributeChangedCallback(name, _, value) {
    this.masElement.attributeChangedCallback(name, _, value);
  }
  connectedCallback() {
    this.masElement.connectedCallback();
  }
  disconnectedCallback() {
    this.masElement.disconnectedCallback();
  }
  onceSettled() {
    return this.masElement.onceSettled();
  }
  get value() {
    return this.masElement.value;
  }
  static get observedAttributes() {
    return [
      "data-checkout-workflow",
      "data-checkout-workflow-step",
      "data-extra-options",
      "data-ims-country",
      "data-perpetual",
      "data-promotion-code",
      "data-quantity",
      "data-template",
      "data-wcs-osi",
      "data-entitlement",
      "data-upgrade",
      "data-modal"
    ];
  }
  static createCheckoutLink(options = {}, innerHTML = "") {
    const service = useService();
    if (!service)
      return null;
    const {
      checkoutMarketSegment,
      checkoutWorkflow,
      checkoutWorkflowStep,
      entitlement,
      upgrade,
      modal,
      perpetual,
      promotionCode,
      quantity,
      wcsOsi,
      extraOptions
    } = service.collectCheckoutOptions(options);
    const element = createMasElement(_CheckoutLink, {
      checkoutMarketSegment,
      checkoutWorkflow,
      checkoutWorkflowStep,
      entitlement,
      upgrade,
      modal,
      perpetual,
      promotionCode,
      quantity,
      wcsOsi,
      extraOptions
    });
    if (innerHTML)
      element.innerHTML = `<span>${innerHTML}</span>`;
    return element;
  }
  // TODO: consider moving this function to the `web-components` package
  static getCheckoutLinks(container) {
    const elements = selectMasElement(
      _CheckoutLink,
      container
    );
    return elements;
  }
  get isCheckoutLink() {
    return true;
  }
  /**
   * Click handler for checkout link.
   * Triggers checkout action handler, if provided.
   * @param {*} event
   */
  clickHandler(event) {
    var _a2;
    (_a2 = __privateGet(this, _checkoutActionHandler)) == null ? void 0 : _a2.call(this, event);
  }
  async render(overrides = {}) {
    if (!this.isConnected)
      return false;
    const service = useService();
    if (!service)
      return false;
    if (!this.dataset.imsCountry) {
      service.imsCountryPromise.then((countryCode) => {
        if (countryCode)
          this.dataset.imsCountry = countryCode;
      }, ignore);
    }
    const options = service.collectCheckoutOptions(
      overrides,
      this
    );
    if (!options.wcsOsi.length)
      return false;
    let extraOptions;
    try {
      extraOptions = JSON.parse(options.extraOptions ?? "{}");
    } catch (e) {
      this.masElement.log?.error("cannot parse exta checkout options", e);
    }
    const version = this.masElement.togglePending(options);
    this.href = "";
    const promises = service.resolveOfferSelectors(options);
    let offers = await Promise.all(promises);
    offers = offers.map((offer) => selectOffers(offer, options));
    const checkoutAction = await service.buildCheckoutAction?.(
      offers.flat(),
      { ...extraOptions, ...options }
    );
    return this.renderOffers(
      offers.flat(),
      options,
      {},
      checkoutAction,
      version
    );
  }
  /**
   * Renders checkout link href for provided offers into this component.
   * @param {Commerce.Wcs.Offer[]} offers
   * @param {Commerce.Checkout.Options} options
   * @param {Commerce.Checkout.AnyOptions} overrides
   * @param {Commerce.Checkout.CheckoutAction} checkoutAction
   * @param {number} version
   */
  renderOffers(offers, options, overrides = {}, checkoutAction = void 0, version = void 0) {
    if (!this.isConnected)
      return false;
    const service = useService();
    if (!service)
      return false;
    const extraOptions = JSON.parse(
      this.dataset.extraOptions ?? "null"
    );
    options = { ...extraOptions, ...options, ...overrides };
    version ?? (version = this.masElement.togglePending(options));
    if (__privateGet(this, _checkoutActionHandler)) {
      __privateSet(this, _checkoutActionHandler, void 0);
    }
    if (checkoutAction) {
      this.classList.remove(CLASS_NAME_DOWNLOAD, CLASS_NAME_UPGRADE);
      this.masElement.toggleResolved(version, offers, options);
      const { url, text, className, handler } = checkoutAction;
      if (url)
        this.href = url;
      if (text)
        this.firstElementChild.innerHTML = text;
      if (className)
        this.classList.add(...className.split(" "));
      if (handler) {
        this.setAttribute("href", "#");
        __privateSet(this, _checkoutActionHandler, handler.bind(this));
      }
      return true;
    } else if (offers.length) {
      if (this.masElement.toggleResolved(version, offers, options)) {
        const url = service.buildCheckoutURL(offers, options);
        this.setAttribute("href", url);
        return true;
      }
    } else {
      const error = new Error(`Not provided: ${options?.wcsOsi ?? "-"}`);
      if (this.masElement.toggleFailed(version, error, options)) {
        this.setAttribute("href", "#");
        return true;
      }
    }
    return false;
  }
  updateOptions(options = {}) {
    const service = useService();
    if (!service)
      return false;
    const {
      checkoutMarketSegment,
      checkoutWorkflow,
      checkoutWorkflowStep,
      entitlement,
      upgrade,
      modal,
      perpetual,
      promotionCode,
      quantity,
      wcsOsi
    } = service.collectCheckoutOptions(options);
    updateMasElement(this, {
      checkoutMarketSegment,
      checkoutWorkflow,
      checkoutWorkflowStep,
      entitlement,
      upgrade,
      modal,
      perpetual,
      promotionCode,
      quantity,
      wcsOsi
    });
    return true;
  }
};
_checkoutActionHandler = new WeakMap();
__publicField(_CheckoutLink, "is", "checkout-link");
__publicField(_CheckoutLink, "tag", "a");
var CheckoutLink = _CheckoutLink;
if (!window.customElements.get(CheckoutLink.is)) {
  window.customElements.define(CheckoutLink.is, CheckoutLink, { extends: CheckoutLink.tag });
}

// src/defaults.js
var Defaults = Object.freeze({
  checkoutClientId: "adobe_com",
  checkoutWorkflow: CheckoutWorkflow.V3,
  checkoutWorkflowStep: CheckoutWorkflowStep.EMAIL,
  country: "US",
  displayOldPrice: true,
  displayPerUnit: false,
  displayRecurrence: true,
  displayTax: false,
  env: Env.PRODUCTION,
  forceTaxExclusive: false,
  language: "en",
  entitlement: false,
  extraOptions: {},
  modal: false,
  promotionCode: "",
  quantity: 1,
  wcsApiKey: "wcms-commerce-ims-ro-user-milo",
  wcsBufferDelay: 1,
  wcsURL: "https://www.adobe.com/web_commerce_artifact",
  landscape: Landscape2.PUBLISHED,
  wcsBufferLimit: 1
});

// src/lana.js
var Defaults2 = {
  clientId: "merch-at-scale",
  delimiter: "\xB6",
  ignoredProperties: ["analytics", "literals"],
  serializableTypes: ["Array", "Object"],
  // Sample rate is set to 100 meaning each error will get logged in Splunk
  sampleRate: 30,
  tags: "consumer=milo/commerce"
};
var seenPayloads = /* @__PURE__ */ new Set();
var isError = (value) => value instanceof Error || // WCS error response
// TODO: check if still actual
typeof value.originatingRequest === "string";
function serializeValue(value) {
  if (value == null)
    return void 0;
  const type = typeof value;
  if (type === "function") {
    const { name } = value;
    return name ? `${type} ${name}` : type;
  }
  if (type === "object") {
    if (value instanceof Error)
      return value.message;
    if (typeof value.originatingRequest === "string") {
      const { message, originatingRequest, status } = value;
      return [message, status, originatingRequest].filter((v) => v).join(" ");
    }
    const name = value[Symbol.toStringTag] ?? Object.getPrototypeOf(value).constructor.name;
    if (!Defaults2.serializableTypes.includes(name))
      return name;
  }
  return value;
}
function serializeParam(key, value) {
  if (Defaults2.ignoredProperties.includes(key))
    return void 0;
  return serializeValue(value);
}
var lanaAppender = {
  append(entry) {
    const { delimiter, sampleRate, tags, clientId } = Defaults2;
    const { message, params } = entry;
    const errors = [];
    let payload = message;
    const values = [];
    params.forEach((param) => {
      if (param != null) {
        (isError(param) ? errors : values).push(param);
      }
    });
    if (errors.length) {
      payload += " ";
      payload += errors.map(serializeValue).join(" ");
    }
    const { pathname, search } = window.location;
    payload += `${delimiter}page=`;
    payload += pathname + search;
    if (values.length) {
      payload += `${delimiter}facts=`;
      payload += JSON.stringify(values, serializeParam);
    }
    if (!seenPayloads.has(payload)) {
      seenPayloads.add(payload);
      window.lana?.log(payload, { sampleRate, tags, clientId });
    }
  }
};

// src/settings.js
var HostEnv = Object.freeze({
  LOCAL: "local",
  PROD: "prod",
  STAGE: "stage"
});
function getLocaleSettings({ locale = void 0, country = void 0, language = void 0 } = {}) {
  language ?? (language = locale?.split("_")?.[0] || Defaults.language);
  country ?? (country = locale?.split("_")?.[1] || Defaults.country);
  locale ?? (locale = `${language}_${country}`);
  return { locale, country, language };
}
function getSettings(config = {}) {
  const { commerce = {}, locale = void 0 } = config;
  let env = Env.PRODUCTION;
  let wcsURL = WCS_PROD_URL;
  const lowHostEnv = ["local", "stage"].includes(config.env?.name);
  const forceWcsStage = getParameter(PARAM_ENV, commerce, { metadata: false })?.toLowerCase() === "stage";
  if (lowHostEnv && forceWcsStage) {
    env = Env.STAGE;
    wcsURL = WCS_STAGE_URL;
  }
  const checkoutClientId = getParameter("checkoutClientId", commerce) ?? Defaults.checkoutClientId;
  const checkoutWorkflow = toEnumeration(
    getParameter("checkoutWorkflow", commerce),
    CheckoutWorkflow,
    Defaults.checkoutWorkflow
  );
  let checkoutWorkflowStep = CheckoutWorkflowStep.CHECKOUT;
  if (checkoutWorkflow === CheckoutWorkflow.V3) {
    checkoutWorkflowStep = toEnumeration(
      getParameter("checkoutWorkflowStep", commerce),
      CheckoutWorkflowStep,
      Defaults.checkoutWorkflowStep
    );
  }
  const displayOldPrice = toBoolean(
    getParameter("displayOldPrice", commerce),
    Defaults.displayOldPrice
  );
  const displayPerUnit = toBoolean(
    getParameter("displayPerUnit", commerce),
    Defaults.displayPerUnit
  );
  const displayRecurrence = toBoolean(
    getParameter("displayRecurrence", commerce),
    Defaults.displayRecurrence
  );
  const displayTax = toBoolean(
    getParameter("displayTax", commerce),
    Defaults.displayTax
  );
  const entitlement = toBoolean(
    getParameter("entitlement", commerce),
    Defaults.entitlement
  );
  const modal = toBoolean(getParameter("modal", commerce), Defaults.modal);
  const forceTaxExclusive = toBoolean(
    getParameter("forceTaxExclusive", commerce),
    Defaults.forceTaxExclusive
  );
  const promotionCode = getParameter("promotionCode", commerce) ?? Defaults.promotionCode;
  const quantity = toQuantity(getParameter("quantity", commerce));
  const wcsApiKey = getParameter("wcsApiKey", commerce) ?? Defaults.wcsApiKey;
  const landscape = config.env?.name === HostEnv.PROD ? Landscape2.PUBLISHED : toEnumeration(
    getParameter(PARAM_LANDSCAPE, commerce),
    Landscape2,
    Defaults.landscape
  );
  let wcsBufferDelay = toPositiveFiniteInteger(
    getParameter("wcsBufferDelay", commerce),
    Defaults.wcsBufferDelay
  );
  let wcsBufferLimit = toPositiveFiniteInteger(
    getParameter("wcsBufferLimit", commerce),
    Defaults.wcsBufferLimit
  );
  return {
    ...getLocaleSettings(config),
    displayOldPrice,
    checkoutClientId,
    checkoutWorkflow,
    checkoutWorkflowStep,
    displayPerUnit,
    displayRecurrence,
    displayTax,
    entitlement,
    extraOptions: Defaults.extraOptions,
    modal,
    env,
    forceTaxExclusive,
    promotionCode,
    quantity,
    wcsApiKey,
    wcsBufferDelay,
    wcsBufferLimit,
    wcsURL,
    landscape
  };
}

// src/log.js
var DEBUG = "debug";
var ERROR = "error";
var INFO = "info";
var WARN = "warn";
var epoch2 = Date.now();
var appenders = /* @__PURE__ */ new Set();
var filters = /* @__PURE__ */ new Set();
var indexes = /* @__PURE__ */ new Map();
var Level = Object.freeze({
  DEBUG,
  ERROR,
  INFO,
  WARN
});
var consoleAppender = {
  append({ level, message, params, timestamp, source }) {
    console[level](
      `${timestamp}ms [${source}] %c${message}`,
      "font-weight: bold;",
      ...params
    );
  }
};
var debugFilter = { filter: ({ level }) => level !== DEBUG };
var quietFilter = { filter: () => false };
function createEntry(level, message, namespace2, params, source) {
  return {
    level,
    message,
    namespace: namespace2,
    get params() {
      if (params.length === 1) {
        const [param] = params;
        if (isFunction(param)) {
          params = param();
          if (!Array.isArray(params))
            params = [params];
        }
      }
      return params;
    },
    source,
    timestamp: Date.now() - epoch2
  };
}
function handleEntry(entry) {
  if ([...filters].every((filter) => filter(entry))) {
    appenders.forEach((appender) => appender(entry));
  }
}
function createLog2(namespace2) {
  const index = (indexes.get(namespace2) ?? 0) + 1;
  indexes.set(namespace2, index);
  const id = `${namespace2} #${index}`;
  const createHandler = (level) => (message, ...params) => handleEntry(createEntry(level, message, namespace2, params, id));
  const log2 = Object.seal({
    id,
    namespace: namespace2,
    module(name) {
      return createLog2(`${log2.namespace}/${name}`);
    },
    debug: createHandler(Level.DEBUG),
    error: createHandler(Level.ERROR),
    info: createHandler(Level.INFO),
    warn: createHandler(Level.WARN)
  });
  return log2;
}
function use(...plugins) {
  plugins.forEach((plugin) => {
    const { append, filter } = plugin;
    if (isFunction(filter)) {
      filters.add(filter);
    } else if (isFunction(append)) {
      appenders.add(append);
    }
  });
}
function init(env = {}) {
  const { name } = env;
  const debug = toBoolean(
    getParameter("commerce.debug", { search: true, storage: true }),
    name === HostEnv.LOCAL
  );
  if (debug)
    use(consoleAppender);
  else
    use(debugFilter);
  if (name === HostEnv.PROD)
    use(lanaAppender);
  return Log;
}
function reset() {
  appenders.clear();
  filters.clear();
}
var Log = {
  ...createLog2(LOG_NAMESPACE),
  Level,
  Plugins: {
    consoleAppender,
    debugFilter,
    quietFilter,
    lanaAppender
  },
  init,
  reset,
  use
};

// src/checkout.js
function Checkout({ providers, settings }) {
  const log2 = Log.module("checkout");
  function collectCheckoutOptions(overrides, placeholder) {
    const {
      checkoutClientId,
      checkoutWorkflow: defaultWorkflow,
      checkoutWorkflowStep: defaultWorkflowStep,
      country: defaultCountry,
      language: defaultLanguage,
      promotionCode: defaultPromotionCode,
      quantity: defaultQuantity
    } = settings;
    const {
      checkoutMarketSegment,
      checkoutWorkflow = defaultWorkflow,
      checkoutWorkflowStep = defaultWorkflowStep,
      imsCountry: imsCountry2,
      country = imsCountry2 ?? defaultCountry,
      language = defaultLanguage,
      quantity = defaultQuantity,
      entitlement,
      upgrade,
      modal,
      perpetual,
      promotionCode = defaultPromotionCode,
      wcsOsi,
      extraOptions,
      ...rest
    } = Object.assign({}, placeholder?.dataset ?? {}, overrides ?? {});
    const workflow = toEnumeration(
      checkoutWorkflow,
      CheckoutWorkflow,
      Defaults.checkoutWorkflow
    );
    let workflowStep = CheckoutWorkflowStep.CHECKOUT;
    if (workflow === CheckoutWorkflow.V3) {
      workflowStep = toEnumeration(
        checkoutWorkflowStep,
        CheckoutWorkflowStep,
        Defaults.checkoutWorkflowStep
      );
    }
    const options = omitProperties({
      ...rest,
      extraOptions,
      checkoutClientId,
      checkoutMarketSegment,
      country,
      quantity: toQuantity(quantity, Defaults.quantity),
      checkoutWorkflow: workflow,
      checkoutWorkflowStep: workflowStep,
      language,
      entitlement: toBoolean(entitlement),
      upgrade: toBoolean(upgrade),
      modal: toBoolean(modal),
      perpetual: toBoolean(perpetual),
      promotionCode: computePromoStatus(promotionCode).effectivePromoCode,
      wcsOsi: toOfferSelectorIds(wcsOsi)
    });
    if (placeholder) {
      for (const provider of providers.checkout) {
        provider(placeholder, options);
      }
    }
    return options;
  }
  function buildCheckoutURL(offers, options) {
    if (!Array.isArray(offers) || !offers.length || !options) {
      return "";
    }
    const { env, landscape } = settings;
    const {
      checkoutClientId: clientId,
      checkoutMarketSegment: marketSegment,
      checkoutWorkflow: workflow,
      checkoutWorkflowStep: workflowStep,
      country,
      promotionCode: checkoutPromoCode,
      quantity,
      ...rest
    } = collectCheckoutOptions(options);
    const context = window.frameElement ? "if" : "fp";
    const data = {
      checkoutPromoCode,
      clientId,
      context,
      country,
      env,
      items: [],
      marketSegment,
      workflowStep,
      landscape,
      ...rest
    };
    if (offers.length === 1) {
      const [{ offerId, offerType, productArrangementCode }] = offers;
      const {
        marketSegments: [marketSegment2]
      } = offers[0];
      Object.assign(data, {
        marketSegment: marketSegment2,
        offerType,
        productArrangementCode
      });
      data.items.push(
        quantity[0] === 1 ? { id: offerId } : { id: offerId, quantity: quantity[0] }
      );
    } else {
      data.items.push(
        ...offers.map(({ offerId }, index) => ({
          id: offerId,
          quantity: quantity[index] ?? Defaults.quantity
        }))
      );
    }
    return buildCheckoutUrl(workflow, data);
  }
  const { createCheckoutLink, getCheckoutLinks } = CheckoutLink;
  return {
    CheckoutLink,
    CheckoutWorkflow,
    CheckoutWorkflowStep,
    buildCheckoutURL,
    collectCheckoutOptions,
    createCheckoutLink,
    getCheckoutLinks
  };
}

// src/ims.js
function imsReady({ interval = 200, maxAttempts = 25 } = {}) {
  const log2 = Log.module("ims");
  return new Promise((resolve) => {
    log2.debug("Waing for IMS to be ready");
    let count = 0;
    function poll() {
      if (window.adobeIMS?.initialized) {
        resolve();
      } else if (++count > maxAttempts) {
        log2.debug("Timeout");
        resolve();
      } else {
        setTimeout(poll, interval);
      }
    }
    poll();
  });
}
function imsSignedIn(imsReadyPromise) {
  return imsReadyPromise.then(
    () => window.adobeIMS?.isSignedInUser() ?? false
  );
}
function imsCountry(imsSignedInPromise) {
  const log2 = Log.module("ims");
  return imsSignedInPromise.then((signedIn) => {
    if (!signedIn)
      return null;
    return window.adobeIMS.getProfile().then(
      ({ countryCode }) => {
        log2.debug("Got user country:", countryCode);
        return countryCode;
      },
      (error) => {
        log2.error("Unable to get user country:", error);
        return void 0;
      }
    );
  });
}
function Ims({}) {
  const imsReadyPromise = imsReady();
  const imsSignedInPromise = imsSignedIn(imsReadyPromise);
  const imsCountryPromise = imsCountry(imsSignedInPromise);
  return { imsReadyPromise, imsSignedInPromise, imsCountryPromise };
}

// src/literals.js
async function getPriceLiterals(settings, priceLiterals) {
  const { data } = priceLiterals ? priceLiterals : await Promise.resolve().then(() => __toESM(require_price_literals(), 1));
  if (Array.isArray(data)) {
    const find = (language) => data.find(
      (candidate) => equalsCaseInsensitive(candidate.lang, language)
    );
    const literals = find(settings.language) ?? find(Defaults.language);
    if (literals)
      return Object.freeze(literals);
  }
  return {};
}

// src/inline-price.js
var DISPLAY_ALL_TAX_COUNTRIES = [
  "GB_en",
  "AU_en",
  "FR_fr",
  "AT_de",
  "BE_en",
  "BE_fr",
  "BE_nl",
  "BG_bg",
  "CH_de",
  "CH_fr",
  "CH_it",
  "CZ_cs",
  "DE_de",
  "DK_da",
  "EE_et",
  "EG_ar",
  "EG_en",
  "ES_es",
  "FI_fi",
  "FR_fr",
  "GR_el",
  "GR_en",
  "HU_hu",
  "IE_en",
  "IT_it",
  "LU_de",
  "LU_en",
  "LU_fr",
  "NL_nl",
  "NO_nb",
  "PL_pl",
  "PT_pt",
  "RO_ro",
  "SE_sv",
  "SI_sl",
  "SK_sk",
  "TR_tr",
  "UA_uk",
  "ID_en",
  "ID_in",
  "IN_en",
  "IN_hi",
  "JP_ja",
  "MY_en",
  "MY_ms",
  "NZ_en",
  "TH_en",
  "TH_th"
];
var DISPLAY_TAX_MAP = {
  // individual
  INDIVIDUAL_COM: ["ZA_en", "LT_lt", "LV_lv", "NG_en", "SA_ar", "SA_en", "ZA_en", "SG_en", "KR_ko"],
  // business
  TEAM_COM: ["ZA_en", "LT_lt", "LV_lv", "NG_en", "ZA_en", "CO_es", "KR_ko"],
  // student
  INDIVIDUAL_EDU: ["LT_lt", "LV_lv", "SA_en", "SG_en"],
  // school and uni
  TEAM_EDU: ["SG_en", "KR_ko"]
};
var _InlinePrice = class _InlinePrice extends HTMLSpanElement {
  constructor() {
    super(...arguments);
    __publicField(this, "masElement", new MasElement(this));
  }
  static get observedAttributes() {
    return [
      "data-display-old-price",
      "data-display-per-unit",
      "data-display-recurrence",
      "data-display-tax",
      "data-perpetual",
      "data-promotion-code",
      "data-tax-exclusive",
      "data-template",
      "data-wcs-osi"
    ];
  }
  static createInlinePrice(options) {
    const service = useService();
    if (!service)
      return null;
    const {
      displayOldPrice,
      displayPerUnit,
      displayRecurrence,
      displayTax,
      forceTaxExclusive,
      perpetual,
      promotionCode,
      quantity,
      template,
      wcsOsi
    } = service.collectPriceOptions(options);
    const element = createMasElement(_InlinePrice, {
      displayOldPrice,
      displayPerUnit,
      displayRecurrence,
      displayTax,
      forceTaxExclusive,
      perpetual,
      promotionCode,
      quantity,
      template,
      wcsOsi
    });
    return element;
  }
  // TODO: consider moving this function to the `web-components` package
  static getInlinePrices(container) {
    const elements = selectMasElement(_InlinePrice, container);
    return elements;
  }
  get isInlinePrice() {
    return true;
  }
  attributeChangedCallback(name, _, value) {
    this.masElement.attributeChangedCallback(name, _, value);
  }
  connectedCallback() {
    this.masElement.connectedCallback();
  }
  disconnectedCallback() {
    this.masElement.disconnectedCallback();
  }
  onceSettled() {
    return this.masElement.onceSettled();
  }
  get value() {
    return this.masElement.value;
  }
  /**
   * Resolves default value of displayTax property, based on provided geo info and segments.
   * @returns {boolean}
   */
  /* c8 ignore next 26 */
  resolveDisplayTaxForGeoAndSegment(country, language, customerSegment, marketSegment) {
    const locale = `${country}_${language}`;
    if (DISPLAY_ALL_TAX_COUNTRIES.includes(country) || DISPLAY_ALL_TAX_COUNTRIES.includes(locale)) {
      return true;
    }
    const segmentConfig = DISPLAY_TAX_MAP[`${customerSegment}_${marketSegment}`];
    if (!segmentConfig) {
      return false;
    }
    if (segmentConfig.includes(country) || segmentConfig.includes(locale)) {
      return true;
    }
    return false;
  }
  /**
   * Resolves default value of displayTax property, based on provided geo info and segments extracted from offers object.
   * @returns {boolean}
  */
  /* c8 ignore next 15 */
  async resolveDisplayTax(service, options) {
    const [offerSelectors] = await service.resolveOfferSelectors(options);
    const offers = selectOffers(await offerSelectors, options);
    if (offers?.length) {
      const { country, language } = options;
      const offer = offers[0];
      const [marketSegment = ""] = offer.marketSegments;
      return this.resolveDisplayTaxForGeoAndSegment(
        country,
        language,
        offer.customerSegment,
        marketSegment
      );
    }
  }
  /**
   * Resolves associated osi via Wcs and renders price offer.
   * @param {Record<string, any>} overrides
   */
  async render(overrides = {}) {
    if (!this.isConnected)
      return false;
    const service = useService();
    if (!service)
      return false;
    const options = service.collectPriceOptions(
      overrides,
      this
    );
    if (!options.wcsOsi.length)
      return false;
    const version = this.masElement.togglePending(options);
    this.innerHTML = "";
    const [promise] = service.resolveOfferSelectors(options);
    return this.renderOffers(
      selectOffers(await promise, options),
      options,
      version
    );
  }
  // TODO: can be extended to accept array of offers and compute subtotal price
  /**
   * Renders price offer as HTML of this component
   * using consonant price template functions
   * from package `@dexter/tacocat-consonant-templates`.
   * @param {Commerce.Wcs.Offer[]} offers
   * @param {Record<string, any>} overrides
   * Optional object with properties to use as overrides
   * over those collected from dataset of this component.
   */
  renderOffers(offers, overrides = {}, version = void 0) {
    if (!this.isConnected)
      return;
    const service = useService();
    if (!service)
      return false;
    const options = service.collectPriceOptions({
      ...this.dataset,
      ...overrides
    }, this);
    version ?? (version = this.masElement.togglePending(options));
    if (offers.length) {
      if (this.masElement.toggleResolved(version, offers, options)) {
        this.innerHTML = service.buildPriceHTML(offers, options);
        return true;
      }
    } else {
      const error = new Error(`Not provided: ${options?.wcsOsi ?? "-"}`);
      if (this.masElement.toggleFailed(version, error, options)) {
        this.innerHTML = "";
        return true;
      }
    }
    return false;
  }
  updateOptions(options) {
    const service = useService();
    if (!service)
      return false;
    const {
      displayOldPrice,
      displayPerUnit,
      displayRecurrence,
      displayTax,
      forceTaxExclusive,
      perpetual,
      promotionCode,
      quantity,
      template,
      wcsOsi
    } = service.collectPriceOptions(options);
    updateMasElement(this, {
      displayOldPrice,
      displayPerUnit,
      displayRecurrence,
      displayTax,
      forceTaxExclusive,
      perpetual,
      promotionCode,
      quantity,
      template,
      wcsOsi
    });
    return true;
  }
};
__publicField(_InlinePrice, "is", "inline-price");
__publicField(_InlinePrice, "tag", "span");
var InlinePrice = _InlinePrice;
if (!window.customElements.get(InlinePrice.is)) {
  window.customElements.define(InlinePrice.is, InlinePrice, { extends: InlinePrice.tag });
}

// src/price.js
function Price({ literals, providers, settings }) {
  function collectPriceOptions(overrides, placeholder) {
    const {
      country: defaultCountry,
      displayOldPrice: defaultDisplayOldPrice,
      displayPerUnit: defaultDisplayPerUnit,
      displayRecurrence: defaultDisplayRecurrence,
      displayTax: defaultDisplayTax,
      forceTaxExclusive: defaultForceTaxExclusive,
      language: defaultLanguage,
      promotionCode: defaultPromotionCode,
      quantity: defaultQuantity
    } = settings;
    const {
      displayOldPrice = defaultDisplayOldPrice,
      displayPerUnit = defaultDisplayPerUnit,
      displayRecurrence = defaultDisplayRecurrence,
      displayTax = defaultDisplayTax,
      forceTaxExclusive = defaultForceTaxExclusive,
      country = defaultCountry,
      language = defaultLanguage,
      perpetual,
      promotionCode = defaultPromotionCode,
      quantity = defaultQuantity,
      template,
      wcsOsi,
      ...rest
    } = Object.assign({}, placeholder?.dataset ?? {}, overrides ?? {});
    const options = omitProperties({
      ...rest,
      country,
      displayOldPrice: toBoolean(displayOldPrice),
      displayPerUnit: toBoolean(displayPerUnit),
      displayRecurrence: toBoolean(displayRecurrence),
      displayTax: toBoolean(displayTax),
      forceTaxExclusive: toBoolean(forceTaxExclusive),
      language,
      perpetual: toBoolean(perpetual),
      promotionCode: computePromoStatus(promotionCode).effectivePromoCode,
      quantity: toQuantity(quantity, Defaults.quantity),
      template,
      wcsOsi: toOfferSelectorIds(wcsOsi)
    });
    if (placeholder) {
      for (const provider of providers.price) {
        provider(placeholder, options);
      }
    }
    return options;
  }
  function buildPriceHTML(offers, options) {
    if (!Array.isArray(offers) || !offers.length || !options) {
      return "";
    }
    const { template } = options;
    let method;
    switch (template) {
      case "discount":
        method = discount;
        break;
      case "strikethrough":
        method = priceStrikethrough;
        break;
      case "optical":
        method = priceOptical;
        break;
      case "annual":
        method = priceAnnual;
        break;
      default:
        method = options.promotionCode ? pricePromo : price;
    }
    const context = collectPriceOptions(options);
    context.literals = Object.assign(
      {},
      literals.price,
      omitProperties(options.literals ?? {})
    );
    let [offer] = offers;
    offer = { ...offer, ...offer.priceDetails };
    return method(context, offer);
  }
  const { createInlinePrice, getInlinePrices } = InlinePrice;
  return {
    InlinePrice,
    buildPriceHTML,
    collectPriceOptions,
    // TODO: remove after update of Milo merch block
    createInlinePrice,
    getInlinePrices
  };
}

// src/wcs.js
function Wcs({ settings }) {
  const log2 = Log.module("wcs");
  const { env, wcsApiKey: apiKey } = settings;
  const cache = /* @__PURE__ */ new Map();
  const queue = /* @__PURE__ */ new Map();
  let timer;
  async function resolveWcsOffers(options, promises, reject = true) {
    let message = ERROR_MESSAGE_OFFER_NOT_FOUND;
    log2.debug("Fetching:", options);
    try {
      options.offerSelectorIds = options.offerSelectorIds.sort();
      const url = new URL(settings.wcsURL);
      url.searchParams.set("offer_selector_ids", options.offerSelectorIds.join(","));
      url.searchParams.set("country", options.country);
      url.searchParams.set("locale", options.locale);
      url.searchParams.set("landscape", env === Env.STAGE ? "ALL" : settings.landscape);
      url.searchParams.set("api_key", apiKey);
      if (options.language) {
        url.searchParams.set("language", options.language);
      }
      if (options.promotionCode) {
        url.searchParams.set("promotion_code", options.promotionCode);
      }
      if (options.currency) {
        url.searchParams.set("currency", options.currency);
      }
      const response = await fetch(url.toString(), {
        credentials: "omit"
      });
      if (response.ok) {
        const data = await response.json();
        log2.debug("Fetched:", options, data);
        let offers = data.resolvedOffers ?? [];
        offers = offers.map(applyPlanType);
        promises.forEach(({ resolve }, offerSelectorId) => {
          const resolved = offers.filter(
            ({ offerSelectorIds }) => offerSelectorIds.includes(offerSelectorId)
          ).flat();
          if (resolved.length) {
            promises.delete(offerSelectorId);
            resolve(resolved);
          }
        });
      } else if (response.status === 404 && options.offerSelectorIds.length > 1) {
        log2.debug("Multi-osi 404, fallback to fetch-by-one strategy");
        await Promise.allSettled(
          options.offerSelectorIds.map(
            (offerSelectorId) => resolveWcsOffers(
              { ...options, offerSelectorIds: [offerSelectorId] },
              promises,
              false
              // do not reject promises for missing offers, this will be done below
            )
          )
        );
      } else {
        message = ERROR_MESSAGE_BAD_REQUEST;
        log2.error(message, options);
      }
    } catch (e) {
      message = ERROR_MESSAGE_BAD_REQUEST;
      log2.error(message, options, e);
    }
    if (reject && promises.size) {
      log2.debug("Missing:", { offerSelectorIds: [...promises.keys()] });
      promises.forEach((promise) => {
        promise.reject(new Error(message));
      });
    }
  }
  function flushQueue() {
    clearTimeout(timer);
    const pending = [...queue.values()];
    queue.clear();
    pending.forEach(
      ({ options, promises }) => resolveWcsOffers(options, promises)
    );
  }
  function resolveOfferSelectors({
    country,
    language,
    perpetual = false,
    promotionCode = "",
    wcsOsi = []
  }) {
    const locale = `${language}_${country}`;
    if (country !== "GB")
      language = perpetual ? "EN" : "MULT";
    const groupKey = [country, language, promotionCode].filter((val) => val).join("-").toLowerCase();
    return wcsOsi.map((osi) => {
      const cacheKey = `${osi}-${groupKey}`;
      if (!cache.has(cacheKey)) {
        const promise = new Promise((resolve, reject) => {
          let group = queue.get(groupKey);
          if (!group) {
            const options = {
              country,
              locale,
              offerSelectorIds: []
            };
            if (country !== "GB")
              options.language = language;
            const promises = /* @__PURE__ */ new Map();
            group = { options, promises };
            queue.set(groupKey, group);
          }
          if (promotionCode) {
            group.options.promotionCode = promotionCode;
          }
          group.options.offerSelectorIds.push(osi);
          group.promises.set(osi, {
            resolve,
            reject
          });
          if (group.options.offerSelectorIds.length >= settings.wcsBufferLimit) {
            flushQueue();
          } else {
            log2.debug("Queued:", group.options);
            if (!timer) {
              timer = setTimeout(
                flushQueue,
                settings.wcsBufferDelay
              );
            }
          }
        });
        cache.set(cacheKey, promise);
      }
      return cache.get(cacheKey);
    });
  }
  return {
    WcsCommitment,
    WcsPlanType,
    WcsTerm,
    resolveOfferSelectors
  };
}

// src/mas-commerce-service.js
var TAG_NAME_SERVICE = "mas-commerce-service";
var _MasCommerceService = class _MasCommerceService extends HTMLElement {
  constructor() {
    super(...arguments);
    __publicField(this, "promise", null);
  }
  get config() {
    const { searchParams } = new URL(import.meta.url);
    const env = this.getAttribute("env") || searchParams.get("env");
    const isStage = env?.toLowerCase() === "stage";
    const envName = isStage ? "stage" : "prod";
    const commerceEnv = isStage ? "STAGE" : "PROD";
    const config = {
      env: { name: envName },
      commerce: { "commerce.env": commerceEnv }
    };
    ["locale", "country", "language"].forEach((attribute) => {
      const value = this.getAttribute(attribute);
      if (value) {
        config[attribute] = value;
      }
    });
    ["checkoutWorkflowStep", "forceTaxExclusive"].forEach((attribute) => {
      const value = this.getAttribute(attribute);
      if (value) {
        config.commerce[attribute] = value;
      }
    });
    return config;
  }
  async registerCheckoutAction(action) {
    if (typeof action != "function")
      return;
    this.buildCheckoutAction = async (offers, options) => {
      const checkoutAction = await action?.(
        offers,
        options,
        this.imsSignedInPromise
      );
      if (checkoutAction) {
        return checkoutAction;
      }
      return null;
    };
  }
  async activate(resolve) {
    const config = this.config;
    const log2 = Log.init(config.env).module("service");
    log2.debug("Activating:", config);
    const settings = Object.freeze(getSettings(config));
    const literals = { price: {} };
    try {
      literals.price = await getPriceLiterals(settings, config.commerce.priceLiterals);
    } catch (e) {
    }
    const providers = {
      checkout: /* @__PURE__ */ new Set(),
      price: /* @__PURE__ */ new Set()
    };
    const startup = { literals, providers, settings };
    _MasCommerceService.instance = Object.defineProperties(
      this,
      Object.getOwnPropertyDescriptors({
        // Activate modules and expose their API as combined flat object
        ...Checkout(startup),
        ...Ims(startup),
        ...Price(startup),
        ...Wcs(startup),
        ...constants_exports,
        // Defined serviceweb  component API
        Log,
        get defaults() {
          return Defaults;
        },
        get literals() {
          return literals;
        },
        get log() {
          return Log;
        },
        /* c8 ignore next 11 */
        get providers() {
          return {
            checkout(provider) {
              providers.checkout.add(provider);
              return () => providers.checkout.delete(provider);
            },
            price(provider) {
              providers.price.add(provider);
              return () => providers.price.delete(provider);
            }
          };
        },
        get settings() {
          return settings;
        }
      })
    );
    log2.debug("Activated:", { literals, settings });
    setImmediate(() => {
      const event = new CustomEvent(EVENT_TYPE_READY, {
        bubbles: true,
        cancelable: false,
        detail: _MasCommerceService.instance
      });
      this.dispatchEvent(event);
    });
    resolve(this);
  }
  connectedCallback() {
    if (this.promise) {
      return this.promise;
    }
    _MasCommerceService.instance = this;
    this.promise = new Promise((resolve) => {
      this.activate(resolve);
    });
  }
  disconnectedCallback() {
    _MasCommerceService.instance = null;
  }
};
__publicField(_MasCommerceService, "instance");
var MasCommerceService = _MasCommerceService;
if (!window.customElements.get(TAG_NAME_SERVICE)) {
  window.customElements.define(TAG_NAME_SERVICE, MasCommerceService);
}
export {
  CheckoutLink,
  CheckoutWorkflow,
  CheckoutWorkflowStep,
  Defaults,
  InlinePrice,
  Landscape2 as Landscape,
  Log,
  TAG_NAME_SERVICE,
  WcsCommitment,
  WcsPlanType,
  WcsTerm,
  applyPlanType,
  getSettings
};
>>>>>>> 5f6c4dd5f4368be771bbc134f1d20027522670c8
