import { getEnv } from "./env";

const PINATA_JWT = getEnv("DEPLOYMENT_PINATA_JWT", true) || "";
const APP_NAME = getEnv("DEPLOYMENT_APP_NAME", true) || "";

const UPLOAD_FILE_NAME = APP_NAME.toLowerCase().trim().replaceAll(" ", "-") + ".json";

export async function uploadToPinata(strBody: string) {
  const blob = new Blob([strBody], { type: "text/plain" });
  const file = new File([blob], UPLOAD_FILE_NAME);
  const data = new FormData();
  data.append("file", file);
  data.append("pinataMetadata", JSON.stringify({ name: UPLOAD_FILE_NAME }));
  data.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: data,
  });

  const resData = await res.json();

  if (resData.error) throw new Error("Request failed: " + resData.error);
  else if (!resData.IpfsHash) throw new Error("Could not pin the metadata");
  return "ipfs://" + resData.IpfsHash;
}
