
interface IProps {
  message?: string
  className?: string
}
const FormErrorMessage = ({message, className}: IProps) => {
  return (
    <span className={`${className} text-xs text-red-500`}>{message}</span>
  )
}

export default FormErrorMessage