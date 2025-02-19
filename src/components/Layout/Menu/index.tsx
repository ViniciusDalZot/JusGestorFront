import { ReactNode, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RxDashboard } from "react-icons/rx";
import { ImUsers } from "react-icons/im";
import { MdBalance } from "react-icons/md";
import { FaLandmarkFlag } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import api from '~/services/api';
import { useRecoilValue } from 'recoil';
import { layoutState } from '~/store/layoutState';

interface IMenuItem {
  label: string
  link?: string
  action?: () => void
  icon: ReactNode
  style?: string
}

interface IMenuSection {
  title: string
  items: IMenuItem[]
}

export const Menu = () => {
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState('');
  
  const { layoutMode } = useRecoilValue(layoutState)

  useEffect(() => {
      const fetchUserRole = async () => {
          try {
              const role = await api.get('/auth/role');
              setUserRole(role);
          } catch (error) {
              console.error('Erro ao obter o papel do usuário:', error);
          }
      };

      fetchUserRole();
  }, []);

  const menuSections: IMenuSection[] = [
    {
      title: "Navegação",
      items: [
        {
          label: "Início",
          link: "/dashboard",
          icon: <RxDashboard className='w-5 h-5' />
        },
        {
          label: "Clientes",
          link: "/clientes",
          icon: <ImUsers className='w-5 h-5' />
        },
        {
          label: "Intimações",
          link: "/intimacoes",
          icon: <MdBalance className='w-5 h-5' />
        },
        {
          label: "Processos",
          link: "/processos",
          icon: <FaLandmarkFlag className='w-5 h-5' />
        },
      ],
    },
    {
      title: "Ferramentas",
      items: [
        {
          label: "Agenda",
          link: "/agenda",
          icon: <IoCalendarOutline className='w-5 h-5' />
        },
      ]
    },
    {
      title: "Ações",
      items: [
        {
          label: "Sair",
          style: "text-red-500/70 hover:text-red-500",
          action: () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('role');
            navigate('/');
          },
          icon: <RiLogoutCircleLine className='w-5 h-5' />
        },
      ]
    },
  ]
  
  return (
    <aside className={`${layoutMode === "horizontal" ? "w-full" : "w-60"} bg-white`}>
      <nav className={`${layoutMode === "horizontal" ? "flex" : "pt-4"}`}>
        {menuSections.map((section: IMenuSection, key) => (
          <div key={key} className={`${layoutMode === "horizontal" && "flex"}`}>
            {layoutMode === "vertical" && (
              <div className='text-[#adb5bd] px-5 pt-3 text-xs uppercase text'>{section.title}</div>
            )}
            {section.items.map((item: IMenuItem, key) => (
              item.link ? (
                <Link key={key} className={`flex justify-start items-center gap-3 px-5 py-4 text-[#9097a7] hover:text-sky-300 transition-all ${item.style}`} to={item.link}>
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                <div key={key} className={`flex justify-start items-center gap-3 px-5 py-4 cursor-pointer text-[#9097a7] hover:text-sky-300 transition-all ${item.style}`} onClick={item.action}>
                  {item.icon}
                  {item.label}
                </div>
              )
            ))}
          </div>
        ))}
      </nav>
  </aside>
  )
}