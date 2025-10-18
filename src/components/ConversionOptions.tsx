'use client';

import { ConversionOptions } from '@/utils/svgToReact';

interface ConversionOptionsProps {
  options: ConversionOptions;
  onOptionsChange: (options: ConversionOptions) => void;
}

export default function ConversionOptionsComponent({
  options,
  onOptionsChange,
}: ConversionOptionsProps) {
  const handleChange = (key: keyof ConversionOptions, value: string | boolean) => {
    onOptionsChange({
      ...options,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Conversion Options
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Component Name
        </label>
        <input
          type="text"
          value={options.componentName || 'SvgIcon'}
          onChange={(e) => handleChange('componentName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="SvgIcon"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.optimize !== false}
            onChange={(e) => handleChange('optimize', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Optimize SVG
          </span>
        </label>
        <p className="ml-6 text-xs text-gray-500 dark:text-gray-400">
          Remove unnecessary SVG attributes and optimize file size
        </p>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.typescript !== false}
            onChange={(e) => handleChange('typescript', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            TypeScript
          </span>
        </label>
        <p className="ml-6 text-xs text-gray-500 dark:text-gray-400">
          Generate TypeScript component with type definitions
        </p>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Available Props in Generated Component:
        </h4>
        <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <li className="flex items-center gap-2">
            <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">size</code>
            <span>- Control icon size</span>
          </li>
          <li className="flex items-center gap-2">
            <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">color</code>
            <span>- Change icon color</span>
          </li>
          <li className="flex items-center gap-2">
            <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">className</code>
            <span>- Add custom CSS classes</span>
          </li>
          <li className="flex items-center gap-2">
            <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">...props</code>
            <span>- All standard SVG props</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
