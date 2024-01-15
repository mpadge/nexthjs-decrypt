import * as crypto from 'crypto';

export async function POST(request: any): Promise<Response> {
   return new Promise(async (resolve, reject) => {

       const symKeyBase64: string = process.env.SYMMETRIC_KEY || '';

       const symKeyBuffer = Buffer.from(symKeyBase64, 'base64');
       // if (symKeyBuffer.length !== 32) {
       //     reject(new Error('Invalid key length'));
       //     return;
       // }

       // var data = JSON.stringify({someKey: "someValue"});
       var data = 'A string of data to encrypt';

       console.log('----------');
       console.log('Original cleartext: ' + data);
       var algorithm = 'aes-128-cbc';
       // var key = 'myVeryTopSecretK';
       var key = symKeyBuffer;
       console.log('-----key: ', key);
       var clearEncoding = 'buffer';
       var cipherEncoding = 'binary';

       var iv = Buffer.from(request.headers.get('X-IV'), 'hex');
       // console.log('-----iv0: ', iv);
       var cipher = crypto.createCipheriv(algorithm, key, iv);

       var cipherChunks = [];
       cipherChunks.push(cipher.update(new Buffer(data, 'utf8'), clearEncoding, cipherEncoding));
       cipherChunks.push(cipher.final(cipherEncoding));

       let cipherData = Buffer.concat(cipherChunks.map(chunk => Buffer.from(chunk, 'binary')));
       console.log('Length of cipherData: ', cipherData.length);
       console.log('-----cipherData: ', cipherData);

       var decipher0 = crypto.createDecipheriv(algorithm, key, iv);
       var plainChunks = [];
       for (var i = 0;i < cipherChunks.length;i++) {
           plainChunks.push(decipher0.update(cipherChunks[i], cipherEncoding, clearEncoding));

       }
       plainChunks.push(decipher0.final(clearEncoding));
       console.log("UTF8 plaintext deciphered: " + plainChunks.join(''));
       console.log('----------\n');

       // --------------------------------------------

       // Get encrypted data from request body and convert to a Buffer

       let encryptedData = [];
       for await (const chunk of request.body) {
           encryptedData.push(chunk);
       }
       encryptedData = Buffer.concat(encryptedData);

       const decipher = crypto.createDecipheriv(algorithm, key, iv);
       decipher.setAutoPadding(false);
       console.log("--------A--------");
       let decryptedData = decipher.update(encryptedData);
       console.log("--------B--------");
       decryptedData = Buffer.concat([decryptedData, decipher.final()]);
       console.log("--------C--------");

       // Remove padding
       // const padding = decryptedData[decryptedData.length - 1];
       // if (padding > 0 && padding <= 16) {
       //     decryptedData = decryptedData.slice(0, decryptedData.length - padding);
       // }

       // Convert decrypted data to a string
       const decryptedString = decryptedData.toString('utf8');

       resolve(new Response(decryptedString, { headers: { 'Content-Type': 'text/plain' } }));
   });
}
