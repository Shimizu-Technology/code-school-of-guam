# Code School of Guam Website

This is the official website for the Code School of Guam, built using Next.js, React, and Tailwind CSS.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js 24 (minimum 22.12)
- npm compatible with your Node.js version

## Getting Started

To get the application running locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Shimizu-Technology/code-school-of-guam.git
   cd code-school-of-guam
   ```

2. Install the dependencies:
   ```bash
   npm ci
   ```

3. Create a `.env.local` file in the root directory and add the following environment variables:
   ```bash
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX=csg-knowledge
   OPENAI_API_KEY=your_openai_api_key
   OPENROUTER_API_KEY=your_openrouter_api_key

   # Optional analytics
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
   NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   ```

   Replace the values with your actual chatbot and analytics credentials.

4. Run the development server:
   ```bash
   PORT=3000 npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Building for Production

To create a production build, run:

```bash
npm run build
```

This will create an optimized production build in the `.next` folder.

## Deployment

This project is configured for deployment on Netlify. The `netlify.toml` file in the root directory contains the necessary configuration.

To deploy:

1. Push your changes to your GitHub repository.
2. Netlify will automatically deploy your site when changes are pushed to the main branch.

## Project Structure

- `app/`: Contains the main pages and layout components.
- `components/`: Reusable React components.
- `public/`: Static assets like images and the manifest file.
- `styles/`: Global CSS styles.

## Key Features

- Responsive design
- AI chatbot for admissions and program questions
- Flappy Bird game demo
- Separate Netlify interest forms for focused courses, Python, and future bootcamp updates
- FAQ accordion

## Contributing

If you'd like to contribute to this project, please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

## Validation and runtime cleanup

Run `npm run check` for lint, types, knowledge and mocked form tests, production build, generated routes/links/assets, and dependency audit. GitHub Quality runs the same gate. The preview command is `PORT=3000 npm start` after building; both server commands bind localhost and fail if the selected port is occupied. Use a distinct port for parallel work, claim the exact process and browser tab with the local development lifecycle, and stop/release only those resources after QA. See [AGENTS.md](AGENTS.md).

Netlify builds and GitHub Quality use Node.js 24. The application runtime remains Next.js 15. Standalone ESLint 9 runs TypeScript, React, hooks, accessibility, and Next source rules. The Next 14 static plugin is retained because newer plugins depend on an unpatched braces package; generated route checks and the runtime build also validate the Next 15 app. Tailwind 4 requires Safari 16.4+, Chrome 111+, or Firefox 128+. Existing published routes, current-offer facts, forms, and chat API remain the application contract.

Manrope and Newsreader are served locally from `public/fonts`; their SIL Open Font License files are included beside them. Purpose-sized WebP copies are used for referenced photos and product imagery; source originals remain available.
