var Ts=Object.create;var Qt=Object.defineProperty;var ys=Object.getOwnPropertyDescriptor;var Ls=Object.getOwnPropertyNames;var _s=Object.getPrototypeOf,ws=Object.prototype.hasOwnProperty;var Xn=e=>{throw TypeError(e)};var Ps=(e,t,r)=>t in e?Qt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var Cs=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Is=(e,t)=>{for(var r in t)Qt(e,r,{get:t[r],enumerable:!0})},Ns=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of Ls(t))!ws.call(e,n)&&n!==r&&Qt(e,n,{get:()=>t[n],enumerable:!(i=ys(t,n))||i.enumerable});return e};var ks=(e,t,r)=>(r=e!=null?Ts(_s(e)):{},Ns(t||!e||!e.__esModule?Qt(r,"default",{value:e,enumerable:!0}):r,e));var f=(e,t,r)=>Ps(e,typeof t!="symbol"?t+"":t,r),jr=(e,t,r)=>t.has(e)||Xn("Cannot "+r);var L=(e,t,r)=>(jr(e,t,"read from private field"),r?r.call(e):t.get(e)),D=(e,t,r)=>t.has(e)?Xn("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),F=(e,t,r,i)=>(jr(e,t,"write to private field"),i?i.call(e,r):t.set(e,r),r),xe=(e,t,r)=>(jr(e,t,"access private method"),r);var us=Cs((vf,ph)=>{ph.exports={total:38,offset:0,limit:38,data:[{lang:"ar",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u0627\u0644\u0634\u0647\u0631} YEAR {/\u0627\u0644\u0639\u0627\u0645} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u0643\u0644 \u0634\u0647\u0631} YEAR {\u0643\u0644 \u0639\u0627\u0645} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0644\u0643\u0644 \u062A\u0631\u062E\u064A\u0635} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0644\u0643\u0644 \u062A\u0631\u062E\u064A\u0635} other {}}",freeLabel:"\u0645\u062C\u0627\u0646\u064B\u0627",freeAriaLabel:"\u0645\u062C\u0627\u0646\u064B\u0627",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u0623\u0648 \u0628\u062F\u0644\u0627\u064B \u0645\u0646 \u0630\u0644\u0643 \u0628\u0642\u064A\u0645\u0629 {alternativePrice}",strikethroughAriaLabel:"\u0628\u0634\u0643\u0644 \u0645\u0646\u062A\u0638\u0645 \u0628\u0642\u064A\u0645\u0629 {strikethroughPrice}"},{lang:"bg",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u043C\u0435\u0441.} YEAR {/\u0433\u043E\u0434.} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u043D\u0430 \u043C\u0435\u0441\u0435\u0446} YEAR {\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u043D\u0430 \u043B\u0438\u0446\u0435\u043D\u0437} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u043D\u0430 \u043B\u0438\u0446\u0435\u043D\u0437} other {}}",freeLabel:"\u0411\u0435\u0437\u043F\u043B\u0430\u0442\u043D\u043E",freeAriaLabel:"\u0411\u0435\u0437\u043F\u043B\u0430\u0442\u043D\u043E",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u0410\u043B\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u043E \u043D\u0430 {alternativePrice}",strikethroughAriaLabel:"\u0420\u0435\u0434\u043E\u0432\u043D\u043E \u043D\u0430 {strikethroughPrice}"},{lang:"cs",recurrenceLabel:"{recurrenceTerm, select, MONTH {/m\u011Bs\xEDc} YEAR {/rok} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {za m\u011Bs\xEDc} YEAR {za rok} other {}}",perUnitLabel:"{perUnit, select, LICENSE {za licenci} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {za licenci} other {}}",freeLabel:"Zdarma",freeAriaLabel:"Zdarma",taxExclusiveLabel:"{taxTerm, select, GST {bez dan\u011B ze zbo\u017E\xED a slu\u017Eeb} VAT {bez DPH} TAX {bez dan\u011B} IVA {bez IVA} SST {bez SST} KDV {bez KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {v\u010Detn\u011B dan\u011B ze zbo\u017E\xED a slu\u017Eeb} VAT {v\u010Detn\u011B DPH} TAX {v\u010Detn\u011B dan\u011B} IVA {v\u010Detn\u011B IVA} SST {v\u010Detn\u011B SST} KDV {v\u010Detn\u011B KDV} other {}}",alternativePriceAriaLabel:"P\u0159\xEDpadn\u011B za {alternativePrice}",strikethroughAriaLabel:"Pravideln\u011B za {strikethroughPrice}"},{lang:"da",recurrenceLabel:"{recurrenceTerm, select, MONTH {/md} YEAR {/\xE5r} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {pr. m\xE5ned} YEAR {pr. \xE5r} other {}}",perUnitLabel:"{perUnit, select, LICENSE {pr. licens} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {pr. licens} other {}}",freeLabel:"Gratis",freeAriaLabel:"Gratis",taxExclusiveLabel:"{taxTerm, select, GST {ekskl. GST} VAT {ekskl. moms} TAX {ekskl. skat} IVA {ekskl. IVA} SST {ekskl. SST} KDV {ekskl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. skat} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativt til {alternativePrice}",strikethroughAriaLabel:"Normalpris {strikethroughPrice}"},{lang:"de",recurrenceLabel:"{recurrenceTerm, select, MONTH {/Monat} YEAR {/Jahr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {pro Monat} YEAR {pro Jahr} other {}}",perUnitLabel:"{perUnit, select, LICENSE {pro Lizenz} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {pro Lizenz} other {}}",freeLabel:"Kostenlos",freeAriaLabel:"Kostenlos",taxExclusiveLabel:"{taxTerm, select, GST {zzgl. GST} VAT {zzgl. MwSt.} TAX {zzgl. Steuern} IVA {zzgl. IVA} SST {zzgl. SST} KDV {zzgl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. MwSt.} TAX {inkl. Steuern} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativ: {alternativePrice}",strikethroughAriaLabel:"Regul\xE4r: {strikethroughPrice}"},{lang:"en",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at {alternativePrice}",strikethroughAriaLabel:"Regularly at {strikethroughPrice}"},{lang:"et",recurrenceLabel:"{recurrenceTerm, select, MONTH {kuus} YEAR {aastas} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {kuus} YEAR {aastas} other {}}",perUnitLabel:"{perUnit, select, LICENSE {litsentsi kohta} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {litsentsi kohta} other {}}",freeLabel:"Tasuta",freeAriaLabel:"Tasuta",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Teise v\xF5imalusena hinnaga {alternativePrice}",strikethroughAriaLabel:"Tavahind {strikethroughPrice}"},{lang:"fi",recurrenceLabel:"{recurrenceTerm, select, MONTH {/kk} YEAR {/v} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {kuukausittain} YEAR {vuosittain} other {}}",perUnitLabel:"{perUnit, select, LICENSE {k\xE4ytt\xF6oikeutta kohti} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {k\xE4ytt\xF6oikeutta kohti} other {}}",freeLabel:"Maksuton",freeAriaLabel:"Maksuton",taxExclusiveLabel:"{taxTerm, select, GST {ilman GST:t\xE4} VAT {ilman ALV:t\xE4} TAX {ilman veroja} IVA {ilman IVA:ta} SST {ilman SST:t\xE4} KDV {ilman KDV:t\xE4} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {sis. GST:n} VAT {sis. ALV:n} TAX {sis. verot} IVA {sis. IVA:n} SST {sis. SST:n} KDV {sis. KDV:n} other {}}",alternativePriceAriaLabel:"Vaihtoehtoisesti hintaan {alternativePrice}",strikethroughAriaLabel:"S\xE4\xE4nn\xF6llisesti hintaan {strikethroughPrice}"},{lang:"fr",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mois} YEAR {/an} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {par mois} YEAR {par an} other {}}",perUnitLabel:"{perUnit, select, LICENSE {par licence} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {par licence} other {}}",freeLabel:"Gratuit",freeAriaLabel:"Gratuit",taxExclusiveLabel:"{taxTerm, select, GST {hors TPS} VAT {hors TVA} TAX {hors taxes} IVA {hors IVA} SST {hors SST} KDV {hors KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {TPS comprise} VAT {TVA comprise} TAX {taxes comprises} IVA {IVA comprise} SST {SST comprise} KDV {KDV comprise} other {}}",alternativePriceAriaLabel:"Autre prix {alternativePrice}",strikethroughAriaLabel:"Prix habituel {strikethroughPrice}"},{lang:"he",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u05D7\u05D5\u05D3\u05E9} YEAR {/\u05E9\u05E0\u05D4} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u05DC\u05D7\u05D5\u05D3\u05E9} YEAR {\u05DC\u05E9\u05E0\u05D4} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",freeLabel:"\u05D7\u05D9\u05E0\u05DD",freeAriaLabel:"\u05D7\u05D9\u05E0\u05DD",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u05DC\u05D7\u05DC\u05D5\u05E4\u05D9\u05DF \u05D1-{alternativePrice}",strikethroughAriaLabel:"\u05D1\u05D0\u05D5\u05E4\u05DF \u05E7\u05D1\u05D5\u05E2 \u05D1-{strikethroughPrice}"},{lang:"hu",recurrenceLabel:"{recurrenceTerm, select, MONTH {/h\xF3} YEAR {/\xE9v} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {havonta} YEAR {\xE9vente} other {}}",perUnitLabel:"{perUnit, select, LICENSE {licencenk\xE9nt} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {licencenk\xE9nt} other {}}",freeLabel:"Ingyenes",freeAriaLabel:"Ingyenes",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"M\xE1sik lehet\u0151s\xE9g: {alternativePrice}",strikethroughAriaLabel:"\xC1ltal\xE1ban {strikethroughPrice} \xE1ron"},{lang:"it",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mese} YEAR {/anno} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {al mese} YEAR {all'anno} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per licenza} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per licenza} other {}}",freeLabel:"Gratuito",freeAriaLabel:"Gratuito",taxExclusiveLabel:"{taxTerm, select, GST {escl. GST} VAT {escl. IVA.} TAX {escl. imposte} IVA {escl. IVA} SST {escl. SST} KDV {escl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. IVA} TAX {incl. imposte} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"In alternativa a {alternativePrice}",strikethroughAriaLabel:"Regolarmente a {strikethroughPrice}"},{lang:"ja",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u6BCE\u6708} YEAR {\u6BCE\u5E74} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u30E9\u30A4\u30BB\u30F3\u30B9\u3054\u3068} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u30E9\u30A4\u30BB\u30F3\u30B9\u3054\u3068} other {}}",freeLabel:"\u7121\u6599",freeAriaLabel:"\u7121\u6599",taxExclusiveLabel:"{taxTerm, select, GST {GST \u5225} VAT {VAT \u5225} TAX {\u7A0E\u5225} IVA {IVA \u5225} SST {SST \u5225} KDV {KDV \u5225} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST \u8FBC} VAT {VAT \u8FBC} TAX {\u7A0E\u8FBC} IVA {IVA \u8FBC} SST {SST \u8FBC} KDV {KDV \u8FBC} other {}}",alternativePriceAriaLabel:"\u7279\u5225\u4FA1\u683C : {alternativePrice}",strikethroughAriaLabel:"\u901A\u5E38\u4FA1\u683C : {strikethroughPrice}"},{lang:"ko",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\uC6D4} YEAR {/\uB144} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\uC6D4\uAC04} YEAR {\uC5F0\uAC04} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\uB77C\uC774\uC120\uC2A4\uB2F9} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\uB77C\uC774\uC120\uC2A4\uB2F9} other {}}",freeLabel:"\uBB34\uB8CC",freeAriaLabel:"\uBB34\uB8CC",taxExclusiveLabel:"{taxTerm, select, GST {GST \uC81C\uC678} VAT {VAT \uC81C\uC678} TAX {\uC138\uAE08 \uC81C\uC678} IVA {IVA \uC81C\uC678} SST {SST \uC81C\uC678} KDV {KDV \uC81C\uC678} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST \uD3EC\uD568} VAT {VAT \uD3EC\uD568} TAX {\uC138\uAE08 \uD3EC\uD568} IVA {IVA \uD3EC\uD568} SST {SST \uD3EC\uD568} KDV {KDV \uD3EC\uD568} other {}}",alternativePriceAriaLabel:"\uB610\uB294 {alternativePrice}\uC5D0",strikethroughAriaLabel:"\uB610\uB294 {alternativePrice}\uC5D0"},{lang:"lt",recurrenceLabel:"{recurrenceTerm, select, MONTH { per m\u0117n.} YEAR { per metus} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per m\u0117n.} YEAR {per metus} other {}}",perUnitLabel:"{perUnit, select, LICENSE {u\u017E licencij\u0105} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {u\u017E licencij\u0105} other {}}",freeLabel:"Nemokamai",freeAriaLabel:"Nemokamai",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Arba u\u017E {alternativePrice}",strikethroughAriaLabel:"Normaliai u\u017E {strikethroughPrice}"},{lang:"lv",recurrenceLabel:"{recurrenceTerm, select, MONTH {m\u0113nes\u012B} YEAR {gad\u0101} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {m\u0113nes\u012B} YEAR {gad\u0101} other {}}",perUnitLabel:"{perUnit, select, LICENSE {vienai licencei} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {vienai licencei} other {}}",freeLabel:"Bezmaksas",freeAriaLabel:"Bezmaksas",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternat\u012Bvi par {alternativePrice}",strikethroughAriaLabel:"Regul\u0101ri par {strikethroughPrice}"},{lang:"nb",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mnd.} YEAR {/\xE5r} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per m\xE5ned} YEAR {per \xE5r} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per lisens} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per lisens} other {}}",freeLabel:"Fri",freeAriaLabel:"Fri",taxExclusiveLabel:"{taxTerm, select, GST {ekskl. GST} VAT {ekskl. moms} TAX {ekskl. avgift} IVA {ekskl. IVA} SST {ekskl. SST} KDV {ekskl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. avgift} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativt til {alternativePrice}",strikethroughAriaLabel:"Regelmessig til {strikethroughPrice}"},{lang:"nl",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mnd} YEAR {/jr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per maand} YEAR {per jaar} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per licentie} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per licentie} other {}}",freeLabel:"Gratis",freeAriaLabel:"Gratis",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. btw} TAX {excl. belasting} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. btw} TAX {incl. belasting} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Nu {alternativePrice}",strikethroughAriaLabel:"Normaal {strikethroughPrice}"},{lang:"pl",recurrenceLabel:"{recurrenceTerm, select, MONTH { / mies.} YEAR { / rok} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH { / miesi\u0105c} YEAR { / rok} other {}}",perUnitLabel:"{perUnit, select, LICENSE {za licencj\u0119} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {za licencj\u0119} other {}}",freeLabel:"Bezp\u0142atne",freeAriaLabel:"Bezp\u0142atne",taxExclusiveLabel:"{taxTerm, select, GST {bez GST} VAT {bez VAT} TAX {netto} IVA {bez IVA} SST {bez SST} KDV {bez KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {z GST} VAT {z VAT} TAX {brutto} IVA {z IVA} SST {z SST} KDV {z KDV} other {}}",alternativePriceAriaLabel:"Lub za {alternativePrice}",strikethroughAriaLabel:"Cena zwyk\u0142a: {strikethroughPrice}"},{lang:"pt",recurrenceLabel:"{recurrenceTerm, select, MONTH {/m\xEAs} YEAR {/ano} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {por m\xEAs} YEAR {por ano} other {}}",perUnitLabel:"{perUnit, select, LICENSE {por licen\xE7a} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {por licen\xE7a} other {}}",freeLabel:"Gratuito",freeAriaLabel:"Gratuito",taxExclusiveLabel:"{taxTerm, select, GST {ICMS n\xE3o incluso} VAT {IVA n\xE3o incluso} TAX {impostos n\xE3o inclusos} IVA {IVA n\xE3o incluso} SST { SST n\xE3o incluso} KDV {KDV n\xE3o incluso} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {ICMS incluso} VAT {IVA incluso} TAX {impostos inclusos} IVA {IVA incluso} SST {SST incluso} KDV {KDV incluso} other {}}",alternativePriceAriaLabel:"Ou a {alternativePrice}",strikethroughAriaLabel:"Pre\xE7o normal: {strikethroughPrice}"},{lang:"ro",recurrenceLabel:"{recurrenceTerm, select, MONTH {/lun\u0103} YEAR {/an} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {pe lun\u0103} YEAR {pe an} other {}}",perUnitLabel:"{perUnit, select, LICENSE {pe licen\u021B\u0103} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {pe licen\u021B\u0103} other {}}",freeLabel:"Gratuit",freeAriaLabel:"Gratuit",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternativ, la {alternativePrice}",strikethroughAriaLabel:"\xCEn mod normal, la {strikethroughPrice}"},{lang:"ru",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u043C\u0435\u0441.} YEAR {/\u0433.} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u0432 \u043C\u0435\u0441\u044F\u0446} YEAR {\u0432 \u0433\u043E\u0434} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u044E} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u044E} other {}}",freeLabel:"\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E",freeAriaLabel:"\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E",taxExclusiveLabel:"{taxTerm, select, GST {\u0438\u0441\u043A\u043B. \u043D\u0430\u043B\u043E\u0433 \u043D\u0430 \u0442\u043E\u0432\u0430\u0440\u044B \u0438 \u0443\u0441\u043B\u0443\u0433\u0438} VAT {\u0438\u0441\u043A\u043B. \u041D\u0414\u0421} TAX {\u0438\u0441\u043A\u043B. \u043D\u0430\u043B\u043E\u0433} IVA {\u0438\u0441\u043A\u043B. \u0418\u0412\u0410} SST {\u0438\u0441\u043A\u043B. SST} KDV {\u0438\u0441\u043A\u043B. \u041A\u0414\u0412} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u0432\u043A\u043B. \u043D\u0430\u043B\u043E\u0433 \u043D\u0430 \u0442\u043E\u0432\u0430\u0440\u044B \u0438 \u0443\u0441\u043B\u0443\u0433\u0438} VAT {\u0432\u043A\u043B. \u041D\u0414\u0421} TAX {\u0432\u043A\u043B. \u043D\u0430\u043B\u043E\u0433} IVA {\u0432\u043A\u043B. \u0418\u0412\u0410} SST {\u0432\u043A\u043B. SST} KDV {\u0432\u043A\u043B. \u041A\u0414\u0412} other {}}",alternativePriceAriaLabel:"\u0410\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442 \u0437\u0430 {alternativePrice}",strikethroughAriaLabel:"\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E \u043F\u043E \u0446\u0435\u043D\u0435 {strikethroughPrice}"},{lang:"sk",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mesiac} YEAR {/rok} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {za mesiac} YEAR {za rok} other {}}",perUnitLabel:"{perUnit, select, LICENSE {za licenciu} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {za licenciu} other {}}",freeLabel:"Zadarmo",freeAriaLabel:"Zadarmo",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Pr\xEDpadne za {alternativePrice}",strikethroughAriaLabel:"Pravidelne za {strikethroughPrice}"},{lang:"sl",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mesec} YEAR {/leto} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {na mesec} YEAR {na leto} other {}}",perUnitLabel:"{perUnit, select, LICENSE {na licenco} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {na licenco} other {}}",freeLabel:"Brezpla\u010Dno",freeAriaLabel:"Brezpla\u010Dno",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Druga mo\u017Enost je: {alternativePrice}",strikethroughAriaLabel:"Redno po {strikethroughPrice}"},{lang:"sv",recurrenceLabel:"{recurrenceTerm, select, MONTH {/m\xE5n} YEAR {/\xE5r} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per m\xE5nad} YEAR {per \xE5r} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per licens} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per licens} other {}}",freeLabel:"Kostnadsfritt",freeAriaLabel:"Kostnadsfritt",taxExclusiveLabel:"{taxTerm, select, GST {exkl. GST} VAT {exkl. moms} TAX {exkl. skatt} IVA {exkl. IVA} SST {exkl. SST} KDV {exkl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. skatt} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativt f\xF6r {alternativePrice}",strikethroughAriaLabel:"Normalpris {strikethroughPrice}"},{lang:"tr",recurrenceLabel:"{recurrenceTerm, select, MONTH {/ay} YEAR {/y\u0131l} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {(ayl\u0131k)} YEAR {(y\u0131ll\u0131k)} other {}}",perUnitLabel:"{perUnit, select, LICENSE {(lisans ba\u015F\u0131na)} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {(lisans ba\u015F\u0131na)} other {}}",freeLabel:"\xDCcretsiz",freeAriaLabel:"\xDCcretsiz",taxExclusiveLabel:"{taxTerm, select, GST {GST hari\xE7} VAT {KDV hari\xE7} TAX {vergi hari\xE7} IVA {IVA hari\xE7} SST {SST hari\xE7} KDV {KDV hari\xE7} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST dahil} VAT {KDV dahil} TAX {vergi dahil} IVA {IVA dahil} SST {SST dahil} KDV {KDV dahil} other {}}",alternativePriceAriaLabel:"Ya da {alternativePrice}",strikethroughAriaLabel:"Standart fiyat: {strikethroughPrice}"},{lang:"uk",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u043C\u0456\u0441.} YEAR {/\u0440\u0456\u043A} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u043D\u0430 \u043C\u0456\u0441\u044F\u0446\u044C} YEAR {\u043D\u0430 \u0440\u0456\u043A} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0456\u0446\u0435\u043D\u0437\u0456\u044E} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0456\u0446\u0435\u043D\u0437\u0456\u044E} other {}}",freeLabel:"\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u043E",freeAriaLabel:"\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u043E",taxExclusiveLabel:"{taxTerm, select, GST {\u0431\u0435\u0437 GST} VAT {\u0431\u0435\u0437 \u041F\u0414\u0412} TAX {\u0431\u0435\u0437 \u043F\u043E\u0434\u0430\u0442\u043A\u0443} IVA {\u0431\u0435\u0437 IVA} SST {\u0431\u0435\u0437 SST} KDV {\u0431\u0435\u0437 KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 GST} VAT {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 \u041F\u0414\u0412} TAX {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 \u043F\u043E\u0434\u0430\u0442\u043A\u043E\u043C} IVA {\u0440\u0430\u0437\u043E\u043C \u0437 IVA} SST {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 SST} KDV {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 KDV} other {}}",alternativePriceAriaLabel:"\u0410\u0431\u043E \u0437\u0430 {alternativePrice}",strikethroughAriaLabel:"\u0417\u0432\u0438\u0447\u0430\u0439\u043D\u0430 \u0446\u0456\u043D\u0430 {strikethroughPrice}"},{lang:"zh-hans",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u6BCF\u6708} YEAR {\u6BCF\u5E74} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u6BCF\u4E2A\u8BB8\u53EF\u8BC1} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u6BCF\u4E2A\u8BB8\u53EF\u8BC1} other {}}",freeLabel:"\u514D\u8D39",freeAriaLabel:"\u514D\u8D39",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u6216\u5B9A\u4EF7 {alternativePrice}",strikethroughAriaLabel:"\u6B63\u5E38\u4EF7 {strikethroughPrice}"},{lang:"zh-hant",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u6BCF\u6708} YEAR {\u6BCF\u5E74} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u6BCF\u500B\u6388\u6B0A} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u6BCF\u500B\u6388\u6B0A} other {}}",freeLabel:"\u514D\u8CBB",freeAriaLabel:"\u514D\u8CBB",taxExclusiveLabel:"{taxTerm, select, GST {\u4E0D\u542B GST} VAT {\u4E0D\u542B VAT} TAX {\u4E0D\u542B\u7A05} IVA {\u4E0D\u542B IVA} SST {\u4E0D\u542B SST} KDV {\u4E0D\u542B KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u542B GST} VAT {\u542B VAT} TAX {\u542B\u7A05} IVA {\u542B IVA} SST {\u542B SST} KDV {\u542B KDV} other {}}",alternativePriceAriaLabel:"\u6216\u8005\u5728 {alternativePrice}",strikethroughAriaLabel:"\u6A19\u6E96\u50F9\u683C\u70BA {strikethroughPrice}"},{lang:"es",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mes} YEAR {/a\xF1o} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {al mes} YEAR {al a\xF1o} other {}}",perUnitLabel:"{perUnit, select, LICENSE {por licencia} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {por licencia} other {}}",freeLabel:"Gratuito",freeAriaLabel:"Gratuito",taxExclusiveLabel:"{taxTerm, select, GST {GST no incluido} VAT {IVA no incluido} TAX {Impuestos no incluidos} IVA {IVA no incluido} SST {SST no incluido} KDV {KDV no incluido} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST incluido} VAT {IVA incluido} TAX {Impuestos incluidos} IVA {IVA incluido} SST {SST incluido} KDV {KDV incluido} other {}}",alternativePriceAriaLabel:"Alternativamente por {alternativePrice}",strikethroughAriaLabel:"Normalmente a {strikethroughPrice}"},{lang:"in",recurrenceLabel:"{recurrenceTerm, select, MONTH {/bulan} YEAR {/tahun} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per bulan} YEAR {per tahun} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per lisensi} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per lisensi} other {}}",freeLabel:"Gratis",freeAriaLabel:"Gratis",taxExclusiveLabel:"{taxTerm, select, GST {tidak termasuk PBJ} VAT {tidak termasuk PPN} TAX {tidak termasuk pajak} IVA {tidak termasuk IVA} SST {tidak termasuk SST} KDV {tidak termasuk KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {termasuk PBJ} VAT {termasuk PPN} TAX {termasuk pajak} IVA {termasuk IVA} SST {termasuk SST} KDV {termasuk KDV} other {}}",alternativePriceAriaLabel:"Atau seharga {alternativePrice}",strikethroughAriaLabel:"Normalnya seharga {strikethroughPrice}"},{lang:"vi",recurrenceLabel:"{recurrenceTerm, select, MONTH {/th\xE1ng} YEAR {/n\u0103m} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {m\u1ED7i th\xE1ng} YEAR {m\u1ED7i n\u0103m} other {}}",perUnitLabel:"{perUnit, select, LICENSE {m\u1ED7i gi\u1EA5y ph\xE9p} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {m\u1ED7i gi\u1EA5y ph\xE9p} other {}}",freeLabel:"Mi\u1EC5n ph\xED",freeAriaLabel:"Mi\u1EC5n ph\xED",taxExclusiveLabel:"{taxTerm, select, GST {ch\u01B0a bao g\u1ED3m thu\u1EBF h\xE0ng h\xF3a v\xE0 d\u1ECBch v\u1EE5} VAT {ch\u01B0a bao g\u1ED3m thu\u1EBF GTGT} TAX {ch\u01B0a bao g\u1ED3m thu\u1EBF} IVA {ch\u01B0a bao g\u1ED3m IVA} SST {ch\u01B0a bao g\u1ED3m SST} KDV {ch\u01B0a bao g\u1ED3m KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {(\u0111\xE3 bao g\u1ED3m thu\u1EBF h\xE0ng h\xF3a v\xE0 d\u1ECBch v\u1EE5)} VAT {(\u0111\xE3 bao g\u1ED3m thu\u1EBF GTGT)} TAX {(\u0111\xE3 bao g\u1ED3m thu\u1EBF)} IVA {(\u0111\xE3 bao g\u1ED3m IVA)} SST {(\u0111\xE3 bao g\u1ED3m SST)} KDV {(\u0111\xE3 bao g\u1ED3m KDV)} other {}}",alternativePriceAriaLabel:"Gi\xE1 \u01B0u \u0111\xE3i {alternativePrice}",strikethroughAriaLabel:"Gi\xE1 th\xF4ng th\u01B0\u1EDDng {strikethroughPrice}"},{lang:"th",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u0E40\u0E14\u0E37\u0E2D\u0E19} YEAR {/\u0E1B\u0E35} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u0E15\u0E48\u0E2D\u0E40\u0E14\u0E37\u0E2D\u0E19} YEAR {\u0E15\u0E48\u0E2D\u0E1B\u0E35} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0E15\u0E48\u0E2D\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0E15\u0E48\u0E2D\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19} other {}}",freeLabel:"\u0E1F\u0E23\u0E35",freeAriaLabel:"\u0E1F\u0E23\u0E35",taxExclusiveLabel:"{taxTerm, select, GST {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35 GST} VAT {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 VAT} TAX {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35} IVA {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 IVA} SST {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 SST} KDV {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35 GST} VAT {\u0E23\u0E27\u0E21 VAT} TAX {\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35} IVA {\u0E23\u0E27\u0E21 IVA} SST {\u0E23\u0E27\u0E21 SST} KDV {\u0E23\u0E27\u0E21 KDV} other {}}",alternativePriceAriaLabel:"\u0E23\u0E32\u0E04\u0E32\u0E1E\u0E34\u0E40\u0E28\u0E29 {alternativePrice}",strikethroughAriaLabel:"\u0E23\u0E32\u0E04\u0E32\u0E1B\u0E01\u0E15\u0E34 {strikethroughPrice}"},{lang:"el",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u03BC\u03AE\u03BD\u03B1} YEAR {/\u03AD\u03C4\u03BF\u03C2} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u03BA\u03AC\u03B8\u03B5 \u03BC\u03AE\u03BD\u03B1} YEAR {\u03B1\u03BD\u03AC \u03AD\u03C4\u03BF\u03C2} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u03B1\u03BD\u03AC \u03AC\u03B4\u03B5\u03B9\u03B1 \u03C7\u03C1\u03AE\u03C3\u03B7\u03C2} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u03B1\u03BD\u03AC \u03AC\u03B4\u03B5\u03B9\u03B1 \u03C7\u03C1\u03AE\u03C3\u03B7\u03C2} other {}}",freeLabel:"\u0394\u03C9\u03C1\u03B5\u03AC\u03BD",freeAriaLabel:"\u0394\u03C9\u03C1\u03B5\u03AC\u03BD",taxExclusiveLabel:"{taxTerm, select, GST {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 GST)} VAT {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03A6\u03A0\u0391)} TAX {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C6\u03CC\u03C1\u03BF)} IVA {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 IVA)} SST {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 SST)} KDV {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 KDV)} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 GST)} VAT {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03A6\u03A0\u0391)} TAX {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 \u03C6\u03CC\u03C1\u03BF\u03C5)} IVA {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 IVA)} SST {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 SST)} KDV {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 KDV)} other {}}",alternativePriceAriaLabel:"\u0394\u03B9\u03B1\u03C6\u03BF\u03C1\u03B5\u03C4\u03B9\u03BA\u03AC, {alternativePrice}",strikethroughAriaLabel:"\u039A\u03B1\u03BD\u03BF\u03BD\u03B9\u03BA\u03AE \u03C4\u03B9\u03BC\u03AE {strikethroughPrice}"},{lang:"fil",recurrenceLabel:"{recurrenceTerm, select, MONTH {/buwan} YEAR {/taon} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per buwan} YEAR {per taon} other {}}",perUnitLabel:"{perUnit, select, LICENSE {kada lisensya} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {kada lisensya} other {}}",freeLabel:"Libre",freeAriaLabel:"Libre",taxExclusiveLabel:"{taxTerm, select, GST {hindi kasama ang GST} VAT {hindi kasama ang VAT} TAX {hindi kasama ang Buwis} IVA {hindi kasama ang IVA} SST {hindi kasama ang SST} KDV {hindi kasama ang KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {kasama ang GST} VAT {kasama ang VAT} TAX {kasama ang Buwis} IVA {kasama ang IVA} SST {kasama ang SST} KDV {kasama ang KDV} other {}}",alternativePriceAriaLabel:"Alternatibong nasa halagang {alternativePrice}",strikethroughAriaLabel:"Regular na nasa halagang {strikethroughPrice}"},{lang:"ms",recurrenceLabel:"{recurrenceTerm, select, MONTH {/bulan} YEAR {/tahun} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per bulan} YEAR {per tahun} other {}}",perUnitLabel:"{perUnit, select, LICENSE {setiap lesen} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {setiap lesen} other {}}",freeLabel:"Percuma",freeAriaLabel:"Percuma",taxExclusiveLabel:"{taxTerm, select, GST {kecuali GST} VAT {kecuali VAT} TAX {kecuali Cukai} IVA {kecuali IVA} SST {kecuali SST} KDV {kecuali KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {termasuk GST} VAT {termasuk VAT} TAX {termasuk Cukai} IVA {termasuk IVA} SST {termasuk SST} KDV {termasuk KDV} other {}}",alternativePriceAriaLabel:"Secara alternatif pada {alternativePrice}",strikethroughAriaLabel:"Biasanya pada {strikethroughPrice}"},{lang:"hi",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u092E\u093E\u0939} YEAR {/\u0935\u0930\u094D\u0937} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per \u092E\u093E\u0939} YEAR {per \u0935\u0930\u094D\u0937} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u092A\u094D\u0930\u0924\u093F \u0932\u093E\u0907\u0938\u0947\u0902\u0938} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u092A\u094D\u0930\u0924\u093F \u0932\u093E\u0907\u0938\u0947\u0902\u0938} other {}}",freeLabel:"\u092B\u093C\u094D\u0930\u0940",freeAriaLabel:"\u092B\u093C\u094D\u0930\u0940",taxExclusiveLabel:"{taxTerm, select, GST {GST \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} VAT {VAT \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} TAX {\u0915\u0930 \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} IVA {IVA \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} SST {SST \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} KDV {KDV \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST \u0938\u0939\u093F\u0924} VAT {VAT \u0938\u0939\u093F\u0924} TAX {\u0915\u0930 \u0938\u0939\u093F\u0924} IVA {IVA \u0938\u0939\u093F\u0924} SST {SST \u0938\u0939\u093F\u0924} KDV {KDV \u0938\u0939\u093F\u0924} other {}}",alternativePriceAriaLabel:"\u0935\u0948\u0915\u0932\u094D\u092A\u093F\u0915 \u0930\u0942\u092A \u0938\u0947 \u0907\u0938 \u092A\u0930 {alternativePrice}",strikethroughAriaLabel:"\u0928\u093F\u092F\u092E\u093F\u0924 \u0930\u0942\u092A \u0938\u0947 \u0907\u0938 \u092A\u0930 {strikethroughPrice}"},{lang:"iw",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u05D7\u05D5\u05D3\u05E9} YEAR {/\u05E9\u05E0\u05D4} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u05DC\u05D7\u05D5\u05D3\u05E9} YEAR {\u05DC\u05E9\u05E0\u05D4} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",freeLabel:"\u05D7\u05D9\u05E0\u05DD",freeAriaLabel:"\u05D7\u05D9\u05E0\u05DD",taxExclusiveLabel:'{taxTerm, select, GST {\u05DC\u05DC\u05D0 GST} VAT {\u05DC\u05DC\u05D0 \u05DE\u05E2"\u05DE} TAX {\u05DC\u05DC\u05D0 \u05DE\u05E1} IVA {\u05DC\u05DC\u05D0 IVA} SST {\u05DC\u05DC\u05D0 SST} KDV {\u05DC\u05DC\u05D0 KDV} other {}}',taxInclusiveLabel:'{taxTerm, select, GST {\u05DB\u05D5\u05DC\u05DC GST} VAT {\u05DB\u05D5\u05DC\u05DC \u05DE\u05E2"\u05DE} TAX {\u05DB\u05D5\u05DC\u05DC \u05DE\u05E1} IVA {\u05DB\u05D5\u05DC\u05DC IVA} SST {\u05DB\u05D5\u05DC\u05DC SST} KDV {\u05DB\u05D5\u05DC\u05DC KDV} other {}}',alternativePriceAriaLabel:"\u05DC\u05D7\u05DC\u05D5\u05E4\u05D9\u05DF \u05D1-{alternativePrice}",strikethroughAriaLabel:"\u05D1\u05D0\u05D5\u05E4\u05DF \u05E7\u05D1\u05D5\u05E2 \u05D1-{strikethroughPrice}"}],":type":"sheet"}});(function(){let r={clientId:"",endpoint:"https://www.adobe.com/lana/ll",endpointStage:"https://www.stage.adobe.com/lana/ll",errorType:"e",sampleRate:1,tags:"",implicitSampleRate:1,useProd:!0,isProdDomain:!1},i=window;function n(){let{host:h}=window.location;return h.substring(h.length-10)===".adobe.com"&&h.substring(h.length-15)!==".corp.adobe.com"&&h.substring(h.length-16)!==".stage.adobe.com"}function a(h,d){h||(h={}),d||(d={});function u(m){return h[m]!==void 0?h[m]:d[m]!==void 0?d[m]:r[m]}return Object.keys(r).reduce((m,p)=>(m[p]=u(p),m),{})}function o(h,d){h=h&&h.stack?h.stack:h||"",h.length>2e3&&(h=`${h.slice(0,2e3)}<trunc>`);let u=a(d,i.lana.options);if(!u.clientId){console.warn("LANA ClientID is not set in options.");return}let p=parseInt(new URL(window.location).searchParams.get("lana-sample"),10)||(u.errorType==="i"?u.implicitSampleRate:u.sampleRate);if(!i.lana.debug&&!i.lana.localhost&&p<=Math.random()*100)return;let g=n()||u.isProdDomain,S=!g||!u.useProd?u.endpointStage:u.endpoint,w=[`m=${encodeURIComponent(h)}`,`c=${encodeURI(u.clientId)}`,`s=${p}`,`t=${encodeURI(u.errorType)}`];if(u.tags&&w.push(`tags=${encodeURI(u.tags)}`),(!g||i.lana.debug||i.lana.localhost)&&console.log("LANA Msg: ",h,`
Opts:`,u),!i.lana.localhost||i.lana.debug){let b=new XMLHttpRequest;return i.lana.debug&&(w.push("d"),b.addEventListener("load",()=>{console.log("LANA response:",b.responseText)})),b.open("GET",`${S}?${w.join("&")}`),b.send(),b}}function s(h){o(h.reason||h.error||h.message,{errorType:"i"})}function c(){return i.location.search.toLowerCase().indexOf("lanadebug")!==-1}function l(){return i.location.host.toLowerCase().indexOf("localhost")!==-1}i.lana={debug:!1,log:o,options:a(i.lana&&i.lana.options)},c()&&(i.lana.debug=!0),l()&&(i.lana.localhost=!0),i.addEventListener("error",s),i.addEventListener("unhandledrejection",s)})();var er=window,rr=er.ShadowRoot&&(er.ShadyCSS===void 0||er.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,qn=Symbol(),Wn=new WeakMap,tr=class{constructor(t,r,i){if(this._$cssResult$=!0,i!==qn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(rr&&t===void 0){let i=r!==void 0&&r.length===1;i&&(t=Wn.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Wn.set(r,t))}return t}toString(){return this.cssText}},Zn=e=>new tr(typeof e=="string"?e:e+"",void 0,qn);var Yr=(e,t)=>{rr?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let i=document.createElement("style"),n=er.litNonce;n!==void 0&&i.setAttribute("nonce",n),i.textContent=r.cssText,e.appendChild(i)})},ir=rr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let i of t.cssRules)r+=i.cssText;return Zn(r)})(e):e;var Xr,nr=window,Jn=nr.trustedTypes,Os=Jn?Jn.emptyScript:"",Qn=nr.reactiveElementPolyfillSupport,qr={toAttribute(e,t){switch(t){case Boolean:e=e?Os:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},ea=(e,t)=>t!==e&&(t==t||e==e),Wr={attribute:!0,type:String,converter:qr,reflect:!1,hasChanged:ea},Zr="finalized",Pe=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,i)=>{let n=this._$Ep(i,r);n!==void 0&&(this._$Ev.set(n,i),t.push(n))}),t}static createProperty(t,r=Wr){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let i=typeof t=="symbol"?Symbol():"__"+t,n=this.getPropertyDescriptor(t,i,r);n!==void 0&&Object.defineProperty(this.prototype,t,n)}}static getPropertyDescriptor(t,r,i){return{get(){return this[r]},set(n){let a=this[t];this[r]=n,this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||Wr}static finalize(){if(this.hasOwnProperty(Zr))return!1;this[Zr]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,i=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let n of i)this.createProperty(n,r[n])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let n of i)r.unshift(ir(n))}else t!==void 0&&r.push(ir(t));return r}static _$Ep(t,r){let i=r.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,i;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)===null||i===void 0||i.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return Yr(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var i;return(i=r.hostConnected)===null||i===void 0?void 0:i.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var i;return(i=r.hostDisconnected)===null||i===void 0?void 0:i.call(r)})}attributeChangedCallback(t,r,i){this._$AK(t,i)}_$EO(t,r,i=Wr){var n;let a=this.constructor._$Ep(t,i);if(a!==void 0&&i.reflect===!0){let o=(((n=i.converter)===null||n===void 0?void 0:n.toAttribute)!==void 0?i.converter:qr).toAttribute(r,i.type);this._$El=t,o==null?this.removeAttribute(a):this.setAttribute(a,o),this._$El=null}}_$AK(t,r){var i;let n=this.constructor,a=n._$Ev.get(t);if(a!==void 0&&this._$El!==a){let o=n.getPropertyOptions(a),s=typeof o.converter=="function"?{fromAttribute:o.converter}:((i=o.converter)===null||i===void 0?void 0:i.fromAttribute)!==void 0?o.converter:qr;this._$El=a,this[a]=s.fromAttribute(r,o.type),this._$El=null}}requestUpdate(t,r,i){let n=!0;t!==void 0&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||ea)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),i.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,i))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((n,a)=>this[a]=n),this._$Ei=void 0);let r=!1,i=this._$AL;try{r=this.shouldUpdate(i),r?(this.willUpdate(i),(t=this._$ES)===null||t===void 0||t.forEach(n=>{var a;return(a=n.hostUpdate)===null||a===void 0?void 0:a.call(n)}),this.update(i)):this._$Ek()}catch(n){throw r=!1,this._$Ek(),n}r&&this._$AE(i)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(i=>{var n;return(n=i.hostUpdated)===null||n===void 0?void 0:n.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,i)=>this._$EO(i,this[i],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};Pe[Zr]=!0,Pe.elementProperties=new Map,Pe.elementStyles=[],Pe.shadowRootOptions={mode:"open"},Qn?.({ReactiveElement:Pe}),((Xr=nr.reactiveElementVersions)!==null&&Xr!==void 0?Xr:nr.reactiveElementVersions=[]).push("1.6.3");var Jr,ar=window,Ze=ar.trustedTypes,ta=Ze?Ze.createPolicy("lit-html",{createHTML:e=>e}):void 0,ei="$lit$",be=`lit$${(Math.random()+"").slice(9)}$`,ca="?"+be,Rs=`<${ca}>`,Ne=document,or=()=>Ne.createComment(""),Lt=e=>e===null||typeof e!="object"&&typeof e!="function",la=Array.isArray,Vs=e=>la(e)||typeof e?.[Symbol.iterator]=="function",Qr=`[ 	
\f\r]`,yt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ra=/-->/g,ia=/>/g,Ce=RegExp(`>|${Qr}(?:([^\\s"'>=/]+)(${Qr}*=${Qr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),na=/'/g,aa=/"/g,ha=/^(?:script|style|textarea|title)$/i,da=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),Sh=da(1),Th=da(2),_t=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),oa=new WeakMap,Ie=Ne.createTreeWalker(Ne,129,null,!1);function ua(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return ta!==void 0?ta.createHTML(t):t}var Ms=(e,t)=>{let r=e.length-1,i=[],n,a=t===2?"<svg>":"",o=yt;for(let s=0;s<r;s++){let c=e[s],l,h,d=-1,u=0;for(;u<c.length&&(o.lastIndex=u,h=o.exec(c),h!==null);)u=o.lastIndex,o===yt?h[1]==="!--"?o=ra:h[1]!==void 0?o=ia:h[2]!==void 0?(ha.test(h[2])&&(n=RegExp("</"+h[2],"g")),o=Ce):h[3]!==void 0&&(o=Ce):o===Ce?h[0]===">"?(o=n??yt,d=-1):h[1]===void 0?d=-2:(d=o.lastIndex-h[2].length,l=h[1],o=h[3]===void 0?Ce:h[3]==='"'?aa:na):o===aa||o===na?o=Ce:o===ra||o===ia?o=yt:(o=Ce,n=void 0);let m=o===Ce&&e[s+1].startsWith("/>")?" ":"";a+=o===yt?c+Rs:d>=0?(i.push(l),c.slice(0,d)+ei+c.slice(d)+be+m):c+be+(d===-2?(i.push(void 0),s):m)}return[ua(e,a+(e[r]||"<?>")+(t===2?"</svg>":"")),i]},wt=class e{constructor({strings:t,_$litType$:r},i){let n;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,h]=Ms(t,r);if(this.el=e.createElement(l,i),Ie.currentNode=this.el.content,r===2){let d=this.el.content,u=d.firstChild;u.remove(),d.append(...u.childNodes)}for(;(n=Ie.nextNode())!==null&&c.length<s;){if(n.nodeType===1){if(n.hasAttributes()){let d=[];for(let u of n.getAttributeNames())if(u.endsWith(ei)||u.startsWith(be)){let m=h[o++];if(d.push(u),m!==void 0){let p=n.getAttribute(m.toLowerCase()+ei).split(be),g=/([.?@])?(.*)/.exec(m);c.push({type:1,index:a,name:g[2],strings:p,ctor:g[1]==="."?ri:g[1]==="?"?ii:g[1]==="@"?ni:Qe})}else c.push({type:6,index:a})}for(let u of d)n.removeAttribute(u)}if(ha.test(n.tagName)){let d=n.textContent.split(be),u=d.length-1;if(u>0){n.textContent=Ze?Ze.emptyScript:"";for(let m=0;m<u;m++)n.append(d[m],or()),Ie.nextNode(),c.push({type:2,index:++a});n.append(d[u],or())}}}else if(n.nodeType===8)if(n.data===ca)c.push({type:2,index:a});else{let d=-1;for(;(d=n.data.indexOf(be,d+1))!==-1;)c.push({type:7,index:a}),d+=be.length-1}a++}}static createElement(t,r){let i=Ne.createElement("template");return i.innerHTML=t,i}};function Je(e,t,r=e,i){var n,a,o,s;if(t===_t)return t;let c=i!==void 0?(n=r._$Co)===null||n===void 0?void 0:n[i]:r._$Cl,l=Lt(t)?void 0:t._$litDirective$;return c?.constructor!==l&&((a=c?._$AO)===null||a===void 0||a.call(c,!1),l===void 0?c=void 0:(c=new l(e),c._$AT(e,r,i)),i!==void 0?((o=(s=r)._$Co)!==null&&o!==void 0?o:s._$Co=[])[i]=c:r._$Cl=c),c!==void 0&&(t=Je(e,c._$AS(e,t.values),c,i)),t}var ti=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:i},parts:n}=this._$AD,a=((r=t?.creationScope)!==null&&r!==void 0?r:Ne).importNode(i,!0);Ie.currentNode=a;let o=Ie.nextNode(),s=0,c=0,l=n[0];for(;l!==void 0;){if(s===l.index){let h;l.type===2?h=new sr(o,o.nextSibling,this,t):l.type===1?h=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(h=new ai(o,this,t)),this._$AV.push(h),l=n[++c]}s!==l?.index&&(o=Ie.nextNode(),s++)}return Ie.currentNode=Ne,a}v(t){let r=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,r),r+=i.strings.length-2):i._$AI(t[r])),r++}},sr=class e{constructor(t,r,i,n){var a;this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=i,this.options=n,this._$Cp=(a=n?.isConnected)===null||a===void 0||a}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=Je(this,t,r),Lt(t)?t===B||t==null||t===""?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==_t&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):Vs(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==B&&Lt(this._$AH)?this._$AA.nextSibling.data=t:this.$(Ne.createTextNode(t)),this._$AH=t}g(t){var r;let{values:i,_$litType$:n}=t,a=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=wt.createElement(ua(n.h,n.h[0]),this.options)),n);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===a)this._$AH.v(i);else{let o=new ti(a,this),s=o.u(this.options);o.v(i),this.$(s),this._$AH=o}}_$AC(t){let r=oa.get(t.strings);return r===void 0&&oa.set(t.strings,r=new wt(t)),r}T(t){la(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,i,n=0;for(let a of t)n===r.length?r.push(i=new e(this.k(or()),this.k(or()),this,this.options)):i=r[n],i._$AI(a),n++;n<r.length&&(this._$AR(i&&i._$AB.nextSibling,n),r.length=n)}_$AR(t=this._$AA.nextSibling,r){var i;for((i=this._$AP)===null||i===void 0||i.call(this,!1,!0,r);t&&t!==this._$AB;){let n=t.nextSibling;t.remove(),t=n}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},Qe=class{constructor(t,r,i,n,a){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=r,this._$AM=n,this.options=a,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,i,n){let a=this.strings,o=!1;if(a===void 0)t=Je(this,t,r,0),o=!Lt(t)||t!==this._$AH&&t!==_t,o&&(this._$AH=t);else{let s=t,c,l;for(t=a[0],c=0;c<a.length-1;c++)l=Je(this,s[i+c],r,c),l===_t&&(l=this._$AH[c]),o||(o=!Lt(l)||l!==this._$AH[c]),l===B?t=B:t!==B&&(t+=(l??"")+a[c+1]),this._$AH[c]=l}o&&!n&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},ri=class extends Qe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}},$s=Ze?Ze.emptyScript:"",ii=class extends Qe{constructor(){super(...arguments),this.type=4}j(t){t&&t!==B?this.element.setAttribute(this.name,$s):this.element.removeAttribute(this.name)}},ni=class extends Qe{constructor(t,r,i,n,a){super(t,r,i,n,a),this.type=5}_$AI(t,r=this){var i;if((t=(i=Je(this,t,r,0))!==null&&i!==void 0?i:B)===_t)return;let n=this._$AH,a=t===B&&n!==B||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==B&&(n===B||a);a&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,i;typeof this._$AH=="function"?this._$AH.call((i=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&i!==void 0?i:this.element,t):this._$AH.handleEvent(t)}},ai=class{constructor(t,r,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Je(this,t)}};var sa=ar.litHtmlPolyfillSupport;sa?.(wt,sr),((Jr=ar.litHtmlVersions)!==null&&Jr!==void 0?Jr:ar.litHtmlVersions=[]).push("2.8.0");var cr=window,lr=cr.ShadowRoot&&(cr.ShadyCSS===void 0||cr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,oi=Symbol(),ma=new WeakMap,Pt=class{constructor(t,r,i){if(this._$cssResult$=!0,i!==oi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(lr&&t===void 0){let i=r!==void 0&&r.length===1;i&&(t=ma.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&ma.set(r,t))}return t}toString(){return this.cssText}},ve=e=>new Pt(typeof e=="string"?e:e+"",void 0,oi),C=(e,...t)=>{let r=e.length===1?e[0]:t.reduce((i,n,a)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+e[a+1],e[0]);return new Pt(r,e,oi)},si=(e,t)=>{lr?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let i=document.createElement("style"),n=cr.litNonce;n!==void 0&&i.setAttribute("nonce",n),i.textContent=r.cssText,e.appendChild(i)})},hr=lr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let i of t.cssRules)r+=i.cssText;return ve(r)})(e):e;var ci,dr=window,pa=dr.trustedTypes,Hs=pa?pa.emptyScript:"",fa=dr.reactiveElementPolyfillSupport,hi={toAttribute(e,t){switch(t){case Boolean:e=e?Hs:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},ga=(e,t)=>t!==e&&(t==t||e==e),li={attribute:!0,type:String,converter:hi,reflect:!1,hasChanged:ga},di="finalized",ce=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,i)=>{let n=this._$Ep(i,r);n!==void 0&&(this._$Ev.set(n,i),t.push(n))}),t}static createProperty(t,r=li){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let i=typeof t=="symbol"?Symbol():"__"+t,n=this.getPropertyDescriptor(t,i,r);n!==void 0&&Object.defineProperty(this.prototype,t,n)}}static getPropertyDescriptor(t,r,i){return{get(){return this[r]},set(n){let a=this[t];this[r]=n,this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||li}static finalize(){if(this.hasOwnProperty(di))return!1;this[di]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,i=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let n of i)this.createProperty(n,r[n])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let n of i)r.unshift(hr(n))}else t!==void 0&&r.push(hr(t));return r}static _$Ep(t,r){let i=r.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,i;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)===null||i===void 0||i.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return si(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var i;return(i=r.hostConnected)===null||i===void 0?void 0:i.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var i;return(i=r.hostDisconnected)===null||i===void 0?void 0:i.call(r)})}attributeChangedCallback(t,r,i){this._$AK(t,i)}_$EO(t,r,i=li){var n;let a=this.constructor._$Ep(t,i);if(a!==void 0&&i.reflect===!0){let o=(((n=i.converter)===null||n===void 0?void 0:n.toAttribute)!==void 0?i.converter:hi).toAttribute(r,i.type);this._$El=t,o==null?this.removeAttribute(a):this.setAttribute(a,o),this._$El=null}}_$AK(t,r){var i;let n=this.constructor,a=n._$Ev.get(t);if(a!==void 0&&this._$El!==a){let o=n.getPropertyOptions(a),s=typeof o.converter=="function"?{fromAttribute:o.converter}:((i=o.converter)===null||i===void 0?void 0:i.fromAttribute)!==void 0?o.converter:hi;this._$El=a,this[a]=s.fromAttribute(r,o.type),this._$El=null}}requestUpdate(t,r,i){let n=!0;t!==void 0&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||ga)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),i.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,i))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((n,a)=>this[a]=n),this._$Ei=void 0);let r=!1,i=this._$AL;try{r=this.shouldUpdate(i),r?(this.willUpdate(i),(t=this._$ES)===null||t===void 0||t.forEach(n=>{var a;return(a=n.hostUpdate)===null||a===void 0?void 0:a.call(n)}),this.update(i)):this._$Ek()}catch(n){throw r=!1,this._$Ek(),n}r&&this._$AE(i)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(i=>{var n;return(n=i.hostUpdated)===null||n===void 0?void 0:n.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,i)=>this._$EO(i,this[i],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};ce[di]=!0,ce.elementProperties=new Map,ce.elementStyles=[],ce.shadowRootOptions={mode:"open"},fa?.({ReactiveElement:ce}),((ci=dr.reactiveElementVersions)!==null&&ci!==void 0?ci:dr.reactiveElementVersions=[]).push("1.6.3");var ui,ur=window,et=ur.trustedTypes,xa=et?et.createPolicy("lit-html",{createHTML:e=>e}):void 0,pi="$lit$",Ae=`lit$${(Math.random()+"").slice(9)}$`,ya="?"+Ae,Us=`<${ya}>`,Re=document,It=()=>Re.createComment(""),Nt=e=>e===null||typeof e!="object"&&typeof e!="function",La=Array.isArray,Ds=e=>La(e)||typeof e?.[Symbol.iterator]=="function",mi=`[ 	
\f\r]`,Ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ba=/-->/g,va=/>/g,ke=RegExp(`>|${mi}(?:([^\\s"'>=/]+)(${mi}*=${mi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Aa=/'/g,Ea=/"/g,_a=/^(?:script|style|textarea|title)$/i,wa=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),x=wa(1),Ch=wa(2),Ve=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),Sa=new WeakMap,Oe=Re.createTreeWalker(Re,129,null,!1);function Pa(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return xa!==void 0?xa.createHTML(t):t}var Bs=(e,t)=>{let r=e.length-1,i=[],n,a=t===2?"<svg>":"",o=Ct;for(let s=0;s<r;s++){let c=e[s],l,h,d=-1,u=0;for(;u<c.length&&(o.lastIndex=u,h=o.exec(c),h!==null);)u=o.lastIndex,o===Ct?h[1]==="!--"?o=ba:h[1]!==void 0?o=va:h[2]!==void 0?(_a.test(h[2])&&(n=RegExp("</"+h[2],"g")),o=ke):h[3]!==void 0&&(o=ke):o===ke?h[0]===">"?(o=n??Ct,d=-1):h[1]===void 0?d=-2:(d=o.lastIndex-h[2].length,l=h[1],o=h[3]===void 0?ke:h[3]==='"'?Ea:Aa):o===Ea||o===Aa?o=ke:o===ba||o===va?o=Ct:(o=ke,n=void 0);let m=o===ke&&e[s+1].startsWith("/>")?" ":"";a+=o===Ct?c+Us:d>=0?(i.push(l),c.slice(0,d)+pi+c.slice(d)+Ae+m):c+Ae+(d===-2?(i.push(void 0),s):m)}return[Pa(e,a+(e[r]||"<?>")+(t===2?"</svg>":"")),i]},kt=class e{constructor({strings:t,_$litType$:r},i){let n;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,h]=Bs(t,r);if(this.el=e.createElement(l,i),Oe.currentNode=this.el.content,r===2){let d=this.el.content,u=d.firstChild;u.remove(),d.append(...u.childNodes)}for(;(n=Oe.nextNode())!==null&&c.length<s;){if(n.nodeType===1){if(n.hasAttributes()){let d=[];for(let u of n.getAttributeNames())if(u.endsWith(pi)||u.startsWith(Ae)){let m=h[o++];if(d.push(u),m!==void 0){let p=n.getAttribute(m.toLowerCase()+pi).split(Ae),g=/([.?@])?(.*)/.exec(m);c.push({type:1,index:a,name:g[2],strings:p,ctor:g[1]==="."?gi:g[1]==="?"?xi:g[1]==="@"?bi:rt})}else c.push({type:6,index:a})}for(let u of d)n.removeAttribute(u)}if(_a.test(n.tagName)){let d=n.textContent.split(Ae),u=d.length-1;if(u>0){n.textContent=et?et.emptyScript:"";for(let m=0;m<u;m++)n.append(d[m],It()),Oe.nextNode(),c.push({type:2,index:++a});n.append(d[u],It())}}}else if(n.nodeType===8)if(n.data===ya)c.push({type:2,index:a});else{let d=-1;for(;(d=n.data.indexOf(Ae,d+1))!==-1;)c.push({type:7,index:a}),d+=Ae.length-1}a++}}static createElement(t,r){let i=Re.createElement("template");return i.innerHTML=t,i}};function tt(e,t,r=e,i){var n,a,o,s;if(t===Ve)return t;let c=i!==void 0?(n=r._$Co)===null||n===void 0?void 0:n[i]:r._$Cl,l=Nt(t)?void 0:t._$litDirective$;return c?.constructor!==l&&((a=c?._$AO)===null||a===void 0||a.call(c,!1),l===void 0?c=void 0:(c=new l(e),c._$AT(e,r,i)),i!==void 0?((o=(s=r)._$Co)!==null&&o!==void 0?o:s._$Co=[])[i]=c:r._$Cl=c),c!==void 0&&(t=tt(e,c._$AS(e,t.values),c,i)),t}var fi=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:i},parts:n}=this._$AD,a=((r=t?.creationScope)!==null&&r!==void 0?r:Re).importNode(i,!0);Oe.currentNode=a;let o=Oe.nextNode(),s=0,c=0,l=n[0];for(;l!==void 0;){if(s===l.index){let h;l.type===2?h=new Ot(o,o.nextSibling,this,t):l.type===1?h=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(h=new vi(o,this,t)),this._$AV.push(h),l=n[++c]}s!==l?.index&&(o=Oe.nextNode(),s++)}return Oe.currentNode=Re,a}v(t){let r=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,r),r+=i.strings.length-2):i._$AI(t[r])),r++}},Ot=class e{constructor(t,r,i,n){var a;this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=i,this.options=n,this._$Cp=(a=n?.isConnected)===null||a===void 0||a}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=tt(this,t,r),Nt(t)?t===G||t==null||t===""?(this._$AH!==G&&this._$AR(),this._$AH=G):t!==this._$AH&&t!==Ve&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):Ds(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==G&&Nt(this._$AH)?this._$AA.nextSibling.data=t:this.$(Re.createTextNode(t)),this._$AH=t}g(t){var r;let{values:i,_$litType$:n}=t,a=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=kt.createElement(Pa(n.h,n.h[0]),this.options)),n);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===a)this._$AH.v(i);else{let o=new fi(a,this),s=o.u(this.options);o.v(i),this.$(s),this._$AH=o}}_$AC(t){let r=Sa.get(t.strings);return r===void 0&&Sa.set(t.strings,r=new kt(t)),r}T(t){La(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,i,n=0;for(let a of t)n===r.length?r.push(i=new e(this.k(It()),this.k(It()),this,this.options)):i=r[n],i._$AI(a),n++;n<r.length&&(this._$AR(i&&i._$AB.nextSibling,n),r.length=n)}_$AR(t=this._$AA.nextSibling,r){var i;for((i=this._$AP)===null||i===void 0||i.call(this,!1,!0,r);t&&t!==this._$AB;){let n=t.nextSibling;t.remove(),t=n}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},rt=class{constructor(t,r,i,n,a){this.type=1,this._$AH=G,this._$AN=void 0,this.element=t,this.name=r,this._$AM=n,this.options=a,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=G}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,i,n){let a=this.strings,o=!1;if(a===void 0)t=tt(this,t,r,0),o=!Nt(t)||t!==this._$AH&&t!==Ve,o&&(this._$AH=t);else{let s=t,c,l;for(t=a[0],c=0;c<a.length-1;c++)l=tt(this,s[i+c],r,c),l===Ve&&(l=this._$AH[c]),o||(o=!Nt(l)||l!==this._$AH[c]),l===G?t=G:t!==G&&(t+=(l??"")+a[c+1]),this._$AH[c]=l}o&&!n&&this.j(t)}j(t){t===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},gi=class extends rt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===G?void 0:t}},Gs=et?et.emptyScript:"",xi=class extends rt{constructor(){super(...arguments),this.type=4}j(t){t&&t!==G?this.element.setAttribute(this.name,Gs):this.element.removeAttribute(this.name)}},bi=class extends rt{constructor(t,r,i,n,a){super(t,r,i,n,a),this.type=5}_$AI(t,r=this){var i;if((t=(i=tt(this,t,r,0))!==null&&i!==void 0?i:G)===Ve)return;let n=this._$AH,a=t===G&&n!==G||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==G&&(n===G||a);a&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,i;typeof this._$AH=="function"?this._$AH.call((i=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&i!==void 0?i:this.element,t):this._$AH.handleEvent(t)}},vi=class{constructor(t,r,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}};var Ta=ur.litHtmlPolyfillSupport;Ta?.(kt,Ot),((ui=ur.litHtmlVersions)!==null&&ui!==void 0?ui:ur.litHtmlVersions=[]).push("2.8.0");var Ca=(e,t,r)=>{var i,n;let a=(i=r?.renderBefore)!==null&&i!==void 0?i:t,o=a._$litPart$;if(o===void 0){let s=(n=r?.renderBefore)!==null&&n!==void 0?n:null;a._$litPart$=o=new Ot(t.insertBefore(It(),s),s,void 0,r??{})}return o._$AI(e),o};var Ai,Ei;var ee=class extends ce{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,r;let i=super.createRenderRoot();return(t=(r=this.renderOptions).renderBefore)!==null&&t!==void 0||(r.renderBefore=i.firstChild),i}update(t){let r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ca(r,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return Ve}};ee.finalized=!0,ee._$litElement$=!0,(Ai=globalThis.litElementHydrateSupport)===null||Ai===void 0||Ai.call(globalThis,{LitElement:ee});var Ia=globalThis.litElementPolyfillSupport;Ia?.({LitElement:ee});((Ei=globalThis.litElementVersions)!==null&&Ei!==void 0?Ei:globalThis.litElementVersions=[]).push("3.3.3");var Ee="(max-width: 767px)",mr="(max-width: 1199px)",$="(min-width: 768px)",M="(min-width: 1200px)",K="(min-width: 1600px)";var Na=C`
    :host {
        --merch-card-border: 1px solid var(--merch-card-border-color);
        background-color: var(--merch-card-background-color);
        border-radius: var(--consonant-merch-spacing-xs);
        border: var(--merch-card-border);
        box-sizing: border-box;
        color: var(--merch-card-color);
        display: flex;
        flex-direction: column;
        font-family: var(--merch-body-font-family, 'Adobe Clean');
        grid-template-columns: repeat(auto-fit, minmax(300px, max-content));
        position: relative;
        text-align: start;
    }

    :host(.placeholder) {
        visibility: hidden;
    }

    :host([aria-selected]) {
        outline: none;
        box-sizing: border-box;
        box-shadow: inset 0 0 0 2px var(--merch-color-accent);
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
        background-color: var(--merch-color-gray-200);
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
        font-size: var(--merch-card-body-font-size);
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
        font-size: var(--merch-card-body-xxs-font-size);
        line-height: 1.3;
        color: var(--merch-color-gray-600);
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
        background: var(--checkmark-icon) no-repeat var(--merch-color-accent);
        border-color: var(--merch-color-accent);
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
        background-color: var(--merch-color-accent);
        background-image: var(--checkmark-icon);
        border-color: var(--merch-color-accent);
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
`,ka=()=>[C`
        /* Tablet */
        @media screen and ${ve($)} {
            :host([size='wide']),
            :host([size='super-wide']) {
                width: 100%;
                grid-column: 1 / -1;
            }
        }

        /* Laptop */
        @media screen and ${ve(M)} {
            :host([size='wide']) {
                grid-column: span 2;
            }
        `];var it,Rt=class Rt{constructor(t){f(this,"card");D(this,it);this.card=t,this.insertVariantStyle()}getContainer(){return F(this,it,L(this,it)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),L(this,it)}insertVariantStyle(){if(!Rt.styleMap[this.card.variant]){Rt.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let i=`--merch-card-${this.card.variant}-${r}-height`,n=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),a=parseInt(this.getContainer().style.getPropertyValue(i))||0;n>a&&this.getContainer().style.setProperty(i,`${n}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),x`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return x` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get stripStyle(){if(this.card.backgroundImage){let t=new Image;return t.src=this.card.backgroundImage,t.onload=()=>{t.width>8?this.card.classList.add("wide-strip"):t.width===8&&this.card.classList.add("thin-strip")},`
          background: url("${this.card.backgroundImage}");
          background-size: auto 100%;
          background-repeat: no-repeat;
          background-position: ${this.card.dir==="ltr"?"left":"right"};
        `}return""}get secureLabelFooter(){let t=this.card.secureLabel?x`<span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              >`:"";return x`<footer>${t}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){}};it=new WeakMap,f(Rt,"styleMap",{});var I=Rt;function le(e,t={},r=""){let i=document.createElement(e);r instanceof HTMLElement?i.appendChild(r):i.innerHTML=r;for(let[n,a]of Object.entries(t))i.setAttribute(n,a);return i}function pr(){return window.matchMedia("(max-width: 767px)").matches}function Oa(){return window.matchMedia("(max-width: 1024px)").matches}var Ui={};Is(Ui,{CLASS_NAME_FAILED:()=>wi,CLASS_NAME_HIDDEN:()=>Fs,CLASS_NAME_PENDING:()=>Pi,CLASS_NAME_RESOLVED:()=>Ci,ERROR_MESSAGE_BAD_REQUEST:()=>xr,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>Qs,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>Ii,EVENT_AEM_ERROR:()=>$e,EVENT_AEM_LOAD:()=>Me,EVENT_MAS_ERROR:()=>_i,EVENT_MAS_READY:()=>Li,EVENT_MERCH_CARD_ACTION_MENU_TOGGLE:()=>yi,EVENT_MERCH_CARD_COLLECTION_SHOWMORE:()=>Zs,EVENT_MERCH_CARD_COLLECTION_SORT:()=>qs,EVENT_MERCH_CARD_READY:()=>Ti,EVENT_MERCH_OFFER_READY:()=>js,EVENT_MERCH_OFFER_SELECT_READY:()=>Si,EVENT_MERCH_QUANTITY_SELECTOR_CHANGE:()=>gr,EVENT_MERCH_SEARCH_CHANGE:()=>Ws,EVENT_MERCH_SIDENAV_SELECT:()=>Js,EVENT_MERCH_STOCK_CHANGE:()=>Xs,EVENT_MERCH_STORAGE_CHANGE:()=>fr,EVENT_OFFER_SELECTED:()=>Ys,EVENT_TYPE_FAILED:()=>Ni,EVENT_TYPE_PENDING:()=>ki,EVENT_TYPE_READY:()=>nt,EVENT_TYPE_RESOLVED:()=>Oi,LOG_NAMESPACE:()=>Ri,Landscape:()=>He,NAMESPACE:()=>zs,PARAM_AOS_API_KEY:()=>ec,PARAM_ENV:()=>Vi,PARAM_LANDSCAPE:()=>Mi,PARAM_WCS_API_KEY:()=>tc,STATE_FAILED:()=>he,STATE_PENDING:()=>de,STATE_RESOLVED:()=>ue,TAG_NAME_SERVICE:()=>Ks,WCS_PROD_URL:()=>$i,WCS_STAGE_URL:()=>Hi});var zs="merch",Fs="hidden",nt="wcms:commerce:ready",Ks="mas-commerce-service",js="merch-offer:ready",Si="merch-offer-select:ready",Ti="merch-card:ready",yi="merch-card:action-menu-toggle",Ys="merch-offer:selected",Xs="merch-stock:change",fr="merch-storage:change",gr="merch-quantity-selector:change",Ws="merch-search:change",qs="merch-card-collection:sort",Zs="merch-card-collection:showmore",Js="merch-sidenav:select",Me="aem:load",$e="aem:error",Li="mas:ready",_i="mas:error",wi="placeholder-failed",Pi="placeholder-pending",Ci="placeholder-resolved",xr="Bad WCS request",Ii="Commerce offer not found",Qs="Literals URL not provided",Ni="mas:failed",ki="mas:pending",Oi="mas:resolved",Ri="mas/commerce",Vi="commerce.env",Mi="commerce.landscape",ec="commerce.aosKey",tc="commerce.wcsKey",$i="https://www.adobe.com/web_commerce_artifact",Hi="https://www.stage.adobe.com/web_commerce_artifact_stage",he="failed",de="pending",ue="resolved",He={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"};var Ra=`
:root {
  --merch-card-catalog-width: 276px;
  --merch-card-catalog-icon-size: 40px;
}
.one-merch-card.catalog,
.two-merch-cards.catalog,
.three-merch-cards.catalog,
.four-merch-cards.catalog {
    grid-template-columns: var(--merch-card-catalog-width);
}

@media screen and ${$} {
    :root {
      --merch-card-catalog-width: 302px;
    }

    .two-merch-cards.catalog,
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(2, var(--merch-card-catalog-width));
    }
}

@media screen and ${M} {
    :root {
      --merch-card-catalog-width: 276px;
    }

    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--merch-card-catalog-width));
    }
}

