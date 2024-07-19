interface CollectionEffectInfoEntryProps {
	name: string;
	value: string | number | boolean;
}

export default function CollectionEffectInfoEntry(props: CollectionEffectInfoEntryProps) {
	return (
		<div className="mb-6 flex items-start">
			<div className="flex w-[140px] min-w-[140px] pr-4">
				<span className="overflow-hidden break-words font-bold">{props.name}</span>
			</div>
			<div className="flex-grow">
				<span className="">{props.value}</span>
			</div>
		</div>
	);
}
