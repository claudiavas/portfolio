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

### Variables de entorno

El formulario de contacto usa EmailJS. Sus tres identificadores no están en el
código: se leen del entorno, y create-react-app solo pasa al build las que
empiezan por `REACT_APP_`.

Para desarrollo, crear un `.env.local` (ignorado por git) con:

```
REACT_APP_EMAILJS_SERVICE_ID=
REACT_APP_EMAILJS_TEMPLATE_ID=
REACT_APP_EMAILJS_PUBLIC_KEY=
```

En el deploy los pone GitHub Actions desde los secrets `EMAILJS_SERVICE_ID`,
`EMAILJS_TEMPLATE_ID` y `EMAILJS_PUBLIC_KEY` de este repositorio.

Esto los saca del código fuente, no del bundle publicado: un formulario que se
envía desde el navegador tiene que llevárselos, y create-react-app los incrusta
al compilar. Lo que limita su uso de verdad es el panel de EmailJS —restringir
los dominios permitidos y el límite de envíos—.

## Flujo de trabajo

- Rama de trabajo: `dev`
- Publicar: PR `dev → main`; al mergear se despliega solo
