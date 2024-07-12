export interface ProfileEffect {
	type: number;
	id: string;
	sku_id: string;
	title: string;
	description: string;
	accessibilityLabel: string;
	animationType: number;
	thumbnailPreviewSrc: string;
	reducedMotionSrc: string;
	effects: Effect[];
	staticFrameSrc?: string;
}

export interface Effect {
	src: string;
	loop: boolean;
	height: number;
	width: number;
	duration: number;
	start: number;
	loopDelay: number;
	position: Position;
	zIndex: number;
}

export interface Position {
	x: number;
	y: number;
}
