import QRCode from 'qrcode';

export class QrService {
    /**
     * Generates a Data URL for the QR code.
     * @param text The text to encode.
     */
    async generateDataUrl(text: string): Promise<string> {
        try {
            return await QRCode.toDataURL(text);
        } catch (err) {
            console.error(err);
            throw new Error('Failed to generate QR code');
        }
    }

    /**
     * Generates a Buffer PNG for the QR code.
     * @param text The text to encode.
     */
    async generateBuffer(text: string): Promise<Buffer> {
        try {
            return await QRCode.toBuffer(text);
        } catch (err) {
            console.error(err);
            throw new Error('Failed to generate QR code buffer');
        }
    }
}
