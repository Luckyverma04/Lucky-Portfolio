const BallCanvas = ({ icon, name = "Technology" }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img
        src={icon}
        alt={`${name} technology`}
        title={name}
        width={112}
        height={112}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default BallCanvas;