import { NextRequest, NextResponse } from 'next/server';
import { transform } from '@svgr/core';
import { optimize } from 'svgo';
import svgoPlugin from '@svgr/plugin-svgo';
import jsxPlugin from '@svgr/plugin-jsx';
import prettierPlugin from '@svgr/plugin-prettier';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { svgContent, options = {} } = body;

    if (!svgContent) {
      return NextResponse.json(
        { error: 'SVG content is required' },
        { status: 400 }
      );
    }

    const {
      optimize: shouldOptimize = true,
      typescript = true,
      componentName = 'SvgIcon',
    } = options;

    let processedSvg = svgContent;

    // Optimize SVG if requested
    if (shouldOptimize) {
      const optimized = optimize(svgContent, {
        plugins: ['preset-default', 'removeXMLNS'],
      });
      processedSvg = optimized.data;
    }

    // Transform SVG to React component
    const jsCode = await transform(
      processedSvg,
      {
        icon: true,
        typescript,
        native: false,
        replaceAttrValues: {},
        svgProps: {
          className: '{className}',
        },
        plugins: [svgoPlugin, jsxPlugin, prettierPlugin],
      },
      { componentName }
    );

    // Add props interface for customization
    const propsInterface = typescript
      ? `interface ${componentName}Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

`
      : '';

    // Modify the component to accept custom props
    let modifiedCode = jsCode;

    if (typescript) {
      // Replace the component signature
      modifiedCode = modifiedCode.replace(
        /const\s+(\w+)\s*=\s*\(\s*props:\s*SVGProps<SVGSVGElement>\s*\)/,
        `export const $1 = ({ size, color, className, ...props }: ${componentName}Props)`
      );
      modifiedCode = modifiedCode.replace(
        /function\s+(\w+)\(\s*props:\s*SVGProps<SVGSVGElement>\s*\)/,
        `export function $1({ size, color, className, ...props }: ${componentName}Props)`
      );
    } else {
      modifiedCode = modifiedCode.replace(
        /const\s+(\w+)\s*=\s*\(\s*props\s*\)/,
        'export const $1 = ({ size, color, className, ...props })'
      );
      modifiedCode = modifiedCode.replace(
        /function\s+(\w+)\(\s*props\s*\)/,
        'export function $1({ size, color, className, ...props })'
      );
    }

    // Add size and color prop handling to SVG element
    modifiedCode = modifiedCode.replace(
      /<svg\s+/,
      '<svg width={size} height={size} fill={color || "currentColor"} '
    );

    // Add import for React if needed
    if (!modifiedCode.includes('import')) {
      modifiedCode = `import * as React from 'react';\n${typescript ? `import { SVGProps } from 'react';\n` : ''}\n${modifiedCode}`;
    }

    const finalCode = propsInterface + modifiedCode;

    return NextResponse.json({ code: finalCode });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

