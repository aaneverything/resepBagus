/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com', 'cookpad.com', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    },
    experimental: {
        allowedDevOrigins: ["http://70.153.9.114"],
    },
};

export default nextConfig;