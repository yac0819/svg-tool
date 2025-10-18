'use client';

import { useState, useMemo } from 'react';

interface SvgPreviewProps {
  svgContent: string;
}

export default function SvgPreview({ svgContent }: SvgPreviewProps) {
  const [size, setSize] = useState(64);
  const [color, setColor] = useState('#000000');

  // Process SVG to allow dynamic size and color
  const processedSvg = useMemo(() => {
    if (!svgContent) return '';

    let processed = svgContent;

    // Set width and height
    processed = processed.replace(/width="[^"]*"/, `width="${size}"`);
    processed = processed.replace(/height="[^"]*"/, `height="${size}"`);

    // If no width/height attributes, add them
    if (!processed.includes('width=')) {
      processed = processed.replace(/<svg/, `<svg width="${size}" height="${size}"`);
    }

    // Set fill color
    processed = processed.replace(/fill="[^"]*"/g, `fill="${color}"`);

    return processed;
  }, [svgContent, size, color]);

  if (!svgContent) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Upload an SVG file to see the preview</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Live Preview
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Size: {size}px
            </label>
            <input
              type="range"
              min="16"
              max="256"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-16 rounded cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
        <div
          className="transition-all duration-200"
          dangerouslySetInnerHTML={{ __html: processedSvg }}
        />
      </div>
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          <strong>Usage:</strong> The generated component accepts <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">size</code>, <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">color</code>, and <code className="px-1 bg-blue-100 dark:bg-blue-900 rounded">className</code> props
        </p>
      </div>
    </div>
  );
}
