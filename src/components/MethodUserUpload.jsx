import React, { useState, useEffect } from 'react';
import { ArrowLeft, UploadCloud, Play, Trash2, BookOpen, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { dictionary } from '../data/dictionary';

// 시스템에서 기본 제공하는 단어장 리스트
const PRESET_DATASETS = [
    { id: '20261027', name: '2026년 10월 27일 단어장', file: '20261027.txt', desc: '일상 사물, 동작, 동물, 해양생물 등 종합 단어', count: 78, date: '2026-10-27' },
    { id: '20261023', name: '2026년 10월 23일 단어장', file: '20261023.txt', desc: '장소, 건강, 행동, 일상 사물 등 학습 단어', count: 37, date: '2026-10-23' },
    { id: '20261022', name: '2026년 10월 22일 단어장', file: '20261022.txt', desc: '일상 사물, 동작, 교통수단 등 학습 단어', count: 26, date: '2026-10-22' },
    { id: '20261021', name: '2026년 10월 21일 단어장', file: '20261021.txt', desc: '바다생물, 직업, 장소, 일상 종합 단어', count: 52, date: '2026-10-21' },
    { id: '20261020_2', name: '2026년 10월 20일 2차 단어장', file: '20261020_2.txt', desc: '놀이, 생활동작, 해양, 일상 단어', count: 26, date: '2026-10-20' },
    { id: '20261020', name: '2026년 10월 20일 단어장', file: '20261020.txt', desc: '일상 사물, 동작, 장소 등 종합 단어', count: 77, date: '2026-10-20' },
    { id: '20260610', name: '2026년 06월 10일 단어장', file: '20260610.txt', desc: '신체 부위, 옷, 가족 관련 단어', count: 24, date: '2026-06-10' },
    { id: '20260506', name: '2026년 05월 06일 단어장', file: '20260506.txt', desc: '동작, 사물 관련 단어', count: 12, date: '2026-05-06' },
    { id: '20260310', name: '2026년 03월 10일 단어장', file: '20260310.txt', desc: '동물, 과일, 음식 관련 단어', count: 24, date: '2026-03-10' },
    { id: '20260302', name: '2026년 03월 02일 단어장', file: '20260302.txt', desc: '주제 복습 단어', count: 12, date: '2026-03-02' },
    { id: '20260226', name: '2026년 02월 26일 단어장', file: '20260226.txt', desc: '기초 단어 및 파생어', count: 24, date: '2026-02-26' },
];

export default function MethodUserUpload({ onBack, onComplete }) {
    const [activeTab, setActiveTab] = useState('preset'); // 'preset' (추천 단어장) 또는 'custom' (직접 올리기)
    const [datasets, setDatasets] = useState([]);
    const [selectedDatasetId, setSelectedDatasetId] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // 로컬스토리지에서 사용자가 업로드했던 단어장 로드
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

    // 대괄호([]) 안의 쉼표를 보존하며 쉼표로 분리하는 파서 함수
    const parseLineWithBrackets = (line) => {
        const result = [];
        let current = '';
        let inBracket = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '[') {
                inBracket = true;
                current += char;
            } else if (char === ']') {
                inBracket = false;
                current += char;
            } else if (char === ',' && !inBracket) {
                if (current.trim().length > 0) result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        if (current.trim().length > 0) result.push(current.trim());
        return result;
    };

    // 텍스트 파일 파싱 및 딕셔너리 매핑 공통 함수
    const parseWordsAndStart = (content, sourceName) => {
        const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
        const processedWords = [];

        // 2줄 형식 지원: 첫 번째 줄은 영단어, 두 번째 줄은 뜻 목록(대괄호 지원)
        if (lines.length >= 2 && !lines[0].includes('|')) {
            const rawWords = lines[0].split(',').map(w => w.trim()).filter(w => w.length > 0);
            const rawMeanings = parseLineWithBrackets(lines[1]);

            if (rawWords.length > 0 && rawWords.length === rawMeanings.length) {
                rawWords.forEach((word, idx) => {
                    processedWords.push({
                        word: word,
                        meaning: rawMeanings[idx]
                    });
                });
            }
        }

        // 2줄 형식이 아니거나 매칭되지 않은 경우 기본 파싱
        if (processedWords.length === 0) {
            lines.forEach(line => {
                if (line.includes('|')) {
                    // 파이프(|) 구분 형식 지원: 단어 | 뜻 | 발음 | 예문 | 예문 뜻
                    const parts = line.split('|').map(p => p.trim());
                    processedWords.push({
                        word: parts[0],
                        meaning: parts[1] || '',
                        pron: parts[2] || '',
                        example: parts[3] || '',
                        exampleMeaning: parts[4] || ''
                    });
                } else {
                    // 쉼표(,) 구분 형식 지원
                    const words = line.split(',').map(w => w.trim()).filter(w => w.length > 0);
                    words.forEach(w => processedWords.push(w));
                }
            });
        }

        if (processedWords.length === 0) {
            alert('단어장에 유효한 단어가 없습니다.');
            return;
        }

        const data = processedWords.map(item => {
            // 파이프구분 객체인 경우
            if (typeof item === 'object' && item !== null) {
                const word = item.word;
                const lowerW = word.toLowerCase();
                const dictEntry = dictionary[lowerW] || {};
                
                return {
                    word: word,
                    pron: item.pron || dictEntry.pron || `[발음 미확인]`,
                    meaning: item.meaning || dictEntry.meaning || `(새로운 단어)`,
                    example: item.example || dictEntry.example || `Let's practice the word '${word}'.`,
                    exampleMeaning: item.exampleMeaning || dictEntry.exampleMeaning || `'${word}' 단어를 함께 연습해봐요.`
                };
            }

            // 단순 문자열(단어만)인 경우 딕셔너리에서 검색
            const w = item;
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

    // 서버 추천 단어장 로드 후 학습 시작
    const handleStartPreset = async (preset) => {
        setIsLoading(true);
        try {
            // Vite base_url 적용하여 public 폴더 내 파일 fetch
            const baseUrl = import.meta.env.BASE_URL || '/';
            const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
            const response = await fetch(`${cleanBaseUrl}data/${preset.file}`);
            
            if (!response.ok) {
                throw new Error(`파일 로드 실패 (Status: ${response.status})`);
            }
            
            const content = await response.text();
            parseWordsAndStart(content, preset.name);
        } catch (error) {
            console.error("Failed to load preset dataset", error);
            alert(`단어장 파일을 가져오는 도중 오류가 발생했습니다. (${error.message})`);
        } finally {
            setIsLoading(false);
        }
    };

    // 파일 직접 업로드 처리
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            
            // 임시 파싱 검증
            const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
            const wordsList = [];
            lines.forEach(line => {
                if (line.includes('|')) {
                    const parts = line.split('|').map(p => p.trim());
                    wordsList.push({ word: parts[0] });
                } else {
                    const words = line.split(',').map(w => w.trim()).filter(w => w.length > 0);
                    words.forEach(w => wordsList.push({ word: w }));
                }
            });

            if (wordsList.length === 0) {
                alert('단어 파일이 비어있습니다.');
                return;
            }

            const newDataset = {
                id: Date.now(),
                name: file.name,
                content: content, // 실제 텍스트 원본 저장
                words: wordsList,
                date: new Date().toLocaleDateString()
            };

            const updatedDatasets = [newDataset, ...datasets];
            setDatasets(updatedDatasets);
            localStorage.setItem('es_user_datasets', JSON.stringify(updatedDatasets));
            setSelectedDatasetId(newDataset.id.toString());
        };
        reader.readAsText(file);
    };

    // 직접 업로드한 단어장 삭제
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

    // 직접 업로드한 단어장으로 학습 시작
    const handleStartCustom = () => {
        if (!selectedDatasetId) return;

        const dataset = datasets.find(d => d.id.toString() === selectedDatasetId);
        if (!dataset) return;

        // 원본 콘텐츠가 있으면 파싱하고, 없으면 예전 포맷 예외처리
        if (dataset.content) {
            parseWordsAndStart(dataset.content, dataset.name);
        } else {
            // 예전 버전 포맷 호환
            const data = dataset.words.map(item => {
                if (typeof item === 'object' && item !== null) {
                    const word = item.word;
                    const lowerW = word.toLowerCase();
                    const dictEntry = dictionary[lowerW] || {};
                    return {
                        word: word,
                        pron: item.pron || dictEntry.pron || `[발음 미확인]`,
                        meaning: item.meaning || dictEntry.meaning || `(새로운 단어)`,
                        example: item.example || dictEntry.example || `Let's practice the word '${word}'.`,
                        exampleMeaning: item.exampleMeaning || dictEntry.exampleMeaning || `'${word}' 단어를 함께 연습해봐요.`
                    };
                }
                const w = item;
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
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {/* 상단 뒤로가기 버튼 */}
            <button onClick={onBack} className="flex items-center text-gray-500 mb-6 hover:text-gray-900 dark:hover:text-gray-200 font-semibold transition-colors">
                <ArrowLeft size={20} className="mr-2" /> 뒤로 가기
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">사용자 학습</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        기존에 준비된 단어장을 선택하거나, 직접 파일을 업로드하여 나만의 방식으로 학습해 보세요.
                    </p>
                </div>

                {/* 탭 네비게이션 */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8 max-w-xl mx-auto">
                    <button
                        onClick={() => setActiveTab('preset')}
                        className={`flex-1 py-3 text-center font-bold text-lg border-b-4 transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'preset' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        <BookOpen size={20} />
                        추천 단어장 목록
                    </button>
                    <button
                        onClick={() => setActiveTab('custom')}
                        className={`flex-1 py-3 text-center font-bold text-lg border-b-4 transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'custom' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        <UploadCloud size={20} />
                        직접 파일 업로드
                    </button>
                </div>

                <div className="max-w-3xl mx-auto">
                    {/* 탭 1: 추천 단어장 목록 */}
                    {activeTab === 'preset' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {PRESET_DATASETS.map((preset) => (
                                <div
                                    key={preset.id}
                                    className="bg-slate-50 dark:bg-gray-700/40 border border-slate-100 dark:border-gray-700 rounded-2xl p-5 hover:shadow-md hover:border-teal-200 dark:hover:border-teal-800 transition-all flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 border border-teal-100 dark:border-teal-900/50">
                                                {preset.count} 단어
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                                                {preset.date}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                                            {preset.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            {preset.desc}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleStartPreset(preset)}
                                        disabled={isLoading}
                                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                                    >
                                        <Play fill="currentColor" size={14} />
                                        학습 시작하기
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 탭 2: 직접 파일 업로드 */}
                    {activeTab === 'custom' && (
                        <div className="flex flex-col gap-6 max-w-xl mx-auto">
                            {/* 드래그 앤 드롭 파일 업로드 영역 */}
                            <div className="border-2 border-dashed border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/10 rounded-2xl p-8 text-center hover:bg-teal-100/70 dark:hover:bg-teal-900/20 transition-all duration-200">
                                <UploadCloud size={48} className="mx-auto text-teal-500 mb-4" />
                                <label className="cursor-pointer">
                                    <span className="bg-teal-600 text-white px-6 py-3 rounded-full font-bold hover:bg-teal-700 transition-colors shadow-md inline-block">
                                        단어 파일 업로드 (.txt)
                                    </span>
                                    <input
                                        type="file"
                                        accept=".txt"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                </label>
                                <p className="text-sm text-teal-600 dark:text-teal-400 mt-4 font-medium">
                                    쉼표(,) 혹은 파이프라인(|)으로 구분된 텍스트 파일을 지원합니다.
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    예: apple, banana, cat 또는 단어 | 뜻 | 발음 | 예문 | 예문뜻
                                </p>
                            </div>

                            {/* 저장된 사용자 단어장 선택 */}
                            {datasets.length > 0 ? (
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-600">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        학습할 업로드 단어장 선택
                                    </label>
                                    <div className="flex gap-3">
                                        <select
                                            className="flex-1 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-teal-500 transition-colors font-medium"
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
                                        onClick={handleStartCustom}
                                        className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition-colors text-lg flex items-center justify-center shadow-lg shadow-teal-600/20"
                                    >
                                        <Play fill="currentColor" size={20} className="mr-2" /> 선택한 단어장으로 학습 시작
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400 dark:text-gray-500 font-medium">
                                    아직 업로드된 개인 단어장이 없습니다.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
