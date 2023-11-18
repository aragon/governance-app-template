'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation'



const Header = () => {
  const segment = useSelectedLayoutSegment()
    console.log(segment)

  return (
    <header>
    <nav className="border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="https://aragonnete.aragon.org" className="flex items-center">
                <Image src="/aragonette-logo.png" width="75" height="200" className="" alt="Aragonette Logo" />
                <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white text-primary-50">Aragonette</span>
            </a>
            <div className="flex items-center lg:order-2">
              <w3m-button />
            </div>
            <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                    <li>
                        <Link href="/" className="block py-2 pr-4 pl-3 rounded lg:p-0 dark:text-white" className={!segment ? 'text-primary-300' : "text-primary-50"} aria-current="page">Home</Link>
                    </li>
                    <li>
                        <Link href="/proposals" className="block py-2 pr-4 pl-3 text-primary-50 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700" className={segment === 'proposals' ? 'text-primary-300' : "text-primary-50"}>Proposals</Link>
                    </li>
                    <li>
                        <a href="#" className="block py-2 pr-4 pl-3 text-primary-50 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Forum</a>
                    </li>
                    <li>
                        <a href="#" className="block py-2 pr-4 pl-3 text-primary-50 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Discord</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    </header>
  );
};

export default Header;
