///@ts-check
const https = require("https");
const fs = require("fs");

function main() {
  const input = process_input();

  if (input.isDecode) {
    const response_message = decodeImage(input.image);
  }

  https.get(input.image, (result) => {
    const hex_data = [];
    fs.open("output.jpg", "a", (_, fd) => {
      result.on("data", (chunk) => {
        const hex_chunk = chunk.toString("hex");
        hex_data.push(hex_chunk);
      });

      result.on("end", () => {
        let updated_hex = hex_data.join("");

        if (input?.message) {
          updated_hex + input.message;
        }

        const buffer = Buffer.from(updated_hex, "hex");

        fs.write(fd, buffer, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    });
  });
}

main();

function process_input() {
  const args = process.argv.slice(2);

  const hasMessageIndex = args.findIndex((arg) => arg === "-m");
  const message = hasMessageIndex !== -1 ? args[hasMessageIndex + 1] : null;

  const hasImageIndex = args.findIndex((arg) => arg === "-i");
  const image = hasImageIndex !== -1 ? args[hasImageIndex + 1] : null;

  const isDecode = Boolean(args.find((arg) => arg === "-d"));

  const default_img =
    "https://upload.wikimedia.org/wikipedia/commons/3/38/JPEG_example_JPG_RIP_001.jpg";

  return {
    ...(message && { message: message2hex(message) }),
    image: image ? image : default_img,
    isDecode,
  };
}

function message2hex(message) {
  return message
    .split("")
    .map((str) => str.charCodeAt(0).toString(16))
    .join("");
}

function decodeImage(image) {
  const isOnline = image.contains("http");

  return "Hello";
}
