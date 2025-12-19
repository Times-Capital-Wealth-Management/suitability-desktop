"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UpsideDownsideCalculator() {
    const [ogPrice, setOgPrice] = useState('');
    const [currentPrice, setCurrentPrice] = useState('');
    const [result, setResult] = useState<{ value: number; type: 'upside' | 'downside' } | null>(null);

    const calculate = () => {
        const og = parseFloat(ogPrice);
        const current = parseFloat(currentPrice);

        if (isNaN(og) || isNaN(current) || og === 0) {
            setResult(null);
            return;
        }

        const percentChange = ((current - og) / og) * 100;
        setResult({
            value: Math.abs(percentChange),
            type: percentChange >= 0 ? 'upside' : 'downside',
        });
    };

    const reset = () => {
        setOgPrice('');
        setCurrentPrice('');
        setResult(null);
    };

    return (
        <div className="space-y-3 p-2">
            <div className="space-y-2">
                <div className="space-y-1">
                    <Label className="text-xs">Original Price</Label>
                    <Input
                        className="bg-input h-8 text-sm"
                        type="number"
                        placeholder="0.00"
                        value={ogPrice}
                        onChange={(e) => setOgPrice(e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <Label className="text-xs">Current Price</Label>
                    <Input
                        className="bg-input h-8 text-sm"
                        type="number"
                        placeholder="0.00"
                        value={currentPrice}
                        onChange={(e) => setCurrentPrice(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-2">
                <Button size="sm" onClick={calculate} className="flex-1">
                    Calculate
                </Button>
                <Button size="sm" variant="outline" onClick={reset} className="flex-1">
                    Reset
                </Button>
            </div>

            {result && (
                <div
                    className={`text-center text-sm font-medium p-2 rounded ${
                        result.type === 'upside'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                >
                    {result.type === 'upside' ? 'Upside' : 'Downside'}: {result.value.toFixed(2)}%
                </div>
            )}
        </div>
    );
}
