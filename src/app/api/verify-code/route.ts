import dbConnect from "@/lib/dibConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();
    try {
const { username, Code } = await request.json()

const usernameDecoded = decodeURIComponent(username)
const user =await UserModel.findOne({username: usernameDecoded})
    

if (!user)
{
    return Response.json(
        {
          success: false,
          message: " User not found",
        },
        { status: 500 }
      );
}
  const isCodeValid = user.verifyCode === Code
const isCodeNotExpired =new Date( user.verifyCodeExpiry) > new Date()


if(isCodeValid && isCodeNotExpired){
    user.isVrified = true
    await user.save()

    return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        { status: 200 }
      );

}else if(!isCodeNotExpired) {
    return Response.json(
        {
            success:false,
            message:'Verification code has expired, Please sign-up again '
        },
        { status: 400 }

    )
} else if(!isCodeValid) {
    return Response.json(
        {
            success: false,
            message: "Invalid verification code",
        },
        { status: 400 }
      );
}


  }  catch (error) {
        console.error("Error verifying User:", error);
        return Response.json(
          {
            success: false,
            message: "Failed to verify User",
          },
          { status: 500 }
        );

    }

}