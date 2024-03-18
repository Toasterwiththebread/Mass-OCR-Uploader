import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link
					href="https://cdn.jsdelivr.net/npm/daisyui@4.7.2/dist/full.min.css"
					rel="stylesheet"
					type="text/css"
				/>
				<script src="https://cdn.jsdelivr.net/npm/optiic@latest/dist/index.min.js"></script>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
