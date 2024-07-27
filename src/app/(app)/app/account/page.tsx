import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";
import SignOutButton from "@/components/sign-out-btn";
import { checkAuth } from "@/lib/server-utils";

type Props = {};

const Account = async (props: Props) => {
  const session = await checkAuth();

  return (
    <main>
      <H1 className="my-8 text-white">Your Account</H1>

      <ContentBlock className="h-[500px] flex-center flex-col gap-3">
        <p>Logged in as {session.user.email}</p>

        <SignOutButton />
      </ContentBlock>
    </main>
  );
};

export default Account;
