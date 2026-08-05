import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";

export async function POST(req: NextRequest) {
	try {
		const { userId } = await getAuth(req);
		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const formData = await req.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Upload to UploadThing
		const utapi = new UTApi();

		const response = await utapi.uploadFiles(file);

		if (response.error) {
			console.error("Upload error:", response.error);
			return NextResponse.json(
				{ error: "Failed to upload file" },
				{ status: 500 },
			);
		}

		return NextResponse.json({
			url: response.data?.ufsUrl,
			key: response.data?.key,
			name: response.data?.name,
		});
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
