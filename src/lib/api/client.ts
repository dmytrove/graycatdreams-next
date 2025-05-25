import { AnimationOptions, UploadResponse, AnimationOptionsResponse } from '@/types';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage: string;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        console.error(`API Error: ${response.status} - ${errorMessage}`);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`API Success: ${options.method || 'GET'} ${url}`);
      return data;
    } catch (error) {
      console.error(`API Request Failed: ${url}`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Animation Options API
  async getAnimationOptions(sessionId: string): Promise<AnimationOptions> {
    const response = await this.request<AnimationOptionsResponse>(
      `/api/animation-options?session_id=${encodeURIComponent(sessionId)}`
    );
    return response.options;
  }

  async saveAnimationOptions(
    sessionId: string, 
    options: AnimationOptions
  ): Promise<void> {
    await this.request<{ success: boolean }>(
      `/api/animation-options?session_id=${encodeURIComponent(sessionId)}`,
      {
        method: 'POST',
        body: JSON.stringify({ options }),
      }
    );
  }

  // File Upload API
  async uploadFiles(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('file', file));

    console.log(`Uploading ${files.length} files`);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || 'Upload failed';
      } catch {
        errorMessage = `Upload failed with status ${response.status}`;
      }
      
      console.error('Upload Error:', errorMessage);
      throw new Error(errorMessage);
    }

    const data: UploadResponse = await response.json();
    console.log(`Successfully uploaded ${data.urls.length} files`);
    return data.urls;
  }

  // Image Management API
  async deleteImage(url: string): Promise<void> {
    console.log(`Deleting image: ${url}`);
    
    try {
      await this.request<{ success: boolean }>(
        `/api/delete-image?url=${encodeURIComponent(url)}`,
        { method: 'DELETE' }
      );
      console.log(`Successfully deleted image: ${url}`);
    } catch (error) {
      console.error(`Failed to delete image: ${url}`, error);
      throw error;
    }
  }

  async getUserImages(): Promise<string[]> {
    const response = await this.request<{ images: string[] }>('/api/user-images');
    return response.images;
  }

  // Animation Management API
  async deleteAnimation(sessionId: string): Promise<void> {
    console.log(`Deleting animation: ${sessionId}`);
    
    try {
      await this.request<{ success: boolean }>(
        `/api/delete-animation?session_id=${encodeURIComponent(sessionId)}`,
        { method: 'POST' }
      );
      console.log(`Successfully deleted animation: ${sessionId}`);
    } catch (error) {
      console.error(`Failed to delete animation: ${sessionId}`, error);
      throw error;
    }
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Export utility functions for convenience
export const api = {
  getAnimationOptions: (sessionId: string) => apiClient.getAnimationOptions(sessionId),
  saveAnimationOptions: (sessionId: string, options: AnimationOptions) => 
    apiClient.saveAnimationOptions(sessionId, options),
  uploadFiles: (files: File[]) => apiClient.uploadFiles(files),
  deleteImage: (url: string) => apiClient.deleteImage(url),
  getUserImages: () => apiClient.getUserImages(),
  deleteAnimation: (sessionId: string) => apiClient.deleteAnimation(sessionId),
};
