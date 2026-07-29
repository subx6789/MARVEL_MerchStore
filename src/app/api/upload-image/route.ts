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

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");
    const imageUrl = searchParams.get("url");

    if (!fileId && !imageUrl) {
      return NextResponse.json({ error: "Missing fileId or url" }, { status: 400 });
    }

    if (fileId) {
      await imagekit.deleteFile(fileId);
      return NextResponse.json({ success: true, fileId });
    }

    if (imageUrl && imageUrl.includes("ik.imagekit.io")) {
      // Find file by path / URL search
      const fileName = imageUrl.split("/").pop()?.split("?")[0];
      if (fileName) {
        const files = await imagekit.listFiles({ searchQuery: `name = "${fileName}"` });
        if (files && files.length > 0) {
          await imagekit.deleteFile((files[0] as any).fileId);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("ImageKit server delete error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete image from ImageKit" },
      { status: 500 }
    );
  }
}
