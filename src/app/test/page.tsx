'use client';

import { useState } from 'react';

export default function TestPage() {
  const [componentCode, setComponentCode] = useState('');
  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState('');

  // Test props
  const [size, setSize] = useState(64);
  const [color, setColor] = useState('#000000');
  const [className, setClassName] = useState('');

  const extractAndRenderSvg = (code: string) => {
    try {
      setError('');

      // Extract SVG content from the component code
      const svgMatch = code.match(/<svg[\s\S]*?<\/svg>/);

      if (!svgMatch) {
        setError('No SVG element found in the code');
        return;
      }

      let svg = svgMatch[0];

      // Replace the prop placeholders with actual values
      svg = svg.replace(/width=\{size\}/g, `width="${size}"`);
      svg = svg.replace(/height=\{size\}/g, `height="${size}"`);
      svg = svg.replace(/fill=\{color \|\| "currentColor"\}/g, `fill="${color}"`);
      svg = svg.replace(/className=\{className\}/g, `class="${className}"`);
      svg = svg.replace(/\{\.\.\.props\}/g, '');

      setSvgContent(svg);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse component');
    }
  };

  const handleCodeChange = (code: string) => {
    setComponentCode(code);
    if (code.trim()) {
      extractAndRenderSvg(code);
    } else {
      setSvgContent('');
    }
  };

  const handleTest = () => {
    if (componentCode) {
      extractAndRenderSvg(componentCode);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Component Test Playground
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Paste your generated component code and test it with different props
              </p>
            </div>
            <a
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              ← Back to Converter
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Code Input */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Paste Component Code
              </h2>
              <textarea
                value={componentCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Paste your generated React component code here..."
                className="w-full h-96 px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />

              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>Error:</strong> {error}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Test Props
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Size: {size}px
                  </label>
                  <input
                    type="range"
                    min="16"
                    max="256"
                    value={size}
                    onChange={(e) => {
                      setSize(Number(e.target.value));
                      handleTest();
                    }}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => {
                        setColor(e.target.value);
                        handleTest();
                      }}
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => {
                        setColor(e.target.value);
                        handleTest();
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    className (optional)
                  </label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => {
                      setClassName(e.target.value);
                      handleTest();
                    }}
                    placeholder="e.g., custom-icon rotate-45"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <button
                  onClick={handleTest}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Preview
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Live Preview
            </h2>

            {svgContent ? (
              <div className="space-y-6">
                <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-12 min-h-[400px]">
                  <div
                    className="transition-all duration-200"
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                  />
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Usage Example:
                  </h4>
                  <pre className="text-xs text-blue-800 dark:text-blue-200 font-mono overflow-x-auto">
{`<SvgIcon
  size={${size}}
  color="${color}"${className ? `\n  className="${className}"` : ''}
/>`}
                  </pre>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Current Props:
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <li><code className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">size</code>: {size}px</li>
                    <li><code className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">color</code>: {color}</li>
                    {className && (
                      <li><code className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">className</code>: {className}</li>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[400px] text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  <p>Paste your component code to see the preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
