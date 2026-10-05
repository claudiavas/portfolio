# My_Portfolio

Personal portfolio site. Create React App, deployed to GitHub Pages at
`claudiavasquez.dev` (the domain comes from `public/CNAME`).

## Architecture

- **CRA + react-router.** Sections are routes, not anchors: `/contact` is a
  route rendered by `App.js`, so `claudiavasquez.dev/contact` loaded directly
  returns a GitHub Pages 404 — there is no SPA fallback. The route only works
  by navigating inside the app. Worth knowing before testing a deep link.
- **Contact form:** `src/components/Contact.jsx`, sending through EmailJS
  (`emailjs.sendForm`). Fields are `user_name`, `user_email`, `message`.
- **Deploy:** GitHub Actions, triggered on push. The three EmailJS identifiers
  are injected at build time from repository secrets.

## Decisiones

### 2026-10-02 — The EmailJS identifiers live in secrets, not in the source

**Qué:** `REACT_APP_EMAILJS_SERVICE_ID`, `REACT_APP_EMAILJS_TEMPLATE_ID` and
`REACT_APP_EMAILJS_PUBLIC_KEY` are read from the environment. They are kept as
secrets in `claudiavas/repos-private` and copied to `claudiavas/portfolio` by
`.github/workflows/sync-github-secrets-portfolio.yml` in the monorepo.

**Por qué:** changing the EmailJS service or template used to mean a commit in a
public repo. It no longer does.

**Lo que esto NO es:** a security measure. CRA inlines `REACT_APP_*` at compile
time, so all three values are readable in the published JS by anyone. A form
that posts from the browser must carry them. The only things that actually limit
their use are on the EmailJS side: the allowed-domain list, the plan quota, and
a captcha. Moving sending to a serverless function would put the key
server-side — considered and not done, overkill for a portfolio.

### 2026-10-02 — The contact form sends through Brevo SMTP, not Gmail OAuth

**Qué:** the EmailJS service is being repointed from the Gmail (OAuth) provider
to Brevo over Custom SMTP. EmailJS itself stays: the form code does not change,
only the provider behind the service in its panel.

**Por qué:** the Gmail OAuth grant expires. A real send returned
`412 Gmail_API: Invalid grant. Please reconnect your Gmail account`. Google
invalidates refresh tokens on password changes, security reviews and inactivity,
so reconnecting only resets the clock — the form would break again, silently,
with no notification. An SMTP key does not expire.

**Alternativas descartadas:**

- *Reconnect Gmail and move on* — two clicks, but the same failure returns.
- *Resend* — cleaner API and a larger free tier, but it needs a new account, a
  new credential and domain verification for `claudiavasquez.dev`.
- *Drop EmailJS for an own endpoint* — would put the key server-side and remove
  the reliance on the domain allow-list, but GitHub Pages is static, so it needs
  a separate function (Vercel) plus a form rewrite. Not worth it for a portfolio
  contact form; revisit if the form ever gets abused.

**Nota:** the private key must never become a `REACT_APP_*` variable. CRA would
inline it into the public bundle. The browser form does not need it.

## Gotchas

- **This build emits most chunks at the root of `build/`**, not under
  `static/js/`. To check what shipped, scan every `src="/….js"` in the served
  HTML, not just the `static/js/` ones.
- **`https://claudiavasquez.dev` answers 403 to a request with no
  `User-Agent`.** Add one when checking it with curl or urllib.
- **`gh secret set NAME --body -` does not read stdin.** It stores the literal
  `-`. Omit `--body` entirely and `gh` reads the value from stdin. This shipped
  a build calling `sendForm("-","-",form.current,"-")` on 2026-10-01.
- **GitHub Actions masks secrets as `***`.** A `-` in a log is a real value.
- Only `claudiavasquez.dev` serves the site. `www.` has no DNS and
  `claudiavas.github.io` returns 404, so the allow-list needs one entry.
- **The allowed-domain list lives in Account → Security**, not Account →
  General. Reading `#domains_domain` from the General tab finds nothing and
  looks like an empty list; it is the wrong panel. On 2026-10-02 this produced a
  false "the domain did not persist" diagnosis.
- **A transparent `._locker_…` div covering "Save Changes" means there is
  nothing to save.** Playwright reports it as `intercepts pointer events` and
  the click times out. It is the saved state, not a broken button — confirm by
  reloading and re-reading the list instead of forcing the click.
