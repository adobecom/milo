var Ds=Object.create;var ar=Object.defineProperty;var Gs=Object.getOwnPropertyDescriptor;var Hs=Object.getOwnPropertyNames;var zs=Object.getPrototypeOf,Fs=Object.prototype.hasOwnProperty;var Bs=(e,t,r)=>t in e?ar(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var Ks=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),js=(e,t)=>{for(var r in t)ar(e,r,{get:t[r],enumerable:!0})},Ys=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Hs(t))!Fs.call(e,i)&&i!==r&&ar(e,i,{get:()=>t[i],enumerable:!(n=Gs(t,i))||n.enumerable});return e};var Xs=(e,t,r)=>(r=e!=null?Ds(zs(e)):{},Ys(t||!e||!e.__esModule?ar(r,"default",{value:e,enumerable:!0}):r,e));var p=(e,t,r)=>(Bs(e,typeof t!="symbol"?t+"":t,r),r),nn=(e,t,r)=>{if(!t.has(e))throw TypeError("Cannot "+r)};var _=(e,t,r)=>(nn(e,t,"read from private field"),r?r.call(e):t.get(e)),M=(e,t,r)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,r)},K=(e,t,r,n)=>(nn(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r);var fe=(e,t,r)=>(nn(e,t,"access private method"),r);var Ps=Ks((Jf,Oh)=>{Oh.exports={total:38,offset:0,limit:38,data:[{lang:"ar",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u0627\u0644\u0634\u0647\u0631} YEAR {/\u0627\u0644\u0639\u0627\u0645} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u0643\u0644 \u0634\u0647\u0631} YEAR {\u0643\u0644 \u0639\u0627\u0645} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0644\u0643\u0644 \u062A\u0631\u062E\u064A\u0635} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0644\u0643\u0644 \u062A\u0631\u062E\u064A\u0635} other {}}",freeLabel:"\u0645\u062C\u0627\u0646\u064B\u0627",freeAriaLabel:"\u0645\u062C\u0627\u0646\u064B\u0627",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u0623\u0648 \u0628\u062F\u0644\u0627\u064B \u0645\u0646 \u0630\u0644\u0643 \u0628\u0642\u064A\u0645\u0629 {alternativePrice}",strikethroughAriaLabel:"\u0628\u0634\u0643\u0644 \u0645\u0646\u062A\u0638\u0645 \u0628\u0642\u064A\u0645\u0629 {strikethroughPrice}"},{lang:"bg",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u043C\u0435\u0441.} YEAR {/\u0433\u043E\u0434.} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u043D\u0430 \u043C\u0435\u0441\u0435\u0446} YEAR {\u043D\u0430 \u0433\u043E\u0434\u0438\u043D\u0430} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u043D\u0430 \u043B\u0438\u0446\u0435\u043D\u0437} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u043D\u0430 \u043B\u0438\u0446\u0435\u043D\u0437} other {}}",freeLabel:"\u0411\u0435\u0437\u043F\u043B\u0430\u0442\u043D\u043E",freeAriaLabel:"\u0411\u0435\u0437\u043F\u043B\u0430\u0442\u043D\u043E",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u0410\u043B\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u043E \u043D\u0430 {alternativePrice}",strikethroughAriaLabel:"\u0420\u0435\u0434\u043E\u0432\u043D\u043E \u043D\u0430 {strikethroughPrice}"},{lang:"cs",recurrenceLabel:"{recurrenceTerm, select, MONTH {/m\u011Bs\xEDc} YEAR {/rok} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {za m\u011Bs\xEDc} YEAR {za rok} other {}}",perUnitLabel:"{perUnit, select, LICENSE {za licenci} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {za licenci} other {}}",freeLabel:"Zdarma",freeAriaLabel:"Zdarma",taxExclusiveLabel:"{taxTerm, select, GST {bez dan\u011B ze zbo\u017E\xED a slu\u017Eeb} VAT {bez DPH} TAX {bez dan\u011B} IVA {bez IVA} SST {bez SST} KDV {bez KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {v\u010Detn\u011B dan\u011B ze zbo\u017E\xED a slu\u017Eeb} VAT {v\u010Detn\u011B DPH} TAX {v\u010Detn\u011B dan\u011B} IVA {v\u010Detn\u011B IVA} SST {v\u010Detn\u011B SST} KDV {v\u010Detn\u011B KDV} other {}}",alternativePriceAriaLabel:"P\u0159\xEDpadn\u011B za {alternativePrice}",strikethroughAriaLabel:"Pravideln\u011B za {strikethroughPrice}"},{lang:"da",recurrenceLabel:"{recurrenceTerm, select, MONTH {/md} YEAR {/\xE5r} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {pr. m\xE5ned} YEAR {pr. \xE5r} other {}}",perUnitLabel:"{perUnit, select, LICENSE {pr. licens} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {pr. licens} other {}}",freeLabel:"Gratis",freeAriaLabel:"Gratis",taxExclusiveLabel:"{taxTerm, select, GST {ekskl. GST} VAT {ekskl. moms} TAX {ekskl. skat} IVA {ekskl. IVA} SST {ekskl. SST} KDV {ekskl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. skat} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativt til {alternativePrice}",strikethroughAriaLabel:"Normalpris {strikethroughPrice}"},{lang:"de",recurrenceLabel:"{recurrenceTerm, select, MONTH {/Monat} YEAR {/Jahr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {pro Monat} YEAR {pro Jahr} other {}}",perUnitLabel:"{perUnit, select, LICENSE {pro Lizenz} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {pro Lizenz} other {}}",freeLabel:"Kostenlos",freeAriaLabel:"Kostenlos",taxExclusiveLabel:"{taxTerm, select, GST {zzgl. GST} VAT {zzgl. MwSt.} TAX {zzgl. Steuern} IVA {zzgl. IVA} SST {zzgl. SST} KDV {zzgl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. MwSt.} TAX {inkl. Steuern} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativ: {alternativePrice}",strikethroughAriaLabel:"Regul\xE4r: {strikethroughPrice}"},{lang:"en",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at {alternativePrice}",strikethroughAriaLabel:"Regularly at {strikethroughPrice}"},{lang:"et",recurrenceLabel:"{recurrenceTerm, select, MONTH {kuus} YEAR {aastas} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {kuus} YEAR {aastas} other {}}",perUnitLabel:"{perUnit, select, LICENSE {litsentsi kohta} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {litsentsi kohta} other {}}",freeLabel:"Tasuta",freeAriaLabel:"Tasuta",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Teise v\xF5imalusena hinnaga {alternativePrice}",strikethroughAriaLabel:"Tavahind {strikethroughPrice}"},{lang:"fi",recurrenceLabel:"{recurrenceTerm, select, MONTH {/kk} YEAR {/v} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {kuukausittain} YEAR {vuosittain} other {}}",perUnitLabel:"{perUnit, select, LICENSE {k\xE4ytt\xF6oikeutta kohti} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {k\xE4ytt\xF6oikeutta kohti} other {}}",freeLabel:"Maksuton",freeAriaLabel:"Maksuton",taxExclusiveLabel:"{taxTerm, select, GST {ilman GST:t\xE4} VAT {ilman ALV:t\xE4} TAX {ilman veroja} IVA {ilman IVA:ta} SST {ilman SST:t\xE4} KDV {ilman KDV:t\xE4} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {sis. GST:n} VAT {sis. ALV:n} TAX {sis. verot} IVA {sis. IVA:n} SST {sis. SST:n} KDV {sis. KDV:n} other {}}",alternativePriceAriaLabel:"Vaihtoehtoisesti hintaan {alternativePrice}",strikethroughAriaLabel:"S\xE4\xE4nn\xF6llisesti hintaan {strikethroughPrice}"},{lang:"fr",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mois} YEAR {/an} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {par mois} YEAR {par an} other {}}",perUnitLabel:"{perUnit, select, LICENSE {par licence} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {par licence} other {}}",freeLabel:"Gratuit",freeAriaLabel:"Gratuit",taxExclusiveLabel:"{taxTerm, select, GST {hors TPS} VAT {hors TVA} TAX {hors taxes} IVA {hors IVA} SST {hors SST} KDV {hors KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {TPS comprise} VAT {TVA comprise} TAX {taxes comprises} IVA {IVA comprise} SST {SST comprise} KDV {KDV comprise} other {}}",alternativePriceAriaLabel:"Autre prix {alternativePrice}",strikethroughAriaLabel:"Prix habituel {strikethroughPrice}"},{lang:"he",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u05D7\u05D5\u05D3\u05E9} YEAR {/\u05E9\u05E0\u05D4} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u05DC\u05D7\u05D5\u05D3\u05E9} YEAR {\u05DC\u05E9\u05E0\u05D4} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",freeLabel:"\u05D7\u05D9\u05E0\u05DD",freeAriaLabel:"\u05D7\u05D9\u05E0\u05DD",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u05DC\u05D7\u05DC\u05D5\u05E4\u05D9\u05DF \u05D1-{alternativePrice}",strikethroughAriaLabel:"\u05D1\u05D0\u05D5\u05E4\u05DF \u05E7\u05D1\u05D5\u05E2 \u05D1-{strikethroughPrice}"},{lang:"hu",recurrenceLabel:"{recurrenceTerm, select, MONTH {/h\xF3} YEAR {/\xE9v} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {havonta} YEAR {\xE9vente} other {}}",perUnitLabel:"{perUnit, select, LICENSE {licencenk\xE9nt} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {licencenk\xE9nt} other {}}",freeLabel:"Ingyenes",freeAriaLabel:"Ingyenes",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"M\xE1sik lehet\u0151s\xE9g: {alternativePrice}",strikethroughAriaLabel:"\xC1ltal\xE1ban {strikethroughPrice} \xE1ron"},{lang:"it",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mese} YEAR {/anno} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {al mese} YEAR {all'anno} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per licenza} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per licenza} other {}}",freeLabel:"Gratuito",freeAriaLabel:"Gratuito",taxExclusiveLabel:"{taxTerm, select, GST {escl. GST} VAT {escl. IVA.} TAX {escl. imposte} IVA {escl. IVA} SST {escl. SST} KDV {escl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. IVA} TAX {incl. imposte} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"In alternativa a {alternativePrice}",strikethroughAriaLabel:"Regolarmente a {strikethroughPrice}"},{lang:"ja",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u6BCE\u6708} YEAR {\u6BCE\u5E74} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u30E9\u30A4\u30BB\u30F3\u30B9\u3054\u3068} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u30E9\u30A4\u30BB\u30F3\u30B9\u3054\u3068} other {}}",freeLabel:"\u7121\u6599",freeAriaLabel:"\u7121\u6599",taxExclusiveLabel:"{taxTerm, select, GST {GST \u5225} VAT {VAT \u5225} TAX {\u7A0E\u5225} IVA {IVA \u5225} SST {SST \u5225} KDV {KDV \u5225} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST \u8FBC} VAT {VAT \u8FBC} TAX {\u7A0E\u8FBC} IVA {IVA \u8FBC} SST {SST \u8FBC} KDV {KDV \u8FBC} other {}}",alternativePriceAriaLabel:"\u7279\u5225\u4FA1\u683C : {alternativePrice}",strikethroughAriaLabel:"\u901A\u5E38\u4FA1\u683C : {strikethroughPrice}"},{lang:"ko",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\uC6D4} YEAR {/\uB144} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\uC6D4\uAC04} YEAR {\uC5F0\uAC04} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\uB77C\uC774\uC120\uC2A4\uB2F9} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\uB77C\uC774\uC120\uC2A4\uB2F9} other {}}",freeLabel:"\uBB34\uB8CC",freeAriaLabel:"\uBB34\uB8CC",taxExclusiveLabel:"{taxTerm, select, GST {GST \uC81C\uC678} VAT {VAT \uC81C\uC678} TAX {\uC138\uAE08 \uC81C\uC678} IVA {IVA \uC81C\uC678} SST {SST \uC81C\uC678} KDV {KDV \uC81C\uC678} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST \uD3EC\uD568} VAT {VAT \uD3EC\uD568} TAX {\uC138\uAE08 \uD3EC\uD568} IVA {IVA \uD3EC\uD568} SST {SST \uD3EC\uD568} KDV {KDV \uD3EC\uD568} other {}}",alternativePriceAriaLabel:"\uB610\uB294 {alternativePrice}\uC5D0",strikethroughAriaLabel:"\uB610\uB294 {alternativePrice}\uC5D0"},{lang:"lt",recurrenceLabel:"{recurrenceTerm, select, MONTH { per m\u0117n.} YEAR { per metus} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per m\u0117n.} YEAR {per metus} other {}}",perUnitLabel:"{perUnit, select, LICENSE {u\u017E licencij\u0105} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {u\u017E licencij\u0105} other {}}",freeLabel:"Nemokamai",freeAriaLabel:"Nemokamai",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Arba u\u017E {alternativePrice}",strikethroughAriaLabel:"Normaliai u\u017E {strikethroughPrice}"},{lang:"lv",recurrenceLabel:"{recurrenceTerm, select, MONTH {m\u0113nes\u012B} YEAR {gad\u0101} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {m\u0113nes\u012B} YEAR {gad\u0101} other {}}",perUnitLabel:"{perUnit, select, LICENSE {vienai licencei} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {vienai licencei} other {}}",freeLabel:"Bezmaksas",freeAriaLabel:"Bezmaksas",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternat\u012Bvi par {alternativePrice}",strikethroughAriaLabel:"Regul\u0101ri par {strikethroughPrice}"},{lang:"nb",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mnd.} YEAR {/\xE5r} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per m\xE5ned} YEAR {per \xE5r} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per lisens} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per lisens} other {}}",freeLabel:"Fri",freeAriaLabel:"Fri",taxExclusiveLabel:"{taxTerm, select, GST {ekskl. GST} VAT {ekskl. moms} TAX {ekskl. avgift} IVA {ekskl. IVA} SST {ekskl. SST} KDV {ekskl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. avgift} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativt til {alternativePrice}",strikethroughAriaLabel:"Regelmessig til {strikethroughPrice}"},{lang:"nl",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mnd} YEAR {/jr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per maand} YEAR {per jaar} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per licentie} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per licentie} other {}}",freeLabel:"Gratis",freeAriaLabel:"Gratis",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. btw} TAX {excl. belasting} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. btw} TAX {incl. belasting} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Nu {alternativePrice}",strikethroughAriaLabel:"Normaal {strikethroughPrice}"},{lang:"pl",recurrenceLabel:"{recurrenceTerm, select, MONTH { / mies.} YEAR { / rok} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH { / miesi\u0105c} YEAR { / rok} other {}}",perUnitLabel:"{perUnit, select, LICENSE {za licencj\u0119} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {za licencj\u0119} other {}}",freeLabel:"Bezp\u0142atne",freeAriaLabel:"Bezp\u0142atne",taxExclusiveLabel:"{taxTerm, select, GST {bez GST} VAT {bez VAT} TAX {netto} IVA {bez IVA} SST {bez SST} KDV {bez KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {z GST} VAT {z VAT} TAX {brutto} IVA {z IVA} SST {z SST} KDV {z KDV} other {}}",alternativePriceAriaLabel:"Lub za {alternativePrice}",strikethroughAriaLabel:"Cena zwyk\u0142a: {strikethroughPrice}"},{lang:"pt",recurrenceLabel:"{recurrenceTerm, select, MONTH {/m\xEAs} YEAR {/ano} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {por m\xEAs} YEAR {por ano} other {}}",perUnitLabel:"{perUnit, select, LICENSE {por licen\xE7a} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {por licen\xE7a} other {}}",freeLabel:"Gratuito",freeAriaLabel:"Gratuito",taxExclusiveLabel:"{taxTerm, select, GST {ICMS n\xE3o incluso} VAT {IVA n\xE3o incluso} TAX {impostos n\xE3o inclusos} IVA {IVA n\xE3o incluso} SST { SST n\xE3o incluso} KDV {KDV n\xE3o incluso} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {ICMS incluso} VAT {IVA incluso} TAX {impostos inclusos} IVA {IVA incluso} SST {SST incluso} KDV {KDV incluso} other {}}",alternativePriceAriaLabel:"Ou a {alternativePrice}",strikethroughAriaLabel:"Pre\xE7o normal: {strikethroughPrice}"},{lang:"ro",recurrenceLabel:"{recurrenceTerm, select, MONTH {/lun\u0103} YEAR {/an} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {pe lun\u0103} YEAR {pe an} other {}}",perUnitLabel:"{perUnit, select, LICENSE {pe licen\u021B\u0103} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {pe licen\u021B\u0103} other {}}",freeLabel:"Gratuit",freeAriaLabel:"Gratuit",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternativ, la {alternativePrice}",strikethroughAriaLabel:"\xCEn mod normal, la {strikethroughPrice}"},{lang:"ru",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u043C\u0435\u0441.} YEAR {/\u0433.} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u0432 \u043C\u0435\u0441\u044F\u0446} YEAR {\u0432 \u0433\u043E\u0434} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u044E} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0438\u0446\u0435\u043D\u0437\u0438\u044E} other {}}",freeLabel:"\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E",freeAriaLabel:"\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E",taxExclusiveLabel:"{taxTerm, select, GST {\u0438\u0441\u043A\u043B. \u043D\u0430\u043B\u043E\u0433 \u043D\u0430 \u0442\u043E\u0432\u0430\u0440\u044B \u0438 \u0443\u0441\u043B\u0443\u0433\u0438} VAT {\u0438\u0441\u043A\u043B. \u041D\u0414\u0421} TAX {\u0438\u0441\u043A\u043B. \u043D\u0430\u043B\u043E\u0433} IVA {\u0438\u0441\u043A\u043B. \u0418\u0412\u0410} SST {\u0438\u0441\u043A\u043B. SST} KDV {\u0438\u0441\u043A\u043B. \u041A\u0414\u0412} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u0432\u043A\u043B. \u043D\u0430\u043B\u043E\u0433 \u043D\u0430 \u0442\u043E\u0432\u0430\u0440\u044B \u0438 \u0443\u0441\u043B\u0443\u0433\u0438} VAT {\u0432\u043A\u043B. \u041D\u0414\u0421} TAX {\u0432\u043A\u043B. \u043D\u0430\u043B\u043E\u0433} IVA {\u0432\u043A\u043B. \u0418\u0412\u0410} SST {\u0432\u043A\u043B. SST} KDV {\u0432\u043A\u043B. \u041A\u0414\u0412} other {}}",alternativePriceAriaLabel:"\u0410\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442 \u0437\u0430 {alternativePrice}",strikethroughAriaLabel:"\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E \u043F\u043E \u0446\u0435\u043D\u0435 {strikethroughPrice}"},{lang:"sk",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mesiac} YEAR {/rok} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {za mesiac} YEAR {za rok} other {}}",perUnitLabel:"{perUnit, select, LICENSE {za licenciu} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {za licenciu} other {}}",freeLabel:"Zadarmo",freeAriaLabel:"Zadarmo",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Pr\xEDpadne za {alternativePrice}",strikethroughAriaLabel:"Pravidelne za {strikethroughPrice}"},{lang:"sl",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mesec} YEAR {/leto} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {na mesec} YEAR {na leto} other {}}",perUnitLabel:"{perUnit, select, LICENSE {na licenco} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {na licenco} other {}}",freeLabel:"Brezpla\u010Dno",freeAriaLabel:"Brezpla\u010Dno",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Druga mo\u017Enost je: {alternativePrice}",strikethroughAriaLabel:"Redno po {strikethroughPrice}"},{lang:"sv",recurrenceLabel:"{recurrenceTerm, select, MONTH {/m\xE5n} YEAR {/\xE5r} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per m\xE5nad} YEAR {per \xE5r} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per licens} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per licens} other {}}",freeLabel:"Kostnadsfritt",freeAriaLabel:"Kostnadsfritt",taxExclusiveLabel:"{taxTerm, select, GST {exkl. GST} VAT {exkl. moms} TAX {exkl. skatt} IVA {exkl. IVA} SST {exkl. SST} KDV {exkl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {inkl. GST} VAT {inkl. moms} TAX {inkl. skatt} IVA {inkl. IVA} SST {inkl. SST} KDV {inkl. KDV} other {}}",alternativePriceAriaLabel:"Alternativt f\xF6r {alternativePrice}",strikethroughAriaLabel:"Normalpris {strikethroughPrice}"},{lang:"tr",recurrenceLabel:"{recurrenceTerm, select, MONTH {/ay} YEAR {/y\u0131l} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {(ayl\u0131k)} YEAR {(y\u0131ll\u0131k)} other {}}",perUnitLabel:"{perUnit, select, LICENSE {(lisans ba\u015F\u0131na)} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {(lisans ba\u015F\u0131na)} other {}}",freeLabel:"\xDCcretsiz",freeAriaLabel:"\xDCcretsiz",taxExclusiveLabel:"{taxTerm, select, GST {GST hari\xE7} VAT {KDV hari\xE7} TAX {vergi hari\xE7} IVA {IVA hari\xE7} SST {SST hari\xE7} KDV {KDV hari\xE7} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST dahil} VAT {KDV dahil} TAX {vergi dahil} IVA {IVA dahil} SST {SST dahil} KDV {KDV dahil} other {}}",alternativePriceAriaLabel:"Ya da {alternativePrice}",strikethroughAriaLabel:"Standart fiyat: {strikethroughPrice}"},{lang:"uk",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u043C\u0456\u0441.} YEAR {/\u0440\u0456\u043A} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u043D\u0430 \u043C\u0456\u0441\u044F\u0446\u044C} YEAR {\u043D\u0430 \u0440\u0456\u043A} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0456\u0446\u0435\u043D\u0437\u0456\u044E} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0437\u0430 \u043B\u0456\u0446\u0435\u043D\u0437\u0456\u044E} other {}}",freeLabel:"\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u043E",freeAriaLabel:"\u0411\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u043E",taxExclusiveLabel:"{taxTerm, select, GST {\u0431\u0435\u0437 GST} VAT {\u0431\u0435\u0437 \u041F\u0414\u0412} TAX {\u0431\u0435\u0437 \u043F\u043E\u0434\u0430\u0442\u043A\u0443} IVA {\u0431\u0435\u0437 IVA} SST {\u0431\u0435\u0437 SST} KDV {\u0431\u0435\u0437 KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 GST} VAT {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 \u041F\u0414\u0412} TAX {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 \u043F\u043E\u0434\u0430\u0442\u043A\u043E\u043C} IVA {\u0440\u0430\u0437\u043E\u043C \u0437 IVA} SST {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 SST} KDV {\u0440\u0430\u0437\u043E\u043C \u0456\u0437 KDV} other {}}",alternativePriceAriaLabel:"\u0410\u0431\u043E \u0437\u0430 {alternativePrice}",strikethroughAriaLabel:"\u0417\u0432\u0438\u0447\u0430\u0439\u043D\u0430 \u0446\u0456\u043D\u0430 {strikethroughPrice}"},{lang:"zh-hans",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u6BCF\u6708} YEAR {\u6BCF\u5E74} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u6BCF\u4E2A\u8BB8\u53EF\u8BC1} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u6BCF\u4E2A\u8BB8\u53EF\u8BC1} other {}}",freeLabel:"\u514D\u8D39",freeAriaLabel:"\u514D\u8D39",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"\u6216\u5B9A\u4EF7 {alternativePrice}",strikethroughAriaLabel:"\u6B63\u5E38\u4EF7 {strikethroughPrice}"},{lang:"zh-hant",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u6708} YEAR {/\u5E74} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u6BCF\u6708} YEAR {\u6BCF\u5E74} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u6BCF\u500B\u6388\u6B0A} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u6BCF\u500B\u6388\u6B0A} other {}}",freeLabel:"\u514D\u8CBB",freeAriaLabel:"\u514D\u8CBB",taxExclusiveLabel:"{taxTerm, select, GST {\u4E0D\u542B GST} VAT {\u4E0D\u542B VAT} TAX {\u4E0D\u542B\u7A05} IVA {\u4E0D\u542B IVA} SST {\u4E0D\u542B SST} KDV {\u4E0D\u542B KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u542B GST} VAT {\u542B VAT} TAX {\u542B\u7A05} IVA {\u542B IVA} SST {\u542B SST} KDV {\u542B KDV} other {}}",alternativePriceAriaLabel:"\u6216\u8005\u5728 {alternativePrice}",strikethroughAriaLabel:"\u6A19\u6E96\u50F9\u683C\u70BA {strikethroughPrice}"},{lang:"es",recurrenceLabel:"{recurrenceTerm, select, MONTH {/mes} YEAR {/a\xF1o} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {al mes} YEAR {al a\xF1o} other {}}",perUnitLabel:"{perUnit, select, LICENSE {por licencia} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {por licencia} other {}}",freeLabel:"Gratuito",freeAriaLabel:"Gratuito",taxExclusiveLabel:"{taxTerm, select, GST {GST no incluido} VAT {IVA no incluido} TAX {Impuestos no incluidos} IVA {IVA no incluido} SST {SST no incluido} KDV {KDV no incluido} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST incluido} VAT {IVA incluido} TAX {Impuestos incluidos} IVA {IVA incluido} SST {SST incluido} KDV {KDV incluido} other {}}",alternativePriceAriaLabel:"Alternativamente por {alternativePrice}",strikethroughAriaLabel:"Normalmente a {strikethroughPrice}"},{lang:"in",recurrenceLabel:"{recurrenceTerm, select, MONTH {/bulan} YEAR {/tahun} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per bulan} YEAR {per tahun} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per lisensi} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per lisensi} other {}}",freeLabel:"Gratis",freeAriaLabel:"Gratis",taxExclusiveLabel:"{taxTerm, select, GST {tidak termasuk PBJ} VAT {tidak termasuk PPN} TAX {tidak termasuk pajak} IVA {tidak termasuk IVA} SST {tidak termasuk SST} KDV {tidak termasuk KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {termasuk PBJ} VAT {termasuk PPN} TAX {termasuk pajak} IVA {termasuk IVA} SST {termasuk SST} KDV {termasuk KDV} other {}}",alternativePriceAriaLabel:"Atau seharga {alternativePrice}",strikethroughAriaLabel:"Normalnya seharga {strikethroughPrice}"},{lang:"vi",recurrenceLabel:"{recurrenceTerm, select, MONTH {/th\xE1ng} YEAR {/n\u0103m} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {m\u1ED7i th\xE1ng} YEAR {m\u1ED7i n\u0103m} other {}}",perUnitLabel:"{perUnit, select, LICENSE {m\u1ED7i gi\u1EA5y ph\xE9p} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {m\u1ED7i gi\u1EA5y ph\xE9p} other {}}",freeLabel:"Mi\u1EC5n ph\xED",freeAriaLabel:"Mi\u1EC5n ph\xED",taxExclusiveLabel:"{taxTerm, select, GST {ch\u01B0a bao g\u1ED3m thu\u1EBF h\xE0ng h\xF3a v\xE0 d\u1ECBch v\u1EE5} VAT {ch\u01B0a bao g\u1ED3m thu\u1EBF GTGT} TAX {ch\u01B0a bao g\u1ED3m thu\u1EBF} IVA {ch\u01B0a bao g\u1ED3m IVA} SST {ch\u01B0a bao g\u1ED3m SST} KDV {ch\u01B0a bao g\u1ED3m KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {(\u0111\xE3 bao g\u1ED3m thu\u1EBF h\xE0ng h\xF3a v\xE0 d\u1ECBch v\u1EE5)} VAT {(\u0111\xE3 bao g\u1ED3m thu\u1EBF GTGT)} TAX {(\u0111\xE3 bao g\u1ED3m thu\u1EBF)} IVA {(\u0111\xE3 bao g\u1ED3m IVA)} SST {(\u0111\xE3 bao g\u1ED3m SST)} KDV {(\u0111\xE3 bao g\u1ED3m KDV)} other {}}",alternativePriceAriaLabel:"Gi\xE1 \u01B0u \u0111\xE3i {alternativePrice}",strikethroughAriaLabel:"Gi\xE1 th\xF4ng th\u01B0\u1EDDng {strikethroughPrice}"},{lang:"th",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u0E40\u0E14\u0E37\u0E2D\u0E19} YEAR {/\u0E1B\u0E35} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u0E15\u0E48\u0E2D\u0E40\u0E14\u0E37\u0E2D\u0E19} YEAR {\u0E15\u0E48\u0E2D\u0E1B\u0E35} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u0E15\u0E48\u0E2D\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u0E15\u0E48\u0E2D\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19} other {}}",freeLabel:"\u0E1F\u0E23\u0E35",freeAriaLabel:"\u0E1F\u0E23\u0E35",taxExclusiveLabel:"{taxTerm, select, GST {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35 GST} VAT {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 VAT} TAX {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35} IVA {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 IVA} SST {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 SST} KDV {\u0E44\u0E21\u0E48\u0E23\u0E27\u0E21 KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35 GST} VAT {\u0E23\u0E27\u0E21 VAT} TAX {\u0E23\u0E27\u0E21\u0E20\u0E32\u0E29\u0E35} IVA {\u0E23\u0E27\u0E21 IVA} SST {\u0E23\u0E27\u0E21 SST} KDV {\u0E23\u0E27\u0E21 KDV} other {}}",alternativePriceAriaLabel:"\u0E23\u0E32\u0E04\u0E32\u0E1E\u0E34\u0E40\u0E28\u0E29 {alternativePrice}",strikethroughAriaLabel:"\u0E23\u0E32\u0E04\u0E32\u0E1B\u0E01\u0E15\u0E34 {strikethroughPrice}"},{lang:"el",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u03BC\u03AE\u03BD\u03B1} YEAR {/\u03AD\u03C4\u03BF\u03C2} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u03BA\u03AC\u03B8\u03B5 \u03BC\u03AE\u03BD\u03B1} YEAR {\u03B1\u03BD\u03AC \u03AD\u03C4\u03BF\u03C2} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u03B1\u03BD\u03AC \u03AC\u03B4\u03B5\u03B9\u03B1 \u03C7\u03C1\u03AE\u03C3\u03B7\u03C2} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u03B1\u03BD\u03AC \u03AC\u03B4\u03B5\u03B9\u03B1 \u03C7\u03C1\u03AE\u03C3\u03B7\u03C2} other {}}",freeLabel:"\u0394\u03C9\u03C1\u03B5\u03AC\u03BD",freeAriaLabel:"\u0394\u03C9\u03C1\u03B5\u03AC\u03BD",taxExclusiveLabel:"{taxTerm, select, GST {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 GST)} VAT {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03A6\u03A0\u0391)} TAX {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C6\u03CC\u03C1\u03BF)} IVA {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 IVA)} SST {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 SST)} KDV {(\u03BC\u03B7 \u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 KDV)} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 GST)} VAT {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03A6\u03A0\u0391)} TAX {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 \u03C6\u03CC\u03C1\u03BF\u03C5)} IVA {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 IVA)} SST {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 SST)} KDV {(\u03C3\u03C5\u03BC\u03C0\u03B5\u03C1\u03B9\u03BB\u03B1\u03BC\u03B2\u03B1\u03BD\u03BF\u03BC\u03AD\u03BD\u03BF\u03C5 \u03C4\u03BF\u03C5 KDV)} other {}}",alternativePriceAriaLabel:"\u0394\u03B9\u03B1\u03C6\u03BF\u03C1\u03B5\u03C4\u03B9\u03BA\u03AC, {alternativePrice}",strikethroughAriaLabel:"\u039A\u03B1\u03BD\u03BF\u03BD\u03B9\u03BA\u03AE \u03C4\u03B9\u03BC\u03AE {strikethroughPrice}"},{lang:"fil",recurrenceLabel:"{recurrenceTerm, select, MONTH {/buwan} YEAR {/taon} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per buwan} YEAR {per taon} other {}}",perUnitLabel:"{perUnit, select, LICENSE {kada lisensya} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {kada lisensya} other {}}",freeLabel:"Libre",freeAriaLabel:"Libre",taxExclusiveLabel:"{taxTerm, select, GST {hindi kasama ang GST} VAT {hindi kasama ang VAT} TAX {hindi kasama ang Buwis} IVA {hindi kasama ang IVA} SST {hindi kasama ang SST} KDV {hindi kasama ang KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {kasama ang GST} VAT {kasama ang VAT} TAX {kasama ang Buwis} IVA {kasama ang IVA} SST {kasama ang SST} KDV {kasama ang KDV} other {}}",alternativePriceAriaLabel:"Alternatibong nasa halagang {alternativePrice}",strikethroughAriaLabel:"Regular na nasa halagang {strikethroughPrice}"},{lang:"ms",recurrenceLabel:"{recurrenceTerm, select, MONTH {/bulan} YEAR {/tahun} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per bulan} YEAR {per tahun} other {}}",perUnitLabel:"{perUnit, select, LICENSE {setiap lesen} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {setiap lesen} other {}}",freeLabel:"Percuma",freeAriaLabel:"Percuma",taxExclusiveLabel:"{taxTerm, select, GST {kecuali GST} VAT {kecuali VAT} TAX {kecuali Cukai} IVA {kecuali IVA} SST {kecuali SST} KDV {kecuali KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {termasuk GST} VAT {termasuk VAT} TAX {termasuk Cukai} IVA {termasuk IVA} SST {termasuk SST} KDV {termasuk KDV} other {}}",alternativePriceAriaLabel:"Secara alternatif pada {alternativePrice}",strikethroughAriaLabel:"Biasanya pada {strikethroughPrice}"},{lang:"hi",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u092E\u093E\u0939} YEAR {/\u0935\u0930\u094D\u0937} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per \u092E\u093E\u0939} YEAR {per \u0935\u0930\u094D\u0937} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u092A\u094D\u0930\u0924\u093F \u0932\u093E\u0907\u0938\u0947\u0902\u0938} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u092A\u094D\u0930\u0924\u093F \u0932\u093E\u0907\u0938\u0947\u0902\u0938} other {}}",freeLabel:"\u092B\u093C\u094D\u0930\u0940",freeAriaLabel:"\u092B\u093C\u094D\u0930\u0940",taxExclusiveLabel:"{taxTerm, select, GST {GST \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} VAT {VAT \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} TAX {\u0915\u0930 \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} IVA {IVA \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} SST {SST \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} KDV {KDV \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {GST \u0938\u0939\u093F\u0924} VAT {VAT \u0938\u0939\u093F\u0924} TAX {\u0915\u0930 \u0938\u0939\u093F\u0924} IVA {IVA \u0938\u0939\u093F\u0924} SST {SST \u0938\u0939\u093F\u0924} KDV {KDV \u0938\u0939\u093F\u0924} other {}}",alternativePriceAriaLabel:"\u0935\u0948\u0915\u0932\u094D\u092A\u093F\u0915 \u0930\u0942\u092A \u0938\u0947 \u0907\u0938 \u092A\u0930 {alternativePrice}",strikethroughAriaLabel:"\u0928\u093F\u092F\u092E\u093F\u0924 \u0930\u0942\u092A \u0938\u0947 \u0907\u0938 \u092A\u0930 {strikethroughPrice}"},{lang:"iw",recurrenceLabel:"{recurrenceTerm, select, MONTH {/\u05D7\u05D5\u05D3\u05E9} YEAR {/\u05E9\u05E0\u05D4} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {\u05DC\u05D7\u05D5\u05D3\u05E9} YEAR {\u05DC\u05E9\u05E0\u05D4} other {}}",perUnitLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {\u05DC\u05E8\u05D9\u05E9\u05D9\u05D5\u05DF} other {}}",freeLabel:"\u05D7\u05D9\u05E0\u05DD",freeAriaLabel:"\u05D7\u05D9\u05E0\u05DD",taxExclusiveLabel:'{taxTerm, select, GST {\u05DC\u05DC\u05D0 GST} VAT {\u05DC\u05DC\u05D0 \u05DE\u05E2"\u05DE} TAX {\u05DC\u05DC\u05D0 \u05DE\u05E1} IVA {\u05DC\u05DC\u05D0 IVA} SST {\u05DC\u05DC\u05D0 SST} KDV {\u05DC\u05DC\u05D0 KDV} other {}}',taxInclusiveLabel:'{taxTerm, select, GST {\u05DB\u05D5\u05DC\u05DC GST} VAT {\u05DB\u05D5\u05DC\u05DC \u05DE\u05E2"\u05DE} TAX {\u05DB\u05D5\u05DC\u05DC \u05DE\u05E1} IVA {\u05DB\u05D5\u05DC\u05DC IVA} SST {\u05DB\u05D5\u05DC\u05DC SST} KDV {\u05DB\u05D5\u05DC\u05DC KDV} other {}}',alternativePriceAriaLabel:"\u05DC\u05D7\u05DC\u05D5\u05E4\u05D9\u05DF \u05D1-{alternativePrice}",strikethroughAriaLabel:"\u05D1\u05D0\u05D5\u05E4\u05DF \u05E7\u05D1\u05D5\u05E2 \u05D1-{strikethroughPrice}"}],":type":"sheet"}});(function(){let r={clientId:"",endpoint:"https://www.adobe.com/lana/ll",endpointStage:"https://www.stage.adobe.com/lana/ll",errorType:"e",sampleRate:1,tags:"",implicitSampleRate:1,useProd:!0,isProdDomain:!1},n=window;function i(){let{host:l}=window.location;return l.substring(l.length-10)===".adobe.com"&&l.substring(l.length-15)!==".corp.adobe.com"&&l.substring(l.length-16)!==".stage.adobe.com"}function o(l,d){l||(l={}),d||(d={});function u(m){return l[m]!==void 0?l[m]:d[m]!==void 0?d[m]:r[m]}return Object.keys(r).reduce((m,f)=>(m[f]=u(f),m),{})}function a(l,d){l=l&&l.stack?l.stack:l||"",l.length>2e3&&(l=`${l.slice(0,2e3)}<trunc>`);let u=o(d,n.lana.options);if(!u.clientId){console.warn("LANA ClientID is not set in options.");return}let f=parseInt(new URL(window.location).searchParams.get("lana-sample"),10)||(u.errorType==="i"?u.implicitSampleRate:u.sampleRate);if(!n.lana.debug&&!n.lana.localhost&&f<=Math.random()*100)return;let g=i()||u.isProdDomain,T=!g||!u.useProd?u.endpointStage:u.endpoint,w=[`m=${encodeURIComponent(l)}`,`c=${encodeURI(u.clientId)}`,`s=${f}`,`t=${encodeURI(u.errorType)}`];if(u.tags&&w.push(`tags=${encodeURI(u.tags)}`),(!g||n.lana.debug||n.lana.localhost)&&console.log("LANA Msg: ",l,`
Opts:`,u),!n.lana.localhost||n.lana.debug){let v=new XMLHttpRequest;return n.lana.debug&&(w.push("d"),v.addEventListener("load",()=>{console.log("LANA response:",v.responseText)})),v.open("GET",`${T}?${w.join("&")}`),v.send(),v}}function s(l){a(l.reason||l.error||l.message,{errorType:"i"})}function c(){return n.location.search.toLowerCase().indexOf("lanadebug")!==-1}function h(){return n.location.host.toLowerCase().indexOf("localhost")!==-1}n.lana={debug:!1,log:a,options:o(n.lana&&n.lana.options)},c()&&(n.lana.debug=!0),h()&&(n.lana.localhost=!0),n.addEventListener("error",s),n.addEventListener("unhandledrejection",s)})();var sr=window,lr=sr.ShadowRoot&&(sr.ShadyCSS===void 0||sr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ho=Symbol(),lo=new WeakMap,cr=class{constructor(t,r,n){if(this._$cssResult$=!0,n!==ho)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(lr&&t===void 0){let n=r!==void 0&&r.length===1;n&&(t=lo.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&lo.set(r,t))}return t}toString(){return this.cssText}},uo=e=>new cr(typeof e=="string"?e:e+"",void 0,ho);var on=(e,t)=>{lr?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let n=document.createElement("style"),i=sr.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=r.cssText,e.appendChild(n)})},hr=lr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let n of t.cssRules)r+=n.cssText;return uo(r)})(e):e;var an,dr=window,mo=dr.trustedTypes,Ws=mo?mo.emptyScript:"",po=dr.reactiveElementPolyfillSupport,cn={toAttribute(e,t){switch(t){case Boolean:e=e?Ws:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},fo=(e,t)=>t!==e&&(t==t||e==e),sn={attribute:!0,type:String,converter:cn,reflect:!1,hasChanged:fo},ln="finalized",Le=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,n)=>{let i=this._$Ep(n,r);i!==void 0&&(this._$Ev.set(i,n),t.push(i))}),t}static createProperty(t,r=sn){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let n=typeof t=="symbol"?Symbol():"__"+t,i=this.getPropertyDescriptor(t,n,r);i!==void 0&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,r,n){return{get(){return this[r]},set(i){let o=this[t];this[r]=i,this.requestUpdate(t,o,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||sn}static finalize(){if(this.hasOwnProperty(ln))return!1;this[ln]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let i of n)this.createProperty(i,r[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let i of n)r.unshift(hr(i))}else t!==void 0&&r.push(hr(t));return r}static _$Ep(t,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return on(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(t,r,n){this._$AK(t,n)}_$EO(t,r,n=sn){var i;let o=this.constructor._$Ep(t,n);if(o!==void 0&&n.reflect===!0){let a=(((i=n.converter)===null||i===void 0?void 0:i.toAttribute)!==void 0?n.converter:cn).toAttribute(r,n.type);this._$El=t,a==null?this.removeAttribute(o):this.setAttribute(o,a),this._$El=null}}_$AK(t,r){var n;let i=this.constructor,o=i._$Ev.get(t);if(o!==void 0&&this._$El!==o){let a=i.getPropertyOptions(o),s=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?a.converter:cn;this._$El=o,this[o]=s.fromAttribute(r,a.type),this._$El=null}}requestUpdate(t,r,n){let i=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||fo)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),n.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,n))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((i,o)=>this[o]=i),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(t=this._$ES)===null||t===void 0||t.forEach(i=>{var o;return(o=i.hostUpdate)===null||o===void 0?void 0:o.call(i)}),this.update(n)):this._$Ek()}catch(i){throw r=!1,this._$Ek(),i}r&&this._$AE(n)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var i;return(i=n.hostUpdated)===null||i===void 0?void 0:i.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};Le[ln]=!0,Le.elementProperties=new Map,Le.elementStyles=[],Le.shadowRootOptions={mode:"open"},po?.({ReactiveElement:Le}),((an=dr.reactiveElementVersions)!==null&&an!==void 0?an:dr.reactiveElementVersions=[]).push("1.6.3");var hn,ur=window,qe=ur.trustedTypes,go=qe?qe.createPolicy("lit-html",{createHTML:e=>e}):void 0,un="$lit$",ge=`lit$${(Math.random()+"").slice(9)}$`,yo="?"+ge,qs=`<${yo}>`,Pe=document,mr=()=>Pe.createComment(""),kt=e=>e===null||typeof e!="object"&&typeof e!="function",To=Array.isArray,Zs=e=>To(e)||typeof e?.[Symbol.iterator]=="function",dn=`[ 	
\f\r]`,Ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xo=/-->/g,vo=/>/g,_e=RegExp(`>|${dn}(?:([^\\s"'>=/]+)(${dn}*=${dn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),bo=/'/g,Ao=/"/g,Lo=/^(?:script|style|textarea|title)$/i,_o=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),Fh=_o(1),Bh=_o(2),It=Symbol.for("lit-noChange"),D=Symbol.for("lit-nothing"),Eo=new WeakMap,we=Pe.createTreeWalker(Pe,129,null,!1);function wo(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return go!==void 0?go.createHTML(t):t}var Js=(e,t)=>{let r=e.length-1,n=[],i,o=t===2?"<svg>":"",a=Ct;for(let s=0;s<r;s++){let c=e[s],h,l,d=-1,u=0;for(;u<c.length&&(a.lastIndex=u,l=a.exec(c),l!==null);)u=a.lastIndex,a===Ct?l[1]==="!--"?a=xo:l[1]!==void 0?a=vo:l[2]!==void 0?(Lo.test(l[2])&&(i=RegExp("</"+l[2],"g")),a=_e):l[3]!==void 0&&(a=_e):a===_e?l[0]===">"?(a=i??Ct,d=-1):l[1]===void 0?d=-2:(d=a.lastIndex-l[2].length,h=l[1],a=l[3]===void 0?_e:l[3]==='"'?Ao:bo):a===Ao||a===bo?a=_e:a===xo||a===vo?a=Ct:(a=_e,i=void 0);let m=a===_e&&e[s+1].startsWith("/>")?" ":"";o+=a===Ct?c+qs:d>=0?(n.push(h),c.slice(0,d)+un+c.slice(d)+ge+m):c+ge+(d===-2?(n.push(void 0),s):m)}return[wo(e,o+(e[r]||"<?>")+(t===2?"</svg>":"")),n]},Nt=class e{constructor({strings:t,_$litType$:r},n){let i;this.parts=[];let o=0,a=0,s=t.length-1,c=this.parts,[h,l]=Js(t,r);if(this.el=e.createElement(h,n),we.currentNode=this.el.content,r===2){let d=this.el.content,u=d.firstChild;u.remove(),d.append(...u.childNodes)}for(;(i=we.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes()){let d=[];for(let u of i.getAttributeNames())if(u.endsWith(un)||u.startsWith(ge)){let m=l[a++];if(d.push(u),m!==void 0){let f=i.getAttribute(m.toLowerCase()+un).split(ge),g=/([.?@])?(.*)/.exec(m);c.push({type:1,index:o,name:g[2],strings:f,ctor:g[1]==="."?pn:g[1]==="?"?fn:g[1]==="@"?gn:Je})}else c.push({type:6,index:o})}for(let u of d)i.removeAttribute(u)}if(Lo.test(i.tagName)){let d=i.textContent.split(ge),u=d.length-1;if(u>0){i.textContent=qe?qe.emptyScript:"";for(let m=0;m<u;m++)i.append(d[m],mr()),we.nextNode(),c.push({type:2,index:++o});i.append(d[u],mr())}}}else if(i.nodeType===8)if(i.data===yo)c.push({type:2,index:o});else{let d=-1;for(;(d=i.data.indexOf(ge,d+1))!==-1;)c.push({type:7,index:o}),d+=ge.length-1}o++}}static createElement(t,r){let n=Pe.createElement("template");return n.innerHTML=t,n}};function Ze(e,t,r=e,n){var i,o,a,s;if(t===It)return t;let c=n!==void 0?(i=r._$Co)===null||i===void 0?void 0:i[n]:r._$Cl,h=kt(t)?void 0:t._$litDirective$;return c?.constructor!==h&&((o=c?._$AO)===null||o===void 0||o.call(c,!1),h===void 0?c=void 0:(c=new h(e),c._$AT(e,r,n)),n!==void 0?((a=(s=r)._$Co)!==null&&a!==void 0?a:s._$Co=[])[n]=c:r._$Cl=c),c!==void 0&&(t=Ze(e,c._$AS(e,t.values),c,n)),t}var mn=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:n},parts:i}=this._$AD,o=((r=t?.creationScope)!==null&&r!==void 0?r:Pe).importNode(n,!0);we.currentNode=o;let a=we.nextNode(),s=0,c=0,h=i[0];for(;h!==void 0;){if(s===h.index){let l;h.type===2?l=new pr(a,a.nextSibling,this,t):h.type===1?l=new h.ctor(a,h.name,h.strings,this,t):h.type===6&&(l=new xn(a,this,t)),this._$AV.push(l),h=i[++c]}s!==h?.index&&(a=we.nextNode(),s++)}return we.currentNode=Pe,o}v(t){let r=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,r),r+=n.strings.length-2):n._$AI(t[r])),r++}},pr=class e{constructor(t,r,n,i){var o;this.type=2,this._$AH=D,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=n,this.options=i,this._$Cp=(o=i?.isConnected)===null||o===void 0||o}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=Ze(this,t,r),kt(t)?t===D||t==null||t===""?(this._$AH!==D&&this._$AR(),this._$AH=D):t!==this._$AH&&t!==It&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):Zs(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==D&&kt(this._$AH)?this._$AA.nextSibling.data=t:this.$(Pe.createTextNode(t)),this._$AH=t}g(t){var r;let{values:n,_$litType$:i}=t,o=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Nt.createElement(wo(i.h,i.h[0]),this.options)),i);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===o)this._$AH.v(n);else{let a=new mn(o,this),s=a.u(this.options);a.v(n),this.$(s),this._$AH=a}}_$AC(t){let r=Eo.get(t.strings);return r===void 0&&Eo.set(t.strings,r=new Nt(t)),r}T(t){To(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,n,i=0;for(let o of t)i===r.length?r.push(n=new e(this.k(mr()),this.k(mr()),this,this.options)):n=r[i],n._$AI(o),i++;i<r.length&&(this._$AR(n&&n._$AB.nextSibling,i),r.length=i)}_$AR(t=this._$AA.nextSibling,r){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,r);t&&t!==this._$AB;){let i=t.nextSibling;t.remove(),t=i}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},Je=class{constructor(t,r,n,i,o){this.type=1,this._$AH=D,this._$AN=void 0,this.element=t,this.name=r,this._$AM=i,this.options=o,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=D}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,n,i){let o=this.strings,a=!1;if(o===void 0)t=Ze(this,t,r,0),a=!kt(t)||t!==this._$AH&&t!==It,a&&(this._$AH=t);else{let s=t,c,h;for(t=o[0],c=0;c<o.length-1;c++)h=Ze(this,s[n+c],r,c),h===It&&(h=this._$AH[c]),a||(a=!kt(h)||h!==this._$AH[c]),h===D?t=D:t!==D&&(t+=(h??"")+o[c+1]),this._$AH[c]=h}a&&!i&&this.j(t)}j(t){t===D?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},pn=class extends Je{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===D?void 0:t}},Qs=qe?qe.emptyScript:"",fn=class extends Je{constructor(){super(...arguments),this.type=4}j(t){t&&t!==D?this.element.setAttribute(this.name,Qs):this.element.removeAttribute(this.name)}},gn=class extends Je{constructor(t,r,n,i,o){super(t,r,n,i,o),this.type=5}_$AI(t,r=this){var n;if((t=(n=Ze(this,t,r,0))!==null&&n!==void 0?n:D)===It)return;let i=this._$AH,o=t===D&&i!==D||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==D&&(i===D||o);o&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,n;typeof this._$AH=="function"?this._$AH.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,t):this._$AH.handleEvent(t)}},xn=class{constructor(t,r,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Ze(this,t)}};var So=ur.litHtmlPolyfillSupport;So?.(Nt,pr),((hn=ur.litHtmlVersions)!==null&&hn!==void 0?hn:ur.litHtmlVersions=[]).push("2.8.0");var fr=window,gr=fr.ShadowRoot&&(fr.ShadyCSS===void 0||fr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,vn=Symbol(),Po=new WeakMap,Ot=class{constructor(t,r,n){if(this._$cssResult$=!0,n!==vn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(gr&&t===void 0){let n=r!==void 0&&r.length===1;n&&(t=Po.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Po.set(r,t))}return t}toString(){return this.cssText}},xe=e=>new Ot(typeof e=="string"?e:e+"",void 0,vn),k=(e,...t)=>{let r=e.length===1?e[0]:t.reduce((n,i,o)=>n+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1],e[0]);return new Ot(r,e,vn)},bn=(e,t)=>{gr?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let n=document.createElement("style"),i=fr.litNonce;i!==void 0&&n.setAttribute("nonce",i),n.textContent=r.cssText,e.appendChild(n)})},xr=gr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let n of t.cssRules)r+=n.cssText;return xe(r)})(e):e;var An,vr=window,Co=vr.trustedTypes,ec=Co?Co.emptyScript:"",ko=vr.reactiveElementPolyfillSupport,Sn={toAttribute(e,t){switch(t){case Boolean:e=e?ec:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},Io=(e,t)=>t!==e&&(t==t||e==e),En={attribute:!0,type:String,converter:Sn,reflect:!1,hasChanged:Io},yn="finalized",ae=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,n)=>{let i=this._$Ep(n,r);i!==void 0&&(this._$Ev.set(i,n),t.push(i))}),t}static createProperty(t,r=En){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let n=typeof t=="symbol"?Symbol():"__"+t,i=this.getPropertyDescriptor(t,n,r);i!==void 0&&Object.defineProperty(this.prototype,t,i)}}static getPropertyDescriptor(t,r,n){return{get(){return this[r]},set(i){let o=this[t];this[r]=i,this.requestUpdate(t,o,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||En}static finalize(){if(this.hasOwnProperty(yn))return!1;this[yn]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let i of n)this.createProperty(i,r[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let i of n)r.unshift(xr(i))}else t!==void 0&&r.push(xr(t));return r}static _$Ep(t,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return bn(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(t,r,n){this._$AK(t,n)}_$EO(t,r,n=En){var i;let o=this.constructor._$Ep(t,n);if(o!==void 0&&n.reflect===!0){let a=(((i=n.converter)===null||i===void 0?void 0:i.toAttribute)!==void 0?n.converter:Sn).toAttribute(r,n.type);this._$El=t,a==null?this.removeAttribute(o):this.setAttribute(o,a),this._$El=null}}_$AK(t,r){var n;let i=this.constructor,o=i._$Ev.get(t);if(o!==void 0&&this._$El!==o){let a=i.getPropertyOptions(o),s=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?a.converter:Sn;this._$El=o,this[o]=s.fromAttribute(r,a.type),this._$El=null}}requestUpdate(t,r,n){let i=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||Io)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),n.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,n))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((i,o)=>this[o]=i),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(t=this._$ES)===null||t===void 0||t.forEach(i=>{var o;return(o=i.hostUpdate)===null||o===void 0?void 0:o.call(i)}),this.update(n)):this._$Ek()}catch(i){throw r=!1,this._$Ek(),i}r&&this._$AE(n)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var i;return(i=n.hostUpdated)===null||i===void 0?void 0:i.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};ae[yn]=!0,ae.elementProperties=new Map,ae.elementStyles=[],ae.shadowRootOptions={mode:"open"},ko?.({ReactiveElement:ae}),((An=vr.reactiveElementVersions)!==null&&An!==void 0?An:vr.reactiveElementVersions=[]).push("1.6.3");var Tn,br=window,Qe=br.trustedTypes,No=Qe?Qe.createPolicy("lit-html",{createHTML:e=>e}):void 0,_n="$lit$",ve=`lit$${(Math.random()+"").slice(9)}$`,Do="?"+ve,tc=`<${Do}>`,Ie=document,$t=()=>Ie.createComment(""),Vt=e=>e===null||typeof e!="object"&&typeof e!="function",Go=Array.isArray,rc=e=>Go(e)||typeof e?.[Symbol.iterator]=="function",Ln=`[ 	
\f\r]`,Rt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Oo=/-->/g,Ro=/>/g,Ce=RegExp(`>|${Ln}(?:([^\\s"'>=/]+)(${Ln}*=${Ln}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),$o=/'/g,Vo=/"/g,Ho=/^(?:script|style|textarea|title)$/i,zo=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),x=zo(1),qh=zo(2),Ne=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),Mo=new WeakMap,ke=Ie.createTreeWalker(Ie,129,null,!1);function Fo(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return No!==void 0?No.createHTML(t):t}var nc=(e,t)=>{let r=e.length-1,n=[],i,o=t===2?"<svg>":"",a=Rt;for(let s=0;s<r;s++){let c=e[s],h,l,d=-1,u=0;for(;u<c.length&&(a.lastIndex=u,l=a.exec(c),l!==null);)u=a.lastIndex,a===Rt?l[1]==="!--"?a=Oo:l[1]!==void 0?a=Ro:l[2]!==void 0?(Ho.test(l[2])&&(i=RegExp("</"+l[2],"g")),a=Ce):l[3]!==void 0&&(a=Ce):a===Ce?l[0]===">"?(a=i??Rt,d=-1):l[1]===void 0?d=-2:(d=a.lastIndex-l[2].length,h=l[1],a=l[3]===void 0?Ce:l[3]==='"'?Vo:$o):a===Vo||a===$o?a=Ce:a===Oo||a===Ro?a=Rt:(a=Ce,i=void 0);let m=a===Ce&&e[s+1].startsWith("/>")?" ":"";o+=a===Rt?c+tc:d>=0?(n.push(h),c.slice(0,d)+_n+c.slice(d)+ve+m):c+ve+(d===-2?(n.push(void 0),s):m)}return[Fo(e,o+(e[r]||"<?>")+(t===2?"</svg>":"")),n]},Mt=class e{constructor({strings:t,_$litType$:r},n){let i;this.parts=[];let o=0,a=0,s=t.length-1,c=this.parts,[h,l]=nc(t,r);if(this.el=e.createElement(h,n),ke.currentNode=this.el.content,r===2){let d=this.el.content,u=d.firstChild;u.remove(),d.append(...u.childNodes)}for(;(i=ke.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes()){let d=[];for(let u of i.getAttributeNames())if(u.endsWith(_n)||u.startsWith(ve)){let m=l[a++];if(d.push(u),m!==void 0){let f=i.getAttribute(m.toLowerCase()+_n).split(ve),g=/([.?@])?(.*)/.exec(m);c.push({type:1,index:o,name:g[2],strings:f,ctor:g[1]==="."?Pn:g[1]==="?"?Cn:g[1]==="@"?kn:tt})}else c.push({type:6,index:o})}for(let u of d)i.removeAttribute(u)}if(Ho.test(i.tagName)){let d=i.textContent.split(ve),u=d.length-1;if(u>0){i.textContent=Qe?Qe.emptyScript:"";for(let m=0;m<u;m++)i.append(d[m],$t()),ke.nextNode(),c.push({type:2,index:++o});i.append(d[u],$t())}}}else if(i.nodeType===8)if(i.data===Do)c.push({type:2,index:o});else{let d=-1;for(;(d=i.data.indexOf(ve,d+1))!==-1;)c.push({type:7,index:o}),d+=ve.length-1}o++}}static createElement(t,r){let n=Ie.createElement("template");return n.innerHTML=t,n}};function et(e,t,r=e,n){var i,o,a,s;if(t===Ne)return t;let c=n!==void 0?(i=r._$Co)===null||i===void 0?void 0:i[n]:r._$Cl,h=Vt(t)?void 0:t._$litDirective$;return c?.constructor!==h&&((o=c?._$AO)===null||o===void 0||o.call(c,!1),h===void 0?c=void 0:(c=new h(e),c._$AT(e,r,n)),n!==void 0?((a=(s=r)._$Co)!==null&&a!==void 0?a:s._$Co=[])[n]=c:r._$Cl=c),c!==void 0&&(t=et(e,c._$AS(e,t.values),c,n)),t}var wn=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:n},parts:i}=this._$AD,o=((r=t?.creationScope)!==null&&r!==void 0?r:Ie).importNode(n,!0);ke.currentNode=o;let a=ke.nextNode(),s=0,c=0,h=i[0];for(;h!==void 0;){if(s===h.index){let l;h.type===2?l=new Ut(a,a.nextSibling,this,t):h.type===1?l=new h.ctor(a,h.name,h.strings,this,t):h.type===6&&(l=new In(a,this,t)),this._$AV.push(l),h=i[++c]}s!==h?.index&&(a=ke.nextNode(),s++)}return ke.currentNode=Ie,o}v(t){let r=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,r),r+=n.strings.length-2):n._$AI(t[r])),r++}},Ut=class e{constructor(t,r,n,i){var o;this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=n,this.options=i,this._$Cp=(o=i?.isConnected)===null||o===void 0||o}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=et(this,t,r),Vt(t)?t===G||t==null||t===""?(this._$AH!==G&&this._$AR(),this._$AH=G):t!==this._$AH&&t!==Ne&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):rc(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==G&&Vt(this._$AH)?this._$AA.nextSibling.data=t:this.$(Ie.createTextNode(t)),this._$AH=t}g(t){var r;let{values:n,_$litType$:i}=t,o=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Mt.createElement(Fo(i.h,i.h[0]),this.options)),i);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===o)this._$AH.v(n);else{let a=new wn(o,this),s=a.u(this.options);a.v(n),this.$(s),this._$AH=a}}_$AC(t){let r=Mo.get(t.strings);return r===void 0&&Mo.set(t.strings,r=new Mt(t)),r}T(t){Go(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,n,i=0;for(let o of t)i===r.length?r.push(n=new e(this.k($t()),this.k($t()),this,this.options)):n=r[i],n._$AI(o),i++;i<r.length&&(this._$AR(n&&n._$AB.nextSibling,i),r.length=i)}_$AR(t=this._$AA.nextSibling,r){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,r);t&&t!==this._$AB;){let i=t.nextSibling;t.remove(),t=i}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},tt=class{constructor(t,r,n,i,o){this.type=1,this._$AH=G,this._$AN=void 0,this.element=t,this.name=r,this._$AM=i,this.options=o,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=G}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,n,i){let o=this.strings,a=!1;if(o===void 0)t=et(this,t,r,0),a=!Vt(t)||t!==this._$AH&&t!==Ne,a&&(this._$AH=t);else{let s=t,c,h;for(t=o[0],c=0;c<o.length-1;c++)h=et(this,s[n+c],r,c),h===Ne&&(h=this._$AH[c]),a||(a=!Vt(h)||h!==this._$AH[c]),h===G?t=G:t!==G&&(t+=(h??"")+o[c+1]),this._$AH[c]=h}a&&!i&&this.j(t)}j(t){t===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Pn=class extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===G?void 0:t}},ic=Qe?Qe.emptyScript:"",Cn=class extends tt{constructor(){super(...arguments),this.type=4}j(t){t&&t!==G?this.element.setAttribute(this.name,ic):this.element.removeAttribute(this.name)}},kn=class extends tt{constructor(t,r,n,i,o){super(t,r,n,i,o),this.type=5}_$AI(t,r=this){var n;if((t=(n=et(this,t,r,0))!==null&&n!==void 0?n:G)===Ne)return;let i=this._$AH,o=t===G&&i!==G||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==G&&(i===G||o);o&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,n;typeof this._$AH=="function"?this._$AH.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,t):this._$AH.handleEvent(t)}},In=class{constructor(t,r,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){et(this,t)}};var Uo=br.litHtmlPolyfillSupport;Uo?.(Mt,Ut),((Tn=br.litHtmlVersions)!==null&&Tn!==void 0?Tn:br.litHtmlVersions=[]).push("2.8.0");var Bo=(e,t,r)=>{var n,i;let o=(n=r?.renderBefore)!==null&&n!==void 0?n:t,a=o._$litPart$;if(a===void 0){let s=(i=r?.renderBefore)!==null&&i!==void 0?i:null;o._$litPart$=a=new Ut(t.insertBefore($t(),s),s,void 0,r??{})}return a._$AI(e),a};var Nn,On;var ee=class extends ae{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,r;let n=super.createRenderRoot();return(t=(r=this.renderOptions).renderBefore)!==null&&t!==void 0||(r.renderBefore=n.firstChild),n}update(t){let r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Bo(r,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return Ne}};ee.finalized=!0,ee._$litElement$=!0,(Nn=globalThis.litElementHydrateSupport)===null||Nn===void 0||Nn.call(globalThis,{LitElement:ee});var Ko=globalThis.litElementPolyfillSupport;Ko?.({LitElement:ee});((On=globalThis.litElementVersions)!==null&&On!==void 0?On:globalThis.litElementVersions=[]).push("3.3.3");var be="(max-width: 767px)",Ar="(max-width: 1199px)",V="(min-width: 768px)",$="(min-width: 1200px)",W="(min-width: 1600px)";var jo=k`
    :host {
        --consonant-merch-card-background-color: #fff;
        --consonant-merch-card-border: 1px solid var(--consonant-merch-card-border-color);
        
        -webkit-font-smoothing: antialiased;
        background-color: var(--consonant-merch-card-background-color);
        border-radius: var(--consonant-merch-spacing-xs);
        border: var(--consonant-merch-card-border);
        box-sizing: border-box;
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
    
    footer.footer-column {
        flex-direction: column;
    }
    
    footer.footer-column .secure-transaction-label {
        align-self: flex-start;
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

    ::slotted([slot='price']) {
      color: var(--consonant-merch-card-price-color);
    }
`,Yo=()=>[k`
        /* Tablet */
        @media screen and ${xe(V)} {
            :host([size='wide']),
            :host([size='super-wide']) {
                width: 100%;
                grid-column: 1 / -1;
            }
        }

        /* Laptop */
        @media screen and ${xe($)} {
            :host([size='wide']) {
                grid-column: span 2;
            }
        `];var rt,Dt=class Dt{constructor(t){p(this,"card");M(this,rt,void 0);this.card=t,this.insertVariantStyle()}getContainer(){return K(this,rt,_(this,rt)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),_(this,rt)}insertVariantStyle(){if(!Dt.styleMap[this.card.variant]){Dt.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let n=`--consonant-merch-card-${this.card.variant}-${r}-height`,i=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),o=parseInt(this.getContainer().style.getPropertyValue(n))||0;i>o&&this.getContainer().style.setProperty(n,`${i}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),x`
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
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabelFooter(){let t=this.card.secureLabel?x`<span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              >`:"";return x`<footer>${t}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){}};rt=new WeakMap,p(Dt,"styleMap",{});var I=Dt;function Ae(e,t={},r=null,n=null){let i=n?document.createElement(e,{is:n}):document.createElement(e);r instanceof HTMLElement?i.appendChild(r):i.innerHTML=r;for(let[o,a]of Object.entries(t))i.setAttribute(o,a);return i}function Er(){return window.matchMedia("(max-width: 767px)").matches}function Xo(){return window.matchMedia("(max-width: 1024px)").matches}var qn={};js(qn,{CLASS_NAME_FAILED:()=>Dn,CLASS_NAME_HIDDEN:()=>ac,CLASS_NAME_PENDING:()=>Gn,CLASS_NAME_RESOLVED:()=>Hn,ERROR_MESSAGE_BAD_REQUEST:()=>Tr,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>fc,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>zn,EVENT_AEM_ERROR:()=>Re,EVENT_AEM_LOAD:()=>Oe,EVENT_MAS_ERROR:()=>Un,EVENT_MAS_READY:()=>Mn,EVENT_MERCH_CARD_ACTION_MENU_TOGGLE:()=>Vn,EVENT_MERCH_CARD_COLLECTION_SHOWMORE:()=>mc,EVENT_MERCH_CARD_COLLECTION_SORT:()=>uc,EVENT_MERCH_CARD_READY:()=>$n,EVENT_MERCH_OFFER_READY:()=>cc,EVENT_MERCH_OFFER_SELECT_READY:()=>Rn,EVENT_MERCH_QUANTITY_SELECTOR_CHANGE:()=>yr,EVENT_MERCH_SEARCH_CHANGE:()=>dc,EVENT_MERCH_SIDENAV_SELECT:()=>pc,EVENT_MERCH_STOCK_CHANGE:()=>hc,EVENT_MERCH_STORAGE_CHANGE:()=>Sr,EVENT_OFFER_SELECTED:()=>lc,EVENT_TYPE_FAILED:()=>Fn,EVENT_TYPE_READY:()=>nt,EVENT_TYPE_RESOLVED:()=>Bn,LOG_NAMESPACE:()=>Kn,Landscape:()=>$e,NAMESPACE:()=>oc,PARAM_AOS_API_KEY:()=>gc,PARAM_ENV:()=>jn,PARAM_LANDSCAPE:()=>Yn,PARAM_WCS_API_KEY:()=>xc,STATE_FAILED:()=>se,STATE_PENDING:()=>Ee,STATE_RESOLVED:()=>ce,TAG_NAME_SERVICE:()=>sc,WCS_PROD_URL:()=>Xn,WCS_STAGE_URL:()=>Wn});var oc="merch",ac="hidden",nt="wcms:commerce:ready",sc="mas-commerce-service",cc="merch-offer:ready",Rn="merch-offer-select:ready",$n="merch-card:ready",Vn="merch-card:action-menu-toggle",lc="merch-offer:selected",hc="merch-stock:change",Sr="merch-storage:change",yr="merch-quantity-selector:change",dc="merch-search:change",uc="merch-card-collection:sort",mc="merch-card-collection:showmore",pc="merch-sidenav:select",Oe="aem:load",Re="aem:error",Mn="mas:ready",Un="mas:error",Dn="placeholder-failed",Gn="placeholder-pending",Hn="placeholder-resolved",Tr="Bad WCS request",zn="Commerce offer not found",fc="Literals URL not provided",Fn="mas:failed",Bn="mas:resolved",Kn="mas/commerce",jn="commerce.env",Yn="commerce.landscape",gc="commerce.aosKey",xc="commerce.wcsKey",Xn="https://www.adobe.com/web_commerce_artifact",Wn="https://www.stage.adobe.com/web_commerce_artifact_stage",se="failed",Ee="pending",ce="resolved",$e={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"};var Wo=`
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

@media screen and ${V} {
    :root {
      --consonant-merch-card-catalog-width: 302px;
    }

    .two-merch-cards.catalog,
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(2, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${$} {
    :root {
      --consonant-merch-card-catalog-width: 276px;
    }

    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${W} {
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
  color: var(--consonant-merch-card-background-color);
  text-decoration: underline;
}

merch-card[variant="catalog"] .payment-details {
  font-size: var(--consonant-merch-card-body-font-size);
  font-style: italic;
  font-weight: 400;
  line-height: var(--consonant-merch-card-body-line-height);
}`;var Zn={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},it=class extends I{constructor(r){super(r);p(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(Vn,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});p(this,"toggleActionMenu",r=>{if(!this.actionMenuContentSlot||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter")return;r.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let n=this.actionMenuContentSlot.classList.contains("hidden");n||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!n).toString())});p(this,"toggleActionMenuFromCard",r=>{let n=r?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(n||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",n),this.setAriaExpanded(this.actionMenu,"false"))});p(this,"hideActionMenu",r=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get aemFragmentMapping(){return Zn}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return x` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${Xo()&&this.card.actionMenu?"always-visible":""}
                ${this.card.actionMenu?"invisible":"hidden"}"
                        @click="${this.toggleActionMenu}"
                        @keypress="${this.toggleActionMenu}"
                        tabindex="0"
                        aria-expanded="false"
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
            <slot></slot>`}getGlobalCSS(){return Wo}setAriaExpanded(r,n){r.setAttribute("aria-expanded",n)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};p(it,"variantStyle",k`
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
    `);var qo=`
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${V} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${$} {
  :root {
    --consonant-merch-card-image-width: 378px;
    --consonant-merch-card-image-width-4clm: 276px;
  }
    
  .three-merch-cards.image {
      grid-template-columns: repeat(3, var(--consonant-merch-card-image-width));
  }

  .four-merch-cards.image {
      grid-template-columns: repeat(4, var(--consonant-merch-card-image-width-4clm));
  }
}
`;var Lr=class extends I{constructor(t){super(t)}getGlobalCSS(){return qo}renderLayout(){return x`${this.cardImage}
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
          `}`}};var Zo=`
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${V} {
  .two-merch-cards.inline-heading,
  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${$} {
  :root {
    --consonant-merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${W} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var _r=class extends I{constructor(t){super(t)}getGlobalCSS(){return Zo}renderLayout(){return x` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":x`<hr />`} ${this.secureLabelFooter}`}};var Jo=`
  :root {
    --consonant-merch-card-mini-compare-chart-icon-size: 32px;
    --consonant-merch-card-mini-compare-mobile-cta-font-size: 15px;
    --consonant-merch-card-mini-compare-mobile-cta-width: 75px;
    --consonant-merch-card-mini-compare-badge-mobile-max-width: 50px;
  }
  
  merch-card[variant="mini-compare-chart"] [slot="heading-m"] {
    padding: 0 var(--consonant-merch-spacing-s) 0;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m"] {
    padding: var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-xs);
    font-size: var(--consonant-merch-card-heading-xs-font-size);
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-body-xxl-font-size);
    padding: 0 var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"] [slot="body-m"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s);
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="body-m"] {
    padding: var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"] [is="inline-price"] {
    display: inline-block;
    min-height: 30px;
    min-width: 1px;
  }

  merch-card[variant="mini-compare-chart"] [slot='callout-content'] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0px;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot='callout-content'] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs) 0px;
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

   merch-card[variant="mini-compare-chart"].bullet-list [slot="body-xxs"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs) 0;    
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="promo-text"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs) 0;
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] a {
    text-decoration: underline;
  }

  merch-card[variant="mini-compare-chart"] .action-area {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    flex-wrap: wrap;
    width: 100%;
    gap: var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"] [slot="footer-rows"] ul {
    margin-block-start: 0px;
    margin-block-end: 0px;
    padding-inline-start: 0px;
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

  merch-card[variant="mini-compare-chart"] .footer-rows-title {
    font-color: var(--merch-color-grey-80);
    font-weight: 700;
    padding-block-end: var(--consonant-merch-spacing-xxs);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    font-size: var(--consonant-merch-card-body-xs-font-size);
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

  merch-card[variant="mini-compare-chart"] .footer-row-icon-checkmark img {
    max-width: initial;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-icon-checkmark {
    display: flex;
    align-items: center;
    height: 20px;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-checkmark {
    display: flex;
    gap: var(--consonant-merch-spacing-xs);
    justify-content: start;
    align-items: flex-start;
    margin-block: var(--consonant-merch-spacing-xxxs);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description-checkmark {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    font-weight: 400;
    line-height: var(--consonant-merch-card-body-xs-line-height);
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
  }

  merch-card[variant="mini-compare-chart"] .chevron-icon {
    margin-left: 8px;
  }

  merch-card[variant="mini-compare-chart"] .checkmark-copy-container {
    display: none;
  }

  merch-card[variant="mini-compare-chart"] .checkmark-copy-container.open {
    display: block;
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
@media screen and ${be} {
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

@media screen and ${Ar} {
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
@media screen and ${V} {
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
@media screen and ${$} {
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

@media screen and ${W} {
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
`;var vc=32,ot=class extends I{constructor(r){super(r);p(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);p(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?x`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:x`<slot name="secure-transaction-label"></slot>`;return x`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return Jo}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(i=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${i}"]`),i)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let n=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");n&&n.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;[...this.card.querySelector('[slot="footer-rows"] ul')?.children].forEach((n,i)=>{let o=Math.max(vc,parseFloat(window.getComputedStyle(n).height)||0),a=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(i+1)))||0;o>a&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(i+1),`${o}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(n=>{let i=n.querySelector(".footer-row-cell-description");i&&!i.textContent.trim()&&n.remove()})}renderLayout(){return x` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?x`<slot name="heading-m-price"></slot>
          <slot name="body-m"></slot>`:x`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){Er()?this.removeEmptyRows():(await Promise.all(this.card.prices.map(r=>r.onceSettled())),this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};p(ot,"variantStyle",k`
    :host([variant='mini-compare-chart']) > slot:not([name='icons']) {
        display: block;
    }
    :host([variant='mini-compare-chart']) footer {
        min-height: var(--consonant-merch-card-mini-compare-chart-footer-height);
        padding: var(--consonant-merch-spacing-s);
    }

    :host([variant='mini-compare-chart'].bullet-list) footer {
        flex-flow: column nowrap;
        min-height: var(--consonant-merch-card-mini-compare-chart-footer-height);
        padding: var(--consonant-merch-spacing-xs);
    }

    /* mini-compare card  */
    :host([variant='mini-compare-chart']) .top-section {
        padding-top: var(--consonant-merch-spacing-s);
        padding-inline-start: var(--consonant-merch-spacing-s);
        height: var(--consonant-merch-card-mini-compare-chart-top-section-height);
    }

    :host([variant='mini-compare-chart'].bullet-list) .top-section {
        padding-top: var(--consonant-merch-spacing-xs);
        padding-inline-start: var(--consonant-merch-spacing-xs);
    }

    :host([variant='mini-compare-chart'].bullet-list) .secure-transaction-label {
      align-self: flex-start;
      flex: none;
      color: var(--merch-color-grey-700);
    }

    @media screen and ${xe(Ar)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${xe($)} {
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
    :host([variant='mini-compare-chart']) slot[name='footer-rows'] {
        justify-content: flex-start;
    }
  `);var Qo=`
:root {
  --consonant-merch-card-plans-width: 300px;
  --consonant-merch-card-plans-icon-size: 40px;
}

merch-card[variant="plans"] {
  width: 276px;
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
@media screen and ${V} {
  :root {
    --consonant-merch-card-plans-width: 302px;
  }
  .two-merch-cards.plans,
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
  }
  .four-merch-cards.plans .foreground {
      max-width: unset;
  }
}

/* desktop */
@media screen and ${$} {
  :root {
    --consonant-merch-card-plans-width: 276px;
  }
  .three-merch-cards.plans {
      grid-template-columns: repeat(3, var(--consonant-merch-card-plans-width));
  }
  .four-merch-cards.plans {
      grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
  }
}

/* Large desktop */
    @media screen and ${W} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
}
`;var Jn={title:{tag:"p",slot:"heading-xs"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},stockOffer:!0,secureLabel:!0,ctas:{slot:"footer",size:"m"},style:"consonant"},at=class extends I{constructor(t){super(t)}get aemFragmentMapping(){return Jn}getGlobalCSS(){return Qo}postCardUpdateHook(){this.adjustTitleWidth()}get stockCheckbox(){return this.card.checkboxLabel?x`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:""}renderLayout(){return x` ${this.badge}
        <div class="body">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            <slot name="annualPrice"></slot>
            <slot name="priceLabel"></slot>
            <slot name="body-xxs"></slot>
            <slot name="promo-text"></slot>
            <slot name="body-xs"></slot>
            <slot name="callout-content"></slot> 
            ${this.stockCheckbox}
        </div>
        <slot name="quantity-select"></slot>
        ${this.secureLabelFooter}`}};p(at,"variantStyle",k`
    :host([variant='plans']) {
      min-height: 348px;
    }
      
    :host([variant='plans']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);var ea=`
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
@media screen and ${V} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${$} {
  :root {
    --consonant-merch-card-product-width: 378px;
    --consonant-merch-card-product-width-4clm: 276px;
  }
    
  .three-merch-cards.product {
      grid-template-columns: repeat(3, var(--consonant-merch-card-product-width));
  }

  .four-merch-cards.product {
      grid-template-columns: repeat(4, var(--consonant-merch-card-product-width-4clm));
  }
}
`;var Ve=class extends I{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return ea}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return x` ${this.badge}
      <div class="body" aria-live="polite">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xxs"></slot>
          ${this.promoBottom?"":x`<slot name="promo-text"></slot>`}
          <slot name="body-xs"></slot>
          ${this.promoBottom?x`<slot name="promo-text"></slot>`:""}
          <slot name="callout-content"></slot>
          <slot name="body-lower"></slot>
      </div>
      ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(Er()||this.adjustProductBodySlots(),this.adjustTitleWidth())}};p(Ve,"variantStyle",k`
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
  `);var ta=`
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
@media screen and ${be} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
}

@media screen and ${V} {
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
@media screen and ${$} {
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
`;var st=class extends I{constructor(t){super(t)}getGlobalCSS(){return ta}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return x` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":x`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?x`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};p(st,"variantStyle",k`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);var ra=`
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

@media screen and ${be} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${V} {
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
@media screen and ${$} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

@media screen and ${W} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var Qn={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},ct=class extends I{constructor(t){super(t)}getGlobalCSS(){return ra}get headingSelector(){return'[slot="detail-m"]'}get aemFragmentMapping(){return Qn}renderLayout(){return x`${this.cardImage}
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
            <slot></slot>`}};p(ct,"variantStyle",k`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);var na=`
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

@media screen and ${be} {
  :root {
    --consonant-merch-card-twp-width: 300px;
  }
  .one-merch-card.twp,
  .two-merch-cards.twp,
  .three-merch-cards.twp {
      grid-template-columns: repeat(1, var(--consonant-merch-card-twp-mobile-width));
  }
}

@media screen and ${V} {
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
  
@media screen and ${$} {
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

@media screen and ${W} {
    .one-merch-card.twp
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
  }
}
`;var lt=class extends I{constructor(t){super(t)}getGlobalCSS(){return na}renderLayout(){return x`${this.badge}
      <div class="top-section">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xs-top"></slot>
      </div>
      <div class="body">
          <slot name="body-xs"></slot>
      </div>
      <footer><slot name="footer"></slot></footer>`}};p(lt,"variantStyle",k`
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
  `);var ia=`

  merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
    font-size: var(--consonant-merch-card-heading-xxs-font-size);
    line-height: var(--consonant-merch-card-heading-xxs-line-height);
  }
  
  merch-card[variant="ccd-suggested"] [slot="body-xs"] a {
    font-size: var(--consonant-merch-card-body-xxs-font-size);
    line-height: var(--consonant-merch-card-body-xxs-line-height);
  }

  merch-card[variant="ccd-suggested"] [slot="price"] em {
      font-size: var(--consonant-merch-card-body-xxs-font-size);
      line-height: var(--consonant-merch-card-body-xxs-line-height);
  }

.spectrum--darkest merch-card[variant="ccd-suggested"] {
  --consonant-merch-card-background-color:rgb(30, 30, 30);
  --consonant-merch-card-heading-xs-color:rgb(239, 239, 239);
  --consonant-merch-card-body-xs-color:rgb(200, 200, 200);
  --consonant-merch-card-border-color:rgb(57, 57, 57);
  --consonant-merch-card-detail-s-color:rgb(162, 162, 162);
  --consonant-merch-card-price-color:rgb(248, 248, 248);
  --merch-color-inline-price-strikethrough:rgb(176, 176, 176);
}

.spectrum--darkest  merch-card[variant="ccd-suggested"]:hover {
  --consonant-merch-card-border-color:rgb(73, 73, 73);
}
`;var ei={backgroundImage:{attribute:"background-image"},badge:!0,ctas:{slot:"cta",size:"M"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"p",slot:"price"},size:[],subtitle:{tag:"h4",slot:"detail-s"},title:{tag:"h3",slot:"heading-xs"}},ht=class extends I{getGlobalCSS(){return ia}get aemFragmentMapping(){return ei}get stripStyle(){return this.card.backgroundImage?`
            background: url("${this.card.backgroundImage}");
        background-size: auto 100%;
        background-repeat: no-repeat;
        background-position: ${this.card.dir==="ltr"?"left":"right"};
        `:""}renderLayout(){return x` <div style="${this.stripStyle}" class="body">
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
            <slot></slot>`}postCardUpdateHook(t){t.has("backgroundImage")&&this.styleBackgroundImage()}styleBackgroundImage(){if(this.card.classList.remove("thin-strip"),this.card.classList.remove("wide-strip"),!this.card.backgroundImage)return;let t=new Image;t.src=this.card.backgroundImage,t.onload=()=>{t.width>8?this.card.classList.add("wide-strip"):t.width===8&&this.card.classList.add("thin-strip")}}};p(ht,"variantStyle",k`
        :host([variant='ccd-suggested']) {
            --consonant-merch-card-background-color: rgb(245, 245, 245);
            --consonant-merch-card-body-xs-color: rgb(75, 75, 75);
            --consonant-merch-card-border-color: rgb(225, 225, 225);
            --consonant-merch-card-detail-s-color: rgb(110, 110, 110);
            --consonant-merch-card-heading-xs-color: rgb(44, 44, 44);
            --merch-color-inline-price-strikethrough: var(--spectrum-gray-600);
            --mod-img-height: 38px;

            box-sizing: border-box;
            width: 100%;
            max-width: 305px;
            min-width: 270px;
            min-height: 205px;
            border-radius: 4px;
            display: flex;
            flex-flow: wrap;
            overflow: hidden;
        }

        :host([variant='ccd-slice']) * {
            overflow: hidden;
        }

        :host([variant='ccd-suggested']:hover) {
            --consonant-merch-card-border-color: #cacaca;
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
            justify-content: space-between;
        }

        :host([variant='ccd-suggested']) ::slotted([slot='icons']) {
            place-self: center;
        }

        :host([variant='ccd-suggested']) ::slotted([slot='heading-xs']) {
            font-size: var(--consonant-merch-card-heading-xxs-font-size);
            line-height: var(--consonant-merch-card-heading-xxs-line-height);
        }

        :host([variant='ccd-suggested']) ::slotted([slot='detail-m']) {
            line-height: var(--consonant-merch-card-detail-m-line-height);
        }

        :host([variant='ccd-suggested']) ::slotted([slot='body-xs']) {
            color: var(--ccd-gray-700-dark);
            padding-top: 8px;
            flex-grow: 1;
        }

        :host([variant='ccd-suggested'].wide-strip)
            ::slotted([slot='body-xs']) {
            padding-inline-start: 48px;
        }

        :host([variant='ccd-suggested'].wide-strip) ::slotted([slot='price']) {
            padding-inline-start: 48px;
        }

        :host([variant='ccd-suggested']) ::slotted([slot='price']) {
            font-size: var(--consonant-merch-card-body-xs-font-size);
            line-height: var(--consonant-merch-card-body-xs-line-height);
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
    `);var oa=`

merch-card[variant="ccd-slice"] [slot='image'] img {
  overflow: hidden;
  border-radius: 50%;
}

merch-card[variant="ccd-slice"] [slot='body-s'] a.spectrum-Link {
  font-size: var(--consonant-merch-card-body-xxs-font-size);
  font-style: normal;
  font-weight: 400;
  line-height: var(--consonant-merch-card-body-xxs-line-height);
}

.spectrum--darkest merch-card[variant="ccd-slice"] {
  --consonant-merch-card-background-color:rgb(29, 29, 29);
  --consonant-merch-card-body-s-color:rgb(235, 235, 235);
  --consonant-merch-card-border-color:rgb(48, 48, 48);
  --consonant-merch-card-detail-s-color:rgb(235, 235, 235);
}
`;var ti={backgroundImage:{tag:"div",slot:"image"},badge:!0,ctas:{slot:"footer",size:"S"},description:{tag:"div",slot:"body-s"},mnemonics:{size:"m"},size:["wide"]},dt=class extends I{getGlobalCSS(){return oa}get aemFragmentMapping(){return ti}renderLayout(){return x` <div class="content">
                <div class="top-section">
                    <slot name="icons"></slot>
                    ${this.badge}
                </div>
                <slot name="body-s"></slot>
                <slot name="footer"></slot>
            </div>
            <slot name="image"></slot>
            <slot></slot>`}};p(dt,"variantStyle",k`
        :host([variant='ccd-slice']) {
            --consonant-merch-card-background-color: rgb(248, 248, 248);
            --consonant-merch-card-border-color: rgb(230, 230, 230);
            --consonant-merch-card-body-s-color: rgb(34, 34, 34);
            --merch-color-inline-price-strikethrough: var(--spectrum-gray-600);
            --mod-img-height: 29px;

            box-sizing: border-box;
            min-width: 290px;
            max-width: 322px;
            width: 100%;
            max-height: 154px;
            height: 154px;
            border-radius: 4px;
            display: flex;
            flex-flow: wrap;
        }

        :host([variant='ccd-slice']) * {
            overflow: hidden;
        }

        :host([variant='ccd-slice']) ::slotted([slot='body-s']) {
            font-size: var(--consonant-merch-card-body-xs-font-size);
            line-height: var(--consonant-merch-card-body-xxs-line-height);
            min-width: 154px;
            max-width: 171px;
            height: 55px;
            overflow: hidden;
        }

        :host([variant='ccd-slice'][size='wide']) ::slotted([slot='body-s']) {
            max-width: 425px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        :host([variant='ccd-slice'][size='wide']) {
            width: 600px;
            max-width: 600px;
        }

        :host([variant='ccd-slice']) .content {
            display: flex;
            gap: var(--consonant-merch-spacing-xxs);
            padding: 15px;
            padding-inline-end: 0;
            height: 154px;
            box-sizing: border-box;
            min-height: 123px;
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
            width: 134px;
            height: 149px;
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
    `);var ri=(e,t=!1)=>{switch(e.variant){case"catalog":return new it(e);case"image":return new Lr(e);case"inline-heading":return new _r(e);case"mini-compare-chart":return new ot(e);case"plans":return new at(e);case"product":return new Ve(e);case"segment":return new st(e);case"special-offers":return new ct(e);case"twp":return new lt(e);case"ccd-suggested":return new ht(e);case"ccd-slice":return new dt(e);default:return t?void 0:new Ve(e)}},aa={catalog:Zn,image:null,"inline-heading":null,"mini-compare-chart":null,plans:Jn,product:null,segment:null,"special-offers":Qn,twp:null,"ccd-suggested":ei,"ccd-slice":ti},sa=()=>{let e=[];return e.push(it.variantStyle),e.push(ot.variantStyle),e.push(Ve.variantStyle),e.push(at.variantStyle),e.push(st.variantStyle),e.push(ct.variantStyle),e.push(lt.variantStyle),e.push(ht.variantStyle),e.push(dt.variantStyle),e};var ca=document.createElement("style");ca.innerHTML=`
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
    --consonant-merch-card-heading-xxs-font-size: 16px;
    --consonant-merch-card-heading-xxs-line-height: 20px;
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
    --consonant-merch-card-detail-s-font-size: 11px;
    --consonant-merch-card-detail-s-line-height: 14px;
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
    --consonant-merch-card-body-xxl-font-size: 24px;
    --consonant-merch-card-body-xl-line-height: 33px;


    --consonant-merch-card-heading-padding: 0;

    /* colors */
    --consonant-merch-card-background-color: inherit;
    --consonant-merch-card-border-color: #eaeaea;
    --color-accent: rgb(59, 99, 251);
    --merch-color-focus-ring: #1473E6;
    --merch-color-grey-10: #f6f6f6;
    --merch-color-grey-60: var(--specturm-gray-600);
    --merch-color-grey-80: #2c2c2c;
    --merch-color-grey-200: #E8E8E8;
    --merch-color-grey-600: #686868;
    --merch-color-grey-700: #464646;
    --merch-color-green-promo: #2D9D78;
    --consonant-merch-card-body-xs-color: var(--spectrum-gray-100, var(--merch-color-grey-80));
    --merch-color-inline-price-strikethrough: initial;
    --consonant-merch-card-detail-s-color: var(--spectrum-gray-600, var(--merch-color-grey-600));
    --consonant-merch-card-heading-color: var(--spectrum-gray-800, var(--merch-color-grey-80));
    --consonant-merch-card-heading-xs-color: var(--consonant-merch-card-heading-color);
    --consonant-merch-card-price-color: #222222;

    /* ccd colors */
    --ccd-gray-200-light: #E6E6E6;
    --ccd-gray-800-dark: #222;
    --ccd-gray-700-dark: #464646;
    --ccd-gray-600-light: #6D6D6D;

    
  
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

merch-card[variant="ccd-suggested"] *,
merch-card[variant="ccd-slice"] * {
  box-sizing: border-box;
}

merch-card.background-opacity-70 {
    background-color: rgba(255 255 255 / 70%);
}

merch-card.has-divider hr {
    margin: var(--consonant-merch-spacing-xs) 0;
    height: 1px;
    border: none;
}

merch-card.has-divider div[slot='body-lower'] hr {
    margin: 0;
}

merch-card p, merch-card h3, merch-card h4 {
    margin: 0;
}

merch-card span[is='inline-price'] {
    display: inline-block;
}

merch-card [slot^='heading-'] {
    color: var(--consonant-merch-card-heading-color);
    font-weight: 700;
}

merch-card [slot='heading-xs'] {
    font-size: var(--consonant-merch-card-heading-xs-font-size);
    line-height: var(--consonant-merch-card-heading-xs-line-height);
    color: var(--consonant-merch-card-heading-xs-color);
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

merch-card [slot='callout-content'] .icon-button {
    height: 16px;
    padding: 0;
    border: 0;
    min-inline-size: 16px;
}

merch-card [slot='callout-content'] .icon-button:hover {
    background-color: transparent;
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
    font-size: var(--consonant-merch-card-detail-s-font-size);
    line-height: var(--consonant-merch-card-detail-s-line-height);
    letter-spacing: 0.66px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--consonant-merch-card-detail-s-color);
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

merch-card [slot="body-s"] {
    color: var(--consonant-merch-card-body-s-color);
}

merch-card button.spectrum-Button > a {
  color: inherit;
  text-decoration: none;
}

merch-card button.spectrum-Button > a:hover {
  color: inherit;
}

merch-card button.spectrum-Button > a:active {
  color: inherit;
}

merch-card button.spectrum-Button > a:focus {
  color: inherit;
}

merch-card [slot="body-xs"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    color: var(--consonant-merch-card-body-xs-color);
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

merch-card [slot="cci-footer"] p,
merch-card [slot="cct-footer"] p,
merch-card [slot="cce-footer"] p {
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

merch-card [slot="footer-rows"] {
    min-height: var(--consonant-merch-card-footer-rows-height);
}

merch-card div[slot="footer"] {
    display: contents;
}

merch-card.product div[slot="footer"] {
    display: block;
}

merch-card.product div[slot="footer"] a + a {
    margin: 5px 0 0 5px;
}

merch-card [slot="footer"] a {
    word-wrap: break-word;
    text-align: center;
}

merch-card [slot="footer"] a:not([class]) {
    font-weight: 700;
    font-size: var(--consonant-merch-card-cta-font-size);
}

merch-card div[slot='bg-image'] img {
    position: relative;
    width: 100%;
    min-height: var(--consonant-merch-card-bg-img-height);
    max-height: var(--consonant-merch-card-bg-img-height);
    object-fit: cover;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
}

.price-unit-type:not(.disabled)::before,
.price-tax-inclusivity:not(.disabled)::before {
  content: "\\00a0";
}

merch-card span.placeholder-resolved[data-template='priceStrikethrough'],
merch-card span.placeholder-resolved[data-template='strikethrough'],
merch-card span.price.price-strikethrough {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  font-weight: normal;
  text-decoration: line-through;
  color: var(--merch-color-inline-price-strikethrough);
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

merch-sidenav-checkbox-group h3 {
    font-size: 14px;
    height: 32px;
    letter-spacing: 0px;
    line-height: 18.2px;
    color: var(--color-gray-600);
    margin: 0px;
}

`;document.head.appendChild(ca);var ua=new CSSStyleSheet;ua.replaceSync(":host { display: contents; }");var bc=document.querySelector('meta[name="aem-base-url"]')?.content??"https://odin.adobe.com",la="fragment",ha="author",Ac="ims",da=e=>{throw new Error(`Failed to get fragment: ${e}`)};async function Ec(e,t,r,n){let i=r?`${e}/adobe/sites/cf/fragments/${t}`:`${e}/adobe/sites/fragments/${t}`,o=await fetch(i,{cache:"default",credentials:"omit",headers:n}).catch(a=>da(a.message));return o?.ok||da(`${o.status} ${o.statusText}`),o.json()}var ni,Se,ii=class{constructor(){M(this,Se,new Map)}clear(){_(this,Se).clear()}add(...t){t.forEach(r=>{let{id:n}=r;n&&_(this,Se).set(n,r)})}has(t){return _(this,Se).has(t)}get(t){return _(this,Se).get(t)}remove(t){_(this,Se).delete(t)}};Se=new WeakMap;var wr=new ii,Me,le,ye,Gt,he,ut,Ht,ai,Pr,ma,Cr,pa,oi=class extends HTMLElement{constructor(){super();M(this,Ht);M(this,Pr);M(this,Cr);p(this,"cache",wr);M(this,Me,void 0);M(this,le,void 0);M(this,ye,void 0);M(this,Gt,!1);M(this,he,void 0);M(this,ut,!1);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[ua];let r=this.getAttribute(Ac);["",!0,"true"].includes(r)&&(K(this,Gt,!0),ni||(ni={Authorization:`Bearer ${window.adobeid?.authorize?.()}`}))}static get observedAttributes(){return[la,ha]}attributeChangedCallback(r,n,i){r===la&&(K(this,ye,i),this.refresh(!1)),r===ha&&K(this,ut,["","true"].includes(i))}connectedCallback(){if(!_(this,ye)){fe(this,Ht,ai).call(this,"Missing fragment id");return}}async refresh(r=!0){_(this,he)&&!await Promise.race([_(this,he),Promise.resolve(!1)])||(r&&wr.remove(_(this,ye)),K(this,he,this.fetchData().then(()=>(this.dispatchEvent(new CustomEvent(Oe,{detail:this.data,bubbles:!0,composed:!0})),!0)).catch(n=>(fe(this,Ht,ai).call(this,"Network error: failed to load fragment"),K(this,he,null),!1))),_(this,he))}async fetchData(){K(this,Me,null),K(this,le,null);let r=wr.get(_(this,ye));r||(r=await Ec(bc,_(this,ye),_(this,ut),_(this,Gt)?ni:void 0),wr.add(r)),K(this,Me,r)}get updateComplete(){return _(this,he)??Promise.reject(new Error("AEM fragment cannot be loaded"))}get data(){return _(this,le)?_(this,le):(_(this,ut)?fe(this,Pr,ma).call(this):fe(this,Cr,pa).call(this),_(this,le))}};Me=new WeakMap,le=new WeakMap,ye=new WeakMap,Gt=new WeakMap,he=new WeakMap,ut=new WeakMap,Ht=new WeakSet,ai=function(r){this.classList.add("error"),this.dispatchEvent(new CustomEvent(Re,{detail:r,bubbles:!0,composed:!0}))},Pr=new WeakSet,ma=function(){let{fields:r,id:n,tags:i}=_(this,Me);K(this,le,r.reduce((o,{name:a,multiple:s,values:c})=>(o.fields[a]=s?c:c[0],o),{fields:{},id:n,tags:i}))},Cr=new WeakSet,pa=function(){let{fields:r,id:n,tags:i}=_(this,Me);K(this,le,Object.entries(r).reduce((o,[a,s])=>(o.fields[a]=s?.mimeType?s.value:s??"",o),{fields:{},id:n,tags:i}))};customElements.define("aem-fragment",oi);var zt;(function(e){e.STAGE="STAGE",e.PRODUCTION="PRODUCTION",e.LOCAL="LOCAL"})(zt||(zt={}));var si;(function(e){e.STAGE="STAGE",e.PRODUCTION="PROD",e.LOCAL="LOCAL"})(si||(si={}));var Ft;(function(e){e.DRAFT="DRAFT",e.PUBLISHED="PUBLISHED"})(Ft||(Ft={}));var Ue;(function(e){e.V2="UCv2",e.V3="UCv3"})(Ue||(Ue={}));var Q;(function(e){e.CHECKOUT="checkout",e.CHECKOUT_EMAIL="checkout/email",e.SEGMENTATION="segmentation",e.BUNDLE="bundle",e.COMMITMENT="commitment",e.RECOMMENDATION="recommendation",e.EMAIL="email",e.PAYMENT="payment",e.CHANGE_PLAN_TEAM_PLANS="change-plan/team-upgrade/plans",e.CHANGE_PLAN_TEAM_PAYMENT="change-plan/team-upgrade/payment"})(Q||(Q={}));var ci=function(e){var t;return(t=Sc.get(e))!==null&&t!==void 0?t:e},Sc=new Map([["countrySpecific","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["offerType","ot"],["marketSegment","ms"]]);var fa=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},ga=function(e,t){var r=typeof Symbol=="function"&&e[Symbol.iterator];if(!r)return e;var n=r.call(e),i,o=[],a;try{for(;(t===void 0||t-- >0)&&!(i=n.next()).done;)o.push(i.value)}catch(s){a={error:s}}finally{try{i&&!i.done&&(r=n.return)&&r.call(n)}finally{if(a)throw a.error}}return o};function mt(e,t,r){var n,i;try{for(var o=fa(Object.entries(e)),a=o.next();!a.done;a=o.next()){var s=ga(a.value,2),c=s[0],h=s[1],l=ci(c);h!=null&&r.has(l)&&t.set(l,h)}}catch(d){n={error:d}}finally{try{a&&!a.done&&(i=o.return)&&i.call(o)}finally{if(n)throw n.error}}}function kr(e){switch(e){case zt.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function Ir(e,t){var r,n;for(var i in e){var o=e[i];try{for(var a=(r=void 0,fa(Object.entries(o))),s=a.next();!s.done;s=a.next()){var c=ga(s.value,2),h=c[0],l=c[1];if(l!=null){var d=ci(h);t.set("items["+i+"]["+d+"]",l)}}}catch(u){r={error:u}}finally{try{s&&!s.done&&(n=a.return)&&n.call(a)}finally{if(r)throw r.error}}}}var yc=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,n=Object.getOwnPropertySymbols(e);i<n.length;i++)t.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(e,n[i])&&(r[n[i]]=e[n[i]]);return r},Tc=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};function xa(e){wc(e);var t=e.env,r=e.items,n=e.workflowStep,i=yc(e,["env","items","workflowStep"]),o=new URL(kr(t));return o.pathname=n+"/",Ir(r,o.searchParams),mt(i,o.searchParams,Lc),o.toString()}var Lc=new Set(["cli","co","lang","ctx","cUrl","mv","nglwfdata","otac","promoid","rUrl","sdid","spint","trackingid","code","campaignid","appctxid"]),_c=["env","workflowStep","clientId","country","items"];function wc(e){var t,r;try{for(var n=Tc(_c),i=n.next();!i.done;i=n.next()){var o=i.value;if(!e[o])throw new Error('Argument "checkoutData" is not valid, missing: '+o)}}catch(a){t={error:a}}finally{try{i&&!i.done&&(r=n.return)&&r.call(n)}finally{if(t)throw t.error}}return!0}var Pc=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,n=Object.getOwnPropertySymbols(e);i<n.length;i++)t.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(e,n[i])&&(r[n[i]]=e[n[i]]);return r},Cc=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},kc="p_draft_landscape",Ic="/store/";function hi(e){Oc(e);var t=e.env,r=e.items,n=e.workflowStep,i=e.ms,o=e.marketSegment,a=e.ot,s=e.offerType,c=e.pa,h=e.productArrangementCode,l=e.landscape,d=Pc(e,["env","items","workflowStep","ms","marketSegment","ot","offerType","pa","productArrangementCode","landscape"]),u={marketSegment:o??i,offerType:s??a,productArrangementCode:h??c},m=new URL(kr(t));return m.pathname=""+Ic+n,n!==Q.SEGMENTATION&&n!==Q.CHANGE_PLAN_TEAM_PLANS&&Ir(r,m.searchParams),n===Q.SEGMENTATION&&mt(u,m.searchParams,li),mt(d,m.searchParams,li),l===Ft.DRAFT&&mt({af:kc},m.searchParams,li),m.toString()}var li=new Set(["af","ai","apc","appctxid","cli","co","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),Nc=["env","workflowStep","clientId","country"];function Oc(e){var t,r;try{for(var n=Cc(Nc),i=n.next();!i.done;i=n.next()){var o=i.value;if(!e[o])throw new Error('Argument "checkoutData" is not valid, missing: '+o)}}catch(a){t={error:a}}finally{try{i&&!i.done&&(r=n.return)&&r.call(n)}finally{if(t)throw t.error}}if(e.workflowStep!==Q.SEGMENTATION&&e.workflowStep!==Q.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}function di(e,t){switch(e){case Ue.V2:return xa(t);case Ue.V3:return hi(t);default:return console.warn("Unsupported CheckoutType, will use UCv3 as default. Given type: "+e),hi(t)}}var ui;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(ui||(ui={}));var U;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(U||(U={}));var N;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(N||(N={}));var mi;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(mi||(mi={}));var pi;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(pi||(pi={}));var fi;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(fi||(fi={}));var gi;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(gi||(gi={}));var va="tacocat.js";var Nr=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),ba=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function O(e,t={},{metadata:r=!0,search:n=!0,storage:i=!0}={}){let o;if(n&&o==null){let a=new URLSearchParams(window.location.search),s=pt(n)?n:e;o=a.get(s)}if(i&&o==null){let a=pt(i)?i:e;o=window.sessionStorage.getItem(a)??window.localStorage.getItem(a)}if(r&&o==null){let a=Rc(pt(r)?r:e);o=document.documentElement.querySelector(`meta[name="${a}"]`)?.content}return o??t[e]}var ft=()=>{};var Aa=e=>typeof e=="boolean",Bt=e=>typeof e=="function",Or=e=>typeof e=="number",Ea=e=>e!=null&&typeof e=="object";var pt=e=>typeof e=="string",xi=e=>pt(e)&&e,gt=e=>Or(e)&&Number.isFinite(e)&&e>0;function xt(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,n])=>{t(n)&&delete e[r]}),e}function S(e,t){if(Aa(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function Te(e,t,r){let n=Object.values(t);return n.find(i=>Nr(i,e))??r??n[0]}function Rc(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,n)=>`${r}-${n}`).replace(/\W+/gu,"-").toLowerCase()}function vt(e,t=1){return Or(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var $c=Date.now(),vi=()=>`(+${Date.now()-$c}ms)`,Rr=new Set,Vc=S(O("tacocat.debug",{},{metadata:!1}),typeof process<"u"&&process.env?.DEBUG);function Sa(e){let t=`[${va}/${e}]`,r=(a,s,...c)=>a?!0:(i(s,...c),!1),n=Vc?(a,...s)=>{console.debug(`${t} ${a}`,...s,vi())}:()=>{},i=(a,...s)=>{let c=`${t} ${a}`;Rr.forEach(([h])=>h(c,...s))};return{assert:r,debug:n,error:i,warn:(a,...s)=>{let c=`${t} ${a}`;Rr.forEach(([,h])=>h(c,...s))}}}function Mc(e,t){let r=[e,t];return Rr.add(r),()=>{Rr.delete(r)}}Mc((e,...t)=>{console.error(e,...t,vi())},(e,...t)=>{console.warn(e,...t,vi())});var Uc="no promo",ya="promo-tag",Dc="yellow",Gc="neutral",Hc=(e,t,r)=>{let n=o=>o||Uc,i=r?` (was "${n(t)}")`:"";return`${n(e)}${i}`},zc="cancel-context",Kt=(e,t)=>{let r=e===zc,n=!r&&e?.length>0,i=(n||r)&&(t&&t!=e||!t&&!r),o=i&&n||!i&&!!t,a=o?e||t:void 0;return{effectivePromoCode:a,overridenPromoCode:e,className:o?ya:`${ya} no-promo`,text:Hc(a,t,i),variant:o?Dc:Gc,isOverriden:i}};var bi="ABM",Ai="PUF",Ei="M2M",Si="PERPETUAL",yi="P3Y",Fc="TAX_INCLUSIVE_DETAILS",Bc="TAX_EXCLUSIVE",Ta={ABM:bi,PUF:Ai,M2M:Ei,PERPETUAL:Si,P3Y:yi},km={[bi]:{commitment:U.YEAR,term:N.MONTHLY},[Ai]:{commitment:U.YEAR,term:N.ANNUAL},[Ei]:{commitment:U.MONTH,term:N.MONTHLY},[Si]:{commitment:U.PERPETUAL,term:void 0},[yi]:{commitment:U.THREE_MONTHS,term:N.P3Y}},La="Value is not an offer",$r=e=>{if(typeof e!="object")return La;let{commitment:t,term:r}=e,n=Kc(t,r);return{...e,planType:n}};var Kc=(e,t)=>{switch(e){case void 0:return La;case"":return"";case U.YEAR:return t===N.MONTHLY?bi:t===N.ANNUAL?Ai:"";case U.MONTH:return t===N.MONTHLY?Ei:"";case U.PERPETUAL:return Si;case U.TERM_LICENSE:return t===N.P3Y?yi:"";default:return""}};function Ti(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:n,priceWithoutTax:i,priceWithoutDiscountAndTax:o,taxDisplay:a}=t;if(a!==Fc)return e;let s={...e,priceDetails:{...t,price:i??r,priceWithoutDiscount:o??n,taxDisplay:Bc}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var Li=function(e,t){return Li=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(r[i]=n[i])},Li(e,t)};function jt(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");Li(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var y=function(){return y=Object.assign||function(t){for(var r,n=1,i=arguments.length;n<i;n++){r=arguments[n];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o])}return t},y.apply(this,arguments)};function Vr(e,t,r){if(r||arguments.length===2)for(var n=0,i=t.length,o;n<i;n++)(o||!(n in t))&&(o||(o=Array.prototype.slice.call(t,0,n)),o[n]=t[n]);return e.concat(o||Array.prototype.slice.call(t))}var b;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(b||(b={}));var P;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(P||(P={}));var De;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(De||(De={}));function _i(e){return e.type===P.literal}function _a(e){return e.type===P.argument}function Mr(e){return e.type===P.number}function Ur(e){return e.type===P.date}function Dr(e){return e.type===P.time}function Gr(e){return e.type===P.select}function Hr(e){return e.type===P.plural}function wa(e){return e.type===P.pound}function zr(e){return e.type===P.tag}function Fr(e){return!!(e&&typeof e=="object"&&e.type===De.number)}function Yt(e){return!!(e&&typeof e=="object"&&e.type===De.dateTime)}var wi=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var jc=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function Pa(e){var t={};return e.replace(jc,function(r){var n=r.length;switch(r[0]){case"G":t.era=n===4?"long":n===5?"narrow":"short";break;case"y":t.year=n===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][n-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][n-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=n===4?"short":n===5?"narrow":"short";break;case"e":if(n<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"c":if(n<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][n-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][n-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][n-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][n-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][n-1];break;case"s":t.second=["numeric","2-digit"][n-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=n<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var Ca=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function Oa(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(Ca).filter(function(u){return u.length>0}),r=[],n=0,i=t;n<i.length;n++){var o=i[n],a=o.split("/");if(a.length===0)throw new Error("Invalid number skeleton");for(var s=a[0],c=a.slice(1),h=0,l=c;h<l.length;h++){var d=l[h];if(d.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:c})}return r}function Yc(e){return e.replace(/^(.*?)-/,"")}var ka=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,Ra=/^(@+)?(\+|#+)?$/g,Xc=/(\*)(0+)|(#+)(0+)|(0+)/g,$a=/^(0+)$/;function Ia(e){var t={};return e.replace(Ra,function(r,n,i){return typeof i!="string"?(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length):i==="+"?t.minimumSignificantDigits=n.length:n[0]==="#"?t.maximumSignificantDigits=n.length:(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length+(typeof i=="string"?i.length:0)),""}),t}function Va(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function Wc(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!$a.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function Na(e){var t={},r=Va(e);return r||t}function Ma(e){for(var t={},r=0,n=e;r<n.length;r++){var i=n[r];switch(i.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=i.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=Yc(i.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=y(y(y({},t),{notation:"scientific"}),i.options.reduce(function(s,c){return y(y({},s),Na(c))},{}));continue;case"engineering":t=y(y(y({},t),{notation:"engineering"}),i.options.reduce(function(s,c){return y(y({},s),Na(c))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(i.options[0]);continue;case"integer-width":if(i.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");i.options[0].replace(Xc,function(s,c,h,l,d,u){if(c)t.minimumIntegerDigits=h.length;else{if(l&&d)throw new Error("We currently do not support maximum integer digits");if(u)throw new Error("We currently do not support exact integer digits")}return""});continue}if($a.test(i.stem)){t.minimumIntegerDigits=i.stem.length;continue}if(ka.test(i.stem)){if(i.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");i.stem.replace(ka,function(s,c,h,l,d,u){return h==="*"?t.minimumFractionDigits=c.length:l&&l[0]==="#"?t.maximumFractionDigits=l.length:d&&u?(t.minimumFractionDigits=d.length,t.maximumFractionDigits=d.length+u.length):(t.minimumFractionDigits=c.length,t.maximumFractionDigits=c.length),""}),i.options.length&&(t=y(y({},t),Ia(i.options[0])));continue}if(Ra.test(i.stem)){t=y(y({},t),Ia(i.stem));continue}var o=Va(i.stem);o&&(t=y(y({},t),o));var a=Wc(i.stem);a&&(t=y(y({},t),a))}return t}var Pi,qc=new RegExp("^"+wi.source+"*"),Zc=new RegExp(wi.source+"*$");function A(e,t){return{start:e,end:t}}var Jc=!!String.prototype.startsWith,Qc=!!String.fromCodePoint,el=!!Object.fromEntries,tl=!!String.prototype.codePointAt,rl=!!String.prototype.trimStart,nl=!!String.prototype.trimEnd,il=!!Number.isSafeInteger,ol=il?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},ki=!0;try{Ua=za("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),ki=((Pi=Ua.exec("a"))===null||Pi===void 0?void 0:Pi[0])==="a"}catch{ki=!1}var Ua,Da=Jc?function(t,r,n){return t.startsWith(r,n)}:function(t,r,n){return t.slice(n,n+r.length)===r},Ii=Qc?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var n="",i=t.length,o=0,a;i>o;){if(a=t[o++],a>1114111)throw RangeError(a+" is not a valid code point");n+=a<65536?String.fromCharCode(a):String.fromCharCode(((a-=65536)>>10)+55296,a%1024+56320)}return n},Ga=el?Object.fromEntries:function(t){for(var r={},n=0,i=t;n<i.length;n++){var o=i[n],a=o[0],s=o[1];r[a]=s}return r},Ha=tl?function(t,r){return t.codePointAt(r)}:function(t,r){var n=t.length;if(!(r<0||r>=n)){var i=t.charCodeAt(r),o;return i<55296||i>56319||r+1===n||(o=t.charCodeAt(r+1))<56320||o>57343?i:(i-55296<<10)+(o-56320)+65536}},al=rl?function(t){return t.trimStart()}:function(t){return t.replace(qc,"")},sl=nl?function(t){return t.trimEnd()}:function(t){return t.replace(Zc,"")};function za(e,t){return new RegExp(e,t)}var Ni;ki?(Ci=za("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),Ni=function(t,r){var n;Ci.lastIndex=r;var i=Ci.exec(t);return(n=i[1])!==null&&n!==void 0?n:""}):Ni=function(t,r){for(var n=[];;){var i=Ha(t,r);if(i===void 0||Ba(i)||hl(i))break;n.push(i),r+=i>=65536?2:1}return Ii.apply(void 0,n)};var Ci,Fa=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,n){for(var i=[];!this.isEOF();){var o=this.char();if(o===123){var a=this.parseArgument(t,n);if(a.err)return a;i.push(a.val)}else{if(o===125&&t>0)break;if(o===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),i.push({type:P.pound,location:A(s,this.clonePosition())})}else if(o===60&&!this.ignoreTag&&this.peek()===47){if(n)break;return this.error(b.UNMATCHED_CLOSING_TAG,A(this.clonePosition(),this.clonePosition()))}else if(o===60&&!this.ignoreTag&&Oi(this.peek()||0)){var a=this.parseTag(t,r);if(a.err)return a;i.push(a.val)}else{var a=this.parseLiteral(t,r);if(a.err)return a;i.push(a.val)}}}return{val:i,err:null}},e.prototype.parseTag=function(t,r){var n=this.clonePosition();this.bump();var i=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:P.literal,value:"<"+i+"/>",location:A(n,this.clonePosition())},err:null};if(this.bumpIf(">")){var o=this.parseMessage(t+1,r,!0);if(o.err)return o;var a=o.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!Oi(this.char()))return this.error(b.INVALID_TAG,A(s,this.clonePosition()));var c=this.clonePosition(),h=this.parseTagName();return i!==h?this.error(b.UNMATCHED_CLOSING_TAG,A(c,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:P.tag,value:i,children:a,location:A(n,this.clonePosition())},err:null}:this.error(b.INVALID_TAG,A(s,this.clonePosition())))}else return this.error(b.UNCLOSED_TAG,A(n,this.clonePosition()))}else return this.error(b.INVALID_TAG,A(n,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&ll(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var n=this.clonePosition(),i="";;){var o=this.tryParseQuote(r);if(o){i+=o;continue}var a=this.tryParseUnquoted(t,r);if(a){i+=a;continue}var s=this.tryParseLeftAngleBracket();if(s){i+=s;continue}break}var c=A(n,this.clonePosition());return{val:{type:P.literal,value:i,location:c},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!cl(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var n=this.char();if(n===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(n);this.bump()}return Ii.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var n=this.char();return n===60||n===123||n===35&&(r==="plural"||r==="selectordinal")||n===125&&t>0?null:(this.bump(),Ii(n))},e.prototype.parseArgument=function(t,r){var n=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,A(n,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(b.EMPTY_ARGUMENT,A(n,this.clonePosition()));var i=this.parseIdentifierIfPossible().value;if(!i)return this.error(b.MALFORMED_ARGUMENT,A(n,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,A(n,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:P.argument,value:i,location:A(n,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,A(n,this.clonePosition())):this.parseArgumentOptions(t,r,i,n);default:return this.error(b.MALFORMED_ARGUMENT,A(n,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),n=Ni(this.message,r),i=r+n.length;this.bumpTo(i);var o=this.clonePosition(),a=A(t,o);return{value:n,location:a}},e.prototype.parseArgumentOptions=function(t,r,n,i){var o,a=this.clonePosition(),s=this.parseIdentifierIfPossible().value,c=this.clonePosition();switch(s){case"":return this.error(b.EXPECT_ARGUMENT_TYPE,A(a,c));case"number":case"date":case"time":{this.bumpSpace();var h=null;if(this.bumpIf(",")){this.bumpSpace();var l=this.clonePosition(),d=this.parseSimpleArgStyleIfPossible();if(d.err)return d;var u=sl(d.val);if(u.length===0)return this.error(b.EXPECT_ARGUMENT_STYLE,A(this.clonePosition(),this.clonePosition()));var m=A(l,this.clonePosition());h={style:u,styleLocation:m}}var f=this.tryParseArgumentClose(i);if(f.err)return f;var g=A(i,this.clonePosition());if(h&&Da(h?.style,"::",0)){var T=al(h.style.slice(2));if(s==="number"){var d=this.parseNumberSkeletonFromString(T,h.styleLocation);return d.err?d:{val:{type:P.number,value:n,location:g,style:d.val},err:null}}else{if(T.length===0)return this.error(b.EXPECT_DATE_TIME_SKELETON,g);var u={type:De.dateTime,pattern:T,location:h.styleLocation,parsedOptions:this.shouldParseSkeletons?Pa(T):{}},w=s==="date"?P.date:P.time;return{val:{type:w,value:n,location:g,style:u},err:null}}}return{val:{type:s==="number"?P.number:s==="date"?P.date:P.time,value:n,location:g,style:(o=h?.style)!==null&&o!==void 0?o:null},err:null}}case"plural":case"selectordinal":case"select":{var v=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(b.EXPECT_SELECT_ARGUMENT_OPTIONS,A(v,y({},v)));this.bumpSpace();var E=this.parseIdentifierIfPossible(),R=0;if(s!=="select"&&E.value==="offset"){if(!this.bumpIf(":"))return this.error(b.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,A(this.clonePosition(),this.clonePosition()));this.bumpSpace();var d=this.tryParseDecimalInteger(b.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,b.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(d.err)return d;this.bumpSpace(),E=this.parseIdentifierIfPossible(),R=d.val}var C=this.tryParsePluralOrSelectOptions(t,s,r,E);if(C.err)return C;var f=this.tryParseArgumentClose(i);if(f.err)return f;var z=A(i,this.clonePosition());return s==="select"?{val:{type:P.select,value:n,options:Ga(C.val),location:z},err:null}:{val:{type:P.plural,value:n,options:Ga(C.val),offset:R,pluralType:s==="plural"?"cardinal":"ordinal",location:z},err:null}}default:return this.error(b.INVALID_ARGUMENT_TYPE,A(a,c))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,A(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var n=this.char();switch(n){case 39:{this.bump();var i=this.clonePosition();if(!this.bumpUntil("'"))return this.error(b.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,A(i,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var n=[];try{n=Oa(t)}catch{return this.error(b.INVALID_NUMBER_SKELETON,r)}return{val:{type:De.number,tokens:n,location:r,parsedOptions:this.shouldParseSkeletons?Ma(n):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,n,i){for(var o,a=!1,s=[],c=new Set,h=i.value,l=i.location;;){if(h.length===0){var d=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var u=this.tryParseDecimalInteger(b.EXPECT_PLURAL_ARGUMENT_SELECTOR,b.INVALID_PLURAL_ARGUMENT_SELECTOR);if(u.err)return u;l=A(d,this.clonePosition()),h=this.message.slice(d.offset,this.offset())}else break}if(c.has(h))return this.error(r==="select"?b.DUPLICATE_SELECT_ARGUMENT_SELECTOR:b.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,l);h==="other"&&(a=!0),this.bumpSpace();var m=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?b.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:b.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,A(this.clonePosition(),this.clonePosition()));var f=this.parseMessage(t+1,r,n);if(f.err)return f;var g=this.tryParseArgumentClose(m);if(g.err)return g;s.push([h,{value:f.val,location:A(m,this.clonePosition())}]),c.add(h),this.bumpSpace(),o=this.parseIdentifierIfPossible(),h=o.value,l=o.location}return s.length===0?this.error(r==="select"?b.EXPECT_SELECT_ARGUMENT_SELECTOR:b.EXPECT_PLURAL_ARGUMENT_SELECTOR,A(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!a?this.error(b.MISSING_OTHER_CLAUSE,A(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var n=1,i=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(n=-1);for(var o=!1,a=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)o=!0,a=a*10+(s-48),this.bump();else break}var c=A(i,this.clonePosition());return o?(a*=n,ol(a)?{val:a,err:null}:this.error(r,c)):this.error(t,c)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=Ha(this.message,t);if(r===void 0)throw Error("Offset "+t+" is at invalid UTF-16 code unit boundary");return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(Da(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),n=this.message.indexOf(t,r);return n>=0?(this.bumpTo(n),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset "+t+" must be greater than or equal to the current offset "+this.offset());for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset "+t+" is at invalid UTF-16 code unit boundary");if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&Ba(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),n=this.message.charCodeAt(r+(t>=65536?2:1));return n??null},e}();function Oi(e){return e>=97&&e<=122||e>=65&&e<=90}function cl(e){return Oi(e)||e===47}function ll(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function Ba(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function hl(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function Ri(e){e.forEach(function(t){if(delete t.location,Gr(t)||Hr(t))for(var r in t.options)delete t.options[r].location,Ri(t.options[r].value);else Mr(t)&&Fr(t.style)||(Ur(t)||Dr(t))&&Yt(t.style)?delete t.style.location:zr(t)&&Ri(t.children)})}function Ka(e,t){t===void 0&&(t={}),t=y({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new Fa(e,t).parse();if(r.err){var n=SyntaxError(b[r.err.kind]);throw n.location=r.err.location,n.originalMessage=r.err.message,n}return t?.captureLocation||Ri(r.val),r.val}function Xt(e,t){var r=t&&t.cache?t.cache:gl,n=t&&t.serializer?t.serializer:fl,i=t&&t.strategy?t.strategy:ul;return i(e,{cache:r,serializer:n})}function dl(e){return e==null||typeof e=="number"||typeof e=="boolean"}function ja(e,t,r,n){var i=dl(n)?n:r(n),o=t.get(i);return typeof o>"u"&&(o=e.call(this,n),t.set(i,o)),o}function Ya(e,t,r){var n=Array.prototype.slice.call(arguments,3),i=r(n),o=t.get(i);return typeof o>"u"&&(o=e.apply(this,n),t.set(i,o)),o}function $i(e,t,r,n,i){return r.bind(t,e,n,i)}function ul(e,t){var r=e.length===1?ja:Ya;return $i(e,this,r,t.cache.create(),t.serializer)}function ml(e,t){return $i(e,this,Ya,t.cache.create(),t.serializer)}function pl(e,t){return $i(e,this,ja,t.cache.create(),t.serializer)}var fl=function(){return JSON.stringify(arguments)};function Vi(){this.cache=Object.create(null)}Vi.prototype.get=function(e){return this.cache[e]};Vi.prototype.set=function(e,t){this.cache[e]=t};var gl={create:function(){return new Vi}},Br={variadic:ml,monadic:pl};var Ge;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(Ge||(Ge={}));var Wt=function(e){jt(t,e);function t(r,n,i){var o=e.call(this,r)||this;return o.code=n,o.originalMessage=i,o}return t.prototype.toString=function(){return"[formatjs Error: "+this.code+"] "+this.message},t}(Error);var Mi=function(e){jt(t,e);function t(r,n,i,o){return e.call(this,'Invalid values for "'+r+'": "'+n+'". Options are "'+Object.keys(i).join('", "')+'"',Ge.INVALID_VALUE,o)||this}return t}(Wt);var Xa=function(e){jt(t,e);function t(r,n,i){return e.call(this,'Value for "'+r+'" must be of type '+n,Ge.INVALID_VALUE,i)||this}return t}(Wt);var Wa=function(e){jt(t,e);function t(r,n){return e.call(this,'The intl string context variable "'+r+'" was not provided to the string "'+n+'"',Ge.MISSING_VALUE,n)||this}return t}(Wt);var B;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(B||(B={}));function xl(e){return e.length<2?e:e.reduce(function(t,r){var n=t[t.length-1];return!n||n.type!==B.literal||r.type!==B.literal?t.push(r):n.value+=r.value,t},[])}function vl(e){return typeof e=="function"}function qt(e,t,r,n,i,o,a){if(e.length===1&&_i(e[0]))return[{type:B.literal,value:e[0].value}];for(var s=[],c=0,h=e;c<h.length;c++){var l=h[c];if(_i(l)){s.push({type:B.literal,value:l.value});continue}if(wa(l)){typeof o=="number"&&s.push({type:B.literal,value:r.getNumberFormat(t).format(o)});continue}var d=l.value;if(!(i&&d in i))throw new Wa(d,a);var u=i[d];if(_a(l)){(!u||typeof u=="string"||typeof u=="number")&&(u=typeof u=="string"||typeof u=="number"?String(u):""),s.push({type:typeof u=="string"?B.literal:B.object,value:u});continue}if(Ur(l)){var m=typeof l.style=="string"?n.date[l.style]:Yt(l.style)?l.style.parsedOptions:void 0;s.push({type:B.literal,value:r.getDateTimeFormat(t,m).format(u)});continue}if(Dr(l)){var m=typeof l.style=="string"?n.time[l.style]:Yt(l.style)?l.style.parsedOptions:void 0;s.push({type:B.literal,value:r.getDateTimeFormat(t,m).format(u)});continue}if(Mr(l)){var m=typeof l.style=="string"?n.number[l.style]:Fr(l.style)?l.style.parsedOptions:void 0;m&&m.scale&&(u=u*(m.scale||1)),s.push({type:B.literal,value:r.getNumberFormat(t,m).format(u)});continue}if(zr(l)){var f=l.children,g=l.value,T=i[g];if(!vl(T))throw new Xa(g,"function",a);var w=qt(f,t,r,n,i,o),v=T(w.map(function(C){return C.value}));Array.isArray(v)||(v=[v]),s.push.apply(s,v.map(function(C){return{type:typeof C=="string"?B.literal:B.object,value:C}}))}if(Gr(l)){var E=l.options[u]||l.options.other;if(!E)throw new Mi(l.value,u,Object.keys(l.options),a);s.push.apply(s,qt(E.value,t,r,n,i));continue}if(Hr(l)){var E=l.options["="+u];if(!E){if(!Intl.PluralRules)throw new Wt(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,Ge.MISSING_INTL_API,a);var R=r.getPluralRules(t,{type:l.pluralType}).select(u-(l.offset||0));E=l.options[R]||l.options.other}if(!E)throw new Mi(l.value,u,Object.keys(l.options),a);s.push.apply(s,qt(E.value,t,r,n,i,u-(l.offset||0)));continue}}return xl(s)}function bl(e,t){return t?y(y(y({},e||{}),t||{}),Object.keys(e).reduce(function(r,n){return r[n]=y(y({},e[n]),t[n]||{}),r},{})):e}function Al(e,t){return t?Object.keys(e).reduce(function(r,n){return r[n]=bl(e[n],t[n]),r},y({},e)):e}function Ui(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function El(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:Xt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.NumberFormat).bind.apply(t,Vr([void 0],r)))},{cache:Ui(e.number),strategy:Br.variadic}),getDateTimeFormat:Xt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.DateTimeFormat).bind.apply(t,Vr([void 0],r)))},{cache:Ui(e.dateTime),strategy:Br.variadic}),getPluralRules:Xt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.PluralRules).bind.apply(t,Vr([void 0],r)))},{cache:Ui(e.pluralRules),strategy:Br.variadic})}}var qa=function(){function e(t,r,n,i){var o=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(a){var s=o.formatToParts(a);if(s.length===1)return s[0].value;var c=s.reduce(function(h,l){return!h.length||l.type!==B.literal||typeof h[h.length-1]!="string"?h.push(l.value):h[h.length-1]+=l.value,h},[]);return c.length<=1?c[0]||"":c},this.formatToParts=function(a){return qt(o.ast,o.locales,o.formatters,o.formats,a,void 0,o.message)},this.resolvedOptions=function(){return{locale:Intl.NumberFormat.supportedLocalesOf(o.locales)[0]}},this.getAst=function(){return o.ast},typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:i?.ignoreTag})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Al(e.formats,n),this.locales=r,this.formatters=i&&i.formatters||El(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.__parse=Ka,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var Za=qa;var Sl=/[0-9\-+#]/,yl=/[^\d\-+#]/g;function Ja(e){return e.search(Sl)}function Tl(e="#.##"){let t={},r=e.length,n=Ja(e);t.prefix=n>0?e.substring(0,n):"";let i=Ja(e.split("").reverse().join("")),o=r-i,a=e.substring(o,o+1),s=o+(a==="."||a===","?1:0);t.suffix=i>0?e.substring(s,r):"",t.mask=e.substring(n,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let c=t.mask.match(yl);return t.decimal=c&&c[c.length-1]||".",t.separator=c&&c[1]&&c[0]||",",c=t.mask.split(t.decimal),t.integer=c[0],t.fraction=c[1],t}function Ll(e,t,r){let n=!1,i={value:e};e<0&&(n=!0,i.value=-i.value),i.sign=n?"-":"",i.value=Number(i.value).toFixed(t.fraction&&t.fraction.length),i.value=Number(i.value).toString();let o=t.fraction&&t.fraction.lastIndexOf("0"),[a="0",s=""]=i.value.split(".");return(!s||s&&s.length<=o)&&(s=o<0?"":(+("0."+s)).toFixed(o+1).replace("0.","")),i.integer=a,i.fraction=s,_l(i,t),(i.result==="0"||i.result==="")&&(n=!1,i.sign=""),!n&&t.maskHasPositiveSign?i.sign="+":n&&t.maskHasPositiveSign?i.sign="-":n&&(i.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),i}function _l(e,t){e.result="";let r=t.integer.split(t.separator),n=r.join(""),i=n&&n.indexOf("0");if(i>-1)for(;e.integer.length<n.length-i;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let o=r[1]&&r[r.length-1].length;if(o){let a=e.integer.length,s=a%o;for(let c=0;c<a;c++)e.result+=e.integer.charAt(c),!((c-s+1)%o)&&c<a-o&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function wl(e,t,r={}){if(!e||isNaN(Number(t)))return t;let n=Tl(e),i=Ll(t,n,r);return n.prefix+i.sign+i.result+n.suffix}var Qa=wl;var es=".",Pl=",",rs=/^\s+/,ns=/\s+$/,ts="&nbsp;",Di=e=>e*12,is=(e,t)=>{let{start:r,end:n,displaySummary:{amount:i,duration:o,minProductQuantity:a,outcomeType:s}={}}=e;if(!(i&&o&&s&&a))return!1;let c=t?new Date(t):new Date;if(!r||!n)return!1;let h=new Date(r),l=new Date(n);return c>=h&&c<=l},He={MONTH:"MONTH",YEAR:"YEAR"},Cl={[N.ANNUAL]:12,[N.MONTHLY]:1,[N.THREE_YEARS]:36,[N.TWO_YEARS]:24},Gi=(e,t)=>({accept:e,round:t}),kl=[Gi(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),Gi(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.round(t/e*100)/100),Gi(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],Hi={[U.YEAR]:{[N.MONTHLY]:He.MONTH,[N.ANNUAL]:He.YEAR},[U.MONTH]:{[N.MONTHLY]:He.MONTH}},Il=(e,t)=>e.indexOf(`'${t}'`)===0,Nl=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),n=as(r);return!!n?t||(r=r.replace(/[,\.]0+/,n)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+Rl(e)),r},Ol=e=>{let t=$l(e),r=Il(e,t),n=e.replace(/'.*?'/,""),i=rs.test(n)||ns.test(n);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:i}},os=e=>e.replace(rs,ts).replace(ns,ts),Rl=e=>e.match(/#(.?)#/)?.[1]===es?Pl:es,$l=e=>e.match(/'(.*?)'/)?.[1]??"",as=e=>e.match(/0(.?)0/)?.[1]??"";function bt({formatString:e,price:t,usePrecision:r,isIndianPrice:n=!1},i,o=a=>a){let{currencySymbol:a,isCurrencyFirst:s,hasCurrencySpace:c}=Ol(e),h=r?as(e):"",l=Nl(e,r),d=r?2:0,u=o(t,{currencySymbol:a}),m=n?u.toLocaleString("hi-IN",{minimumFractionDigits:d,maximumFractionDigits:d}):Qa(l,u),f=r?m.lastIndexOf(h):m.length,g=m.substring(0,f),T=m.substring(f+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,m).replace(/SYMBOL/,a),currencySymbol:a,decimals:T,decimalsDelimiter:h,hasCurrencySpace:c,integer:g,isCurrencyFirst:s,recurrenceTerm:i}}var ss=e=>{let{commitment:t,term:r,usePrecision:n}=e,i=Cl[r]??1;return bt(e,i>1?He.MONTH:Hi[t]?.[r],o=>{let a={divisor:i,price:o,usePrecision:n},{round:s}=kl.find(({accept:c})=>c(a));if(!s)throw new Error(`Missing rounding rule for: ${JSON.stringify(a)}`);return s(a)})},cs=({commitment:e,term:t,...r})=>bt(r,Hi[e]?.[t]),ls=e=>{let{commitment:t,instant:r,price:n,originalPrice:i,priceWithoutDiscount:o,promotion:a,quantity:s=1,term:c}=e;if(t===U.YEAR&&c===N.MONTHLY){if(!a)return bt(e,He.YEAR,Di);let{displaySummary:{outcomeType:h,duration:l,minProductQuantity:d=1}={}}=a;switch(h){case"PERCENTAGE_DISCOUNT":if(s>=d&&is(a,r)){let u=parseInt(l.replace("P","").replace("M",""));if(isNaN(u))return Di(n);let m=s*i*u,f=s*o*(12-u),g=Math.floor((m+f)*100)/100;return bt({...e,price:g},He.YEAR)}default:return bt(e,He.YEAR,()=>Di(o??n))}}return bt(e,Hi[t]?.[c])};var Vl={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at {alternativePrice}",strikethroughAriaLabel:"Regularly at {strikethroughPrice}"},Ml=Sa("ConsonantTemplates/price"),Ul=/<\/?[^>]+(>|$)/g,H={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},ze={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel"},Dl="TAX_EXCLUSIVE",Gl=e=>Ea(e)?Object.entries(e).filter(([,t])=>pt(t)||Or(t)||t===!0).reduce((t,[r,n])=>t+` ${r}${n===!0?"":'="'+ba(n)+'"'}`,""):"",j=(e,t,r,n=!1)=>`<span class="${e}${t?"":" "+H.disabled}"${Gl(r)}>${n?os(t):t??""}</span>`;function Hl(e,{accessibleLabel:t,currencySymbol:r,decimals:n,decimalsDelimiter:i,hasCurrencySpace:o,integer:a,isCurrencyFirst:s,recurrenceLabel:c,perUnitLabel:h,taxInclusivityLabel:l},d={}){let u=j(H.currencySymbol,r),m=j(H.currencySpace,o?"&nbsp;":""),f="";return s&&(f+=u+m),f+=j(H.integer,a),f+=j(H.decimalsDelimiter,i),f+=j(H.decimals,n),s||(f+=m+u),f+=j(H.recurrence,c,null,!0),f+=j(H.unitType,h,null,!0),f+=j(H.taxInclusivity,l,!0),j(e,f,{...d,"aria-label":t})}var q=({displayOptical:e=!1,displayStrikethrough:t=!1,displayAnnual:r=!1,instant:n=void 0}={})=>({country:i,displayFormatted:o=!0,displayRecurrence:a=!0,displayPerUnit:s=!1,displayTax:c=!1,language:h,literals:l={},quantity:d=1}={},{commitment:u,offerSelectorIds:m,formatString:f,price:g,priceWithoutDiscount:T,taxDisplay:w,taxTerm:v,term:E,usePrecision:R,promotion:C}={},z={})=>{Object.entries({country:i,formatString:f,language:h,price:g}).forEach(([oe,tn])=>{if(tn==null)throw new Error(`Argument "${oe}" is missing for osi ${m?.toString()}, country ${i}, language ${h}`)});let F={...Vl,...l},ue=`${h.toLowerCase()}-${i.toUpperCase()}`;function Z(oe,tn){let rn=F[oe];if(rn==null)return"";try{return new Za(rn.replace(Ul,""),ue).format(tn)}catch{return Ml.error("Failed to format literal:",rn),""}}let Tt=t&&T?T:g,Xe=e?ss:cs;r&&(Xe=ls);let{accessiblePrice:Lt,recurrenceTerm:me,...pe}=Xe({commitment:u,formatString:f,instant:n,isIndianPrice:i==="IN",originalPrice:g,priceWithoutDiscount:T,price:e?g:Tt,promotion:C,quantity:d,term:E,usePrecision:R}),J=Lt,_t="";if(S(a)&&me){let oe=Z(ze.recurrenceAriaLabel,{recurrenceTerm:me});oe&&(J+=" "+oe),_t=Z(ze.recurrenceLabel,{recurrenceTerm:me})}let en="";if(S(s)){en=Z(ze.perUnitLabel,{perUnit:"LICENSE"});let oe=Z(ze.perUnitAriaLabel,{perUnit:"LICENSE"});oe&&(J+=" "+oe)}let wt="";S(c)&&v&&(wt=Z(w===Dl?ze.taxExclusiveLabel:ze.taxInclusiveLabel,{taxTerm:v}),wt&&(J+=" "+wt)),t&&(J=Z(ze.strikethroughAriaLabel,{strikethroughPrice:J}));let Pt=H.container;if(e&&(Pt+=" "+H.containerOptical),t&&(Pt+=" "+H.containerStrikethrough),r&&(Pt+=" "+H.containerAnnual),S(o))return Hl(Pt,{...pe,accessibleLabel:J,recurrenceLabel:_t,perUnitLabel:en,taxInclusivityLabel:wt},z);let{currencySymbol:so,decimals:Rs,decimalsDelimiter:$s,hasCurrencySpace:co,integer:Vs,isCurrencyFirst:Ms}=pe,We=[Vs,$s,Rs];Ms?(We.unshift(co?"\xA0":""),We.unshift(so)):(We.push(co?"\xA0":""),We.push(so)),We.push(_t,en,wt);let Us=We.join("");return j(Pt,Us,z)},hs=()=>(e,t,r)=>{let i=(e.displayOldPrice===void 0||S(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${q()(e,t,r)}${i?"&nbsp;"+q({displayStrikethrough:!0})(e,t,r):""}`},ds=()=>(e,t,r)=>{let{instant:n}=e;try{n||(n=new URLSearchParams(document.location.search).get("instant")),n&&(n=new Date(n))}catch{n=void 0}let i={...e,displayTax:!1,displayPerUnit:!1};return`${(e.displayOldPrice===void 0||S(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price?q({displayStrikethrough:!0})(i,t,r)+"&nbsp;":""}${q()(e,t,r)}${j(H.containerAnnualPrefix,"&nbsp;(")}${q({displayAnnual:!0,instant:n})(i,t,r)}${j(H.containerAnnualSuffix,")")}`},us=()=>(e,t,r)=>{let n={...e,displayTax:!1,displayPerUnit:!1};return`${q()(e,t,r)}${j(H.containerAnnualPrefix,"&nbsp;(")}${q({displayAnnual:!0})(n,t,r)}${j(H.containerAnnualSuffix,")")}`};var zi=q(),Fi=hs(),Bi=q({displayOptical:!0}),Ki=q({displayStrikethrough:!0}),ji=q({displayAnnual:!0}),Yi=us(),Xi=ds();var zl=(e,t)=>{if(!(!gt(e)||!gt(t)))return Math.floor((t-e)/t*100)},ms=()=>(e,t)=>{let{price:r,priceWithoutDiscount:n}=t,i=zl(r,n);return i===void 0?'<span class="no-discount"></span>':`<span class="discount">${i}%</span>`};var Wi=ms();var{freeze:Zt}=Object,te=Zt({...Ue}),re=Zt({...Q}),Fe={STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"},qi=Zt({...U}),Zi=Zt({...Ta}),Ji=Zt({...N});var ps="mas-commerce-service";function fs(e,{once:t=!1}={}){let r=null;function n(){let i=document.querySelector(ps);i!==r&&(r=i,i&&e(i))}return document.addEventListener(nt,n,{once:t}),Be(n),()=>document.removeEventListener(nt,n)}function Jt(e,{country:t,forceTaxExclusive:r,perpetual:n}){let i;if(e.length<2)i=e;else{let o=t==="GB"||n?"EN":"MULT",[a,s]=e;i=[a.language===o?a:s]}return r&&(i=i.map(Ti)),i}var Be=e=>window.setTimeout(e);function At(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(vt).filter(gt);return r.length||(r=[t]),r}function Kr(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(xi)}function Y(){return document.getElementsByTagName(ps)?.[0]}var Ke={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},gs=1e3,xs=new Set;function Fl(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function vs(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:n,originatingRequest:i,status:o}=e;return[n,o,i].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!Ke.serializableTypes.includes(r))return r}return e}function Bl(e,t){if(!Ke.ignoredProperties.includes(e))return vs(t)}var Qi={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,n=[],i=[],o=t;r.forEach(h=>{h!=null&&(Fl(h)?n:i).push(h)}),n.length&&(o+=" "+n.map(vs).join(" "));let{pathname:a,search:s}=window.location,c=`${Ke.delimiter}page=${a}${s}`;c.length>gs&&(c=`${c.slice(0,gs)}<trunc>`),o+=c,i.length&&(o+=`${Ke.delimiter}facts=`,o+=JSON.stringify(i,Bl)),xs.has(o)||(xs.add(o),window.lana?.log(o,Ke))}};function Et(e){Object.assign(Ke,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in Ke&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var L=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflow:te.V3,checkoutWorkflowStep:re.EMAIL,country:"US",displayOldPrice:!0,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,env:Fe.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsBufferDelay:1,wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:$e.PUBLISHED,wcsBufferLimit:1});var eo=Object.freeze({LOCAL:"local",PROD:"prod",STAGE:"stage"});function Kl({locale:e=void 0,country:t=void 0,language:r=void 0}={}){return r??(r=e?.split("_")?.[0]||L.language),t??(t=e?.split("_")?.[1]||L.country),e??(e=`${r}_${t}`),{locale:e,country:t,language:r}}function to(e={}){let{commerce:t={}}=e,r=Fe.PRODUCTION,n=Xn,i=O("checkoutClientId",t)??L.checkoutClientId,o=Te(O("checkoutWorkflow",t),te,L.checkoutWorkflow),a=re.CHECKOUT;o===te.V3&&(a=Te(O("checkoutWorkflowStep",t),re,L.checkoutWorkflowStep));let s=S(O("displayOldPrice",t),L.displayOldPrice),c=S(O("displayPerUnit",t),L.displayPerUnit),h=S(O("displayRecurrence",t),L.displayRecurrence),l=S(O("displayTax",t),L.displayTax),d=S(O("entitlement",t),L.entitlement),u=S(O("modal",t),L.modal),m=S(O("forceTaxExclusive",t),L.forceTaxExclusive),f=O("promotionCode",t)??L.promotionCode,g=At(O("quantity",t)),T=O("wcsApiKey",t)??L.wcsApiKey,w=t?.env==="stage",v=$e.PUBLISHED;["true",""].includes(t.allowOverride)&&(w=(O(jn,t,{metadata:!1})?.toLowerCase()??t?.env)==="stage",v=Te(O(Yn,t),$e,v)),w&&(r=Fe.STAGE,n=Wn);let R=vt(O("wcsBufferDelay",t),L.wcsBufferDelay),C=vt(O("wcsBufferLimit",t),L.wcsBufferLimit);return{...Kl(e),displayOldPrice:s,checkoutClientId:i,checkoutWorkflow:o,checkoutWorkflowStep:a,displayPerUnit:c,displayRecurrence:h,displayTax:l,entitlement:d,extraOptions:L.extraOptions,modal:u,env:r,forceTaxExclusive:m,promotionCode:f,quantity:g,wcsApiKey:T,wcsBufferDelay:R,wcsBufferLimit:C,wcsURL:n,landscape:v}}var ro={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},jl=Date.now(),no=new Set,io=new Set,bs=new Map,As={append({level:e,message:t,params:r,timestamp:n,source:i}){console[e](`${n}ms [${i}] %c${t}`,"font-weight: bold;",...r)}},Es={filter:({level:e})=>e!==ro.DEBUG},Yl={filter:()=>!1};function Xl(e,t,r,n,i){return{level:e,message:t,namespace:r,get params(){return n.length===1&&Bt(n[0])&&(n=n[0](),Array.isArray(n)||(n=[n])),n},source:i,timestamp:Date.now()-jl}}function Wl(e){[...io].every(t=>t(e))&&no.forEach(t=>t(e))}function Ss(e){let t=(bs.get(e)??0)+1;bs.set(e,t);let r=`${e} #${t}`,n={id:r,namespace:e,module:i=>Ss(`${n.namespace}/${i}`),updateConfig:Et};return Object.values(ro).forEach(i=>{n[i]=(o,...a)=>Wl(Xl(i,o,e,a,r))}),Object.seal(n)}function jr(...e){e.forEach(t=>{let{append:r,filter:n}=t;Bt(n)&&io.add(n),Bt(r)&&no.add(r)})}function ql(e={}){let{name:t}=e,r=S(O("commerce.debug",{search:!0,storage:!0}),t===eo.LOCAL);return jr(r?As:Es),t===eo.PROD&&jr(Qi),X}function Zl(){no.clear(),io.clear()}var X={...Ss(Kn),Level:ro,Plugins:{consoleAppender:As,debugFilter:Es,quietFilter:Yl,lanaAppender:Qi},init:ql,reset:Zl,use:jr};var Jl={[se]:Dn,[Ee]:Gn,[ce]:Hn},Ql={[se]:Fn,[ce]:Bn},St=class{constructor(t){p(this,"changes",new Map);p(this,"connected",!1);p(this,"dispose",ft);p(this,"error");p(this,"log");p(this,"options");p(this,"promises",[]);p(this,"state",Ee);p(this,"timer",null);p(this,"value");p(this,"version",0);p(this,"wrapperElement");this.wrapperElement=t}update(){[se,Ee,ce].forEach(t=>{this.wrapperElement.classList.toggle(Jl[t],t===this.state)})}notify(){(this.state===ce||this.state===se)&&(this.state===ce?this.promises.forEach(({resolve:t})=>t(this.wrapperElement)):this.state===se&&this.promises.forEach(({reject:t})=>t(this.error)),this.promises=[]),this.wrapperElement.dispatchEvent(new CustomEvent(Ql[this.state],{bubbles:!0}))}attributeChangedCallback(t,r,n){this.changes.set(t,n),this.requestUpdate()}connectedCallback(){this.dispose=fs(()=>this.requestUpdate(!0))}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement})),this.dispose(),this.dispose=ft}onceSettled(){let{error:t,promises:r,state:n}=this;return ce===n?Promise.resolve(this.wrapperElement):se===n?Promise.reject(t):new Promise((i,o)=>{r.push({resolve:i,reject:o})})}toggleResolved(t,r,n){return t!==this.version?!1:(n!==void 0&&(this.options=n),this.state=ce,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),Be(()=>this.notify()),!0)}toggleFailed(t,r,n){return t!==this.version?!1:(n!==void 0&&(this.options=n),this.error=r,this.state=se,this.update(),this.log?.error("Failed:",{element:this.wrapperElement,error:r}),Be(()=>this.notify()),!0)}togglePending(t){return this.version++,t&&(this.options=t),this.state=Ee,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!Y()||this.timer)return;let r=X.module("mas-element"),{error:n,options:i,state:o,value:a,version:s}=this;this.state=Ee,this.timer=Be(async()=>{this.timer=null;let c=null;if(this.changes.size&&(c=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:c}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:c})),c||t)try{await this.wrapperElement.render?.()===!1&&this.state===Ee&&this.version===s&&(this.state=o,this.error=n,this.value=a,this.update(),this.notify())}catch(h){r.error("Failed to render mas-element: ",h),this.toggleFailed(this.version,h,i)}})}};function ys(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function Yr(e,t={}){let{tag:r,is:n}=e,i=document.createElement(r,{is:n});return i.setAttribute("is",n),Object.assign(i.dataset,ys(t)),i}function Xr(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,ys(t)),e):null}var eh="download",th="upgrade";function Wr(e,t={},r=""){let n=Y();if(!n)return null;let{checkoutMarketSegment:i,checkoutWorkflow:o,checkoutWorkflowStep:a,entitlement:s,upgrade:c,modal:h,perpetual:l,promotionCode:d,quantity:u,wcsOsi:m,extraOptions:f}=n.collectCheckoutOptions(t),g=Yr(e,{checkoutMarketSegment:i,checkoutWorkflow:o,checkoutWorkflowStep:a,entitlement:s,upgrade:c,modal:h,perpetual:l,promotionCode:d,quantity:u,wcsOsi:m,extraOptions:f});return r&&(g.innerHTML=`<span style="pointer-events: none;">${r}</span>`),g}function qr(e){return class extends e{constructor(){super(...arguments);p(this,"checkoutActionHandler");p(this,"masElement",new St(this))}attributeChangedCallback(n,i,o){this.masElement.attributeChangedCallback(n,i,o)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.clickHandler)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.clickHandler)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}requestUpdate(n=!1){return this.masElement.requestUpdate(n)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}async render(n={}){if(!this.isConnected)return!1;let i=Y();if(!i)return!1;this.dataset.imsCountry||i.imsCountryPromise.then(d=>{d&&(this.dataset.imsCountry=d)},ft),n.imsCountry=null;let o=i.collectCheckoutOptions(n,this);if(!o.wcsOsi.length)return!1;let a;try{a=JSON.parse(o.extraOptions??"{}")}catch(d){this.masElement.log?.error("cannot parse exta checkout options",d)}let s=this.masElement.togglePending(o);this.setCheckoutUrl("");let c=i.resolveOfferSelectors(o),h=await Promise.all(c);h=h.map(d=>Jt(d,o)),o.country=this.dataset.imsCountry||o.country;let l=await i.buildCheckoutAction?.(h.flat(),{...a,...o},this);return this.renderOffers(h.flat(),o,{},l,s)}renderOffers(n,i,o={},a=void 0,s=void 0){if(!this.isConnected)return!1;let c=Y();if(!c)return!1;if(i={...JSON.parse(this.dataset.extraOptions??"null"),...i,...o},s??(s=this.masElement.togglePending(i)),this.checkoutActionHandler&&(this.checkoutActionHandler=void 0),a){this.classList.remove(eh,th),this.masElement.toggleResolved(s,n,i);let{url:l,text:d,className:u,handler:m}=a;return l&&this.setCheckoutUrl(l),d&&(this.firstElementChild.innerHTML=d),u&&this.classList.add(...u.split(" ")),m&&(this.setCheckoutUrl("#"),this.checkoutActionHandler=m.bind(this)),!0}else if(n.length){if(this.masElement.toggleResolved(s,n,i)){let l=c.buildCheckoutURL(n,i);return this.setCheckoutUrl(l),!0}}else{let l=new Error(`Not provided: ${i?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(s,l,i))return this.setCheckoutUrl("#"),!0}}setCheckoutUrl(){}clickHandler(n){}updateOptions(n={}){let i=Y();if(!i)return!1;let{checkoutMarketSegment:o,checkoutWorkflow:a,checkoutWorkflowStep:s,entitlement:c,upgrade:h,modal:l,perpetual:d,promotionCode:u,quantity:m,wcsOsi:f}=i.collectCheckoutOptions(n);return Xr(this,{checkoutMarketSegment:o,checkoutWorkflow:a,checkoutWorkflowStep:s,entitlement:c,upgrade:h,modal:l,perpetual:d,promotionCode:u,quantity:m,wcsOsi:f}),!0}}}var Qt=class Qt extends qr(HTMLButtonElement){static createCheckoutButton(t={},r=""){return Wr(Qt,t,r)}setCheckoutUrl(t){this.setAttribute("data-href",t)}get href(){return this.getAttribute("data-href")}get isCheckoutButton(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}this.href&&(window.location.href=this.href)}};p(Qt,"is","checkout-button"),p(Qt,"tag","button");var je=Qt;window.customElements.get(je.is)||window.customElements.define(je.is,je,{extends:je.tag});function rh(e){return`https://${e==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var er,Ye=class Ye extends HTMLAnchorElement{constructor(){super();M(this,er,!1);this.setAttribute("is",Ye.is)}get isUptLink(){return!0}initializeWcsData(r,n){this.setAttribute("data-wcs-osi",r),n&&this.setAttribute("data-promotion-code",n),K(this,er,!0),this.composePromoTermsUrl()}attributeChangedCallback(r,n,i){_(this,er)&&this.composePromoTermsUrl()}composePromoTermsUrl(){let r=this.getAttribute("data-wcs-osi");if(!r){let d=this.closest("merch-card").querySelector("aem-fragment").getAttribute("fragment");console.error(`Missing 'data-wcs-osi' attribute on upt-link. Fragment: ${d}`);return}let n=Y(),i=[r],o=this.getAttribute("data-promotion-code"),{country:a,language:s,env:c}=n.settings,h={country:a,language:s,wcsOsi:i,promotionCode:o},l=n.resolveOfferSelectors(h);Promise.all(l).then(([[d]])=>{let u=`locale=${s}_${a}&country=${a}&offer_id=${d.offerId}`;o&&(u+=`&promotion_code=${encodeURIComponent(o)}`),this.href=`${rh(c)}?${u}`}).catch(d=>{console.error(`Could not resolve offer selectors for id: ${r}.`,d.message)})}static createFrom(r){let n=new Ye;for(let i of r.attributes)i.name!=="is"&&(i.name==="class"&&i.value.includes("upt-link")?n.setAttribute("class",i.value.replace("upt-link","").trim()):n.setAttribute(i.name,i.value));return n.innerHTML=r.innerHTML,n.setAttribute("tabindex",0),n}};er=new WeakMap,p(Ye,"is","upt-link"),p(Ye,"tag","a"),p(Ye,"observedAttributes",["data-wcs-osi","data-promotion-code"]);var de=Ye;window.customElements.get(de.is)||window.customElements.define(de.is,de,{extends:de.tag});var nh="#000000",ih="#F8D904",oh=/(accent|primary|secondary)(-(outline|link))?/,ah="mas:product_code/",sh="daa-ll",Zr="daa-lh",ch=["XL","L","M","S"];function tr(e,t,r,n){let i=n[e];if(t[e]&&i){let o=Ae(i.tag,{slot:i?.slot},t[e]);r.append(o)}}function lh(e,t,r){e.mnemonicIcon?.map((i,o)=>({icon:i,alt:e.mnemonicAlt[o]??"",link:e.mnemonicLink[o]??""}))?.forEach(({icon:i,alt:o,link:a})=>{if(a&&!/^https?:/.test(a))try{a=new URL(`https://${a}`).href.toString()}catch{a="#"}let s={slot:"icons",src:i,loading:t.loading,size:r?.size??"l"};o&&(s.alt=o),a&&(s.href=a);let c=Ae("merch-icon",s);t.append(c)})}function hh(e,t){e.badge&&(t.setAttribute("badge-text",e.badge),t.setAttribute("badge-color",e.badgeColor||nh),t.setAttribute("badge-background-color",e.badgeBackgroundColor||ih))}function dh(e,t,r){r?.includes(e.size)&&t.setAttribute("size",e.size)}function uh(e,t,r){e.cardTitle&&r&&t.append(Ae(r.tag,{slot:r.slot},e.cardTitle))}function mh(e,t,r){tr("subtitle",e,t,r)}function ph(e,t,r){if(e.backgroundImage){let n={loading:t.loading??"lazy",src:e.backgroundImage};if(e.backgroundImageAltText?n.alt=e.backgroundImageAltText:n.role="none",!r)return;if(r?.attribute){t.setAttribute(r.attribute,e.backgroundImage);return}t.append(Ae(r.tag,{slot:r.slot},Ae("img",n)))}}function fh(e,t,r){tr("prices",e,t,r)}function gh(e,t,r){tr("promoText",e,t,r),tr("description",e,t,r),tr("callout",e,t,r)}function xh(e,t,r,n){e.showStockCheckbox&&r.stockOffer&&(t.setAttribute("checkbox-label",n.stockCheckboxLabel),t.setAttribute("stock-offer-osis",n.stockOfferOsis)),n.secureLabel&&r.secureLabel&&t.setAttribute("secure-label",n.secureLabel)}function vh(e,t){t.querySelectorAll("a.upt-link").forEach(n=>{let i=de.createFrom(n);n.replaceWith(i),i.initializeWcsData(e.osi,e.promoCode)})}function bh(e,t,r,n){let o=customElements.get("checkout-button").createCheckoutButton({},e.innerHTML);o.setAttribute("tabindex",0);for(let l of e.attributes)["class","is"].includes(l.name)||o.setAttribute(l.name,l.value);o.firstElementChild?.classList.add("spectrum-Button-label");let a=t.ctas.size??"M",s=`spectrum-Button--${n}`,c=ch.includes(a)?`spectrum-Button--size${a}`:"spectrum-Button--sizeM",h=["spectrum-Button",s,c];return r&&h.push("spectrum-Button--outline"),o.classList.add(...h),o}function Ah(e,t,r,n){let i="fill";r&&(i="outline");let o=Ae("sp-button",{treatment:i,variant:n,tabIndex:0,size:t.ctas.size??"m"},e);return o.addEventListener("click",a=>{a.target!==e&&(a.stopPropagation(),e.click())}),o}function Eh(e,t){return e.classList.add("con-button"),t&&e.classList.add("blue"),e}function Sh(e,t,r,n){if(e.ctas){let{slot:i}=r.ctas,o=Ae("div",{slot:i},e.ctas),a=[...o.querySelectorAll("a")].map(s=>{let c=oh.exec(s.className)?.[0]??"accent",h=c.includes("accent"),l=c.includes("primary"),d=c.includes("secondary"),u=c.includes("-outline"),m=c.includes("-link");if(t.consonant)return Eh(s,h);if(m)return s;let f;return h?f="accent":l?f="primary":d&&(f="secondary"),t.spectrum==="swc"?Ah(s,r,u,f):bh(s,r,u,f)});o.innerHTML="",o.append(...a),t.append(o)}}function yh(e,t){let{tags:r}=e,n=r?.find(i=>i.startsWith(ah))?.split("/").pop();n&&(t.setAttribute(Zr,n),t.querySelectorAll("a[data-analytics-id],button[data-analytics-id]").forEach((i,o)=>{i.setAttribute(sh,`${i.dataset.analyticsId}-${o+1}`)}))}function Th(e){e.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([t,r])=>{e.querySelectorAll(`a.${t}`).forEach(n=>{n.classList.remove(t),n.classList.add("spectrum-Link",`spectrum-Link--${r}`)})})}function Lh(e){e.querySelectorAll("[slot]").forEach(n=>{n.remove()}),["checkbox-label","stock-offer-osis","secure-label","background-image","badge-background-color","badge-color","badge-text","size",Zr].forEach(n=>e.removeAttribute(n));let r=["wide-strip","thin-strip"];e.classList.remove(...r)}async function Ts(e,t){let{fields:r}=e,{variant:n}=r;if(!n)return;let i={stockCheckboxLabel:"Add a 30-day free trial of Adobe Stock.*",stockOfferOsis:"",secureLabel:"Secure transaction"};Lh(t),t.id=e.id,t.variant=n,await t.updateComplete;let{aemFragmentMapping:o}=t.variantLayout;o&&(o.style==="consonant"&&t.setAttribute("consonant",!0),lh(r,t,o.mnemonics),hh(r,t),dh(r,t,o.size),uh(r,t,o.title),mh(r,t,o),fh(r,t,o),ph(r,t,o.backgroundImage),gh(r,t,o),xh(r,t,o,i),vh(r,t),Sh(r,t,o,n),yh(r,t),Th(t))}var _h="merch-card",wh=":start",Ph=":ready",Ch=1e4,Ls="merch-card:",nr,oo,rr=class extends ee{constructor(){super();M(this,nr);p(this,"customerSegment");p(this,"marketSegment");p(this,"variantLayout");this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.loading="lazy",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this)}static getFragmentMapping(r){return aa[r]}firstUpdated(){this.variantLayout=ri(this,!1),this.variantLayout?.connectedCallbackHook(),this.aemFragment?.updateComplete.catch(()=>{this.style.display="none"})}willUpdate(r){(r.has("variant")||!this.variantLayout)&&(this.variantLayout=ri(this),this.variantLayout.connectedCallbackHook())}updated(r){(r.has("badgeBackgroundColor")||r.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle),this.variantLayout?.postCardUpdateHook(r)}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["twp","ccd-slice","ccd-suggested"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}async toggleStockOffer({target:r}){if(!this.stockOfferOsis)return;let n=this.checkoutLinks;if(n.length!==0)for(let i of n){await i.onceSettled();let o=i.value?.[0]?.planType;if(!o)return;let a=this.stockOfferOsis[o];if(!a)return;let s=i.dataset.wcsOsi.split(",").filter(c=>c!==a);r.checked&&s.push(a),i.dataset.wcsOsi=s.join(",")}}handleQuantitySelection(r){let n=this.checkoutLinks;for(let i of n)i.dataset.quantity=r.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(r){let n={...this.filters};Object.keys(n).forEach(i=>{if(r){n[i].order=Math.min(n[i].order||2,2);return}let o=n[i].order;o===1||isNaN(o)||(n[i].order=Number(o)+1)}),this.filters=n}includes(r){return this.textContent.match(new RegExp(r,"i"))!==null}connectedCallback(){super.connectedCallback();let r=this.querySelector("aem-fragment")?.getAttribute("fragment");performance.mark(`${Ls}${r}${wh}`),this.addEventListener(yr,this.handleQuantitySelection),this.addEventListener(Rn,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.storageOptions?.addEventListener("change",this.handleStorageChange),this.addEventListener(Re,this.handleAemFragmentEvents),this.addEventListener(Oe,this.handleAemFragmentEvents),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(yr,this.handleQuantitySelection),this.storageOptions?.removeEventListener(Sr,this.handleStorageChange),this.removeEventListener(Re,this.handleAemFragmentEvents),this.removeEventListener(Oe,this.handleAemFragmentEvents)}async handleAemFragmentEvents(r){if(r.type===Re&&fe(this,nr,oo).call(this,"AEM fragment cannot be loaded"),r.type===Oe&&r.target.nodeName==="AEM-FRAGMENT"){let n=r.detail;await Ts(n,this),this.checkReady()}}async checkReady(){let r=Promise.all([...this.querySelectorAll('span[is="inline-price"][data-wcs-osi],a[is="checkout-link"][data-wcs-osi]')].map(o=>o.onceSettled().catch(()=>o))).then(o=>o.every(a=>a.classList.contains("placeholder-resolved"))),n=new Promise(o=>setTimeout(()=>o(!1),Ch));if(await Promise.race([r,n,this.aemFragment?.updateComplete])===!0){performance.mark(`${Ls}${this.id}${Ph}`),this.dispatchEvent(new CustomEvent(Mn,{bubbles:!0,composed:!0}));return}fe(this,nr,oo).call(this,"Contains unresolved offers")}get aemFragment(){return this.querySelector("aem-fragment")}get storageOptions(){return this.querySelector("sp-radio-group#storage")}get storageSpecificOfferSelect(){let r=this.storageOptions?.selected;if(r){let n=this.querySelector(`merch-offer-select[storage="${r}"]`);if(n)return n}return this.querySelector("merch-offer-select")}get offerSelect(){return this.storageOptions?this.storageSpecificOfferSelect:this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let r=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll('a[is="checkout-link"].con-button')).length===2&&r&&r.parentElement.classList.add("footer-column")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||(this.dispatchEvent(new CustomEvent($n,{bubbles:!0})),this.displayFooterElementsInColumn())}handleStorageChange(){let r=this.closest("merch-card")?.offerSelect.cloneNode(!0);r&&this.dispatchEvent(new CustomEvent(Sr,{detail:{offerSelect:r},bubbles:!0}))}get dynamicPrice(){return this.querySelector('[slot="price"]')}selectMerchOffer(r){if(r===this.merchOffer)return;this.merchOffer=r;let n=this.dynamicPrice;if(r.price&&n){let i=r.price.cloneNode(!0);n.onceSettled?n.onceSettled().then(()=>{n.replaceWith(i)}):n.replaceWith(i)}}};nr=new WeakSet,oo=function(r){this.dispatchEvent(new CustomEvent(Un,{detail:r,bubbles:!0,composed:!0}))},p(rr,"properties",{name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:r=>{if(!r)return;let[n,i,o]=r.split(",");return{PUF:n,ABM:i,M2M:o}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:r=>Object.fromEntries(r.split(",").map(n=>{let[i,o,a]=n.split(":"),s=Number(o);return[i,{order:isNaN(s)?void 0:s,size:a}]})),toAttribute:r=>Object.entries(r).map(([n,{order:i,size:o}])=>[n,i,o].filter(a=>a!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:Zr,reflect:!0},loading:{type:String}}),p(rr,"styles",[jo,sa(),...Yo()]);customElements.define(_h,rr);var yt=class extends ee{constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}render(){let{href:t}=this;return t?x`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:x` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};p(yt,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),p(yt,"styles",k`
        :host {
            --img-width: 32px;
            --img-height: 32px;
            display: block;
            width: var(--mod-img-width, var(--img-width));
            height: var(--mod-img-height, var(--img-height));
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
            width: var(--mod-img-width, var(--img-width));
            height: var(--mod-img-height, var(--img-height));
        }
    `);customElements.define("merch-icon",yt);var ir=class ir extends qr(HTMLAnchorElement){static createCheckoutLink(t={},r=""){return Wr(ir,t,r)}setCheckoutUrl(t){this.setAttribute("href",t)}get isCheckoutLink(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}}};p(ir,"is","checkout-link"),p(ir,"tag","a");var ne=ir;window.customElements.get(ne.is)||window.customElements.define(ne.is,ne,{extends:ne.tag});function _s({providers:e,settings:t}){function r(o,a){let{checkoutClientId:s,checkoutWorkflow:c,checkoutWorkflowStep:h,country:l,language:d,promotionCode:u,quantity:m}=t,{checkoutMarketSegment:f,checkoutWorkflow:g=c,checkoutWorkflowStep:T=h,imsCountry:w,country:v=w??l,language:E=d,quantity:R=m,entitlement:C,upgrade:z,modal:F,perpetual:ue,promotionCode:Z=u,wcsOsi:Tt,extraOptions:Xe,...Lt}=Object.assign({},a?.dataset??{},o??{}),me=Te(g,te,L.checkoutWorkflow),pe=re.CHECKOUT;me===te.V3&&(pe=Te(T,re,L.checkoutWorkflowStep));let J=xt({...Lt,extraOptions:Xe,checkoutClientId:s,checkoutMarketSegment:f,country:v,quantity:At(R,L.quantity),checkoutWorkflow:me,checkoutWorkflowStep:pe,language:E,entitlement:S(C),upgrade:S(z),modal:S(F),perpetual:S(ue),promotionCode:Kt(Z).effectivePromoCode,wcsOsi:Kr(Tt)});if(a)for(let _t of e.checkout)_t(a,J);return J}function n(o,a){if(!Array.isArray(o)||!o.length||!a)return"";let{env:s,landscape:c}=t,{checkoutClientId:h,checkoutMarketSegment:l,checkoutWorkflow:d,checkoutWorkflowStep:u,country:m,promotionCode:f,quantity:g,...T}=r(a),w=window.frameElement?"if":"fp",v={checkoutPromoCode:f,clientId:h,context:w,country:m,env:s,items:[],marketSegment:l,workflowStep:u,landscape:c,...T};if(o.length===1){let[{offerId:E,offerType:R,productArrangementCode:C}]=o,{marketSegments:[z]}=o[0];Object.assign(v,{marketSegment:z,offerType:R,productArrangementCode:C}),v.items.push(g[0]===1?{id:E}:{id:E,quantity:g[0]})}else v.items.push(...o.map(({offerId:E},R)=>({id:E,quantity:g[R]??L.quantity})));return di(d,v)}let{createCheckoutLink:i}=ne;return{CheckoutLink:ne,CheckoutWorkflow:te,CheckoutWorkflowStep:re,buildCheckoutURL:n,collectCheckoutOptions:r,createCheckoutLink:i}}function kh({interval:e=200,maxAttempts:t=25}={}){let r=X.module("ims");return new Promise(n=>{r.debug("Waing for IMS to be ready");let i=0;function o(){window.adobeIMS?.initialized?n():++i>t?(r.debug("Timeout"),n()):setTimeout(o,e)}o()})}function Ih(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function Nh(e){let t=X.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:n})=>(t.debug("Got user country:",n),n),n=>{t.error("Unable to get user country:",n)}):null)}function ws({}){let e=kh(),t=Ih(e),r=Nh(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}async function Cs(e,t){let{data:r}=t||await Promise.resolve().then(()=>Xs(Ps(),1));if(Array.isArray(r)){let n=o=>r.find(a=>Nr(a.lang,o)),i=n(e.language)??n(L.language);if(i)return Object.freeze(i)}return{}}var ks=["GB_en","AU_en","FR_fr","AT_de","BE_en","BE_fr","BE_nl","BG_bg","CH_de","CH_fr","CH_it","CZ_cs","DE_de","DK_da","EE_et","EG_ar","EG_en","ES_es","FI_fi","FR_fr","GR_el","GR_en","HU_hu","IE_en","IT_it","LU_de","LU_en","LU_fr","NL_nl","NO_nb","PL_pl","PT_pt","RO_ro","SE_sv","SI_sl","SK_sk","TR_tr","UA_uk","ID_en","ID_in","IN_en","IN_hi","JP_ja","MY_en","MY_ms","NZ_en","TH_en","TH_th"],Rh={INDIVIDUAL_COM:["ZA_en","LT_lt","LV_lv","NG_en","SA_ar","SA_en","ZA_en","SG_en","KR_ko"],TEAM_COM:["ZA_en","LT_lt","LV_lv","NG_en","ZA_en","CO_es","KR_ko"],INDIVIDUAL_EDU:["LT_lt","LV_lv","SA_en","SG_en"],TEAM_EDU:["SG_en","KR_ko"]},or=class or extends HTMLSpanElement{constructor(){super();p(this,"masElement",new St(this));this.handleClick=this.handleClick.bind(this)}static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-perpetual","data-promotion-code","data-tax-exclusive","data-template","data-wcs-osi"]}static createInlinePrice(r){let n=Y();if(!n)return null;let{displayOldPrice:i,displayPerUnit:o,displayRecurrence:a,displayTax:s,forceTaxExclusive:c,perpetual:h,promotionCode:l,quantity:d,template:u,wcsOsi:m}=n.collectPriceOptions(r);return Yr(or,{displayOldPrice:i,displayPerUnit:o,displayRecurrence:a,displayTax:s,forceTaxExclusive:c,perpetual:h,promotionCode:l,quantity:d,template:u,wcsOsi:m})}get isInlinePrice(){return!0}attributeChangedCallback(r,n,i){this.masElement.attributeChangedCallback(r,n,i)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}handleClick(r){r.target!==this&&(r.stopImmediatePropagation(),this.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})))}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}requestUpdate(r=!1){return this.masElement.requestUpdate(r)}resolveDisplayTaxForGeoAndSegment(r,n,i,o){let a=`${r}_${n}`;if(ks.includes(r)||ks.includes(a))return!0;let s=Rh[`${i}_${o}`];return s?!!(s.includes(r)||s.includes(a)):!1}async resolveDisplayTax(r,n){let[i]=await r.resolveOfferSelectors(n),o=Jt(await i,n);if(o?.length){let{country:a,language:s}=n,c=o[0],[h=""]=c.marketSegments;return this.resolveDisplayTaxForGeoAndSegment(a,s,c.customerSegment,h)}}async render(r={}){if(!this.isConnected)return!1;let n=Y();if(!n)return!1;let i=n.collectPriceOptions(r,this);if(!i.wcsOsi.length)return!1;let o=this.masElement.togglePending(i);this.innerHTML="";let[a]=n.resolveOfferSelectors(i);return this.renderOffers(Jt(await a,i),i,o)}renderOffers(r,n={},i=void 0){if(!this.isConnected)return;let o=Y();if(!o)return!1;let a=o.collectPriceOptions({...this.dataset,...n},this);if(i??(i=this.masElement.togglePending(a)),r.length){if(this.masElement.toggleResolved(i,r,a))return this.innerHTML=o.buildPriceHTML(r,a),!0}else{let s=new Error(`Not provided: ${a?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(i,s,a))return this.innerHTML="",!0}return!1}updateOptions(r){let n=Y();if(!n)return!1;let{displayOldPrice:i,displayPerUnit:o,displayRecurrence:a,displayTax:s,forceTaxExclusive:c,perpetual:h,promotionCode:l,quantity:d,template:u,wcsOsi:m}=n.collectPriceOptions(r);return Xr(this,{displayOldPrice:i,displayPerUnit:o,displayRecurrence:a,displayTax:s,forceTaxExclusive:c,perpetual:h,promotionCode:l,quantity:d,template:u,wcsOsi:m}),!0}};p(or,"is","inline-price"),p(or,"tag","span");var ie=or;window.customElements.get(ie.is)||window.customElements.define(ie.is,ie,{extends:ie.tag});function Is({literals:e,providers:t,settings:r}){function n(a,s){let{country:c,displayOldPrice:h,displayPerUnit:l,displayRecurrence:d,displayTax:u,forceTaxExclusive:m,language:f,promotionCode:g,quantity:T}=r,{displayOldPrice:w=h,displayPerUnit:v=l,displayRecurrence:E=d,displayTax:R=u,forceTaxExclusive:C=m,country:z=c,language:F=f,perpetual:ue,promotionCode:Z=g,quantity:Tt=T,template:Xe,wcsOsi:Lt,...me}=Object.assign({},s?.dataset??{},a??{}),pe=xt({...me,country:z,displayOldPrice:S(w),displayPerUnit:S(v),displayRecurrence:S(E),displayTax:S(R),forceTaxExclusive:S(C),language:F,perpetual:S(ue),promotionCode:Kt(Z).effectivePromoCode,quantity:At(Tt,L.quantity),template:Xe,wcsOsi:Kr(Lt)});if(s)for(let J of t.price)J(s,pe);return pe}function i(a,s){if(!Array.isArray(a)||!a.length||!s)return"";let{template:c}=s,h;switch(c){case"discount":h=Wi;break;case"strikethrough":h=Ki;break;case"optical":h=Bi;break;case"annual":h=ji;break;default:s.country==="AU"&&a[0].planType==="ABM"?h=s.promotionCode?Xi:Yi:h=s.promotionCode?Fi:zi}let l=n(s);l.literals=Object.assign({},e.price,xt(s.literals??{}));let[d]=a;return d={...d,...d.priceDetails},h(l,d)}let o=ie.createInlinePrice;return{InlinePrice:ie,buildPriceHTML:i,collectPriceOptions:n,createInlinePrice:o}}function Ns({settings:e}){let t=X.module("wcs"),{env:r,wcsApiKey:n}=e,i=new Map,o=new Map,a;async function s(d,u,m=!0){let f=zn;t.debug("Fetching:",d);let g="",T,w=(v,E,R)=>`${v}: ${E?.status}, url: ${R.toString()}`;try{if(d.offerSelectorIds=d.offerSelectorIds.sort(),g=new URL(e.wcsURL),g.searchParams.set("offer_selector_ids",d.offerSelectorIds.join(",")),g.searchParams.set("country",d.country),g.searchParams.set("locale",d.locale),g.searchParams.set("landscape",r===Fe.STAGE?"ALL":e.landscape),g.searchParams.set("api_key",n),d.language&&g.searchParams.set("language",d.language),d.promotionCode&&g.searchParams.set("promotion_code",d.promotionCode),d.currency&&g.searchParams.set("currency",d.currency),T=await fetch(g.toString(),{credentials:"omit"}),T.ok){let v=await T.json();t.debug("Fetched:",d,v);let E=v.resolvedOffers??[];E=E.map($r),u.forEach(({resolve:R},C)=>{let z=E.filter(({offerSelectorIds:F})=>F.includes(C)).flat();z.length&&(u.delete(C),R(z))})}else T.status===404&&d.offerSelectorIds.length>1?(t.debug("Multi-osi 404, fallback to fetch-by-one strategy"),await Promise.allSettled(d.offerSelectorIds.map(v=>s({...d,offerSelectorIds:[v]},u,!1)))):f=Tr}catch(v){f=Tr,t.error(f,d,v)}m&&u.size&&(t.debug("Missing:",{offerSelectorIds:[...u.keys()]}),u.forEach(v=>{v.reject(new Error(w(f,T,g)))}))}function c(){clearTimeout(a);let d=[...o.values()];o.clear(),d.forEach(({options:u,promises:m})=>s(u,m))}function h(){let d=i.size;i.clear(),t.debug(`Flushed ${d} cache entries`)}function l({country:d,language:u,perpetual:m=!1,promotionCode:f="",wcsOsi:g=[]}){let T=`${u}_${d}`;d!=="GB"&&(u=m?"EN":"MULT");let w=[d,u,f].filter(v=>v).join("-").toLowerCase();return g.map(v=>{let E=`${v}-${w}`;if(!i.has(E)){let R=new Promise((C,z)=>{let F=o.get(w);if(!F){let ue={country:d,locale:T,offerSelectorIds:[]};d!=="GB"&&(ue.language=u),F={options:ue,promises:new Map},o.set(w,F)}f&&(F.options.promotionCode=f),F.options.offerSelectorIds.push(v),F.promises.set(v,{resolve:C,reject:z}),F.options.offerSelectorIds.length>=e.wcsBufferLimit?c():(t.debug("Queued:",F.options),a||(a=setTimeout(c,e.wcsBufferDelay)))});i.set(E,R)}return i.get(E)})}return{WcsCommitment:qi,WcsPlanType:Zi,WcsTerm:Ji,resolveOfferSelectors:l,flushWcsCache:h}}var ao="mas-commerce-service",$h="mas:start",Vh="mas:ready",Qr,Os,Jr=class extends HTMLElement{constructor(){super(...arguments);M(this,Qr);p(this,"promise",null)}async registerCheckoutAction(r){typeof r=="function"&&(this.buildCheckoutAction=async(n,i,o)=>{let a=await r?.(n,i,this.imsSignedInPromise,o);return a||null})}async activate(){let r=_(this,Qr,Os),n=Object.freeze(to(r));Et(r.lana);let i=X.init(r.hostEnv).module("service");i.debug("Activating:",r);let o={price:{}};try{o.price=await Cs(n,r.commerce.priceLiterals)}catch{}let a={checkout:new Set,price:new Set},s={literals:o,providers:a,settings:n};Object.defineProperties(this,Object.getOwnPropertyDescriptors({..._s(s),...ws(s),...Is(s),...Ns(s),...qn,Log:X,get defaults(){return L},get log(){return X},get providers(){return{checkout(c){return a.checkout.add(c),()=>a.checkout.delete(c)},price(c){return a.price.add(c),()=>a.price.delete(c)}}},get settings(){return n}})),i.debug("Activated:",{literals:o,settings:n}),Be(()=>{let c=new CustomEvent(nt,{bubbles:!0,cancelable:!1,detail:this});performance.mark(Vh),this.dispatchEvent(c)})}connectedCallback(){this.readyPromise||(performance.mark($h),this.readyPromise=this.activate())}disconnectedCallback(){this.readyPromise=null}flushWcsCache(){this.flushWcsCache(),this.log.debug("Flushed WCS cache")}refreshOffers(){this.flushWcsCache(),document.querySelectorAll('span[is="inline-price"],a[is="checkout-link"]').forEach(r=>r.requestUpdate(!0)),this.log.debug("Refreshed WCS offers")}refreshFragments(){this.flushWcsCache(),document.querySelectorAll("aem-fragment").forEach(r=>r.refresh()),this.log.debug("Refreshed AEM fragments")}};Qr=new WeakSet,Os=function(){let r={hostEnv:{name:this.getAttribute("host-env")??"prod"},commerce:{env:this.getAttribute("env")},lana:{tags:this.getAttribute("lana-tags"),sampleRate:parseInt(this.getAttribute("lana-sample-rate"),10),isProdDomain:this.getAttribute("host-env")==="prod"}};return["locale","country","language"].forEach(n=>{let i=this.getAttribute(n);i&&(r[n]=i)}),["checkout-workflow-step","force-tax-exclusive","checkout-client-id","allow-override","wcs-api-key"].forEach(n=>{let i=this.getAttribute(n);if(i!=null){let o=n.replace(/-([a-z])/g,a=>a[1].toUpperCase());r.commerce[o]=i}}),r},p(Jr,"instance");window.customElements.get(ao)||window.customElements.define(ao,Jr);Et({sampleRate:1});export{je as CheckoutButton,ne as CheckoutLink,te as CheckoutWorkflow,re as CheckoutWorkflowStep,L as Defaults,ie as InlinePrice,$e as Landscape,X as Log,ao as TAG_NAME_SERVICE,de as UptLink,qi as WcsCommitment,Zi as WcsPlanType,Ji as WcsTerm,$r as applyPlanType,to as getSettings};
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
//# sourceMappingURL=mas.js.map
