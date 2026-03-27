'use client';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useFirebaseApp } from '@/firebase/provider';

/**
 * A hook that provides a function to upload files to Firebase Storage.
 * @returns An object containing the `uploadFile` function.
 */
export function useFileUpload() {
    const app = useFirebaseApp();
    const storage = getStorage(app);

    /**
     * Uploads a file to a specified path in Firebase Storage.
     * @param path The full path in storage where the file should be saved (e.g., 'profile-pictures/user123.jpg').
     * @param file The file object to upload.
     * @returns A promise that resolves with the public download URL of the uploaded file.
     */
    const uploadFile = async (path: string, file: File): Promise<string> => {
        const storageRef = ref(storage, path);
        
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading file:", error);
            // In a real app, you might want to use a more robust error handling/logging solution
            throw new Error('O upload do ficheiro falhou.');
        }
    };

    return { uploadFile };
}

    