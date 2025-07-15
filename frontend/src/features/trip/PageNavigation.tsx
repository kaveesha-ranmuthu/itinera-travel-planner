import { useClose } from "@headlessui/react";
import React from "react";
import { Link } from "react-scroll";
import { useAuth } from "../../hooks/useAuth";
import { twMerge } from "tailwind-merge";

interface PageNavigationProps {
  subCollections: string[];
}

const PageNavigation: React.FC<PageNavigationProps> = ({ subCollections }) => {
  const close = useClose();
  const { settings } = useAuth();

  return (
    <nav className={twMerge("space-y-2", settings?.font)}>
      <h1 className="text-lg">Page navigation</h1>
      <ul className="space-y-1">
        {subCollections.map((collection) => (
          <li key={collection}>
            <Link
              to={collection}
              spy={true}
              smooth={true}
              activeClass="peer:text-secondary *:text-secondary"
              duration={500}
              offset={-100}
              className="group cursor-pointer"
              onClick={close}
            >
              <span className="group-hover:opacity-70 transition ease-in-out duration-400">
                {collection}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default PageNavigation;
