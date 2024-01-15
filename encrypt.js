const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config();

const algorithm = 'aes-128-cbc';

const symKeyBase64 = process.env.SYMMETRIC_KEY || '';
const symKeyBuffer = Buffer.from(symKeyBase64, 'base64');

const dataFile = "public/data/test.txt";
const dataIn = fs.readFileSync(dataFile, 'utf8');
const data = dataIn.replace(/\n/g, "");

const ivFile = "public/data/iv.txt";
const ivIn = fs.readFileSync(ivFile, 'utf8');
const iv = Buffer.from(ivIn.replace(/\n/g, ""), 'hex');

var cipher = crypto.createCipheriv(algorithm, symKeyBuffer, iv);
const clearEncoding = 'buffer';
const cipherEncoding = 'binary';

var encryptedData = [];
encryptedData.push(Buffer.from(cipher.update(Buffer.from(data)), clearEncoding, cipherEncoding));
encryptedData.push(Buffer.from(cipher.final(cipherEncoding)));

const encryptedBuffer = Buffer.concat(encryptedData);

const outFile = 'public/data/test.aes';
fs.writeFile(outFile, encryptedBuffer, (err) => {
       if (err) throw err;
});
