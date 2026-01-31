// "use client"
// export const runtime = "nodejs"

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL ||
//   "https://ohi13me-legallens.hf.space/analyze-contract"

// import { useState } from "react"

// import ExecutiveSummary from "./components/ExecutiveSummary"
// import StatCard from "./components/StatCard"
// import SectionTitle from "./components/SectionTitle"
// import RiskDistribution from "./components/RiskDistribution"
// import ClauseCard from "./components/ClauseCard"

// export default function Home() {
//   const [file, setFile] = useState<File | null>(null)
//   const [result, setResult] = useState<any>(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const analyzeContract = async () => {
//     if (!file) {
//       setError("Please upload a PDF file")
//       return
//     }

//     setError(null)
//     setLoading(true)
//     setResult(null)

//     const formData = new FormData()
//     formData.append("file", file)

//     try {
//       const res = await fetch(API_URL, {
//         method: "POST",
//         body: formData,
//       })

//       if (!res.ok) throw new Error(await res.text())

//       const data = await res.json()
//       setResult({
//         clauses: data.clauses || [],
//         missing_clauses: data.missing_clauses || [],
//         overall_risk: data.overall_risk ?? 0
//       })


//       setTimeout(() => {
//         document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })
//       }, 150)
//     } catch {
//       setError("Failed to analyze contract. Ensure backend is running.")
//     }

//     setLoading(false)
//   }

//   const downloadReport = async () => {
//       if (!result || typeof window === "undefined") return

//       const { default: jsPDF } = await import("jspdf")

//       const doc = new jsPDF()
//       let y = 14

//       doc.setFontSize(18)
//       doc.text("LegalLens", 14, y)
//       y += 10

//       doc.setFontSize(12)
//       doc.text(`Overall Risk Score: ${result.overall_risk}`, 14, y)
//       y += 6
//       doc.text(`Clauses Analyzed: ${result.clauses.length}`, 14, y)
//       y += 6
//       doc.text(`Missing Clauses: ${result.missing_clauses?.length || 0}`, 14, y)
//       y += 10

//       if ((result.missing_clauses || []).length > 0) {
//         doc.setFontSize(13)
//         doc.text("Missing Critical Clauses:", 14, y)
//         y += 6

//         doc.setFontSize(11);
//         (result.missing_clauses || []).forEach((c: string) => {
//           doc.text(`• ${c}`, 16, y)
//           y += 5
//         })
//         y += 6
//       }

//   result.clauses.forEach((c: any, i: number) => {
//         if (y > 270) {
//           doc.addPage()
//           y = 14
//         }

//         doc.setFontSize(13)
//         doc.text(`${i + 1}. ${c.clause_type}`, 14, y)
//         y += 6

//         doc.setFontSize(11)
//         doc.text(`Risk Score: ${c.risk_score}`, 16, y)
//         y += 5
//         doc.text(`Reasons: ${c.reasons.join(", ")}`, 16, y)
//         y += 5

//         if (c.suggestion) {
//           doc.text(`Suggestion: ${c.suggestion}`, 16, y)
//           y += 5
//         }

//         doc.text(c.text.slice(0, 300) + "...", 16, y, { maxWidth: 170 })
//         y += 10
//       })

//       doc.save(`legal-risk-report-${Date.now()}.pdf`)
//     }


//   return (
//     <main className="min-h-screen bg-slate-100 px-6 py-12">
//       <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-10">

//         {/* Header */}
//         <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">
//           LegalLens
//         </h1>
//         <p className="text-slate-600 mb-10">
//           Upload a legal contract PDF to receive clause-level risk analysis
//         </p>


//         {/* Upload */}
//         <div className="flex flex-col md:flex-row gap-4 mb-8">
//           <input
//             type="file"
//             accept="application/pdf"
//             onChange={(e) => setFile(e.target.files?.[0] || null)}
//             className="flex-1 rounded-lg border border-slate-300 bg-white text-slate-700
//               file:mr-4 file:py-2 file:px-4
//               file:rounded-md file:border-0
//               file:bg-slate-900 file:text-white
//               hover:file:bg-slate-800"
//           />
//           <button
//             onClick={analyzeContract}
//             disabled={loading || !file}
//             className="px-8 py-2 rounded-lg bg-slate-900 text-white font-semibold
//               hover:bg-slate-800 disabled:opacity-50"
//           >
//             {loading ? "Analyzing…" : "Analyze"}
//           </button>
//         </div>

