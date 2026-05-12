# Page Animator Bookmarklets

## Universal (single bookmarklet — recommended)

Detects the environment automatically:
- On `localhost:3000` → loads from port 3000
- On `localhost:6456` or `?milolibs=local` → loads from port 6456
- Anywhere else (stage, prod, preview) → loads the hosted bundle from DA

**Before using on non-localhost pages:** upload `page-animator.bundle.js` to DA and replace `BUNDLE_URL` below with its public URL.

```
javascript:(function(){const h=location.hostname,p=location.port,q=new URLSearchParams(location.search);let src;if(h==='localhost'&&p==='3000'){src='http://localhost:3000/libs/c2/tools/page-animator/page-animator.js';}else if(h==='localhost'&&p==='6456'||q.get('milolibs')==='local'){src='http://localhost:6456/libs/c2/tools/page-animator/page-animator.js';}else{src='BUNDLE_URL';}const s=document.createElement('script');s.src=src;document.head.appendChild(s);})();
```

---

## Individual bookmarklets (for reference)

### localhost:3000
```
javascript:(function(){const s=document.createElement('script');s.src='http://localhost:3000/libs/c2/tools/page-animator/page-animator.js';document.head.appendChild(s);})();
```

### localhost:6456 (npm run libs / ?milolibs=local)
```
javascript:(function(){const s=document.createElement('script');s.src='http://localhost:6456/libs/c2/tools/page-animator/page-animator.js';document.head.appendChild(s);})();
```

### Remote only (bundle hosted on DA)
```
javascript:(function(){const s=document.createElement('script');s.src='BUNDLE_URL';document.head.appendChild(s);})();
```

---

## Hosting the bundle on DA

1. Go to DA and upload `page-animator.bundle.js` to a path like `/tools/page-animator/page-animator.bundle.js`
2. Publish it so it has a public `.aem.live` URL
3. Replace `BUNDLE_URL` in the universal bookmarklet with that URL

The bundle is fully self-contained — no imports, no external dependencies.
