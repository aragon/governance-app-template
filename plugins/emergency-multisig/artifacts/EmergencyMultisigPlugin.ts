export const EmergencyMultisigPluginAbi = [
  {
    type: "function",
    name: "UPDATE_MULTISIG_SETTINGS_PERMISSION_ID",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "UPGRADE_PLUGIN_PERMISSION_ID",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      {
        name: "_proposalId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "canApprove",
    inputs: [
      {
        name: "_proposalId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_account",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "canExecute",
    inputs: [
      {
        name: "_proposalId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createProposal",
    inputs: [
      {
        name: "_encryptedPayloadURI",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "_publicMetadataUriHash",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_destinationActionsHash",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_destinationPlugin",
        type: "address",
        internalType: "contract OptimisticTokenVotingPlugin",
      },
      {
        name: "_approveProposal",
        type: "bool",
        internalType: "bool",
      },
    ],
    outputs: [
      {
        name: "proposalId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "dao",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IDAO",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "execute",
    inputs: [
      {
        name: "_proposalId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_metadataUri",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "_actions",
        type: "tuple[]",
        internalType: "struct IDAO.Action[]",
        components: [
          {
            name: "to",
            type: "address",
            internalType: "address",
          },
          {
            name: "value",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "data",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getProposal",
    inputs: [
      {
        name: "_proposalId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "executed",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "approvals",
        type: "uint16",
        internalType: "uint16",
      },
      {
        name: "parameters",
        type: "tuple",
        internalType: "struct EmergencyMultisig.ProposalParameters",
        components: [
          {
            name: "minApprovals",
            type: "uint16",
            internalType: "uint16",
          },
          {
            name: "snapshotBlock",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "expirationDate",
            type: "uint64",
            internalType: "uint64",
          },
        ],
      },
      {
        name: "encryptedPayloadURI",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "publicMetadataUriHash",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "destinationActionsHash",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "destinationPlugin",
        type: "address",
        internalType: "contract OptimisticTokenVotingPlugin",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasApproved",
    inputs: [
      {
        name: "_proposalId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_account",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hashActions",
    inputs: [
      {
        name: "_actions",
        type: "tuple[]",
        internalType: "struct IDAO.Action[]",
        components: [
          {
            name: "to",
            type: "address",
            internalType: "address",
          },
          {
            name: "value",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "data",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "actionsHash",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "implementation",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      {
        name: "_dao",
        type: "address",
        internalType: "contract IDAO",
      },
      {
        name: "_multisigSettings",
        type: "tuple",
        internalType: "struct EmergencyMultisig.MultisigSettings",
        components: [
          {
            name: "onlyListed",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "minApprovals",
            type: "uint16",
            internalType: "uint16",
          },
          {
            name: "addresslistSource",
            type: "address",
            internalType: "contract Addresslist",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isMember",
    inputs: [
      {
        name: "_account",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "lastMultisigSettingsChange",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint64",
        internalType: "uint64",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "multisigSettings",
    inputs: [],
    outputs: [
      {
        name: "onlyListed",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "minApprovals",
        type: "uint16",
        internalType: "uint16",
      },
      {
        name: "addresslistSource",
        type: "address",
        internalType: "contract Addresslist",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pluginType",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "enum IPlugin.PluginType",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "proposalCount",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proxiableUUID",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [
      {
        name: "_interfaceId",
        type: "bytes4",
        internalType: "bytes4",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "updateMultisigSettings",
    inputs: [
      {
        name: "_multisigSettings",
        type: "tuple",
        internalType: "struct EmergencyMultisig.MultisigSettings",
        components: [
          {
            name: "onlyListed",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "minApprovals",
            type: "uint16",
            internalType: "uint16",
          },
          {
            name: "addresslistSource",
            type: "address",
            internalType: "contract Addresslist",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "upgradeTo",
    inputs: [
      {
        name: "newImplementation",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "upgradeToAndCall",
    inputs: [
      {
        name: "newImplementation",
        type: "address",
        internalType: "address",
      },
      {
        name: "data",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "event",
    name: "AdminChanged",
    inputs: [
      {
        name: "previousAdmin",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "newAdmin",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Approved",
    inputs: [
      {
        name: "proposalId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "approver",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BeaconUpgraded",
    inputs: [
      {
        name: "beacon",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EmergencyProposalCreated",
    inputs: [
      {
        name: "proposalId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "creator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "encryptedPayloadURI",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Executed",
    inputs: [
      {
        name: "proposalId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MembersAdded",
    inputs: [
      {
        name: "members",
        type: "address[]",
        indexed: false,
        internalType: "address[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MembersRemoved",
    inputs: [
      {
        name: "members",
        type: "address[]",
        indexed: false,
        internalType: "address[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MembershipContractAnnounced",
    inputs: [
      {
        name: "definingContract",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MultisigSettingsUpdated",
    inputs: [
      {
        name: "onlyListed",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
      {
        name: "minApprovals",
        type: "uint16",
        indexed: true,
        internalType: "uint16",
      },
      {
        name: "addresslistSource",
        type: "address",
        indexed: false,
        internalType: "contract Addresslist",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ProposalCreated",
    inputs: [
      {
        name: "proposalId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "creator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "startDate",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
      {
        name: "endDate",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
      {
        name: "metadata",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
      {
        name: "actions",
        type: "tuple[]",
        indexed: false,
        internalType: "struct IDAO.Action[]",
        components: [
          {
            name: "to",
            type: "address",
            internalType: "address",
          },
          {
            name: "value",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "data",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
      {
        name: "allowFailureMap",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ProposalExecuted",
    inputs: [
      {
        name: "proposalId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Upgraded",
    inputs: [
      {
        name: "implementation",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "ApprovalCastForbidden",
    inputs: [
      {
        name: "proposalId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "sender",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "DaoUnauthorized",
    inputs: [
      {
        name: "dao",
        type: "address",
        internalType: "address",
      },
      {
        name: "where",
        type: "address",
        internalType: "address",
      },
      {
        name: "who",
        type: "address",
        internalType: "address",
      },
      {
        name: "permissionId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidActions",
    inputs: [
      {
        name: "proposalId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidAddressListSource",
    inputs: [
      {
        name: "givenContract",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "InvalidMetadataUri",
    inputs: [
      {
        name: "proposalId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "MinApprovalsOutOfBounds",
    inputs: [
      {
        name: "limit",
        type: "uint16",
        internalType: "uint16",
      },
      {
        name: "actual",
        type: "uint16",
        internalType: "uint16",
      },
    ],
  },
  {
    type: "error",
    name: "ProposalCreationForbidden",
    inputs: [
      {
        name: "sender",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ProposalExecutionForbidden",
    inputs: [
      {
        name: "proposalId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
] as const;