@media screen and ${K} {
    .four-merch-cards.catalog {
        grid-template-columns: repeat(4, var(--merch-card-catalog-width));
    }
}

merch-card[variant="catalog"] [slot="action-menu-content"] {
  background-color: #000;
  color: var(--color-white, #fff);
  font-size: var(--merch-card-body-xs-font-size);
  width: fit-content;
  padding: var(--consonant-merch-spacing-xs);
  border-radius: var(--consonant-merch-spacing-xxxs);
  position: absolute;
  top: 55px;
  right: 15px;
  line-height: var(--merch-card-body-line-height);
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
  line-height: var(--merch-card-body-line-height);
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
  font-size: var(--merch-card-body-font-size);
  font-style: italic;
  font-weight: 400;
  line-height: var(--merch-card-body-line-height);
}`;var rc={title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"m"},allowedSizes:["wide","super-wide"]},at=class extends I{constructor(r){super(r);f(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(yi,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});f(this,"toggleActionMenu",r=>{let i=this.card.shadowRoot.querySelector('slot[name="action-menu-content"]');!i||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter"||(r.preventDefault(),i.classList.toggle("hidden"),i.classList.contains("hidden")||this.dispatchActionMenuToggle())});f(this,"toggleActionMenuFromCard",r=>{let i=r?.type==="mouseleave"?!0:void 0,n=this.card.shadowRoot,a=n.querySelector(".action-menu");this.card.blur(),a?.classList.remove("always-visible");let o=n.querySelector('slot[name="action-menu-content"]');o&&(i||this.dispatchActionMenuToggle(),o.classList.toggle("hidden",i))});f(this,"hideActionMenu",r=>{this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')?.classList.add("hidden")});f(this,"focusEventHandler",r=>{let i=this.card.shadowRoot.querySelector(".action-menu");i&&(i.classList.add("always-visible"),(r.relatedTarget?.nodeName==="MERCH-CARD-COLLECTION"||r.relatedTarget?.nodeName==="MERCH-CARD"&&r.target.nodeName!=="MERCH-ICON")&&i.classList.remove("always-visible"))})}get aemFragmentMapping(){return rc}renderLayout(){return x` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${Oa()&&this.card.actionMenu?"always-visible":""}
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
                ${this.promoBottom?"":x`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?x`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return Ra}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.addEventListener("focusout",this.focusEventHandler)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.removeEventListener("focusout",this.focusEventHandler)}};f(at,"variantStyle",C`
        :host([variant='catalog']) {
            min-height: 330px;
            width: var(--merch-card-catalog-width);
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
    `);var Va=`
:root {
  --merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--merch-card-image-width);
}

@media screen and ${$} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--merch-card-image-width));
  }
}

@media screen and ${M} {
  :root {
    --merch-card-image-width: 378px;
  }
    
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(3, var(--merch-card-image-width));
  }
}

@media screen and ${K} {
  .four-merch-cards.image {
      grid-template-columns: repeat(4, var(--merch-card-image-width));
  }
}
`;var br=class extends I{constructor(t){super(t)}getGlobalCSS(){return Va}renderLayout(){return x`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?x`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:x`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?x`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:x`
              <hr />
              ${this.secureLabelFooter}
          `}`}};var Ma=`
:root {
  --merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--merch-card-inline-heading-width);
}

