import { PUB_APP_NAME, PUB_BLOG_URL, PUB_FORUM_URL, PUB_PROJECT_URL } from "@/constants";

export const Footer = () => {
  return (
    <div className="flex w-full flex-row border-t border-t-neutral-100 bg-neutral-0 p-4 md:p-0 xl:h-20">
      <div className="mx-auto w-full max-w-screen-xl md:flex md:flex-col md:justify-center md:gap-y-6 md:px-6 md:py-10 xl:flex-row xl:gap-x-6 xl:px-6 xl:py-5">
        <div className="flex items-center justify-between pb-4 pt-3 md:order-2 md:justify-center md:gap-x-4 md:pb-0 md:pt-0 xl:order-1 xl:flex-1 xl:justify-start">
          <div className="flex items-center gap-x-1.5 md:gap-x-2 lg:gap-x-2.5">
            <span className="text-xs leading-tight text-neutral-500 md:text-sm lg:text-base">Governed on</span>
            <img
              alt="Aragon logo"
              loading="lazy"
              width="64"
              height="16"
              decoding="async"
              data-nimg="1"
              className="md:hidden"
              style={{ color: "transparent" }}
              src="/logo-aragon-text.svg"
            />
            <img
              alt="Aragon logo"
              loading="lazy"
              width="80"
              height="20"
              decoding="async"
              data-nimg="1"
              className="hidden md:block lg:hidden"
              style={{ color: "transparent" }}
              src="/logo-aragon-text.svg"
            />
            <img
              alt="Aragon logo"
              loading="lazy"
              width="96"
              height="24"
              decoding="async"
              data-nimg="1"
              className="hidden lg:block"
              style={{ color: "transparent" }}
              src="/logo-aragon-text.svg"
            />
          </div>
        </div>
        <ul className="divide-y divide-neutral-100 md:order-1 md:flex md:items-center md:justify-center md:gap-x-6 md:divide-y-0 xl:justify-start">
          <li className="group py-4 md:py-0">
            <a className="overflow-hidden" href={PUB_PROJECT_URL} target="_blank">
              <span className="line-clamp-1 leading-tight text-neutral-500 group-hover:text-neutral-800">
                {PUB_APP_NAME}
              </span>
            </a>
          </li>
          <li className="group py-4 md:py-0">
            <a className="overflow-hidden" href={PUB_BLOG_URL} target="_blank">
              <span className="line-clamp-1 leading-tight text-neutral-500 group-hover:text-neutral-800">Blog</span>
            </a>
          </li>
          <li className="group py-4 md:py-0">
            <a className="overflow-hidden" href={PUB_FORUM_URL} target="_blank">
              <span className="line-clamp-1 leading-tight text-neutral-500 group-hover:text-neutral-800">Forum</span>
            </a>
          </li>
        </ul>
        <div className="items-center pb-3 pt-6 md:order-3 md:flex md:justify-center md:pb-0 md:pt-0 xl:flex-1 xl:justify-end">
          <span className="text-base leading-tight text-neutral-500">
            © {new Date().getFullYear()} {PUB_APP_NAME}
          </span>
        </div>
      </div>
    </div>
  );
};
