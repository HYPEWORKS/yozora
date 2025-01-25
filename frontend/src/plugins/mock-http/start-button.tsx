import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Square } from "lucide-react"
import { cn } from "@/lib/utils"

interface StartButtonProps {
  isRunning: boolean
  onToggle: (running: boolean) => void
}

export function StartButton({ isRunning, onToggle }: StartButtonProps) {
  const [isWaiting, setIsWaiting] = useState(false)

  const handleClick = async () => {
    setIsWaiting(true)
    // Simulate waiting for all clear
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // const res = await CallPlugin("mock-http", "start", "")
    setIsWaiting(false)
    onToggle(!isRunning)
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isWaiting}
      className={cn(
        "relative flex items-center justify-center w-16 h-16 rounded-full text-white shadow-lg hover:shadow-xl transition-shadow",
        isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600",
      )}
    >
      {isWaiting && (
        <div
          className="absolute inset-0 rounded-full border-2 border-t-transparent border-white animate-spin"
          style={{
            animationDuration: "750ms",
          }}
        />
      )}
      {isRunning ? <Square size={24} /> : <Play size={24} />}
    </Button>
  )
}