@media screen and ${$} {
  .two-merch-cards.inline-heading,
  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(2, var(--merch-card-inline-heading-width));
  }
}

@media screen and ${M} {
  :root {
    --merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--merch-card-inline-heading-width));
  }
}

@media screen and ${K} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--merch-card-inline-heading-width));
  }
}
`;var vr=class extends I{constructor(t){super(t)}getGlobalCSS(){return Ma}renderLayout(){return x` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":x`<hr />`} ${this.secureLabelFooter}`}};var $a=`
  :root {
    --merch-card-mini-compare-chart-icon-size: 32px;
    --merch-card-mini-compare-mobile-cta-font-size: 15px;
    --merch-card-mini-compare-mobile-cta-width: 75px;
    --merch-card-mini-compare-badge-mobile-max-width: 50px;
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
    font-size: var(--merch-card-body-xs-font-size);
    padding: 0 var(--consonant-merch-spacing-s);
  }

  merch-card[variant="mini-compare-chart"] [slot="price-commitment"] a {
    display: inline-block;
    height: 27px;
  }

  merch-card[variant="mini-compare-chart"] [slot="offers"] {
    font-size: var(--merch-card-body-xs-font-size);
  }

  merch-card[variant="mini-compare-chart"] [slot="body-xxs"] {
    font-size: var(--merch-card-body-xs-font-size);
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0;    
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--merch-card-body-m-font-size);
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
    width: var(--merch-card-mini-compare-chart-icon-size);
    height: var(--merch-card-mini-compare-chart-icon-size);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell {
    border-top: 1px solid var(--merch-card-border-color);
    display: flex;
    gap: var(--consonant-merch-spacing-xs);
    justify-content: start;
    place-items: center;
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s);
    margin-block: 0px;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--merch-card-body-s-font-size);
    line-height: var(--merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description p {
    color: var(--merch-color-gray-80);
    vertical-align: bottom;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description a {
    text-decoration: solid;
  }
  
.one-merch-card.mini-compare-chart {
  grid-template-columns: var(--merch-card-mini-compare-chart-wide-width);
  gap: var(--consonant-merch-spacing-xs);
}

.two-merch-cards.mini-compare-chart,
.three-merch-cards.mini-compare-chart,
.four-merch-cards.mini-compare-chart {
  grid-template-columns: repeat(2, var(--merch-card-mini-compare-chart-width));
  gap: var(--consonant-merch-spacing-xs);
}

/* mini compare mobile */ 
@media screen and ${Ee} {
  :root {
    --merch-card-mini-compare-chart-width: 302px;
    --merch-card-mini-compare-chart-wide-width: 302px;
  }

  .two-merch-cards.mini-compare-chart,
  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
    grid-template-columns: var(--merch-card-mini-compare-chart-width);
    gap: var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m'] {
    font-size: var(--merch-card-body-s-font-size);
    line-height: var(--merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m-price'] {
    font-size: var(--merch-card-body-s-font-size);
    line-height: var(--merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='body-m'] {
    font-size: var(--merch-card-body-xs-font-size);
    line-height: var(--merch-card-body-xs-line-height);
  }
  
  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--merch-card-body-xs-font-size);
    line-height: var(--merch-card-body-xs-line-height);
  }
  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--merch-card-body-xs-font-size);
    line-height: var(--merch-card-body-xs-line-height);
  }
}