//         {error && <div className="mb-6 text-red-600 font-medium">{error}</div>}

//         {loading && (
//           <div className="mb-6 text-slate-600">
//             First analysis may take ~30–60 seconds.
//           </div>
//         )}

//         {!result && !loading && (
//           <div className="text-center text-slate-400 mt-24">
//             Upload a PDF contract to begin analysis
//           </div>
//         )}

//         {/* RESULTS */}
//         {result && (
//           <div id="results" className="mt-16 border-t pt-12 border-slate-200">

//             {/* Executive Summary */}
//             <ExecutiveSummary
//               overallRisk={result.overall_risk}
//               missingCount={result.missing_clauses?.length || 0}
//             />


//             {/* Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//               <StatCard label="Overall Risk" value={result.overall_risk} />
//               <StatCard label="Clauses Analyzed" value={result.clauses?.length || 0} />
//               <StatCard label="Missing Clauses" value={result.missing_clauses?.length || 0} />
//             </div>

//             {/* Risk Distribution */}
//             <RiskDistribution clauses={result.clauses} />

//             {/* Download */}
//             <button
//               onClick={downloadReport}
//               className="mb-12 px-6 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
//             >
//               Download PDF Report
//             </button>

//             {/* Missing Clauses */}
//             <SectionTitle title="Missing Critical Clauses" />

//             {result.missing_clauses.length > 0 ? (
//               <div className="mb-12 flex flex-wrap gap-3">
//                 {result.missing_clauses.map((c: string, i: number) => (
//                   <span
//                     key={i}
//                     className="px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold"
//                   >
//                     {c}
//                   </span>
//                 ))}
//               </div>
//             ) : (
//               <div className="mb-12 text-green-700 font-medium">
//                 ✅ No critical clauses missing
//               </div>
//             )}

//             {/* Clause Cards */}
//             <SectionTitle title="Clause Risk Analysis" />

//             <div className="space-y-6">
//               {result.clauses.map((c: any, i: number) => (
//                 <ClauseCard key={i} clause={c} />
//               ))}
//             </div>

//           </div>
//         )}
//       </div>
//     </main>
//   )
// }


