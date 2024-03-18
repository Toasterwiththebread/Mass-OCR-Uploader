/*
	Pretty shit code, and I could have componentized it, but I'm lazy and I need this for a school project.
	
	Sorry for whoever needs to maintain this, ignore the leaking of the API key, however it's free and this
	should be hosted only on a local network.
*/

import React, { useState, useEffect } from "react";

import axios from "axios";

export default function Page() {
	// Using let because it is an instant write, instead of useState, which is async
	let assembledDocument;

	const [backendStatus, setBackendStatus] = useState(false);
	const [apiKey, setApiKey] = useState("");
	const [responseStatus, setResponseStatus] = useState("");

	const [totalToProcess, setTotalToProcess] = useState(0);
	const [totalProcessed, setTotalProcessed] = useState(0);

	useEffect(() => {
		getServerStatus();
		getAPIKey();
	}, []);

	async function getServerStatus() {
		try {
			const response = await axios({
				method: "get",
				url: "https://ocr.space/",
			});

			// If Cloudflare says no then it will not say its online
			if (response.status === 200) {
				setBackendStatus(true);
			}
		} catch {
			// Do nothing
		}
	}

	async function getAPIKey() {
		try {
			// 10/10 security, be warned
			const response = await axios({
				method: "get",
				url: "/api/get-api-key",
			});

			if (response.data.key) {
				setApiKey(response.data.key);
			} else {
				setResponseStatus("Failed to fetch API key for OCR service.");
			}
		} catch (e) {
			console.error(e);
		}
	}

	async function upload(files) {
		setResponseStatus("");

		setTotalToProcess(files.length);

		for (const file of files) {
			var formData = new FormData();

			formData.append("file", file);

			try {
				await axios
					.post("https://api.ocr.space/parse/image", formData, {
						headers: {
							apiKey: apiKey,
						},
					})
					.then((response) => {
						let result = response.data.ParsedResults[0].ParsedText;
						setTotalProcessed((totalProcessed) => totalProcessed + 1);

						if (result) {
							// Checking so that we dont get `undefined` at the start of the document
							if (assembledDocument) {
								assembledDocument = assembledDocument + result;
							} else {
								assembledDocument = result;
							}
						}
					});
			} catch (e) {
				console.error(e);
				// Sure as hell hope is doesnt return an object
				setResponseStatus(e.response.data);
				// Return so that it doesnt continue spamming the API
				return;
			}
		}

		// Gotta check and see if we got anything, or if the user burned their credits
		if (assembledDocument) {
			await downloadFile();
			assembledDocument = "";
		} else {
			setResponseStatus("No text found in uploaded files.");
		}
	}

	async function downloadFile() {
		const element = document.createElement("a");
		const file = new Blob([assembledDocument], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = "T-OCR-results.txt";
		document.body.appendChild(element); // Required for this to work in FireFox
		element.click();
	}

	return (
		<main>
			<div className="absolute top-0 left-0 m-3">
				{backendStatus === false ? (
					<p>Backend server is offline</p>
				) : (
					<p>Backend server is online</p>
				)}
			</div>
			<div className="h-screen flex items-center justify-center">
				<div className="flex items-center justify-center w-1/2">
					<label
						htmlFor="dropzone-file"
						className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-base-300"
					>
						<div className="flex flex-col items-center justify-center pt-5 pb-6">
							{totalToProcess !== 0 ? (
								<div className="text-center">
									<p className="mb-2 text-sm text-gray-500">
										{totalProcessed}/{totalToProcess}
									</p>
								</div>
							) : (
								<div className="text-center">
									<p className="mb-2 text-sm text-gray-500">
										Click to upload or drag and drop
									</p>
									<p className="text-xs text-gray-500">All image types</p>
								</div>
							)}
						</div>
						<input
							id="dropzone-file"
							type="file"
							className="hidden"
							onChange={(e) => upload(e.target.files)}
							multiple
						/>
					</label>
				</div>
			</div>
			<div className="absolute bottom-0 text-center w-full mb-1">
				{responseStatus !== "" && (
					<p className="text-error">{responseStatus}</p>
				)}
			</div>
		</main>
	);
}
