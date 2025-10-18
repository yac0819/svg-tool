'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import CodePreview from '@/components/CodePreview';
import SvgPreview from '@/components/SvgPreview';
import ConversionOptionsComponent from '@/components/ConversionOptions';
import { convertSvgToReact, ConversionOptions } from '@/utils/svgToReact';

export default function Home() {
  const [svgContent, setSvgContent] = useState('');
  const [filename, setFilename] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [error, setError] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [options, setOptions] = useState<ConversionOptions>({
    optimize: true,
    typescript: true,
    componentName: 'SvgIcon',
  });

  const handleFileUpload = (content: string, name: string) => {
    setSvgContent(content);
    setFilename(name);
    setError('');
  };

  useEffect(() => {
    if (!svgContent) {
      setGeneratedCode('');
      return;
    }

    const convertSvg = async () => {
      setIsConverting(true);
      setError('');

      try {
        const result = await convertSvgToReact(svgContent, options);

        if (result.error) {
          setError(result.error);
          setGeneratedCode('');
        } else {
          setGeneratedCode(result.code);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Conversion failed');
        setGeneratedCode('');
      } finally {
        setIsConverting(false);
      }
    };

    convertSvg();
  }, [svgContent, options]);

  const outputFilename = options.typescript
    ? `${options.componentName || 'SvgIcon'}.tsx`
    : `${options.componentName || 'SvgIcon'}.jsx`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                SVG to React Converter
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Transform SVG files into customizable React components with TypeScript support
              </p>
            </div>
            <a
              href="/test"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Test Playground
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload & Options */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Upload SVG
              </h2>
              <FileUpload onFileUpload={handleFileUpload} />
              {filename && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  Uploaded: <span className="font-medium">{filename}</span>
                </p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <ConversionOptionsComponent
                options={options}
                onOptionsChange={setOptions}
              />
            </div>

            {isConverting && (
              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">Converting...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800 p-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}
          </div>

          {/* Middle Column - Code Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 h-full">
              <CodePreview code={generatedCode} filename={outputFilename} />
            </div>
          </div>

          {/* Right Column - Live Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 h-full">
              <SvgPreview svgContent={svgContent} />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Built with Next.js, SVGR, and SVGO
          </p>
        </div>
      </footer>
    </div>
  );
}