- **A Playwright snapshot shows password fields in clear text.** Masking is
  visual only: the accessibility snapshot reports an `input[type=password]`
  `value` like any other field's. Worse, the MCP browser keeps its own
  persistent profile with its own saved logins, so a credential field on a
  domain it knows arrives **already autofilled** — even on a freshly opened
  creation form. On 2026-10-02 this put an account password into the
  conversation history, read from the EmailJS "SMTP Key" field of a brand-new
  service form nobody had typed into. Before snapshotting any form with
  credential fields, clear them and confirm with `browser_evaluate` that they
  are empty; never read the snapshot first. The profile was deleted that day
  (`~/Library/Caches/ms-playwright/mcp-chrome-*`), so it starts with no saved
  passwords — but it will save them again if a login is accepted in that window.
  **It happened a second time on 2026-10-03**, with the field already cleared and
  verified empty: the leak came from `grep`-ing the snapshot file Playwright had
  written *before* the clearing. Deleting the profile did not prevent the
  autofill either — Chromium had saved the password again. So the rule is:
  **never read a snapshot file of a page with credential fields.** Clear the
  field with `browser_evaluate`, set its `autocomplete` to `new-password`, and
  read the form's state only through `browser_evaluate`, returning value
  *lengths* and never values. Two snapshot files held the credential that day;
  `grep -rl` over `.playwright-mcp/` is what found them.
- **The sections are routes, so an `href="#seccion"` navigates nowhere.** The
  "Contact Me" button on the home page was an `<a href="#contact">` whose
  `onClick` called a `handleNavClick` prop that `App.js` never passed to
  `Home`, so it only ran `preventDefault()` and then threw. Anything that moves
  between sections uses `<Link to="/…">` from react-router, like the two menus
  do.
- **The EmailJS "SMTP Key" input has an `id`, not a `name`.**
  `document.querySelector('input[name="service_password"]')` returns `null`
  while the field is right there. Match on either:
  `[...document.querySelectorAll('input')].find(i => (i.name||i.id) === 'service_password')`.
  Clicking the eye icon also flips it from `type=password` to `type=text`, so a
  selector pinned to the type stops matching.
- **A JavaScript `.click()` does not fire EmailJS's React handlers.** "Set as
  Default" in the service dropdown never took effect that way, not even chained
  with waits. It needs a real Playwright click — which needs a snapshot ref,
  which is exactly what is forbidden on a page with credential fields. So that
  toggle is not automatable here; it has to be clicked by hand.
- **The EmailJS send API answers `403 "API access from non-browser
  environments is currently disabled."`** A curl cannot validate a service. The
  check has to run in a browser, which in practice means submitting the
  published form and reading the response.
- **EmailJS sends through XHR, not `fetch`.** To capture the response of a real
  submit, patch `XMLHttpRequest.prototype.open`/`send` before clicking; a
  `window.fetch` wrapper alone sees nothing.
- **The `DEFAULT` badge on an EmailJS service does not affect the form.**
  `sendForm` takes the `service_id` as an explicit argument, so it never falls
  back to a default. The badge only preselects a service when creating a
  template or sending a test from the EmailJS panel. Proof: the published bundle
  calls `service_ifq6iqk` and a real submit returned `200 OK` while the Gmail
  service — broken with `Invalid grant` — still carried the badge.
- **In this Playwright build `browser_click` wants the ref in `target`.** A
  human-readable description fails with "does not match any elements" whenever
  the control's text sits in a child `generic` rather than its accessible name.

## Estado

**2026-10-05**

**El formulario de contacto y el botón que lleva a él funcionan en producción.**

Hecho en esta sesión:

- **Arreglado el botón "Contact Me" de la portada**, que no llevaba a ninguna
  parte. Era un `<a href="#contact">` cuyo `onClick` llamaba a una prop
  `handleNavClick` que `App.js` nunca pasaba a `Home`: hacía `preventDefault()`
  —cancelaba la navegación— y acto seguido petaba. Ahora es un
  `<Link to="/contact">`, como hacen los dos menús. Commit `7e1b757`, mergeado a
  `main`, deploy `37147092194` en verde.
- **Comprobado en producción con un clic real**: `claudiavasquez.dev` → el botón
  → URL `/contact`, formulario pintado, consola sin errores. Ojo con la caché de
  GitHub Pages: justo tras el deploy seguía sirviendo el bundle viejo; con
  `?v=2` ya venía el nuevo.
- **Revisados los demás `href="#…"`**: los del `Footer` son modales de Bootstrap
  (`data-bs-toggle="modal"`), navegación legítima. El fallo estaba aislado.
- **Borrado el servicio Gmail `service_o7rx2pi`** en EmailJS. Queda Brevo
  (`service_ifq6iqk`) como único servicio. No era necesario para que funcionara
  —el formulario llama a un `service_id` explícito— pero un servicio muerto
  marcado `DEFAULT` confunde a quien abra el panel dentro de seis meses.

Pendiente:

- [ ] **Rotar la contraseña filtrada.** Chromium la autorellenó en el campo SMTP
      Key y llegó dos veces al historial de la conversación. Es de Claudia.
- [ ] **Valorar rotar la Public Key de EmailJS**, que también pasó por el
      historial. Menor gravedad: viaja al navegador en el bundle de todas
      formas, lo que de verdad la limita es la lista de dominios permitidos.
- [ ] **Valorar cómo entregar una credencial a un formulario del navegador** sin
      que pase por el portapapeles. Hoy se hizo con
      `with-secret.sh … -- pbcopy`, que no la expone por pantalla ni a disco,
      pero la deja en el portapapeles hasta que se limpia a mano.

Siguiente paso: nada bloqueante en este repo. Al retomar, rotar la contraseña.
