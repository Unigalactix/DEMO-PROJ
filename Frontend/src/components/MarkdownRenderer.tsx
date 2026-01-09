import ReactMarkdown from 'react-markdown';
import './MarkdownRenderer.css';

interface Props {
    content: string;
}

export function MarkdownRenderer({ content }: Props) {
    return (
        <div className="markdown-content">
            <ReactMarkdown
                components={{
                    blockquote: ({ ...props }) => <blockquote className="custom-blockquote" {...props} />,
                    a: ({ ...props }) => <a className="custom-link" {...props} />,
                    h1: ({ ...props }) => <h1 className="custom-h1" {...props} />,
                    h2: ({ ...props }) => <h2 className="custom-h2" {...props} />,
                    h3: ({ ...props }) => <h3 className="custom-h3" {...props} />,
                    ul: ({ ...props }) => <ul className="custom-ul" {...props} />,
                    ol: ({ ...props }) => <ol className="custom-ol" {...props} />,
                    code: ({ ...props }) => <code className="custom-code" {...props} />
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
