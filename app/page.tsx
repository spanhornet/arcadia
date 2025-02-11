import { SignOutButton } from "./(auth)/SignOutButton";
import { Profile } from "./(main)/Profile";

export default function Home() {
  return (
    <>
      <Profile />
      <SignOutButton />
    </>
  );
}
