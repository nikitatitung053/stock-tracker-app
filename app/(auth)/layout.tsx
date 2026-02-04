import Header from "@/components/Header"
import Link from "next/link"
import Image from "next/image"

const Layout = ({children}:{children:React.ReactNode}) => {
  return (
   <main className="auth-layout">
    <section className="auth-left-section scrollbar-hide-default">
        <Link href="/"className="auth-logo">
        <Image src="/assets/icons/logo.svg"alt="signalist logo"width={140} height={32} className='h-8 w-auto'/>
        </Link>
        <div className="pb-6 lg:pb-8 flex-1">{children}</div>
    </section>
   <section className="auth-right-section">
    <div className="z-10 relative lg:mt-4 lg:mb-16">
        <blockquote className="blackquote">

        </blockquote>
    </div>
   </section>

   </main>
  )
}

export default Layout