@media screen and ${mr} {
  .three-merch-cards.mini-compare-chart merch-card [slot="footer"] a,
  .four-merch-cards.mini-compare-chart merch-card [slot="footer"] a {
    flex: 1;
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m'] {
    font-size: var(--merch-card-body-s-font-size);
    line-height: var(--merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m-price'] {
    font-size: var(--merch-card-body-s-font-size);
    line-height: var(--merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='body-m'] {
    font-size: var(--merch-card-body-xs-font-size);
    line-height: var(--merch-card-body-xs-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--merch-card-body-xs-font-size);
    line-height: var(--merch-card-body-xs-line-height);
  }
  
  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--merch-card-body-xs-font-size);
    line-height: var(--merch-card-body-xs-line-height);
  }
}
@media screen and ${$} {
  :root {
    --merch-card-mini-compare-chart-width: 302px;
    --merch-card-mini-compare-chart-wide-width: 302px;
  }

  .two-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(2, minmax(var(--merch-card-mini-compare-chart-width), var(--merch-card-mini-compare-chart-wide-width)));
    gap: var(--consonant-merch-spacing-m);
  }

  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
      grid-template-columns: repeat(2, minmax(var(--merch-card-mini-compare-chart-width), var(--merch-card-mini-compare-chart-wide-width)));
  }
}

/* desktop */
@media screen and ${M} {
  :root {
    --merch-card-mini-compare-chart-width: 378px;
    --merch-card-mini-compare-chart-wide-width: 484px;  
  }
  .one-merch-card.mini-compare-chart {
    grid-template-columns: var(--merch-card-mini-compare-chart-wide-width);
  }

  .two-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(2, var(--merch-card-mini-compare-chart-wide-width));
    gap: var(--consonant-merch-spacing-m);
  }

  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(3, var(--merch-card-mini-compare-chart-width));
    gap: var(--consonant-merch-spacing-m);
  }
}

@media screen and ${K} {
  .four-merch-cards.mini-compare-chart {
      grid-template-columns: repeat(4, var(--merch-card-mini-compare-chart-width));
  }
}

merch-card .footer-row-cell:nth-child(1) {
  min-height: var(--merch-card-footer-row-1-min-height);
}

merch-card .footer-row-cell:nth-child(2) {
  min-height: var(--merch-card-footer-row-2-min-height);
}

merch-card .footer-row-cell:nth-child(3) {
  min-height: var(--merch-card-footer-row-3-min-height);
}

merch-card .footer-row-cell:nth-child(4) {
  min-height: var(--merch-card-footer-row-4-min-height);
}

merch-card .footer-row-cell:nth-child(5) {
  min-height: var(--merch-card-footer-row-5-min-height);
}

merch-card .footer-row-cell:nth-child(6) {
  min-height: var(--merch-card-footer-row-6-min-height);
}

merch-card .footer-row-cell:nth-child(7) {
  min-height: var(--merch-card-footer-row-7-min-height);
}

merch-card .footer-row-cell:nth-child(8) {
  min-height: var(--merch-card-footer-row-8-min-height);
}
`;var ic=32,ot=class extends I{constructor(r){super(r);f(this,"getRowMinHeightPropertyName",r=>`--merch-card-footer-row-${r}-min-height`);f(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?x`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:x`<slot name="secure-transaction-label"></slot>`;return x`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return $a}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section"),["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content"].forEach(n=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${n}"]`),n)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let i=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");i&&i.textContent!==""&&this.getContainer().style.setProperty("--merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;[...this.card.querySelector('[slot="footer-rows"]')?.children].forEach((i,n)=>{let a=Math.max(ic,parseFloat(window.getComputedStyle(i).height)||0),o=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(n+1)))||0;a>o&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(n+1),`${a}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(i=>{let n=i.querySelector(".footer-row-cell-description");n&&!n.textContent.trim()&&i.remove()})}renderLayout(){return x` <div class="top-section${this.badge?" badge":""}">
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
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){pr()?this.removeEmptyRows():(await Promise.all(this.card.prices.map(r=>r.onceSettled())),this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};f(ot,"variantStyle",C`
    :host([variant='mini-compare-chart']) > slot:not([name='icons']) {
        display: block;
    }
    :host([variant='mini-compare-chart']) footer {
        min-height: var(--merch-card-mini-compare-chart-footer-height);
        padding: var(--consonant-merch-spacing-xs);
    }

    /* mini-compare card  */
    :host([variant='mini-compare-chart']) .top-section {
        padding-top: var(--consonant-merch-spacing-s);
        padding-inline-start: var(--consonant-merch-spacing-s);
        height: var(--merch-card-mini-compare-chart-top-section-height);
    }

    @media screen and ${ve(mr)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${ve(M)} {
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
        min-height: var(--merch-card-mini-compare-chart-heading-m-height);
    }
    :host([variant='mini-compare-chart']) slot[name='body-m'] {
        min-height: var(--merch-card-mini-compare-chart-body-m-height);
    }
    :host([variant='mini-compare-chart']) slot[name='heading-m-price'] {
        min-height: var(
            --merch-card-mini-compare-chart-heading-m-price-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='body-xxs'] {
        min-height: var(
            --merch-card-mini-compare-chart-body-xxs-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='price-commitment'] {
        min-height: var(
            --merch-card-mini-compare-chart-price-commitment-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='offers'] {
        min-height: var(--merch-card-mini-compare-chart-offers-height);
    }
    :host([variant='mini-compare-chart']) slot[name='promo-text'] {
        min-height: var(--merch-card-mini-compare-chart-promo-text-height);
    }
    :host([variant='mini-compare-chart']) slot[name='callout-content'] {
        min-height: var(
            --merch-card-mini-compare-chart-callout-content-height
        );
    }
  `);var Ha=`
:root {
  --merch-card-plans-width: 300px;
  --merch-card-plans-icon-size: 40px;
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
    grid-template-columns: var(--merch-card-plans-width);
}

/* Tablet */
@media screen and ${$} {
  :root {
    --merch-card-plans-width: 302px;
  }
  .two-merch-cards.plans,
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(2, var(--merch-card-plans-width));
  }
}

/* desktop */
@media screen and ${M} {
  :root {
    --merch-card-plans-width: 276px;
  }
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(3, var(--merch-card-plans-width));
  }
}

/* Large desktop */
    @media screen and ${K} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--merch-card-plans-width));
    }
}
`;var st=class extends I{constructor(t){super(t)}getGlobalCSS(){return Ha}postCardUpdateHook(){this.adjustTitleWidth()}get stockCheckbox(){return this.card.checkboxLabel?x`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:""}renderLayout(){return x` ${this.badge}
        <div class="body">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            <slot name="body-xxs"></slot>
            ${this.promoBottom?"":x`<slot name="promo-text"></slot><slot name="callout-content"></slot> `}
            <slot name="body-xs"></slot>
            ${this.promoBottom?x`<slot name="promo-text"></slot><slot name="callout-content"></slot> `:""}  
            ${this.stockCheckbox}
        </div>
        <slot name="quantity-select"></slot>
        ${this.secureLabelFooter}`}};f(st,"variantStyle",C`
    :host([variant='plans']) {
      min-height: 348px;
    }
      
    :host([variant='plans']) ::slotted([slot='heading-xs']) {
      max-width: var(--merch-card-heading-xs-max-width, 100%);
    }
  `);var Ua=`
:root {
  --merch-card-product-width: 300px;
}

/* grid style for product */
.one-merch-card.product,
.two-merch-cards.product,
.three-merch-cards.product,
.four-merch-cards.product {
    grid-template-columns: var(--merch-card-product-width);
}

/* Tablet */
@media screen and ${$} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--merch-card-product-width));
    }
}

/* desktop */
@media screen and ${M} {
  :root {
    --merch-card-product-width: 378px;
  }
    
  .three-merch-cards.product,
  .four-merch-cards.product {
      grid-template-columns: repeat(3, var(--merch-card-product-width));
  }
}

/* Large desktop */
@media screen and ${K} {
  .four-merch-cards.product {
      grid-template-columns: repeat(4, var(--merch-card-product-width));
  }
}
`;var Ue=class extends I{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return Ua}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return x` ${this.badge}
      <div class="body">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xxs"></slot>
          ${this.promoBottom?"":x`<slot name="promo-text"></slot>`}
          <slot name="body-xs"></slot>
          ${this.promoBottom?x`<slot name="promo-text"></slot>`:""}
          <slot name="callout-content"></slot>
          <slot name="body-lower"></slot>
      </div>
      ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(pr()||this.adjustProductBodySlots(),this.adjustTitleWidth())}};f(Ue,"variantStyle",C`
    :host([variant='product']) > slot:not([name='icons']) {
        display: block;
    }
    :host([variant='product']) slot[name='body-xs'] {
        min-height: var(--merch-card-product-body-xs-height);
        display: block;
    }
    :host([variant='product']) slot[name='heading-xs'] {
        min-height: var(--merch-card-product-heading-xs-height);
        display: block;
    }
    :host([variant='product']) slot[name='body-xxs'] {
        min-height: var(--merch-card-product-body-xxs-height);
        display: block;
    }
    :host([variant='product']) slot[name='promo-text'] {
        min-height: var(--merch-card-product-promo-text-height);
        display: block;
    }
    :host([variant='product']) slot[name='callout-content'] {
        min-height: var(--merch-card-product-callout-content-height);
        display: block;
    }
      
    :host([variant='product']) ::slotted([slot='heading-xs']) {
      max-width: var(--merch-card-heading-xs-max-width, 100%);
    }
  `);var Da=`
:root {
  --merch-card-segment-width: 378px;
}

/* grid style for segment */
.one-merch-card.segment,
.two-merch-cards.segment,
.three-merch-cards.segment,
.four-merch-cards.segment {
  grid-template-columns: minmax(276px, var(--merch-card-segment-width));
}

/* Mobile */
@media screen and ${Ee} {
  :root {
    --merch-card-segment-width: 276px;
  }
}

@media screen and ${$} {
  :root {
    --merch-card-segment-width: 276px;
  }
    
  .two-merch-cards.segment,
  .three-merch-cards.segment,
  .four-merch-cards.segment {
      grid-template-columns: repeat(2, minmax(276px, var(--merch-card-segment-width)));
  }
}

/* desktop */
@media screen and ${M} {
  :root {
    --merch-card-segment-width: 302px;
  }
    
  .three-merch-cards.segment {
      grid-template-columns: repeat(3, minmax(276px, var(--merch-card-segment-width)));
  }

  .four-merch-cards.segment {
      grid-template-columns: repeat(4, minmax(276px, var(--merch-card-segment-width)));
  }
}
`;var ct=class extends I{constructor(t){super(t)}getGlobalCSS(){return Da}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return x` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":x`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?x`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};f(ct,"variantStyle",C`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--merch-card-heading-xs-max-width, 100%);
    }
  `);var Ba=`
:root {
  --merch-card-special-offers-width: 378px;
}

merch-card[variant="special-offers"] span[is="inline-price"][data-template="strikethrough"] {
  font-size: var(--merch-card-body-xs-font-size);
}

/* grid style for special-offers */
.one-merch-card.special-offers,
.two-merch-cards.special-offers,
.three-merch-cards.special-offers,
.four-merch-cards.special-offers {
  grid-template-columns: minmax(300px, var(--merch-card-special-offers-width));
}

@media screen and ${Ee} {
  :root {
    --merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${$} {
  :root {
    --merch-card-special-offers-width: 302px;
  }
    
  .two-merch-cards.special-offers,
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
      grid-template-columns: repeat(2, minmax(300px, var(--merch-card-special-offers-width)));
  }
}

/* desktop */
@media screen and ${M} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--merch-card-special-offers-width)));
  }
}

@media screen and ${K} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--merch-card-special-offers-width)));
  }
}
`;var nc={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},lt=class extends I{constructor(t){super(t)}getGlobalCSS(){return Ba}get headingSelector(){return'[slot="detail-m"]'}get aemFragmentMapping(){return nc}renderLayout(){return x`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?x`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:x`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};f(lt,"variantStyle",C`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);var Ga=`
:root {
  --merch-card-twp-width: 268px;
  --merch-card-twp-mobile-width: 300px;
  --merch-card-twp-mobile-height: 358px;
}
  
merch-card[variant="twp"] div[class$='twp-badge'] {
  padding: 4px 10px 5px 10px;
}

merch-card[variant="twp"] [slot="body-xs-top"] {
  font-size: var(--merch-card-body-xs-font-size);
  line-height: var(--merch-card-body-xs-line-height);
  color: var(--merch-color-gray-80);
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
  font-size: var(--merch-card-body-xs-font-size);
  line-height: var(--merch-card-body-xs-line-height);
  padding: var(--consonant-merch-spacing-s);
  var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs);
  color: var(--merch-color-gray-80);
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
  grid-template-columns: var(--merch-card-image-width);
}

@media screen and ${Ee} {
  :root {
    --merch-card-twp-width: 300px;
  }
  .one-merch-card.twp,
  .two-merch-cards.twp,
  .three-merch-cards.twp {
      grid-template-columns: repeat(1, var(--merch-card-twp-mobile-width));
  }
}

@media screen and ${$} {
  :root {
    --merch-card-twp-width: 268px;
  }
  .one-merch-card.twp,
  .two-merch-cards.twp {
      grid-template-columns: repeat(2, var(--merch-card-twp-width));
  }
  .three-merch-cards.twp {
      grid-template-columns: repeat(3, var(--merch-card-twp-width));
  }
}
  
@media screen and ${M} {
  :root {
    --merch-card-twp-width: 268px;
  }
  .one-merch-card.twp
  .two-merch-cards.twp {
      grid-template-columns: repeat(2, var(--merch-card-twp-width));
  }
  .three-merch-cards.twp {
      grid-template-columns: repeat(3, var(--merch-card-twp-width));
  }
}

@media screen and ${K} {
    .one-merch-card.twp
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--merch-card-twp-width));
  }
}
`;var ht=class extends I{constructor(t){super(t)}getGlobalCSS(){return Ga}renderLayout(){return x`${this.badge}
      <div class="top-section">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xs-top"></slot>
      </div>
      <div class="body">
          <slot name="body-xs"></slot>
      </div>
      <footer><slot name="footer"></slot></footer>`}};f(ht,"variantStyle",C`
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
  `);var za=`
:root {
  --merch-card-ccd-suggested-width: 305px;
  --merch-card-ccd-suggested-height: 205px;
  --merch-card-ccd-suggested-background-img-size: 119px;
}

merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
  font-size: var(--merch-card-heading-xxs-font-size);
  line-height: var(--merch-card-heading-xxs-line-height);
}

merch-card[variant="ccd-suggested"] [slot="body-xs"] a {
  text-decoration: underline;
}

merch-card[variant="ccd-suggested"] [slot="price"] span.placeholder-resolved[data-template="priceStrikethrough"],
merch-card[variant="ccd-suggested"] [slot="price"] span.placeholder-resolved[data-template="strikethrough"] {
  text-decoration: line-through;
  color: var(--ccd-gray-600-light, var(--merch-color-gray-60));
}

merch-card[variant="ccd-suggested"] [slot="cta"] a {
  font-size: var(--merch-card-body-xs-font-size);
  line-height: normal;
  text-decoration: none;
  font-weight: 700;
}

merch-card [slot='detail-s'] {
  color: var(--merch-card-detail-s-color);
}
`;var ac={mnemonics:{size:"l"},subtitle:{tag:"h4",slot:"detail-s"},title:{tag:"h3",slot:"heading-xs"},prices:{tag:"p",slot:"price"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"cta",size:"m"}},dt=class extends I{getGlobalCSS(){return za}get aemFragmentMapping(){return ac}renderLayout(){return x`
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
                <slot></slot>`}};f(dt,"variantStyle",C`
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
      line-height: var(--merch-card-detail-m-line-height);
    }

    :host([variant='ccd-suggested']) ::slotted([slot='body-xs']) {
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
      font-size: var(--merch-card-body-xs-font-size);
      line-height: var(--merch-card-body-xs-line-height);
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
      margin-top: 6px;
      align-items: center;
    }

    :host([variant='ccd-suggested']) div[class$='-badge'] {
      position: static;
      border-radius: 4px;
    }

    :host([variant='ccd-suggested']) .top-section {
      align-items: center;
    }
  `);var Fa=`
:root {
  --merch-card-ccd-slice-single-width: 322px;
  --merch-card-ccd-slice-icon-size: 30px;
  --merch-card-ccd-slice-wide-width: 600px;
  --merch-card-ccd-slice-single-height: 154px;
  --merch-card-ccd-slice-background-img-size: 119px;
}

merch-card[variant="ccd-slice"] [slot="body-s"] span.placeholder-resolved[data-template="priceStrikethrough"],
merch-card[variant="ccd-slice"] [slot="body-s"] span.placeholder-resolved[data-template="strikethrough"] {
  text-decoration: line-through;
  color: var(--ccd-gray-600-light, var(--merch-color-gray-60));
}

