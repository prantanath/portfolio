var Sh = Object.defineProperty,
  Mh = Object.defineProperties;
var xh = Object.getOwnPropertyDescriptors;
var Sc = Object.getOwnPropertySymbols;
var Th = Object.prototype.hasOwnProperty,
  _h = Object.prototype.propertyIsEnumerable;
var Mc = (e, t, n) =>
    t in e
      ? Sh(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  y = (e, t) => {
    for (var n in (t ||= {})) Th.call(t, n) && Mc(e, n, t[n]);
    if (Sc) for (var n of Sc(t)) _h.call(t, n) && Mc(e, n, t[n]);
    return e;
  },
  z = (e, t) => Mh(e, xh(t));
var Ci = null;
var wi = 1,
  xc = Symbol("SIGNAL");
function F(e) {
  let t = Ci;
  return (Ci = e), t;
}
function Tc() {
  return Ci;
}
var Ei = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Nh(e) {
  if (!(xi(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === wi)) {
    if (!e.producerMustRecompute(e) && !bi(e)) {
      (e.dirty = !1), (e.lastCleanEpoch = wi);
      return;
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = wi);
  }
}
function Ii(e) {
  return e && (e.nextProducerIndex = 0), F(e);
}
function _c(e, t) {
  if (
    (F(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (xi(e))
      for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
        Mi(e.producerNode[n], e.producerIndexOfThis[n]);
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop();
  }
}
function bi(e) {
  Ti(e);
  for (let t = 0; t < e.producerNode.length; t++) {
    let n = e.producerNode[t],
      r = e.producerLastReadVersion[t];
    if (r !== n.version || (Nh(n), r !== n.version)) return !0;
  }
  return !1;
}
function Si(e) {
  if ((Ti(e), xi(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      Mi(e.producerNode[t], e.producerIndexOfThis[t]);
  (e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function Mi(e, t) {
  if ((Ah(e), e.liveConsumerNode.length === 1 && Rh(e)))
    for (let r = 0; r < e.producerNode.length; r++)
      Mi(e.producerNode[r], e.producerIndexOfThis[r]);
  let n = e.liveConsumerNode.length - 1;
  if (
    ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
    (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length)
  ) {
    let r = e.liveConsumerIndexOfThis[t],
      o = e.liveConsumerNode[t];
    Ti(o), (o.producerIndexOfThis[r] = t);
  }
}
function xi(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function Ti(e) {
  (e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= []);
}
function Ah(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function Rh(e) {
  return e.producerNode !== void 0;
}
function Oh() {
  throw new Error();
}
var kh = Oh;
function Nc(e) {
  kh = e;
}
function I(e) {
  return typeof e == "function";
}
function Bt(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var Sr = Bt(
  (e) =>
    function (n) {
      e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = n);
    },
);
function _n(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var G = class e {
  constructor(t) {
    (this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let i of n) i.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (I(r))
        try {
          r();
        } catch (i) {
          t = i instanceof Sr ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            Ac(i);
          } catch (s) {
            (t = t ?? []),
              s instanceof Sr ? (t = [...t, ...s.errors]) : t.push(s);
          }
      }
      if (t) throw new Sr(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) Ac(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: n } = this;
    return n === t || (Array.isArray(n) && n.includes(t));
  }
  _addParent(t) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
  }
  _removeParent(t) {
    let { _parentage: n } = this;
    n === t ? (this._parentage = null) : Array.isArray(n) && _n(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    n && _n(n, t), t instanceof e && t._removeParent(this);
  }
};
G.EMPTY = (() => {
  let e = new G();
  return (e.closed = !0), e;
})();
var _i = G.EMPTY;
function Mr(e) {
  return (
    e instanceof G ||
    (e && "closed" in e && I(e.remove) && I(e.add) && I(e.unsubscribe))
  );
}
function Ac(e) {
  I(e) ? e() : e.unsubscribe();
}
var Se = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Ut = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = Ut;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = Ut;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function xr(e) {
  Ut.setTimeout(() => {
    let { onUnhandledError: t } = Se;
    if (t) t(e);
    else throw e;
  });
}
function Nn() {}
var Rc = Ni("C", void 0, void 0);
function Oc(e) {
  return Ni("E", void 0, e);
}
function kc(e) {
  return Ni("N", e, void 0);
}
function Ni(e, t, n) {
  return { kind: e, value: t, error: n };
}
var yt = null;
function Ht(e) {
  if (Se.useDeprecatedSynchronousErrorHandling) {
    let t = !yt;
    if ((t && (yt = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = yt;
      if (((yt = null), n)) throw r;
    }
  } else e();
}
function Pc(e) {
  Se.useDeprecatedSynchronousErrorHandling &&
    yt &&
    ((yt.errorThrown = !0), (yt.error = e));
}
var Dt = class extends G {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), Mr(t) && t.add(this))
          : (this.destination = Lh);
    }
    static create(t, n, r) {
      return new zt(t, n, r);
    }
    next(t) {
      this.isStopped ? Ri(kc(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? Ri(Oc(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? Ri(Rc, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(t) {
      this.destination.next(t);
    }
    _error(t) {
      try {
        this.destination.error(t);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  Ph = Function.prototype.bind;
function Ai(e, t) {
  return Ph.call(e, t);
}
var Oi = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(t);
        } catch (r) {
          Tr(r);
        }
    }
    error(t) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(t);
        } catch (r) {
          Tr(r);
        }
      else Tr(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (n) {
          Tr(n);
        }
    }
  },
  zt = class extends Dt {
    constructor(t, n, r) {
      super();
      let o;
      if (I(t) || !t)
        o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let i;
        this && Se.useDeprecatedNextContext
          ? ((i = Object.create(t)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: t.next && Ai(t.next, i),
              error: t.error && Ai(t.error, i),
              complete: t.complete && Ai(t.complete, i),
            }))
          : (o = t);
      }
      this.destination = new Oi(o);
    }
  };
function Tr(e) {
  Se.useDeprecatedSynchronousErrorHandling ? Pc(e) : xr(e);
}
function Fh(e) {
  throw e;
}
function Ri(e, t) {
  let { onStoppedNotification: n } = Se;
  n && Ut.setTimeout(() => n(e, t));
}
var Lh = { closed: !0, next: Nn, error: Fh, complete: Nn };
var Gt = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function ue(e) {
  return e;
}
function ki(...e) {
  return Pi(e);
}
function Pi(e) {
  return e.length === 0
    ? ue
    : e.length === 1
      ? e[0]
      : function (n) {
          return e.reduce((r, o) => o(r), n);
        };
}
var j = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new e();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, o) {
      let i = Vh(n) ? n : new zt(n, r, o);
      return (
        Ht(() => {
          let { operator: s, source: a } = this;
          i.add(
            s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i),
          );
        }),
        i
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = Fc(r)),
        new r((o, i) => {
          let s = new zt({
            next: (a) => {
              try {
                n(a);
              } catch (c) {
                i(c), s.unsubscribe();
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [Gt]() {
      return this;
    }
    pipe(...n) {
      return Pi(n)(this);
    }
    toPromise(n) {
      return (
        (n = Fc(n)),
        new n((r, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i),
          );
        })
      );
    }
  }
  return (e.create = (t) => new e(t)), e;
})();
function Fc(e) {
  var t;
  return (t = e ?? Se.Promise) !== null && t !== void 0 ? t : Promise;
}
function jh(e) {
  return e && I(e.next) && I(e.error) && I(e.complete);
}
function Vh(e) {
  return (e && e instanceof Dt) || (jh(e) && Mr(e));
}
function Fi(e) {
  return I(e?.lift);
}
function k(e) {
  return (t) => {
    if (Fi(t))
      return t.lift(function (n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function P(e, t, n, r, o) {
  return new Li(e, t, n, r, o);
}
var Li = class extends Dt {
  constructor(t, n, r, o, i, s) {
    super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (c) {
              t.error(c);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (c) {
              t.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      super.unsubscribe(),
        !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
    }
  }
};
function qt() {
  return k((e, t) => {
    let n = null;
    e._refCount++;
    let r = P(t, void 0, void 0, void 0, () => {
      if (!e || e._refCount <= 0 || 0 < --e._refCount) {
        n = null;
        return;
      }
      let o = e._connection,
        i = n;
      (n = null), o && (!i || o === i) && o.unsubscribe(), t.unsubscribe();
    });
    e.subscribe(r), r.closed || (n = e.connect());
  });
}
var Wt = class extends j {
  constructor(t, n) {
    super(),
      (this.source = t),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Fi(t) && (this.lift = t.lift);
  }
  _subscribe(t) {
    return this.getSubject().subscribe(t);
  }
  getSubject() {
    let t = this._subject;
    return (
      (!t || t.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: t } = this;
    (this._subject = this._connection = null), t?.unsubscribe();
  }
  connect() {
    let t = this._connection;
    if (!t) {
      t = this._connection = new G();
      let n = this.getSubject();
      t.add(
        this.source.subscribe(
          P(
            n,
            void 0,
            () => {
              this._teardown(), n.complete();
            },
            (r) => {
              this._teardown(), n.error(r);
            },
            () => this._teardown(),
          ),
        ),
      ),
        t.closed && ((this._connection = null), (t = G.EMPTY));
    }
    return t;
  }
  refCount() {
    return qt()(this);
  }
};
var Lc = Bt(
  (e) =>
    function () {
      e(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    },
);
var oe = (() => {
    class e extends j {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(n) {
        let r = new _r(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new Lc();
      }
      next(n) {
        Ht(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        Ht(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        Ht(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var n;
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        );
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n);
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        );
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: o, observers: i } = this;
        return r || o
          ? _i
          : ((this.currentObservers = null),
            i.push(n),
            new G(() => {
              (this.currentObservers = null), _n(i, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: o, isStopped: i } = this;
        r ? n.error(o) : i && n.complete();
      }
      asObservable() {
        let n = new j();
        return (n.source = this), n;
      }
    }
    return (e.create = (t, n) => new _r(t, n)), e;
  })(),
  _r = class extends oe {
    constructor(t, n) {
      super(), (this.destination = t), (this.source = n);
    }
    next(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    error(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    complete() {
      var t, n;
      (n =
        (t = this.destination) === null || t === void 0
          ? void 0
          : t.complete) === null ||
        n === void 0 ||
        n.call(t);
    }
    _subscribe(t) {
      var n, r;
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(t)) !== null && r !== void 0
        ? r
        : _i;
    }
  };
var W = class extends oe {
  constructor(t) {
    super(), (this._value = t);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let n = super._subscribe(t);
    return !n.closed && t.next(this._value), n;
  }
  getValue() {
    let { hasError: t, thrownError: n, _value: r } = this;
    if (t) throw n;
    return this._throwIfClosed(), r;
  }
  next(t) {
    super.next((this._value = t));
  }
};
var le = new j((e) => e.complete());
function jc(e) {
  return e && I(e.schedule);
}
function Vc(e) {
  return e[e.length - 1];
}
function $c(e) {
  return I(Vc(e)) ? e.pop() : void 0;
}
function rt(e) {
  return jc(Vc(e)) ? e.pop() : void 0;
}
function Uc(e, t, n, r) {
  function o(i) {
    return i instanceof n
      ? i
      : new n(function (s) {
          s(i);
        });
  }
  return new (n || (n = Promise))(function (i, s) {
    function a(l) {
      try {
        u(r.next(l));
      } catch (d) {
        s(d);
      }
    }
    function c(l) {
      try {
        u(r.throw(l));
      } catch (d) {
        s(d);
      }
    }
    function u(l) {
      l.done ? i(l.value) : o(l.value).then(a, c);
    }
    u((r = r.apply(e, t || [])).next());
  });
}
function Bc(e) {
  var t = typeof Symbol == "function" && Symbol.iterator,
    n = t && e[t],
    r = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == "number")
    return {
      next: function () {
        return (
          e && r >= e.length && (e = void 0),
          {
            value: e && e[r++],
            done: !e,
          }
        );
      },
    };
  throw new TypeError(
    t ? "Object is not iterable." : "Symbol.iterator is not defined.",
  );
}
function wt(e) {
  return this instanceof wt ? ((this.v = e), this) : new wt(e);
}
function Hc(e, t, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(e, t || []),
    o,
    i = [];
  return (
    (o = {}),
    a("next"),
    a("throw"),
    a("return", s),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(f) {
    return function (g) {
      return Promise.resolve(g).then(f, d);
    };
  }
  function a(f, g) {
    r[f] &&
      ((o[f] = function (E) {
        return new Promise(function (V, B) {
          i.push([f, E, V, B]) > 1 || c(f, E);
        });
      }),
      g && (o[f] = g(o[f])));
  }
  function c(f, g) {
    try {
      u(r[f](g));
    } catch (E) {
      h(i[0][3], E);
    }
  }
  function u(f) {
    f.value instanceof wt
      ? Promise.resolve(f.value.v).then(l, d)
      : h(i[0][2], f);
  }
  function l(f) {
    c("next", f);
  }
  function d(f) {
    c("throw", f);
  }
  function h(f, g) {
    f(g), i.shift(), i.length && c(i[0][0], i[0][1]);
  }
}
function zc(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof Bc == "function" ? Bc(e) : e[Symbol.iterator]()),
      (n = {}),
      r("next"),
      r("throw"),
      r("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(i) {
    n[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, c) {
          (s = e[i](s)), o(a, c, s.done, s.value);
        });
      };
  }
  function o(i, s, a, c) {
    Promise.resolve(c).then(function (u) {
      i({ value: u, done: a });
    }, s);
  }
}
var Nr = (e) => e && typeof e.length == "number" && typeof e != "function";
function Ar(e) {
  return I(e?.then);
}
function Rr(e) {
  return I(e[Gt]);
}
function Or(e) {
  return Symbol.asyncIterator && I(e?.[Symbol.asyncIterator]);
}
function kr(e) {
  return new TypeError(
    `You provided ${
      e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function $h() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Pr = $h();
function Fr(e) {
  return I(e?.[Pr]);
}
function Lr(e) {
  return Hc(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield wt(n.read());
        if (o) return yield wt(void 0);
        yield yield wt(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function jr(e) {
  return I(e?.getReader);
}
function K(e) {
  if (e instanceof j) return e;
  if (e != null) {
    if (Rr(e)) return Bh(e);
    if (Nr(e)) return Uh(e);
    if (Ar(e)) return Hh(e);
    if (Or(e)) return Gc(e);
    if (Fr(e)) return zh(e);
    if (jr(e)) return Gh(e);
  }
  throw kr(e);
}
function Bh(e) {
  return new j((t) => {
    let n = e[Gt]();
    if (I(n.subscribe)) return n.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable",
    );
  });
}
function Uh(e) {
  return new j((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function Hh(e) {
  return new j((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n),
    ).then(null, xr);
  });
}
function zh(e) {
  return new j((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function Gc(e) {
  return new j((t) => {
    qh(e, t).catch((n) => t.error(n));
  });
}
function Gh(e) {
  return Gc(Lr(e));
}
function qh(e, t) {
  var n, r, o, i;
  return Uc(this, void 0, void 0, function* () {
    try {
      for (n = zc(e); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = n.return) && (yield i.call(n));
      } finally {
        if (o) throw o.error;
      }
    }
    t.complete();
  });
}
function ae(e, t, n, r = 0, o = !1) {
  let i = t.schedule(function () {
    n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((e.add(i), !o)) return i;
}
function Vr(e, t = 0) {
  return k((n, r) => {
    n.subscribe(
      P(
        r,
        (o) => ae(r, e, () => r.next(o), t),
        () => ae(r, e, () => r.complete(), t),
        (o) => ae(r, e, () => r.error(o), t),
      ),
    );
  });
}
function $r(e, t = 0) {
  return k((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function qc(e, t) {
  return K(e).pipe($r(t), Vr(t));
}
function Wc(e, t) {
  return K(e).pipe($r(t), Vr(t));
}
function Zc(e, t) {
  return new j((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function Qc(e, t) {
  return new j((n) => {
    let r;
    return (
      ae(n, t, () => {
        (r = e[Pr]()),
          ae(
            n,
            t,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              i ? n.complete() : n.next(o);
            },
            0,
            !0,
          );
      }),
      () => I(r?.return) && r.return()
    );
  });
}
function Br(e, t) {
  if (!e) throw new Error("Iterable cannot be null");
  return new j((n) => {
    ae(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      ae(
        n,
        t,
        () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value);
          });
        },
        0,
        !0,
      );
    });
  });
}
function Yc(e, t) {
  return Br(Lr(e), t);
}
function Kc(e, t) {
  if (e != null) {
    if (Rr(e)) return qc(e, t);
    if (Nr(e)) return Zc(e, t);
    if (Ar(e)) return Wc(e, t);
    if (Or(e)) return Br(e, t);
    if (Fr(e)) return Qc(e, t);
    if (jr(e)) return Yc(e, t);
  }
  throw kr(e);
}
function Z(e, t) {
  return t ? Kc(e, t) : K(e);
}
function b(...e) {
  let t = rt(e);
  return Z(e, t);
}
function Zt(e, t) {
  let n = I(e) ? e : () => e,
    r = (o) => o.error(n());
  return new j(t ? (o) => t.schedule(r, 0, o) : r);
}
function ji(e) {
  return !!e && (e instanceof j || (I(e.lift) && I(e.subscribe)));
}
var We = Bt(
  (e) =>
    function () {
      e(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    },
);
function R(e, t) {
  return k((n, r) => {
    let o = 0;
    n.subscribe(
      P(r, (i) => {
        r.next(e.call(t, i, o++));
      }),
    );
  });
}
var { isArray: Wh } = Array;
function Zh(e, t) {
  return Wh(t) ? e(...t) : e(t);
}
function Jc(e) {
  return R((t) => Zh(e, t));
}
var { isArray: Qh } = Array,
  { getPrototypeOf: Yh, prototype: Kh, keys: Jh } = Object;
function Xc(e) {
  if (e.length === 1) {
    let t = e[0];
    if (Qh(t)) return { args: t, keys: null };
    if (Xh(t)) {
      let n = Jh(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function Xh(e) {
  return e && typeof e == "object" && Yh(e) === Kh;
}
function eu(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function Ur(...e) {
  let t = rt(e),
    n = $c(e),
    { args: r, keys: o } = Xc(e);
  if (r.length === 0) return Z([], t);
  let i = new j(ep(r, t, o ? (s) => eu(o, s) : ue));
  return n ? i.pipe(Jc(n)) : i;
}
function ep(e, t, n = ue) {
  return (r) => {
    tu(
      t,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          a = o;
        for (let c = 0; c < o; c++)
          tu(
            t,
            () => {
              let u = Z(e[c], t),
                l = !1;
              u.subscribe(
                P(
                  r,
                  (d) => {
                    (i[c] = d), l || ((l = !0), a--), a || r.next(n(i.slice()));
                  },
                  () => {
                    --s || r.complete();
                  },
                ),
              );
            },
            r,
          );
      },
      r,
    );
  };
}
function tu(e, t, n) {
  e ? ae(n, e, t) : t();
}
function nu(e, t, n, r, o, i, s, a) {
  let c = [],
    u = 0,
    l = 0,
    d = !1,
    h = () => {
      d && !c.length && !u && t.complete();
    },
    f = (E) => (u < r ? g(E) : c.push(E)),
    g = (E) => {
      i && t.next(E), u++;
      let V = !1;
      K(n(E, l++)).subscribe(
        P(
          t,
          (B) => {
            o?.(B), i ? f(B) : t.next(B);
          },
          () => {
            V = !0;
          },
          void 0,
          () => {
            if (V)
              try {
                for (u--; c.length && u < r; ) {
                  let B = c.shift();
                  s ? ae(t, s, () => g(B)) : g(B);
                }
                h();
              } catch (B) {
                t.error(B);
              }
          },
        ),
      );
    };
  return (
    e.subscribe(
      P(t, f, () => {
        (d = !0), h();
      }),
    ),
    () => {
      a?.();
    }
  );
}
function Q(e, t, n = 1 / 0) {
  return I(t)
    ? Q((r, o) => R((i, s) => t(r, i, o, s))(K(e(r, o))), n)
    : (typeof t == "number" && (n = t), k((r, o) => nu(r, o, e, n)));
}
function Vi(e = 1 / 0) {
  return Q(ue, e);
}
function ru() {
  return Vi(1);
}
function Qt(...e) {
  return ru()(Z(e, rt(e)));
}
function Hr(e) {
  return new j((t) => {
    K(e()).subscribe(t);
  });
}
function Me(e, t) {
  return k((n, r) => {
    let o = 0;
    n.subscribe(P(r, (i) => e.call(t, i, o++) && r.next(i)));
  });
}
function ot(e) {
  return k((t, n) => {
    let r = null,
      o = !1,
      i;
    (r = t.subscribe(
      P(n, void 0, void 0, (s) => {
        (i = K(e(s, ot(e)(t)))),
          r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
      }),
    )),
      o && (r.unsubscribe(), (r = null), i.subscribe(n));
  });
}
function ou(e, t, n, r, o) {
  return (i, s) => {
    let a = n,
      c = t,
      u = 0;
    i.subscribe(
      P(
        s,
        (l) => {
          let d = u++;
          (c = a ? e(c, l, d) : ((a = !0), l)), r && s.next(c);
        },
        o &&
          (() => {
            a && s.next(c), s.complete();
          }),
      ),
    );
  };
}
function Yt(e, t) {
  return I(t) ? Q(e, t, 1) : Q(e, 1);
}
function it(e) {
  return k((t, n) => {
    let r = !1;
    t.subscribe(
      P(
        n,
        (o) => {
          (r = !0), n.next(o);
        },
        () => {
          r || n.next(e), n.complete();
        },
      ),
    );
  });
}
function Ze(e) {
  return e <= 0
    ? () => le
    : k((t, n) => {
        let r = 0;
        t.subscribe(
          P(n, (o) => {
            ++r <= e && (n.next(o), e <= r && n.complete());
          }),
        );
      });
}
function $i(e) {
  return R(() => e);
}
function zr(e = tp) {
  return k((t, n) => {
    let r = !1;
    t.subscribe(
      P(
        n,
        (o) => {
          (r = !0), n.next(o);
        },
        () => (r ? n.complete() : n.error(e())),
      ),
    );
  });
}
function tp() {
  return new We();
}
function An(e) {
  return k((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function Pe(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? Me((o, i) => e(o, i, r)) : ue,
      Ze(1),
      n ? it(t) : zr(() => new We()),
    );
}
function Kt(e) {
  return e <= 0
    ? () => le
    : k((t, n) => {
        let r = [];
        t.subscribe(
          P(
            n,
            (o) => {
              r.push(o), e < r.length && r.shift();
            },
            () => {
              for (let o of r) n.next(o);
              n.complete();
            },
            void 0,
            () => {
              r = null;
            },
          ),
        );
      });
}
function Bi(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? Me((o, i) => e(o, i, r)) : ue,
      Kt(1),
      n ? it(t) : zr(() => new We()),
    );
}
function Ui(e, t) {
  return k(ou(e, t, arguments.length >= 2, !0));
}
function Hi(...e) {
  let t = rt(e);
  return k((n, r) => {
    (t ? Qt(e, n, t) : Qt(e, n)).subscribe(r);
  });
}
function xe(e, t) {
  return k((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    n.subscribe(
      P(
        r,
        (c) => {
          o?.unsubscribe();
          let u = 0,
            l = i++;
          K(e(c, l)).subscribe(
            (o = P(
              r,
              (d) => r.next(t ? t(c, d, l, u++) : d),
              () => {
                (o = null), a();
              },
            )),
          );
        },
        () => {
          (s = !0), a();
        },
      ),
    );
  });
}
function zi(e) {
  return k((t, n) => {
    K(e).subscribe(P(n, () => n.complete(), Nn)), !n.closed && t.subscribe(n);
  });
}
function ee(e, t, n) {
  let r = I(e) || t || n ? { next: e, error: t, complete: n } : e;
  return r
    ? k((o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        o.subscribe(
          P(
            i,
            (c) => {
              var u;
              (u = r.next) === null || u === void 0 || u.call(r, c), i.next(c);
            },
            () => {
              var c;
              (a = !1),
                (c = r.complete) === null || c === void 0 || c.call(r),
                i.complete();
            },
            (c) => {
              var u;
              (a = !1),
                (u = r.error) === null || u === void 0 || u.call(r, c),
                i.error(c);
            },
            () => {
              var c, u;
              a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
                (u = r.finalize) === null || u === void 0 || u.call(r);
            },
          ),
        );
      })
    : ue;
}
var Bu = "https://g.co/ng/security#xss",
  D = class extends Error {
    constructor(t, n) {
      super(Us(t, n)), (this.code = t);
    }
  };
function Us(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ": " + t : ""}`;
}
function Io(e) {
  return { toString: e }.toString();
}
var Gr = "__parameters__";
function np(e) {
  return function (...n) {
    if (e) {
      let r = e(...n);
      for (let o in r) this[o] = r[o];
    }
  };
}
function Uu(e, t, n) {
  return Io(() => {
    let r = np(t);
    function o(...i) {
      if (this instanceof o) return r.apply(this, i), this;
      let s = new o(...i);
      return (a.annotation = s), a;
      function a(c, u, l) {
        let d = c.hasOwnProperty(Gr)
          ? c[Gr]
          : Object.defineProperty(c, Gr, { value: [] })[Gr];
        for (; d.length <= l; ) d.push(null);
        return (d[l] = d[l] || []).push(s), c;
      }
    }
    return (
      n && (o.prototype = Object.create(n.prototype)),
      (o.prototype.ngMetadataName = e),
      (o.annotationCls = o),
      o
    );
  });
}
function $(e) {
  for (let t in e) if (e[t] === $) return t;
  throw Error("Could not find renamed property on target object.");
}
function ce(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return "[" + e.map(ce).join(", ") + "]";
  if (e == null) return "" + e;
  if (e.overriddenName) return `${e.overriddenName}`;
  if (e.name) return `${e.name}`;
  let t = e.toString();
  if (t == null) return "" + t;
  let n = t.indexOf(`
`);
  return n === -1 ? t : t.substring(0, n);
}
function ns(e, t) {
  return e == null || e === ""
    ? t === null
      ? ""
      : t
    : t == null || t === ""
      ? e
      : e + " " + t;
}
var rp = $({ __forward_ref__: $ });
function Hu(e) {
  return (
    (e.__forward_ref__ = Hu),
    (e.toString = function () {
      return ce(this());
    }),
    e
  );
}
function me(e) {
  return zu(e) ? e() : e;
}
function zu(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(rp) && e.__forward_ref__ === Hu
  );
}
function w(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function bo(e) {
  return iu(e, qu) || iu(e, Wu);
}
function Gu(e) {
  return bo(e) !== null;
}
function iu(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null;
}
function op(e) {
  let t = e && (e[qu] || e[Wu]);
  return t || null;
}
function su(e) {
  return e && (e.hasOwnProperty(au) || e.hasOwnProperty(ip)) ? e[au] : null;
}
var qu = $({ ɵprov: $ }),
  au = $({ ɵinj: $ }),
  Wu = $({ ngInjectableDef: $ }),
  ip = $({ ngInjectorDef: $ }),
  M = class {
    constructor(t, n) {
      (this._desc = t),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof n == "number"
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = w({
              token: this,
              providedIn: n.providedIn || "root",
              factory: n.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function Zu(e) {
  return e && !!e.ɵproviders;
}
var sp = $({ ɵcmp: $ }),
  ap = $({ ɵdir: $ }),
  cp = $({ ɵpipe: $ }),
  up = $({ ɵmod: $ }),
  Xr = $({ ɵfac: $ }),
  On = $({ __NG_ELEMENT_ID__: $ }),
  cu = $({ __NG_ENV_ID__: $ });
function kn(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function lp(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
      ? e.type.name || e.type.toString()
      : kn(e);
}
function dp(e, t) {
  let n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
  throw new D(-200, e);
}
function Hs(e, t) {
  throw new D(-201, !1);
}
var T = (function (e) {
    return (
      (e[(e.Default = 0)] = "Default"),
      (e[(e.Host = 1)] = "Host"),
      (e[(e.Self = 2)] = "Self"),
      (e[(e.SkipSelf = 4)] = "SkipSelf"),
      (e[(e.Optional = 8)] = "Optional"),
      e
    );
  })(T || {}),
  rs;
function Qu() {
  return rs;
}
function ge(e) {
  let t = rs;
  return (rs = e), t;
}
function Yu(e, t, n) {
  let r = bo(e);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & T.Optional) return null;
  if (t !== void 0) return t;
  Hs(e, "Injector");
}
var fp = {},
  Pn = fp,
  os = "__NG_DI_FLAG__",
  eo = "ngTempTokenPath",
  hp = "ngTokenPath",
  pp = /\n/gm,
  gp = "\u0275",
  uu = "__source",
  tn;
function mp() {
  return tn;
}
function st(e) {
  let t = tn;
  return (tn = e), t;
}
function vp(e, t = T.Default) {
  if (tn === void 0) throw new D(-203, !1);
  return tn === null
    ? Yu(e, void 0, t)
    : tn.get(e, t & T.Optional ? null : void 0, t);
}
function _(e, t = T.Default) {
  return (Qu() || vp)(me(e), t);
}
function p(e, t = T.Default) {
  return _(e, So(t));
}
function So(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function is(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = me(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new D(900, !1);
      let o,
        i = T.Default;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          c = yp(a);
        typeof c == "number" ? (c === -1 ? (o = a.token) : (i |= c)) : (o = a);
      }
      t.push(_(o, i));
    } else t.push(_(r));
  }
  return t;
}
function Ku(e, t) {
  return (e[os] = t), (e.prototype[os] = t), e;
}
function yp(e) {
  return e[os];
}
function Dp(e, t, n, r) {
  let o = e[eo];
  throw (
    (t[uu] && o.unshift(t[uu]),
    (e.message = wp(
      `
` + e.message,
      o,
      n,
      r,
    )),
    (e[hp] = o),
    (e[eo] = null),
    e)
  );
}
function wp(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == gp
      ? e.slice(2)
      : e;
  let o = ce(t);
  if (Array.isArray(t)) o = t.map(ce).join(" -> ");
  else if (typeof t == "object") {
    let i = [];
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let a = t[s];
        i.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : ce(a)));
      }
    o = `{${i.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
    pp,
    `
  `,
  )}`;
}
var zs = Ku(Uu("Optional"), 8);
var Ju = Ku(Uu("SkipSelf"), 4);
function rn(e, t) {
  let n = e.hasOwnProperty(Xr);
  return n ? e[Xr] : null;
}
function Gs(e, t) {
  e.forEach((n) => (Array.isArray(n) ? Gs(n, t) : t(n)));
}
function Xu(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function to(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function Cp(e, t, n, r) {
  let o = e.length;
  if (o == t) e.push(n, r);
  else if (o === 1) e.push(r, e[0]), (e[0] = n);
  else {
    for (o--, e.push(e[o - 1], e[o]); o > t; ) {
      let i = o - 2;
      (e[o] = e[i]), o--;
    }
    (e[t] = n), (e[t + 1] = r);
  }
}
function qs(e, t, n) {
  let r = qn(e, t);
  return r >= 0 ? (e[r | 1] = n) : ((r = ~r), Cp(e, r, t, n)), r;
}
function Gi(e, t) {
  let n = qn(e, t);
  if (n >= 0) return e[n | 1];
}
function qn(e, t) {
  return Ep(e, t, 1);
}
function Ep(e, t, n) {
  let r = 0,
    o = e.length >> n;
  for (; o !== r; ) {
    let i = r + ((o - r) >> 1),
      s = e[i << n];
    if (t === s) return i << n;
    s > t ? (o = i) : (r = i + 1);
  }
  return ~(o << n);
}
var Fn = {},
  Qe = [],
  on = new M(""),
  el = new M("", -1),
  tl = new M(""),
  no = class {
    get(t, n = Pn) {
      if (n === Pn) {
        let r = new Error(`NullInjectorError: No provider for ${ce(t)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  },
  nl = (function (e) {
    return (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e;
  })(nl || {}),
  je = (function (e) {
    return (
      (e[(e.Emulated = 0)] = "Emulated"),
      (e[(e.None = 2)] = "None"),
      (e[(e.ShadowDom = 3)] = "ShadowDom"),
      e
    );
  })(je || {}),
  ut = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.SignalBased = 1)] = "SignalBased"),
      (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      e
    );
  })(ut || {});
function Ip(e, t, n) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(t, n);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    n = o + 1;
  }
}
function ss(e, t, n) {
  let r = 0;
  for (; r < n.length; ) {
    let o = n[r];
    if (typeof o == "number") {
      if (o !== 0) break;
      r++;
      let i = n[r++],
        s = n[r++],
        a = n[r++];
      e.setAttribute(t, s, a, i);
    } else {
      let i = o,
        s = n[++r];
      Sp(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
    }
  }
  return r;
}
function bp(e) {
  return e === 3 || e === 4 || e === 6;
}
function Sp(e) {
  return e.charCodeAt(0) === 64;
}
function Ws(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == "number"
          ? (n = o)
          : n === 0 ||
            (n === -1 || n === 2
              ? lu(e, n, o, null, t[++r])
              : lu(e, n, o, null, null));
      }
    }
  return e;
}
function lu(e, t, n, r, o) {
  let i = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == "number") {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i];
    if (typeof a == "number") break;
    if (a === n) {
      if (r === null) {
        o !== null && (e[i + 1] = o);
        return;
      } else if (r === e[i + 1]) {
        e[i + 2] = o;
        return;
      }
    }
    i++, r !== null && i++, o !== null && i++;
  }
  s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, n),
    r !== null && e.splice(i++, 0, r),
    o !== null && e.splice(i++, 0, o);
}
var rl = "ng-template";
function Mp(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == "string"; o += 2)
      if (t[o] === "class" && Ip(t[o + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (Zs(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == "string"; )
      if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function Zs(e) {
  return e.type === 4 && e.value !== rl;
}
function xp(e, t, n) {
  let r = e.type === 4 && !n ? rl : e.value;
  return t === r;
}
function Tp(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? Ap(o) : 0,
    s = !1;
  for (let a = 0; a < t.length; a++) {
    let c = t[a];
    if (typeof c == "number") {
      if (!s && !Te(r) && !Te(c)) return !1;
      if (s && Te(c)) continue;
      (s = !1), (r = c | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== "" && !xp(e, c, n)) || (c === "" && t.length === 1))
        ) {
          if (Te(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !Mp(e, o, c, n)) {
          if (Te(r)) return !1;
          s = !0;
        }
      } else {
        let u = t[++a],
          l = _p(c, o, Zs(e), n);
        if (l === -1) {
          if (Te(r)) return !1;
          s = !0;
          continue;
        }
        if (u !== "") {
          let d;
          if (
            (l > i ? (d = "") : (d = o[l + 1].toLowerCase()), r & 2 && u !== d)
          ) {
            if (Te(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return Te(r) || s;
}
function Te(e) {
  return (e & 1) === 0;
}
function _p(e, t, n, r) {
  if (t === null) return -1;
  let o = 0;
  if (r || !n) {
    let i = !1;
    for (; o < t.length; ) {
      let s = t[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = t[++o];
        for (; typeof a == "string"; ) a = t[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return Rp(t, e);
}
function Np(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (Tp(e, t[r], n)) return !0;
  return !1;
}
function Ap(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (bp(n)) return t;
  }
  return e.length;
}
function Rp(e, t) {
  let n = e.indexOf(4);
  if (n > -1)
    for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == "number") return -1;
      if (r === t) return n;
      n++;
    }
  return -1;
}
function du(e, t) {
  return e ? ":not(" + t.trim() + ")" : t;
}
function Op(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = "",
    i = !1;
  for (; n < e.length; ) {
    let s = e[n];
    if (typeof s == "string")
      if (r & 2) {
        let a = e[++n];
        o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (o += "." + s) : r & 4 && (o += " " + s);
    else
      o !== "" && !Te(s) && ((t += du(i, o)), (o = "")),
        (r = s),
        (i = i || !Te(r));
    n++;
  }
  return o !== "" && (t += du(i, o)), t;
}
function kp(e) {
  return e.map(Op).join(",");
}
function Pp(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == "string")
      o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
    else {
      if (!Te(o)) break;
      o = i;
    }
    r++;
  }
  return { attrs: t, classes: n };
}
function J(e) {
  return Io(() => {
    let t = cl(e),
      n = z(y({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === nl.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || je.Emulated,
        styles: e.styles || Qe,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    ul(n);
    let r = e.dependencies;
    return (
      (n.directiveDefs = hu(r, !1)), (n.pipeDefs = hu(r, !0)), (n.id = jp(n)), n
    );
  });
}
function Fp(e) {
  return It(e) || ol(e);
}
function Lp(e) {
  return e !== null;
}
function fu(e, t) {
  if (e == null) return Fn;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a = ut.None;
      Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i))
        : ((i = o), (s = o)),
        t ? ((n[i] = a !== ut.None ? [r, a] : r), (t[i] = s)) : (n[i] = r);
    }
  return n;
}
function hn(e) {
  return Io(() => {
    let t = cl(e);
    return ul(t), t;
  });
}
function It(e) {
  return e[sp] || null;
}
function ol(e) {
  return e[ap] || null;
}
function il(e) {
  return e[cp] || null;
}
function sl(e) {
  let t = It(e) || ol(e) || il(e);
  return t !== null ? t.standalone : !1;
}
function al(e, t) {
  let n = e[up] || null;
  if (!n && t === !0)
    throw new Error(`Type ${ce(e)} does not have '\u0275mod' property.`);
  return n;
}
function cl(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputTransforms: null,
    inputConfig: e.inputs || Fn,
    exportAs: e.exportAs || null,
    standalone: e.standalone === !0,
    signals: e.signals === !0,
    selectors: e.selectors || Qe,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: fu(e.inputs, t),
    outputs: fu(e.outputs),
    debugInfo: null,
  };
}
function ul(e) {
  e.features?.forEach((t) => t(e));
}
function hu(e, t) {
  if (!e) return null;
  let n = t ? il : Fp;
  return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(Lp);
}
function jp(e) {
  let t = 0,
    n = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      e.consts,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ].join("|");
  for (let o of n) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0;
  return (t += 2147483648), "c" + t;
}
function Mo(e) {
  return { ɵproviders: e };
}
function Vp(...e) {
  return { ɵproviders: ll(!0, e), ɵfromNgModule: !0 };
}
function ll(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    Gs(t, (s) => {
      let a = s;
      as(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && dl(o, i),
    n
  );
}
function dl(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    Qs(o, (i) => {
      t(i, r);
    });
  }
}
function as(e, t, n, r) {
  if (((e = me(e)), !e)) return !1;
  let o = null,
    i = su(e),
    s = !i && It(e);
  if (!i && !s) {
    let c = e.ngModule;
    if (((i = su(c)), i)) o = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let a = r.has(o);
  if (s) {
    if (a) return !1;
    if ((r.add(o), s.dependencies)) {
      let c =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let u of c) as(u, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let u;
      try {
        Gs(i.imports, (l) => {
          as(l, t, n, r) && ((u ||= []), u.push(l));
        });
      } finally {
      }
      u !== void 0 && dl(u, t);
    }
    if (!a) {
      let u = rn(o) || (() => new o());
      t({ provide: o, useFactory: u, deps: Qe }, o),
        t({ provide: tl, useValue: o, multi: !0 }, o),
        t({ provide: on, useValue: () => _(o), multi: !0 }, o);
    }
    let c = i.providers;
    if (c != null && !a) {
      let u = e;
      Qs(c, (l) => {
        t(l, u);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function Qs(e, t) {
  for (let n of e)
    Zu(n) && (n = n.ɵproviders), Array.isArray(n) ? Qs(n, t) : t(n);
}
var $p = $({ provide: String, useValue: $ });
function fl(e) {
  return e !== null && typeof e == "object" && $p in e;
}
function Bp(e) {
  return !!(e && e.useExisting);
}
function Up(e) {
  return !!(e && e.useFactory);
}
function cs(e) {
  return typeof e == "function";
}
var xo = new M(""),
  Zr = {},
  Hp = {},
  qi;
function Ys() {
  return qi === void 0 && (qi = new no()), qi;
}
var De = class {},
  Ln = class extends De {
    get destroyed() {
      return this._destroyed;
    }
    constructor(t, n, r, o) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = o),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        ls(t, (s) => this.processProvider(s)),
        this.records.set(el, Jt(void 0, this)),
        o.has("environment") && this.records.set(De, Jt(void 0, this));
      let i = this.records.get(xo);
      i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(tl, Qe, T.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let t = F(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          F(t);
      }
    }
    onDestroy(t) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(t),
        () => this.removeOnDestroy(t)
      );
    }
    runInContext(t) {
      this.assertNotDestroyed();
      let n = st(this),
        r = ge(void 0),
        o;
      try {
        return t();
      } finally {
        st(n), ge(r);
      }
    }
    get(t, n = Pn, r = T.Default) {
      if ((this.assertNotDestroyed(), t.hasOwnProperty(cu))) return t[cu](this);
      r = So(r);
      let o,
        i = st(this),
        s = ge(void 0);
      try {
        if (!(r & T.SkipSelf)) {
          let c = this.records.get(t);
          if (c === void 0) {
            let u = Qp(t) && bo(t);
            u && this.injectableDefInScope(u)
              ? (c = Jt(us(t), Zr))
              : (c = null),
              this.records.set(t, c);
          }
          if (c != null) return this.hydrate(t, c);
        }
        let a = r & T.Self ? Ys() : this.parent;
        return (n = r & T.Optional && n === Pn ? null : n), a.get(t, n);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[eo] = a[eo] || []).unshift(ce(t)), i)) throw a;
          return Dp(a, t, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        ge(s), st(i);
      }
    }
    resolveInjectorInitializers() {
      let t = F(null),
        n = st(this),
        r = ge(void 0),
        o;
      try {
        let i = this.get(on, Qe, T.Self);
        for (let s of i) s();
      } finally {
        st(n), ge(r), F(t);
      }
    }
    toString() {
      let t = [],
        n = this.records;
      for (let r of n.keys()) t.push(ce(r));
      return `R3Injector[${t.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new D(205, !1);
    }
    processProvider(t) {
      t = me(t);
      let n = cs(t) ? t : me(t && t.provide),
        r = Gp(t);
      if (!cs(t) && t.multi === !0) {
        let o = this.records.get(n);
        o ||
          ((o = Jt(void 0, Zr, !0)),
          (o.factory = () => is(o.multi)),
          this.records.set(n, o)),
          (n = t),
          o.multi.push(t);
      }
      this.records.set(n, r);
    }
    hydrate(t, n) {
      let r = F(null);
      try {
        return (
          n.value === Zr && ((n.value = Hp), (n.value = n.factory())),
          typeof n.value == "object" &&
            n.value &&
            Zp(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        F(r);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let n = me(t.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function us(e) {
  let t = bo(e),
    n = t !== null ? t.factory : rn(e);
  if (n !== null) return n;
  if (e instanceof M) throw new D(204, !1);
  if (e instanceof Function) return zp(e);
  throw new D(204, !1);
}
function zp(e) {
  if (e.length > 0) throw new D(204, !1);
  let n = op(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function Gp(e) {
  if (fl(e)) return Jt(void 0, e.useValue);
  {
    let t = qp(e);
    return Jt(t, Zr);
  }
}
function qp(e, t, n) {
  let r;
  if (cs(e)) {
    let o = me(e);
    return rn(o) || us(o);
  } else if (fl(e)) r = () => me(e.useValue);
  else if (Up(e)) r = () => e.useFactory(...is(e.deps || []));
  else if (Bp(e)) r = () => _(me(e.useExisting));
  else {
    let o = me(e && (e.useClass || e.provide));
    if (Wp(e)) r = () => new o(...is(e.deps));
    else return rn(o) || us(o);
  }
  return r;
}
function Jt(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function Wp(e) {
  return !!e.deps;
}
function Zp(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function Qp(e) {
  return typeof e == "function" || (typeof e == "object" && e instanceof M);
}
function ls(e, t) {
  for (let n of e)
    Array.isArray(n) ? ls(n, t) : n && Zu(n) ? ls(n.ɵproviders, t) : t(n);
}
function Je(e, t) {
  e instanceof Ln && e.assertNotDestroyed();
  let n,
    r = st(e),
    o = ge(void 0);
  try {
    return t();
  } finally {
    st(r), ge(o);
  }
}
function Yp() {
  return Qu() !== void 0 || mp() != null;
}
function Kp(e) {
  return typeof e == "function";
}
var Xe = 0,
  O = 1,
  C = 2,
  se = 3,
  Ne = 4,
  Ae = 5,
  ro = 6,
  oo = 7,
  Ye = 8,
  sn = 9,
  Ve = 10,
  re = 11,
  jn = 12,
  pu = 13,
  Wn = 14,
  $e = 15,
  an = 16,
  Xt = 17,
  cn = 18,
  To = 19,
  hl = 20,
  at = 21,
  Wi = 22,
  ve = 23,
  lt = 25,
  pl = 1;
var bt = 7,
  io = 8,
  so = 9,
  ye = 10,
  ao = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      e
    );
  })(ao || {});
function ct(e) {
  return Array.isArray(e) && typeof e[pl] == "object";
}
function et(e) {
  return Array.isArray(e) && e[pl] === !0;
}
function gl(e) {
  return (e.flags & 4) !== 0;
}
function _o(e) {
  return e.componentOffset > -1;
}
function Ks(e) {
  return (e.flags & 1) === 1;
}
function Zn(e) {
  return !!e.template;
}
function ds(e) {
  return (e[C] & 512) !== 0;
}
var fs = class {
  constructor(t, n, r) {
    (this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function ml(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
function No() {
  return vl;
}
function vl(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = Xp), Jp;
}
No.ngInherit = !0;
function Jp() {
  let e = Dl(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === Fn) e.previous = t;
    else for (let r in t) n[r] = t[r];
    (e.current = null), this.ngOnChanges(t);
  }
}
function Xp(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = Dl(e) || eg(e, { previous: Fn, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    u = c[i];
  (a[i] = new fs(u && u.currentValue, n, c === Fn)), ml(e, t, o, n);
}
var yl = "__ngSimpleChanges__";
function Dl(e) {
  return e[yl] || null;
}
function eg(e, t) {
  return (e[yl] = t);
}
var gu = null;
var Fe = function (e, t, n) {
    gu?.(e, t, n);
  },
  wl = "svg",
  tg = "math";
function Be(e) {
  for (; Array.isArray(e); ) e = e[Xe];
  return e;
}
function Cl(e, t) {
  return Be(t[e]);
}
function Re(e, t) {
  return Be(t[e.index]);
}
function El(e, t) {
  return e.data[t];
}
function ht(e, t) {
  let n = t[e];
  return ct(n) ? n : n[Xe];
}
function Js(e) {
  return (e[C] & 128) === 128;
}
function ng(e) {
  return et(e[se]);
}
function co(e, t) {
  return t == null ? null : e[t];
}
function Il(e) {
  e[Xt] = 0;
}
function bl(e) {
  e[C] & 1024 || ((e[C] |= 1024), Js(e) && Ao(e));
}
function Vn(e) {
  return !!(e[C] & 9216 || e[ve]?.dirty);
}
function hs(e) {
  e[Ve].changeDetectionScheduler?.notify(7),
    e[C] & 64 && (e[C] |= 1024),
    Vn(e) && Ao(e);
}
function Ao(e) {
  e[Ve].changeDetectionScheduler?.notify(0);
  let t = St(e);
  for (; t !== null && !(t[C] & 8192 || ((t[C] |= 8192), !Js(t))); ) t = St(t);
}
function Sl(e, t) {
  if ((e[C] & 256) === 256) throw new D(911, !1);
  e[at] === null && (e[at] = []), e[at].push(t);
}
function rg(e, t) {
  if (e[at] === null) return;
  let n = e[at].indexOf(t);
  n !== -1 && e[at].splice(n, 1);
}
function St(e) {
  let t = e[se];
  return et(t) ? t[se] : t;
}
var N = {
  lFrame: Ll(null),
  bindingsEnabled: !0,
  skipHydrationRootTNode: null,
};
var Ml = !1;
function og() {
  return N.lFrame.elementDepthCount;
}
function ig() {
  N.lFrame.elementDepthCount++;
}
function sg() {
  N.lFrame.elementDepthCount--;
}
function xl() {
  return N.bindingsEnabled;
}
function ag() {
  return N.skipHydrationRootTNode !== null;
}
function cg(e) {
  return N.skipHydrationRootTNode === e;
}
function ug() {
  N.skipHydrationRootTNode = null;
}
function H() {
  return N.lFrame.lView;
}
function pt() {
  return N.lFrame.tView;
}
function we() {
  let e = Tl();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function Tl() {
  return N.lFrame.currentTNode;
}
function lg() {
  let e = N.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function Qn(e, t) {
  let n = N.lFrame;
  (n.currentTNode = e), (n.isParent = t);
}
function _l() {
  return N.lFrame.isParent;
}
function dg() {
  N.lFrame.isParent = !1;
}
function Nl() {
  return Ml;
}
function mu(e) {
  Ml = e;
}
function Al() {
  let e = N.lFrame,
    t = e.bindingRootIndex;
  return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
}
function fg() {
  return N.lFrame.bindingIndex;
}
function hg(e) {
  return (N.lFrame.bindingIndex = e);
}
function Rl() {
  return N.lFrame.bindingIndex++;
}
function Ol(e) {
  let t = N.lFrame,
    n = t.bindingIndex;
  return (t.bindingIndex = t.bindingIndex + e), n;
}
function pg() {
  return N.lFrame.inI18n;
}
function gg(e, t) {
  let n = N.lFrame;
  (n.bindingIndex = n.bindingRootIndex = e), ps(t);
}
function mg() {
  return N.lFrame.currentDirectiveIndex;
}
function ps(e) {
  N.lFrame.currentDirectiveIndex = e;
}
function vg(e) {
  let t = N.lFrame.currentDirectiveIndex;
  return t === -1 ? null : e[t];
}
function kl(e) {
  N.lFrame.currentQueryIndex = e;
}
function yg(e) {
  let t = e[O];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[Ae] : null;
}
function Pl(e, t, n) {
  if (n & T.SkipSelf) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & T.Host); )
      if (((o = yg(i)), o === null || ((i = i[Wn]), o.type & 10))) break;
    if (o === null) return !1;
    (t = o), (e = i);
  }
  let r = (N.lFrame = Fl());
  return (r.currentTNode = t), (r.lView = e), !0;
}
function Xs(e) {
  let t = Fl(),
    n = e[O];
  (N.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1);
}
function Fl() {
  let e = N.lFrame,
    t = e === null ? null : e.child;
  return t === null ? Ll(e) : t;
}
function Ll(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return e !== null && (e.child = t), t;
}
function jl() {
  let e = N.lFrame;
  return (N.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var Vl = jl;
function ea() {
  let e = jl();
  (e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0);
}
function At() {
  return N.lFrame.selectedIndex;
}
function Mt(e) {
  N.lFrame.selectedIndex = e;
}
function Dg() {
  let e = N.lFrame;
  return El(e.tView, e.selectedIndex);
}
function Yn() {
  N.lFrame.currentNamespace = wl;
}
function $l() {
  wg();
}
function wg() {
  N.lFrame.currentNamespace = null;
}
function Cg() {
  return N.lFrame.currentNamespace;
}
var Bl = !0;
function ta() {
  return Bl;
}
function na(e) {
  Bl = e;
}
function Eg(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = vl(t);
    (n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s);
  }
  o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i));
}
function ra(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let i = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: u,
        ngOnDestroy: l,
      } = i;
    s && (e.contentHooks ??= []).push(-n, s),
      a &&
        ((e.contentHooks ??= []).push(n, a),
        (e.contentCheckHooks ??= []).push(n, a)),
      c && (e.viewHooks ??= []).push(-n, c),
      u &&
        ((e.viewHooks ??= []).push(n, u), (e.viewCheckHooks ??= []).push(n, u)),
      l != null && (e.destroyHooks ??= []).push(n, l);
  }
}
function Qr(e, t, n) {
  Ul(e, t, 3, n);
}
function Yr(e, t, n, r) {
  (e[C] & 3) === n && Ul(e, t, n, r);
}
function Zi(e, t) {
  let n = e[C];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[C] = n));
}
function Ul(e, t, n, r) {
  let o = r !== void 0 ? e[Xt] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let c = o; c < s; c++)
    if (typeof t[c + 1] == "number") {
      if (((a = t[c]), r != null && a >= r)) break;
    } else
      t[c] < 0 && (e[Xt] += 65536),
        (a < i || i == -1) &&
          (Ig(e, n, t, c), (e[Xt] = (e[Xt] & 4294901760) + c + 2)),
        c++;
}
function vu(e, t) {
  Fe(4, e, t);
  let n = F(null);
  try {
    t.call(e);
  } finally {
    F(n), Fe(5, e, t);
  }
}
function Ig(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s];
  o
    ? e[C] >> 14 < e[Xt] >> 16 &&
      (e[C] & 3) === t &&
      ((e[C] += 16384), vu(a, i))
    : vu(a, i);
}
var nn = -1,
  $n = class {
    constructor(t, n, r) {
      (this.factory = t),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function bg(e) {
  return e instanceof $n;
}
function Sg(e) {
  return (e.flags & 8) !== 0;
}
function Mg(e) {
  return (e.flags & 16) !== 0;
}
var Qi = {},
  gs = class {
    constructor(t, n) {
      (this.injector = t), (this.parentInjector = n);
    }
    get(t, n, r) {
      r = So(r);
      let o = this.injector.get(t, Qi, r);
      return o !== Qi || n === Qi ? o : this.parentInjector.get(t, n, r);
    }
  };
function Hl(e) {
  return e !== nn;
}
function uo(e) {
  return e & 32767;
}
function xg(e) {
  return e >> 16;
}
function lo(e, t) {
  let n = xg(e),
    r = t;
  for (; n > 0; ) (r = r[Wn]), n--;
  return r;
}
var ms = !0;
function yu(e) {
  let t = ms;
  return (ms = e), t;
}
var Tg = 256,
  zl = Tg - 1,
  Gl = 5,
  _g = 0,
  Le = {};
function Ng(e, t, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(On) && (r = n[On]),
    r == null && (r = n[On] = _g++);
  let o = r & zl,
    i = 1 << o;
  t.data[e + (o >> Gl)] |= i;
}
function ql(e, t) {
  let n = Wl(e, t);
  if (n !== -1) return n;
  let r = t[O];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    Yi(r.data, e),
    Yi(t, null),
    Yi(r.blueprint, null));
  let o = oa(e, t),
    i = e.injectorIndex;
  if (Hl(o)) {
    let s = uo(o),
      a = lo(o, t),
      c = a[O].data;
    for (let u = 0; u < 8; u++) t[i + u] = a[s + u] | c[s + u];
  }
  return (t[i + 8] = o), i;
}
function Yi(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function Wl(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function oa(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = Jl(o)), r === null)) return nn;
    if ((n++, (o = o[Wn]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return nn;
}
function Ag(e, t, n) {
  Ng(e, t, n);
}
function Zl(e, t, n) {
  if (n & T.Optional || e !== void 0) return e;
  Hs(t, "NodeInjector");
}
function Ql(e, t, n, r) {
  if (
    (n & T.Optional && r === void 0 && (r = null), !(n & (T.Self | T.Host)))
  ) {
    let o = e[sn],
      i = ge(void 0);
    try {
      return o ? o.get(t, r, n & T.Optional) : Yu(t, r, n & T.Optional);
    } finally {
      ge(i);
    }
  }
  return Zl(r, t, n);
}
function Yl(e, t, n, r = T.Default, o) {
  if (e !== null) {
    if (t[C] & 2048 && !(r & T.Self)) {
      let s = Fg(e, t, n, r, Le);
      if (s !== Le) return s;
    }
    let i = Kl(e, t, n, r, Le);
    if (i !== Le) return i;
  }
  return Ql(t, n, r, o);
}
function Kl(e, t, n, r, o) {
  let i = kg(n);
  if (typeof i == "function") {
    if (!Pl(t, e, r)) return r & T.Host ? Zl(o, n, r) : Ql(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & T.Optional))) Hs(n);
      else return s;
    } finally {
      Vl();
    }
  } else if (typeof i == "number") {
    let s = null,
      a = Wl(e, t),
      c = nn,
      u = r & T.Host ? t[$e][Ae] : null;
    for (
      (a === -1 || r & T.SkipSelf) &&
      ((c = a === -1 ? oa(e, t) : t[a + 8]),
      c === nn || !wu(r, !1)
        ? (a = -1)
        : ((s = t[O]), (a = uo(c)), (t = lo(c, t))));
      a !== -1;

    ) {
      let l = t[O];
      if (Du(i, a, l.data)) {
        let d = Rg(a, t, n, s, r, u);
        if (d !== Le) return d;
      }
      (c = t[a + 8]),
        c !== nn && wu(r, t[O].data[a + 8] === u) && Du(i, a, t)
          ? ((s = l), (a = uo(c)), (t = lo(c, t)))
          : (a = -1);
    }
  }
  return o;
}
function Rg(e, t, n, r, o, i) {
  let s = t[O],
    a = s.data[e + 8],
    c = r == null ? _o(a) && ms : r != s && (a.type & 3) !== 0,
    u = o & T.Host && i === a,
    l = Og(a, s, n, c, u);
  return l !== null ? Bn(t, s, l, a) : Le;
}
function Og(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    a = i & 1048575,
    c = e.directiveStart,
    u = e.directiveEnd,
    l = i >> 20,
    d = r ? a : a + l,
    h = o ? a + l : u;
  for (let f = d; f < h; f++) {
    let g = s[f];
    if ((f < c && n === g) || (f >= c && g.type === n)) return f;
  }
  if (o) {
    let f = s[c];
    if (f && Zn(f) && f.type === n) return c;
  }
  return null;
}
function Bn(e, t, n, r) {
  let o = e[n],
    i = t.data;
  if (bg(o)) {
    let s = o;
    s.resolving && dp(lp(i[n]));
    let a = yu(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      u = s.injectImpl ? ge(s.injectImpl) : null,
      l = Pl(e, r, T.Default);
    try {
      (o = e[n] = s.factory(void 0, i, e, r)),
        t.firstCreatePass && n >= r.directiveStart && Eg(n, i[n], t);
    } finally {
      u !== null && ge(u), yu(a), (s.resolving = !1), Vl();
    }
  }
  return o;
}
function kg(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(On) ? e[On] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & zl : Pg) : t;
}
function Du(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> Gl)] & r);
}
function wu(e, t) {
  return !(e & T.Self) && !(e & T.Host && t);
}
var Et = class {
  constructor(t, n) {
    (this._tNode = t), (this._lView = n);
  }
  get(t, n, r) {
    return Yl(this._tNode, this._lView, t, So(r), n);
  }
};
function Pg() {
  return new Et(we(), H());
}
function ia(e) {
  return Io(() => {
    let t = e.prototype.constructor,
      n = t[Xr] || vs(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[Xr] || vs(o);
      if (i && i !== n) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function vs(e) {
  return zu(e)
    ? () => {
        let t = vs(me(e));
        return t && t();
      }
    : rn(e);
}
function Fg(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[C] & 2048 && !(s[C] & 512); ) {
    let a = Kl(i, s, n, r | T.Self, Le);
    if (a !== Le) return a;
    let c = i.parent;
    if (!c) {
      let u = s[hl];
      if (u) {
        let l = u.get(n, Le, r);
        if (l !== Le) return l;
      }
      (c = Jl(s)), (s = s[Wn]);
    }
    i = c;
  }
  return o;
}
function Jl(e) {
  let t = e[O],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[Ae] : null;
}
function Cu(e, t = null, n = null, r) {
  let o = Xl(e, t, n, r);
  return o.resolveInjectorInitializers(), o;
}
function Xl(e, t = null, n = null, r, o = new Set()) {
  let i = [n || Qe, Vp(e)];
  return (
    (r = r || (typeof e == "object" ? void 0 : ce(e))),
    new Ln(i, t || Ys(), r || null, o)
  );
}
var Ct = class Ct {
  static create(t, n) {
    if (Array.isArray(t)) return Cu({ name: "" }, n, t, "");
    {
      let r = t.name ?? "";
      return Cu({ name: r }, t.parent, t.providers, r);
    }
  }
};
(Ct.THROW_IF_NOT_FOUND = Pn),
  (Ct.NULL = new no()),
  (Ct.ɵprov = w({ token: Ct, providedIn: "any", factory: () => _(el) })),
  (Ct.__NG_ELEMENT_ID__ = -1);
var xt = Ct;
var Lg = new M("");
Lg.__NG_ELEMENT_ID__ = (e) => {
  let t = we();
  if (t === null) throw new D(204, !1);
  if (t.type & 2) return t.value;
  if (e & T.Optional) return null;
  throw new D(204, !1);
};
var jg = "ngOriginalError";
function Ki(e) {
  return e[jg];
}
var ed = !0,
  td = (() => {
    let t = class t {};
    (t.__NG_ELEMENT_ID__ = Vg), (t.__NG_ENV_ID__ = (r) => r);
    let e = t;
    return e;
  })(),
  ys = class extends td {
    constructor(t) {
      super(), (this._lView = t);
    }
    onDestroy(t) {
      return Sl(this._lView, t), () => rg(this._lView, t);
    }
  };
function Vg() {
  return new ys(H());
}
var pn = (() => {
  let t = class t {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new W(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let r = this.taskId++;
      return this.pendingTasks.add(r), r;
    }
    remove(r) {
      this.pendingTasks.delete(r),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  t.ɵprov = w({ token: t, providedIn: "root", factory: () => new t() });
  let e = t;
  return e;
})();
var Ds = class extends oe {
    constructor(t = !1) {
      super(),
        (this.destroyRef = void 0),
        (this.pendingTasks = void 0),
        (this.__isAsync = t),
        Yp() &&
          ((this.destroyRef = p(td, { optional: !0 }) ?? void 0),
          (this.pendingTasks = p(pn, { optional: !0 }) ?? void 0));
    }
    emit(t) {
      let n = F(null);
      try {
        super.next(t);
      } finally {
        F(n);
      }
    }
    subscribe(t, n, r) {
      let o = t,
        i = n || (() => null),
        s = r;
      if (t && typeof t == "object") {
        let c = t;
        (o = c.next?.bind(c)),
          (i = c.error?.bind(c)),
          (s = c.complete?.bind(c));
      }
      this.__isAsync &&
        ((i = this.wrapInTimeout(i)),
        o && (o = this.wrapInTimeout(o)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: o, error: i, complete: s });
      return t instanceof G && t.add(a), a;
    }
    wrapInTimeout(t) {
      return (n) => {
        let r = this.pendingTasks?.add();
        setTimeout(() => {
          t(n), r !== void 0 && this.pendingTasks?.remove(r);
        });
      };
    }
  },
  ie = Ds;
function fo(...e) {}
function nd(e) {
  let t, n;
  function r() {
    e = fo;
    try {
      n !== void 0 &&
        typeof cancelAnimationFrame == "function" &&
        cancelAnimationFrame(n),
        t !== void 0 && clearTimeout(t);
    } catch {}
  }
  return (
    (t = setTimeout(() => {
      e(), r();
    })),
    typeof requestAnimationFrame == "function" &&
      (n = requestAnimationFrame(() => {
        e(), r();
      })),
    () => r()
  );
}
function Eu(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = fo;
    }
  );
}
var sa = "isAngularZone",
  ho = sa + "_ID",
  $g = 0,
  Y = class e {
    constructor(t) {
      (this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new ie(!1)),
        (this.onMicrotaskEmpty = new ie(!1)),
        (this.onStable = new ie(!1)),
        (this.onError = new ie(!1));
      let {
        enableLongStackTrace: n = !1,
        shouldCoalesceEventChangeDetection: r = !1,
        shouldCoalesceRunChangeDetection: o = !1,
        scheduleInRootZone: i = ed,
      } = t;
      if (typeof Zone > "u") throw new D(908, !1);
      Zone.assertZonePatched();
      let s = this;
      (s._nesting = 0),
        (s._outer = s._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
        n &&
          Zone.longStackTraceZoneSpec &&
          (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        (s.shouldCoalesceEventChangeDetection = !o && r),
        (s.shouldCoalesceRunChangeDetection = o),
        (s.callbackScheduled = !1),
        (s.scheduleInRootZone = i),
        Hg(s);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get(sa) === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new D(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new D(909, !1);
    }
    run(t, n, r) {
      return this._inner.run(t, n, r);
    }
    runTask(t, n, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask("NgZoneEvent: " + o, t, Bg, fo, fo);
      try {
        return i.runTask(s, n, r);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  Bg = {};
function aa(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      e._nesting++, e.onMicrotaskEmpty.emit(null);
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function Ug(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    nd(() => {
      (e.callbackScheduled = !1),
        ws(e),
        (e.isCheckStableRunning = !0),
        aa(e),
        (e.isCheckStableRunning = !1);
    });
  }
  e.scheduleInRootZone
    ? Zone.root.run(() => {
        t();
      })
    : e._outer.run(() => {
        t();
      }),
    ws(e);
}
function Hg(e) {
  let t = () => {
      Ug(e);
    },
    n = $g++;
  e._inner = e._inner.fork({
    name: "angular",
    properties: { [sa]: !0, [ho]: n, [ho + n]: !0 },
    onInvokeTask: (r, o, i, s, a, c) => {
      if (zg(c)) return r.invokeTask(i, s, a, c);
      try {
        return Iu(e), r.invokeTask(i, s, a, c);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          bu(e);
      }
    },
    onInvoke: (r, o, i, s, a, c, u) => {
      try {
        return Iu(e), r.invoke(i, s, a, c, u);
      } finally {
        e.shouldCoalesceRunChangeDetection &&
          !e.callbackScheduled &&
          !Gg(c) &&
          t(),
          bu(e);
      }
    },
    onHasTask: (r, o, i, s) => {
      r.hasTask(i, s),
        o === i &&
          (s.change == "microTask"
            ? ((e._hasPendingMicrotasks = s.microTask), ws(e), aa(e))
            : s.change == "macroTask" &&
              (e.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1
    ),
  });
}
function ws(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function Iu(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function bu(e) {
  e._nesting--, aa(e);
}
var Cs = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new ie()),
      (this.onMicrotaskEmpty = new ie()),
      (this.onStable = new ie()),
      (this.onError = new ie());
  }
  run(t, n, r) {
    return t.apply(n, r);
  }
  runGuarded(t, n, r) {
    return t.apply(n, r);
  }
  runOutsideAngular(t) {
    return t();
  }
  runTask(t, n, r, o) {
    return t.apply(n, r);
  }
};
function zg(e) {
  return rd(e, "__ignore_ng_zone__");
}
function Gg(e) {
  return rd(e, "__scheduler_tick__");
}
function rd(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
var dt = class {
    constructor() {
      this._console = console;
    }
    handleError(t) {
      let n = this._findOriginalError(t);
      this._console.error("ERROR", t),
        n && this._console.error("ORIGINAL ERROR", n);
    }
    _findOriginalError(t) {
      let n = t && Ki(t);
      for (; n && Ki(n); ) n = Ki(n);
      return n || null;
    }
  },
  qg = new M("", {
    providedIn: "root",
    factory: () => {
      let e = p(Y),
        t = p(dt);
      return (n) => e.runOutsideAngular(() => t.handleError(n));
    },
  });
function Wg() {
  return Ro(we(), H());
}
function Ro(e, t) {
  return new Kn(Re(e, t));
}
var Kn = (() => {
  let t = class t {
    constructor(r) {
      this.nativeElement = r;
    }
  };
  t.__NG_ELEMENT_ID__ = Wg;
  let e = t;
  return e;
})();
function od(e) {
  return (e.flags & 128) === 128;
}
var id = new Map(),
  Zg = 0;
function Qg() {
  return Zg++;
}
function Yg(e) {
  id.set(e[To], e);
}
function Kg(e) {
  id.delete(e[To]);
}
var Su = "__ngContext__";
function Tt(e, t) {
  ct(t) ? ((e[Su] = t[To]), Yg(t)) : (e[Su] = t);
}
function sd(e) {
  return cd(e[jn]);
}
function ad(e) {
  return cd(e[Ne]);
}
function cd(e) {
  for (; e !== null && !et(e); ) e = e[Ne];
  return e;
}
var Es;
function ud(e) {
  Es = e;
}
function Jg() {
  if (Es !== void 0) return Es;
  if (typeof document < "u") return document;
  throw new D(210, !1);
}
var ca = new M("", { providedIn: "root", factory: () => Xg }),
  Xg = "ng",
  ua = new M(""),
  gn = new M("", { providedIn: "platform", factory: () => "unknown" });
var la = new M("", {
  providedIn: "root",
  factory: () =>
    Jg().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
var em = "h",
  tm = "b";
var nm = () => null;
function da(e, t, n = !1) {
  return nm(e, t, n);
}
var ld = !1,
  rm = new M("", { providedIn: "root", factory: () => ld });
var po = class {
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${
      this.changingThisBreaksApplicationSecurity
    } (see ${Bu})`;
  }
};
function Oo(e) {
  return e instanceof po ? e.changingThisBreaksApplicationSecurity : e;
}
function dd(e, t) {
  let n = om(e);
  if (n != null && n !== t) {
    if (n === "ResourceURL" && t === "URL") return !0;
    throw new Error(`Required a safe ${t}, got a ${n} (see ${Bu})`);
  }
  return n === t;
}
function om(e) {
  return (e instanceof po && e.getTypeName()) || null;
}
var im = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function fd(e) {
  return (e = String(e)), e.match(im) ? e : "unsafe:" + e;
}
var fa = (function (e) {
  return (
    (e[(e.NONE = 0)] = "NONE"),
    (e[(e.HTML = 1)] = "HTML"),
    (e[(e.STYLE = 2)] = "STYLE"),
    (e[(e.SCRIPT = 3)] = "SCRIPT"),
    (e[(e.URL = 4)] = "URL"),
    (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    e
  );
})(fa || {});
function Jn(e) {
  let t = sm();
  return t ? t.sanitize(fa.URL, e) || "" : dd(e, "URL") ? Oo(e) : fd(kn(e));
}
function sm() {
  let e = H();
  return e && e[Ve].sanitizer;
}
function hd(e) {
  return e instanceof Function ? e() : e;
}
var Ke = (function (e) {
    return (
      (e[(e.Important = 1)] = "Important"),
      (e[(e.DashCase = 2)] = "DashCase"),
      e
    );
  })(Ke || {}),
  am;
function ha(e, t) {
  return am(e, t);
}
function en(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1;
    et(r) ? (i = r) : ct(r) && ((s = !0), (r = r[Xe]));
    let a = Be(r);
    e === 0 && n !== null
      ? o == null
        ? yd(t, n, a)
        : go(t, n, a, o || null, !0)
      : e === 1 && n !== null
        ? go(t, n, a, o || null, !0)
        : e === 2
          ? Em(t, a, s)
          : e === 3 && t.destroyNode(a),
      i != null && bm(t, e, i, n, o);
  }
}
function cm(e, t) {
  return e.createText(t);
}
function um(e, t, n) {
  e.setValue(t, n);
}
function pd(e, t, n) {
  return e.createElement(t, n);
}
function lm(e, t) {
  gd(e, t), (t[Xe] = null), (t[Ae] = null);
}
function dm(e, t, n, r, o, i) {
  (r[Xe] = o), (r[Ae] = t), ko(e, r, n, 1, o, i);
}
function gd(e, t) {
  t[Ve].changeDetectionScheduler?.notify(8), ko(e, t, t[re], 2, null, null);
}
function fm(e) {
  let t = e[jn];
  if (!t) return Ji(e[O], e);
  for (; t; ) {
    let n = null;
    if (ct(t)) n = t[jn];
    else {
      let r = t[ye];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[Ne] && t !== e; ) ct(t) && Ji(t[O], t), (t = t[se]);
      t === null && (t = e), ct(t) && Ji(t[O], t), (n = t && t[Ne]);
    }
    t = n;
  }
}
function hm(e, t, n, r) {
  let o = ye + r,
    i = n.length;
  r > 0 && (n[o - 1][Ne] = t),
    r < i - ye
      ? ((t[Ne] = n[o]), Xu(n, ye + r, t))
      : (n.push(t), (t[Ne] = null)),
    (t[se] = n);
  let s = t[an];
  s !== null && n !== s && md(s, t);
  let a = t[cn];
  a !== null && a.insertView(e), hs(t), (t[C] |= 128);
}
function md(e, t) {
  let n = e[so],
    r = t[se];
  if (ct(r)) e[C] |= ao.HasTransplantedViews;
  else {
    let o = r[se][$e];
    t[$e] !== o && (e[C] |= ao.HasTransplantedViews);
  }
  n === null ? (e[so] = [t]) : n.push(t);
}
function pa(e, t) {
  let n = e[so],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function Is(e, t) {
  if (e.length <= ye) return;
  let n = ye + t,
    r = e[n];
  if (r) {
    let o = r[an];
    o !== null && o !== e && pa(o, r), t > 0 && (e[n - 1][Ne] = r[Ne]);
    let i = to(e, ye + t);
    lm(r[O], r);
    let s = i[cn];
    s !== null && s.detachView(i[O]),
      (r[se] = null),
      (r[Ne] = null),
      (r[C] &= -129);
  }
  return r;
}
function vd(e, t) {
  if (!(t[C] & 256)) {
    let n = t[re];
    n.destroyNode && ko(e, t, n, 3, null, null), fm(t);
  }
}
function Ji(e, t) {
  if (t[C] & 256) return;
  let n = F(null);
  try {
    (t[C] &= -129),
      (t[C] |= 256),
      t[ve] && Si(t[ve]),
      gm(e, t),
      pm(e, t),
      t[O].type === 1 && t[re].destroy();
    let r = t[an];
    if (r !== null && et(t[se])) {
      r !== t[se] && pa(r, t);
      let o = t[cn];
      o !== null && o.detachView(e);
    }
    Kg(t);
  } finally {
    F(n);
  }
}
function pm(e, t) {
  let n = e.cleanup,
    r = t[oo];
  if (n !== null)
    for (let i = 0; i < n.length - 1; i += 2)
      if (typeof n[i] == "string") {
        let s = n[i + 3];
        s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
      } else {
        let s = r[n[i + 1]];
        n[i].call(s);
      }
  r !== null && (t[oo] = null);
  let o = t[at];
  if (o !== null) {
    t[at] = null;
    for (let i = 0; i < o.length; i++) {
      let s = o[i];
      s();
    }
  }
}
function gm(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof $n)) {
        let i = n[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              c = i[s + 1];
            Fe(4, a, c);
            try {
              c.call(a);
            } finally {
              Fe(5, a, c);
            }
          }
        else {
          Fe(4, o, i);
          try {
            i.call(o);
          } finally {
            Fe(5, o, i);
          }
        }
      }
    }
}
function mm(e, t, n) {
  return vm(e, t.parent, n);
}
function vm(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) (t = r), (r = t.parent);
  if (r === null) return n[Xe];
  {
    let { componentOffset: o } = r;
    if (o > -1) {
      let { encapsulation: i } = e.data[r.directiveStart + o];
      if (i === je.None || i === je.Emulated) return null;
    }
    return Re(r, n);
  }
}
function go(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function yd(e, t, n) {
  e.appendChild(t, n);
}
function Mu(e, t, n, r, o) {
  r !== null ? go(e, t, n, r, o) : yd(e, t, n);
}
function Dd(e, t) {
  return e.parentNode(t);
}
function ym(e, t) {
  return e.nextSibling(t);
}
function Dm(e, t, n) {
  return Cm(e, t, n);
}
function wm(e, t, n) {
  return e.type & 40 ? Re(e, n) : null;
}
var Cm = wm,
  xu;
function ga(e, t, n, r) {
  let o = mm(e, r, t),
    i = t[re],
    s = r.parent || t[Ae],
    a = Dm(s, r, t);
  if (o != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) Mu(i, o, n[c], a, !1);
    else Mu(i, o, n, a, !1);
  xu !== void 0 && xu(i, r, t, n, o);
}
function Rn(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return Re(t, e);
    if (n & 4) return bs(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return Rn(e, r);
      {
        let o = e[t.index];
        return et(o) ? bs(-1, o) : Be(o);
      }
    } else {
      if (n & 128) return Rn(e, t.next);
      if (n & 32) return ha(t, e)() || Be(e[t.index]);
      {
        let r = wd(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = St(e[$e]);
          return Rn(o, r);
        } else return Rn(e, t.next);
      }
    }
  }
  return null;
}
function wd(e, t) {
  if (t !== null) {
    let r = e[$e][Ae],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function bs(e, t) {
  let n = ye + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[O].firstChild;
    if (o !== null) return Rn(r, o);
  }
  return t[bt];
}
function Em(e, t, n) {
  e.removeChild(null, t, n);
}
function ma(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let a = r[n.index],
      c = n.type;
    if (
      (s && t === 0 && (a && Tt(Be(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (c & 8) ma(e, t, n.child, r, o, i, !1), en(t, e, o, a, i);
      else if (c & 32) {
        let u = ha(n, r),
          l;
        for (; (l = u()); ) en(t, e, o, l, i);
        en(t, e, o, a, i);
      } else c & 16 ? Im(e, t, r, n, o, i) : en(t, e, o, a, i);
    n = s ? n.projectionNext : n.next;
  }
}
function ko(e, t, n, r, o, i) {
  ma(n, r, e.firstChild, t, o, i, !1);
}
function Im(e, t, n, r, o, i) {
  let s = n[$e],
    c = s[Ae].projection[r.projection];
  if (Array.isArray(c))
    for (let u = 0; u < c.length; u++) {
      let l = c[u];
      en(t, e, o, l, i);
    }
  else {
    let u = c,
      l = s[se];
    od(r) && (u.flags |= 128), ma(e, t, u, l, o, i, !0);
  }
}
function bm(e, t, n, r, o) {
  let i = n[bt],
    s = Be(n);
  i !== s && en(t, e, r, i, o);
  for (let a = ye; a < n.length; a++) {
    let c = n[a];
    ko(c[O], c, e, t, r, i);
  }
}
function Sm(e, t, n, r, o) {
  if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
  else {
    let i = r.indexOf("-") === -1 ? void 0 : Ke.DashCase;
    o == null
      ? e.removeStyle(n, r, i)
      : (typeof o == "string" &&
          o.endsWith("!important") &&
          ((o = o.slice(0, -10)), (i |= Ke.Important)),
        e.setStyle(n, r, o, i));
  }
}
function Mm(e, t, n) {
  e.setAttribute(t, "style", n);
}
function Cd(e, t, n) {
  n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
}
function Ed(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  r !== null && ss(e, t, r),
    o !== null && Cd(e, t, o),
    i !== null && Mm(e, t, i);
}
var Ue = {};
function A(e = 1) {
  Id(pt(), H(), At() + e, !1);
}
function Id(e, t, n, r) {
  if (!r)
    if ((t[C] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && Qr(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && Yr(t, i, 0, n);
    }
  Mt(n);
}
function He(e, t = T.Default) {
  let n = H();
  if (n === null) return _(e, t);
  let r = we();
  return Yl(r, n, me(e), t);
}
function bd(e, t, n, r, o, i) {
  let s = F(null);
  try {
    let a = null;
    o & ut.SignalBased && (a = t[r][xc]),
      a !== null && a.transformFn !== void 0 && (i = a.transformFn(i)),
      o & ut.HasDecoratorInputTransform &&
        (i = e.inputTransforms[r].call(t, i)),
      e.setInput !== null ? e.setInput(t, a, i, n, r) : ml(t, a, r, i);
  } finally {
    F(s);
  }
}
function xm(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) Mt(~o);
        else {
          let i = o,
            s = n[++r],
            a = n[++r];
          gg(s, i);
          let c = t[i];
          a(2, c);
        }
      }
    } finally {
      Mt(-1);
    }
}
function Po(e, t, n, r, o, i, s, a, c, u, l) {
  let d = t.blueprint.slice();
  return (
    (d[Xe] = o),
    (d[C] = r | 4 | 128 | 8 | 64),
    (u !== null || (e && e[C] & 2048)) && (d[C] |= 2048),
    Il(d),
    (d[se] = d[Wn] = e),
    (d[Ye] = n),
    (d[Ve] = s || (e && e[Ve])),
    (d[re] = a || (e && e[re])),
    (d[sn] = c || (e && e[sn]) || null),
    (d[Ae] = i),
    (d[To] = Qg()),
    (d[ro] = l),
    (d[hl] = u),
    (d[$e] = t.type == 2 ? e[$e] : d),
    d
  );
}
function Fo(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) (i = Tm(e, t, n, r, o)), pg() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = n), (i.value = r), (i.attrs = o);
    let s = lg();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return Qn(i, !0), i;
}
function Tm(e, t, n, r, o) {
  let i = Tl(),
    s = _l(),
    a = s ? i : i && i.parent,
    c = (e.data[t] = Om(e, a, n, t, r, o));
  return (
    e.firstChild === null && (e.firstChild = c),
    i !== null &&
      (s
        ? i.child == null && c.parent !== null && (i.child = c)
        : i.next === null && ((i.next = c), (c.prev = i))),
    c
  );
}
function Sd(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
  return o;
}
function Md(e, t, n, r, o) {
  let i = At(),
    s = r & 2;
  try {
    Mt(-1), s && t.length > lt && Id(e, t, lt, !1), Fe(s ? 2 : 0, o), n(r, o);
  } finally {
    Mt(i), Fe(s ? 3 : 1, o);
  }
}
function xd(e, t, n) {
  if (gl(t)) {
    let r = F(null);
    try {
      let o = t.directiveStart,
        i = t.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let c = n[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      F(r);
    }
  }
}
function Td(e, t, n) {
  xl() && ($m(e, t, n, Re(n, t)), (n.flags & 64) === 64 && Od(e, t, n));
}
function _d(e, t, n = Re) {
  let r = t.localNames;
  if (r !== null) {
    let o = t.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? n(t, e) : e[s];
      e[o++] = a;
    }
  }
}
function Nd(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = va(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id,
      ))
    : t;
}
function va(e, t, n, r, o, i, s, a, c, u, l) {
  let d = lt + r,
    h = d + o,
    f = _m(d, h),
    g = typeof u == "function" ? u() : u;
  return (f[O] = {
    type: e,
    blueprint: f,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: f.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: h,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == "function" ? i() : i,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: c,
    consts: g,
    incompleteFirstPass: !1,
    ssrId: l,
  });
}
function _m(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : Ue);
  return n;
}
function Nm(e, t, n, r) {
  let i = r.get(rm, ld) || n === je.ShadowDom,
    s = e.selectRootElement(t, i);
  return Am(s), s;
}
function Am(e) {
  Rm(e);
}
var Rm = () => null;
function Om(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    ag() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function Tu(e, t, n, r, o) {
  for (let i in t) {
    if (!t.hasOwnProperty(i)) continue;
    let s = t[i];
    if (s === void 0) continue;
    r ??= {};
    let a,
      c = ut.None;
    Array.isArray(s) ? ((a = s[0]), (c = s[1])) : (a = s);
    let u = i;
    if (o !== null) {
      if (!o.hasOwnProperty(i)) continue;
      u = o[i];
    }
    e === 0 ? _u(r, n, u, a, c) : _u(r, n, u, a);
  }
  return r;
}
function _u(e, t, n, r, o) {
  let i;
  e.hasOwnProperty(n) ? (i = e[n]).push(t, r) : (i = e[n] = [t, r]),
    o !== void 0 && i.push(o);
}
function km(e, t, n) {
  let r = t.directiveStart,
    o = t.directiveEnd,
    i = e.data,
    s = t.attrs,
    a = [],
    c = null,
    u = null;
  for (let l = r; l < o; l++) {
    let d = i[l],
      h = n ? n.get(d) : null,
      f = h ? h.inputs : null,
      g = h ? h.outputs : null;
    (c = Tu(0, d.inputs, l, c, f)), (u = Tu(1, d.outputs, l, u, g));
    let E = c !== null && s !== null && !Zs(t) ? Qm(c, l, s) : null;
    a.push(E);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (t.flags |= 8),
    c.hasOwnProperty("style") && (t.flags |= 16)),
    (t.initialInputs = a),
    (t.inputs = c),
    (t.outputs = u);
}
function Pm(e) {
  return e === "class"
    ? "className"
    : e === "for"
      ? "htmlFor"
      : e === "formaction"
        ? "formAction"
        : e === "innerHtml"
          ? "innerHTML"
          : e === "readonly"
            ? "readOnly"
            : e === "tabindex"
              ? "tabIndex"
              : e;
}
function Fm(e, t, n, r, o, i, s, a) {
  let c = Re(t, n),
    u = t.inputs,
    l;
  !a && u != null && (l = u[r])
    ? (ya(e, n, l, r, o), _o(t) && Lm(n, t.index))
    : t.type & 3
      ? ((r = Pm(r)),
        (o = s != null ? s(o, t.value || "", r) : o),
        i.setProperty(c, r, o))
      : t.type & 12;
}
function Lm(e, t) {
  let n = ht(t, e);
  n[C] & 16 || (n[C] |= 64);
}
function Ad(e, t, n, r) {
  if (xl()) {
    let o = r === null ? null : { "": -1 },
      i = Um(e, n),
      s,
      a;
    i === null ? (s = a = null) : ([s, a] = i),
      s !== null && Rd(e, t, n, s, o, a),
      o && Hm(n, r, o);
  }
  n.mergedAttrs = Ws(n.mergedAttrs, n.attrs);
}
function Rd(e, t, n, r, o, i) {
  for (let u = 0; u < r.length; u++) Ag(ql(n, t), e, r[u].type);
  Gm(n, e.data.length, r.length);
  for (let u = 0; u < r.length; u++) {
    let l = r[u];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    c = Sd(e, t, r.length, null);
  for (let u = 0; u < r.length; u++) {
    let l = r[u];
    (n.mergedAttrs = Ws(n.mergedAttrs, l.hostAttrs)),
      qm(e, n, t, c, l),
      zm(c, l, o),
      l.contentQueries !== null && (n.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (n.flags |= 64);
    let d = l.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      c++;
  }
  km(e, n, i);
}
function jm(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    Vm(s) != a && s.push(a), s.push(n, r, i);
  }
}
function Vm(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function $m(e, t, n, r) {
  let o = n.directiveStart,
    i = n.directiveEnd;
  _o(n) && Wm(t, n, e.data[o + n.componentOffset]),
    e.firstCreatePass || ql(n, t),
    Tt(r, t);
  let s = n.initialInputs;
  for (let a = o; a < i; a++) {
    let c = e.data[a],
      u = Bn(t, e, a, n);
    if ((Tt(u, t), s !== null && Zm(t, a - o, u, c, n, s), Zn(c))) {
      let l = ht(n.index, t);
      l[Ye] = Bn(t, e, a, n);
    }
  }
}
function Od(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = mg();
  try {
    Mt(i);
    for (let a = r; a < o; a++) {
      let c = e.data[a],
        u = t[a];
      ps(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          Bm(c, u);
    }
  } finally {
    Mt(-1), ps(s);
  }
}
function Bm(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function Um(e, t) {
  let n = e.directiveRegistry,
    r = null,
    o = null;
  if (n)
    for (let i = 0; i < n.length; i++) {
      let s = n[i];
      if (Np(t, s.selectors, !1))
        if ((r || (r = []), Zn(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (o = o || new Map()),
              s.findHostDirectiveDefs(s, a, o),
              r.unshift(...a, s);
            let c = a.length;
            Ss(e, t, c);
          } else r.unshift(s), Ss(e, t, 0);
        else
          (o = o || new Map()), s.findHostDirectiveDefs?.(s, r, o), r.push(s);
    }
  return r === null ? null : [r, o];
}
function Ss(e, t, n) {
  (t.componentOffset = n), (e.components ??= []).push(t.index);
}
function Hm(e, t, n) {
  if (t) {
    let r = (e.localNames = []);
    for (let o = 0; o < t.length; o += 2) {
      let i = n[t[o + 1]];
      if (i == null) throw new D(-301, !1);
      r.push(t[o], i);
    }
  }
}
function zm(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    Zn(t) && (n[""] = e);
  }
}
function Gm(e, t, n) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t);
}
function qm(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = rn(o.type, !0)),
    s = new $n(i, Zn(o), He);
  (e.blueprint[r] = s), (n[r] = s), jm(e, t, r, Sd(e, n, o.hostVars, Ue), o);
}
function Wm(e, t, n) {
  let r = Re(t, e),
    o = Nd(n),
    i = e[Ve].rendererFactory,
    s = 16;
  n.signals ? (s = 4096) : n.onPush && (s = 64);
  let a = Lo(
    e,
    Po(e, o, null, s, r, t, null, i.createRenderer(r, n), null, null, null),
  );
  e[t.index] = a;
}
function Zm(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let c = s[a++],
        u = s[a++],
        l = s[a++],
        d = s[a++];
      bd(r, n, c, u, l, d);
    }
}
function Qm(e, t, n) {
  let r = null,
    o = 0;
  for (; o < n.length; ) {
    let i = n[o];
    if (i === 0) {
      o += 4;
      continue;
    } else if (i === 5) {
      o += 2;
      continue;
    }
    if (typeof i == "number") break;
    if (e.hasOwnProperty(i)) {
      r === null && (r = []);
      let s = e[i];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === t) {
          r.push(i, s[a + 1], s[a + 2], n[o + 1]);
          break;
        }
    }
    o += 2;
  }
  return r;
}
function kd(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function Pd(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = F(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          kl(i), a.contentQueries(2, t[s], s);
        }
      }
    } finally {
      F(r);
    }
  }
}
function Lo(e, t) {
  return e[jn] ? (e[pu][Ne] = t) : (e[jn] = t), (e[pu] = t), t;
}
function Ms(e, t, n) {
  kl(0);
  let r = F(null);
  try {
    t(e, n);
  } finally {
    F(r);
  }
}
function Ym(e) {
  return (e[oo] ??= []);
}
function Km(e) {
  return (e.cleanup ??= []);
}
function Fd(e, t) {
  let n = e[sn],
    r = n ? n.get(dt, null) : null;
  r && r.handleError(t);
}
function ya(e, t, n, r, o) {
  for (let i = 0; i < n.length; ) {
    let s = n[i++],
      a = n[i++],
      c = n[i++],
      u = t[s],
      l = e.data[s];
    bd(l, u, r, a, c, o);
  }
}
function Ld(e, t, n) {
  let r = Cl(t, e);
  um(e[re], r, n);
}
function Jm(e, t) {
  let n = ht(t, e),
    r = n[O];
  Xm(r, n);
  let o = n[Xe];
  o !== null && n[ro] === null && (n[ro] = da(o, n[sn])), Da(r, n, n[Ye]);
}
function Xm(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function Da(e, t, n) {
  Xs(t);
  try {
    let r = e.viewQuery;
    r !== null && Ms(1, r, n);
    let o = e.template;
    o !== null && Md(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[cn]?.finishViewCreation(e),
      e.staticContentQueries && Pd(e, t),
      e.staticViewQueries && Ms(2, e.viewQuery, n);
    let i = e.components;
    i !== null && ev(t, i);
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    );
  } finally {
    (t[C] &= -5), ea();
  }
}
function ev(e, t) {
  for (let n = 0; n < t.length; n++) Jm(e, t[n]);
}
function tv(e, t, n, r) {
  let o = F(null);
  try {
    let i = t.tView,
      a = e[C] & 4096 ? 4096 : 16,
      c = Po(
        e,
        i,
        n,
        a,
        null,
        t,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null,
      ),
      u = e[t.index];
    c[an] = u;
    let l = e[cn];
    return l !== null && (c[cn] = l.createEmbeddedView(i)), Da(i, c, n), c;
  } finally {
    F(o);
  }
}
function Nu(e, t) {
  return !t || t.firstChild === null || od(e);
}
function nv(e, t, n, r = !0) {
  let o = t[O];
  if ((hm(o, t, e, n), r)) {
    let s = bs(n, e),
      a = t[re],
      c = Dd(a, e[bt]);
    c !== null && dm(o, e[Ae], a, t, c, s);
  }
  let i = t[ro];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function mo(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    if (n.type === 128) {
      n = o ? n.projectionNext : n.next;
      continue;
    }
    let i = t[n.index];
    i !== null && r.push(Be(i)), et(i) && rv(i, r);
    let s = n.type;
    if (s & 8) mo(e, t, n.child, r);
    else if (s & 32) {
      let a = ha(n, t),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (s & 16) {
      let a = wd(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = St(t[$e]);
        mo(c[O], c, a, r, !0);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function rv(e, t) {
  for (let n = ye; n < e.length; n++) {
    let r = e[n],
      o = r[O].firstChild;
    o !== null && mo(r[O], r, o, t);
  }
  e[bt] !== e[Xe] && t.push(e[bt]);
}
var jd = [];
function ov(e) {
  return e[ve] ?? iv(e);
}
function iv(e) {
  let t = jd.pop() ?? Object.create(av);
  return (t.lView = e), t;
}
function sv(e) {
  e.lView[ve] !== e && ((e.lView = null), jd.push(e));
}
var av = z(y({}, Ei), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    Ao(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[ve] = this;
  },
});
function cv(e) {
  let t = e[ve] ?? Object.create(uv);
  return (t.lView = e), t;
}
var uv = z(y({}, Ei), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    let t = St(e.lView);
    for (; t && !Vd(t[O]); ) t = St(t);
    t && bl(t);
  },
  consumerOnSignalRead() {
    this.lView[ve] = this;
  },
});
function Vd(e) {
  return e.type !== 2;
}
var lv = 100;
function $d(e, t = !0, n = 0) {
  let r = e[Ve],
    o = r.rendererFactory,
    i = !1;
  i || o.begin?.();
  try {
    dv(e, n);
  } catch (s) {
    throw (t && Fd(e, s), s);
  } finally {
    i || (o.end?.(), r.inlineEffectRunner?.flush());
  }
}
function dv(e, t) {
  let n = Nl();
  try {
    mu(!0), xs(e, t);
    let r = 0;
    for (; Vn(e); ) {
      if (r === lv) throw new D(103, !1);
      r++, xs(e, 1);
    }
  } finally {
    mu(n);
  }
}
function fv(e, t, n, r) {
  let o = t[C];
  if ((o & 256) === 256) return;
  let i = !1,
    s = !1;
  !i && t[Ve].inlineEffectRunner?.flush(), Xs(t);
  let a = !0,
    c = null,
    u = null;
  i ||
    (Vd(e)
      ? ((u = ov(t)), (c = Ii(u)))
      : Tc() === null
        ? ((a = !1), (u = cv(t)), (c = Ii(u)))
        : t[ve] && (Si(t[ve]), (t[ve] = null)));
  try {
    Il(t), hg(e.bindingStartIndex), n !== null && Md(e, t, n, 2, r);
    let l = (o & 3) === 3;
    if (!i)
      if (l) {
        let f = e.preOrderCheckHooks;
        f !== null && Qr(t, f, null);
      } else {
        let f = e.preOrderHooks;
        f !== null && Yr(t, f, 0, null), Zi(t, 0);
      }
    if ((s || hv(t), Bd(t, 0), e.contentQueries !== null && Pd(e, t), !i))
      if (l) {
        let f = e.contentCheckHooks;
        f !== null && Qr(t, f);
      } else {
        let f = e.contentHooks;
        f !== null && Yr(t, f, 1), Zi(t, 1);
      }
    xm(e, t);
    let d = e.components;
    d !== null && Hd(t, d, 0);
    let h = e.viewQuery;
    if ((h !== null && Ms(2, h, r), !i))
      if (l) {
        let f = e.viewCheckHooks;
        f !== null && Qr(t, f);
      } else {
        let f = e.viewHooks;
        f !== null && Yr(t, f, 2), Zi(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Wi])) {
      for (let f of t[Wi]) f();
      t[Wi] = null;
    }
    i || (t[C] &= -73);
  } catch (l) {
    throw (i || Ao(t), l);
  } finally {
    u !== null && (_c(u, c), a && sv(u)), ea();
  }
}
function Bd(e, t) {
  for (let n = sd(e); n !== null; n = ad(n))
    for (let r = ye; r < n.length; r++) {
      let o = n[r];
      Ud(o, t);
    }
}
function hv(e) {
  for (let t = sd(e); t !== null; t = ad(t)) {
    if (!(t[C] & ao.HasTransplantedViews)) continue;
    let n = t[so];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      bl(o);
    }
  }
}
function pv(e, t, n) {
  let r = ht(t, e);
  Ud(r, n);
}
function Ud(e, t) {
  Js(e) && xs(e, t);
}
function xs(e, t) {
  let r = e[O],
    o = e[C],
    i = e[ve],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && bi(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[C] &= -9217),
    s)
  )
    fv(r, e, r.template, e[Ye]);
  else if (o & 8192) {
    Bd(e, 1);
    let a = r.components;
    a !== null && Hd(e, a, 1);
  }
}
function Hd(e, t, n) {
  for (let r = 0; r < t.length; r++) pv(e, t[r], n);
}
function wa(e, t) {
  let n = Nl() ? 64 : 1088;
  for (e[Ve].changeDetectionScheduler?.notify(t); e; ) {
    e[C] |= n;
    let r = St(e);
    if (ds(e) && !r) return e;
    e = r;
  }
  return null;
}
var _t = class {
    get rootNodes() {
      let t = this._lView,
        n = t[O];
      return mo(n, t, n.firstChild, []);
    }
    constructor(t, n, r = !0) {
      (this._lView = t),
        (this._cdRefInjectingView = n),
        (this.notifyErrorHandler = r),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[Ye];
    }
    set context(t) {
      this._lView[Ye] = t;
    }
    get destroyed() {
      return (this._lView[C] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let t = this._lView[se];
        if (et(t)) {
          let n = t[io],
            r = n ? n.indexOf(this) : -1;
          r > -1 && (Is(t, r), to(n, r));
        }
        this._attachedToViewContainer = !1;
      }
      vd(this._lView[O], this._lView);
    }
    onDestroy(t) {
      Sl(this._lView, t);
    }
    markForCheck() {
      wa(this._cdRefInjectingView || this._lView, 4);
    }
    detach() {
      this._lView[C] &= -129;
    }
    reattach() {
      hs(this._lView), (this._lView[C] |= 128);
    }
    detectChanges() {
      (this._lView[C] |= 1024), $d(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new D(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      this._appRef = null;
      let t = ds(this._lView),
        n = this._lView[an];
      n !== null && !t && pa(n, this._lView), gd(this._lView[O], this._lView);
    }
    attachToAppRef(t) {
      if (this._attachedToViewContainer) throw new D(902, !1);
      this._appRef = t;
      let n = ds(this._lView),
        r = this._lView[an];
      r !== null && !n && md(r, this._lView), hs(this._lView);
    }
  },
  jo = (() => {
    let t = class t {};
    t.__NG_ELEMENT_ID__ = vv;
    let e = t;
    return e;
  })(),
  gv = jo,
  mv = class extends gv {
    constructor(t, n, r) {
      super(),
        (this._declarationLView = t),
        (this._declarationTContainer = n),
        (this.elementRef = r);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(t, n) {
      return this.createEmbeddedViewImpl(t, n);
    }
    createEmbeddedViewImpl(t, n, r) {
      let o = tv(this._declarationLView, this._declarationTContainer, t, {
        embeddedViewInjector: n,
        dehydratedView: r,
      });
      return new _t(o);
    }
  };
function vv() {
  return yv(we(), H());
}
function yv(e, t) {
  return e.type & 4 ? new mv(t, e, Ro(e, t)) : null;
}
var aM = new RegExp(`^(\\d+)*(${tm}|${em})*(.*)`);
var Dv = () => null;
function Au(e, t) {
  return Dv(e, t);
}
var Un = class {},
  Ca = new M("", { providedIn: "root", factory: () => !1 });
var zd = new M(""),
  Gd = new M(""),
  Ts = class {},
  vo = class {};
function wv(e) {
  let t = Error(`No component factory found for ${ce(e)}.`);
  return (t[Cv] = e), t;
}
var Cv = "ngComponent";
var _s = class {
    resolveComponentFactory(t) {
      throw wv(t);
    }
  },
  _a = class _a {};
_a.NULL = new _s();
var un = _a,
  ln = class {},
  Vo = (() => {
    let t = class t {
      constructor() {
        this.destroyNode = null;
      }
    };
    t.__NG_ELEMENT_ID__ = () => Ev();
    let e = t;
    return e;
  })();
function Ev() {
  let e = H(),
    t = we(),
    n = ht(t.index, e);
  return (ct(n) ? n : e)[re];
}
var Iv = (() => {
  let t = class t {};
  t.ɵprov = w({ token: t, providedIn: "root", factory: () => null });
  let e = t;
  return e;
})();
var Ru = new Set();
function Ea(e) {
  Ru.has(e) ||
    (Ru.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
var qd = (() => {
  let t = class t {
    constructor() {
      (this.handler = null), (this.internalCallbacks = []);
    }
    execute() {
      this.executeInternalCallbacks(), this.handler?.execute();
    }
    executeInternalCallbacks() {
      let r = [...this.internalCallbacks];
      this.internalCallbacks.length = 0;
      for (let o of r) o();
    }
    ngOnDestroy() {
      this.handler?.destroy(),
        (this.handler = null),
        (this.internalCallbacks.length = 0);
    }
  };
  t.ɵprov = w({ token: t, providedIn: "root", factory: () => new t() });
  let e = t;
  return e;
})();
function Ns(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = ns(o, a);
      else if (i == 2) {
        let c = a,
          u = t[++s];
        r = ns(r, c + ": " + u + ";");
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o);
}
var yo = class extends un {
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let n = It(t);
    return new Hn(n, this.ngModule);
  }
};
function Ou(e, t) {
  let n = [];
  for (let r in e) {
    if (!e.hasOwnProperty(r)) continue;
    let o = e[r];
    if (o === void 0) continue;
    let i = Array.isArray(o),
      s = i ? o[0] : o,
      a = i ? o[1] : ut.None;
    t
      ? n.push({
          propName: s,
          templateName: r,
          isSignal: (a & ut.SignalBased) !== 0,
        })
      : n.push({ propName: s, templateName: r });
  }
  return n;
}
function bv(e) {
  let t = e.toLowerCase();
  return t === "svg" ? wl : t === "math" ? tg : null;
}
var Hn = class extends vo {
    get inputs() {
      let t = this.componentDef,
        n = t.inputTransforms,
        r = Ou(t.inputs, !0);
      if (n !== null)
        for (let o of r)
          n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
      return r;
    }
    get outputs() {
      return Ou(this.componentDef.outputs, !1);
    }
    constructor(t, n) {
      super(),
        (this.componentDef = t),
        (this.ngModule = n),
        (this.componentType = t.type),
        (this.selector = kp(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors
          ? t.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(t, n, r, o) {
      let i = F(null);
      try {
        o = o || this.ngModule;
        let s = o instanceof De ? o : o?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let a = s ? new gs(t, s) : t,
          c = a.get(ln, null);
        if (c === null) throw new D(407, !1);
        let u = a.get(Iv, null),
          l = a.get(qd, null),
          d = a.get(Un, null),
          h = {
            rendererFactory: c,
            sanitizer: u,
            inlineEffectRunner: null,
            afterRenderEventManager: l,
            changeDetectionScheduler: d,
          },
          f = c.createRenderer(null, this.componentDef),
          g = this.componentDef.selectors[0][0] || "div",
          E = r
            ? Nm(f, r, this.componentDef.encapsulation, a)
            : pd(f, g, bv(g)),
          V = 512;
        this.componentDef.signals
          ? (V |= 4096)
          : this.componentDef.onPush || (V |= 16);
        let B = null;
        E !== null && (B = da(E, a, !0));
        let Ie = va(0, null, null, 1, 0, null, null, null, null, null, null),
          q = Po(null, Ie, null, V, null, null, h, f, a, null, B);
        Xs(q);
        let qe, Vt;
        try {
          let be = this.componentDef,
            $t,
            Di = null;
          be.findHostDirectiveDefs
            ? (($t = []),
              (Di = new Map()),
              be.findHostDirectiveDefs(be, $t, Di),
              $t.push(be))
            : ($t = [be]);
          let Ih = Sv(q, E),
            bh = Mv(Ih, E, be, $t, q, h, f);
          (Vt = El(Ie, lt)),
            E && _v(f, be, E, r),
            n !== void 0 && Nv(Vt, this.ngContentSelectors, n),
            (qe = Tv(bh, be, $t, Di, q, [Av])),
            Da(Ie, q, null);
        } finally {
          ea();
        }
        return new As(this.componentType, qe, Ro(Vt, q), q, Vt);
      } finally {
        F(i);
      }
    }
  },
  As = class extends Ts {
    constructor(t, n, r, o, i) {
      super(),
        (this.location = r),
        (this._rootLView = o),
        (this._tNode = i),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new _t(o, void 0, !1)),
        (this.componentType = t);
    }
    setInput(t, n) {
      let r = this._tNode.inputs,
        o;
      if (r !== null && (o = r[t])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(t) &&
            Object.is(this.previousInputValues.get(t), n))
        )
          return;
        let i = this._rootLView;
        ya(i[O], i, o, t, n), this.previousInputValues.set(t, n);
        let s = ht(this._tNode.index, i);
        wa(s, 1);
      }
    }
    get injector() {
      return new Et(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(t) {
      this.hostView.onDestroy(t);
    }
  };
function Sv(e, t) {
  let n = e[O],
    r = lt;
  return (e[r] = t), Fo(n, r, 2, "#host", null);
}
function Mv(e, t, n, r, o, i, s) {
  let a = o[O];
  xv(r, e, t, s);
  let c = null;
  t !== null && (c = da(t, o[sn]));
  let u = i.rendererFactory.createRenderer(t, n),
    l = 16;
  n.signals ? (l = 4096) : n.onPush && (l = 64);
  let d = Po(o, Nd(n), null, l, o[e.index], e, i, u, null, null, c);
  return (
    a.firstCreatePass && Ss(a, e, r.length - 1), Lo(o, d), (o[e.index] = d)
  );
}
function xv(e, t, n, r) {
  for (let o of e) t.mergedAttrs = Ws(t.mergedAttrs, o.hostAttrs);
  t.mergedAttrs !== null &&
    (Ns(t, t.mergedAttrs, !0), n !== null && Ed(r, n, t));
}
function Tv(e, t, n, r, o, i) {
  let s = we(),
    a = o[O],
    c = Re(s, o);
  Rd(a, o, s, n, null, r);
  for (let l = 0; l < n.length; l++) {
    let d = s.directiveStart + l,
      h = Bn(o, a, d, s);
    Tt(h, o);
  }
  Od(a, o, s), c && Tt(c, o);
  let u = Bn(o, a, s.directiveStart + s.componentOffset, s);
  if (((e[Ye] = o[Ye] = u), i !== null)) for (let l of i) l(u, t);
  return xd(a, s, o), u;
}
function _v(e, t, n, r) {
  if (r) ss(e, n, ["ng-version", "18.2.1"]);
  else {
    let { attrs: o, classes: i } = Pp(t.selectors[0]);
    o && ss(e, n, o), i && i.length > 0 && Cd(e, n, i.join(" "));
  }
}
function Nv(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null ? Array.from(i) : null);
  }
}
function Av() {
  let e = we();
  ra(H()[O], e);
}
var mn = (() => {
  let t = class t {};
  t.__NG_ELEMENT_ID__ = Rv;
  let e = t;
  return e;
})();
function Rv() {
  let e = we();
  return kv(e, H());
}
var Ov = mn,
  Wd = class extends Ov {
    constructor(t, n, r) {
      super(),
        (this._lContainer = t),
        (this._hostTNode = n),
        (this._hostLView = r);
    }
    get element() {
      return Ro(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new Et(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let t = oa(this._hostTNode, this._hostLView);
      if (Hl(t)) {
        let n = lo(t, this._hostLView),
          r = uo(t),
          o = n[O].data[r + 8];
        return new Et(o, n);
      } else return new Et(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(t) {
      let n = ku(this._lContainer);
      return (n !== null && n[t]) || null;
    }
    get length() {
      return this._lContainer.length - ye;
    }
    createEmbeddedView(t, n, r) {
      let o, i;
      typeof r == "number"
        ? (o = r)
        : r != null && ((o = r.index), (i = r.injector));
      let s = Au(this._lContainer, t.ssrId),
        a = t.createEmbeddedViewImpl(n || {}, i, s);
      return this.insertImpl(a, o, Nu(this._hostTNode, s)), a;
    }
    createComponent(t, n, r, o, i) {
      let s = t && !Kp(t),
        a;
      if (s) a = n;
      else {
        let g = n || {};
        (a = g.index),
          (r = g.injector),
          (o = g.projectableNodes),
          (i = g.environmentInjector || g.ngModuleRef);
      }
      let c = s ? t : new Hn(It(t)),
        u = r || this.parentInjector;
      if (!i && c.ngModule == null) {
        let E = (s ? u : this.parentInjector).get(De, null);
        E && (i = E);
      }
      let l = It(c.componentType ?? {}),
        d = Au(this._lContainer, l?.id ?? null),
        h = d?.firstChild ?? null,
        f = c.create(u, o, h, i);
      return this.insertImpl(f.hostView, a, Nu(this._hostTNode, d)), f;
    }
    insert(t, n) {
      return this.insertImpl(t, n, !0);
    }
    insertImpl(t, n, r) {
      let o = t._lView;
      if (ng(o)) {
        let a = this.indexOf(t);
        if (a !== -1) this.detach(a);
        else {
          let c = o[se],
            u = new Wd(c, c[Ae], c[se]);
          u.detach(u.indexOf(t));
        }
      }
      let i = this._adjustIndex(n),
        s = this._lContainer;
      return nv(s, o, i, r), t.attachToViewContainerRef(), Xu(Xi(s), i, t), t;
    }
    move(t, n) {
      return this.insert(t, n);
    }
    indexOf(t) {
      let n = ku(this._lContainer);
      return n !== null ? n.indexOf(t) : -1;
    }
    remove(t) {
      let n = this._adjustIndex(t, -1),
        r = Is(this._lContainer, n);
      r && (to(Xi(this._lContainer), n), vd(r[O], r));
    }
    detach(t) {
      let n = this._adjustIndex(t, -1),
        r = Is(this._lContainer, n);
      return r && to(Xi(this._lContainer), n) != null ? new _t(r) : null;
    }
    _adjustIndex(t, n = 0) {
      return t ?? this.length + n;
    }
  };
function ku(e) {
  return e[io];
}
function Xi(e) {
  return e[io] || (e[io] = []);
}
function kv(e, t) {
  let n,
    r = t[e.index];
  return (
    et(r) ? (n = r) : ((n = kd(r, t, null, e)), (t[e.index] = n), Lo(t, n)),
    Fv(n, t, e, r),
    new Wd(n, e, t)
  );
}
function Pv(e, t) {
  let n = e[re],
    r = n.createComment(""),
    o = Re(t, e),
    i = Dd(n, o);
  return go(n, i, r, ym(n, o), !1), r;
}
var Fv = Vv,
  Lv = () => !1;
function jv(e, t, n) {
  return Lv(e, t, n);
}
function Vv(e, t, n, r) {
  if (e[bt]) return;
  let o;
  n.type & 8 ? (o = Be(r)) : (o = Pv(t, n)), (e[bt] = o);
}
var ft = class {},
  zn = class {};
var Rs = class extends ft {
    constructor(t, n, r, o = !0) {
      super(),
        (this.ngModuleType = t),
        (this._parent = n),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new yo(this));
      let i = al(t);
      (this._bootstrapComponents = hd(i.bootstrap)),
        (this._r3Injector = Xl(
          t,
          n,
          [
            { provide: ft, useValue: this },
            { provide: un, useValue: this.componentFactoryResolver },
            ...r,
          ],
          ce(t),
          new Set(["environment"]),
        )),
        o && this.resolveInjectorInitializers();
    }
    resolveInjectorInitializers() {
      this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(this.ngModuleType));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let t = this._r3Injector;
      !t.destroyed && t.destroy(),
        this.destroyCbs.forEach((n) => n()),
        (this.destroyCbs = null);
    }
    onDestroy(t) {
      this.destroyCbs.push(t);
    }
  },
  Os = class extends zn {
    constructor(t) {
      super(), (this.moduleType = t);
    }
    create(t) {
      return new Rs(this.moduleType, t, []);
    }
  };
var Do = class extends ft {
  constructor(t) {
    super(),
      (this.componentFactoryResolver = new yo(this)),
      (this.instance = null);
    let n = new Ln(
      [
        ...t.providers,
        { provide: ft, useValue: this },
        { provide: un, useValue: this.componentFactoryResolver },
      ],
      t.parent || Ys(),
      t.debugName,
      new Set(["environment"]),
    );
    (this.injector = n),
      t.runEnvironmentInitializers && n.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(t) {
    this.injector.onDestroy(t);
  }
};
function Ia(e, t, n = null) {
  return new Do({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
function Zd(e) {
  return Bv(e)
    ? Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e)
    : !1;
}
function $v(e, t) {
  if (Array.isArray(e)) for (let n = 0; n < e.length; n++) t(e[n]);
  else {
    let n = e[Symbol.iterator](),
      r;
    for (; !(r = n.next()).done; ) t(r.value);
  }
}
function Bv(e) {
  return e !== null && (typeof e == "function" || typeof e == "object");
}
function Qd(e, t, n) {
  return (e[t] = n);
}
function dn(e, t, n) {
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function Yd(e, t, n, r) {
  let o = dn(e, t, n);
  return dn(e, t + 1, r) || o;
}
function Uv(e) {
  return (e.flags & 32) === 32;
}
function Hv(e, t, n, r, o, i, s, a, c) {
  let u = t.consts,
    l = Fo(t, e, 4, s || null, a || null);
  Ad(t, n, l, co(u, c)), ra(t, l);
  let d = (l.tView = va(
    2,
    l,
    r,
    o,
    i,
    t.directiveRegistry,
    t.pipeRegistry,
    null,
    t.schemas,
    u,
    null,
  ));
  return (
    t.queries !== null &&
      (t.queries.template(t, l), (d.queries = t.queries.embeddedTView(l))),
    l
  );
}
function zv(e, t, n, r, o, i, s, a, c, u) {
  let l = n + lt,
    d = t.firstCreatePass ? Hv(l, t, e, r, o, i, s, a, c) : t.data[l];
  Qn(d, !1);
  let h = Gv(t, e, d, n);
  ta() && ga(t, e, h, d), Tt(h, e);
  let f = kd(h, e, h, d);
  return (
    (e[l] = f),
    Lo(e, f),
    jv(f, d, e),
    Ks(d) && Td(t, e, d),
    c != null && _d(e, d, u),
    d
  );
}
function Oe(e, t, n, r, o, i, s, a) {
  let c = H(),
    u = pt(),
    l = co(u.consts, i);
  return zv(c, u, e, t, n, r, o, l, s, a), Oe;
}
var Gv = qv;
function qv(e, t, n, r) {
  return na(!0), t[re].createComment("");
}
function Wv(e, t, n, r) {
  return dn(e, Rl(), n) ? t + kn(n) + r : Ue;
}
function Zv(e, t, n, r, o, i) {
  let s = fg(),
    a = Yd(e, s, n, o);
  return Ol(2), a ? t + kn(n) + r + kn(o) + i : Ue;
}
function qr(e, t) {
  return (e << 17) | (t << 2);
}
function Nt(e) {
  return (e >> 17) & 32767;
}
function Qv(e) {
  return (e & 2) == 2;
}
function Yv(e, t) {
  return (e & 131071) | (t << 17);
}
function ks(e) {
  return e | 2;
}
function fn(e) {
  return (e & 131068) >> 2;
}
function es(e, t) {
  return (e & -131069) | (t << 2);
}
function Kv(e) {
  return (e & 1) === 1;
}
function Ps(e) {
  return e | 1;
}
function Jv(e, t, n, r, o, i) {
  let s = i ? t.classBindings : t.styleBindings,
    a = Nt(s),
    c = fn(s);
  e[r] = n;
  let u = !1,
    l;
  if (Array.isArray(n)) {
    let d = n;
    (l = d[1]), (l === null || qn(d, l) > 0) && (u = !0);
  } else l = n;
  if (o)
    if (c !== 0) {
      let h = Nt(e[a + 1]);
      (e[r + 1] = qr(h, a)),
        h !== 0 && (e[h + 1] = es(e[h + 1], r)),
        (e[a + 1] = Yv(e[a + 1], r));
    } else
      (e[r + 1] = qr(a, 0)), a !== 0 && (e[a + 1] = es(e[a + 1], r)), (a = r);
  else
    (e[r + 1] = qr(c, 0)),
      a === 0 ? (a = r) : (e[c + 1] = es(e[c + 1], r)),
      (c = r);
  u && (e[r + 1] = ks(e[r + 1])),
    Pu(e, l, r, !0),
    Pu(e, l, r, !1),
    Xv(t, l, e, r, i),
    (s = qr(a, c)),
    i ? (t.classBindings = s) : (t.styleBindings = s);
}
function Xv(e, t, n, r, o) {
  let i = o ? e.residualClasses : e.residualStyles;
  i != null &&
    typeof t == "string" &&
    qn(i, t) >= 0 &&
    (n[r + 1] = Ps(n[r + 1]));
}
function Pu(e, t, n, r) {
  let o = e[n + 1],
    i = t === null,
    s = r ? Nt(o) : fn(o),
    a = !1;
  for (; s !== 0 && (a === !1 || i); ) {
    let c = e[s],
      u = e[s + 1];
    ey(c, t) && ((a = !0), (e[s + 1] = r ? Ps(u) : ks(u))),
      (s = r ? Nt(u) : fn(u));
  }
  a && (e[n + 1] = r ? ks(o) : Ps(o));
}
function ey(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == "string"
      ? qn(e, t) >= 0
      : !1;
}
var _e = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function ty(e) {
  return e.substring(_e.key, _e.keyEnd);
}
function ny(e) {
  return ry(e), Kd(e, Jd(e, 0, _e.textEnd));
}
function Kd(e, t) {
  let n = _e.textEnd;
  return n === t ? -1 : ((t = _e.keyEnd = oy(e, (_e.key = t), n)), Jd(e, t, n));
}
function ry(e) {
  (_e.key = 0),
    (_e.keyEnd = 0),
    (_e.value = 0),
    (_e.valueEnd = 0),
    (_e.textEnd = e.length);
}
function Jd(e, t, n) {
  for (; t < n && e.charCodeAt(t) <= 32; ) t++;
  return t;
}
function oy(e, t, n) {
  for (; t < n && e.charCodeAt(t) > 32; ) t++;
  return t;
}
function te(e, t, n) {
  let r = H(),
    o = Rl();
  if (dn(r, o, t)) {
    let i = pt(),
      s = Dg();
    Fm(i, s, r, e, t, r[re], n, !1);
  }
  return te;
}
function Fs(e, t, n, r, o) {
  let i = t.inputs,
    s = o ? "class" : "style";
  ya(e, n, i[s], s, r);
}
function de(e) {
  sy(hy, iy, e, !0);
}
function iy(e, t) {
  for (let n = ny(t); n >= 0; n = Kd(t, n)) qs(e, ty(t), !0);
}
function sy(e, t, n, r) {
  let o = pt(),
    i = Ol(2);
  o.firstUpdatePass && ay(o, null, i, r);
  let s = H();
  if (n !== Ue && dn(s, i, n)) {
    let a = o.data[At()];
    if (ef(a, r) && !Xd(o, i)) {
      let c = r ? a.classesWithoutHost : a.stylesWithoutHost;
      c !== null && (n = ns(c, n || "")), Fs(o, a, s, n, r);
    } else py(o, a, s, s[re], s[i + 1], (s[i + 1] = fy(e, t, n)), r, i);
  }
}
function Xd(e, t) {
  return t >= e.expandoStartIndex;
}
function ay(e, t, n, r) {
  let o = e.data;
  if (o[n + 1] === null) {
    let i = o[At()],
      s = Xd(e, n);
    ef(i, r) && t === null && !s && (t = !1),
      (t = cy(o, i, t, r)),
      Jv(o, i, t, n, s, r);
  }
}
function cy(e, t, n, r) {
  let o = vg(e),
    i = r ? t.residualClasses : t.residualStyles;
  if (o === null)
    (r ? t.classBindings : t.styleBindings) === 0 &&
      ((n = ts(null, e, t, n, r)), (n = Gn(n, t.attrs, r)), (i = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== o)
      if (((n = ts(o, e, t, n, r)), i === null)) {
        let c = uy(e, t, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = ts(null, e, t, c[1], r)),
          (c = Gn(c, t.attrs, r)),
          ly(e, t, r, c));
      } else i = dy(e, t, r);
  }
  return (
    i !== void 0 && (r ? (t.residualClasses = i) : (t.residualStyles = i)), n
  );
}
function uy(e, t, n) {
  let r = n ? t.classBindings : t.styleBindings;
  if (fn(r) !== 0) return e[Nt(r)];
}
function ly(e, t, n, r) {
  let o = n ? t.classBindings : t.styleBindings;
  e[Nt(o)] = r;
}
function dy(e, t, n) {
  let r,
    o = t.directiveEnd;
  for (let i = 1 + t.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs;
    r = Gn(r, s, n);
  }
  return Gn(r, t.attrs, n);
}
function ts(e, t, n, r, o) {
  let i = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((i = t[a]), (r = Gn(r, i.hostAttrs, o)), i !== e);

  )
    a++;
  return e !== null && (n.directiveStylingLast = a), r;
}
function Gn(e, t, n) {
  let r = n ? 1 : 2,
    o = -1;
  if (t !== null)
    for (let i = 0; i < t.length; i++) {
      let s = t[i];
      typeof s == "number"
        ? (o = s)
        : o === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]),
          qs(e, s, n ? !0 : t[++i]));
    }
  return e === void 0 ? null : e;
}
function fy(e, t, n) {
  if (n == null || n === "") return Qe;
  let r = [],
    o = Oo(n);
  if (Array.isArray(o)) for (let i = 0; i < o.length; i++) e(r, o[i], !0);
  else if (typeof o == "object")
    for (let i in o) o.hasOwnProperty(i) && e(r, i, o[i]);
  else typeof o == "string" && t(r, o);
  return r;
}
function hy(e, t, n) {
  let r = String(t);
  r !== "" && !r.includes(" ") && qs(e, r, n);
}
function py(e, t, n, r, o, i, s, a) {
  o === Ue && (o = Qe);
  let c = 0,
    u = 0,
    l = 0 < o.length ? o[0] : null,
    d = 0 < i.length ? i[0] : null;
  for (; l !== null || d !== null; ) {
    let h = c < o.length ? o[c + 1] : void 0,
      f = u < i.length ? i[u + 1] : void 0,
      g = null,
      E;
    l === d
      ? ((c += 2), (u += 2), h !== f && ((g = d), (E = f)))
      : d === null || (l !== null && l < d)
        ? ((c += 2), (g = l))
        : ((u += 2), (g = d), (E = f)),
      g !== null && gy(e, t, n, r, g, E, s, a),
      (l = c < o.length ? o[c] : null),
      (d = u < i.length ? i[u] : null);
  }
}
function gy(e, t, n, r, o, i, s, a) {
  if (!(t.type & 3)) return;
  let c = e.data,
    u = c[a + 1],
    l = Kv(u) ? Fu(c, t, n, o, fn(u), s) : void 0;
  if (!wo(l)) {
    wo(i) || (Qv(u) && (i = Fu(c, null, n, o, a, s)));
    let d = Cl(At(), n);
    Sm(r, s, d, o, i);
  }
}
function Fu(e, t, n, r, o, i) {
  let s = t === null,
    a;
  for (; o > 0; ) {
    let c = e[o],
      u = Array.isArray(c),
      l = u ? c[1] : c,
      d = l === null,
      h = n[o + 1];
    h === Ue && (h = d ? Qe : void 0);
    let f = d ? Gi(h, r) : l === r ? h : void 0;
    if ((u && !wo(f) && (f = Gi(c, r)), wo(f) && ((a = f), s))) return a;
    let g = e[o + 1];
    o = s ? Nt(g) : fn(g);
  }
  if (t !== null) {
    let c = i ? t.residualClasses : t.residualStyles;
    c != null && (a = Gi(c, r));
  }
  return a;
}
function wo(e) {
  return e !== void 0;
}
function ef(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0;
}
function my(e, t, n, r, o, i) {
  let s = t.consts,
    a = co(s, o),
    c = Fo(t, e, 2, r, a);
  return (
    Ad(t, n, c, co(s, i)),
    c.attrs !== null && Ns(c, c.attrs, !1),
    c.mergedAttrs !== null && Ns(c, c.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, c),
    c
  );
}
function m(e, t, n, r) {
  let o = H(),
    i = pt(),
    s = lt + e,
    a = o[re],
    c = i.firstCreatePass ? my(s, i, o, t, n, r) : i.data[s],
    u = vy(i, o, c, a, t, e);
  o[s] = u;
  let l = Ks(c);
  return (
    Qn(c, !0),
    Ed(a, u, c),
    !Uv(c) && ta() && ga(i, o, u, c),
    og() === 0 && Tt(u, o),
    ig(),
    l && (Td(i, o, c), xd(i, c, o)),
    r !== null && _d(o, c),
    m
  );
}
function v() {
  let e = we();
  _l() ? dg() : ((e = e.parent), Qn(e, !1));
  let t = e;
  cg(t) && ug(), sg();
  let n = pt();
  return (
    n.firstCreatePass && (ra(n, e), gl(e) && n.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      Sg(t) &&
      Fs(n, t, H(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      Mg(t) &&
      Fs(n, t, H(), t.stylesWithoutHost, !1),
    v
  );
}
function U(e, t, n, r) {
  return m(e, t, n, r), v(), U;
}
var vy = (e, t, n, r, o, i) => (na(!0), pd(r, o, Cg()));
var Co = "en-US";
var yy = Co;
function Dy(e) {
  typeof e == "string" && (yy = e.toLowerCase().replace(/_/g, "-"));
}
var wy = (e, t, n) => {};
function gt(e, t, n, r) {
  let o = H(),
    i = pt(),
    s = we();
  return Ey(i, o, o[re], s, e, t, r), gt;
}
function Cy(e, t, n, r) {
  let o = e.cleanup;
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === n && o[i + 1] === r) {
        let a = t[oo],
          c = o[i + 2];
        return a.length > c ? a[c] : null;
      }
      typeof s == "string" && (i += 2);
    }
  return null;
}
function Ey(e, t, n, r, o, i, s) {
  let a = Ks(r),
    u = e.firstCreatePass && Km(e),
    l = t[Ye],
    d = Ym(t),
    h = !0;
  if (r.type & 3 || s) {
    let E = Re(r, t),
      V = s ? s(E) : E,
      B = d.length,
      Ie = s ? (qe) => s(Be(qe[r.index])) : r.index,
      q = null;
    if ((!s && a && (q = Cy(e, t, o, r.index)), q !== null)) {
      let qe = q.__ngLastListenerFn__ || q;
      (qe.__ngNextListenerFn__ = i), (q.__ngLastListenerFn__ = i), (h = !1);
    } else {
      (i = ju(r, t, l, i)), wy(E, o, i);
      let qe = n.listen(V, o, i);
      d.push(i, qe), u && u.push(o, Ie, B, B + 1);
    }
  } else i = ju(r, t, l, i);
  let f = r.outputs,
    g;
  if (h && f !== null && (g = f[o])) {
    let E = g.length;
    if (E)
      for (let V = 0; V < E; V += 2) {
        let B = g[V],
          Ie = g[V + 1],
          Vt = t[B][Ie].subscribe(i),
          be = d.length;
        d.push(i, Vt), u && u.push(o, r.index, be, -(be + 1));
      }
  }
}
function Lu(e, t, n, r) {
  let o = F(null);
  try {
    return Fe(6, t, n), n(r) !== !1;
  } catch (i) {
    return Fd(e, i), !1;
  } finally {
    Fe(7, t, n), F(o);
  }
}
function ju(e, t, n, r) {
  return function o(i) {
    if (i === Function) return r;
    let s = e.componentOffset > -1 ? ht(e.index, t) : t;
    wa(s, 5);
    let a = Lu(t, n, r, i),
      c = o.__ngNextListenerFn__;
    for (; c; ) (a = Lu(t, n, c, i) && a), (c = c.__ngNextListenerFn__);
    return a;
  };
}
function S(e, t = "") {
  let n = H(),
    r = pt(),
    o = e + lt,
    i = r.firstCreatePass ? Fo(r, o, 1, t, null) : r.data[o],
    s = Iy(r, n, i, t, e);
  (n[o] = s), ta() && ga(r, n, s, i), Qn(i, !1);
}
var Iy = (e, t, n, r, o) => (na(!0), cm(t[re], r));
function ze(e) {
  return mt("", e, ""), ze;
}
function mt(e, t, n) {
  let r = H(),
    o = Wv(r, e, t, n);
  return o !== Ue && Ld(r, At(), o), mt;
}
function ba(e, t, n, r, o) {
  let i = H(),
    s = Zv(i, e, t, n, r, o);
  return s !== Ue && Ld(i, At(), s), ba;
}
var by = (() => {
  let t = class t {
    constructor(r) {
      (this._injector = r), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(r) {
      if (!r.standalone) return null;
      if (!this.cachedInjectors.has(r)) {
        let o = ll(!1, r.type),
          i =
            o.length > 0
              ? Ia([o], this._injector, `Standalone[${r.type.name}]`)
              : null;
        this.cachedInjectors.set(r, i);
      }
      return this.cachedInjectors.get(r);
    }
    ngOnDestroy() {
      try {
        for (let r of this.cachedInjectors.values()) r !== null && r.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  t.ɵprov = w({
    token: t,
    providedIn: "environment",
    factory: () => new t(_(De)),
  });
  let e = t;
  return e;
})();
function X(e) {
  Ea("NgStandalone"),
    (e.getStandaloneInjector = (t) =>
      t.get(by).getOrCreateStandaloneInjector(e));
}
function tf(e, t, n, r) {
  return Sy(H(), Al(), e, t, n, r);
}
function nf(e, t, n, r, o) {
  return My(H(), Al(), e, t, n, r, o);
}
function rf(e, t) {
  let n = e[t];
  return n === Ue ? void 0 : n;
}
function Sy(e, t, n, r, o, i) {
  let s = t + n;
  return dn(e, s, o) ? Qd(e, s + 1, i ? r.call(i, o) : r(o)) : rf(e, s + 1);
}
function My(e, t, n, r, o, i, s) {
  let a = t + n;
  return Yd(e, a, o, i)
    ? Qd(e, a + 2, s ? r.call(s, o, i) : r(o, i))
    : rf(e, a + 2);
}
var $o = (() => {
  let t = class t {
    log(r) {
      console.log(r);
    }
    warn(r) {
      console.warn(r);
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: "platform" }));
  let e = t;
  return e;
})();
var of = new M("");
function Xn(e) {
  return !!e && typeof e.then == "function";
}
function sf(e) {
  return !!e && typeof e.subscribe == "function";
}
var af = new M(""),
  cf = (() => {
    let t = class t {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, o) => {
            (this.resolve = r), (this.reject = o);
          })),
          (this.appInits = p(af, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let r = [];
        for (let i of this.appInits) {
          let s = i();
          if (Xn(s)) r.push(s);
          else if (sf(s)) {
            let a = new Promise((c, u) => {
              s.subscribe({ complete: c, error: u });
            });
            r.push(a);
          }
        }
        let o = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(r)
          .then(() => {
            o();
          })
          .catch((i) => {
            this.reject(i);
          }),
          r.length === 0 && o(),
          (this.initialized = !0);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Sa = new M("");
function xy() {
  Nc(() => {
    throw new D(600, !1);
  });
}
function Ty(e) {
  return e.isBoundToModule;
}
var _y = 10;
function Ny(e, t, n) {
  try {
    let r = n();
    return Xn(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e.handleError(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e.handleError(r)), r);
  }
}
var Rt = (() => {
  let t = class t {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = p(qg)),
        (this.afterRenderEffectManager = p(qd)),
        (this.zonelessEnabled = p(Ca)),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new oe()),
        (this.afterTick = new oe()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = p(pn).hasPendingTasks.pipe(R((r) => !r))),
        (this._injector = p(De));
    }
    get allViews() {
      return [...this.externalTestViews.keys(), ...this._views];
    }
    get destroyed() {
      return this._destroyed;
    }
    whenStable() {
      let r;
      return new Promise((o) => {
        r = this.isStable.subscribe({
          next: (i) => {
            i && o();
          },
        });
      }).finally(() => {
        r.unsubscribe();
      });
    }
    get injector() {
      return this._injector;
    }
    bootstrap(r, o) {
      let i = r instanceof vo;
      if (!this._injector.get(cf).done) {
        let f = !i && sl(r),
          g = !1;
        throw new D(405, g);
      }
      let a;
      i ? (a = r) : (a = this._injector.get(un).resolveComponentFactory(r)),
        this.componentTypes.push(a.componentType);
      let c = Ty(a) ? void 0 : this._injector.get(ft),
        u = o || a.selector,
        l = a.create(xt.NULL, [], u, c),
        d = l.location.nativeElement,
        h = l.injector.get(of, null);
      return (
        h?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            Kr(this.components, l),
            h?.unregisterApplication(d);
        }),
        this._loadComponent(l),
        l
      );
    }
    tick() {
      this._tick(!0);
    }
    _tick(r) {
      if (this._runningTick) throw new D(101, !1);
      let o = F(null);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews(r);
      } catch (i) {
        this.internalErrorHandler(i);
      } finally {
        (this._runningTick = !1), F(o), this.afterTick.next();
      }
    }
    detectChangesInAttachedViews(r) {
      let o = null;
      this._injector.destroyed ||
        (o = this._injector.get(ln, null, { optional: !0 }));
      let i = 0,
        s = this.afterRenderEffectManager;
      for (; i < _y; ) {
        let a = i === 0;
        if (r || !a) {
          this.beforeRender.next(a);
          for (let { _lView: c, notifyErrorHandler: u } of this._views)
            Ay(c, u, a, this.zonelessEnabled);
        } else o?.begin?.(), o?.end?.();
        if (
          (i++,
          s.executeInternalCallbacks(),
          !this.allViews.some(({ _lView: c }) => Vn(c)) &&
            (s.execute(), !this.allViews.some(({ _lView: c }) => Vn(c))))
        )
          break;
      }
    }
    attachView(r) {
      let o = r;
      this._views.push(o), o.attachToAppRef(this);
    }
    detachView(r) {
      let o = r;
      Kr(this._views, o), o.detachFromAppRef();
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r);
      let o = this._injector.get(Sa, []);
      [...this._bootstrapListeners, ...o].forEach((i) => i(r));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((r) => r()),
            this._views.slice().forEach((r) => r.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(r) {
      return (
        this._destroyListeners.push(r), () => Kr(this._destroyListeners, r)
      );
    }
    destroy() {
      if (this._destroyed) throw new D(406, !1);
      let r = this._injector;
      r.destroy && !r.destroyed && r.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function Kr(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function Ay(e, t, n, r) {
  if (!n && !Vn(e)) return;
  $d(e, t, n && !r ? 0 : 1);
}
var Ls = class {
    constructor(t, n) {
      (this.ngModuleFactory = t), (this.componentFactories = n);
    }
  },
  Ma = (() => {
    let t = class t {
      compileModuleSync(r) {
        return new Os(r);
      }
      compileModuleAsync(r) {
        return Promise.resolve(this.compileModuleSync(r));
      }
      compileModuleAndAllComponentsSync(r) {
        let o = this.compileModuleSync(r),
          i = al(r),
          s = hd(i.declarations).reduce((a, c) => {
            let u = It(c);
            return u && a.push(new Hn(u)), a;
          }, []);
        return new Ls(o, s);
      }
      compileModuleAndAllComponentsAsync(r) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(r));
      }
      clearCache() {}
      clearCacheFor(r) {}
      getModuleId(r) {}
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })();
var Ry = (() => {
    let t = class t {
      constructor() {
        (this.zone = p(Y)),
          (this.changeDetectionScheduler = p(Un)),
          (this.applicationRef = p(Rt));
      }
      initialize() {
        this._onMicrotaskEmptySubscription ||
          (this._onMicrotaskEmptySubscription =
            this.zone.onMicrotaskEmpty.subscribe({
              next: () => {
                this.changeDetectionScheduler.runningTick ||
                  this.zone.run(() => {
                    this.applicationRef.tick();
                  });
              },
            }));
      }
      ngOnDestroy() {
        this._onMicrotaskEmptySubscription?.unsubscribe();
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Oy = new M("", { factory: () => !1 });
function uf({
  ngZoneFactory: e,
  ignoreChangesOutsideZone: t,
  scheduleInRootZone: n,
}) {
  return (
    (e ??= () => new Y(z(y({}, df()), { scheduleInRootZone: n }))),
    [
      { provide: Y, useFactory: e },
      {
        provide: on,
        multi: !0,
        useFactory: () => {
          let r = p(Ry, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: on,
        multi: !0,
        useFactory: () => {
          let r = p(ky);
          return () => {
            r.initialize();
          };
        },
      },
      t === !0 ? { provide: zd, useValue: !0 } : [],
      { provide: Gd, useValue: n ?? ed },
    ]
  );
}
function lf(e) {
  let t = e?.ignoreChangesOutsideZone,
    n = e?.scheduleInRootZone,
    r = uf({
      ngZoneFactory: () => {
        let o = df(e);
        return (
          (o.scheduleInRootZone = n),
          o.shouldCoalesceEventChangeDetection && Ea("NgZone_CoalesceEvent"),
          new Y(o)
        );
      },
      ignoreChangesOutsideZone: t,
      scheduleInRootZone: n,
    });
  return Mo([{ provide: Oy, useValue: !0 }, { provide: Ca, useValue: !1 }, r]);
}
function df(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var ky = (() => {
  let t = class t {
    constructor() {
      (this.subscription = new G()),
        (this.initialized = !1),
        (this.zone = p(Y)),
        (this.pendingTasks = p(pn));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let r = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (r = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              Y.assertNotInAngularZone(),
                queueMicrotask(() => {
                  r !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(r), (r = null));
                });
            }),
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            Y.assertInAngularZone(), (r ??= this.pendingTasks.add());
          }),
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
var Py = (() => {
  let t = class t {
    constructor() {
      (this.appRef = p(Rt)),
        (this.taskService = p(pn)),
        (this.ngZone = p(Y)),
        (this.zonelessEnabled = p(Ca)),
        (this.disableScheduling = p(zd, { optional: !0 }) ?? !1),
        (this.zoneIsDefined = typeof Zone < "u" && !!Zone.root.run),
        (this.schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }]),
        (this.subscriptions = new G()),
        (this.angularZoneId = this.zoneIsDefined
          ? this.ngZone._inner?.get(ho)
          : null),
        (this.scheduleInRootZone =
          !this.zonelessEnabled &&
          this.zoneIsDefined &&
          (p(Gd, { optional: !0 }) ?? !1)),
        (this.cancelScheduledCallback = null),
        (this.shouldRefreshViews = !1),
        (this.useMicrotaskScheduler = !1),
        (this.runningTick = !1),
        (this.pendingRenderTaskId = null),
        this.subscriptions.add(
          this.appRef.afterTick.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          }),
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled &&
          (this.ngZone instanceof Cs || !this.zoneIsDefined));
    }
    notify(r) {
      if (!this.zonelessEnabled && r === 5) return;
      switch (r) {
        case 3:
        case 2:
        case 0:
        case 4:
        case 5:
        case 1: {
          this.shouldRefreshViews = !0;
          break;
        }
        case 8:
        case 7:
        case 6:
        case 9:
        default:
      }
      if (!this.shouldScheduleTick()) return;
      let o = this.useMicrotaskScheduler ? Eu : nd;
      (this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() =>
              o(() => this.tick(this.shouldRefreshViews)),
            ))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              o(() => this.tick(this.shouldRefreshViews)),
            ));
    }
    shouldScheduleTick() {
      return !(
        this.disableScheduling ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled &&
          this.zoneIsDefined &&
          Zone.current.get(ho + this.angularZoneId))
      );
    }
    tick(r) {
      if (this.runningTick || this.appRef.destroyed) return;
      let o = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            (this.runningTick = !0), this.appRef._tick(r);
          },
          void 0,
          this.schedulerTickApplyArgs,
        );
      } catch (i) {
        throw (this.taskService.remove(o), i);
      } finally {
        this.cleanup();
      }
      (this.useMicrotaskScheduler = !0),
        Eu(() => {
          (this.useMicrotaskScheduler = !1), this.taskService.remove(o);
        });
    }
    ngOnDestroy() {
      this.subscriptions.unsubscribe(), this.cleanup();
    }
    cleanup() {
      if (
        ((this.shouldRefreshViews = !1),
        (this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let r = this.pendingRenderTaskId;
        (this.pendingRenderTaskId = null), this.taskService.remove(r);
      }
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
function Fy() {
  return (typeof $localize < "u" && $localize.locale) || Co;
}
var xa = new M("", {
  providedIn: "root",
  factory: () => p(xa, T.Optional | T.SkipSelf) || Fy(),
});
var ff = new M("");
function Wr(e) {
  return !!e.platformInjector;
}
function Ly(e) {
  let t = Wr(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get(Y);
  return n.run(() => {
    Wr(e)
      ? e.r3Injector.resolveInjectorInitializers()
      : e.moduleRef.resolveInjectorInitializers();
    let r = t.get(dt, null),
      o;
    if (
      (n.runOutsideAngular(() => {
        o = n.onError.subscribe({
          next: (i) => {
            r.handleError(i);
          },
        });
      }),
      Wr(e))
    ) {
      let i = () => t.destroy(),
        s = e.platformInjector.get(ff);
      s.add(i),
        t.onDestroy(() => {
          o.unsubscribe(), s.delete(i);
        });
    } else
      e.moduleRef.onDestroy(() => {
        Kr(e.allPlatformModules, e.moduleRef), o.unsubscribe();
      });
    return Ny(r, n, () => {
      let i = t.get(cf);
      return (
        i.runInitializers(),
        i.donePromise.then(() => {
          let s = t.get(xa, Co);
          if ((Dy(s || Co), Wr(e))) {
            let a = t.get(Rt);
            return (
              e.rootComponent !== void 0 && a.bootstrap(e.rootComponent), a
            );
          } else return jy(e.moduleRef, e.allPlatformModules), e.moduleRef;
        })
      );
    });
  });
}
function jy(e, t) {
  let n = e.injector.get(Rt);
  if (e._bootstrapComponents.length > 0)
    e._bootstrapComponents.forEach((r) => n.bootstrap(r));
  else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
  else throw new D(-403, !1);
  t.push(e);
}
var Jr = null;
function Vy(e = [], t) {
  return xt.create({
    name: t,
    providers: [
      { provide: xo, useValue: "platform" },
      { provide: ff, useValue: new Set([() => (Jr = null)]) },
      ...e,
    ],
  });
}
function $y(e = []) {
  if (Jr) return Jr;
  let t = Vy(e);
  return (Jr = t), xy(), By(t), t;
}
function By(e) {
  e.get(ua, null)?.forEach((n) => n());
}
var er = (() => {
  let t = class t {};
  t.__NG_ELEMENT_ID__ = Uy;
  let e = t;
  return e;
})();
function Uy(e) {
  return Hy(we(), H(), (e & 16) === 16);
}
function Hy(e, t, n) {
  if (_o(e) && !n) {
    let r = ht(e.index, t);
    return new _t(r, r);
  } else if (e.type & 175) {
    let r = t[$e];
    return new _t(r, t);
  }
  return null;
}
var js = class {
    constructor() {}
    supports(t) {
      return Zd(t);
    }
    create(t) {
      return new Vs(t);
    }
  },
  zy = (e, t) => t,
  Vs = class {
    constructor(t) {
      (this.length = 0),
        (this._linkedRecords = null),
        (this._unlinkedRecords = null),
        (this._previousItHead = null),
        (this._itHead = null),
        (this._itTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._movesHead = null),
        (this._movesTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null),
        (this._identityChangesHead = null),
        (this._identityChangesTail = null),
        (this._trackByFn = t || zy);
    }
    forEachItem(t) {
      let n;
      for (n = this._itHead; n !== null; n = n._next) t(n);
    }
    forEachOperation(t) {
      let n = this._itHead,
        r = this._removalsHead,
        o = 0,
        i = null;
      for (; n || r; ) {
        let s = !r || (n && n.currentIndex < Vu(r, o, i)) ? n : r,
          a = Vu(s, o, i),
          c = s.currentIndex;
        if (s === r) o--, (r = r._nextRemoved);
        else if (((n = n._next), s.previousIndex == null)) o++;
        else {
          i || (i = []);
          let u = a - o,
            l = c - o;
          if (u != l) {
            for (let h = 0; h < u; h++) {
              let f = h < i.length ? i[h] : (i[h] = 0),
                g = f + h;
              l <= g && g < u && (i[h] = f + 1);
            }
            let d = s.previousIndex;
            i[d] = l - u;
          }
        }
        a !== c && t(s, a, c);
      }
    }
    forEachPreviousItem(t) {
      let n;
      for (n = this._previousItHead; n !== null; n = n._nextPrevious) t(n);
    }
    forEachAddedItem(t) {
      let n;
      for (n = this._additionsHead; n !== null; n = n._nextAdded) t(n);
    }
    forEachMovedItem(t) {
      let n;
      for (n = this._movesHead; n !== null; n = n._nextMoved) t(n);
    }
    forEachRemovedItem(t) {
      let n;
      for (n = this._removalsHead; n !== null; n = n._nextRemoved) t(n);
    }
    forEachIdentityChange(t) {
      let n;
      for (n = this._identityChangesHead; n !== null; n = n._nextIdentityChange)
        t(n);
    }
    diff(t) {
      if ((t == null && (t = []), !Zd(t))) throw new D(900, !1);
      return this.check(t) ? this : null;
    }
    onDestroy() {}
    check(t) {
      this._reset();
      let n = this._itHead,
        r = !1,
        o,
        i,
        s;
      if (Array.isArray(t)) {
        this.length = t.length;
        for (let a = 0; a < this.length; a++)
          (i = t[a]),
            (s = this._trackByFn(a, i)),
            n === null || !Object.is(n.trackById, s)
              ? ((n = this._mismatch(n, i, s, a)), (r = !0))
              : (r && (n = this._verifyReinsertion(n, i, s, a)),
                Object.is(n.item, i) || this._addIdentityChange(n, i)),
            (n = n._next);
      } else
        (o = 0),
          $v(t, (a) => {
            (s = this._trackByFn(o, a)),
              n === null || !Object.is(n.trackById, s)
                ? ((n = this._mismatch(n, a, s, o)), (r = !0))
                : (r && (n = this._verifyReinsertion(n, a, s, o)),
                  Object.is(n.item, a) || this._addIdentityChange(n, a)),
              (n = n._next),
              o++;
          }),
          (this.length = o);
      return this._truncate(n), (this.collection = t), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let t;
        for (t = this._previousItHead = this._itHead; t !== null; t = t._next)
          t._nextPrevious = t._next;
        for (t = this._additionsHead; t !== null; t = t._nextAdded)
          t.previousIndex = t.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, t = this._movesHead;
          t !== null;
          t = t._nextMoved
        )
          t.previousIndex = t.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(t, n, r, o) {
      let i;
      return (
        t === null ? (i = this._itTail) : ((i = t._prev), this._remove(t)),
        (t =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(r, null)),
        t !== null
          ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
            this._reinsertAfter(t, i, o))
          : ((t =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(r, o)),
            t !== null
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._moveAfter(t, i, o))
              : (t = this._addAfter(new $s(n, r), i, o))),
        t
      );
    }
    _verifyReinsertion(t, n, r, o) {
      let i =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(r, null);
      return (
        i !== null
          ? (t = this._reinsertAfter(i, t._prev, o))
          : t.currentIndex != o &&
            ((t.currentIndex = o), this._addToMoves(t, o)),
        t
      );
    }
    _truncate(t) {
      for (; t !== null; ) {
        let n = t._next;
        this._addToRemovals(this._unlink(t)), (t = n);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(t, n, r) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(t);
      let o = t._prevRemoved,
        i = t._nextRemoved;
      return (
        o === null ? (this._removalsHead = i) : (o._nextRemoved = i),
        i === null ? (this._removalsTail = o) : (i._prevRemoved = o),
        this._insertAfter(t, n, r),
        this._addToMoves(t, r),
        t
      );
    }
    _moveAfter(t, n, r) {
      return (
        this._unlink(t), this._insertAfter(t, n, r), this._addToMoves(t, r), t
      );
    }
    _addAfter(t, n, r) {
      return (
        this._insertAfter(t, n, r),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = t)
          : (this._additionsTail = this._additionsTail._nextAdded = t),
        t
      );
    }
    _insertAfter(t, n, r) {
      let o = n === null ? this._itHead : n._next;
      return (
        (t._next = o),
        (t._prev = n),
        o === null ? (this._itTail = t) : (o._prev = t),
        n === null ? (this._itHead = t) : (n._next = t),
        this._linkedRecords === null && (this._linkedRecords = new Eo()),
        this._linkedRecords.put(t),
        (t.currentIndex = r),
        t
      );
    }
    _remove(t) {
      return this._addToRemovals(this._unlink(t));
    }
    _unlink(t) {
      this._linkedRecords !== null && this._linkedRecords.remove(t);
      let n = t._prev,
        r = t._next;
      return (
        n === null ? (this._itHead = r) : (n._next = r),
        r === null ? (this._itTail = n) : (r._prev = n),
        t
      );
    }
    _addToMoves(t, n) {
      return (
        t.previousIndex === n ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = t)
            : (this._movesTail = this._movesTail._nextMoved = t)),
        t
      );
    }
    _addToRemovals(t) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new Eo()),
        this._unlinkedRecords.put(t),
        (t.currentIndex = null),
        (t._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = t),
            (t._prevRemoved = null))
          : ((t._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = t)),
        t
      );
    }
    _addIdentityChange(t, n) {
      return (
        (t.item = n),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = t)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                t),
        t
      );
    }
  },
  $s = class {
    constructor(t, n) {
      (this.item = t),
        (this.trackById = n),
        (this.currentIndex = null),
        (this.previousIndex = null),
        (this._nextPrevious = null),
        (this._prev = null),
        (this._next = null),
        (this._prevDup = null),
        (this._nextDup = null),
        (this._prevRemoved = null),
        (this._nextRemoved = null),
        (this._nextAdded = null),
        (this._nextMoved = null),
        (this._nextIdentityChange = null);
    }
  },
  Bs = class {
    constructor() {
      (this._head = null), (this._tail = null);
    }
    add(t) {
      this._head === null
        ? ((this._head = this._tail = t),
          (t._nextDup = null),
          (t._prevDup = null))
        : ((this._tail._nextDup = t),
          (t._prevDup = this._tail),
          (t._nextDup = null),
          (this._tail = t));
    }
    get(t, n) {
      let r;
      for (r = this._head; r !== null; r = r._nextDup)
        if ((n === null || n <= r.currentIndex) && Object.is(r.trackById, t))
          return r;
      return null;
    }
    remove(t) {
      let n = t._prevDup,
        r = t._nextDup;
      return (
        n === null ? (this._head = r) : (n._nextDup = r),
        r === null ? (this._tail = n) : (r._prevDup = n),
        this._head === null
      );
    }
  },
  Eo = class {
    constructor() {
      this.map = new Map();
    }
    put(t) {
      let n = t.trackById,
        r = this.map.get(n);
      r || ((r = new Bs()), this.map.set(n, r)), r.add(t);
    }
    get(t, n) {
      let r = t,
        o = this.map.get(r);
      return o ? o.get(t, n) : null;
    }
    remove(t) {
      let n = t.trackById;
      return this.map.get(n).remove(t) && this.map.delete(n), t;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function Vu(e, t, n) {
  let r = e.previousIndex;
  if (r === null) return r;
  let o = 0;
  return n && r < n.length && (o = n[r]), r + t + o;
}
function $u() {
  return new Ta([new js()]);
}
var Ta = (() => {
  let t = class t {
    constructor(r) {
      this.factories = r;
    }
    static create(r, o) {
      if (o != null) {
        let i = o.factories.slice();
        r = r.concat(i);
      }
      return new t(r);
    }
    static extend(r) {
      return {
        provide: t,
        useFactory: (o) => t.create(r, o || $u()),
        deps: [[t, new Ju(), new zs()]],
      };
    }
    find(r) {
      let o = this.factories.find((i) => i.supports(r));
      if (o != null) return o;
      throw new D(901, !1);
    }
  };
  t.ɵprov = w({ token: t, providedIn: "root", factory: $u });
  let e = t;
  return e;
})();
function hf(e) {
  try {
    let { rootComponent: t, appProviders: n, platformProviders: r } = e,
      o = $y(r),
      i = [uf({}), { provide: Un, useExisting: Py }, ...(n || [])],
      s = new Do({
        providers: i,
        parent: o,
        debugName: "",
        runEnvironmentInitializers: !1,
      });
    return Ly({
      r3Injector: s.injector,
      platformInjector: o,
      rootComponent: t,
    });
  } catch (t) {
    return Promise.reject(t);
  }
}
var pf = new M("");
var If = null;
function vn() {
  return If;
}
function bf(e) {
  If ??= e;
}
var Bo = class {};
var fe = new M(""),
  Sf = (() => {
    let t = class t {
      historyGo(r) {
        throw new Error("");
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = w({ token: t, factory: () => p(Zy), providedIn: "platform" }));
    let e = t;
    return e;
  })();
var Zy = (() => {
  let t = class t extends Sf {
    constructor() {
      super(),
        (this._doc = p(fe)),
        (this._location = window.location),
        (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return vn().getBaseHref(this._doc);
    }
    onPopState(r) {
      let o = vn().getGlobalEventTarget(this._doc, "window");
      return (
        o.addEventListener("popstate", r, !1),
        () => o.removeEventListener("popstate", r)
      );
    }
    onHashChange(r) {
      let o = vn().getGlobalEventTarget(this._doc, "window");
      return (
        o.addEventListener("hashchange", r, !1),
        () => o.removeEventListener("hashchange", r)
      );
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(r) {
      this._location.pathname = r;
    }
    pushState(r, o, i) {
      this._history.pushState(r, o, i);
    }
    replaceState(r, o, i) {
      this._history.replaceState(r, o, i);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(r = 0) {
      this._history.go(r);
    }
    getState() {
      return this._history.state;
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = w({ token: t, factory: () => new t(), providedIn: "platform" }));
  let e = t;
  return e;
})();
function Mf(e, t) {
  if (e.length == 0) return t;
  if (t.length == 0) return e;
  let n = 0;
  return (
    e.endsWith("/") && n++,
    t.startsWith("/") && n++,
    n == 2 ? e + t.substring(1) : n == 1 ? e + t : e + "/" + t
  );
}
function gf(e) {
  let t = e.match(/#|\?|$/),
    n = (t && t.index) || e.length,
    r = n - (e[n - 1] === "/" ? 1 : 0);
  return e.slice(0, r) + e.slice(n);
}
function Ot(e) {
  return e && e[0] !== "?" ? "?" + e : e;
}
var Ho = (() => {
    let t = class t {
      historyGo(r) {
        throw new Error("");
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = w({ token: t, factory: () => p(xf), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Qy = new M(""),
  xf = (() => {
    let t = class t extends Ho {
      constructor(r, o) {
        super(),
          (this._platformLocation = r),
          (this._removeListenerFns = []),
          (this._baseHref =
            o ??
            this._platformLocation.getBaseHrefFromDOM() ??
            p(fe).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(r) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(r),
          this._platformLocation.onHashChange(r),
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(r) {
        return Mf(this._baseHref, r);
      }
      path(r = !1) {
        let o =
            this._platformLocation.pathname + Ot(this._platformLocation.search),
          i = this._platformLocation.hash;
        return i && r ? `${o}${i}` : o;
      }
      pushState(r, o, i, s) {
        let a = this.prepareExternalUrl(i + Ot(s));
        this._platformLocation.pushState(r, o, a);
      }
      replaceState(r, o, i, s) {
        let a = this.prepareExternalUrl(i + Ot(s));
        this._platformLocation.replaceState(r, o, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(r = 0) {
        this._platformLocation.historyGo?.(r);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(_(Sf), _(Qy, 8));
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })();
var tr = (() => {
  let t = class t {
    constructor(r) {
      (this._subject = new ie()),
        (this._urlChangeListeners = []),
        (this._urlChangeSubscription = null),
        (this._locationStrategy = r);
      let o = this._locationStrategy.getBaseHref();
      (this._basePath = Jy(gf(mf(o)))),
        this._locationStrategy.onPopState((i) => {
          this._subject.emit({
            url: this.path(!0),
            pop: !0,
            state: i.state,
            type: i.type,
          });
        });
    }
    ngOnDestroy() {
      this._urlChangeSubscription?.unsubscribe(),
        (this._urlChangeListeners = []);
    }
    path(r = !1) {
      return this.normalize(this._locationStrategy.path(r));
    }
    getState() {
      return this._locationStrategy.getState();
    }
    isCurrentPathEqualTo(r, o = "") {
      return this.path() == this.normalize(r + Ot(o));
    }
    normalize(r) {
      return t.stripTrailingSlash(Ky(this._basePath, mf(r)));
    }
    prepareExternalUrl(r) {
      return (
        r && r[0] !== "/" && (r = "/" + r),
        this._locationStrategy.prepareExternalUrl(r)
      );
    }
    go(r, o = "", i = null) {
      this._locationStrategy.pushState(i, "", r, o),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(r + Ot(o)), i);
    }
    replaceState(r, o = "", i = null) {
      this._locationStrategy.replaceState(i, "", r, o),
        this._notifyUrlChangeListeners(this.prepareExternalUrl(r + Ot(o)), i);
    }
    forward() {
      this._locationStrategy.forward();
    }
    back() {
      this._locationStrategy.back();
    }
    historyGo(r = 0) {
      this._locationStrategy.historyGo?.(r);
    }
    onUrlChange(r) {
      return (
        this._urlChangeListeners.push(r),
        (this._urlChangeSubscription ??= this.subscribe((o) => {
          this._notifyUrlChangeListeners(o.url, o.state);
        })),
        () => {
          let o = this._urlChangeListeners.indexOf(r);
          this._urlChangeListeners.splice(o, 1),
            this._urlChangeListeners.length === 0 &&
              (this._urlChangeSubscription?.unsubscribe(),
              (this._urlChangeSubscription = null));
        }
      );
    }
    _notifyUrlChangeListeners(r = "", o) {
      this._urlChangeListeners.forEach((i) => i(r, o));
    }
    subscribe(r, o, i) {
      return this._subject.subscribe({ next: r, error: o, complete: i });
    }
  };
  (t.normalizeQueryParams = Ot),
    (t.joinWithSlash = Mf),
    (t.stripTrailingSlash = gf),
    (t.ɵfac = function (o) {
      return new (o || t)(_(Ho));
    }),
    (t.ɵprov = w({ token: t, factory: () => Yy(), providedIn: "root" }));
  let e = t;
  return e;
})();
function Yy() {
  return new tr(_(Ho));
}
function Ky(e, t) {
  if (!e || !t.startsWith(e)) return t;
  let n = t.substring(e.length);
  return n === "" || ["/", ";", "?", "#"].includes(n[0]) ? n : t;
}
function mf(e) {
  return e.replace(/\/index.html$/, "");
}
function Jy(e) {
  if (new RegExp("^(https?:)?//").test(e)) {
    let [, n] = e.split(/\/\/[^\/]+/);
    return n;
  }
  return e;
}
function Tf(e, t) {
  t = encodeURIComponent(t);
  for (let n of e.split(";")) {
    let r = n.indexOf("="),
      [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (o.trim() === t) return decodeURIComponent(i);
  }
  return null;
}
var Na = /\s+/,
  vf = [],
  zo = (() => {
    let t = class t {
      constructor(r, o) {
        (this._ngEl = r),
          (this._renderer = o),
          (this.initialClasses = vf),
          (this.stateMap = new Map());
      }
      set klass(r) {
        this.initialClasses = r != null ? r.trim().split(Na) : vf;
      }
      set ngClass(r) {
        this.rawClass = typeof r == "string" ? r.trim().split(Na) : r;
      }
      ngDoCheck() {
        for (let o of this.initialClasses) this._updateState(o, !0);
        let r = this.rawClass;
        if (Array.isArray(r) || r instanceof Set)
          for (let o of r) this._updateState(o, !0);
        else if (r != null)
          for (let o of Object.keys(r)) this._updateState(o, !!r[o]);
        this._applyStateDiff();
      }
      _updateState(r, o) {
        let i = this.stateMap.get(r);
        i !== void 0
          ? (i.enabled !== o && ((i.changed = !0), (i.enabled = o)),
            (i.touched = !0))
          : this.stateMap.set(r, { enabled: o, changed: !0, touched: !0 });
      }
      _applyStateDiff() {
        for (let r of this.stateMap) {
          let o = r[0],
            i = r[1];
          i.changed
            ? (this._toggleClass(o, i.enabled), (i.changed = !1))
            : i.touched ||
              (i.enabled && this._toggleClass(o, !1), this.stateMap.delete(o)),
            (i.touched = !1);
        }
      }
      _toggleClass(r, o) {
        (r = r.trim()),
          r.length > 0 &&
            r.split(Na).forEach((i) => {
              o
                ? this._renderer.addClass(this._ngEl.nativeElement, i)
                : this._renderer.removeClass(this._ngEl.nativeElement, i);
            });
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(He(Kn), He(Vo));
    }),
      (t.ɵdir = hn({
        type: t,
        selectors: [["", "ngClass", ""]],
        inputs: { klass: [0, "class", "klass"], ngClass: "ngClass" },
        standalone: !0,
      }));
    let e = t;
    return e;
  })();
var Aa = class {
    constructor(t, n, r, o) {
      (this.$implicit = t),
        (this.ngForOf = n),
        (this.index = r),
        (this.count = o);
    }
    get first() {
      return this.index === 0;
    }
    get last() {
      return this.index === this.count - 1;
    }
    get even() {
      return this.index % 2 === 0;
    }
    get odd() {
      return !this.even;
    }
  },
  yn = (() => {
    let t = class t {
      set ngForOf(r) {
        (this._ngForOf = r), (this._ngForOfDirty = !0);
      }
      set ngForTrackBy(r) {
        this._trackByFn = r;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      constructor(r, o, i) {
        (this._viewContainer = r),
          (this._template = o),
          (this._differs = i),
          (this._ngForOf = null),
          (this._ngForOfDirty = !0),
          (this._differ = null);
      }
      set ngForTemplate(r) {
        r && (this._template = r);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let r = this._ngForOf;
          if (!this._differ && r)
            if (0)
              try {
              } catch {}
            else this._differ = this._differs.find(r).create(this.ngForTrackBy);
        }
        if (this._differ) {
          let r = this._differ.diff(this._ngForOf);
          r && this._applyChanges(r);
        }
      }
      _applyChanges(r) {
        let o = this._viewContainer;
        r.forEachOperation((i, s, a) => {
          if (i.previousIndex == null)
            o.createEmbeddedView(
              this._template,
              new Aa(i.item, this._ngForOf, -1, -1),
              a === null ? void 0 : a,
            );
          else if (a == null) o.remove(s === null ? void 0 : s);
          else if (s !== null) {
            let c = o.get(s);
            o.move(c, a), yf(c, i);
          }
        });
        for (let i = 0, s = o.length; i < s; i++) {
          let c = o.get(i).context;
          (c.index = i), (c.count = s), (c.ngForOf = this._ngForOf);
        }
        r.forEachIdentityChange((i) => {
          let s = o.get(i.currentIndex);
          yf(s, i);
        });
      }
      static ngTemplateContextGuard(r, o) {
        return !0;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(He(mn), He(jo), He(Ta));
    }),
      (t.ɵdir = hn({
        type: t,
        selectors: [["", "ngFor", "", "ngForOf", ""]],
        inputs: {
          ngForOf: "ngForOf",
          ngForTrackBy: "ngForTrackBy",
          ngForTemplate: "ngForTemplate",
        },
        standalone: !0,
      }));
    let e = t;
    return e;
  })();
function yf(e, t) {
  e.context.$implicit = t.item;
}
var Go = (() => {
    let t = class t {
      constructor(r, o) {
        (this._viewContainer = r),
          (this._context = new Ra()),
          (this._thenTemplateRef = null),
          (this._elseTemplateRef = null),
          (this._thenViewRef = null),
          (this._elseViewRef = null),
          (this._thenTemplateRef = o);
      }
      set ngIf(r) {
        (this._context.$implicit = this._context.ngIf = r), this._updateView();
      }
      set ngIfThen(r) {
        Df("ngIfThen", r),
          (this._thenTemplateRef = r),
          (this._thenViewRef = null),
          this._updateView();
      }
      set ngIfElse(r) {
        Df("ngIfElse", r),
          (this._elseTemplateRef = r),
          (this._elseViewRef = null),
          this._updateView();
      }
      _updateView() {
        this._context.$implicit
          ? this._thenViewRef ||
            (this._viewContainer.clear(),
            (this._elseViewRef = null),
            this._thenTemplateRef &&
              (this._thenViewRef = this._viewContainer.createEmbeddedView(
                this._thenTemplateRef,
                this._context,
              )))
          : this._elseViewRef ||
            (this._viewContainer.clear(),
            (this._thenViewRef = null),
            this._elseTemplateRef &&
              (this._elseViewRef = this._viewContainer.createEmbeddedView(
                this._elseTemplateRef,
                this._context,
              )));
      }
      static ngTemplateContextGuard(r, o) {
        return !0;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(He(mn), He(jo));
    }),
      (t.ɵdir = hn({
        type: t,
        selectors: [["", "ngIf", ""]],
        inputs: { ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse" },
        standalone: !0,
      }));
    let e = t;
    return e;
  })(),
  Ra = class {
    constructor() {
      (this.$implicit = null), (this.ngIf = null);
    }
  };
function Df(e, t) {
  if (!!!(!t || t.createEmbeddedView))
    throw new Error(`${e} must be a TemplateRef, but received '${ce(t)}'.`);
}
var _f = "browser",
  Xy = "server";
function Oa(e) {
  return e === Xy;
}
var Uo = class {};
var Fa = class extends Bo {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  La = class e extends Fa {
    static makeCurrent() {
      bf(new e());
    }
    onAndCancel(t, n, r) {
      return (
        t.addEventListener(n, r),
        () => {
          t.removeEventListener(n, r);
        }
      );
    }
    dispatchEvent(t, n) {
      t.dispatchEvent(n);
    }
    remove(t) {
      t.remove();
    }
    createElement(t, n) {
      return (n = n || this.getDefaultDocument()), n.createElement(t);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(t) {
      return t.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(t) {
      return t instanceof DocumentFragment;
    }
    getGlobalEventTarget(t, n) {
      return n === "window"
        ? window
        : n === "document"
          ? t
          : n === "body"
            ? t.body
            : null;
    }
    getBaseHref(t) {
      let n = eD();
      return n == null ? null : tD(n);
    }
    resetBaseElement() {
      nr = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(t) {
      return Tf(document.cookie, t);
    }
  },
  nr = null;
function eD() {
  return (
    (nr = nr || document.querySelector("base")),
    nr ? nr.getAttribute("href") : null
  );
}
function tD(e) {
  return new URL(e, document.baseURI).pathname;
}
var nD = (() => {
    let t = class t {
      build() {
        return new XMLHttpRequest();
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  qo = new M(""),
  Of = (() => {
    let t = class t {
      constructor(r, o) {
        (this._zone = o),
          (this._eventNameToPlugin = new Map()),
          r.forEach((i) => {
            i.manager = this;
          }),
          (this._plugins = r.slice().reverse());
      }
      addEventListener(r, o, i) {
        return this._findPluginFor(o).addEventListener(r, o, i);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(r) {
        let o = this._eventNameToPlugin.get(r);
        if (o) return o;
        if (((o = this._plugins.find((s) => s.supports(r))), !o))
          throw new D(5101, !1);
        return this._eventNameToPlugin.set(r, o), o;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(_(qo), _(Y));
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  rr = class {
    constructor(t) {
      this._doc = t;
    }
  },
  ka = "ng-app-id",
  kf = (() => {
    let t = class t {
      constructor(r, o, i, s = {}) {
        (this.doc = r),
          (this.appId = o),
          (this.nonce = i),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = Oa(s)),
          this.resetHostNodes();
      }
      addStyles(r) {
        for (let o of r)
          this.changeUsageCount(o, 1) === 1 && this.onStyleAdded(o);
      }
      removeStyles(r) {
        for (let o of r)
          this.changeUsageCount(o, -1) <= 0 && this.onStyleRemoved(o);
      }
      ngOnDestroy() {
        let r = this.styleNodesInDOM;
        r && (r.forEach((o) => o.remove()), r.clear());
        for (let o of this.getAllStyles()) this.onStyleRemoved(o);
        this.resetHostNodes();
      }
      addHost(r) {
        this.hostNodes.add(r);
        for (let o of this.getAllStyles()) this.addStyleToHost(r, o);
      }
      removeHost(r) {
        this.hostNodes.delete(r);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(r) {
        for (let o of this.hostNodes) this.addStyleToHost(o, r);
      }
      onStyleRemoved(r) {
        let o = this.styleRef;
        o.get(r)?.elements?.forEach((i) => i.remove()), o.delete(r);
      }
      collectServerRenderedStyles() {
        let r = this.doc.head?.querySelectorAll(`style[${ka}="${this.appId}"]`);
        if (r?.length) {
          let o = new Map();
          return (
            r.forEach((i) => {
              i.textContent != null && o.set(i.textContent, i);
            }),
            o
          );
        }
        return null;
      }
      changeUsageCount(r, o) {
        let i = this.styleRef;
        if (i.has(r)) {
          let s = i.get(r);
          return (s.usage += o), s.usage;
        }
        return i.set(r, { usage: o, elements: [] }), o;
      }
      getStyleElement(r, o) {
        let i = this.styleNodesInDOM,
          s = i?.get(o);
        if (s?.parentNode === r) return i.delete(o), s.removeAttribute(ka), s;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = o),
            this.platformIsServer && a.setAttribute(ka, this.appId),
            r.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(r, o) {
        let i = this.getStyleElement(r, o),
          s = this.styleRef,
          a = s.get(o)?.elements;
        a ? a.push(i) : s.set(o, { elements: [i], usage: 1 });
      }
      resetHostNodes() {
        let r = this.hostNodes;
        r.clear(), r.add(this.doc.head);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(_(fe), _(ca), _(la, 8), _(gn));
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  Pa = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/Math/MathML",
  },
  Va = /%COMP%/g,
  Pf = "%COMP%",
  rD = `_nghost-${Pf}`,
  oD = `_ngcontent-${Pf}`,
  iD = !0,
  sD = new M("", { providedIn: "root", factory: () => iD });
function aD(e) {
  return oD.replace(Va, e);
}
function cD(e) {
  return rD.replace(Va, e);
}
function Ff(e, t) {
  return t.map((n) => n.replace(Va, e));
}
var Nf = (() => {
    let t = class t {
      constructor(r, o, i, s, a, c, u, l = null) {
        (this.eventManager = r),
          (this.sharedStylesHost = o),
          (this.appId = i),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = c),
          (this.ngZone = u),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = Oa(c)),
          (this.defaultRenderer = new or(r, a, u, this.platformIsServer));
      }
      createRenderer(r, o) {
        if (!r || !o) return this.defaultRenderer;
        this.platformIsServer &&
          o.encapsulation === je.ShadowDom &&
          (o = z(y({}, o), { encapsulation: je.Emulated }));
        let i = this.getOrCreateRenderer(r, o);
        return (
          i instanceof Wo
            ? i.applyToHost(r)
            : i instanceof ir && i.applyStyles(),
          i
        );
      }
      getOrCreateRenderer(r, o) {
        let i = this.rendererByCompId,
          s = i.get(o.id);
        if (!s) {
          let a = this.doc,
            c = this.ngZone,
            u = this.eventManager,
            l = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            h = this.platformIsServer;
          switch (o.encapsulation) {
            case je.Emulated:
              s = new Wo(u, l, o, this.appId, d, a, c, h);
              break;
            case je.ShadowDom:
              return new ja(u, l, r, o, a, c, this.nonce, h);
            default:
              s = new ir(u, l, o, d, a, c, h);
              break;
          }
          i.set(o.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(
        _(Of),
        _(kf),
        _(ca),
        _(sD),
        _(fe),
        _(gn),
        _(Y),
        _(la),
      );
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  or = class {
    constructor(t, n, r, o) {
      (this.eventManager = t),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = o),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(t, n) {
      return n
        ? this.doc.createElementNS(Pa[n] || n, t)
        : this.doc.createElement(t);
    }
    createComment(t) {
      return this.doc.createComment(t);
    }
    createText(t) {
      return this.doc.createTextNode(t);
    }
    appendChild(t, n) {
      (Af(t) ? t.content : t).appendChild(n);
    }
    insertBefore(t, n, r) {
      t && (Af(t) ? t.content : t).insertBefore(n, r);
    }
    removeChild(t, n) {
      n.remove();
    }
    selectRootElement(t, n) {
      let r = typeof t == "string" ? this.doc.querySelector(t) : t;
      if (!r) throw new D(-5104, !1);
      return n || (r.textContent = ""), r;
    }
    parentNode(t) {
      return t.parentNode;
    }
    nextSibling(t) {
      return t.nextSibling;
    }
    setAttribute(t, n, r, o) {
      if (o) {
        n = o + ":" + n;
        let i = Pa[o];
        i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
      } else t.setAttribute(n, r);
    }
    removeAttribute(t, n, r) {
      if (r) {
        let o = Pa[r];
        o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
      } else t.removeAttribute(n);
    }
    addClass(t, n) {
      t.classList.add(n);
    }
    removeClass(t, n) {
      t.classList.remove(n);
    }
    setStyle(t, n, r, o) {
      o & (Ke.DashCase | Ke.Important)
        ? t.style.setProperty(n, r, o & Ke.Important ? "important" : "")
        : (t.style[n] = r);
    }
    removeStyle(t, n, r) {
      r & Ke.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
    }
    setProperty(t, n, r) {
      t != null && (t[n] = r);
    }
    setValue(t, n) {
      t.nodeValue = n;
    }
    listen(t, n, r) {
      if (
        typeof t == "string" &&
        ((t = vn().getGlobalEventTarget(this.doc, t)), !t)
      )
        throw new Error(`Unsupported event target ${t} for event ${n}`);
      return this.eventManager.addEventListener(
        t,
        n,
        this.decoratePreventDefault(r),
      );
    }
    decoratePreventDefault(t) {
      return (n) => {
        if (n === "__ngUnwrap__") return t;
        (this.platformIsServer ? this.ngZone.runGuarded(() => t(n)) : t(n)) ===
          !1 && n.preventDefault();
      };
    }
  };
function Af(e) {
  return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var ja = class extends or {
    constructor(t, n, r, o, i, s, a, c) {
      super(t, i, s, c),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let u = Ff(o.id, o.styles);
      for (let l of u) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
          (d.textContent = l),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(t) {
      return t === this.hostEl ? this.shadowRoot : t;
    }
    appendChild(t, n) {
      return super.appendChild(this.nodeOrShadowRoot(t), n);
    }
    insertBefore(t, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
    }
    removeChild(t, n) {
      return super.removeChild(null, n);
    }
    parentNode(t) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  ir = class extends or {
    constructor(t, n, r, o, i, s, a, c) {
      super(t, i, s, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = o),
        (this.styles = c ? Ff(c, r.styles) : r.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  Wo = class extends ir {
    constructor(t, n, r, o, i, s, a, c) {
      let u = o + "-" + r.id;
      super(t, n, r, i, s, a, c, u),
        (this.contentAttr = aD(u)),
        (this.hostAttr = cD(u));
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
    }
    createElement(t, n) {
      let r = super.createElement(t, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  },
  uD = (() => {
    let t = class t extends rr {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return !0;
      }
      addEventListener(r, o, i) {
        return (
          r.addEventListener(o, i, !1), () => this.removeEventListener(r, o, i)
        );
      }
      removeEventListener(r, o, i) {
        return r.removeEventListener(o, i);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(_(fe));
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  lD = (() => {
    let t = class t extends rr {
      constructor(r) {
        super(r), (this.delegate = p(pf, { optional: !0 }));
      }
      supports(r) {
        return this.delegate ? this.delegate.supports(r) : !1;
      }
      addEventListener(r, o, i) {
        return this.delegate.addEventListener(r, o, i);
      }
      removeEventListener(r, o, i) {
        return this.delegate.removeEventListener(r, o, i);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(_(fe));
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })(),
  Rf = ["alt", "control", "meta", "shift"],
  dD = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  fD = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  hD = (() => {
    let t = class t extends rr {
      constructor(r) {
        super(r);
      }
      supports(r) {
        return t.parseEventName(r) != null;
      }
      addEventListener(r, o, i) {
        let s = t.parseEventName(o),
          a = t.eventCallback(s.fullKey, i, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => vn().onAndCancel(r, s.domEventName, a));
      }
      static parseEventName(r) {
        let o = r.toLowerCase().split("."),
          i = o.shift();
        if (o.length === 0 || !(i === "keydown" || i === "keyup")) return null;
        let s = t._normalizeKey(o.pop()),
          a = "",
          c = o.indexOf("code");
        if (
          (c > -1 && (o.splice(c, 1), (a = "code.")),
          Rf.forEach((l) => {
            let d = o.indexOf(l);
            d > -1 && (o.splice(d, 1), (a += l + "."));
          }),
          (a += s),
          o.length != 0 || s.length === 0)
        )
          return null;
        let u = {};
        return (u.domEventName = i), (u.fullKey = a), u;
      }
      static matchEventFullKeyCode(r, o) {
        let i = dD[r.key] || r.key,
          s = "";
        return (
          o.indexOf("code.") > -1 && ((i = r.code), (s = "code.")),
          i == null || !i
            ? !1
            : ((i = i.toLowerCase()),
              i === " " ? (i = "space") : i === "." && (i = "dot"),
              Rf.forEach((a) => {
                if (a !== i) {
                  let c = fD[a];
                  c(r) && (s += a + ".");
                }
              }),
              (s += i),
              s === o)
        );
      }
      static eventCallback(r, o, i) {
        return (s) => {
          t.matchEventFullKeyCode(s, r) && i.runGuarded(() => o(s));
        };
      }
      static _normalizeKey(r) {
        return r === "esc" ? "escape" : r;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(_(fe));
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac }));
    let e = t;
    return e;
  })();
function Lf(e, t) {
  return hf(y({ rootComponent: e }, pD(t)));
}
function pD(e) {
  return {
    appProviders: [...DD, ...(e?.providers ?? [])],
    platformProviders: yD,
  };
}
function gD() {
  La.makeCurrent();
}
function mD() {
  return new dt();
}
function vD() {
  return ud(document), document;
}
var yD = [
  { provide: gn, useValue: _f },
  { provide: ua, useValue: gD, multi: !0 },
  { provide: fe, useFactory: vD, deps: [] },
];
var DD = [
  { provide: xo, useValue: "root" },
  { provide: dt, useFactory: mD, deps: [] },
  { provide: qo, useClass: uD, multi: !0, deps: [fe, Y, gn] },
  { provide: qo, useClass: hD, multi: !0, deps: [fe] },
  { provide: qo, useClass: lD, multi: !0 },
  Nf,
  kf,
  Of,
  { provide: ln, useExisting: Nf },
  { provide: Uo, useClass: nD, deps: [] },
  [],
];
var jf = (() => {
  let t = class t {
    constructor(r) {
      this._doc = r;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(r) {
      this._doc.title = r || "";
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)(_(fe));
  }),
    (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: "root" }));
  let e = t;
  return e;
})();
var x = "primary",
  Er = Symbol("RouteTitle"),
  za = class {
    constructor(t) {
      this.params = t || {};
    }
    has(t) {
      return Object.prototype.hasOwnProperty.call(this.params, t);
    }
    get(t) {
      if (this.has(t)) {
        let n = this.params[t];
        return Array.isArray(n) ? n[0] : n;
      }
      return null;
    }
    getAll(t) {
      if (this.has(t)) {
        let n = this.params[t];
        return Array.isArray(n) ? n : [n];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function bn(e) {
  return new za(e);
}
function CD(e, t, n) {
  let r = n.path.split("/");
  if (
    r.length > e.length ||
    (n.pathMatch === "full" && (t.hasChildren() || r.length < e.length))
  )
    return null;
  let o = {};
  for (let i = 0; i < r.length; i++) {
    let s = r[i],
      a = e[i];
    if (s[0] === ":") o[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: e.slice(0, r.length), posParams: o };
}
function ED(e, t) {
  if (e.length !== t.length) return !1;
  for (let n = 0; n < e.length; ++n) if (!Ge(e[n], t[n])) return !1;
  return !0;
}
function Ge(e, t) {
  let n = e ? Ga(e) : void 0,
    r = t ? Ga(t) : void 0;
  if (!n || !r || n.length != r.length) return !1;
  let o;
  for (let i = 0; i < n.length; i++)
    if (((o = n[i]), !qf(e[o], t[o]))) return !1;
  return !0;
}
function Ga(e) {
  return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)];
}
function qf(e, t) {
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length) return !1;
    let n = [...e].sort(),
      r = [...t].sort();
    return n.every((o, i) => r[i] === o);
  } else return e === t;
}
function Wf(e) {
  return e.length > 0 ? e[e.length - 1] : null;
}
function vt(e) {
  return ji(e) ? e : Xn(e) ? Z(Promise.resolve(e)) : b(e);
}
var ID = { exact: Qf, subset: Yf },
  Zf = { exact: bD, subset: SD, ignored: () => !0 };
function Vf(e, t, n) {
  return (
    ID[n.paths](e.root, t.root, n.matrixParams) &&
    Zf[n.queryParams](e.queryParams, t.queryParams) &&
    !(n.fragment === "exact" && e.fragment !== t.fragment)
  );
}
function bD(e, t) {
  return Ge(e, t);
}
function Qf(e, t, n) {
  if (
    !Pt(e.segments, t.segments) ||
    !Yo(e.segments, t.segments, n) ||
    e.numberOfChildren !== t.numberOfChildren
  )
    return !1;
  for (let r in t.children)
    if (!e.children[r] || !Qf(e.children[r], t.children[r], n)) return !1;
  return !0;
}
function SD(e, t) {
  return (
    Object.keys(t).length <= Object.keys(e).length &&
    Object.keys(t).every((n) => qf(e[n], t[n]))
  );
}
function Yf(e, t, n) {
  return Kf(e, t, t.segments, n);
}
function Kf(e, t, n, r) {
  if (e.segments.length > n.length) {
    let o = e.segments.slice(0, n.length);
    return !(!Pt(o, n) || t.hasChildren() || !Yo(o, n, r));
  } else if (e.segments.length === n.length) {
    if (!Pt(e.segments, n) || !Yo(e.segments, n, r)) return !1;
    for (let o in t.children)
      if (!e.children[o] || !Yf(e.children[o], t.children[o], r)) return !1;
    return !0;
  } else {
    let o = n.slice(0, e.segments.length),
      i = n.slice(e.segments.length);
    return !Pt(e.segments, o) || !Yo(e.segments, o, r) || !e.children[x]
      ? !1
      : Kf(e.children[x], t, i, r);
  }
}
function Yo(e, t, n) {
  return t.every((r, o) => Zf[n](e[o].parameters, r.parameters));
}
var nt = class {
    constructor(t = new L([], {}), n = {}, r = null) {
      (this.root = t), (this.queryParams = n), (this.fragment = r);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= bn(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return TD.serialize(this);
    }
  },
  L = class {
    constructor(t, n) {
      (this.segments = t),
        (this.children = n),
        (this.parent = null),
        Object.values(n).forEach((r) => (r.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return Ko(this);
    }
  },
  kt = class {
    constructor(t, n) {
      (this.path = t), (this.parameters = n);
    }
    get parameterMap() {
      return (this._parameterMap ??= bn(this.parameters)), this._parameterMap;
    }
    toString() {
      return Xf(this);
    }
  };
function MD(e, t) {
  return Pt(e, t) && e.every((n, r) => Ge(n.parameters, t[r].parameters));
}
function Pt(e, t) {
  return e.length !== t.length ? !1 : e.every((n, r) => n.path === t[r].path);
}
function xD(e, t) {
  let n = [];
  return (
    Object.entries(e.children).forEach(([r, o]) => {
      r === x && (n = n.concat(t(o, r)));
    }),
    Object.entries(e.children).forEach(([r, o]) => {
      r !== x && (n = n.concat(t(o, r)));
    }),
    n
  );
}
var vc = (() => {
    let t = class t {};
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = w({ token: t, factory: () => new fr(), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  fr = class {
    parse(t) {
      let n = new Wa(t);
      return new nt(
        n.parseRootSegment(),
        n.parseQueryParams(),
        n.parseFragment(),
      );
    }
    serialize(t) {
      let n = `/${sr(t.root, !0)}`,
        r = AD(t.queryParams),
        o = typeof t.fragment == "string" ? `#${_D(t.fragment)}` : "";
      return `${n}${r}${o}`;
    }
  },
  TD = new fr();
function Ko(e) {
  return e.segments.map((t) => Xf(t)).join("/");
}
function sr(e, t) {
  if (!e.hasChildren()) return Ko(e);
  if (t) {
    let n = e.children[x] ? sr(e.children[x], !1) : "",
      r = [];
    return (
      Object.entries(e.children).forEach(([o, i]) => {
        o !== x && r.push(`${o}:${sr(i, !1)}`);
      }),
      r.length > 0 ? `${n}(${r.join("//")})` : n
    );
  } else {
    let n = xD(e, (r, o) =>
      o === x ? [sr(e.children[x], !1)] : [`${o}:${sr(r, !1)}`],
    );
    return Object.keys(e.children).length === 1 && e.children[x] != null
      ? `${Ko(e)}/${n[0]}`
      : `${Ko(e)}/(${n.join("//")})`;
  }
}
function Jf(e) {
  return encodeURIComponent(e)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function Zo(e) {
  return Jf(e).replace(/%3B/gi, ";");
}
function _D(e) {
  return encodeURI(e);
}
function qa(e) {
  return Jf(e)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function Jo(e) {
  return decodeURIComponent(e);
}
function $f(e) {
  return Jo(e.replace(/\+/g, "%20"));
}
function Xf(e) {
  return `${qa(e.path)}${ND(e.parameters)}`;
}
function ND(e) {
  return Object.entries(e)
    .map(([t, n]) => `;${qa(t)}=${qa(n)}`)
    .join("");
}
function AD(e) {
  let t = Object.entries(e)
    .map(([n, r]) =>
      Array.isArray(r)
        ? r.map((o) => `${Zo(n)}=${Zo(o)}`).join("&")
        : `${Zo(n)}=${Zo(r)}`,
    )
    .filter((n) => n);
  return t.length ? `?${t.join("&")}` : "";
}
var RD = /^[^\/()?;#]+/;
function $a(e) {
  let t = e.match(RD);
  return t ? t[0] : "";
}
var OD = /^[^\/()?;=#]+/;
function kD(e) {
  let t = e.match(OD);
  return t ? t[0] : "";
}
var PD = /^[^=?&#]+/;
function FD(e) {
  let t = e.match(PD);
  return t ? t[0] : "";
}
var LD = /^[^&#]+/;
function jD(e) {
  let t = e.match(LD);
  return t ? t[0] : "";
}
var Wa = class {
  constructor(t) {
    (this.url = t), (this.remaining = t);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new L([], {})
        : new L([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let t = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(t);
      while (this.consumeOptional("&"));
    return t;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let t = [];
    for (
      this.peekStartsWith("(") || t.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), t.push(this.parseSegment());
    let n = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (n = this.parseParens(!0)));
    let r = {};
    return (
      this.peekStartsWith("(") && (r = this.parseParens(!1)),
      (t.length > 0 || Object.keys(n).length > 0) && (r[x] = new L(t, n)),
      r
    );
  }
  parseSegment() {
    let t = $a(this.remaining);
    if (t === "" && this.peekStartsWith(";")) throw new D(4009, !1);
    return this.capture(t), new kt(Jo(t), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let t = {};
    for (; this.consumeOptional(";"); ) this.parseParam(t);
    return t;
  }
  parseParam(t) {
    let n = kD(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let o = $a(this.remaining);
      o && ((r = o), this.capture(r));
    }
    t[Jo(n)] = Jo(r);
  }
  parseQueryParam(t) {
    let n = FD(this.remaining);
    if (!n) return;
    this.capture(n);
    let r = "";
    if (this.consumeOptional("=")) {
      let s = jD(this.remaining);
      s && ((r = s), this.capture(r));
    }
    let o = $f(n),
      i = $f(r);
    if (t.hasOwnProperty(o)) {
      let s = t[o];
      Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i);
    } else t[o] = i;
  }
  parseParens(t) {
    let n = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let r = $a(this.remaining),
        o = this.remaining[r.length];
      if (o !== "/" && o !== ")" && o !== ";") throw new D(4010, !1);
      let i;
      r.indexOf(":") > -1
        ? ((i = r.slice(0, r.indexOf(":"))), this.capture(i), this.capture(":"))
        : t && (i = x);
      let s = this.parseChildren();
      (n[i] = Object.keys(s).length === 1 ? s[x] : new L([], s)),
        this.consumeOptional("//");
    }
    return n;
  }
  peekStartsWith(t) {
    return this.remaining.startsWith(t);
  }
  consumeOptional(t) {
    return this.peekStartsWith(t)
      ? ((this.remaining = this.remaining.substring(t.length)), !0)
      : !1;
  }
  capture(t) {
    if (!this.consumeOptional(t)) throw new D(4011, !1);
  }
};
function eh(e) {
  return e.segments.length > 0 ? new L([], { [x]: e }) : e;
}
function th(e) {
  let t = {};
  for (let [r, o] of Object.entries(e.children)) {
    let i = th(o);
    if (r === x && i.segments.length === 0 && i.hasChildren())
      for (let [s, a] of Object.entries(i.children)) t[s] = a;
    else (i.segments.length > 0 || i.hasChildren()) && (t[r] = i);
  }
  let n = new L(e.segments, t);
  return VD(n);
}
function VD(e) {
  if (e.numberOfChildren === 1 && e.children[x]) {
    let t = e.children[x];
    return new L(e.segments.concat(t.segments), t.children);
  }
  return e;
}
function hr(e) {
  return e instanceof nt;
}
function $D(e, t, n = null, r = null) {
  let o = nh(e);
  return rh(o, t, n, r);
}
function nh(e) {
  let t;
  function n(i) {
    let s = {};
    for (let c of i.children) {
      let u = n(c);
      s[c.outlet] = u;
    }
    let a = new L(i.url, s);
    return i === e && (t = a), a;
  }
  let r = n(e.root),
    o = eh(r);
  return t ?? o;
}
function rh(e, t, n, r) {
  let o = e;
  for (; o.parent; ) o = o.parent;
  if (t.length === 0) return Ba(o, o, o, n, r);
  let i = BD(t);
  if (i.toRoot()) return Ba(o, o, new L([], {}), n, r);
  let s = UD(i, o, e),
    a = s.processChildren
      ? ur(s.segmentGroup, s.index, i.commands)
      : ih(s.segmentGroup, s.index, i.commands);
  return Ba(o, s.segmentGroup, a, n, r);
}
function Xo(e) {
  return typeof e == "object" && e != null && !e.outlets && !e.segmentPath;
}
function pr(e) {
  return typeof e == "object" && e != null && e.outlets;
}
function Ba(e, t, n, r, o) {
  let i = {};
  r &&
    Object.entries(r).forEach(([c, u]) => {
      i[c] = Array.isArray(u) ? u.map((l) => `${l}`) : `${u}`;
    });
  let s;
  e === t ? (s = n) : (s = oh(e, t, n));
  let a = eh(th(s));
  return new nt(a, i, o);
}
function oh(e, t, n) {
  let r = {};
  return (
    Object.entries(e.children).forEach(([o, i]) => {
      i === t ? (r[o] = n) : (r[o] = oh(i, t, n));
    }),
    new L(e.segments, r)
  );
}
var ei = class {
  constructor(t, n, r) {
    if (
      ((this.isAbsolute = t),
      (this.numberOfDoubleDots = n),
      (this.commands = r),
      t && r.length > 0 && Xo(r[0]))
    )
      throw new D(4003, !1);
    let o = r.find(pr);
    if (o && o !== Wf(r)) throw new D(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function BD(e) {
  if (typeof e[0] == "string" && e.length === 1 && e[0] === "/")
    return new ei(!0, 0, e);
  let t = 0,
    n = !1,
    r = e.reduce((o, i, s) => {
      if (typeof i == "object" && i != null) {
        if (i.outlets) {
          let a = {};
          return (
            Object.entries(i.outlets).forEach(([c, u]) => {
              a[c] = typeof u == "string" ? u.split("/") : u;
            }),
            [...o, { outlets: a }]
          );
        }
        if (i.segmentPath) return [...o, i.segmentPath];
      }
      return typeof i != "string"
        ? [...o, i]
        : s === 0
          ? (i.split("/").forEach((a, c) => {
              (c == 0 && a === ".") ||
                (c == 0 && a === ""
                  ? (n = !0)
                  : a === ".."
                    ? t++
                    : a != "" && o.push(a));
            }),
            o)
          : [...o, i];
    }, []);
  return new ei(n, t, r);
}
var Cn = class {
  constructor(t, n, r) {
    (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
  }
};
function UD(e, t, n) {
  if (e.isAbsolute) return new Cn(t, !0, 0);
  if (!n) return new Cn(t, !1, NaN);
  if (n.parent === null) return new Cn(n, !0, 0);
  let r = Xo(e.commands[0]) ? 0 : 1,
    o = n.segments.length - 1 + r;
  return HD(n, o, e.numberOfDoubleDots);
}
function HD(e, t, n) {
  let r = e,
    o = t,
    i = n;
  for (; i > o; ) {
    if (((i -= o), (r = r.parent), !r)) throw new D(4005, !1);
    o = r.segments.length;
  }
  return new Cn(r, !1, o - i);
}
function zD(e) {
  return pr(e[0]) ? e[0].outlets : { [x]: e };
}
function ih(e, t, n) {
  if (((e ??= new L([], {})), e.segments.length === 0 && e.hasChildren()))
    return ur(e, t, n);
  let r = GD(e, t, n),
    o = n.slice(r.commandIndex);
  if (r.match && r.pathIndex < e.segments.length) {
    let i = new L(e.segments.slice(0, r.pathIndex), {});
    return (
      (i.children[x] = new L(e.segments.slice(r.pathIndex), e.children)),
      ur(i, 0, o)
    );
  } else
    return r.match && o.length === 0
      ? new L(e.segments, {})
      : r.match && !e.hasChildren()
        ? Za(e, t, n)
        : r.match
          ? ur(e, 0, o)
          : Za(e, t, n);
}
function ur(e, t, n) {
  if (n.length === 0) return new L(e.segments, {});
  {
    let r = zD(n),
      o = {};
    if (
      Object.keys(r).some((i) => i !== x) &&
      e.children[x] &&
      e.numberOfChildren === 1 &&
      e.children[x].segments.length === 0
    ) {
      let i = ur(e.children[x], t, n);
      return new L(e.segments, i.children);
    }
    return (
      Object.entries(r).forEach(([i, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (o[i] = ih(e.children[i], t, s));
      }),
      Object.entries(e.children).forEach(([i, s]) => {
        r[i] === void 0 && (o[i] = s);
      }),
      new L(e.segments, o)
    );
  }
}
function GD(e, t, n) {
  let r = 0,
    o = t,
    i = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; o < e.segments.length; ) {
    if (r >= n.length) return i;
    let s = e.segments[o],
      a = n[r];
    if (pr(a)) break;
    let c = `${a}`,
      u = r < n.length - 1 ? n[r + 1] : null;
    if (o > 0 && c === void 0) break;
    if (c && u && typeof u == "object" && u.outlets === void 0) {
      if (!Uf(c, u, s)) return i;
      r += 2;
    } else {
      if (!Uf(c, {}, s)) return i;
      r++;
    }
    o++;
  }
  return { match: !0, pathIndex: o, commandIndex: r };
}
function Za(e, t, n) {
  let r = e.segments.slice(0, t),
    o = 0;
  for (; o < n.length; ) {
    let i = n[o];
    if (pr(i)) {
      let c = qD(i.outlets);
      return new L(r, c);
    }
    if (o === 0 && Xo(n[0])) {
      let c = e.segments[t];
      r.push(new kt(c.path, Bf(n[0]))), o++;
      continue;
    }
    let s = pr(i) ? i.outlets[x] : `${i}`,
      a = o < n.length - 1 ? n[o + 1] : null;
    s && a && Xo(a)
      ? (r.push(new kt(s, Bf(a))), (o += 2))
      : (r.push(new kt(s, {})), o++);
  }
  return new L(r, {});
}
function qD(e) {
  let t = {};
  return (
    Object.entries(e).forEach(([n, r]) => {
      typeof r == "string" && (r = [r]),
        r !== null && (t[n] = Za(new L([], {}), 0, r));
    }),
    t
  );
}
function Bf(e) {
  let t = {};
  return Object.entries(e).forEach(([n, r]) => (t[n] = `${r}`)), t;
}
function Uf(e, t, n) {
  return e == n.path && Ge(t, n.parameters);
}
var lr = "imperative",
  ne = (function (e) {
    return (
      (e[(e.NavigationStart = 0)] = "NavigationStart"),
      (e[(e.NavigationEnd = 1)] = "NavigationEnd"),
      (e[(e.NavigationCancel = 2)] = "NavigationCancel"),
      (e[(e.NavigationError = 3)] = "NavigationError"),
      (e[(e.RoutesRecognized = 4)] = "RoutesRecognized"),
      (e[(e.ResolveStart = 5)] = "ResolveStart"),
      (e[(e.ResolveEnd = 6)] = "ResolveEnd"),
      (e[(e.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (e[(e.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (e[(e.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (e[(e.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (e[(e.ChildActivationStart = 11)] = "ChildActivationStart"),
      (e[(e.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (e[(e.ActivationStart = 13)] = "ActivationStart"),
      (e[(e.ActivationEnd = 14)] = "ActivationEnd"),
      (e[(e.Scroll = 15)] = "Scroll"),
      (e[(e.NavigationSkipped = 16)] = "NavigationSkipped"),
      e
    );
  })(ne || {}),
  Ee = class {
    constructor(t, n) {
      (this.id = t), (this.url = n);
    }
  },
  gr = class extends Ee {
    constructor(t, n, r = "imperative", o = null) {
      super(t, n),
        (this.type = ne.NavigationStart),
        (this.navigationTrigger = r),
        (this.restoredState = o);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Ft = class extends Ee {
    constructor(t, n, r) {
      super(t, n), (this.urlAfterRedirects = r), (this.type = ne.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${
        this.url
      }', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  pe = (function (e) {
    return (
      (e[(e.Redirect = 0)] = "Redirect"),
      (e[(e.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (e[(e.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (e[(e.GuardRejected = 3)] = "GuardRejected"),
      e
    );
  })(pe || {}),
  Qa = (function (e) {
    return (
      (e[(e.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (e[(e.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      e
    );
  })(Qa || {}),
  tt = class extends Ee {
    constructor(t, n, r, o) {
      super(t, n),
        (this.reason = r),
        (this.code = o),
        (this.type = ne.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Lt = class extends Ee {
    constructor(t, n, r, o) {
      super(t, n),
        (this.reason = r),
        (this.code = o),
        (this.type = ne.NavigationSkipped);
    }
  },
  mr = class extends Ee {
    constructor(t, n, r, o) {
      super(t, n),
        (this.error = r),
        (this.target = o),
        (this.type = ne.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${
        this.error
      })`;
    }
  },
  ti = class extends Ee {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = ne.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${
        this.url
      }', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${
        this.state
      })`;
    }
  },
  Ya = class extends Ee {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = ne.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${
        this.url
      }', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${
        this.state
      })`;
    }
  },
  Ka = class extends Ee {
    constructor(t, n, r, o, i) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.shouldActivate = i),
        (this.type = ne.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${
        this.url
      }', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${
        this.state
      }, shouldActivate: ${this.shouldActivate})`;
    }
  },
  Ja = class extends Ee {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = ne.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${
        this.url
      }', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${
        this.state
      })`;
    }
  },
  Xa = class extends Ee {
    constructor(t, n, r, o) {
      super(t, n),
        (this.urlAfterRedirects = r),
        (this.state = o),
        (this.type = ne.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${
        this.url
      }', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${
        this.state
      })`;
    }
  },
  ec = class {
    constructor(t) {
      (this.route = t), (this.type = ne.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  tc = class {
    constructor(t) {
      (this.route = t), (this.type = ne.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  nc = class {
    constructor(t) {
      (this.snapshot = t), (this.type = ne.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  rc = class {
    constructor(t) {
      (this.snapshot = t), (this.type = ne.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  oc = class {
    constructor(t) {
      (this.snapshot = t), (this.type = ne.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  ic = class {
    constructor(t) {
      (this.snapshot = t), (this.type = ne.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  };
var vr = class {},
  Sn = class {
    constructor(t, n) {
      (this.url = t), (this.navigationBehaviorOptions = n);
    }
  };
function WD(e, t) {
  return (
    e.providers &&
      !e._injector &&
      (e._injector = Ia(e.providers, t, `Route: ${e.path}`)),
    e._injector ?? t
  );
}
function ke(e) {
  return e.outlet || x;
}
function ZD(e, t) {
  let n = e.filter((r) => ke(r) === t);
  return n.push(...e.filter((r) => ke(r) !== t)), n;
}
function Ir(e) {
  if (!e) return null;
  if (e.routeConfig?._injector) return e.routeConfig._injector;
  for (let t = e.parent; t; t = t.parent) {
    let n = t.routeConfig;
    if (n?._loadedInjector) return n._loadedInjector;
    if (n?._injector) return n._injector;
  }
  return null;
}
var sc = class {
    get injector() {
      return Ir(this.route?.snapshot) ?? this.rootInjector;
    }
    set injector(t) {}
    constructor(t) {
      (this.rootInjector = t),
        (this.outlet = null),
        (this.route = null),
        (this.children = new ci(this.rootInjector)),
        (this.attachRef = null);
    }
  },
  ci = (() => {
    let t = class t {
      constructor(r) {
        (this.rootInjector = r), (this.contexts = new Map());
      }
      onChildOutletCreated(r, o) {
        let i = this.getOrCreateContext(r);
        (i.outlet = o), this.contexts.set(r, i);
      }
      onChildOutletDestroyed(r) {
        let o = this.getContext(r);
        o && ((o.outlet = null), (o.attachRef = null));
      }
      onOutletDeactivated() {
        let r = this.contexts;
        return (this.contexts = new Map()), r;
      }
      onOutletReAttached(r) {
        this.contexts = r;
      }
      getOrCreateContext(r) {
        let o = this.getContext(r);
        return (
          o || ((o = new sc(this.rootInjector)), this.contexts.set(r, o)), o
        );
      }
      getContext(r) {
        return this.contexts.get(r) || null;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(_(De));
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  ni = class {
    constructor(t) {
      this._root = t;
    }
    get root() {
      return this._root.value;
    }
    parent(t) {
      let n = this.pathFromRoot(t);
      return n.length > 1 ? n[n.length - 2] : null;
    }
    children(t) {
      let n = ac(t, this._root);
      return n ? n.children.map((r) => r.value) : [];
    }
    firstChild(t) {
      let n = ac(t, this._root);
      return n && n.children.length > 0 ? n.children[0].value : null;
    }
    siblings(t) {
      let n = cc(t, this._root);
      return n.length < 2
        ? []
        : n[n.length - 2].children.map((o) => o.value).filter((o) => o !== t);
    }
    pathFromRoot(t) {
      return cc(t, this._root).map((n) => n.value);
    }
  };
function ac(e, t) {
  if (e === t.value) return t;
  for (let n of t.children) {
    let r = ac(e, n);
    if (r) return r;
  }
  return null;
}
function cc(e, t) {
  if (e === t.value) return [t];
  for (let n of t.children) {
    let r = cc(e, n);
    if (r.length) return r.unshift(t), r;
  }
  return [];
}
var he = class {
  constructor(t, n) {
    (this.value = t), (this.children = n);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function wn(e) {
  let t = {};
  return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t;
}
var ri = class extends ni {
  constructor(t, n) {
    super(t), (this.snapshot = n), yc(this, t);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function sh(e) {
  let t = QD(e),
    n = new W([new kt("", {})]),
    r = new W({}),
    o = new W({}),
    i = new W({}),
    s = new W(""),
    a = new Mn(n, r, i, s, o, x, e, t.root);
  return (a.snapshot = t.root), new ri(new he(a, []), t);
}
function QD(e) {
  let t = {},
    n = {},
    r = {},
    o = "",
    i = new En([], t, r, o, n, x, e, null, {});
  return new ii("", new he(i, []));
}
var Mn = class {
  constructor(t, n, r, o, i, s, a, c) {
    (this.urlSubject = t),
      (this.paramsSubject = n),
      (this.queryParamsSubject = r),
      (this.fragmentSubject = o),
      (this.dataSubject = i),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(R((u) => u[Er])) ?? b(void 0)),
      (this.url = t),
      (this.params = n),
      (this.queryParams = r),
      (this.fragment = o),
      (this.data = i);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(R((t) => bn(t)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(R((t) => bn(t)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function oi(e, t, n = "emptyOnly") {
  let r,
    { routeConfig: o } = e;
  return (
    t !== null &&
    (n === "always" ||
      o?.path === "" ||
      (!t.component && !t.routeConfig?.loadComponent))
      ? (r = {
          params: y(y({}, t.params), e.params),
          data: y(y({}, t.data), e.data),
          resolve: y(y(y(y({}, e.data), t.data), o?.data), e._resolvedData),
        })
      : (r = {
          params: y({}, e.params),
          data: y({}, e.data),
          resolve: y(y({}, e.data), e._resolvedData ?? {}),
        }),
    o && ch(o) && (r.resolve[Er] = o.title),
    r
  );
}
var En = class {
    get title() {
      return this.data?.[Er];
    }
    constructor(t, n, r, o, i, s, a, c, u) {
      (this.url = t),
        (this.params = n),
        (this.queryParams = r),
        (this.fragment = o),
        (this.data = i),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = c),
        (this._resolve = u);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= bn(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= bn(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let t = this.url.map((r) => r.toString()).join("/"),
        n = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${t}', path:'${n}')`;
    }
  },
  ii = class extends ni {
    constructor(t, n) {
      super(n), (this.url = t), yc(this, n);
    }
    toString() {
      return ah(this._root);
    }
  };
function yc(e, t) {
  (t.value._routerState = e), t.children.forEach((n) => yc(e, n));
}
function ah(e) {
  let t = e.children.length > 0 ? ` { ${e.children.map(ah).join(", ")} } ` : "";
  return `${e.value}${t}`;
}
function Ua(e) {
  if (e.snapshot) {
    let t = e.snapshot,
      n = e._futureSnapshot;
    (e.snapshot = n),
      Ge(t.queryParams, n.queryParams) ||
        e.queryParamsSubject.next(n.queryParams),
      t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
      Ge(t.params, n.params) || e.paramsSubject.next(n.params),
      ED(t.url, n.url) || e.urlSubject.next(n.url),
      Ge(t.data, n.data) || e.dataSubject.next(n.data);
  } else
    (e.snapshot = e._futureSnapshot),
      e.dataSubject.next(e._futureSnapshot.data);
}
function uc(e, t) {
  let n = Ge(e.params, t.params) && MD(e.url, t.url),
    r = !e.parent != !t.parent;
  return n && !r && (!e.parent || uc(e.parent, t.parent));
}
function ch(e) {
  return typeof e.title == "string" || e.title === null;
}
var YD = (() => {
    let t = class t {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = x),
          (this.activateEvents = new ie()),
          (this.deactivateEvents = new ie()),
          (this.attachEvents = new ie()),
          (this.detachEvents = new ie()),
          (this.parentContexts = p(ci)),
          (this.location = p(mn)),
          (this.changeDetector = p(er)),
          (this.inputBinder = p(Dc, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(r) {
        if (r.name) {
          let { firstChange: o, previousValue: i } = r.name;
          if (o) return;
          this.isTrackedInParentContexts(i) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(i)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(r) {
        return this.parentContexts.getContext(r)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let r = this.parentContexts.getContext(this.name);
        r?.route &&
          (r.attachRef
            ? this.attach(r.attachRef, r.route)
            : this.activateWith(r.route, r.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new D(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new D(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new D(4012, !1);
        this.location.detach();
        let r = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(r.instance),
          r
        );
      }
      attach(r, o) {
        (this.activated = r),
          (this._activatedRoute = o),
          this.location.insert(r.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(r.instance);
      }
      deactivate() {
        if (this.activated) {
          let r = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(r);
        }
      }
      activateWith(r, o) {
        if (this.isActivated) throw new D(4013, !1);
        this._activatedRoute = r;
        let i = this.location,
          a = r.snapshot.component,
          c = this.parentContexts.getOrCreateContext(this.name).children,
          u = new lc(r, c, i.injector);
        (this.activated = i.createComponent(a, {
          index: i.length,
          injector: u,
          environmentInjector: o,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵdir = hn({
        type: t,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [No],
      }));
    let e = t;
    return e;
  })(),
  lc = class e {
    __ngOutletInjector(t) {
      return new e(this.route, this.childContexts, t);
    }
    constructor(t, n, r) {
      (this.route = t), (this.childContexts = n), (this.parent = r);
    }
    get(t, n) {
      return t === Mn
        ? this.route
        : t === ci
          ? this.childContexts
          : this.parent.get(t, n);
    }
  },
  Dc = new M("");
function KD(e, t, n) {
  let r = yr(e, t._root, n ? n._root : void 0);
  return new ri(r, t);
}
function yr(e, t, n) {
  if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
    let r = n.value;
    r._futureSnapshot = t.value;
    let o = JD(e, t, n);
    return new he(r, o);
  } else {
    if (e.shouldAttach(t.value)) {
      let i = e.retrieve(t.value);
      if (i !== null) {
        let s = i.route;
        return (
          (s.value._futureSnapshot = t.value),
          (s.children = t.children.map((a) => yr(e, a))),
          s
        );
      }
    }
    let r = XD(t.value),
      o = t.children.map((i) => yr(e, i));
    return new he(r, o);
  }
}
function JD(e, t, n) {
  return t.children.map((r) => {
    for (let o of n.children)
      if (e.shouldReuseRoute(r.value, o.value.snapshot)) return yr(e, r, o);
    return yr(e, r);
  });
}
function XD(e) {
  return new Mn(
    new W(e.url),
    new W(e.params),
    new W(e.queryParams),
    new W(e.fragment),
    new W(e.data),
    e.outlet,
    e.component,
    e,
  );
}
var Dr = class {
    constructor(t, n) {
      (this.redirectTo = t), (this.navigationBehaviorOptions = n);
    }
  },
  uh = "ngNavigationCancelingError";
function si(e, t) {
  let { redirectTo: n, navigationBehaviorOptions: r } = hr(t)
      ? { redirectTo: t, navigationBehaviorOptions: void 0 }
      : t,
    o = lh(!1, pe.Redirect);
  return (o.url = n), (o.navigationBehaviorOptions = r), o;
}
function lh(e, t) {
  let n = new Error(`NavigationCancelingError: ${e || ""}`);
  return (n[uh] = !0), (n.cancellationCode = t), n;
}
function ew(e) {
  return dh(e) && hr(e.url);
}
function dh(e) {
  return !!e && e[uh];
}
var tw = (e, t, n, r) =>
    R(
      (o) => (
        new dc(t, o.targetRouterState, o.currentRouterState, n, r).activate(e),
        o
      ),
    ),
  dc = class {
    constructor(t, n, r, o, i) {
      (this.routeReuseStrategy = t),
        (this.futureState = n),
        (this.currState = r),
        (this.forwardEvent = o),
        (this.inputBindingEnabled = i);
    }
    activate(t) {
      let n = this.futureState._root,
        r = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(n, r, t),
        Ua(this.futureState.root),
        this.activateChildRoutes(n, r, t);
    }
    deactivateChildRoutes(t, n, r) {
      let o = wn(n);
      t.children.forEach((i) => {
        let s = i.value.outlet;
        this.deactivateRoutes(i, o[s], r), delete o[s];
      }),
        Object.values(o).forEach((i) => {
          this.deactivateRouteAndItsChildren(i, r);
        });
    }
    deactivateRoutes(t, n, r) {
      let o = t.value,
        i = n ? n.value : null;
      if (o === i)
        if (o.component) {
          let s = r.getContext(o.outlet);
          s && this.deactivateChildRoutes(t, n, s.children);
        } else this.deactivateChildRoutes(t, n, r);
      else i && this.deactivateRouteAndItsChildren(n, r);
    }
    deactivateRouteAndItsChildren(t, n) {
      t.value.component &&
      this.routeReuseStrategy.shouldDetach(t.value.snapshot)
        ? this.detachAndStoreRouteSubtree(t, n)
        : this.deactivateRouteAndOutlet(t, n);
    }
    detachAndStoreRouteSubtree(t, n) {
      let r = n.getContext(t.value.outlet),
        o = r && t.value.component ? r.children : n,
        i = wn(t);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      if (r && r.outlet) {
        let s = r.outlet.detach(),
          a = r.children.onOutletDeactivated();
        this.routeReuseStrategy.store(t.value.snapshot, {
          componentRef: s,
          route: t,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(t, n) {
      let r = n.getContext(t.value.outlet),
        o = r && t.value.component ? r.children : n,
        i = wn(t);
      for (let s of Object.values(i)) this.deactivateRouteAndItsChildren(s, o);
      r &&
        (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()),
        (r.attachRef = null),
        (r.route = null));
    }
    activateChildRoutes(t, n, r) {
      let o = wn(n);
      t.children.forEach((i) => {
        this.activateRoutes(i, o[i.value.outlet], r),
          this.forwardEvent(new ic(i.value.snapshot));
      }),
        t.children.length && this.forwardEvent(new rc(t.value.snapshot));
    }
    activateRoutes(t, n, r) {
      let o = t.value,
        i = n ? n.value : null;
      if ((Ua(o), o === i))
        if (o.component) {
          let s = r.getOrCreateContext(o.outlet);
          this.activateChildRoutes(t, n, s.children);
        } else this.activateChildRoutes(t, n, r);
      else if (o.component) {
        let s = r.getOrCreateContext(o.outlet);
        if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(o.snapshot);
          this.routeReuseStrategy.store(o.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            Ua(a.route.value),
            this.activateChildRoutes(t, null, s.children);
        } else
          (s.attachRef = null),
            (s.route = o),
            s.outlet && s.outlet.activateWith(o, s.injector),
            this.activateChildRoutes(t, null, s.children);
      } else this.activateChildRoutes(t, null, r);
    }
  },
  ai = class {
    constructor(t) {
      (this.path = t), (this.route = this.path[this.path.length - 1]);
    }
  },
  In = class {
    constructor(t, n) {
      (this.component = t), (this.route = n);
    }
  };
function nw(e, t, n) {
  let r = e._root,
    o = t ? t._root : null;
  return ar(r, o, n, [r.value]);
}
function rw(e) {
  let t = e.routeConfig ? e.routeConfig.canActivateChild : null;
  return !t || t.length === 0 ? null : { node: e, guards: t };
}
function Tn(e, t) {
  let n = Symbol(),
    r = t.get(e, n);
  return r === n ? (typeof e == "function" && !Gu(e) ? e : t.get(e)) : r;
}
function ar(
  e,
  t,
  n,
  r,
  o = {
    canDeactivateChecks: [],
    canActivateChecks: [],
  },
) {
  let i = wn(t);
  return (
    e.children.forEach((s) => {
      ow(s, i[s.value.outlet], n, r.concat([s.value]), o),
        delete i[s.value.outlet];
    }),
    Object.entries(i).forEach(([s, a]) => dr(a, n.getContext(s), o)),
    o
  );
}
function ow(
  e,
  t,
  n,
  r,
  o = {
    canDeactivateChecks: [],
    canActivateChecks: [],
  },
) {
  let i = e.value,
    s = t ? t.value : null,
    a = n ? n.getContext(e.value.outlet) : null;
  if (s && i.routeConfig === s.routeConfig) {
    let c = iw(s, i, i.routeConfig.runGuardsAndResolvers);
    c
      ? o.canActivateChecks.push(new ai(r))
      : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
      i.component ? ar(e, t, a ? a.children : null, r, o) : ar(e, t, n, r, o),
      c &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        o.canDeactivateChecks.push(new In(a.outlet.component, s));
  } else
    s && dr(t, a, o),
      o.canActivateChecks.push(new ai(r)),
      i.component
        ? ar(e, null, a ? a.children : null, r, o)
        : ar(e, null, n, r, o);
  return o;
}
function iw(e, t, n) {
  if (typeof n == "function") return n(e, t);
  switch (n) {
    case "pathParamsChange":
      return !Pt(e.url, t.url);
    case "pathParamsOrQueryParamsChange":
      return !Pt(e.url, t.url) || !Ge(e.queryParams, t.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !uc(e, t) || !Ge(e.queryParams, t.queryParams);
    case "paramsChange":
    default:
      return !uc(e, t);
  }
}
function dr(e, t, n) {
  let r = wn(e),
    o = e.value;
  Object.entries(r).forEach(([i, s]) => {
    o.component
      ? t
        ? dr(s, t.children.getContext(i), n)
        : dr(s, null, n)
      : dr(s, t, n);
  }),
    o.component
      ? t && t.outlet && t.outlet.isActivated
        ? n.canDeactivateChecks.push(new In(t.outlet.component, o))
        : n.canDeactivateChecks.push(new In(null, o))
      : n.canDeactivateChecks.push(new In(null, o));
}
function br(e) {
  return typeof e == "function";
}
function sw(e) {
  return typeof e == "boolean";
}
function aw(e) {
  return e && br(e.canLoad);
}
function cw(e) {
  return e && br(e.canActivate);
}
function uw(e) {
  return e && br(e.canActivateChild);
}
function lw(e) {
  return e && br(e.canDeactivate);
}
function dw(e) {
  return e && br(e.canMatch);
}
function fh(e) {
  return e instanceof We || e?.name === "EmptyError";
}
var Qo = Symbol("INITIAL_VALUE");
function xn() {
  return xe((e) =>
    Ur(e.map((t) => t.pipe(Ze(1), Hi(Qo)))).pipe(
      R((t) => {
        for (let n of t)
          if (n !== !0) {
            if (n === Qo) return Qo;
            if (n === !1 || fw(n)) return n;
          }
        return !0;
      }),
      Me((t) => t !== Qo),
      Ze(1),
    ),
  );
}
function fw(e) {
  return hr(e) || e instanceof Dr;
}
function hw(e, t) {
  return Q((n) => {
    let {
      targetSnapshot: r,
      currentSnapshot: o,
      guards: { canActivateChecks: i, canDeactivateChecks: s },
    } = n;
    return s.length === 0 && i.length === 0
      ? b(z(y({}, n), { guardsResult: !0 }))
      : pw(s, r, o, e).pipe(
          Q((a) => (a && sw(a) ? gw(r, i, e, t) : b(a))),
          R((a) => z(y({}, n), { guardsResult: a })),
        );
  });
}
function pw(e, t, n, r) {
  return Z(e).pipe(
    Q((o) => ww(o.component, o.route, n, t, r)),
    Pe((o) => o !== !0, !0),
  );
}
function gw(e, t, n, r) {
  return Z(t).pipe(
    Yt((o) =>
      Qt(
        vw(o.route.parent, r),
        mw(o.route, r),
        Dw(e, o.path, n),
        yw(e, o.route, n),
      ),
    ),
    Pe((o) => o !== !0, !0),
  );
}
function mw(e, t) {
  return e !== null && t && t(new oc(e)), b(!0);
}
function vw(e, t) {
  return e !== null && t && t(new nc(e)), b(!0);
}
function yw(e, t, n) {
  let r = t.routeConfig ? t.routeConfig.canActivate : null;
  if (!r || r.length === 0) return b(!0);
  let o = r.map((i) =>
    Hr(() => {
      let s = Ir(t) ?? n,
        a = Tn(i, s),
        c = cw(a) ? a.canActivate(t, e) : Je(s, () => a(t, e));
      return vt(c).pipe(Pe());
    }),
  );
  return b(o).pipe(xn());
}
function Dw(e, t, n) {
  let r = t[t.length - 1],
    i = t
      .slice(0, t.length - 1)
      .reverse()
      .map((s) => rw(s))
      .filter((s) => s !== null)
      .map((s) =>
        Hr(() => {
          let a = s.guards.map((c) => {
            let u = Ir(s.node) ?? n,
              l = Tn(c, u),
              d = uw(l) ? l.canActivateChild(r, e) : Je(u, () => l(r, e));
            return vt(d).pipe(Pe());
          });
          return b(a).pipe(xn());
        }),
      );
  return b(i).pipe(xn());
}
function ww(e, t, n, r, o) {
  let i = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
  if (!i || i.length === 0) return b(!0);
  let s = i.map((a) => {
    let c = Ir(t) ?? o,
      u = Tn(a, c),
      l = lw(u) ? u.canDeactivate(e, t, n, r) : Je(c, () => u(e, t, n, r));
    return vt(l).pipe(Pe());
  });
  return b(s).pipe(xn());
}
function Cw(e, t, n, r) {
  let o = t.canLoad;
  if (o === void 0 || o.length === 0) return b(!0);
  let i = o.map((s) => {
    let a = Tn(s, e),
      c = aw(a) ? a.canLoad(t, n) : Je(e, () => a(t, n));
    return vt(c);
  });
  return b(i).pipe(xn(), hh(r));
}
function hh(e) {
  return ki(
    ee((t) => {
      if (typeof t != "boolean") throw si(e, t);
    }),
    R((t) => t === !0),
  );
}
function Ew(e, t, n, r) {
  let o = t.canMatch;
  if (!o || o.length === 0) return b(!0);
  let i = o.map((s) => {
    let a = Tn(s, e),
      c = dw(a) ? a.canMatch(t, n) : Je(e, () => a(t, n));
    return vt(c);
  });
  return b(i).pipe(xn(), hh(r));
}
var wr = class {
    constructor(t) {
      this.segmentGroup = t || null;
    }
  },
  Cr = class extends Error {
    constructor(t) {
      super(), (this.urlTree = t);
    }
  };
function Dn(e) {
  return Zt(new wr(e));
}
function Iw(e) {
  return Zt(new D(4e3, !1));
}
function bw(e) {
  return Zt(lh(!1, pe.GuardRejected));
}
var fc = class {
    constructor(t, n) {
      (this.urlSerializer = t), (this.urlTree = n);
    }
    lineralizeSegments(t, n) {
      let r = [],
        o = n.root;
      for (;;) {
        if (((r = r.concat(o.segments)), o.numberOfChildren === 0)) return b(r);
        if (o.numberOfChildren > 1 || !o.children[x])
          return Iw(`${t.redirectTo}`);
        o = o.children[x];
      }
    }
    applyRedirectCommands(t, n, r, o, i) {
      if (typeof n != "string") {
        let a = n,
          {
            queryParams: c,
            fragment: u,
            routeConfig: l,
            url: d,
            outlet: h,
            params: f,
            data: g,
            title: E,
          } = o,
          V = Je(i, () =>
            a({
              params: f,
              data: g,
              queryParams: c,
              fragment: u,
              routeConfig: l,
              url: d,
              outlet: h,
              title: E,
            }),
          );
        if (V instanceof nt) throw new Cr(V);
        n = V;
      }
      let s = this.applyRedirectCreateUrlTree(
        n,
        this.urlSerializer.parse(n),
        t,
        r,
      );
      if (n[0] === "/") throw new Cr(s);
      return s;
    }
    applyRedirectCreateUrlTree(t, n, r, o) {
      let i = this.createSegmentGroup(t, n.root, r, o);
      return new nt(
        i,
        this.createQueryParams(n.queryParams, this.urlTree.queryParams),
        n.fragment,
      );
    }
    createQueryParams(t, n) {
      let r = {};
      return (
        Object.entries(t).forEach(([o, i]) => {
          if (typeof i == "string" && i[0] === ":") {
            let a = i.substring(1);
            r[o] = n[a];
          } else r[o] = i;
        }),
        r
      );
    }
    createSegmentGroup(t, n, r, o) {
      let i = this.createSegments(t, n.segments, r, o),
        s = {};
      return (
        Object.entries(n.children).forEach(([a, c]) => {
          s[a] = this.createSegmentGroup(t, c, r, o);
        }),
        new L(i, s)
      );
    }
    createSegments(t, n, r, o) {
      return n.map((i) =>
        i.path[0] === ":"
          ? this.findPosParam(t, i, o)
          : this.findOrReturn(i, r),
      );
    }
    findPosParam(t, n, r) {
      let o = r[n.path.substring(1)];
      if (!o) throw new D(4001, !1);
      return o;
    }
    findOrReturn(t, n) {
      let r = 0;
      for (let o of n) {
        if (o.path === t.path) return n.splice(r), o;
        r++;
      }
      return t;
    }
  },
  hc = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function Sw(e, t, n, r, o) {
  let i = wc(e, t, n);
  return i.matched
    ? ((r = WD(t, r)),
      Ew(r, t, n, o).pipe(R((s) => (s === !0 ? i : y({}, hc)))))
    : b(i);
}
function wc(e, t, n) {
  if (t.path === "**") return Mw(n);
  if (t.path === "")
    return t.pathMatch === "full" && (e.hasChildren() || n.length > 0)
      ? y({}, hc)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: n,
          parameters: {},
          positionalParamSegments: {},
        };
  let o = (t.matcher || CD)(n, e, t);
  if (!o) return y({}, hc);
  let i = {};
  Object.entries(o.posParams ?? {}).forEach(([a, c]) => {
    i[a] = c.path;
  });
  let s =
    o.consumed.length > 0
      ? y(y({}, i), o.consumed[o.consumed.length - 1].parameters)
      : i;
  return {
    matched: !0,
    consumedSegments: o.consumed,
    remainingSegments: n.slice(o.consumed.length),
    parameters: s,
    positionalParamSegments: o.posParams ?? {},
  };
}
function Mw(e) {
  return {
    matched: !0,
    parameters: e.length > 0 ? Wf(e).parameters : {},
    consumedSegments: e,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function Hf(e, t, n, r) {
  return n.length > 0 && _w(e, n, r)
    ? {
        segmentGroup: new L(t, Tw(r, new L(n, e.children))),
        slicedSegments: [],
      }
    : n.length === 0 && Nw(e, n, r)
      ? {
          segmentGroup: new L(e.segments, xw(e, n, r, e.children)),
          slicedSegments: n,
        }
      : {
          segmentGroup: new L(e.segments, e.children),
          slicedSegments: n,
        };
}
function xw(e, t, n, r) {
  let o = {};
  for (let i of n)
    if (ui(e, t, i) && !r[ke(i)]) {
      let s = new L([], {});
      o[ke(i)] = s;
    }
  return y(y({}, r), o);
}
function Tw(e, t) {
  let n = {};
  n[x] = t;
  for (let r of e)
    if (r.path === "" && ke(r) !== x) {
      let o = new L([], {});
      n[ke(r)] = o;
    }
  return n;
}
function _w(e, t, n) {
  return n.some((r) => ui(e, t, r) && ke(r) !== x);
}
function Nw(e, t, n) {
  return n.some((r) => ui(e, t, r));
}
function ui(e, t, n) {
  return (e.hasChildren() || t.length > 0) && n.pathMatch === "full"
    ? !1
    : n.path === "";
}
function Aw(e, t, n, r) {
  return ke(e) !== r && (r === x || !ui(t, n, e)) ? !1 : wc(t, e, n).matched;
}
function Rw(e, t, n) {
  return t.length === 0 && !e.children[n];
}
var pc = class {};
function Ow(e, t, n, r, o, i, s = "emptyOnly") {
  return new gc(e, t, n, r, o, s, i).recognize();
}
var kw = 31,
  gc = class {
    constructor(t, n, r, o, i, s, a) {
      (this.injector = t),
        (this.configLoader = n),
        (this.rootComponentType = r),
        (this.config = o),
        (this.urlTree = i),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new fc(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(t) {
      return new D(4002, `'${t.segmentGroup}'`);
    }
    recognize() {
      let t = Hf(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(t).pipe(
        R(({ children: n, rootSnapshot: r }) => {
          let o = new he(r, n),
            i = new ii("", o),
            s = $D(r, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (i.url = this.urlSerializer.serialize(s)),
            {
              state: i,
              tree: s,
            }
          );
        }),
      );
    }
    match(t) {
      let n = new En(
        [],
        Object.freeze({}),
        Object.freeze(y({}, this.urlTree.queryParams)),
        this.urlTree.fragment,
        Object.freeze({}),
        x,
        this.rootComponentType,
        null,
        {},
      );
      return this.processSegmentGroup(this.injector, this.config, t, x, n).pipe(
        R((r) => ({ children: r, rootSnapshot: n })),
        ot((r) => {
          if (r instanceof Cr)
            return (this.urlTree = r.urlTree), this.match(r.urlTree.root);
          throw r instanceof wr ? this.noMatchError(r) : r;
        }),
      );
    }
    processSegmentGroup(t, n, r, o, i) {
      return r.segments.length === 0 && r.hasChildren()
        ? this.processChildren(t, n, r, i)
        : this.processSegment(t, n, r, r.segments, o, !0, i).pipe(
            R((s) => (s instanceof he ? [s] : [])),
          );
    }
    processChildren(t, n, r, o) {
      let i = [];
      for (let s of Object.keys(r.children))
        s === "primary" ? i.unshift(s) : i.push(s);
      return Z(i).pipe(
        Yt((s) => {
          let a = r.children[s],
            c = ZD(n, s);
          return this.processSegmentGroup(t, c, a, s, o);
        }),
        Ui((s, a) => (s.push(...a), s)),
        it(null),
        Bi(),
        Q((s) => {
          if (s === null) return Dn(r);
          let a = ph(s);
          return Pw(a), b(a);
        }),
      );
    }
    processSegment(t, n, r, o, i, s, a) {
      return Z(n).pipe(
        Yt((c) =>
          this.processSegmentAgainstRoute(
            c._injector ?? t,
            n,
            c,
            r,
            o,
            i,
            s,
            a,
          ).pipe(
            ot((u) => {
              if (u instanceof wr) return b(null);
              throw u;
            }),
          ),
        ),
        Pe((c) => !!c),
        ot((c) => {
          if (fh(c)) return Rw(r, o, i) ? b(new pc()) : Dn(r);
          throw c;
        }),
      );
    }
    processSegmentAgainstRoute(t, n, r, o, i, s, a, c) {
      return Aw(r, o, i, s)
        ? r.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(t, o, r, i, s, c)
          : this.allowRedirects && a
            ? this.expandSegmentAgainstRouteUsingRedirect(t, o, n, r, i, s, c)
            : Dn(o)
        : Dn(o);
    }
    expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s, a) {
      let {
        matched: c,
        parameters: u,
        consumedSegments: l,
        positionalParamSegments: d,
        remainingSegments: h,
      } = wc(n, o, i);
      if (!c) return Dn(n);
      typeof o.redirectTo == "string" &&
        o.redirectTo[0] === "/" &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > kw && (this.allowRedirects = !1));
      let f = new En(
          i,
          u,
          Object.freeze(y({}, this.urlTree.queryParams)),
          this.urlTree.fragment,
          zf(o),
          ke(o),
          o.component ?? o._loadedComponent ?? null,
          o,
          Gf(o),
        ),
        g = oi(f, a, this.paramsInheritanceStrategy);
      (f.params = Object.freeze(g.params)), (f.data = Object.freeze(g.data));
      let E = this.applyRedirects.applyRedirectCommands(
        l,
        o.redirectTo,
        d,
        f,
        t,
      );
      return this.applyRedirects
        .lineralizeSegments(o, E)
        .pipe(Q((V) => this.processSegment(t, r, n, V.concat(h), s, !1, a)));
    }
    matchSegmentAgainstRoute(t, n, r, o, i, s) {
      let a = Sw(n, r, o, t, this.urlSerializer);
      return (
        r.path === "**" && (n.children = {}),
        a.pipe(
          xe((c) =>
            c.matched
              ? ((t = r._injector ?? t),
                this.getChildConfig(t, r, o).pipe(
                  xe(({ routes: u }) => {
                    let l = r._loadedInjector ?? t,
                      {
                        parameters: d,
                        consumedSegments: h,
                        remainingSegments: f,
                      } = c,
                      g = new En(
                        h,
                        d,
                        Object.freeze(y({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        zf(r),
                        ke(r),
                        r.component ?? r._loadedComponent ?? null,
                        r,
                        Gf(r),
                      ),
                      E = oi(g, s, this.paramsInheritanceStrategy);
                    (g.params = Object.freeze(E.params)),
                      (g.data = Object.freeze(E.data));
                    let { segmentGroup: V, slicedSegments: B } = Hf(n, h, f, u);
                    if (B.length === 0 && V.hasChildren())
                      return this.processChildren(l, u, V, g).pipe(
                        R((q) => new he(g, q)),
                      );
                    if (u.length === 0 && B.length === 0)
                      return b(new he(g, []));
                    let Ie = ke(r) === i;
                    return this.processSegment(
                      l,
                      u,
                      V,
                      B,
                      Ie ? x : i,
                      !0,
                      g,
                    ).pipe(R((q) => new he(g, q instanceof he ? [q] : [])));
                  }),
                ))
              : Dn(n),
          ),
        )
      );
    }
    getChildConfig(t, n, r) {
      return n.children
        ? b({ routes: n.children, injector: t })
        : n.loadChildren
          ? n._loadedRoutes !== void 0
            ? b({
                routes: n._loadedRoutes,
                injector: n._loadedInjector,
              })
            : Cw(t, n, r, this.urlSerializer).pipe(
                Q((o) =>
                  o
                    ? this.configLoader.loadChildren(t, n).pipe(
                        ee((i) => {
                          (n._loadedRoutes = i.routes),
                            (n._loadedInjector = i.injector);
                        }),
                      )
                    : bw(n),
                ),
              )
          : b({ routes: [], injector: t });
    }
  };
function Pw(e) {
  e.sort((t, n) =>
    t.value.outlet === x
      ? -1
      : n.value.outlet === x
        ? 1
        : t.value.outlet.localeCompare(n.value.outlet),
  );
}
function Fw(e) {
  let t = e.value.routeConfig;
  return t && t.path === "";
}
function ph(e) {
  let t = [],
    n = new Set();
  for (let r of e) {
    if (!Fw(r)) {
      t.push(r);
      continue;
    }
    let o = t.find((i) => r.value.routeConfig === i.value.routeConfig);
    o !== void 0 ? (o.children.push(...r.children), n.add(o)) : t.push(r);
  }
  for (let r of n) {
    let o = ph(r.children);
    t.push(new he(r.value, o));
  }
  return t.filter((r) => !n.has(r));
}
function zf(e) {
  return e.data || {};
}
function Gf(e) {
  return e.resolve || {};
}
function Lw(e, t, n, r, o, i) {
  return Q((s) =>
    Ow(e, t, n, r, s.extractedUrl, o, i).pipe(
      R(({ state: a, tree: c }) =>
        z(y({}, s), { targetSnapshot: a, urlAfterRedirects: c }),
      ),
    ),
  );
}
function jw(e, t) {
  return Q((n) => {
    let {
      targetSnapshot: r,
      guards: { canActivateChecks: o },
    } = n;
    if (!o.length) return b(n);
    let i = new Set(o.map((c) => c.route)),
      s = new Set();
    for (let c of i) if (!s.has(c)) for (let u of gh(c)) s.add(u);
    let a = 0;
    return Z(s).pipe(
      Yt((c) =>
        i.has(c)
          ? Vw(c, r, e, t)
          : ((c.data = oi(c, c.parent, e).resolve), b(void 0)),
      ),
      ee(() => a++),
      Kt(1),
      Q((c) => (a === s.size ? b(n) : le)),
    );
  });
}
function gh(e) {
  let t = e.children.map((n) => gh(n)).flat();
  return [e, ...t];
}
function Vw(e, t, n, r) {
  let o = e.routeConfig,
    i = e._resolve;
  return (
    o?.title !== void 0 && !ch(o) && (i[Er] = o.title),
    $w(i, e, t, r).pipe(
      R(
        (s) => (
          (e._resolvedData = s), (e.data = oi(e, e.parent, n).resolve), null
        ),
      ),
    )
  );
}
function $w(e, t, n, r) {
  let o = Ga(e);
  if (o.length === 0) return b({});
  let i = {};
  return Z(o).pipe(
    Q((s) =>
      Bw(e[s], t, n, r).pipe(
        Pe(),
        ee((a) => {
          if (a instanceof Dr) throw si(new fr(), a);
          i[s] = a;
        }),
      ),
    ),
    Kt(1),
    $i(i),
    ot((s) => (fh(s) ? le : Zt(s))),
  );
}
function Bw(e, t, n, r) {
  let o = Ir(t) ?? r,
    i = Tn(e, o),
    s = i.resolve ? i.resolve(t, n) : Je(o, () => i(t, n));
  return vt(s);
}
function Ha(e) {
  return xe((t) => {
    let n = e(t);
    return n ? Z(n).pipe(R(() => t)) : b(t);
  });
}
var mh = (() => {
    let t = class t {
      buildTitle(r) {
        let o,
          i = r.root;
        for (; i !== void 0; )
          (o = this.getResolvedTitleForRoute(i) ?? o),
            (i = i.children.find((s) => s.outlet === x));
        return o;
      }
      getResolvedTitleForRoute(r) {
        return r.data[Er];
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = w({ token: t, factory: () => p(Uw), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Uw = (() => {
    let t = class t extends mh {
      constructor(r) {
        super(), (this.title = r);
      }
      updateTitle(r) {
        let o = this.buildTitle(r);
        o !== void 0 && this.title.setTitle(o);
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)(_(jf));
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Cc = new M("", { providedIn: "root", factory: () => ({}) }),
  Hw = (() => {
    let t = class t {};
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵcmp = J({
        type: t,
        selectors: [["ng-component"]],
        standalone: !0,
        features: [X],
        decls: 1,
        vars: 0,
        template: function (o, i) {
          o & 1 && U(0, "router-outlet");
        },
        dependencies: [YD],
        encapsulation: 2,
      }));
    let e = t;
    return e;
  })();
function Ec(e) {
  let t = e.children && e.children.map(Ec),
    n = t ? z(y({}, e), { children: t }) : y({}, e);
  return (
    !n.component &&
      !n.loadComponent &&
      (t || n.loadChildren) &&
      n.outlet &&
      n.outlet !== x &&
      (n.component = Hw),
    n
  );
}
var Ic = new M(""),
  zw = (() => {
    let t = class t {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = p(Ma));
      }
      loadComponent(r) {
        if (this.componentLoaders.get(r)) return this.componentLoaders.get(r);
        if (r._loadedComponent) return b(r._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(r);
        let o = vt(r.loadComponent()).pipe(
            R(vh),
            ee((s) => {
              this.onLoadEndListener && this.onLoadEndListener(r),
                (r._loadedComponent = s);
            }),
            An(() => {
              this.componentLoaders.delete(r);
            }),
          ),
          i = new Wt(o, () => new oe()).pipe(qt());
        return this.componentLoaders.set(r, i), i;
      }
      loadChildren(r, o) {
        if (this.childrenLoaders.get(o)) return this.childrenLoaders.get(o);
        if (o._loadedRoutes)
          return b({ routes: o._loadedRoutes, injector: o._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(o);
        let s = Gw(o, this.compiler, r, this.onLoadEndListener).pipe(
            An(() => {
              this.childrenLoaders.delete(o);
            }),
          ),
          a = new Wt(s, () => new oe()).pipe(qt());
        return this.childrenLoaders.set(o, a), a;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })();
function Gw(e, t, n, r) {
  return vt(e.loadChildren()).pipe(
    R(vh),
    Q((o) =>
      o instanceof zn || Array.isArray(o) ? b(o) : Z(t.compileModuleAsync(o)),
    ),
    R((o) => {
      r && r(e);
      let i,
        s,
        a = !1;
      return (
        Array.isArray(o)
          ? ((s = o), (a = !0))
          : ((i = o.create(n).injector),
            (s = i.get(Ic, [], { optional: !0, self: !0 }).flat())),
        {
          routes: s.map(Ec),
          injector: i,
        }
      );
    }),
  );
}
function qw(e) {
  return e && typeof e == "object" && "default" in e;
}
function vh(e) {
  return qw(e) ? e.default : e;
}
var bc = (() => {
    let t = class t {};
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = w({ token: t, factory: () => p(Ww), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Ww = (() => {
    let t = class t {
      shouldProcessUrl(r) {
        return !0;
      }
      extract(r) {
        return r;
      }
      merge(r, o) {
        return r;
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  Zw = new M("");
var Qw = new M(""),
  Yw = (() => {
    let t = class t {
      get hasRequestedNavigation() {
        return this.navigationId !== 0;
      }
      constructor() {
        (this.currentNavigation = null),
          (this.currentTransition = null),
          (this.lastSuccessfulNavigation = null),
          (this.events = new oe()),
          (this.transitionAbortSubject = new oe()),
          (this.configLoader = p(zw)),
          (this.environmentInjector = p(De)),
          (this.urlSerializer = p(vc)),
          (this.rootContexts = p(ci)),
          (this.location = p(tr)),
          (this.inputBindingEnabled = p(Dc, { optional: !0 }) !== null),
          (this.titleStrategy = p(mh)),
          (this.options = p(Cc, { optional: !0 }) || {}),
          (this.paramsInheritanceStrategy =
            this.options.paramsInheritanceStrategy || "emptyOnly"),
          (this.urlHandlingStrategy = p(bc)),
          (this.createViewTransition = p(Zw, { optional: !0 })),
          (this.navigationErrorHandler = p(Qw, { optional: !0 })),
          (this.navigationId = 0),
          (this.afterPreactivation = () => b(void 0)),
          (this.rootComponentType = null);
        let r = (i) => this.events.next(new ec(i)),
          o = (i) => this.events.next(new tc(i));
        (this.configLoader.onLoadEndListener = o),
          (this.configLoader.onLoadStartListener = r);
      }
      complete() {
        this.transitions?.complete();
      }
      handleNavigationRequest(r) {
        let o = ++this.navigationId;
        this.transitions?.next(
          z(y(y({}, this.transitions.value), r), { id: o }),
        );
      }
      setupNavigations(r, o, i) {
        return (
          (this.transitions = new W({
            id: 0,
            currentUrlTree: o,
            currentRawUrl: o,
            extractedUrl: this.urlHandlingStrategy.extract(o),
            urlAfterRedirects: this.urlHandlingStrategy.extract(o),
            rawUrl: o,
            extras: {},
            resolve: () => {},
            reject: () => {},
            promise: Promise.resolve(!0),
            source: lr,
            restoredState: null,
            currentSnapshot: i.snapshot,
            targetSnapshot: null,
            currentRouterState: i,
            targetRouterState: null,
            guards: { canActivateChecks: [], canDeactivateChecks: [] },
            guardsResult: null,
          })),
          this.transitions.pipe(
            Me((s) => s.id !== 0),
            R((s) =>
              z(y({}, s), {
                extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
              }),
            ),
            xe((s) => {
              let a = !1,
                c = !1;
              return b(s).pipe(
                xe((u) => {
                  if (this.navigationId > s.id)
                    return (
                      this.cancelNavigationTransition(
                        s,
                        "",
                        pe.SupersededByNewNavigation,
                      ),
                      le
                    );
                  (this.currentTransition = s),
                    (this.currentNavigation = {
                      id: u.id,
                      initialUrl: u.rawUrl,
                      extractedUrl: u.extractedUrl,
                      targetBrowserUrl:
                        typeof u.extras.browserUrl == "string"
                          ? this.urlSerializer.parse(u.extras.browserUrl)
                          : u.extras.browserUrl,
                      trigger: u.source,
                      extras: u.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? z(y({}, this.lastSuccessfulNavigation), {
                            previousNavigation: null,
                          })
                        : null,
                    });
                  let l =
                      !r.navigated ||
                      this.isUpdatingInternalState() ||
                      this.isUpdatedBrowserUrl(),
                    d = u.extras.onSameUrlNavigation ?? r.onSameUrlNavigation;
                  if (!l && d !== "reload") {
                    let h = "";
                    return (
                      this.events.next(
                        new Lt(
                          u.id,
                          this.urlSerializer.serialize(u.rawUrl),
                          h,
                          Qa.IgnoredSameUrlNavigation,
                        ),
                      ),
                      u.resolve(!1),
                      le
                    );
                  }
                  if (this.urlHandlingStrategy.shouldProcessUrl(u.rawUrl))
                    return b(u).pipe(
                      xe((h) => {
                        let f = this.transitions?.getValue();
                        return (
                          this.events.next(
                            new gr(
                              h.id,
                              this.urlSerializer.serialize(h.extractedUrl),
                              h.source,
                              h.restoredState,
                            ),
                          ),
                          f !== this.transitions?.getValue()
                            ? le
                            : Promise.resolve(h)
                        );
                      }),
                      Lw(
                        this.environmentInjector,
                        this.configLoader,
                        this.rootComponentType,
                        r.config,
                        this.urlSerializer,
                        this.paramsInheritanceStrategy,
                      ),
                      ee((h) => {
                        (s.targetSnapshot = h.targetSnapshot),
                          (s.urlAfterRedirects = h.urlAfterRedirects),
                          (this.currentNavigation = z(
                            y({}, this.currentNavigation),
                            { finalUrl: h.urlAfterRedirects },
                          ));
                        let f = new ti(
                          h.id,
                          this.urlSerializer.serialize(h.extractedUrl),
                          this.urlSerializer.serialize(h.urlAfterRedirects),
                          h.targetSnapshot,
                        );
                        this.events.next(f);
                      }),
                    );
                  if (
                    l &&
                    this.urlHandlingStrategy.shouldProcessUrl(u.currentRawUrl)
                  ) {
                    let {
                        id: h,
                        extractedUrl: f,
                        source: g,
                        restoredState: E,
                        extras: V,
                      } = u,
                      B = new gr(h, this.urlSerializer.serialize(f), g, E);
                    this.events.next(B);
                    let Ie = sh(this.rootComponentType).snapshot;
                    return (
                      (this.currentTransition = s =
                        z(y({}, u), {
                          targetSnapshot: Ie,
                          urlAfterRedirects: f,
                          extras: z(y({}, V), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        })),
                      (this.currentNavigation.finalUrl = f),
                      b(s)
                    );
                  } else {
                    let h = "";
                    return (
                      this.events.next(
                        new Lt(
                          u.id,
                          this.urlSerializer.serialize(u.extractedUrl),
                          h,
                          Qa.IgnoredByUrlHandlingStrategy,
                        ),
                      ),
                      u.resolve(!1),
                      le
                    );
                  }
                }),
                ee((u) => {
                  let l = new Ya(
                    u.id,
                    this.urlSerializer.serialize(u.extractedUrl),
                    this.urlSerializer.serialize(u.urlAfterRedirects),
                    u.targetSnapshot,
                  );
                  this.events.next(l);
                }),
                R(
                  (u) => (
                    (this.currentTransition = s =
                      z(y({}, u), {
                        guards: nw(
                          u.targetSnapshot,
                          u.currentSnapshot,
                          this.rootContexts,
                        ),
                      })),
                    s
                  ),
                ),
                hw(this.environmentInjector, (u) => this.events.next(u)),
                ee((u) => {
                  if (
                    ((s.guardsResult = u.guardsResult),
                    u.guardsResult && typeof u.guardsResult != "boolean")
                  )
                    throw si(this.urlSerializer, u.guardsResult);
                  let l = new Ka(
                    u.id,
                    this.urlSerializer.serialize(u.extractedUrl),
                    this.urlSerializer.serialize(u.urlAfterRedirects),
                    u.targetSnapshot,
                    !!u.guardsResult,
                  );
                  this.events.next(l);
                }),
                Me((u) =>
                  u.guardsResult
                    ? !0
                    : (this.cancelNavigationTransition(u, "", pe.GuardRejected),
                      !1),
                ),
                Ha((u) => {
                  if (u.guards.canActivateChecks.length)
                    return b(u).pipe(
                      ee((l) => {
                        let d = new Ja(
                          l.id,
                          this.urlSerializer.serialize(l.extractedUrl),
                          this.urlSerializer.serialize(l.urlAfterRedirects),
                          l.targetSnapshot,
                        );
                        this.events.next(d);
                      }),
                      xe((l) => {
                        let d = !1;
                        return b(l).pipe(
                          jw(
                            this.paramsInheritanceStrategy,
                            this.environmentInjector,
                          ),
                          ee({
                            next: () => (d = !0),
                            complete: () => {
                              d ||
                                this.cancelNavigationTransition(
                                  l,
                                  "",
                                  pe.NoDataFromResolver,
                                );
                            },
                          }),
                        );
                      }),
                      ee((l) => {
                        let d = new Xa(
                          l.id,
                          this.urlSerializer.serialize(l.extractedUrl),
                          this.urlSerializer.serialize(l.urlAfterRedirects),
                          l.targetSnapshot,
                        );
                        this.events.next(d);
                      }),
                    );
                }),
                Ha((u) => {
                  let l = (d) => {
                    let h = [];
                    d.routeConfig?.loadComponent &&
                      !d.routeConfig._loadedComponent &&
                      h.push(
                        this.configLoader.loadComponent(d.routeConfig).pipe(
                          ee((f) => {
                            d.component = f;
                          }),
                          R(() => {}),
                        ),
                      );
                    for (let f of d.children) h.push(...l(f));
                    return h;
                  };
                  return Ur(l(u.targetSnapshot.root)).pipe(it(null), Ze(1));
                }),
                Ha(() => this.afterPreactivation()),
                xe(() => {
                  let { currentSnapshot: u, targetSnapshot: l } = s,
                    d = this.createViewTransition?.(
                      this.environmentInjector,
                      u.root,
                      l.root,
                    );
                  return d ? Z(d).pipe(R(() => s)) : b(s);
                }),
                R((u) => {
                  let l = KD(
                    r.routeReuseStrategy,
                    u.targetSnapshot,
                    u.currentRouterState,
                  );
                  return (
                    (this.currentTransition = s =
                      z(y({}, u), { targetRouterState: l })),
                    (this.currentNavigation.targetRouterState = l),
                    s
                  );
                }),
                ee(() => {
                  this.events.next(new vr());
                }),
                tw(
                  this.rootContexts,
                  r.routeReuseStrategy,
                  (u) => this.events.next(u),
                  this.inputBindingEnabled,
                ),
                Ze(1),
                ee({
                  next: (u) => {
                    (a = !0),
                      (this.lastSuccessfulNavigation = this.currentNavigation),
                      this.events.next(
                        new Ft(
                          u.id,
                          this.urlSerializer.serialize(u.extractedUrl),
                          this.urlSerializer.serialize(u.urlAfterRedirects),
                        ),
                      ),
                      this.titleStrategy?.updateTitle(
                        u.targetRouterState.snapshot,
                      ),
                      u.resolve(!0);
                  },
                  complete: () => {
                    a = !0;
                  },
                }),
                zi(
                  this.transitionAbortSubject.pipe(
                    ee((u) => {
                      throw u;
                    }),
                  ),
                ),
                An(() => {
                  !a &&
                    !c &&
                    this.cancelNavigationTransition(
                      s,
                      "",
                      pe.SupersededByNewNavigation,
                    ),
                    this.currentTransition?.id === s.id &&
                      ((this.currentNavigation = null),
                      (this.currentTransition = null));
                }),
                ot((u) => {
                  if (((c = !0), dh(u)))
                    this.events.next(
                      new tt(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        u.message,
                        u.cancellationCode,
                      ),
                    ),
                      ew(u)
                        ? this.events.next(
                            new Sn(u.url, u.navigationBehaviorOptions),
                          )
                        : s.resolve(!1);
                  else {
                    let l = new mr(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      u,
                      s.targetSnapshot ?? void 0,
                    );
                    try {
                      let d = Je(this.environmentInjector, () =>
                        this.navigationErrorHandler?.(l),
                      );
                      if (d instanceof Dr) {
                        let { message: h, cancellationCode: f } = si(
                          this.urlSerializer,
                          d,
                        );
                        this.events.next(
                          new tt(
                            s.id,
                            this.urlSerializer.serialize(s.extractedUrl),
                            h,
                            f,
                          ),
                        ),
                          this.events.next(
                            new Sn(d.redirectTo, d.navigationBehaviorOptions),
                          );
                      } else {
                        this.events.next(l);
                        let h = r.errorHandler(u);
                        s.resolve(!!h);
                      }
                    } catch (d) {
                      this.options.resolveNavigationPromiseOnError
                        ? s.resolve(!1)
                        : s.reject(d);
                    }
                  }
                  return le;
                }),
              );
            }),
          )
        );
      }
      cancelNavigationTransition(r, o, i) {
        let s = new tt(
          r.id,
          this.urlSerializer.serialize(r.extractedUrl),
          o,
          i,
        );
        this.events.next(s), r.resolve(!1);
      }
      isUpdatingInternalState() {
        return (
          this.currentTransition?.extractedUrl.toString() !==
          this.currentTransition?.currentUrlTree.toString()
        );
      }
      isUpdatedBrowserUrl() {
        let r = this.urlHandlingStrategy.extract(
            this.urlSerializer.parse(this.location.path(!0)),
          ),
          o =
            this.currentNavigation?.targetBrowserUrl ??
            this.currentNavigation?.extractedUrl;
        return (
          r.toString() !== o?.toString() &&
          !this.currentNavigation?.extras.skipLocationChange
        );
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })();
function Kw(e) {
  return e !== lr;
}
var Jw = (() => {
    let t = class t {};
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = w({ token: t, factory: () => p(Xw), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  mc = class {
    shouldDetach(t) {
      return !1;
    }
    store(t, n) {}
    shouldAttach(t) {
      return !1;
    }
    retrieve(t) {
      return null;
    }
    shouldReuseRoute(t, n) {
      return t.routeConfig === n.routeConfig;
    }
  },
  Xw = (() => {
    let t = class t extends mc {};
    (t.ɵfac = (() => {
      let r;
      return function (i) {
        return (r || (r = ia(t)))(i || t);
      };
    })()),
      (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  yh = (() => {
    let t = class t {};
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = w({ token: t, factory: () => p(eC), providedIn: "root" }));
    let e = t;
    return e;
  })(),
  eC = (() => {
    let t = class t extends yh {
      constructor() {
        super(...arguments),
          (this.location = p(tr)),
          (this.urlSerializer = p(vc)),
          (this.options = p(Cc, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = p(bc)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new nt()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = sh(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : (this.restoredState()?.ɵrouterPageId ?? this.currentPageId);
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(r) {
        return this.location.subscribe((o) => {
          o.type === "popstate" && r(o.url, o.state);
        });
      }
      handleRouterEvent(r, o) {
        if (r instanceof gr) this.stateMemento = this.createStateMemento();
        else if (r instanceof Lt) this.rawUrlTree = o.initialUrl;
        else if (r instanceof ti) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !o.extras.skipLocationChange
          ) {
            let i = this.urlHandlingStrategy.merge(o.finalUrl, o.initialUrl);
            this.setBrowserUrl(o.targetBrowserUrl ?? i, o);
          }
        } else
          r instanceof vr
            ? ((this.currentUrlTree = o.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                o.finalUrl,
                o.initialUrl,
              )),
              (this.routerState = o.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                !o.extras.skipLocationChange &&
                this.setBrowserUrl(o.targetBrowserUrl ?? this.rawUrlTree, o))
            : r instanceof tt &&
                (r.code === pe.GuardRejected ||
                  r.code === pe.NoDataFromResolver)
              ? this.restoreHistory(o)
              : r instanceof mr
                ? this.restoreHistory(o, !0)
                : r instanceof Ft &&
                  ((this.lastSuccessfulId = r.id),
                  (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(r, o) {
        let i = r instanceof nt ? this.urlSerializer.serialize(r) : r;
        if (this.location.isCurrentPathEqualTo(i) || o.extras.replaceUrl) {
          let s = this.browserPageId,
            a = y(y({}, o.extras.state), this.generateNgRouterState(o.id, s));
          this.location.replaceState(i, "", a);
        } else {
          let s = y(
            y({}, o.extras.state),
            this.generateNgRouterState(o.id, this.browserPageId + 1),
          );
          this.location.go(i, "", s);
        }
      }
      restoreHistory(r, o = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let i = this.browserPageId,
            s = this.currentPageId - i;
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === r.finalUrl &&
              s === 0 &&
              (this.resetState(r), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (o && this.resetState(r), this.resetUrlToCurrentUrlTree());
      }
      resetState(r) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            r.finalUrl ?? this.rawUrlTree,
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
        );
      }
      generateNgRouterState(r, o) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: r, ɵrouterPageId: o }
          : { navigationId: r };
      }
    };
    (t.ɵfac = (() => {
      let r;
      return function (i) {
        return (r || (r = ia(t)))(i || t);
      };
    })()),
      (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })(),
  cr = (function (e) {
    return (
      (e[(e.COMPLETE = 0)] = "COMPLETE"),
      (e[(e.FAILED = 1)] = "FAILED"),
      (e[(e.REDIRECTING = 2)] = "REDIRECTING"),
      e
    );
  })(cr || {});
function tC(e, t) {
  e.events
    .pipe(
      Me(
        (n) =>
          n instanceof Ft ||
          n instanceof tt ||
          n instanceof mr ||
          n instanceof Lt,
      ),
      R((n) =>
        n instanceof Ft || n instanceof Lt
          ? cr.COMPLETE
          : (
                n instanceof tt
                  ? n.code === pe.Redirect ||
                    n.code === pe.SupersededByNewNavigation
                  : !1
              )
            ? cr.REDIRECTING
            : cr.FAILED,
      ),
      Me((n) => n !== cr.REDIRECTING),
      Ze(1),
    )
    .subscribe(() => {
      t();
    });
}
function nC(e) {
  throw e;
}
var rC = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  oC = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  Dh = (() => {
    let t = class t {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.console = p($o)),
          (this.stateManager = p(yh)),
          (this.options = p(Cc, { optional: !0 }) || {}),
          (this.pendingTasks = p(pn)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = p(Yw)),
          (this.urlSerializer = p(vc)),
          (this.location = p(tr)),
          (this.urlHandlingStrategy = p(bc)),
          (this._events = new oe()),
          (this.errorHandler = this.options.errorHandler || nC),
          (this.navigated = !1),
          (this.routeReuseStrategy = p(Jw)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = p(Ic, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!p(Dc, { optional: !0 })),
          (this.eventsSubscription = new G()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (r) => {
                this.console.warn(r);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let r = this.navigationTransitions.events.subscribe((o) => {
          try {
            let i = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation;
            if (i !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(o, s),
                o instanceof tt &&
                  o.code !== pe.Redirect &&
                  o.code !== pe.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (o instanceof Ft) this.navigated = !0;
              else if (o instanceof Sn) {
                let a = o.navigationBehaviorOptions,
                  c = this.urlHandlingStrategy.merge(o.url, i.currentRawUrl),
                  u = y(
                    {
                      browserUrl: i.extras.browserUrl,
                      info: i.extras.info,
                      skipLocationChange: i.extras.skipLocationChange,
                      replaceUrl:
                        i.extras.replaceUrl ||
                        this.urlUpdateStrategy === "eager" ||
                        Kw(i.source),
                    },
                    a,
                  );
                this.scheduleNavigation(c, lr, null, u, {
                  resolve: i.resolve,
                  reject: i.reject,
                  promise: i.promise,
                });
              }
            }
            sC(o) && this._events.next(o);
          } catch (i) {
            this.navigationTransitions.transitionAbortSubject.next(i);
          }
        });
        this.eventsSubscription.add(r);
      }
      resetRootComponentType(r) {
        (this.routerState.root.component = r),
          (this.navigationTransitions.rootComponentType = r);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              lr,
              this.stateManager.restoredState(),
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (r, o) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(r, "popstate", o);
              }, 0);
            },
          );
      }
      navigateToSyncWithBrowser(r, o, i) {
        let s = { replaceUrl: !0 },
          a = i?.navigationId ? i : null;
        if (i) {
          let u = y({}, i);
          delete u.navigationId,
            delete u.ɵrouterPageId,
            Object.keys(u).length !== 0 && (s.state = u);
        }
        let c = this.parseUrl(r);
        this.scheduleNavigation(c, o, a, s);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(r) {
        (this.config = r.map(Ec)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(r, o = {}) {
        let {
            relativeTo: i,
            queryParams: s,
            fragment: a,
            queryParamsHandling: c,
            preserveFragment: u,
          } = o,
          l = u ? this.currentUrlTree.fragment : a,
          d = null;
        switch (c ?? this.options.defaultQueryParamsHandling) {
          case "merge":
            d = y(y({}, this.currentUrlTree.queryParams), s);
            break;
          case "preserve":
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = s || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let h;
        try {
          let f = i ? i.snapshot : this.routerState.snapshot.root;
          h = nh(f);
        } catch {
          (typeof r[0] != "string" || r[0][0] !== "/") && (r = []),
            (h = this.currentUrlTree.root);
        }
        return rh(h, r, d, l ?? null);
      }
      navigateByUrl(r, o = { skipLocationChange: !1 }) {
        let i = hr(r) ? r : this.parseUrl(r),
          s = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
        return this.scheduleNavigation(s, lr, null, o);
      }
      navigate(r, o = { skipLocationChange: !1 }) {
        return iC(r), this.navigateByUrl(this.createUrlTree(r, o), o);
      }
      serializeUrl(r) {
        return this.urlSerializer.serialize(r);
      }
      parseUrl(r) {
        try {
          return this.urlSerializer.parse(r);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(r, o) {
        let i;
        if (
          (o === !0 ? (i = y({}, rC)) : o === !1 ? (i = y({}, oC)) : (i = o),
          hr(r))
        )
          return Vf(this.currentUrlTree, r, i);
        let s = this.parseUrl(r);
        return Vf(this.currentUrlTree, s, i);
      }
      removeEmptyProps(r) {
        return Object.entries(r).reduce(
          (o, [i, s]) => (s != null && (o[i] = s), o),
          {},
        );
      }
      scheduleNavigation(r, o, i, s, a) {
        if (this.disposed) return Promise.resolve(!1);
        let c, u, l;
        a
          ? ((c = a.resolve), (u = a.reject), (l = a.promise))
          : (l = new Promise((h, f) => {
              (c = h), (u = f);
            }));
        let d = this.pendingTasks.add();
        return (
          tC(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: o,
            restoredState: i,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: r,
            extras: s,
            resolve: c,
            reject: u,
            promise: l,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          l.catch((h) => Promise.reject(h))
        );
      }
    };
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: "root" }));
    let e = t;
    return e;
  })();
function iC(e) {
  for (let t = 0; t < e.length; t++) if (e[t] == null) throw new D(4008, !1);
}
function sC(e) {
  return !(e instanceof vr) && !(e instanceof Sn);
}
var aC = new M("");
function wh(e, ...t) {
  return Mo([
    { provide: Ic, multi: !0, useValue: e },
    [],
    { provide: Mn, useFactory: cC, deps: [Dh] },
    { provide: Sa, multi: !0, useFactory: uC },
    t.map((n) => n.ɵproviders),
  ]);
}
function cC(e) {
  return e.routerState.root;
}
function uC() {
  let e = p(xt);
  return (t) => {
    let n = e.get(Rt);
    if (t !== n.components[0]) return;
    let r = e.get(Dh),
      o = e.get(lC);
    e.get(dC) === 1 && r.initialNavigation(),
      e.get(fC, null, T.Optional)?.setUpPreloading(),
      e.get(aC, null, T.Optional)?.init(),
      r.resetRootComponentType(n.componentTypes[0]),
      o.closed || (o.next(), o.complete(), o.unsubscribe());
  };
}
var lC = new M("", { factory: () => new oe() }),
  dC = new M("", { providedIn: "root", factory: () => 1 });
var fC = new M("");
var Ch = [];
var Eh = { providers: [lf({ eventCoalescing: !0 }), wh(Ch)] };
var hC = (e, t) => ({ hidden: e, flex: t }),
  li = class e {
    gradientColorClass =
      "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent";
    isMenuOpen = !1;
    static ɵfac = function (n) {
      return new (n || e)();
    };
    static ɵcmp = J({
      type: e,
      selectors: [["app-header"]],
      standalone: !0,
      features: [X],
      decls: 25,
      vars: 6,
      consts: [
        [
          1,
          "sticky",
          "top-0",
          "backdrop-blur-md",
          "text-white",
          "p-4",
          "z-50",
          "bg-black/25",
        ],
        [1, "container", "mx-auto", "flex", "justify-between", "items-center"],
        ["href", "#", 1, "text-3xl", "font-satisfy", "font-bold"],
        [1, "block", "md:hidden", "focus:outline-none", 3, "click"],
        [
          "fill",
          "none",
          "stroke",
          "currentColor",
          "viewBox",
          "0 0 24 24",
          "xmlns",
          "http://www.w3.org/2000/svg",
          1,
          "w-6",
          "h-6",
        ],
        [
          "stroke-linecap",
          "round",
          "stroke-linejoin",
          "round",
          "stroke-width",
          "2",
          "d",
          "M4 6h16M4 12h16m-7 6h7",
        ],
        [
          1,
          "hidden",
          "md:flex",
          "space-y-4",
          "md:space-y-0",
          "md:space-x-4",
          "font-semibold",
          "flex-col",
          "md:flex-row",
          "items-center",
          "md:items-center",
          "mt-4",
          "md:mt-0",
          3,
          "ngClass",
        ],
        [
          "href",
          "#about",
          1,
          "transition-transform",
          "duration-300",
          "ease-in-out",
          "hover:bg-gradient-to-r",
          "hover:from-purple-500",
          "hover:to-pink-500",
          "hover:bg-clip-text",
          "hover:text-transparent",
          "hover:border-b-2",
          "border-fuchsia-600",
        ],
        [
          "href",
          "#education",
          1,
          "transition-transform",
          "duration-300",
          "ease-in-out",
          "hover:bg-gradient-to-r",
          "hover:from-purple-500",
          "hover:to-pink-500",
          "hover:bg-clip-text",
          "hover:text-transparent",
          "hover:border-b-2",
          "border-fuchsia-600",
        ],
        [
          "href",
          "#achievements",
          1,
          "transition-transform",
          "duration-300",
          "ease-in-out",
          "hover:bg-gradient-to-r",
          "hover:from-purple-500",
          "hover:to-pink-500",
          "hover:bg-clip-text",
          "hover:text-transparent",
          "hover:border-b-2",
          "border-fuchsia-600",
        ],
        [
          "href",
          "#projects",
          1,
          "transition-transform",
          "duration-300",
          "ease-in-out",
          "hover:bg-gradient-to-r",
          "hover:from-purple-500",
          "hover:to-pink-500",
          "hover:bg-clip-text",
          "hover:text-transparent",
          "hover:border-b-2",
          "border-fuchsia-600",
        ],
        [
          "href",
          "#research",
          1,
          "transition-transform",
          "duration-300",
          "ease-in-out",
          "hover:bg-gradient-to-r",
          "hover:from-purple-500",
          "hover:to-pink-500",
          "hover:bg-clip-text",
          "hover:text-transparent",
          "hover:border-b-2",
          "border-fuchsia-600",
        ],
      ],
      template: function (n, r) {
        n & 1 &&
          (m(0, "header", 0)(1, "nav", 1)(2, "a", 2),
          S(3, "Pranta "),
          m(4, "span"),
          S(5, "Nath"),
          v()(),
          m(6, "button", 3),
          gt("click", function () {
            return (r.isMenuOpen = !r.isMenuOpen);
          }),
          Yn(),
          m(7, "svg", 4),
          U(8, "path", 5),
          v()(),
          $l(),
          m(9, "ul", 6)(10, "li")(11, "a", 7),
          S(12, "About"),
          v()(),
          m(13, "li")(14, "a", 8),
          S(15, "Education"),
          v()(),
          m(16, "li")(17, "a", 9),
          S(18, "Achievements"),
          v()(),
          m(19, "li")(20, "a", 10),
          S(21, "Projects"),
          v()(),
          m(22, "li")(23, "a", 11),
          S(24, "Research"),
          v()()()()()),
          n & 2 &&
            (A(4),
            de(r.gradientColorClass),
            A(5),
            te("ngClass", nf(3, hC, !r.isMenuOpen, r.isMenuOpen)));
      },
      dependencies: [zo],
    });
  };
var di = class e {
  gradientColorClass =
    "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent";
  downloadCV() {
    let t = document.createElement("a");
    (t.href = "./pranta_cv.pdf"),
      (t.download = "Pranta_Nath_Nayan_CV.pdf"),
      t.click();
  }
  about_one =
    "As a Developer, I create dynamic web applications using Angular and Django. I focus on building user-friendly interfaces that enhance engagement and functionality.";
  about_two =
    "As a Researcher, I delve into Software Engineering, Machine Learning, AI, and Deep Learning. I aim to advance these fields through innovative research and impactful solutions.";
  about_three =
    "As a Lifelong Learner, I am dedicated to continuous growth and staying updated with the latest advancements. Explore my portfolio and reach out for potential collaborations or discussions.";
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = J({
    type: e,
    selectors: [["app-about"]],
    standalone: !0,
    features: [X],
    decls: 34,
    vars: 7,
    consts: [
      [
        "id",
        "about",
        1,
        "min-h-screen",
        "flex",
        "items-center",
        "justify-center",
      ],
      [1, "text-white", "dark:text-black"],
      [1, "grid", "grid-cols-1", "gap-8", "md:grid-cols-2", "lg:grid-cols-2"],
      [1, "px-8"],
      [
        1,
        "pb-2.5",
        "text-4xl",
        "font-bold",
        "text-center",
        "md:text-right",
        "lg:text-right",
      ],
      [
        1,
        "pb-2.5",
        "text-xl",
        "font-bold",
        "text-center",
        "md:text-right",
        "lg:text-right",
      ],
      [
        1,
        "flex",
        "flex-col",
        "justify-between",
        "text-center",
        "md:text-right",
        "lg:text-right",
      ],
      [1, "mb-1"],
      [
        1,
        "pt-2.5",
        "text-2xl",
        "md:text-3xl",
        "flex",
        "items-center",
        "justify-center",
        "space-x-8",
        "text-center",
        "md:justify-end",
        "md:space-x-4",
        "lg:text-right",
        "lg:justify-end",
        "lg:text-4xl",
      ],
      [
        1,
        "bg-blue-700",
        "h-auto",
        "w-auto",
        "text-[11px]",
        "md:text-sm",
        "flex",
        "items-center",
        "rounded",
        "px-2",
        "cursor-pointer",
        "md:h-8",
        "lg:h-8",
        "transition-transform",
        "duration-300",
        "ease-in-out",
        "hover:bg-black",
        "hover:shadow-[0_0_25px_rgba(236,72,153,1),_0_0_50px_rgba(236,72,153,1)]",
        3,
        "click",
      ],
      [
        "href",
        "https://linkedin.com/in/pranta-nath-nayan",
        1,
        "rounded-full",
        "bg-transparent",
        "transition-transform",
        "duration-300",
        "ease-in-out",
        "hover:bg-gray-100",
        "hover:shadow-[0_0_25px_rgba(236,72,153,1),_0_0_50px_rgba(236,72,153,1)]",
        "hover:text-blue-500",
      ],
      [1, "bx", "bxl-linkedin", "border-black"],
      [
        "href",
        "https://github.com/prantanath",
        1,
        "rounded-full",
        "bg-transparent",
        "transition-transform",
        "duration-300",
        "ease-in-out",
        "hover:bg-black",
        "hover:shadow-[0_0_25px_rgba(236,72,153,1),_0_0_50px_rgba(236,72,153,1)]",
      ],
      [1, "bx", "bxl-github", "border-black"],
      [
        "href",
        "mailto:prantanathnayan@gmail.com",
        1,
        "rounded-full",
        "bg-transparent",
        "transition-transform",
        "duration-300",
        "ease-in-out",
        "hover:bg-gray-100",
        "hover:shadow-[0_0_25px_rgba(236,72,153,1),_0_0_50px_rgba(236,72,153,1)]",
        "hover:text-red-500",
      ],
      [1, "bx", "bxl-gmail", "border-black"],
      [
        "href",
        "https://scholar.google.co.uk/citations?user=plKXDw8AAAAJ&hl=en",
        1,
        "rounded-full",
        "bg-transparent",
        "transition-transform",
        "duration-300",
        "ease-in-out",
        "hover:bg-gray-300",
        "hover:shadow-[0_0_25px_rgba(236,72,153,1),_0_0_50px_rgba(236,72,153,1)]",
        "hover:text-blue-400",
      ],
      [1, "bx", "bxs-graduation", "border-black"],
      [1, "flex", "items-center", "justify-center"],
      [1, "relative", "h-60", "w-60"],
      [
        1,
        "absolute",
        "inset-0",
        "bottom-0",
        "bg-gradient-to-r",
        "from-purple-400",
        "via-pink-500",
        "to-red-500",
        "rounded-full",
        "shadow-lg",
        "transform",
        "scale-105",
      ],
      [
        "src",
        "file.png",
        "alt",
        "profile picture",
        1,
        "absolute",
        "w-full",
        "h-full",
        "object-cover",
        "rounded-full",
        "shadow-[0_0_25px_rgba(236,",
        "72,",
        "153,",
        "1)]",
        "transition-shadow",
        "duration-400",
        "ease-in-out",
        "hover:shadow-[0_0_25px_rgba(236,72,153,1),_0_0_50px_rgba(236,72,153,1)]",
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (m(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4),
        S(5, "Hi, It's "),
        m(6, "span"),
        S(7, "Pranta"),
        v()(),
        m(8, "div", 5),
        S(9, "I'm a "),
        m(10, "span"),
        S(11, "Developer, Researcher, and Learner"),
        v()(),
        m(12, "div", 6)(13, "div", 7),
        S(14),
        v(),
        m(15, "div", 7),
        S(16),
        v(),
        m(17, "div", 7),
        S(18),
        v()(),
        m(19, "div", 8)(20, "div", 9),
        gt("click", function () {
          return r.downloadCV();
        }),
        S(21, " Download\xA0CV "),
        v(),
        m(22, "a", 10),
        U(23, "i", 11),
        v(),
        m(24, "a", 12),
        U(25, "i", 13),
        v(),
        m(26, "a", 14),
        U(27, "i", 15),
        v(),
        m(28, "a", 16),
        U(29, "i", 17),
        v()()(),
        m(30, "div", 18)(31, "div", 19),
        U(32, "div", 20)(33, "img", 21),
        v()()()()()),
        n & 2 &&
          (A(6),
          de(r.gradientColorClass),
          A(4),
          de(r.gradientColorClass),
          A(4),
          mt(" ", r.about_one, " "),
          A(2),
          mt(" ", r.about_two, " "),
          A(2),
          mt(" ", r.about_three, " "));
    },
  });
};
var fi = class e {
  gradientColorClass =
    "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent";
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = J({
    type: e,
    selectors: [["app-education"]],
    standalone: !0,
    features: [X],
    decls: 15,
    vars: 2,
    consts: [
      ["id", "education", 1, "min-h-screen", "pt-20"],
      [1, "container", "mx-auto", "text-white", "mt-4"],
      [1, "text-4xl", "md:text-6xl", "font-bold", "text-center", "mb-6"],
      [1, "rounded-lg", "flex", "flex-col", "items-center", "justify-center"],
      [
        1,
        "text-xl",
        "md:text-2xl",
        "font-semibold",
        "text-center",
        "dark:text-black",
      ],
      ["src", "ewu_logo.svg", 1, "ml-8", "mb-4", "mt-6"],
      [1, "dark:text-gray-600", "text-lg", "text-gray-400", "mt-2"],
      [1, "dark:text-gray-600", "text-gray-500", "mt-2"],
      [1, "dark:text-gray-600", "text-gray-500", "mt-2", "text-center"],
    ],
    template: function (n, r) {
      n & 1 &&
        (m(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "span"),
        S(4, "Education"),
        v()(),
        m(5, "div", 3)(6, "h3", 4),
        S(7, "Bachelor of Science in Computer Science and Engineering"),
        v(),
        U(8, "img", 5),
        m(9, "p", 6),
        S(10, "East West University, 2019 - 2023"),
        v(),
        m(11, "p", 7),
        S(12, "Honors : Magna Cum Laude"),
        v(),
        m(13, "p", 8),
        S(14, "Extra-Curricular : Competitive Programming, Math Olympiad"),
        v()()()()),
        n & 2 && (A(3), de(r.gradientColorClass));
    },
  });
};
var pC = (e) => ({
  "text-blue-500 hover:underline hover:bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 hover:bg-clip-text hover:text-transparent hover:border-b-2 border-yellow-600 mt-4 inline-block":
    !0,
  "pointer-events-none": e,
});
function gC(e, t) {
  if (
    (e & 1 &&
      (m(0, "div", 5)(1, "div", 6),
      S(2),
      v(),
      m(3, "p", 7),
      S(4),
      v(),
      m(5, "p", 8),
      S(6),
      v(),
      m(7, "div", 9)(8, "div")(9, "a", 10),
      S(10, "View Project"),
      v()(),
      U(11, "div", 11),
      m(12, "div")(13, "a", 12),
      S(14, "Live View"),
      v()()()()),
    e & 2)
  ) {
    let n = t.$implicit;
    A(2),
      ze(n.title),
      A(2),
      mt(" Technologies: ", n.technologies.join(", "), " "),
      A(2),
      ze(n.description),
      A(3),
      te("href", n.link, Jn),
      A(4),
      te("href", n.live, Jn)("ngClass", tf(6, pC, !n.live));
  }
}
var hi = class e {
  gradientColorClass =
    "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent";
  projectsList = [
    {
      title: "GOOGLE CLASSROOM CLONE",
      description: `The project includes user login, registration by role, creating and joining
classrooms, creating posts and comments, and creating assignment and grading
functions.`,
      technologies: ["Django", "Python", "MySQL"],
      link: "https://github.com/prantanath/homeschool",
      live: "",
    },
    {
      title: "CODEGRINDER \u2013 A PROGRAMMING PROBLEM RECOMMENDER",
      description: `It extracts information that is publicly available from the specified coding profiles,
analyzes it, and recommends problem based on user rating and their desired
tags.`,
      technologies: ["Html", "Css", "Js", "Php"],
      link: "https://github.com/prantanath/codeGrinder",
      live: "https://codegrinder.000webhostapp.com/",
    },
    {
      title: "MUSIX",
      description:
        "Web app utilizing a public API to stream music. Implemented play and stop buttons, handled user interactions for playback control, and integrated a progress bar and timer to track song duration.",
      technologies: ["Angular", "Tailwind CSS", "TypeScript"],
      link: "https://github.com/prantanath/musix",
      live: "https://musix-200ea.web.app/",
    },
  ];
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = J({
    type: e,
    selectors: [["app-projects"]],
    standalone: !0,
    features: [X],
    decls: 7,
    vars: 3,
    consts: [
      ["id", "projects", 1, "min-h-screen", "pt-20"],
      [1, "container", "mx-auto", "mt-4"],
      [1, "text-4xl", "md:text-6xl", "font-bold", "text-center", "pb-32"],
      [
        1,
        "grid",
        "grid-cols-1",
        "md:grid-cols-2",
        "lg:grid-cols-3",
        "gap-8",
        "px-4",
        "text-white",
      ],
      [
        "class",
        "bg-gradient-to-r from-gray-900 via-gray-700 to-[#101010] p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex flex-col h-full",
        4,
        "ngFor",
        "ngForOf",
      ],
      [
        1,
        "bg-gradient-to-r",
        "from-gray-900",
        "via-gray-700",
        "to-[#101010]",
        "p-6",
        "rounded-lg",
        "shadow-lg",
        "hover:shadow-2xl",
        "transition-shadow",
        "duration-300",
        "transform",
        "hover:scale-105",
        "flex",
        "flex-col",
        "h-full",
      ],
      [1, "text-2xl", "font-bold", "truncate"],
      [
        1,
        "text-sm",
        "font-bold",
        "mt-2",
        "bg-yellow-500",
        "text-gray-900",
        "px-2",
        "py-1",
        "rounded",
      ],
      [1, "mt-2"],
      [1, "mt-auto", "flex", "font-bold"],
      [
        "target",
        "_blank",
        1,
        "text-blue-500",
        "hover:underline",
        "hover:bg-gradient-to-r",
        "from-yellow-400",
        "via-red-500",
        "to-pink-500",
        "hover:bg-clip-text",
        "hover:text-transparent",
        "hover:border-b-2",
        "border-yellow-600",
        "mt-4",
        "inline-block",
        3,
        "href",
      ],
      [1, "flex", "flex-auto"],
      ["target", "_blank", 3, "href", "ngClass"],
    ],
    template: function (n, r) {
      n & 1 &&
        (m(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "span"),
        S(4, "Projects"),
        v()(),
        m(5, "div", 3),
        Oe(6, gC, 15, 8, "div", 4),
        v()()()),
        n & 2 &&
          (A(3), de(r.gradientColorClass), A(3), te("ngForOf", r.projectsList));
    },
    dependencies: [yn, zo],
  });
};
function mC(e, t) {
  e & 1 && U(0, "div", 16);
}
function vC(e, t) {
  if (
    (e & 1 &&
      (m(0, "div", 13)(1, "div", 14),
      S(2),
      v(),
      Oe(3, mC, 1, 0, "div", 15),
      v()),
    e & 2)
  ) {
    let n = t.$implicit,
      r = t.last;
    A(2), ze(n), A(), te("ngIf", !r);
  }
}
function yC(e, t) {
  if (
    (e & 1 &&
      (m(0, "div", 17)(1, "h4", 18),
      S(2),
      v(),
      m(3, "p", 19),
      S(4),
      v(),
      m(5, "p", 20),
      S(6),
      v(),
      U(7, "div", 21),
      m(8, "div", 22)(9, "a", 23),
      S(10, "Read more"),
      v()()()),
    e & 2)
  ) {
    let n = t.$implicit;
    A(2),
      ze(n.title),
      A(2),
      ze(n.authors),
      A(2),
      ba("", n.journal, ", ", n.year, ""),
      A(3),
      te("href", n.link, Jn);
  }
}
var pi = class e {
  gradientColorClass =
    "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent";
  researchInterests = [
    "Artificial Intelligence and Machine Learning",
    "Deep Learning",
    "Software Engineering",
    "Natural Language Processing",
    "Data Science and Big Data Analytics",
  ];
  len = this.researchInterests.length;
  publicationsList = [
    {
      title: "Unmasking the Botnet Attacks: A Hybrid Deep Learning Approach",
      authors:
        "PN Nayan, M Mahajabin, A Rahman, N Maisha, MT Chowdhury, MM Uddin, RA Tuhin, MS Hossain Khan ",
      journal: "Smart Trends in Computing and Communications",
      year: 2024,
      link: "https://doi.org/10.1007/978-981-97-1313-4_38",
    },
    {
      title:
        "Impact Analysis of Rooftop Solar Photovoltaic Systems in Academic Buildings",
      authors: "PN Nayan, AK Ahammed, A Rahman, FT Johora, AW Reza, MS Arefin",
      journal: "Intelligent Computing and Optimization",
      year: 2023,
      link: "https://doi.org/10.1007/978-3-031-50330-6_32",
    },
  ];
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = J({
    type: e,
    selectors: [["app-research"]],
    standalone: !0,
    features: [X],
    decls: 18,
    vars: 4,
    consts: [
      ["id", "research", 1, "min-h-screen", "pt-20"],
      [1, "container", "mx-auto", "text-white", "mt-4"],
      [1, "text-4xl", "md:text-6xl", "font-bold", "text-center", "pb-16"],
      [1, "text-xl", "font-semibold", "text-center", "pb-8"],
      [
        1,
        "text-4xl",
        "font-bold",
        "mb-4",
        "bg-gradient-to-r",
        "from-yellow-400",
        "via-red-500",
        "to-pink-500",
        "bg-clip-text",
        "text-transparent",
      ],
      [
        1,
        "flex",
        "flex-wrap",
        "md:block",
        "lg:flex",
        "lg:flex-wrap",
        "items-center",
        "justify-center",
      ],
      [
        "class",
        "dark:text-black mb-2 flex items-center justify-center flex-col md:flex-col lg:flex-row",
        4,
        "ngFor",
        "ngForOf",
      ],
      [1, "text-xl", "font-semibold", "text-center"],
      [
        1,
        "mx-auto",
        "text-left",
        "grid",
        "grid-cols-1",
        "md:grid-cols-2",
        "lg:grid-cols-3",
        "gap-8",
        "p-4",
      ],
      [
        "class",
        "bg-gradient-to-r from-gray-800 via-gray-900 to-[#101010] p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex flex-col h-full",
        4,
        "ngFor",
        "ngForOf",
      ],
      [1, "flex", "flex-row-reverse"],
      [
        "href",
        "https://www.freecounterstat.com",
        "title",
        "free web page counter html code",
        1,
        "border-0",
      ],
      [
        "src",
        "https://counter2.optistats.ovh/private/freecounterstat.php?c=4x96zhq48dzuu28a5n6dnkng7rmnagb6",
        "title",
        "free web page counter html code",
        "alt",
        "free web page counter html code",
      ],
      [
        1,
        "dark:text-black",
        "mb-2",
        "flex",
        "items-center",
        "justify-center",
        "flex-col",
        "md:flex-col",
        "lg:flex-row",
      ],
      [1, "px-3", "text-center"],
      [
        "class",
        "h-[14px] w-[14px] rounded-full bg-pink-700 xl:h-[12px] xl:w-[12px]",
        4,
        "ngIf",
      ],
      [
        1,
        "h-[14px]",
        "w-[14px]",
        "rounded-full",
        "bg-pink-700",
        "xl:h-[12px]",
        "xl:w-[12px]",
      ],
      [
        1,
        "bg-gradient-to-r",
        "from-gray-800",
        "via-gray-900",
        "to-[#101010]",
        "p-6",
        "rounded-lg",
        "shadow-lg",
        "hover:shadow-2xl",
        "transition-shadow",
        "duration-300",
        "transform",
        "hover:scale-105",
        "flex",
        "flex-col",
        "h-full",
      ],
      [1, "text-2xl", "font-bold", "line-clamp-2"],
      [1, "mt-2", "text-gray-500", "truncate"],
      [1, "mt-1", "italic"],
      [1, "flex-grow"],
      [1, "mt-4"],
      [
        "target",
        "_blank",
        1,
        "text-blue-500",
        "hover:underline",
        "hover:bg-gradient-to-r",
        "from-yellow-400",
        "via-red-500",
        "to-pink-500",
        "hover:bg-clip-text",
        "hover:text-transparent",
        "hover:border-b-2",
        "border-yellow-600",
        3,
        "href",
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (m(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "span"),
        S(4, "Research"),
        v()(),
        m(5, "div", 3)(6, "h3", 4),
        S(7, "Research Interests"),
        v(),
        m(8, "div", 5),
        Oe(9, vC, 4, 2, "div", 6),
        v()(),
        m(10, "div", 7)(11, "h3", 4),
        S(12, "Publications"),
        v(),
        m(13, "div", 8),
        Oe(14, yC, 11, 5, "div", 9),
        v()()(),
        m(15, "div", 10)(16, "a", 11),
        U(17, "img", 12),
        v()()()),
        n & 2 &&
          (A(3),
          de(r.gradientColorClass),
          A(6),
          te("ngForOf", r.researchInterests),
          A(5),
          te("ngForOf", r.publicationsList));
    },
    dependencies: [yn, Go],
  });
};
function DC(e, t) {
  if ((e & 1 && (m(0, "li", 5)(1, "div", 6), S(2), v()()), e & 2)) {
    let n = t.$implicit;
    A(2), ze(n);
  }
}
var gi = class e {
  gradientColorClass =
    "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent";
  achievementList = [
    "EWU In-House Programming Battle Summer 2022 - Champion",
    "EWU In-House Programming Battle Spring 2023 - Runner-up",
    "EWU Intra Kick-Off Contest Fall 2022 - 2nd Runner-up",
    "Solved 1000+ problems in various Online Judge",
    "100% Merit Scholarship",
    "Dean's List Scholarship",
  ];
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = J({
    type: e,
    selectors: [["app-achievements"]],
    standalone: !0,
    features: [X],
    decls: 7,
    vars: 3,
    consts: [
      ["id", "achievements", 1, "min-h-screen", "pt-20", "pb-32"],
      [1, "container", "mx-auto", "mt-4", "text-white"],
      [1, "text-4xl", "md:text-6xl", "font-bold", "text-center", "pb-16"],
      [
        1,
        "space-y-6",
        "flex",
        "flex-col",
        "md:items-center",
        "dark:text-black",
      ],
      [
        "class",
        `p-2 rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105
          hover:bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 hover:bg-clip-text hover:text-transparent`,
        4,
        "ngFor",
        "ngForOf",
      ],
      [
        1,
        "p-2",
        "rounded-lg",
        "shadow-lg",
        "transform",
        "transition-transform",
        "duration-500",
        "hover:scale-105",
        "hover:bg-gradient-to-r",
        "from-yellow-400",
        "via-red-500",
        "to-pink-500",
        "hover:bg-clip-text",
        "hover:text-transparent",
      ],
      [1, "text-xl", "font-semibold", "mb-2"],
    ],
    template: function (n, r) {
      n & 1 &&
        (m(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "span"),
        S(4, "Awards and Achievements"),
        v()(),
        m(5, "ul", 3),
        Oe(6, DC, 3, 1, "li", 4),
        v()()()),
        n & 2 &&
          (A(3),
          de(r.gradientColorClass),
          A(3),
          te("ngForOf", r.achievementList));
    },
    dependencies: [yn],
  });
};
var mi = class e {
  themeSub = new W("light");
  theme$ = this.themeSub.asObservable();
  constructor() {
    let t = localStorage.getItem("theme") || "light";
    this.setTheme(t);
  }
  setTheme(t) {
    document.documentElement.classList.toggle("dark", t === "dark"),
      localStorage.setItem("theme", t),
      this.themeSub.next(t);
  }
  toggleTheme() {
    let n = this.themeSub.value === "light" ? "dark" : "light";
    this.setTheme(n);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" });
};
function wC(e, t) {
  e & 1 && (Yn(), m(0, "svg", 3), U(1, "path", 4), v());
}
function CC(e, t) {
  e & 1 && (Yn(), m(0, "svg", 5), U(1, "path", 6), v());
}
var vi = class e {
  isDarkMode = !1;
  themeService = p(mi);
  ngOnInit() {
    this.themeService.theme$.subscribe((t) => {
      this.isDarkMode = t === "dark";
    });
  }
  toggleTheme() {
    this.themeService.toggleTheme();
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = J({
    type: e,
    selectors: [["app-dark-mode"]],
    standalone: !0,
    features: [X],
    decls: 3,
    vars: 2,
    consts: [
      [
        1,
        "fixed",
        "h-8",
        "w-8",
        "p-0.5",
        "rounded-l-lg",
        "hover:bg-gray-700",
        3,
        "click",
      ],
      [
        "class",
        "fill-violet-700 block",
        "fill",
        "currentColor",
        "viewBox",
        "0 0 20 20",
        4,
        "ngIf",
      ],
      [
        "class",
        "fill-yellow-500",
        "fill",
        "currentColor",
        "viewBox",
        "0 0 20 20",
        4,
        "ngIf",
      ],
      [
        "fill",
        "currentColor",
        "viewBox",
        "0 0 20 20",
        1,
        "fill-violet-700",
        "block",
      ],
      [
        "d",
        "M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z",
      ],
      ["fill", "currentColor", "viewBox", "0 0 20 20", 1, "fill-yellow-500"],
      [
        "d",
        `M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1
        0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100
        2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414
        8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z`,
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (m(0, "button", 0),
        gt("click", function () {
          return r.toggleTheme();
        }),
        Oe(1, wC, 2, 0, "svg", 1)(2, CC, 2, 0, "svg", 2),
        v()),
        n & 2 &&
          (A(), te("ngIf", !r.isDarkMode), A(), te("ngIf", r.isDarkMode));
    },
    dependencies: [Go],
  });
};
var yi = class e {
  title = "portfolio";
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = J({
    type: e,
    selectors: [["app-root"]],
    standalone: !0,
    features: [X],
    decls: 8,
    vars: 0,
    consts: [
      [1, "bg-[#101010]", "font-space", "dark:bg-[#d0d3d4]", "dark:text-black"],
      [1, "flex", "flex-row-reverse"],
    ],
    template: function (n, r) {
      n & 1 &&
        (m(0, "div", 0),
        U(1, "app-header")(2, "app-dark-mode", 1)(3, "app-about")(
          4,
          "app-education",
        )(5, "app-achievements")(6, "app-projects")(7, "app-research"),
        v());
    },
    dependencies: [li, di, fi, hi, pi, gi, vi],
  });
};
Lf(yi, Eh).catch((e) => console.error(e));
