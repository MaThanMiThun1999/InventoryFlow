export const Input = ({
  icon: Icon,
  classNames = 'relative mb-6',
  classNamesForInputTag = 'h-12 pl-10 w-full',
  ...props
}) => {
  return (
    <div className={`relative ${classNames}`}>
      <div className="absolute top-0 flex w-full justify-center">
        <div className="h-[1px] animate-border-width rounded-full bg-gradient-to-r from-[rgba(17,17,17,0)] via-white to-[rgba(17,17,17,0)] transition-all duration-1000" />
      </div>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-text-subdued" />
      </div>
      <input
        className={`block text-dark-text rounded-md border border-dark-background bg-dark-background placeholder-shown:pl-10 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-dark-primary focus:ring-offset-1 duration-fast focus:ring-offset-dark-primary ${classNamesForInputTag}`}
        {...props}
      />
    </div>
  );
};
export default Input;
