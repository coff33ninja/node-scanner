import { NetworkDevice } from './networkUtils';

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private onDeviceUpdateCallback: ((devices: NetworkDevice[]) => void) | null = null;

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    try {
      this.ws = new WebSocket('ws://localhost:5000/ws');
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'deviceUpdate' && this.onDeviceUpdateCallback) {
            this.onDeviceUpdateCallback(data.devices);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.initializeWebSocket();
      }, 5000);
    }
  }

  public onDeviceUpdate(callback: (devices: NetworkDevice[]) => void) {
    this.onDeviceUpdateCallback = callback;
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const websocketManager = new WebSocketManager();