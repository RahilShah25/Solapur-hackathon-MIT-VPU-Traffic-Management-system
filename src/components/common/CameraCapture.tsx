"use client"

import React, { useRef, useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, X } from "lucide-react"

interface CameraCaptureProps {
    onCapture: (imageData: string) => void
    onClose: () => void
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
    const [error, setError] = useState<string>("")

    useEffect(() => {
        startCamera()
        return () => stopCamera()
    }, [facingMode])

    const startCamera = async () => {
        stopCamera()
        try {
            const constraints = {
                video: { facingMode: facingMode }
            }
            const newStream = await navigator.mediaDevices.getUserMedia(constraints)
            if (videoRef.current) {
                videoRef.current.srcObject = newStream
            }
            setStream(newStream)
            setError("")
        } catch (err: any) {
            console.error("Camera Error:", err)
            // Fallback: If environment fails (e.g. laptop), try user
            if (facingMode === "environment" && (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError")) {
                setFacingMode("user")
                return
            }
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                setError("Camera permission denied. Please allow access in browser settings.")
            } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                setError("No camera found on this device.")
            } else {
                setError("Unable to access camera. Please try again.")
            }
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
    }

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current
            const canvas = canvasRef.current

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            // Draw current video frame to canvas
            const context = canvas.getContext('2d')
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height)
                const imageData = canvas.toDataURL('image/jpeg', 0.8)
                stopCamera()
                onCapture(imageData)
            }
        }
    }

    const toggleCamera = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user")
    }

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-[3/4]">
                {error ? (
                    <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center">
                        <Camera className="h-12 w-12 mb-4 text-red-500" />
                        <p className="mb-4">{error}</p>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => setFacingMode(prev => prev === "user" ? "environment" : "user")}>
                                <RefreshCw className="h-4 w-4 mr-2" /> Switch Camera
                            </Button>
                            <Button variant="outline" onClick={onClose}>Close</Button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Video Feed */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />

                        {/* Overlays */}
                        <div className="absolute top-4 right-4 z-10">
                            <Button size="icon" variant="secondary" className="rounded-full bg-black/50 text-white hover:bg-black/70" onClick={onClose}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 z-10">
                            <Button
                                size="icon"
                                variant="outline"
                                className="rounded-full h-12 w-12 bg-black/50 border-white/20 text-white backdrop-blur-md"
                                onClick={toggleCamera}
                            >
                                <RefreshCw className="h-5 w-5" />
                            </Button>

                            <Button
                                size="lg"
                                className="h-20 w-20 rounded-full bg-white border-4 border-gray-300 hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
                                onClick={handleCapture}
                            >
                                <div className="h-16 w-16 rounded-full border-2 border-black/10" />
                            </Button>

                            <div className="w-12" /> {/* Spacer for balance */}
                        </div>
                    </>
                )}
            </div>
            <p className="text-white/60 text-sm mt-4 font-medium">Align vehicle in frame</p>
            <canvas ref={canvasRef} className="hidden" />
        </div>
    )
}
