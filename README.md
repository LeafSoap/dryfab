# dryfab

ASCII-styled informational site for the game studio **Dry Fabrications**, hosted on GitHub Pages at [dryfabrications.com](https://dryfabrications.com).

## Files

| File         | Purpose                                                    |
|--------------|------------------------------------------------------------|
| `index.html` | The entire site (hero, about, games, team, contact).       |
| `style.css`  | ASCII / terminal aesthetic (green-on-black monospace).     |
| `CNAME`      | Tells GitHub Pages to serve the site at `dryfabrications.com`. |
| `.nojekyll`  | Disables Jekyll processing so files are served as-is.      |

## Local preview

Just open `index.html` in a browser, or run a tiny static server:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy (GitHub Pages)

1. Push to the `main` branch of `github.com/LeafSoap/dryfab`.
2. Repo **Settings -> Pages**: set **Source** = "Deploy from a branch", **Branch** = `main`, folder = `/ (root)`.
3. Under **Custom domain**, confirm `dryfabrications.com` is set (the `CNAME` file handles this automatically).
4. Configure DNS at your registrar (see below).
5. Once DNS verifies, enable **Enforce HTTPS**.

## DNS records to add at your registrar

Apex domain (`dryfabrications.com`) -> four **A** records pointing to GitHub Pages:

```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

`www` subdomain -> one **CNAME** record:

```
CNAME    www    LeafSoap.github.io.
```

DNS changes can take anywhere from a few minutes to a few hours to propagate.
