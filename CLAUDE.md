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
- **In this Playwright build `browser_click` wants the ref in `target`.** A
  human-readable description fails with "does not match any elements" whenever
  the control's text sits in a child `generic` rather than its accessible name.

## Estado

**2026-10-02**

Hecho:

- The three EmailJS identifiers moved out of the source into secrets, in both
  `claudiavas/repos-private` and `claudiavas/portfolio`.
- Fixed the `--body -` bug that had published a build sending literal dashes.
  Verified in the served bundle: each identifier appears once, no `-`, no
  `undefined`.
- Added `sync-github-secrets-portfolio.yml` to the monorepo (commit `394136e`).
- **Verified the allowed-domain list is set and saved:** Account → Security
  lists `https://claudiavasquez.dev` as its single entry, and it survives a full
  reload. An earlier note here claimed the list had come up empty; that reading
  was taken from the wrong tab.

Pendiente:

- [ ] **The contact form does not send.** A real submit from
      `claudiavasquez.dev/contact` returns `404 Account not found` from
      `api.emailjs.com/api/v1.0/email/send-form`. Cause: the Public Key in
      `.env.local` is not this account's. Compared by SHA-256 prefix against
      the dashboard — service `75c4b1ef` and template `1f4f0044` match, public
      key `9d491aac` (local) vs `0a6d6fca` (dashboard) does not. Same length,
      different value, so it is a stale or mistyped key, not another account.
      This predates the move to secrets: `.env.local` already held the wrong
      value.
- [ ] **`GH_PAT_REPOS` cannot write secrets to `claudiavas/portfolio`.** The
      sync workflow's pre-flight guard stops before writing (run
      36934728125). Give the token that repo with *Secrets: Read and write* —
      that repo only, not "all repos" — then re-run the workflow.

**There is no configurable send limit on this plan.** Only the plan quota:
200/month, resetting on the 24th. "Increase request limit" goes to the paid
plan. So of the two restrictions worth having on the EmailJS side, the domain
allow-list is in place and a send cap is not available.

Siguiente paso: Claudia pastes the real Public Key into
`~/Repos/.env.keys.temp` as `EMAILJS_PUBLIC_KEY=` (the slot is already there,
empty); then upload it to the secrets of both repos, redeploy, and confirm a
real send from the live form arrives. The domain allow-list needs no further
work — it is already correct, and it is what will be exercised by that send.
