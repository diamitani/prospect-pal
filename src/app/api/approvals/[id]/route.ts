import { handleApproval } from "@/lib/mcp/http";
import { store } from "@/lib/mcp/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = async (
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) => handleApproval(req, (await ctx.params).id, { store });

