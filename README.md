# Testing

Minimal static Vite website displaying “testing”.

## Local development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

## GitHub Actions

The workflow builds pull requests to `main` and deploys pushes to `main` to GitHub Pages. You can also run it manually on `main`.

In repository **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source to enable deployment. The build uses the repository name as its base path for project Pages hosting.
