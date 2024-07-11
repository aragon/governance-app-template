export const ToucanRelayAbi = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "error",
    inputs: [
      { name: "proposalRef", internalType: "uint256", type: "uint256" },
      {
        name: "reason",
        internalType: "enum ToucanRelay.ErrReason",
        type: "uint8",
      },
    ],
    name: "CannotDispatch",
  },
  { type: "error", inputs: [], name: "CannotReceive" },
  {
    type: "error",
    inputs: [
      { name: "proposalRef", internalType: "uint256", type: "uint256" },
      { name: "voter", internalType: "address", type: "address" },
      {
        name: "voteOptions",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
      },
      {
        name: "reason",
        internalType: "enum ToucanRelay.ErrReason",
        type: "uint8",
      },
    ],
    name: "CannotVote",
  },
  {
    type: "error",
    inputs: [
      { name: "dao", internalType: "address", type: "address" },
      { name: "where", internalType: "address", type: "address" },
      { name: "who", internalType: "address", type: "address" },
      { name: "permissionId", internalType: "bytes32", type: "bytes32" },
    ],
    name: "DaoUnauthorized",
  },
  { type: "error", inputs: [], name: "InvalidDelegate" },
  { type: "error", inputs: [], name: "InvalidDestinationEid" },
  { type: "error", inputs: [], name: "InvalidEndpointCall" },
  {
    type: "error",
    inputs: [{ name: "optionType", internalType: "uint16", type: "uint16" }],
    name: "InvalidOptionType",
  },
  { type: "error", inputs: [], name: "InvalidToken" },
  { type: "error", inputs: [], name: "LzTokenUnavailable" },
  {
    type: "error",
    inputs: [{ name: "eid", internalType: "uint32", type: "uint32" }],
    name: "NoPeer",
  },
  {
    type: "error",
    inputs: [{ name: "msgValue", internalType: "uint256", type: "uint256" }],
    name: "NotEnoughNative",
  },
  {
    type: "error",
    inputs: [{ name: "addr", internalType: "address", type: "address" }],
    name: "OnlyEndpoint",
  },
  {
    type: "error",
    inputs: [
      { name: "eid", internalType: "uint32", type: "uint32" },
      { name: "sender", internalType: "bytes32", type: "bytes32" },
    ],
    name: "OnlyPeer",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "previousAdmin",
        internalType: "address",
        type: "address",
        indexed: false,
      },
      {
        name: "newAdmin",
        internalType: "address",
        type: "address",
        indexed: false,
      },
    ],
    name: "AdminChanged",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "beacon",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "BeaconUpgraded",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "buffer",
        internalType: "uint32",
        type: "uint32",
        indexed: false,
      },
    ],
    name: "BrigeDelayBufferUpdated",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [{ name: "dstEid", internalType: "uint32", type: "uint32", indexed: true }],
    name: "DestinationEidUpdated",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [{ name: "version", internalType: "uint8", type: "uint8", indexed: false }],
    name: "Initialized",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "eid", internalType: "uint32", type: "uint32", indexed: false },
      {
        name: "peer",
        internalType: "bytes32",
        type: "bytes32",
        indexed: false,
      },
    ],
    name: "PeerSet",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "implementation",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "Upgraded",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "dstEid", internalType: "uint32", type: "uint32", indexed: true },
      {
        name: "proposalRef",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "voter",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "voteOptions",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
        indexed: false,
      },
    ],
    name: "VoteCast",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "dstEid", internalType: "uint32", type: "uint32", indexed: true },
      {
        name: "proposalRef",
        internalType: "uint256",
        type: "uint256",
        indexed: true,
      },
      {
        name: "votes",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
        indexed: false,
      },
      {
        name: "receipt",
        internalType: "struct MessagingReceipt",
        type: "tuple",
        components: [
          { name: "guid", internalType: "bytes32", type: "bytes32" },
          { name: "nonce", internalType: "uint64", type: "uint64" },
          {
            name: "fee",
            internalType: "struct MessagingFee",
            type: "tuple",
            components: [
              { name: "nativeFee", internalType: "uint256", type: "uint256" },
              { name: "lzTokenFee", internalType: "uint256", type: "uint256" },
            ],
          },
        ],
        indexed: false,
      },
    ],
    name: "VotesDispatched",
  },
  {
    type: "function",
    inputs: [],
    name: "OAPP_ADMINISTRATOR_ID",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "UPGRADE_PLUGIN_PERMISSION_ID",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      {
        name: "origin",
        internalType: "struct Origin",
        type: "tuple",
        components: [
          { name: "srcEid", internalType: "uint32", type: "uint32" },
          { name: "sender", internalType: "bytes32", type: "bytes32" },
          { name: "nonce", internalType: "uint64", type: "uint64" },
        ],
      },
    ],
    name: "allowInitializePath",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "buffer",
    outputs: [{ name: "", internalType: "uint32", type: "uint32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "_proposalRef", internalType: "uint256", type: "uint256" }],
    name: "canDispatch",
    outputs: [
      { name: "", internalType: "bool", type: "bool" },
      { name: "", internalType: "enum ToucanRelay.ErrReason", type: "uint8" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "_proposalRef", internalType: "uint256", type: "uint256" },
      { name: "_voter", internalType: "address", type: "address" },
      {
        name: "_voteOptions",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
      },
    ],
    name: "canVote",
    outputs: [
      { name: "", internalType: "bool", type: "bool" },
      { name: "", internalType: "enum ToucanRelay.ErrReason", type: "uint8" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "composeMsgSender",
    outputs: [{ name: "sender", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "dao",
    outputs: [{ name: "", internalType: "contract IDAO", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "_proposalRef", internalType: "uint256", type: "uint256" },
      {
        name: "_params",
        internalType: "struct ToucanRelay.LzSendParams",
        type: "tuple",
        components: [
          { name: "gasLimit", internalType: "uint128", type: "uint128" },
          {
            name: "fee",
            internalType: "struct MessagingFee",
            type: "tuple",
            components: [
              { name: "nativeFee", internalType: "uint256", type: "uint256" },
              { name: "lzTokenFee", internalType: "uint256", type: "uint256" },
            ],
          },
          { name: "options", internalType: "bytes", type: "bytes" },
        ],
      },
    ],
    name: "dispatchVotes",
    outputs: [
      {
        name: "receipt",
        internalType: "struct MessagingReceipt",
        type: "tuple",
        components: [
          { name: "guid", internalType: "bytes32", type: "bytes32" },
          { name: "nonce", internalType: "uint64", type: "uint64" },
          {
            name: "fee",
            internalType: "struct MessagingFee",
            type: "tuple",
            components: [
              { name: "nativeFee", internalType: "uint256", type: "uint256" },
              { name: "lzTokenFee", internalType: "uint256", type: "uint256" },
            ],
          },
        ],
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [],
    name: "dstEid",
    outputs: [{ name: "", internalType: "uint32", type: "uint32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "endpoint",
    outputs: [
      {
        name: "",
        internalType: "contract ILayerZeroEndpointV2",
        type: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "_dstEid", internalType: "uint32", type: "uint32" },
      { name: "_proposalRef", internalType: "uint256", type: "uint256" },
      { name: "_voter", internalType: "address", type: "address" },
    ],
    name: "getVotes",
    outputs: [
      {
        name: "",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "_proposalRef", internalType: "uint256", type: "uint256" },
      { name: "_voter", internalType: "address", type: "address" },
    ],
    name: "getVotes",
    outputs: [
      {
        name: "",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "_proposalRef", internalType: "uint256", type: "uint256" }],
    name: "hasEnoughTimeToBridge",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "implementation",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "_token", internalType: "address", type: "address" },
      { name: "_lzEndpoint", internalType: "address", type: "address" },
      { name: "_dao", internalType: "address", type: "address" },
      { name: "_dstEid", internalType: "uint32", type: "uint32" },
      { name: "_buffer", internalType: "uint32", type: "uint32" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "_proposalRef", internalType: "uint256", type: "uint256" }],
    name: "isProposalOpen",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      {
        name: "_origin",
        internalType: "struct Origin",
        type: "tuple",
        components: [
          { name: "srcEid", internalType: "uint32", type: "uint32" },
          { name: "sender", internalType: "bytes32", type: "bytes32" },
          { name: "nonce", internalType: "uint64", type: "uint64" },
        ],
      },
      { name: "_guid", internalType: "bytes32", type: "bytes32" },
      { name: "_message", internalType: "bytes", type: "bytes" },
      { name: "_executor", internalType: "address", type: "address" },
      { name: "_extraData", internalType: "bytes", type: "bytes" },
    ],
    name: "lzReceive",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "", internalType: "uint32", type: "uint32" },
      { name: "", internalType: "bytes32", type: "bytes32" },
    ],
    name: "nextNonce",
    outputs: [{ name: "nonce", internalType: "uint64", type: "uint64" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "oAppVersion",
    outputs: [
      { name: "senderVersion", internalType: "uint64", type: "uint64" },
      { name: "receiverVersion", internalType: "uint64", type: "uint64" },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "uint32", type: "uint32" }],
    name: "peers",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "pluginType",
    outputs: [{ name: "", internalType: "enum IPlugin.PluginType", type: "uint8" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [{ name: "_proposalRef", internalType: "uint256", type: "uint256" }],
    name: "proposals",
    outputs: [
      {
        name: "",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "_dstEid", internalType: "uint32", type: "uint32" },
      { name: "_proposalRef", internalType: "uint256", type: "uint256" },
    ],
    name: "proposals",
    outputs: [
      {
        name: "",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "proxiableUUID",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "_proposalRef", internalType: "uint256", type: "uint256" },
      { name: "_gasLimit", internalType: "uint128", type: "uint128" },
    ],
    name: "quote",
    outputs: [
      {
        name: "params",
        internalType: "struct ToucanRelay.LzSendParams",
        type: "tuple",
        components: [
          { name: "gasLimit", internalType: "uint128", type: "uint128" },
          {
            name: "fee",
            internalType: "struct MessagingFee",
            type: "tuple",
            components: [
              { name: "nativeFee", internalType: "uint256", type: "uint256" },
              { name: "lzTokenFee", internalType: "uint256", type: "uint256" },
            ],
          },
          { name: "options", internalType: "bytes", type: "bytes" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "_dstEid", internalType: "uint256", type: "uint256" }],
    name: "refundAddress",
    outputs: [{ name: "", internalType: "address", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "_buffer", internalType: "uint32", type: "uint32" }],
    name: "setBridgeDelayBuffer",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "_delegate", internalType: "address", type: "address" }],
    name: "setDelegate",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "_dstEid", internalType: "uint32", type: "uint32" }],
    name: "setDstEid",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "_eid", internalType: "uint32", type: "uint32" },
      { name: "_peer", internalType: "bytes32", type: "bytes32" },
    ],
    name: "setPeer",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "_interfaceId", internalType: "bytes4", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "token",
    outputs: [{ name: "", internalType: "contract IVotes", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "newImplementation", internalType: "address", type: "address" }],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "newImplementation", internalType: "address", type: "address" },
      { name: "data", internalType: "bytes", type: "bytes" },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    inputs: [
      { name: "_proposalRef", internalType: "uint256", type: "uint256" },
      {
        name: "_voteOptions",
        internalType: "struct IVoteContainer.Tally",
        type: "tuple",
        components: [
          { name: "abstain", internalType: "uint256", type: "uint256" },
          { name: "yes", internalType: "uint256", type: "uint256" },
          { name: "no", internalType: "uint256", type: "uint256" },
        ],
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;
