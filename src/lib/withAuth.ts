import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
type Handler<TParams extends Record<string, any>> = (
  session: any,
  req: Request,
  context: { params: TParams },
) => Promise<Response>;
interface WithAuthOptions {
  /** true면, params.id 기반으로 리소스 소유자 확인 */
  requireOwnership?: boolean;
  /** 검사할 모델 이름 (기본: "entry") */
  model?: "entry";
}
export function withAuth<TParams extends Record<string, any>>(
  handler: Handler<TParams>,
  options: WithAuthOptions = {},
) {
  const { requireOwnership = false, model = "entry" } = options;
  return async (req: Request, context: { params: TParams }) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (requireOwnership && "id" in context.params) {
      const resourceId = (context.params as any).id;

      const resource = await prisma[model].findUnique({
        where: { id: resourceId },
        select: { userId: true },
      });

      if (!resource) {
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 },
        );
      }

      if (resource.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    return handler(session, req, context);
  };
}
