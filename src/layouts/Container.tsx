export default function Container(
  props: React.PropsWithChildren<unknown> & {
    title?: string;
    className?: string;
  }
) {
  return (
    <div
      className={`mx-auto mt-10 max-w-[80%] ${
        props.className ? props.className : ""
      }`}
    >
      {props.title && (
        <>
          <h1 className="text-4xl font-bold">{props.title}</h1>
          <hr className="my-5 bg-base-content" />
        </>
      )}
      {props.children}
    </div>
  );
}
