import React, { useState, useEffect } from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom'


const FolderList = () => {
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };


    useEffect(()=>{
        fetchCategories();
    },[])

    return (
        <div className="min-h-screen bg-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">Stream List</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((folder) => (
                <Link
                    to={'/dashboard/list-flder/'+folder.name}
                    key={folder.id}
                    className="flex flex-col items-center justify-center p-5 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer transition duration-200 transform hover:scale-105"
                >
                    <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mb-3">
                        <i className="fas fa-folder fa-lg"></i>
                    </div>
                    <p className="text-center text-gray-700 font-semibold">{folder.name}</p>
                </Link>
            ))}
        </div>
    </div>
    );
};

export default FolderList;