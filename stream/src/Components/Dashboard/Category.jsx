import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddCategory = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/categories', {
                name: newCategoryName,
            });
            setCategories([...categories, response.data]);
            setNewCategoryName('');
            setModalOpen(false);
            toast.success('Category added successfully');
            fetchCategories();
        } catch (error) {
            console.error('Error adding category:', error);
            toast.error('Failed to add category');
        }
    };

    const handleEditCategory = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/categories/${editingCategory.id}`, {
                name: editingCategory.name,
            });
            setCategories(categories.map(cat => cat.id === editingCategory.id ? response.data : cat));
            setEditingCategory(null);
            setEditModalOpen(false);
            toast.success('Category updated successfully');
            fetchCategories();
        } catch (error) {
            console.error('Error editing category:', error);
            toast.error('Failed to edit category');
        }
    };

    const handleDeleteCategory = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/categories/${categoryToDelete}`);
            setCategories(categories.filter(cat => cat._id !== categoryToDelete));
            setConfirmDelete(false);
            setCategoryToDelete(null);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category');
        }
    };
    
    

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="bg-slate-100 p-5">
            <div className="flex justify-between items-center ">
            <h2 className="text-xl font-semibold">Folder List</h2>
            <button onClick={() => setModalOpen(true)} className="px-5 py-2 bg-blue-600 text-white rounded-sm mb-4">
                Create Folder
            </button>
            </div>

            <div className="mt-5 bg-white p-5">
                {categories.map((category) => (
                    <div key={category.id} className="flex justify-between items-center border-b py-2">
                        <span>{category.name}</span>
                        <div>
                            <button
                                className="px-2 py-1 bg-yellow-400 text-black rounded-sm"
                                onClick={() => {
                                    setEditingCategory(category);
                                    setEditModalOpen(true);
                                }}
                            >
                               <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button
                                className="px-2 py-1 bg-red-600 text-white rounded-sm ml-2"
                                onClick={() => {
                                    setConfirmDelete(true);
                                    setCategoryToDelete(category.id);
                                }}
                            >
                                <i className="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Category Modal */}
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content w-96">
                        <h3 className="text-xl font-bold">Create New Folder</h3>
                        <input
                            type="text"
                            placeholder="Folder Name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="w-full border p-2 my-4 focus:outline-none"
                        />
                        <div className="flex w-full justify-end gap-5">
                        <button onClick={handleAddCategory} className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-sm">
                            Add
                        </button>
                        <button onClick={() => setModalOpen(false)} className="mt-2 px-5 py-2 bg-gray-400 text-white rounded-sm">
                            Cancel
                        </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Category Modal */}
            {editModalOpen && (
                <div className="modal">
                    <div className="modal-content w-96">
                    <h3 className="text-xl font-bold">Update Folder name <small className="text-xs font-normal text-red-600">Dangerus if have file</small></h3>
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={editingCategory?.name}
                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                             className="w-full border p-2 my-4 focus:outline-none"
                        />
                       <div>
                       <div className="flex justify-end gap-5">
                       <button onClick={handleEditCategory} className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-sm">
                            Save
                        </button>
                        <button onClick={() => setEditModalOpen(false)} className="mt-2 px-5 py-2 bg-gray-400 text-white rounded-sm">
                            Cancel
                        </button>
                       </div>
                       </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Are you sure you want to delete this Folder?</h3>
                       <div className="flex justify-end gap-5 mt-6">
                       <button onClick={handleDeleteCategory} className="mt-2 px-5 py-2 bg-red-600 text-white rounded-sm">
                            Yes
                        </button>
                        <button onClick={() => setConfirmDelete(false)} className="mt-2 px-5 py-2 bg-gray-400 text-white rounded-sm">
                            No
                        </button>
                       </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Category;
