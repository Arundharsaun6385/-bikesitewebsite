import { useEffect, useState } from "react";

// Minimal Slider component to satisfy imports from SidebarFilter
// Props:
// - value: Array or number (SidebarFilter passes an array like [2000])
// - onValueChange: callback that receives an array ([newValue])
// - min, max, step: numeric range props
export function Slider({ value = [0], onValueChange = () => {}, min = 0, max = 100, step = 1 }) {
  const initial = Array.isArray(value) ? value[0] : value;
  const [val, setVal] = useState(initial);

  useEffect(() => {
    const v = Array.isArray(value) ? value[0] : value;
    setVal(v);
  }, [value]);

  const handleChange = (e) => {
    const num = Number(e.target.value);
    setVal(num);
    // keep the same API shape as some sliders (array)
    try {
      onValueChange([num]);
    } catch (err) {
      // guard: if parent expects a number, call with number
      onValueChange(num);
    }
  };

  return (
    <div className="w-full">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={handleChange}
        className="w-full"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={val}
      />
      <div className="flex justify-between text-sm text-gray-500 mt-1">
        <span>₹{Number(min).toLocaleString()}</span>
        <span>₹{Number(val).toLocaleString()}</span>
        <span>₹{Number(max).toLocaleString()}</span>
      </div>
    </div>
  );
}

export default Slider;
