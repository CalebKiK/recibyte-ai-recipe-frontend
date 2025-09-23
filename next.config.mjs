/** @type {import('next').NextConfig} */
const nextConfig = {
    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/:path*',
    //             destination: 'https://backend-recipbyte.fly.dev/api/:path*',
    //         },
    //     ];
    // },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.spoonacular.com",
                pathname: "/**", 
            },
            {
                protocol: "https",
                hostname: "spoonacular.com",  
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "127.0.0.1",
                port: "8000",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "backend-recipbyte.fly.dev",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "img.sndimg.com",
                pathname: "/**",
            },
            {
                protocol: 'https',
                hostname: 'img.sndimg.com',
                pathname: '/food/image/upload/**',
            },
        ],
    }
};

export default nextConfig;
