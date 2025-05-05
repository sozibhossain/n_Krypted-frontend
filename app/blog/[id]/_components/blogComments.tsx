import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

interface BlogCommentsProps {
    blogId: string;
}

function BlogComments({ blogId }: BlogCommentsProps) {
    const [saveInfo, setSaveInfo] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [message, setMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const sesstion = useSession();
    const token = sesstion?.data?.user?.accessToken || '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/blogs/add-comment/${blogId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('Comment submitted successfully!');
                setFormData({ name: '', email: '', message: '' });
                if (!saveInfo) {
                    localStorage.removeItem('blogCommentInfo');
                }
            } else {
                console.error('Backend error:', result);
                setMessage(result.message || 'Failed to submit comment.');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
            setMessage('Something went wrong.');
        }
    };

    // Load saved name/email from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('blogCommentInfo');
        if (saved) {
            const parsed = JSON.parse(saved);
            setFormData(prev => ({
                ...prev,
                name: parsed.name || '',
                email: parsed.email || ''
            }));
        }
    }, []);

    // Save name/email when saveInfo is true
    useEffect(() => {
        if (saveInfo) {
            localStorage.setItem('blogCommentInfo', JSON.stringify({
                name: formData.name,
                email: formData.email
            }));
        }
    }, [formData.name, formData.email, saveInfo]);

    return (
        <div className="">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Leave a comment</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded" 
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <textarea
                    name="message"
                    placeholder="Your comment"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded h-32"
                />
                <div className="flex items-clenter space-x-2">
                    <input
                        type="checkbox"
                        id="subscribe"
                        name="subscribe"
                        checked={saveInfo}
                        onChange={() => setSaveInfo(prev => !prev)}
                        className="mt-1"
                    />
                    <label htmlFor="subscribe" className='mt-[3px]'>
                        Save my name and email in this browser for the next time I comment.
                    </label>
                </div>
                <div className='flex justify-center items-center'>
                    <button type="submit" className="bg-[#645949] text-white px-8 py-2 rounded">
                        Submit
                    </button>
                </div>
                {message && <p className="mt-2 text-sm">{message}</p>}
            </form>
        </div>
    );
}

export default BlogComments;
