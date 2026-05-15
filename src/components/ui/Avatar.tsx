import React from 'react';

interface AvatarProps {
  initials: string;
  name?: string;
  colored?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const getColorByInitial = (initial: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-cyan-500',
  ];
  return colors[initial.charCodeAt(0) % colors.length];
};

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  name,
  colored = false,
  size = 'md',
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const bgColor = colored ? getColorByInitial(initials) : 'bg-primary-light';

  return (
    <div
      className={`${sizes[size]} ${bgColor} rounded-full flex items-center justify-center font-semibold ${
        colored ? 'text-white' : 'text-primary'
      }`}
      title={name}
    >
      {initials.toUpperCase()}
    </div>
  );
};
