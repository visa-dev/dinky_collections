import { put, del } from "@vercel/blob";

export async function uploadToBlob(file: File | Buffer, filename: string): Promise<{ url: string; blobId: string }> {
	if (!process.env.BLOB_READ_WRITE_TOKEN) {
		throw new Error("BLOB_READ_WRITE_TOKEN is not set");
	}

	const blob = await put(filename, file, {
		access: "public",
		token: process.env.BLOB_READ_WRITE_TOKEN,
	});

	return {
		url: blob.url,
		blobId: blob.pathname,
	};
}

export async function deleteFromBlob(blobId: string): Promise<void> {
	if (!blobId || !process.env.BLOB_READ_WRITE_TOKEN) {
		return;
	}
	
	try {
		await del(blobId, {
			token: process.env.BLOB_READ_WRITE_TOKEN,
		});
	} catch (error) {
		console.error("Failed to delete blob:", error);
		// Don't throw - allow deletion to continue even if blob deletion fails
	}
}
