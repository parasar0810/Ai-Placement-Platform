import { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface AnalysisResult {
    score: number;
    summary: string;
    keySkills: string[];
    improvements: string[];
}

const ResumeUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setAnalyzing(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/ai/resume/analyze`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResult(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to analyze resume. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="text-blue-600" />
                AI Resume Analyzer
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-gray-600 font-medium">Click to upload resume</span>
                    <span className="text-gray-400 text-sm mt-1">PDF, DOCX, or TXT</span>
                </label>
                {file && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                        <FileText size={16} />
                        {file.name}
                    </div>
                )}
            </div>

            <button
                onClick={handleUpload}
                disabled={!file || analyzing}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {analyzing ? (
                    <>
                        <Loader2 className="animate-spin" /> Analyzing...
                    </>
                ) : (
                    'Analyze Resume'
                )}
            </button>

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-6 border-t pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Analysis Result</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-bold ${result.score >= 80 ? 'bg-green-100 text-green-700' :
                            result.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                            Score: {result.score}/100
                        </div>
                    </div>

                    <p className="text-gray-700 mb-4 bg-gray-50 p-3 rounded">{result.summary}</p>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <CheckCircle size={16} className="text-green-500" /> Key Skills Found
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {result.keySkills.map((skill, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                <AlertCircle size={16} className="text-orange-500" /> Improvements
                            </h4>
                            <ul className="text-sm space-y-1 text-gray-600">
                                {result.improvements.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1 h-1 bg-orange-400 rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeUpload;
