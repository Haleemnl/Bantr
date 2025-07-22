
import Feeds from "@/components/Feeds";
import Middle from "@/components/Middle";
import { createClient } from "@/utils/supabase/server";

export default async function Home({ searchParams }) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  return (
    <div className='grid grid-cols-3 gap-5'>
      <Middle user={user} />
      <Feeds searchParams={searchParams} />
    </div>
  );
}