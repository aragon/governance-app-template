export const ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AnyAddressDisallowedForWhoAndWhere",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IPermissionCondition",
        name: "condition",
        type: "address",
      },
    ],
    name: "ConditionInterfacNotSupported",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "contract IPermissionCondition",
        name: "condition",
        type: "address",
      },
    ],
    name: "ConditionNotAContract",
    type: "error",
  },
  {
    inputs: [],
    name: "EmptyReleaseMetadata",
    type: "error",
  },
  {
    inputs: [],
    name: "GrantWithConditionNotSupported",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPluginSetupInterface",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "latestRelease",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "newRelease",
        type: "uint8",
      },
    ],
    name: "InvalidReleaseIncrement",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "where",
        type: "address",
      },
      {
        internalType: "address",
        name: "who",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "permissionId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "currentCondition",
        type: "address",
      },
      {
        internalType: "address",
        name: "newCondition",
        type: "address",
      },
    ],
    name: "PermissionAlreadyGrantedForDifferentCondition",
    type: "error",
  },
  {
    inputs: [],
    name: "PermissionsForAnyAddressDisallowed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "release",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "build",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "pluginSetup",
        type: "address",
      },
    ],
    name: "PluginSetupAlreadyInPreviousRelease",
    type: "error",
  },
  {
    inputs: [],
    name: "ReleaseDoesNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "ReleaseZeroNotAllowed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "where",
        type: "address",
      },
      {
        internalType: "address",
        name: "who",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "permissionId",
        type: "bytes32",
      },
    ],
    name: "Unauthorized",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "versionHash",
        type: "bytes32",
      },
    ],
    name: "VersionHashDoesNotExist",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "permissionId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "here",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "where",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "who",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "condition",
        type: "address",
      },
    ],
    name: "Granted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "release",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "releaseMetadata",
        type: "bytes",
      },
    ],
    name: "ReleaseMetadataUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "permissionId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "here",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "where",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "who",
        type: "address",
      },
    ],
    name: "Revoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "release",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "build",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "address",
        name: "pluginSetup",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "buildMetadata",
        type: "bytes",
      },
    ],
    name: "VersionCreated",
    type: "event",
  },
  {
    inputs: [],
    name: "MAINTAINER_PERMISSION_ID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ROOT_PERMISSION_ID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UPGRADE_REPO_PERMISSION_ID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "enum PermissionLib.Operation",
            name: "operation",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "where",
            type: "address",
          },
          {
            internalType: "address",
            name: "who",
            type: "address",
          },
          {
            internalType: "address",
            name: "condition",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "permissionId",
            type: "bytes32",
          },
        ],
        internalType: "struct PermissionLib.MultiTargetPermission[]",
        name: "_items",
        type: "tuple[]",
      },
    ],
    name: "applyMultiTargetPermissions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_where",
        type: "address",
      },
      {
        components: [
          {
            internalType: "enum PermissionLib.Operation",
            name: "operation",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "who",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "permissionId",
            type: "bytes32",
          },
        ],
        internalType: "struct PermissionLib.SingleTargetPermission[]",
        name: "items",
        type: "tuple[]",
      },
    ],
    name: "applySingleTargetPermissions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_release",
        type: "uint8",
      },
    ],
    name: "buildCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_release",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_pluginSetup",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_buildMetadata",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_releaseMetadata",
        type: "bytes",
      },
    ],
    name: "createVersion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pluginSetup",
        type: "address",
      },
    ],
    name: "getLatestVersion",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint8",
                name: "release",
                type: "uint8",
              },
              {
                internalType: "uint16",
                name: "build",
                type: "uint16",
              },
            ],
            internalType: "struct PluginRepo.Tag",
            name: "tag",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "pluginSetup",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "buildMetadata",
            type: "bytes",
          },
        ],
        internalType: "struct PluginRepo.Version",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_release",
        type: "uint8",
      },
    ],
    name: "getLatestVersion",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint8",
                name: "release",
                type: "uint8",
              },
              {
                internalType: "uint16",
                name: "build",
                type: "uint16",
              },
            ],
            internalType: "struct PluginRepo.Tag",
            name: "tag",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "pluginSetup",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "buildMetadata",
            type: "bytes",
          },
        ],
        internalType: "struct PluginRepo.Version",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_tagHash",
        type: "bytes32",
      },
    ],
    name: "getVersion",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint8",
                name: "release",
                type: "uint8",
              },
              {
                internalType: "uint16",
                name: "build",
                type: "uint16",
              },
            ],
            internalType: "struct PluginRepo.Tag",
            name: "tag",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "pluginSetup",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "buildMetadata",
            type: "bytes",
          },
        ],
        internalType: "struct PluginRepo.Version",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "release",
            type: "uint8",
          },
          {
            internalType: "uint16",
            name: "build",
            type: "uint16",
          },
        ],
        internalType: "struct PluginRepo.Tag",
        name: "_tag",
        type: "tuple",
      },
    ],
    name: "getVersion",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint8",
                name: "release",
                type: "uint8",
              },
              {
                internalType: "uint16",
                name: "build",
                type: "uint16",
              },
            ],
            internalType: "struct PluginRepo.Tag",
            name: "tag",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "pluginSetup",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "buildMetadata",
            type: "bytes",
          },
        ],
        internalType: "struct PluginRepo.Version",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_where",
        type: "address",
      },
      {
        internalType: "address",
        name: "_who",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_permissionId",
        type: "bytes32",
      },
    ],
    name: "grant",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_where",
        type: "address",
      },
      {
        internalType: "address",
        name: "_who",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_permissionId",
        type: "bytes32",
      },
      {
        internalType: "contract IPermissionCondition",
        name: "_condition",
        type: "address",
      },
    ],
    name: "grantWithCondition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "initialOwner",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_where",
        type: "address",
      },
      {
        internalType: "address",
        name: "_who",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_permissionId",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "isGranted",
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
  {
    inputs: [],
    name: "latestRelease",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
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
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_where",
        type: "address",
      },
      {
        internalType: "address",
        name: "_who",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_permissionId",
        type: "bytes32",
      },
    ],
    name: "revoke",
    outputs: [],
    stateMutability: "nonpayable",
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
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_release",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "_releaseMetadata",
        type: "bytes",
      },
    ],
    name: "updateReleaseMetadata",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;
