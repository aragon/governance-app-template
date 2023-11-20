'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation'
import { Icon, IconType } from '@aragon/ods'


const Sidebar = () => {
  const segment = useSelectedLayoutSegment()

  return (
    <header className="h-screen">
      <div className="w-72 absolute sm:relative bg-primary-100 shadow md:h-full flex-col justify-between hidden sm:flex">
        <div className="px-3 flex-1 grow">
          <div className="w-full flex items-center mt-5">
            <Image src="/aragonette-logo.png" width="75" height="200" className="" alt="Aragonette Logo" />
            <Link href="/" className={`block py-2 leading-tight font-semibold text-3xl text-neutral-900`} aria-current="page">Aragonette</Link>
          </div>
          <ul className="mt-12 px-4">
            <li className="flex w-full justify-between text-neutral-800 cursor-pointer items-center mb-6">
              <Link href="/" className="flex items-center">
                <Icon
                  className="mr-2"
                  icon={IconType.HOME}
                  size="md"
                  responsiveSize={{
                    md: 'lg'
                  }}
                />

                <span className={`block py-2 pr-4 pl-3 rounded ${!segment ? 'underline font-semibold' : ''} lg:p-0`} aria-current="page">Home</span>
              </Link>
            </li>
            <li className="flex w-full justify-between text-neutral-800 cursor-pointer items-center mb-6">
              <Link href="/proposals" className="flex items-center">
                <Icon
                  className="mr-2"
                  icon={IconType.APP_GOVERNANCE}
                  size="md"
                  responsiveSize={{
                    md: 'lg'
                  }}
                />
                <span className={`block py-2 pr-4 pl-3 rounded lg:p-0 ${segment === 'proposals' ? 'underline font-semibold' : ''}`} aria-current="page">Proposals</span>
              </Link>
            </li>
            <li className="flex w-full justify-between text-neutral-800 hover:text-neutral-900 cursor-pointer items-center mb-6">
              <Link href="#" className="flex items-center focus:outline-none focus:ring-2 focus:ring-white">
                <Icon
                  className="mr-2"
                  icon={IconType.APP_COMMUNITY}
                  size="md"
                  responsiveSize={{
                    md: 'lg'
                  }}
                />
                <span className="block py-2 pr-4 pl-3 text-neutral-800 lg:p-0">Forum</span>
              </Link>
            </li>
            <li className="flex w-full justify-between text-neutral-800 cursor-pointer items-center mb-6">
              <Link href="#" className="flex items-center" >
                <Icon
                  className="mr-2 text-neutral-800"
                  icon={IconType.QUESTION}
                  size="md"
                  responsiveSize={{
                    md: 'lg'
                  }}
                />
                <span className="block py-2 pr-4 pl-3 text-neutral-700 lg:p-0">Discord</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="px-8">
          <ul className="w-full flex items-center justify-between ">
            <li className="cursor-pointer pt-5 pb-3">
              <Link href="#" className="flex items-center focus:outline-none focus:ring-2 focus:ring-white" >
                <Icon
                  className="mr-2"
                  icon={IconType.FEEDBACK}
                  size="md"
                  responsiveSize={{
                    md: 'lg'
                  }}
                />
                <span className="block py-2 pr-4 pl-3 text-neutral-900 border-b border-neutral-100 hover:bg-neutral-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-neutral-400 lg:dark:hover:text-white dark:hover:bg-neutral-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-neutral-700">Aragon</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Sidebar;
