# Portfolio — claudiavasquez.dev

Código fuente de mi portfolio personal: [claudiavasquez.dev](https://claudiavasquez.dev)

React (create-react-app) + Sass. El deploy es automático: al hacer push a `main`,
GitHub Actions construye el proyecto y lo publica en GitHub Pages
([.github/workflows/deploy.yml](.github/workflows/deploy.yml)).

## Desarrollo

```bash
npm install
npm start        # http://localhost:3000
```

## Flujo de trabajo

- Rama de trabajo: `dev`
- Publicar: PR `dev → main`; al mergear se despliega solo
