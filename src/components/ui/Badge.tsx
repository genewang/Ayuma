import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Badge: React.FC<BadgeProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export { Badge }
