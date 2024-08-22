export const RawActionListAbi = [
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
] as const;
