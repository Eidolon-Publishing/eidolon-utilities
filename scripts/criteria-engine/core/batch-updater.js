/**
 * Generic chunked document updates.
 */
import { chunkArray } from "./utils.js";

export async function updateDocumentsInChunks(scene, documentType, updates, chunkSize) {
	const chunks = chunkArray(updates, chunkSize);
	for (const chunk of chunks) {
		await scene.updateEmbeddedDocuments(documentType, chunk);
		if (chunks.length > 1) {
			await Promise.resolve();
		}
	}

	return chunks.length;
}
