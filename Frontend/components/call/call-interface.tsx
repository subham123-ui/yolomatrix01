"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, MicOff, PhoneOff } from "lucide-react"
import { useCallContext } from "./call-provider"

export default function VoiceCallInterface() {
  const { isCallActive, endCall, localStream, remoteStream, isMuted, toggleMute } =
    useCallContext()
  
  const remoteAudioRef = useRef(null)
  const [callDuration, setCallDuration] = useState(0)
  const [timerInterval, setTimerInterval] = useState(null)
  
  useEffect(() => {
    if (remoteStream && remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  useEffect(() => {
    if (isCallActive && !timerInterval) {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
      setTimerInterval(interval)
    } else if (!isCallActive && timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
      setCallDuration(0)
    }
    
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [isCallActive, timerInterval])

  if (!isCallActive) return null

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="fixed bottom-4 right-4 w-64 shadow-lg z-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-sm">Voice Call - {formatTime(callDuration)}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="flex items-center justify-center h-20 bg-gray-100 rounded-md">
          <audio ref={remoteAudioRef} autoPlay />
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-1">
              <Mic size={20} className="text-blue-500" />
            </div>
            <p className="text-sm font-medium">Voice Call</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-4 pt-2 pb-2">
        <Button variant="outline" size="icon" onClick={toggleMute} className={isMuted ? "bg-red-100" : ""}>
          {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
        </Button>
        <Button variant="destructive" size="icon" onClick={endCall}>
          <PhoneOff size={18} />
        </Button>
      </CardFooter>
    </Card>
  )
}