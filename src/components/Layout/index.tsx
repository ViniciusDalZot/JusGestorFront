import { Outlet} from 'react-router-dom';
import { Menu } from './Menu';
import { useRecoilValue } from 'recoil';
import { layoutState } from '~/store/layoutState';
import { TopBar } from './TopBar';
import { BreadCrumb } from './BreadCrumb';
import { Box } from '../Box';

const Layout = () => {

    const { layoutMode } = useRecoilValue(layoutState)

    return (
        <Box className={`flex h-full`}>
            <Box className='flex flex-col flex-1'>
                <TopBar />

                <Box className={`flex h-full ${layoutMode === "horizontal" && "flex-col"}`}>
                    <Menu />
                    <main className="p-4 flex-1 overflow-auto">
                        <BreadCrumb />
              
                        <Outlet />
                    </main>
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
