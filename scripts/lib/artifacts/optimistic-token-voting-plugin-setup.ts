export const PREPARE_INSTALLATION_ABI = [
  {
    components: [
      {
        internalType: "uint32",
        name: "minVetoRatio",
        type: "uint32",
        description:
          "The minimum ratio of the token supply to veto a proposal. Its value has to be in the interval [0, 10^6] defined by `RATIO_BASE = 10**6`.",
      },
      {
        internalType: "uint64",
        name: "minDuration",
        type: "uint64",
        description: "The minimum duration of the proposal vote in seconds.",
      },
      {
        internalType: "uint256",
        name: "minProposerVotingPower",
        type: "uint256",
        description: "The minimum voting power required to create a proposal.",
      },
    ],
    internalType: "struct OptimisticTokenVotingPlugin.OptimisticGovernanceSettings",
    name: "governanceSettings",
    type: "tuple",
    description: "The governance settings that will be enforced when proposals are created.",
  },
  {
    components: [
      {
        internalType: "address",
        name: "token",
        type: "address",
        description:
          "The token address. If this is `address(0)`, a new `GovernanceERC20` token is deployed. If not, the existing token is wrapped as an `GovernanceWrappedERC20`.",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
        description: "The token name. This parameter is only relevant if the token address is `address(0)`.",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
        description: "The token symbol. This parameter is only relevant if the token address is `address(0)`.",
      },
    ],
    internalType: "struct OptimisticTokenVotingPluginSetup.TokenSettings",
    name: "tokenSettings",
    type: "tuple",
    description:
      "The token settings that either specify an existing ERC-20 token (`token = address(0)`) or the name and symbol of a new `GovernanceERC20` token to be created.",
  },
  {
    components: [
      {
        internalType: "address[]",
        name: "receivers",
        type: "address[]",
        description: "The receivers of the tokens.",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
        description: "The amounts of tokens to be minted for each receiver.",
      },
    ],
    internalType: "struct GovernanceERC20.MintSettings",
    name: "mintSettings",
    type: "tuple",
    description: "The token mint settings struct containing the `receivers` and `amounts`.",
  },
  {
    internalType: "address[]",
    name: "proposers",
    type: "address[]",
    description: "The initial list of addresses that can create proposals.",
  },
] as const;
