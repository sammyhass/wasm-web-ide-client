export default function Container(
  props: React.PropsWithChildren<unknown> & {
    title: string;
    className?: string;
  }
) {
  return (
    <div
      className={`max-w-[80%] mx-auto mt-10 ${
        props.className ? props.className : ''
      }`}
    >
      <h1 className="text-4xl font-bold">{props.title}</h1>
      <hr className="my-5 bg-base-content" />
      {props.children}
    </div>
  );
}
