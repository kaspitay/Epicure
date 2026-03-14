import React from 'react';

const RecipeInput = ({
    label,
    type = 'text',
    value,
    onChange,
    error,
    options,
    placeholder,
    multiple,
    accept,
    className,
}) => {
    const inputClassName = `w-full border rounded-md py-2 px-4 bg-transparent text-[#CCCCCC] placeholder-[#CCCCCC] focus:outline-none focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`;

    return (
        <div className={`mb-4 ${className}`}>
            {label && <label className="block text-[#D9D9D9] text-lg mb-2">{label}</label>}
            {type === 'select' ? (
                <select
                    value={value}
                    onChange={onChange}
                    className={inputClassName}
                >
                    <option value="" disabled className="text-gray-400">{placeholder || 'Select...'}</option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value} className="text-gray-700">
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`${inputClassName} h-full`}
                    required
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    multiple={multiple}
                    accept={accept}
                    className={inputClassName}
                    required
                    onKeyDown={(evt) => {
                        if (type === 'number' && ["e", "E", "+", "-"].includes(evt.key)) {
                            evt.preventDefault();                        
                        }
                    }}
                />
            )}
            {error && (
                <span className="block text-red-500 text-sm mt-1 bg-red-100 border border-red-400 rounded-md py-1 px-3">
                    {error}
                </span>
            )}
        </div>
    );
};

export default RecipeInput;