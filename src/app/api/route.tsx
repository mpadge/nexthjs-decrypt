import * as crypto from 'crypto';

export async function POST(request: any): Promise<Response> {
   return new Promise(async (resolve, reject) => {

       const symKeyBase64: string = process.env.SYMMETRIC_KEY || '';

       const symKeyBuffer = Buffer.from(symKeyBase64, 'base64');
       // if (symKeyBuffer.length !== 32) {
       //     reject(new Error('Invalid key length'));
       //     return;
       // }

       var data = 'TestText';

       console.log('\n----------START--------');
       console.log('Original cleartext: ' + data);
       var algorithm = 'aes-128-cbc';
       var key = symKeyBuffer;
       var clearEncoding = 'buffer';
       var cipherEncoding = 'binary';

       var iv = Buffer.from(request.headers.get('X-IV'), 'hex');
       var cipher = crypto.createCipheriv(algorithm, key, iv);

       var cipherChunks = [];
       cipherChunks.push(cipher.update(Buffer.from(data, 'utf8'), clearEncoding, cipherEncoding));
       cipherChunks.push(cipher.final(cipherEncoding));

       let cipherData = Buffer.concat(cipherChunks.map(chunk => Buffer.from(chunk, 'binary')));
       console.log('Length of cipherData: ', cipherData.length);
       console.log('-----cipherData: ', cipherData);

       var decipher0 = crypto.createDecipheriv(algorithm, key, iv);
       var plainChunks = [];
       plainChunks.push(decipher0.update(cipherData, cipherEncoding, clearEncoding));
       plainChunks.push(decipher0.final(clearEncoding));
       console.log("UTF8 plaintext deciphered: " + plainChunks.join(''));

       // --------------------------------------------

       // Get encrypted data from request body and convert to a Buffer
       const arrayBuffer = await request.arrayBuffer();
       const encryptedData = Buffer.from(arrayBuffer, 'binary');

       console.log('Length of encryptedData: ', encryptedData.length);
       console.log('-----encryptedData: ', encryptedData);
       console.log('----------END-------\n');

       var decipher1 = crypto.createDecipheriv(algorithm, key, iv);
       var decryptedData = [];
       decryptedData.push(decipher1.update(encryptedData, cipherEncoding, clearEncoding));
       decryptedData.push(decipher1.final(clearEncoding));

       const decryptedString = decryptedData.join('');

       resolve(new Response(decryptedString, { headers: { 'Content-Type': 'text/plain' } }));
   });
}
