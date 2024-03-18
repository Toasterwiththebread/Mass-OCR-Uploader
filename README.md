# Mass-OCR-Uploader
Simple program that allows me to pirate play scripts I took photos of using OCR.SPACE

# Running
You need to get a API key from https://ocr.space, then set it as **OCR_SPACE_API_KEY** in your .ENV, then after that you can just run this
with the Dockerfile, default webserver port is 3000.

# Security
The API key for OCR.SPACE is available via public API (/api/get-api-key), I did this to minimize the network latency and the backend server needing
to proxy the requests, I would not recommend running this program in a way that it is publicly available, however the keys are free, so do what you want.

# Contributing
I don't really know what to put here, if you want to contribute just make a PR