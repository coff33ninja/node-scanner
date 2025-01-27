declare module 'wake-on-lan' {
    function wake(macAddress: string, options?: {
        address?: string;
        port?: number;
    }, callback?: (error: Error | null) => void): void;

    export = wake;
}