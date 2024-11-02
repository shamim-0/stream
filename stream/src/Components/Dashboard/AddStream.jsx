import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Category from './Category';


const AddStream = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [videoInfo, setVideoInfo] = useState({});
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [title, setTitle] = useState('');
    const [folder, setFolder] = useState('');
    const [categories, setCategories] = useState([]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setVideoFile(file);
        setVideoInfo({
            name: file.name,
            type: file.type,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        setVideoFile(file);
        setVideoInfo({
            name: file.name,
            type: file.type,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', videoFile);
        formData.append('title', title);
        formData.append('folder', folder);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });
            console.log(response);
            toast.success('Upload successful');
            setUploadProgress(0);
        } catch (error) {
            console.error('Error uploading video:', error);
            toast.error('Upload failed');
        }
    };


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


    useEffect(() => {
        if (videoFile) {
            const videoElement = document.createElement('video');
            videoElement.src = URL.createObjectURL(videoFile);
            videoElement.onloadedmetadata = () => {
                setVideoInfo((prevInfo) => ({
                    ...prevInfo,
                    duration: (videoElement.duration / 60).toFixed(2) + ' mins',
                }));
            };
        }
    }, [videoFile]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New Stream</h2>
                <form className="mt-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                            name="title"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="my-5">
                        <label htmlFor="folder">Folder</label>
                        <select name="folder"  onChange={(e) => setFolder(e.target.value)} required  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" id="folder">
                            <option value="null">-- Select Folder --</option>
                            {
                                categories.map(folder =>{
                                    return(
                                        <option key={folder.id} value={folder.name}>{folder.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div
                        className={`mt-5 border-dashed border-2 p-5 rounded-md ${
                            isDragging ? 'border-blue-600' : 'border-gray-400'
                        }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <input
                            type="file"
                            id="file"
                            accept="video/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <label
                            htmlFor="file"
                            className="flex flex-col items-center justify-center cursor-pointer"
                        >
                            <i className="fa-solid fa-cloud-arrow-up scale-150 text-blue-500 mb-2"></i>
                            <span className="mt-5 text-gray-600 text-center">
                                Drag & drop a video file here or click to select
                            </span>
                        </label>
                        {videoInfo.name && (
                            <div className="mt-2 text-gray-700">
                                <p><strong>Name:</strong> {videoInfo.name}</p>
                                <p><strong>Type:</strong> {videoInfo.type}</p>
                                <p><strong>Size:</strong> {videoInfo.size}</p>
                                {videoInfo.duration && <p><strong>Duration:</strong> {videoInfo.duration}</p>}
                            </div>
                        )}
                    </div>

                    {uploadProgress > 0 && (
                        <div className="mt-5">
                            <label htmlFor="progress" className="block text-sm font-medium text-gray-700">Upload Progress</label>
                            <progress id="progress" value={uploadProgress} max="100" className="w-full mt-2 border border-gray-300 rounded-md">
                                {uploadProgress}%
                            </progress>
                            <p className="mt-1 text-center text-gray-600">{uploadProgress}%</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Upload
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddStream;
