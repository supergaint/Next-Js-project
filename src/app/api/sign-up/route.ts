import dbConnect from "@/lib/dibConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVrified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserByEmail?.isVrified) {
     if (existingUserByEmail?.isVrified) {
      return Response.json(
        {
          success: false,
          message: "Email already exists",
        },
        {
          status: 400,
        })
      } else{
        const hashedPassword = await bcrypt.hash 
        (password, 10)
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail?.save();
      }
  
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVrified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // send verification email
    const emialRseponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    )
   if (!emialRseponse.success) {
return Response.json(
  {
    success: false,
    message: emialRseponse.message,
  },
  {
    status: 500,
  }
);
}

return Response.json(
  {
    success: true,
    message: "User registered successfully , please verify your email",
  },
  {
    status: 201,
  }
);

  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      { 
        success: false,
        message: "Failed to register user",
      },
      {
        status: 500,
      }
    );
  }
}
