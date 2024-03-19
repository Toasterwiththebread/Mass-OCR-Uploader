export default function handler(req, res) {
	if (process.env.OCR_SPACE_API_KEY) {
		res.status(200).json({ key: process.env.OCR_SPACE_API_KEY });
	} else {
		res.status(500).json({ error: "No API key found" });
	}
}
