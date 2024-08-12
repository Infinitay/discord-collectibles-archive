"use client";
import { useState, useEffect, useRef } from "react";
import { type Product } from "~/types/CollectiblesCategories";
import { CollectionUtils } from "~/utils/CollectionUtils";

export default function CollectionProfileEffect(props: { profileEffectProduct: Product; forceRender?: number }) {
	const profileEffect = CollectionUtils.getProfileEffect(props.profileEffectProduct);

	// Track the effect to render by index
	const [renderIndices, setRenderIndices] = useState<Set<number>>(new Set());
	const [forceRender, setForceRender] = useState(props.forceRender ?? Date.now());
	// Create references to track the schedulers for rendering the effects. Use an array so we can just reset the entire animation
	// Need to create two different refs for the different schedulers
	const timeoutIDsRef = useRef<NodeJS.Timeout[]>([]);
	const intervalIDsRef = useRef<NodeJS.Timeout[]>([]);

	// Clear all the schedulers to stop them. Make sure to run the respective clear function to stop the scheduler
	const clearSchedulers = () => {
		timeoutIDsRef.current.forEach((scheduler) => clearTimeout(scheduler));
		timeoutIDsRef.current = [];
		intervalIDsRef.current.forEach((scheduler) => clearInterval(scheduler));
		intervalIDsRef.current = [];
	};

	useEffect(() => {
		if (props.forceRender === undefined) return;
		if (!profileEffect) return;
		setForceRender(props.forceRender);
	}, [props.forceRender, profileEffect]);

	useEffect(() => {
		if (!profileEffect) return;
		// Remove all the render indices clearing them
		setRenderIndices(new Set());

		profileEffect.effects.forEach((effect, index) => {
			const handleEffectRendering = () => {
				// Always add the index to the renderIndices and then we will determine if we need to remove it
				setRenderIndices((prevIndices) => new Set([...prevIndices, index]));

				if (effect.loop) {
					// It loops so we have to use a setInterval to keep it rendering by keep adding it
					const intervalID = setInterval(() => {
						setRenderIndices((prevIndices) => new Set([...prevIndices, index]));
					}, effect.loopDelay + effect.duration); // Queue the next start time
					intervalIDsRef.current.push(intervalID);
				} else {
					// Doesn't loop so only show it once (remove it after the duration)
					const timeoutID = setTimeout(() => {
						setRenderIndices((prevIndices) => {
							prevIndices.delete(index);
							return new Set(prevIndices);
						});
					}, effect.duration);
					timeoutIDsRef.current.push(timeoutID);
				}
			};
			const timeoutID = setTimeout(handleEffectRendering, effect.start);
			timeoutIDsRef.current.push(timeoutID);
		});

		return () => {
			clearSchedulers();
		};
	}, [forceRender, profileEffect]);

	if (!profileEffect) return null;

	return profileEffect.effects.map((effect, index) => {
		if (!renderIndices.has(index)) return null;
		const effectLayerName = effect.src.split("/")[effect.src.split("/").length - 1]?.replace(".png", "");
		// Add forceRender to the key name to force re-render the effect otherwise it won't re-render the img
		const keyName = `${profileEffect.title}-${effectLayerName}-${forceRender}`;
		return (
			<img
				key={keyName}
				src={`${effect.src}?t=${forceRender}`}
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
