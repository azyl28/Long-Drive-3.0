
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderContent = () => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: React.ReactNode[] = [];

    const closeList = (key: string) => {
      if (inList) {
        elements.push(<ul key={key} className="list-disc list-inside pl-4 mt-2 mb-4 space-y-1">{listItems}</ul>);
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, index) => {
      line = line.trim();
      if (line.startsWith('**') && line.endsWith('**')) {
        closeList(`ul-end-${index}`);
        elements.push(<h3 key={index} className="text-lg font-semibold my-2 text-primary">{line.substring(2, line.length - 2)}</h3>);
      } else if (line.startsWith('* ')) {
        if (!inList) {
          inList = true;
        }
        listItems.push(<li key={index} className="mb-1">{line.substring(2)}</li>);
      } else if (line) {
        closeList(`ul-end-${index}`);
        elements.push(<p key={index} className="my-1">{line}</p>);
      }
    });

    closeList('ul-end-final');

    return elements;
  };

  return <div className="prose prose-sm dark:prose-invert max-w-none">{renderContent()}</div>;
};

export default MarkdownRenderer;
