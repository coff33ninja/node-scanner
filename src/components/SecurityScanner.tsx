import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { NetworkDevice } from '@/utils/networkUtils';

interface SecurityScanResult {
  device: NetworkDevice;
  vulnerabilities: string[];
  riskLevel: 'low' | 'medium' | 'high';
  lastScan: Date;
}

export const SecurityScanner = ({ devices }: { devices: NetworkDevice[] }) => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SecurityScanResult[]>([]);

  const startScan = async () => {
    setScanning(true);
    setProgress(0);
    
    for (let i = 0; i < devices.length; i++) {
      // Simulate scanning process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress((i + 1) / devices.length * 100);
      
      const result: SecurityScanResult = {
        device: devices[i],
        vulnerabilities: ['Open ports detected', 'Weak encryption'],
        riskLevel: 'medium',
        lastScan: new Date()
      };
      
      setResults(prev => [...prev, result]);
    }
    
    setScanning(false);
    toast({
      title: "Security Scan Complete",
      description: `Scanned ${devices.length} devices`
    });
  };

  return (
    <Card className="p-4">
      <h2 className="text-2xl font-bold mb-4">Network Security Scanner</h2>
      <div className="space-y-4">
        <Button onClick={startScan} disabled={scanning}>
          {scanning ? 'Scanning...' : 'Start Security Scan'}
        </Button>
        
        {scanning && (
          <Progress value={progress} className="w-full" />
        )}
        
        <div className="space-y-2">
          {results.map((result, index) => (
            <div key={index} className="p-2 bg-secondary rounded">
              <div className="font-bold">{result.device.name}</div>
              <div className="text-sm text-muted-foreground">
                Risk Level: {result.riskLevel}
              </div>
              <div className="text-sm">
                Vulnerabilities: {result.vulnerabilities.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};