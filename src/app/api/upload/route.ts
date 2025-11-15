import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToBlob } from "@/lib/blob";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || (session.user as any)?.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const formData = await req.formData();
		const file = formData.get("file") as File;
		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Validate file type
		if (!file.type.startsWith("image/")) {
			return NextResponse.json({ error: "File must be an image" }, { status: 400 });
		}

		// Validate file size (max 10MB)
		if (file.size > 10 * 1024 * 1024) {
			return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 });
		}

		// Generate unique filename
		const timestamp = Date.now();
		const randomString = Math.random().toString(36).substring(2, 15);
		const extension = file.name.split(".").pop() || "jpg";
		const filename = `dinkys-collection/${timestamp}-${randomString}.${extension}`;

		const { url, blobId } = await uploadToBlob(file, filename);

		return NextResponse.json({
			url,
			blobId,
			secure_url: url, // For compatibility with existing code
			public_id: blobId, // For compatibility with existing code
		});
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
	}
}
