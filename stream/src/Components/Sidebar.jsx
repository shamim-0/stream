import {Link} from 'react-router-dom'

const Sidebar = () => {
    return (
        <div>
            <aside className="w-64 bg-white min-h-[90vh] shadow-md flex flex-col justify-between">
                <div className="p-6">
                    <nav className="space-y-2">
                        <Link to="/dashboard" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                            <span className="mr-3">
                            <i className="fa-solid fa-house"></i>
                            </span>
                            <span>My Dashboard</span>
                        </Link>
                        <Link to="/dashboard/add-stream" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                            <span className="mr-3">
                            <i className="fa-solid fa-video"></i>
                            </span>
                            <span>New Stream</span>
                        </Link>
                        <Link to="/dashboard/list-flder" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                            <span className="mr-3">
                            <i className="fa-solid fa-play"></i>
                            </span>
                            <span>Stream List</span>
                        </Link>
                        <Link to="/dashboard/stream-category" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                            <span className="mr-3">
                            <i className="fa-regular fa-folder-open"></i>
                            </span>
                            <span>Stream Folder</span>
                        </Link>
                    </nav>
                </div>
            </aside>

        </div>
    );
};

export default Sidebar;