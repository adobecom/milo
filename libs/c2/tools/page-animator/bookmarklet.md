# Page Animator Bookmarklets

## Universal (single bookmarklet — recommended)


Detects the environment automatically:
- `?milolibs=local` or `localhost:6456` → loads from port 6456 (highest priority)
- On `localhost:3000` (without `?milolibs=local`) → loads from port 3000
- `?milolibs=<branch>` → loads from the branch on `.aem.page` or `.aem.live` (matched to the current page's domain)
- Anywhere else (stage, prod, preview) → loads the hosted bundle from DA

**Before using on non-localhost pages without a `?milolibs` branch:** upload `page-animator.bundle.js` to DA and replace `BUNDLE_URL` below with its public URL.

```
javascript:(function(){var h=location.hostname,p=location.port,q=new URLSearchParams(location.search),ml=q.get('milolibs'),src,s;if(ml==='local'||h==='localhost'&&p==='6456'){src='http://localhost:6456/libs/c2/tools/page-animator/page-animator.js';}else if(h==='localhost'&&p==='3000'){src='http://localhost:3000/libs/c2/tools/page-animator/page-animator.js';}else if(ml&&ml!=='local'){src='https://'+ml+'--milo--adobecom.'+(h.indexOf('.aem.page')!==-1?'aem.page':'aem.live')+'/libs/c2/tools/page-animator/page-animator.js';}else{src='BUNDLE_URL';}s=document.createElement('script');s.type='module';s.src=src;document.head.appendChild(s);})();
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

### Remote only (bundle hosted on DA)
```
javascript:(function(){var s=document.createElement('script');s.src='BUNDLE_URL';document.head.appendChild(s);})();
```

---

## Hosting the bundle on DA

1. Go to DA and upload `page-animator.bundle.js` to a path like `/tools/page-animator/page-animator.bundle.js`
2. Publish it so it has a public `.aem.live` URL
3. Replace `BUNDLE_URL` in the universal bookmarklet with that URL

The bundle is fully self-contained — no imports, no external dependencies.
