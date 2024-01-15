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
encryptedData.push(cipher.update(Buffer.from(data, 'utf8'), clearEncoding, cipherEncoding));
encryptedData.push(cipher.final(cipherEncoding));

const outFile = 'public/data/test.aes';
fs.writeFile(outFile, Buffer.from(encryptedData), (err) => {
       if (err) throw err;
});
