import { AnimationOptions, UploadResponse, AnimationOptionsResponse, AdminCredentials, AdminSessionOptions } from '@/types';

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
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage: string;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
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
  async uploadFiles(files: File[], customName?: string): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('file', file));
    
    // Add custom name if provided (for admin mode)
    if (customName) {
      formData.append('customName', customName);
    }
    
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
      
      throw new Error(errorMessage);
    }

    const data: UploadResponse = await response.json();
    return data.urls;
  }

  // Admin API
  async adminLogin(credentials: AdminCredentials, options?: AdminSessionOptions): Promise<{sessionId: string; isAdmin: boolean}> {
    try {
      const response = await this.request<{success: boolean; sessionId: string; isAdmin: boolean}>(
        '/api/admin/login',
        {
          method: 'POST',
          body: JSON.stringify({
            adminSecret: credentials.adminSecret,
            customId: options?.customId
          }),
        }
      );
      
      return {
        sessionId: response.sessionId,
        isAdmin: response.isAdmin
      };
    } catch (error) {
      throw error;
    }
  }
  
  async checkAdminStatus(): Promise<boolean> {
    try {
      const response = await this.request<{isAdmin: boolean}>('/api/admin/check');
      return response.isAdmin;
    } catch (error) {
      return false;
    }
  }
  
  // Custom animation name (admin only)
  async saveCustomAnimationName(sessionId: string, customName: string): Promise<void> {
    console.log(`Setting custom name for session ${sessionId}: ${customName}`);
    
    try {
      await this.request<{success: boolean}>(
        `/api/admin/custom-name`,
        {
          method: 'POST',
          body: JSON.stringify({
            sessionId,
            customName
          }),
        }
      );
      console.log('Successfully set custom name');
    } catch (error) {
      console.error('Failed to set custom name', error);
      throw error;
    }
  }

  // Upload files with admin credentials
  async uploadFilesWithAdmin(files: File[], adminSecret: string, customName?: string): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('file', file));
    
    if (customName) {
      formData.append('customName', customName);
    }

    console.log(`Admin uploading ${files.length} files${customName ? ' with custom name' : ''}`);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminSecret}`
      },
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
      
      console.error('Admin Upload Error:', errorMessage);
      throw new Error(errorMessage);
    }

    const data: UploadResponse = await response.json();
    console.log(`Successfully uploaded ${data.urls.length} files as admin`);
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
  uploadFiles: (files: File[], customName?: string) => apiClient.uploadFiles(files, customName),
  deleteImage: (url: string) => apiClient.deleteImage(url),
  getUserImages: () => apiClient.getUserImages(),
  deleteAnimation: (sessionId: string) => apiClient.deleteAnimation(sessionId),
  // Admin functions
  adminLogin: (credentials: AdminCredentials, options?: AdminSessionOptions) => 
    apiClient.adminLogin(credentials, options),
  checkAdminStatus: () => apiClient.checkAdminStatus(),
  saveCustomAnimationName: (sessionId: string, customName: string) => 
    apiClient.saveCustomAnimationName(sessionId, customName),
  uploadFilesWithAdmin: (files: File[], adminSecret: string, customName?: string) =>
    apiClient.uploadFilesWithAdmin(files, adminSecret, customName)
};
