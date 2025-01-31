import FlappyBirdGame from "@/components/flappy-bird-game"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export const metadata = {
  title: "Flappy Bird | Code School of Guam",
  description: "Play our Flappy Bird clone and see how coding can create fun games!",
}

export default function FlappyBirdPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 text-white py-4 shadow">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="text-orange-500 hover:text-orange-400 flex items-center transition-colors"
          >
            <ChevronLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-1">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900">
          Flappy Bird Clone
        </h1>
        <p className="text-base md:text-lg text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Welcome to our Flappy Bird clone! This game demonstrates some of the skills
          you’ll learn at Code School of Guam. Click or press the space bar to make
          the bird jump, avoid the pipes, and see how high you can score!
        </p>

        {/* The Game */}
        <FlappyBirdGame />

        {/* Additional Info / CTA */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
            How This Game Was Built
          </h2>
          <p className="text-gray-600 mb-4">
            This Flappy Bird clone was built using React, a popular JavaScript library
            for building user interfaces, and HTML5 Canvas for rendering the game
            graphics. Here are some key concepts used in creating this game:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
            <li>React Hooks for state management and side effects</li>
            <li>Canvas API for game rendering</li>
            <li>Game loop implementation using requestAnimationFrame</li>
            <li>Basic physics simulation (gravity and jumping)</li>
            <li>Collision detection</li>
            <li>Score tracking and high score persistence</li>
            <li>Dynamic difficulty scaling</li>
            <li>Keyboard input and responsive design</li>
          </ul>
          <p className="text-gray-600 mb-8">
            Interested in learning how to build games and web applications like this?
            Check out our courses at Code School of Guam!
          </p>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-orange-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Explore Our Courses
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Code School of Guam. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
