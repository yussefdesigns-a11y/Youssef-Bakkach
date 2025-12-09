import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className, 
  ...props 
}) => {
  const baseStyles = "font-bold py-3 px-6 rounded-2xl uppercase tracking-widest transition-transform btn-press select-none text-sm md:text-base";
  
  const variants = {
    primary: "bg-brand-green text-white shadow-[0_4px_0_0_#46A302] hover:bg-[#61E002]",
    secondary: "bg-brand-blue text-white shadow-[0_4px_0_0_#1899D6] hover:bg-brand-blue-dark",
    danger: "bg-brand-red text-white shadow-[0_4px_0_0_#EA2B2B] hover:bg-brand-red-dark",
    outline: "bg-transparent border-2 border-gray-200 text-gray-500 shadow-[0_4px_0_0_#E5E5E5] hover:bg-gray-50",
    ghost: "bg-transparent text-brand-blue hover:bg-gray-50 shadow-none",
  };

  return (
    <button
      className={twMerge(
        baseStyles,
        variants[variant],
        fullWidth ? "w-full" : "",
        props.disabled && "opacity-50 cursor-not-allowed shadow-none transform translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};