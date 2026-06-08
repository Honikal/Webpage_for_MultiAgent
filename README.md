# Webpage_for_MultiAgent
Éste es el entorno de una aplicación web sencilla que se encargará de conectarse con un modelo MultiAgente que tendrá RAG, A2A, Memoria y MCP. La función principal de esta página es funcionar como un método para comunicarse con el agente e inscribir las preguntas (tanto relacionadas con los apuntes del curso o relacionadas a éste).

## Creación del Interfaz gráfica

### Seteando Next.JS

Iniciamos con el comando básico para setear el proyecto:
```bash
npx create-next-app@latest
```

Luego debemos de contestar las siguientes preguntas preferiblemente en éste orden
```bash
Need to install the following packages: create-next-app@16.2.7
Ok to proceed? (y)
? What is your project named? <project-name>
? Would you like to use the recommended Next.js defaults? Yes
```

Luego del caso de desear ejecutarlo, nada más debemos de probar una de las siguientes opciones (abrirá en local-host por el momento, luego se puede subir a Vercel)

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

#### Learn More

To learn more about Next.js, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

#### Deploy on Vercel
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
