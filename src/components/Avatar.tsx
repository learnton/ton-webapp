interface Props {
  src?: string;
  [property: string]: unknown;
}

function Avatar({ src, ...props }: Props) {
  return (
    <div className="avatar" {...props}>
      <div className="rounded-full w-24">
        <img src={src} />
      </div>
    </div>
  );
}

export default Avatar;
