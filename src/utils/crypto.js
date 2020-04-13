import crypto from 'crypto';

let aesEncrypt = function (data, key) { // 加密
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

let aesDecrypt = function (encrypted, key) { // 解密
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

const content = {
    aesEncrypt,
    aesDecrypt
};

export default content;
