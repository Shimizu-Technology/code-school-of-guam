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

  // State
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOverTextVisible, setGameOverTextVisible] = useState(false)
  const [startTextVisible, setStartTextVisible] = useState(true)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  // For referencing gameStarted within callbacks
  const gameStartedRef = useRef<boolean>(gameStarted)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    gameStartedRef.current = gameStarted
  }, [gameStarted])

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
    if (!gameStartedRef.current) {
      setGameStarted(true)
      gameStartedRef.current = true
      setStartTextVisible(false)
      resetGame()
      generatePipe()
      lastTimeRef.current = performance.now()
    }
    if (birdRef.current) {
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
      // Responsive approach: maintain a reasonable max width for the game
      const canvasWidth = Math.min(window.innerWidth - 20, 400)
      const canvasHeight = canvasWidth * 1.5
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

    // Auto-start on mount
    startGame()

    const gameLoop = (time: number) => {
      const deltaTime = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (gameStartedRef.current) {
        updateGame(deltaTime)
        drawPipes(ctx)
        drawBird(ctx)
      } else {
        // Draw the bird at its starting position
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
    setGameStarted(false)
    gameStartedRef.current = false
    setGameOverTextVisible(true)

    if (score > highScore) {
      setHighScore(score)
    }

    // Fade out "Game Over" after 2s
    setTimeout(() => setGameOverTextVisible(false), 2000)
    resetGame()
  }

  const drawBird = (ctx: CanvasRenderingContext2D) => {
    if (!birdRef.current) return

    ctx.fillStyle = "#FFA500"
    ctx.beginPath()
    ctx.arc(birdRef.current.x, birdRef.current.y, 20, 0, 2 * Math.PI)
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
      ctx.fillStyle = "#4CAF50"

      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top)

      // Bottom pipe
      ctx.fillRect(
        pipe.x,
        pipe.top + PIPE_GAP,
        PIPE_WIDTH,
        canvas.height - pipe.top - PIPE_GAP
      )

      ctx.globalAlpha = 1
    })
  }

  return (
    <div className="relative">
      <Card className="w-full max-w-md mx-auto bg-gray-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Flappy Bird
          </CardTitle>
        </CardHeader>
        <CardContent>
          <canvas
            ref={canvasRef}
            className="border border-gray-700 rounded-md w-full"
            onClick={handleClick}
            onTouchStart={handleClick}
          />
          {startTextVisible && (
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white animate-fadeIn pointer-events-none">
              Tap or Press Space to Start
            </div>
          )}
          {gameOverTextVisible && (
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-red-500 animate-fadeInOut pointer-events-none">
              Game Over
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-lg">Score: {score}</div>
          <div className="text-lg">High Score: {highScore}</div>
          {!gameStarted && (
            <Button
              onClick={startGame}
              className="bg-ruby-600 hover:bg-ruby-700 text-white transition-colors"
            >
              {score > 0 ? "Restart" : "Start"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
