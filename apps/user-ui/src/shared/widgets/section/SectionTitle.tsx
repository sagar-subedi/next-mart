import { Sparkles } from 'lucide-react';

interface Props {
  title: string;
}

const SectionTitle = ({ title }: Props) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-gradient-to-b from-brand-primary-500 to-brand-primary-600 rounded-full"></div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 relative">
          {title}
          <div className="absolute -bottom-1 left-0 w-20 h-1 bg-gradient-to-r from-brand-primary-500 to-transparent rounded-full"></div>
        </h2>
      </div>
      <Sparkles className="w-5 h-5 text-brand-primary-500 flex-shrink-0" />
    </div>
  );
};

export default SectionTitle;
