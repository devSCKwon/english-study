import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import MethodImage from './components/MethodImage';
import MethodGrade from './components/MethodGrade';
import MethodManual from './components/MethodManual';
import MethodCategory from './components/MethodCategory';
import MethodRandom from './components/MethodRandom';
import StudyArea from './components/StudyArea';
import HistoryLog from './components/HistoryLog';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [studyData, setStudyData] = useState(null);
  const [methodContext, setMethodContext] = useState('');
  const [history, setHistory] = useState([]); // 학습 세션 기록

  const handleSelectMethod = (methodId) => {
    setCurrentView(methodId);
    setMethodContext(methodId);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setStudyData(null);
  };

  const handleStudyReady = (data) => {
    setStudyData(data);
    setCurrentView('study');
  };

  const handleSaveRecord = (record) => {
    const methodLabels = {
      image: '시험지로 배우기',
      grade: '학년별 단어장',
      manual: '직접 단어 입력',
      category: '주제별 학습',
      random: '오늘의 뽑기',
    };

    setHistory(prev => [{
      ...record,
      methodLabel: methodLabels[methodContext] || '알 수 없음'
    }, ...prev]);
  };

  const openHistory = () => setCurrentView('history');

  return (
    <Layout>
      <div className="flex justify-end mb-4">
        {currentView === 'home' && (
          <button
            onClick={openHistory}
            className="text-sm font-bold bg-purple-100 text-purple-700 px-4 py-2 rounded-full hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-800 transition"
          >
            기록 보기 ({history.length})
          </button>
        )}
      </div>

      {currentView === 'home' && <Home onSelectMethod={handleSelectMethod} />}
      {currentView === 'image' && <MethodImage onBack={handleBackToHome} onComplete={handleStudyReady} />}
      {currentView === 'grade' && <MethodGrade onBack={handleBackToHome} onComplete={handleStudyReady} />}
      {currentView === 'manual' && <MethodManual onBack={handleBackToHome} onComplete={handleStudyReady} />}
      {currentView === 'category' && <MethodCategory onBack={handleBackToHome} onComplete={handleStudyReady} />}
      {currentView === 'random' && <MethodRandom onBack={handleBackToHome} onComplete={handleStudyReady} />}

      {currentView === 'study' && (
        <StudyArea
          data={studyData}
          onHome={handleBackToHome}
          onSaveRecord={handleSaveRecord}
        />
      )}

      {currentView === 'history' && (
        <HistoryLog history={history} onBack={handleBackToHome} />
      )}
    </Layout>
  );
}

export default App;
