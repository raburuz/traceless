import { ValidationError } from "@app/shared/lib/zod"
import { NextResponse } from "next/server"

type RouteHandler<TArgs extends unknown[]> = (...args: TArgs) => Promise<Response>;

export function safeHandler<TArgs extends unknown[]>(
  handler: RouteHandler<TArgs>,
): RouteHandler<TArgs> {

    return async (...args) => {

      try {

        return await handler(...args);

    } catch (error) {
      
      if(error instanceof ValidationError){
        return NextResponse.json(
          {
            field: error.field,
            message: error.message,
          },
          {
            status: error.status,
          }
        )
      }

      // Never log the raw error: it may carry request data (prompt, images, keys).
      console.log(error instanceof Error ? `${error.name}: ${error.message}` : 'Unknown error');
      return NextResponse.json(
        {
          message: "Internal server error",
        },
        {
          status: 400
        }
      )

    }
  }
}