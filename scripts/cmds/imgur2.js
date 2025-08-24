const axios = require("axios");

module.exports = {
  config: {
    name: "imgur2",
    aliases: ["imgurapi", "uploadimgur", "imgurpic"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 10,
    role: 0, // 0 = everyone can use
    category: "utility",
    shortDescription: "Upload or fetch images from Imgur",
    longDescription: "Upload an image to Imgur or get a random image from Imgur gallery.",
    guide: "{prefix}imgur upload [image_url] - Upload an image\n{prefix}imgur random - Get a random Imgur image"
  },

  onStart: async function ({ api, event, args }) {
    const CLIENT_ID = "YOUR_IMGUR_CLIENT_ID"; // Replace with your Imgur client ID
    const type = args[0];

    if (!type) return api.sendMessage("Please provide a type: upload or random.", event.threadID);

    if (type.toLowerCase() === "upload") {
      const imageUrl = args[1];
      if (!imageUrl) return api.sendMessage("Please provide an image URL to upload.", event.threadID);

      try {
        const response = await axios.post(
          "https://api.imgur.com/3/image",
          { image: imageUrl, type: "URL" },
          { headers: { Authorization: `Client-ID ${CLIENT_ID}` } }
        );

        const imgLink = response.data.data.link;
        api.sendMessage(`✅ Image uploaded successfully!\nLink: ${imgLink}`, event.threadID);
      } catch (err) {
        console.error(err);
        api.sendMessage("❌ Failed to upload image to Imgur.", event.threadID);
      }
    } else if (type.toLowerCase() === "random") {
      try {
        const response = await axios.get("https://api.imgur.com/3/gallery/random/random/1", {
          headers: { Authorization: `Client-ID ${CLIENT_ID}` }
        });

        const images = response.data.data;
        if (images.length === 0) return api.sendMessage("No images found.", event.threadID);

        const randomImage = images[Math.floor(Math.random() * images.length)];
        api.sendMessage(`🎨 Random Imgur Image:\n${randomImage.link}`, event.threadID);
      } catch (err) {
        console.error(err);
        api.sendMessage("❌ Failed to fetch random image.", event.threadID);
      }
    } else {
      api.sendMessage("Invalid type! Use 'upload' or 'random'.", event.threadID);
    }
  }
};
