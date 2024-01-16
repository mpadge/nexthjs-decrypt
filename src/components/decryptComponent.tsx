import { useEffect, useState} from 'react';

async function decryptData() {
    const path = '/data/test.aes';
    const encryptedData = await fetch(path);
    const arrayBuffer = await encryptedData.arrayBuffer();
    console.log('Length of encryptedData IN: ', arrayBuffer.byteLength);
    console.log('-----encryptedData IN: ', Buffer.from(arrayBuffer).toString('hex'));

    const ivPath = '/data/iv.txt';
    const ivResponse = await fetch(ivPath);
    const iv = await ivResponse.text().then(text => text.trim());

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
