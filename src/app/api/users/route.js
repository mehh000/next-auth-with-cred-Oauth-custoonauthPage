import { createUserWithAccount, getUserByEmail } from "@/utils/user";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
    try {
        const { name, email, password } = await req.json();
        const existingUser = await getUserByEmail(email);
        if(existingUser){
            return NextResponse.json({
                 message: "User already exists" },{status:  400});
        }
        const hashedPasword = await bcryptjs.hash(password, 10);
        const newUser = await createUserWithAccount({
            name,
            email,
            password: hashedPasword
        })
        return NextResponse.json({
            message: "User created successfully",
            data: {
                ...newUser
    }
    },{status: 201});

    } catch (err) {

        return NextResponse.json({
            message: "error",
            err
        }, { status: 500 });

    }
}