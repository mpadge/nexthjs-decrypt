import * as crypto from 'crypto';

export async function POST(request: any): Promise<Response> {
   return new Promise(async (resolve, reject) => {
       const symKeyBase64: string = process.env.SYMMETRIC_KEY || '';

       const symKeyBuffer = Buffer.from(symKeyBase64, 'base64');
       if (symKeyBuffer.length !== 32) {
           reject(new Error('Invalid key length'));
           return;
       }

       const iv = Buffer.from(request.headers.get('X-IV'), 'hex');

       // Get encrypted data from request body and convert to a Buffer
       // const arrayBuffer = await request.arrayBuffer();
       // const encryptedData = Buffer.from(arrayBuffer);

       let encryptedData = Buffer.alloc(0);
       for await (const chunk of request.body) {
          encryptedData = Buffer.concat([encryptedData, chunk]);
       }
       console.log('Length of encryptedData: ', encryptedData.length);

       const decipher = crypto.createDecipheriv('aes-256-cbc', symKeyBuffer, iv);
       decipher.setAutoPadding(false);
       let decryptedData = decipher.update(encryptedData);
       decryptedData = Buffer.concat([decryptedData, decipher.final()]);

       // Remove padding
       const padding = decryptedData[decryptedData.length - 1];
       if (padding > 0 && padding <= 16) {
           decryptedData = decryptedData.slice(0, decryptedData.length - padding);
       }

       // Convert decrypted data to a string
       const decryptedString = decryptedData.toString('utf8');

       resolve(new Response(decryptedString, { headers: { 'Content-Type': 'text/plain' } }));
   });
}
