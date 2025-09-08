/** @type {import('next').NextConfig} */
const nextConfig = {
    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/:path*',
    //             destination: 'http://127.0.0.1:8000/api/:path*',
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
        ],
    }
};

export default nextConfig;
