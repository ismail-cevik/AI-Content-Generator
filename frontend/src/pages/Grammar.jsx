import React, { useState } from 'react';
import { ChevronRight, ChevronDown, BookOpen } from 'lucide-react';

const Grammar = () => {
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState({});

    const grammarTopics = {
        'Basic Grammar': {
            'Present Simple': {
                explanation: 'The present simple tense is used to describe habits, general truths, and permanent situations.',
                usage: [
                    'Daily routines and habits: "I wake up at 7 AM every day."',
                    'General truths and facts: "Water boils at 100°C."',
                    'Permanent situations: "She lives in London."',
                    'Scheduled events: "The train leaves at 9 PM."'
                ],
                formation: {
                    positive: 'Subject + base verb (+ s/es for he/she/it)',
                    negative: 'Subject + do/does + not + base verb',
                    question: 'Do/Does + subject + base verb?'
                },
                examples: [
                    { english: 'I work in an office.', turkish: 'Bir ofiste çalışıyorum.' },
                    { english: 'She speaks three languages.', turkish: 'O üç dil konuşuyor.' },
                    { english: 'The sun rises in the east.', turkish: 'Güneş doğudan doğar.' },
                    { english: 'Do you like coffee?', turkish: 'Kahve sever misin?' },
                    { english: 'He doesn\'t play football.', turkish: 'O futbol oynamaz.' }
                ],
                rules: [
                    'Use base form of verb for I, you, we, they',
                    'Add -s or -es for he, she, it',
                    'Use "do/does" for questions and negatives',
                    'Third person singular: add -s (work→works), -es (go→goes), -ies (study→studies)'
                ]
            },
            'Present Continuous': {
                explanation: 'The present continuous tense is used to describe actions happening now or temporary situations.',
                examples: [
                    { english: 'I am reading a book.', turkish: 'Bir kitap okuyorum.' },
                    { english: 'They are playing football.', turkish: 'Futbol oynuyorlar.' },
                    { english: 'She is working from home this week.', turkish: 'Bu hafta evden çalışıyor.' }
                ],
                rules: [
                    'Form: am/is/are + verb-ing',
                    'Use for actions happening now',
                    'Use for temporary situations'
                ]
            },
            'Past Simple': {
                explanation: 'The past simple tense is used to describe completed actions in the past.',
                examples: [
                    { english: 'I visited Paris last year.', turkish: 'Geçen yıl Paris\'i ziyaret ettim.' },
                    { english: 'He finished his homework.', turkish: 'Ödevini bitirdi.' },
                    { english: 'We didn\'t go to the party.', turkish: 'Partiye gitmedik.' }
                ],
                rules: [
                    'Regular verbs: add -ed',
                    'Irregular verbs: learn special forms',
                    'Use "did" for questions and negatives'
                ]
            }
        },
        'Intermediate Grammar': {
            'Present Perfect': {
                explanation: 'The present perfect tense connects past actions to the present moment.',
                examples: [
                    { english: 'I have lived here for five years.', turkish: 'Beş yıldır burada yaşıyorum.' },
                    { english: 'She has just arrived.', turkish: 'Az önce geldi.' },
                    { english: 'Have you ever been to Japan?', turkish: 'Hiç Japonya\'ya gittin mi?' }
                ],
                rules: [
                    'Form: have/has + past participle',
                    'Use with "for", "since", "just", "already", "yet"',
                    'Use for experiences and unfinished time periods'
                ]
            },
            'Conditionals': {
                explanation: 'Conditional sentences express hypothetical situations and their consequences.',
                examples: [
                    { english: 'If it rains, I will stay home.', turkish: 'Yağmur yağarsa, evde kalacağım.' },
                    { english: 'If I were rich, I would travel the world.', turkish: 'Zengin olsaydım, dünyayı gezerdim.' },
                    { english: 'If I had studied harder, I would have passed.', turkish: 'Daha çok çalışsaydım, geçerdim.' }
                ],
                rules: [
                    'First conditional: If + present, will + base verb',
                    'Second conditional: If + past, would + base verb',
                    'Third conditional: If + past perfect, would have + past participle'
                ]
            },
            'Passive Voice': {
                explanation: 'The passive voice is used when the action is more important than who performs it.',
                examples: [
                    { english: 'The book was written by Shakespeare.', turkish: 'Kitap Shakespeare tarafından yazıldı.' },
                    { english: 'English is spoken worldwide.', turkish: 'İngilizce dünya çapında konuşulur.' },
                    { english: 'The house is being painted.', turkish: 'Ev boyanıyor.' }
                ],
                rules: [
                    'Form: be + past participle',
                    'Use when the doer is unknown or unimportant',
                    'Can be used in all tenses'
                ]
            }
        },
        'Advanced Grammar': {
            'Modal Verbs': {
                explanation: 'Modal verbs express possibility, necessity, permission, and ability.',
                examples: [
                    { english: 'You must finish your work.', turkish: 'İşini bitirmelisin.' },
                    { english: 'She might come to the party.', turkish: 'Partiye gelebilir.' },
                    { english: 'Could you help me, please?', turkish: 'Bana yardım edebilir misin, lütfen?' }
                ],
                rules: [
                    'Must: strong obligation or certainty',
                    'Should: advice or recommendation',
                    'Could/Might/May: possibility'
                ]
            },
            'Reported Speech': {
                explanation: 'Reported speech is used to tell someone what another person said.',
                examples: [
                    { english: 'He said he was tired.', turkish: 'Yorgun olduğunu söyledi.' },
                    { english: 'She asked if I was coming.', turkish: 'Gelip gelmediğimi sordu.' },
                    { english: 'They told me to wait.', turkish: 'Beklememi söylediler.' }
                ],
                rules: [
                    'Change pronouns and time expressions',
                    'Move tenses one step back',
                    'Use "if" or "whether" for yes/no questions'
                ]
            },
            'Relative Clauses': {
                explanation: 'Relative clauses give additional information about nouns.',
                examples: [
                    { english: 'The man who lives next door is a doctor.', turkish: 'Yan evde yaşayan adam doktor.' },
                    { english: 'This is the book that I bought yesterday.', turkish: 'Bu dün aldığım kitap.' },
                    { english: 'The city where I was born is beautiful.', turkish: 'Doğduğum şehir güzel.' }
                ],
                rules: [
                    'Who: for people (subject)',
                    'Which/That: for things',
                    'Where: for places, When: for time'
                ]
            }
        }
    };

    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const selectTopic = (category, topic) => {
        setSelectedTopic({
            category,
            topic,
            data: grammarTopics[category][topic]
        });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">English Grammar Guide</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Learn English grammar with detailed explanations and examples
                </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Grammar Topics Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Grammar Topics</h2>
                        <div className="space-y-2">
                            {Object.keys(grammarTopics).map((category) => (
                                <div key={category}>
                                    <button
                                        onClick={() => toggleCategory(category)}
                                        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <span className="font-medium">{category}</span>
                                        {expandedCategories[category] ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </button>
                                    {expandedCategories[category] && (
                                        <div className="ml-4 mt-2 space-y-1">
                                            {Object.keys(grammarTopics[category]).map((topic) => (
                                                <button
                                                    key={topic}
                                                    onClick={() => selectTopic(category, topic)}
                                                    className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                                                        selectedTopic?.topic === topic
                                                            ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    }`}
                                                >
                                                    {topic}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    {selectedTopic ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                            <div className="mb-6">
                                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    <span>{selectedTopic.category}</span>
                                    <ChevronRight className="h-4 w-4" />
                                    <span>{selectedTopic.topic}</span>
                                </div>
                                <h1 className="text-3xl font-bold">{selectedTopic.topic}</h1>
                            </div>

                            {/* Explanation */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Explanation</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {selectedTopic.data.explanation}
                                </p>
                            </div>

                            {/* Usage */}
                            {selectedTopic.data.usage && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4">When to Use</h2>
                                    <ul className="space-y-2">
                                        {selectedTopic.data.usage.map((use, index) => (
                                            <li key={index} className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-gray-700 dark:text-gray-300">{use}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Formation */}
                            {selectedTopic.data.formation && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4">Formation</h2>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                            <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">Positive</h3>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{selectedTopic.data.formation.positive}</p>
                                        </div>
                                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                                            <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Negative</h3>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{selectedTopic.data.formation.negative}</p>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                            <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Question</h3>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{selectedTopic.data.formation.question}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Rules */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Rules</h2>
                                <ul className="space-y-2">
                                    {selectedTopic.data.rules.map((rule, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                                            <span className="text-gray-700 dark:text-gray-300">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Examples */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Examples</h2>
                                <div className="space-y-4">
                                    {selectedTopic.data.examples.map((example, index) => (
                                        <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                            <div className="mb-2">
                                                <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">English</span>
                                                <p className="text-lg font-medium text-gray-900 dark:text-white">
                                                    {example.english}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Turkish</span>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {example.turkish}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                                Select a Grammar Topic
                            </h2>
                            <p className="text-gray-500 dark:text-gray-500">
                                Choose a topic from the sidebar to start learning
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Grammar;