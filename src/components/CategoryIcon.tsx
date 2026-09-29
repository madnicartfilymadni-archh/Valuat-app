import React from 'react';
import { 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  Smartphone, 
  CheckSquare, 
  Film, 
  Share2, 
  Wrench,
  Grid
} from 'lucide-react';
import { CategoryId } from '../types';

interface CategoryIconProps {
  categoryId?: CategoryId | 'all';
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ categoryId, className = '', size = 18 }) => {
  switch (categoryId) {
    case 'ai-tools':
      return <Sparkles size={size} className={className} />;
    case 'video-editing':
      return <Video size={size} className={className} />;
    case 'photo-editing':
      return <ImageIcon size={size} className={className} />;
    case 'android-apps':
      return <Smartphone size={size} className={className} />;
    case 'productivity':
      return <CheckSquare size={size} className={className} />;
    case 'entertainment':
      return <Film size={size} className={className} />;
    case 'social-media':
      return <Share2 size={size} className={className} />;
    case 'other-tools':
      return <Wrench size={size} className={className} />;
    case 'all':
    default:
      return <Grid size={size} className={className} />;
  }
};
