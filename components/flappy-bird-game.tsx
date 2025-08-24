// components/flappy-bird-game.tsx
"use client"

import React, { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Game Constants
const GRAVITY = 15
const JUMP = -450
const PIPE_WIDTH = 50
const PIPE_GAP = 250
const PIPE_SPEED = 300
const PIPE_FADE_START = 100
const INITIAL_BIRD_X_POSITION = 50

interface Bird {
  x: number
  y: number
  velocity: number
}

interface Pipe {
  x: number
  top: number
  opacity?: number
  passed?: boolean
}

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const birdRef = useRef<Bird | null>(null)
  const pipesRef = useRef<Pipe[]>([])
  const lastTimeRef = useRef<number>(0)
  const pipeSpawnTimerRef = useRef<number>(0)
  const animationFrameIdRef = useRef<number>(0)

  // Game states: 'waiting', 'playing', 'gameOver'
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'gameOver'>('waiting')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  // For referencing gameState within callbacks
  const gameStateRef = useRef<'waiting' | 'playing' | 'gameOver'>(gameState)

  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  const resetGame = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    birdRef.current = {
      x: INITIAL_BIRD_X_POSITION,
      y: canvas.height / 2,
      velocity: 0,
    }
    pipesRef.current = []
    pipeSpawnTimerRef.current = 0
    setScore(0)
  }

  const startGame = () => {
    if (gameStateRef.current === 'waiting' || gameStateRef.current === 'gameOver') {
      setGameState('playing')
      resetGame()
      generatePipe()
      lastTimeRef.current = performance.now()
    }
    if (birdRef.current && gameStateRef.current === 'playing') {
      birdRef.current.velocity = JUMP
    }
  }

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    startGame()
  }

  const handleSpacebar = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault()
      startGame()
    }
  }

  const generatePipe = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const minHeight = 50
    const maxHeight = canvas.height - PIPE_GAP - minHeight
    const height = Math.random() * (maxHeight - minHeight) + minHeight

    pipesRef.current.push({ x: canvas.width, top: height, opacity: 1 })
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const resizeCanvas = () => {
      // Mobile-first responsive approach
      const isMobile = window.innerWidth < 768
      const maxWidth = isMobile ? Math.min(window.innerWidth - 32, 360) : 400
      const canvasWidth = maxWidth
      const canvasHeight = canvasWidth * 1.4 // Slightly less tall for mobile
      
      canvas.width = canvasWidth
      canvas.height = canvasHeight

      if (birdRef.current) {
        birdRef.current.x = INITIAL_BIRD_X_POSITION
        birdRef.current.y = canvas.height / 2
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("keydown", handleSpacebar)

    // Initialize bird position without starting the game
    resetGame()

    const gameLoop = (time: number) => {
      const deltaTime = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Always draw the background
      drawBackground(ctx)
      
      if (gameStateRef.current === 'playing') {
        updateGame(deltaTime)
        drawPipes(ctx)
        drawBird(ctx)
      } else {
        // Draw the bird at its starting position when waiting or game over
        drawBird(ctx)
      }

      animationFrameIdRef.current = requestAnimationFrame(gameLoop)
    }

    animationFrameIdRef.current = requestAnimationFrame(gameLoop)

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current)
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("keydown", handleSpacebar)
    }
  }, [])

  const updateGame = (deltaTime: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    updateBird(canvas, deltaTime)
    updatePipes(canvas, deltaTime)

    // Generate pipes periodically
    pipeSpawnTimerRef.current += deltaTime
    if (pipeSpawnTimerRef.current >= 1.5) {
      generatePipe()
      pipeSpawnTimerRef.current = 0
    }
  }

  const updateBird = (canvas: HTMLCanvasElement, deltaTime: number) => {
    if (birdRef.current) {
      birdRef.current.velocity += GRAVITY * deltaTime * 100
      birdRef.current.y += birdRef.current.velocity * deltaTime

      // Check floor/ceiling collisions
      if (birdRef.current.y >= canvas.height - 20 || birdRef.current.y <= 0) {
        gameOver()
      }
    }
  }

  const updatePipes = (canvas: HTMLCanvasElement, deltaTime: number) => {
    pipesRef.current.forEach((pipe, index) => {
      pipe.x -= PIPE_SPEED * deltaTime

      // Update score if bird passes pipe
      if (
        birdRef.current &&
        pipe.x + PIPE_WIDTH < birdRef.current.x &&
        !pipe.passed
      ) {
        pipe.passed = true
        setScore((prev) => {
          const newScore = prev + 1

          // Optional difficulty increase
          // if (newScore % 5 === 0) { ... }

          return newScore
        })
      }

      // Check collision
      if (
        birdRef.current &&
        pipe.x < birdRef.current.x + 20 &&
        pipe.x + PIPE_WIDTH > birdRef.current.x &&
        (birdRef.current.y < pipe.top ||
          birdRef.current.y > pipe.top + PIPE_GAP)
      ) {
        gameOver()
      }

      // Remove off-screen pipes
      if (pipe.x + PIPE_WIDTH < 0) {
        pipesRef.current.splice(index, 1)
      }
    })
  }

  const gameOver = () => {
    setGameState('gameOver')

    // Check and update high score
    if (score > highScore) {
      const newHighScore = score
      setHighScore(newHighScore)
      // Save high score to localStorage
      try {
        localStorage.setItem('flappyBirdHighScore', newHighScore.toString())
      } catch (error) {
        console.warn('Could not save high score to localStorage:', error)
      }
    }
  }

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#87CEEB')
    gradient.addColorStop(1, '#98D8E8')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Subtle clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.beginPath()
    // Cloud 1
    ctx.arc(canvas.width * 0.2, canvas.height * 0.2, 15, 0, 2 * Math.PI)
    ctx.arc(canvas.width * 0.22, canvas.height * 0.18, 12, 0, 2 * Math.PI)
    ctx.arc(canvas.width * 0.18, canvas.height * 0.18, 10, 0, 2 * Math.PI)
    // Cloud 2
    ctx.arc(canvas.width * 0.7, canvas.height * 0.15, 12, 0, 2 * Math.PI)
    ctx.arc(canvas.width * 0.72, canvas.height * 0.13, 10, 0, 2 * Math.PI)
    // Cloud 3
    ctx.arc(canvas.width * 0.5, canvas.height * 0.3, 8, 0, 2 * Math.PI)
    ctx.arc(canvas.width * 0.52, canvas.height * 0.28, 6, 0, 2 * Math.PI)
    ctx.fill()
  }

  const drawBird = (ctx: CanvasRenderingContext2D) => {
    if (!birdRef.current) return

    const bird = birdRef.current
    
    // Bird body (orange circle)
    ctx.fillStyle = "#FFA500"
    ctx.beginPath()
    ctx.arc(bird.x, bird.y, 18, 0, 2 * Math.PI)
    ctx.fill()
    
    // Bird outline
    ctx.strokeStyle = "#FF8C00"
    ctx.lineWidth = 2
    ctx.stroke()
    
    // Wing
    ctx.fillStyle = "#FF6347"
    ctx.beginPath()
    ctx.ellipse(bird.x - 5, bird.y - 5, 12, 8, -0.3, 0, 2 * Math.PI)
    ctx.fill()
    
    // Eye
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(bird.x + 8, bird.y - 5, 6, 0, 2 * Math.PI)
    ctx.fill()
    
    // Pupil
    ctx.fillStyle = "black"
    ctx.beginPath()
    ctx.arc(bird.x + 10, bird.y - 5, 3, 0, 2 * Math.PI)
    ctx.fill()
    
    // Beak
    ctx.fillStyle = "#FFD700"
    ctx.beginPath()
    ctx.moveTo(bird.x + 15, bird.y)
    ctx.lineTo(bird.x + 25, bird.y - 3)
    ctx.lineTo(bird.x + 25, bird.y + 3)
    ctx.closePath()
    ctx.fill()
  }

  const drawPipes = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current
    if (!canvas) return

    pipesRef.current.forEach((pipe) => {
      // Fade out as it gets near the left boundary
      if (pipe.x < PIPE_FADE_START) {
        pipe.opacity = Math.max(0, pipe.x / PIPE_FADE_START)
      }

      ctx.globalAlpha = pipe.opacity || 1
      
      // Pipe gradient
      const pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0)
      pipeGradient.addColorStop(0, "#4CAF50")
      pipeGradient.addColorStop(0.5, "#66BB6A")
      pipeGradient.addColorStop(1, "#388E3C")
      ctx.fillStyle = pipeGradient

      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top)
      
      // Top pipe cap
      ctx.fillStyle = "#2E7D32"
      ctx.fillRect(pipe.x - 5, pipe.top - 20, PIPE_WIDTH + 10, 20)

      // Bottom pipe
      ctx.fillStyle = pipeGradient
      ctx.fillRect(
        pipe.x,
        pipe.top + PIPE_GAP,
        PIPE_WIDTH,
        canvas.height - pipe.top - PIPE_GAP
      )
      
      // Bottom pipe cap
      ctx.fillStyle = "#2E7D32"
      ctx.fillRect(pipe.x - 5, pipe.top + PIPE_GAP, PIPE_WIDTH + 10, 20)

      ctx.globalAlpha = 1
    })
  }

  // Load high score from localStorage on component mount
  useEffect(() => {
    try {
      const savedHighScore = localStorage.getItem('flappyBirdHighScore')
      if (savedHighScore) {
        const parsedScore = parseInt(savedHighScore, 10)
        if (!isNaN(parsedScore) && parsedScore >= 0) {
          setHighScore(parsedScore)
        }
      }
    } catch (error) {
      console.warn('Could not load high score from localStorage:', error)
    }
  }, [])

  return (
    <div className="relative w-full">
      <Card className="w-full mx-auto bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-ruby-600 to-red-600 text-center py-4">
          <CardTitle className="text-xl md:text-2xl font-bold">
            🐦 Flappy Bird
          </CardTitle>
          <p className="text-ruby-100 text-sm mt-1">
            Tap or press space to play!
          </p>
        </CardHeader>
        
        <CardContent className="relative p-4 md:p-6">
          <canvas
            ref={canvasRef}
            className="border-2 border-gray-600 rounded-lg w-full cursor-pointer shadow-inner bg-sky-200"
            onClick={handleClick}
            onTouchStart={handleClick}
          />
          
          {/* Game State Overlays */}
          {gameState === 'waiting' && (
            <div className="absolute inset-4 md:inset-6 flex flex-col items-center justify-center text-white pointer-events-none bg-black bg-opacity-40 rounded-lg">
              <div className="text-3xl md:text-4xl font-bold mb-4 animate-bounce">🐦</div>
              <div className="text-lg md:text-xl font-bold mb-2 text-center">Ready to Fly?</div>
              <div className="text-sm md:text-base opacity-90 text-center px-4">Tap anywhere or press Space to start</div>
            </div>
          )}
          
          {gameState === 'gameOver' && (
            <div className="absolute inset-4 md:inset-6 flex flex-col items-center justify-center text-white pointer-events-none bg-black bg-opacity-50 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-red-400 mb-3">💥 Game Over!</div>
              <div className="text-lg md:text-xl mb-2">Final Score: <span className="text-yellow-400 font-bold">{score}</span></div>
              {score === highScore && score > 0 && (
                <div className="text-yellow-400 text-sm md:text-base mb-3 animate-pulse">🎉 New High Score! 🎉</div>
              )}
              <div className="text-sm md:text-base opacity-90 text-center px-4">Tap to try again</div>
            </div>
          )}
          
          {/* Score display during gameplay */}
          {gameState === 'playing' && (
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
              <div className="bg-black bg-opacity-60 text-white font-bold text-xl md:text-2xl px-3 py-1 rounded-lg border border-white border-opacity-30">
                {score}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-gray-800 border-t border-gray-700 px-4 py-3 md:px-6 md:py-4">
          <div className="flex justify-between items-center w-full">
            <div className="text-sm md:text-base">
              <span className="text-gray-400">Score:</span> <span className="font-bold text-white">{score}</span>
            </div>
            <div className="text-sm md:text-base">
              <span className="text-gray-400">Best:</span> <span className="font-bold text-yellow-400">{highScore}</span>
            </div>
            <div className="flex gap-2">
              {gameState !== 'playing' && (
                <Button
                  onClick={startGame}
                  className="bg-ruby-600 hover:bg-ruby-700 text-white transition-all hover:scale-105 shadow-lg text-sm md:text-base px-4 py-2 md:px-6"
                >
                  {gameState === 'gameOver' ? "🔄 Play Again" : "🚀 Start Game"}
                </Button>
              )}
              {highScore > 0 && (
                <Button
                  onClick={() => {
                    localStorage.removeItem('flappyBirdHighScore')
                    setHighScore(0)
                  }}
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 text-xs px-3 py-2"
                  title="Reset high score"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
