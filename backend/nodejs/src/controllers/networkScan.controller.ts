import { Request, Response } from 'express';
import { scanNetwork } from '../utils/networkUtils'; // Importing the scanNetwork function

// Controller to handle network scanning
export const networkScanController = {
    scan: async (req: Request, res: Response) => {
        const { ipRange } = req.body; // Expecting ipRange in the request body
        try {
            const results = await scanNetwork(ipRange); // Call the network scanning function with ipRange
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ message: 'Error scanning network', error });
        }
    }
};
