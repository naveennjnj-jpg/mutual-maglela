// pages/user/ProjectSubmit.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Send, Upload, Loader2, AlertCircle, X, FileText, CheckCircle
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const ProjectSubmit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [note, setNote] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');

    useEffect(() => {
        if (id) {
            fetchProject(id);
        }
    }, [id]);

    const fetchProject = async (projectId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${API_URL}/api/admin/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setProject(response.data.data);
            } else {
                setError(response.data.message || 'Failed to fetch project');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch project');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            // Validate file size (20MB max)
            if (selectedFile.size > 20 * 1024 * 1024) {
                setError('File size exceeds 20MB limit');
                return;
            }

            // Validate file type
            const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Only PDF, DOCX, and PPTX files are allowed');
                return;
            }

            setFile(selectedFile);
            setFileName(selectedFile.name);
            setError(null);
            setUploadStatus('idle');
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setFileName('');
        setUploadStatus('idle');
        setUploadProgress(0);
    };

    // ✅ Upload document and get URL
    const uploadDocument = async (fileToUpload: File): Promise<string | null> => {
        setUploading(true);
        setUploadStatus('uploading');
        setUploadProgress(0);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const formData = new FormData();
            formData.append('document', fileToUpload);

            const uploadResponse = await axios.post(
                `${API_URL}/api/auth/upload-document`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(percentCompleted);
                        }
                    }
                }
            );

            console.log('📤 Upload Response:', uploadResponse.data);

            if (!uploadResponse.data.success) {
                throw new Error(uploadResponse.data.message || 'Document upload failed');
            }

            // Get uploaded file URL
            const fileUrl = uploadResponse.data.data?.fileUrl || uploadResponse.data.data?.url || uploadResponse.data.data;

            if (!fileUrl) {
                throw new Error('File URL not returned from upload');
            }

            setUploadStatus('done');
            return fileUrl;

        } catch (err: any) {
            console.error('❌ Upload error:', err);
            setUploadStatus('error');
            throw new Error(err.response?.data?.message || err.message || 'Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    // ✅ Submit project with note and file URL
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!note.trim()) {
            setError('Please add a note to the user');
            return;
        }

        if (!file) {
            setError('Please attach a completed file');
            return;
        }

        setSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required');
                setSubmitting(false);
                return;
            }

            // ✅ Step 1: Upload document first
            let documentUrl: string | null = null;
            try {
                documentUrl = await uploadDocument(file);
                console.log('✅ Document uploaded successfully:', documentUrl);
            } catch (uploadErr: any) {
                setError(uploadErr.message || 'Failed to upload document');
                setSubmitting(false);
                return;
            }

            if (!documentUrl) {
                setError('Failed to get document URL after upload');
                setSubmitting(false);
                return;
            }

            // ✅ Step 2: Update project with note and document URL
            const updateData = {
                adminnote: note,
                adminattachment: documentUrl,
                status: 'publish' // Update status to in_revision
            };

            const response = await axios.put(
                `${API_URL}/api/admin/projects/${id}`,
                updateData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('📝 Project update response:', response.data);

            if (response.data.success) {
                setSuccess('Project submitted successfully!');

                // Clear form
                setFile(null);
                setFileName('');
                setNote('');
                setUploadStatus('idle');
                setUploadProgress(0);

                // Redirect after delay
                setTimeout(() => {
                    navigate(`/admin/projects`);
                }, 2000);
            } else {
                setError(response.data.message || 'Failed to submit project');
            }

        } catch (err: any) {
            console.error('❌ Error submitting project:', err);
            setError(err.response?.data?.message || err.message || 'Failed to submit project');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading project...</p>
                </div>
            </div>
        );
    }

    if (error && !project) {
        return (
            <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-[#0F2D63] mb-2">Error</h2>
                    <p className="text-gray-500 text-sm mb-6">{error}</p>
                    <Link to="/admin/projects" className="inline-block bg-[#0F2D63] text-white px-6 py-3 rounded-xl text-sm font-semibold">
                        Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="flex-1">
            <div className="min-h-screen bg-[#F4F6FB] p-6">
                <div className="max-w-[680px] mx-auto space-y-5">
                    {/* Back Button */}
                    <Link
                        to={`/admin/projects/${id}`}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0F2D63] transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Project
                    </Link>

                    {/* Header */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Submit Project</p>
                        <h1 className="text-xl font-['Roboto'] font-bold text-[#0F2D63] leading-tight">
                            {project?.title}
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">{project?.type}</p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            {success}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Note */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                                Note to User *
                            </label>
                            <textarea
                                rows={6}
                                placeholder="Describe what was done, key decisions made, and what the user should review…"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#0F2D63] resize-none leading-relaxed"
                                disabled={submitting}
                            />
                        </div>

                        {/* File Upload */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                                Attach Completed File *
                            </label>

                            {!file ? (
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        onChange={handleFileChange}
                                        accept=".pdf,.docx,.pptx"
                                        className="hidden"
                                        disabled={submitting}
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className={`w-full border-2 border-dashed border-gray-200 hover:border-[#0F2D63]/50 hover:bg-[#f0f3ff]/30 rounded-xl py-8 flex flex-col items-center gap-3 transition-all group cursor-pointer ${submitting ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        <div className="w-12 h-12 bg-gray-100 group-hover:bg-[#f0f3ff] rounded-full flex items-center justify-center transition-colors">
                                            <Upload className="w-4.5 h-4.5 text-gray-400 group-hover:text-[#0F2D63] transition-colors" />
                                        </div>
                                        <p className="text-sm text-gray-400 group-hover:text-[#0F2D63] transition-colors font-medium">
                                            Click to attach the completed file
                                        </p>
                                        <p className="text-xs text-gray-300">PDF, DOCX, PPTX — up to 20 MB</p>
                                    </label>
                                </div>
                            ) : (
                                <div className="border-2 border-[#0F2D63]/30 rounded-xl p-4 flex items-center justify-between bg-[#f0f3ff]/20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#0F2D63]/10 rounded-lg flex items-center justify-center">
                                            {uploadStatus === 'done' ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : uploadStatus === 'uploading' ? (
                                                <Loader2 className="w-5 h-5 text-[#0F2D63] animate-spin" />
                                            ) : (
                                                <FileText className="w-5 h-5 text-[#0F2D63]" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-[#0F2D63]">{fileName}</p>
                                            <p className="text-xs text-gray-400">
                                                {(file.size / 1024).toFixed(1)} KB
                                                {uploadStatus === 'uploading' && ` · Uploading ${uploadProgress}%`}
                                                {uploadStatus === 'done' && ' · ✅ Uploaded'}
                                                {uploadStatus === 'error' && ' · ❌ Upload failed'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-red-500 disabled:opacity-50"
                                        disabled={submitting || uploadStatus === 'uploading'}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Link
                                to={`/admin/projects`}
                                className="flex-1 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-center"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={submitting || !file || !note.trim()}
                                className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[#0F2D63] hover:bg-[#0a2050] text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {uploading ? 'Uploading...' : 'Submitting...'}
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-3.5 h-3.5" />
                                        Submit to User
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default ProjectSubmit;