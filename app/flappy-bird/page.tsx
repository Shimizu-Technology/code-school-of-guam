import FlappyBirdGame from "@/components/flappy-bird-game"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export const metadata = {
  title: "Flappy Bird | Code School of Guam",
  description: "Play our Flappy Bird clone and see how coding can create fun games!",
}

export default function FlappyBirdPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/"
            className="text-ruby-400 hover:text-ruby-300 flex items-center transition-all hover:scale-105 group"
          >
            <ChevronLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-ruby-100 border border-ruby-200 rounded-full text-ruby-800 text-sm font-medium mb-4">
            🎮 Interactive Demo
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 tracking-tight">
            Flappy Bird <span className="text-ruby-600">Clone</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Experience what you can build! This game showcases the skills you'll master at Code School of Guam.
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto">
            Tap or press space to make the bird fly, avoid the pipes, and see how high you can score!
          </p>
        </div>

        {/* The Game - Mobile Optimized */}
        <div className="max-w-lg mx-auto mb-12">
          <FlappyBirdGame />
        </div>

        {/* How It's Built Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-ruby-600 to-red-600 px-6 md:px-8 py-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                How This Game Was Built
              </h2>
              <p className="text-ruby-100">
                Real-world coding concepts you'll learn in our program
              </p>
            </div>
            
            <div className="p-6 md:p-8">
              <p className="text-gray-600 mb-6 text-lg">
                This Flappy Bird clone demonstrates key programming concepts using React and HTML5 Canvas - 
                the same technologies taught in our bootcamp.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-ruby-100 rounded-full p-2 mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-ruby-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">React Hooks</h4>
                      <p className="text-sm text-gray-600">State management and side effects</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-ruby-100 rounded-full p-2 mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-ruby-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Canvas API</h4>
                      <p className="text-sm text-gray-600">2D graphics and game rendering</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-ruby-100 rounded-full p-2 mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-ruby-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Game Loop</h4>
                      <p className="text-sm text-gray-600">Animation with requestAnimationFrame</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-ruby-100 rounded-full p-2 mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-ruby-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Physics Simulation</h4>
                      <p className="text-sm text-gray-600">Gravity and collision detection</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-ruby-100 rounded-full p-2 mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-ruby-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Event Handling</h4>
                      <p className="text-sm text-gray-600">Keyboard and touch input</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-ruby-100 rounded-full p-2 mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-ruby-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Local Storage</h4>
                      <p className="text-sm text-gray-600">Data persistence and high scores</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-ruby-100 rounded-full p-2 mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-ruby-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Responsive Design</h4>
                      <p className="text-sm text-gray-600">Mobile-first development</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-ruby-100 rounded-full p-2 mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-ruby-600 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">TypeScript</h4>
                      <p className="text-sm text-gray-600">Type safety and better code</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-ruby-50 to-red-50 rounded-xl p-6 border border-ruby-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Ready to Build Your Own Games & Apps?
                </h3>
                <p className="text-gray-600 mb-4">
                  Join our January 2025 cohort and learn to create interactive applications like this one. 
                  From beginner to job-ready in just 4 months!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/"
                    className="inline-flex h-12 items-center justify-center rounded-md bg-ruby-600 px-6 text-base font-medium text-white shadow-lg transition-all hover:bg-ruby-700 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ruby-400 flex-1 sm:flex-none"
                  >
                    View Our Program
                  </Link>
                  <Link
                    href="https://forms.gle/8vNXoqxCimxjfXkU6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center rounded-md border border-ruby-600 bg-white px-6 text-base font-medium text-ruby-600 shadow transition-all hover:bg-ruby-50 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ruby-400 flex-1 sm:flex-none"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-gray-300">&copy; 2024 Code School of Guam. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
