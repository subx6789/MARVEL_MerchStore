import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "/marvel-merch";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await imagekit.upload({
      file: buffer,
      fileName: file.name || `upload_${Date.now()}.jpg`,
      folder: folder,
    });

    return NextResponse.json({
      fileId: result.fileId,
      name: result.name,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      height: result.height,
      width: result.width,
      size: result.size,
      filePath: result.filePath,
    });
  } catch (error: any) {
    console.error("ImageKit server upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload image to ImageKit" },
      { status: 500 }
    );
  }
}
