import crypto from 'crypto';
import { TIK_TOK_APP_SECRET } from '../constants';

const TikTokGenerateSignature = (path: string, params: Record<string, any>, body?: string): string => {
    const sortedKeys = Object.keys(params).filter(key => key !== 'sign' && key !== 'access_token').sort();

    let baseString = sortedKeys.reduce((acc, key) => acc + key + params[key], '');

    baseString = path + baseString;

    if (body && typeof body === 'string' && body.length > 0) {
        baseString += body;
    }

    const signString = TIK_TOK_APP_SECRET + baseString + TIK_TOK_APP_SECRET;

    return crypto.createHmac('sha256', TIK_TOK_APP_SECRET)
                 .update(signString)
                 .digest('hex');
};

export default TikTokGenerateSignature;
