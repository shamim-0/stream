import { useNavigate ,  Outlet, Link} from 'react-router-dom';
import Sidebar from '../Sidebar';
import logo from '../../assets/logo.png'


const Dashboard = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/dashboard');
    }

    return (
        <div>
            <nav className="p-5 flex justify-between items-center shadow mb-2">
               <Link to='/'> <img className="h-12" src={logo} alt="" /></Link>
                <div>
                    <button onClick={() => handleLogout()} className="px-3 py-1 bg-red-500 rounded-sm">Log out</button>
                </div>
            </nav>
            <div className="flex gap-5 ">
                <Sidebar/>
                <div className="shadow-lg p-5 w-full">
                    <Outlet/> 
                </div>
            </div>
        </div>
    );
};

export default Dashboard;