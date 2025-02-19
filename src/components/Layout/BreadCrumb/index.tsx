import { Link, useLocation } from "react-router-dom";
import { toCapitalCase } from "~/utils/functions";
import { MdOutlineChevronRight } from "react-icons/md";

export const BreadCrumb = () => {

  const location = useLocation();

  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  const currentRouteName = pathSegments[pathSegments.length - 1] || "Home";

  const names: Record<string, string> = {
    intimacoes: "Intimações",
  }

  const routeName = toCapitalCase(names[currentRouteName] ?? currentRouteName);

  return (
    <div className="flex justify-between pb-4 text-gray-500">
      <div className="text-lg font-semibold">
        {routeName}
      </div>
      <div className="flex gap-2 text-sm items-center">
        <Link to="/dashboard">Jusgestor</Link>
        <MdOutlineChevronRight className="w-4 h-4" />
        <div className="text-gray-400">
          {routeName}
        </div>
      </div>
    </div>
  )
}