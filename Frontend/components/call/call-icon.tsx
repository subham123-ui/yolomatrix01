"use client"

import { useState, useEffect, useRef } from "react"
import { Phone, X, Minimize, Maximize, Mic, MicOff, Video, VideoOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function CallIcon() {
  const [userId, setUserId] = useState<string>("")
  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "connected">("idle")
  const [expanded, setExpanded] = useState<boolean>(false)
  const [micMuted, setMicMuted] = useState<boolean>(false)
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true)
  
  const ws = useRef<WebSocket | null>(null)
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const localStream = useRef<MediaStream | null>(null)
  const remoteStream = useRef<MediaStream | null>(null)
  const localVideo = useRef<HTMLVideoElement | null>(null)
  const remoteVideo = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    // Generate a random user ID
    const newUserId = "user_" + Math.random().toString(36).substr(2, 9)
    setUserId(newUserId)

    // Connect to WebSocket server
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080"
    ws.current = new WebSocket(wsUrl)

    ws.current.onopen = () => {
      console.log("Connected to WebSocket server")
      // Register user with the server
      if (ws.current) {
        ws.current.send(JSON.stringify({ type: "register", userId: newUserId, role: "user" }))
      }
    }

    ws.current.onmessage = async (event) => {
      try {
        const message = JSON.parse(event.data)
        console.log("Received message:", message)

        switch (message.type) {
          case "callAccepted":
            setCallStatus("connected")
            setExpanded(true)
            await handleCallAccepted(message)
            break
          case "ice-candidate":
            handleIceCandidate(message)
            break
          case "offer":
            handleOffer(message)
            break
          case "answer":
            handleAnswer(message)
            break
          case "callEnded":
            handleCallEnded()
            break
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    ws.current.onclose = () => {
      console.log("Disconnected from WebSocket server")
    }

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    // Clean up on component unmount
    return () => {
      if (ws.current) {
        ws.current.close()
      }
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop())
      }
      if (peerConnection.current) {
        peerConnection.current.close()
      }
    }
  }, [])

  const initializePeerConnection = async () => {
    try {
      // Create a new RTCPeerConnection
      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
      })

      // Get local media stream
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      if (localVideo.current) {
        localVideo.current.srcObject = localStream.current
      }

      // Add local tracks to peer connection
      localStream.current.getTracks().forEach((track) => {
        if (localStream.current && peerConnection.current) {
          peerConnection.current.addTrack(track, localStream.current)
        }
      })

      // Create remote stream
      remoteStream.current = new MediaStream()
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = remoteStream.current
      }

      // Handle incoming tracks
      peerConnection.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          if (remoteStream.current) {
            remoteStream.current.addTrack(track)
          }
        })
      }

      // Handle ICE candidates
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate && ws.current) {
          ws.current.send(
            JSON.stringify({
              type: "ice-candidate",
              candidate: event.candidate,
              userId: userId,
              target: "owner",
            }),
          )
        }
      }

      return peerConnection.current
    } catch (error) {
      console.error("Error initializing peer connection:", error)
      return null
    }
  }

  const handleCallClick = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    try {
      setCallStatus("calling")
      setExpanded(true)

      // Initialize WebRTC peer connection
      const pc = await initializePeerConnection()
      if (!pc || !ws.current) return

      // Create and send offer
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      ws.current.send(
        JSON.stringify({
          type: "call",
          userId: userId,
          target: "owner",
          offer: offer,
        }),
      )
    } catch (error) {
      console.error("Error starting call:", error)
      setCallStatus("idle")
    }
  }

  const handleCallAccepted = async (message: any) => {
    try {
      if (!peerConnection.current) return

      // Set remote description from answer
      const remoteDesc = new RTCSessionDescription(message.answer)
      await peerConnection.current.setRemoteDescription(remoteDesc)
    } catch (error) {
      console.error("Error handling call accepted:", error)
    }
  }

  const handleIceCandidate = async (message: any) => {
    try {
      if (!peerConnection.current) return

      // Add ICE candidate
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(message.candidate))
    } catch (error) {
      console.error("Error handling ICE candidate:", error)
    }
  }

  const handleOffer = async (message: any) => {
    try {
      if (!peerConnection.current) {
        await initializePeerConnection()
      }

      if (!peerConnection.current || !ws.current) return

      // Set remote description from offer
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(message.offer))

      // Create and send answer
      const answer = await peerConnection.current.createAnswer()
      await peerConnection.current.setLocalDescription(answer)

      ws.current.send(
        JSON.stringify({
          type: "answer",
          userId: userId,
          target: message.userId,
          answer: answer,
        }),
      )
    } catch (error) {
      console.error("Error handling offer:", error)
    }
  }

  const handleAnswer = async (message: any) => {
    try {
      if (!peerConnection.current) return

      // Set remote description from answer
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(message.answer))
    } catch (error) {
      console.error("Error handling answer:", error)
    }
  }

  const handleCallEnded = () => {
    setCallStatus("idle")
    setExpanded(false)

    // Stop local stream tracks
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop())
    }

    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close()
      peerConnection.current = null
    }
  }

  const endCall = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (ws.current) {
      ws.current.send(
        JSON.stringify({
          type: "endCall",
          userId: userId,
          target: "owner",
        }),
      )
    }

    handleCallEnded()
  }

  const toggleMic = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !micMuted
        setMicMuted(!micMuted)
      }
    }
  }

  const toggleVideo = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoEnabled
        setVideoEnabled(!videoEnabled)
      }
    }
  }

  const toggleExpanded = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setExpanded(!expanded);
  }

  // Determine which widget to render based on state
  const renderCallWidget = () => {
    if (!expanded) {
      // Collapsed widget
      return (
        <Card 
          className="fixed left-4 bottom-4 p-3 shadow-lg hover:shadow-xl transition-all duration-300 w-14 h-14 flex items-center justify-center cursor-pointer z-50" 
          onClick={toggleExpanded}
        >
          <Phone size={24} className={`${callStatus !== "idle" ? "text-green-500" : ""}`} />
          {callStatus === "calling" && <span className="absolute top-0 right-0 h-3 w-3 bg-amber-500 rounded-full animate-ping"></span>}
          {callStatus === "connected" && <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full"></span>}
        </Card>
      )
    }

    // Expanded widget
    return (
      <Card className="fixed left-4 bottom-4 shadow-lg w-full max-w-xs p-4 space-y-4 transition-all duration-300 z-50">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Support Call</h2>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={toggleExpanded}
              aria-label="Minimize"
            >
              <Minimize size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={endCall}
              aria-label="Close call widget"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {callStatus === "idle" ? (
          <div className="text-center py-8">
            <Button 
              onClick={handleCallClick} 
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              aria-label="Call support"
            >
              <Phone size={20} />
              Call Support
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative rounded-md overflow-hidden bg-gray-100 aspect-video">
                <video
                  ref={localVideo}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1 py-0.5 rounded">You</span>
                {!videoEnabled && (
                  <div className="absolute inset-0 bg-gray-800/70 flex items-center justify-center">
                    <VideoOff size={24} className="text-white" />
                  </div>
                )}
              </div>
              <div className="relative rounded-md overflow-hidden bg-gray-100 aspect-video">
                <video
                  ref={remoteVideo}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1 py-0.5 rounded">Support</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button 
                variant={micMuted ? "destructive" : "outline"}
                size="icon" 
                className="rounded-full" 
                onClick={toggleMic}
                aria-label={micMuted ? "Unmute microphone" : "Mute microphone"}
              >
                {micMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </Button>
              <Button 
                variant={videoEnabled ? "outline" : "destructive"}
                size="icon" 
                className="rounded-full" 
                onClick={toggleVideo}
                aria-label={videoEnabled ? "Turn off camera" : "Turn on camera"}
              >
                {videoEnabled ? <Video size={18} /> : <VideoOff size={18} />}
              </Button>
              <Button 
                variant="destructive" 
                size="icon" 
                className="rounded-full"
                onClick={endCall}
                aria-label="End call"
              >
                <Phone size={18} className="rotate-135" />
              </Button>
            </div>

            {callStatus === "calling" && (
              <div className="text-center text-sm text-amber-600 animate-pulse py-1 font-medium">
                Calling support...
              </div>
            )}
          </>
        )}
      </Card>
    )
  }

  return (
    <div className="call-widget-container">
      {renderCallWidget()}
    </div>
  )
}