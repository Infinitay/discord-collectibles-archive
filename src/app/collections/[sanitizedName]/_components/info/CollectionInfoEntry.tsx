import CollectionColors from "./CollectionColors";

interface CollectionInfoEntry {
	name: string;
}
interface CollectionInfoEntryValuePrimative extends CollectionInfoEntry {
	value: string | number | boolean;
	colors?: never;
}

interface CollectionInfoEntryValueColors extends CollectionInfoEntry {
	value?: never;
	colors: number[];
}

type CollectionInfoEntryProps = CollectionInfoEntryValuePrimative | CollectionInfoEntryValueColors;

export default function CollectionInfoEntry(props: CollectionInfoEntryProps) {
	return (
		<div className="flex items-start">
			<div className="flex w-[140px] min-w-[140px] pr-4">
				<span className="overflow-hidden break-words font-bold">{props.name}</span>
			</div>
			{props.value && (
				<div className="flex-grow">
					<span className="">{props.value}</span>
				</div>
			)}
			{props.colors && <div className="flex-grow">{props.colors.length > 0 ? <CollectionColors colors={props.colors} /> : <>No color found</>}</div>}
		</div>
	);
}
