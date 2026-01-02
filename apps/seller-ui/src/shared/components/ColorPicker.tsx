import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { defaultColors } from '../../utils/constants';
import { Plus } from 'lucide-react';

const ColorPicker = ({ control, errors }: any) => {
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState<string>('#ffffff');

  return (
    <div className="mt-2">
      <label
        htmlFor="colors"
        className="block font-semibold text-slate-800 mb-1"
      >
        Colors
      </label>
      <Controller
        name="colors"
        control={control}
        render={({ field }) => (
          <div className="flex gap-3 flex-wrap">
            {[...defaultColors, ...customColors].map((color) => {
              const isSelected = (field.value || []).includes(color);
              const isLightColor = ['#ffffff', '#ffff00'].includes(color);

              return (
                <button
                  type="button"
                  key={color}
                  onClick={() =>
                    field.onChange(
                      isSelected
                        ? field.value.filter((c: string) => c !== color)
                        : [...(field.value || []), color]
                    )
                  }
                  className={`w-7 h-7 rounded-md my-1 flex items-center justify-center border-2 transition ${isSelected ? 'scale-110 border-slate-900' : 'border-transparent'
                    } ${isLightColor && 'border-slate-300'} ${color === '#000000' && !isSelected && 'border-slate-200'
                    }`}
                  style={{ backgroundColor: color }}
                />
              );
            })}
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-8 h-8 flex rounded-full items-center justify-center border-2 border-slate-300 transition bg-slate-100 hover:bg-slate-200"
            >
              <Plus size={16} className="text-slate-600" />
            </button>
            {/* Color picker */}
          </div>
        )}
      />
      {showColorPicker && (
        <div className="relative flex items-center gap-2">
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-10 h-10 p-0 border-none outline-none cursor-pointer"
          />
          <button
            type="button"
            onClick={() => {
              setCustomColors([...customColors, newColor]);
              setShowColorPicker(false);
            }}
            className="px-3 py-1 bg-brand-primary-600 text-white rounded-md text-sm"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
