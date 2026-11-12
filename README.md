# KCMW

Katherine Crocker’s KC Media Works portfolio is a static website. Open this folder in Visual Studio Code. The site files are in `dist` and are edited directly.

| To edit | Open |
| --- | --- |
| Home | `dist/index.html` |
| Featured Work | `dist/featured-work/index.html` |
| About section | `dist/index.html` |
| Project summaries | `dist/portfolio/<project>/index.html` |
| Site styles | `dist/assets/styles.css` |
| Portfolio filter | `dist/assets/portfolio.js` |

## Preview locally

Run this from the VS Code terminal, then open [http://localhost:8000/](http://localhost:8000/).

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

## Publish and connect the domain

Deploy the contents of `dist` as the website root. Before switching `kc-mediaworks.com`, save the existing WordPress content and note the current website DNS records. Verify the replacement using its hosting URL first. Then attach `kc-mediaworks.com` to the new host, apply the DNS records the host supplies in GoDaddy, and verify HTTPS on the homepage, Featured Work, and project pages. Keep the backup and old hosting available until the domain is confirmed working.
