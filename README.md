# Traceless

**Create AI images. Nobody saves a thing.**

Traceless is a bring-your-own-key image generator. There are no accounts and no database: you paste your own OpenAI or Google API key, generate images, and everything stays in your browser.

## Features

- **Bring your own key**: works with your own OpenAI and Google API keys. No sign-up.
- **No database**: prompts, images and keys are never stored on a server.
- **Local history**: generated images are kept in your browser's IndexedDB.
- **Optional key encryption**: lock your stored keys with a passphrase (PBKDF2 + AES-GCM via WebCrypto).
- **Image-to-image**: attach reference images; they are compressed in the browser before upload.
- **Per-model options**: resolution, quality, format and background for OpenAI; aspect ratio and size for Gemini.

## Supported models

| Provider | Model | Reference images |
| --- | --- | --- |
| OpenAI | `gpt-image-2` | up to 16 |
| OpenAI | `gpt-image-2.5-sunburst` | up to 16 |
| Google | `gemini-3-pro-image-preview` | up to 14 |

## How your data is handled

| Data | Where it lives |
| --- | --- |
| API keys | `localStorage`, encrypted if you set a passphrase |
| Generated images | IndexedDB in your browser |
| Prompts and reference images | Sent only for the request being made |

To generate an image, the browser sends the prompt, reference images and the matching API key to this app's `/api/image` route, which forwards them to the provider and returns the result. The route does not store the key, the prompt or the images.

## Getting started

Requirements: Node.js 20+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), open the settings and add your API key.

No environment variables are needed: keys are entered in the app.

### Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Build for production |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router) and React 19
- [Vercel AI SDK](https://ai-sdk.dev) with the OpenAI and Google providers
- [Tailwind CSS](https://tailwindcss.com) 4 and [shadcn/ui](https://ui.shadcn.com) on Base UI
- [Zustand](https://zustand.docs.pmnd.rs) for state, [idb-keyval](https://github.com/jakearchibald/idb-keyval) for IndexedDB
- [React Hook Form](https://react-hook-form.com) and [Zod](https://zod.dev) for forms and validation

## Project structure

```
app/
  api/image/route.ts   # Image generation endpoint (forwards to the provider)
  page.tsx             # Main page
components/ui/         # shadcn/ui components
modules/
  images/              # Image form, model pickers, results, image store
  settings/            # API keys, encryption, unlock flow
  shared/              # Hero, footer, crypto helpers, validators
  ads/                 # Sponsor slots
```

## Adding a model

1. Add the model to `supportedModels` in `modules/images/utils/ai-models.ts`.
2. Register its schema in `imageSchema` in the same file.
3. Handle it in the `switch` in `app/api/image/route.ts`.

## License

[MIT](LICENSE)
