# Deployment & Hosting

The site is hosted on **GitHub Pages** with the custom domain **dryfabrications.com**.

## Repository
- Remote: `git@github.com:LeafSoap/dryfab.git` (SSH).
- GitHub user: `LeafSoap`. Repo name: `dryfab` (public).
- Default branch: `main`. SSH auth is configured and working on this machine.
- Temporary Pages URL (before custom domain verifies): `https://leafsoap.github.io/dryfab/`.

## Required files (must stay committed — do not gitignore)
- `CNAME` — contains `dryfabrications.com`; tells Pages the custom domain.
- `.nojekyll` — disables Jekyll so files are served as-is.
- `index.html`, `style.css` — the site.

## GitHub Pages setup (one-time, in browser)
1. Repo **Settings -> Pages**.
2. Source: **Deploy from a branch**; Branch: `main`; folder `/ (root)`.
3. Custom domain: `dryfabrications.com` (reads the committed CNAME).
4. After DNS verifies, enable **Enforce HTTPS**.

## DNS records (at the domain registrar)
Apex `dryfabrications.com` -> four A records:
```
A  @  185.199.108.153
A  @  185.199.109.153
A  @  185.199.110.153
A  @  185.199.111.153
```
`www` subdomain -> one CNAME record:
```
CNAME  www  leafsoap.github.io.
```
- Delete any default/parking A records for `@` first to avoid conflicts.
- Propagation can take minutes to a few hours.
- Domain was purchased for a 1-year term. Registrar: TBD (confirm with user before giving
  registrar-specific DNS click-paths).

## Deploy workflow
- Static site, **no build step**. Edit files, commit, push to `main`; Pages redeploys automatically.
- Local preview: `python -m http.server 8000` then open `http://localhost:8000`.
  (Note: the environment's web-fetch tool forces HTTPS, so verify local HTTP previews via
  `Invoke-WebRequest`, not that tool.)

## Environment notes
- Dev machine is Windows / PowerShell. `git` 2.42 is installed; GitHub CLI (`gh`) is NOT installed.
- Chaining commands: use `;` (PowerShell), not `&&`.
