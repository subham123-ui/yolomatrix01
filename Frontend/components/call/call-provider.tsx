"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

// Define the context type
interface CallContextType {
  isCallActive: boolean
  isMuted: boolean
  isVideoEnabled: boolean
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  startCall: () => Promise<void>
  endCall: () => void
  toggleMute: () => void
  toggleVideo: () => void
  incomingCall: { from: string; timestamp: number } | null
  acceptCall: () => Promise<void>
  rejectCall: () => void
  isCallReady: boolean
  setIsCallReady: (ready: boolean) => void
}

// Create the context with default values
const CallContext = createContext<CallContextType>({
  isCallActive: false,
  isMuted: false,
  isVideoEnabled: true,
  localStream: null,
  remoteStream: null,
  startCall: async () => {},
  endCall: () => {},
  toggleMute: () => {},
  toggleVideo: () => {},
  incomingCall: null,
  acceptCall: async () => {},
  rejectCall: () => {},
  isCallReady: false,
  setIsCallReady: () => {},
})

// Custom hook to use the call context
export const useCallContext = () => useContext(CallContext)

interface CallProviderProps {
  children: ReactNode
  ownerMode?: boolean // Set to true for the owner's interface
}

export default function CallProvider({ children, ownerMode = false }: CallProviderProps) {
  const { toast } = useToast()
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null)
  const [clientId] = useState(`${ownerMode ? "owner" : "client"}-${Math.random().toString(36).substring(2, 9)}`)
  const [signalingInterval, setSignalingInterval] = useState<NodeJS.Timeout | null>(null)
  const [incomingCall, setIncomingCall] = useState<{ from: string; timestamp: number } | null>(null)
  const [isCallReady, setIsCallReady] = useState(false)
  const [pendingOffer, setPendingOffer] = useState<RTCSessionDescriptionInit | null>(null)
  const [pendingCaller, setPendingCaller] = useState<string | null>(null)
  const [consecutiveErrors, setConsecutiveErrors] = useState(0)

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (signalingInterval) {
        clearInterval(signalingInterval)
      }
      endCall()
    }
  }, [])

  // Set up signaling polling
  useEffect(() => {
    if (isCallReady || isCallActive) {
      // Start polling for signaling messages
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/signaling?clientId=${clientId}`)

          if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`)
          }

          const data = await response.json()

          // Reset consecutive errors counter on success
          if (consecutiveErrors > 0) {
            setConsecutiveErrors(0)
          }

          if (data.success && data.messages && data.messages.length > 0) {
            // Process any pending messages
            data.messages.forEach(handleSignalingMessage)
          }
        } catch (error) {
          console.error("Signaling poll error:", error)

          // Increment consecutive errors counter
          setConsecutiveErrors((prev) => prev + 1)

          // If we've had too many consecutive errors, slow down polling
          if (consecutiveErrors >= 5) {
            clearInterval(interval)

            // Try again after a longer delay
            setTimeout(() => {
              if (isCallReady || isCallActive) {
                setSignalingInterval(setInterval(pollSignalingServer, 5000))
              }
            }, 10000)
          }
        }
      }, 2000)

      setSignalingInterval(interval)

      return () => {
        clearInterval(interval)
        setSignalingInterval(null)
      }
    }
  }, [isCallReady, isCallActive, clientId, consecutiveErrors])

  // Polling function extracted for reuse
  const pollSignalingServer = async () => {
    try {
      const response = await fetch(`/api/signaling?clientId=${clientId}`)

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()

      // Reset consecutive errors counter on success
      if (consecutiveErrors > 0) {
        setConsecutiveErrors(0)
      }

      if (data.success && data.messages && data.messages.length > 0) {
        // Process any pending messages
        data.messages.forEach(handleSignalingMessage)
      }
    } catch (error) {
      console.error("Signaling poll error:", error)
      setConsecutiveErrors((prev) => prev + 1)
    }
  }

  const handleSignalingMessage = async (message: any) => {
    try {
      switch (message.type) {
        case "offer":
          if (ownerMode && isCallReady && !isCallActive) {
            // Store the offer and notify the owner of an incoming call
            setPendingOffer(message.payload)
            setPendingCaller(message.from)
            setIncomingCall({
              from: message.from,
              timestamp: Date.now(),
            })

            // Play notification sound
            try {
              const audio = new Audio("/sounds/incoming-call.mp3")
              await audio.play()
            } catch (err) {
              console.error("Error playing sound:", err)
            }

            // Show toast notification
            toast({
              title: "Incoming Call",
              description: "Someone is calling you. Click to answer.",
              duration: 10000,
            })
          } else if (peerConnection) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message.payload))
            const answer = await peerConnection.createAnswer()
            await peerConnection.setLocalDescription(answer)

            // Send answer back
            await sendSignalingMessage({
              type: "answer",
              from: clientId,
              to: message.from,
              payload: answer,
            })
          }
          break

        case "answer":
          if (peerConnection) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message.payload))
          }
          break

        case "ice-candidate":
          if (peerConnection && message.payload) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(message.payload))
          }
          break

        case "call-rejected":
          if (!ownerMode) {
            toast({
              title: "Call Rejected",
              description: "The recipient is not available right now.",
              variant: "destructive",
            })
            endCall()
          }
          break
      }
    } catch (error) {
      console.error("Error handling signaling message:", error)
    }
  }

  const sendSignalingMessage = async (message: any) => {
    try {
      const response = await fetch("/api/signaling", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      await response.json() // Consume the response
    } catch (error) {
      console.error("Error sending signaling message:", error)
      throw error
    }
  }

  const setupPeerConnection = () => {
    try {
      // Create a new RTCPeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
      })

      // Add local tracks to the connection
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream)
        })
      }

      // Set up remote stream
      const remoteMediaStream = new MediaStream()
      setRemoteStream(remoteMediaStream)

      // Handle incoming tracks
      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteMediaStream.addTrack(track)
        })
      }

      // Handle ICE candidates
      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          // Send this to the other peer via signaling server
          try {
            await sendSignalingMessage({
              type: "ice-candidate",
              from: clientId,
              to: pendingCaller || (ownerMode ? "customer" : "owner"),
              payload: event.candidate,
            })
          } catch (error) {
            console.error("Failed to send ICE candidate:", error)
          }
        }
      }

      // Connection state changes
      pc.onconnectionstatechange = () => {
        console.log("Connection state:", pc.connectionState)
        if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
          endCall()
        }
      }

      setPeerConnection(pc)
      return pc
    } catch (error) {
      console.error("Error setting up peer connection:", error)
      toast({
        title: "Connection Error",
        description: "Failed to set up call connection. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const startCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      setLocalStream(stream)
      setIsCallActive(true)

      const pc = setupPeerConnection()

      // If customer mode, initiate the call
      if (!ownerMode) {
        // Create and send offer
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)

        await sendSignalingMessage({
          type: "offer",
          from: clientId,
          to: "owner", // Send to owner
          payload: offer,
        })

        toast({
          title: "Calling...",
          description: "Waiting for the recipient to answer.",
        })
      }
    } catch (error) {
      console.error("Error starting call:", error)
      toast({
        title: "Call Failed",
        description: "Could not access camera or microphone. Please check permissions.",
        variant: "destructive",
      })
      throw error
    }
  }

  const acceptCall = async () => {
    if (!incomingCall || !pendingOffer || !pendingCaller) return

    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      setLocalStream(stream)
      setIsCallActive(true)

      const pc = setupPeerConnection()

      // Set the remote description (the offer)
      await pc.setRemoteDescription(new RTCSessionDescription(pendingOffer))

      // Create an answer
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      // Send the answer
      await sendSignalingMessage({
        type: "answer",
        from: clientId,
        to: pendingCaller,
        payload: answer,
      })

      // Clear the incoming call state
      setIncomingCall(null)
      setPendingOffer(null)
    } catch (error) {
      console.error("Error accepting call:", error)
      toast({
        title: "Call Failed",
        description: "Could not access camera or microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const rejectCall = () => {
    if (!incomingCall || !pendingCaller) return

    // Send rejection message
    sendSignalingMessage({
      type: "call-rejected",
      from: clientId,
      to: pendingCaller,
    }).catch((error) => {
      console.error("Failed to send call rejection:", error)
    })

    // Clear the incoming call state
    setIncomingCall(null)
    setPendingOffer(null)
    setPendingCaller(null)
  }

  const endCall = () => {
    // Stop all tracks in the local stream
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      setLocalStream(null)
    }

    // Close peer connection
    if (peerConnection) {
      peerConnection.close()
      setPeerConnection(null)
    }

    // Clear remote stream
    setRemoteStream(null)

    // Reset call state
    setIsCallActive(false)
    setIsMuted(false)
    setIsVideoEnabled(true)
    setIncomingCall(null)
    setPendingOffer(null)
    setPendingCaller(null)
  }

  const toggleMute = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsMuted(!audioTracks[0]?.enabled)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks()
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsVideoEnabled(videoTracks[0]?.enabled)
    }
  }

  const contextValue: CallContextType = {
    isCallActive,
    isMuted,
    isVideoEnabled,
    localStream,
    remoteStream,
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
    incomingCall,
    acceptCall,
    rejectCall,
    isCallReady,
    setIsCallReady,
  }

  return <CallContext.Provider value={contextValue}>{children}</CallContext.Provider>
}
