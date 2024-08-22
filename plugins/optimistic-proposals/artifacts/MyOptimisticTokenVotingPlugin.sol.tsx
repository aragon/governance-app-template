export const MyOptimisticTokenVotingPluginAbi = [
  {
    type: "function",
    name: "PROPOSER_PERMISSION_ID",
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
    name: "UPDATE_OPTIMISTIC_GOVERNANCE_SETTINGS_PERMISSION_ID",
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
    name: "bridgedVotingPower",
    inputs: [
      {
        name: "_timestamp",
        type: "uint256",
        internalType: "uint256",
      },
    ],
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
    name: "canVeto",
    inputs: [
      {
        name: "_proposalId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_voter",
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
    name: "createProposal",
    inputs: [
      {
        name: "_metadata",
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
      {
        name: "_allowFailureMap",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_duration",
        type: "uint64",
        internalType: "uint64",
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
    name: "effectiveVotingPower",
    inputs: [
      {
        name: "_timestamp",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_includeL2VotingPower",
        type: "bool",
        internalType: "bool",
      },
    ],
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
    name: "execute",
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
        name: "open",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "executed",
        type: "bool",
        internalType: "bool",
      },
      {
        name: "parameters",
        type: "tuple",
        internalType: "struct OptimisticTokenVotingPlugin.ProposalParameters",
        components: [
          {
            name: "vetoEndDate",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "snapshotTimestamp",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "minVetoRatio",
            type: "uint32",
            internalType: "uint32",
          },
          {
            name: "skipL2",
            type: "bool",
            internalType: "bool",
          },
        ],
      },
      {
        name: "vetoTally",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "metadataURI",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "actions",
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
      {
        name: "allowFailureMap",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "governanceSettings",
    inputs: [],
    outputs: [
      {
        name: "minVetoRatio",
        type: "uint32",
        internalType: "uint32",
      },
      {
        name: "minDuration",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "l2InactivityPeriod",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "l2AggregationGracePeriod",
        type: "uint64",
        internalType: "uint64",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasVetoed",
    inputs: [
      {
        name: "_proposalId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_voter",
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
        name: "_governanceSettings",
        type: "tuple",
        internalType: "struct OptimisticTokenVotingPlugin.OptimisticGovernanceSettings",
        components: [
          {
            name: "minVetoRatio",
            type: "uint32",
            internalType: "uint32",
          },
          {
            name: "minDuration",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "l2InactivityPeriod",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "l2AggregationGracePeriod",
            type: "uint64",
            internalType: "uint64",
          },
        ],
      },
      {
        name: "_token",
        type: "address",
        internalType: "contract IVotesUpgradeable",
      },
      {
        name: "_l1",
        type: "address",
        internalType: "address",
      },
      {
        name: "_bridge",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isL2Available",
    inputs: [],
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
    name: "isMinVetoRatioReached",
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
    name: "minVetoRatio",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint32",
        internalType: "uint32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "parseProposalId",
    inputs: [
      {
        name: "_proposalId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "counter",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "startDate",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "endDate",
        type: "uint64",
        internalType: "uint64",
      },
    ],
    stateMutability: "pure",
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
    name: "proposalIds",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
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
    name: "bridge",
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
    name: "l1",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract l1",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalVotingPower",
    inputs: [
      {
        name: "_timestamp",
        type: "uint256",
        internalType: "uint256",
      },
    ],
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
    name: "updateOptimisticGovernanceSettings",
    inputs: [
      {
        name: "_governanceSettings",
        type: "tuple",
        internalType: "struct OptimisticTokenVotingPlugin.OptimisticGovernanceSettings",
        components: [
          {
            name: "minVetoRatio",
            type: "uint32",
            internalType: "uint32",
          },
          {
            name: "minDuration",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "l2InactivityPeriod",
            type: "uint64",
            internalType: "uint64",
          },
          {
            name: "l2AggregationGracePeriod",
            type: "uint64",
            internalType: "uint64",
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
    type: "function",
    name: "veto",
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
    name: "votingToken",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IVotesUpgradeable",
      },
    ],
    stateMutability: "view",
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
    name: "OptimisticGovernanceSettingsUpdated",
    inputs: [
      {
        name: "minVetoRatio",
        type: "uint32",
        indexed: false,
        internalType: "uint32",
      },
      {
        name: "minDuration",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
      {
        name: "l2AggregationGracePeriod",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
      {
        name: "l2InactivityPeriod",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
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
    type: "event",
    name: "VetoCast",
    inputs: [
      {
        name: "proposalId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "voter",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "votingPower",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
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
    name: "DurationOutOfBounds",
    inputs: [
      {
        name: "limit",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "actual",
        type: "uint64",
        internalType: "uint64",
      },
    ],
  },
  {
    type: "error",
    name: "MinDurationOutOfBounds",
    inputs: [
      {
        name: "limit",
        type: "uint64",
        internalType: "uint64",
      },
      {
        name: "actual",
        type: "uint64",
        internalType: "uint64",
      },
    ],
  },
  {
    type: "error",
    name: "NoVotingPower",
    inputs: [],
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
  {
    type: "error",
    name: "ProposalVetoingForbidden",
    inputs: [
      {
        name: "proposalId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "RatioOutOfBounds",
    inputs: [
      {
        name: "limit",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "actual",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
] as const;
