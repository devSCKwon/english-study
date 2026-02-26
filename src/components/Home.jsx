import React from 'react';
import { Image, GraduationCap, PenTool, LayoutGrid, Dices } from 'lucide-react';
import { motion } from 'framer-motion';

const methods = [
    { id: 'image', title: '시험지로 배우기', desc: '시험지를 찍어 올리면 단어를 추출해요!', icon: Image, color: 'bg-blue-500' },
    { id: 'grade', title: '학년별 단어장', desc: '1학년부터 6학년까지 필수 단어', icon: GraduationCap, color: 'bg-green-500' },
    { id: 'manual', title: '직접 입력하기', desc: '내가 알고 싶은 단어를 직접 타이핑', icon: PenTool, color: 'bg-purple-500' },
    { id: 'category', title: '주제별 학습', desc: '동물, 우주, 음식 등 재미있는 주제들', icon: LayoutGrid, color: 'bg-orange-500' },
    { id: 'random', title: '오늘의 뽑기', desc: '어떤 단어가 나올까? 두근두근!', icon: Dices, color: 'bg-pink-500' },
];

export default function Home({ onSelectMethod }) {
    return (
        <div className="flex flex-col items-center py-10">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-600 mb-4 tracking-tight">
                    어떻게 공부할까요?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    마음에 드는 방법을 선택해서 재미있게 영어를 시작해봐요!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                {methods.map((method, index) => (
                    <motion.div
                        key={method.id}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onSelectMethod(method.id)}
                        className="cursor-pointer bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-500 transition-colors group flex flex-col items-center text-center"
                    >
                        <div className={`${method.color} text-white p-4 rounded-2xl mb-5 shadow-lg group-hover:shadow-xl transition-shadow`}>
                            <method.icon size={36} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                            {method.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            {method.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
