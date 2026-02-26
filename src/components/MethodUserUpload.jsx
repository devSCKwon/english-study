import React, { useState, useEffect } from 'react';
import { ArrowLeft, UploadCloud, Play, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { dictionary } from '../data/dictionary';

export default function MethodUserUpload({ onBack, onComplete }) {
    const [datasets, setDatasets] = useState([]);
    const [selectedDatasetId, setSelectedDatasetId] = useState('');

    useEffect(() => {
        // Load datasets from localStorage
        const loaded = localStorage.getItem('es_user_datasets');
        if (loaded) {
            try {
                const parsed = JSON.parse(loaded);
                setDatasets(parsed);
                if (parsed.length > 0) {
                    setSelectedDatasetId(parsed[0].id.toString());
                }
            } catch (e) {
                console.error("Failed to parse datasets", e);
            }
        }
    }, []);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            // .txt might be multiline or single line with commas
            const words = content.replace(/\n|\r/g, ',')
                .split(',')
                .map(w => w.trim())
                .filter(w => w.length > 0);

            if (words.length === 0) {
                alert('단어 파일이 비어있거나, 쉼표(,)가 없습니다.');
                return;
            }

            const newDataset = {
                id: Date.now(),
                name: file.name,
                words: words,
                date: new Date().toLocaleDateString()
            };

            const updatedDatasets = [newDataset, ...datasets];
            setDatasets(updatedDatasets);
            localStorage.setItem('es_user_datasets', JSON.stringify(updatedDatasets));
            setSelectedDatasetId(newDataset.id.toString());
        };
        reader.readAsText(file);
    };

    const handleDelete = (id) => {
        const updated = datasets.filter(d => d.id.toString() !== id.toString());
        setDatasets(updated);
        localStorage.setItem('es_user_datasets', JSON.stringify(updated));
        if (updated.length > 0) {
            setSelectedDatasetId(updated[0].id.toString());
        } else {
            setSelectedDatasetId('');
        }
    };

    const handleStart = () => {
        if (!selectedDatasetId) return;

        const dataset = datasets.find(d => d.id.toString() === selectedDatasetId);
        if (!dataset) return;

        const data = dataset.words.map(w => {
            const lowerW = w.toLowerCase();
            if (dictionary[lowerW]) {
                return { word: w, ...dictionary[lowerW] };
            }
            return {
                word: w,
                pron: `[발음 미확인]`,
                meaning: `(새로운 단어)`,
                example: `Let's practice the word '${w}'.`,
                exampleMeaning: `'${w}' 단어를 함께 연습해봐요.`
            };
        });

        onComplete(data);
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={onBack} className="flex items-center text-gray-500 mb-6 hover:text-gray-900 dark:hover:text-gray-200">
                <ArrowLeft size={20} className="mr-2" /> 뒤로 가기
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">사용자 학습</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        쉼표(,)로 구분된 텍스트(.txt) 파일을 업로드하여 나만의 단어장을 만들어보세요.
                    </p>
                </div>

                <div className="max-w-xl mx-auto flex flex-col gap-6">
                    {/* File Upload Section */}
                    <div className="border-2 border-dashed border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-8 text-center hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors">
                        <UploadCloud size={48} className="mx-auto text-teal-500 mb-4" />
                        <label className="cursor-pointer">
                            <span className="bg-teal-600 text-white px-6 py-3 rounded-full font-bold hover:bg-teal-700 transition-colors">
                                단어 파일 업로드 (.txt)
                            </span>
                            <input
                                type="file"
                                accept=".txt"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </label>
                        <p className="text-sm text-teal-600 dark:text-teal-400 mt-4">
                            예시: apple, banana, cat ...
                        </p>
                    </div>

                    {/* Dataset Selection */}
                    {datasets.length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-600">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                학습할 단어장 선택
                            </label>
                            <div className="flex gap-4">
                                <select
                                    className="flex-1 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-teal-500 transition-colors"
                                    value={selectedDatasetId}
                                    onChange={(e) => setSelectedDatasetId(e.target.value)}
                                >
                                    {datasets.map(d => (
                                        <option key={d.id} value={d.id}>
                                            {d.name} ({d.words.length}단어) - {d.date}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => handleDelete(selectedDatasetId)}
                                    className="bg-red-100 text-red-600 hover:bg-red-200 px-4 rounded-xl flex items-center justify-center transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                    title="선택한 단어장 삭제"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <button
                                onClick={handleStart}
                                className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition-colors text-lg flex items-center justify-center shadow-lg shadow-teal-600/20"
                            >
                                <Play fill="currentColor" size={20} className="mr-2" /> 선택한 단어장으로 학습 시작
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
