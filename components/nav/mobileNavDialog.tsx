import { Dialog, type IDialogRootProps } from "@aragon/ods";
import Link from "next/link";
import { NavLink, type INavLink } from "./navLink";
import { useMultisigMembers } from "@/plugins/members/hooks/useMultisigMembers";
import { useAccount } from "wagmi";

interface IMobileNavDialogProps extends IDialogRootProps {
  navLinks: INavLink[];
}

export const MobileNavDialog: React.FC<IMobileNavDialogProps> = (props) => {
  const { navLinks, ...dialogRootProps } = props;
  const { address } = useAccount();
  const { members } = useMultisigMembers();
  const showAllLinks = address && members.includes(address);

  return (
    <Dialog.Root {...dialogRootProps}>
      <Dialog.Content className="flex flex-col gap-y-6 px-3 py-7">
        <ul className="flex w-full flex-col gap-y-1">
          {navLinks
            .filter((link) => showAllLinks || !link.hiddenIfNotSigner)
            .map((navLink) => (
              <NavLink {...navLink} key={navLink.id} onClick={() => dialogRootProps.onOpenChange?.(false)} />
            ))}
        </ul>
        <div className="flex items-center justify-between px-4">
          <div className="flex w-full justify-center">
            <Link
              href="https://aragon.org"
              className="rounded-xl outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-offset"
            >
              <span className="flex py-2 pl-3 pr-4">
                Governed on&nbsp;
                <img src="/logo-aragon-text.svg" height="24" alt="Aragon" />
              </span>
            </Link>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
