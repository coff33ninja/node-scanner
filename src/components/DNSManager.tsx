import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface DNSRecord {
  hostname: string;
  ip: string;
  type: 'A' | 'CNAME' | 'MX';
}

export const DNSManager = () => {
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [newRecord, setNewRecord] = useState<DNSRecord>({
    hostname: '',
    ip: '',
    type: 'A'
  });

  const handleAddRecord = () => {
    setDnsRecords([...dnsRecords, newRecord]);
    setNewRecord({ hostname: '', ip: '', type: 'A' });
    toast({
      title: "DNS Record Added",
      description: `Added ${newRecord.type} record for ${newRecord.hostname}`
    });
  };

  return (
    <Card className="p-4">
      <h2 className="text-2xl font-bold mb-4">DNS Management</h2>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Hostname"
            value={newRecord.hostname}
            onChange={(e) => setNewRecord({ ...newRecord, hostname: e.target.value })}
          />
          <Input
            placeholder="IP Address"
            value={newRecord.ip}
            onChange={(e) => setNewRecord({ ...newRecord, ip: e.target.value })}
          />
          <Button onClick={handleAddRecord}>Add Record</Button>
        </div>
        <div className="space-y-2">
          {dnsRecords.map((record, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-secondary rounded">
              <span>{record.hostname}</span>
              <span>{record.ip}</span>
              <span>{record.type}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};