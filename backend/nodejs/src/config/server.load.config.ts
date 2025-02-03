export interface LoadBalancerConfig {
  algorithm: 'round-robin' | 'least-connections' | 'weighted-round-robin';
  healthCheckInterval: number; // milliseconds
  failoverTimeout: number; // milliseconds
  maxRetries: number;
}

export const loadBalancerConfig: LoadBalancerConfig = {
  algorithm: 'round-robin',
  healthCheckInterval: 30000, // 30 seconds
  failoverTimeout: 5000,     // 5 seconds
  maxRetries: 3
};