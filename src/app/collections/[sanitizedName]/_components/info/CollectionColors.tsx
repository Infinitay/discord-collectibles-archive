export default function CollectionColors(props: { className?: string; colors: number[] }) {
	return (
		<div>
			<div id="colors-container" className={`flex flex-wrap gap-5 ${props.className ? `${props.className}` : ""}`}>
				{props.colors
					.map((color) => color.toString(16).padStart(6, "0").toUpperCase())
					.map((colorHex) => (
						<div id={`color-${colorHex}`} key={colorHex} className="flex w-fit flex-col items-center">
							<div className="mb-1 h-12 w-[60px] rounded-md" style={{ backgroundColor: `#${colorHex}` }}></div>
							<span className="w-20 text-center">#{colorHex}</span>
						</div>
					))}
			</div>
		</div>
	);
}