# Page Animator Bookmarklets

## Universal (single bookmarklet — recommended)

Detects the environment automatically:
- On `localhost:3000` → loads from port 3000
- On `localhost:6456` or `?milolibs=local` → loads from port 6456
- `?milolibs=<branch>` → loads from the branch on `.aem.page` or `.aem.live` (matched to the current page's domain)

```
javascript:(function(){var h=location.hostname,p=location.port,q=new URLSearchParams(location.search),ml=q.get('milolibs'),src,s;if(h==='localhost'&&p==='3000'){src='http://localhost:3000/libs/c2/tools/page-animator/page-animator.js';}else if(h==='localhost'&&p==='6456'||ml==='local'){src='http://localhost:6456/libs/c2/tools/page-animator/page-animator.js';}else if(ml&&ml!=='local'){src='https://'+ml+'--milo--adobecom.'+(h.indexOf('.aem.page')!==-1?'aem.page':'aem.live')+'/libs/c2/tools/page-animator/page-animator.js';}if(!src){return;}s=document.createElement('script');s.type='module';s.src=src;document.head.appendChild(s);})();
```

---

## Individual bookmarklets (for reference)

### localhost:3000
```
javascript:(function(){var s=document.createElement('script');s.type='module';s.src='http://localhost:3000/libs/c2/tools/page-animator/page-animator.js';document.head.appendChild(s);})();
```

### localhost:6456 (npm run libs / ?milolibs=local)
```
javascript:(function(){var s=document.createElement('script');s.type='module';s.src='http://localhost:6456/libs/c2/tools/page-animator/page-animator.js';document.head.appendChild(s);})();
```
