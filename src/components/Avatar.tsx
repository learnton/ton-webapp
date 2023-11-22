function Avatar({ src }: { src: string }) {
  return (
    <div className="w-24 rounded-full">
      <img src={src} />
    </div>
  );
}

export default Avatar;
