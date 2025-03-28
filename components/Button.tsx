import { forwardRef } from "react"
import { twMerge } from "tailwind-merge"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, disabled, type = 'button', ...props }, ref) => {
  return (
    <button type={type} className={twMerge('w-full cursor-pointer rounded-full bg-green-500 border border-transparent px-3 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-black font-bold transition', className)} disabled={disabled} ref={ref} {...props}>
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button