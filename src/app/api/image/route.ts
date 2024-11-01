import { type NextRequest } from "next/server";
import { PhotonImage, SamplingFilter, resize } from "@cf-wasm/photon/next";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  // url of image to fetch
  const imageUrl = "https://avatars.githubusercontent.com/u/314135";

  // fetch image and get the Uint8Array instance
  const inputBytes = await fetch(imageUrl)
    .then((res) => res.arrayBuffer())
    .then((buffer) => new Uint8Array(buffer));

  // create a PhotonImage instance
  const inputImage = PhotonImage.new_from_byteslice(inputBytes);

  // resize image using photon
  const outputImage = resize(
    inputImage,
    inputImage.get_width() * 0.5,
    inputImage.get_height() * 0.5,
    SamplingFilter.Nearest
  );

  // get webp bytes
  const outputBytes = outputImage.get_bytes_webp();

  // for other formats
  // png  : outputImage.get_bytes();
  // jpeg : outputImage.get_bytes_jpeg(quality);

  // call free() method to free memory
  inputImage.free();
  outputImage.free();

  // return the Response instance
  return new Response(outputBytes, {
    headers: {
      "Content-Type": "image/webp",
    },
  });
}
