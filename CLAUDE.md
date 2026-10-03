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
- **In this Playwright build `browser_click` wants the ref in `target`.** A
  human-readable description fails with "does not match any elements" whenever
  the control's text sits in a child `generic` rather than its accessible name.

## Estado

**2026-10-03**

Hecho:

- **`GH_PAT_REPOS` ya puede escribir secrets en `claudiavas/portfolio`.** En la
  página del token: añadido ese repo a *Only select repositories* (junto a
  `comunaris`), con *Read and Write access to secrets*. Sin fecha de expiración
  (decisión de Claudia).
- **Arreglado un segundo caso del bug `--body -`**, esta vez en
  `sync-github-secrets-portfolio.yml` del monorepo: `gh secret set … --body -`
  guardaba el guion literal en lugar de leer stdin. Commit en `repos-private`.
  No había llegado al bundle publicado, que ya tenía los valores buenos.
- **El sync y el deploy pasaron en verde** y el bundle servido se verificó: los
  cuatro argumentos de `sendForm` son valores reales (longitudes 17/18/12/19),
  sin `-` ni `undefined`.
- **El Public Key quedó correcto.** Un envío real contra
  `api.emailjs.com/.../email/send` ya **no** devuelve `404 Account not found`:
  la cuenta, el servicio y la plantilla se resuelven bien.

Pendiente:

- [ ] **El formulario sigue sin enviar, por un único motivo:** el envío real
      devuelve `412 Gmail_API: Invalid grant. Please reconnect your Gmail
      account`. El servicio de EmailJS sigue siendo el de Gmail con el permiso
      OAuth caducado.
- [ ] **Crear el servicio Brevo en EmailJS.** El formulario *Config Service*
      quedó abierto y relleno: Name `Brevo`, Service ID `service_ifq6iqk`
      (generado solo), User Email `claudia.vasquez.as@gmail.com`, *Send test
      email* marcado. **Falta que Claudia pegue la SMTP Key** — Claude no puede
      teclearla sin que el valor entre en el historial. Después: marcarlo como
      `default`.
- [ ] **Actualizar `EMAILJS_SERVICE_ID`** al ID del servicio nuevo en
      `claudiavas/repos-private` y en `claudiavas/portfolio`, redesplegar y
      confirmar que un envío real desde `claudiavasquez.dev/contact` llega.
- [ ] **Rotar la contraseña filtrada** (la que Chromium autorellenó en el campo
      SMTP Key, dos veces). Es de Claudia; sigue sin hacerse.

Siguiente paso: Claudia pega la SMTP Key de Brevo en el formulario abierto y lo
crea; luego se actualiza el `EMAILJS_SERVICE_ID` en los dos repos, se
redespliega y se comprueba un envío real.
