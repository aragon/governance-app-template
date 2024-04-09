export const ABI = [
  {
    inputs: [
      {
        internalType: "contract PluginRepoRegistry",
        name: "_pluginRepoRegistry",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_subdomain",
        type: "string",
      },
      {
        internalType: "address",
        name: "_initialOwner",
        type: "address",
      },
    ],
    name: "createPluginRepo",
    outputs: [
      {
        internalType: "contract PluginRepo",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_subdomain",
        type: "string",
      },
      {
        internalType: "address",
        name: "_pluginSetup",
        type: "address",
      },
      {
        internalType: "address",
        name: "_maintainer",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_releaseMetadata",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_buildMetadata",
        type: "bytes",
      },
    ],
    name: "createPluginRepoWithFirstVersion",
    outputs: [
      {
        internalType: "contract PluginRepo",
        name: "pluginRepo",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pluginRepoBase",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pluginRepoRegistry",
    outputs: [
      {
        internalType: "contract PluginRepoRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "protocolVersion",
    outputs: [
      {
        internalType: "uint8[3]",
        name: "",
        type: "uint8[3]",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
