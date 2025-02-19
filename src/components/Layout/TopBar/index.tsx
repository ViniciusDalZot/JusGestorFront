import { GoGear } from "react-icons/go";
import logoMin from '~/assets/logos/logo-min.png';
import { ConfigMenu } from "../ConfigMenu";
import { useRef } from "react";
import { Box } from "~/components/Box";
import { GoLaw } from "react-icons/go";
import { FaRegBell } from "react-icons/fa6";

export const TopBar = () => {

  const configMenuRef = useRef<any>(null)

  return (
    <Box className="h-[70px] min-h-[70px] flex bg-sky-900 text-white">
      <Box className="bg-white flex items-center justify-center gap-4 w-60 text-gray-500">
        <img src={logoMin} alt="Jusgestor Software" className="w-14 h-auto" />
        <Box className='text-center leading-tight'>
          <Box className='text-lg'>Jusgestor</Box>
          <Box className='text-sm'>Software</Box>
        </Box>
      </Box>
      <Box className='flex justify-end flex-1 items-center px-4 gap-8'>

{/*         <div>
          <input type="text" className="h-full rounded-full bg-sky-950/50 p-2" placeholder="Pesquisar..."/>
        </div>

        <div>
          <FaRegBell className="w-6 h-6" />
        </div> */}

        <div className="flex items-center gap-2">
          <div className="border-2 p-1 rounded-full">
            <GoLaw className="w-5 h-5" />
          </div>

          Admin
        </div>

        <Box className='cursor-pointer' onClick={() => configMenuRef.current.show()}>
          <GoGear className='w-6 h-6' />
        </Box>
      </Box>

      <ConfigMenu ref={configMenuRef} />
    </Box>
  )
}