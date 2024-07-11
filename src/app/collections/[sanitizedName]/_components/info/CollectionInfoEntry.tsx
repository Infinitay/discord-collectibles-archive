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
		<div className="mb-6 flex items-center">
			<div className="flex w-1/2 justify-end pr-4">
				<span className="font-bold">{props.name}</span>
			</div>
			{props.value && (
				<div className="flex w-1/2 pl-3">
					<span className="">{props.value}</span>
				</div>
			)}
			{props.colors && (
				<div className="flex w-1/2">
					<CollectionColors colors={props.colors} />
				</div>
			)}
		</div>
	);
}