'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Activity,
  Pill,
  Dumbbell,
  Apple,
  TestTube,
  Brain,
  Loader,
  CheckCircle,
  AlertCircle,
  X,
  Download,
  Share2,
  Heart,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface AnalysisResult {
  condition?: string;
  medications?: Array<{ name: string; dosage: string; timing: string }>;
  vitamins?: Array<{ name: string; dosage: string; benefits: string }>;
  exercises?: Array<{ type: string; duration: string; frequency: string }>;
  diet?: { recommendations: string[]; avoid: string[] };
  tests?: Array<{ name: string; frequency: string }>;
  summary?: string;
  healthScore?: number;
}

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'medications' | 'vitamins' | 'exercises' | 'diet' | 'tests'
  >('medications');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    } else if (selectedFile.type === 'application/pdf') {
      setPreview('pdf');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const analyzeFile = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      // Simulate API call to analyze file
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Mock result based on common conditions
      const mockResults: AnalysisResult[] = [
        {
          condition: 'Type 2 Diabetes',
          healthScore: 72,
          summary:
            'Your report indicates elevated blood glucose levels consistent with Type 2 Diabetes. HbA1c: 7.8%. Fasting glucose: 145 mg/dL.',
          medications: [
            { name: 'Metformin', dosage: '500mg twice daily', timing: 'With breakfast and dinner' },
            { name: 'Glipizide', dosage: '5mg daily', timing: '30 minutes before breakfast' },
          ],
          vitamins: [
            { name: 'Vitamin D3', dosage: '2000 IU daily', benefits: 'Improves insulin sensitivity' },
            { name: 'Vitamin B12', dosage: '1000 mcg daily', benefits: 'Prevents neuropathy' },
            { name: 'Magnesium', dosage: '400mg daily', benefits: 'Regulates blood sugar' },
          ],
          exercises: [
            {
              type: 'Brisk Walking',
              duration: '30 minutes',
              frequency: '5 days per week',
            },
            {
              type: 'Resistance Training',
              duration: '20 minutes',
              frequency: '3 days per week',
            },
          ],
          diet: {
            recommendations: [
              'Low glycemic index foods',
              'High fiber diet (25-30g daily)',
              'Lean proteins',
              'Regular meal timing',
            ],
            avoid: ['Sugary drinks', 'White bread', 'Fried foods', 'Processed snacks'],
          },
          tests: [
            { name: 'HbA1c', frequency: 'Every 3 months' },
            { name: 'Fasting Blood Glucose', frequency: 'Daily' },
            { name: 'Lipid Profile', frequency: 'Every 6 months' },
          ],
        },
        {
          condition: 'Hypertension',
          healthScore: 68,
          summary:
            'Your blood pressure readings show Stage 2 Hypertension. Average BP: 152/96 mmHg.',
          medications: [
            { name: 'Lisinopril', dosage: '10mg daily', timing: 'Morning' },
            { name: 'Amlodipine', dosage: '5mg daily', timing: 'Evening' },
          ],
          vitamins: [
            { name: 'Magnesium', dosage: '500mg daily', benefits: 'Relaxes blood vessels' },
            { name: 'Potassium', dosage: '4700mg daily', benefits: 'Balances sodium' },
            { name: 'Coenzyme Q10', dosage: '200mg daily', benefits: 'Supports heart health' },
          ],
          exercises: [
            { type: 'Swimming', duration: '30 minutes', frequency: '5 days per week' },
            { type: 'Yoga', duration: '20 minutes', frequency: 'Daily' },
          ],
          diet: {
            recommendations: [
              'DASH diet',
              'Low sodium (< 2300mg/day)',
              'High potassium foods',
              'Whole grains',
            ],
            avoid: ['High sodium foods', 'Processed meats', 'Fast food', 'Excessive alcohol'],
          },
          tests: [
            { name: 'Blood Pressure', frequency: 'Daily at home' },
            { name: 'ECG', frequency: 'Annually' },
          ],
        },
      ];

      setResult(mockResults[Math.floor(Math.random() * mockResults.length)]);
      setProgress(100);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <motion.div
        className="fixed inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 px-6 py-4 md:px-12"
      >
        <div className="glass rounded-2xl px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.button>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">MediAI Dashboard</span>
          </div>

          <div className="w-24"></div>
        </div>
      </motion.header>

      <div className="relative z-10 px-6 py-12 md:px-12 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Upload Section */}
              <div className="text-center mb-12">
                <motion.h1
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl md:text-5xl font-display font-bold mb-4"
                >
                  Upload Your <span className="gradient-text">Medical Report</span>
                </motion.h1>
                <p className="text-xl text-gray-300">
                  Get instant AI-powered analysis and personalized health recommendations
                </p>
              </div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`upload-zone ${
                  dragActive ? 'drag-over' : ''
                } rounded-3xl p-12 text-center glass cursor-pointer transition-all`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {!file ? (
                  <>
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6"
                    >
                      <Upload className="w-12 h-12 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4">Drop your file here</h3>
                    <p className="text-gray-400 mb-6">
                      or click to browse (PDF, JPG, PNG supported)
                    </p>
                    <div className="flex justify-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        <span>PDF Reports</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        <span>Image Scans</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-6"
                  >
                    {preview && preview !== 'pdf' ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-w-md max-h-96 mx-auto rounded-xl shadow-2xl"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto">
                        <FileText className="w-16 h-16 text-white" />
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-4">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <span className="text-xl font-semibold">{file.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          setPreview('');
                        }}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {file && !isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16, 185, 129, 0.6)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={analyzeFile}
                    className="px-12 py-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold text-xl flex items-center gap-3 mx-auto neon-button shadow-2xl"
                  >
                    <Brain className="w-6 h-6" />
                    Analyze with AI
                  </motion.button>
                </motion.div>
              )}

              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-3xl p-12 text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6"
                  >
                    <Brain className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">Analyzing Your Report...</h3>
                  <p className="text-gray-400 mb-6">
                    Our AI is examining your medical data using advanced NLP and computer vision
                  </p>
                  <div className="max-w-md mx-auto">
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{progress}% Complete</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Results Header */}
              <div className="glass rounded-3xl p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                      <h2 className="text-3xl font-display font-bold">Analysis Complete</h2>
                    </div>
                    <p className="text-xl text-gray-300">{result.condition}</p>
                    <p className="text-gray-400 mt-2">{result.summary}</p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-5xl font-bold gradient-text">{result.healthScore}</div>
                    <div className="text-sm text-gray-400">Health Score</div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 glass rounded-xl hover:bg-purple-500/20 transition-colors"
                      >
                        <Download className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 glass rounded-xl hover:bg-purple-500/20 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="glass rounded-2xl p-2 flex gap-2 overflow-x-auto">
                {[
                  { id: 'medications', icon: Pill, label: 'Medications' },
                  { id: 'vitamins', icon: Activity, label: 'Vitamins' },
                  { id: 'exercises', icon: Dumbbell, label: 'Exercises' },
                  { id: 'diet', icon: Apple, label: 'Diet' },
                  { id: 'tests', icon: TestTube, label: 'Tests' },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 min-w-max px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass rounded-3xl p-8"
                >
                  {activeTab === 'medications' && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold mb-6">Recommended Medications</h3>
                      {result.medications?.map((med, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="medical-card rounded-xl p-6 hover-lift"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                              <Pill className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold mb-2">{med.name}</h4>
                              <div className="space-y-2 text-gray-300">
                                <p>
                                  <span className="text-gray-500">Dosage:</span> {med.dosage}
                                </p>
                                <p>
                                  <span className="text-gray-500">Timing:</span> {med.timing}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'vitamins' && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold mb-6">Vitamins & Supplements</h3>
                      {result.vitamins?.map((vitamin, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="medical-card rounded-xl p-6 hover-lift"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                              <Activity className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold mb-2">{vitamin.name}</h4>
                              <div className="space-y-2 text-gray-300">
                                <p>
                                  <span className="text-gray-500">Dosage:</span> {vitamin.dosage}
                                </p>
                                <p>
                                  <span className="text-gray-500">Benefits:</span>{' '}
                                  {vitamin.benefits}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'exercises' && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold mb-6">Exercise Plan</h3>
                      {result.exercises?.map((exercise, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="medical-card rounded-xl p-6 hover-lift"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                              <Dumbbell className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold mb-2">{exercise.type}</h4>
                              <div className="space-y-2 text-gray-300">
                                <p>
                                  <span className="text-gray-500">Duration:</span>{' '}
                                  {exercise.duration}
                                </p>
                                <p>
                                  <span className="text-gray-500">Frequency:</span>{' '}
                                  {exercise.frequency}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'diet' && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          Recommended Foods
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {result.diet?.recommendations.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="medical-card rounded-xl p-4 flex items-center gap-3"
                            >
                              <Apple className="w-5 h-5 text-green-400 flex-shrink-0" />
                              <span>{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-white" />
                          </div>
                          Foods to Avoid
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {result.diet?.avoid.map((item, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="medical-card rounded-xl p-4 flex items-center gap-3"
                            >
                              <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                              <span>{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'tests' && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold mb-6">Recommended Tests</h3>
                      {result.tests?.map((test, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="medical-card rounded-xl p-6 hover-lift"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                              <TestTube className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold mb-2">{test.name}</h4>
                              <p className="text-gray-300">
                                <span className="text-gray-500">Frequency:</span> {test.frequency}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* New Analysis Button */}
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setResult(null);
                    setFile(null);
                    setPreview('');
                  }}
                  className="px-8 py-4 glass rounded-xl font-semibold flex items-center gap-3 mx-auto border border-purple-500/30 hover:border-purple-500/60 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Analyze Another Report
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
