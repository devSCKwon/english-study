import React from 'react';
import { ArrowLeft, Rocket, Dog, Apple, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
    { id: 'animal', label: '동물 친구들', icon: Dog, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30' },
    { id: 'fruit', label: '맛있는 과일', icon: Apple, color: 'text-red-500 bg-red-50 dark:bg-red-900/30' },
    { id: 'space', label: '신비한 우주', icon: Rocket, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' },
    { id: 'job', label: '다양한 직업', icon: Briefcase, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' },
];

export default function MethodCategory({ onBack, onComplete }) {
    const handleSelect = (categoryId) => {
        // Mock Data
        const data = {
            animal: [
                { word: 'Elephant', pron: '[ˈel.ɪ.fənt]', meaning: '코끼리', example: 'The elephant has a long trunk.', exampleMeaning: '코끼리는 긴 코를 가지고 있습니다.' },
                { word: 'Giraffe', pron: '[dʒɪˈrɑːf]', meaning: '기린', example: 'Giraffes are very tall.', exampleMeaning: '기린은 매우 키가 큽니다.' },
            ],
            fruit: [
                { word: 'Banana', pron: '[bəˈnɑː.nə]', meaning: '바나나', example: 'Monkeys love bananas.', exampleMeaning: '원숭이들은 바나나를 사랑해요.' },
                { word: 'Strawberry', pron: '[ˈstrɔː.bər.i]', meaning: '딸기', example: 'This strawberry is sweet.', exampleMeaning: '이 딸기는 달콤합니다.' },
            ],
            space: [
                { word: 'Planet', pron: '[ˈplæn.ɪt]', meaning: '행성', example: 'Earth is our planet.', exampleMeaning: '지구는 우리의 행성입니다.' },
                { word: 'Star', pron: '[stɑːr]', meaning: '별', example: 'Look at the bright star.', exampleMeaning: '점 저 밝은 별을 보세요.' },
            ],
            job: [
                { word: 'Teacher', pron: '[ˈtiː.tʃər]', meaning: '선생님', example: 'My teacher is very kind.', exampleMeaning: '나의 선생님은 매우 친절하십니다.' },
                { word: 'Doctor', pron: '[ˈdɒk.tər]', meaning: '의사', example: 'The doctor helps sick people.', exampleMeaning: '의사는 아픈 사람들을 돕습니다.' },
            ]
        };
        onComplete(data[categoryId]);
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={onBack} className="flex items-center text-gray-500 mb-6 hover:text-gray-900 dark:hover:text-gray-200">
                <ArrowLeft size={20} className="mr-2" /> 뒤로 가기
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">주제별 학습</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    {categories.map((cat) => (
                        <motion.button
                            key={cat.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleSelect(cat.id)}
                            className={`flex items-center p-6 rounded-2xl border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all ${cat.color}`}
                        >
                            <cat.icon size={40} className="mr-4" />
                            <span className="text-xl text-gray-800 dark:text-gray-100 font-bold">{cat.label}</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
