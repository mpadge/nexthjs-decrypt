# Node crypto to decrypt pre-encrypted data

This is a nextjs template to demonstrate decryption of pre-encrypted data. The
encryption is controlled by [the 'encrypt.js'
file](https://github.com/mpadge/nextjs-decrypt/blob/main/encrypt.js) which also
logs hex bytes of encrypted data generated within that process and ultimately
written to file, to confirm that everything works.

The main nextjs site then reads this file, decrypts it, and prints the result
to the screen. To see that, just run `npm run dev`, open
`http://localhost:3000` in a browser, and click on the `Decrypt` button.

## Why?

Getting this correct requires absolute consistency in converting all input data
to Buffer objects. The main decryption code is in
['src/app/api/route.tsx'](https://github.com/mpadge/nextjs-decrypt/blob/main/src/app/api/route.tsx),
where the `Buffer.from()` calls demonstrate how data have to be processed.
