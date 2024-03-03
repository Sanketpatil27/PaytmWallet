
export function InputBox({label, placeholder, onChange}) {
    return <div>
        <div className="text-sm font-medium text-left py-2">
            <label htmlFor={label}> {label} </label>
        </div>

        <input type="text" id={label} onChange={onChange} placeholder={placeholder} className="w-full px-2 py-1 border rounded border-slate-200 focus:outline-none focus:ring-2 focus:ring-gray-300" />
    </div>
}