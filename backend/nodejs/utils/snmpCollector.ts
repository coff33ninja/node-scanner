import snmp from 'snmp';

interface SNMPMetrics {
  systemUptime: number;
  interfaceStats: {
    name: string;
    inOctets: number;
    outOctets: number;
    status: string;
  }[];
  cpuUsage: number;
  memoryUsage: number;
}

export class SNMPCollector {
  private session: any;

  constructor(target: string, community: string = 'public') {
    this.session = snmp.createSession(target, community);
  }

  async getMetrics(): Promise<SNMPMetrics> {
    return new Promise((resolve, reject) => {
      const oids = [
        'SNMPv2-MIB::sysUpTime.0',
        'IF-MIB::ifTable',
        'HOST-RESOURCES-MIB::hrProcessorLoad',
        'HOST-RESOURCES-MIB::hrMemorySize'
      ];

      this.session.get(oids, (error: Error, varbinds: any[]) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            systemUptime: varbinds[0]?.value || 0,
            interfaceStats: [],
            cpuUsage: varbinds[2]?.value || 0,
            memoryUsage: varbinds[3]?.value || 0
          });
        }
      });
    });
  }

  close() {
    this.session.close();
  }
}

export const createSNMPCollector = (target: string, community?: string) => {
  return new SNMPCollector(target, community);
};