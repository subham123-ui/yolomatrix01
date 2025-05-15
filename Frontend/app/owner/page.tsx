"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Phone, PhoneOff, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

type CallState = "idle" | "incoming" | "connected"

interface IncomingCall {
  userId: string
  offer: RTCSessionDescriptionInit
}

const OwnerPage = () => {
  const [remoteUsers, setRemoteUsers] = useState<string[]>([])
  const [callState, setCallState] = useState<CallState>("idle")
  const [currentCaller, setCurrentCaller] = useState<string | null>(null)
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()

  const ws = useRef<WebSocket | null>(null)
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const localStream = useRef<MediaStream | null>(null)
  const remoteStream = useRef<MediaStream | null>(null)
  const localVideo = useRef<HTMLVideoElement | null>(null)
  const remoteVideo = useRef<HTMLVideoElement | null>(null)

  // Create a stable reference to the handleCallEnded function
  const handleCallEnded = useCallback(() => {
    setCallState("idle")
    setCurrentCaller(null)
    setIncomingCall(null)

    // Stop local stream tracks
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop())
      localStream.current = null
    }

    // Remove remote stream
    if (remoteStream.current) {
      remoteStream.current = null
    }
    
    // Clean up video elements
    if (localVideo.current) {
      localVideo.current.srcObject = null
    }
    
    if (remoteVideo.current) {
      remoteVideo.current.srcObject = null
    }

    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close()
      peerConnection.current = null
    }
  }, [])

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback(async (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data)
      console.log("Received message:", message)

      switch (message.type) {
        case "users":
          setRemoteUsers(message.users || [])
          break
        case "userConnected":
          console.log(`User connected: ${message.userId}`)
          setRemoteUsers((prevUsers) => [...prevUsers, message.userId])
          break
        case "userDisconnected":
          console.log(`User disconnected: ${message.userId}`)
          setRemoteUsers((prevUsers) => prevUsers.filter((user) => user !== message.userId))
          if (currentCaller === message.userId) {
            handleCallEnded()
          }
          break
        case "call":
          handleIncomingCall(message)
          break
        case "ice-candidate":
          handleIceCandidate(message)
          break
        case "answer":
          handleAnswer(message)
          break
        case "endCall":
          handleCallEnded()
          break
        default:
          console.log("Unknown message type:", message.type)
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error)
    }
  }, [currentCaller, handleCallEnded])

  // Initialize WebSocket connection
  useEffect(() => {
    const setupWebSocket = () => {
      try {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080"
        ws.current = new WebSocket(wsUrl)

        ws.current.onopen = () => {
          console.log("Connected to WebSocket server")
          setIsConnected(true)
          if (ws.current) {
            ws.current.send(JSON.stringify({ type: "register", userId: "owner", role: "owner" }))
            toast({
              title: "Connected to server",
              description: "You are now connected to the support server",
            })
          }
        }

        ws.current.onmessage = handleWebSocketMessage

        ws.current.onclose = () => {
          console.log("Disconnected from WebSocket server")
          setIsConnected(false)
          toast({
            title: "Disconnected from server",
            description: "Connection to support server lost",
            variant: "destructive",
          })
          // Attempt to reconnect after a delay
          setTimeout(setupWebSocket, 5000)
        }

        ws.current.onerror = (error) => {
          console.error("WebSocket error:", error)
          toast({
            title: "Connection error",
            description: "Failed to connect to support server",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error setting up WebSocket:", error)
      }
    }

    setupWebSocket()

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
  }, [handleWebSocketMessage, toast])

  // Initialize WebRTC peer connection with all possible configuration options
  const initializePeerConnection = async () => {
    try {
      // Create a new RTCPeerConnection with more STUN servers
      const configuration = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" }, 
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
          { urls: "stun:stun4.l.google.com:19302" }
        ],
        iceCandidatePoolSize: 10,
        bundlePolicy: 'max-bundle',
        rtcpMuxPolicy: 'require',
        sdpSemantics: 'unified-plan'
      }
      
      // Close any existing peer connection
      if (peerConnection.current) {
        peerConnection.current.close()
      }
      
      peerConnection.current = new RTCPeerConnection(configuration)
      console.log("Peer connection initialized", peerConnection.current)
      
      // Create remote stream first
      remoteStream.current = new MediaStream()
      
      // We won't set the remote stream here anymore
      // We'll set it directly when we receive tracks in the ontrack handler
      if (remoteVideo.current) {
        console.log("Preparing remote video element")
        // We'll set srcObject when we receive tracks
      }
      
      // Get local media stream with error handling
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        console.log("Local media stream obtained:", localStream.current)
      } catch (mediaError) {
        console.error("Error accessing media devices:", mediaError)
        toast({
          title: "Camera/Microphone Error",
          description: "Failed to access your camera or microphone. Check permissions.",
          variant: "destructive",
        })
        return null
      }

      // Set local video stream
      if (localVideo.current && localStream.current) {
        localVideo.current.srcObject = localStream.current
        console.log("Local video source set")
      }

      // Add local tracks to peer connection
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => {
          if (peerConnection.current && localStream.current) {
            console.log("Adding track to peer connection:", track.kind)
            peerConnection.current.addTrack(track, localStream.current)
          }
        })
      }

      // Handle incoming tracks - this is critical for receiving audio/video
      peerConnection.current.ontrack = (event) => {
        console.log("Received remote track:", event.track.kind, event.streams)
        
        // Important: Directly set the remote stream instead of adding tracks individually
        if (remoteVideo.current && event.streams && event.streams[0]) {
          console.log("Setting remote video srcObject directly from incoming stream")
          remoteVideo.current.srcObject = event.streams[0];
          remoteStream.current = event.streams[0];
        }
      }

      // Handle ICE candidates
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate && ws.current && currentCaller) {
          console.log("Sending ICE candidate to", currentCaller)
          ws.current.send(
            JSON.stringify({
              type: "ice-candidate",
              candidate: event.candidate,
              userId: "owner",
              target: currentCaller,
            }),
          )
        }
      }

      // Handle ICE connection state changes
      peerConnection.current.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", peerConnection.current?.iceConnectionState)
        if (peerConnection.current?.iceConnectionState === "failed" || 
            peerConnection.current?.iceConnectionState === "disconnected") {
          console.error("ICE connection failed or disconnected")
          toast({
            title: "Connection issue",
            description: "Network connection problem detected",
            variant: "destructive",
          })
        }
      }

      // Handle connection state changes
      peerConnection.current.onconnectionstatechange = () => {
        console.log("Connection state:", peerConnection.current?.connectionState)
        if (peerConnection.current?.connectionState === "failed" || 
            peerConnection.current?.connectionState === "closed") {
          toast({
            title: "Connection lost",
            description: "WebRTC connection failed or closed",
            variant: "destructive",
          })
          handleCallEnded()
        }
      }

      // Log negotiation needed events
      peerConnection.current.onnegotiationneeded = () => {
        console.log("Negotiation needed")
      }

      return peerConnection.current
    } catch (error) {
      console.error("Error initializing peer connection:", error)
      toast({
        title: "Connection Error",
        description: "Failed to initialize video call",
        variant: "destructive",
      })
      return null
    }
  }

  const handleIncomingCall = (message: any) => {
    // Only accept calls if not already in a call
    if (callState === "idle") {
      setCallState("incoming")
      setCurrentCaller(message.userId)
      setIncomingCall({
        userId: message.userId,
        offer: message.offer,
      })
      toast({
        title: "Incoming Call",
        description: `Call from ${message.userId}`,
      })
    } else {
      // Reject call if already in a call
      if (ws.current) {
        ws.current.send(
          JSON.stringify({
            type: "callRejected",
            reason: "busy",
            userId: "owner",
            target: message.userId,
          }),
        )
      }
    }
  }

  const acceptCall = async () => {
    if (!incomingCall || !ws.current) return

    try {
      console.log("Accepting call from", incomingCall.userId)
      
      // Initialize WebRTC peer connection
      const pc = await initializePeerConnection()
      if (!pc) return

      // Set remote description from offer
      console.log("Setting remote description", incomingCall.offer)
      await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer))

      // Create and send answer
      console.log("Creating answer")
      const answer = await pc.createAnswer()
      console.log("Setting local description", answer)
      await pc.setLocalDescription(answer)

      console.log("Sending call accepted message")
      ws.current.send(
        JSON.stringify({
          type: "callAccepted",
          userId: "owner",
          target: incomingCall.userId,
          answer: answer,
        }),
      )

      setCallState("connected")
      toast({
        title: "Call Connected",
        description: `Connected with ${incomingCall.userId}`,
      })
    } catch (error) {
      console.error("Error accepting call:", error)
      toast({
        title: "Call Failed",
        description: "Failed to establish call connection",
        variant: "destructive",
      })
      setCallState("idle")
      setCurrentCaller(null)
      setIncomingCall(null)
    }
  }

  const rejectCall = () => {
    if (!incomingCall || !ws.current) return

    ws.current.send(
      JSON.stringify({
        type: "callRejected",
        reason: "rejected",
        userId: "owner",
        target: incomingCall.userId,
      }),
    )

    setCallState("idle")
    setCurrentCaller(null)
    setIncomingCall(null)
  }

  const handleIceCandidate = async (message: any) => {
    try {
      if (!peerConnection.current) {
        console.warn("Received ICE candidate but peer connection is not initialized")
        return
      }

      console.log("Adding ICE candidate", message.candidate)
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(message.candidate))
    } catch (error) {
      console.error("Error handling ICE candidate:", error)
    }
  }

  const handleAnswer = async (message: any) => {
    try {
      if (!peerConnection.current) {
        console.warn("Received answer but peer connection is not initialized")
        return
      }

      console.log("Setting remote description from answer", message.answer)
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(message.answer))
    } catch (error) {
      console.error("Error handling answer:", error)
    }
  }

  const endCall = () => {
    if (ws.current && currentCaller) {
      console.log("Ending call with", currentCaller)
      ws.current.send(
        JSON.stringify({
          type: "endCall",
          userId: "owner",
          target: currentCaller,
        }),
      )
    }

    handleCallEnded()
  }

  const handleRemoveUser = (userId: string) => {
    if (ws.current) {
      ws.current.send(JSON.stringify({ type: "removeUser", userId }))
    } else {
      console.log("WebSocket connection not established yet.")
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Support Dashboard</h1>
      
      {!isConnected && (
        <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p className="font-bold">Connecting to server...</p>
          <p>Please wait while we establish a connection.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Connected Users</h2>
          {remoteUsers.length === 0 ? (
            <p className="text-gray-500">No users connected</p>
          ) : (
            <ul className="space-y-2">
              {remoteUsers.map((user) => (
                <li key={user} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="font-medium">{user}</span>
                  <div className="flex gap-2">
                    {currentCaller === user ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        In Call
                      </Badge>
                    ) : (
                      <Button
                        onClick={() => handleRemoveUser(user)}
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <UserX size={16} />
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Call Center</h2>

          {callState === "idle" ? (
            <div className="text-center p-8">
              <p className="text-gray-500 mb-4">No active calls</p>
            </div>
          ) : callState === "incoming" ? (
            <div className="text-center space-y-4">
              <p className="text-lg font-medium">
                Incoming call from <span className="font-bold">{currentCaller}</span>
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={acceptCall}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <Phone size={20} />
                  Accept
                </Button>
                <Button onClick={rejectCall} variant="destructive" className="flex items-center gap-2">
                  <PhoneOff size={20} />
                  Reject
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium">
                  Connected with <span className="font-bold">{currentCaller}</span>
                </p>
                <Button onClick={endCall} variant="destructive" size="sm" className="flex items-center gap-2">
                  <PhoneOff size={16} />
                  End Call
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="relative">
                  <video
                    ref={localVideo}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-48 bg-black rounded-md object-cover"
                  />
                  <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">You</span>
                </div>
                <div className="relative">
                  <video
                    ref={remoteVideo}
                    autoPlay
                    playsInline
                    className="w-full h-48 bg-black rounded-md object-cover"
                  />
                  <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
                    User
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default OwnerPage