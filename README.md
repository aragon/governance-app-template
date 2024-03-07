This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

It contains two main components:
- The App project itself
- A deployment script for your DAO and plugins

## Getting Started

### Development
Install the NPM packages and run the development server:

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Production build
To compile the project and run a production version:

```bash
bun run build
bun start
```

### Contract deployment
To deploy your DAO and plugins, edit the `.env` file and set the relevant variables prefixed by `DEPLOYMENT_`. Then, run:

```bash
bun run scripts/deploy.ts
```

Use the output of the command to update your `.env` file accordingly.

## Contents

- Structure
  - Pages
  - Plugins
- Env vars management
  - Public
  - Private
- ODS components
- Deployment script

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Other

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
