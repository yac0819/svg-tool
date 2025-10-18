export interface ConversionOptions {
  optimize?: boolean;
  typescript?: boolean;
  componentName?: string;
  native?: boolean;
}

export interface ConversionResult {
  code: string;
  error?: string;
}

export async function convertSvgToReact(
  svgContent: string,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  try {
    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        svgContent,
        options,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        code: '',
        error: data.error || 'Conversion failed',
      };
    }

    return { code: data.code };
  } catch (error) {
    return {
      code: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