merch-card[variant="ccd-slice"] [slot='image'] img {
  overflow: hidden;
  border-radius: 50%;
}
`;var oc={mnemonics:{size:"m"},backgroundImage:{tag:"div",slot:"image"},description:{tag:"div",slot:"body-s"},ctas:{slot:"footer",size:"s"},allowedSizes:["wide"]},ut=class extends I{getGlobalCSS(){return Fa}get aemFragmentMapping(){return oc}renderLayout(){return x` <div class="content">
                <div class="top-section">
                  <slot name="icons"></slot> 
                  ${this.badge}
                </div>  
                <slot name="body-s"></slot>
                <slot name="footer"></slot>
            </div>
            <slot name="image"></slot>
            <slot></slot>`}};f(ut,"variantStyle",C`
        :host([variant='ccd-slice']) {
            min-width: 290px;
            max-width: var(--merch-card-ccd-slice-single-width);
            max-height: var(--merch-card-ccd-slice-single-height);
            height: var(--merch-card-ccd-slice-single-height);
            border-radius: 4px;
            display: flex;
            flex-flow: wrap;
        }

        :host([variant='ccd-slice']) ::slotted([slot='body-s']) {
            font-size: var(--merch-card-body-xs-font-size);
            line-height: var(--merch-card-body-xxs-line-height);
            max-width: 154px;
        }

        :host([variant='ccd-slice'][size='wide']) ::slotted([slot='body-s']) {
          max-width: 425px;
        }

        :host([variant='ccd-slice'][size='wide']) {
            width: var(--merch-card-ccd-slice-wide-width);
            max-width: var(--merch-card-ccd-slice-wide-width);
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
            font-size: var(--merch-card-body-xxs-font-size);
            font-style: normal;
            font-weight: 400;
            line-height: var(--merch-card-body-xxs-line-height);
            text-decoration-line: underline;
            color: var(--merch-color-gray-80);
        }

        :host([variant='ccd-slice']) ::slotted([slot='image']) {
            display: flex;
            justify-content: center;
            flex-shrink: 0;
            width: var(--merch-card-ccd-slice-background-img-size);
            height: var(--merch-card-ccd-slice-background-img-size);
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
            font-size: var(--merch-card-body-xxs-font-size);
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
    `);var Di=(e,t=!1)=>{switch(e.variant){case"catalog":return new at(e);case"image":return new br(e);case"inline-heading":return new vr(e);case"mini-compare-chart":return new ot(e);case"plans":return new st(e);case"product":return new Ue(e);case"segment":return new ct(e);case"special-offers":return new lt(e);case"twp":return new ht(e);case"ccd-suggested":return new dt(e);case"ccd-slice":return new ut(e);default:return t?void 0:new Ue(e)}},Ka=()=>{let e=[];return e.push(at.variantStyle),e.push(ot.variantStyle),e.push(Ue.variantStyle),e.push(st.variantStyle),e.push(ct.variantStyle),e.push(lt.variantStyle),e.push(ht.variantStyle),e.push(dt.variantStyle),e.push(ut.variantStyle),e};var ja=document.createElement("style");ja.innerHTML=`
:root {
    --merch-card-detail-font-size: 12px;
    --merch-card-detail-font-weight: 500;
    --merch-card-detail-letter-spacing: 0.8px;

    --merch-card-heading-font-size: 18px;
    --merch-card-heading-line-height: 22.5px;
    --merch-card-heading-secondary-font-size: 14px;
    --merch-card-body-font-size: 14px;
    --merch-card-body-line-height: 21px;
    --merch-card-promo-text-height: var(--merch-card-body-font-size);

    /* Fonts */
    --merch-body-font-family: 'Adobe Clean', adobe-clean, 'Trebuchet MS', sans-serif;

    /* spacing */
    --consonant-merch-spacing-xxxs: 4px;
    --consonant-merch-spacing-xxs: 8px;
    --consonant-merch-spacing-xs: 16px;
    --consonant-merch-spacing-s: 24px;
    --consonant-merch-spacing-m: 32px;

    /* cta */
    --merch-card-cta-font-size: 15px;

    /* headings */
    --merch-card-heading-xxs-font-size: 16px;
    --merch-card-heading-xxs-line-height: 20px;
    --merch-card-heading-xs-font-size: 18px;
    --merch-card-heading-xs-line-height: 22.5px;
    --merch-card-heading-s-font-size: 20px;
    --merch-card-heading-s-line-height: 25px;
    --merch-card-heading-m-font-size: 24px;
    --merch-card-heading-m-line-height: 30px;
    --merch-card-heading-l-font-size: 20px;
    --merch-card-heading-l-line-height: 30px;
    --merch-card-heading-xl-font-size: 36px;
    --merch-card-heading-xl-line-height: 45px;

    /* detail */
    --merch-card-detail-s-font-size: 11px;
    --merch-card-detail-s-line-height: 14px;
    --merch-card-detail-m-font-size: 12px;
    --merch-card-detail-m-line-height: 15px;
    --merch-card-detail-m-font-weight: 700;
    --merch-card-detail-m-letter-spacing: 1px;

    /* body */
    --merch-card-body-xxs-font-size: 12px;
    --merch-card-body-xxs-line-height: 18px;
    --merch-card-body-xxs-letter-spacing: 1px;
    --merch-card-body-xs-font-size: 14px;
    --merch-card-body-xs-line-height: 21px;
    --merch-card-body-s-font-size: 16px;
    --merch-card-body-s-line-height: 24px;
    --merch-card-body-m-font-size: 18px;
    --merch-card-body-m-line-height: 27px;
    --merch-card-body-l-font-size: 20px;
    --merch-card-body-l-line-height: 30px;
    --merch-card-body-xl-font-size: 22px;
    --merch-card-body-xl-line-height: 33px;


    --merch-card-heading-padding: 0;

    /* colors */
    --merch-color-accent: #1473E6;
    --merch-card-border-color: #eaeaea;
    --merch-card-color: var(--color-gray-800);
    --merch-card-background-color: #fff;
    --merch-card-detail-s-color: var(--merch-color-gray-600);
    --merch-color-focus-ring: #1473E6;
    --merch-color-green-promo: #2D9D78;
    --merch-color-gray-10: #f6f6f6;
    --merch-color-gray-200: #E8E8E8;
    --merch-color-gray-60: #6D6D6D;
    --merch-color-gray-600: #686868;
    --merch-color-gray-80: #2c2c2c;

    /* ccd colors */
    
    --ccd-gray-200-light: #E6E6E6;
    --ccd-gray-800-dark: #222;
    --ccd-gray-700-dark: #464646;
    --ccd-gray-600-light: #6D6D6D;
    
    
    

    /* merch card generic */
    --merch-card-max-width: 300px;
    --transition: cmax-height 0.3s linear, opacity 0.3s linear;

    /* background image */
    --merch-card-bg-img-height: 180px;

    /* inline SVGs */
    --checkmark-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath fill='%23fff' d='M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1 1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712 6A.999.999 0 0 1 3.788 9z' class='spectrum-UIIcon--medium'/%3E%3C/svg%3E%0A");

    --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23757575' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");

    --info-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'><circle cx='18' cy='12' r='2.15'%3E%3C/circle%3E%3Cpath d='M20.333 24H20v-7.6a.4.4 0 0 0-.4-.4h-3.933s-1.167.032-1.167 1 1.167 1 1.167 1H16v6h-.333s-1.167.032-1.167 1 1.167 1 1.167 1h4.667s1.167-.033 1.167-1-1.168-1-1.168-1z'%3E%3C/path%3E%3Cpath d='M18 2.1A15.9 15.9 0 1 0 33.9 18 15.9 15.9 0 0 0 18 2.1zm0 29.812A13.912 13.912 0 1 1 31.913 18 13.912 13.912 0 0 1 18 31.913z'%3E%3C/path%3E%3C/svg%3E");

    --ellipsis-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="2" cy="2" r="2" fill="%232c2c2c" transform="translate(6 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" data-name="Ellipse 71" transform="translate(12 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" transform="translate(0 6)"/></svg>');

    /* callout */
    --merch-card-callout-line-height: 21px;
    --merch-card-callout-font-size: 14px;
    --merch-card-callout-font-color: #2C2C2C;
    --merch-card-callout-icon-size: 16px;
    --merch-card-callout-icon-top: 6px;
    --merch-card-callout-icon-right: 8px;
    --merch-card-callout-letter-spacing: 0px;
    --merch-card-callout-icon-padding: 34px;
    --merch-card-callout-spacing-xxs: 8px;
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


merch-card span[is='inline-price']:has(+ span[is='inline-price']) {
    margin-inline-end: var(--consonant-merch-spacing-xxs);
}

merch-card sp-button a[is='checkout-link'] {
    pointer-events: auto;
}

merch-card [slot^='heading-'] {
    font-weight: 700;
}

merch-card [slot='heading-xs'] {
    font-size: var(--merch-card-heading-xs-font-size);
    line-height: var(--merch-card-heading-xs-line-height);
    margin: 0;
}

merch-card.dc-pricing [slot='heading-xs'] {
    margin-bottom: var(--consonant-merch-spacing-xxs);
}

merch-card:not([variant='inline-heading']) [slot='heading-xs'] a {
    color: var(--merch-color-gray-80);
}

merch-card div.starting-at {
  font-size: var(--merch-card-body-xs-font-size);
  line-height: var(--merch-card-body-xs-line-height);
  font-weight: 500;
}

merch-card [slot='heading-xs'] a:not(:hover) {
    text-decoration: inherit;
}

merch-card [slot='heading-s'] {
    font-size: var(--merch-card-heading-s-font-size);
    line-height: var(--merch-card-heading-s-line-height);
    margin: 0;
}

merch-card [slot='heading-m'] {
    font-size: var(--merch-card-heading-m-font-size);
    line-height: var(--merch-card-heading-m-line-height);
    margin: 0;
}

merch-card [slot='heading-m-price'] {
    font-size: var(--merch-card-heading-m-font-size);
    line-height: var(--merch-card-heading-m-line-height);
    padding: 0 var(--consonant-merch-spacing-s);
    margin: 0;
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot='offers'] {
    padding: var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-s);
}

merch-card [slot='heading-l'] {
    font-size: var(--merch-card-heading-l-font-size);
    line-height: var(--merch-card-heading-l-line-height);
    margin: 0;
}

merch-card [slot='heading-xl'] {
    font-size: var(--merch-card-heading-xl-font-size);
    line-height: var(--merch-card-heading-xl-line-height);
    margin: 0;
}

merch-card [slot='callout-content'] {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--merch-card-callout-spacing-xxs);
}

merch-card [slot='callout-content'] > div {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--merch-card-callout-spacing-xxs);
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
    font: normal normal normal var(--merch-card-callout-font-size)/var(--merch-card-callout-line-height) var(--body-font-family, 'Adobe Clean');
    letter-spacing: var(--merch-card-callout-letter-spacing);
    color: var(--merch-card-callout-font-color);
}

merch-card [slot='callout-content'] img {
    width: var(--merch-card-callout-icon-size);
    height: var(--merch-card-callout-icon-size);
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
}

merch-card [slot='detail-m'] {
    font-size: var(--merch-card-detail-m-font-size);
    letter-spacing: var(--merch-card-detail-m-letter-spacing);
    font-weight: var(--merch-card-detail-m-font-weight);
    text-transform: uppercase;
    margin: 0;
    color: var(--merch-color-gray-80);
}

merch-card [slot="body-xxs"] {
    font-size: var(--merch-card-body-xxs-font-size);
    line-height: var(--merch-card-body-xxs-line-height);
    font-weight: normal;
    letter-spacing: var(--merch-card-body-xxs-letter-spacing);
    margin: 0;
    color: var(--merch-color-gray-80);
}

merch-card [slot="body-xs"] {
    font-size: var(--merch-card-body-xs-font-size);
    line-height: var(--merch-card-body-xs-line-height);
    flex-grow: 1;
}

merch-card [slot="body-m"] {
    font-size: var(--merch-card-body-m-font-size);
    line-height: var(--merch-card-body-m-line-height);
    color: var(--merch-color-gray-80);
}

merch-card [slot="body-l"] {
    font-size: var(--merch-card-body-l-font-size);
    line-height: var(--merch-card-body-l-line-height);
    color: var(--merch-color-gray-80);
}

merch-card [slot="body-xl"] {
    font-size: var(--merch-card-body-xl-font-size);
    line-height: var(--merch-card-body-xl-line-height);
    color: var(--merch-color-gray-80);
}

merch-card a.primary-link,
merch-card a.secondary-link {
  font-size: var(--merch-card-body-xxs-font-size);
  font-style: normal;
  font-weight: 400;
  line-height: var(--merch-card-body-xxs-line-height);
  text-decoration-line: underline;
  }
 
merch-card a.primary-link {
  color: var(--merch-color-accent);
}

merch-card a.secondary-link {
  color: var(--merch-card-color);
}

merch-card [slot="cci-footer"] p,
merch-card [slot="cct-footer"] p,
merch-card [slot="cce-footer"] p {
    margin: 0;
}

merch-card [slot="promo-text"] {
    color: var(--merch-color-green-promo);
    font-size: var(--merch-card-promo-text-height);
    font-weight: 700;
    line-height: var(--merch-card-promo-text-height);
    margin: 0;
    min-height: var(--merch-card-promo-text-height);
    padding: 0;
}

merch-card div[slot="footer"] {
    display: contents;
}

merch-card [slot="footer"] a {
    word-wrap: break-word;
    text-align: center;
}

merch-card [slot="footer"] a:not([class]) {
    font-weight: 700;
    font-size: var(--merch-card-cta-font-size);
}

merch-card div[slot='bg-image'] img {
    position: relative;
    width: 100%;
    min-height: var(--merch-card-bg-img-height);
    max-height: var(--merch-card-bg-img-height);
    object-fit: cover;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
}

merch-card span[is="inline-price"][data-template='strikethrough'] {
    text-decoration: line-through;
}

.price-unit-type:not(.disabled)::before,
.price-tax-inclusivity:not(.disabled)::before {
  content: "\\00a0";
}

