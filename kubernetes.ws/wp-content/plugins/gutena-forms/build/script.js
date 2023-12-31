document.addEventListener("DOMContentLoaded", (function() {
    const e = e => null == e || "" == e,
        t = (e, t) => (" " + e.className + " ").indexOf(" " + t + " ") > -1,
        r = (e, t) => {
            let r = [];
            for (; e.parentNode !== document.body;) e.matches(t) && r.push(e), e = e.parentNode;
            return r
        },
        o = (r, o, l, n, a) => {
            fetch(gutenaFormsBlock.ajax_url, {
                method: "POST",
                credentials: "same-origin",
                body: o
            }).then((e => e.json())).then((o => {
                if (l.disabled = !1, n.innerHTML = a, r.classList.remove("form-progress"), e(o) || "error" !== o.status) {
                    if (r.reset(), r.classList.add("display-success-message"), t(r, "hide-form-after-submit") && r.classList.add("hide-form-now"), t(r, "after_submit_redirect_url")) {
                        let t = r.querySelector('input[name="redirect_url"]');
                        (e(t) || 0 === t.length) && console.log("redirect_url not found"), t = t.value, e(t) ? console.log("redirect_url", t) : setTimeout((() => {
                            location.href = t
                        }), 2e3)
                    }
                } else {
                    r.classList.add("display-error-message");
                    let t = r.querySelector(".wp-block-gutena-form-error-msg .gutena-forms-error-text");
                    (e(t) || 0 === t.length) && console.log("errorMsgElement not found"), t.innerHTML = o.message, console.log("Form Message", o)
                }
            }))
        },
        l = o => {
            if (e(o)) return console.log("No input fields found"), !1;
            let l = "",
                n = t(o, "required-field"),
                a = r(o, ".wp-block-gutena-field-group");
            if (e(a)) return console.log("field_group not defined"), !1;
            a = a[0];
            let s = t(o, "checkbox-field") || t(o, "radio-field");
            if (s) {
                let t = o.querySelectorAll("input");
                if (e(t)) return console.log("checkboxRadioHtml not defined"), !1;
                for (let e = 0; e < t.length; e++)
                    if (t[e].checked) {
                        l = t[e].value;
                        break
                    }
            } else l = o.value;
            let c = a.querySelector(".gutena-forms-field-error-msg");
            if (e(c)) return console.log("errorHTML not defined"), !1;
            if (a.classList.remove("display-error"), n && (e(l) || t(o, "select-field") && "select" === l)) {
                a.classList.add("display-error");
                let e = gutenaFormsBlock.required_msg;
                return t(o, "select-field") && (e = gutenaFormsBlock.required_msg_select), s && (e = gutenaFormsBlock.required_msg_check), c.innerHTML = e, !1
            }
            if (!e(l) && t(o, "email-field") && !l.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) return a.classList.add("display-error"), c.innerHTML = gutenaFormsBlock.invalid_email_msg, !1;
            if (!e(l) && t(o, "number-field")) {
                let t = o.getAttribute("min"),
                    r = o.getAttribute("max");
                if (!e(t) && l < t) return a.classList.add("display-error"), c.innerHTML = gutenaFormsBlock.min_value_msg + " " + t, !1;
                if (!e(r) && l > r) return a.classList.add("display-error"), c.innerHTML = gutenaFormsBlock.max_value_msg + " " + r, !1
            }
            return !0
        },
        n = (t, r) => {
            if (!e(t)) {
                let o = t.querySelector(".range-input-value");
                e(t) || (o.innerHTML = r)
            }
        };
    (() => {
        let e = document.querySelectorAll(".wp-block-gutena-forms .range-field");
        if (0 < e.length)
            for (let t = 0; t < e.length; t++) n(e[t].parentNode, e[t].value), e[t].addEventListener("input", (function() {
                n(this.parentNode, this.value)
            }))
    })(), (() => {
        let e = document.querySelectorAll(".wp-block-gutena-forms .gutena-forms-field");
        if (0 < e.length)
            for (let t = 0; t < e.length; t++) e[t].addEventListener("input", (function() {
                l(e[t])
            }))
    })(), (() => {
        let t = document.querySelectorAll(".wp-block-gutena-forms .gutena-forms-submit-button");
        if (0 < t.length)
            for (let n = 0; n < t.length; n++) t[n].addEventListener("click", (function(a) {
                a.preventDefault();
                let s = r(this, ".wp-block-gutena-forms");
                if (void 0 === s) return void console.log("Form not defined");
                s = s[0];
                let c = s.querySelectorAll(".gutena-forms-field");
                if (0 === c.length) return void console.log("No input fields found");
                let i = !0,
                    u = c[0];
                for (let e = 0; e < c.length; e++) !1 === l(c[e]) && (!0 === i && (u = c[e]), i = !1);
                if (!1 === i) return s.classList.add("display-error-message"), void u.scrollIntoView({
                    behavior: "smooth"
                });
                s.classList.add("form-progress");
                let d = this.querySelector(".wp-block-button__link"),
                    g = d.innerHTML;
                this.disabled = !0, d.innerHTML = '<div class="gutena-forms-btn-progress"><div></div><div></div><div></div><div></div></div>';
                let m = new FormData(s);
                if (m.append("nonce", gutenaFormsBlock.nonce), m.append("action", gutenaFormsBlock.submit_action), s.classList.remove("display-error-message"), s.classList.remove("display-success-message"), e(gutenaFormsBlock.grecaptcha_type) || "v3" !== gutenaFormsBlock.grecaptcha_type || e(gutenaFormsBlock.grecaptcha_site_key)) o(s, m, t[n], d, g);
                else {
                    let r = s.querySelector('input[name="recaptcha_enable"]');
                    !e(r) && 0 != r.length && r.value ? "undefined" == typeof grecaptcha || null === grecaptcha ? (console.log("grecaptcha not defined"), o(s, m, t[n], d, g)) : grecaptcha.ready((function() {
                        grecaptcha.execute(gutenaFormsBlock.grecaptcha_site_key, {
                            action: "submit"
                        }).then((function(e) {
                            m.append("g-recaptcha-response", e), o(s, m, t[n], d, g)
                        }))
                    })) : o(s, m, t[n], d, g)
                }
            }))
    })(), setTimeout((() => {
        (() => {
            if ("undefined" != typeof gutenaFormsBlock && !e(gutenaFormsBlock.grecaptcha_type) && !e(gutenaFormsBlock.grecaptcha_site_key)) {
                let t = document.querySelector(".wp-block-gutena-forms");
                if (!e(t)) {
                    let r = t.querySelector('input[name="recaptcha_enable"]');
                    if (!e(r) && 0 != r.length && r.value && ("undefined" == typeof grecaptcha || null === grecaptcha)) {
                        let t = document.getElementById("google-recaptcha-js");
                        if (e(t)) {
                            let r = document.getElementById("gutena-forms-script-js");
                            e(r) || (t = document.createElement("script"), t.id = "google-recaptcha-js", grecaptcha_url = "https://www.google.com/recaptcha/api.js", "v3" === gutenaFormsBlock.grecaptcha_type && (grecaptcha_url += "?render=" + gutenaFormsBlock.grecaptcha_site_key), t.src = grecaptcha_url, document.head.insertBefore(t, r))
                        }
                    }
                }
            }
        })()
    }), 2e3)
}));