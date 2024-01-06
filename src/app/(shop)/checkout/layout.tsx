import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

export default async function CheckoutLayout({ children }: {
    children: React.ReactNode;
  }) {

    const session = await auth();

    if(!session?.user) {
        // redirect('/auth?returnTo=/perfil');
        redirect('/auth?redirectTo=/checkout/address');
    }

    return (
      <>
        { children }
      </>
    );
  }