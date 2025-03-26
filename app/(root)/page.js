import Feeds from "@/components/Feeds";
import Middle from "@/components/Middle";
import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";
// import Image from "next/image";

export default async function Home() {

  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  // if (error || !user) {
  //   redirect('/')
  // }


  return (

    <div className='grid grid-cols-3 gap-5  '>



      <Middle
        user={user}
      />

      <Feeds />

    </div>

  );
}
