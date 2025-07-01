const SliderWithLabels = ({ min, max, value, onChange, labels }) => {
  const getLabelPosition = (labelValue) => {
    const totalOptions = max - min;
    const position = ((labelValue - min) / totalOptions) * 100;
    return position + "%";
  };

  return (
    <div
      style={{
        position: "relative",
        width: "200px",
        marginBottom: "20px",
        gap: "5px",
        justifyContent: "center",
      }}
    >
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        style={{ width: "100%" }}
      />
      {Object.entries(labels).map(([key, label]) => (
        <div
          key={key}
          style={{
            position: "absolute",
            left: getLabelPosition(key),
            transform: "translateX(-50%)",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
};
export default SliderWithLabels;
