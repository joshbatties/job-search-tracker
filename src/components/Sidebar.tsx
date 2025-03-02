import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, PlusCircle, UserCircle } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-blue-800 text-white w-64 flex-shrink-0 hidden md:block">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Briefcase size={24} />
          <h2 className="text-xl font-bold">JobTrack</h2>
        </div>
      </div>
      
      <nav className="mt-6">
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 hover:bg-blue-700 ${
                  isActive ? 'bg-blue-700' : ''
                }`
              }
            >
              <LayoutDashboard size={20} className="mr-3" />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 hover:bg-blue-700 ${
                  isActive ? 'bg-blue-700' : ''
                }`
              }
            >
              <Briefcase size={20} className="mr-3" />
              <span>My Applications</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/jobs/add"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 hover:bg-blue-700 ${
                  isActive ? 'bg-blue-700' : ''
                }`
              }
            >
              <PlusCircle size={20} className="mr-3" />
              <span>Add Application</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 hover:bg-blue-700 ${
                  isActive ? 'bg-blue-700' : ''
                }`
              }
            >
              <UserCircle size={20} className="mr-3" />
              <span>Profile</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;