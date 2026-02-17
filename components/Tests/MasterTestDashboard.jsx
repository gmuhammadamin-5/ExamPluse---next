// src/components/Tests/MasterTestDashboard.jsx
import React, { useState } from 'react'
import { useTests } from './TestContext'
import { motion, AnimatePresence } from 'framer-motion'
import EnhancedListeningTest from './ListeningTest'
import EnhancedReadingTest from './ReadingTest'
import EnhancedWritingTest from './WritingTest'
import EnhancedSpeakingTest from './SpeakingTest'
import ResultsDashboard from './ResultsDashboard'

const MasterTestDashboard = () => {
    const { tests, currentTest, setCurrentTest, userResults } = useTests()
    const [activeSection, setActiveSection] = useState('listening')

    // Local function to get section status
    const getSectionStatusForTest = (testId, section) => {
        const result = userResults.find(
            r => r.testId === testId && r.section === section
        )
        return result ? 'Completed' : 'Not started'
    }

    const getSectionStatus = (section) => {
        const result = userResults.find(
            r => r.testId === currentTest?.id && r.section === section
        )
        return result ? 'completed' : 'pending'
    }

    const renderActiveSection = () => {
        if (!currentTest) return null

        switch (activeSection) {
            case 'listening':
                return <EnhancedListeningTest test={currentTest} />
            case 'reading':
                return <EnhancedReadingTest test={currentTest} />
            case 'writing':
                return <EnhancedWritingTest test={currentTest} />
            case 'speaking':
                return <EnhancedSpeakingTest test={currentTest} />
            case 'results':
                return <ResultsDashboard testId={currentTest.id} />
            default:
                return null
        }
    }

    return (
        <div style={styles.container}>
            {currentTest ? (
                <>
                    {/* Section Navigation */}
                    <div style={styles.navigation}>
                        <div style={styles.testInfo}>
                            <h3>{currentTest.title}</h3>
                            <p style={styles.testSubtitle}>Complete all 4 sections</p>
                        </div>

                        <div style={styles.sectionTabs}>
                            {[
                                { id: 'listening', label: '🎧 Listening', duration: '30 min' },
                                { id: 'reading', label: '📖 Reading', duration: '60 min' },
                                { id: 'writing', label: '✍️ Writing', duration: '60 min' },
                                { id: 'speaking', label: '🎤 Speaking', duration: '11 min' },
                                { id: 'results', label: '📊 Results', duration: '' }
                            ].map((section) => {
                                const status = getSectionStatus(section.id)
                                return (
                                    <motion.button
                                        key={section.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveSection(section.id)}
                                        style={{
                                            ...styles.sectionTab,
                                            ...(activeSection === section.id && styles.activeSectionTab),
                                            ...(status === 'completed' && styles.completedSectionTab)
                                        }}
                                    >
                                        <div style={styles.tabContent}>
                                            <div style={styles.tabLabel}>
                                                {section.label}
                                                {status === 'completed' && ' ✓'}
                                            </div>
                                            {section.duration && (
                                                <div style={styles.tabDuration}>{section.duration}</div>
                                            )}
                                        </div>
                                    </motion.button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Active Section Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            style={styles.content}
                        >
                            {renderActiveSection()}
                        </motion.div>
                    </AnimatePresence>
                </>
            ) : (
                // Test Selection Screen
                <div style={styles.selectionScreen}>
                    <h1>🎯 IELTS Mock Test Center</h1>
                    <p style={styles.selectionSubtitle}>
                        Select a test to begin your practice. Complete all 20 tests for comprehensive preparation.
                    </p>

                    <div style={styles.testGrid}>
                        {tests.map(test => {
                            const completedSections = userResults.filter(r => r.testId === test.id).length
                            const progress = (completedSections / 4) * 100

                            return (
                                <motion.div
                                    key={test.id}
                                    whileHover={{ scale: 1.02 }}
                                    style={styles.testCard}
                                    onClick={() => setCurrentTest(test)}
                                >
                                    <div style={styles.testCardHeader}>
                                        <h3>{test.title}</h3>
                                        <div style={styles.testStatus}>
                                            {progress === 100 ? '✅ Completed' : `${progress}%`}
                                        </div>
                                    </div>

                                    <div style={styles.testCardProgress}>
                                        <div style={styles.progressBar}>
                                            <div
                                                style={{
                                                    width: `${progress}%`,
                                                    ...styles.progressFill
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={styles.testCardStats}>
                                        <div style={styles.stat}>
                                            <span style={styles.statLabel}>Listening:</span>
                                            <span style={styles.statValue}>
                                                {getSectionStatusForTest(test.id, 'listening')}
                                            </span>
                                        </div>
                                        <div style={styles.stat}>
                                            <span style={styles.statLabel}>Reading:</span>
                                            <span style={styles.statValue}>
                                                {getSectionStatusForTest(test.id, 'reading')}
                                            </span>
                                        </div>
                                        <div style={styles.stat}>
                                            <span style={styles.statLabel}>Writing:</span>
                                            <span style={styles.statValue}>
                                                {getSectionStatusForTest(test.id, 'writing')}
                                            </span>
                                        </div>
                                        <div style={styles.stat}>
                                            <span style={styles.statLabel}>Speaking:</span>
                                            <span style={styles.statValue}>
                                                {getSectionStatusForTest(test.id, 'speaking')}
                                            </span>
                                        </div>
                                    </div>

                                    <button style={styles.startTestButton}>
                                        {progress === 100 ? 'View Results' : 'Start Test'}
                                    </button>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

// Styles obyekti
const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        padding: '20px'
    },
    navigation: {
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '15px',
        padding: '25px',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(10px)'
    },
    testInfo: {
        flex: 1
    },
    testSubtitle: {
        color: '#94a3b8',
        marginTop: '5px'
    },
    sectionTabs: {
        display: 'flex',
        gap: '15px'
    },
    sectionTab: {
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '10px',
        cursor: 'pointer',
        minWidth: '140px',
        textAlign: 'center',
        transition: 'all 0.3s'
    },
    activeSectionTab: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        borderColor: '#60a5fa'
    },
    completedSectionTab: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderColor: '#34d399'
    },
    tabContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    tabLabel: {
        fontSize: '14px',
        fontWeight: '600'
    },
    tabDuration: {
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.7)'
    },
    content: {
        background: 'rgba(30, 41, 59, 0.7)',
        borderRadius: '15px',
        padding: '30px',
        minHeight: 'calc(100vh - 200px)',
        border: '1px solid rgba(59, 130, 246, 0.3)'
    },
    selectionScreen: {
        maxWidth: '1400px',
        margin: '0 auto'
    },
    selectionSubtitle: {
        color: '#94a3b8',
        fontSize: '18px',
        marginBottom: '40px',
        textAlign: 'center'
    },
    testGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '25px'
    },
    testCard: {
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '15px',
        padding: '25px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    testCardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    testStatus: {
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '14px'
    },
    testCardProgress: {
        width: '100%'
    },
    progressBar: {
        height: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
        borderRadius: '4px',
        transition: 'width 0.3s'
    },
    testCardStats: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    stat: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px'
    },
    statLabel: {
        color: '#94a3b8'
    },
    statValue: {
        color: '#60a5fa',
        fontWeight: '600'
    },
    startTestButton: {
        width: '100%',
        padding: '12px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        border: 'none',
        borderRadius: '10px',
        color: 'white',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        marginTop: '10px'
    }
}

export default MasterTestDashboard