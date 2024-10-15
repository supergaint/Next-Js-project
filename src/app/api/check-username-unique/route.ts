import dbConnect from "@/lib/dibConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/Schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});
export async function GET(request: Request) {
  // todo use this in all other routes

  if (request.method !== "GET") {
    return Response.json(
      {
        success: false,
        massege: "Method not allowed",
      },
      { status: 405 }
    );
  }

  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(result);
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message: "Invalid username",
          errors: usernameError,
        },
        { status: 400 }
      );
    }
    const { username } = result.data;

    const existingUser = await UserModel.findOne({ username, isVrified: true });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: " Username already exists",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: " Username is available",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to check username",
      },
      { status: 500 }
    );
  }
}
