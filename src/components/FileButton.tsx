import type { InputHTMLAttributes, ReactNode } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
  children?: ReactNode
}

export default function FileButton({ className, children, ...props }: Props) {
  return (
    <label className={`Button ${className || ""}`}>
      { children }
      <input type="file" className="layout-visually-hidden" {...props} />
    </label>
  )
}
