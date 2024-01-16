export function formatHexString(address: string): string {
  if (!address || address.length < 12) {
    return address || "";
  }

  // Take the first 5 characters (including '0x') and the last 4 characters
  return `${address.substring(0, 5)}...${address.substring(
    address.length - 3
  )}`;
}

export function getAddressExplorerLink(address: string, chainName: string) {
  switch (chainName) {
    case "Polygon":
      return "https://polygonscan.com/address/" + address;
    case "Ethereum":
      return "https://etherscan.io/address/" + address;
    case "Arbitrum":
      return "https://arbiscan.io/address/" + address;
    case "Base":
      return "https://basescan.org/address/" + address;
    case "Sepolia":
      return "https://sepolia.etherscan.io/address/" + address;
    case "Goerli":
      return "https://goerli.etherscan.io/address/" + address;
    case "Mumbai":
      return "https://mumbai.polygonscan.com/address/" + address;
  }
  return "";
}

export function getTransactionExplorerLink(tx: string, chainName: string) {
  switch (chainName) {
    case "Polygon":
      return "https://polygonscan.com/tx/" + tx;
    case "Ethereum":
      return "https://etherscan.io/tx/" + tx;
    case "Arbitrum":
      return "https://arbiscan.io/tx/" + tx;
    case "Base":
      return "https://basescan.org/tx/" + tx;
    case "Sepolia":
      return "https://sepolia.etherscan.io/tx/" + tx;
    case "Goerli":
      return "https://goerli.etherscan.io/tx/" + tx;
    case "Mumbai":
      return "https://mumbai.polygonscan.com/tx/" + tx;
  }
  return "";
}
