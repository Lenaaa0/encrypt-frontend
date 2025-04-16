import React from 'react';
import { Box, Alert } from '@mui/material';
import SM4Crypto from './algorithms/SM4Crypto';
import SHA1Crypto from './algorithms/SHA1Crypto';
import SHA256Crypto from './algorithms/SHA256Crypto';
import SHA3_512Crypto from './algorithms/SHA3_512Crypto';
import PBKDF2Crypto from './algorithms/PBKDF2Crypto';
import RIPEMD160Crypto from './algorithms/RIPEMD160Crypto';
import RC6Crypto from './algorithms/RC6Crypto';
import AESCrypto from './algorithms/AESCrypto';
import Base64Crypto from './algorithms/Base64Crypto';
import UTF_8Crypto from './algorithms/UTF_8Crypto';
import HMACSHA1Crypto from './algorithms/HMACSHA1Crypto';
import HMACSHA256Crypto from './algorithms/HMACSHA256Crypto';
import RSA1024Crypto from './algorithms/RSA1024Crypto';
import RSASHA1Crypto from './algorithms/RSASHA1Crypto';
import ECDSACrypto from './algorithms/ECDSACrypto';
import ECC160Crypto from './algorithms/ECC160Crypto';

const CryptoForm = ({ algorithm }) => {
    const renderAlgorithmInterface = () => {
        switch (algorithm.toUpperCase()) {
            case 'AES':
                return <AESCrypto />;
            case 'SM4':
                return <SM4Crypto />;
            case 'RC6':
                return <RC6Crypto />;
            case 'RSA1024':
                return <RSA1024Crypto />;
            case 'RSASHA1':
                return <RSASHA1Crypto />;
            case 'ECC160':
                return <ECC160Crypto />;
            case 'ECDSA':
                return <ECDSACrypto />;
            case 'SHA1':
                return <SHA1Crypto />;
            case 'SHA256':
                return <SHA256Crypto />;
            case 'SHA3-512':
                return <SHA3_512Crypto />;
            case 'PBKDF2':
                return <PBKDF2Crypto />;
            case 'RIPEMD160':
                return <RIPEMD160Crypto />;
            case 'HMACSHA1':
                return <HMACSHA1Crypto />;
            case 'HMACSHA256':
                return <HMACSHA256Crypto />;
            case 'BASE64':
                return <Base64Crypto />;
            case 'UTF-8':
                return <UTF_8Crypto />;
            default:
                return <Alert severity="error">未知算法: {algorithm}</Alert>;
        }
    };

    return (
        <Box sx={{ width: '100%', margin: 0, pading: 0 }}>
            {renderAlgorithmInterface()}
        </Box>
    );
};

export default CryptoForm;
