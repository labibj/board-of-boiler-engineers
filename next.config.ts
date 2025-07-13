/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      // Add 'storage.googleapis.com' to allow images from Google Cloud Storage
      'storage.googleapis.com',
      // If you were previously using Cloudinary for any images, keep 'res.cloudinary.com'
      // 'res.cloudinary.com',
      // Add any other external image domains your application might use
    ],
  },
  // You can add other Next.js configurations here if needed
};

export default nextConfig;
