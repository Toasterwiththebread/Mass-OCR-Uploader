/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async rewrites() {
		return [
			{
				source: "/ocr-server/:path*",
				destination: "http://ocr-api.049960.xyz/:path*"
			}
		]
	}
};

export default nextConfig;
