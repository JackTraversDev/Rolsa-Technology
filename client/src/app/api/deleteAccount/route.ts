import IronSessionSettings from "@/lib/util/IronSessionSettings";
import { NextResponse } from "next/server";
import User from "@/lib/schema/User";


export async function DELETE() {
    try {
        const session = await IronSessionSettings()
        if (session.user?.id) {
            const deleteUser = await User.findByIdAndDelete(session.user.id)
            if (deleteUser) {
                session.destroy()
                return NextResponse.json({ message: "Successfully deleted account" }, { status: 201 })
            } else {
                return NextResponse.json({ message: "Error deleting user" }, { status: 403 })
            }
        }
    } catch (error) {
        return NextResponse.json({ message: "Internal server error, please try again later." })
    }
}