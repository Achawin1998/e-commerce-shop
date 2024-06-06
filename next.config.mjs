/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['epic-projects.nyc3.digitaloceanspaces.com']
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://e-commerce-shop-livid.vercel.app/api/:path*',
            },
        ];
    }
};

export default nextConfig;