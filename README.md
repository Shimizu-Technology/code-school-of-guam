# Code School of Guam Website

This is the official website for the Code School of Guam, built using Next.js, React, and Tailwind CSS.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Getting Started

To get the application running locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/code-school-of-guam.git
   cd code-school-of-guam
   ```

2. Install the dependencies:
   ```bash
   npm install
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
   npm run dev
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
- Contact form with EmailJS integration
- FAQ accordion

## Contributing

If you'd like to contribute to this project, please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.