merch-card sp-button a,
merch-card sp-button a:hover {
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
  font-size: var(--merch-card-body-xs-font-size);
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

.dark {
  --merch-card-border-color: #3F3F3F;
  --merch-card-background-color: #1E1E1E;
  --merch-card-detail-s-color: var(--color-gray-100);
  --merch-card-color: var(--color-gray-100);
}
`;document.head.appendChild(ja);var sc="#000000",cc="#F8D904",lc=/(accent|primary|secondary)(-(outline|link))?/,hc="mas:product_code/",dc="daa-ll",Ar="daa-lh";function uc(e,t,r){e.mnemonicIcon?.map((n,a)=>({icon:n,alt:e.mnemonicAlt[a]??"",link:e.mnemonicLink[a]??""}))?.forEach(({icon:n,alt:a,link:o})=>{if(o&&!/^https?:/.test(o))try{o=new URL(`https://${o}`).href.toString()}catch{o="#"}let s={slot:"icons",src:n,size:r?.size??"l"};a&&(s.alt=a),o&&(s.href=o);let c=le("merch-icon",s);t.append(c)})}function mc(e,t){e.badge&&(t.setAttribute("badge-text",e.badge),t.setAttribute("badge-color",e.badgeColor||sc),t.setAttribute("badge-background-color",e.badgeBackgroundColor||cc))}function pc(e,t,r){r?.includes(e.size)&&t.setAttribute("size",e.size)}function fc(e,t,r){e.cardTitle&&r&&t.append(le(r.tag,{slot:r.slot},e.cardTitle))}function gc(e,t,r){e.subtitle&&r&&t.append(le(r.tag,{slot:r.slot},e.subtitle))}function xc(e,t,r,i){if(e.backgroundImage)switch(i){case"ccd-slice":r&&t.append(le(r.tag,{slot:r.slot},`<img loading="lazy" src="${e.backgroundImage}" />`));break;case"ccd-suggested":t.setAttribute("background-image",e.backgroundImage);break}}function bc(e,t,r){if(e.prices&&r){let i=le(r.tag,{slot:r.slot},e.prices);t.append(i)}}function vc(e,t,r){if(e.description&&r){let i=le(r.tag,{slot:r.slot},e.description);t.append(i)}}function Ac(e,t,r,i){e.tabIndex=-1;let n=le("sp-button",{treatment:r,variant:t,tabIndex:0,size:i.ctas.size??"m"},e);return n.addEventListener("click",a=>{a.target!==e&&(a.stopPropagation(),e.click())}),n}function Ec(e,t,r,i){return e.classList.add("con-button"),r==="outline"&&e.classList.add("outline"),t==="accent"?e.classList.add("blue"):t==="black"&&e.classList.add("fill"),(i.ctas.size??"m")==="s"&&e.classList.add("button-s"),e}function Sc(e,t,r){if(e.ctas){let{slot:i}=r.ctas,n=le("div",{slot:i},e.ctas),a=[...n.querySelectorAll("a")].map(o=>{let s=lc.exec(o.className)?.[0]??"accent";if(s.includes("-link"))return o;let l=s.includes("accent"),h=s.includes("primary"),d=s.includes("secondary"),u=s.includes("-outline"),m="fill",p;return l?p="accent":h?p="primary":d&&(p="secondary"),u&&(m="outline"),t.consonant?Ec(o,p,m,r):Ac(o,p,m,r)});n.innerHTML="",n.append(...a),t.append(n)}}function Tc(e,t){let{tags:r}=e,i=r?.find(n=>n.startsWith(hc))?.split("/").pop();i&&(t.setAttribute(Ar,i),t.querySelectorAll("a[data-analytics-id]").forEach((n,a)=>{n.setAttribute(dc,`${n.dataset.analyticsId}-${a+1}`)}))}async function Ya(e,t){let{fields:r}=e,{variant:i}=r;if(!i)return;t.querySelectorAll("[slot]").forEach(a=>{a.remove()}),t.removeAttribute("background-image"),t.removeAttribute("badge-background-color"),t.removeAttribute("badge-color"),t.removeAttribute("badge-text"),t.removeAttribute("size"),t.removeAttribute(Ar),t.variant=i,await t.updateComplete;let{aemFragmentMapping:n}=t.variantLayout;n&&(xc(r,t,n.backgroundImage,i),mc(r,t),Sc(r,t,n,i),vc(r,t,n.description),uc(r,t,n.mnemonics),bc(r,t,n.prices),pc(r,t,n.allowedSizes),gc(r,t,n.subtitle),fc(r,t,n.title),Tc(r,t))}var yc="merch-card",Lc=1e4,Gi,Mt,Bi,Vt=class extends ee{constructor(){super();D(this,Mt);f(this,"customerSegment");f(this,"marketSegment");f(this,"variantLayout");D(this,Gi,!1);this.filters={},this.types="",this.selected=!1,this.consonant=!0,this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this)}firstUpdated(){this.variantLayout=Di(this,!1),this.variantLayout?.connectedCallbackHook(),this.aemFragment?.updateComplete.catch(()=>{this.style.display="none"})}willUpdate(r){(r.has("variant")||!this.variantLayout)&&(this.variantLayout=Di(this),this.variantLayout.connectedCallbackHook())}updated(r){(r.has("badgeBackgroundColor")||r.has("borderColor"))&&this.style.setProperty("--merch-card-border",this.computedBorderStyle),this.variantLayout?.postCardUpdateHook(this)}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["twp","ccd-slice","ccd-suggested"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}async toggleStockOffer({target:r}){if(!this.stockOfferOsis)return;let i=this.checkoutLinks;if(i.length!==0)for(let n of i){await n.onceSettled();let a=n.value?.[0]?.planType;if(!a)return;let o=this.stockOfferOsis[a];if(!o)return;let s=n.dataset.wcsOsi.split(",").filter(c=>c!==o);r.checked&&s.push(o),n.dataset.wcsOsi=s.join(",")}}handleQuantitySelection(r){let i=this.checkoutLinks;for(let n of i)n.dataset.quantity=r.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(r){let i={...this.filters};Object.keys(i).forEach(n=>{if(r){i[n].order=Math.min(i[n].order||2,2);return}let a=i[n].order;a===1||isNaN(a)||(i[n].order=Number(a)+1)}),this.filters=i}includes(r){return this.textContent.match(new RegExp(r,"i"))!==null}connectedCallback(){super.connectedCallback(),this.addEventListener(gr,this.handleQuantitySelection),this.addEventListener(Si,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.storageOptions?.addEventListener("change",this.handleStorageChange),this.addEventListener($e,this.handleAemFragmentEvents),this.addEventListener(Me,this.handleAemFragmentEvents),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout.disconnectedCallbackHook(),this.removeEventListener(gr,this.handleQuantitySelection),this.storageOptions?.removeEventListener(fr,this.handleStorageChange),this.removeEventListener($e,this.handleAemFragmentEvents),this.removeEventListener(Me,this.handleAemFragmentEvents)}async handleAemFragmentEvents(r){if(r.type===$e&&xe(this,Mt,Bi).call(this,"AEM fragment cannot be loaded"),r.type===Me&&r.target.nodeName==="AEM-FRAGMENT"){let i=r.detail;await Ya(i,this),this.checkReady()}}async checkReady(){let r=Promise.all([...this.querySelectorAll('span[is="inline-price"][data-wcs-osi],a[is="checkout-link"][data-wcs-osi]')].map(a=>a.onceSettled().catch(()=>a))).then(a=>a.every(o=>o.classList.contains("placeholder-resolved"))),i=new Promise(a=>setTimeout(()=>a(!1),Lc));if(await Promise.race([r,i])===!0){this.dispatchEvent(new CustomEvent(Li,{bubbles:!0,composed:!0}));return}xe(this,Mt,Bi).call(this,"Contains unresolved offers")}get aemFragment(){return this.querySelector("aem-fragment")}get storageOptions(){return this.querySelector("sp-radio-group#storage")}get storageSpecificOfferSelect(){let r=this.storageOptions?.selected;if(r){let i=this.querySelector(`merch-offer-select[storage="${r}"]`);if(i)return i}return this.querySelector("merch-offer-select")}get offerSelect(){return this.storageOptions?this.storageSpecificOfferSelect:this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||this.dispatchEvent(new CustomEvent(Ti,{bubbles:!0}))}handleStorageChange(){let r=this.closest("merch-card")?.offerSelect.cloneNode(!0);r&&this.dispatchEvent(new CustomEvent(fr,{detail:{offerSelect:r},bubbles:!0}))}get dynamicPrice(){return this.querySelector('[slot="price"]')}selectMerchOffer(r){if(r===this.merchOffer)return;this.merchOffer=r;let i=this.dynamicPrice;if(r.price&&i){let n=r.price.cloneNode(!0);i.onceSettled?i.onceSettled().then(()=>{i.replaceWith(n)}):i.replaceWith(n)}}};Gi=new WeakMap,Mt=new WeakSet,Bi=function(r){this.dispatchEvent(new CustomEvent(_i,{detail:r,bubbles:!0,composed:!0}))},f(Vt,"properties",{name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:r=>{let[i,n,a]=r.split(",");return{PUF:i,ABM:n,M2M:a}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:r=>Object.fromEntries(r.split(",").map(i=>{let[n,a,o]=i.split(":"),s=Number(a);return[n,{order:isNaN(s)?void 0:s,size:o}]})),toAttribute:r=>Object.entries(r).map(([i,{order:n,size:a}])=>[i,n,a].filter(o=>o!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:Ar,reflect:!0}}),f(Vt,"styles",[Na,Ka(),...ka()]);customElements.define(yc,Vt);var mt=class extends ee{constructor(){super(),this.size="m",this.alt=""}render(){let{href:t}=this;return t?x`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="lazy" />
              </a>`:x` <img src="${this.src}" alt="${this.alt}" loading="lazy" />`}};f(mt,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0}}),f(mt,"styles",C`
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
    `);customElements.define("merch-icon",mt);var Za=new CSSStyleSheet;Za.replaceSync(":host { display: contents; }");var _c=document.querySelector('meta[name="aem-base-url"]')?.content??"https://odin.adobe.com",Xa="fragment",Wa="author",wc="ims",qa=e=>{throw new Error(`Failed to get fragment: ${e}`)};async function Pc(e,t,r,i){let n=r?`${e}/adobe/sites/cf/fragments/${t}`:`${e}/adobe/sites/fragments/${t}`,a=await fetch(n,{cache:"default",credentials:"omit",headers:i}).catch(o=>qa(o.message));return a?.ok||qa(`${a.status} ${a.statusText}`),a.json()}var zi,Se,Fi=class{constructor(){D(this,Se,new Map)}clear(){L(this,Se).clear()}add(...t){t.forEach(r=>{let{id:i}=r;i&&L(this,Se).set(i,r)})}has(t){return L(this,Se).has(t)}get(t){return L(this,Se).get(t)}remove(t){L(this,Se).delete(t)}};Se=new WeakMap;var Er=new Fi,De,me,Te,$t,pe,pt,fe,ji,Ja,Qa,Ki=class extends HTMLElement{constructor(){super();D(this,fe);f(this,"cache",Er);D(this,De);D(this,me);D(this,Te);D(this,$t,!1);D(this,pe);D(this,pt,!1);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[Za];let r=this.getAttribute(wc);["",!0,"true"].includes(r)&&(F(this,$t,!0),zi||(zi={Authorization:`Bearer ${window.adobeid?.authorize?.()}`}))}static get observedAttributes(){return[Xa,Wa]}attributeChangedCallback(r,i,n){r===Xa&&(F(this,Te,n),this.refresh(!1)),r===Wa&&F(this,pt,["","true"].includes(n))}connectedCallback(){if(!L(this,Te)){xe(this,fe,ji).call(this,"Missing fragment id");return}}async refresh(r=!0){L(this,pe)&&!await Promise.race([L(this,pe),Promise.resolve(!1)])||(r&&Er.remove(L(this,Te)),F(this,pe,this.fetchData().then(()=>(this.dispatchEvent(new CustomEvent(Me,{detail:this.data,bubbles:!0,composed:!0})),!0)).catch(i=>(xe(this,fe,ji).call(this,"Network error: failed to load fragment"),F(this,pe,null),!1))),L(this,pe))}async fetchData(){F(this,De,null),F(this,me,null);let r=Er.get(L(this,Te));r||(r=await Pc(_c,L(this,Te),L(this,pt),L(this,$t)?zi:void 0),Er.add(r)),F(this,De,r)}get updateComplete(){return L(this,pe)??Promise.reject(new Error("AEM fragment cannot be loaded"))}get data(){return L(this,me)?L(this,me):(L(this,pt)?xe(this,fe,Ja).call(this):xe(this,fe,Qa).call(this),L(this,me))}};De=new WeakMap,me=new WeakMap,Te=new WeakMap,$t=new WeakMap,pe=new WeakMap,pt=new WeakMap,fe=new WeakSet,ji=function(r){this.classList.add("error"),this.dispatchEvent(new CustomEvent($e,{detail:r,bubbles:!0,composed:!0}))},Ja=function(){let{id:r,tags:i,fields:n}=L(this,De);F(this,me,n.reduce((a,{name:o,multiple:s,values:c})=>(a.fields[o]=s?c:c[0],a),{id:r,tags:i,fields:{}}))},Qa=function(){let{id:r,tags:i,fields:n}=L(this,De);F(this,me,Object.entries(n).reduce((a,[o,s])=>(a.fields[o]=s?.mimeType?s.value:s??"",a),{id:r,tags:i,fields:{}}))};customElements.define("aem-fragment",Ki);var Be={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},eo=1e3,to=new Set;function Cc(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function ro(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:i,originatingRequest:n,status:a}=e;return[i,a,n].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!Be.serializableTypes.includes(r))return r}return e}function Ic(e,t){if(!Be.ignoredProperties.includes(e))return ro(t)}var Yi={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,i=[],n=[],a=t;r.forEach(l=>{l!=null&&(Cc(l)?i:n).push(l)}),i.length&&(a+=" "+i.map(ro).join(" "));let{pathname:o,search:s}=window.location,c=`${Be.delimiter}page=${o}${s}`;c.length>eo&&(c=`${c.slice(0,eo)}<trunc>`),a+=c,n.length&&(a+=`${Be.delimiter}facts=`,a+=JSON.stringify(n,Ic)),to.has(a)||(to.add(a),window.lana?.log(a,Be))}};function ft(e){Object.assign(Be,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in Be&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var Ht;(function(e){e.STAGE="STAGE",e.PRODUCTION="PRODUCTION",e.LOCAL="LOCAL"})(Ht||(Ht={}));var Xi;(function(e){e.STAGE="STAGE",e.PRODUCTION="PROD",e.LOCAL="LOCAL"})(Xi||(Xi={}));var Ut;(function(e){e.DRAFT="DRAFT",e.PUBLISHED="PUBLISHED"})(Ut||(Ut={}));var Ge;(function(e){e.V2="UCv2",e.V3="UCv3"})(Ge||(Ge={}));var Z;(function(e){e.CHECKOUT="checkout",e.CHECKOUT_EMAIL="checkout/email",e.SEGMENTATION="segmentation",e.BUNDLE="bundle",e.COMMITMENT="commitment",e.RECOMMENDATION="recommendation",e.EMAIL="email",e.PAYMENT="payment",e.CHANGE_PLAN_TEAM_PLANS="change-plan/team-upgrade/plans",e.CHANGE_PLAN_TEAM_PAYMENT="change-plan/team-upgrade/payment"})(Z||(Z={}));var Wi=function(e){var t;return(t=Nc.get(e))!==null&&t!==void 0?t:e},Nc=new Map([["countrySpecific","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["offerType","ot"],["marketSegment","ms"]]);var io=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],i=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&i>=e.length&&(e=void 0),{value:e&&e[i++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},no=function(e,t){var r=typeof Symbol=="function"&&e[Symbol.iterator];if(!r)return e;var i=r.call(e),n,a=[],o;try{for(;(t===void 0||t-- >0)&&!(n=i.next()).done;)a.push(n.value)}catch(s){o={error:s}}finally{try{n&&!n.done&&(r=i.return)&&r.call(i)}finally{if(o)throw o.error}}return a};function gt(e,t,r){var i,n;try{for(var a=io(Object.entries(e)),o=a.next();!o.done;o=a.next()){var s=no(o.value,2),c=s[0],l=s[1],h=Wi(c);l!=null&&r.has(h)&&t.set(h,l)}}catch(d){i={error:d}}finally{try{o&&!o.done&&(n=a.return)&&n.call(a)}finally{if(i)throw i.error}}}function Sr(e){switch(e){case Ht.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function Tr(e,t){var r,i;for(var n in e){var a=e[n];try{for(var o=(r=void 0,io(Object.entries(a))),s=o.next();!s.done;s=o.next()){var c=no(s.value,2),l=c[0],h=c[1];if(h!=null){var d=Wi(l);t.set("items["+n+"]["+d+"]",h)}}}catch(u){r={error:u}}finally{try{s&&!s.done&&(i=o.return)&&i.call(o)}finally{if(r)throw r.error}}}}var kc=function(e,t){var r={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(r[i]=e[i]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,i=Object.getOwnPropertySymbols(e);n<i.length;n++)t.indexOf(i[n])<0&&Object.prototype.propertyIsEnumerable.call(e,i[n])&&(r[i[n]]=e[i[n]]);return r},Oc=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],i=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&i>=e.length&&(e=void 0),{value:e&&e[i++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};function ao(e){Mc(e);var t=e.env,r=e.items,i=e.workflowStep,n=kc(e,["env","items","workflowStep"]),a=new URL(Sr(t));return a.pathname=i+"/",Tr(r,a.searchParams),gt(n,a.searchParams,Rc),a.toString()}var Rc=new Set(["cli","co","lang","ctx","cUrl","mv","nglwfdata","otac","promoid","rUrl","sdid","spint","trackingid","code","campaignid","appctxid"]),Vc=["env","workflowStep","clientId","country","items"];function Mc(e){var t,r;try{for(var i=Oc(Vc),n=i.next();!n.done;n=i.next()){var a=n.value;if(!e[a])throw new Error('Argument "checkoutData" is not valid, missing: '+a)}}catch(o){t={error:o}}finally{try{n&&!n.done&&(r=i.return)&&r.call(i)}finally{if(t)throw t.error}}return!0}var $c=function(e,t){var r={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&t.indexOf(i)<0&&(r[i]=e[i]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,i=Object.getOwnPropertySymbols(e);n<i.length;n++)t.indexOf(i[n])<0&&Object.prototype.propertyIsEnumerable.call(e,i[n])&&(r[i[n]]=e[i[n]]);return r},Hc=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],i=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&i>=e.length&&(e=void 0),{value:e&&e[i++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},Uc="p_draft_landscape",Dc="/store/";function Zi(e){Gc(e);var t=e.env,r=e.items,i=e.workflowStep,n=e.ms,a=e.marketSegment,o=e.ot,s=e.offerType,c=e.pa,l=e.productArrangementCode,h=e.landscape,d=$c(e,["env","items","workflowStep","ms","marketSegment","ot","offerType","pa","productArrangementCode","landscape"]),u={marketSegment:a??n,offerType:s??o,productArrangementCode:l??c},m=new URL(Sr(t));return m.pathname=""+Dc+i,i!==Z.SEGMENTATION&&i!==Z.CHANGE_PLAN_TEAM_PLANS&&Tr(r,m.searchParams),i===Z.SEGMENTATION&&gt(u,m.searchParams,qi),gt(d,m.searchParams,qi),h===Ut.DRAFT&&gt({af:Uc},m.searchParams,qi),m.toString()}var qi=new Set(["af","ai","apc","appctxid","cli","co","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),Bc=["env","workflowStep","clientId","country"];function Gc(e){var t,r;try{for(var i=Hc(Bc),n=i.next();!n.done;n=i.next()){var a=n.value;if(!e[a])throw new Error('Argument "checkoutData" is not valid, missing: '+a)}}catch(o){t={error:o}}finally{try{n&&!n.done&&(r=i.return)&&r.call(i)}finally{if(t)throw t.error}}if(e.workflowStep!==Z.SEGMENTATION&&e.workflowStep!==Z.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}function Ji(e,t){switch(e){case Ge.V2:return ao(t);case Ge.V3:return Zi(t);default:return console.warn("Unsupported CheckoutType, will use UCv3 as default. Given type: "+e),Zi(t)}}var Qi;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(Qi||(Qi={}));var U;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(U||(U={}));var k;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(k||(k={}));var en;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(en||(en={}));var tn;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(tn||(tn={}));var rn;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(rn||(rn={}));var nn;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(nn||(nn={}));var oo="tacocat.js";var yr=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),so=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function O(e,t={},{metadata:r=!0,search:i=!0,storage:n=!0}={}){let a;if(i&&a==null){let o=new URLSearchParams(window.location.search),s=xt(i)?i:e;a=o.get(s)}if(n&&a==null){let o=xt(n)?n:e;a=window.sessionStorage.getItem(o)??window.localStorage.getItem(o)}if(r&&a==null){let o=zc(xt(r)?r:e);a=document.documentElement.querySelector(`meta[name="${o}"]`)?.content}return a??t[e]}var bt=()=>{};var co=e=>typeof e=="boolean",Dt=e=>typeof e=="function",Lr=e=>typeof e=="number",lo=e=>e!=null&&typeof e=="object";var xt=e=>typeof e=="string",an=e=>xt(e)&&e,vt=e=>Lr(e)&&Number.isFinite(e)&&e>0;function At(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,i])=>{t(i)&&delete e[r]}),e}function y(e,t){if(co(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function ye(e,t,r){let i=Object.values(t);return i.find(n=>yr(n,e))??r??i[0]}function zc(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,i)=>`${r}-${i}`).replace(/\W+/gu,"-").toLowerCase()}function Et(e,t=1){return Lr(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var Fc=Date.now(),on=()=>`(+${Date.now()-Fc}ms)`,_r=new Set,Kc=y(O("tacocat.debug",{},{metadata:!1}),typeof process<"u"&&process.env?.DEBUG);function ho(e){let t=`[${oo}/${e}]`,r=(o,s,...c)=>o?!0:(n(s,...c),!1),i=Kc?(o,...s)=>{console.debug(`${t} ${o}`,...s,on())}:()=>{},n=(o,...s)=>{let c=`${t} ${o}`;_r.forEach(([l])=>l(c,...s))};return{assert:r,debug:i,error:n,warn:(o,...s)=>{let c=`${t} ${o}`;_r.forEach(([,l])=>l(c,...s))}}}function jc(e,t){let r=[e,t];return _r.add(r),()=>{_r.delete(r)}}jc((e,...t)=>{console.error(e,...t,on())},(e,...t)=>{console.warn(e,...t,on())});var Yc="no promo",uo="promo-tag",Xc="yellow",Wc="neutral",qc=(e,t,r)=>{let i=a=>a||Yc,n=r?` (was "${i(t)}")`:"";return`${i(e)}${n}`},Zc="cancel-context",Bt=(e,t)=>{let r=e===Zc,i=!r&&e?.length>0,n=(i||r)&&(t&&t!=e||!t&&!r),a=n&&i||!n&&!!t,o=a?e||t:void 0;return{effectivePromoCode:o,overridenPromoCode:e,className:a?uo:`${uo} no-promo`,text:qc(o,t,n),variant:a?Xc:Wc,isOverriden:n}};var sn="ABM",cn="PUF",ln="M2M",hn="PERPETUAL",dn="P3Y",Jc="TAX_INCLUSIVE_DETAILS",Qc="TAX_EXCLUSIVE",mo={ABM:sn,PUF:cn,M2M:ln,PERPETUAL:hn,P3Y:dn},Lm={[sn]:{commitment:U.YEAR,term:k.MONTHLY},[cn]:{commitment:U.YEAR,term:k.ANNUAL},[ln]:{commitment:U.MONTH,term:k.MONTHLY},[hn]:{commitment:U.PERPETUAL,term:void 0},[dn]:{commitment:U.THREE_MONTHS,term:k.P3Y}},po="Value is not an offer",wr=e=>{if(typeof e!="object")return po;let{commitment:t,term:r}=e,i=el(t,r);return{...e,planType:i}};var el=(e,t)=>{switch(e){case void 0:return po;case"":return"";case U.YEAR:return t===k.MONTHLY?sn:t===k.ANNUAL?cn:"";case U.MONTH:return t===k.MONTHLY?ln:"";case U.PERPETUAL:return hn;case U.TERM_LICENSE:return t===k.P3Y?dn:"";default:return""}};function un(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:i,priceWithoutTax:n,priceWithoutDiscountAndTax:a,taxDisplay:o}=t;if(o!==Jc)return e;let s={...e,priceDetails:{...t,price:n??r,priceWithoutDiscount:a??i,taxDisplay:Qc}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var mn=function(e,t){return mn=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,i){r.__proto__=i}||function(r,i){for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(r[n]=i[n])},mn(e,t)};function Gt(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");mn(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var A=function(){return A=Object.assign||function(t){for(var r,i=1,n=arguments.length;i<n;i++){r=arguments[i];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},A.apply(this,arguments)};function Pr(e,t,r){if(r||arguments.length===2)for(var i=0,n=t.length,a;i<n;i++)(a||!(i in t))&&(a||(a=Array.prototype.slice.call(t,0,i)),a[i]=t[i]);return e.concat(a||Array.prototype.slice.call(t))}var v;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(v||(v={}));var P;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(P||(P={}));var ze;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(ze||(ze={}));function pn(e){return e.type===P.literal}function fo(e){return e.type===P.argument}function Cr(e){return e.type===P.number}function Ir(e){return e.type===P.date}function Nr(e){return e.type===P.time}function kr(e){return e.type===P.select}function Or(e){return e.type===P.plural}function go(e){return e.type===P.pound}function Rr(e){return e.type===P.tag}function Vr(e){return!!(e&&typeof e=="object"&&e.type===ze.number)}function zt(e){return!!(e&&typeof e=="object"&&e.type===ze.dateTime)}var fn=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var tl=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function xo(e){var t={};return e.replace(tl,function(r){var i=r.length;switch(r[0]){case"G":t.era=i===4?"long":i===5?"narrow":"short";break;case"y":t.year=i===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][i-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][i-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=i===4?"short":i===5?"narrow":"short";break;case"e":if(i<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][i-4];break;case"c":if(i<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][i-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][i-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][i-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][i-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][i-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][i-1];break;case"s":t.second=["numeric","2-digit"][i-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=i<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var bo=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function So(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(bo).filter(function(u){return u.length>0}),r=[],i=0,n=t;i<n.length;i++){var a=n[i],o=a.split("/");if(o.length===0)throw new Error("Invalid number skeleton");for(var s=o[0],c=o.slice(1),l=0,h=c;l<h.length;l++){var d=h[l];if(d.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:c})}return r}function rl(e){return e.replace(/^(.*?)-/,"")}var vo=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,To=/^(@+)?(\+|#+)?[rs]?$/g,il=/(\*)(0+)|(#+)(0+)|(0+)/g,yo=/^(0+)$/;function Ao(e){var t={};return e[e.length-1]==="r"?t.roundingPriority="morePrecision":e[e.length-1]==="s"&&(t.roundingPriority="lessPrecision"),e.replace(To,function(r,i,n){return typeof n!="string"?(t.minimumSignificantDigits=i.length,t.maximumSignificantDigits=i.length):n==="+"?t.minimumSignificantDigits=i.length:i[0]==="#"?t.maximumSignificantDigits=i.length:(t.minimumSignificantDigits=i.length,t.maximumSignificantDigits=i.length+(typeof n=="string"?n.length:0)),""}),t}function Lo(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function nl(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!yo.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function Eo(e){var t={},r=Lo(e);return r||t}function _o(e){for(var t={},r=0,i=e;r<i.length;r++){var n=i[r];switch(n.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=n.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=rl(n.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=A(A(A({},t),{notation:"scientific"}),n.options.reduce(function(c,l){return A(A({},c),Eo(l))},{}));continue;case"engineering":t=A(A(A({},t),{notation:"engineering"}),n.options.reduce(function(c,l){return A(A({},c),Eo(l))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(n.options[0]);continue;case"integer-width":if(n.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");n.options[0].replace(il,function(c,l,h,d,u,m){if(l)t.minimumIntegerDigits=h.length;else{if(d&&u)throw new Error("We currently do not support maximum integer digits");if(m)throw new Error("We currently do not support exact integer digits")}return""});continue}if(yo.test(n.stem)){t.minimumIntegerDigits=n.stem.length;continue}if(vo.test(n.stem)){if(n.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");n.stem.replace(vo,function(c,l,h,d,u,m){return h==="*"?t.minimumFractionDigits=l.length:d&&d[0]==="#"?t.maximumFractionDigits=d.length:u&&m?(t.minimumFractionDigits=u.length,t.maximumFractionDigits=u.length+m.length):(t.minimumFractionDigits=l.length,t.maximumFractionDigits=l.length),""});var a=n.options[0];a==="w"?t=A(A({},t),{trailingZeroDisplay:"stripIfInteger"}):a&&(t=A(A({},t),Ao(a)));continue}if(To.test(n.stem)){t=A(A({},t),Ao(n.stem));continue}var o=Lo(n.stem);o&&(t=A(A({},t),o));var s=nl(n.stem);s&&(t=A(A({},t),s))}return t}var Ft={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function wo(e,t){for(var r="",i=0;i<e.length;i++){var n=e.charAt(i);if(n==="j"){for(var a=0;i+1<e.length&&e.charAt(i+1)===n;)a++,i++;var o=1+(a&1),s=a<2?1:3+(a>>1),c="a",l=al(t);for((l=="H"||l=="k")&&(s=0);s-- >0;)r+=c;for(;o-- >0;)r=l+r}else n==="J"?r+="H":r+=n}return r}function al(e){var t=e.hourCycle;if(t===void 0&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var r=e.language,i;r!=="root"&&(i=e.maximize().region);var n=Ft[i||""]||Ft[r||""]||Ft["".concat(r,"-001")]||Ft["001"];return n[0]}var gn,ol=new RegExp("^".concat(fn.source,"*")),sl=new RegExp("".concat(fn.source,"*$"));function E(e,t){return{start:e,end:t}}var cl=!!String.prototype.startsWith,ll=!!String.fromCodePoint,hl=!!Object.fromEntries,dl=!!String.prototype.codePointAt,ul=!!String.prototype.trimStart,ml=!!String.prototype.trimEnd,pl=!!Number.isSafeInteger,fl=pl?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},bn=!0;try{Po=ko("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),bn=((gn=Po.exec("a"))===null||gn===void 0?void 0:gn[0])==="a"}catch{bn=!1}var Po,Co=cl?function(t,r,i){return t.startsWith(r,i)}:function(t,r,i){return t.slice(i,i+r.length)===r},vn=ll?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var i="",n=t.length,a=0,o;n>a;){if(o=t[a++],o>1114111)throw RangeError(o+" is not a valid code point");i+=o<65536?String.fromCharCode(o):String.fromCharCode(((o-=65536)>>10)+55296,o%1024+56320)}return i},Io=hl?Object.fromEntries:function(t){for(var r={},i=0,n=t;i<n.length;i++){var a=n[i],o=a[0],s=a[1];r[o]=s}return r},No=dl?function(t,r){return t.codePointAt(r)}:function(t,r){var i=t.length;if(!(r<0||r>=i)){var n=t.charCodeAt(r),a;return n<55296||n>56319||r+1===i||(a=t.charCodeAt(r+1))<56320||a>57343?n:(n-55296<<10)+(a-56320)+65536}},gl=ul?function(t){return t.trimStart()}:function(t){return t.replace(ol,"")},xl=ml?function(t){return t.trimEnd()}:function(t){return t.replace(sl,"")};function ko(e,t){return new RegExp(e,t)}var An;bn?(xn=ko("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),An=function(t,r){var i;xn.lastIndex=r;var n=xn.exec(t);return(i=n[1])!==null&&i!==void 0?i:""}):An=function(t,r){for(var i=[];;){var n=No(t,r);if(n===void 0||Ro(n)||Al(n))break;i.push(n),r+=n>=65536?2:1}return vn.apply(void 0,i)};var xn,Oo=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.locale=r.locale,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,i){for(var n=[];!this.isEOF();){var a=this.char();if(a===123){var o=this.parseArgument(t,i);if(o.err)return o;n.push(o.val)}else{if(a===125&&t>0)break;if(a===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),n.push({type:P.pound,location:E(s,this.clonePosition())})}else if(a===60&&!this.ignoreTag&&this.peek()===47){if(i)break;return this.error(v.UNMATCHED_CLOSING_TAG,E(this.clonePosition(),this.clonePosition()))}else if(a===60&&!this.ignoreTag&&En(this.peek()||0)){var o=this.parseTag(t,r);if(o.err)return o;n.push(o.val)}else{var o=this.parseLiteral(t,r);if(o.err)return o;n.push(o.val)}}}return{val:n,err:null}},e.prototype.parseTag=function(t,r){var i=this.clonePosition();this.bump();var n=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:P.literal,value:"<".concat(n,"/>"),location:E(i,this.clonePosition())},err:null};if(this.bumpIf(">")){var a=this.parseMessage(t+1,r,!0);if(a.err)return a;var o=a.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!En(this.char()))return this.error(v.INVALID_TAG,E(s,this.clonePosition()));var c=this.clonePosition(),l=this.parseTagName();return n!==l?this.error(v.UNMATCHED_CLOSING_TAG,E(c,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:P.tag,value:n,children:o,location:E(i,this.clonePosition())},err:null}:this.error(v.INVALID_TAG,E(s,this.clonePosition())))}else return this.error(v.UNCLOSED_TAG,E(i,this.clonePosition()))}else return this.error(v.INVALID_TAG,E(i,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&vl(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var i=this.clonePosition(),n="";;){var a=this.tryParseQuote(r);if(a){n+=a;continue}var o=this.tryParseUnquoted(t,r);if(o){n+=o;continue}var s=this.tryParseLeftAngleBracket();if(s){n+=s;continue}break}var c=E(i,this.clonePosition());return{val:{type:P.literal,value:n,location:c},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!bl(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var i=this.char();if(i===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(i);this.bump()}return vn.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var i=this.char();return i===60||i===123||i===35&&(r==="plural"||r==="selectordinal")||i===125&&t>0?null:(this.bump(),vn(i))},e.prototype.parseArgument=function(t,r){var i=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,E(i,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(v.EMPTY_ARGUMENT,E(i,this.clonePosition()));var n=this.parseIdentifierIfPossible().value;if(!n)return this.error(v.MALFORMED_ARGUMENT,E(i,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,E(i,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:P.argument,value:n,location:E(i,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,E(i,this.clonePosition())):this.parseArgumentOptions(t,r,n,i);default:return this.error(v.MALFORMED_ARGUMENT,E(i,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),i=An(this.message,r),n=r+i.length;this.bumpTo(n);var a=this.clonePosition(),o=E(t,a);return{value:i,location:o}},e.prototype.parseArgumentOptions=function(t,r,i,n){var a,o=this.clonePosition(),s=this.parseIdentifierIfPossible().value,c=this.clonePosition();switch(s){case"":return this.error(v.EXPECT_ARGUMENT_TYPE,E(o,c));case"number":case"date":case"time":{this.bumpSpace();var l=null;if(this.bumpIf(",")){this.bumpSpace();var h=this.clonePosition(),d=this.parseSimpleArgStyleIfPossible();if(d.err)return d;var u=xl(d.val);if(u.length===0)return this.error(v.EXPECT_ARGUMENT_STYLE,E(this.clonePosition(),this.clonePosition()));var m=E(h,this.clonePosition());l={style:u,styleLocation:m}}var p=this.tryParseArgumentClose(n);if(p.err)return p;var g=E(n,this.clonePosition());if(l&&Co(l?.style,"::",0)){var S=gl(l.style.slice(2));if(s==="number"){var d=this.parseNumberSkeletonFromString(S,l.styleLocation);return d.err?d:{val:{type:P.number,value:i,location:g,style:d.val},err:null}}else{if(S.length===0)return this.error(v.EXPECT_DATE_TIME_SKELETON,g);var w=S;this.locale&&(w=wo(S,this.locale));var u={type:ze.dateTime,pattern:w,location:l.styleLocation,parsedOptions:this.shouldParseSkeletons?xo(w):{}},b=s==="date"?P.date:P.time;return{val:{type:b,value:i,location:g,style:u},err:null}}}return{val:{type:s==="number"?P.number:s==="date"?P.date:P.time,value:i,location:g,style:(a=l?.style)!==null&&a!==void 0?a:null},err:null}}case"plural":case"selectordinal":case"select":{var T=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(v.EXPECT_SELECT_ARGUMENT_OPTIONS,E(T,A({},T)));this.bumpSpace();var N=this.parseIdentifierIfPossible(),R=0;if(s!=="select"&&N.value==="offset"){if(!this.bumpIf(":"))return this.error(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,E(this.clonePosition(),this.clonePosition()));this.bumpSpace();var d=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,v.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(d.err)return d;this.bumpSpace(),N=this.parseIdentifierIfPossible(),R=d.val}var V=this.tryParsePluralOrSelectOptions(t,s,r,N);if(V.err)return V;var p=this.tryParseArgumentClose(n);if(p.err)return p;var H=E(n,this.clonePosition());return s==="select"?{val:{type:P.select,value:i,options:Io(V.val),location:H},err:null}:{val:{type:P.plural,value:i,options:Io(V.val),offset:R,pluralType:s==="plural"?"cardinal":"ordinal",location:H},err:null}}default:return this.error(v.INVALID_ARGUMENT_TYPE,E(o,c))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,E(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var i=this.char();switch(i){case 39:{this.bump();var n=this.clonePosition();if(!this.bumpUntil("'"))return this.error(v.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,E(n,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var i=[];try{i=So(t)}catch{return this.error(v.INVALID_NUMBER_SKELETON,r)}return{val:{type:ze.number,tokens:i,location:r,parsedOptions:this.shouldParseSkeletons?_o(i):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,i,n){for(var a,o=!1,s=[],c=new Set,l=n.value,h=n.location;;){if(l.length===0){var d=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var u=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_SELECTOR,v.INVALID_PLURAL_ARGUMENT_SELECTOR);if(u.err)return u;h=E(d,this.clonePosition()),l=this.message.slice(d.offset,this.offset())}else break}if(c.has(l))return this.error(r==="select"?v.DUPLICATE_SELECT_ARGUMENT_SELECTOR:v.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,h);l==="other"&&(o=!0),this.bumpSpace();var m=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:v.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,E(this.clonePosition(),this.clonePosition()));var p=this.parseMessage(t+1,r,i);if(p.err)return p;var g=this.tryParseArgumentClose(m);if(g.err)return g;s.push([l,{value:p.val,location:E(m,this.clonePosition())}]),c.add(l),this.bumpSpace(),a=this.parseIdentifierIfPossible(),l=a.value,h=a.location}return s.length===0?this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR:v.EXPECT_PLURAL_ARGUMENT_SELECTOR,E(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!o?this.error(v.MISSING_OTHER_CLAUSE,E(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var i=1,n=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(i=-1);for(var a=!1,o=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)a=!0,o=o*10+(s-48),this.bump();else break}var c=E(n,this.clonePosition());return a?(o*=i,fl(o)?{val:o,err:null}:this.error(r,c)):this.error(t,c)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=No(this.message,t);if(r===void 0)throw Error("Offset ".concat(t," is at invalid UTF-16 code unit boundary"));return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(Co(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),i=this.message.indexOf(t,r);return i>=0?(this.bumpTo(i),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset ".concat(t," must be greater than or equal to the current offset ").concat(this.offset()));for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset ".concat(t," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&Ro(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),i=this.message.charCodeAt(r+(t>=65536?2:1));return i??null},e}();function En(e){return e>=97&&e<=122||e>=65&&e<=90}function bl(e){return En(e)||e===47}function vl(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function Ro(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function Al(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function Sn(e){e.forEach(function(t){if(delete t.location,kr(t)||Or(t))for(var r in t.options)delete t.options[r].location,Sn(t.options[r].value);else Cr(t)&&Vr(t.style)||(Ir(t)||Nr(t))&&zt(t.style)?delete t.style.location:Rr(t)&&Sn(t.children)})}function Vo(e,t){t===void 0&&(t={}),t=A({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new Oo(e,t).parse();if(r.err){var i=SyntaxError(v[r.err.kind]);throw i.location=r.err.location,i.originalMessage=r.err.message,i}return t?.captureLocation||Sn(r.val),r.val}function Kt(e,t){var r=t&&t.cache?t.cache:_l,i=t&&t.serializer?t.serializer:Ll,n=t&&t.strategy?t.strategy:Sl;return n(e,{cache:r,serializer:i})}function El(e){return e==null||typeof e=="number"||typeof e=="boolean"}function Mo(e,t,r,i){var n=El(i)?i:r(i),a=t.get(n);return typeof a>"u"&&(a=e.call(this,i),t.set(n,a)),a}function $o(e,t,r){var i=Array.prototype.slice.call(arguments,3),n=r(i),a=t.get(n);return typeof a>"u"&&(a=e.apply(this,i),t.set(n,a)),a}function Tn(e,t,r,i,n){return r.bind(t,e,i,n)}function Sl(e,t){var r=e.length===1?Mo:$o;return Tn(e,this,r,t.cache.create(),t.serializer)}function Tl(e,t){return Tn(e,this,$o,t.cache.create(),t.serializer)}function yl(e,t){return Tn(e,this,Mo,t.cache.create(),t.serializer)}var Ll=function(){return JSON.stringify(arguments)};function yn(){this.cache=Object.create(null)}yn.prototype.get=function(e){return this.cache[e]};yn.prototype.set=function(e,t){this.cache[e]=t};var _l={create:function(){return new yn}},Mr={variadic:Tl,monadic:yl};var Fe;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(Fe||(Fe={}));var jt=function(e){Gt(t,e);function t(r,i,n){var a=e.call(this,r)||this;return a.code=i,a.originalMessage=n,a}return t.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},t}(Error);var Ln=function(e){Gt(t,e);function t(r,i,n,a){return e.call(this,'Invalid values for "'.concat(r,'": "').concat(i,'". Options are "').concat(Object.keys(n).join('", "'),'"'),Fe.INVALID_VALUE,a)||this}return t}(jt);var Ho=function(e){Gt(t,e);function t(r,i,n){return e.call(this,'Value for "'.concat(r,'" must be of type ').concat(i),Fe.INVALID_VALUE,n)||this}return t}(jt);var Uo=function(e){Gt(t,e);function t(r,i){return e.call(this,'The intl string context variable "'.concat(r,'" was not provided to the string "').concat(i,'"'),Fe.MISSING_VALUE,i)||this}return t}(jt);var j;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(j||(j={}));function wl(e){return e.length<2?e:e.reduce(function(t,r){var i=t[t.length-1];return!i||i.type!==j.literal||r.type!==j.literal?t.push(r):i.value+=r.value,t},[])}function Pl(e){return typeof e=="function"}function Yt(e,t,r,i,n,a,o){if(e.length===1&&pn(e[0]))return[{type:j.literal,value:e[0].value}];for(var s=[],c=0,l=e;c<l.length;c++){var h=l[c];if(pn(h)){s.push({type:j.literal,value:h.value});continue}if(go(h)){typeof a=="number"&&s.push({type:j.literal,value:r.getNumberFormat(t).format(a)});continue}var d=h.value;if(!(n&&d in n))throw new Uo(d,o);var u=n[d];if(fo(h)){(!u||typeof u=="string"||typeof u=="number")&&(u=typeof u=="string"||typeof u=="number"?String(u):""),s.push({type:typeof u=="string"?j.literal:j.object,value:u});continue}if(Ir(h)){var m=typeof h.style=="string"?i.date[h.style]:zt(h.style)?h.style.parsedOptions:void 0;s.push({type:j.literal,value:r.getDateTimeFormat(t,m).format(u)});continue}if(Nr(h)){var m=typeof h.style=="string"?i.time[h.style]:zt(h.style)?h.style.parsedOptions:i.time.medium;s.push({type:j.literal,value:r.getDateTimeFormat(t,m).format(u)});continue}if(Cr(h)){var m=typeof h.style=="string"?i.number[h.style]:Vr(h.style)?h.style.parsedOptions:void 0;m&&m.scale&&(u=u*(m.scale||1)),s.push({type:j.literal,value:r.getNumberFormat(t,m).format(u)});continue}if(Rr(h)){var p=h.children,g=h.value,S=n[g];if(!Pl(S))throw new Ho(g,"function",o);var w=Yt(p,t,r,i,n,a),b=S(w.map(function(R){return R.value}));Array.isArray(b)||(b=[b]),s.push.apply(s,b.map(function(R){return{type:typeof R=="string"?j.literal:j.object,value:R}}))}if(kr(h)){var T=h.options[u]||h.options.other;if(!T)throw new Ln(h.value,u,Object.keys(h.options),o);s.push.apply(s,Yt(T.value,t,r,i,n));continue}if(Or(h)){var T=h.options["=".concat(u)];if(!T){if(!Intl.PluralRules)throw new jt(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,Fe.MISSING_INTL_API,o);var N=r.getPluralRules(t,{type:h.pluralType}).select(u-(h.offset||0));T=h.options[N]||h.options.other}if(!T)throw new Ln(h.value,u,Object.keys(h.options),o);s.push.apply(s,Yt(T.value,t,r,i,n,u-(h.offset||0)));continue}}return wl(s)}function Cl(e,t){return t?A(A(A({},e||{}),t||{}),Object.keys(e).reduce(function(r,i){return r[i]=A(A({},e[i]),t[i]||{}),r},{})):e}function Il(e,t){return t?Object.keys(e).reduce(function(r,i){return r[i]=Cl(e[i],t[i]),r},A({},e)):e}function _n(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function Nl(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:Kt(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.NumberFormat).bind.apply(t,Pr([void 0],r,!1)))},{cache:_n(e.number),strategy:Mr.variadic}),getDateTimeFormat:Kt(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.DateTimeFormat).bind.apply(t,Pr([void 0],r,!1)))},{cache:_n(e.dateTime),strategy:Mr.variadic}),getPluralRules:Kt(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.PluralRules).bind.apply(t,Pr([void 0],r,!1)))},{cache:_n(e.pluralRules),strategy:Mr.variadic})}}var Do=function(){function e(t,r,i,n){var a=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(o){var s=a.formatToParts(o);if(s.length===1)return s[0].value;var c=s.reduce(function(l,h){return!l.length||h.type!==j.literal||typeof l[l.length-1]!="string"?l.push(h.value):l[l.length-1]+=h.value,l},[]);return c.length<=1?c[0]||"":c},this.formatToParts=function(o){return Yt(a.ast,a.locales,a.formatters,a.formats,o,void 0,a.message)},this.resolvedOptions=function(){return{locale:a.resolvedLocale.toString()}},this.getAst=function(){return a.ast},this.locales=r,this.resolvedLocale=e.resolveLocale(r),typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:n?.ignoreTag,locale:this.resolvedLocale})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Il(e.formats,i),this.formatters=n&&n.formatters||Nl(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(t){var r=Intl.NumberFormat.supportedLocalesOf(t);return r.length>0?new Intl.Locale(r[0]):new Intl.Locale(typeof t=="string"?t:t[0])},e.__parse=Vo,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var Bo=Do;var kl=/[0-9\-+#]/,Ol=/[^\d\-+#]/g;function Go(e){return e.search(kl)}function Rl(e="#.##"){let t={},r=e.length,i=Go(e);t.prefix=i>0?e.substring(0,i):"";let n=Go(e.split("").reverse().join("")),a=r-n,o=e.substring(a,a+1),s=a+(o==="."||o===","?1:0);t.suffix=n>0?e.substring(s,r):"",t.mask=e.substring(i,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let c=t.mask.match(Ol);return t.decimal=c&&c[c.length-1]||".",t.separator=c&&c[1]&&c[0]||",",c=t.mask.split(t.decimal),t.integer=c[0],t.fraction=c[1],t}function Vl(e,t,r){let i=!1,n={value:e};e<0&&(i=!0,n.value=-n.value),n.sign=i?"-":"",n.value=Number(n.value).toFixed(t.fraction&&t.fraction.length),n.value=Number(n.value).toString();let a=t.fraction&&t.fraction.lastIndexOf("0"),[o="0",s=""]=n.value.split(".");return(!s||s&&s.length<=a)&&(s=a<0?"":(+("0."+s)).toFixed(a+1).replace("0.","")),n.integer=o,n.fraction=s,Ml(n,t),(n.result==="0"||n.result==="")&&(i=!1,n.sign=""),!i&&t.maskHasPositiveSign?n.sign="+":i&&t.maskHasPositiveSign?n.sign="-":i&&(n.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),n}function Ml(e,t){e.result="";let r=t.integer.split(t.separator),i=r.join(""),n=i&&i.indexOf("0");if(n>-1)for(;e.integer.length<i.length-n;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let a=r[1]&&r[r.length-1].length;if(a){let o=e.integer.length,s=o%a;for(let c=0;c<o;c++)e.result+=e.integer.charAt(c),!((c-s+1)%a)&&c<o-a&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function $l(e,t,r={}){if(!e||isNaN(Number(t)))return t;let i=Rl(e),n=Vl(t,i,r);return i.prefix+n.sign+n.result+i.suffix}var zo=$l;var Fo=".",Hl=",",jo=/^\s+/,Yo=/\s+$/,Ko="&nbsp;",Xt={MONTH:"MONTH",YEAR:"YEAR"},Ul={[k.ANNUAL]:12,[k.MONTHLY]:1,[k.THREE_YEARS]:36,[k.TWO_YEARS]:24},Dl={CHF:e=>Math.round(e*20)/20},wn=(e,t)=>({accept:e,round:t}),Bl=[wn(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),wn(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.ceil(Math.floor(t*1e4/e)/100)/100),wn(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],Pn={[U.YEAR]:{[k.MONTHLY]:Xt.MONTH,[k.ANNUAL]:Xt.YEAR},[U.MONTH]:{[k.MONTHLY]:Xt.MONTH}},Gl=(e,t)=>e.indexOf(`'${t}'`)===0,zl=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),i=Wo(r);return!!i?t||(r=r.replace(/[,\.]0+/,i)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+Kl(e)),r},Fl=e=>{let t=jl(e),r=Gl(e,t),i=e.replace(/'.*?'/,""),n=jo.test(i)||Yo.test(i);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:n}},Xo=e=>e.replace(jo,Ko).replace(Yo,Ko),Kl=e=>e.match(/#(.?)#/)?.[1]===Fo?Hl:Fo,jl=e=>e.match(/'(.*?)'/)?.[1]??"",Wo=e=>e.match(/0(.?)0/)?.[1]??"";function $r({formatString:e,price:t,usePrecision:r,isIndianPrice:i=!1},n,a=o=>o){let{currencySymbol:o,isCurrencyFirst:s,hasCurrencySpace:c}=Fl(e),l=r?Wo(e):"",h=zl(e,r),d=r?2:0,u=a(t,{currencySymbol:o}),m=i?u.toLocaleString("hi-IN",{minimumFractionDigits:d,maximumFractionDigits:d}):zo(h,u),p=r?m.lastIndexOf(l):m.length,g=m.substring(0,p),S=m.substring(p+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,m).replace(/SYMBOL/,o),currencySymbol:o,decimals:S,decimalsDelimiter:l,hasCurrencySpace:c,integer:g,isCurrencyFirst:s,recurrenceTerm:n}}var qo=e=>{let{commitment:t,term:r,usePrecision:i}=e,n=Ul[r]??1;return $r(e,n>1?Xt.MONTH:Pn[t]?.[r],(a,{currencySymbol:o})=>{let s={divisor:n,price:a,usePrecision:i},{round:c}=Bl.find(({accept:h})=>h(s));if(!c)throw new Error(`Missing rounding rule for: ${JSON.stringify(s)}`);return(Dl[o]??(h=>h))(c(s))})},Zo=({commitment:e,term:t,...r})=>$r(r,Pn[e]?.[t]),Jo=e=>{let{commitment:t,term:r}=e;return t===U.YEAR&&r===k.MONTHLY?$r(e,Xt.YEAR,i=>i*12):$r(e,Pn[t]?.[r])};var Yl={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at {alternativePrice}",strikethroughAriaLabel:"Regularly at {strikethroughPrice}"},Xl=ho("ConsonantTemplates/price"),Wl=/<\/?[^>]+(>|$)/g,z={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},Ke={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel"},ql="TAX_EXCLUSIVE",Zl=e=>lo(e)?Object.entries(e).filter(([,t])=>xt(t)||Lr(t)||t===!0).reduce((t,[r,i])=>t+` ${r}${i===!0?"":'="'+so(i)+'"'}`,""):"",Y=(e,t,r,i=!1)=>`<span class="${e}${t?"":" "+z.disabled}"${Zl(r)}>${i?Xo(t):t??""}</span>`;function Jl(e,{accessibleLabel:t,currencySymbol:r,decimals:i,decimalsDelimiter:n,hasCurrencySpace:a,integer:o,isCurrencyFirst:s,recurrenceLabel:c,perUnitLabel:l,taxInclusivityLabel:h},d={}){let u=Y(z.currencySymbol,r),m=Y(z.currencySpace,a?"&nbsp;":""),p="";return s&&(p+=u+m),p+=Y(z.integer,o),p+=Y(z.decimalsDelimiter,n),p+=Y(z.decimals,i),s||(p+=m+u),p+=Y(z.recurrence,c,null,!0),p+=Y(z.unitType,l,null,!0),p+=Y(z.taxInclusivity,h,!0),Y(e,p,{...d,"aria-label":t})}var W=({displayOptical:e=!1,displayStrikethrough:t=!1,displayAnnual:r=!1}={})=>({country:i,displayFormatted:n=!0,displayRecurrence:a=!0,displayPerUnit:o=!1,displayTax:s=!1,language:c,literals:l={}}={},{commitment:h,offerSelectorIds:d,formatString:u,price:m,priceWithoutDiscount:p,taxDisplay:g,taxTerm:S,term:w,usePrecision:b}={},T={})=>{Object.entries({country:i,formatString:u,language:c,price:m}).forEach(([se,Fr])=>{if(Fr==null)throw new Error(`Argument "${se}" is missing for osi ${d?.toString()}, country ${i}, language ${c}`)});let N={...Yl,...l},R=`${c.toLowerCase()}-${i.toUpperCase()}`;function V(se,Fr){let Kr=N[se];if(Kr==null)return"";try{return new Bo(Kr.replace(Wl,""),R).format(Fr)}catch{return Xl.error("Failed to format literal:",Kr),""}}let H=t&&p?p:m,ae=e?qo:Zo;r&&(ae=Jo);let{accessiblePrice:Xe,recurrenceTerm:_e,...We}=ae({commitment:h,formatString:u,term:w,price:e?m:H,usePrecision:b,isIndianPrice:i==="IN"}),J=Xe,ge="";if(y(a)&&_e){let se=V(Ke.recurrenceAriaLabel,{recurrenceTerm:_e});se&&(J+=" "+se),ge=V(Ke.recurrenceLabel,{recurrenceTerm:_e})}let oe="";if(y(o)){oe=V(Ke.perUnitLabel,{perUnit:"LICENSE"});let se=V(Ke.perUnitAriaLabel,{perUnit:"LICENSE"});se&&(J+=" "+se)}let Q="";y(s)&&S&&(Q=V(g===ql?Ke.taxExclusiveLabel:Ke.taxInclusiveLabel,{taxTerm:S}),Q&&(J+=" "+Q)),t&&(J=V(Ke.strikethroughAriaLabel,{strikethroughPrice:J}));let we=z.container;if(e&&(we+=" "+z.containerOptical),t&&(we+=" "+z.containerStrikethrough),r&&(we+=" "+z.containerAnnual),y(n))return Jl(we,{...We,accessibleLabel:J,recurrenceLabel:ge,perUnitLabel:oe,taxInclusivityLabel:Q},T);let{currencySymbol:jn,decimals:bs,decimalsDelimiter:vs,hasCurrencySpace:Yn,integer:As,isCurrencyFirst:Es}=We,qe=[As,vs,bs];Es?(qe.unshift(Yn?"\xA0":""),qe.unshift(jn)):(qe.push(Yn?"\xA0":""),qe.push(jn)),qe.push(ge,oe,Q);let Ss=qe.join("");return Y(we,Ss,T)},Qo=()=>(e,t,r)=>{let n=(e.displayOldPrice===void 0||y(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${W()(e,t,r)}${n?"&nbsp;"+W({displayStrikethrough:!0})(e,t,r):""}`},es=()=>(e,t,r)=>{let i={...e,displayTax:!1,displayPerUnit:!1};return`${(e.displayOldPrice===void 0||y(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price?W({displayStrikethrough:!0})(i,t,r)+"&nbsp;":""}${W()(e,t,r)}${Y(z.containerAnnualPrefix,"&nbsp;(")}${W({displayAnnual:!0})(i,t,r)}${Y(z.containerAnnualSuffix,")")}`},ts=()=>(e,t,r)=>{let i={...e,displayTax:!1,displayPerUnit:!1};return`${W()(e,t,r)}${Y(z.containerAnnualPrefix,"&nbsp;(")}${W({displayAnnual:!0})(i,t,r)}${Y(z.containerAnnualSuffix,")")}`};var Cn=W(),In=Qo(),Nn=W({displayOptical:!0}),kn=W({displayStrikethrough:!0}),On=W({displayAnnual:!0}),Rn=ts(),Vn=es();var Ql=(e,t)=>{if(!(!vt(e)||!vt(t)))return Math.floor((t-e)/t*100)},rs=()=>(e,t)=>{let{price:r,priceWithoutDiscount:i}=t,n=Ql(r,i);return n===void 0?'<span class="no-discount"></span>':`<span class="discount">${n}%</span>`};var Mn=rs();var{freeze:Wt}=Object,te=Wt({...Ge}),re=Wt({...Z}),je={STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"},$n=Wt({...U}),Hn=Wt({...mo}),Un=Wt({...k});var is="mas-commerce-service";function ns(e,{once:t=!1}={}){let r=null;function i(){let n=document.querySelector(is);n!==r&&(r=n,n&&e(n))}return document.addEventListener(nt,i,{once:t}),Le(i),()=>document.removeEventListener(nt,i)}function qt(e,{country:t,forceTaxExclusive:r,perpetual:i}){let n;if(e.length<2)n=e;else{let a=t==="GB"||i?"EN":"MULT",[o,s]=e;n=[o.language===a?o:s]}return r&&(n=n.map(un)),n}var Le=e=>window.setTimeout(e);function St(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(Et).filter(vt);return r.length||(r=[t]),r}function Hr(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(an)}function q(){return document.getElementsByTagName(is)?.[0]}var _=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflow:te.V3,checkoutWorkflowStep:re.EMAIL,country:"US",displayOldPrice:!0,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,env:je.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsBufferDelay:1,wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:He.PUBLISHED,wcsBufferLimit:1});var Dn=Object.freeze({LOCAL:"local",PROD:"prod",STAGE:"stage"});function eh({locale:e=void 0,country:t=void 0,language:r=void 0}={}){return r??(r=e?.split("_")?.[0]||_.language),t??(t=e?.split("_")?.[1]||_.country),e??(e=`${r}_${t}`),{locale:e,country:t,language:r}}function Bn(e={}){let{commerce:t={}}=e,r=je.PRODUCTION,i=$i,n=O("checkoutClientId",t)??_.checkoutClientId,a=ye(O("checkoutWorkflow",t),te,_.checkoutWorkflow),o=re.CHECKOUT;a===te.V3&&(o=ye(O("checkoutWorkflowStep",t),re,_.checkoutWorkflowStep));let s=y(O("displayOldPrice",t),_.displayOldPrice),c=y(O("displayPerUnit",t),_.displayPerUnit),l=y(O("displayRecurrence",t),_.displayRecurrence),h=y(O("displayTax",t),_.displayTax),d=y(O("entitlement",t),_.entitlement),u=y(O("modal",t),_.modal),m=y(O("forceTaxExclusive",t),_.forceTaxExclusive),p=O("promotionCode",t)??_.promotionCode,g=St(O("quantity",t)),S=O("wcsApiKey",t)??_.wcsApiKey,w=t?.env==="stage",b=He.PUBLISHED;["true",""].includes(t.allowOverride)&&(w=(O(Vi,t,{metadata:!1})?.toLowerCase()??t?.env)==="stage",b=ye(O(Mi,t),He,b)),w&&(r=je.STAGE,i=Hi);let N=Et(O("wcsBufferDelay",t),_.wcsBufferDelay),R=Et(O("wcsBufferLimit",t),_.wcsBufferLimit);return{...eh(e),displayOldPrice:s,checkoutClientId:n,checkoutWorkflow:a,checkoutWorkflowStep:o,displayPerUnit:c,displayRecurrence:l,displayTax:h,entitlement:d,extraOptions:_.extraOptions,modal:u,env:r,forceTaxExclusive:m,promotionCode:p,quantity:g,wcsApiKey:S,wcsBufferDelay:N,wcsBufferLimit:R,wcsURL:i,landscape:b}}var Gn={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},th=Date.now(),zn=new Set,Fn=new Set,as=new Map,os={append({level:e,message:t,params:r,timestamp:i,source:n}){console[e](`${i}ms [${n}] %c${t}`,"font-weight: bold;",...r)}},ss={filter:({level:e})=>e!==Gn.DEBUG},rh={filter:()=>!1};function ih(e,t,r,i,n){return{level:e,message:t,namespace:r,get params(){return i.length===1&&Dt(i[0])&&(i=i[0](),Array.isArray(i)||(i=[i])),i},source:n,timestamp:Date.now()-th}}function nh(e){[...Fn].every(t=>t(e))&&zn.forEach(t=>t(e))}function cs(e){let t=(as.get(e)??0)+1;as.set(e,t);let r=`${e} #${t}`,i={id:r,namespace:e,module:n=>cs(`${i.namespace}/${n}`),updateConfig:ft};return Object.values(Gn).forEach(n=>{i[n]=(a,...o)=>nh(ih(n,a,e,o,r))}),Object.seal(i)}function Ur(...e){e.forEach(t=>{let{append:r,filter:i}=t;Dt(i)&&Fn.add(i),Dt(r)&&zn.add(r)})}function ah(e={}){let{name:t}=e,r=y(O("commerce.debug",{search:!0,storage:!0}),t===Dn.LOCAL);return Ur(r?os:ss),t===Dn.PROD&&Ur(Yi),X}function oh(){zn.clear(),Fn.clear()}var X={...cs(Ri),Level:Gn,Plugins:{consoleAppender:os,debugFilter:ss,quietFilter:rh,lanaAppender:Yi},init:ah,reset:oh,use:Ur};var sh={[he]:wi,[de]:Pi,[ue]:Ci},ch={[he]:Ni,[de]:ki,[ue]:Oi},Tt=class{constructor(t){f(this,"changes",new Map);f(this,"connected",!1);f(this,"dispose",bt);f(this,"error");f(this,"log");f(this,"options");f(this,"promises",[]);f(this,"state",de);f(this,"timer",null);f(this,"value");f(this,"version",0);f(this,"wrapperElement");this.wrapperElement=t}update(){[he,de,ue].forEach(t=>{this.wrapperElement.classList.toggle(sh[t],t===this.state)})}notify(){(this.state===ue||this.state===he)&&(this.state===ue?this.promises.forEach(({resolve:t})=>t(this.wrapperElement)):this.state===he&&this.promises.forEach(({reject:t})=>t(this.error)),this.promises=[]),this.wrapperElement.dispatchEvent(new CustomEvent(ch[this.state],{bubbles:!0}))}attributeChangedCallback(t,r,i){this.changes.set(t,i),this.requestUpdate()}connectedCallback(){this.dispose=ns(()=>this.requestUpdate(!0))}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement})),this.dispose(),this.dispose=bt}onceSettled(){let{error:t,promises:r,state:i}=this;return ue===i?Promise.resolve(this.wrapperElement):he===i?Promise.reject(t):new Promise((n,a)=>{r.push({resolve:n,reject:a})})}toggleResolved(t,r,i){return t!==this.version?!1:(i!==void 0&&(this.options=i),this.state=ue,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),Le(()=>this.notify()),!0)}toggleFailed(t,r,i){return t!==this.version?!1:(i!==void 0&&(this.options=i),this.error=r,this.state=he,this.update(),this.log?.error("Failed:",{element:this.wrapperElement,error:r}),Le(()=>this.notify()),!0)}togglePending(t){return this.version++,t&&(this.options=t),this.state=de,this.update(),Le(()=>this.notify()),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!q()||this.timer)return;let r=X.module("mas-element"),{error:i,options:n,state:a,value:o,version:s}=this;this.state=de,this.timer=Le(async()=>{this.timer=null;let c=null;if(this.changes.size&&(c=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:c}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:c})),c||t)try{await this.wrapperElement.render?.()===!1&&this.state===de&&this.version===s&&(this.state=a,this.error=i,this.value=o,this.update(),this.notify())}catch(l){r.error("Failed to render mas-element: ",l),this.toggleFailed(this.version,l,n)}})}};function ls(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function Dr(e,t={}){let{tag:r,is:i}=e,n=document.createElement(r,{is:i});return n.setAttribute("is",i),Object.assign(n.dataset,ls(t)),n}function Br(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,ls(t)),e):null}var lh="download",hh="upgrade",Ye,Zt=class Zt extends HTMLAnchorElement{constructor(){super();D(this,Ye);f(this,"masElement",new Tt(this));this.handleClick=this.handleClick.bind(this)}attributeChangedCallback(r,i,n){this.masElement.attributeChangedCallback(r,i,n)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}requestUpdate(r=!1){return this.masElement.requestUpdate(r)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}static createCheckoutLink(r={},i=""){let n=q();if(!n)return null;let{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:h,perpetual:d,promotionCode:u,quantity:m,wcsOsi:p,extraOptions:g}=n.collectCheckoutOptions(r),S=Dr(Zt,{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:h,perpetual:d,promotionCode:u,quantity:m,wcsOsi:p,extraOptions:g});return i&&(S.innerHTML=`<span>${i}</span>`),S}get isCheckoutLink(){return!0}handleClick(r){var i;if(r.target!==this){r.preventDefault(),r.stopImmediatePropagation(),this.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window}));return}(i=L(this,Ye))==null||i.call(this,r)}async render(r={}){if(!this.isConnected)return!1;let i=q();if(!i)return!1;this.dataset.imsCountry||i.imsCountryPromise.then(h=>{h&&(this.dataset.imsCountry=h)},bt),r.imsCountry=null;let n=i.collectCheckoutOptions(r,this);if(!n.wcsOsi.length)return!1;let a;try{a=JSON.parse(n.extraOptions??"{}")}catch(h){this.masElement.log?.error("cannot parse exta checkout options",h)}let o=this.masElement.togglePending(n);this.href="";let s=i.resolveOfferSelectors(n),c=await Promise.all(s);c=c.map(h=>qt(h,n)),n.country=this.dataset.imsCountry||n.country;let l=await i.buildCheckoutAction?.(c.flat(),{...a,...n},this);return this.renderOffers(c.flat(),n,{},l,o)}renderOffers(r,i,n={},a=void 0,o=void 0){if(!this.isConnected)return!1;let s=q();if(!s)return!1;if(i={...JSON.parse(this.dataset.extraOptions??"null"),...i,...n},o??(o=this.masElement.togglePending(i)),L(this,Ye)&&F(this,Ye,void 0),a){this.classList.remove(lh,hh),this.masElement.toggleResolved(o,r,i);let{url:l,text:h,className:d,handler:u}=a;return l&&(this.href=l),h&&(this.firstElementChild.innerHTML=h),d&&this.classList.add(...d.split(" ")),u&&(this.setAttribute("href","#"),F(this,Ye,u.bind(this))),!0}else if(r.length){if(this.masElement.toggleResolved(o,r,i)){let l=s.buildCheckoutURL(r,i);return this.setAttribute("href",l),!0}}else{let l=new Error(`Not provided: ${i?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(o,l,i))return this.setAttribute("href","#"),!0}}updateOptions(r={}){let i=q();if(!i)return!1;let{checkoutMarketSegment:n,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:c,modal:l,perpetual:h,promotionCode:d,quantity:u,wcsOsi:m}=i.collectCheckoutOptions(r);return Br(this,{checkoutMarketSegment:n,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:c,modal:l,perpetual:h,promotionCode:d,quantity:u,wcsOsi:m}),!0}};Ye=new WeakMap,f(Zt,"is","checkout-link"),f(Zt,"tag","a");var ie=Zt;window.customElements.get(ie.is)||window.customElements.define(ie.is,ie,{extends:ie.tag});function hs({providers:e,settings:t}){function r(a,o){let{checkoutClientId:s,checkoutWorkflow:c,checkoutWorkflowStep:l,country:h,language:d,promotionCode:u,quantity:m}=t,{checkoutMarketSegment:p,checkoutWorkflow:g=c,checkoutWorkflowStep:S=l,imsCountry:w,country:b=w??h,language:T=d,quantity:N=m,entitlement:R,upgrade:V,modal:H,perpetual:ae,promotionCode:Xe=u,wcsOsi:_e,extraOptions:We,...J}=Object.assign({},o?.dataset??{},a??{}),ge=ye(g,te,_.checkoutWorkflow),oe=re.CHECKOUT;ge===te.V3&&(oe=ye(S,re,_.checkoutWorkflowStep));let Q=At({...J,extraOptions:We,checkoutClientId:s,checkoutMarketSegment:p,country:b,quantity:St(N,_.quantity),checkoutWorkflow:ge,checkoutWorkflowStep:oe,language:T,entitlement:y(R),upgrade:y(V),modal:y(H),perpetual:y(ae),promotionCode:Bt(Xe).effectivePromoCode,wcsOsi:Hr(_e)});if(o)for(let we of e.checkout)we(o,Q);return Q}function i(a,o){if(!Array.isArray(a)||!a.length||!o)return"";let{env:s,landscape:c}=t,{checkoutClientId:l,checkoutMarketSegment:h,checkoutWorkflow:d,checkoutWorkflowStep:u,country:m,promotionCode:p,quantity:g,...S}=r(o),w=window.frameElement?"if":"fp",b={checkoutPromoCode:p,clientId:l,context:w,country:m,env:s,items:[],marketSegment:h,workflowStep:u,landscape:c,...S};if(a.length===1){let[{offerId:T,offerType:N,productArrangementCode:R}]=a,{marketSegments:[V]}=a[0];Object.assign(b,{marketSegment:V,offerType:N,productArrangementCode:R}),b.items.push(g[0]===1?{id:T}:{id:T,quantity:g[0]})}else b.items.push(...a.map(({offerId:T},N)=>({id:T,quantity:g[N]??_.quantity})));return Ji(d,b)}let{createCheckoutLink:n}=ie;return{CheckoutLink:ie,CheckoutWorkflow:te,CheckoutWorkflowStep:re,buildCheckoutURL:i,collectCheckoutOptions:r,createCheckoutLink:n}}function dh({interval:e=200,maxAttempts:t=25}={}){let r=X.module("ims");return new Promise(i=>{r.debug("Waing for IMS to be ready");let n=0;function a(){window.adobeIMS?.initialized?i():++n>t?(r.debug("Timeout"),i()):setTimeout(a,e)}a()})}function uh(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function mh(e){let t=X.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:i})=>(t.debug("Got user country:",i),i),i=>{t.error("Unable to get user country:",i)}):null)}function ds({}){let e=dh(),t=uh(e),r=mh(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}async function ms(e,t){let{data:r}=t||await Promise.resolve().then(()=>ks(us(),1));if(Array.isArray(r)){let i=a=>r.find(o=>yr(o.lang,a)),n=i(e.language)??i(_.language);if(n)return Object.freeze(n)}return{}}var ps=["GB_en","AU_en","FR_fr","AT_de","BE_en","BE_fr","BE_nl","BG_bg","CH_de","CH_fr","CH_it","CZ_cs","DE_de","DK_da","EE_et","EG_ar","EG_en","ES_es","FI_fi","FR_fr","GR_el","GR_en","HU_hu","IE_en","IT_it","LU_de","LU_en","LU_fr","NL_nl","NO_nb","PL_pl","PT_pt","RO_ro","SE_sv","SI_sl","SK_sk","TR_tr","UA_uk","ID_en","ID_in","IN_en","IN_hi","JP_ja","MY_en","MY_ms","NZ_en","TH_en","TH_th"],fh={INDIVIDUAL_COM:["ZA_en","LT_lt","LV_lv","NG_en","SA_ar","SA_en","ZA_en","SG_en","KR_ko"],TEAM_COM:["ZA_en","LT_lt","LV_lv","NG_en","ZA_en","CO_es","KR_ko"],INDIVIDUAL_EDU:["LT_lt","LV_lv","SA_en","SG_en"],TEAM_EDU:["SG_en","KR_ko"]},Jt=class Jt extends HTMLSpanElement{constructor(){super();f(this,"masElement",new Tt(this));this.handleClick=this.handleClick.bind(this)}static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-perpetual","data-promotion-code","data-tax-exclusive","data-template","data-wcs-osi"]}static createInlinePrice(r){let i=q();if(!i)return null;let{displayOldPrice:n,displayPerUnit:a,displayRecurrence:o,displayTax:s,forceTaxExclusive:c,perpetual:l,promotionCode:h,quantity:d,template:u,wcsOsi:m}=i.collectPriceOptions(r);return Dr(Jt,{displayOldPrice:n,displayPerUnit:a,displayRecurrence:o,displayTax:s,forceTaxExclusive:c,perpetual:l,promotionCode:h,quantity:d,template:u,wcsOsi:m})}get isInlinePrice(){return!0}attributeChangedCallback(r,i,n){this.masElement.attributeChangedCallback(r,i,n)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}handleClick(r){r.target!==this&&(r.stopImmediatePropagation(),this.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})))}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}requestUpdate(r=!1){return this.masElement.requestUpdate(r)}resolveDisplayTaxForGeoAndSegment(r,i,n,a){let o=`${r}_${i}`;if(ps.includes(r)||ps.includes(o))return!0;let s=fh[`${n}_${a}`];return s?!!(s.includes(r)||s.includes(o)):!1}async resolveDisplayTax(r,i){let[n]=await r.resolveOfferSelectors(i),a=qt(await n,i);if(a?.length){let{country:o,language:s}=i,c=a[0],[l=""]=c.marketSegments;return this.resolveDisplayTaxForGeoAndSegment(o,s,c.customerSegment,l)}}async render(r={}){if(!this.isConnected)return!1;let i=q();if(!i)return!1;let n=i.collectPriceOptions(r,this);if(!n.wcsOsi.length)return!1;let a=this.masElement.togglePending(n);this.innerHTML="";let[o]=i.resolveOfferSelectors(n);return this.renderOffers(qt(await o,n),n,a)}renderOffers(r,i={},n=void 0){if(!this.isConnected)return;let a=q();if(!a)return!1;let o=a.collectPriceOptions({...this.dataset,...i},this);if(n??(n=this.masElement.togglePending(o)),r.length){if(this.masElement.toggleResolved(n,r,o))return this.innerHTML=a.buildPriceHTML(r,o),!0}else{let s=new Error(`Not provided: ${o?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(n,s,o))return this.innerHTML="",!0}return!1}updateOptions(r){let i=q();if(!i)return!1;let{displayOldPrice:n,displayPerUnit:a,displayRecurrence:o,displayTax:s,forceTaxExclusive:c,perpetual:l,promotionCode:h,quantity:d,template:u,wcsOsi:m}=i.collectPriceOptions(r);return Br(this,{displayOldPrice:n,displayPerUnit:a,displayRecurrence:o,displayTax:s,forceTaxExclusive:c,perpetual:l,promotionCode:h,quantity:d,template:u,wcsOsi:m}),!0}};f(Jt,"is","inline-price"),f(Jt,"tag","span");var ne=Jt;window.customElements.get(ne.is)||window.customElements.define(ne.is,ne,{extends:ne.tag});function fs({literals:e,providers:t,settings:r}){function i(o,s){let{country:c,displayOldPrice:l,displayPerUnit:h,displayRecurrence:d,displayTax:u,forceTaxExclusive:m,language:p,promotionCode:g,quantity:S}=r,{displayOldPrice:w=l,displayPerUnit:b=h,displayRecurrence:T=d,displayTax:N=u,forceTaxExclusive:R=m,country:V=c,language:H=p,perpetual:ae,promotionCode:Xe=g,quantity:_e=S,template:We,wcsOsi:J,...ge}=Object.assign({},s?.dataset??{},o??{}),oe=At({...ge,country:V,displayOldPrice:y(w),displayPerUnit:y(b),displayRecurrence:y(T),displayTax:y(N),forceTaxExclusive:y(R),language:H,perpetual:y(ae),promotionCode:Bt(Xe).effectivePromoCode,quantity:St(_e,_.quantity),template:We,wcsOsi:Hr(J)});if(s)for(let Q of t.price)Q(s,oe);return oe}function n(o,s){if(!Array.isArray(o)||!o.length||!s)return"";let{template:c}=s,l;switch(c){case"discount":l=Mn;break;case"strikethrough":l=kn;break;case"optical":l=Nn;break;case"annual":l=On;break;default:s.country==="AU"&&o[0].planType==="ABM"?l=s.promotionCode?Vn:Rn:l=s.promotionCode?In:Cn}let h=i(s);h.literals=Object.assign({},e.price,At(s.literals??{}));let[d]=o;return d={...d,...d.priceDetails},l(h,d)}let a=ne.createInlinePrice;return{InlinePrice:ne,buildPriceHTML:n,collectPriceOptions:i,createInlinePrice:a}}function gs({settings:e}){let t=X.module("wcs"),{env:r,wcsApiKey:i}=e,n=new Map,a=new Map,o;async function s(d,u,m=!0){let p=Ii;t.debug("Fetching:",d);let g="",S,w=(b,T,N)=>`${b}: ${T?.status}, url: ${N.toString()}`;try{if(d.offerSelectorIds=d.offerSelectorIds.sort(),g=new URL(e.wcsURL),g.searchParams.set("offer_selector_ids",d.offerSelectorIds.join(",")),g.searchParams.set("country",d.country),g.searchParams.set("locale",d.locale),g.searchParams.set("landscape",r===je.STAGE?"ALL":e.landscape),g.searchParams.set("api_key",i),d.language&&g.searchParams.set("language",d.language),d.promotionCode&&g.searchParams.set("promotion_code",d.promotionCode),d.currency&&g.searchParams.set("currency",d.currency),S=await fetch(g.toString(),{credentials:"omit"}),S.ok){let b=await S.json();t.debug("Fetched:",d,b);let T=b.resolvedOffers??[];T=T.map(wr),u.forEach(({resolve:N},R)=>{let V=T.filter(({offerSelectorIds:H})=>H.includes(R)).flat();V.length&&(u.delete(R),N(V))})}else S.status===404&&d.offerSelectorIds.length>1?(t.debug("Multi-osi 404, fallback to fetch-by-one strategy"),await Promise.allSettled(d.offerSelectorIds.map(b=>s({...d,offerSelectorIds:[b]},u,!1)))):p=xr}catch(b){p=xr,t.error(p,d,b)}m&&u.size&&(t.debug("Missing:",{offerSelectorIds:[...u.keys()]}),u.forEach(b=>{b.reject(new Error(w(p,S,g)))}))}function c(){clearTimeout(o);let d=[...a.values()];a.clear(),d.forEach(({options:u,promises:m})=>s(u,m))}function l(){let d=n.size;n.clear(),t.debug(`Flushed ${d} cache entries`)}function h({country:d,language:u,perpetual:m=!1,promotionCode:p="",wcsOsi:g=[]}){let S=`${u}_${d}`;d!=="GB"&&(u=m?"EN":"MULT");let w=[d,u,p].filter(b=>b).join("-").toLowerCase();return g.map(b=>{let T=`${b}-${w}`;if(!n.has(T)){let N=new Promise((R,V)=>{let H=a.get(w);if(!H){let ae={country:d,locale:S,offerSelectorIds:[]};d!=="GB"&&(ae.language=u),H={options:ae,promises:new Map},a.set(w,H)}p&&(H.options.promotionCode=p),H.options.offerSelectorIds.push(b),H.promises.set(b,{resolve:R,reject:V}),H.options.offerSelectorIds.length>=e.wcsBufferLimit?c():(t.debug("Queued:",H.options),o||(o=setTimeout(c,e.wcsBufferDelay)))});n.set(T,N)}return n.get(T)})}return{WcsCommitment:$n,WcsPlanType:Hn,WcsTerm:Un,resolveOfferSelectors:h,flushWcsCache:l}}var Kn="mas-commerce-service",zr,xs,Gr=class extends HTMLElement{constructor(){super(...arguments);D(this,zr);f(this,"promise",null)}async registerCheckoutAction(r){typeof r=="function"&&(this.buildCheckoutAction=async(i,n,a)=>{let o=await r?.(i,n,this.imsSignedInPromise,a);return o||null})}async activate(){let r=L(this,zr,xs),i=Object.freeze(Bn(r));ft(r.lana);let n=X.init(r.hostEnv).module("service");n.debug("Activating:",r);let a={price:{}};try{a.price=await ms(i,r.commerce.priceLiterals)}catch{}let o={checkout:new Set,price:new Set},s={literals:a,providers:o,settings:i};Object.defineProperties(this,Object.getOwnPropertyDescriptors({...hs(s),...ds(s),...fs(s),...gs(s),...Ui,Log:X,get defaults(){return _},get log(){return X},get providers(){return{checkout(c){return o.checkout.add(c),()=>o.checkout.delete(c)},price(c){return o.price.add(c),()=>o.price.delete(c)}}},get settings(){return i}})),n.debug("Activated:",{literals:a,settings:i}),Le(()=>{let c=new CustomEvent(nt,{bubbles:!0,cancelable:!1,detail:this});this.dispatchEvent(c)})}connectedCallback(){this.readyPromise||(this.readyPromise=this.activate())}disconnectedCallback(){this.readyPromise=null}flushWcsCache(){this.flushWcsCache(),this.log.debug("Flushed WCS cache")}refreshOffers(){this.flushWcsCache(),document.querySelectorAll('span[is="inline-price"],a[is="checkout-link"]').forEach(r=>r.requestUpdate(!0)),this.log.debug("Refreshed WCS offers")}refreshFragments(){this.flushWcsCache(),document.querySelectorAll("aem-fragment").forEach(r=>r.refresh()),this.log.debug("Refreshed AEM fragments")}};zr=new WeakSet,xs=function(){let r={hostEnv:{name:this.getAttribute("host-env")??"prod"},commerce:{env:this.getAttribute("env")},lana:{tags:this.getAttribute("lana-tags"),sampleRate:parseInt(this.getAttribute("lana-sample-rate"),10),isProdDomain:this.getAttribute("host-env")==="prod"}};return["locale","country","language"].forEach(i=>{let n=this.getAttribute(i);n&&(r[i]=n)}),["checkout-workflow-step","force-tax-exclusive","checkout-client-id","allow-override","wcs-api-key"].forEach(i=>{let n=this.getAttribute(i);if(n!=null){let a=i.replace(/-([a-z])/g,o=>o[1].toUpperCase());r.commerce[a]=n}}),r},f(Gr,"instance");window.customElements.get(Kn)||window.customElements.define(Kn,Gr);ft({sampleRate:1});export{ie as CheckoutLink,te as CheckoutWorkflow,re as CheckoutWorkflowStep,_ as Defaults,ne as InlinePrice,He as Landscape,X as Log,Kn as TAG_NAME_SERVICE,$n as WcsCommitment,Hn as WcsPlanType,Un as WcsTerm,wr as applyPlanType,Bn as getSettings};
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
