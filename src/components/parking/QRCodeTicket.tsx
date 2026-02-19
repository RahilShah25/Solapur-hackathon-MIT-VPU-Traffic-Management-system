"use client"

import * as React from "react"
import CryptoJS from 'crypto-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export interface TicketData {
    ticketId: string
    userId: string
    vehicleNo: string
    spotName: string
    startTime: number
    endTime: number
    amount: number
}

interface QRCodeTicketProps {
    data: TicketData
}

// Simple custom component to generate a QR-like pattern
export const MockQRCode = ({ value, size = 200 }: { value: string, size?: number }) => {
    // Generate a pseudo-random pattern based on the value
    const seed = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gridSize = 21; // Standard QR V1 size
    const cellSize = size / gridSize;

    const cells = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            // Corner markers (finder patterns)
            const isCorner = (i < 7 && j < 7) || (i < 7 && j >= gridSize - 7) || (i >= gridSize - 7 && j < 7);

            if (isCorner) {
                // Draw simplified finder patterns
                if ((i === 0 || i === 6) && (j >= 0 && j <= 6)) cells.push(<rect key={`${i}-${j}`} x={j * cellSize} y={i * cellSize} width={cellSize} height={cellSize} fill="black" />);
                else if ((j === 0 || j === 6) && (i >= 0 && i <= 6)) cells.push(<rect key={`${i}-${j}`} x={j * cellSize} y={i * cellSize} width={cellSize} height={cellSize} fill="black" />);
                else if ((i >= 2 && i <= 4) && (j >= 2 && j <= 4)) cells.push(<rect key={`${i}-${j}`} x={j * cellSize} y={i * cellSize} width={cellSize} height={cellSize} fill="black" />);

                // Top Right Corner
                else if ((i === 0 || i === 6) && (j >= gridSize - 7 && j < gridSize)) cells.push(<rect key={`${i}-${j}`} x={j * cellSize} y={i * cellSize} width={cellSize} height={cellSize} fill="black" />);
                else if ((j === gridSize - 7 || j === gridSize - 1) && (i >= 0 && i <= 6)) cells.push(<rect key={`${i}-${j}`} x={j * cellSize} y={i * cellSize} width={cellSize} height={cellSize} fill="black" />);
                else if ((i >= 2 && i <= 4) && (j >= gridSize - 5 && j <= gridSize - 3)) cells.push(<rect key={`${i}-${j}`} x={j * cellSize} y={i * cellSize} width={cellSize} height={cellSize} fill="black" />);

                // Bottom Left Corner
                else if ((i === gridSize - 7 || i === gridSize - 1) && (j >= 0 && j <= 6)) cells.push(<rect key={`${i}-${j}`} x={j * cellSize} y={i * cellSize} width={cellSize} height={cellSize} fill="black" />);
                else if ((j === 0 || j === 6) && (i >= gridSize - 7 && i < gridSize)) cells.push(<rect key={`${i}-${j}`} x={j * cellSize} y={i * cellSize} width={cellSize} height={cellSize} fill="black" />);
                else if ((i >= gridSize - 5 && i <= gridSize - 3) && (j >= 2 && j <= 4)) cells.push(<rect key={`${i}-${j}`} x={j * cellSize} y={i * cellSize} width={cellSize} height={cellSize} fill="black" />);

                continue;
            }

            // Random Data Cells
            const randomVal = Math.sin(seed + i * gridSize + j) * 10000;
            const isBlack = Math.floor(randomVal) % 2 === 0;
            if (isBlack) {
                cells.push(
                    <rect
                        key={`${i}-${j}`}
                        x={j * cellSize}
                        y={i * cellSize}
                        width={cellSize}
                        height={cellSize}
                        fill="black"
                    />
                );
            }
        }
    }

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect width={size} height={size} fill="white" />
            {cells}
        </svg>
    );
};

export default function QRCodeTicket({ data }: QRCodeTicketProps) {
    const [encryptedData, setEncryptedData] = React.useState("")

    React.useEffect(() => {
        // Simulate encryption
        const secretKey = "solapur-traffic-secret-key"
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString()
        setEncryptedData(ciphertext)
    }, [data])

    if (!encryptedData) {
        return <Skeleton className="h-48 w-48 rounded-lg" />
    }

    return (
        <Card className="w-full max-w-sm mx-auto border-2 border-primary/20">
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg text-primary">Parking Pass</CardTitle>
                <CardDescription>Scan at entry/exit</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <div className="bg-white p-4 rounded-xl border-4 border-black">
                    <MockQRCode value={encryptedData} size={200} />
                </div>
                <div className="text-center text-sm space-y-1">
                    <p className="font-mono bg-muted px-2 py-1 rounded inline-block">
                        ID: {data.ticketId}
                    </p>
                    <div className="text-xs text-muted-foreground">
                        <p>Vehicle: {data.vehicleNo}</p>
                        <p>Valid until: {new Date(data.endTime).toLocaleTimeString()}</p>
                    </div>
                </div>
                <div className="w-full text-[10px] text-center text-muted-foreground break-all px-4">
                    Encrypted Hash: {encryptedData.substring(0, 30)}...
                </div>
            </CardContent>
        </Card>
    )
}
