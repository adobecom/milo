// ../deps/compression-streams-pollyfill.js
!function(t) {
  "function" == typeof define && define.amd ? define(t) : t();
}(function() {
  var t = {}, n = Uint8Array, r = Uint16Array, e = Int32Array, i = new n([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]), a = new n([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]), o = new n([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), s = function(t2, n2) {
    for (var i2 = new r(31), a2 = 0; a2 < 31; ++a2) i2[a2] = n2 += 1 << t2[a2 - 1];
    var o2 = new e(i2[30]);
    for (a2 = 1; a2 < 30; ++a2) for (var s2 = i2[a2]; s2 < i2[a2 + 1]; ++s2) o2[s2] = s2 - i2[a2] << 5 | a2;
    return { b: i2, r: o2 };
  }, f = s(i, 2), h = f.b, u = f.r;
  h[28] = 258, u[258] = 28;
  for (var l = s(a, 0), c = l.b, v = l.r, p = new r(32768), d = 0; d < 32768; ++d) {
    var g = (43690 & d) >> 1 | (21845 & d) << 1;
    p[d] = ((65280 & (g = (61680 & (g = (52428 & g) >> 2 | (13107 & g) << 2)) >> 4 | (3855 & g) << 4)) >> 8 | (255 & g) << 8) >> 1;
  }
  var y = function(t2, n2, e2) {
    for (var i2 = t2.length, a2 = 0, o2 = new r(n2); a2 < i2; ++a2) t2[a2] && ++o2[t2[a2] - 1];
    var s2, f2 = new r(n2);
    for (a2 = 1; a2 < n2; ++a2) f2[a2] = f2[a2 - 1] + o2[a2 - 1] << 1;
    if (e2) {
      s2 = new r(1 << n2);
      var h2 = 15 - n2;
      for (a2 = 0; a2 < i2; ++a2) if (t2[a2]) for (var u2 = a2 << 4 | t2[a2], l2 = n2 - t2[a2], c2 = f2[t2[a2] - 1]++ << l2, v2 = c2 | (1 << l2) - 1; c2 <= v2; ++c2) s2[p[c2] >> h2] = u2;
    } else for (s2 = new r(i2), a2 = 0; a2 < i2; ++a2) t2[a2] && (s2[a2] = p[f2[t2[a2] - 1]++] >> 15 - t2[a2]);
    return s2;
  }, w = new n(288);
  for (d = 0; d < 144; ++d) w[d] = 8;
  for (d = 144; d < 256; ++d) w[d] = 9;
  for (d = 256; d < 280; ++d) w[d] = 7;
  for (d = 280; d < 288; ++d) w[d] = 8;
  var b = new n(32);
  for (d = 0; d < 32; ++d) b[d] = 5;
  var m = /* @__PURE__ */ y(w, 9, 0), M = /* @__PURE__ */ y(w, 9, 1), z = /* @__PURE__ */ y(b, 5, 0), k = /* @__PURE__ */ y(b, 5, 1), x = function(t2) {
    for (var n2 = t2[0], r2 = 1; r2 < t2.length; ++r2) t2[r2] > n2 && (n2 = t2[r2]);
    return n2;
  }, A = function(t2, n2, r2) {
    var e2 = n2 / 8 | 0;
    return (t2[e2] | t2[e2 + 1] << 8) >> (7 & n2) & r2;
  }, S = function(t2, n2) {
    var r2 = n2 / 8 | 0;
    return (t2[r2] | t2[r2 + 1] << 8 | t2[r2 + 2] << 16) >> (7 & n2);
  }, T = function(t2) {
    return (t2 + 7) / 8 | 0;
  }, E = function(t2, r2, e2) {
    (null == r2 || r2 < 0) && (r2 = 0), (null == e2 || e2 > t2.length) && (e2 = t2.length);
    var i2 = new n(e2 - r2);
    return i2.set(t2.subarray(r2, e2)), i2;
  }, U = ["unexpected EOF", "invalid block type", "invalid length/literal", "invalid distance", "stream finished", "no stream handler", , "no callback", "invalid UTF-8 data", "extra field too long", "date not in range 1980-2099", "filename too long", "stream finishing", "invalid zip data"], O = function(t2, n2, r2) {
    var e2 = new Error(n2 || U[t2]);
    if (e2.code = t2, Error.captureStackTrace && Error.captureStackTrace(e2, O), !r2) throw e2;
    return e2;
  }, D = function(t2, r2, e2, s2) {
    var f2 = t2.length, u2 = s2 ? s2.length : 0;
    if (!f2 || r2.f && !r2.l) return e2 || new n(0);
    var l2 = !e2 || 2 != r2.i, v2 = r2.i;
    e2 || (e2 = new n(3 * f2));
    var p2 = function(t3) {
      var r3 = e2.length;
      if (t3 > r3) {
        var i2 = new n(Math.max(2 * r3, t3));
        i2.set(e2), e2 = i2;
      }
    }, d2 = r2.f || 0, g2 = r2.p || 0, w2 = r2.b || 0, b2 = r2.l, m2 = r2.d, z2 = r2.m, U2 = r2.n, D2 = 8 * f2;
    do {
      if (!b2) {
        d2 = A(t2, g2, 1);
        var $2 = A(t2, g2 + 1, 3);
        if (g2 += 3, !$2) {
          var B2 = t2[(G2 = T(g2) + 4) - 4] | t2[G2 - 3] << 8, L2 = G2 + B2;
          if (L2 > f2) {
            v2 && O(0);
            break;
          }
          l2 && p2(w2 + B2), e2.set(t2.subarray(G2, L2), w2), r2.b = w2 += B2, r2.p = g2 = 8 * L2, r2.f = d2;
          continue;
        }
        if (1 == $2) b2 = M, m2 = k, z2 = 9, U2 = 5;
        else if (2 == $2) {
          var C2 = A(t2, g2, 31) + 257, F2 = A(t2, g2 + 10, 15) + 4, I2 = C2 + A(t2, g2 + 5, 31) + 1;
          g2 += 14;
          for (var j2 = new n(I2), q2 = new n(19), R2 = 0; R2 < F2; ++R2) q2[o[R2]] = A(t2, g2 + 3 * R2, 7);
          g2 += 3 * F2;
          var V2 = x(q2), W2 = (1 << V2) - 1, P2 = y(q2, V2, 1);
          for (R2 = 0; R2 < I2; ) {
            var G2, H2 = P2[A(t2, g2, W2)];
            if (g2 += 15 & H2, (G2 = H2 >> 4) < 16) j2[R2++] = G2;
            else {
              var J2 = 0, K2 = 0;
              for (16 == G2 ? (K2 = 3 + A(t2, g2, 3), g2 += 2, J2 = j2[R2 - 1]) : 17 == G2 ? (K2 = 3 + A(t2, g2, 7), g2 += 3) : 18 == G2 && (K2 = 11 + A(t2, g2, 127), g2 += 7); K2--; ) j2[R2++] = J2;
            }
          }
          var N2 = j2.subarray(0, C2), Q2 = j2.subarray(C2);
          z2 = x(N2), U2 = x(Q2), b2 = y(N2, z2, 1), m2 = y(Q2, U2, 1);
        } else O(1);
        if (g2 > D2) {
          v2 && O(0);
          break;
        }
      }
      l2 && p2(w2 + 131072);
      for (var X2 = (1 << z2) - 1, Y2 = (1 << U2) - 1, Z2 = g2; ; Z2 = g2) {
        var _2 = (J2 = b2[S(t2, g2) & X2]) >> 4;
        if ((g2 += 15 & J2) > D2) {
          v2 && O(0);
          break;
        }
        if (J2 || O(2), _2 < 256) e2[w2++] = _2;
        else {
          if (256 == _2) {
            Z2 = g2, b2 = null;
            break;
          }
          var tt2 = _2 - 254;
          _2 > 264 && (tt2 = A(t2, g2, (1 << (et2 = i[R2 = _2 - 257])) - 1) + h[R2], g2 += et2);
          var nt2 = m2[S(t2, g2) & Y2], rt2 = nt2 >> 4;
          if (nt2 || O(3), g2 += 15 & nt2, Q2 = c[rt2], rt2 > 3) {
            var et2 = a[rt2];
            Q2 += S(t2, g2) & (1 << et2) - 1, g2 += et2;
          }
          if (g2 > D2) {
            v2 && O(0);
            break;
          }
          l2 && p2(w2 + 131072);
          var it2 = w2 + tt2;
          if (w2 < Q2) {
            var at2 = u2 - Q2, ot2 = Math.min(Q2, it2);
            for (at2 + w2 < 0 && O(3); w2 < ot2; ++w2) e2[w2] = s2[at2 + w2];
          }
          for (; w2 < it2; w2 += 4) e2[w2] = e2[w2 - Q2], e2[w2 + 1] = e2[w2 + 1 - Q2], e2[w2 + 2] = e2[w2 + 2 - Q2], e2[w2 + 3] = e2[w2 + 3 - Q2];
          w2 = it2;
        }
      }
      r2.l = b2, r2.p = Z2, r2.b = w2, r2.f = d2, b2 && (d2 = 1, r2.m = z2, r2.d = m2, r2.n = U2);
    } while (!d2);
    return w2 == e2.length ? e2 : E(e2, 0, w2);
  }, $ = function(t2, n2, r2) {
    var e2 = n2 / 8 | 0;
    t2[e2] |= r2 <<= 7 & n2, t2[e2 + 1] |= r2 >> 8;
  }, B = function(t2, n2, r2) {
    var e2 = n2 / 8 | 0;
    t2[e2] |= r2 <<= 7 & n2, t2[e2 + 1] |= r2 >> 8, t2[e2 + 2] |= r2 >> 16;
  }, L = function(t2, e2) {
    for (var i2 = [], a2 = 0; a2 < t2.length; ++a2) t2[a2] && i2.push({ s: a2, f: t2[a2] });
    var o2 = i2.length, s2 = i2.slice();
    if (!o2) return { t: V, l: 0 };
    if (1 == o2) {
      var f2 = new n(i2[0].s + 1);
      return f2[i2[0].s] = 1, { t: f2, l: 1 };
    }
    i2.sort(function(t3, n2) {
      return t3.f - n2.f;
    }), i2.push({ s: -1, f: 25001 });
    var h2 = i2[0], u2 = i2[1], l2 = 0, c2 = 1, v2 = 2;
    for (i2[0] = { s: -1, f: h2.f + u2.f, l: h2, r: u2 }; c2 != o2 - 1; ) h2 = i2[i2[l2].f < i2[v2].f ? l2++ : v2++], u2 = i2[l2 != c2 && i2[l2].f < i2[v2].f ? l2++ : v2++], i2[c2++] = { s: -1, f: h2.f + u2.f, l: h2, r: u2 };
    var p2 = s2[0].s;
    for (a2 = 1; a2 < o2; ++a2) s2[a2].s > p2 && (p2 = s2[a2].s);
    var d2 = new r(p2 + 1), g2 = C(i2[c2 - 1], d2, 0);
    if (g2 > e2) {
      a2 = 0;
      var y2 = 0, w2 = g2 - e2, b2 = 1 << w2;
      for (s2.sort(function(t3, n2) {
        return d2[n2.s] - d2[t3.s] || t3.f - n2.f;
      }); a2 < o2; ++a2) {
        var m2 = s2[a2].s;
        if (!(d2[m2] > e2)) break;
        y2 += b2 - (1 << g2 - d2[m2]), d2[m2] = e2;
      }
      for (y2 >>= w2; y2 > 0; ) {
        var M2 = s2[a2].s;
        d2[M2] < e2 ? y2 -= 1 << e2 - d2[M2]++ - 1 : ++a2;
      }
      for (; a2 >= 0 && y2; --a2) {
        var z2 = s2[a2].s;
        d2[z2] == e2 && (--d2[z2], ++y2);
      }
      g2 = e2;
    }
    return { t: new n(d2), l: g2 };
  }, C = function(t2, n2, r2) {
    return -1 == t2.s ? Math.max(C(t2.l, n2, r2 + 1), C(t2.r, n2, r2 + 1)) : n2[t2.s] = r2;
  }, F = function(t2) {
    for (var n2 = t2.length; n2 && !t2[--n2]; ) ;
    for (var e2 = new r(++n2), i2 = 0, a2 = t2[0], o2 = 1, s2 = function(t3) {
      e2[i2++] = t3;
    }, f2 = 1; f2 <= n2; ++f2) if (t2[f2] == a2 && f2 != n2) ++o2;
    else {
      if (!a2 && o2 > 2) {
        for (; o2 > 138; o2 -= 138) s2(32754);
        o2 > 2 && (s2(o2 > 10 ? o2 - 11 << 5 | 28690 : o2 - 3 << 5 | 12305), o2 = 0);
      } else if (o2 > 3) {
        for (s2(a2), --o2; o2 > 6; o2 -= 6) s2(8304);
        o2 > 2 && (s2(o2 - 3 << 5 | 8208), o2 = 0);
      }
      for (; o2--; ) s2(a2);
      o2 = 1, a2 = t2[f2];
    }
    return { c: e2.subarray(0, i2), n: n2 };
  }, I = function(t2, n2) {
    for (var r2 = 0, e2 = 0; e2 < n2.length; ++e2) r2 += t2[e2] * n2[e2];
    return r2;
  }, j = function(t2, n2, r2) {
    var e2 = r2.length, i2 = T(n2 + 2);
    t2[i2] = 255 & e2, t2[i2 + 1] = e2 >> 8, t2[i2 + 2] = 255 ^ t2[i2], t2[i2 + 3] = 255 ^ t2[i2 + 1];
    for (var a2 = 0; a2 < e2; ++a2) t2[i2 + a2 + 4] = r2[a2];
    return 8 * (i2 + 4 + e2);
  }, q = function(t2, n2, e2, s2, f2, h2, u2, l2, c2, v2, p2) {
    $(n2, p2++, e2), ++f2[256];
    for (var d2 = L(f2, 15), g2 = d2.t, M2 = d2.l, k2 = L(h2, 15), x2 = k2.t, A2 = k2.l, S2 = F(g2), T2 = S2.c, E2 = S2.n, U2 = F(x2), O2 = U2.c, D2 = U2.n, C2 = new r(19), q2 = 0; q2 < T2.length; ++q2) ++C2[31 & T2[q2]];
    for (q2 = 0; q2 < O2.length; ++q2) ++C2[31 & O2[q2]];
    for (var R2 = L(C2, 7), V2 = R2.t, W2 = R2.l, P2 = 19; P2 > 4 && !V2[o[P2 - 1]]; --P2) ;
    var G2, H2, J2, K2, N2 = v2 + 5 << 3, Q2 = I(f2, w) + I(h2, b) + u2, X2 = I(f2, g2) + I(h2, x2) + u2 + 14 + 3 * P2 + I(C2, V2) + 2 * C2[16] + 3 * C2[17] + 7 * C2[18];
    if (c2 >= 0 && N2 <= Q2 && N2 <= X2) return j(n2, p2, t2.subarray(c2, c2 + v2));
    if ($(n2, p2, 1 + (X2 < Q2)), p2 += 2, X2 < Q2) {
      G2 = y(g2, M2, 0), H2 = g2, J2 = y(x2, A2, 0), K2 = x2;
      var Y2 = y(V2, W2, 0);
      for ($(n2, p2, E2 - 257), $(n2, p2 + 5, D2 - 1), $(n2, p2 + 10, P2 - 4), p2 += 14, q2 = 0; q2 < P2; ++q2) $(n2, p2 + 3 * q2, V2[o[q2]]);
      p2 += 3 * P2;
      for (var Z2 = [T2, O2], _2 = 0; _2 < 2; ++_2) {
        var tt2 = Z2[_2];
        for (q2 = 0; q2 < tt2.length; ++q2) $(n2, p2, Y2[rt2 = 31 & tt2[q2]]), p2 += V2[rt2], rt2 > 15 && ($(n2, p2, tt2[q2] >> 5 & 127), p2 += tt2[q2] >> 12);
      }
    } else G2 = m, H2 = w, J2 = z, K2 = b;
    for (q2 = 0; q2 < l2; ++q2) {
      var nt2 = s2[q2];
      if (nt2 > 255) {
        var rt2;
        B(n2, p2, G2[257 + (rt2 = nt2 >> 18 & 31)]), p2 += H2[rt2 + 257], rt2 > 7 && ($(n2, p2, nt2 >> 23 & 31), p2 += i[rt2]);
        var et2 = 31 & nt2;
        B(n2, p2, J2[et2]), p2 += K2[et2], et2 > 3 && (B(n2, p2, nt2 >> 5 & 8191), p2 += a[et2]);
      } else B(n2, p2, G2[nt2]), p2 += H2[nt2];
    }
    return B(n2, p2, G2[256]), p2 + H2[256];
  }, R = /* @__PURE__ */ new e([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]), V = /* @__PURE__ */ new n(0), W = function(t2, o2, s2, f2, h2, l2) {
    var c2 = l2.z || t2.length, p2 = new n(f2 + c2 + 5 * (1 + Math.ceil(c2 / 7e3)) + h2), d2 = p2.subarray(f2, p2.length - h2), g2 = l2.l, y2 = 7 & (l2.r || 0);
    if (o2) {
      y2 && (d2[0] = l2.r >> 3);
      for (var w2 = R[o2 - 1], b2 = w2 >> 13, m2 = 8191 & w2, M2 = (1 << s2) - 1, z2 = l2.p || new r(32768), k2 = l2.h || new r(M2 + 1), x2 = Math.ceil(s2 / 3), A2 = 2 * x2, S2 = function(n2) {
        return (t2[n2] ^ t2[n2 + 1] << x2 ^ t2[n2 + 2] << A2) & M2;
      }, U2 = new e(25e3), O2 = new r(288), D2 = new r(32), $2 = 0, B2 = 0, L2 = l2.i || 0, C2 = 0, F2 = l2.w || 0, I2 = 0; L2 + 2 < c2; ++L2) {
        var V2 = S2(L2), W2 = 32767 & L2, P2 = k2[V2];
        if (z2[W2] = P2, k2[V2] = W2, F2 <= L2) {
          var G2 = c2 - L2;
          if (($2 > 7e3 || C2 > 24576) && (G2 > 423 || !g2)) {
            y2 = q(t2, d2, 0, U2, O2, D2, B2, C2, I2, L2 - I2, y2), C2 = $2 = B2 = 0, I2 = L2;
            for (var H2 = 0; H2 < 286; ++H2) O2[H2] = 0;
            for (H2 = 0; H2 < 30; ++H2) D2[H2] = 0;
          }
          var J2 = 2, K2 = 0, N2 = m2, Q2 = W2 - P2 & 32767;
          if (G2 > 2 && V2 == S2(L2 - Q2)) for (var X2 = Math.min(b2, G2) - 1, Y2 = Math.min(32767, L2), Z2 = Math.min(258, G2); Q2 <= Y2 && --N2 && W2 != P2; ) {
            if (t2[L2 + J2] == t2[L2 + J2 - Q2]) {
              for (var _2 = 0; _2 < Z2 && t2[L2 + _2] == t2[L2 + _2 - Q2]; ++_2) ;
              if (_2 > J2) {
                if (J2 = _2, K2 = Q2, _2 > X2) break;
                var tt2 = Math.min(Q2, _2 - 2), nt2 = 0;
                for (H2 = 0; H2 < tt2; ++H2) {
                  var rt2 = L2 - Q2 + H2 & 32767, et2 = rt2 - z2[rt2] & 32767;
                  et2 > nt2 && (nt2 = et2, P2 = rt2);
                }
              }
            }
            Q2 += (W2 = P2) - (P2 = z2[W2]) & 32767;
          }
          if (K2) {
            U2[C2++] = 268435456 | u[J2] << 18 | v[K2];
            var it2 = 31 & u[J2], at2 = 31 & v[K2];
            B2 += i[it2] + a[at2], ++O2[257 + it2], ++D2[at2], F2 = L2 + J2, ++$2;
          } else U2[C2++] = t2[L2], ++O2[t2[L2]];
        }
      }
      for (L2 = Math.max(L2, F2); L2 < c2; ++L2) U2[C2++] = t2[L2], ++O2[t2[L2]];
      y2 = q(t2, d2, g2, U2, O2, D2, B2, C2, I2, L2 - I2, y2), g2 || (l2.r = 7 & y2 | d2[y2 / 8 | 0] << 3, y2 -= 7, l2.h = k2, l2.p = z2, l2.i = L2, l2.w = F2);
    } else {
      for (L2 = l2.w || 0; L2 < c2 + g2; L2 += 65535) {
        var ot2 = L2 + 65535;
        ot2 >= c2 && (d2[y2 / 8 | 0] = g2, ot2 = c2), y2 = j(d2, y2 + 1, t2.subarray(L2, ot2));
      }
      l2.i = c2;
    }
    return E(p2, 0, f2 + T(y2) + h2);
  }, P = /* @__PURE__ */ function() {
    for (var t2 = new Int32Array(256), n2 = 0; n2 < 256; ++n2) {
      for (var r2 = n2, e2 = 9; --e2; ) r2 = (1 & r2 && -306674912) ^ r2 >>> 1;
      t2[n2] = r2;
    }
    return t2;
  }(), G = function() {
    var t2 = -1;
    return { p: function(n2) {
      for (var r2 = t2, e2 = 0; e2 < n2.length; ++e2) r2 = P[255 & r2 ^ n2[e2]] ^ r2 >>> 8;
      t2 = r2;
    }, d: function() {
      return ~t2;
    } };
  }, H = function() {
    var t2 = 1, n2 = 0;
    return { p: function(r2) {
      for (var e2 = t2, i2 = n2, a2 = 0 | r2.length, o2 = 0; o2 != a2; ) {
        for (var s2 = Math.min(o2 + 2655, a2); o2 < s2; ++o2) i2 += e2 += r2[o2];
        e2 = (65535 & e2) + 15 * (e2 >> 16), i2 = (65535 & i2) + 15 * (i2 >> 16);
      }
      t2 = e2, n2 = i2;
    }, d: function() {
      return (255 & (t2 %= 65521)) << 24 | (65280 & t2) << 8 | (255 & (n2 %= 65521)) << 8 | n2 >> 8;
    } };
  }, J = function(t2, r2, e2, i2, a2) {
    if (!a2 && (a2 = { l: 1 }, r2.dictionary)) {
      var o2 = r2.dictionary.subarray(-32768), s2 = new n(o2.length + t2.length);
      s2.set(o2), s2.set(t2, o2.length), t2 = s2, a2.w = o2.length;
    }
    return W(t2, null == r2.level ? 6 : r2.level, null == r2.mem ? Math.ceil(1.5 * Math.max(8, Math.min(13, Math.log(t2.length)))) : 12 + r2.mem, e2, i2, a2);
  }, K = function(t2, n2, r2) {
    for (var e2 = t2(), i2 = t2.toString(), a2 = i2.slice(i2.indexOf("[") + 1, i2.lastIndexOf("]")).replace(/\s+/g, "").split(","), o2 = 0; o2 < e2.length; ++o2) {
      var s2 = e2[o2], f2 = a2[o2];
      if ("function" == typeof s2) {
        n2 += ";" + f2 + "=";
        var h2 = s2.toString();
        if (s2.prototype) if (-1 != h2.indexOf("[native code]")) {
          var u2 = h2.indexOf(" ", 8) + 1;
          n2 += h2.slice(u2, h2.indexOf("(", u2));
        } else for (var l2 in n2 += h2, s2.prototype) n2 += ";" + f2 + ".prototype." + l2 + "=" + s2.prototype[l2].toString();
        else n2 += h2;
      } else r2[f2] = s2;
    }
    return n2;
  }, N = [], Q = function() {
    return [n, r, e, i, a, o, h, c, M, k, p, U, y, x, A, S, T, E, O, D, wt, nt, rt];
  }, X = function() {
    return [n, r, e, i, a, o, u, v, m, w, z, b, p, R, V, y, $, B, L, C, F, I, j, q, T, E, W, J, dt, nt];
  }, Y = function() {
    return [ot, ht, at, G, P];
  }, Z = function() {
    return [st, ft];
  }, _ = function() {
    return [ut, at, H];
  }, tt = function() {
    return [lt];
  }, nt = function(t2) {
    return postMessage(t2, [t2.buffer]);
  }, rt = function(t2) {
    return t2 && { out: t2.size && new n(t2.size), dictionary: t2.dictionary };
  }, et = function(t2) {
    return t2.ondata = function(t3, n2) {
      return postMessage([t3, n2], [t3.buffer]);
    }, function(n2) {
      return t2.push(n2.data[0], n2.data[1]);
    };
  }, it = function(n2, r2, e2, i2, a2, o2) {
    var s2, f2 = function(n3, e3, i3, a3) {
      if (!N[i3]) {
        for (var s3 = "", h2 = {}, u2 = n3.length - 1, l2 = 0; l2 < u2; ++l2) s3 = K(n3[l2], s3, h2);
        N[i3] = { c: K(n3[u2], s3, h2), e: h2 };
      }
      var c2 = function(t2, n4) {
        var r3 = {};
        for (var e4 in t2) r3[e4] = t2[e4];
        for (var e4 in n4) r3[e4] = n4[e4];
        return r3;
      }({}, N[i3].e);
      return function(n4, r3, e4, i4, a4) {
        var o3 = new Worker(t[r3] || (t[r3] = URL.createObjectURL(new Blob([n4 + ';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'], { type: "text/javascript" }))));
        return o3.onmessage = function(t2) {
          var n5 = t2.data, r4 = n5.$e$;
          if (r4) {
            var e5 = new Error(r4[0]);
            e5.code = r4[1], e5.stack = r4[2], a4(e5, null);
          } else a4(null, n5);
        }, o3.postMessage(e4, i4), o3;
      }(N[i3].c + ";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage=" + e3.toString() + "}", i3, c2, function(t2) {
        var n4 = [];
        for (var r3 in t2) t2[r3].buffer && n4.push((t2[r3] = new t2[r3].constructor(t2[r3])).buffer);
        return n4;
      }(c2), function(t2, n4) {
        t2 ? (f2.terminate(), r2.ondata.call(r2, t2)) : Array.isArray(n4) ? (n4[1] && f2.terminate(), r2.ondata.call(r2, t2, n4[0], n4[1])) : o2(n4);
      });
    }(n2, i2, a2);
    f2.postMessage(e2), r2.push = function(t2, n3) {
      r2.ondata || O(5), s2 && r2.ondata(O(4, 0, 1), null, !!n3), f2.postMessage([t2, s2 = n3], [t2.buffer]);
    }, r2.terminate = function() {
      f2.terminate();
    };
  }, at = function(t2, n2, r2) {
    for (; r2; ++n2) t2[n2] = r2, r2 >>>= 8;
  }, ot = function(t2, n2) {
    var r2 = n2.filename;
    if (t2[0] = 31, t2[1] = 139, t2[2] = 8, t2[8] = n2.level < 2 ? 4 : 9 == n2.level ? 2 : 0, t2[9] = 3, 0 != n2.mtime && at(t2, 4, Math.floor(new Date(n2.mtime || Date.now()) / 1e3)), r2) {
      t2[3] = 8;
      for (var e2 = 0; e2 <= r2.length; ++e2) t2[e2 + 10] = r2.charCodeAt(e2);
    }
  }, st = function(t2) {
    31 == t2[0] && 139 == t2[1] && 8 == t2[2] || O(6, "invalid gzip data");
    var n2 = t2[3], r2 = 10;
    4 & n2 && (r2 += 2 + (t2[10] | t2[11] << 8));
    for (var e2 = (n2 >> 3 & 1) + (n2 >> 4 & 1); e2 > 0; e2 -= !t2[r2++]) ;
    return r2 + (2 & n2);
  }, ft = function(t2) {
    var n2 = t2.length;
    return (t2[n2 - 4] | t2[n2 - 3] << 8 | t2[n2 - 2] << 16 | t2[n2 - 1] << 24) >>> 0;
  }, ht = function(t2) {
    return 10 + (t2.filename ? t2.filename.length + 1 : 0);
  }, ut = function(t2, n2) {
    var r2 = n2.level, e2 = 0 == r2 ? 0 : r2 < 6 ? 1 : 9 == r2 ? 3 : 2;
    if (t2[0] = 120, t2[1] = e2 << 6 | (n2.dictionary && 32), t2[1] |= 31 - (t2[0] << 8 | t2[1]) % 31, n2.dictionary) {
      var i2 = H();
      i2.p(n2.dictionary), at(t2, 2, i2.d());
    }
  }, lt = function(t2, n2) {
    return (8 != (15 & t2[0]) || t2[0] >> 4 > 7 || (t2[0] << 8 | t2[1]) % 31) && O(6, "invalid zlib data"), (t2[1] >> 5 & 1) == +!n2 && O(6, "invalid zlib data: " + (32 & t2[1] ? "need" : "unexpected") + " dictionary"), 2 + (t2[1] >> 3 & 4);
  };
  function ct(t2, n2) {
    return "function" == typeof t2 && (n2 = t2, t2 = {}), this.ondata = n2, t2;
  }
  var vt = /* @__PURE__ */ function() {
    function t2(t3, r2) {
      if ("function" == typeof t3 && (r2 = t3, t3 = {}), this.ondata = r2, this.o = t3 || {}, this.s = { l: 0, i: 32768, w: 32768, z: 32768 }, this.b = new n(98304), this.o.dictionary) {
        var e2 = this.o.dictionary.subarray(-32768);
        this.b.set(e2, 32768 - e2.length), this.s.i = 32768 - e2.length;
      }
    }
    return t2.prototype.p = function(t3, n2) {
      this.ondata(J(t3, this.o, 0, 0, this.s), n2);
    }, t2.prototype.push = function(t3, r2) {
      this.ondata || O(5), this.s.l && O(4);
      var e2 = t3.length + this.s.z;
      if (e2 > this.b.length) {
        if (e2 > 2 * this.b.length - 32768) {
          var i2 = new n(-32768 & e2);
          i2.set(this.b.subarray(0, this.s.z)), this.b = i2;
        }
        var a2 = this.b.length - this.s.z;
        a2 && (this.b.set(t3.subarray(0, a2), this.s.z), this.s.z = this.b.length, this.p(this.b, false)), this.b.set(this.b.subarray(-32768)), this.b.set(t3.subarray(a2), 32768), this.s.z = t3.length - a2 + 32768, this.s.i = 32766, this.s.w = 32768;
      } else this.b.set(t3, this.s.z), this.s.z += t3.length;
      this.s.l = 1 & r2, (this.s.z > this.s.w + 8191 || r2) && (this.p(this.b, r2 || false), this.s.w = this.s.i, this.s.i -= 2);
    }, t2;
  }(), pt = /* @__PURE__ */ function() {
    return function(t2, n2) {
      it([X, function() {
        return [et, vt];
      }], this, ct.call(this, t2, n2), function(t3) {
        var n3 = new vt(t3.data);
        onmessage = et(n3);
      }, 6);
    };
  }();
  function dt(t2, n2) {
    return J(t2, n2 || {}, 0, 0);
  }
  var gt = /* @__PURE__ */ function() {
    function t2(t3, r2) {
      "function" == typeof t3 && (r2 = t3, t3 = {}), this.ondata = r2;
      var e2 = t3 && t3.dictionary && t3.dictionary.subarray(-32768);
      this.s = { i: 0, b: e2 ? e2.length : 0 }, this.o = new n(32768), this.p = new n(0), e2 && this.o.set(e2);
    }
    return t2.prototype.e = function(t3) {
      if (this.ondata || O(5), this.d && O(4), this.p.length) {
        if (t3.length) {
          var r2 = new n(this.p.length + t3.length);
          r2.set(this.p), r2.set(t3, this.p.length), this.p = r2;
        }
      } else this.p = t3;
    }, t2.prototype.c = function(t3) {
      this.s.i = +(this.d = t3 || false);
      var n2 = this.s.b, r2 = D(this.p, this.s, this.o);
      this.ondata(E(r2, n2, this.s.b), this.d), this.o = E(r2, this.s.b - 32768), this.s.b = this.o.length, this.p = E(this.p, this.s.p / 8 | 0), this.s.p &= 7;
    }, t2.prototype.push = function(t3, n2) {
      this.e(t3), this.c(n2);
    }, t2;
  }(), yt = /* @__PURE__ */ function() {
    return function(t2, n2) {
      it([Q, function() {
        return [et, gt];
      }], this, ct.call(this, t2, n2), function(t3) {
        var n3 = new gt(t3.data);
        onmessage = et(n3);
      }, 7);
    };
  }();
  function wt(t2, n2) {
    return D(t2, { i: 2 }, n2 && n2.out, n2 && n2.dictionary);
  }
  var bt = /* @__PURE__ */ function() {
    function t2(t3, n2) {
      this.c = G(), this.l = 0, this.v = 1, vt.call(this, t3, n2);
    }
    return t2.prototype.push = function(t3, n2) {
      this.c.p(t3), this.l += t3.length, vt.prototype.push.call(this, t3, n2);
    }, t2.prototype.p = function(t3, n2) {
      var r2 = J(t3, this.o, this.v && ht(this.o), n2 && 8, this.s);
      this.v && (ot(r2, this.o), this.v = 0), n2 && (at(r2, r2.length - 8, this.c.d()), at(r2, r2.length - 4, this.l)), this.ondata(r2, n2);
    }, t2;
  }(), mt = /* @__PURE__ */ function() {
    return function(t2, n2) {
      it([X, Y, function() {
        return [et, vt, bt];
      }], this, ct.call(this, t2, n2), function(t3) {
        var n3 = new bt(t3.data);
        onmessage = et(n3);
      }, 8);
    };
  }(), Mt = /* @__PURE__ */ function() {
    function t2(t3, n2) {
      this.v = 1, this.r = 0, gt.call(this, t3, n2);
    }
    return t2.prototype.push = function(t3, r2) {
      if (gt.prototype.e.call(this, t3), this.r += t3.length, this.v) {
        var e2 = this.p.subarray(this.v - 1), i2 = e2.length > 3 ? st(e2) : 4;
        if (i2 > e2.length) {
          if (!r2) return;
        } else this.v > 1 && this.onmember && this.onmember(this.r - e2.length);
        this.p = e2.subarray(i2), this.v = 0;
      }
      gt.prototype.c.call(this, r2), this.s.f && !this.s.l && (this.v = T(this.s.p) + 9, this.s = { i: 0 }, this.o = new n(0), this.p.length && this.push(new n(0), r2));
    }, t2;
  }(), zt = /* @__PURE__ */ function() {
    return function(t2, n2) {
      var r2 = this;
      it([Q, Z, function() {
        return [et, gt, Mt];
      }], this, ct.call(this, t2, n2), function(t3) {
        var n3 = new Mt(t3.data);
        n3.onmember = function(t4) {
          return postMessage(t4);
        }, onmessage = et(n3);
      }, 9, function(t3) {
        return r2.onmember && r2.onmember(t3);
      });
    };
  }(), kt = /* @__PURE__ */ function() {
    function t2(t3, n2) {
      this.c = H(), this.v = 1, vt.call(this, t3, n2);
    }
    return t2.prototype.push = function(t3, n2) {
      this.c.p(t3), vt.prototype.push.call(this, t3, n2);
    }, t2.prototype.p = function(t3, n2) {
      var r2 = J(t3, this.o, this.v && (this.o.dictionary ? 6 : 2), n2 && 4, this.s);
      this.v && (ut(r2, this.o), this.v = 0), n2 && at(r2, r2.length - 4, this.c.d()), this.ondata(r2, n2);
    }, t2;
  }(), xt = /* @__PURE__ */ function() {
    return function(t2, n2) {
      it([X, _, function() {
        return [et, vt, kt];
      }], this, ct.call(this, t2, n2), function(t3) {
        var n3 = new kt(t3.data);
        onmessage = et(n3);
      }, 10);
    };
  }(), At = /* @__PURE__ */ function() {
    function t2(t3, n2) {
      gt.call(this, t3, n2), this.v = t3 && t3.dictionary ? 2 : 1;
    }
    return t2.prototype.push = function(t3, n2) {
      if (gt.prototype.e.call(this, t3), this.v) {
        if (this.p.length < 6 && !n2) return;
        this.p = this.p.subarray(lt(this.p, this.v - 1)), this.v = 0;
      }
      n2 && (this.p.length < 4 && O(6, "invalid zlib data"), this.p = this.p.subarray(0, -4)), gt.prototype.c.call(this, n2);
    }, t2;
  }(), St = /* @__PURE__ */ function() {
    return function(t2, n2) {
      it([Q, tt, function() {
        return [et, gt, At];
      }], this, ct.call(this, t2, n2), function(t3) {
        var n3 = new At(t3.data);
        onmessage = et(n3);
      }, 11);
    };
  }(), Tt = "undefined" != typeof TextDecoder && /* @__PURE__ */ new TextDecoder();
  try {
    Tt.decode(V, { stream: true });
  } catch (t2) {
  }
  const Et = (t2) => class {
    constructor() {
      this.ondata = void 0, this.i = void 0, this.i = new t2(), this.i.ondata = (t3, n2) => {
        this.ondata(null, t3, n2);
      };
    }
    push(t3, n2) {
      try {
        this.i.push(t3, n2);
      } catch (t4) {
        this.ondata(t4, null, n2 || false);
      }
    }
  };
  let Ut = 1;
  try {
    new pt().terminate();
  } catch (O2) {
    Ut = 0;
  }
  const Ot = Ut ? { gzip: mt, deflate: xt, "deflate-raw": pt } : { gzip: Et(bt), deflate: Et(kt), "deflate-raw": Et(vt) }, Dt = Ut ? { gzip: zt, deflate: St, "deflate-raw": yt } : { gzip: Et(Mt), deflate: Et(At), "deflate-raw": Et(gt) }, $t = (t2, n2, r2) => class extends t2 {
    constructor(t3) {
      if (!arguments.length) throw new TypeError(`Failed to construct '${r2}': 1 argument required, but only 0 present.`);
      const e2 = n2[t3];
      if (!e2) throw new TypeError(`Failed to construct '${r2}': Unsupported compression format: '${t3}'`);
      let i2, a2 = new e2();
      super({ start: (t4) => {
        a2.ondata = (n3, r3, e3) => {
          n3 ? t4.error(n3) : r3 && (t4.enqueue(r3), e3 && (i2 ? i2() : t4.terminate()));
        };
      }, transform: (t4) => {
        if (t4 instanceof ArrayBuffer) t4 = new Uint8Array(t4);
        else {
          if (!ArrayBuffer.isView(t4)) throw new TypeError("The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
          t4 = new Uint8Array(t4.buffer, t4.byteOffset, t4.byteLength);
        }
        a2.push(t4);
      }, flush: () => new Promise((t4) => {
        i2 = t4, a2.push(new Uint8Array(0), true);
      }) }, { size: (t4) => 0 | t4.byteLength, highWaterMark: 65536 });
    }
  }, Bt = "undefined" == typeof globalThis ? "undefined" == typeof self ? "undefined" == typeof global ? {} : global : self : globalThis;
  var Lt;
  void 0 === Bt.CompressionStream && (Bt.CompressionStream = (Lt = TransformStream, $t(Lt, Ot, "CompressionStream"))), void 0 === Bt.DecompressionStream && (Bt.DecompressionStream = function(t2) {
    return $t(t2, Dt, "DecompressionStream");
  }(TransformStream));
});
//# sourceMappingURL=compression-streams-pollyfill-R4F7KT6R.js.map
