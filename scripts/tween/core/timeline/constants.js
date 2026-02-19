export const SOCKET_TYPE_SEQUENCE = "tween-sequence";
export const SOCKET_TYPE_SEQUENCE_CANCEL = "tween-sequence-cancel";

export const ErrorPolicy = Object.freeze({
	ABORT: "abort",
	CONTINUE: "continue",
});

export const TimelineStatus = Object.freeze({
	COMPLETED: "completed",
	CANCELLED: "cancelled",
	FAILED: "failed",
});

export const TimelineErrorPhase = Object.freeze({
	BEFORE_ALL: "beforeAll",
	BEFORE_STEP: "before",
	ENTRY: "entry",
	AFTER_STEP: "after",
	RUNTIME: "runtime",
	VALIDATION: "validation",
});
