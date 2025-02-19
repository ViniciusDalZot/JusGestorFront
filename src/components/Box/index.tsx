export const Box = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props}>
      {props.children}
    </div>
  )
}