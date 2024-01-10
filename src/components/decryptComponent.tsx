import { useEffect, useState} from 'react';

async function getSymmetricKey() {
    const keyPath = 'data/encrypted_symmetric_key.bin';
    const encryptedSymmetricKey = await fetch(keyPath);
    const encryptedSymmetricKeyBuffer = await encryptedSymmetricKey.arrayBuffer();

    return encryptedSymmetricKeyBuffer;
}

async function sendEncryptedData() {
    const path = '/data/test.aes';
    const encryptedData = await fetch(path);
    const arrayBuffer = await encryptedData.arrayBuffer();
    console.log("--------- Encrypted Data Length: ", arrayBuffer.byteLength);

    const ivPath = '/data/iv.txt';
    const ivResponse = await fetch(ivPath);
    // const iv = await ivResponse.text().then(text => text.trim());
    const iv = await ivResponse.text();

    const response = await fetch('/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'X-IV': iv
        },
        body: arrayBuffer,
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // const decryptedDataBlob = await response.blob();
    // let decryptedData = await new Response(decryptedDataBlob).arrayBuffer();
    // let decryptedString = new TextDecoder().decode(decryptedData);
    // let decryptedBinary = new Uint8Array(decryptedData);
    // let decryptedString = new TextDecoder().decode(decryptedBinary);
    // console.log("Decrypted Data: ", decryptedString);

    // const decryptedDataBlob = await response.blob();
    // let decryptedData = await new Response(decryptedDataBlob).text();
    // console.log("--------- Decrypted Data Length: ", decryptedData.length);
    // let padding = decryptedData[decryptedData.length - 1];
    // console.log("--------- padding: ", padding);
    // if (padding > 0 && padding <= 16) {
    //    decryptedData = decryptedData.slice(0, decryptedData.length - padding);
    // }
    // console.log("Decrypted Data: ", decryptedData);
    const decryptedData = await response.text();
    console.log("Decrypted Data: ", decryptedData);
}

const DecryptComponent = () => {

    const mapPath1 = "/data/berlin/dataraw.json";
    const mapPath2 = "/data/paris/dataraw.json";

    // Effect to load 'dataraw' point-based data for source and target cities,
    // and store as 'data1', 'data2':
    useEffect(() => {
        const loadData = async () => {

            const keyBuffer = getSymmetricKey();
            await sendEncryptedData();
        };

        loadData();
        }, [mapPath1, mapPath2]);

    return (
        <>
        </>
    )
}

export default DecryptComponent;
