import { useEffect, useState} from 'react';

async function decryptData() {
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

    return decryptedData;
}

const DecryptComponent = () => {

    const [data, setData] = useState('');

    useEffect(() => {
        const loadData = async () => {

            const data = await decryptData();
            setData(data);
        };

        loadData();
        });

    return (
        <>
            <p>{data}</p>
        </>
    )
}

export default DecryptComponent;
