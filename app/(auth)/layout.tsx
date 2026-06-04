import { isAuthenticated } from "@/lib/action/auth.action";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const Authlayout = ({children}:{children:ReactNode}) => {
  const userAuthenticated = isAuthenticated();
  if (userAuthenticated) redirect('/') ;
  return (
    <div>
      
      {children}
    </div>
  )
}

export default Authlayout
