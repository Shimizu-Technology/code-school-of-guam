"use client"

import { useState, useEffect } from "react"
import { Clock, Rocket } from "lucide-react"

const TARGET_DATE = new Date("2026-03-02T00:00:00+10:00").getTime()

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(): TimeLeft | null {
  const now = Date.now()
  const diff = TARGET_DATE - now
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
        <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs sm:text-sm text-gray-400 mt-2 uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(calculateTimeLeft())
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return (
      <div className="text-center py-6">
        <div className="flex justify-center gap-3 sm:gap-4">
          {["Days", "Hours", "Min", "Sec"].map((label) => (
            <TimeUnit key={label} value={0} label={label} />
          ))}
        </div>
      </div>
    )
  }

  if (!timeLeft) {
    return (
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-full">
          <Rocket className="h-5 w-5 text-green-400" />
          <span className="text-lg font-semibold text-green-400">
            Cohort 3 has started!
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center py-6">
      <div className="inline-flex items-center gap-2 text-gray-400 text-sm mb-4">
        <Clock className="h-4 w-4" />
        <span>Cohort 3 starts March 2, 2026</span>
      </div>
      <div className="flex justify-center gap-3 sm:gap-4">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Min" />
        <TimeUnit value={timeLeft.seconds} label="Sec" />
      </div>
    </div>
  )
}
