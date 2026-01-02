/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // permite cualquier ruta de imagen
      },
    ],
  },
};

module.exports = nextConfig;
