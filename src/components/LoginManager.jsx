/* ----- Third Party Imports ----- */
import { UserButton, auth, currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { sql } from "@vercel/postgres";

/* ----- Project Imports ----- */
import "@/styles/loginbutton.css";

export default async function LoginManager() {
  const { userId } = auth();
  const user = await currentUser();

  const userCheck = await sql`SELECT * FROM users WHERE clerk_user_id = ${userId}`;
  if (user && userCheck.rowCount === 0) {
    const makeUser =
      await sql`INSERT INTO users (clerk_user_id, username) VALUES (${userId}, ${user.username})`;
  }

  //make sure that our database username is the same as clerks username.
  if (userId && user) {
    const userName =
      await sql`SELECT users.username FROM users WHERE clerk_user_id = ${userId}`;
    if (userName !== user.username) {
      const updateUser =
        await sql`UPDATE users SET username = ${user.username} WHERE clerk_user_id = ${userId}`;
    }
  }

  return (
    <>
      {userId ? (
        <div className="loginButtonDiv">
        <UserButton 
          afterSignOutUrl="/"
          userProfileMode="navigation"
          userProfileUrl="/user-profile"
        />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
