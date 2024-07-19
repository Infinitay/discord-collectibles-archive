"use client";
import { useState, useEffect } from "react";
import { Product } from "~/types/CollectiblesCategories";
import { CollectionUtils } from "~/utils/CollectionUtils";

export default function CollectionProfileEffect(props: { profileEffectProduct: Product; forceRender?: boolean }) {
	const profileEffect = CollectionUtils.getProfileEffect(props.profileEffectProduct);
	if (!profileEffect) return null;

	// Track the effect to render by index
	const [renderIndices, setRenderIndices] = useState<Set<number>>(new Set());
	const [_forceRender, setForceRender] = useState(props.forceRender ?? false);

	useEffect(() => {
		// Initial state for the forceRender prop should be undefined, so to avoid the useEffect calls, ignore undefined
		if (props.forceRender === undefined) return;
		setForceRender(!props.forceRender);
	}, [props.forceRender]);

	useEffect(() => {
		profileEffect.effects.forEach((effect, index) => {
			const handleEffectRendering = () => {
				// Always add the index to the renderIndices and then we will determine if we need to remove it
				setRenderIndices((prevIndices) => new Set([...prevIndices, index]));

				if (effect.loop) {
					// It loops so we have to use a setInterval to keep it rendering by keep adding it
					setInterval(() => {
						setRenderIndices((prevIndices) => new Set([...prevIndices, index]));
					}, effect.loopDelay + effect.duration); // Queue the next start time
				} else {
					// Doesn't loop so only show it once (remove it after the duration)
					setTimeout(() => {
						setRenderIndices((prevIndices) => {
							prevIndices.delete(index);
							return new Set(prevIndices);
						});
					}, effect.duration);
				}
			};
			setTimeout(handleEffectRendering, effect.start);
		});
	}, [profileEffect.effects, _forceRender]);
	return profileEffect.effects.map((effect, index) => {
		if (!renderIndices.has(index)) return null;
		const effectLayerName = effect.src.split("/")[effect.src.split("/").length - 1]?.replace(".png", "");
		const keyName = `${profileEffect.title}-${effectLayerName}`;
		return (
			<img
				key={keyName}
				src={effect.src}
				width={effect.width}
				height={effect.height}
				alt={profileEffect.accessibilityLabel}
				style={{
					position: index === 0 ? "relative" : "absolute",
					top: effect.position.y,
					left: effect.position.x,
					zIndex: effect.zIndex,
					width: `${effect.width}px`,
					height: `${effect.height}px`
				}}
			/>
		);
	});
}
