import dynamic from 'next/dynamic'

import DecryptComponent from '@/components/decryptComponent';

const DecryptCalculate = dynamic(() => Promise.resolve(DecryptComponent), {
    ssr: false
});

export default DecryptCalculate;
