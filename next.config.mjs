/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['utfs.io']
    },
    reactStrictMode: false,
    //this webpack config change is for suppressing some errors(buffer util)
    webpack: (config) => {
        config.externals.push({
            'bufferutil': 'commonjs bufferutil',
            'utf-8-validate': 'commonjs utf-8-validate'
        });
        return config;
    },
    swcMinify: false
};

export default nextConfig;
