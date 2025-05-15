"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function CallButton() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const signalingUrl = process.env.NEXT_PUBLIC_SIGNALING_URL || "ws://localhost:3001"; // 🔥 fallback

    if (!signalingUrl) {
      console.error("NEXT_PUBLIC_SIGNALING_URL is not set");
      return;
    }

    const newWs = new WebSocket(signalingUrl);

    newWs.onopen = () => {
      console.log("Connected to signaling server");
      setIsConnected(true);
    };

    newWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "connected") {
          setUserId(data.id);
        }
      } catch (e) {
        console.error("Failed to parse message", e);
      }
    };

    newWs.onclose = () => {
      console.log("Disconnected from signaling server");
      setIsConnected(false);
    };

    newWs.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(newWs);

    return () => {
      newWs.close();
    };
  }, []);

  const handleCall = () => {
    if (!ws || !isConnected || !userId) {
      console.warn("Not connected or user ID not available");
      return;
    }

    const ownerId = 'owner-id';

    ws.send(
      JSON.stringify({
        target: ownerId,
        type: "call",
        payload: {
          callerId: userId,
          message: "Incoming call from " + userId,
        },
      })
    );

    console.log("Call initiated to owner");
  };

  return (
    <div>
      <Button onClick={handleCall} disabled={!isConnected}>
        Call Support
      </Button>
      {!isConnected && <p>Connecting to signaling server...</p>}
    </div>
  );
}
