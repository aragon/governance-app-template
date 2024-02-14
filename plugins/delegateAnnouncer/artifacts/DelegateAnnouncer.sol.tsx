import { Abi } from 'viem';
export const DelegateAnnouncerAbi: Abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "dao",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "delegate",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "message",
				"type": "bytes"
			}
		],
		"name": "AnnounceDelegation",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "dao",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "message",
				"type": "bytes"
			}
		],
		"name": "announceDelegation",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
] as const;
