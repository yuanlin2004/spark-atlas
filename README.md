# SparkAtlas

This repository serves the SparkAtlas design prototype for testing. The site root forwards to the prototype.

- GitHub Pages: [SparkAtlas prototype](https://yuanlin2004.github.io/spark-atlas/prototype/)
- Local preview: run `python3 -m http.server 8765 --directory public` from the repository root, then open `http://localhost:8765/`.

The prototype uses sample articles and local fixture responses. The design source is in the builder repository under `docs/design/prototype/`. The [publication contract](CONTRACT.md) remains the reference for article metadata.

The Pages workflow validates the static files and deploys the `public/` directory.
