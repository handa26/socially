import { currentUser } from "@clerk/nextjs/server";

import CreatePost from "@/components/CreatePost";

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
      <div className="lg:col-span-6">
        {user ? <CreatePost /> : null}
      </div>

      <div className="hidden sticky top-20 lg:block lg:col-span-4">
        WhoToFollow
      </div>
    </div>
  );
}
