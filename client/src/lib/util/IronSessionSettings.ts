import { getIronSession } from "iron-session"
import { cookies } from "next/headers"

export default async function IronSessionSettings() {
    try {
        const session = await getIronSession(await cookies(), {
            password: process.env.SECRET_COOKIE_PASSWORD as string, // Set the password as a string (Password is stored in .env in the variable SECRET_COOKIE_PASSWORD)
            cookieName: "user", // set cookie name as user
            cookieOptions: {
                secure: process.env.NODE_ENV === "production" // Set the secure type as production
            }
        })
        return session // return the session
    } catch (error) { // catch any errors
        console.log(error) // Log any errors
        process.exit() // Quit if cant fetch / set sessions
    }
}