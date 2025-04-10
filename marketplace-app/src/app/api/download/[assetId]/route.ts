import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth"; // Corrected path
import { db } from "@/db";
import { digitalAssets, orderItems, orders } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm"; // Added inArray
import { promises as fs } from "fs";
import path from "path";
import mime from "mime-types";

// Define the expected context params
interface RouteContext {
  params: {
    assetId: string;
  };
}

export async function GET(req: NextRequest, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const { assetId } = context.params;

  if (!assetId) {
    return NextResponse.json(
      { error: "Asset ID is required." },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch asset details (including productId)
    const asset = await db.query.digitalAssets.findFirst({
      where: eq(digitalAssets.id, assetId), // Assuming assetId is the UUID of the digitalAsset record
      columns: { filePath: true, fileName: true, productId: true },
    });

    if (!asset || !asset.filePath || !asset.productId) {
      return NextResponse.json({ error: "Asset not found." }, { status: 404 });
    }

    // 2. Verify user has purchased this product
    // a. Find order items for this product with ACCESS_GRANTED status
    const potentialOrderItems = await db.query.orderItems.findMany({
      columns: { orderId: true },
      where: and(
        eq(orderItems.productId, asset.productId),
        eq(orderItems.status, "ACCESS_GRANTED")
      ),
    });

    if (potentialOrderItems.length === 0) {
      console.warn(
        `No ACCESS_GRANTED items found for Product ${asset.productId}, Asset ${assetId}`
      );
      return NextResponse.json(
        { error: "Purchase record not found." },
        { status: 403 }
      );
    }

    // b. Extract the order IDs
    const orderIds = potentialOrderItems.map((item) => item.orderId);

    // c. Check if any of these orders belong to the user and are completed
    const validOrder = await db.query.orders.findFirst({
      columns: { id: true }, // Only need to confirm existence
      where: and(
        inArray(orders.id, orderIds), // Order ID must be one from the items
        eq(orders.userId, userId), // Order must belong to the current user
        eq(orders.status, "COMPLETED") // Order must be completed
      ),
    });

    if (!validOrder) {
      console.warn(
        `Unauthorized download attempt: User ${userId}, Asset ${assetId}, Product ${asset.productId}. No valid completed order found.`
      );
      return NextResponse.json(
        { error: "Valid purchase record not found." },
        { status: 403 }
      );
    }

    // 3. Read file from secure location
    const secureFilePath = path.join(process.cwd(), asset.filePath); // filePath is relative to project root

    try {
      await fs.access(secureFilePath); // Check if file exists
    } catch (accessError) {
      console.error(
        `❌ File not found at path: ${secureFilePath}`,
        accessError
      );
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    const fileBuffer = await fs.readFile(secureFilePath);

    // 4. Determine MIME type
    const mimeType = mime.lookup(asset.fileName) || "application/octet-stream";

    // 5. Stream response
    const headers = new Headers();
    headers.set(
      "Content-Disposition",
      `attachment; filename="${asset.fileName}"`
    );
    headers.set("Content-Type", mimeType);
    headers.set("Content-Length", fileBuffer.length.toString());

    return new NextResponse(fileBuffer, { status: 200, headers });
  } catch (error) {
    console.error(`❌ Error fetching/streaming asset ${assetId}:`, error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
