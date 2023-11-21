import { Address } from 'viem';

export function formatAddress(address: Address) {
    if (!address || address.length < 12) {
        return address;
    }

    // Take the first 5 characters (including '0x') and the last 4 characters
    return `${address.substring(0, 5)}...${address.substring(address.length - 4)}`;
}