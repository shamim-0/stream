import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Stream = () => {
    const { folder } = useParams();
    const [streams, setStreams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [streamToDelete, setStreamToDelete] = useState(null);
    const [streamID, setStreamIDtodelete] = useState(null);

    const baseurl = 'http://localhost:5000';



    const handleDeleteClick = (id) => {
        setStreamToDelete(id);
        setIsModalOpen(true);
    };


    const fetchStreams = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/streams/${folder}`);
            setStreams(response.data.streams);
        } catch (error) {
            console.error('Error fetching streams:', error);
        }
    };



    useEffect(() => {
        fetchStreams();
    }, []);


    const confirmDelete = async () => {
        const url = `http://localhost:5000/streams-delete/${streamToDelete}/${streamID}`;
        try {
            const response = await fetch(url, {
                method: "DELETE"
            });
            
            const data = await response.json();
            
            if (response.ok) {
                console.log(data);
                toast.success("Delete Successful");
            } else {
                console.error('Delete Error:', data.error);
                toast.error(data.error || "Delete Failed");
            }
        } catch (error) {
            console.error('Error during delete:', error);
            toast.error("An error occurred while deleting");
        }
        
        setIsModalOpen(false);
        setStreams((prevStreams) => prevStreams.filter(stream => stream.id !== streamToDelete));
    };
    



    const toggleStatus = async (id, currentStatus) => {
        try {
            const response = await axios.patch(`http://localhost:5000/streams/${id}/toggle`, {
                status: !currentStatus,
            });
            setStreams(streams.map(stream =>
                stream.id === id ? { ...stream, status: response.data.status } : stream
            ));
            toast.success('Updated')
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => toast.success('Copied to clipboard'))
            .catch((error) => console.error('Error copying text:', error));
    };




    const filteredStreams = streams.filter(stream =>
        stream.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-5">
            <h4 className="text-2xl font-bold mb-4">{folder}</h4>
            <input
                type="text"
                placeholder="Search streams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 p-2 border rounded"
            />
            <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="py-2 px-4 border-b text-start">Name</th>
                        <th className="py-2 px-4 border-b text-start">Link</th>
                        <th className="py-2 px-4 border-b text-center">Status</th>
                        <th className="py-2 px-4 border-b text-center">Token</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStreams.map(stream => (
                        <tr key={stream.id} className="hover:bg-gray-100 transition duration-150">
                            <td className="py-2 px-4 border-b">{stream.title}</td>
                            <td className="py-2 px-4 border-b">{baseurl + stream.stream_link}</td>
                            <td className="py-2 px-4 text-center border-b">
                                <input
                                    type="checkbox"
                                    checked={stream.status}
                                    onChange={() => toggleStatus(stream.id, stream.status)}
                                    className="cursor-pointer"
                                />
                            </td>
                            <td className="text-center">
                                <button onClick={() => handleCopy(stream.token)} title="Copy Token" className="bg-blue-500  hover:underline ml-2 px-2 py-1 rounded "><i className="fa-solid fa-key"></i></button>
                            </td>
                            <td className="py-2 px-4 border-b text-center">
                                <button onClick={() => handleCopy(baseurl + stream.stream_link)} className="bg-green-500 hover:underline ml-2 px-2 py-1 rounded "><i className="fa-solid fa-copy"></i></button>
                                <button
                                    onClick={() => {
                                        handleDeleteClick(stream.id);
                                        setStreamIDtodelete(stream.stream_id);
                                    }}
                                    className="bg-red-500 hover:underline ml-2 px-2 py-1 rounded"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-md">
                        <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
                        <p>Are you sure you want to delete this stream?</p>
                        <div className="mt-4 text-end">
                            <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 mr-2 rounded">
                                Yes
                            </button>
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded">
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Stream;
